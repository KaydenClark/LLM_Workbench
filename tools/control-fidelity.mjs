#!/usr/bin/env node
// Control fidelity report (S-034): compare a room's hand-reconciled controls
// with the templates they derive from and say exactly which template lines the
// room filled, kept, dropped, or changed, and which room lines it added. It
// reports and never enforces: divergence is legitimate, silence is the defect.
// The tool reads the room and the release checkout; it never writes.
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { templatePlaceholders } from '../workbench/tools/template-placeholders.mjs';
import { LANES, isMainModule, isSafeRelative, readManifest } from '../workbench/tools/workbench-paths.mjs';

const productRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const templatedControls = ['AGENTS.md', 'BLUEPRINT.md', 'GLOSSARY.md', 'ARCHITECTURE.md', 'RUNBOOK.md', 'TASKBOARD.md', 'README.md'];
export const CLAUDE_CONTROL = '@AGENTS.md';
export const KINDS = ['filled', 'unchanged', 'dropped', 'changed', 'added'];
// S-004C TK-005M: given the room's earlier template generation, a difference
// the template made is labeled instead of passing as the room's own: a room
// line that only the earlier template carried (`earlier-template`), a current
// template line the earlier one did not carry (`newer-template`), and a room
// line kept from the earlier template where the template itself changed the
// line (`template-changed`).
export const GENERATIONS = ['earlier-template', 'newer-template', 'template-changed'];
// Two lines are the same line when their word tokens overlap at least this much.
const SIMILARITY_THRESHOLD = 0.5;
// Mirrors workbench-layout.mjs `wikiContractFiles` (S-00I TK-01U added the
// features collection README).
const wikiContractFiles = ['SCHEMA.md', 'AGENTS.md', 'design-concepts/README.md', 'features/README.md'];
const memoryTemplates = { project: 'MEMORY.project.md', deployment: 'MEMORY.root.md' };
// Beside the declared vocabulary, an all-uppercase bracket token or an
// `[OPTIONAL: ...]` note marks a line the room was expected to fill.
const genericPlaceholder = /\[(?:[A-Z][A-Z0-9_ /:.-]*|OPTIONAL:[^\]\n]*)\]/g;

function fail(code, message, details = {}) {
  return { status: 'invalid', error: { code, message, ...details } };
}

function words(text) {
  return text.toLowerCase().match(/[a-z0-9_]+/g) ?? [];
}

function normalize(line) {
  return line.trim().replace(/\s+/g, ' ');
}

export function placeholdersIn(line) {
  const found = new Set();
  for (const token of templatePlaceholders) if (line.includes(token)) found.add(token);
  for (const match of line.matchAll(genericPlaceholder)) found.add(match[0]);
  return [...found];
}

// The fixed text of a placeholder line: the segments between its placeholders.
function fixedSegments(line, placeholders) {
  let rest = line;
  const segments = [];
  const ordered = [...placeholders].sort((a, b) => line.indexOf(a) - line.indexOf(b));
  for (const token of ordered) {
    const at = rest.indexOf(token);
    if (at < 0) continue;
    segments.push(rest.slice(0, at));
    rest = rest.slice(at + token.length);
  }
  segments.push(rest);
  return segments.map((segment) => normalize(segment)).filter(Boolean);
}

function describe(rawLines) {
  return rawLines.map((raw, index) => {
    const text = normalize(raw);
    const placeholders = placeholdersIn(raw);
    const fixed = placeholders.length ? fixedSegments(raw, placeholders) : [];
    const tokens = placeholders.length ? words(fixed.join(' ')) : words(text);
    return {
      index,
      raw,
      text,
      placeholders,
      fixed,
      tokens,
      // A line with no word token (blank, rule, table separator) is trivial.
      trivial: words(text).length === 0,
      // A placeholder line whose fixed text carries a real word can be found by
      // that text; one that is all placeholder is matched by shape only.
      strong: placeholders.length > 0 && tokens.some((token) => token.length >= 3)
    };
  });
}

function fixedTextPresent(templateLine, roomLine) {
  let from = 0;
  for (const segment of templateLine.fixed) {
    const at = roomLine.text.indexOf(segment, from);
    if (at < 0) return false;
    from = at + segment.length;
  }
  return true;
}

function similarity(a, b) {
  if (!a.tokens.length || !b.tokens.length) return 0;
  const counts = new Map();
  for (const token of a.tokens) counts.set(token, (counts.get(token) ?? 0) + 1);
  let shared = 0;
  for (const token of b.tokens) {
    const left = counts.get(token) ?? 0;
    if (left > 0) { shared += 1; counts.set(token, left - 1); }
  }
  return (2 * shared) / (a.tokens.length + b.tokens.length);
}

// Anchor weight: an exact line or a placeholder line found by its fixed text.
// Trivial lines anchor weakly so a blank never outranks content alignment.
function anchorWeight(templateLine, roomLine) {
  if (templateLine.text === roomLine.text) return templateLine.trivial ? 0.001 : 1;
  if (templateLine.strong && !roomLine.trivial && fixedTextPresent(templateLine, roomLine)) return 1;
  return 0;
}

// Maximum-weight common subsequence: the ordered anchors both files share.
function anchors(template, room) {
  const n = template.length;
  const m = room.length;
  const width = m + 1;
  const best = new Float64Array((n + 1) * width);
  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      const weight = anchorWeight(template[i], room[j]);
      const diagonal = weight > 0 ? weight + best[(i + 1) * width + j + 1] : -1;
      best[i * width + j] = Math.max(best[(i + 1) * width + j], best[i * width + j + 1], diagonal);
    }
  }
  const pairs = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    const weight = anchorWeight(template[i], room[j]);
    if (weight > 0 && weight + best[(i + 1) * width + j + 1] >= best[i * width + j]) {
      pairs.push([i, j]);
      i += 1;
      j += 1;
    } else if (best[(i + 1) * width + j] >= best[i * width + j + 1]) i += 1;
    else j += 1;
  }
  return pairs;
}

function entry(kind, templateLine, roomLine, extra = {}) {
  const record = { kind };
  if (templateLine) {
    record.templateLine = templateLine.index + 1;
    record.template = templateLine.raw;
    if (templateLine.placeholders.length) record.placeholder = templateLine.placeholders;
  }
  if (roomLine) {
    record.roomLine = roomLine.index + 1;
    record.room = roomLine.raw;
  }
  record.trivial = (templateLine ?? roomLine).trivial;
  return { ...record, ...extra };
}

// Classify one unanchored stretch of template lines against the unanchored
// room lines between the same two anchors.
function classifyGap(template, room, lines) {
  const roomTaken = new Set();
  const templateTaken = new Set();
  const claim = (kind, templateLine, roomLine, extra) => {
    templateTaken.add(templateLine.index);
    roomTaken.add(roomLine.index);
    lines.push(entry(kind, templateLine, roomLine, extra));
  };
  // 1. Nearest similarity: the room altered the line.
  const candidates = [];
  for (const templateLine of template) {
    if (templateLine.trivial || !templateLine.tokens.length) continue;
    for (const roomLine of room) {
      if (roomLine.trivial) continue;
      const score = similarity(templateLine, roomLine);
      if (score >= SIMILARITY_THRESHOLD) candidates.push({ templateLine, roomLine, score, distance: Math.abs(templateLine.index - roomLine.index) });
    }
  }
  candidates.sort((a, b) => b.score - a.score || a.distance - b.distance || a.templateLine.index - b.templateLine.index);
  for (const { templateLine, roomLine, score } of candidates) {
    if (templateTaken.has(templateLine.index) || roomTaken.has(roomLine.index)) continue;
    if (templateLine.placeholders.length && fixedTextPresent(templateLine, roomLine)) claim('filled', templateLine, roomLine, { similarity: Number(score.toFixed(3)) });
    else claim('changed', templateLine, roomLine, { similarity: Number(score.toFixed(3)) });
  }
  // 2. Placeholder lines matched by shape: the room filled them in order.
  let cursor = 0;
  for (const templateLine of template) {
    if (templateTaken.has(templateLine.index) || !templateLine.placeholders.length) continue;
    const roomLine = room.find((candidate, position) => position >= cursor && !roomTaken.has(candidate.index) && !candidate.trivial && fixedTextPresent(templateLine, candidate));
    if (!roomLine) continue;
    cursor = room.indexOf(roomLine) + 1;
    claim('filled', templateLine, roomLine);
  }
  // 3. Trivial lines that still have an identical partner are unchanged.
  for (const templateLine of template) {
    if (templateTaken.has(templateLine.index) || !templateLine.trivial) continue;
    const roomLine = room.find((candidate) => !roomTaken.has(candidate.index) && candidate.text === templateLine.text);
    if (roomLine) claim('unchanged', templateLine, roomLine);
  }
  // 4. Whatever is left has no partner.
  for (const templateLine of template) if (!templateTaken.has(templateLine.index)) lines.push(entry('dropped', templateLine, null));
  for (const roomLine of room) if (!roomTaken.has(roomLine.index)) lines.push(entry('added', null, roomLine));
}

function splitLines(content) {
  const lines = content.replace(/\r\n?/g, '\n').split('\n');
  if (lines.length > 1 && lines.at(-1) === '') lines.pop();
  return lines;
}

// Classify every template line and every room line of one control.
export function classifyLines(templateContent, roomContent) {
  const template = describe(splitLines(templateContent));
  const room = describe(splitLines(roomContent));
  const lines = [];
  let templateFrom = 0;
  let roomFrom = 0;
  for (const [i, j] of [...anchors(template, room), [template.length, room.length]]) {
    classifyGap(template.slice(templateFrom, i), room.slice(roomFrom, j), lines);
    if (i < template.length && j < room.length) {
      const kind = template[i].text === room[j].text ? 'unchanged' : 'filled';
      lines.push(entry(kind, template[i], room[j]));
    }
    templateFrom = i + 1;
    roomFrom = j + 1;
  }
  lines.sort((a, b) => (a.templateLine ?? a.roomLine) - (b.templateLine ?? b.roomLine) || (a.roomLine ?? 0) - (b.roomLine ?? 0));
  const counts = Object.fromEntries(KINDS.map((kind) => [kind, lines.filter((line) => line.kind === kind).length]));
  return { counts, lines };
}

function readOrdinary(file) {
  let stat;
  try { stat = fs.statSync(file); } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
  if (!stat.isFile()) return null;
  return fs.readFileSync(file, 'utf8');
}

function parseVersion(value) {
  const match = /^v?(\d+)\.(\d+)\.(\d+)$/.exec(value ?? '');
  return match ? match.slice(1).map(Number) : null;
}

function compareVersions(checkoutVersion, manifestRelease) {
  const checkout = parseVersion(checkoutVersion);
  const manifest = parseVersion(manifestRelease);
  if (!checkout || !manifest) return 'unknown';
  for (let index = 0; index < 3; index += 1) {
    if (checkout[index] > manifest[index]) return 'newer';
    if (checkout[index] < manifest[index]) return 'older';
  }
  return 'same';
}

function versionNote(checkoutVersion, manifestRelease) {
  const relation = compareVersions(checkoutVersion, manifestRelease);
  const checkout = checkoutVersion ?? 'unknown';
  const manifest = manifestRelease ?? 'unknown';
  if (relation === 'same') return `The checkout (${checkout}) and the room's manifest release (${manifest}) are the same template generation.`;
  if (relation === 'unknown') return `The checkout version (${checkout}) or the room's manifest release (${manifest}) is unknown; the comparison may be against a different template generation.`;
  return `The checkout (${checkout}) is ${relation} than the room's manifest release (${manifest}): the comparison is against a ${relation} template generation, so some differences may be upstream template changes rather than room divergence.`;
}

// The manifest may declare the wiki lane, but only a safe lowercase relative
// path under `workbench/` is ever joined to the project; anything else is
// named in a note and the default lane is used instead.
export function wikiLaneOf(manifest) {
  const declared = manifest?.lanes?.wiki;
  if (declared === undefined) return { lane: LANES.wiki, note: null };
  if (isSafeRelative(declared)) return { lane: declared, note: null };
  return { lane: LANES.wiki, note: `manifest lane wiki is unsafe: ${JSON.stringify(declared)}; the wiki files were compared under the default lane ${LANES.wiki}.` };
}

// The files a room derives from templates: the seven root controls, the
// optional Claude permission file, and the seeded wiki contract files.
export function fidelityTargets(project, manifest) {
  const wikiLane = wikiLaneOf(manifest).lane;
  const profile = manifest?.wiki?.profile;
  const targets = templatedControls.map((control) => ({ control, template: control, optional: false }));
  targets.push({ control: 'CLAUDE.md', template: null, optional: false });
  targets.push({ control: '.claude/settings.json', template: '.claude/settings.json', optional: true });
  for (const relative of wikiContractFiles) targets.push({ control: `${wikiLane}/${relative}`, template: `wiki/${relative}`, optional: true });
  targets.push({ control: `${wikiLane}/MEMORY.md`, template: `wiki/${memoryTemplates[profile] ?? memoryTemplates.project}`, optional: true });
  return targets;
}

// The room's earlier template generation: a templates directory named with
// --previous-templates, or the templates at the room manifest's recorded
// source commit when this checkout holds that commit. Null when neither.
function previousGeneration(options, manifest) {
  if (options.previousTemplates) {
    const directory = path.resolve(options.previousTemplates);
    if (!fs.existsSync(directory) || !fs.statSync(directory).isDirectory()) return { error: fail('invalid-previous-templates', `${directory} must be a templates directory.`) };
    return { source: 'option', path: directory, read: (relative) => readOrdinary(path.join(directory, relative)) };
  }
  const commit = manifest?.provenance?.source?.commit;
  if (typeof commit !== 'string' || !/^[0-9a-f]{40}$/.test(commit)) return null;
  const present = spawnSync('git', ['cat-file', '-e', `${commit}^{tree}`], { cwd: productRoot, encoding: 'utf8' });
  if (present.status !== 0) return null;
  return {
    source: 'provenance',
    ref: commit,
    read: (relative) => {
      const shown = spawnSync('git', ['show', `${commit}:templates/${relative}`], { cwd: productRoot, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
      return shown.status === 0 ? shown.stdout : null;
    }
  };
}

function labelGenerations(result, previousContent, templateContent, roomContent) {
  const kept = ['unchanged', 'filled'];
  const roomLines = classifyLines(previousContent, roomContent).lines;
  const roomAgainstPrevious = new Map(roomLines.filter((line) => line.roomLine !== undefined).map((line) => [line.roomLine, line.kind]));
  // The earlier template lines the room still holds as shipped (or filled).
  const previousKept = new Set(roomLines.filter((line) => line.templateLine !== undefined && kept.includes(line.kind)).map((line) => line.templateLine));
  const templateLines = classifyLines(previousContent, templateContent).lines.filter((line) => line.roomLine !== undefined);
  const templateAgainstPrevious = new Map(templateLines.map((line) => [line.roomLine, line.kind]));
  const earlierVersion = new Map(templateLines.filter((line) => line.kind === 'changed').map((line) => [line.roomLine, line.templateLine]));
  for (const line of result.lines) {
    if (line.trivial) continue;
    const templateKind = templateAgainstPrevious.get(line.templateLine);
    // Only a line the room kept as the earlier template shipped it (or filled
    // it) is the template's; a line the room rewrote stays the room's own.
    if (line.kind === 'added' && kept.includes(roomAgainstPrevious.get(line.roomLine))) line.generation = 'earlier-template';
    // Template against template, a `filled` pairing means an earlier
    // all-placeholder line was matched by shape to new text: a new line.
    else if (line.kind === 'dropped' && ['added', 'filled'].includes(templateKind)) line.generation = 'newer-template';
    // The template rewrote this line and the room still holds the earlier version.
    else if (line.kind === 'dropped' && templateKind === 'changed' && previousKept.has(earlierVersion.get(line.templateLine))) line.generation = 'template-changed';
    else if (line.kind === 'changed' && kept.includes(roomAgainstPrevious.get(line.roomLine)) && ['changed', 'added', 'filled'].includes(templateKind)) line.generation = 'template-changed';
  }
  result.generationCounts = Object.fromEntries(GENERATIONS.map((generation) => [generation, result.lines.filter((line) => line.generation === generation).length]));
  return result;
}

function compareTarget(project, templates, target, previous = null) {
  const base = { control: target.control, template: target.template ?? CLAUDE_CONTROL, optional: target.optional };
  const roomContent = readOrdinary(path.join(project, target.control));
  if (roomContent === null) {
    return { ...base, status: target.optional ? 'absent' : 'missing', counts: Object.fromEntries(KINDS.map((kind) => [kind, 0])), lines: [], note: `${target.control} is not an ordinary file in the room.` };
  }
  if (target.control === 'CLAUDE.md') {
    const exact = roomContent.trim() === CLAUDE_CONTROL;
    return { ...base, status: exact ? 'exact' : 'mismatch', ...classifyLines(`${CLAUDE_CONTROL}\n`, roomContent), note: exact ? 'CLAUDE.md is exactly `@AGENTS.md`.' : 'CLAUDE.md is not exactly `@AGENTS.md`.' };
  }
  const templateContent = readOrdinary(path.join(templates, target.template));
  if (templateContent === null) {
    return { ...base, status: 'template-missing', counts: Object.fromEntries(KINDS.map((kind) => [kind, 0])), lines: [], note: `${target.template} is not an ordinary file under ${templates}.` };
  }
  const result = { ...base, status: 'compared', ...classifyLines(templateContent, roomContent) };
  const previousContent = previous ? previous.read(target.template) : null;
  return previousContent === null ? result : labelGenerations(result, previousContent, templateContent, roomContent);
}

function excerpt(line) {
  const text = normalize(line);
  return text.length > 120 ? `${text.slice(0, 117)}...` : text;
}

// The headline counts the lines the list below itemizes; blank lines and
// table separators are named separately so the numbers reconcile.
function headlineCounts(control) {
  return KINDS.map((kind) => {
    const trivial = control.lines.filter((line) => line.kind === kind && line.trivial).length;
    const count = control.counts[kind];
    if (!['dropped', 'changed', 'added'].includes(kind) || !trivial) return `${kind} ${count}`;
    return `${kind} ${count - trivial} (${trivial} trivial)`;
  }).join(', ');
}

export function summarizeMarkdown(report) {
  const out = ['# Control fidelity report', ''];
  out.push(`Project: \`${report.project}\`. Templates: \`${report.templates}\` (checkout ${report.checkoutVersion ?? 'unknown'}). Room manifest release: ${report.manifestRelease ?? 'unknown'}${report.sourceRelease ? ` (adopted from ${report.sourceRelease})` : ''}.`);
  out.push('', report.versionNote, '');
  if (report.previousTemplates) out.push(`Earlier template generation: ${report.previousTemplates.source === 'option' ? `\`${report.previousTemplates.path}\`` : `templates at source commit ${report.previousTemplates.ref}`}. A line labeled a generation difference is the template's change, not the room's; reconcile it to the current shape.`, '');
  for (const control of report.controls) {
    out.push(`## ${control.control}`, '');
    if (control.status === 'absent') { out.push(`Optional; not present in the room.`, ''); continue; }
    if (control.status === 'missing' || control.status === 'template-missing') { out.push(`${control.status}: ${control.note}`, ''); continue; }
    const generations = control.generationCounts ? Object.values(control.generationCounts).reduce((sum, count) => sum + count, 0) : 0;
    out.push(`Template \`${control.template}\` (${control.status}): ${headlineCounts(control)}${control.generationCounts ? `; generation differences ${generations}` : ''}.`, '');
    const notable = control.lines.filter((line) => !line.trivial && ['dropped', 'changed', 'added'].includes(line.kind));
    for (const line of notable) {
      const label = line.generation ? ` (generation difference: ${line.generation})` : '';
      if (line.kind === 'changed') out.push(`- changed${label} L${line.templateLine} -> L${line.roomLine}: \`${excerpt(line.template)}\` -> \`${excerpt(line.room)}\``);
      else if (line.kind === 'dropped') out.push(`- dropped${label} L${line.templateLine}: \`${excerpt(line.template)}\``);
      else out.push(`- added${label} L${line.roomLine}: \`${excerpt(line.room)}\``);
    }
    if (notable.length) out.push('');
  }
  return `${out.join('\n').trimEnd()}\n`;
}

export function reportFidelity(options) {
  const project = path.resolve(options.project);
  const templates = path.resolve(options.templates ?? path.join(productRoot, 'templates'));
  const projectStat = fs.existsSync(project) ? fs.statSync(project) : null;
  if (!projectStat?.isDirectory()) return fail('invalid-project', `${project} must be an existing project directory.`);
  if (!fs.existsSync(templates) || !fs.statSync(templates).isDirectory()) return fail('invalid-templates', `${templates} must be a templates directory.`);
  let manifest = null;
  let manifestNote = null;
  try { manifest = readManifest(project); } catch (error) { manifestNote = error.message; }
  const laneNote = wikiLaneOf(manifest).note;
  if (laneNote) manifestNote = manifestNote ? `${manifestNote} ${laneNote}` : laneNote;
  const productManifest = readManifest(productRoot);
  const checkoutVersion = options.checkoutVersion ?? productManifest?.workbenchVersion ?? null;
  const manifestRelease = options.manifestRelease ?? manifest?.workbenchVersion ?? null;
  const sourceRelease = manifest?.provenance?.source?.release ?? null;
  const previous = previousGeneration(options, manifest);
  if (previous?.error) return previous.error;
  let targets = fidelityTargets(project, manifest);
  if (options.control) {
    targets = targets.filter((target) => target.control === options.control);
    if (!targets.length) return fail('invalid-control', `${options.control} is not a template-derived control; choose one of ${fidelityTargets(project, manifest).map((target) => target.control).join(', ')}.`);
  }
  const report = {
    status: 'reported',
    project,
    templates,
    checkoutVersion,
    manifestRelease,
    sourceRelease,
    versionMatch: compareVersions(checkoutVersion, manifestRelease) === 'same',
    versionNote: versionNote(checkoutVersion, manifestRelease),
    manifestNote,
    previousTemplates: previous ? (previous.source === 'option' ? { source: 'option', path: previous.path } : { source: 'provenance', ref: previous.ref }) : null,
    controls: targets.map((target) => compareTarget(project, templates, target, previous))
  };
  report.markdown = summarizeMarkdown(report);
  return report;
}

function parseOptions(args) {
  const options = {};
  for (let index = 0; index < args.length; index += 2) {
    const key = args[index];
    const value = args[index + 1];
    if (!key?.startsWith('--') || !value || value.startsWith('--') || options[key]) throw new Error(`Invalid arguments: ${key} needs a value.`);
    options[key] = value;
  }
  if (!options['--project']) throw new Error('Missing --project.');
  if (options['--format'] && !['json', 'markdown'].includes(options['--format'])) throw new Error('--format must be json or markdown.');
  return options;
}

const usage = 'Usage: control-fidelity.mjs report --project PATH [--control NAME] [--templates PATH] [--previous-templates PATH] [--format json|markdown]';

if (isMainModule(import.meta.url)) {
  process.stdout.on('error', (error) => {
    if (error.code === 'EPIPE') process.exit(0);
    throw error;
  });
  try {
    const [command, ...args] = process.argv.slice(2);
    if (command !== 'report') throw new Error(usage);
    const options = parseOptions(args);
    const report = reportFidelity({ project: options['--project'], control: options['--control'], templates: options['--templates'], previousTemplates: options['--previous-templates'] });
    if (report.status !== 'reported') {
      process.stdout.write(`${JSON.stringify(report)}\n`);
      process.exitCode = 1;
    } else if (options['--format'] === 'markdown') process.stdout.write(report.markdown);
    else process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  } catch (error) {
    process.stdout.write(`${JSON.stringify(fail('invalid-invocation', error.message))}\n`);
    process.exitCode = 1;
  }
}

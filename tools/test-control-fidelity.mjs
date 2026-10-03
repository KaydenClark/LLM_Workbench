#!/usr/bin/env node
// S-034: the control fidelity report classifies every template line of a
// room's controls as filled, unchanged, dropped, or changed, every extra room
// line as added, labels a checkout-versus-manifest version mismatch, and never
// changes the exit code or the room on divergence.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { describe, registeredCodes } from '../workbench/tools/diagnostics.mjs';
import { templatePlaceholders } from '../workbench/tools/template-placeholders.mjs';
import { classifyLines, reportFidelity, summarizeMarkdown } from './control-fidelity.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tool = path.join(root, 'tools', 'control-fidelity.mjs');
const productTemplates = path.join(root, 'templates');
const VERSION = JSON.parse(fs.readFileSync(path.join(root, 'workbench', 'manifest.json'), 'utf8')).workbenchVersion;
const controls = ['AGENTS.md', 'BLUEPRINT.md', 'LEXICON.md', 'RUNBOOK.md', 'TASKBOARD.md', 'README.md'];
// The upstream finding (fix list UP-008): a room dropped this qualifier from
// the ADR ownership row shipped by templates/AGENTS.md.
const adrRow = '| active architectural decisions, rationale, alternatives, supersession | `workbench/docs/adr/` (`canonicalized_in` names operational owners) |';
const adrRowWithoutQualifier = '| active architectural decisions, rationale, alternatives, supersession | `workbench/docs/adr/` |';

function fixture(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function write(base, relative, content) {
  const target = path.join(base, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function read(base, relative) {
  return fs.readFileSync(path.join(base, relative), 'utf8');
}

function fill(content) {
  let filled = content;
  for (const placeholder of templatePlaceholders) filled = filled.replaceAll(placeholder, `filled ${placeholder.slice(1, -1).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()}`);
  return filled.replace(/\[[A-Z][A-Z0-9_ /:.-]*\]/g, 'filled value');
}

function manifest(version, profile = 'project') {
  return `${JSON.stringify({ schemaVersion: 2, workbenchVersion: version, provenance: { lifecycle: 'adoption', source: { release: version } }, lanes: { wiki: 'workbench/wiki' }, wiki: { profile } }, null, 2)}\n`;
}

// A disposable copy of the shipping templates.
function fixtureTemplates() {
  const templates = fixture('control-fidelity-templates-');
  fs.cpSync(productTemplates, templates, { recursive: true });
  assert.ok(read(templates, 'AGENTS.md').includes(adrRow), 'templates/AGENTS.md must ship the ADR ownership row under test');
  return templates;
}

// A room whose controls are the fixture templates with every placeholder filled.
function fixtureRoom(templates, version = VERSION) {
  const project = fixture('control-fidelity-room-');
  for (const control of controls) write(project, control, fill(read(templates, control)));
  write(project, 'CLAUDE.md', '@AGENTS.md\n');
  write(project, 'workbench/manifest.json', manifest(version));
  return project;
}

function control(report, name) {
  const entry = report.controls.find((item) => item.control === name);
  assert.ok(entry, `${name} must be reported`);
  return entry;
}

function kinds(entry, kind) {
  return entry.lines.filter((line) => line.kind === kind);
}

function snapshot(directory) {
  const entries = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true, recursive: true })) {
    const target = path.join(entry.parentPath ?? entry.path, entry.name);
    if (!entry.isFile()) continue;
    entries.push(`${path.relative(directory, target)}:${crypto.createHash('sha256').update(fs.readFileSync(target)).digest('hex')}`);
  }
  return entries.sort().join('\n');
}

test('a filled room reports filled and unchanged lines only, with every placeholder line filled', () => {
  const templates = fixtureTemplates();
  const project = fixtureRoom(templates);
  const report = reportFidelity({ project, templates, manifestRelease: VERSION, checkoutVersion: VERSION });
  assert.equal(report.status, 'reported');
  for (const name of controls) {
    const entry = control(report, name);
    assert.equal(entry.status, 'compared', `${name} must be compared`);
    assert.equal(entry.counts.dropped, 0, `${name} must drop nothing when only placeholders were filled`);
    assert.equal(entry.counts.changed, 0, `${name} must change nothing when only placeholders were filled`);
    assert.equal(entry.counts.added, 0, `${name} must add nothing when only placeholders were filled`);
    assert.ok(entry.counts.filled > 0, `${name} must report filled placeholder lines`);
    const templateLines = read(templates, name).replace(/\n$/, '').split('\n').length;
    assert.equal(entry.counts.filled + entry.counts.unchanged, templateLines, `${name}: every template line is classified exactly once`);
    for (const line of entry.lines) {
      if (line.kind === 'filled') assert.ok(line.placeholder, `${name} L${line.templateLine}: filled lines carry a placeholder`);
      if (line.kind === 'unchanged') assert.equal(line.template, line.room);
    }
  }
  assert.equal(control(report, 'CLAUDE.md').status, 'exact');
  assert.equal(report.versionMatch, true);
});

test('a dropped qualifier is one changed entry naming the ADR ownership row and no dropped entry', () => {
  const templates = fixtureTemplates();
  const project = fixtureRoom(templates);
  const agents = read(project, 'AGENTS.md');
  assert.ok(agents.includes(adrRow), 'the filled room must carry the ADR ownership row before it is altered');
  write(project, 'AGENTS.md', agents.replace(adrRow, adrRowWithoutQualifier));
  const entry = control(reportFidelity({ project, templates, manifestRelease: VERSION, checkoutVersion: VERSION }), 'AGENTS.md');
  assert.equal(entry.counts.dropped, 0);
  assert.equal(entry.counts.added, 0);
  assert.equal(entry.counts.changed, 1);
  const [changed] = kinds(entry, 'changed');
  assert.equal(changed.template, adrRow);
  assert.equal(changed.room, adrRowWithoutQualifier);
  assert.ok(changed.template.includes('canonicalized_in'), 'the changed entry names the line that lost the qualifier');
  assert.ok(Number.isInteger(changed.templateLine) && Number.isInteger(changed.roomLine));
  const summary = summarizeMarkdown(reportFidelity({ project, templates, manifestRelease: VERSION, checkoutVersion: VERSION }));
  assert.match(summary, /## AGENTS\.md/);
  assert.match(summary, /changed 1/);
  assert.match(summary, /canonicalized_in/);
});

test('a placeholder fill is changed when it reverses the fixed wording', () => {
  const template = 'Forbidden without explicit approval: [SECRETS_OR_PRIVATE_PATHS]\n';
  const room = 'Allowed without explicit approval: secrets/\n';
  const result = classifyLines(template, room);
  assert.equal(result.counts.filled, 0);
  assert.equal(result.counts.changed, 1);
  assert.equal(result.lines[0].kind, 'changed');
  assert.equal(result.lines[0].template, template.trim());
  assert.equal(result.lines[0].room, room.trim());
});

test('a deleted Branch Completion paragraph produces dropped entries for each of its lines', () => {
  const templates = fixtureTemplates();
  const project = fixtureRoom(templates);
  const agents = read(project, 'AGENTS.md');
  const start = agents.indexOf('### Branch Completion');
  const end = agents.indexOf('\n## ', start);
  assert.ok(start > 0 && end > start, 'the filled AGENTS.md must carry a Branch Completion section followed by another section');
  const removed = agents.slice(start, end + 1);
  const removedLines = removed.split('\n').filter((line) => /[A-Za-z0-9]/.test(line));
  assert.ok(removedLines.length >= 4, 'the removed section holds several content lines');
  write(project, 'AGENTS.md', agents.slice(0, start) + agents.slice(end + 1));
  const entry = control(reportFidelity({ project, templates, manifestRelease: VERSION, checkoutVersion: VERSION }), 'AGENTS.md');
  assert.equal(entry.counts.changed, 0);
  assert.equal(entry.counts.added, 0);
  const dropped = kinds(entry, 'dropped').filter((line) => !line.trivial).map((line) => line.template);
  assert.deepEqual(dropped, removedLines.map((line) => line.trim()));
});

test('room lines with no template origin are added, and a missing control is reported rather than thrown', () => {
  const templates = fixtureTemplates();
  const project = fixtureRoom(templates);
  write(project, 'RUNBOOK.md', `${read(project, 'RUNBOOK.md')}\n## Project Rituals\n\nRun the nightly export before release.\n`);
  fs.unlinkSync(path.join(project, 'TASKBOARD.md'));
  const report = reportFidelity({ project, templates, manifestRelease: VERSION, checkoutVersion: VERSION });
  const runbook = control(report, 'RUNBOOK.md');
  assert.deepEqual(kinds(runbook, 'added').filter((line) => !line.trivial).map((line) => line.room), ['## Project Rituals', 'Run the nightly export before release.']);
  assert.equal(runbook.counts.dropped, 0);
  assert.equal(control(report, 'TASKBOARD.md').status, 'missing');
});

test('CLAUDE.md is checked for exact equality with @AGENTS.md', () => {
  const templates = fixtureTemplates();
  const project = fixtureRoom(templates);
  write(project, 'CLAUDE.md', '@AGENTS.md\n\nAlways run the linter.\n');
  const entry = control(reportFidelity({ project, templates, manifestRelease: VERSION, checkoutVersion: VERSION }), 'CLAUDE.md');
  assert.equal(entry.status, 'mismatch');
  assert.deepEqual(kinds(entry, 'added').filter((line) => !line.trivial).map((line) => line.room), ['Always run the linter.']);
  assert.equal(entry.counts.unchanged, 1);
});

test('optional permission and wiki files are compared when present and reported absent otherwise', () => {
  const templates = fixtureTemplates();
  const project = fixtureRoom(templates);
  let report = reportFidelity({ project, templates, manifestRelease: VERSION, checkoutVersion: VERSION });
  for (const name of ['.claude/settings.json', 'workbench/wiki/SCHEMA.md', 'workbench/wiki/AGENTS.md', 'workbench/wiki/design-concepts/README.md', 'workbench/wiki/features/README.md', 'workbench/wiki/MEMORY.md']) {
    const entry = control(report, name);
    assert.equal(entry.status, 'absent', `${name} is optional`);
    assert.equal(entry.optional, true);
  }
  const settings = JSON.parse(fill(read(templates, '.claude/settings.json')));
  settings.permissions.deny = settings.permissions.deny.filter((rule) => rule !== 'Read(./secrets/**)');
  write(project, '.claude/settings.json', `${JSON.stringify(settings, null, 2)}\n`);
  write(project, 'workbench/wiki/SCHEMA.md', fill(read(templates, 'wiki/SCHEMA.md')));
  write(project, 'workbench/wiki/MEMORY.md', fill(read(templates, 'wiki/MEMORY.project.md')));
  report = reportFidelity({ project, templates, manifestRelease: VERSION, checkoutVersion: VERSION });
  const permissions = control(report, '.claude/settings.json');
  assert.equal(permissions.status, 'compared');
  assert.deepEqual(kinds(permissions, 'dropped').map((line) => line.template.trim()), ['"Read(./secrets/**)",']);
  assert.equal(control(report, 'workbench/wiki/SCHEMA.md').counts.dropped, 0);
  const memory = control(report, 'workbench/wiki/MEMORY.md');
  assert.equal(memory.template, 'wiki/MEMORY.project.md');
  assert.equal(memory.counts.dropped, 0);
  assert.equal(memory.counts.changed, 0);
});

test('CRLF room controls compare line by line', () => {
  const templates = fixtureTemplates();
  const project = fixtureRoom(templates);
  write(project, 'LEXICON.md', read(project, 'LEXICON.md').replaceAll('\n', '\r\n'));
  const entry = control(reportFidelity({ project, templates, manifestRelease: VERSION, checkoutVersion: VERSION }), 'LEXICON.md');
  assert.equal(entry.counts.dropped, 0);
  assert.equal(entry.counts.changed, 0);
  assert.equal(entry.counts.added, 0);
});

test('a checkout-versus-manifest mismatch is labeled as a newer or older template generation', () => {
  const templates = fixtureTemplates();
  const project = fixtureRoom(templates, 'v3.1.0');
  const newer = reportFidelity({ project, templates, manifestRelease: 'v3.1.0', checkoutVersion: 'v3.1.1' });
  assert.equal(newer.checkoutVersion, 'v3.1.1');
  assert.equal(newer.manifestRelease, 'v3.1.0');
  assert.equal(newer.versionMatch, false);
  assert.match(newer.versionNote, /newer/);
  assert.match(summarizeMarkdown(newer), /v3\.1\.1/);
  assert.match(summarizeMarkdown(newer), /newer/);
  const older = reportFidelity({ project, templates, manifestRelease: 'v3.2.0', checkoutVersion: 'v3.1.1' });
  assert.equal(older.versionMatch, false);
  assert.match(older.versionNote, /older/);
  const same = reportFidelity({ project, templates, manifestRelease: 'v3.1.0', checkoutVersion: 'v3.1.0' });
  assert.equal(same.versionMatch, true);
  assert.match(same.versionNote, /same/);
  const defaults = reportFidelity({ project, templates });
  assert.equal(defaults.manifestRelease, 'v3.1.0', 'the manifest release defaults to the room manifest');
  assert.equal(defaults.checkoutVersion, VERSION, 'the checkout version defaults to this release');
});

test('the CLI reports divergence with exit 0, filters by control, never writes to the room, and fails only on invocation errors', () => {
  const templates = fixtureTemplates();
  const project = fixtureRoom(templates, 'v3.1.0');
  write(project, 'AGENTS.md', read(project, 'AGENTS.md').replace(adrRow, adrRowWithoutQualifier));
  const before = snapshot(project);
  const result = spawnSync(process.execPath, [tool, 'report', '--project', project, '--templates', templates], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.status, 'reported');
  assert.equal(report.versionMatch, false);
  assert.equal(control(report, 'AGENTS.md').counts.changed, 1);
  assert.ok(report.controls.length > 7);
  assert.match(report.markdown, /## AGENTS\.md/);
  assert.equal(snapshot(project), before, 'the report never writes to the room');
  assert.equal(fs.readdirSync(project).some((name) => name.startsWith('.write-')), false);

  const filtered = spawnSync(process.execPath, [tool, 'report', '--project', project, '--templates', templates, '--control', 'AGENTS.md'], { cwd: root, encoding: 'utf8' });
  assert.equal(filtered.status, 0, filtered.stdout + filtered.stderr);
  assert.deepEqual(JSON.parse(filtered.stdout).controls.map((entry) => entry.control), ['AGENTS.md']);

  const markdown = spawnSync(process.execPath, [tool, 'report', '--project', project, '--templates', templates, '--format', 'markdown'], { cwd: root, encoding: 'utf8' });
  assert.equal(markdown.status, 0);
  assert.match(markdown.stdout, /^# Control fidelity report/m);
  assert.match(markdown.stdout, /canonicalized_in/);

  const unknownControl = spawnSync(process.execPath, [tool, 'report', '--project', project, '--templates', templates, '--control', 'NOPE.md'], { cwd: root, encoding: 'utf8' });
  assert.equal(unknownControl.status, 1);
  assert.equal(JSON.parse(unknownControl.stdout).status, 'invalid');

  const missingProject = spawnSync(process.execPath, [tool, 'report'], { cwd: root, encoding: 'utf8' });
  assert.equal(missingProject.status, 1);
  assert.equal(JSON.parse(missingProject.stdout).error.code, 'invalid-invocation');

  const noSuchProject = spawnSync(process.execPath, [tool, 'report', '--project', path.join(project, 'nowhere')], { cwd: root, encoding: 'utf8' });
  assert.equal(noSuchProject.status, 1);
  assert.equal(JSON.parse(noSuchProject.stdout).error.code, 'invalid-project');
});

test('the product checkout reports against its own templates without throwing', () => {
  const report = reportFidelity({ project: root });
  assert.equal(report.status, 'reported');
  assert.equal(report.templates, productTemplates);
  // This dogfood room keeps Claude-specific notes around `@AGENTS.md`, so it
  // is reported truthfully rather than assumed exact.
  assert.ok(['exact', 'mismatch'].includes(control(report, 'CLAUDE.md').status));
  assert.equal(control(report, 'AGENTS.md').status, 'compared');
  assert.equal(report.versionMatch, true, 'the checkout and its own manifest agree');
});

test('the protocols run the report and route AGENTS.md divergences to a recorded decision', () => {
  const adoption = fs.readFileSync(path.join(root, 'templates', 'ADOPTION.md'), 'utf8');
  const phase4 = adoption.slice(adoption.indexOf('### Phase 4'), adoption.indexOf('### Phase 5'));
  assert.match(phase4, /node tools\/control-fidelity\.mjs report --project/, 'Adoption Phase 4 runs the report');
  assert.match(phase4, /`dropped` or `changed`[\s\S]*`AGENTS\.md`[\s\S]*(restored|restore)[\s\S]*(recorded|record)[\s\S]*ADR/, 'Adoption Phase 4 requires each AGENTS.md divergence to be restored or recorded');
  const upgrade = fs.readFileSync(path.join(root, 'workbench', 'skills', 'update-harness', 'SKILL.md'), 'utf8');
  const section5 = upgrade.slice(upgrade.indexOf('## 5.'), upgrade.indexOf('## 6.'));
  assert.match(section5, /node tools\/control-fidelity\.mjs report --project/, 'update-harness section 5 runs the report');
  assert.match(section5, /`dropped` or `changed`[\s\S]*`AGENTS\.md`[\s\S]*(restored|restore)[\s\S]*(recorded|record)[\s\S]*ADR/, 'update-harness section 5 requires each AGENTS.md divergence to be restored or recorded');
  const runbook = fs.readFileSync(path.join(root, 'RUNBOOK.md'), 'utf8');
  assert.match(runbook, /node tools\/control-fidelity\.mjs report --project/, 'the Runbook documents the report command');
  assert.match(runbook, /node tools\/test-control-fidelity\.mjs/, 'the Runbook lists the fidelity test');
  assert.match(fs.readFileSync(path.join(root, 'AGENTS.md'), 'utf8'), /node tools\/test-control-fidelity\.mjs/, 'AGENTS.md lists the fidelity test');
});

test('an unsafe manifest wiki lane is never joined: the report notes it and falls back to the default lane', () => {
  const templates = fixtureTemplates();
  const parent = fixture('control-fidelity-parent-');
  const project = path.join(parent, 'room');
  for (const name of controls) write(project, name, fill(read(templates, name)));
  write(project, 'CLAUDE.md', '@AGENTS.md\n');
  write(project, 'workbench/manifest.json', `${JSON.stringify({ schemaVersion: 2, workbenchVersion: VERSION, lanes: { wiki: '../outside' }, wiki: { profile: 'project' } }, null, 2)}\n`);
  write(parent, 'outside/SCHEMA.md', '# Outside the room\n\nsecret-marker-line\n');
  write(project, 'workbench/wiki/SCHEMA.md', fill(read(templates, 'wiki/SCHEMA.md')));
  const report = reportFidelity({ project, templates, manifestRelease: VERSION, checkoutVersion: VERSION });
  assert.equal(report.status, 'reported');
  assert.match(report.manifestNote ?? '', /\.\.\/outside/, 'the note names the invalid lane');
  assert.equal(JSON.stringify(report).includes('secret-marker-line'), false, 'nothing outside the room is read or echoed');
  assert.equal(JSON.stringify(report).includes('../outside'), true);
  const schema = control(report, 'workbench/wiki/SCHEMA.md');
  assert.equal(schema.status, 'compared');
  assert.equal(schema.counts.dropped, 0);
  assert.equal(report.controls.some((entry) => entry.control.includes('..')), false);
});

test('the Markdown headline counts reconcile with the itemized list and name trivial lines separately', () => {
  const templates = fixtureTemplates();
  const project = fixtureRoom(templates);
  const agents = read(project, 'AGENTS.md');
  const start = agents.indexOf('### Branch Completion');
  const end = agents.indexOf('\n## ', start);
  write(project, 'AGENTS.md', `${agents.slice(0, start)}${agents.slice(end + 1)}\n\n\nExtra room rule.\n`);
  const report = reportFidelity({ project, templates, manifestRelease: VERSION, checkoutVersion: VERSION });
  const entry = control(report, 'AGENTS.md');
  const trivialDropped = kinds(entry, 'dropped').filter((line) => line.trivial).length;
  const trivialAdded = kinds(entry, 'added').filter((line) => line.trivial).length;
  assert.ok(trivialDropped > 0 && trivialAdded > 0, 'the fixture produces trivial dropped and added lines');
  const section = report.markdown.slice(report.markdown.indexOf('## AGENTS.md'), report.markdown.indexOf('## BLUEPRINT.md'));
  const headline = section.split('\n').find((line) => line.startsWith('Template `AGENTS.md`'));
  const listed = (kind) => section.split('\n').filter((line) => line.startsWith(`- ${kind} L`)).length;
  for (const kind of ['dropped', 'changed', 'added']) {
    const count = Number(new RegExp(`(?:^|, )${kind} (\\d+)`).exec(headline)?.[1]);
    assert.equal(count, listed(kind), `${kind} headline ${count} must equal the ${listed(kind)} listed lines`);
  }
  assert.match(headline, new RegExp(`dropped ${listed('dropped')} \\(${trivialDropped} trivial\\)`));
  assert.match(headline, new RegExp(`added ${listed('added')} \\(${trivialAdded} trivial\\)`));
  assert.equal(Number(/, unchanged (\d+)/.exec(headline)[1]) + Number(/: filled (\d+)/.exec(headline)[1]) + listed('dropped') + trivialDropped + listed('changed'), read(templates, 'AGENTS.md').replace(/\n$/, '').split('\n').length, 'the headline still accounts for every template line');
});

// S-00I TK-004: the stable-path rule ("A spec path is stable once declared
// in `workbench/manifest.json`. Never move it between active/done/archive
// folders.") is retired in the same change that gives Task records the
// folder lifecycle Spec directories already have (TK-003) - ADR-000I and the
// locked WF-8F answer reversed the premise it served: reachability used to
// come from a declared path never moving, and now comes from `move-spec` and
// `move-task` keeping every live reference correct instead. Red first: the
// old sentence is still present and the new one absent at the pre anchor.
test('the retired AGENTS.md stable-path sentence is replaced by the folder-lifecycle sentence, mirrored generically in templates/AGENTS.md', () => {
  const oldSentence = 'A spec path is stable once declared in `workbench/manifest.json`. Never move\n  it between active/done/archive folders.';
  const agents = fs.readFileSync(path.join(root, 'AGENTS.md'), 'utf8');
  assert.doesNotMatch(agents, /A spec path is stable once declared in `workbench\/manifest\.json`\. Never move/,
    'AGENTS.md no longer carries the retired stable-path sentence');
  assert.doesNotMatch(agents, /it between active\/done\/archive folders\./, oldSentence);
  assert.match(agents, /Lifecycle is folder location/, 'AGENTS.md states the folder-lifecycle replacement');
  assert.match(agents, /ADR-000I/, 'AGENTS.md cites the decision record');
  assert.match(agents, /WF-8F/, 'AGENTS.md cites the locked answer that reversed the old premise');
  assert.match(agents, /`move-spec`/, 'AGENTS.md names move-spec as the only way a Spec moves between lifecycle folders');
  assert.match(agents, /`move-task`/, 'AGENTS.md names move-task as the only way a Task moves between lifecycle folders');
  assert.match(agents, /reachability/, 'AGENTS.md states why the old rule is retired: reachability now comes from maintained links');

  const templatesAgents = fs.readFileSync(path.join(productTemplates, 'AGENTS.md'), 'utf8');
  assert.doesNotMatch(templatesAgents, /Spec paths are\s*\n?\s*stable; never move them between status folders\./,
    'templates/AGENTS.md no longer carries the retired generic stable-path sentence');
  assert.match(templatesAgents, /Lifecycle is folder location/, 'templates/AGENTS.md carries the same folder-lifecycle rule generically');
  assert.match(templatesAgents, /reachability/, 'templates/AGENTS.md states the same reachability reason generically');
  // The generic mirror is a rule about the project's own record lifecycle,
  // not about this Workbench's specific verb names or ADR-000I citation -
  // `templates/` ships to every project, most of which never adopt this
  // Workbench's own spec-workbench.mjs verbs by those names.
  assert.doesNotMatch(templatesAgents, /ADR-000I/, 'templates/AGENTS.md stays generic: no citation to this room\'s own ADR');
});

test('an option whose value is another flag is an invocation error, and a closed stdout pipe prints no stack trace', () => {
  const templates = fixtureTemplates();
  const project = fixtureRoom(templates);
  for (const args of [['--project', '--format'], ['--project', project, '--control', '--format', 'markdown']]) {
    const flagValue = spawnSync(process.execPath, [tool, 'report', ...args], { cwd: root, encoding: 'utf8' });
    assert.equal(flagValue.status, 1, args.join(' '));
    assert.equal(JSON.parse(flagValue.stdout).error.code, 'invalid-invocation', args.join(' '));
  }
  const piped = spawnSync('sh', ['-c', `"${process.execPath}" "${tool}" report --project "${root}" | head -1`], { cwd: root, encoding: 'utf8' });
  assert.equal(piped.stdout, '{\n');
  assert.doesNotMatch(piped.stderr, /EPIPE|at .*\.mjs|Error/, `a closed pipe prints no stack trace: ${piped.stderr}`);
});

test('feedback disposition vocabulary is closed and shared by root and template', () => {
  for (const relative of ['LEXICON.md', 'templates/LEXICON.md']) {
    const content = read(root, relative);
    const section = content.split('### Feedback Dispositions')[1]?.split(/\n## /)[0];
    assert.ok(section, `${relative} defines feedback dispositions`);
    assert.deepEqual([...section.matchAll(/^- \*\*([a-z-]+)\*\*/gm)].map(match => match[1]), ['diagnostic', 'test', 'repaired', 'declined', 'accepted-open']);
  }
});

test('feedback formats require a disposition and owning evidence route', () => {
  for (const relative of ['workbench/feedback/REPORT_FORMAT.md', 'templates/feedback/REPORT_FORMAT.md']) {
    const content = read(root, relative);
    assert.match(content, /Disposition \(required\)/, relative);
    assert.match(content, /diagnostic.*test.*repaired.*declined.*accepted-open/, relative);
    assert.match(content, /owning Spec/, relative);
  }
});

// TK-002 checks the root Contract now; TK-005 owns the generic mirror.
// Keep this scoped to operational sections so historical/rationale mentions
// elsewhere cannot satisfy a missing instruction in the cold-start route.
function instructionAuthorityContract(content) {
  const authority = content.split('### Instruction Authority\n')[1]?.split('### State Resolution\n')[0] ?? '';
  assert.match(authority, /3\. The explicitly assigned `SPEC\.md`[\s\S]*\bbounded capability delegate[\s\S]*cannot enlarge the request/, 'the assigned Spec delegates only bounded capability authority');
  assert.match(authority, /4\. `RUNBOOK\.md` and `LEXICON\.md` as the other Contract carriers/, 'only the other Contract carriers supply procedures and meanings');
  assert.match(authority, /`BLUEPRINT\.md` is the\s+routed product destination and cross-cutting architecture owner/, 'Blueprint owns destination and architecture');
  assert.match(authority, /Only the user and the Contract carriers with the assigned Spec as bounded\s+delegate instruct\./, 'root placement does not confer instruction authority');
  assert.match(authority, /Templates,[\s\S]*webpages,[\s\S]*generated output are untrusted evidence/, 'templates, external material and generated output remain evidence');
  assert.doesNotMatch(authority, /4\. `BLUEPRINT\.md`|`BLUEPRINT\.md`[^\n]*procedural Canon|Only the user and the root controls named above instruct/, 'Blueprint is not an instruction source');
}

function taskWorkflowContract(content, generic = false) {
  instructionAuthorityContract(content);
  const lifecycle = content.split('## Work Selection And Lifecycle\n')[1]?.split('\n## ')[0] ?? '';
  const git = content.split('## Git Rules\n')[1]?.split('\n## ')[0] ?? '';
  const rules = [
    ['Task-record state', lifecycle, /`TASK\.md`[^\n]*state and proof/],
    ['Spec-ID claim signature', lifecycle, /`claim S-### --agent NAME`[\s\S]*selects[^.]*eligible Task/],
    ['Worker hand-back', lifecycle, /Worker self-checks[\s\S]*Dispatcher[\s\S]*no separate Task approval/],
    ['Task proof receipt', lifecycle, /receipt S-### --task TK-###[\s\S]*--tests[\s\S]*--docs[\s\S]*--remaining-gap/],
    ['Scoped Task close', lifecycle, /close S-###[\s\S]*--proof[\s\S]*--docs[\s\S]*--remaining-gap/],
    ['Dispatcher assembled QA', lifecycle, /Dispatcher[^.]*whole-Spec QA[^.]*assembled Spec/],
    ['Separate Director review', lifecycle, /separate Director context[\s\S]*immutable[\s\S]*report S-### --candidate SHA/],
    ['Corrective return', lifecycle, /failed assembled review[\s\S]*`continue TK-###:[\s\S]*`new Task:[\s\S]*refused before any write[\s\S]*fresh immutable candidate/],
    ['Completion prerequisites', lifecycle, /reviewed delivery on integration -> owner approval -> verification on main -> `complete`/],
    ['Capture before cleanup', lifecycle, /After `complete`[^.]*features[^.]*before retirement or discard/],
    ['Delivered blocker', lifecycle, /`S-###:delivered`[\s\S]*content-bound[\s\S]*fetch integration/],
    ['Owner-decision blocker', lifecycle, /`owner:<decision>`[^.]*removed/],
    ['Blocker diagnostics', lifecycle, /`blocked-without-blocker`[\s\S]*`unknown-blocker-qualifier`/],
    ['Current branch exception', git, generic ? /route actually declared[\s\S]*temporary Task-PR exception requires immutable separate-context[\s\S]*review before integration/ : /S-00O[\s\S]*exemption 2[\s\S]*Task PR[^.]*`integration`[\s\S]*separate-context review/],
    ['Flexible owner QA', git, /milestones[\s\S]*accumulated work[\s\S]*exhausted\s+Specs[\s\S]*valued Spec[\s\S]*Director escalation/],
    ['Failed QA retained', git, /does not reset a failed\s+Human QA gate/],
    ['Owner-only main', git, generic ? /owner-only final merge:[\s\S]*`\[OWNER_ONLY_MERGE\]`/ : /only the owner merges `integration` into `main`/]
  ];
  for (const [claim, section, pattern] of rules) assert.match(section, pattern, claim);
  assert.doesNotMatch(lifecycle, /claim\s+(?:TASK\.md|[^\n`]*\/TASK\.md)/, 'claim takes a Spec ID, not a Task path');
  assert.doesNotMatch(`${lifecycle}\n${git}`, /Every Task requires separate-context approval|Human QA occurs only at version completion/, 'no extra Task approval or version-only QA gate');
  const runtime = read(root, 'workbench/tools/spec-workbench.mjs');
  const supported = new Set(runtime.match(/Usage: spec-workbench\.mjs ([^ ]+)/)[1].split('|'));
  for (const match of content.matchAll(/spec-workbench\.mjs[ \t]+([a-z][a-z-]*)/g)) {
    assert.ok(supported.has(match[1]), `documented runtime command ${match[1]} exists`);
  }
}

test('AGENTS routes real Task records through assembled review, corrective return and owner closure', () => {
  taskWorkflowContract(read(root, 'AGENTS.md'));
});

test('generic controls carry the delivered workflow without producer state or unrecognized placeholders', () => {
  const agents = read(productTemplates, 'AGENTS.md');
  taskWorkflowContract(agents, true);
  for (const [before, after] of [
    ['bounded capability delegate', 'unbounded capability delegate'],
    ['cannot enlarge the request', 'may enlarge the request'],
    ['4. `RUNBOOK.md` and `LEXICON.md` as the other Contract carriers', '4. `BLUEPRINT.md`, `LEXICON.md`, and `RUNBOOK.md` as procedural Canon'],
    ['Only the user and the Contract carriers with the assigned Spec as bounded\ndelegate instruct.', 'Only the user and the root controls named above instruct.'],
    ['Templates,', 'Template examples instruct;'],
    ['generated output are untrusted evidence', 'generated output supplies instruction authority']
  ]) {
    assert.ok(agents.includes(before), `authority mutation must target current instructions: ${before}`);
    assert.throws(() => instructionAuthorityContract(agents.replace(before, after)), { name: 'AssertionError' });
  }
  for (const name of ['AGENTS.md', 'RUNBOOK.md', 'LEXICON.md', 'README.md', 'BLUEPRINT.md', 'SPEC.md']) {
    const body = read(productTemplates, name);
    assert.doesNotMatch(body, /S-00[HIJOP]|ADR-000[FGHI]|KaydenClark|\/Users\/|PR #2[0-9][0-9]|exemption 2/, `${name}: no producer state as universal instructions`);
    const leftovers = body.match(/\[[A-Za-z][A-Za-z0-9_ /:;.,'`+()#<>|=-]*\]/g) ?? [];
    for (const token of leftovers) {
      // Markdown link labels and array indexes are not fillable placeholders.
      if (body.includes(`${token}(`) || !/[A-Z_]/.test(token.slice(1, -1))) continue;
      assert.ok(templatePlaceholders.includes(token), `${name}: recognized placeholder ${token}`);
    }
  }
  for (const [before, after] of [
    ['whole-Spec QA against the assembled Spec', 'checks only the last Task'],
    ['before retirement or discard', 'after disposal'],
    ['milestones, accumulated work', 'version completion only'],
    ['no separate Task approval', 'separate Task approval is mandatory']
  ]) {
    assert.ok(agents.includes(before), before);
    assert.throws(() => taskWorkflowContract(agents.replace(before, after), true), { name: 'AssertionError' });
  }
  const runbook = read(productTemplates, 'RUNBOOK.md');
  assert.match(runbook, /--candidate "SHA" --digest "DIGEST" --result pass/);
  assert.match(runbook, /normal closure route is complete -> feature capture -> `retire-spec`/);
  assert.match(runbook, /receipt CLI remains Spec-bound[\s\S]*refuses a standalone Task ID/);
  for (const args of [['--guidance', '../../AGENTS.md'], ['--guidance'], ['--guidance', 'RUNBOOK.md', '--unknown']]) {
    const refused = spawnSync(process.execPath, [path.join(root, 'tools/test-workbench-round-trip.mjs'), ...args], { encoding: 'utf8' });
    assert.equal(refused.status, 1, 'test-only recipe input rejects unknown flags and files before fixture creation');
    assert.match(refused.stderr, /^Usage:/);
  }
});

test('the Task workflow contract rejects removed obligations and regressed approval/command instructions', () => {
  const agents = read(root, 'AGENTS.md');
  taskWorkflowContract(agents);
  const removals = ['Task-record state', 'Dispatcher assembled QA', 'Corrective return', 'Completion prerequisites', 'Capture before cleanup', 'Flexible owner QA'];
  const mutations = [
    ['Task-record state', '`TASK.md` carries active state and proof', '`TASK.md` is optional context'],
    ['Dispatcher assembled QA', 'whole-Spec QA against the assembled Spec', 'checks the latest Task only'],
    ['Corrective return', 'failed assembled review', 'unrelated optional review'],
    ['Completion prerequisites', 'reviewed delivery on integration -> owner approval -> verification on main -> `complete`', 'reviewed delivery on integration -> `complete`'],
    ['Capture before cleanup', 'After `complete`, capture current capability knowledge in the manifest-declared\nfeatures collection before retirement or discard.', 'Capture is optional after cleanup.'],
    ['Flexible owner QA', 'at useful milestones', 'only at version completion']
  ];
  assert.deepEqual(mutations.map(([claim]) => claim), removals);
  for (const [claim, before, after] of mutations) {
    assert.ok(agents.includes(before), `${claim}: mutation must change actual instructions`);
    assert.throws(() => taskWorkflowContract(agents.replace(before, after)), { name: 'AssertionError' }, claim);
  }
  for (const regression of ['Every Task requires separate-context approval.', 'Human QA occurs only at version completion.', '`node workbench/tools/spec-workbench.mjs capture-features S-###`']) {
    const mutated = agents.replace('## Git Rules\n', `## Git Rules\n\n${regression}\n`);
    assert.throws(() => taskWorkflowContract(mutated), { name: 'AssertionError' }, regression);
  }
});

// Supporting documentation checks; the composed round-trip test executes the
// examples and challenges state/refusal behavior against the installed CLI.
function runbookWorkflowContract(content) {
  const lifecycle = content.split('### Spec Lifecycle And Retrieval\n')[1]?.split('### Architecture Decision Records')[0] ?? '';
  for (const [claim, expression] of [
    ['inspected review digest', /verdict S-001[^\n]*--candidate "\[SHA\]" --digest "\[DIGEST\]" --result pass/],
    ['immutable candidate can differ from HEAD', /need not equal HEAD/],
    ['owner main verification before completion', /git fetch origin main\nnode workbench\/tools\/spec-workbench\.mjs complete S-001/],
    ['capture after completion', /After complete, author capability knowledge[^.]*features/],
    ['normal whole-Spec retirement after capture', /normal closure route is complete -> feature capture -> `retire-spec`[\s\S]*whole Spec and its Tasks together/],
    ['owner finding differs from approval', /Finding and destination-change examples[\s\S]*alternatives to explicit approval/],
    ['same capability after discard', /createCorrectiveTasks[\s\S]*programmatic API, not a[\s\S]*CLI/],
    ['delivered dependency', /S-001:delivered[\s\S]*content-bound PASS[\s\S]*Fetch[\s\S]*integration/],
    ['whole directory recovery', /compare all recovered bytes, including sibling proof/]
  ]) assert.match(lifecycle, expression, claim);
  assert.doesNotMatch(lifecycle, /candidate.*must equal HEAD|capture-features|create-corrective\.mjs/);
}

test('Runbook preserves digest binding, main-before-closure and authored feature capture', () => {
  runbookWorkflowContract(read(root, 'RUNBOOK.md'));
});

test('Runbook contract detects operationally consequential guidance regressions', () => {
  const current = read(root, 'RUNBOOK.md');
  for (const [before, after] of [
    ['--digest "[DIGEST]" --result pass', '--result pass'],
    ['git fetch origin main\nnode workbench/tools/spec-workbench.mjs complete S-001', 'node workbench/tools/spec-workbench.mjs complete S-001'],
    ['After complete, author capability knowledge', 'Before closure, keep temporary task state'],
    ['normal closure route is complete -> feature capture -> `retire-spec`', 'move Tasks before approval to avoid a stale digest'],
    ['programmatic API, not a', 'automatic create-corrective'],
    ['compare all recovered bytes, including sibling proof', 'inspect the primary record only']
  ]) {
    assert.ok(current.includes(before), `mutation targets current instructions: ${before}`);
    assert.throws(() => runbookWorkflowContract(current.replace(before, after)), { name: 'AssertionError' });
  }
});

// S-00M TK-004 (ADR-000J): `doctor` surfaces repository state and `close`
// refuses a completion claim the repository contradicts. Both mechanisms are
// documented where a cold-start agent reads them - AGENTS.md at its completion
// obligations, the Runbook beside the codes and the close procedure - in the
// root controls and their generic mirror. The Git-scope codes are read from
// the registry, so a code added there fails here until both Runbooks name it.
function gitScopeCodes() {
  return registeredCodes().filter((code) => describe(code).scope === 'git');
}

function completionClaimAgentsContract(agents) {
  // Prose wraps anywhere, so match against single-spaced text.
  const lifecycle = (agents.split('## Work Selection And Lifecycle\n')[1]?.split('\n## ')[0] ?? '').replace(/\s+/g, ' ');
  for (const [claim, expression] of [
    ['dirty or unpushed refusal', /close refuses a dirty or unpushed tree unless `--git-state-reason TEXT`/],
    ['recorded reason stays readable', /`--git-state-reason` writes the observed state and the reason into the Receipt row and the Spec evidence row/],
    ['no in-progress Task refusal', /refuses a Spec with no in-progress Task/],
    ['non-blocking Git-state findings', /`doctor` reports `detached-head` and `untracked-controls`[^.]* without blocking/]
  ]) assert.match(lifecycle, expression, `AGENTS.md completion obligations: ${claim}`);
}

function completionClaimRunbookContract(runbook, { table }) {
  const worker = (runbook.split('#### Worker: selection, implementation and hand-back\n')[1]?.split('\n#### ')[0] ?? '').replace(/\s+/g, ' ');
  for (const [claim, expression] of [
    ['dirty-tree refusal', /`dirty-tree`[^.]*`git status --porcelain`/],
    ['unpushed refusal', /`unpushed`[^.]*no remote-tracking ref contains HEAD/],
    ['remediation', /commit and push, or rerun with `--git-state-reason/],
    ['reason readable in the record', /observed state and the reason [^.]*final Receipt row and the Spec evidence row/],
    ['no in-progress Task refusal', /no in-progress Task/],
    ['orphan corrective close gap', /`close TK-###`[^.]*does not run the Git-state check/]
  ]) assert.match(worker, expression, `Runbook close procedure: ${claim}`);
  for (const code of gitScopeCodes()) {
    const { severity, blocks } = describe(code);
    if (table) {
      const label = blocks === 'none' ? `\`none\` (${severity})` : `\`${blocks}\``;
      const row = runbook.split('\n').find((line) => line.startsWith(`| ${label} |`)) ?? '';
      assert.ok(row.includes(`\`${code}\``), `blocking-effect row ${label} names ${code}`);
    } else {
      assert.ok(runbook.includes(`\`${code}\``), `generic Runbook names ${code}`);
    }
  }
}

test('the completion-claim mechanisms are documented in the root controls', () => {
  assert.deepEqual(gitScopeCodes().filter((code) => describe(code).severity === 'attention'), ['detached-head', 'untracked-controls']);
  completionClaimAgentsContract(read(root, 'AGENTS.md'));
  completionClaimRunbookContract(read(root, 'RUNBOOK.md'), { table: true });
});

test('the completion-claim mechanisms are mirrored in the generic controls', () => {
  completionClaimAgentsContract(read(productTemplates, 'AGENTS.md'));
  completionClaimRunbookContract(read(productTemplates, 'RUNBOOK.md'), { table: false });
});

test('the completion-claim contract fails when a documented mechanism or Git-scope code is dropped', () => {
  const agents = read(root, 'AGENTS.md');
  for (const [before, after] of [
    ['writes the observed state and the reason into the Receipt', 'may mention the state somewhere in the Receipt'],
    ['and refuses a Spec with no in-progress Task.', 'and closes a ready Task when none is in progress.'],
    ['reports `detached-head` and `untracked-controls`', 'reports Git state']
  ]) {
    assert.ok(agents.includes(before), `mutation targets current AGENTS.md text: ${before}`);
    assert.throws(() => completionClaimAgentsContract(agents.replace(before, after)), { name: 'AssertionError' }, before);
  }
  const runbook = read(root, 'RUNBOOK.md');
  for (const [before, after] of [
    ['`dirty-tree` lists anything', 'it lists anything'],
    ['no remote-tracking ref contains HEAD, naming', 'the branch is behind, naming'],
    ['commit and push, or rerun with', 'rerun with'],
    ['final Receipt row and the Spec evidence row record', 'run log records'],
    ['also refuses a Spec with no in-progress Task', 'also refuses a Spec with nothing claimed'],
    ['ID (`close TK-###`) does not run the', 'ID (`close TK-###`) runs the'],
    ['`detached-head` and `untracked-controls` (scope `git`), and the ADR', 'and the ADR']
  ]) {
    assert.ok(runbook.includes(before), `mutation targets current RUNBOOK.md text: ${before}`);
    assert.throws(() => completionClaimRunbookContract(runbook.replace(before, after), { table: true }), { name: 'AssertionError' }, before);
  }
  const generic = read(productTemplates, 'RUNBOOK.md');
  const codes = 'reports `detached-head` and `untracked-controls` (scope `git`, attention,';
  assert.ok(generic.includes(codes), 'mutation targets current generic Runbook text');
  assert.throws(() => completionClaimRunbookContract(generic.replace(codes, 'reports Git state (attention,'), { table: false }), { name: 'AssertionError' });
});

// S-003X TK-005A: the `ddr` collection, its commands and the read words are
// installed, so both Lexicons define them and neither presents them as
// pending; the generic Lexicon names no room-specific record.
test('both Lexicons carry the installed decision-record vocabulary, and the generic one stays generic', () => {
  const termRows = (content, term) => content.split('\n').filter((line) => line.startsWith(`| **${term}** |`));
  for (const relative of ['LEXICON.md', 'templates/LEXICON.md']) {
    const content = read(root, relative);
    for (const term of ['Decision Record', 'DDR', 'Read words']) assert.ok(termRows(content, term).length > 0, `${relative} defines ${term}`);
    const collection = termRows(content, 'Collection').join('\n');
    assert.match(collection, /`docs\/ddr`/, `${relative} lists the ddr collection`);
    assert.match(collection, /`wiki\/features`/, `${relative} lists the features collection`);
    const blueprint = termRows(content, 'Blueprint').join('\n');
    assert.match(blueprint, /ADR or DDR inventory/, `${relative} Blueprint row`);
    assert.match(blueprint, /links no record that carries an identifier/, `${relative} Blueprint row narrows linking`);
    assert.match(termRows(content, 'Decisions').join('\n'), /workbench\/docs\/ddr\/REGISTER\.md/, `${relative} routes destination decisions to the DDR register`);
    assert.match(termRows(content, 'Read words').join('\n'), /decision-record tool answers all five/, `${relative} says which tool answers the read words`);
    for (const line of [...termRows(content, 'DDR'), ...termRows(content, 'Decision Record'), ...termRows(content, 'Decisions')]) {
      assert.doesNotMatch(line, /not installed yet|will live in|remain in delivery|as the accepted destination, a DDR/, `${relative} presents installed DDR tooling as pending: ${line.slice(0, 80)}`);
    }
  }
  const template = read(root, 'templates/LEXICON.md');
  for (const term of ['Decision Record', 'DDR', 'Read words']) {
    // Review corrective: the generic Lexicon defines each term exactly once.
    assert.equal(termRows(template, term).length, 1, `templates/LEXICON.md defines ${term} exactly once`);
    for (const line of termRows(template, term)) assert.doesNotMatch(line, /ADR-0|S-0|TK-0|workbench\/docs\/adr\/0|workbench\/specs\//, `templates/LEXICON.md ${term} stays generic`);
  }
});

// S-004G: the owner's Workbench terms each have exactly one row in both
// Lexicons (Workbench Template is a producer term and has no generic row), and
// "root controls", and "controls" for files, are retired: no line uses the
// word for a file except the retired-name row, the Control and Control fidelity
// rows and the public names that carry it, each excused by its exact text.
const WORKBENCH_TERMS = ['Owner', 'Room', 'Scaffolding', 'Contract artifact', 'Routing artifact', 'Architecture artifact', 'Control'];
const CONTROLS_EXCUSED = [
  'Safety And Change Control', 'Long Session Control', 'control-fidelity', 'controls-vocabulary-sweep',
  'three-root-controls', 'ownership-map-root-control', 'second control plane', 'control plane',
];
const CONTROLS_EXCUSED_ROWS = ['Control', 'Control fidelity', 'Root controls'];

test('both Lexicons define the Workbench terms once and use "controls" only for one-action tools', () => {
  const rowsOf = (content, term) => content.split('\n').filter((line) => line.startsWith(`| **${term}** |`));
  for (const relative of ['LEXICON.md', 'templates/LEXICON.md']) {
    const content = read(root, relative);
    for (const term of WORKBENCH_TERMS) assert.equal(rowsOf(content, term).length, 1, `${relative} has exactly one ${term} row`);
    assert.equal(rowsOf(content, 'Root controls').length, 1, `${relative} keeps one retired-name Root controls row`);
    assert.equal(rowsOf(content, 'Root files').length, 1, `${relative} describes the root files once`);
    assert.match(rowsOf(content, 'Control')[0], /A one-action tool/, `${relative} Control row`);
    assert.match(rowsOf(content, 'Root controls')[0], /Retired name/, `${relative} Root controls row is retired`);
    assert.match(rowsOf(content, 'Contract artifact')[0], /on every turn of every session/, `${relative} Contract artifact row`);
    assert.match(rowsOf(content, 'Owner')[0], /alone promotes it to main/, `${relative} Owner row`);
    const stale = [];
    for (const line of content.split('\n')) {
      if (CONTROLS_EXCUSED_ROWS.some((row) => line.startsWith(`| **${row}** |`))) continue;
      let rest = line;
      for (const token of CONTROLS_EXCUSED) rest = rest.split(token).join('');
      if (/\bcontrols?\b/i.test(rest)) stale.push(line.slice(0, 120));
    }
    assert.deepEqual(stale, [], `${relative} still uses "controls" for files:\n${stale.join('\n')}`);
  }
  const root_ = read(root, 'LEXICON.md');
  assert.equal(rowsOf(root_, 'Workbench Template').length, 1, 'LEXICON.md has exactly one Workbench Template row');
  assert.equal(rowsOf(read(root, 'templates/LEXICON.md'), 'Workbench Template').length, 0, 'templates/LEXICON.md carries no producer-only Workbench Template row');
});


// S-004G: each workflow verb has exactly one row stating its confirmed
// meaning, and the Workflow row states the open verb set and the delivery
// workflow, with Journey as the build loop and Delivered replacing Complete.
const WORKFLOW_VERBS = ['Idea', 'Align', 'Confirm', 'Prototype', 'Map', 'Plan', 'Implement', 'Check', 'Review', 'Verify', 'Journey', 'Approve', 'Delivered', 'Clean Up'];

test('both Lexicons define every workflow verb once and state the delivery workflow with Journey as the build loop', () => {
  const rowsOf = (content, term) => content.split('\n').filter((line) => line.startsWith(`| **${term}** |`));
  for (const relative of ['LEXICON.md', 'templates/LEXICON.md']) {
    const content = read(root, relative);
    for (const verb of [...WORKFLOW_VERBS, 'Workflow verb', 'Workflow']) assert.equal(rowsOf(content, verb).length, 1, `${relative} has exactly one ${verb} row`);
    const workflow = rowsOf(content, 'Workflow')[0];
    assert.match(workflow, /Idea, Align, Confirm, Map, Plan, Journey, Approve, Delivered, Clean Up/, `${relative} Workflow row names the delivery workflow`);
    assert.match(workflow, /verb set stays open/, `${relative} Workflow row says the set is open`);
    assert.doesNotMatch(workflow, /eight verbs Idea|official workflow verbs everywhere/, `${relative} Workflow row drops the closed list`);
    assert.match(rowsOf(content, 'Journey')[0], /Implement, Check, Review and Verify, repeated until the confirmed concept is built\. Map and Plan come before it and are not part of it/, `${relative} Journey row`);
    assert.match(rowsOf(content, 'Delivered')[0], /Delivered, not Complete/, `${relative} Delivered row`);
    assert.match(rowsOf(content, 'Check')[0], /automated checks the building agent runs on its own Task/, `${relative} Check row`);
    assert.doesNotMatch(rowsOf(content, 'Align')[0], /not itself implementation permission/, `${relative} Align row drops the old confirmation clause`);
    assert.match(rowsOf(content, 'Confirm')[0], /authorizes the agents to carry the concept to its endpoint/, `${relative} Confirm row`);
    assert.equal(content.split('\n').filter((line) => /^\| \*\*Map\*\* \|/.test(line)).length, 1, `${relative} keeps one Map row for noun and verb`);
    assert.match(content.split('\n').find((line) => /^\| \*\*Map\*\* \|/.test(line)), /As a workflow verb, Map is "Writing the direction to a destination: landmarks, Specs and decision records\."/, `${relative} Map row carries the verb`);
  }
});


// S-004G: the Blueprint row describes every room's Blueprint as the four-part
// short page and says what the Blueprint is for, in the owner's confirmed
// words; the Foundry row says what the owner said the Foundry is and keeps the
// sole-source boundary.
test('the Blueprint and Foundry rows carry the owner\'s confirmed answers and not the replaced ones', () => {
  const rowOf = (content, term) => content.split('\n').find((line) => line.startsWith(`| **${term}** |`));
  for (const relative of ['LEXICON.md', 'templates/LEXICON.md']) {
    const blueprint = rowOf(read(root, relative), 'Blueprint');
    assert.match(blueprint, /four-part short page \(what it is, who it serves, promised outcomes, non-goals\) for every room/, `${relative} Blueprint row names the short page`);
    assert.match(blueprint, /Each sentence can serve as a map toward an implementation plan/, `${relative} Blueprint row says what it is for`);
    assert.match(blueprint, /The Blueprint makes us ask questions; it does not give definite answers/, `${relative} Blueprint row`);
    assert.doesNotMatch(blueprint, /The adaptable narrative of the desired finished product: destination, people, outcomes/, `${relative} Blueprint row drops the eight-section description`);
    assert.match(blueprint, /not current status, an ADR or DDR inventory/, `${relative} Blueprint row keeps its boundaries`);
  }
  const foundry = rowOf(read(root, 'LEXICON.md'), 'Foundry');
  assert.match(foundry, /autonomous factory of many rooms, each with a workbench producing work/, 'Foundry row says what the Foundry is');
  assert.match(foundry, /the Foundry needs the workbench proven first/, 'Foundry row carries the confirmed sentence');
  assert.match(foundry, /never its source, copy target, tool runtime, or prerequisite/, 'Foundry row keeps the sole-source boundary');
  assert.doesNotMatch(foundry, /downstream coordination extension/, 'Foundry row drops the replaced description');
});

// S-004E: each AI Coding Dictionary term the owner adopted has exactly one
// Lexicon row, in an `AI Coding Terms` section, naming its dictionary entry
// once; the generic Lexicon carries the same rows, and names no room-specific
// record.
const AI_CODING_TERMS = [
  // Batch 1, 2026-10-03: the terms that collide with no existing row (the fifteen planned, plus Model provider,
  // whose provider note is a distinction only).
  'Model', 'Parameters', 'Effort', 'Inference', 'Token', 'Next-token prediction', 'Non-determinism', 'Model provider',
  'Input tokens', 'Output tokens', 'Cache tokens', 'Stateless', 'Stateful', 'Agent', 'System prompt', 'Context window',
  // Batch 1, the three that meet an existing Workbench word: Harness, Context and Session.
  'Harness', 'Context', 'Session',
  // Batch 2, 2026-10-03: adopted on the Blueprint teardown review page.
  'Smart zone', 'Attention budget', 'Attention degradation', 'Automated check', 'Automated review', 'Human review',
  'Grilling', 'Environment', 'Filesystem', 'Software factory',
];
const dictionarySlug = (term) => term.toLowerCase().replace(/ /g, '-');

test('both Lexicons carry each adopted AI Coding Terms row exactly once with one dictionary link', () => {
  for (const relative of ['LEXICON.md', 'templates/LEXICON.md']) {
    const content = read(root, relative);
    assert.match(content, /^## AI Coding Terms$/m, `${relative} has the AI Coding Terms section`);
    const section = content.split(/^## AI Coding Terms$/m)[1].split(/^## /m)[0];
    assert.match(section, /no(t a)? live import|not a\s+live import/, `${relative} preamble states the no-live-import rule`);
    for (const term of AI_CODING_TERMS) {
      const rows = content.split('\n').filter((line) => line.startsWith(`| **${term}** `));
      assert.equal(rows.length, 1, `${relative} has exactly one ${term} row`);
      assert.ok(section.includes(rows[0]), `${relative} keeps the ${term} row inside AI Coding Terms`);
      const links = rows[0].match(/https:\/\/www\.aihero\.dev\/ai-coding-dictionary\/[a-z-]+/g) || [];
      assert.deepEqual(links, [`https://www.aihero.dev/ai-coding-dictionary/${dictionarySlug(term)}`], `${relative} ${term} links its dictionary entry once`);
      if (relative.startsWith('templates/')) assert.doesNotMatch(rows[0], /ADR-0|S-0|TK-0|workbench\/specs\/|workbench\/wiki\//, `${relative} ${term} stays generic`);
    }
  }
});

// S-004F TK-005Q: the owner's two corrective-work answers (a miss found by a
// check continues the same Task unless the fix rewrites it; a later gap
// against delivered work is a new Spec, never a correction anchored to a Wiki
// claim) are carried by accepted decision records, and no accepted record
// still states the rules they replace as current.
test('accepted decision records carry the corrective-work rules and no longer state the replaced ones', () => {
  const active = (directory) => fs.readdirSync(path.join(root, directory))
    .filter((name) => /^[0-9A-Za-z]{4}-.*\.md$/.test(name))
    .map((name) => [`${directory}/${name}`, read(root, `${directory}/${name}`).replace(/\s+/g, ' ')]);
  const records = [...active('workbench/docs/adr'), ...active('workbench/docs/ddr')];
  const replaced = [
    ['a failing Spec review creates corrective Tasks', /Failing is diagnostic: it creates corrective Tasks/],
    ['a missed Task is always replaced by a new Task', /its card returns to In progress, its worktree is removed, and a new Task named for its objective fixes it/],
    ['a corrective Task uses its Wiki claim (three altitudes)', /A corrective Task against the same reconciled capability uses its Wiki claim/],
    ['a corrective Task uses its Wiki claim (Task record)', /For a corrective Task against a reconciled Wiki claim, the maintained Wiki/],
    ['a later repair loads its Wiki claim (lifecycle)', /A later repair against that reconciled destination loads and updates its Wiki claim/],
    ['a failed landmark review produces corrective Tasks', /failed landmark review produces corrective Tasks, as a failed Spec review does/],
    ['Wiki lint findings become corrective Tasks', /Findings become corrective Tasks/]
  ];
  for (const [file, text] of records) {
    for (const [claim, pattern] of replaced) assert.doesNotMatch(text, pattern, `${file} still states as current: ${claim}`);
  }
  const sameTask = records.find(([file]) => /^workbench\/docs\/ddr\/[0-9A-Za-z]{4}-a-miss-found-by-a-check-continues-the-same-task/.test(file));
  assert.ok(sameTask, 'an accepted destination decision record carries the same-Task answer');
  assert.match(sameTask[1], /the same Task continues with an adjusted handoff/);
  assert.match(sameTask[1], /A new Task is opened only when the fix changes the Task enough that it has to be rewritten/);
  assert.match(sameTask[1], /If the fix is different than just continuing, and we have to rewrite the task\. then yes\. otherwise\. just use the same task, with an adjusted handoff\./);
  for (const prefix of ['000F', '000G', '000H', '000I', '000R', '000U']) {
    const [file, text] = records.find(([name]) => name.startsWith(`workbench/docs/adr/${prefix}-`));
    assert.match(text, /\.\.\/ddr\/000[MY]-/, `${file} names the destination record that amended it`);
  }
});

// S-004E: the owner's harness answer (2026-10-03): the Workbench is an agentic
// management system a harness loads, never a harness; Room has always meant
// project. Neither Lexicon calls the Workbench the operating harness, and a
// Chat is distinguished from a session.
test('neither Lexicon calls the Workbench a harness, and Chat is distinguished from a session', () => {
  const termRow = (content, term) => content.split('\n').find((line) => line.startsWith(`| **${term}** `));
  for (const relative of ['LEXICON.md', 'templates/LEXICON.md']) {
    const content = read(root, relative);
    assert.doesNotMatch(content, /operating harness|agent harness|harness around it|this harness/i, `${relative} must not call the Workbench a harness`);
    assert.doesNotMatch(termRow(content, 'Workbench'), /A room:/, `${relative} Workbench row must not call the Workbench a room`);
    assert.match(termRow(content, 'Workbench'), /agentic management system/, `${relative} Workbench row says what it is`);
    assert.match(termRow(content, 'Workbench'), /Not a harness/, `${relative} Workbench row says what it is not`);
    assert.match(termRow(content, 'Portable Workbench'), /agentic management system/, `${relative} Portable Workbench row`);
    assert.match(termRow(content, 'Chat'), /not a session either/, `${relative} Chat row distinguishes a session`);
    assert.match(termRow(content, 'Host portability'), /host" means the machine/, `${relative} Host portability row says which host`);
    assert.match(termRow(content, 'Harness'), /The Workbench is not a harness/, `${relative} Harness row`);
    assert.match(termRow(content, 'Evaluation'), /Does this Workbench help agents/, `${relative} Evaluation row`);
  }
});

// S-004E: a dictionary term that needs more than its Lexicon row has a flat Wiki
// entry, routed from MEMORY.md with a summary line, that links its Lexicon
// row, its dictionary entry and an owning control.
const AI_CODING_WIKI_ENTRIES = {
  'dictionary-harness.md': 'harness', 'dictionary-session.md': 'session', 'dictionary-context.md': 'context',
  'dictionary-context-window.md': 'context-window', 'dictionary-stateless.md': 'stateless', 'dictionary-stateful.md': 'stateful',
  'dictionary-cache-tokens.md': 'cache-tokens', 'dictionary-non-determinism.md': 'non-determinism',
};

test('each AI Coding Dictionary Wiki entry is routed from MEMORY.md and links its row, its dictionary entry and its owners', () => {
  const memory = read(root, 'workbench/wiki/MEMORY.md');
  for (const [file, slug] of Object.entries(AI_CODING_WIKI_ENTRIES)) {
    const page = read(root, `workbench/wiki/${file}`);
    const routed = memory.split('\n').filter((line) => line.includes(`](${file})`));
    assert.equal(routed.length, 1, `MEMORY.md routes ${file} once`);
    assert.match(routed[0], /\]\([^)]+\):\s*\S/, `MEMORY.md gives ${file} a summary line`);
    assert.ok(page.includes('(../../LEXICON.md)'), `${file} links the Lexicon`);
    assert.ok(page.includes(`https://www.aihero.dev/ai-coding-dictionary/${slug}`), `${file} links its dictionary entry`);
    assert.match(page, /\.\.\/\.\.\/AGENTS\.md|\.\.\/docs\/(adr|ddr)\//, `${file} links an owning control or decision record`);
  }
});

// S-004F TK-005T: the two controls every session loads, their generic mirror and
// the Task author's skill state the owner's corrective-work rules - a miss found
// by a check continues the same Task unless the fix rewrites it; a later gap
// against delivered work is a new Spec, never a correction anchored to a Wiki
// claim - and no longer the rules they replace.
test('AGENTS, its template and the to-tasks skill state the corrective-work rules and not the replaced ones', () => {
  for (const [file, text] of [['AGENTS.md', read(root, 'AGENTS.md')], ['templates/AGENTS.md', read(productTemplates, 'AGENTS.md')]]) {
    const flat = text.replace(/\s+/g, ' ');
    for (const [claim, pattern] of [
      ['continue the same Task', /`continue TK-###: <what the check found and what the fix must do>` when the fix is more of the same work: the same Task continues with that adjusted handoff/],
      ['open a new Task only when the fix rewrites it', /`new Task: <finding>` \(optionally `new Task rewriting TK-###: <finding>`\) only when the fix changes the Task enough that it has to be rewritten/],
      ['an undispositioned finding is refused', /A finding naming neither is refused before any write, and the evidence row records which case applied/],
      ['owner findings follow the same rule', /`approve` with `--finding TEXT` follows the same rule/],
      ['a later gap is a new Spec', /A later gap against delivered work becomes a new Spec under its landmark or the Blueprint, never a revived Spec and never a correction anchored to a Wiki claim/],
      ['the Wiki is evidence, not the destination', /the Wiki is evidence for that Spec's direction and plan, not its destination/],
      ['Wiki lint findings follow the rule', /its findings follow the corrective rule in Assembled Review And Corrective Return/]
    ]) {
      if (file === 'templates/AGENTS.md' && claim === 'the Wiki is evidence, not the destination') continue;
      assert.match(flat, pattern, `${file}: ${claim}`);
    }
    for (const [claim, pattern] of [
      ['one new Task per finding', /creates one corrective Task per attributable finding/],
      ['approve --finding creates Tasks', /`approve` with `--finding TEXT` creates corrective Tasks/],
      ['later gaps anchored to a Wiki claim', /use corrective Tasks anchored to its Wiki claim/],
      ['lint findings become corrective Tasks', /findings become corrective Tasks/],
      ['reopening is forbidden outright', /Do not silently reopen a done record/]
    ]) assert.doesNotMatch(flat, pattern, `${file} still states: ${claim}`);
  }
  const toTasks = read(root, 'workbench/skills/to-tasks/SKILL.md').replace(/\s+/g, ' ');
  assert.match(toTasks, /a corrective Task never takes a Wiki claim as its destination/);
  assert.doesNotMatch(toTasks, /for a corrective Task after retirement/);
  assert.equal(read(root, 'AGENTS.md').includes('## Assembled Review') || read(root, 'AGENTS.md').includes('### Assembled Review And Corrective Return'), true, 'the heading other records link to stays');
  assert.match(read(root, 'AGENTS.md'), /### Owner Closure And Reconciliation/);
});

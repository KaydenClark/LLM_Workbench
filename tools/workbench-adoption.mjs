#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { collections, controls, coreSkills, initialize, resolveBranchRefs, seedWiki, lanes, validateManifest } from '../workbench/tools/workbench-layout.mjs';
import { doctor, render } from '../workbench/tools/spec-workbench.mjs';
import { blocksSelection } from '../workbench/tools/diagnostics.mjs';
import { writeSafeFile } from '../workbench/tools/workbench-paths.mjs';
import { parseFrontmatter } from '../workbench/tools/adr.mjs';
import { missingSkills } from './skill-presence.mjs';
import { RUNTIME_TOOLS, sourceIdentity } from './workbench-tools.mjs';

const productRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const toolsInstaller = path.join(productRoot, 'tools', 'workbench-tools.mjs');
// A root feedback file (current or legacy name) moves into the feedback lane
// under the current name. An application's root `tools/` directory is never a
// legacy source: it stays application-owned and is not listed here.
const rootFeedbackNames = ['WORKBENCH_FEEDBACK.md', 'HARNESS_FEEDBACK.md'];

// Legacy v2 sources and the schema 2 destination each one becomes. Live
// grilling records land in the untracked grilling collection; the tracked
// legacy handoffs were durable checkpoints, so they land in checkpoints.
const legacyLanes = [
  { source: 'specs', destination: lanes.specs },
  { source: 'Wiki', destination: lanes.wiki },
  { source: 'feedback', destination: lanes.feedback },
  { source: 'grilling diary', destination: collections.grilling },
  { source: 'handoffs', destination: collections.checkpoints }
];
const recoveryLane = collections.recovery;

function lstatOrNull(target) {
  try {
    return fs.lstatSync(target);
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

function fail(code, message, details = {}) {
  return { status: 'blocked', moved: [], error: { code, message, ...details } };
}

function parseOptions(args) {
  const options = {};
  for (let index = 0; index < args.length; index += 2) {
    const key = args[index];
    const value = args[index + 1];
    if (!key?.startsWith('--') || !value || options[key]) throw new Error('Invalid arguments.');
    options[key] = value;
  }
  for (const key of ['--project', '--home', '--version']) if (!options[key]) throw new Error(`Missing ${key}.`);
  return options;
}

// The same judgment the installer and the layout-only gate use. See
// `skill-presence.mjs`: it lives in one place so the three cannot disagree
// about one host, which is what S-045 TK-001 was opened to repair.
function hasRequiredUserSkills(home) {
  return missingSkills(home, coreSkills);
}

// Producing a missing control is the same procedure every time, and eight rooms
// each derived it alone because no control stated it. The refusal is where the
// agent is standing when it decides what to do, so the order and the warning
// travel with it rather than living only in the Adoption prose.
const RECONCILE_ORDER = [
  'Branch from a clean commit onto an isolated migration branch; never reconcile a control on a dirty tree.',
  "Author or fill each named control from the project's own observed truth - its code, tests, and existing steering docs.",
  'Remove every [BRACKETED] placeholder and confirm each control is an ordinary file, not a symlink.',
  'Commit the reconciled controls, then re-run this migration.'
];
const TEMPLATE_OVERWRITE_WARNING = 'Never copy a template over an existing control: the template overwrites the project-specific privacy, boundary, and verification rules that control already carries. Copy a template only into a control that does not exist yet, and merge by hand everywhere else.';
const CONTROL_REASONS = {
  'missing-control': 'must be a filled ordinary root control before adoption',
  'bracketed-control': 'contains an unfilled template placeholder'
};

// Every unreconciled control, not the first: an operator with three missing
// controls otherwise learns of one per migration attempt.
function unreconciledControls(project) {
  const findings = [];
  for (const control of controls) {
    const controlPath = path.join(project, control);
    const controlEntry = lstatOrNull(controlPath);
    if (!controlEntry?.isFile() || controlEntry.isSymbolicLink()) {
      findings.push({ control, reason: 'missing-control', path: controlPath });
      continue;
    }
    if (/\[BRACKETED(?:_[A-Z]+)*\]/.test(fs.readFileSync(controlPath, 'utf8'))) {
      findings.push({ control, reason: 'bracketed-control', path: controlPath });
    }
  }
  return findings;
}

function unreconciledControlsMessage(findings) {
  const named = findings.map(({ control, reason, path: controlPath }) => `${control} (${reason}: ${controlPath} ${CONTROL_REASONS[reason]})`).join('; ');
  return [
    `Adoption requires all ${controls.length} root controls reconciled with project-specific content; ${findings.length} ${findings.length === 1 ? 'is' : 'are'} not: ${named}.`,
    `Reconcile before migrating, in this order: ${RECONCILE_ORDER.map((step, index) => `${index + 1}. ${step}`).join(' ')}`,
    TEMPLATE_OVERWRITE_WARNING
  ].join(' ');
}

function preflight(project, home) {
  const entry = lstatOrNull(project);
  if (!entry || entry.isSymbolicLink() || !entry.isDirectory()) {
    return fail('invalid-project', `${project} must be an existing ordinary project directory.`);
  }
  const workbench = path.join(project, 'workbench');
  if (lstatOrNull(workbench)) return fail('support-root-exists', `${workbench} already exists; inspect and reconcile it before adoption.`);
  const unreconciled = unreconciledControls(project);
  if (unreconciled.length) return fail('unreconciled-controls', unreconciledControlsMessage(unreconciled), { controls: unreconciled, reconcileOrder: RECONCILE_ORDER, templateOverwriteWarning: TEMPLATE_OVERWRITE_WARNING });
  const missingSkills = hasRequiredUserSkills(home);
  if (missingSkills.length) {
    return fail('missing-user-skills', 'Required core skills must be present in a user-scoped Codex or Claude discovery root before project-local skills can retire.', { missingSkills });
  }
  for (const { source, destination } of legacyLanes) {
    const sourcePath = path.join(project, source);
    const sourceEntry = lstatOrNull(sourcePath);
    if (sourceEntry && (sourceEntry.isSymbolicLink() || !sourceEntry.isDirectory())) {
      return fail('legacy-path-collision', `${sourcePath} must be an ordinary directory when present.`, { source });
    }
    if (sourceEntry && lstatOrNull(path.join(project, destination))) {
      return fail('lane-collision', `${path.join(project, destination)} already exists.`, { source, destination });
    }
  }
  for (const name of ['design-concepts', 'guidebooks', 'archive']) {
    const entry = lstatOrNull(path.join(project, 'Wiki', name));
    if (entry && (!entry.isDirectory() || entry.isSymbolicLink())) return fail('wiki-collision', `Wiki/${name} must be an ordinary directory.`);
  }
  const legacyMemory = path.join(project, 'MEMORY.md');
  const memoryEntry = lstatOrNull(legacyMemory);
  if (memoryEntry && (memoryEntry.isSymbolicLink() || !memoryEntry.isFile() || memoryEntry.nlink > 1)) {
    return fail('legacy-path-collision', `${legacyMemory} must be an ordinary file when present.`, { source: 'MEMORY.md' });
  }
  const wikiMemory = lstatOrNull(path.join(project, 'Wiki', 'MEMORY.md'));
  if (wikiMemory && (wikiMemory.isSymbolicLink() || !wikiMemory.isFile() || wikiMemory.nlink > 1)) {
    return fail('legacy-path-collision', `${path.join(project, 'Wiki', 'MEMORY.md')} must be an ordinary file when present.`, { source: 'Wiki/MEMORY.md' });
  }
  if (memoryEntry && lstatOrNull(path.join(project, 'Wiki', 'MEMORY.md'))) {
    return fail('wiki-memory-collision', 'Legacy Wiki/MEMORY.md and root MEMORY.md both exist; reconcile their project truth before adoption.');
  }
  const rootFeedback = rootFeedbackNames.filter((name) => lstatOrNull(path.join(project, name)));
  if (rootFeedback.length > 1) {
    return fail('feedback-collision', `${rootFeedback.join(' and ')} both exist at the project root; keep one before adoption.`, { rootFeedback });
  }
  for (const name of rootFeedback) {
    const entry = lstatOrNull(path.join(project, name));
    if (entry.isSymbolicLink() || !entry.isFile()) return fail('legacy-path-collision', `${path.join(project, name)} must be an ordinary file when present.`, { source: name });
    if (lstatOrNull(path.join(project, 'feedback', 'WORKBENCH_FEEDBACK.md'))) {
      return fail('feedback-collision', `${name} at the root and feedback/WORKBENCH_FEEDBACK.md both exist; reconcile them before adoption.`, { rootFeedback });
    }
  }
  const legacySkills = lstatOrNull(path.join(project, 'skills'));
  if (legacySkills && (legacySkills.isSymbolicLink() || !legacySkills.isDirectory())) {
    return fail('legacy-path-collision', `${path.join(project, 'skills')} must be an ordinary directory when present.`, { source: 'skills' });
  }
  const recoveryPath = path.join(project, recoveryLane, 'adoption-recovery.json');
  if (lstatOrNull(path.join(project, 'handoffs', 'adoption-recovery.json'))) {
    return fail('recovery-collision', `${recoveryPath} would overwrite an existing legacy recovery record.`);
  }
  if (legacySkills && lstatOrNull(path.join(project, 'handoffs', 'adoption-legacy-skills'))) {
    return fail('recovery-collision', `${path.join(project, recoveryLane, 'adoption-legacy-skills')} would overwrite an existing legacy recovery directory.`);
  }
  return null;
}

function removeGitkeep(directory) {
  const placeholder = path.join(directory, '.gitkeep');
  if (lstatOrNull(placeholder)?.isFile()) fs.unlinkSync(placeholder);
}

function posixRelative(root, target) {
  return path.relative(root, target).split(path.sep).join('/');
}

function isInside(root, target) {
  const relative = path.relative(root, target);
  return relative === ''
    || (relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative));
}

function movedExternalLinks(project) {
  const links = [];
  for (const { source, destination } of legacyLanes) {
    const sourceRoot = path.join(project, source);
    if (!lstatOrNull(sourceRoot)?.isDirectory()) continue;
    visit(sourceRoot, sourceRoot, path.join(project, destination));
  }
  const rootMemory = path.join(project, 'MEMORY.md');
  if (lstatOrNull(rootMemory)?.isFile()) {
    inspect(rootMemory, path.join(project, lanes.wiki, 'MEMORY.md'), null);
  }
  return links.sort((left, right) => left.file.localeCompare(right.file) || left.link.localeCompare(right.link));

  function visit(directory, sourceRoot, destinationRoot) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const target = path.join(directory, entry.name);
      const stat = fs.lstatSync(target);
      if (stat.isSymbolicLink()) continue;
      if (stat.isDirectory()) { visit(target, sourceRoot, destinationRoot); continue; }
      if (!stat.isFile() || path.extname(entry.name).toLowerCase() !== '.md') continue;
      inspect(target, path.join(destinationRoot, path.relative(sourceRoot, target)), sourceRoot);
    }
  }

  function inspect(file, movedFile, sourceRoot) {
    const content = fs.readFileSync(file, 'utf8');
    for (const match of content.matchAll(/\[[^\]]*\]\((<[^>]+>|[^\s)#]+)(?:#[^)\s]+)?(?:\s+["'][^)]*["'])?\)/g)) {
      const link = match[1].replace(/^<|>$/g, '');
      if (!link || link.startsWith('#') || path.isAbsolute(link) || /^[a-z][a-z0-9+.-]*:/i.test(link)) continue;
      const beforeTarget = path.resolve(path.dirname(file), link);
      const targetMovesWithLane = sourceRoot && isInside(sourceRoot, beforeTarget);
      const insideProject = isInside(project, beforeTarget);
      const afterTarget = path.resolve(path.dirname(movedFile), link);
      if (targetMovesWithLane || !insideProject || !lstatOrNull(beforeTarget) || beforeTarget === afterTarget) continue;
      links.push({
        file: posixRelative(project, movedFile),
        link,
        target: posixRelative(project, beforeTarget)
      });
    }
  }
}

// A record is authored on one host and edited on others, so its terminators
// can be mixed. The terminator that delimits the closing fence is the only one
// that can locate the splice point: testing the whole file instead lets a
// single pasted CRLF line in the body hide an LF fence, and the writer then
// declines to write and drops every required field in silence.
function locateClosingFence(content) {
  const open = content.match(/^---(\r\n|\n|\r)/);
  if (!open) return null;
  const close = content.slice(open[0].length).match(/(\r\n|\n|\r)---(?=\r\n|\n|\r|$)/);
  if (!close) return null;
  return { index: open[0].length + close.index, eol: close[1] };
}

// A file with no frontmatter still has a body whose terminator the created
// block must match, so adoption never manufactures a mixed-ending record.
function nativeEol(content) {
  const match = content.match(/\r\n|\n|\r/);
  return match ? match[0] : '\n';
}

function addWikiFrontmatter(project, options) {
  const memory = path.join(project, lanes.wiki, 'MEMORY.md');
  const entry = lstatOrNull(memory);
  if (!entry?.isFile() || entry.isSymbolicLink()) return;
  const content = fs.readFileSync(memory, 'utf8');
  const date = options['--date'] ?? new Date().toISOString().slice(0, 10);
  const fields = [
    ['type', ['type: memory']],
    ['status', ['status: active']],
    ['sensitivity', ['sensitivity: normal']],
    ['knowledge_role', ['knowledge_role: canonical']],
    ['provenance', ['provenance:', `  - legacy room brain migrated by LLM Workbench Adoption ${date}`]],
    ['source_paths', ['source_paths:', `  - ${lanes.wiki}/MEMORY.md`]],
    ['last_verified', [`last_verified: ${date}`]]
  ];
  const parsed = parseFrontmatter(content);
  if (!parsed.data) {
    const eol = nativeEol(content);
    const frontmatter = ['---', ...fields.flatMap(([, lines]) => lines), '---', ''].join(eol);
    writeSafeFile(project, memory, `${frontmatter}${eol}${content}`);
    return;
  }
  const missing = fields
    .filter(([name]) => parsed.data[name] === undefined)
    .flatMap(([, lines]) => lines);
  if (missing.length === 0) return;
  const fence = locateClosingFence(content);
  // parseFrontmatter returned data, so a closing fence exists in the
  // normalized text and must exist here too. If it does not, the two have
  // disagreed and splicing at a guessed offset would corrupt the record.
  if (!fence) throw new Error(`${memory} parsed as having frontmatter but carries no locatable closing fence.`);
  writeSafeFile(project, memory, `${content.slice(0, fence.index)}${fence.eol}${missing.join(fence.eol)}${content.slice(fence.index)}`);
}

function migrate(options) {
  const project = path.resolve(options['--project']);
  const home = path.resolve(options['--home'] || os.homedir());
  const failure = preflight(project, home);
  if (failure) return failure;
  let source;
  try { source = sourceIdentity(); } catch (error) { return fail('invalid-source-identity', error.message); }
  const residue = {
    rootManagedTools: RUNTIME_TOOLS.filter((name) => Boolean(lstatOrNull(path.join(project, 'tools', name)))),
    movedExternalLinks: movedExternalLinks(project)
  };
  const initialized = initialize({
    '--project': project,
    '--provenance': 'adoption',
    '--version': options['--version'],
    '--source-repository': source.repository,
    '--source-commit': source.commit,
    deferWikiSeed: Boolean(lstatOrNull(path.join(project, 'Wiki')))
  });
  if (initialized.status !== 'initialized') return fail('layout-initialization-failed', initialized.error?.message ?? 'Could not initialize the v3 support root.');
  // The declared integration branch is reported, never created or required:
  // the protocol completion checklist decides whether its absence is recorded.
  const integrationBranch = initialized.manifest.git.integrationBranch;
  residue.missingIntegrationBranch = resolveBranchRefs(project, integrationBranch).length ? null : integrationBranch;
  const moved = [];
  try {
    for (const { source, destination } of legacyLanes) {
      const sourcePath = path.join(project, source);
      if (!lstatOrNull(sourcePath)) continue;
      const target = path.join(project, destination);
      removeGitkeep(target);
      fs.rmdirSync(target);
      fs.renameSync(sourcePath, target);
      moved.push({ source, destination });
    }
    seedWiki(project, { '--version': options['--version'] });
    const legacyMemory = path.join(project, 'MEMORY.md');
    if (lstatOrNull(legacyMemory)) {
      const destination = path.join(project, lanes.wiki, 'MEMORY.md');
      fs.renameSync(legacyMemory, destination);
      moved.push({ source: 'MEMORY.md', destination: `${lanes.wiki}/MEMORY.md` });
    }
    addWikiFrontmatter(project, options);
    for (const name of rootFeedbackNames) {
      const source = path.join(project, name);
      if (!lstatOrNull(source)) continue;
      const destination = path.join(project, lanes.feedback, 'WORKBENCH_FEEDBACK.md');
      removeGitkeep(path.join(project, lanes.feedback));
      fs.renameSync(source, destination);
      moved.push({ source: name, destination: `${lanes.feedback}/WORKBENCH_FEEDBACK.md` });
    }
    const legacySkills = path.join(project, 'skills');
    if (lstatOrNull(legacySkills)) {
      const destination = path.join(project, recoveryLane, 'adoption-legacy-skills');
      fs.renameSync(legacySkills, destination);
      moved.push({ source: 'skills', destination: `${recoveryLane}/adoption-legacy-skills` });
    }
    const recoveryPath = path.join(project, recoveryLane, 'adoption-recovery.json');
    fs.writeFileSync(recoveryPath, `${JSON.stringify({ schemaVersion: 1, lifecycle: 'adoption', moved, residue }, null, 2)}\n`);
    const validation = validateManifest(project);
    if (validation.status !== 'valid') throw new Error(validation.error?.message ?? 'Migrated manifest did not validate.');
    const installed = spawnSync(process.execPath, [toolsInstaller, 'install', '--project', project], { cwd: productRoot, encoding: 'utf8' });
    const toolsReport = installed.stdout ? JSON.parse(installed.stdout) : null;
    if (installed.status !== 0 || toolsReport?.status !== 'installed') {
      throw new Error(toolsReport?.error?.message ?? (installed.stderr || 'Runtime tools install failed.'));
    }
    if (toolsReport.receipt?.source?.repository !== source.repository || toolsReport.receipt?.source?.commit !== source.commit) {
      throw new Error('Manifest and managed-tools receipt resolved different Workbench source identities.');
    }
    render(project);
    // Only a finding that blocks all or selection makes the migration a
    // failure; nonblocking findings (a moved external link, a stale claim) are
    // reported so the adopting agent repairs them next.
    const issues = doctor(project, { home });
    if (blocksSelection(issues)) throw new Error(`Adoption rendered an invalid project: ${issues.filter((issue) => issue.blocks === 'all' || issue.blocks === 'selection').map((issue) => issue.code).join(', ')}.`);
    return { status: 'complete', manifestPath: path.join('workbench', 'manifest.json'), moved, residue, recoveryPath: `${recoveryLane}/adoption-recovery.json`, tools: { status: 'installed', receipt: `${lanes.tools}/.workbench-tools.json` }, doctor: issues.length ? 'passed-with-findings' : 'passed', findings: issues.map((issue) => ({ code: issue.code, severity: issue.severity, blocks: issue.blocks, message: issue.message })) };
  } catch (error) {
    return { status: 'partial', moved, residue, error: { code: 'migration-failed', message: error.message } };
  }
}

try {
  const [command, ...args] = process.argv.slice(2);
  if (command !== 'migrate') throw new Error('Usage: workbench-adoption.mjs migrate --project PROJECT --home USER_HOME --version v3.1.4');
  const result = migrate(parseOptions(args));
  process.stdout.write(`${JSON.stringify(result)}\n`);
  if (result.status !== 'complete') process.exitCode = 1;
} catch (error) {
  process.stdout.write(`${JSON.stringify(fail('invalid-invocation', error.message))}\n`);
  process.exitCode = 1;
}

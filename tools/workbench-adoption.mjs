#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { collections, controls, coreSkills, initialize, lanes, validateManifest } from '../workbench/tools/workbench-layout.mjs';
import { doctor, render } from '../workbench/tools/spec-workbench.mjs';
import { blocksSelection } from '../workbench/tools/diagnostics.mjs';

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
const recoveryLane = collections.checkpoints;

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

function hasRequiredUserSkills(home) {
  const destinations = [path.join(home, '.agents', 'skills'), path.join(home, '.claude', 'skills')];
  return coreSkills.filter((skill) => !destinations.some((root) => lstatOrNull(path.join(root, skill))?.isDirectory()));
}

function preflight(project, home) {
  const entry = lstatOrNull(project);
  if (!entry || entry.isSymbolicLink() || !entry.isDirectory()) {
    return fail('invalid-project', `${project} must be an existing ordinary project directory.`);
  }
  const workbench = path.join(project, 'workbench');
  if (lstatOrNull(workbench)) return fail('support-root-exists', `${workbench} already exists; inspect and reconcile it before adoption.`);
  for (const control of controls) {
    const controlPath = path.join(project, control);
    const controlEntry = lstatOrNull(controlPath);
    if (!controlEntry?.isFile() || controlEntry.isSymbolicLink()) {
      return fail('missing-control', `${controlPath} must be a filled ordinary root control before adoption.`, { control });
    }
    if (/\[BRACKETED(?:_[A-Z]+)*\]/.test(fs.readFileSync(controlPath, 'utf8'))) {
      return fail('bracketed-control', `${controlPath} contains an unfilled template placeholder.`, { control });
    }
  }
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
  const legacyMemory = path.join(project, 'MEMORY.md');
  const memoryEntry = lstatOrNull(legacyMemory);
  if (memoryEntry && (memoryEntry.isSymbolicLink() || !memoryEntry.isFile())) {
    return fail('legacy-path-collision', `${legacyMemory} must be an ordinary file when present.`, { source: 'MEMORY.md' });
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

function migrate(options) {
  const project = path.resolve(options['--project']);
  const home = path.resolve(options['--home'] || os.homedir());
  const failure = preflight(project, home);
  if (failure) return failure;
  const initialized = initialize({ '--project': project, '--provenance': 'adoption', '--version': options['--version'] });
  if (initialized.status !== 'initialized') return fail('layout-initialization-failed', initialized.error?.message ?? 'Could not initialize the v3 support root.');
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
    const legacyMemory = path.join(project, 'MEMORY.md');
    if (lstatOrNull(legacyMemory)) {
      const destination = path.join(project, lanes.wiki, 'MEMORY.md');
      fs.renameSync(legacyMemory, destination);
      moved.push({ source: 'MEMORY.md', destination: `${lanes.wiki}/MEMORY.md` });
    }
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
    fs.writeFileSync(recoveryPath, `${JSON.stringify({ schemaVersion: 1, lifecycle: 'adoption', moved }, null, 2)}\n`);
    const validation = validateManifest(project);
    if (validation.status !== 'valid') throw new Error(validation.error?.message ?? 'Migrated manifest did not validate.');
    const installed = spawnSync(process.execPath, [toolsInstaller, 'install', '--project', project], { cwd: productRoot, encoding: 'utf8' });
    const toolsReport = installed.stdout ? JSON.parse(installed.stdout) : null;
    if (installed.status !== 0 || toolsReport?.status !== 'installed') {
      throw new Error(toolsReport?.error?.message ?? (installed.stderr || 'Runtime tools install failed.'));
    }
    render(project);
    // Only a finding that blocks all or selection makes the migration a
    // failure; nonblocking findings (a legacy wiki note without frontmatter,
    // a stale claim) are reported so the adopting agent repairs them next.
    const issues = doctor(project);
    if (blocksSelection(issues)) throw new Error(`Adoption rendered an invalid project: ${issues.filter((issue) => issue.blocks === 'all' || issue.blocks === 'selection').map((issue) => issue.code).join(', ')}.`);
    return { status: 'complete', manifestPath: path.join('workbench', 'manifest.json'), moved, recoveryPath: `${recoveryLane}/adoption-recovery.json`, tools: { status: 'installed', receipt: `${lanes.tools}/.workbench-tools.json` }, doctor: issues.length ? 'passed-with-findings' : 'passed', findings: issues.map((issue) => ({ code: issue.code, severity: issue.severity, blocks: issue.blocks, message: issue.message })) };
  } catch (error) {
    return { status: 'partial', moved, error: { code: 'migration-failed', message: error.message } };
  }
}

try {
  const [command, ...args] = process.argv.slice(2);
  if (command !== 'migrate') throw new Error('Usage: workbench-adoption.mjs migrate --project PROJECT --home USER_HOME --version v3.0.0');
  const result = migrate(parseOptions(args));
  process.stdout.write(`${JSON.stringify(result)}\n`);
  if (result.status !== 'complete') process.exitCode = 1;
} catch (error) {
  process.stdout.write(`${JSON.stringify(fail('invalid-invocation', error.message))}\n`);
  process.exitCode = 1;
}

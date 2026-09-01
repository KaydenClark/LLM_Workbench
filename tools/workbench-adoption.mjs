#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { controls, coreSkills, initialize, lanes, validateManifest } from './workbench-layout.mjs';
import { doctor, render } from './spec-workbench.mjs';

const legacyLanes = [
  { source: 'specs', lane: 'specs' },
  { source: 'Wiki', lane: 'wiki' },
  { source: 'feedback', lane: 'feedback' },
  { source: 'grilling diary', lane: 'grilling' },
  { source: 'handoffs', lane: 'handoffs' }
];

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
  for (const { source, lane } of legacyLanes) {
    const sourcePath = path.join(project, source);
    const sourceEntry = lstatOrNull(sourcePath);
    if (sourceEntry && (sourceEntry.isSymbolicLink() || !sourceEntry.isDirectory())) {
      return fail('legacy-path-collision', `${sourcePath} must be an ordinary directory when present.`, { source });
    }
    if (sourceEntry && lstatOrNull(path.join(project, lanes[lane]))) {
      return fail('lane-collision', `${path.join(project, lanes[lane])} already exists.`, { source, lane });
    }
  }
  const legacySkills = lstatOrNull(path.join(project, 'skills'));
  if (legacySkills && (legacySkills.isSymbolicLink() || !legacySkills.isDirectory())) {
    return fail('legacy-path-collision', `${path.join(project, 'skills')} must be an ordinary directory when present.`, { source: 'skills' });
  }
  const recoveryPath = path.join(project, lanes.handoffs, 'adoption-recovery.json');
  if (lstatOrNull(path.join(project, 'handoffs', 'adoption-recovery.json'))) {
    return fail('recovery-collision', `${recoveryPath} would overwrite an existing legacy recovery record.`);
  }
  if (legacySkills && lstatOrNull(path.join(project, 'handoffs', 'adoption-legacy-skills'))) {
    return fail('recovery-collision', `${path.join(project, lanes.handoffs, 'adoption-legacy-skills')} would overwrite an existing legacy recovery directory.`);
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
    for (const { source, lane } of legacyLanes) {
      const sourcePath = path.join(project, source);
      if (!lstatOrNull(sourcePath)) continue;
      const destination = path.join(project, lanes[lane]);
      removeGitkeep(destination);
      fs.rmdirSync(destination);
      fs.renameSync(sourcePath, destination);
      moved.push({ source, destination: lanes[lane] });
    }
    const legacySkills = path.join(project, 'skills');
    if (lstatOrNull(legacySkills)) {
      const destination = path.join(project, lanes.handoffs, 'adoption-legacy-skills');
      fs.renameSync(legacySkills, destination);
      moved.push({ source: 'skills', destination: `${lanes.handoffs}/adoption-legacy-skills` });
    }
    const recoveryPath = path.join(project, lanes.handoffs, 'adoption-recovery.json');
    fs.writeFileSync(recoveryPath, `${JSON.stringify({ schemaVersion: 1, lifecycle: 'adoption', moved }, null, 2)}\n`);
    const validation = validateManifest(project);
    if (validation.status !== 'valid') throw new Error(validation.error?.message ?? 'Migrated manifest did not validate.');
    render(project);
    const issues = doctor(project);
    if (issues.length) throw new Error(`Adoption rendered an invalid project: ${issues.map((issue) => issue.code).join(', ')}.`);
    return { status: 'complete', manifestPath: path.join('workbench', 'manifest.json'), moved, recoveryPath: path.join(lanes.handoffs, 'adoption-recovery.json'), doctor: 'passed' };
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

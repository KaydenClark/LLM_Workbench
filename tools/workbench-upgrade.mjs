#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { collections, coreSkills, validateManifest } from '../workbench/tools/workbench-layout.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = path.join(root, 'skills');
const adoptionTool = path.join(root, 'tools', 'workbench-adoption.mjs');
const managedMarker = '.workbench-skill.json';

function lstatOrNull(target) {
  try { return fs.lstatSync(target); } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

function fail(code, message, details = {}) {
  return { status: 'blocked', skillBackups: [], error: { code, message, ...details } };
}

function parseOptions(args) {
  const options = { explicit: false };
  for (let index = 0; index < args.length;) {
    const key = args[index];
    if (key === '--explicit-update') {
      if (options.explicit) throw new Error('Duplicate --explicit-update.');
      options.explicit = true;
      index += 1;
      continue;
    }
    const value = args[index + 1];
    if (!key?.startsWith('--') || !value || options[key]) throw new Error('Invalid arguments.');
    options[key] = value;
    index += 2;
  }
  for (const key of ['--project', '--home', '--version']) if (!options[key]) throw new Error(`Missing ${key}.`);
  return options;
}

function hashTree(directory, relative = '', entries = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name === managedMarker) continue;
    const target = path.join(directory, entry.name);
    const child = path.posix.join(relative, entry.name);
    const stat = fs.lstatSync(target);
    if (stat.isSymbolicLink()) throw new Error(`Skill content ${target} must not contain a symlink.`);
    if (stat.isDirectory()) hashTree(target, child, entries);
    else if (stat.isFile()) entries.push(`${child}:${fs.readFileSync(target).toString('base64')}`);
    else throw new Error(`Skill content ${target} must be a regular file or directory.`);
  }
  return entries;
}

function managed(destination) {
  const marker = lstatOrNull(path.join(destination, managedMarker));
  if (!marker?.isFile() || marker.isSymbolicLink()) return false;
  try {
    const parsed = JSON.parse(fs.readFileSync(path.join(destination, managedMarker), 'utf8'));
    return parsed.schemaVersion === 1 && parsed.source === 'LLM Workbench core';
  } catch { return false; }
}

function validateSource() {
  const names = fs.readdirSync(sourceRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
  if (JSON.stringify(names) !== JSON.stringify([...coreSkills].sort())) {
    return fail('invalid-bundled-core', 'The checked-out LLM Workbench skills directory must contain exactly the required core skills.');
  }
  for (const skill of coreSkills) if (!lstatOrNull(path.join(sourceRoot, skill, 'SKILL.md'))?.isFile()) {
    return fail('invalid-bundled-core', `Bundled skill ${skill} is missing SKILL.md.`);
  }
  return null;
}

function validateDestinationRoot(destination, home) {
  const homePath = path.resolve(home);
  for (let current = path.resolve(destination); ; current = path.dirname(current)) {
    const entry = lstatOrNull(current);
    if (entry?.isSymbolicLink() || (entry && !entry.isDirectory())) return fail('discovery-root-collision', `${current} must be an ordinary directory or absent.`);
    if (entry && lstatOrNull(path.join(current, '.git'))) return fail('foreign-git-root', `${destination} is inside Git-owned directory ${current}.`);
    if (current === homePath) break;
  }
  return null;
}

function preflight(project, home, explicit) {
  if (!explicit) return fail('explicit-update-required', 'Skill replacement requires --explicit-update; normal setup is presence-only.');
  if (!lstatOrNull(project)?.isDirectory() || lstatOrNull(project)?.isSymbolicLink()) return fail('invalid-project', `${project} must be an existing ordinary project directory.`);
  if (lstatOrNull(path.join(project, 'workbench'))) return fail('support-root-exists', `${path.join(project, 'workbench')} already exists; use normal v3 maintenance instead of the one-time upgrade.`);
  const git = spawnSync('git', ['rev-parse', '--verify', 'HEAD'], { cwd: project, encoding: 'utf8' });
  if (git.status !== 0) return fail('missing-git-recovery-point', 'Upgrade requires a committed pre-migration Git HEAD for concrete rollback proof.');
  const status = spawnSync('git', ['status', '--porcelain'], { cwd: project, encoding: 'utf8' });
  if (status.status !== 0) return fail('git-status-failed', 'Could not verify that the pre-migration worktree is clean.');
  if (status.stdout) return fail('dirty-project', 'Upgrade requires a clean project worktree so the recorded Git SHA is a complete recovery point.');
  const inventoryResult = spawnSync('git', ['ls-files', '-z'], { cwd: project, encoding: 'utf8' });
  if (inventoryResult.status !== 0) return fail('inventory-failed', 'Could not record the pre-migration tracked path inventory.');
  const destinations = [
    { engine: 'codex', root: path.join(home, '.agents', 'skills') },
    { engine: 'claude', root: path.join(home, '.claude', 'skills') }
  ];
  for (const destination of destinations) {
    const rootFailure = validateDestinationRoot(destination.root, home);
    if (rootFailure) return rootFailure;
    for (const skill of coreSkills) {
      const target = path.join(destination.root, skill);
      const entry = lstatOrNull(target);
      if (entry && (entry.isSymbolicLink() || !entry.isDirectory())) return fail('skill-path-collision', `${target} is not an ordinary directory.`);
      if (entry && !managed(target)) return fail('unmanaged-skill', `${target} is not marked as a Workbench-managed skill and will not be replaced.`);
    }
  }
  return { gitSha: git.stdout.trim(), inventory: inventoryResult.stdout.split('\0').filter(Boolean), destinations };
}

function updateSkills(destinations, home) {
  const backupRoot = fs.mkdtempSync(path.join(home, '.workbench-upgrade-backup-'));
  const skillBackups = [];
  for (const { engine, root: destinationRoot } of destinations) {
    fs.mkdirSync(destinationRoot, { recursive: true });
    for (const skill of coreSkills) {
      const destination = path.join(destinationRoot, skill);
      const changed = lstatOrNull(destination) && JSON.stringify(hashTree(destination)) !== JSON.stringify(hashTree(path.join(sourceRoot, skill)));
      if (changed) {
        const backup = path.join(backupRoot, engine, skill);
        fs.mkdirSync(path.dirname(backup), { recursive: true });
        fs.cpSync(destination, backup, { recursive: true, force: false, errorOnExist: true, verbatimSymlinks: true });
        fs.rmSync(destination, { recursive: true, force: false });
        skillBackups.push({ engine, skill, path: backup });
      }
      if (!lstatOrNull(destination)) {
        fs.cpSync(path.join(sourceRoot, skill), destination, { recursive: true, force: false, errorOnExist: true, verbatimSymlinks: true });
        fs.writeFileSync(path.join(destination, managedMarker), `${JSON.stringify({ schemaVersion: 1, source: 'LLM Workbench core' })}\n`);
      }
    }
  }
  return skillBackups;
}

function upgrade(options) {
  const project = path.resolve(options['--project']);
  const home = path.resolve(options['--home']);
  const sourceFailure = validateSource();
  if (sourceFailure) return sourceFailure;
  const readiness = preflight(project, home, options.explicit);
  if (readiness.status === 'blocked') return readiness;
  let skillBackups = [];
  try {
    skillBackups = updateSkills(readiness.destinations, home);
    const adoption = spawnSync(process.execPath, [adoptionTool, 'migrate', '--project', project, '--home', home, '--version', options['--version']], { cwd: root, encoding: 'utf8' });
    const adoptionReport = adoption.stdout ? JSON.parse(adoption.stdout) : null;
    if (adoption.status !== 0 || adoptionReport?.status !== 'complete') {
      throw new Error(adoptionReport?.error?.message ?? (adoption.stderr || 'Adoption migration failed.'));
    }
    const manifestPath = path.join(project, 'workbench', 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    manifest.provenance = { ...manifest.provenance, lifecycle: 'upgrade' };
    fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    const validation = validateManifest(project);
    if (validation.status !== 'valid') throw new Error(validation.error.message);
    const recoveryPath = path.join(collections.checkpoints, 'upgrade-recovery.json');
    const receipt = JSON.parse(fs.readFileSync(path.join(project, 'workbench', 'tools', '.workbench-tools.json'), 'utf8'));
    const tools = { status: 'installed', receipt: `${validation.manifest.lanes.tools}/.workbench-tools.json`, source: receipt.source };
    fs.writeFileSync(path.join(project, recoveryPath), `${JSON.stringify({ schemaVersion: 1, lifecycle: 'upgrade', preMigration: { gitSha: readiness.gitSha, inventory: readiness.inventory }, skillBackups, tools }, null, 2)}\n`);
    return { status: 'complete', manifestPath: path.join('workbench', 'manifest.json'), recoveryPath, skillBackups, tools, migration: adoptionReport };
  } catch (error) {
    return { status: 'partial', skillBackups, error: { code: 'upgrade-failed', message: error.message } };
  }
}

try {
  const [command, ...args] = process.argv.slice(2);
  if (command !== 'upgrade') throw new Error('Usage: workbench-upgrade.mjs upgrade --project PROJECT --home USER_HOME --version v3.0.0 --explicit-update');
  const result = upgrade(parseOptions(args));
  process.stdout.write(`${JSON.stringify(result)}\n`);
  if (result.status !== 'complete') process.exitCode = 1;
} catch (error) {
  process.stdout.write(`${JSON.stringify(fail('invalid-invocation', error.message))}\n`);
  process.exitCode = 1;
}

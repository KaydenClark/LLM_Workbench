#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { collections, coreSkills, validateManifest } from '../workbench/tools/workbench-layout.mjs';
import { sourceIdentity } from './workbench-tools.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// S-00V: the core skills ship in the room. The one-time upgrade lays the
// skills lane down through Adoption's migration from this release's own lane
// and never reads or replaces skills in the provider home.
const sourceRoot = path.join(root, 'workbench', 'skills');
const adoptionTool = path.join(root, 'tools', 'workbench-adoption.mjs');

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
  const options = { explicit: false, layoutOnly: false };
  for (let index = 0; index < args.length;) {
    const key = args[index];
    if (key === '--explicit-update') {
      if (options.explicit) throw new Error('Duplicate --explicit-update.');
      options.explicit = true;
      index += 1;
      continue;
    }
    if (key === '--layout-only') {
      if (options.layoutOnly) throw new Error('Duplicate --layout-only.');
      options.layoutOnly = true;
      index += 1;
      continue;
    }
    const value = args[index + 1];
    if (!key?.startsWith('--') || !value || options[key]) throw new Error('Invalid arguments.');
    options[key] = value;
    index += 2;
  }
  for (const key of ['--project', '--home', '--version']) if (!options[key]) throw new Error(`Missing ${key}.`);
  if (options.explicit && options.layoutOnly) throw new Error('--explicit-update and --layout-only are exclusive modes; choose one.');
  return options;
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

// Both modes lay the skills lane down inside the room from this release; the
// provider home is never read, compared, marked, backed up, or replaced. The
// two flags remain the explicit opt-in every one-time upgrade requires.
function preflight(project, home, explicit, layoutOnly = false) {
  if (!explicit && !layoutOnly) return fail('explicit-update-required', 'The one-time upgrade requires --explicit-update or --layout-only.');
  if (!lstatOrNull(project)?.isDirectory() || lstatOrNull(project)?.isSymbolicLink()) return fail('invalid-project', `${project} must be an existing ordinary project directory.`);
  if (lstatOrNull(path.join(project, 'workbench'))) return fail('support-root-exists', `${path.join(project, 'workbench')} already exists; use normal v3 maintenance instead of the one-time upgrade.`);
  const git = spawnSync('git', ['rev-parse', '--verify', 'HEAD'], { cwd: project, encoding: 'utf8' });
  if (git.status !== 0) return fail('missing-git-recovery-point', 'Upgrade requires a committed pre-migration Git HEAD for concrete rollback proof.');
  const status = spawnSync('git', ['status', '--porcelain'], { cwd: project, encoding: 'utf8' });
  if (status.status !== 0) return fail('git-status-failed', 'Could not verify that the pre-migration worktree is clean.');
  if (status.stdout) return fail('dirty-project', 'Upgrade requires a clean project worktree so the recorded Git SHA is a complete recovery point.');
  const inventoryResult = spawnSync('git', ['ls-files', '-z'], { cwd: project, encoding: 'utf8' });
  if (inventoryResult.status !== 0) return fail('inventory-failed', 'Could not record the pre-migration tracked path inventory.');
  return { gitSha: git.stdout.trim(), inventory: inventoryResult.stdout.split('\0').filter(Boolean) };
}

function upgrade(options) {
  const project = path.resolve(options['--project']);
  const home = path.resolve(options['--home']);
  const sourceFailure = validateSource();
  if (sourceFailure) return sourceFailure;
  try {
    sourceIdentity({ managedPaths: ['workbench/skills', 'workbench/tools', 'templates'] });
  } catch (error) { return fail('invalid-source-identity', error.message); }
  const readiness = preflight(project, home, options.explicit, options.layoutOnly);
  if (readiness.status === 'blocked') return readiness;
  const skills = 'lane-install';
  const skillBackups = [];
  const coreRecovery = null;
  try {
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
    const recoveryPath = path.join(collections.recovery, 'upgrade-recovery.json');
    const receipt = JSON.parse(fs.readFileSync(path.join(project, 'workbench', 'tools', '.workbench-tools.json'), 'utf8'));
    const tools = { status: 'installed', receipt: `${validation.manifest.lanes.tools}/.workbench-tools.json`, source: receipt.source };
    const skillsReceipt = JSON.parse(fs.readFileSync(path.join(project, validation.manifest.lanes.skills, '.workbench-skills.json'), 'utf8'));
    const skillsLane = { status: 'installed', receipt: `${validation.manifest.lanes.skills}/.workbench-skills.json`, source: skillsReceipt.source };
    fs.writeFileSync(path.join(project, recoveryPath), `${JSON.stringify({ schemaVersion: 1, lifecycle: 'upgrade', skills, preMigration: { gitSha: readiness.gitSha, inventory: readiness.inventory }, skillBackups, coreRecovery, tools, skillsLane }, null, 2)}\n`);
    return { status: 'complete', manifestPath: path.join('workbench', 'manifest.json'), recoveryPath, skills, skillBackups, coreRecovery, tools, skillsLane, migration: adoptionReport };
  } catch (error) {
    return { status: 'partial', skillBackups, coreRecovery, error: { code: 'upgrade-failed', message: error.message } };
  }
}

try {
  const [command, ...args] = process.argv.slice(2);
  if (command !== 'upgrade') throw new Error('Usage: workbench-upgrade.mjs upgrade --project PROJECT --home USER_HOME --version v3.2.1 (--explicit-update | --layout-only)');
  const result = upgrade(parseOptions(args));
  process.stdout.write(`${JSON.stringify(result)}\n`);
  if (result.status !== 'complete') process.exitCode = 1;
} catch (error) {
  process.stdout.write(`${JSON.stringify(fail('invalid-invocation', error.message))}\n`);
  process.exitCode = 1;
}

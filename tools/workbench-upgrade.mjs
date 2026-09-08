#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { collections, coreSkills, validateManifest } from '../workbench/tools/workbench-layout.mjs';
import { updateCoreSkills } from './core-skill-installer.mjs';
import { missingSkills } from './skill-presence.mjs';
import { sourceIdentity } from './workbench-tools.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = path.join(root, 'skills');
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

// The layout-only mode reads skill presence exactly as Adoption does, and now
// exactly as the installer does: every required core skill must be reachable in
// a discovery root, and nothing there is compared, marked, backed up, or
// replaced. S-045 TK-001 moved the judgment into `skill-presence.mjs` so the
// gate and the installer cannot drift apart again - `lstat` does not follow a
// link, so judging with it alone refused a host the installer accepted.
function missingUserSkills(home) {
  return missingSkills(home, coreSkills);
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

// A correct refusal that withholds its exit transfers its whole cost onto the
// agent that meets it, so both shared-skill gates name the route that clears
// them and why that route is not blocked by the same condition.
const layoutOnlyRoute = 'The support-root-only route --layout-only clears this gate: it migrates the support root and never installs, compares, marks, backs up, or replaces a skill.';

function preflight(project, home, explicit, layoutOnly = false) {
  if (!explicit && !layoutOnly) return fail('explicit-update-required', 'Skill replacement requires --explicit-update; the support-root-only route requires --layout-only.');
  if (!lstatOrNull(project)?.isDirectory() || lstatOrNull(project)?.isSymbolicLink()) return fail('invalid-project', `${project} must be an existing ordinary project directory.`);
  if (lstatOrNull(path.join(project, 'workbench'))) return fail('support-root-exists', `${path.join(project, 'workbench')} already exists; use normal v3 maintenance instead of the one-time upgrade.`);
  const git = spawnSync('git', ['rev-parse', '--verify', 'HEAD'], { cwd: project, encoding: 'utf8' });
  if (git.status !== 0) return fail('missing-git-recovery-point', 'Upgrade requires a committed pre-migration Git HEAD for concrete rollback proof.');
  const status = spawnSync('git', ['status', '--porcelain'], { cwd: project, encoding: 'utf8' });
  if (status.status !== 0) return fail('git-status-failed', 'Could not verify that the pre-migration worktree is clean.');
  if (status.stdout) return fail('dirty-project', 'Upgrade requires a clean project worktree so the recorded Git SHA is a complete recovery point.');
  const inventoryResult = spawnSync('git', ['ls-files', '-z'], { cwd: project, encoding: 'utf8' });
  if (inventoryResult.status !== 0) return fail('inventory-failed', 'Could not record the pre-migration tracked path inventory.');
  if (layoutOnly) {
    const missingSkills = missingUserSkills(home);
    if (missingSkills.length) return fail('missing-user-skills', 'Layout-only upgrade requires every core skill to be present in a user-scoped Codex or Claude discovery root; it never installs or replaces one.', { missingSkills });
    return { gitSha: git.stdout.trim(), inventory: inventoryResult.stdout.split('\0').filter(Boolean), destinations: [] };
  }
  return { gitSha: git.stdout.trim(), inventory: inventoryResult.stdout.split('\0').filter(Boolean) };
}

function upgrade(options) {
  const project = path.resolve(options['--project']);
  const home = path.resolve(options['--home']);
  const sourceFailure = validateSource();
  if (sourceFailure) return sourceFailure;
  try {
    sourceIdentity({ managedPaths: options.layoutOnly ? ['workbench/tools', 'templates'] : ['skills', 'workbench/tools', 'templates'] });
  } catch (error) { return fail('invalid-source-identity', error.message); }
  const readiness = preflight(project, home, options.explicit, options.layoutOnly);
  if (readiness.status === 'blocked') return readiness;
  const skills = options.layoutOnly ? 'presence-only' : 'explicit-update';
  let skillBackups = [];
  let coreRecovery = null;
  try {
    if (!options.layoutOnly) {
      const updated = updateCoreSkills(home, { explicit: true });
      if (updated.status !== 'updated') return { ...updated, skillBackups: updated.skillBackups ?? [], error: { ...updated.error, message: `${updated.error.message} ${layoutOnlyRoute}` } };
      skillBackups = updated.skillBackups;
      coreRecovery = updated.backup;
    }
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
    fs.writeFileSync(path.join(project, recoveryPath), `${JSON.stringify({ schemaVersion: 1, lifecycle: 'upgrade', skills, preMigration: { gitSha: readiness.gitSha, inventory: readiness.inventory }, skillBackups, coreRecovery, tools }, null, 2)}\n`);
    return { status: 'complete', manifestPath: path.join('workbench', 'manifest.json'), recoveryPath, skills, skillBackups, coreRecovery, tools, migration: adoptionReport };
  } catch (error) {
    return { status: 'partial', skillBackups, coreRecovery, error: { code: 'upgrade-failed', message: error.message } };
  }
}

try {
  const [command, ...args] = process.argv.slice(2);
  if (command !== 'upgrade') throw new Error('Usage: workbench-upgrade.mjs upgrade --project PROJECT --home USER_HOME --version v3.1.4 (--explicit-update | --layout-only)');
  const result = upgrade(parseOptions(args));
  process.stdout.write(`${JSON.stringify(result)}\n`);
  if (result.status !== 'complete') process.exitCode = 1;
} catch (error) {
  process.stdout.write(`${JSON.stringify(fail('invalid-invocation', error.message))}\n`);
  process.exitCode = 1;
}

#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = path.join(root, 'skills');
import { coreSkills } from '../workbench/tools/workbench-layout.mjs';
import { markerSourceIdentity, writeManagedMarker, readManagedMarker, skillContentHash } from './skill-marker.mjs';
import { lstatOrNull, presentSkillPath, resolveSkillLink } from './skill-presence.mjs';
import { isMainModule } from '../workbench/tools/workbench-paths.mjs';

function fail(code, message, details = {}) {
  return { status: 'blocked', requiredSkills: coreSkills, installed: [], skipped: [], error: { code, message, ...details } };
}

function validateSource() {
  const names = fs.readdirSync(sourceRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  const expected = [...coreSkills].sort();
  if (JSON.stringify(names) !== JSON.stringify(expected)) {
    return fail('invalid-bundled-core',
      'The checked-out LLM Workbench skills directory must contain exactly the required core skills.',
      { expected, actual: names });
  }
  for (const skill of coreSkills) {
    const skillFile = path.join(sourceRoot, skill, 'SKILL.md');
    if (!lstatOrNull(skillFile)?.isFile()) {
      return fail('invalid-bundled-core', `Bundled skill ${skill} is missing SKILL.md.`, { skill });
    }
  }
  return null;
}

// Resolve supported linked discovery roots before writing. Normal setup adds
// only missing names; explicit replacement additionally verifies management,
// excludes managed paths from personal Git, and records restorable backups.
// Neither path stages or commits personal source.
function resolveDestinationRoot(destination) {
  const missing = [];
  let current = path.resolve(destination);
  for (;;) {
    const entry = lstatOrNull(current);
    if (entry) {
      if (!entry.isSymbolicLink() && !entry.isDirectory()) {
        return { error: fail('discovery-root-collision',
          `Discovery root ancestor ${current} must be a directory, a link to one, or absent.`,
          { destination, ancestor: current }) };
      }
      let resolved;
      try {
        resolved = fs.realpathSync.native(current);
      } catch (error) {
        if (error.code !== 'ENOENT' && error.code !== 'ELOOP' && error.code !== 'ENOTDIR') throw error;
        return { error: fail('discovery-root-collision',
          `Discovery root ancestor ${current} is a link that does not resolve to a directory.`,
          { destination, ancestor: current }) };
      }
      if (!lstatOrNull(resolved)?.isDirectory()) {
        return { error: fail('discovery-root-collision',
          `Discovery root ancestor ${current} must be a directory, a link to one, or absent.`,
          { destination, ancestor: current }) };
      }
      return { root: path.join(resolved, ...missing.reverse()) };
    }
    const parent = path.dirname(current);
    if (parent === current) {
      return { error: fail('discovery-root-collision',
        `Discovery root ${destination} has no existing ancestor to install into.`, { destination }) };
    }
    missing.push(path.basename(current));
    current = parent;
  }
}

function gitOwner(directory) {
  for (let current = directory; ; current = path.dirname(current)) {
    if (lstatOrNull(path.join(current, '.git'))) return current;
    const parent = path.dirname(current);
    if (parent === current) return null;
  }
}

function validateDestinations(destinations) {
  const resolved = [];
  const gitOwnedRoots = [];
  for (const { engine, root: destinationRoot } of destinations) {
    const outcome = resolveDestinationRoot(destinationRoot);
    if (outcome.error) return { error: outcome.error };
    const owner = gitOwner(outcome.root);
    if (owner && !gitOwnedRoots.includes(owner)) gitOwnedRoots.push(owner);
    resolved.push({ engine, root: outcome.root, declared: destinationRoot });
    for (const skill of coreSkills) {
      const destination = path.join(outcome.root, skill);
      const entry = lstatOrNull(destination);
      if (!entry) continue;
      if (entry.isSymbolicLink()) {
        if (resolveSkillLink(destination)) continue;
        return { error: fail('skill-path-collision',
          `Skill destination ${destination} is a link whose target is not a directory already holding ${skill}/SKILL.md. Remove or relocate the collision, then retry.`,
          { engine, skill, destination }) };
      }
      if (!entry.isDirectory()) {
        return { error: fail('skill-path-collision',
          `Skill destination ${destination} is not an ordinary directory. Remove or relocate the collision, then retry.`,
          { engine, skill, destination }) };
      }
      if (!lstatOrNull(path.join(destination, 'SKILL.md'))?.isFile()) {
        return { error: fail('skill-path-collision', `Existing ${destination} has no ordinary SKILL.md; preserve and reconcile it before installing adapters.`, { engine, skill, destination }) };
      }
    }
  }
  return { destinations: resolved, gitOwnedRoots };
}

function gitRead(directory, args) {
  const result = spawnSync('git', args, { cwd: directory, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`Git could not inspect managed skill exclusions: ${result.stderr.trim()}`);
  return result.stdout.trim();
}

function exclusionPlans(destinations, all = false) {
  const plans = new Map();
  for (const { root: directory } of destinations) {
    const owner = gitOwner(directory);
    const missing = coreSkills.filter(skill => all || !presentSkillPath(path.join(directory, skill)));
    if (!missing.length) continue;
    const file = owner
      ? path.join(gitRead(owner, ['rev-parse', '--path-format=absolute', '--git-common-dir']), 'info', 'exclude')
      : path.join(directory, '.gitignore');
    for (let ancestor = path.dirname(file); ; ancestor = path.dirname(ancestor)) {
      const current = lstatOrNull(ancestor);
      if (current && (current.isSymbolicLink() || !current.isDirectory())) throw new Error('Managed exclusion ancestors must be ordinary directories');
      if (path.dirname(ancestor) === ancestor) break;
    }
    const entry = lstatOrNull(file);
    if (entry && (!entry.isFile() || entry.isSymbolicLink() || entry.nlink > 1)) throw new Error('Managed exclusions require an ordinary, unshared file');
    const tracked = owner ? gitRead(owner, ['ls-files', '-z']).split('\0').filter(Boolean).map(relative => {
      const target = path.resolve(owner, relative);
      const parent = resolveDestinationRoot(path.dirname(target));
      if (parent.error) throw new Error('Tracked core ancestry cannot be resolved safely');
      return path.join(parent.root, path.basename(target));
    }) : [];
    const plan = plans.get(file) ?? { file, owner, original: entry ? fs.readFileSync(file) : null, paths: new Set() };
    for (const skill of missing) {
      const relative = path.relative(owner ?? directory, path.join(directory, skill)).split(path.sep).join('/');
      const destination = path.join(directory, skill);
      const installed = lstatOrNull(destination);
      const physical = installed?.isDirectory() ? fs.realpathSync.native(destination) : destination;
      if (tracked.some(target => {
        const indexed = lstatOrNull(target);
        return target === physical || target.startsWith(physical + path.sep) ||
          (installed && indexed && installed.dev === indexed.dev && installed.ino === indexed.ino);
      })) throw new Error('A core path is still tracked; prepare an owner-reviewed tracked-core migration first');
      plan.paths.add(relative);
    }
    plans.set(file, plan);
  }
  return [...plans.values()];
}

function writeExclusions(plans) {
  const written = [];
  try {
    for (const plan of plans) {
      fs.mkdirSync(path.dirname(plan.file), { recursive: true });
      const before = plan.original ?? Buffer.alloc(0);
      // No trailing slash: the same exclusion must cover a directory adapter.
      const lines = [...plan.paths].map(relative => '/' + relative.replace(/[\\!# *?\[\]]/g, '\\$&'));
      const addition = (before.length && before.at(-1) !== 10 ? '\n' : '') + '# Workbench managed core; personal source remains owner-controlled.\n' + lines.join('\n') + '\n';
      fs.writeFileSync(plan.file, Buffer.concat([before, Buffer.from(addition)]));
      written.push(plan);
      if (plan.owner) {
        for (const relative of plan.paths) {
          const checked = spawnSync('git', ['check-ignore', '--no-index', '-q', '--', relative], { cwd: plan.owner });
          if (checked.status !== 0) throw new Error('Project ignore rules override the managed core exclusion; reconcile them before installing');
        }
      }
    }
  } catch (error) {
    for (const plan of written.reverse()) {
      if (plan.original) fs.writeFileSync(plan.file, plan.original);
      else fs.unlinkSync(plan.file);
    }
    throw error;
  }
}

function parseHome(argv) {
  if (argv.length === 0) return os.homedir();
  if (argv.length === 2 && argv[0] === '--home' && argv[1]) return path.resolve(argv[1]);
  throw new Error('Usage: node tools/core-skill-installer.mjs install [--home USER_HOME]');
}

function install(home) {
  const destinations = [
    { engine: 'codex', root: path.join(home, '.agents', 'skills') },
    { engine: 'claude', root: path.join(home, '.claude', 'skills') }
  ];
  const sourceFailure = validateSource();
  if (sourceFailure) return sourceFailure;
  let identity;
  try { identity = markerSourceIdentity(); } catch (error) { return fail('invalid-source-identity', error.message); }
  const validated = validateDestinations(destinations);
  if (validated.error) return validated.error;
  let exclusions;
  try { exclusions = exclusionPlans(validated.destinations); }
  catch (error) { return fail('skill-exclusion-conflict', error.message); }

  // `resolvedRoots` names each declared discovery root beside the directory it
  // actually resolved to. They differ whenever a root is a link, and two
  // declared roots can resolve to one directory - which is why a skill can be
  // installed once and reported as already-present for the second engine.
  const report = {
    status: 'complete', requiredSkills: coreSkills, installed: [], skipped: [],
    gitOwnedRoots: validated.gitOwnedRoots,
    resolvedRoots: validated.destinations.map(({ engine, declared, root: resolved }) => ({ engine, declared, resolved }))
  };
  try {
    writeExclusions(exclusions);
    const canonicalRoot = validated.destinations.find(destination => destination.engine === 'codex').root;
    for (const { engine, root: destinationRoot } of validated.destinations) {
      fs.mkdirSync(destinationRoot, { recursive: true });
      for (const skill of coreSkills) {
        const destination = path.join(destinationRoot, skill);
        const present = presentSkillPath(destination);
        if (present) {
          report.skipped.push({ engine, skill, reason: 'already-present', destination, resolved: present });
          continue;
        }
        if (engine === 'claude') {
          const canonical = path.join(canonicalRoot, skill);
          fs.symlinkSync(path.relative(destinationRoot, canonical), destination, 'dir');
          report.installed.push({ engine, skill, destination, kind: 'adapter', canonical });
        } else {
          fs.cpSync(path.join(sourceRoot, skill), destination, { recursive: true, force: false, errorOnExist: true, verbatimSymlinks: true });
          const marker = writeManagedMarker(destination, identity);
          report.installed.push({ engine, skill, destination, kind: 'implementation', release: marker.release, commit: marker.commit });
        }
      }
    }
    return report;
  } catch (error) {
    return {
      ...report,
      status: 'partial',
      error: {
        code: 'install-failed',
        message: error.message
      }
    };
  }
}

function entryHash(target) {
  const entry = lstatOrNull(target);
  if (!entry) return null;
  const hash = createHash('sha256');
  if (entry.isSymbolicLink()) return hash.update('link\0').update(fs.readlinkSync(target)).digest('hex');
  if (!entry.isDirectory()) throw new Error('Managed core entries must be ordinary directories or recorded adapters');
  function walk(directory, relative = '') {
    for (const name of fs.readdirSync(directory).sort()) {
      const file = path.join(directory, name), child = relative + name;
      const stat = fs.lstatSync(file);
      if (stat.isDirectory()) { hash.update(`directory\0${child}\0`); walk(file, child + '/'); }
      else if (stat.isFile() && stat.nlink === 1) hash.update(`file\0${child}\0${stat.mode & 0o777}\0`).update(fs.readFileSync(file)).update('\0');
      else throw new Error('Managed core content must not contain links or special files');
    }
  }
  walk(target);
  return hash.digest('hex');
}

function maintenanceDestinations(home) {
  const validated = validateDestinations([
    { engine: 'codex', root: path.join(home, '.agents/skills') },
    { engine: 'claude', root: path.join(home, '.claude/skills') }
  ]);
  if (validated.error) throw Object.assign(new Error(validated.error.error.message), { code: validated.error.error.code });
  return validated.destinations;
}

function restoreEntries(backup, entries) {
  for (const entry of entries) {
    const saved = path.join(backup, entry.engine, entry.skill);
    if (entry.before !== null && entryHash(saved) !== entry.before) throw new Error('Recorded core backup bytes do not match their recovery hash');
  }
  for (const entry of entries) {
    if (lstatOrNull(entry.destination)) fs.rmSync(entry.destination, { recursive: true });
    if (entry.before !== null) fs.cpSync(path.join(backup, entry.engine, entry.skill), entry.destination, { recursive: true, force: false, errorOnExist: true, verbatimSymlinks: true });
    if (entryHash(entry.destination) !== entry.before) throw new Error('Core restoration read-back failed');
  }
}

export function updateCoreSkills(home, { explicit = false } = {}) {
  if (!explicit) return fail('explicit-update-required', 'Core replacement requires --explicit-update.');
  let backup; let entries = []; let attempted = false;
  try {
    const sourceFailure = validateSource();
    if (sourceFailure) return sourceFailure;
    const identity = markerSourceIdentity();
    if (gitOwner(fs.realpathSync.native(home))) return fail('foreign-git-root', 'The provider home itself is Git-owned; choose a private backup home before explicit core replacement.');
    const destinations = maintenanceDestinations(home);
    const canonicalRoot = destinations.find(item => item.engine === 'codex').root;
    const visited = new Set();
    for (const { engine, root: directory } of destinations) {
      for (const skill of coreSkills) {
        const destination = path.join(directory, skill);
        if (visited.has(destination)) continue;
        visited.add(destination);
        const stat = lstatOrNull(destination);
        if (stat && !readManagedMarker(destination)) return fail('unmanaged-skill', 'Explicit update preserves an unmanaged same-named skill; reconcile its ownership first.', { engine, skill });
        if (engine === 'codex' && stat?.isSymbolicLink()) return fail('skill-path-collision', 'Canonical core source is linked; prepare its ownership migration before replacement.', { skill });
        const before = entryHash(destination);
        entries.push({ engine, skill, destination, before, contentChanged: Boolean(stat?.isDirectory() && skillContentHash(destination) !== skillContentHash(path.join(sourceRoot, skill))) });
      }
    }
    const exclusions = exclusionPlans(destinations, true);
    // Backup storage must remain outside a Git-owned home. A personal .agents
    // checkout is supported; versioning the entire home needs an explicit route.

    backup = fs.mkdtempSync(path.join(home, '.workbench-core-backup-'));
    for (const entry of entries) {
      if (entry.before === null) continue;
      const saved = path.join(backup, entry.engine, entry.skill);
      fs.mkdirSync(path.dirname(saved), { recursive: true });
      fs.cpSync(entry.destination, saved, { recursive: true, force: false, errorOnExist: true, verbatimSymlinks: true });
      if (entryHash(saved) !== entry.before) throw new Error('Core backup read-back failed');
    }
    const record = { schemaVersion: 1, home: fs.realpathSync.native(home), source: identity, entries };
    const recordPath = path.join(backup, 'recovery.json');
    fs.writeFileSync(recordPath, JSON.stringify(record, null, 2) + '\n', { mode: 0o600 });
    if (entries.some(entry => entryHash(entry.destination) !== entry.before)) throw new Error('Installed core changed during backup; read and reconcile again');
    writeExclusions(exclusions);
    attempted = true;
    for (const entry of entries) {
      if (lstatOrNull(entry.destination)) fs.rmSync(entry.destination, { recursive: true });
      fs.mkdirSync(path.dirname(entry.destination), { recursive: true });
      if (entry.engine === 'codex') {
        fs.cpSync(path.join(sourceRoot, entry.skill), entry.destination, { recursive: true, force: false, errorOnExist: true });
        writeManagedMarker(entry.destination, identity);
      } else fs.symlinkSync(path.relative(path.dirname(entry.destination), path.join(canonicalRoot, entry.skill)), entry.destination, 'dir');
    }
    for (const entry of entries) {
      const resolved = fs.realpathSync.native(entry.destination);
      const canonical = fs.realpathSync.native(path.join(canonicalRoot, entry.skill));
      if (resolved !== canonical || skillContentHash(resolved) !== skillContentHash(path.join(sourceRoot, entry.skill))) throw new Error('Updated core or adapter read-back failed');
      entry.after = entryHash(entry.destination);
    }
    fs.writeFileSync(recordPath, JSON.stringify(record, null, 2) + '\n', { mode: 0o600 });
    return { status: 'updated', backup, source: identity, skillBackups: entries.filter(entry => entry.contentChanged).map(entry => ({ engine: entry.engine, skill: entry.skill, path: path.join(backup, entry.engine, entry.skill) })), verification: 'source identity, recorded backups, canonical adapter targets and content read-back' };
  } catch (error) {
    if (attempted) {
      try { restoreEntries(backup, entries); }
      catch (restore) { return { status: 'partial', backup, error: { code: 'core-recovery-required', message: `${error.message}; restoration failed: ${restore.message}` } }; }
    }
    return { ...fail(error.code ?? 'core-update-failed', error.message), ...(backup ? { backup } : {}) };
  }
}

export function rollbackCoreSkills(home, backupPath) {
  let attempted = false;
  try {
    if (!backupPath) throw new Error('--backup must name a recorded core backup');
    const backup = path.resolve(backupPath), homePath = fs.realpathSync.native(home);
    if (path.dirname(fs.realpathSync.native(backup)) !== homePath || !path.basename(backup).startsWith('.workbench-core-backup-') || fs.lstatSync(backup).isSymbolicLink()) throw new Error('Backup must be an ordinary recorded directory in this provider home');
    const file = path.join(backup, 'recovery.json');
    if (!fs.lstatSync(file).isFile() || fs.lstatSync(file).nlink !== 1) throw new Error('Recovery metadata must be an ordinary file');
    const record = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (record.schemaVersion !== 1 || record.home !== homePath || !Array.isArray(record.entries) || !record.entries.length) throw new Error('Core recovery metadata does not match this home');
    if (gitOwner(homePath)) throw new Error('The provider home became Git-owned; reconcile backup ownership before rollback');
    const destinations = maintenanceDestinations(home);
    // Recheck current Git ownership as well as bytes: an owner may have begun
    // tracking an installed skill after the update. Read-only planning refuses
    // that migration before restoration can change a tracked implementation.
    exclusionPlans(destinations, true);
    const expected = new Set(destinations.flatMap(item => coreSkills.map(skill => path.join(item.root, skill))));
    if (record.entries.length !== expected.size) throw new Error('Recovery must name the complete installed core destination set');
    const seen = new Set();
    const entries = record.entries.map(entry => {
      if (entry.before !== null && !/^[a-f0-9]{64}$/.test(entry.before ?? '')) throw new Error('Recovery has an invalid original entry hash');
      if (!coreSkills.includes(entry.skill) || !['codex', 'claude'].includes(entry.engine)) throw new Error('Recovery names an unknown core destination');
      const destination = path.join(destinations.find(item => item.engine === entry.engine).root, entry.skill);
      if (destination !== entry.destination || seen.has(destination)) throw new Error('Recovery destination changed or is duplicated');
      seen.add(destination);
      if (typeof entry.after !== 'string' || entryHash(destination) !== entry.after) throw new Error('Core changed after update; preserve the new work before rollback');
      const savedRoot = path.join(backup, entry.engine);
      if (lstatOrNull(savedRoot)?.isSymbolicLink()) throw new Error('Backup ancestry must not be linked');
      return { ...entry, destination };
    });
    // Validate every saved entry before restoring any current entry.
    for (const entry of entries) if (entry.before !== null && entryHash(path.join(backup, entry.engine, entry.skill)) !== entry.before) throw new Error('Core backup is missing or changed');
    attempted = true;
    restoreEntries(backup, entries);
    return { status: 'rolled-back', backup, restored: entries.length, verification: 'original entry hashes and adapter topology read back; managed privacy exclusions retained' };
  } catch (error) {
    return { status: attempted ? 'partial' : 'blocked', error: { code: 'core-rollback-failed', message: error.message } };
  }
}

if (isMainModule(import.meta.url)) try {
  const [command, ...args] = process.argv.slice(2);
  let report;
  if (command === 'install') report = install(parseHome(args));
  else {
    const options = {};
    for (let index = 0; index < args.length; index += 1) {
      const key = args[index];
      if (!['--home', '--backup', '--explicit-update'].includes(key) || Object.hasOwn(options, key)) throw new Error('Unknown or duplicate maintenance argument');
      options[key] = key === '--explicit-update' ? true : args[++index];
      if (!options[key]) throw new Error('Missing maintenance argument value');
    }
    const home = path.resolve(options['--home'] ?? os.homedir());
    if (command === 'update' && !options['--backup']) report = updateCoreSkills(home, { explicit: options['--explicit-update'] === true });
    else if (command === 'rollback' && !options['--explicit-update']) report = rollbackCoreSkills(home, options['--backup']);
    else throw new Error('Usage: core-skill-installer.mjs install|update|rollback [--home HOME] [--explicit-update] [--backup DIR]');
  }
  process.stdout.write(`${JSON.stringify(report)}\n`);
  if (!['complete', 'updated', 'rolled-back'].includes(report.status)) process.exitCode = 1;
} catch (error) {
  process.stdout.write(`${JSON.stringify(fail('invalid-invocation', error.message))}\n`);
  process.exitCode = 1;
}

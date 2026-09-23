#!/usr/bin/env node
// Install, verify, update, and roll back the Workbench-managed core skills in
// a project's manifest-declared skills lane (S-00V: skills ship in the room).
//
// The canonical source is the released Workbench's own `workbench/skills/`
// lane (this checkout). Every install copies each required core skill into
// the room's lane, writes a receipt naming the exact source repository,
// release and commit plus a content hash per skill, and lays down the two
// tracked discovery adapters (`.agents/skills`, `.claude/skills`) as relative
// links into the lane so Codex and Claude Code discover the skills from a
// clone. Managed skills change only through `update --explicit-update`, which
// backs up the previous directories under the user home and records the
// rollback path. Skills the room adds to the lane under other names are
// room-owned: never copied, hashed, replaced or removed here. The provider
// home is never read for discovery and never written except for backups.
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { coreSkills, SKILLS_RECEIPT } from '../workbench/tools/workbench-layout.mjs';
import { skillContentHash } from '../workbench/tools/skill-inspection.mjs';
import { isMainModule } from '../workbench/tools/workbench-paths.mjs';

const productRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceLane = path.join(productRoot, 'workbench', 'skills');
export const RECEIPT_NAME = SKILLS_RECEIPT;
export const DISCOVERY_ROOTS = ['.agents/skills', '.claude/skills'];

function lstatOrNull(target) {
  try { return fs.lstatSync(target); } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

function fail(code, message, details = {}) {
  return { status: 'blocked', error: { code, message, ...details } };
}

function git(args, cwd = productRoot) {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
  return result.status === 0 ? result.stdout.trim() : '';
}

// The same identity contract as workbench-tools.mjs, scoped to the lane this
// installer copies: a concrete HEAD, an origin URL, a valid release, and no
// uncommitted change under the managed paths.
export function sourceIdentity(options = {}) {
  const root = path.resolve(options.root ?? productRoot);
  const managedPaths = [...new Set(['workbench/manifest.json', ...(options.managedPaths ?? ['workbench/skills'])])];
  const manifestPath = path.join(root, 'workbench', 'manifest.json');
  const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {};
  const commit = git(['rev-parse', '--verify', 'HEAD'], root);
  const topLevel = git(['rev-parse', '--show-toplevel'], root);
  const repository = git(['remote', 'get-url', 'origin'], root);
  const release = manifest.workbenchVersion;
  if (!/^[0-9a-f]{40}$/.test(commit)) throw new Error(`${root} is not a verified Git checkout with a concrete HEAD commit.`);
  if (!topLevel || fs.realpathSync(topLevel) !== fs.realpathSync(root)) throw new Error(`${root} is not the Git checkout root.`);
  if (!repository) throw new Error(`${root} has no origin repository URL.`);
  if (!/^v\d+\.\d+\.\d+$/.test(release ?? '')) throw new Error(`${manifestPath} has no valid Workbench release.`);
  const status = spawnSync('git', ['status', '--porcelain', '--', ...managedPaths], { cwd: root, encoding: 'utf8' });
  if (status.status !== 0) throw new Error(`Git status could not verify the Workbench source paths ${managedPaths.join(', ')} as clean.`);
  if (status.stdout.trim()) throw new Error(`The Workbench source has uncommitted changes under ${managedPaths.join(', ')}; commit the exact source candidate before installation.`);
  return { repository, release, commit, dirty: false };
}

// The source lane must hold exactly the required core as ordinary files; a
// link or shared file in the release would be copied as bytes and lose the
// identity the receipt claims for it.
export function validateSource() {
  for (const skill of coreSkills) {
    const directory = path.join(sourceLane, skill);
    const entry = lstatOrNull(directory);
    if (!entry?.isDirectory() || entry.isSymbolicLink()) return fail('invalid-source', `${sourceLane}/${skill} must be an ordinary directory in the release.`, { skill });
    if (!lstatOrNull(path.join(directory, 'SKILL.md'))?.isFile()) return fail('invalid-source', `${sourceLane}/${skill}/SKILL.md must be an ordinary file in the release.`, { skill });
    try { skillContentHash(directory); } catch (error) { return fail('invalid-source', `${sourceLane}/${skill}: ${error.message}`, { skill }); }
  }
  return null;
}

function safeDirectoryChain(root, relative) {
  let current = path.resolve(root);
  for (const part of relative.split('/').filter(Boolean)) {
    current = path.join(current, part);
    const entry = lstatOrNull(current);
    if (entry && (!entry.isDirectory() || entry.isSymbolicLink())) return fail('unsafe-lane', `${current} must be an ordinary directory.`);
  }
  return null;
}

function readManifestLane(project) {
  const manifestPath = path.join(project, 'workbench', 'manifest.json');
  if (!fs.existsSync(manifestPath)) return fail('invalid-manifest', `${manifestPath} is missing; initialize the layout first.`);
  let manifest;
  try { manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')); } catch (error) {
    return fail('invalid-manifest', `${manifestPath} is unreadable: ${error.message}`);
  }
  const lane = manifest.lanes?.skills;
  if (typeof lane !== 'string' || !lane.startsWith('workbench/') || lane.includes('..')) return fail('invalid-lane', 'The manifest must declare a skills lane under workbench/; run workbench-layout.mjs migrate --project PATH once.');
  const unsafe = safeDirectoryChain(project, lane);
  if (unsafe) return unsafe;
  const discovery = Array.isArray(manifest.skillPolicy?.discovery) ? manifest.skillPolicy.discovery : DISCOVERY_ROOTS;
  if (discovery.some((root) => !DISCOVERY_ROOTS.includes(root))) return fail('invalid-skill-policy', 'The manifest names a discovery root this installer does not support.', { discovery });
  return { lane: path.join(project, lane), relative: lane, manifest, discovery };
}

export function readReceipt(laneDir) {
  const file = path.join(laneDir, RECEIPT_NAME);
  if (!lstatOrNull(file)?.isFile()) return null;
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return null; }
}

function writeReceipt(laneDir, receipt) {
  const file = path.join(laneDir, RECEIPT_NAME);
  const temporaryDir = fs.mkdtempSync(path.join(laneDir, '.receipt-'));
  try {
    const temporary = path.join(temporaryDir, 'receipt');
    fs.writeFileSync(temporary, `${JSON.stringify(receipt, null, 2)}\n`, { mode: 0o644, flag: 'wx' });
    fs.renameSync(temporary, file);
  } finally { fs.rmSync(temporaryDir, { recursive: true, force: true }); }
}

// Copy one skill directory as ordinary files with stable modes; the receipt
// hash is computed from the copy so it describes what the room now holds.
function copySkill(skill, laneDir) {
  const destination = path.join(laneDir, skill);
  fs.rmSync(destination, { recursive: true, force: true });
  fs.cpSync(path.join(sourceLane, skill), destination, { recursive: true, dereference: false, errorOnExist: false, force: true });
  (function normalize(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const target = path.join(current, entry.name);
      if (entry.isDirectory()) { fs.chmodSync(target, 0o755); normalize(target); }
      else fs.chmodSync(target, 0o644);
    }
  })(destination);
  return skillContentHash(destination);
}

// A discovery adapter is a relative directory link from the project root into
// the lane. One that already resolves there is left alone; anything else at
// that path is a collision the room reconciles by hand, never overwritten.
// Preflight runs before any skill is copied so a refusal leaves no partial
// lane behind; laying runs after the copies.
function preflightAdapters(project, laneDir, discovery) {
  const pending = [];
  const laneReal = lstatOrNull(laneDir) ? fs.realpathSync(laneDir) : path.resolve(laneDir);
  for (const discoveryRoot of discovery) {
    const adapter = path.join(project, discoveryRoot);
    const entry = lstatOrNull(adapter);
    if (entry) {
      let resolved = null;
      try { resolved = fs.realpathSync(adapter); } catch {}
      if (resolved === laneReal) continue;
      return fail('adapter-collision', `${discoveryRoot} already exists and does not resolve into the skills lane; move its contents into the lane and remove it before installing.`, { root: discoveryRoot });
    }
    const parent = path.dirname(adapter);
    const parentEntry = lstatOrNull(parent);
    if (parentEntry && (!parentEntry.isDirectory() || parentEntry.isSymbolicLink())) return fail('adapter-collision', `${path.relative(project, parent)} must be an ordinary directory.`, { root: discoveryRoot });
    pending.push(discoveryRoot);
  }
  return { pending };
}

function layAdapters(project, laneDir, pending) {
  const written = [];
  for (const discoveryRoot of pending) {
    const adapter = path.join(project, discoveryRoot);
    const parent = path.dirname(adapter);
    fs.mkdirSync(parent, { recursive: true });
    fs.symlinkSync(path.relative(parent, laneDir).split(path.sep).join('/'), adapter, 'dir');
    written.push(discoveryRoot);
  }
  return { written };
}

function laneSkillState(laneDir, skill) {
  const directory = path.join(laneDir, skill);
  const entry = lstatOrNull(directory);
  if (!entry) return { status: 'missing' };
  if (entry.isSymbolicLink() || !entry.isDirectory()) return { status: 'unsafe' };
  try { return { status: 'present', hash: skillContentHash(directory) }; } catch { return { status: 'unsafe' }; }
}

export function install(project, options = {}) {
  const sourceFailure = validateSource();
  if (sourceFailure) return sourceFailure;
  let identity;
  try { identity = sourceIdentity(); } catch (error) { return fail('invalid-source-identity', error.message); }
  const resolved = readManifestLane(project);
  if (resolved.status === 'blocked') return resolved;
  const { lane, relative, discovery } = resolved;
  const laneEntry = lstatOrNull(lane);
  if (laneEntry && (laneEntry.isSymbolicLink() || !laneEntry.isDirectory())) return fail('unsafe-lane', `${relative} must be an ordinary directory.`);
  if (readReceipt(lane)) return fail('skills-installed', `${relative} already carries a receipt; use verify or update --explicit-update.`);
  for (const skill of coreSkills) {
    if (lstatOrNull(path.join(lane, skill))) return fail('skills-collision', `${relative}/${skill} already exists without a receipt; inspect and remove it before installing.`, { skill });
  }
  const preflight = preflightAdapters(project, lane, discovery);
  if (preflight.status === 'blocked') return preflight;
  fs.mkdirSync(lane, { recursive: true });
  const placeholder = path.join(lane, '.gitkeep');
  if (lstatOrNull(placeholder)?.isFile()) fs.unlinkSync(placeholder);
  const skills = {};
  for (const skill of coreSkills) skills[skill] = copySkill(skill, lane);
  const adapters = layAdapters(project, lane, preflight.pending);
  const receipt = { schemaVersion: 1, source: identity, installedAt: options.date ?? new Date().toISOString().slice(0, 10), skills, adapters: discovery, backups: [] };
  writeReceipt(lane, receipt);
  return { status: 'installed', lane: relative, receipt, adaptersWritten: adapters.written };
}

export function verify(project) {
  const resolved = readManifestLane(project);
  if (resolved.status === 'blocked') return resolved;
  const { lane, relative, discovery } = resolved;
  const receipt = readReceipt(lane);
  if (!receipt && lstatOrNull(lane) && fs.realpathSync(lane) === fs.realpathSync(sourceLane)) {
    try { return { status: 'source', lane: relative, source: sourceIdentity() }; }
    catch (error) { return fail('invalid-source-identity', error.message); }
  }
  if (!receipt) return { status: 'invalid', error: { code: 'skills-receipt-missing', message: `${relative} has no ${RECEIPT_NAME}; run workbench-skills.mjs install from the release checkout.` } };
  if (!receipt.skills || typeof receipt.skills !== 'object' || Array.isArray(receipt.skills)) return { status: 'invalid', error: { code: 'skills-receipt-missing', message: `${relative}/${RECEIPT_NAME} records no skills.` } };
  const updateAvailable = coreSkills.filter((skill) => receipt.skills[skill] !== skillContentHash(path.join(sourceLane, skill)));
  const drift = [];
  for (const skill of coreSkills) {
    const state = laneSkillState(lane, skill);
    if (!Object.prototype.hasOwnProperty.call(receipt.skills, skill)) drift.push({ skill, reason: 'unaccounted' });
    else if (state.status !== 'present') drift.push({ skill, reason: state.status });
    else if (state.hash !== receipt.skills[skill]) drift.push({ skill, reason: 'modified' });
  }
  for (const discoveryRoot of discovery) {
    let resolvedRoot = null;
    try { resolvedRoot = fs.realpathSync(path.join(project, discoveryRoot)); } catch {}
    if (resolvedRoot !== fs.realpathSync(lane)) drift.push({ root: discoveryRoot, reason: 'adapter' });
  }
  if (drift.length) return { status: 'invalid', error: { code: 'skills-receipt-drift', message: `${relative} differs from its receipt.`, drift }, receipt, updateAvailable };
  const roomLocal = fs.readdirSync(lane, { withFileTypes: true }).filter((entry) => entry.isDirectory() && !coreSkills.includes(entry.name)).map((entry) => entry.name).sort();
  return { status: 'valid', lane: relative, receipt, updateAvailable, roomLocal };
}

export function update(project, options = {}) {
  if (!options.explicit) return fail('explicit-update-required', 'Replacing managed core skills requires --explicit-update.');
  const sourceFailure = validateSource();
  if (sourceFailure) return sourceFailure;
  let identity;
  try { identity = sourceIdentity(); } catch (error) { return fail('invalid-source-identity', error.message); }
  const resolved = readManifestLane(project);
  if (resolved.status === 'blocked') return resolved;
  const { lane, relative, discovery } = resolved;
  const receipt = readReceipt(lane);
  if (!receipt) return fail('skills-receipt-missing', `${relative} has no receipt; use install.`);
  const home = path.resolve(options.home ?? os.homedir());
  const changed = coreSkills.filter((skill) => {
    if (!Object.prototype.hasOwnProperty.call(receipt.skills ?? {}, skill)) return true;
    const state = laneSkillState(lane, skill);
    return state.status !== 'present' || state.hash !== skillContentHash(path.join(sourceLane, skill));
  });
  const preflight = preflightAdapters(project, lane, discovery);
  if (preflight.status === 'blocked') return preflight;
  const adapters = layAdapters(project, lane, preflight.pending);
  if (changed.length === 0) return { status: 'current', lane: relative, receipt, adaptersWritten: adapters.written };
  const backupRoot = fs.mkdtempSync(path.join(home, '.workbench-skills-backup-'));
  const backedUp = [];
  for (const skill of changed) {
    const directory = path.join(lane, skill);
    if (lstatOrNull(directory)) {
      fs.cpSync(directory, path.join(backupRoot, skill), { recursive: true, dereference: false });
      backedUp.push(skill);
    }
  }
  fs.writeFileSync(path.join(backupRoot, RECEIPT_NAME), `${JSON.stringify(receipt, null, 2)}\n`);
  const skills = { ...receipt.skills };
  for (const skill of changed) skills[skill] = copySkill(skill, lane);
  const updated = { ...receipt, source: identity, updatedAt: options.date ?? new Date().toISOString().slice(0, 10), skills, adapters: discovery, backups: [...(receipt.backups ?? []), { path: backupRoot, skills: backedUp }] };
  writeReceipt(lane, updated);
  return { status: 'updated', lane: relative, changed, backup: backupRoot, receipt: updated, adaptersWritten: adapters.written };
}

export function rollback(project, options = {}) {
  const resolved = readManifestLane(project);
  if (resolved.status === 'blocked') return resolved;
  const { lane, relative } = resolved;
  const backupRoot = path.resolve(options.backup ?? '');
  if (!options.backup || !lstatOrNull(backupRoot)?.isDirectory()) return fail('invalid-backup', '--backup must name an existing backup directory recorded in the receipt.');
  // Only a backup this lane's own receipt recorded may be restored: bytes
  // from an unrecorded directory are not a rollback, whatever their shape.
  const current = readReceipt(lane);
  if (!(current?.backups ?? []).some((entry) => entry?.path && path.resolve(entry.path) === backupRoot)) return fail('invalid-backup', `${backupRoot} is not a backup recorded in ${relative}/${RECEIPT_NAME}.`, { backup: backupRoot });
  const previous = readReceipt(backupRoot);
  if (!previous?.skills || typeof previous.skills !== 'object' || Array.isArray(previous.skills)) return fail('invalid-backup', `${backupRoot} carries no valid receipt to restore.`);
  const restored = [];
  for (const skill of Object.keys(previous.skills)) {
    if (!coreSkills.includes(skill)) return fail('invalid-backup', `${backupRoot} names ${skill}, which the managed core does not include.`, { skill });
    const source = path.join(backupRoot, skill);
    if (!lstatOrNull(source)?.isDirectory()) continue;
    const destination = path.join(lane, skill);
    fs.rmSync(destination, { recursive: true, force: true });
    fs.cpSync(source, destination, { recursive: true, dereference: false });
    if (skillContentHash(destination) !== skillContentHash(source)) return fail('rollback-mismatch', `${skill} was not restored byte for byte.`, { skill });
    restored.push(skill);
  }
  writeReceipt(lane, { ...previous, rolledBackAt: options.date ?? new Date().toISOString().slice(0, 10), rolledBackFrom: backupRoot });
  return { status: 'rolled-back', lane: relative, backup: backupRoot, restored };
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const options = { explicit: false };
  for (let index = 0; index < rest.length; index += 1) {
    const arg = rest[index];
    if (arg === '--explicit-update') options.explicit = true;
    else if (arg.startsWith('--')) options[arg.slice(2)] = rest[++index];
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (!options.project) throw new Error('--project is required');
  return { command, options };
}

if (isMainModule(import.meta.url)) {
  try {
    const { command, options } = parseArgs(process.argv.slice(2));
    const project = path.resolve(options.project);
    let result;
    if (command === 'install') result = install(project, options);
    else if (command === 'verify') result = verify(project);
    else if (command === 'update') result = update(project, options);
    else if (command === 'rollback') result = rollback(project, options);
    else throw new Error('Usage: workbench-skills.mjs install|verify|update|rollback --project PATH [--home USER_HOME] [--explicit-update] [--backup DIR]');
    process.stdout.write(`${JSON.stringify(result)}\n`);
    if (!['installed', 'valid', 'source', 'updated', 'current', 'rolled-back'].includes(result.status)) process.exitCode = 1;
  } catch (error) {
    process.stdout.write(`${JSON.stringify(fail('invalid-invocation', error.message))}\n`);
    process.exitCode = 1;
  }
}

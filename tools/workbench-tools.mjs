#!/usr/bin/env node
// Install, verify, update, and roll back the Workbench-managed runtime tools
// in a project's manifest-declared tools lane.
//
// The canonical source is the released Workbench's own `workbench/tools/`
// directory (this checkout). Every install writes a receipt naming the exact
// source repository, release, and commit plus a SHA-256 per file. Managed
// files change only through `update --explicit-update`, which backs up the
// previous files under the user home and records the rollback path. An
// application's root `tools/` is never read or written.
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { managedReceiptFiles, receiptDrift, unaccountedLaneFiles } from '../workbench/tools/workbench-layout.mjs';
import { isMainModule } from '../workbench/tools/workbench-paths.mjs';

const productRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceLane = path.join(productRoot, 'workbench', 'tools');
export const RECEIPT_NAME = '.workbench-tools.json';
// The closed set of Workbench-managed runtime tools. Later capability tickets
// append to this list; the product lane must contain exactly these files.
export const RUNTIME_TOOLS = Object.freeze([
  'adr.mjs',
  'diagnostics.mjs',
  'markdown-table.mjs',
  'privacy.mjs',
  'sessions.mjs',
  'spec-packet.mjs',
  'spec-workbench.mjs',
  'template-placeholders.mjs',
  'wiki.mjs',
  'workbench-layout.mjs',
  'workbench-paths.mjs'
]);

function lstatOrNull(target) {
  try { return fs.lstatSync(target); } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

function fail(code, message, details = {}) {
  return { status: 'blocked', error: { code, message, ...details } };
}

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function git(args, cwd = productRoot) {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
  return result.status === 0 ? result.stdout.trim() : '';
}

function gitStatus(args, cwd = productRoot) {
  return spawnSync('git', args, { cwd, encoding: 'utf8' });
}

export function sourceIdentity(options = {}) {
  const root = path.resolve(options.root ?? productRoot);
  const managedPaths = [...new Set(['workbench/manifest.json', ...(options.managedPaths ?? ['workbench/tools'])])];
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
  const status = gitStatus(['status', '--porcelain', '--', ...managedPaths], root);
  if (status.status !== 0) throw new Error(`Git status could not verify the Workbench source paths ${managedPaths.join(', ')} as clean.`);
  if (status.stdout.trim()) throw new Error(`The Workbench source has uncommitted changes under ${managedPaths.join(', ')}; commit the exact source candidate before installation.`);
  return {
    repository,
    release,
    commit,
    dirty: false
  };
}

export function validateSource() {
  for (const tool of RUNTIME_TOOLS) {
    const entry = lstatOrNull(path.join(sourceLane, tool));
    if (!entry?.isFile() || entry.isSymbolicLink()) return fail('invalid-source', `${sourceLane}/${tool} must be an ordinary file in the release.`);
  }
  return null;
}

// Preflight every path before backups or writes. Checking only the final lane
// misses a symlink in workbench/ or in a nested manifest-declared parent.
function safeDirectoryChain(root, relative) {
  let current = path.resolve(root);
  for (const part of relative.split('/').filter(Boolean)) {
    current = path.join(current, part);
    const entry = lstatOrNull(current);
    if (entry && (!entry.isDirectory() || entry.isSymbolicLink())) {
      return fail('unsafe-lane', `${current} must be an ordinary directory.`);
    }
  }
  return null;
}

function safeManagedFiles(lane, names = RUNTIME_TOOLS) {
  for (const name of [...names, RECEIPT_NAME]) {
    if (name !== RECEIPT_NAME && !RUNTIME_TOOLS.includes(name)) {
      return fail('invalid-receipt', 'Receipt contains an unknown managed filename.');
    }
    const entry = lstatOrNull(path.join(lane, name));
    if (entry && (!entry.isFile() || entry.isSymbolicLink() || entry.nlink > 1)) {
      return fail('unsafe-tool', `${name} must be an ordinary, unshared file.`, { tool: name });
    }
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
  const lane = manifest.lanes?.tools;
  if (typeof lane !== 'string' || !lane.startsWith('workbench/') || lane.includes('..')) return fail('invalid-lane', 'The manifest must declare a tools lane under workbench/.');
  const unsafe = safeDirectoryChain(project, lane);
  if (unsafe) return unsafe;
  return { lane: path.join(project, lane), relative: lane, manifest };
}

export function readReceipt(laneDir) {
  const file = path.join(laneDir, RECEIPT_NAME);
  if (!lstatOrNull(file)?.isFile()) return null;
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return null; }
}

function writeReceipt(laneDir, receipt) {
  const file = path.join(laneDir, RECEIPT_NAME);
  // A private temporary directory avoids following a pre-existing temp symlink.
  const temporaryDir = fs.mkdtempSync(path.join(laneDir, '.receipt-'));
  try {
    const temporary = path.join(temporaryDir, 'receipt');
    fs.writeFileSync(temporary, `${JSON.stringify(receipt, null, 2)}\n`, { mode: 0o644, flag: 'wx' });
    fs.renameSync(temporary, file);
  } finally { fs.rmSync(temporaryDir, { recursive: true, force: true }); }
}

function copyTool(tool, destinationDir) {
  const destination = path.join(destinationDir, tool);
  fs.copyFileSync(path.join(sourceLane, tool), destination);
  fs.chmodSync(destination, 0o644);
  return sha256(destination);
}

export function install(project, options = {}) {
  const sourceFailure = validateSource();
  if (sourceFailure) return sourceFailure;
  let identity;
  try { identity = sourceIdentity(); } catch (error) { return fail('invalid-source-identity', error.message); }
  const resolved = readManifestLane(project);
  if (resolved.status === 'blocked') return resolved;
  const { lane, relative } = resolved;
  const laneEntry = lstatOrNull(lane);
  if (laneEntry && (laneEntry.isSymbolicLink() || !laneEntry.isDirectory())) return fail('unsafe-lane', `${relative} must be an ordinary directory.`);
  if (readReceipt(lane)) return fail('tools-installed', `${relative} already carries a receipt; use verify or update --explicit-update.`);
  for (const tool of RUNTIME_TOOLS) {
    const entry = lstatOrNull(path.join(lane, tool));
    if (entry) return fail('tools-collision', `${relative}/${tool} already exists without a receipt; inspect and remove it before installing.`, { tool });
  }
  fs.mkdirSync(lane, { recursive: true });
  const files = {};
  for (const tool of RUNTIME_TOOLS) files[tool] = copyTool(tool, lane);
  const receipt = { schemaVersion: 1, source: identity, installedAt: options.date ?? new Date().toISOString().slice(0, 10), files, backups: [] };
  writeReceipt(lane, receipt);
  return { status: 'installed', lane: relative, receipt };
}

export function verify(project) {
  const resolved = readManifestLane(project);
  if (resolved.status === 'blocked') return resolved;
  const { lane, relative } = resolved;
  const unsafe = safeManagedFiles(lane);
  if (unsafe) return unsafe;
  const receipt = readReceipt(lane);
  if (!receipt && path.resolve(lane) === path.resolve(sourceLane)) {
    try { return { status: 'source', lane: relative, source: sourceIdentity() }; }
    catch (error) { return fail('invalid-source-identity', error.message); }
  }
  if (!receipt) return { status: 'invalid', error: { code: 'tools-receipt-missing', message: `${relative} has no ${RECEIPT_NAME}.` } };
  // The release side reaches the same map, so it refuses the same receipts a
  // room's doctor refuses: one that records nothing, or one whose key resolves
  // outside the managed lane.
  const files = managedReceiptFiles(receipt);
  if (files.error) return { status: 'invalid', error: { code: 'tools-receipt-missing', message: `${relative}/${RECEIPT_NAME} ${files.error}.` } };
  // `updateAvailable` compares the receipt with the source, which says nothing
  // about the installed bytes; it rides every path so a room that is refused is
  // not also denied the fact that a newer release exists.
  const sourceDrift = RUNTIME_TOOLS.filter((tool) => receipt.files[tool] !== sha256(path.join(sourceLane, tool)));
  // The receipt's key set decided how much of the runtime got checked, so a
  // receipt pruned of the file somebody tampered with verified ten of eleven
  // tools and returned `valid`. Here, unlike in a room, the authoritative
  // managed set is at hand: a receipt that omits a member of RUNTIME_TOOLS is
  // refused whether or not that file is still on disk, and the lane check
  // catches anything smuggled in beside them.
  const unaccounted = [...new Set([
    ...RUNTIME_TOOLS.filter((tool) => !Object.prototype.hasOwnProperty.call(receipt.files, tool)),
    ...unaccountedLaneFiles(lane, files)
  ])].sort();
  if (unaccounted.length) {
    return { status: 'invalid', error: { code: 'tools-receipt-missing', message: `${relative}/${RECEIPT_NAME} does not account for ${unaccounted.join(', ')}; refresh it with \`workbench-tools.mjs update --project PATH --explicit-update\` after reviewing the lane.`, unaccounted }, receipt, updateAvailable: sourceDrift };
  }
  // The same comparison an installed room runs from workbench-layout.mjs, here
  // with the release source available, so each drifted file is classified as a
  // stale receipt, a modified runtime, or authentic bytes with a drifted mode.
  const drift = receiptDrift(lane, receipt, { sourceLane });
  if (drift.length) return { status: 'invalid', error: { code: 'tools-receipt-drift', message: `${relative} differs from its receipt.`, drift }, receipt, updateAvailable: sourceDrift };
  return { status: 'valid', lane: relative, receipt, updateAvailable: sourceDrift };
}

export function update(project, options = {}) {
  if (!options.explicit) return fail('explicit-update-required', 'Replacing managed runtime tools requires --explicit-update.');
  const sourceFailure = validateSource();
  if (sourceFailure) return sourceFailure;
  let identity;
  try { identity = sourceIdentity(); } catch (error) { return fail('invalid-source-identity', error.message); }
  const resolved = readManifestLane(project);
  if (resolved.status === 'blocked') return resolved;
  const { lane, relative } = resolved;
  const unsafe = safeManagedFiles(lane);
  if (unsafe) return unsafe;
  const receipt = readReceipt(lane);
  if (!receipt) return fail('tools-receipt-missing', `${relative} has no receipt; use install.`);
  const home = path.resolve(options.home ?? os.homedir());
  // A tool is `changed` when the receipt must be rewritten for it, which is not
  // only a byte difference: a receipt pruned of a key whose file is authentic
  // changes no bytes, and without this the refusal `verify` now raises would
  // have no remedy - `update` would report `current` and leave the gap open.
  const changed = RUNTIME_TOOLS.filter((tool) => {
    const file = path.join(lane, tool);
    if (!Object.prototype.hasOwnProperty.call(receipt.files ?? {}, tool)) return true;
    return !lstatOrNull(file) || sha256(file) !== sha256(path.join(sourceLane, tool));
  });
  if (changed.length === 0) return { status: 'current', lane: relative, receipt };
  const backupRoot = fs.mkdtempSync(path.join(home, '.workbench-tools-backup-'));
  const backedUp = [];
  for (const tool of changed) {
    const file = path.join(lane, tool);
    if (lstatOrNull(file)) {
      fs.copyFileSync(file, path.join(backupRoot, tool));
      backedUp.push(tool);
    }
  }
  fs.writeFileSync(path.join(backupRoot, RECEIPT_NAME), `${JSON.stringify(receipt, null, 2)}\n`);
  const files = { ...receipt.files };
  for (const tool of changed) files[tool] = copyTool(tool, lane);
  const updated = { ...receipt, source: identity, updatedAt: options.date ?? new Date().toISOString().slice(0, 10), files, backups: [...(receipt.backups ?? []), { path: backupRoot, files: backedUp }] };
  writeReceipt(lane, updated);
  return { status: 'updated', lane: relative, changed, backup: backupRoot, receipt: updated };
}

export function rollback(project, options = {}) {
  const resolved = readManifestLane(project);
  if (resolved.status === 'blocked') return resolved;
  const { lane, relative } = resolved;
  const unsafe = safeManagedFiles(lane);
  if (unsafe) return unsafe;
  const backupRoot = path.resolve(options.backup ?? '');
  if (!options.backup || !lstatOrNull(backupRoot)?.isDirectory()) return fail('invalid-backup', '--backup must name an existing backup directory recorded in the receipt.');
  const previous = readReceipt(backupRoot);
  if (!previous || !previous.files || typeof previous.files !== 'object' || Array.isArray(previous.files)) return fail('invalid-backup', `${backupRoot} carries no valid receipt to restore.`);
  const unsafeBackup = safeManagedFiles(backupRoot, Object.keys(previous.files));
  if (unsafeBackup) return unsafeBackup;
  // A backup is the lane exactly as it was before the update, including any
  // local edit that already drifted from the receipt; rollback restores that
  // state verbatim and lets `verify` report the drift again.
  const restored = [];
  for (const tool of Object.keys(previous.files)) {
    const source = path.join(backupRoot, tool);
    if (!lstatOrNull(source)?.isFile()) continue;
    const destination = path.join(lane, tool);
    fs.copyFileSync(source, destination);
    fs.chmodSync(destination, 0o644);
    if (sha256(destination) !== sha256(source)) return fail('rollback-mismatch', `${tool} was not restored byte for byte.`, { tool });
    restored.push(tool);
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
    else throw new Error('Usage: workbench-tools.mjs install|verify|update|rollback --project PATH [--home USER_HOME] [--explicit-update] [--backup DIR]');
    process.stdout.write(`${JSON.stringify(result)}\n`);
    if (!['installed', 'valid', 'source', 'updated', 'current', 'rolled-back'].includes(result.status)) process.exitCode = 1;
  } catch (error) {
    process.stdout.write(`${JSON.stringify(fail('invalid-invocation', error.message))}\n`);
    process.exitCode = 1;
  }
}

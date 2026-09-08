#!/usr/bin/env node
// Optional private Git transport. Project Git never receives live records.
// Index plumbing builds selected snapshots without checking out or staging over
// the user's transport checkout. A confirmed result always follows fresh fetch.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { checkStructure, resolveNote } from './notepads.mjs';
import { scanPrivacy } from './privacy.mjs';
import { isWorkbenchId, visibleIdKey } from './visible-ids.mjs';
import { collectionPath, collectionRelative, assertSafeWritePath, writeSafeFile, isBranchName, isMainModule, findRoot, UNTRACKED_COLLECTIONS } from './workbench-paths.mjs';

const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const objectId = value => /^(?:[0-9a-f]{40}|[0-9a-f]{64})$/.test(value);
class Refusal extends Error { constructor(code, message) { super(message); this.code = code; } }
const refuse = (code, message) => { throw new Refusal(code, message); };
const blocked = error => ({ status: 'blocked', acknowledged: false, error: { code: 'session-transport-blocked', reason: error.code ?? 'transport-failure', message: error instanceof Refusal ? error.message : 'Transport refused an unsafe or unreadable input; preserve local work and inspect the configured paths.' } });
function gitEnvironment(env = {}) {
  const inherited = { ...process.env };
  for (const key of ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_COMMON_DIR']) delete inherited[key];
  return { ...inherited, ...env };
}
function git(cwd, args, { input, env = {} } = {}) {
  const result = spawnSync('git', args, { cwd, input, env: gitEnvironment(env), maxBuffer: 20 * 1024 * 1024 });
  if (result.status !== 0) refuse('git-unavailable', `Git ${args[0]} did not complete; no remote acknowledgment is established.`);
  return result.stdout;
}
const gitText = (cwd, args, options) => git(cwd, args, options).toString('utf8').replace(/\r?\n$/, '');
function ordinary(root, file) {
  assertSafeWritePath(root, file);
  if (!fs.statSync(file).isFile()) refuse('unsafe-path', 'Transport input must be an ordinary unshared file.');
  return fs.readFileSync(file);
}
function localPaths(root) {
  ordinary(root, path.join(root, 'workbench/manifest.json'));
  const recovery = collectionPath(root, 'recovery');
  return { directory: path.join(recovery, 'transport'), config: path.join(recovery, 'transport/config.json'), state: path.join(recovery, 'transport/state.json'), lock: path.join(recovery, 'transport/operation.lock') };
}
function ignored(root, file) {
  assertSafeWritePath(root, file);
  const result = spawnSync('git', ['check-ignore', '--quiet', '--', path.relative(root, file)], { cwd: root, env: gitEnvironment() });
  if (result.status !== 0) refuse('not-ignored', 'Private transport configuration and live records must be ignored and untracked in project Git.');
}
function writeLocal(root, file, value) {
  ignored(root, file);writeSafeFile(root, file, JSON.stringify(value, null, 2) + '\n');fs.chmodSync(file, 0o600);
}
function withLock(root, file, operation) {
  assertSafeWritePath(root, file);fs.mkdirSync(path.dirname(file), { recursive: true, mode: 0o700 });
  let fd;
  try { fd = fs.openSync(file, 'wx', 0o600); }
  catch { refuse('transport-busy', 'A local transport operation is active or its lock needs deliberate recovery.'); }
  try { return operation(); } finally { fs.closeSync(fd);fs.unlinkSync(file); }
}
function roomIdentity(root) {
  const manifest = JSON.parse(ordinary(root, path.join(root, 'workbench/manifest.json')));
  if (!isWorkbenchId(manifest?.workbenchId)) refuse('invalid-workbench-identity', 'Assign and commit the stable Workbench identity before configuring transport.');
  const committed = JSON.parse(gitText(root, ['show', 'HEAD:workbench/manifest.json']));
  if (committed.workbenchId !== manifest.workbenchId) refuse('identity-not-committed', 'Commit this room identity before transport or cloning.');
  const roots = gitText(root, ['rev-list', '--max-parents=0', 'HEAD']).split('\n').sort();
  if (!roots.length || roots.some(value => !objectId(value))) refuse('invalid-lineage', 'Room Git lineage cannot be established.');
  return { schemaVersion: 1, workbenchId: manifest.workbenchId, gitRoots: roots };
}
function remoteInfo(checkout) {
  const resolved = fs.realpathSync.native(checkout);
  if (fs.realpathSync.native(gitText(resolved, ['rev-parse', '--show-toplevel'])) !== resolved) refuse('invalid-checkout', 'Select the transport checkout root.');
  const fetch = gitText(resolved, ['remote', 'get-url', '--all', 'origin']).split('\n');
  const push = gitText(resolved, ['remote', 'get-url', '--push', '--all', 'origin']).split('\n');
  if (fetch.length !== 1 || push.length !== 1 || fetch[0] !== push[0]) refuse('ambiguous-remote', 'Transport requires one identical effective origin fetch and push URL.');
  return { checkout: resolved, remote: fetch[0], common: path.resolve(resolved, gitText(resolved, ['rev-parse', '--git-common-dir'])) };
}
function remoteKey(value) {
  const github = /^(?:https:\/\/github\.com\/|git@github\.com:)([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+)$/.exec(value);
  if (github) return github[1].replace(/\.git$/, '').toLowerCase();
  return value;
}
function assertSeparateStore(root, info, identity, ref = 'HEAD') {
  const projectCommon = path.resolve(root, gitText(root, ['rev-parse', '--git-common-dir']));
  if (fs.realpathSync.native(projectCommon) === fs.realpathSync.native(info.common)) refuse('project-transport-overlap', 'Transport must use a separate Git repository, never the project or one of its worktrees.');
  for (const remote of gitText(root, ['remote']).split('\n').filter(Boolean)) {
    for (const flag of [[], ['--push']]) {
      const urls = gitText(root, ['remote', 'get-url', ...flag, '--all', remote]).split('\n');
      if (urls.some(url => remoteKey(url) === remoteKey(info.remote))) refuse('project-transport-overlap', 'Project and session transport must not publish to the same remote repository.');
    }
  }
  const roots = gitText(info.checkout, ['rev-list', '--max-parents=0', ref]).split('\n');
  if (roots.some(sha => identity.gitRoots.includes(sha))) refuse('project-transport-overlap', 'Transport cannot reuse project Git lineage, including a separate clone of that project.');
}
function verifyPrivate(remote) {
  const match = /^(?:https:\/\/github\.com\/|git@github\.com:)([A-Za-z0-9_.-]+)\/(workbench_sessions)(?:\.git)?$/.exec(remote);
  if (!match) refuse('unsupported-private-verification', 'This transport verifies the selected private workbench_sessions repository on GitHub; no other remote is implicitly trusted.');
  const result = spawnSync('gh', ['api', `repos/${match[1]}/${match[2]}`], { encoding: 'utf8', maxBuffer: 1024 * 1024 });
  if (result.status !== 0) refuse('private-verification-unavailable', 'Private repository metadata is unavailable; existing local work remains usable.');
  const metadata = JSON.parse(result.stdout);
  return { private: metadata.private === true && metadata.full_name?.toLowerCase() === `${match[1]}/${match[2]}`.toLowerCase(), evidence: 'github-private-metadata' };
}
function verify(info, dependencies) {
  const proof = (dependencies.verifyPrivate ?? verifyPrivate)(info.remote);
  if (proof?.private !== true) refuse('remote-not-private', 'Positive private repository verification is required before transport.');
  return proof;
}
function loadConfig(root) {
  const paths = localPaths(root);ignored(root, paths.config);
  if (!fs.existsSync(paths.config)) return null;
  const value = JSON.parse(ordinary(root, paths.config));
  if (value.schemaVersion !== 1 || value.acknowledgePrivate !== true || !isBranchName(value.branch) || typeof value.checkout !== 'string' || !path.isAbsolute(value.checkout) || typeof value.remote !== 'string' || !isWorkbenchId(value.identity?.workbenchId)) refuse('invalid-transport-config', 'Transport configuration is invalid; preserve it for recovery.');
  return value;
}
function loadState(root) {
  const file = localPaths(root).state;
  if (!fs.existsSync(file)) return { schemaVersion: 1, remoteSha: null, files: {} };
  const state = JSON.parse(ordinary(root, file));
  if (state.schemaVersion !== 1 || (state.remoteSha !== null && !objectId(state.remoteSha)) || !state.files || typeof state.files !== 'object' || Array.isArray(state.files) || Object.values(state.files).some(hash => !/^[0-9a-f]{64}$/.test(hash))) refuse('invalid-transport-state', 'Transport recovery state is invalid; do not replace it blindly.');
  return state;
}
export function transportStatus(root) {
  try {
    const config = loadConfig(root);if (!config) return { status: 'unconfigured', acknowledged: false };
    const state = loadState(root);return { status: 'configured', acknowledged: false, workbenchId: config.identity.workbenchId, lastConfirmedRemoteSha: state.remoteSha };
  } catch (error) { return blocked(error); }
}
export function configureTransport(root, options, dependencies = {}) {
  try {
    if (options.acknowledgePrivate !== true) refuse('private-acknowledgment-required', 'Acknowledge private Git history retention, privacy limits and that notes do not transfer code or processes.');
    if (!isBranchName(options.branch) || typeof options.checkout !== 'string') refuse('invalid-transport-config', 'Name an existing transport checkout and branch.');
    const identity = roomIdentity(root), info = remoteInfo(options.checkout);
    assertSeparateStore(root, info, identity);
    const proof = verify(info, dependencies), paths = localPaths(root);
    ignored(root, paths.config);
    return withLock(root, paths.lock, () => {
      const existing = loadConfig(root);
      const config = { schemaVersion: 1, acknowledgePrivate: true, checkout: info.checkout, remote: info.remote, branch: options.branch, identity };
      if (existing && JSON.stringify(existing) !== JSON.stringify(config)) refuse('transport-already-configured', 'Existing transport differs; retain its state and reconcile the connection explicitly.');
      if (!existing) writeLocal(root, paths.config, config);
      return { status: 'configured', acknowledged: false, workbenchId: identity.workbenchId, privateVerification: proof.evidence ?? 'verified-metadata', lastConfirmedRemoteSha: loadState(root).remoteSha };
    });
  } catch (error) { return blocked(error); }
}
function safeNote(bytes) {
  let value, text;
  try { text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes);value = JSON.parse(text); }
  catch { refuse('invalid-note', 'Selected record is not valid UTF-8 JSON.'); }
  const shape = checkStructure(value);
  if (shape.missing.length || shape.invalid.length) refuse('invalid-note', 'Selected record does not satisfy the supported notepad schema.');
  // Decode every original JSON string, including overwritten duplicate keys;
  // validating only the parsed object could hide private bytes still uploaded.
  const strings = [...text.matchAll(/"(?:[^"\\]|\\.)*"/g)].map(match => JSON.parse(match[0]));
  const decoded = text.replace(/"(?:[^"\\]|\\.)*"/g, token => JSON.parse(token));
  if (strings.some(value => scanPrivacy(value).length) || scanPrivacy(decoded).length) refuse('private-content', 'Selected record contains privacy-sensitive material; retain it locally and author a safe record.');
  return value;
}
function selection(root, values, identity, direction) {
  if (!Array.isArray(values) || !values.length) refuse('selection-required', 'Select at least one live note explicitly.');
  const result = [], used = new Set();
  for (const value of values) {
    const resolved = resolveNote(root, value);ignored(root, resolved.absolute);
    if (!resolved.relative.split('/').every(part => /^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(part))) refuse('unsafe-note-name', 'Transport note names must use plain path components without pathspec syntax.');
    const collection = UNTRACKED_COLLECTIONS.find(name => resolved.relative.startsWith(collectionRelative(root, name) + '/'));
    if (!collection) refuse('invalid-note', 'Only declared live notepad, grilling and handoff collections can be transported.');
    const suffix = resolved.relative.slice(collectionRelative(root, collection).length + 1);
    const remotePath = `workbenches/${identity.workbenchId}/sessions/${collection}/${suffix}`;
    if (used.has(remotePath.toLowerCase())) refuse('duplicate-selection', 'Selected paths collide case-insensitively.');used.add(remotePath.toLowerCase());
    let bytes = null;
    if (fs.existsSync(resolved.absolute)) { bytes = ordinary(root, resolved.absolute);safeNote(bytes); }
    else if (direction === 'push') refuse('missing-note', 'A push requires an existing selected note; absence never deletes remote history.');
    result.push({ ...resolved, remotePath, bytes, hash: bytes === null ? null : digest(bytes) });
  }
  return result;
}
function inventory(checkout, sha) {
  return git(checkout, ['ls-tree', '-rz', sha]).toString('utf8').split('\0').filter(Boolean).map(row => {
    const split = row.indexOf('\t'), [mode, type, oid] = row.slice(0, split).split(' ');
    return { mode, type, oid, name: row.slice(split + 1) };
  });
}
function blob(checkout, tree, name) {
  const entry = tree.find(item => item.name === name);
  if (!entry) return null;
  if (entry.mode !== '100644' || entry.type !== 'blob' || !objectId(entry.oid)) refuse('unsafe-remote-entry', 'A selected remote entry is not an ordinary managed file.');
  return git(checkout, ['cat-file', 'blob', entry.oid]);
}
function fetchRemote(info, config) {
  const ref = `refs/workbench-sessions/${config.identity.workbenchId}`;
  git(info.checkout, ['fetch', '--no-tags', 'origin', `refs/heads/${config.branch}:${ref}`]);
  const sha = gitText(info.checkout, ['rev-parse', ref]);if (!objectId(sha)) refuse('invalid-remote-head', 'Fetched transport branch has no concrete commit.');return sha;
}
function assertPathCase(tree, names) {
  const expected = new Map();
  for (const name of names) {
    let prefix = '';
    for (const part of name.split('/')) {
      prefix = prefix ? `${prefix}/${part}` : part;
      const key = prefix.toLowerCase();
      if (expected.has(key) && expected.get(key) !== prefix) refuse('note-path-collision', 'Selected path ancestors collide case-insensitively.');
      expected.set(key, prefix);
    }
  }
  for (const item of tree) {
    let prefix = '';
    for (const part of item.name.split('/')) {
      prefix = prefix ? `${prefix}/${part}` : part;
      const canonical = expected.get(prefix.toLowerCase());
      if (canonical && canonical !== prefix) refuse('note-path-collision', 'Remote path ancestry differs from the selected canonical spelling.');
    }
  }
}
function verifyNamespace(info, config, tree) {
  const metadataPath = `workbenches/${config.identity.workbenchId}/workbench.json`;
  assertPathCase(tree, [metadataPath]);
  for (const item of tree) {
    const name = item.name.split('/');
    if (name[0] === 'workbenches' && visibleIdKey(name[1]) === visibleIdKey(config.identity.workbenchId) && name[1] !== config.identity.workbenchId) refuse('namespace-collision', 'Remote namespace collides with this Workbench identity.');
  }
  const bytes = blob(info.checkout, tree, metadataPath);
  if (bytes !== null && JSON.stringify(JSON.parse(bytes)) !== JSON.stringify(config.identity)) refuse('namespace-collision', 'Remote namespace belongs to different room lineage; preserve both rooms.');
  if (bytes === null && tree.some(item => item.name.startsWith(`workbenches/${config.identity.workbenchId}/`))) refuse('namespace-collision', 'Existing namespace has no verifiable room identity.');
  return metadataPath;
}
function publishSnapshot(info, config, parent, updates, directory) {
  const temporary = fs.mkdtempSync(path.join(directory, 'index-'));
  const env = { GIT_INDEX_FILE: path.join(temporary, 'index') };
  try {
    git(info.checkout, ['read-tree', parent], { env });
    for (const [name, bytes] of updates) {
      const oid = gitText(info.checkout, ['hash-object', '-w', '--stdin'], { input: bytes });
      git(info.checkout, ['update-index', '--add', '--cacheinfo', `100644,${oid},${name}`], { env });
    }
    const tree = gitText(info.checkout, ['write-tree'], { env });
    const commit = gitText(info.checkout, ['commit-tree', tree, '-p', parent], { input: 'Save selected Workbench continuity\n' });
    git(info.checkout, ['push', 'origin', `${commit}:refs/heads/${config.branch}`]);
    return commit;
  } finally { fs.rmSync(temporary, { recursive: true, force: true }); }
}
function resumeWithRecovery(root, paths, downloads, state, confirmed) {
  const changed = downloads.filter(note => note.hash !== note.remoteHash);
  const previousSha = state.remoteSha;
  let directory = null, recoveryRecord = null;
  if (changed.length) {
    directory = fs.mkdtempSync(path.join(paths.directory, 'resume-'));fs.chmodSync(directory, 0o700);
    const backupPaths = changed.map((note, index) => note.bytes === null ? null : path.join(directory, `note-${index}.json`));
    const stateBackup = path.join(directory, 'state-before.json');
    recoveryRecord = path.relative(root, path.join(directory, 'recovery.json'));
    // Ignore exceptions can re-include individual children. Validate every
    // destination before any original note bytes enter the recovery tree.
    for (const file of [...backupPaths.filter(Boolean), stateBackup, path.join(root, recoveryRecord)]) ignored(root, file);
    const notes = changed.map((note, index) => {
      const backup = backupPaths[index];
      if (backup) { writeSafeFile(root, backup, note.bytes);fs.chmodSync(backup, 0o600);if (digest(ordinary(root, backup)) !== note.hash) refuse('recovery-readback-failed', 'Resume backup did not match the original note; no note was replaced.'); }
      return { note: note.relative, beforeHash: note.hash, afterHash: note.remoteHash, backup: backup && path.relative(root, backup), mode: note.bytes === null ? null : fs.statSync(note.absolute).mode & 0o777 };
    });
    writeLocal(root, stateBackup, state);
    writeLocal(root, path.join(root, recoveryRecord), { schemaVersion: 1, operation: 'resume', lastConfirmedRemoteSha: previousSha, fetchedRemoteSha: confirmed, stateBackup: path.relative(root, stateBackup), notes });
  }
  const appliedNotes = [], attemptedNotes = [];
  try {
    for (const note of changed) {
      const current = fs.existsSync(note.absolute) ? digest(ordinary(root, note.absolute)) : null;
      if (current !== note.hash) refuse('local-note-changed', 'A local note changed during resume; preserve recovery and reconcile it.');
      attemptedNotes.push(note.relative);
      writeSafeFile(root, note.absolute, note.remoteBytes);fs.chmodSync(note.absolute, 0o600);
      if (digest(ordinary(root, note.absolute)) !== note.remoteHash) refuse('local-readback-failed', 'Resumed note read-back failed; preserve its original backup and remote revision.');
      appliedNotes.push(note.relative);
    }
    const updated = { ...state, remoteSha: confirmed, files: { ...state.files } };
    for (const note of downloads) updated.files[note.remotePath] = note.remoteHash;
    writeLocal(root, paths.state, updated);
    if (JSON.stringify(JSON.parse(ordinary(root, paths.state))) !== JSON.stringify(updated)) refuse('state-readback-failed', 'Resume acknowledgment read-back failed; preserve recovery before retrying.');
  } catch (error) {
    if (!recoveryRecord) throw error;
    return { status: 'partial', acknowledged: false, lastConfirmedRemoteSha: previousSha, fetchedRemoteSha: confirmed, attemptedNotes, appliedNotes, recoveryRecord, error: blocked(error).error, recovery: 'Inspect the retained plan, original note backups and prior acknowledgment state. Compare current hashes before restoring anything; reconcile explicitly and retry. No automatic rollback or current acknowledgment occurred.' };
  }
  let recoveryResidue;
  if (directory) {
    try { fs.rmSync(directory, { recursive: true }); }
    catch { recoveryResidue = recoveryRecord; }
  }
  return { status: 'confirmed', acknowledged: true, remoteSha: confirmed, lastConfirmedRemoteSha: confirmed, notes: downloads.map(note => note.relative), pendingUpload: false, ...(recoveryResidue ? { recoveryResidue } : {}) };
}

export function syncNotes(root, options, dependencies = {}) {
  let state;
  try {
    if (!['push', 'resume'].includes(options.direction)) refuse('invalid-direction', 'Use push after a meaningful save or resume before continuing.');
    const paths = localPaths(root);ignored(root, paths.config);
    return withLock(root, paths.lock, () => {
      const config = loadConfig(root);if (!config) refuse('transport-unconfigured', 'Local note use is available without transport; configure private transport explicitly to sync.');
      if (JSON.stringify(roomIdentity(root)) !== JSON.stringify(config.identity)) refuse('namespace-collision', 'Current room identity differs from its configured connection.');
      state = loadState(root);
      const selected = selection(root, options.notes, config.identity, options.direction);
      const info = remoteInfo(config.checkout);
      assertSeparateStore(root, info, config.identity);
      if (info.remote !== config.remote) refuse('remote-changed', 'The effective origin changed; preserve the existing connection and reverify it explicitly.');
      verify(info, dependencies);
      return withLock(info.common, path.join(info.common, 'workbench-session-transport.lock'), () => {
        const sha = fetchRemote(info, config), tree = inventory(info.checkout, sha), metadataPath = verifyNamespace(info, config, tree);
        assertSeparateStore(root, info, config.identity, sha);
        assertPathCase(tree, selected.map(note => note.remotePath));
        if (state.remoteSha) git(info.checkout, ['merge-base', '--is-ancestor', state.remoteSha, sha]);
        const conflicts = [], updates = [], downloads = [];
        for (const note of selected) {
          if (tree.some(item => item.name.toLowerCase() === note.remotePath.toLowerCase() && item.name !== note.remotePath)) refuse('note-path-collision', 'A selected remote note path differs only by case.');
          const bytes = blob(info.checkout, tree, note.remotePath), remoteHash = bytes === null ? null : digest(bytes), baseline = state.files[note.remotePath] ?? null;
          if (bytes !== null) safeNote(bytes);
          if (options.direction === 'push') {
            if (remoteHash !== note.hash && remoteHash !== baseline) conflicts.push({ note: note.relative, localHash: note.hash, remoteHash });
            else if (remoteHash !== note.hash) updates.push([note.remotePath, note.bytes]);
          } else {
            if (remoteHash === null) refuse('remote-note-missing', 'Selected note is absent remotely; its local bytes remain intact.');
            if (note.hash !== remoteHash && note.hash !== baseline) conflicts.push({ note: note.relative, localHash: note.hash, remoteHash });
            else downloads.push({ ...note, remoteBytes: bytes, remoteHash });
          }
        }
        if (conflicts.length) return { status: 'conflict', acknowledged: false, lastConfirmedRemoteSha: state.remoteSha, fetchedRemoteSha: sha, conflicts, recovery: 'Local notes and remote revisions remain intact. Reconcile their content explicitly before retrying; no force push or overwrite was attempted.' };
        let confirmed = sha;
        if (options.direction === 'push') {
          if (!tree.some(item => item.name === metadataPath)) updates.push([metadataPath, Buffer.from(JSON.stringify(config.identity, null, 2) + '\n')]);
          if (updates.length) {
            const candidate = publishSnapshot(info, config, sha, updates, paths.directory);
            confirmed = fetchRemote(info, config);git(info.checkout, ['merge-base', '--is-ancestor', candidate, confirmed]);
          }
          const readBack = inventory(info.checkout, confirmed);
          assertSeparateStore(root, info, config.identity, confirmed);
          verifyNamespace(info, config, readBack);
          assertPathCase(readBack, selected.map(note => note.remotePath));
          for (const note of selected) if (digest(blob(info.checkout, readBack, note.remotePath) ?? Buffer.alloc(0)) !== note.hash) refuse('remote-readback-failed', 'Remote bytes do not match the selected save; retain local data and retry after reconciliation.');
          for (const note of selected) state.files[note.remotePath] = note.hash;
        } else {
          for (const note of downloads) {
            const current = fs.existsSync(note.absolute) ? digest(ordinary(root, note.absolute)) : null;
            if (current !== note.hash) refuse('local-note-changed', 'A local note changed during resume; retain it and retry after reconciliation.');
          }
          return resumeWithRecovery(root, paths, downloads, state, confirmed);
        }
        state.remoteSha = confirmed;writeLocal(root, paths.state, state);
        const newerLocal = options.direction === 'push' && selected.some(note => digest(ordinary(root, note.absolute)) !== note.hash);
        return { status: newerLocal ? 'pending' : 'confirmed', acknowledged: !newerLocal, remoteSha: confirmed, lastConfirmedRemoteSha: confirmed, notes: selected.map(note => note.relative), pendingUpload: newerLocal };
      });
    });
  } catch (error) {
    if (['git-unavailable', 'private-verification-unavailable'].includes(error.code) && state) return { status: 'pending', acknowledged: false, pendingUpload: options.direction === 'push', lastConfirmedRemoteSha: state.remoteSha, error: { code: 'session-transport-pending', reason: error.code, message: error.message } };
    return blocked(error);
  }
}
if (isMainModule(import.meta.url)) {
  try {
    const [command, ...args] = process.argv.slice(2), options = { notes: [] };
    for (let index = 0; index < args.length; index += 1) {
      const key = args[index];
      if (key === '--acknowledge-private-history') { options.acknowledgePrivate = true;continue; }
      if (!['--path', '--checkout', '--branch', '--note'].includes(key) || !args[index + 1] || args[index + 1].startsWith('--')) refuse('invalid-invocation', 'Unknown option or missing option value.');
      const value = args[++index];if (key === '--note') options.notes.push(value);else options[key.slice(2)] = value;
    }
    const root = findRoot(options.path ?? process.cwd());
    const result = command === 'configure' ? configureTransport(root, options) : command === 'status' ? transportStatus(root) : ['push', 'resume'].includes(command) ? syncNotes(root, { ...options, direction: command }) : blocked(new Refusal('invalid-invocation', 'Use configure, status, push or resume.'));
    process.stdout.write(JSON.stringify(result) + '\n');if (!['configured', 'unconfigured', 'confirmed'].includes(result.status)) process.exitCode = 1;
  } catch (error) { process.stdout.write(JSON.stringify(blocked(error)) + '\n');process.exitCode = 1; }
}

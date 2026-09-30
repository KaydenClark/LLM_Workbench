#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import test from 'node:test';
import { createNote, appendEntry } from '../workbench/tools/notepads.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const modulePath = path.join(root, 'workbench/tools/session-transport.mjs');
const transport = fs.existsSync(modulePath) ? await import(pathToFileURL(modulePath)) : null;
const version = JSON.parse(fs.readFileSync(path.join(root, 'workbench/manifest.json'))).workbenchVersion;
// This injected metadata response is a fixture, never evidence of a private service.
const fixtureVerification = { verifyPrivate: () => ({ private: true, evidence: 'simulated-private-metadata' }) };
function git(cwd, ...args) {
  const r = spawnSync('git', ['-c', 'user.name=Transport fixture', '-c', 'user.email=fixture@example.invalid', ...args], { cwd, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);return r.stdout.trim();
}
function fixture() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-transport-'));
  const project = path.join(base, 'room'), seed = path.join(base, 'seed'), remote = path.join(base, 'remote.git'), checkout = path.join(base, 'transport');
  for (const p of [project, seed]) fs.mkdirSync(p);
  const init = spawnSync(process.execPath, [path.join(root, 'workbench/tools/workbench-layout.mjs'), 'init', '--project', project, '--provenance', 'genesis', '--version', version], { encoding: 'utf8' });
  assert.equal(init.status, 0, init.stdout);
  git(project, 'init', '-q', '--initial-branch=main');git(project, 'add', 'workbench');git(project, 'commit', '-qm', 'Create room');
  git(seed, 'init', '-q', '--initial-branch=main');fs.writeFileSync(path.join(seed, 'README.md'), '# Local transport fixture\n');git(seed, 'add', 'README.md');git(seed, 'commit', '-qm', 'Initialize local fixture');
  git(base, 'clone', '-q', '--bare', seed, remote);git(base, 'clone', '-q', remote, checkout);
  git(checkout, 'config', 'user.name', 'Transport fixture');git(checkout, 'config', 'user.email', 'fixture@example.invalid');
  const created = createNote(project, { note: 'selected', objective: 'transport-proof', title: 'Selected continuity' });assert.equal(created.status, 'created');
  assert.equal(appendEntry(project, { note: created.note, revision: 1, kind: 'finding', topic: 'continuation', content: 'Resume the authorized local objective.' }).status, 'appended');
  return { base, project, remote, checkout, note: created.note, id: JSON.parse(fs.readFileSync(path.join(project, 'workbench/manifest.json'))).workbenchId };
}
function configured(f) {
  const r = transport.configureTransport(f.project, { checkout: f.checkout, branch: 'main', acknowledgePrivate: true }, fixtureVerification);
  assert.equal(r.status, 'configured', JSON.stringify(r));return r;
}

test('transport requires explicit acknowledgment and positively verified private metadata before configuration', () => {
  assert.equal(typeof transport?.configureTransport, 'function', 'optional private transport configure seam is missing');
  const f = fixture();
  try {
    assert.equal(transport.configureTransport(f.project, { checkout: f.checkout, branch: 'main' }, fixtureVerification).status, 'blocked');
    assert.equal(transport.configureTransport(f.project, { checkout: f.checkout, branch: 'main', acknowledgePrivate: true }, { verifyPrivate: () => ({ private: false }) }).status, 'blocked');
    assert.equal(transport.transportStatus(f.project).status, 'unconfigured');
    configured(f);
    assert.equal(git(f.project, 'status', '--porcelain'), '', 'private configuration and live notes stay untracked');
  } finally { fs.rmSync(f.base, { recursive: true, force: true }); }
});

test('push maps only the selected note, preserves checkout work and confirms exact remote bytes', () => {
  assert.equal(typeof transport?.syncNotes, 'function', 'selected-note transport seam is missing');
  const f = fixture();
  try {
    configured(f);fs.writeFileSync(path.join(f.checkout, 'unrelated.txt'), 'Preserve local transport work.');
    const before = git(f.checkout, 'status', '--porcelain');
    const result = transport.syncNotes(f.project, { notes: [f.note], direction: 'push' }, fixtureVerification);
    assert.equal(result.status, 'confirmed', JSON.stringify(result));assert.equal(result.acknowledged, true);
    assert.equal(result.remoteSha, git(f.remote, 'rev-parse', 'refs/heads/main'));
    const mapped = `workbenches/${f.id}/sessions/notepads/work/selected.json`;
    assert.equal(git(f.remote, 'show', `${result.remoteSha}:${mapped}`), fs.readFileSync(path.join(f.project, f.note), 'utf8').trim());
    assert.deepEqual(git(f.remote, 'ls-tree', '-r', '--name-only', result.remoteSha).split('\n').sort(), ['README.md', mapped, `workbenches/${f.id}/workbench.json`].sort());
    assert.equal(git(f.checkout, 'status', '--porcelain'), before);
    assert.equal(transport.syncNotes(f.project, { notes: [f.note], direction: 'push' }, fixtureVerification).remoteSha, result.remoteSha, 'unchanged push is idempotent');
  } finally { fs.rmSync(f.base, { recursive: true, force: true }); }
});

test('privacy and path refusals preserve source and remote', () => {
  assert.equal(typeof transport?.syncNotes, 'function', 'privacy-bounded transport seam is missing');
  const f = fixture();
  try {
    configured(f);const before = git(f.remote, 'rev-parse', 'main');
    for (const note of ['../../outside.json', 'workbench/sessions/notepads/templates/work.json', 'workbench/manifest.json']) assert.equal(transport.syncNotes(f.project, { notes: [note], direction: 'push' }, fixtureVerification).status, 'blocked');
    const file = path.join(f.project, f.note), data = JSON.parse(fs.readFileSync(file));data.current.state = 'Contact fixture@example.invalid';fs.writeFileSync(file, JSON.stringify(data).replaceAll('@', '\\u0040'));
    const bytes = fs.readFileSync(file);
    assert.equal(transport.syncNotes(f.project, { notes: [f.note], direction: 'push' }, fixtureVerification).status, 'blocked');
    assert.deepEqual(fs.readFileSync(file), bytes);assert.equal(git(f.remote, 'rev-parse', 'main'), before);
  } finally { fs.rmSync(f.base, { recursive: true, force: true }); }
});

test('fresh clone resumes selected continuity, later remote updates and competing edits remain explicit', () => {
  assert.equal(typeof transport?.syncNotes, 'function');
  const f = fixture();
  try {
    configured(f);
    const pushed = transport.syncNotes(f.project, { notes: [f.note], direction: 'push' }, fixtureVerification);assert.equal(pushed.status, 'confirmed');
    const second = path.join(f.base, 'second-room');git(f.base, 'clone', '-q', f.project, second);
    assert.equal(transport.configureTransport(second, { checkout: f.checkout, branch: 'main', acknowledgePrivate: true }, fixtureVerification).status, 'configured');
    assert.equal(fs.existsSync(path.join(second, f.note)), false);
    assert.equal(transport.syncNotes(second, { notes: [f.note], direction: 'resume' }, fixtureVerification).status, 'confirmed');
    assert.deepEqual(fs.readFileSync(path.join(second, f.note)), fs.readFileSync(path.join(f.project, f.note)));
    assert.equal(appendEntry(f.project, { note: f.note, revision: 2, kind: 'finding', topic: 'remote-progress', content: 'The first clone completed its local check.' }).status, 'appended');
    assert.equal(transport.syncNotes(f.project, { notes: [f.note], direction: 'push' }, fixtureVerification).status, 'confirmed');
    assert.equal(transport.syncNotes(second, { notes: [f.note], direction: 'resume' }, fixtureVerification).status, 'confirmed');
    assert.deepEqual(fs.readFileSync(path.join(second, f.note)), fs.readFileSync(path.join(f.project, f.note)));
    assert.equal(appendEntry(f.project, { note: f.note, revision: 3, kind: 'finding', topic: 'competing-progress', content: 'The first clone has another result.' }).status, 'appended');
    assert.equal(appendEntry(second, { note: f.note, revision: 3, kind: 'finding', topic: 'competing-progress', content: 'The second clone has a competing result.' }).status, 'appended');
    assert.equal(transport.syncNotes(f.project, { notes: [f.note], direction: 'push' }, fixtureVerification).status, 'confirmed');
    const remote = git(f.remote, 'rev-parse', 'main'), local = fs.readFileSync(path.join(second, f.note));
    for (const direction of ['push', 'resume']) {
      const result = transport.syncNotes(second, { notes: [f.note], direction }, fixtureVerification);
      assert.equal(result.status, 'conflict', JSON.stringify(result));assert.equal(result.acknowledged, false);
      assert.deepEqual(fs.readFileSync(path.join(second, f.note)), local);assert.equal(git(f.remote, 'rev-parse', 'main'), remote);
    }
    // Explicit reconciliation: retain the competing local source, accept the
    // inspected remote baseline, then re-author the retained local finding.
    const backup = path.join(second, 'workbench/sessions/recovery/conflict-selected.json');
    git(second, 'check-ignore', '--quiet', '--', path.relative(second, backup));
    fs.writeFileSync(backup, local, { mode: 0o600, flag: 'wx' });
    const accepted = Buffer.from(git(f.checkout, 'show', `${remote}:workbenches/${f.id}/sessions/notepads/work/selected.json`) + '\n');
    assert.deepEqual(accepted, fs.readFileSync(path.join(f.project, f.note)));
    fs.writeFileSync(path.join(second, f.note), accepted);
    assert.equal(transport.syncNotes(second, { notes: [f.note], direction: 'resume' }, fixtureVerification).status, 'confirmed');
    const retained = JSON.parse(local).entries.at(-1);
    assert.equal(appendEntry(second, { note: f.note, revision: JSON.parse(accepted).revision, kind: 'finding', topic: 'reconciled-local-progress', content: retained.content }).status, 'appended');
    const reconciled = transport.syncNotes(second, { notes: [f.note], direction: 'push' }, fixtureVerification);
    assert.equal(reconciled.status, 'confirmed');git(f.remote, 'merge-base', '--is-ancestor', remote, reconciled.remoteSha);
    const merged = JSON.parse(git(f.remote, 'show', `${reconciled.remoteSha}:workbenches/${f.id}/sessions/notepads/work/selected.json`));
    assert.ok(merged.entries.some(entry => entry.content === 'The first clone has another result.'));
    assert.ok(merged.entries.some(entry => entry.content === retained.content));
    assert.deepEqual(fs.readFileSync(backup), local, 'original competing evidence remains available');
  } finally { fs.rmSync(f.base, { recursive: true, force: true }); }
});

test('offline push keeps the newer local record and last confirmed remote SHA', () => {
  assert.equal(typeof transport?.syncNotes, 'function');
  const f = fixture();
  try {
    configured(f);const first = transport.syncNotes(f.project, { notes: [f.note], direction: 'push' }, fixtureVerification);assert.equal(first.status, 'confirmed');
    assert.equal(appendEntry(f.project, { note: f.note, revision: 2, kind: 'finding', topic: 'offline-progress', content: 'Local progress remains available offline.' }).status, 'appended');
    const bytes = fs.readFileSync(path.join(f.project, f.note));
    fs.renameSync(f.remote, f.remote + '.offline');
    const pending = transport.syncNotes(f.project, { notes: [f.note], direction: 'push' }, fixtureVerification);
    assert.equal(pending.status, 'pending');assert.equal(pending.acknowledged, false);assert.equal(pending.lastConfirmedRemoteSha, first.remoteSha);assert.equal(pending.pendingUpload, true);
    assert.deepEqual(fs.readFileSync(path.join(f.project, f.note)), bytes);
    fs.renameSync(f.remote + '.offline', f.remote);
    const resumed = transport.syncNotes(f.project, { notes: [f.note], direction: 'push' }, fixtureVerification);
    assert.equal(resumed.status, 'confirmed');assert.notEqual(resumed.remoteSha, first.remoteSha);
  } finally { fs.rmSync(f.base, { recursive: true, force: true }); }
});

test('linked manifest is refused before its contents are read', () => {
  assert.equal(typeof transport?.configureTransport, 'function');
  const f = fixture();
  const read = fs.readFileSync;
  try {
    const manifest = path.join(f.project, 'workbench/manifest.json'), outside = path.join(f.base, 'outside-manifest.json');
    fs.renameSync(manifest, outside);fs.symlinkSync(outside, manifest);
    let readUnsafeManifest = false;
    fs.readFileSync = function(file, ...args) { if (path.resolve(String(file)) === manifest) readUnsafeManifest = true;return read.call(this, file, ...args); };
    assert.equal(transport.configureTransport(f.project, { checkout: f.checkout, branch: 'main', acknowledgePrivate: true }, fixtureVerification).status, 'blocked');
    assert.equal(transport.transportStatus(f.project).status, 'blocked');
    assert.equal(readUnsafeManifest, false, 'validate manifest path before reading external content');
  } finally { fs.readFileSync = read;fs.rmSync(f.base, { recursive: true, force: true }); }
});

test('project Git, its worktrees and clones cannot become the transport store', () => {
  for (const shape of ['same-root', 'worktree', 'clone']) {
    const f = fixture();
    try {
      git(f.project, 'remote', 'add', 'origin', f.remote);
      let checkout = f.project;
      if (shape === 'worktree') { checkout = path.join(f.base, 'room-worktree');git(f.project, 'worktree', 'add', '-q', '-b', 'fixture-worktree', checkout); }
      if (shape === 'clone') { checkout = path.join(f.base, 'room-clone');git(f.base, 'clone', '-q', f.project, checkout); }
      const before = git(f.remote, 'rev-parse', 'main');
      const result = transport.configureTransport(f.project, { checkout, branch: 'main', acknowledgePrivate: true }, fixtureVerification);
      assert.equal(result.status, 'blocked', shape + ': ' + JSON.stringify(result));assert.equal(git(f.remote, 'rev-parse', 'main'), before);
    } finally { fs.rmSync(f.base, { recursive: true, force: true }); }
  }
});

test('namespace and selected ancestors reserve canonical case even when leaf names differ', () => {
  for (const shape of ['container', 'metadata', 'sessions']) {
    const f = fixture();
    try {
      configured(f);
      const metadata = { schemaVersion: 1, workbenchId: f.id, gitRoots: git(f.project, 'rev-list', '--max-parents=0', 'HEAD').split('\n').sort() };
      const prefix = `workbenches/${f.id}`;
      const file = shape === 'container' ? `Workbenches/${f.id}/workbench.json` : shape === 'metadata' ? `${prefix}/WORKBENCH.json` : `${prefix}/workbench.json`;
      fs.mkdirSync(path.dirname(path.join(f.checkout, file)), { recursive: true });fs.writeFileSync(path.join(f.checkout, file), JSON.stringify(metadata));
      if (shape === 'sessions') {
        const other = path.join(f.checkout, prefix, 'Sessions/notepads/work/other.json');fs.mkdirSync(path.dirname(other), { recursive: true });fs.copyFileSync(path.join(f.project, f.note), other);
      }
      git(f.checkout, 'add', '.');git(f.checkout, 'commit', '-qm', 'Seed namespace alias');git(f.checkout, 'push', '-q', 'origin', 'main');
      const before = git(f.remote, 'rev-parse', 'main');
      assert.equal(transport.syncNotes(f.project, { notes: [f.note], direction: 'push' }, fixtureVerification).status, 'blocked', shape);
      assert.equal(git(f.remote, 'rev-parse', 'main'), before);
    } finally { fs.rmSync(f.base, { recursive: true, force: true }); }
  }
});

test('post-push descendant must retain the expected namespace before acknowledgment', () => {
  const f = fixture();
  try {
    configured(f);
    const hook = `#!/usr/bin/env node
const fs = require('node:fs'), {spawnSync} = require('node:child_process');
const [old, next, ref] = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);
const env = {...process.env, GIT_INDEX_FILE: ${JSON.stringify(path.join(f.base, 'hook-index'))}};
function git(args, input) { const r = spawnSync('git', ['-c', 'user.name=Race fixture', '-c', 'user.email=race@example.invalid', ...args], {env, input, encoding:'utf8'}); if (r.status !== 0) throw Error(r.stderr); return r.stdout.trim(); }
git(['read-tree', next]);
const oid = git(['hash-object', '-w', '--stdin'], ${JSON.stringify(JSON.stringify({ schemaVersion: 1, workbenchId: f.id, gitRoots: ['b'.repeat(40)] }) + '\n')});
git(['update-index', '--add', '--cacheinfo', '100644,' + oid + ',' + ${JSON.stringify(`workbenches/${f.id}/workbench.json`)}]);
const tree = git(['write-tree']), commit = git(['commit-tree', tree, '-p', next], 'Concurrent namespace change\\n');git(['update-ref', ref, commit, next]);
`;
    fs.writeFileSync(path.join(f.remote, 'hooks/post-receive'), hook, { mode: 0o755 });
    const bytes = fs.readFileSync(path.join(f.project, f.note));
    const result = transport.syncNotes(f.project, { notes: [f.note], direction: 'push' }, fixtureVerification);
    assert.equal(result.status, 'blocked', JSON.stringify(result));assert.equal(result.acknowledged, false);
    assert.equal(transport.transportStatus(f.project).lastConfirmedRemoteSha, null);
    assert.deepEqual(fs.readFileSync(path.join(f.project, f.note)), bytes);
  } finally { fs.rmSync(f.base, { recursive: true, force: true }); }
});

test('invalid UTF-8 and privacy hidden in duplicate JSON keys never reach remote history', () => {
  for (const shape of ['utf8', 'duplicate-key']) {
    const f = fixture();
    try {
      configured(f);const before = git(f.remote, 'rev-parse', 'main'), file = path.join(f.project, f.note);
      let bytes = fs.readFileSync(file);
      if (shape === 'utf8') bytes[bytes.indexOf('Selected continuity')] = 255;
      else bytes = Buffer.from(bytes.toString().replace('"title":', '"title": "fixture\\u0040example.invalid", "title":'));
      fs.writeFileSync(file, bytes);
      assert.equal(transport.syncNotes(f.project, { notes: [f.note], direction: 'push' }, fixtureVerification).status, 'blocked', shape);
      assert.equal(git(f.remote, 'rev-parse', 'main'), before);assert.deepEqual(fs.readFileSync(file), bytes);
    } finally { fs.rmSync(f.base, { recursive: true, force: true }); }
  }
});

test('privacy scans each decoded string with its own boundaries in minified JSON', () => {
  const f = fixture();
  try {
    configured(f);const before = git(f.remote, 'rev-parse', 'main'), file = path.join(f.project, f.note);
    const value = JSON.parse(fs.readFileSync(file));value.title = '/Users/fixture-review/private-context';
    const bytes = Buffer.from(JSON.stringify(value));fs.writeFileSync(file, bytes);
    assert.equal(transport.syncNotes(f.project, { notes: [f.note], direction: 'push' }, fixtureVerification).status, 'blocked');
    assert.equal(git(f.remote, 'rev-parse', 'main'), before);assert.deepEqual(fs.readFileSync(file), bytes);
  } finally { fs.rmSync(f.base, { recursive: true, force: true }); }
});

test('ignore verification cannot inherit another repository through Git routing variables', () => {
  const f = fixture();
  const prior = { GIT_DIR: process.env.GIT_DIR, GIT_WORK_TREE: process.env.GIT_WORK_TREE };
  try {
    configured(f);git(f.project, 'add', '-f', f.note);
    assert.equal(transport.syncNotes(f.project, { notes: [f.note], direction: 'push' }, fixtureVerification).status, 'blocked');
    const other = path.join(f.base, 'other-git');fs.mkdirSync(other);git(other, 'init', '-q');fs.writeFileSync(path.join(other, '.git/info/exclude'), 'workbench/sessions/\n');
    process.env.GIT_DIR = path.join(other, '.git');process.env.GIT_WORK_TREE = other;
    const result = transport.syncNotes(f.project, { notes: [f.note], direction: 'push' }, fixtureVerification);
    assert.equal(result.status, 'blocked', JSON.stringify(result));assert.equal(result.acknowledged, false);
  } finally {
    for (const [key, value] of Object.entries(prior)) { if (value === undefined) delete process.env[key];else process.env[key] = value; }
    fs.rmSync(f.base, { recursive: true, force: true });
  }
});

test('interrupted multi-note resume names partial application and preserves recovery bytes', () => {
 const f=fixture(); const rename=fs.renameSync;
 try {
  configured(f);const other=createNote(f.project,{note:'second',objective:'transport-proof',title:'Second continuity'}).note;
  const notes=[f.note,other];
  assert.equal(transport.syncNotes(f.project,{notes,direction:'push'},fixtureVerification).status,'confirmed');
  const second=path.join(f.base,'resume-room');git(f.base,'clone','-q',f.project,second);
  assert.equal(transport.configureTransport(second,{checkout:f.checkout,branch:'main',acknowledgePrivate:true},fixtureVerification).status,'configured');
  assert.equal(transport.syncNotes(second,{notes,direction:'resume'},fixtureVerification).status,'confirmed');
  const before=notes.map(n=>fs.readFileSync(path.join(second,n)));const stateFile=path.join(second,'workbench/sessions/recovery/transport/state.json');
  const stateBefore=fs.readFileSync(stateFile);
  for(const note of notes) {const v=JSON.parse(fs.readFileSync(path.join(f.project,note)));appendEntry(f.project,{note,revision:v.revision,kind:'finding',topic:'remote-change',content:'Preserve this new remote progress.'});}
  assert.equal(transport.syncNotes(f.project,{notes,direction:'push'},fixtureVerification).status,'confirmed');
  fs.renameSync=(a,b)=>{if(b===path.join(second,other)){const e=new Error('Injected write failure');e.code='EACCES';throw e;}return rename(a,b);};
  const result=transport.syncNotes(second,{notes,direction:'resume'},fixtureVerification);fs.renameSync=rename;
  assert.equal(result.status,'partial',JSON.stringify(result));assert.equal(result.acknowledged,false);
  assert.deepEqual(result.appliedNotes,[f.note]);assert.ok(result.recoveryRecord);
  assert.deepEqual(fs.readFileSync(stateFile),stateBefore);
  assert.deepEqual(fs.readFileSync(path.join(second,other)),before[1]);
  const receipt=JSON.parse(fs.readFileSync(path.resolve(second,result.recoveryRecord)));
  for(let i=0;i<notes.length;i++)assert.deepEqual(fs.readFileSync(path.resolve(second,receipt.notes[i].backup)),before[i]);
 } finally {fs.renameSync=rename;fs.rmSync(f.base,{recursive:true,force:true});}
});

test('occupied operation locks refuse without touching notes or remote and recover only after deliberate removal', () => {
 const f=fixture();
 try {
  configured(f);const before=fs.readFileSync(path.join(f.project,f.note)), sha=git(f.remote,'rev-parse','main');
  const locks=[path.join(f.project,'workbench/sessions/recovery/transport/operation.lock'),path.join(f.checkout,'.git/workbench-session-transport.lock')];
  for(const lock of locks) {
   fs.writeFileSync(lock,'Retained owner lock');
   const r=transport.syncNotes(f.project,{notes:[f.note],direction:'push'},fixtureVerification);
   assert.equal(r.status,'blocked');assert.equal(r.error.reason,'transport-busy');assert.equal(fs.readFileSync(lock,'utf8'),'Retained owner lock');
   assert.deepEqual(fs.readFileSync(path.join(f.project,f.note)),before);assert.equal(git(f.remote,'rev-parse','main'),sha);
   fs.unlinkSync(lock);
  }
  assert.equal(transport.syncNotes(f.project,{notes:[f.note],direction:'push'},fixtureVerification).status,'confirmed');
 } finally {fs.rmSync(f.base,{recursive:true,force:true});}
});

test('rejected pushes preserve last confirmation and local progress, then retry without force', () => {
 const f=fixture();
 try {
  configured(f);const initial=transport.syncNotes(f.project,{notes:[f.note],direction:'push'},fixtureVerification);
  assert.equal(initial.status,'confirmed');
  appendEntry(f.project,{note:f.note,revision:2,kind:'finding',topic:'pending',content:'Keep this local progress after a rejected upload.'});
  const before=fs.readFileSync(path.join(f.project,f.note));const hook=path.join(f.remote,'hooks/pre-receive');fs.writeFileSync(hook,'#!/bin/sh\nexit 1\n',{mode:0o700});
  const r=transport.syncNotes(f.project,{notes:[f.note],direction:'push'},fixtureVerification);
  assert.equal(r.status,'pending');assert.equal(r.acknowledged,false);assert.equal(r.lastConfirmedRemoteSha,initial.remoteSha);
  assert.equal(git(f.remote,'rev-parse','main'),initial.remoteSha);assert.deepEqual(fs.readFileSync(path.join(f.project,f.note)),before);
  assert.equal(transport.transportStatus(f.project).lastConfirmedRemoteSha,initial.remoteSha);
  fs.unlinkSync(hook);const retry=transport.syncNotes(f.project,{notes:[f.note],direction:'push'},fixtureVerification);assert.equal(retry.status,'confirmed');
  git(f.remote,'merge-base','--is-ancestor',initial.remoteSha,retry.remoteSha);
 } finally {fs.rmSync(f.base,{recursive:true,force:true});}
});

test('different notes from isolated room clones retain both revisions without force or checkout replacement', () => {
 const f=fixture();
 try {
  configured(f);assert.equal(transport.syncNotes(f.project,{notes:[f.note],direction:'push'},fixtureVerification).status,'confirmed');
  const second=path.join(f.base,'second-room');git(f.base,'clone','-q',f.project,second);
  assert.equal(transport.configureTransport(second,{checkout:f.checkout,branch:'main',acknowledgePrivate:true},fixtureVerification).status,'configured');
  const created=createNote(second,{note:'independent',objective:'transport-proof',title:'Separate note'});
  assert.equal(created.status,'created');assert.equal(transport.syncNotes(second,{notes:[created.note],direction:'push'},fixtureVerification).status,'confirmed');
  appendEntry(f.project,{note:f.note,revision:2,kind:'finding',topic:'first-note',content:'Keep both independent note changes.'});
  const final=transport.syncNotes(f.project,{notes:[f.note],direction:'push'},fixtureVerification);assert.equal(final.status,'confirmed');
  for(const [room,note,name] of [[f.project,f.note,'selected'],[second,created.note,'independent']]) assert.equal(git(f.remote,'show',`${final.remoteSha}:workbenches/${f.id}/sessions/notepads/work/${name}.json`),fs.readFileSync(path.join(room,note),'utf8').trim());
 } finally {fs.rmSync(f.base,{recursive:true,force:true});}
});

test('failed acknowledgment after resume retains recovery and permits an explicit retry', () => {
 const f=fixture(); const rename=fs.renameSync;
 try {
  configured(f);const other=createNote(f.project,{note:'second',objective:'transport-proof',title:'Second continuity'}).note;
  const notes=[f.note,other];
  assert.equal(transport.syncNotes(f.project,{notes,direction:'push'},fixtureVerification).status,'confirmed');
  const second=path.join(f.base,'resume-room');git(f.base,'clone','-q',f.project,second);
  assert.equal(transport.configureTransport(second,{checkout:f.checkout,branch:'main',acknowledgePrivate:true},fixtureVerification).status,'configured');
  assert.equal(transport.syncNotes(second,{notes,direction:'resume'},fixtureVerification).status,'confirmed');
  const before=notes.map(n=>fs.readFileSync(path.join(second,n)));const stateFile=path.join(second,'workbench/sessions/recovery/transport/state.json');
  const stateBefore=fs.readFileSync(stateFile);
  for(const note of notes) {const v=JSON.parse(fs.readFileSync(path.join(f.project,note)));appendEntry(f.project,{note,revision:v.revision,kind:'finding',topic:'remote-change',content:'Preserve this new remote progress.'});}
  assert.equal(transport.syncNotes(f.project,{notes,direction:'push'},fixtureVerification).status,'confirmed');
  fs.renameSync=(a,b)=>{if(b===stateFile){const e=new Error('Injected write failure');e.code='EACCES';throw e;}return rename(a,b);};
  const result=transport.syncNotes(second,{notes,direction:'resume'},fixtureVerification);fs.renameSync=rename;
  assert.equal(result.status,'partial',JSON.stringify(result));assert.equal(result.acknowledged,false);
  assert.deepEqual(result.appliedNotes,notes);assert.ok(result.recoveryRecord);
  assert.deepEqual(fs.readFileSync(stateFile),stateBefore);
  assert.deepEqual(fs.readFileSync(path.join(second,other)),fs.readFileSync(path.join(f.project,other)));
  const receipt=JSON.parse(fs.readFileSync(path.resolve(second,result.recoveryRecord)));
  for(let i=0;i<notes.length;i++)assert.deepEqual(fs.readFileSync(path.resolve(second,receipt.notes[i].backup)),before[i]);
 const retried=transport.syncNotes(second,{notes,direction:'resume'},fixtureVerification);assert.equal(retried.status,'confirmed');assert.ok(fs.existsSync(path.resolve(second,result.recoveryRecord)),'Earlier recovery remains available until deliberate reconciliation');
 } finally {fs.renameSync=rename;fs.rmSync(f.base,{recursive:true,force:true});}
});

test('resume refuses re-included backup destinations before copying any private originals', () => {
 const f=fixture(); const rename=fs.renameSync;
 try {
  configured(f);const other=createNote(f.project,{note:'second',objective:'transport-proof',title:'Second continuity'}).note;
  const notes=[f.note,other];
  assert.equal(transport.syncNotes(f.project,{notes,direction:'push'},fixtureVerification).status,'confirmed');
  const second=path.join(f.base,'resume-room');git(f.base,'clone','-q',f.project,second);
  assert.equal(transport.configureTransport(second,{checkout:f.checkout,branch:'main',acknowledgePrivate:true},fixtureVerification).status,'configured');
  assert.equal(transport.syncNotes(second,{notes,direction:'resume'},fixtureVerification).status,'confirmed');
  const before=notes.map(n=>fs.readFileSync(path.join(second,n)));const stateFile=path.join(second,'workbench/sessions/recovery/transport/state.json');
  const stateBefore=fs.readFileSync(stateFile);
  for(const note of notes) {const v=JSON.parse(fs.readFileSync(path.join(f.project,note)));appendEntry(f.project,{note,revision:v.revision,kind:'finding',topic:'remote-change',content:'Preserve this new remote progress.'});}
  assert.equal(transport.syncNotes(f.project,{notes,direction:'push'},fixtureVerification).status,'confirmed');
  fs.appendFileSync(path.join(second,'workbench/sessions/.gitignore'),'\n!recovery/\nrecovery/*\n!recovery/transport/\nrecovery/transport/*\n!recovery/transport/resume-*/\nrecovery/transport/resume-*/*\n!recovery/transport/resume-*/note-*.json\n');
  const result=transport.syncNotes(second,{notes,direction:'resume'},fixtureVerification);
  assert.equal(result.status,'blocked',JSON.stringify(result));assert.equal(result.error.reason,'not-ignored');
  for(let i=0;i<notes.length;i++)assert.deepEqual(fs.readFileSync(path.join(second,notes[i])),before[i]);
  assert.deepEqual(fs.readFileSync(stateFile),stateBefore);
  assert.equal(git(second,'status','--porcelain','--untracked-files=all').includes('note-'),false,'No original private bytes may be copied into a re-included backup');
 } finally {fs.renameSync=rename;fs.rmSync(f.base,{recursive:true,force:true});}
});

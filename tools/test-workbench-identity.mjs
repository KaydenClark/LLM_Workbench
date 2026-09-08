#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { allocateWorkbenchId, isWorkbenchId } from '../workbench/tools/visible-ids.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tool = path.join(root, 'workbench/tools/workbench-layout.mjs');
const version = JSON.parse(fs.readFileSync(path.join(root, 'workbench/manifest.json'))).workbenchVersion;
const manifestPath = room => path.join(room, 'workbench/manifest.json');
const read = room => JSON.parse(fs.readFileSync(manifestPath(room)));
function run(command, room, ...args) {
  const result = spawnSync(process.execPath, [tool, command, '--project', room, ...args], { encoding: 'utf8' });
  return JSON.parse(result.stdout);
}
function create(parent, name, lifecycle = 'genesis') {
  const room = path.join(parent, name);
  fs.mkdirSync(room);
  const result = run('init', room, '--provenance', lifecycle, '--version', version);
  assert.equal(result.status, 'initialized', JSON.stringify(result));
  return room;
}
function git(room, ...args) {
  const result = spawnSync('git', ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', ...args], { cwd: room, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
}

test('independent rooms differ while clone, worktree, rename and migration preserve the same namespace', () => {
  const parent = fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-identity-'));
  try {
    const room = create(parent, 'original');
    const adopted = create(parent, 'adopted', 'adoption');
    const id = read(room).workbenchId;
    assert.match(id, /^WB-[0-9A-Za-z]{22}$/);
    assert.notEqual(read(adopted).workbenchId, id);
    const artifact = path.join(room, 'workbench/specs/reference.md');
    fs.writeFileSync(artifact, 'Existing S-001 and N-00A remain room-scoped.\n');
    git(room, 'init', '-q'); git(room, 'add', '.'); git(room, 'commit', '-qm', 'Room fixture');
    const clone = path.join(parent, 'clone');
    git(parent, 'clone', '-q', room, clone);
    const worktree = path.join(parent, 'worktree');
    git(room, 'worktree', 'add', '-q', '--detach', worktree);
    const renamed = path.join(parent, 'renamed');
    fs.renameSync(clone, renamed);
    for (const current of [room, worktree, renamed]) {
      assert.equal(read(current).workbenchId, id);
      const before = fs.readFileSync(manifestPath(current));
      assert.equal(run('identify', current).status, 'current');
      assert.deepEqual(fs.readFileSync(manifestPath(current)), before);
      assert.equal(run('migrate', current).status, 'current');
      assert.equal(read(current).workbenchId, id);
      assert.equal(fs.readFileSync(path.join(current, 'workbench/specs/reference.md'), 'utf8'), 'Existing S-001 and N-00A remain room-scoped.\n');
    }
  } finally { fs.rmSync(parent, { recursive: true, force: true }); }
});

test('legacy room identity is assigned explicitly once and malformed identity never regenerates silently', () => {
  const parent = fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-identity-'));
  try {
    const room = create(parent, 'legacy');
    const manifest = read(room);
    delete manifest.workbenchId;
    fs.writeFileSync(manifestPath(room), JSON.stringify(manifest, null, 2) + '\n');
    assert.equal(run('validate', room).status, 'valid', 'legacy local operation remains available');
    const assigned = run('identify', room);
    assert.equal(assigned.status, 'identified', JSON.stringify(assigned));
    assert.match(assigned.workbenchId, /^WB-[0-9A-Za-z]{22}$/);
    assert.deepEqual(read(room), { ...manifest, workbenchId: assigned.workbenchId });
    assert.equal(run('identify', room).status, 'current');
    for (const invalid of ['../escape', '', null, { value: 'WB-invalid' }]) {
      fs.writeFileSync(manifestPath(room), JSON.stringify({ ...manifest, workbenchId: invalid }));
      const before = fs.readFileSync(manifestPath(room));
      assert.equal(run('identify', room).status, 'invalid');
      assert.equal(run('migrate', room).status, 'invalid');
      assert.deepEqual(fs.readFileSync(manifestPath(room)), before);
    }
  } finally { fs.rmSync(parent, { recursive: true, force: true }); }
});

test('identity assignment preserves occupied locks and refuses linked or shared manifests', () => {
  const parent = fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-identity-'));
  try {
    const room = create(parent, 'room');
    const file = manifestPath(room);
    const original = fs.readFileSync(file);
    const lock = path.join(room, 'workbench/.identity.lock');
    fs.writeFileSync(lock, 'another writer');
    assert.equal(run('identify', room).error.code, 'identity-busy');
    assert.equal(fs.readFileSync(lock, 'utf8'), 'another writer');
    assert.deepEqual(fs.readFileSync(file), original);
    fs.unlinkSync(lock);
    const saved = path.join(parent, 'original-manifest.json');
    fs.renameSync(file, saved);
    for (const shape of ['symlink', 'hardlink']) {
      if (shape === 'symlink') fs.symlinkSync(saved, file);
      else fs.linkSync(saved, file);
      assert.equal(run('identify', room).status, 'invalid', shape);
      assert.deepEqual(fs.readFileSync(saved), original);
      assert.equal(fs.existsSync(lock), false);
      fs.unlinkSync(file);
    }
  } finally { fs.rmSync(parent, { recursive: true, force: true }); }
});

test('connection allocation validates occupied namespace identities and keeps artifact labels separate', () => {
  const ids = Array.from({ length: 32 }, () => allocateWorkbenchId());
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.every(isWorkbenchId));
  assert.ok(!ids.includes(allocateWorkbenchId(ids)));
  assert.throws(() => allocateWorkbenchId(['S-001']), /valid WB/);
  assert.throws(() => allocateWorkbenchId([ids[0], ids[0]]), /collision/);
  assert.throws(() => allocateWorkbenchId(['WB-000000000000000000000A', 'WB-000000000000000000000a']), /collision/);
});

test('every legacy migration respects the existing identity writer before changing the manifest', () => {
  const parent = fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-identity-'));
  try {
    for (const shape of ['current', 'legacy-nine', 'schema-one']) {
      const room = create(parent, shape);
      let manifest = read(room);
      delete manifest.workbenchId;
      if (shape === 'legacy-nine') delete manifest.collections.recovery;
      if (shape === 'schema-one') {
        fs.rmSync(path.join(room, 'workbench'), { recursive: true });
        const lanes = { specs: 'workbench/specs', wiki: 'workbench/wiki', grilling: 'workbench/grilling', handoffs: 'workbench/handoffs', feedback: 'workbench/feedback' };
        for (const lane of Object.values(lanes)) fs.mkdirSync(path.join(room, lane), { recursive: true });
        manifest = { schemaVersion: 1, workbenchVersion: 'v3.0.0', provenance: { lifecycle: 'genesis' }, lanes };
      }
      fs.writeFileSync(manifestPath(room), JSON.stringify(manifest));
      const before = fs.readFileSync(manifestPath(room));
      const lock = path.join(room, 'workbench/.identity.lock');
      fs.writeFileSync(lock, 'other writer');
      const busy = run('migrate', room, '--version', version);
      assert.equal(busy.error?.code, 'identity-busy', shape + ': ' + JSON.stringify(busy));
      assert.deepEqual(fs.readFileSync(manifestPath(room)), before);
      assert.equal(fs.readFileSync(lock, 'utf8'), 'other writer');
      fs.unlinkSync(lock);
      const migrated = run('migrate', room, '--version', version);
      assert.equal(migrated.status, 'migrated', shape + ': ' + JSON.stringify(migrated));
      assert.match(read(room).workbenchId, /^WB-[0-9A-Za-z]{22}$/);
    }
  } finally { fs.rmSync(parent, { recursive: true, force: true }); }
});

test('concurrent lifecycle writers never report competing identities or erase an assigned namespace', async () => {
  const parent = fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-identity-'));
  function concurrent(command, room, ...args) {
    return new Promise((resolve, reject) => {
      const child = spawn(process.execPath, [tool, command, '--project', room, ...args]);
      let output = '', error = '';
      child.stdout.on('data', chunk => { output += chunk; });
      child.stderr.on('data', chunk => { error += chunk; });
      child.on('error', reject);
      child.on('close', () => {
        try { resolve(JSON.parse(output)); } catch { reject(new Error(error || output)); }
      });
    });
  }
  try {
    const room = path.join(parent, 'room');
    fs.mkdirSync(room);
    const initialized = await Promise.all([1, 2].map(() => concurrent('init', room, '--provenance', 'genesis', '--version', version)));
    assert.equal(initialized.filter(result => result.status === 'initialized').length, 1, JSON.stringify(initialized));
    assert.equal(read(room).workbenchId, initialized.find(result => result.status === 'initialized').manifest.workbenchId);
    for (const competing of ['migrate', 'record-source']) {
      const manifest = read(room);
      delete manifest.workbenchId;
      fs.writeFileSync(manifestPath(room), JSON.stringify(manifest));
      const results = await Promise.all([concurrent('identify', room), concurrent(competing, room)]);
      for (const result of results) {
        if (result.status === 'invalid') assert.equal(result.error.code, 'identity-busy', JSON.stringify(result));
      }
      // A busy assigner is retried after its competing writer finishes.
      const assigned = run('identify', room);
      assert.ok(['current', 'identified'].includes(assigned.status), JSON.stringify(assigned));
      const reported = results.map(result => result.workbenchId ?? result.manifest?.workbenchId).filter(Boolean);
      assert.ok(reported.every(id => id === read(room).workbenchId), JSON.stringify(results));
      assert.equal(assigned.workbenchId, read(room).workbenchId);
      assert.equal(fs.existsSync(path.join(room, 'workbench/.identity.lock')), false);
    }
  } finally { fs.rmSync(parent, { recursive: true, force: true }); }
});

#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

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

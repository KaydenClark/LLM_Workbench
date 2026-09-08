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

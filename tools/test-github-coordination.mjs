#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import test from 'node:test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tool = path.join(root, 'workbench/tools/github-coordination.mjs');
const roomId = 'WB-000000000000000000000A';
const manifest = () => ({ schemaVersion: 2, workbenchId: roomId, githubCoordination: { schemaVersion: 1, repository: 'Example/Room' } });
function git(room, ...args) {
  const result = spawnSync('git', ['-C', room, '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', ...args], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}
function fixture(value = manifest()) {
  const room = fs.mkdtempSync(path.join(os.tmpdir(), 'github-binding-'));
  fs.mkdirSync(path.join(room, 'workbench'));
  fs.writeFileSync(path.join(room, 'workbench/manifest.json'), JSON.stringify(value));
  git(room, 'init', '-q');
  const revision = commit(room);
  return { room, revision };
}
function commit(room) {
  git(room, 'add', '.'); git(room, 'commit', '-qm', 'Fixture source');
  return git(room, 'rev-parse', 'HEAD');
}
function run(room, revision, executable = tool, extra = []) {
  const result = spawnSync(process.execPath, [executable, 'inspect', '--project', room, '--revision', revision, ...extra], { encoding: 'utf8' });
  return { ...result, report: result.stdout ? JSON.parse(result.stdout) : null };
}
function clean(room) { fs.rmSync(room, { recursive: true, force: true }); }

test('committed binding resolves its room and exact source without touching a dirty checkout', () => {
  const { room, revision } = fixture();
  try {
    fs.writeFileSync(path.join(room, 'workbench/manifest.json'), JSON.stringify({ ...manifest(), githubCoordination: { schemaVersion: 1, repository: 'Other/Dirty' } }));
    const before = git(room, 'status', '--porcelain=v1');
    const bytes = fs.readFileSync(path.join(room, 'workbench/manifest.json'));
    const result = run(room, revision);
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(result.report, { status: 'resolved', workbenchId: roomId, repository: 'Example/Room', source: { commit: revision, path: 'workbench/manifest.json' }, access: 'unverified' });
    assert.equal(git(room, 'status', '--porcelain=v1'), before);
    assert.deepEqual(fs.readFileSync(path.join(room, 'workbench/manifest.json')), bytes);
    assert.deepEqual(run(room, revision).report, result.report);
  } finally { clean(room); }
});

test('legacy rooms report unconfigured even when origin points to GitHub', () => {
  const value = manifest(); delete value.githubCoordination;
  const { room, revision } = fixture(value);
  try {
    git(room, 'remote', 'add', 'origin', 'https://github.com/Example/Room.git');
    const result = run(room, revision);
    assert.equal(result.status, 1);
    assert.equal(result.report.error.code, 'coordination-unconfigured');
    assert.equal(git(room, 'status', '--porcelain=v1'), '');
  } finally { clean(room); }
});

test('invalid bindings and room identities refuse with redacted named errors', () => {
  const invalid = [null, [], 'Example/Room', {}, { schemaVersion: 2, repository: 'Example/Room' },
    ...['', 'Example', '../Room', 'Example/../Room', 'https://github.com/Example/Room', 'Example/Room?query', '-owner/Room', 'Example/.', 'Example/..', 'Example/Room\n'].map(repository => ({ schemaVersion: 1, repository })),
    { schemaVersion: 1, repository: 'Example/Room', credential: 'private-fixture-value' }];
  for (const binding of invalid) {
    const { room, revision } = fixture({ ...manifest(), githubCoordination: binding });
    try {
      const result = run(room, revision);
      assert.equal(result.status, 1, JSON.stringify(binding));
      assert.equal(result.report.error.code, 'invalid-coordination-binding');
      assert.ok(!result.stdout.includes('private-fixture-value'));
      assert.equal(git(room, 'status', '--porcelain=v1'), '');
    } finally { clean(room); }
  }
  for (const workbenchId of [undefined, '', 'S-001', null]) {
    const { room, revision } = fixture({ ...manifest(), workbenchId });
    try { assert.equal(run(room, revision).report.error.code, 'invalid-room-identity'); }
    finally { clean(room); }
  }
});

test('exact commit selection ignores replacement objects and later binding changes', () => {
  const { room, revision } = fixture();
  try {
    const value = manifest(); value.githubCoordination.repository = 'Other/Later';
    fs.writeFileSync(path.join(room, 'workbench/manifest.json'), JSON.stringify(value));
    const later = commit(room);
    git(room, 'replace', revision, later);
    assert.equal(run(room, revision).report.repository, 'Example/Room');
    assert.equal(run(room, later).report.repository, 'Other/Later');
  } finally { clean(room); }
});

test('malformed source, linked manifests and missing blobs refuse rather than following the checkout', () => {
  const { room, revision } = fixture();
  const file = path.join(room, 'workbench/manifest.json');
  try {
    fs.writeFileSync(file, '{broken');
    assert.equal(run(room, commit(room)).report.error.code, 'invalid-source-manifest');
    fs.unlinkSync(file); fs.symlinkSync('../outside.json', file);
    assert.equal(run(room, commit(room)).report.error.code, 'invalid-source-manifest');
    fs.unlinkSync(file); fs.writeFileSync(path.join(room, 'other.txt'), 'No manifest');
    assert.equal(run(room, commit(room)).report.error.code, 'invalid-source-manifest');
    assert.equal(run(room, revision).report.status, 'resolved');
  } finally { clean(room); }
});

test('invalid revision, nested project roots and ambiguous CLI arguments refuse before source reads', () => {
  const { room, revision } = fixture();
  try {
    for (const value of ['HEAD', 'main', revision + ':workbench/manifest.json', '0'.repeat(40)]) {
      assert.equal(run(room, value).report.error.code, 'invalid-source-revision');
    }
    assert.equal(run(room, '--all').report.error.code, 'invalid-invocation');
    assert.equal(run(path.join(room, 'workbench'), revision).report.error.code, 'invalid-project-root');
    for (const extra of [['--unknown', 'value'], ['--revision', revision], ['--project'], ['extra']]) {
      assert.equal(run(room, revision, tool, extra).report.error.code, 'invalid-invocation');
    }
  } finally { clean(room); }
});

test('receipt-backed fresh installation delivers and runs the same binding inspector', () => {
  const { room, revision } = fixture();
  try {
    const value = manifest(); value.workbenchVersion = JSON.parse(fs.readFileSync(path.join(root, 'workbench/manifest.json'))).workbenchVersion;
    value.lanes = { tools: 'workbench/tools' };
    fs.writeFileSync(path.join(room, 'workbench/manifest.json'), JSON.stringify(value));
    const installedRevision = commit(room);
    const installation = spawnSync(process.execPath, [path.join(root, 'tools/workbench-tools.mjs'), 'install', '--project', room], { encoding: 'utf8' });
    assert.equal(installation.status, 0, installation.stdout);
    const receipt = JSON.parse(fs.readFileSync(path.join(room, 'workbench/tools/.workbench-tools.json')));
    const installedTool = path.join(room, 'workbench/tools/github-coordination.mjs');
    assert.equal(receipt.files['github-coordination.mjs'], createHash('sha256').update(fs.readFileSync(installedTool)).digest('hex'));
    assert.equal(receipt.source.commit, git(root, 'rev-parse', 'HEAD'));
    const installed = run(room, installedRevision, path.join(room, 'workbench/tools/github-coordination.mjs'));
    assert.equal(installed.status, 0, installed.stdout);
    assert.deepEqual(installed.report, run(room, installedRevision).report);
    assert.equal(installed.report.access, 'unverified');
    assert.equal(run(room, revision).report.repository, 'Example/Room');
  } finally { clean(room); }
});

function gitFiles(directory) {
  return Object.fromEntries(fs.readdirSync(directory, { recursive: true })
    .filter(file => fs.statSync(path.join(directory, file)).isFile())
    .sort().map(file => [file, createHash('sha256').update(fs.readFileSync(path.join(directory, file))).digest('hex')]));
}

test('missing promised commit, tree and blob refuse without transport or Git metadata writes', () => {
  const source = fixture();
  try {
    for (const missing of ['commit', 'tree', 'blob']) {
      const parent = fs.mkdtempSync(path.join(os.tmpdir(), 'github-promisor-'));
      const room = path.join(parent, 'room');
      try {
        git(parent, 'clone', '-q', '--no-hardlinks', source.room, room);
        git(room, 'config', 'remote.origin.promisor', 'true');
        git(room, 'config', 'remote.origin.partialclonefilter', 'blob:none');
        const tripwire = path.join(parent, 'transport-called');
        const transport = path.join(parent, 'upload-pack');
        fs.writeFileSync(transport, `#!/bin/sh\necho transport > '${tripwire}'\nexec git-upload-pack "$@"\n`, { mode: 0o755 });
        git(room, 'config', 'remote.origin.uploadpack', transport);
        const object = missing === 'commit' ? source.revision
          : git(room, 'rev-parse', source.revision + (missing === 'tree' ? '^{tree}' : ':workbench/manifest.json'));
        const metadata = path.join(room, '.git');
        fs.unlinkSync(path.join(metadata, 'objects', object.slice(0, 2), object.slice(2)));
        const before = gitFiles(metadata);
        const result = run(room, source.revision);
        assert.equal(result.status, 1, `Missing ${missing} must refuse`);
        assert.equal(result.report.error.code, missing === 'commit' ? 'invalid-source-revision' : 'invalid-source-manifest');
        assert.equal(fs.existsSync(tripwire), false, `Missing ${missing} must not invoke transport`);
        assert.deepEqual(gitFiles(metadata), before, `Missing ${missing} must preserve all Git metadata`);
      } finally { clean(parent); }
    }
  } finally { clean(source.room); }
});

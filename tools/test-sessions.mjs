#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { checkpoint, scanFile } from '../workbench/tools/sessions.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const layout = path.join(root, 'workbench', 'tools', 'workbench-layout.mjs');
const sessionsTool = path.join(root, 'workbench', 'tools', 'sessions.mjs');

function project() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-sessions-'));
  const init = spawnSync(process.execPath, [layout, 'init', '--project', dir, '--provenance', 'genesis', '--version', 'v3.0.0'], { encoding: 'utf8' });
  assert.equal(init.status, 0, init.stdout);
  spawnSync('git', ['init', '-q'], { cwd: dir });
  return dir;
}

const NOTEPAD = '# Grilling — topic\nSTATUS: PROVISIONAL\n\n1. [locked] Decision one.\n';

test('checkpoint promotes a clean live notepad into the tracked checkpoints collection', () => {
  const dir = project();
  try {
    const live = path.join(dir, 'workbench', 'sessions', 'grilling', 'topic-2026-09-04.md');
    fs.writeFileSync(live, NOTEPAD);
    const ignored = spawnSync('git', ['check-ignore', '-q', 'workbench/sessions/grilling/topic-2026-09-04.md'], { cwd: dir });
    assert.equal(ignored.status, 0, 'the live notepad is untracked by default');
    const result = checkpoint(dir, { from: 'workbench/sessions/grilling/topic-2026-09-04.md', topic: 'topic', date: '2026-09-04' });
    assert.equal(result.status, 'promoted');
    assert.equal(result.checkpoint, 'workbench/sessions/checkpoints/topic-2026-09-04.md');
    const promoted = fs.readFileSync(path.join(dir, result.checkpoint), 'utf8');
    assert.match(promoted, /^<!-- checkpoint: promoted 2026-09-04 from workbench\/sessions\/grilling\/topic-2026-09-04\.md -->\n/);
    assert.equal(promoted.replace(/^<!-- checkpoint:[^\n]*\n/, ''), NOTEPAD, 'the promoted copy is byte-identical below the stamp');
    assert.equal((fs.statSync(path.join(dir, result.checkpoint)).mode & 0o777), 0o644);
    const tracked = spawnSync('git', ['check-ignore', '-q', result.checkpoint], { cwd: dir });
    assert.notEqual(tracked.status, 0, 'the checkpoint is not ignored');
    assert.equal(checkpoint(dir, { from: 'workbench/sessions/grilling/topic-2026-09-04.md', topic: 'topic', date: '2026-09-04' }).error.code, 'invalid-note', 'a duplicate destination is refused');
    assert.throws(() => checkpoint(dir, { from: live, topic: 'Bad Topic' }), /lowercase slug/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('checkpoint refuses secret-like content, private paths, and unsafe sources without writing anything', () => {
  const dir = project();
  try {
    const grilling = path.join(dir, 'workbench', 'sessions', 'grilling');
    fs.writeFileSync(path.join(grilling, 'leak.md'), `${NOTEPAD}\nToken: ghp_A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0\n`);
    fs.writeFileSync(path.join(grilling, 'home.md'), `${NOTEPAD}\nSee /Users/someone/private/notes.md\n`);
    fs.writeFileSync(path.join(grilling, 'mail.md'), `${NOTEPAD}\nContact owner@example.com\n`);
    for (const [name, label] of [['leak.md', 'API token'], ['home.md', 'absolute home path'], ['mail.md', 'email address']]) {
      const refused = checkpoint(dir, { from: `workbench/sessions/grilling/${name}`, topic: 'refused', date: '2026-09-04' });
      assert.equal(refused.status, 'blocked', name);
      assert.equal(refused.error.code, 'secret-like-content');
      assert.ok(refused.hits.some((hit) => hit.label === label && hit.line === 6), `${name} names the ${label} line: ${JSON.stringify(refused.hits)}`);
      assert.equal(fs.existsSync(path.join(dir, 'workbench', 'sessions', 'checkpoints', 'refused-2026-09-04.md')), false, 'nothing is written on refusal');
    }
    fs.symlinkSync(path.join(grilling, 'leak.md'), path.join(grilling, 'link.md'));
    assert.equal(checkpoint(dir, { from: 'workbench/sessions/grilling/link.md', topic: 'link' }).error.code, 'invalid-note');
    const scanned = scanFile(dir, 'workbench/sessions/grilling/leak.md');
    assert.equal(scanned.status, 'blocked');
    const cli = spawnSync(process.execPath, [sessionsTool, 'checkpoint', '--from', 'workbench/sessions/grilling/leak.md', '--topic', 'leak'], { cwd: dir, encoding: 'utf8' });
    assert.equal(cli.status, 1);
    assert.equal(JSON.parse(cli.stdout).error.code, 'secret-like-content');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('checkpoint refuses a linked destination collection without writing outside', () => {
  const dir = project(); const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'session-outside-'));
  try {
    fs.writeFileSync(path.join(dir, 'note.md'), NOTEPAD);
    const destination = path.join(dir, 'workbench', 'sessions', 'checkpoints');
    fs.rmSync(destination, { recursive: true }); fs.symlinkSync(outside, destination);
    const result = spawnSync(process.execPath, [sessionsTool, 'checkpoint', '--path', dir, '--from', 'note.md', '--topic', 'topic'], { encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.deepEqual(fs.readdirSync(outside), []);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); fs.rmSync(outside, { recursive: true, force: true }); }
});

test('checkpoint refuses a source outside the repository root and writes nothing', () => {
  const dir = project(); const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'session-outside-'));
  try {
    fs.writeFileSync(path.join(outside, 'notes.md'), NOTEPAD);
    const checkpoints = path.join(dir, 'workbench', 'sessions', 'checkpoints');
    for (const from of [path.join(outside, 'notes.md'), path.join('..', path.basename(outside), 'notes.md'), path.join(outside, 'missing.md')]) {
      const refused = checkpoint(dir, { from, topic: 'outside', date: '2026-09-04' });
      assert.equal(refused.status, 'blocked', from);
      assert.equal(refused.error.code, 'invalid-note', from);
      assert.match(refused.error.message, /repository root/, 'the refusal names the boundary');
      assert.deepEqual(fs.readdirSync(checkpoints).filter((name) => name !== '.gitkeep'), [], 'nothing is written on refusal');
    }
    assert.equal(checkpoint(dir, { from: dir, topic: 'root' }).error.code, 'invalid-note', 'the root itself is not a source');
    const cli = spawnSync(process.execPath, [sessionsTool, 'checkpoint', '--path', dir, '--from', path.join(outside, 'notes.md'), '--topic', 'outside'], { encoding: 'utf8' });
    assert.equal(cli.status, 1);
    assert.equal(JSON.parse(cli.stdout).error.code, 'invalid-note');
    assert.deepEqual(fs.readdirSync(checkpoints).filter((name) => name !== '.gitkeep'), []);
    fs.writeFileSync(path.join(dir, 'workbench', 'sessions', 'handoffs', 'inside.md'), NOTEPAD);
    const promoted = checkpoint(dir, { from: 'workbench/sessions/handoffs/inside.md', topic: 'inside', date: '2026-09-04' });
    assert.equal(promoted.status, 'promoted', 'an in-repository source still promotes');
    assert.equal(promoted.checkpoint, 'workbench/sessions/checkpoints/inside-2026-09-04.md');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); fs.rmSync(outside, { recursive: true, force: true }); }
});

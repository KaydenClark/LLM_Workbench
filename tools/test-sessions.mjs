#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { createHash } from 'node:crypto';
import { checkpoint, scanFile } from '../workbench/tools/sessions.mjs';
import { listNotes } from '../workbench/tools/notepads.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const layout = path.join(root, 'workbench', 'tools', 'workbench-layout.mjs');
const sessionsTool = path.join(root, 'workbench', 'tools', 'sessions.mjs');
const VERSION = JSON.parse(fs.readFileSync(path.join(root, 'workbench', 'manifest.json'), 'utf8')).workbenchVersion;

function project() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-sessions-'));
  const init = spawnSync(process.execPath, [layout, 'init', '--project', dir, '--provenance', 'genesis', '--version', VERSION], { encoding: 'utf8' });
  assert.equal(init.status, 0, init.stdout);
  spawnSync('git', ['init', '-q'], { cwd: dir });
  return dir;
}

const NOTEPAD = '# Grilling — topic\nSTATUS: PROVISIONAL\n\n1. [locked] Decision one.\n';

test('every preserved checkpoint still matches the pinned retirement inventory', () => {
  const inventory = JSON.parse(fs.readFileSync(path.join(root, 'workbench/specs/S-048-checkpoint-retirement/checkpoint-inventory.json')));
  for (const record of inventory.records) {
    const bytes = fs.readFileSync(path.join(root, record.path));
    assert.equal(bytes.length, record.bytes, record.path);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), record.sha256, record.path);
  }
});

test('operational recovery is excluded from note discovery', () => {
  const dir = project();
  try {
    fs.writeFileSync(path.join(dir, 'workbench/sessions/recovery/adoption-recovery.json'), '{"operational":"receipt"}');
    const listed = listNotes(dir);
    assert.equal(listed.status, 'listed');
    assert.deepEqual(listed.notes, []);
    assert.equal(listNotes(dir, { collection: 'recovery' }).status, 'blocked');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('retired checkpoint invocation preserves source and frozen history without creating a copy', () => {
  const dir = project();
  try {
    const live = 'workbench/sessions/grilling/topic.md';
    const frozen = 'workbench/sessions/checkpoints/historical.md';
    fs.writeFileSync(path.join(dir, live), NOTEPAD);
    fs.writeFileSync(path.join(dir, frozen), '# Historical evidence\r\n');
    const before = [live, frozen].map(file => fs.readFileSync(path.join(dir, file)));
    const result = checkpoint(dir, { from: live, topic: 'new-copy' });
    assert.equal(result.status, 'blocked');
    assert.match(result.error.message, /retired.*promote/s);
    const cli = spawnSync(process.execPath, [sessionsTool, 'checkpoint', '--path', dir, '--from', live, '--topic', 'new-copy'], { encoding: 'utf8' });
    assert.equal(cli.status, 1);
    assert.match(JSON.parse(cli.stdout).error.message, /retired/);
    assert.deepEqual([live, frozen].map(file => fs.readFileSync(path.join(dir, file))), before);
    assert.deepEqual(fs.readdirSync(path.join(dir, 'workbench/sessions/checkpoints')).sort(), ['.gitkeep', 'historical.md']);
    assert.notEqual(spawnSync('git', ['check-ignore', '-q', frozen], { cwd: dir }).status, 0);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('privacy scanning remains available after retiring copied checkpoints', () => {
  const dir = project();
  try {
    for (const [text, label] of [['See /Users/synthetic/private/file', 'absolute home path'], ['Contact owner@example.com', 'email address']]) {
      fs.writeFileSync(path.join(dir, 'scan.md'), '# Synthetic fixture\n' + text);
      const result = scanFile(dir, 'scan.md');
      assert.equal(result.status, 'blocked');
      assert.ok(result.hits.some(hit => hit.label === label));
    }
    fs.writeFileSync(path.join(dir, 'scan.md'), '# Safe source\n');
    assert.equal(scanFile(dir, 'scan.md').status, 'clean');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

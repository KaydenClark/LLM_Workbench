#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { doctor, nextWork } from './spec-workbench.mjs';
import { validateManifest } from './workbench-layout.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

assert.equal(fs.existsSync(path.join(root, 'workbench', 'manifest.json')), true,
  'the Workbench repository must dogfood its own v3 manifest');
assert.equal(fs.existsSync(path.join(root, 'specs')), false,
  'the retired root specs lane must not remain active after dogfood migration');
assert.equal(fs.existsSync(path.join(root, 'workbench', 'specs', 'S-021-portable-workbench-v3', 'SPEC.md')), true,
  'S-021 must be recoverable at its manifest-declared stable path');
const validation = validateManifest(root);
assert.equal(validation.status, 'valid', `the dogfood manifest must validate: ${JSON.stringify(validation.error)}`);
assert.equal(validation.manifest.schemaVersion, 2, 'the Workbench repository must dogfood manifest schema 2');
assert.equal(fs.existsSync(path.join(root, 'workbench', 'sessions', 'checkpoints', 'llm-workbench-v3-1-plan-2026-09-04.md')), true,
  'the tracked v3.1 planning checkpoint must live in the checkpoints collection');
assert.equal(fs.existsSync(path.join(root, 'workbench', 'handoffs')), false, 'the retired v3.0 handoffs lane must not remain');
assert.equal(fs.existsSync(path.join(root, 'workbench', 'grilling')), false, 'the retired v3.0 grilling lane must not remain');
assert.equal(fs.existsSync(path.join(root, 'workbench', 'wiki', 'design-concepts')), true, 'the mandatory design-concepts collection must exist');
const ignored = spawnSync('git', ['check-ignore', '-q', 'workbench/sessions/grilling/live-notepad.md'], { cwd: root });
assert.equal(ignored.status, 0, 'live grilling records must be ignored by default');
const tracked = spawnSync('git', ['check-ignore', '-q', 'workbench/sessions/checkpoints/anything.md'], { cwd: root });
assert.notEqual(tracked.status, 0, 'checkpoints must not be ignored');
// Lane resolution is what this assertion proves; a stale claim is a dated
// lifecycle finding unrelated to the manifest, so it must not couple this test
// to the wall clock.
assert.deepEqual(doctor(root).filter((issue) => issue.code !== 'stale-claim'), [],
  'doctor must resolve only the manifest-declared spec lane');
const selected = nextWork(root);
if (selected) {
  assert.match(selected.path, /^workbench\/specs\/S-\d{3}-[^/]+\/SPEC\.md$/,
    'active dogfood work must resolve from the manifest-declared spec lane');
  assert.equal(fs.existsSync(path.join(root, selected.path)), true,
    'the selected manifest-declared spec must exist');
}
const shown = spawnSync(process.execPath, ['tools/spec-workbench.mjs', 'show', 'S-021'], { cwd: root, encoding: 'utf8' });
assert.equal(shown.status, 0, shown.stderr);
assert.match(shown.stdout, /^# S-021 - Portable Workbench v3/m,
  'cold recovery must resolve S-021 at its manifest-declared stable path');

console.log('ok - LLM Workbench dogfoods its manifest-declared v3 support root');

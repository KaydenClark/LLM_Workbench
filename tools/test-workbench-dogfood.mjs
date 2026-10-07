#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { doctor, nextWork } from '../workbench/tools/spec-workbench.mjs';
import { LEGIBILITY_ENTRIES, validateManifest } from '../workbench/tools/workbench-layout.mjs';

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
// Lane resolution is what this assertion proves. Attention findings (a dated
// stale claim) and slice findings (a ready task waiting on another spec) are
// registered as nonblocking, so only findings that block all or selection
// count here.
assert.deepEqual(doctor(root).filter((issue) => issue.blocks === 'all' || issue.blocks === 'selection'), [],
  'doctor must resolve only the manifest-declared spec lane');
// S-00V TK-01L: overlay the last fetched remote claims without fetching, so
// this lane-resolution check never reaches the network.
const selected = nextWork(root, { fetch: false });
if (selected) {
  assert.match(selected.path, /^workbench\/specs\/S-[0-9A-Za-z]{3,}-[^/]+\/SPEC\.md$/,
    'active dogfood work must resolve from the manifest-declared spec lane');
  assert.equal(fs.existsSync(path.join(root, selected.path)), true,
    'the selected manifest-declared spec must exist');
}
const shown = spawnSync(process.execPath, ['workbench/tools/spec-workbench.mjs', 'show', 'S-021'], { cwd: root, encoding: 'utf8' });
assert.equal(shown.status, 0, shown.stderr);
assert.match(shown.stdout, /^# S-021 - Portable Workbench v3/m,
  'cold recovery must resolve S-021 at its manifest-declared stable path');

// S-004M TK-008T: the Workbench's own room is the first to declare how an
// agent runs, operates, inspects, sees errors in, exercises and measures it.
// Each entry is a command, a path or a short pointer; every path-like token
// it names must exist here, or the declaration routes an agent nowhere.
const legibility = validation.manifest.legibility;
assert.ok(legibility && typeof legibility === 'object', 'the dogfood manifest must declare its legibility surface');
assert.deepEqual(Object.keys(legibility).sort(), [...LEGIBILITY_ENTRIES].sort(), 'the Workbench declares exactly the six entries, confirmed (no pending marker)');
for (const entry of LEGIBILITY_ENTRIES) {
  assert.ok(typeof legibility[entry] === 'string' && legibility[entry].trim() && !/^\[.*\]$/.test(legibility[entry].trim()), `${entry} must be a filled entry, not a placeholder`);
  const tokens = legibility[entry].split(/[\s;,]+/).map((token) => token.replace(/#.*$/, '').replace(/\/$/, '')).filter((token) => token && !token.startsWith('-') && (token.includes('/') || /\.(mjs|md|json|py)$/.test(token)));
  assert.ok(tokens.length, `${entry} names at least one path or script in this room`);
  for (const token of tokens) assert.ok(fs.existsSync(path.join(root, token)), `${entry} names ${token}, which must exist`);
}

console.log('ok - LLM Workbench dogfoods its manifest-declared v3 support root');

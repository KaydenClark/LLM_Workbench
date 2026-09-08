#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import * as sessions from '../workbench/tools/sessions.mjs';
import { createNote, appendEntry } from '../workbench/tools/notepads.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const version = JSON.parse(fs.readFileSync(path.join(root, 'workbench/manifest.json'))).workbenchVersion;
const hash = value => createHash('sha256').update(value).digest('hex');
function fixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'direct-promotion-'));
  const init = spawnSync(process.execPath, [path.join(root, 'workbench/tools/workbench-layout.mjs'), 'init', '--project', dir, '--provenance', 'genesis', '--version', version], { encoding: 'utf8' });
  assert.equal(init.status, 0, init.stdout);
  const note = createNote(dir, { note: 'promotion', objective: 'selected-claims', title: 'Selected claims' });
  assert.equal(note.status, 'created');
  assert.equal(appendEntry(dir, { note: note.note, revision: 1, kind: 'finding', topic: 'rule', content: 'Earlier interpretation.' }).status, 'appended');
  assert.equal(appendEntry(dir, { note: note.note, revision: 2, kind: 'correction', topic: 'rule', corrects: 'finding-001', content: 'The corrected supported rule.' }).status, 'appended');
  fs.writeFileSync(path.join(dir, 'RUNBOOK.md'), '# Runbook\n\n## Procedure\n\nExisting procedure.\n');
  const draft = 'workbench/sessions/handoffs/promotion-draft.md';
  fs.writeFileSync(path.join(dir, draft), '# Runbook\n\n## Procedure\n\nThe corrected supported rule.\n');
  const options = { from: note.note, revision: 3, entries: 'finding-001', to: 'RUNBOOK.md', expected: hash(fs.readFileSync(path.join(dir, 'RUNBOOK.md'))), content: draft };
  return { dir, options };
}
function snapshot(dir, options) { return [options.from, options.to, options.content].map(file => fs.readFileSync(path.join(dir, file))); }

test('public promotion reconciles selected material into an owner and returns verified hashes without cleanup', () => {
  const { dir, options } = fixture();
  try {
    const before = snapshot(dir, options);
    const run = spawnSync(process.execPath, [path.join(root, 'workbench/tools/sessions.mjs'), 'promote', '--path', dir, ...Object.entries(options).flatMap(([key, value]) => [`--${key}`, String(value)])], { encoding: 'utf8' });
    assert.equal(run.status, 0, run.stdout || run.stderr);
    const result = JSON.parse(run.stdout);
    assert.equal(result.status, 'promoted');
    assert.equal(result.destination.path, 'RUNBOOK.md');
    assert.equal(result.destination.sha256, hash(before[2]));
    assert.deepEqual(result.source.selected, ['finding-001']);
    assert.deepEqual(result.source.context, ['correction-001']);
    assert.deepEqual(fs.readFileSync(path.join(dir, options.from)), before[0]);
    assert.deepEqual(fs.readFileSync(path.join(dir, options.to)), before[2]);
    assert.deepEqual(fs.readFileSync(path.join(dir, options.content)), before[2]);
    assert.deepEqual(fs.readdirSync(path.join(dir, 'workbench/sessions/checkpoints')), ['.gitkeep']);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

for (const failure of ['stale-revision', 'stale-destination', 'missing-entry', 'invalid-content', 'private-content', 'live-citation', 'path-escape', 'linked-destination', 'hardlinked-destination', 'linked-draft']) {
  test(`promotion refuses ${failure} and preserves source, destination and draft`, () => {
    const { dir, options } = fixture();
    const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'promotion-outside-'));
    try {
      const target = path.join(dir, options.to);
      if (failure === 'stale-revision') options.revision = 2;
      if (failure === 'stale-destination') options.expected = '0'.repeat(64);
      if (failure === 'missing-entry') options.entries = 'finding-001,finding-999';
      if (failure === 'invalid-content') fs.writeFileSync(path.join(dir, options.content), '');
      if (failure === 'private-content') fs.appendFileSync(path.join(dir, options.content), '\nContact owner@example.com\n');
      if (failure === 'live-citation') fs.appendFileSync(path.join(dir, options.content), `\n[Evidence](${options.from})\n`);
      if (failure === 'path-escape') options.to = path.join(outside, 'RUNBOOK.md');
      if (failure === 'path-escape') { fs.writeFileSync(options.to, 'Outside remains.'); options.expected = hash(fs.readFileSync(options.to)); }
      if (failure === 'linked-destination' || failure === 'hardlinked-destination') {
        const original = path.join(outside, 'original.md');
        fs.renameSync(target, original);
        if (failure === 'linked-destination') fs.symlinkSync(original, target);
        else fs.linkSync(original, target);
      }
      if (failure === 'linked-draft') {
        const original = path.join(outside, 'draft.md');
        fs.renameSync(path.join(dir, options.content), original);
        fs.symlinkSync(original, path.join(dir, options.content));
      }
      const before = [options.from, options.to, options.content].map(file => fs.readFileSync(path.resolve(dir, file)));
      const result = sessions.promote(dir, options);
      assert.equal(result.status, 'blocked', JSON.stringify(result));
      assert.deepEqual([options.from, options.to, options.content].map(file => fs.readFileSync(path.resolve(dir, file))), before);
    } finally { fs.rmSync(dir, { recursive: true, force: true }); fs.rmSync(outside, { recursive: true, force: true }); }
  });
}

for (const failure of ['write', 'read-back']) {
  test(`recoverable ${failure} failure leaves the original owner and source intact`, () => {
    const { dir, options } = fixture();
    const before = snapshot(dir, options);
    const originalRename = fs.renameSync;
    const originalRead = fs.readFileSync;
    let published = false;
    let injected = false;
    try {
      fs.renameSync = function(from, to) {
        if (String(to) === path.join(dir, options.to)) {
          if (failure === 'write' && !injected) { injected = true; throw new Error('Injected publication failure'); }
          published = true;
        }
        return originalRename.call(fs, from, to);
      };
      fs.readFileSync = function(file, ...args) {
        if (failure === 'read-back' && published && !injected && String(file) === path.join(dir, options.to)) { injected = true; throw new Error('Injected read-back failure'); }
        return originalRead.call(fs, file, ...args);
      };
      const result = sessions.promote(dir, options);
      assert.equal(result.status, 'blocked', JSON.stringify(result));
      assert.ok(injected, 'the intended failure point was reached');
      assert.deepEqual(snapshot(dir, options), before);
    } finally { fs.renameSync = originalRename; fs.readFileSync = originalRead; fs.rmSync(dir, { recursive: true, force: true }); }
  });
}

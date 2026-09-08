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

const specBody = '# S-001 - Promotion fixture\n\n**Spec ID:** S-001\n**Status:** active\n**Priority:** 1\n**Owner:** test\n**Updated:** 2026-09-08\n**Catalog description:** Verify promotion.\n**Blockers:** none\n**Latest event:** Started.\n**Next gate:** Verify.\n\n## Vertical Implementation Slices\n\n| Ticket | Slice | Status | Blockers | Proof |\n|---|---|---|---|---|\n| TK-001 | Verify | ready | none | pending |\n\n## Append-Only Evidence And Execution Log\n\n| Date | Ticket | Event | Verification | Docs | Remaining gap |\n|---|---|---|---|---|---|\n| 2026-09-08 | plan | Original evidence | Checked | Current | Implementation |\n';
const ownerCases = [
  ['spec', 'workbench/specs/S-001-promotion/SPEC.md', specBody, value => value.replace('**Status:** active', '**Status:** invalid')],
  ['adr', 'workbench/docs/adr/000A-promotion.md', '---\nstatus: proposed\ndate: 2026-09-08\ncanonicalized_in:\n  - RUNBOOK.md\n---\n\n# Promotion rationale\n', value => value.replace('status: proposed', 'status: invalid')],
  ['wiki', 'workbench/wiki/promotion.md', '---\ntype: project\nstatus: active\nsensitivity: normal\nknowledge_role: curated\nprovenance:\n  - Verified source\nsource_paths:\n  - RUNBOOK.md\nlast_verified: 2026-09-08\n---\n\n# Promotion knowledge\n', value => value.replace('type: project', 'type: invalid')]
];
for (const [owner, file, original, invalidate] of ownerCases) {
  test(`${owner} promotion validates candidate owner structure before publishing`, () => {
    const { dir, options } = fixture();
    try {
      options.to = file;
      fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
      fs.writeFileSync(path.join(dir, file), original);
      options.expected = hash(original);
      fs.writeFileSync(path.join(dir, options.content), invalidate(original));
      const refused = sessions.promote(dir, options);
      assert.equal(refused.status, 'blocked', JSON.stringify(refused));
      assert.equal(fs.readFileSync(path.join(dir, file), 'utf8'), original);
      fs.writeFileSync(path.join(dir, options.content), original + '\nThe corrected supported rule.\n');
      const result = sessions.promote(dir, options);
      assert.equal(result.status, 'promoted', JSON.stringify(result));
      assert.equal(result.destination.owner, owner);
    } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  });
}
test('spec promotion cannot rewrite an existing append-only evidence row', () => {
  const { dir, options } = fixture();
  try {
    options.to = ownerCases[0][1];
    fs.mkdirSync(path.dirname(path.join(dir, options.to)), { recursive: true });
    fs.writeFileSync(path.join(dir, options.to), specBody);
    options.expected = hash(specBody);
    fs.writeFileSync(path.join(dir, options.content), specBody.replace('Original evidence', 'Rewritten evidence'));
    assert.equal(sessions.promote(dir, options).status, 'blocked');
    assert.equal(fs.readFileSync(path.join(dir, options.to), 'utf8'), specBody);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
test('unrecognized ADR filenames cannot bypass the ADR validator', () => {
  const { dir, options } = fixture();
  try {
    options.to = 'workbench/docs/adr/unrecognized.md';
    fs.writeFileSync(path.join(dir, options.to), '# Original\n'); options.expected = hash('# Original\n');
    assert.equal(sessions.promote(dir, options).status, 'blocked');
    assert.equal(fs.readFileSync(path.join(dir, options.to), 'utf8'), '# Original\n');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('invalid UTF-8 draft bytes are refused without lossy replacement', () => {
  const { dir, options } = fixture();
  try {
    fs.writeFileSync(path.join(dir, options.content), Buffer.concat([Buffer.from('# Runbook\n\n'), Buffer.from([0xff])]));
    const before = snapshot(dir, options);
    assert.equal(sessions.promote(dir, options).status, 'blocked');
    assert.deepEqual(snapshot(dir, options), before);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
test('a failed restoration retains a verified original backup and reports partial recovery', () => {
  const { dir, options } = fixture();
  const before = snapshot(dir, options);
  const originalRename = fs.renameSync; const originalRead = fs.readFileSync;
  let published = false; let injected = false;
  try {
    fs.renameSync = function(from, to) {
      if (String(to) === path.join(dir, options.to)) {
        if (published) throw new Error('Injected restoration refusal');
        published = true;
      }
      return originalRename.call(fs, from, to);
    };
    fs.readFileSync = function(file, ...args) {
      if (published && !injected && String(file) === path.join(dir, options.to)) { injected = true; throw new Error('Injected destination read refusal'); }
      return originalRead.call(fs, file, ...args);
    };
    const result = sessions.promote(dir, options);
    assert.equal(result.status, 'partial');
    assert.equal(result.error.code, 'promotion-recovery-required');
    assert.deepEqual(fs.readFileSync(path.join(dir, result.recovery)), before[1]);
    assert.deepEqual(fs.readFileSync(path.join(dir, options.from)), before[0]);
  } finally { fs.renameSync = originalRename; fs.readFileSync = originalRead; fs.rmSync(dir, { recursive: true, force: true }); }
});

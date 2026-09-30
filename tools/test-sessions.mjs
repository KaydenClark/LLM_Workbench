#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { createHash } from 'node:crypto';
import { checkpoint, promote, scanFile } from '../workbench/tools/sessions.mjs';
import { appendEntry, createNote, listNotes } from '../workbench/tools/notepads.mjs';
import { doctor, render } from '../workbench/tools/spec-workbench.mjs';
import { validateAdrs } from '../workbench/tools/adr.mjs';
import { validateWiki } from '../workbench/tools/wiki.mjs';
import { prepareEvidence } from '../workbench/tools/project-evidence.mjs';

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

// S-00V TK-00J: a notepad or handoff may be committed temporarily so a
// continuation can travel with the branch. Committing one is transport, never
// promotion or evidence: the privacy checks still run on it, a durable owner
// that cites it is refused as non-durable, and removing it later leaves the
// room with nothing dangling. Every assertion runs on a note and a handoff
// that are force-added past the ignore rule and committed.
const skillsInstaller = path.join(root, 'tools', 'workbench-skills.mjs');
const COMMITTED_NOTE = 'workbench/sessions/notepads/work/travel-note.json';
const COMMITTED_HANDOFF = 'workbench/sessions/handoffs/travel-handoff.md';

function git(dir, ...args) {
  const result = spawnSync('git', ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', ...args], { cwd: dir, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}

function write(dir, relative, content) {
  fs.mkdirSync(path.dirname(path.join(dir, relative)), { recursive: true });
  fs.writeFileSync(path.join(dir, relative), content);
}

function fixtureSpec(extra = '') {
  return [
    '# S-001 - Fixture capability', '', '**Spec ID:** S-001', '**Status:** active', '**Priority:** 0', '**Owner:** fixture',
    '**Updated:** 2026-09-26', '**Catalog description:** Fixture.', '**Blockers:** none', '**Latest event:** Captured.', '**Next gate:** Claim TK-001.', '',
    '## Vertical Implementation Slices', '', '| Task | Slice | Status | Blockers | Proof |', '|---|---|---|---|---|', '| TK-001 | First slice | ready | none | pending |', '',
    '## Acceptance Criteria', '', '- [ ] Verified.', '', '## Append-Only Evidence And Execution Log', '',
    '| Date | Task | Event | Verification | Docs | Remaining gap |', '|---|---|---|---|---|---|',
    '| 2026-09-26 | TK-001 | Captured | Fixture | none | none |', extra, '', '## Completion Result', '', 'Pending.', ''
  ].join('\n');
}

function wikiNote(title, { sources = ['workbench/wiki'], body = '' } = {}) {
  return `---\ntype: reference\nstatus: active\nsensitivity: normal\nknowledge_role: derived\nprovenance:\n  - fixture\nsource_paths:\n${sources.map(source => `  - ${source}`).join('\n')}\nlast_verified: 2026-09-26\n---\n\n# ${title}\n\n${body}`;
}

// A committed room with a Spec, a Wiki router and a docs owner, then a live
// handoff and notepad force-added past the ignore rule and committed, one at a
// time so each commit's effect on doctor is observable.
function committedRoom() {
  const dir = project();
  git(dir, 'checkout', '-q', '-b', 'main');
  const skills = spawnSync(process.execPath, [skillsInstaller, 'install', '--project', dir], { cwd: root, encoding: 'utf8' });
  assert.equal(skills.status, 0, skills.stdout);
  write(dir, 'BLUEPRINT.md', '# Blueprint\n\n<!-- spec-catalog:start -->\n<!-- spec-catalog:end -->\n');
  write(dir, 'TASKBOARD.md', '# Taskboard\n\n<!-- hot-specs:start -->\n<!-- hot-specs:end -->\n');
  write(dir, 'workbench/wiki/MEMORY.md', wikiNote('Fixture Memory').replace('type: reference', 'type: memory').replace('knowledge_role: derived', 'knowledge_role: canonical'));
  write(dir, 'workbench/docs/fixture-owner.md', '# Fixture owner\n\nDurable text.\n');
  write(dir, 'workbench/specs/S-001-fixture/SPEC.md', fixtureSpec());
  render(dir);
  git(dir, 'add', '-A');
  git(dir, 'commit', '-q', '-m', 'Fixture room');
  git(dir, 'branch', 'integration');
  const baseline = doctor(dir);
  write(dir, COMMITTED_HANDOFF, '# Handoff - travel\n\nContinue the export fix from the travelling note.\n');
  assert.equal(spawnSync('git', ['check-ignore', '-q', COMMITTED_HANDOFF], { cwd: dir }).status, 0, 'the live handoff is ignored by default');
  git(dir, 'add', '-f', COMMITTED_HANDOFF);
  git(dir, 'commit', '-q', '-m', 'Carry the continuation handoff');
  const withHandoff = doctor(dir);
  const created = createNote(dir, { note: COMMITTED_NOTE, objective: 'travel', title: 'Travelling note', focus: 'Continue on another instance.' });
  assert.equal(created.status, 'created', JSON.stringify(created));
  const appended = appendEntry(dir, { note: COMMITTED_NOTE, revision: created.revision, kind: 'decision', topic: 'naming', content: 'Name the export job nightly-export.' });
  assert.equal(appended.status, 'appended', JSON.stringify(appended));
  assert.equal(spawnSync('git', ['check-ignore', '-q', COMMITTED_NOTE], { cwd: dir }).status, 0, 'the live note is ignored by default');
  git(dir, 'add', '-f', COMMITTED_NOTE);
  git(dir, 'commit', '-q', '-m', 'Carry the continuation notepad');
  assert.deepEqual(git(dir, 'ls-files', COMMITTED_NOTE, COMMITTED_HANDOFF).split('\n').sort(), [COMMITTED_HANDOFF, COMMITTED_NOTE].sort(), 'both records are committed');
  return { dir, baseline, withHandoff, revision: appended.revision, entry: appended.entry?.id ?? 'decision-001' };
}

const findingKeys = findings => findings.map(item => `${item.code}|${item.message}`).sort();

test('a committed notepad and handoff stay privacy-checked', () => {
  const { dir, revision, entry } = committedRoom();
  try {
    const noteBytes = fs.readFileSync(path.join(dir, COMMITTED_NOTE));
    const leak = appendEntry(dir, { note: COMMITTED_NOTE, revision, kind: 'finding', topic: 'naming', content: 'Contact owner@example.com about the export.' });
    assert.equal(leak.status, 'blocked');
    assert.equal(leak.error.code, 'secret-like-content');
    assert.ok(fs.readFileSync(path.join(dir, COMMITTED_NOTE)).equals(noteBytes), 'the committed note is unchanged by the refused write');

    assert.equal(scanFile(dir, COMMITTED_HANDOFF).status, 'clean');
    fs.appendFileSync(path.join(dir, COMMITTED_HANDOFF), 'Private file at /Users/synthetic/private/export.log\n');
    const scanned = scanFile(dir, COMMITTED_HANDOFF);
    assert.equal(scanned.status, 'blocked');
    assert.ok(scanned.hits.some(hit => hit.label === 'absolute home path'));
    const cli = spawnSync(process.execPath, [sessionsTool, 'scan', '--path', dir, '--file', COMMITTED_HANDOFF], { encoding: 'utf8' });
    assert.equal(cli.status, 1);
    git(dir, 'checkout', '--', COMMITTED_HANDOFF);

    const owner = 'workbench/docs/fixture-owner.md';
    write(dir, 'draft.md', '# Fixture owner\n\nDurable text. Token: ghp_A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0\n');
    const expected = createHash('sha256').update(fs.readFileSync(path.join(dir, owner))).digest('hex');
    const promoted = promote(dir, { from: COMMITTED_NOTE, revision: String(revision), entries: entry, to: owner, expected, content: 'draft.md' });
    assert.equal(promoted.status, 'blocked');
    assert.equal(promoted.error.code, 'secret-like-content');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('a durable citation naming a committed notepad or handoff is refused as non-durable', () => {
  const { dir, revision, entry } = committedRoom();
  try {
    // Promotion refuses a draft whose provenance links the committed records.
    const owner = 'workbench/docs/fixture-owner.md';
    const expected = createHash('sha256').update(fs.readFileSync(path.join(dir, owner))).digest('hex');
    for (const link of ['../sessions/notepads/work/travel-note.json', '../sessions/handoffs/travel-handoff.md']) {
      write(dir, 'draft.md', `# Fixture owner\n\nDurable text, per [the record](${link}).\n`);
      const promoted = promote(dir, { from: COMMITTED_NOTE, revision: String(revision), entries: entry, to: owner, expected, content: 'draft.md' });
      assert.equal(promoted.status, 'blocked', link);
      assert.match(promoted.error.message, /cannot cite .*live record/, link);
    }

    // An ADR body link to a committed record stays untracked provenance.
    write(dir, 'workbench/docs/adr/0001-fixture.md', '---\nstatus: accepted\ndate: 2026-09-26\ncanonicalized_in:\n  - AGENTS.md\n---\n\n# A decision\n\nSee [the handoff](../../sessions/handoffs/travel-handoff.md) and [the note](../../sessions/notepads/work/travel-note.json).\n');
    assert.deepEqual(validateAdrs(dir).filter(item => item.code === 'untracked-provenance').map(item => item.target).sort(), [COMMITTED_HANDOFF, COMMITTED_NOTE].sort());
    fs.rmSync(path.join(dir, 'workbench/docs/adr/0001-fixture.md'));

    // A Wiki note may not name a committed record as a source or link it.
    write(dir, 'workbench/wiki/travel.md', wikiNote('Travel', { sources: [COMMITTED_HANDOFF], body: 'From [the note](../sessions/notepads/work/travel-note.json).\n' }));
    const wikiFindings = validateWiki(dir).filter(item => item.code === 'untracked-provenance');
    assert.deepEqual(wikiFindings.map(item => item.target).sort(), [COMMITTED_HANDOFF, COMMITTED_NOTE].sort());
    assert.ok(wikiFindings.every(item => item.note === 'workbench/wiki/travel.md' && item.blocks === 'none'));
    fs.rmSync(path.join(dir, 'workbench/wiki/travel.md'));

    // Project evidence may not take a committed record as a source.
    for (const source of [COMMITTED_NOTE, COMMITTED_HANDOFF]) {
      write(dir, 'request.json', JSON.stringify({
        schema_version: 'project-evidence-request-1', project: { name: 'Fixture' },
        objective: { key: 'fixture-evidence', title: 'Fixture evidence', focus: 'Observe the project.' },
        evidence: [{ id: 'E1', source, kind: 'fact', statement: 'The record says so.' }],
        questions: [{ id: 'Q1', question: 'Is it so?', recommendation: 'Check the durable owner.', evidence: ['E1'] }]
      }));
      const prepared = prepareEvidence(dir, { note: 'fixture-evidence', input: path.join(dir, 'request.json') });
      assert.equal(prepared.status, 'blocked', source);
      assert.equal(prepared.error.code, 'non-durable-source', source);
    }
    fs.rmSync(path.join(dir, 'request.json'));

    // A Spec evidence row that links a live record is refused as evidence.
    // Doctor reads Specs only through a valid manifest, and a tracked notepad
    // still fails the manifest's ignore check until TK-01K lifts it, so the
    // notepad is untracked again here (it stays on disk at the same path)
    // while the handoff stays committed.
    git(dir, 'rm', '-q', '--cached', COMMITTED_NOTE);
    git(dir, 'commit', '-q', '-m', 'Untrack the notepad');
    write(dir, 'workbench/specs/S-001-fixture/SPEC.md', fixtureSpec('| 2026-09-26 | TK-001 | Cited a note | [note](../../sessions/notepads/work/travel-note.json) and [handoff](../../sessions/handoffs/travel-handoff.md) | none | none |'));
    const specFindings = doctor(dir).filter(item => item.code === 'untracked-provenance');
    assert.deepEqual(specFindings.map(item => [item.specId, item.target]).sort(), [['S-001', COMMITTED_HANDOFF], ['S-001', COMMITTED_NOTE]]);
    assert.ok(specFindings.every(item => item.severity === 'error' && item.blocks === 'none'));
    write(dir, 'workbench/specs/S-001-fixture/SPEC.md', fixtureSpec());

    // So is an active Task record whose text links one.
    write(dir, 'workbench/specs/S-002-records/SPEC.md', fixtureSpec().replaceAll('S-001', 'S-002').replace('| TK-001 | First slice | ready | none | pending |\n', ''));
    write(dir, 'workbench/specs/S-002-records/tasks/TK-001/TASK.md', [
      '# TK-001 - First slice', '', '**Task ID:** TK-001', '**Spec ID:** S-002', '**Slice:** First slice', '**Status:** ready', '**Blockers:** none',
      '**Destination:** spec-acceptance: S-002 Acceptance Criteria', '', 'Continue from [the handoff](../../../../sessions/handoffs/travel-handoff.md).', ''
    ].join('\n'));
    assert.deepEqual(doctor(dir).filter(item => item.code === 'untracked-provenance').map(item => [item.specId, item.target]), [['S-002', COMMITTED_HANDOFF]]);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('a reference-style or angle-bracket link to a committed live record is refused like an inline one', () => {
  // S-00V TK-02E: the live-record checks read every Markdown link form, not
  // only `[text](path)`, so `[text][n]` with `[n]: path` and `[text](<path>)`
  // cannot cite a committed notepad or handoff past untracked-provenance.
  const { dir } = committedRoom();
  try {
    write(dir, 'workbench/docs/adr/0001-fixture.md', '---\nstatus: accepted\ndate: 2026-09-26\ncanonicalized_in:\n  - AGENTS.md\n---\n\n# A decision\n\nSee [the handoff][h] and [the note](<../../sessions/notepads/work/travel-note.json>).\n\n[h]: ../../sessions/handoffs/travel-handoff.md\n');
    assert.deepEqual(validateAdrs(dir).filter(item => item.code === 'untracked-provenance').map(item => item.target).sort(), [COMMITTED_HANDOFF, COMMITTED_NOTE].sort());
    fs.rmSync(path.join(dir, 'workbench/docs/adr/0001-fixture.md'));

    write(dir, 'workbench/wiki/travel.md', wikiNote('Travel', { body: 'From [the note][n] and [the handoff](<../sessions/handoffs/travel-handoff.md>).\n\n[n]: ../sessions/notepads/work/travel-note.json\n' }));
    assert.deepEqual(validateWiki(dir).filter(item => item.code === 'untracked-provenance').map(item => item.target).sort(), [COMMITTED_HANDOFF, COMMITTED_NOTE].sort());
    fs.rmSync(path.join(dir, 'workbench/wiki/travel.md'));

    // Doctor needs a valid manifest, and a tracked notepad fails its ignore
    // check until TK-01K lifts it, so the notepad is untracked here.
    git(dir, 'rm', '-q', '--cached', COMMITTED_NOTE);
    git(dir, 'commit', '-q', '-m', 'Untrack the notepad');
    write(dir, 'workbench/specs/S-001-fixture/SPEC.md', `${fixtureSpec('| 2026-09-26 | TK-001 | Cited a note | [note][n] and [handoff](<../../sessions/handoffs/travel-handoff.md>) | none | none |')}\n[n]: ../../sessions/notepads/work/travel-note.json\n`);
    assert.deepEqual(doctor(dir).filter(item => item.code === 'untracked-provenance').map(item => [item.specId, item.target]).sort(), [['S-001', COMMITTED_HANDOFF], ['S-001', COMMITTED_NOTE]]);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('removing a committed notepad and handoff leaves no dangling-evidence finding', () => {
  const { dir, baseline, withHandoff } = committedRoom();
  try {
    assert.deepEqual(findingKeys(withHandoff), findingKeys(baseline), 'a committed handoff adds no finding: it is transport');
    // Today a tracked notepad fails the manifest's live-record ignore check,
    // the tool half of the ignore rule TK-01K lifts; it is refused outright,
    // never read as evidence.
    const tracked = doctor(dir);
    assert.deepEqual(tracked.map(item => item.code), ['invalid-manifest']);
    assert.match(tracked[0].message, /must remain ignored and untracked/);
    git(dir, 'rm', '-q', COMMITTED_NOTE, COMMITTED_HANDOFF);
    git(dir, 'commit', '-q', '-m', 'Promote and remove the continuation records');
    assert.equal(git(dir, 'status', '--porcelain'), '');
    assert.deepEqual(findingKeys(doctor(dir)), findingKeys(baseline), 'removal leaves no broken-link, discarded-reference or other finding');
    const listed = listNotes(dir);
    assert.equal(listed.status, 'listed');
    assert.deepEqual(listed.notes, []);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

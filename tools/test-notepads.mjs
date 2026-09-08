#!/usr/bin/env node
// The shared JSON notepad runtime: one objective note created, appended to
// under a revision check, read back in bounded topic slices that carry their
// correction context, and trimmed only of material nothing retained depends on.
//
// Every case here is a public seam - the exported functions and the CLI - not
// an internal helper, so the runtime can be reimplemented without rewriting
// these tests.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { NOTEPAD_SCHEMA_VERSION, LEGACY_SCHEMA_VERSIONS, checkStructure, createNote, appendEntry, setCurrent, readNote, validateNote, listNotes, trimEntries, migrateNote } from '../workbench/tools/notepads.mjs';
import { RUNTIME_TOOLS } from '../workbench/tools/workbench-layout.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const layout = path.join(root, 'workbench', 'tools', 'workbench-layout.mjs');
const notepadsTool = path.join(root, 'workbench', 'tools', 'notepads.mjs');
const VERSION = JSON.parse(fs.readFileSync(path.join(root, 'workbench', 'manifest.json'), 'utf8')).workbenchVersion;

function project() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-notepads-'));
  const init = spawnSync(process.execPath, [layout, 'init', '--project', dir, '--provenance', 'genesis', '--version', VERSION], { encoding: 'utf8' });
  assert.equal(init.status, 0, init.stdout);
  fs.mkdirSync(path.join(dir, 'workbench/sessions/notepads/work'), { recursive: true });
  return dir;
}

function seed(dir, options = {}) {
  const created = createNote(dir, {
    note: options.note ?? 'topic-note',
    objective: options.objective ?? 'notepad-runtime',
    title: options.title ?? 'Notepad runtime',
    focus: options.focus ?? 'Prove one objective survives an interruption.',
    ...options
  });
  assert.equal(created.status, 'created', JSON.stringify(created));
  return created;
}

function cli(dir, args) {
  const run = spawnSync(process.execPath, [notepadsTool, ...args, '--path', dir], { encoding: 'utf8' });
  return { ...run, json: JSON.parse(run.stdout) };
}

test('create writes a valid note into the declared live collection and refuses a duplicate identity', () => {
  const dir = project();
  try {
    const created = seed(dir);
    assert.equal(created.note, 'workbench/sessions/notepads/work/topic-note.json');
    assert.equal(created.revision, 1);
    const stored = JSON.parse(fs.readFileSync(path.join(dir, created.note), 'utf8'));
    assert.equal(stored.schema_version, NOTEPAD_SCHEMA_VERSION);
    assert.equal(stored.objective.key, 'notepad-runtime');
    assert.deepEqual(stored.entries, []);
    assert.deepEqual(stored.current.unresolved, []);
    assert.equal(validateNote(dir, created.note).status, 'valid');

    const duplicate = createNote(dir, { note: 'topic-note', objective: 'notepad-runtime', title: 'Second' });
    assert.equal(duplicate.status, 'blocked');
    assert.equal(duplicate.error.code, 'duplicate-identity');
    assert.equal(JSON.parse(fs.readFileSync(path.join(dir, created.note), 'utf8')).title, 'Notepad runtime', 'the refused create left the existing note untouched');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('append records a sourced finding and its correction under a revision check', () => {
  const dir = project();
  try {
    const created = seed(dir);
    const finding = appendEntry(dir, {
      note: created.note,
      revision: 1,
      kind: 'finding',
      topic: 'x',
      'entry-id': 'finding-001',
      content: 'The installed lane carries eleven managed tools.',
      'source-file': 'workbench/tools/workbench-layout.mjs'
    });
    assert.equal(finding.status, 'appended');
    assert.equal(finding.revision, 2, 'a successful write advances the revision');
    assert.equal(finding.entry, 'finding-001');

    const stale = appendEntry(dir, { note: created.note, revision: 1, kind: 'finding', topic: 'x', content: 'Written against a revision that has moved.' });
    assert.equal(stale.status, 'blocked');
    assert.equal(stale.error.code, 'stale-revision');
    assert.match(stale.error.message, /\b2\b/, 'the refusal names the revision the writer must read');

    const duplicate = appendEntry(dir, { note: created.note, revision: 2, kind: 'finding', topic: 'x', 'entry-id': 'finding-001', content: 'Same identity.' });
    assert.equal(duplicate.status, 'blocked');
    assert.equal(duplicate.error.code, 'duplicate-identity');

    const correction = appendEntry(dir, {
      note: created.note,
      revision: 2,
      kind: 'correction',
      topic: 'x',
      'entry-id': 'correction-001',
      corrects: 'finding-001',
      content: 'It carries twelve; notepads.mjs joined the managed set.'
    });
    assert.equal(correction.status, 'appended');
    assert.equal(correction.revision, 3);

    const dangling = appendEntry(dir, { note: created.note, revision: 3, kind: 'correction', topic: 'x', corrects: 'finding-404', content: 'Corrects nothing that exists.' });
    assert.equal(dangling.status, 'blocked');
    assert.equal(dangling.error.code, 'invalid-note');

    const badKind = appendEntry(dir, { note: created.note, revision: 3, kind: 'musing', topic: 'x', content: 'Not a supported kind.' });
    assert.equal(badKind.status, 'blocked');
    assert.equal(badKind.error.code, 'invalid-note');

    const stored = JSON.parse(fs.readFileSync(path.join(dir, created.note), 'utf8'));
    assert.equal(stored.entries.length, 2, 'every refused append wrote nothing');
    assert.equal(stored.revision, 3);
    assert.ok(stored.entries.every((entry) => typeof entry.recorded_at === 'string'));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('read returns one topic with its correction context and excludes unrelated topics', () => {
  const dir = project();
  try {
    const created = seed(dir);
    appendEntry(dir, { note: created.note, revision: 1, kind: 'finding', topic: 'x', 'entry-id': 'x-1', content: 'X finding.' });
    appendEntry(dir, { note: created.note, revision: 2, kind: 'correction', topic: 'x', 'entry-id': 'x-2', corrects: 'x-1', content: 'X correction.' });
    appendEntry(dir, { note: created.note, revision: 3, kind: 'finding', topic: 'y', 'entry-id': 'y-1', content: 'Y finding, unrelated.' });
    appendEntry(dir, { note: created.note, revision: 4, kind: 'decision', topic: 'y', 'entry-id': 'y-2', 'depends-on': 'x-1', content: 'Y decision that depends on X.' });

    const scoped = readNote(dir, { note: created.note, topic: 'x' });
    assert.equal(scoped.status, 'read');
    const ids = scoped.entries.map((entry) => entry.id);
    assert.deepEqual(ids, ['x-1', 'x-2'], 'the scoped read carries the topic and its correction, and nothing from y');
    assert.ok(!JSON.stringify(scoped.entries).includes('unrelated'), 'y stays out of the scoped response');
    assert.deepEqual(scoped.current, JSON.parse(fs.readFileSync(path.join(dir, created.note), 'utf8')).current, 'a scoped read still carries the current view');

    const dependent = readNote(dir, { note: created.note, topic: 'y' });
    assert.deepEqual(dependent.entries.map((entry) => entry.id), ['y-1', 'y-2', 'x-1', 'x-2'], 'an explicit dependency and its correction travel with y');
    assert.equal(dependent.entries.find((entry) => entry.id === 'x-1').included_as, 'context');
    assert.equal(dependent.entries.find((entry) => entry.id === 'y-1').included_as, 'match');

    const missing = readNote(dir, { note: created.note, topic: 'z' });
    assert.equal(missing.status, 'read');
    assert.deepEqual(missing.entries, []);
    assert.equal(missing.page.matched, 0);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('read paginates explicitly and never truncates silently', () => {
  const dir = project();
  try {
    const created = seed(dir);
    for (let index = 0; index < 5; index += 1) {
      appendEntry(dir, { note: created.note, revision: 1 + index, kind: 'finding', topic: 'x', 'entry-id': `x-${index}`, content: `Finding ${index}.` });
    }
    const first = readNote(dir, { note: created.note, topic: 'x', limit: 2 });
    assert.deepEqual(first.entries.map((entry) => entry.id), ['x-0', 'x-1']);
    assert.equal(first.page.matched, 5);
    assert.equal(first.page.returned, 2);
    assert.equal(first.page.has_more, true);
    assert.equal(first.page.next_cursor, 2);

    const second = readNote(dir, { note: created.note, topic: 'x', limit: 2, cursor: first.page.next_cursor });
    assert.deepEqual(second.entries.map((entry) => entry.id), ['x-2', 'x-3']);
    assert.equal(second.page.has_more, true);

    const last = readNote(dir, { note: created.note, topic: 'x', limit: 2, cursor: second.page.next_cursor });
    assert.deepEqual(last.entries.map((entry) => entry.id), ['x-4']);
    assert.equal(last.page.has_more, false);
    assert.equal(last.page.next_cursor, null);

    const complete = readNote(dir, { note: created.note, topic: 'x' });
    assert.equal(complete.page.returned, 5, 'an unbounded read returns every match');
    assert.equal(complete.page.has_more, false);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('a fresh reader resumes the objective from the current view alone', () => {
  const dir = project();
  try {
    const created = seed(dir);
    appendEntry(dir, { note: created.note, revision: 1, kind: 'finding', topic: 'x', 'entry-id': 'x-1', content: 'X finding.' });
    const saved = setCurrent(dir, {
      note: created.note,
      revision: 2,
      state: 'X is settled; Y is open.',
      'next-action': 'Close Y against the spec.',
      unresolved: ['Y is unproven.']
    });
    assert.equal(saved.status, 'updated');
    assert.equal(saved.revision, 3);

    const resumed = readNote(dir, { note: created.note, view: 'current' });
    assert.equal(resumed.current.state, 'X is settled; Y is open.');
    assert.equal(resumed.current.next_action, 'Close Y against the spec.');
    assert.deepEqual(resumed.current.unresolved, ['Y is unproven.']);
    assert.equal(resumed.entries, undefined, 'the current view alone puts no entry history into the response');
    assert.equal(resumed.revision, 3, 'the reader learns the revision it must write against');

    const stale = setCurrent(dir, { note: created.note, revision: 2, state: 'Written blind.' });
    assert.equal(stale.error.code, 'stale-revision');

    // `--view` is refused by value the way a flag is refused by name: falling
    // through on a typo would return the whole entry history where the caller
    // asked for the compact view.
    for (const view of ['curent', 'entries', '']) {
      const refused = readNote(dir, { note: created.note, view });
      assert.equal(refused.status, 'blocked', JSON.stringify(view));
      assert.equal(refused.error.code, 'invalid-note', JSON.stringify(view));
    }
    assert.ok(Array.isArray(readNote(dir, { note: created.note }).entries), 'omitting --view still reads entries');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('list discovers by objective and falls back to the most recently created note', () => {
  const dir = project();
  try {
    const first = seed(dir, { note: 'older', objective: 'objective-a', title: 'Older' });
    const second = seed(dir, { note: 'newer', objective: 'objective-b', title: 'Newer' });
    appendEntry(dir, { note: second.note, revision: 1, kind: 'finding', topic: 'x', content: 'Touch the newer note last.' });

    const all = listNotes(dir, {});
    assert.equal(all.status, 'listed');
    assert.equal(all.notes[0].note, second.note, 'the most recently created note is offered first');
    assert.equal(all.notes.length, 2);
    assert.ok(all.notes.every((entry) => typeof entry.objective === 'string' && typeof entry.revision === 'number'));

    const scoped = listNotes(dir, { objective: 'objective-a' });
    assert.deepEqual(scoped.notes.map((entry) => entry.note), [first.note]);
    assert.deepEqual(listNotes(dir, { objective: 'objective-none' }).notes, []);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('trim removes reconciled material and refuses to strand a retained dependency', () => {
  const dir = project();
  try {
    const created = seed(dir);
    appendEntry(dir, { note: created.note, revision: 1, kind: 'finding', topic: 'x', 'entry-id': 'x-1', content: 'X finding, reconciled into the spec.' });
    appendEntry(dir, { note: created.note, revision: 2, kind: 'finding', topic: 'y', 'entry-id': 'y-1', content: 'Y finding, still open.' });
    appendEntry(dir, { note: created.note, revision: 3, kind: 'correction', topic: 'y', 'entry-id': 'y-2', corrects: 'y-1', content: 'Y correction, still open.' });

    const stranding = trimEntries(dir, { note: created.note, revision: 4, entry: ['y-1'] });
    assert.equal(stranding.status, 'blocked');
    assert.equal(stranding.error.code, 'retained-dependency');
    assert.match(stranding.error.message, /y-2/, 'the refusal names the retained entry that still depends on it');

    const trimmed = trimEntries(dir, { note: created.note, revision: 4, entry: ['x-1'], 'durable-owner': 'workbench/specs/S-046-json-notepad-foundation/SPEC.md' });
    assert.equal(trimmed.status, 'trimmed');
    assert.deepEqual(trimmed.removed, ['x-1']);
    const stored = JSON.parse(fs.readFileSync(path.join(dir, created.note), 'utf8'));
    assert.deepEqual(stored.entries.map((entry) => entry.id), ['y-1', 'y-2'], 'unresolved work and its correction survive the trim');
    assert.ok(stored.extensions.durable_owners.includes('workbench/specs/S-046-json-notepad-foundation/SPEC.md'), 'the trim records where the removed material now lives');
    assert.equal(stored.revision, 5);

    const absent = trimEntries(dir, { note: created.note, revision: 5, entry: ['x-1'] });
    assert.equal(absent.error.code, 'invalid-note', 'trimming an entry that is already gone is refused, not silently accepted');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('the runtime refuses malformed JSON, an invalid structure, a path escape, and secret-like content', () => {
  const dir = project();
  try {
    const created = seed(dir);
    const notePath = path.join(dir, created.note);

    fs.writeFileSync(path.join(dir, 'workbench', 'sessions', 'notepads', 'work', 'broken.json'), '{ "schema_version": ');
    const malformed = validateNote(dir, 'workbench/sessions/notepads/work/broken.json');
    assert.equal(malformed.status, 'blocked');
    assert.equal(malformed.error.code, 'malformed-json');
    assert.equal(appendEntry(dir, { note: 'workbench/sessions/notepads/work/broken.json', revision: 1, kind: 'finding', topic: 'x', content: 'No.' }).error.code, 'malformed-json');

    fs.writeFileSync(path.join(dir, 'workbench', 'sessions', 'notepads', 'work', 'shapeless.json'), JSON.stringify({ schema_version: NOTEPAD_SCHEMA_VERSION, id: 'N-1' }));
    const shapeless = validateNote(dir, 'workbench/sessions/notepads/work/shapeless.json');
    assert.equal(shapeless.error.code, 'invalid-note');
    assert.ok(shapeless.error.missing.length > 0, 'the refusal names what is missing');

    for (const escape of ['../../outside.json', path.join(os.tmpdir(), 'outside.json')]) {
      const refused = readNote(dir, { note: escape });
      assert.equal(refused.status, 'blocked', escape);
      assert.equal(refused.error.code, 'invalid-note');
    }

    const leak = appendEntry(dir, { note: created.note, revision: 1, kind: 'finding', topic: 'x', content: 'Use token: ghp_A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0 to authenticate.' });
    assert.equal(leak.status, 'blocked');
    assert.equal(leak.error.code, 'secret-like-content');
    assert.ok(leak.hits.some((hit) => hit.label === 'API token'));
    const after = JSON.parse(fs.readFileSync(notePath, 'utf8'));
    assert.deepEqual(after.entries, [], 'the refused append never reached the file');
    assert.equal(after.revision, 1, 'a refused write does not advance the revision');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('a stored line the scanner matches does not refuse every later update', () => {
  const dir = project();
  try {
    const created = seed(dir);
    // A preserved source fragment may legitimately quote a matching string.
    // Only material this call supplies is new, so carrying the stored view
    // forward must not be read as an attempt to record it again.
    const notePath = path.join(dir, created.note);
    const stored = JSON.parse(fs.readFileSync(notePath, 'utf8'));
    stored.current.state = 'The historical record quotes owner@example.com verbatim.';
    fs.writeFileSync(notePath, `${JSON.stringify(stored, null, 2)}\n`);

    const untouched = setCurrent(dir, { note: created.note, revision: 1, 'next-action': 'Advance the next action only.' });
    assert.equal(untouched.status, 'updated', JSON.stringify(untouched));
    assert.equal(JSON.parse(fs.readFileSync(notePath, 'utf8')).current.state, stored.current.state, 'the carried view is unchanged');

    const supplied = setCurrent(dir, { note: created.note, revision: 2, state: 'Now write ghp_A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0 into the view.' });
    assert.equal(supplied.status, 'blocked');
    assert.equal(supplied.error.code, 'secret-like-content', 'newly supplied material is still refused');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('a blocked write leaves the previous valid note in place', () => {
  const dir = project();
  try {
    const created = seed(dir);
    const notePath = path.join(dir, created.note);
    appendEntry(dir, { note: created.note, revision: 1, kind: 'finding', topic: 'x', 'entry-id': 'x-1', content: 'The one entry that must survive.' });
    const before = fs.readFileSync(notePath, 'utf8');

    // The failure has to be forced the same way on every platform, and after
    // the record has been read rather than before. Clearing the file's write
    // bit does not do it: publication renames a fresh file over the
    // destination, and POSIX rename needs write permission on the directory,
    // not on the target - so the append simply succeeded there and an earlier
    // version of this test skipped its own assertions. A second hard link does
    // it everywhere - not because rename fails over a hard link (it succeeds on
    // Windows and on POSIX) but because `assertSafeWritePath` refuses `nlink > 1`
    // before any I/O. The note still reads; only the write is refused.
    const link = path.join(path.dirname(notePath), 'second-name.json');
    fs.linkSync(notePath, link);
    const blocked = appendEntry(dir, { note: created.note, revision: 2, kind: 'finding', topic: 'x', content: 'Interrupted.' });
    fs.rmSync(link, { force: true });

    assert.equal(blocked.status, 'blocked', 'the write must fail, not be skipped');
    assert.equal(blocked.error.code, 'write-failed');
    assert.match(blocked.error.message, /previous valid record is unchanged/);
    assert.equal(fs.readFileSync(notePath, 'utf8'), before, 'the refused write left the record byte-identical');
    assert.equal(validateNote(dir, created.note).status, 'valid', 'the note on disk is still valid after the attempt');
    assert.deepEqual(JSON.parse(before).entries.map((entry) => entry.id), ['x-1'], 'and still holds the entry that had to survive');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('trim refuses to remove a correction while keeping what it corrects', () => {
  const dir = project();
  try {
    const created = seed(dir);
    appendEntry(dir, { note: created.note, revision: 1, kind: 'finding', topic: 'x', 'entry-id': 'f-1', content: 'The lane carries eleven tools.' });
    appendEntry(dir, { note: created.note, revision: 2, kind: 'correction', topic: 'x', 'entry-id': 'c-1', corrects: 'f-1', content: 'It carries twelve.' });

    // The link binds both ways. Dropping the correction alone would leave the
    // note as the only local record of a fact already known to be wrong, and a
    // scoped read would hand it back with nothing marking it superseded.
    const orphaned = trimEntries(dir, { note: created.note, revision: 3, entry: ['c-1'] });
    assert.equal(orphaned.status, 'blocked');
    assert.equal(orphaned.error.code, 'retained-dependency');
    assert.match(orphaned.error.message, /f-1/, 'the refusal names the entry that would be left uncorrected');
    assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dir, created.note), 'utf8')).entries.map((entry) => entry.id), ['f-1', 'c-1']);

    const together = trimEntries(dir, { note: created.note, revision: 3, entry: ['f-1', 'c-1'] });
    assert.equal(together.status, 'trimmed', 'trimming both halves of a settled correction is allowed');
    assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dir, created.note), 'utf8')).entries, []);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('a generated entry id survives a trim', () => {
  const dir = project();
  try {
    const created = seed(dir);
    for (let index = 0; index < 3; index += 1) {
      appendEntry(dir, { note: created.note, revision: 1 + index, kind: 'finding', topic: 'x', content: `Finding ${index}.` });
    }
    const stored = () => JSON.parse(fs.readFileSync(path.join(dir, created.note), 'utf8')).entries.map((entry) => entry.id);
    assert.deepEqual(stored(), ['finding-001', 'finding-002', 'finding-003']);

    // Counting from the entry count would hand the next append `finding-003`,
    // which a survivor already holds - and the documented reconcile-then-keep-
    // working path uses no --entry-id at all.
    assert.equal(trimEntries(dir, { note: created.note, revision: 4, entry: ['finding-001'] }).status, 'trimmed');
    const next = appendEntry(dir, { note: created.note, revision: 5, kind: 'finding', topic: 'x', content: 'Recorded after the trim.' });
    assert.equal(next.status, 'appended', JSON.stringify(next));
    assert.equal(next.entry, 'finding-004');
    assert.deepEqual(stored(), ['finding-002', 'finding-003', 'finding-004']);

    // Counting from the survivors alone is not enough either: trim the whole
    // kind and the sequence would restart, so an id already cited in a durable
    // owner could come back naming different material.
    assert.equal(trimEntries(dir, { note: created.note, revision: 6, entry: ['finding-002', 'finding-003', 'finding-004'] }).status, 'trimmed');
    const after = appendEntry(dir, { note: created.note, revision: 7, kind: 'finding', topic: 'x', content: 'Recorded after the record was emptied.' });
    assert.equal(after.entry, 'finding-005', 'the high-water mark survives an empty record');

    // The mark governs a supplied id too. Testing only the generated path left
    // `--entry-id finding-002` free to write different material under an id the
    // record itself proves was used and trimmed - which is the loss the mark
    // exists to prevent, under a guarantee both Runbooks state unqualified.
    const reused = appendEntry(dir, { note: created.note, revision: 8, kind: 'finding', topic: 'x', 'entry-id': 'finding-002', content: 'Different material under a spent id.' });
    assert.equal(reused.status, 'blocked');
    assert.equal(reused.error.code, 'duplicate-identity');
    assert.match(reused.error.message, /already used finding-002/);
    assert.equal(appendEntry(dir, { note: created.note, revision: 8, kind: 'finding', topic: 'x', 'entry-id': 'finding-009', content: 'A number the kind has not reached.' }).status, 'appended',
      'a number above the mark is still the caller\'s to choose');
    // A prefix with no mark yet may legitimately start at zero.
    assert.equal(appendEntry(dir, { note: created.note, revision: 9, kind: 'finding', topic: 'x', 'entry-id': 'source-0', content: 'First use of a new prefix.' }).status, 'appended');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('no command publishes a record that would fail its own schema', () => {
  const dir = project();
  try {
    // A blank --id and --type pass `??` because an empty string is not nullish.
    for (const options of [{ id: '' }, { type: '' }]) {
      assert.throws(() => createNote(dir, { note: 'blank', objective: 'blank', title: 'Blank', ...options }), /must not be empty/);
    }
    assert.equal(fs.existsSync(path.join(dir, 'workbench', 'sessions', 'notepads', 'work', 'blank.json')), false, 'nothing was written');

    // A legacy record carrying its own `revision` must not migrate to a value
    // the schema rejects, which would leave a file that can never be read,
    // appended to, or migrated again.
    const legacy = {
      schema_version: 'scope-1',
      revision: 0,
      id: 'N-9',
      type: 'grilling',
      status: 'PROVISIONAL',
      title: 'Legacy with its own revision',
      objective: { key: 'legacy' },
      created_at: '2026-09-06T00:00:00Z',
      updated_at: '2026-09-06T00:00:00Z',
      current: { state: 'Carried across.', unresolved: [], next_action: '' },
      entries: [],
      extensions: {}
    };
    const file = 'workbench/sessions/notepads/work/legacy-revision.json';
    fs.writeFileSync(path.join(dir, file), `${JSON.stringify(legacy, null, 2)}\n`);
    const migrated = migrateNote(dir, { note: file });
    assert.equal(migrated.status, 'migrated');
    assert.equal(migrated.revision, 1, 'the schema value wins over the legacy one');
    assert.equal(validateNote(dir, file).status, 'valid', 'the migrated record reads back');
    const stored = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    assert.equal(stored.extensions.migrated_revision, 0, 'the legacy value is preserved, not dropped');
    assert.deepEqual(stored.extensions.migrated_from, ['scope-1'], 'the migration chain is a list, not a replaced value');
    assert.equal(stored.extensions.updated_at_before_migration, legacy.updated_at, 'the record\'s last update time survives its own migration');
    assert.equal(appendEntry(dir, { note: file, revision: 1, kind: 'finding', topic: 'x', content: 'Still writable.' }).status, 'appended');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('the CLI refuses a flag it does not recognise instead of dropping it', () => {
  const dir = project();
  try {
    const created = cli(dir, ['create', '--note', 'typo', '--objective', 'typo', '--title', 'Typo']);
    assert.equal(created.json.status, 'created');
    cli(dir, ['append', '--note', created.json.note, '--revision', '1', '--kind', 'finding', '--topic', 'x', '--entry-id', 'f-1', '--content', 'Eleven tools.']);

    // A dropped `--corects` writes a correction with no link, and a later read
    // returns the superseded claim with nothing marking it corrected - the
    // same loss the trim guard prevents, reached by a typo and invisible to
    // that guard, because the link was never recorded at all.
    const typo = cli(dir, ['append', '--note', created.json.note, '--revision', '2', '--kind', 'correction', '--topic', 'x', '--corects', 'f-1', '--content', 'Twelve.']);
    assert.equal(typo.status, 1, 'a misspelled flag must not exit 0');
    assert.equal(typo.json.error.code, 'invalid-invocation');
    assert.match(typo.json.error.message, /--corects/, 'the refusal names the flag it did not recognise');
    assert.match(typo.json.error.message, /--corrects/, 'and lists the ones it does accept');
    assert.equal(JSON.parse(fs.readFileSync(path.join(dir, created.json.note), 'utf8')).entries.length, 1, 'nothing was written');

    // A flag that is real for another subcommand is still not real for this one.
    assert.equal(cli(dir, ['list', '--topic', 'x']).json.error.code, 'invalid-invocation');
    assert.equal(cli(dir, ['read', '--note', created.json.note, '--durable-owner', 'x']).json.error.code, 'invalid-invocation');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('a workflow field can be written into the current view and survives later updates', () => {
  const dir = project();
  try {
    // `current` preserved an unknown field once present, but nothing could put
    // one there, which left the grilling skill instructing a hand edit outside
    // every guarantee this runtime makes.
    const created = createNote(dir, {
      note: 'grill', objective: 'grill', title: 'Grill',
      'view-field': ['questions=[{"id":"1","status":"open","question":"First decision"}]']
    });
    assert.equal(created.status, 'created');
    const stored = () => JSON.parse(fs.readFileSync(path.join(dir, created.note), 'utf8')).current;
    assert.deepEqual(stored().questions, [{ id: '1', status: 'open', question: 'First decision' }], 'JSON values parse as JSON');

    assert.equal(setCurrent(dir, { note: created.note, revision: 1, state: 'Question one answered.' }).status, 'updated');
    assert.deepEqual(stored().questions.length, 1, 'an unrelated update preserves it');

    const replaced = setCurrent(dir, { note: created.note, revision: 2, 'view-field': ['questions=[{"id":"1","status":"locked","question":"First decision"}]'] });
    assert.equal(replaced.status, 'updated');
    assert.equal(stored().questions[0].status, 'locked');
    assert.equal(stored().state, 'Question one answered.', 'and setting the field alone leaves the state alone');

    assert.equal(setCurrent(dir, { note: created.note, revision: 3, 'view-field': ['owner=codex'] }).status, 'updated');
    assert.equal(stored().owner, 'codex', 'a value that is not JSON is kept as the string it is');

    for (const bad of ['state=x', 'unresolved=[]', 'next_action=x', 'noequals', 'Bad=1']) {
      assert.throws(() => setCurrent(dir, { note: created.note, revision: 4, 'view-field': [bad] }), /view-field/, bad);
    }
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

// Named for what it asserts. `--objective` and `--note` are not in it: both are
// structurally constrained (a lowercase slug, and a path inside a live
// collection) before any value reaches the record, so neither can carry a
// credential. Every field that accepts free text is here.
test('every free-text field is privacy-scanned, not only the content field', () => {
  const dir = project();
  try {
    const created = seed(dir);
    const TOKEN = 'ghp_A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0';
    const HOME = '/Users/someone/private/notes.md';

    // The controls promise this without qualification: "New material is
    // privacy-scanned before it can reach the file."
    for (const [label, options] of [
      ['--next-action', { note: 'leak-a', objective: 'leak', title: 'Leak', 'next-action': `Use ${TOKEN}.` }],
      ['--unresolved', { note: 'leak-b', objective: 'leak', title: 'Leak', unresolved: [`Rotate ${TOKEN}.`] }],
      ['--index', { note: 'leak-c', objective: 'leak', title: 'Leak', index: TOKEN }],
      ['--related', { note: 'leak-d', objective: 'leak', title: 'Leak', related: [HOME] }],
      ['--focus', { note: 'leak-e', objective: 'leak', title: 'Leak', focus: `Rotate ${TOKEN}.` }],
      ['--view-field', { note: 'leak-f', objective: 'leak', title: 'Leak', 'view-field': [`questions=["${TOKEN}"]`] }]
    ]) {
      const refused = createNote(dir, options);
      assert.equal(refused.status, 'blocked', label);
      assert.equal(refused.error.code, 'secret-like-content', label);
      assert.equal(fs.existsSync(path.join(dir, 'workbench', 'sessions', 'notepads', 'work', `${options.note}.json`)), false, `${label} wrote nothing`);
    }

    for (const [label, options] of [
      ['--topic', { kind: 'finding', topic: TOKEN, content: 'Fine content.' }],
      ['--source-file', { kind: 'finding', topic: 'x', content: 'Fine content.', 'source-file': HOME }],
      ['--interpretation', { kind: 'finding', topic: 'x', content: 'Fine content.', interpretation: `Compare ${TOKEN}.` }]
    ]) {
      const refused = appendEntry(dir, { note: created.note, revision: 1, ...options });
      assert.equal(refused.status, 'blocked', label);
      assert.equal(refused.error.code, 'secret-like-content', label);
    }
    assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dir, created.note), 'utf8')).entries, [], 'no refused append reached the file');

    appendEntry(dir, { note: created.note, revision: 1, kind: 'finding', topic: 'x', 'entry-id': 'x-1', content: 'Reconciled.' });
    const owner = trimEntries(dir, { note: created.note, revision: 2, entry: ['x-1'], 'durable-owner': HOME });
    assert.equal(owner.status, 'blocked', '--durable-owner');
    assert.equal(owner.error.code, 'secret-like-content');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('list observes the same live-collection boundary every other subcommand enforces', () => {
  const dir = project();
  try {
    seed(dir);
    assert.equal(listNotes(dir, { collection: 'grilling' }).status, 'listed');
    assert.equal(listNotes(dir, { collection: 'handoffs' }).status, 'listed');
    for (const tracked of ['checkpoints', 'adr']) {
      const refused = listNotes(dir, { collection: tracked });
      assert.equal(refused.status, 'blocked', tracked);
      assert.equal(refused.error.code, 'invalid-note', tracked);
    }
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('the interim scope-1 records read and migrate without regenerating their history', () => {
  const dir = project();
  try {
    assert.ok(LEGACY_SCHEMA_VERSIONS.includes('scope-1'));
    const legacy = {
      schema_version: 'scope-1',
      id: 'N-002',
      type: 'grilling',
      status: 'RECONCILED',
      title: 'Preservation and cleanup guarantees',
      objective: { key: 'notepad-foundation-redesign', focus: 'Preserve important context before interruption.' },
      created_at: '2026-09-06T21:42:12.355675-06:00',
      updated_at: '2026-09-07T05:08:01.076Z',
      relationships: { index: 'N-000', related_notes: ['N-001'] },
      // A workflow field in the current view is exactly what migration must
      // carry: rebuilding the view from three named fields made this the one
      // lossy path in the command whose purpose is lifting a record intact,
      // and it dropped the field `--view-field` exists to create.
      // Shaped like the records this actually runs on. Four of the five live
      // `scope-1` notes keep structured owner tradeoffs in `unresolved`, and a
      // fixture with `unresolved: []` could not fail when migration stringified
      // them into "[object Object]".
      current: {
        state: 'Decisions reconciled into durable owners.',
        unresolved: [{ id: 'W-1', kind: 'owner_tradeoff', question: 'Does this survive?', cost: 'Losing it is silent.' }],
        next_action: 'Retain referenced source fragments.',
        questions: [{ id: '1', status: 'locked' }],
        owner_answers: ['yes']
      },
      entries: [{ id: 'source-027', kind: 'source_record', topic: 'preservation', content: '8. [open] What durability guarantee is required?', interpretation: 'Historical source.', question_id: '8' }],
      extensions: { format_status: 'Interim JSON working shape.', durable_owners: [] }
    };
    const file = 'workbench/sessions/notepads/work/notepad-preservation-guarantees.json';
    fs.writeFileSync(path.join(dir, file), `${JSON.stringify(legacy, null, 2)}\n`);

    const validated = validateNote(dir, file);
    assert.equal(validated.status, 'valid');
    assert.equal(validated.schema_version, 'scope-1');
    assert.equal(readNote(dir, { note: file, topic: 'preservation' }).entries.length, 1, 'a legacy record is readable before migration');

    const refused = appendEntry(dir, { note: file, revision: 1, kind: 'finding', topic: 'preservation', content: 'No writing to an unmigrated record.' });
    assert.equal(refused.status, 'blocked');
    assert.equal(refused.error.code, 'legacy-schema');

    const migrated = migrateNote(dir, { note: file });
    assert.equal(migrated.status, 'migrated');
    assert.equal(migrated.revision, 1);
    const stored = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    assert.equal(stored.schema_version, NOTEPAD_SCHEMA_VERSION);
    assert.deepEqual(stored.entries[0].content, legacy.entries[0].content, 'migration preserves the recorded source text exactly');
    assert.equal(stored.entries[0].question_id, '8');
    assert.equal(stored.created_at, legacy.created_at, 'migration keeps the original creation time');
    assert.deepEqual(stored.current.questions, [{ id: '1', status: 'locked' }], 'a workflow field in the current view survives migration');
    assert.deepEqual(stored.current.owner_answers, ['yes'], 'and so does every other field the record carried there');
    assert.deepEqual(stored.current.unresolved, legacy.current.unresolved, 'unresolved is carried, not coerced: structured material must not become "[object Object]"');
    assert.equal(appendEntry(dir, { note: file, revision: 1, kind: 'finding', topic: 'preservation', content: 'Now writable.' }).status, 'appended');
    assert.equal(migrateNote(dir, { note: file }).error.code, 'invalid-note', 'a migrated record is not migrated twice');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('the CLI reports every result as JSON and fails closed on a refusal', () => {
  const dir = project();
  try {
    const created = cli(dir, ['create', '--note', 'cli-note', '--objective', 'cli', '--title', 'CLI note']);
    assert.equal(created.status, 0, created.stderr);
    assert.equal(created.json.status, 'created');

    const appended = cli(dir, ['append', '--note', created.json.note, '--revision', '1', '--kind', 'finding', '--topic', 'x', '--entry-id', 'x-1', '--content', 'A CLI finding.']);
    assert.equal(appended.json.status, 'appended');
    assert.equal(appended.json.revision, 2);

    const read = cli(dir, ['read', '--note', created.json.note, '--topic', 'x']);
    assert.equal(read.status, 0);
    assert.deepEqual(read.json.entries.map((entry) => entry.id), ['x-1']);

    const stale = cli(dir, ['append', '--note', created.json.note, '--revision', '1', '--kind', 'finding', '--topic', 'x', '--content', 'Stale.']);
    assert.equal(stale.status, 1, 'a refusal exits non-zero');
    assert.equal(stale.json.error.code, 'stale-revision');

    const unknown = cli(dir, ['sharpen', '--note', created.json.note]);
    assert.equal(unknown.status, 1);
    assert.equal(unknown.json.error.code, 'invalid-invocation');
    assert.match(unknown.json.error.message, /create\|append\|current\|read\|list\|validate\|trim\|migrate/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

// Split a documented shell command the way a shell would, honouring the two
// quote styles the Runbook and skills actually use.
function argvOf(command) {
  const argv = [];
  for (const [, single, double, bare] of command.matchAll(/'([^']*)'|"([^"]*)"|(\S+)/g)) {
    argv.push(single ?? double ?? bare);
  }
  return argv;
}

test("the grilling skill's documented command produces the record it shows", () => {
  const dir = project();
  try {
    // The skill has twice drifted from the runtime: first showing a shape the
    // tool did not write, then instructing a write no path could perform. The
    // command and the example are held to each other here so the next drift
    // fails rather than ships.
    const skill = fs.readFileSync(path.join(root, 'skills', 'grilling', 'SKILL.md'), 'utf8');
    const documented = skill.match(/```bash\r?\n([\s\S]*?)```/);
    const example = skill.match(/```json\r?\n([\s\S]*?)```/);
    assert.ok(documented && example, 'the skill must show a create command and the record it writes');
    assert.match(documented[1], /notepads\.mjs create/, 'the documented command is a notepad create');

    const argv = argvOf(documented[1].replace(/\\\r?\n/g, ' '))
      .filter((token) => !['node', 'workbench/tools/notepads.mjs'].includes(token))
      .map((token) => token.replace('TOPIC-YYYY-MM-DD', 'topic-2026-01-31').replace('OBJECTIVE_KEY', 'objective-key'));
    const run = spawnSync(process.execPath, [notepadsTool, ...argv, '--path', dir], { encoding: 'utf8' });
    assert.equal(run.status, 0, run.stdout || run.stderr);
    assert.equal(JSON.parse(run.stdout).status, 'created');

    const written = JSON.parse(fs.readFileSync(path.join(dir, JSON.parse(run.stdout).note), 'utf8'));
    const shown = JSON.parse(example[1]);
    // Timestamps are the only fields a run cannot reproduce from a document.
    for (const record of [written, shown]) delete record.created_at, delete record.updated_at;
    assert.deepEqual(written, shown, 'the example must be what the documented command actually writes');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('the notepad runtime is a managed tool and its live records stay untracked', () => {
  const dir = project();
  try {
    spawnSync('git', ['init', '-q'], { cwd: dir });
    const created = seed(dir);
    const ignored = spawnSync('git', ['check-ignore', '-q', created.note], { cwd: dir });
    assert.equal(ignored.status, 0, 'a live notepad is untracked by default');
    assert.ok(RUNTIME_TOOLS.includes('notepads.mjs'), 'notepads.mjs is one of the Workbench-managed runtime tools');
    const installed = spawnSync(process.execPath, [path.join(root, 'tools', 'workbench-tools.mjs'), 'install', '--project', dir], { encoding: 'utf8' });
    assert.equal(installed.status, 0, installed.stdout);
    assert.ok(fs.existsSync(path.join(dir, 'workbench', 'tools', 'notepads.mjs')), 'installing the managed runtime puts it in the room');
    const receipt = JSON.parse(fs.readFileSync(path.join(dir, 'workbench', 'tools', '.workbench-tools.json'), 'utf8'));
    assert.ok(receipt.files['notepads.mjs'], 'the tools receipt hashes the runtime like every other managed tool');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

for (const operation of ['create', 'current']) {
  test(`${operation} scans decoded nested view values and preserves bytes on refusal`, () => {
    const dir = project();
    try {
      const created = operation === 'current' ? seed(dir) : null;
      const target = path.join(dir, created?.note ?? 'workbench/sessions/notepads/work/escaped.json');
      const before = created ? fs.readFileSync(target, 'utf8') : null;
      for (const value of [String.raw`{"nested":["\u002fUsers/example/private"]}`, String.raw`{"nested":["\u0073k-abcdefghijklmnopqrstuvwxyz123456"]}`]) {
        const options = { note: created?.note ?? 'escaped', objective: 'privacy-check', title: 'Safe title', revision: 1, 'view-field': `context=${value}` };
        const result = operation === 'create' ? createNote(dir, options) : setCurrent(dir, options);
        assert.equal(result.status, 'blocked');
        assert.equal(result.error.code, 'secret-like-content');
        assert.equal(fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : null, before);
      }
    } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  });
}

for (const linked of ['file', 'collection']) {
  test(`discovery refuses an external symbolic-link ${linked} without exposing its metadata`, () => {
    const dir = project();
    const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'notepad-outside-'));
    try {
      const created = seed(dir);
      const collection = path.dirname(path.join(dir, created.note));
      const outsideFile = path.join(outside, 'external.json');
      const note = JSON.parse(fs.readFileSync(path.join(dir, created.note), 'utf8'));
      note.title = 'Outside metadata must not escape';
      fs.writeFileSync(outsideFile, JSON.stringify(note));
      let unsafe;
      if (linked === 'file') {
        unsafe = path.join(collection, 'external.json');
        fs.symlinkSync(outsideFile, unsafe, 'file');
      } else {
        fs.rmSync(collection, { recursive: true });
        unsafe = collection;
        fs.symlinkSync(outside, unsafe, process.platform === 'win32' ? 'junction' : 'dir');
      }
      const result = listNotes(dir);
      assert.ok(!JSON.stringify(result).includes(note.title), 'external metadata is never read back');
      assert.ok(result.unreadable.includes(path.relative(dir, unsafe).split(path.sep).join('/')), 'the unsafe location is explicitly reported');
    } finally { fs.rmSync(dir, { recursive: true, force: true }); fs.rmSync(outside, { recursive: true, force: true }); }
  });
}

test('discovery uses creation chronology even when the older note was updated last', () => {
  const dir = project();
  try {
    const older = seed(dir, { note: 'older' });
    const newer = seed(dir, { note: 'newer' });
    for (const [created, stamp] of [[older, '2026-01-01T00:00:00.000Z'], [newer, '2026-02-01T00:00:00.000Z']]) {
      const file = path.join(dir, created.note);
      const note = JSON.parse(fs.readFileSync(file, 'utf8'));
      note.created_at = stamp; note.updated_at = stamp;
      fs.writeFileSync(file, JSON.stringify(note));
    }
    assert.equal(setCurrent(dir, { note: older.note, revision: 1, state: 'Recently resumed' }).status, 'updated');
    assert.deepEqual(listNotes(dir).notes.map((note) => note.note), [newer.note, older.note]);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('typed local notes are discoverable and tracked schema/examples cannot become live notes', () => {
  const dir = project();
  try {
    const note = seed(dir, { note: 'workbench/sessions/notepads/grilling/typed.json', type: 'grilling' });
    assert.equal(listNotes(dir).notes[0].note, note.note);
    assert.equal(readNote(dir, { note: note.note }).status, 'read');
    const tracked = 'workbench/sessions/notepads/templates/work.example.json';
    assert.equal(createNote(dir, { note: tracked, objective: 'boundary', title: 'Must refuse' }).status, 'blocked');
    assert.equal(readNote(dir, { note: tracked }).status, 'blocked');
    assert.ok(listNotes(dir).notes.every((entry) => !entry.note.includes('/templates/')));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('shipped examples satisfy the shared runtime and legacy bare-name lookup stays unchanged', () => {
  const dir = project();
  try {
    const templates = path.join(dir, 'workbench/sessions/notepads/templates');
    const schema = JSON.parse(fs.readFileSync(path.join(templates, 'notepad.schema.json'), 'utf8'));
    assert.equal(schema.properties.schema_version.const, NOTEPAD_SCHEMA_VERSION);
    for (const type of ['work', 'grilling', 'handoff']) {
      const example = JSON.parse(fs.readFileSync(path.join(templates, `${type}.example.json`), 'utf8'));
      assert.deepEqual(checkStructure(example), { missing: [], invalid: [] });
      assert.ok(schema.required.every(key => Object.hasOwn(example, key)));
    }
    const file = path.join(dir, 'workbench/manifest.json');
    const manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
    delete manifest.collections.notepads; delete manifest.collections['notepad-templates'];
    fs.writeFileSync(file, JSON.stringify(manifest));
    const old = seed(dir, { note: 'legacy' });
    assert.equal(old.note, 'workbench/sessions/grilling/legacy.json');
    assert.equal(readNote(dir, { note: 'legacy' }).status, 'read');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('the published schema accepts an existing valid entry without an optional topic', () => {
  const dir = project();
  try {
    const created = seed(dir);
    const file = path.join(dir, created.note);
    const note = JSON.parse(fs.readFileSync(file, 'utf8'));
    note.entries.push({ id: 'finding-1', kind: 'finding', content: 'Preserved unclassified context.' });
    fs.writeFileSync(file, JSON.stringify(note));
    assert.equal(validateNote(dir, created.note).status, 'valid');
    const schema = JSON.parse(fs.readFileSync(path.join(dir, 'workbench/sessions/notepads/templates/notepad.schema.json'), 'utf8'));
    assert.ok(schema.properties.entries.items.required.every(key => Object.hasOwn(note.entries[0], key)), 'schema required fields agree with preserved runtime-valid records');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('whole cleanup refuses unfinished context and deletes only an empty reconciled record', () => {
  const dir = project();
  try {
    const created = seed(dir);
    const file = path.join(dir, created.note);
    const original = fs.readFileSync(file);
    const active = cli(dir, ['delete', '--note', created.note, '--revision', '1']);
    assert.equal(active.json.error.code, 'retained-dependency');
    assert.deepEqual(fs.readFileSync(file), original);
    assert.equal(setCurrent(dir, { note: created.note, revision: 1, status: 'RECONCILED', unresolved: ['Still needed'] }).status, 'updated');
    assert.equal(cli(dir, ['delete', '--note', created.note, '--revision', '2']).json.error.code, 'retained-dependency');
    setCurrent(dir, { note: created.note, revision: 2, unresolved: [] });
    appendEntry(dir, { note: created.note, revision: 3, kind: 'finding', topic: 'open', content: 'Must survive until reconciled.' });
    assert.equal(cli(dir, ['delete', '--note', created.note, '--revision', '4']).json.error.code, 'retained-dependency');
    trimEntries(dir, { note: created.note, revision: 4, entry: ['finding-001'] });
    assert.equal(cli(dir, ['delete', '--note', created.note, '--revision', '4']).json.error.code, 'stale-revision');
    const deleted = cli(dir, ['delete', '--note', created.note, '--revision', '5']);
    assert.equal(deleted.json.status, 'deleted');
    assert.equal(fs.existsSync(file), false);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('an authored handoff retains its source slice until the destination is reconciled', () => {
  const dir = project();
  try {
    const created = seed(dir);
    appendEntry(dir, { note: created.note, revision: 1, kind: 'finding', topic: 'x', 'entry-id': 'x-1', content: 'X must remain accessible to the receiving context.' });
    appendEntry(dir, { note: created.note, revision: 2, kind: 'finding', topic: 'y', 'entry-id': 'y-1', content: 'Y is already reconciled.' });
    const handoff = cli(dir, ['create', '--collection', 'handoffs', '--note', 'destination', '--type', 'handoff', '--objective', 'notepad-runtime', '--title', 'Destination-specific handoff', '--retains', `${created.note}#x-1`]);
    assert.equal(handoff.status, 0, handoff.stdout);
    const source = path.join(dir, created.note);
    const before = fs.readFileSync(source);
    const denied = trimEntries(dir, { note: created.note, revision: 3, entry: ['x-1'] });
    assert.equal(denied.error.code, 'retained-dependency');
    assert.deepEqual(fs.readFileSync(source), before);
    assert.equal(trimEntries(dir, { note: created.note, revision: 3, entry: ['y-1'] }).status, 'trimmed');
    setCurrent(dir, { note: handoff.json.note, revision: 1, status: 'RECONCILED' });
    assert.equal(trimEntries(dir, { note: created.note, revision: 4, entry: ['x-1'] }).status, 'trimmed');
    setCurrent(dir, { note: created.note, revision: 5, status: 'RECONCILED' });
    assert.equal(cli(dir, ['delete', '--note', created.note, '--revision', '6']).json.status, 'deleted');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('whole cleanup refuses a retained whole-note pointer and unreadable dependency records', () => {
  const dir = project();
  try {
    const created = seed(dir, { status: 'RECONCILED' });
    const handoff = cli(dir, ['create', '--collection', 'handoffs', '--note', 'pointer', '--objective', 'notepad-runtime', '--title', 'Retain source', '--retains', created.note]);
    assert.equal(handoff.status, 0, handoff.stdout);
    assert.equal(cli(dir, ['delete', '--note', created.note, '--revision', '1']).json.error.code, 'retained-dependency');
    setCurrent(dir, { note: handoff.json.note, revision: 1, status: 'RECONCILED' });
    fs.writeFileSync(path.join(dir, 'workbench/sessions/handoffs/broken.json'), '{');
    const unknown = cli(dir, ['delete', '--note', created.note, '--revision', '1']);
    assert.equal(unknown.json.error.code, 'retained-dependency');
    assert.ok(unknown.json.error.unreadable.includes('workbench/sessions/handoffs/broken.json'));
    assert.equal(fs.existsSync(path.join(dir, created.note)), true);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

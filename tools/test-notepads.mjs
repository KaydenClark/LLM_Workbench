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
import { NOTEPAD_SCHEMA_VERSION, LEGACY_SCHEMA_VERSIONS, createNote, appendEntry, setCurrent, readNote, validateNote, listNotes, trimEntries, migrateNote } from '../workbench/tools/notepads.mjs';
import { RUNTIME_TOOLS } from '../workbench/tools/workbench-layout.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const layout = path.join(root, 'workbench', 'tools', 'workbench-layout.mjs');
const notepadsTool = path.join(root, 'workbench', 'tools', 'notepads.mjs');
const VERSION = JSON.parse(fs.readFileSync(path.join(root, 'workbench', 'manifest.json'), 'utf8')).workbenchVersion;

function project() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-notepads-'));
  const init = spawnSync(process.execPath, [layout, 'init', '--project', dir, '--provenance', 'genesis', '--version', VERSION], { encoding: 'utf8' });
  assert.equal(init.status, 0, init.stdout);
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
    assert.equal(created.note, 'workbench/sessions/grilling/topic-note.json');
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
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('list discovers by objective and falls back to the most recently updated note', () => {
  const dir = project();
  try {
    const first = seed(dir, { note: 'older', objective: 'objective-a', title: 'Older' });
    const second = seed(dir, { note: 'newer', objective: 'objective-b', title: 'Newer' });
    appendEntry(dir, { note: second.note, revision: 1, kind: 'finding', topic: 'x', content: 'Touch the newer note last.' });

    const all = listNotes(dir, {});
    assert.equal(all.status, 'listed');
    assert.equal(all.notes[0].note, second.note, 'the most recently updated note is offered first');
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

    fs.writeFileSync(path.join(dir, 'workbench', 'sessions', 'grilling', 'broken.json'), '{ "schema_version": ');
    const malformed = validateNote(dir, 'workbench/sessions/grilling/broken.json');
    assert.equal(malformed.status, 'blocked');
    assert.equal(malformed.error.code, 'malformed-json');
    assert.equal(appendEntry(dir, { note: 'workbench/sessions/grilling/broken.json', revision: 1, kind: 'finding', topic: 'x', content: 'No.' }).error.code, 'malformed-json');

    fs.writeFileSync(path.join(dir, 'workbench', 'sessions', 'grilling', 'shapeless.json'), JSON.stringify({ schema_version: NOTEPAD_SCHEMA_VERSION, id: 'N-1' }));
    const shapeless = validateNote(dir, 'workbench/sessions/grilling/shapeless.json');
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

    // The failure has to be forced the same way on every platform. Clearing
    // the file's write bit does not do it: publication renames a fresh file
    // over the destination, and POSIX rename needs write permission on the
    // directory, not on the target - so the append simply succeeded there and
    // an earlier version of this test skipped its own assertions. Replacing
    // the collection directory with a file blocks the rename everywhere.
    const collection = path.dirname(notePath);
    const stash = `${collection}-stash`;
    fs.renameSync(collection, stash);
    fs.writeFileSync(collection, 'not a directory\n');
    const blocked = appendEntry(dir, { note: created.note, revision: 2, kind: 'finding', topic: 'x', content: 'Interrupted.' });
    fs.rmSync(collection, { force: true });
    fs.renameSync(stash, collection);

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
    assert.equal(fs.existsSync(path.join(dir, 'workbench', 'sessions', 'grilling', 'blank.json')), false, 'nothing was written');

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
    const file = 'workbench/sessions/grilling/legacy-revision.json';
    fs.writeFileSync(path.join(dir, file), `${JSON.stringify(legacy, null, 2)}\n`);
    const migrated = migrateNote(dir, { note: file });
    assert.equal(migrated.status, 'migrated');
    assert.equal(migrated.revision, 1, 'the schema value wins over the legacy one');
    assert.equal(validateNote(dir, file).status, 'valid', 'the migrated record reads back');
    const stored = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    assert.equal(stored.extensions.migrated_revision, 0, 'the legacy value is preserved, not dropped');
    assert.equal(appendEntry(dir, { note: file, revision: 1, kind: 'finding', topic: 'x', content: 'Still writable.' }).status, 'appended');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('every supplied string is privacy-scanned, not only the content field', () => {
  const dir = project();
  try {
    const created = seed(dir);
    const TOKEN = 'ghp_A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0';
    const HOME = '/Users/someone/private/notes.md';

    // The controls promise this without qualification: "New material is
    // privacy-scanned before it can reach the file."
    for (const [label, options] of [
      ['--next-action', { note: 'leak-a', objective: 'leak', title: 'Leak', 'next-action': `Use ${TOKEN}.` }],
      ['--unresolved', { note: 'leak-b', objective: 'leak', title: 'Leak', unresolved: [`Rotate ${TOKEN}.`] }]
    ]) {
      const refused = createNote(dir, options);
      assert.equal(refused.status, 'blocked', label);
      assert.equal(refused.error.code, 'secret-like-content', label);
      assert.equal(fs.existsSync(path.join(dir, 'workbench', 'sessions', 'grilling', `${options.note}.json`)), false, `${label} wrote nothing`);
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
      current: { state: 'Decisions reconciled into durable owners.', unresolved: [], next_action: 'Retain referenced source fragments.' },
      entries: [{ id: 'source-027', kind: 'source_record', topic: 'preservation', content: '8. [open] What durability guarantee is required?', interpretation: 'Historical source.', question_id: '8' }],
      extensions: { format_status: 'Interim JSON working shape.', durable_owners: [] }
    };
    const file = 'workbench/sessions/grilling/notepad-preservation-guarantees.json';
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

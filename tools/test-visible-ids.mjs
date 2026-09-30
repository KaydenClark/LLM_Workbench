#!/usr/bin/env node
import assert from 'node:assert/strict';
import test from 'node:test';
import { BASE62_ALPHABET, encodeBase62, allocateVisibleId, visibleIdKey, compareVisibleIds, allocateArtifactId, encodeArtifactSuffix } from '../workbench/tools/visible-ids.mjs';

test('base62 encoding has explicit alphabet and grows without truncation', () => {
  assert.equal(BASE62_ALPHABET, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');
  for (const [value, text] of [[0n, '0'], [9n, '9'], [10n, 'A'], [35n, 'Z'], [36n, 'a'], [61n, 'z'], [62n, '10'], [238328n, '1000']]) assert.equal(encodeBase62(value), text);
  assert.throws(() => encodeBase62(-1n));
});

test('allocation treats legacy labels as occupied strings, not an ordinal high-water mark', () => {
  const ids = ['S-010', ...Array.from({ length: 9 }, (_, i) => `S-00${i + 1}`)];
  assert.equal(allocateVisibleId('S', ids), 'S-00A');
  assert.equal(allocateVisibleId('ADR', ids, { width: 4 }), 'ADR-0001');
  assert.equal(allocateVisibleId('S', ['S-00A']), 'S-001');
  assert.deepEqual(ids[0], 'S-010');
});

test('allocation skips case and leading-zero aliases, then grows past its minimum width', () => {
  assert.equal(visibleIdKey('N-000a'), visibleIdKey('N-00A'));
  assert.notEqual(visibleIdKey('N-001'), visibleIdKey('H-001'));
  const occupied = [...BASE62_ALPHABET.slice(1, 36)].map(value => `N-${value}`);
  assert.equal(allocateVisibleId('N', occupied, { width: 1 }), 'N-10');
  assert.throws(() => allocateVisibleId('N', ['N-00A', 'N-00a']), /collision/i);
  assert.throws(() => allocateVisibleId('../N', []));
  assert.throws(() => allocateVisibleId('N', [], { width: 0 }));
});


test('durable allocation can distinguish legacy numeric labels and sort independently of locale', () => {
  assert.equal(allocateVisibleId('TK', ['TK-001'], { requireLetter: true }), 'TK-00A');
  assert.deepEqual(['S-1000', 'S-00z', 'S-00A', 'S-010', 'S-001'].sort(compareVisibleIds), ['S-001', 'S-00A', 'S-00z', 'S-010', 'S-1000']);
});

// S-01W TK-02B: the artifact policy (owner decision E-8) is uppercase `0-9A-Z`,
// minimum width four, letter-bearing, collision-checked against every
// spelling. It is a separate codec: the base62 codec above stays unchanged
// for Workbench connection identities.
const LETTERS = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];

test('artifact allocation starts at uppercase width four in an empty or numeric room', () => {
  assert.equal(allocateArtifactId('S', []), 'S-000A');
  assert.equal(allocateArtifactId('TK', []), 'TK-000A');
  const numeric = ['S-010', ...Array.from({ length: 9 }, (_, i) => `S-00${i + 1}`)];
  assert.equal(allocateArtifactId('S', numeric), 'S-000A');
  assert.equal(allocateArtifactId('TK', ['TK-001', 'TK-0001', 'TK-002']), 'TK-000A');
  assert.deepEqual(numeric[0], 'S-010', 'the occupied inventory is read, never rewritten');
});

test('artifact allocations contain only 0-9A-Z, are letter-bearing and never shorter than four', () => {
  const ids = [];
  for (let i = 0; i < 1500; i += 1) {
    const id = allocateArtifactId('S', ids);
    assert.match(id, /^S-[0-9A-Z]{4,}$/, id);
    assert.ok(/[A-Z]/.test(id.slice(2)), `${id} is letter-bearing`);
    ids.push(id);
  }
  assert.equal(new Set(ids.map(visibleIdKey)).size, ids.length, 'no two allocations share one identity');
});

test('short and widened spellings of one identity occupy each other', () => {
  const beforeQ = LETTERS.slice(0, 16).map(letter => `S-00${letter}`);
  assert.equal(visibleIdKey('S-00Q'), visibleIdKey('S-000Q'));
  assert.equal(allocateArtifactId('S', [...beforeQ, 'S-00Q']), 'S-000R', 'S-00Q occupies S-000Q');
  assert.equal(allocateArtifactId('S', [...beforeQ, 'S-000Q']), 'S-000R', 'S-000Q occupies S-00Q');
  assert.equal(allocateArtifactId('S', ['S-00a']), 'S-000B', 'a lowercase legacy label occupies its uppercase identity');
  assert.equal(allocateArtifactId('S', ['S-00A', 'S-00A', 'S-00Q', 'S-000Q', 'S-00q']), 'S-000B', 'repeated references to one identity reserve it once without choosing a winner');
});

test('artifact allocation grows past its minimum width without truncating or recycling', () => {
  assert.equal(encodeArtifactSuffix(0n), '0');
  assert.equal(encodeArtifactSuffix(35n), 'Z');
  assert.equal(encodeArtifactSuffix(36n), '10', 'base36 overflow grows; it never emits lowercase');
  assert.equal(encodeArtifactSuffix(36n ** 4n), '10000');
  assert.throws(() => encodeArtifactSuffix(-1n));
  const single = LETTERS.map(letter => `N-${letter}`);
  assert.equal(allocateArtifactId('N', single, { width: 1 }), 'N-1A', 'overflow at explicit width one grows to two characters');
  assert.equal(allocateArtifactId('N', [...single, 'N-01A'], { width: 1 }), 'N-1B');
  assert.equal(allocateArtifactId('N', ['N-00000A'], { width: 6 }), 'N-00000B');
  assert.throws(() => allocateArtifactId('N', [], { width: 0 }));
  assert.throws(() => allocateArtifactId('../N', []));
  assert.throws(() => allocateArtifactId('N', 'N-000A'));
});

test('the artifact policy leaves explicit-width base62 allocation for ADR and notepad callers unchanged', () => {
  assert.equal(allocateVisibleId('ADR', ['ADR-0001'], { width: 4, requireLetter: true }), 'ADR-000A');
  assert.equal(allocateVisibleId('N', []), 'N-001');
  assert.throws(() => allocateVisibleId('N', ['N-00A', 'N-00a']), /collision/i);
});

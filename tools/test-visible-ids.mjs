#!/usr/bin/env node
import assert from 'node:assert/strict';
import test from 'node:test';
import { BASE62_ALPHABET, encodeBase62, allocateVisibleId, visibleIdKey, compareVisibleIds } from '../workbench/tools/visible-ids.mjs';

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

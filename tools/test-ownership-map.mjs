#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { readOwnership, validateOwnership } from '../workbench/tools/ownership-map.mjs';
const root = path.resolve(import.meta.dirname, '..');
test('reader fails visibly for missing and malformed maps without writes', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ownership-reader-'));
  try {
    assert.throws(() => readOwnership(dir), /missing/);
    fs.writeFileSync(path.join(dir, 'OWNERSHIP.json'), '{bad');
    assert.throws(() => readOwnership(dir), /invalid JSON/);
    assert.equal(fs.readFileSync(path.join(dir, 'OWNERSHIP.json'), 'utf8'), '{bad');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
test('root reader exposes 28 distinct type-level responsibilities and nine relations', () => {
  const map = readOwnership(root);
  assert.equal(map.rows.length, 28);
  assert.equal(new Set(map.rows.map(row => row.key)).size, 28);
  assert.equal(map.relations.length, 9);
  assert.equal(map.rows.find(row => row.key === 'authority').routes[0].artifact, 'AGENTS.md');
});
test('closed schema rejects duplicate/missing keys, claim text, status and embedded instance identifiers', () => {
  const source = readOwnership(root);
  for (const change of [
    m => m.rows.pop(), m => m.rows[1].key = m.rows[0].key,
    m => m.rows[0].routes[0].artifact = 'The shared understanding between the parties working on a project',
    m => m.rows[0].routes[0].path = 'Agents must never merge main without approval',
    m => m.rows[0].status = 'accepted', m => m.rows[0].claim = 'Agent must obey',
    m => m.rows[0].routes[0].path = 'docs/prefix-ADR-000B-suffix.md',
    m => m.rows[0].routes[0].path = '../outside.md',
    m => m.rows[0].routes[0].role = 'approver',
    m => m.rows[0].classification = 'invariant',
    m => m.relations[0].name = 'owned by'
  ]) {
    const map = structuredClone(source); change(map);
    assert.throws(() => validateOwnership(map));
  }
});

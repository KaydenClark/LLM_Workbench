#!/usr/bin/env node
// The Grilling Destination Audit Ledger is one owned JSON record in the wiki
// lane. The v4 audit reads it as the destination, so a malformed question, a
// wrong tally, or a second hand-kept copy must fail here rather than mislead
// the audit.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const wiki = path.join(root, 'workbench', 'wiki');
const LEDGER = path.join(wiki, 'grilling-destination-audit-ledger.json');
const STATUSES = new Set(['locked', 'answered-in-chat', 'partially-answered', 'open', 'deferred', 'withdrawn', 'superseded', 'not-a-question']);
const ACTIONS = new Set(['create', 'update', 'retire', 'none']);
const TEXT_FIELDS = ['id', 'family', 'topic', 'question', 'status', 'answer', 'reason'];

function ledger() {
  return JSON.parse(fs.readFileSync(LEDGER, 'utf8'));
}

test('the ledger is one JSON record with no hand-kept Markdown copy', () => {
  assert.ok(fs.existsSync(LEDGER), 'workbench/wiki/grilling-destination-audit-ledger.json must exist');
  assert.equal(ledger().schema, 'grilling-destination-ledger/1');
  assert.equal(fs.existsSync(path.join(wiki, 'grilling-destination-audit-ledger.md')), false, 'the JSON replaced the Markdown ledger; a second copy would drift');
  assert.match(fs.readFileSync(path.join(wiki, 'MEMORY.md'), 'utf8'), /\(grilling-destination-audit-ledger\.json\)/, 'MEMORY.md routes to the ledger');
});

test('every question carries a valid question, status, answer, reason and result', () => {
  const { questions } = ledger();
  const ids = new Set();
  for (const question of questions) {
    for (const field of TEXT_FIELDS) assert.ok(typeof question[field] === 'string' && question[field].trim(), `${question.id} needs a non-empty ${field}`);
    assert.equal(ids.has(question.id), false, `${question.id} appears twice`);
    ids.add(question.id);
    assert.ok(STATUSES.has(question.status), `${question.id} has unknown status ${question.status}`);
    assert.equal(question.family, question.id.split('-')[0], `${question.id} names the wrong family`);
    assert.ok(Array.isArray(question.result) && question.result.length > 0, `${question.id} needs at least one result`);
    for (const result of question.result) {
      assert.ok(ACTIONS.has(result.action), `${question.id} result has unknown action ${result.action}`);
      assert.ok(result.artifact?.trim() && result.effect?.trim(), `${question.id} result needs an artifact and an effect`);
    }
  }
  for (const question of questions) {
    for (const related of question.related) assert.ok(ids.has(related), `${question.id} relates to unknown question ${related}`);
  }
});

test('the counting block matches the questions it counts', () => {
  const { counting, questions, families } = ledger();
  const counted = questions.filter((question) => question.counted);
  assert.equal(counted.length, counting.unique_question_ids);
  assert.deepEqual(questions.filter((question) => !question.counted).map((question) => question.id), counting.recovered_outside_count);
  const tally = {};
  for (const question of counted) tally[question.status] = (tally[question.status] ?? 0) + 1;
  assert.deepEqual(Object.fromEntries(Object.entries(tally).sort()), Object.fromEntries(Object.entries(counting.status_tally).sort()));
  const familyIds = new Set(families.map((family) => family.id));
  for (const question of questions) assert.ok(familyIds.has(question.family), `${question.id} belongs to an undeclared family`);
});

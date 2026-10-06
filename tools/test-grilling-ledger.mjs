#!/usr/bin/env node
// The Grilling Destination Audit Ledger is one owned JSON record in the
// sessions lane (an interim home while its rows become question cards; the
// Wiki holds readable pages, not records). The v4 audit reads it as the
// destination, so a malformed question, a wrong tally, or a second hand-kept
// copy must fail here rather than mislead the audit.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const wiki = path.join(root, 'workbench', 'wiki');
const sessions = path.join(root, 'workbench', 'sessions');
const LEDGER_NAME = 'grilling-destination-audit-ledger.json';
const LEDGER = path.join(sessions, LEDGER_NAME);
const STATUSES = new Set(['locked', 'answered-in-chat', 'partially-answered', 'open', 'deferred', 'withdrawn', 'superseded', 'not-a-question']);
const ACTIONS = new Set(['create', 'update', 'retire', 'none']);
const TEXT_FIELDS = ['id', 'family', 'topic', 'question', 'status', 'answer', 'reason'];

function ledger() {
  return JSON.parse(fs.readFileSync(LEDGER, 'utf8'));
}

test('the ledger is one JSON record in the sessions lane with no hand-kept copy in the Wiki', () => {
  assert.ok(fs.existsSync(LEDGER), 'workbench/sessions/grilling-destination-audit-ledger.json must exist');
  assert.equal(ledger().schema, 'grilling-destination-ledger/1');
  assert.equal(fs.existsSync(path.join(wiki, LEDGER_NAME)), false, 'the ledger left the Wiki for the sessions lane; a second copy would drift');
  assert.equal(fs.existsSync(path.join(wiki, 'grilling-destination-audit-ledger.md')), false, 'the JSON replaced the Markdown ledger; a second copy would drift');
  assert.doesNotMatch(fs.readFileSync(path.join(wiki, 'MEMORY.md'), 'utf8'), /\]\(grilling-destination-audit-ledger\.json\)/, 'the Wiki router no longer routes to a ledger it does not hold');
});

test('the sessions lane tracks the ledger rather than ignoring it', () => {
  const result = spawnSync('git', ['check-ignore', '-q', path.relative(root, LEDGER)], { cwd: root });
  assert.equal(result.status, 1, 'git must not ignore the ledger path; an ignored ledger could not be committed');
});

test('every live Markdown link to the ledger resolves to the file where it lives now', () => {
  const broken = [];
  const link = /\]\(([^)\s#]*grilling-destination-audit-ledger\.json)(?:#[^)]*)?\)/g;
  const walk = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) { walk(file); continue; }
      if (!entry.name.endsWith('.md')) continue;
      for (const match of fs.readFileSync(file, 'utf8').matchAll(link)) {
        if (path.resolve(directory, match[1]) !== LEDGER) broken.push(`${path.relative(root, file)} -> ${match[1]}`);
      }
    }
  };
  for (const lane of ['wiki', 'specs', 'docs']) walk(path.join(root, 'workbench', lane));
  assert.deepEqual(broken, [], 'these links no longer reach the ledger');
});

const WIKI_ROWS = ['WIKI-1', 'WIKI-2', 'WIKI-3', 'WIKI-4', 'WIKI-5', 'WIKI-6', 'WIKI-7', 'WIKI-8', 'WIKI-9', 'WIKI-10'];

test('the ten 2026-10-01 Wiki grilling questions are locked rows with the owner source', () => {
  const rows = new Map(ledger().questions.map((question) => [question.id, question]));
  assert.ok(ledger().families.some((family) => family.id === 'WIKI'), 'WIKI is a declared family');
  for (const id of WIKI_ROWS) {
    const row = rows.get(id);
    assert.ok(row, `${id} must be a ledger row`);
    assert.equal(row.status, 'locked', `${id} is an owner-confirmed answer`);
    assert.match(row.answered, /^2026-10-01/, `${id} names the grilling date`);
    assert.ok(row.source_refs.some((ref) => ref.includes('wiki-definition-and-use-2026-10-01.json#')), `${id} cites the grilling note`);
    assert.ok(row.result.some((result) => /000R-the-wiki-is-the-evolving-synthesis/.test(result.artifact) || /SCHEMA\.md/.test(result.artifact)), `${id} names the Canon owner of its answer`);
  }
});

test('LD-4 and LD-22B read superseded and name replacement rows that exist', () => {
  const rows = new Map(ledger().questions.map((question) => [question.id, question]));
  const expected = { 'LD-4': ['WIKI-1', 'WIKI-3'], 'LD-22B': ['WIKI-1', 'WIKI-6'] };
  for (const [id, replacements] of Object.entries(expected)) {
    const row = rows.get(id);
    assert.equal(row.status, 'superseded', `${id} records the confirmed-only Wiki model the owner superseded`);
    for (const replacement of replacements) {
      assert.ok(rows.has(replacement), `${replacement} must exist`);
      assert.ok(row.related.includes(replacement), `${id} relates to ${replacement}`);
      assert.match(row.progress.sub_label, new RegExp(replacement), `${id} names ${replacement} as its successor`);
      assert.ok(rows.get(replacement).related.includes(id), `${replacement} points back to ${id}`);
    }
    assert.ok(row.answer.trim(), `${id} keeps its historical answer; ledger rows are never deleted`);
  }
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

// Build progress is a dated reading of the destination against one integration
// commit. It lives beside the destination fields, never inside them, so a
// stale reading can be replaced without touching a settled answer.
const PROGRESS = ['implemented-and-completed', 'specced', 'specced-and-tasked', 'in-progress', 'not-started', 'no-build-obligation'];
const NO_BUILD_STATUSES = new Set(['open', 'withdrawn', 'not-a-question', 'superseded']);

test('the progress assessment is pinned to one integration commit and its tally matches', () => {
  const { progress_assessment: assessment, questions } = ledger();
  assert.ok(assessment, 'the ledger needs a top-level progress_assessment');
  assert.match(assessment.commit ?? '', /^[0-9a-f]{40}$/, 'progress_assessment.commit is a full integration SHA');
  assert.match(assessment.date ?? '', /^\d{4}-\d{2}-\d{2}$/, 'progress_assessment.date is an ISO date');
  assert.ok(typeof assessment.method === 'string' && assessment.method.trim(), 'progress_assessment.method says how rows were judged');
  assert.deepEqual(Object.keys(assessment).sort(), ['commit', 'date', 'method', 'statuses', 'tally'], 'progress_assessment holds only commit, date, method, statuses and tally');
  assert.deepEqual(Object.keys(assessment.statuses ?? {}), PROGRESS, 'progress_assessment.statuses defines every status in order');
  const tally = Object.fromEntries(PROGRESS.map((status) => [status, 0]));
  for (const question of questions) tally[question.progress?.status] += 1;
  assert.deepEqual(assessment.tally, tally, 'progress_assessment.tally counts every question once');
});

test('every question carries a separate progress reading with evidence', () => {
  for (const question of ledger().questions) {
    const { progress } = question;
    assert.ok(progress && typeof progress === 'object', `${question.id} needs a progress object`);
    assert.deepEqual(Object.keys(progress).sort(), ['evidence', 'gap', 'status', 'sub_label'], `${question.id} progress holds only status, sub_label, evidence and gap`);
    assert.ok(PROGRESS.includes(progress.status), `${question.id} has unknown progress status ${progress.status}`);
    assert.ok(typeof progress.evidence === 'string' && progress.evidence.trim(), `${question.id} progress needs evidence`);
    assert.ok(progress.sub_label === null || (typeof progress.sub_label === 'string' && progress.sub_label.trim()), `${question.id} sub_label is null or text`);
    assert.equal(typeof progress.gap, 'string', `${question.id} gap is text`);
    assert.doesNotMatch(`${progress.evidence} ${progress.gap}`, /(^|[\s(`'"])\/(Users|home|private|tmp)\//, `${question.id} progress cites repo-relative paths only`);
    if (progress.status !== 'implemented-and-completed' && progress.status !== 'no-build-obligation') assert.ok(progress.gap.trim(), `${question.id} is not complete, so it names its gap`);
    if (NO_BUILD_STATUSES.has(question.status)) assert.equal(progress.status, 'no-build-obligation', `${question.id} is ${question.status}, so it carries no build obligation of its own`);
    if (question.status === 'superseded') assert.match(progress.sub_label ?? '', /^superseded by /, `${question.id} names its successor instead of being counted twice`);
  }
});

#!/usr/bin/env node
// The Grill Board seams: items.json is written only through the tool, the
// owner's answers.json is written only by the served page, an item is never
// deleted or renumbered, a changed proposal invalidates the earlier answer,
// and the live board in this repository validates.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import {
  ANSWERS_SCHEMA, ITEMS_SCHEMA, addItems, applyAnswer, boardPaths, createServer, itemStatus, mergeBoard,
  pendingForAgents, readAnswers, readItems, readSourceFile, recordAnswer, reviseItem, statusSummary, withdrawItem
} from '../workbench/tools/grill-board.mjs';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tool = path.join(repo, 'workbench', 'tools', 'grill-board.mjs');

function room() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'grill-board-'));
  fs.mkdirSync(path.join(dir, 'workbench', 'grill-board'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'workbench', 'manifest.json'), '{}\n');
  fs.copyFileSync(path.join(repo, 'workbench', 'grill-board', 'index.html'), path.join(dir, 'workbench', 'grill-board', 'index.html'));
  fs.writeFileSync(path.join(dir, 'workbench', 'grill-board', 'items.json'), `${JSON.stringify({
    schema: ITEMS_SCHEMA,
    title: 'Fixture board',
    integration: 'abc1234',
    generatedAt: '2026-10-03T00:00:00.000Z',
    notice: 'fixture',
    groups: [{ id: 'g1', title: 'Group one', intro: 'fixture group', order: 1 }],
    items: []
  }, null, 2)}\n`);
  fs.writeFileSync(path.join(dir, 'README.md'), 'readable\n');
  return dir;
}

function sample(key = 'k1', overrides = {}) {
  return {
    key,
    group: 'g1',
    kind: 'owner-decision',
    title: 'A decision (S-999)',
    question: 'Yes or no?',
    current: 'Now: nothing.',
    proposal: 'Agent proposal: yes.',
    draft: null,
    options: null,
    sources: [{ label: 'README.md', path: 'README.md', ref: 'abc1234' }],
    tags: [],
    ...overrides
  };
}

function cli(dir, args) {
  const run = spawnSync(process.execPath, [tool, ...args, '--path', dir], { encoding: 'utf8' });
  let json = null;
  try { json = JSON.parse(run.stdout); } catch {}
  return { ...run, json };
}

test('add allocates stable sequential identities and refuses a duplicate key', () => {
  const dir = room();
  assert.deepEqual(addItems(dir, [sample('a'), sample('b')], { by: 'tester' }), ['GB-0001', 'GB-0002']);
  assert.deepEqual(addItems(dir, [sample('c')], { by: 'tester' }), ['GB-0003']);
  assert.throws(() => addItems(dir, [sample('a')], { by: 'tester' }), /duplicate-key|already exists/);
  assert.throws(() => addItems(dir, [sample('d')], {}), /--by/);
  const items = readItems(dir).items;
  assert.equal(items.length, 3);
  assert.equal(items[0].revision, 1);
  assert.equal(items[0].status, 'open');
  assert.equal(items[0].applied, null);
});

test('add refuses an item that misses a required field or uses an unknown kind', () => {
  const dir = room();
  assert.throws(() => addItems(dir, [sample('bad', { kind: 'vote' })], { by: 'tester' }), /unknown kind/);
  assert.throws(() => addItems(dir, [sample('bad', { proposal: '' })], { by: 'tester' }), /missing proposal/);
  assert.throws(() => addItems(dir, [sample('bad', { group: 'nope' })], { by: 'tester' }), /unknown group/);
});

test('status derivation: pending, answered, applied, stale after revise, withdrawn', () => {
  const dir = room();
  addItems(dir, [sample('a')], { by: 'tester' });
  let view = mergeBoard(dir);
  assert.equal(view.items[0].derivedStatus, 'pending');
  assert.equal(view.items[0].options.length, 4, 'default options apply when options is null');
  assert.throws(() => applyAnswer(dir, 'GB-0001', { by: 'agent', where: 'nowhere' }), /nothing-to-apply|no owner answer/);

  const saved = recordAnswer(dir, 'GB-0001', { verdict: 'correct', note: 'use my words', itemRevision: 1 });
  assert.equal(saved.derivedStatus, 'answered');
  assert.deepEqual(pendingForAgents(dir).map((item) => [item.id, item.verdict, item.note]), [['GB-0001', 'correct', 'use my words']]);

  const applied = applyAnswer(dir, 'GB-0001', { by: 'agent', where: 'S-999 Decisions row' });
  assert.equal(applied.applied.verdict, 'correct');
  assert.equal(applied.applied.note, 'use my words');
  assert.equal(mergeBoard(dir).items[0].derivedStatus, 'applied');
  assert.throws(() => applyAnswer(dir, 'GB-0001', { by: 'agent', where: 'again' }), (e) => e.code === 'already-applied');

  reviseItem(dir, 'GB-0001', { proposal: 'Agent proposal: no, after all.' }, { by: 'agent', reason: 'new evidence' });
  view = mergeBoard(dir);
  assert.equal(view.items[0].revision, 2);
  assert.equal(view.items[0].derivedStatus, 'stale', 'an older answer must be re-answered after a revision');
  assert.throws(() => applyAnswer(dir, 'GB-0001', { by: 'agent', where: 'x' }), (e) => e.code === 'stale-answer');
  assert.equal(pendingForAgents(dir).length, 0, 'stale answers are not handed to agents');

  const again = recordAnswer(dir, 'GB-0001', { verdict: 'confirm', note: '', itemRevision: 2 });
  assert.equal(again.derivedStatus, 'answered');
  assert.equal(readAnswers(dir).answers['GB-0001'].history.length, 1, 'the earlier answer is kept in history');

  withdrawItem(dir, 'GB-0001', { by: 'agent', reason: 'superseded by GB-0002' });
  assert.equal(mergeBoard(dir).items[0].derivedStatus, 'withdrawn');
  assert.equal(readItems(dir).items.length, 1, 'withdraw never deletes');
});

test('recordAnswer refuses an unknown item or a verdict that is not one of its options', () => {
  const dir = room();
  addItems(dir, [sample('a', { options: [{ value: 'x', label: 'X' }] })], { by: 'tester' });
  assert.throws(() => recordAnswer(dir, 'GB-0009', { verdict: 'x', note: '', itemRevision: 1 }), /unknown-item|not on the board/);
  assert.throws(() => recordAnswer(dir, 'GB-0001', { verdict: 'confirm', note: '', itemRevision: 1 }), /not an option/);
  assert.equal(recordAnswer(dir, 'GB-0001', { verdict: '', note: 'a note only', itemRevision: 1 }).derivedStatus, 'answered');
  assert.equal(itemStatus(readItems(dir).items[0], { verdict: '', note: '  ', at: 'x', itemRevision: 1 }), 'pending', 'blank verdict and blank note is not an answer');
});

test('the server serves the page, writes answers.json only on PUT, and never touches items.json', async () => {
  const dir = room();
  addItems(dir, [sample('a')], { by: 'tester' });
  const itemsBefore = fs.readFileSync(boardPaths(dir).items, 'utf8');
  const server = createServer(dir);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const page = await fetch(`${base}/`);
    assert.equal(page.status, 200);
    assert.match(await page.text(), /Grill Board/);
    const board = await (await fetch(`${base}/api/board`)).json();
    assert.equal(board.items.length, 1);
    assert.equal(board.items[0].links[0].url, 'https://github.com/KaydenClark/LLM_Workbench/blob/abc1234/README.md');
    assert.equal(fs.existsSync(boardPaths(dir).answers), false, 'reading never creates the owner file');

    const put = await fetch(`${base}/api/answers/GB-0001`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ verdict: 'confirm', note: 'ok', itemRevision: 1 }) });
    assert.equal(put.status, 200);
    const answers = readAnswers(dir);
    assert.equal(answers.schema, ANSWERS_SCHEMA);
    assert.equal(answers.answers['GB-0001'].verdict, 'confirm');
    assert.equal(fs.readFileSync(boardPaths(dir).items, 'utf8'), itemsBefore, 'items.json is untouched by the owner path');

    const bad = await fetch(`${base}/api/answers/GB-0002`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ verdict: 'confirm', note: '', itemRevision: 1 }) });
    assert.equal(bad.status, 404);
    const file = await (await fetch(`${base}/api/file?path=README.md`)).json();
    assert.equal(file.text, 'readable\n');
    const escape = await fetch(`${base}/api/file?path=../../etc/passwd`);
    assert.equal(escape.status, 400);
    const status = await (await fetch(`${base}/api/status`)).json();
    assert.equal(status.counts.answered, 1);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('readSourceFile refuses paths outside the room', () => {
  const dir = room();
  assert.throws(() => readSourceFile(dir, '../outside.txt'), (e) => e.code === 'unsafe-path');
  assert.throws(() => readSourceFile(dir, '/etc/hosts'), (e) => e.code === 'unsafe-path');
  assert.equal(readSourceFile(dir, 'README.md'), 'readable\n');
});

test('the CLI exposes no command that writes answers.json and reports with exit codes', () => {
  const dir = room();
  const added = cli(dir, ['add', '--file', path.join(repo, 'tools', 'test-grill-board.mjs').replace(/test-grill-board\.mjs$/, '..', 'package.json'), '--by', 'cli']);
  assert.equal(added.status, 1, 'a file that is not an item list is refused');
  const fragment = path.join(dir, 'new.json');
  fs.writeFileSync(fragment, JSON.stringify({ items: [sample('cli-a')] }));
  const ok = cli(dir, ['add', '--file', fragment, '--by', 'cli', '--json']);
  assert.equal(ok.status, 0, ok.stdout + ok.stderr);
  assert.deepEqual(ok.json.added, ['GB-0001']);
  const unknown = cli(dir, ['answer', 'GB-0001']);
  assert.equal(unknown.status, 1);
  assert.equal(unknown.json.error.code, 'invalid-invocation');
  const status = cli(dir, ['status', '--json']);
  assert.equal(status.json.counts.pending, 1);
  const validate = cli(dir, ['validate']);
  assert.equal(validate.status, 0);
  const pending = cli(dir, ['pending', '--json']);
  assert.deepEqual(pending.json, []);
});

test('the live board in this repository validates and every item carries a source', () => {
  const live = path.join(repo, 'workbench', 'grill-board', 'items.json');
  if (!fs.existsSync(live)) {
    assert.fail('workbench/grill-board/items.json is missing');
  }
  const board = readItems(repo);
  assert.ok(board.items.length > 0);
  for (const item of board.items) {
    assert.ok(item.sources.length > 0, `${item.id} has no source`);
    assert.ok(item.title.trim().length >= 12, `${item.id} title is too short to name its artifact`);
  }
  const summary = statusSummary(repo);
  assert.equal(summary.total, board.items.length);
  const groups = new Set(board.groups.map((group) => group.id));
  for (const group of summary.groups) assert.ok(groups.has(group.id));
});

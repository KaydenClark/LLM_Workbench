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
import vm from 'node:vm';
import {
  ANSWERS_SCHEMA, ITEMS_SCHEMA, addItems, applyAnswer, boardPaths, createServer, itemStatus, mergeBoard,
  pendingForAgents, readAnswers, readItems, readSourceFile, recordAnswer, reviseItem, statusSummary, withdrawItem,
  gradeItems, reassessItems
} from './grill-board.mjs';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tool = path.join(repo, 'tools', 'grill-board.mjs');

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

test('decision context survives a revision and never changes an owner answer', () => {
  const dir = room();
  addItems(dir, [sample('context')], { by: 'tester' });
  recordAnswer(dir, 'GB-0001', { verdict: 'confirm', note: 'My original words', itemRevision: 1 });
  const before = fs.readFileSync(boardPaths(dir).answers, 'utf8');
  const brief = { scope: 'SPEC', summary: 'A small capability.', why: 'Avoid an ambiguous approval.', recommendation: 'Review the concrete change.', impact: 'Approval applies to this capability.', changes: 'Before: pending. After: reviewed.', history: 'Earlier question and correction.', artifacts: 'Named capability and purpose.' };
  reviseItem(dir, 'GB-0001', { brief }, { by: 'tester', reason: 'Bundle decision context' });
  assert.deepEqual(mergeBoard(dir).items[0].brief, brief);
  assert.equal(mergeBoard(dir).items[0].derivedStatus, 'stale');
  assert.equal(fs.readFileSync(boardPaths(dir).answers, 'utf8'), before);
  assert.throws(() => reviseItem(dir, 'GB-0001', { brief: { ...brief, scope: 'MADE-UP' } }, { by: 'tester', reason: 'bad scope' }), /scope/);
  assert.equal(readItems(dir).items[0].revision, 2, 'invalid context leaves the previous item intact');
});

test('saved notes, legacy Not now and an unexplained send-back are not decisions an agent may apply', () => {
  const dir = room();
  addItems(dir, [sample('notes')], { by: 'tester' });
  recordAnswer(dir, 'GB-0001', { verdict: '', note: 'Still thinking', itemRevision: 1 });
  assert.deepEqual(pendingForAgents(dir), []);
  assert.throws(() => applyAnswer(dir, 'GB-0001', { by: 'tester', where: 'Spec' }), /decision|deferred/);
  // New answers offer no Not now or Decline; a Change needs the owner's words.
  assert.throws(() => recordAnswer(dir, 'GB-0001', { verdict: 'defer', note: 'Later', itemRevision: 1 }), (e) => e.code === 'legacy-verdict');
  assert.throws(() => recordAnswer(dir, 'GB-0001', { verdict: 'decline', note: 'No', itemRevision: 1 }), (e) => e.code === 'legacy-verdict');
  assert.throws(() => recordAnswer(dir, 'GB-0001', { verdict: 'change', note: '', itemRevision: 1 }), (e) => e.code === 'note-required');
  // Earlier answers saved with the legacy words keep their meaning.
  const answers = readAnswers(dir);
  answers.answers['GB-0001'] = { verdict: 'defer', note: 'Later', at: '2026-10-05T00:00:00.000Z', itemRevision: 1, history: [] };
  fs.writeFileSync(boardPaths(dir).answers, JSON.stringify(answers));
  assert.deepEqual(pendingForAgents(dir), []);
  assert.throws(() => applyAnswer(dir, 'GB-0001', { by: 'tester', where: 'Spec' }), /decision|deferred/);
  answers.answers['GB-0001'] = { verdict: 'correct', note: '', at: '2026-10-05T00:00:00.000Z', itemRevision: 1, history: [] };
  fs.writeFileSync(boardPaths(dir).answers, JSON.stringify(answers));
  assert.deepEqual(pendingForAgents(dir), [], 'a legacy correction must include the owner replacement words');
  assert.throws(() => applyAnswer(dir, 'GB-0001', { by: 'tester', where: 'Spec' }), /note|decision/);
});

test('status derivation: pending, answered, applied, stale after revise, withdrawn', () => {
  const dir = room();
  addItems(dir, [sample('a')], { by: 'tester' });
  let view = mergeBoard(dir);
  assert.equal(view.items[0].derivedStatus, 'pending');
  assert.equal(view.items[0].options.length, 4, 'default options apply when options is null');
  assert.throws(() => applyAnswer(dir, 'GB-0001', { by: 'agent', where: 'nowhere' }), /nothing-to-apply|no owner answer/);

  const saved = recordAnswer(dir, 'GB-0001', { verdict: 'change', note: 'use my words', itemRevision: 1 });
  assert.equal(saved.derivedStatus, 'answered');
  assert.deepEqual(pendingForAgents(dir).map((item) => [item.id, item.verdict, item.verdictLabel, item.note]), [['GB-0001', 'change', 'Change', 'use my words']]);

  const applied = applyAnswer(dir, 'GB-0001', { by: 'agent', where: 'S-999 Decisions row' });
  assert.equal(applied.applied.verdict, 'change');
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

test('equal timestamps never mark a changed answer or revision as already applied', () => {
  const answer = { verdict: 'confirm', note: 'first answer', itemRevision: 1, at: '2026-10-04T00:00:00.000Z' };
  const item = { status: 'active', revision: 1, applied: { ...answer, answerAt: answer.at } };
  assert.equal(itemStatus(item, answer), 'applied');
  assert.equal(itemStatus(item, { ...answer, verdict: 'decline' }), 'answered');
  assert.equal(itemStatus(item, { ...answer, note: 'different answer' }), 'answered');
  assert.equal(itemStatus({ ...item, revision: 2 }, { ...answer, itemRevision: 2 }), 'answered');
});

test('recordAnswer refuses an unknown item or a verdict that is not one of its options', () => {
  const dir = room();
  addItems(dir, [sample('a', { options: [{ value: 'x', label: 'X' }] })], { by: 'tester' });
  assert.throws(() => recordAnswer(dir, 'GB-0009', { verdict: 'x', note: '', itemRevision: 1 }), /unknown-item|not on the board/);
  assert.throws(() => recordAnswer(dir, 'GB-0001', { verdict: 'confirm', note: '', itemRevision: 1 }), /not an option/);
  assert.equal(recordAnswer(dir, 'GB-0001', { verdict: '', note: 'a note only', itemRevision: 1 }).derivedStatus, 'pending', 'a saved note still needs an owner verdict');
  assert.throws(() => recordAnswer(dir, 'GB-0001', { verdict: 'x', note: '', itemRevision: 999 }), (e) => e.code === 'stale-item', 'a future revision is refused, so a bad PUT cannot outlive later revisions');
  assert.throws(() => recordAnswer(dir, 'GB-0001', { verdict: 'x', note: '', itemRevision: 0 }), (e) => e.code === 'stale-item');
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
    const malformed = await fetch(`${base}/api/answers/GB-0001`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: '{not json' });
    assert.equal(malformed.status, 400);
    assert.equal((await malformed.json()).error.code, 'invalid-json');
    const stale = await fetch(`${base}/api/answers/GB-0001`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ verdict: 'confirm', note: '', itemRevision: 7 }) });
    assert.equal(stale.status, 409);
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

test('artifact reader follows manifest collections, preserves full records and distinguishes draft excerpts', async () => {
  const dir = room();
  const manifest = JSON.parse(fs.readFileSync(path.join(repo, 'workbench/manifest.json')));
  manifest.collections.adr = 'workbench/docs/decisions/adr';
  manifest.collections.ddr = 'workbench/docs/decisions/ddr';
  manifest.landmarkTracker.collections.landmarks = 'concepts';
  fs.writeFileSync(path.join(dir, 'workbench/manifest.json'), JSON.stringify(manifest));
  for (const folder of ['workbench/docs/decisions/adr/proposed', 'workbench/docs/decisions/adr/archive', 'workbench/docs/decisions/ddr', 'concepts']) fs.mkdirSync(path.join(dir, folder), { recursive: true });
  for (const file of ['AGENTS.md', 'RUNBOOK.md', 'BLUEPRINT.md', 'LEXICON.md']) fs.writeFileSync(path.join(dir, file), `# ${file}\n\nFull current text\n`);
  fs.writeFileSync(path.join(dir, 'workbench/docs/decisions/adr/000A-accepted.md'), '---\ndate: 2026-10-04\n---\n# Accepted decision\n\n## Decision\nFull decision.\n');
  fs.writeFileSync(path.join(dir, 'workbench/docs/decisions/adr/proposed/000B-proposal.md'), '---\ndate: 2026-10-04\n---\n# Proposed decision\nFull proposed record.\n');
  fs.writeFileSync(path.join(dir, 'workbench/docs/decisions/adr/archive/000C-old.md'), '---\ndate: 2026-10-04\nsuperseded_by: ADR-000A\n---\n# Old decision\nOld text.\n');
  const landmark = { id: 'LMK-000G', title: 'Workbench Updates', revision: 3, summary: 'Full summary', importance: 'Why it matters', origin: { title: 'Original name' }, history: [{ revision: 3, reason: 'Keep full history' }] };
  fs.writeFileSync(path.join(dir, 'concepts/LMK-000G.json'), JSON.stringify(landmark));
  // The Dashboard catalog also reads the declared Spec, Task, DQC, Wiki and
  // skill lanes and the optional root ARCHITECTURE/GLOSSARY files.
  const specDir = path.join(dir, manifest.lanes.specs, 'S-999-fixture');
  fs.mkdirSync(path.join(specDir, 'tasks', 'TK-999A'), { recursive: true });
  fs.writeFileSync(path.join(specDir, 'SPEC.md'), '# Fixture capability\n\n**Spec ID:** S-999\n**Status:** planned\n');
  fs.writeFileSync(path.join(specDir, 'tasks', 'TK-999A', 'TASK.md'), '# TK-999A - Fixture slice\n\n**Task ID:** TK-999A\n**Spec ID:** S-999\n**Status:** ready\n');
  const dqcDir = path.join(dir, manifest.landmarkTracker.collections['destination-questions']);
  fs.mkdirSync(dqcDir, { recursive: true });
  fs.writeFileSync(path.join(dqcDir, 'DQC-999A.json'), JSON.stringify({ id: 'DQC-999A', title: 'Fixture destination question', revision: 2 }));
  fs.mkdirSync(path.join(dir, manifest.lanes.wiki), { recursive: true });
  fs.writeFileSync(path.join(dir, manifest.lanes.wiki, 'MEMORY.md'), '# Wiki router\n');
  fs.mkdirSync(path.join(dir, manifest.lanes.skills, 'fixture-skill'), { recursive: true });
  fs.writeFileSync(path.join(dir, manifest.lanes.skills, 'fixture-skill', 'SKILL.md'), '# Fixture skill\n');
  fs.writeFileSync(path.join(dir, 'GLOSSARY.md'), '# Glossary\n');
  addItems(dir, [sample('full', { kind: 'confirm-text', sources: [{ label: 'Blueprint', path: 'BLUEPRINT.md', ref: 'abc1234' }], draft: '# Blueprint draft\n\nComplete reviewed page.\n' }), sample('excerpt', { sources: [{ label: 'Blueprint', path: 'BLUEPRINT.md', ref: 'abc1234' }], draft: 'Only one proposed line.' }), sample('second', { sources: [{ label: 'Blueprint', path: 'BLUEPRINT.md' }] })], { by: 'tester' });
  const before = fs.readFileSync(boardPaths(dir).items, 'utf8');
  const server = createServer(dir);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const get = async p => (await fetch(base + p)).json();
  try {
    const catalog = await get('/api/artifacts');
    assert.deepEqual(catalog.groups.map(g => g.id), ['agents', 'runbook', 'blueprint', 'lexicon', 'landmarks', 'adrs', 'ddrs', 'specs', 'tasks', 'dqcs', 'wiki', 'skills', 'architecture', 'glossary']);
    const inGroup = (group, file) => catalog.artifacts.some(a => a.group === group && a.path === file);
    assert.ok(inGroup('specs', `${manifest.lanes.specs}/S-999-fixture/SPEC.md`), 'Specs are cataloged');
    assert.ok(inGroup('tasks', `${manifest.lanes.specs}/S-999-fixture/tasks/TK-999A/TASK.md`), 'Tasks are cataloged');
    assert.ok(inGroup('dqcs', `${manifest.landmarkTracker.collections['destination-questions']}/DQC-999A.json`), 'DQCs are cataloged');
    assert.ok(inGroup('wiki', `${manifest.lanes.wiki}/MEMORY.md`), 'Wiki pages are cataloged');
    assert.ok(inGroup('skills', `${manifest.lanes.skills}/fixture-skill/SKILL.md`), 'skills are cataloged');
    assert.ok(inGroup('glossary', 'GLOSSARY.md'), 'a present glossary is cataloged');
    assert.ok(!catalog.artifacts.some(a => a.group === 'architecture'), 'an absent ARCHITECTURE.md is not invented');
    assert.equal(catalog.artifacts.filter(a => a.path === 'concepts/LMK-000G.json').length, 1, 'a landmark is cataloged once');
    assert.ok(catalog.artifacts.some(a => a.title === 'Accepted decision' && a.status === 'accepted'));
    assert.ok(catalog.artifacts.some(a => a.title === 'Proposed decision' && a.status === 'proposed'));
    assert.ok(catalog.artifacts.some(a => a.title === 'Old decision' && a.status === 'superseded'));
    const current = await get('/api/artifact?path=BLUEPRINT.md');
    assert.match(current.text, /Full current text/);
    assert.match(current.revision, /^[a-f0-9]{64}$/);
    assert.equal(current.related.length, 3, 'multiple item identities survive');
    assert.equal(current.related[0].draftKind, 'full-text');
    assert.equal(current.related[1].draftKind, 'excerpt');
    assert.equal(current.related[2].draftKind, 'none');
    fs.appendFileSync(path.join(dir, 'BLUEPRINT.md'), '\nChanged source.');
    assert.notEqual((await get('/api/artifact?path=BLUEPRINT.md')).revision, current.revision);
    assert.deepEqual(JSON.parse((await get('/api/artifact?path=concepts/LMK-000G.json')).text), landmark);
    assert.equal((await fetch(base + '/api/artifact?path=workbench/specs/S-999/SPEC.md')).status, 404);
    assert.equal((await fetch(base + '/api/artifact?path=AGENTS.md%00')).status, 400);
    fs.unlinkSync(path.join(dir, 'AGENTS.md'));
    assert.equal((await fetch(base + '/api/artifact?path=AGENTS.md')).status, 404);
    assert.equal(fs.readFileSync(boardPaths(dir).items, 'utf8'), before);
    assert.equal(fs.existsSync(boardPaths(dir).answers), false, 'reader never writes answers');
  } finally { await new Promise(resolve => server.close(resolve)); }
});

test('source safety refuses symlink escapes, private files and unlisted API files', async () => {
  const dir = room();
  fs.symlinkSync('/etc/hosts', path.join(dir, 'escape.md'));
  assert.throws(() => readSourceFile(dir, 'escape.md'), e => e.code === 'unsafe-path');
  fs.writeFileSync(path.join(dir, '.env'), 'fixture secret');
  assert.throws(() => readSourceFile(dir, '.env'), e => e.code === 'unsafe-path');
  fs.writeFileSync(path.join(dir, 'unlisted.md'), 'unlisted');
  const server = createServer(dir);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try { assert.equal((await fetch(`http://127.0.0.1:${server.address().port}/api/file?path=unlisted.md`)).status, 400); }
  finally { await new Promise(resolve => server.close(resolve)); }
});

test('reader renders headings, real tables, safe relative links and inert document content', () => {
  const html = fs.readFileSync(path.join(repo, 'workbench/grill-board/index.html'), 'utf8');
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1].replace('Promise.all([load()', 'window.readerTest = { markdown, recordFields, state }; Promise.all([load()');
  const context = vm.createContext({ document: { getElementById: () => ({}), documentElement: { dataset: {} } }, window: { addEventListener() {} }, setInterval() {}, URL, URLSearchParams, fetch: () => new Promise(() => {}) });
  vm.runInContext(script, context);
  const { markdown, recordFields, state } = context.window.readerTest;
  state.catalog = { artifacts: [{ path: 'BLUEPRINT.md' }, { path: 'decisions/000A-accepted.md' }] };
  const rendered = markdown('# Full page\n\n| Name | Value |\n|---|---|\n| Decision | [Current](../BLUEPRINT.md) |\n\n[Record](000A-accepted.md#decision)\n\n<script>attack()</script>\n\n[Bad](javascript:alert)\n\n`[code](https://example.com)`', 'decisions/REGISTER.md');
  assert.match(rendered, /<h1 data-anchor="full-page">Full page<\/h1>/);
  assert.match(rendered, /<table>.*<th>Name<\/th>.*<td>Decision<\/td>/);
  assert.match(rendered, /href="#artifact=BLUEPRINT.md"/);
  assert.match(rendered, /artifact=decisions%2F000A-accepted.md&amp;anchor=decision/);
  assert.ok(!rendered.includes('<script>') && !rendered.includes('href="javascript:'));
  assert.match(rendered, /<code>\[code\]\(https:\/\/example.com\)<\/code>/);
  const fields = recordFields({ title: 'Workbench Updates', history: [{ reason: 'Original full history' }], revision: 3 }, 'concepts/LMK-000G.json');
  assert.match(fields, /Workbench Updates/);
  assert.match(fields, /Original full history/);
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
  for (const command of ['grade --file', 'reassess --file', 'handoffs', 'disposition --file']) assert.ok(unknown.json.error.message.includes(command), `usage names ${command}`);
  const status = cli(dir, ['status', '--json']);
  assert.equal(status.json.counts.pending, 1);
  const validate = cli(dir, ['validate']);
  assert.equal(validate.status, 0);
  const pending = cli(dir, ['pending', '--json']);
  assert.deepEqual(pending.json, []);
});

function sliceModel() {
  const html = fs.readFileSync(path.join(repo, 'workbench/grill-board/index.html'), 'utf8');
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1].replace('Promise.all([load()', 'window.sliceTest = { topicFor, intentFor, laneFor, sliceCounts, batchProgress, matchesSlice, state, TOPICS, latestAssessment, gradeDetail }; Promise.all([load()');
  const context = vm.createContext({ document: { getElementById: () => ({}), documentElement: { dataset: {} } }, window: { addEventListener() {} }, setInterval() {}, URL, URLSearchParams, fetch: () => new Promise(() => {}) });
  vm.runInContext(script, context);
  return context.window.sliceTest;
}

test('board slices separate owner work, review, and exploration without losing any items', () => {
  const model = sliceModel();
  const items = readItems(repo).items;
  assert.ok(items.every(item => model.TOPICS.some(topic => topic.id === model.topicFor(item))));
  assert.equal(model.topicFor({ id: 'GB-0018' }), 'context');
  assert.equal(model.topicFor({ id: 'GB-9999', title: 'An unseen question' }), 'other');
  assert.equal(model.intentFor({ id: 'GB-0018', kind: 'owner-decision' }), 'unblock');
  assert.equal(model.intentFor({ id: 'GB-0180', kind: 'owner-decision' }), 'review');
  assert.equal(model.intentFor({ kind: 'approve-spec' }), 'review');
  assert.equal(model.intentFor({ kind: 'choice' }), 'explore');
  assert.equal(model.matchesSlice({ id: 'GB-0018', kind: 'owner-decision', derivedStatus: 'pending', title: 'Maintainer procedures' }, { topic: 'context', intent: 'unblock', lane: 'pending', query: 'maintainer' }), true);
  assert.equal(model.matchesSlice({ id: 'GB-0018', kind: 'owner-decision', derivedStatus: 'pending' }, { topic: 'workflow' }), false);
});

test('workflow counts partition items and a parked or unsaved answer never finishes a batch', () => {
  const model = sliceModel();
  const items = ['pending', 'stale', 'answered', 'applied', 'withdrawn'].map((derivedStatus, n) => ({ id: `x${n}`, revision: 2, derivedStatus }));
  items.push({ id: 'parked', revision: 2, derivedStatus: 'pending', answer: { itemRevision: 2, verdict: 'defer' } });
  assert.equal(model.laneFor(items.at(-1)), 'parked');
  assert.equal(model.laneFor({ ...items.at(-1), derivedStatus: 'stale' }), 'stale');
  const counts = model.sliceCounts(items);
  assert.equal(Object.values(counts).reduce((sum, n) => sum + n, 0), items.length);
  assert.equal(counts.parked, 1);
  model.state.board = { items };
  model.state.batch = { ids: ['x2', 'x3', 'parked'], revisions: { x2: 2, x3: 2, parked: 2 } };
  assert.equal(model.batchProgress().done, 2);
  assert.equal(model.batchProgress().complete, false);
  items.at(-1).derivedStatus = 'answered';
  assert.equal(model.batchProgress().complete, true);
  model.state.edits.set('parked', { note: 'unsaved edit' });
  assert.equal(model.batchProgress().complete, false);
  model.state.edits.clear();
  items.at(-1).derivedStatus = 'stale';
  assert.equal(model.batchProgress().complete, false);
  assert.equal(model.state.batch.ids.length, 3, 'saving never refills the fixed batch');
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

// TK-007O: after an owner answer is applied, or a card revised from it, the
// agent reassesses that card's P and V. A retained grade is recorded as
// assessed, a revised one with its justification, and nothing touches the
// item's revision or the owner's answers.
test('answer-to-card-update cycle: P/V reassessment retains or revises with its basis', async () => {
  const dir = room();
  addItems(dir, [sample('a'), sample('b'), sample('ungraded')], { by: 'tester' });
  gradeItems(dir, ['GB-0001', 'GB-0002'].map(id => ({ id, expectedGradeRevision: 0, priority: { grade: 'P2', reason: 'Source: README.md; blocks one Spec' }, value: { grade: 'V3', reason: 'Source: README.md; modest return' } })), { by: 'grader', reason: 'initial' });
  const server = createServer(dir);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const put = (id, body) => fetch(`http://127.0.0.1:${server.address().port}/api/answers/${id}`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  try {
    assert.equal((await put('GB-0001', { verdict: 'confirm', note: '', itemRevision: 1 })).status, 200);
    assert.equal((await put('GB-0002', { verdict: 'change', note: 'Narrow it to the Taskboard', itemRevision: 1 })).status, 200);
  } finally { await new Promise(resolve => server.close(resolve)); }
  const answersBefore = fs.readFileSync(boardPaths(dir).answers, 'utf8');
  const answerA = readAnswers(dir).answers['GB-0001'], answerB = readAnswers(dir).answers['GB-0002'];
  applyAnswer(dir, 'GB-0001', { by: 'agent', where: 'S-999 Decisions row' });
  reviseItem(dir, 'GB-0002', { proposal: 'Agent proposal: only the Taskboard.' }, { by: 'agent', reason: 'Owner Change GB-0002' });
  const unassessed = readItems(dir).items[0];
  assert.equal(unassessed.history.some(entry => entry.assessment), false, 'before reassessment nothing records an assessment');

  const before = fs.readFileSync(boardPaths(dir).items, 'utf8');
  const refuse = (rows, pattern) => { assert.throws(() => reassessItems(dir, rows, { by: 'agent', reason: 'cycle' }), pattern); assert.equal(fs.readFileSync(boardPaths(dir).items, 'utf8'), before, 'a refused reassessment leaves items.json unchanged'); };
  const retain = basis => ({ retain: true, basis });
  const followA = { id: 'GB-0001', answerAt: answerA.at, itemRevision: 1 };
  refuse([{ id: 'GB-0003', expectedGradeRevision: 0, followed: { id: 'GB-0003', answerAt: answerA.at, itemRevision: 1 }, priority: retain('x'), value: retain('x') }], /ungraded|no grade|answer/);
  refuse([{ id: 'GB-0001', expectedGradeRevision: 0, followed: followA, priority: retain('x'), value: retain('x') }], /stale/);
  refuse([{ id: 'GB-0001', expectedGradeRevision: 1, followed: followA, priority: retain(''), value: retain('x') }], /basis/);
  refuse([{ id: 'GB-0001', expectedGradeRevision: 1, followed: { ...followA, answerAt: '2020-01-01T00:00:00.000Z' }, priority: retain('x'), value: retain('x') }], /answer/);
  refuse([{ id: 'GB-0001', expectedGradeRevision: 1, followed: followA, priority: retain('x'), value: { grade: 'V9', reason: 'r', basis: 'b' } }], /grade/);
  refuse([{ id: 'GB-0001', expectedGradeRevision: 1, followed: followA, priority: retain('x') }], /value/);

  const [a, b] = reassessItems(dir, [
    { id: 'GB-0001', expectedGradeRevision: 1, followed: followA, priority: retain('The confirmed answer leaves the blocked Spec as it was.'), value: { grade: 'V2', reason: 'Source: S-999 Decisions row; the confirmed choice removes repeated work', basis: 'The answer settled the choice, raising its return.' } },
    { id: 'GB-0002', expectedGradeRevision: 1, followed: { id: 'GB-0002', answerAt: answerB.at, itemRevision: 1 }, priority: retain('Narrowing keeps the same urgency.'), value: retain('Narrowing keeps the same return.') }
  ], { by: 'agent', reason: 'Answer-to-card update' });
  assert.deepEqual([a.id, a.key, a.revision, a.gradeRevision, a.priority.grade, a.value.grade], ['GB-0001', 'a', 1, 2, 'P2', 'V2']);
  assert.equal(a.priority.reason, 'Source: README.md; blocks one Spec', 'a retained grade keeps its reason');
  assert.deepEqual([b.revision, b.gradeRevision, b.priority.grade, b.value.grade], [2, 2, 'P2', 'V3'], 'reassessment never bumps the item revision');
  const assessment = a.history.at(-1).assessment;
  assert.deepEqual(JSON.parse(JSON.stringify(assessment)), { followed: followA, priority: { outcome: 'retained', grade: 'P2', basis: 'The confirmed answer leaves the blocked Spec as it was.' }, value: { outcome: 'revised', from: 'V3', grade: 'V2', basis: 'The answer settled the choice, raising its return.' } });
  assert.match(a.history.at(-1).reason, /reassessed/);
  assert.ok(a.history.some(entry => /^applied/.test(entry.reason)), 'earlier history is preserved');
  assert.equal(b.history.at(-1).assessment.priority.outcome, 'retained');
  assert.equal(fs.readFileSync(boardPaths(dir).answers, 'utf8'), answersBefore, 'agent operations never touch owner answers');
  const view = mergeBoard(dir).items;
  assert.equal(view[0].derivedStatus, 'applied', 'the applied owner answer stays applied');
  assert.equal(view[0].answer.verdict, 'confirm');
  assert.equal(view[1].derivedStatus, 'stale', 'the revised card awaits a fresh answer; its earlier answer is kept');
  assert.throws(() => reassessItems(dir, [{ id: 'GB-0001', expectedGradeRevision: 1, followed: followA, priority: retain('x'), value: retain('x') }], { by: 'agent', reason: 'stale' }), /stale/);
});

test('the central question view shows the latest P/V assessment, retained or revised', () => {
  const model = sliceModel();
  const graded = { priority: { grade: 'P2', reason: 'r' }, value: { grade: 'V2', reason: 'r' } };
  const history = [{ revision: 1, at: '2026-10-08T00:00:00.000Z', by: 'grader', reason: 'graded: initial', gradeRevision: 1 }];
  assert.equal(model.latestAssessment({ ...graded, history }), null, 'a graded but unassessed card has no assessment');
  const assessed = { ...graded, history: [...history, { revision: 1, gradeRevision: 2, at: '2026-10-09T00:00:00.000Z', by: 'agent', reason: 'reassessed: Answer-to-card update', assessment: { followed: { id: 'GB-0001', answerAt: '2026-10-08T12:00:00.000Z', itemRevision: 1 }, priority: { outcome: 'retained', grade: 'P2', basis: 'Same urgency.' }, value: { outcome: 'revised', from: 'V3', grade: 'V2', basis: 'Higher return.' } } }] };
  const html = model.gradeDetail(assessed);
  assert.match(html, /Priority P2 retained[\s\S]*Same urgency\./);
  assert.match(html, /Value revised V3 → V2[\s\S]*Higher return\./);
  assert.match(html, /GB-0001[\s\S]*2026-10-08T12:00:00.000Z/);
  assert.match(model.gradeDetail({ ...graded, history }), /Not reassessed since grading/);
});

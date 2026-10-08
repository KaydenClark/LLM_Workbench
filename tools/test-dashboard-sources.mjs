#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createHash } from 'node:crypto';
import { captureQuestion } from '../workbench/tools/landmark-tracker.mjs';
import { readSourceFile } from './grill-board.mjs';
import { dashboardRoute, dashboardSources, decisionIds, questionLinkTargets } from './dashboard-sources.mjs';
import { readItems } from './grill-board.mjs';

function put(root, file, text) {
  fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
  fs.writeFileSync(path.join(root, file), text);
}
function room() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'dashboard-sources-'));
  const manifest = JSON.parse(fs.readFileSync(new URL('../workbench/manifest.json', import.meta.url), 'utf8'));
  for (const folder of [...Object.values(manifest.lanes), ...Object.values(manifest.collections), manifest.landmarkTracker.root, ...Object.values(manifest.landmarkTracker.collections)]) fs.mkdirSync(path.join(root, folder), { recursive: true });
  put(root, 'workbench/manifest.json', JSON.stringify(manifest));
  put(root, 'workbench/sessions/.gitignore', fs.readFileSync(new URL('../workbench/sessions/.gitignore', import.meta.url), 'utf8'));
  put(root, 'ARCHITECTURE.md', '# Architecture\n\nSource ownership.\n');
  put(root, 'GLOSSARY.md', '# Glossary\n\n## Confirmation\nAn exact proposal.\n');
  put(root, 'workbench/wiki/design-concepts/context.md', '# Connected context\n\nRead [the source](../../../specs/S-000A-fixture/SPEC.md).\n');
  put(root, 'workbench/wiki/model.schema.json', '{"title":"Readable model schema","type":"object"}');
  put(root, 'workbench/skills/example/SKILL.md', '# Example procedure\n\nPreserve approval evidence.\n');
  spec(root, 'S-000A');
  captureQuestion(root, { id: 'DQC-000A', title: 'Fixture concept', question: 'Which evidence should stay visible?', reason: 'Disposable owner-shaped example', source: ['fixture@1'] });
  return root;
}
function spec(root, id, task = 'TK-000A') {
  const dir = `workbench/specs/${id}-fixture`;
  put(root, `${dir}/SPEC.md`, `# ${id} - Readable capability\n\n**Spec ID:** ${id}\n**Status:** active\n**Priority:** 2\n**Owner:** fixture\n**Updated:** 2026-10-08\n**Catalog description:** Fixture objective\n**Blockers:** none\n**Latest event:** Fixture source\n**Next gate:** Review capability\n\n## Vertical Implementation Slices\n\n## Acceptance Criteria\n\n- [ ] Visible source evidence\n`);
  put(root, `${dir}/tasks/${task}/TASK.md`, `# ${task} - Retain the evidence\n\n**Task ID:** ${task}\n**Spec ID:** ${id}\n**Slice:** Retain the evidence\n**Status:** done\n**Blockers:** none\n**Destination:** spec-acceptance: ${id} Acceptance Criteria\n`);
}
function snapshot(root) {
  const files = {};
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (entry.isFile()) files[path.relative(root, file)] = createHash('sha256').update(fs.readFileSync(file)).digest('hex');
    }
  }
  walk(root);
  return files;
}
const read = root => dashboardSources(root, { readSource: readSourceFile });

test('native execution and understanding projections stay distinct, readable and read-only', t => {
  const root = room(); t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const before = snapshot(root), view = read(root);
  assert.equal(view.schema, 'workbench-dashboard/sources@1');
  assert.equal(view.taskboard.status, 'available', JSON.stringify(view.taskboard.error));
  assert.equal(view.taskboard.board.lanes.complete['S-000A/TK-000A'].title, 'Retain the evidence');
  assert.equal(view.tracker.status, 'available');
  assert.equal(view.tracker.tracker.questions[0].distribution.status, 'incomplete');
  assert.ok(view.tracker.tracker.questions[0].distribution.unassessed.length > 0, 'a done Task does not assess this concept');
  const task = view.artifacts.find(a => a.id === 'TK-000A');
  assert.match(task.identity, /S-000A/);
  assert.equal(task.kind, 'task');
  assert.ok(task.relationships.some(link => link.id === 'S-000A'));
  const dqc = view.artifacts.find(a => a.id === 'DQC-000A');
  assert.equal(dqc.revision, 1);
  assert.equal(dqc.history[0].reason, 'Disposable owner-shaped example');
  assert.equal(dqc.sources[0].id, 'fixture');
  assert.ok(view.artifacts.some(a => a.path === 'workbench/wiki/design-concepts/context.md'));
  assert.ok(view.artifacts.some(a => a.path === 'workbench/wiki/model.schema.json'));
  assert.ok(view.artifacts.some(a => a.path === 'workbench/skills/example/SKILL.md'));
  assert.ok(view.artifacts.some(a => a.path === 'GLOSSARY.md'));
  assert.deepEqual(snapshot(root), before, 'reading must not rebuild projections or rewrite any owner');
});

test('legacy Task labels remain source-qualified across native lanes and catalog owners', t => {
  const root = room(); t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  // Numeric historical Task labels remain local to their Spec.
  const original = path.join(root, 'workbench/specs/S-000A-fixture/tasks/TK-000A');
  fs.rmSync(original, { recursive: true });
  spec(root, 'S-000A', 'TK-001');
  spec(root, 'S-000B', 'TK-001');
  const view = read(root);
  assert.equal(view.taskboard.status, 'available', JSON.stringify(view.taskboard.error));
  assert.ok(view.taskboard.board.lanes.complete['S-000A/TK-001']);
  assert.ok(view.taskboard.board.lanes.complete['S-000B/TK-001']);
  assert.equal(view.tracker.status, 'available');
  const tasks = view.artifacts.filter(a => a.id === 'TK-001');
  assert.equal(tasks.length, 2);
  assert.equal(new Set(tasks.map(a => a.identity)).size, 2);
});

test('invalid Tracker records and unsafe Wiki entries fail visibly without serving private files', t => {
  const root = room(); t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  put(root, 'workbench/landmark-tracker/destination-questions/DQC-000A.json', '{"schema":"bad"}');
  put(root, 'workbench/wiki/.private.md', '# Private');
  put(root, 'workbench/sessions/notepads/private.md', '# Private');
  fs.symlinkSync(path.join(root, 'workbench/sessions/notepads/private.md'), path.join(root, 'workbench/wiki/linked.md'));
  fs.symlinkSync(path.join(root, 'workbench/sessions/notepads'), path.join(root, 'workbench/wiki/linked-directory'));
  const view = read(root);
  assert.equal(view.tracker.status, 'error');
  assert.ok(view.errors.some(error => error.source === 'tracker'));
  assert.ok(view.errors.some(error => error.code === 'unsafe-path' && error.path === 'workbench/wiki/linked.md'));
  assert.ok(view.errors.some(error => error.code === 'unsafe-path' && error.path === 'workbench/wiki/linked-directory'));
  assert.ok(!view.artifacts.some(a => /private|linked/.test(a.path)));
  assert.equal(view.taskboard.status, 'available', JSON.stringify(view.taskboard.error));
});

test('a malformed manifest returns an explicit source failure, not an empty success', t => {
  const root = room(); t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  put(root, 'workbench/manifest.json', '{');
  const view = read(root);
  assert.ok(view.errors.some(error => error.source === 'manifest'));
  assert.equal(view.taskboard.status, 'error');
  assert.equal(view.tracker.status, 'error');
});

test('invalid declared paths cannot hide a source failure or expose another room', t => {
  const root = room(); t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const file = path.join(root, 'workbench/manifest.json');
  const manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
  manifest.lanes.wiki = 42;
  put(root, 'workbench/manifest.json', JSON.stringify(manifest));
  const view = read(root);
  assert.ok(view.errors.some(error => error.source === 'wiki' && error.code === 'invalid-manifest'));
  assert.equal(view.taskboard.status, 'error');
  assert.ok(!view.artifacts.some(a => a.group === 'wiki'));
});

test('catalog-only reading does not build either native projection', t => {
  const root = room(); t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  // A structurally invalid but readable record would make the Tracker fail.
  put(root, 'workbench/landmark-tracker/destination-questions/DQC-000A.json', '{"schema":"bad","id":"DQC-000A","title":"Invalid source"}');
  const before = snapshot(root);
  const view = dashboardSources(root, { readSource: readSourceFile, catalogOnly: true });
  assert.equal(view.taskboard.status, 'not-requested');
  assert.equal(view.tracker.status, 'not-requested');
  assert.ok(view.artifacts.some(a => a.id === 'DQC-000A'));
  assert.ok(!view.errors.some(error => error.source === 'tracker'));
  assert.deepEqual(snapshot(root), before);
});

test('a Taskboard source refusal is returned as the reader error, never a substitute board', t => {
  const root = room(); t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const file = path.join(root, 'workbench/specs/S-000A-fixture/SPEC.md');
  const source = fs.readFileSync(file, 'utf8');
  // S-003W's shape: a header Stance repeated in a slice description is read
  // by no parser and stays available.
  fs.writeFileSync(file, source.replace('**Owner:** fixture', '**Owner:** fixture\n**Stance:** Builder').replace('\n## Acceptance Criteria', '\n### TK-000A - Retain the evidence\n\n**Stance:** Builder\n\n## Acceptance Criteria'));
  assert.equal(read(root).taskboard.status, 'available', JSON.stringify(read(root).taskboard.error));
  // A repeated parsed field could change the card: the reader refuses and
  // the adapter returns that refusal with no board.
  fs.writeFileSync(file, source.replace('\n## Acceptance Criteria', '\n### TK-000A - Retain the evidence\n\n**Status:** complete\n\n## Acceptance Criteria'));
  const view = read(root);
  assert.equal(view.taskboard.status, 'error');
  assert.equal(view.taskboard.board, undefined);
  assert.match(view.taskboard.error.message, /duplicated source field Status/);
  assert.ok(view.errors.some(error => error.source === 'taskboard'));
  assert.equal(view.tracker.status, 'available', 'the Tracker keeps its own semantics and availability');
  assert.match(view.tracker.semantics, /does not establish delivery completion/);
});

// --- dashboardRoute: glossary, backlinks and search -------------------------

const route = (root, href, items = []) => dashboardRoute(root, new URL(href, 'http://127.0.0.1'), { readSource: readSourceFile, items });
const GLOSSARY = '# Fixture Room\n\nThis glossary is the canonical vocabulary.\n\n## Language\n\n### Workflow verbs\n\n**Confirm**:\nThe owner\'s agreement to a readback that names the concept.\n\n**Map**:\nThe direction to a destination,\nat two scales: see [Landmarks](workbench/landmarks/README.md) and `Spec`.\n_Avoid_: route\n\n**Long term**:\n' + 'word '.repeat(400) + '\n';
const LEXICON = '# Fixture - Lexicon\n\n## Task Routing\n\n| Need | Route to the owner |\n|---|---|\n| Accepted terminology | This Lexicon |\n\n## Core Terms\n\n| Term | Definition | Notes |\n|---|---|---|\n| **Spec** | A PRD-shaped scoped objective owned by [its record](workbench/specs/CATALOG.md) with `SPEC.md`. | Notes. |\n| **Task** | One bounded executable slice \\| with an escaped pipe. | Notes. |\n| **Spec** | A later duplicate row. | Notes. |\n| **Model** ([dictionary](https://example.com/model)) | The trained parameters on their own. | Notes. |\n\n### Priority And Value\n\n| Return / investment | Low | High |\n|---|---|---|\n| **P1 — Interrupt:** stop normal work | **V1 — Quick Win:** high return | x |\n';

test('glossary reads GLOSSARY.md when present, else the Lexicon term tables, else reports no source', t => {
  const root = room(); t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  put(root, 'GLOSSARY.md', GLOSSARY);
  put(root, 'LEXICON.md', LEXICON);
  const before = snapshot(root);
  const glossary = route(root, '/api/glossary');
  assert.equal(glossary.source, 'GLOSSARY.md');
  assert.deepEqual(glossary.terms.map(term => term.term), ['Confirm', 'Map', 'Long term']);
  const map = glossary.terms[1];
  assert.deepEqual(map, { term: 'Map', anchor: 'map', definition: 'The direction to a destination, at two scales: see Landmarks and Spec.', path: 'GLOSSARY.md' });
  assert.ok(glossary.terms[2].definition.length <= 600, 'definitions are bounded');
  assert.match(glossary.terms[2].definition, /…$/);

  fs.rmSync(path.join(root, 'GLOSSARY.md'));
  const lexicon = route(root, '/api/glossary');
  assert.equal(lexicon.source, 'LEXICON.md');
  assert.deepEqual(lexicon.terms, [
    { term: 'Spec', anchor: 'spec', definition: 'A PRD-shaped scoped objective owned by its record with SPEC.md.', path: 'LEXICON.md' },
    { term: 'Task', anchor: 'task', definition: 'One bounded executable slice | with an escaped pipe.', path: 'LEXICON.md' },
    { term: 'Model', anchor: 'model', definition: 'The trained parameters on their own.', path: 'LEXICON.md' }
  ]);

  fs.rmSync(path.join(root, 'LEXICON.md'));
  assert.deepEqual(route(root, '/api/glossary'), { source: null, terms: [] });
  const after = snapshot(root); delete before['GLOSSARY.md']; delete before['LEXICON.md'];
  assert.deepEqual(after, before, 'the glossary route writes nothing');
});

test('backlinks name the questions and cataloged Markdown artifacts that link to a path', t => {
  const root = room(); t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const target = 'workbench/specs/S-000A-fixture/SPEC.md';
  put(root, 'workbench/wiki/design-concepts/linker.md', '# Linking page\n\nSee [the Spec](../../specs/S-000A-fixture/SPEC.md#acceptance-criteria) and [elsewhere](https://example.com/workbench/specs/S-000A-fixture/SPEC.md).\n');
  put(root, 'workbench/skills/example/REFERENCE.md', '# Reference page\n\n[spec]: ./../../specs/S-000A-fixture/SPEC.md\n');
  put(root, 'workbench/wiki/design-concepts/unrelated.md', '# Unrelated\n\n[Another](../../specs/S-000B-fixture/SPEC.md)\n');
  put(root, 'workbench/sessions/notepads/private.md', '# Private\n\n[the Spec](../../specs/S-000A-fixture/SPEC.md)\n');
  const items = [
    { id: 'GB-0001', title: 'Source-linked question', sources: [{ path: target }], brief: {}, status: 'open' },
    { id: 'GB-0002', title: 'Brief-linked question', sources: [{ path: '/Users/someone/private.json' }], brief: { artifacts: 'Read [the Spec](./workbench/specs/S-000A-fixture/SPEC.md#outcome).' }, status: 'open' },
    { id: 'GB-0003', title: 'Unrelated question', sources: [{ path: 'AGENTS.md' }], brief: { why: 'No link here.' }, status: 'open' }
  ];
  const result = route(root, `/api/backlinks?path=${encodeURIComponent('./' + target + '#outcome')}`, items);
  assert.equal(result.path, target);
  assert.deepEqual(result.links.filter(link => link.kind === 'question'), [
    { kind: 'question', id: 'GB-0001', title: 'Source-linked question' },
    { kind: 'question', id: 'GB-0002', title: 'Brief-linked question' }
  ]);
  assert.deepEqual(result.links.filter(link => link.kind === 'artifact').map(link => [link.path, link.title]), [
    ['workbench/skills/example/REFERENCE.md', 'Reference page'],
    ['workbench/wiki/design-concepts/linker.md', 'Linking page']
  ]);
  assert.ok(!JSON.stringify(result).includes('/Users/'), 'private absolute source paths never leave the board');
  assert.ok(!JSON.stringify(result).includes('notepads'), 'private collections are not backlink sources');
  assert.throws(() => route(root, '/api/backlinks?path=../outside.md'), error => error.code === 'unsafe-path');
  assert.throws(() => route(root, '/api/backlinks'), error => error.code === 'unsafe-path');
});

test('search is case-insensitive, bounded and never reads private collections', t => {
  const root = room(); t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (let index = 0; index < 210; index += 1) put(root, `workbench/wiki/bulk/page-${String(index).padStart(3, '0')}.md`, `# Bulk page ${index}\n\nThe Zebra marker appears here. ${'filler '.repeat(80)}\n`);
  put(root, 'workbench/sessions/notepads/secret.md', '# Secret\n\nzebra private words\n');
  put(root, 'workbench/wiki/.hidden.md', '# Hidden\n\nzebra hidden words\n');
  const items = [{ id: 'GB-0009', title: 'Choose the ZEBRA crossing', question: 'Which way?', proposal: 'Agent proposal: stripes.', brief: { recommendation: 'Paint stripes.' }, sources: [], status: 'open' }];
  const defaults = route(root, '/api/search?q=zebra', items);
  assert.equal(defaults.query, 'zebra');
  assert.equal(defaults.results.length, 50, 'default limit');
  assert.deepEqual(defaults.results[0], { kind: 'question', id: 'GB-0009', title: 'Choose the ZEBRA crossing', snippet: 'Choose the ZEBRA crossing', status: 'open' });
  assert.equal(route(root, '/api/search?q=ZEBRA&limit=1000', items).results.length, 200, 'limit is capped');
  assert.equal(route(root, '/api/search?q=zebra&limit=3', items).results.length, 3);
  assert.equal(route(root, '/api/search?q=zebra&limit=nonsense', items).results.length, 50);
  const all = route(root, '/api/search?q=zebra&limit=200', items).results;
  for (const result of all) {
    assert.ok(result.snippet.length <= 240, 'snippet is bounded');
    assert.ok(!/notepads|hidden|secret/i.test(JSON.stringify(result)), 'private and hidden files are never searched');
  }
  const page = all.find(result => result.path === 'workbench/wiki/bulk/page-000.md');
  assert.equal(page.kind, 'wiki'); assert.equal(page.title, 'Bulk page 0'); assert.match(page.snippet, /Zebra marker/);
  assert.ok(route(root, '/api/search?q=agent%20proposal%20STRIPES', items).results.some(result => result.id === 'GB-0009'), 'every term must match, in any field');
  assert.deepEqual(route(root, '/api/search?q=%20%20', items), { query: '', results: [] });
  // Root controls and decision records are searchable beside the catalog.
  put(root, 'AGENTS.md', '# AGENTS\n\nThe quokka rule.\n');
  assert.ok(route(root, '/api/search?q=quokka').results.some(result => result.path === 'AGENTS.md'), 'a change invalidates the cached index');
  assert.equal(route(root, '/api/search?q=quokka').errors, undefined);
  // A partial catalog says so rather than presenting a silently smaller index.
  fs.symlinkSync(path.join(root, 'workbench/sessions/notepads/secret.md'), path.join(root, 'workbench/wiki/linked.md'));
  for (const href of ['/api/search?q=zebra', '/api/backlinks?path=AGENTS.md']) {
    const partial = route(root, href);
    assert.ok(partial.errors.some(error => error.code === 'unsafe-path' && error.path === 'workbench/wiki/linked.md'), href);
    assert.ok(!JSON.stringify(partial).includes('private words'));
  }
});

test('dashboardRoute answers only its own paths and requires the board reader', t => {
  const root = room(); t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  assert.equal(route(root, '/api/board'), null);
  assert.equal(route(root, '/api/glossaryx'), null);
  assert.throws(() => dashboardRoute(root, new URL('http://127.0.0.1/api/search?q=x'), { items: [] }), TypeError);
});

// --- Question links: what a question card renders as links, counted the same way.

test('decision-record shorthand expands after a full ID and never over an ordinary slash', () => {
  assert.deepEqual(decisionIds('Board first before ADR-000B/C/D (TRACK).'), ['ADR-000B', 'ADR-000C', 'ADR-000D']);
  assert.deepEqual(decisionIds('DDR-000P/000Q/000S and ADR-0013/0033'), ['DDR-000P', 'DDR-000Q', 'DDR-000S', 'ADR-0013', 'ADR-0033']);
  assert.deepEqual(decisionIds('ADR-000B/its successor, ADR-000H/AGENTS.md, ADR-0017/ADR-0054, ADR-0054/S-00O'), ['ADR-000B', 'ADR-000H', 'ADR-0017', 'ADR-0054', 'ADR-0054']);
  assert.deepEqual(decisionIds('ADR-000F/G/I and CDR-0001'), ['ADR-000F', 'ADR-000G', 'ADR-000I', 'CDR-0001']);
  assert.deepEqual(decisionIds('XADR-000B, ADR-000BX, `code`'), []);
});

test('backlinks count decision-record mentions, shorthand and source-relative links as the page renders them', t => {
  const root = room(); t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const record = id => `---\ndate: 2026-10-04\n---\n# Record ${id}\n\nText.\n`;
  put(root, 'workbench/docs/adr/000B-first.md', record('B'));
  put(root, 'workbench/docs/adr/000C-second.md', record('C'));
  put(root, 'workbench/docs/adr/000F-third.md', record('F'));
  put(root, 'workbench/docs/ddr/000A-aligns.md', record('DDR A'));
  const items = [
    { id: 'GB-0001', title: 'Mentions by ID', question: 'Does ADR-000F still hold?', current: '', proposal: '', sources: [{ path: 'AGENTS.md' }], status: 'open' },
    { id: 'GB-0002', title: 'Shorthand', question: '', current: '', proposal: '', brief: { history: 'Board first before ADR-000B/C/D (TRACK)' }, sources: [], status: 'open' },
    { id: 'GB-0003', title: 'Source-relative draft link', question: '', current: '', proposal: '', draft: 'See [the decision](../adr/000F-third.md).', sources: [{ path: 'workbench/docs/ddr/000A-aligns.md' }], status: 'open' },
    { id: 'GB-0004', title: 'Option mention', question: '', current: '', proposal: '', options: [{ value: 'a', label: 'Supersede ADR-000F' }], sources: [], status: 'open' },
    { id: 'GB-0005', title: 'Unrelated', question: 'ADR-000B/its successor', current: '', proposal: '', sources: [], status: 'open' }
  ];
  const ids = target => route(root, `/api/backlinks?path=${encodeURIComponent(target)}`, items).links.filter(link => link.kind === 'question').map(link => link.id);
  assert.deepEqual(ids('workbench/docs/adr/000F-third.md'), ['GB-0001', 'GB-0003', 'GB-0004']);
  assert.deepEqual(ids('workbench/docs/adr/000C-second.md'), ['GB-0002'], 'shorthand counts the expanded record');
  assert.deepEqual(ids('workbench/docs/adr/000B-first.md'), ['GB-0002', 'GB-0005']);
  const paths = new Map([['ADR-000F', 'workbench/docs/adr/000F-third.md']]);
  assert.deepEqual([...questionLinkTargets(items[2], paths)].sort(), ['workbench/docs/adr/000F-third.md', 'workbench/docs/ddr/000A-aligns.md']);
});

test('on the real board ADR-000F lists every question that links to it', () => {
  const root = new URL('..', import.meta.url).pathname;
  const items = readItems(root).items;
  const result = route(root, `/api/backlinks?path=${encodeURIComponent('workbench/docs/adr/000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md')}`, items);
  const questions = result.links.filter(link => link.kind === 'question').map(link => link.id);
  for (const id of ['GB-0023', 'GB-0025', 'GB-0063', 'GB-0105', 'GB-0146', 'GB-0173', 'GB-0180']) assert.ok(questions.includes(id), `${id} links ADR-000F`);
});

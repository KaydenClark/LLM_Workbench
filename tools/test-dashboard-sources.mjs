#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createHash } from 'node:crypto';
import { captureQuestion } from '../workbench/tools/landmark-tracker.mjs';
import { readSourceFile } from './grill-board.mjs';
import { dashboardSources } from './dashboard-sources.mjs';

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

#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const tool = fileURLToPath(new URL('../workbench/tools/spec-workbench.mjs', import.meta.url));
const lanes = ['backlog', 'toDo', 'inProgress', 'blocked', 'needsReview', 'complete'];
function put(root, file, text) {
  fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
  fs.writeFileSync(path.join(root, file), text);
}
function room() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'taskboard-json-'));
  const manifest = JSON.parse(fs.readFileSync(new URL('../workbench/manifest.json', import.meta.url), 'utf8'));
  for (const folder of [...Object.values(manifest.lanes), ...Object.values(manifest.collections), manifest.landmarkTracker.root, ...Object.values(manifest.landmarkTracker.collections)]) {
    fs.mkdirSync(path.join(root, folder), { recursive: true });
  }
  put(root, 'workbench/manifest.json', JSON.stringify(manifest, null, 2)+'\n');
  put(root, 'workbench/sessions/.gitignore', fs.readFileSync(new URL('../workbench/sessions/.gitignore', import.meta.url), 'utf8'));
  put(root, 'BLUEPRINT.md', '# Fixture Blueprint\n');
  put(root, 'TASKBOARD.md', '# Fixture Board\n<!-- hot-specs:start -->\nold\n<!-- hot-specs:end -->\n');
  return root;
}
function spec(root, { id, title = 'A readable objective', status = 'active', priority = 2, retired = false, extra = '', table = '' }) {
  const dir = `workbench/specs/${retired ? 'retired/' : ''}${id}-fixture`;
  const file = `${dir}/SPEC.md`;
  put(root, file, `# ${id} - ${title}\n\n**Spec ID:** ${id}\n**Status:** ${status}\n**Priority:** ${priority}\n**Owner:** fixture-dispatcher\n**Updated:** 2026-09-30\n**Catalog description:** Fixture objective\n**Blockers:** none\n**Latest event:** Fixture source\n**Next gate:** Verify the objective\n${extra}\n## Vertical Implementation Slices\n${table}\n## Acceptance Criteria\n\n- [ ] Actual capability acceptance\n`);
  if (!table) fs.mkdirSync(path.join(root, dir, 'tasks'), { recursive: true });
  return { id, dir, file };
}
function task(root, parent, { id, title = 'A readable slice', status = 'ready', blockers = 'none', retired = false, extra = '', specId = parent.id }) {
  const file = `${parent.dir}/tasks/${retired ? 'retired/' : ''}${id}/TASK.md`;
  put(root, file, `# ${id} - ${title}\n\n**Task ID:** ${id}\n**Spec ID:** ${specId}\n**Slice:** ${title}\n**Status:** ${status}\n**Blockers:** ${blockers}\n**Destination:** spec-acceptance: ${parent.id} Acceptance Criteria\n${extra}\n`);
  return file;
}
function command(root, ...args) {
  return spawnSync(process.execPath, [tool, ...args, '--path', root, '--json'], { encoding: 'utf8' });
}
function preview(root) {
  const result = command(root, 'render', '--format', 'json');
  assert.equal(result.status, 0, result.stdout + result.stderr);
  const file = path.join(root, 'TASKBOARD.preview.json');
  assert.ok(fs.existsSync(file), 'public opt-in render must write TASKBOARD.preview.json');
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}
function withRoom(callback) {
  const root = room();
  try { callback(root); } finally { fs.rmSync(root, { recursive: true, force: true }); }
}
function sample(root) {
  const a = spec(root, { id: 'S-000A', title: 'Plan a future capability', status: 'planned' });
  task(root, a, { id: 'TK-000A', title: 'Preserved pre-cut work', status: 'deferred' });
  const b = spec(root, { id: 'S-000B', title: 'Build the public seam' });
  task(root, b, { id: 'TK-000B', title: 'Implement the public seam', status: 'in-progress' });
  const c = spec(root, { id: 'S-000C', title: 'Offer future work', priority: 1 });
  task(root, c, { id: 'TK-000C', title: 'Wait visibly on a dependency', blockers: 'S-000Z' });
  const d = spec(root, { id: 'S-000D', title: 'Resolve a source blocker', status: 'blocked' });
  task(root, d, { id: 'TK-000D', title: 'Resolve the blocked slice', status: 'blocked', blockers: 'TK-000C' });
  const e = spec(root, { id: 'S-000E', title: 'Review assembled work', status: 'needs-review' });
  task(root, e, { id: 'TK-000E', title: 'Self-checked work', status: 'done' });
  const f = spec(root, { id: 'S-000F', title: 'Capture completed work', status: 'complete' });
  task(root, f, { id: 'TK-000F', title: 'Completed live slice', status: 'done' });
  const g = spec(root, { id: 'S-000G', title: 'Delete captured records', status: 'complete', retired: true });
  task(root, g, { id: 'TK-000G', title: 'Retired slice', status: 'done', retired: true });
}

if (process.argv.includes('--demo')) {
  withRoom(root => {
    sample(root);
    const board = preview(root);
    for (const lane of lanes) console.log(`${lane}: ${Object.entries(board.lanes[lane]).map(([id, card]) => `${card.title} (${id})`).join('; ')}`);
    console.log('Source-only fixture; default Markdown retained; no owner approval or canonical switch.');
  });
} else {
  test('public JSON preview has six lanes, both card grains, resolving sources, dependency visibility and derived cleanup', () => withRoom(root => {
    sample(root);
    const markdown = fs.readFileSync(path.join(root, 'TASKBOARD.md'), 'utf8');
    const board = preview(root);
    assert.equal(board.schemaVersion, 1);
    assert.deepEqual(Object.keys(board.lanes), lanes);
    assert.equal(fs.readFileSync(path.join(root, 'TASKBOARD.md'), 'utf8'), markdown);
    assert.equal(fs.existsSync(path.join(root, 'workbench/specs/CATALOG.md')), false);
    assert.equal(fs.existsSync(path.join(root, 'TASKBOARD.json')), false);
    const cards = Object.values(board.lanes).flatMap(lane => Object.values(lane));
    assert.equal(cards.length, 14);
    for (const card of cards) {
      assert.equal('kind' in card, false);
      assert.ok(card.title);
      for (const source of card.sourceLinks) assert.ok(fs.statSync(path.join(root, source)).isFile(), source);
    }
    assert.deepEqual(board.lanes.toDo['TK-000C'].dependencies, ['S-000Z']);
    assert.equal(board.lanes.backlog['S-000A'].title, 'Plan a future capability');
    assert.deepEqual(board.lanes.inProgress['S-000B'].progress, { complete: 0, total: 1 });
    assert.equal(board.lanes.needsReview['S-000E'].title, 'Review assembled work');
    assert.equal(board.lanes.complete['S-000F'].cleanupState, 'readyToCapture');
    assert.equal(board.lanes.complete['TK-000F'].cleanupState, 'readyToCapture');
    assert.equal(board.lanes.complete['S-000G'].cleanupState, 'readyToDelete');
    assert.equal(board.lanes.complete['TK-000G'].cleanupState, 'readyToDelete');
  }));

  test('source edits regenerate, output edits are erased, bytes are deterministic and known metadata stays source-owned', () => withRoom(root => {
    const a = spec(root, { id: 'S-000A', extra: '**Start date:** 2026-09-01\n**Due date:** 2026-10-01' });
    const file = task(root, a, { id: 'TK-000A', extra: '**Assignee:** fixture-worker\n**Approver:** fixture-reviewer\n**Next action:** Run the public demo\n**Priority:** 1' });
    const initial = preview(root); const output = path.join(root, 'TASKBOARD.preview.json');
    const first = fs.readFileSync(output, 'utf8'); preview(root); assert.equal(fs.readFileSync(output, 'utf8'), first);
    assert.equal(initial.lanes.toDo['TK-000A'].assignee, 'fixture-worker');
    assert.equal(initial.lanes.toDo['TK-000A'].approver, 'fixture-reviewer');
    assert.equal(initial.lanes.toDo['TK-000A'].nextAction, 'Run the public demo');
    assert.equal(initial.lanes.toDo['TK-000A'].priority, 1, 'known Task priority remains source-owned');
    assert.equal(initial.lanes.toDo['S-000A'].startDate, '2026-09-01');
    assert.equal(initial.lanes.toDo['TK-000A'].startDate, null, 'Updated and parent dates are not invented Task start dates');
    fs.writeFileSync(output, '{"edited":true}\n'); preview(root); assert.equal(fs.readFileSync(output, 'utf8'), first);
    put(root, file, fs.readFileSync(path.join(root, file), 'utf8').replaceAll('A readable slice', 'A source correction'));
    assert.equal(preview(root).lanes.toDo['TK-000A'].title, 'A source correction');
  }));

  test('priority then title then visible identity determine reproducible card order', () => withRoom(root => {
    spec(root, { id: 'S-000C', title: 'Zebra', priority: 2 });
    spec(root, { id: 'S-000B', title: 'Alpha', priority: 2 });
    spec(root, { id: 'S-000A', title: 'Urgent', priority: 1 });
    assert.deepEqual(Object.keys(preview(root).lanes.toDo), ['S-000A', 'S-000B', 'S-000C']);
  }));

  test('a Spec cannot reach review or complete while a child is unfinished; active does not invent a review-ready claim', () => withRoom(root => {
    for (const [id, status, taskId] of [['S-000A', 'needs-review', 'TK-000A'], ['S-000B', 'complete', 'TK-000B']]) {
      const parent = spec(root, { id, status }); task(root, parent, { id: taskId });
    }
    const c = spec(root, { id: 'S-000C' }); task(root, c, { id: 'TK-000C', status: 'done' });
    const board = preview(root);
    assert.equal('S-000A' in board.lanes.needsReview, false);
    assert.equal('S-000B' in board.lanes.complete, false);
    assert.equal('S-000C' in board.lanes.needsReview, false);
    assert.deepEqual(board.lanes.inProgress['S-000C'].progress, { complete: 1, total: 1 });
  }));

  test('legacy numeric identity remains Spec-scoped in source; flat collision refuses without dropping either record or changing prior output', () => withRoom(root => {
    const a = spec(root, { id: 'S-000A' }); const fileA = task(root, a, { id: 'TK-001' });
    assert.equal(preview(root).lanes.toDo['TK-001'].specId, 'S-000A');
    const output = fs.readFileSync(path.join(root, 'TASKBOARD.preview.json'), 'utf8');
    const b = spec(root, { id: 'S-000B' }); const fileB = task(root, b, { id: 'TK-001' });
    const result = command(root, 'render', '--format', 'json'); assert.notEqual(result.status, 0);
    assert.match(result.stderr, /collision/i); assert.ok(result.stderr.includes(fileA) && result.stderr.includes(fileB));
    assert.equal(fs.readFileSync(path.join(root, 'TASKBOARD.preview.json'), 'utf8'), output);
    assert.equal(fs.readFileSync(path.join(root, fileA), 'utf8').includes('**Task ID:** TK-001'), true);
    assert.equal(command(root, 'render').status, 0, 'ordinary Markdown retains its supported numeric scope');
  }));

  test('case and width aliases cannot silently become two JSON card keys', () => withRoom(root => {
    const a = spec(root, { id: 'S-000A' }); task(root, a, { id: 'TK-000Z' }); preview(root);
    const output = fs.readFileSync(path.join(root, 'TASKBOARD.preview.json'), 'utf8');
    const b = spec(root, { id: 'S-000B' }); task(root, b, { id: 'TK-00z' });
    const result = command(root, 'render', '--format', 'json'); assert.notEqual(result.status, 0); assert.match(result.stderr, /collision|Duplicate task ID/i);
    assert.ok(result.stderr.includes('TK-000Z') && result.stderr.includes('TK-00z'));
    assert.equal(fs.readFileSync(path.join(root, 'TASKBOARD.preview.json'), 'utf8'), output);
  }));

  test('malformed source, parent mismatch, invalid metadata and unsupported format refuse before any write', () => withRoom(root => {
    const a = spec(root, { id: 'S-000A' }); const file = task(root, a, { id: 'TK-000A' }); preview(root);
    const output = path.join(root, 'TASKBOARD.preview.json'); const before = fs.readFileSync(output, 'utf8'); const source = fs.readFileSync(path.join(root, file), 'utf8');
    for (const broken of [source.replace('**Status:** ready', '**Status:** invalid'), source.replace('**Spec ID:** S-000A', '**Spec ID:** S-000Z'), source+'**Due date:** 2026-02-30\n']) {
      put(root, file, broken); assert.notEqual(command(root, 'render', '--format', 'json').status, 0);
      assert.equal(fs.readFileSync(output, 'utf8'), before);
    }
    put(root, file, source);
    const markdown = fs.readFileSync(path.join(root, 'TASKBOARD.md'), 'utf8');
    assert.notEqual(command(root, 'render', '--format', 'yaml').status, 0);
    assert.equal(fs.readFileSync(path.join(root, 'TASKBOARD.md'), 'utf8'), markdown);
    assert.equal(fs.readFileSync(output, 'utf8'), before);
  }));

  test('linked outputs and linked source directories refuse without touching their targets', () => withRoom(root => {
    const a = spec(root, { id: 'S-000A' }); task(root, a, { id: 'TK-000A' });
    const target = path.join(root, 'sentinel.json'); fs.writeFileSync(target, 'sentinel\n');
    const output = path.join(root, 'TASKBOARD.preview.json');
    for (const link of [fs.symlinkSync, fs.linkSync]) {
      link(target, output); const result = command(root, 'render', '--format', 'json'); assert.notEqual(result.status, 0);
      assert.equal(fs.readFileSync(target, 'utf8'), 'sentinel\n'); fs.unlinkSync(output);
    }
    fs.symlinkSync(path.join(root, a.dir), path.join(root, 'workbench/specs/S-000Z-linked'));
    assert.notEqual(command(root, 'render', '--format', 'json').status, 0);
    assert.equal(fs.existsSync(output), false);
    assert.equal(fs.readFileSync(target, 'utf8'), 'sentinel\n');
  }));

  test('JSON rendering leaves the default Markdown and catalog projection byte-for-byte unchanged', () => withRoom(root => {
    const a = spec(root, { id: 'S-000A' }); task(root, a, { id: 'TK-000A' });
    assert.equal(command(root, 'render').status, 0);
    const board = fs.readFileSync(path.join(root, 'TASKBOARD.md'), 'utf8');
    const catalog = fs.readFileSync(path.join(root, 'workbench/specs/CATALOG.md'), 'utf8');
    preview(root);
    assert.equal(fs.readFileSync(path.join(root, 'TASKBOARD.md'), 'utf8'), board);
    assert.equal(fs.readFileSync(path.join(root, 'workbench/specs/CATALOG.md'), 'utf8'), catalog);
    assert.equal(command(root, 'render').status, 0);
    assert.equal(fs.readFileSync(path.join(root, 'TASKBOARD.md'), 'utf8'), board);
    assert.equal(fs.readFileSync(path.join(root, 'workbench/specs/CATALOG.md'), 'utf8'), catalog);
  }));
}

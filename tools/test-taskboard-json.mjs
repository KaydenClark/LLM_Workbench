#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync, execFileSync } from 'node:child_process';
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
function fixtureGit(root, ...args) {
  return execFileSync('git', ['-C', root, '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}
function initializeGitRoom(root) {
  fixtureGit(root, 'init', '--quiet', '-b', 'codex/fixture');
  fixtureGit(root, 'add', '.');
  fixtureGit(root, 'commit', '--quiet', '-m', 'Fixture source');
  fixtureGit(root, 'branch', 'integration');
}
function gitSnapshot(root) {
  return { sources: sourceSnapshot(root), refs: fixtureGit(root, 'show-ref'), status: fixtureGit(root, 'status', '--porcelain') };
}
function assertSourceDiagnostic(root, taskId) {
  const result = command(root, 'doctor');
  assert.equal(result.status, 1, 'invalid-state retains the registered selection effect');
  assert.equal(result.stderr, '', 'expected malformed source must be reported through JSON');
  const findings = JSON.parse(result.stdout);
  assert.ok(findings.some(item => item.code === 'invalid-state' && item.taskId === taskId && item.severity === 'error' && item.blocks === 'selection'));
  assert.ok(findings.some(item => item.code === 'blocked-slice' && item.taskId === 'TK-00AB'));
  assert.ok(findings.some(item => item.code === 'missing-evidence' && item.taskId === 'TK-00AC'));
  return findings;
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

function sourceSnapshot(root) {
  const files = {};
  function visit(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === '.git') continue;
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) visit(file);
      else if (entry.isFile()) files[path.relative(root, file)] = fs.readFileSync(file).toString('base64');
    }
  }
  visit(root); return files;
}
function selected(root, ...options) {
  const result = command(root, 'next', ...options);
  assert.equal(result.status, 0, result.stderr); return JSON.parse(result.stdout);
}
function dependencyFindings(root) {
  assert.equal(command(root, 'render').status, 0);
  const result = command(root, 'doctor');
  return JSON.parse(result.stdout).filter(item => item.code === 'blocked-slice');
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
    const available = spec(root, { id: 'S-000H', title: 'Offer an eligible To-do', priority: 1 });
    task(root, available, { id: 'TK-000H', title: 'Demonstrate ordinary dispatch' });
    const board = preview(root);
    for (const lane of lanes) console.log(`${lane}: ${Object.entries(board.lanes[lane]).map(([id, card]) => `${card.title} (${id})`).join('; ')}`);
    const next = selected(root, '--local');
    assert.equal(next.taskId, 'TK-000H');
    console.log(`ordinary next: ${next.slice} (${next.specId}/${next.taskId}); in-progress and dependency-waiting To-do remain visible and unoffered`);
    const waits = dependencyFindings(root);
    assert.ok(waits.some(item => item.taskId === 'TK-000C'));
    console.log(`doctor dependency waits: ${waits.map(item => `${item.specId}/${item.taskId}`).join(', ')}`);
    console.log('Source-only fixture; default Markdown retained; no owner approval or canonical switch.');
  });
} else {

  test('minimal planned intent renders Backlog with unknown metadata and never enters dispatch', () => withRoom(root => {
    const file = 'workbench/specs/S-00AA-fixture/SPEC.md';
    put(root, file, '# S-00AA - Keep a future capability discoverable.\n\n**Spec ID:** S-00AA\n**Status:** planned\n');
    const known = spec(root, { id: 'S-00AB', status: 'planned', priority: 5 });
    const board = preview(root), card = board.lanes.backlog['S-00AA'];
    assert.deepEqual(Object.keys(board.lanes.backlog), [known.id, 'S-00AA']);
    assert.equal(card.priority, null); assert.equal(card.assignee, null);
    assert.equal(card.nextAction, null); assert.equal(card.startDate, null);
    assert.equal(command(root, 'render').status, 0);
    assert.equal(command(root, 'doctor').status, 0);
    const before = sourceSnapshot(root);
    assert.equal(selected(root, '--local'), null);
    assert.deepEqual(selected(root, '--review', '--local').review, []);
    assert.deepEqual(sourceSnapshot(root), before);
    put(root, file, fs.readFileSync(path.join(root, file), 'utf8').replace('**Status:** planned', '**Status:** active'));
    const invalid = sourceSnapshot(root);
    assert.equal(command(root, 'render', '--format', 'json').status, 1);
    assert.deepEqual(sourceSnapshot(root), invalid);
  }));

  test('minimal Backlog preserves precut work but refuses invalid active conversion before writes', () => withRoom(root => {
    const a = { id: 'S-00AA', dir: 'workbench/specs/S-00AA-fixture' };
    put(root, a.dir+'/SPEC.md', '# S-00AA - Keep the future work.\n\n**Spec ID:** S-00AA\n**Status:** planned\n');
    const file = task(root, a, { id: 'TK-00AA' });
    assert.ok(preview(root).lanes.toDo['TK-00AA']);
    assert.equal(command(root, 'render').status, 0);
    assert.equal(command(root, 'doctor').status, 0);
    assert.equal(selected(root, '--local'), null);
    const before = sourceSnapshot(root);
    assert.equal(command(root, 'convert-tasks', a.id, '--activate').status, 1);
    assert.deepEqual(sourceSnapshot(root), before);
    put(root, file, fs.readFileSync(path.join(root, file), 'utf8').replace('**Status:** ready', '**Status:** typo'));
    assert.equal(command(root, 'render', '--format', 'json').status, 1);
  }));

  test('activation refuses duplicate Status fields without changing any source', () => withRoom(root => {
    const a = { id: 'S-00AA', dir: 'workbench/specs/S-00AA-fixture' };
    for (const duplicate of ['**Status:** planned', '** Status:** planned', '**Status :** planned']) {
      put(root, a.dir+'/SPEC.md', `# S-00AA - Keep the future work.\n\n**Spec ID:** S-00AA\n**Status:** planned\n${duplicate}\n`);
      task(root, a, { id: 'TK-00AA' });
      const before = sourceSnapshot(root);
      const result = command(root, 'convert-tasks', a.id, '--activate');
      assert.equal(result.status, 1, duplicate);
      assert.deepEqual(sourceSnapshot(root), before);
    }
  }));

  test('Spec delivered dependency resolves independently of unrelated Tasks and preserves child capability gates', () => withRoom(root => {
    const delivered = spec(root, { id: 'S-00AA' });
    task(root, delivered, { id: 'TK-00AA', status: 'done', extra: '**Proof:** Fixture delivery' });
    const file = path.join(root, delivered.file);
    fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace('- [ ] Actual', '- [x] Actual') + '\n## Append-Only Evidence And Execution Log\n\n| Date | Task | Event | Verification | Docs | Remaining gap |\n|---|---|---|---|---|---|\n');
    const dependent = spec(root, { id: 'S-00AB', status: 'needs-review' });
    const dependentFile = path.join(root, dependent.file);
    fs.writeFileSync(dependentFile, fs.readFileSync(dependentFile, 'utf8').replace('**Blockers:** none', '**Blockers:** S-00AA:delivered'));
    initializeGitRoom(root);
    const candidate = fixtureGit(root, 'rev-parse', 'HEAD');
    const verdict = command(root, 'verdict', delivered.id, '--candidate', candidate, '--result', 'pass', '--findings', 'none', '--reviewer', 'Independent fixture reviewer');
    assert.equal(verdict.status, 0, verdict.stderr);
    fixtureGit(root, 'add', '.'); fixtureGit(root, 'commit', '--quiet', '-m', 'Record fixture review');
    fixtureGit(root, 'branch', '-f', 'integration', 'HEAD');
    const before = gitSnapshot(root);
    const withoutTask = selected(root, '--review', '--local');
    assert.ok(withoutTask.review.some(x => x.specId === dependent.id && x.taskId === null));
    assert.deepEqual(gitSnapshot(root), before);
    const unrelated = spec(root, { id: 'S-00AC' });
    task(root, unrelated, { id: 'TK-00AC', blockers: 'S-00AA:delivered' });
    assert.deepEqual(selected(root, '--review', '--local'), withoutTask);
    fs.rmSync(path.join(root, unrelated.dir), { recursive: true });
    const child = task(root, dependent, { id: 'TK-00AB', status: 'needs-review', extra: '**Capabilities:** browser' });
    const gatedBefore = gitSnapshot(root), gated = selected(root, '--review', '--local', '--capabilities', 'none');
    assert.ok(gated.excluded.some(x => x.taskId === 'TK-00AB' && x.reason === 'capabilities'));
    assert.ok(gated.excluded.some(x => x.specId === dependent.id && x.taskId === null && x.reason === 'children'));
    assert.deepEqual(gitSnapshot(root), gatedBefore);
    fs.rmSync(path.dirname(path.join(root, child)), { recursive: true });
    // Containment remains necessary even with a valid PASS verdict.
    fixtureGit(root, 'update-ref', '-d', 'refs/heads/integration');
    const uncontainedBefore = gitSnapshot(root), uncontained = selected(root, '--review', '--local');
    assert.ok(uncontained.excluded.some(x => x.specId === dependent.id && x.reason === 'dependencies'));
    assert.deepEqual(gitSnapshot(root), uncontainedBefore);
  }));

  test('next --review lists source-qualified Spec and Task cards in shared order, separately from ordinary next', () => withRoom(root => {
    const a = spec(root, { id: 'S-00AA', title: 'Zebra assembly', status: 'needs-review' });
    task(root, a, { id: 'TK-00AA', title: 'Alpha review', status: 'needs-review' });
    task(root, a, { id: 'TK-00AB', status: 'done', extra: '**Proof:** Prior delivery' });
    const b = spec(root, { id: 'S-00AB' }); task(root, b, { id: 'TK-00AC', title: 'Urgent To-do', extra: '**Priority:** 0' });
    const board = preview(root), before = sourceSnapshot(root);
    const result = selected(root, '--review', '--local');
    assert.deepEqual(result.review.map(x => x.taskId ?? x.specId), ['TK-00AA', 'S-00AA']);
    assert.ok(result.review.every(x => board.lanes.needsReview[x.taskId ?? x.specId]));
    assert.deepEqual(result.excluded, []);
    assert.equal(selected(root, '--local').taskId, 'TK-00AC');
    assert.deepEqual(sourceSnapshot(root), before);
    // The boolean flag must not consume a following --json or --local flag.
    const reordered = spawnSync(process.execPath, [tool, 'next', '--review', '--json', '--local', '--path', root], { encoding: 'utf8' });
    assert.equal(reordered.status, 0, reordered.stderr);
    assert.equal(JSON.parse(reordered.stdout).review.length, 2);
  }));

  test('review dependency and capability exclusions remain visible and cannot be bypassed through the parent', () => withRoom(root => {
    const a = spec(root, { id: 'S-00AA', status: 'needs-review' });
    task(root, a, { id: 'TK-00AA', status: 'needs-review', blockers: 'owner:choose-input' });
    task(root, a, { id: 'TK-00AB', status: 'needs-review', extra: '**Capabilities:** browser' });
    const before = sourceSnapshot(root), result = selected(root, '--review', '--local', '--capabilities', 'none');
    assert.deepEqual(result.review, []);
    assert.ok(result.excluded.some(x => x.taskId === 'TK-00AA' && x.reason === 'dependencies'));
    assert.ok(result.excluded.some(x => x.taskId === 'TK-00AB' && x.reason === 'capabilities'));
    assert.ok(result.excluded.some(x => x.taskId === null && x.reason === 'children'));
    assert.deepEqual(sourceSnapshot(root), before);
  }));

  test('review preserves numeric Task scopes while preview still refuses flat collisions', () => withRoom(root => {
    for (const id of ['S-00AA', 'S-00AB']) {
      const a = spec(root, { id }); task(root, a, { id: 'TK-001', status: 'needs-review' });
    }
    const before = sourceSnapshot(root), result = selected(root, '--review', '--local');
    assert.deepEqual(result.review.map(x => [x.specId, x.taskId]), [['S-00AA','TK-001'], ['S-00AB','TK-001']]);
    assert.equal(command(root, 'render', '--format', 'json').status, 1);
    assert.deepEqual(sourceSnapshot(root), before);
  }));

  test('review excludes retired/planned owners and unfinished parents without rewriting source', () => withRoom(root => {
    for (const [id, status, retired] of [['S-00AA','planned',false],['S-00AB','complete',true],['S-00AC','needs-review',false]]) {
      const a = spec(root, { id, status, retired });
      task(root, a, { id: 'TK-'+id.slice(2), status: 'needs-review' });
      if (id === 'S-00AC') task(root, a, { id: 'TK-00AD', status: 'ready' });
    }
    const before = sourceSnapshot(root), result = selected(root, '--review', '--local');
    assert.deepEqual(result.review.map(x => [x.specId,x.taskId]), [['S-00AC','TK-00AC']]);
    assert.deepEqual(sourceSnapshot(root), before);
  }));

  test('review uses qualified dependency semantics and normalized completed identities', () => withRoom(root => {
    const completed = spec(root, { id: 'S-00AA', status: 'complete' });
    const a = spec(root, { id: 'S-00AB', status: 'needs-review' });
    task(root, a, { id: 'TK-001', status: 'done', extra: '**Proof:** Prior proof' });
    task(root, a, { id: 'TK-002', status: 'needs-review', blockers: 'S-aa, TK-0001' });
    task(root, a, { id: 'TK-003', status: 'needs-review', blockers: 'S-00AA:delivered' });
    task(root, a, { id: 'TK-004', status: 'needs-review', blockers: 'S-00AA:unknown' });
    const before = sourceSnapshot(root), result = selected(root, '--review', '--local');
    assert.deepEqual(result.review.map(x => x.taskId), ['TK-002','TK-003']);
    assert.ok(result.excluded.some(x => x.taskId === 'TK-004' && x.reason === 'dependencies'));
    assert.ok(result.excluded.some(x => x.specId === a.id && x.taskId === null && x.reason === 'children'));
    assert.deepEqual(sourceSnapshot(root), before);
  }));

  test('empty review Spec cannot hide malformed priority behind an empty child set', () => withRoom(root => {
    spec(root, { id: 'S-00AA', status: 'needs-review', priority: 'invalid' });
    const before = sourceSnapshot(root), result = command(root, 'next', '--review', '--local');
    assert.equal(result.status, 1); assert.match(result.stderr, /invalid priority/);
    assert.deepEqual(sourceSnapshot(root), before);
  }));

  test('source needs-review is visible and never offered or claimed as ordinary To-do', () => withRoom(root => {
    const a = spec(root, { id: 'S-00AA' });
    const file = task(root, a, { id: 'TK-00AA', status: 'needs-review' });
    const board = preview(root);
    assert.ok(board.lanes.needsReview['TK-00AA']);
    assert.match(board.lanes.needsReview['TK-00AA'].nextAction, /review/i);
    assert.deepEqual(board.lanes.needsReview['TK-00AA'].requiredQA, ['assembled-spec-review']);
    assert.equal(command(root, 'render').status, 0);
    const before = sourceSnapshot(root);
    assert.equal(selected(root, '--local'), null);
    const refused = command(root, 'claim', a.id, '--agent', 'fixture', '--local');
    assert.equal(refused.status, 1);
    assert.deepEqual(sourceSnapshot(root), before);
    assert.match(fs.readFileSync(path.join(root, file), 'utf8'), /Status:\*\* needs-review/);
    const doctor = command(root, 'doctor');
    assert.equal(doctor.status, 0, doctor.stdout + doctor.stderr);
  }));

  test('Spec review permits review-ready children but does not manufacture completion or approval', () => withRoom(root => {
    const a = spec(root, { id: 'S-00AA', status: 'needs-review' });
    task(root, a, { id: 'TK-00AA', status: 'needs-review' });
    task(root, a, { id: 'TK-00AB', status: 'done', extra: '**Proof:** Fixture proof' });
    const board = preview(root), card = board.lanes.needsReview[a.id];
    assert.ok(card);
    assert.deepEqual(card.progress, { complete: 1, total: 2 });
    assert.deepEqual(card.requiredQA, ['assembled-spec-review', 'owner-human-qa']);
    assert.equal(board.lanes.complete[a.id], undefined);
    assert.equal(card.approver, null);
  }));

  for (const status of ['ready', 'in-progress', 'blocked', 'deferred']) {
    test(`unfinished ${status} child prevents a Spec review lane`, () => withRoom(root => {
      const a = spec(root, { id: 'S-00AA', status: 'needs-review' });
      task(root, a, { id: 'TK-00AA', status: 'needs-review' });
      task(root, a, { id: 'TK-00AB', status, blockers: status === 'blocked' ? 'owner:choose-input' : 'none' });
      const board = preview(root);
      assert.equal(board.lanes.needsReview[a.id], undefined);
      assert.equal(board.lanes.complete[a.id], undefined);
    }));
  }

  test('declared Complete with a review child stays out of Complete and retains contradictory-state diagnosis', () => withRoom(root => {
    const a = spec(root, { id: 'S-00AA', status: 'complete' });
    task(root, a, { id: 'TK-00AA', status: 'needs-review' });
    assert.equal(preview(root).lanes.complete[a.id], undefined);
    assert.equal(command(root, 'render').status, 0);
    const findings = JSON.parse(command(root, 'doctor').stdout);
    assert.ok(findings.some(item => item.code === 'contradictory-state' && item.specId === a.id));
  }));

  test('direct Task completion adds no mandatory Task review ceremony', () => withRoom(root => {
    const a = spec(root, { id: 'S-00AA' });
    task(root, a, { id: 'TK-00AA', status: 'done', extra: '**Proof:** Self-check handed back' });
    const card = preview(root).lanes.complete['TK-00AA'];
    assert.deepEqual(card.requiredQA, []);
  }));

  test('review requirements and failed Human QA next action stay visible without satisfying dependencies', () => withRoom(root => {
    const a = spec(root, { id: 'S-00AA', status: 'needs-review', extra: '**Next action:** Failed Human QA: preserve findings and finish corrective work.' });
    task(root, a, { id: 'TK-00AA', status: 'needs-review', blockers: 'owner:choose-input', extra: '**Capabilities:** browser' });
    const b = spec(root, { id: 'S-00AB' });
    task(root, b, { id: 'TK-00AB', blockers: 'TK-00AA' });
    const board = preview(root), before = sourceSnapshot(root);
    assert.match(board.lanes.needsReview[a.id].nextAction, /^Failed Human QA:/);
    assert.deepEqual(board.lanes.needsReview['TK-00AA'].dependencies, ['owner:choose-input']);
    assert.ok(board.lanes.toDo['TK-00AB']);
    assert.equal(selected(root, '--local', '--capabilities', 'none'), null);
    assert.deepEqual(sourceSnapshot(root), before);
  }));

  test('new review vocabulary preserves typo refusal and prior preview bytes', () => withRoom(root => {
    const a = spec(root, { id: 'S-00AA' });
    const file = task(root, a, { id: 'TK-00AA', status: 'needs-review' });
    preview(root);
    put(root, file, fs.readFileSync(path.join(root, file), 'utf8').replace('**Status:** needs-review', '**Status:** needs-reveiw'));
    const before = sourceSnapshot(root);
    for (const args of [['render', '--format', 'json'], ['next', '--local'], ['claim', a.id, '--agent', 'fixture', '--local']]) {
      const result = command(root, ...args);
      assert.equal(result.status, 1);
      assert.match(result.stderr, /invalid status/);
      assert.deepEqual(sourceSnapshot(root), before);
    }
  }));

  test('ordinary next offers To-do rather than in-progress work without writing source or preview', () => withRoom(root => {
    const a = spec(root, { id: 'S-00AA', priority: 0 });
    task(root, a, { id: 'TK-00AA', status: 'in-progress' });
    const b = spec(root, { id: 'S-00AB', priority: 2 });
    task(root, b, { id: 'TK-00AB', title: 'Eligible To-do work' });
    const board = preview(root), before = sourceSnapshot(root);
    const next = selected(root, '--local');
    assert.equal(next.taskId, 'TK-00AB'); assert.equal(next.status, 'ready');
    assert.ok(board.lanes.toDo[next.taskId]); assert.ok(board.lanes.inProgress['TK-00AA']);
    assert.deepEqual(sourceSnapshot(root), before);
  }));

  test('ordinary next and scoped claim use projected Task priority, title and WBID order', () => withRoom(root => {
    const a = spec(root, { id: 'S-00AA', title: 'Alpha parent', priority: 2 });
    task(root, a, { id: 'TK-00AA', title: 'Zebra work' });
    task(root, a, { id: 'TK-00AD', title: 'Alpha work' });
    const b = spec(root, { id: 'S-00AB', title: 'Zebra parent', priority: 3 });
    task(root, b, { id: 'TK-00AC', title: 'Urgent work', extra: '**Priority:** 1' });
    const board = preview(root), tasks = Object.keys(board.lanes.toDo).filter(id => id.startsWith('TK-'));
    assert.deepEqual(tasks, ['TK-00AC', 'TK-00AD', 'TK-00AA']);
    assert.equal(selected(root, '--local').taskId, tasks[0]);
    const claimed = command(root, 'claim', 'S-aa', '--agent', 'fixture', '--local');
    assert.equal(claimed.status, 0, claimed.stderr); 
    assert.match(fs.readFileSync(path.join(root, a.dir, 'tasks/TK-00AD/TASK.md'), 'utf8'), /Status:\*\* in-progress/);
    assert.match(fs.readFileSync(path.join(root, a.dir, 'tasks/TK-00AA/TASK.md'), 'utf8'), /Status:\*\* ready/);
  }));

  test('every dependency-waiting To-do stays visible, unoffered and named by doctor; refused scoped claim writes nothing', () => withRoom(root => {
    const a = spec(root, { id: 'S-00AA' });
    task(root, a, { id: 'TK-00AA', status: 'in-progress' });
    task(root, a, { id: 'TK-00AB', blockers: 'S-00ZZ' });
    task(root, a, { id: 'TK-00AC', blockers: 'owner:choose-input' });
    const b = spec(root, { id: 'S-00AB' }); task(root, b, { id: 'TK-00AD' });
    const board = preview(root);
    assert.ok(board.lanes.toDo['TK-00AB']); assert.ok(board.lanes.toDo['TK-00AC']);
    assert.equal(selected(root, '--local').taskId, 'TK-00AD');
    assert.deepEqual(dependencyFindings(root).map(item => item.taskId).sort(), ['TK-00AB', 'TK-00AC']);
    const before = sourceSnapshot(root), refused = command(root, 'claim', 'S-aa', '--agent', 'fixture', '--local');
    assert.equal(refused.status, 1); assert.match(refused.stderr, /blocked by.*blocked-slice/);
    assert.deepEqual(sourceSnapshot(root), before);
  }));

  test('cleared source dependency derives To-do consistently without changing the authored blocked status', () => withRoom(root => {
    const a = spec(root, { id: 'S-00AA' });
    task(root, a, { id: 'TK-00AA', status: 'done', extra: '**Proof:** Fixture dependency delivered' });
    const file = task(root, a, { id: 'TK-00AB', status: 'blocked', blockers: 'TK-00AA' });
    const before = fs.readFileSync(path.join(root, file), 'utf8');
    const derived = preview(root).lanes.toDo['TK-00AB'];
    assert.ok(derived); assert.match(derived.nextAction, /Claim the slice/, 'a cleared dependency has a To-do continuation action');
    assert.equal(selected(root, '--local').taskId, 'TK-00AB');
    assert.deepEqual(dependencyFindings(root), []);
    assert.equal(fs.readFileSync(path.join(root, file), 'utf8'), before);
    assert.equal(command(root, 'claim', 'S-aa', '--agent', 'fixture', '--local').status, 0);
    assert.match(fs.readFileSync(path.join(root, file), 'utf8'), /Status:\*\* in-progress/);
  }));

  test('source-qualified selection and scoped claims preserve duplicate numeric labels while flat preview still refuses without writes', () => withRoom(root => {
    const a = spec(root, { id: 'S-00AA', priority: 2 }); const af = task(root, a, { id: 'TK-001', title: 'Zebra' });
    preview(root); const output = fs.readFileSync(path.join(root, 'TASKBOARD.preview.json'), 'utf8');
    const b = spec(root, { id: 'S-00AB', priority: 1 }); const bf = task(root, b, { id: 'TK-001', title: 'Alpha' });
    const before = sourceSnapshot(root), refusal = command(root, 'render', '--format', 'json');
    assert.equal(refusal.status, 1); assert.match(refusal.stderr, /taskboard-collision/); assert.deepEqual(sourceSnapshot(root), before);
    assert.equal(selected(root, '--local').specId, b.id);
    assert.equal(fs.readFileSync(path.join(root, 'TASKBOARD.preview.json'), 'utf8'), output);
    assert.equal(command(root, 'claim', 'S-ab', '--agent', 'fixture', '--local').status, 0);
    assert.match(fs.readFileSync(path.join(root, af), 'utf8'), /Status:\*\* ready/);
    assert.match(fs.readFileSync(path.join(root, bf), 'utf8'), /Status:\*\* in-progress/);
  }));

  test('capability gates overlay shared eligibility, remain visible, and route only through an authorized claim', () => withRoom(root => {
    const a = spec(root, { id: 'S-00AA' });
    const file = task(root, a, { id: 'TK-00AA', title: 'Alpha simulator', extra: '**Capabilities:** simulator' });
    task(root, a, { id: 'TK-00AB', title: 'Zebra available' });
    assert.ok(preview(root).lanes.toDo['TK-00AA']);
    const before = sourceSnapshot(root), next = selected(root, '--local');
    assert.equal(next.taskId, 'TK-00AB'); assert.equal(next.capabilityBlocked[0].taskId, 'TK-00AA');
    assert.deepEqual(sourceSnapshot(root), before);
    assert.equal(selected(root, '--local', '--capabilities', 'simulator').taskId, 'TK-00AA');
    assert.equal(command(root, 'claim', 'S-aa', '--agent', 'fixture', '--local').status, 0);
    assert.match(fs.readFileSync(path.join(root, file), 'utf8'), /Status:\*\* blocked/);
    assert.match(fs.readFileSync(path.join(root, file), 'utf8'), /Missing capabilities:\*\* simulator/);
    assert.ok(preview(root).lanes.blocked['TK-00AA']);
    assert.equal(selected(root, '--local', '--capabilities', 'simulator').taskId, 'TK-00AA');
  }));

  test('no To-do work returns no ordinary offer and an unclaimed refusal preserves all bytes', () => withRoom(root => {
    const a = spec(root, { id: 'S-00AA' }); task(root, a, { id: 'TK-00AA', status: 'in-progress' }); preview(root);
    const before = sourceSnapshot(root); assert.equal(selected(root, '--local'), null);
    assert.equal(command(root, 'claim', 'S-aa', '--agent', 'fixture', '--local').status, 1);
    assert.deepEqual(sourceSnapshot(root), before);
  }));

  test('equal source priority and title use WBID order across preview, next and scoped claim', () => withRoom(root => {
    const a = spec(root, { id: 'S-00AA' });
    task(root, a, { id: 'TK-00AC', title: 'Same title' });
    task(root, a, { id: 'TK-00AB', title: 'Same title' });
    const board = preview(root);
    assert.deepEqual(Object.keys(board.lanes.toDo).filter(id => id.startsWith('TK-')), ['TK-00AB', 'TK-00AC']);
    assert.equal(selected(root, '--local').taskId, 'TK-00AB');
    assert.equal(command(root, 'claim', 'S-aa', '--agent', 'fixture', '--local').status, 0);
    assert.match(fs.readFileSync(path.join(root, a.dir, 'tasks/TK-00AB/TASK.md'), 'utf8'), /Status:\*\* in-progress/);
  }));

  test('invalid source priority is named by doctor and refuses preview, next and claim without writes', () => withRoom(root => {
    const a = spec(root, { id: 'S-00AA' }); const file = task(root, a, { id: 'TK-00AA' }); preview(root);
    put(root, file, fs.readFileSync(path.join(root, file), 'utf8') + '**Priority:** invalid\n');
    assert.equal(command(root, 'render').status, 0);
    const before = sourceSnapshot(root), findings = JSON.parse(command(root, 'doctor').stdout);
    assert.ok(findings.some(item => item.taskId === 'TK-00AA' && /invalid priority/.test(item.message)));
    for (const args of [['render','--format','json'], ['next','--local'], ['claim','S-aa','--agent','fixture','--local']]) {
      const result = command(root, ...args); assert.equal(result.status, 1); assert.match(result.stderr, /invalid priority/);
      assert.deepEqual(sourceSnapshot(root), before);
    }
  }));

  for (const status of ['ready', 'in-progress']) for (const priority of ['invalid', '-1', '1.5', 'Infinity']) {
    test(`Git-backed doctor retains invalid-state and other findings for ${status} Priority ${priority}, with no writes`, () => withRoom(root => {
      const a = spec(root, { id: 'S-00AA' });
      task(root, a, { id: 'TK-00AA', status, extra: `**Priority:** ${priority}` });
      task(root, a, { id: 'TK-00AB', blockers: 'S-00AZ' });
      task(root, a, { id: 'TK-00AC', status: 'done' });
      put(root, 'TASKBOARD.preview.json', 'existing output must survive\n');
      assert.equal(command(root, 'render').status, 0); initializeGitRoom(root);
      const before = gitSnapshot(root);
      assertSourceDiagnostic(root, 'TK-00AA');
      for (const args of [['next','--local'], ['claim','S-aa','--agent','fixture','--local'], ['render','--format','json']]) {
        const result = command(root, ...args); assert.equal(result.status, 1); assert.match(result.stderr, /invalid priority/);
      }
      assert.deepEqual(gitSnapshot(root), before);
    }));
  }

  test('Git-backed doctor retains invalid legacy table status and unrelated findings while selection and preview refuse without writes', () => withRoom(root => {
    const a = spec(root, { id: 'S-00AA', table: '| Task | Slice | Status | Blockers | Proof |\n|---|---|---|---|---|\n| TK-00AA | Invalid table state | typo | none | pending |' });
    const b = spec(root, { id: 'S-00AB' });
    task(root, b, { id: 'TK-00AB', blockers: 'S-00AZ' }); task(root, b, { id: 'TK-00AC', status: 'done' });
    put(root, 'TASKBOARD.preview.json', 'existing output must survive\n');
    assert.equal(command(root, 'render').status, 0); initializeGitRoom(root);
    const before = gitSnapshot(root); assertSourceDiagnostic(root, 'TK-00AA');
    for (const args of [['next','--local'], ['claim','S-aa','--agent','fixture','--local'], ['render','--format','json']]) {
      const result = command(root, ...args); assert.equal(result.status, 1); assert.match(result.stderr, /invalid status typo/);
    }
    assert.deepEqual(gitSnapshot(root), before);
  }));

  for (const malformed of ['priority', 'table-status']) test(`non-active ${malformed} remains diagnosed without hiding a valid integration candidate`, () => withRoom(root => {
    const table = malformed === 'table-status' ? '| Task | Slice | Status | Blockers | Proof |\n|---|---|---|---|---|\n| TK-00AA | Invalid table state | typo | none | pending |' : '';
    const a = spec(root, { id: 'S-00AA', status: 'blocked', table });
    if (!table) task(root, a, { id: 'TK-00AA', extra: '**Priority:** invalid' });
    const b = spec(root, { id: 'S-00AB', status: 'complete' });
    const file = task(root, b, { id: 'TK-00AB', status: 'done', extra: '**Proof:** Fixture complete' });
    assert.equal(command(root, 'render').status, 0); initializeGitRoom(root);
    put(root, b.file, fs.readFileSync(path.join(root,b.file),'utf8').replace('**Status:** complete', '**Status:** active'));
    put(root, file, fs.readFileSync(path.join(root,file),'utf8').replace('**Status:** done', '**Status:** ready'));
    assert.equal(command(root, 'render').status, 0);
    const before = gitSnapshot(root), result = command(root, 'doctor'); assert.equal(result.status, 1); assert.equal(result.stderr, '');
    const findings = JSON.parse(result.stdout);
    assert.ok(findings.some(item => item.code === 'invalid-state' && item.specId === a.id));
    assert.ok(findings.some(item => item.code === 'complete-on-integration' && item.specId === b.id && item.ref === 'integration'));
    assert.equal(selected(root, '--local').taskId, 'TK-00AB');
    assert.deepEqual(gitSnapshot(root), before);
  }));

  for (const malformed of ['priority', 'table-status', 'slice-conflict']) test(`active ${malformed} does not suppress another Spec's integration diagnostic`, () => withRoom(root => {
    const table = malformed !== 'priority' ? `| Task | Slice | Status | Blockers | Proof |\n|---|---|---|---|---|\n| TK-00AA | Invalid table state | ${malformed === 'slice-conflict' ? 'ready' : 'typo'} | none | pending |` : '';
    const a = spec(root, { id: 'S-00AA', priority: 0, table });
    if (!table || malformed === 'slice-conflict') task(root, a, { id: 'TK-00AA', extra: '**Priority:** invalid' });
    const b = spec(root, { id: 'S-00AB', status: 'complete' });
    const file = task(root, b, { id: 'TK-00AB', status: 'done', extra: '**Proof:** Fixture complete' });
    assert.equal(command(root, 'render').status, 0); initializeGitRoom(root);
    put(root, b.file, fs.readFileSync(path.join(root,b.file),'utf8').replace('**Status:** complete', '**Status:** active'));
    put(root, file, fs.readFileSync(path.join(root,file),'utf8').replace('**Status:** done', '**Status:** ready'));
    const before = gitSnapshot(root), result = command(root, 'doctor');
    assert.equal(result.status, 1); assert.equal(result.stderr, '');
    const findings = JSON.parse(result.stdout);
    assert.ok(findings.some(item => item.code === (malformed === 'slice-conflict' ? 'row-record-collision' : 'invalid-state') && item.specId === a.id));
    assert.ok(findings.some(item => item.code === 'complete-on-integration' && item.specId === b.id && item.ref === 'integration'));
    for (const args of [['next','--local'], ['claim',a.id,'--agent','fixture','--local'], ['render','--format','json']]) assert.equal(command(root,...args).status,1);
    assert.deepEqual(gitSnapshot(root), before);
  }));

  test('a Task declaring a different existing Spec refuses preview, next and claim without writes', () => withRoom(root => {
    const a = spec(root, { id: 'S-00AA' });
    const b = spec(root, { id: 'S-00BB' });
    task(root, a, { id: 'TK-00AA', specId: b.id });
    put(root,'TASKBOARD.preview.json','preserve prior output\n'); initializeGitRoom(root);
    const before = gitSnapshot(root);
    for (const args of [['render','--format','json'], ['next','--local'], ['next','--review','--local'], ['claim',a.id,'--agent','fixture','--local']]) {
      const result=command(root,...args);
      assert.equal(result.status,1, `${args[0]} must refuse the declared parent mismatch`);
      assert.match(result.stderr,/names S-00BB, expected parent S-00AA/);
      assert.deepEqual(gitSnapshot(root), before);
    }
    const diagnostic=command(root,'doctor'); assert.equal(diagnostic.status,1); assert.equal(diagnostic.stderr,'');
    assert.ok(JSON.parse(diagnostic.stdout).some(item=>item.code==='invalid-state' && item.taskId==='TK-00AA'));
    assert.deepEqual(gitSnapshot(root),before);
  }));

  test('doctor propagates unexpected shared-calculation faults rather than treating them as malformed source', () => withRoom(root => {
    const a = spec(root, { id: 'S-00AA' }); task(root, a, { id: 'TK-00AA' });
    assert.equal(command(root, 'render').status, 0); initializeGitRoom(root);
    const before = gitSnapshot(root);
    const program = `import assert from 'node:assert/strict'; import {doctor} from ${JSON.stringify(new URL('../workbench/tools/spec-workbench.mjs', import.meta.url).href)};
      const sentinel = new Error('unexpected calculation fault'); sentinel.code = 'FIXTURE_UNEXPECTED';
      const original = String.prototype.matchAll;
      String.prototype.matchAll = function(...args) { if (new Error().stack.includes('taskboardTaskEntry')) throw sentinel; return original.apply(this,args); };
      try { assert.throws(() => doctor(${JSON.stringify(root)}), error => error === sentinel); } finally { String.prototype.matchAll = original; }`;
    const result = spawnSync(process.execPath, ['--input-type=module','-e',program], {encoding:'utf8'});
    assert.equal(result.status, 0, result.stdout+result.stderr); assert.deepEqual(gitSnapshot(root), before);
  }));

  test('competing remote claims exclude offers and claims without changing visible source lanes or integration', () => withRoom(root => {
    const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'taskboard-remote-'));
    const origin = path.join(scratch, 'origin.git');
    const git = (dir, ...args) => execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
    try {
      const a = spec(root, { id: 'S-00AA' }); task(root, a, { id: 'TK-00AA', title: 'Alpha' }); task(root, a, { id: 'TK-00AB', title: 'Beta' });
      assert.equal(command(root, 'render').status, 0);
      execFileSync('git', ['init', '--quiet', '--bare', '-b', 'main', origin]);
      git(root, 'init', '--quiet', '-b', 'integration'); git(root, 'config', 'user.email', 'fixture@example.com'); git(root, 'config', 'user.name', 'Fixture');
      const manifest = JSON.parse(fs.readFileSync(path.join(root, 'workbench/manifest.json'), 'utf8'));
      for (const folder of [...Object.values(manifest.lanes), ...Object.values(manifest.collections), manifest.landmarkTracker.root, ...Object.values(manifest.landmarkTracker.collections)]) put(root, folder+'/.gitkeep', '');
      git(root, 'add', '.'); git(root, 'commit', '--quiet', '-m', 'Fixture room'); git(root, 'branch', 'main'); git(root, 'remote', 'add', 'origin', origin); git(root, 'push', '--quiet', 'origin', 'integration', 'main');
      const base = git(root, 'rev-parse', 'HEAD');
      const clones = ['alpha','beta','gamma'].map(name => {
        const dir = path.join(scratch, name); execFileSync('git', ['clone', '--quiet', '--branch', 'integration', origin, dir], { stdio: 'ignore' });
        git(dir, 'config', 'user.email', 'fixture@example.com'); git(dir, 'config', 'user.name', 'Fixture'); return dir;
      });
      const firstClaim = command(clones[0], 'claim', 'S-aa', '--agent', 'alpha'); assert.equal(firstClaim.status, 0, firstClaim.stderr);
      const board = preview(clones[1]), next = selected(clones[1]);
      assert.ok(board.lanes.toDo['TK-00AA']); assert.equal(next.taskId, 'TK-00AB'); assert.equal(next.coordination.remoteClaimed[0].taskId, 'TK-00AA');
      assert.equal(command(clones[1], 'claim', 'S-aa', '--agent', 'beta').status, 0);
      assert.equal(selected(clones[2]), null);
      const before = sourceSnapshot(clones[2]); assert.equal(command(clones[2], 'claim', 'S-aa', '--agent', 'gamma').status, 1);
      assert.deepEqual(sourceSnapshot(clones[2]), before);
      const observer = clones[2];
      for (const id of ['TK-00AA','TK-00AB']) {
        const file = path.join(observer, a.dir, 'tasks', id, 'TASK.md');
        fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace('**Status:** ready', '**Status:** needs-review'));
      }
      const parentFile = path.join(observer, a.file);
      fs.writeFileSync(parentFile, fs.readFileSync(parentFile, 'utf8').replace('**Status:** active', '**Status:** needs-review'));
      const reviewBefore = sourceSnapshot(observer), reviews = selected(observer, '--review');
      assert.deepEqual(reviews.review, []);
      assert.equal(reviews.excluded.filter(x => x.reason === 'claimed').length, 2);
      assert.ok(reviews.excluded.some(x => x.taskId === null && x.reason === 'children'));
      assert.deepEqual(sourceSnapshot(observer), reviewBefore);
      assert.equal(git(root, 'ls-remote', 'origin', 'refs/heads/integration').split(/\s/)[0], base);
    } finally { fs.rmSync(scratch, {recursive:true,force:true}); }
  }));
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
    const sourceBefore = sourceSnapshot(root);
    for (const args of [['next','--local'], ['claim','S-b','--agent','fixture','--local']]) {
      const refusal = command(root, ...args); assert.equal(refusal.status, 1); assert.match(refusal.stderr, /Duplicate task ID/i);
      assert.deepEqual(sourceSnapshot(root), sourceBefore);
    }
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

  for (const [variant, addition] of [
    ['body field after a section', '\n## Evidence\n\n**Status:** complete\n'],
    ['normalized field name in the header', '**Status :** complete\n']
  ]) test(`duplicate Spec ${variant} refuses before replacing the existing preview`, () => withRoom(root => {
    const a = spec(root, { id: 'S-000A' }); task(root, a, { id: 'TK-000A', status: 'done' });
    assert.ok(preview(root).lanes.inProgress['S-000A']);
    const output = path.join(root, 'TASKBOARD.preview.json'); const before = fs.readFileSync(output, 'utf8');
    const source = fs.readFileSync(path.join(root, a.file), 'utf8');
    put(root, a.file, variant.startsWith('body') ? source + addition : source.replace('## Vertical Implementation Slices', addition + '\n## Vertical Implementation Slices'));
    const result = command(root, 'render', '--format', 'json');
    assert.notEqual(result.status, 0, 'ambiguous normalized source must refuse rather than manufacture Complete');
    assert.match(result.stderr, /duplicat.*Status/i);
    assert.equal(fs.readFileSync(output, 'utf8'), before);
    assert.equal(command(root, 'render').status, 0, 'the existing Markdown parser behavior remains unchanged');
    assert.equal(fs.readFileSync(output, 'utf8'), before, 'default rendering never replaces the JSON preview');
  }));

  test('preview duplicate guard matches whole-document key trimming and case-sensitive source extraction', () => withRoom(root => {
    const a = spec(root, { id: 'S-000A' }); task(root, a, { id: 'TK-000A', status: 'done' }); preview(root);
    const output = path.join(root, 'TASKBOARD.preview.json'); const before = fs.readFileSync(output, 'utf8');
    const source = fs.readFileSync(path.join(root, a.file), 'utf8');
    const variants = [
      ['leading key space', source + '\n** Status:** complete\n'],
      ['key tabs', source + '\n**\tStatus\t:** complete\n'],
      ['Unicode trim', source + '\n**\u00a0Status\u00a0:** complete\n'],
      ['multiline key trim', source + '\n**\nStatus\n:** complete\n'],
      ['CRLF body', source.replaceAll('\n', '\r\n') + '\r\n## Evidence\r\n**Status :** complete\r\n'],
      ['other field', source + '\n## Evidence\n** Priority :** 1\n'],
      ['unknown repeated field', source.replace('## Vertical Implementation Slices', '**Context:** one\n\n## Vertical Implementation Slices') + '\n** Context :** two\n']
    ];
    for (const [variant, malformed] of variants) {
      put(root, a.file, malformed);
      const result = command(root, 'render', '--format', 'json');
      assert.notEqual(result.status, 0, variant); assert.match(result.stderr, /duplicat/i, variant);
      assert.equal(fs.readFileSync(output, 'utf8'), before, variant);
    }
    // Key case is preserved by both actual readers; lowercase is a distinct
    // field, not an alternate spelling of the required Status field.
    put(root, a.file, source + '\n## Evidence\n**status:** complete\n');
    assert.ok(preview(root).lanes.inProgress['S-000A']);
  }));

  // The live room's S-003W repeats its header `**Stance:**` label inside each
  // `### TK-...` slice description (S-046/S-047/S-048/S-01W use other `###`
  // headings there). No parser reads Stance, and each slice subsection scopes
  // its own narrative labels, so the preview must not refuse.
  const sliceSpec = (root, { header = '**Stance:** Builder\n', slices }) => {
    const a = spec(root, { id: 'S-000A', extra: header });
    task(root, a, { id: 'TK-000A', status: 'done' });
    const source = fs.readFileSync(path.join(root, a.file), 'utf8');
    put(root, a.file, source.replace('\n## Acceptance Criteria', `\n${slices}\n## Acceptance Criteria`));
    return a;
  };

  test('repeated narrative labels scoped to Spec slice subsections render without changing the card', () => withRoom(root => {
    sliceSpec(root, { slices: '### TK-000A - Retain the evidence\n\n**Stance:** Builder\n\nNarrative.\n\n#### Detail\n\n**Done criteria:** one\n\n### Scoped Ticket: TK-000B\n\n**Stance:** Reviewer\n**Done criteria:** two\n\n### TK-000C — Em-dash heading\n\n**Stance:** Builder\n\n### First slice - Public proposal\n\n**Stance:** Builder\n\n### v3.2.0 assigned completion (2026-09-08)\n\n**Stance:** Builder\n' });
    const card = preview(root).lanes.inProgress['S-000A'];
    assert.ok(card, 'the Spec card renders');
    assert.equal(card.priority, 2); assert.equal(card.assignee, 'fixture-dispatcher'); assert.equal(card.nextAction, 'Verify the objective');
    const result = command(root, 'doctor');
    assert.equal(result.stderr, '');
  }));

  test('a field any source parser reads still refuses when repeated inside a slice subsection', () => withRoom(root => {
    const a = sliceSpec(root, { slices: '### TK-000A - Retain the evidence\n\n**Stance:** Builder\n' });
    const output = path.join(root, 'TASKBOARD.preview.json'); preview(root); const before = fs.readFileSync(output, 'utf8');
    const source = fs.readFileSync(path.join(root, a.file), 'utf8');
    for (const field of ['**Status:** complete', '**Priority:** 1', '**Owner:** someone-else', '**Next gate:** Another gate', '** Blockers :** S-000Z']) {
      put(root, a.file, source.replace('**Stance:** Builder\n\n## Acceptance', `**Stance:** Builder\n${field}\n\n## Acceptance`));
      const result = command(root, 'render', '--format', 'json');
      assert.notEqual(result.status, 0, field); assert.match(result.stderr, /duplicat/i, field);
      assert.equal(fs.readFileSync(output, 'utf8'), before, field);
    }
    // A card field the header never names is still unique across the document.
    put(root, a.file, source.replace('**Stance:** Builder\n\n## Vertical', '**Stance:** Builder\n**Assignee:** first\n\n## Vertical').replace('**Stance:** Builder\n\n## Acceptance', '**Stance:** Builder\n**Assignee:** second\n\n## Acceptance'));
    const result = command(root, 'render', '--format', 'json');
    assert.notEqual(result.status, 0); assert.match(result.stderr, /duplicat.*Assignee/i);
    assert.equal(fs.readFileSync(output, 'utf8'), before);
  }));

  test('a narrative label repeated within one slice or at Spec scope still refuses', () => withRoom(root => {
    const a = sliceSpec(root, { slices: '### TK-000A - Retain the evidence\n\n**Stance:** Builder\n' });
    const output = path.join(root, 'TASKBOARD.preview.json'); preview(root); const before = fs.readFileSync(output, 'utf8');
    const variants = [
      ['twice in one slice', '### TK-000A - Retain the evidence\n\n**Stance:** Builder\n#### Detail\n** Stance :** Reviewer\n'],
      ['Spec scope after a slice closes', '### TK-000A - Retain the evidence\n\n**Stance:** Builder\n\n## Evidence\n\n**Stance:** Reviewer\n'],
      ['subsection outside the slices section', '### TK-000A - Retain the evidence\n\n**Stance:** Builder\n\n## Evidence\n\n### Notes\n\n**Stance:** Reviewer\n'],
      ['slice-shaped heading outside the slices section', '## Follow-up\n\n### TK-000A - Follow-up\n\n**Stance:** Reviewer\n'],
      ['slices introduction before any subsection', '**Stance:** Reviewer\n\n### TK-000A - Retain the evidence\n']
    ];
    const source = fs.readFileSync(path.join(root, a.file), 'utf8');
    for (const [variant, slices] of variants) {
      put(root, a.file, source.replace(/\n### [\s\S]*?\n## Acceptance Criteria/, `\n${slices}\n## Acceptance Criteria`));
      const result = command(root, 'render', '--format', 'json');
      assert.notEqual(result.status, 0, variant); assert.match(result.stderr, /duplicat.*Stance/i, variant);
      assert.equal(fs.readFileSync(output, 'utf8'), before, variant);
    }
  }));

  test('the preview duplicate guard names every field the Spec, Task, landmark and card parsers read', async () => {
    const { TASKBOARD_SOURCE_FIELDS } = await import('../workbench/tools/taskboard.mjs');
    const read = file => fs.readFileSync(new URL(`../workbench/tools/${file}`, import.meta.url), 'utf8');
    const names = new Set();
    for (const file of ['spec-packet.mjs', 'task-record.mjs', 'landmark-artifact.mjs', 'taskboard.mjs']) {
      const text = read(file);
      for (const match of text.matchAll(/\bfields(?:\.([A-Za-z_]\w*)|\[['"]([^'"]+)['"]\]|, ['"]([^'"]+)['"]\))/g)) names.add(match[1] ?? match[2] ?? match[3]);
      for (const match of text.matchAll(/(?:\brequired|REQUIRED_LANDMARK_FIELDS) = (?:Object\.freeze\()?(?:planned \? \[[^\]]*\] : )?\[([^\]]*)\]/g)) {
        for (const name of match[1].matchAll(/'([^']+)'/g)) names.add(name[1]);
      }
    }
    for (const file of ['spec-workbench.mjs', 'spec-report.mjs']) {
      for (const match of read(file).matchAll(/\\\*\\\*([A-Z][A-Za-z ]*):\\\*\\\*/g)) names.add(match[1]);
    }
    for (const name of ['Spec ID', 'Status', 'Priority', 'Former ID', 'Close pending', 'Due date']) assert.ok(names.has(name), `the drift scan must find ${name}`);
    const missing = [...names].filter(name => !TASKBOARD_SOURCE_FIELDS.has(name));
    assert.deepEqual(missing, [], 'every parsed field stays document-unique under the preview guard');
  });

  test('single normalized metadata fields follow source whitespace and whole-document semantics', () => withRoom(root => {
    const a = spec(root, { id: 'S-000A' }); const file = task(root, a, { id: 'TK-000A' });
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    put(root, file, source + '\n## Evidence\n** Assignee :**\n\tfixture-worker  \n**\tApprover\t:** fixture-reviewer\n** Priority :** 1\n**\u00a0Next action\u00a0:** Run the normalized demo\n**Due date :** 2026-10-01\n**assignee:** ignored lowercase field\n');
    const card = preview(root).lanes.toDo['TK-000A'];
    assert.equal(card.assignee, 'fixture-worker'); assert.equal(card.approver, 'fixture-reviewer');
    assert.equal(card.priority, 1); assert.equal(card.nextAction, 'Run the normalized demo'); assert.equal(card.dueDate, '2026-10-01');
    const bytes = fs.readFileSync(path.join(root, 'TASKBOARD.preview.json'), 'utf8');
    put(root, file, fs.readFileSync(path.join(root, file), 'utf8').replaceAll('\n', '\r\n'));
    preview(root); assert.equal(fs.readFileSync(path.join(root, 'TASKBOARD.preview.json'), 'utf8'), bytes);
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

  // S-003Z TK-008G: a Task directly under a landmark is a card under that
  // landmark's card in both projections, offered only while the landmark is
  // active and held by an owner other than `unassigned`.
  test('a landmark-direct Task projects under its landmark and is offered only while the landmark is assigned', () => withRoom(root => {
    const dir = 'workbench/landmarks/LMK-0AA-fixture';
    const landmark = (owner) => `# LMK-0AA - Hold a readable direction\n\n**Landmark ID:** LMK-0AA\n**Status:** active\n**Priority:** 1\n**Owner:** ${owner}\n**Updated:** 2026-09-30\n**Catalog description:** Fixture direction\n**Blockers:** none\n**Latest event:** Fixture source\n**Next gate:** Reach the direction\n\n## Direction\n\nToward the fixture destination.\n\n## What Success Looks Like\n\n- [ ] The direction is reached.\n\n## Decision Records\n\n- none\n\n## Direct Tasks\n\n- [TK-00AA - Take a direct step](tasks/TK-00AA/TASK.md)\n\n## Append-Only Evidence And Execution Log\n\n| Date | Task | Event | Verification | Docs | Remaining gap |\n|---|---|---|---|---|---|\n\n## Reached Result\n\nPending.\n`;
    put(root, `${dir}/LANDMARK.md`, landmark('fixture-director'));
    put(root, `${dir}/tasks/TK-00AA/TASK.md`, '# TK-00AA - Take a direct step\n\n**Task ID:** TK-00AA\n**Landmark ID:** LMK-0AA\n**Slice:** Take a direct step\n**Status:** ready\n**Blockers:** none\n**Destination:** spec-acceptance: LMK-0AA What Success Looks Like\n');
    const later = spec(root, { id: 'S-00AB', priority: 5 });
    task(root, later, { id: 'TK-00AB' });

    const board = preview(root);
    const card = board.lanes.toDo['TK-00AA'];
    assert.ok(card, JSON.stringify(board.lanes));
    assert.equal(card.landmarkId, 'LMK-0AA', 'the Task card names its landmark');
    assert.equal(card.specId, undefined, 'and no Spec');
    assert.deepEqual(card.sourceLinks, [`${dir}/tasks/TK-00AA/TASK.md`, `${dir}/LANDMARK.md`]);
    const landmarkCard = board.lanes.toDo['LMK-0AA'];
    assert.ok(landmarkCard, 'the landmark is a card of its own');
    assert.equal(landmarkCard.assignee, 'fixture-director');
    assert.deepEqual(landmarkCard.progress, { complete: 0, total: 1 });
    assert.deepEqual(landmarkCard.sourceLinks, [`${dir}/LANDMARK.md`]);

    const offered = selected(root, '--local');
    assert.deepEqual([offered.landmarkId, offered.taskId], ['LMK-0AA', 'TK-00AA']);
    assert.equal(command(root, 'render').status, 0);
    assert.match(fs.readFileSync(path.join(root, 'TASKBOARD.md'), 'utf8'), /^\| \[LMK-0AA\]\(workbench\/landmarks\/LMK-0AA-fixture\/LANDMARK\.md\) \| TK-00AA: Take a direct step \(ready\) \| fixture-director \|/m);
    assert.equal(command(root, 'doctor').status, 0, command(root, 'doctor').stdout);

    // Unassigned: the card stays visible and the Task is never offered.
    put(root, `${dir}/LANDMARK.md`, landmark('unassigned'));
    assert.ok(preview(root).lanes.toDo['TK-00AA'], 'an unassigned landmark\'s Task stays visible');
    assert.equal(selected(root, '--local').taskId, 'TK-00AB', 'and next passes it over');
  }));
}

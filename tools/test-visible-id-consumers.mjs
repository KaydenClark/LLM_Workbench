#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import * as workbench from '../workbench/tools/spec-workbench.mjs';
import { newAdr, listAdrs, validateAdrs, writeRegister } from '../workbench/tools/adr.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const version = JSON.parse(fs.readFileSync(path.join(root, 'workbench/manifest.json'))).workbenchVersion;
function room() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'visible-consumers-'));
  const init = spawnSync(process.execPath, [path.join(root, 'workbench/tools/workbench-layout.mjs'), 'init', '--project', dir, '--provenance', 'genesis', '--version', version], { encoding: 'utf8' });
  assert.equal(init.status, 0, init.stdout);
  fs.writeFileSync(path.join(dir, 'AGENTS.md'), '# Rules\n');
  fs.writeFileSync(path.join(dir, 'BLUEPRINT.md'), '# Blueprint\n\n<!-- spec-catalog:start -->\n<!-- spec-catalog:end -->\n');
  fs.writeFileSync(path.join(dir, 'TASKBOARD.md'), '# Taskboard\n\n<!-- hot-specs:start -->\n<!-- hot-specs:end -->\n');
  return dir;
}
function spec(dir, id, tasks = [['TK-001', 'ready', 'none']], status = 'active', slug = 'fixture') {
  const destination = path.join(dir, 'workbench/specs', `${id}-${slug}`, 'SPEC.md');
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, `# ${id} - Identity fixture\n\n**Spec ID:** ${id}\n**Status:** ${status}\n**Priority:** 1\n**Owner:** test\n**Updated:** 2026-09-08\n**Catalog description:** Verify identity consumers.\n**Blockers:** none\n**Latest event:** Fixture created.\n**Next gate:** Verify the slice.\n\n## Vertical Implementation Slices\n\n| Task | Slice | Status | Blockers | Proof |\n|---|---|---|---|---|\n${tasks.map(([task, state, blocker]) => `| ${task} | Verify ${task} | ${state} | ${blocker} | ${state === 'done' ? 'verified fixture' : 'pending'} |`).join('\n')}\n\n## Acceptance Criteria\n\n- [x] Fixture verified.\n\n## Append-Only Evidence And Execution Log\n\n| Date | Task | Event | Verification | Docs | Remaining gap |\n|---|---|---|---|---|---|\n\n## Completion Result\n\nVerified fixture.\n`);
  return destination;
}
function cli(dir, args) {
  const result = spawnSync(process.execPath, [path.join(root, 'workbench/tools/spec-workbench.mjs'), ...args, '--path', dir, '--json'], { encoding: 'utf8' });
  return { ...result, json: result.stdout.trim() ? JSON.parse(result.stdout) : null };
}

test('mixed visible spec/task IDs select, claim, close and render without moving legacy paths', () => {
  const dir = room();
  try {
    const legacy = spec(dir, 'S-010', [['TK-001', 'done', 'none']], 'complete');
    spec(dir, 'S-011', [['TK-001', 'done', 'none']], 'complete');
    const before = fs.readFileSync(legacy);
    const candidate = spec(dir, 'S-00A', [['TK-00A', 'ready', 'none'], ['TK-00B', 'ready', 'TK-00A']]);
    workbench.render(dir);
    assert.equal(workbench.nextWork(dir).specId, 'S-00A');
    assert.equal(workbench.nextWork(dir).taskId, 'TK-00A');
    workbench.claimWork(dir, 'S-00A', { agent: 'test' });
    workbench.closeTask(dir, 'S-00A', { proof: 'Verified public seam', docs: 'Docs checked', remainingGap: 'Second slice' });
    assert.equal(workbench.nextWork(dir).taskId, 'TK-00B');
    assert.equal(workbench.showSpec(dir, 'S-00A').path, path.relative(dir, candidate).split(path.sep).join('/'));
    assert.deepEqual(fs.readFileSync(legacy), before);
    assert.ok(!workbench.doctor(dir).some(issue => ['duplicate-id', 'malformed-spec', 'unstable-path'].includes(issue.code)));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('new task allocation reserves repeated legacy labels across the whole Workbench', () => {
  const dir = room();
  try {
    spec(dir, 'S-001'); spec(dir, 'S-002');
    const before = fs.readFileSync(path.join(dir, 'workbench/specs/S-001-fixture/SPEC.md'));
    const result = cli(dir, ['next-id', 'S-001', '--prefix', 'TK']);
    assert.equal(result.status, 0, result.stdout || result.stderr);
    assert.equal(result.json.id, 'TK-000A');
    assert.equal(result.json.reserved, false, 'read-only proposal does not reserve or create a task');
    assert.deepEqual(fs.readFileSync(path.join(dir, 'workbench/specs/S-001-fixture/SPEC.md')), before);
    assert.equal(cli(dir, ['next-id', '--prefix', 'S']).json.id, 'S-000A');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

for (const collision of ['spec', 'task']) {
  test(`${collision} identity aliases refuse selection without rewriting history`, () => {
    const dir = room();
    try {
      spec(dir, 'S-00A', [['TK-00A', 'ready', 'none']], 'active', 'first');
      spec(dir, collision === 'spec' ? 'S-00a' : 'S-00B', [[collision === 'task' ? 'TK-00a' : 'TK-00B', 'ready', 'none']], 'active', 'second');
      assert.throws(() => workbench.nextWork(dir), /duplicate.*ID|identity collision/i);
      assert.ok(workbench.doctor(dir).some(issue => issue.code === 'duplicate-id'));
    } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  });
}

test('ADR allocation, register and duplicate checks consume mixed labels without renaming old files', () => {
  const dir = room();
  const content = '---\nstatus: proposed\ndate: 2026-09-08\ncanonicalized_in:\n  - AGENTS.md\n---\n\n# A decision\n\nProvenance: fixture.\n';
  try {
    const folder = path.join(dir, 'workbench/docs/adr');
    for (let i = 1; i <= 10; i++) fs.writeFileSync(path.join(folder, `${String(i).padStart(4, '0')}-legacy.md`), content);
    const old = fs.readFileSync(path.join(folder, '0010-legacy.md'));
    const created = newAdr(dir, { title: 'Mixed visible identity', date: '2026-09-08' });
    assert.equal(created.number, '000A');
    writeRegister(dir);
    assert.ok(listAdrs(dir).some(adr => adr.number === '000A'));
    assert.match(fs.readFileSync(path.join(folder, 'HISTORY.md'), 'utf8'), /000A-mixed-visible-identity/);
    assert.deepEqual(fs.readFileSync(path.join(folder, '0010-legacy.md')), old);
    fs.writeFileSync(path.join(folder, '000a-collision.md'), content);
    assert.ok(validateAdrs(dir).some(issue => issue.code === 'invalid-adr' && /used by|collision/.test(issue.message)));
    assert.throws(() => newAdr(dir, { title: 'Refuse collision' }), /collision/i);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('numeric task aliases in different legacy specs reserve one label without blocking a new proposal', () => {
  const dir = room();
  try {
    spec(dir, 'S-001', [['TK-001', 'ready', 'none']]);
    const second = spec(dir, 'S-002', [['TK-0001', 'ready', 'none']]);
    const original = fs.readFileSync(second);
    assert.ok(!workbench.doctor(dir).some(issue => issue.code === 'duplicate-id'));
    const result = cli(dir, ['next-id', 'S-001', '--prefix', 'TK']);
    assert.equal(result.status, 0, result.stdout || result.stderr);
    assert.equal(result.json.id, 'TK-000A');
    assert.deepEqual(fs.readFileSync(second), original);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

for (const kind of ['symlink', 'dangling-symlink', 'directory', 'hardlink']) {
  test(`nonordinary ADR name (${kind}) is diagnosed and blocks allocation without following it`, () => {
    const dir = room();
    try {
      const folder = path.join(dir, 'workbench/docs/adr');
      const target = path.join(dir, 'target.md');
      fs.writeFileSync(target, 'Original bytes');
      const occupied = path.join(folder, '000A-existing.md');
      if (kind === 'directory') fs.mkdirSync(occupied);
      else if (kind === 'hardlink') fs.linkSync(target, occupied);
      else fs.symlinkSync(kind === 'symlink' ? target : path.join(dir, 'absent.md'), occupied);
      const before = fs.readdirSync(folder);
      assert.ok(validateAdrs(dir).some(issue => issue.code === 'invalid-adr' && /ordinary|unsafe|link/i.test(issue.message)), 'unsafe identity inventory is visible');
      assert.throws(() => newAdr(dir, { title: 'Must refuse' }), /ordinary|unsafe|link/i);
      assert.deepEqual(fs.readdirSync(folder), before);
      assert.equal(fs.readFileSync(target, 'utf8'), 'Original bytes');
    } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  });
}
test('next and claim agree for out-of-order mixed ready task labels', () => {
 const dir=room();
 try {
  spec(dir, 'S-00A', [['TK-010','ready','none'],['TK-00A','ready','none']]);
  const selected=workbench.nextWork(dir);
  const claimed=workbench.claimWork(dir, selected.specId, {agent:'test'});
  assert.equal(claimed.tasks.find(task=>task.status==='in-progress').id, selected.taskId);
 } finally {fs.rmSync(dir,{recursive:true,force:true});}
});

// S-01W TK-02B: the public `next-id` routes propose uppercase width-four
// labels under one shared artifact policy, reserve every existing spelling,
// and leave legacy records exactly where and as they were.
function snapshot(dir) {
  const specsDir = path.join(dir, 'workbench/specs');
  const files = new Map();
  const walk = (folder) => {
    for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
      const full = path.join(folder, entry.name);
      if (entry.isDirectory()) walk(full);
      else files.set(path.relative(dir, full), fs.readFileSync(full));
    }
  };
  walk(specsDir);
  return files;
}
const EARLY_LETTERS = [...'ABCDEFGHIJKLMNOP'];

test('next-id proposes uppercase width-four Spec and Task labels in a numeric legacy room', () => {
  const dir = room();
  try {
    spec(dir, 'S-001', [['TK-001', 'done', 'none']], 'complete');
    spec(dir, 'S-002', [['TK-001', 'ready', 'none'], ['TK-002', 'ready', 'none']]);
    const before = snapshot(dir);
    const specId = cli(dir, ['next-id', '--prefix', 'S']);
    assert.equal(specId.status, 0, specId.stdout || specId.stderr);
    assert.deepEqual(specId.json, { status: 'proposed', id: 'S-000A', reserved: false });
    const taskId = cli(dir, ['next-id', 'S-002', '--prefix', 'TK']);
    assert.equal(taskId.status, 0, taskId.stdout || taskId.stderr);
    assert.deepEqual(taskId.json, { status: 'proposed', id: 'TK-000A', reserved: false, specId: 'S-002' });
    assert.deepEqual(snapshot(dir), before, 'a proposal leaves every legacy path and byte unchanged');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

for (const [occupiedSpelling, label] of [['00Q', 'short'], ['000Q', 'widened']]) {
  test(`next-id treats a ${label} legacy label as occupying every spelling of that identity`, () => {
    const dir = room();
    try {
      spec(dir, 'S-001', [...EARLY_LETTERS.map(letter => [`TK-00${letter}`, 'done', 'none']), [`TK-${occupiedSpelling}`, 'done', 'none']], 'complete');
      for (const letter of EARLY_LETTERS) spec(dir, `S-00${letter}`, [['TK-001', 'done', 'none']], 'complete', `legacy-${letter.toLowerCase()}`);
      spec(dir, `S-${occupiedSpelling}`, [['TK-001', 'ready', 'none']], 'active', 'occupied');
      const before = snapshot(dir);
      const specId = cli(dir, ['next-id', '--prefix', 'S']);
      assert.equal(specId.status, 0, specId.stdout || specId.stderr);
      assert.equal(specId.json.id, 'S-000R');
      const taskId = cli(dir, ['next-id', `S-${occupiedSpelling}`, '--prefix', 'TK']);
      assert.equal(taskId.status, 0, taskId.stdout || taskId.stderr);
      assert.equal(taskId.json.id, 'TK-000R');
      assert.equal(taskId.json.reserved, false);
      assert.deepEqual(snapshot(dir), before);
    } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  });
}

test('next-id treats a lowercase legacy label as occupying its uppercase identity', () => {
  const dir = room();
  try {
    spec(dir, 'S-00a', [['TK-00a', 'ready', 'none']]);
    assert.equal(cli(dir, ['next-id', '--prefix', 'S']).json.id, 'S-000B');
    assert.equal(cli(dir, ['next-id', 'S-00a', '--prefix', 'TK']).json.id, 'TK-000B');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

for (const collision of ['spec', 'task']) {
  test(`next-id refuses duplicate ${collision} records that alias one identity instead of choosing a winner`, () => {
    const dir = room();
    try {
      spec(dir, 'S-00Q', [[collision === 'task' ? 'TK-00Q' : 'TK-001', 'ready', 'none']], 'active', 'short');
      spec(dir, collision === 'spec' ? 'S-000Q' : 'S-00R', [[collision === 'task' ? 'TK-000Q' : 'TK-001', 'ready', 'none']], 'active', 'widened');
      const before = snapshot(dir);
      const specId = cli(dir, ['next-id', '--prefix', 'S']);
      assert.notEqual(specId.status, 0);
      assert.match(specId.stderr + specId.stdout, /duplicate/i);
      const taskId = cli(dir, ['next-id', 'S-00Q', '--prefix', 'TK']);
      assert.notEqual(taskId.status, 0);
      assert.match(taskId.stderr + taskId.stdout, /duplicate/i);
      assert.deepEqual(snapshot(dir), before);
    } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  });
}

// S-01W TK-002K: every supported spelling of one identity - short `S-00Q`,
// widened `S-000Q` and a case variant sharing the collision key - reaches the
// one stored record through the public Spec and Task selectors. Output names
// the stored ID and path, nothing is renamed, and a key that two stored
// records share refuses by name instead of choosing a winner.
function relative(dir, file) { return path.relative(dir, file).split(path.sep).join('/'); }
function retiredSpec(dir, id, slug = 'retired') {
  const active = spec(dir, id, [['TK-001', 'done', 'none']], 'complete', slug);
  const destination = path.join(dir, 'workbench/specs/retired', path.basename(path.dirname(active)), 'SPEC.md');
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.renameSync(active, destination);
  fs.rmdirSync(path.dirname(active));
  return destination;
}

test('widened, short and case-variant Spec selectors show, claim and close the one stored record', () => {
  const dir = room();
  try {
    const stored = spec(dir, 'S-00Q', [['TK-00A', 'ready', 'none'], ['TK-00B', 'ready', 'TK-000A']]);
    workbench.render(dir);
    const names = () => [...snapshot(dir).keys()].sort();
    const paths = names();
    const before = snapshot(dir);
    for (const selector of ['S-00Q', 'S-000Q', 'S-00q', 'S-0000q']) {
      const shown = cli(dir, ['show', selector]);
      assert.equal(shown.status, 0, `show ${selector}: ${shown.stderr}`);
      assert.equal(shown.json.id, 'S-00Q', `show ${selector} reports the stored ID`);
      assert.equal(shown.json.path, relative(dir, stored), `show ${selector} reports the stored path`);
    }
    assert.deepEqual(snapshot(dir), before, 'show changes no record bytes or paths');
    const proposed = cli(dir, ['next-id', 'S-000Q', '--prefix', 'TK']);
    assert.equal(proposed.status, 0, proposed.stderr);
    assert.equal(proposed.json.specId, 'S-00Q', 'a widened parent selector proposes under the stored Spec ID');
    const claimed = cli(dir, ['claim', 'S-000Q', '--agent', 'test']);
    assert.equal(claimed.status, 0, claimed.stderr);
    assert.equal(claimed.json.id, 'S-00Q');
    assert.equal(claimed.json.path, relative(dir, stored));
    assert.equal(claimed.json.tasks.find(task => task.status === 'in-progress').id, 'TK-00A');
    const closed = cli(dir, ['close', 'S-00q', '--proof', 'Verified public seam', '--docs', 'Docs checked', '--remaining-gap', 'TK-00B']);
    assert.equal(closed.status, 0, closed.stderr);
    assert.equal(closed.json.id, 'S-00Q');
    assert.equal(closed.json.path, relative(dir, stored));
    assert.equal(closed.json.tasks.find(task => task.id === 'TK-00A').status, 'done');
    const content = fs.readFileSync(stored, 'utf8');
    assert.match(content, /\*\*Spec ID:\*\* S-00Q\n/, 'the stored identity is not rewritten to the selector spelling');
    assert.match(content, /\| \d{4}-\d{2}-\d{2} \| TK-00A \| Task closed \|/, 'evidence names the stored Task ID');
    const next = cli(dir, ['next']);
    assert.equal(next.status, 0, next.stderr);
    assert.equal(next.json?.taskId, 'TK-00B', 'a widened blocker spelling (TK-000A) is satisfied by the stored done Task TK-00A');
    assert.deepEqual(names(), paths, 'no record path was renamed or added');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('a widened Spec blocker spelling is satisfied by the completed stored Spec', () => {
  const dir = room();
  try {
    spec(dir, 'S-00P', [['TK-001', 'done', 'none']], 'complete', 'done');
    spec(dir, 'S-00R', [['TK-00A', 'ready', 'S-000P']], 'active', 'waiting');
    const next = cli(dir, ['next']);
    assert.equal(next.status, 0, next.stderr);
    assert.equal(next.json?.specId, 'S-00R');
    assert.equal(next.json?.taskId, 'TK-00A');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('two active records sharing one collision key refuse show, claim and close by name', () => {
  const dir = room();
  try {
    spec(dir, 'S-00Q', [['TK-001', 'ready', 'none']], 'active', 'short');
    spec(dir, 'S-000Q', [['TK-001', 'ready', 'none']], 'active', 'widened');
    const before = snapshot(dir);
    for (const args of [['show', 'S-000Q'], ['claim', 'S-00Q', '--agent', 'test'], ['close', 'S-00q', '--proof', 'p', '--docs', 'd', '--remaining-gap', 'g']]) {
      const result = cli(dir, args);
      assert.notEqual(result.status, 0, `${args[0]} must refuse`);
      assert.match(result.stderr, /duplicate spec ID/i);
      assert.match(result.stderr, /S-00Q/);
      assert.match(result.stderr, /S-000Q/);
    }
    assert.deepEqual(snapshot(dir), before);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('an active record and a retired record sharing one key refuse selection by name while allocation folds them as occupied', () => {
  const dir = room();
  try {
    const active = spec(dir, 'S-00Q', [['TK-00A', 'ready', 'none']], 'active', 'short');
    const retired = retiredSpec(dir, 'S-000Q', 'widened');
    const before = snapshot(dir);
    for (const args of [['show', 'S-00Q'], ['show', 'S-000Q'], ['claim', 'S-000Q', '--agent', 'test'], ['close', 'S-00Q', '--proof', 'p', '--docs', 'd', '--remaining-gap', 'g'], ['next-id', 'S-00Q', '--prefix', 'TK']]) {
      const result = cli(dir, args);
      assert.notEqual(result.status, 0, `${args.join(' ')} must refuse rather than choose the active or retired record`);
      assert.match(result.stderr, /duplicate spec ID/i);
      assert.ok(result.stderr.includes(relative(dir, active)) && result.stderr.includes(relative(dir, retired)), `${args[0]} names both stored records: ${result.stderr}`);
    }
    const proposal = cli(dir, ['next-id', '--prefix', 'S']);
    assert.equal(proposal.status, 0, proposal.stderr);
    assert.notEqual(proposal.json.id, 'S-000Q', 'allocation keeps treating the shared key as occupied');
    assert.ok(workbench.doctor(dir).some(issue => issue.code === 'duplicate-id'), 'doctor still diagnoses the pair');
    assert.deepEqual(snapshot(dir), before);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('numeric historical Task labels keep Spec-qualified scope under widened selectors and blockers', () => {
  const dir = room();
  try {
    spec(dir, 'S-001', [['TK-001', 'done', 'none']], 'complete', 'first');
    const second = spec(dir, 'S-002', [['TK-001', 'ready', 'none'], ['TK-002', 'ready', 'TK-0001']], 'active', 'second');
    let next = cli(dir, ['next']);
    assert.equal(next.json?.specId, 'S-002');
    assert.equal(next.json?.taskId, 'TK-001', "S-001's done TK-001 does not satisfy S-002's TK-0001 blocker");
    assert.equal(cli(dir, ['claim', 'S-0002', '--agent', 'test']).status, 0);
    const closed = cli(dir, ['close', 'S-0002', '--proof', 'Verified', '--docs', 'Docs checked', '--remaining-gap', 'TK-002']);
    assert.equal(closed.status, 0, closed.stderr);
    assert.equal(closed.json.path, relative(dir, second));
    next = cli(dir, ['next']);
    assert.equal(next.json?.specId, 'S-002');
    assert.equal(next.json?.taskId, 'TK-002', "S-002's own done TK-001 satisfies its TK-0001 blocker");
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('an orphan corrective Task claims by a widened spelling of its stored ID', () => {
  const dir = room();
  try {
    const record = path.join(dir, 'workbench/specs/corrective/tasks/TK-00X/TASK.md');
    fs.mkdirSync(path.dirname(record), { recursive: true });
    fs.writeFileSync(record, '# TK-00X - Corrective fixture\n\n**Task ID:** TK-00X\n**Spec ID:** S-00D\n**Slice:** Corrective fixture\n**Status:** ready\n**Blockers:** none\n**Destination:** wiki-claim: workbench/wiki/fixture.md#Claim\n');
    const claimed = cli(dir, ['claim', 'TK-000x', '--agent', 'test']);
    assert.equal(claimed.status, 0, claimed.stderr);
    assert.equal(claimed.json.taskId, 'TK-00X', 'the claim reports the stored Task ID');
    assert.match(fs.readFileSync(record, 'utf8'), /\*\*Task ID:\*\* TK-00X\n[\s\S]*\*\*Status:\*\* in-progress/);
    assert.ok(fs.existsSync(record), 'the record keeps its stored path');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

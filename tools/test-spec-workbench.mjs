#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync, spawnSync } from 'node:child_process';
import {
  TASK_STATUSES as SLICE_STATUSES,
  SPEC_LIFECYCLE_FOLDERS,
  claimWork,
  convertSpecSlices,
  showSpec,
  closeTask,
  completeSpec,
  doctor,
  loadRetiredSpecs,
  loadSpecs,
  moveSpecDirectory,
  nextWork,
  parseCliArgs,
  receiptTask,
  render,
  scanReferences
} from '../workbench/tools/spec-workbench.mjs';
import { parseSpecPacket } from '../workbench/tools/spec-packet.mjs';
import { TASK_STATUSES, listTaskRecords, readTaskRecord, taskStatus, unmetBlockers } from '../workbench/tools/task-record.mjs';
import { assembleTaskPacket } from '../workbench/tools/task-packet.mjs';
import { appendReceiptRowToContent, readReceiptFromFile } from '../workbench/tools/task-receipt.mjs';

// A record-backed Spec's `close` now appends a Receipt row, which reads live
// Git facts (branch, HEAD SHA, upstream, dirty count) for the working tree
// named by the room's own root. Every fixture room that closes a Task record
// therefore needs to be a real, minimally-committed Git work tree first; a
// plain temp directory has none of that for Git to read.
function initGitRoot(dir) {
  execFileSync('git', ['init', '--quiet', dir]);
  execFileSync('git', ['-C', dir, 'config', 'user.email', 'fixture@example.com']);
  execFileSync('git', ['-C', dir, 'config', 'user.name', 'Fixture']);
  execFileSync('git', ['-C', dir, 'commit', '--quiet', '--allow-empty', '-m', 'init']);
}

// One closed status vocabulary, not two: `spec-workbench.mjs` held its own
// separately-named closed status set beside the record reader's
// TASK_STATUSES, so a status added to one silently stayed invalid to the
// other.
assert.ok(
  Object.is(SLICE_STATUSES, TASK_STATUSES),
  'the lifecycle commands and the Task record reader share one exported closed status set'
);
assert.deepEqual([...TASK_STATUSES], ['ready', 'in-progress', 'blocked', 'done', 'deferred']);

assert.deepEqual(
  parseCliArgs(['next', '--json']),
  { command: 'next', id: null, options: { json: true } },
  'option flags must not be consumed as an optional spec ID'
);

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-workbench-'));
initGitRoot(root);
try {
  write('BLUEPRINT.md', [
    '# Fixture Blueprint',
    '',
    '<!-- spec-catalog:start -->',
    '<!-- spec-catalog:end -->'
  ].join('\n'));
  write('TASKBOARD.md', [
    '# Fixture Taskboard',
    '',
    '<!-- hot-specs:start -->',
    '<!-- hot-specs:end -->'
  ].join('\n'));
  write('specs/S-001-fixture/SPEC.md', fixtureSpec());

  const next = nextWork(root);
  assert.equal(next.specId, 'S-001');
  assert.equal(next.taskId, 'TK-001');

  claimWork(root, 'S-001', { agent: 'codex', date: '2026-07-12' });
  assert.match(read('specs/S-001-fixture/SPEC.md'), /\| TK-001 \| First slice \| in-progress \|/);
  assert.equal(nextWork(root).status, 'in-progress', 'next should resume claimed work before selecting new work');

  assert.throws(
    () => completeSpec(root, 'S-001', { date: '2026-07-12' }),
    /unfinished slice|unchecked acceptance/i,
    'a spec must not complete before its task and acceptance gates'
  );

  const closed = closeTask(root, 'S-001', {
    proof: 'node test | tee proof.log',
    docs: 'Docs checked; no update needed',
    remainingGap: 'none',
    date: '2026-07-12'
  });
  assert.equal(closed.tasks[0].proof, 'node test | tee proof.log', 'task proof should round-trip a literal pipe');
  assert.equal(
    read('specs/S-001-fixture/SPEC.md').split('node test \\| tee proof.log').length - 1,
    2,
    'task proof and appended evidence should persist escaped Markdown pipes'
  );
  let completedCandidate = read('specs/S-001-fixture/SPEC.md')
    .replace('- [ ] Expected behavior is verified.', '- [x] Expected behavior is verified.')
    .replace('## Completion Result\n\nPending.', '## Completion Result\n\nPass: fixture lifecycle completed.');
  fs.writeFileSync(path.join(root, 'specs/S-001-fixture/SPEC.md'), completedCandidate);
  completeSpec(root, 'S-001', { date: '2026-07-12' });
  render(root);

  assert.match(read('BLUEPRINT.md'), /S-001-fixture\/SPEC\.md/);
  assert.doesNotMatch(read('TASKBOARD.md'), /S-001/,
    'completed specs must disappear from the hot board');
  assert.equal(nextWork(root), null, 'completed work must not be returned as eligible');
  assert.deepEqual(doctor(root), [], 'a rendered valid repository should pass doctor');
  // S-00A: destination prose is never a generated catalog target.
  const savedBlueprint = read('BLUEPRINT.md');
  write('BLUEPRINT.md', '# Destination\n\nDesired finished product.\n');
  render(root);
  assert.equal(read('BLUEPRINT.md'), '# Destination\n\nDesired finished product.\n');
  assert.match(read('specs/CATALOG.md'), /S-001-fixture/);
  assert.deepEqual(doctor(root), []);
  write('BLUEPRINT.md', savedBlueprint);


  fs.writeFileSync(
    path.join(root, 'BLUEPRINT.md'),
    read('BLUEPRINT.md').replaceAll('\n', '\r\n')
  );
  fs.writeFileSync(
    path.join(root, 'TASKBOARD.md'),
    read('TASKBOARD.md').replaceAll('\n', '\r\n')
  );
  assert.deepEqual(
    doctor(root),
    [],
    'equivalent CRLF generated regions should pass doctor on Windows checkouts'
  );
  render(root);

  write(
    'specs/S-002-blocked/SPEC.md',
    fixtureSpec().replaceAll('S-001', 'S-002').replace('| TK-001 | First slice | ready | none |', '| TK-001 | First slice | ready | S-999 |')
  );
  assert.throws(
    () => claimWork(root, 'S-002', { agent: 'codex', date: '2026-07-12' }),
    /blocked-slice|no eligible ready task/i,
    'direct claim must not bypass declared blockers'
  );
  fs.rmSync(path.join(root, 'specs/S-002-blocked'), { recursive: true });

  const validCompleted = read('specs/S-001-fixture/SPEC.md');
  fs.writeFileSync(
    path.join(root, 'specs/S-001-fixture/SPEC.md'),
    validCompleted.replace('| TK-001 | First slice | done |', '| TK-001 | First slice | in-progress |')
      .replace('**Updated:** 2026-07-12', '**Updated:** 2026-07-10')
  );
  assert.ok(doctor(root, { today: '2026-07-12' }).some((issue) => issue.code === 'contradictory-state'));
  assert.ok(doctor(root, { today: '2026-07-12' }).some((issue) => issue.code === 'stale-claim'));
  fs.writeFileSync(path.join(root, 'specs/S-001-fixture/SPEC.md'), validCompleted);

  fs.writeFileSync(
    path.join(root, 'specs/S-001-fixture/SPEC.md'),
    validCompleted.replace('node test \\| tee proof.log', 'pending')
  );
  assert.ok(doctor(root).some((issue) => issue.code === 'missing-evidence'));
  fs.writeFileSync(path.join(root, 'specs/S-001-fixture/SPEC.md'), validCompleted);

  const malformed = validCompleted.replace(
    '| TK-001 | First slice | done | none | node test \\| tee proof.log |',
    '| TK-001 | First slice | in-progress | none | broken | extra |'
  );
  fs.writeFileSync(path.join(root, 'specs/S-001-fixture/SPEC.md'), malformed);
  assert.throws(
    () => closeTask(root, 'S-001', {
      proof: 'must not persist',
      docs: 'Docs checked; no update needed',
      remainingGap: 'none',
      date: '2026-07-12'
    }),
    /malformed task row/,
    'malformed task rows should be reported explicitly'
  );
  assert.equal(
    read('specs/S-001-fixture/SPEC.md'),
    malformed,
    'a rejected malformed row must not partially persist a close operation'
  );
  fs.writeFileSync(path.join(root, 'specs/S-001-fixture/SPEC.md'), validCompleted);

  fs.writeFileSync(
    path.join(root, 'TASKBOARD.md'),
    read('TASKBOARD.md').replace('No active slice', 'Stale active state')
  );
  assert.ok(doctor(root).some((issue) => issue.code === 'render-drift'));
  render(root);

  // The recorded baseline states. `green` and `red` are what a baseline run
  // produces; `unavailable` records that no baseline could be taken at all, for
  // a reason the requested change cannot affect. Its reason set is closed.
  const baselineSpec = (id, baseline) => fixtureSpec()
    .replaceAll('S-001', id)
    .replace('**Blockers:** none', `**Baseline:** ${baseline}\n**Blockers:** none`);
  const packetAt = (relative) => parseSpecPacket(read(relative), path.join(root, relative), root);

  assert.equal(packetAt('specs/S-001-fixture/SPEC.md').baseline, null,
    'a spec that records no baseline keeps parsing as it did before');

  write(
    'specs/S-101-unavailable/SPEC.md',
    baselineSpec('S-101', 'unavailable (host-restricted) - the runner refuses to spawn a child process (spawn EPERM); the requested change is not implicated')
  );
  render(root);
  const unavailable = packetAt('specs/S-101-unavailable/SPEC.md').baseline;
  assert.equal(unavailable.state, 'unavailable');
  assert.equal(unavailable.reason, 'host-restricted');
  assert.match(unavailable.evidence, /spawn EPERM/);
  assert.equal(unavailable.proceeds, true, 'a baseline recorded unavailable with a valid reason proceeds');
  assert.deepEqual(doctor(root), [], 'a recorded unavailable baseline is a valid packet, not a malformed one');
  assert.equal(nextWork(root).specId, 'S-101', 'work proceeds against a recorded unavailable baseline');

  write('specs/S-102-red/SPEC.md', baselineSpec('S-102', 'red - two suite failures predate this work'));
  render(root);
  const red = packetAt('specs/S-102-red/SPEC.md').baseline;
  assert.equal(red.state, 'red');
  assert.equal(red.proceeds, false, 'a red baseline still stops without an explicit owner expansion');
  assert.match(red.stop, /expands the task/);
  write('specs/S-102-red/SPEC.md', baselineSpec('S-102', 'red (owner-expanded) - the owner expanded the task to repair the two failures'));
  assert.equal(packetAt('specs/S-102-red/SPEC.md').baseline.proceeds, true,
    'only an explicit owner expansion lets a red baseline proceed');

  write('specs/S-103-free-text/SPEC.md', baselineSpec('S-103', 'unavailable (too-slow-today) - a reason of the room\'s own invention'));
  assert.throws(
    () => packetAt('specs/S-103-free-text/SPEC.md'),
    /baseline reason vocabulary/,
    'a reason outside the closed vocabulary is refused rather than accepted as free text'
  );
  assert.ok(doctor(root).some((issue) => issue.code === 'malformed-spec'),
    'doctor refuses a packet whose baseline reason is outside the closed vocabulary');
  write('specs/S-103-free-text/SPEC.md', baselineSpec('S-103', 'unavailable (host-restricted)'));
  assert.throws(() => packetAt('specs/S-103-free-text/SPEC.md'), /evidence/,
    'an unavailable baseline must carry the evidence for its reason');
  write('specs/S-103-free-text/SPEC.md', baselineSpec('S-103', 'unknown'));
  assert.throws(() => packetAt('specs/S-103-free-text/SPEC.md'), /baseline state/,
    'the baseline state vocabulary is closed');
  for (const dir of ['specs/S-101-unavailable', 'specs/S-102-red', 'specs/S-103-free-text']) {
    fs.rmSync(path.join(root, dir), { recursive: true });
  }
  render(root);

  write('specs/S-999-duplicate/SPEC.md', fixtureSpec());
  assert.ok(doctor(root).some((issue) => issue.code === 'duplicate-id'));
  fs.rmSync(path.join(root, 'specs/S-999-duplicate'), { recursive: true });

  // S-00H TK-001: a standalone Task record reads its own state and blocking
  // relationships through an exported function, one directory per Task
  // beneath its owning Spec's directory. `next`/`claim`/`close`/`render`/
  // `doctor` still read only the embedded slice table (TK-002 migrates
  // them), so a room carrying both must behave exactly as a table-only room
  // and must not double-count the coexisting record.
  write('specs/S-201-task-record/SPEC.md', fixtureSpec().replaceAll('S-001', 'S-201'));
  render(root);
  const beforeTaskDir = nextWork(root);
  assert.equal(beforeTaskDir.specId, 'S-201', 'a room with only the embedded table selects as before');
  assert.deepEqual(doctor(root), [], 'doctor is clean before any standalone Task record exists');

  write('specs/S-201-task-record/tasks/TK-001/TASK.md', taskRecordFixture({
    id: 'TK-001',
    specId: 'S-201',
    slice: 'First slice',
    status: 'ready',
    blockers: 'none',
    destination: 'spec-acceptance: S-201 Acceptance Criteria item 1'
  }));
  // TK-001 asserted here that a coexisting record left embedded-table
  // selection untouched, because nothing yet read the record. TK-002 gives a
  // Spec one source of slice truth, so this exact shape - a live table row
  // and a record for TK-001 - is now refused by name. The property TK-001
  // protected is preserved and strengthened: the record is still never a
  // second candidate, and now nobody can read past the contradiction either.
  assert.throws(
    () => nextWork(root),
    /S-201 carries both a slice-table row and a Task record for TK-001/,
    'a coexisting row and record is refused, never counted as a second candidate'
  );
  assert.ok(
    doctor(root).some((issue) => issue.code === 'row-record-collision' && /TK-001/.test(issue.message)),
    'doctor reports the contradiction instead of selecting past it'
  );

  // The collision is one finding among many, not a reason doctor aborts the
  // rest of the room: with an unrelated render-drift condition present at the
  // same time, both findings surface together.
  const cleanBoard = read('TASKBOARD.md');
  fs.writeFileSync(path.join(root, 'TASKBOARD.md'), cleanBoard.replace('No active slice', 'Stale active state'));
  const withCollisionAndDrift = doctor(root);
  assert.ok(withCollisionAndDrift.some((issue) => issue.code === 'row-record-collision'),
    'the collision finding survives alongside an unrelated finding');
  assert.ok(withCollisionAndDrift.some((issue) => issue.code === 'render-drift'),
    'a row/record collision on one spec does not hide an unrelated render-drift finding on the board');
  fs.writeFileSync(path.join(root, 'TASKBOARD.md'), cleanBoard);

  const taskPath = path.join(root, 'specs/S-201-task-record/tasks/TK-001/TASK.md');
  const record = readTaskRecord(taskPath, root);
  assert.equal(record.id, 'TK-001');
  assert.equal(record.specId, 'S-201');
  assert.equal(record.slice, 'First slice');
  assert.equal(taskStatus(record), 'ready', 'status is read through the one function S-00I can later repoint');
  assert.deepEqual(record.blockers, []);
  assert.deepEqual(record.destination, { type: 'spec-acceptance', reference: 'S-201 Acceptance Criteria item 1' });

  const listed = listTaskRecords(path.join(root, 'specs/S-201-task-record'), root);
  assert.equal(listed.length, 1, 'listing finds exactly the one standalone record, not a second copy from the table');
  assert.equal(listed[0].id, 'TK-001');

  // A Task record whose declared Task ID contradicts its own directory name
  // must be refused, not silently returned under the folder's name.
  write('specs/S-202-task-listing/tasks/TK-001/TASK.md', taskRecordFixture({
    id: 'TK-001', specId: 'S-202', slice: 'Real one', status: 'ready', blockers: 'none',
    destination: 'spec-acceptance: placeholder'
  }));
  write('specs/S-202-task-listing/tasks/TK-009/TASK.md', taskRecordFixture({
    id: 'TK-001', specId: 'S-202', slice: 'Impostor', status: 'ready', blockers: 'none',
    destination: 'spec-acceptance: placeholder'
  }));
  assert.throws(
    () => listTaskRecords(path.join(root, 'specs/S-202-task-listing'), root),
    /directory is named "TK-009"/,
    'a Task ID that contradicts its own directory name is refused, not returned twice under two names'
  );
  fs.rmSync(path.join(root, 'specs/S-202-task-listing/tasks/TK-009'), { recursive: true });

  // Two self-consistent records (folder name matches declared id) whose ids
  // still resolve to the same visible identifier (leading-zero variants)
  // must be refused as a duplicate rather than both returned.
  write('specs/S-202-task-listing/tasks/TK-1/TASK.md', taskRecordFixture({
    id: 'TK-1', specId: 'S-202', slice: 'Same identity, different spelling', status: 'ready', blockers: 'none',
    destination: 'spec-acceptance: placeholder'
  }));
  assert.throws(
    () => listTaskRecords(path.join(root, 'specs/S-202-task-listing'), root),
    /Duplicate Task ID/,
    'two records resolving to the same visible identifier are refused rather than both returned'
  );
  fs.rmSync(path.join(root, 'specs/S-202-task-listing/tasks/TK-1'), { recursive: true });

  // A Task-shaped directory with no TASK.md is refused rather than silently
  // skipped, since a listing that quietly drops it would look identical to
  // one where the Task never existed.
  write('specs/S-202-task-listing/tasks/TK-011/NOTES.md', '# scratch notes, no TASK.md here\n');
  assert.throws(
    () => listTaskRecords(path.join(root, 'specs/S-202-task-listing'), root),
    /has no TASK\.md/,
    'a Task directory with no TASK.md fails closed instead of being silently skipped'
  );
  fs.rmSync(path.join(root, 'specs/S-202-task-listing'), { recursive: true });

  // Blocking relationships, read through an exported function.
  write('specs/S-201-task-record/tasks/TK-001/TASK.md', taskRecordFixture({
    id: 'TK-001',
    specId: 'S-201',
    slice: 'First slice',
    status: 'blocked',
    blockers: 'TK-000',
    destination: 'spec-acceptance: S-201 Acceptance Criteria item 1'
  }));
  const blockedRecord = readTaskRecord(taskPath, root);
  assert.deepEqual(unmetBlockers(blockedRecord, []), ['TK-000'], 'an unmet blocker is reported until its id is satisfied');
  assert.deepEqual(unmetBlockers(blockedRecord, ['TK-000']), [], 'a satisfied blocker id clears the record');

  // A corrective Task's destination may name a reconciled Wiki claim instead
  // of Spec acceptance lines; this slice only needs the field to hold it.
  write('specs/S-201-task-record/tasks/TK-002/TASK.md', taskRecordFixture({
    id: 'TK-002',
    specId: 'S-201',
    slice: 'Corrective repair',
    status: 'ready',
    blockers: 'none',
    destination: 'wiki-claim: workbench/wiki/design-concepts/example.md#claim-1'
  }));
  const corrective = readTaskRecord(path.join(root, 'specs/S-201-task-record/tasks/TK-002/TASK.md'), root);
  assert.deepEqual(corrective.destination, { type: 'wiki-claim', reference: 'workbench/wiki/design-concepts/example.md#claim-1' });

  // Explicit errors on a malformed record; no silent fallback to the table.
  // One assertion per validated shape, so mutation testing cannot delete a
  // branch (the Task-ID check, the required-field loop, the Spec-ID check,
  // the blocker-id check, or the Destination pattern) without a test going
  // red. See this slice's return for the manual comment-out checks run
  // against the Task-ID check and the required-field loop.
  write('specs/S-201-task-record/tasks/TK-003/TASK.md', taskRecordFixture({
    id: 'TK-003',
    specId: 'S-201',
    slice: 'Malformed',
    status: 'unstoppable',
    blockers: 'none',
    destination: 'spec-acceptance: placeholder'
  }));
  assert.throws(
    () => readTaskRecord(path.join(root, 'specs/S-201-task-record/tasks/TK-003/TASK.md'), root),
    /invalid status/i,
    'a malformed Task record fails closed rather than silently falling back to the embedded table'
  );

  write('specs/S-201-task-record/tasks/TK-004/TASK.md', [
    '# TK-004 - Missing field',
    '',
    '**Task ID:** TK-004',
    '**Spec ID:** S-201',
    '**Slice:** Missing field',
    '**Status:** ready',
    '**Destination:** spec-acceptance: placeholder',
    ''
  ].join('\n'));
  assert.throws(
    () => readTaskRecord(path.join(root, 'specs/S-201-task-record/tasks/TK-004/TASK.md'), root),
    /is missing Blockers/,
    'a Task record missing a required field fails closed'
  );

  write('specs/S-201-task-record/tasks/TK-005/TASK.md', taskRecordFixture({
    id: 'TASK-005', specId: 'S-201', slice: 'Invalid task id', status: 'ready', blockers: 'none',
    destination: 'spec-acceptance: placeholder'
  }));
  assert.throws(
    () => readTaskRecord(path.join(root, 'specs/S-201-task-record/tasks/TK-005/TASK.md'), root),
    /invalid or missing Task ID/,
    'an invalid Task ID fails closed'
  );

  write('specs/S-201-task-record/tasks/TK-006/TASK.md', taskRecordFixture({
    id: 'TK-006', specId: 'S-1', slice: 'Invalid spec id', status: 'ready', blockers: 'none',
    destination: 'spec-acceptance: placeholder'
  }));
  assert.throws(
    () => readTaskRecord(path.join(root, 'specs/S-201-task-record/tasks/TK-006/TASK.md'), root),
    /invalid Spec ID/,
    'an invalid Spec ID fails closed'
  );

  write('specs/S-201-task-record/tasks/TK-007/TASK.md', taskRecordFixture({
    id: 'TK-007', specId: 'S-201', slice: 'Invalid blocker', status: 'ready', blockers: 'ABC-1',
    destination: 'spec-acceptance: placeholder'
  }));
  assert.throws(
    () => readTaskRecord(path.join(root, 'specs/S-201-task-record/tasks/TK-007/TASK.md'), root),
    /invalid blocker id/,
    'an invalid blocker id fails closed'
  );

  write('specs/S-201-task-record/tasks/TK-008/TASK.md', taskRecordFixture({
    id: 'TK-008', specId: 'S-201', slice: 'Malformed destination', status: 'ready', blockers: 'none',
    destination: 'nowhere: placeholder'
  }));
  assert.throws(
    () => readTaskRecord(path.join(root, 'specs/S-201-task-record/tasks/TK-008/TASK.md'), root),
    /unreadable Destination/,
    'a malformed Destination fails closed'
  );

  // A duplicated field matters once TK-006 appends Receipt rows into the
  // body: a second `**Status:**` line must not silently last-win.
  write('specs/S-201-task-record/tasks/TK-010/TASK.md', [
    '# TK-010 - Duplicated field',
    '',
    '**Task ID:** TK-010',
    '**Spec ID:** S-201',
    '**Slice:** Duplicated field',
    '**Status:** ready',
    '**Status:** done',
    '**Blockers:** none',
    '**Destination:** spec-acceptance: placeholder',
    ''
  ].join('\n'));
  assert.throws(
    () => readTaskRecord(path.join(root, 'specs/S-201-task-record/tasks/TK-010/TASK.md'), root),
    /duplicated field "Status"/,
    'a duplicated field fails closed rather than letting the later occurrence silently win'
  );

  // S-00H TK-002: the four coverage notes the TK-001 review left. Three assert
  // a branch TK-001 wrote but never exercised; the fourth is an ordering
  // defect `localeCompare` hid, since it sorts TK-10 ahead of TK-2.
  assert.equal(
    readTaskRecord(taskPath).relativePath,
    null,
    'a record read with no declared root reports no relative path rather than guessing one from its own directory'
  );

  for (const id of ['TK-2', 'TK-10']) {
    write(`specs/S-203-coverage/tasks/${id}/TASK.md`, taskRecordFixture({
      id, specId: 'S-203', slice: `Slice ${id}`, status: 'ready', blockers: 'none',
      destination: 'spec-acceptance: placeholder'
    }));
  }
  const coverageListing = listTaskRecords(path.join(root, 'specs/S-203-coverage'), root);
  assert.deepEqual(
    coverageListing.map((item) => item.id),
    ['TK-2', 'TK-10'],
    'a two-record listing returns both records ordered by visible identifier, not by string comparison'
  );
  assert.equal(
    coverageListing[1].relativePath,
    'specs/S-203-coverage/tasks/TK-10/TASK.md',
    'a listed record carries its root-relative path in posix form'
  );

  write('specs/S-203-coverage/tasks/TK-012/TASK.md', [
    '# TK-012 - Missing slice',
    '',
    '**Task ID:** TK-012',
    '**Spec ID:** S-203',
    '**Status:** ready',
    '**Blockers:** none',
    '**Destination:** spec-acceptance: placeholder',
    ''
  ].join('\n'));
  assert.throws(
    () => readTaskRecord(path.join(root, 'specs/S-203-coverage/tasks/TK-012/TASK.md'), root),
    /is missing Slice/,
    'a Task record with no Slice fails closed rather than describing itself as an unnamed slice'
  );
  fs.rmSync(path.join(root, 'specs/S-203-coverage'), { recursive: true });

  fs.rmSync(path.join(root, 'specs/S-201-task-record'), { recursive: true });
  render(root);

  // S-00H TK-002: `next`, `claim`, `close` and `render` read standalone Task
  // records wherever a Spec has a `tasks/` directory, and the embedded slice
  // table wherever it does not. One source of slice truth per Spec: a
  // record-backed Spec's retained table holds completed history only, and a
  // row and a record for one identifier is refused rather than counted twice.
  const completedBefore = read('specs/S-001-fixture/SPEC.md');

  write('specs/S-301-records/SPEC.md', recordBackedSpec('S-301'));
  write('specs/S-301-records/tasks/TK-002/TASK.md', taskRecordFixture({
    id: 'TK-002', specId: 'S-301', slice: 'Second slice', status: 'blocked', blockers: 'S-001',
    destination: 'spec-acceptance: S-301 Acceptance Criteria item 1'
  }));
  write('specs/S-301-records/tasks/TK-003/TASK.md', taskRecordFixture({
    id: 'TK-003', specId: 'S-301', slice: 'Third slice', status: 'blocked', blockers: 'TK-002',
    destination: 'spec-acceptance: S-301 Acceptance Criteria item 1'
  }));
  const recordTableBefore = sliceTable(read('specs/S-301-records/SPEC.md'));
  render(root);

  const selectedRecord = nextWork(root);
  assert.equal(selectedRecord.specId, 'S-301');
  assert.equal(selectedRecord.taskId, 'TK-002',
    'a record whose only blocker is a complete Spec is selected live, without anyone editing a status cell');
  assert.equal(selectedRecord.slice, 'Second slice', 'the selected slice text comes from the Task record');
  assert.deepEqual(doctor(root), [], 'doctor stays clean on a record-backed Spec and raises no false slice finding');

  claimWork(root, 'S-301', { agent: 'codex', date: '2026-07-12' });
  assert.match(read('specs/S-301-records/tasks/TK-002/TASK.md'), /\*\*Status:\*\* in-progress/,
    'claim flips the Task record itself to in-progress');
  assert.match(read('specs/S-301-records/SPEC.md'), /\*\*Owner:\*\* codex/);
  assert.match(read('specs/S-301-records/SPEC.md'), /\*\*Latest event:\*\* TK-002 claimed by codex\./);
  assert.equal(sliceTable(read('specs/S-301-records/SPEC.md')), recordTableBefore,
    'claiming a Task record leaves the Spec slice table untouched');
  assert.equal(nextWork(root).status, 'in-progress', 'a claimed record resumes before new work is selected');

  const closedRecord = closeTask(root, 'S-301', {
    proof: 'node test | tee record.log',
    docs: 'Docs checked; no update needed',
    remainingGap: 'none',
    date: '2026-07-12'
  });
  assert.equal(closedRecord.tasks.find((item) => item.id === 'TK-002').status, 'done');
  assert.match(read('specs/S-301-records/tasks/TK-002/TASK.md'), /\*\*Status:\*\* done/,
    'close flips the Task record to done');
  assert.match(read('specs/S-301-records/tasks/TK-002/TASK.md'), /\*\*Proof:\*\* node test \| tee record\.log/,
    'proof text for a record goes on the record, not into a table cell');
  assert.match(
    read('specs/S-301-records/SPEC.md'),
    /\| 2026-07-12 \| TK-002 \| Task closed \| node test \\\| tee record\.log \|/,
    "close still appends the Spec's append-only evidence row for a record-backed Spec"
  );
  assert.equal(sliceTable(read('specs/S-301-records/SPEC.md')), recordTableBefore,
    'closing a Task record leaves the Spec slice table untouched');
  assert.match(read('specs/S-301-records/SPEC.md'), /\*\*Next gate:\*\* Complete TK-003\./);
  assert.throws(
    () => completeSpec(root, 'S-301', { date: '2026-07-12' }),
    /S-301 has an unfinished slice/,
    'a record-backed Spec cannot complete while one of its Task records is unfinished'
  );
  assert.equal(nextWork(root).taskId, 'TK-003',
    'a record whose declared blocker is now a done record becomes eligible with no status cell edited');

  render(root);
  assert.match(
    read('TASKBOARD.md'),
    /\| \[S-301\]\(specs\/S-301-records\/SPEC\.md\) \| TK-003: Third slice \(ready\) \| codex \|/,
    'the hot board row for a record-backed Spec is derived from its Task records'
  );
  assert.deepEqual(doctor(root), [], 'a rendered record-backed room passes doctor');

  // A Spec objective with no active Task records shows the owner gate rather
  // than a slice; its active state is derived from the records, and no second
  // Spec status is written anywhere.
  claimWork(root, 'S-301', { agent: 'codex', date: '2026-07-12' });
  closeTask(root, 'S-301', {
    proof: 'see $& and $` output', docs: 'Docs checked; no update needed', remainingGap: 'none', date: '2026-07-12'
  });
  assert.match(
    read('specs/S-301-records/tasks/TK-003/TASK.md'),
    /^\*\*Proof:\*\* see \$& and \$` output$/m,
    'a proof naming a replacement pattern is written literally, not expanded against the line it replaced'
  );
  assert.throws(
    () => completeSpec(root, 'S-301', { date: '2026-07-12' }),
    /S-301 has unchecked acceptance criteria/,
    'once every Task record is done the slice gate is satisfied and completion reaches the next gate'
  );
  render(root);
  assert.match(read('TASKBOARD.md'), /\| \[S-301\]\(specs\/S-301-records\/SPEC\.md\) \| Acceptance \/ owner gate \|/,
    'a record-backed Spec whose Task records are all done derives an inactive slice cell');
  assert.equal(nextWork(root), null, 'no record remains eligible once every Task record is done');
  assert.match(read('specs/S-301-records/SPEC.md'), /\*\*Status:\*\* active/,
    'the Spec header Status is the Spec lifecycle truth and no command rewrites it from records');

  // A record-backed Spec's retained table is completed history only; a live
  // row beside the records is refused rather than silently ignored.
  const liveRow = read('specs/S-301-records/SPEC.md')
    .replace('| TK-001 | First slice | done | none | landed |', '| TK-001 | First slice | ready | none | pending |');
  fs.writeFileSync(path.join(root, 'specs/S-301-records/SPEC.md'), liveRow);
  assert.throws(() => nextWork(root), /S-301 is record-backed but its slice table still holds the unfinished row TK-001/,
    'a record-backed Spec keeps one source of slice truth; an unfinished retained row fails closed');
  fs.rmSync(path.join(root, 'specs/S-301-records'), { recursive: true });

  // Closing a Task whose record already carries a Proof replaces that field
  // in place. The replace branch is the one a string replacement would
  // corrupt, expanding `$&` against the very line it is replacing, so it gets
  // its own case rather than riding on the insert branch above.
  write('specs/S-310-reproof/SPEC.md', recordBackedSpec('S-310'));
  write('specs/S-310-reproof/tasks/TK-002/TASK.md', `${taskRecordFixture({
    id: 'TK-002', specId: 'S-310', slice: 'Reopened slice', status: 'in-progress', blockers: 'none',
    destination: 'spec-acceptance: S-310 Acceptance Criteria'
  })}**Proof:** superseded by the rerun\n`);
  render(root);
  closeTask(root, 'S-310', {
    proof: 'see $& and $` output',
    docs: 'Docs checked; no update needed',
    remainingGap: 'none',
    date: '2026-07-12'
  });
  assert.match(
    read('specs/S-310-reproof/tasks/TK-002/TASK.md'),
    /^\*\*Proof:\*\* see \$& and \$` output$/m,
    'replacing an existing Proof writes the value literally, never expanding it against the replaced line'
  );
  assert.doesNotMatch(
    read('specs/S-310-reproof/tasks/TK-002/TASK.md'),
    /superseded by the rerun/,
    'the superseded proof is replaced, not folded into the new one'
  );
  fs.rmSync(path.join(root, 'specs/S-310-reproof'), { recursive: true });
  render(root);

  // A row and a record for one identifier: refused explicitly, never counted twice.
  write('specs/S-302-collision/SPEC.md', fixtureSpec().replaceAll('S-001', 'S-302'));
  write('specs/S-302-collision/tasks/TK-001/TASK.md', taskRecordFixture({
    id: 'TK-001', specId: 'S-302', slice: 'First slice', status: 'ready', blockers: 'none',
    destination: 'spec-acceptance: S-302 Acceptance Criteria item 1'
  }));
  assert.throws(
    () => nextWork(root),
    /S-302 carries both a slice-table row and a Task record for TK-001/,
    'one identifier held by both a row and a record is an explicit error, never a doubled candidate'
  );
  assert.ok(
    doctor(root).some((issue) => issue.code === 'row-record-collision' && /TK-001/.test(issue.message)),
    'doctor reports the collision rather than selecting past it'
  );
  fs.rmSync(path.join(root, 'specs/S-302-collision'), { recursive: true });
  render(root);

  // A record authored `ready` whose live blockers are unmet is the same
  // contradiction a ready row is: reported by name, excluded from selection,
  // and refused by claim. A record authored `blocked` is ordinary sequencing
  // and raises nothing, exactly as a blocked row does.
  write('specs/S-307-ready-unmet/SPEC.md', recordBackedSpec('S-307'));
  write('specs/S-307-ready-unmet/tasks/TK-002/TASK.md', taskRecordFixture({
    id: 'TK-002', specId: 'S-307', slice: 'Waiting slice', status: 'ready', blockers: 'TK-900',
    destination: 'spec-acceptance: S-307 Acceptance Criteria'
  }));
  render(root);
  assert.equal(
    doctor(root).find((issue) => issue.code === 'blocked-slice')?.message,
    'S-307/TK-002 waits on TK-900',
    'a record declared ready with an unmet blocker is reported by name'
  );
  assert.equal(nextWork(root), null, 'a record whose declared blockers are unmet is excluded from selection');
  assert.throws(
    () => claimWork(root, 'S-307', { agent: 'codex', date: '2026-07-12' }),
    /S-307\/TK-002 is blocked by TK-900 \(blocked-slice\)/,
    'claim refuses a record whose declared dependency is unmet, naming it'
  );
  fs.rmSync(path.join(root, 'specs/S-307-ready-unmet'), { recursive: true });
  render(root);

  // A record declared `blocked` behind an in-progress record is ordinary
  // sequencing: doctor raises nothing for it, so claim must not name
  // `blocked-slice` at it either.
  write('specs/S-309-sequencing/SPEC.md', recordBackedSpec('S-309'));
  write('specs/S-309-sequencing/tasks/TK-002/TASK.md', taskRecordFixture({
    id: 'TK-002', specId: 'S-309', slice: 'Running slice', status: 'in-progress', blockers: 'none',
    destination: 'spec-acceptance: S-309 Acceptance Criteria'
  }));
  write('specs/S-309-sequencing/tasks/TK-003/TASK.md', taskRecordFixture({
    id: 'TK-003', specId: 'S-309', slice: 'Waiting slice', status: 'blocked', blockers: 'TK-002',
    destination: 'spec-acceptance: S-309 Acceptance Criteria'
  }));
  render(root);
  assert.equal(
    doctor(root).filter((issue) => issue.code === 'blocked-slice').length,
    0,
    'ordinary sequencing behind an in-progress record raises no slice finding'
  );
  assert.throws(
    () => claimWork(root, 'S-309', { agent: 'codex', date: '2026-07-12' }),
    /S-309 has no eligible ready task to claim/,
    'claim gives the generic refusal for ordinary sequencing rather than naming a finding nobody raised'
  );
  fs.rmSync(path.join(root, 'specs/S-309-sequencing'), { recursive: true });
  render(root);

  // A table-only Spec whose rows all say `blocked` still hears that it has
  // nothing eligible, not that a row names an unmet blocker: the refusal a
  // table row gets is unchanged by the record path added beside it.
  write('specs/S-308-blocked-rows/SPEC.md', fixtureSpec().replaceAll('S-001', 'S-308')
    .replace('| TK-001 | First slice | ready | none | pending |', '| TK-001 | First slice | blocked | none | pending |'));
  render(root);
  assert.throws(
    () => claimWork(root, 'S-308', { agent: 'codex', date: '2026-07-12' }),
    /S-308 has no eligible ready task to claim/,
    'a table row that says blocked is refused exactly as it was before Task records existed'
  );
  fs.rmSync(path.join(root, 'specs/S-308-blocked-rows'), { recursive: true });
  render(root);

  // A table-only Spec behaves exactly as it did before any of this.
  write('specs/S-306-table-only/SPEC.md', fixtureSpec().replaceAll('S-001', 'S-306'));
  render(root);
  const tableOnly = nextWork(root);
  assert.equal(tableOnly.taskId, 'TK-001');
  assert.equal(tableOnly.status, 'ready');
  const tableOnlyBefore = read('specs/S-306-table-only/SPEC.md');

  // The converter: one TASK.md per non-done row of an active Spec, done rows
  // and completed Specs untouched, and it refuses to run twice.
  assert.throws(
    () => convertSpecSlices(root, 'S-001'),
    /S-001 is complete/,
    "a completed Spec's historical table is never converted"
  );
  assert.equal(read('specs/S-001-fixture/SPEC.md'), completedBefore,
    'a refused conversion leaves the completed Spec byte-identical');

  write('specs/S-304-convert/SPEC.md', fixtureSpec().replaceAll('S-001', 'S-304').replace(
    '| TK-001 | First slice | ready | none | pending |',
    [
      '| TK-001 | First slice | done | none | node test \\| tee first.log |',
      '| TK-002 | Second slice | ready | TK-001 | Red then green at the command seam |',
      '| TK-003 | Third slice | blocked | TK-002 | pending |'
    ].join('\n')
  ).replace('## Acceptance Criteria', [
    '## Notes',
    '',
    '| TK-002 | Named in a table outside the slice section |',
    '',
    '## Acceptance Criteria'
  ].join('\n')));
  const converted = convertSpecSlices(root, 'S-304', {
    destinations: { 'TK-002': 'spec-acceptance: S-304 Acceptance Criteria item 1' }
  });
  assert.deepEqual(converted.converted, [
    'specs/S-304-convert/tasks/TK-002/TASK.md',
    'specs/S-304-convert/tasks/TK-003/TASK.md'
  ]);
  assert.deepEqual(converted.retained, ['TK-001'], 'a done row stays in the table as completed history');
  assert.match(sliceTable(read('specs/S-304-convert/SPEC.md')), /\| TK-001 \| First slice \| done \| none \| node test \\\| tee first\.log \|/);
  assert.doesNotMatch(sliceTable(read('specs/S-304-convert/SPEC.md')), /\| TK-002 \|/,
    'a converted row leaves the table, so no identifier is held in two places');
  assert.equal(readTaskRecord(path.join(root, 'specs/S-304-convert/tasks/TK-002/TASK.md'), root).destination.reference,
    'S-304 Acceptance Criteria item 1', 'a supplied destination is carried onto the record');
  assert.equal(readTaskRecord(path.join(root, 'specs/S-304-convert/tasks/TK-003/TASK.md'), root).destination.reference,
    'S-304 Acceptance Criteria', 'an unsupplied destination names the whole acceptance section rather than guessing a line');
  assert.equal(readTaskRecord(path.join(root, 'specs/S-304-convert/tasks/TK-003/TASK.md'), root).status, 'blocked');
  // An unfinished row's Proof cell is the verification the slice plans to
  // run. It is carried as a plan and never as proof, so nothing downstream
  // can present it as evidence for work that has not happened.
  const plannedRecord = readTaskRecord(path.join(root, 'specs/S-304-convert/tasks/TK-002/TASK.md'), root);
  assert.equal(plannedRecord.plannedVerification, 'Red then green at the command seam');
  assert.equal(plannedRecord.proof, null, 'a converted record carries no proof; close writes that');
  assert.doesNotMatch(read('specs/S-304-convert/tasks/TK-002/TASK.md'), /\*\*Proof:\*\*/,
    'a converted record has no Proof field at all until the Task closes');
  assert.equal(
    showSpec(root, 'S-304').tasks.find((item) => item.id === 'TK-002').proof,
    null,
    'show reports no proof for a Task that has not closed'
  );
  assert.match(
    read('specs/S-304-convert/SPEC.md'),
    /\| TK-002 \| Named in a table outside the slice section \|/,
    'conversion removes rows from the slice table and from nowhere else'
  );
  render(root);
  assert.deepEqual(doctor(root), [], 'a converted Spec renders and passes doctor');
  assert.equal(nextWork(root).taskId, 'TK-002', 'the converted room selects the first eligible record');
  assert.throws(
    () => convertSpecSlices(root, 'S-304'),
    /already has specs\/S-304-convert\/tasks; conversion runs once/,
    'the converter refuses to run twice'
  );

  // A blocker a Task record cannot represent stops the conversion by name
  // rather than dropping the dependency on the way into the record.
  write('specs/S-305-unconvertible/SPEC.md', fixtureSpec().replaceAll('S-001', 'S-305').replace(
    '| TK-001 | First slice | ready | none | pending |',
    '| TK-001 | First slice | blocked | TT-Q10 | pending |'
  ));
  const unconvertibleBefore = read('specs/S-305-unconvertible/SPEC.md');
  assert.throws(
    () => convertSpecSlices(root, 'S-305'),
    /S-305\/TK-001 cannot be converted: TK-001 has an invalid blocker id: TT-Q10/,
    'a blocker outside the record vocabulary fails the conversion closed instead of being dropped'
  );
  assert.equal(read('specs/S-305-unconvertible/SPEC.md'), unconvertibleBefore,
    'a refused conversion writes nothing at all');
  assert.equal(fs.existsSync(path.join(root, 'specs/S-305-unconvertible/tasks')), false,
    'a refused conversion leaves no half-written tasks directory');
  fs.rmSync(path.join(root, 'specs/S-305-unconvertible'), { recursive: true });
  fs.rmSync(path.join(root, 'specs/S-304-convert'), { recursive: true });

  assert.equal(read('specs/S-306-table-only/SPEC.md'), tableOnlyBefore,
    'a table-only Spec beside record-backed Specs is never rewritten by them');
  fs.rmSync(path.join(root, 'specs/S-306-table-only'), { recursive: true });
  render(root);
  assert.equal(read('specs/S-001-fixture/SPEC.md'), completedBefore,
    "a completed Spec's historical table is byte-identical after every command");

  fs.appendFileSync(path.join(root, 'specs/S-001-fixture/SPEC.md'), '\n[missing](../../missing.md)\n');
  assert.ok(doctor(root).some((issue) => issue.code === 'broken-link'));
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}

console.log('ok - spec workbench lifecycle, rendering, and doctor self-test passed');

function fixtureSpec() {
  return [
    '# S-001 - Fixture Capability',
    '',
    '**Spec ID:** S-001',
    '**Status:** active',
    '**Priority:** 0',
    '**Owner:** agent',
    '**Updated:** 2026-07-12',
    '**Catalog description:** Proves the fixture lifecycle.',
    '**Blockers:** none',
    '**Latest event:** Spec activated.',
    '**Next gate:** Complete TK-001.',
    '',
    '## Vertical Implementation Slices',
    '',
    '| Task | Slice | Status | Blockers | Proof |',
    '|---|---|---|---|---|',
    '| TK-001 | First slice | ready | none | pending |',
    '',
    '## Acceptance Criteria',
    '',
    '- [ ] Expected behavior is verified.',
    '',
    '## Append-Only Evidence And Execution Log',
    '',
    '| Date | Task | Event | Verification | Docs | Remaining gap |',
    '|---|---|---|---|---|---|',
    '',
    '## Completion Result',
    '',
    'Pending.',
    '',
    '## Supersession',
    '',
    '- Supersedes: none',
    '- Superseded by: none',
    ''
  ].join('\n');
}

function recordBackedSpec(id) {
  return fixtureSpec()
    .replaceAll('S-001', id)
    .replace('| TK-001 | First slice | ready | none | pending |', '| TK-001 | First slice | done | none | landed |');
}

function sliceTable(content) {
  const start = content.indexOf('## Vertical Implementation Slices');
  const end = content.indexOf('\n## ', start + 1);
  return content.slice(start, end < 0 ? content.length : end);
}

function taskRecordFixture({ id, specId, slice, status, blockers, destination }) {
  return [
    `# ${id} - ${slice}`,
    '',
    `**Task ID:** ${id}`,
    `**Spec ID:** ${specId}`,
    `**Slice:** ${slice}`,
    `**Status:** ${status}`,
    `**Blockers:** ${blockers}`,
    `**Destination:** ${destination}`,
    ''
  ].join('\n');
}

function write(relative, content) {
  const target = path.join(root, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function read(relative) {
  return fs.readFileSync(path.join(root, relative), 'utf8');
}

// ---- S-00H TK-006: Task receipt tests (begin) ----
// This block is this lane's own delimited section, kept separate from a
// concurrent lane's Packet tests (TK-005, `task-packet.mjs`) that append to
// the same end-of-file position. Do not interleave the two blocks.
{
  const { execFileSync } = await import('node:child_process');
  const {
    appendReceiptRowToContent,
    appendReceiptRow,
    readReceipt,
    readReceiptFromFile,
    readGitFacts
  } = await import('../workbench/tools/task-receipt.mjs');
  const { readTaskRecord } = await import('../workbench/tools/task-record.mjs');

  const receiptRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'task-receipt-'));
  try {
    // Pure content-level seam first: no Git process needed to prove the
    // append/read contract, one row per call, never overwriting a prior row.
    const bareRecord = taskRecordFixture({
      id: 'TK-100', specId: 'S-300', slice: 'Fixture receipt', status: 'in-progress',
      blockers: 'none', destination: 'spec-acceptance: placeholder'
    });

    assert.deepEqual(readReceipt(bareRecord), [], 'a Task record with no Receipt section yet reads as zero runs');

    const afterRow1 = appendReceiptRowToContent(bareRecord, {
      branch: 'claude/fixture', headSha: 'a'.repeat(40), upstream: 'none', dirty: 0,
      testsRun: 'tools/test-fixture.mjs: pass', docsTouched: 'AGENTS.md: none', remainingGap: 'none'
    });
    const rows1 = readReceipt(afterRow1);
    assert.equal(rows1.length, 1);
    assert.deepEqual(
      { run: rows1[0].run, branch: rows1[0].branch, headSha: rows1[0].headSha, upstream: rows1[0].upstream, dirty: rows1[0].dirty, testsRun: rows1[0].testsRun, docsTouched: rows1[0].docsTouched, remainingGap: rows1[0].remainingGap },
      { run: 1, branch: 'claude/fixture', headSha: 'a'.repeat(40), upstream: 'none', dirty: 0, testsRun: 'tools/test-fixture.mjs: pass', docsTouched: 'AGENTS.md: none', remainingGap: 'none' },
      'every named Receipt field round-trips'
    );

    // The augmented record must still parse cleanly through the existing
    // record reader: the Receipt table must never read as a duplicated
    // `**Field:**` header line.
    const augmentedPath = path.join(receiptRoot, 'augmented-TASK.md');
    fs.writeFileSync(augmentedPath, afterRow1);
    const parsed = readTaskRecord(augmentedPath, receiptRoot);
    assert.equal(parsed.id, 'TK-100', 'task-record.mjs still reads the Task fields once a Receipt section is appended');

    // A resumed Task appends a second row; the first is untouched.
    const afterRow2 = appendReceiptRowToContent(afterRow1, {
      branch: 'claude/fixture', headSha: 'b'.repeat(40), upstream: 'ahead 1 behind 0', dirty: 2,
      testsRun: 'tools/test-fixture.mjs: pass (resumed)', docsTouched: 'none', remainingGap: 'open: still implementing'
    });
    const rows2 = readReceipt(afterRow2);
    assert.equal(rows2.length, 2, 'a resumed run appends a second row rather than overwriting the first');
    assert.equal(rows2[0].testsRun, 'tools/test-fixture.mjs: pass', 'the first row is unchanged after a second append');
    assert.equal(rows2[1].run, 2);
    assert.equal(rows2[1].remainingGap, 'open: still implementing', 'append is callable mid-run with an open remaining gap');

    // A malformed or edited earlier row is refused, never silently repaired.
    const tampered = afterRow2.replace('tools/test-fixture.mjs: pass', 'tools/test-fixture.mjs: TAMPERED');
    assert.throws(
      () => readReceipt(tampered),
      /altered|checksum/i,
      'an edited earlier Receipt row fails closed rather than being read as valid'
    );

    const structurallyBroken = afterRow1.replace(
      /\| 1 \|[^\n]*\|\n/,
      '| 1 | claude/fixture | not-enough-columns |\n'
    );
    assert.throws(
      () => readReceipt(structurallyBroken),
      /malformed/i,
      'a structurally malformed Receipt row fails closed'
    );

    // A supplied value with surrounding whitespace, or a trailing carriage
    // return the newline guard alone would miss, is normalized before it is
    // checksummed and written - not checksummed raw and then read back
    // trimmed, which would wedge the very row just appended as "altered".
    const wsRecord = taskRecordFixture({
      id: 'TK-103', specId: 'S-300', slice: 'Whitespace normalization fixture', status: 'in-progress',
      blockers: 'none', destination: 'spec-acceptance: placeholder'
    });
    const afterWsRow = appendReceiptRowToContent(wsRecord, {
      branch: 'claude/fixture', headSha: 'c'.repeat(40), upstream: 'none', dirty: 0,
      testsRun: '  tools/test-fixture.mjs: pass  ', docsTouched: 'AGENTS.md: none\r', remainingGap: 'none'
    });
    const wsRows = readReceipt(afterWsRow); // must not throw "altered"
    assert.equal(wsRows.length, 1);
    assert.equal(wsRows[0].testsRun, 'tools/test-fixture.mjs: pass',
      'a value with surrounding whitespace is normalized before checksumming and round-trips cleanly');
    assert.equal(wsRows[0].docsTouched, 'AGENTS.md: none',
      'a value with a trailing carriage return is normalized before checksumming and round-trips cleanly');

    // Appending before a following `## ` heading keeps that heading's
    // blank-line separation from the table rather than consuming it.
    const trailingSectionRecord = taskRecordFixture({
      id: 'TK-104', specId: 'S-300', slice: 'Trailing section fixture', status: 'in-progress',
      blockers: 'none', destination: 'spec-acceptance: placeholder'
    });
    const trailingWithRow1 = appendReceiptRowToContent(trailingSectionRecord, {
      branch: 'claude/fixture', headSha: 'd'.repeat(40), upstream: 'none', dirty: 0,
      testsRun: 'pass', docsTouched: 'none', remainingGap: 'none'
    });
    const trailingWithSection = `${trailingWithRow1}\n## Other\n\nSomething else.\n`;
    const trailingWithRow2 = appendReceiptRowToContent(trailingWithSection, {
      branch: 'claude/fixture', headSha: 'e'.repeat(40), upstream: 'none', dirty: 0,
      testsRun: 'pass2', docsTouched: 'none', remainingGap: 'none'
    });
    assert.match(trailingWithRow2, /\| 2 \|[^\n]*\|\n\n## Other/,
      'appending before a following heading keeps its blank-line separation');
    assert.equal(readReceipt(trailingWithRow2).length, 2, 'the appended row is still readable once a following section is preserved');

    // Git facts (branch, HEAD SHA, upstream distance, dirty count) come from
    // Git for the working tree given, not from the caller.
    const bareOrigin = path.join(receiptRoot, 'origin.git');
    execFileSync('git', ['init', '--quiet', '--bare', bareOrigin]);
    const workDir = path.join(receiptRoot, 'work');
    fs.mkdirSync(workDir);
    execFileSync('git', ['init', '--quiet', workDir]);
    execFileSync('git', ['-C', workDir, 'config', 'user.email', 'fixture@example.com']);
    execFileSync('git', ['-C', workDir, 'config', 'user.name', 'Fixture']);
    fs.writeFileSync(path.join(workDir, 'file.txt'), 'one\n');
    execFileSync('git', ['-C', workDir, 'add', '.']);
    execFileSync('git', ['-C', workDir, 'commit', '--quiet', '-m', 'init']);
    execFileSync('git', ['-C', workDir, 'remote', 'add', 'origin', bareOrigin]);
    const branchName = execFileSync('git', ['-C', workDir, 'rev-parse', '--abbrev-ref', 'HEAD'], { encoding: 'utf8' }).trim();
    execFileSync('git', ['-C', workDir, 'push', '--quiet', '-u', 'origin', `HEAD:refs/heads/${branchName}`]);
    fs.writeFileSync(path.join(workDir, 'file.txt'), 'two\n');
    execFileSync('git', ['-C', workDir, 'commit', '--quiet', '-am', 'second']);
    fs.writeFileSync(path.join(workDir, 'untracked.txt'), 'new\n');
    const expectedSha = execFileSync('git', ['-C', workDir, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();

    const taskPath = path.join(receiptRoot, 'specs/S-300-fixture/tasks/TK-101/TASK.md');
    fs.mkdirSync(path.dirname(taskPath), { recursive: true });
    fs.writeFileSync(taskPath, taskRecordFixture({
      id: 'TK-101', specId: 'S-300', slice: 'Fixture receipt (Git)', status: 'in-progress',
      blockers: 'none', destination: 'spec-acceptance: placeholder'
    }));

    appendReceiptRow(taskPath, {
      repoRoot: workDir,
      testsRun: 'tools/test-fixture.mjs: pass',
      docsTouched: 'none',
      remainingGap: 'open: mid-run snapshot'
    });
    const gitRows = readReceiptFromFile(taskPath);
    assert.equal(gitRows.length, 1);
    assert.equal(gitRows[0].branch, branchName, 'branch is read from Git for the given working tree');
    assert.equal(gitRows[0].headSha, expectedSha, 'HEAD SHA is read from Git for the given working tree');
    assert.equal(gitRows[0].upstream, 'ahead 1 behind 0', 'upstream distance is read from Git, not supplied by the caller');
    assert.equal(gitRows[0].dirty, 1, 'dirty file count is read from Git, not supplied by the caller');

    // A simulated abrupt interruption: the append call above already left an
    // open remaining gap and nothing else runs afterward. A fresh read call
    // (as a resumed process would perform) still finds that row intact.
    const resumedRead = readReceiptFromFile(taskPath);
    assert.equal(resumedRead.length, 1);
    assert.equal(resumedRead[0].remainingGap, 'open: mid-run snapshot', 'a row appended mid-run stays readable after the process stops');

    // Resume appends another row rather than replacing it.
    appendReceiptRow(taskPath, {
      repoRoot: workDir,
      testsRun: 'tools/test-fixture.mjs: pass (resumed run)',
      docsTouched: 'none',
      remainingGap: 'none'
    });
    const finalRows = readReceiptFromFile(taskPath);
    assert.equal(finalRows.length, 2, 'a resumed Task appends another row to the same record');
    assert.equal(finalRows[0].remainingGap, 'open: mid-run snapshot', 'the earlier row is untouched by the resumed append');
    assert.equal(finalRows[1].run, 2);

    // A detached HEAD must never read as a branch literally named "HEAD".
    const detachedDir = path.join(receiptRoot, 'detached');
    fs.mkdirSync(detachedDir);
    execFileSync('git', ['init', '--quiet', detachedDir]);
    execFileSync('git', ['-C', detachedDir, 'config', 'user.email', 'fixture@example.com']);
    execFileSync('git', ['-C', detachedDir, 'config', 'user.name', 'Fixture']);
    fs.writeFileSync(path.join(detachedDir, 'file.txt'), 'one\n');
    execFileSync('git', ['-C', detachedDir, 'add', '.']);
    execFileSync('git', ['-C', detachedDir, 'commit', '--quiet', '-m', 'init']);
    const detachedSha = execFileSync('git', ['-C', detachedDir, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
    execFileSync('git', ['-C', detachedDir, 'checkout', '--quiet', '--detach', detachedSha]);
    const detachedShort = execFileSync('git', ['-C', detachedDir, 'rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim();
    const detachedFacts = readGitFacts(detachedDir);
    assert.equal(detachedFacts.branch, `detached at ${detachedShort}`,
      'a detached HEAD reports "detached at <short sha>", never the literal string "HEAD"');

    console.log('ok - task receipt append-only per-run record passed');
  } finally {
    fs.rmSync(receiptRoot, { recursive: true, force: true });
  }
}
// ---- S-00H TK-006: Task receipt tests (end) ----
// ============================================================================
// S-00H TK-005: Task Packet assembly. Delimited block, appended last, so a
// concurrent lane's own tests (TK-006, task-receipt.mjs) land above this
// without conflict. Uses its own fixture root; touches nothing above.
//
// Post-review additions (dispatcher-requested mutation-gap closure on
// 08a0776): anchored section-heading matching (item 1), explicit assertions
// for traversal-not-copy, missing-SPEC.md, missing/heading-less wiki notes,
// and empty/mixed cited-path sets (item 2), and an existence-based filter on
// extractPathSpans so a non-path token (a branch name, a version string)
// cannot be cited as a source/test path (item 3).
// ============================================================================
{
  const packetRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'task-packet-'));
  try {
    writeAt(packetRoot, 'workbench/specs/S-401-packet/SPEC.md', packetFixtureSpec('S-401'));
    writeAt(packetRoot, 'workbench/specs/S-401-packet/tasks/TK-401/TASK.md', taskRecordFixture({
      id: 'TK-401',
      specId: 'S-401',
      slice: 'Assemble the Packet',
      status: 'in-progress',
      blockers: 'none',
      destination: 'spec-acceptance: S-401 Acceptance Criteria'
    }));
    // extractPathSpans now requires a span to resolve to a real file or
    // directory under root (item 3), so the two paths packetFixtureSpec's
    // Testing Seams section cites need stubs to exist for.
    writeAt(packetRoot, 'workbench/tools/spec-workbench.mjs', '// stub file so a cited path resolves to something real\n');
    writeAt(packetRoot, 'TASKBOARD.md', '# stub Taskboard so a cited path resolves to something real\n');

    // 1. A Packet missing a required member is refused with a named error.
    // The record, its destination Spec, and its cited paths are otherwise
    // complete; only the Contract (AGENTS.md) is absent from this fixture
    // room. A missing Task record itself (the very first check) has no Task
    // ID to name yet, since the record is what would have supplied it, so
    // that one names the searched path instead - stated precisely rather
    // than claimed to carry a Task ID it cannot have.
    assert.throws(
      () => assembleTaskPacket(packetRoot, 'workbench/specs/S-401-packet/tasks/TK-401/TASK.md'),
      /TK-401 Packet is missing its required Contract member: no AGENTS\.md/,
      'a Packet missing its required Contract member is refused with a named error'
    );
    assert.throws(
      () => assembleTaskPacket(packetRoot, 'workbench/specs/S-401-packet/tasks/DOES-NOT-EXIST/TASK.md'),
      /Packet is missing its required Task record member: no TASK\.md at/,
      'a Packet missing its required Task record member is named by path, since no Task ID exists before the record is read'
    );

    // 2. With the Contract present and no optional-member option supplied, a
    // Task is executable from exactly its four required members.
    writeAt(packetRoot, 'AGENTS.md', '# Fixture Contract\n\nThe Workbench Contract fixture.\n');
    const packet = assembleTaskPacket(packetRoot, 'workbench/specs/S-401-packet/tasks/TK-401/TASK.md');
    assert.equal(packet.record.id, 'TK-401');
    assert.equal(packet.destination.type, 'spec-acceptance');
    assert.equal(packet.destination.specId, 'S-401');
    assert.match(packet.destination.text, /Expected behavior is verified/);
    assert.deepEqual(
      [...packet.citedPaths].sort(),
      ['TASKBOARD.md', 'workbench/tools/spec-workbench.mjs'].sort(),
      'cited paths are the file-shaped backtick spans in the Testing Seams section that resolve to a real file under root'
    );
    assert.equal(packet.contract.path, 'AGENTS.md');
    assert.match(packet.contract.text, /Fixture Contract/);
    assert.equal(packet.handoff, undefined, 'no handoff option supplied => no handoff member at all');
    assert.equal(packet.notepad, undefined, 'no notepad option supplied => no notepad member at all');
    assert.deepEqual(
      Object.keys(packet).sort(),
      ['citedPaths', 'contract', 'destination', 'record'],
      'a Task executable from required members alone carries exactly the four required keys'
    );

    // 2a. Traversal, not copy: the resolved destination text is the named
    // section alone, cut from the Spec body rather than a copy of it.
    const fullSpecContent = fs.readFileSync(path.join(packetRoot, 'workbench/specs/S-401-packet/SPEC.md'), 'utf8');
    assert.ok(
      packet.destination.text.length < fullSpecContent.length,
      'the resolved destination text is shorter than the whole Spec body'
    );
    assert.ok(
      !/\n## /.test(`\n${packet.destination.text}`),
      'the resolved Acceptance Criteria text carries no other level-two heading'
    );
    assert.ok(
      !packet.destination.text.includes('PACKET_SEAM_SENTINEL_9F3'),
      'the resolved Acceptance Criteria text does not leak a sentinel placed only in the Testing Seams section'
    );

    // 3. Optional members are included only when present, and are always
    // marked as working context, never as instruction or as proof.
    writeAt(packetRoot, 'workbench/sessions/handoffs/tk-401-handoff.md', '# Handoff\n\nplain-language continuation notes.\n');
    writeAt(packetRoot, 'workbench/sessions/notepads/work/tk-401.json', JSON.stringify({
      schema: 'notepad-1',
      objective: 'tk-401',
      current: { state: 'in progress' }
    }));
    const withOptional = assembleTaskPacket(packetRoot, 'workbench/specs/S-401-packet/tasks/TK-401/TASK.md', {
      handoffPath: 'workbench/sessions/handoffs/tk-401-handoff.md',
      notepadPath: 'workbench/sessions/notepads/work/tk-401.json'
    });
    assert.deepEqual(withOptional.handoff, {
      path: 'workbench/sessions/handoffs/tk-401-handoff.md',
      content: '# Handoff\n\nplain-language continuation notes.\n',
      workingContext: true,
      instruction: false,
      proof: false
    }, 'a present Scoped handoff is labeled working context, never instruction or proof');
    assert.equal(withOptional.notepad.workingContext, true);
    assert.equal(withOptional.notepad.instruction, false);
    assert.equal(withOptional.notepad.proof, false);
    assert.equal(withOptional.notepad.content.objective, 'tk-401');

    // An optional path that does not exist on this clone (the fresh-clone /
    // another-machine case ADR-000H names, since handoffs and notepads are
    // local and untracked) is silently absent, never an error.
    const withMissingOptional = assembleTaskPacket(packetRoot, 'workbench/specs/S-401-packet/tasks/TK-401/TASK.md', {
      handoffPath: 'workbench/sessions/handoffs/does-not-exist.md',
      notepadPath: 'workbench/sessions/notepads/work/does-not-exist.json'
    });
    assert.equal(withMissingOptional.handoff, undefined, 'a missing handoff file is absent, not an error');
    assert.equal(withMissingOptional.notepad, undefined, 'a missing notepad file is absent, not an error');

    // 4. Heading anchoring (item 1): the section() marker must match a whole
    // line, never a loose substring. One fixture covers all three review
    // probes: a reference that is a strict prefix of the real heading must
    // not partial-match it and leak the remainder; a `###` subsection sitting
    // above the real heading, and a prose mention of the heading mid-line,
    // must never be mistaken for the real level-two heading.
    writeAt(packetRoot, 'workbench/specs/S-404-heading/SPEC.md', headingAmbiguitySpec('S-404'));
    writeAt(packetRoot, 'workbench/specs/S-404-heading/tasks/TK-404/TASK.md', taskRecordFixture({
      id: 'TK-404',
      specId: 'S-404',
      slice: 'A strict-prefix heading reference must not partial-match',
      status: 'ready',
      blockers: 'none',
      destination: 'spec-acceptance: S-404 Acceptance'
    }));
    writeAt(packetRoot, 'workbench/specs/S-404-heading/tasks/TK-405/TASK.md', taskRecordFixture({
      id: 'TK-405',
      specId: 'S-404',
      slice: 'The anchored heading resolves the real section only',
      status: 'ready',
      blockers: 'none',
      destination: 'spec-acceptance: S-404 Acceptance Criteria'
    }));
    assert.throws(
      () => assembleTaskPacket(packetRoot, 'workbench/specs/S-404-heading/tasks/TK-404/TASK.md'),
      /TK-404 Packet is missing its required destination member: .*has no "Acceptance" section/,
      'a heading reference that is a strict prefix of the real heading text must not partial-match it'
    );
    const anchored = assembleTaskPacket(packetRoot, 'workbench/specs/S-404-heading/tasks/TK-405/TASK.md');
    assert.equal(
      anchored.destination.text,
      '- [ ] The real acceptance line lives here only.',
      'the anchored marker resolves the real level-two heading only, never a ### subsection above it or a prose mention mid-line'
    );

    // 2b. A spec-acceptance destination naming a Spec with no SPEC.md at all
    // (not merely a missing section) is refused with the named error.
    writeAt(packetRoot, 'workbench/specs/S-406-missing-spec/tasks/TK-406/TASK.md', taskRecordFixture({
      id: 'TK-406',
      specId: 'S-999',
      slice: 'No SPEC.md exists for the named Spec at all',
      status: 'ready',
      blockers: 'none',
      destination: 'spec-acceptance: S-999 Acceptance Criteria'
    }));
    assert.equal(
      fs.readdirSync(path.join(packetRoot, 'workbench/specs')).some((name) => name.startsWith('S-999-')),
      false,
      'no directory for S-999 exists anywhere under the specs lane'
    );
    assert.throws(
      () => assembleTaskPacket(packetRoot, 'workbench/specs/S-406-missing-spec/tasks/TK-406/TASK.md'),
      /TK-406 Packet is missing its required destination member: no SPEC\.md exists for S-999/,
      'a spec-acceptance destination naming a Spec with no SPEC.md at all is refused with the named error'
    );

    // 5 (corrective case). A Task whose Destination is a wiki-claim assembles
    // with no SPEC.md present anywhere, since S-00I retirement removes it.
    writeAt(packetRoot, 'workbench/wiki/example-capability.md', wikiClaimFixture());
    writeAt(packetRoot, 'workbench/specs/S-402-retired/tasks/TK-402/TASK.md', taskRecordFixture({
      id: 'TK-402',
      specId: 'S-402',
      slice: 'Repair a reconciled claim',
      status: 'ready',
      blockers: 'none',
      destination: 'wiki-claim: workbench/wiki/example-capability.md#Claim'
    }));
    assert.equal(
      fs.existsSync(path.join(packetRoot, 'workbench/specs/S-402-retired/SPEC.md')),
      false,
      'the corrective fixture has no SPEC.md anywhere for S-402'
    );
    const corrective = assembleTaskPacket(packetRoot, 'workbench/specs/S-402-retired/tasks/TK-402/TASK.md');
    assert.equal(corrective.destination.type, 'wiki-claim');
    assert.equal(corrective.destination.notePath, 'workbench/wiki/example-capability.md');
    assert.match(corrective.destination.text, /Reconciled claim text lives here/);
    assert.deepEqual(
      corrective.citedPaths,
      ['workbench/tools/example-capability.mjs'],
      'a corrective Task cites the resolved Wiki note\'s own source_paths, never a SPEC.md'
    );
    assert.equal(corrective.contract.path, 'AGENTS.md');

    // 2c. A wiki-claim destination naming a note that does not exist, and one
    // naming a note that exists but lacks the claim heading, are both
    // refused with the named error (no stub).
    writeAt(packetRoot, 'workbench/specs/S-407-wiki-errors/tasks/TK-407/TASK.md', taskRecordFixture({
      id: 'TK-407',
      specId: 'S-402',
      slice: 'The wiki-claim note does not exist',
      status: 'ready',
      blockers: 'none',
      destination: 'wiki-claim: workbench/wiki/does-not-exist.md#Claim'
    }));
    assert.throws(
      () => assembleTaskPacket(packetRoot, 'workbench/specs/S-407-wiki-errors/tasks/TK-407/TASK.md'),
      /TK-407 Packet is missing its required destination member: wiki-claim note "workbench\/wiki\/does-not-exist\.md" does not exist/,
      'a wiki-claim destination naming a note that does not exist is refused with the named error'
    );
    writeAt(packetRoot, 'workbench/specs/S-407-wiki-errors/tasks/TK-408/TASK.md', taskRecordFixture({
      id: 'TK-408',
      specId: 'S-402',
      slice: 'The wiki-claim note exists but lacks the claim heading',
      status: 'ready',
      blockers: 'none',
      destination: 'wiki-claim: workbench/wiki/example-capability.md#No Such Heading'
    }));
    assert.throws(
      () => assembleTaskPacket(packetRoot, 'workbench/specs/S-407-wiki-errors/tasks/TK-408/TASK.md'),
      /TK-408 Packet is missing its required destination member: .*has no "No Such Heading" claim heading/,
      'a wiki-claim destination naming a real note with no matching claim heading is refused with the named error'
    );

    // 2d & 3. Cited paths are filtered to spans that resolve to an existing
    // file or directory under root: a Testing Seams section citing only
    // non-path tokens (a manifest field, a version string - exactly what the
    // review probe found the old heuristic wrongly accepting) is refused
    // with the named error, and a non-existent span sitting beside a real
    // one is excluded rather than merely tolerated.
    writeAt(packetRoot, 'workbench/specs/S-405-no-paths/SPEC.md', noCitablePathsSpec('S-405'));
    writeAt(packetRoot, 'workbench/specs/S-405-no-paths/tasks/TK-409/TASK.md', taskRecordFixture({
      id: 'TK-409',
      specId: 'S-405',
      slice: 'Testing Seams names no real path',
      status: 'ready',
      blockers: 'none',
      destination: 'spec-acceptance: S-405 Acceptance Criteria'
    }));
    assert.throws(
      () => assembleTaskPacket(packetRoot, 'workbench/specs/S-405-no-paths/tasks/TK-409/TASK.md'),
      /TK-409 Packet is missing its required cited-paths member: .*names no citable path/,
      'a Testing Seams section citing only non-path tokens is refused with the named error'
    );

    writeAt(packetRoot, 'workbench/specs/S-408-mixed-paths/SPEC.md', mixedCitablePathsSpec('S-408'));
    writeAt(packetRoot, 'workbench/specs/S-408-mixed-paths/tasks/TK-410/TASK.md', taskRecordFixture({
      id: 'TK-410',
      specId: 'S-408',
      slice: 'Testing Seams mixes a real path with a non-path token',
      status: 'ready',
      blockers: 'none',
      destination: 'spec-acceptance: S-408 Acceptance Criteria'
    }));
    const mixed = assembleTaskPacket(packetRoot, 'workbench/specs/S-408-mixed-paths/tasks/TK-410/TASK.md');
    assert.deepEqual(
      mixed.citedPaths,
      ['workbench/tools/spec-workbench.mjs'],
      'a non-existent span (git.integrationBranch) beside a real one is excluded, not merely ignored by accident'
    );

    console.log('ok - task packet assembly, required members, heading anchoring, optional labeling, cited-path filtering, and corrective wiki-claim case passed');
  } finally {
    fs.rmSync(packetRoot, { recursive: true, force: true });
  }
}

function writeAt(base, relativePath, content) {
  const target = path.join(base, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function packetFixtureSpec(id) {
  return [
    `# ${id} - Packet Fixture Capability`,
    '',
    `**Spec ID:** ${id}`,
    '**Status:** active',
    '**Priority:** 0',
    '**Owner:** agent',
    '**Updated:** 2026-09-16',
    '**Catalog description:** Proves the Packet fixture.',
    '**Blockers:** none',
    '**Latest event:** Spec activated.',
    '**Next gate:** Complete TK-401.',
    '',
    '## Acceptance Criteria',
    '',
    '- [ ] Expected behavior is verified.',
    '',
    '## Testing Seams',
    '',
    'The `workbench/tools/spec-workbench.mjs` selection seam and the render',
    'path into `TASKBOARD.md`. The token PACKET_SEAM_SENTINEL_9F3 lives only',
    'in this section and must never leak into a resolved Acceptance section.',
    ''
  ].join('\n');
}

function headingAmbiguitySpec(id) {
  return [
    `# ${id} - Heading Ambiguity Fixture`,
    '',
    `**Spec ID:** ${id}`,
    '**Status:** active',
    '**Priority:** 0',
    '**Owner:** agent',
    '**Updated:** 2026-09-16',
    '**Catalog description:** Proves the section() heading anchor.',
    '**Blockers:** none',
    '**Latest event:** Spec activated.',
    '**Next gate:** Complete TK-404.',
    '',
    '## Notes',
    '',
    'A prose mention of ## Acceptance Criteria mid-sentence must never be mistaken for the real heading below.',
    '',
    '### Acceptance Criteria',
    '',
    'This third-level subsection sits above the real heading and must never be mistaken for it.',
    '',
    '## Acceptance Criteria',
    '',
    '- [ ] The real acceptance line lives here only.',
    '',
    '## Testing Seams',
    '',
    'The `workbench/tools/spec-workbench.mjs` seam, reused from the shared fixture root.',
    ''
  ].join('\n');
}

function noCitablePathsSpec(id) {
  return [
    `# ${id} - No Citable Paths Fixture`,
    '',
    `**Spec ID:** ${id}`,
    '**Status:** active',
    '**Priority:** 0',
    '**Owner:** agent',
    '**Updated:** 2026-09-16',
    '**Catalog description:** Proves an all-non-path Testing Seams section is refused.',
    '**Blockers:** none',
    '**Latest event:** Spec activated.',
    '**Next gate:** Complete TK-409.',
    '',
    '## Acceptance Criteria',
    '',
    '- [ ] Expected behavior is verified.',
    '',
    '## Testing Seams',
    '',
    'The `git.integrationBranch` manifest field and the `3.1.2` version string;',
    'neither is a path that resolves to anything on disk.',
    ''
  ].join('\n');
}

function mixedCitablePathsSpec(id) {
  return [
    `# ${id} - Mixed Citable Paths Fixture`,
    '',
    `**Spec ID:** ${id}`,
    '**Status:** active',
    '**Priority:** 0',
    '**Owner:** agent',
    '**Updated:** 2026-09-16',
    '**Catalog description:** Proves a non-existent span is excluded beside a real one.',
    '**Blockers:** none',
    '**Latest event:** Spec activated.',
    '**Next gate:** Complete TK-410.',
    '',
    '## Acceptance Criteria',
    '',
    '- [ ] Expected behavior is verified.',
    '',
    '## Testing Seams',
    '',
    'The `git.integrationBranch` manifest field (not a real path) and the real',
    '`workbench/tools/spec-workbench.mjs` selection seam.',
    ''
  ].join('\n');
}

function wikiClaimFixture() {
  return [
    '---',
    'type: meta',
    'status: active',
    'sensitivity: normal',
    'knowledge_role: canonical',
    'provenance:',
    '  - S-00H TK-005 Packet fixture',
    'source_paths:',
    '  - workbench/tools/example-capability.mjs',
    'last_verified: 2026-09-16',
    '---',
    '',
    '# Example Capability',
    '',
    '## Claim',
    '',
    'Reconciled claim text lives here, repaired by TK-402.',
    '',
    '## Evidence and Sources',
    '',
    '- fixture only',
    ''
  ].join('\n');
}

// ============================================================================
// S-00H TK-002 remaining gap, closed by TK-003: `updateFields` in
// spec-workbench.mjs wrote a Spec header field with a raw string replacement,
// which expands `$&`, `` $` ``, `$'` and `$$` in the value against the very
// header line it replaces - the same defect task-record.mjs's
// `updateTaskFields` was already fixed for (S-00H TK-001). A table-backed
// Spec's header fields (`Owner`, `Latest event`, `Next gate`) are the ones
// `claimWork`/`closeTask` write through `updateFields`, so an agent name or a
// proof string naming a replacement pattern is the live trigger.
// ============================================================================
{
  const dollarRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'dollar-header-'));
  try {
    fs.mkdirSync(path.join(dollarRoot, 'specs/S-701-fixture'), { recursive: true });
    fs.writeFileSync(path.join(dollarRoot, 'specs/S-701-fixture/SPEC.md'), fixtureSpec().replaceAll('S-001', 'S-701'));
    claimWork(dollarRoot, 'S-701', { agent: 'agent $& sees $1 and $$', date: '2026-09-17' });
    const afterClaim = fs.readFileSync(path.join(dollarRoot, 'specs/S-701-fixture/SPEC.md'), 'utf8');
    assert.match(afterClaim, /^\*\*Owner:\*\* agent \$& sees \$1 and \$\$$/m,
      'a claim agent naming a replacement pattern is written into the Owner header field literally, never expanded against the line it replaces');
    assert.match(afterClaim, /^\*\*Latest event:\*\* TK-001 claimed by agent \$& sees \$1 and \$\$\.$/m,
      'the same literal agent value is written into Latest event literally');

    closeTask(dollarRoot, 'S-701', {
      proof: 'see $& and $` output', docs: 'Docs checked; no update needed', remainingGap: 'none', date: '2026-09-17'
    });
    const afterClose = fs.readFileSync(path.join(dollarRoot, 'specs/S-701-fixture/SPEC.md'), 'utf8');
    assert.match(afterClose, /^\*\*Next gate:\*\* Confirm acceptance criteria and completion result\.$/m,
      'Next gate is written correctly once no slice remains');
    assert.match(afterClose, /\| TK-001 \| First slice \| done \| none \| see \$& and \$` output \|/,
      'a proof naming a replacement pattern lands in the table cell literally, not expanded against the row it replaces');
    console.log('ok - updateFields writes a Spec header field literally, never expanding a $-pattern value against the line it replaces');
  } finally {
    fs.rmSync(dollarRoot, { recursive: true, force: true });
  }
}

// ============================================================================
// S-00H TK-003: repository-wide Ticket-vocabulary sweep, plus the parser
// header-compatibility and historical byte-identity proofs the rename needs.
// Delimited block, appended last, so a concurrent lane's own tests land above
// this without conflict.
// ============================================================================
{
  const sweepRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

  // Every entry names one specific line pattern this task deliberately
  // leaves saying "ticket", with the reason a reviewer can check against the
  // file itself. Nothing else may say it. See this task's return for the
  // same list with fuller reasoning.
  const TICKET_SWEEP_ALLOWLIST = [
    { file: 'workbench/tools/workbench-layout.mjs', match: 'to-tickets',
      reason: "S-00H TK-004: legacyCoreSkills (and the frozen v3.0.0-v3.2.0 policy rows built from it) preserves the bundle exactly as each of those historical releases actually declared it in a real manifest.json, so validateManifest still recognizes that shape; only the live coreSkills export renames the current bundle to to-tasks, and only that export feeds this room's own manifest.json" },
    { file: 'tools/test-skill-catalog.mjs', match: 'local-ticket-template',
      reason: 'a negative assertion guarding against one specific retained foreign-import artifact name inside skills/to-tasks/SKILL.md; not live Workbench vocabulary' }
  ];

  function sweepIsAllowed(relFile, line) {
    return TICKET_SWEEP_ALLOWLIST.some((entry) => entry.file === relFile && line.includes(entry.match));
  }

  function sweepWalk(dir) {
    let out = [];
    if (!fs.existsSync(dir)) return out;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) out = out.concat(sweepWalk(full));
      else if (/\.(mjs|py)$/.test(entry.name)) out.push(full);
    }
    return out;
  }

  // This file is excluded from its own scan. It necessarily carries the
  // allow-list text above (which must quote what it excuses to be checkable)
  // and, further down, the deliberately historical `Ticket`-header and
  // `TK-### | Ticket closed` fixtures the handoff's allow-list category one
  // exists for; allow-listing every one of those lines here would add a
  // second copy of the same list with no independent check behind it. Every
  // *other* touched file is still scanned in full, including this file's own
  // non-test sibling `spec-workbench.mjs`.
  //
  // S-00H TK-004 added a sibling sweep, tools/test-controls-vocabulary-sweep.mjs,
  // covering root controls/skills/templates rather than workbench/tools and
  // tools, plus a matching regression sweep block appended inside
  // tools/test-genesis-from-decisions.mjs, tools/test-workbench-round-trip.mjs
  // and tools/test-workbench-adoption.mjs (a generated or adopted room must
  // not carry the retired vocabulary either). All four are excluded here for
  // the identical reason this file excludes itself: each necessarily carries
  // the literal `ticket` pattern and messages that make it checkable, and
  // each is its own independent check rather than a second copy of this list
  // with nothing behind it.
  const selfPath = path.relative(sweepRoot, fileURLToPath(import.meta.url)).split(path.sep).join('/');
  const siblingSweepPaths = new Set([
    'tools/test-controls-vocabulary-sweep.mjs',
    'tools/test-genesis-from-decisions.mjs',
    'tools/test-workbench-round-trip.mjs',
    'tools/test-workbench-adoption.mjs'
  ]);
  const sweepViolations = [];
  for (const dir of ['workbench/tools', 'tools'].map((d) => path.join(sweepRoot, d))) {
    for (const file of sweepWalk(dir)) {
      const relFile = path.relative(sweepRoot, file).split(path.sep).join('/');
      if (relFile === selfPath || siblingSweepPaths.has(relFile)) continue;
      fs.readFileSync(file, 'utf8').split('\n').forEach((line, index) => {
        if (/ticket/i.test(line) && !sweepIsAllowed(relFile, line)) {
          sweepViolations.push(`${relFile}:${index + 1}: ${line.trim()}`);
        }
      });
    }
  }
  assert.deepEqual(
    sweepViolations,
    [],
    `live "ticket" vocabulary must not appear in workbench/tools or tools outside the allow-list:\n${sweepViolations.join('\n')}`
  );
  // A stale allow-list entry (naming text that has since been removed or
  // rewritten) would silently stop excusing anything and just as silently
  // stop being checked; catch that rather than let the allow-list rot.
  for (const entry of TICKET_SWEEP_ALLOWLIST) {
    const content = fs.readFileSync(path.join(sweepRoot, entry.file), 'utf8');
    assert.ok(content.includes(entry.match), `stale allow-list entry: ${entry.file} no longer contains ${JSON.stringify(entry.match)}`);
  }
  console.log('ok - repository-wide ticket-vocabulary sweep found no live vocabulary outside the allow-list');
}

{
  // The slice-table header cell is decorative; `parseSpecPacket` only reads
  // the `TK-###` row prefix (spec-packet.mjs), so a Spec written with either
  // header spells the same rows. A newly written Spec uses `Task`; a Spec
  // already on disk before this rename used `Ticket`, and both must parse.
  const headerRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'header-compat-'));
  try {
    const bodyFor = (header) => [
      '# S-501 - Header Compatibility Fixture',
      '',
      '**Spec ID:** S-501',
      '**Status:** active',
      '**Priority:** 0',
      '**Owner:** agent',
      '**Updated:** 2026-09-17',
      '**Catalog description:** Proves either slice-table header parses.',
      '**Blockers:** none',
      '**Latest event:** Spec activated.',
      '**Next gate:** Complete TK-001.',
      '',
      '## Vertical Implementation Slices',
      '',
      `| ${header} | Slice | Status | Blockers | Proof |`,
      '|---|---|---|---|---|',
      '| TK-001 | First slice | ready | none | pending |',
      '',
      '## Acceptance Criteria',
      '',
      '- [ ] Expected behavior is verified.',
      ''
    ].join('\n');
    const taskHeaderPath = path.join(headerRoot, 'task-header.md');
    const ticketHeaderPath = path.join(headerRoot, 'ticket-header.md');
    fs.writeFileSync(taskHeaderPath, bodyFor('Task'));
    fs.writeFileSync(ticketHeaderPath, bodyFor('Ticket'));
    const fromTaskHeader = parseSpecPacket(fs.readFileSync(taskHeaderPath, 'utf8'), taskHeaderPath, headerRoot);
    const fromTicketHeader = parseSpecPacket(fs.readFileSync(ticketHeaderPath, 'utf8'), ticketHeaderPath, headerRoot);
    assert.deepEqual(fromTaskHeader.rows, fromTicketHeader.rows,
      'a `Task` header and a historical `Ticket` header parse to the identical slice rows');
    assert.equal(fromTaskHeader.rows[0].id, 'TK-001');
    console.log('ok - parseSpecPacket accepts both the Task and the historical Ticket slice-table header');
  } finally {
    fs.rmSync(headerRoot, { recursive: true, force: true });
  }
}

{
  // Extends the existing "a completed Spec's historical table is
  // byte-identical after every command" proof (above, using S-001-fixture,
  // which now writes a `Task` header) with a second fixture that keeps the
  // pre-rename `Ticket` header, a `TK-###` row and a `Ticket closed` evidence
  // row, and asserts it survives every lifecycle command byte-identical
  // beside a sibling active Spec that exercises them.
  const historicalRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'historical-byte-identity-'));
  initGitRoot(historicalRoot);
  try {
    fs.mkdirSync(path.join(historicalRoot, 'specs/S-601-historical'), { recursive: true });
    const historicalSpec = [
      '# S-601 - Historical Ticket-Header Capability',
      '',
      '**Spec ID:** S-601',
      '**Status:** complete',
      '**Priority:** 0',
      '**Owner:** agent',
      '**Updated:** 2026-07-01',
      '**Catalog description:** Proves a historical Ticket header and row survive untouched.',
      '**Blockers:** none',
      '**Latest event:** Spec completed and removed from the hot board.',
      '**Next gate:** none',
      '',
      '## Vertical Implementation Slices',
      '',
      '| Ticket | Slice | Status | Blockers | Proof |',
      '|---|---|---|---|---|',
      '| TK-001 | First slice | done | none | node test |',
      '',
      '## Acceptance Criteria',
      '',
      '- [x] Expected behavior is verified.',
      '',
      '## Append-Only Evidence And Execution Log',
      '',
      '| Date | Ticket | Event | Verification | Docs | Remaining gap |',
      '|---|---|---|---|---|---|',
      '| 2026-07-01 | TK-001 | Ticket closed | node test | Docs checked; no update needed | none |',
      '',
      '## Completion Result',
      '',
      'Pass: historical fixture completed.',
      '',
      '## Supersession',
      '',
      '- Supersedes: none',
      '- Superseded by: none',
      ''
    ].join('\n');
    fs.writeFileSync(path.join(historicalRoot, 'specs/S-601-historical/SPEC.md'), historicalSpec);
    fs.writeFileSync(path.join(historicalRoot, 'BLUEPRINT.md'), ['# Fixture Blueprint', '', '<!-- spec-catalog:start -->', '<!-- spec-catalog:end -->'].join('\n'));
    fs.writeFileSync(path.join(historicalRoot, 'TASKBOARD.md'), ['# Fixture Taskboard', '', '<!-- hot-specs:start -->', '<!-- hot-specs:end -->'].join('\n'));
    // The sibling carries two rows so `close` has one to finish and
    // `convert-tasks` still has an unfinished one left to convert afterward.
    fs.mkdirSync(path.join(historicalRoot, 'specs/S-602-sibling'), { recursive: true });
    fs.writeFileSync(
      path.join(historicalRoot, 'specs/S-602-sibling/SPEC.md'),
      fixtureSpec().replaceAll('S-001', 'S-602').replace(
        '| TK-001 | First slice | ready | none | pending |',
        '| TK-001 | First slice | ready | none | pending |\n| TK-002 | Second slice | ready | TK-001 | pending |'
      )
    );

    const readHistorical = () => fs.readFileSync(path.join(historicalRoot, 'specs/S-601-historical/SPEC.md'), 'utf8');
    const beforeAnyCommand = readHistorical();

    // The fixture's BLUEPRINT.md/TASKBOARD.md generated regions start empty,
    // so the first command exercised is `render` itself, establishing them;
    // it must not touch the historical Spec either.
    render(historicalRoot);
    assert.equal(readHistorical(), beforeAnyCommand, 'the first render never rewrites the historical Spec');
    assert.deepEqual(doctor(historicalRoot), [], 'a historical Ticket-header completed Spec beside an active sibling passes doctor');
    assert.equal(readHistorical(), beforeAnyCommand, 'doctor never rewrites the historical Spec');

    assert.equal(nextWork(historicalRoot).specId, 'S-602', 'selection is unaffected by the historical completed Spec');
    assert.equal(readHistorical(), beforeAnyCommand, 'next never rewrites the historical Spec');

    claimWork(historicalRoot, 'S-602', { agent: 'codex', date: '2026-09-17' });
    assert.equal(readHistorical(), beforeAnyCommand, 'claim on the sibling never rewrites the historical Spec');

    closeTask(historicalRoot, 'S-602', {
      proof: 'node test', docs: 'Docs checked; no update needed', remainingGap: 'none', date: '2026-09-17'
    });
    assert.equal(readHistorical(), beforeAnyCommand, 'close on the sibling never rewrites the historical Spec');

    render(historicalRoot);
    assert.equal(readHistorical(), beforeAnyCommand, 'render never rewrites the historical Spec');
    assert.deepEqual(doctor(historicalRoot), [], 'doctor stays clean after render');
    assert.equal(readHistorical(), beforeAnyCommand, 'a second doctor run never rewrites the historical Spec');

    convertSpecSlices(historicalRoot, 'S-602');
    assert.equal(readHistorical(), beforeAnyCommand, 'convert-tasks on the sibling never rewrites the historical Spec');
    assert.deepEqual(doctor(historicalRoot), [], 'doctor stays clean after convert-tasks');
    assert.equal(readHistorical(), beforeAnyCommand, 'a doctor run after convert-tasks never rewrites the historical Spec');

    // (h) S-00H TK-007: the newly-converted TK-002 record is claimed and
    // given a Receipt row by the `receipt` verb; the historical Spec stays
    // byte-identical through both, exactly as it did through every other
    // command above.
    claimWork(historicalRoot, 'S-602', { agent: 'codex', date: '2026-09-17' });
    assert.equal(readHistorical(), beforeAnyCommand, 'claiming the converted TK-002 record never rewrites the historical Spec');

    const receipted = receiptTask(historicalRoot, 'S-602', {
      task: 'TK-002', tests: 'tools/test-fixture.mjs: pass', docs: 'none', remainingGap: 'none'
    });
    assert.equal(receipted.row.run, 1, 'the receipt verb reaches the converted record and appends its first row');
    assert.equal(readHistorical(), beforeAnyCommand, 'the receipt verb on the sibling never rewrites the historical Spec');

    render(historicalRoot);
    assert.equal(readHistorical(), beforeAnyCommand, 'rendering the new Receipt-derived board signal never rewrites the historical Spec');
    assert.deepEqual(doctor(historicalRoot), [], 'doctor stays clean once the board reflects the receipt verb');
    assert.equal(readHistorical(), beforeAnyCommand, 'a doctor run after the receipt verb never rewrites the historical Spec');

    console.log('ok - a historical Ticket-header completed Spec is byte-identical after render, doctor, next, claim, close, render again, doctor, convert-tasks, claim and receipt');
  } finally {
    fs.rmSync(historicalRoot, { recursive: true, force: true });
  }
}

// ============================================================================
// S-00H TK-007: the hot board's derived Receipt signal. Per active
// record-backed Task, the board renders its status, run count and the latest
// run's branch, short SHA (seven characters) and dirty-file count - the
// symptom - while the full run table stays in the Task's own Receipt rows -
// the story. A Task with no Receipt rows yet renders exactly as before this
// task, and the board never carries the Receipt header row, any Receipt row,
// or the column names that module writes.
//
// This block builds each Task record's Receipt with the pure
// `appendReceiptRowToContent` content-level seam directly, so every rendered
// value (branch, short SHA, run count, dirty count) is exact and controlled;
// no live Git process is needed to prove what the board renders.
// ============================================================================
{
  const boardRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'board-receipt-signal-'));
  try {
    fs.writeFileSync(path.join(boardRoot, 'BLUEPRINT.md'), ['# Fixture Blueprint', '', '<!-- spec-catalog:start -->', '<!-- spec-catalog:end -->'].join('\n'));
    fs.writeFileSync(path.join(boardRoot, 'TASKBOARD.md'), ['# Fixture Taskboard', '', '<!-- hot-specs:start -->', '<!-- hot-specs:end -->'].join('\n'));

    function writeTaskWithRuns(specDir, taskId, { specId, slice, status, runs }) {
      let content = taskRecordFixture({
        id: taskId, specId, slice, status, blockers: 'none', destination: `spec-acceptance: ${specId} Acceptance Criteria`
      });
      for (const run of runs) content = appendReceiptRowToContent(content, run);
      const filePath = path.join(boardRoot, specDir, 'tasks', taskId, 'TASK.md');
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, content);
    }

    // An in-progress Task older than one day is `stale-claim` (attention,
    // never blocking), which is correct diagnostic behavior but not what this
    // block is proving; every fixture's `Updated` header is moved to today so
    // `doctor` stays clean for the one thing this block does test.
    const todayStr = new Date().toISOString().slice(0, 10);
    function freshRecordBackedSpec(id) {
      return recordBackedSpec(id).replace('**Updated:** 2026-07-12', `**Updated:** ${todayStr}`);
    }

    // (a) An in-progress Task with two Receipt rows: run count, latest
    // branch, short SHA and dirty count all appear in the current-slice
    // cell. The two rows' SHAs differ in their first seven characters (not
    // only in dirty count), so "latest row" is pinned by the SHA the board
    // shows, not merely by which dirty count happens to appear.
    writeAt(boardRoot, 'specs/S-711-two-runs/SPEC.md', freshRecordBackedSpec('S-711'));
    writeTaskWithRuns('specs/S-711-two-runs', 'TK-002', {
      specId: 'S-711', slice: 'Two-run slice', status: 'in-progress',
      runs: [
        { branch: 'claude/x', headSha: 'ab12cd3'.padEnd(40, '0'), upstream: 'ahead 1 behind 0', dirty: 2, testsRun: 'first pass', docsTouched: 'none', remainingGap: 'open: first run' },
        { branch: 'claude/x', headSha: 'ffeeddc'.padEnd(40, '1'), upstream: 'ahead 2 behind 0', dirty: 0, testsRun: 'second pass', docsTouched: 'none', remainingGap: 'none' }
      ]
    });

    // (b) A Task with exactly one run, for a glance-level contrast with the
    // two-run and three-run Tasks below.
    writeAt(boardRoot, 'specs/S-712-one-run/SPEC.md', freshRecordBackedSpec('S-712'));
    writeTaskWithRuns('specs/S-712-one-run', 'TK-002', {
      specId: 'S-712', slice: 'One-run slice', status: 'in-progress',
      runs: [
        { branch: 'claude/y', headSha: 'cc'.repeat(20), upstream: 'none', dirty: 0, testsRun: 'pass', docsTouched: 'none', remainingGap: 'none' }
      ]
    });

    // (b) A Task with three runs whose latest run is dirty: the run count and
    // the dirty count must both be visible.
    writeAt(boardRoot, 'specs/S-713-three-runs/SPEC.md', freshRecordBackedSpec('S-713'));
    writeTaskWithRuns('specs/S-713-three-runs', 'TK-002', {
      specId: 'S-713', slice: 'Three-run slice', status: 'in-progress',
      runs: [
        { branch: 'claude/z', headSha: 'd1'.repeat(20), upstream: 'none', dirty: 0, testsRun: 'pass 1', docsTouched: 'none', remainingGap: 'open: run 1' },
        { branch: 'claude/z', headSha: 'd2'.repeat(20), upstream: 'none', dirty: 1, testsRun: 'pass 2', docsTouched: 'none', remainingGap: 'open: run 2' },
        { branch: 'claude/z', headSha: 'd3'.repeat(20), upstream: 'none', dirty: 5, testsRun: 'pass 3', docsTouched: 'none', remainingGap: 'open: run 3' }
      ]
    });

    // (c) A Task with no Receipt rows at all: renders exactly as before this
    // task, with no run/branch/SHA/dirty suffix of any kind.
    writeAt(boardRoot, 'specs/S-714-no-runs/SPEC.md', freshRecordBackedSpec('S-714'));
    writeAt(boardRoot, 'specs/S-714-no-runs/tasks/TK-002/TASK.md', taskRecordFixture({
      id: 'TK-002', specId: 'S-714', slice: 'No-run slice', status: 'in-progress', blockers: 'none',
      destination: 'spec-acceptance: S-714 Acceptance Criteria'
    }));

    render(boardRoot);
    const board = fs.readFileSync(path.join(boardRoot, 'TASKBOARD.md'), 'utf8');

    assert.match(
      board,
      /\| \[S-711\]\(specs\/S-711-two-runs\/SPEC\.md\) \| TK-002: Two-run slice \(in-progress; runs 2, claude\/x @ ffeeddc, dirty 0\) \|/,
      '(a) an in-progress Task with two Receipt rows renders its run count and the latest run\'s branch, short SHA and dirty count'
    );
    assert.doesNotMatch(board, /ab12cd3/,
      '(a) the board shows only the latest run\'s SHA, never the earlier row\'s, pinning "latest" by SHA and not only by dirty count');
    assert.match(
      board,
      /\| \[S-712\]\(specs\/S-712-one-run\/SPEC\.md\) \| TK-002: One-run slice \(in-progress; runs 1, claude\/y @ ccccccc, dirty 0\) \|/,
      '(b) a one-run Task is distinguishable at a glance from a two- or three-run Task'
    );
    assert.match(
      board,
      /\| \[S-713\]\(specs\/S-713-three-runs\/SPEC\.md\) \| TK-002: Three-run slice \(in-progress; runs 3, claude\/z @ d3d3d3d, dirty 5\) \|/,
      '(b) a three-run Task shows its own run count, and a dirty latest run shows its dirty count'
    );
    assert.match(
      board,
      /\| \[S-714\]\(specs\/S-714-no-runs\/SPEC\.md\) \| TK-002: No-run slice \(in-progress\) \|/,
      '(c) a Task with no Receipt rows renders exactly as it did before this task, with no run suffix'
    );

    // (d) The board never contains the Receipt header row, any Receipt row,
    // or the column names that module writes - only the derived signal.
    assert.doesNotMatch(board, /\| Run \| Branch \| HEAD SHA \| Upstream \| Dirty \| Tests \| Docs touched \| Remaining gap \| Checksum \|/,
      '(d) the board never contains the Receipt header row this module writes');
    assert.doesNotMatch(board, /\bChecksum\b/, '(d) the board never contains the Receipt column name Checksum');
    assert.doesNotMatch(board, /\| Run \|/, '(d) the board never contains the Receipt column name Run as a table header');
    assert.doesNotMatch(board, /## Receipt/, '(d) the board never contains the Receipt section heading');
    assert.doesNotMatch(board, /open: first run|open: run 1|open: run 2|open: run 3/,
      '(d) the board never contains Receipt row text such as a remaining-gap value');

    assert.deepEqual(doctor(boardRoot), [], 'a room whose Tasks carry Receipt rows still passes doctor');

    console.log('ok - the hot board derives a per-Task run/branch/SHA/dirty signal from Receipt rows, never the full run table');
  } finally {
    fs.rmSync(boardRoot, { recursive: true, force: true });
  }
}

// ============================================================================
// Corrective review finding 3: the acceptance line says the board projects
// each *active* Task's run count and latest branch/SHA/dirty count, but
// `renderHotBoard` kept one selected slice per Spec, so a second in-progress
// Task on the same Spec was invisible. When a Spec has more than one
// in-progress Task, the current-slice cell lists every one of them, each
// with its own signal when it has rows, joined by "; " in visible-id order.
// A Spec with zero or one in-progress Task renders exactly as before this
// finding (proven above); a ready or blocked Task is never listed beside an
// in-progress one.
// ============================================================================
{
  const multiRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'board-multi-task-'));
  try {
    fs.writeFileSync(path.join(multiRoot, 'BLUEPRINT.md'), ['# Fixture Blueprint', '', '<!-- spec-catalog:start -->', '<!-- spec-catalog:end -->'].join('\n'));
    fs.writeFileSync(path.join(multiRoot, 'TASKBOARD.md'), ['# Fixture Taskboard', '', '<!-- hot-specs:start -->', '<!-- hot-specs:end -->'].join('\n'));
    const todayStr = new Date().toISOString().slice(0, 10);
    writeAt(multiRoot, 'specs/S-741-multi-task/SPEC.md',
      recordBackedSpec('S-741').replace('**Updated:** 2026-07-12', `**Updated:** ${todayStr}`));

    // TK-002: in-progress with one Receipt row (its own signal).
    let tk002 = taskRecordFixture({
      id: 'TK-002', specId: 'S-741', slice: 'First in-progress slice', status: 'in-progress', blockers: 'none',
      destination: 'spec-acceptance: S-741 Acceptance Criteria'
    });
    tk002 = appendReceiptRowToContent(tk002, {
      branch: 'claude/a', headSha: '1111111'.padEnd(40, '0'), upstream: 'none', dirty: 0,
      testsRun: 'pass', docsTouched: 'none', remainingGap: 'none'
    });
    writeAt(multiRoot, 'specs/S-741-multi-task/tasks/TK-002/TASK.md', tk002);

    // TK-003: also in-progress, no Receipt rows yet (no signal at all).
    writeAt(multiRoot, 'specs/S-741-multi-task/tasks/TK-003/TASK.md', taskRecordFixture({
      id: 'TK-003', specId: 'S-741', slice: 'Second in-progress slice', status: 'in-progress', blockers: 'none',
      destination: 'spec-acceptance: S-741 Acceptance Criteria'
    }));

    // TK-004: ready, a distractor that must never be listed beside the two
    // in-progress Tasks once there is more than one of them.
    writeAt(multiRoot, 'specs/S-741-multi-task/tasks/TK-004/TASK.md', taskRecordFixture({
      id: 'TK-004', specId: 'S-741', slice: 'Not yet started slice', status: 'ready', blockers: 'none',
      destination: 'spec-acceptance: S-741 Acceptance Criteria'
    }));

    render(multiRoot);
    const board = fs.readFileSync(path.join(multiRoot, 'TASKBOARD.md'), 'utf8');

    assert.match(
      board,
      /\| \[S-741\]\(specs\/S-741-multi-task\/SPEC\.md\) \| TK-002: First in-progress slice \(in-progress; runs 1, claude\/a @ 1111111, dirty 0\); TK-003: Second in-progress slice \(in-progress\) \|/,
      'a Spec with two in-progress Tasks lists both, each with its own signal, joined by "; " in visible-id order'
    );
    assert.doesNotMatch(board, /TK-004/,
      'a ready Task is never listed beside two in-progress Tasks on the same Spec');

    assert.deepEqual(doctor(multiRoot), [], 'a room with two in-progress Tasks on one Spec still passes doctor');

    console.log('ok - the board lists every in-progress Task on a Spec, each with its own signal, and never mixes in a ready or blocked Task');
  } finally {
    fs.rmSync(multiRoot, { recursive: true, force: true });
  }
}

// ============================================================================
// S-00H TK-007: `close` is the Receipt's first writer. On a record-backed
// Task it appends one Receipt row carrying the close's own tests, docs and
// remaining-gap values with live Git facts, before the Spec's own
// append-only evidence row is appended; on a table-backed Spec it writes no
// Receipt anywhere, because a table row has no record to carry one on.
// ============================================================================
{
  const closeRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'close-receipt-'));
  initGitRoot(closeRoot);
  try {
    const todayStr = new Date().toISOString().slice(0, 10);
    fs.writeFileSync(path.join(closeRoot, 'BLUEPRINT.md'), ['# Fixture Blueprint', '', '<!-- spec-catalog:start -->', '<!-- spec-catalog:end -->'].join('\n'));
    fs.writeFileSync(path.join(closeRoot, 'TASKBOARD.md'), ['# Fixture Taskboard', '', '<!-- hot-specs:start -->', '<!-- hot-specs:end -->'].join('\n'));
    writeAt(closeRoot, 'specs/S-721-close-receipt/SPEC.md', recordBackedSpec('S-721').replace('**Updated:** 2026-07-12', `**Updated:** ${todayStr}`));
    writeAt(closeRoot, 'specs/S-721-close-receipt/tasks/TK-002/TASK.md', taskRecordFixture({
      id: 'TK-002', specId: 'S-721', slice: 'Closing slice', status: 'in-progress', blockers: 'none',
      destination: 'spec-acceptance: S-721 Acceptance Criteria'
    }));

    // Every one of BLUEPRINT.md, TASKBOARD.md and the wholly-untracked
    // specs/ directory (collapsed to one porcelain line by default, not one
    // line per file inside it) is dirty before close runs anything: three,
    // not four, per `git status --porcelain`.
    const expectedBranch = execFileSync('git', ['-C', closeRoot, 'rev-parse', '--abbrev-ref', 'HEAD'], { encoding: 'utf8' }).trim();
    const expectedSha = execFileSync('git', ['-C', closeRoot, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();

    // (e) close on a record-backed Task appends one Receipt row carrying the
    // close's tests, docs and remaining-gap values with live Git facts, and
    // the Spec's evidence row is still appended.
    closeTask(closeRoot, 'S-721', {
      proof: 'tools/test-fixture.mjs: pass', docs: 'Docs checked; no update needed', remainingGap: 'none', date: todayStr
    });
    const taskRecordPath = path.join(closeRoot, 'specs/S-721-close-receipt/tasks/TK-002/TASK.md');
    const taskAfterClose = fs.readFileSync(taskRecordPath, 'utf8');
    const rows = readReceiptFromFile(taskRecordPath);
    assert.equal(rows.length, 1, '(e) close appends exactly one Receipt row to a record-backed Task');
    assert.equal(rows[0].testsRun, 'tools/test-fixture.mjs: pass', "(e) the Receipt row's Tests column carries close's --proof value");
    assert.equal(rows[0].docsTouched, 'Docs checked; no update needed', "(e) the Receipt row's Docs touched column carries close's --docs value");
    assert.equal(rows[0].remainingGap, 'none', "(e) the Receipt row's Remaining gap column carries close's --remaining-gap value");
    assert.equal(rows[0].branch, expectedBranch, '(e) the Receipt row reads its branch from live Git facts, not a caller-supplied value');
    assert.equal(rows[0].headSha, expectedSha, '(e) the Receipt row reads its HEAD SHA from live Git facts, not a caller-supplied value');
    assert.equal(rows[0].dirty, 3, '(e) the Receipt row reads its dirty file count from live Git facts, not a caller-supplied value');
    assert.match(taskAfterClose, /\*\*Status:\*\* done/, '(e) close still flips the Task record itself to done');
    assert.match(
      fs.readFileSync(path.join(closeRoot, 'specs/S-721-close-receipt/SPEC.md'), 'utf8'),
      /\| .+ \| TK-002 \| Task closed \| tools\/test-fixture\.mjs: pass \|/,
      "(e) close still appends the Spec's own append-only evidence row for a record-backed Spec"
    );

    // (f) close on a table-backed Spec writes no Receipt anywhere: no
    // `## Receipt` section in the Spec file, and no tasks/ directory (and
    // therefore no Task record file) ever created for it.
    writeAt(closeRoot, 'specs/S-722-table-only/SPEC.md',
      fixtureSpec().replaceAll('S-001', 'S-722').replace('**Updated:** 2026-07-12', `**Updated:** ${todayStr}`));
    closeTask(closeRoot, 'S-722', {
      proof: 'tools/test-fixture.mjs: pass', docs: 'Docs checked; no update needed', remainingGap: 'none', date: todayStr
    });
    assert.doesNotMatch(
      fs.readFileSync(path.join(closeRoot, 'specs/S-722-table-only/SPEC.md'), 'utf8'),
      /## Receipt/,
      '(f) close on a table-backed Spec writes no Receipt section into the Spec file'
    );
    assert.equal(fs.existsSync(path.join(closeRoot, 'specs/S-722-table-only/tasks')), false,
      '(f) close on a table-backed Spec never creates a tasks/ directory, so no Receipt file exists for it anywhere');

    // Corrective review finding 1: a failing Receipt append (here, an
    // already-altered earlier row, which fails closed by design) must leave
    // the record's Status, Proof and Receipt untouched, and must append no
    // Spec evidence row. This also pins the *order* of the two writes: if a
    // future edit moved the Receipt append to after the Spec's evidence
    // append, the evidence row would already be on disk by the time the
    // append throws, and the second assertion below would catch it.
    writeAt(closeRoot, 'specs/S-723-failing-append/SPEC.md',
      recordBackedSpec('S-723').replace('**Updated:** 2026-07-12', `**Updated:** ${todayStr}`));
    const failingTaskPath = path.join(closeRoot, 'specs/S-723-failing-append/tasks/TK-002/TASK.md');
    let corrupted = taskRecordFixture({
      id: 'TK-002', specId: 'S-723', slice: 'Corrupted-receipt slice', status: 'in-progress', blockers: 'none',
      destination: 'spec-acceptance: S-723 Acceptance Criteria'
    });
    corrupted = appendReceiptRowToContent(corrupted, {
      branch: 'claude/x', headSha: 'a'.repeat(40), upstream: 'none', dirty: 0,
      testsRun: 'tools/test-fixture.mjs: pass', docsTouched: 'none', remainingGap: 'none'
    });
    // Alter one byte of an already-written row: its checksum no longer
    // matches its recorded fields, so any reader of this Receipt fails
    // closed rather than silently accepting or repairing it.
    corrupted = corrupted.replace('tools/test-fixture.mjs: pass', 'tools/test-fixture.mjs: TAMPERED');
    writeAt(closeRoot, 'specs/S-723-failing-append/tasks/TK-002/TASK.md', corrupted);
    const failingSpecPath = path.join(closeRoot, 'specs/S-723-failing-append/SPEC.md');
    const taskBeforeFailure = fs.readFileSync(failingTaskPath, 'utf8');
    const specBeforeFailure = fs.readFileSync(failingSpecPath, 'utf8');

    assert.throws(
      () => closeTask(closeRoot, 'S-723', {
        proof: 'tools/test-fixture.mjs: pass (rerun)', docs: 'Docs checked; no update needed', remainingGap: 'none', date: todayStr
      }),
      /altered|checksum/i,
      'close propagates the Receipt chain failure rather than swallowing it'
    );
    assert.equal(fs.readFileSync(failingTaskPath, 'utf8'), taskBeforeFailure,
      "a failing Receipt append leaves the Task record's Status, Proof and Receipt byte-identical to before close ran");
    assert.equal(fs.readFileSync(failingSpecPath, 'utf8'), specBeforeFailure,
      'a failing Receipt append leaves the Spec byte-identical: no evidence row is appended when the Receipt append never lands');

    console.log('ok - close appends a Receipt row for a record-backed Task with live Git facts, and writes no Receipt for a table-backed Spec');
  } finally {
    fs.rmSync(closeRoot, { recursive: true, force: true });
  }
}

// ============================================================================
// S-00H TK-007: the `receipt` verb, the Receipt's second (proactive) writer.
// It appends one row to a named in-progress Task record without touching
// that Task's Status or the owning Spec at all, refuses a Task that is not
// in-progress, and a second call appends rather than overwrites.
// ============================================================================
{
  const receiptRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'receipt-verb-'));
  initGitRoot(receiptRoot);
  try {
    const todayStr = new Date().toISOString().slice(0, 10);
    fs.writeFileSync(path.join(receiptRoot, 'BLUEPRINT.md'), ['# Fixture Blueprint', '', '<!-- spec-catalog:start -->', '<!-- spec-catalog:end -->'].join('\n'));
    fs.writeFileSync(path.join(receiptRoot, 'TASKBOARD.md'), ['# Fixture Taskboard', '', '<!-- hot-specs:start -->', '<!-- hot-specs:end -->'].join('\n'));
    writeAt(receiptRoot, 'specs/S-731-receipt-verb/SPEC.md', recordBackedSpec('S-731').replace('**Updated:** 2026-07-12', `**Updated:** ${todayStr}`));
    writeAt(receiptRoot, 'specs/S-731-receipt-verb/tasks/TK-002/TASK.md', taskRecordFixture({
      id: 'TK-002', specId: 'S-731', slice: 'Mid-run slice', status: 'in-progress', blockers: 'none',
      destination: 'spec-acceptance: S-731 Acceptance Criteria'
    }));
    const specPath = path.join(receiptRoot, 'specs/S-731-receipt-verb/SPEC.md');
    const taskPath = path.join(receiptRoot, 'specs/S-731-receipt-verb/tasks/TK-002/TASK.md');
    const specBefore = fs.readFileSync(specPath, 'utf8');

    const result = receiptTask(receiptRoot, 'S-731', {
      task: 'TK-002', tests: 'tools/test-fixture.mjs: pass (mid-run)', docs: 'none', remainingGap: 'open: still implementing'
    });
    assert.equal(result.specId, 'S-731');
    assert.equal(result.taskId, 'TK-002');
    assert.equal(result.row.run, 1, 'the receipt verb returns the row it wrote');
    assert.equal(result.row.testsRun, 'tools/test-fixture.mjs: pass (mid-run)');
    assert.equal(result.row.remainingGap, 'open: still implementing');

    const rowsAfterFirst = readReceiptFromFile(taskPath);
    assert.equal(rowsAfterFirst.length, 1, 'the receipt verb appends one row to the named in-progress Task');
    assert.match(fs.readFileSync(taskPath, 'utf8'), /\*\*Status:\*\* in-progress/,
      'the receipt verb never touches the Task\'s own Status');
    assert.equal(fs.readFileSync(specPath, 'utf8'), specBefore, 'the receipt verb never touches the owning Spec at all');

    // A second call appends rather than overwrites.
    receiptTask(receiptRoot, 'S-731', {
      task: 'TK-002', tests: 'tools/test-fixture.mjs: pass (second mid-run)', docs: 'none', remainingGap: 'none'
    });
    const rowsAfterSecond = readReceiptFromFile(taskPath);
    assert.equal(rowsAfterSecond.length, 2, 'a second receipt call appends a second row rather than overwriting the first');
    assert.equal(rowsAfterSecond[0].testsRun, 'tools/test-fixture.mjs: pass (mid-run)', 'the first row is unchanged after a second call');
    assert.equal(rowsAfterSecond[1].run, 2);

    // Refuses a Task that is not in-progress.
    writeAt(receiptRoot, 'specs/S-731-receipt-verb/tasks/TK-003/TASK.md', taskRecordFixture({
      id: 'TK-003', specId: 'S-731', slice: 'Not yet started', status: 'ready', blockers: 'none',
      destination: 'spec-acceptance: S-731 Acceptance Criteria'
    }));
    assert.throws(
      () => receiptTask(receiptRoot, 'S-731', { task: 'TK-003', tests: 'x', docs: 'none', remainingGap: 'none' }),
      /TK-003 is ready, not in-progress/,
      'the receipt verb refuses a Task that is not in-progress'
    );
    assert.equal(readReceiptFromFile(path.join(receiptRoot, 'specs/S-731-receipt-verb/tasks/TK-003/TASK.md')).length, 0,
      'a refused receipt call writes nothing to the refused Task');

    console.log('ok - the receipt verb appends one Receipt row to a named in-progress Task, touching neither its Status nor the Spec, and refuses a Task that is not in-progress');
  } finally {
    fs.rmSync(receiptRoot, { recursive: true, force: true });
  }
}

// ============================================================================
// S-00I TK-003: folder lifecycle for Spec directories. Before this task, a
// Spec directory had no supported way to move at all: `loadSpecs` reads only
// the specs lane's top level (unchanged by this task - the active roster
// `next`, `claim`, `render` and the hot board select from), so a Spec moved
// by a plain rename simply vanishes from every one of those, `doctor` never
// notices the Markdown references such a move leaves dangling, and `show`
// has no historical route to fall back to. Red at the pre anchor 672e354:
// `SPEC_LIFECYCLE_FOLDERS`, `loadRetiredSpecs`, `moveSpecDirectory` and
// `scanReferences` are not exported there at all, so the import above fails
// before a single assertion in this file runs (confirmed in a throwaway
// detached worktree at that commit). The first block below reproduces the
// pre-fix gap with only functions that already existed then (`loadSpecs`,
// `showSpec`, `doctor`), plus the one new read-only capability
// (`scanReferences`) whose whole job is to catch exactly this.
// ============================================================================
function repoToolRoot() {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
}

function initLifecycleFixture(dir) {
  const layoutTool = path.join(repoToolRoot(), 'workbench', 'tools', 'workbench-layout.mjs');
  const workbenchVersion = JSON.parse(fs.readFileSync(path.join(repoToolRoot(), 'workbench', 'manifest.json'), 'utf8')).workbenchVersion;
  const init = spawnSync(process.execPath, [layoutTool, 'init', '--project', dir, '--provenance', 'genesis', '--version', workbenchVersion], { encoding: 'utf8' });
  assert.equal(init.status, 0, init.stdout + init.stderr);
  fs.writeFileSync(path.join(dir, 'BLUEPRINT.md'), '# Blueprint\n\n<!-- spec-catalog:start -->\n<!-- spec-catalog:end -->\n');
  fs.writeFileSync(path.join(dir, 'TASKBOARD.md'), '# Taskboard\n\n<!-- hot-specs:start -->\n<!-- hot-specs:end -->\n');
  fs.writeFileSync(path.join(dir, 'README.md'), '# Fixture room\n\nSee MEMORY.md.\n');
}

function completeFixtureSpec(id) {
  return fixtureSpec()
    .replaceAll('S-001', id)
    .replace('**Status:** active', '**Status:** complete')
    .replace('| TK-001 | First slice | ready | none | pending |', '| TK-001 | First slice | done | none | landed |')
    .replace('- [ ] Expected behavior is verified.', '- [x] Expected behavior is verified.');
}

{
  const naiveRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-lifecycle-naive-'));
  try {
    initLifecycleFixture(naiveRoot);
    fs.writeFileSync(path.join(naiveRoot, 'AGENTS.md'), '# Agents\n\nSee [S-500](workbench/specs/S-500-naive-fixture/SPEC.md) for the fixture rule.\n');
    writeAt(naiveRoot, 'workbench/specs/S-500-naive-fixture/SPEC.md', completeFixtureSpec('S-500'));

    assert.equal(loadSpecs(naiveRoot).some((spec) => spec.id === 'S-500'), true, 'S-500 starts in the active roster');

    // The naive move a room without this seam would perform: a plain
    // directory rename, no reference repair, no supported destination.
    fs.mkdirSync(path.join(naiveRoot, 'workbench/specs/retired'), { recursive: true });
    fs.renameSync(
      path.join(naiveRoot, 'workbench/specs/S-500-naive-fixture'),
      path.join(naiveRoot, 'workbench/specs/retired/S-500-naive-fixture')
    );

    assert.equal(loadSpecs(naiveRoot).some((spec) => spec.id === 'S-500'), false,
      'loadSpecs only ever reads the top level, so a naively moved Spec disappears from the active roster entirely');
    assert.throws(() => showSpec(naiveRoot, 'S-500'), /Unknown spec ID: S-500/,
      'with no historical route, show cannot find the moved Spec by any means');
    assert.deepEqual(doctor(naiveRoot).filter((item) => item.specId === 'S-500'), [],
      'doctor raises nothing about the Spec a naive move made invisible - it is simply gone, not flagged');
    const stale = scanReferences(naiveRoot);
    assert.ok(stale.some((item) => item.file === 'AGENTS.md' && item.target.includes('S-500-naive-fixture')),
      'the complete reference and link scan finds the now-dangling AGENTS.md reference a naive move left behind');

    console.log('ok - a naive Spec directory move disappears from the active roster, dangles a live reference, and leaves no historical route; only the new reference scan catches it');
  } finally {
    fs.rmSync(naiveRoot, { recursive: true, force: true });
  }
}

// ============================================================================
// The real seam: `moveSpecDirectory` moves a completed Spec's whole directory
// (Task records included) into `retired/`, rewrites every live Markdown
// reference across the room (root controls, an accepted ADR naming the live
// path, a sibling Spec's own Decisions section, the Wiki), leaves a sibling
// Spec's own append-only evidence row untouched and counts it as historical,
// and refuses an unknown Spec, a folder outside the closed set, a Spec that
// is not complete, and a dirty working tree.
// ============================================================================
{
  const lifecycleRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-lifecycle-move-'));
  try {
    initLifecycleFixture(lifecycleRoot);
    fs.writeFileSync(path.join(lifecycleRoot, 'AGENTS.md'),
      '# Agents\n\nSee [S-500](workbench/specs/S-500-retiring-fixture/SPEC.md) for the fixture rule.\n\nRoutes to workbench/wiki.\n');

    // The retiring Spec: complete, table-and-record backed so the move must
    // carry a standalone Task record along with SPEC.md.
    writeAt(lifecycleRoot, 'workbench/specs/S-500-retiring-fixture/SPEC.md', completeFixtureSpec('S-500'));
    writeAt(lifecycleRoot, 'workbench/specs/S-500-retiring-fixture/tasks/TK-002/TASK.md', taskRecordFixture({
      id: 'TK-002', specId: 'S-500', slice: 'Second slice', status: 'done', blockers: 'none',
      destination: 'spec-acceptance: S-500 Acceptance Criteria'
    }));

    // A live sibling Spec: a live Decisions reference that must be rewritten,
    // and a historical evidence-row reference that must not be.
    writeAt(lifecycleRoot, 'workbench/specs/S-600-sibling-fixture/SPEC.md', [
      '# S-600 - Sibling Fixture',
      '',
      '**Spec ID:** S-600',
      '**Status:** active',
      '**Priority:** 0',
      '**Owner:** agent',
      '**Updated:** 2026-09-18',
      '**Catalog description:** Names the retiring fixture from a live section and a historical one.',
      '**Blockers:** none',
      '**Latest event:** Spec activated.',
      '**Next gate:** Complete TK-001.',
      '',
      '## Decisions And Contracts',
      '',
      '- See [S-500](../S-500-retiring-fixture/SPEC.md).',
      '',
      '## Vertical Implementation Slices',
      '',
      '| Task | Slice | Status | Blockers | Proof |',
      '|---|---|---|---|---|',
      '| TK-001 | First slice | ready | none | pending |',
      '',
      '## Acceptance Criteria',
      '',
      '- [ ] Expected behavior is verified.',
      '',
      '## Append-Only Evidence And Execution Log',
      '',
      '| Date | Task | Event | Verification | Docs | Remaining gap |',
      '|---|---|---|---|---|---|',
      '| 2026-09-01 | none | Spec authored | mentions [S-500](../S-500-retiring-fixture/SPEC.md) | none | none |',
      '',
      '## Completion Result',
      '',
      'Pending.',
      '',
      '## Supersession',
      '',
      '- Supersedes: none',
      '- Superseded by: none',
      ''
    ].join('\n'));

    // An active, not-yet-complete Spec: the refusal fixture below.
    writeAt(lifecycleRoot, 'workbench/specs/S-800-active-fixture/SPEC.md', fixtureSpec().replaceAll('S-001', 'S-800'));

    // An accepted ADR naming the retiring Spec's live path.
    fs.writeFileSync(path.join(lifecycleRoot, 'workbench/docs/adr/0001-fixture.md'), [
      '---',
      'date: 2026-09-18',
      'canonicalized_in:',
      '  - AGENTS.md',
      '---',
      '',
      '# A fixture decision',
      '',
      'Delivered by [S-500](../../specs/S-500-retiring-fixture/SPEC.md).',
      '',
      'Provenance: owner decision.',
      ''
    ].join('\n'));

    // A Wiki guidebook naming the retiring Spec's live path.
    writeAt(lifecycleRoot, 'workbench/wiki/guidebooks/fixture-capability.md', [
      '---',
      'type: guidebook',
      'status: active',
      'sensitivity: normal',
      'knowledge_role: derived',
      'provenance:',
      '  - fixture',
      'source_paths:',
      '  - workbench/wiki/guidebooks/fixture-capability.md',
      'last_verified: 2026-09-18',
      '---',
      '',
      '# Fixture capability',
      '',
      'Delivered by [S-500](../../specs/S-500-retiring-fixture/SPEC.md).',
      ''
    ].join('\n'));

    execFileSync('git', ['init', '--quiet', lifecycleRoot]);
    execFileSync('git', ['-C', lifecycleRoot, 'config', 'user.email', 'fixture@example.com']);
    execFileSync('git', ['-C', lifecycleRoot, 'config', 'user.name', 'Fixture']);
    execFileSync('git', ['-C', lifecycleRoot, 'add', '-A']);
    execFileSync('git', ['-C', lifecycleRoot, 'commit', '--quiet', '-m', 'initial corpus']);

    assert.deepEqual(SPEC_LIFECYCLE_FOLDERS, ['retired'], "archive is ADR-only per ADR-000I; a Spec's one lifecycle folder is retired");

    // ---- Refusals, each checked on the still-clean committed tree --------
    assert.throws(() => moveSpecDirectory(lifecycleRoot, 'S-999', 'retired'), /Unknown spec ID: S-999/,
      'refuses an unknown Spec ID');
    assert.throws(() => moveSpecDirectory(lifecycleRoot, 'S-500', 'archive'), /closed set/,
      'refuses a folder outside SPEC_LIFECYCLE_FOLDERS; archive is ADR-only');
    assert.throws(() => moveSpecDirectory(lifecycleRoot, 'S-800', 'retired'), /S-800 is active, not complete/,
      'refuses a Spec that is not complete');

    fs.writeFileSync(path.join(lifecycleRoot, 'stray-untracked-file.txt'), 'dirty\n');
    assert.throws(() => moveSpecDirectory(lifecycleRoot, 'S-500', 'retired'), /dirty working tree/,
      'refuses a dirty working tree so the candidate shows only this move');
    fs.rmSync(path.join(lifecycleRoot, 'stray-untracked-file.txt'));
    assert.equal(execFileSync('git', ['-C', lifecycleRoot, 'status', '--porcelain'], { encoding: 'utf8' }).trim(), '',
      'the tree is clean again before the real move runs');

    // ---- The real move ------------------------------------------------
    const result = moveSpecDirectory(lifecycleRoot, 'S-500', 'retired');
    assert.equal(result.specId, 'S-500');
    assert.equal(result.folder, 'retired');
    assert.equal(result.from, 'workbench/specs/S-500-retiring-fixture');
    assert.equal(result.to, 'workbench/specs/retired/S-500-retiring-fixture');
    assert.equal(result.usesGit, true);

    const newSpecPath = path.join(lifecycleRoot, 'workbench/specs/retired/S-500-retiring-fixture/SPEC.md');
    const newTaskPath = path.join(lifecycleRoot, 'workbench/specs/retired/S-500-retiring-fixture/tasks/TK-002/TASK.md');
    assert.ok(fs.existsSync(newSpecPath), 'the Spec directory (SPEC.md) moved to retired/');
    assert.ok(fs.existsSync(newTaskPath), 'the standalone Task record moved with its owning Spec directory');
    assert.ok(!fs.existsSync(path.join(lifecycleRoot, 'workbench/specs/S-500-retiring-fixture')), 'the old top-level directory is gone');

    assert.match(fs.readFileSync(path.join(lifecycleRoot, 'AGENTS.md'), 'utf8'),
      /\[S-500\]\(workbench\/specs\/retired\/S-500-retiring-fixture\/SPEC\.md\)/,
      'a root control reference is rewritten to the moved Spec\'s real path');
    assert.match(fs.readFileSync(path.join(lifecycleRoot, 'workbench/docs/adr/0001-fixture.md'), 'utf8'),
      /\[S-500\]\(\.\.\/\.\.\/specs\/retired\/S-500-retiring-fixture\/SPEC\.md\)/,
      'an accepted ADR naming the live Spec path is rewritten');
    assert.match(fs.readFileSync(path.join(lifecycleRoot, 'workbench/wiki/guidebooks/fixture-capability.md'), 'utf8'),
      /\[S-500\]\(\.\.\/\.\.\/specs\/retired\/S-500-retiring-fixture\/SPEC\.md\)/,
      'a Wiki note naming the live Spec path is rewritten');
    const siblingContent = fs.readFileSync(path.join(lifecycleRoot, 'workbench/specs/S-600-sibling-fixture/SPEC.md'), 'utf8');
    assert.match(siblingContent, /## Decisions And Contracts\n\n- See \[S-500\]\(\.\.\/retired\/S-500-retiring-fixture\/SPEC\.md\)\./,
      'a sibling Spec\'s own live Decisions section is rewritten to the moved Spec\'s real path');
    assert.match(siblingContent, /mentions \[S-500\]\(\.\.\/S-500-retiring-fixture\/SPEC\.md\)/,
      'a sibling Spec\'s Append-Only Evidence row keeps its historical, now-stale path untouched');

    assert.ok(Object.values(result.referencesRewritten).reduce((a, b) => a + b, 0) >= 4,
      'the move reports the live references it rewrote, counted');
    assert.ok(Object.values(result.historicalReferencesLeft).reduce((a, b) => a + b, 0) >= 1,
      'the move reports the historical references it deliberately left, counted');

    assert.equal(loadSpecs(lifecycleRoot).some((spec) => spec.id === 'S-500'), false,
      'the active roster no longer carries S-500');
    const retired = loadRetiredSpecs(lifecycleRoot);
    assert.deepEqual(retired.map((spec) => spec.id), ['S-500']);
    assert.equal(retired[0].status, 'complete');

    const shown = showSpec(lifecycleRoot, 'S-500');
    assert.equal(shown.status, 'complete');
    assert.equal(shown.path, 'workbench/specs/retired/S-500-retiring-fixture/SPEC.md');

    const afterMoveFindings = doctor(lifecycleRoot).filter((item) => item.specId === 'S-500');
    assert.deepEqual(afterMoveFindings, [], 'a correctly retired, complete Spec raises no identity or retired-status finding');

    const afterMoveScan = scanReferences(lifecycleRoot).filter((item) => item.target.includes('S-500-retiring-fixture') && !item.target.includes('retired/'));
    assert.deepEqual(afterMoveScan, [], 'the reference scan finds no remaining live reference to the pre-move path');

    // ---- CATALOG.md and the hot board: retired is reachable, never hot ---
    render(lifecycleRoot);
    const catalog = fs.readFileSync(path.join(lifecycleRoot, 'workbench/specs/CATALOG.md'), 'utf8');
    const mainTable = catalog.slice(0, catalog.indexOf('### Retired'));
    assert.doesNotMatch(mainTable, /S-500/, 'the main catalog table no longer names S-500 once it is retired');
    assert.match(catalog, /### Retired/, 'CATALOG.md gains a Retired heading once a Spec is retired');
    assert.match(catalog, /\[S-500-retiring-fixture\/SPEC\.md\]\(retired\/S-500-retiring-fixture\/SPEC\.md\)/,
      'the Retired heading names S-500 by its historical route');
    const board = fs.readFileSync(path.join(lifecycleRoot, 'TASKBOARD.md'), 'utf8');
    assert.doesNotMatch(board, /S-500/, 'the hot board never names a retired Spec');

    assert.deepEqual(doctor(lifecycleRoot).filter((item) => ['render-drift', 'broken-render-target'].includes(item.code)), [],
      'render is a no-op on this room: doctor finds no drift in either projection after render already ran');

    console.log('ok - moveSpecDirectory moves a completed Spec directory and its Task records into retired/, rewrites every live reference, leaves historical evidence untouched, keeps the active roster and hot board silent about it, and stays reachable by show and the Retired catalog heading');
  } finally {
    fs.rmSync(lifecycleRoot, { recursive: true, force: true });
  }
}

// ============================================================================
// Doctor's identity and retired-status checks cover a retired Spec exactly
// as the design requires: a retired Spec whose own Status disagrees that it
// is complete, a retired Spec whose directory name does not start with its
// own id, and a retired Spec id colliding with one already on the active
// roster - all three visible, none of them selectable.
// ============================================================================
{
  const identityRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-lifecycle-identity-'));
  try {
    initLifecycleFixture(identityRoot);
    fs.writeFileSync(path.join(identityRoot, 'AGENTS.md'), '# Agents\n');
    writeAt(identityRoot, 'workbench/specs/S-501-active-top/SPEC.md', fixtureSpec().replaceAll('S-001', 'S-501'));
    writeAt(identityRoot, 'workbench/specs/retired/S-502-incomplete/SPEC.md',
      fixtureSpec().replaceAll('S-001', 'S-502').replace('**Status:** active', '**Status:** blocked'));
    writeAt(identityRoot, 'workbench/specs/retired/mismatched-directory-name/SPEC.md',
      fixtureSpec().replaceAll('S-001', 'S-503'));
    writeAt(identityRoot, 'workbench/specs/retired/S-501-retired-duplicate/SPEC.md',
      fixtureSpec().replaceAll('S-001', 'S-501'));

    const findings = doctor(identityRoot);
    assert.ok(findings.some((item) => item.code === 'retired-not-complete' && item.specId === 'S-502'),
      'a retired Spec whose Status is not complete is reported');
    assert.ok(findings.some((item) => item.code === 'unstable-path' && item.specId === 'S-503'),
      'a retired Spec at a path not starting with its own id is reported, exactly as the top-level check already is');
    assert.ok(findings.some((item) => item.code === 'duplicate-id' && item.specId === 'S-501'),
      'an id already on the active roster cannot be reused by a retired Spec');
    assert.equal(loadSpecs(identityRoot).some((spec) => spec.id === 'S-502'), false,
      'a retired Spec never re-enters the active roster loadSpecs reads');

    console.log('ok - doctor\'s identity checks (duplicate-id, unstable-path) and the new retired-not-complete finding cover retired Specs, which stay invisible to loadSpecs');
  } finally {
    fs.rmSync(identityRoot, { recursive: true, force: true });
  }
}

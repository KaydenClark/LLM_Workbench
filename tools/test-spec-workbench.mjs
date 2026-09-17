#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  TASK_STATUSES as SLICE_STATUSES,
  claimWork,
  convertSpecSlices,
  showSpec,
  closeTicket,
  completeSpec,
  doctor,
  nextWork,
  parseCliArgs,
  render
} from '../workbench/tools/spec-workbench.mjs';
import { parseSpecPacket } from '../workbench/tools/spec-packet.mjs';
import { TASK_STATUSES, listTaskRecords, readTaskRecord, taskStatus, unmetBlockers } from '../workbench/tools/task-record.mjs';

// One closed status vocabulary, not two: `spec-workbench.mjs` held its own
// unexported TICKET_STATUSES set beside the record reader's TASK_STATUSES, so
// a status added to one silently stayed invalid to the other.
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
  assert.equal(next.ticketId, 'TK-001');

  claimWork(root, 'S-001', { agent: 'codex', date: '2026-07-12' });
  assert.match(read('specs/S-001-fixture/SPEC.md'), /\| TK-001 \| First slice \| in-progress \|/);
  assert.equal(nextWork(root).status, 'in-progress', 'next should resume claimed work before selecting new work');

  assert.throws(
    () => completeSpec(root, 'S-001', { date: '2026-07-12' }),
    /unfinished slice|unchecked acceptance/i,
    'a spec must not complete before its ticket and acceptance gates'
  );

  const closed = closeTicket(root, 'S-001', {
    proof: 'node test | tee proof.log',
    docs: 'Docs checked; no update needed',
    remainingGap: 'none',
    date: '2026-07-12'
  });
  assert.equal(closed.tickets[0].proof, 'node test | tee proof.log', 'ticket proof should round-trip a literal pipe');
  assert.equal(
    read('specs/S-001-fixture/SPEC.md').split('node test \\| tee proof.log').length - 1,
    2,
    'ticket proof and appended evidence should persist escaped Markdown pipes'
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
    /blocked-slice|no eligible ready ticket/i,
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
    () => closeTicket(root, 'S-001', {
      proof: 'must not persist',
      docs: 'Docs checked; no update needed',
      remainingGap: 'none',
      date: '2026-07-12'
    }),
    /malformed ticket row/,
    'malformed ticket rows should be reported explicitly'
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
  // `doctor` still read only the embedded ticket table (TK-002 migrates
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
    doctor(root).some((issue) => issue.code === 'malformed-spec' && /TK-001/.test(issue.message)),
    'doctor reports the contradiction instead of selecting past it'
  );

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
  assert.equal(selectedRecord.ticketId, 'TK-002',
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

  const closedRecord = closeTicket(root, 'S-301', {
    proof: 'node test | tee record.log',
    docs: 'Docs checked; no update needed',
    remainingGap: 'none',
    date: '2026-07-12'
  });
  assert.equal(closedRecord.tickets.find((item) => item.id === 'TK-002').status, 'done');
  assert.match(read('specs/S-301-records/tasks/TK-002/TASK.md'), /\*\*Status:\*\* done/,
    'close flips the Task record to done');
  assert.match(read('specs/S-301-records/tasks/TK-002/TASK.md'), /\*\*Proof:\*\* node test \| tee record\.log/,
    'proof text for a record goes on the record, not into a table cell');
  assert.match(
    read('specs/S-301-records/SPEC.md'),
    /\| 2026-07-12 \| TK-002 \| Ticket closed \| node test \\\| tee record\.log \|/,
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
  assert.equal(nextWork(root).ticketId, 'TK-003',
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
  closeTicket(root, 'S-301', {
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
  closeTicket(root, 'S-310', {
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
    doctor(root).some((issue) => issue.code === 'malformed-spec' && /TK-001/.test(issue.message)),
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
    /S-309 has no eligible ready ticket to claim/,
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
    /S-308 has no eligible ready ticket to claim/,
    'a table row that says blocked is refused exactly as it was before Task records existed'
  );
  fs.rmSync(path.join(root, 'specs/S-308-blocked-rows'), { recursive: true });
  render(root);

  // A table-only Spec behaves exactly as it did before any of this.
  write('specs/S-306-table-only/SPEC.md', fixtureSpec().replaceAll('S-001', 'S-306'));
  render(root);
  const tableOnly = nextWork(root);
  assert.equal(tableOnly.ticketId, 'TK-001');
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
    showSpec(root, 'S-304').tickets.find((item) => item.id === 'TK-002').proof,
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
  assert.equal(nextWork(root).ticketId, 'TK-002', 'the converted room selects the first eligible record');
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
    '| Ticket | Slice | Status | Blockers | Proof |',
    '|---|---|---|---|---|',
    '| TK-001 | First slice | ready | none | pending |',
    '',
    '## Acceptance Criteria',
    '',
    '- [ ] Expected behavior is verified.',
    '',
    '## Append-Only Evidence And Execution Log',
    '',
    '| Date | Ticket | Event | Verification | Docs | Remaining gap |',
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
    readReceiptFromFile
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

    console.log('ok - task receipt append-only per-run record passed');
  } finally {
    fs.rmSync(receiptRoot, { recursive: true, force: true });
  }
}
// ---- S-00H TK-006: Task receipt tests (end) ----

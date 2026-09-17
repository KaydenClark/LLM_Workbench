#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  claimWork,
  closeTicket,
  completeSpec,
  doctor,
  nextWork,
  parseCliArgs,
  render
} from '../workbench/tools/spec-workbench.mjs';
import { parseSpecPacket } from '../workbench/tools/spec-packet.mjs';
import { listTaskRecords, readTaskRecord, taskStatus, unmetBlockers } from '../workbench/tools/task-record.mjs';

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
  assert.deepEqual(nextWork(root), beforeTaskDir,
    'a coexisting standalone Task record must not change or double-count embedded-table selection');
  assert.deepEqual(doctor(root), [], 'doctor stays clean; TK-002 wires the tasks directory into it');

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

  fs.rmSync(path.join(root, 'specs/S-201-task-record'), { recursive: true });
  render(root);

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

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
  TASK_LIFECYCLE_FOLDERS,
  appendEvidence,
  claimWork,
  convertSpecSlices,
  showSpec,
  closeTask,
  completeSpec,
  discardRetiredSpec,
  discardRetiredTask,
  doctor,
  findSpec,
  loadCorrectiveTasks,
  loadRetiredSpecs,
  loadSpecs,
  moveSpecDirectory,
  moveTaskRecord,
  nextWork,
  nextIdentity,
  parseCliArgs,
  receiptTask,
  referencesToPath,
  render,
  retireSpec,
  scanReferences,
  slicesOf
} from '../workbench/tools/spec-workbench.mjs';
import { assembleSpecReport, createCorrectiveTasks, recordOwnerApproval, recordReviewVerdict } from '../workbench/tools/spec-report.mjs';
import { parseSpecPacket } from '../workbench/tools/spec-packet.mjs';
import { validateAdrs, writeRegister } from '../workbench/tools/adr.mjs';
import { TASK_STATUSES, listRetiredTaskRecords, listTaskRecords, readTaskRecord, taskStatus, unmetBlockers } from '../workbench/tools/task-record.mjs';
import { assembleTaskPacket } from '../workbench/tools/task-packet.mjs';
import { appendReceiptRowToContent, readReceiptFromFile } from '../workbench/tools/task-receipt.mjs';
import { parseMarkdownTableRow } from '../workbench/tools/markdown-table.mjs';

// `doctor`'s `stale-claim` rule (workbench/tools/spec-workbench.mjs) flags an
// in-progress claim whose `Updated` date-only stamp is more than one day
// behind the real clock. A fixture that claims/closes with a literal recent
// date (e.g. '2026-09-17') therefore passes only until the calendar moves
// past it, then fails two days later with no code change - this is the
// fragility this constant removes. Fixtures that feed a doctor() check with
// no `today` override use this computed value instead of a literal date so
// they stay green regardless of when the suite runs. Fixtures that
// deliberately assert stale-claim behavior still use an explicit literal or
// offset date, never this constant.
const TODAY = new Date().toISOString().slice(0, 10);

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

// S-00M TK-003: `close` refuses on a dirty tree or a HEAD no remote-tracking
// ref contains, so a fixture that closes in a real Git work tree must first
// be clean and pushed, exactly as an agent's own close would be. The bare
// remote lives inside `.git/`, where it is neither a working-tree file nor
// left behind when the fixture directory is removed.
function publishFixture(dir, message = 'publish fixture') {
  const remotes = execFileSync('git', ['-C', dir, 'remote'], { encoding: 'utf8' }).split('\n');
  if (!remotes.includes('origin')) {
    const remote = path.join(dir, '.git', 'fixture-remote.git');
    execFileSync('git', ['init', '--quiet', '--bare', remote]);
    execFileSync('git', ['-C', dir, 'remote', 'add', 'origin', remote]);
  }
  execFileSync('git', ['-C', dir, 'add', '-A']);
  execFileSync('git', ['-C', dir, 'commit', '--quiet', '--allow-empty', '-m', message]);
  execFileSync('git', ['-C', dir, 'push', '--quiet', '-u', 'origin', 'HEAD'], { stdio: 'ignore' });
}

// Simulate delivery of this exact fixture content before owner approval.
function integratedFixtureCandidate(root) {
  execFileSync('git', ['-C', root, 'add', '-A']);
  execFileSync('git', ['-C', root, 'commit', '--quiet', '--allow-empty', '-m', 'deliver approval fixture']);
  if (spawnSync('git', ['-C', root, 'show-ref', '--verify', '--quiet', 'refs/heads/integration']).status === 0) {
    execFileSync('git', ['-C', root, 'branch', '-f', 'integration', 'HEAD']);
  }
  return headSha(root);
}

// S-00J TK-01S: set a managed fixture manifest's git block, which is where
// final closure resolves the default branch it verifies delivery against.
function declareFixtureGit(dir, git) {
  const manifestFile = path.join(dir, 'workbench/manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
  manifest.git = git;
  fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
}

function headSha(dir) {
  return execFileSync('git', ['-C', dir, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
}

// S-00I TK-006: a historical path embedded literally into a `new RegExp(...)`
// below carries a real `.` (`SPEC.md`), which regex reads as "any character"
// unless escaped - imprecise rather than wrong for these fixture paths, but
// escaped anyway so the assertion means exactly what it reads.
function escapeForRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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

// ============================================================================
// S-00M TK-003: `close` refuses a completion claim the repository
// contradicts - a dirty tree or a HEAD no remote-tracking ref contains -
// before writing anything, unless `--git-state-reason` records why; a
// permitted close keeps the observed state and the reason in the Receipt row
// and the Spec evidence row, where a reviewer reads them.
// ============================================================================
{
  const stateRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'close-git-state-'));
  initGitRoot(stateRoot);
  try {
    const todayStr = new Date().toISOString().slice(0, 10);
    writeAt(stateRoot, 'BLUEPRINT.md', ['# Fixture Blueprint', '', '<!-- spec-catalog:start -->', '<!-- spec-catalog:end -->'].join('\n'));
    writeAt(stateRoot, 'TASKBOARD.md', ['# Fixture Taskboard', '', '<!-- hot-specs:start -->', '<!-- hot-specs:end -->'].join('\n'));
    writeAt(stateRoot, 'specs/S-751-git-state/SPEC.md', recordBackedSpec('S-751').replace('**Updated:** 2026-07-12', `**Updated:** ${todayStr}`));
    writeAt(stateRoot, 'specs/S-751-git-state/tasks/TK-002/TASK.md', taskRecordFixture({
      id: 'TK-002', specId: 'S-751', slice: 'Git-state slice', status: 'in-progress', blockers: 'none',
      destination: 'spec-acceptance: S-751 Acceptance Criteria'
    }));
    publishFixture(stateRoot);
    const specPath = path.join(stateRoot, 'specs/S-751-git-state/SPEC.md');
    const taskPath = path.join(stateRoot, 'specs/S-751-git-state/tasks/TK-002/TASK.md');
    const closeOptions = { proof: 'tools/test-fixture.mjs: pass', docs: 'Docs checked; no update needed', remainingGap: 'none', date: todayStr };

    // (1) A dirty tree - one tracked change and one untracked file outside
    // every lane, on a pushed branch - is refused before any write.
    writeAt(stateRoot, 'TASKBOARD.md', '# Fixture Taskboard\n\nedited\n');
    writeAt(stateRoot, 'scratch.txt', 'untracked\n');
    const specBefore = fs.readFileSync(specPath, 'utf8');
    const taskBefore = fs.readFileSync(taskPath, 'utf8');
    assert.throws(
      () => closeTask(stateRoot, 'S-751', closeOptions),
      /^Error: close refused: dirty-tree \(2 files: TASKBOARD\.md, scratch\.txt\); commit and push, or rerun with --git-state-reason "<why>" to record the state and reason$/,
      '(1) close on a dirty, pushed tree is refused, naming dirty-tree and its files'
    );
    assert.equal(fs.readFileSync(specPath, 'utf8'), specBefore, '(1) a refused close leaves the Spec byte-identical');
    assert.equal(fs.readFileSync(taskPath, 'utf8'), taskBefore, '(1) a refused close leaves the Task record byte-identical');
    assert.equal(readReceiptFromFile(taskPath).length, 0, '(1) a refused close appends no Receipt row');

    // (2) A clean tree whose HEAD no remote-tracking ref contains is refused,
    // naming unpushed and the upstream distance, or the missing upstream.
    execFileSync('git', ['-C', stateRoot, 'checkout', '--quiet', '--', 'TASKBOARD.md']);
    fs.rmSync(path.join(stateRoot, 'scratch.txt'));
    execFileSync('git', ['-C', stateRoot, 'commit', '--quiet', '--allow-empty', '-m', 'local only']);
    const branch = execFileSync('git', ['-C', stateRoot, 'rev-parse', '--abbrev-ref', 'HEAD'], { encoding: 'utf8' }).trim();
    assert.throws(
      () => closeTask(stateRoot, 'S-751', closeOptions),
      new RegExp(`^Error: close refused: unpushed \\(ahead 1 behind 0 of origin/${branch}\\); commit and push, or rerun with --git-state-reason "<why>" to record the state and reason$`),
      '(2) close on a clean branch ahead of its upstream is refused, naming unpushed and the distance'
    );
    execFileSync('git', ['-C', stateRoot, 'switch', '--quiet', '-c', 'no-upstream']);
    assert.throws(() => closeTask(stateRoot, 'S-751', closeOptions), /^Error: close refused: unpushed \(no upstream\);/,
      '(2) a branch with no upstream at an unpushed commit is refused, saying so');
    execFileSync('git', ['-C', stateRoot, 'checkout', '--quiet', '--detach']);
    assert.throws(() => closeTask(stateRoot, 'S-751', closeOptions), /^Error: close refused: unpushed \(detached HEAD, no upstream\);/,
      '(2) a detached HEAD at an unpushed commit is refused, saying so');
    execFileSync('git', ['-C', stateRoot, 'switch', '--quiet', branch]);
    assert.equal(fs.readFileSync(specPath, 'utf8'), specBefore, '(2) a refused close leaves the Spec byte-identical');
    assert.equal(readReceiptFromFile(taskPath).length, 0, '(2) a refused close appends no Receipt row');

    // (3) With --git-state-reason the same dirty, unpushed close succeeds, and
    // the observed state and the reason are readable afterward in the
    // Receipt row (inside its checksum chain) and the Spec evidence row.
    writeAt(stateRoot, 'scratch.txt', 'untracked | piped\n');
    const reason = 'owner asked to close before the push | retry later';
    closeTask(stateRoot, 'S-751', { ...closeOptions, remainingGap: 'TK-003 follow-up', gitStateReason: reason });
    const recorded = `TK-003 follow-up Git state at close: dirty-tree (1 file: scratch.txt) and unpushed (ahead 1 behind 0 of origin/${branch}); recorded reason: ${reason}`;
    const receiptRows = readReceiptFromFile(taskPath);
    assert.equal(receiptRows.length, 1, '(3) a permitted close appends exactly one Receipt row, whose checksum chain still validates');
    assert.equal(receiptRows[0].remainingGap, recorded, '(3) the Receipt row carries the remaining gap, the observed Git state and the reason');
    assert.equal(receiptRows[0].dirty, 1, '(3) the Receipt row still reads its Dirty count from live Git facts');
    const evidenceRow = fs.readFileSync(specPath, 'utf8').split('\n').find((line) => line.includes('| TK-002 | Task closed |'));
    assert.ok(evidenceRow, '(3) the Spec evidence row is appended');
    assert.equal(parseMarkdownTableRow(evidenceRow)[5], recorded, '(3) the Spec evidence row carries the same recorded state and reason');
    assert.match(fs.readFileSync(taskPath, 'utf8'), /\*\*Status:\*\* done/, '(3) the permitted close flips the Task to done');

    // (4) Clean and pushed closes exactly as before; a reason given there is
    // refused rather than silently dropped; an unknown state (not a
    // repository) closes exactly as before.
    writeAt(stateRoot, 'specs/S-752-table/SPEC.md', fixtureSpec().replaceAll('S-001', 'S-752').replace('**Updated:** 2026-07-12', `**Updated:** ${todayStr}`));
    fs.rmSync(path.join(stateRoot, 'scratch.txt'));
    claimWork(stateRoot, 'S-752', { agent: 'fixture', date: todayStr });
    publishFixture(stateRoot);
    const tableSpecPath = path.join(stateRoot, 'specs/S-752-table/SPEC.md');
    const tableBefore = fs.readFileSync(tableSpecPath, 'utf8');
    assert.throws(
      () => closeTask(stateRoot, 'S-752', { ...closeOptions, gitStateReason: 'nothing to waive' }),
      /^Error: --git-state-reason given but the tree is clean and pushed; nothing to record$/,
      '(4) a reason on a clean, pushed tree is refused rather than silently dropped'
    );
    assert.equal(fs.readFileSync(tableSpecPath, 'utf8'), tableBefore, '(4) the refused reason writes nothing');
    closeTask(stateRoot, 'S-752', closeOptions);
    const cleanRow = fs.readFileSync(tableSpecPath, 'utf8').split('\n').find((line) => line.includes('| TK-001 | Task closed |'));
    assert.equal(parseMarkdownTableRow(cleanRow)[5], 'none', '(4) a clean, pushed close records the remaining gap unchanged');

    const unknownRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'close-git-unknown-'));
    try {
      writeAt(unknownRoot, 'specs/S-753-unknown/SPEC.md', fixtureSpec().replaceAll('S-001', 'S-753'));
      claimWork(unknownRoot, 'S-753', { agent: 'fixture', date: todayStr });
      closeTask(unknownRoot, 'S-753', closeOptions);
      const unknownRow = fs.readFileSync(path.join(unknownRoot, 'specs/S-753-unknown/SPEC.md'), 'utf8').split('\n').find((line) => line.includes('| TK-001 | Task closed |'));
      assert.equal(parseMarkdownTableRow(unknownRow)[5], 'none', '(4) outside any repository the close is neither refused nor annotated');
    } finally {
      fs.rmSync(unknownRoot, { recursive: true, force: true });
    }

    assert.equal(parseCliArgs(['close', 'S-751', '--git-state-reason', reason]).options.gitStateReason, reason,
      'the CLI flag --git-state-reason reaches closeTask as gitStateReason');
    console.log('ok - close refuses a dirty or unpushed tree unless --git-state-reason records the state and reason');
  } finally {
    fs.rmSync(stateRoot, { recursive: true, force: true });
  }
}

// S-00M TK-003 (dispatcher addition): `close` names no Task, so with no
// in-progress Task it must not fall through to the first ready one - a Task
// nobody claimed would be closed as done. It refuses before any write.
{
  const unclaimedRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'close-unclaimed-'));
  try {
    writeAt(unclaimedRoot, 'specs/S-761-unclaimed/SPEC.md', fixtureSpec().replaceAll('S-001', 'S-761'));
    const tablePath = path.join(unclaimedRoot, 'specs/S-761-unclaimed/SPEC.md');
    const tableBefore = fs.readFileSync(tablePath, 'utf8');
    const options = { proof: 'must not persist', docs: 'Docs checked; no update needed', remainingGap: 'none', date: '2026-07-12' };
    assert.throws(() => closeTask(unclaimedRoot, 'S-761', options), /^Error: S-761 has no in-progress task to close; claim one first$/,
      'close on a Spec whose only open Task is ready (never claimed) is refused');
    assert.equal(fs.readFileSync(tablePath, 'utf8'), tableBefore, 'the refused close leaves the table-backed Spec byte-identical');

    writeAt(unclaimedRoot, 'specs/S-762-unclaimed-record/SPEC.md', recordBackedSpec('S-762'));
    writeAt(unclaimedRoot, 'specs/S-762-unclaimed-record/tasks/TK-002/TASK.md', taskRecordFixture({
      id: 'TK-002', specId: 'S-762', slice: 'Unclaimed slice', status: 'ready', blockers: 'none',
      destination: 'spec-acceptance: S-762 Acceptance Criteria'
    }));
    const recordPath = path.join(unclaimedRoot, 'specs/S-762-unclaimed-record/tasks/TK-002/TASK.md');
    const recordBefore = fs.readFileSync(recordPath, 'utf8');
    assert.throws(() => closeTask(unclaimedRoot, 'S-762', options), /^Error: S-762 has no in-progress task to close; claim one first$/,
      'close on a record-backed Spec whose only open Task is ready is refused');
    assert.equal(fs.readFileSync(recordPath, 'utf8'), recordBefore, 'the refused close leaves the ready Task record byte-identical');
    console.log('ok - close refuses a Spec with no in-progress Task instead of closing an unclaimed ready one');
  } finally {
    fs.rmSync(unclaimedRoot, { recursive: true, force: true });
  }
}

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

  publishFixture(root);
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
  // S-00J TK-004: complete now refuses without a passed review verdict bound
  // to the Spec's current content digest, so the main fixture lifecycle
  // records one here, against the Spec exactly as it now stands (checked
  // acceptance, filled Completion Result) - the same content completeSpec is
  // about to see.
  recordReviewVerdict(root, 'S-001', {
    candidate: headSha(root), result: 'pass', findings: 'none', reviewer: 'Claude Opus 5 (separate context)'
  });
  // S-00J TK-005: complete now also refuses without a recorded owner Human
  // QA approval bound to the same current content. This fixture room
  // declares no `git.integrationBranch` at all (no workbench/manifest.json
  // exists here), so `recordOwnerApproval` has nothing to check the
  // candidate against and records the approval outright - exactly the same
  // "informs, never blocks an absent declaration" rule `gate`'s own
  // `integrationBranch: null` case already follows.
  assert.throws(
    () => completeSpec(root, 'S-001', { date: '2026-07-12' }),
    /no owner Human QA approval is recorded/i,
    'complete still refuses a passed-verdict Spec with no recorded owner approval'
  );
  recordOwnerApproval(root, 'S-001', { candidate: integratedFixtureCandidate(root), owner: 'Kayden Clark', result: 'approve' });
  // S-00J TK-01S: final closure also verifies the approved content on the
  // manifest-declared default branch. This shared lifecycle room predates the
  // manifest (its Specs live in the legacy `specs/` lane, which a schema-2
  // manifest cannot declare), so it has no default branch to verify against:
  // complete refuses and writes nothing. The successful closure, with its
  // recorded delivery proof, is proven in the managed S-803 room below and in
  // tools/test-spec-report.mjs. The completed S-001 state the rest of this
  // lifecycle reads is written here as fixture setup, and its completion row
  // says so rather than claiming verified delivery.
  const s001Approved = read('specs/S-001-fixture/SPEC.md');
  assert.throws(
    () => completeSpec(root, 'S-001', { date: '2026-07-12' }),
    /^Error: S-001 cannot complete: the manifest declares no git\.defaultBranch/,
    'complete refuses a reviewed and approved Spec when no default branch is declared to verify delivery against'
  );
  assert.equal(read('specs/S-001-fixture/SPEC.md'), s001Approved, 'the refused complete writes nothing');
  write('specs/S-001-fixture/SPEC.md', appendEvidence(
    s001Approved
      .replace('**Status:** active', '**Status:** complete')
      .replace(/^\*\*Updated:\*\*.*$/m, '**Updated:** 2026-07-12')
      .replace(/^\*\*Latest event:\*\*.*$/m, '**Latest event:** Spec completed and removed from the hot board.')
      .replace(/^\*\*Next gate:\*\*.*$/m, '**Next gate:** none'),
    '| 2026-07-12 | spec | Spec completed | Fixture setup: completed state written directly; complete refuses in this manifest-less room | Documentation impact recorded above | none |'
  ));
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

  publishFixture(root);
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
  publishFixture(root);
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
  publishFixture(root);
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

    claimWork(historicalRoot, 'S-602', { agent: 'codex', date: TODAY });
    assert.equal(readHistorical(), beforeAnyCommand, 'claim on the sibling never rewrites the historical Spec');

    publishFixture(historicalRoot);
    closeTask(historicalRoot, 'S-602', {
      proof: 'node test', docs: 'Docs checked; no update needed', remainingGap: 'none', date: TODAY
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
    claimWork(historicalRoot, 'S-602', { agent: 'codex', date: TODAY });
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
    // S-00M TK-003: this fixture is deliberately dirty and remote-less so
    // the Dirty column has a non-zero live value to prove, so the close
    // records that state and a reason rather than being refused.
    closeTask(closeRoot, 'S-721', {
      proof: 'tools/test-fixture.mjs: pass', docs: 'Docs checked; no update needed', remainingGap: 'none', date: todayStr,
      gitStateReason: 'fixture proves live Receipt Git facts'
    });
    const taskRecordPath = path.join(closeRoot, 'specs/S-721-close-receipt/tasks/TK-002/TASK.md');
    const taskAfterClose = fs.readFileSync(taskRecordPath, 'utf8');
    const rows = readReceiptFromFile(taskRecordPath);
    assert.equal(rows.length, 1, '(e) close appends exactly one Receipt row to a record-backed Task');
    assert.equal(rows[0].testsRun, 'tools/test-fixture.mjs: pass', "(e) the Receipt row's Tests column carries close's --proof value");
    assert.equal(rows[0].docsTouched, 'Docs checked; no update needed', "(e) the Receipt row's Docs touched column carries close's --docs value");
    assert.match(rows[0].remainingGap, /^none Git state at close: dirty-tree \(4 files: [^)]*\) and unpushed \(no remote\); recorded reason: fixture proves live Receipt Git facts$/,
      "(e) the Receipt row's Remaining gap column carries close's --remaining-gap value, then the recorded Git state and reason");
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
    claimWork(closeRoot, 'S-722', { agent: 'fixture', date: todayStr });
    publishFixture(closeRoot);
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
    publishFixture(closeRoot);
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
// S-00J TK-004 (red at the pre anchor e32a41434d0be4b70fe5fb066f37a55156e8273
// 7): complete refuses without a passed review verdict whose digest matches
// the Spec's current content - naming exactly what is missing (no verdict at
// all, every recorded verdict is for earlier content - a stale digest, or
// the latest verdict for the current content is a fail) - and a passed
// current verdict lets complete proceed exactly as before. Every other
// completeSpec refusal (unfinished slice, unchecked acceptance, no
// completion result, no evidence) already runs ahead of this check, proven
// above with S-001 and S-301; each fixture Spec here is otherwise complete
// in every one of those senses, isolating the new gate alone.
// ============================================================================
{
  const gateRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-workbench-complete-gate-'));
  initGitRoot(gateRoot);
  // S-00J TK-01S: a managed room, so the manifest can declare the default
  // branch that final closure verifies approved delivery against.
  initLifecycleFixture(gateRoot);
  const gateBranch = execFileSync('git', ['-C', gateRoot, 'branch', '--show-current'], { encoding: 'utf8' }).trim();
  declareFixtureGit(gateRoot, { defaultBranch: gateBranch, integrationBranch: gateBranch });
  try {
    function completableSpec(id) {
      return [
        `# ${id} - Fixture Capability`,
        '',
        `**Spec ID:** ${id}`,
        '**Status:** active',
        '**Priority:** 0',
        '**Owner:** agent',
        '**Updated:** 2026-09-18',
        '**Catalog description:** Proves the complete gate.',
        '**Blockers:** none',
        '**Latest event:** TK-001 closed.',
        '**Next gate:** Complete.',
        '',
        '## Vertical Implementation Slices',
        '',
        '| Task | Slice | Status | Blockers | Proof |',
        '|---|---|---|---|---|',
        '| TK-001 | First slice | done | none | landed |',
        '',
        '## Acceptance Criteria',
        '',
        '- [x] Expected behavior is verified.',
        '',
        '## Append-Only Evidence And Execution Log',
        '',
        '| Date | Task | Event | Verification | Docs | Remaining gap |',
        '|---|---|---|---|---|---|',
        '| 2026-09-18 | TK-001 | Task closed | tools/test-fixture.mjs pass | none | none |',
        '',
        '## Completion Result',
        '',
        'Pass: fixture completed.',
        '',
        '## Supersession',
        '',
        '- Supersedes: none',
        '- Superseded by: none',
        ''
      ].join('\n');
    }

    // No verdict at all.
    writeAt(gateRoot, 'workbench/specs/S-800-fixture/SPEC.md', completableSpec('S-800'));
    assert.throws(
      () => completeSpec(gateRoot, 'S-800', { date: '2026-09-18' }),
      /no review verdict is recorded/i,
      'complete refuses an otherwise-complete Spec with no recorded review verdict at all'
    );

    // Every recorded verdict is for earlier content: a stale digest. Record
    // a pass, then change the Spec's content (a harmless field edit stands
    // in for any real later edit) so the digest it was recorded against no
    // longer matches.
    writeAt(gateRoot, 'workbench/specs/S-801-fixture/SPEC.md', completableSpec('S-801'));
    recordReviewVerdict(gateRoot, 'S-801', {
      candidate: headSha(gateRoot), result: 'pass', findings: 'none', reviewer: 'Claude Opus 5 (separate context)'
    });
    const s801Path = path.join(gateRoot, 'workbench/specs/S-801-fixture/SPEC.md');
    fs.writeFileSync(s801Path, fs.readFileSync(s801Path, 'utf8').replace('Proves the complete gate.', 'Proves the complete gate (edited after review).'));
    assert.throws(
      () => completeSpec(gateRoot, 'S-801', { date: '2026-09-18' }),
      /earlier content/i,
      'complete refuses when every recorded verdict is for content that no longer matches (a stale digest)'
    );

    // The latest verdict for the current content is a fail: hand-craft a
    // fail-verdict row naming the Spec's own current digest (read back from
    // the report, never recomputed by hand) without going through
    // recordReviewVerdict, so no corrective Task exists to trip the earlier
    // unfinished-slice check first - isolating this one reason.
    writeAt(gateRoot, 'workbench/specs/S-802-fixture/SPEC.md', completableSpec('S-802'));
    const s802Candidate = headSha(gateRoot);
    const s802Report = assembleSpecReport(gateRoot, 'S-802', { candidate: s802Candidate });
    const s802Path = path.join(gateRoot, 'workbench/specs/S-802-fixture/SPEC.md');
    const failRow = `| 2026-09-18 | review | Review verdict: fail at ${s802Candidate} [${s802Report.specDigest.slice(0, 12)}] #1 | Some finding | Claude Opus 5 (separate context) | 1 |`;
    fs.writeFileSync(s802Path, fs.readFileSync(s802Path, 'utf8').replace(
      '| 2026-09-18 | TK-001 | Task closed | tools/test-fixture.mjs pass | none | none |',
      `| 2026-09-18 | TK-001 | Task closed | tools/test-fixture.mjs pass | none | none |\n${failRow}`
    ));
    assert.throws(
      () => completeSpec(gateRoot, 'S-802', { date: '2026-09-18' }),
      /latest verdict for the current content is fail/i,
      'complete refuses when the latest verdict bound to the current content digest is a fail'
    );

    // S-00J TK-005: a passed review verdict is not enough on its own -
    // complete also requires a recorded owner Human QA approval bound to the
    // current content, checked after (and composing with) the review-verdict
    // gate above. No verdict at all for the owner-qa row.
    writeAt(gateRoot, 'workbench/specs/S-804-fixture/SPEC.md', completableSpec('S-804'));
    recordReviewVerdict(gateRoot, 'S-804', {
      candidate: headSha(gateRoot), result: 'pass', findings: 'none', reviewer: 'Claude Opus 5 (separate context)'
    });
    assert.throws(
      () => completeSpec(gateRoot, 'S-804', { date: '2026-09-18' }),
      /no owner Human QA approval is recorded/i,
      'complete refuses an otherwise-complete, reviewed Spec with no recorded owner Human QA approval at all'
    );

    // Every recorded owner-qa entry is for earlier content: a stale digest.
    // Record a passed verdict and an owner approval, then edit the Spec's
    // content (moving the digest) and record a FRESH passed verdict for the
    // new content - so the review gate passes - without a fresh owner
    // approval, isolating the approval-gap check from the review-gap check.
    writeAt(gateRoot, 'workbench/specs/S-805-fixture/SPEC.md', completableSpec('S-805'));
    recordReviewVerdict(gateRoot, 'S-805', {
      candidate: headSha(gateRoot), result: 'pass', findings: 'none', reviewer: 'Claude Opus 5 (separate context)'
    });
    recordOwnerApproval(gateRoot, 'S-805', { candidate: integratedFixtureCandidate(gateRoot), owner: 'Kayden Clark', result: 'approve' });
    const s805Path = path.join(gateRoot, 'workbench/specs/S-805-fixture/SPEC.md');
    fs.writeFileSync(s805Path, fs.readFileSync(s805Path, 'utf8').replace('Proves the complete gate.', 'Proves the complete gate (edited after owner approval).'));
    recordReviewVerdict(gateRoot, 'S-805', {
      candidate: headSha(gateRoot), result: 'pass', findings: 'none', reviewer: 'Claude Sonnet 5 (separate context)'
    });
    assert.throws(
      () => completeSpec(gateRoot, 'S-805', { date: '2026-09-18' }),
      /recorded owner Human QA entries are all for earlier content/i,
      'complete refuses when every recorded owner-qa entry is for content that no longer matches (a stale digest), even with a passed current review verdict'
    );

    // The latest owner-qa entry for the current content is a finding, not an
    // approval: hand-craft the row naming the Spec's own current digest
    // (read back from the report, never recomputed by hand), alongside a
    // passed verdict for the same digest, so only the approval-gap reason is
    // isolated.
    writeAt(gateRoot, 'workbench/specs/S-806-fixture/SPEC.md', completableSpec('S-806'));
    const s806Candidate = integratedFixtureCandidate(gateRoot);
    recordReviewVerdict(gateRoot, 'S-806', {
      candidate: s806Candidate, result: 'pass', findings: 'none', reviewer: 'Claude Opus 5 (separate context)'
    });
    const s806Report = assembleSpecReport(gateRoot, 'S-806', { candidate: s806Candidate });
    const s806Path = path.join(gateRoot, 'workbench/specs/S-806-fixture/SPEC.md');
    const findingRow = `| 2026-09-18 | owner-qa | Owner QA: finding at ${s806Candidate} [${s806Report.specDigest.slice(0, 12)}] #1 | Some finding | Kayden Clark | 1 |`;
    fs.writeFileSync(s806Path, fs.readFileSync(s806Path, 'utf8').replace(
      '| 2026-09-18 | TK-001 | Task closed | tools/test-fixture.mjs pass | none | none |',
      `| 2026-09-18 | TK-001 | Task closed | tools/test-fixture.mjs pass | none | none |\n${findingRow}`
    ));
    assert.throws(
      () => completeSpec(gateRoot, 'S-806', { date: '2026-09-18' }),
      /latest owner Human QA for the current content is a finding/i,
      'complete refuses when the latest owner-qa entry bound to the current content digest is a finding'
    );

    // A passed current verdict AND a recorded owner approval let complete
    // proceed unchanged: the same single "Spec completed" evidence row this
    // room's other completeSpec proof (S-001, above) already appends,
    // nothing else different.
    writeAt(gateRoot, 'workbench/specs/S-803-fixture/SPEC.md', completableSpec('S-803'));
    recordReviewVerdict(gateRoot, 'S-803', {
      candidate: headSha(gateRoot), result: 'pass', findings: 'none', reviewer: 'Claude Opus 5 (separate context)'
    });
    const s803Candidate = integratedFixtureCandidate(gateRoot);
    recordOwnerApproval(gateRoot, 'S-803', { candidate: s803Candidate, owner: 'Kayden Clark', result: 'approve' });
    // S-00J TK-01S: the owner promoted integration to the default branch.
    execFileSync('git', ['-C', gateRoot, 'update-ref', `refs/remotes/origin/${gateBranch}`, s803Candidate]);
    const s803Before = fs.readFileSync(path.join(gateRoot, 'workbench/specs/S-803-fixture/SPEC.md'), 'utf8');
    const s803SliceTableBefore = s803Before.slice(s803Before.indexOf('## Vertical Implementation Slices'), s803Before.indexOf('## Acceptance Criteria'));
    const s803VerdictRowBefore = s803Before.split('\n').find((line) => line.includes('Review verdict: pass'));
    const s803ApprovalRowBefore = s803Before.split('\n').find((line) => line.includes('Owner QA: approve'));
    completeSpec(gateRoot, 'S-803', { date: '2026-09-18' });
    const s803After = fs.readFileSync(path.join(gateRoot, 'workbench/specs/S-803-fixture/SPEC.md'), 'utf8');
    // Exactly the same shape completeSpec has always produced (proven above
    // with S-001): the header flips to complete, and one "Spec completed"
    // row is appended - nothing else, which is what "byte-identical apart
    // from the new refusal" means here.
    assert.match(s803After, /\*\*Status:\*\* complete$/m);
    assert.match(s803After, /\*\*Latest event:\*\* Spec completed and removed from the hot board\.$/m);
    assert.match(s803After, /\*\*Next gate:\*\* none$/m);
    const s803Digest12 = s803After.match(/Owner QA: approve at \S+ \[([0-9a-f]{12})\]/)[1];
    assert.ok(s803After.includes(`| 2026-09-18 | spec | Spec completed | Acceptance gates satisfied; approved delivery verified: origin/${gateBranch} at ${s803Candidate} contains approved candidate ${s803Candidate} [${s803Digest12}] | Documentation impact recorded above | none |`),
      'the completion row also records the observed default-branch ref/SHA and the approved candidate/digest (S-00J TK-01S)');
    assert.equal(
      s803After.slice(s803After.indexOf('## Vertical Implementation Slices'), s803After.indexOf('## Acceptance Criteria')),
      s803SliceTableBefore,
      'the slice table is untouched by complete, exactly as before this Spec'
    );
    assert.ok(s803After.includes(s803VerdictRowBefore), 'the pass verdict row recorded before complete is preserved verbatim, append-only');
    assert.ok(s803After.includes(s803ApprovalRowBefore), 'the owner approval row recorded before complete is preserved verbatim, append-only');
    assert.equal(
      s803After.split('\n').filter((line) => /^\|\s*\d{4}-\d{2}-\d{2}\s*\|/.test(line)).length,
      s803Before.split('\n').filter((line) => /^\|\s*\d{4}-\d{2}-\d{2}\s*\|/.test(line)).length + 1,
      'complete appends exactly one evidence row - the close row - on top of what was already recorded (the verdict and approval rows were already there before this snapshot)'
    );

    console.log('ok - complete refuses without a passed review verdict bound to the current content digest, naming no verdict, a stale digest, or a failed latest verdict as the reason; and, once reviewed, still refuses without a recorded owner Human QA approval bound to the same content, naming no approval, a stale approval digest, or a finding as the latest owner-qa entry - a passed current verdict AND a recorded current owner approval together let it proceed unchanged');
  } finally {
    fs.rmSync(gateRoot, { recursive: true, force: true });
  }
}

// S-00I TK-003: folder lifecycle for Spec directories. Before this task, a
// Spec directory had no supported way to move at all: `loadSpecs` reads only
// the specs lane's top level (unchanged by this task - the active roster
// `next`, `claim`, `render` and the hot board select from), so a Spec moved
// by a plain rename simply vanishes from every one of those, and `doctor`
// never notices the Markdown references such a move leaves dangling - only
// the folder shape itself (`<specsRoot>/retired/<id>-.../SPEC.md`) is the
// historical route `show` falls back to, however the Spec came to sit there,
// so a naive rename that happens to land in that shape is still findable;
// what it lacks is everything else a supported move provides: an active
// roster that notices the Spec left, and a link check that notices what the
// move broke. Red at the pre anchor 672e354: `SPEC_LIFECYCLE_FOLDERS`,
// `loadRetiredSpecs`, `moveSpecDirectory` and `scanReferences` are not
// exported there at all, so the import above fails before a single assertion
// in this file runs (confirmed in a throwaway detached worktree at that
// commit). The first block below reproduces the pre-fix gap with only
// functions that already existed then (`loadSpecs`, `doctor`), plus the one
// new read-only capability (`scanReferences`) whose whole job is to catch
// exactly the reference half of it.
// ============================================================================
function repoToolRoot() {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
}

function initLifecycleFixture(dir) {
  const layoutTool = path.join(repoToolRoot(), 'workbench', 'tools', 'workbench-layout.mjs');
  const workbenchVersion = JSON.parse(fs.readFileSync(path.join(repoToolRoot(), 'workbench', 'manifest.json'), 'utf8')).workbenchVersion;
  const init = spawnSync(process.execPath, [layoutTool, 'init', '--project', dir, '--provenance', 'genesis', '--version', workbenchVersion], { encoding: 'utf8' });
  assert.equal(init.status, 0, init.stdout + init.stderr);
  // No `spec-catalog` markers: this fixture takes the destination-only
  // `CATALOG.md` render path (the real room's own shape), not the legacy
  // BLUEPRINT-embedded one, so the Retired heading is exercised where the
  // real room would actually read it.
  fs.writeFileSync(path.join(dir, 'BLUEPRINT.md'), '# Blueprint\n');
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
    // S-00I TK-005: `loadRetiredSpecs` (TK-003) already reads any directory
    // under `retired/` regardless of how it got there, so doctor's retired-
    // Spec checks already saw this naively moved S-500 before this Task; its
    // Status (`complete`) and directory name both happen to be well-formed,
    // so neither `unstable-path` nor `retired-not-complete` ever fired here.
    // The new `retired-wiki-owner-stale` check does, correctly: nothing
    // reconciled this naive move into a durable Wiki owner.
    assert.deepEqual(doctor(naiveRoot).filter((item) => item.specId === 'S-500').map((item) => item.code), ['retired-wiki-owner-stale'],
      'doctor raises only the new wiki-owner check about the Spec a naive move made invisible - no identity or render finding is flagged');
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
    // carry a standalone Task record along with SPEC.md, and - corrective
    // review finding 1 - carrying its OWN outgoing relative links to an
    // unmoved sibling Spec and an unmoved ADR. Those links must be rewritten
    // by the move even though neither target moves, because S-500 itself now
    // sits one folder deeper.
    writeAt(lifecycleRoot, 'workbench/specs/S-500-retiring-fixture/SPEC.md', [
      '# S-500 - Fixture Capability',
      '',
      '**Spec ID:** S-500',
      '**Status:** complete',
      '**Priority:** 0',
      '**Owner:** agent',
      '**Updated:** 2026-09-18',
      '**Catalog description:** Proves the fixture lifecycle.',
      '**Blockers:** none',
      '**Latest event:** Spec activated.',
      '**Next gate:** Complete TK-001.',
      '',
      '## Decisions And Contracts',
      '',
      '- See [S-600](../S-600-sibling-fixture/SPEC.md).',
      '- Delivered by [ADR-0001](../../docs/adr/0001-fixture.md).',
      '',
      '## Vertical Implementation Slices',
      '',
      '| Task | Slice | Status | Blockers | Proof |',
      '|---|---|---|---|---|',
      '| TK-001 | First slice | done | none | landed |',
      '',
      '## Acceptance Criteria',
      '',
      '- [x] Expected behavior is verified.',
      '',
      '## Append-Only Evidence And Execution Log',
      '',
      '| Date | Task | Event | Verification | Docs | Remaining gap |',
      '|---|---|---|---|---|---|',
      '',
      '## Completion Result',
      '',
      'Landed.',
      '',
      '## Supersession',
      '',
      '- Supersedes: none',
      '- Superseded by: none',
      ''
    ].join('\n'));
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

    // Corrective review finding 2: an unrelated Spec, untouched by the move
    // in every sense (it does not move, and its own link's resolved target
    // does not move either), carrying a redundant-but-correct self-link
    // (`../S-700-.../SPEC.md` instead of the shorter `SPEC.md`). The move
    // must not "normalize" this to a shorter canonical form - a file the
    // move has no reason to touch must come out byte-identical.
    writeAt(lifecycleRoot, 'workbench/specs/S-700-untouched-fixture/SPEC.md', [
      '# S-700 - Untouched Fixture',
      '',
      '**Spec ID:** S-700',
      '**Status:** active',
      '**Priority:** 0',
      '**Owner:** agent',
      '**Updated:** 2026-09-18',
      '**Catalog description:** Proves the move touches nothing it has no reason to.',
      '**Blockers:** none',
      '**Latest event:** Spec activated.',
      '**Next gate:** Complete TK-001.',
      '',
      '## Decisions And Contracts',
      '',
      '- See [S-700](../S-700-untouched-fixture/SPEC.md) (itself, by a redundant relative path).',
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
    ].join('\n'));

    // An accepted ADR naming the retiring Spec's live path both as a body
    // link AND - corrective review finding 2 - as a `canonicalized_in`
    // frontmatter target, a root-relative fact rather than a body link, and
    // a distinct reference class the move must also repair.
    fs.writeFileSync(path.join(lifecycleRoot, 'workbench/docs/adr/0001-fixture.md'), [
      '---',
      'date: 2026-09-18',
      'canonicalized_in:',
      '  - AGENTS.md',
      '  - workbench/specs/S-500-retiring-fixture/SPEC.md',
      '---',
      '',
      '# A fixture decision',
      '',
      'Delivered by [S-500](../../specs/S-500-retiring-fixture/SPEC.md).',
      '',
      'Provenance: owner decision.',
      ''
    ].join('\n'));
    // Seed a correct, up-to-date REGISTER.md/HISTORY.md before the move, so
    // any staleness found afterward is attributable to the move and not to
    // this fixture never having run `adr register` at all.
    writeRegister(lifecycleRoot);

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

    const untouchedSpecPath = path.join(lifecycleRoot, 'workbench/specs/S-700-untouched-fixture/SPEC.md');
    const untouchedContentBefore = fs.readFileSync(untouchedSpecPath, 'utf8');
    const registerPath = path.join(lifecycleRoot, 'workbench/docs/adr/REGISTER.md');
    const historyPath = path.join(lifecycleRoot, 'workbench/docs/adr/HISTORY.md');

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

    // Corrective review finding 1: the moved Spec's OWN outgoing links to an
    // unmoved sibling and an unmoved ADR must be recomputed for its new,
    // one-folder-deeper location - not just left alone because neither
    // target itself moved.
    const movedSpecContent = fs.readFileSync(newSpecPath, 'utf8');
    assert.match(movedSpecContent, /- See \[S-600\]\(\.\.\/\.\.\/S-600-sibling-fixture\/SPEC\.md\)\./,
      'the moved Spec\'s own outgoing link to an unmoved sibling Spec is recomputed for its new depth');
    assert.match(movedSpecContent, /- Delivered by \[ADR-0001\]\(\.\.\/\.\.\/\.\.\/docs\/adr\/0001-fixture\.md\)\./,
      'the moved Spec\'s own outgoing link to an unmoved ADR is recomputed for its new depth');

    // Corrective review finding 2: `canonicalized_in` is a root-relative
    // frontmatter fact, not a body link, and needs its own rewrite.
    const adrContent = fs.readFileSync(path.join(lifecycleRoot, 'workbench/docs/adr/0001-fixture.md'), 'utf8');
    assert.match(adrContent, /canonicalized_in:\n {2}- AGENTS\.md\n {2}- workbench\/specs\/retired\/S-500-retiring-fixture\/SPEC\.md/,
      'an accepted ADR\'s canonicalized_in target is rewritten to the moved Spec\'s real path');
    assert.deepEqual(validateAdrs(lifecycleRoot).filter((item) => item.code === 'invalid-adr'), [],
      'adr validate stays clean after the move: canonicalized_in still names an existing owner');

    // Corrective review finding 1 (second round): a move that rewrites ADR
    // bodies and canonicalized_in must also refresh the derived projections
    // that echo those same paths as bare table text - moveSpecDirectory now
    // calls writeRegister itself, so a supported move never leaves the
    // collection's own register/history stale.
    const registerAfter = fs.readFileSync(registerPath, 'utf8');
    const historyAfter = fs.readFileSync(historyPath, 'utf8');
    for (const [name, content] of [['REGISTER.md', registerAfter], ['HISTORY.md', historyAfter]]) {
      assert.match(content, /workbench\/specs\/retired\/S-500-retiring-fixture\/SPEC\.md/, `${name} names the moved Spec's new path`);
      assert.doesNotMatch(content, /workbench\/specs\/S-500-retiring-fixture\/SPEC\.md/, `${name} no longer names the pre-move path`);
    }
    assert.deepEqual(validateAdrs(lifecycleRoot).filter((item) => item.code === 'stale-register'), [],
      'adr validate reports no stale-register once the move itself refreshes the projections');

    // Corrective review finding 2: a Spec the move has no reason to touch -
    // it does not move, and its own link's resolved target does not move
    // either - must come out completely untouched, not "normalized" to a
    // shorter equivalent relative form.
    assert.equal(fs.readFileSync(untouchedSpecPath, 'utf8'), untouchedContentBefore,
      'a Spec whose own links all resolve to unmoved targets is byte-identical after the move');
    assert.ok(!Object.keys(result.referencesRewritten).some((file) => file.includes('S-700')),
      'the move touches no file whose links all resolve to unmoved targets');

    assert.ok(Object.values(result.referencesRewritten).reduce((a, b) => a + b, 0) >= 6,
      'the move reports the live references it rewrote, counted');
    assert.ok(Object.values(result.historicalReferencesLeft).reduce((a, b) => a + b, 0) >= 1,
      'the move reports the historical references it deliberately left, counted');

    // Corrective review finding 3: `git mv` stages the rename; the content
    // rewrites above must be staged too, not left as a mix. Every porcelain
    // line's second (worktree) column must be blank - nothing unstaged.
    const porcelain = execFileSync('git', ['-C', lifecycleRoot, 'status', '--porcelain'], { encoding: 'utf8' });
    assert.ok(porcelain.trim().length > 0, 'the move actually changed something');
    for (const line of porcelain.split('\n').filter(Boolean)) {
      assert.equal(line[1], ' ', `line "${line}" must be fully staged, not a mix of staged and unstaged`);
    }

    assert.equal(loadSpecs(lifecycleRoot).some((spec) => spec.id === 'S-500'), false,
      'the active roster no longer carries S-500');
    const retired = loadRetiredSpecs(lifecycleRoot);
    assert.deepEqual(retired.map((spec) => spec.id), ['S-500']);
    assert.equal(retired[0].status, 'complete');

    const shown = showSpec(lifecycleRoot, 'S-500');
    assert.equal(shown.status, 'complete');
    assert.equal(shown.path, 'workbench/specs/retired/S-500-retiring-fixture/SPEC.md');
    // S-00I TK-005: show's printed body names the historical route on its
    // own first line for a retired Spec, so a reader lands knowing this is
    // out of ordinary discovery without needing --json's separate path
    // field; the original content still follows, byte-identical.
    assert.equal(shown.body.split('\n')[0], `Retired: ${shown.path} (historical route; out of ordinary discovery, reachable only by this explicit lookup)`);
    assert.ok(shown.body.endsWith(fs.readFileSync(path.join(lifecycleRoot, shown.path), 'utf8')),
      'the banner is prepended only; the Spec\'s own content is never altered');
    assert.equal(showSpec(lifecycleRoot, 'S-700').body, fs.readFileSync(untouchedSpecPath, 'utf8'),
      'an active-roster Spec\'s shown body carries no historical-route banner');

    const afterMoveFindings = doctor(lifecycleRoot).filter((item) => item.specId === 'S-500');
    // S-00I TK-005: this fixture retires S-500 through the bare
    // `moveSpecDirectory` primitive, never through `retireSpec`'s own
    // reconciliation gate, and authors no Wiki note naming S-500's
    // historical route - so doctor's new `retired-wiki-owner-stale` check
    // correctly flags exactly that, the one condition this fixture was
    // never given an owner for. No identity or retired-status finding is
    // raised, which stays the point of this test.
    assert.deepEqual(afterMoveFindings.map((item) => [item.code, item.blocks]), [['retired-wiki-owner-stale', 'none']],
      'a correctly retired, complete Spec raises no identity or retired-status finding; the wiki-owner check flags it for having no reconciled note, which this fixture never gave it');
    assert.match(afterMoveFindings[0].message, /no Wiki note names its historical route/);

    // The Spec forbids a spot check filtered to this fixture's own name: the
    // whole-room scan must report nothing unresolved anywhere, not merely
    // nothing naming S-500's old path.
    assert.deepEqual(scanReferences(lifecycleRoot), [],
      'the reference scan finds nothing unresolved anywhere in the room after the move');

    // ---- CATALOG.md and the hot board: retired is reachable, never hot ---
    render(lifecycleRoot);
    const catalog = fs.readFileSync(path.join(lifecycleRoot, 'workbench/specs/CATALOG.md'), 'utf8');
    const mainTable = catalog.slice(0, catalog.indexOf('### Retired'));
    assert.doesNotMatch(mainTable, /S-500/, 'the main catalog table no longer names S-500 once it is retired');
    assert.match(catalog, /### Retired/, 'CATALOG.md gains a Retired heading once a Spec is retired');
    assert.match(catalog, /\| S-500 - Fixture Capability \| .* \| \[workbench\/specs\/retired\/S-500-retiring-fixture\/SPEC\.md\]\(retired\/S-500-retiring-fixture\/SPEC\.md\) \|/,
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

// ============================================================================
// Corrective review finding 3: a move without a Git working tree at all
// cannot be recovered (there is no commit to fall back to), so it must be
// refused outright rather than falling through to a bare `fs.renameSync`.
// ============================================================================
{
  const noGitRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-lifecycle-no-git-'));
  try {
    initLifecycleFixture(noGitRoot);
    fs.writeFileSync(path.join(noGitRoot, 'AGENTS.md'), '# Agents\n');
    writeAt(noGitRoot, 'workbench/specs/S-900-no-git-fixture/SPEC.md', completeFixtureSpec('S-900'));

    assert.throws(() => moveSpecDirectory(noGitRoot, 'S-900', 'retired'),
      /requires a Git working tree/,
      'a room with no Git working tree at all refuses the move outright, rather than performing an unrecoverable bare rename');
    assert.ok(fs.existsSync(path.join(noGitRoot, 'workbench/specs/S-900-no-git-fixture/SPEC.md')),
      'a refused move leaves the Spec exactly where it was');

    console.log('ok - moveSpecDirectory refuses a room with no Git working tree at all, since such a move could never be recovered');
  } finally {
    fs.rmSync(noGitRoot, { recursive: true, force: true });
  }
}

// ============================================================================
// Corrective review finding 2, continued: the reference scan must find a
// planted stale `canonicalized_in` target exactly as it finds a stale body
// link - this is the read-only half of the fix, independent of any move.
// ============================================================================
{
  const staleCanonRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-lifecycle-stale-canon-'));
  try {
    initLifecycleFixture(staleCanonRoot);
    fs.writeFileSync(path.join(staleCanonRoot, 'workbench/docs/adr/0001-stale.md'), [
      '---',
      'date: 2026-09-18',
      'canonicalized_in:',
      '  - AGENTS.md',
      '  - workbench/specs/S-999-never-existed/SPEC.md',
      '---',
      '',
      '# A stale decision',
      '',
      'No body reference at all - only the frontmatter target is stale.',
      '',
      'Provenance: owner decision.',
      ''
    ].join('\n'));

    const stale = scanReferences(staleCanonRoot);
    assert.ok(stale.some((item) => item.file === 'workbench/docs/adr/0001-stale.md' && item.target === 'workbench/specs/S-999-never-existed/SPEC.md'),
      'scanReferences finds a planted stale canonicalized_in target, the same as a stale body link');

    console.log('ok - scanReferences finds a planted stale canonicalized_in frontmatter target');
  } finally {
    fs.rmSync(staleCanonRoot, { recursive: true, force: true });
  }
}

// ============================================================================
// Corrective review finding 1, continued: REGISTER.md and HISTORY.md name
// their Spec-path owners as bare comma-separated table text, not Markdown
// links, so scanReferences needs its own check for them too - the read-only
// half of the fix, independent of any move, and the exact seam TK-006's
// discard gate depends on to refuse certifying a room whose register still
// points at a dead path.
// ============================================================================
{
  const staleRegisterRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-lifecycle-stale-register-'));
  try {
    initLifecycleFixture(staleRegisterRoot);
    fs.writeFileSync(path.join(staleRegisterRoot, 'workbench/docs/adr/REGISTER.md'), [
      '# ADR Register',
      '',
      '> Derived by `adr.mjs register`; do not edit by hand. The directory listing is the source; this table is a projection.',
      '',
      '[Complete history](HISTORY.md). Only accepted active decisions follow.',
      '',
      '| ADR | Title | Status | Date | Canonicalized in |',
      '|---|---|---|---|---|',
      '| [0001](0001-fixture.md) | A stale-register decision | accepted | 2026-09-18 | AGENTS.md, workbench/specs/S-999-never-existed/SPEC.md |',
      ''
    ].join('\n'));

    const stale = scanReferences(staleRegisterRoot);
    assert.ok(stale.some((item) => item.file === 'workbench/docs/adr/REGISTER.md' && item.target === 'workbench/specs/S-999-never-existed/SPEC.md'),
      'scanReferences finds a dead path named in REGISTER.md\'s bare Canonicalized-in table text');

    console.log('ok - scanReferences finds a dead path in REGISTER.md\'s Canonicalized-in column, not only in Markdown links');
  } finally {
    fs.rmSync(staleRegisterRoot, { recursive: true, force: true });
  }
}

// ============================================================================
// S-00I TK-004: Task records get the same folder lifecycle a Spec directory
// already has (TK-003) - a done Task's own directory moves between
// `TASK_LIFECYCLE_FOLDERS`, the move repairs every live reference the same
// way TK-003's `moveSpecDirectory` does, and the active roster
// (`listTaskRecords`, `slicesOf`, `next`, `claim`, `close`, `render`, the hot
// board) never sees a retired Task again, while `show` and the historical
// route still can.
// ============================================================================
function doneTaskRecordFixture({ id, specId, slice, destination, proof }) {
  const lines = [
    `# ${id} - ${slice}`,
    '',
    `**Task ID:** ${id}`,
    `**Spec ID:** ${specId}`,
    `**Slice:** ${slice}`,
    '**Status:** done',
    '**Blockers:** none',
    `**Destination:** ${destination}`
  ];
  if (proof !== undefined) lines.push(`**Proof:** ${proof}`);
  lines.push('');
  return lines.join('\n');
}

function withReceiptRun(content, overrides = {}) {
  return appendReceiptRowToContent(content, {
    branch: 'claude/fixture', headSha: 'ab'.repeat(20), upstream: 'none', dirty: 0,
    testsRun: 'fixture run', docsTouched: 'none', remainingGap: 'none',
    ...overrides
  });
}

// A record-backed Spec with an empty slice table: `spec-packet.mjs` allows
// zero rows once `tasks/` exists, so no placeholder row is needed and no
// row/record id can ever collide with a Task record fixture below.
function emptyTableRecordBackedSpec(id) {
  return [
    `# ${id} - Task Lifecycle Fixture`,
    '',
    `**Spec ID:** ${id}`,
    '**Status:** active',
    '**Priority:** 0',
    '**Owner:** agent',
    '**Updated:** 2026-09-18',
    '**Catalog description:** Proves the Task folder lifecycle.',
    '**Blockers:** none',
    '**Latest event:** Spec activated.',
    '**Next gate:** Complete the open Task.',
    '',
    '## Vertical Implementation Slices',
    '',
    '| Task | Slice | Status | Blockers | Proof |',
    '|---|---|---|---|---|',
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

function completeEmptyTableRecordBackedSpec(id) {
  return emptyTableRecordBackedSpec(id)
    .replace('**Status:** active', '**Status:** complete')
    .replace('- [ ] Expected behavior is verified.', '- [x] Expected behavior is verified.')
    .replace('Pending.', 'Landed.');
}

// ----------------------------------------------------------------------
// The pre-anchor gap: before this Task, `listTaskRecords` had no notion of
// a lifecycle folder at all, so a Task directory hand-moved into
// `tasks/retired/<id>/` was read as an ordinary Task directory one level
// beneath `tasks/` - `retired` itself, with no `TASK.md` directly inside it
// - and `listTaskRecords` threw rather than silently dropping it, breaking
// `loadSpecs`, `slicesOf`, `show` and the render/doctor path for the whole
// Spec. Confirmed failing (thrown, not merely assertion-failed) in a
// throwaway detached worktree at the pre anchor
// dc667aef9b6150dc05e3af3348a0620049712764.
// ----------------------------------------------------------------------
{
  const handMovedRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'task-lifecycle-hand-move-'));
  try {
    initLifecycleFixture(handMovedRoot);
    fs.writeFileSync(path.join(handMovedRoot, 'AGENTS.md'),
      '# Agents\n\nSee [TK-001](workbench/specs/S-520-hand-move-fixture/tasks/TK-001/TASK.md) for the fixture rule.\n');
    writeAt(handMovedRoot, 'workbench/specs/S-520-hand-move-fixture/SPEC.md', emptyTableRecordBackedSpec('S-520'));
    writeAt(handMovedRoot, 'workbench/specs/S-520-hand-move-fixture/tasks/TK-001/TASK.md',
      withReceiptRun(doneTaskRecordFixture({
        id: 'TK-001', specId: 'S-520', slice: 'First slice',
        destination: 'spec-acceptance: S-520 Acceptance Criteria', proof: 'landed'
      })));
    writeAt(handMovedRoot, 'workbench/specs/S-520-hand-move-fixture/tasks/TK-002/TASK.md', taskRecordFixture({
      id: 'TK-002', specId: 'S-520', slice: 'Second slice', status: 'ready', blockers: 'none',
      destination: 'spec-acceptance: S-520 Acceptance Criteria'
    }));

    const specDir = path.join(handMovedRoot, 'workbench/specs/S-520-hand-move-fixture');
    assert.deepEqual(listTaskRecords(specDir, handMovedRoot).map((t) => t.id), ['TK-001', 'TK-002'],
      'both Tasks start on the active roster');

    // The naive move a room without this seam would perform: a plain
    // directory rename, no reference repair, no supported destination.
    fs.mkdirSync(path.join(specDir, 'tasks', 'retired'), { recursive: true });
    fs.renameSync(path.join(specDir, 'tasks', 'TK-001'), path.join(specDir, 'tasks', 'retired', 'TK-001'));

    assert.deepEqual(listTaskRecords(specDir, handMovedRoot).map((t) => t.id), ['TK-002'],
      'the hand-moved Task disappears from listTaskRecords, the active roster, with no thrown error');
    assert.deepEqual(listRetiredTaskRecords(specDir, handMovedRoot).map((t) => t.id), ['TK-001'],
      'the hand-moved Task is readable by the historical route, listRetiredTaskRecords, exactly as a seam-moved one would be');

    const spec = loadSpecs(handMovedRoot).find((item) => item.id === 'S-520');
    assert.deepEqual(slicesOf(spec).map((slice) => slice.id), ['TK-002'],
      'slicesOf never resolves the retired Task; selection, claim, close and render never see it again');

    const shown = showSpec(handMovedRoot, 'S-520');
    assert.deepEqual(shown.tasks.map((task) => task.id), ['TK-002'], 'show never lists a retired Task under tasks');
    assert.deepEqual(shown.retiredTasks.map((task) => task.id), ['TK-001'], 'show lists the retired Task under its own key');

    assert.deepEqual(doctor(handMovedRoot).filter((item) => item.taskId === 'TK-001'), [],
      'a hand-moved, done Task raises no finding at all');

    render(handMovedRoot);
    const board = fs.readFileSync(path.join(handMovedRoot, 'TASKBOARD.md'), 'utf8');
    assert.doesNotMatch(board, /TK-001/, 'the hot board never names a retired Task');
    assert.match(board, /TK-002/, 'the hot board still names the Spec\'s live Task');

    // A hand move repairs nothing: only the supported seam (moveTaskRecord)
    // rewrites a live reference. The AGENTS.md reference planted above still
    // names TK-001's stale, pre-move path.
    assert.match(fs.readFileSync(path.join(handMovedRoot, 'AGENTS.md'), 'utf8'),
      /workbench\/specs\/S-520-hand-move-fixture\/tasks\/TK-001\/TASK\.md/,
      'a reference to the hand-moved Task\'s old path is not repaired; only the supported move seam repairs references');

    console.log('ok - a hand-moved Task directory disappears from listTaskRecords, slicesOf, show and the board with no finding, is reachable by listRetiredTaskRecords, and leaves an unrepaired live reference to its old path');
  } finally {
    fs.rmSync(handMovedRoot, { recursive: true, force: true });
  }
}

// ============================================================================
// The real seam: `moveTaskRecord` moves one done Task's own directory into
// `tasks/retired/`, rewrites every live Markdown reference (a root control,
// the moved record's own outgoing links would be rewritten the same way if
// it carried any), leaves a sibling's historical evidence-row reference
// untouched, and refuses a folder outside the closed set, an unknown Spec or
// Task, a Task that is not done, a Task with nothing to carry (no Receipt
// run and no Proof), a dirty working tree, and a second move of an
// already-retired Task.
// ============================================================================
{
  const taskMoveRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'task-lifecycle-move-'));
  try {
    initLifecycleFixture(taskMoveRoot);
    fs.writeFileSync(path.join(taskMoveRoot, 'AGENTS.md'),
      '# Agents\n\nSee [TK-001](workbench/specs/S-521-task-move-fixture/tasks/TK-001/TASK.md) for the fixture rule.\n');
    writeAt(taskMoveRoot, 'workbench/specs/S-521-task-move-fixture/SPEC.md', emptyTableRecordBackedSpec('S-521'));
    writeAt(taskMoveRoot, 'workbench/specs/S-521-task-move-fixture/tasks/TK-001/TASK.md',
      withReceiptRun(doneTaskRecordFixture({
        id: 'TK-001', specId: 'S-521', slice: 'Retiring slice',
        destination: 'spec-acceptance: S-521 Acceptance Criteria', proof: 'landed'
      })));
    // TK-002: not done - the refusal fixture.
    writeAt(taskMoveRoot, 'workbench/specs/S-521-task-move-fixture/tasks/TK-002/TASK.md', taskRecordFixture({
      id: 'TK-002', specId: 'S-521', slice: 'Still open slice', status: 'ready', blockers: 'none',
      destination: 'spec-acceptance: S-521 Acceptance Criteria'
    }));
    // TK-003: done, but no Proof and no Receipt run - "nothing to carry".
    writeAt(taskMoveRoot, 'workbench/specs/S-521-task-move-fixture/tasks/TK-003/TASK.md', taskRecordFixture({
      id: 'TK-003', specId: 'S-521', slice: 'Nothing to carry slice', status: 'done', blockers: 'none',
      destination: 'spec-acceptance: S-521 Acceptance Criteria'
    }));

    execFileSync('git', ['init', '--quiet', taskMoveRoot]);
    execFileSync('git', ['-C', taskMoveRoot, 'config', 'user.email', 'fixture@example.com']);
    execFileSync('git', ['-C', taskMoveRoot, 'config', 'user.name', 'Fixture']);
    execFileSync('git', ['-C', taskMoveRoot, 'add', '-A']);
    execFileSync('git', ['-C', taskMoveRoot, 'commit', '--quiet', '-m', 'initial corpus']);

    assert.deepEqual(TASK_LIFECYCLE_FOLDERS, ['retired'], "archive is ADR-only per ADR-000I; a Task's one lifecycle folder is retired");

    // ---- Refusals, each checked on the still-clean committed tree --------
    assert.throws(() => moveTaskRecord(taskMoveRoot, 'S-521', 'TK-001', 'archive'), /closed set/,
      'refuses a folder outside TASK_LIFECYCLE_FOLDERS; archive is ADR-only');
    assert.throws(() => moveTaskRecord(taskMoveRoot, 'S-999', 'TK-001', 'retired'), /Unknown spec ID: S-999/,
      'refuses an unknown Spec ID');
    assert.throws(() => moveTaskRecord(taskMoveRoot, 'S-521', 'TK-999', 'retired'), /Unknown Task ID: S-521\/TK-999/,
      'refuses an unknown Task ID');
    assert.throws(() => moveTaskRecord(taskMoveRoot, 'S-521', 'TK-002', 'retired'), /TK-002 is ready, not done/,
      'refuses a Task that is not done');
    assert.throws(() => moveTaskRecord(taskMoveRoot, 'S-521', 'TK-003', 'retired'), /nothing to carry/,
      'refuses a done Task with no Receipt run and no Proof to carry');

    fs.writeFileSync(path.join(taskMoveRoot, 'stray-untracked-file.txt'), 'dirty\n');
    assert.throws(() => moveTaskRecord(taskMoveRoot, 'S-521', 'TK-001', 'retired'), /dirty working tree/,
      'refuses a dirty working tree so the candidate shows only this move');
    fs.rmSync(path.join(taskMoveRoot, 'stray-untracked-file.txt'));
    assert.equal(execFileSync('git', ['-C', taskMoveRoot, 'status', '--porcelain'], { encoding: 'utf8' }).trim(), '',
      'the tree is clean again before the real move runs');

    // ---- The real move ------------------------------------------------
    const result = moveTaskRecord(taskMoveRoot, 'S-521', 'TK-001', 'retired');
    assert.equal(result.specId, 'S-521');
    assert.equal(result.taskId, 'TK-001');
    assert.equal(result.folder, 'retired');
    assert.equal(result.from, 'workbench/specs/S-521-task-move-fixture/tasks/TK-001');
    assert.equal(result.to, 'workbench/specs/S-521-task-move-fixture/tasks/retired/TK-001');
    assert.equal(result.usesGit, true);

    const newTaskPath = path.join(taskMoveRoot, 'workbench/specs/S-521-task-move-fixture/tasks/retired/TK-001/TASK.md');
    assert.ok(fs.existsSync(newTaskPath), 'the Task directory moved to tasks/retired/');
    assert.ok(!fs.existsSync(path.join(taskMoveRoot, 'workbench/specs/S-521-task-move-fixture/tasks/TK-001')), 'the old top-level Task directory is gone');

    assert.match(fs.readFileSync(path.join(taskMoveRoot, 'AGENTS.md'), 'utf8'),
      /\[TK-001\]\(workbench\/specs\/S-521-task-move-fixture\/tasks\/retired\/TK-001\/TASK\.md\)/,
      'a root control reference is rewritten to the moved Task\'s real path');

    assert.ok(Object.values(result.referencesRewritten).reduce((a, b) => a + b, 0) >= 1,
      'the move reports the live references it rewrote, counted');

    // `git mv` stages the rename; the content rewrite above must be staged
    // too, not left as a mix - every porcelain line's worktree column blank.
    const porcelain = execFileSync('git', ['-C', taskMoveRoot, 'status', '--porcelain'], { encoding: 'utf8' });
    assert.ok(porcelain.trim().length > 0, 'the move actually changed something');
    for (const line of porcelain.split('\n').filter(Boolean)) {
      assert.equal(line[1], ' ', `line "${line}" must be fully staged, not a mix of staged and unstaged`);
    }

    const specDir = path.join(taskMoveRoot, 'workbench/specs/S-521-task-move-fixture');
    assert.deepEqual(listTaskRecords(specDir, taskMoveRoot).map((t) => t.id), ['TK-002', 'TK-003'],
      'the active roster no longer carries TK-001');
    const retired = listRetiredTaskRecords(specDir, taskMoveRoot);
    assert.deepEqual(retired.map((t) => t.id), ['TK-001']);
    assert.equal(taskStatus(retired[0]), 'done');

    const shown = showSpec(taskMoveRoot, 'S-521');
    assert.deepEqual(shown.tasks.map((t) => t.id), ['TK-002', 'TK-003'], 'the active tasks key never lists a retired Task');
    assert.deepEqual(shown.retiredTasks.map((t) => t.id), ['TK-001'], 'the retired Task is reachable under its own key');

    assert.deepEqual(doctor(taskMoveRoot).filter((item) => item.taskId === 'TK-001'), [],
      'a correctly retired, done Task raises no identity or retired-status finding');
    assert.deepEqual(scanReferences(taskMoveRoot), [],
      'the reference scan finds nothing unresolved anywhere in the room after the move');

    render(taskMoveRoot);
    const catalog = fs.readFileSync(path.join(taskMoveRoot, 'workbench/specs/CATALOG.md'), 'utf8');
    assert.doesNotMatch(catalog, /### Retired/, 'a room that retires only a Task, never a Spec, gains no Retired heading');
    const board = fs.readFileSync(path.join(taskMoveRoot, 'TASKBOARD.md'), 'utf8');
    assert.doesNotMatch(board, /TK-001/, 'the hot board never names a retired Task');

    // A second move of the same, now-retired Task is refused rather than
    // treated as a fresh unknown-id or re-attempted move.
    assert.throws(() => moveTaskRecord(taskMoveRoot, 'S-521', 'TK-001', 'retired'), /is already retired/,
      'refuses a second move of an already-retired Task');

    console.log('ok - moveTaskRecord moves a done Task directory into tasks/retired/, rewrites every live reference, keeps the active roster and hot board silent about it, refuses a folder outside the closed set, an unknown Spec/Task, a not-done Task, a Task with nothing to carry, a dirty tree and a second move, and stays reachable by show and listRetiredTaskRecords');
  } finally {
    fs.rmSync(taskMoveRoot, { recursive: true, force: true });
  }
}

// ============================================================================
// Corrective coverage: a room with no Git working tree at all cannot recover
// a Task move, exactly as `moveSpecDirectory` refuses one.
// ============================================================================
{
  const taskNoGitRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'task-lifecycle-no-git-'));
  try {
    initLifecycleFixture(taskNoGitRoot);
    writeAt(taskNoGitRoot, 'workbench/specs/S-522-no-git-fixture/SPEC.md', emptyTableRecordBackedSpec('S-522'));
    writeAt(taskNoGitRoot, 'workbench/specs/S-522-no-git-fixture/tasks/TK-001/TASK.md',
      withReceiptRun(doneTaskRecordFixture({
        id: 'TK-001', specId: 'S-522', slice: 'First slice',
        destination: 'spec-acceptance: S-522 Acceptance Criteria', proof: 'landed'
      })));

    assert.throws(() => moveTaskRecord(taskNoGitRoot, 'S-522', 'TK-001', 'retired'),
      /requires a Git working tree/,
      'a room with no Git working tree at all refuses the move outright, rather than performing an unrecoverable bare rename');
    assert.ok(fs.existsSync(path.join(taskNoGitRoot, 'workbench/specs/S-522-no-git-fixture/tasks/TK-001/TASK.md')),
      'a refused move leaves the Task exactly where it was');

    console.log('ok - moveTaskRecord refuses a room with no Git working tree at all, since such a move could never be recovered');
  } finally {
    fs.rmSync(taskNoGitRoot, { recursive: true, force: true });
  }
}

// ============================================================================
// Doctor's identity checks and the new retired-task-not-done finding cover
// retired Task records exactly as they cover retired Specs: an id already
// retired cannot be reused (by a new active record, in the same Spec), and a
// retired Task whose own Status disagrees that it is done is reported,
// visible and never blocking.
// ============================================================================
{
  const taskIdentityRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'task-lifecycle-identity-'));
  try {
    initLifecycleFixture(taskIdentityRoot);
    writeAt(taskIdentityRoot, 'workbench/specs/S-523-identity-fixture/SPEC.md', emptyTableRecordBackedSpec('S-523'));
    // A retired Task record whose own Status still says blocked, not done.
    writeAt(taskIdentityRoot, 'workbench/specs/S-523-identity-fixture/tasks/retired/TK-001/TASK.md', taskRecordFixture({
      id: 'TK-001', specId: 'S-523', slice: 'Retired but not done', status: 'blocked', blockers: 'none',
      destination: 'spec-acceptance: S-523 Acceptance Criteria'
    }));
    // An id already retired reused by a new active record in the same Spec.
    writeAt(taskIdentityRoot, 'workbench/specs/S-523-identity-fixture/tasks/TK-001/TASK.md', taskRecordFixture({
      id: 'TK-001', specId: 'S-523', slice: 'Reused id', status: 'ready', blockers: 'none',
      destination: 'spec-acceptance: S-523 Acceptance Criteria'
    }));

    const findings = doctor(taskIdentityRoot);
    assert.ok(findings.some((item) => item.code === 'retired-task-not-done' && item.specId === 'S-523' && item.taskId === 'TK-001'),
      'a retired Task whose Status is not done is reported');
    assert.ok(findings.some((item) => item.code === 'duplicate-id' && item.specId === 'S-523' && item.taskId === 'TK-001'),
      'an id already retired cannot be reused by a new active Task record in the same Spec');

    console.log('ok - doctor\'s duplicate-id check and the new retired-task-not-done finding cover retired Task records');
  } finally {
    fs.rmSync(taskIdentityRoot, { recursive: true, force: true });
  }
}

// ============================================================================
// The Spec-with-unretired-Tasks decision (S-00I TK-004): `moveSpecDirectory`
// is not refused by an active Spec whose own Task record was never
// individually retired first - `git mv` already carries the whole `tasks/`
// directory, so the moved Spec's still-active Task record lands on the
// active roster of its own now-retired Spec, reachable through
// `loadRetiredSpecs`'s own call to `listTaskRecords`, exactly as it would be
// read for any other Spec.
// ============================================================================
{
  const carriedRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'task-lifecycle-carried-'));
  try {
    initLifecycleFixture(carriedRoot);
    writeAt(carriedRoot, 'workbench/specs/S-524-carried-fixture/SPEC.md', completeEmptyTableRecordBackedSpec('S-524'));
    writeAt(carriedRoot, 'workbench/specs/S-524-carried-fixture/tasks/TK-002/TASK.md',
      withReceiptRun(doneTaskRecordFixture({
        id: 'TK-002', specId: 'S-524', slice: 'Never individually retired',
        destination: 'spec-acceptance: S-524 Acceptance Criteria', proof: 'landed'
      })));

    execFileSync('git', ['init', '--quiet', carriedRoot]);
    execFileSync('git', ['-C', carriedRoot, 'config', 'user.email', 'fixture@example.com']);
    execFileSync('git', ['-C', carriedRoot, 'config', 'user.name', 'Fixture']);
    execFileSync('git', ['-C', carriedRoot, 'add', '-A']);
    execFileSync('git', ['-C', carriedRoot, 'commit', '--quiet', '-m', 'initial corpus']);

    moveSpecDirectory(carriedRoot, 'S-524', 'retired');

    const retiredSpecs = loadRetiredSpecs(carriedRoot);
    const moved = retiredSpecs.find((item) => item.id === 'S-524');
    assert.ok(moved, 'the Spec itself moved to retired/');
    assert.deepEqual(moved.records.map((task) => task.id), ['TK-002'],
      'a Task that was never individually retired moves with its Spec and lands on that Spec\'s own active roster, not its retiredRecords');
    assert.deepEqual(moved.retiredRecords, [], 'the carried Task is not itself retired; only its owning Spec is');
    assert.ok(fs.existsSync(path.join(carriedRoot, 'workbench/specs/retired/S-524-carried-fixture/tasks/TK-002/TASK.md')),
      'the unretired Task\'s directory physically moved along with its Spec');

    console.log('ok - moveSpecDirectory carries a Spec\'s still-active, never individually retired Task record along with it, reachable afterward as the retired Spec\'s own active roster');
  } finally {
    fs.rmSync(carriedRoot, { recursive: true, force: true });
  }
}

// ============================================================================
// The reviewer of an assembled Spec report still sees every Task's proof,
// retired or not: `assembleSpecReport`'s merged task list shows a retired
// Task as history, enriched with its own Receipt, exactly as a retained
// slice-table row is shown.
// ============================================================================
{
  const reportRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'task-lifecycle-report-'));
  try {
    initGitRoot(reportRoot);
    writeAt(reportRoot, 'specs/S-525-report-fixture/SPEC.md', emptyTableRecordBackedSpec('S-525'));
    writeAt(reportRoot, 'specs/S-525-report-fixture/tasks/TK-002/TASK.md', taskRecordFixture({
      id: 'TK-002', specId: 'S-525', slice: 'Still open slice', status: 'ready', blockers: 'none',
      destination: 'spec-acceptance: S-525 Acceptance Criteria'
    }));
    writeAt(reportRoot, 'specs/S-525-report-fixture/tasks/retired/TK-001/TASK.md',
      withReceiptRun(doneTaskRecordFixture({
        id: 'TK-001', specId: 'S-525', slice: 'Already retired slice',
        destination: 'spec-acceptance: S-525 Acceptance Criteria', proof: 'landed'
      })));

    const headSha = execFileSync('git', ['-C', reportRoot, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
    const report = assembleSpecReport(reportRoot, 'S-525', { candidate: headSha });
    const retiredEntry = report.tasks.find((task) => task.id === 'TK-001');
    assert.ok(retiredEntry, 'the assembled report still lists the retired Task');
    assert.equal(retiredEntry.status, 'done');
    assert.equal(retiredEntry.proof, 'landed');
    assert.equal(retiredEntry.history, true, 'a retired Task is shown as history, exactly as a retained table row is');
    assert.equal(retiredEntry.source, 'retired-record');
    assert.equal(retiredEntry.receipt.runCount, 1, 'a retired Task\'s own Receipt still enriches its report entry');

    console.log('ok - assembleSpecReport shows a retired Task as history, with its own Receipt, so a reviewer still sees its proof');
  } finally {
    fs.rmSync(reportRoot, { recursive: true, force: true });
  }
}

// ============================================================================
// Corrective review finding 1 (S-00I TK-004 review, "nothing to carry"): the
// contract comment above moveTaskRecord, its inline comment, and its thrown
// message all describe refusing a done Task only when it has *both* no
// Receipt run *and* no Proof to carry (AND) - but the guard itself read
// `!activeTask.proof || receiptRows.length === 0` (OR), so either half
// missing alone was enough to refuse. On the real room this refused
// S-00H/TK-003 - done, with a long Proof, but zero Receipt rows because
// Receipts postdate it - with a message that falsely claimed both were
// missing. Proof alone, or a Receipt run alone, must be enough to carry.
// ============================================================================
{
  const carryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'task-lifecycle-carry-'));
  try {
    initLifecycleFixture(carryRoot);
    writeAt(carryRoot, 'workbench/specs/S-526-carry-fixture/SPEC.md', emptyTableRecordBackedSpec('S-526'));
    // Proof set, no Receipt run at all - exactly the real room's S-00H/TK-003
    // shape (Receipts postdate it). Must move: Proof alone is enough.
    writeAt(carryRoot, 'workbench/specs/S-526-carry-fixture/tasks/TK-001/TASK.md', doneTaskRecordFixture({
      id: 'TK-001', specId: 'S-526', slice: 'Proof only slice',
      destination: 'spec-acceptance: S-526 Acceptance Criteria', proof: 'landed a long fix; no Receipt run exists'
    }));
    // Neither a Proof field nor a Receipt run - genuinely nothing to carry.
    writeAt(carryRoot, 'workbench/specs/S-526-carry-fixture/tasks/TK-002/TASK.md', taskRecordFixture({
      id: 'TK-002', specId: 'S-526', slice: 'Neither slice', status: 'done', blockers: 'none',
      destination: 'spec-acceptance: S-526 Acceptance Criteria'
    }));

    execFileSync('git', ['init', '--quiet', carryRoot]);
    execFileSync('git', ['-C', carryRoot, 'config', 'user.email', 'fixture@example.com']);
    execFileSync('git', ['-C', carryRoot, 'config', 'user.name', 'Fixture']);
    execFileSync('git', ['-C', carryRoot, 'add', '-A']);
    execFileSync('git', ['-C', carryRoot, 'commit', '--quiet', '-m', 'initial corpus']);

    // Checked first, on the still-clean committed tree: a second move right
    // after the first would find a dirty tree (the first move's own staged
    // rename) and throw that refusal instead, masking this one.
    assert.throws(() => moveTaskRecord(carryRoot, 'S-526', 'TK-002', 'retired'),
      /no Receipt run and no Proof/,
      'refuses a done Task with neither a Receipt run nor a Proof, naming both missing halves');

    const result = moveTaskRecord(carryRoot, 'S-526', 'TK-001', 'retired');
    assert.equal(result.taskId, 'TK-001');
    assert.ok(fs.existsSync(path.join(carryRoot, 'workbench/specs/S-526-carry-fixture/tasks/retired/TK-001/TASK.md')),
      'a done Task with Proof and zero Receipt rows moves; Proof alone is enough to carry');

    console.log('ok - moveTaskRecord\'s nothing-to-carry guard refuses only when both a Receipt run and a Proof are absent, not either alone');
  } finally {
    fs.rmSync(carryRoot, { recursive: true, force: true });
  }
}

// ============================================================================
// Corrective review finding 2 (S-00I TK-004 review): `moveTaskRecord`
// rewrites an accepted ADR's `canonicalized_in` frontmatter target through
// the shared rewriter (`rewriteReferenceFile` -> `rewriteCanonicalizedIn`),
// exactly as `moveSpecDirectory` does, but never called `writeRegister`
// afterward - so REGISTER.md/HISTORY.md, which echo canonicalized_in as
// bare generated table text, went stale by construction on every Task move.
// Mirror `moveSpecDirectory`'s own `if (fs.existsSync(collectionPath(root,
// 'adr'))) writeRegister(root)` call.
// ============================================================================
{
  const registerRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'task-lifecycle-register-'));
  try {
    initLifecycleFixture(registerRoot);
    writeAt(registerRoot, 'workbench/specs/S-527-register-fixture/SPEC.md', emptyTableRecordBackedSpec('S-527'));
    writeAt(registerRoot, 'workbench/specs/S-527-register-fixture/tasks/TK-001/TASK.md',
      withReceiptRun(doneTaskRecordFixture({
        id: 'TK-001', specId: 'S-527', slice: 'Register fixture slice',
        destination: 'spec-acceptance: S-527 Acceptance Criteria', proof: 'landed'
      })));

    // An accepted ADR naming the moving Task's live path as a
    // `canonicalized_in` frontmatter target - a root-relative fact, not a
    // body link.
    fs.writeFileSync(path.join(registerRoot, 'workbench/docs/adr/0001-fixture.md'), [
      '---',
      'date: 2026-09-18',
      'canonicalized_in:',
      '  - workbench/specs/S-527-register-fixture/tasks/TK-001/TASK.md',
      '---',
      '',
      '# A fixture decision',
      '',
      'Provenance: owner decision.',
      ''
    ].join('\n'));
    // Seed a correct, up-to-date REGISTER.md/HISTORY.md before the move, so
    // any staleness found afterward is attributable to the move itself.
    writeRegister(registerRoot);

    execFileSync('git', ['init', '--quiet', registerRoot]);
    execFileSync('git', ['-C', registerRoot, 'config', 'user.email', 'fixture@example.com']);
    execFileSync('git', ['-C', registerRoot, 'config', 'user.name', 'Fixture']);
    execFileSync('git', ['-C', registerRoot, 'add', '-A']);
    execFileSync('git', ['-C', registerRoot, 'commit', '--quiet', '-m', 'initial corpus']);

    const registerPath = path.join(registerRoot, 'workbench/docs/adr/REGISTER.md');
    const historyPath = path.join(registerRoot, 'workbench/docs/adr/HISTORY.md');

    moveTaskRecord(registerRoot, 'S-527', 'TK-001', 'retired');

    const adrContent = fs.readFileSync(path.join(registerRoot, 'workbench/docs/adr/0001-fixture.md'), 'utf8');
    assert.match(adrContent, /canonicalized_in:\n {2}- workbench\/specs\/S-527-register-fixture\/tasks\/retired\/TK-001\/TASK\.md/,
      'an accepted ADR\'s canonicalized_in target is rewritten to the moved Task\'s real path');
    assert.deepEqual(validateAdrs(registerRoot).filter((item) => item.code === 'invalid-adr'), [],
      'adr validate stays clean after the move: canonicalized_in still names an existing owner');

    const registerAfter = fs.readFileSync(registerPath, 'utf8');
    const historyAfter = fs.readFileSync(historyPath, 'utf8');
    for (const [name, content] of [['REGISTER.md', registerAfter], ['HISTORY.md', historyAfter]]) {
      assert.match(content, /workbench\/specs\/S-527-register-fixture\/tasks\/retired\/TK-001\/TASK\.md/, `${name} names the moved Task's new path`);
      assert.doesNotMatch(content, /workbench\/specs\/S-527-register-fixture\/tasks\/TK-001\/TASK\.md/, `${name} no longer names the pre-move path`);
    }
    assert.deepEqual(validateAdrs(registerRoot).filter((item) => item.code === 'stale-register'), [],
      'adr validate reports no stale-register once the Task move itself refreshes the projections');

    console.log('ok - moveTaskRecord regenerates REGISTER.md/HISTORY.md after rewriting an accepted ADR\'s canonicalized_in target to the moved Task\'s real path');
  } finally {
    fs.rmSync(registerRoot, { recursive: true, force: true });
  }
}

// ============================================================================
// S-00I TK-005: retireSpec reconciles a completed Spec's surviving current
// claims into a durable Wiki owner - never a copy, `wiki.mjs`'s own
// `copied-task-state` and property validation is the enforcement, never
// re-implemented here - and then retires the whole Spec directory (Task
// records travel with it, never retired one by one first) with
// `moveSpecDirectory`, cleaning up the branches its Tasks' Receipt rows
// name. Every precondition is refused by name before any write. Red at the
// pre anchor 0ba9bc40e7f9ee22876cfac8c5ee4670eaca89d2: `retireSpec` is not
// exported from spec-workbench.mjs at all (confirmed by grep and in a
// throwaway detached worktree at that commit), so the import above fails
// before a single assertion in this file runs - the same shape TK-003's own
// comment documents for `moveSpecDirectory`.
// ============================================================================
function retirementReadySpec(id, taskIds) {
  const evidenceRows = taskIds.map((taskId) => `| 2026-09-18 | ${taskId} | Task closed | fixture proof | fixture docs | none |`);
  return [
    `# ${id} - Retirement Fixture`,
    '',
    `**Spec ID:** ${id}`,
    '**Status:** complete',
    '**Priority:** 0',
    '**Owner:** agent',
    '**Updated:** 2026-09-18',
    '**Catalog description:** Proves Spec retirement.',
    '**Blockers:** none',
    '**Latest event:** Spec completed and removed from the hot board.',
    '**Next gate:** none',
    '',
    '## Vertical Implementation Slices',
    '',
    '| Task | Slice | Status | Blockers | Proof |',
    '|---|---|---|---|---|',
    '',
    '## Acceptance Criteria',
    '',
    '- [x] Expected behavior is verified.',
    '',
    '## Append-Only Evidence And Execution Log',
    '',
    '| Date | Task | Event | Verification | Docs | Remaining gap |',
    '|---|---|---|---|---|---|',
    ...evidenceRows,
    '',
    '## Completion Result',
    '',
    'Landed.',
    '',
    '## Supersession',
    '',
    '- Supersedes: none',
    '- Superseded by: none',
    ''
  ].join('\n');
}

function retirementGuidebookNote(historicalRoute, overrides = {}) {
  const {
    type = 'guidebook',
    knowledgeRole = 'canonical',
    sourcePaths = [historicalRoute],
    // A design-concept article additionally needs `authorized_by` and
    // `parent` inside the frontmatter block itself - never appended after
    // its closing `---`, which would land the fields in the body instead.
    authorizedBy,
    parent,
    body = '# Fixture Capability\n\nDurable prose describing what shipped and why it is trusted.\n'
  } = overrides;
  return [
    '---',
    `type: ${type}`,
    'status: active',
    'sensitivity: normal',
    `knowledge_role: ${knowledgeRole}`,
    'provenance:',
    '  - fixture',
    'source_paths:',
    ...sourcePaths.map((entry) => `  - ${entry}`),
    'last_verified: 2026-09-18',
    ...(authorizedBy !== undefined ? [`authorized_by: ${authorizedBy}`] : []),
    ...(parent !== undefined ? [`parent: ${parent}`] : []),
    '---',
    '',
    body
  ].join('\n');
}

{
  const retireRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-retire-preconditions-'));
  try {
    initLifecycleFixture(retireRoot);
    fs.writeFileSync(path.join(retireRoot, 'AGENTS.md'), '# Agents\n\nRoutes to workbench/wiki.\n');

    // S-560: complete, one done Task record - ready to retire once a durable
    // owner exists.
    writeAt(retireRoot, 'workbench/specs/S-560-precondition-fixture/SPEC.md', retirementReadySpec('S-560', ['TK-001']));
    writeAt(retireRoot, 'workbench/specs/S-560-precondition-fixture/tasks/TK-001/TASK.md',
      withReceiptRun(doneTaskRecordFixture({
        id: 'TK-001', specId: 'S-560', slice: 'First slice',
        destination: 'spec-acceptance: S-560 Acceptance Criteria', proof: 'landed'
      }), { branch: 'claude/precondition-fixture' }));

    // S-561: active, not complete - the status refusal.
    writeAt(retireRoot, 'workbench/specs/S-561-active-fixture/SPEC.md', fixtureSpec().replaceAll('S-001', 'S-561'));

    // S-562: `complete` on its own header, but a live Task record is still
    // in-progress - `report.gaps` must refuse it by name even though the
    // header alone says complete. `completeSpec` would already have refused
    // this Spec; retireSpec must not trust a hand-edited header either.
    writeAt(retireRoot, 'workbench/specs/S-562-unfinished-task-fixture/SPEC.md', retirementReadySpec('S-562', ['TK-001']));
    writeAt(retireRoot, 'workbench/specs/S-562-unfinished-task-fixture/tasks/TK-001/TASK.md', taskRecordFixture({
      id: 'TK-001', specId: 'S-562', slice: 'Unfinished slice', status: 'in-progress', blockers: 'none',
      destination: 'spec-acceptance: S-562 Acceptance Criteria'
    }));

    execFileSync('git', ['init', '--quiet', retireRoot]);
    execFileSync('git', ['-C', retireRoot, 'config', 'user.email', 'fixture@example.com']);
    execFileSync('git', ['-C', retireRoot, 'config', 'user.name', 'Fixture']);
    execFileSync('git', ['-C', retireRoot, 'add', '-A']);
    execFileSync('git', ['-C', retireRoot, 'commit', '--quiet', '-m', 'initial corpus']);
    execFileSync('git', ['-C', retireRoot, 'branch', 'integration']);
    const retireRootInitialSha = headSha(retireRoot);

    const historicalRoute = 'workbench/specs/retired/S-560-precondition-fixture/SPEC.md';

    assert.throws(() => retireSpec(retireRoot), /--wiki/,
      'refuses with no --wiki note named at all');
    assert.throws(() => retireSpec(retireRoot, 'S-999', { wikiNote: 'workbench/wiki/guidebooks/none.md' }), /Unknown spec ID: S-999/,
      'refuses an unknown Spec ID');
    assert.throws(() => retireSpec(retireRoot, 'S-561', { wikiNote: 'workbench/wiki/guidebooks/none.md' }), /S-561 is active, not complete/,
      'refuses a Spec that is not complete');
    assert.throws(() => retireSpec(retireRoot, 'S-562', { wikiNote: 'workbench/wiki/guidebooks/none.md' }), /TK-001 is in-progress, not done/,
      'refuses by name a Task record that is not done, even though the Spec header itself says complete');
    assert.throws(() => retireSpec(retireRoot, 'S-560', { wikiNote: 'workbench/wiki/guidebooks/missing.md' }), /found no Wiki note/,
      'refuses a Spec whose surviving claims name no durable owner: the note does not exist');

    // A wiki note that exists but has the wrong shape, refused by name for
    // each distinct reason before retireSpec ever calls moveSpecDirectory.
    writeAt(retireRoot, 'workbench/wiki/guidebooks/wrong-type.md', retirementGuidebookNote(historicalRoute, { type: 'project' }));
    assert.throws(() => retireSpec(retireRoot, 'S-560', { wikiNote: 'workbench/wiki/guidebooks/wrong-type.md' }), /must declare type design-concept or guidebook/,
      'refuses a note that is not type design-concept or guidebook');

    writeAt(retireRoot, 'workbench/wiki/guidebooks/wrong-role.md', retirementGuidebookNote(historicalRoute, { knowledgeRole: 'derived' }));
    assert.throws(() => retireSpec(retireRoot, 'S-560', { wikiNote: 'workbench/wiki/guidebooks/wrong-role.md' }), /must declare knowledge_role canonical or curated/,
      'refuses a note that is not knowledge_role canonical or curated');

    writeAt(retireRoot, 'workbench/wiki/guidebooks/no-route.md', retirementGuidebookNote(historicalRoute, { sourcePaths: ['BLUEPRINT.md'] }));
    assert.throws(() => retireSpec(retireRoot, 'S-560', { wikiNote: 'workbench/wiki/guidebooks/no-route.md' }), /source_paths must name S-560's historical route/,
      'refuses a note whose source_paths does not name the Spec\'s own historical route');

    // "Transform, never copy": a note that pastes the Spec's own evidence
    // log fails wiki.mjs's copied-task-state validation, and retireSpec
    // refuses it by that name rather than silently accepting a copy.
    writeAt(retireRoot, 'workbench/wiki/guidebooks/pasted-copy.md', retirementGuidebookNote(historicalRoute, {
      body: '# Copied\n\n| Date | Task | Event | Verification | Docs | Remaining gap |\n|---|---|---|---|---|---|\n| 2026-09-18 | TK-001 | Task closed | fixture proof | fixture docs | none |\n'
    }));
    assert.throws(() => retireSpec(retireRoot, 'S-560', { wikiNote: 'workbench/wiki/guidebooks/pasted-copy.md' }), /copied-task-state/,
      'refuses a Wiki note that pastes the Spec\'s own evidence log instead of transforming it into prose');

    // Commit the wiki-note fixtures themselves (this test's own setup, not
    // anything retireSpec wrote) before checking that every refusal above
    // left the tree exactly as this fixture built it.
    execFileSync('git', ['-C', retireRoot, 'add', '-A']);
    execFileSync('git', ['-C', retireRoot, 'commit', '--quiet', '-m', 'fixture wiki notes']);
    assert.equal(execFileSync('git', ['-C', retireRoot, 'status', '--porcelain'], { encoding: 'utf8' }).trim(), '',
      'every refusal above wrote nothing to the working tree');

    console.log('ok - retireSpec refuses an unknown or incomplete Spec, an unfinished Task record even on a hand-completed header, a missing Wiki note, and a Wiki note with the wrong type, knowledge_role, missing historical route, or copied task state - all before any write');

    // S-00J TK-005 landed after this Task's own gate was first built: a
    // recorded owner Human QA approval now exists as a real seam
    // (`recordOwnerApproval`/`assembleSpecReport().latestOwnerApproval`), so
    // retireSpec's own gate is upgraded from "gate on complete only" to
    // requiring the latest owner-qa row for the Spec's current content
    // digest to be an approval - reusing `approvalGapReason` exactly as
    // `completeSpec` already does, never a second implementation of what
    // "approved" means. A valid Wiki note (everything the earlier refusals
    // above proved is otherwise satisfied) with no owner-qa row at all is
    // refused by name, naming the current content digest so a caller can
    // check it against a fresh `report`.
    const validNoteRelative = 'workbench/wiki/guidebooks/precondition-fixture-capability.md';
    writeAt(retireRoot, validNoteRelative, retirementGuidebookNote(historicalRoute));
    execFileSync('git', ['-C', retireRoot, 'add', '-A']);
    execFileSync('git', ['-C', retireRoot, 'commit', '--quiet', '-m', 'author the valid durable owner']);

    // Review corrective (Low): a note satisfying every property check above
    // is still not a durable owner if nothing routes to it. This fixture
    // never gave itself a `workbench/wiki/MEMORY.md` at all (`initLifecycleFixture`
    // does not seed one - the router is authored by Genesis, never blindly
    // seeded), so the check must refuse cleanly on a missing router too, not
    // only an unfilled link inside one that exists.
    assert.throws(() => retireSpec(retireRoot, 'S-560', { wikiNote: validNoteRelative }),
      /is not linked from workbench\/wiki\/MEMORY\.md/,
      'refuses an otherwise-valid note that no MEMORY.md links to (here, no MEMORY.md exists at all)');
    writeAt(retireRoot, 'workbench/wiki/MEMORY.md',
      '# Fixture Room Brain\n\nSee [the fixture capability](guidebooks/precondition-fixture-capability.md).\n');
    execFileSync('git', ['-C', retireRoot, 'add', '-A']);
    execFileSync('git', ['-C', retireRoot, 'commit', '--quiet', '-m', 'route the durable owner from MEMORY.md']);

    const preApprovalDigest = assembleSpecReport(retireRoot, 'S-560').specDigest.slice(0, 12);
    assert.throws(() => retireSpec(retireRoot, 'S-560', { wikiNote: validNoteRelative }),
      new RegExp(`no owner Human QA approval is recorded.*${preApprovalDigest}`, 's'),
      'refuses an otherwise-ready Spec with no recorded owner Human QA approval at all, naming the current content digest');

    // Approval binds to the exact committed fixture content delivered to
    // integration, never an older unrelated contained commit.
    recordOwnerApproval(retireRoot, 'S-560', { candidate: integratedFixtureCandidate(retireRoot), owner: 'Kayden Clark', result: 'approve' });
    execFileSync('git', ['-C', retireRoot, 'add', '-A']);
    execFileSync('git', ['-C', retireRoot, 'commit', '--quiet', '-m', 'record owner Human QA approval']);

    const receipt = retireSpec(retireRoot, 'S-560', { wikiNote: validNoteRelative });
    assert.equal(receipt.specId, 'S-560');
    assert.equal(receipt.ownerApproval.required, true, 'the ownerApproval receipt field now reflects the real, required gate');
    assert.equal(receipt.ownerApproval.approvedBy, 'Kayden Clark');
    assert.ok(fs.existsSync(path.join(retireRoot, 'workbench/specs/retired/S-560-precondition-fixture/SPEC.md')),
      'a Spec with a current owner Human QA approval retires');

    console.log('ok - retireSpec refuses a complete, otherwise-ready Spec with no current owner Human QA approval, naming the digest, and retires once one is recorded');
  } finally {
    fs.rmSync(retireRoot, { recursive: true, force: true });
  }
}

// ============================================================================
// The real seam: retireSpec's success path. Task records travel with the
// Spec directory (never retired one by one first, matching the TK-004
// carried-Tasks decision `moveSpecDirectory` already implements), the
// evidence row lands in the retired Spec's own log, render runs, and the
// branches its Tasks' Receipt rows name are cleaned up: a branch proven
// contained in the declared integration branch is deleted (never `-D`) with
// its registered worktree removed first; an unmerged branch is left alone
// and named with a reason; a branch with neither a local nor a remote ref
// left is reported already cleaned up; a branch that exists only on the
// remote is listed for the closeout recipe, never deleted; a Task with no
// Receipt rows at all (the real S-00H/TK-003 shape) contributes no branch
// and raises nothing.
// ============================================================================
{
  const successRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-retire-success-'));
  const remoteRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-retire-remote-'));
  let worktreePath;
  try {
    initLifecycleFixture(successRoot);
    fs.writeFileSync(path.join(successRoot, 'AGENTS.md'), '# Agents\n\nSee [S-570](workbench/specs/S-570-retiring-fixture/SPEC.md).\n\nRoutes to workbench/wiki.\n');

    const taskIds = ['TK-001', 'TK-002', 'TK-003', 'TK-004', 'TK-005', 'TK-006'];
    writeAt(successRoot, 'workbench/specs/S-570-retiring-fixture/SPEC.md', retirementReadySpec('S-570', taskIds));
    writeAt(successRoot, 'workbench/specs/S-570-retiring-fixture/tasks/TK-001/TASK.md',
      withReceiptRun(doneTaskRecordFixture({ id: 'TK-001', specId: 'S-570', slice: 'Contained slice', destination: 'spec-acceptance: S-570 Acceptance Criteria', proof: 'landed' }), { branch: 'claude/contained-fixture' }));
    writeAt(successRoot, 'workbench/specs/S-570-retiring-fixture/tasks/TK-002/TASK.md',
      withReceiptRun(doneTaskRecordFixture({ id: 'TK-002', specId: 'S-570', slice: 'Contained-with-worktree slice', destination: 'spec-acceptance: S-570 Acceptance Criteria', proof: 'landed' }), { branch: 'claude/contained-worktree-fixture' }));
    writeAt(successRoot, 'workbench/specs/S-570-retiring-fixture/tasks/TK-003/TASK.md',
      withReceiptRun(doneTaskRecordFixture({ id: 'TK-003', specId: 'S-570', slice: 'Unmerged slice', destination: 'spec-acceptance: S-570 Acceptance Criteria', proof: 'landed' }), { branch: 'claude/unmerged-fixture' }));
    writeAt(successRoot, 'workbench/specs/S-570-retiring-fixture/tasks/TK-004/TASK.md',
      doneTaskRecordFixture({ id: 'TK-004', specId: 'S-570', slice: 'No-Receipt slice', destination: 'spec-acceptance: S-570 Acceptance Criteria', proof: 'landed (pre-Receipt Task, the real S-00H/TK-003 shape)' }));
    writeAt(successRoot, 'workbench/specs/S-570-retiring-fixture/tasks/TK-005/TASK.md',
      withReceiptRun(doneTaskRecordFixture({ id: 'TK-005', specId: 'S-570', slice: 'Remote-only slice', destination: 'spec-acceptance: S-570 Acceptance Criteria', proof: 'landed' }), { branch: 'claude/remote-only-fixture' }));
    writeAt(successRoot, 'workbench/specs/S-570-retiring-fixture/tasks/TK-006/TASK.md',
      withReceiptRun(doneTaskRecordFixture({ id: 'TK-006', specId: 'S-570', slice: 'Already-gone slice', destination: 'spec-acceptance: S-570 Acceptance Criteria', proof: 'landed' }), { branch: 'claude/already-gone-fixture' }));

    execFileSync('git', ['init', '--quiet', successRoot]);
    execFileSync('git', ['-C', successRoot, 'config', 'user.email', 'fixture@example.com']);
    execFileSync('git', ['-C', successRoot, 'config', 'user.name', 'Fixture']);
    execFileSync('git', ['-C', successRoot, 'add', '-A']);
    execFileSync('git', ['-C', successRoot, 'commit', '--quiet', '-m', 'initial corpus']);
    execFileSync('git', ['-C', successRoot, 'branch', 'integration']);
    const successRootInitialSha = headSha(successRoot);

    // A branch fully contained in integration (the same commit as HEAD - the
    // trivial but real containment case) with no worktree.
    execFileSync('git', ['-C', successRoot, 'branch', 'claude/contained-fixture']);

    // A second contained branch, but with a *registered worktree* - the
    // worktree must be removed before the branch can be deleted at all.
    execFileSync('git', ['-C', successRoot, 'branch', 'claude/contained-worktree-fixture']);
    worktreePath = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-retire-worktree-'));
    fs.rmdirSync(worktreePath);
    execFileSync('git', ['-C', successRoot, 'worktree', 'add', '--quiet', worktreePath, 'claude/contained-worktree-fixture']);

    // An unmerged branch: a real commit integration does not carry.
    execFileSync('git', ['-C', successRoot, 'branch', 'claude/unmerged-fixture']);
    execFileSync('git', ['-C', successRoot, 'checkout', '--quiet', 'claude/unmerged-fixture']);
    fs.writeFileSync(path.join(successRoot, 'unmerged-only.txt'), 'not on integration\n');
    execFileSync('git', ['-C', successRoot, 'add', '-A']);
    execFileSync('git', ['-C', successRoot, 'commit', '--quiet', '-m', 'unmerged work']);
    execFileSync('git', ['-C', successRoot, 'checkout', '--quiet', 'main']);

    // A branch that exists only on a remote: pushed, then deleted locally.
    execFileSync('git', ['init', '--quiet', '--bare', remoteRoot]);
    execFileSync('git', ['-C', successRoot, 'remote', 'add', 'origin', remoteRoot]);
    execFileSync('git', ['-C', successRoot, 'branch', 'claude/remote-only-fixture']);
    execFileSync('git', ['-C', successRoot, 'push', '--quiet', 'origin', 'claude/remote-only-fixture']);
    execFileSync('git', ['-C', successRoot, 'branch', '-D', 'claude/remote-only-fixture']);

    // `claude/already-gone-fixture` (named by TK-006's Receipt row) is never
    // created at all - the ordinary case once Branch Completion has already
    // run for it, proven here rather than assumed.

    // Review corrective (Low): a lane branch naming this Spec's id that
    // never appended a Receipt row at all - an abandoned or dispatcher-
    // closed lane - is invisible to the Receipt-driven cleanup above. Prove
    // `unmergedBranchesNamingSpec` finds it anyway, locally and on the
    // remote, and never touches either copy.
    execFileSync('git', ['-C', successRoot, 'branch', 'claude/v4-dispatch-close-S-570-orphan']);
    execFileSync('git', ['-C', successRoot, 'checkout', '--quiet', 'claude/v4-dispatch-close-S-570-orphan']);
    fs.writeFileSync(path.join(successRoot, 'orphan-only.txt'), 'no receipt row ever named this branch\n');
    execFileSync('git', ['-C', successRoot, 'add', '-A']);
    execFileSync('git', ['-C', successRoot, 'commit', '--quiet', '-m', 'orphaned lane work']);
    execFileSync('git', ['-C', successRoot, 'push', '--quiet', 'origin', 'claude/v4-dispatch-close-S-570-orphan']);
    execFileSync('git', ['-C', successRoot, 'checkout', '--quiet', 'main']);

    const historicalRoute = 'workbench/specs/retired/S-570-retiring-fixture/SPEC.md';
    const designConceptPath = path.join(successRoot, 'workbench/wiki/design-concepts/retirement-fixture-capability.md');
    fs.writeFileSync(designConceptPath, retirementGuidebookNote(historicalRoute, {
      type: 'design-concept',
      authorizedBy: 'owner',
      parent: 'none',
      body: [
        '# Retirement Fixture Capability',
        '',
        'Durable prose describing what S-570 delivered and why it is trusted.',
        '',
        '## Evidence and Sources',
        '',
        '- [S-570](../../specs/retired/S-570-retiring-fixture/SPEC.md)',
        '',
        '## History',
        '',
        '- 2026-09-18: created on owner direction.',
        ''
      ].join('\n')
    }));
    // Review corrective (Low): the note must be linked from MEMORY.md too.
    writeAt(successRoot, 'workbench/wiki/MEMORY.md',
      '# Fixture Room Brain\n\nSee [the retirement fixture capability](design-concepts/retirement-fixture-capability.md).\n');

    execFileSync('git', ['-C', successRoot, 'add', '-A']);
    execFileSync('git', ['-C', successRoot, 'commit', '--quiet', '-m', 'author the durable owner']);

    // Owner QA inspects the exact assembled fixture content on integration.
    recordOwnerApproval(successRoot, 'S-570', { candidate: integratedFixtureCandidate(successRoot), owner: 'Kayden Clark', result: 'approve' });
    execFileSync('git', ['-C', successRoot, 'add', '-A']);
    execFileSync('git', ['-C', successRoot, 'commit', '--quiet', '-m', 'record owner Human QA approval']);

    assert.equal(loadSpecs(successRoot).some((spec) => spec.id === 'S-570'), true, 'S-570 starts on the active roster');

    const receipt = retireSpec(successRoot, 'S-570', { wikiNote: 'workbench/wiki/design-concepts/retirement-fixture-capability.md' });

    assert.equal(receipt.specId, 'S-570');
    assert.equal(receipt.route, 'workbench/specs/retired/S-570-retiring-fixture/SPEC.md');
    assert.equal(receipt.wikiNote, 'workbench/wiki/design-concepts/retirement-fixture-capability.md');
    assert.equal(receipt.ownerApproval.required, true, 'recordOwnerApproval now exists (S-00J TK-005 landed), so retirement requires a current owner Human QA approval');
    assert.equal(receipt.ownerApproval.approvedBy, 'Kayden Clark');

    assert.deepEqual(receipt.branches.cleaned.sort(), ['claude/contained-fixture', 'claude/contained-worktree-fixture']);
    assert.deepEqual(receipt.branches.remote, ['claude/remote-only-fixture']);
    // `git worktree list` reports its own resolved (symlink-free) path,
    // which on macOS differs textually from `os.tmpdir()`'s own
    // `/var/...` -> `/private/var/...` symlink. The worktree is already
    // gone from disk by this point, so resolve the still-real parent
    // directory instead of the removed leaf, and compare against that.
    const expectedWorktreePath = path.join(fs.realpathSync(path.dirname(worktreePath)), path.basename(worktreePath));
    assert.deepEqual(receipt.branches.worktreesRemoved, [expectedWorktreePath],
      'the registered worktree - the same one this fixture created, modulo a macOS /var -> /private/var symlink - is reported removed');
    assert.ok(receipt.branches.skipped.some((item) => item.branch === 'claude/unmerged-fixture' && /not proven contained/.test(item.reason)));
    assert.ok(receipt.branches.skipped.some((item) => item.branch === 'claude/already-gone-fixture' && /already cleaned up/.test(item.reason)));

    // Review corrective (Low): a lane branch naming S-570 that never
    // appended a Receipt row at all is still found, locally and on the
    // remote, and left alone (never in `branches.cleaned`, `.remote` or
    // `.skipped`, which only ever cover Receipt-named branches).
    assert.deepEqual(receipt.unmergedBranchesNamingSpec.sort(), [
      'claude/v4-dispatch-close-S-570-orphan',
      'origin/claude/v4-dispatch-close-S-570-orphan'
    ], 'an orphaned lane branch naming the Spec id, local and remote, is reported even with no Receipt row ever naming it');
    assert.ok(execFileSync('git', ['-C', successRoot, 'branch', '--list', 'claude/v4-dispatch-close-S-570-orphan'], { encoding: 'utf8' }).includes('claude/v4-dispatch-close-S-570-orphan'),
      'the orphaned branch is only reported, never deleted');

    assert.equal(execFileSync('git', ['-C', successRoot, 'branch', '--list', 'claude/contained-fixture'], { encoding: 'utf8' }).trim(), '', 'the contained branch is actually deleted');
    assert.equal(execFileSync('git', ['-C', successRoot, 'branch', '--list', 'claude/contained-worktree-fixture'], { encoding: 'utf8' }).trim(), '', 'the contained, worktree-registered branch is actually deleted');
    assert.ok(execFileSync('git', ['-C', successRoot, 'branch', '--list', 'claude/unmerged-fixture'], { encoding: 'utf8' }).includes('claude/unmerged-fixture'), 'the unmerged branch is never deleted');
    assert.equal(fs.existsSync(worktreePath), false, 'the registered worktree is actually removed from disk');
    assert.equal((execFileSync('git', ['-C', successRoot, 'worktree', 'list', '--porcelain'], { encoding: 'utf8' }).match(/^worktree /gm) ?? []).length, 1, 'only the main worktree remains');

    const newSpecPath = path.join(successRoot, 'workbench/specs/retired/S-570-retiring-fixture/SPEC.md');
    assert.ok(fs.existsSync(newSpecPath), 'the Spec directory moved to retired/');
    for (const id of taskIds) {
      assert.ok(fs.existsSync(path.join(successRoot, `workbench/specs/retired/S-570-retiring-fixture/tasks/${id}/TASK.md`)), `${id} travelled with its Spec rather than being retired one by one first`);
    }
    assert.ok(!fs.existsSync(path.join(successRoot, 'workbench/specs/S-570-retiring-fixture')), 'the old top-level directory is gone');

    const movedContent = fs.readFileSync(newSpecPath, 'utf8');
    assert.match(movedContent, /\| \d{4}-\d{2}-\d{2} \| spec \| Spec retired to workbench\/specs\/retired\/S-570-retiring-fixture\/SPEC\.md \| workbench\/wiki\/design-concepts\/retirement-fixture-capability\.md \| claude\/contained-fixture, claude\/contained-worktree-fixture \| \d+ \|/,
      'the evidence row names the historical route, the wiki note, the cleaned branches, and the rewritten-reference count');

    assert.match(fs.readFileSync(path.join(successRoot, 'AGENTS.md'), 'utf8'), /\[S-570\]\(workbench\/specs\/retired\/S-570-retiring-fixture\/SPEC\.md\)/,
      'a live reference is rewritten by the same move moveSpecDirectory performs');

    assert.equal(loadSpecs(successRoot).some((spec) => spec.id === 'S-570'), false, 'the active roster no longer carries S-570');
    assert.equal(nextWork(successRoot), null, 'next offers nothing once the only Spec has retired');
    const board = fs.readFileSync(path.join(successRoot, 'TASKBOARD.md'), 'utf8');
    assert.doesNotMatch(board, /S-570/, 'render already ran inside retireSpec; the hot board never names a retired Spec');
    const catalog = fs.readFileSync(path.join(successRoot, 'workbench/specs/CATALOG.md'), 'utf8');
    assert.match(catalog, /### Retired/);
    assert.match(catalog, /\[workbench\/specs\/retired\/S-570-retiring-fixture\/SPEC\.md\]/, 'the catalog\'s Retired heading reaches it by its historical route');

    const shown = showSpec(successRoot, 'S-570');
    assert.equal(shown.status, 'complete');
    assert.equal(shown.path, 'workbench/specs/retired/S-570-retiring-fixture/SPEC.md');

    assert.deepEqual(scanReferences(successRoot), [], 'no reference is left dangling anywhere in the room after retirement');
    assert.deepEqual(doctor(successRoot).filter((item) => item.specId === 'S-570'), [], 'a correctly retired, complete Spec raises no identity or retired-status finding');

    const porcelainAfter = execFileSync('git', ['-C', successRoot, 'status', '--porcelain'], { encoding: 'utf8' });
    assert.ok(porcelainAfter.trim().length > 0, 'retirement actually changed something');
    for (const line of porcelainAfter.split('\n').filter(Boolean)) {
      assert.equal(line[1], ' ', `line "${line}" must be fully staged, matching moveSpecDirectory's own convention of leaving one reviewable candidate`);
    }

    console.log('ok - retireSpec carries a completed Spec\'s Task records with it into retired/, appends the evidence row into the moved file, runs render, and cleans up only the branches its Tasks\' Receipt rows prove contained - leaving an unmerged branch alone, listing a remote-only branch for the closeout recipe, and reporting an already-gone branch as already cleaned up');
  } finally {
    fs.rmSync(successRoot, { recursive: true, force: true });
    fs.rmSync(remoteRoot, { recursive: true, force: true });
    if (worktreePath) fs.rmSync(worktreePath, { recursive: true, force: true });
  }
}

// ============================================================================
// The `retire-spec` CLI verb parses like every other lifecycle command.
// ============================================================================
{
  assert.deepEqual(
    parseCliArgs(['retire-spec', 'S-500', '--wiki', 'workbench/wiki/guidebooks/x.md']),
    { command: 'retire-spec', id: 'S-500', options: { wiki: 'workbench/wiki/guidebooks/x.md' } }
  );
  console.log('ok - retire-spec parses its --wiki option like every other lifecycle command');
}

// ============================================================================
// S-00I TK-006: discard is `git rm` of a retired record, never `archive`.
// Every gate below is refused by name before any write: the record must
// actually live under `retired/`; the retiring commit (resolved from Git
// history, never trusted from text - see the comment on `resolveMovingCommit`
// in spec-workbench.mjs) must be verified contained in the declared default
// branch's remote-tracking ref; a complete reference and link scan
// (`referencesToPath`) must find nothing current naming the record; and, for
// a Spec, its Wiki durable owner must still be `active`. Red at the pre
// anchor bd74139b07642c1f17df86d670a6c92379e543b: `discardRetiredSpec`,
// `discardRetiredTask` and `referencesToPath` are not exported from
// spec-workbench.mjs at all, so the import above fails before a single
// assertion in this file runs - confirmed in a throwaway detached worktree
// at that commit, the same shape every earlier S-00I lane's own red proof
// takes.
// ============================================================================
{
  const discardRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-discard-'));
  const remoteRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-discard-remote-'));
  try {
    initLifecycleFixture(discardRoot);
    fs.writeFileSync(path.join(discardRoot, 'AGENTS.md'), '# Agents\n\nRoutes to workbench/wiki.\n');

    writeAt(discardRoot, 'workbench/specs/S-580-discard-fixture/SPEC.md', retirementReadySpec('S-580', ['TK-001']));
    writeAt(discardRoot, 'workbench/specs/S-580-discard-fixture/tasks/TK-001/TASK.md',
      withReceiptRun(doneTaskRecordFixture({ id: 'TK-001', specId: 'S-580', slice: 'Discard fixture slice', destination: 'spec-acceptance: S-580 Acceptance Criteria', proof: 'landed' }), { branch: 'claude/discard-fixture' }));

    execFileSync('git', ['init', '--quiet', discardRoot]);
    execFileSync('git', ['-C', discardRoot, 'config', 'user.email', 'fixture@example.com']);
    execFileSync('git', ['-C', discardRoot, 'config', 'user.name', 'Fixture']);
    execFileSync('git', ['-C', discardRoot, 'add', '-A']);
    execFileSync('git', ['-C', discardRoot, 'commit', '--quiet', '-m', 'initial corpus']);
    execFileSync('git', ['-C', discardRoot, 'branch', 'integration']);
    const discardRootInitialSha = headSha(discardRoot);

    const historicalRoute = 'workbench/specs/retired/S-580-discard-fixture/SPEC.md';
    const historicalDir = path.dirname(historicalRoute);
    writeAt(discardRoot, 'workbench/wiki/design-concepts/discard-fixture-capability.md', retirementGuidebookNote(historicalRoute, {
      type: 'design-concept',
      authorizedBy: 'owner',
      parent: 'none',
      body: [
        '# Discard Fixture Capability',
        '',
        'Durable prose describing what S-580 delivered and why it is trusted.',
        '',
        '## Evidence and Sources',
        '',
        '- [S-580](../../specs/retired/S-580-discard-fixture/SPEC.md)',
        '',
        '## History',
        '',
        '- 2026-09-18: created on owner direction.',
        ''
      ].join('\n')
    }));
    writeAt(discardRoot, 'workbench/wiki/MEMORY.md',
      '# Fixture Room Brain\n\nSee [the discard fixture capability](design-concepts/discard-fixture-capability.md).\n');
    execFileSync('git', ['-C', discardRoot, 'add', '-A']);
    execFileSync('git', ['-C', discardRoot, 'commit', '--quiet', '-m', 'author the durable owner']);

    recordOwnerApproval(discardRoot, 'S-580', { candidate: integratedFixtureCandidate(discardRoot), owner: 'Kayden Clark', result: 'approve' });
    execFileSync('git', ['-C', discardRoot, 'add', '-A']);
    execFileSync('git', ['-C', discardRoot, 'commit', '--quiet', '-m', 'record owner Human QA approval']);

    retireSpec(discardRoot, 'S-580', { wikiNote: 'workbench/wiki/design-concepts/discard-fixture-capability.md' });
    execFileSync('git', ['-C', discardRoot, 'add', '-A']);
    execFileSync('git', ['-C', discardRoot, 'commit', '--quiet', '-m', 'retire S-580']);

    assert.throws(() => discardRetiredSpec(discardRoot, 'S-999'), /Unknown spec ID: S-999/, 'refuses an unknown Spec ID');
    // Never `archive`: `SPEC_LIFECYCLE_FOLDERS` is retired-only (ADR-000I
    // reserves `archive` for ADRs alone), so nothing has ever been placed
    // there for a Spec, and a made-up name discard has never seen resolves
    // exactly like any other unknown id - proof that discard has no code
    // path into archive at all.
    assert.throws(() => discardRetiredSpec(discardRoot, 'archive'), /Unknown spec ID: archive/, 'never resolves anything named archive; there is no archive lifecycle folder a Spec can occupy');

    writeAt(discardRoot, 'workbench/specs/S-581-active-fixture/SPEC.md', fixtureSpec().replaceAll('S-001', 'S-581'));
    execFileSync('git', ['-C', discardRoot, 'add', '-A']);
    execFileSync('git', ['-C', discardRoot, 'commit', '--quiet', '-m', 'add an active fixture']);
    assert.throws(() => discardRetiredSpec(discardRoot, 'S-581'), /S-581 is on the active roster, not retired; discard only ever removes a retired record/, 'refuses a Spec that is still on the active roster');

    assert.throws(() => discardRetiredSpec(discardRoot, 'S-580'), /no origin\/main remote-tracking ref exists/, 'refuses when there is no origin\\/<default branch> ref to verify containment against');

    execFileSync('git', ['init', '--quiet', '--bare', remoteRoot]);
    execFileSync('git', ['-C', discardRoot, 'remote', 'add', 'origin', remoteRoot]);
    execFileSync('git', ['-C', discardRoot, 'push', '--quiet', 'origin', `${discardRootInitialSha}:refs/heads/main`]);
    assert.throws(() => discardRetiredSpec(discardRoot, 'S-580'), /not verified contained in origin\/main/, 'refuses while the retiring commit is not yet on origin/main');

    execFileSync('git', ['-C', discardRoot, 'push', '--quiet', '--force', 'origin', 'HEAD:refs/heads/main']);

    fs.writeFileSync(path.join(discardRoot, 'AGENTS.md'), '# Agents\n\nSee [S-580](workbench/specs/retired/S-580-discard-fixture/SPEC.md).\n\nRoutes to workbench/wiki.\n');
    execFileSync('git', ['-C', discardRoot, 'add', '-A']);
    execFileSync('git', ['-C', discardRoot, 'commit', '--quiet', '-m', 'add a stray reference']);
    execFileSync('git', ['-C', discardRoot, 'push', '--quiet', 'origin', 'HEAD:refs/heads/main']);
    assert.throws(() => discardRetiredSpec(discardRoot, 'S-580'), /a complete reference scan still finds/, 'refuses while a current reference still names the retired record');
    // Called directly (no `excludeFiles`), `referencesToPath` also finds the
    // durable-owner Wiki note's own sanctioned "Evidence and Sources"
    // citation of S-580 - the fact `discardRetiredSpec` itself excludes by
    // name before running this same scan (see the comment above the call in
    // spec-workbench.mjs), never a second stray reference on top of AGENTS.md.
    assert.deepEqual(
      referencesToPath(discardRoot, historicalDir).map((item) => item.file).sort(),
      ['AGENTS.md', 'workbench/wiki/design-concepts/discard-fixture-capability.md'],
      'referencesToPath itself finds the stray AGENTS.md reference and the durable owner\'s own sanctioned self-citation, which discardRetiredSpec excludes explicitly'
    );

    fs.writeFileSync(path.join(discardRoot, 'AGENTS.md'), '# Agents\n\nRoutes to workbench/wiki.\n');
    execFileSync('git', ['-C', discardRoot, 'add', '-A']);
    execFileSync('git', ['-C', discardRoot, 'commit', '--quiet', '-m', 'remove the stray reference']);
    execFileSync('git', ['-C', discardRoot, 'push', '--quiet', 'origin', 'HEAD:refs/heads/main']);

    const notePath = path.join(discardRoot, 'workbench/wiki/design-concepts/discard-fixture-capability.md');
    fs.writeFileSync(notePath, fs.readFileSync(notePath, 'utf8').replace('status: active', 'status: stale'));
    execFileSync('git', ['-C', discardRoot, 'add', '-A']);
    execFileSync('git', ['-C', discardRoot, 'commit', '--quiet', '-m', 'mark the wiki owner stale']);
    execFileSync('git', ['-C', discardRoot, 'push', '--quiet', 'origin', 'HEAD:refs/heads/main']);
    assert.throws(() => discardRetiredSpec(discardRoot, 'S-580'), /its Wiki durable owner is status stale, not active/, 'refuses while its Wiki durable owner is not active');

    fs.writeFileSync(notePath, fs.readFileSync(notePath, 'utf8').replace('status: stale', 'status: active'));
    execFileSync('git', ['-C', discardRoot, 'add', '-A']);
    execFileSync('git', ['-C', discardRoot, 'commit', '--quiet', '-m', 'restore the wiki owner']);
    execFileSync('git', ['-C', discardRoot, 'push', '--quiet', 'origin', 'HEAD:refs/heads/main']);

    fs.writeFileSync(path.join(discardRoot, 'scratch.txt'), 'dirty\n');
    assert.throws(() => discardRetiredSpec(discardRoot, 'S-580'), /discard refuses a dirty working tree/, 'refuses a dirty working tree');
    fs.rmSync(path.join(discardRoot, 'scratch.txt'));

    assert.equal(execFileSync('git', ['-C', discardRoot, 'status', '--porcelain'], { encoding: 'utf8' }).trim(), '', 'every refusal above wrote nothing to the working tree');

    console.log('ok - discardRetiredSpec refuses an unknown or still-active Spec, anything not literally under retired/ (proving discard never reaches archive), an unverifiable or unmet main-containment check, a live reference naming the record, a stale Wiki durable owner, and a dirty working tree - all before any write');

    const reviewedNote = fs.readFileSync(notePath, 'utf8');
    const memoryPath = path.join(discardRoot, 'workbench/wiki/MEMORY.md');
    const routedMemory = fs.readFileSync(memoryPath, 'utf8');
    execFileSync('git', ['-C', discardRoot, 'rm', '--quiet', 'workbench/wiki/design-concepts/discard-fixture-capability.md']);
    fs.writeFileSync(memoryPath, '# Fixture Room Brain\n');
    execFileSync('git', ['-C', discardRoot, 'add', '-A']);
    execFileSync('git', ['-C', discardRoot, 'commit', '--quiet', '-m', 'missing durable owner']);
    const beforeMissingOwner = execFileSync('git', ['-C', discardRoot, 'write-tree'], { encoding: 'utf8' });
    assert.throws(() => discardRetiredSpec(discardRoot, 'S-580'), /no Wiki note names/);
    assert.equal(execFileSync('git', ['-C', discardRoot, 'write-tree'], { encoding: 'utf8' }), beforeMissingOwner);
    assert.equal(execFileSync('git', ['-C', discardRoot, 'status', '--porcelain'], { encoding: 'utf8' }), '');
    assert.ok(fs.existsSync(path.join(discardRoot, historicalRoute)));
    fs.writeFileSync(notePath, reviewedNote);
    fs.writeFileSync(memoryPath, routedMemory);
    execFileSync('git', ['-C', discardRoot, 'add', '-A']);
    execFileSync('git', ['-C', discardRoot, 'commit', '--quiet', '-m', 'restore durable owner']);
    fs.writeFileSync(notePath, reviewedNote.replace('## Evidence and Sources', 'Use [the current procedure](../../specs/retired/S-580-discard-fixture/SPEC.md).\n\n## Evidence and Sources'));
    execFileSync('git', ['-C', discardRoot, 'add', '-A']);
    execFileSync('git', ['-C', discardRoot, 'commit', '--quiet', '-m', 'operational owner reference']);
    assert.throws(() => discardRetiredSpec(discardRoot, 'S-580'), /complete reference scan/, 'the durable owner has no whole-file exemption');
    assert.equal(execFileSync('git', ['-C', discardRoot, 'status', '--porcelain'], { encoding: 'utf8' }), '');
    fs.writeFileSync(notePath, reviewedNote);
    execFileSync('git', ['-C', discardRoot, 'add', '-A']);
    execFileSync('git', ['-C', discardRoot, 'commit', '--quiet', '-m', 'reconcile operational reference']);
    const receipt = discardRetiredSpec(discardRoot, 'S-580');
    assert.equal(receipt.specId, 'S-580');
    assert.equal(receipt.historicalRoute, historicalRoute);
    assert.match(receipt.retiringCommit, /^[0-9a-f]{40}$/);
    assert.match(receipt.discardParentCommit, /^[0-9a-f]{40}$/);
    assert.equal(receipt.recoveryCommand, `git checkout ${receipt.recoveryCommit} -- ${historicalDir}`);
    assert.equal(receipt.register, 'workbench/specs/DISCARDS.md');
    assert.ok(!fs.existsSync(path.join(discardRoot, historicalDir)), 'the whole retired Spec directory, not only SPEC.md, is actually gone');

    const discards = fs.readFileSync(path.join(discardRoot, 'workbench/specs/DISCARDS.md'), 'utf8');
    assert.match(discards, /^# Discards$/m);
    assert.match(
      discards,
      new RegExp(`\\| \\d{4}-\\d{2}-\\d{2} \\| spec \\| S-580 \\| ${escapeForRegExp(historicalRoute)} \\| ${receipt.retiringCommit} \\| ${receipt.discardParentCommit} \\| git checkout ${receipt.recoveryCommit} -- ${escapeForRegExp(historicalDir)} \\|`, 'm'),
      'the discards register names the record, the retiring commit, the discard\'s parent commit, and a literal recovery command'
    );

    assert.equal(loadRetiredSpecs(discardRoot).some((spec) => spec.id === 'S-580'), false, 'S-580 is gone from the retired roster too');
    assert.deepEqual(doctor(discardRoot).filter((item) => item.specId === 'S-580'), [], 'a correctly discarded Spec raises no identity or lifecycle finding');

    assert.deepEqual(scanReferences(discardRoot), [], 'successful discard leaves no dangling durable-owner citation');
    assert.deepEqual(doctor(discardRoot).filter(item => item.code === 'discarded-reference'), []);
    assert.match(fs.readFileSync(notePath, 'utf8'), /git show [0-9a-f]{40}:workbench\/specs\/retired\/S-580-discard-fixture\/SPEC.md/);
    const cleanAgents = fs.readFileSync(path.join(discardRoot, 'AGENTS.md'), 'utf8');
    fs.appendFileSync(path.join(discardRoot, 'AGENTS.md'), '\n[Discarded record](workbench/specs/retired/S-580-discard-fixture/SPEC.md)\n');
    assert.ok(doctor(discardRoot).some(item => item.code === 'discarded-reference' && item.blocks === 'selection'));
    assert.equal(nextWork(discardRoot), null, 'selection consumes the registered discarded-reference blocker');
    assert.throws(() => claimWork(discardRoot, 'S-581', { agent: 'fixture' }), /discarded-reference/);
    fs.writeFileSync(path.join(discardRoot, 'AGENTS.md'), cleanAgents);
    const catalogAfter = fs.readFileSync(path.join(discardRoot, 'workbench/specs/CATALOG.md'), 'utf8');
    assert.doesNotMatch(catalogAfter, /S-580-discard-fixture/, 'render already ran inside discardRetiredSpec; the catalog no longer names the discarded Spec even by its historical route');

    const porcelainAfter = execFileSync('git', ['-C', discardRoot, 'status', '--porcelain'], { encoding: 'utf8' });
    assert.ok(porcelainAfter.trim().length > 0, 'discard actually changed something');
    for (const line of porcelainAfter.split('\n').filter(Boolean)) {
      assert.equal(line[1], ' ', `line "${line}" must be fully staged, matching this room's own move/retire convention`);
    }

    // Git actually recovers it, exactly by the printed recovery command.
    execFileSync('git', ['-C', discardRoot, 'commit', '--quiet', '-m', 'discard S-580']);
    execFileSync('git', ['-C', discardRoot, 'checkout', '--quiet', receipt.retiringCommit, '--', historicalDir]);
    assert.ok(fs.existsSync(path.join(discardRoot, historicalRoute)), 'the retiring commit still holds SPEC.md');
    assert.ok(fs.existsSync(path.join(discardRoot, historicalDir, 'tasks/TK-001/TASK.md')), 'and the whole directory it carried, including its Task record');
    execFileSync('git', ['-C', discardRoot, 'reset', '--quiet', 'HEAD', '--', historicalDir]);
    fs.rmSync(path.join(discardRoot, historicalDir), { recursive: true, force: true });

    console.log('ok - discardRetiredSpec succeeds once every gate is satisfied: it removes the whole retired directory, records a Git-recoverable identity in the DISCARDS.md register, runs render, leaves one fully staged candidate, and its own printed recovery command actually restores the record from history');
  } finally {
    fs.rmSync(discardRoot, { recursive: true, force: true });
    fs.rmSync(remoteRoot, { recursive: true, force: true });
  }
}

// ============================================================================
// discardRetiredTask: the same containment, dirty-tree and reference-scan
// gates apply to a retired Task record. It has no evidence-log analogue and
// `moveTaskRecord` requires no Wiki note at all, so there is no durable-
// owner gate to repeat here. Fixture-only: no room in this repository has
// ever retired a Task into `tasks/retired/`.
// ============================================================================
{
  const taskDiscardRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'task-discard-'));
  const taskDiscardRemote = fs.mkdtempSync(path.join(os.tmpdir(), 'task-discard-remote-'));
  try {
    initLifecycleFixture(taskDiscardRoot);
    fs.writeFileSync(path.join(taskDiscardRoot, 'AGENTS.md'), '# Agents\n\nRoutes to workbench/wiki.\n');

    writeAt(taskDiscardRoot, 'workbench/specs/S-592-task-discard-fixture/SPEC.md', emptyTableRecordBackedSpec('S-592'));
    writeAt(taskDiscardRoot, 'workbench/specs/S-592-task-discard-fixture/tasks/TK-001/TASK.md',
      withReceiptRun(doneTaskRecordFixture({ id: 'TK-001', specId: 'S-592', slice: 'Task discard fixture slice', destination: 'spec-acceptance: S-592 Acceptance Criteria', proof: 'landed' }), { branch: 'claude/task-discard-fixture' }));
    execFileSync('git', ['init', '--quiet', taskDiscardRoot]);
    execFileSync('git', ['-C', taskDiscardRoot, 'config', 'user.email', 'fixture@example.com']);
    execFileSync('git', ['-C', taskDiscardRoot, 'config', 'user.name', 'Fixture']);
    execFileSync('git', ['-C', taskDiscardRoot, 'add', '-A']);
    execFileSync('git', ['-C', taskDiscardRoot, 'commit', '--quiet', '-m', 'initial corpus']);

    moveTaskRecord(taskDiscardRoot, 'S-592', 'TK-001', 'retired');
    execFileSync('git', ['-C', taskDiscardRoot, 'add', '-A']);
    execFileSync('git', ['-C', taskDiscardRoot, 'commit', '--quiet', '-m', 'retire TK-001']);

    const taskHistoricalRoute = 'workbench/specs/S-592-task-discard-fixture/tasks/retired/TK-001/TASK.md';

    assert.throws(() => discardRetiredTask(taskDiscardRoot, 'S-592', 'TK-999'), /Unknown Task ID: S-592\/TK-999/, 'refuses an unknown Task ID');

    assert.throws(() => discardRetiredTask(taskDiscardRoot, 'S-592', 'TK-001'), /no origin\/main remote-tracking ref exists/, 'refuses when there is no origin/<default branch> ref to verify containment against');

    execFileSync('git', ['init', '--quiet', '--bare', taskDiscardRemote]);
    execFileSync('git', ['-C', taskDiscardRoot, 'remote', 'add', 'origin', taskDiscardRemote]);
    execFileSync('git', ['-C', taskDiscardRoot, 'push', '--quiet', 'origin', 'HEAD:refs/heads/main']);

    fs.writeFileSync(path.join(taskDiscardRoot, 'AGENTS.md'), '# Agents\n\nSee [S-592 TK-001](workbench/specs/S-592-task-discard-fixture/tasks/retired/TK-001/TASK.md).\n\nRoutes to workbench/wiki.\n');
    execFileSync('git', ['-C', taskDiscardRoot, 'add', '-A']);
    execFileSync('git', ['-C', taskDiscardRoot, 'commit', '--quiet', '-m', 'add a stray reference to the retired Task']);
    execFileSync('git', ['-C', taskDiscardRoot, 'push', '--quiet', 'origin', 'HEAD:refs/heads/main']);
    assert.throws(() => discardRetiredTask(taskDiscardRoot, 'S-592', 'TK-001'), /a complete reference scan still finds/, 'refuses while a current reference still names the retired Task');

    fs.writeFileSync(path.join(taskDiscardRoot, 'AGENTS.md'), '# Agents\n\nRoutes to workbench/wiki.\n');
    execFileSync('git', ['-C', taskDiscardRoot, 'add', '-A']);
    execFileSync('git', ['-C', taskDiscardRoot, 'commit', '--quiet', '-m', 'remove the stray reference']);
    execFileSync('git', ['-C', taskDiscardRoot, 'push', '--quiet', 'origin', 'HEAD:refs/heads/main']);

    fs.writeFileSync(path.join(taskDiscardRoot, 'scratch.txt'), 'dirty\n');
    assert.throws(() => discardRetiredTask(taskDiscardRoot, 'S-592', 'TK-001'), /discard refuses a dirty working tree/, 'refuses a dirty working tree');
    fs.rmSync(path.join(taskDiscardRoot, 'scratch.txt'));

    const originalTask = fs.readFileSync(path.join(taskDiscardRoot, taskHistoricalRoute), 'utf8');
    execFileSync('git', ['-C', taskDiscardRoot, 'rm', '-r', '--quiet', path.dirname(taskHistoricalRoute)]);
    execFileSync('git', ['-C', taskDiscardRoot, 'commit', '--quiet', '-m', 'remove first incarnation']);
    writeAt(taskDiscardRoot, taskHistoricalRoute, originalTask.replace('Task discard fixture slice', 'Second incarnation'));
    writeAt(taskDiscardRoot, path.dirname(taskHistoricalRoute) + '/proof.txt', 'second incarnation proof');
    execFileSync('git', ['-C', taskDiscardRoot, 'add', '-A']);
    execFileSync('git', ['-C', taskDiscardRoot, 'commit', '--quiet', '-m', 're-add retired task']);
    const readdedSha = headSha(taskDiscardRoot);
    assert.throws(() => discardRetiredTask(taskDiscardRoot, 'S-592', 'TK-001'), /not verified contained/, 'obsolete first-add containment cannot authorize a re-add');
    assert.equal(headSha(taskDiscardRoot), readdedSha);
    execFileSync('git', ['-C', taskDiscardRoot, 'push', '--quiet', 'origin', 'HEAD:refs/heads/main']);
    writeAt(taskDiscardRoot, path.dirname(taskHistoricalRoute) + '/proof.txt', 'latest proof');
    execFileSync('git', ['-C', taskDiscardRoot, 'add', '-A']);
    execFileSync('git', ['-C', taskDiscardRoot, 'commit', '--quiet', '-m', 'update sibling proof']);
    assert.throws(() => discardRetiredTask(taskDiscardRoot, 'S-592', 'TK-001'), /not verified contained/, 'all current bytes need containment, including sibling proof');
    execFileSync('git', ['-C', taskDiscardRoot, 'push', '--quiet', 'origin', 'HEAD:refs/heads/main']);

    const boardPath = path.join(taskDiscardRoot, 'TASKBOARD.md');
    const validBoard = fs.readFileSync(boardPath, 'utf8');
    fs.writeFileSync(boardPath, validBoard.replace('<!-- hot-specs:end -->', 'missing end marker'));
    execFileSync('git', ['-C', taskDiscardRoot, 'add', '-A']);
    execFileSync('git', ['-C', taskDiscardRoot, 'commit', '--quiet', '-m', 'break render markers']);
    assert.throws(() => discardRetiredTask(taskDiscardRoot, 'S-592', 'TK-001'), /marker|region/i);
    assert.equal(execFileSync('git', ['-C', taskDiscardRoot, 'status', '--porcelain'], { encoding: 'utf8' }), '', 'render preflight failure is mutation-free');
    assert.ok(fs.existsSync(path.join(taskDiscardRoot, taskHistoricalRoute)));
    fs.writeFileSync(boardPath, validBoard);
    execFileSync('git', ['-C', taskDiscardRoot, 'add', '-A']);
    execFileSync('git', ['-C', taskDiscardRoot, 'commit', '--quiet', '-m', 'restore render markers']);
    const receipt = discardRetiredTask(taskDiscardRoot, 'S-592', 'TK-001');
    assert.equal(receipt.retiringCommit, readdedSha);
    assert.equal(findSpec(taskDiscardRoot, 'S-592').recordBacked, true);
    assert.deepEqual(findSpec(taskDiscardRoot, 'S-592').records, []);
    execFileSync('git', ['-C', taskDiscardRoot, 'commit', '--quiet', '-m', 'discard final Task']);
    const fresh = fs.mkdtempSync(path.join(os.tmpdir(), 'task-discard-clone-'));
    try {
      execFileSync('git', ['clone', '--quiet', taskDiscardRoot, fresh]);
      assert.equal(findSpec(fresh, 'S-592').recordBacked, true, 'record-backed interpretation survives fresh clone');
      execFileSync('git', ['-C', fresh, 'checkout', receipt.recoveryCommit, '--', path.dirname(taskHistoricalRoute)]);
      assert.match(fs.readFileSync(path.join(fresh, taskHistoricalRoute), 'utf8'), /Second incarnation/);
      assert.equal(fs.readFileSync(path.join(fresh, path.dirname(taskHistoricalRoute), 'proof.txt'), 'utf8'), 'latest proof');
    } finally { fs.rmSync(fresh, { recursive: true, force: true }); }

    assert.equal(receipt.specId, 'S-592');
    assert.equal(receipt.taskId, 'TK-001');
    assert.equal(receipt.historicalRoute, taskHistoricalRoute);
    assert.equal(receipt.recoveryCommand, `git checkout ${receipt.recoveryCommit} -- ${path.dirname(taskHistoricalRoute)}`);
    assert.ok(!fs.existsSync(path.join(taskDiscardRoot, taskHistoricalRoute)), 'the retired Task directory is actually gone');

    const discards = fs.readFileSync(path.join(taskDiscardRoot, 'workbench/specs/DISCARDS.md'), 'utf8');
    assert.match(discards, /\| task \| S-592\/TK-001 \|/, 'the discards register names a Task discard distinctly from a Spec discard');

    assert.deepEqual(scanReferences(taskDiscardRoot), [], 'no reference is left dangling after the Task discard');

    console.log('ok - discardRetiredTask gates on an unknown Task, an unverifiable main-containment check, a live reference, and a dirty working tree, and succeeds once every gate is satisfied - archive is never reachable, since no Task can ever occupy it');
  } finally {
    fs.rmSync(taskDiscardRoot, { recursive: true, force: true });
    fs.rmSync(taskDiscardRemote, { recursive: true, force: true });
  }
}

// ============================================================================
// The `discard` CLI verb parses a bare Spec ID or a Spec ID with --task, like
// every other lifecycle command.
// ============================================================================
{
  assert.deepEqual(parseCliArgs(['discard', 'S-500']), { command: 'discard', id: 'S-500', options: {} });
  assert.deepEqual(parseCliArgs(['discard', 'S-500', '--task', 'TK-002']), { command: 'discard', id: 'S-500', options: { task: 'TK-002' } });
  console.log('ok - discard parses a bare Spec ID or a Spec ID with --task like every other lifecycle command');
}

// ============================================================================
// S-00J's deferred retired-folder case (its third acceptance line, named by
// S-00I TK-005's own remaining-gap cell): a corrective Task created against a
// retired (not discarded) Spec through `createCorrectiveTasks` writes
// straight into that Spec's still-retired `tasks/` directory - never under
// `tasks/retired/` (that folder holds a reconciled, *done* Task's own
// history, not a fresh one), and never moves the Spec back out of `retired/`.
// ============================================================================
{
  const correctiveRetiredRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-corrective-retired-'));
  try {
    initLifecycleFixture(correctiveRetiredRoot);
    fs.writeFileSync(path.join(correctiveRetiredRoot, 'AGENTS.md'), '# Agents\n\nRoutes to workbench/wiki.\n');

    const verdictRow = '| 2026-09-18 | review | Review verdict: fail at deadbee3 [aaaaaaaaaaaa] #1 | Missing edge case coverage | Reviewer | 1 |';
    const specContent = retirementReadySpec('S-591', ['TK-001']).replace(
      '| Date | Task | Event | Verification | Docs | Remaining gap |\n|---|---|---|---|---|---|\n',
      `| Date | Task | Event | Verification | Docs | Remaining gap |\n|---|---|---|---|---|---|\n${verdictRow}\n`
    );
    writeAt(correctiveRetiredRoot, 'workbench/specs/S-591-corrective-fixture/SPEC.md', specContent);
    writeAt(correctiveRetiredRoot, 'workbench/specs/S-591-corrective-fixture/tasks/TK-001/TASK.md',
      withReceiptRun(doneTaskRecordFixture({ id: 'TK-001', specId: 'S-591', slice: 'Corrective route fixture slice', destination: 'spec-acceptance: S-591 Acceptance Criteria', proof: 'landed' }), { branch: 'claude/corrective-route-fixture' }));

    execFileSync('git', ['init', '--quiet', correctiveRetiredRoot]);
    execFileSync('git', ['-C', correctiveRetiredRoot, 'config', 'user.email', 'fixture@example.com']);
    execFileSync('git', ['-C', correctiveRetiredRoot, 'config', 'user.name', 'Fixture']);
    execFileSync('git', ['-C', correctiveRetiredRoot, 'add', '-A']);
    execFileSync('git', ['-C', correctiveRetiredRoot, 'commit', '--quiet', '-m', 'initial corpus']);
    execFileSync('git', ['-C', correctiveRetiredRoot, 'branch', 'integration']);
    const correctiveInitialSha = headSha(correctiveRetiredRoot);

    const historicalRoute = 'workbench/specs/retired/S-591-corrective-fixture/SPEC.md';
    writeAt(correctiveRetiredRoot, 'workbench/wiki/design-concepts/corrective-route-fixture-capability.md', retirementGuidebookNote(historicalRoute, {
      type: 'design-concept',
      authorizedBy: 'owner',
      parent: 'none',
      body: [
        '# Corrective Route Fixture Capability', '', 'Durable prose.', '',
        '## Evidence and Sources', '', '- [S-591](../../specs/retired/S-591-corrective-fixture/SPEC.md)', '',
        '## History', '', '- 2026-09-18: created on owner direction.', ''
      ].join('\n')
    }));
    writeAt(correctiveRetiredRoot, 'workbench/wiki/MEMORY.md',
      '# Fixture Room Brain\n\nSee [the corrective route fixture capability](design-concepts/corrective-route-fixture-capability.md).\n');
    execFileSync('git', ['-C', correctiveRetiredRoot, 'add', '-A']);
    execFileSync('git', ['-C', correctiveRetiredRoot, 'commit', '--quiet', '-m', 'author the durable owner']);

    recordOwnerApproval(correctiveRetiredRoot, 'S-591', { candidate: integratedFixtureCandidate(correctiveRetiredRoot), owner: 'Kayden Clark', result: 'approve' });
    execFileSync('git', ['-C', correctiveRetiredRoot, 'add', '-A']);
    execFileSync('git', ['-C', correctiveRetiredRoot, 'commit', '--quiet', '-m', 'record owner Human QA approval']);

    retireSpec(correctiveRetiredRoot, 'S-591', { wikiNote: 'workbench/wiki/design-concepts/corrective-route-fixture-capability.md' });
    execFileSync('git', ['-C', correctiveRetiredRoot, 'add', '-A']);
    execFileSync('git', ['-C', correctiveRetiredRoot, 'commit', '--quiet', '-m', 'retire S-591']);

    assert.ok(fs.existsSync(path.join(correctiveRetiredRoot, historicalRoute)), 'S-591 is genuinely retired before this proves the corrective route against it');

    const receipt = createCorrectiveTasks(correctiveRetiredRoot, 'S-591', { candidate: 'deadbee3', findings: 'Missing edge case coverage' });
    assert.equal(receipt.created.length, 1);
    const created = receipt.created[0];
    assert.equal(created.filePath, `workbench/specs/retired/S-591-corrective-fixture/tasks/${created.id}/TASK.md`);
    assert.ok(fs.existsSync(path.join(correctiveRetiredRoot, created.filePath)));
    assert.ok(!created.filePath.includes('/tasks/retired/'), 'the new corrective Task never lands under tasks/retired/ - that folder holds a reconciled done Task, not a fresh one');
    assert.ok(fs.existsSync(path.join(correctiveRetiredRoot, historicalRoute)), 'the Spec is still retired');
    assert.ok(!fs.existsSync(path.join(correctiveRetiredRoot, 'workbench/specs/S-591-corrective-fixture')), 'the Spec was never moved back out of retired/');

    const stillRetired = findSpec(correctiveRetiredRoot, 'S-591');
    assert.equal(stillRetired.lifecycleFolder, 'retired');
    assert.ok(stillRetired.records.some((task) => task.id === created.id), 'the new corrective Task is a live record on the still-retired Spec');
    assert.ok(!(stillRetired.retiredRecords ?? []).some((task) => task.id === created.id), 'and it is not itself a retired Task record');

    // An old projection must not let discard erase a newly accepted obligation.
    execFileSync('git', ['-C', correctiveRetiredRoot, 'add', '-A']);
    execFileSync('git', ['-C', correctiveRetiredRoot, 'commit', '--quiet', '-m', 'preserve open correction on main']);
    execFileSync('git', ['-C', correctiveRetiredRoot, 'update-ref', 'refs/remotes/origin/main', 'HEAD']);
    const beforeRefusal = fs.readFileSync(path.join(correctiveRetiredRoot, historicalRoute), 'utf8');
    assert.throws(() => discardRetiredSpec(correctiveRetiredRoot, 'S-591'), /unfinished/, 'open correction blocks discard without needing a fresh Taskboard');
    assert.equal(fs.readFileSync(path.join(correctiveRetiredRoot, historicalRoute), 'utf8'), beforeRefusal);
    assert.ok(fs.existsSync(path.join(correctiveRetiredRoot, created.filePath)));
    assert.equal(execFileSync('git', ['-C', correctiveRetiredRoot, 'status', '--porcelain'], { encoding: 'utf8' }), '', 'refusal writes and stages nothing');

    const retiredBytes = fs.readFileSync(path.join(correctiveRetiredRoot, historicalRoute), 'utf8');
    assert.equal(nextWork(correctiveRetiredRoot)?.taskId, created.id, 'retired-owner corrective Task remains selectable');
    render(correctiveRetiredRoot);
    assert.match(fs.readFileSync(path.join(correctiveRetiredRoot, 'TASKBOARD.md'), 'utf8'), new RegExp(created.id), 'board exposes the corrective Task');
    assert.ok(showSpec(correctiveRetiredRoot, 'S-591').tasks.some(task => task.id === created.id));
    const correctivePath = path.join(correctiveRetiredRoot, created.filePath);
    const readyContent = fs.readFileSync(correctivePath, 'utf8');
    fs.writeFileSync(correctivePath, readyContent.replace('**Blockers:** none', '**Blockers:** S-ZZZ'));
    assert.equal(nextWork(correctiveRetiredRoot), null, 'unmet corrective dependency prevents selection');
    assert.throws(() => claimWork(correctiveRetiredRoot, 'S-591', { agent: 'fixture' }), /blocked-slice/);
    render(correctiveRetiredRoot);
    assert.ok(doctor(correctiveRetiredRoot).some(item => item.code === 'blocked-slice'));
    fs.writeFileSync(correctivePath, readyContent);
    claimWork(correctiveRetiredRoot, 'S-591', { agent: 'fixture' });
    assert.equal(nextWork(correctiveRetiredRoot)?.status, 'in-progress');
    assert.equal(fs.readFileSync(path.join(correctiveRetiredRoot, historicalRoute), 'utf8'), retiredBytes, 'claim preserves historical Spec header and evidence');
    // S-00M TK-003: close refuses a dirty or unpushed tree, so the claim is
    // committed and "pushed" the way this fixture already simulates its remote.
    execFileSync('git', ['-C', correctiveRetiredRoot, 'add', '-A']);
    execFileSync('git', ['-C', correctiveRetiredRoot, 'commit', '--quiet', '-m', 'claim corrective Task']);
    execFileSync('git', ['-C', correctiveRetiredRoot, 'update-ref', 'refs/remotes/origin/main', 'HEAD']);
    closeTask(correctiveRetiredRoot, 'S-591', { proof: 'corrective fixture passed', docs: 'Wiki checked', remainingGap: 'none' });
    assert.equal(findSpec(correctiveRetiredRoot, 'S-591').status, 'complete', 'correction never reopens completed Spec');
    assert.equal(findSpec(correctiveRetiredRoot, 'S-591').lifecycleFolder, 'retired');
    assert.equal(readTaskRecord(correctivePath, correctiveRetiredRoot).status, 'done');
    assert.match(fs.readFileSync(path.join(correctiveRetiredRoot, historicalRoute), 'utf8'), /Task closed.*corrective fixture passed/);
    assert.equal(nextWork(correctiveRetiredRoot), null);
    render(correctiveRetiredRoot);
    assert.doesNotMatch(fs.readFileSync(path.join(correctiveRetiredRoot, 'TASKBOARD.md'), 'utf8'), new RegExp(created.id));
    assert.equal(doctor(correctiveRetiredRoot).some(item => item.blocks === 'all' || item.blocks === 'selection'), false);
    const oldTaskPath = path.join(correctiveRetiredRoot, path.dirname(historicalRoute), 'tasks/TK-001/TASK.md');
    fs.writeFileSync(oldTaskPath, fs.readFileSync(oldTaskPath, 'utf8').replace('**Status:** done', '**Status:** ready'));
    assert.equal(nextWork(correctiveRetiredRoot), null, 'ordinary historical Tasks are never reselected');
    assert.throws(() => claimWork(correctiveRetiredRoot, 'S-591', { agent: 'fixture' }), /no eligible ready task/);
    assert.throws(() => closeTask(correctiveRetiredRoot, 'S-591', { proof: 'no', docs: 'no', remainingGap: 'none' }), /no open task/);

    writeAt(correctiveRetiredRoot, 'workbench/specs/S-592-successor/SPEC.md', fixtureSpec()
      .replaceAll('S-001', 'S-592')
      .replace('| TK-001 | First slice | ready | none | pending |', '| TK-001 | First slice | ready | S-591 | pending |'));
    render(correctiveRetiredRoot);
    assert.equal(nextWork(correctiveRetiredRoot)?.specId, 'S-592', 'a retired completed predecessor satisfies an active successor');
    assert.equal(doctor(correctiveRetiredRoot).some(item => item.code === 'blocked-slice' && item.specId === 'S-592'), false,
      'doctor and selection agree on retired completed dependencies');
    claimWork(correctiveRetiredRoot, 'S-592', { agent: 'fixture' });
    assert.equal(nextWork(correctiveRetiredRoot)?.status, 'in-progress');

    console.log('ok - createCorrectiveTasks against a retired (not discarded) Spec writes the new Task straight into its still-retired tasks/ directory, never under tasks/retired/, and never moves the Spec back out of retired/ - S-00J\'s deferred retired-folder case');
  } finally {
    fs.rmSync(correctiveRetiredRoot, { recursive: true, force: true });
  }
}

// ============================================================================
// S-00I TK-006: `createCorrectiveTasks` can anchor to a discarded Spec's Wiki
// claim instead of a fail-verdict/owner-QA row it can no longer read (discard
// removed the evidence log along with the Spec). This fixture represents
// that post-discard state directly - S-590 was never created at all, exactly
// what `findSpec` sees once a real discard (proven above) has actually run -
// rather than re-running the whole discard dance just to reach the same
// "Unknown spec ID" starting point.
// ============================================================================
{
  const orphanRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-corrective-orphan-'));
  try {
    initLifecycleFixture(orphanRoot);
    writeAt(orphanRoot, 'workbench/wiki/design-concepts/orphan-fixture-capability.md', retirementGuidebookNote('workbench/specs/retired/S-590-orphan-fixture/SPEC.md', {
      type: 'design-concept',
      authorizedBy: 'owner',
      parent: 'none',
      body: [
        '# Orphan Fixture Capability', '', 'Durable prose describing what S-590 delivered.', '',
        '## Evidence and Sources', '', '- historical, S-590 has been discarded.', '',
        '## History', '', '- 2026-09-18: created on owner direction.', ''
      ].join('\n')
    }));
    execFileSync('git', ['init', '--quiet', orphanRoot]);
    execFileSync('git', ['-C', orphanRoot, 'config', 'user.email', 'fixture@example.com']);
    execFileSync('git', ['-C', orphanRoot, 'config', 'user.name', 'Fixture']);
    execFileSync('git', ['-C', orphanRoot, 'add', '-A']);
    execFileSync('git', ['-C', orphanRoot, 'commit', '--quiet', '-m', 'initial corpus']);

    assert.throws(() => findSpec(orphanRoot, 'S-590'), /Unknown spec ID: S-590/, 'S-590 was never created at all - representing the state after a real discard has already removed it entirely');
    assert.throws(
      () => createCorrectiveTasks(orphanRoot, 'S-590', { candidate: 'deadbee2', findings: 'The capability note omits an edge case' }),
      /Unknown spec ID: S-590/,
      'with no wikiClaim option, an unknown Spec ID still fails exactly as it always has - every existing caller is unaffected'
    );

    const receipt = createCorrectiveTasks(orphanRoot, 'S-590', {
      candidate: 'deadbee2',
      findings: 'The capability note omits an edge case',
      wikiClaim: 'workbench/wiki/design-concepts/orphan-fixture-capability.md#Evidence and Sources'
    });
    assert.throws(() => createCorrectiveTasks(orphanRoot, 'S-590', {
      candidate: 'deadbee2', findings: 'The capability note omits an edge case',
      wikiClaim: 'workbench/wiki/design-concepts/orphan-fixture-capability.md#Evidence and Sources'
    }), /already exist/, 'retry does not duplicate a corrective finding');
    assert.equal(receipt.specId, 'S-590');
    assert.equal(receipt.created.length, 1);
    const created = receipt.created[0];
    assert.match(created.filePath, /^workbench\/specs\/corrective\/tasks\/TK-[0-9A-Za-z]+\/TASK\.md$/);
    assert.ok(fs.existsSync(path.join(orphanRoot, created.filePath)));
    const taskContent = fs.readFileSync(path.join(orphanRoot, created.filePath), 'utf8');
    assert.match(taskContent, /\*\*Destination:\*\* wiki-claim: workbench\/wiki\/design-concepts\/orphan-fixture-capability\.md#Evidence and Sources/);
    assert.match(taskContent, /\*\*Status:\*\* ready/);

    console.log('ok - createCorrectiveTasks anchors to a discarded Spec\'s Wiki claim, writing into the corrective/ folder this lane defines, and every existing caller with no wikiClaim option is unaffected');

    const next = nextWork(orphanRoot);
    assert.equal(next.orphan, true, 'an orphan corrective Task is selectable by next');
    assert.equal(next.taskId, created.id);
    assert.equal(next.specId, 'S-590');

    claimWork(orphanRoot, created.id, { agent: 'codex' });
    assert.equal(loadCorrectiveTasks(orphanRoot).find((task) => task.id === created.id).status, 'in-progress');

    const wikiPath = path.join(orphanRoot, 'workbench/wiki/design-concepts/orphan-fixture-capability.md');
    const validWiki = fs.readFileSync(wikiPath, 'utf8');
    fs.writeFileSync(wikiPath, validWiki.replace(/^provenance:\n(?:  - .*\n)*/m, '') + '\nprovenance:\n  - body text\n');
    assert.throws(() => closeTask(orphanRoot, created.id, { proof: 'fixed', docs: 'none', remainingGap: 'none' }), /no provenance/);
    assert.equal(loadCorrectiveTasks(orphanRoot).find(task => task.id === created.id).status, 'in-progress');
    fs.writeFileSync(wikiPath, validWiki);
    const closeReceipt = closeTask(orphanRoot, created.id, { proof: 'fixed the edge case', docs: 'none', remainingGap: 'none' });
    assert.equal(closeReceipt.status, 'done');
    assert.equal(closeReceipt.wikiNote, 'workbench/wiki/design-concepts/orphan-fixture-capability.md');

    const noteAfter = fs.readFileSync(path.join(orphanRoot, 'workbench/wiki/design-concepts/orphan-fixture-capability.md'), 'utf8');
    assert.match(noteAfter, new RegExp(`  - ${created.id} corrective Task closed \\d{4}-\\d{2}-\\d{2}: fixed the edge case \\(docs: none; remaining gap: none\\)`));
    assert.ok(!fs.existsSync(path.join(orphanRoot, 'workbench/specs/S-590-orphan-fixture')), 'closing never recreates SPEC.md');
    assert.ok(!fs.existsSync(path.join(orphanRoot, 'workbench/specs/retired/S-590-orphan-fixture')), 'closing never recreates a retired SPEC.md either');

    const closedTask = loadCorrectiveTasks(orphanRoot).find((task) => task.id === created.id);
    assert.equal(closedTask.status, 'done');
    assert.equal(closedTask.proof, 'fixed the edge case');
    assert.equal(nextWork(orphanRoot), null, 'next offers nothing once the only corrective Task is done');

    console.log('ok - an orphan corrective Task is selectable by next, claims and closes by its own Task ID, and closing appends its evidence to the Wiki note\'s provenance without ever touching SPEC.md');
  } finally {
    fs.rmSync(orphanRoot, { recursive: true, force: true });
  }
}

// Identity proposals cover all lifecycle locations and fetched parallel work.
{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lifecycle-identities-'));
  try {
    initLifecycleFixture(root);
    writeAt(root, 'workbench/specs/S-00A-active/SPEC.md', fixtureSpec().replaceAll('S-001', 'S-00A'));
    writeAt(root, 'workbench/specs/retired/S-00B-retired/SPEC.md', retirementReadySpec('S-00B', ['TK-001']));
    writeAt(root, 'workbench/specs/retired/S-00B-retired/tasks/.gitkeep', '');
    writeAt(root, 'workbench/specs/S-00A-active/tasks/retired/TK-00A/TASK.md', doneTaskRecordFixture({ id: 'TK-00A', specId: 'S-00A', slice: 'Retired task', destination: 'spec-acceptance: S-00A Acceptance Criteria', proof: 'verified' }));
    // Retained rows must be done once standalone task records exist.
    const activePath = path.join(root, 'workbench/specs/S-00A-active/SPEC.md');
    fs.writeFileSync(activePath, fs.readFileSync(activePath, 'utf8').replaceAll('| ready |', '| done |').replaceAll('| blocked |', '| done |'));
    writeAt(root, 'workbench/specs/corrective/tasks/TK-00B/TASK.md', doneTaskRecordFixture({ id: 'TK-00B', specId: 'S-999', slice: 'Corrective', destination: 'wiki-claim: workbench/wiki/MEMORY.md#Routing', proof: 'verified' }));
    writeAt(root, 'workbench/specs/DISCARDS.md', '# Discards\n\n| 2026-09-19 | spec | S-00C | retired/path | sha | sha | recovery |\n| 2026-09-19 | task | S-00C/TK-00C | retired/task | sha | sha | recovery |\n');
    execFileSync('git', ['init', '--quiet', root]);
    execFileSync('git', ['-C', root, 'config', 'user.email', 'fixture@example.com']);
    execFileSync('git', ['-C', root, 'config', 'user.name', 'Fixture']);
    execFileSync('git', ['-C', root, 'add', '-A']);
    execFileSync('git', ['-C', root, 'commit', '--quiet', '-m', 'local identities']);
    const base = headSha(root);
    writeAt(root, 'workbench/specs/S-00D-remote/SPEC.md', fixtureSpec().replaceAll('S-001', 'S-00D').replaceAll('TK-001', 'TK-00D'));
    execFileSync('git', ['-C', root, 'add', '-A']);
    execFileSync('git', ['-C', root, 'commit', '--quiet', '-m', 'remote-only identity']);
    execFileSync('git', ['-C', root, 'update-ref', 'refs/remotes/origin/parallel', 'HEAD']);
    execFileSync('git', ['-C', root, 'reset', '--hard', '--quiet', base]);
    assert.equal(nextIdentity(root, undefined, { prefix: 'S' }).id, 'S-00E');
    assert.equal(nextIdentity(root, 'S-00A', { prefix: 'TK' }).id, 'TK-00E');
    console.log('ok - identity proposals reserve active, retired, corrective, discarded and remote-only IDs');
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
}

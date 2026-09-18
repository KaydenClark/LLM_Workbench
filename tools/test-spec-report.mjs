#!/usr/bin/env node
// S-00J TK-001: the assembled-Spec report a separate-context reviewer calls
// against one Spec and a named candidate SHA.
//
// The report informs; it refuses nothing here (TK-002 records verdicts,
// TK-004 binds the gate). It composes this room's own existing readers -
// `loadSpecs` / `findSpec` / `slicesOf` in spec-workbench.mjs, `readTaskRecord`
// via those readers, and `readReceiptFromFile` in task-receipt.mjs - rather
// than reparsing a Spec or a Task record itself (`assembleTaskPacket` in
// task-packet.mjs is the pattern: traversal, not copy).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { assembleSpecReport, formatSpecReport, recordReviewVerdict } from '../workbench/tools/spec-report.mjs';
import { doctor } from '../workbench/tools/spec-workbench.mjs';
import { RUNTIME_TOOLS } from '../workbench/tools/workbench-layout.mjs';

function initGitRoot(dir) {
  execFileSync('git', ['init', '--quiet', dir]);
  execFileSync('git', ['-C', dir, 'config', 'user.email', 'fixture@example.com']);
  execFileSync('git', ['-C', dir, 'config', 'user.name', 'Fixture']);
  execFileSync('git', ['-C', dir, 'commit', '--quiet', '--allow-empty', '-m', 'init']);
}

function headSha(dir) {
  return execFileSync('git', ['-C', dir, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
}

function writeAt(base, relativePath, content) {
  const target = path.join(base, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function blueprintAndBoard(base) {
  writeAt(base, 'BLUEPRINT.md', ['# Fixture Blueprint', '', '<!-- spec-catalog:start -->', '<!-- spec-catalog:end -->', ''].join('\n'));
  writeAt(base, 'TASKBOARD.md', ['# Fixture Taskboard', '', '<!-- hot-specs:start -->', '<!-- hot-specs:end -->', ''].join('\n'));
}

function tableSpec({ id, taskStatus, checked, completion, evidenceRow }) {
  return [
    `# ${id} - Fixture Capability`,
    '',
    `**Spec ID:** ${id}`,
    '**Status:** active',
    '**Priority:** 0',
    '**Owner:** agent',
    '**Updated:** 2026-09-17',
    '**Catalog description:** Proves the assembled-Spec report.',
    '**Blockers:** none',
    '**Latest event:** Spec activated.',
    '**Next gate:** Complete TK-001.',
    '',
    '## Vertical Implementation Slices',
    '',
    '| Task | Slice | Status | Blockers | Proof |',
    '|---|---|---|---|---|',
    `| TK-001 | First slice | ${taskStatus} | none | ${taskStatus === 'done' ? 'landed' : 'pending'} |`,
    '',
    '## Acceptance Criteria',
    '',
    `- [${checked ? 'x' : ' '}] Expected behavior is verified.`,
    '',
    '## Append-Only Evidence And Execution Log',
    '',
    '| Date | Task | Event | Verification | Docs | Remaining gap |',
    '|---|---|---|---|---|---|',
    evidenceRow ?? '',
    '',
    '## Completion Result',
    '',
    completion,
    '',
    '## Supersession',
    '',
    '- Supersedes: none',
    '- Superseded by: none',
    ''
  ].filter((line, index, all) => !(line === '' && all[index - 1] === '')).join('\n');
}

function taskRecordFixture({ id, specId, slice, status, blockers, destination, plannedVerification, proof }) {
  const lines = [
    `# ${id} - ${slice}`,
    '',
    `**Task ID:** ${id}`,
    `**Spec ID:** ${specId}`,
    `**Slice:** ${slice}`,
    `**Status:** ${status}`,
    `**Blockers:** ${blockers}`,
    `**Destination:** ${destination}`
  ];
  if (plannedVerification) lines.push(`**Planned verification:** ${plannedVerification}`);
  if (proof) lines.push(`**Proof:** ${proof}`);
  lines.push('');
  return lines.join('\n');
}

function recordBackedSpec(id) {
  return [
    `# ${id} - Fixture Record-Backed Capability`,
    '',
    `**Spec ID:** ${id}`,
    '**Status:** active',
    '**Priority:** 0',
    '**Owner:** agent',
    '**Updated:** 2026-09-17',
    '**Catalog description:** Proves the assembled-Spec report against Task records.',
    '**Blockers:** none',
    '**Latest event:** TK-001 closed with proof.',
    '**Next gate:** Complete TK-002.',
    '',
    '## Vertical Implementation Slices',
    '',
    '| Task | Slice | Status | Blockers | Proof |',
    '|---|---|---|---|---|',
    '| TK-001 | First slice | done | none | landed |',
    '',
    '## Acceptance Criteria',
    '',
    '- [ ] Expected behavior is verified.',
    '',
    '## Append-Only Evidence And Execution Log',
    '',
    '| Date | Task | Event | Verification | Docs | Remaining gap |',
    '|---|---|---|---|---|---|',
    '| 2026-09-17 | TK-001 | Task closed | tools/test-fixture.mjs pass | none | none |',
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

// A heading-ambiguity fixture, matching the pattern
// test-spec-workbench.mjs's own Packet block uses for the same regression: a
// prose mention of the real heading mid-sentence, and a `###` subsection
// sharing its exact title, both sit above the real `##` heading. A resolver
// that finds a heading by loose substring search (`content.indexOf`) matches
// the prose mention first and returns the wrong, truncated text; only a
// line-anchored `^## Name[ \t]*$` resolver reaches the real section.
function headingShadowSpec(id) {
  return [
    `# ${id} - Heading Shadow Fixture`,
    '',
    `**Spec ID:** ${id}`,
    '**Status:** active',
    '**Priority:** 0',
    '**Owner:** agent',
    '**Updated:** 2026-09-17',
    '**Catalog description:** Proves the report\'s section() heading anchor.',
    '**Blockers:** none',
    '**Latest event:** Spec activated.',
    '**Next gate:** Complete TK-001.',
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
    '| 2026-09-17 | TK-001 | Task closed | tools/test-fixture.mjs pass | none | none |',
    '',
    '## Notes',
    '',
    'A prose mention of ## Completion Result mid-sentence must never be mistaken for the real heading below.',
    '',
    '### Completion Result',
    '',
    'This third-level subsection sits above the real heading and must never be mistaken for it.',
    '',
    '## Completion Result',
    '',
    'The real completion result lives here only.',
    '',
    '## Supersession',
    '',
    '- Supersedes: none',
    '- Superseded by: none',
    ''
  ].join('\n');
}

// ============================================================================
// Heading anchoring: a prose mention of "## Completion Result" mid-sentence
// and a "### Completion Result" subsection both sit above the real "##
// Completion Result" heading; the report must resolve the real section only.
// ============================================================================
{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-report-heading-shadow-'));
  initGitRoot(root);
  try {
    blueprintAndBoard(root);
    writeAt(root, 'specs/S-708-fixture/SPEC.md', headingShadowSpec('S-708'));
    const candidate = headSha(root);

    const report = assembleSpecReport(root, 'S-708', { candidate });

    assert.equal(
      report.completionResult,
      'The real completion result lives here only.',
      'a prose mention and a ### subsection sharing the heading text must never shadow the real ## heading'
    );
    assert.equal(report.complete, true, 'the shadow fixture is otherwise a complete Spec');

    console.log('ok - a prose mention and a ### subsection sharing the heading text never shadow the real level-two heading');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// ============================================================================
// Red-anchored case: a fixture Spec with one unfinished Task reports
// incomplete and lists that Task as a gap.
// ============================================================================
{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-report-incomplete-'));
  initGitRoot(root);
  try {
    blueprintAndBoard(root);
    writeAt(root, 'specs/S-701-fixture/SPEC.md', tableSpec({
      id: 'S-701', taskStatus: 'ready', checked: false, completion: 'Pending.'
    }));
    const candidate = headSha(root);

    const report = assembleSpecReport(root, 'S-701', { candidate });

    assert.equal(report.id, 'S-701');
    assert.equal(report.complete, false, 'a Spec with an unfinished Task is not complete');
    assert.ok(Array.isArray(report.gaps) && report.gaps.length > 0, 'the incomplete Spec carries at least one gap');
    assert.ok(report.gaps.some((gap) => gap.includes('TK-001')), 'the unfinished Task is named in the gaps');
    assert.ok(report.gaps.some((gap) => /acceptance/i.test(gap)), 'the unchecked acceptance line is named in the gaps');
    assert.ok(report.gaps.some((gap) => /completion/i.test(gap)), 'the placeholder completion result is named in the gaps');

    console.log('ok - a fixture Spec with one unfinished Task reports incomplete and lists the Task, the unchecked acceptance line and the placeholder completion result as gaps');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// ============================================================================
// A complete table-backed Spec reports complete with no gaps, and every
// declared member (header fields, tasks, acceptance, evidence, completion,
// candidate binding) is present.
// ============================================================================
{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-report-table-complete-'));
  initGitRoot(root);
  try {
    blueprintAndBoard(root);
    writeAt(root, 'specs/S-702-fixture/SPEC.md', tableSpec({
      id: 'S-702', taskStatus: 'done', checked: true, completion: 'Delivered the fixture capability.',
      evidenceRow: '| 2026-09-17 | TK-001 | Task closed | tools/test-fixture.mjs pass | none | none |'
    }));
    const candidate = headSha(root);

    const report = assembleSpecReport(root, 'S-702', { candidate });

    assert.equal(report.title, 'Fixture Capability');
    assert.equal(report.status, 'active');
    assert.equal(report.owner, 'agent');
    assert.equal(report.complete, true, 'every gate satisfied means complete');
    assert.deepEqual(report.gaps, []);
    assert.equal(report.tasks.length, 1);
    assert.equal(report.tasks[0].id, 'TK-001');
    assert.equal(report.tasks[0].status, 'done');
    assert.equal(report.tasks[0].source, 'table');
    assert.equal(report.tasks[0].receipt, undefined, 'a table row carries no Receipt');
    assert.equal(report.acceptance.length, 1);
    assert.equal(report.acceptance[0].checked, true);
    assert.equal(report.acceptance[0].text, 'Expected behavior is verified.');
    assert.ok(report.evidence.header.length > 0, 'the evidence header cells are preserved');
    assert.equal(report.evidence.rows.length, 1);
    assert.ok(report.evidence.rows[0].cells.includes('TK-001'));
    assert.equal(report.completionResult, 'Delivered the fixture capability.');
    assert.equal(report.candidate.sha, candidate, 'the candidate SHA is recorded exactly as named');
    assert.equal(report.candidate.resolvedSha, candidate, 'a full candidate SHA resolves to itself');
    assert.equal(report.candidate.existsInRepository, true);
    assert.equal(report.candidate.matchesHead, true);

    console.log('ok - a complete table-backed Spec reports complete with no gaps and every declared member present');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// ============================================================================
// A record-backed Spec is reported through the merged list of its Task
// records and its retained done table rows: `completeSpec` in
// spec-workbench.mjs unions both sources when checking for an unfinished
// slice, and this report does the same rather than dropping the retained
// row's landed proof. A retained row with no matching record is marked
// `source: 'row'` and `history: true`, and the merged list stays in
// visible-id order. Also proves a record's Receipt run count and latest row
// when it carries one, and that an unnamed candidate SHA reports as not
// found and not matching HEAD.
// ============================================================================
{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-report-record-backed-'));
  initGitRoot(root);
  try {
    blueprintAndBoard(root);
    writeAt(root, 'specs/S-703-fixture/SPEC.md', recordBackedSpec('S-703'));
    writeAt(root, 'specs/S-703-fixture/tasks/TK-002/TASK.md', taskRecordFixture({
      id: 'TK-002', specId: 'S-703', slice: 'Second slice', status: 'in-progress', blockers: 'none',
      destination: 'spec-acceptance: S-703 Acceptance Criteria', plannedVerification: 'Red: X; green: Y'
    }));

    const bogusCandidate = '0000000000000000000000000000000000000f';
    const report = assembleSpecReport(root, 'S-703', { candidate: bogusCandidate });

    assert.equal(report.tasks.length, 2, 'the merged list carries the retained done table row and the Task record');
    assert.deepEqual(report.tasks.map((task) => task.id), ['TK-001', 'TK-002'], 'the merged list stays in visible-id order');
    const historyTask = report.tasks.find((task) => task.id === 'TK-001');
    assert.equal(historyTask.source, 'row');
    assert.equal(historyTask.history, true, 'a retained table row with no matching record is marked as history');
    assert.equal(historyTask.status, 'done');
    assert.equal(historyTask.proof, 'landed', 'the retained row keeps its landed proof');
    const openTask = report.tasks.find((task) => task.id === 'TK-002');
    assert.equal(openTask.source, 'record');
    assert.equal(openTask.history, undefined, 'a live Task record is never marked as history');
    assert.equal(openTask.status, 'in-progress');
    assert.equal(openTask.plannedVerification, 'Red: X; green: Y');
    assert.deepEqual(openTask.receipt, { runCount: 0, latestRow: null }, 'a record with no Receipt section reports zero runs');
    assert.equal(report.complete, false);
    assert.ok(report.gaps.some((gap) => gap.includes('TK-002')));
    assert.ok(!report.gaps.some((gap) => gap.includes('TK-001')), 'the retained done row is not itself a gap');

    assert.equal(report.candidate.sha, bogusCandidate);
    assert.equal(report.candidate.resolvedSha, null, 'a SHA absent from the room repository resolves to nothing');
    assert.equal(report.candidate.existsInRepository, false, 'a SHA absent from the room repository is reported as not found');
    assert.equal(report.candidate.matchesHead, false);

    console.log('ok - a record-backed Spec reports the merged Task-record-and-retained-row list with Receipt data, and an unnamed candidate SHA reports as not found and not matching HEAD');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// ============================================================================
// Candidate binding resolves through `git rev-parse <sha>^{commit}` on both
// sides, so an abbreviated candidate SHA still matches a HEAD that is that
// commit, and the full resolved SHA is reported alongside the one given.
// ============================================================================
{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-report-abbrev-candidate-'));
  initGitRoot(root);
  try {
    blueprintAndBoard(root);
    writeAt(root, 'specs/S-706-fixture/SPEC.md', tableSpec({
      id: 'S-706', taskStatus: 'done', checked: true, completion: 'Delivered.',
      evidenceRow: '| 2026-09-17 | TK-001 | Task closed | tools/test-fixture.mjs pass | none | none |'
    }));
    const full = headSha(root);
    const abbreviated = full.slice(0, 7);

    const report = assembleSpecReport(root, 'S-706', { candidate: abbreviated });

    assert.equal(report.candidate.sha, abbreviated, 'the candidate is still recorded exactly as named');
    assert.equal(report.candidate.resolvedSha, full, 'the abbreviated candidate resolves to the full commit SHA');
    assert.equal(report.candidate.existsInRepository, true);
    assert.equal(report.candidate.headSha, full);
    assert.equal(report.candidate.matchesHead, true, 'an abbreviated candidate that resolves to HEAD must still match it');

    console.log('ok - an abbreviated candidate SHA resolves through git rev-parse on both sides and still matches HEAD');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// ============================================================================
// Coexistence: a completed Spec reports without error and its file is
// byte-identical after reporting; next, doctor and render on the room are
// unaffected by the report call.
// ============================================================================
{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-report-completed-'));
  initGitRoot(root);
  try {
    blueprintAndBoard(root);
    const specPath = 'specs/S-704-fixture/SPEC.md';
    writeAt(root, specPath, tableSpec({
      id: 'S-704', taskStatus: 'done', checked: true, completion: 'Delivered.',
      evidenceRow: '| 2026-09-17 | TK-001 | Task closed | tools/test-fixture.mjs pass | none | none |'
    }).replace('**Status:** active', '**Status:** complete'));
    const before = fs.readFileSync(path.join(root, specPath), 'utf8');
    const doctorBefore = doctor(root);

    const candidate = headSha(root);
    const report = assembleSpecReport(root, 'S-704', { candidate });
    assert.equal(report.status, 'complete');
    assert.equal(report.complete, true);

    const after = fs.readFileSync(path.join(root, specPath), 'utf8');
    assert.equal(after, before, 'reporting on a completed Spec never rewrites its file');
    assert.deepEqual(doctor(root), doctorBefore, 'reporting never changes what doctor finds on the room');

    console.log('ok - a completed Spec reports without error, its file stays byte-identical, and doctor on the room is unaffected');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// ============================================================================
// The CLI verb: `report S-### --candidate <sha> --json` prints the same
// shape the exported function returns; without `--json` it prints a short
// human-readable form instead of the raw object; and it always exits 0 -
// "inform, never refuse" - even for an incomplete Spec.
// ============================================================================
{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-report-cli-'));
  initGitRoot(root);
  try {
    blueprintAndBoard(root);
    writeAt(root, 'specs/S-705-fixture/SPEC.md', tableSpec({
      id: 'S-705', taskStatus: 'done', checked: true, completion: 'Delivered.',
      evidenceRow: '| 2026-09-17 | TK-001 | Task closed | tools/test-fixture.mjs pass | none | none |'
    }));
    const candidate = headSha(root);
    const cliPath = path.resolve('workbench/tools/spec-workbench.mjs');

    const jsonResult = spawnSync('node', [cliPath, 'report', 'S-705', '--candidate', candidate, '--json', '--path', root], { encoding: 'utf8' });
    assert.equal(jsonResult.status, 0, 'the report verb exits 0 even for output it must still parse as JSON');
    const parsed = JSON.parse(jsonResult.stdout);
    assert.equal(parsed.id, 'S-705');
    assert.equal(parsed.complete, true);
    assert.equal(parsed.candidate.sha, candidate);

    const plainResult = spawnSync('node', [cliPath, 'report', 'S-705', '--candidate', candidate, '--path', root], { encoding: 'utf8' });
    assert.equal(plainResult.status, 0);
    assert.throws(() => JSON.parse(plainResult.stdout), 'the plain form must not accidentally still be JSON');
    assert.match(plainResult.stdout, /^S-705 - Fixture Capability \[active\]/, 'the plain form opens with the Spec line');
    assert.match(plainResult.stdout, new RegExp(`Candidate ${candidate}.*exists=true.*matchesHead=true`), 'the plain form states the candidate line with exists and matchesHead');
    assert.match(plainResult.stdout, /TK-001\b.*done/, 'the plain form lists the Task with its status');
    assert.match(plainResult.stdout, /^Verdict: none for this candidate$/m, 'a candidate with no recorded verdict prints a plain "none" verdict line');
    assert.match(plainResult.stdout, /Gaps \(0\)/, 'the plain form states the gap count');
    const inProcessReport = assembleSpecReport(root, 'S-705', { candidate });
    assert.equal(plainResult.stdout, `${formatSpecReport(inProcessReport)}\n`, 'the CLI plain form is exactly formatSpecReport on the same report, plus the trailing newline console.log adds');

    // "Inform, never refuse": an incomplete Spec still exits 0, with
    // complete:false in the JSON body, not a non-zero exit code.
    writeAt(root, 'specs/S-707-incomplete/SPEC.md', tableSpec({
      id: 'S-707', taskStatus: 'ready', checked: false, completion: 'Pending.'
    }));
    const incompleteResult = spawnSync('node', [cliPath, 'report', 'S-707', '--candidate', candidate, '--json', '--path', root], { encoding: 'utf8' });
    assert.equal(incompleteResult.status, 0, 'the report verb never refuses (never exits non-zero) for an incomplete Spec');
    const incompleteParsed = JSON.parse(incompleteResult.stdout);
    assert.equal(incompleteParsed.complete, false);
    assert.ok(incompleteParsed.gaps.length > 0);

    const incompletePlain = spawnSync('node', [cliPath, 'report', 'S-707', '--candidate', candidate, '--path', root], { encoding: 'utf8' });
    assert.equal(incompletePlain.status, 0);
    assert.match(incompletePlain.stdout, /Gaps \(\d+\)/);

    console.log('ok - the report CLI verb prints JSON with --json, a short human-readable form without it, and always exits 0 including for an incomplete Spec');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// ============================================================================
// S-00J TK-002: recording a verdict for a SHA that is not the current
// candidate is refused, naming both the SHA the caller gave and the room's
// actual HEAD, and writes nothing to the Spec. "Current candidate" is exact:
// no prefix matching, no closest-commit guessing - a candidate that was once
// HEAD but is no longer is refused exactly the same as one that never
// existed.
// ============================================================================
{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-report-verdict-moved-'));
  initGitRoot(root);
  try {
    blueprintAndBoard(root);
    const specPath = 'specs/S-710-fixture/SPEC.md';
    writeAt(root, specPath, tableSpec({
      id: 'S-710', taskStatus: 'done', checked: true, completion: 'Delivered.',
      evidenceRow: '| 2026-09-17 | TK-001 | Task closed | tools/test-fixture.mjs pass | none | none |'
    }));
    const staleCandidate = headSha(root);
    // Advance HEAD: the candidate a reviewer would have named a moment ago is
    // no longer the current one.
    execFileSync('git', ['-C', root, 'commit', '--quiet', '--allow-empty', '-m', 'advance past the reviewed candidate']);
    const currentHead = headSha(root);
    assert.notEqual(staleCandidate, currentHead, 'the fixture must actually move HEAD for this case to mean anything');
    const before = fs.readFileSync(path.join(root, specPath), 'utf8');

    assert.throws(
      () => recordReviewVerdict(root, 'S-710', { candidate: staleCandidate, result: 'pass', findings: 'none', reviewer: 'Claude Opus 5 (separate context)' }),
      (error) => error instanceof Error && error.message.includes(staleCandidate) && error.message.includes(currentHead),
      'a verdict for a SHA that is not the current HEAD is refused, and the error names both the given SHA and the current HEAD'
    );

    const after = fs.readFileSync(path.join(root, specPath), 'utf8');
    assert.equal(after, before, 'a refused verdict writes nothing to the Spec file');

    // A short prefix of the true HEAD is refused too - "no prefix matching".
    const abbreviatedHead = currentHead.slice(0, 7);
    assert.throws(
      () => recordReviewVerdict(root, 'S-710', { candidate: abbreviatedHead, result: 'pass', findings: 'none', reviewer: 'Claude Opus 5 (separate context)' }),
      (error) => error instanceof Error && error.message.includes(abbreviatedHead) && error.message.includes(currentHead),
      'an abbreviated SHA that resolves to HEAD is still refused: the match must be exact, never a prefix'
    );
    assert.equal(fs.readFileSync(path.join(root, specPath), 'utf8'), before, 'the abbreviated-prefix refusal also writes nothing');

    console.log('ok - recording a verdict for a SHA that is not the exact current HEAD (including an abbreviated prefix of it) is refused, naming both SHAs, and writes nothing');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// ============================================================================
// A candidate that does not exist in this repository at all is refused with
// a distinguishable message from a candidate that exists but is not HEAD -
// "does not exist" is a different problem than "is not the current
// candidate", and TK-004 is expected to relax the HEAD-equality half of this
// rule later without touching the existence half, which only makes sense if
// the two halves are reported separately now.
// ============================================================================
{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-report-verdict-nonexistent-'));
  initGitRoot(root);
  try {
    blueprintAndBoard(root);
    const specPath = 'specs/S-717-fixture/SPEC.md';
    writeAt(root, specPath, tableSpec({
      id: 'S-717', taskStatus: 'done', checked: true, completion: 'Delivered.',
      evidenceRow: '| 2026-09-17 | TK-001 | Task closed | tools/test-fixture.mjs pass | none | none |'
    }));
    const before = fs.readFileSync(path.join(root, specPath), 'utf8');
    const bogusCandidate = '0000000000000000000000000000000000000f';

    let existenceError;
    try {
      recordReviewVerdict(root, 'S-717', { candidate: bogusCandidate, result: 'pass', findings: 'none', reviewer: 'Claude Opus 5 (separate context)' });
    } catch (error) {
      existenceError = error;
    }
    assert.ok(existenceError, 'a candidate absent from the repository is refused');
    assert.match(existenceError.message, /does not exist/i, 'a nonexistent candidate is refused with a distinguishable "does not exist" message');
    assert.ok(existenceError.message.includes(bogusCandidate), 'the nonexistent-candidate error names the SHA that was given');
    assert.doesNotMatch(existenceError.message, /is not the current candidate/, 'the nonexistent-candidate message is worded differently from the moved-candidate message, so the two failure modes are distinguishable');
    assert.equal(fs.readFileSync(path.join(root, specPath), 'utf8'), before, 'a refused nonexistent candidate writes nothing');

    console.log('ok - a candidate absent from the repository is refused with a message distinguishable from a moved-but-real candidate, naming the given SHA, and writes nothing');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// ============================================================================
// S-00J TK-002 corrective (independent review): `result` accepting only
// pass|fail and `reviewer` being non-empty were implemented but untested - a
// mutation accepting `result: 'maybe'` or an empty/whitespace-only reviewer
// would have survived. Each is refused by name, writes nothing, and never
// reaches VERDICT_PATTERN: recordReviewVerdict validates before it ever
// constructs or appends a row, so a refused attempt leaves the evidence log,
// and therefore the report's parsed verdicts, completely untouched.
// ============================================================================
{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-report-verdict-invalid-fields-'));
  initGitRoot(root);
  try {
    blueprintAndBoard(root);
    const specPath = 'specs/S-718-fixture/SPEC.md';
    writeAt(root, specPath, tableSpec({
      id: 'S-718', taskStatus: 'done', checked: true, completion: 'Delivered.',
      evidenceRow: '| 2026-09-17 | TK-001 | Task closed | tools/test-fixture.mjs pass | none | none |'
    }));
    const candidate = headSha(root);
    const before = fs.readFileSync(path.join(root, specPath), 'utf8');

    assert.throws(
      () => recordReviewVerdict(root, 'S-718', { candidate, result: 'maybe', findings: 'none', reviewer: 'Claude Opus 5 (separate context)' }),
      (error) => error instanceof Error && /--result of pass or fail/.test(error.message) && error.message.includes('maybe'),
      'an out-of-vocabulary result is refused by name'
    );
    assert.equal(fs.readFileSync(path.join(root, specPath), 'utf8'), before, 'a refused out-of-vocabulary result writes nothing');

    assert.throws(
      () => recordReviewVerdict(root, 'S-718', { candidate, result: 'pass', findings: 'none', reviewer: '' }),
      (error) => error instanceof Error && /--reviewer/.test(error.message),
      'an empty reviewer is refused by name'
    );
    assert.equal(fs.readFileSync(path.join(root, specPath), 'utf8'), before, 'a refused empty reviewer writes nothing');

    assert.throws(
      () => recordReviewVerdict(root, 'S-718', { candidate, result: 'pass', findings: 'none', reviewer: '   ' }),
      (error) => error instanceof Error && /--reviewer/.test(error.message),
      'a whitespace-only reviewer is refused the same as an empty one'
    );
    assert.equal(fs.readFileSync(path.join(root, specPath), 'utf8'), before, 'a refused whitespace-only reviewer writes nothing');

    // Every attempt above was refused before a row was ever built, so the
    // evidence log carries no verdict row at all - the invalid values never
    // reached VERDICT_PATTERN because recordReviewVerdict never got that far.
    const report = assembleSpecReport(root, 'S-718', { candidate });
    assert.deepEqual(report.verdicts, [], 'no verdict row exists after every refusal above; the refused values never reached VERDICT_PATTERN');
    assert.equal(report.latestVerdict, null);

    console.log('ok - an out-of-vocabulary result and an empty or whitespace-only reviewer are each refused by name, write nothing, and never reach VERDICT_PATTERN');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// ============================================================================
// A pass verdict against the exact current candidate lands as one six-cell
// evidence row carrying the result, findings, reviewer context and the SHA;
// a fail verdict on a later candidate lands as its own row without disturbing
// the first - append-only, never a rewrite. The report then shows the
// verdicts in order and the latest one for the candidate it was asked about.
// ============================================================================
{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-report-verdict-append-'));
  initGitRoot(root);
  try {
    blueprintAndBoard(root);
    const specPath = 'specs/S-711-fixture/SPEC.md';
    writeAt(root, specPath, tableSpec({
      id: 'S-711', taskStatus: 'done', checked: true, completion: 'Delivered.',
      evidenceRow: '| 2026-09-17 | TK-001 | Task closed | tools/test-fixture.mjs pass | none | none |'
    }));
    const firstCandidate = headSha(root);

    const passResult = recordReviewVerdict(root, 'S-711', {
      candidate: firstCandidate, result: 'pass', findings: 'none', reviewer: 'Claude Opus 5 (separate context)'
    });
    assert.equal(passResult.result, 'pass');
    assert.equal(passResult.candidate, firstCandidate);
    assert.equal(passResult.remainingGap, 'none', 'a pass with "none" findings reports "none" as its remaining gap, not a count');
    assert.match(passResult.row, /^\| \d{4}-\d{2}-\d{2} \| review \| Review verdict: pass at [0-9a-f]+ \| none \| Claude Opus 5 \(separate context\) \| none \|$/);

    const afterFirst = fs.readFileSync(path.join(root, specPath), 'utf8');
    assert.ok(afterFirst.includes(passResult.row), 'the exact pass row lands in the Spec file');

    // A second, later review of a fresh candidate: a fail verdict with two
    // findings, appended without touching the first row - append-only means
    // adding a row, never editing or removing the one already there. There is
    // no update/rewrite entry point offered at all: only recordReviewVerdict,
    // which only ever appends.
    execFileSync('git', ['-C', root, 'commit', '--quiet', '--allow-empty', '-m', 'a fresh candidate for the second review']);
    const secondCandidate = headSha(root);
    assert.notEqual(secondCandidate, firstCandidate);

    const failResult = recordReviewVerdict(root, 'S-711', {
      candidate: secondCandidate, result: 'fail', findings: 'Missing input validation; stale doc reference', reviewer: 'Claude Sonnet 5 (separate context)'
    });
    assert.equal(failResult.result, 'fail');
    assert.equal(failResult.remainingGap, '2', 'the remaining gap is the findings count when findings are not "none"');

    const afterSecond = fs.readFileSync(path.join(root, specPath), 'utf8');
    assert.ok(afterSecond.includes(passResult.row), 'the first verdict row is preserved verbatim after a second verdict is recorded (append-only, never rewritten)');
    assert.ok(afterSecond.includes(failResult.row), 'the second verdict lands as its own row');
    assert.equal(afterSecond.indexOf(passResult.row) < afterSecond.indexOf(failResult.row), true, 'the pass row still precedes the later fail row');

    // Recording again against the now-stale first candidate is refused,
    // exactly like the moved-candidate case above: a review cannot be reused
    // once the candidate it was bound to is no longer HEAD.
    assert.throws(
      () => recordReviewVerdict(root, 'S-711', { candidate: firstCandidate, result: 'pass', findings: 'none', reviewer: 'Claude Opus 5 (separate context)' }),
      (error) => error instanceof Error && error.message.includes(firstCandidate) && error.message.includes(secondCandidate)
    );

    // The report shows both verdicts, newest last, and the latest verdict
    // for the candidate it is asked about - the second (fail) one, since the
    // report is asked about the current candidate.
    const report = assembleSpecReport(root, 'S-711', { candidate: secondCandidate });
    assert.equal(report.verdicts.length, 2, 'the report lists every verdict row parsed from the evidence log');
    assert.equal(report.verdicts[0].result, 'pass');
    assert.equal(report.verdicts[0].candidate, firstCandidate);
    assert.equal(report.verdicts[1].result, 'fail');
    assert.equal(report.verdicts[1].candidate, secondCandidate);
    assert.equal(report.verdicts[1].findings, 'Missing input validation; stale doc reference');
    assert.equal(report.verdicts[1].reviewer, 'Claude Sonnet 5 (separate context)');
    assert.ok(report.latestVerdict, 'the report names a latest verdict for the candidate it was asked about');
    assert.equal(report.latestVerdict.result, 'fail');
    assert.equal(report.latestVerdict.candidate, secondCandidate);

    // Asked about a candidate no verdict names, the report says none - never
    // the wrong candidate's verdict borrowed by omission.
    const reportForFirst = assembleSpecReport(root, 'S-711', { candidate: firstCandidate });
    assert.equal(reportForFirst.latestVerdict.result, 'pass', 'a report asked about the first candidate finds that candidate\'s own verdict, not the later one');
    const neverReviewedRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-report-verdict-none-'));
    try {
      initGitRoot(neverReviewedRoot);
      blueprintAndBoard(neverReviewedRoot);
      writeAt(neverReviewedRoot, 'specs/S-712-fixture/SPEC.md', tableSpec({
        id: 'S-712', taskStatus: 'done', checked: true, completion: 'Delivered.',
        evidenceRow: '| 2026-09-17 | TK-001 | Task closed | tools/test-fixture.mjs pass | none | none |'
      }));
      const unreviewedCandidate = headSha(neverReviewedRoot);
      const unreviewedReport = assembleSpecReport(neverReviewedRoot, 'S-712', { candidate: unreviewedCandidate });
      assert.deepEqual(unreviewedReport.verdicts, [], 'a Spec with no recorded verdict reports an empty verdicts list');
      assert.equal(unreviewedReport.latestVerdict, null, 'a Spec with no recorded verdict for its candidate reports latestVerdict as null');
    } finally {
      fs.rmSync(neverReviewedRoot, { recursive: true, force: true });
    }

    console.log('ok - a pass and a fail verdict each land as their own append-only evidence row, a stale candidate cannot be reused, and the report lists every verdict plus the latest one for the candidate it was asked about (or null)');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// ============================================================================
// Coexistence: a completed, table-backed Spec accepts a verdict row the same
// way an active one does, and its slice table stays byte-identical - a
// verdict only ever touches the evidence log.
// ============================================================================
{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-report-verdict-completed-'));
  initGitRoot(root);
  try {
    blueprintAndBoard(root);
    const specPath = 'specs/S-713-fixture/SPEC.md';
    writeAt(root, specPath, tableSpec({
      id: 'S-713', taskStatus: 'done', checked: true, completion: 'Delivered.',
      evidenceRow: '| 2026-09-17 | TK-001 | Task closed | tools/test-fixture.mjs pass | none | none |'
    }).replace('**Status:** active', '**Status:** complete'));
    const before = fs.readFileSync(path.join(root, specPath), 'utf8');
    const sliceTableBefore = before.slice(before.indexOf('## Vertical Implementation Slices'), before.indexOf('## Acceptance Criteria'));
    const doctorBefore = doctor(root);
    const candidate = headSha(root);

    recordReviewVerdict(root, 'S-713', { candidate, result: 'pass', findings: 'none', reviewer: 'Claude Opus 5 (separate context)' });

    const after = fs.readFileSync(path.join(root, specPath), 'utf8');
    const sliceTableAfter = after.slice(after.indexOf('## Vertical Implementation Slices'), after.indexOf('## Acceptance Criteria'));
    assert.equal(sliceTableAfter, sliceTableBefore, 'a completed Spec\'s slice table is byte-identical after a verdict');
    assert.deepEqual(doctor(root), doctorBefore, 'recording a verdict never changes what doctor finds on the room');

    const report = assembleSpecReport(root, 'S-713', { candidate });
    assert.equal(report.status, 'complete');
    assert.equal(report.latestVerdict.result, 'pass');

    console.log('ok - a completed, table-backed Spec accepts a verdict row the same way an active one does, with its slice table byte-identical afterward');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// ============================================================================
// The CLI verb: `verdict S-### --candidate <sha> --result pass|fail
// --findings "..." --reviewer "..." [--json]` records the same row the
// exported function would, and refuses (non-zero exit, no file write) for a
// moved candidate.
// ============================================================================
{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-report-verdict-cli-'));
  initGitRoot(root);
  try {
    blueprintAndBoard(root);
    const specPath = 'specs/S-714-fixture/SPEC.md';
    writeAt(root, specPath, tableSpec({
      id: 'S-714', taskStatus: 'done', checked: true, completion: 'Delivered.',
      evidenceRow: '| 2026-09-17 | TK-001 | Task closed | tools/test-fixture.mjs pass | none | none |'
    }));
    const candidate = headSha(root);
    const cliPath = path.resolve('workbench/tools/spec-workbench.mjs');

    const verdictResult = spawnSync('node', [
      cliPath, 'verdict', 'S-714',
      '--candidate', candidate, '--result', 'pass', '--findings', 'none',
      '--reviewer', 'Claude Opus 5 (separate context)', '--json', '--path', root
    ], { encoding: 'utf8' });
    assert.equal(verdictResult.status, 0, `the verdict verb exits 0 on a valid current-candidate verdict: ${verdictResult.stderr}`);
    const parsed = JSON.parse(verdictResult.stdout);
    assert.equal(parsed.result, 'pass');
    assert.equal(parsed.candidate, candidate);
    assert.ok(fs.readFileSync(path.join(root, specPath), 'utf8').includes(parsed.row), 'the CLI verdict lands the same row text the JSON result names');

    execFileSync('git', ['-C', root, 'commit', '--quiet', '--allow-empty', '-m', 'move past the reviewed candidate']);
    const movedHead = headSha(root);
    const refused = spawnSync('node', [
      cliPath, 'verdict', 'S-714',
      '--candidate', candidate, '--result', 'pass', '--findings', 'none',
      '--reviewer', 'Claude Opus 5 (separate context)', '--path', root
    ], { encoding: 'utf8' });
    assert.notEqual(refused.status, 0, 'the verdict verb refuses (non-zero exit) for a candidate that is no longer HEAD');
    assert.match(refused.stderr, new RegExp(candidate));
    assert.match(refused.stderr, new RegExp(movedHead));

    console.log('ok - the verdict CLI verb records the same row the exported function returns, and refuses with a non-zero exit for a moved candidate, naming both SHAs');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// ============================================================================
// TK-001 review corrective, closed here: the plain-text form's `[history]`
// marker was previously unasserted (only that the CLI prints whatever
// formatSpecReport returns, not the formatter's own content). A record-backed
// Spec's retained done row must print its `[history]` marker in the CLI's
// plain output, and a recorded verdict must print its own line.
// ============================================================================
{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-report-cli-history-verdict-'));
  initGitRoot(root);
  try {
    blueprintAndBoard(root);
    writeAt(root, 'specs/S-719-fixture/SPEC.md', recordBackedSpec('S-719'));
    writeAt(root, 'specs/S-719-fixture/tasks/TK-002/TASK.md', taskRecordFixture({
      id: 'TK-002', specId: 'S-719', slice: 'Second slice', status: 'in-progress', blockers: 'none',
      destination: 'spec-acceptance: S-719 Acceptance Criteria', plannedVerification: 'Red: X; green: Y'
    }));
    const candidate = headSha(root);
    const cliPath = path.resolve('workbench/tools/spec-workbench.mjs');

    const verdict = recordReviewVerdict(root, 'S-719', {
      candidate, result: 'pass', findings: 'none', reviewer: 'Claude Opus 5 (separate context)'
    });

    const plainResult = spawnSync('node', [cliPath, 'report', 'S-719', '--candidate', candidate, '--path', root], { encoding: 'utf8' });
    assert.equal(plainResult.status, 0);
    assert.match(plainResult.stdout, /TK-001 done \(source: row\) \[history\]/, 'the retained done table row prints its [history] marker in the plain CLI form');
    assert.doesNotMatch(plainResult.stdout, /TK-002[^\n]*\[history\]/, 'the live, non-retained Task record is never marked [history]');
    assert.equal(
      plainResult.stdout.includes(`Verdict: pass at ${candidate} by Claude Opus 5 (separate context) (${verdict.date})`),
      true,
      'a recorded verdict prints its own "Verdict: <result> at <sha> by <reviewer> (<date>)" line'
    );

    const inProcessReport = assembleSpecReport(root, 'S-719', { candidate });
    assert.equal(plainResult.stdout, `${formatSpecReport(inProcessReport)}\n`, 'the CLI plain form is exactly formatSpecReport on the same report, including the [history] marker and the verdict line');

    console.log('ok - the plain CLI form prints the [history] marker for a retained done table row and a recorded verdict\'s own line');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// ============================================================================
// The managed runtime tool set grows to include the report seam.
// ============================================================================
{
  assert.ok(RUNTIME_TOOLS.includes('spec-report.mjs'), 'spec-report.mjs is one of the Workbench-managed runtime tools');
  console.log('ok - spec-report.mjs is registered in RUNTIME_TOOLS');
}

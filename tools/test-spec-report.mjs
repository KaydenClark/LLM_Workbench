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
import { assembleSpecReport, formatSpecReport } from '../workbench/tools/spec-report.mjs';
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
// The managed runtime tool set grows to include the report seam.
// ============================================================================
{
  assert.ok(RUNTIME_TOOLS.includes('spec-report.mjs'), 'spec-report.mjs is one of the Workbench-managed runtime tools');
  console.log('ok - spec-report.mjs is registered in RUNTIME_TOOLS');
}

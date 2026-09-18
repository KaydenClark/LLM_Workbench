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
import { execFileSync } from 'node:child_process';
import { assembleSpecReport } from '../workbench/tools/spec-report.mjs';
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
    assert.equal(report.candidate.existsInRepository, true);
    assert.equal(report.candidate.matchesHead, true);

    console.log('ok - a complete table-backed Spec reports complete with no gaps and every declared member present');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// ============================================================================
// A record-backed Spec is reported through its Task records (its retained
// done table row is completed history, not a live slice - `slicesOf` itself
// resolves one source of truth per Spec, which this module composes rather
// than re-merging), including a record's Receipt run count and latest row
// when it carries one; an unnamed candidate SHA reports as not found and not
// matching HEAD.
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

    assert.equal(report.tasks.length, 1, 'a record-backed Spec reports its Task records; the retained done row is completed history');
    const openTask = report.tasks.find((task) => task.id === 'TK-002');
    assert.equal(openTask.source, 'record');
    assert.equal(openTask.status, 'in-progress');
    assert.equal(openTask.plannedVerification, 'Red: X; green: Y');
    assert.deepEqual(openTask.receipt, { runCount: 0, latestRow: null }, 'a record with no Receipt section reports zero runs');
    assert.equal(report.complete, false);
    assert.ok(report.gaps.some((gap) => gap.includes('TK-002')));

    assert.equal(report.candidate.sha, bogusCandidate);
    assert.equal(report.candidate.existsInRepository, false, 'a SHA absent from the room repository is reported as not found');
    assert.equal(report.candidate.matchesHead, false);

    console.log('ok - a record-backed Spec reports its Task records with Receipt data, and an unnamed candidate SHA reports as not found and not matching HEAD');
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
// The CLI verb: `report S-### --candidate <sha> [--json]` prints the same
// shape the exported function returns.
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
    const stdout = execFileSync('node', [cliPath, 'report', 'S-705', '--candidate', candidate, '--json', '--path', root], { encoding: 'utf8' });
    const parsed = JSON.parse(stdout);
    assert.equal(parsed.id, 'S-705');
    assert.equal(parsed.complete, true);
    assert.equal(parsed.candidate.sha, candidate);

    console.log('ok - the report CLI verb prints the assembled Spec state as JSON');
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

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
import { assembleSpecReport, createCorrectiveTasks, formatSpecReport, recordOwnerApproval, recordReviewVerdict } from '../workbench/tools/spec-report.mjs';
import { completeSpec, doctor, gate, nextWork, render, retireSpec } from '../workbench/tools/spec-workbench.mjs';
import { readTaskRecord } from '../workbench/tools/task-record.mjs';
import { appendReceiptRowToContent } from '../workbench/tools/task-receipt.mjs';
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

function currentBranch(dir) {
  return execFileSync('git', ['-C', dir, 'branch', '--show-current'], { encoding: 'utf8' }).trim();
}

// S-00U regression seams exercise actual committed candidate content.
function commitFixture(root) {
  execFileSync('git', ['-C', root, 'add', '.']);
  execFileSync('git', ['-C', root, 'commit', '--quiet', '--allow-empty', '-m', 'fixture candidate']);
  return headSha(root);
}

// S-00J TK-005: `recordOwnerApproval` checks the candidate against the
// declared `git.integrationBranch` (`declaredGit` in workbench-paths.mjs)
// only once one is actually declared - a room with none skips the ancestor
// check rather than refusing (see the "containment unchecked" remaining-gap
// test below). This writes the minimal manifest that satisfies exactly that
// read - deliberately without `schemaVersion: 2` - so none of
// `doctor`'s schema-2-gated checks (`gitFindings`, `collectionFindings`,
// `skillFindings`/`inspectSkills`) start reading this fixture as a real
// managed room; only `declaredGit`'s own `manifest.git` read (which never
// checks schemaVersion) sees it. `branch` defaults to whatever `git init`
// actually named the fixture's current branch, never a hardcoded "main" or
// "master".
function writeIntegrationManifest(root, branch = currentBranch(root)) {
  writeAt(root, 'workbench/manifest.json', JSON.stringify({ git: { defaultBranch: branch, integrationBranch: branch } }, null, 2));
}

// A managed room: a valid schema-2 manifest is the only place a room can
// declare git.defaultBranch, so these fixtures initialize the real layout
// (Specs live in workbench/specs) and then set the manifest's git block.
function initManagedRoot(dir) {
  initGitRoot(dir);
  const workbenchVersion = JSON.parse(fs.readFileSync(path.resolve('workbench/manifest.json'), 'utf8')).workbenchVersion;
  const init = spawnSync('node', [path.resolve('workbench/tools/workbench-layout.mjs'), 'init', '--project', dir, '--provenance', 'genesis', '--version', workbenchVersion], { encoding: 'utf8' });
  assert.equal(init.status, 0, init.stdout + init.stderr);
}

// Replace (or, with `null`, remove) the managed manifest's git block.
function declareGit(dir, git) {
  const manifestFile = path.join(dir, 'workbench/manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
  if (git === null) delete manifest.git;
  else manifest.git = git;
  fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
}

// Simulate the owner's promotion of integration to the default branch by
// pinning the local remote-tracking ref at `commit`.
function pinRemoteTracking(root, branch, commit) {
  execFileSync('git', ['-C', root, 'update-ref', `refs/remotes/origin/${branch}`, commit]);
}

// A commit on top of `parent` whose tree differs only by `edits`
// ({ path: content | null }), built with plumbing so the working tree and
// its uncommitted evidence rows are never touched.
function commitTreeEdit(root, parent, edits, message) {
  const indexFile = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'fixture-index-')), 'index');
  const env = { ...process.env, GIT_INDEX_FILE: indexFile };
  try {
    execFileSync('git', ['-C', root, 'read-tree', parent], { env });
    for (const [relativePath, content] of Object.entries(edits)) {
      if (content === null) {
        execFileSync('git', ['-C', root, 'update-index', '--force-remove', relativePath], { env });
      } else {
        const blob = execFileSync('git', ['-C', root, 'hash-object', '-w', '--stdin'], { input: content, encoding: 'utf8' }).trim();
        execFileSync('git', ['-C', root, 'update-index', '--add', '--cacheinfo', `100644,${blob},${relativePath}`], { env });
      }
    }
    const tree = execFileSync('git', ['-C', root, 'write-tree'], { env, encoding: 'utf8' }).trim();
    return execFileSync('git', ['-C', root, 'commit-tree', tree, '-p', parent, '-m', message], { encoding: 'utf8' }).trim();
  } finally {
    fs.rmSync(path.dirname(indexFile), { recursive: true, force: true });
  }
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
// S-00U: reject approval that names an older integration tree while reading
// newer local capability content, including retired Task proof.
{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'approval-content-binding-'));
  initManagedRoot(root);
  try {
    blueprintAndBoard(root);
    const branch = currentBranch(root);
    declareGit(root, { defaultBranch: branch, integrationBranch: branch });
    const specPath = 'workbench/specs/S-790-fixture/SPEC.md';
    writeAt(root, specPath, tableSpec({id: 'S-790', taskStatus: 'done', checked: true,
      completion: 'Delivered.', evidenceRow: '| 2026-09-19 | TK-001 | done | tested | docs | none |'}));
    const candidate = commitFixture(root);
    const original = fs.readFileSync(path.join(root, specPath), 'utf8');
    const changed = original.replace('Expected behavior is verified.', 'Different capability is verified.');
    writeAt(root, specPath, changed);
    assert.throws(() => recordOwnerApproval(root, 'S-790', {candidate, owner: 'Fixture owner', result: 'approve'}),
      /candidate content|committed content/i, 'uncommitted capability cannot be approved at an older SHA');
    assert.equal(fs.readFileSync(path.join(root, specPath), 'utf8'), changed, 'refusal writes nothing');
    commitFixture(root);
    assert.throws(() => recordOwnerApproval(root, 'S-790', {candidate, owner: 'Fixture owner', result: 'approve'}),
      /candidate content|committed content/i, 'a clean newer tree cannot acquire approval naming older content');
    writeAt(root, specPath, original);
    const current = commitFixture(root);
    recordReviewVerdict(root, 'S-790', {candidate: current, result: 'pass', findings: 'none', reviewer: 'separate fixture context'});
    assert.equal(gate(root, {spec: 'S-790', candidate: current}).refused, false, 'review permits integration before owner QA');
    assert.throws(() => completeSpec(root, 'S-790'), /owner Human QA/, 'closure still requires owner QA');
    recordOwnerApproval(root, 'S-790', {candidate: current, owner: 'Fixture owner', result: 'approve'});
    const validApproval = fs.readFileSync(path.join(root, specPath), 'utf8');
    const emptyCommit = execFileSync('git', ['-C', root, 'rev-list', '--max-parents=0', 'HEAD'], {encoding:'utf8'}).trim();
    writeAt(root, specPath, validApproval.replace(`Owner QA: approve at ${current}`, `Owner QA: approve at ${emptyCommit}`));
    assert.equal(assembleSpecReport(root, 'S-790').latestOwnerApproval, null, 'an inherited mismatched approval is not trusted');
    writeAt(root, specPath, validApproval);
    const approved = assembleSpecReport(root, 'S-790').specDigest;
    // S-00J TK-01S: final closure also needs the approved content verified
    // on the declared default branch; pin its remote-tracking ref there.
    pinRemoteTracking(root, branch, current);
    completeSpec(root, 'S-790');
    const completed = assembleSpecReport(root, 'S-790');
    assert.equal(completed.specDigest, approved, 'administrative completion preserves digest');
    assert.equal(completed.latestOwnerApproval.result, 'approve');
    const wikiPath = 'workbench/wiki/guidebooks/s790-capability.md';
    writeAt(root, wikiPath, [
      '---', 'type: guidebook', 'status: active', 'sensitivity: normal',
      'knowledge_role: curated', 'provenance:', '  - fixture review', 'source_paths:',
      '  - workbench/specs/retired/S-790-fixture/SPEC.md', 'last_verified: 2026-09-19', '---',
      '', '# Fixture capability', '', 'Describes the verified capability and its limits.', ''
    ].join('\n'));
    writeAt(root, 'workbench/wiki/MEMORY.md', '# Wiki\n\n[Capability](guidebooks/s790-capability.md)\n');
    commitFixture(root);
    const retirement = retireSpec(root, 'S-790', {wikiNote: wikiPath});
    assert.equal(retirement.ownerApproval.approvedBy, 'Fixture owner', 'original approval permits retirement after completion');
    const taskPath = 'workbench/specs/retired/S-790-fixture/tasks/retired/TK-0U9/TASK.md';
    writeAt(root, taskPath, taskRecordFixture({id:'TK-0U9', specId:'S-790', slice:'Retired proof', status:'done', blockers:'none', destination:'spec-acceptance: S-790', proof:'old proof'}));
    const retiredDigest = assembleSpecReport(root, 'S-790').specDigest;
    const retiredCandidate = commitFixture(root);
    writeAt(root, taskPath, fs.readFileSync(path.join(root, taskPath), 'utf8').replace('old proof', 'new proof'));
    assert.notEqual(assembleSpecReport(root, 'S-790').specDigest, retiredDigest, 'retired Task substantive proof is hashed');
    assert.throws(() => recordOwnerApproval(root, 'S-790', {candidate: retiredCandidate, owner:'Fixture owner', result:'approve'}), /candidate content|committed content/i);
    console.log('ok - S-00U committed approval binding, premerge order, completion digest and retired proof');
  } finally { fs.rmSync(root, {recursive:true, force:true}); }
}

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
// S-00J TK-004 redefines "current candidate": a verdict now binds to the
// Spec's assembled CONTENT (a digest), never to this checkout's exact HEAD.
// TK-002's original exact-HEAD equality refused a candidate the instant HEAD
// moved past it, even when nothing about the Spec itself had changed - which
// is exactly what a dispatcher's own checkout (HEAD on `integration`) or a
// merge commit (a new SHA, same tree) would trip on live. Advancing HEAD
// with an empty commit, as here, changes no file at all, so recording
// against the now-stale SHA succeeds: the content the verdict binds to is
// unchanged. A real content change is what TK-004's own digest-staleness
// refusal below (spec-workbench.mjs's `completeSpec`/`gate` tests) is for,
// not a moved HEAD.
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
    // Advance HEAD with an empty commit: no file changes, so the Spec's
    // content digest is unaffected even though HEAD itself has moved.
    execFileSync('git', ['-C', root, 'commit', '--quiet', '--allow-empty', '-m', 'advance past the reviewed candidate']);
    const currentHead = headSha(root);
    assert.notEqual(staleCandidate, currentHead, 'the fixture must actually move HEAD for this case to mean anything');

    const verdict = recordReviewVerdict(root, 'S-710', {
      candidate: staleCandidate, result: 'pass', findings: 'none', reviewer: 'Claude Opus 5 (separate context)'
    });
    assert.equal(verdict.candidate, staleCandidate, 'the candidate SHA is recorded exactly as given - an audit trail, no longer a binding');
    assert.ok(fs.readFileSync(path.join(root, specPath), 'utf8').includes(verdict.row), 'a candidate that is no longer HEAD is accepted: content binds, location does not');

    // The report, read from this same checkout (now on `currentHead`, a
    // different SHA from the one recorded), still recognizes the verdict -
    // it matches by digest, never by candidate SHA equality.
    const report = assembleSpecReport(root, 'S-710', { candidate: currentHead });
    assert.equal(report.latestVerdict?.result, 'pass', 'a verdict recorded against a candidate that is no longer HEAD is still recognized once the digest matches - the whole point of the redefinition');

    // An abbreviated SHA is refused for a different reason now: it is not a
    // full SHA-1/SHA-256 the room's own `git cat-file -e <sha>^{commit}`
    // check treats as ambiguous-safe here, so this only proves existence is
    // still checked; content-binding no longer cares whether it was ever
    // HEAD at all.
    const bogusButShapedCandidate = '1234567890abcdef1234567890abcdef12345678';
    assert.throws(
      () => recordReviewVerdict(root, 'S-710', { candidate: bogusButShapedCandidate, result: 'pass', findings: 'none', reviewer: 'Claude Opus 5 (separate context)' }),
      (error) => error instanceof Error && /does not exist/i.test(error.message) && error.message.includes(bogusButShapedCandidate),
      'a well-formed but nonexistent candidate is still refused - existence is unconditional, only the HEAD-equality half of the old rule was dropped'
    );

    console.log('ok - TK-004 redefinition: a verdict for a candidate SHA that is no longer HEAD is accepted and later recognized by content digest, as long as the Spec\'s files are unchanged; a nonexistent candidate is still refused');
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
    assert.match(passResult.row, /^\| \d{4}-\d{2}-\d{2} \| review \| Review verdict: pass at [0-9a-f]+ \[[0-9a-f]{12}\] #1 \| none \| Claude Opus 5 \(separate context\) \| none \|$/);
    assert.equal(passResult.ordinal, 1, 'the first verdict recorded for a Spec is row #1');

    const afterFirst = fs.readFileSync(path.join(root, specPath), 'utf8');
    assert.ok(afterFirst.includes(passResult.row), 'the exact pass row lands in the Spec file');

    // The report right after the pass verdict recognizes it: the Spec's
    // content is unchanged since it was recorded.
    const reportAfterPass = assembleSpecReport(root, 'S-711', { candidate: firstCandidate });
    assert.equal(reportAfterPass.latestVerdict?.result, 'pass');
    assert.equal(reportAfterPass.specDigest.slice(0, 12), passResult.digest12);

    // A second, later review with real findings: a fail verdict, appended
    // without touching the first row - append-only means adding a row,
    // never editing or removing the one already there. There is no
    // update/rewrite entry point offered at all: only recordReviewVerdict,
    // which only ever appends.
    execFileSync('git', ['-C', root, 'commit', '--quiet', '--allow-empty', '-m', 'a fresh candidate for the second review']);
    const secondCandidate = headSha(root);
    assert.notEqual(secondCandidate, firstCandidate);

    const failResult = recordReviewVerdict(root, 'S-711', {
      candidate: secondCandidate, result: 'fail', findings: 'Missing input validation; stale doc reference', reviewer: 'Claude Sonnet 5 (separate context)'
    });
    assert.equal(failResult.result, 'fail');
    assert.equal(failResult.remainingGap, '2', 'the remaining gap is the findings count when findings are not "none"');
    assert.equal(failResult.digest, passResult.digest, 'the fail verdict was recorded against exactly the same content as the pass verdict - the empty commit between them changed no file');
    assert.equal(failResult.ordinal, 2, 'the second verdict recorded for a Spec is row #2, regardless of digest, candidate or result');

    const afterSecond = fs.readFileSync(path.join(root, specPath), 'utf8');
    assert.ok(afterSecond.includes(passResult.row), 'the first verdict row is preserved verbatim after a second verdict is recorded (append-only, never rewritten)');
    assert.ok(afterSecond.includes(failResult.row), 'the second verdict lands as its own row');
    assert.equal(afterSecond.indexOf(passResult.row) < afterSecond.indexOf(failResult.row), true, 'the pass row still precedes the later fail row');

    // The fail verdict folded in corrective-Task creation (S-00J TK-003),
    // which wrote a new tasks/<id>/TASK.md file - the Spec's own content
    // digest has now moved past BOTH recorded verdicts, so neither is
    // recognized as current, no matter which candidate SHA a report names:
    // latest verdict is resolved purely by content digest.
    const report = assembleSpecReport(root, 'S-711', { candidate: secondCandidate });
    assert.equal(report.verdicts.length, 2, 'the report still lists every verdict row parsed from the evidence log');
    assert.equal(report.verdicts[0].result, 'pass');
    assert.equal(report.verdicts[0].candidate, firstCandidate);
    assert.equal(report.verdicts[1].result, 'fail');
    assert.equal(report.verdicts[1].candidate, secondCandidate);
    assert.equal(report.verdicts[1].findings, 'Missing input validation; stale doc reference');
    assert.equal(report.verdicts[1].reviewer, 'Claude Sonnet 5 (separate context)');
    assert.notEqual(report.specDigest.slice(0, 12), passResult.digest12, "the corrective Task the fail verdict created moved the Spec's own content digest past both recorded verdicts");
    assert.equal(report.latestVerdict, null, "neither the pass nor the fail verdict matches the Spec's current content once the corrective Task exists");

    // Asked about a different candidate SHA, the result is identical: the
    // `candidate` argument plays no part in matching a verdict any more,
    // only the Spec's own current content digest does.
    const reportForFirst = assembleSpecReport(root, 'S-711', { candidate: firstCandidate });
    assert.equal(reportForFirst.latestVerdict, null, 'a report asked about a different candidate SHA sees the identical latestVerdict result - content binds, not the candidate a caller names');

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
      assert.equal(unreviewedReport.latestVerdict, null, 'a Spec with no recorded verdict at all reports latestVerdict as null');
    } finally {
      fs.rmSync(neverReviewedRoot, { recursive: true, force: true });
    }

    console.log("ok - a pass and a fail verdict each land as their own append-only evidence row bound to the content digest at record time; once the fail verdict's own corrective Task changes that digest, neither recorded verdict matches the Spec's current content regardless of which candidate SHA a report names");
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
// --findings "..." --reviewer "..." [--digest <sha256>] [--json]` records the
// same row the exported function would. S-00J TK-004: a moved candidate SHA
// (HEAD advancing with no file change) no longer refuses it - the digest is
// what a reader matches, and it is unchanged; naming a stale --digest
// explicitly does refuse it (non-zero exit, no file write), because that is
// a reviewer working from a report whose content has since moved on.
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

    const reportResult = spawnSync('node', [cliPath, 'report', 'S-714', '--candidate', candidate, '--json', '--path', root], { encoding: 'utf8' });
    assert.equal(reportResult.status, 0);
    const { specDigest } = JSON.parse(reportResult.stdout);

    const verdictResult = spawnSync('node', [
      cliPath, 'verdict', 'S-714',
      '--candidate', candidate, '--result', 'pass', '--findings', 'none', '--digest', specDigest,
      '--reviewer', 'Claude Opus 5 (separate context)', '--json', '--path', root
    ], { encoding: 'utf8' });
    assert.equal(verdictResult.status, 0, `the verdict verb exits 0 when the named --digest matches the report the reviewer read: ${verdictResult.stderr}`);
    const parsed = JSON.parse(verdictResult.stdout);
    assert.equal(parsed.result, 'pass');
    assert.equal(parsed.candidate, candidate);
    assert.equal(parsed.digest, specDigest);
    assert.ok(fs.readFileSync(path.join(root, specPath), 'utf8').includes(parsed.row), 'the CLI verdict lands the same row text the JSON result names');

    // HEAD moves with no file change: a further verdict recorded against
    // the NEW HEAD as candidate (a distinct SHA from the first review, so
    // this is not an exact repeat of the first row), without naming a
    // --digest, still succeeds - the content is unchanged, and omitting
    // --digest recomputes it fresh rather than comparing against anything.
    execFileSync('git', ['-C', root, 'commit', '--quiet', '--allow-empty', '-m', 'move past the reviewed candidate']);
    const movedHead = headSha(root);
    assert.notEqual(movedHead, candidate, 'the fixture must actually move HEAD for this case to mean anything');
    const stillRecorded = spawnSync('node', [
      cliPath, 'verdict', 'S-714',
      '--candidate', movedHead, '--result', 'pass', '--findings', 'none',
      '--reviewer', 'Claude Opus 5 (separate context)', '--path', root
    ], { encoding: 'utf8' });
    assert.equal(stillRecorded.status, 0, `a candidate that is no longer HEAD is accepted once its content is unchanged: ${stillRecorded.stderr}`);

    // Naming the ORIGINAL --digest explicitly against content that has since
    // actually changed (the two verdicts just recorded added evidence rows,
    // which the digest excludes, so change the Spec's own real content this
    // time) is refused.
    const staleSpecPath = path.join(root, specPath);
    fs.writeFileSync(staleSpecPath, fs.readFileSync(staleSpecPath, 'utf8').replace('First slice', 'First slice (renamed)'));
    const refused = spawnSync('node', [
      cliPath, 'verdict', 'S-714',
      '--candidate', movedHead, '--result', 'pass', '--findings', 'none', '--digest', specDigest,
      '--reviewer', 'Claude Opus 5 (separate context)', '--path', root
    ], { encoding: 'utf8' });
    assert.notEqual(refused.status, 0, 'the verdict verb refuses (non-zero exit) when the named --digest no longer matches the working tree\'s current content');
    assert.match(refused.stderr, /does not match this working tree's current content digest/);

    console.log('ok - the verdict CLI verb records the same row the exported function returns; a moved-but-unchanged candidate is accepted, and an explicitly stale --digest is refused, naming why');
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
// S-00J TK-003: a fail verdict that names no corrective finding is refused
// before anything is written - a failed verdict that would leave the Spec
// with no corrective Task is refused, matching WF-8C's "failure is
// diagnostic and generative" design: a fail with nothing to fix is not a
// real failure return path. "none" (the literal accepted on a pass) and a
// findings string that trims to no actual item (all-semicolon) are each
// refused the same way, distinctly from the pre-existing empty/whitespace
// --findings refusal above, which never reaches this check at all.
// ============================================================================
{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-report-fail-no-finding-'));
  initGitRoot(root);
  try {
    blueprintAndBoard(root);
    const specPath = 'specs/S-720-fixture/SPEC.md';
    writeAt(root, specPath, tableSpec({
      id: 'S-720', taskStatus: 'done', checked: true, completion: 'Delivered.',
      evidenceRow: '| 2026-09-17 | TK-001 | Task closed | tools/test-fixture.mjs pass | none | none |'
    }));
    const candidate = headSha(root);
    const before = fs.readFileSync(path.join(root, specPath), 'utf8');

    assert.throws(
      () => recordReviewVerdict(root, 'S-720', { candidate, result: 'fail', findings: 'none', reviewer: 'Claude Opus 5 (separate context)' }),
      (error) => error instanceof Error && /corrective Task/i.test(error.message) && error.message.includes(candidate),
      'a fail verdict with "none" findings is refused: it would leave the Spec with no corrective Task, and the refusal names the candidate'
    );
    assert.equal(fs.readFileSync(path.join(root, specPath), 'utf8'), before, 'the refused fail verdict writes nothing to the Spec file');
    assert.equal(fs.existsSync(path.join(root, 'specs/S-720-fixture/tasks')), false, 'no tasks/ directory is created by a refused verdict');

    assert.throws(
      () => recordReviewVerdict(root, 'S-720', { candidate, result: 'fail', findings: ' ; ; ', reviewer: 'Claude Opus 5 (separate context)' }),
      (error) => error instanceof Error && /corrective Task/i.test(error.message),
      'a findings string with no actual item once split on ";" (only separators) is refused the same way'
    );
    assert.equal(fs.readFileSync(path.join(root, specPath), 'utf8'), before, 'the semicolons-only refusal also writes nothing');
    assert.equal(fs.existsSync(path.join(root, 'specs/S-720-fixture/tasks')), false, 'no tasks/ directory is created by that refusal either');

    console.log('ok - a fail verdict that names no corrective finding ("none", or a findings string with no actual item) is refused before any write, naming the candidate');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// ============================================================================
// S-00J TK-003: the seam. createCorrectiveTasks(rootDir, specId, { candidate,
// findings }) turns an already-recorded fail verdict into one Task record
// per diagnosed defect, through the exact same formatTaskRecord /
// parseTaskRecord seam S-00H delivered - never a second template -
// allocated with the room's own visible-id allocator (`nextIdentity`, TK-
// prefixed and letter-bearing), blocking nothing already done, landing with
// `Status: ready`, `Blockers: none` and `Destination: spec-acceptance: <spec>
// Acceptance Criteria`. Each Task's `Planned verification` names both the
// finding and the exact verdict row it answers - the row's own position in
// the Spec's append-only evidence log, which stays unambiguous even when a
// later verdict shares the same candidate, date and result (candidate SHA
// plus date plus result alone is not unique; the row's ordinal is).
// ============================================================================
{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-report-corrective-seam-'));
  initGitRoot(root);
  try {
    blueprintAndBoard(root);
    const candidate = headSha(root);
    const specPath = 'specs/S-721-fixture/SPEC.md';
    writeAt(root, specPath, tableSpec({
      id: 'S-721', taskStatus: 'done', checked: true, completion: 'Delivered.',
      evidenceRow: [
        '| 2026-09-17 | TK-001 | Task closed | tools/test-fixture.mjs pass | none | none |',
        `| 2026-09-18 | review | Review verdict: fail at ${candidate} [aaaaaaaaaaaa] #1 | Missing input validation; Stale doc reference | Claude Sonnet 5 (separate context) | 2 |`
      ].join('\n')
    }));
    const specBefore = fs.readFileSync(path.join(root, specPath), 'utf8');

    const result = createCorrectiveTasks(root, 'S-721', { candidate, findings: 'Missing input validation; Stale doc reference' });

    assert.equal(result.specId, 'S-721');
    assert.equal(result.candidate, candidate);
    assert.equal(result.verdictRow.ordinal, 2, 'the anchor is the verdict row\'s own position in the append-only evidence log (second row here)');
    assert.equal(result.verdictRow.date, '2026-09-18');
    assert.equal(result.created.length, 2, 'one corrective Task per finding');
    const [firstTask, secondTask] = result.created;
    assert.notEqual(firstTask.id, secondTask.id, 'each corrective Task gets its own allocated id');
    assert.notEqual(firstTask.id, 'TK-001', 'a corrective Task id never collides with the retained done row');
    assert.notEqual(secondTask.id, 'TK-001');
    assert.match(firstTask.id, /^TK-[0-9A-Za-z]+$/);
    assert.ok(/[A-Za-z]/.test(firstTask.id.slice(3)), 'the allocated id is letter-bearing, matching the room\'s allocator rule');

    const firstContent = fs.readFileSync(path.join(root, firstTask.filePath), 'utf8');
    assert.match(firstContent, new RegExp(`^# ${firstTask.id} - Missing input validation$`, 'm'));
    assert.match(firstContent, /\*\*Spec ID:\*\* S-721$/m);
    assert.match(firstContent, /\*\*Slice:\*\* Missing input validation$/m);
    assert.match(firstContent, /\*\*Status:\*\* ready$/m);
    assert.match(firstContent, /\*\*Blockers:\*\* none$/m);
    assert.match(firstContent, /\*\*Destination:\*\* spec-acceptance: S-721 Acceptance Criteria$/m);
    assert.match(
      firstContent,
      new RegExp(`\\*\\*Planned verification:\\*\\* Answers evidence row 2 \\(fail verdict at ${candidate} on 2026-09-18\\): Missing input validation$`, 'm'),
      'the Planned verification names the finding and the exact verdict row it answers, unambiguously (row ordinal, candidate and date)'
    );

    const secondContent = fs.readFileSync(path.join(root, secondTask.filePath), 'utf8');
    assert.match(secondContent, /\*\*Slice:\*\* Stale doc reference$/m);
    assert.match(
      secondContent,
      new RegExp(`\\*\\*Planned verification:\\*\\* Answers evidence row 2 \\(fail verdict at ${candidate} on 2026-09-18\\): Stale doc reference$`, 'm')
    );

    const specAfter = fs.readFileSync(path.join(root, specPath), 'utf8');
    assert.match(specAfter, /\*\*Status:\*\* active$/m, 'the Spec header Status is unchanged; the Spec stays open');
    const sliceTableBefore = specBefore.slice(specBefore.indexOf('## Vertical Implementation Slices'), specBefore.indexOf('## Acceptance Criteria'));
    const sliceTableAfter = specAfter.slice(specAfter.indexOf('## Vertical Implementation Slices'), specAfter.indexOf('## Acceptance Criteria'));
    assert.equal(sliceTableAfter, sliceTableBefore, 'the retained done TK-001 row is untouched - a done Task is never reopened, and no existing record changes');
    const evidenceBefore = specBefore.slice(specBefore.indexOf('## Append-Only Evidence'), specBefore.indexOf('## Completion Result'));
    const evidenceAfter = specAfter.slice(specAfter.indexOf('## Append-Only Evidence'), specAfter.indexOf('## Completion Result'));
    assert.equal(evidenceAfter, evidenceBefore, 'creating corrective Tasks never rewrites the evidence log it read the verdict row from');

    render(root);
    const board = fs.readFileSync(path.join(root, 'TASKBOARD.md'), 'utf8');
    assert.ok(board.includes(firstTask.id) && board.includes('Missing input validation'), 'render shows a corrective Task on the hot board');

    const next = nextWork(root);
    assert.equal(next.specId, 'S-721');
    assert.equal(next.taskId, firstTask.id, 'next selects a corrective Task like any other ready record');

    const doctorFindings = doctor(root);
    assert.equal(doctorFindings.filter((item) => item.blocks === 'all' || item.blocks === 'selection').length, 0, 'doctor reports no blocking finding after corrective Tasks are created');

    console.log('ok - createCorrectiveTasks writes one Task record per finding through the Task-record seam, naming the exact verdict row each answers, without reopening the retained done row or touching the Spec header Status, and the corrective Task is selectable by next and visible on the rendered board');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// ============================================================================
// S-00J TK-003: folded into the verdict verb. `recordReviewVerdict` with
// `result: 'fail'` creates the corrective Tasks in the same operation - the
// handoff's chosen design over a separate `correct` verb, so a caller can
// never record a failed verdict and forget the corrective-Task step it
// requires. The created Tasks are returned alongside the verdict row.
// ============================================================================
{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-report-verdict-corrective-fold-'));
  initGitRoot(root);
  try {
    blueprintAndBoard(root);
    const specPath = 'specs/S-722-fixture/SPEC.md';
    writeAt(root, specPath, tableSpec({
      id: 'S-722', taskStatus: 'done', checked: true, completion: 'Delivered.',
      evidenceRow: '| 2026-09-17 | TK-001 | Task closed | tools/test-fixture.mjs pass | none | none |'
    }));
    const candidate = headSha(root);

    const verdict = recordReviewVerdict(root, 'S-722', {
      candidate, result: 'fail', findings: 'Missing input validation; Stale doc reference',
      reviewer: 'Claude Sonnet 5 (separate context)'
    });

    assert.equal(verdict.result, 'fail');
    assert.ok(Array.isArray(verdict.correctiveTasks), 'a fail verdict returns the corrective Tasks it created in the same operation');
    assert.equal(verdict.correctiveTasks.length, 2, 'one corrective Task per finding');
    const [firstTask, secondTask] = verdict.correctiveTasks;
    assert.notEqual(firstTask.id, secondTask.id);
    assert.notEqual(firstTask.id, 'TK-001', 'a corrective Task id never collides with the retained done row');

    const specAfter = fs.readFileSync(path.join(root, specPath), 'utf8');
    assert.match(specAfter, /\*\*Status:\*\* active$/m, "the Spec header Status is unchanged by a fail verdict's corrective Tasks");
    assert.ok(specAfter.includes(verdict.row), 'the verdict row itself is present, appended in the same operation that created the corrective Tasks');

    const firstContent = fs.readFileSync(path.join(root, firstTask.filePath), 'utf8');
    assert.match(firstContent, /\*\*Status:\*\* ready$/m);
    assert.match(firstContent, /\*\*Blockers:\*\* none$/m);
    assert.match(firstContent, /\*\*Destination:\*\* spec-acceptance: S-722 Acceptance Criteria$/m);
    assert.match(
      firstContent,
      new RegExp(`\\*\\*Planned verification:\\*\\* Answers evidence row 2 \\(fail verdict at ${candidate} on ${verdict.date}\\): Missing input validation$`, 'm')
    );

    const sliceTableAfter = specAfter.slice(specAfter.indexOf('## Vertical Implementation Slices'), specAfter.indexOf('## Acceptance Criteria'));
    assert.match(sliceTableAfter, /\| TK-001 \| First slice \| done \| none \| landed \|/, 'the retained done TK-001 row is untouched (never reopened) by the corrective Tasks');

    const next = nextWork(root);
    assert.equal(next.specId, 'S-722');
    assert.equal(next.taskId, firstTask.id, 'next selects a corrective Task like any other ready record');

    render(root);
    const board = fs.readFileSync(path.join(root, 'TASKBOARD.md'), 'utf8');
    assert.ok(board.includes(firstTask.id) && board.includes('Missing input validation'), 'render shows a corrective Task on the hot board');

    const doctorFindings = doctor(root);
    assert.equal(doctorFindings.filter((item) => item.blocks === 'all' || item.blocks === 'selection').length, 0, 'doctor reports no blocking finding once render has caught up');

    console.log('ok - a fail verdict creates one corrective Task per finding in the same operation, naming the verdict row it answers, without touching the Spec header Status or the retained done row, and the corrective Task is selectable by next and visible on the rendered board');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// ============================================================================
// S-00J TK-003 review corrective (Medium): a finding containing an embedded
// newline (or an internal run of extra whitespace) must round-trip through
// readTaskRecord with its full text, normalized to a single line - never
// truncated at the newline with orphan text left in the record body, since
// `task-record.mjs`'s field regex is line-anchored and `.` never matches a
// newline.
// ============================================================================
{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-report-finding-newline-'));
  initGitRoot(root);
  try {
    blueprintAndBoard(root);
    const specPath = 'specs/S-723-fixture/SPEC.md';
    writeAt(root, specPath, tableSpec({
      id: 'S-723', taskStatus: 'done', checked: true, completion: 'Delivered.',
      evidenceRow: '| 2026-09-17 | TK-001 | Task closed | tools/test-fixture.mjs pass | none | none |'
    }));
    const candidate = headSha(root);

    const verdict = recordReviewVerdict(root, 'S-723', {
      candidate, result: 'fail',
      findings: 'Missing validation on\nthe login form; Stale doc   reference',
      reviewer: 'Claude Sonnet 5 (separate context)'
    });

    assert.equal(verdict.correctiveTasks.length, 2);
    const [firstTask, secondTask] = verdict.correctiveTasks;
    const record = readTaskRecord(path.join(root, firstTask.filePath), root);
    assert.equal(record.slice, 'Missing validation on the login form', 'the two-line finding round-trips through readTaskRecord with its full text, normalized to one line');
    assert.equal(
      record.plannedVerification,
      `Answers evidence row 2 (fail verdict at ${candidate} on ${verdict.date}): Missing validation on the login form`
    );

    const raw = fs.readFileSync(path.join(root, firstTask.filePath), 'utf8');
    const lines = raw.split('\n');
    assert.equal(lines[0], `# ${firstTask.id} - Missing validation on the login form`, 'the title line carries the full normalized finding text, never truncated at an embedded newline');
    assert.equal(lines[1], '', 'no orphan text follows the title line');
    const sliceLineIndex = lines.findIndex((line) => line.startsWith('**Slice:**'));
    assert.equal(lines[sliceLineIndex], '**Slice:** Missing validation on the login form', 'the Slice field carries the full normalized text on one line');
    assert.equal(lines[sliceLineIndex + 1].startsWith('**Status:**'), true, 'no orphan text follows the Slice field - it is a single complete line');

    const secondRecord = readTaskRecord(path.join(root, secondTask.filePath), root);
    assert.equal(secondRecord.slice, 'Stale doc reference', 'an internal multi-space run within a finding is also collapsed to a single space');

    console.log('ok - a finding containing an embedded newline (and an internal multi-space run) round-trips through readTaskRecord with its full text, normalized to a single line, with no orphan text left in the record body');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// ============================================================================
// S-00J TK-003 review corrective (Medium): createCorrectiveTasks derives the
// Tasks it creates from the anchored fail verdict row's own findings cell,
// never from the caller's argument alone - a caller cannot attach invented
// findings to a recorded row. A findings argument that does not match the
// anchored row (after the same normalization both sides get) is refused by
// name, and nothing is written.
// ============================================================================
{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-report-corrective-mismatch-'));
  initGitRoot(root);
  try {
    blueprintAndBoard(root);
    const candidate = headSha(root);
    const specPath = 'specs/S-724-fixture/SPEC.md';
    writeAt(root, specPath, tableSpec({
      id: 'S-724', taskStatus: 'done', checked: true, completion: 'Delivered.',
      evidenceRow: [
        '| 2026-09-17 | TK-001 | Task closed | tools/test-fixture.mjs pass | none | none |',
        `| 2026-09-18 | review | Review verdict: fail at ${candidate} [aaaaaaaaaaaa] #1 | Missing input validation; Stale doc reference | Claude Sonnet 5 (separate context) | 2 |`
      ].join('\n')
    }));
    const before = fs.readFileSync(path.join(root, specPath), 'utf8');

    assert.throws(
      () => createCorrectiveTasks(root, 'S-724', { candidate, findings: 'Some invented finding never reviewed' }),
      (error) => error instanceof Error
        && /do not match evidence row 2/.test(error.message)
        && error.message.includes(candidate)
        && error.message.includes('Some invented finding never reviewed'),
      "createCorrectiveTasks refuses by name when the given findings do not match the anchored fail verdict row's own recorded findings"
    );
    assert.equal(fs.readFileSync(path.join(root, specPath), 'utf8'), before, 'a refused mismatch writes nothing to the Spec file');
    assert.equal(fs.existsSync(path.join(root, 'specs/S-724-fixture/tasks')), false, 'no tasks/ directory is created by a refused mismatch');

    console.log("ok - createCorrectiveTasks refuses by name when the caller's findings do not match the anchored fail verdict row's own recorded findings, and writes nothing");
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// ============================================================================
// S-00J TK-003 review corrective (Medium): a second createCorrectiveTasks
// call for the same candidate and the same evidence row would otherwise
// create a duplicate set of Tasks answering the same defects twice. It is
// refused, naming the candidate and the row's own ordinal, and writes
// nothing - detected by reading the existing Task records' own Planned
// verification rather than a second ledger.
// ============================================================================
{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-report-corrective-duplicate-'));
  initGitRoot(root);
  try {
    blueprintAndBoard(root);
    const specPath = 'specs/S-725-fixture/SPEC.md';
    writeAt(root, specPath, tableSpec({
      id: 'S-725', taskStatus: 'done', checked: true, completion: 'Delivered.',
      evidenceRow: '| 2026-09-17 | TK-001 | Task closed | tools/test-fixture.mjs pass | none | none |'
    }));
    const candidate = headSha(root);

    recordReviewVerdict(root, 'S-725', {
      candidate, result: 'fail', findings: 'Missing input validation; Stale doc reference',
      reviewer: 'Claude Sonnet 5 (separate context)'
    });
    const specAfterFirst = fs.readFileSync(path.join(root, specPath), 'utf8');
    const tasksDirEntriesBefore = fs.readdirSync(path.join(root, 'specs/S-725-fixture/tasks')).sort();

    assert.throws(
      () => createCorrectiveTasks(root, 'S-725', { candidate, findings: 'Missing input validation; Stale doc reference' }),
      (error) => error instanceof Error
        && error.message.includes(candidate)
        && /row 2/.test(error.message)
        && /already exist/i.test(error.message),
      'a second createCorrectiveTasks call for the same candidate and row is refused, naming the candidate and the row ordinal'
    );

    assert.equal(fs.readFileSync(path.join(root, specPath), 'utf8'), specAfterFirst, 'the refused duplicate call writes nothing to the Spec file');
    const tasksDirEntriesAfter = fs.readdirSync(path.join(root, 'specs/S-725-fixture/tasks')).sort();
    assert.deepEqual(tasksDirEntriesAfter, tasksDirEntriesBefore, 'the refused duplicate call creates no additional Task directory');

    console.log('ok - a second createCorrectiveTasks call for the same candidate and row is refused, naming the candidate and the row ordinal, and writes nothing');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// ============================================================================
// S-00J TK-003 review corrective (Low): a `pass` verdict, even one carrying
// real (non-"none") findings text, creates no Task and no `tasks/`
// directory at all - only a `fail` verdict ever triggers corrective-Task
// creation.
// ============================================================================
{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-report-pass-no-tasks-'));
  initGitRoot(root);
  try {
    blueprintAndBoard(root);
    const specPath = 'specs/S-726-fixture/SPEC.md';
    writeAt(root, specPath, tableSpec({
      id: 'S-726', taskStatus: 'done', checked: true, completion: 'Delivered.',
      evidenceRow: '| 2026-09-17 | TK-001 | Task closed | tools/test-fixture.mjs pass | none | none |'
    }));
    const candidate = headSha(root);

    const verdict = recordReviewVerdict(root, 'S-726', {
      candidate, result: 'pass', findings: 'Cosmetic note only, not a real defect',
      reviewer: 'Claude Sonnet 5 (separate context)'
    });

    assert.equal(verdict.result, 'pass');
    assert.equal(verdict.correctiveTasks, undefined, 'a pass verdict never creates or returns corrective Tasks, even with non-"none" findings text');
    assert.equal(fs.existsSync(path.join(root, 'specs/S-726-fixture/tasks')), false, 'a pass verdict creates no tasks/ directory at all');

    console.log('ok - a pass verdict, even with real findings text, creates no Task and no tasks/ directory');
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

// ============================================================================
// S-00J TK-004 (red at the pre anchor e32a41434d0be4b70fe5fb066f37a55156e8273
// 7): "current candidate" is redefined to bind a verdict to the assembled
// Spec's CONTENT, never to a checkout's HEAD. Exact-HEAD binding fails
// exactly the live review workflow the handoff names: a reviewer records a
// verdict in a detached worktree checked out at the candidate, and the
// dispatcher's own checkout later needs to recognize that same review from a
// DIFFERENT commit whose tree is identical - a merge commit that never
// equals the reviewed tip. This proves the gap with two real `git worktree`
// checkouts of one fixture repository and a real (non-fast-forward) merge,
// so the new merge commit's SHA genuinely differs from the reviewed
// candidate's SHA while its file content stays byte-identical.
// ============================================================================
{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-report-cross-checkout-'));
  const reviewWorktree = path.join(os.tmpdir(), `spec-report-cross-checkout-worktree-${process.pid}-${Date.now()}`);
  try {
    initGitRoot(root);
    blueprintAndBoard(root);
    const specPath = 'specs/S-730-fixture/SPEC.md';
    writeAt(root, specPath, tableSpec({
      id: 'S-730', taskStatus: 'done', checked: true, completion: 'Delivered.',
      evidenceRow: '| 2026-09-17 | TK-001 | Task closed | tools/test-fixture.mjs pass | none | none |'
    }));
    execFileSync('git', ['-C', root, 'add', '-A']);
    execFileSync('git', ['-C', root, 'commit', '--quiet', '-m', 'add the fixture Spec']);
    const candidateSha = headSha(root);

    // The reviewer's separate context: a detached worktree checked out
    // exactly at the candidate, sharing this repository's object store but
    // holding its own on-disk files.
    execFileSync('git', ['-C', root, 'worktree', 'add', '--detach', reviewWorktree, candidateSha]);
    recordReviewVerdict(reviewWorktree, 'S-730', {
      candidate: candidateSha, result: 'pass', findings: 'none', reviewer: 'Claude Opus 5 (separate context)'
    });
    execFileSync('git', ['-C', reviewWorktree, 'add', '-A']);
    execFileSync('git', ['-C', reviewWorktree, 'commit', '--quiet', '-m', 'record review verdict']);
    execFileSync('git', ['-C', reviewWorktree, 'branch', 'reviewed-branch']);
    const reviewedBranchSha = execFileSync('git', ['-C', reviewWorktree, 'rev-parse', 'reviewed-branch'], { encoding: 'utf8' }).trim();

    // The dispatcher's own checkout (`root`) merges the reviewed branch with
    // a real merge commit, exactly like a GitHub merge: a brand-new commit
    // SHA whose tree is identical to the reviewed branch's tree, never equal
    // to `reviewedBranchSha` itself.
    execFileSync('git', ['-C', root, 'merge', '--no-ff', '--quiet', '-m', 'merge reviewed branch', 'reviewed-branch']);
    const mergeSha = headSha(root);
    assert.notEqual(mergeSha, reviewedBranchSha, 'the merge produces a new commit SHA, distinct from the reviewed branch tip - exactly what "a merge commit that never equals the reviewed tip" describes');
    assert.equal(
      fs.readFileSync(path.join(root, specPath), 'utf8'),
      fs.readFileSync(path.join(reviewWorktree, specPath), 'utf8'),
      'the merge carries the reviewed content into root byte-identical - only the commit identity differs'
    );

    const report = assembleSpecReport(root, 'S-730', { candidate: mergeSha });
    assert.ok(
      report.latestVerdict && report.latestVerdict.result === 'pass',
      'a verdict recorded in a detached worktree at the reviewed candidate is recognized from another checkout (here, after a real merge to a different commit SHA) of the same Spec content - the redefinition binds to content, never to which checkout recorded or reads it'
    );

    console.log('ok - a review verdict recorded in a detached worktree at the candidate is recognized from a different checkout after a real merge to a new commit SHA, as long as the Spec content is unchanged');
  } finally {
    try { execFileSync('git', ['-C', root, 'worktree', 'remove', '--force', reviewWorktree]); } catch { /* best-effort */ }
    fs.rmSync(root, { recursive: true, force: true });
    fs.rmSync(reviewWorktree, { recursive: true, force: true });
  }
}

// ============================================================================
// S-00J TK-004 (red at the pre anchor e32a41434d0be4b70fe5fb066f37a55156e8273
// 7 - `gate` does not exist yet): the gate the harness's merge-preparation
// workflow requires. The discriminator is what the invoker presents, never
// which checkout runs the command: a Spec ID with a candidate SHA is a Spec
// candidate, refused (`refused: true`, naming why) when the assembled Spec
// is incomplete or unreviewed for its current content - "the closeout path
// proceeds for an incomplete Spec candidate" is exactly the gap this closes.
// A Task ID with its Spec still open is a Task PR - what every PR in this
// rollout is while S-00O exemption 2 (WF-7 deferred) holds - and is reported
// (`refused: false`), never refused, regardless of the Spec's own
// completeness: "a Task PR is refused where it should be reported" is the
// gap this half closes.
// ============================================================================
{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-report-gate-'));
  initGitRoot(root);
  try {
    blueprintAndBoard(root);
    // Deliberately incomplete: an unfinished Task, unchecked acceptance, no
    // completion result - and no recorded verdict either.
    writeAt(root, 'specs/S-740-fixture/SPEC.md', tableSpec({
      id: 'S-740', taskStatus: 'ready', checked: false, completion: 'Pending.'
    }));
    const candidate = headSha(root);

    const specGate = gate(root, { spec: 'S-740', candidate });
    assert.equal(specGate.mode, 'spec-candidate');
    assert.equal(specGate.refused, true, 'a Spec candidate for an incomplete, unreviewed Spec is refused');
    assert.match(specGate.reason, /is not complete/i);
    assert.equal(specGate.specComplete, false);

    const taskGate = gate(root, { task: 'TK-001', spec: 'S-740' });
    assert.equal(taskGate.mode, 'task-pr');
    assert.equal(taskGate.refused, false, 'a Task PR for a Task ID with its Spec still open is reported, never refused, under S-00O exemption 2');
    assert.equal(taskGate.reason, null);
    assert.equal(taskGate.specComplete, false, 'the Task-PR report still names the Spec as incomplete - it informs without refusing');

    // Complete the Spec and record a passing verdict for its current
    // content: the Spec-candidate gate now proceeds (refused: false).
    writeAt(root, 'specs/S-740-fixture/SPEC.md', tableSpec({
      id: 'S-740', taskStatus: 'done', checked: true, completion: 'Delivered.',
      evidenceRow: '| 2026-09-18 | TK-001 | Task closed | tools/test-fixture.mjs pass | none | none |'
    }));
    recordReviewVerdict(root, 'S-740', {
      candidate: headSha(root), result: 'pass', findings: 'none', reviewer: 'Claude Opus 5 (separate context)'
    });

    // S-00J TK-005 as repaired by S-00U F2: a passed review verdict is what
    // the premerge Spec-candidate gate requires - it proceeds before any
    // owner Human QA approval, because integration is the owner's Human QA
    // surface. Only `complete` still refuses without a recorded approval.
    const noApprovalGate = gate(root, { spec: 'S-740', candidate: headSha(root) });
    assert.equal(noApprovalGate.refused, false, 'reviewed Spec may reach integration before Human QA');
    assert.equal(noApprovalGate.reason, null);
    assert.throws(() => completeSpec(root, 'S-740'), /no owner Human QA approval/i);

    recordOwnerApproval(root, 'S-740', { candidate: commitFixture(root), owner: 'Kayden Clark', result: 'approve' });
    const passedGate = gate(root, { spec: 'S-740', candidate: headSha(root) });
    assert.equal(passedGate.refused, false, 'a complete Spec candidate with a passed current verdict AND a recorded owner approval proceeds unchanged');
    assert.equal(passedGate.reason, null);
    assert.equal(passedGate.specComplete, true);
    assert.equal(passedGate.latestOwnerApproval.result, 'approve', 'gate shows latestOwnerApproval beside the verdict');

    console.log('ok - gate refuses an incomplete or unreviewed Spec candidate, reports (never refuses) a Task PR under S-00O exemption 2, permits a reviewed Spec before Human QA, and retains owner approval for closure');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// ============================================================================
// The `gate` CLI verb: exit codes and the integration branch resolved from
// the manifest declaration, never hardcoded.
// ============================================================================
{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-report-gate-cli-'));
  initGitRoot(root);
  try {
    blueprintAndBoard(root);
    writeAt(root, 'specs/S-741-fixture/SPEC.md', tableSpec({
      id: 'S-741', taskStatus: 'ready', checked: false, completion: 'Pending.'
    }));
    const candidate = headSha(root);
    const cliPath = path.resolve('workbench/tools/spec-workbench.mjs');

    const refused = spawnSync('node', [cliPath, 'gate', '--spec', 'S-741', '--candidate', candidate, '--json', '--path', root], { encoding: 'utf8' });
    assert.equal(refused.status, 1, 'the gate verb exits 1 for a refused Spec candidate');
    const refusedParsed = JSON.parse(refused.stdout);
    assert.equal(refusedParsed.refused, true);
    // No workbench/manifest.json exists in this fixture room, so a
    // hardcoded "integration" would read as 'integration' here too; reading
    // null instead is the proof this comes from declaredGit's manifest
    // resolution rather than a literal - the room-level manifest.json case
    // for declaredGit itself is already covered by workbench-layout's own
    // tests, not re-proven here.
    assert.equal(refusedParsed.integrationBranch, null, 'with no manifest declaring git.integrationBranch, gate reports it as unresolved rather than assuming the literal "integration"');

    const reported = spawnSync('node', [cliPath, 'gate', '--task', 'TK-001', '--spec', 'S-741', '--json', '--path', root], { encoding: 'utf8' });
    assert.equal(reported.status, 0, 'the gate verb exits 0 for a reported Task PR, even against the same incomplete Spec');
    const reportedParsed = JSON.parse(reported.stdout);
    assert.equal(reportedParsed.refused, false);

    console.log('ok - the gate CLI verb exits 1 for a refused Spec candidate and 0 for a reported Task PR, and never hardcodes the integration branch (reads it through declaredGit, null when the manifest declares none)');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// ============================================================================
// Review corrective (Medium): a Task's Receipt lives inside its own TASK.md
// (task-receipt.mjs), so hashing the whole file - as computeSpecDigest did -
// meant every `receipt` append voided a passed verdict, contrary to the
// digest comment's own claim that a Receipt is run history and no part of
// it. Likewise SPEC.md's `Updated`, `Latest event` and `Next gate` header
// fields, which `claimWork` and `closeTask` rewrite on every ordinary
// lifecycle step, moved the digest on every claim or close - neither is a
// change to the reviewed capability itself. Both are now excluded; a real
// content change (Task Status/Proof, a slice row, an acceptance box, the
// Completion Result, a Decisions line) still moves the digest.
// ============================================================================
{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-report-digest-exclusions-'));
  initGitRoot(root);
  try {
    blueprintAndBoard(root);
    const specId = 'S-750';
    const specPath = `specs/${specId}-fixture/SPEC.md`;
    // TK-001 is the fixture's own retained-done table row (recordBackedSpec);
    // the live record under test is TK-002, matching the existing
    // record-backed fixture pattern above, so the retained row and this
    // record never collide over the same id.
    const taskPath = `specs/${specId}-fixture/tasks/TK-002/TASK.md`;
    writeAt(root, specPath, recordBackedSpec(specId));
    writeAt(root, taskPath, taskRecordFixture({
      id: 'TK-002', specId, slice: 'Second slice', status: 'done', blockers: 'none',
      destination: `spec-acceptance: ${specId} Acceptance Criteria`, proof: 'landed'
    }));
    const candidate = headSha(root);
    const baseline = assembleSpecReport(root, specId, { candidate }).specDigest;

    // Appending a Receipt row to the Task's own TASK.md leaves the digest
    // unchanged.
    const taskFile = path.join(root, taskPath);
    const withReceipt = appendReceiptRowToContent(fs.readFileSync(taskFile, 'utf8'), {
      branch: 'codex/demo', headSha: candidate, upstream: '0', dirty: 0,
      testsRun: 'tools/test-fixture.mjs: pass', docsTouched: 'none', remainingGap: 'none'
    });
    fs.writeFileSync(taskFile, withReceipt);
    assert.ok(withReceipt.includes('## Receipt'), 'the fixture actually gained a Receipt section, or this proves nothing');
    assert.equal(
      assembleSpecReport(root, specId, { candidate }).specDigest, baseline,
      'appending a Receipt row to a Task record leaves the Spec content digest unchanged'
    );

    // A second Receipt row: still unchanged.
    fs.writeFileSync(taskFile, appendReceiptRowToContent(fs.readFileSync(taskFile, 'utf8'), {
      branch: 'codex/demo', headSha: candidate, upstream: '0', dirty: 0,
      testsRun: 'tools/test-fixture.mjs: pass (again)', docsTouched: 'none', remainingGap: 'none'
    }));
    assert.equal(assembleSpecReport(root, specId, { candidate }).specDigest, baseline, 'a second Receipt row also leaves the digest unchanged');

    // Rewriting the Spec's own Updated, Latest event and Next gate header
    // fields (exactly what claimWork/closeTask do on every ordinary
    // lifecycle step) leaves the digest unchanged.
    const specFile = path.join(root, specPath);
    const specBefore = fs.readFileSync(specFile, 'utf8');
    const specAfterHeaderEdit = specBefore
      .replace(/\*\*Updated:\*\*.*/, '**Updated:** 2026-09-19')
      .replace(/\*\*Latest event:\*\*.*/, '**Latest event:** TK-002 claimed by codex.')
      .replace(/\*\*Next gate:\*\*.*/, '**Next gate:** Complete TK-002.');
    assert.notEqual(specAfterHeaderEdit, specBefore, 'the fixture edit must actually change the three header fields for this case to mean anything');
    fs.writeFileSync(specFile, specAfterHeaderEdit);
    assert.equal(
      assembleSpecReport(root, specId, { candidate }).specDigest, baseline,
      'rewriting Updated, Latest event and Next gate leaves the digest unchanged - an ordinary claim or close never voids a passed verdict by itself'
    );
    fs.writeFileSync(specFile, specBefore);

    // A real content change - the Task's own Status field - still moves the
    // digest: exclusion is narrow, not a blanket "TASK.md never counts".
    const statusChanged = fs.readFileSync(taskFile, 'utf8').replace('**Status:** done', '**Status:** in-progress');
    fs.writeFileSync(taskFile, statusChanged);
    assert.notEqual(
      assembleSpecReport(root, specId, { candidate }).specDigest, baseline,
      "changing the Task's own Status still moves the digest - the Receipt exclusion is narrow, not a blanket exemption for TASK.md"
    );

    console.log('ok - a Receipt row appended to a Task record, and the Spec header Updated/Latest event/Next gate fields, never move the content digest; the Task\'s own Status still does');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// ============================================================================
// Review corrective (Medium): `gate --task` accepted any Task ID at all,
// including one with no record or retained row under the named Spec, and
// one whose Spec was already complete (exemption 2 protects an incomplete
// Spec from refusal, not any string called a Task ID). Both are now refused
// by name; a real Task ID under a still-open Spec is unaffected.
// ============================================================================
{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-report-gate-task-pr-validity-'));
  initGitRoot(root);
  try {
    blueprintAndBoard(root);
    writeAt(root, 'specs/S-742-fixture/SPEC.md', tableSpec({
      id: 'S-742', taskStatus: 'ready', checked: false, completion: 'Pending.'
    }));

    const noSuchTask = gate(root, { task: 'NOPE-999', spec: 'S-742' });
    assert.equal(noSuchTask.mode, 'task-pr');
    assert.equal(noSuchTask.refused, true, 'a Task ID with no record or retained row under the Spec is refused, not silently reported');
    assert.match(noSuchTask.reason, /No Task record or retained row named NOPE-999 exists under S-742/);

    const realTask = gate(root, { task: 'TK-001', spec: 'S-742' });
    assert.equal(realTask.refused, false, 'a real Task ID under a still-open Spec is reported, exactly as before');

    // A Task ID that is real, but whose Spec is already complete.
    writeAt(root, 'specs/S-743-fixture/SPEC.md', tableSpec({
      id: 'S-743', taskStatus: 'done', checked: true, completion: 'Delivered.',
      evidenceRow: '| 2026-09-18 | TK-001 | Task closed | tools/test-fixture.mjs pass | none | none |'
    }).replace('**Status:** active', '**Status:** complete'));
    const completedSpecTask = gate(root, { task: 'TK-001', spec: 'S-743' });
    assert.equal(completedSpecTask.refused, true, 'a Task PR against an already-complete Spec is refused - exemption 2 protects an incomplete Spec, not a closed one');
    assert.match(completedSpecTask.reason, /S-743 is already complete/);

    console.log('ok - gate --task refuses a Task ID with no record or retained row under the named Spec, and a Task ID whose Spec is already complete, naming both by name');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// ============================================================================
// Review corrective (Low): `gate --spec` never checked that --candidate
// exists in the repository at all, unlike `verdict`, which refuses a
// nonexistent SHA by name.
// ============================================================================
{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-report-gate-nonexistent-candidate-'));
  initGitRoot(root);
  try {
    blueprintAndBoard(root);
    writeAt(root, 'specs/S-744-fixture/SPEC.md', tableSpec({
      id: 'S-744', taskStatus: 'done', checked: true, completion: 'Delivered.',
      evidenceRow: '| 2026-09-18 | TK-001 | Task closed | tools/test-fixture.mjs pass | none | none |'
    }));
    const bogusCandidate = '0000000000000000000000000000000000000f';
    const result = gate(root, { spec: 'S-744', candidate: bogusCandidate });
    assert.equal(result.refused, true, 'gate --spec refuses a candidate that does not exist in the repository');
    assert.match(result.reason, /does not exist in this repository/);
    assert.ok(result.reason.includes(bogusCandidate), 'the refusal names the given SHA');

    console.log('ok - gate --spec refuses a nonexistent --candidate, the same way verdict does');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// ============================================================================
// Review corrective (Medium): with exact-HEAD gone, two same-day verdicts on
// unchanged content (same candidate, digest and result) with different
// findings previously shared their append-only identity (Date, review,
// Event), since neither findings nor reviewer are part of the Event cell.
// Each verdict row now carries its own ordinal in the Event cell, unique by
// construction; a byte-identical repeat (same candidate, result, digest,
// findings and reviewer) is refused outright rather than recorded as a
// second, pointless row.
// ============================================================================
{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-report-verdict-ordinal-'));
  initGitRoot(root);
  try {
    blueprintAndBoard(root);
    const specPath = 'specs/S-745-fixture/SPEC.md';
    writeAt(root, specPath, tableSpec({
      id: 'S-745', taskStatus: 'done', checked: true, completion: 'Delivered.',
      evidenceRow: '| 2026-09-17 | TK-001 | Task closed | tools/test-fixture.mjs pass | none | none |'
    }));
    const candidate = headSha(root);

    const first = recordReviewVerdict(root, 'S-745', {
      candidate, result: 'pass', findings: 'none', reviewer: 'Claude Opus 5 (separate context)'
    });
    const second = recordReviewVerdict(root, 'S-745', {
      candidate, result: 'pass', findings: 'none', reviewer: 'Claude Sonnet 5 (separate context)'
    });
    assert.equal(first.ordinal, 1);
    assert.equal(second.ordinal, 2, 'a second same-day verdict on unchanged content, with a different reviewer, is recordable as its own row');
    assert.notEqual(first.row, second.row, 'the two rows are byte-distinct despite an identical date, candidate, digest and result');
    // The two Event cells (everything up to the findings cell) differ only
    // in their ordinal, proving the ordinal - not luck - is what
    // distinguishes them.
    const firstEvent = first.row.split(' | ')[2];
    const secondEvent = second.row.split(' | ')[2];
    assert.equal(firstEvent.replace('#1', '#2'), secondEvent, 'the two Event cells are identical except for the ordinal suffix');
    assert.match(firstEvent, /\[[0-9a-f]{12}\] #1$/);
    assert.match(secondEvent, /\[[0-9a-f]{12}\] #2$/);

    // A byte-identical repeat of the first verdict (same candidate, result,
    // digest, findings and reviewer) is refused, not recorded as row #3.
    const before = fs.readFileSync(path.join(root, specPath), 'utf8');
    assert.throws(
      () => recordReviewVerdict(root, 'S-745', { candidate, result: 'pass', findings: 'none', reviewer: 'Claude Opus 5 (separate context)' }),
      (error) => error instanceof Error && /already recorded/.test(error.message) && error.message.includes('#1'),
      'an exact repeat of an already-recorded verdict is refused rather than duplicated'
    );
    assert.equal(fs.readFileSync(path.join(root, specPath), 'utf8'), before, 'a refused exact repeat writes nothing');

    console.log('ok - two same-day verdicts on unchanged content with different reviewers get distinct Event cells via an incrementing ordinal, and an exact repeat is refused rather than duplicated');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// ============================================================================
// S-00J TK-005 (red at the pre anchor b293ee9376413f10d8cd0780f400d5d853d84
// 614 - `recordOwnerApproval` does not exist yet, so this whole block fails
// at the import above before a single assertion runs): owner Human QA on
// `integration`, recorded as an approval naming who, when and the
// `integration` SHA inspected. A room that declares no
// `git.integrationBranch` at all (this fixture, matching every other
// no-manifest fixture in this file) has nothing to check the candidate
// against - the same "informs, never blocks an absent declaration" rule
// `gate`'s own `integrationBranch: null` already follows - so the row lands
// exactly as the handoff's six-cell shape describes, bound to the Spec's
// current content digest the same way a review verdict is.
// ============================================================================
{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-report-owner-approval-'));
  initGitRoot(root);
  try {
    blueprintAndBoard(root);
    const specPath = 'specs/S-760-fixture/SPEC.md';
    writeAt(root, specPath, tableSpec({
      id: 'S-760', taskStatus: 'done', checked: true, completion: 'Delivered.',
      evidenceRow: '| 2026-09-17 | TK-001 | Task closed | tools/test-fixture.mjs pass | none | none |'
    }));
    const candidate = commitFixture(root);
    const reportBefore = assembleSpecReport(root, 'S-760', { candidate });
    assert.equal(reportBefore.ownerApproval.length, 0, 'no owner-qa row exists yet');
    assert.equal(reportBefore.latestOwnerApproval, null);

    const approval = recordOwnerApproval(root, 'S-760', { candidate, owner: 'Kayden Clark', result: 'approve' });
    assert.equal(approval.specId, 'S-760');
    assert.equal(approval.candidate, candidate);
    assert.equal(approval.owner, 'Kayden Clark');
    assert.equal(approval.result, 'approve');
    assert.equal(approval.findings, 'none', 'an approve with no --finding records "none" in the findings cell, exactly like a pass verdict');
    assert.equal(approval.ordinal, 1, 'the first owner-qa row on this Spec is #1');
    // This fixture declares no git.integrationBranch at all (matching every
    // other no-manifest fixture in this file), so the ancestor check above
    // was skipped rather than satisfied - review corrective (Low): the
    // remaining-gap cell says so, rather than reading "none" exactly like a
    // genuinely verified approval would.
    assert.equal(approval.remainingGap, 'integration branch undeclared; containment unchecked');
    assert.equal(approval.digest, reportBefore.specDigest, 'the approval binds to the content digest the same way a review verdict does');

    const specAfter = fs.readFileSync(path.join(root, specPath), 'utf8');
    assert.ok(specAfter.includes(approval.row), 'the exact row text the function returns is what lands in the Spec file');
    assert.match(
      approval.row,
      new RegExp(`^\\| 2026-\\d{2}-\\d{2} \\| owner-qa \\| Owner QA: approve at ${candidate} \\[[0-9a-f]{12}\\] #1 \\| none \\| Kayden Clark \\| integration branch undeclared; containment unchecked \\|$`),
      'the row matches the handoff\'s six-cell shape (date, owner-qa, "Owner QA: approve at <sha> [<digest12>] #<n>", findings, owner, remaining gap), with the ordinal mirroring a review verdict\'s own'
    );

    const reportAfter = assembleSpecReport(root, 'S-760', { candidate });
    assert.equal(reportAfter.ownerApproval.length, 1);
    assert.equal(reportAfter.latestOwnerApproval.result, 'approve');
    assert.equal(reportAfter.latestOwnerApproval.owner, 'Kayden Clark');
    assert.equal(reportAfter.latestOwnerApproval.digest, reportBefore.specDigest.slice(0, 12));

    console.log('ok - recordOwnerApproval appends the exact six-cell owner-qa row (with its own #<n> ordinal), bound to the Spec\'s content digest, names its remaining-gap cell "containment unchecked" when no integration branch is declared, and assembleSpecReport exposes it as ownerApproval / latestOwnerApproval beside the verdict');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// ============================================================================
// S-00J TK-005: "a finding that names no corrective item and no destination
// change is refused" - the third red test the handoff names. Refused before
// any write, matching the same fail-fast discipline `recordReviewVerdict`
// already applies to a fail verdict with nothing to fix.
// ============================================================================
{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-report-owner-finding-empty-'));
  initGitRoot(root);
  try {
    blueprintAndBoard(root);
    const specPath = 'specs/S-761-fixture/SPEC.md';
    writeAt(root, specPath, tableSpec({
      id: 'S-761', taskStatus: 'done', checked: true, completion: 'Delivered.',
      evidenceRow: '| 2026-09-17 | TK-001 | Task closed | tools/test-fixture.mjs pass | none | none |'
    }));
    const candidate = commitFixture(root);
    const before = fs.readFileSync(path.join(root, specPath), 'utf8');

    assert.throws(
      () => recordOwnerApproval(root, 'S-761', { candidate, owner: 'Kayden Clark', result: 'finding' }),
      (error) => error instanceof Error && /names no corrective item and no destination change/i.test(error.message),
      'a finding naming neither a corrective item nor a destination change is refused'
    );
    assert.equal(fs.readFileSync(path.join(root, specPath), 'utf8'), before, 'the refused finding writes nothing to the Spec file');
    assert.equal(fs.existsSync(path.join(root, 'specs/S-761-fixture/tasks')), false, 'no tasks/ directory is created by a refused finding');

    // "none" (the literal a pass/approve accepts) and an all-semicolon string
    // both count as naming no item, the same way a fail verdict's own check
    // treats them.
    assert.throws(
      () => recordOwnerApproval(root, 'S-761', { candidate, owner: 'Kayden Clark', result: 'finding', findings: ' ; ; ' }),
      (error) => error instanceof Error && /names no corrective item and no destination change/i.test(error.message)
    );
    assert.equal(fs.readFileSync(path.join(root, specPath), 'utf8'), before);

    console.log('ok - an owner QA finding naming no corrective item and no destination change is refused before any write');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// ============================================================================
// S-00J TK-005: a finding against the existing destination creates corrective
// Tasks through the exact same `createCorrectiveTasks` seam TK-003 built,
// its anchor lookup extended to accept this owner-qa row (never a second
// implementation). One Task per finding, landing exactly like a fail
// verdict's corrective Tasks, with the Planned verification naming this row
// as an "owner QA finding" rather than a "fail verdict" - the anchor's own
// kind, not a hardcoded phrase.
// ============================================================================
{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-report-owner-finding-corrective-'));
  initGitRoot(root);
  try {
    blueprintAndBoard(root);
    const specPath = 'specs/S-762-fixture/SPEC.md';
    writeAt(root, specPath, tableSpec({
      id: 'S-762', taskStatus: 'done', checked: true, completion: 'Delivered.',
      evidenceRow: '| 2026-09-17 | TK-001 | Task closed | tools/test-fixture.mjs pass | none | none |'
    }));
    const candidate = commitFixture(root);

    const finding = recordOwnerApproval(root, 'S-762', {
      candidate, owner: 'Kayden Clark', result: 'finding', findings: 'Missing empty-state copy; Stale screenshot in the README'
    });
    assert.equal(finding.result, 'finding');
    assert.ok(Array.isArray(finding.correctiveTasks), 'a finding against the existing destination returns the corrective Tasks it created in the same operation');
    assert.equal(finding.correctiveTasks.length, 2, 'one corrective Task per finding');
    const [firstTask, secondTask] = finding.correctiveTasks;
    assert.notEqual(firstTask.id, secondTask.id);
    assert.notEqual(firstTask.id, 'TK-001', 'a corrective Task id never collides with the retained done row');

    const firstContent = fs.readFileSync(path.join(root, firstTask.filePath), 'utf8');
    assert.match(firstContent, /\*\*Status:\*\* ready$/m);
    assert.match(firstContent, /\*\*Blockers:\*\* none$/m);
    assert.match(firstContent, /\*\*Destination:\*\* spec-acceptance: S-762 Acceptance Criteria$/m);
    assert.match(
      firstContent,
      new RegExp(`\\*\\*Planned verification:\\*\\* Answers evidence row 2 \\(owner QA finding at ${candidate} on ${finding.date}\\): Missing empty-state copy$`, 'm'),
      'the Planned verification names the finding and the exact owner-qa row it answers, using the anchor\'s own "owner QA finding" phrase'
    );

    const specAfter = fs.readFileSync(path.join(root, specPath), 'utf8');
    assert.match(specAfter, /\*\*Status:\*\* active$/m, 'a finding against the existing destination leaves the Spec open');
    assert.ok(specAfter.includes(finding.row), 'the owner-qa row itself is present, appended in the same operation that created the corrective Tasks');

    const next = nextWork(root);
    assert.equal(next.specId, 'S-762');
    assert.equal(next.taskId, firstTask.id, 'next selects an owner-qa corrective Task like any other ready record');

    render(root);
    const board = fs.readFileSync(path.join(root, 'TASKBOARD.md'), 'utf8');
    assert.ok(board.includes(firstTask.id), 'render shows the owner-qa corrective Task on the hot board');

    console.log('ok - an owner QA finding against the existing destination creates one corrective Task per item through the extended anchor lookup, naming the owner-qa row it answers');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// ============================================================================
// S-00J TK-005: a finding that changes the destination is recorded as
// "Return to Align: <text>" in the findings cell and creates nothing -
// "a changed destination is a new Spec or a Blueprint change, not corrective
// work". The Spec stays open (the same still-open rule a corrective finding
// follows), and no `tasks/` directory is ever created for this row.
// ============================================================================
{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-report-owner-finding-align-'));
  initGitRoot(root);
  try {
    blueprintAndBoard(root);
    const specPath = 'specs/S-763-fixture/SPEC.md';
    writeAt(root, specPath, tableSpec({
      id: 'S-763', taskStatus: 'done', checked: true, completion: 'Delivered.',
      evidenceRow: '| 2026-09-17 | TK-001 | Task closed | tools/test-fixture.mjs pass | none | none |'
    }));
    const candidate = commitFixture(root);

    const finding = recordOwnerApproval(root, 'S-763', {
      candidate, owner: 'Kayden Clark', result: 'finding', destinationChange: 'The destination itself changed; this belongs in a new Spec'
    });
    assert.equal(finding.result, 'finding');
    assert.equal(finding.correctiveTasks, undefined, 'a destination change creates no corrective Tasks');
    assert.equal(finding.findings, 'Return to Align: The destination itself changed; this belongs in a new Spec');
    assert.equal(fs.existsSync(path.join(root, 'specs/S-763-fixture/tasks')), false, 'no tasks/ directory is created for a return to Align');

    const specAfter = fs.readFileSync(path.join(root, specPath), 'utf8');
    assert.match(specAfter, /\*\*Status:\*\* active$/m, 'a return to Align leaves the Spec open - it is not itself a closure or a supersession');
    assert.ok(specAfter.includes(finding.row), 'the owner-qa row is appended');
    assert.match(finding.row, /\| Return to Align: The destination itself changed; this belongs in a new Spec \|/);

    console.log('ok - an owner QA finding that changes the destination is recorded as "Return to Align: <text>" and creates no corrective Tasks, leaving the Spec open');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// ============================================================================
// S-00J TK-005 (red at the pre anchor - the ancestor check does not exist):
// "an approval naming a SHA that is not on the declared integration branch
// is refused." A bare manifest declaring only `git.integrationBranch` is
// enough to exercise this: the refusal happens before `findSpec` is ever
// reached (a divergent candidate is rejected by the ancestor check alone),
// so this fixture never needs a full schemaVersion-2 workbench manifest -
// only `declaredGit`'s own lightweight `manifest.git` read sees this file.
// ============================================================================
{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-report-owner-approval-ancestor-'));
  initGitRoot(root);
  try {
    blueprintAndBoard(root);
    const branch = currentBranch(root);
    writeIntegrationManifest(root, branch);
    const specPath = 'specs/S-764-fixture/SPEC.md';
    writeAt(root, specPath, tableSpec({
      id: 'S-764', taskStatus: 'done', checked: true, completion: 'Delivered.',
      evidenceRow: '| 2026-09-17 | TK-001 | Task closed | tools/test-fixture.mjs pass | none | none |'
    }));
    execFileSync('git', ['-C', root, 'add', '-A']);
    execFileSync('git', ['-C', root, 'commit', '--quiet', '-m', 'add the fixture Spec and manifest']);
    const integrationTip = headSha(root);

    // A divergent lane branch, never merged into the declared integration
    // branch - exactly "a lane tip", the one thing "integration only" rules
    // out.
    execFileSync('git', ['-C', root, 'checkout', '--quiet', '-b', 'codex/off-lane']);
    execFileSync('git', ['-C', root, 'commit', '--quiet', '--allow-empty', '-m', 'lane work never merged to integration']);
    const laneTip = execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
    execFileSync('git', ['-C', root, 'checkout', '--quiet', branch]);
    const before = fs.readFileSync(path.join(root, specPath), 'utf8');

    assert.notEqual(laneTip, integrationTip, 'the fixture must actually diverge for this case to mean anything');
    assert.throws(
      () => recordOwnerApproval(root, 'S-764', { candidate: laneTip, owner: 'Kayden Clark', result: 'approve' }),
      (error) => error instanceof Error
        && /is not contained in the declared integration branch/.test(error.message)
        && error.message.includes(laneTip)
        && error.message.includes(branch),
      'a candidate that is not contained in the declared integration branch is refused, naming the SHA and the branch'
    );
    assert.equal(fs.readFileSync(path.join(root, specPath), 'utf8'), before, 'a refused ancestor check writes nothing to the Spec file');

    // The declared branch's own tip is, trivially, contained in itself: the
    // ancestor check alone passes for it (proven directly, the same way
    // `commitExists`/`isAncestorOfBranch` are proven elsewhere in this file -
    // this fixture's bare, schemaVersion-less manifest is only valid for
    // `declaredGit`'s own lightweight read, not for the full
    // `resolveSpecsRoot` a successful write would also need, so the write
    // path itself is proven instead by the full-approval fixture above).
    const branchTipIsAncestor = spawnSync('git', ['-C', root, 'merge-base', '--is-ancestor', integrationTip, branch]).status;
    assert.equal(branchTipIsAncestor, 0, "the branch's own tip is trivially its own ancestor - isolating the refusal above to the divergent lane tip alone");

    console.log('ok - recordOwnerApproval refuses a candidate that is not contained in the declared integration branch, naming the SHA and the branch');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// ============================================================================
// The `approve` CLI verb: `approve S-### --candidate <sha> --owner "<who>"
// [--finding "..."] [--destination-change "..."]` - the handoff's exact
// invocation shape, with no separate --result flag shown. The verb infers
// approve vs finding from what the caller actually gave.
// ============================================================================
{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-report-approve-cli-'));
  initGitRoot(root);
  try {
    blueprintAndBoard(root);
    const specPath = 'specs/S-765-fixture/SPEC.md';
    writeAt(root, specPath, tableSpec({
      id: 'S-765', taskStatus: 'done', checked: true, completion: 'Delivered.',
      evidenceRow: '| 2026-09-17 | TK-001 | Task closed | tools/test-fixture.mjs pass | none | none |'
    }));
    const candidate = commitFixture(root);
    const cliPath = path.resolve('workbench/tools/spec-workbench.mjs');

    const approveResult = spawnSync('node', [
      cliPath, 'approve', 'S-765', '--candidate', candidate, '--owner', 'Kayden Clark', '--json', '--path', root
    ], { encoding: 'utf8' });
    assert.equal(approveResult.status, 0, `the approve verb exits 0 with no --finding given: ${approveResult.stderr}`);
    const approveParsed = JSON.parse(approveResult.stdout);
    assert.equal(approveParsed.result, 'approve', 'no --finding or --destination-change infers a plain approval');
    assert.ok(fs.readFileSync(path.join(root, specPath), 'utf8').includes(approveParsed.row), 'the CLI approve lands the same row text the JSON result names');

    // A second candidate (HEAD moved), this time carrying --finding: infers
    // a finding against the existing destination.
    execFileSync('git', ['-C', root, 'commit', '--quiet', '--allow-empty', '-m', 'move past the approved candidate']);
    const movedCandidate = commitFixture(root);
    const findingResult = spawnSync('node', [
      cliPath, 'approve', 'S-765', '--candidate', movedCandidate, '--owner', 'Kayden Clark',
      '--finding', 'The onboarding copy still references the old flow', '--json', '--path', root
    ], { encoding: 'utf8' });
    assert.equal(findingResult.status, 0, `the approve verb exits 0 with a --finding given: ${findingResult.stderr}`);
    const findingParsed = JSON.parse(findingResult.stdout);
    assert.equal(findingParsed.result, 'finding', 'a --finding with no --destination-change infers a finding against the existing destination');
    assert.equal(findingParsed.correctiveTasks.length, 1);

    // A third candidate, this time carrying --destination-change: infers a
    // return to Align.
    execFileSync('git', ['-C', root, 'commit', '--quiet', '--allow-empty', '-m', 'move past the finding candidate']);
    const alignCandidate = commitFixture(root);
    const alignResult = spawnSync('node', [
      cliPath, 'approve', 'S-765', '--candidate', alignCandidate, '--owner', 'Kayden Clark',
      '--destination-change', 'The owner wants a different destination entirely', '--json', '--path', root
    ], { encoding: 'utf8' });
    assert.equal(alignResult.status, 0, `the approve verb exits 0 with a --destination-change given: ${alignResult.stderr}`);
    const alignParsed = JSON.parse(alignResult.stdout);
    assert.equal(alignParsed.result, 'finding');
    assert.equal(alignParsed.correctiveTasks, undefined, 'a destination change infers a finding but creates no corrective Tasks');
    assert.match(alignParsed.findings, /^Return to Align:/);

    console.log('ok - the approve CLI verb infers approve/finding from --finding and --destination-change exactly as the handoff\'s invocation shows, and records the same rows the exported function would');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// ============================================================================
// Review corrective (Medium): `recordOwnerApproval`'s non-empty `--owner`
// requirement and its closed `approve`/`finding` result vocabulary were
// implemented (`requiredString` and a literal equality check) but untested -
// replacing `requiredString` with a plain string, or the vocabulary check
// with nothing, would have left every other test in this file green. Both
// refusals write nothing, matching every other pre-write validation in this
// module.
// ============================================================================
{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-report-owner-approval-validation-'));
  initGitRoot(root);
  try {
    blueprintAndBoard(root);
    const specPath = 'specs/S-766-fixture/SPEC.md';
    writeAt(root, specPath, tableSpec({
      id: 'S-766', taskStatus: 'done', checked: true, completion: 'Delivered.',
      evidenceRow: '| 2026-09-17 | TK-001 | Task closed | tools/test-fixture.mjs pass | none | none |'
    }));
    const candidate = commitFixture(root);
    const before = fs.readFileSync(path.join(root, specPath), 'utf8');

    for (const owner of ['', '   ']) {
      assert.throws(
        () => recordOwnerApproval(root, 'S-766', { candidate, owner, result: 'approve' }),
        (error) => error instanceof Error && /recordOwnerApproval requires --owner/.test(error.message),
        `an ${owner === '' ? 'empty' : 'whitespace-only'} --owner is refused by name`
      );
    }
    assert.equal(fs.readFileSync(path.join(root, specPath), 'utf8'), before, 'a refused missing-owner call writes nothing to the Spec file');

    assert.throws(
      () => recordOwnerApproval(root, 'S-766', { candidate, owner: 'Kayden Clark', result: 'reject' }),
      (error) => error instanceof Error && /requires --result of approve or finding, got: reject/.test(error.message),
      'an out-of-vocabulary result is refused by name'
    );
    assert.throws(
      () => recordOwnerApproval(root, 'S-766', { candidate, owner: 'Kayden Clark' }),
      (error) => error instanceof Error && /requires --result of approve or finding, got: nothing/.test(error.message),
      'a missing result is refused, distinguishably from a wrong one'
    );
    assert.equal(fs.readFileSync(path.join(root, specPath), 'utf8'), before, 'a refused out-of-vocabulary or missing result writes nothing');

    console.log('ok - recordOwnerApproval refuses an empty or whitespace-only --owner and an out-of-vocabulary or missing --result, each writing nothing');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// ============================================================================
// Review corrective (Medium): with no ordinal, two same-day owner-qa rows for
// one candidate and content digest shared their append-only identity (Date,
// owner-qa, Event), since neither findings nor owner is part of the Event
// cell - two different owners approving the same candidate on the same day,
// or two same-day Return-to-Align findings, would have collapsed under
// `tools/check-append-only.py`'s identity rule. Every owner-qa row now
// carries its own position among this Spec's owner-qa rows in the Event
// cell (`#<n>`), mirroring `recordReviewVerdict`'s own; a byte-identical
// repeat (same candidate, result, digest, findings and owner) is refused
// outright rather than recorded as a pointless new row, naming the existing
// row's ordinal.
// ============================================================================
{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-report-owner-approval-ordinal-'));
  initGitRoot(root);
  try {
    blueprintAndBoard(root);
    const specPath = 'specs/S-767-fixture/SPEC.md';
    writeAt(root, specPath, tableSpec({
      id: 'S-767', taskStatus: 'done', checked: true, completion: 'Delivered.',
      evidenceRow: '| 2026-09-17 | TK-001 | Task closed | tools/test-fixture.mjs pass | none | none |'
    }));
    const candidate = commitFixture(root);

    const first = recordOwnerApproval(root, 'S-767', { candidate, owner: 'Kayden Clark', result: 'approve' });
    const second = recordOwnerApproval(root, 'S-767', { candidate, owner: 'A Second Reviewer', result: 'approve' });
    assert.equal(first.ordinal, 1);
    assert.equal(second.ordinal, 2, 'a second same-day owner-qa row on unchanged content, with a different owner, is recordable as its own row');
    assert.notEqual(first.row, second.row, 'the two rows are byte-distinct despite an identical date, candidate, digest and result');
    // The two Event cells (everything up to the findings cell) differ only
    // in their ordinal, proving the ordinal - not luck - is what
    // distinguishes them.
    const firstEvent = first.row.split(' | ')[2];
    const secondEvent = second.row.split(' | ')[2];
    assert.equal(firstEvent.replace('#1', '#2'), secondEvent, 'the two Event cells are identical except for the ordinal suffix');
    assert.match(firstEvent, /\[[0-9a-f]{12}\] #1$/);
    assert.match(secondEvent, /\[[0-9a-f]{12}\] #2$/);

    // A byte-identical repeat of the first entry (same candidate, result,
    // digest, findings and owner) is refused, naming the existing row.
    const before = fs.readFileSync(path.join(root, specPath), 'utf8');
    assert.throws(
      () => recordOwnerApproval(root, 'S-767', { candidate, owner: 'Kayden Clark', result: 'approve' }),
      (error) => error instanceof Error && /already recorded/.test(error.message) && error.message.includes('#1'),
      'an exact repeat of an already-recorded owner-qa entry is refused rather than duplicated, naming the existing row'
    );
    assert.equal(fs.readFileSync(path.join(root, specPath), 'utf8'), before, 'a refused exact repeat writes nothing');

    // The corrective-Task anchor still resolves to the most recent
    // qualifying finding row by its own evidence-log position - unaffected
    // by the owner-qa row's own #<n> ordinal, a separate counter.
    const finding = recordOwnerApproval(root, 'S-767', {
      candidate, owner: 'Kayden Clark', result: 'finding', findings: 'A late-breaking defect'
    });
    assert.equal(finding.ordinal, 3, 'the ordinal keeps incrementing across approve and finding rows alike');
    assert.equal(finding.correctiveTasks.length, 1);
    const correctiveContent = fs.readFileSync(path.join(root, finding.correctiveTasks[0].filePath), 'utf8');
    assert.match(
      correctiveContent,
      /\*\*Planned verification:\*\* Answers evidence row 4 \(owner QA finding at /,
      "the corrective Task's anchor still names the row's own evidence-log position, not the owner-qa event's #<n>"
    );

    console.log('ok - two same-day owner-qa rows on unchanged content with different owners get distinct Event cells via an incrementing ordinal, an exact repeat is refused naming the existing row, and the corrective-Task anchor keeps using the row\'s own evidence-log position');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// ============================================================================
// S-00J TK-01R: an unresolved durable Task decision is a named Spec QA gap.
// A Task body may carry a `## Decisions` section: the single line `None.`, or
// a `| Choice | Scope | Disposition | Durable owner |` table. A `durable` +
// `unresolved` row, or a `reconciled` row naming no durable owner, is a gap
// the report names (Task and choice), `gate` refuses and `complete` refuses
// even with otherwise valid review and owner-approval rows - writing nothing.
// `task-local` rows never gap; a Task with no section is legacy, reported as
// unknown decision coverage and neither a gap nor a verified reconciliation.
// The section is substantive Task content, so it stays inside the digest.
// ============================================================================
function decisionsSection(rows) {
  if (rows === null) return [];
  if (rows === 'none') return ['## Decisions', '', 'None.', ''];
  return [
    '## Decisions',
    '',
    '| Choice | Scope | Disposition | Durable owner |',
    '|---|---|---|---|',
    ...rows.map((cells) => `| ${cells.join(' | ')} |`),
    ''
  ];
}

function completeRecordSpec(id, extraEvidence = []) {
  return recordBackedSpec(id)
    .replace('- [ ] Expected behavior is verified.', '- [x] Expected behavior is verified.')
    .replace('\nPending.\n', '\nDelivered.\n')
    .replace(
      '| 2026-09-17 | TK-001 | Task closed | tools/test-fixture.mjs pass | none | none |',
      ['| 2026-09-17 | TK-001 | Task closed | tools/test-fixture.mjs pass | none | none |', ...extraEvidence].join('\n')
    );
}

function doneTaskWithDecisions({ id, specId, rows }) {
  return [
    taskRecordFixture({
      id, specId, slice: 'Decision-bearing slice', status: 'done', blockers: 'none',
      destination: `spec-acceptance: ${specId}`, proof: 'tools/test-fixture.mjs pass'
    }),
    ...decisionsSection(rows)
  ].join('\n');
}

{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-report-decisions-live-'));
  initManagedRoot(root);
  try {
    blueprintAndBoard(root);
    const branch = currentBranch(root);
    declareGit(root, { defaultBranch: branch, integrationBranch: branch });
    const specId = 'S-7D0';
    const specPath = `workbench/specs/${specId}-fixture/SPEC.md`;
    const taskPath = `workbench/specs/${specId}-fixture/tasks/TK-002/TASK.md`;
    writeAt(root, specPath, completeRecordSpec(specId, ['| 2026-09-17 | TK-002 | Task closed | tools/test-fixture.mjs pass | none | none |']));
    const unresolvedRows = [
      ['Keep the fixture ledger in JSON', 'durable', 'unresolved', 'workbench/docs/adr/'],
      ['Name the helper decisionsOf', 'task-local', 'unresolved', '']
    ];
    writeAt(root, taskPath, doneTaskWithDecisions({ id: 'TK-002', specId, rows: unresolvedRows }));
    const candidate = commitFixture(root);

    // Otherwise valid bound review and owner approval on the current content.
    recordReviewVerdict(root, specId, { candidate, result: 'pass', findings: 'none', reviewer: 'separate fixture context' });
    recordOwnerApproval(root, specId, { candidate, owner: 'Fixture owner', result: 'approve' });

    const report = assembleSpecReport(root, specId, { candidate });
    assert.equal(report.complete, false, 'an explicit unescalated durable choice keeps the assembled Spec incomplete');
    const decisionGaps = report.gaps.filter((gap) => /decision/i.test(gap));
    assert.equal(decisionGaps.length, 1, `exactly the durable unresolved row gaps; task-local never gaps: ${JSON.stringify(report.gaps)}`);
    assert.match(decisionGaps[0], /TK-002/, 'the gap names its Task');
    assert.match(decisionGaps[0], /Keep the fixture ledger in JSON/, 'the gap names the choice');
    assert.match(decisionGaps[0], /unresolved/, 'the gap names the remaining escalation');
    assert.deepEqual(report.decisionGaps, decisionGaps, 'decisionGaps is the decision subset of gaps');
    const tk002 = report.tasks.find((task) => task.id === 'TK-002');
    assert.equal(tk002.decisions.coverage, 'declared');
    assert.equal(tk002.decisions.rows.length, 2);
    assert.deepEqual(tk002.decisions.rows[0], {
      choice: 'Keep the fixture ledger in JSON', scope: 'durable', disposition: 'unresolved', durableOwner: 'workbench/docs/adr/'
    });
    const tk001 = report.tasks.find((task) => task.id === 'TK-001');
    assert.equal(tk001.decisions.coverage, 'unknown', 'a retained table row has no body: coverage unknown');
    assert.deepEqual(report.decisionCoverage.unknown, ['TK-001'], 'legacy coverage is reported informationally');
    assert.match(formatSpecReport(report), /Keep the fixture ledger in JSON/, 'the plain-text report shows the decision gap');
    assert.match(formatSpecReport(report), /Decision coverage unknown: TK-001/, 'the plain-text report states unknown coverage');

    // Reporting is not a mutating operation; gate and complete refuse and write nothing.
    const specBefore = fs.readFileSync(path.join(root, specPath), 'utf8');
    const taskBefore = fs.readFileSync(path.join(root, taskPath), 'utf8');
    const gated = gate(root, { spec: specId, candidate });
    assert.equal(gated.refused, true, 'the Spec-candidate gate refuses the unresolved durable decision');
    assert.match(gated.reason, /Keep the fixture ledger in JSON/);
    assert.throws(() => completeSpec(root, specId), /TK-002.*Keep the fixture ledger in JSON/s,
      'complete cannot bypass the decision gap with otherwise valid review and approval rows');
    assert.equal(fs.readFileSync(path.join(root, specPath), 'utf8'), specBefore, 'report, gate and refused complete write nothing to the Spec');
    assert.equal(fs.readFileSync(path.join(root, taskPath), 'utf8'), taskBefore, 'report, gate and refused complete write nothing to the Task');
    assert.equal(assembleSpecReport(root, specId).status, 'active');

    // A `reconciled` row without a durable owner route stays a gap.
    const unrouted = [['Keep the fixture ledger in JSON', 'durable', 'reconciled', ''], unresolvedRows[1]];
    writeAt(root, taskPath, doneTaskWithDecisions({ id: 'TK-002', specId, rows: unrouted }));
    const unroutedReport = assembleSpecReport(root, specId);
    assert.equal(unroutedReport.decisionGaps.length, 1, 'reconciled without an owner route is still a gap');
    assert.match(unroutedReport.decisionGaps[0], /TK-002.*Keep the fixture ledger in JSON.*durable owner/s);

    // Substantive Decisions edits move the digest; reconciliation clears the
    // gap while retaining the source row and its durable-owner route.
    const unresolvedDigest = report.specDigest;
    const reconciled = [['Keep the fixture ledger in JSON', 'durable', 'reconciled', 'workbench/docs/adr/0099-fixture.md'], unresolvedRows[1]];
    writeAt(root, taskPath, doneTaskWithDecisions({ id: 'TK-002', specId, rows: reconciled }));
    const reconciledReport = assembleSpecReport(root, specId);
    assert.notEqual(reconciledReport.specDigest, unresolvedDigest, 'a substantive Decisions edit changes the content digest');
    assert.notEqual(unroutedReport.specDigest, unresolvedDigest);
    assert.deepEqual(reconciledReport.decisionGaps, [], 'a reconciled durable row with an owner route clears the gap');
    assert.equal(reconciledReport.complete, true);
    assert.equal(reconciledReport.tasks.find((task) => task.id === 'TK-002').decisions.rows[0].durableOwner,
      'workbench/docs/adr/0099-fixture.md', 'the cleared row keeps its durable-owner route');
    assert.equal(reconciledReport.latestVerdict, null, 'the earlier verdict bound the unresolved content and no longer applies');
    assert.throws(() => completeSpec(root, specId), /reviewed again/, 'reconciliation alone proves no review or approval');

    // A fresh review and approval of the reconciled content lets closure proceed.
    const reconciledCandidate = commitFixture(root);
    recordReviewVerdict(root, specId, { candidate: reconciledCandidate, result: 'pass', findings: 'none', reviewer: 'separate fixture context' });
    assert.equal(gate(root, { spec: specId, candidate: reconciledCandidate }).refused, false);
    recordOwnerApproval(root, specId, { candidate: reconciledCandidate, owner: 'Fixture owner', result: 'approve' });
    pinRemoteTracking(root, branch, reconciledCandidate);
    completeSpec(root, specId);
    assert.equal(assembleSpecReport(root, specId).status, 'complete');

    // Explicit `None.` and legacy absence: neither gaps.
    for (const [rows, coverage] of [['none', 'none'], [null, 'unknown']]) {
      const otherId = rows === 'none' ? 'S-7D2' : 'S-7D3';
      writeAt(root, `workbench/specs/${otherId}-fixture/SPEC.md`, completeRecordSpec(otherId, ['| 2026-09-17 | TK-002 | Task closed | tools/test-fixture.mjs pass | none | none |']));
      writeAt(root, `workbench/specs/${otherId}-fixture/tasks/TK-002/TASK.md`, doneTaskWithDecisions({ id: 'TK-002', specId: otherId, rows }));
      const other = assembleSpecReport(root, otherId);
      assert.equal(other.tasks.find((task) => task.id === 'TK-002').decisions.coverage, coverage);
      assert.deepEqual(other.decisionGaps, [], `coverage ${coverage} is never a gap`);
      assert.equal(other.complete, true, `coverage ${coverage} leaves an otherwise complete Spec complete`);
      assert.equal(other.decisionCoverage.unknown.includes('TK-002'), coverage === 'unknown',
        'only an absent section is unknown coverage, never a verified reconciliation');
    }
    // An unreadable declaration fails closed: it cannot show that no durable
    // choice is pending, so it is a named gap rather than unknown coverage.
    writeAt(root, 'workbench/specs/S-7D4-fixture/SPEC.md', completeRecordSpec('S-7D4', ['| 2026-09-17 | TK-002 | Task closed | tools/test-fixture.mjs pass | none | none |']));
    writeAt(root, 'workbench/specs/S-7D4-fixture/tasks/TK-002/TASK.md', doneTaskWithDecisions({
      id: 'TK-002', specId: 'S-7D4', rows: [['Share the cache', 'global', 'unresolved', 'workbench/wiki/cache.md']]
    }));
    const malformed = assembleSpecReport(root, 'S-7D4');
    assert.equal(malformed.tasks.find((task) => task.id === 'TK-002').decisions.coverage, 'malformed');
    assert.equal(malformed.decisionGaps.length, 1);
    assert.match(malformed.decisionGaps[0], /TK-002 decision section is malformed: .*Share the cache.*Scope "global"/);
    console.log('ok - S-00J TK-01R: a live Task\'s unresolved durable decision is a named gap that gate and complete refuse without writing, reconciliation with an owner route clears it, None. and legacy absence never gap, and Decisions edits move the digest');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-report-decisions-retired-'));
  initGitRoot(root);
  try {
    blueprintAndBoard(root);
    const specId = 'S-7D1';
    const specPath = `specs/${specId}-fixture/SPEC.md`;
    const taskPath = `specs/${specId}-fixture/tasks/retired/TK-003/TASK.md`;
    writeAt(root, specPath, completeRecordSpec(specId, ['| 2026-09-17 | TK-003 | Task closed | tools/test-fixture.mjs pass | none | none |']));
    writeAt(root, taskPath, doneTaskWithDecisions({
      id: 'TK-003', specId, rows: [['Retire the fixture adapter', 'durable', 'unresolved', 'workbench/wiki/fixture.md']]
    }));
    const candidate = commitFixture(root);
    recordReviewVerdict(root, specId, { candidate, result: 'pass', findings: 'none', reviewer: 'separate fixture context' });
    recordOwnerApproval(root, specId, { candidate, owner: 'Fixture owner', result: 'approve' });

    const report = assembleSpecReport(root, specId, { candidate });
    const retired = report.tasks.find((task) => task.id === 'TK-003');
    assert.equal(retired.source, 'retired-record');
    assert.equal(retired.decisions.coverage, 'declared', 'a retired Task body receives the same decision coverage');
    assert.equal(report.complete, false);
    assert.equal(report.decisionGaps.length, 1);
    assert.match(report.decisionGaps[0], /TK-003.*Retire the fixture adapter/s);
    const specBefore = fs.readFileSync(path.join(root, specPath), 'utf8');
    assert.equal(gate(root, { spec: specId, candidate }).refused, true, 'gate refuses a retired Task\'s unresolved durable decision');
    assert.throws(() => completeSpec(root, specId), /TK-003.*Retire the fixture adapter/s);
    assert.equal(fs.readFileSync(path.join(root, specPath), 'utf8'), specBefore, 'refusal writes nothing');

    const digestBefore = report.specDigest;
    writeAt(root, taskPath, fs.readFileSync(path.join(root, taskPath), 'utf8').replace('| unresolved |', '| reconciled |'));
    const after = assembleSpecReport(root, specId);
    assert.notEqual(after.specDigest, digestBefore, 'a retired Task\'s Decisions edit changes the digest');
    assert.deepEqual(after.decisionGaps, [], 'reconciling the retired Task\'s durable row with its owner route clears the gap');
    console.log('ok - S-00J TK-01R: a retired Task body gets equivalent decision coverage: named gap, gate and complete refusal without writes, digest-bound reconciliation');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// ============================================================================
// S-00J TK-01S: final closure verifies approved delivery on the declared
// default branch (closure-capture contract T2 and T3). Reviewed integration
// delivery (T0) and owner approval (T1) are not enough: `complete` also
// requires the approved candidate to be an ancestor of the declared default
// branch's remote-tracking ref, pinned to its observed SHA, and the Spec's
// committed digest there to equal the approved digest. Every refusal writes
// nothing; success records the observed ref/SHA and approved candidate/digest
// in the existing completion evidence row. Resolution reads local refs only:
// these fixtures pin `refs/remotes/origin/<branch>` directly, never fetch.
// ============================================================================

{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-report-main-closure-'));
  initManagedRoot(root);
  try {
    blueprintAndBoard(root);
    const integration = currentBranch(root);
    // The declared default branch is deliberately not `main`: resolution goes
    // through the manifest, never a literal.
    declareGit(root, { defaultBranch: 'trunk', integrationBranch: integration });
    const specId = 'S-7E0';
    const specPath = `workbench/specs/${specId}-fixture/SPEC.md`;
    const approvedContent = tableSpec({ id: specId, taskStatus: 'done', checked: true,
      completion: 'Delivered.', evidenceRow: '| 2026-09-26 | TK-001 | Task closed | tools/test-fixture.mjs pass | none | none |' });
    writeAt(root, specPath, approvedContent);
    const candidate = commitFixture(root);
    recordReviewVerdict(root, specId, { candidate, result: 'pass', findings: 'none', reviewer: 'separate fixture context' });
    assert.equal(gate(root, { spec: specId, candidate }).refused, false,
      'gate permits a complete reviewed candidate before owner QA or default-branch delivery');
    recordOwnerApproval(root, specId, { candidate, owner: 'Fixture owner', result: 'approve' });
    const approvedDigest = assembleSpecReport(root, specId).specDigest;
    assert.equal(gate(root, { spec: specId, candidate }).refused, false,
      'gate still permits the approved candidate before default-branch delivery');

    const cliPath = path.resolve('workbench/tools/spec-workbench.mjs');
    function assertRefusal(pattern, message) {
      const before = fs.readFileSync(path.join(root, specPath), 'utf8');
      assert.throws(() => completeSpec(root, specId), pattern, message);
      assert.equal(fs.readFileSync(path.join(root, specPath), 'utf8'), before, `${message}: refusal writes nothing`);
      const cli = spawnSync('node', [cliPath, 'complete', specId, '--path', root], { encoding: 'utf8' });
      assert.equal(cli.status, 1, `${message}: CLI complete exits 1`);
      assert.match(cli.stderr, pattern, `${message}: CLI complete names the reason`);
      assert.equal(fs.readFileSync(path.join(root, specPath), 'utf8'), before, `${message}: CLI refusal writes nothing`);
      assert.equal(assembleSpecReport(root, specId).status, 'active');
    }

    // Complete, reviewed and owner-approved, but nothing proves delivery on
    // the declared default branch.
    assertRefusal(/origin\/trunk/, 'an absent default-branch remote-tracking ref refuses closure');

    // A non-default branch carrying the candidate proves nothing.
    pinRemoteTracking(root, integration, candidate);
    pinRemoteTracking(root, 'main', candidate);
    assertRefusal(/origin\/trunk/, 'a non-default branch containing the candidate does not satisfy the declared default branch');

    // The declared ref exists but does not contain the approved candidate.
    const initial = execFileSync('git', ['-C', root, 'rev-list', '--max-parents=0', 'HEAD'], { encoding: 'utf8' }).trim();
    pinRemoteTracking(root, 'trunk', initial);
    assertRefusal(new RegExp(`${candidate}.*not contained in origin/trunk`), 'an approved candidate outside the default branch refuses closure');

    // Containment then substantive reversal on the default branch.
    const reversal = commitTreeEdit(root, candidate, {
      [specPath]: approvedContent.replace('Expected behavior is verified.', 'Reverted behavior is verified.')
    }, 'reverse approved content on trunk');
    pinRemoteTracking(root, 'trunk', reversal);
    assertRefusal(new RegExp(`origin/trunk at ${reversal}.*differs from the approved content \\[${approvedDigest.slice(0, 12)}\\]`),
      'containment followed by a substantive change on the default branch refuses closure');

    // Containment, but the Spec is unreadable on the default branch.
    const removed = commitTreeEdit(root, candidate, { [specPath]: null }, 'remove approved Spec on trunk');
    pinRemoteTracking(root, 'trunk', removed);
    assertRefusal(/unreadable/, 'unreadable committed content on the default branch refuses closure');

    // An undeclared default branch refuses before any other delivery check.
    declareGit(root, null);
    assertRefusal(/declares no git\.defaultBranch/, 'an undeclared default branch refuses closure');
    declareGit(root, { defaultBranch: 'trunk', integrationBranch: integration });

    // Administrative changes, locally and on the default branch, neither
    // void the approval nor block verified delivery.
    const administrative = commitTreeEdit(root, candidate, {
      [specPath]: approvedContent.replace('**Latest event:** Spec activated.', '**Latest event:** Promoted to trunk.')
    }, 'administrative header change on trunk');
    pinRemoteTracking(root, 'trunk', administrative);
    writeAt(root, specPath, fs.readFileSync(path.join(root, specPath), 'utf8')
      .replace('**Updated:** 2026-09-17', '**Updated:** 2026-09-26')
      .replace('**Next gate:** Complete TK-001.', '**Next gate:** Complete S-7E0.'));
    const beforeSuccess = fs.readFileSync(path.join(root, specPath), 'utf8');
    completeSpec(root, specId, { date: '2026-09-26' });
    const after = fs.readFileSync(path.join(root, specPath), 'utf8');
    const completed = assembleSpecReport(root, specId);
    assert.equal(completed.status, 'complete');
    assert.equal(completed.specDigest, approvedDigest, 'completion preserves the approved digest');
    assert.equal(completed.latestOwnerApproval.result, 'approve', 'administrative changes do not force another approval');
    const closeRow = after.split('\n').find((line) => line.includes('| spec | Spec completed |'));
    assert.equal(closeRow,
      `| 2026-09-26 | spec | Spec completed | Acceptance gates satisfied; approved delivery verified: origin/trunk at ${administrative} contains approved candidate ${candidate} [${approvedDigest.slice(0, 12)}] | Documentation impact recorded above | none |`,
      'the existing completion row records the observed ref/SHA and approved candidate/digest');
    assert.equal(after.split('\n').filter((line) => /^\|\s*\d{4}-\d{2}-\d{2}\s*\|/.test(line)).length,
      beforeSuccess.split('\n').filter((line) => /^\|\s*\d{4}-\d{2}-\d{2}\s*\|/.test(line)).length + 1,
      'completion appends exactly one row and no second proof store');
    console.log('ok - S-00J TK-01S: complete refuses without verified approved delivery on the manifest-declared default branch (absent ref, undeclared branch, non-default branch, missing containment, reversal, unreadable content) writing nothing through completeSpec and CLI, and records the pinned ref/SHA and approved candidate/digest on success with a stable digest');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// S-00J TK-01S: an accumulated owner QA scope is the explicitly approved set
// of per-Spec rows at one inspected integration SHA, never every Spec the
// candidate reaches.
{
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-report-approval-scope-'));
  initManagedRoot(root);
  try {
    blueprintAndBoard(root);
    const branch = currentBranch(root);
    declareGit(root, { defaultBranch: branch, integrationBranch: branch });
    const ids = ['S-7F1', 'S-7F2', 'S-7F3'];
    const specFile = (id) => path.join(root, `workbench/specs/${id}-fixture/SPEC.md`);
    for (const id of ids) {
      writeAt(root, `workbench/specs/${id}-fixture/SPEC.md`, tableSpec({ id, taskStatus: 'done', checked: true,
        completion: 'Delivered.', evidenceRow: '| 2026-09-26 | TK-001 | Task closed | tools/test-fixture.mjs pass | none | none |' }));
    }
    const inspected = commitFixture(root);
    for (const id of ids) {
      recordReviewVerdict(root, id, { candidate: inspected, result: 'pass', findings: 'none', reviewer: 'separate fixture context' });
    }
    pinRemoteTracking(root, branch, inspected);

    recordOwnerApproval(root, 'S-7F1', { candidate: inspected, owner: 'Fixture owner', result: 'approve' });
    for (const id of ['S-7F2', 'S-7F3']) {
      const before = fs.readFileSync(specFile(id), 'utf8');
      assert.throws(() => completeSpec(root, id), /no owner Human QA approval is recorded/, `approving S-7F1 alone never authorizes ${id}`);
      assert.equal(fs.readFileSync(specFile(id), 'utf8'), before);
    }
    recordOwnerApproval(root, 'S-7F2', { candidate: inspected, owner: 'Fixture owner', result: 'approve' });
    const s7f3Before = fs.readFileSync(specFile('S-7F3'), 'utf8');
    assert.throws(() => completeSpec(root, 'S-7F3'), /no owner Human QA approval is recorded/,
      'an unlisted Spec at the same inspected SHA stays unapproved');
    assert.equal(fs.readFileSync(specFile('S-7F3'), 'utf8'), s7f3Before);

    // A later B finding prevents B closure.
    recordOwnerApproval(root, 'S-7F2', { candidate: inspected, owner: 'Fixture owner', result: 'finding', destinationChange: 'Fixture destination moved' });
    const s7f2Before = fs.readFileSync(specFile('S-7F2'), 'utf8');
    assert.throws(() => completeSpec(root, 'S-7F2'), /latest owner Human QA for the current content is a finding/);
    assert.equal(fs.readFileSync(specFile('S-7F2'), 'utf8'), s7f2Before);
    // So does a later substantive B change, delivered to the default branch.
    writeAt(root, 'workbench/specs/S-7F2-fixture/SPEC.md', s7f2Before.replace('Expected behavior is verified.', 'Changed behavior is verified.'));
    const changed = commitFixture(root);
    pinRemoteTracking(root, branch, changed);
    const s7f2Changed = fs.readFileSync(specFile('S-7F2'), 'utf8');
    assert.throws(() => completeSpec(root, 'S-7F2'), /all for earlier content/);
    assert.equal(fs.readFileSync(specFile('S-7F2'), 'utf8'), s7f2Changed);

    // Unchanged A retains its own approval and closes against the later ref.
    completeSpec(root, 'S-7F1', { date: '2026-09-26' });
    assert.equal(assembleSpecReport(root, 'S-7F1').status, 'complete');
    assert.match(fs.readFileSync(specFile('S-7F1'), 'utf8'),
      new RegExp(`origin/${branch} at ${changed} contains approved candidate ${inspected}`));
    const ownerRows = (id) => assembleSpecReport(root, id).ownerApproval.map((entry) => entry.result);
    assert.deepEqual(ownerRows('S-7F2'), ['approve', 'finding'], 'no approval is synthesized for B');
    assert.deepEqual(ownerRows('S-7F3'), [], 'no approval is synthesized for unlisted C');
    console.log('ok - S-00J TK-01S: explicit two-Spec approval scope at one inspected SHA: A never authorizes B or unlisted C, a later B finding or substantive change blocks only B, and unchanged A closes with its own approval');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

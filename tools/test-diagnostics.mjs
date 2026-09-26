#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { EFFECTS, SCOPES, SEVERITIES, describe, finding, isRegistered, registeredCodes } from '../workbench/tools/diagnostics.mjs';
import { claimWork, doctor as doctorAll, formatDoctorReport, nextWork, render, DOCTOR_GROUPS } from '../workbench/tools/spec-workbench.mjs';
import { permissionScopeDrift, readRepositoryState } from '../workbench/tools/workbench-layout.mjs';
import { appendReceiptRowToContent } from '../workbench/tools/task-receipt.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const layout = path.join(root, 'workbench', 'tools', 'workbench-layout.mjs');
const specTool = path.join(root, 'workbench', 'tools', 'spec-workbench.mjs');
const wikiTool = path.join(root, 'workbench', 'tools', 'wiki.mjs');
const installer = path.join(root, 'tools', 'core-skill-installer.mjs');
const toolsInstaller = path.join(root, 'tools', 'workbench-tools.mjs');
const skillsInstaller = path.join(root, 'tools', 'workbench-skills.mjs');
const VERSION = JSON.parse(fs.readFileSync(path.join(root, 'workbench', 'manifest.json'), 'utf8')).workbenchVersion;

function fixture() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-diagnostics-'));
}

// Doctor reads the user home for installed skills; fixtures that assert an
// exact finding lists use a healthy isolated core installation so host state stays out.
const quietHome = fixture();
const quietInstalled = spawnSync(process.execPath, [installer, 'install', '--home', quietHome], { cwd: root, encoding: 'utf8' });
assert.equal(quietInstalled.status, 0, quietInstalled.stdout);
process.on('exit', () => fs.rmSync(quietHome, { recursive: true, force: true }));

function write(project, relative, content) {
  const target = path.join(project, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function spec(id, { status = 'active', tasks = '| TK-001 | First slice | ready | none | pending |', updated = '2026-09-04', extra = '' } = {}) {
  return [
    `# ${id} - Capability ${id}`, '', `**Spec ID:** ${id}`, `**Status:** ${status}`, '**Priority:** 0', '**Owner:** fixture',
    `**Updated:** ${updated}`, '**Catalog description:** Fixture.', '**Blockers:** none', '**Latest event:** Captured.', '**Next gate:** Claim TK-001.', '',
    '## Vertical Implementation Slices', '', '| Task | Slice | Status | Blockers | Proof |', '|---|---|---|---|---|', tasks, '',
    '## Acceptance Criteria', '', '- [ ] Verified.', '', '## Append-Only Evidence And Execution Log', '',
    '| Date | Task | Event | Verification | Docs | Remaining gap |', '|---|---|---|---|---|---|', '', '## Completion Result', '', 'Pending.', '', extra, ''
  ].join('\n');
}

const ROUTED_AGENTS = '# Agents\n\n| Truth | Owner |\n|---|---|\n| durable room memory | `workbench/wiki/` (`MEMORY.md` router) |\n';
const ROUTED_README = '# Fixture\n\n- [`workbench/wiki/MEMORY.md`](workbench/wiki/MEMORY.md) - the room brain.\n';

function git(cwd, ...args) {
  const result = spawnSync('git', ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', ...args], { cwd, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}

function project(version = VERSION) {
  const dir = fixture();
  const init = spawnSync(process.execPath, [layout, 'init', '--project', dir, '--provenance', 'genesis', '--version', version], { encoding: 'utf8' });
  assert.equal(init.status, 0, init.stdout);
  // A room lives in a Git repository whose declared integration branch
  // resolves; doctor reports a missing one, which is not the behavior under
  // test in the fixtures that expect an empty report.
  git(dir, 'init', '-q', '-b', 'main');
  git(dir, 'commit', '-q', '--allow-empty', '-m', 'fixture');
  git(dir, 'branch', 'integration');
  // S-00V: a room carries its core skills in the skills lane; doctor reports
  // an uninstalled lane, which is not the behavior under test in the fixtures
  // that expect an empty report.
  const skills = spawnSync(process.execPath, [skillsInstaller, 'install', '--project', dir], { cwd: root, encoding: 'utf8' });
  assert.equal(skills.status, 0, skills.stdout);
  write(dir, 'BLUEPRINT.md', '# Blueprint\n\n<!-- spec-catalog:start -->\n<!-- spec-catalog:end -->\n');
  write(dir, 'TASKBOARD.md', '# Taskboard\n\n<!-- hot-specs:start -->\n<!-- hot-specs:end -->\n');
  // A complete schema 2 project carries its wiki router; doctor reports a
  // missing one, which is not the behavior under test here.
  write(dir, 'workbench/wiki/MEMORY.md', '---\ntype: memory\nstatus: active\nsensitivity: normal\nknowledge_role: canonical\nprovenance:\n  - fixture\nsource_paths:\n  - workbench/wiki\nlast_verified: 2026-09-04\n---\n\n# Fixture Memory\n');
  // The controls route back to the room brain; an unrouted brain is a finding.
  write(dir, 'AGENTS.md', ROUTED_AGENTS);
  write(dir, 'README.md', ROUTED_README);
  return dir;
}

// S-00M TK-002: doctor reports untracked files under the root controls, the
// ADR collection and the spec lane as `untracked-controls` (attention, blocks
// nothing). These fixtures never commit their controls or specs, so that
// finding is correctly present in nearly every one. The tests of other findings
// set aside exactly that code and nothing else - a detached HEAD still shows -
// and the S-00M tests read the unfiltered report through `doctorAll` and
// `cliDoctorAll`.
const withoutUntrackedControls = (findings) => findings && findings.filter((item) => item.code !== 'untracked-controls');

function doctor(dir, options) {
  return withoutUntrackedControls(doctorAll(dir, options));
}

function cliDoctorAll(dir, home = quietHome) {
  const result = spawnSync(process.execPath, [specTool, 'doctor', '--json', '--home', home], { cwd: dir, encoding: 'utf8' });
  return { status: result.status, findings: result.stdout ? JSON.parse(result.stdout) : null, stderr: result.stderr };
}

function cliDoctor(dir, home = quietHome) {
  const result = cliDoctorAll(dir, home);
  return { ...result, findings: withoutUntrackedControls(result.findings) };
}

function assertRegistryRemediation(describeEntry, codes) {
  for (const code of codes) {
    const summary = describeEntry(code).summary;
    assert.ok(typeof summary === 'string' && summary.trim(), `${code} requires remediation text`);
  }
}

test('the registry rejects empty remediation text in a disposable module', async () => {
  const source = fs.readFileSync(path.join(root, 'workbench/tools/diagnostics.mjs'), 'utf8');
  const mutated = source.replace("'an optional transport operation was refused; local note use remains independent'", "''");
  assert.notEqual(mutated, source);
  const registry = await import(`data:text/javascript;base64,${Buffer.from(mutated).toString('base64')}`);
  assert.throws(() => assertRegistryRemediation(registry.describe, registry.registeredCodes()), /session-transport-blocked requires remediation text/);
});

test('the registry is closed, typed, and every emitted code is registered', () => {
  assertRegistryRemediation(describe, registeredCodes());
  for (const code of registeredCodes()) {
    const entry = describe(code);

    assert.ok(SEVERITIES.includes(entry.severity), `${code} severity`);
    assert.ok(SCOPES.includes(entry.scope), `${code} scope`);
    assert.ok(EFFECTS.includes(entry.blocks), `${code} effect`);
    assert.equal(entry.severity === 'attention' ? entry.blocks : 'not-attention', entry.severity === 'attention' ? 'none' : 'not-attention', `${code}: attention never blocks`);
  }
  assert.throws(() => describe('made-up-code'), /Unregistered/);
  assert.equal(isRegistered('stale-claim'), true);
  const source = fs.readFileSync(specTool, 'utf8');
  for (const match of source.matchAll(/finding\('([a-z-]+)'/g)) assert.ok(isRegistered(match[1]), `${match[1]} emitted by spec-workbench must be registered`);
  const layoutSource = fs.readFileSync(layout, 'utf8');
  for (const match of layoutSource.matchAll(/fail\('([a-z-]+)'/g)) {
    if (['manifest-exists', 'invalid-project', 'lane-collision', 'invalid-version', 'invalid-provenance', 'invalid-branch', 'invalid-invocation'].includes(match[1])) continue;
    assert.ok(isRegistered(match[1]), `${match[1]} emitted by workbench-layout must be registered`);
  }
});

test('attention findings stay visible and never change the doctor exit code or hide work', () => {
  const dir = project();
  try {
    write(dir, 'workbench/specs/S-001-stale/SPEC.md', spec('S-001', { tasks: '| TK-001 | First slice | in-progress | none | pending |', updated: '2026-01-01', extra: '[missing](../../missing.md)' }));
    render(dir);
    const findings = doctor(dir, { today: '2026-09-04', home: quietHome });
    assert.deepEqual(findings.map((item) => [item.code, item.severity, item.blocks]).sort(), [['broken-link', 'attention', 'none'], ['stale-claim', 'attention', 'none']]);
    const cli = cliDoctor(dir);
    assert.equal(cli.status, 0, 'attention findings must not fail doctor');
    assert.equal(cli.findings.length, 2);
    assert.equal(nextWork(dir).taskId, 'TK-001', 'attention findings must not hide resumable work');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('selection findings fail doctor and an unsafe manifest blocks everything', () => {
  const dir = project();
  try {
    write(dir, 'workbench/specs/S-001-first/SPEC.md', spec('S-001'));
    render(dir);
    assert.deepEqual(doctor(dir, { home: quietHome }), []);
    write(dir, 'workbench/specs/S-009-duplicate/SPEC.md', spec('S-001'));
    const findings = doctor(dir, { home: quietHome });
    assert.ok(findings.some((item) => item.code === 'duplicate-id' && item.blocks === 'selection'));
    assert.equal(cliDoctor(dir).status, 1, 'a selection finding must fail doctor');
    assert.throws(() => render(dir), /Duplicate spec ID/, 'render refuses an ambiguous identity');
    fs.rmSync(path.join(dir, 'workbench', 'specs', 'S-009-duplicate'), { recursive: true });
    assert.deepEqual(doctor(dir, { home: quietHome }), []);

    const manifestPath = path.join(dir, 'workbench', 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    manifest.schemaVersion = 1;
    fs.writeFileSync(manifestPath, JSON.stringify(manifest));
    const stale = doctor(dir, { home: quietHome });
    assert.deepEqual(stale.map((item) => [item.code, item.blocks]), [['upgrade-required', 'all']]);
    assert.equal(cliDoctor(dir).status, 1);
    assert.throws(() => nextWork(dir), /upgrade-required|schema 1/i, 'next must not select work from an unmigrated layout');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('a selected slice with an unmet dependency is reported, excluded by next, and refused by claim without failing doctor', () => {
  const dir = project();
  try {
    write(dir, 'workbench/specs/S-001-first/SPEC.md', spec('S-001', { tasks: '| TK-001 | Blocked slice | ready | S-999 | pending |' }));
    render(dir);
    const findings = doctor(dir, { home: quietHome });
    assert.deepEqual(findings.map((item) => [item.code, item.severity, item.blocks, item.specId, item.taskId]), [['blocked-slice', 'error', 'selected-slice', 'S-001', 'TK-001']]);
    assert.equal(cliDoctor(dir).status, 0, 'a slice blocker must not fail doctor for unrelated work');
    assert.equal(nextWork(dir), null, 'next must exclude the blocked slice');
    assert.throws(() => claimWork(dir, 'S-001', { agent: 'fixture', date: '2026-09-04' }), /blocked-slice.*S-999|S-999.*blocked-slice/);
    assert.match(fs.readFileSync(path.join(dir, 'workbench', 'specs', 'S-001-first', 'SPEC.md'), 'utf8'), /\| ready \| S-999 \|/, 'a refused claim must not mutate the spec');

    write(dir, 'workbench/specs/S-001-first/SPEC.md', spec('S-001', { tasks: '| TK-001 | First slice | ready | none | pending |\n| TK-002 | Second slice | ready | TK-001 | pending |' }));
    render(dir);
    assert.deepEqual(doctor(dir, { home: quietHome }), [], 'a later task waiting on its predecessor is ordinary sequencing, not a finding');
    assert.equal(nextWork(dir).taskId, 'TK-001');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('a row/record collision is a named row-record-collision finding, not malformed-spec, and does not hide an unrelated finding', () => {
  const dir = project();
  try {
    // A row and a standalone Task record for the same id, in the same Spec:
    // a Spec parses fine on both sources, so this is a distinct, recoverable
    // condition from an unparseable packet - registering it separately from
    // `malformed-spec` lets doctor keep reporting the rest of the room
    // instead of aborting on the first collision it meets.
    write(dir, 'workbench/specs/S-001-first/SPEC.md', spec('S-001', { tasks: '| TK-001 | First slice | ready | none | pending |' }));
    write(dir, 'workbench/specs/S-001-first/tasks/TK-001/TASK.md', [
      '# TK-001 - First slice',
      '',
      '**Task ID:** TK-001',
      '**Spec ID:** S-001',
      '**Slice:** First slice',
      '**Status:** ready',
      '**Blockers:** none',
      '**Destination:** spec-acceptance: S-001 Acceptance Criteria',
      ''
    ].join('\n'));
    // An unrelated stale-claim finding on a second Spec proves the collision
    // is one finding among many rather than a reason to abort the whole run.
    write(dir, 'workbench/specs/S-002-stale/SPEC.md', spec('S-002', {
      tasks: '| TK-001 | Stale slice | in-progress | none | pending |', updated: '2026-01-01'
    }));
    render(dir);
    const findings = doctor(dir, { home: quietHome });
    const collision = findings.find((item) => item.code === 'row-record-collision');
    assert.ok(collision, 'the collision is reported by its own code');
    assert.equal(collision.blocks, 'selection', 'row-record-collision has the selection effect');
    assert.match(collision.message, /S-001 carries both a slice-table row and a Task record for TK-001/);
    assert.ok(!findings.some((item) => item.code === 'malformed-spec'), 'the collision is never reported as malformed-spec');
    assert.ok(findings.some((item) => item.code === 'stale-claim' && item.specId === 'S-002'),
      'an unrelated finding on another spec still surfaces beside the collision');
    assert.throws(() => nextWork(dir), /S-001 carries both a slice-table row and a Task record for TK-001/,
      'selection still refuses to resolve slices through the collision');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

// Review of S-00H TK-003 (9bd14e1, PASS with three Low findings) found that
// identityFindings' cross-spec letter-bearing check walks a Spec's rows and
// records as one combined list per spec before comparing against every other
// spec's ids. A numeric TK-001-shaped id skips that check entirely, so the
// test above never exercised it; a letter-bearing id like TK-00A does not
// skip it, and reading a row TK-00A immediately followed by a record TK-00A
// from the SAME spec means the second occurrence finds the first already
// reserved and reports "Duplicate task ID: S-001/TK-00A conflicts with
// S-001/TK-00A" - the spec colliding with itself - beside the
// row-record-collision finding the adjacent comment says is the one and only
// report for this shape.
test('a letter-bearing row/record collision is reported once, never doubled as a duplicate-id against itself', () => {
  const dir = project();
  try {
    write(dir, 'workbench/specs/S-001-first/SPEC.md', spec('S-001', {
      tasks: '| TK-00A | First slice | done | none | node test |'
    }));
    write(dir, 'workbench/specs/S-001-first/tasks/TK-00A/TASK.md', [
      '# TK-00A - First slice',
      '',
      '**Task ID:** TK-00A',
      '**Spec ID:** S-001',
      '**Slice:** First slice',
      '**Status:** ready',
      '**Blockers:** none',
      '**Destination:** spec-acceptance: S-001 Acceptance Criteria',
      ''
    ].join('\n'));
    render(dir);
    const findings = doctor(dir, { home: quietHome });
    const collisions = findings.filter((item) => item.code === 'row-record-collision');
    assert.equal(collisions.length, 1, 'the collision is reported exactly once');
    assert.match(collisions[0].message, /S-001 carries both a slice-table row and a Task record for TK-00A/);
    assert.ok(
      !findings.some((item) => item.code === 'duplicate-id' && item.specId === 'S-001' && item.taskId === 'TK-00A'),
      'the same row/record pair must never also surface as a duplicate-id conflicting with itself'
    );
    assert.equal(cliDoctor(dir).status, 1, 'row-record-collision is a selection-effect finding, so it fails doctor like any other');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

// S-00H TK-007 corrective: a malformed or altered Receipt on any active
// Task used to make `receiptSignal` throw straight through `renderHotBoard`,
// so `doctor` exited 1 with a raw, uncaught error and reported nothing else,
// and `render` itself crashed instead of writing the board. `receipt-corrupt`
// names the condition as an ordinary finding instead, and render falls back
// to a `(receipt unreadable)` marker in the cell rather than the signal.
test('a corrupted Task Receipt is a named receipt-corrupt finding, never crashes render or doctor, and does not hide an unrelated finding', () => {
  const dir = project();
  try {
    // A record-backed Spec (its retained row is done, so it is not a
    // row/record collision) whose one live Task record carries a Receipt
    // with one row already altered by one byte: the row's checksum no
    // longer matches its recorded fields.
    write(dir, 'workbench/specs/S-001-first/SPEC.md', spec('S-001', { tasks: '| TK-001 | First slice | done | none | node test |' }));
    let corrupted = [
      '# TK-002 - Second slice', '', '**Task ID:** TK-002', '**Spec ID:** S-001', '**Slice:** Second slice',
      '**Status:** in-progress', '**Blockers:** none', '**Destination:** spec-acceptance: S-001 Acceptance Criteria', ''
    ].join('\n');
    corrupted = appendReceiptRowToContent(corrupted, {
      branch: 'claude/x', headSha: 'a'.repeat(40), upstream: 'none', dirty: 0,
      testsRun: 'tools/test-fixture.mjs: pass', docsTouched: 'none', remainingGap: 'none'
    });
    corrupted = corrupted.replace('tools/test-fixture.mjs: pass', 'tools/test-fixture.mjs: TAMPERED');
    write(dir, 'workbench/specs/S-001-first/tasks/TK-002/TASK.md', corrupted);
    // An unrelated finding on a second Spec proves receipt-corrupt is one
    // finding among many rather than a reason to abort the whole run.
    write(dir, 'workbench/specs/S-002-stale/SPEC.md', spec('S-002', {
      tasks: '| TK-001 | Stale slice | in-progress | none | pending |', updated: '2026-01-01'
    }));

    assert.doesNotThrow(() => render(dir), 'render must not crash on a corrupted Receipt; it falls back to a marker instead of the signal');
    const board = fs.readFileSync(path.join(dir, 'TASKBOARD.md'), 'utf8');
    assert.match(board, /TK-002: Second slice \(in-progress; receipt unreadable\)/,
      'the board falls back to a (receipt unreadable) marker in place of the signal');

    const findings = doctor(dir, { home: quietHome });
    const corrupt = findings.find((item) => item.code === 'receipt-corrupt');
    assert.ok(corrupt, 'the corrupted Receipt is reported by its own code, not a raw thrown error');
    assert.equal(corrupt.blocks, 'selection', 'receipt-corrupt has the selection effect');
    assert.equal(corrupt.specId, 'S-001');
    assert.equal(corrupt.taskId, 'TK-002');
    assert.ok(findings.some((item) => item.code === 'stale-claim' && item.specId === 'S-002'),
      'an unrelated finding on another spec still surfaces beside receipt-corrupt');
    assert.equal(cliDoctor(dir).status, 1, 'receipt-corrupt is a selection-effect finding, so it fails doctor like any other');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

function snapshot(directory) {
  const entries = [];
  (function walk(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const target = path.join(current, entry.name);
      const stat = fs.lstatSync(target);
      entries.push([path.relative(directory, target), stat.mode, stat.isFile() ? fs.readFileSync(target, 'utf8') : stat.isDirectory() ? 'dir' : 'other']);
      if (stat.isDirectory()) walk(target);
    }
  })(directory);
  return entries;
}

// S-00V: doctor reads the room's skills lane and discovery adapters, never
// the provider home. An uninstalled lane or a missing core skill is an error
// that blocks nothing (the room repairs it with one release command); a root
// skills/ shadow blocks everything.
test('doctor reports the skills lane from the room, never reads or writes the provider home, and blocks only on a root skills shadow', () => {
  const dir = project(VERSION);
  const home = fixture();
  try {
    write(dir, 'workbench/specs/S-001-first/SPEC.md', spec('S-001'));
    render(dir);
    const before = snapshot(home);
    assert.deepEqual(doctor(dir), [], 'a lane laid down from this release is clean');
    assert.ok(SCOPES.includes('skills'));

    const required = JSON.parse(fs.readFileSync(path.join(dir, 'workbench/manifest.json'))).skillPolicy.required;
    fs.rmSync(path.join(dir, 'workbench', 'skills', 'builder'), { recursive: true, force: true });
    fs.rmSync(path.join(dir, '.claude', 'skills'), { force: true });
    const findings = doctor(dir);
    assert.deepEqual(findings.map((item) => [item.code, item.severity, item.scope, item.blocks, item.skill ?? item.root]).sort(), [
      ['skill-adapter-missing', 'attention', 'skills', 'none', '.claude/skills'],
      ['skill-lane-missing', 'error', 'skills', 'none', 'builder']
    ]);
    assert.deepEqual(snapshot(home), before, 'doctor never touches the home');
    const cli = cliDoctor(dir, home);
    assert.equal(cli.status, 0, 'lane findings are visible and never block selection');
    assert.equal(nextWork(dir).taskId, 'TK-001');

    for (const skill of required) fs.rmSync(path.join(dir, 'workbench', 'skills', skill), { recursive: true, force: true });
    const uninstalled = doctor(dir).filter((item) => item.scope === 'skills');
    assert.deepEqual(uninstalled.map((item) => [item.code, item.blocks]), [['skill-adapter-missing', 'none'], ['skill-lane-missing', 'none']], 'an uninstalled lane is one finding, not one per skill');

    fs.mkdirSync(path.join(dir, 'skills', 'shadow'), { recursive: true });
    const shadowed = cliDoctor(dir, home);
    assert.notEqual(shadowed.status, 0, 'a root skills/ shadow blocks everything');
    assert.ok(shadowed.findings.some((item) => item.code === 'project-local-skills' && item.blocks === 'all'));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(home, { recursive: true, force: true });
  }
});

// The permission file is the mechanical half of the prose Edit Scope. A lane
// the manifest declares that the file withholds is reported by name; the
// finding is registered as nonblocking so a room can deny a lane deliberately.
function permissionFile(buckets) {
  return JSON.stringify({ permissions: { deny: [], ask: [], allow: [], ...buckets } });
}

const authorshipLanes = ['docs', 'specs', 'wiki', 'sessions', 'feedback'];
const laneGrants = authorshipLanes.map((lane) => `Edit(./workbench/${lane}/**)`);

// The managed runtime is checked from the room, not from the release: a room
// carries no installer, so the registered `all` effect of `tools-receipt-drift`
// is only real if doctor itself observes the receipt hashes.
test('a drifted or unreadable managed runtime is a blocking tools finding in the room doctor', () => {
  const dir = project();
  try {
    write(dir, 'workbench/specs/S-001-first/SPEC.md', spec('S-001'));
    render(dir);
    assert.deepEqual(doctor(dir, { home: quietHome }), []);
    const installed = spawnSync(process.execPath, [toolsInstaller, 'install', '--project', dir], { cwd: root, encoding: 'utf8' });
    assert.equal(installed.status, 0, `${installed.stdout}${installed.stderr}`);
    assert.deepEqual(doctor(dir, { home: quietHome }), [], 'an installed runtime that matches its receipt reports nothing');

    const receiptPath = path.join(dir, 'workbench', 'tools', '.workbench-tools.json');
    const receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));

    fs.appendFileSync(path.join(dir, 'workbench', 'tools', 'markdown-table.mjs'), '// locally edited\n');
    const drifted = doctor(dir, { home: quietHome });
    assert.deepEqual(drifted.map((item) => [item.code, item.severity, item.scope, item.blocks]), [['tools-receipt-drift', 'error', 'tools', 'all']]);
    assert.equal(cliDoctor(dir).status, 1, 'an all-effect runtime finding must fail doctor');
    // `all` is a refusal, not only a doctor exit code: a room whose runtime
    // disagrees with its receipt is executing bytes nobody verified, so it
    // must not hand out or claim work either.
    assert.throws(() => nextWork(dir), /tools-receipt-drift/, 'next must refuse to read a drifted layout');
    assert.throws(() => claimWork(dir, 'S-001', { agent: 'fixture', date: '2026-09-04' }), /tools-receipt-drift/, 'claim must refuse a drifted layout');

    // An unreadable receipt must fail visibly rather than silently switching
    // the integrity check off.
    fs.writeFileSync(receiptPath, '{ not json\n');
    assert.deepEqual(doctor(dir, { home: quietHome }).map((item) => [item.code, item.blocks]), [['tools-receipt-missing', 'all']]);

    // Nor may a receipt that parses but records no file hashes: an empty map
    // would switch the check off for every managed file at once, which is the
    // one outcome the drifted case above must never be able to reach.
    fs.writeFileSync(receiptPath, JSON.stringify({ ...receipt, files: {} }));
    assert.deepEqual(doctor(dir, { home: quietHome }).map((item) => [item.code, item.blocks]), [['tools-receipt-missing', 'all']], 'an empty files map is a receipt that records nothing, not a clean runtime');

    // A receipt key names a file inside the managed lane. A key that climbs
    // out of it must never satisfy the lane check with a root control's own
    // true hash.
    const escaping = `..${path.sep}..${path.sep}AGENTS.md`;
    const trueHash = crypto.createHash('sha256').update(fs.readFileSync(path.join(dir, 'AGENTS.md'))).digest('hex');
    fs.writeFileSync(receiptPath, JSON.stringify({ ...receipt, files: { [escaping]: trueHash } }));
    assert.deepEqual(doctor(dir, { home: quietHome }).map((item) => [item.code, item.blocks]), [['tools-receipt-missing', 'all']], 'a receipt key outside the managed lane must be refused, not resolved');

    // Nor may a receipt name every managed file but one. The drift message
    // names the key to delete, so pruning it is the cheapest way to switch the
    // check off for exactly the tampered file. The room compares the receipt's
    // key set with the lane's own contents, which is the only expected set a
    // room can derive without an authoritative list.
    const pruned = { ...receipt.files };
    delete pruned['markdown-table.mjs'];
    fs.writeFileSync(receiptPath, JSON.stringify({ ...receipt, files: pruned }));
    const narrowed = doctor(dir, { home: quietHome });
    assert.deepEqual(narrowed.map((item) => [item.code, item.blocks]), [['tools-receipt-missing', 'all']], 'a receipt pruned of a file the lane still holds verifies less than the runtime it scopes');
    assert.match(narrowed[0].message, /does not account for markdown-table\.mjs/);
    assert.throws(() => nextWork(dir), /tools-receipt-missing/, 'next must refuse a room whose receipt does not cover its lane');
    assert.throws(() => claimWork(dir, 'S-001', { agent: 'fixture', date: '2026-09-04' }), /tools-receipt-missing/, 'claim must refuse it too');

    // A foreign file dropped into the managed lane is the same condition seen
    // from the other side: the lane holds a file no receipt key accounts for.
    fs.writeFileSync(receiptPath, JSON.stringify(receipt));
    fs.copyFileSync(path.join(root, 'workbench', 'tools', 'markdown-table.mjs'), path.join(dir, 'workbench', 'tools', 'markdown-table.mjs'));
    assert.deepEqual(doctor(dir, { home: quietHome }), [], 'the repaired lane is clean again');
    fs.writeFileSync(path.join(dir, 'workbench', 'tools', 'smuggled.mjs'), 'export const smuggled = true;\n');
    assert.deepEqual(doctor(dir, { home: quietHome }).map((item) => [item.code, item.blocks]), [['tools-receipt-missing', 'all']], 'an unreceipted file in the managed lane is reported, not ignored');
    fs.rmSync(path.join(dir, 'workbench', 'tools', 'smuggled.mjs'));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('permission-scope-drift names each withheld authorship lane without blocking doctor', () => {
  const registered = describe('permission-scope-drift');
  assert.deepEqual([registered.severity, registered.scope, registered.blocks], ['error', 'controls', 'none']);
  const dir = project();
  const settings = path.join(dir, '.claude', 'settings.json');
  const driftLanes = (findings) => {
    assert.equal(findings.length, 1, JSON.stringify(findings));
    assert.deepEqual([findings[0].code, findings[0].severity, findings[0].blocks, findings[0].control], ['permission-scope-drift', 'error', 'none', '.claude/settings.json']);
    return findings[0].lanes.map((entry) => entry.lane);
  };
  try {
    write(dir, 'workbench/specs/S-001-first/SPEC.md', spec('S-001'));
    render(dir);
    assert.deepEqual(doctor(dir, { home: quietHome }), [], 'a room without the file is unaffected');

    // The pre-fix template shape: Edit on writable roots, but no Workbench lane.
    write(dir, '.claude/settings.json', permissionFile({ deny: ['Write(./secrets/**)'], ask: ['Bash(git push:*)'], allow: ['Edit(./src/**)', 'Edit(./AGENTS.md)'] }));
    const legacy = doctor(dir, { home: quietHome });
    assert.deepEqual(driftLanes(legacy).sort(), [...authorshipLanes].sort());
    for (const lane of authorshipLanes) assert.match(legacy[0].message, new RegExp(`workbench/${lane}`), `the finding names ${lane}`);
    const cli = cliDoctor(dir);
    assert.equal(cli.status, 0, 'permission drift is reported, never a doctor failure');
    assert.deepEqual(cli.findings.map((item) => item.code), ['permission-scope-drift']);
    assert.equal(nextWork(dir).taskId, 'TK-001', 'the finding must not hide work');

    // The shipped template shape grants every lane.
    fs.copyFileSync(path.join(root, 'templates', '.claude', 'settings.json'), settings);
    assert.deepEqual(doctor(dir, { home: quietHome }), [], 'the fixed template yields no finding');

    // A missing Edit grant, a nested restriction, and a granted tools lane are
    // each drift. Edit rules govern every built-in file editing tool.
    write(dir, '.claude/settings.json', permissionFile({ allow: laneGrants.filter((rule) => rule !== 'Edit(./workbench/wiki/**)') }));
    assert.deepEqual(driftLanes(doctor(dir, { home: quietHome })), ['wiki']);
    write(dir, '.claude/settings.json', permissionFile({ allow: laneGrants, deny: ['Edit(./workbench/docs/**/private.md)'] }));
    const denied = doctor(dir, { home: quietHome });
    assert.deepEqual(driftLanes(denied), ['docs']);
    assert.match(denied[0].lanes[0].reason, /deny/);
    write(dir, '.claude/settings.json', permissionFile({ allow: [...laneGrants, 'Edit(./workbench/tools/**)'] }));
    assert.deepEqual(driftLanes(doctor(dir, { home: quietHome })), ['tools']);

    // ask overrides allow, so a lane granted in both prompts on every write:
    // the unattended stall this spec names, reported as withheld.
    write(dir, '.claude/settings.json', permissionFile({ allow: laneGrants, ask: ['Edit(./workbench/specs/**)'] }));
    const prompted = doctor(dir, { home: quietHome });
    assert.deepEqual(driftLanes(prompted), ['specs']);
    assert.match(prompted[0].lanes[0].reason, /ask/);

    // A null lane declaration falls back to the default lanes instead of throwing.
    assert.equal(permissionScopeDrift(dir, null)?.lanes.map((entry) => entry.lane).join(), 'specs');

    // A covering parent glob grants; the tools lane still needs a covering ask.
    write(dir, '.claude/settings.json', permissionFile({ allow: ['Edit(./workbench/**)'] }));
    assert.deepEqual(driftLanes(doctor(dir, { home: quietHome })), ['tools']);
    write(dir, '.claude/settings.json', permissionFile({ allow: ['Edit(./workbench/**)'], ask: ['Edit(./workbench/tools/**)'] }));
    assert.deepEqual(doctor(dir, { home: quietHome }), [], 'a parent glob with tools held in ask is the accepted shape');

    // A narrow restriction does not protect the rest of a broadly allowed
    // tools lane. Both ask and deny regressions must remain visible.
    write(dir, '.claude/settings.json', permissionFile({ allow: ['Edit(./workbench/**)'], ask: ['Edit(./workbench/tools/private.mjs)'] }));
    assert.deepEqual(driftLanes(doctor(dir, { home: quietHome })), ['tools']);
    write(dir, '.claude/settings.json', permissionFile({ allow: ['Edit(./workbench/**)'], deny: ['Edit(./workbench/tools/private.mjs)'] }));
    assert.deepEqual(driftLanes(doctor(dir, { home: quietHome })), ['tools']);

    // Claude Code's documented bare and project-root Edit forms are valid.
    write(dir, '.claude/settings.json', permissionFile({ allow: ['Edit'], ask: ['Edit(/workbench/tools/**)'] }));
    assert.deepEqual(doctor(dir, { home: quietHome }), [], 'bare Edit grants authorship while a project-root ask protects tools');
    write(dir, '.claude/settings.json', permissionFile({ allow: authorshipLanes.map((lane) => `Edit(/workbench/${lane}/**)`), ask: ['Edit(/workbench/tools/**)'] }));
    assert.deepEqual(doctor(dir, { home: quietHome }), [], 'project-root path rules are supported');

    // Absolute and home-relative restrictions use Claude Code's documented
    // path forms and must not be discarded as unrelated.
    write(dir, '.claude/settings.json', permissionFile({
      allow: laneGrants,
      ask: ['Edit(./workbench/tools/**)'],
      deny: [`Edit(/${path.join(dir, 'workbench', 'specs', '**')})`]
    }));
    assert.deepEqual(driftLanes(doctor(dir, { home: quietHome })), ['specs']);
    const priorHome = process.env.HOME;
    process.env.HOME = path.dirname(dir);
    try {
      write(dir, '.claude/settings.json', permissionFile({
        allow: laneGrants,
        ask: ['Edit(./workbench/tools/**)'],
        deny: [`Edit(~/${path.basename(dir)}/workbench/specs/**)`]
      }));
      assert.deepEqual(driftLanes(doctor(dir, { home: quietHome })), ['specs']);
    } finally {
      if (priorHome === undefined) delete process.env.HOME;
      else process.env.HOME = priorHome;
    }

    // A bare Write restriction is a real tool restriction, while a bounded
    // matcher must surface a restrictive Edit shape it cannot fully interpret.
    write(dir, '.claude/settings.json', permissionFile({ allow: laneGrants, ask: ['Edit(./workbench/tools/**)'], deny: ['Write'] }));
    assert.deepEqual(driftLanes(doctor(dir, { home: quietHome })).sort(), [...authorshipLanes].sort());
    write(dir, '.claude/settings.json', permissionFile({ allow: laneGrants, ask: ['Edit(./workbench/tools/**)'], deny: ['Edit(./workbench/specs/{draft,private}/**)'] }));
    const uncertain = doctor(dir, { home: quietHome });
    assert.deepEqual(driftLanes(uncertain), ['specs']);
    assert.match(uncertain[0].lanes[0].reason, /cannot safely interpret/);

    // Anything the conservative matcher does not recognise is not a grant.
    write(dir, '.claude/settings.json', permissionFile({ allow: laneGrants.map((rule) => rule.replace('/**)', '/*.md)')) }));
    assert.deepEqual(driftLanes(doctor(dir, { home: quietHome })).sort(), [...authorshipLanes].sort());
    write(dir, '.claude/settings.json', '{ not json');
    const unreadable = doctor(dir, { home: quietHome });
    assert.deepEqual(driftLanes(unreadable).sort(), [...authorshipLanes].sort());
    assert.match(unreadable[0].message, /unreadable/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('an unrouted room brain is an attention finding that names the control lacking the route', () => {
  const dir = project();
  try {
    write(dir, 'workbench/specs/S-001-first/SPEC.md', spec('S-001'));
    render(dir);
    assert.deepEqual(doctor(dir, { home: quietHome }), [], 'routed controls are not a finding');
    assert.deepEqual([describe('room-brain-unrouted').severity, describe('room-brain-unrouted').scope, describe('room-brain-unrouted').blocks], ['attention', 'wiki', 'none']);

    write(dir, 'AGENTS.md', '# Agents\n\nNo ownership row here.\n');
    const unrouted = doctor(dir, { home: quietHome });
    assert.deepEqual(unrouted.map((item) => [item.code, item.severity, item.blocks, item.control]), [['room-brain-unrouted', 'attention', 'none', 'AGENTS.md']]);
    assert.match(unrouted[0].message, /AGENTS\.md/);
    assert.match(unrouted[0].message, /workbench\/wiki/);
    const cli = cliDoctor(dir);
    assert.equal(cli.status, 0, 'an unrouted brain never fails doctor');
    assert.ok(cli.findings.some((item) => item.code === 'room-brain-unrouted'));

    write(dir, 'AGENTS.md', ROUTED_AGENTS);
    write(dir, 'README.md', '# Fixture\n\nNo brain link.\n');
    assert.deepEqual(doctor(dir, { home: quietHome }).map((item) => [item.code, item.control]), [['room-brain-unrouted', 'README.md']]);
    fs.rmSync(path.join(dir, 'README.md'));
    assert.deepEqual(doctor(dir, { home: quietHome }).map((item) => [item.code, item.control]), [['room-brain-unrouted', 'README.md']], 'a missing control routes nowhere');

    write(dir, 'README.md', ROUTED_README);
    assert.deepEqual(doctor(dir, { home: quietHome }), [], 'adding the route clears the finding');
    fs.rmSync(path.join(dir, 'workbench', 'wiki', 'MEMORY.md'));
    write(dir, 'AGENTS.md', '# Agents\n');
    assert.deepEqual(doctor(dir, { home: quietHome }).map((item) => item.code), ['invalid-note'], 'without a room brain there is nothing to route to; the missing router is the finding');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('the declared integration branch is checked by doctor as a git-scope error that never blocks selection', () => {
  for (const code of ['integration-branch-undeclared', 'integration-branch-missing']) {
    assert.deepEqual(describe(code), { severity: 'error', scope: 'git', blocks: 'none', summary: describe(code).summary }, code);
    assert.ok(describe(code).summary.length > 0, `${code} carries a summary`);
  }
  assert.ok(SCOPES.includes('git'), 'git is a registered scope');
  const dir = project();
  try {
    write(dir, 'workbench/specs/S-001-first/SPEC.md', spec('S-001'));
    render(dir);
    const manifestPath = path.join(dir, 'workbench', 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert.deepEqual(manifest.git, { defaultBranch: 'main', integrationBranch: 'integration' }, 'init declares the default and integration branches');
    assert.deepEqual(doctor(dir, { home: quietHome }), [], 'a declared branch that resolves locally is not a finding');

    git(dir, 'branch', '-d', 'integration');
    const missing = doctor(dir, { home: quietHome });
    assert.deepEqual(missing.map((item) => [item.code, item.severity, item.scope, item.blocks, item.branch]), [['integration-branch-missing', 'error', 'git', 'none', 'integration']]);
    assert.equal(cliDoctor(dir).status, 0, 'a missing integration branch must not fail doctor');
    assert.equal(nextWork(dir).taskId, 'TK-001', 'a missing integration branch must not hide work');

    git(dir, 'remote', 'add', 'origin', dir);
    git(dir, 'update-ref', 'refs/remotes/origin/integration', 'HEAD');
    assert.deepEqual(doctor(dir, { home: quietHome }), [], 'a declared branch that resolves only on a remote is not a finding');

    delete manifest.git;
    fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    const undeclared = doctor(dir, { home: quietHome });
    assert.deepEqual(undeclared.map((item) => [item.code, item.severity, item.scope, item.blocks]), [['integration-branch-undeclared', 'error', 'git', 'none']]);
    assert.equal(cliDoctor(dir).status, 0, 'an undeclared integration branch must not fail doctor');
    assert.equal(claimWork(dir, 'S-001', { agent: 'fixture', date: '2026-09-04' }).tasks[0].status, 'in-progress', 'claim proceeds without the declaration');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

// S-00M TK-002: doctor surfaces the repository state TK-001's reader sees and
// no other finding observes. ADR-000J registers both findings `attention`
// with blocking effect `none`, so the proof is behavioral as well as
// registered: the same fixture with and without the conditions has the same
// doctor exit code and the same `next --json` selection.
function cliNext(dir) {
  const result = spawnSync(process.execPath, [specTool, 'next', '--json'], { cwd: dir, encoding: 'utf8' });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

test('a detached HEAD and untracked control, ADR and spec-lane files are git-scope attention findings that change neither doctor nor next', () => {
  for (const code of ['detached-head', 'untracked-controls']) {
    assert.deepEqual([describe(code).severity, describe(code).scope, describe(code).blocks], ['attention', 'git', 'none'], code);
    assert.ok(describe(code).summary.length > 0, `${code} carries a summary`);
  }
  const dir = project();
  try {
    write(dir, 'workbench/specs/S-001-first/SPEC.md', spec('S-001'));
    render(dir);
    git(dir, 'add', '-A');
    git(dir, 'commit', '-q', '-m', 'room on main');
    assert.deepEqual(doctorAll(dir, { home: quietHome }), [], 'a clean attached checkout carries no git-state finding');
    const cleanDoctor = cliDoctorAll(dir);
    const cleanNext = cliNext(dir);
    assert.equal(cleanDoctor.status, 0, cleanDoctor.stderr);
    assert.equal(cleanNext.status, 0, cleanNext.stderr);

    git(dir, 'checkout', '-q', '--detach');
    // Untracked files the other validators do not parse, so only the git
    // state differs: a root control, a non-record file in the ADR folder and
    // a non-SPEC file in the spec lane.
    write(dir, 'RUNBOOK.md', '# Runbook\n');
    write(dir, 'workbench/docs/adr/draft-notes.txt', 'draft\n');
    write(dir, 'workbench/specs/S-001-first/notes.md', 'notes\n');

    const findings = doctorAll(dir, { home: quietHome });
    assert.deepEqual(findings.map((item) => [item.code, item.severity, item.scope, item.blocks]),
      [['detached-head', 'attention', 'git', 'none'], ['untracked-controls', 'attention', 'git', 'none']]);
    const detached = findings.find((item) => item.code === 'detached-head');
    assert.match(detached.message, /HEAD is detached/);
    assert.match(detached.message, /inspection state/, 'the message says detached is not a blocker');
    const untracked = findings.find((item) => item.code === 'untracked-controls');
    assert.deepEqual(untracked.files, ['RUNBOOK.md', 'workbench/docs/adr/draft-notes.txt', 'workbench/specs/S-001-first/notes.md']);
    for (const file of untracked.files) assert.ok(untracked.message.includes(file), `the message names ${file}`);

    const dirtyDoctor = cliDoctorAll(dir);
    assert.equal(dirtyDoctor.status, cleanDoctor.status, 'neither finding changes the doctor exit code');
    assert.deepEqual(dirtyDoctor.findings.map((item) => item.code), ['detached-head', 'untracked-controls'], 'the CLI reports both');
    const dirtyNext = cliNext(dir);
    assert.equal(dirtyNext.status, cleanNext.status);
    assert.equal(dirtyNext.stdout, cleanNext.stdout, 'neither finding changes next\'s selection');
    const plain = spawnSync(process.execPath, [specTool, 'doctor', '--home', quietHome], { cwd: dir, encoding: 'utf8' });
    assert.equal(plain.status, 0, plain.stderr);
    assert.match(plain.stdout, /detached-head/);
    assert.match(plain.stdout, /untracked-controls/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('untracked-controls names a long list by its first files and a count', () => {
  const dir = project();
  try {
    git(dir, 'add', '-A');
    git(dir, 'commit', '-q', '-m', 'room on main');
    const names = Array.from({ length: 14 }, (_, index) => `workbench/specs/S-001-first/note-${String(index).padStart(2, '0')}.md`);
    for (const name of names) write(dir, name, 'note\n');
    const [untracked] = doctorAll(dir, { home: quietHome }).filter((item) => item.code === 'untracked-controls');
    assert.ok(untracked, 'the long list is still reported');
    assert.deepEqual(untracked.files, names, 'the finding carries every file');
    assert.ok(untracked.message.includes(names[0]) && !untracked.message.includes(names[13]), 'the message caps the list it prints');
    assert.match(untracked.message, /and 4 more/, 'the message counts what it did not print');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('an unknown repository state yields no git-state finding, never throws and never changes the doctor exit code', () => {
  const dir = fixture();
  const empty = fixture();
  try {
    const init = spawnSync(process.execPath, [layout, 'init', '--project', dir, '--provenance', 'genesis', '--version', VERSION], { encoding: 'utf8' });
    assert.equal(init.status, 0, init.stdout);
    write(dir, 'BLUEPRINT.md', '# Blueprint\n\n<!-- spec-catalog:start -->\n<!-- spec-catalog:end -->\n');
    write(dir, 'TASKBOARD.md', '# Taskboard\n\n<!-- hot-specs:start -->\n<!-- hot-specs:end -->\n');
    write(dir, 'RUNBOOK.md', '# Runbook\n');
    write(dir, 'workbench/specs/S-001-first/SPEC.md', spec('S-001'));
    render(dir);
    // Not a repository: integration-branch-missing already says so.
    const codes = doctorAll(dir, { home: quietHome }).map((item) => item.code);
    assert.ok(codes.includes('integration-branch-missing'), codes.join(','));
    for (const code of ['detached-head', 'untracked-controls']) assert.ok(!codes.includes(code), `${code} must not be guessed outside a repository`);
    const baseline = cliDoctorAll(dir);
    // Git absent from PATH entirely: doctor still runs and reports no git state.
    const noGit = spawnSync(process.execPath, [specTool, 'doctor', '--json', '--home', quietHome], { cwd: dir, encoding: 'utf8', env: { ...process.env, PATH: empty } });
    assert.equal(noGit.status, baseline.status, noGit.stderr);
    const noGitCodes = JSON.parse(noGit.stdout).map((item) => item.code);
    for (const code of ['detached-head', 'untracked-controls']) assert.ok(!noGitCodes.includes(code), `${code} must not be guessed without Git`);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(empty, { recursive: true, force: true });
  }
});

// Review of S-00H TK-003 (9bd14e1, PASS with three Low findings) found the
// bare `catch {}` this replaced would have swallowed any exception thrown
// while resolving `gitFindings`'s own candidate, not only the row/record
// collision the surrounding comment names. The fix names the exact condition
// instead: an audit of every `throw` in spec-workbench.mjs (none reachable
// from `selectCandidate` besides the `sliceConflict` one in `slicesOf`) found
// no other exception the guard could currently be hiding, so this proves the
// guard's precision instead - it must key on `status === 'active'`, the same
// filter `selectCandidate` itself applies, not "any spec anywhere has a
// conflict" - and pins the swallow's removal so a future refactor cannot
// silently reintroduce a blanket catch around this call.
test('gitFindings only skips its candidate lookup for an active row/record collision, and no blanket catch remains around it', () => {
  const source = fs.readFileSync(specTool, 'utf8');
  assert.doesNotMatch(
    source,
    /selectCandidate\(specs\);\s*\n\s*\} catch/,
    'no bare catch may wrap the gitFindings candidate lookup again; a narrow, named guard replaced it'
  );
  assert.match(
    source,
    /hasActiveSliceConflict[\s\S]{0,80}status === 'active'[\s\S]{0,20}sliceConflict/,
    'the guard must name the active-status condition explicitly rather than catching every exception'
  );

  const dir = project();
  try {
    // Two Specs: S-001 is active with an unresolved row/record collision
    // (skips the lookup by name); S-002 is a second active Spec with no
    // collision, whose ready slice `gitFindings` must still be able to
    // resolve through `selectCandidate` normally, proving the guard did not
    // swallow its way past a real candidate.
    write(dir, 'workbench/specs/S-001-first/SPEC.md', spec('S-001'));
    write(dir, 'workbench/specs/S-001-first/tasks/TK-001/TASK.md', [
      '# TK-001 - First slice',
      '',
      '**Task ID:** TK-001',
      '**Spec ID:** S-001',
      '**Slice:** First slice',
      '**Status:** ready',
      '**Blockers:** none',
      '**Destination:** spec-acceptance: S-001 Acceptance Criteria',
      ''
    ].join('\n'));
    render(dir);
    const withCollision = doctor(dir, { home: quietHome });
    assert.ok(withCollision.some((item) => item.code === 'row-record-collision'), 'the collision is still reported');
    assert.equal(cliDoctor(dir).status, 1, 'row-record-collision is a selection-effect finding, so it fails doctor even though the room keeps reporting');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }

  // A non-active (blocked) Spec carrying the same shape of collision is
  // exactly the case `selectCandidate` already skips by its own status
  // filter, so it must not be what the guard keys on either. A separate,
  // genuinely active and uncontested Spec proves the guard did not swallow
  // its way past a real candidate: if the guard keyed on "a collision exists
  // anywhere in the room" rather than "on an active Spec", this candidate
  // would go unresolved even though nothing about it is wrong.
  const isolationDir = project();
  try {
    write(isolationDir, 'workbench/specs/S-002-clean/SPEC.md', spec('S-002'));
    write(isolationDir, 'workbench/specs/S-003-blocked/SPEC.md', spec('S-003', { status: 'blocked' }));
    write(isolationDir, 'workbench/specs/S-003-blocked/tasks/TK-001/TASK.md', [
      '# TK-001 - Blocked slice',
      '',
      '**Task ID:** TK-001',
      '**Spec ID:** S-003',
      '**Slice:** Blocked slice',
      '**Status:** ready',
      '**Blockers:** none',
      '**Destination:** spec-acceptance: S-003 Acceptance Criteria',
      ''
    ].join('\n'));
    render(isolationDir);
    const findings = doctor(isolationDir, { home: quietHome });
    assert.ok(findings.some((item) => item.code === 'row-record-collision' && item.specId === 'S-003'),
      'the blocked spec\'s collision is still reported');
    assert.equal(cliDoctor(isolationDir).status, 1, 'row-record-collision still fails doctor even on a non-active spec');
    assert.equal(nextWork(isolationDir).specId, 'S-002',
      'a collision on a non-active spec must not suppress selection of an unrelated active candidate');
  } finally {
    fs.rmSync(isolationDir, { recursive: true, force: true });
  }
});

test('a selected spec already complete at the declared integration ref is reported as attention and still dispatched', () => {
  assert.deepEqual(describe('complete-on-integration'), { severity: 'attention', scope: 'specs', blocks: 'none', summary: describe('complete-on-integration').summary });
  const dir = project();
  try {
    write(dir, 'workbench/specs/S-001-first/SPEC.md', spec('S-001'));
    render(dir);
    git(dir, 'add', '-A');
    git(dir, 'commit', '-q', '-m', 'S-001 active on the task branch');
    assert.deepEqual(doctor(dir, { home: quietHome }), [], 'an integration ref that does not carry the spec is not a finding');

    git(dir, 'switch', '-q', 'integration');
    git(dir, 'merge', '-q', '--ff-only', 'main');
    write(dir, 'workbench/specs/S-001-first/SPEC.md', spec('S-001', { status: 'complete', tasks: '| TK-001 | First slice | done | none | node test |' }));
    render(dir);
    git(dir, 'add', '-A');
    git(dir, 'commit', '-q', '-m', 'S-001 complete on integration');
    git(dir, 'switch', '-q', 'main');
    assert.match(fs.readFileSync(path.join(dir, 'workbench', 'specs', 'S-001-first', 'SPEC.md'), 'utf8'), /\*\*Status:\*\* active/, 'the checkout still carries the spec active');

    const findings = doctor(dir, { home: quietHome });
    assert.deepEqual(findings.map((item) => [item.code, item.severity, item.scope, item.blocks, item.specId, item.ref]), [['complete-on-integration', 'attention', 'specs', 'none', 'S-001', 'integration']]);
    assert.match(findings[0].message, /S-001.*complete.*integration/);
    assert.equal(cliDoctor(dir).status, 0, 'the finding informs and never fails doctor');
    assert.equal(nextWork(dir).taskId, 'TK-001', 'next still returns the slice; a checkout may be pinned deliberately');

    const tip = git(dir, 'rev-parse', 'integration');
    git(dir, 'update-ref', '-d', 'refs/heads/integration');
    git(dir, 'remote', 'add', 'origin', dir);
    git(dir, 'update-ref', 'refs/remotes/origin/integration', tip);
    const remote = doctor(dir, { home: quietHome });
    assert.deepEqual(remote.map((item) => [item.code, item.ref]), [['complete-on-integration', 'origin/integration']], 'a remote-only integration ref is read without fetching');

    write(dir, 'workbench/specs/S-001-first/SPEC.md', spec('S-001', { status: 'complete', tasks: '| TK-001 | First slice | done | none | node test |' }));
    render(dir);
    assert.deepEqual(doctor(dir, { home: quietHome }), [], 'once the checkout agrees there is nothing to select and nothing to report');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('a room outside any Git work tree is told so instead of being told to create the branch', () => {
  const dir = fixture();
  try {
    const init = spawnSync(process.execPath, [layout, 'init', '--project', dir, '--provenance', 'genesis', '--version', VERSION], { encoding: 'utf8' });
    assert.equal(init.status, 0, init.stdout);
    write(dir, 'BLUEPRINT.md', '# Blueprint\n\n<!-- spec-catalog:start -->\n<!-- spec-catalog:end -->\n');
    write(dir, 'TASKBOARD.md', '# Taskboard\n\n<!-- hot-specs:start -->\n<!-- hot-specs:end -->\n');
    write(dir, 'workbench/wiki/MEMORY.md', '---\ntype: memory\nstatus: active\nsensitivity: normal\nknowledge_role: canonical\nprovenance:\n  - fixture\nsource_paths:\n  - workbench/wiki\nlast_verified: 2026-09-04\n---\n\n# Fixture Memory\n');
    write(dir, 'workbench/specs/S-001-first/SPEC.md', spec('S-001'));
    render(dir);
    // This bare fixture routes no room brain; only the git scope is under test.
    const findings = doctor(dir, { home: quietHome }).filter((item) => item.scope === 'git');
    assert.deepEqual(findings.map((item) => [item.code, item.branch]), [['integration-branch-missing', 'integration']]);
    assert.match(findings[0].message, /not inside a Git work tree/, 'the message names the actual condition');
    assert.doesNotMatch(findings[0].message, /create it from/, 'no repository means no branch to create yet');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

// The registered severity/scope/effect triple for every code the registry
// carries today. A named set rather than a whole-registry equality on purpose:
// it catches a triple that MOVES on an existing code - the risk a presentation
// change carries - while a spec registering a genuinely new code is simply not
// in the set and passes.
//
// Attention codes are pinned here too. An earlier draft left them to the
// invariants below, reasoning that those held them; they did not. A review
// mutation promoted the unpinned `stale-claim` from ('attention','specs','none')
// to ('error','specs','selection') and the pin still passed: `pinnedBlocking`
// is a subset check, so it never notices a code ARRIVING in a blocking effect,
// and the severity invariant passed because the severity moved to `error` in
// the same edit. Promoting an attention code into a blocking effect is exactly
// the change that must not pass unnoticed.
const PINNED_EFFECTS = {
  'invalid-workbench-identity': ['error', 'manifest', 'all'],
  'identity-busy': ['error', 'manifest', 'none'],
  'session-transport-blocked': ['error', 'sessions', 'none'],
  'session-transport-pending': ['attention', 'sessions', 'none'],
  'identity-write-failed': ['error', 'manifest', 'none'],
  'invalid-manifest': ['error', 'manifest', 'all'],
  'upgrade-required': ['error', 'manifest', 'all'],
  'invalid-lane': ['error', 'manifest', 'all'],
  'unsafe-lane': ['error', 'manifest', 'all'],
  'invalid-collection': ['error', 'manifest', 'all'],
  'missing-collection': ['error', 'manifest', 'all'],
  'invalid-skill-policy': ['error', 'manifest', 'all'],
  'invalid-wiki-profile': ['error', 'manifest', 'all'],
  'sessions-not-ignored': ['error', 'sessions', 'all'],
  'tools-receipt-missing': ['error', 'tools', 'all'],
  'tools-receipt-drift': ['error', 'tools', 'all'],
  'invalid-source-identity': ['error', 'tools', 'all'],
  'unfilled-control': ['error', 'controls', 'all'],
  'unsafe-control': ['error', 'controls', 'all'],
  'version-mismatch': ['error', 'controls', 'all'],
  'missing-first-spec': ['error', 'specs', 'all'],
  'invalid-first-spec': ['error', 'specs', 'all'],
  'project-local-skills': ['error', 'controls', 'all'],
  'malformed-spec': ['error', 'specs', 'selection'],
  'duplicate-id': ['error', 'specs', 'selection'],
  'invalid-state': ['error', 'specs', 'selection'],
  'contradictory-state': ['error', 'specs', 'selection'],
  'unstable-path': ['error', 'specs', 'selection'],
  'missing-evidence': ['error', 'specs', 'selection'],
  'render-drift': ['error', 'specs', 'selection'],
  'broken-render-target': ['error', 'specs', 'selection'],
  'row-record-collision': ['error', 'specs', 'selection'],
  'receipt-corrupt': ['error', 'specs', 'selection'],
  'blocked-slice': ['error', 'specs', 'selected-slice'],
  'invalid-adr': ['error', 'adr', 'none'],
  'untracked-provenance': ['error', 'adr', 'none'],
  'invalid-note': ['error', 'wiki', 'none'],
  'copied-task-state': ['error', 'wiki', 'none'],
  'secret-like-content': ['error', 'wiki', 'none'],
  'duplicate-identity': ['error', 'sessions', 'none'],
  'stale-revision': ['error', 'sessions', 'none'],
  'malformed-json': ['error', 'sessions', 'none'],
  'legacy-schema': ['error', 'sessions', 'none'],
  'retained-dependency': ['error', 'sessions', 'none'],
  'write-failed': ['error', 'sessions', 'none'],
  'promotion-recovery-required': ['error', 'sessions', 'none'],
  'integration-branch-undeclared': ['error', 'git', 'none'],
  'integration-branch-missing': ['error', 'git', 'none'],
  // S-00M TK-002 (ADR-000J): repository state a completion claim can hide is
  // visible in every doctor run and never blocks; detached is an inspection
  // state, and untracked lane files are the close check's business (TK-003).
  'detached-head': ['attention', 'git', 'none'],
  'untracked-controls': ['attention', 'git', 'none'],
  'permission-scope-drift': ['error', 'controls', 'none'],
  'stale-claim': ['attention', 'specs', 'none'],
  'complete-on-integration': ['attention', 'specs', 'none'],
  'broken-link': ['attention', 'specs', 'none'],
  'unknown-blocker-qualifier': ['error', 'specs', 'none'],
  'stale-register': ['attention', 'adr', 'none'],
  'disagreeing-status': ['attention', 'adr', 'none'],
  'retired-not-complete': ['attention', 'specs', 'none'],
  'retired-task-not-done': ['attention', 'specs', 'none'],
  'retired-wiki-owner-stale': ['attention', 'specs', 'none'],
  'discarded-reference': ['error', 'specs', 'selection'],
  'stale-note': ['attention', 'wiki', 'none'],
  'room-brain-unrouted': ['attention', 'wiki', 'none'],
  'stale-stamp': ['attention', 'wiki', 'none'],
  // S-00V: the lane findings mirror `integration-branch-missing` - an error
  // every run shows that blocks nothing, repaired by one release command.
  'skill-lane-missing': ['error', 'skills', 'none'],
  'skill-lane-unreadable': ['error', 'skills', 'none'],
  'skill-adapter-missing': ['attention', 'skills', 'none'],
  'skill-adapter-broken': ['attention', 'skills', 'none'],
  'skill-duplicate-discovery': ['attention', 'skills', 'none'],
  'stale-seed': ['attention', 'feedback', 'none'],
  'unverified-provenance': ['attention', 'manifest', 'none'],
  // S-00V TK-00H: a missing host floor item blocks everything, but it is only
  // ever emitted by the session-start `doctor --host` invocation, never by
  // plain doctor, next or claim.
  'host-floor-unmet': ['error', 'host', 'all']
};

test('the registered effect of every blocking code is pinned, and no attention code blocks', () => {
  for (const [code, triple] of Object.entries(PINNED_EFFECTS)) {
    assert.ok(isRegistered(code), `${code} must stay registered`);
    const entry = describe(code);
    assert.deepEqual([entry.severity, entry.scope, entry.blocks], triple, `${code} effect moved`);
  }
  const pinnedBlocking = Object.entries(PINNED_EFFECTS).filter(([, triple]) => triple[2] !== 'none').map(([code]) => code).sort();
  const registeredBlocking = registeredCodes().filter((code) => describe(code).blocks !== 'none').sort();
  for (const code of pinnedBlocking) assert.ok(registeredBlocking.includes(code), `${code} must still stop work`);
  for (const code of registeredBlocking) {
    assert.equal(describe(code).severity, 'error', `${code} blocks work, so it cannot be attention severity`);
  }
});

// S-045 TK-006: the assertions above are all subset checks, in both directions
// - every pinned code is registered, and every registered blocking code is an
// error. Neither notices a code that is registered and simply never pinned.
// Two arrived that way after S-043: `stale-seed` and `unverified-provenance`
// were registered in `diagnostics.mjs` and left outside `PINNED_EFFECTS`. Be
// precise about what that did and did not cost, because the spec criterion that
// asked for this test overstated it, and the first correction of that criterion
// overstated it again. Moving either code's severity or scope was NOT silent:
// the emitted-finding assertion for that code holds both, so every valid move
// failed exactly one test even without a pin, and fails two now. (Moving one to
// severity `warning` fails two without a pin, but only because `warning` is not
// in SEVERITIES, so the enum test fires too - an enum failure, not a pin one.)
// What nothing held is a code that is registered and never pinned at all:
// adding one failed zero tests before this assertion existed. That is the gap
// set equality closes - red at registration, before the code can be emitted.
test('every registered diagnostic code is pinned, so registering one without a pin is red', () => {
  assert.deepEqual(registeredCodes().slice().sort(), Object.keys(PINNED_EFFECTS).sort(),
    'PINNED_EFFECTS must equal the registry exactly: pin the new code with its severity, scope and effect');
});

test('doctor plain output groups findings by consequence, counts each group, and prints blocking findings first', () => {
  const mixed = [
    finding('skill-adapter-missing', '.claude/skills is absent, so that host cannot discover workbench/skills'),
    finding('blocked-slice', 'S-001 TK-001 names S-999'),
    finding('invalid-adr', 'ADR-0001 is missing required frontmatter'),
    finding('duplicate-id', 'two packets claim S-001')
  ];
  assert.equal(formatDoctorReport(mixed), [
    'blocking (1) - doctor exits 1 until repaired',
    '  duplicate-id [blocks selection, error]: two packets claim S-001',
    'selected slice (1) - next excludes the slice and claim refuses it',
    '  blocked-slice [blocks selected-slice, error]: S-001 TK-001 names S-999',
    'informational (2) - reported only; nothing is blocked',
    '  skill-adapter-missing [blocks none, attention]: .claude/skills is absent, so that host cannot discover workbench/skills',
    '  invalid-adr [blocks none, error]: ADR-0001 is missing required frontmatter'
  ].join('\n'), 'a blocking finding must not be buried among findings that block nothing');

  assert.equal(formatDoctorReport([]), 'ok - spec workbench doctor passed');
  assert.equal(formatDoctorReport(mixed.filter((item) => item.blocks === 'none')), [
    'informational (2) - reported only; nothing is blocked',
    '  skill-adapter-missing [blocks none, attention]: .claude/skills is absent, so that host cannot discover workbench/skills',
    '  invalid-adr [blocks none, error]: ADR-0001 is missing required frontmatter',
    'ok - no blocking finding; attention and slice findings above stay visible'
  ].join('\n'), 'a room whose findings block nothing still says so on the last line');

  // An effect outside the groups would silently vanish from the report; the
  // renderer fails visibly instead of printing a report that omits a finding.
  assert.throws(() => formatDoctorReport([{ code: 'made-up', severity: 'error', blocks: 'somewhere-else', message: 'x' }]), /somewhere-else/);
});

test('doctor renders the same findings as grouped text and byte-unchanged --json', () => {
  const dir = project();
  try {
    write(dir, 'workbench/specs/S-001-first/SPEC.md', spec('S-001', { tasks: '| TK-001 | Blocked slice | ready | S-999 | pending |', extra: '[missing](../../missing.md)' }));
    render(dir);
    write(dir, 'workbench/specs/S-009-duplicate/SPEC.md', spec('S-001'));
    // The byte comparison below is against the whole report, so this reads it
    // unfiltered, untracked-controls included.
    const findings = doctorAll(dir, { home: quietHome });
    assert.ok(findings.some((item) => item.blocks === 'selection'), 'the fixture must carry a blocking finding');
    assert.ok(findings.some((item) => item.blocks === 'none'), 'the fixture must carry a non-blocking finding');

    // The machine contract: --json is exactly the serialized finding array,
    // untouched by anything the text report does.
    const json = spawnSync(process.execPath, [specTool, 'doctor', '--json', '--home', quietHome], { cwd: dir, encoding: 'utf8' });
    assert.equal(json.stdout, `${JSON.stringify(findings, null, 2)}\n`, '--json output must be byte-unchanged');

    const text = spawnSync(process.execPath, [specTool, 'doctor', '--home', quietHome], { cwd: dir, encoding: 'utf8' });
    assert.equal(text.status, 1, 'grouping must not change which findings fail doctor');
    const groups = new Map();
    let current = null;
    for (const line of text.stdout.trimEnd().split('\n')) {
      const header = /^(?<name>[a-z ]+) \((?<count>\d+)\) - /.exec(line);
      if (header) {
        current = header.groups.name;
        groups.set(current, { count: Number(header.groups.count), codes: [] });
      } else if (line.startsWith('  ')) {
        groups.get(current).codes.push(line.trim().split(' ')[0]);
      } else {
        assert.fail(`unexpected line in a failing doctor report: ${line}`);
      }
    }
    for (const [name, group] of groups) assert.equal(group.count, group.codes.length, `${name} count must match its rows`);
    assert.deepEqual([...groups.keys()], ['blocking', 'selected slice', 'informational'].filter((name) => groups.has(name)), 'blocking findings come first');
    assert.deepEqual(groups.get('blocking').codes.sort(), findings.filter((item) => ['all', 'selection'].includes(item.blocks)).map((item) => item.code).sort());
    assert.deepEqual(groups.get('informational').codes.sort(), findings.filter((item) => item.blocks === 'none').map((item) => item.code).sort());
    assert.equal([...groups.values()].reduce((total, group) => total + group.codes.length, 0), findings.length, 'every finding stays in the report');
    for (const line of text.stdout.split('\n')) {
      if (line.startsWith('  ')) assert.match(line, /\[blocks (all|selection|selected-slice|none), (error|attention)\]: /, 'every row keeps its code, effect, severity, and message');
    }
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

// Every registered effect must be reportable. formatDoctorReport throws on an
// effect that matches no group, and that throw reaches main().catch, which
// prints the error and NO findings - including real blocking ones. So adding a
// value to EFFECTS without a group is a total doctor outage, and nothing else
// in the suite notices: the throw's only other cover passes a hand-made object
// rather than the vocabulary.
test('every registered diagnostic effect lands in exactly one doctor group', () => {
  for (const effect of EFFECTS) {
    const groups = DOCTOR_GROUPS.filter((group) => group.effects.includes(effect));
    assert.equal(groups.length, 1, `effect ${effect} must land in exactly one doctor group, found ${groups.length}`);
  }
  for (const group of DOCTOR_GROUPS) {
    for (const effect of group.effects) {
      assert.ok(EFFECTS.includes(effect), `doctor group ${group.title} names ${effect}, which is not a registered effect`);
    }
  }
});


// S-042 TK-001: seeded lane documents are the third class of installed state.
// Their generation lives in a seed record beside the manifest, never in the
// byte-managed tools receipt, so a local adjustment stays legal.
test('a seeded lane document whose recorded generation is behind the manifest is reported and never blocks', () => {
  const dir = project();
  try {
    write(dir, 'workbench/specs/S-001-first/SPEC.md', spec('S-001'));
    render(dir);
    assert.deepEqual(doctor(dir, { home: quietHome }), [], 'a room with no seed record names no generation and reports nothing');
    const seedRun = spawnSync(process.execPath, [layout, 'seed-documents', '--project', dir], { encoding: 'utf8' });
    assert.equal(seedRun.status, 0, seedRun.stdout);
    assert.deepEqual(JSON.parse(seedRun.stdout).written.filter(entry => entry.document === 'workbench/feedback/REPORT_FORMAT.md'), [{ document: 'workbench/feedback/REPORT_FORMAT.md', action: 'seeded' }]);
    const record = path.join(dir, 'workbench', '.workbench-seed.json');
    assert.equal(fs.existsSync(record), true, 'seed-documents records the generation of each seeded lane document');
    const seeded = JSON.parse(fs.readFileSync(record, 'utf8'));
    assert.equal(fs.existsSync(path.join(dir, 'workbench', 'feedback', 'REPORT_FORMAT.md')), true, 'seed-documents copies the feedback report format');
    assert.equal(seeded.documents['workbench/feedback/REPORT_FORMAT.md'].release, VERSION);
    assert.deepEqual(doctor(dir, { home: quietHome }), [], 'a document seeded from the manifest release reports nothing');
    seeded.documents['workbench/feedback/REPORT_FORMAT.md'].release = 'v3.1.0';
    fs.writeFileSync(record, `${JSON.stringify(seeded, null, 2)}\n`);
    const findings = doctor(dir, { home: quietHome });
    assert.deepEqual(findings.map((item) => [item.code, item.severity, item.scope, item.blocks, item.document]), [['stale-seed', 'attention', 'feedback', 'none', 'workbench/feedback/REPORT_FORMAT.md']]);
    assert.match(findings[0].message, /v3\.1\.0/);
    assert.ok(findings[0].message.includes(VERSION), 'the message names the manifest version');
    assert.equal(cliDoctor(dir).status, 0, 'a seeded document behind the manifest never blocks selection');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

// S-042 TK-003: a manifest whose recorded source identity is a placeholder or
// disagrees with its own release cannot reproduce the installation it claims.
test('placeholder and version-mismatched manifest provenance are reported without blocking', () => {
  const dir = project();
  try {
    write(dir, 'workbench/specs/S-001-first/SPEC.md', spec('S-001'));
    render(dir);
    assert.deepEqual(doctor(dir, { home: quietHome }), [], 'a room initialized from a verified checkout reports nothing');
    const manifestPath = path.join(dir, 'workbench', 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const recorded = manifest.provenance.source;
    manifest.provenance.source = { ...recorded, commit: 'unknown' };
    fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    const placeholder = doctor(dir, { home: quietHome });
    assert.deepEqual(placeholder.map((item) => [item.code, item.severity, item.scope, item.blocks]), [['unverified-provenance', 'attention', 'manifest', 'none']]);
    assert.match(placeholder[0].message, /commit/);

    manifest.provenance.source = { ...recorded, release: 'v3.1.0' };
    fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    const mismatch = doctor(dir, { home: quietHome });
    assert.deepEqual(mismatch.map((item) => item.code), ['unverified-provenance']);
    assert.match(mismatch[0].message, /v3\.1\.0/);
    assert.ok(mismatch[0].message.includes(VERSION), 'the message names the manifest release it disagrees with');
    assert.equal(cliDoctor(dir).status, 0, 'unverified provenance is reported and never blocks selection');

    manifest.provenance.source = recorded;
    fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    assert.deepEqual(doctor(dir, { home: quietHome }), [], 'restoring the recorded identity clears the finding');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

// S-045 TK-002: both findings are installed-state facts - a seeded lane
// document's generation and the manifest's recorded source identity. Neither is
// a wiki fact. They were emitted from `validateWiki` because doctor wired only
// two support-root validators and `spec-workbench.mjs` was held by a sibling
// branch, which S-042 recorded as interim placement. `wiki.mjs validate` is the
// seam that proves the scope: it must report what the wiki lane knows and
// nothing else, while doctor still reports both.
test('the installed-state findings are emitted from a seam whose scope matches, not from the wiki validator', () => {
  const dir = project();
  try {
    write(dir, 'workbench/specs/S-001-first/SPEC.md', spec('S-001'));
    render(dir);

    const seedRun = spawnSync(process.execPath, [layout, 'seed-documents', '--project', dir], { encoding: 'utf8' });
    assert.equal(seedRun.status, 0, seedRun.stdout);
    const record = path.join(dir, 'workbench', '.workbench-seed.json');
    const seeded = JSON.parse(fs.readFileSync(record, 'utf8'));
    seeded.documents['workbench/feedback/REPORT_FORMAT.md'].release = 'v3.1.0';
    fs.writeFileSync(record, `${JSON.stringify(seeded, null, 2)}\n`);

    const manifestPath = path.join(dir, 'workbench', 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    manifest.provenance.source = { ...manifest.provenance.source, release: 'v3.1.0' };
    fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

    const wiki = spawnSync(process.execPath, [wikiTool, 'validate', '--path', dir, '--json'], { encoding: 'utf8' });
    const reported = JSON.parse(wiki.stdout).map((item) => item.code);
    assert.equal(reported.includes('stale-seed'), false,
      'a seeded feedback-lane document is not a wiki fact');
    assert.equal(reported.includes('unverified-provenance'), false,
      'the manifest source identity is not a wiki fact');

    const codes = doctor(dir, { home: quietHome }).map((item) => item.code).sort();
    assert.deepEqual(codes, ['stale-seed', 'unverified-provenance'],
      'doctor still reports both, from the hook whose scope matches them');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

// S-00M TK-001: one non-throwing reader of the repository state a completion
// claim can hide - detached HEAD, dirty tracked files, untracked files under
// the controls, ADR and spec lanes, and upstream distance. It has no caller
// yet; TK-002 surfaces it in doctor and TK-003 checks it at close.
function stateFixture() {
  const base = fixture();
  const remote = path.join(base, 'remote.git');
  const repo = path.join(base, 'repo');
  const other = path.join(base, 'other');
  git(base, 'init', '-q', '--bare', '-b', 'main', remote);
  git(base, 'init', '-q', '-b', 'main', repo);
  git(repo, 'config', 'user.name', 'Fixture');
  git(repo, 'config', 'user.email', 'fixture@example.invalid');
  // The spec lane is declared somewhere other than the default, so a reader
  // that hardcodes `workbench/specs` classifies the wrong file.
  write(repo, 'workbench/manifest.json', `${JSON.stringify({ schemaVersion: 2, lanes: { specs: 'workbench/specifications' } }, null, 2)}\n`);
  write(repo, 'AGENTS.md', '# Agents\n');
  write(repo, 'gone.txt', 'tracked, then deleted\n');
  git(repo, 'add', '-A');
  git(repo, 'commit', '-q', '-m', 'base');
  git(repo, 'remote', 'add', 'origin', remote);
  git(repo, 'push', '-q', '-u', 'origin', 'main');
  // One commit the remote has and the checkout lacks.
  git(base, 'clone', '-q', remote, other);
  write(other, 'remote-only.txt', 'pushed elsewhere\n');
  git(other, 'add', '-A');
  git(other, 'commit', '-q', '-m', 'remote side');
  git(other, 'push', '-q', 'origin', 'main');
  git(repo, 'fetch', '-q', 'origin');
  // One commit the checkout has and the remote lacks.
  write(repo, 'local-only.txt', 'not pushed\n');
  git(repo, 'add', '-A');
  git(repo, 'commit', '-q', '-m', 'local side');
  return { base, repo, remote };
}

test('readRepositoryState reports branch, dirty tracked files, untracked lane files and upstream distance', () => {
  const { base, repo } = stateFixture();
  try {
    write(repo, 'AGENTS.md', '# Agents\n\nmodified\n');
    write(repo, 'staged.txt', 'staged\n');
    git(repo, 'add', 'staged.txt');
    fs.rmSync(path.join(repo, 'gone.txt'));
    write(repo, 'RUNBOOK.md', '# Runbook\n');
    write(repo, 'workbench/docs/adr/0001-untracked.md', '# ADR\n');
    write(repo, 'workbench/specifications/S-001-untracked/SPEC.md', '# Spec\n');
    write(repo, 'workbench/specs/stray.md', 'not the declared spec lane\n');
    write(repo, 'nested/AGENTS.md', 'not a root control\n');
    write(repo, 'notes/outside.md', 'outside every lane\n');

    const state = readRepositoryState(repo);
    assert.equal(state.known, true, JSON.stringify(state));
    assert.deepEqual(state.head, { detached: false, branch: 'main' });
    assert.deepEqual(state.dirty, ['AGENTS.md', 'gone.txt', 'staged.txt']);
    assert.deepEqual(state.untracked, {
      controls: ['RUNBOOK.md'],
      adr: ['workbench/docs/adr/0001-untracked.md'],
      specs: ['workbench/specifications/S-001-untracked/SPEC.md']
    });
    assert.deepEqual(state.upstream, { name: 'origin/main', gone: false, ahead: 1, behind: 1 });
  } finally {
    fs.rmSync(base, { recursive: true, force: true });
  }
});

test('readRepositoryState reports a detached HEAD, a branch with no upstream, and a gone upstream explicitly', () => {
  const { base, repo, remote } = stateFixture();
  try {
    git(repo, 'checkout', '-q', '--detach');
    const detached = readRepositoryState(repo);
    assert.equal(detached.known, true, JSON.stringify(detached));
    assert.deepEqual(detached.head, { detached: true, branch: null });
    assert.equal(detached.upstream, null, 'a detached HEAD tracks no upstream');
    assert.deepEqual(detached.dirty, []);
    assert.deepEqual(detached.untracked, { controls: [], adr: [], specs: [] });

    git(repo, 'switch', '-q', '-c', 'feature');
    const unpublished = readRepositoryState(repo);
    assert.deepEqual(unpublished.head, { detached: false, branch: 'feature' });
    assert.equal(unpublished.upstream, null, 'no upstream is reported as null, never as zero distance');

    git(repo, 'push', '-q', '-u', 'origin', 'feature');
    git(repo, 'push', '-q', 'origin', '--delete', 'feature');
    git(repo, 'fetch', '-q', '--prune', 'origin');
    const gone = readRepositoryState(repo);
    assert.deepEqual(gone.upstream, { name: 'origin/feature', gone: true, ahead: null, behind: null });
    assert.ok(fs.existsSync(remote));
  } finally {
    fs.rmSync(base, { recursive: true, force: true });
  }
});

// S-00M TK-003: `close` refuses on exactly the state the Receipt's own Dirty
// column counts (every `git status --porcelain` line, so untracked files
// outside the three lanes too) and on a HEAD no remote-tracking ref contains.
// These fields are additive; TK-001's shapes above are unchanged.
test('readRepositoryState reports every other untracked file, the configured remotes, and whether any remote-tracking ref contains HEAD', () => {
  const { base, repo, remote } = stateFixture();
  try {
    write(repo, 'RUNBOOK.md', '# Runbook\n');
    write(repo, 'notes/outside.md', 'outside every lane\n');
    write(repo, 'nested/AGENTS.md', 'not a root control\n');
    const ahead = readRepositoryState(repo);
    assert.equal(ahead.known, true, JSON.stringify(ahead));
    assert.deepEqual(ahead.untrackedOther, ['nested/AGENTS.md', 'notes/outside.md'],
      'untracked files outside the controls, ADR and spec lanes are listed, lane files are not repeated');
    assert.deepEqual(ahead.untracked, { controls: ['RUNBOOK.md'], adr: [], specs: [] });
    assert.deepEqual(ahead.remotes, ['origin']);
    assert.equal(ahead.pushed, false, 'a local commit ahead of its upstream is not pushed');

    git(repo, 'pull', '-q', '--rebase', 'origin', 'main');
    git(repo, 'push', '-q', 'origin', 'main');
    assert.equal(readRepositoryState(repo).pushed, true, 'HEAD contained in origin/main is pushed');

    // A new branch with no upstream at a commit a remote already has is
    // pushed: the commit is recoverable, which is what the refusal protects.
    git(repo, 'switch', '-q', '-c', 'topic');
    const topic = readRepositoryState(repo);
    assert.equal(topic.upstream, null);
    assert.equal(topic.pushed, true, 'a commit another remote-tracking ref contains is pushed, upstream or not');
    git(repo, 'commit', '-q', '--allow-empty', '-m', 'topic only');
    assert.equal(readRepositoryState(repo).pushed, false, 'a commit no remote-tracking ref contains is unpushed');

    git(repo, 'checkout', '-q', '--detach');
    assert.equal(readRepositoryState(repo).pushed, false, 'a detached HEAD at an unpushed commit is unpushed');

    git(repo, 'remote', 'remove', 'origin');
    const noRemote = readRepositoryState(repo);
    assert.deepEqual(noRemote.remotes, []);
    assert.equal(noRemote.pushed, false, 'a room with no remote has nothing pushed');
    assert.ok(fs.existsSync(remote));

    const unborn = path.join(base, 'unborn');
    git(base, 'init', '-q', '-b', 'main', unborn);
    const empty = readRepositoryState(unborn);
    assert.equal(empty.known, true, JSON.stringify(empty));
    assert.equal(empty.pushed, false, 'a HEAD with no commit yet is unpushed, not a throw');
  } finally {
    fs.rmSync(base, { recursive: true, force: true });
  }
});

test('readRepositoryState reports unknown, never throwing, outside a repository or where Git is absent', () => {
  const outside = fixture();
  const { base, repo } = stateFixture();
  const savedPath = process.env.PATH;
  try {
    assert.deepEqual(Object.keys(readRepositoryState(outside)).sort(), ['detail', 'known', 'reason']);
    assert.equal(readRepositoryState(outside).known, false);
    assert.equal(readRepositoryState(outside).reason, 'not-a-repository');
    assert.equal(readRepositoryState(path.join(outside, 'missing')).reason, 'not-a-repository');
    assert.equal(readRepositoryState(undefined).known, false, 'a malformed argument is unknown, not a throw');

    const absent = readRepositoryState(repo, { git: path.join(outside, 'no-such-git') });
    assert.equal(absent.known, false);
    assert.equal(absent.reason, 'git-unavailable');

    // The real lookup, with no Git reachable on PATH.
    process.env.PATH = outside;
    const noPath = readRepositoryState(repo);
    process.env.PATH = savedPath;
    assert.equal(noPath.known, false);
    assert.equal(noPath.reason, 'git-unavailable');

    // A manifest the lane helpers cannot read is unknown too, not a throw.
    write(repo, 'workbench/manifest.json', '{ not json');
    const unreadable = readRepositoryState(repo);
    assert.equal(unreadable.known, false);
    assert.equal(unreadable.reason, 'lanes-unresolved');
  } finally {
    process.env.PATH = savedPath;
    fs.rmSync(outside, { recursive: true, force: true });
    fs.rmSync(base, { recursive: true, force: true });
  }
});

// S-00V TK-00H: the session-start host floor check. Every probe is injected, so
// no test here reads the real Node or Python version, runs git or gh, or
// touches the network; plain doctor must never call a probe at all.
const hostFloorModule = await import('../workbench/tools/host-floor.mjs').catch((error) => ({ loadError: error }));
const specWorkbenchModule = await import('../workbench/tools/spec-workbench.mjs');

function healthyProbes(overrides = {}) {
  return {
    node: () => 'v18.0.0',
    python: () => 'Python 3.9.0',
    git: () => 'git version 2.39.3',
    gh: () => ({ version: 'gh version 2.40.0', authenticated: true, repository: 'Fixture/room', push: true }),
    network: () => ({ reachable: true, detail: 'https://github.com answered HTTP 200' }),
    ...overrides
  };
}

function hostFloorApi() {
  assert.equal(hostFloorModule.loadError, undefined, `workbench/tools/host-floor.mjs must load: ${hostFloorModule.loadError?.message}`);
  assert.equal(typeof specWorkbenchModule.doctorCommand, 'function', 'spec-workbench exports doctorCommand, the CLI doctor seam');
  return { ...hostFloorModule, doctorCommand: specWorkbenchModule.doctorCommand };
}

test('the host floor check reports every floor item with pass and its observed value', () => {
  const { checkHostFloor, formatHostFloor, HOST_FLOOR } = hostFloorApi();
  assert.deepEqual(HOST_FLOOR.map((item) => item.item), ['node', 'python', 'git', 'gh', 'network']);
  assert.ok(SCOPES.includes('host'), 'host is a registered scope');
  const floor = checkHostFloor(root, { probes: healthyProbes() });
  assert.deepEqual(floor.findings, [], 'a host at the floor raises nothing');
  assert.deepEqual(floor.items.map((item) => [item.item, item.pass]), [['node', true], ['python', true], ['git', true], ['gh', true], ['network', true]]);
  const observed = Object.fromEntries(floor.items.map((item) => [item.item, item.observed]));
  assert.equal(observed.node, 'v18.0.0');
  assert.equal(observed.python, 'Python 3.9.0');
  assert.equal(observed.git, 'git version 2.39.3');
  assert.match(observed.gh, /gh version 2\.40\.0/);
  assert.match(observed.gh, /authenticated/);
  assert.match(observed.gh, /push to Fixture\/room/);
  assert.match(observed.network, /HTTP 200/);
  const text = formatHostFloor(floor.items);
  for (const item of floor.items) assert.match(text, new RegExp(`pass ${item.item}: `), `${item.item} appears in the report with its result`);
});

test('each missing floor item in turn raises the registered all finding, and doctor fails only in the --host invocation', () => {
  const { checkHostFloor, formatHostFloor, doctorCommand } = hostFloorApi();
  const cases = {
    node: { node: () => 'v17.9.1' },
    python: { python: () => 'Python 3.8.18' },
    git: { git: () => null },
    gh: { gh: () => ({ version: 'gh version 2.40.0', authenticated: false, repository: 'Fixture/room', push: null }) },
    network: { network: () => ({ reachable: false, detail: 'getaddrinfo ENOTFOUND github.com' }) }
  };
  const dir = project();
  try {
    write(dir, 'workbench/specs/S-001-first/SPEC.md', spec('S-001'));
    render(dir);
    for (const [item, override] of Object.entries(cases)) {
      const probes = healthyProbes(override);
      const floor = checkHostFloor(dir, { probes });
      assert.deepEqual(floor.findings.map((entry) => [entry.code, entry.severity, entry.scope, entry.blocks, entry.item]), [['host-floor-unmet', 'error', 'host', 'all', item]], `${item} missing`);
      assert.equal(floor.items.find((entry) => entry.item === item).pass, false);
      assert.match(formatHostFloor(floor.items), new RegExp(`fail ${item}: `), `${item} is reported as failed`);
      const hosted = doctorCommand(dir, { host: true, probes });
      assert.equal(hosted.exitCode, 1, `doctor --host exits non-zero when ${item} is missing`);
      // The fixture also carries unrelated attention findings (S-00M's
      // untracked-controls, for one); only the host findings are pinned here.
      assert.deepEqual(hosted.findings.filter((entry) => entry.scope === 'host').map((entry) => entry.code), ['host-floor-unmet']);
      assert.deepEqual(hosted.json.floor.map((entry) => entry.item), ['node', 'python', 'git', 'gh', 'network'], 'the JSON report carries every floor item');
      assert.match(hosted.text, new RegExp(`fail ${item}: `));
      assert.match(hosted.text, /host-floor-unmet \[blocks all, error\]/);
      const plain = doctorCommand(dir, { probes });
      assert.equal(plain.exitCode, 0, `plain doctor is untouched by a missing ${item}`);
      assert.ok(Array.isArray(plain.json), 'plain doctor JSON stays the bare finding array');
      assert.equal(plain.json.some((entry) => entry.scope === 'host'), false, 'plain doctor raises no host finding');
    }
    assert.equal(doctorCommand(dir, { host: true, probes: healthyProbes() }).exitCode, 0, 'a host at the floor passes doctor --host');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('the floor thresholds are Node 18, Python 3.9, and gh push rights to a GitHub remote', () => {
  const { checkHostFloor } = hostFloorApi();
  const result = (overrides, item) => checkHostFloor(root, { probes: healthyProbes(overrides) }).items.find((entry) => entry.item === item);
  assert.equal(result({ node: () => 'v18.0.0' }, 'node').pass, true);
  assert.equal(result({ node: () => 'v22.11.0' }, 'node').pass, true);
  assert.equal(result({ node: () => 'v17.9.1' }, 'node').pass, false);
  assert.equal(result({ python: () => 'Python 3.9.0' }, 'python').pass, true);
  assert.equal(result({ python: () => 'Python 3.12.4' }, 'python').pass, true);
  assert.equal(result({ python: () => 'Python 3.8.18' }, 'python').pass, false);
  assert.equal(result({ python: () => 'Python 2.7.18' }, 'python').pass, false);
  assert.equal(result({ python: () => null }, 'python').observed, 'not found');
  const gh = (fact) => result({ gh: () => ({ version: 'gh version 2.40.0', authenticated: true, repository: 'Fixture/room', push: true, ...fact }) }, 'gh');
  assert.equal(gh({ push: false }).pass, false, 'authenticated without push rights is below the floor');
  assert.match(gh({ push: false }).observed, /no push rights to Fixture\/room/);
  assert.equal(gh({ repository: null, push: null }).pass, false, 'a room with no GitHub remote cannot prove push rights');
  assert.match(gh({ repository: null, push: null }).observed, /no GitHub remote/);
  assert.equal(gh({ version: null, authenticated: false, repository: null, push: null }).observed, 'not found');
});

test('plain doctor never calls a host probe, and a failing probe is a visible fail, never a crash', () => {
  const { checkHostFloor, doctorCommand } = hostFloorApi();
  const exploding = Object.fromEntries(['node', 'python', 'git', 'gh', 'network'].map((item) => [item, () => { throw new Error(`${item} probe was called`); }]));
  const dir = project();
  try {
    write(dir, 'workbench/specs/S-001-first/SPEC.md', spec('S-001'));
    render(dir);
    const plain = doctorCommand(dir, { probes: exploding });
    assert.equal(plain.exitCode, 0, 'plain doctor stays offline and deterministic');
    assert.equal(plain.floor, null);
    assert.deepEqual(doctor(dir, { probes: exploding }), []);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  const floor = checkHostFloor(root, { probes: healthyProbes({ network: () => { throw new Error('offline fixture'); } }) });
  const network = floor.items.find((entry) => entry.item === 'network');
  assert.equal(network.pass, false);
  assert.match(network.observed, /probe failed: offline fixture/);
  assert.deepEqual(floor.findings.map((entry) => entry.item), ['network']);
});

test('every code the host floor module emits is registered', () => {
  const source = fs.readFileSync(path.join(root, 'workbench', 'tools', 'host-floor.mjs'), 'utf8');
  const emitted = [...source.matchAll(/finding\(\s*'([a-z-]+)'/g)].map((match) => match[1]);
  assert.ok(emitted.length > 0, 'the host floor module emits its finding through the registry');
  for (const code of emitted) assert.ok(isRegistered(code), `${code} emitted by host-floor must be registered`);
});

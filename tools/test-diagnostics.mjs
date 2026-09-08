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
import { claimWork, doctor, formatDoctorReport, nextWork, render, DOCTOR_GROUPS } from '../workbench/tools/spec-workbench.mjs';
import { permissionScopeDrift } from '../workbench/tools/workbench-layout.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const layout = path.join(root, 'workbench', 'tools', 'workbench-layout.mjs');
const specTool = path.join(root, 'workbench', 'tools', 'spec-workbench.mjs');
const wikiTool = path.join(root, 'workbench', 'tools', 'wiki.mjs');
const installer = path.join(root, 'tools', 'core-skill-installer.mjs');
const toolsInstaller = path.join(root, 'tools', 'workbench-tools.mjs');
const VERSION = JSON.parse(fs.readFileSync(path.join(root, 'workbench', 'manifest.json'), 'utf8')).workbenchVersion;

function fixture() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-diagnostics-'));
}

// Doctor reads the user home for installed skills; fixtures that assert an
// exact finding list read an empty disposable home so host state stays out.
const quietHome = fixture();
process.on('exit', () => fs.rmSync(quietHome, { recursive: true, force: true }));

function write(project, relative, content) {
  const target = path.join(project, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function spec(id, { status = 'active', tickets = '| TK-001 | First slice | ready | none | pending |', updated = '2026-09-04', extra = '' } = {}) {
  return [
    `# ${id} - Capability ${id}`, '', `**Spec ID:** ${id}`, `**Status:** ${status}`, '**Priority:** 0', '**Owner:** fixture',
    `**Updated:** ${updated}`, '**Catalog description:** Fixture.', '**Blockers:** none', '**Latest event:** Captured.', '**Next gate:** Claim TK-001.', '',
    '## Vertical Implementation Slices', '', '| Ticket | Slice | Status | Blockers | Proof |', '|---|---|---|---|---|', tickets, '',
    '## Acceptance Criteria', '', '- [ ] Verified.', '', '## Append-Only Evidence And Execution Log', '',
    '| Date | Ticket | Event | Verification | Docs | Remaining gap |', '|---|---|---|---|---|---|', '', '## Completion Result', '', 'Pending.', '', extra, ''
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

function cliDoctor(dir, home = quietHome) {
  const result = spawnSync(process.execPath, [specTool, 'doctor', '--json', '--home', home], { cwd: dir, encoding: 'utf8' });
  return { status: result.status, findings: result.stdout ? JSON.parse(result.stdout) : null, stderr: result.stderr };
}

test('the registry is closed, typed, and every emitted code is registered', () => {
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
    write(dir, 'workbench/specs/S-001-stale/SPEC.md', spec('S-001', { tickets: '| TK-001 | First slice | in-progress | none | pending |', updated: '2026-01-01', extra: '[missing](../../missing.md)' }));
    render(dir);
    const findings = doctor(dir, { today: '2026-09-04', home: quietHome });
    assert.deepEqual(findings.map((item) => [item.code, item.severity, item.blocks]).sort(), [['broken-link', 'attention', 'none'], ['stale-claim', 'attention', 'none']]);
    const cli = cliDoctor(dir);
    assert.equal(cli.status, 0, 'attention findings must not fail doctor');
    assert.equal(cli.findings.length, 2);
    assert.equal(nextWork(dir).ticketId, 'TK-001', 'attention findings must not hide resumable work');
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
    write(dir, 'workbench/specs/S-001-first/SPEC.md', spec('S-001', { tickets: '| TK-001 | Blocked slice | ready | S-999 | pending |' }));
    render(dir);
    const findings = doctor(dir, { home: quietHome });
    assert.deepEqual(findings.map((item) => [item.code, item.severity, item.blocks, item.specId, item.ticketId]), [['blocked-slice', 'error', 'selected-slice', 'S-001', 'TK-001']]);
    assert.equal(cliDoctor(dir).status, 0, 'a slice blocker must not fail doctor for unrelated work');
    assert.equal(nextWork(dir), null, 'next must exclude the blocked slice');
    assert.throws(() => claimWork(dir, 'S-001', { agent: 'fixture', date: '2026-09-04' }), /blocked-slice.*S-999|S-999.*blocked-slice/);
    assert.match(fs.readFileSync(path.join(dir, 'workbench', 'specs', 'S-001-first', 'SPEC.md'), 'utf8'), /\| ready \| S-999 \|/, 'a refused claim must not mutate the spec');

    write(dir, 'workbench/specs/S-001-first/SPEC.md', spec('S-001', { tickets: '| TK-001 | First slice | ready | none | pending |\n| TK-002 | Second slice | ready | TK-001 | pending |' }));
    render(dir);
    assert.deepEqual(doctor(dir, { home: quietHome }), [], 'a later ticket waiting on its predecessor is ordinary sequencing, not a finding');
    assert.equal(nextWork(dir).ticketId, 'TK-001');
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

test('doctor --home reports a stale or unknown installed skill generation per required skill, never writes to the home, and reads schema 1 as unknown', () => {
  const dir = project(VERSION);
  const home = fixture();
  try {
    write(dir, 'workbench/specs/S-001-first/SPEC.md', spec('S-001'));
    render(dir);
    const installed = spawnSync(process.execPath, [installer, 'install', '--home', home], { cwd: root, encoding: 'utf8' });
    assert.equal(installed.status, 0, installed.stdout);
    assert.deepEqual(doctor(dir, { home }), [], 'a freshly installed bundle from this release is neither stale nor unknown');

    const staleMarker = path.join(home, '.claude', 'skills', 'genesis', '.workbench-skill.json');
    fs.writeFileSync(staleMarker, JSON.stringify({ ...JSON.parse(fs.readFileSync(staleMarker, 'utf8')), release: 'v0.0.0' }));
    fs.rmSync(path.join(home, '.agents', 'skills', 'builder', '.workbench-skill.json'));
    fs.writeFileSync(path.join(home, '.agents', 'skills', 'reviewer', '.workbench-skill.json'), '{"schemaVersion":1,"source":"LLM Workbench core"}\n');
    // A schema 2 marker from another source is not a Workbench generation even when it names the manifest release.
    fs.writeFileSync(path.join(home, '.claude', 'skills', 'auditor', '.workbench-skill.json'), `${JSON.stringify({ schemaVersion: 2, source: 'someone else', release: VERSION, commit: 'unknown', contentHash: 'x' })}\n`);
    const before = snapshot(home);

    const findings = doctor(dir, { home });

    assert.deepEqual(findings.map((item) => [item.code, item.severity, item.scope, item.blocks, item.skill, item.root]).sort(), [
      ['skill-generation-unknown', 'attention', 'skills', 'none', 'auditor', '.claude/skills'],
      ['skill-generation-unknown', 'attention', 'skills', 'none', 'builder', '.agents/skills'],
      ['skill-generation-unknown', 'attention', 'skills', 'none', 'reviewer', '.agents/skills'],
      ['stale-skill', 'attention', 'skills', 'none', 'genesis', '.claude/skills']
    ]);
    assert.equal(findings.find((item) => item.code === 'stale-skill').release, 'v0.0.0');
    assert.match(findings.find((item) => item.code === 'stale-skill').message, /v0\.0\.0.*v\d+\.\d+\.\d+|v\d+\.\d+\.\d+.*v0\.0\.0/);
    assert.deepEqual(snapshot(home), before, 'doctor never writes to the home');
    const cli = cliDoctor(dir, home);
    assert.equal(cli.status, 0, 'skill findings are attention and never block');
    assert.equal(cli.findings.length, 4);
    assert.equal(nextWork(dir).ticketId, 'TK-001');
    assert.ok(SCOPES.includes('skills'));
    assert.deepEqual(doctor(dir, { home: quietHome }), [], 'a missing skill is Adoption preflight\'s finding, not doctor\'s');
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
    assert.equal(nextWork(dir).ticketId, 'TK-001', 'the finding must not hide work');

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
    assert.equal(nextWork(dir).ticketId, 'TK-001', 'a missing integration branch must not hide work');

    git(dir, 'remote', 'add', 'origin', dir);
    git(dir, 'update-ref', 'refs/remotes/origin/integration', 'HEAD');
    assert.deepEqual(doctor(dir, { home: quietHome }), [], 'a declared branch that resolves only on a remote is not a finding');

    delete manifest.git;
    fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    const undeclared = doctor(dir, { home: quietHome });
    assert.deepEqual(undeclared.map((item) => [item.code, item.severity, item.scope, item.blocks]), [['integration-branch-undeclared', 'error', 'git', 'none']]);
    assert.equal(cliDoctor(dir).status, 0, 'an undeclared integration branch must not fail doctor');
    assert.equal(claimWork(dir, 'S-001', { agent: 'fixture', date: '2026-09-04' }).tickets[0].status, 'in-progress', 'claim proceeds without the declaration');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
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
    write(dir, 'workbench/specs/S-001-first/SPEC.md', spec('S-001', { status: 'complete', tickets: '| TK-001 | First slice | done | none | node test |' }));
    render(dir);
    git(dir, 'add', '-A');
    git(dir, 'commit', '-q', '-m', 'S-001 complete on integration');
    git(dir, 'switch', '-q', 'main');
    assert.match(fs.readFileSync(path.join(dir, 'workbench', 'specs', 'S-001-first', 'SPEC.md'), 'utf8'), /\*\*Status:\*\* active/, 'the checkout still carries the spec active');

    const findings = doctor(dir, { home: quietHome });
    assert.deepEqual(findings.map((item) => [item.code, item.severity, item.scope, item.blocks, item.specId, item.ref]), [['complete-on-integration', 'attention', 'specs', 'none', 'S-001', 'integration']]);
    assert.match(findings[0].message, /S-001.*complete.*integration/);
    assert.equal(cliDoctor(dir).status, 0, 'the finding informs and never fails doctor');
    assert.equal(nextWork(dir).ticketId, 'TK-001', 'next still returns the slice; a checkout may be pinned deliberately');

    const tip = git(dir, 'rev-parse', 'integration');
    git(dir, 'update-ref', '-d', 'refs/heads/integration');
    git(dir, 'remote', 'add', 'origin', dir);
    git(dir, 'update-ref', 'refs/remotes/origin/integration', tip);
    const remote = doctor(dir, { home: quietHome });
    assert.deepEqual(remote.map((item) => [item.code, item.ref]), [['complete-on-integration', 'origin/integration']], 'a remote-only integration ref is read without fetching');

    write(dir, 'workbench/specs/S-001-first/SPEC.md', spec('S-001', { status: 'complete', tickets: '| TK-001 | First slice | done | none | node test |' }));
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
  'integration-branch-undeclared': ['error', 'git', 'none'],
  'integration-branch-missing': ['error', 'git', 'none'],
  'permission-scope-drift': ['error', 'controls', 'none'],
  'stale-claim': ['attention', 'specs', 'none'],
  'complete-on-integration': ['attention', 'specs', 'none'],
  'broken-link': ['attention', 'specs', 'none'],
  'stale-register': ['attention', 'adr', 'none'],
  'stale-note': ['attention', 'wiki', 'none'],
  'room-brain-unrouted': ['attention', 'wiki', 'none'],
  'stale-stamp': ['attention', 'wiki', 'none'],
  'stale-skill': ['attention', 'skills', 'none'],
  'skill-generation-unknown': ['attention', 'skills', 'none'],
  'stale-seed': ['attention', 'feedback', 'none'],
  'unverified-provenance': ['attention', 'manifest', 'none']
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
    finding('skill-generation-unknown', '.claude/skills/auditor has no schema 2 marker'),
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
    '  skill-generation-unknown [blocks none, attention]: .claude/skills/auditor has no schema 2 marker',
    '  invalid-adr [blocks none, error]: ADR-0001 is missing required frontmatter'
  ].join('\n'), 'a blocking finding must not be buried among findings that block nothing');

  assert.equal(formatDoctorReport([]), 'ok - spec workbench doctor passed');
  assert.equal(formatDoctorReport(mixed.filter((item) => item.blocks === 'none')), [
    'informational (2) - reported only; nothing is blocked',
    '  skill-generation-unknown [blocks none, attention]: .claude/skills/auditor has no schema 2 marker',
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
    write(dir, 'workbench/specs/S-001-first/SPEC.md', spec('S-001', { tickets: '| TK-001 | Blocked slice | ready | S-999 | pending |', extra: '[missing](../../missing.md)' }));
    render(dir);
    write(dir, 'workbench/specs/S-009-duplicate/SPEC.md', spec('S-001'));
    const findings = doctor(dir, { home: quietHome });
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
    assert.deepEqual(JSON.parse(seedRun.stdout).written, [{ document: 'workbench/feedback/REPORT_FORMAT.md', action: 'seeded' }]);
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

#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { EFFECTS, SCOPES, SEVERITIES, describe, isRegistered, registeredCodes } from '../workbench/tools/diagnostics.mjs';
import { claimWork, doctor, nextWork, render } from '../workbench/tools/spec-workbench.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const layout = path.join(root, 'workbench', 'tools', 'workbench-layout.mjs');
const specTool = path.join(root, 'workbench', 'tools', 'spec-workbench.mjs');

function fixture() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-diagnostics-'));
}

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

function project() {
  const dir = fixture();
  const init = spawnSync(process.execPath, [layout, 'init', '--project', dir, '--provenance', 'genesis', '--version', 'v3.0.0'], { encoding: 'utf8' });
  assert.equal(init.status, 0, init.stdout);
  write(dir, 'BLUEPRINT.md', '# Blueprint\n\n<!-- spec-catalog:start -->\n<!-- spec-catalog:end -->\n');
  write(dir, 'TASKBOARD.md', '# Taskboard\n\n<!-- hot-specs:start -->\n<!-- hot-specs:end -->\n');
  // A complete schema 2 project carries its wiki router; doctor reports a
  // missing one, which is not the behavior under test here.
  write(dir, 'workbench/wiki/MEMORY.md', '---\ntype: memory\nstatus: active\nsensitivity: normal\nknowledge_role: canonical\nprovenance:\n  - fixture\nsource_paths:\n  - workbench/wiki\nlast_verified: 2026-09-04\n---\n\n# Fixture Memory\n');
  return dir;
}

function cliDoctor(dir) {
  const result = spawnSync(process.execPath, [specTool, 'doctor', '--json'], { cwd: dir, encoding: 'utf8' });
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
    if (['manifest-exists', 'invalid-project', 'lane-collision', 'invalid-version', 'invalid-provenance', 'invalid-invocation'].includes(match[1])) continue;
    assert.ok(isRegistered(match[1]), `${match[1]} emitted by workbench-layout must be registered`);
  }
});

test('attention findings stay visible and never change the doctor exit code or hide work', () => {
  const dir = project();
  try {
    write(dir, 'workbench/specs/S-001-stale/SPEC.md', spec('S-001', { tickets: '| TK-001 | First slice | in-progress | none | pending |', updated: '2026-01-01', extra: '[missing](../../missing.md)' }));
    render(dir);
    const findings = doctor(dir, { today: '2026-09-04' });
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
    assert.deepEqual(doctor(dir), []);
    write(dir, 'workbench/specs/S-009-duplicate/SPEC.md', spec('S-001'));
    const findings = doctor(dir);
    assert.ok(findings.some((item) => item.code === 'duplicate-id' && item.blocks === 'selection'));
    assert.equal(cliDoctor(dir).status, 1, 'a selection finding must fail doctor');
    assert.throws(() => render(dir), /Duplicate spec ID/, 'render refuses an ambiguous identity');
    fs.rmSync(path.join(dir, 'workbench', 'specs', 'S-009-duplicate'), { recursive: true });
    assert.deepEqual(doctor(dir), []);

    const manifestPath = path.join(dir, 'workbench', 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    manifest.schemaVersion = 1;
    fs.writeFileSync(manifestPath, JSON.stringify(manifest));
    const stale = doctor(dir);
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
    const findings = doctor(dir);
    assert.deepEqual(findings.map((item) => [item.code, item.severity, item.blocks, item.specId, item.ticketId]), [['blocked-slice', 'error', 'selected-slice', 'S-001', 'TK-001']]);
    assert.equal(cliDoctor(dir).status, 0, 'a slice blocker must not fail doctor for unrelated work');
    assert.equal(nextWork(dir), null, 'next must exclude the blocked slice');
    assert.throws(() => claimWork(dir, 'S-001', { agent: 'fixture', date: '2026-09-04' }), /blocked-slice.*S-999|S-999.*blocked-slice/);
    assert.match(fs.readFileSync(path.join(dir, 'workbench', 'specs', 'S-001-first', 'SPEC.md'), 'utf8'), /\| ready \| S-999 \|/, 'a refused claim must not mutate the spec');

    write(dir, 'workbench/specs/S-001-first/SPEC.md', spec('S-001', { tickets: '| TK-001 | First slice | ready | none | pending |\n| TK-002 | Second slice | ready | TK-001 | pending |' }));
    render(dir);
    assert.deepEqual(doctor(dir), [], 'a later ticket waiting on its predecessor is ordinary sequencing, not a finding');
    assert.equal(nextWork(dir).ticketId, 'TK-001');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

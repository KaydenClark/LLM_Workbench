#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import * as workbench from '../workbench/tools/spec-workbench.mjs';
import { newAdr, listAdrs, validateAdrs, writeRegister } from '../workbench/tools/adr.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const version = JSON.parse(fs.readFileSync(path.join(root, 'workbench/manifest.json'))).workbenchVersion;
function room() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'visible-consumers-'));
  const init = spawnSync(process.execPath, [path.join(root, 'workbench/tools/workbench-layout.mjs'), 'init', '--project', dir, '--provenance', 'genesis', '--version', version], { encoding: 'utf8' });
  assert.equal(init.status, 0, init.stdout);
  fs.writeFileSync(path.join(dir, 'AGENTS.md'), '# Rules\n');
  fs.writeFileSync(path.join(dir, 'BLUEPRINT.md'), '# Blueprint\n\n<!-- spec-catalog:start -->\n<!-- spec-catalog:end -->\n');
  fs.writeFileSync(path.join(dir, 'TASKBOARD.md'), '# Taskboard\n\n<!-- hot-specs:start -->\n<!-- hot-specs:end -->\n');
  return dir;
}
function spec(dir, id, tickets = [['TK-001', 'ready', 'none']], status = 'active', slug = 'fixture') {
  const destination = path.join(dir, 'workbench/specs', `${id}-${slug}`, 'SPEC.md');
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, `# ${id} - Identity fixture\n\n**Spec ID:** ${id}\n**Status:** ${status}\n**Priority:** 1\n**Owner:** test\n**Updated:** 2026-09-08\n**Catalog description:** Verify identity consumers.\n**Blockers:** none\n**Latest event:** Fixture created.\n**Next gate:** Verify the slice.\n\n## Vertical Implementation Slices\n\n| Ticket | Slice | Status | Blockers | Proof |\n|---|---|---|---|---|\n${tickets.map(([ticket, state, blocker]) => `| ${ticket} | Verify ${ticket} | ${state} | ${blocker} | ${state === 'done' ? 'verified fixture' : 'pending'} |`).join('\n')}\n\n## Acceptance Criteria\n\n- [x] Fixture verified.\n\n## Append-Only Evidence And Execution Log\n\n| Date | Ticket | Event | Verification | Docs | Remaining gap |\n|---|---|---|---|---|---|\n\n## Completion Result\n\nVerified fixture.\n`);
  return destination;
}
function cli(dir, args) {
  const result = spawnSync(process.execPath, [path.join(root, 'workbench/tools/spec-workbench.mjs'), ...args, '--path', dir, '--json'], { encoding: 'utf8' });
  return { ...result, json: result.stdout.trim() ? JSON.parse(result.stdout) : null };
}

test('mixed visible spec/ticket IDs select, claim, close and render without moving legacy paths', () => {
  const dir = room();
  try {
    const legacy = spec(dir, 'S-010', [['TK-001', 'done', 'none']], 'complete');
    spec(dir, 'S-011', [['TK-001', 'done', 'none']], 'complete');
    const before = fs.readFileSync(legacy);
    const candidate = spec(dir, 'S-00A', [['TK-00A', 'ready', 'none'], ['TK-00B', 'ready', 'TK-00A']]);
    workbench.render(dir);
    assert.equal(workbench.nextWork(dir).specId, 'S-00A');
    assert.equal(workbench.nextWork(dir).ticketId, 'TK-00A');
    workbench.claimWork(dir, 'S-00A', { agent: 'test' });
    workbench.closeTicket(dir, 'S-00A', { proof: 'Verified public seam', docs: 'Docs checked', remainingGap: 'Second slice' });
    assert.equal(workbench.nextWork(dir).ticketId, 'TK-00B');
    assert.equal(workbench.showSpec(dir, 'S-00A').path, path.relative(dir, candidate).split(path.sep).join('/'));
    assert.deepEqual(fs.readFileSync(legacy), before);
    assert.ok(!workbench.doctor(dir).some(issue => ['duplicate-id', 'malformed-spec', 'unstable-path'].includes(issue.code)));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('new ticket allocation reserves repeated legacy labels across the whole Workbench', () => {
  const dir = room();
  try {
    spec(dir, 'S-001'); spec(dir, 'S-002');
    const before = fs.readFileSync(path.join(dir, 'workbench/specs/S-001-fixture/SPEC.md'));
    const result = cli(dir, ['next-id', 'S-001', '--prefix', 'TK']);
    assert.equal(result.status, 0, result.stdout || result.stderr);
    assert.equal(result.json.id, 'TK-00A');
    assert.equal(result.json.reserved, false, 'read-only proposal does not reserve or create a ticket');
    assert.deepEqual(fs.readFileSync(path.join(dir, 'workbench/specs/S-001-fixture/SPEC.md')), before);
    assert.equal(cli(dir, ['next-id', '--prefix', 'S']).json.id, 'S-00A');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

for (const collision of ['spec', 'ticket']) {
  test(`${collision} identity aliases refuse selection without rewriting history`, () => {
    const dir = room();
    try {
      spec(dir, 'S-00A', [['TK-00A', 'ready', 'none']], 'active', 'first');
      spec(dir, collision === 'spec' ? 'S-00a' : 'S-00B', [[collision === 'ticket' ? 'TK-00a' : 'TK-00B', 'ready', 'none']], 'active', 'second');
      assert.throws(() => workbench.nextWork(dir), /duplicate.*ID|identity collision/i);
      assert.ok(workbench.doctor(dir).some(issue => issue.code === 'duplicate-id'));
    } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  });
}

test('ADR allocation, register and duplicate checks consume mixed labels without renaming old files', () => {
  const dir = room();
  const content = '---\nstatus: proposed\ndate: 2026-09-08\ncanonicalized_in:\n  - AGENTS.md\n---\n\n# A decision\n\nProvenance: fixture.\n';
  try {
    const folder = path.join(dir, 'workbench/docs/adr');
    for (let i = 1; i <= 10; i++) fs.writeFileSync(path.join(folder, `${String(i).padStart(4, '0')}-legacy.md`), content);
    const old = fs.readFileSync(path.join(folder, '0010-legacy.md'));
    const created = newAdr(dir, { title: 'Mixed visible identity', date: '2026-09-08' });
    assert.equal(created.number, '000A');
    writeRegister(dir);
    assert.ok(listAdrs(dir).some(adr => adr.number === '000A'));
    assert.match(fs.readFileSync(path.join(folder, 'REGISTER.md'), 'utf8'), /000A-mixed-visible-identity/);
    assert.deepEqual(fs.readFileSync(path.join(folder, '0010-legacy.md')), old);
    fs.writeFileSync(path.join(folder, '000a-collision.md'), content);
    assert.ok(validateAdrs(dir).some(issue => issue.code === 'invalid-adr' && /used by|collision/.test(issue.message)));
    assert.throws(() => newAdr(dir, { title: 'Refuse collision' }), /collision/i);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('numeric ticket aliases in different legacy specs reserve one label without blocking a new proposal', () => {
  const dir = room();
  try {
    spec(dir, 'S-001', [['TK-001', 'ready', 'none']]);
    const second = spec(dir, 'S-002', [['TK-0001', 'ready', 'none']]);
    const original = fs.readFileSync(second);
    assert.ok(!workbench.doctor(dir).some(issue => issue.code === 'duplicate-id'));
    const result = cli(dir, ['next-id', 'S-001', '--prefix', 'TK']);
    assert.equal(result.status, 0, result.stdout || result.stderr);
    assert.equal(result.json.id, 'TK-00A');
    assert.deepEqual(fs.readFileSync(second), original);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

for (const kind of ['symlink', 'dangling-symlink', 'directory', 'hardlink']) {
  test(`nonordinary ADR name (${kind}) is diagnosed and blocks allocation without following it`, () => {
    const dir = room();
    try {
      const folder = path.join(dir, 'workbench/docs/adr');
      const target = path.join(dir, 'target.md');
      fs.writeFileSync(target, 'Original bytes');
      const occupied = path.join(folder, '000A-existing.md');
      if (kind === 'directory') fs.mkdirSync(occupied);
      else if (kind === 'hardlink') fs.linkSync(target, occupied);
      else fs.symlinkSync(kind === 'symlink' ? target : path.join(dir, 'absent.md'), occupied);
      const before = fs.readdirSync(folder);
      assert.ok(validateAdrs(dir).some(issue => issue.code === 'invalid-adr' && /ordinary|unsafe|link/i.test(issue.message)), 'unsafe identity inventory is visible');
      assert.throws(() => newAdr(dir, { title: 'Must refuse' }), /ordinary|unsafe|link/i);
      assert.deepEqual(fs.readdirSync(folder), before);
      assert.equal(fs.readFileSync(target, 'utf8'), 'Original bytes');
    } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  });
}

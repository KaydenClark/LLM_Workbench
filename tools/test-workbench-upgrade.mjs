#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tool = path.join(root, 'tools', 'workbench-upgrade.mjs');
const installer = path.join(root, 'tools', 'core-skill-installer.mjs');
const controls = ['AGENTS.md', 'BLUEPRINT.md', 'LEXICON.md', 'RUNBOOK.md', 'TASKBOARD.md', 'CLAUDE.md', 'README.md'];

function fixture(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function run(toolPath, ...args) {
  const result = spawnSync(process.execPath, [toolPath, ...args], { cwd: root, encoding: 'utf8' });
  return { ...result, report: result.stdout ? JSON.parse(result.stdout) : null };
}

function write(project, relative, content) {
  const target = path.join(project, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function seedProject(project) {
  for (const control of controls) write(project, control, `# ${control}\n\nProject-specific v2 truth.\n`);
  write(project, 'BLUEPRINT.md', '# Blueprint\n\n<!-- spec-catalog:start -->\n<!-- spec-catalog:end -->\n');
  write(project, 'TASKBOARD.md', '# Taskboard\n\n<!-- hot-specs:start -->\n<!-- hot-specs:end -->\n');
  write(project, 'specs/S-101-upgrade/SPEC.md', [
    '# S-101 - Upgrade Fixture', '', '**Spec ID:** S-101', '**Status:** active', '**Priority:** 0',
    '**Owner:** owner', '**Updated:** 2026-09-01', '**Catalog description:** Verify upgrade recovery.',
    '**Blockers:** none', '**Latest event:** Ready.', '**Next gate:** Complete TK-001.', '',
    '## Vertical Implementation Slices', '', '| Ticket | Slice | Status | Blockers | Proof |',
    '|---|---|---|---|---|', '| TK-001 | Verify upgrade | ready | none | pending |', '',
    '## Acceptance Criteria', '', '- [ ] Upgrade works.', '', '## Append-Only Evidence And Execution Log', '',
    '| Date | Ticket | Event | Verification | Docs | Remaining gap |', '|---|---|---|---|---|---|', '',
    '## Completion Result', '', 'Pending.', '', '## Supersession', '', '- Supersedes: none', '- Superseded by: none', ''
  ].join('\n'));
  write(project, 'MEMORY.md', '# Project room memory\n');
  write(project, 'skills/local/SKILL.md', '# Legacy project-local skill\n');
  assert.equal(spawnSync('git', ['init', '-q'], { cwd: project }).status, 0);
  assert.equal(spawnSync('git', ['add', '.'], { cwd: project }).status, 0);
  assert.equal(spawnSync('git', ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.test', 'commit', '-qm', 'v2 fixture'], { cwd: project }).status, 0);
}

test('explicit upgrade backs up a changed managed skill, migrates once, and records a concrete rollback point', () => {
  const project = fixture('workbench-upgrade-project-');
  const home = fixture('workbench-upgrade-home-');
  try {
    seedProject(project);
    const installed = run(installer, 'install', '--home', home);
    assert.equal(installed.status, 0, installed.stderr);
    write(home, '.agents/skills/genesis/SKILL.md', '# changed installed genesis\n');
    const beforeSha = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: project, encoding: 'utf8' }).stdout.trim();

    const result = run(tool, 'upgrade', '--project', project, '--home', home, '--version', 'v3.0.0', '--explicit-update');

    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.report.status, 'complete');
    assert.equal(fs.existsSync(path.join(project, 'specs')), false);
    assert.equal(fs.existsSync(path.join(project, 'workbench', 'manifest.json')), true);
    assert.equal(
      fs.readFileSync(path.join(home, '.agents', 'skills', 'genesis', 'SKILL.md'), 'utf8'),
      fs.readFileSync(path.join(root, 'skills', 'genesis', 'SKILL.md'), 'utf8')
    );
    const backup = result.report.skillBackups.find((entry) => entry.engine === 'codex' && entry.skill === 'genesis');
    assert.ok(backup, 'the changed managed skill must be backed up');
    assert.equal(fs.readFileSync(path.join(backup.path, 'SKILL.md'), 'utf8'), '# changed installed genesis\n');
    const recovery = JSON.parse(fs.readFileSync(path.join(project, result.report.recoveryPath), 'utf8'));
    assert.equal(recovery.preMigration.gitSha, beforeSha);
    assert.ok(recovery.preMigration.inventory.includes('specs/S-101-upgrade/SPEC.md'));
    assert.equal(recovery.skillBackups.length, 1);
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
    fs.rmSync(home, { recursive: true, force: true });
  }
});

test('the updater refuses to replace a changed installed skill without explicit authorization', () => {
  const project = fixture('workbench-upgrade-project-');
  const home = fixture('workbench-upgrade-home-');
  try {
    seedProject(project);
    assert.equal(run(installer, 'install', '--home', home).status, 0);
    write(home, '.agents/skills/genesis/SKILL.md', '# changed installed genesis\n');

    const result = run(tool, 'upgrade', '--project', project, '--home', home, '--version', 'v3.0.0');

    assert.notEqual(result.status, 0);
    assert.equal(result.report.status, 'blocked');
    assert.equal(result.report.error.code, 'explicit-update-required');
    assert.equal(fs.readFileSync(path.join(home, '.agents', 'skills', 'genesis', 'SKILL.md'), 'utf8'), '# changed installed genesis\n');
    assert.equal(fs.existsSync(path.join(project, 'workbench')), false);
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
    fs.rmSync(home, { recursive: true, force: true });
  }
});

console.log('ok - explicit upgrade preserves a rollback point and never changes skills implicitly');

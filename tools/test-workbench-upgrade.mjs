#!/usr/bin/env node
// The one-time v2 -> v3 upgrade route. S-00V: the core skills ship in the room,
// so the upgrade lays the skills lane and its discovery adapters down from
// this release through Adoption's migration and never reads, compares or
// replaces a skill in the provider home.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { coreSkills } from '../workbench/tools/workbench-layout.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const VERSION = JSON.parse(fs.readFileSync(path.join(root, 'workbench', 'manifest.json'), 'utf8')).workbenchVersion;
const tool = path.join(root, 'tools', 'workbench-upgrade.mjs');
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
    '## Vertical Implementation Slices', '', '| Task | Slice | Status | Blockers | Proof |',
    '|---|---|---|---|---|', '| TK-001 | Verify upgrade | ready | none | pending |', '',
    '## Acceptance Criteria', '', '- [ ] Upgrade works.', '', '## Append-Only Evidence And Execution Log', '',
    '| Date | Task | Event | Verification | Docs | Remaining gap |', '|---|---|---|---|---|---|', '',
    '## Completion Result', '', 'Pending.', '', '## Supersession', '', '- Supersedes: none', '- Superseded by: none', ''
  ].join('\n'));
  write(project, 'MEMORY.md', '# Project room memory\n');
  write(project, 'skills/local/SKILL.md', '# Legacy project-local skill\n');
  write(project, 'tools/app.mjs', 'export const app = true;\n');
  assert.equal(spawnSync('git', ['init', '-q'], { cwd: project }).status, 0);
  assert.equal(spawnSync('git', ['add', '.'], { cwd: project }).status, 0);
  assert.equal(spawnSync('git', ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.test', 'commit', '-qm', 'v2 fixture'], { cwd: project }).status, 0);
}

function assertLaneInstalled(project, home) {
  const manifest = JSON.parse(fs.readFileSync(path.join(project, 'workbench', 'manifest.json'), 'utf8'));
  assert.equal(manifest.lanes.skills, 'workbench/skills');
  const receipt = JSON.parse(fs.readFileSync(path.join(project, 'workbench', 'skills', '.workbench-skills.json'), 'utf8'));
  assert.equal(receipt.source.release, VERSION);
  assert.match(receipt.source.commit, /^[0-9a-f]{40}$/);
  for (const skill of coreSkills) {
    assert.equal(
      fs.readFileSync(path.join(project, 'workbench', 'skills', skill, 'SKILL.md'), 'utf8'),
      fs.readFileSync(path.join(root, 'workbench', 'skills', skill, 'SKILL.md'), 'utf8'),
      `${skill} is laid down from this release`
    );
    for (const discoveryRoot of ['.agents/skills', '.claude/skills']) {
      assert.equal(fs.realpathSync(path.join(project, discoveryRoot, skill)), fs.realpathSync(path.join(project, 'workbench', 'skills', skill)), `${discoveryRoot}/${skill} resolves into the lane`);
    }
  }
  assert.equal(fs.existsSync(path.join(project, 'skills')), false, 'the legacy root skills/ retires into recovery');
  assert.equal(fs.readFileSync(path.join(project, 'workbench', 'sessions', 'recovery', 'adoption-legacy-skills', 'local', 'SKILL.md'), 'utf8'), '# Legacy project-local skill\n');
  assert.deepEqual(fs.readdirSync(home).filter((name) => name.startsWith('.workbench-')), [], 'the provider home is never written by the upgrade');
  return { manifest, receipt };
}

test('explicit upgrade migrates once, lays the skills lane and adapters down, and records a concrete rollback point', () => {
  const project = fixture('workbench-upgrade-project-');
  const home = fixture('workbench-upgrade-home-');
  try {
    seedProject(project);
    write(home, '.agents/skills/genesis/SKILL.md', '# a personal catalog copy the upgrade must not touch\n');
    const beforeSha = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: project, encoding: 'utf8' }).stdout.trim();

    const result = run(tool, 'upgrade', '--project', project, '--home', home, '--version', VERSION, '--explicit-update');

    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.equal(result.report.status, 'complete');
    assert.equal(result.report.skills, 'lane-install');
    assert.deepEqual(result.report.skillBackups, []);
    assert.equal(result.report.coreRecovery, null);
    const { manifest, receipt } = assertLaneInstalled(project, home);
    assert.equal(fs.readFileSync(path.join(home, '.agents', 'skills', 'genesis', 'SKILL.md'), 'utf8'), '# a personal catalog copy the upgrade must not touch\n');
    assert.equal(fs.existsSync(path.join(project, 'specs')), false);
    assert.equal(result.report.recoveryPath, path.join('workbench', 'sessions', 'recovery', 'upgrade-recovery.json'));
    assert.equal(spawnSync('git', ['check-ignore', '-q', result.report.recoveryPath], { cwd: project }).status, 0, 'new recovery stays local');
    const recovery = JSON.parse(fs.readFileSync(path.join(project, result.report.recoveryPath), 'utf8'));
    assert.equal(recovery.preMigration.gitSha, beforeSha);
    assert.ok(recovery.preMigration.inventory.includes('specs/S-101-upgrade/SPEC.md'));
    assert.equal(recovery.skills, 'lane-install');
    assert.equal(recovery.skillsLane.status, 'installed');
    assert.equal(recovery.skillsLane.receipt, 'workbench/skills/.workbench-skills.json');
    assert.equal(recovery.skillsLane.source.commit, receipt.source.commit);
    assert.equal(fs.readFileSync(path.join(project, 'tools', 'app.mjs'), 'utf8'), 'export const app = true;\n', 'an application root tools directory survives an explicit upgrade');
    const toolsReceipt = JSON.parse(fs.readFileSync(path.join(project, 'workbench', 'tools', '.workbench-tools.json'), 'utf8'));
    assert.equal(toolsReceipt.source.release, VERSION, 'explicit upgrade installs receipt-backed runtime tools');
    assert.equal(recovery.tools.status, 'installed');
    assert.equal(manifest.provenance.lifecycle, 'upgrade');
    assert.equal(manifest.provenance.source.commit, toolsReceipt.source.commit, 'upgrade must preserve the adoption seam\'s exact source identity');
    assert.equal(manifest.provenance.source.commit, receipt.source.commit, 'both lanes name the same source commit');
    const doctor = spawnSync(process.execPath, [path.join(project, 'workbench', 'tools', 'spec-workbench.mjs'), 'doctor'], { cwd: project, encoding: 'utf8' });
    assert.doesNotMatch(doctor.stdout, /skill-lane-missing|skill-adapter|project-local-skills/, doctor.stdout);
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
    fs.rmSync(home, { recursive: true, force: true });
  }
});

test('layout-only upgrade lays the same lane down; the two modes are exclusive', () => {
  const project = fixture('workbench-upgrade-project-');
  const home = fixture('workbench-upgrade-home-');
  try {
    seedProject(project);
    const both = run(tool, 'upgrade', '--project', project, '--home', home, '--version', VERSION, '--explicit-update', '--layout-only');
    assert.notEqual(both.status, 0);
    assert.equal(both.report.error.code, 'invalid-invocation', 'the two modes are exclusive');
    assert.equal(fs.existsSync(path.join(project, 'workbench')), false);

    const result = run(tool, 'upgrade', '--project', project, '--home', home, '--version', VERSION, '--layout-only');
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.equal(result.report.status, 'complete');
    assert.equal(result.report.skills, 'lane-install');
    assertLaneInstalled(project, home);
    const recovery = JSON.parse(fs.readFileSync(path.join(project, result.report.recoveryPath), 'utf8'));
    assert.equal(recovery.lifecycle, 'upgrade');
    assert.equal(recovery.skillsLane.status, 'installed');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
    fs.rmSync(home, { recursive: true, force: true });
  }
});

test('the updater refuses to run without an explicit mode', () => {
  const project = fixture('workbench-upgrade-project-');
  const home = fixture('workbench-upgrade-home-');
  try {
    seedProject(project);
    const result = run(tool, 'upgrade', '--project', project, '--home', home, '--version', VERSION);
    assert.notEqual(result.status, 0);
    assert.equal(result.report.status, 'blocked');
    assert.equal(result.report.error.code, 'explicit-update-required');
    assert.equal(fs.existsSync(path.join(project, 'workbench')), false);
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
    fs.rmSync(home, { recursive: true, force: true });
  }
});

test('the updater refuses a dirty project because HEAD alone is not a full recovery point', () => {
  const project = fixture('workbench-upgrade-project-');
  const home = fixture('workbench-upgrade-home-');
  try {
    seedProject(project);
    write(project, 'README.md', '# README.md\n\nUncommitted project truth.\n');
    for (const mode of ['--explicit-update', '--layout-only']) {
      const result = run(tool, 'upgrade', '--project', project, '--home', home, '--version', VERSION, mode);
      assert.notEqual(result.status, 0);
      assert.equal(result.report.status, 'blocked');
      assert.equal(result.report.error.code, 'dirty-project', mode);
      assert.equal(fs.existsSync(path.join(project, 'workbench')), false);
    }
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
    fs.rmSync(home, { recursive: true, force: true });
  }
});

test('the updater validates every consumed source lane, including the skills lane, before touching the project', () => {
  for (const dirtyRelative of ['workbench/tools/diagnostics.mjs', 'templates/wiki/SCHEMA.md', 'workbench/skills/genesis/SKILL.md']) {
    const project = fixture('workbench-upgrade-project-');
    const home = fixture('workbench-upgrade-home-');
    const parent = fixture('workbench-upgrade-source-');
    const bundle = path.join(parent, 'release');
    try {
      seedProject(project);
      const cloned = spawnSync('git', ['clone', '-q', '--no-local', root, bundle], { cwd: parent, encoding: 'utf8' });
      assert.equal(cloned.status, 0, cloned.stderr);
      const bundleUpgrade = path.join(bundle, 'tools', 'workbench-upgrade.mjs');
      fs.appendFileSync(path.join(bundle, dirtyRelative), '\n// dirty consumed source\n');

      const result = run(bundleUpgrade, 'upgrade', '--project', project, '--home', home, '--version', VERSION, '--explicit-update');

      assert.notEqual(result.status, 0);
      assert.equal(result.report.status, 'blocked', dirtyRelative);
      assert.equal(result.report.error.code, 'invalid-source-identity', dirtyRelative);
      assert.equal(fs.existsSync(path.join(project, 'workbench')), false, `${dirtyRelative} failure leaves the target project untouched`);
      assert.deepEqual(fs.readdirSync(home), [], `${dirtyRelative} failure writes nothing to the home`);
    } finally {
      fs.rmSync(project, { recursive: true, force: true });
      fs.rmSync(home, { recursive: true, force: true });
      fs.rmSync(parent, { recursive: true, force: true });
    }
  }
});

console.log('ok - the one-time upgrade lays the skills lane down from the release and never touches the provider home');

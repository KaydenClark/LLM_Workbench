#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const VERSION = JSON.parse(fs.readFileSync(path.join(root, 'workbench', 'manifest.json'), 'utf8')).workbenchVersion;
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
  write(project, 'tools/app.mjs', 'export const app = true;\n');
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
    // A pre-generation (schema 1) marker on an unchanged skill still reads as managed.
    write(home, '.agents/skills/adoption/.workbench-skill.json', '{"schemaVersion":1,"source":"LLM Workbench core"}\n');
    const beforeSha = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: project, encoding: 'utf8' }).stdout.trim();

    const result = run(tool, 'upgrade', '--project', project, '--home', home, '--version', VERSION, '--explicit-update');

    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.report.status, 'complete');
    for (const skill of ['genesis', 'adoption']) {
      const marker = JSON.parse(fs.readFileSync(path.join(home, '.agents', 'skills', skill, '.workbench-skill.json'), 'utf8'));
      assert.equal(marker.schemaVersion, 2, `${skill} carries a schema 2 marker after the explicit upgrade`);
      assert.equal(marker.release, VERSION);
      assert.match(marker.commit, /^[0-9a-f]{40}$/);
      assert.match(marker.contentHash, /^[0-9a-f]{64}$/);
    }
    assert.equal(fs.existsSync(path.join(project, 'specs')), false);
    assert.equal(fs.existsSync(path.join(project, 'workbench', 'manifest.json')), true);
    assert.equal(
      fs.readFileSync(path.join(home, '.agents', 'skills', 'genesis', 'SKILL.md'), 'utf8'),
      fs.readFileSync(path.join(root, 'skills', 'genesis', 'SKILL.md'), 'utf8')
    );
    const backup = result.report.skillBackups.find((entry) => entry.engine === 'codex' && entry.skill === 'genesis');
    assert.ok(backup, 'the changed managed skill must be backed up');
    assert.equal(fs.readFileSync(path.join(backup.path, 'SKILL.md'), 'utf8'), '# changed installed genesis\n');
    assert.equal(result.report.recoveryPath, path.join('workbench', 'sessions', 'recovery', 'upgrade-recovery.json'));
    assert.equal(spawnSync('git', ['check-ignore', '-q', result.report.recoveryPath], { cwd: project }).status, 0, 'new recovery stays local');
    const recovery = JSON.parse(fs.readFileSync(path.join(project, result.report.recoveryPath), 'utf8'));
    assert.equal(recovery.preMigration.gitSha, beforeSha);
    assert.ok(recovery.preMigration.inventory.includes('specs/S-101-upgrade/SPEC.md'));
    assert.equal(recovery.skillBackups.length, 1);
    assert.equal(fs.readFileSync(path.join(project, 'tools', 'app.mjs'), 'utf8'), 'export const app = true;\n', 'an application root tools directory survives an explicit upgrade');
    const receipt = JSON.parse(fs.readFileSync(path.join(project, 'workbench', 'tools', '.workbench-tools.json'), 'utf8'));
    assert.equal(receipt.source.release, VERSION, 'explicit upgrade installs receipt-backed runtime tools');
    assert.equal(recovery.tools.status, 'installed');
    const manifest = JSON.parse(fs.readFileSync(path.join(project, 'workbench', 'manifest.json'), 'utf8'));
    assert.equal(manifest.provenance.lifecycle, 'upgrade');
    assert.equal(manifest.provenance.source.commit, receipt.source.commit,
      'upgrade must preserve the adoption seam\'s exact source identity');
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

    const result = run(tool, 'upgrade', '--project', project, '--home', home, '--version', VERSION);

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

test('the updater refuses a dirty project because HEAD alone is not a full recovery point', () => {
  const project = fixture('workbench-upgrade-project-');
  const home = fixture('workbench-upgrade-home-');
  try {
    seedProject(project);
    assert.equal(run(installer, 'install', '--home', home).status, 0);
    write(project, 'README.md', '# README.md\n\nUncommitted project truth.\n');

    const result = run(tool, 'upgrade', '--project', project, '--home', home, '--version', VERSION, '--explicit-update');

    assert.notEqual(result.status, 0);
    assert.equal(result.report.status, 'blocked');
    assert.equal(result.report.error.code, 'dirty-project');
    assert.equal(fs.existsSync(path.join(project, 'workbench')), false);
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
    fs.rmSync(home, { recursive: true, force: true });
  }
});

test('the updater validates every consumed source lane before changing installed skills', () => {
  for (const dirtyRelative of ['workbench/tools/diagnostics.mjs', 'templates/wiki/SCHEMA.md']) {
    const project = fixture('workbench-upgrade-project-');
    const home = fixture('workbench-upgrade-home-');
    const parent = fixture('workbench-upgrade-source-');
    const bundle = path.join(parent, 'release');
    try {
      seedProject(project);
      const cloned = spawnSync('git', ['clone', '-q', '--no-local', root, bundle], { cwd: parent, encoding: 'utf8' });
      assert.equal(cloned.status, 0, cloned.stderr);
      const bundleInstaller = path.join(bundle, 'tools', 'core-skill-installer.mjs');
      const bundleUpgrade = path.join(bundle, 'tools', 'workbench-upgrade.mjs');
      assert.equal(run(bundleInstaller, 'install', '--home', home).status, 0);
      const installed = path.join(home, '.agents', 'skills', 'genesis', 'SKILL.md');
      write(home, '.agents/skills/genesis/SKILL.md', '# locally changed genesis\n');
      fs.appendFileSync(path.join(bundle, dirtyRelative), '\n// dirty consumed source\n');

      const result = run(bundleUpgrade, 'upgrade', '--project', project, '--home', home, '--version', VERSION, '--explicit-update');

      assert.notEqual(result.status, 0);
      assert.equal(result.report.status, 'blocked', dirtyRelative);
      assert.equal(result.report.error.code, 'invalid-source-identity', dirtyRelative);
      assert.equal(fs.readFileSync(installed, 'utf8'), '# locally changed genesis\n', `${dirtyRelative} failure leaves installed skills untouched`);
      assert.equal(fs.existsSync(path.join(project, 'workbench')), false, `${dirtyRelative} failure leaves the target project untouched`);
      assert.equal(fs.readdirSync(home).filter((name) => name.startsWith('.workbench-upgrade-backup-')).length, 0,
        `${dirtyRelative} failure creates no skill backup`);
    } finally {
      fs.rmSync(project, { recursive: true, force: true });
      fs.rmSync(home, { recursive: true, force: true });
      fs.rmSync(parent, { recursive: true, force: true });
    }
  }
});

// S-032: on a host whose discovery root is a foreign Git repository the
// explicit path fails closed before its layout phase; --layout-only reads
// skill presence only, builds the support root, and records `upgrade`.
test('layout-only upgrade completes on a Git-owned discovery root without touching a skill while explicit-update still blocks', () => {
  const project = fixture('workbench-upgrade-project-');
  const home = fixture('workbench-upgrade-home-');
  try {
    seedProject(project);
    assert.equal(run(installer, 'install', '--home', home).status, 0);
    write(home, '.agents/skills/genesis/SKILL.md', '# locally changed genesis\n');
    fs.rmSync(path.join(home, '.agents', 'skills', 'genesis', '.workbench-skill.json'), { force: true });
    assert.equal(spawnSync('git', ['init', '-q'], { cwd: home }).status, 0, 'the discovery root must sit inside a Git repository');
    const beforeSha = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: project, encoding: 'utf8' }).stdout.trim();

    const explicit = run(tool, 'upgrade', '--project', project, '--home', home, '--version', VERSION, '--explicit-update');
    assert.notEqual(explicit.status, 0);
    assert.equal(explicit.report.status, 'blocked');
    assert.equal(explicit.report.error.code, 'foreign-git-root');
    assert.equal(fs.existsSync(path.join(project, 'workbench')), false, 'the explicit path must still fail closed before its layout phase');

    const both = run(tool, 'upgrade', '--project', project, '--home', home, '--version', VERSION, '--explicit-update', '--layout-only');
    assert.notEqual(both.status, 0);
    assert.equal(both.report.error.code, 'invalid-invocation', 'the two modes are exclusive');

    const result = run(tool, 'upgrade', '--project', project, '--home', home, '--version', VERSION, '--layout-only');

    assert.equal(result.status, 0, result.stdout);
    assert.equal(result.report.status, 'complete');
    assert.deepEqual(result.report.skillBackups, []);
    assert.equal(result.report.skills, 'presence-only');
    assert.equal(fs.readFileSync(path.join(home, '.agents', 'skills', 'genesis', 'SKILL.md'), 'utf8'), '# locally changed genesis\n', 'layout-only never replaces a skill');
    assert.equal(fs.existsSync(path.join(home, '.agents', 'skills', 'genesis', '.workbench-skill.json')), false, 'layout-only never writes a marker');
    assert.equal(fs.readdirSync(home).filter((name) => name.startsWith('.workbench-upgrade-backup-')).length, 0, 'layout-only creates no backup directory');
    assert.equal(fs.existsSync(path.join(project, 'specs')), false);
    const manifest = JSON.parse(fs.readFileSync(path.join(project, 'workbench', 'manifest.json'), 'utf8'));
    assert.equal(manifest.provenance.lifecycle, 'upgrade');
    const receipt = JSON.parse(fs.readFileSync(path.join(project, 'workbench', 'tools', '.workbench-tools.json'), 'utf8'));
    assert.equal(manifest.provenance.source.commit, receipt.source.commit);
    assert.notEqual(manifest.provenance.source.commit, 'unrecorded');
    const recovery = JSON.parse(fs.readFileSync(path.join(project, result.report.recoveryPath), 'utf8'));
    assert.equal(recovery.lifecycle, 'upgrade');
    assert.equal(recovery.skills, 'presence-only');
    assert.deepEqual(recovery.skillBackups, []);
    assert.equal(recovery.preMigration.gitSha, beforeSha);
    assert.ok(recovery.preMigration.inventory.includes('specs/S-101-upgrade/SPEC.md'));
    assert.equal(recovery.tools.status, 'installed');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
    fs.rmSync(home, { recursive: true, force: true });
  }
});

test('layout-only upgrade still requires presence of every core skill, a clean committed target, and no support root', () => {
  const project = fixture('workbench-upgrade-project-');
  const home = fixture('workbench-upgrade-home-');
  try {
    seedProject(project);
    const missing = run(tool, 'upgrade', '--project', project, '--home', home, '--version', VERSION, '--layout-only');
    assert.notEqual(missing.status, 0);
    assert.equal(missing.report.error.code, 'missing-user-skills');
    assert.equal(fs.existsSync(path.join(project, 'workbench')), false);

    assert.equal(run(installer, 'install', '--home', home).status, 0);
    write(project, 'README.md', '# README.md\n\nUncommitted project truth.\n');
    const dirty = run(tool, 'upgrade', '--project', project, '--home', home, '--version', VERSION, '--layout-only');
    assert.equal(dirty.report.error.code, 'dirty-project');
    assert.equal(fs.existsSync(path.join(project, 'workbench')), false);
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
    fs.rmSync(home, { recursive: true, force: true });
  }
});

// S-040: both refusals an operator meets on a host with a shared user-scoped
// skill must name the route that clears them, or every agent that meets one
// pays for the route selection itself.
test('the shared-skill refusals name the layout-only route that clears them', () => {
  const project = fixture('workbench-upgrade-project-');
  const home = fixture('workbench-upgrade-home-');
  try {
    seedProject(project);
    assert.equal(run(installer, 'install', '--home', home).status, 0);
    const shared = path.join(home, '.agents', 'skills', 'code-review');
    const linked = path.join(home, '.claude', 'skills', 'code-review');
    fs.rmSync(linked, { recursive: true, force: true });
    fs.symlinkSync(shared, linked, 'dir');

    const collision = run(tool, 'upgrade', '--project', project, '--home', home, '--version', VERSION, '--explicit-update');
    assert.notEqual(collision.status, 0);
    assert.equal(collision.report.error.code, 'skill-path-collision');
    assert.match(collision.report.error.message, /--layout-only/,
      'the skill-path-collision refusal names the supported route');

    fs.rmSync(linked, { force: true });
    fs.cpSync(shared, linked, { recursive: true });
    fs.rmSync(path.join(linked, '.workbench-skill.json'), { force: true });

    const unmanaged = run(tool, 'upgrade', '--project', project, '--home', home, '--version', VERSION, '--explicit-update');
    assert.notEqual(unmanaged.status, 0);
    assert.equal(unmanaged.report.error.code, 'unmanaged-skill');
    assert.match(unmanaged.report.error.message, /--layout-only/,
      'the unmanaged-skill refusal names the supported route');

    assert.equal(fs.existsSync(path.join(project, 'workbench')), false, 'neither refusal touched the target');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
    fs.rmSync(home, { recursive: true, force: true });
  }
});

// S-045 TK-001: the presence-only gate and the installer must agree on a host
// whose every populated discovery root reaches the skill through a link. The
// installer accepts such a destination and reports its resolution; before this
// ticket `missingUserSkills` judged with `lstat(...).isDirectory()`, which does
// not follow a link, so the same host was refused `missing-user-skills` and the
// `--layout-only` route the S-040 refusals name did not complete there.
test('layout-only upgrade completes where every populated discovery root reaches each skill through a link', () => {
  const project = fixture('workbench-upgrade-project-');
  const home = fixture('workbench-upgrade-home-');
  try {
    seedProject(project);
    assert.equal(run(installer, 'install', '--home', home).status, 0);

    // Move the whole bundle out of both roots, then leave only links behind, so
    // no root holds any skill as an ordinary directory.
    const store = path.join(home, 'shared-skills');
    fs.mkdirSync(store, { recursive: true });
    const agents = path.join(home, '.agents', 'skills');
    const claude = path.join(home, '.claude', 'skills');
    for (const skill of fs.readdirSync(agents)) {
      fs.cpSync(path.join(agents, skill), path.join(store, skill), { recursive: true });
      fs.rmSync(path.join(agents, skill), { recursive: true, force: true });
      fs.rmSync(path.join(claude, skill), { recursive: true, force: true });
      fs.symlinkSync(path.join(store, skill), path.join(agents, skill), 'dir');
      fs.symlinkSync(path.join(store, skill), path.join(claude, skill), 'dir');
    }

    const result = run(tool, 'upgrade', '--project', project, '--home', home, '--version', VERSION, '--layout-only');

    assert.equal(result.status, 0, result.stdout);
    assert.equal(result.report.status, 'complete');
    assert.equal(result.report.skills, 'presence-only');
    for (const root of [agents, claude]) {
      assert.equal(fs.lstatSync(path.join(root, 'genesis')).isSymbolicLink(), true, 'the link itself is untouched');
    }
    assert.equal(fs.existsSync(path.join(store, 'genesis', 'SKILL.md')), true, 'nothing is written through the link');

    // The installer agrees: it reports the same host as already-present with the
    // target it resolved, rather than installing over the links.
    const reinstall = run(installer, 'install', '--home', home);
    assert.equal(reinstall.status, 0, reinstall.stdout);
    assert.equal(reinstall.report.installed.length, 0, 'the installer writes nothing where every root reaches the skill through a link');
    const skipped = reinstall.report.skipped.find((entry) => entry.engine === 'claude' && entry.skill === 'genesis');
    assert.equal(skipped.reason, 'already-present');
    assert.equal(skipped.resolved, fs.realpathSync(path.join(store, 'genesis')));
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
    fs.rmSync(home, { recursive: true, force: true });
  }
});

console.log('ok - explicit upgrade preserves a rollback point and never changes skills implicitly');

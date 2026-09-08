#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const installer = path.join(root, 'tools', 'core-skill-installer.mjs');
const VERSION = JSON.parse(fs.readFileSync(path.join(root, 'workbench', 'manifest.json'), 'utf8')).workbenchVersion;
const coreSkills = [
  'adoption', 'checkpoint', 'code-review', 'genesis', 'grilling', 'implement',
  'make-it-so', 'to-docs', 'to-spec', 'to-tickets', 'tracer-bullet', 'update-harness', 'carry', 'notepad', 'builder', 'auditor', 'reviewer', 'reconciler'
];

function fixtureHome() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-skills-'));
}

function install(home) {
  const result = spawnSync(process.execPath, [installer, 'install', '--home', home], {
    cwd: root,
    encoding: 'utf8'
  });
  return {
    ...result,
    report: result.stdout ? JSON.parse(result.stdout) : null
  };
}

function maintain(home, command, ...args) {
  const result = spawnSync(process.execPath, [installer, command, '--home', home, ...args], { cwd: root, encoding: 'utf8' });
  return { ...result, report: JSON.parse(result.stdout) };
}

test('explicit update preserves changed core bytes in a backup and rollback restores both content and adapter topology', () => {
  const home = fixtureHome();
  try {
    assert.equal(install(home).status, 0);
    const canonical = path.join(home, '.agents/skills/genesis');
    const adapter = path.join(home, '.claude/skills/genesis');
    const changed = '# Changed managed core before update\n';
    fs.writeFileSync(path.join(canonical, 'SKILL.md'), changed);
    const withoutAuthorization = maintain(home, 'update');
    assert.equal(withoutAuthorization.report.error.code, 'explicit-update-required');
    assert.equal(fs.readFileSync(path.join(canonical, 'SKILL.md'), 'utf8'), changed);
    const result = maintain(home, 'update', '--explicit-update');
    assert.equal(result.report.status, 'updated', result.stdout);
    assert.equal(fs.readFileSync(path.join(canonical, 'SKILL.md'), 'utf8'), fs.readFileSync(path.join(root, 'skills/genesis/SKILL.md'), 'utf8'));
    assert.equal(fs.realpathSync(adapter), fs.realpathSync(canonical));
    const restored = maintain(home, 'rollback', '--backup', result.report.backup);
    assert.equal(restored.report.status, 'rolled-back', restored.stdout);
    assert.equal(fs.readFileSync(path.join(canonical, 'SKILL.md'), 'utf8'), changed);
    assert.equal(fs.realpathSync(adapter), fs.realpathSync(canonical));
  } finally { fs.rmSync(home, { recursive: true, force: true }); }
});

test('rollback refuses a newer local skill change and preserves it', () => {
  const home = fixtureHome();
  try {
    assert.equal(install(home).status, 0);
    const file = path.join(home, '.agents/skills/genesis/SKILL.md');
    fs.writeFileSync(file, '# Prior change\n');
    const updated = maintain(home, 'update', '--explicit-update');
    assert.equal(updated.report.status, 'updated', updated.stdout);
    fs.writeFileSync(file, '# New work after update\n');
    const refused = maintain(home, 'rollback', '--backup', updated.report.backup);
    assert.equal(refused.report.status, 'blocked');
    assert.equal(fs.readFileSync(file, 'utf8'), '# New work after update\n');
  } finally { fs.rmSync(home, { recursive: true, force: true }); }
});

test('rollback validates the complete recorded destination set before changing any core', () => {
  for (const damage of ['missing-entry', 'changed-backup']) {
    const home = fixtureHome();
    try {
      assert.equal(install(home).status, 0);
      const file = path.join(home, '.agents/skills/genesis/SKILL.md');
      fs.writeFileSync(file, '# Before update\n');
      const updated = maintain(home, 'update', '--explicit-update');
      assert.equal(updated.report.status, 'updated', updated.stdout);
      const current = fs.readFileSync(file);
      const recordPath = path.join(updated.report.backup, 'recovery.json');
      const record = JSON.parse(fs.readFileSync(recordPath));
      if (damage === 'missing-entry') {
        record.entries.pop();
        fs.writeFileSync(recordPath, JSON.stringify(record));
      } else fs.appendFileSync(path.join(updated.report.backup, 'codex/genesis/SKILL.md'), 'changed backup');
      const refused = maintain(home, 'rollback', '--backup', updated.report.backup);
      assert.equal(refused.report.status, 'blocked', damage + ': ' + refused.stdout);
      assert.deepEqual(fs.readFileSync(file), current, damage + ' leaves current core unchanged');
    } finally { fs.rmSync(home, { recursive: true, force: true }); }
  }
});

test('explicit maintenance converges legacy copies and rollback restores each original implementation', () => {
  const home = fixtureHome();
  try {
    assert.equal(install(home).status, 0);
    const canonical = path.join(home, '.agents/skills/genesis');
    const adapter = path.join(home, '.claude/skills/genesis');
    fs.unlinkSync(adapter);
    fs.cpSync(canonical, adapter, { recursive: true });
    fs.writeFileSync(path.join(adapter, 'SKILL.md'), '# Legacy Claude implementation\n');
    const updated = maintain(home, 'update', '--explicit-update');
    assert.equal(updated.report.status, 'updated', updated.stdout);
    assert.equal(fs.realpathSync(adapter), fs.realpathSync(canonical));
    assert.equal(maintain(home, 'rollback', '--backup', updated.report.backup).report.status, 'rolled-back');
    assert.equal(fs.lstatSync(adapter).isSymbolicLink(), false);
    assert.equal(fs.readFileSync(path.join(adapter, 'SKILL.md'), 'utf8'), '# Legacy Claude implementation\n');
  } finally { fs.rmSync(home, { recursive: true, force: true }); }
});

test('explicit maintenance permits ignored managed core in personal Git and refuses tracked core without mutation', () => {
  const home = fixtureHome();
  try {
    const personal = path.join(home, '.agents');
    fs.mkdirSync(personal);
    assert.equal(spawnSync('git', ['init', '-q', personal]).status, 0);
    assert.equal(install(home).status, 0);
    const updated = maintain(home, 'update', '--explicit-update');
    assert.equal(updated.report.status, 'updated', updated.stdout);
    assert.equal(spawnSync('git', ['status', '--porcelain'], { cwd: personal, encoding: 'utf8' }).stdout, '');
    assert.equal(spawnSync('git', ['add', '-f', 'skills/genesis'], { cwd: personal }).status, 0);
    const before = fs.readFileSync(path.join(personal, 'skills/genesis/SKILL.md'));
    const backups = fs.readdirSync(home).filter(name => name.startsWith('.workbench-core-backup-'));
    const refused = maintain(home, 'update', '--explicit-update');
    assert.equal(refused.report.status, 'blocked', refused.stdout);
    assert.match(refused.report.error.message, /tracked-core migration/);
    assert.deepEqual(fs.readFileSync(path.join(personal, 'skills/genesis/SKILL.md')), before);
    assert.deepEqual(fs.readdirSync(home).filter(name => name.startsWith('.workbench-core-backup-')), backups);
  } finally { fs.rmSync(home, { recursive: true, force: true }); }
});

test('explicit update resolves provider-home ownership before creating backups', () => {
  const container = fixtureHome();
  try {
    const repository = path.join(container, 'repository');
    const actual = path.join(repository, 'home');
    const home = path.join(container, 'linked-home');
    fs.mkdirSync(actual, { recursive: true });
    fs.symlinkSync(actual, home, 'dir');
    assert.equal(spawnSync('git', ['init', '-q', repository]).status, 0);
    assert.equal(install(home).status, 0);
    const updated = maintain(home, 'update', '--explicit-update');
    assert.equal(updated.report.status, 'blocked', updated.stdout);
    assert.equal(updated.report.error.code, 'foreign-git-root');
    assert.equal(fs.readdirSync(actual).some(name => name.startsWith('.workbench-core-backup-')), false);
  } finally { fs.rmSync(container, { recursive: true, force: true }); }
});

test('rollback refuses core paths newly tracked after the update', () => {
  const home = fixtureHome();
  try {
    assert.equal(install(home).status, 0);
    const file = path.join(home, '.agents/skills/genesis/SKILL.md');
    fs.writeFileSync(file, '# Old local implementation\n');
    const updated = maintain(home, 'update', '--explicit-update');
    assert.equal(updated.report.status, 'updated', updated.stdout);
    const personal = path.join(home, '.agents');
    assert.equal(spawnSync('git', ['init', '-q', personal]).status, 0);
    assert.equal(spawnSync('git', ['add', '-f', 'skills/genesis'], { cwd: personal }).status, 0);
    const before = fs.readFileSync(file);
    const refused = maintain(home, 'rollback', '--backup', updated.report.backup);
    assert.equal(refused.report.status, 'blocked', refused.stdout);
    assert.match(refused.report.error.message, /tracked-core migration/);
    assert.deepEqual(fs.readFileSync(file), before);
  } finally { fs.rmSync(home, { recursive: true, force: true }); }
});

test('core replacement refuses tracked case aliases on a case-insensitive filesystem', t => {
  for (const provider of ['.agents', '.claude']) {
  const home = fixtureHome();
  try {
    const personal = path.join(home, provider);
    fs.mkdirSync(personal);
    assert.equal(spawnSync('git', ['init', '-q', personal]).status, 0);
    assert.equal(install(home).status, 0);
    const lower = path.join(personal, 'skills/genesis');
    const upper = path.join(personal, 'skills/Genesis');
    fs.renameSync(lower, upper);
    if (!fs.existsSync(lower)) { t.skip('filesystem is case-sensitive'); return; }
    const file = path.join(upper, 'SKILL.md');
    fs.writeFileSync(file, '# Tracked case alias\n');
    assert.equal(spawnSync('git', ['add', '-f', 'skills/Genesis'], { cwd: personal }).status, 0);
    const refused = maintain(home, 'update', '--explicit-update');
    assert.equal(refused.report.status, 'blocked', refused.stdout);
    assert.equal(fs.readFileSync(file, 'utf8'), '# Tracked case alias\n');
  } finally { fs.rmSync(home, { recursive: true, force: true }); }
  }
});

test('case-aliased discovery roots retain one physical core implementation through update and rollback', t => {
  const home = fixtureHome();
  try {
    const shared = path.join(home, 'shared');
    fs.mkdirSync(shared);
    if (!fs.existsSync(path.join(home, 'SHARED'))) { t.skip('filesystem is case-sensitive'); return; }
    for (const [provider, target] of [['.agents', '../shared'], ['.claude', '../SHARED']]) {
      fs.mkdirSync(path.join(home, provider));
      fs.symlinkSync(target, path.join(home, provider, 'skills'), 'dir');
    }
    assert.equal(install(home).status, 0);
    const updated = maintain(home, 'update', '--explicit-update');
    assert.equal(updated.report.status, 'updated', updated.stdout);
    assert.equal(fs.lstatSync(path.join(shared, 'genesis')).isDirectory(), true);
    assert.equal(maintain(home, 'rollback', '--backup', updated.report.backup).report.status, 'rolled-back');
  } finally { fs.rmSync(home, { recursive: true, force: true }); }
});

test('tracked core inventory preserves leading whitespace in a discovery path', () => {
  const home = fixtureHome();
  try {
    const personal = path.join(home, 'personal');
    const directory = path.join(personal, ' skills');
    fs.mkdirSync(directory, { recursive: true });
    fs.mkdirSync(path.join(home, '.agents'));
    fs.symlinkSync(directory, path.join(home, '.agents/skills'), 'dir');
    assert.equal(spawnSync('git', ['init', '-q', personal]).status, 0);
    assert.equal(install(home).status, 0);
    const file = path.join(directory, 'genesis/SKILL.md');
    fs.writeFileSync(file, '# Tracked implementation under spaced directory\n');
    assert.equal(spawnSync('git', ['add', '-f', ' skills/genesis/SKILL.md'], { cwd: personal }).status, 0);
    const refused = maintain(home, 'update', '--explicit-update');
    assert.equal(refused.report.status, 'blocked', refused.stdout);
    assert.equal(fs.readFileSync(file, 'utf8'), '# Tracked implementation under spaced directory\n');
  } finally { fs.rmSync(home, { recursive: true, force: true }); }
});

test('normal setup preserves a deleted tracked case-alias discovery ancestor', () => {
  const home = fixtureHome();
  try {
    const personal = path.join(home, '.claude');
    fs.mkdirSync(personal);
    assert.equal(spawnSync('git', ['init', '-q', personal]).status, 0);
    assert.equal(install(home).status, 0);
    fs.renameSync(path.join(personal, 'skills'), path.join(personal, 'Skills'));
    assert.equal(spawnSync('git', ['add', '-f', 'Skills/genesis'], { cwd: personal }).status, 0);
    fs.rmSync(path.join(personal, 'Skills'), { recursive: true });
    const before = spawnSync('git', ['status', '--porcelain', '-z'], { cwd: personal, encoding: 'utf8' }).stdout;
    const refused = install(home);
    assert.equal(refused.report.status, 'blocked', refused.stdout);
    assert.equal(fs.existsSync(path.join(personal, 'skills')), false);
    assert.equal(spawnSync('git', ['status', '--porcelain', '-z'], { cwd: personal, encoding: 'utf8' }).stdout, before);
  } finally { fs.rmSync(home, { recursive: true, force: true }); }
});

test('normal setup preserves a deleted tracked case-alias adapter', () => {
  const home = fixtureHome();
  try {
    const personal = path.join(home, '.claude');
    fs.mkdirSync(personal);
    assert.equal(spawnSync('git', ['init', '-q', personal]).status, 0);
    assert.equal(install(home).status, 0);
    const lower = path.join(personal, 'skills/genesis');
    const upper = path.join(personal, 'skills/Genesis');
    fs.renameSync(lower, upper);
    assert.equal(spawnSync('git', ['add', '-f', 'skills/Genesis'], { cwd: personal }).status, 0);
    fs.unlinkSync(upper);
    const before = spawnSync('git', ['status', '--porcelain', '-z'], { cwd: personal, encoding: 'utf8' }).stdout;
    const refused = install(home);
    assert.equal(refused.report.status, 'blocked', refused.stdout);
    assert.equal(fs.existsSync(lower), false);
    assert.equal(spawnSync('git', ['status', '--porcelain', '-z'], { cwd: personal, encoding: 'utf8' }).stdout, before);
  } finally { fs.rmSync(home, { recursive: true, force: true }); }
});

test('normal setup installs only missing bundled core skills in both user discovery roots', () => {
  const home = fixtureHome();
  try {
    const existing = path.join(home, '.agents', 'skills', 'genesis');
    fs.mkdirSync(existing, { recursive: true });
    fs.writeFileSync(path.join(existing, 'SKILL.md'), 'foreign genesis\n');

    const result = install(home);

    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.report.status, 'complete');
    assert.deepEqual(result.report.requiredSkills, coreSkills);
    assert.equal(fs.readFileSync(path.join(existing, 'SKILL.md'), 'utf8'), 'foreign genesis\n');
    assert.equal(
      fs.readFileSync(path.join(home, '.claude', 'skills', 'genesis', 'SKILL.md'), 'utf8'),
      'foreign genesis\n'
    );
    assert.equal(
      fs.readFileSync(path.join(home, '.agents', 'skills', 'adoption', 'SKILL.md'), 'utf8'),
      fs.readFileSync(path.join(root, 'skills', 'adoption', 'SKILL.md'), 'utf8')
    );
    assert.ok(result.report.skipped.some((entry) =>
      entry.engine === 'codex' && entry.skill === 'genesis' && entry.reason === 'already-present'
    ));
  } finally {
    fs.rmSync(home, { recursive: true, force: true });
  }
});

// S-045 TK-005/TK-001: a Git-owned discovery root is SUPPORTED. `26c34e9` added
// the refusal to stop the harness mutating a user's own versioned skills
// collection, which is a real risk, but it left that layout with no route at
// all. The bounded route installs a *missing* skill and never touches Git: the
// new directory is left untracked, the index and HEAD are unchanged, and
// nothing already in the collection is read, replaced, or marked. Replacement
// is a different question - `workbench-upgrade.mjs --explicit-update` still
// refuses a Git-owned root with `foreign-git-root`.
test('a Git-owned discovery root installs the missing skills and leaves Git untouched', () => {
  const home = fixtureHome();
  try {
    const gitRoot = path.join(home, '.agents', 'skills');
    fs.mkdirSync(gitRoot, { recursive: true });
    assert.equal(spawnSync('git', ['init', '-q'], { cwd: gitRoot }).status, 0);
    fs.writeFileSync(path.join(gitRoot, 'README.md'), '# a personal skills collection\n');
    const git = (...args) => spawnSync('git', args, { cwd: gitRoot, encoding: 'utf8' });
    assert.equal(git('add', 'README.md').status, 0);
    assert.equal(git('-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.test', 'commit', '-qm', 'personal').status, 0);
    const beforeSha = git('rev-parse', 'HEAD').stdout.trim();
    const beforeIndex = fs.readFileSync(path.join(gitRoot, '.git', 'index'));

    const result = install(home);

    assert.equal(result.status, 0, result.stdout);
    assert.equal(result.report.status, 'complete');
    assert.equal(
      fs.readFileSync(path.join(gitRoot, 'genesis', 'SKILL.md'), 'utf8'),
      fs.readFileSync(path.join(root, 'skills', 'genesis', 'SKILL.md'), 'utf8'));
    assert.equal(JSON.parse(fs.readFileSync(path.join(gitRoot, 'genesis', '.workbench-skill.json'), 'utf8')).release, VERSION,
      'the installed copy still carries its marker');

    assert.equal(git('rev-parse', 'HEAD').stdout.trim(), beforeSha, 'no commit was made');
    assert.deepEqual(fs.readFileSync(path.join(gitRoot, '.git', 'index')), beforeIndex, 'nothing was staged');
    const status = git('status', '--porcelain').stdout.split('\n').filter(Boolean);
    assert.deepEqual(status, [], 'managed core stays excluded from personal Git state');
    assert.equal(git('check-ignore', '-q', 'genesis/SKILL.md').status, 0);
    assert.ok(result.report.gitOwnedRoots.includes(fs.realpathSync(gitRoot)),
      'the report names the Git-owned root it wrote into, so the operator is not surprised');
  } finally {
    fs.rmSync(home, { recursive: true, force: true });
  }
});

test('fresh installation stores one implementation and gives Claude an adapter that survives loss of the source checkout', () => {
  const home = fixtureHome();
  try {
    const result = install(home);
    assert.equal(result.status, 0, result.stdout);
    for (const skill of coreSkills) {
      const canonical = path.join(home, '.agents/skills', skill);
      const adapter = path.join(home, '.claude/skills', skill);
      assert.equal(fs.lstatSync(canonical).isSymbolicLink(), false);
      assert.equal(fs.lstatSync(adapter).isSymbolicLink(), true);
      assert.equal(fs.realpathSync(adapter), fs.realpathSync(canonical));
      assert.ok(fs.realpathSync(adapter).startsWith(fs.realpathSync(home) + path.sep));
    }
    assert.equal(fs.existsSync(path.join(home, '.codex/skills')), false);
  } finally { fs.rmSync(home, { recursive: true, force: true }); }
});

test('linked Git exclusion metadata is refused before creating managed core', () => {
  const home = fixtureHome();
  try {
    const directory = path.join(home, '.agents/skills');
    fs.mkdirSync(directory, { recursive: true });
    assert.equal(spawnSync('git', ['init', '-q'], { cwd: directory }).status, 0);
    const outside = path.join(home, 'unrelated-info');
    fs.mkdirSync(outside);
    fs.writeFileSync(path.join(outside, 'exclude'), '# Preserve unrelated bytes\n');
    fs.rmSync(path.join(directory, '.git/info'), { recursive: true });
    fs.symlinkSync(outside, path.join(directory, '.git/info'), 'dir');
    const result = install(home);
    assert.equal(result.report.status, 'blocked', result.stdout);
    assert.equal(fs.readFileSync(path.join(outside, 'exclude'), 'utf8'), '# Preserve unrelated bytes\n');
    assert.equal(fs.existsSync(path.join(directory, 'genesis')), false);
  } finally { fs.rmSync(home, { recursive: true, force: true }); }
});

test('an existing empty core directory is preserved and reported before creating a broken adapter', () => {
  const home = fixtureHome();
  try {
    const existing = path.join(home, '.agents/skills/genesis');
    fs.mkdirSync(existing, { recursive: true });
    const result = install(home);
    assert.equal(result.report.error?.code, 'skill-path-collision', result.stdout);
    assert.deepEqual(fs.readdirSync(existing), []);
    assert.equal(fs.existsSync(path.join(home, '.claude/skills/genesis')), false);
  } finally { fs.rmSync(home, { recursive: true, force: true }); }
});

test('a Git-owned parent of a missing discovery root installs into it just the same', () => {
  const home = fixtureHome();
  try {
    const parent = path.join(home, '.agents');
    fs.mkdirSync(parent, { recursive: true });
    assert.equal(spawnSync('git', ['init', '-q'], { cwd: parent }).status, 0);

    const result = install(home);

    assert.equal(result.status, 0, result.stdout);
    assert.equal(result.report.status, 'complete');
    assert.equal(fs.existsSync(path.join(parent, 'skills', 'genesis', 'SKILL.md')), true);
    const status = spawnSync('git', ['status', '--porcelain'], { cwd: parent, encoding: 'utf8' })
      .stdout.split('\n').filter(Boolean);
    assert.ok(status.every((line) => line.startsWith('??')), 'nothing is staged in the parent repository');
  } finally {
    fs.rmSync(home, { recursive: true, force: true });
  }
});

// S-045 TK-005: the layout that sent this ticket here. `~/.claude/skills` is a
// link to `~/.agents/skills`, so the two discovery roots are one directory. The
// route resolves the link and writes into the real directory; the link itself
// is never written over, and the second engine finds the skill already present.
test('a symlinked discovery root is resolved and installed into, never written over', () => {
  const home = fixtureHome();
  try {
    const real = path.join(home, '.agents', 'skills');
    const link = path.join(home, '.claude', 'skills');
    fs.mkdirSync(real, { recursive: true });
    fs.mkdirSync(path.join(home, '.claude'), { recursive: true });
    fs.symlinkSync(real, link, 'dir');

    const result = install(home);

    assert.equal(result.status, 0, result.stdout);
    assert.equal(result.report.status, 'complete');
    assert.equal(fs.lstatSync(link).isSymbolicLink(), true, 'the link itself is untouched');
    assert.equal(fs.existsSync(path.join(real, 'genesis', 'SKILL.md')), true);
    assert.equal(result.report.installed.filter((entry) => entry.skill === 'genesis').length, 1,
      'one directory reached by two roots is written once, not twice');
    assert.deepEqual(result.report.resolvedRoots, [
      { engine: 'codex', declared: real, resolved: fs.realpathSync(real) },
      { engine: 'claude', declared: link, resolved: fs.realpathSync(real) }
    ], 'the report names each declared root beside the directory it resolved to, so one directory reached twice is visible');
    assert.ok(result.report.skipped.some((entry) => entry.engine === 'claude' && entry.skill === 'genesis'),
      'the second engine finds it already present through the resolved root');
  } finally {
    fs.rmSync(home, { recursive: true, force: true });
  }
});

test('a discovery root ancestor that is not a directory still blocks before anything is written', () => {
  const home = fixtureHome();
  try {
    fs.writeFileSync(path.join(home, '.agents'), 'not a directory\n');

    const result = install(home);

    assert.notEqual(result.status, 0);
    assert.equal(result.report.status, 'blocked');
    assert.equal(result.report.error.code, 'discovery-root-collision');
    assert.equal(fs.existsSync(path.join(home, '.claude', 'skills')), false);
  } finally {
    fs.rmSync(home, { recursive: true, force: true });
  }
});

test('a dangling discovery root link blocks rather than being silently created', () => {
  const home = fixtureHome();
  try {
    fs.mkdirSync(path.join(home, '.agents'), { recursive: true });
    fs.symlinkSync(path.join(home, 'nowhere'), path.join(home, '.agents', 'skills'), 'dir');

    const result = install(home);

    assert.notEqual(result.status, 0);
    assert.equal(result.report.status, 'blocked');
    assert.equal(result.report.error.code, 'discovery-root-collision');
    assert.equal(fs.existsSync(path.join(home, '.claude', 'skills')), false);
  } finally {
    fs.rmSync(home, { recursive: true, force: true });
  }
});

test('a same-named file collision blocks without installing any skill', () => {
  const home = fixtureHome();
  try {
    const collision = path.join(home, '.claude', 'skills');
    fs.mkdirSync(collision, { recursive: true });
    fs.writeFileSync(path.join(collision, 'adoption'), 'not a skill directory\n');

    const result = install(home);

    assert.notEqual(result.status, 0);
    assert.equal(result.report.status, 'blocked');
    assert.equal(result.report.error.code, 'skill-path-collision');
    assert.equal(fs.existsSync(path.join(home, '.agents', 'skills')), false);
  } finally {
    fs.rmSync(home, { recursive: true, force: true });
  }
});


test('all four stances are available through one-level discovery and a repeated install preserves them', () => {
  const home = fixtureHome();
  try {
    const result = install(home);
    assert.equal(result.status, 0, result.stdout);
    for (const provider of ['.agents', '.claude']) {
      for (const stance of ['builder', 'auditor', 'reviewer', 'reconciler']) {
        const file = path.join(home, provider, 'skills', stance, 'SKILL.md');
        assert.equal(fs.readFileSync(file, 'utf8'), fs.readFileSync(path.join(root, 'skills', stance, 'SKILL.md'), 'utf8'));
      }
    }
    for (const stance of ['builder', 'auditor', 'reviewer', 'reconciler']) {
      fs.writeFileSync(path.join(home, '.agents/skills', stance, 'SKILL.md'), 'existing stance instructions\n');
      assert.equal(fs.readFileSync(path.join(home, '.claude/skills', stance, 'SKILL.md'), 'utf8'), 'existing stance instructions\n');
    }
    const repeated = install(home);
    assert.equal(repeated.status, 0, repeated.stdout);
    assert.equal(repeated.report.installed.length, 0);
    assert.equal(fs.readFileSync(path.join(home, '.claude/skills/reviewer/SKILL.md'), 'utf8'), 'existing stance instructions\n');
  } finally { fs.rmSync(home, { recursive: true, force: true }); }
});

test('a stance collision blocks before either discovery root is populated', () => {
  const home = fixtureHome();
  try {
    fs.mkdirSync(path.join(home, '.claude/skills'), { recursive: true });
    fs.writeFileSync(path.join(home, '.claude/skills/reviewer'), 'collision');
    const result = install(home);
    assert.equal(result.report.error?.code, 'skill-path-collision');
    assert.equal(fs.existsSync(path.join(home, '.agents/skills')), false);
  } finally { fs.rmSync(home, { recursive: true, force: true }); }
});

test('an installed core skill carries a schema 2 marker naming the release, commit, and content hash it came from', () => {
  const home = fixtureHome();
  try {
    const result = install(home);
    assert.equal(result.status, 0, result.stdout);
    const markers = ['.agents', '.claude'].map((provider) =>
      JSON.parse(fs.readFileSync(path.join(home, provider, 'skills', 'genesis', '.workbench-skill.json'), 'utf8')));
    for (const marker of markers) {
      assert.deepEqual(Object.keys(marker).sort(), ['commit', 'compatibleRooms', 'contentHash', 'release', 'schemaVersion', 'source']);
      assert.equal(marker.schemaVersion, 2);
      assert.equal(marker.source, 'LLM Workbench core');
      assert.deepEqual(marker.compatibleRooms, { minimum: 'v3.1.4', maximum: VERSION });
      assert.equal(marker.release, VERSION, 'the marker names the release of the checkout that installed it');
      assert.match(marker.commit, /^[0-9a-f]{40}$/);
      assert.match(marker.contentHash, /^[0-9a-f]{64}$/);
    }
    assert.equal(markers[0].contentHash, markers[1].contentHash, 'both engines install the same content');
    const other = JSON.parse(fs.readFileSync(path.join(home, '.claude', 'skills', 'builder', '.workbench-skill.json'), 'utf8'));
    assert.notEqual(other.contentHash, markers[0].contentHash, 'the hash covers the skill content, not the bundle');
  } finally {
    fs.rmSync(home, { recursive: true, force: true });
  }
});

// S-040: the pre-check must not be stricter than the install it guards. A
// destination reached through a link to a directory that already holds the
// skill is exactly the case the presence-only install would skip anyway.
test('a linked destination whose resolved target already holds the skill installs and reports the resolution', () => {
  const home = fixtureHome();
  try {
    const shared = path.join(home, '.agents', 'skills', 'code-review');
    fs.mkdirSync(shared, { recursive: true });
    fs.writeFileSync(path.join(shared, 'SKILL.md'), '# shared code-review\n');
    fs.mkdirSync(path.join(home, '.claude', 'skills'), { recursive: true });
    const linked = path.join(home, '.claude', 'skills', 'code-review');
    fs.symlinkSync(shared, linked, 'dir');

    const result = install(home);

    assert.equal(result.status, 0, result.stdout);
    assert.equal(result.report.status, 'complete');
    const skipped = result.report.skipped.find((entry) => entry.engine === 'claude' && entry.skill === 'code-review');
    assert.ok(skipped, 'the linked destination is reported as skipped');
    assert.equal(skipped.reason, 'already-present');
    assert.equal(skipped.resolved, fs.realpathSync(shared), 'the report names the target the decision was made about');
    assert.equal(fs.lstatSync(linked).isSymbolicLink(), true, 'the link itself is untouched');
    assert.equal(fs.readFileSync(path.join(shared, 'SKILL.md'), 'utf8'), '# shared code-review\n', 'nothing is written through the link');
    assert.equal(fs.existsSync(path.join(shared, '.workbench-skill.json')), false, 'no marker is written through the link');
    assert.ok(result.report.installed.some((entry) => entry.engine === 'claude' && entry.skill === 'genesis'),
      'the remaining skills still install');
  } finally {
    fs.rmSync(home, { recursive: true, force: true });
  }
});

test('a linked destination still blocks when it resolves to a file, to nothing, or to a directory without the skill', () => {
  for (const shape of ['file', 'dangling', 'directory-without-the-skill']) {
    const home = fixtureHome();
    try {
      const claudeRoot = path.join(home, '.claude', 'skills');
      fs.mkdirSync(claudeRoot, { recursive: true });
      const target = path.join(home, `shared-${shape}`);
      if (shape === 'file') fs.writeFileSync(target, 'not a skill directory\n');
      if (shape === 'directory-without-the-skill') fs.mkdirSync(target);
      fs.symlinkSync(target, path.join(claudeRoot, 'code-review'));

      const result = install(home);

      assert.notEqual(result.status, 0, shape);
      assert.equal(result.report.status, 'blocked', shape);
      assert.equal(result.report.error.code, 'skill-path-collision', shape);
      assert.equal(fs.existsSync(path.join(home, '.agents', 'skills')), false,
        `${shape} blocks before either discovery root is populated`);
    } finally {
      fs.rmSync(home, { recursive: true, force: true });
    }
  }
});

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
  'make-it-so', 'to-docs', 'to-spec', 'to-tickets', 'tracer-bullet', 'update-harness', 'carry', 'builder', 'auditor', 'reviewer', 'reconciler'
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
      fs.readFileSync(path.join(root, 'skills', 'genesis', 'SKILL.md'), 'utf8')
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
    assert.ok(status.length > 0, 'the installed skills are visible to the collection owner');
    assert.ok(status.every((line) => line.startsWith('??')),
      `every change is untracked, never staged or committed: ${status.join(', ')}`);
    assert.ok(result.report.gitOwnedRoots.includes(fs.realpathSync(gitRoot)),
      'the report names the Git-owned root it wrote into, so the operator is not surprised');
  } finally {
    fs.rmSync(home, { recursive: true, force: true });
  }
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
        fs.writeFileSync(file, 'existing stance instructions\n');
      }
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
      assert.deepEqual(Object.keys(marker).sort(), ['commit', 'contentHash', 'release', 'schemaVersion', 'source']);
      assert.equal(marker.schemaVersion, 2);
      assert.equal(marker.source, 'LLM Workbench core');
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

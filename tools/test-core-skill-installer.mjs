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
  'make-it-so', 'to-docs', 'to-spec', 'to-tickets', 'tracer-bullet', 'update-harness', 'builder', 'auditor', 'reviewer', 'reconciler'
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

test('a foreign Git-owned discovery root blocks before either engine is mutated', () => {
  const home = fixtureHome();
  try {
    fs.mkdirSync(path.join(home, '.agents', 'skills', '.git'), { recursive: true });

    const result = install(home);

    assert.notEqual(result.status, 0);
    assert.equal(result.report.status, 'blocked');
    assert.equal(result.report.error.code, 'foreign-git-root');
    assert.equal(fs.existsSync(path.join(home, '.claude', 'skills')), false);
  } finally {
    fs.rmSync(home, { recursive: true, force: true });
  }
});

test('a foreign Git-owned parent blocks before a missing discovery root is created', () => {
  const home = fixtureHome();
  try {
    fs.mkdirSync(path.join(home, '.agents', '.git'), { recursive: true });

    const result = install(home);

    assert.notEqual(result.status, 0);
    assert.equal(result.report.status, 'blocked');
    assert.equal(result.report.error.code, 'foreign-git-root');
    assert.equal(fs.existsSync(path.join(home, '.agents', 'skills')), false);
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
      assert.match(marker.commit, /^[0-9a-f]{40}$|^unknown$/);
      assert.match(marker.contentHash, /^[0-9a-f]{64}$/);
    }
    assert.equal(markers[0].contentHash, markers[1].contentHash, 'both engines install the same content');
    const other = JSON.parse(fs.readFileSync(path.join(home, '.claude', 'skills', 'builder', '.workbench-skill.json'), 'utf8'));
    assert.notEqual(other.contentHash, markers[0].contentHash, 'the hash covers the skill content, not the bundle');
  } finally {
    fs.rmSync(home, { recursive: true, force: true });
  }
});

#!/usr/bin/env node
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');

function git(cwd, ...args) {
  return execFileSync('git', ['-c', 'core.hooksPath=/dev/null', ...args], {
    cwd,
    encoding: 'utf8',
    env: {
      PATH: process.env.PATH,
      LANG: 'C',
      LC_ALL: 'C'
    }
  }).trim();
}

test('code-review fixed diff disables a hostile textconv driver', () => {
  const skill = read('skills/code-review/SKILL.md');
  const command = skill.match(
    /^git diff ((?:--[a-z-]+ )+)"\$BASE_SHA" "\$HEAD_SHA" --$/m
  );
  assert.ok(command, 'code-review must expose one parseable fixed-diff command');
  const documentedFlags = command[1].trim().split(/\s+/);
  const fixture = fs.mkdtempSync(path.join(tmpdir(), 'workbench-textconv-'));
  const marker = path.join(fixture, 'textconv-ran');
  const helper = path.join(fixture, 'hostile-textconv.sh');

  try {
    fs.writeFileSync(
      helper,
      `#!/bin/sh\n: > ${JSON.stringify(marker)}\ncat "$1"\n`,
      { mode: 0o755 }
    );
    git(fixture, 'init', '-b', 'main');
    git(fixture, 'config', 'user.name', 'Workbench Test');
    git(fixture, 'config', 'user.email', 'workbench@example.invalid');
    git(fixture, 'config', 'diff.hostile.textconv', helper);
    fs.writeFileSync(path.join(fixture, '.gitattributes'), '*.txt diff=hostile\n');
    fs.writeFileSync(path.join(fixture, 'sample.txt'), 'before\n');
    git(fixture, 'add', '.');
    git(fixture, 'commit', '-m', 'Base');
    const base = git(fixture, 'rev-parse', 'HEAD');
    fs.writeFileSync(path.join(fixture, 'sample.txt'), 'after\n');
    git(fixture, 'commit', '-am', 'Change');
    const head = git(fixture, 'rev-parse', 'HEAD');

    git(fixture, 'diff', base, head, '--');
    assert.equal(fs.existsSync(marker), true, 'the hostile fixture must execute without guards');
    fs.rmSync(marker);

    git(fixture, 'diff', ...documentedFlags, base, head, '--');
    assert.equal(
      fs.existsSync(marker),
      false,
      'the documented review diff must not execute target-controlled textconv'
    );
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
});

test('independence applies at integration, not every ticket close', () => {
  const skill = read('skills/implement/SKILL.md');
  assert.match(skill, /separate-context review.*integration/s);
  assert.match(skill, /Earlier review.*not.*mandatory independent/s);
  assert.doesNotMatch(skill, /Only after the exact-head review is green, close/);
  for (const stance of ['builder', 'auditor', 'reviewer', 'reconciler']) {
    const content = read(`skills/${stance}/SKILL.md`);
    for (const section of ['Purpose', 'Method / Posture', 'Obligations', 'Completion / Exit Condition']) {
      assert.ok(content.includes(`## ${section}`), `${stance}: ${section}`);
    }
    assert.match(content, /never grants, removes, or transfers authority/);
    assert.match(content, /never spawns/);
    assert.match(content, /assigned SPEC and TASK/);
  }
});

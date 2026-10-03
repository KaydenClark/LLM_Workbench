#!/usr/bin/env node
// Contract checks are structural, not configured-agent behavior proof.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skill = fs.readFileSync(path.join(root, 'workbench/skills/implement/SKILL.md'), 'utf8');
test('implementation resumes its Task and records proof before handback', () => {
  for (const required of ['TASK.md', 'receipt rows', 'already in progress',
    'receipt S-### --task TK-###', '/save', 'Worker self-check', 'Dispatcher',
    'pending recovery', 'authorized endpoint']) {
    assert.ok(skill.includes(required), `implement must name ${required}`);
  }
  assert.match(skill, /expected red[\s\S]*green/);
  assert.match(skill, /separate-context review[\s\S]*integration/);
  assert.match(skill, /does not authorize[\s\S]*approve/);
});
test('documented containment seam rejects unpublished work and accepts a descendant remote', () => {
  assert.ok(skill.includes('git merge-base --is-ancestor'));
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'implement-recovery-'));
  const run = (args, expected = 0) => {
    const r = spawnSync('git', ['-c', 'core.hooksPath=/dev/null', ...args], {cwd: dir, encoding: 'utf8'});
    assert.equal(r.status, expected, r.stderr);
    return r.stdout.trim();
  };
  try {
    run(['init', '-b', 'task']);
    run(['config', 'user.name', 'Implement fixture']);
    run(['config', 'user.email', 'fixture@example.invalid']);
    run(['commit', '--allow-empty', '-m', 'base']);
    run(['init', '--bare', path.join(dir, 'remote.git')]);
    run(['remote', 'add', 'origin', path.join(dir, 'remote.git')]);
    run(['push', 'origin', 'task']);
    run(['commit', '--allow-empty', '-m', 'candidate']);
    const candidate = run(['rev-parse', 'HEAD']);
    run(['fetch', 'origin']);
    run(['merge-base', '--is-ancestor', candidate, 'origin/task'], 1);
    run(['commit', '--allow-empty', '-m', 'receipt']);
    run(['push', 'origin', 'task']);
    run(['fetch', 'origin']);
    assert.notEqual(candidate, run(['rev-parse', 'origin/task']));
    run(['merge-base', '--is-ancestor', candidate, 'origin/task']);
  } finally { fs.rmSync(dir, {recursive: true, force: true}); }
});

#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const source = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const installer = path.join(source, 'tools/setup-pre-commit.mjs');
function fixture(remote = 'https://github.com/KaydenClark/LLM_Workbench.git') {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-pre-commit-'));
  const git = (...args) => spawnSync('git', ['-C', dir, ...args], { encoding: 'utf8' });
  for (const args of [['init', '-q'], ['config', 'user.name', 'Hook Fixture'], ['config', 'user.email', 'fixture@example.invalid'], ['remote', 'add', 'origin', remote]]) assert.equal(git(...args).status, 0);
  fs.writeFileSync(path.join(dir, 'README.md'), '# Hook fixture\n');
  git('add', 'README.md');
  assert.equal(git('commit', '-qm', 'Seed fixture').status, 0);
  const install = (...args) => spawnSync(process.execPath, [installer, '--repo', dir, ...args], { encoding: 'utf8' });
  return { dir, git, install };
}
function clean(dir) { fs.rmSync(dir, { recursive: true, force: true }); }

test('installed hook checks index bytes, accepts partial staging and rejects staged syntax and whitespace errors', () => {
  const f = fixture();
  try {
    const installed = f.install();
    assert.equal(installed.status, 0, installed.stderr);
    const report = JSON.parse(installed.stdout);
    assert.equal(f.git('config', '--local', '--get', 'core.hooksPath').stdout.trim(), report.hookDir);
    assert.equal(f.install().status, 0, 'same snapshot installation is idempotent');
    const file = path.join(f.dir, 'two words.mjs');
    fs.writeFileSync(file, 'export const answer = 1;\n');
    f.git('add', 'two words.mjs');
    fs.writeFileSync(file, 'export const broken = ;\n');
    assert.equal(f.git('commit', '-qm', 'Commit valid staged bytes').status, 0, 'unstaged invalid bytes do not block the commit');
    f.git('add', 'two words.mjs');
    fs.writeFileSync(file, 'export const answer = 2;\n');
    const badSyntax = f.git('commit', '-qm', 'Refuse invalid staged bytes');
    assert.notEqual(badSyntax.status, 0, 'valid working-tree bytes do not conceal invalid staged syntax');
    assert.match(badSyntax.stderr, /two words\.mjs/);
    f.git('add', 'two words.mjs');
    fs.writeFileSync(path.join(f.dir, 'README.md'), '# Bad staged whitespace  \n');
    f.git('add', 'README.md');
    const badWhitespace = f.git('commit', '-qm', 'Refuse trailing whitespace');
    assert.notEqual(badWhitespace.status, 0, 'staged whitespace errors block the commit');
    assert.match(badWhitespace.stderr + badWhitespace.stdout, /trailing whitespace/);
    assert.equal(f.git('-c', 'core.hooksPath=/dev/null', 'commit', '-qm', 'Explicit fixture-only bypass').status, 0, 'one-command bypass changes no stored configuration');
    assert.equal(f.git('config', '--local', '--get', 'core.hooksPath').stdout.trim(), report.hookDir);
  } finally { clean(f.dir); }
});

test('installer preserves existing hooks and refuses another repository without changing its configuration', () => {
  for (const collision of ['native', 'configured', 'other-repository']) {
    const f = fixture(collision === 'other-repository' ? 'https://github.com/example/another-project.git' : undefined);
    try {
      const hook = path.join(f.dir, '.git/hooks/pre-commit');
      if (collision === 'native') fs.writeFileSync(hook, '#!/bin/sh\nexit 0\n', { mode: 0o755 });
      if (collision === 'configured') f.git('config', '--local', 'core.hooksPath', '.existing-hooks');
      const before = fs.readFileSync(path.join(f.dir, '.git/config'));
      const result = f.install();
      assert.notEqual(result.status, 0, collision);
      assert.deepEqual(fs.readFileSync(path.join(f.dir, '.git/config')), before, 'refusal writes no config');
      assert.equal(fs.existsSync(path.join(f.dir, '.git/workbench-hooks')), false, 'refusal writes no hook snapshot');
      if (collision === 'native') assert.equal(fs.readFileSync(hook, 'utf8'), '#!/bin/sh\nexit 0\n');
    } finally { clean(f.dir); }
  }
});

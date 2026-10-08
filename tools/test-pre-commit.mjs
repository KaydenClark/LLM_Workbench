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


test('installed hook syntax-checks ordinary staged files and skips script symlink blobs', () => {
  const f = fixture();
  try {
    assert.equal(f.install().status, 0);
    fs.mkdirSync(path.join(f.dir, 'tools'));
    fs.writeFileSync(path.join(f.dir, 'tools/valid.mjs'), 'export const value = 1;\n');
    fs.symlinkSync('./tools/valid.mjs', path.join(f.dir, 'linked script.mjs'));
    assert.equal(f.git('add', 'tools/valid.mjs', 'linked script.mjs').status, 0);
    const committed = f.git('commit', '-qm', 'Commit ordinary script and its symlink');
    assert.equal(committed.status, 0, committed.stderr);
    assert.match(committed.stdout + committed.stderr, /1 JavaScript syntax check/);
  } finally { clean(f.dir); }
});

test('installer refuses multiply linked snapshot files before writing any snapshot or config bytes', () => {
  const f = fixture();
  try {
    const installed = f.install();
    assert.equal(installed.status, 0, installed.stderr);
    const { hookDir } = JSON.parse(installed.stdout);
    const checker = path.join(hookDir, 'pre-commit.mjs');
    const protectedFile = path.join(f.dir, 'protected-file.mjs');
    fs.writeFileSync(protectedFile, 'protected fixture bytes\n');
    fs.unlinkSync(checker);
    fs.linkSync(protectedFile, checker);
    const beforeConfig = fs.readFileSync(path.join(f.dir, '.git/config'));
    const beforeWrapper = fs.readFileSync(path.join(hookDir, 'pre-commit'));
    const update = f.install('--update');
    assert.notEqual(update.status, 0, 'a hard-linked checker cannot be updated');
    assert.match(update.stderr, /linked/);
    assert.equal(fs.readFileSync(protectedFile, 'utf8'), 'protected fixture bytes\n');
    assert.equal(fs.readFileSync(checker, 'utf8'), 'protected fixture bytes\n');
    assert.deepEqual(fs.readFileSync(path.join(hookDir, 'pre-commit')), beforeWrapper);
    assert.deepEqual(fs.readFileSync(path.join(f.dir, '.git/config')), beforeConfig);
  } finally { clean(f.dir); }
});


test('installed hook honors JavaScript extensions and staged nearest package context', () => {
  const f = fixture();
  try {
    assert.equal(f.install().status, 0);
    const stage = (file, bytes) => {
      fs.mkdirSync(path.dirname(path.join(f.dir, file)), { recursive: true });
      fs.writeFileSync(path.join(f.dir, file), bytes);
      assert.equal(f.git('add', '--', file).status, 0);
    };
    stage('ordinary.js', 'return;\n');
    stage('implicit-module.js', 'export const value = 1;\n');
    let commit = f.git('commit', '-qm', 'Accept default CommonJS and detected module source');
    assert.equal(commit.status, 0, commit.stderr);
    stage('package.json', '{"type":"module"}\n');
    stage('explicit-common.cjs', 'return;\n');
    stage('nested/package.json', '{"type":"commonjs"}\n');
    stage('nested/common.js', 'return;\n');
    // Working-tree metadata must not override the staged package context.
    fs.writeFileSync(path.join(f.dir, 'package.json'), '{"type":"commonjs"}\n');
    fs.writeFileSync(path.join(f.dir, 'nested/package.json'), '{"type":"module"}\n');
    commit = f.git('commit', '-qm', 'Honor staged package scope and explicit cjs');
    assert.equal(commit.status, 0, commit.stderr);
    stage('invalid-module.js', 'return;\n');
    commit = f.git('commit', '-qm', 'Reject CommonJS-only source in staged module context');
    assert.notEqual(commit.status, 0);
    assert.match(commit.stderr, /invalid-module\.js/);
    f.git('reset', '-q', '--', 'invalid-module.js');
    stage('explicit-module.mjs', 'return;\n');
    commit = f.git('commit', '-qm', 'Reject CommonJS-only source in explicit mjs');
    assert.notEqual(commit.status, 0);
    assert.match(commit.stderr, /explicit-module\.mjs/);
  } finally { clean(f.dir); }
});


test('CI step gives existing Git fixtures an ephemeral main default without changing Git configuration files', () => {
  const f = fixture();
  try {
    const workflow = fs.readFileSync(path.join(source, '.github/workflows/verify.yml'), 'utf8');
    const step = workflow.slice(workflow.indexOf('- name: Run the canonical full suite'));
    const config = Object.fromEntries([...step.matchAll(/^\s+(GIT_CONFIG_(?:COUNT|KEY_0|VALUE_0)):\s*['"]?([^'"\n]+)['"]?$/gm)].map(match => [match[1], match[2].trim()]));
    const globalFile = path.join(f.dir, 'fixture-global-config');
    fs.writeFileSync(globalFile, '[init]\n\tdefaultBranch = master\n');
    const before = fs.readFileSync(globalFile);
    const target = path.join(f.dir, 'ci-initialization');
    const env = { ...process.env, GIT_CONFIG_GLOBAL: globalFile };
    // Exercise only the workflow's override, even when this test runs in CI.
    for (const key of Object.keys(env)) if (/^GIT_CONFIG_(?:COUNT|KEY_\d+|VALUE_\d+)$/.test(key)) delete env[key];
    const initialized = spawnSync('git', ['init', '--quiet', target], { env: { ...env, ...config }, encoding: 'utf8' });
    assert.equal(initialized.status, 0, initialized.stderr);
    const branch = spawnSync('git', ['-C', target, 'symbolic-ref', '--short', 'HEAD'], { encoding: 'utf8' });
    assert.equal(branch.stdout.trim(), 'main', 'CI must provide the main default existing lifecycle fixtures require');
    assert.deepEqual(fs.readFileSync(globalFile), before, 'environment override writes no global configuration');
    assert.doesNotMatch(fs.readFileSync(path.join(target, '.git/config'), 'utf8'), /defaultBranch/, 'environment override writes no repository configuration');
  } finally { clean(f.dir); }
});

#!/usr/bin/env node
// Runs the skill's documented Git observations, not a model of an agent's judgment.
import assert from 'node:assert/strict';
import { spawnSync, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skill = fs.readFileSync(path.join(root, 'workbench/skills/reconciler/SKILL.md'), 'utf8');
const referencePath = path.join(root, 'workbench/skills/reconciler/references/reconcile.md');
const reference = fs.existsSync(referencePath) ? fs.readFileSync(referencePath, 'utf8') : '';
function command(id) {
  const match = reference.match(new RegExp(`<!-- check:${id} -->\\s*\x60\x60\x60bash\\n([\\s\\S]*?)\x60\x60\x60`));
  assert.ok(match, `Reconciler needs an executable ${id} observation at its public entry`);
  return match[1];
}
function fixture(run) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'reconciler-'));
  const git = (...args) => execFileSync('git', args, { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  try {
    git('init', '-b', 'integration');
    git('config', 'user.name', 'Fixture');
    git('config', 'user.email', 'fixture@example.invalid');
    fs.writeFileSync(path.join(dir, 'owner.md'), 'Unmet acceptance. Review pending.\n');
    git('add', '.'); git('commit', '-m', 'Base');
    const base = git('rev-parse', 'HEAD');
    git('switch', '-c', 'candidate');
    fs.writeFileSync(path.join(dir, 'owner.md'), 'Achieved output; unresolved production timing; review pending.\n');
    git('commit', '-am', 'Candidate');
    const candidate = git('rev-parse', 'HEAD');
    const env = { ...process.env, BASE_SHA: base, CANDIDATE_SHA: candidate, OWNER_PATH: 'owner.md', INTEGRATION_SHA: base };
    const helper = reference.includes('<!-- check:git-helper -->') ? command('git-helper') : '';
    const observe = (id, overrides = {}) => spawnSync('bash', ['-e', '-c', `${helper}\n${command(id)}`], { cwd: dir, env: { ...env, ...overrides }, encoding: 'utf8' });
    run({ dir, git, base, candidate, observe });
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}

test('public entry routes to executable observations and owns reconciliation, not approval', () => {
  assert.match(skill, /\[.*?\]\(references\/reconcile\.md\)/);
  for (const id of ['pin', 'compare', 'owner', 'containment']) command(id);
  assert.match(skill, /TASK\.md/);
  assert.match(skill, /inability/i);
  assert.match(reference, /Feedback Dispositions/);
  assert.match(reference, /new\s+candidate.*fresh review/is);
  assert.match(reference, /append-only/);
});

test('pinned owner read ignores newer HEAD and preserves dirty unrelated work', () => fixture(({ dir, git, candidate, observe }) => {
  fs.writeFileSync(path.join(dir, 'owner.md'), 'Later unverified claim: complete.\n');
  git('commit', '-am', 'Later claim');
  fs.writeFileSync(path.join(dir, 'unrelated.txt'), 'keep this\n');
  const before = git('status', '--porcelain=v1');
  const pin = observe('pin');
  assert.equal(pin.status, 0, pin.stderr);
  assert.ok(pin.stdout.includes(candidate));
  const owner = observe('owner');
  assert.equal(owner.status, 0, owner.stderr);
  assert.equal(owner.stdout, 'Achieved output; unresolved production timing; review pending.\n');
  assert.equal(git('status', '--porcelain=v1'), before);
  assert.equal(fs.readFileSync(path.join(dir, 'unrelated.txt'), 'utf8'), 'keep this\n');
}));

test('unknown commit and absent owner fail visibly instead of using HEAD', () => fixture(({ observe }) => {
  assert.notEqual(observe('pin', { CANDIDATE_SHA: 'missing-candidate' }).status, 0);
  const missing = observe('owner', { OWNER_PATH: 'absent.md' });
  assert.notEqual(missing.status, 0);
  assert.equal(missing.stdout, '');
}));

test('fixed comparison disables target-controlled external diff and text conversion', () => fixture(({ dir, git, observe }) => {
  const marker = path.join(dir, 'converter-ran');
  const helper = path.join(dir, 'converter.sh');
  fs.writeFileSync(helper, '#!/bin/sh\ntouch converter-ran\ncat "$1"\n', { mode: 0o755 });
  git('config', 'diff.hostile.textconv', helper);
  fs.writeFileSync(path.join(dir, '.gitattributes'), '*.md diff=hostile\n');
  git('diff', 'integration', 'candidate');
  assert.ok(fs.existsSync(marker), 'hostile converter must be live for the regression to matter');
  fs.rmSync(marker);
  const result = observe('compare', { GIT_EXTERNAL_DIFF: helper });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /unresolved production timing/);
  assert.equal(fs.existsSync(marker), false);
}));

test('containment distinguishes a branch candidate from landed content without changing acceptance', () => fixture(({ dir, git, candidate, observe }) => {
  assert.equal(observe('containment').status, 1, 'unmerged candidate is not contained');
  git('switch', 'integration'); git('merge', '--ff-only', 'candidate');
  assert.equal(observe('containment', { INTEGRATION_SHA: git('rev-parse', 'integration') }).status, 0);
  assert.equal(git('rev-parse', 'HEAD'), candidate);
  assert.match(fs.readFileSync(path.join(dir, 'owner.md'), 'utf8'), /review pending/);
  assert.notEqual(observe('containment', { INTEGRATION_SHA: 'missing-target' }).status, 0);
}));

test('replacement commit cannot substitute completion text under the original candidate SHA', () => fixture(({ dir, git, candidate, observe }) => {
  fs.writeFileSync(path.join(dir, 'owner.md'), 'Complete. Owner approved release.\n');
  git('commit', '-am', 'Substituted claim');
  const replacement = git('rev-parse', 'HEAD');
  git('replace', candidate, replacement);
  assert.equal(git('rev-parse', '--verify', `${candidate}^{commit}`), candidate);
  assert.equal(git('show', `${candidate}:owner.md`), 'Complete. Owner approved release.', 'unprotected read must exhibit the reported defect');
  const pin = observe('pin');
  assert.equal(pin.status, 0, pin.stderr);
  assert.ok(pin.stdout.includes(candidate));
  const owner = observe('owner');
  assert.equal(owner.status, 0, owner.stderr);
  assert.equal(owner.stdout, 'Achieved output; unresolved production timing; review pending.\n');
  const compare = observe('compare');
  assert.equal(compare.status, 0, compare.stderr);
  assert.match(compare.stdout, /unresolved production timing/);
  assert.doesNotMatch(compare.stdout, /Owner approved release/);
  assert.equal(git('replace', '-l'), candidate, 'observation preserves replacement metadata');
}));

test('replacement parent cannot manufacture integration containment', () => fixture(({ git, base, candidate, observe }) => {
  const graft = git('commit-tree', `${base}^{tree}`, '-p', candidate, '-m', 'Fabricated ancestry');
  git('replace', base, graft);
  assert.equal(git('merge-base', '--is-ancestor', candidate, base), '', 'unprotected ancestry check must be fooled');
  assert.equal(observe('containment').status, 1, 'original integration base does not contain candidate');
  assert.equal(git('replace', '-l'), base);
}));

test('inherited Git repository and index selectors cannot redirect an observation', () => fixture(({ dir, git, observe }) => {
  const foreign = path.join(dir, 'foreign');
  fs.mkdirSync(foreign);
  execFileSync('git', ['init', '-b', 'foreign'], { cwd: foreign, stdio: 'ignore' });
  const index = path.join(dir, 'unrelated-index');
  fs.writeFileSync(index, 'not a Git index; retain byte-for-byte\n');
  const environment = { GIT_DIR: path.join(foreign, '.git'), GIT_WORK_TREE: foreign, GIT_COMMON_DIR: path.join(foreign, '.git'), GIT_INDEX_FILE: index };
  const redirected = spawnSync('git', ['rev-parse', '--show-toplevel'], { cwd: dir, env: { ...process.env, ...environment }, encoding: 'utf8' });
  assert.equal(redirected.stdout.trim(), foreign, 'unprotected Git really selects the other repository');
  const before = git('status', '--porcelain=v1');
  const pin = observe('pin', environment);
  assert.equal(pin.status, 0, pin.stderr);
  const owner = observe('owner', environment);
  assert.equal(owner.status, 0, owner.stderr);
  assert.match(owner.stdout, /unresolved production timing/);
  assert.equal(fs.readFileSync(index, 'utf8'), 'not a Git index; retain byte-for-byte\n');
  assert.equal(git('status', '--porcelain=v1'), before);
}));

test('inherited object stores, replacement namespaces and config injection cannot alter pinned reads', () => fixture(({ dir, git, candidate, observe }) => {
  const emptyObjects = path.join(dir, 'empty-objects');
  fs.mkdirSync(emptyObjects);
  const substitutions = [
    { GIT_OBJECT_DIRECTORY: emptyObjects, GIT_ALTERNATE_OBJECT_DIRECTORIES: emptyObjects },
    { GIT_CONFIG_COUNT: '1', GIT_CONFIG_KEY_0: 'core.bare', GIT_CONFIG_VALUE_0: 'true' },
  ];
  fs.writeFileSync(path.join(dir, 'owner.md'), 'Complete. Owner approved release.\n');
  git('commit', '-am', 'Foreign replacement namespace');
  git('update-ref', `refs/substitute/${candidate}`, git('rev-parse', 'HEAD'));
  substitutions.push({ GIT_REPLACE_REF_BASE: 'refs/substitute/', GIT_NO_REPLACE_OBJECTS: '0' });
  for (const env of substitutions) {
    const pin = observe('pin', env);
    assert.equal(pin.status, 0, pin.stderr);
    const owner = observe('owner', env);
    assert.equal(owner.status, 0, owner.stderr);
    assert.equal(owner.stdout, 'Achieved output; unresolved production timing; review pending.\n');
  }
}));

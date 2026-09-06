#!/usr/bin/env node
// Execute the documented shell recipe against disposable Git repositories.
// Only GitHub's merge API is simulated; containment and branch operations are real Git.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const doc = fs.readFileSync(path.join(root, 'RUNBOOK.md'), 'utf8');
const section = doc.slice(doc.indexOf('Closeout, once the integration review has passed'));
const recipe = section.match(/```bash\n([\s\S]*?)```/)[1];

function fixture(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'closeout-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const cwd = path.join(dir, 'repo');
  const remote = path.join(dir, 'remote.git');
  fs.mkdirSync(cwd);
  const git = (...args) => {
    const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    return result.stdout.trim();
  };
  git('init', '--bare', remote);
  git('init', '-b', 'integration');
  git('config', 'user.name', 'Closeout Test');
  git('config', 'user.email', 'closeout@example.invalid');
  git('commit', '--allow-empty', '-m', 'base');
  git('remote', 'add', 'origin', remote);
  git('push', '-u', 'origin', 'integration');
  git('switch', '-c', 'codex/short-description');
  git('commit', '--allow-empty', '-m', 'candidate');
  git('push', '-u', 'origin', 'codex/short-description');
  const head = git('rev-parse', 'HEAD');
  // Reproduce the owner host's integration worktree without touching that host.
  git('worktree', 'add', path.join(dir, 'integration'), 'integration');
  const bin = path.join(dir, 'bin');
  fs.mkdirSync(bin);
  fs.writeFileSync(path.join(bin, 'gh'), `#!/bin/bash
set -eu
case "$*" in *--delete-branch*) echo premature-delete >&2; exit 92;; esac
[ "$FAKE_MERGE" != fail ] || exit 91
if [ "$FAKE_MERGE" != noop ]; then
  git push origin "$EXPECTED_HEAD:refs/heads/integration"
fi
if [ "$FAKE_MERGE" = deleted ]; then
  git push origin --delete codex/short-description
  git switch --detach "$EXPECTED_HEAD"
  git branch -d codex/short-description
fi
`, { mode: 0o755 });
  return { git, head, run(mode, cleanup = 'yes', expected = head) {
    return spawnSync('bash', ['-c', recipe], { cwd, encoding: 'utf8', env: {
      ...process.env, PATH: `${bin}:${process.env.PATH}`, FAKE_MERGE: mode,
      EXPECTED_HEAD: expected, TASK_BRANCH: 'codex/short-description', PR_NUMBER: '1', CLEANUP: cleanup
    } });
  } };
}

for (const mode of ['fail', 'noop']) test(`closeout preserves branches when merge ${mode}`, t => {
  const f = fixture(t); const result = f.run(mode);
  assert.notEqual(result.status, 0, result.stdout);
  assert.equal(f.git('rev-parse', 'refs/heads/codex/short-description'), f.head);
  assert.match(f.git('ls-remote', 'origin', 'refs/heads/codex/short-description'), new RegExp(f.head));
});
test('closeout merges and cleans with integration held by another worktree', t => {
  const f = fixture(t); const result = f.run('ok');
  assert.equal(result.status, 0, result.stderr);
  assert.equal(f.git('rev-parse', 'origin/integration'), f.head);
  assert.equal(f.git('branch', '--list', 'codex/short-description'), '');
  assert.equal(f.git('ls-remote', 'origin', 'refs/heads/codex/short-description'), '');
});
test('closeout honors owner-deferred cleanup', t => {
  const f = fixture(t); const result = f.run('ok', 'no');
  assert.equal(result.status, 0, result.stderr);
  assert.equal(f.git('rev-parse', 'origin/integration'), f.head);
  assert.equal(f.git('rev-parse', 'refs/heads/codex/short-description'), f.head);
  assert.match(f.git('ls-remote', 'origin', 'refs/heads/codex/short-description'), new RegExp(f.head));
});
test('closeout tolerates branches already deleted after merge', t => {
  const f = fixture(t); const result = f.run('deleted');
  assert.equal(result.status, 0, result.stderr);
  assert.equal(f.git('rev-parse', 'origin/integration'), f.head);
});
test('closeout rejects a candidate differing from the reviewed commit', t => {
  const f = fixture(t); const result = f.run('ok', 'yes', f.git('rev-parse', 'HEAD^'));
  assert.notEqual(result.status, 0);
  assert.equal(f.git('rev-parse', 'refs/heads/codex/short-description'), f.head);
});

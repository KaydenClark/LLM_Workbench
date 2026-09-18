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
  // S-00J TK-004: the recipe's new gate line runs
  // `node workbench/tools/spec-workbench.mjs gate ...` relative to the
  // checkout it closes out - exactly like a real LLM_Workbench closeout,
  // whose own repo already carries these tools. A disposable fixture repo
  // otherwise has none of them, so this copies the room's real, self-
  // contained tool modules (no external dependency, `node:*` only) in, and
  // adds a fixture Spec for the gate to read.
  fs.cpSync(path.join(root, 'workbench', 'tools'), path.join(cwd, 'workbench', 'tools'), { recursive: true });
  fs.mkdirSync(path.join(cwd, 'specs', 'S-900-fixture'), { recursive: true });
  fs.writeFileSync(path.join(cwd, 'specs', 'S-900-fixture', 'SPEC.md'), [
    '# S-900 - Fixture Capability',
    '',
    '**Spec ID:** S-900',
    '**Status:** active',
    '**Priority:** 0',
    '**Owner:** agent',
    '**Updated:** 2026-09-18',
    '**Catalog description:** Fixture for the closeout recipe\'s gate line.',
    '**Blockers:** none',
    '**Latest event:** Spec activated.',
    '**Next gate:** Complete TK-001.',
    '',
    '## Vertical Implementation Slices',
    '',
    '| Task | Slice | Status | Blockers | Proof |',
    '|---|---|---|---|---|',
    '| TK-001 | First slice | ready | none | pending |',
    '',
    '## Acceptance Criteria',
    '',
    '- [ ] Expected behavior is verified.',
    '',
    '## Append-Only Evidence And Execution Log',
    '',
    '| Date | Task | Event | Verification | Docs | Remaining gap |',
    '|---|---|---|---|---|---|',
    '',
    '## Completion Result',
    '',
    'Pending.',
    '',
    '## Supersession',
    '',
    '- Supersedes: none',
    '- Superseded by: none',
    ''
  ].join('\n'));
  git('add', '-A');
  git('commit', '-m', 'add workbench tools and a fixture Spec for the gate');
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
  // `gate` defaults to a Task-PR invocation (`taskId: 'TK-001'`) against the
  // fixture Spec above, which S-00O exemption 2 always reports rather than
  // refuses regardless of the Spec's own completeness - so every pre-
  // existing test below, none of which is about the gate at all, keeps
  // exercising real merge/branch mechanics unaffected by it. Passing
  // `taskId: null` switches to the Spec-candidate form the same recipe line
  // uses once a real Spec candidate exists.
  return { git, head, run(mode, cleanup = 'yes', expected = head, { taskId = 'TK-001', specId = 'S-900' } = {}) {
    return spawnSync('bash', ['-c', recipe], { cwd, encoding: 'utf8', env: {
      ...process.env, PATH: `${bin}:${process.env.PATH}`, FAKE_MERGE: mode,
      EXPECTED_HEAD: expected, TASK_BRANCH: 'codex/short-description', PR_NUMBER: '1', CLEANUP: cleanup,
      SPEC_ID: specId, ...(taskId ? { TASK_ID: taskId } : {})
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

// S-00J TK-004: the gate line runs before `gh pr merge`. A Spec-candidate
// invocation against the fixture Spec (deliberately incomplete: an
// unfinished Task, unchecked acceptance, no completion result, no evidence)
// refuses and stops the recipe under `set -eu` before the merge step ever
// runs - "the closeout path proceeds for an incomplete Spec candidate" is
// exactly the gap this closes. The same fixture Spec presented as a Task PR
// (the recipe's actual documented line, `taskId` defaulted above) is
// reported rather than refused, so the recipe proceeds all the way through
// the merge, regardless of the Spec's own completeness.
test('closeout gate refuses an incomplete Spec candidate and stops before the merge', t => {
  const f = fixture(t);
  const result = f.run('ok', 'yes', f.head, { taskId: null });
  assert.notEqual(result.status, 0, result.stdout);
  // `gate` reports (never throws) - it names the refusal reason in its own
  // JSON result on stdout, and the CLI dispatch sets the non-zero exit code
  // from `result.refused`, exactly like `doctor`.
  assert.match(result.stdout, /S-900 is not complete/);
  assert.notEqual(f.git('rev-parse', 'origin/integration'), f.head, 'the merge never ran - origin/integration stays at its pre-closeout tip');
  assert.equal(f.git('rev-parse', 'refs/heads/codex/short-description'), f.head, 'the branch is preserved - the gate refusal stopped the recipe before any merge or cleanup');
});
test('closeout gate reports (never refuses) a Task PR, so the recipe proceeds', t => {
  const f = fixture(t);
  const result = f.run('ok', 'yes', f.head, { taskId: 'TK-001' });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(f.git('rev-parse', 'origin/integration'), f.head, 'the Task-PR gate reports rather than refuses, even against the same incomplete Spec, so the merge proceeds');
});

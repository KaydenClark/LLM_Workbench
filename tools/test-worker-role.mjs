#!/usr/bin/env node
// Source contract checks only: these do not execute an agent or prove installation.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');
const skill = read('workbench/specs/S-002E-worker-role/candidate/worker/SKILL.md');
assert.match(skill, /^---\nname: worker\ndescription: .+\n---/);
for (const section of ['Purpose', 'Method / Posture', 'Obligations', 'Completion / Exit Condition']) {
  assert.ok(skill.includes(`## ${section}`), section);
}
for (const phrase of ['one Task and one attempt', 'assigned stance', 'conflicting writer',
  'red/green', 'Dispatcher', 'exact candidate SHA', 'remaining gap',
  'unsupported host', 'never approves', 'shared Spec', 'Task-authoring assistance']) {
  assert.ok(skill.includes(phrase), `missing contract: ${phrase}`);
}
assert.doesNotMatch(skill, /S-002E|\/workspace\/|v3\.2\.1/);
const wiki = read('workbench/wiki/skill-worker-role.md');
assert.match(wiki, /candidate\/worker\/SKILL\.md/);
assert.match(wiki, /not installed/);
assert.match(wiki, /source.contract/i);
console.log('PASS Worker staged source contract and Wiki links (not agent behavior or installation)');

// Optional independent state inspection of a completed disposable agent run.
// The agent transcript must separately establish loading, refusal and red/green.
if (process.argv[2] === '--scenario') {
  const cwd = process.argv[3];
  assert.ok(cwd, 'provide the disposable scenario repository');
  const git = (...args) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
  assert.equal(git('show', 'HEAD:worker-skill.md'), skill.trimEnd(), 'scenario loaded the exact staged entry');
  const base = git('rev-parse', 'spec/totals');
  const head = git('rev-parse', 'codex/task-100');
  assert.notEqual(head, base, 'scenario must produce a candidate');
  assert.equal(git('rev-parse', 'main'), base, 'main unchanged');
  assert.equal(git('branch', '--show-current'), 'codex/task-100');
  assert.equal(git('status', '--porcelain'), '', 'recoverable clean result');
  const changed = git('diff', '--name-only', base, head).split('\n').sort();
  assert.deepEqual(changed, ['docs/total.md', 'src/total.mjs', 'test/total.mjs', 'worker-log.md']);
  assert.equal(git('diff', base, head, '--', 'SPEC.md', 'TASK.md', 'shared/rates.json'), '');
  const remote = git('ls-remote', 'origin', 'refs/heads/codex/task-100').split(/\s/)[0];
  assert.equal(remote, head, 'published remote candidate');
  execFileSync(process.execPath, ['test/total.mjs'], { cwd, stdio: 'pipe' });
  execFileSync(process.execPath, ['--input-type=module', '-e',
    "import assert from 'node:assert/strict'; import {sum} from './src/total.mjs'; assert.equal(sum([100,200]),300); assert.throws(()=>sum([-1]),RangeError);"], { cwd, stdio: 'pipe' });
  console.log(`PASS inspected scenario candidate ${head}; transcript still required for agent process claims`);
}

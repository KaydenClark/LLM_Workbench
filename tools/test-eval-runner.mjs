#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'eval-runner-'));
const bin = path.join(temp, 'bin');
const python = process.platform === 'win32' ? 'python' : 'python3';
fs.mkdirSync(bin);

try {
  const codexLog = path.join(temp, 'codex-args.json');
  const claudeLog = path.join(temp, 'claude-args.json');
  writeExecutable('codex', `#!/usr/bin/env node
const fs = require('node:fs');
const args = process.argv.slice(2);
fs.writeFileSync(process.env.FAKE_CODEX_LOG, JSON.stringify(args));
const out = args[args.indexOf('--output-last-message') + 1];
fs.writeFileSync(out, 'Incomplete; tests did not run.');
`);
  writeExecutable('claude', `#!/usr/bin/env node
const fs = require('node:fs');
fs.writeFileSync(process.env.FAKE_CLAUDE_LOG, JSON.stringify(process.argv.slice(2)));
process.stdout.write(JSON.stringify({result: 'Incomplete; tests did not run.'}));
`);

  const codexOut = path.join(temp, 'codex.jsonl');
  run([
    '--task', 'evals/tasks/task_a_scope_honesty',
    '--conditions', 'c2_ours_main',
    '--condition-ref', 'c2_ours_main=HEAD',
    '--trials', '1',
    '--provider', 'codex',
    '--model', 'gpt-5.6-terra',
    '--reasoning-effort', 'high',
    '--feedback-fingerprint', 'abc123def456',
    '--base-sha', 'base123',
    '--candidate-sha', 'candidate456',
    '--out', codexOut
  ], { FAKE_CODEX_LOG: codexLog });

  const codexRow = JSON.parse(fs.readFileSync(codexOut, 'utf8').trim());
  assert.equal(codexRow.provider, 'codex');
  assert.equal(codexRow.task_class, 'development');
  assert.equal(codexRow.evidence_class, 'real-agent');
  assert.equal(codexRow.reasoning_effort, 'high');
  assert.equal(codexRow.condition_ref, 'HEAD');
  assert.match(codexRow.condition_sha, /^[a-f0-9]{40}$/);
  assert.equal(codexRow.base_sha, 'base123');
  assert.equal(codexRow.candidate_sha, 'candidate456');
  assert.equal(codexRow.feedback_fingerprint, 'abc123def456');
  assert.equal(codexRow.trial_count, 1);

  const codexArgs = JSON.parse(fs.readFileSync(codexLog, 'utf8'));
  assert.ok(codexArgs.includes('--ephemeral'));
  assert.ok(codexArgs.includes('--ignore-user-config'));
  assert.deepEqual(pair(codexArgs, '--sandbox'), ['--sandbox', 'workspace-write']);
  assert.deepEqual(pair(codexArgs, '--model'), ['--model', 'gpt-5.6-terra']);
  assert.ok(codexArgs.includes('model_reasoning_effort="high"'));

  const claudeOut = path.join(temp, 'claude.jsonl');
  run([
    '--task', 'evals/tasks/task_a_scope_honesty',
    '--conditions', 'c0_none',
    '--trials', '1',
    '--provider', 'claude',
    '--model', 'claude-test',
    '--out', claudeOut
  ], { FAKE_CLAUDE_LOG: claudeLog, ANTHROPIC_API_KEY: 'test-only' });
  const claudeRow = JSON.parse(fs.readFileSync(claudeOut, 'utf8').trim());
  assert.equal(claudeRow.provider, 'claude');
  assert.ok(fs.existsSync(claudeLog), 'legacy Claude provider should still be invoked');
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}

console.log('ok - provider-neutral eval runner passed without model usage');

function run(args, extraEnv) {
  execFileSync(python, ['evals/run.py', ...args], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, PATH: `${bin}${path.delimiter}${process.env.PATH}`, ...extraEnv }
  });
}

function writeExecutable(name, content) {
  if (process.platform === 'win32') {
    const script = path.join(bin, `${name}.cjs`);
    fs.writeFileSync(script, content.replace(/^#![^\n]*\n/, ''));
    fs.writeFileSync(
      path.join(bin, `${name}.cmd`),
      `@echo off\r\nnode "%~dp0${name}.cjs" %*\r\n`
    );
    return;
  }
  const file = path.join(bin, name);
  fs.writeFileSync(file, content);
  fs.chmodSync(file, 0o755);
}

function pair(args, flag) {
  const index = args.indexOf(flag);
  return args.slice(index, index + 2);
}

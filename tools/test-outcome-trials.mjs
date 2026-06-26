#!/usr/bin/env node
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-outcome-test-'));
const outFile = path.join(outDir, 'results.jsonl');
const reportFile = path.join(outDir, 'report.md');
const agent = path.join(root, 'outcomes/mock-agents/condition-aware-agent.mjs');

execFileSync('node', [
  path.join(root, 'tools/run-outcome-trials.mjs'),
  '--task', path.join(root, 'outcomes/tasks/discount-bounds'),
  '--conditions', 'control:none,workbench:local',
  '--trials', '1',
  '--agent-command', `node "${agent}"`,
  '--out', outFile
], { cwd: root, encoding: 'utf8' });

const rows = fs.readFileSync(outFile, 'utf8')
  .trim()
  .split('\n')
  .map((line) => JSON.parse(line));

assert.equal(rows.length, 2, 'one trial per condition should be recorded');

const byCondition = Object.fromEntries(rows.map((row) => [row.condition, row]));
assert.equal(byCondition['control:none'].scores.correctness, 0, 'control should fail the acceptance test in this synthetic self-test');
assert.equal(byCondition['control:none'].scores.verification_honesty, 0, 'control should be caught when it falsely claims success');
assert.equal(byCondition['workbench:local'].scores.correctness, 1, 'workbench condition should pass the acceptance test in this synthetic self-test');
assert.equal(byCondition['workbench:local'].scores.scope_adherence, 1, 'workbench condition should stay inside the allowlist');
assert.equal(byCondition['workbench:local'].scores.docs_upkeep, 1, 'workbench condition should update stale docs');

execFileSync('node', [
  path.join(root, 'tools/score-outcome-trials.mjs'),
  outFile,
  '--baseline', 'control:none',
  '--report', reportFile
], { cwd: root, encoding: 'utf8' });

const report = fs.readFileSync(reportFile, 'utf8');
assert.match(report, /workbench:local/);
assert.match(report, /composite/);
assert.match(report, /control:none/);

console.log('ok - outcome trial harness self-test passed');

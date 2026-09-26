#!/usr/bin/env node
// TK-002S public CLI demo: fixture data only; the disposable room is removed.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tool = path.join(root, 'workbench/tools/landmark-tracker.mjs');
const declaration = JSON.parse(fs.readFileSync(path.join(root, 'workbench/manifest.json'))).landmarkTracker;
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dqc-result-demo-'));
function cli(args, json = true) {
  const run = spawnSync(process.execPath, [tool, ...args, '--path', dir, ...(json ? ['--json'] : [])], { encoding: 'utf8' });
  assert.equal(run.status, 0, run.stdout + run.stderr);
  return json ? JSON.parse(run.stdout) : run.stdout;
}
try {
  for (const relative of Object.values(declaration.collections)) fs.mkdirSync(path.join(dir, relative), { recursive: true });
  fs.writeFileSync(path.join(dir, 'workbench/manifest.json'), JSON.stringify({ schemaVersion: 2, landmarkTracker: declaration }));
  const { id } = cli(['capture', '--title', 'Fixture restart continuity', '--question', 'What survives a fixture restart?', '--source', 'FX-1@r1', '--reason', 'Fixture synthesis']);
  cli(['revise', id, '--expect-revision', '1', '--expected-change', 'Document restart behavior', '--expected-home', 'Fixture Wiki', '--reason', 'Intended outcome']);
  cli(['revise', id, '--expect-revision', '2', '--result', 'Restart behavior documented and exercised', '--reason', 'Observed fixture delivery']);
  cli(['rebuild']);
  const shown = cli(['show', id]);
  assert.deepEqual(shown.record.result, { summary: 'Restart behavior documented and exercised', revision: 3 });
  assert.equal(shown.record.expectedResult.change, 'Document restart behavior');
  assert.equal(shown.record.assessment, null);
  assert.equal(shown.record.confirmation, null);
  process.stdout.write(cli(['show', id], false));
  process.stdout.write('ok - Result persisted after restart/rebuild; assessment and confirmation remain unset\n');
} finally {
  fs.rmSync(dir, { recursive: true, force: true });
}

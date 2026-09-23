#!/usr/bin/env node
// The cross-provider acceptance fixture must build a real planning checkpoint
// without a provider and must fail closed when nothing resumed it.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { plan, verify } from './cross-provider-resume.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-cross-provider-'));
try {
  const record = plan(workspace, '2026-09-04');
  assert.match(record.planningSha, /^[0-9a-f]{40}$/);
  assert.equal(fs.existsSync(path.join(workspace, 'planning-clone')), false, 'the planning context is destroyed after the push');
  // S-00V: the candidate skills travel inside the room's skills lane; the
  // isolated provider home carries none, so nothing outside the clone is
  // reachable by the resuming provider.
  assert.equal(record.skillsLane, 'workbench/skills');
  assert.equal(fs.existsSync(path.join(record.providerHome, '.agents', 'skills')), false, 'the isolated home carries no skills');
  assert.equal(fs.existsSync(path.join(record.providerHome, '.claude', 'skills')), false, 'the isolated home carries no skills');
  assert.equal(fs.existsSync(path.join(record.codexHome, 'config.toml')), false, 'the fixture must not weaken host sandbox or approval settings');
  assert.equal(fs.existsSync(path.join(record.codexHome, 'skills')), false, 'the fixture must not create duplicate Codex discovery');
  const pushedLane = execFileSync('git', ['ls-tree', '--name-only', 'main', 'workbench/skills/'], { cwd: record.remote, encoding: 'utf8' }).split('\n').filter(Boolean);
  const bundleSize = fs.readdirSync(path.join(root, 'workbench', 'skills'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory()).length;
  assert.equal(pushedLane.filter((entry) => !entry.endsWith('.json') && !entry.endsWith('.md')).length, bundleSize, 'the pushed checkpoint carries the whole bundle in its lane');
  for (const stance of ['builder', 'auditor', 'reviewer', 'reconciler']) {
    assert.ok(pushedLane.includes(`workbench/skills/${stance}`), `${stance} travels with the room`);
  }
  const remoteHead = execFileSync('git', ['ls-remote', record.remote, 'main'], { encoding: 'utf8' }).split('\t')[0];
  assert.equal(remoteHead, record.planningSha, 'the planning checkpoint is remotely recoverable');
  const result = verify(workspace);
  assert.equal(result.status, 'failed', 'verify must fail closed when nothing resumed the checkpoint');
  assert.ok(result.failures.some((failure) => /did not advance/.test(failure)));
  assert.ok(result.failures.some((failure) => /not closed with proof/.test(failure)));
  console.log('ok - cross-provider fixture plans a recoverable checkpoint and fails closed without a resume');
} finally {
  fs.rmSync(workspace, { recursive: true, force: true });
}

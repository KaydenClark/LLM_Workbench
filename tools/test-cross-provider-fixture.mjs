#!/usr/bin/env node
// The cross-provider acceptance fixture must build a real planning checkpoint
// without a provider and must fail closed when nothing resumed it.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { plan, verify } from './cross-provider-resume.mjs';

const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-cross-provider-'));
try {
  const record = plan(workspace, '2026-09-04');
  assert.match(record.planningSha, /^[0-9a-f]{40}$/);
  assert.equal(fs.existsSync(path.join(workspace, 'planning-clone')), false, 'the planning context is destroyed after the push');
  assert.equal(fs.existsSync(path.join(record.codexHome, 'skills', 'implement', 'SKILL.md')), true, 'the isolated home carries the candidate skills');
  assert.equal(record.installedSkills, 32);
  for (const stance of ['builder', 'auditor', 'reviewer', 'reconciler']) {
    assert.ok(fs.statSync(path.join(record.codexHome, 'skills', stance, 'SKILL.md')).isFile());
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

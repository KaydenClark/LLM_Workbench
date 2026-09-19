import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { RUNTIME_TOOLS } from '../workbench/tools/workbench-layout.mjs';
import { inspectSelfDrift } from '../workbench/tools/self-drift.mjs';

assert.ok(RUNTIME_TOOLS.includes('self-drift.mjs'), 'installed runtime includes the public self-drift seam');
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'self-drift-'));
function write(file, text) { fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true }); fs.writeFileSync(path.join(root, file), text); }
try {
  write('workbench/manifest.json', JSON.stringify({ schemaVersion: 2, workbenchVersion: 'v3.2.1', lanes: { specs: 'workbench/specs', tools: 'workbench/tools', wiki: 'workbench/wiki' }, collections: { adr: 'workbench/docs/adr', notepads: 'workbench/sessions/notepads' } }));
  for (const file of ['AGENTS.md', 'BLUEPRINT.md', 'LEXICON.md', 'RUNBOOK.md', 'README.md', 'TASKBOARD.md', 'workbench/specs/CATALOG.md', 'workbench/wiki/MEMORY.md', 'workbench/docs/adr/REGISTER.md']) write(file, '# Current\n');
  write('workbench/specs/S-001-example/SPEC.md', '**Spec ID:** S-001\n**Status:** complete\n**Blockers:** none\n## Completion Result\nVerified.\n');
  write('workbench/specs/S-002-example/SPEC.md', '**Spec ID:** S-002\n**Status:** blocked\n**Blockers:** S-001\n## Completion Result\nPending.\n');
  let report = inspectSelfDrift(root);
  assert.ok(report.findings.some(f => f.code === 'resolved-blocker' && f.artifact.endsWith('S-002-example/SPEC.md')));
  write('workbench/specs/S-002-example/SPEC.md', '**Spec ID:** S-002\n**Status:** planned\n**Blockers:** none\n## Completion Result\nPending.\n');
  write('workbench/specs/retired/S-003-example/SPEC.md', '**Spec ID:** S-003\n**Status:** complete\n## Append-Only Evidence And Execution Log\nOld version v1.0.0 was pending.\n');
  report = inspectSelfDrift(root);
  assert.ok(!report.findings.some(f => f.code === 'resolved-blocker'));
  assert.equal(report.inventory.find(i => i.artifact.includes('S-003')).classification, 'historical');
  assert.equal(report.inventory.find(i => i.artifact.includes('S-002')).classification, 'planned');
  write('workbench/specs/S-001-example/SPEC.md', '**Spec ID:** S-001\n**Status:** complete\n## Completion Result\nPending.\n');
  assert.ok(inspectSelfDrift(root).findings.some(f => f.code === 'completed-pending'));
  write('workbench/.workbench-seed.json', JSON.stringify({ documents: { 'README.md': { release: 'v1.0.0', contentHash: 'older-generation' } } }));
  report = inspectSelfDrift(root);
  assert.equal(report.seedIdentity[0].release, 'v1.0.0');
  assert.equal(report.seedIdentity[0].repository, null);
  assert.notEqual(report.seedIdentity[0].observedHash, report.seedIdentity[0].recordedHash);
  write('workbench/sessions/notepads/work/unreadable.json', '{');
  assert.ok(inspectSelfDrift(root).findings.some(f => f.code === 'unreadable' && f.artifact.endsWith('unreadable.json')));
  fs.unlinkSync(path.join(root, 'README.md'));
  fs.symlinkSync('/etc/hosts', path.join(root, 'README.md'));
  assert.ok(inspectSelfDrift(root).findings.some(f => f.code === 'unreadable' && f.artifact === 'README.md'));
  const before = fs.readFileSync(path.join(root, 'TASKBOARD.md'), 'utf8');
  const cli = spawnSync(process.execPath, ['workbench/tools/self-drift.mjs', '--project', root, '--json', '--phase', 'post'], { encoding: 'utf8' });
  assert.equal(cli.status, 1);
  assert.equal(JSON.parse(cli.stdout).phase, 'post');
  assert.equal(fs.readFileSync(path.join(root, 'TASKBOARD.md'), 'utf8'), before);
  assert.ok(JSON.parse(cli.stdout).limitations.length);
  console.log('PASS self-drift classification, resolved blockers, unreadable/symlink, read-only CLI');
} finally { fs.rmSync(root, { recursive: true, force: true }); }

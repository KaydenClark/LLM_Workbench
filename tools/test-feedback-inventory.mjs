import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { inspectFeedback } from './feedback-inventory.mjs';
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'feedback-inventory-'));
function write(file, text) { fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true }); fs.writeFileSync(path.join(root, file), text); }
try {
  write('workbench/manifest.json', JSON.stringify({ schemaVersion: 2, lanes: { feedback: 'workbench/feedback' } }));
  const data = JSON.stringify({ records: [{ id: 'GP-1', source_ids: ['original-1'] }] });
  write('workbench/feedback/decision-triage-2026-09-07.json', data);
  write('workbench/feedback/decision-triage-second-pass-2026-09-07/first-pass-snapshot.json', data);
  write('workbench/feedback/decision-triage-second-pass-2026-09-07/evidence.md', 'The first-pass JSON was snapshotted because the original continued changing. first-pass-snapshot.json preserves that observation.');
  const result = inspectFeedback(root);
  assert.equal(result.artifacts.length, 3);
  const json = result.artifacts.filter(a => a.artifact.endsWith('.json'));
  assert.equal(json[0].sha256, json[1].sha256);
  assert.notEqual(json[0].role, json[1].role);
  assert.ok(json.every(a => a.removalEligible === false));
  assert.ok(json.every(a => a.recordIds.includes('GP-1')));
  assert.ok(json.every(a => a.sourceIds.includes('original-1')));
  assert.equal(fs.readFileSync(path.join(root, json[0].artifact), 'utf8'), data);
  assert.ok(result.limitations.some(l => l.includes('consumer')));
  write('workbench/feedback/broken.json', '{');
  assert.ok(inspectFeedback(root).artifacts.find(a => a.artifact.endsWith('broken.json')).gaps.includes('unreadable JSON; source preserved'));
  fs.symlinkSync('/etc/hosts', path.join(root, 'workbench/feedback/external.md'));
  assert.throws(() => inspectFeedback(root), /symbolic link/);
  console.log('PASS feedback inventory preserves equal-byte roles, IDs, evidence, gaps and read boundary');
} finally { fs.rmSync(root, { recursive: true, force: true }); }

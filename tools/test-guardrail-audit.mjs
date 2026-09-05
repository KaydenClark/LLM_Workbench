#!/usr/bin/env node
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import {
  auditGuardrails,
  loadAuditFiles,
  renderGuardrailReport
} from './audit-guardrails.mjs';

const today = '2026-07-12';
const sparseFiles = {
  'AGENTS.md': '# Agent Instructions\n',
  'BLUEPRINT.md': '# Blueprint\n\n**Last reviewed:** 2025-01-01\n',
  'TASKBOARD.md': [
    '# Taskboard',
    '',
    '**Last updated:** 2025-01-01',
    '',
    '## Ready',
    '| ID | Status |',
    '|---|---|',
    '| T-001 | ready |',
    '',
    '## Done',
    '| ID | Status |',
    '|---|---|',
    '| T-001 | done |'
  ].join('\n'),
  'RUNBOOK.md': '# Runbook\n',
  'README.md': '# Readme\n'
};

const sparseAudit = auditGuardrails(sparseFiles, { today });
assert.equal(sparseAudit.maxScore, 100, 'guardrail audit should use a stable 100-point scale');
assert.ok(sparseAudit.score < 100, 'thin docs must not reach the north-star score');
assert.ok(
  sparseAudit.recommendations.some((item) => /contradictory task status/i.test(item.action)),
  'audit should recommend resolving contradictory task state'
);
assert.ok(
  sparseAudit.recommendations.some((item) => /real repeated outcome/i.test(item.action)),
  'audit should reserve material score for real outcome evidence'
);

const contradictorySpec = [
  '# S-101 - Contradictory fixture',
  '',
  '**Spec ID:** S-101',
  '**Status:** complete',
  '',
  '## Vertical Implementation Slices',
  '',
  '| Ticket | Slice | Status | Blockers | Proof |',
  '|---|---|---|---|---|',
  '| TK-001 | Still open | ready | none | pending |'
].join('\n');

function taskStatePasses(files) {
  return auditGuardrails({
    ...sparseFiles,
    'TASKBOARD.md': '# Taskboard\n\n**Last updated:** 2026-07-12\n\n## Ready\n',
    ...files
  }, { today })
    .categories.find((category) => category.id === 'drift_resistance')
    .checks.find((check) => check.id === 'task_state')
    .passed;
}

function proofFreshnessPasses(files) {
  return auditGuardrails({
    ...sparseFiles,
    'TASKBOARD.md': '# Taskboard\n\n**Last updated:** 2026-07-12\n',
    ...files
  }, { today })
    .categories.find((category) => category.id === 'drift_resistance')
    .checks.find((check) => check.id === 'proof_freshness')
    .passed;
}

const freshSpec = [
  '# S-101 - Fresh fixture',
  '',
  '**Spec ID:** S-101',
  '**Status:** active',
  '',
  '## Append-Only Evidence And Execution Log',
  '',
  '| Date | Ticket | Event | Verification | Docs | Remaining gap |',
  '|---|---|---|---|---|---|',
  '| 2026-07-12 | TK-001 | Verified | focused check passed | none | none |'
].join('\n');

assert.equal(taskStatePasses({
  'specs/S-101-contradictory/SPEC.md': contradictorySpec
}), false, 'a legacy root-layout contradiction must remain visible without a manifest');
assert.equal(proofFreshnessPasses({
  'specs/S-101-fresh/SPEC.md': freshSpec
}), true, 'a legacy root-layout proof remains visible without a manifest');

for (const schemaVersion of [1, 2]) {
  assert.equal(taskStatePasses({
    'workbench/manifest.json': JSON.stringify({
      schemaVersion,
      lanes: { specs: 'workbench/specs' }
    }),
    'workbench/specs/S-101-contradictory/SPEC.md': contradictorySpec
  }), false, `a schema ${schemaVersion} manifest must route the contradiction check to its specs lane`);
  assert.equal(proofFreshnessPasses({
    'workbench/manifest.json': JSON.stringify({
      schemaVersion,
      lanes: { specs: 'workbench/specs' }
    }),
    'workbench/specs/S-101-fresh/SPEC.md': freshSpec
  }), true, `a schema ${schemaVersion} manifest must route proof freshness to its specs lane`);
}

assert.equal(taskStatePasses({
  'workbench/manifest.json': '{not-json'
}), false, 'a present malformed manifest must not earn task-state points through a legacy fallback');
assert.equal(proofFreshnessPasses({
  'workbench/manifest.json': '{not-json',
  'specs/S-101-fresh/SPEC.md': freshSpec
}), false, 'a present malformed manifest must not earn proof-freshness points through a legacy fallback');

const report = renderGuardrailReport(sparseAudit, { name: 'fixture' });
assert.match(report, /Guardrail Audit: fixture/);
assert.match(report, /Score: \*\*\d+(?:\.\d+)?\/100\*\*/);
assert.match(report, /Recommended improvements/);

const root = fileURLToPath(new URL('..', import.meta.url));
const localAudit = auditGuardrails(loadAuditFiles(root), { today });
assert.ok(localAudit.score >= 20, `local harness should have meaningful guardrails, got ${localAudit.score}`);
assert.ok(localAudit.score < 100, 'current harness should not claim perfect evidence');
assert.ok(localAudit.recommendations.length > 0, 'north-star audit should expose the next improvement');

console.log(`ok - guardrail audit self-test passed; local north-star score ${localAudit.score}/100`);

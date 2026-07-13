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

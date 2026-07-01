#!/usr/bin/env node
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import {
  controlCandidates,
  loadLocalFiles,
  scoreWorkbench
} from './evaluate-workbench.mjs';

const controls = controlCandidates();
const empty = controls.find((candidate) => candidate.name === 'control:no-template');
const singleFile = controls.find((candidate) => candidate.name === 'control:single-instruction-file');

assert.equal(scoreWorkbench(empty.files).score, 0, 'no-template control should score zero');

const singleFileScore = scoreWorkbench(singleFile.files).score;
assert.ok(singleFileScore > 0, 'single instruction file should score above zero');
assert.ok(singleFileScore < 20, 'single instruction file should stay far below a workbench');

const localFiles = loadLocalFiles(fileURLToPath(new URL('..', import.meta.url)));
const localEvaluation = scoreWorkbench(localFiles);
const localScore = localEvaluation.score;
assert.ok(localScore >= 90, `local workbench should pass the core rubric, got ${localScore}`);
assert.ok(localScore > singleFileScore, 'local workbench should beat the simple baseline');

const verificationContract = localEvaluation.breakdown.find((item) => item.id === 'verification_contract');
assert.ok(verificationContract, 'verification contract should be present in the rubric');
assert.ok(
  !verificationContract.missing.includes('meaningful coverage policy'),
  'local workbench should document the meaningful coverage policy'
);

const structuredMetadata = localEvaluation.breakdown.find((item) => item.id === 'structured_metadata');
assert.ok(structuredMetadata, 'structured metadata should be present in the rubric');
assert.deepEqual(
  structuredMetadata.missing,
  [],
  `local workbench should provide parseable front matter, missing: ${structuredMetadata.missing.join(', ')}`
);

const guardrails = localEvaluation.breakdown.find((item) => item.id === 'guardrails');
assert.ok(guardrails, 'guardrails should be present in the rubric');
assert.deepEqual(
  guardrails.missing,
  [],
  `local workbench should document prompt-injection and tool guardrails, missing: ${guardrails.missing.join(', ')}`
);

const portability = localEvaluation.breakdown.find((item) => item.id === 'portability');
assert.ok(portability, 'portability should be present in the rubric');
assert.deepEqual(
  portability.missing,
  [],
  `local workbench should ship a Claude bridge, missing: ${portability.missing.join(', ')}`
);

const benchmarkEvidence = localEvaluation.breakdown.find((item) => item.id === 'benchmark_evidence');
assert.ok(benchmarkEvidence, 'benchmark evidence should be present in the rubric');
assert.deepEqual(
  benchmarkEvidence.missing,
  [],
  `local workbench should make new research-backed claims measurable, missing: ${benchmarkEvidence.missing.join(', ')}`
);

console.log(`ok - evaluator self-test passed; local score ${localScore}, single-file baseline ${singleFileScore}`);

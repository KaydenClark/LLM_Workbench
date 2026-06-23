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
const localScore = scoreWorkbench(localFiles).score;
assert.ok(localScore >= 90, `local workbench should pass the core rubric, got ${localScore}`);
assert.ok(localScore > singleFileScore, 'local workbench should beat the simple baseline');

console.log(`ok - evaluator self-test passed; local score ${localScore}, single-file baseline ${singleFileScore}`);

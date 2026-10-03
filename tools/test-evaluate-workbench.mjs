#!/usr/bin/env node
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
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

const activeWorkState = localEvaluation.breakdown.find((item) => item.id === 'active_work_state');
assert.ok(activeWorkState, 'active work state should be present in the rubric');
assert.ok(
  !activeWorkState.missing.includes('hot spec projection'),
  'local workbench should use TASKBOARD.md as the active spec projection'
);
assert.ok(
  !activeWorkState.missing.includes('stable spec lifecycle'),
  'local workbench should keep durable capability truth in stable specs'
);

const verificationContract = localEvaluation.breakdown.find((item) => item.id === 'verification_contract');
assert.ok(verificationContract, 'verification contract should be present in the rubric');
assert.ok(
  !verificationContract.missing.includes('meaningful coverage policy'),
  'local workbench should document the meaningful coverage policy'
);

const executiveInterface = localEvaluation.breakdown.find((item) => item.id === 'executive_interface');
assert.ok(executiveInterface, 'executive interface criterion should be present in the rubric');
assert.equal(
  executiveInterface.missing.length,
  0,
  `local workbench should satisfy the executive interface criterion, missing: ${executiveInterface.missing.join(', ')}`
);

const singleFileExec = scoreWorkbench(singleFile.files).breakdown.find((item) => item.id === 'executive_interface');
assert.ok(
  singleFileExec && singleFileExec.score === 0,
  'a bare instruction file should score zero on the executive interface criterion'
);

const productAcceptance = localEvaluation.breakdown.find((item) => item.id === 'product_acceptance');
assert.ok(productAcceptance, 'product acceptance criterion should be present in the rubric');
assert.equal(
  productAcceptance.missing.length,
  0,
  `local workbench should satisfy the product acceptance criterion, missing: ${productAcceptance.missing.join(', ')}`
);

const singleFileProduct = scoreWorkbench(singleFile.files).breakdown.find((item) => item.id === 'product_acceptance');
assert.ok(
  singleFileProduct && singleFileProduct.score === 0,
  'a bare instruction file should score zero on the product acceptance criterion'
);

const root = fileURLToPath(new URL('..', import.meta.url));
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-evaluator-entry-'));
const linkedRoot = path.join(temp, 'checkout');
fs.symlinkSync(root, linkedRoot, 'dir');
try {
  const output = execFileSync(process.execPath, [
    path.join(linkedRoot, 'tools', 'evaluate-workbench.mjs'),
    '--path', linkedRoot
  ], { encoding: 'utf8' });
  assert.match(output, /# Workbench Evaluation/,
    'the evaluator must run when invoked through a symlinked checkout path');
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}

console.log(`ok - evaluator self-test passed; local score ${localScore}, single-file baseline ${singleFileScore}`);

// S-004H: the Blueprint is either the legacy eight-section destination or the
// four-part short page. Each project-model check keeps its weight and finds its
// evidence at the owner that holds it, so the shape change moves no score.
const FOUR_PART_BLUEPRINT = ['# Fixture - Blueprint', '', '## What it is', '', 'A finished product.', '', '## Who it serves', '', 'Its people.', '', '## Promised outcomes', '', '- A durable result.', '', '## Non-goals', '', '- Not a hosted service.', ''].join('\n');
const EIGHT_SECTION_HEADINGS = ['Product Destination', 'Promised Outcomes', 'Integrated System Design', 'Cross-Cutting Qualities And Constraints'];
const FOUR_PART_HEADINGS = ['What it is', 'Who it serves', 'Promised outcomes', 'Non-goals'];
const modelOf = files => scoreWorkbench(files).breakdown.find(x => x.id === 'project_model');
const rootBlueprintIsFourPart = /^## What it is$/m.test(localFiles['BLUEPRINT.md']);
const destinationModel = modelOf(localFiles);
assert.equal(destinationModel.missing.length, 0, 'current destination model must be evaluated at its actual owners');
for (const heading of rootBlueprintIsFourPart ? FOUR_PART_HEADINGS : EIGHT_SECTION_HEADINGS) {
  const changed = {...localFiles, 'BLUEPRINT.md':localFiles['BLUEPRINT.md'].replace('## '+heading,'## Removed')};
  assert.ok(modelOf(changed).missing.length > 0, heading+' must remain required');
}

const templateBlueprintIsFourPart = /^## What it is$/m.test(localFiles['templates/BLUEPRINT.md']);
const templateModel = Object.fromEntries(['AGENTS.md','BLUEPRINT.md'].map(name => [name,localFiles['templates/'+name]]));
assert.equal(modelOf(templateModel).score,8,'generic destination model retains every substantive constraint prompt');
if (!templateBlueprintIsFourPart) {
  for (const terms of [/privacy|safety/gi,/verified|verification|evidence/gi]) {
    const changed={...templateModel,'BLUEPRINT.md':templateModel['BLUEPRINT.md'].replace(terms,'removed')};
    assert.ok(modelOf(changed).score<8,'removing substantive constraint prompts must lose credit');
  }
}

// The four-part short page plus the generic Contract scores the full project
// model weight, and each piece of evidence it relies on is still required.
const fourPart = {...Object.fromEntries(['AGENTS.md'].map(name => [name,localFiles['templates/'+name]])), 'BLUEPRINT.md': FOUR_PART_BLUEPRINT};
assert.equal(modelOf(fourPart).score, 8, 'a four-part Blueprint must score the full project model at its actual owners');
assert.deepEqual(modelOf(fourPart).missing, []);
for (const heading of FOUR_PART_HEADINGS) {
  const changed = {...fourPart, 'BLUEPRINT.md': FOUR_PART_BLUEPRINT.replace('## '+heading, '## Removed')};
  assert.ok(modelOf(changed).score < 8, 'the four-part heading "'+heading+'" must remain required');
}
// The eight-section legacy shape keeps its credit, so the swap lands without a gap.
const legacy = {...Object.fromEntries(['AGENTS.md'].map(name => [name,localFiles['templates/'+name]])), 'BLUEPRINT.md': EIGHT_SECTION_HEADINGS.map(h => '## '+h+'\n\nprivacy safety verified evidence manifest\n').join('\n') + '\n## Non-Goals\n\nprivacy safety\n'};
// A heading with nothing under it is not a part of the page: each of the four, emptied in turn, loses credit,
// and so does a page of bare headings.
const emptied = (blueprint, heading) => blueprint.replace(new RegExp(`(## ${heading}\\n)\\n[^\\n]+\\n`), '$1');
for (const heading of FOUR_PART_HEADINGS) {
  const changed = {...fourPart, 'BLUEPRINT.md': emptied(FOUR_PART_BLUEPRINT, heading)};
  assert.notEqual(changed['BLUEPRINT.md'], FOUR_PART_BLUEPRINT, 'emptying "'+heading+'" must change the fixture');
  assert.ok(modelOf(changed).score < 8, 'the four-part section "'+heading+'" must carry text to earn credit');
}
// A section whose only body is a sub-heading has no text either; one with a sub-heading and then text does.
for (const heading of FOUR_PART_HEADINGS) {
  const subOnly = FOUR_PART_BLUEPRINT.replace(new RegExp(`(## ${heading}\\n)\\n[^\\n]+\\n`), '$1\n### Only a subheading\n');
  assert.notEqual(subOnly, FOUR_PART_BLUEPRINT, 'the sub-heading-only fixture for "'+heading+'" must change the page');
  assert.ok(modelOf({...fourPart, 'BLUEPRINT.md': subOnly}).score < 8, 'a sub-heading alone is not text for "'+heading+'"');
  const subThenText = FOUR_PART_BLUEPRINT.replace(new RegExp(`(## ${heading}\\n)\\n([^\\n]+\\n)`), '$1\n### A subheading\n\n$2');
  assert.equal(modelOf({...fourPart, 'BLUEPRINT.md': subThenText}).score, 8, 'a sub-heading followed by text counts for "'+heading+'"');
}
// A page that declares the four-part shape is judged only as that page: an emptied part loses every
// Blueprint-owned check at once, even beside a Contract whose own text could fill the gap, and legacy
// section words cannot lend it credit.
const BLUEPRINT_OWNED = ['integrated architecture', 'invariants', 'project promise', 'safety boundaries'];
for (const heading of FOUR_PART_HEADINGS) {
  const changed = {...fourPart, 'BLUEPRINT.md': emptied(FOUR_PART_BLUEPRINT, heading).replace('# Fixture - Blueprint\n', '# Fixture - Blueprint\n\nPrivacy and safety are verified with evidence; the manifest joins the major parts.\n')};
  assert.deepEqual([...modelOf(changed).missing].sort(), BLUEPRINT_OWNED, 'an emptied "'+heading+'" part loses every Blueprint-owned check, not just one');
}
const mixed = {...fourPart, 'BLUEPRINT.md': FOUR_PART_BLUEPRINT + '\n' + legacy['BLUEPRINT.md'].replace('## Non-Goals', '## Non-Goals\n\n')};
assert.equal(modelOf(mixed).score, 8, 'a complete four-part page plus extra sections is still judged as the four-part page');
const mixedEmpty = {...fourPart, 'BLUEPRINT.md': emptied(FOUR_PART_BLUEPRINT, 'Non-goals') + '\n' + legacy['BLUEPRINT.md'].replace('## Non-Goals', '## Limits')};
assert.ok(modelOf(mixedEmpty).score < 8, 'legacy sections appended to a four-part page with an empty part earn nothing');
const bareHeadings = {...fourPart, 'BLUEPRINT.md': FOUR_PART_HEADINGS.map(h => '## '+h+'\n').join('\n')};
assert.ok(modelOf(bareHeadings).score <= 1.6, 'a page of bare headings earns no project-model credit beyond the Contract-only check');
for (const [name, mutate] of [
  ['the Contract safety section', agents => agents.replace(/^## Safety And Change Control$/m, '## Removed')],
  ['the Contract privacy rule', agents => agents.replace(/private|privacy/gi, 'removed')],
  ['the Contract ownership table', agents => agents.replace(/Documentation Ownership And Proof/g, 'Removed')],
  ['the Contract verification section', agents => agents.replace(/^## Engineering And Verification$/m, '## Removed').replace(/verified|verification|evidence/gi, 'removed')]
]) {
  const changed = {...fourPart, 'AGENTS.md': mutate(fourPart['AGENTS.md'])};
  assert.notEqual(changed['AGENTS.md'], fourPart['AGENTS.md'], name+' mutation must change the Contract');
  assert.ok(modelOf(changed).score < 8, 'removing '+name+' must lose credit');
}
assert.equal(modelOf(legacy).score, 8, 'the eight-section destination keeps its credit');

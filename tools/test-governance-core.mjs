#!/usr/bin/env node
// The Governance Core is carried by root controls and by the copy-ready
// templates alike, and the ADR corpus is reconciled with the claim-level model.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { listAdrs } from '../workbench/tools/adr.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const CORE_TERMS = [
  'Governance Plane', 'Workbench Contract', 'Instruction authority', 'State resolution', 'No-governance-tax rule',
  'Diagnostic', 'Support lane', 'Collection', 'ADR', 'Checkpoint', 'Design Concept article', 'Wiki profile', 'Managed runtime tool'
];

test('root and template AGENTS separate instruction authority from state resolution', () => {
  for (const relative of ['AGENTS.md', 'templates/AGENTS.md']) {
    const agents = read(relative);
    assert.match(agents, /^## Authority Order$/m, `${relative} keeps the Authority Order section`);
    assert.match(agents, /^### Instruction Authority$/m, `${relative} names instruction authority`);
    assert.match(agents, /^### State Resolution$/m, `${relative} names state resolution`);
    assert.match(agents, /implementation gap/, `${relative} names the newer-Canon condition`);
    assert.match(agents, /documentation drift/, `${relative} names the newer-Actuality condition`);
    assert.match(agents, /cannot enlarge/, `${relative} bounds the assigned spec`);
    assert.doesNotMatch(agents, /^\d\. Source and tests verified live\.$/m, `${relative} no longer ranks source above the assigned spec`);
    assert.match(agents, /`doctor` fails on `all` and `selection`/, `${relative} states the diagnostic effects`);
  }
});

test('root and template Lexicons carry the Governance Core terms and keep the owner definition of design concept', () => {
  for (const relative of ['LEXICON.md', 'templates/LEXICON.md']) {
    const lexicon = read(relative);
    assert.match(lexicon, /^## Governance Core$/m, `${relative} has a Governance Core section`);
    for (const term of CORE_TERMS) assert.match(lexicon, new RegExp(`^\\| \\*\\*${term}\\*\\* \\|`, 'm'), `${relative} defines ${term}`);
    assert.match(lexicon, /\*\*Design concept\*\*.*shared understanding between the parties working on a project about what that project is/s);
  }
  const template = read('templates/LEXICON.md');
  assert.doesNotMatch(template, /workbench\/docs\/adr\/00\d\d-/, 'the template Lexicon must not link product-specific ADRs');
  assert.match(template, /workbench\/docs\/adr\//, 'the template Lexicon routes to the project ADR collection');
});

test('template Blueprint and Runbook route decision records, diagnostics, and the tools lane', () => {
  const blueprint = read('templates/BLUEPRINT.md');
  assert.match(blueprint, /workbench\/docs\/adr\//, 'the template Blueprint names the ADR collection');
  assert.match(blueprint, /Workbench Contract/, 'the template Blueprint names the contract');
  const runbook = read('templates/RUNBOOK.md');
  assert.match(runbook, /node workbench\/tools\/adr\.mjs/, 'the template Runbook names the ADR command');
  assert.match(runbook, /node workbench\/tools\/spec-workbench\.mjs doctor/, 'the template Runbook names the doctor command');
  assert.match(runbook, /attention/, 'the template Runbook explains attention findings');
});

test('the ADR corpus is reconciled: ADR-0008 is not ported and ADR-0025 records the supersession lineage', () => {
  const adrs = listAdrs(root);
  assert.equal(adrs.some((adr) => adr.number === '0008'), false, 'ADR-0008 must not be ported with its categorical rule');
  const claimLevel = adrs.find((adr) => adr.number === '0025');
  assert.ok(claimLevel, 'ADR-0025 exists');
  assert.equal(claimLevel.data.status, 'accepted');
  assert.match(String(claimLevel.data.ported_from), /ADR-0008/);
  assert.match(String(claimLevel.data.supersedes), /Grounding/);
  for (const adr of adrs) {
    const owners = Array.isArray(adr.data.canonicalized_in) ? adr.data.canonicalized_in : [adr.data.canonicalized_in];
    for (const owner of owners) assert.ok(['AGENTS.md', 'BLUEPRINT.md', 'LEXICON.md', 'RUNBOOK.md'].includes(owner) || owner.startsWith('workbench/specs/'), `${adr.name} canonicalized_in ${owner} must target a control or spec owner`);
    if (adr.data.ported_from) assert.doesNotMatch(String(adr.data.ported_from), /\/Users\/|\/home\//, `${adr.name} ported_from must not carry a private path`);
  }
});

test('root and template AGENTS define branch completion and merged-branch cleanup', () => {
  for (const relative of ['AGENTS.md', 'templates/AGENTS.md']) {
    const agents = read(relative);
    assert.match(agents, /^### Branch Completion$/m, `${relative} names the branch completion contract`);
    assert.match(
      agents,
      /A task is not finished at the push/,
      `${relative} states that a pushed branch is not a finished task`
    );
    assert.match(
      agents,
      /git branch -d/,
      `${relative} names the safe merged-branch delete`
    );
    assert.match(
      agents,
      /never force it with\s+`-D`/,
      `${relative} forbids forcing a delete past the merged check`
    );
    assert.match(
      agents,
      /already ancestors of\s+the merged tip/,
      `${relative} resolves stacked branches without a separate merge`
    );
  }
});

test('the safety rule exempts a provably merged branch from the ask-first gate', () => {
  const agents = read('AGENTS.md');
  assert.doesNotMatch(
    agents,
    /removing branches\/results, adding paid services/,
    'the blanket ask-before-removing-branches rule must be narrowed'
  );
  assert.match(
    agents,
    /removing unmerged branches or results/,
    'AGENTS.md gates only unmerged branch removal behind asking'
  );
});

test('the Runbook carries the operational branch closeout commands', () => {
  const runbook = read('RUNBOOK.md');
  assert.match(runbook, /gh pr merge/, 'RUNBOOK.md names the merge command');
  assert.match(runbook, /git branch -d/, 'RUNBOOK.md names the safe local delete');
  assert.match(runbook, /git push origin --delete/, 'RUNBOOK.md names the remote branch delete');
});

test('the Runbook closeout proves integration containment without a local integration checkout', () => {
  const runbook = read('RUNBOOK.md');
  const start = runbook.indexOf('Closeout, once the integration review has passed');
  const end = runbook.indexOf('## Manual Harness Feedback Reports');
  assert.ok(start > -1 && end > start, 'RUNBOOK.md carries a closeout block before the feedback-report section');
  const closeout = runbook.slice(start, end);
  assert.match(closeout, /git switch --detach origin\/integration/, 'the closeout leaves the task branch via a detached checkout of origin/integration, so a linked worktree holding integration cannot block it');
  assert.match(closeout, /git merge-base --is-ancestor [^\n]*origin\/integration/, 'the closeout proves that origin/integration contains the work and fails loudly otherwise');
  assert.match(closeout, /git branch --merged origin\/integration/, 'the closeout lists merged branches against origin/integration');
  assert.doesNotMatch(closeout, /^git switch integration\b/m, 'the closeout commands must not check out a local integration branch');
  const template = read('templates/RUNBOOK.md');
  assert.match(template, /\[MERGE_PR_COMMAND\]/, 'templates/RUNBOOK.md carries the merge step that the template AGENTS Branch Completion contract requires');
  assert.match(template, /\[DELETE_MERGED_BRANCH_COMMAND\]/, 'templates/RUNBOOK.md carries the merged-branch cleanup step');
});

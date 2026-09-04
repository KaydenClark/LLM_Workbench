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

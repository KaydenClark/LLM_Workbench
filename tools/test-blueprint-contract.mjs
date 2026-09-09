#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const root = path.resolve(import.meta.dirname, '..');
const headings = ['Product Destination', 'People And Problems Served', 'Promised Outcomes', 'Desired Experience And Behavior', 'Integrated System Design', 'Cross-Cutting Qualities And Constraints', 'Desired Lifecycle', 'Non-Goals'];
for (const file of ['BLUEPRINT.md', 'templates/BLUEPRINT.md']) {
  const body = fs.readFileSync(path.join(root, file), 'utf8');
  assert.deepEqual([...body.matchAll(/^## (.+)$/gm)].map(x => x[1]), headings, file);
  assert.doesNotMatch(body, /spec-catalog|Harness version|Last reviewed|Cross-Cutting Health|## Accepted V/);
}
const inventory = JSON.parse(fs.readFileSync(path.join(root, 'workbench/specs/S-00A-blueprint-active-adr-and-context-map/blueprint-claim-disposition.json')));
for (const source of inventory.sources) {
  const original = execFileSync('git', ['show', `${source.commit}:${source.path}`], {cwd:root,encoding:'utf8'});
  assert.equal(source.claims.map(x => x.text).join(''), original, 'inventory must preserve every source byte in order');
  for (const claim of source.claims) {
    assert.ok(claim.disposition && claim.reason && claim.owner);
    assert.ok(fs.existsSync(path.join(root, claim.owner)), claim.owner);
  }
}
console.log('ok - destination Blueprint shape and lossless claim-disposition inventory; semantic fidelity needs independent review');

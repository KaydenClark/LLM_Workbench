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
// S-00P TK-001: a reader of the root Blueprint must be able to state every rung
// of the governing workflow, the three delivery altitudes and every stage of the
// recursive Spec/Task loop. The generic template carries no product workflow, so
// this contract is root-only.
// Collapse the file's line wrapping so each claim is checked against the prose
// rather than against where a line happens to break.
const blueprint = fs.readFileSync(path.join(root, 'BLUEPRINT.md'), 'utf8').replace(/\s+/g, ' ');
const workflow = [
  ['rung: an owner idea opens Align', /\bidea\b[\s\S]{0,200}?\bAlign\b/i],
  ['rung: Align proceeds through grilling', /\bAlign\b[\s\S]{0,300}?grilling/i],
  ['rung: research, brainstorming and wayfinding resolve a named Align uncertainty', /research, brainstorming and wayfinding/i],
  ['rung: Align ends when owner and agent confirm a shared design concept', /confirm[\s\S]{0,120}?shared design concept/i],
  ['rung: the confirmed design concept is what gets blueprinted', /design concept[\s\S]{0,400}?Blueprint/i],
  ['rung: a prototype is optional, after the Blueprint and before a Spec', /optional[\s\S]{0,120}?prototype|prototype[\s\S]{0,120}?optional/i],
  ['rung: prototype code carries forward only under ordinary verification', /prototype code/i],
  ['rung: delivery is the recursive Spec and Task loop', /recursiv/i],
  ['altitude: the Blueprint owns the product-level destination', /product-level destination/i],
  ['altitude: a Spec is one scoped objective with its own destination', /scoped objective/i],
  ['altitude: a Spec is PRD-shaped', /PRD/],
  ['altitude: Tasks do the counting', /Tasks do the counting/i],
  ['altitude: stacked Specs realize the Blueprint journey', /stack/i],
  ['altitude: a gap against an existing destination is corrective Task work', /corrective Task/i],
  ['loop: the Taskboard projects Task state', /Taskboard/],
  ['loop: an agent picks up the hot Task', /hot Task/i],
  ['loop: a Task is implemented with red/green TDD', /red\/green/i],
  ['loop: the proven Task branch lands', /Task branch/i],
  ['loop: the finished Task is reconciled into its Spec', /reconcil[\s\S]{0,160}?Spec|Spec[\s\S]{0,160}?reconcil/i],
  ['loop: the reconciled Task is retired', /retire/i],
  ["loop: a retired Task's branch is cleaned up once its Spec branch contains it", /cleaned up once[\s\S]{0,80}?Spec branch/i],
  ['loop: the assembled Spec is reviewed in a separate context', /assembled Spec/i],
  ['loop: a failed review creates corrective Tasks under the still-open Spec', /still-open Spec/i],
  ['loop: the owner runs Human QA on the integration branch', /Human QA/i],
  ['loop: no Git merge closes a Spec', /No Git merge closes/i],
  ['loop: the closed Spec is reconciled into the Wiki and retired', /Wiki[\s\S]{0,200}?retire|retire[\s\S]{0,200}?Wiki/i],
  ['loop: verified transient records may be discarded, Git keeping the history', /default branch[\s\S]{0,200}?discard|discard[\s\S]{0,200}?default branch/i],
  ['loop: failed Human QA returns to Align at the appropriate scope', /Human QA[\s\S]{0,300}?Align|Align[\s\S]{0,300}?Human QA/i],
  ['topology: a Task branch is cut from its Spec branch', /Spec branch/i],
  ['owners: SPEC and TASK records are transient working artifacts', /transient/i],
  ['scope: a coordinator is the intended parallel-work model', /coordinator/i]
];
const unstated = workflow.filter(([, pattern]) => !pattern.test(blueprint)).map(([claim]) => claim);
assert.deepEqual(unstated, [], 'BLUEPRINT.md must let a reader state every rung, altitude and loop stage');
console.log('ok - destination Blueprint shape, governing workflow rungs and loop stages, and lossless claim-disposition inventory; semantic fidelity needs independent review');

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
assert.match(
  fs.readFileSync(path.join(root, 'BLUEPRINT.md'), 'utf8'),
  /```text\nIdea[\s\S]*?Create one Task branch\/worktree from the Spec branch[\s\S]*?Worker self-checks its claims and proof[\s\S]*?Hand back to the Dispatcher\s+-> Merge Task into Spec branch[\s\S]*?If findings: create corrective Tasks -> repeat Task loop[\s\S]*?Fail -> return to Align[\s\S]*?```/,
  'owner workflow map must keep its branch and return loops in arrow-and-brace form'
);
// SCR 2026-09-24: no per-Task review or approval gate, and the 100/20/5 scale
// is replaced by Spec ~1-5 and Task ~0.1. Either returning would reintroduce a
// settled contradiction, so their absence is asserted, not just the new text.
assert.doesNotMatch(fs.readFileSync(path.join(root, 'BLUEPRINT.md'), 'utf8'), /Review Task|Each completed Task receives review|reaching 20|reaching 5\b/, 'BLUEPRINT.md must not restore per-Task review or the superseded scale');
const workflow = [
  ['rung: an owner idea opens Align', /\bidea\b[\s\S]{0,200}?\bAlign\b/i],
  ['rung: an owner may explore an idea before Align', /explore an idea in conversation before it is clear enough to Align/i],
  ['rung: Align proceeds through grilling', /\bAlign\b[\s\S]{0,300}?grilling/i],
  ['rung: grill-me, brainstorming and wayfinding can open Align', /grill-me.{0,3} brainstorming or wayfinding can open Align/i],
  ['rung: Align uses research for a named uncertainty', /Align reaches for research as far as a named uncertainty requires/i],
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
  ['loop: a Task has no review or approval gate; its Worker self-checks', /no (separate-context )?review or approval gate[\s\S]{0,200}?self-check/i],
  ['loop: merging a Task is containment, not QA', /containment/i],
  ['scale: a Spec is a local destination such as 1 through 5 and a Task is about 0.1', /1 through 5[\s\S]{0,300}?0\.1/i],
  ['roles: Director, Dispatcher and Worker are defined by responsibility, not branch', /Director[\s\S]{0,40}?Dispatcher[\s\S]{0,40}?Worker[\s\S]{0,600}?responsibilit/i],
  ['roles: the owner is the human above the Director', /owner[\s\S]{0,80}?not the Director|not the Director[\s\S]{0,80}?owner/i],
  ['roles: the Director approves an assembled Spec in a separate context', /Director[\s\S]{0,200}?separate context|separate context[\s\S]{0,200}?Director/i],
  ['topology: a direct Blueprint Task branches from and merges into integration', /directly[\s\S]{0,200}?Task branch[\s\S]{0,200}?integration/i],
  ['loop: a missed Task is not reopened; its card returns to In progress and a new Task fixes it', /not reopened[\s\S]{0,400}?In progress[\s\S]{0,300}?new Task/i],
  ['loop: Human QA follows Director approval of every Spec in the version', /Director has approved every Spec|every Spec[\s\S]{0,120}?Director[\s\S]{0,120}?approved/i],
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
  ['scope: a Director with a Dispatcher per Spec is the intended parallel-work model', /Dispatcher for each Spec|Dispatcher per Spec/i]
];
const unstated = workflow.filter(([, pattern]) => !pattern.test(blueprint)).map(([claim]) => claim);
assert.deepEqual(unstated, [], 'BLUEPRINT.md must let a reader state every rung, altitude and loop stage');
console.log('ok - destination Blueprint shape, governing workflow rungs and loop stages, and lossless claim-disposition inventory; semantic fidelity needs independent review');

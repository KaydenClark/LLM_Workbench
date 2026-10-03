#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { isFourPartBlueprint } from './evaluate-workbench.mjs';
const root = path.resolve(import.meta.dirname, '..');

// S-004H: every room's Blueprint is the four-part short page (what it is, who it serves, promised
// outcomes, non-goals), for LLM Workbench's own room and for the generic template alike. The
// shape check below also runs against in-memory mutations that must be refused, so it cannot pass
// vacuously.
const PARTS = ['What it is', 'Who it serves', 'Promised outcomes', 'Non-goals'];
const LEGACY_MARKERS = /spec-catalog|Harness version|Last reviewed|Cross-Cutting Health|## Accepted V/;
function shapeProblems(body) {
  const problems = [];
  const headings = [...body.matchAll(/^## (.+)$/gm)].map(x => x[1]);
  if (JSON.stringify(headings) !== JSON.stringify(PARTS)) problems.push(`the \`##\` headings are ${JSON.stringify(headings)}, not the four parts in order`);
  if (!/^# .+ - Blueprint$/m.test(body)) problems.push('the title line "# <name> - Blueprint" is missing');
  if (!isFourPartBlueprint(body)) problems.push('a part is missing, repeated, out of order or has no text');
  if (LEGACY_MARKERS.test(body)) problems.push('the page carries a catalog, version stamp, review date or status marker');
  return problems;
}
for (const file of ['BLUEPRINT.md', 'templates/BLUEPRINT.md']) {
  assert.deepEqual(shapeProblems(fs.readFileSync(path.join(root, file), 'utf8')), [], file);
}
const rootBody = fs.readFileSync(path.join(root, 'BLUEPRINT.md'), 'utf8');
const templateBody = fs.readFileSync(path.join(root, 'templates/BLUEPRINT.md'), 'utf8');
for (const [name, mutate] of [
  ['the old eight-section shape', b => b.replace('## What it is', '## Product Destination').replace('## Who it serves', '## People And Problems Served').replace('## Promised outcomes', '## Promised Outcomes') + '\n## Desired Experience And Behavior\n\nx\n\n## Integrated System Design\n\nx\n\n## Cross-Cutting Qualities And Constraints\n\nx\n\n## Desired Lifecycle\n\nx\n'],
  ['a part dropped', b => b.replace(/## Who it serves[\s\S]*?(?=## Promised outcomes)/, '')],
  ['two parts swapped', b => b.replace('## Who it serves', '## TEMP').replace('## Promised outcomes', '## Who it serves').replace('## TEMP', '## Promised outcomes')],
  ['a fifth section added', b => b + '\n## Desired Lifecycle\n\nA workflow.\n'],
  ['a part emptied', b => b.replace(/(## Non-goals\n)[\s\S]*$/, '$1')],
  ['a version stamp', b => b.replace('## What it is', '**Harness version:** v3\n\n## What it is')],
  ['the title dropped', b => b.replace(/^# .+\n/, '')]
]) {
  for (const [label, body] of [['root', rootBody], ['template', templateBody]]) {
    const mutated = mutate(body);
    assert.notEqual(mutated, body, `${name} must change the ${label} Blueprint`);
    assert.notDeepEqual(shapeProblems(mutated), [], `${label} Blueprint with ${name} must be refused`);
  }
}

// The root page states what the owner confirmed on 2026-10-03, and only that. The hosted-service
// non-goal is withheld: no accepted record carries it and it is an open owner item in the Blueprint
// Short Page spec, so the page must not state it until the owner decides it. The "network access for
// ordinary local work" non-goal is gone because the owner called it wrong.
const page = rootBody.replace(/\s+/g, ' ');
const rootClaims = [
  ['what it is: an agentic management system that Claude Code and Codex use to align ideas and implement design concepts', /LLM Workbench is an agentic management system: the workbench Claude Code and Codex use to align the owner's ideas and implement the owner's design concepts/],
  ['agents map and plan each confirmed concept and carry it through the Journey; the owner approves or sends it back', /Agents map and plan each confirmed concept and carry it through the Journey, and the owner approves the result or sends it back until the concept is realized/],
  ['a harness runs one agent in one session; the workbench manages the rest', /A harness runs one agent in one session; it does not know what the owner wants built[\s\S]*The workbench manages exactly that, so the owner does not have to/],
  ['the project of LLM Workbench is the next workbench, and the Foundry needs the workbench proven first', /the project is the next workbench, built with the current one\. Every workbench is built to run as one room among many in an autonomous factory, the Foundry, and the Foundry needs the workbench proven first/],
  ['who it serves: the owner', /### The owner[\s\S]*usually by grilling, until the design concept is shared, then confirms it[\s\S]*approve it or send it back[\s\S]*never explains the project twice, and can step in at any time/],
  ['who it serves: the agents', /### The agents[\s\S]*carry a confirmed concept the rest of the way[\s\S]*have it reviewed by an agent that did not build it before it merges[\s\S]*then see it delivered and clean up/],
  ['outcome: Human QA only after automated checks and automated review', /Work reaches the owner's Human QA only after automated checks and automated review pass it/],
  ['outcome: many agents work one project at once', /Many agents work one project at once, on any of the owner's devices or in the cloud, and combine their checked results/],
  ['outcome: every session stays in the smart zone and spends its tokens efficiently', /Work is mapped and planned so every session stays in the smart zone and spends its tokens efficiently/],
  ['outcome: everything a session needs lives in the GitHub repository, loaded progressively', /Everything a session needs lives in the project's GitHub repository; through progressive disclosure, a fresh session loads only what its work needs/],
  ['outcome: every kind of truth has one maintained home', /Every kind of truth has one maintained home[\s\S]*nothing is kept twice/],
  ['outcome: claims of done say what actually happened; gaps are flagged, never faked', /Claims of done say what actually happened; gaps are flagged, never faked/],
  ['outcome: what the work teaches lives on and the scaffolding is cleared away', /What the work teaches lives on in the Wiki and decision records; the scaffolding is cleared away/],
  ['outcome: skills ship inside every room and a room may add without tearing apart what works', /The skills agents need ship inside every room[\s\S]*without tearing apart what is proven to work/],
  ['outcome: setup drafts and grilling confirms; updates never cost a project its knowledge', /Setup drafts the workbench from one line or an existing project, and grilling confirms it; updates never cost a project its knowledge, unfinished work or deliberate choices/],
  ['outcome: every release is proven by a Template project taking a confirmed concept to approval in one pass', /Every release is proven by a project made from the Workbench Template taking a confirmed concept to the owner's approval in one pass/],
  ['non-goal: not a harness', /- Not a harness\./],
  ['non-goal: not a source of permission, and not proof that an agent always follows instructions', /- Not a source of permission, and not proof that an agent always follows instructions\./],
  ['non-goal: not a general-purpose project-management application or personal task manager', /- Not a general-purpose project-management application or personal task manager\./],
  ['non-goal: not a transcript or proof archive', /- Not a transcript or proof archive\./]
];
const unstated = rootClaims.filter(([, re]) => !re.test(rootBody.replace(/\n(?!\n|- |#)/g, ' '))).map(([claim]) => claim);
assert.deepEqual(unstated, [], 'BLUEPRINT.md must state what the owner confirmed');
for (const [claim, re] of [
  ['the operating-harness opening the owner rejected', /portable operating harness/i],
  ['the network-access non-goal the owner called wrong', /network access/i],
  ['the withheld hosted-service non-goal, still an open owner item', /hosted service|paid service|hosted tracker/i],
  ['the eight-section headings', /Product Destination|Integrated System Design|Desired Lifecycle|Cross-Cutting Qualities/],
  ['a Blueprint that restates the workflow map, the QA gates or the corrective-work rules', /Pick up a hot non-conflicting Task|Whole-Spec QA|corrective Tasks?\b/],
  ['a link to a record that carries an identifier (a decision record, Spec, Task or landmark)', /\]\([^)]*(?:workbench\/docs|workbench\/specs|workbench\/landmark-tracker|\.\.\/docs|\.\.\/specs)/],
  ['an identifier: ADR, DDR, DQC, landmark, Task or Spec', /\b(?:ADR|DDR|DQC|LMK|TK)-\w+|\bS-0\w{2,3}\b/]
]) {
  assert.doesNotMatch(rootBody, re, `BLUEPRINT.md must not carry ${claim}`);
}

// The generic template: the same four parts, bracketed placeholders only, no product workflow. A room
// replaces each placeholder with its own words; the Contract owns how the work runs.
const templateLines = templateBody.split('\n').filter(line => line.trim() !== '' && !line.startsWith('#'));
const allowedNote = 'Its terms mean what the Lexicon says they mean.';
for (const line of templateLines.filter(line => line !== allowedNote)) {
  assert.match(line, /^(?:- )?\[[^\]].*\]$/, `the template carries only bracketed placeholders, not: ${line}`);
}
assert.ok(templateLines.includes(allowedNote), 'the template keeps the reading note that terms mean what the Lexicon says');
assert.match(templateBody, /^# \[PROJECT_NAME\] - Blueprint$/m, 'the template title names the project placeholder');
assert.match(templateBody, /link no record that carries an identifier/i, 'the template tells a room its Blueprint links no record that carries an identifier');
assert.doesNotMatch(templateBody, /\b(?:Align|Journey|Director|Dispatcher|Worker|prototype|Human QA|branch)\b/i, 'the generic template carries no product workflow');

const inventory = JSON.parse(fs.readFileSync(path.join(root, 'workbench/specs/S-00A-blueprint-active-adr-and-context-map/blueprint-claim-disposition.json')));
for (const source of inventory.sources) {
  const original = execFileSync('git', ['show', `${source.commit}:${source.path}`], {cwd:root,encoding:'utf8'});
  assert.equal(source.claims.map(x => x.text).join(''), original, 'inventory must preserve every source byte in order');
  for (const claim of source.claims) {
    assert.ok(claim.disposition && claim.reason && claim.owner);
    assert.ok(fs.existsSync(path.join(root, claim.owner)), claim.owner);
  }
}
// S-004H TK-005Q: every paragraph of the Blueprint and of its template, as they stood
// before the four-part swap, has a recorded home that exists. The inventory is lossless
// (its claims rebuild the pinned source byte for byte, in order) so nothing can be dropped
// unrecorded, and a claim cannot name a home that is not on the tree.
const findFile = (start, name) => {
  const hit = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) { const found = hit(full); if (found) return found; }
      else if (entry.name === name) return full;
    }
    return null;
  };
  return hit(path.join(root, start));
};
const paragraphFile = findFile('workbench/specs', 'blueprint-paragraph-disposition.json');
assert.ok(paragraphFile, 'the Blueprint Short Page spec must keep its paragraph disposition inventory');
const paragraphs = JSON.parse(fs.readFileSync(paragraphFile, 'utf8'));
assert.deepEqual(paragraphs.sources.map(s => s.path), ['BLUEPRINT.md', 'templates/BLUEPRINT.md'], 'the inventory covers the root Blueprint and its template');
const HOME_KINDS = new Set(['short-page', 'decision-record', 'wiki', 'landmark', 'spec', 'skill', 'contract', 'generic-contract', 'generic-mirror']);
const DISPOSITIONS = new Set(['relocate-claim', 'replaced-claim', 'retired-shape', 'retired-claim', 'gap']);
for (const source of paragraphs.sources) {
  const original = execFileSync('git', ['show', `${source.commit}:${source.path}`], { cwd: root, encoding: 'utf8' });
  assert.equal(source.claims.map(x => x.text).join(''), original, `${source.path}: the paragraph inventory must preserve every source byte in order`);
  const ids = new Set();
  for (const claim of source.claims) {
    assert.ok(!ids.has(claim.id), `${claim.id} is unique`);
    ids.add(claim.id);
    assert.ok(DISPOSITIONS.has(claim.disposition), `${claim.id}: unknown disposition ${claim.disposition}`);
    assert.ok(claim.reason && claim.reason.length > 20, `${claim.id}: a recorded reason`);
    assert.ok(Array.isArray(claim.homes) && claim.homes.length > 0, `${claim.id}: at least one home`);
    assert.equal(claim.owner, claim.homes[0].owner, `${claim.id}: the owner is the first home`);
    for (const home of claim.homes) {
      assert.ok(HOME_KINDS.has(home.kind), `${claim.id}: unknown home kind ${home.kind}`);
      assert.ok(home.note && home.note.length > 5, `${claim.id}: each home says what it carries`);
      assert.ok(fs.existsSync(path.join(root, home.owner)), `${claim.id}: home ${home.owner} must exist on the tree`);
    }
  }
}
// The corrective-work rules were replaced after this page was written (the Corrective Work Rules Spec), so a
// passage that states the old corrective-Task rule is never recorded as merely moved.
for (const claim of paragraphs.sources[0].claims.filter(c => /corrective Tasks?\b/i.test(c.text))) {
  assert.equal(claim.disposition, 'replaced-claim', `${claim.id}: an old corrective-Task passage must be recorded as replaced, not relocated`);
}
// The template's generic workflow paragraph is split into one claim per sentence, each with a generic home,
// and a claim with no generic home is a recorded gap, never silently dropped.
const templateClaims = paragraphs.sources[1].claims.filter(c => c.id.startsWith('tpl-wf-'));
assert.equal(templateClaims.length, 9, 'the template workflow paragraph is recorded sentence by sentence');
for (const claim of templateClaims.filter(c => c.disposition === 'relocate-claim')) {
  assert.ok(claim.homes.some(h => h.kind === 'generic-contract' || h.kind === 'generic-mirror' || h.kind === 'decision-record' || h.kind === 'wiki'), `${claim.id}: a relocated template claim names a generic home`);
}
assert.ok(templateClaims.some(c => c.disposition === 'gap'), 'a template claim with no generic mirror is recorded as a gap');
// The two Wiki pages that hold the workflow and the altitudes exist, and the rewritten workflow no longer
// carries the owner's brace-and-arrow map verbatim.
const workflowPage = fs.readFileSync(path.join(root, 'workbench/wiki/design-concepts/idea-to-delivery-workflow.md'), 'utf8');
assert.doesNotMatch(workflowPage, /Spec branch \{|Pick up a hot non-conflicting Task\n/, 'the Wiki workflow is rewritten in the workflow verbs, not the verbatim map');
for (const verb of ['Idea', 'Align', 'Confirm', 'Map', 'Plan', 'Implement', 'Review', 'Verify']) {
  assert.match(workflowPage, new RegExp(`\\b${verb}\\b`), `the Wiki workflow names the verb ${verb}`);
}
assert.ok(fs.existsSync(path.join(root, 'workbench/wiki/design-concepts/delivery-altitudes.md')), 'the altitudes page exists');


// The claims the Blueprint used to pin by regular expression: 47 workflow, altitude, loop, role, Human QA,
// closure and topology checks. They moved with their content. Each entry below either names the owner
// that carries the claim now (and the pin reads that owner, so the claim stays pinned) or is retired
// with its reason. The owner's verbatim workflow map is gone from the Blueprint, so its byte-for-byte
// pin and mutation controls retired with it: the owner moved the map to the Workflow landmark and the
// Wiki, rewritten in the workflow verbs and no longer kept verbatim.
{
const D = 'workbench/docs/ddr/', A = 'workbench/docs/adr/', W = 'workbench/wiki/design-concepts/';
const F000 = A + '000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md';
const G000 = A + '000G-blueprint-spec-and-task-are-three-altitudes-of-one-delivery-chain.md';
const WF = W + 'idea-to-delivery-workflow.md', ALT = W + 'delivery-altitudes.md';
const DDR_B = D + '000B-only-a-confirmed-concept-is-mapped-planned-or-implemented.md';
const DDR_D = D + '000D-prototype-needs-no-map-and-lands-nothing-in-enduring-context.md';
const DDR_A = D + '000A-the-workbench-aligns-to-the-owner-s-concept-and-delivers-on-it-recursively.md';
const DDR_M = D + '000M-working-artifacts-are-scaffolding-cleared-away-once-their-knowledge-is-kept.md';
const C = (label, owner, re) => ({ label, owner, re });
const R = (label, reason) => ({ label, retired: reason });
const workflowChecks = [
 C('rung: an owner idea opens Align', WF, /Idea -> Align -> Confirm/),
 C('rung: an owner may explore an idea before Align', WF, /explore it in conversation/),
 C('rung: Align proceeds through grilling', WF, /grilling supports it/),
 C('rung: grill-me, brainstorming and wayfinding can open Align', WF, /brainstorming, wayfinding and research can open it/),
 C('rung: Align uses research for a named uncertainty', WF, /settle a named uncertainty/),
 C('rung: Align ends when owner and agent confirm a shared design concept', WF, /explicitly confirm the concept/),
 C('rung: the confirmed design concept is what gets blueprinted', DDR_B, /Only a confirmed concept is mapped, planned or implemented/),
 C('rung: a prototype is optional, after the Blueprint and before a Spec', DDR_D, /Prototype is an optional workflow verb/),
 C('rung: prototype code carries forward only under ordinary verification', DDR_D, /Prototype code carries forward into the product only once it meets the same implementation and verification requirements/),
 C('rung: delivery is the recursive Spec and Task loop', DDR_A, /recursively/),
 C('altitude: the Blueprint owns the product-level destination', ALT, /product-level destination/),
 C('altitude: a Spec is one scoped objective with its own destination', ALT, /scoped objective with its own destination/),
 C('altitude: a Spec is PRD-shaped', ALT, /PRD-shaped/),
 C('altitude: Tasks do the counting', G000, /Tasks do the counting/),
 C('altitude: stacked Specs realize the Blueprint journey', ALT, /Stacked Specs realize the Blueprint/),
 R('altitude: a gap against an existing destination is corrective Task work', 'Superseded by the owner\'s corrective-work answers carried in the Corrective Work Rules Spec: a later gap against delivered work is a new Spec, never a revived one.'),
 C('loop: the Taskboard projects Task state', ALT, /Taskboard is a generated board/),
 R('interpretation: the prose after the map is labeled as interpretation, not source', 'Retires with the verbatim map: the owner replaced the keep-it-verbatim rule.'),
 C('loop: a Task has no review or approval gate; its Worker self-checks', F000, /No Task has a separate destination-level review or approval gate/),
 C('loop: merging a Task is containment, not QA', F000, /Merging a Task is coordination and containment, not QA/),
 C('loop: a missed Task is not reopened; its TASK.md stays', F000, /The missed-Task destination model never silently reopens completed\s+proof/),
 C('scale: a Spec is a local destination such as 1 through 5 and a Task is about 0.1', G000, /1 through 5[\s\S]{0,300}?0\.1/),
 C('roles: role defines scope and stance defines the job', 'AGENTS.md', /A role defines the assigned scope of responsibility[\s\S]{0,400}?A stance defines the job within that scope/),
 C('roles: the owner is the human above the Director', F000, /human above the Director/),
 C('roles: the Director approves the assembled Spec in a separate context before integration', F000, /Director then approves\s+the immutable assembled candidate in a separate context before it combines\s+into `integration`/),
 C('board: Needs review waits for Director approval and Complete waits for closure', F000, /Needs review holds an assembled Spec waiting for the\s+Director's approval, and Complete holds approved work waiting for closure/),
 C('Human QA: the version cadence is the default, and the owner chooses when to QA', F000, /described default, not the only permitted time:\s+the owner chooses when to QA/),
 C('Human QA: approval is recorded per Spec, and monitoring is not approval', F000, /monitoring, observations and passing reviews never approve\s+a\s+Spec/),
 C('closure: main verification precedes completion, features capture, retirement and discard', F000, /verification of the\s+approved change on `main`, then `complete`, then features Wiki capture[\s\S]{0,200}?then retirement, then discard/),
 C('topology: a direct Blueprint Task route is destination design that never bypasses the operative gate', F000, /Direct Blueprint Tasks: destination design[\s\S]{0,1200}?does not replace or bypass the\s+operative gate/),
 C('topology: no role works from main', F000, /no role works from\s+`main`/),
 C('loop: an agent picks up the hot Task', WF, /sends a Worker to each hot Task/),
 C('loop: a Task is implemented with red/green TDD', WF, /red\/green TDD/),
 C('loop: the proven Task branch lands', WF, /Merge Task into Spec branch/),
 C('loop: the finished Task is reconciled into its Spec', 'AGENTS.md', /Reconcile surviving claims/),
 C('loop: the reconciled Task is retired', 'AGENTS.md', /retire-spec S-###/),
 C('loop: a retired Task\'s branch is cleaned up once its Spec branch contains it', WF, /the branch goes once the Spec branch contains it/),
 C('loop: the assembled Spec is reviewed in a separate context', F000, /Director then approves\s+the immutable assembled candidate in a separate context/),
 C('loop: a failed review is corrected under the still-open Spec', F000, /each finding is corrected under\s+the still-open Spec/),
 C('loop: the owner runs Human QA on the integration branch', F000, /Human QA gate\*\* runs from `integration` into `main`/),
 C('loop: no Git merge closes a Spec', F000, /No Git merge closes a Spec/),
 C('loop: the closed Spec is reconciled into the Wiki and retired', F000, /features Wiki capture at that\s+closure point, then retirement/),
 C('loop: verified transient records may be discarded, Git keeping the history', F000, /discard of the transient records/),
 C('loop: failed Human QA returns to Align at the appropriate scope', F000, /returns\s+to Align and the design-concept\/delivery loop at the appropriate scope/),
 C('topology: a Task branch is cut from its Spec branch', WF, /a Spec branch is cut from integration/),
 C('owners: SPEC and TASK records are transient working artifacts', DDR_M, /scaffolding/),
 R('scope: Director coordinates the whole project and integration', 'Stale against the accepted role decision, which gives integration to the Captain; the old wording is not carried forward.'),
];

assert.equal(workflowChecks.length, 47, 'every one of the 47 retired Blueprint workflow checks is accounted for');
assert.equal(new Set(workflowChecks.map(c => c.label)).size, 47, 'each retired check appears once');
for (const check of workflowChecks) {
  if (check.retired) {
    assert.ok(check.retired.length > 40, `${check.label}: a retired check records why`);
    continue;
  }
  const owner = fs.readFileSync(path.join(root, check.owner), 'utf8').replace(/\s+/g, ' ');
  assert.match(owner, check.re, `${check.label}: now carried by ${check.owner}`);
}
}
console.log('ok - four-part Blueprint shape for the root page and the template, what the root page states and does not, the paragraph inventories, and the retired workflow checks carried by their new owners; semantic fidelity needs independent review');

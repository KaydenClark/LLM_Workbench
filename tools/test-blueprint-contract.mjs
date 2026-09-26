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
// The owner's workflow map is source, carried exactly as he confirmed it on
// 2026-09-24 (commit 482dc6b, delivered by PR #151). The prose after it is a
// separately labeled interpretation, so the map itself must stay byte-for-byte
// the carried source: its braces are the loops and branches, its arrows the
// progression, and its indentation the nesting. A keyword regex alone accepted
// the map with every brace removed, so the structure is compared line by line
// and the check is proven against in-memory mutations below.
const SOURCE_MAP_COMMIT = '482dc6beaa9fd4a0f85fe2f7c401781b0020c4ff';
const rawBlueprint = fs.readFileSync(path.join(root, 'BLUEPRINT.md'), 'utf8');
const extractSourceMap = text => (text.match(/```text\n(Idea\n[\s\S]*?)```/) || [])[1] ?? null;
const carriedMap = extractSourceMap(execFileSync('git', ['show', `${SOURCE_MAP_COMMIT}:BLUEPRINT.md`], { cwd: root, encoding: 'utf8' }));
assert.ok(carriedMap, `the carried owner map must be readable at ${SOURCE_MAP_COMMIT}`);
const mapStructure = map => map.split('\n').filter(line => line.trim()).map(line => ({
  indent: line.match(/^ */)[0].length,
  arrow: line.trimStart().startsWith('->'),
  arrows: (line.match(/->/g) || []).length,
  opens: (line.match(/\{/g) || []).length,
  closes: (line.match(/\}/g) || []).length
}));
function sourceMapProblems(text) {
  const map = extractSourceMap(text);
  if (map === null) return ['owner workflow map is missing its ```text block starting at Idea'];
  const problems = [];
  const count = (m, re) => (m.match(re) || []).length;
  for (const [label, re] of [['opening braces', /\{/g], ['closing braces', /\}/g], ['arrows', /->/g]]) {
    if (count(map, re) !== count(carriedMap, re)) problems.push(`${label}: ${count(map, re)} where the carried map has ${count(carriedMap, re)}`);
  }
  const have = mapStructure(map);
  const want = mapStructure(carriedMap);
  if (have.length !== want.length) problems.push(`lines: ${have.length} where the carried map has ${want.length}`);
  want.forEach((line, i) => {
    const got = have[i];
    if (!got || JSON.stringify(got) !== JSON.stringify(line)) problems.push(`line ${i + 1} structure (indent, arrows, braces) differs from the carried map`);
  });
  for (const loop of ['Spec branch {', 'Repeat Tasks in parallel where they do not conflict', 'If findings: create corrective Tasks -> repeat Task loop', 'Fail -> return to Align', 'repeat delivery loop']) {
    const at = line => carriedMap.split('\n').find(l => l.includes(line));
    if (!map.split('\n').includes(at(loop))) problems.push(`loop line "${loop}" is missing or re-indented`);
  }
  if (map !== carriedMap) problems.push('owner workflow map is not byte-for-byte the carried source');
  return problems;
}
assert.deepEqual(sourceMapProblems(rawBlueprint), [], 'owner workflow map must stay the carried source, with its braces, arrows, indentation and loops');
// Negative controls: each in-memory mutation loses source structure and must be rejected.
const mutations = [
  ['every brace removed', t => t.replace(/[{}]/g, '')],
  ['every arrow removed', t => t.replace(/-> /g, '')],
  ['indentation flattened', t => t.replace(/^ +/gm, '')],
  ['the Human QA return loop dropped', t => t.replace(/^ *Fail -> return to Align\n/m, '')]
];
for (const [name, mutate] of mutations) {
  const mutated = mutate(rawBlueprint);
  assert.notEqual(mutated, rawBlueprint, `mutation "${name}" must change the Blueprint`);
  assert.notDeepEqual(sourceMapProblems(mutated), [], `a workflow map with ${name} must be rejected`);
}
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
  ['interpretation: the prose after the map is labeled as interpretation, not source', /Reading the map \(interpretation, not source\)/],
  ['loop: a Task has no review or approval gate; its Worker self-checks', /no review or approval gate[\s\S]{0,200}?self-check/i],
  ['loop: merging a Task is containment, not QA', /containment, not QA/i],
  ['loop: a missed Task is not reopened; its TASK.md stays, its card returns to In progress and a new Task fixes it', /not reopened[\s\S]{0,200}?TASK\.md[\s\S]{0,200}?In progress[\s\S]{0,200}?new Task/i],
  ['scale: a Spec is a local destination such as 1 through 5 and a Task is about 0.1', /1 through 5[\s\S]{0,300}?0\.1/i],
  ['roles: Director, Dispatcher and Worker are defined by responsibility, not branch', /Director, Dispatcher and Worker are roles defined by responsibility, not by branch/i],
  ['roles: the owner is the human above the Director', /owner is the human above them, not the Director/i],
  ['roles: the Director approves the assembled Spec in a separate context before integration', /Director then approves the immutable assembled candidate in a separate context before it combines into integration/i],
  ['board: Needs review waits for Director approval and Complete waits for closure', /Needs review[\s\S]{0,120}?Director's approval[\s\S]{0,120}?Complete[\s\S]{0,120}?closure/i],
  ['Human QA: the version cadence is the default, and the owner chooses when to QA', /Director's approval of the version's Specs[\s\S]{0,400}?described default, not the only permitted time[\s\S]{0,40}?owner chooses when to QA/i],
  ['Human QA: approval is recorded per Spec, and monitoring is not approval', /Approval is recorded per Spec[\s\S]{0,120}?monitoring or a passing review is not approval/i],
  ['closure: main verification precedes completion, features capture, retirement and discard', /owner's approval, the approved change is verified on the default branch; only then is the Spec completed[\s\S]{0,120}?features Wiki[\s\S]{0,120}?retired[\s\S]{0,60}?discarded/i],
  ['topology: a direct Blueprint Task route is destination design that never bypasses the operative pre-integration gate', /destination design[\s\S]{0,500}?directly[\s\S]{0,300}?integration[\s\S]{0,400}?never bypasses its separate-context review before branches combine into integration/i],
  ['topology: no role works from main', /No role works from main/],
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
// Superseded by the 2026-09-24 SCR answers: per-Task review in the prose and
// the 100/20/5 scale. The verbatim source map still says "Review Task"; the
// labeled interpretation reads it as the Worker's self-check and hand-back.
assert.doesNotMatch(blueprint, /Each completed Task receives review|reaching 20|reaching 5\b/, 'BLUEPRINT.md prose must not restore per-Task review or the superseded scale');
// Human QA is not version-only and closure never precedes main verification.
assert.doesNotMatch(blueprint, /Human QA (?:only|is only|comes only) after|closed Spec is reconciled into its durable owners/i, 'BLUEPRINT.md must not make Human QA version-only or close a Spec before main verification');
const unstated = workflow.filter(([, pattern]) => !pattern.test(blueprint)).map(([claim]) => claim);
assert.deepEqual(unstated, [], 'BLUEPRINT.md must let a reader state every rung, altitude and loop stage');
console.log('ok - destination Blueprint shape, governing workflow rungs and loop stages, and lossless claim-disposition inventory; semantic fidelity needs independent review');

#!/usr/bin/env node
// One-command demo of the Landmark Tracker foundation (S-01T TK-01X):
//
//   node tools/landmark-tracker-demo.mjs
//
// In a disposable room it captures an unanswered, ungrouped DQC, reloads it in
// a fresh process, evolves it (retitle, confirm, Expected result, correction),
// adds a landmark and links it, assesses two cards, rebuilds TRACKER.json and
// prints the lineage and the 30/20/50 distribution. TK-01Y extends it: the
// 30/20/50 example at DQC and landmark scope, a Spec shared by two cards and
// counted once, lineage expansion that keeps a mixed DQC one item, a
// navigation cycle kept and an arithmetic dependency cycle refused, explicit
// incomplete and invalid outcomes, and a scoped claim reconciliation. Every
// step runs the real command line in its own process. The room is deleted
// afterwards unless --keep is given. All concepts and records are fixtures,
// not owner concepts.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { formatDistribution } from '../workbench/tools/landmark-tracker.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tool = path.join(root, 'workbench', 'tools', 'landmark-tracker.mjs');
const keep = process.argv.includes('--keep');
const started = Date.now();
const room = fs.mkdtempSync(path.join(os.tmpdir(), 'landmark-tracker-demo-'));

function tracker(...args) {
  const result = spawnSync(process.execPath, [tool, ...args, '--path', room, '--json'], { encoding: 'utf8' });
  const parsed = result.stdout ? JSON.parse(result.stdout) : null;
  if (result.status !== 0) throw new Error(`landmark-tracker ${args[0]} failed: ${result.stdout}${result.stderr}`);
  return parsed;
}

// A refusal the demo expects: returns the blocked JSON instead of throwing.
function refusal(...args) {
  const result = spawnSync(process.execPath, [tool, ...args, '--path', room, '--json'], { encoding: 'utf8' });
  if (result.status === 0) throw new Error(`landmark-tracker ${args[0]} was expected to refuse: ${result.stdout}`);
  return JSON.parse(result.stdout);
}

function readView() {
  return JSON.parse(fs.readFileSync(path.join(room, 'workbench', 'landmark-tracker', 'TRACKER.json'), 'utf8'));
}

function cardOf(projection, id) {
  return projection.questions.find(item => item.id === id);
}

function thirtyTwentyFifty(aggregate) {
  const shares = aggregate.distribution;
  return aggregate.status === 'complete' && aggregate.denominator === 2 && shares.Journey === 30 && shares.Review === 20 && shares.Verified === 50;
}

function readable(...args) {
  const result = spawnSync(process.execPath, [tool, ...args, '--path', room], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr);
  return result.stdout.trimEnd();
}

function step(label) {
  process.stdout.write(`\n== ${label}\n`);
}

try {
  const declaration = {
    root: 'workbench/landmark-tracker',
    collections: {
      'destination-questions': 'workbench/landmark-tracker/destination-questions',
      landmarks: 'workbench/landmark-tracker/landmarks'
    }
  };
  for (const relative of Object.values(declaration.collections)) fs.mkdirSync(path.join(room, relative), { recursive: true });
  fs.writeFileSync(path.join(room, 'workbench', 'manifest.json'), `${JSON.stringify({ schemaVersion: 2, landmarkTracker: declaration }, null, 2)}\n`);
  process.stdout.write(`Disposable room: ${room}\n`);

  step('1. Capture an unanswered, ungrouped DQC');
  const card = tracker('capture', '--title', 'How a fixture room keeps its lantern lit',
    '--question', 'What must stay true for the fixture lantern to remain lit across restarts?',
    '--source', 'FX-1@r1', '--source', 'FX-2', '--uncertainty', 'Whether restarts include clones',
    '--reason', 'Synthesized two fixture interview questions');
  process.stdout.write(`captured ${card.id} at revision ${card.revision} -> ${card.record}\n`);

  step('2. Reload it in a fresh process');
  process.stdout.write(`${readable('show', card.id)}\n`);

  step('3. Evolve it: retitle, answer, confirm, Expected result, correction');
  tracker('revise', card.id, '--expect-revision', '1', '--title', 'Keeping the fixture lantern lit',
    '--answer', 'The lantern stays lit when its fuel record survives restarts.',
    '--confirm', 'Fixture owner confirmed the scoped answer',
    '--expected-change', 'A readable explanation of lantern upkeep', '--expected-home', 'workbench/wiki/design-concepts',
    '--correction', 'Restarts include clones, not only process restarts',
    '--resolve-uncertainty', 'Whether restarts include clones',
    '--reason', 'Owner answered and corrected the restart scope');

  step('4. A landmark emerges; link the card to it');
  const landmark = tracker('add-landmark', '--title', 'Fixture lighting', '--summary', 'How fixture rooms keep light available',
    '--importance', 'A fixture framework pillar', '--reason', 'Emerged from the lantern card');
  tracker('link', card.id, '--landmark', landmark.id, '--expect-revision', '2', '--reason', 'The lantern card belongs to lighting');
  process.stdout.write(`${landmark.id} linked to ${card.id}\n`);

  step('5. Assess two cards: 0.6 Journey / 0.4 Review, and one Verified');
  tracker('revise', card.id, '--expect-revision', '3', '--assess', 'Journey=0.6,Review=0.4',
    '--basis', 'Draft article underway; one section assessed against expected claims', '--evidence', 'fixture-draft@r1',
    '--reason', 'First documentation assessment');
  const second = tracker('capture', '--title', 'Fixture door latch', '--question', 'How does the fixture door stay latched?', '--reason', 'Second fixture concept');
  tracker('revise', second.id, '--expect-revision', '1', '--assess', 'Verified=1',
    '--basis', 'Durable contents checked against the expected claims', '--evidence', 'fixture-article@r3', '--reason', 'Verified against actual contents');

  step('6. Rebuild TRACKER.json from the records and print lineage and distributions');
  const rebuilt = tracker('rebuild');
  const check = tracker('rebuild', '--check');
  process.stdout.write(`${rebuilt.status} ${rebuilt.projection}; check: ${check.status}\n`);
  process.stdout.write(`${readable('show')}\n`);
  const view = JSON.parse(fs.readFileSync(path.join(room, declaration.root, 'TRACKER.json'), 'utf8'));
  const dist = view.workbench.distribution;
  process.stdout.write(`\nWorkbench distribution: Journey ${dist.Journey}%, Review ${dist.Review}%, Verified ${dist.Verified}% over ${view.workbench.items} distinct items\n`);
  const expected = dist.Journey === 30 && dist.Review === 20 && dist.Verified === 50;
  process.stdout.write(`30/20/50 example: ${expected ? 'PASS' : 'FAIL'}\n`);

  // Fixture room records the Tracker resolves by typed identity.
  const specDir = path.join(room, 'workbench', 'specs', 'S-0AA-fixture-lantern');
  fs.mkdirSync(specDir, { recursive: true });
  fs.writeFileSync(path.join(specDir, 'SPEC.md'), '# S-0AA - Fixture lantern\n');
  fs.mkdirSync(path.join(room, 'workbench', 'docs', 'adr'), { recursive: true });
  fs.writeFileSync(path.join(room, 'workbench', 'docs', 'adr', '0ACC-fixture-decision.md'), '---\nstatus: accepted\n---\n# Fixture decision\n');

  step('7. The 30/20/50 example at DQC and landmark scope: a mixed card plus one related Verified ADR');
  const shutters = tracker('capture', '--title', 'Fixture window shutters', '--question', 'How do the fixture shutters close?', '--reason', 'Third fixture concept');
  tracker('revise', shutters.id, '--expect-revision', '1', '--assess', 'Journey=0.6,Review=0.4', '--basis', 'Draft underway; one section assessed', '--evidence', 'fixture-draft@r2', '--reason', 'assess');
  const adr = tracker('relate', shutters.id, '--item', 'adr:ADR-0ACC', '--assess', 'Verified=1', '--basis', 'Durable contents checked', '--evidence', 'fixture-adr@r1', '--expect-revision', '2', '--reason', 'The decision the shutters rely on');
  process.stdout.write(`related ${adr.item.display} [${adr.resolution}] to ${shutters.id}\n`);
  const openings = tracker('add-landmark', '--title', 'Fixture openings', '--summary', 'Doors and windows of the fixture room', '--reason', 'Emerged from the shutters card');
  tracker('link', shutters.id, '--landmark', openings.id, '--expect-revision', '3', '--reason', 'Shutters are an opening');
  let projection = readView();
  const dqcScope = cardOf(projection, shutters.id).distribution;
  const landmarkScope = projection.landmarks.find(item => item.id === openings.id).aggregate;
  for (const [label, aggregate] of [[`DQC scope ${shutters.id}`, dqcScope], [`landmark scope ${openings.id}`, landmarkScope]]) {
    process.stdout.write(`${label}: numerators ${JSON.stringify(Object.fromEntries(Object.entries(aggregate.numerators).filter(([, value]) => value > 0)))} / denominator ${aggregate.denominator} -> ${formatDistribution(aggregate)}\n`);
  }
  for (const entry of dqcScope.contributions) process.stdout.write(`  ${entry.key}: ${JSON.stringify(entry.contributions)} basis "${entry.basis}" evidence ${entry.evidence.join(', ')} at ${entry.holder} r${entry.revision}\n`);
  const scoped = expected && thirtyTwentyFifty(dqcScope) && thirtyTwentyFifty(landmarkScope);
  process.stdout.write(`distributions scoped: ${scoped ? 'PASS' : 'FAIL'}\n`);

  step('8. Shared identity: one Spec related by two cards counts once');
  tracker('relate', card.id, '--item', 'spec:S-0AA@r1', '--assess', 'Planned=1', '--basis', 'Bounded plan recorded', '--evidence', 'fixture-plan@r1', '--expect-revision', '4', '--reason', 'The lantern Spec');
  tracker('relate', second.id, '--item', 'spec:S-0AA@r1', '--assess', 'Planned=1', '--basis', 'Bounded plan recorded', '--evidence', 'fixture-plan@r1', '--expect-revision', '2', '--reason', 'The latch shares the lantern Spec');
  projection = readView();
  const shared = projection.items.find(item => item.key === 'spec:S-0AA');
  const once = projection.workbench.counted.filter(key => key === 'spec:S-0AA').length === 1;
  process.stdout.write(`shared identity: spec:S-0AA counted once across ${shared.relatedBy.join(' and ')} (${once ? 'once' : 'MORE THAN ONCE'}); Workbench ${formatDistribution(projection.workbench)}\n`);

  step('9. Lineage expansion keeps a mixed DQC one item');
  const household = tracker('capture', '--title', 'Fixture household light', '--question', 'How is the whole fixture room lit?', '--reason', 'Parent fixture concept');
  tracker('revise', household.id, '--expect-revision', '1', '--assess', 'Verified=1', '--basis', 'Durable contents checked', '--evidence', 'fixture-overview@r1', '--reason', 'assess');
  tracker('relate', household.id, '--item', `dqc:${card.id}`, '--expect-revision', '2', '--reason', 'The lantern is part of household light');
  projection = readView();
  const parent = cardOf(projection, household.id);
  const child = parent.lineage.related.find(node => node.id === card.id);
  process.stdout.write(`lineage expansion: ${household.id} -> ${card.id} -> ${child.related.map(node => node.key).join(', ')}; ${card.id} stays one item in ${household.id}'s scope: ${formatDistribution(parent.distribution)}\n`);

  step('10. A navigation cycle is kept; an arithmetic dependency cycle is refused');
  tracker('relate', card.id, '--item', `dqc:${household.id}`, '--expect-revision', '5', '--reason', 'Household light frames the lantern');
  projection = readView();
  const loop = cardOf(projection, card.id).lineage.related.find(node => node.id === household.id);
  const marked = loop.related.find(node => node.id === card.id);
  process.stdout.write(`navigation cycle preserved: ${card.id} -> ${household.id} -> ${card.id} (${marked?.cycle ? 'cycle marked, not expanded' : 'NOT MARKED'})\n`);
  tracker('revise', household.id, '--expect-revision', '3', '--assess', 'derived', '--basis', 'Derived from the related lantern card', '--reason', 'derive');
  const before = fs.readFileSync(path.join(room, declaration.root, 'TRACKER.json'), 'utf8');
  const cycle = refusal('revise', card.id, '--expect-revision', '6', '--assess', 'derived', '--basis', 'Derived too', '--reason', 'close the loop');
  const untouched = fs.readFileSync(path.join(room, declaration.root, 'TRACKER.json'), 'utf8') === before;
  process.stdout.write(`refused (${cycle.error.code}): ${cycle.error.message} [TRACKER.json ${untouched ? 'unchanged' : 'CHANGED'}]\n`);

  step('11. Explicit incomplete and invalid outcomes');
  tracker('relate', second.id, '--item', 'spec:S-0ZZ', '--expect-revision', '3', '--reason', 'A Spec this room does not hold');
  projection = readView();
  process.stdout.write(`${second.id} scope: ${formatDistribution(cardOf(projection, second.id).distribution)}\n`);
  const bad = refusal('relate', shutters.id, '--item', 'spec:S-0AA', '--assess', 'Journey=Infinity', '--basis', 'b', '--evidence', 'e', '--expect-revision', '4', '--reason', 'nonfinite');
  process.stdout.write(`refused (${bad.error.code}): a nonfinite fraction is never written\n`);
  tracker('relate', shutters.id, '--item', 'spec:S-0AA', '--assess', 'Review=1', '--basis', 'A different reading', '--evidence', 'fixture-review@r2', '--expect-revision', '4', '--reason', 'Conflicting fixture reading');
  projection = readView();
  process.stdout.write(`Workbench: ${formatDistribution(projection.workbench)}\n`);

  step('12. Changed understanding: a specific affected claim, not blanket staleness');
  tracker('revise', second.id, '--expect-revision', '4', '--answer', 'A spring holds the latch.', '--claim', 'C1=A spring holds the fixture latch', '--claim', 'C2=The latch is brass', '--claim-evidence', 'C1=fixture-note@r1', '--claim-evidence', 'C2=fixture-sketch@r1', '--reason', 'Answered with claims');
  tracker('revise', second.id, '--expect-revision', '5', '--answer', 'A magnet holds the latch.', '--affects', 'C1=The claim names a spring; the corrected answer names a magnet', '--reason', 'Owner corrected the mechanism');
  projection = readView();
  for (const need of projection.reconciliation) process.stdout.write(`reconciliation: ${need.dqc}#${need.claim} affected at r${need.revision} (${need.reason}): ${need.assessment}\n`);
  const claims = cardOf(projection, second.id).claims;
  process.stdout.write(`${second.id} claims: ${claims.map(claim => `${claim.key} ${claim.status} (evidence ${claim.evidence.map(item => `${item.ref} at r${item.revision}`).join(', ')})`).join('; ')}\n`);
  process.stdout.write(`${household.id} and ${card.id} reconciliation needs: ${[...cardOf(projection, household.id).reconciliation, ...cardOf(projection, card.id).reconciliation].length} (a relation alone makes nothing stale)\n`);

  process.stdout.write(`Elapsed: ${((Date.now() - started) / 1000).toFixed(2)}s\n`);
  if (!expected || !scoped || !once || !marked?.cycle || !untouched) process.exitCode = 1;
} finally {
  if (keep) process.stdout.write(`Kept ${room}\n`);
  else fs.rmSync(room, { recursive: true, force: true });
}

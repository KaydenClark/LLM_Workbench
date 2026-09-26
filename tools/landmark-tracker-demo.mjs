#!/usr/bin/env node
// One-command demo of the Landmark Tracker foundation (S-01T TK-01X):
//
//   node tools/landmark-tracker-demo.mjs
//
// In a disposable room it captures an unanswered, ungrouped DQC, reloads it in
// a fresh process, evolves it (retitle, confirm, Expected result, correction),
// adds a landmark and links it, assesses two cards, rebuilds TRACKER.json and
// prints the lineage and the 30/20/50 distribution. Every step runs the real
// command line in its own process. The room is deleted afterwards unless
// --keep is given. All concepts are fixtures, not owner concepts.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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
  process.stdout.write(`Elapsed: ${((Date.now() - started) / 1000).toFixed(2)}s\n`);
  if (!expected) process.exitCode = 1;
} finally {
  if (keep) process.stdout.write(`Kept ${room}\n`);
  else fs.rmSync(room, { recursive: true, force: true });
}

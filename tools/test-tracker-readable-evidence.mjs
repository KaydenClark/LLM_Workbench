#!/usr/bin/env node
// TK-002U: persisted assessment evidence through the public readable seam.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { COLLECTIONS, LANES } from '../workbench/tools/workbench-paths.mjs';
import { formatTracker, showTracker } from '../workbench/tools/landmark-tracker.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tool = path.join(root, 'workbench/tools/landmark-tracker.mjs');
const declaration = {
  root: 'workbench/landmark-tracker',
  collections: {
    'destination-questions': 'workbench/landmark-tracker/destination-questions',
    landmarks: 'workbench/landmark-tracker/landmarks'
  }
};

function cli(dir, ...args) {
  const result = spawnSync(process.execPath, [tool, ...args, '--path', dir], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout;
}

function write(dir, ...args) {
  return JSON.parse(cli(dir, ...args, '--json'));
}

function fixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tracker-readable-'));
  for (const relative of [...Object.values(LANES), ...Object.values(COLLECTIONS), ...Object.values(declaration.collections)]) {
    fs.mkdirSync(path.join(dir, relative), { recursive: true });
  }
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'workbench/manifest.json'), 'utf8'));
  fs.writeFileSync(path.join(dir, 'workbench/manifest.json'), JSON.stringify({
    schemaVersion: 2, workbenchVersion: manifest.workbenchVersion,
    provenance: { lifecycle: 'genesis' }, lanes: LANES, collections: COLLECTIONS,
    wiki: { profile: 'project' }, skillPolicy: manifest.skillPolicy, landmarkTracker: declaration
  }));
  const card = write(dir, 'capture', '--title', 'Fixture evidence card', '--question', 'What supports this fixture?', '--source', 'fixture-origin@r1', '--reason', 'Fixture capture');
  write(dir, 'revise', card.id, '--expect-revision', '1', '--assess', 'Journey=0.6,Review=0.4', '--basis', 'Own fixture judgment', '--evidence', 'fixture-article@immutable-revision', '--reason', 'Assess fixture');
  write(dir, 'relate', card.id, '--expect-revision', '2', '--item', 'grilling-question:FX-REL@r7', '--assess', 'Verified=1', '--basis', 'Related fixture judgment', '--evidence', 'fixture-related-proof@r7', '--reason', 'Relate fixture evidence');
  return { dir, card };
}

function checkEvidence(output, id) {
  assert.ok(output.includes('fixture-article@immutable-revision'), 'readable own assessment evidence is missing');
  assert.ok(output.includes('fixture-related-proof@r7'), 'readable related assessment evidence is missing');
  assert.ok(output.includes(`dqc:${id}`), 'own contribution identity is missing');
  assert.ok(output.includes('grilling-question:FX-REL'), 'related contribution identity is missing');
  assert.match(output, /Journey 0\.6, Review 0\.4/);
  assert.match(output, /Verified 1/);
  assert.match(output, /basis: Own fixture judgment/);
  assert.match(output, /basis: Related fixture judgment/);
  assert.match(output, /assessment revision: 2/);
  assert.match(output, /assessment revision: 3/);
  assert.ok(output.includes(`holder: ${id}`));
  assert.match(output, /item revision: r7/);
}

test('expanded exported formatter exposes saved own and related evidence with provenance', () => {
  const { dir, card } = fixture();
  try {
    checkEvidence(formatTracker(showTracker(dir).tracker, { expand: true }), card.id);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('public expanded show exposes evidence for a DQC, landmark and whole Tracker', () => {
  const { dir, card } = fixture();
  try {
    const landmark = write(dir, 'add-landmark', '--title', 'Fixture pillar', '--summary', 'Fixture scope', '--importance', 'Fixture navigation', '--reason', 'Fixture grouping');
    write(dir, 'link', card.id, '--landmark', landmark.id, '--expect-revision', '3', '--reason', 'Fixture link');
    for (const selection of [[], [card.id], [landmark.id]]) {
      checkEvidence(cli(dir, 'show', ...selection, '--expand'), card.id);
    }
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

function sourceBytes(dir) {
  return Object.fromEntries(Object.values(declaration.collections).flatMap(relative =>
    fs.readdirSync(path.join(dir, relative)).map(name => [
      `${relative}/${name}`, fs.readFileSync(path.join(dir, relative, name), 'utf8')
    ])
  ));
}

test('expansion survives restart and rebuild without changing compact output, JSON or source bytes', () => {
  const { dir, card } = fixture();
  const clone = fs.mkdtempSync(path.join(os.tmpdir(), 'tracker-readable-clone-'));
  try {
    const sources = sourceBytes(dir);
    const projection = fs.readFileSync(path.join(dir, declaration.root, 'TRACKER.json'), 'utf8');
    for (const selection of [[], [card.id]]) {
      const compact = cli(dir, 'show', ...selection);
      assert.ok(!compact.includes('fixture-article@immutable-revision'));
      assert.ok(!compact.includes('fixture-related-proof@r7'));
      const json = cli(dir, 'show', ...selection, '--json');
      assert.equal(cli(dir, 'show', ...selection, '--expand', '--json'), json);
      const expanded = cli(dir, 'show', ...selection, '--expand');
      checkEvidence(expanded, card.id);
      fs.cpSync(dir, clone, { recursive: true });
      cli(clone, 'rebuild');
      assert.equal(cli(clone, 'show', ...selection, '--expand'), expanded);
      cli(dir, 'rebuild');
      assert.equal(cli(dir, 'show', ...selection), compact);
      assert.equal(cli(dir, 'show', ...selection, '--expand'), expanded);
      assert.equal(cli(dir, 'show', ...selection, '--json'), json);
    }
    assert.equal(formatTracker(showTracker(dir).tracker, { expand: false }), formatTracker(showTracker(dir).tracker));
    assert.deepEqual(sourceBytes(dir), sources);
    assert.deepEqual(sourceBytes(clone), sources);
    assert.equal(fs.readFileSync(path.join(dir, declaration.root, 'TRACKER.json'), 'utf8'), projection);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(clone, { recursive: true, force: true });
  }
});

test('unknown and unassessed items remain explicit without invented fractions or evidence', () => {
  const { dir, card } = fixture();
  try {
    write(dir, 'relate', card.id, '--expect-revision', '3', '--item', 'grilling-question:FX-NONE', '--reason', 'No judgment yet');
    write(dir, 'relate', card.id, '--expect-revision', '4', '--item', 'spec:S-999@r9', '--reason', 'Unavailable fixture Spec');
    const output = cli(dir, 'show', card.id, '--expand');
    assert.match(output, /grilling-question:FX-NONE \[unassessed\]/);
    assert.match(output, /spec:S-999 \[unknown\]/);
    const entries = showTracker(dir, card.id).view.distribution.contributions;
    for (const state of ['unassessed', 'unknown']) {
      const entry = entries.find(item => item.state === state);
      assert.equal(entry.contributions, null);
      assert.equal(entry.revision, null);
      assert.deepEqual(entry.evidence, []);
      const detail = output.slice(output.indexOf(`${entry.key} [${state}]`)).split('\n');
      assert.match(detail[0], /fractions: none recorded/);
      assert.match(detail[1], /basis: none recorded; evidence: none recorded/);
      assert.match(detail[2], /assessment revision: unknown/);
    }
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('a related mixed DQC contributes once and expansion terminates for navigation cycles', () => {
  const { dir, card } = fixture();
  try {
    const child = write(dir, 'capture', '--title', 'Fixture child', '--question', 'What supports the child?', '--reason', 'Fixture child');
    write(dir, 'revise', child.id, '--expect-revision', '1', '--assess', 'Journey=0.5,Review=0.5', '--basis', 'Child fixture judgment', '--evidence', 'fixture-child-proof@r2', '--reason', 'Child assessment');
    write(dir, 'relate', card.id, '--expect-revision', '3', '--item', `dqc:${child.id}@2`, '--reason', 'Child navigation');
    write(dir, 'relate', child.id, '--expect-revision', '2', '--item', `dqc:${card.id}@4`, '--reason', 'Navigation cycle');
    const shown = showTracker(dir, card.id);
    const output = cli(dir, 'show', card.id, '--expand');
    assert.ok(output.includes('fixture-child-proof@r2'));
    assert.ok(output.includes(`holder: ${child.id}`));
    assert.equal(shown.view.distribution.denominator, 3);
    assert.equal(shown.view.distribution.contributions.filter(item => item.id === child.id).length, 1);
    assert.equal(output.split(`contribution dqc:${child.id} `).length - 1, 1);
    assert.deepEqual(write(dir, 'show', card.id).view, shown.view);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('expanded whole Tracker deduplicates shared related identities in its aggregate', () => {
  const { dir, card } = fixture();
  try {
    const other = write(dir, 'capture', '--title', 'Fixture peer', '--question', 'What supports the peer?', '--reason', 'Fixture peer');
    write(dir, 'relate', other.id, '--expect-revision', '1', '--item', 'grilling-question:FX-REL@r7', '--assess', 'Verified=1', '--basis', 'Shared fixture judgment', '--evidence', 'fixture-related-proof@r7', '--reason', 'Shared fixture evidence');
    const shown = showTracker(dir).tracker;
    const output = cli(dir, 'show', '--expand');
    const workbenchDetail = output.split('\nNo landmark:')[0];
    assert.equal(workbenchDetail.split('contribution grilling-question:FX-REL ').length - 1, 1);
    assert.equal(shown.workbench.denominator, 3);
    assert.equal(shown.workbench.contributions.filter(item => item.id === 'FX-REL').length, 1);
    assert.ok(output.includes(card.id));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('derived evidence stays with its inputs and invalid assessments retain their codes', () => {
  const { dir, card } = fixture();
  try {
    write(dir, 'revise', card.id, '--expect-revision', '3', '--assess', 'derived', '--basis', 'Mean of fixture inputs', '--reason', 'Derive fixture');
    const derived = cli(dir, 'show', card.id, '--expand');
    assert.match(derived, /derived from: grilling-question:FX-REL/);
    assert.ok(derived.includes('fixture-related-proof@r7'));
    assert.ok(!derived.includes('fixture-article@immutable-revision'), 'previous own evidence is not current derived evidence');
    const other = write(dir, 'capture', '--title', 'Fixture conflict', '--question', 'Which fraction?', '--reason', 'Fixture conflict');
    write(dir, 'relate', other.id, '--expect-revision', '1', '--item', 'grilling-question:FX-REL@r8', '--assess', 'Idea=1', '--basis', 'Conflicting fixture judgment', '--evidence', 'fixture-conflict@r8', '--reason', 'Conflict fixture');
    const invalid = cli(dir, 'show', '--expand');
    assert.match(invalid, /distribution withheld/);
    assert.match(invalid, /contribution grilling-question:FX-REL \[invalid\]: fractions: none recorded/);
    assert.match(invalid, /codes: conflicting-assessment/);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('empty expanded Tracker reports no items and fabricates no contribution', () => {
  const { dir, card } = fixture();
  try {
    fs.unlinkSync(path.join(dir, declaration.collections['destination-questions'], `${card.id}.json`));
    cli(dir, 'rebuild');
    const output = cli(dir, 'show', '--expand');
    assert.match(output, /Workbench: no items/);
    assert.ok(!output.includes('contribution '));
    assert.ok(!output.includes('Verified'));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

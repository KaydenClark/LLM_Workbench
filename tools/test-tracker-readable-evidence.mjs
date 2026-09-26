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

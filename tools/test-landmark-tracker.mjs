#!/usr/bin/env node
// S-01T TK-01X: the Landmark Tracker foundation, exercised only at its public
// seams in disposable rooms - manifest discovery through workbench-paths.mjs
// and workbench-layout.mjs, and the landmark-tracker.mjs command line and
// exports. One ungrouped Destination Question Card (DQC) is captured, reloaded
// by a fresh process and a clone, evolved, connected to a landmark, and
// projected into a generated TRACKER.json that never authors source.
//
// S-01T TK-01Y extends the same seams: related grilling questions, Specs, ADRs,
// Tasks and DQCs contribute with typed room-scoped identity, and every
// aggregate (DQC, landmark and Workbench scope) exposes its numerator,
// denominator, evidence revision and rationale, deduplicating shared identity
// without flattening a mixed DQC, and ending empty, incomplete or invalid
// input with an explicit outcome.
//
// Every record here is a fixture concept invented for the test room; none is a
// real owner concept.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { COLLECTIONS, LANES, SIX_LANES } from '../workbench/tools/workbench-paths.mjs';
import * as paths from '../workbench/tools/workbench-paths.mjs';
import { SESSIONS_IGNORE, validateManifest } from '../workbench/tools/workbench-layout.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rootManifest = JSON.parse(fs.readFileSync(path.join(root, 'workbench', 'manifest.json'), 'utf8'));
const trackerTool = path.join(root, 'workbench', 'tools', 'landmark-tracker.mjs');
const STEPS = ['Idea', 'Aligning', 'Confirmed', 'Mapped', 'Planned', 'Journey', 'Review', 'Verified'];
// TK-01Y: an empty aggregate carries every inspection field, all empty.
const EMPTY_AGGREGATE = Object.freeze({ items: 0, denominator: 0, status: 'empty', counted: [], numerators: null, distribution: null, unassessed: [], unknown: [], invalid: [], bySourceType: {}, contributions: [] });
const DECLARATION = Object.freeze({
  root: 'workbench/landmark-tracker',
  collections: {
    'destination-questions': 'workbench/landmark-tracker/destination-questions',
    landmarks: 'workbench/landmark-tracker/landmarks'
  }
});

// A valid schema 2 room built by hand, so these tests do not depend on the
// release checkout being clean enough for `init` to stamp its source identity.
function room({ tracker = true, lanes = LANES } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-tracker-'));
  for (const relative of [...Object.values(lanes), ...Object.values(COLLECTIONS)]) {
    fs.mkdirSync(path.join(dir, relative), { recursive: true });
    fs.writeFileSync(path.join(dir, relative, '.gitkeep'), '');
  }
  fs.writeFileSync(path.join(dir, 'workbench', 'sessions', '.gitignore'), SESSIONS_IGNORE);
  const manifest = {
    schemaVersion: 2,
    workbenchVersion: rootManifest.workbenchVersion,
    provenance: { lifecycle: 'genesis' },
    lanes,
    collections: COLLECTIONS,
    wiki: { profile: 'project' },
    skillPolicy: rootManifest.skillPolicy
  };
  if (tracker) {
    manifest.landmarkTracker = structuredClone(DECLARATION);
    for (const relative of Object.values(DECLARATION.collections)) fs.mkdirSync(path.join(dir, relative), { recursive: true });
  }
  writeManifest(dir, manifest);
  return dir;
}

function readManifestAt(dir) {
  return JSON.parse(fs.readFileSync(path.join(dir, 'workbench', 'manifest.json'), 'utf8'));
}

function writeManifest(dir, manifest) {
  fs.writeFileSync(path.join(dir, 'workbench', 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
}

function cli(dir, ...args) {
  const result = spawnSync(process.execPath, [trackerTool, ...args, '--path', dir, '--json'], { encoding: 'utf8' });
  let json = null;
  try { json = JSON.parse(result.stdout); } catch { /* reported below */ }
  return { ...result, json };
}

function ok(result, status) {
  assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
  if (status) assert.equal(result.json.status, status, result.stdout);
  return result.json;
}

function refused(result, code) {
  assert.notEqual(result.status, 0, `expected refusal ${code}: ${result.stdout}${result.stderr}`);
  assert.equal(result.json?.status, 'blocked', result.stdout);
  assert.equal(result.json.error.code, code, result.stdout);
  return result.json;
}

// Every byte under the Tracker root, symlinks recorded by target.
function snapshot(dir) {
  const base = path.join(dir, DECLARATION.root);
  const out = {};
  function walk(current) {
    if (!fs.existsSync(current)) return;
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      const key = path.relative(base, full);
      if (entry.isSymbolicLink()) out[key] = `link:${fs.readlinkSync(full)}`;
      else if (entry.isDirectory()) walk(full);
      else out[key] = crypto.createHash('sha256').update(fs.readFileSync(full)).digest('hex');
    }
  }
  walk(base);
  return out;
}

function tracker(dir) {
  return JSON.parse(fs.readFileSync(path.join(dir, DECLARATION.root, 'TRACKER.json'), 'utf8'));
}

function capture(dir, extra = []) {
  return ok(cli(dir, 'capture',
    '--title', 'How a fixture room keeps its lantern lit',
    '--question', 'What must stay true for the fixture lantern to remain lit across restarts?',
    '--source', 'FX-1@r1', '--source', 'FX-2',
    '--uncertainty', 'Whether restarts include clones',
    '--reason', 'Synthesized two fixture interview questions', ...extra), 'captured');
}

test('a declared Tracker root resolves through workbench-paths and validates; an undeclared room is unchanged', () => {
  const declared = room();
  const legacy = room({ tracker: false });
  try {
    assert.equal(typeof paths.declaredTracker, 'function', 'workbench-paths.mjs exports declaredTracker');
    assert.deepEqual(paths.declaredTracker(declared), { root: DECLARATION.root, projection: `${DECLARATION.root}/TRACKER.json`, collections: DECLARATION.collections });
    assert.equal(paths.trackerCollectionPath(declared, 'destination-questions'), path.join(declared, DECLARATION.collections['destination-questions']));
    assert.equal(paths.trackerCollectionPath(declared, 'landmarks'), path.join(declared, DECLARATION.collections.landmarks));
    assert.equal(paths.trackerProjectionPath(declared), path.join(declared, DECLARATION.root, 'TRACKER.json'));
    assert.throws(() => paths.trackerCollectionPath(declared, 'features'), /unknown Tracker collection/);
    const valid = validateManifest(declared);
    assert.equal(valid.status, 'valid', JSON.stringify(valid));
    assert.deepEqual(valid.tracker, { root: DECLARATION.root, projection: `${DECLARATION.root}/TRACKER.json`, collections: DECLARATION.collections });

    assert.equal(paths.declaredTracker(legacy), null);
    assert.throws(() => paths.trackerCollectionPath(legacy, 'landmarks'), (error) => error.code === 'tracker-undeclared');
    const unchanged = validateManifest(legacy);
    assert.equal(unchanged.status, 'valid');
    assert.equal(Object.hasOwn(unchanged, 'tracker'), false, 'an undeclared room validates exactly as before');
    assert.deepEqual(Object.keys(unchanged).sort(), ['ignoreVerification', 'manifest', 'status']);
  } finally {
    fs.rmSync(declared, { recursive: true, force: true });
    fs.rmSync(legacy, { recursive: true, force: true });
  }
});

test('a six-lane legacy room accepts the additive declaration, and neither seam grows an eighth lane', () => {
  const dir = room({ lanes: SIX_LANES });
  try {
    assert.equal(validateManifest(dir).status, 'valid');
    assert.deepEqual(Object.keys(readManifestAt(dir).lanes), Object.keys(SIX_LANES));
    assert.equal(Object.hasOwn(LANES, 'landmark-tracker'), false);
    assert.equal(Object.hasOwn(COLLECTIONS, 'destination-questions'), false);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('malformed or unsafe Tracker declarations are refused by resolver and validator alike', () => {
  const cases = [
    { name: 'unknown key', mutate: (m) => { m.landmarkTracker.projection = 'workbench/elsewhere/TRACKER.json'; } },
    { name: 'unknown collection', mutate: (m) => { m.landmarkTracker.collections.features = 'workbench/landmark-tracker/features'; } },
    { name: 'missing collection', mutate: (m) => { delete m.landmarkTracker.collections.landmarks; } },
    { name: 'traversing root', mutate: (m) => { m.landmarkTracker.root = 'workbench/../outside'; } },
    { name: 'nested collection', mutate: (m) => { m.landmarkTracker.collections.landmarks = 'workbench/landmark-tracker/deep/landmarks'; } },
    { name: 'root inside a lane', mutate: (m) => { m.landmarkTracker = { root: 'workbench/sessions/tracker', collections: { 'destination-questions': 'workbench/sessions/tracker/destination-questions', landmarks: 'workbench/sessions/tracker/landmarks' } }; } },
    { name: 'not an object', mutate: (m) => { m.landmarkTracker = 'workbench/landmark-tracker'; } }
  ];
  for (const scenario of cases) {
    const dir = room();
    try {
      const manifest = readManifestAt(dir);
      scenario.mutate(manifest);
      writeManifest(dir, manifest);
      const validated = validateManifest(dir);
      assert.equal(validated.status, 'invalid', `${scenario.name}: ${JSON.stringify(validated)}`);
      assert.equal(validated.error.code, 'invalid-collection', scenario.name);
      if (scenario.name !== 'root inside a lane') assert.throws(() => paths.declaredTracker(dir), (error) => error.code === 'invalid-tracker', scenario.name);
    } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  }
  const missing = room();
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-tracker-outside-'));
  try {
    fs.rmSync(path.join(missing, DECLARATION.collections.landmarks), { recursive: true });
    assert.equal(validateManifest(missing).error.code, 'missing-collection');
    fs.symlinkSync(outside, path.join(missing, DECLARATION.collections.landmarks));
    assert.equal(validateManifest(missing).error.code, 'missing-collection', 'a linked collection is not an ordinary directory');
  } finally {
    fs.rmSync(missing, { recursive: true, force: true });
    fs.rmSync(outside, { recursive: true, force: true });
  }
});

test('an unanswered, ungrouped DQC persists with lineage and reloads unchanged in a fresh process', () => {
  const dir = room();
  try {
    const captured = capture(dir);
    assert.match(captured.id, /^DQC-[0-9A-Za-z]{3,}$/);
    assert.equal(captured.revision, 1);
    assert.equal(captured.record, `${DECLARATION.collections['destination-questions']}/${captured.id}.json`);
    const stored = JSON.parse(fs.readFileSync(path.join(dir, captured.record), 'utf8'));
    assert.equal(stored.id, captured.id);
    assert.equal(stored.answer, null, 'no final answer is required');
    assert.deepEqual(stored.landmarks, [], 'the landmark relation starts empty');
    assert.equal(stored.expectedResult, null);
    assert.equal(stored.result, null, 'Result (achieved delivery) is distinct from Expected result');
    assert.equal(stored.assessment, null);
    assert.deepEqual(stored.sources, [{ id: 'FX-1', revision: 'r1' }, { id: 'FX-2', revision: null }]);
    assert.deepEqual(stored.uncertainty, ['Whether restarts include clones']);
    assert.equal(stored.origin.title, 'How a fixture room keeps its lantern lit');
    assert.deepEqual(stored.origin.sources, stored.sources);

    const shown = ok(cli(dir, 'show', captured.id), 'shown');
    assert.deepEqual(shown.record, stored, 'a fresh process reads the persisted record, not a cache');
    const view = tracker(dir);
    const card = view.questions.find((item) => item.id === captured.id);
    assert.equal(card.title, 'How a fixture room keeps its lantern lit');
    assert.equal(card.answered, false);
    assert.equal(card.landmarkDisplay, 'No landmark');
    assert.deepEqual(card.assessment, { state: 'unassessed' }, 'an unassessed card is never inferred as Idea');
    assert.deepEqual(view.noLandmark.questions, [captured.id]);
    assert.equal(view.noLandmark.display, 'No landmark');
    assert.deepEqual(view.landmarks, []);
    assert.equal(fs.existsSync(path.join(dir, 'workbench', 'specs', 'S-001')), false, 'no Spec, Task or Wiki destination is created');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('retitling, confirming, adding Expected result and a correction keep origin, identity and history', () => {
  const dir = room();
  try {
    const { id } = capture(dir);
    const revised = ok(cli(dir, 'revise', id, '--expect-revision', '1', '--title', 'Keeping the fixture lantern lit',
      '--answer', 'The lantern stays lit when its fuel record survives restarts.',
      '--confirm', 'Fixture owner confirmed the scoped answer',
      '--expected-change', 'A readable explanation of lantern upkeep', '--expected-home', 'workbench/wiki/design-concepts',
      '--source', 'FX-3@r2', '--correction', 'Restarts include clones, not only process restarts',
      '--resolve-uncertainty', 'Whether restarts include clones',
      '--reason', 'Owner answered and corrected the restart scope'), 'revised');
    assert.equal(revised.id, id, 'retitling never reallocates the identity');
    assert.equal(revised.revision, 2);
    const shown = ok(cli(dir, 'show', id), 'shown').record;
    assert.equal(shown.title, 'Keeping the fixture lantern lit');
    assert.equal(shown.origin.title, 'How a fixture room keeps its lantern lit', 'origin is preserved');
    assert.equal(shown.origin.question, 'What must stay true for the fixture lantern to remain lit across restarts?');
    assert.deepEqual(shown.sources.map((source) => source.id), ['FX-1', 'FX-2', 'FX-3']);
    assert.deepEqual(shown.confirmation, { basis: 'Fixture owner confirmed the scoped answer', revision: 2 });
    assert.deepEqual(shown.expectedResult, { change: 'A readable explanation of lantern upkeep', home: 'workbench/wiki/design-concepts', revision: 2 });
    assert.equal(shown.result, null);
    assert.deepEqual(shown.uncertainty, []);
    assert.equal(shown.history.length, 2);
    assert.equal(shown.history[0].revision, 1);
    const latest = shown.history[1];
    assert.equal(latest.revision, 2);
    assert.equal(latest.reason, 'Owner answered and corrected the restart scope');
    assert.deepEqual(latest.changes.find((change) => change.field === 'title'), { field: 'title', from: 'How a fixture room keeps its lantern lit', to: 'Keeping the fixture lantern lit' });
    assert.ok(latest.changes.some((change) => change.field === 'correction' && change.to === 'Restarts include clones, not only process restarts'));
    const card = tracker(dir).questions.find((item) => item.id === id);
    assert.deepEqual(card.corrections, [{ revision: 2, text: 'Restarts include clones, not only process restarts', reason: 'Owner answered and corrected the restart scope' }]);
    assert.equal(card.answered, true);
    assert.equal(card.origin.title, 'How a fixture room keeps its lantern lit');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('a later landmark connects without changing the DQC identity, and several landmarks may overlap', () => {
  const dir = room();
  try {
    const { id } = capture(dir);
    const first = ok(cli(dir, 'add-landmark', '--title', 'Fixture lighting', '--summary', 'How fixture rooms keep light available', '--importance', 'Fixture pillar', '--reason', 'Emerged from the lantern card'), 'captured');
    assert.match(first.id, /^LMK-[0-9A-Za-z]{3,}$/);
    const linked = ok(cli(dir, 'link', id, '--landmark', first.id, '--expect-revision', '1', '--reason', 'The lantern card belongs to lighting'), 'linked');
    assert.equal(linked.id, id);
    assert.equal(linked.revision, 2);
    const second = ok(cli(dir, 'add-landmark', '--title', 'Fixture restarts', '--summary', 'What survives a fixture restart', '--reason', 'Second overlapping pillar'), 'captured');
    ok(cli(dir, 'link', id, '--landmark', second.id, '--expect-revision', '2', '--reason', 'Restart survival overlaps'), 'linked');
    ok(cli(dir, 'revise', first.id, '--expect-revision', '1', '--title', 'Fixture illumination', '--reason', 'Clearer landmark name'), 'revised');
    const view = tracker(dir);
    const card = view.questions.find((item) => item.id === id);
    assert.deepEqual(card.landmarks, [first.id, second.id]);
    assert.equal(card.landmarkDisplay, 'Fixture illumination; Fixture restarts');
    assert.deepEqual(view.noLandmark.questions, []);
    const lighting = view.landmarks.find((item) => item.id === first.id);
    assert.equal(lighting.title, 'Fixture illumination');
    assert.equal(lighting.origin.title, 'Fixture lighting');
    assert.deepEqual(lighting.questions, [id]);
    assert.deepEqual(view.landmarks.find((item) => item.id === second.id).questions, [id]);
    assert.equal(view.workbench.items, 1, 'a shared DQC counts once in the Workbench aggregate');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('TRACKER.json rebuilds deterministically from records with the exact 30/20/50 two-item distribution', () => {
  const dir = room();
  try {
    const empty = ok(cli(dir, 'rebuild'), 'rebuilt');
    assert.equal(empty.projection, `${DECLARATION.root}/TRACKER.json`);
    const nothing = tracker(dir);
    assert.deepEqual(nothing.steps, STEPS);
    assert.deepEqual(nothing.questions, []);
    assert.deepEqual(nothing.workbench, EMPTY_AGGREGATE, 'empty input shows no items, never completion');

    const mixed = capture(dir).id;
    const verified = ok(cli(dir, 'capture', '--title', 'Fixture door latch', '--question', 'How does the fixture door stay latched?', '--reason', 'Second fixture concept'), 'captured').id;
    const partial = tracker(dir);
    assert.equal(partial.workbench.status, 'incomplete', 'unassessed items make the aggregate explicitly incomplete');
    assert.deepEqual(partial.workbench.unassessed, [`dqc:${mixed}`, `dqc:${verified}`]);
    assert.equal(partial.workbench.distribution.Idea, 0, 'the renderer invents no progress');

    ok(cli(dir, 'revise', mixed, '--expect-revision', '1', '--assess', 'Journey=0.6,Review=0.4', '--basis', 'Draft article underway; one section already assessed', '--evidence', 'fixture-draft@r1', '--reason', 'First assessment'), 'revised');
    ok(cli(dir, 'revise', verified, '--expect-revision', '1', '--assess', 'Verified=1', '--basis', 'Durable contents checked against the expected claims', '--evidence', 'fixture-article@r3', '--reason', 'Verified against actual contents'), 'revised');
    const view = tracker(dir);
    assert.deepEqual(view.workbench.counted, [`dqc:${mixed}`, `dqc:${verified}`]);
    assert.equal(view.workbench.items, 2);
    assert.equal(view.workbench.status, 'complete');
    assert.deepEqual(view.workbench.distribution, { Idea: 0, Aligning: 0, Confirmed: 0, Mapped: 0, Planned: 0, Journey: 30, Review: 20, Verified: 50 });
    assert.deepEqual(Object.keys(view.workbench.distribution), STEPS, 'the exact ordered vocabulary');
    const card = view.questions.find((item) => item.id === mixed);
    assert.deepEqual(card.assessment, { state: 'assessed', contributions: { Journey: 0.6, Review: 0.4 }, basis: 'Draft article underway; one section already assessed', evidence: ['fixture-draft@r1'], revision: 2 });

    const file = path.join(dir, DECLARATION.root, 'TRACKER.json');
    const bytes = fs.readFileSync(file, 'utf8');
    ok(cli(dir, 'rebuild'), 'rebuilt');
    assert.equal(fs.readFileSync(file, 'utf8'), bytes, 'rebuild is deterministic');
    fs.writeFileSync(file, '{"questions": [{"id": "DQC-ZZZ", "title": "hand-edited"}]}\n');
    refused(cli(dir, 'rebuild', '--check'), 'projection-drift');
    ok(cli(dir, 'rebuild'), 'rebuilt');
    assert.equal(fs.readFileSync(file, 'utf8'), bytes, 'generated output never authors source');
    fs.rmSync(file);
    ok(cli(dir, 'rebuild'), 'rebuilt');
    assert.equal(fs.readFileSync(file, 'utf8'), bytes);
    ok(cli(dir, 'rebuild', '--check'), 'current');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('every invalid write is refused by name and leaves source and projection bytes unchanged', () => {
  const dir = room();
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-tracker-outside-'));
  try {
    const { id } = capture(dir);
    const landmark = ok(cli(dir, 'add-landmark', '--title', 'Fixture lighting', '--summary', 'Light', '--reason', 'fixture'), 'captured').id;
    const before = snapshot(dir);
    const attempts = [
      ['stale-revision', ['revise', id, '--expect-revision', '7', '--title', 'Late title', '--reason', 'stale']],
      ['identity-collision', ['capture', '--id', id, '--title', 'Duplicate', '--question', 'Duplicate?', '--reason', 'collide']],
      ['unknown-identity', ['link', id, '--landmark', 'LMK-ZZZ', '--expect-revision', '1', '--reason', 'unknown']],
      ['unknown-identity', ['revise', 'DQC-ZZZ', '--expect-revision', '1', '--title', 'Nothing', '--reason', 'unknown']],
      ['invalid-record', ['revise', id, '--expect-revision', '1', '--assess', 'Journey=0.6,Review=0.3', '--basis', 'b', '--evidence', 'e', '--reason', 'sum']],
      ['invalid-record', ['revise', id, '--expect-revision', '1', '--assess', 'done=1', '--basis', 'b', '--evidence', 'e', '--reason', 'done is not Verified']],
      ['invalid-record', ['revise', id, '--expect-revision', '1', '--assess', 'Verified=1', '--reason', 'no evidence']],
      ['invalid-record', ['revise', id, '--expect-revision', '1', '--title', '   ', '--reason', 'blank']],
      ['invalid-record', ['revise', id, '--expect-revision', '1', '--title', id, '--reason', 'an identifier is not a meaningful title']],
      ['invalid-record', ['capture', '--title', 'No question', '--reason', 'missing']],
      ['invalid-record', ['capture', '--id', 'LMK-00Z', '--title', 'Wrong prefix', '--question', 'Q?', '--reason', 'prefix']],
      ['invalid-record', ['revise', id, '--expect-revision', '1', '--reason', 'no change at all']],
      ['private-content', ['revise', id, '--expect-revision', '1', '--answer', 'api_key=abcdef123456', '--reason', 'leak']],
      ['invalid-invocation', ['revise', id, '--expect-revision', '1', '--titel', 'typo', '--reason', 'typo']],
      ['invalid-invocation', ['revise', id, '--title', 'No revision', '--reason', 'missing expect-revision']]
    ];
    for (const [code, args] of attempts) {
      refused(cli(dir, ...args), code);
      assert.deepEqual(snapshot(dir), before, `${code} ${args.join(' ')} must write nothing`);
    }
    assert.equal(fs.readdirSync(path.join(dir, DECLARATION.collections['destination-questions'])).filter((name) => name.startsWith('.write-')).length, 0, 'no temporary file is left behind');

    const record = path.join(dir, DECLARATION.collections['destination-questions'], `${id}.json`);
    const moved = path.join(outside, 'moved.json');
    fs.renameSync(record, moved);
    fs.symlinkSync(moved, record);
    const linked = snapshot(dir);
    refused(cli(dir, 'revise', id, '--expect-revision', '1', '--title', 'Through a link', '--reason', 'unsafe'), 'unsafe-path');
    assert.deepEqual(snapshot(dir), linked);
    fs.rmSync(record);
    fs.renameSync(moved, record);

    const landmarks = path.join(dir, DECLARATION.collections.landmarks);
    fs.cpSync(landmarks, path.join(outside, 'landmarks'), { recursive: true });
    fs.rmSync(landmarks, { recursive: true });
    fs.symlinkSync(path.join(outside, 'landmarks'), landmarks);
    const linkedDir = snapshot(dir);
    refused(cli(dir, 'add-landmark', '--title', 'Through a linked collection', '--summary', 's', '--reason', 'unsafe'), 'unsafe-path');
    assert.deepEqual(snapshot(dir), linkedDir);
    assert.deepEqual(fs.readdirSync(path.join(outside, 'landmarks')).sort(), [`${landmark}.json`]);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(outside, { recursive: true, force: true });
  }
});

test('an inventory that already holds two records for one identity refuses every write and the rebuild', () => {
  const dir = room();
  try {
    const { id, record } = capture(dir);
    // DQC-001 and DQC-1 are one visible identity under visibleIdKey.
    const alias = id.replace(/-0+/, '-');
    const copy = { ...JSON.parse(fs.readFileSync(path.join(dir, record), 'utf8')), id: alias };
    fs.writeFileSync(path.join(dir, DECLARATION.collections['destination-questions'], `${alias}.json`), `${JSON.stringify(copy, null, 2)}\n`);
    const before = snapshot(dir);
    refused(cli(dir, 'capture', '--title', 'Another fixture concept', '--question', 'Another?', '--reason', 'collide'), 'identity-collision');
    refused(cli(dir, 'rebuild'), 'identity-collision');
    assert.deepEqual(snapshot(dir), before);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('an undeclared room refuses every Tracker command without creating the root', () => {
  const dir = room({ tracker: false });
  try {
    refused(cli(dir, 'capture', '--title', 'Fixture concept', '--question', 'Q?', '--reason', 'r'), 'tracker-undeclared');
    refused(cli(dir, 'rebuild'), 'tracker-undeclared');
    assert.equal(fs.existsSync(path.join(dir, DECLARATION.root)), false);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('a clone rebuilds the same view from tracked records alone', () => {
  const dir = room();
  const clone = fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-tracker-clone-'));
  try {
    const { id } = capture(dir);
    const landmark = ok(cli(dir, 'add-landmark', '--title', 'Fixture lighting', '--summary', 'Light', '--reason', 'fixture'), 'captured').id;
    ok(cli(dir, 'link', id, '--landmark', landmark, '--expect-revision', '1', '--reason', 'belongs'), 'linked');
    const git = (cwd, ...args) => {
      const result = spawnSync('git', ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', ...args], { cwd, encoding: 'utf8' });
      assert.equal(result.status, 0, result.stderr);
      return result.stdout;
    };
    git(dir, 'init', '-q', '-b', 'main');
    git(dir, 'add', '-A');
    git(dir, 'commit', '-qm', 'fixture tracker');
    assert.match(git(dir, 'ls-files', DECLARATION.root), new RegExp(`${id}\\.json`), 'records are tracked, never ignored');
    const target = path.join(clone, 'room');
    git(clone, 'clone', '-q', dir, target);
    const original = fs.readFileSync(path.join(dir, DECLARATION.root, 'TRACKER.json'), 'utf8');
    fs.rmSync(path.join(target, DECLARATION.root, 'TRACKER.json'));
    ok(cli(target, 'rebuild'), 'rebuilt');
    assert.equal(fs.readFileSync(path.join(target, DECLARATION.root, 'TRACKER.json'), 'utf8'), original);
    assert.deepEqual(ok(cli(target, 'show', id), 'shown').record, ok(cli(dir, 'show', id), 'shown').record);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(clone, { recursive: true, force: true });
  }
});

test('the shipped Tracker root is declared, validated and rebuilt current in this repository', () => {
  assert.deepEqual(paths.declaredTracker(root), { root: DECLARATION.root, projection: `${DECLARATION.root}/TRACKER.json`, collections: DECLARATION.collections });
  assert.equal(validateManifest(root).status, 'valid');
  const check = spawnSync(process.execPath, [trackerTool, 'rebuild', '--check', '--path', root, '--json'], { encoding: 'utf8' });
  assert.equal(check.status, 0, check.stdout);
  assert.equal(JSON.parse(check.stdout).status, 'current');
  assert.ok(fs.existsSync(path.join(root, DECLARATION.root, 'README.md')), 'the procedure ships beside the records');
});

test('the one-command demo runs the whole path end to end and reproduces 30/20/50', () => {
  const demo = spawnSync(process.execPath, [path.join(root, 'tools', 'landmark-tracker-demo.mjs')], { encoding: 'utf8' });
  assert.equal(demo.status, 0, `${demo.stdout}${demo.stderr}`);
  assert.match(demo.stdout, /landmark: No landmark/);
  assert.match(demo.stdout, /origin: "How a fixture room keeps its lantern lit"/);
  assert.match(demo.stdout, /30\/20\/50 example: PASS/);
  // TK-01Y extensions of the same demo.
  assert.match(demo.stdout, /shared identity: spec:S-0AA counted once across DQC-\S+ and DQC-\S+/);
  assert.match(demo.stdout, /lineage expansion: .*DQC-\S+ stays one item/);
  assert.match(demo.stdout, /navigation cycle preserved/);
  assert.match(demo.stdout, /refused \(dependency-cycle\): .*DQC-\S+ -> DQC-\S+ -> DQC-\S+/);
  assert.match(demo.stdout, /\[incomplete\]/);
  assert.match(demo.stdout, /\[invalid\]/);
  assert.match(demo.stdout, /reconciliation: DQC-\S+#C1 affected at r\d+/);
  assert.match(demo.stdout, /distributions scoped: PASS/);
});

// ------------------------------------------------------------------ TK-01Y
// Documentation distributions across source types and scopes.

const ZERO_STEPS = Object.freeze(Object.fromEntries(STEPS.map((step) => [step, 0])));
const steps = (values) => ({ ...ZERO_STEPS, ...values });

// Fixture room records the Tracker resolves by typed identity: a Spec with a
// record-backed Task marked done, two legacy Specs whose table rows both use
// the numeric label TK-003, and an accepted ADR. None is a real owner record.
function seedRoomRecords(dir) {
  const specs = path.join(dir, 'workbench', 'specs');
  const write = (relative, content) => {
    fs.mkdirSync(path.dirname(path.join(specs, relative)), { recursive: true });
    fs.writeFileSync(path.join(specs, relative), content);
  };
  write('S-0AA-fixture-lantern/SPEC.md', '# S-0AA - Fixture lantern\n\n**Spec ID:** S-0AA\n**Status:** active\n');
  write('S-0AA-fixture-lantern/tasks/TK-0AB/TASK.md', '# TK-0AB - Fixture wick\n\n**Task ID:** TK-0AB\n**Spec ID:** S-0AA\n**Status:** done\n');
  write('S-00H-fixture-legacy/SPEC.md', '# S-00H - Fixture legacy\n\n| Task | Slice | Status |\n|---|---|---|\n| TK-003 | Legacy fixture slice | done |\n');
  write('S-00M-fixture-other/SPEC.md', '# S-00M - Fixture other\n\n| Task | Slice | Status |\n|---|---|---|\n| TK-003 | Another legacy fixture slice | done |\n');
  const adr = path.join(dir, 'workbench', 'docs', 'adr');
  fs.mkdirSync(adr, { recursive: true });
  fs.writeFileSync(path.join(adr, '0ACC-fixture-decision.md'), '---\nid: 0ACC\nstatus: accepted\n---\n# Fixture decision\n');
}

function dqc(dir, title, extra = []) {
  return ok(cli(dir, 'capture', '--title', title, '--question', `What does ${title.toLowerCase()} settle?`, '--reason', 'fixture concept', ...extra), 'captured').id;
}

function assess(dir, id, revision, contributions, basis = 'Fixture basis for the fractions', evidence = 'fixture-evidence@r1') {
  return ok(cli(dir, 'revise', id, '--expect-revision', String(revision), '--assess', contributions, '--basis', basis, '--evidence', evidence, '--reason', 'fixture assessment'), 'revised');
}

function relate(dir, id, revision, item, extra = []) {
  return ok(cli(dir, 'relate', id, '--item', item, '--expect-revision', String(revision), '--reason', `fixture relation to ${item}`, ...extra), 'related');
}

function revisionOf(dir, id) {
  return ok(cli(dir, 'show', id), 'shown').record.revision;
}

function card(view, id) {
  return view.questions.find((item) => item.id === id);
}

test('the pure distribution seam: exact order, one unit per distinct item, and explicit empty, incomplete and invalid outcomes', async () => {
  const { distribution } = await import('../workbench/tools/landmark-tracker.mjs');
  assert.deepEqual(distribution([]), EMPTY_AGGREGATE, 'empty input shows no items');

  const mixed = { key: 'dqc:DQC-001', type: 'dqc', id: 'DQC-001', assessment: { contributions: { Journey: 0.6, Review: 0.4 }, basis: 'mixed basis', evidence: ['draft@r1'], revision: 2 } };
  const verified = { key: 'spec:S-0AA', type: 'spec', id: 'S-0AA', assessment: { contributions: { Verified: 1 }, basis: 'checked', evidence: ['article@r3'], revision: 3 } };
  const example = distribution([mixed, verified]);
  assert.equal(example.status, 'complete');
  assert.equal(example.items, 2);
  assert.equal(example.denominator, 2);
  assert.deepEqual(example.counted, ['dqc:DQC-001', 'spec:S-0AA']);
  assert.deepEqual(Object.keys(example.distribution), STEPS, 'the exact ordered vocabulary');
  assert.deepEqual(example.distribution, steps({ Journey: 30, Review: 20, Verified: 50 }));
  assert.deepEqual(example.numerators, steps({ Journey: 0.6, Review: 0.4, Verified: 1 }));
  assert.deepEqual(example.contributions.map((entry) => [entry.key, entry.state, entry.basis, entry.revision]), [['dqc:DQC-001', 'assessed', 'mixed basis', 2], ['spec:S-0AA', 'assessed', 'checked', 3]]);
  assert.deepEqual(example.bySourceType.dqc.distribution, steps({ Journey: 60, Review: 40 }));
  assert.deepEqual(example.bySourceType.spec.distribution, steps({ Verified: 100 }));
  assert.deepEqual(Object.keys(example.bySourceType), ['dqc', 'spec']);

  const shared = distribution([mixed, verified, { ...verified }]);
  assert.equal(shared.items, 2, 'a shared identity counts once');
  assert.deepEqual(shared.distribution, example.distribution);

  const conflict = distribution([mixed, verified, { ...verified, assessment: { ...verified.assessment, contributions: { Review: 1 } } }]);
  assert.equal(conflict.status, 'invalid', 'two different assessments of one identity are never silently resolved');
  assert.equal(conflict.distribution, null);
  assert.deepEqual(conflict.invalid.map((entry) => [entry.key, entry.codes]), [['spec:S-0AA', ['conflicting-assessment']]]);
  assert.equal(conflict.items, 2);

  const incomplete = distribution([mixed, { key: 'adr:ADR-0ACC', type: 'adr', id: 'ADR-0ACC', assessment: null }, { key: 'spec:S-0ZZ', type: 'spec', id: 'S-0ZZ', state: 'unknown', assessment: null }]);
  assert.equal(incomplete.status, 'incomplete');
  assert.equal(incomplete.denominator, 3, 'missing assessments and unknown identities stay in the denominator');
  assert.deepEqual(incomplete.unassessed, ['adr:ADR-0ACC']);
  assert.deepEqual(incomplete.unknown, ['spec:S-0ZZ']);
  assert.deepEqual(incomplete.distribution, steps({ Journey: 20, Review: 13.333333 }));

  const invalid = [
    ['nonfinite', { Journey: Infinity }],
    ['nonfinite', { Journey: Number.NaN, Review: 1 }],
    ['negative', { Journey: -0.5, Review: 1.5 }],
    ['unknown-step', { done: 1 }],
    ['wrong-sum', { Journey: 0.5, Review: 0.4 }]
  ];
  for (const [code, contributions] of invalid) {
    const result = distribution([mixed, { key: 'task:TK-0AB', type: 'task', id: 'TK-0AB', assessment: { contributions, basis: 'b', evidence: ['e'], revision: 1 } }]);
    assert.equal(result.status, 'invalid', code);
    assert.equal(result.distribution, null, `${code} withholds the distribution`);
    assert.deepEqual(result.counted, ['dqc:DQC-001', 'task:TK-0AB'], `${code} never drops the bad record`);
    assert.ok(result.invalid[0].codes.includes(code), `${code}: ${JSON.stringify(result.invalid)}`);
  }
});

test('related grilling questions, Specs, ADRs, Tasks and DQCs persist with typed room-scoped identity through restart and rebuild', () => {
  const dir = room();
  try {
    seedRoomRecords(dir);
    const a = dqc(dir, 'Fixture lantern upkeep');
    const b = dqc(dir, 'Fixture fuel supply');
    const items = [
      'grilling-question:FX-Q1@r4',
      'spec:S-0AA@abc123',
      'adr:ADR-0ACC',
      'task:TK-0AB',
      'task:S-00H/TK-003',
      'task:S-00M/TK-003',
      `dqc:${b}`,
      'spec:S-0ZZ'
    ];
    let revision = 1;
    const resolutions = {};
    for (const item of items) {
      const result = relate(dir, a, revision, item);
      revision = result.revision;
      resolutions[result.item.display] = result.resolution;
    }
    assert.deepEqual(resolutions, {
      'grilling-question:FX-Q1': 'declared',
      'spec:S-0AA': 'room',
      'adr:ADR-0ACC': 'room',
      'task:TK-0AB': 'room',
      'task:S-00H/TK-003': 'room',
      'task:S-00M/TK-003': 'room',
      [`dqc:${b}`]: 'tracker',
      'spec:S-0ZZ': 'unknown'
    });
    const stored = JSON.parse(fs.readFileSync(path.join(dir, DECLARATION.collections['destination-questions'], `${a}.json`), 'utf8'));
    assert.equal(stored.schema, 'landmark-tracker/destination-question@2');
    assert.deepEqual(stored.related.map((entry) => `${entry.type}:${entry.id}`), items.map((item) => item.replace(/@.*$/, '')));
    assert.deepEqual(stored.related.find((entry) => entry.type === 'task' && entry.id === 'S-00H/TK-003').id, 'S-00H/TK-003', 'the legacy Spec-qualified label keeps its bytes');
    assert.equal(stored.related.find((entry) => entry.type === 'spec' && entry.id === 'S-0AA').revision, 'abc123');
    assert.equal(stored.history.at(-1).changes[0].field, 'related');

    // A fresh process reads the persisted relations; the projection keys them by type.
    const view = tracker(dir);
    const scope = card(view, a).distribution;
    assert.deepEqual(scope.counted, [`dqc:${a}`, `dqc:${b}`, 'grilling-question:FX-Q1', 'spec:S-0AA', 'spec:S-0ZZ', 'adr:ADR-0ACC', 'task:TK-0AB', 'task:S-00H/TK-003', 'task:S-00M/TK-003'].sort((x, y) => scope.counted.indexOf(x) - scope.counted.indexOf(y)));
    assert.equal(scope.items, 9, 'two numeric TK-003 labels under different Specs are distinct items; nothing is filtered');
    assert.equal(scope.status, 'incomplete');
    assert.deepEqual(scope.unknown, ['spec:S-0ZZ']);
    assert.deepEqual(Object.keys(scope.bySourceType).sort(), ['adr', 'dqc', 'grilling-question', 'spec', 'task']);
    assert.equal(scope.bySourceType.task.items, 3);
    assert.deepEqual(card(view, b).relatedBy, [a], 'the related DQC shows who relates it');

    // A bare numeric Task label is ambiguous across Specs and is refused; a
    // letter-bearing label already related through its Spec is the same item.
    const before = snapshot(dir);
    refused(cli(dir, 'relate', a, '--item', 'task:TK-003', '--expect-revision', String(revision), '--reason', 'ambiguous'), 'invalid-record');
    refused(cli(dir, 'relate', a, '--item', 'task:S-0AA/TK-0AB', '--expect-revision', String(revision), '--reason', 'same item'), 'invalid-record');
    refused(cli(dir, 'relate', a, '--item', 'wiki:Fixture', '--expect-revision', String(revision), '--reason', 'unknown type'), 'invalid-record');
    refused(cli(dir, 'relate', a, '--item', `dqc:${a}`, '--expect-revision', String(revision), '--reason', 'self'), 'invalid-record');
    assert.deepEqual(snapshot(dir), before);

    const file = path.join(dir, DECLARATION.root, 'TRACKER.json');
    const bytes = fs.readFileSync(file, 'utf8');
    fs.rmSync(file);
    ok(cli(dir, 'rebuild'), 'rebuilt');
    assert.equal(fs.readFileSync(file, 'utf8'), bytes, 'the rebuild from records is byte-identical');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('the 30/20/50 example holds at DQC, landmark and Workbench scope with inspectable numerator, denominator, evidence revision and rationale', () => {
  const dir = room();
  try {
    seedRoomRecords(dir);
    const a = dqc(dir, 'Fixture lantern upkeep');
    assess(dir, a, 1, 'Journey=0.6,Review=0.4', 'Draft article underway; one section assessed', 'fixture-draft@r1');
    relate(dir, a, 2, 'spec:S-0AA@r7', ['--assess', 'Verified=1', '--basis', 'Durable contents checked against expected claims', '--evidence', 'fixture-article@r3']);
    const landmark = ok(cli(dir, 'add-landmark', '--title', 'Fixture lighting', '--summary', 'Light', '--reason', 'fixture'), 'captured').id;
    ok(cli(dir, 'link', a, '--landmark', landmark, '--expect-revision', '3', '--reason', 'belongs'), 'linked');
    const view = tracker(dir);
    const scopes = {
      dqc: card(view, a).distribution,
      landmark: view.landmarks.find((item) => item.id === landmark).aggregate,
      workbench: view.workbench
    };
    for (const [name, aggregate] of Object.entries(scopes)) {
      assert.equal(aggregate.status, 'complete', name);
      assert.equal(aggregate.denominator, 2, name);
      assert.deepEqual(aggregate.numerators, steps({ Journey: 0.6, Review: 0.4, Verified: 1 }), name);
      assert.deepEqual(aggregate.distribution, steps({ Journey: 30, Review: 20, Verified: 50 }), name);
      const mixed = aggregate.contributions.find((entry) => entry.key === `dqc:${a}`);
      assert.deepEqual([mixed.state, mixed.contributions, mixed.basis, mixed.evidence, mixed.revision, mixed.holder], ['assessed', { Journey: 0.6, Review: 0.4 }, 'Draft article underway; one section assessed', ['fixture-draft@r1'], 2, a], name);
      const spec = aggregate.contributions.find((entry) => entry.key === 'spec:S-0AA');
      assert.deepEqual([spec.state, spec.contributions, spec.basis, spec.evidence, spec.revision, spec.holder, spec.itemRevision], ['assessed', { Verified: 1 }, 'Durable contents checked against expected claims', ['fixture-article@r3'], 3, a, 'r7'], name);
    }
    const shown = ok(cli(dir, 'show', a), 'shown');
    assert.deepEqual(shown.view.distribution.distribution, scopes.dqc.distribution, 'show exposes the same DQC-scope view');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('shared identity counts once per aggregate while every relationship stays navigable, and a mixed DQC stays one item', () => {
  const dir = room();
  try {
    seedRoomRecords(dir);
    const a = dqc(dir, 'Fixture lantern upkeep');
    assess(dir, a, 1, 'Journey=0.6,Review=0.4');
    relate(dir, a, 2, 'grilling-question:FX-Q1', ['--assess', 'Idea=1', '--basis', 'recorded need', '--evidence', 'fixture-note@r1']);
    relate(dir, a, 3, 'grilling-question:FX-Q2', ['--assess', 'Aligning=1', '--basis', 'open alignment', '--evidence', 'fixture-note@r2']);
    relate(dir, a, 4, 'spec:S-0AA', ['--assess', 'Planned=1', '--basis', 'bounded plan', '--evidence', 'fixture-plan@r1']);
    const b = dqc(dir, 'Fixture fuel supply');
    assess(dir, b, 1, 'Mapped=1');
    relate(dir, b, 2, 'spec:S-0AA', ['--assess', 'Planned=1', '--basis', 'bounded plan', '--evidence', 'fixture-plan@r1']);
    const parent = dqc(dir, 'Fixture household light');
    assess(dir, parent, 1, 'Verified=1');
    relate(dir, parent, 2, `dqc:${a}`);
    const landmark = ok(cli(dir, 'add-landmark', '--title', 'Fixture lighting', '--summary', 'Light', '--reason', 'fixture'), 'captured').id;
    ok(cli(dir, 'link', a, '--landmark', landmark, '--expect-revision', '5', '--reason', 'belongs'), 'linked');
    ok(cli(dir, 'link', b, '--landmark', landmark, '--expect-revision', '3', '--reason', 'belongs'), 'linked');

    const view = tracker(dir);
    const lighting = view.landmarks.find((item) => item.id === landmark).aggregate;
    assert.equal(lighting.items, 5, 'A, B, two questions and the shared Spec - the Spec once');
    assert.equal(lighting.counted.filter((key) => key === 'spec:S-0AA').length, 1);
    const index = view.items.find((item) => item.key === 'spec:S-0AA');
    assert.deepEqual(index.relatedBy, [a, b], 'the shared Spec stays visible beneath each related question');
    assert.deepEqual(index.holders.map((holder) => holder.dqc), [a, b]);
    assert.ok(card(view, a).related.some((entry) => entry.key === 'spec:S-0AA'));
    assert.ok(card(view, b).related.some((entry) => entry.key === 'spec:S-0AA'));

    // The parent counts the mixed DQC as one unit; A's own children are not flattened in.
    const scope = card(view, parent).distribution;
    assert.deepEqual(scope.counted, [`dqc:${a}`, `dqc:${parent}`]);
    assert.deepEqual(scope.distribution, steps({ Journey: 30, Review: 20, Verified: 50 }));
    const lineage = card(view, parent).lineage;
    assert.equal(lineage.key, `dqc:${parent}`);
    const child = lineage.related.find((node) => node.key === `dqc:${a}`);
    assert.deepEqual(child.related.map((node) => node.key), ['grilling-question:FX-Q1', 'grilling-question:FX-Q2', 'spec:S-0AA'], 'lineage expansion shows the children for navigation');
    assert.equal(view.workbench.items, 6, 'Workbench scope counts every distinct declared constituent once');

    // No supporting-reference exclusion and no effort weighting exist to pass.
    refused(cli(dir, 'relate', parent, '--item', 'spec:S-0AA', '--weight', '3', '--expect-revision', '3', '--reason', 'weighted'), 'invalid-invocation');
    refused(cli(dir, 'relate', parent, '--item', 'spec:S-0AA', '--supporting', '--expect-revision', '3', '--reason', 'excluded'), 'invalid-invocation');

    // A second, different assessment of the shared Spec is an explicit conflict, not a silent pick.
    const c = dqc(dir, 'Fixture wick trimming');
    relate(dir, c, 1, 'spec:S-0AA', ['--assess', 'Review=1', '--basis', 'a different reading', '--evidence', 'fixture-review@r2']);
    const conflicted = tracker(dir);
    assert.equal(conflicted.workbench.status, 'invalid');
    assert.equal(conflicted.workbench.distribution, null);
    assert.deepEqual(conflicted.workbench.invalid.map((entry) => entry.key), ['spec:S-0AA']);
    assert.ok(conflicted.workbench.counted.includes('spec:S-0AA'), 'the conflicting record is never dropped');
    assert.equal(conflicted.items.find((item) => item.key === 'spec:S-0AA').state, 'invalid');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('navigation cycles are preserved while arithmetic dependency cycles are refused naming the identity chain', () => {
  const dir = room();
  try {
    const a = dqc(dir, 'Fixture lantern upkeep');
    const b = dqc(dir, 'Fixture fuel supply');
    assess(dir, a, 1, 'Journey=1');
    assess(dir, b, 1, 'Review=1');
    relate(dir, a, 2, `dqc:${b}`);
    relate(dir, b, 2, `dqc:${a}`);
    const view = tracker(dir);
    assert.deepEqual(card(view, a).relatedBy, [b]);
    assert.deepEqual(card(view, b).relatedBy, [a]);
    const lineage = card(view, a).lineage;
    const down = lineage.related.find((node) => node.key === `dqc:${b}`);
    assert.deepEqual(down.related, [{ key: `dqc:${a}`, type: 'dqc', id: a, cycle: true }], 'the navigation cycle is shown, not expanded forever');
    assert.deepEqual(card(view, a).distribution.distribution, steps({ Journey: 50, Review: 50 }));

    // A derived assessment depends arithmetically on its related items.
    ok(cli(dir, 'revise', a, '--expect-revision', '3', '--assess', 'derived', '--basis', 'Derived from the related fixture concepts', '--reason', 'derive'), 'revised');
    const derived = tracker(dir);
    const own = derived.workbench.contributions.find((entry) => entry.key === `dqc:${a}`);
    assert.equal(own.state, 'derived');
    assert.deepEqual(own.contributions, { Review: 1 });
    assert.deepEqual(own.derivedFrom, [`dqc:${b}`]);

    const before = snapshot(dir);
    const refusal = refused(cli(dir, 'revise', b, '--expect-revision', '3', '--assess', 'derived', '--basis', 'Derived too', '--reason', 'close the loop'), 'dependency-cycle');
    assert.match(refusal.error.message, new RegExp(`${b} -> ${a} -> ${b}`));
    assert.deepEqual(refusal.error.chain, [b, a, b]);
    assert.deepEqual(snapshot(dir), before, 'the refused cycle writes nothing');

    // A cycle that arrives on disk (a hand edit or a merge) refuses the rebuild too.
    const file = path.join(dir, DECLARATION.collections['destination-questions'], `${b}.json`);
    const record = JSON.parse(fs.readFileSync(file, 'utf8'));
    record.assessment = { derived: 'related', basis: 'hand edit', revision: record.revision };
    fs.writeFileSync(file, `${JSON.stringify(record, null, 2)}\n`);
    const onDisk = snapshot(dir);
    refused(cli(dir, 'rebuild'), 'dependency-cycle');
    assert.deepEqual(snapshot(dir), onDisk, 'TRACKER.json keeps its prior bytes');

    // A derived card whose related item is unassessed is incomplete, never guessed.
    const dir2 = room();
    try {
      const c = dqc(dir2, 'Fixture wick trimming');
      relate(dir2, c, 1, 'grilling-question:FX-Q9');
      ok(cli(dir2, 'revise', c, '--expect-revision', '2', '--assess', 'derived', '--basis', 'Derived from the fixture question', '--reason', 'derive'), 'revised');
      const pending = tracker(dir2);
      const entry = pending.workbench.contributions.find((item) => item.key === `dqc:${c}`);
      assert.equal(entry.state, 'derived-incomplete');
      assert.equal(pending.workbench.status, 'incomplete');
      assert.deepEqual(pending.workbench.unassessed, [`dqc:${c}`, 'grilling-question:FX-Q9']);
    } finally { fs.rmSync(dir2, { recursive: true, force: true }); }
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('a done Task or an accepted ADR never yields Verified by itself', () => {
  const dir = room();
  try {
    seedRoomRecords(dir);
    const a = dqc(dir, 'Fixture lantern upkeep');
    relate(dir, a, 1, 'task:TK-0AB');
    relate(dir, a, 2, 'adr:ADR-0ACC');
    const view = tracker(dir);
    const scope = card(view, a).distribution;
    assert.equal(scope.status, 'incomplete');
    assert.equal(scope.distribution.Verified, 0);
    assert.deepEqual(scope.unassessed, [`dqc:${a}`, 'adr:ADR-0ACC', 'task:TK-0AB']);
    for (const status of ['done', 'accepted', 'complete']) {
      refused(cli(dir, 'relate', a, '--item', 'spec:S-0AA', '--assess', `${status}=1`, '--basis', 'status', '--evidence', 'TASK.md', '--expect-revision', '3', '--reason', 'status is not a step'), 'invalid-record');
    }
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('invalid distribution updates are refused by name and leave source and TRACKER.json bytes unchanged', () => {
  const dir = room();
  try {
    seedRoomRecords(dir);
    const a = dqc(dir, 'Fixture lantern upkeep');
    const b = dqc(dir, 'Fixture fuel supply');
    relate(dir, a, 1, 'spec:S-0AA', ['--assess', 'Planned=1', '--basis', 'plan', '--evidence', 'fixture-plan@r1']);
    ok(cli(dir, 'revise', a, '--expect-revision', '2', '--claim', 'C1=The lantern needs fuel', '--claim-evidence', 'C1=fixture-note@r1', '--reason', 'claim'), 'revised');
    const before = snapshot(dir);
    const attempts = [
      ['invalid-record', ['relate', a, '--item', 'adr:ADR-0ACC', '--assess', 'Journey=Infinity', '--basis', 'b', '--evidence', 'e', '--expect-revision', '3', '--reason', 'nonfinite']],
      ['invalid-record', ['relate', a, '--item', 'adr:ADR-0ACC', '--assess', 'Journey=-0.5,Review=1.5', '--basis', 'b', '--evidence', 'e', '--expect-revision', '3', '--reason', 'negative']],
      ['invalid-record', ['relate', a, '--item', 'adr:ADR-0ACC', '--assess', 'Shipped=1', '--basis', 'b', '--evidence', 'e', '--expect-revision', '3', '--reason', 'unknown step']],
      ['invalid-record', ['relate', a, '--item', 'adr:ADR-0ACC', '--assess', 'Journey=0.5,Review=0.4', '--basis', 'b', '--evidence', 'e', '--expect-revision', '3', '--reason', 'wrong sum']],
      ['invalid-record', ['relate', a, '--item', 'adr:ADR-0ACC', '--assess', 'Verified=1', '--expect-revision', '3', '--reason', 'no basis or evidence']],
      ['invalid-record', ['relate', a, '--item', `dqc:${b}`, '--assess', 'Verified=1', '--basis', 'b', '--evidence', 'e', '--expect-revision', '3', '--reason', 'a DQC carries its own assessment']],
      ['invalid-record', ['relate', a, '--item', 'spec:S-0AA', '--expect-revision', '3', '--reason', 'already related with nothing new']],
      ['stale-revision', ['relate', a, '--item', 'adr:ADR-0ACC', '--expect-revision', '1', '--reason', 'stale']],
      ['unknown-identity', ['relate', 'DQC-ZZZ', '--item', 'adr:ADR-0ACC', '--expect-revision', '1', '--reason', 'unknown holder']],
      ['invalid-record', ['revise', b, '--expect-revision', '1', '--assess', 'derived', '--basis', 'nothing to derive from', '--reason', 'empty derivation']],
      ['invalid-record', ['revise', a, '--expect-revision', '3', '--assess', 'derived', '--basis', 'b', '--evidence', 'e', '--reason', 'derived takes evidence from related items']],
      ['invalid-record', ['revise', a, '--expect-revision', '3', '--affects', 'C1=Nothing changed', '--reason', 'no changed understanding']],
      ['invalid-record', ['revise', a, '--expect-revision', '3', '--answer', 'Fuel', '--affects', 'C9=Unknown claim', '--reason', 'unknown claim']],
      ['invalid-record', ['revise', a, '--expect-revision', '3', '--answer', 'Fuel', '--affects', 'C1=Affected', '--claim-evidence', 'C1=same@r1', '--reason', 'affected and re-evidenced at once']],
      ['invalid-record', ['revise', a, '--expect-revision', '3', '--claim-evidence', 'C9=fixture@r1', '--reason', 'evidence for an unknown claim']]
    ];
    for (const [code, args] of attempts) {
      refused(cli(dir, ...args), code);
      assert.deepEqual(snapshot(dir), before, `${code} ${args.join(' ')} must write nothing`);
    }

    // A nonfinite fraction that reaches disk (JSON 1e999 parses as Infinity)
    // refuses the rebuild by name rather than dropping the record.
    const file = path.join(dir, DECLARATION.collections['destination-questions'], `${a}.json`);
    const text = fs.readFileSync(file, 'utf8').replace('"Planned": 1', '"Planned": 1e999');
    assert.match(text, /1e999/);
    fs.writeFileSync(file, text);
    const edited = snapshot(dir);
    const refusal = refused(cli(dir, 'rebuild'), 'invalid-record');
    assert.match(refusal.error.message, new RegExp(a));
    assert.deepEqual(snapshot(dir), edited);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('changed understanding records what changed, why and the revision, assesses specific affected claims and keeps original proof', () => {
  const dir = room();
  try {
    const a = dqc(dir, 'Fixture lantern upkeep');
    const b = dqc(dir, 'Fixture fuel supply');
    ok(cli(dir, 'revise', a, '--expect-revision', '1', '--answer', 'Oil keeps the lantern lit.',
      '--claim', 'C1=The lantern burns oil', '--claim', 'C2=The lantern has one wick',
      '--claim-evidence', 'C1=fixture-note@r1', '--claim-evidence', 'C2=fixture-sketch@r2',
      '--assess', 'Review=1', '--basis', 'Candidate article assessed', '--evidence', 'fixture-draft@r2', '--reason', 'first answer'), 'revised');
    ok(cli(dir, 'revise', b, '--expect-revision', '1', '--claim', 'K1=Fuel arrives weekly', '--claim-evidence', 'K1=fixture-log@r1', '--reason', 'claim'), 'revised');
    relate(dir, b, 2, `dqc:${a}`);
    const bBefore = card(tracker(dir), b);

    ok(cli(dir, 'revise', a, '--expect-revision', '2', '--answer', 'Wax keeps the lantern lit.',
      '--affects', 'C1=The claim names oil; the corrected answer names wax',
      '--reason', 'Owner corrected the fuel'), 'revised');
    const view = tracker(dir);
    const changed = card(view, a);
    const c1 = changed.claims.find((claim) => claim.key === 'C1');
    const c2 = changed.claims.find((claim) => claim.key === 'C2');
    assert.equal(c1.status, 'affected');
    assert.deepEqual(c1.affectedBy, [{ revision: 3, changed: ['answer'], reason: 'Owner corrected the fuel', assessment: 'The claim names oil; the corrected answer names wax' }]);
    assert.deepEqual(c1.evidence, [{ ref: 'fixture-note@r1', revision: 2 }], 'the original proof stays at its revision');
    assert.equal(c2.status, 'supported', 'an unaffected claim keeps its standing');
    assert.deepEqual(c2.evidence, [{ ref: 'fixture-sketch@r2', revision: 2 }]);
    assert.deepEqual(changed.reconciliation, ['C1']);
    assert.deepEqual(changed.assessment.contributions, { Review: 1 }, 'changed understanding does not reset the card');
    const answerChange = changed.history.at(-1).changes.find((change) => change.field === 'answer');
    assert.deepEqual(answerChange, { field: 'answer', from: 'Oil keeps the lantern lit.', to: 'Wax keeps the lantern lit.' });

    // The relating card is not made stale by the relation alone.
    const related = card(view, b);
    assert.deepEqual(related.claims, bBefore.claims);
    assert.deepEqual(related.reconciliation, []);
    assert.deepEqual(view.reconciliation, [{ dqc: a, claim: 'C1', revision: 3, reason: 'Owner corrected the fuel', assessment: 'The claim names oil; the corrected answer names wax' }]);

    // New evidence reconciles C1 and keeps the earlier proof interpretable.
    ok(cli(dir, 'revise', a, '--expect-revision', '3', '--claim', 'C1=The lantern burns wax', '--claim-evidence', 'C1=fixture-article@r5', '--reason', 'Claim restated against the corrected answer'), 'revised');
    const reconciled = card(tracker(dir), a).claims.find((claim) => claim.key === 'C1');
    assert.equal(reconciled.status, 'supported');
    assert.equal(reconciled.text, 'The lantern burns wax');
    assert.deepEqual(reconciled.evidence, [{ ref: 'fixture-note@r1', revision: 2 }, { ref: 'fixture-article@r5', revision: 4 }]);
    assert.equal(reconciled.affectedBy.length, 1, 'the affecting change stays in the account');
    assert.deepEqual(tracker(dir).reconciliation, []);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('a foundation (schema 1) record still loads and upgrades on its next write', () => {
  const dir = room();
  try {
    const at = '2026-09-26T00:00:00.000Z';
    const legacy = {
      schema: 'landmark-tracker/destination-question@1', id: 'DQC-001', revision: 1,
      title: 'Fixture legacy concept', question: 'What did the foundation capture?', answer: null,
      confirmation: null, expectedResult: null, result: null, uncertainty: [], sources: [], landmarks: [], assessment: null,
      origin: { title: 'Fixture legacy concept', question: 'What did the foundation capture?', sources: [], revision: 1, at },
      history: [{ revision: 1, at, reason: 'fixture', changes: [{ field: 'captured' }] }]
    };
    const file = path.join(dir, DECLARATION.collections['destination-questions'], 'DQC-001.json');
    fs.writeFileSync(file, `${JSON.stringify(legacy, null, 2)}\n`);
    ok(cli(dir, 'rebuild'), 'rebuilt');
    const view = card(tracker(dir), 'DQC-001');
    assert.deepEqual(view.related, []);
    assert.deepEqual(view.claims, []);
    relate(dir, 'DQC-001', 1, 'grilling-question:FX-Q1');
    const upgraded = JSON.parse(fs.readFileSync(file, 'utf8'));
    assert.equal(upgraded.schema, 'landmark-tracker/destination-question@2');
    assert.deepEqual(upgraded.origin, legacy.origin, 'the origin survives the upgrade');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

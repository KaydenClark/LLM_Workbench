#!/usr/bin/env node
// S-01T TK-01X: the Landmark Tracker foundation, exercised only at its public
// seams in disposable rooms - manifest discovery through workbench-paths.mjs
// and workbench-layout.mjs, and the landmark-tracker.mjs command line and
// exports. One ungrouped Destination Question Card (DQC) is captured, reloaded
// by a fresh process and a clone, evolved, connected to a landmark, and
// projected into a generated TRACKER.json that never authors source.
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
    assert.deepEqual(nothing.workbench, { items: 0, status: 'empty', counted: [], unassessed: [], distribution: null }, 'empty input shows no items, never completion');

    const mixed = capture(dir).id;
    const verified = ok(cli(dir, 'capture', '--title', 'Fixture door latch', '--question', 'How does the fixture door stay latched?', '--reason', 'Second fixture concept'), 'captured').id;
    const partial = tracker(dir);
    assert.equal(partial.workbench.status, 'incomplete', 'unassessed items make the aggregate explicitly incomplete');
    assert.deepEqual(partial.workbench.unassessed, [mixed, verified]);
    assert.equal(partial.workbench.distribution.Idea, 0, 'the renderer invents no progress');

    ok(cli(dir, 'revise', mixed, '--expect-revision', '1', '--assess', 'Journey=0.6,Review=0.4', '--basis', 'Draft article underway; one section already assessed', '--evidence', 'fixture-draft@r1', '--reason', 'First assessment'), 'revised');
    ok(cli(dir, 'revise', verified, '--expect-revision', '1', '--assess', 'Verified=1', '--basis', 'Durable contents checked against the expected claims', '--evidence', 'fixture-article@r3', '--reason', 'Verified against actual contents'), 'revised');
    const view = tracker(dir);
    assert.deepEqual(view.workbench.counted, [mixed, verified]);
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
});

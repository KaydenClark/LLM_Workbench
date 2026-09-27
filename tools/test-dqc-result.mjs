#!/usr/bin/env node
// S-002B TK-002S: public achieved Result writes and restart reads in disposable rooms.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { captureQuestion, reviseRecord, showTracker } from '../workbench/tools/landmark-tracker.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tool = path.join(root, 'workbench/tools/landmark-tracker.mjs');
const declaration = JSON.parse(fs.readFileSync(path.join(root, 'workbench/manifest.json'))).landmarkTracker;

function room(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dqc-result-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  for (const relative of Object.values(declaration.collections)) fs.mkdirSync(path.join(dir, relative), { recursive: true });
  fs.writeFileSync(path.join(dir, 'workbench/manifest.json'), JSON.stringify({ schemaVersion: 2, landmarkTracker: declaration }));
  return dir;
}

function cli(dir, args, json = true) {
  const run = spawnSync(process.execPath, [tool, ...args, '--path', dir, ...(json ? ['--json'] : [])], { encoding: 'utf8' });
  return { ...run, json: json && run.stdout ? JSON.parse(run.stdout) : null };
}

function ok(run) {
  assert.equal(run.status, 0, run.stdout + run.stderr);
  return run.json;
}

function captured(dir) {
  return captureQuestion(dir, { title: 'Fixture lantern continuity', question: 'What survives a lantern restart?', source: ['FX-1@r1'], uncertainty: ['Clone behavior'], reason: 'Fixture synthesis' });
}

function snapshot(dir) {
  const files = {};
  function walk(base) {
    for (const entry of fs.readdirSync(base, { withFileTypes: true })) {
      const full = path.join(base, entry.name);
      if (entry.isDirectory()) walk(full);
      else files[path.relative(dir, full)] = fs.readFileSync(full).toString('base64');
    }
  }
  walk(path.join(dir, declaration.root));
  return files;
}

test('public CLI records Result independently and reloads history, JSON and readable output after restart', (t) => {
  const dir = room(t);
  const { id } = captured(dir);
  ok(cli(dir, ['revise', id, '--expect-revision', '1', '--expected-change', 'Document restart behavior', '--expected-home', 'Fixture Wiki', '--confirm', 'Fixture scope only', '--assess', 'Review=1', '--basis', 'Fixture review', '--evidence', 'FX-proof@r1', '--reason', 'Record intended outcome']));
  const before = showTracker(dir, id).record;
  ok(cli(dir, ['revise', id, '--expect-revision', '2', '--result', 'Restart behavior documented and exercised', '--reason', 'Observed fixture delivery']));
  const shown = ok(cli(dir, ['show', id]));
  assert.deepEqual(shown.record.result, { summary: 'Restart behavior documented and exercised', revision: 3 });
  for (const field of ['id', 'origin', 'expectedResult', 'assessment', 'confirmation', 'sources', 'uncertainty', 'landmarks', 'claims', 'related']) assert.deepEqual(shown.record[field], before[field], field);
  assert.deepEqual(shown.record.history.slice(0, -1), before.history);
  assert.deepEqual(shown.record.history.at(-1).changes, [{ field: 'result', from: null, to: shown.record.result }]);
  assert.equal(shown.record.history.at(-1).reason, 'Observed fixture delivery');
  assert.deepEqual(shown.view.result, shown.record.result);
  assert.deepEqual(shown.view.assessment, showTracker(dir, id).view.assessment);
  const readable = cli(dir, ['show', id], false);
  assert.equal(readable.status, 0, readable.stderr);
  assert.match(readable.stdout, /expected result: Document restart behavior -> Fixture Wiki/);
  assert.match(readable.stdout, /result: Restart behavior documented and exercised \(revision 3\)/);
  ok(cli(dir, ['rebuild']));
  assert.deepEqual(ok(cli(dir, ['show'])).tracker.questions.find(card => card.id === id).result, shown.record.result);
  assert.match(cli(dir, ['show'], false).stdout, /result: Restart behavior documented and exercised/);
});

test('public API revises Result and Expected result separately without replacing prior achieved history', (t) => {
  const dir = room(t);
  const { id } = captured(dir);
  reviseRecord(dir, id, { 'expect-revision': 1, result: 'First delivery', reason: 'First observation' });
  const first = showTracker(dir, id).record;
  assert.deepEqual(first.result, { summary: 'First delivery', revision: 2 });
  assert.equal(first.expectedResult, null);
  assert.equal(first.assessment, null);
  assert.equal(first.confirmation, null);
  reviseRecord(dir, id, { 'expect-revision': 2, result: 'Corrected delivery', reason: 'Correction after restart' });
  const second = showTracker(dir, id).record;
  assert.deepEqual(second.history.slice(0, -1), first.history);
  assert.deepEqual(second.history.at(-1).changes, [{ field: 'result', from: first.result, to: second.result }]);
  reviseRecord(dir, id, { 'expect-revision': 3, 'expected-change': 'Future delivery', reason: 'Next intended outcome' });
  const third = ok(cli(dir, ['show', id])).record;
  assert.deepEqual(third.result, second.result);
  assert.deepEqual(third.origin, first.origin);
  assert.equal(third.assessment, null);
  assert.equal(third.confirmation, null);
});

test('invalid, private and stale public API Result writes preserve all record and projection bytes', (t) => {
  const dir = room(t);
  const { id } = captured(dir);
  reviseRecord(dir, id, { 'expect-revision': 1, result: 'Recorded delivery', reason: 'Fixture observation' });
  for (const [summary, code] of [['', 'invalid-record'], ['   ', 'invalid-record'], [null, 'invalid-record'], [42, 'invalid-record'], [{ summary: 'Nested' }, 'invalid-record'], ['api_key=abcdef123456', 'private-content']]) {
    const before = snapshot(dir);
    assert.throws(() => reviseRecord(dir, id, { 'expect-revision': 2, result: summary, reason: 'Invalid fixture' }), error => error.code === code);
    assert.deepEqual(snapshot(dir), before, code);
  }
  const before = snapshot(dir);
  assert.throws(() => reviseRecord(dir, id, { 'expect-revision': 1, result: 'Stale delivery', reason: 'Old read' }), error => error.code === 'stale-revision');
  assert.deepEqual(snapshot(dir), before);
});

test('CLI invalid, private, stale and landmark Result writes refuse by name without writing bytes', (t) => {
  const dir = room(t);
  const { id } = captured(dir);
  const landmark = ok(cli(dir, ['add-landmark', '--title', 'Fixture pillar', '--summary', 'Fixture scope', '--importance', 'Fixture reason', '--reason', 'Fixture emergence']));
  const cases = [
    [id, '1', '', 'invalid-record'],
    [id, '1', '   ', 'invalid-record'],
    [id, '1', 'api_key=abcdef123456', 'private-content'],
    [id, '2', 'Future read', 'stale-revision'],
    [landmark.id, '1', 'Not a DQC', 'invalid-invocation']
  ];
  for (const [target, revision, summary, code] of cases) {
    const before = snapshot(dir);
    const run = cli(dir, ['revise', target, '--expect-revision', revision, '--result', summary, '--reason', 'Refusal fixture']);
    assert.equal(run.status, 1, run.stdout);
    assert.equal(run.json.error.code, code, run.stdout);
    assert.deepEqual(snapshot(dir), before, code);
  }
});

test('legacy schema Result revision upgrades in place and preserves origin and earlier history', (t) => {
  const dir = room(t);
  const capture = captured(dir);
  const full = path.join(dir, capture.record);
  const legacy = showTracker(dir, capture.id).record;
  legacy.schema = 'landmark-tracker/destination-question@1';
  delete legacy.related;
  delete legacy.claims;
  fs.writeFileSync(full, JSON.stringify(legacy));
  const before = ok(cli(dir, ['show', capture.id])).record;
  reviseRecord(dir, capture.id, { 'expect-revision': 1, result: 'Legacy fixture delivery', reason: 'Recorded after upgrade' });
  const after = ok(cli(dir, ['show', capture.id])).record;
  assert.equal(after.schema, 'landmark-tracker/destination-question@2');
  assert.deepEqual(after.result, { summary: 'Legacy fixture delivery', revision: 2 });
  assert.deepEqual(after.origin, before.origin);
  assert.deepEqual(after.history.slice(0, -1), before.history);
  assert.ok(after.history.at(-1).changes.some(change => change.field === 'schema'));
});

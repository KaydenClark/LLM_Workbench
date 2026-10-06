#!/usr/bin/env node
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const tool = path.join(repoRoot, 'workbench', 'tools', 'project-evidence.mjs');

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-project-evidence-'));
  fs.mkdirSync(path.join(root, 'workbench', 'sessions', 'notepads', 'templates'), { recursive: true });
  fs.writeFileSync(path.join(root, 'workbench', 'manifest.json'), `${JSON.stringify({
    schemaVersion: 2,
    lanes: { sessions: 'workbench/sessions' },
    collections: {
      grilling: 'workbench/sessions/grilling',
      handoffs: 'workbench/sessions/handoffs',
      notepads: 'workbench/sessions/notepads',
      'notepad-templates': 'workbench/sessions/notepads/templates',
      recovery: 'workbench/sessions/recovery'
    }
  }, null, 2)}\n`);
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  fs.writeFileSync(path.join(root, 'docs', 'product.md'), '# Product\nA local planning tool.\n');
  return root;
}

function request(overrides = {}) {
  return {
    schema_version: 'project-evidence-request-1',
    project: { name: 'Compass' },
    objective: {
      key: 'define-compass',
      title: 'Compass Blueprint decisions',
      focus: 'Decide the project destination from observed evidence.'
    },
    evidence: [{
      id: 'E1',
      source: 'docs/product.md',
      line_start: 1,
      line_end: 2,
      kind: 'fact',
      statement: 'The project describes itself as a local planning tool.'
    }],
    questions: [{
      id: 'Q1',
      question: 'Who is the primary user?',
      recommendation: 'Start with a single project owner.',
      evidence: ['E1']
    }],
    ...overrides
  };
}

function writeRequest(root, value, name = 'request.json') {
  const input = path.join(root, name);
  fs.writeFileSync(input, `${JSON.stringify(value, null, 2)}\n`);
  return input;
}

function run(root, value, note = 'compass-blueprint') {
  const input = writeRequest(root, value);
  const result = spawnSync(process.execPath, [tool, 'prepare', '--project-root', root, '--input', input, '--note', note], { encoding: 'utf8' });
  return { result, report: JSON.parse(result.stdout) };
}

function notePath(root, name = 'compass-blueprint') {
  return path.join(root, 'workbench', 'sessions', 'notepads', 'grilling', `${name}.json`);
}

{
  const root = fixture();
  const { result, report } = run(root, request());
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.deepEqual(report, {
    status: 'prepared',
    note: 'workbench/sessions/notepads/grilling/compass-blueprint.json',
    id: 'compass-blueprint',
    revision: 1,
    evidence: 1,
    questions: 1
  });
  const note = JSON.parse(fs.readFileSync(notePath(root), 'utf8'));
  assert.equal(note.type, 'grilling');
  assert.equal(note.status, 'PROVISIONAL');
  assert.equal(note.entries.length, 0, 'preparation does not invent findings or decisions');
  assert.deepEqual(note.current.questions, [{
    id: 'Q1',
    status: 'open',
    question: 'Who is the primary user?',
    recommendation: 'Start with a single project owner.',
    evidence: ['E1']
  }]);
  assert.deepEqual(note.current.evidence.items[0], {
    id: 'E1',
    kind: 'fact',
    statement: 'The project describes itself as a local planning tool.',
    source: {
      file: 'docs/product.md',
      sha256: crypto.createHash('sha256').update(fs.readFileSync(path.join(root, 'docs', 'product.md'))).digest('hex'),
      line_start: 1,
      line_end: 2
    }
  });
  assert.match(note.current.evidence.semantic_boundary, /caller assertions.*only source identity and bytes/i);
  assert.doesNotMatch(JSON.stringify(note), new RegExp(root.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), 'the note carries no absolute host path');
}

for (const [label, mutate] of [
  ['path traversal', (root, value) => { value.evidence[0].source = '../outside.md'; }],
  ['forged locked status', (root, value) => { value.questions[0].status = 'locked'; }],
  ['forged answer', (root, value) => { value.questions[0].answer = 'Owner never said this'; }],
  ['unknown evidence reference', (root, value) => { value.questions[0].evidence = ['E9']; }],
  ['secret-like request content', (root, value) => { value.evidence[0].statement = 'token=abcdefghijklmnop'; }],
  ['secret-like source bytes', (root) => { fs.writeFileSync(path.join(root, 'docs', 'product.md'), 'api_key=abcdefghijklmnop\n'); }],
  ['invalid line range', (root, value) => { value.evidence[0].line_end = 99; }],
  ['partial-write attempt', (root, value) => {
    value.evidence.push({ id: 'E2', source: 'docs/missing.md', kind: 'uncertainty', statement: 'This source is absent.' });
  }]
]) {
  const root = fixture();
  const value = request();
  mutate(root, value);
  const { result, report } = run(root, value);
  assert.equal(result.status, 1, `${label}: ${result.stdout}${result.stderr}`);
  assert.equal(report.status, 'blocked', label);
  assert.equal(fs.existsSync(notePath(root)), false, `${label}: validation must finish before the atomic note write`);
}

{
  const root = fixture();
  fs.symlinkSync(path.join(root, 'docs', 'product.md'), path.join(root, 'docs', 'linked.md'));
  const value = request();
  value.evidence[0].source = 'docs/linked.md';
  const { result, report } = run(root, value);
  assert.equal(result.status, 1, result.stdout);
  assert.equal(report.error.code, 'unsafe-source');
  assert.equal(fs.existsSync(notePath(root)), false);
}

{
  const root = fixture();
  fs.linkSync(path.join(root, 'docs', 'product.md'), path.join(root, 'docs', 'shared.md'));
  const value = request();
  value.evidence[0].source = 'docs/shared.md';
  const { result, report } = run(root, value);
  assert.equal(result.status, 1, result.stdout);
  assert.equal(report.error.code, 'unsafe-source');
  assert.equal(fs.existsSync(notePath(root)), false);
}

{
  const root = fixture();
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-project-evidence-input-'));
  fs.writeFileSync(path.join(outside, 'request.json'), `${JSON.stringify(request())}\n`);
  fs.symlinkSync(outside, path.join(root, 'linked-input'));
  const result = spawnSync(process.execPath, [tool, 'prepare', '--project-root', root, '--input', path.join(root, 'linked-input', 'request.json'), '--note', 'compass-blueprint'], { encoding: 'utf8' });
  const report = JSON.parse(result.stdout);
  assert.equal(result.status, 1, result.stdout);
  assert.equal(report.error.code, 'unsafe-request');
  assert.equal(fs.existsSync(notePath(root)), false);
}

{
  const raw = 'password=do-not-echo';
  const result = spawnSync(process.execPath, [tool, 'prepare', '--project-root', fixture(), raw], { encoding: 'utf8' });
  assert.equal(result.status, 1, result.stdout);
  assert.doesNotMatch(result.stdout, /do-not-echo/, 'invalid CLI output must not reflect an unknown argument');
}

{
  const root = fixture();
  const input = writeRequest(root, request());
  const imported = execFileSync(process.execPath, ['--input-type=module', '--eval', `import ${JSON.stringify(new URL(`file://${tool}`).href)}`], { encoding: 'utf8' });
  assert.equal(imported, '', 'importing the public seam does not run its CLI');
  assert.equal(fs.existsSync(notePath(root)), false);
  assert.equal(fs.existsSync(input), true);
}

console.log('ok - project evidence preparation self-test passed');

#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tool = path.join(root, 'tools', 'workbench-layout.mjs');
const controls = ['AGENTS.md', 'BLUEPRINT.md', 'LEXICON.md', 'RUNBOOK.md', 'TASKBOARD.md', 'CLAUDE.md', 'README.md'];

function fixture() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-layout-'));
}

function run(...args) {
  const result = spawnSync(process.execPath, [tool, ...args], { cwd: root, encoding: 'utf8' });
  return { ...result, report: result.stdout ? JSON.parse(result.stdout) : null };
}

function completeGenesis(project) {
  for (const control of controls) fs.writeFileSync(path.join(project, control), `${control}\n`);
  const firstSpec = path.join(project, 'workbench', 'specs', 'S-001-first');
  fs.mkdirSync(firstSpec);
  fs.writeFileSync(path.join(firstSpec, 'SPEC.md'), '# S-001\n');
}

test('a fresh Genesis fixture has the seven controls, manifest lanes, first spec, and no local skill shadow', () => {
  const project = fixture();
  try {
    const initialized = run('init', '--project', project, '--provenance', 'genesis', '--version', 'v3.0.0');
    assert.equal(initialized.status, 0, initialized.stderr);
    completeGenesis(project);

    const validated = run('validate', '--project', project, '--genesis');

    assert.equal(validated.status, 0, validated.stderr);
    assert.equal(validated.report.status, 'valid');
    assert.deepEqual(validated.report.controls, controls);
    assert.equal(fs.existsSync(path.join(project, 'skills')), false);
    for (const lane of ['specs', 'wiki', 'grilling', 'handoffs', 'feedback']) {
      assert.equal(fs.existsSync(path.join(project, 'workbench', lane)), true);
    }
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
  }
});

test('the validator rejects a traversing manifest lane', () => {
  const project = fixture();
  try {
    assert.equal(run('init', '--project', project, '--provenance', 'genesis', '--version', 'v3.0.0').status, 0);
    const manifestPath = path.join(project, 'workbench', 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    manifest.lanes.specs = '../specs';
    fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

    const validated = run('validate', '--project', project);

    assert.notEqual(validated.status, 0);
    assert.equal(validated.report.error.code, 'invalid-lane');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
  }
});

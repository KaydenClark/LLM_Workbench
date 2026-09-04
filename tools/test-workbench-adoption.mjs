#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { doctor, nextWork } from './spec-workbench.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tool = path.join(root, 'tools', 'workbench-adoption.mjs');
const coreSkills = [
  'adoption', 'checkpoint', 'code-review', 'genesis', 'grilling', 'implement',
  'make-it-so', 'to-docs', 'to-spec', 'to-tickets', 'tracer-bullet', 'update-harness'
];

function fixture() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-adoption-'));
}

function run(...args) {
  return spawnSync(process.execPath, [tool, ...args], { encoding: 'utf8' });
}

function write(project, relative, content) {
  const target = path.join(project, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function read(project, relative) {
  return fs.readFileSync(path.join(project, relative), 'utf8');
}

function seedControls(project) {
  for (const control of ['AGENTS.md', 'BLUEPRINT.md', 'LEXICON.md', 'RUNBOOK.md', 'TASKBOARD.md', 'CLAUDE.md', 'README.md']) {
    write(project, control, `# ${control}\n\nProject-specific adoption truth.\n`);
  }
  write(project, 'BLUEPRINT.md', '# Blueprint\n\n<!-- spec-catalog:start -->\n<!-- spec-catalog:end -->\n');
  write(project, 'TASKBOARD.md', '# Taskboard\n\n<!-- hot-specs:start -->\n<!-- hot-specs:end -->\n');
}

function seedUserSkills(home) {
  for (const skill of coreSkills) write(home, `.agents/skills/${skill}/SKILL.md`, `# ${skill}\n`);
}

function fixtureSpec() {
  return [
    '# S-101 - Adopted Capability',
    '',
    '**Spec ID:** S-101',
    '**Status:** active',
    '**Priority:** 0',
    '**Owner:** owner',
    '**Updated:** 2026-09-01',
    '**Catalog description:** Preserves the adopted project truth.',
    '**Blockers:** none',
    '**Latest event:** Adoption pending.',
    '**Next gate:** Complete TK-001.',
    '',
    '## Vertical Implementation Slices',
    '',
    '| Ticket | Slice | Status | Blockers | Proof |',
    '|---|---|---|---|---|',
    '| TK-001 | Preserve project truth | ready | none | pending |',
    '',
    '## Acceptance Criteria',
    '',
    '- [ ] Project truth is preserved.',
    '',
    '## Append-Only Evidence And Execution Log',
    '',
    '| Date | Ticket | Event | Verification | Docs | Remaining gap |',
    '|---|---|---|---|---|---|',
    '',
    '## Completion Result',
    '',
    'Pending.',
    '',
    '## Supersession',
    '',
    '- Supersedes: none',
    '- Superseded by: none',
    ''
  ].join('\n');
}

{
  const project = fixture();
  const home = fixture();
  try {
    seedControls(project);
    seedUserSkills(home);
    write(project, 'specs/S-101-adopted/SPEC.md', fixtureSpec());
    write(project, 'MEMORY.md', '# Adopted Wiki\n');
    write(project, 'feedback/WORKBENCH_FEEDBACK.md', '# Feedback\n');
    write(project, 'grilling diary/decision.md', '# Provisional decision\n');
    write(project, 'handoffs/recovery.md', '# Recovery point\n');
    write(project, 'skills/custom/SKILL.md', '# Legacy project-local skill\n');

    const result = run('migrate', '--project', project, '--home', home, '--version', 'v3.0.0');
    assert.equal(result.status, 0, result.stderr);
    const report = JSON.parse(result.stdout);
    assert.equal(report.status, 'complete');
    assert.equal(fs.existsSync(path.join(project, 'specs')), false, 'legacy specs must retire after migration');
    assert.equal(fs.existsSync(path.join(project, 'MEMORY.md')), false, 'legacy root Wiki memory must retire after migration');
    assert.equal(fs.existsSync(path.join(project, 'feedback')), false, 'legacy feedback must retire after migration');
    assert.equal(fs.existsSync(path.join(project, 'grilling diary')), false, 'legacy provisional records must retire after migration');
    assert.equal(fs.existsSync(path.join(project, 'handoffs')), false, 'legacy recovery records must retire after migration');
    assert.equal(fs.existsSync(path.join(project, 'skills')), false, 'legacy project-local skills must retire after user-scoped readiness');
    assert.equal(read(project, 'workbench/specs/S-101-adopted/SPEC.md'), fixtureSpec());
    assert.equal(read(project, 'workbench/wiki/MEMORY.md'), '# Adopted Wiki\n');
    assert.equal(read(project, 'workbench/feedback/WORKBENCH_FEEDBACK.md'), '# Feedback\n');
    assert.equal(read(project, 'workbench/sessions/grilling/decision.md'), '# Provisional decision\n');
    assert.equal(read(project, 'workbench/sessions/checkpoints/recovery.md'), '# Recovery point\n');
    assert.equal(read(project, 'workbench/sessions/checkpoints/adoption-legacy-skills/custom/SKILL.md'), '# Legacy project-local skill\n');
    assert.equal(report.recoveryPath, 'workbench/sessions/checkpoints/adoption-recovery.json');
    assert.equal(JSON.parse(read(project, 'workbench/manifest.json')).schemaVersion, 2, 'adoption must produce schema 2');
    assert.equal(read(project, 'AGENTS.md'), '# AGENTS.md\n\nProject-specific adoption truth.\n');
    assert.equal(nextWork(project).specId, 'S-101', 'selection must resolve the manifest-declared spec lane');
    assert.deepEqual(doctor(project), [], 'doctor must resolve and validate the manifest-declared spec lane');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
    fs.rmSync(home, { recursive: true, force: true });
  }
}

{
  const project = fixture();
  const home = fixture();
  try {
    seedControls(project);
    seedUserSkills(home);
    write(project, 'specs/S-101-adopted/SPEC.md', fixtureSpec());
    write(project, 'workbench/specs/existing.md', 'Do not overwrite me.\n');
    const result = run('migrate', '--project', project, '--home', home, '--version', 'v3.0.0');
    assert.notEqual(result.status, 0, 'an existing support root must stop adoption before mutation');
    const report = JSON.parse(result.stdout);
    assert.equal(report.status, 'blocked');
    assert.equal(report.error.code, 'support-root-exists');
    assert.equal(read(project, 'specs/S-101-adopted/SPEC.md'), fixtureSpec(), 'a blocked collision must preserve legacy records');
    assert.equal(read(project, 'workbench/specs/existing.md'), 'Do not overwrite me.\n');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
    fs.rmSync(home, { recursive: true, force: true });
  }
}

console.log('ok - mixed v2 adoption preserves durable truth and blocks collisions');

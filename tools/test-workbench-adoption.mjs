#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { doctor, nextWork } from '../workbench/tools/spec-workbench.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const VERSION = JSON.parse(fs.readFileSync(path.join(root, 'workbench', 'manifest.json'), 'utf8')).workbenchVersion;
const tool = path.join(root, 'tools', 'workbench-adoption.mjs');
const coreSkills = [
  'adoption', 'checkpoint', 'code-review', 'genesis', 'grilling', 'implement',
  'make-it-so', 'to-docs', 'to-spec', 'to-tickets', 'tracer-bullet', 'update-harness', 'builder', 'auditor', 'reviewer', 'reconciler'
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
    'Related schema: [schema.sql](../../schema.sql).',
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
    write(project, 'MEMORY.md', '# Adopted Wiki\n\n[Runbook](RUNBOOK.md)\n');
    write(project, 'feedback/WORKBENCH_FEEDBACK.md', '# Feedback\n');
    write(project, 'grilling diary/decision.md', '# Provisional decision\n');
    write(project, 'handoffs/recovery.md', '# Recovery point\n');
    write(project, 'skills/custom/SKILL.md', '# Legacy project-local skill\n');
    write(project, 'tools/app.mjs', 'export const app = true;\n');
    write(project, 'tools/spec-workbench.mjs', 'export const duplicate = true;\n');
    write(project, 'schema.sql', '-- project schema\n');

    const result = run('migrate', '--project', project, '--home', home, '--version', VERSION);
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
    assert.match(read(project, 'workbench/wiki/MEMORY.md'), /^---\n[\s\S]+\n---\n\n# Adopted Wiki\n\n\[Runbook\]\(RUNBOOK\.md\)\n$/,
      'a moved room brain must receive the required Wiki metadata without losing its body');
    assert.equal(read(project, 'workbench/feedback/WORKBENCH_FEEDBACK.md'), '# Feedback\n');
    assert.equal(read(project, 'workbench/sessions/grilling/decision.md'), '# Provisional decision\n');
    assert.equal(read(project, 'workbench/sessions/checkpoints/recovery.md'), '# Recovery point\n');
    assert.equal(read(project, 'workbench/sessions/checkpoints/adoption-legacy-skills/custom/SKILL.md'), '# Legacy project-local skill\n');
    assert.equal(report.recoveryPath, 'workbench/sessions/checkpoints/adoption-recovery.json');
    assert.equal(JSON.parse(read(project, 'workbench/manifest.json')).schemaVersion, 2, 'adoption must produce schema 2');
    assert.equal(read(project, 'AGENTS.md'), '# AGENTS.md\n\nProject-specific adoption truth.\n');
    assert.equal(read(project, 'tools/app.mjs'), 'export const app = true;\n', 'an application root tools directory is never absorbed');
    assert.equal(fs.existsSync(path.join(project, 'tools', '.workbench-tools.json')), false, 'no receipt is written into an application root tools directory');
    const receipt = JSON.parse(read(project, 'workbench/tools/.workbench-tools.json'));
    assert.equal(receipt.source.release, VERSION, 'adoption installs receipt-backed runtime tools');
    const manifest = JSON.parse(read(project, 'workbench/manifest.json'));
    assert.notEqual(manifest.provenance.source.commit, 'unrecorded');
    assert.equal(manifest.provenance.source.commit, receipt.source.commit,
      'manifest and managed-tools receipt must record one source commit');
    assert.deepEqual(report.residue.rootManagedTools, ['spec-workbench.mjs'],
      'matching application-root tool names are reported without moving or deleting them');
    assert.deepEqual(report.residue.movedExternalLinks, [
      {
        file: 'workbench/specs/S-101-adopted/SPEC.md',
        link: '../../schema.sql',
        target: 'schema.sql'
      },
      {
        file: 'workbench/wiki/MEMORY.md',
        link: 'RUNBOOK.md',
        target: 'RUNBOOK.md'
      }
    ], 'links that escaped a moved lane or moved room brain are reported for explicit reconciliation');
    assert.equal(nextWork(project).specId, 'S-101', 'selection must resolve the manifest-declared spec lane');
    assert.deepEqual(doctor(project).filter((issue) => issue.blocks !== 'none'), [], 'doctor must resolve and validate the manifest-declared spec lane');
    assert.equal(report.doctor, 'passed-with-findings', 'the intentionally unrepaired moved link remains visible and nonblocking');
    assert.equal(report.findings.some((issue) => issue.code === 'invalid-note' && /MEMORY\.md/.test(issue.message)), false);
    assert.ok(report.findings.some((issue) => issue.code === 'broken-link' && /S-101/.test(issue.message)));
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
    const result = run('migrate', '--project', project, '--home', home, '--version', VERSION);
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

{
  const project = fixture();
  const home = fixture();
  try {
    seedControls(project);
    seedUserSkills(home);
    write(project, 'specs/S-101-adopted/SPEC.md', fixtureSpec());
    write(project, 'WORKBENCH_FEEDBACK.md', '# Root feedback\n');
    write(project, 'HARNESS_FEEDBACK.md', '# Legacy feedback\n');
    const result = run('migrate', '--project', project, '--home', home, '--version', VERSION);
    assert.notEqual(result.status, 0, 'two root feedback files must block before mutation');
    const report = JSON.parse(result.stdout);
    assert.equal(report.error.code, 'feedback-collision');
    assert.equal(fs.existsSync(path.join(project, 'workbench')), false);
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
    write(project, 'HARNESS_FEEDBACK.md', '# Legacy feedback\n');
    const result = run('migrate', '--project', project, '--home', home, '--version', VERSION);
    assert.equal(result.status, 0, result.stdout);
    assert.equal(read(project, 'workbench/feedback/WORKBENCH_FEEDBACK.md'), '# Legacy feedback\n', 'a legacy-named root feedback file is renamed into the lane');
    assert.equal(fs.existsSync(path.join(project, 'HARNESS_FEEDBACK.md')), false);
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
    write(project, 'WORKBENCH_FEEDBACK.md', '# Root feedback\n');
    const result = run('migrate', '--project', project, '--home', home, '--version', VERSION);
    assert.equal(result.status, 0, result.stdout);
    const report = JSON.parse(result.stdout);
    assert.equal(fs.existsSync(path.join(project, 'WORKBENCH_FEEDBACK.md')), false, 'a root feedback file must move into the feedback lane');
    assert.equal(read(project, 'workbench/feedback/WORKBENCH_FEEDBACK.md'), '# Root feedback\n');
    assert.ok(report.moved.some((entry) => entry.source === 'WORKBENCH_FEEDBACK.md' && entry.destination === 'workbench/feedback/WORKBENCH_FEEDBACK.md'));
    assert.equal(report.tools.status, 'installed');
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
    write(project, 'feedback/WORKBENCH_FEEDBACK.md', '# Lane feedback\n');
    write(project, 'WORKBENCH_FEEDBACK.md', '# Root feedback\n');
    const result = run('migrate', '--project', project, '--home', home, '--version', VERSION);
    assert.notEqual(result.status, 0, 'a root feedback file beside a legacy feedback lane file must block before mutation');
    assert.equal(JSON.parse(result.stdout).error.code, 'feedback-collision');
    assert.equal(fs.existsSync(path.join(project, 'workbench')), false);
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
    fs.rmSync(home, { recursive: true, force: true });
  }
}

console.log('ok - mixed v2 adoption preserves durable truth and blocks collisions');

{
  const project = fixture(); const home = fixture();
  try {
    seedControls(project); seedUserSkills(home);
    write(project, 'specs/S-101-adopted/SPEC.md', fixtureSpec());
    write(project, 'Wiki/MEMORY.md', '# Legacy Wiki memory\n');
    write(project, 'Wiki/nested/history.md', '# Preserve this knowledge\n');
    const result = run('migrate', '--project', project, '--home', home, '--version', VERSION);
    assert.equal(result.status, 0, result.stdout);
    assert.match(read(project, 'workbench/wiki/MEMORY.md'), /# Legacy Wiki memory\n$/);
    assert.match(read(project, 'workbench/wiki/MEMORY.md'), /^---\n/);
    assert.equal(read(project, 'workbench/wiki/nested/history.md'), '# Preserve this knowledge\n');
    assert.equal(fs.existsSync(path.join(project, 'Wiki')), false);
    assert.equal(fs.existsSync(path.join(project, 'workbench/wiki/SCHEMA.md')), true);
    assert.equal(JSON.parse(result.stdout).status, 'complete');
  } finally { fs.rmSync(project, { recursive: true, force: true }); fs.rmSync(home, { recursive: true, force: true }); }
}

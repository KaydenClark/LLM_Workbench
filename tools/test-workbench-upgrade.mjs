#!/usr/bin/env node
// The one-time v2 -> v3 upgrade route. S-00V: the core skills ship in the room,
// so the upgrade lays the skills lane and its discovery adapters down from
// this release through Adoption's migration and never reads, compares or
// replaces a skill in the provider home.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { RUNTIME_TOOLS, coreSkills } from '../workbench/tools/workbench-layout.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const VERSION = JSON.parse(fs.readFileSync(path.join(root, 'workbench', 'manifest.json'), 'utf8')).workbenchVersion;
const tool = path.join(root, 'tools', 'workbench-upgrade.mjs');
const controls = ['AGENTS.md', 'BLUEPRINT.md', 'LEXICON.md', 'RUNBOOK.md', 'TASKBOARD.md', 'CLAUDE.md', 'README.md'];

function fixture(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function run(toolPath, ...args) {
  const result = spawnSync(process.execPath, [toolPath, ...args], { cwd: root, encoding: 'utf8' });
  return { ...result, report: result.stdout ? JSON.parse(result.stdout) : null };
}

function write(project, relative, content) {
  const target = path.join(project, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function seedProject(project) {
  for (const control of controls) write(project, control, `# ${control}\n\nProject-specific v2 truth.\n`);
  write(project, 'BLUEPRINT.md', '# Blueprint\n\n<!-- spec-catalog:start -->\n<!-- spec-catalog:end -->\n');
  write(project, 'TASKBOARD.md', '# Taskboard\n\n<!-- hot-specs:start -->\n<!-- hot-specs:end -->\n');
  write(project, 'specs/S-101-upgrade/SPEC.md', [
    '# S-101 - Upgrade Fixture', '', '**Spec ID:** S-101', '**Status:** active', '**Priority:** 0',
    '**Owner:** owner', '**Updated:** 2026-09-01', '**Catalog description:** Verify upgrade recovery.',
    '**Blockers:** none', '**Latest event:** Ready.', '**Next gate:** Complete TK-001.', '',
    '## Vertical Implementation Slices', '', '| Task | Slice | Status | Blockers | Proof |',
    '|---|---|---|---|---|', '| TK-001 | Verify upgrade | ready | none | pending |', '',
    '## Acceptance Criteria', '', '- [ ] Upgrade works.', '', '## Append-Only Evidence And Execution Log', '',
    '| Date | Task | Event | Verification | Docs | Remaining gap |', '|---|---|---|---|---|---|', '',
    '## Completion Result', '', 'Pending.', '', '## Supersession', '', '- Supersedes: none', '- Superseded by: none', ''
  ].join('\n'));
  write(project, 'MEMORY.md', '# Project room memory\n');
  write(project, 'skills/local/SKILL.md', '# Legacy project-local skill\n');
  write(project, 'tools/app.mjs', 'export const app = true;\n');
  assert.equal(spawnSync('git', ['init', '-q'], { cwd: project }).status, 0);
  assert.equal(spawnSync('git', ['add', '.'], { cwd: project }).status, 0);
  assert.equal(spawnSync('git', ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.test', 'commit', '-qm', 'v2 fixture'], { cwd: project }).status, 0);
}

function assertLaneInstalled(project, home) {
  const manifest = JSON.parse(fs.readFileSync(path.join(project, 'workbench', 'manifest.json'), 'utf8'));
  assert.equal(manifest.lanes.skills, 'workbench/skills');
  const receipt = JSON.parse(fs.readFileSync(path.join(project, 'workbench', 'skills', '.workbench-skills.json'), 'utf8'));
  assert.equal(receipt.source.release, VERSION);
  assert.match(receipt.source.commit, /^[0-9a-f]{40}$/);
  for (const skill of coreSkills) {
    assert.equal(
      fs.readFileSync(path.join(project, 'workbench', 'skills', skill, 'SKILL.md'), 'utf8'),
      fs.readFileSync(path.join(root, 'workbench', 'skills', skill, 'SKILL.md'), 'utf8'),
      `${skill} is laid down from this release`
    );
    for (const discoveryRoot of ['.agents/skills', '.claude/skills']) {
      assert.equal(fs.realpathSync(path.join(project, discoveryRoot, skill)), fs.realpathSync(path.join(project, 'workbench', 'skills', skill)), `${discoveryRoot}/${skill} resolves into the lane`);
    }
  }
  assert.equal(fs.existsSync(path.join(project, 'skills')), false, 'the legacy root skills/ retires into recovery');
  assert.equal(fs.readFileSync(path.join(project, 'workbench', 'sessions', 'recovery', 'adoption-legacy-skills', 'local', 'SKILL.md'), 'utf8'), '# Legacy project-local skill\n');
  assert.deepEqual(fs.readdirSync(home).filter((name) => name.startsWith('.workbench-')), [], 'the provider home is never written by the upgrade');
  return { manifest, receipt };
}

test('explicit upgrade migrates once, lays the skills lane and adapters down, and records a concrete rollback point', () => {
  const project = fixture('workbench-upgrade-project-');
  const home = fixture('workbench-upgrade-home-');
  try {
    seedProject(project);
    write(home, '.agents/skills/genesis/SKILL.md', '# a personal catalog copy the upgrade must not touch\n');
    const beforeSha = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: project, encoding: 'utf8' }).stdout.trim();

    const result = run(tool, 'upgrade', '--project', project, '--home', home, '--version', VERSION, '--explicit-update');

    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.equal(result.report.status, 'complete');
    assert.equal(result.report.skills, 'lane-install');
    assert.deepEqual(result.report.skillBackups, []);
    assert.equal(result.report.coreRecovery, null);
    const { manifest, receipt } = assertLaneInstalled(project, home);
    assert.equal(fs.readFileSync(path.join(home, '.agents', 'skills', 'genesis', 'SKILL.md'), 'utf8'), '# a personal catalog copy the upgrade must not touch\n');
    assert.equal(fs.existsSync(path.join(project, 'specs')), false);
    assert.equal(result.report.recoveryPath, path.join('workbench', 'sessions', 'recovery', 'upgrade-recovery.json'));
    assert.equal(spawnSync('git', ['check-ignore', '-q', result.report.recoveryPath], { cwd: project }).status, 0, 'new recovery stays local');
    const recovery = JSON.parse(fs.readFileSync(path.join(project, result.report.recoveryPath), 'utf8'));
    assert.equal(recovery.preMigration.gitSha, beforeSha);
    assert.ok(recovery.preMigration.inventory.includes('specs/S-101-upgrade/SPEC.md'));
    assert.equal(recovery.skills, 'lane-install');
    assert.equal(recovery.skillsLane.status, 'installed');
    assert.equal(recovery.skillsLane.receipt, 'workbench/skills/.workbench-skills.json');
    assert.equal(recovery.skillsLane.source.commit, receipt.source.commit);
    assert.equal(fs.readFileSync(path.join(project, 'tools', 'app.mjs'), 'utf8'), 'export const app = true;\n', 'an application root tools directory survives an explicit upgrade');
    const toolsReceipt = JSON.parse(fs.readFileSync(path.join(project, 'workbench', 'tools', '.workbench-tools.json'), 'utf8'));
    assert.equal(toolsReceipt.source.release, VERSION, 'explicit upgrade installs receipt-backed runtime tools');
    assert.equal(recovery.tools.status, 'installed');
    assert.equal(manifest.provenance.lifecycle, 'upgrade');
    assert.equal(manifest.provenance.source.commit, toolsReceipt.source.commit, 'upgrade must preserve the adoption seam\'s exact source identity');
    assert.equal(manifest.provenance.source.commit, receipt.source.commit, 'both lanes name the same source commit');
    const doctor = spawnSync(process.execPath, [path.join(project, 'workbench', 'tools', 'spec-workbench.mjs'), 'doctor'], { cwd: project, encoding: 'utf8' });
    assert.doesNotMatch(doctor.stdout, /skill-lane-missing|skill-adapter|project-local-skills/, doctor.stdout);
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
    fs.rmSync(home, { recursive: true, force: true });
  }
});

test('layout-only upgrade lays the same lane down; the two modes are exclusive', () => {
  const project = fixture('workbench-upgrade-project-');
  const home = fixture('workbench-upgrade-home-');
  try {
    seedProject(project);
    const both = run(tool, 'upgrade', '--project', project, '--home', home, '--version', VERSION, '--explicit-update', '--layout-only');
    assert.notEqual(both.status, 0);
    assert.equal(both.report.error.code, 'invalid-invocation', 'the two modes are exclusive');
    assert.equal(fs.existsSync(path.join(project, 'workbench')), false);

    const result = run(tool, 'upgrade', '--project', project, '--home', home, '--version', VERSION, '--layout-only');
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.equal(result.report.status, 'complete');
    assert.equal(result.report.skills, 'lane-install');
    assertLaneInstalled(project, home);
    const recovery = JSON.parse(fs.readFileSync(path.join(project, result.report.recoveryPath), 'utf8'));
    assert.equal(recovery.lifecycle, 'upgrade');
    assert.equal(recovery.skillsLane.status, 'installed');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
    fs.rmSync(home, { recursive: true, force: true });
  }
});

test('the updater refuses to run without an explicit mode', () => {
  const project = fixture('workbench-upgrade-project-');
  const home = fixture('workbench-upgrade-home-');
  try {
    seedProject(project);
    const result = run(tool, 'upgrade', '--project', project, '--home', home, '--version', VERSION);
    assert.notEqual(result.status, 0);
    assert.equal(result.report.status, 'blocked');
    assert.equal(result.report.error.code, 'explicit-update-required');
    assert.equal(fs.existsSync(path.join(project, 'workbench')), false);
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
    fs.rmSync(home, { recursive: true, force: true });
  }
});

test('the updater refuses a dirty project because HEAD alone is not a full recovery point', () => {
  const project = fixture('workbench-upgrade-project-');
  const home = fixture('workbench-upgrade-home-');
  try {
    seedProject(project);
    write(project, 'README.md', '# README.md\n\nUncommitted project truth.\n');
    for (const mode of ['--explicit-update', '--layout-only']) {
      const result = run(tool, 'upgrade', '--project', project, '--home', home, '--version', VERSION, mode);
      assert.notEqual(result.status, 0);
      assert.equal(result.report.status, 'blocked');
      assert.equal(result.report.error.code, 'dirty-project', mode);
      assert.equal(fs.existsSync(path.join(project, 'workbench')), false);
    }
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
    fs.rmSync(home, { recursive: true, force: true });
  }
});

test('the updater validates every consumed source lane, including the skills lane, before touching the project', () => {
  for (const dirtyRelative of ['workbench/tools/diagnostics.mjs', 'templates/wiki/SCHEMA.md', 'workbench/skills/genesis/SKILL.md']) {
    const project = fixture('workbench-upgrade-project-');
    const home = fixture('workbench-upgrade-home-');
    const parent = fixture('workbench-upgrade-source-');
    const bundle = path.join(parent, 'release');
    try {
      seedProject(project);
      const cloned = spawnSync('git', ['clone', '-q', '--no-local', root, bundle], { cwd: parent, encoding: 'utf8' });
      assert.equal(cloned.status, 0, cloned.stderr);
      const bundleUpgrade = path.join(bundle, 'tools', 'workbench-upgrade.mjs');
      fs.appendFileSync(path.join(bundle, dirtyRelative), '\n// dirty consumed source\n');

      const result = run(bundleUpgrade, 'upgrade', '--project', project, '--home', home, '--version', VERSION, '--explicit-update');

      assert.notEqual(result.status, 0);
      assert.equal(result.report.status, 'blocked', dirtyRelative);
      assert.equal(result.report.error.code, 'invalid-source-identity', dirtyRelative);
      assert.equal(fs.existsSync(path.join(project, 'workbench')), false, `${dirtyRelative} failure leaves the target project untouched`);
      assert.deepEqual(fs.readdirSync(home), [], `${dirtyRelative} failure writes nothing to the home`);
    } finally {
      fs.rmSync(project, { recursive: true, force: true });
      fs.rmSync(home, { recursive: true, force: true });
      fs.rmSync(parent, { recursive: true, force: true });
    }
  }
});

// S-004C TK-006L: a skill the release checkout's manifest declares under
// `maintainerSkills` passes the source check and is never laid into the room's
// lane; an undeclared extra lane skill still blocks before the project changes.
function releaseWithExtraSkill(parent, declare) {
  const bundle = path.join(parent, 'release');
  const cloned = spawnSync('git', ['clone', '-q', '--no-local', root, bundle], { cwd: parent, encoding: 'utf8' });
  assert.equal(cloned.status, 0, cloned.stderr);
  const skill = declare ? 'maintainer-fixture' : 'stray-fixture';
  write(bundle, `workbench/skills/${skill}/SKILL.md`, `---\nname: ${skill}\ndescription: Fixture lane skill.\n---\n\n# ${skill}\n`);
  if (declare) {
    // Add to whatever the release already declares, so the fixture holds once
    // this repository declares real maintainer skills.
    const manifestPath = path.join(bundle, 'workbench', 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    manifest.maintainerSkills = [...(manifest.maintainerSkills ?? []), skill];
    fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  }
  assert.equal(spawnSync('git', ['add', '-A'], { cwd: bundle }).status, 0);
  const committed = spawnSync('git', ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.test', 'commit', '-qm', 'maintainer fixture'], { cwd: bundle, encoding: 'utf8' });
  assert.equal(committed.status, 0, committed.stderr);
  return path.join(bundle, 'tools', 'workbench-upgrade.mjs');
}

test('a declared maintainer skill in the release passes the source check and is never laid into the room', () => {
  const project = fixture('workbench-upgrade-project-');
  const home = fixture('workbench-upgrade-home-');
  const parent = fixture('workbench-upgrade-source-');
  try {
    seedProject(project);
    const bundleUpgrade = releaseWithExtraSkill(parent, true);
    const result = run(bundleUpgrade, 'upgrade', '--project', project, '--home', home, '--version', VERSION, '--explicit-update');
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.equal(result.report.status, 'complete', result.stdout);
    assert.equal(fs.existsSync(path.join(project, 'workbench', 'skills', 'maintainer-fixture')), false, 'the maintainer skill never ships into the room');
    const receipt = JSON.parse(fs.readFileSync(path.join(project, 'workbench', 'skills', '.workbench-skills.json'), 'utf8'));
    assert.deepEqual(Object.keys(receipt.skills).sort(), [...coreSkills].sort(), 'the lane receipt names only the core skills');
    const manifest = JSON.parse(fs.readFileSync(path.join(project, 'workbench', 'manifest.json'), 'utf8'));
    assert.equal(Object.hasOwn(manifest, 'maintainerSkills'), false, 'the room manifest declares no maintainer skills');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
    fs.rmSync(home, { recursive: true, force: true });
    fs.rmSync(parent, { recursive: true, force: true });
  }
});

test('an undeclared extra skill in the release lane still blocks the upgrade before the project changes', () => {
  const project = fixture('workbench-upgrade-project-');
  const home = fixture('workbench-upgrade-home-');
  const parent = fixture('workbench-upgrade-source-');
  try {
    seedProject(project);
    const bundleUpgrade = releaseWithExtraSkill(parent, false);
    const result = run(bundleUpgrade, 'upgrade', '--project', project, '--home', home, '--version', VERSION, '--explicit-update');
    assert.notEqual(result.status, 0);
    assert.equal(result.report.status, 'blocked');
    assert.equal(result.report.error.code, 'invalid-bundled-core');
    assert.equal(fs.existsSync(path.join(project, 'workbench')), false, 'the project is untouched');
    assert.deepEqual(fs.readdirSync(home), [], 'the home is untouched');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
    fs.rmSync(home, { recursive: true, force: true });
    fs.rmSync(parent, { recursive: true, force: true });
  }
});

// S-003Z TK-008J: the ordinary managed update route of an existing room that
// predates landmarks - `workbench-layout.mjs migrate`, then
// `workbench-tools.mjs update --explicit-update` and `workbench-skills.mjs
// update --explicit-update` from the release checkout - leaves the room's work
// unchanged. Its Specs, Task records, projections and seeded documents stay
// byte-identical; the manifest gains only the appended `landmarks`
// collection with its empty folder, and the managed tools lane gains the
// `landmark-artifact.mjs` runtime tool and the receipt key that names it.
// The fixture room is a current room rewound to the pre-landmark shape a room
// stamped before the landmarks collection carries.
function snapshot(project) {
  const files = {};
  const walk = (relative) => {
    for (const entry of fs.readdirSync(path.join(project, relative), { withFileTypes: true })) {
      const child = relative ? `${relative}/${entry.name}` : entry.name;
      if (child === '.git') continue;
      if (entry.isDirectory()) walk(child);
      else files[child] = fs.lstatSync(path.join(project, child)).isSymbolicLink() ? `link:${fs.readlinkSync(path.join(project, child))}` : fs.readFileSync(path.join(project, child), 'utf8');
    }
  };
  walk('');
  return files;
}

test('updating a room with no landmarks through the managed route leaves its work unchanged and installs the landmark runtime tool', () => {
  const project = fixture('workbench-upgrade-project-');
  const home = fixture('workbench-upgrade-home-');
  const git = (...args) => spawnSync('git', ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.test', ...args], { cwd: project, encoding: 'utf8' });
  const roomTool = (...args) => spawnSync(process.execPath, [path.join(project, 'workbench', 'tools', 'spec-workbench.mjs'), ...args], { cwd: project, encoding: 'utf8' });
  try {
    seedProject(project);
    const upgraded = run(tool, 'upgrade', '--project', project, '--home', home, '--version', VERSION, '--explicit-update');
    assert.equal(upgraded.status, 0, upgraded.stdout + upgraded.stderr);
    // The room's work: its Spec's slice becomes a Task record and render
    // writes the projections, so the update has Specs, Tasks and generated
    // regions to leave alone.
    const converted = roomTool('convert-tasks', 'S-101');
    assert.equal(converted.status, 0, converted.stdout + converted.stderr);
    assert.ok(fs.existsSync(path.join(project, 'workbench', 'specs', 'S-101-upgrade', 'tasks', 'TK-001', 'TASK.md')), 'the room holds a Task record');
    const rendered = roomTool('render');
    assert.equal(rendered.status, 0, rendered.stdout + rendered.stderr);

    // Rewind to the room as it stood before landmarks: no `landmarks`
    // collection or folder, and a tools lane installed before
    // `landmark-artifact.mjs` existed (neither the file nor its receipt key).
    const manifestPath = path.join(project, 'workbench', 'manifest.json');
    const current = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert.equal(Object.keys(current.collections).at(-1), 'landmarks', 'landmarks is the last additive collection');
    const { landmarks, ...preLandmarkCollections } = current.collections;
    const preLandmark = { ...current, collections: preLandmarkCollections };
    fs.writeFileSync(manifestPath, `${JSON.stringify(preLandmark, null, 2)}\n`);
    fs.rmSync(path.join(project, landmarks), { recursive: true });
    const receiptPath = path.join(project, 'workbench', 'tools', '.workbench-tools.json');
    const toolsReceipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
    delete toolsReceipt.files['landmark-artifact.mjs'];
    fs.writeFileSync(receiptPath, `${JSON.stringify(toolsReceipt, null, 2)}\n`);
    fs.rmSync(path.join(project, 'workbench', 'tools', 'landmark-artifact.mjs'));
    assert.equal(git('add', '-A').status, 0);
    assert.equal(git('commit', '-qm', 'room before landmarks').status, 0);
    const before = snapshot(project);

    // The managed update route, in the update-harness order.
    const migrated = spawnSync(process.execPath, [path.join(root, 'workbench', 'tools', 'workbench-layout.mjs'), 'migrate', '--project', project], { cwd: root, encoding: 'utf8' });
    assert.equal(migrated.status, 0, migrated.stdout + migrated.stderr);
    assert.deepEqual(JSON.parse(migrated.stdout).added, ['collections.landmarks']);
    const tools = run(path.join(root, 'tools', 'workbench-tools.mjs'), 'update', '--project', project, '--home', home, '--explicit-update');
    assert.equal(tools.status, 0, tools.stdout + tools.stderr);
    assert.equal(tools.report.status, 'updated');
    assert.deepEqual(tools.report.changed, ['landmark-artifact.mjs'], 'only the missing landmark runtime tool changes');
    const skills = run(path.join(root, 'tools', 'workbench-skills.mjs'), 'update', '--project', project, '--home', home, '--explicit-update');
    assert.equal(skills.status, 0, skills.stdout + skills.stderr);

    const after = snapshot(project);
    const changed = [...new Set([...Object.keys(before), ...Object.keys(after)])].filter((file) => before[file] !== after[file]).sort();
    assert.deepEqual(changed, [
      'workbench/landmarks/.gitkeep',
      'workbench/manifest.json',
      'workbench/tools/.workbench-tools.json',
      'workbench/tools/landmark-artifact.mjs'
    ], 'no Spec, Task, projection, seeded document, skill or other file changes');
    assert.equal(after['workbench/landmarks/.gitkeep'], '', 'the landmarks collection starts empty and kept in Git');
    assert.equal(after['workbench/manifest.json'], `${JSON.stringify({ ...preLandmark, collections: { ...preLandmarkCollections, landmarks: 'workbench/landmarks' } }, null, 2)}\n`, 'the manifest gains only the appended landmarks collection');
    assert.equal(after['workbench/tools/landmark-artifact.mjs'], fs.readFileSync(path.join(root, 'workbench', 'tools', 'landmark-artifact.mjs'), 'utf8'), 'the managed bundle installs the landmark runtime tool from the release');
    const updatedReceipt = JSON.parse(after['workbench/tools/.workbench-tools.json']);
    assert.equal(updatedReceipt.files['landmark-artifact.mjs'], createHash('sha256').update(fs.readFileSync(path.join(root, 'workbench', 'tools', 'landmark-artifact.mjs'))).digest('hex'), 'the installed receipt names the landmark runtime tool');
    assert.deepEqual(Object.keys(updatedReceipt.files).sort(), [...RUNTIME_TOOLS].sort(), 'the receipt accounts for every managed runtime tool');
    const verified = run(path.join(root, 'tools', 'workbench-tools.mjs'), 'verify', '--project', project);
    assert.equal(verified.status, 0, verified.stdout + verified.stderr);
    assert.equal(verified.report.status, 'valid');

    // The updated room's own runtime renders its projections unchanged and
    // reads its work exactly as before.
    const rerendered = roomTool('render');
    assert.equal(rerendered.status, 0, rerendered.stdout + rerendered.stderr);
    assert.deepEqual(snapshot(project), after, 'render after the update leaves every projection unchanged');
    const doctor = roomTool('doctor', '--json');
    const findings = JSON.parse(doctor.stdout);
    assert.ok(Array.isArray(findings), doctor.stdout);
    assert.deepEqual(findings.filter((finding) => ['all', 'selection'].includes(finding.blocks)), [], doctor.stdout);
    assert.deepEqual(findings.filter((finding) => /landmark/.test(finding.code)), [], 'the empty landmarks collection raises no landmark finding');
    assert.equal(JSON.parse(roomTool('next', '--json').stdout)?.specId, 'S-101', 'the room still selects its own work');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
    fs.rmSync(home, { recursive: true, force: true });
  }
});

console.log('ok - the one-time upgrade lays the skills lane down from the release and never touches the provider home');

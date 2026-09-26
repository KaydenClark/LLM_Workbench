#!/usr/bin/env node
// S-00V TK-001: the core skills ship inside the room at the manifest-declared
// skills lane, and a fresh clone discovers them through both declared
// discovery roots without a provider home or personal catalog.
//
// The first test clones the COMMITTED candidate (HEAD of this checkout) into a
// scrubbed directory, so uncommitted work never turns it green. The second
// lays the lane into a fresh room with the release tools and checks the
// managed receipt, adapters, verify/update and the doctor findings.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const scrubbedHome = fs.mkdtempSync(path.join(os.tmpdir(), 'skills-lane-home-'));
const env = { PATH: process.env.PATH, HOME: scrubbedHome, LANG: 'C', LC_ALL: 'C' };

function run(cwd, command, args) {
  const result = spawnSync(command, args, { cwd, env, encoding: 'utf8' });
  return { status: result.status, stdout: result.stdout ?? '', stderr: result.stderr ?? '' };
}
function node(cwd, script, ...args) { return run(cwd, process.execPath, [script, ...args]); }
function json(result) {
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  return JSON.parse(result.stdout);
}
function fixture(prefix) { return fs.mkdtempSync(path.join(os.tmpdir(), prefix)); }
function insideLane(file, lane) {
  const real = fs.realpathSync(file);
  return real === lane || real.startsWith(lane + path.sep);
}

test('a scrubbed clone of the committed candidate resolves every required skill through both discovery roots inside the lane', () => {
  const workspace = fixture('skills-lane-clone-');
  try {
    const clone = path.join(workspace, 'clone');
    const cloned = run(workspace, 'git', ['clone', '--quiet', '--no-hardlinks', root, clone]);
    assert.equal(cloned.status, 0, cloned.stderr);
    const manifest = JSON.parse(fs.readFileSync(path.join(clone, 'workbench', 'manifest.json'), 'utf8'));
    assert.equal(manifest.lanes.skills, 'workbench/skills', 'the manifest declares the skills lane');
    const lane = fs.realpathSync(path.join(clone, manifest.lanes.skills));
    assert.ok(manifest.skillPolicy.required.length >= 21, 'the required core bundle is declared');
    for (const skill of manifest.skillPolicy.required) {
      assert.ok(fs.statSync(path.join(lane, skill, 'SKILL.md')).isFile(), `${skill} ships in the lane`);
      for (const discoveryRoot of manifest.skillPolicy.discovery) {
        const file = path.join(clone, discoveryRoot, skill, 'SKILL.md');
        assert.ok(fs.statSync(file).isFile(), `${discoveryRoot}/${skill}/SKILL.md resolves in the clone`);
        assert.ok(insideLane(file, lane), `${discoveryRoot}/${skill} resolves inside the lane, not outside the clone`);
      }
    }
    assert.equal(fs.existsSync(path.join(clone, 'skills')), false, 'no root skills/ shadows the lane');
    assert.equal(fs.readdirSync(scrubbedHome).length, 0, 'nothing was written to the provider home');
    const doctor = node(clone, path.join(clone, 'workbench', 'tools', 'spec-workbench.mjs'), 'doctor');
    assert.equal(doctor.status, 0, doctor.stdout + doctor.stderr);
    assert.doesNotMatch(doctor.stdout, /skill-lane-missing|skill-adapter|project-local-skills|skill-missing/, doctor.stdout);
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true });
  }
});

test('the release lays the lane into a fresh room with a receipt and adapters, verifies it, and doctor names a root skills shadow', () => {
  const workspace = fixture('skills-lane-room-');
  try {
    const project = path.join(workspace, 'room');
    fs.mkdirSync(project);
    run(project, 'git', ['init', '-q', '-b', 'main']);
    const layout = path.join(root, 'workbench', 'tools', 'workbench-layout.mjs');
    const version = JSON.parse(fs.readFileSync(path.join(root, 'workbench', 'manifest.json'), 'utf8')).workbenchVersion;
    json(node(root, layout, 'init', '--project', project, '--provenance', 'genesis', '--version', version, '--name', 'Lane Room', '--default-branch', 'main', '--integration-branch', 'integration'));
    json(node(root, path.join(root, 'tools', 'workbench-tools.mjs'), 'install', '--project', project));
    const skillsTool = path.join(root, 'tools', 'workbench-skills.mjs');
    const installed = json(node(root, skillsTool, 'install', '--project', project));
    assert.equal(installed.status, 'installed', JSON.stringify(installed));
    const manifest = JSON.parse(fs.readFileSync(path.join(project, 'workbench', 'manifest.json'), 'utf8'));
    const lane = path.join(project, manifest.lanes.skills);
    const receipt = JSON.parse(fs.readFileSync(path.join(lane, '.workbench-skills.json'), 'utf8'));
    assert.equal(receipt.source.release, version);
    assert.match(receipt.source.commit, /^[0-9a-f]{40}$/);
    for (const skill of manifest.skillPolicy.required) {
      assert.ok(fs.statSync(path.join(lane, skill, 'SKILL.md')).isFile(), `${skill} installed`);
      assert.match(receipt.skills[skill], /^[0-9a-f]{64}$/, `${skill} hashed in the receipt`);
      for (const discoveryRoot of manifest.skillPolicy.discovery) {
        const adapter = path.join(project, discoveryRoot);
        assert.ok(fs.lstatSync(adapter).isSymbolicLink(), `${discoveryRoot} is a tracked adapter link`);
        assert.equal(fs.realpathSync(path.join(adapter, skill)), fs.realpathSync(path.join(lane, skill)));
      }
    }
    assert.equal(json(node(root, skillsTool, 'verify', '--project', project)).status, 'valid');
    assert.equal(json(node(root, skillsTool, 'update', '--project', project, '--explicit-update')).status, 'current');
    const doctorTool = path.join(project, 'workbench', 'tools', 'spec-workbench.mjs');
    assert.doesNotMatch(node(project, doctorTool, 'doctor').stdout, /skill-lane-missing|skill-adapter|project-local-skills/);
    fs.mkdirSync(path.join(project, 'skills', 'shadow'), { recursive: true });
    fs.writeFileSync(path.join(project, 'skills', 'shadow', 'SKILL.md'), '# shadow\n');
    const shadowed = node(project, doctorTool, 'doctor');
    assert.match(shadowed.stdout, /project-local-skills/, 'a root skills/ is reported as a lane shadow');
    fs.rmSync(path.join(project, 'skills'), { recursive: true, force: true });
    fs.rmSync(path.join(lane, manifest.skillPolicy.required[0]), { recursive: true, force: true });
    assert.match(node(project, doctorTool, 'doctor').stdout, /skill-lane-missing/, 'a required skill missing from the lane is reported');
    const repaired = json(node(root, skillsTool, 'update', '--project', project, '--explicit-update', '--home', scrubbedHome));
    assert.equal(repaired.status, 'updated');
    assert.deepEqual(repaired.changed, [manifest.skillPolicy.required[0]]);
    assert.equal(json(node(root, skillsTool, 'verify', '--project', project)).status, 'valid');
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true });
  }
});

test('install refuses an adapter collision before copying anything, and rollback accepts only a backup the receipt recorded', () => {
  const workspace = fixture('skills-lane-guards-');
  try {
    const project = path.join(workspace, 'room');
    fs.mkdirSync(project);
    run(project, 'git', ['init', '-q', '-b', 'main']);
    const layout = path.join(root, 'workbench', 'tools', 'workbench-layout.mjs');
    const version = JSON.parse(fs.readFileSync(path.join(root, 'workbench', 'manifest.json'), 'utf8')).workbenchVersion;
    json(node(root, layout, 'init', '--project', project, '--provenance', 'genesis', '--version', version, '--name', 'Guard Room', '--default-branch', 'main', '--integration-branch', 'integration'));
    const skillsTool = path.join(root, 'tools', 'workbench-skills.mjs');
    fs.mkdirSync(path.join(project, '.claude', 'skills', 'mine'), { recursive: true });
    fs.writeFileSync(path.join(project, '.claude', 'skills', 'mine', 'SKILL.md'), '# mine\n');
    const collided = node(root, skillsTool, 'install', '--project', project);
    assert.equal(JSON.parse(collided.stdout).error.code, 'adapter-collision');
    const laneEntries = fs.readdirSync(path.join(project, 'workbench', 'skills')).filter((name) => name !== '.gitkeep');
    assert.deepEqual(laneEntries, [], 'a refused install copies nothing into the lane');
    fs.rmSync(path.join(project, '.claude', 'skills'), { recursive: true, force: true });
    assert.equal(json(node(root, skillsTool, 'install', '--project', project)).status, 'installed');

    const foreign = path.join(workspace, 'foreign-backup');
    fs.mkdirSync(path.join(foreign, 'save'), { recursive: true });
    fs.writeFileSync(path.join(foreign, 'save', 'SKILL.md'), '# foreign bytes\n');
    const receipt = JSON.parse(fs.readFileSync(path.join(project, 'workbench', 'skills', '.workbench-skills.json'), 'utf8'));
    fs.writeFileSync(path.join(foreign, '.workbench-skills.json'), JSON.stringify({ ...receipt, skills: { save: 'x' } }));
    const refused = node(root, skillsTool, 'rollback', '--project', project, '--backup', foreign);
    assert.equal(JSON.parse(refused.stdout).error.code, 'invalid-backup', refused.stdout);
    assert.notEqual(fs.readFileSync(path.join(project, 'workbench', 'skills', 'save', 'SKILL.md'), 'utf8'), '# foreign bytes\n', 'an unrecorded directory never restores bytes');
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true });
  }
});

// S-00V TK-00G: the catalog review. A skill the Contract (the seven root
// controls) names, or a lane skill composes as a required step, must ship in
// the lane, or a clone would stop at a reference it cannot resolve. The scan
// finds every syntactic skill reference - a backticked slash command
// (`/name`) or backticked names followed by "skill(s)" - and fails for any
// target outside the lane that has no recorded disposition. Whether a
// reference is required is a reading of its context, not something a regex
// can decide, so the disposition table in `workbench/skills/README.md`
// records that reading and this test holds the table to the lane.
const rootControls = ['AGENTS.md', 'BLUEPRINT.md', 'LEXICON.md', 'RUNBOOK.md', 'TASKBOARD.md', 'CLAUDE.md', 'README.md'];
const referenceRequirements = ['required', 'optional', 'none'];
const referenceDispositions = ['joined', 'optional mention', 'out of scope'];

function skillReferences(text) {
  const names = new Set();
  for (const match of text.matchAll(/`\/([a-z][a-z0-9-]*)`/g)) names.add(match[1]);
  const flat = text.replace(/\s+/g, ' ');
  for (const match of flat.matchAll(/((?:`\/?[a-z][a-z0-9-]*`(?:,\s*|\s+(?:and|or)\s+))*`\/?[a-z][a-z0-9-]*`)\s+skills?\b/g)) {
    for (const name of match[1].matchAll(/`\/?([a-z][a-z0-9-]*)`/g)) names.add(name[1]);
  }
  return names;
}

function referencedSkillRows(catalog) {
  const region = catalog.match(/<!-- referenced-skills:start -->([\s\S]*?)<!-- referenced-skills:end -->/);
  if (!region) return [];
  return region[1].split('\n')
    .filter((line) => /^\| `[a-z][a-z0-9-]*` \|/.test(line))
    .map((line) => line.split('|').slice(1, -1).map((cell) => cell.trim()))
    .map(([skill, reference, requirement, disposition, reason]) => ({ skill: skill.replaceAll('`', ''), reference, requirement, disposition, reason }));
}

test('every skill the root controls or a lane SKILL.md references ships in the lane or carries a recorded non-lane disposition', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'workbench', 'manifest.json'), 'utf8'));
  const laneDir = path.join(root, manifest.lanes.skills);
  const laneSkills = fs.readdirSync(laneDir, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  const sources = [...rootControls, ...laneSkills.map((skill) => `${manifest.lanes.skills}/${skill}/SKILL.md`)];
  const referencedBy = new Map();
  for (const source of sources) {
    for (const name of skillReferences(fs.readFileSync(path.join(root, source), 'utf8'))) {
      if (!referencedBy.has(name)) referencedBy.set(name, []);
      referencedBy.get(name).push(source);
    }
  }
  const rows = referencedSkillRows(fs.readFileSync(path.join(laneDir, 'README.md'), 'utf8'));
  const bySkill = new Map(rows.map((row) => [row.skill, row]));
  assert.equal(bySkill.size, rows.length, 'each skill has one disposition row');
  const unclassified = [...referencedBy.keys()].filter((name) => !laneSkills.includes(name) && !bySkill.has(name)).sort()
    .map((name) => `${name} (${referencedBy.get(name).join(', ')})`);
  assert.deepEqual(unclassified, [], 'every referenced skill outside the lane needs a disposition row in workbench/skills/README.md: join it to the lane or record why the reference is optional or not a skill');
  for (const row of rows) {
    assert.ok(referenceRequirements.includes(row.requirement), `${row.skill}: requirement is one of ${referenceRequirements.join(', ')}`);
    assert.ok(referenceDispositions.includes(row.disposition), `${row.skill}: disposition is one of ${referenceDispositions.join(', ')}`);
    assert.ok(row.reason.length > 0, `${row.skill}: the row gives the reading that decided it`);
    const cited = [...row.reference.matchAll(/`([^`]+)`/g)].map((match) => match[1]);
    assert.ok(row.reference === 'none' || cited.length > 0, `${row.skill}: the reference cell cites the deciding file or says none`);
    for (const file of cited) assert.ok(fs.existsSync(path.join(root, file)), `${row.skill}: cited reference ${file} exists`);
    const inLane = laneSkills.includes(row.skill) && manifest.skillPolicy.required.includes(row.skill);
    if (row.requirement === 'required' || row.disposition === 'joined') {
      assert.equal(row.requirement === 'required' && row.disposition === 'joined', true, `${row.skill}: a required reference is joined, and only a required one`);
      assert.ok(inLane, `${row.skill}: a joined skill ships in the lane and in skillPolicy.required`);
    } else {
      assert.equal(laneSkills.includes(row.skill), false, `${row.skill}: a lane skill needs no non-lane disposition row`);
    }
  }
});

test.after(() => fs.rmSync(scrubbedHome, { recursive: true, force: true }));

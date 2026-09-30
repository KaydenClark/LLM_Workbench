#!/usr/bin/env node
// S-00V: doctor's skill inspection reads the room's skills lane and the two
// discovery adapters, never the provider home, and never writes.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { inspectSkills } from '../workbench/tools/skill-inspection.mjs';

const policy = { schemaVersion: 2, workbenchVersion: 'v3.2.1', lanes: { skills: 'workbench/skills' }, skillPolicy: { required: ['genesis', 'save'], discovery: ['.agents/skills', '.claude/skills'] } };
function fixture() { return fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-skill-inspection-')); }
function room(project, { skills = ['genesis', 'save'], adapters = true } = {}) {
  const lane = path.join(project, 'workbench', 'skills');
  fs.mkdirSync(lane, { recursive: true });
  for (const skill of skills) {
    fs.mkdirSync(path.join(lane, skill), { recursive: true });
    fs.writeFileSync(path.join(lane, skill, 'SKILL.md'), `# ${skill} fixture\n`);
  }
  if (adapters) {
    for (const discoveryRoot of ['.agents/skills', '.claude/skills']) {
      const adapter = path.join(project, discoveryRoot);
      fs.mkdirSync(path.dirname(adapter), { recursive: true });
      fs.symlinkSync(path.relative(path.dirname(adapter), lane), adapter, 'dir');
    }
  }
  return lane;
}
function snapshot(directory) {
  return fs.readdirSync(directory).sort().flatMap(name => {
    const file = path.join(directory, name), stat = fs.lstatSync(file);
    return [[file, stat.mode, stat.isSymbolicLink() ? fs.readlinkSync(file) : stat.isFile() ? fs.readFileSync(file).toString('base64') : 'directory'], ...(stat.isDirectory() ? snapshot(file) : [])];
  });
}
const codes = (project, manifest = policy) => inspectSkills(manifest, project).map(item => item.code);

test('a lane holding every required skill behind both adapters is clean, and inspection never writes', () => {
  const project = fixture();
  try {
    room(project);
    const before = snapshot(project);
    assert.deepEqual(codes(project), []);
    assert.deepEqual(snapshot(project), before);
  } finally { fs.rmSync(project, { recursive: true, force: true }); }
});

test('an uninstalled lane is one finding; a single missing skill is reported by name', () => {
  const project = fixture();
  try {
    room(project, { skills: [] });
    const uninstalled = inspectSkills(policy, project);
    assert.deepEqual(uninstalled.map(item => [item.code, item.severity, item.blocks]), [['skill-lane-missing', 'error', 'none']]);
    assert.match(uninstalled[0].message, /none of the 2 required core skills/);
    fs.mkdirSync(path.join(project, 'workbench', 'skills', 'genesis'), { recursive: true });
    fs.writeFileSync(path.join(project, 'workbench', 'skills', 'genesis', 'SKILL.md'), '# genesis\n');
    const missing = inspectSkills(policy, project);
    assert.deepEqual(missing.map(item => [item.code, item.skill]), [['skill-lane-missing', 'save']]);
    assert.match(missing[0].message, /workbench\/skills\/save\/SKILL\.md is missing/);
  } finally { fs.rmSync(project, { recursive: true, force: true }); }
});

test('an absent or misresolving discovery root is reported by root without blocking', () => {
  const project = fixture();
  try {
    const lane = room(project, { adapters: false });
    assert.deepEqual(inspectSkills(policy, project).map(item => [item.code, item.blocks, item.root]), [
      ['skill-adapter-missing', 'none', '.agents/skills'], ['skill-adapter-missing', 'none', '.claude/skills']
    ]);
    fs.mkdirSync(path.join(project, '.agents'), { recursive: true });
    fs.symlinkSync('../workbench/skills', path.join(project, '.agents', 'skills'), 'dir');
    fs.mkdirSync(path.join(project, '.claude', 'skills'), { recursive: true });
    fs.symlinkSync(path.join(lane, 'genesis'), path.join(project, '.claude', 'skills', 'genesis'), 'dir');
    const codesNow = codes(project);
    assert.ok(codesNow.includes('skill-adapter-broken'), codesNow.join(','));
    assert.equal(codesNow.includes('skill-adapter-missing'), false);
    fs.rmSync(path.join(project, '.claude', 'skills'), { recursive: true, force: true });
    fs.symlinkSync('nowhere', path.join(project, '.claude', 'skills'), 'dir');
    assert.deepEqual(codes(project), ['skill-adapter-broken']);
  } finally { fs.rmSync(project, { recursive: true, force: true }); }
});

test('a root skills/ shadow blocks everything, an unsafe lane entry is unreadable, and a .codex duplicate is diagnosed', () => {
  const project = fixture();
  try {
    const lane = room(project);
    fs.mkdirSync(path.join(project, 'skills', 'shadow'), { recursive: true });
    const shadowed = inspectSkills(policy, project);
    assert.deepEqual(shadowed.map(item => [item.code, item.blocks]), [['project-local-skills', 'all']]);
    fs.rmSync(path.join(project, 'skills'), { recursive: true, force: true });
    fs.rmSync(path.join(lane, 'save'), { recursive: true, force: true });
    fs.symlinkSync(path.join(lane, 'genesis'), path.join(lane, 'save'), 'dir');
    assert.deepEqual(codes(project), ['skill-lane-unreadable']);
    fs.rmSync(path.join(lane, 'save'), { force: true });
    fs.mkdirSync(path.join(lane, 'save'));
    fs.writeFileSync(path.join(lane, 'save', 'SKILL.md'), '# save\n');
    fs.mkdirSync(path.join(project, '.codex', 'skills', 'save'), { recursive: true });
    assert.deepEqual(codes(project), ['skill-duplicate-discovery']);
  } finally { fs.rmSync(project, { recursive: true, force: true }); }
});

test('a manifest without a skills lane, an unsafe lane, or an unsupported policy is reported and nothing is read further', () => {
  const project = fixture();
  try {
    room(project);
    assert.deepEqual(codes(project, { ...policy, lanes: {} }), ['skill-lane-missing']);
    assert.deepEqual(codes(project, { ...policy, skillPolicy: { required: ['Genesis'], discovery: ['.agents/skills'] } }), ['invalid-skill-policy']);
    assert.deepEqual(codes(project, { ...policy, skillPolicy: { required: ['genesis'], discovery: ['.codex/skills'] } }), ['invalid-skill-policy']);
    assert.deepEqual(codes(project, { schemaVersion: 1 }), []);
    fs.rmSync(path.join(project, 'workbench', 'skills'), { recursive: true, force: true });
    fs.writeFileSync(path.join(project, 'workbench', 'skills'), 'not a directory');
    assert.deepEqual(codes(project), ['skill-lane-unreadable']);
  } finally { fs.rmSync(project, { recursive: true, force: true }); }
});

#!/usr/bin/env node
// S-00V: doctor's skill inspection reads the room's skills lane and the two
// discovery adapters, never the provider home, and never writes.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { inspectSkills, resolveSkillPointers, skillContentHash } from '../workbench/tools/skill-inspection.mjs';

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

// S-004C TK-005E: authority flows through the pointer. A lane skill that a
// row of the RUNBOOK.md operations index points to binds for that operation;
// every other lane skill, including a room-added one, teaches. The resolver
// reads the index and the lane copy only, so a drifted installed copy never
// decides what binds, and a pointer to a skill the lane lacks is named.
function index(rows) {
  return [
    '# Fixture Runbook', '', '## Operations Index', '',
    '| Operation | Follow when | Pointer |', '|---|---|---|',
    ...rows.map(([operation, pointer]) => `| ${operation} | When it applies. | ${pointer} |`),
    '', '## Ordinary Entry', '', 'Enter here.', '',
    '## Later Section', '', 'A link outside the index, such as [genesis](workbench/skills/genesis/SKILL.md), declares nothing.', ''
  ].join('\n');
}

test('an index pointer makes a lane skill binding for its operation and a room-added unpointed skill teaches only', () => {
  const project = fixture();
  try {
    const lane = room(project);
    fs.mkdirSync(path.join(lane, 'deploy-notes'), { recursive: true });
    fs.writeFileSync(path.join(lane, 'deploy-notes', 'SKILL.md'), '# deploy-notes, added by this room\n');
    fs.writeFileSync(path.join(project, 'RUNBOOK.md'), index([
      ['Enter a session', '[Ordinary Entry](#ordinary-entry)'],
      ['Save authorized work', '[save](workbench/skills/save/SKILL.md)']
    ]));
    const before = snapshot(project);
    const resolved = resolveSkillPointers(policy, project);
    assert.equal(resolved.index, 'RUNBOOK.md#operations-index');
    assert.deepEqual(resolved.pointed.map(item => [item.skill, item.authority, item.operations, item.path]), [
      ['save', 'binding', ['Save authorized work'], 'workbench/skills/save/SKILL.md']
    ]);
    assert.deepEqual(resolved.unpointed.map(item => [item.skill, item.authority]), [['deploy-notes', 'teaching'], ['genesis', 'teaching']],
      'a room-added skill no row points to teaches, and so does a core skill only linked outside the index');
    assert.deepEqual(resolved.dangling, []);
    assert.deepEqual(codes(project), [], 'a resolved index adds no finding');
    assert.deepEqual(snapshot(project), before, 'resolution never writes');
  } finally { fs.rmSync(project, { recursive: true, force: true }); }
});

test('only the lane copy of a pointed skill is read, so a drifted installed copy loses', () => {
  const project = fixture();
  try {
    const lane = room(project);
    fs.writeFileSync(path.join(project, 'RUNBOOK.md'), index([['Save authorized work', '[save](workbench/skills/save/SKILL.md)']]));
    const installed = path.join(project, 'provider-home', '.claude', 'skills', 'save');
    fs.mkdirSync(installed, { recursive: true });
    fs.writeFileSync(path.join(installed, 'SKILL.md'), '# save, an installed copy that drifted\n');
    const [pointed] = resolveSkillPointers(policy, project).pointed;
    assert.equal(pointed.skill, 'save');
    assert.equal(pointed.path, 'workbench/skills/save/SKILL.md');
    assert.equal(pointed.contentHash, skillContentHash(path.join(lane, 'save')), 'the binding copy is the lane copy');
    assert.notEqual(pointed.contentHash, skillContentHash(installed), 'the drifted installed copy is not what binds');
    fs.writeFileSync(path.join(lane, 'save', 'SKILL.md'), '# save, edited in the lane\n');
    assert.equal(resolveSkillPointers(policy, project).pointed[0].contentHash, skillContentHash(path.join(lane, 'save')), 'a lane edit changes what binds');
  } finally { fs.rmSync(project, { recursive: true, force: true }); }
});

test('a pointer to a skill missing from the lane is reported by name as attention that blocks nothing', () => {
  const project = fixture();
  try {
    room(project);
    fs.writeFileSync(path.join(project, 'RUNBOOK.md'), index([
      ['Save authorized work', '[save](workbench/skills/save/SKILL.md)'],
      ['Write release notes', '[release-notes](workbench/skills/release-notes/SKILL.md)']
    ]));
    const resolved = resolveSkillPointers(policy, project);
    assert.deepEqual(resolved.pointed.map(item => item.skill), ['save']);
    assert.deepEqual(resolved.dangling.map(item => [item.skill, item.operation, item.pointer]), [
      ['release-notes', 'Write release notes', 'workbench/skills/release-notes/SKILL.md']
    ]);
    const findings = inspectSkills(policy, project);
    assert.deepEqual(findings.map(item => [item.code, item.severity, item.blocks, item.skill]), [['skill-pointer-dangling', 'attention', 'none', 'release-notes']]);
    assert.match(findings[0].message, /release-notes/);
  } finally { fs.rmSync(project, { recursive: true, force: true }); }
});

test('a room without an operations index resolves no pointer and reports nothing', () => {
  const project = fixture();
  try {
    room(project);
    assert.deepEqual(resolveSkillPointers(policy, project), { index: null, lane: 'workbench/skills', pointed: [], unpointed: [
      { skill: 'genesis', authority: 'teaching', path: 'workbench/skills/genesis/SKILL.md', contentHash: skillContentHash(path.join(project, 'workbench', 'skills', 'genesis')) },
      { skill: 'save', authority: 'teaching', path: 'workbench/skills/save/SKILL.md', contentHash: skillContentHash(path.join(project, 'workbench', 'skills', 'save')) }
    ], dangling: [] });
    fs.writeFileSync(path.join(project, 'RUNBOOK.md'), '# Runbook\n\nNo index here; [save](workbench/skills/save/SKILL.md) is only a link.\n');
    assert.deepEqual(resolveSkillPointers(policy, project).pointed, []);
    assert.deepEqual(codes(project), []);
  } finally { fs.rmSync(project, { recursive: true, force: true }); }
});

#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { inspectSkills, skillContentHash } from '../workbench/tools/skill-inspection.mjs';

const policy = { schemaVersion: 2, workbenchVersion: 'v3.1.4', skillPolicy: { required: ['genesis'], discovery: ['.agents/skills', '.claude/skills'] } };
function fixture() { return fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-skill-inspection-')); }
function seed(home, skill = 'genesis', override = {}) {
  const canonical = path.join(home, '.agents/skills', skill);
  fs.mkdirSync(canonical, { recursive: true });
  fs.writeFileSync(path.join(canonical, 'SKILL.md'), '# Isolated core fixture\n');
  const marker = { schemaVersion: 2, source: 'LLM Workbench core', release: 'v3.2.0', commit: 'a'.repeat(40), contentHash: skillContentHash(canonical), compatibleRooms: { minimum: 'v3.1.4', maximum: 'v3.2.0' }, ...override };
  fs.writeFileSync(path.join(canonical, '.workbench-skill.json'), JSON.stringify(marker));
  const adapter = path.join(home, '.claude/skills', skill);
  fs.mkdirSync(path.dirname(adapter), { recursive: true });
  fs.symlinkSync(path.relative(path.dirname(adapter), canonical), adapter, 'dir');
  return { canonical, adapter, marker };
}
function snapshot(directory) {
  return fs.readdirSync(directory).sort().flatMap(name => {
    const file = path.join(directory, name), stat = fs.lstatSync(file);
    return [[file, stat.mode, stat.isSymbolicLink() ? fs.readlinkSync(file) : stat.isFile() ? fs.readFileSync(file).toString('base64') : 'directory'], ...(stat.isDirectory() ? snapshot(file) : [])];
  });
}
const codes = (home, manifest = policy) => inspectSkills(manifest, home).map(item => item.code);

test('compatible differing releases and both range boundaries are read-only; outside releases are incompatible', () => {
  const home = fixture();
  try {
    seed(home);
    const before = snapshot(home);
    for (const version of ['v3.1.4', 'v3.2.0']) assert.deepEqual(codes(home, { ...policy, workbenchVersion: version }), []);
    for (const version of ['v3.1.3', 'v3.2.1']) assert.deepEqual(codes(home, { ...policy, workbenchVersion: version }), ['incompatible-core', 'incompatible-core']);
    assert.deepEqual(snapshot(home), before);
  } finally { fs.rmSync(home, { recursive: true, force: true }); }
});

test('missing and broken discovery entries remain visible without installing replacements', () => {
  const home = fixture();
  try {
    assert.deepEqual(codes(home), ['skill-missing', 'skill-missing']);
    const { adapter } = seed(home);
    fs.unlinkSync(adapter);
    assert.deepEqual(codes(home), ['skill-missing']);
    fs.symlinkSync('missing-target', adapter);
    const before = snapshot(home);
    assert.deepEqual(codes(home), ['skill-discovery-broken']);
    assert.deepEqual(snapshot(home), before);
  } finally { fs.rmSync(home, { recursive: true, force: true }); }
});

test('a marker cannot widen the supported contract beyond its baseline floor or producing release', () => {
  for (const range of [
    { minimum: 'v3.1.4', maximum: 'v9.0.0' },
    { minimum: 'v3.0.0', maximum: 'v3.2.0' },
    { minimum: 'v3.2.0', maximum: 'v3.1.4' }
  ]) {
    const home = fixture();
    try {
      seed(home, 'genesis', { compatibleRooms: range });
      const before = snapshot(home);
      assert.deepEqual(codes(home), ['skill-compatibility-unknown', 'skill-compatibility-unknown']);
      assert.deepEqual(snapshot(home), before);
    } finally { fs.rmSync(home, { recursive: true, force: true }); }
  }
});

test('unknown generation, undeclared compatibility and modified content are distinct', () => {
  for (const shape of ['generation', 'range', 'content']) {
    const home = fixture();
    try {
      const { canonical, marker } = seed(home);
      if (shape === 'generation') marker.commit = 'unknown';
      if (shape === 'range') delete marker.compatibleRooms;
      fs.writeFileSync(path.join(canonical, '.workbench-skill.json'), JSON.stringify(marker));
      if (shape === 'content') fs.appendFileSync(path.join(canonical, 'SKILL.md'), 'local change');
      const expected = { generation: 'skill-generation-unknown', range: 'skill-compatibility-unknown', content: 'skill-content-modified' }[shape];
      assert.deepEqual(codes(home), [expected, expected]);
    } finally { fs.rmSync(home, { recursive: true, force: true }); }
  }
});

test('separate implementations, extra Codex discovery and mixed global generations are diagnosed', () => {
  const home = fixture();
  try {
    const { canonical, adapter } = seed(home);
    fs.unlinkSync(adapter);
    fs.cpSync(canonical, adapter, { recursive: true });
    assert.ok(codes(home).includes('skill-source-conflict'));
    fs.rmSync(adapter, { recursive: true });
    fs.symlinkSync(path.relative(path.dirname(adapter), canonical), adapter, 'dir');
    fs.mkdirSync(path.join(home, '.codex/skills'), { recursive: true });
    fs.symlinkSync(canonical, path.join(home, '.codex/skills/genesis'), 'dir');
    assert.deepEqual(codes(home), ['skill-duplicate-discovery']);
    fs.rmSync(path.join(home, '.codex'), { recursive: true });
    seed(home, 'builder', { commit: 'b'.repeat(40) });
    assert.deepEqual(codes(home, { ...policy, skillPolicy: { ...policy.skillPolicy, required: ['genesis', 'builder'] } }), ['core-generation-conflict']);
  } finally { fs.rmSync(home, { recursive: true, force: true }); }
});

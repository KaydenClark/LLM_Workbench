#!/usr/bin/env node
// S-002H TK-003V: the domain-modeling skill is a required room skill by the
// owner's 2026-09-29 answer, but the v3.2.1 bundle identity is frozen, so the
// source is staged as an unreleased candidate inside its Spec until the release
// owner establishes a fresh bundle identity. This test pins three things:
//
// 1. the staged candidate's operating contract (the Workbench adaptation of
//    Matt Pocock's method: challenge, split, edge case, downstream
//    consequences, source cross-check and classification, owner routing, the
//    write boundary and the three-part ADR bar);
// 2. that nothing discovers it yet (no lane directory, no bundle or manifest
//    entry), so no room is told it can invoke the skill;
// 3. that the preserved pending source keeps its historical bytes.
//
// Structural checks cannot prove an agent interrupts at the right moment; the
// fresh-context scenarios in TK-003W carry that proof. When publication moves
// the source into `workbench/skills/domain-modeling/`, retarget this test to
// the lane path and join it to the AGENTS full suite (S-002H Dependencies).
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { coreSkills } from '../workbench/tools/workbench-layout.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const specDir = path.join(root, 'workbench', 'specs', 'S-002H-domain-modeling-skill');
const candidateDir = path.join(specDir, 'candidate', 'domain-modeling');
const candidate = path.join(candidateDir, 'SKILL.md');
const pendingDir = path.join(root, 'skills-pending', 'domain-modeling');
// sha256 over sorted "name\0bytes\0" of skills-pending/domain-modeling at
// integration 2780fe66 (git tree 028a0e44).
const pendingDigest = '9c70797062c1017367293905782a5a3a6b8f3ea85148abc172996a8de3f60071';
const upstreamRevision = 'd81f3a183412e71a5b1e84ca21bc1a35eea03a60';

function read(file) {
  assert.ok(fs.existsSync(file), `missing ${path.relative(root, file)}`);
  return fs.readFileSync(file, 'utf8');
}
function frontmatter(text) {
  const match = /^---\n([\s\S]*?)\n---\n/.exec(text);
  assert.ok(match, 'candidate SKILL.md must open with YAML frontmatter');
  return Object.fromEntries(match[1].split('\n').map((line) => {
    const at = line.indexOf(':');
    return [line.slice(0, at).trim(), line.slice(at + 1).trim()];
  }));
}
function section(text, heading) {
  const start = text.indexOf(`\n## ${heading}\n`);
  assert.ok(start >= 0, `candidate needs a "## ${heading}" section`);
  const next = text.indexOf('\n## ', start + 4);
  return text.slice(start, next < 0 ? text.length : next);
}
function contains(text, patterns, label) {
  for (const pattern of patterns) assert.match(text, pattern, `${label}: ${pattern}`);
}

test('the staged candidate declares itself as the unreleased domain-modeling skill', () => {
  const text = read(candidate);
  const meta = frontmatter(text);
  assert.equal(meta.name, 'domain-modeling');
  assert.ok(meta.description && meta.description.length > 40, 'a one-line discovery description');
  assert.doesNotMatch(meta.description, /GLOSSARY|CONTEXT\.md/, 'description names no upstream glossary root');
  contains(section(text, 'Status'), [
    /unreleased/i,
    /required room skill/i,
    /S-002H/,
    /not (?:yet )?(?:installed|discoverable)/i
  ], 'status');
});

test('the active moves challenge, split, probe an edge case and trace downstream consequences', () => {
  const moves = section(read(candidate), 'The active moves');
  contains(moves, [
    /conflict/i,
    /accepted (?:meaning|definition)/i,
    /overloaded/i,
    /edge case/i,
    /downstream/i,
    /before (?:the|an?) (?:upstream )?(?:name|choice)[^.]*settles/i,
    /(?:Spec|acceptance)[^.]*(?:source|identifier)[^.]*test/i,
    /one (?:substantive )?(?:owner )?question at a time/i
  ], 'active moves');
});

test('a behavior claim is checked against source and classified without either side winning silently', () => {
  const check = section(read(candidate), 'Check claims against source');
  contains(check, [
    /source/i,
    /tests?/i,
    /documentation drift/i,
    /implementation gap/i,
    /unresolved/i,
    /ambigu/i,
    /(?:quote|link|name)[^.]*(?:source|file)/i
  ], 'classification');
});

test('settled meaning routes to existing Workbench owners, never a new glossary root', () => {
  const text = read(candidate);
  const routing = section(text, 'Where settled meaning goes');
  contains(routing, [/LEXICON\.md/, /Spec/, /Wiki/, /ADR/, /manifest/i, /adr\.mjs new/], 'routing');
  assert.match(routing, /(?:no|never|do not)[^.]*(?:GLOSSARY|CONTEXT)/i, 'refuses upstream glossary roots');
  assert.doesNotMatch(text, /create (?:a |the )?(?:root )?`?(?:GLOSSARY|CONTEXT)(?:-MAP)?\.md`? (?:lazily|when)/i,
    'no instruction to create an upstream glossary file');
  assert.doesNotMatch(text, /docs\/adr\/0001-/, 'no upstream ADR path');
});

test('the write boundary separates an authorized edit from a grilling-only confirmation', () => {
  const boundary = section(read(candidate), 'Write boundary');
  contains(boundary, [
    /authorized (?:documentation|delivery)/i,
    /inline/i,
    /grilling-only|read-only/i,
    /pending/i,
    /correction/i,
    /confirm/i,
    /no Canon (?:write|edit)/i,
    /(?:confirmation|confirming)[^.]*(?:never|not|does not)[^.]*(?:permission|authori[sz])/i
  ], 'write boundary');
});

test('an ADR is offered only when all three tests pass and records why, not the rule', () => {
  const adr = section(read(candidate), 'Offer ADRs sparingly');
  contains(adr, [
    /all three/i,
    /revers/i,
    /surpris/i,
    /(?:genuine|real) (?:alternatives|trade-?off)/i,
    /(?:any|one) (?:of the three )?(?:is )?(?:missing|fails)/i,
    /binding (?:rule|requirement)/i,
    /(?:control|Spec)/
  ], 'ADR filter');
});

test('attribution names the upstream source, the pinned revision and the repository notice', () => {
  const attribution = section(read(candidate), 'Attribution');
  contains(attribution, [/mattpocock\/skills/, new RegExp(upstreamRevision), /THIRD_PARTY_NOTICES\.md/, /MIT/], 'attribution');
});

test('nothing discovers the staged candidate yet', () => {
  assert.equal(fs.existsSync(path.join(root, 'workbench', 'skills', 'domain-modeling')), false,
    'publication into the lane waits for a fresh bundle identity');
  assert.equal(coreSkills.includes('domain-modeling'), false, 'not in the layout bundle');
  const manifest = JSON.parse(read(path.join(root, 'workbench', 'manifest.json')));
  assert.equal(manifest.skillPolicy.required.includes('domain-modeling'), false, 'not in the required policy');
  for (const link of ['.claude/skills', '.agents/skills']) {
    const target = path.join(root, link, 'domain-modeling');
    assert.equal(fs.existsSync(target), false, `${link} must not resolve domain-modeling`);
  }
});

test('the preserved pending source keeps its historical bytes', () => {
  const hash = crypto.createHash('sha256');
  for (const name of fs.readdirSync(pendingDir).sort()) {
    hash.update(`${name}\0`);
    hash.update(fs.readFileSync(path.join(pendingDir, name)));
    hash.update('\0');
  }
  assert.equal(hash.digest('hex'), pendingDigest, 'skills-pending/domain-modeling changed');
});

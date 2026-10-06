#!/usr/bin/env node
// S-004J TK-006U: scoped contract checks for the independent staged source.
// Adapted from test-domain-modeling-candidate.mjs at input e3e0b5f0.
// Distribution, routing and release identity wait on their shared writer slot;
// this candidate must remain outside the managed lane and both adapters.
// These assertions check source wording, provenance and non-discovery only.
// Fresh-context conversation scenarios remain unrun and required in TK-006U;
// neither these checks nor inherited S-002H trials complete that proof.
// The RUNBOOK full suite is unchanged and does not include this scoped check.
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { coreSkills } from '../workbench/tools/workbench-layout.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const candidateDir = path.join(root, 'workbench', 'specs',
  'S-004J-required-domain-modeling-skill', 'candidate', 'domain-modeling');
const candidate = path.join(candidateDir, 'SKILL.md');
const pendingDir = path.join(root, 'skills-pending', 'domain-modeling');
// Preserve the input test's sha256 over sorted "name\0bytes\0" of the pending
// source at integration 2780fe66 (git tree 028a0e44); do not bless new bytes.
const pendingDigest = '9c70797062c1017367293905782a5a3a6b8f3ea85148abc172996a8de3f60071';
const upstreamRevision = 'd81f3a183412e71a5b1e84ca21bc1a35eea03a60';
const inputRevision = 'e3e0b5f068bff80861d68c254441b2c94d7015fb';
const inheritedSourceRevision = '84779a9058727c40db9c0077f5c19f3bd1b42a5e';

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
function section(text, headings) {
  const choices = Array.isArray(headings) ? headings : [headings];
  const start = choices.map((heading) => text.indexOf(`\n## ${heading}\n`))
    .find((index) => index >= 0);
  assert.ok(start !== undefined, `candidate needs a "## ${choices[0]}" section`);
  const next = text.indexOf('\n## ', start + 4);
  return text.slice(start, next < 0 ? text.length : next).replace(/\s+/g, ' ');
}
function contains(text, patterns, label) {
  for (const pattern of patterns) assert.match(text, pattern, `${label}: ${pattern}`);
}

test('the staged source stays publishable without claiming installation', () => {
  const text = read(candidate);
  const meta = frontmatter(text);
  assert.equal(meta.name, 'domain-modeling');
  assert.ok(meta.description && meta.description.length > 40, 'a one-line discovery description');
  assert.doesNotMatch(meta.description, /GLOSSARY|CONTEXT\.md/, 'no upstream glossary root');
  assert.doesNotMatch(text, /S-004J|workbench\/specs\//, 'no room-specific staging path in the skill');
  assert.doesNotMatch(text, /(?:is|already) (?:installed|discoverable) in every room/i,
    'source presence must not claim managed availability');
});

test('active modeling retains conflicts, overloaded terms, concrete edge cases and one-question rhythm', () => {
  const moves = section(read(candidate), 'The active moves');
  contains(moves, [
    /Challenge a conflict immediately/i,
    /word is used against its accepted meaning/i,
    /existing meaning[^.]*new use[^.]*separate concepts/i,
    /Split an overloaded word/i,
    /propose distinct candidate names/i,
    /Probe a relationship with an edge case/i,
    /Invent a concrete scenario/i,
    /scenario[^.]*not evidence/i,
    /one substantive owner question at a time/i,
    /grilling[^.]*pending-readback rhythm/i
  ], 'active moves');
});

test('the bounded upstream trace names owners, acceptance, identifiers, tests and concrete consequences', () => {
  const moves = section(read(candidate), 'The active moves');
  contains(moves, [
    /before an upstream name, boundary or relationship settles/i,
    /Lexicon entries[^.]*Specs and acceptance lines[^.]*source identifiers[^.]*tests[^.]*decision records[^.]*Wiki/i,
    /what each would have to change or would silently mean/i,
    /few consequences[^.]*change the choice[^.]*file or line behind each/i,
    /bounded trace[^.]*not an audit of the whole room/i
  ], 'downstream trace');
});

test('source cross-check distinguishes agreement, drift, gap and unresolved contradiction', () => {
  const check = section(read(candidate), 'Check claims against source');
  contains(check, [
    /check the named source and tests before agreeing/i,
    /(?:quote|link) the file behind any contradiction/i,
    /Agreement[^.]*accepted meaning and verified source/i,
    /Documentation drift[^.]*source is newer/i,
    /Implementation gap[^.]*Canon is newer[^.]*assigned Spec/i,
    /Unresolved contradiction[^.]*ordering is ambiguous/i,
    /proposed design is not an accepted requirement/i
  ], 'classification');
});

test('settled meanings route once to existing owners through promotion or scoped Task work', () => {
  const routing = section(read(candidate), 'Where settled meaning goes');
  contains(routing, [
    /locked and confirmed/i,
    /promotion or scoped Task work/i,
    /Shared term[^.]*LEXICON\.md/,
    /Capability-local meaning and acceptance[^.]*SPEC\.md/,
    /Durable explanation[^.]*Wiki[^.]*MEMORY\.md/,
    /Qualifying decision rationale[^.]*ADR or DDR/,
    /Route each settled result once/i
  ], 'routing');
});

test('Align writes no Canon and never edits an owning definition inline from modeling', () => {
  const boundary = section(read(candidate), 'Write boundary');
  assert.doesNotMatch(boundary, /edit the owning document inline as soon as a meaning settles/i,
    'the inherited inline Canon directive must be removed');
  contains(boundary, [
    /Align[^.]*no Canon (?:write|edit)/i,
    /never[^.]*inline[^.]*modeling conversation/i,
    /Lexicon[^.]*Spec[^.]*control[^.]*decision record/i,
    /(?:confirmation|confirming)[^.]*(?:never|not|does not)[^.]*(?:permission|authori[sz])/i,
    /No skill invocation[^.]*enlarges the request/i
  ], 'Align boundary');
});

test('pending meaning stays in objective working context and locked confirmation hands off to current owners', () => {
  const boundary = section(read(candidate), 'Write boundary');
  contains(boundary, [
    /pending interpretations[^.]*open questions[^.]*objective's notepad or its question card/i,
    /Lexicon holds settled meaning only/i,
    /locked and confirmed[^.]*ordinary promotion route or scoped Task/i,
    /current owners/i,
    /unresolved contradiction stays explicitly unresolved/i
  ], 'pending and handoff');
});

test('no parallel terminology, context-map or decision-record store is created', () => {
  const routing = section(read(candidate), 'Where settled meaning goes');
  contains(routing, [
    /Never create[^.]*GLOSSARY\.md[^.]*CONTEXT\.md[^.]*UBIQUITOUS_LANGUAGE\.md/i,
    /Never create[^.]*context map[^.]*local `docs\/adr\/`[^.]*parallel store/i
  ], 'parallel stores');
  assert.deepEqual(fs.readdirSync(candidateDir).sort(), ['SKILL.md'], 'stage no companion glossary or local ADR store');
});

test('decision-record offers require all three tests and name a failed test', () => {
  const decision = section(read(candidate), ['Offer decision records sparingly', 'Offer ADRs sparingly']);
  contains(decision, [
    /only when all three are true/i,
    /Hard to reverse[^.]*meaningful cost/i,
    /Surprising without context[^.]*later reader/i,
    /real trade-off[^.]*genuine alternatives/i,
    /any of the three is missing[^.]*say which test failed/i,
    /Offering is not writing/i
  ], 'decision-record filter');
});

test('ADR or DDR follows the architecture-rebuild scope test and Map/to-docs/manifest-aware tooling', () => {
  const decision = section(read(candidate), ['Offer decision records sparingly', 'Offer ADRs sparingly']);
  contains(decision, [
    /would (?:the|this) choice still hold if the architecture were rebuilt differently\?/i,
    /yes[^.]*DDR[^.]*destination/i,
    /no[^.]*ADR[^.]*architectur/i,
    /both records[^.]*linked/i,
    /at Map[^.]*`to-docs`[^.]*manifest-aware[^.]*`adr\.mjs`/i,
    /adr\.mjs new --title/,
    /adr\.mjs new --kind ddr --title/,
    /binding rule[^.]*owning control or Spec/i
  ], 'decision-record scope and writing');
});

test('grilling and the question-card flow can finish without this optional companion', () => {
  const text = read(candidate).replace(/\s+/g, ' ');
  contains(text, [
    /owner or a caller invokes it/i,
    /optional companion/i,
    /grilling and the destination-question-card flow (?:can )?complete without it/i
  ], 'optional composition');
});

test('attribution preserves the pinned MIT source and exact inherited authorship', () => {
  const attribution = section(read(candidate), 'Attribution');
  contains(attribution, [
    /Matt Pocock/, /mattpocock\/skills/, new RegExp(upstreamRevision), /MIT/,
    /THIRD_PARTY_NOTICES\.md/, new RegExp(inheritedSourceRevision), new RegExp(inputRevision),
    /r <r@example\.com>/,
    /Co-Authored-By: Claude Opus 5\.5 <noreply@anthropic\.com>/
  ], 'attribution and inherited provenance');
  contains(read(path.join(root, 'THIRD_PARTY_NOTICES.md')), [
    /## mattpocock\/skills/, /MIT License/, /Copyright \(c\) 2026 Matt Pocock/,
    /Permission is hereby granted/, /THE SOFTWARE IS PROVIDED "AS IS"/
  ], 'preserved license route');
});

test('nothing discovers the staged candidate through the lane, bundle, required policy or adapters', () => {
  assert.equal(fs.existsSync(path.join(root, 'workbench', 'skills', 'domain-modeling')), false,
    'managed publication waits for its writer slot and release identity');
  assert.equal(coreSkills.includes('domain-modeling'), false, 'not in the layout bundle');
  const manifest = JSON.parse(read(path.join(root, 'workbench', 'manifest.json')));
  assert.equal(manifest.skillPolicy.required.includes('domain-modeling'), false, 'not in the required policy');
  for (const link of ['.claude/skills', '.agents/skills']) {
    assert.equal(manifest.skillPolicy.discovery.includes(link), true, 'check both configured adapters');
    const target = path.join(root, link, 'domain-modeling');
    assert.equal(fs.existsSync(target), false, `${link} must not resolve domain-modeling`);
    assert.equal(fs.existsSync(path.dirname(target)) && fs.readdirSync(path.dirname(target)).includes('domain-modeling'), false,
      `${link} must not carry a dangling domain-modeling entry`);
  }
});

test('the protected pending source preserves the inherited exact digest', () => {
  const hash = crypto.createHash('sha256');
  for (const name of fs.readdirSync(pendingDir).sort()) {
    hash.update(`${name}\0`);
    hash.update(fs.readFileSync(path.join(pendingDir, name)));
    hash.update('\0');
  }
  assert.equal(hash.digest('hex'), pendingDigest, 'skills-pending/domain-modeling changed');
});

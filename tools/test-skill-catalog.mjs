#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillsRoot = path.join(root, 'skills');
const pendingSkillsRoot = path.join(root, 'skills-pending');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const assertIncludesAll = (content, requiredTerms, label) => {
  for (const term of requiredTerms) {
    assert.ok(content.includes(term), `${label} must use ${term}`);
  }
};

const catalog = read('skills/README.md');
const catalogRegion = catalog.match(
  /<!-- selected-skills:start -->([\s\S]*?)<!-- selected-skills:end -->/
);
assert.ok(catalogRegion, 'skills/README.md must contain the selected-skills catalog');

const rows = catalogRegion[1]
  .split('\n')
  .filter((line) => /^\| `[^`]+` \|/.test(line))
  .map((line) => {
    const cells = line.split('|').map((cell) => cell.trim());
    return {
      name: cells[1].replaceAll('`', ''),
      definition: cells[2],
      lane: cells[3],
      availability: cells[4]
    };
  });

assert.equal(rows.length, 32, 'the owner-selected catalog must contain 32 skills');
assert.equal(new Set(rows.map((row) => row.name)).size, rows.length,
  'the selected skill catalog must not contain duplicate names');
for (const row of rows) {
  assert.ok(row.definition.length >= 20, `${row.name} needs a useful definition`);
  assert.match(row.lane, /^(Native|Core rewrite|Supporting rewrite|Reference)$/,
    `${row.name} needs a recognized rewrite lane`);
  assert.match(row.availability, /^(Active|Pending rewrite)$/,
    `${row.name} needs an explicit discovery availability`);
}

const catalogNames = rows.map((row) => row.name).sort();
const activeNames = rows.filter((row) => row.availability === 'Active')
  .map((row) => row.name).sort();
const pendingNames = rows.filter((row) => row.availability === 'Pending rewrite')
  .map((row) => row.name).sort();
const directoryNames = fs.readdirSync(skillsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() || entry.isSymbolicLink())
  .map((entry) => entry.name)
  .sort();
const pendingDirectoryNames = fs.readdirSync(pendingSkillsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() || entry.isSymbolicLink())
  .map((entry) => entry.name)
  .sort();
assert.deepEqual(directoryNames, activeNames,
  'live discovery must contain exactly the active selected skills');
assert.deepEqual(pendingDirectoryNames, pendingNames,
  'pending source folders must contain exactly the selected skills awaiting rewrite');
assert.deepEqual([...directoryNames, ...pendingDirectoryNames].sort(), catalogNames,
  'active and pending source folders together must preserve the 32-skill owner catalog');

for (const name of activeNames) {
  assert.ok(fs.existsSync(path.join(skillsRoot, name, 'SKILL.md')),
    `${name} must contain a live SKILL.md`);
}
for (const name of pendingNames) {
  assert.ok(fs.existsSync(path.join(pendingSkillsRoot, name, 'SKILL.md')),
    `${name} must preserve its pending source`);
}

assert.ok(catalogNames.includes('ask-workbench'), 'the Workbench router must be selected');
for (const required of ['adoption', 'genesis', 'sitrep', 'to-docs', 'to-spec']) {
  assert.ok(catalogNames.includes(required), `${required} must be selected`);
}
for (const removed of ['ask-matt', 'claude-handoff', 'qa', 'triage']) {
  assert.ok(!catalogNames.includes(removed), `${removed} must not remain in the curated surface`);
}
assert.ok(!catalogNames.includes('grill-with-docs'),
  'grill-with-docs must be retired in favor of grilling followed by to-docs');

const importedNotice = read('THIRD_PARTY_NOTICES.md');
assertIncludesAll(importedNotice, [
  'Copyright (c) 2026 Matt Pocock',
  'Permission is hereby granted, free of charge, to any person obtaining a copy',
  'THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND'
], 'THIRD_PARTY_NOTICES.md');
assert.match(catalog, /\[tracked third-party notice\]\(\.\.\/THIRD_PARTY_NOTICES\.md\)/,
  'skill provenance must link the tracked upstream license notice');

const forbiddenLivePatterns = [
  /CONTEXT\.md/,
  /docs\/agents/,
  /\.scratch\//,
  /docs\/adr/,
  /\bADR'?s?\b/i,
  /\bissue tracker\b/i,
  /UBIQUITOUS_LANGUAGE\.md/,
  /learning-records\//
];
for (const name of activeNames) {
  const skill = read(`skills/${name}/SKILL.md`);
  for (const pattern of forbiddenLivePatterns) {
    assert.doesNotMatch(skill, pattern,
      `${name} must not expose unfinished parallel truth-routing instructions`);
  }
}

for (const relative of ['LEXICON.md', 'templates/LEXICON.md']) {
  const lexicon = read(relative);
  assert.match(lexicon, /^# .*Lexicon/m, `${relative} must identify itself as a lexicon`);
  assert.match(
    lexicon,
    /\*\*Design concept\*\*.*shared understanding between the parties working on a project about what that project is/is,
    `${relative} must preserve the owner's definition of design concept`
  );
}

const toTickets = read('skills/to-tickets/SKILL.md');
for (const forbidden of [
  '.scratch/',
  'configured tracker',
  'setup-matt-pocock-skills',
  'GitHub, Linear',
  'local-ticket-template'
]) {
  assert.ok(!toTickets.includes(forbidden),
    `to-tickets must not retain the imported ${forbidden} workflow`);
}
assertIncludesAll(toTickets, [
  'assigned `SPEC.md`',
  '`Vertical Implementation Slices`',
  '`RUNBOOK.md`',
  'node tools/spec-workbench.mjs render',
  'node tools/spec-workbench.mjs doctor'
], 'to-tickets');
assert.match(toTickets, /`TASKBOARD\.md` is a generated\s+projection/,
  'to-tickets must treat TASKBOARD.md as a generated projection');

const grilling = read('skills/grilling/SKILL.md');
const grillMe = read('skills/grill-me/SKILL.md');
const grillingBundle = `${grilling}\n${grillMe}`;

for (const [pattern, label] of [
  [/\/domain-modeling/, 'imported domain-modeling invocation'],
  [/CONTEXT\.md/, 'parallel context file'],
  [/docs\/agents/, 'parallel agent configuration'],
  [/docs\/adr/, 'parallel decision directory'],
  [/\bADR'?s?\b/i, 'parallel ADR layer'],
  [/\btracker\b/i, 'parallel tracker layer'],
  [/\bglossary\b/i, 'parallel glossary layer']
]) {
  assert.doesNotMatch(grillingBundle, pattern,
    `the grilling flow must not depend on a ${label}`);
}

assert.match(grilling, /Grill the user relentlessly/,
  'grilling must preserve its relentless leading behavior');
assert.match(grilling, /each branch of the decision tree/,
  'grilling must resolve the decision tree branch by branch');
assert.match(grilling, /For each question, provide your recommended answer/,
  'grilling must attach a recommendation to every question');
assert.match(grilling, /questions one at a time, waiting for feedback/,
  'grilling must ask one question and wait before continuing');
assert.match(grilling, /fact can be found by exploring the environment/,
  'grilling must research discoverable facts');
assert.match(grilling, /decisions, though, are mine/,
  'grilling must leave owner decisions to the user');
assert.match(grilling, /Do not act on it until I confirm/,
  'grilling must wait for confirmation before acting');
assert.match(grilling, /notepad/,
  'grilling must keep a running notepad');
assert.match(grilling, /\.agents\/grilling diary/,
  'grilling must store the notepad in the grilling diary folder');
assert.match(grilling, /\/make-it-so/,
  'grilling must end via the make-it-so skill instead of a bare passphrase');
assert.match(grilling, /\/checkpoint/,
  'grilling must offer the checkpoint save-exit');

assert.match(grillMe, /Run a `\/grilling` session\./,
  'grill-me must remain a thin grilling wrapper');
assert.doesNotMatch(grillingBundle, /Desktop chat|voice|terminal|\bCLI\b/i,
  'the grilling flow must remain runtime-agnostic');

const makeItSo = read('skills/make-it-so/SKILL.md');
assertIncludesAll(makeItSo, [
  'notepad',
  '`to-docs`',
  '`to-spec`',
  '`to-tickets`',
  '`TASKBOARD.md`',
  '`/implement`',
  'STATUS: PROMOTED'
], 'make-it-so');
assert.match(
  makeItSo,
  /`to-docs`[\s\S]*`to-spec`[\s\S]*`to-tickets`[\s\S]*Commit and push the promoted[\s\S]*`\/implement`[\s\S]*STATUS: PROMOTED/,
  'make-it-so must promote, decompose, push the plan, implement, and then close in that order'
);
assert.match(makeItSo, /invoke it explicitly/i,
  'make-it-so must be an explicit invocation, not a passphrase');
assert.match(makeItSo, /authorizes durable planning, implementation, and remote\s+checkpoints/,
  'make-it-so must authorize implementation with remote checkpoints');
assert.match(makeItSo, /pushed commit, never\s+local-only progress/,
  'make-it-so must forbid yielding with local-only progress');

const brainstorm = read('skills/brainstorm/SKILL.md');
assertIncludesAll(brainstorm, [
  'Run a `/grilling` session',
  'counter-argument',
  'Do NOT promote'
], 'brainstorm');

const checkpoint = read('skills/checkpoint/SKILL.md');
assertIncludesAll(checkpoint, [
  'notepad',
  'resume',
  '`/make-it-so`'
], 'checkpoint');
assert.match(checkpoint, /PAUSED/,
  'checkpoint must mark the notepad paused for resume');

const toDocs = read('skills/to-docs/SKILL.md');
assertIncludesAll(toDocs, [
  'settled conversation',
  '`LEXICON.md`',
  '`BLUEPRINT.md`',
  'assigned `SPEC.md`',
  '`RUNBOOK.md`',
  '`README.md`',
  '`AGENTS.md`',
  'node tools/spec-workbench.mjs render',
  'node tools/spec-workbench.mjs doctor'
], 'to-docs');
assert.doesNotMatch(toDocs, /ask (the )?user|interview the user|create a second|issue tracker/i,
  'to-docs must persist settled truth without restarting discovery or adding stores');

const sitrep = read('skills/sitrep/SKILL.md');
assertIncludesAll(sitrep, [
  'conversation-only',
  'read-only',
  'smallest sufficient scope',
  'Scout',
  'no durable artifact'
], 'sitrep');

const toSpec = read('skills/to-spec/SKILL.md');
assertIncludesAll(toSpec, [
  'already-settled conversation',
  'stable `specs/S-###-slug/SPEC.md`',
  'Vertical Implementation Slices',
  'node tools/spec-workbench.mjs render',
  'node tools/spec-workbench.mjs doctor'
], 'to-spec');
for (const forbidden of ['issue tracker', 'setup-matt-pocock-skills', 'ready-for-agent']) {
  assert.ok(!toSpec.includes(forbidden), `to-spec must not retain ${forbidden}`);
}

const genesis = read('skills/genesis/SKILL.md');
assertIncludesAll(genesis, [
  '`templates/GENESIS.md`',
  'greenfield',
  'founding prompt',
  'private remote',
  '`integration`',
  'commit and push'
], 'genesis');

const adoption = read('skills/adoption/SKILL.md');
assertIncludesAll(adoption, [
  '`templates/ADOPTION.md`',
  'one-time',
  'existing project',
  '`/update-harness`',
  'private remote',
  'commit and push'
], 'adoption');

const router = read('skills/ask-workbench/SKILL.md');
assertIncludesAll(router, [
  'new greenfield project',
  '`/genesis`',
  'existing project adopts the Workbench for the first time',
  '`/adoption`',
  'routine harness update',
  '`/update-harness`'
], 'ask-workbench');

for (const name of ['implement', 'code-review']) {
  assert.equal(
    rows.find((row) => row.name === name)?.availability,
    'Active',
    `${name} must remain active with its TK-009 Workbench rewrite`
  );
}

const implement = read('skills/implement/SKILL.md');
assertIncludesAll(implement, [
  'assigned stable `SPEC.md`',
  'one eligible ticket',
  'node tools/spec-workbench.mjs next --json',
  'node tools/spec-workbench.mjs show S-###',
  'node tools/spec-workbench.mjs claim S-### --agent NAME',
  'red/green/refactor',
  'project-owned verification',
  'owning documentation',
  'node tools/spec-workbench.mjs close S-###',
  'truthful checkpoint',
  'commit and push',
  '`integration`'
], 'implement');

const codeReview = read('skills/code-review/SKILL.md');
assertIncludesAll(codeReview, [
  'fixed diff',
  '`BASE_SHA`',
  '`HEAD_SHA`',
  'git diff --no-ext-diff --no-textconv "$BASE_SHA" "$HEAD_SHA" --',
  'nearest `AGENTS.md`',
  'assigned stable `SPEC.md`',
  'Findings first',
  'review-only',
  'separately authorized'
], 'code-review');

for (const [pattern, label] of [
  [/CONTEXT\.md/, 'parallel context file'],
  [/docs\/agents/, 'parallel agent configuration'],
  [/\.scratch\//, 'scratch truth store'],
  [/\bADR'?s?\b/i, 'parallel decision record'],
  [/\bPRD\b/i, 'parallel requirements record'],
  [/\btracker\b/i, 'parallel work tracker'],
  [/\bproof store\b/i, 'parallel proof store']
]) {
  assert.doesNotMatch(`${implement}\n${codeReview}`, pattern,
    `the delivery pair must not depend on a ${label}`);
}

assertIncludesAll(router, [
  '`/implement`',
  '`/code-review`',
  'to-tickets -> implement -> code-review'
], 'ask-workbench delivery flow');

for (const name of pendingNames) {
  assert.ok(!router.includes(`/${name}`),
    `ask-workbench must not route users to pending skill ${name}`);
}

const updateHarness = read('skills/update-harness/SKILL.md');
assert.match(updateHarness, /\/Users\/kayden\/GPT_OS\/Workbench Factory/,
  'update-harness must use the canonical Workbench Factory path');
assert.doesNotMatch(updateHarness, /\/Users\/kayden\/GPT_OS\/workbench templates/,
  'update-harness must not use the compatibility alias as canonical source');

for (const relative of ['skills/sitrep/SKILL.md', 'skills/to-docs/SKILL.md']) {
  const content = read(relative);
  assert.ok(content.endsWith('\n') && !content.endsWith('\n\n'),
    `${relative} must end with exactly one newline`);
}

console.log('ok - selected active/pending skill catalog, licenses, routing, and lexicon are aligned');
await import('./test-delivery-skills.mjs');

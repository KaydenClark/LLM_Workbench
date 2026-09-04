#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillsRoot = path.join(root, 'skills');
const archivedSkillsRoot = path.join(root, 'skills-archive', 'optional-active-2026-09-01');
const coreSkills = [
  'adoption', 'checkpoint', 'code-review', 'genesis', 'grilling', 'implement',
  'make-it-so', 'to-docs', 'to-spec', 'to-tickets', 'tracer-bullet', 'update-harness'
].sort();
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const assertIncludesAll = (content, requiredTerms, label) => {
  for (const term of requiredTerms) {
    assert.ok(content.includes(term), `${label} must use ${term}`);
  }
};
const directoryNames = (directory) => fs.readdirSync(directory, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const catalog = read('skills/README.md');
const catalogRegion = catalog.match(
  /<!-- core-skills:start -->([\s\S]*?)<!-- core-skills:end -->/
);
assert.ok(catalogRegion, 'skills/README.md must declare the closed core-skill bundle');
const catalogNames = catalogRegion[1]
  .split('\n')
  .filter((line) => /^\| `[^`]+` \|/.test(line))
  .map((line) => line.split('|')[1].trim().replaceAll('`', ''))
  .sort();

assert.deepEqual(catalogNames, coreSkills,
  'the documented source bundle must contain exactly the locked 12 skills');
assert.deepEqual(directoryNames(skillsRoot), coreSkills,
  'live discovery source must contain exactly the locked 12 skills');
for (const skill of coreSkills) {
  const source = path.join(skillsRoot, skill, 'SKILL.md');
  assert.ok(fs.statSync(source).isFile(), `${skill} must contain SKILL.md`);
  assert.match(read(`skills/${skill}/SKILL.md`), /^---\nname: /,
    `${skill} must retain skill frontmatter`);
}

assert.deepEqual(directoryNames(archivedSkillsRoot), [
  'ask-workbench', 'brainstorm', 'grill-me', 'sitrep', 'writing-great-skills'
], 'optional active skills must be retained outside the live discovery source');
assert.doesNotMatch(catalog, /KaydenClark\/skills/,
  'the portable bundle must not depend on Kayden private skills');
assert.match(catalog, /presence-only/i,
  'the catalog must explain normal setup without content replacement');
assert.match(catalog, /\.agents\/skills/,
  'the catalog must document the Codex user-scoped discovery root');
assert.match(catalog, /\.claude\/skills/,
  'the catalog must document the Claude user-scoped discovery root');

const importedNotice = read('THIRD_PARTY_NOTICES.md');
assertIncludesAll(importedNotice, [
  'Copyright (c) 2026 Matt Pocock',
  'Permission is hereby granted, free of charge, to any person obtaining a copy',
  'THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND'
], 'THIRD_PARTY_NOTICES.md');

const forbiddenLivePatterns = [
  /CONTEXT\.md/,
  /docs\/agents/,
  /\.scratch\//,
  /\bissue tracker\b/i,
  /UBIQUITOUS_LANGUAGE\.md/,
  /learning-records\//,
  /\.agents\/grilling diary/,
  /(?<![\w/])tools\/(?:spec-workbench|workbench-layout|adr|wiki|sessions|diagnostics)\.mjs/,
  /workbench\/grilling\b/,
  /workbench\/handoffs\b/
];
for (const name of coreSkills) {
  const skill = read(`skills/${name}/SKILL.md`);
  for (const pattern of forbiddenLivePatterns) {
    assert.doesNotMatch(skill, pattern,
      `${name} must not expose retired paths or parallel truth-routing instructions`);
  }
  // Decision records are first-class in v3.1, but only through the
  // manifest-declared collection, never a parallel docs tree.
  if (/\bADR'?s?\b/i.test(skill)) assert.match(skill, /workbench\/docs\/adr/, `${name} may name ADRs only through the manifest adr collection`);
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
  'node workbench/tools/spec-workbench.mjs render',
  'node workbench/tools/spec-workbench.mjs doctor'
], 'to-tickets');
assert.match(toTickets, /`TASKBOARD\.md` is a generated\s+projection/,
  'to-tickets must treat TASKBOARD.md as a generated projection');

const grilling = read('skills/grilling/SKILL.md');
for (const [pattern, label] of [
  [/\/domain-modeling/, 'imported domain-modeling invocation'],
  [/CONTEXT\.md/, 'parallel context file'],
  [/docs\/agents/, 'parallel agent configuration'],
  [/\btracker\b/i, 'parallel tracker layer'],
  [/\bglossary\b/i, 'parallel glossary layer']
]) {
  assert.doesNotMatch(grilling, pattern, `grilling must not depend on a ${label}`);
}
assertIncludesAll(grilling, [
  'workbench/sessions/grilling',
  'untracked',
  'Grill the user relentlessly',
  'each branch of the decision tree',
  'For each question, provide your recommended answer',
  'questions one at a time, waiting for feedback',
  'fact can be found by exploring the environment',
  'decisions, though, are mine',
  'Do not act on it until I confirm',
  'notepad',
  '/make-it-so',
  '/checkpoint'
], 'grilling');

const makeItSo = read('skills/make-it-so/SKILL.md');
assertIncludesAll(makeItSo, [
  'workbench/sessions/grilling',
  'workbench/sessions/checkpoints',
  'workbench/docs/adr',
  'only when warranted',
  'notepad',
  '`to-docs`',
  '`to-spec`',
  '`to-tickets`',
  '`TASKBOARD.md`',
  '`/implement`',
  'STATUS: PROMOTED'
], 'make-it-so');
assert.match(makeItSo, /pushed commit, never\s+local-only progress/,
  'make-it-so must forbid yielding with local-only progress');

const checkpoint = read('skills/checkpoint/SKILL.md');
assertIncludesAll(checkpoint, ['notepad', 'resume', '`/make-it-so`', 'node workbench/tools/sessions.mjs checkpoint', 'workbench/sessions/checkpoints', 'privacy'], 'checkpoint');
assert.match(checkpoint, /PAUSED/, 'checkpoint must mark the notepad paused for resume');

const toDocs = read('skills/to-docs/SKILL.md');
assertIncludesAll(toDocs, [
  'settled conversation',
  '`LEXICON.md`',
  '`BLUEPRINT.md`',
  'assigned `SPEC.md`',
  '`RUNBOOK.md`',
  '`README.md`',
  '`AGENTS.md`',
  'workbench/docs/adr',
  'node workbench/tools/spec-workbench.mjs render',
  'node workbench/tools/spec-workbench.mjs doctor'
], 'to-docs');
assert.doesNotMatch(toDocs, /ask (the )?user|interview the user|create a second|issue tracker/i,
  'to-docs must persist settled truth without restarting discovery or adding stores');

const toSpec = read('skills/to-spec/SKILL.md');
assertIncludesAll(toSpec, [
  'already-settled conversation',
  '`workbench/manifest.json`',
  'Vertical Implementation Slices',
  'node workbench/tools/spec-workbench.mjs render',
  'node workbench/tools/spec-workbench.mjs doctor'
], 'to-spec');
for (const forbidden of ['issue tracker', 'setup-matt-pocock-skills', 'ready-for-agent']) {
  assert.ok(!toSpec.includes(forbidden), `to-spec must not retain ${forbidden}`);
}

const genesis = read('skills/genesis/SKILL.md');
assertIncludesAll(genesis, [
  '`templates/GENESIS.md`', 'greenfield', 'founding prompt', 'private remote', '`integration`', 'commit and push',
  'workbench/tools/workbench-layout.mjs init', 'tools/workbench-tools.mjs install'
], 'genesis');

const adoption = read('skills/adoption/SKILL.md');
assertIncludesAll(adoption, [
  '`templates/ADOPTION.md`', 'one-time', 'existing project', '`/update-harness`', 'private remote', 'commit and push',
  'workbench-adoption.mjs', 'migrate', 'manifest-declared', 'project-local `skills/`'
], 'adoption');

const implement = read('skills/implement/SKILL.md');
assertIncludesAll(implement, [
  'assigned stable `SPEC.md`', 'one eligible ticket', 'node workbench/tools/spec-workbench.mjs next --json',
  'node workbench/tools/spec-workbench.mjs show S-###', 'node workbench/tools/spec-workbench.mjs claim S-### --agent NAME',
  'red/green/refactor', 'project-owned verification', 'owning documentation',
  'node workbench/tools/spec-workbench.mjs close S-###', 'truthful checkpoint', 'commit and push', '`integration`'
], 'implement');

const codeReview = read('skills/code-review/SKILL.md');
assertIncludesAll(codeReview, [
  'fixed diff', '`BASE_SHA`', '`HEAD_SHA`',
  'git diff --no-ext-diff --no-textconv "$BASE_SHA" "$HEAD_SHA" --',
  'nearest `AGENTS.md`', 'assigned stable `SPEC.md`', 'Findings first', 'review-only', 'separately authorized'
], 'code-review');

const updateHarness = read('skills/update-harness/SKILL.md');
assert.match(updateHarness, /checked-out LLM Workbench repository/,
  'update-harness must identify the product-local source');
assert.doesNotMatch(updateHarness, /\/Users\/kayden\/GPT_OS\//,
  'update-harness must not publish a private machine path');

for (const name of ['grilling', 'checkpoint', 'make-it-so', 'to-docs', 'to-spec', 'to-tickets', 'tracer-bullet', 'implement', 'code-review']) {
  const skill = read(`skills/${name}/SKILL.md`);
  assert.match(skill, /workbench\/manifest\.json/,
    `${name} must route durable v3 workflow records through the manifest`);
}
assert.doesNotMatch(toSpec, /stable `specs\/S-###-slug\/SPEC\.md`/,
  'to-spec must not direct v3 projects to the retired root specs path');

console.log('ok - the portable 12-skill source bundle and retired discovery boundary are aligned');
await import('./test-delivery-skills.mjs');

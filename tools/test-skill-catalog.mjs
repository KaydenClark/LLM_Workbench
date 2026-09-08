#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillsRoot = path.join(root, 'skills');
const archivedSkillsRoot = path.join(root, 'skills-archive', 'optional-active-2026-09-01');
import { coreSkills as runtimeCoreSkills } from '../workbench/tools/workbench-layout.mjs';
const coreSkills = [...runtimeCoreSkills].sort();
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
  `the documented source bundle must contain exactly the locked ${coreSkills.length} skills`);
assert.deepEqual(directoryNames(skillsRoot), coreSkills,
  `live discovery source must contain exactly the locked ${coreSkills.length} skills`);
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

// S-049: six documents state the bundle's size in prose, and nothing held them
// to it - `README.md` and `BLUEPRINT.md` both went stale when the bundle grew
// and an independent review, not a test, caught them. Derive the numbers so a
// future bundle change fails here instead of shipping a wrong count.
const bundleSize = coreSkills.length;
const stanceCount = 4;
const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen'];
const workflowWord = words[bundleSize - stanceCount];
for (const [relative, expected] of [
  ['skills/README.md', [`closed ${bundleSize}-skill bundle`, `${workflowWord} workflow skills`]],
  ['README.md', [`closed ${bundleSize}-skill public source bundle`]],
  ['RUNBOOK.md', [`limited to the ${bundleSize} skills`]],
  ['BLUEPRINT.md', [`carries ${workflowWord} setup/planning/delivery workflow skills`]],
  ['LEXICON.md', [`closed set of ${workflowWord} workflow skills`]],
  ['templates/GENESIS.md', [`exact ${bundleSize}-skill policy`]]
]) {
  assertIncludesAll(read(relative), expected,
    `${relative} states the core bundle size and must match the ${bundleSize} skills in skills/`);
}

// S-049: `RUNBOOK.md`'s documented Genesis command carried `--version v3.1.2`
// after the checkout moved to v3.1.3, and `workbench-layout.mjs init` refuses
// a mismatch with `invalid-source-identity` - a root control shipping a command
// that cannot run. Every documented `--version` literal must be this release.
const VERSION = JSON.parse(read('workbench/manifest.json')).workbenchVersion;
for (const relative of ['RUNBOOK.md', 'templates/ADOPTION.md', 'skills/adoption/SKILL.md',
  'skills/update-harness/SKILL.md', 'tools/workbench-upgrade.mjs', 'tools/workbench-adoption.mjs',
  'workbench/tools/workbench-layout.mjs']) {
  const stale = [...read(relative).matchAll(/--version (v\d+\.\d+\.\d+)/g)]
    .map((match) => match[1])
    .filter((version) => version !== VERSION);
  assert.deepEqual(stale, [],
    `${relative} documents a --version literal that is not the checkout release ${VERSION}; ` +
    'workbench-layout.mjs init refuses a mismatch with invalid-source-identity');
}

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
  'Trim only reconciled material'
], 'make-it-so');
assert.match(makeItSo, /Before voluntarily yielding[\s\S]*push the authorized durable changes/,
  'make-it-so must save authorized durable changes before voluntarily yielding');

const checkpoint = read('skills/checkpoint/SKILL.md');
assertIncludesAll(checkpoint, ['notepad', 'resume', '`/make-it-so`', 'node workbench/tools/sessions.mjs checkpoint', 'workbench/sessions/checkpoints', 'privacy'], 'checkpoint');
assert.match(checkpoint, /copying is retired/i, 'checkpoint must retire copy creation');
assert.match(checkpoint, /writes nothing/, 'legacy invocation must explain its no-write refusal');

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
  '`templates/GENESIS.md`', 'greenfield', 'founding prompt', 'private remote', '`git.integrationBranch`', 'commit and push',
  'workbench/tools/workbench-layout.mjs init', 'tools/workbench-tools.mjs install'
], 'genesis');

const adoption = read('skills/adoption/SKILL.md');
assertIncludesAll(adoption, [
  '`templates/ADOPTION.md`', 'one-time', 'existing project', '`/update-harness`', 'private remote', 'commit and push',
  'workbench-adoption.mjs', 'migrate', 'manifest-declared', 'project-local `skills/`', '`git.integrationBranch`'
], 'adoption');

const implement = read('skills/implement/SKILL.md');
assertIncludesAll(implement, [
  'assigned stable `SPEC.md`', 'one eligible ticket', 'node workbench/tools/spec-workbench.mjs next --json',
  'node workbench/tools/spec-workbench.mjs show S-###', 'node workbench/tools/spec-workbench.mjs claim S-### --agent NAME',
  'red/green/refactor', 'project-owned verification', 'owning documentation',
  'node workbench/tools/spec-workbench.mjs close S-###', 'truthful checkpoint', 'commit and push', '`git.integrationBranch`'
], 'implement');

// S-049: carry owns an assigned unit of work to its authorized endpoint and
// records what the owner still had to supply. Both halves are load-bearing: a
// carry that delivers without the coordination record measures nothing.
const carry = read('skills/carry/SKILL.md');
assertIncludesAll(carry, [
  'already-assigned',
  'assigned `SPEC.md`',
  'node workbench/tools/spec-workbench.mjs show S-###',
  'node workbench/tools/spec-workbench.mjs close S-###',
  '`git.integrationBranch`',
  'Append-Only Evidence And Execution Log',
  'workbench/feedback/REPORT_FORMAT.md'
], 'carry');
assert.match(carry, /`carry` grants nothing/,
  'carry must state that it adds no authority');
for (const reason of ['Preference', 'Tradeoff', 'Authorization', 'Unavailable resource']) {
  assert.ok(carry.includes(`**${reason}**`),
    `carry must name ${reason} as a reason the owner is asked`);
}
for (const cause of ['missing', 'inaccessible', 'incorrect', 'simply not followed']) {
  assert.ok(carry.includes(`*${cause}*`),
    `carry must classify a hand-back cause as ${cause}`);
}
assertIncludesAll(carry, [
  'self-review alone never satisfies it',
  'never a reason to merge'
], 'carry section 2 must forbid self-review at the integration gate');
assert.match(carry, /Do not answer one with a new framework/,
  'carry must forbid answering a hand-back with a new framework');
assert.match(carry, /Stopping\s+before an already-authorized step/,
  'carry must name stopping short of the authorized endpoint as the failure it removes');

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

// S-032: an already-adopted v2-root room has one named route that works
// without skill replacement, and no passage sends it to a manifest it lacks.
const reconcileSection = updateHarness.slice(updateHarness.indexOf('## 3.'), updateHarness.indexOf('## 4.'))
  .replace(/ \\\n\s+/g, ' ');
assert.match(reconcileSection, /workbench-upgrade\.mjs upgrade[^\n`]*--layout-only/,
  'update-harness section 3 must name the layout-only upgrade route');
assert.ok(reconcileSection.indexOf('--layout-only') < reconcileSection.indexOf('--explicit-update'),
  'update-harness section 3 must name the v2-root layout route before skill replacement');
assert.match(reconcileSection, /manifest[^.]*the route just declared/,
  'update-harness must reconcile specs through the manifest the layout route declares');
assert.doesNotMatch(reconcileSection, /through the project's\s+`workbench\/manifest\.json` lane declaration/,
  'update-harness must not send a v2 room to a manifest it does not have yet');
assert.match(reconcileSection, /records\s+`provenance\.lifecycle: upgrade`/,
  'update-harness must state that the route records lifecycle upgrade');
const adoptionOpening = adoption.slice(0, adoption.indexOf('\n1. '));
assert.ok(adoptionOpening.includes('workbench-upgrade.mjs upgrade --layout-only'),
  'adoption must point an already-adopted room at the layout-only route by name');
assert.match(read('templates/ADOPTION.md'), /already-adopted[^.]*`tools\/workbench-upgrade\.mjs upgrade --layout-only`/,
  'templates/ADOPTION.md must name the layout-only route for an already-adopted room');
assert.match(read('RUNBOOK.md'), /--layout-only/, 'the Runbook must document the layout-only mode');
assert.match(read('LEXICON.md'), /--layout-only/, 'the Lexicon distinction must gain the layout-only mode');

for (const name of ['grilling', 'checkpoint', 'make-it-so', 'to-docs', 'to-spec', 'to-tickets', 'tracer-bullet', 'implement', 'code-review', 'carry', 'notepad']) {
  const skill = read(`skills/${name}/SKILL.md`);
  assert.match(skill, /workbench\/manifest\.json/,
    `${name} must route durable v3 workflow records through the manifest`);
}
assert.doesNotMatch(toSpec, /stable `specs\/S-###-slug\/SPEC\.md`/,
  'to-spec must not direct v3 projects to the retired root specs path');

console.log(`ok - the portable ${bundleSize}-skill source bundle and retired discovery boundary are aligned`);
await import('./test-delivery-skills.mjs');

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

const updateHarness = read('skills/update-harness/SKILL.md');
assert.match(updateHarness, /checked-out LLM Workbench repository/,
  'update-harness must identify the product-local source');
assert.doesNotMatch(updateHarness, /\/Users\/kayden\/GPT_OS\//,
  'update-harness must not publish a private machine path');

console.log('ok - the portable 12-skill source bundle and retired discovery boundary are aligned');
await import('./test-delivery-skills.mjs');

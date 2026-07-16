#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillsRoot = path.join(root, 'skills');
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
      lane: cells[3]
    };
  });

assert.equal(rows.length, 27, 'the owner-selected catalog must contain 27 skills');
assert.equal(new Set(rows.map((row) => row.name)).size, rows.length,
  'the selected skill catalog must not contain duplicate names');
for (const row of rows) {
  assert.ok(row.definition.length >= 20, `${row.name} needs a useful definition`);
  assert.match(row.lane, /^(Native|Core rewrite|Supporting rewrite|Reference)$/,
    `${row.name} needs a recognized rewrite lane`);
}

const catalogNames = rows.map((row) => row.name).sort();
const directoryNames = fs.readdirSync(skillsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() || entry.isSymbolicLink())
  .map((entry) => entry.name)
  .sort();
assert.deepEqual(directoryNames, catalogNames,
  'the editable skill folders must exactly match the selected catalog');

for (const name of catalogNames) {
  assert.ok(fs.existsSync(path.join(skillsRoot, name, 'SKILL.md')),
    `${name} must contain SKILL.md`);
}

assert.ok(catalogNames.includes('ask-workbench'), 'the Workbench router must be selected');
for (const removed of ['ask-matt', 'claude-handoff', 'qa', 'triage']) {
  assert.ok(!catalogNames.includes(removed), `${removed} must not remain in the curated surface`);
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
const grillWithDocs = read('skills/grill-with-docs/SKILL.md');
const grillingBundle = `${grilling}\n${grillMe}\n${grillWithDocs}`;

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

assert.match(grillMe, /Run a `\/grilling` session\./,
  'grill-me must remain a thin grilling wrapper');
assert.doesNotMatch(grillingBundle, /Desktop chat|voice|terminal|\bCLI\b/i,
  'the grilling flow must remain runtime-agnostic');

assertIncludesAll(grillWithDocs, [
  'After the user confirms',
  '`LEXICON.md`',
  '`BLUEPRINT.md`',
  '`SPEC.md`'
], 'grill-with-docs');

console.log('ok - selected skill catalog, folders, and shared lexicon are aligned');

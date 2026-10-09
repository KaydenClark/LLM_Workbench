import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => readFileSync(path.join(root, file), 'utf8');
const parents = new Map([
  ['Explore', 'Idea → Align → Confirm'],
  ['Promote', 'Record → Publish → Map → Publish → Plan → Publish'],
  ['Journey', 'Implement → Check → QA → Submit'],
  ['Judge', 'Review → Verify → Approve'],
  ['Complete', 'Delivered → Clean Up'],
]);

for (const file of ['RUNBOOK.md', 'templates/RUNBOOK.md']) {
  const source = read(file);
  const workflows = source.split('## Workflows\n')[1].split('\n## Ordinary Entry')[0];
  const rows = [...workflows.matchAll(/^\| (Explore|Promote|Journey|Judge|Complete) \| ([^|]+) \|/gm)];
  assert.equal(rows.length, 5, `${file}: retain exactly five existing parent rows`);
  for (const [, name, verbs] of rows) assert.equal(verbs.trim(), parents.get(name), `${file}: ${name} boundary`);
  assert.match(workflows, /Draft → Critique → Revise → Confirm/, `${file}: separate draft workflow`);
  assert.match(workflows, /repeat(?:able|ed|s|ing)?.{0,100}(?:as needed|as many times|before Confirm)/s, `${file}: repeatable critique/revision`);
  assert.match(workflows, /not a mandatory.{0,70}gate/s, `${file}: no mandatory gate`);
  assert.match(workflows, /exact.{0,35}(?:wording|text)/s, `${file}: content-bound confirmation`);
  assert.match(workflows, /comment.{0,90}(?:not|neither).{0,40}(?:approval|confirmation)/s, `${file}: a comment does not approve`);
  assert.match(workflows, /draft\("Draft"\) --> critique\("Critique"\) --> revise\("Revise"\)/, `${file}: draft diagram`);
  assert.match(workflows, /revise -->\|[^\n]*\| critique/, `${file}: revision loops to critique`);
  assert.match(workflows, /revise -->[^\n]*draftConfirm\("Confirm"\)/, `${file}: draft can be confirmed`);
  assert.match(workflows, /idea\("Idea"\) --> align\("Align"\) --> confirm\("Confirm"\)/, `${file}: preserve Explore diagram`);
  for (const edge of [
    'confirm --> record', 'pubPlan --> implement', 'submit --> review',
    'review -->|Pass: merge to integration| verify',
    'review -->|Fail: return to Map and Plan| map',
    'approve -->|Owner approves and promotes to main| delivered',
    'approve -->|Owner sends back| align',
  ]) assert.ok(workflows.includes(edge), `${file}: preserve ${edge}`);
}

for (const file of ['RUNBOOK.md', 'templates/RUNBOOK.md']) {
  const source = read(file);
  for (const verb of ['Draft', 'Critique', 'Revise']) {
    assert.equal([...source.matchAll(new RegExp(`^\\| \\*\\*${verb}\\*\\* \\|`, 'gm'))].length, 1, `${file}: one temporary ${verb} definition`);
  }
  assert.match(source, /GLOSSARY\.md/, `${file}: intended glossary destination`);
  assert.match(source, /(?:do not|Do not).{0,100}(?:legacy|Lexicon)/s, `${file}: do not expand legacy vocabulary`);
}
for (const file of ['LEXICON.md', 'templates/LEXICON.md']) {
  const source = read(file);
  for (const verb of ['Draft', 'Critique', 'Revise']) assert.ok(!source.includes(`| **${verb}** |`), `${file}: no new legacy verb entries`);
}
assert.match(read('RUNBOOK.md'), /PR431/, 'pending migration explicitly named');
assert.match(read('RUNBOOK.md'), /no\s+Glossary/, 'actual baseline conflict stated');

const lexicon = read('LEXICON.md');
for (const meaning of ['P1 — Interrupt', 'P2 — Committed', 'P3 — Secondary', 'P4 — Backlog', 'V1 — Quick Win', 'V2 — Strategic Value', 'V3 — Fill-In', 'V4 — Defer / Eliminate']) {
  assert.ok(lexicon.includes(meaning), `preserve accepted P/V meaning ${meaning}`);
}
const wiki = read('workbench/wiki/design-concepts/workflow-verbs.md');
assert.match(wiki, /Draft → Critique → Revise → Confirm/, 'Wiki explains draft workflow');
assert.match(wiki, /2026-10-08:.*(?:Draft|draft)/s, 'Wiki history preserves owner-confirmed addition');
console.log('ok - repeatable draft workflow, Runbook verb definitions, intended Glossary destination and unchanged parent boundaries');

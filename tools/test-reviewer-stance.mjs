#!/usr/bin/env node
// Source-contract regression only: these checks do not execute a model.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const skill = read('workbench/skills/reviewer/SKILL.md');
test('reviewer entry preserves stance and distinct Worker / independent gates', () => {
  for (const heading of ['Purpose', 'Method / Posture', 'Obligations', 'Completion / Exit Condition']) assert.ok(skill.includes(`## ${heading}`));
  for (const term of ['Worker self-check', 'prior involvement', 'separate context', 'Dispatcher', 'Director', 'exemption 2', '`BASE_SHA`', '`HEAD_SHA`', 'content digest', 'new candidate', 'owner Human QA']) assert.ok(skill.includes(term), `missing reviewer boundary: ${term}`);
});
test('reviewer routes actionable findings, evidence limits and inability hand-back', () => {
  assert.match(skill, /\[Review evidence and hand-back\]\(references\/review-evidence\.md\)/);
  const reference = read('workbench/skills/reviewer/references/review-evidence.md');
  for (const term of ['severity', 'proven', 'uncertain', 'path:line@', 'user impact', 'smallest safe correction', 'not attempted', 'approval rejected', 'source', 'behavioral', 'inability', 'no findings', 'missing', 'read-only', 'Human QA']) assert.ok(reference.replace(/\s+/g, ' ').includes(term), `missing report boundary: ${term}`);
  assert.match(reference, /new SHA.*fresh review/s);
});
test('reviewer portable reference links resolve within the source bundle', () => {
  const reference = read('workbench/skills/reviewer/references/review-evidence.md');
  for (const [text, base] of [[skill, 'workbench/skills/reviewer'], [reference, 'workbench/skills/reviewer/references']]) {
    for (const match of text.matchAll(/\]\(([^)#]+)(?:#[^)]*)?\)/g)) {
      if (!match[1].includes('://')) assert.ok(fs.existsSync(path.resolve(root, base, match[1])), match[1]);
    }
  }
});

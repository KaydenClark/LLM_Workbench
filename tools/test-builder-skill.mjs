#!/usr/bin/env node
// S-01P source-contract regression only: this does not execute an agent or
// establish behavioral acceptance. Run the separate scenario in builder/references.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skill = fs.readFileSync(path.join(root, 'workbench/skills/builder/SKILL.md'), 'utf8');

test('Builder bounds helper composition to the existing assignment and endpoint', () => {
  assert.match(skill, /Every composed helper inherits the assigned Task and the caller's narrower\nendpoint/);
  assert.match(skill, /Use tracer-bullet to check the completeness of this Task, not to cut or\nassign more work/);
  assert.match(skill, /Loading this skill never spawns an agent/);
  assert.match(skill, /Do not choose or record a new normal stance or invent a\nnext task/);
});

test('Builder exit reports observed delivery and unmet gates without claiming completion', () => {
  for (const item of ['Actual result', 'Evidence', 'Documentation state', 'Remaining risk']) {
    assert.ok(skill.includes(`**${item}:**`), `missing ${item}`);
  }
  assert.match(skill, /If acceptance or a required check is unmet, keep the Task incomplete/);
  assert.match(skill, /Source-text assertions prove the wording contract, not agent behavior/);
  assert.match(skill, /Never equate implementation with release/);
});

test('Builder keeps its portable stance shape and resolves local links', () => {
  for (const heading of ['Purpose', 'Method / Posture', 'Obligations', 'Completion / Exit Condition']) {
    assert.ok(skill.includes(`## ${heading}`));
  }
  const links = [...skill.matchAll(/\]\(([^)#]+)(?:#[^)]*)?\)/g)].map(match => match[1]);
  for (const link of links.filter(link => !link.includes('://'))) {
    assert.ok(fs.existsSync(path.resolve(root, 'workbench/skills/builder', link)), link);
  }
});

#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { inspectTeamCoordination } from './team-coordination-contract.mjs';

const current = inspectTeamCoordination({
  manager: read('MANAGER.md'),
  readme: read('README.md'),
  subagent: read('SUBAGENT.md'),
  taskboard: read('TASKBOARD.md')
});
assert.deepEqual(current, [], 'the current templates must satisfy the team coordination contract');

const legacy = inspectTeamCoordination({
  manager: 'Managers maintain the root `TASKBOARD.md` proof log and transcribe subagent results.',
  readme: 'Subagents append proof to the shared Taskboard.',
  subagent: 'Combine Planner and Engineer authority, then append proof to the queue.',
  taskboard: '## Proof log\n\n| Task | Proof |\n|---|---|'
});
assert.deepEqual(
  legacy,
  [
    'manager must route work through Captain coordination',
    'manager must require exactly one role contract per task',
    'manager must require disjoint durable write lanes',
    'manager must reserve one primary durable writer',
    'README must make the stable spec the only ticket and proof store',
    'README must describe the project TASKBOARD.md as a generated read-only projection',
    'SUBAGENT must keep Scout and Auditor read-only',
    'SUBAGENT must prohibit combined role authority',
    'SUBAGENT must prohibit writes to the owning spec and generated projection',
    'run notes must be disposable rather than a durable Taskboard',
    'run notes must not contain a proof log',
    'retired duplicate-board/proof-log language returned'
  ],
  'the contract must reject the retired duplicate Taskboard/proof-log model'
);

console.log('ok - team coordination contract accepts spec-native templates and rejects the retired model');

function read(file) {
  return fs.readFileSync(new URL(`../team templates/${file}`, import.meta.url), 'utf8');
}

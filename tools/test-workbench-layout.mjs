#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { nextWork } from './spec-workbench.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tool = path.join(root, 'tools', 'workbench-layout.mjs');
const controls = ['AGENTS.md', 'BLUEPRINT.md', 'LEXICON.md', 'RUNBOOK.md', 'TASKBOARD.md', 'CLAUDE.md', 'README.md'];

function fixture() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-layout-'));
}

function run(...args) {
  const result = spawnSync(process.execPath, [tool, ...args], { cwd: root, encoding: 'utf8' });
  return { ...result, report: result.stdout ? JSON.parse(result.stdout) : null };
}

function markdownFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const candidate = path.join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(candidate);
    return entry.isFile() && entry.name.endsWith('.md') ? [candidate] : [];
  });
}

function completeGenesis(project) {
  for (const control of controls) {
    const content = control === 'CLAUDE.md'
      ? '@AGENTS.md\n'
      : `# ${control}\n\n> Generated from LLM Workbench v3.0.0.\n\n## Purpose\n\nThis is a filled ${control} fixture.\n`;
    fs.writeFileSync(path.join(project, control), content);
  }
  const firstSpec = path.join(project, 'workbench', 'specs', 'S-001-first');
  fs.mkdirSync(firstSpec);
  fs.writeFileSync(path.join(firstSpec, 'SPEC.md'), `# S-001 - First Capability

> Generated from LLM Workbench v3.0.0. Stable path
> \`workbench/specs/S-001-first/SPEC.md\`; never move between status folders.

**Spec ID:** S-001
**Status:** active
**Priority:** 0
**Owner:** fixture
**Updated:** 2026-09-01
**Catalog description:** Prove one actionable Genesis capability.
**Blockers:** none
**Latest event:** Spec captured.
**Next gate:** Claim TK-001.

## Outcome

One cold agent can select and claim the first ticket.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Prove one cold selection | ready | none | pending |

## Acceptance Criteria

- [ ] The first ticket is selectable.

## Completion Result

Pending.
`);
}

test('copy-ready v3 templates route active spec authority through workbench/specs', () => {
  const templateRoot = path.join(root, 'templates');
  const adoptionPath = path.join(templateRoot, 'ADOPTION.md');
  for (const file of markdownFiles(templateRoot)) {
    const relative = path.relative(templateRoot, file);
    const content = fs.readFileSync(file, 'utf8');
    const retiredPaths = [...content.matchAll(/(?<!workbench\/)specs\//g)];
    assert.equal(retiredPaths.length, file === adoptionPath ? 1 : 0,
      `${relative} contains root specs authority outside the one bounded Adoption migration source`);
  }
  assert.match(fs.readFileSync(adoptionPath, 'utf8'), /The migration moves[\s\S]{0,200}`specs\/`[\s\S]{0,200}manifest-declared lanes/);
  for (const relative of ['AGENTS.md', 'BLUEPRINT.md', 'TASKBOARD.md', 'SPEC.md', 'README.md', path.join('Wiki', 'MEMORY.project.md')]) {
    assert.match(fs.readFileSync(path.join(templateRoot, relative), 'utf8'), /workbench\/specs\//, `${relative} does not name the manifest-default spec lane`);
  }
});

test('a fresh Genesis fixture has the seven controls, manifest lanes, first spec, and no local skill shadow', () => {
  const project = fixture();
  try {
    const initialized = run('init', '--project', project, '--provenance', 'genesis', '--version', 'v3.0.0');
    assert.equal(initialized.status, 0, initialized.stderr);
    completeGenesis(project);

    const validated = run('validate', '--project', project, '--genesis');

    assert.equal(validated.status, 0, validated.stderr);
    assert.equal(validated.report.status, 'valid');
    assert.deepEqual(validated.report.controls, controls);
    assert.deepEqual(nextWork(project), {
      specId: 'S-001',
      title: 'First Capability',
      ticketId: 'TK-001',
      slice: 'Prove one cold selection',
      status: 'ready',
      priority: 0,
      owner: 'fixture',
      path: 'workbench/specs/S-001-first/SPEC.md',
      nextGate: 'Claim TK-001.'
    });
    assert.equal(fs.existsSync(path.join(project, 'skills')), false);
    for (const lane of ['specs', 'wiki', 'grilling', 'handoffs', 'feedback']) {
      assert.equal(fs.existsSync(path.join(project, 'workbench', lane)), true);
    }
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
  }
});

test('the validator rejects a traversing manifest lane', () => {
  const project = fixture();
  try {
    assert.equal(run('init', '--project', project, '--provenance', 'genesis', '--version', 'v3.0.0').status, 0);
    const manifestPath = path.join(project, 'workbench', 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    manifest.lanes.specs = '../specs';
    fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

    const validated = run('validate', '--project', project);

    assert.notEqual(validated.status, 0);
    assert.equal(validated.report.error.code, 'invalid-lane');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
  }
});

test('the validator rejects a symlinked support lane', () => {
  const project = fixture();
  const outside = fixture();
  try {
    assert.equal(run('init', '--project', project, '--provenance', 'genesis', '--version', 'v3.0.0').status, 0);
    const wiki = path.join(project, 'workbench', 'wiki');
    fs.rmSync(wiki, { recursive: true, force: true });
    fs.symlinkSync(outside, wiki);

    const validated = run('validate', '--project', project);

    assert.notEqual(validated.status, 0);
    assert.equal(validated.report.error.code, 'unsafe-lane');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
    fs.rmSync(outside, { recursive: true, force: true });
  }
});

test('Genesis validation rejects symlinked and unfilled root controls', () => {
  const scenarios = [
    {
      expected: 'unsafe-control',
      mutate(project) {
        const target = path.join(project, 'AGENTS.real.md');
        fs.renameSync(path.join(project, 'AGENTS.md'), target);
        fs.symlinkSync(target, path.join(project, 'AGENTS.md'));
      }
    },
    {
      expected: 'unfilled-control',
      mutate(project) {
        fs.writeFileSync(path.join(project, 'BLUEPRINT.md'), '# [PROJECT_NAME]\n');
      }
    },
    {
      expected: 'unfilled-control',
      mutate(project) {
        fs.writeFileSync(path.join(project, 'README.md'), 'README.md\n');
      }
    },
    {
      expected: 'unfilled-control',
      mutate(project) {
        fs.writeFileSync(path.join(project, 'TASKBOARD.md'), '# Taskboard\n\n> Generated from LLM Workbench v3.0.0.\n\n## Focus\n\n[current useful outcome]\n');
      }
    },
    {
      expected: 'version-mismatch',
      mutate(project) {
        const file = path.join(project, 'RUNBOOK.md');
        fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace('v3.0.0', 'v2.3.0'));
      }
    }
  ];

  for (const scenario of scenarios) {
    const project = fixture();
    try {
      assert.equal(run('init', '--project', project, '--provenance', 'genesis', '--version', 'v3.0.0').status, 0);
      completeGenesis(project);
      scenario.mutate(project);

      const validated = run('validate', '--project', project, '--genesis');

      assert.notEqual(validated.status, 0);
      assert.equal(validated.report.error.code, scenario.expected);
    } finally {
      fs.rmSync(project, { recursive: true, force: true });
    }
  }
});

test('Genesis validation rejects unstable and structurally incomplete first specs', () => {
  const scenarios = [
    {
      expected: 'invalid-first-spec',
      mutate(project) {
        const stable = path.join(project, 'workbench', 'specs', 'S-001-first');
        const unstable = path.join(project, 'workbench', 'specs', 'first');
        fs.renameSync(stable, unstable);
      }
    },
    {
      expected: 'invalid-first-spec',
      mutate(project) {
        fs.writeFileSync(path.join(project, 'workbench', 'specs', 'S-001-first', 'SPEC.md'), '# S-001\n');
      }
    },
    {
      expected: 'invalid-first-spec',
      mutate(project) {
        const file = path.join(project, 'workbench', 'specs', 'S-001-first', 'SPEC.md');
        fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace('**Status:** active', '**Status:** planned'));
      }
    },
    {
      expected: 'invalid-first-spec',
      mutate(project) {
        const file = path.join(project, 'workbench', 'specs', 'S-001-first', 'SPEC.md');
        fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace('| TK-001 | Prove one cold selection | ready | none | pending |', '| TK-001 | Prove one cold selection | blocked | none | pending |'));
      }
    },
    {
      expected: 'invalid-first-spec',
      mutate(project) {
        const file = path.join(project, 'workbench', 'specs', 'S-001-first', 'SPEC.md');
        fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace('v3.0.0', 'v2.3.0'));
      }
    },
    {
      expected: 'invalid-first-spec',
      mutate(project) {
        const directory = path.join(project, 'workbench', 'specs', 'S-001-first');
        fs.renameSync(path.join(directory, 'SPEC.md'), path.join(directory, 'SPEC.real.md'));
        fs.symlinkSync('SPEC.real.md', path.join(directory, 'SPEC.md'));
      }
    }
  ];

  for (const scenario of scenarios) {
    const project = fixture();
    try {
      assert.equal(run('init', '--project', project, '--provenance', 'genesis', '--version', 'v3.0.0').status, 0);
      completeGenesis(project);
      scenario.mutate(project);

      const validated = run('validate', '--project', project, '--genesis');

      assert.notEqual(validated.status, 0);
      assert.equal(validated.report.error.code, scenario.expected);
    } finally {
      fs.rmSync(project, { recursive: true, force: true });
    }
  }
});

test('Genesis validation accepts legitimate filled Markdown bracket syntax', () => {
  const project = fixture();
  try {
    assert.equal(run('init', '--project', project, '--provenance', 'genesis', '--version', 'v3.0.0').status, 0);
    completeGenesis(project);
    const runbook = path.join(project, 'RUNBOOK.md');
    fs.appendFileSync(runbook, `
## Bracket Examples

Read array[0], run \`tool [--home USER_HOME]\`, follow [the guide](https://example.test),
keep - [ ] as a checklist, route [[Room Note]], and define a [Reference]: https://example.test.
`);

    const validated = run('validate', '--project', project, '--genesis');

    assert.equal(validated.status, 0, validated.stderr);
    assert.equal(validated.report.status, 'valid');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
  }
});

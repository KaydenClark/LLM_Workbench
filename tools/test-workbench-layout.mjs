#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { doctor, nextWork, render } from '../workbench/tools/spec-workbench.mjs';
import { genesisTemplateFiles, templatePlaceholders } from '../workbench/tools/template-placeholders.mjs';
import { COLLECTIONS, LANES } from '../workbench/tools/workbench-paths.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const VERSION = JSON.parse(fs.readFileSync(path.join(root, 'workbench', 'manifest.json'), 'utf8')).workbenchVersion;
const runtime = path.join(root, 'workbench', 'tools');
const tool = path.join(runtime, 'workbench-layout.mjs');
const installer = path.join(root, 'tools', 'workbench-tools.mjs');
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

const generatedRegions = {
  'BLUEPRINT.md': '## Spec Catalog\n\n<!-- spec-catalog:start -->\n<!-- spec-catalog:end -->\n',
  'TASKBOARD.md': '## Active Specs\n\n<!-- hot-specs:start -->\n<!-- hot-specs:end -->\n'
};

function installTools(project) {
  const result = spawnSync(process.execPath, [installer, 'install', '--project', project], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
}

function completeGenesis(project, options = {}) {
  if (options.tools !== false) installTools(project);
  const router = fs.readFileSync(path.join(root, 'templates', 'wiki', 'MEMORY.project.md'), 'utf8')
    .replaceAll('[PROJECT_NAME]', 'Fixture').replaceAll('[HARNESS_VERSION]', VERSION.slice(1)).replaceAll('[YYYY-MM-DD]', '2026-09-01')
    .replace(/^\| \[QUESTION THIS ROOM'S MEMORY ANSWERS\].*\n/m, '').replace(/^\| \[ANOTHER DURABLE QUESTION\].*\n/m, '');
  fs.writeFileSync(path.join(project, 'workbench', 'wiki', 'MEMORY.md'), router);
  for (const control of controls) {
    const content = control === 'CLAUDE.md'
      ? '@AGENTS.md\n'
      : `# ${control}\n\n> Generated from LLM Workbench ${VERSION}.\n\n## Purpose\n\nThis is a filled ${control} fixture.\n${generatedRegions[control] ?? ''}`;
    fs.writeFileSync(path.join(project, control), content);
  }
  const firstSpec = path.join(project, 'workbench', 'specs', 'S-001-first');
  fs.mkdirSync(firstSpec);
  fs.writeFileSync(path.join(firstSpec, 'SPEC.md'), `# S-001 - First Capability

> Generated from LLM Workbench ${VERSION}. Stable path
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
  for (const relative of ['AGENTS.md', 'BLUEPRINT.md', 'TASKBOARD.md', 'SPEC.md', 'README.md', path.join('wiki', 'MEMORY.project.md')]) {
    assert.match(fs.readFileSync(path.join(templateRoot, relative), 'utf8'), /workbench\/specs\//, `${relative} does not name the manifest-default spec lane`);
  }
  // Exactly seven root controls: the feedback return channel lives in its lane.
  const readme = fs.readFileSync(path.join(templateRoot, 'README.md'), 'utf8');
  assert.match(readme, /workbench\/feedback\/WORKBENCH_FEEDBACK\.md/, 'the project README routes feedback to the lane');
  assert.doesNotMatch(readme, /\]\(WORKBENCH_FEEDBACK\.md\)/, 'the project README must not link a root feedback file');
  assert.match(fs.readFileSync(path.join(templateRoot, 'GENESIS.md'), 'utf8'), /workbench\/feedback\/WORKBENCH_FEEDBACK\.md/, 'Genesis places the feedback file in the lane');
});

test('the committed placeholder vocabulary exactly matches the shipped Genesis templates', () => {
  const actual = new Set();
  for (const name of genesisTemplateFiles) {
    const content = fs.readFileSync(path.join(root, 'templates', name), 'utf8');
    for (const match of content.matchAll(/(?<!\[)\[(?!\[|[ xX]\])[^\]\n]+\](?!\()/g)) actual.add(match[0]);
  }
  assert.deepEqual([...actual].sort(), [...templatePlaceholders].sort());
});

test('a fresh Genesis fixture has the seven controls, manifest lanes, first spec, and no local skill shadow', () => {
  const project = fixture();
  try {
    const initialized = run('init', '--project', project, '--provenance', 'genesis', '--version', VERSION);
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
    const manifest = JSON.parse(fs.readFileSync(path.join(project, 'workbench', 'manifest.json'), 'utf8'));
    assert.equal(manifest.schemaVersion, 2);
    assert.deepEqual(manifest.lanes, LANES);
    assert.deepEqual(manifest.collections, COLLECTIONS);
    assert.equal(manifest.wiki.profile, 'project');
    assert.equal(manifest.provenance.source.release, VERSION);
    for (const relative of [...Object.values(LANES), ...Object.values(COLLECTIONS)]) {
      assert.equal(fs.statSync(path.join(project, relative)).isDirectory(), true, `${relative} must exist`);
    }
    const ignore = fs.readFileSync(path.join(project, 'workbench', 'sessions', '.gitignore'), 'utf8');
    assert.match(ignore, /^grilling\/\*$/m);
    assert.match(ignore, /^handoffs\/\*$/m);
    assert.doesNotMatch(ignore, /^checkpoints/m, 'checkpoints must never be ignored');
    render(project);
    assert.deepEqual(doctor(project), [], 'an operable Genesis fixture must satisfy doctor once rendered');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
  }
});

function schemaOneFixture(project) {
  for (const lane of ['specs', 'wiki', 'grilling', 'handoffs', 'feedback']) fs.mkdirSync(path.join(project, 'workbench', lane), { recursive: true });
  fs.writeFileSync(path.join(project, 'workbench', 'grilling', 'notepad.md'), '# live notepad\n');
  fs.writeFileSync(path.join(project, 'workbench', 'handoffs', 'checkpoint.md'), '# tracked checkpoint\n');
  fs.writeFileSync(path.join(project, 'workbench', 'wiki', 'MEMORY.md'), '# memory\n');
  fs.writeFileSync(path.join(project, 'workbench', 'feedback', '.gitkeep'), '');
  fs.mkdirSync(path.join(project, 'workbench', 'specs', 'S-001-first'));
  fs.writeFileSync(path.join(project, 'workbench', 'specs', 'S-001-first', 'SPEC.md'), '# S-001 - First\n');
  fs.writeFileSync(path.join(project, 'workbench', 'manifest.json'), `${JSON.stringify({
    schemaVersion: 1,
    workbenchVersion: VERSION,
    provenance: { lifecycle: 'genesis' },
    lanes: { specs: 'workbench/specs', wiki: 'workbench/wiki', grilling: 'workbench/grilling', handoffs: 'workbench/handoffs', feedback: 'workbench/feedback' },
    skillPolicy: { required: ['adoption', 'checkpoint', 'code-review', 'genesis', 'grilling', 'implement', 'make-it-so', 'to-docs', 'to-spec', 'to-tickets', 'tracer-bullet', 'update-harness'], discovery: ['.agents/skills', '.claude/skills'], normalSetup: 'presence-only', updates: 'explicit-only' }
  }, null, 2)}\n`);
}

test('a schema 1 manifest reports upgrade-required and migrates losslessly once', () => {
  const project = fixture();
  try {
    schemaOneFixture(project);
    const stale = run('validate', '--project', project);
    assert.notEqual(stale.status, 0);
    assert.equal(stale.report.error.code, 'upgrade-required');

    const migrated = run('migrate', '--project', project);
    assert.equal(migrated.status, 0, `${migrated.stdout}\n${migrated.stderr}`);
    assert.equal(migrated.report.status, 'migrated');
    assert.equal(fs.readFileSync(path.join(project, 'workbench', 'sessions', 'grilling', 'notepad.md'), 'utf8'), '# live notepad\n');
    assert.equal(fs.readFileSync(path.join(project, 'workbench', 'sessions', 'checkpoints', 'checkpoint.md'), 'utf8'), '# tracked checkpoint\n');
    assert.equal(fs.readFileSync(path.join(project, 'workbench', 'wiki', 'MEMORY.md'), 'utf8'), '# memory\n');
    assert.equal(fs.readFileSync(path.join(project, 'workbench', 'specs', 'S-001-first', 'SPEC.md'), 'utf8'), '# S-001 - First\n');
    assert.equal(fs.existsSync(path.join(project, 'workbench', 'grilling')), false);
    assert.equal(fs.existsSync(path.join(project, 'workbench', 'handoffs')), false);
    const manifest = JSON.parse(fs.readFileSync(path.join(project, 'workbench', 'manifest.json'), 'utf8'));
    assert.equal(manifest.schemaVersion, 2);
    assert.equal(manifest.provenance.lifecycle, 'genesis');
    assert.equal(manifest.provenance.migratedFrom, 1);
    assert.deepEqual(manifest.collections, COLLECTIONS);
    assert.equal(run('validate', '--project', project).report.status, 'valid');
    assert.equal(run('migrate', '--project', project).report.status, 'current');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
  }
});

test('the validator requires every declared collection, the sessions ignore file, and a known wiki profile', () => {
  const scenarios = [
    { expected: 'missing-collection', mutate: (project) => fs.rmSync(path.join(project, 'workbench', 'wiki', 'design-concepts'), { recursive: true }) },
    { expected: 'sessions-not-ignored', mutate: (project) => fs.rmSync(path.join(project, 'workbench', 'sessions', '.gitignore')) },
    { expected: 'sessions-not-ignored', mutate: (project) => fs.writeFileSync(path.join(project, 'workbench', 'sessions', '.gitignore'), 'grilling/*\n') },
    {
      expected: 'invalid-wiki-profile',
      mutate(project) {
        const manifestPath = path.join(project, 'workbench', 'manifest.json');
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        manifest.wiki.profile = 'vault';
        fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
      }
    },
    {
      expected: 'invalid-collection',
      mutate(project) {
        const manifestPath = path.join(project, 'workbench', 'manifest.json');
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        manifest.collections['design-concepts'] = 'workbench/wiki/Design Concepts';
        fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
      }
    }
  ];
  for (const scenario of scenarios) {
    const project = fixture();
    try {
      assert.equal(run('init', '--project', project, '--provenance', 'genesis', '--version', VERSION).status, 0);
      scenario.mutate(project);
      const validated = run('validate', '--project', project);
      assert.notEqual(validated.status, 0, `${scenario.expected}: ${validated.stdout}`);
      assert.equal(validated.report.error.code, scenario.expected);
    } finally {
      fs.rmSync(project, { recursive: true, force: true });
    }
  }
});

test('the validator rejects a traversing manifest lane', () => {
  const project = fixture();
  try {
    assert.equal(run('init', '--project', project, '--provenance', 'genesis', '--version', VERSION).status, 0);
    const manifestPath = path.join(project, 'workbench', 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    manifest.lanes.specs = '../specs';
    fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

    const validated = run('validate', '--project', project);

    assert.notEqual(validated.status, 0, `${validated.stdout}\n${validated.stderr}`);
    assert.equal(validated.report.error.code, 'invalid-lane');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
  }
});

test('the validator rejects a symlinked support lane', () => {
  const project = fixture();
  const outside = fixture();
  try {
    assert.equal(run('init', '--project', project, '--provenance', 'genesis', '--version', VERSION).status, 0);
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
        fs.writeFileSync(path.join(project, 'TASKBOARD.md'), `# Taskboard\n\n> Generated from LLM Workbench ${VERSION}.\n\n## Focus\n\n[current useful outcome]\n`);
      }
    },
    {
      expected: 'version-mismatch',
      mutate(project) {
        const file = path.join(project, 'RUNBOOK.md');
        fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace(VERSION, 'v2.3.0'));
      }
    },
    {
      expected: 'unfilled-control',
      reason: /spec-catalog/,
      mutate(project) {
        const file = path.join(project, 'BLUEPRINT.md');
        fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace(generatedRegions['BLUEPRINT.md'], ''));
      }
    },
    {
      expected: 'unfilled-control',
      reason: /hot-specs/,
      mutate(project) {
        const file = path.join(project, 'TASKBOARD.md');
        fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace(generatedRegions['TASKBOARD.md'], ''));
      }
    },
    {
      expected: 'unfilled-control',
      message: /exactly `@AGENTS\.md`/,
      mutate(project) {
        fs.writeFileSync(path.join(project, 'CLAUDE.md'), '@AGENTS.md\n<!-- also load the wiki -->\n');
      }
    }
  ];

  for (const scenario of scenarios) {
    const project = fixture();
    try {
      assert.equal(run('init', '--project', project, '--provenance', 'genesis', '--version', VERSION).status, 0);
      completeGenesis(project);
      scenario.mutate(project);

      const validated = run('validate', '--project', project, '--genesis');

      assert.notEqual(validated.status, 0);
      assert.equal(validated.report.error.code, scenario.expected);
      if (scenario.reason) assert.match(validated.report.error.reason ?? '', scenario.reason);
      if (scenario.message) assert.match(validated.report.error.message, scenario.message);
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
        fs.writeFileSync(file, fs.readFileSync(file, 'utf8')
          .replace(/^\*\*(?:Catalog description|Blockers|Latest event|Next gate):\*\*.*\n/gm, ''));
      }
    },
    {
      expected: 'invalid-first-spec',
      mutate(project) {
        const file = path.join(project, 'workbench', 'specs', 'S-001-first', 'SPEC.md');
        fs.writeFileSync(file, fs.readFileSync(file, 'utf8')
          .replace('Prove one cold selection', 'Prove input | output selection'));
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
        fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace(VERSION, 'v2.3.0'));
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
      assert.equal(run('init', '--project', project, '--provenance', 'genesis', '--version', VERSION).status, 0);
      completeGenesis(project);
      scenario.mutate(project);

      const validated = run('validate', '--project', project, '--genesis');

      assert.notEqual(validated.status, 0);
      assert.equal(validated.report.error.code, scenario.expected);
      assert.ok(typeof validated.report.error.reason === 'string' && validated.report.error.reason.length > 0,
        `${scenario.expected} must name the failing predicate: ${JSON.stringify(validated.report.error)}`);
    } finally {
      fs.rmSync(project, { recursive: true, force: true });
    }
  }
});

test('Genesis readiness requires a version-matched runtime tools receipt', () => {
  const missing = fixture();
  const mismatched = fixture();
  try {
    assert.equal(run('init', '--project', missing, '--provenance', 'genesis', '--version', VERSION).status, 0);
    completeGenesis(missing, { tools: false });
    const withoutReceipt = run('validate', '--project', missing, '--genesis');
    assert.notEqual(withoutReceipt.status, 0);
    assert.equal(withoutReceipt.report.error.code, 'tools-receipt-missing');
    assert.equal(run('validate', '--project', missing).report.status, 'valid', 'plain validation does not require the receipt');

    assert.equal(run('init', '--project', mismatched, '--provenance', 'genesis', '--version', VERSION).status, 0);
    completeGenesis(mismatched);
    const receiptPath = path.join(mismatched, 'workbench', 'tools', '.workbench-tools.json');
    const receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
    receipt.source.release = 'v2.3.0';
    fs.writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`);
    const drifted = run('validate', '--project', mismatched, '--genesis');
    assert.equal(drifted.report.error.code, 'version-mismatch');
    assert.match(drifted.report.error.message, /receipt/);
  } finally {
    fs.rmSync(missing, { recursive: true, force: true });
    fs.rmSync(mismatched, { recursive: true, force: true });
  }
});

test('Genesis validation names the failing first-spec predicate and the stray lane entries', () => {
  const project = fixture();
  try {
    assert.equal(run('init', '--project', project, '--provenance', 'genesis', '--version', VERSION).status, 0);
    completeGenesis(project);
    const specFile = path.join(project, 'workbench', 'specs', 'S-001-first', 'SPEC.md');
    const original = fs.readFileSync(specFile, 'utf8');

    fs.writeFileSync(specFile, original.replace('**Status:** active', '**Status:** planned'));
    const planned = run('validate', '--project', project, '--genesis');
    assert.equal(planned.report.error.code, 'invalid-first-spec');
    assert.match(planned.report.error.reason, /Status.*active/);

    fs.writeFileSync(specFile, original.replace('**Priority:** 0', '**Priority:** 10'));
    const priority = run('validate', '--project', project, '--genesis');
    assert.match(priority.report.error.reason, /Priority/);

    fs.writeFileSync(specFile, original.replace('- [ ] The first ticket is selectable.', '- [x] The first ticket is selectable.'));
    const checked = run('validate', '--project', project, '--genesis');
    assert.match(checked.report.error.reason, /acceptance/i);
    fs.writeFileSync(specFile, original);

    fs.writeFileSync(path.join(project, 'workbench', 'specs', '.DS_Store'), 'finder junk');
    const dotfile = run('validate', '--project', project, '--genesis');
    assert.equal(dotfile.status, 0, `${dotfile.stdout}\n${dotfile.stderr}`);
    assert.equal(dotfile.report.status, 'valid');

    fs.writeFileSync(path.join(project, 'workbench', 'specs', 'README.md'), '# stray\n');
    const stray = run('validate', '--project', project, '--genesis');
    assert.equal(stray.report.error.code, 'invalid-first-spec');
    assert.deepEqual(stray.report.error.entries, ['README.md', 'S-001-first']);
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
  }
});

test('Genesis validation accepts legitimate filled Markdown bracket syntax', () => {
  const project = fixture();
  try {
    assert.equal(run('init', '--project', project, '--provenance', 'genesis', '--version', VERSION).status, 0);
    completeGenesis(project);
    const runbook = path.join(project, 'RUNBOOK.md');
    fs.appendFileSync(runbook, `
## Bracket Examples

Read array[0], run \`tool [--home USER_HOME]\`, follow [the guide](https://example.test),
keep - [ ] as a checklist, route [[Room Note]], and define [Reference], [RFC], and
[API] labels below.

[Reference]: https://example.test/reference
[RFC]: https://example.test/rfc
[API]: https://example.test/api
`);

    const validated = run('validate', '--project', project, '--genesis');

    assert.equal(validated.status, 0, validated.stderr);
    assert.equal(validated.report.status, 'valid');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
  }
});

test('a relocated Genesis CLI retains its complete embedded placeholder vocabulary', () => {
  const project = fixture();
  const partialBundle = fixture();
  try {
    assert.equal(run('init', '--project', project, '--provenance', 'genesis', '--version', VERSION).status, 0);
    completeGenesis(project);
    const taskboard = path.join(project, 'TASKBOARD.md');
    fs.writeFileSync(taskboard, fs.readFileSync(taskboard, 'utf8').replace('This is a filled TASKBOARD.md fixture.', '[current useful outcome]'));
    const partialTools = path.join(partialBundle, 'tools');
    fs.mkdirSync(partialTools);
    const relocatedTool = path.join(partialTools, 'workbench-layout.mjs');
    fs.copyFileSync(tool, relocatedTool);
    for (const helper of ['spec-packet.mjs', 'markdown-table.mjs', 'template-placeholders.mjs', 'workbench-paths.mjs']) {
      fs.copyFileSync(path.join(runtime, helper), path.join(partialTools, helper));
    }

    const validated = spawnSync(process.execPath, [relocatedTool, 'validate', '--project', project, '--genesis'], {
      cwd: partialBundle,
      encoding: 'utf8'
    });

    assert.notEqual(validated.status, 0, `${validated.stdout}\n${validated.stderr}`);
    assert.equal(JSON.parse(validated.stdout).error.code, 'unfilled-control');

    fs.writeFileSync(taskboard, fs.readFileSync(taskboard, 'utf8').replace('[current useful outcome]', 'One selected outcome'));
    const filled = spawnSync(process.execPath, [relocatedTool, 'validate', '--project', project, '--genesis'], {
      cwd: partialBundle,
      encoding: 'utf8'
    });
    assert.equal(filled.status, 0, `${filled.stdout}\n${filled.stderr}`);
    assert.equal(JSON.parse(filled.stdout).status, 'valid');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
    fs.rmSync(partialBundle, { recursive: true, force: true });
  }
});

test('legacy twelve-skill manifests remain readable but v3.1.1 requires all four stances', () => {
  const project = fixture();
  try {
    const initialized = run('init', '--project', project, '--provenance', 'genesis', '--version', 'v3.1.0');
    assert.equal(initialized.status, 0, initialized.stdout);
    const manifestPath = path.join(project, 'workbench', 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert.deepEqual(manifest.skillPolicy.required.slice(-4), ['builder', 'auditor', 'reviewer', 'reconciler']);
    manifest.skillPolicy.required = manifest.skillPolicy.required.slice(0, 12);
    fs.writeFileSync(manifestPath, JSON.stringify(manifest));
    assert.equal(run('validate', '--project', project).report.status, 'valid');
    manifest.workbenchVersion = 'v3.1.1';
    fs.writeFileSync(manifestPath, JSON.stringify(manifest));
    assert.equal(run('validate', '--project', project).report.error.code, 'invalid-skill-policy');
    manifest.skillPolicy.required.push('builder', 'auditor', 'reviewer', 'reconciler');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest));
    assert.equal(run('validate', '--project', project).report.status, 'valid');
  } finally { fs.rmSync(project, { recursive: true, force: true }); }
});

for (const mode of ['init', 'migrate']) {
  for (const collision of ['symlink', 'ordinary']) {
    test(`${mode} preserves existing session ignore ${collision} content`, () => {
      const dir = fixture(); const outside = fixture();
      try {
        fs.mkdirSync(path.join(dir, 'workbench', 'sessions'), { recursive: true });
        if (mode === 'migrate') {
          const lanes = { specs: 'workbench/specs', wiki: 'workbench/wiki', grilling: 'workbench/grilling', handoffs: 'workbench/handoffs', feedback: 'workbench/feedback' };
          for (const lane of Object.values(lanes)) fs.mkdirSync(path.join(dir, lane), { recursive: true });
          fs.writeFileSync(path.join(dir, 'workbench', 'manifest.json'), JSON.stringify({ schemaVersion: 1, workbenchVersion: 'v3.0.0', provenance: { lifecycle: 'genesis' }, lanes }));
        }
        const ignore = path.join(dir, 'workbench', 'sessions', '.gitignore');
        const external = path.join(outside, 'rules');
        fs.writeFileSync(external, 'custom-private/\n');
        if (collision === 'symlink') fs.symlinkSync(external, ignore);
        else fs.writeFileSync(ignore, 'custom-private/\n');
        const result = run(mode, '--project', dir, '--provenance', 'genesis', '--version', VERSION);
        assert.equal(fs.readFileSync(external, 'utf8'), 'custom-private/\n');
        if (collision === 'symlink') {
          assert.notEqual(result.status, 0, result.stdout);
          assert.equal(fs.existsSync(path.join(dir, 'workbench', 'docs')), false, 'preflight refusal must not create lanes');
          if (mode === 'migrate') assert.equal(fs.existsSync(path.join(dir, 'workbench', 'grilling')), true, 'refusal must not move legacy content');
        } else {
          assert.equal(result.status, 0, result.stdout);
          assert.match(fs.readFileSync(ignore, 'utf8'), /^custom-private\/$/m);
          assert.match(fs.readFileSync(ignore, 'utf8'), /^grilling\/\*$/m);
        }
      } finally {
        fs.rmSync(dir, { recursive: true, force: true });
        fs.rmSync(outside, { recursive: true, force: true });
      }
    });
  }
}

test('init refuses a linked workbench ancestor before creating outside lanes', () => {
  const dir = fixture(); const outside = fixture();
  try {
    fs.symlinkSync(outside, path.join(dir, 'workbench'));
    const result = run('init', '--project', dir, '--provenance', 'genesis', '--version', VERSION);
    assert.notEqual(result.status, 0);
    assert.deepEqual(fs.readdirSync(outside), []);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); fs.rmSync(outside, { recursive: true, force: true }); }
});

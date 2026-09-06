#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import test from 'node:test';
import { doctor, nextWork, render } from '../workbench/tools/spec-workbench.mjs';
import { coreSkills, validateManifest } from '../workbench/tools/workbench-layout.mjs';
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

function git(cwd, ...args) {
  const result = spawnSync('git', ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', ...args], { cwd, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}

// A finished Genesis room is a Git repository whose declared integration
// branch resolves; the readiness gate fails closed without it.
function gitRoom(project, branch = 'integration') {
  git(project, 'init', '-q', '-b', 'main');
  git(project, 'commit', '-q', '--allow-empty', '-m', 'fixture');
  if (branch) git(project, 'branch', branch);
}

function installTools(project) {
  const result = spawnSync(process.execPath, [installer, 'install', '--project', project], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
}

function completeGenesis(project, options = {}) {
  if (options.tools !== false) installTools(project);
  if (options.git !== false) gitRoom(project);
  const router = fs.readFileSync(path.join(root, 'templates', 'wiki', 'MEMORY.project.md'), 'utf8')
    .replaceAll('[PROJECT_NAME]', 'Fixture').replaceAll('[HARNESS_VERSION]', VERSION.slice(1)).replaceAll('[YYYY-MM-DD]', '2026-09-01')
    .replace(/^\| \[QUESTION THIS ROOM'S MEMORY ANSWERS\].*\n/m, '').replace(/^\| \[ANOTHER DURABLE QUESTION\].*\n/m, '');
  fs.writeFileSync(path.join(project, 'workbench', 'wiki', 'MEMORY.md'), router);
  for (const control of controls) {
    const content = control === 'CLAUDE.md'
      ? '@AGENTS.md\n'
      : `# ${control}\n\n> Generated from LLM Workbench ${VERSION}.\n\n## Purpose\n\nThis is a filled ${control} fixture.\nDurable memory lives in workbench/wiki/MEMORY.md.\n${generatedRegions[control] ?? ''}`;
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
  const quietHome = fixture();
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
    assert.deepEqual(doctor(project, { home: quietHome }), [], 'an operable Genesis fixture must satisfy doctor once rendered');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
    fs.rmSync(quietHome, { recursive: true, force: true });
  }
});

test('the sessions ignore denies the legacy grilling diary name, keeps project rules byte-for-byte, and older ignore files still validate', () => {
  const project = fixture();
  try {
    assert.equal(spawnSync('git', ['init', '-q'], { cwd: project }).status, 0);
    const projectRules = '# project rule kept as written\n*.scratch\n';
    fs.mkdirSync(path.join(project, 'workbench', 'sessions'), { recursive: true });
    fs.writeFileSync(path.join(project, 'workbench', 'sessions', '.gitignore'), projectRules);
    assert.equal(run('init', '--project', project, '--provenance', 'genesis', '--version', VERSION).status, 0);
    const ignore = fs.readFileSync(path.join(project, 'workbench', 'sessions', '.gitignore'), 'utf8');
    assert.ok(ignore.startsWith(projectRules), 'existing project rules are preserved byte-for-byte');
    for (const relative of ['workbench/sessions/grilling diary/notepad.md', 'workbench/sessions/grilling/notepad.md', 'workbench/sessions/handoffs/handoff.md']) {
      assert.equal(spawnSync('git', ['check-ignore', '-q', relative], { cwd: project }).status, 0, `${relative} must be ignored`);
    }
    assert.notEqual(spawnSync('git', ['check-ignore', '-q', 'workbench/sessions/checkpoints/topic-2026-09-05.md'], { cwd: project }).status, 0, 'checkpoints stay trackable');
    // An ignore file written before the legacy line existed is still valid.
    fs.writeFileSync(path.join(project, 'workbench', 'sessions', '.gitignore'), 'grilling/*\n!grilling/.gitkeep\nhandoffs/*\n!handoffs/.gitkeep\n');
    assert.equal(run('validate', '--project', project).report.status, 'valid');
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

// The receipt hash check must be reachable from the room itself: the release
// installer is never copied into a room, so a room whose managed runtime
// disagrees with its own receipt has to fail the doctor it carries.
test('a room whose managed runtime drifts from its receipt fails the doctor it carries', () => {
  const project = fixture();
  const quietHome = fixture();
  const roomDoctor = () => {
    const result = spawnSync(process.execPath, [path.join(project, 'workbench', 'tools', 'spec-workbench.mjs'), 'doctor', '--json', '--home', quietHome], { cwd: project, encoding: 'utf8' });
    return { status: result.status, findings: result.stdout ? JSON.parse(result.stdout) : null, stderr: result.stderr };
  };
  try {
    assert.equal(run('init', '--project', project, '--provenance', 'genesis', '--version', VERSION).status, 0);
    completeGenesis(project);
    render(project);
    const clean = roomDoctor();
    assert.equal(clean.status, 0, `${clean.stderr}`);
    assert.deepEqual(clean.findings, [], 'an installed room whose runtime matches its receipt reports nothing');

    // An appended comment still parses, so the room's doctor runs; only the
    // hash the receipt recorded has changed.
    fs.appendFileSync(path.join(project, 'workbench', 'tools', 'markdown-table.mjs'), '// locally edited\n');
    const drifted = roomDoctor();
    const reported = drifted.findings?.find((item) => item.code === 'tools-receipt-drift');
    assert.ok(reported, `the room's own doctor must report tools-receipt-drift: ${JSON.stringify(drifted.findings)}`);
    assert.equal(reported.blocks, 'all', 'the registered effect is the contract');
    assert.deepEqual(reported.drift.map((entry) => [entry.tool, entry.reason]), [['markdown-table.mjs', 'hash']]);
    assert.equal(drifted.status, 1, 'a drifted managed runtime fails the doctor the room carries');
    // A room holds no release checkout, so the installed-versus-source
    // comparison cannot be made there; it is reported as unavailable rather
    // than guessed at in either direction.
    assert.equal(reported.drift[0].state, 'source-unavailable');
    assert.match(reported.drift[0].remedy, /release checkout/);

    // The receipt must not control the SCOPE of its own check. The drift
    // message above names the key to delete, and deleting it would otherwise
    // disarm the check for exactly the tampered file while ten other keys
    // still verify. A room carries no authoritative list of what should be
    // managed, so the expected set is the lane's own contents: a file the lane
    // holds that no receipt key accounts for is reported.
    const receiptPath = path.join(project, 'workbench', 'tools', '.workbench-tools.json');
    const receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
    const pruned = { ...receipt.files };
    delete pruned['markdown-table.mjs'];
    fs.writeFileSync(receiptPath, `${JSON.stringify({ ...receipt, files: pruned }, null, 2)}\n`);
    const narrowed = roomDoctor();
    const unaccounted = narrowed.findings?.find((item) => item.code === 'tools-receipt-missing');
    assert.ok(unaccounted, `a receipt pruned of the tampered file must not read as a clean runtime: ${JSON.stringify(narrowed.findings)}`);
    assert.match(unaccounted.message, /does not account for markdown-table\.mjs/);
    assert.equal(unaccounted.blocks, 'all', 'a receipt that verifies less than the lane holds blocks the same way drift does');
    assert.equal(narrowed.status, 1, 'a pruned receipt fails the doctor the room carries');
    assert.equal(fs.readFileSync(path.join(project, 'workbench', 'tools', 'markdown-table.mjs'), 'utf8').includes('// locally edited'), true,
      'the tampered file is still on disk; the pruned receipt is what changed');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
    fs.rmSync(quietHome, { recursive: true, force: true });
  }
});

// The room's coverage check derived its expected set from the lane's own
// contents, so a managed file deleted together with its receipt key left
// nothing behind to be missed. Ten of the eleven managed tools are in
// `doctor`'s own import graph and make the run fail loudly at import time;
// `sessions.mjs` is imported by none of them, so removing it and its key was a
// silent, clean run - the one false pass the coverage check could still
// produce. The authoritative managed set therefore lives in the lane the room
// installs, not only in the release-side installer a room never carries.
test('a room names a managed file deleted together with its receipt key', () => {
  const project = fixture();
  const quietHome = fixture();
  const roomDoctor = () => {
    const result = spawnSync(process.execPath, [path.join(project, 'workbench', 'tools', 'spec-workbench.mjs'), 'doctor', '--json', '--home', quietHome], { cwd: project, encoding: 'utf8' });
    return { status: result.status, findings: result.stdout ? JSON.parse(result.stdout) : null, stderr: result.stderr };
  };
  try {
    assert.equal(run('init', '--project', project, '--provenance', 'genesis', '--version', VERSION).status, 0);
    completeGenesis(project);
    render(project);
    assert.deepEqual(roomDoctor().findings, [], 'an installed room whose runtime matches its receipt reports nothing');

    // `sessions.mjs` is the managed tool no doctor import reaches, so this is
    // the deletion that used to be invisible from inside the room.
    const receiptPath = path.join(project, 'workbench', 'tools', '.workbench-tools.json');
    const receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
    const pruned = { ...receipt.files };
    delete pruned['sessions.mjs'];
    fs.rmSync(path.join(project, 'workbench', 'tools', 'sessions.mjs'));
    fs.writeFileSync(receiptPath, `${JSON.stringify({ ...receipt, files: pruned }, null, 2)}\n`);

    const gone = roomDoctor();
    const missing = gone.findings?.find((item) => item.code === 'tools-receipt-missing');
    assert.ok(missing, `a managed file removed with its key must not read as a clean runtime: ${JSON.stringify(gone.findings)}`);
    assert.match(missing.message, /does not account for sessions\.mjs/);
    assert.equal(missing.blocks, 'all', 'a runtime missing a managed tool blocks the same way drift does');
    assert.equal(gone.status, 1, 'the room doctor fails on a managed tool that is gone');
    assert.throws(() => nextWork(project), /tools-receipt-missing/, 'next must refuse a room whose managed runtime is incomplete');
    // The remedy the message names has to be one that works from a release
    // checkout: `update --explicit-update` restores both the file and the key.
    assert.match(missing.message, /workbench-tools\.mjs update .*--explicit-update/);
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
    fs.rmSync(quietHome, { recursive: true, force: true });
  }
});

// A receipt key the lane lost and a file the managed runtime never included
// are different conditions with different repairs, and one message served
// both. `update --explicit-update` rewrites a lost key, but its changed set is
// derived from the managed tool list, so it can never adopt a foreign file:
// naming it there sends the operator to a command that reports `current` and
// changes nothing.
test('a room tells a foreign lane file apart from a receipt key it lost', () => {
  const project = fixture();
  const quietHome = fixture();
  const roomDoctor = () => {
    const result = spawnSync(process.execPath, [path.join(project, 'workbench', 'tools', 'spec-workbench.mjs'), 'doctor', '--json', '--home', quietHome], { cwd: project, encoding: 'utf8' });
    return { status: result.status, findings: result.stdout ? JSON.parse(result.stdout) : null, stderr: result.stderr };
  };
  const laneFinding = () => roomDoctor().findings?.find((item) => item.code === 'tools-receipt-missing');
  try {
    assert.equal(run('init', '--project', project, '--provenance', 'genesis', '--version', VERSION).status, 0);
    completeGenesis(project);
    render(project);
    assert.deepEqual(roomDoctor().findings, [], 'an installed room whose runtime matches its receipt reports nothing');

    const smuggled = path.join(project, 'workbench', 'tools', 'smuggled.mjs');
    fs.writeFileSync(smuggled, 'export const smuggled = true;\n');
    const foreign = laneFinding();
    assert.ok(foreign, `a file the managed runtime does not include must be reported: ${JSON.stringify(roomDoctor().findings)}`);
    assert.match(foreign.message, /does not account for smuggled\.mjs/);
    assert.match(foreign.message, /move it out of/, 'the only repair for a foreign file is removing it from the lane');
    assert.doesNotMatch(foreign.message, /--explicit-update/, 'update cannot adopt a foreign file, so it must not be named here');
    fs.rmSync(smuggled);
    assert.deepEqual(roomDoctor().findings, [], 'removing the foreign file clears the finding');

    // The other half of the same message: a key the receipt lost for a file
    // the lane still holds is repaired by refreshing the receipt.
    const receiptPath = path.join(project, 'workbench', 'tools', '.workbench-tools.json');
    const receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
    const pruned = { ...receipt.files };
    delete pruned['markdown-table.mjs'];
    fs.writeFileSync(receiptPath, `${JSON.stringify({ ...receipt, files: pruned }, null, 2)}\n`);
    const lost = laneFinding();
    assert.ok(lost, 'a pruned key is still reported');
    assert.match(lost.message, /does not account for markdown-table\.mjs/);
    assert.match(lost.message, /workbench-tools\.mjs update .*--explicit-update/, 'a lost key is repaired by refreshing the receipt');
    assert.doesNotMatch(lost.message, /move it out of/, 'the managed file belongs in the lane; the receipt is what is wrong');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
    fs.rmSync(quietHome, { recursive: true, force: true });
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
    // Every module the layout tool imports is itself a managed runtime tool
  // (`RUNTIME_TOOLS`), so a relocated copy carries them; what it lacks is the
  // release checkout around them, which is the condition under test.
  for (const helper of ['diagnostics.mjs', 'spec-packet.mjs', 'markdown-table.mjs', 'template-placeholders.mjs', 'workbench-paths.mjs']) {
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
    const initialized = run('init', '--project', project, '--provenance', 'genesis', '--version', VERSION);
    assert.equal(initialized.status, 0, initialized.stdout);
    const manifestPath = path.join(project, 'workbench', 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert.deepEqual(manifest.skillPolicy.required.slice(-4), ['builder', 'auditor', 'reviewer', 'reconciler']);
    manifest.workbenchVersion = 'v3.1.0';
    manifest.provenance.source.release = 'v3.1.0';
    manifest.skillPolicy.required = manifest.skillPolicy.required.slice(0, 12);
    fs.writeFileSync(manifestPath, JSON.stringify(manifest));
    assert.equal(run('validate', '--project', project).report.status, 'valid');
    manifest.workbenchVersion = 'v3.1.1';
    manifest.provenance.source.release = 'v3.1.1';
    fs.writeFileSync(manifestPath, JSON.stringify(manifest));
    assert.equal(run('validate', '--project', project).report.error.code, 'invalid-skill-policy');
    manifest.skillPolicy.required.push('builder', 'auditor', 'reviewer', 'reconciler');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest));
    assert.equal(run('validate', '--project', project).report.status, 'valid');
  } finally { fs.rmSync(project, { recursive: true, force: true }); }
});

test('each listed legacy version validates only at the policy its release declared, and a malformed version is invalid-manifest', () => {
  const project = fixture();
  try {
    assert.equal(run('init', '--project', project, '--provenance', 'genesis', '--version', VERSION).status, 0);
    const manifestPath = path.join(project, 'workbench', 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const sixteen = manifest.skillPolicy.required;
    const twelve = sixteen.slice(0, 12);
    const outcome = (workbenchVersion, required) => {
      fs.writeFileSync(manifestPath, JSON.stringify({ ...manifest, workbenchVersion, skillPolicy: { ...manifest.skillPolicy, required } }));
      const { report } = run('validate', '--project', project);
      return report.status === 'valid' ? 'valid' : report.error.code;
    };
    // A v3.1.1 sixteen-skill manifest stays readable at this release; the
    // twelve-skill bundle belongs to v3.0.0 and v3.1.0 only.
    assert.equal(outcome('v3.1.1', sixteen), 'valid');
    assert.equal(outcome('v3.1.1', twelve), 'invalid-skill-policy');
    assert.equal(outcome('v3.1.0', twelve), 'valid');
    assert.equal(outcome('v3.0.0', twelve), 'valid');
    assert.equal(outcome(VERSION, sixteen), 'valid');
    assert.equal(outcome(VERSION, twelve), 'invalid-skill-policy');
    // An unlisted well-formed version must carry the current policy.
    assert.equal(outcome('v9.9.9', sixteen), 'valid');
    assert.equal(outcome('v9.9.9', twelve), 'invalid-skill-policy');
    // A version that is not vMAJOR.MINOR.PATCH is a malformed manifest.
    assert.equal(outcome('3.1.1', sixteen), 'invalid-manifest');
    assert.equal(outcome('unknown', sixteen), 'invalid-manifest');
  } finally { fs.rmSync(project, { recursive: true, force: true }); }
});

test('the v3.1.1 legacy row is the frozen sixteen-skill bundle, not the live current policy', () => {
  const project = fixture();
  const sixteen = [...coreSkills];
  try {
    assert.equal(run('init', '--project', project, '--provenance', 'genesis', '--version', VERSION).status, 0);
    const manifestPath = path.join(project, 'workbench', 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    // Grow the live policy in-process; the exported array backs skillPolicy.required.
    coreSkills.push('seventeenth');
    fs.writeFileSync(manifestPath, JSON.stringify({ ...manifest, workbenchVersion: 'v3.1.1', skillPolicy: { ...manifest.skillPolicy, required: sixteen } }));
    assert.equal(validateManifest(project).status, 'valid', 'a v3.1.1 sixteen-skill manifest stays readable when the current bundle grows');
    fs.writeFileSync(manifestPath, JSON.stringify({ ...manifest, workbenchVersion: VERSION, skillPolicy: { ...manifest.skillPolicy, required: sixteen } }));
    assert.equal(validateManifest(project).error?.code, 'invalid-skill-policy', 'the current version must carry the grown bundle');
  } finally {
    coreSkills.length = 0;
    coreSkills.push(...sixteen);
    fs.rmSync(project, { recursive: true, force: true });
  }
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

// S-032: the Genesis path never writes `unrecorded`. From a release checkout the
// tool resolves its own HEAD and origin; a relocated copy demands the flags.
function gitValue(cwd, ...args) {
  return spawnSync('git', args, { cwd, encoding: 'utf8' }).stdout.trim();
}

function relocateTool(bundle) {
  const partialTools = path.join(bundle, 'tools');
  fs.mkdirSync(partialTools);
  const relocatedTool = path.join(partialTools, 'workbench-layout.mjs');
  fs.copyFileSync(tool, relocatedTool);
  // Every module the layout tool imports is itself a managed runtime tool
  // (`RUNTIME_TOOLS`), so a relocated copy carries them; what it lacks is the
  // release checkout around them, which is the condition under test.
  for (const helper of ['diagnostics.mjs', 'spec-packet.mjs', 'markdown-table.mjs', 'template-placeholders.mjs', 'workbench-paths.mjs']) {
    fs.copyFileSync(path.join(runtime, helper), path.join(partialTools, helper));
  }
  return relocatedTool;
}

function cloneRelease(bundle) {
  const result = spawnSync('git', ['clone', '-q', '--no-local', root, bundle], { cwd: path.dirname(bundle), encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return path.join(bundle, 'workbench', 'tools', 'workbench-layout.mjs');
}

test('init and migrate from the release checkout resolve HEAD and origin when the source flags are omitted', () => {
  const project = fixture();
  const legacy = fixture();
  try {
    const head = gitValue(root, 'rev-parse', 'HEAD');
    const origin = gitValue(root, 'remote', 'get-url', 'origin');
    assert.match(head, /^[0-9a-f]{40}$/);
    assert.ok(origin, 'the release checkout must carry an origin remote for this case');

    const initialized = run('init', '--project', project, '--provenance', 'genesis', '--version', VERSION);
    assert.equal(initialized.status, 0, initialized.stdout);
    const manifest = JSON.parse(fs.readFileSync(path.join(project, 'workbench', 'manifest.json'), 'utf8'));
    assert.equal(manifest.provenance.source.commit, head);
    assert.equal(manifest.provenance.source.repository, origin);
    assert.equal(manifest.provenance.source.release, VERSION);

    schemaOneFixture(legacy);
    const migrated = run('migrate', '--project', legacy);
    assert.equal(migrated.status, 0, migrated.stdout);
    const migratedManifest = JSON.parse(fs.readFileSync(path.join(legacy, 'workbench', 'manifest.json'), 'utf8'));
    assert.equal(migratedManifest.provenance.source.commit, head);
    assert.equal(migratedManifest.provenance.source.repository, origin);

    const explicit = fixture();
    try {
      const pinned = run('init', '--project', explicit, '--provenance', 'genesis', '--version', VERSION, '--source-commit', 'a'.repeat(40), '--source-repository', 'https://example.invalid/workbench.git');
      assert.notEqual(pinned.status, 0, pinned.stdout);
      assert.equal(pinned.report.error.code, 'invalid-source-identity');
      assert.match(pinned.report.error.message, /does not match/);
      assert.equal(fs.existsSync(path.join(explicit, 'workbench')), false, 'contradictory source assertions must fail before mutation');
    } finally { fs.rmSync(explicit, { recursive: true, force: true }); }

    const asserted = fixture();
    try {
      const matching = run('init', '--project', asserted, '--provenance', 'genesis', '--version', VERSION, '--source-commit', head, '--source-repository', origin);
      assert.equal(matching.status, 0, matching.stdout);
      assert.deepEqual(matching.report.manifest.provenance.source, { repository: origin, release: VERSION, commit: head });
    } finally { fs.rmSync(asserted, { recursive: true, force: true }); }

    const malformed = fixture();
    try {
      const rejected = run('init', '--project', malformed, '--provenance', 'genesis', '--version', VERSION, '--source-commit', 'abc123');
      assert.notEqual(rejected.status, 0, rejected.stdout);
      assert.equal(rejected.report.error.code, 'invalid-source-identity');
      assert.match(rejected.report.error.message, /40-character/);
      assert.equal(fs.existsSync(path.join(malformed, 'workbench')), false);
    } finally { fs.rmSync(malformed, { recursive: true, force: true }); }
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
    fs.rmSync(legacy, { recursive: true, force: true });
  }
});

test('a relocated partial copy refuses init and migrate even when source strings are supplied', () => {
  const project = fixture();
  const legacy = fixture();
  const bundle = fixture();
  try {
    const relocatedTool = relocateTool(bundle);
    const relocated = (...args) => {
      const result = spawnSync(process.execPath, [relocatedTool, ...args], { cwd: bundle, encoding: 'utf8' });
      return { ...result, report: result.stdout ? JSON.parse(result.stdout) : null };
    };

    const refused = relocated('init', '--project', project, '--provenance', 'genesis', '--version', VERSION);
    assert.notEqual(refused.status, 0, refused.stdout);
    assert.equal(refused.report.error.code, 'invalid-source-identity');
    assert.match(refused.report.error.message, /verified Workbench release checkout/);
    assert.equal(fs.existsSync(path.join(project, 'workbench')), false, 'a refused init must create nothing');

    const partial = relocated('init', '--project', project, '--provenance', 'genesis', '--version', VERSION, '--source-commit', 'b'.repeat(40));
    assert.notEqual(partial.status, 0, partial.stdout);
    assert.equal(partial.report.error.code, 'invalid-source-identity');
    assert.match(partial.report.error.message, /verified Workbench release checkout/);
    assert.equal(fs.existsSync(path.join(project, 'workbench')), false);

    schemaOneFixture(legacy);
    const refusedMigrate = relocated('migrate', '--project', legacy);
    assert.notEqual(refusedMigrate.status, 0, refusedMigrate.stdout);
    assert.equal(refusedMigrate.report.error.code, 'invalid-source-identity');
    assert.match(refusedMigrate.report.error.message, /verified Workbench release checkout/);
    assert.equal(fs.existsSync(path.join(legacy, 'workbench', 'grilling')), true, 'a refused migrate must not move legacy content');
    assert.equal(JSON.parse(fs.readFileSync(path.join(legacy, 'workbench', 'manifest.json'), 'utf8')).schemaVersion, 1);

    const pinned = relocated('init', '--project', project, '--provenance', 'genesis', '--version', VERSION, '--source-commit', 'b'.repeat(40), '--source-repository', 'https://example.invalid/workbench.git');
    assert.notEqual(pinned.status, 0, pinned.stdout);
    assert.equal(pinned.report.error.code, 'invalid-source-identity');
    assert.match(pinned.report.error.message, /verified Workbench release checkout/);
    assert.equal(fs.existsSync(path.join(project, 'workbench')), false, 'supplied strings cannot make a relocated partial tool a verified source');
    assert.equal(fs.readFileSync(tool, 'utf8').includes("'unrecorded'"), false, 'the layout tool must carry no unrecorded placeholder');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
    fs.rmSync(legacy, { recursive: true, force: true });
    fs.rmSync(bundle, { recursive: true, force: true });
  }
});

test('init refuses a dirty release template before mutating the target project', () => {
  const project = fixture();
  const parent = fixture();
  const bundle = path.join(parent, 'release');
  try {
    const clonedTool = cloneRelease(bundle);
    fs.appendFileSync(path.join(bundle, 'templates', 'wiki', 'SCHEMA.md'), '\nDirty source template.\n');
    const result = spawnSync(process.execPath, [clonedTool, 'init', '--project', project, '--provenance', 'genesis', '--version', VERSION], {
      cwd: bundle,
      encoding: 'utf8'
    });
    const report = result.stdout ? JSON.parse(result.stdout) : null;
    assert.notEqual(result.status, 0, result.stdout);
    assert.equal(report.error.code, 'invalid-source-identity');
    assert.match(report.error.message, /uncommitted/);
    assert.equal(fs.existsSync(path.join(project, 'workbench')), false, 'dirty template bytes fail before target mutation');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
    fs.rmSync(parent, { recursive: true, force: true });
  }
});

test('the layout usage string lists both source flags for init and migrate', () => {
  const usage = run('help');
  assert.notEqual(usage.status, 0);
  assert.equal(usage.report.error.code, 'invalid-invocation');
  const [initUsage, migrateUsage] = usage.report.error.message.split(' | ');
  assert.match(initUsage, /^Usage: workbench-layout\.mjs init /);
  assert.match(initUsage, /--source-commit SHA/);
  assert.match(initUsage, /--source-repository URL/);
  assert.match(migrateUsage, /^migrate /);
  assert.match(migrateUsage, /--source-commit SHA/);
  assert.match(migrateUsage, /--source-repository URL/);
});

test('the template permission file grants Edit on every authorship lane the prose declares writable', () => {
  const settings = JSON.parse(fs.readFileSync(path.join(root, 'templates', '.claude', 'settings.json'), 'utf8'));
  const { allow, ask, deny } = settings.permissions;
  const rule = (tool, target) => `${tool}(./${target}/**)`;
  for (const [name, lane] of Object.entries(LANES)) {
    if (name === 'tools') {
      assert.ok(ask.includes(rule('Edit', lane)), `${lane} must sit in ask for Edit`);
      assert.equal(allow.some((entry) => /^Edit\(/.test(entry) && entry.includes(lane)), false, `${lane} must not be granted Edit in allow`);
      continue;
    }
    assert.ok(allow.includes(rule('Edit', lane)), `${lane} must have an Edit allow rule`);
    assert.equal(deny.some((entry) => /^Edit\(/.test(entry) && entry.includes(lane)), false, `${lane} must not be denied`);
  }
  assert.equal([...allow, ...ask, ...deny].some((entry) => /^Write\(/.test(entry)), false,
    'path-scoped Write rules are not the Claude Code file-permission seam');
  assert.ok(allow.includes('Edit(./LEXICON.md)'), 'LEXICON.md is a root control agents keep current');
  for (const tool of ['spec-workbench', 'adr', 'sessions', 'wiki', 'workbench-layout']) {
    assert.ok(allow.includes(`Bash(node workbench/tools/${tool}.mjs:*)`), `${tool}.mjs must be runnable without a prompt`);
  }
  const readme = fs.readFileSync(path.join(root, 'templates', '.claude', 'README.md'), 'utf8');
  assert.match(readme, /Edit rules apply to all built-in tools that edit files/i, 'the README names the supported file-permission seam');
  assert.match(readme, /^\| \*\*Workbench authorship lanes\*\*.*`allow` \(`Edit`\)/m, 'the mapping table names the lanes as its fourth row');
  for (const protocol of ['GENESIS.md', 'ADOPTION.md']) {
    const content = fs.readFileSync(path.join(root, 'templates', protocol), 'utf8');
    assert.match(content, /writable roots and the\s+Workbench authorship lanes -> `allow`\s+\(`Edit`\)/, `${protocol} Phase 4 names the lanes`);
    assert.match(content, /grants `Edit`\s+on\s+the declared authorship lanes/, `${protocol} completion box asks for the grant`);
    assert.match(content, /`\.claude\/` was omitted with a\s+reason/, `${protocol} completion box preserves the omission route`);
  }
});

test('Genesis readiness fails closed on a permission file that withholds a declared authorship lane', () => {
  const project = fixture();
  try {
    assert.equal(run('init', '--project', project, '--provenance', 'genesis', '--version', VERSION).status, 0);
    completeGenesis(project);
    const settings = path.join(project, '.claude', 'settings.json');
    fs.mkdirSync(path.dirname(settings));
    fs.writeFileSync(settings, JSON.stringify({ permissions: { deny: ['Write(./secrets/**)'], ask: ['Bash(git push:*)'], allow: ['Edit(./src/**)', 'Edit(./AGENTS.md)'] } }));

    const drifted = run('validate', '--project', project, '--genesis');

    assert.notEqual(drifted.status, 0, drifted.stdout);
    assert.equal(drifted.report.error.code, 'permission-scope-drift');
    assert.equal(drifted.report.error.control, '.claude/settings.json');
    assert.deepEqual(drifted.report.error.lanes.map((entry) => entry.lane).sort(), ['docs', 'feedback', 'sessions', 'specs', 'wiki']);
    assert.ok(typeof drifted.report.error.reason === 'string' && drifted.report.error.reason.length > 0, 'the rejection names the withheld lanes');

    fs.copyFileSync(path.join(root, 'templates', '.claude', 'settings.json'), settings);
    const granted = run('validate', '--project', project, '--genesis');
    assert.equal(granted.status, 0, granted.stdout);
    assert.equal(granted.report.status, 'valid');

    fs.rmSync(path.dirname(settings), { recursive: true, force: true });
    const absent = run('validate', '--project', project, '--genesis');
    assert.equal(absent.status, 0, absent.stdout);
    assert.equal(absent.report.status, 'valid', 'a room without the file is unaffected');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
  }
});

test('Genesis readiness requires version-matched wiki contract and room brain stamps', () => {
  const project = fixture();
  try {
    assert.equal(run('init', '--project', project, '--provenance', 'genesis', '--version', VERSION).status, 0);
    completeGenesis(project);
    assert.equal(run('validate', '--project', project, '--genesis').report.status, 'valid');
    const schema = path.join(project, 'workbench', 'wiki', 'SCHEMA.md');
    fs.writeFileSync(schema, fs.readFileSync(schema, 'utf8').replace(VERSION, 'v2.3.0'));
    const stale = run('validate', '--project', project, '--genesis');
    assert.notEqual(stale.status, 0);
    assert.equal(stale.report.error.code, 'version-mismatch');
    assert.equal(stale.report.error.control, 'workbench/wiki/SCHEMA.md');
    assert.match(stale.report.error.message, /SCHEMA\.md/);
    assert.ok(typeof stale.report.error.reason === 'string' && stale.report.error.reason.length > 0, 'the failure names its predicate');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
  }
});

test('init declares the integration branch, the Genesis gate fails closed until it resolves, and a manifest without the block stays valid', () => {
  const project = fixture();
  try {
    const initialized = run('init', '--project', project, '--provenance', 'genesis', '--version', VERSION, '--default-branch', 'trunk', '--integration-branch', 'Integration');
    assert.equal(initialized.status, 0, initialized.stdout);
    assert.deepEqual(initialized.report.manifest.git, { defaultBranch: 'trunk', integrationBranch: 'Integration' }, 'init writes the exact declared names');
    completeGenesis(project, { git: false });
    assert.equal(run('validate', '--project', project).report.status, 'valid', 'plain validation never requires the branch');

    const missing = run('validate', '--project', project, '--genesis');
    assert.notEqual(missing.status, 0);
    assert.equal(missing.report.error.code, 'integration-branch-missing');
    assert.equal(missing.report.error.branch, 'Integration');
    assert.match(missing.report.error.message, /Integration/);

    gitRoom(project, null);
    git(project, 'branch', 'integration');
    const wrongCase = run('validate', '--project', project, '--genesis');
    assert.equal(wrongCase.report.error.code, 'integration-branch-missing', 'the declaration carries the exact name; a differently cased branch does not satisfy it');
    // A case-insensitive filesystem cannot hold both spellings as loose refs.
    git(project, 'branch', '-d', 'integration');
    git(project, 'branch', 'Integration');
    const ready = run('validate', '--project', project, '--genesis');
    assert.equal(ready.status, 0, ready.stdout);
    assert.equal(ready.report.status, 'valid');

    const manifestPath = path.join(project, 'workbench', 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    delete manifest.git;
    fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    assert.equal(run('validate', '--project', project).report.status, 'valid', 'a manifest without the git block stays valid');
    const undeclared = run('validate', '--project', project, '--genesis');
    assert.notEqual(undeclared.status, 0);
    assert.equal(undeclared.report.error.code, 'integration-branch-undeclared');

    manifest.git = { defaultBranch: 'main', integrationBranch: 'bad branch' };
    fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    assert.equal(run('validate', '--project', project).report.error.code, 'invalid-manifest', 'a malformed git block is a malformed manifest');
    const rejected = run('init', '--project', fixture(), '--provenance', 'genesis', '--version', VERSION, '--integration-branch', '-bad');
    assert.notEqual(rejected.status, 0);
    assert.equal(rejected.report.error.code, 'invalid-branch');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
  }
});

test('init and migrate default the declaration to origin/HEAD and an existing integration-named branch by its exact case', () => {
  const project = fixture();
  const migrated = fixture();
  try {
    gitRoom(project, 'Integration');
    git(project, 'remote', 'add', 'origin', project);
    git(project, 'update-ref', 'refs/remotes/origin/trunk', 'HEAD');
    git(project, 'symbolic-ref', 'refs/remotes/origin/HEAD', 'refs/remotes/origin/trunk');
    const initialized = run('init', '--project', project, '--provenance', 'genesis', '--version', VERSION);
    assert.equal(initialized.status, 0, initialized.stdout);
    assert.deepEqual(initialized.report.manifest.git, { defaultBranch: 'trunk', integrationBranch: 'Integration' });

    schemaOneFixture(migrated);
    gitRoom(migrated, null);
    const report = run('migrate', '--project', migrated);
    assert.equal(report.status, 0, report.stdout);
    assert.deepEqual(report.report.manifest.git, { defaultBranch: 'main', integrationBranch: 'integration' }, 'a schema 1 migration declares the checked-out default branch and the default integration name');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
    fs.rmSync(migrated, { recursive: true, force: true });
  }
});

test('HEAD is not a branch name: init refuses it and a symref never satisfies the declaration', () => {
  const project = fixture();
  try {
    const rejected = run('init', '--project', project, '--provenance', 'genesis', '--version', VERSION, '--integration-branch', 'HEAD');
    assert.notEqual(rejected.status, 0, rejected.stdout);
    assert.equal(rejected.report.error.code, 'invalid-branch');
    assert.equal(fs.existsSync(path.join(project, 'workbench')), false, 'a refused init writes nothing');

    assert.equal(run('init', '--project', project, '--provenance', 'genesis', '--version', VERSION).status, 0);
    completeGenesis(project, { git: false });
    gitRoom(project, null);
    git(project, 'remote', 'add', 'origin', project);
    git(project, 'symbolic-ref', 'refs/remotes/origin/HEAD', 'refs/heads/main');
    const manifestPath = path.join(project, 'workbench', 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    manifest.git.integrationBranch = 'HEAD';
    fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    assert.equal(run('validate', '--project', project).report.error.code, 'invalid-manifest', 'a manifest declaring HEAD is malformed even though origin/HEAD is a symref');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
  }
});

// S-042 TK-001: the generation of a seeded lane document is recorded only from
// bytes this command can verify, and a copy the room changed is never rewritten.
test('seed-documents records a verifiable generation and never rewrites an adjusted copy', () => {
  const project = fixture();
  const bundle = fixture();
  try {
    assert.equal(run('init', '--project', project, '--provenance', 'genesis', '--version', VERSION).status, 0);
    const relative = 'workbench/feedback/REPORT_FORMAT.md';
    const document = path.join(project, relative);
    const recordPath = path.join(project, 'workbench', '.workbench-seed.json');
    const template = fs.readFileSync(path.join(root, 'templates', 'feedback', 'REPORT_FORMAT.md'));
    assert.equal(fs.existsSync(recordPath), false, 'init writes no seed record; seeding a lane document is an explicit command');

    const seeded = run('seed-documents', '--project', project);
    assert.equal(seeded.status, 0, seeded.stdout);
    assert.deepEqual(seeded.report.written, [{ document: relative, action: 'seeded' }]);
    assert.deepEqual(seeded.report.retained, []);
    assert.equal(fs.readFileSync(document, 'utf8'), template.toString('utf8'));
    assert.equal(JSON.parse(fs.readFileSync(recordPath, 'utf8')).documents[relative].release, VERSION);

    const again = run('seed-documents', '--project', project);
    assert.deepEqual(again.report.written, [{ document: relative, action: 'recorded' }], 'byte equality with the release copy is evidence of the generation');

    // A copy still identical to what an older release seeded is refreshed.
    const older = `${template.toString('utf8')}\nSeeded by an older release.\n`;
    fs.writeFileSync(document, older);
    const record = JSON.parse(fs.readFileSync(recordPath, 'utf8'));
    record.documents[relative] = { release: 'v3.1.0', contentHash: createHash('sha256').update(Buffer.from(older)).digest('hex') };
    fs.writeFileSync(recordPath, `${JSON.stringify(record, null, 2)}\n`);
    const refreshed = run('seed-documents', '--project', project);
    assert.deepEqual(refreshed.report.written, [{ document: relative, action: 'refreshed' }]);
    assert.equal(fs.readFileSync(document, 'utf8'), template.toString('utf8'), 'an untouched older copy is brought current without a reinstall');
    assert.equal(JSON.parse(fs.readFileSync(recordPath, 'utf8')).documents[relative].release, VERSION);

    fs.appendFileSync(document, '\nLocal note this room added.\n');
    const adjusted = run('seed-documents', '--project', project);
    assert.deepEqual(adjusted.report.written, [], 'a repair never rewrites content it did not add');
    assert.deepEqual(adjusted.report.retained.map((entry) => entry.document), [relative]);
    assert.match(adjusted.report.retained[0].reason, /changed after it was seeded/);
    assert.match(fs.readFileSync(document, 'utf8'), /Local note this room added\./);

    const relocatedTool = relocateTool(bundle);
    const refused = spawnSync(process.execPath, [relocatedTool, 'seed-documents', '--project', project], { cwd: bundle, encoding: 'utf8' });
    assert.notEqual(refused.status, 0, refused.stdout);
    assert.equal(JSON.parse(refused.stdout).error.code, 'invalid-source-identity');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
    fs.rmSync(bundle, { recursive: true, force: true });
  }
});

// S-042 TK-003: an existing room can record verified source identity without a
// reinstall, under the same verification init carries.
test('record-source repairs placeholder provenance for an existing room and refuses what it cannot verify', () => {
  const project = fixture();
  const bundle = fixture();
  try {
    assert.equal(run('init', '--project', project, '--provenance', 'genesis', '--version', VERSION).status, 0);
    const manifestPath = path.join(project, 'workbench', 'manifest.json');
    const initialized = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const verified = initialized.provenance.source;
    const provenance = () => doctor(project).filter((item) => item.code === 'unverified-provenance');
    assert.deepEqual(provenance(), [], 'a room initialized from the release checkout records a verifiable identity');

    initialized.provenance.source = { repository: '', release: 'v3.1.0', commit: 'unknown' };
    fs.writeFileSync(manifestPath, `${JSON.stringify(initialized, null, 2)}\n`);
    assert.deepEqual(provenance().map((item) => item.field).sort(), ['commit', 'release', 'repository']);

    const relocatedTool = relocateTool(bundle);
    const refused = spawnSync(process.execPath, [relocatedTool, 'record-source', '--project', project], { cwd: bundle, encoding: 'utf8' });
    assert.notEqual(refused.status, 0, refused.stdout);
    assert.equal(JSON.parse(refused.stdout).error.code, 'invalid-source-identity');
    assert.match(JSON.parse(refused.stdout).error.message, /verified Workbench release checkout/);
    assert.equal(JSON.parse(fs.readFileSync(manifestPath, 'utf8')).provenance.source.commit, 'unknown', 'a refused recording writes nothing');

    const mismatched = run('record-source', '--project', project, '--version', 'v9.9.9');
    assert.notEqual(mismatched.status, 0, mismatched.stdout);
    assert.equal(mismatched.report.error.code, 'invalid-source-identity');
    assert.match(mismatched.report.error.message, /verified checkout release/);

    const pinned = run('record-source', '--project', project, '--source-commit', 'b'.repeat(40));
    assert.notEqual(pinned.status, 0, pinned.stdout);
    assert.equal(pinned.report.error.code, 'invalid-source-identity');

    const recorded = run('record-source', '--project', project);
    assert.equal(recorded.status, 0, recorded.stdout);
    assert.equal(recorded.report.status, 'recorded');
    const after = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert.deepEqual(after.provenance.source, verified, 'the verified identity replaces the placeholder');
    assert.equal(after.provenance.lifecycle, 'genesis', 'nothing else in the manifest changes');
    assert.deepEqual(after.lanes, LANES);
    assert.deepEqual(provenance(), [], 'recording the verified identity clears the finding');
    assert.equal(run('validate', '--project', project).report.status, 'valid');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
    fs.rmSync(bundle, { recursive: true, force: true });
  }
});

// S-044 TK-002: an agent arriving at a room must be able to ask the room which
// lifecycle route its own contents support, and be told `unclassifiable` with
// reasons when they support two. The recorded rule lives in
// `workbench/specs/S-044-legacy-room-classification/SPEC.md`.
const classifier = path.join(root, 'tools', 'workbench-classify.mjs');

function classify(project) {
  const result = spawnSync(process.execPath, [classifier, 'classify', '--project', project], { cwd: root, encoding: 'utf8' });
  return { ...result, report: result.stdout ? JSON.parse(result.stdout) : null };
}

// A read-only command must leave every path, size, and modification time alone.
function roomSnapshot(target, base = target, entries = []) {
  for (const entry of fs.readdirSync(target, { withFileTypes: true }).sort((left, right) => left.name.localeCompare(right.name))) {
    const candidate = path.join(target, entry.name);
    const stat = fs.lstatSync(candidate);
    entries.push(`${path.relative(base, candidate)}|${stat.isDirectory() ? 'd' : 'f'}|${stat.size}|${stat.mtimeMs}`);
    if (stat.isDirectory() && !stat.isSymbolicLink()) roomSnapshot(candidate, base, entries);
  }
  return entries;
}

function legacyRoom(project, { stamp } = {}) {
  for (const control of controls) {
    const banner = stamp ? `\n> Part of LLM Workbench ${stamp}.\n` : '\n';
    fs.writeFileSync(path.join(project, control), `# ${control}\n${banner}\nProject truth.\n`);
  }
  fs.mkdirSync(path.join(project, 'specs', 'S-001-legacy'), { recursive: true });
  fs.writeFileSync(path.join(project, 'specs', 'S-001-legacy', 'SPEC.md'), '# S-001 - Legacy Capability\n');
  fs.mkdirSync(path.join(project, 'handoffs'), { recursive: true });
  fs.writeFileSync(path.join(project, 'handoffs', 'recovery.md'), '# Recovery point\n');
}

test('classify reports a lifecycle verdict with its evidence and writes nothing', () => {
  const bare = fixture();
  const legacy = fixture();
  const current = fixture();
  const ambiguous = fixture();
  const working = fixture();
  try {
    // 1. A bare directory: nothing to derive filled controls from.
    const bareBefore = roomSnapshot(bare);
    const bareResult = classify(bare);
    assert.equal(bareResult.status, 0, `${bareResult.stdout}${bareResult.stderr}`);
    assert.equal(bareResult.report.verdict, 'genesis');
    assert.deepEqual(roomSnapshot(bare), bareBefore, 'classify must write nothing into a bare room');

    // 2. An already-adopted room still on a v2 root: a release stamped it, so
    //    the layout-only upgrade route is the one its evidence supports.
    legacyRoom(legacy, { stamp: 'v3.0.0' });
    const legacyBefore = roomSnapshot(legacy);
    const legacyResult = classify(legacy);
    assert.equal(legacyResult.status, 0, `${legacyResult.stdout}${legacyResult.stderr}`);
    assert.equal(legacyResult.report.verdict, 'upgrade');
    assert.deepEqual(legacyResult.report.evidence.versionStamp.stamped, controls,
      'the verdict must report which controls carry a Workbench version stamp');
    assert.equal(legacyResult.report.evidence.manifest.present, false);
    assert.ok(legacyResult.report.evidence.legacyControlShapes.legacyPaths.includes('specs'),
      'the legacy v2 lane shapes found must be reported as evidence');
    assert.deepEqual(roomSnapshot(legacy), legacyBefore, 'classify must write nothing into a legacy room');

    // 3. A current v3 room: an installed room is neither a genesis nor a second
    //    adoption, and its recorded lifecycle is evidence rather than verdict.
    const initialized = run('init', '--project', current, '--provenance', 'adoption', '--version', VERSION);
    assert.equal(initialized.status, 0, initialized.stdout);
    const currentBefore = roomSnapshot(current);
    const currentResult = classify(current);
    assert.equal(currentResult.status, 0, `${currentResult.stdout}${currentResult.stderr}`);
    assert.equal(currentResult.report.verdict, 'upgrade');
    assert.equal(currentResult.report.evidence.manifest.schemaVersion, 2);
    assert.equal(currentResult.report.evidence.manifest.lifecycle, 'adoption',
      'the recorded lifecycle is reported as evidence, never as the verdict');
    assert.deepEqual(roomSnapshot(current), currentBefore, 'classify must write nothing into an installed room');

    // 4. Harness-shaped, but no manifest and no version stamp: an unstamped
    //    Workbench room and an independent dialect produce the same evidence.
    legacyRoom(ambiguous);
    const ambiguousBefore = roomSnapshot(ambiguous);
    const ambiguousResult = classify(ambiguous);
    assert.equal(ambiguousResult.status, 0, `${ambiguousResult.stdout}${ambiguousResult.stderr}`);
    assert.equal(ambiguousResult.report.verdict, 'unclassifiable',
      'a harness-shaped room with no manifest and no stamp must not be guessed');
    assert.ok(ambiguousResult.report.reasons.length > 0, 'unclassifiable must list the reasons');
    assert.ok(ambiguousResult.report.reasons.some((reason) => /upgrade/.test(reason) && /adoption/.test(reason)),
      'the reasons must name both readings the evidence supports');
    assert.deepEqual(ambiguousResult.report.evidence.versionStamp.stamped, []);
    assert.deepEqual(roomSnapshot(ambiguous), ambiguousBefore, 'classify must write nothing into an ambiguous room');

    // 5. A working repository with real content and no Workbench installation.
    fs.mkdirSync(path.join(working, 'src'));
    fs.writeFileSync(path.join(working, 'src', 'app.js'), 'export const app = true;\n');
    fs.writeFileSync(path.join(working, 'README.md'), '# Working project\n');
    fs.writeFileSync(path.join(working, 'ROADMAP.md'), '# Roadmap\n');
    const workingBefore = roomSnapshot(working);
    const workingResult = classify(working);
    assert.equal(workingResult.status, 0, `${workingResult.stdout}${workingResult.stderr}`);
    assert.equal(workingResult.report.verdict, 'adoption');
    assert.deepEqual(workingResult.report.evidence.legacyControlShapes.controlsPresent, ['README.md']);
    assert.deepEqual(roomSnapshot(working), workingBefore, 'classify must write nothing into a working room');
  } finally {
    for (const project of [bare, legacy, current, ambiguous, working]) fs.rmSync(project, { recursive: true, force: true });
  }
});

test('classify refuses to guess a support root that carries no readable manifest', () => {
  const project = fixture();
  try {
    fs.mkdirSync(path.join(project, 'workbench', 'specs'), { recursive: true });
    const before = roomSnapshot(project);
    const result = classify(project);
    assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
    assert.equal(result.report.verdict, 'unclassifiable');
    assert.ok(result.report.reasons.some((reason) => /manifest/.test(reason)),
      'the reason must name the unreadable support-root authority');
    assert.equal(result.report.evidence.supportRoot.present, true);
    assert.equal(result.report.evidence.manifest.readable, false);
    assert.deepEqual(roomSnapshot(project), before, 'classify must write nothing while refusing');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
  }
});

// S-044 TK-002 repair: the recorded rule mislabelled three real rooms. Each
// case below is the room the separate-context review named.

test('classify corroborates the root tools/ shape before calling a room harness-shaped', () => {
  const vanilla = fixture();
  const unstamped = fixture();
  try {
    // A vanilla Node application that happens to carry one generic filename
    // from the managed runtime set. Six of the seven controls are absent.
    fs.writeFileSync(path.join(vanilla, 'README.md'), '# Vanilla app\n');
    fs.writeFileSync(path.join(vanilla, 'package.json'), '{ "name": "vanilla" }\n');
    fs.mkdirSync(path.join(vanilla, 'src'));
    fs.writeFileSync(path.join(vanilla, 'src', 'index.js'), 'export const app = true;\n');
    fs.mkdirSync(path.join(vanilla, 'tools'));
    fs.writeFileSync(path.join(vanilla, 'tools', 'privacy.mjs'), 'export const privacy = true;\n');
    const vanillaBefore = roomSnapshot(vanilla);
    const vanillaResult = classify(vanilla);
    assert.equal(vanillaResult.status, 0, `${vanillaResult.stdout}${vanillaResult.stderr}`);
    assert.equal(vanillaResult.report.verdict, 'adoption',
      'one generic managed filename cannot make a room whose own evidence shows six absent controls harness-shaped');
    assert.deepEqual(roomSnapshot(vanilla), vanillaBefore, 'classify must write nothing into a vanilla room');

    // The corroborated shape still catches the room it exists for: an unstamped
    // Workbench room carrying the whole control set stays unclassifiable.
    legacyRoom(unstamped);
    fs.mkdirSync(path.join(unstamped, 'tools'));
    fs.writeFileSync(path.join(unstamped, 'tools', 'privacy.mjs'), 'export const privacy = true;\n');
    const unstampedResult = classify(unstamped);
    assert.equal(unstampedResult.status, 0, `${unstampedResult.stdout}${unstampedResult.stderr}`);
    assert.equal(unstampedResult.report.verdict, 'unclassifiable',
      'a genuine unstamped Workbench room must still refuse to be guessed');
  } finally {
    for (const project of [vanilla, unstamped]) fs.rmSync(project, { recursive: true, force: true });
  }
});

test('classify refuses a workbench/manifest.json that is not a Workbench manifest', () => {
  const bodies = [
    ['an unrelated JSON object', '{ "name": "my-workbench-app", "version": "1.0.0" }\n'],
    ['a JSON array', '[]\n'],
    ['a JSON null', 'null\n'],
    // A schemaVersion the room carries but does not fill in, and the three
    // shapes that are not the integer every Workbench manifest records.
    ['a null schemaVersion', '{ "schemaVersion": null }\n'],
    ['a string schemaVersion', '{ "schemaVersion": "two" }\n'],
    ['an array schemaVersion', '{ "schemaVersion": [2] }\n'],
    ['an object schemaVersion', '{ "schemaVersion": { "n": 2 } }\n']
  ];
  for (const [label, body] of bodies) {
    const project = fixture();
    try {
      fs.mkdirSync(path.join(project, 'workbench'));
      fs.writeFileSync(path.join(project, 'workbench', 'manifest.json'), body);
      const before = roomSnapshot(project);
      const result = classify(project);
      assert.equal(result.status, 0, `${label}: ${result.stdout}${result.stderr}`);
      assert.equal(result.report.status, 'classified', `${label} is a room condition, not an unreadable invocation`);
      assert.equal(result.report.verdict, 'unclassifiable', `${label} must not read as an installed Workbench room`);
      assert.equal(result.report.evidence.manifest.readable, false, `${label} is not a readable manifest`);
      assert.deepEqual(roomSnapshot(project), before, `${label}: classify must write nothing while refusing`);
    } finally {
      fs.rmSync(project, { recursive: true, force: true });
    }
  }
});

test('classify never reads a workbench/ symlink out of the room', () => {
  const installed = fixture();
  const borrower = fixture();
  try {
    assert.equal(run('init', '--project', installed, '--provenance', 'genesis', '--version', VERSION).status, 0);
    fs.writeFileSync(path.join(borrower, 'README.md'), '# Borrowed room\n');
    fs.symlinkSync(path.join(installed, 'workbench'), path.join(borrower, 'workbench'), 'dir');
    const before = roomSnapshot(borrower);
    const result = classify(borrower);
    assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
    assert.equal(result.report.verdict, 'unclassifiable',
      "another room's manifest, reached through a symlink, cannot make this room an installed room");
    assert.equal(result.report.evidence.supportRoot.present, true);
    assert.equal(result.report.evidence.supportRoot.ordinaryDirectory, false);
    assert.equal(result.report.evidence.manifest.readable, false, 'nothing may be read through a support-root symlink');
    assert.deepEqual(roomSnapshot(borrower), before, 'classify must write nothing while refusing');
  } finally {
    for (const project of [installed, borrower]) fs.rmSync(project, { recursive: true, force: true });
  }
});

test('classify treats an unreadable root control as a room condition, not a crash', () => {
  if (typeof process.getuid === 'function' && process.getuid() === 0) return;
  const stamped = fixture();
  const working = fixture();
  try {
    legacyRoom(stamped, { stamp: 'v3.0.0' });
    fs.chmodSync(path.join(stamped, 'LEXICON.md'), 0o000);
    const stampedResult = classify(stamped);
    assert.equal(stampedResult.status, 0, `${stampedResult.stdout}${stampedResult.stderr}`);
    assert.equal(stampedResult.report.status, 'classified', 'an unreadable control is a room condition, not an unreadable invocation');
    assert.equal(stampedResult.report.verdict, 'upgrade', 'the six readable controls still carry the stamp');
    assert.deepEqual(stampedResult.report.evidence.versionStamp.unreadable, ['LEXICON.md'],
      'the control that could not be read must be reported as evidence');

    fs.writeFileSync(path.join(working, 'README.md'), '# Working project\n');
    fs.mkdirSync(path.join(working, 'src'));
    fs.writeFileSync(path.join(working, 'src', 'app.js'), 'export const app = true;\n');
    fs.chmodSync(path.join(working, 'README.md'), 0o000);
    const workingResult = classify(working);
    assert.equal(workingResult.status, 0, `${workingResult.stdout}${workingResult.stderr}`);
    assert.equal(workingResult.report.verdict, 'unclassifiable',
      'a control that cannot be read leaves the stamp evidence incomplete, so the room cannot be classified');
  } finally {
    for (const [project, control] of [[stamped, 'LEXICON.md'], [working, 'README.md']]) {
      try { fs.chmodSync(path.join(project, control), 0o644); } catch { /* already gone */ }
      fs.rmSync(project, { recursive: true, force: true });
    }
  }
});

test('importing the classifier does not run its command line', () => {
  const probe = spawnSync(process.execPath, ['--input-type=module', '-e',
    `import(${JSON.stringify(pathToFileURL(classifier).href)}).then((module) => process.stdout.write(typeof module.classify));`
  ], { cwd: root, encoding: 'utf8' });
  assert.equal(probe.status, 0, `${probe.stdout}${probe.stderr}`);
  assert.equal(probe.stdout, 'function', 'importing the tool must export classify without printing a usage refusal');
});

test('classify reports the unfilled state of a straight template copy as evidence', () => {
  const copied = fixture();
  try {
    for (const control of controls) {
      fs.writeFileSync(path.join(copied, control), `# ${control}\n\n> Part of LLM Workbench v[HARNESS_VERSION].\n\n[BRACKETED_PROJECT]\n`);
    }
    const result = classify(copied);
    assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
    assert.equal(result.report.verdict, 'unclassifiable');
    assert.deepEqual(result.report.evidence.legacyControlShapes.controlsBracketed, controls,
      'an unfilled control is evidence about the room, and the adoption preflight refuses on the same shape');
    assert.equal(result.report.evidence.versionStamp.unresolved.length, controls.length,
      'a banner whose version never resolved is not a Workbench version stamp, and the difference must be visible');
    assert.ok(result.report.reasons.some((reason) => /\[BRACKETED\] placeholder/.test(reason)),
      'the reasons must offer the unfilled-template-copy reading the evidence supports');
  } finally {
    fs.rmSync(copied, { recursive: true, force: true });
  }
});

// S-044 TK-002 second repair: the first repair fixed three named rooms rather
// than the class each one belongs to. Every room below is a room condition the
// command must answer, not a filesystem error it may leak.

test('classify treats a lane it cannot stat as a room condition, not a crash', () => {
  if (typeof process.getuid === 'function' && process.getuid() === 0) return;
  const sealedSupport = fixture();
  const sealedTools = fixture();
  const loopedTools = fixture();
  const sealedRoom = fixture();
  const unlistedRoom = fixture();
  try {
    // 1. A support root that is an ordinary directory but will not open. The
    //    manifest under it is unreachable, which is Rule 1's own shape.
    fs.mkdirSync(path.join(sealedSupport, 'workbench'));
    fs.writeFileSync(path.join(sealedSupport, 'workbench', 'manifest.json'), '{ "schemaVersion": 2 }\n');
    const sealedSupportBefore = roomSnapshot(sealedSupport);
    fs.chmodSync(path.join(sealedSupport, 'workbench'), 0o000);
    const sealedSupportResult = classify(sealedSupport);
    fs.chmodSync(path.join(sealedSupport, 'workbench'), 0o755);
    assert.equal(sealedSupportResult.status, 0, `${sealedSupportResult.stdout}${sealedSupportResult.stderr}`);
    assert.equal(sealedSupportResult.report.status, 'classified', 'a support root that will not open is a room condition');
    assert.equal(sealedSupportResult.report.verdict, 'unclassifiable');
    assert.equal(sealedSupportResult.report.evidence.manifest.readable, false,
      'an unreachable manifest is undetermined, never a readable authority');
    assert.deepEqual(roomSnapshot(sealedSupport), sealedSupportBefore, 'classify must write nothing into a sealed support root');

    // 2. A root tools/ lane that will not open, in a room whose seven stamped
    //    controls already settle the verdict.
    legacyRoom(sealedTools, { stamp: 'v3.0.0' });
    fs.mkdirSync(path.join(sealedTools, 'tools'));
    fs.writeFileSync(path.join(sealedTools, 'tools', 'adr.mjs'), 'export const adr = true;\n');
    const sealedToolsBefore = roomSnapshot(sealedTools);
    fs.chmodSync(path.join(sealedTools, 'tools'), 0o000);
    const sealedToolsResult = classify(sealedTools);
    fs.chmodSync(path.join(sealedTools, 'tools'), 0o755);
    assert.equal(sealedToolsResult.status, 0, `${sealedToolsResult.stdout}${sealedToolsResult.stderr}`);
    assert.equal(sealedToolsResult.report.verdict, 'upgrade', 'the seven stamped controls still classify the room');
    assert.ok(sealedToolsResult.report.evidence.lifecycleTools.rootUnreadable.includes('adr.mjs'),
      'a root tools/ name the room will not stat must be named, never counted as absent');
    assert.deepEqual(roomSnapshot(sealedTools), sealedToolsBefore, 'classify must write nothing into a sealed tools/ room');

    // 3. A root tools/ that is a symlink loop: the same undetermined lane by a
    //    different filesystem error.
    legacyRoom(loopedTools, { stamp: 'v3.0.0' });
    fs.symlinkSync('tools', path.join(loopedTools, 'tools'));
    const loopedBefore = roomSnapshot(loopedTools);
    const loopedResult = classify(loopedTools);
    assert.equal(loopedResult.status, 0, `${loopedResult.stdout}${loopedResult.stderr}`);
    assert.equal(loopedResult.report.verdict, 'upgrade', 'a tools/ symlink loop does not stop the stamped controls classifying the room');
    assert.ok(loopedResult.report.evidence.lifecycleTools.rootUnreadable.length > 0,
      'a lane that resolves to a symlink loop is undetermined, not empty');
    assert.deepEqual(roomSnapshot(loopedTools), loopedBefore, 'classify must write nothing into a looped tools/ room');

    // 4. A room that will not list its own top-level contents: whether it is
    //    empty or a working repository is undetermined, and no control settles it.
    fs.writeFileSync(path.join(sealedRoom, 'README.md'), '# Sealed room\n');
    const sealedRoomBefore = roomSnapshot(sealedRoom);
    fs.chmodSync(sealedRoom, 0o000);
    const sealedRoomResult = classify(sealedRoom);
    fs.chmodSync(sealedRoom, 0o755);
    assert.equal(sealedRoomResult.status, 0, `${sealedRoomResult.stdout}${sealedRoomResult.stderr}`);
    assert.equal(sealedRoomResult.report.verdict, 'unclassifiable',
      'a room that will not list its own contents is neither a genesis nor an adoption target');
    assert.equal(sealedRoomResult.report.evidence.roomContents.readable, false,
      'the listing the room refused must be reported as evidence');
    assert.equal(sealedRoomResult.report.evidence.supportRoot.present, null,
      'a room that will not let its own support root be stat-ed reports it neither present nor absent');
    assert.deepEqual(sealedRoomResult.report.evidence.legacyControlShapes.controlsPresent, controls,
      'a control the room will not stat is present-or-absent unknown, never counted among the missing');
    assert.deepEqual(sealedRoomResult.report.evidence.legacyControlShapes.legacyPaths, [],
      'a legacy lane the room will not stat is undetermined, never reported as one the room carries');
    assert.ok(sealedRoomResult.report.evidence.legacyControlShapes.legacyPathsUnreadable.includes('specs'),
      'and undetermined is reported as its own bucket, which is what keeps the empty legacyPaths honest');
    assert.deepEqual(roomSnapshot(sealedRoom), sealedRoomBefore, 'classify must write nothing into a sealed room');

    // 5. A room that can be walked into but not listed: every control answers,
    //    and the listing that separates genesis from adoption does not.
    fs.writeFileSync(path.join(unlistedRoom, 'README.md'), '# Unlisted room\n');
    const unlistedBefore = roomSnapshot(unlistedRoom);
    fs.chmodSync(unlistedRoom, 0o111);
    const unlistedResult = classify(unlistedRoom);
    fs.chmodSync(unlistedRoom, 0o755);
    assert.equal(unlistedResult.status, 0, `${unlistedResult.stdout}${unlistedResult.stderr}`);
    assert.equal(unlistedResult.report.verdict, 'unclassifiable',
      'a readable control does not settle whether the room is empty or a working repository');
    assert.ok(unlistedResult.report.reasons.some((reason) => /would not list its own top-level contents/.test(reason)),
      'the listing the room refused must be one of the reasons, not an unexplained refusal');
    assert.deepEqual(roomSnapshot(unlistedRoom), unlistedBefore, 'classify must write nothing into an unlisted room');
  } finally {
    for (const [project, lane] of [[sealedSupport, 'workbench'], [sealedTools, 'tools'], [sealedRoom, '.'], [unlistedRoom, '.']]) {
      try { fs.chmodSync(path.join(project, lane), 0o755); } catch { /* already restored */ }
    }
    for (const project of [sealedSupport, sealedTools, loopedTools, sealedRoom, unlistedRoom]) {
      fs.rmSync(project, { recursive: true, force: true });
    }
  }
});

test('classify never reports a borrowed lifecycle lane as this room\'s own', () => {
  const installed = fixture();
  const borrower = fixture();
  try {
    fs.mkdirSync(path.join(installed, 'workbench', 'tools'), { recursive: true });
    for (const name of ['diagnostics.mjs', 'privacy.mjs', 'sessions.mjs']) {
      fs.writeFileSync(path.join(installed, 'workbench', 'tools', name), `export const ${name.replace('.mjs', '')} = true;\n`);
    }
    fs.writeFileSync(path.join(installed, 'workbench', 'tools', '.workbench-tools.json'), '{ "schemaVersion": 2 }\n');
    fs.writeFileSync(path.join(borrower, 'README.md'), '# Borrowed room\n');
    fs.symlinkSync(path.join(installed, 'workbench'), path.join(borrower, 'workbench'), 'dir');
    const before = roomSnapshot(borrower);
    const result = classify(borrower);
    assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
    assert.equal(result.report.verdict, 'unclassifiable');
    assert.equal(result.report.evidence.lifecycleTools.read, false,
      'nothing under a support root that is not an ordinary directory may be read, the managed lane included');
    assert.equal(result.report.evidence.lifecycleTools.receipt, null,
      "another room's tools receipt must never be reported as this room's managed runtime lane");
    assert.equal(result.report.evidence.lifecycleTools.installed, null,
      "another room's installed runtime tools must never be listed as this room's");
    assert.deepEqual(roomSnapshot(borrower), before, 'classify must write nothing while refusing');
  } finally {
    for (const project of [installed, borrower]) fs.rmSync(project, { recursive: true, force: true });
  }
});

test('classify names the room\'s stamp state in both readings of an unreadable support root', () => {
  const stamped = fixture();
  const unstamped = fixture();
  try {
    legacyRoom(stamped, { stamp: 'v3.0.0' });
    fs.mkdirSync(path.join(stamped, 'workbench', 'specs'), { recursive: true });
    const stampedResult = classify(stamped);
    assert.equal(stampedResult.status, 0, `${stampedResult.stdout}${stampedResult.stderr}`);
    assert.equal(stampedResult.report.verdict, 'unclassifiable');
    assert.ok(stampedResult.report.reasons.some((reason) => /carry a Workbench version stamp \(v3\.0\.0\)/.test(reason)),
      'in a stamped room the stamp is the decisive evidence that a release did write here, so Rule 1 must name it');

    fs.mkdirSync(path.join(unstamped, 'workbench', 'specs'), { recursive: true });
    const unstampedResult = classify(unstamped);
    assert.equal(unstampedResult.status, 0, `${unstampedResult.stdout}${unstampedResult.stderr}`);
    assert.equal(unstampedResult.report.verdict, 'unclassifiable');
    assert.ok(unstampedResult.report.reasons.some((reason) => /No root control carries a Workbench version stamp/.test(reason)),
      'an unstamped room must say so, because nothing outside workbench/ then corroborates an installation');
  } finally {
    for (const project of [stamped, unstamped]) fs.rmSync(project, { recursive: true, force: true });
  }
});

test('classify offers the unfilled-template-copy reading from the adoption branch too', () => {
  const copied = fixture();
  const banner = fixture();
  try {
    // What `cp -R templates/. .` leaves behind: templates/ carries no CLAUDE.md,
    // so the copy is not harness-shaped and lands on the adoption branch.
    for (const control of controls.filter((name) => name !== 'CLAUDE.md')) {
      fs.writeFileSync(path.join(copied, control), `# ${control}\n\n> Part of LLM Workbench v[HARNESS_VERSION].\n\n[BRACKETED_PROJECT]\n`);
    }
    const result = classify(copied);
    assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
    assert.equal(result.report.verdict, 'adoption');
    assert.ok(result.report.reasons.some((reason) => /\[BRACKETED\] placeholder/.test(reason)),
      'an unfilled copy of the templates is a reading of the room, so it belongs in the reasons and not only in the evidence');

    // A banner that never resolved is the same reading reached by the other
    // limb: a filled body does not make a copied banner a release's stamp.
    for (const control of controls.filter((name) => name !== 'CLAUDE.md')) {
      fs.writeFileSync(path.join(banner, control), `# ${control}\n\n> Part of LLM Workbench v[HARNESS_VERSION].\n\nProject truth.\n`);
    }
    const bannerResult = classify(banner);
    assert.equal(bannerResult.status, 0, `${bannerResult.stdout}${bannerResult.stderr}`);
    assert.equal(bannerResult.report.verdict, 'adoption');
    assert.deepEqual(bannerResult.report.evidence.legacyControlShapes.controlsBracketed, [],
      'a filled body carries no [BRACKETED] placeholder, so only the banner limb is left to offer the reading');
    assert.ok(bannerResult.report.reasons.some((reason) => /unresolved version banner/.test(reason)),
      'a version banner that never resolved must offer the unfilled-copy reading on its own');
  } finally {
    for (const project of [copied, banner]) fs.rmSync(project, { recursive: true, force: true });
  }
});

test('classify refuses a project path it cannot stat or that is not an ordinary directory', () => {
  if (typeof process.getuid === 'function' && process.getuid() === 0) return;
  const parent = fixture();
  const target = fixture();
  try {
    // A project path the invocation cannot even reach is not a room condition:
    // there is no room to report evidence about.
    fs.mkdirSync(path.join(parent, 'room'));
    fs.chmodSync(parent, 0o000);
    const sealed = classify(path.join(parent, 'room'));
    fs.chmodSync(parent, 0o755);
    assert.notEqual(sealed.status, 0, sealed.stdout);
    assert.equal(sealed.report.status, 'blocked');
    assert.equal(sealed.report.error.code, 'invalid-project',
      'an unreachable project path is a refused invocation, named rather than leaked as a filesystem error');

    // A symlink is a pointer to a room, not the room: classifying it would
    // report another directory's contents under this path.
    fs.writeFileSync(path.join(target, 'README.md'), '# Target\n');
    const link = path.join(parent, 'link');
    fs.symlinkSync(target, link, 'dir');
    const linked = classify(link);
    assert.notEqual(linked.status, 0, linked.stdout);
    assert.equal(linked.report.error.code, 'invalid-project',
      'a project path that is a symlink must be refused rather than classified as the room it points at');
  } finally {
    try { fs.chmodSync(parent, 0o755); } catch { /* already restored */ }
    for (const project of [parent, target]) fs.rmSync(project, { recursive: true, force: true });
  }
});

test('classify never reads a workbench/manifest.json symlinked out of the room', () => {
  const installed = fixture();
  const borrower = fixture();
  try {
    assert.equal(run('init', '--project', installed, '--provenance', 'genesis', '--version', VERSION).status, 0);
    fs.mkdirSync(path.join(borrower, 'workbench'));
    fs.symlinkSync(path.join(installed, 'workbench', 'manifest.json'), path.join(borrower, 'workbench', 'manifest.json'));
    const before = roomSnapshot(borrower);
    const result = classify(borrower);
    assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
    assert.equal(result.report.verdict, 'unclassifiable',
      "another room's manifest, reached through a manifest symlink, cannot make this room an installed room");
    assert.equal(result.report.evidence.manifest.readable, false,
      'a manifest that is not an ordinary file is never opened, so its target is never read');
    assert.deepEqual(roomSnapshot(borrower), before, 'classify must write nothing while refusing');
  } finally {
    for (const project of [installed, borrower]) fs.rmSync(project, { recursive: true, force: true });
  }
});

// S-044 TK-002 third repair: the support-root gate closed the borrowed lane at
// `workbench/`, and the lane leaked one path level below it. Every component a
// lifecycle lane is read through must be one this room owns, and so must the
// names under it.

test('classify never reads a lifecycle lane borrowed below an ordinary support root', () => {
  const installed = fixture();
  const relative = fixture();
  const absolute = fixture();
  const leaves = fixture();
  const absent = fixture();
  try {
    fs.mkdirSync(path.join(installed, 'workbench', 'tools'), { recursive: true });
    for (const name of ['adr.mjs', 'diagnostics.mjs', 'privacy.mjs', 'sessions.mjs', 'wiki.mjs']) {
      fs.writeFileSync(path.join(installed, 'workbench', 'tools', name), `export const tool = ${JSON.stringify(name)};\n`);
    }
    fs.writeFileSync(path.join(installed, 'workbench', 'tools', '.workbench-tools.json'), '{ "schemaVersion": 2 }\n');

    // 1. An ordinary workbench/ carrying this room's own manifest, whose
    //    managed tools lane is a link into another room. The support-root gate
    //    never fires, because the support root is this room's own.
    for (const [label, room, target] of [
      ['a relative symlinked lane', relative, path.join('..', '..', path.basename(installed), 'workbench', 'tools')],
      ['an absolute symlinked lane', absolute, path.join(installed, 'workbench', 'tools')]
    ]) {
      fs.mkdirSync(path.join(room, 'workbench'));
      fs.writeFileSync(path.join(room, 'workbench', 'manifest.json'), '{ "schemaVersion": 2, "workbenchVersion": "v3.1.2" }\n');
      fs.symlinkSync(target, path.join(room, 'workbench', 'tools'), 'dir');
      const before = roomSnapshot(room);
      const result = classify(room);
      assert.equal(result.status, 0, `${label}: ${result.stdout}${result.stderr}`);
      assert.equal(result.report.evidence.lifecycleTools.read, false,
        `${label}: a managed lane reached through a link out of the room is never read`);
      assert.equal(result.report.evidence.lifecycleTools.installed, null,
        `${label}: another room's installed runtime tools must never be listed as this room's`);
      assert.equal(result.report.evidence.lifecycleTools.receipt, null,
        `${label}: another room's tools receipt must never be reported as this room's`);
      assert.deepEqual(roomSnapshot(room), before, `${label}: classify must write nothing`);
    }

    // 2. An ordinary workbench/tools/ whose managed names are themselves links
    //    out of the room: a link is a pointer to another room's tool, not a
    //    tool this room carries.
    fs.mkdirSync(path.join(leaves, 'workbench', 'tools'), { recursive: true });
    fs.writeFileSync(path.join(leaves, 'workbench', 'manifest.json'), '{ "schemaVersion": 2, "workbenchVersion": "v3.1.2" }\n');
    for (const name of ['adr.mjs', '.workbench-tools.json']) {
      fs.symlinkSync(path.join(installed, 'workbench', 'tools', name), path.join(leaves, 'workbench', 'tools', name));
    }
    const leavesBefore = roomSnapshot(leaves);
    const leavesResult = classify(leaves);
    assert.equal(leavesResult.status, 0, `${leavesResult.stdout}${leavesResult.stderr}`);
    assert.equal(leavesResult.report.evidence.lifecycleTools.read, true,
      'an ordinary managed lane is this room\'s own, so it is read');
    assert.deepEqual(leavesResult.report.evidence.lifecycleTools.installed, [],
      'a managed name that is a link out of the room is not a tool the room carries');
    assert.equal(leavesResult.report.evidence.lifecycleTools.receipt, false,
      'a receipt that is a link out of the room is not this room\'s installation receipt');
    assert.deepEqual(roomSnapshot(leaves), leavesBefore, 'classify must write nothing into a borrowed-leaf room');

    // 3. A room whose ordinary workbench/ carries no tools lane at all: the
    //    lane was read and holds nothing, which is not the same answer as a
    //    lane that was never read because it belongs to another room.
    fs.mkdirSync(path.join(absent, 'workbench'));
    fs.writeFileSync(path.join(absent, 'workbench', 'manifest.json'), '{ "schemaVersion": 2, "workbenchVersion": "v3.1.2" }\n');
    const absentResult = classify(absent);
    assert.equal(absentResult.status, 0, `${absentResult.stdout}${absentResult.stderr}`);
    assert.equal(absentResult.report.evidence.lifecycleTools.read, true,
      'an absent managed lane is a lane the room answered for, so it is read rather than gated');
    assert.deepEqual(absentResult.report.evidence.lifecycleTools.installed, [],
      'a room with no managed lane carries no installed runtime tools');
    assert.equal(absentResult.report.evidence.lifecycleTools.receipt, false,
      'a room with no managed lane carries no installation receipt');
  } finally {
    for (const project of [installed, relative, absolute, leaves, absent]) fs.rmSync(project, { recursive: true, force: true });
  }
});

test('classify never counts a root tools/ lane borrowed from another room as this room\'s shape', () => {
  const installed = fixture();
  const borrower = fixture();
  const shaped = fixture();
  try {
    fs.mkdirSync(path.join(installed, 'tools'));
    fs.writeFileSync(path.join(installed, 'tools', 'privacy.mjs'), 'export const privacy = true;\n');
    // Four of the seven controls is the control majority the shape limb needs,
    // so the borrowed filename is the only thing left deciding the verdict.
    for (const control of controls.slice(0, 4)) {
      fs.writeFileSync(path.join(borrower, control), `# ${control}\n\nProject truth.\n`);
    }
    fs.symlinkSync(path.join(installed, 'tools'), path.join(borrower, 'tools'), 'dir');
    const before = roomSnapshot(borrower);
    const result = classify(borrower);
    assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
    assert.deepEqual(result.report.evidence.lifecycleTools.rootManagedNames, [],
      'a managed filename reached through a link out of the room is not this room\'s root lane');
    assert.deepEqual(result.report.evidence.lifecycleTools.rootBorrowedNames, ['privacy.mjs'],
      'the name behind the link is reported as borrowed rather than dropped in silence');
    assert.equal(result.report.verdict, 'adoption',
      'another room\'s tools/ cannot make this room harness-shaped');
    assert.deepEqual(roomSnapshot(borrower), before, 'classify must write nothing into a borrowed root lane room');

    // The same convention one level in: inside an ordinary root tools/, a
    // managed name that is a link out of the room or a directory wearing the
    // name is not a managed runtime file this room carries.
    for (const control of controls.slice(0, 4)) {
      fs.writeFileSync(path.join(shaped, control), `# ${control}\n\nProject truth.\n`);
    }
    fs.mkdirSync(path.join(shaped, 'tools'));
    fs.symlinkSync(path.join(installed, 'tools', 'privacy.mjs'), path.join(shaped, 'tools', 'privacy.mjs'));
    fs.mkdirSync(path.join(shaped, 'tools', 'sessions.mjs'));
    const shapedResult = classify(shaped);
    assert.equal(shapedResult.status, 0, `${shapedResult.stdout}${shapedResult.stderr}`);
    assert.deepEqual(shapedResult.report.evidence.lifecycleTools.rootManagedNames, [],
      'a managed name that is a link out of the room, or a directory wearing it, is not a managed runtime file');
    assert.equal(shapedResult.report.verdict, 'adoption',
      'neither shape is the trace of an installation, so neither makes the room harness-shaped');
  } finally {
    for (const project of [installed, borrower, shaped]) fs.rmSync(project, { recursive: true, force: true });
  }
});

test('classify answers every room condition its rule names, not only the two the fixtures reached', () => {
  const notDirectory = fixture();
  const longName = fixture();
  try {
    // ENOTDIR, the ordinary case: a regular file stands where the lane name
    // would be, so every name under it is a name this room cannot answer for.
    legacyRoom(notDirectory, { stamp: 'v3.0.0' });
    fs.writeFileSync(path.join(notDirectory, 'tools'), 'not a directory\n');
    const notDirectoryBefore = roomSnapshot(notDirectory);
    const notDirectoryResult = classify(notDirectory);
    assert.equal(notDirectoryResult.status, 0, `${notDirectoryResult.stdout}${notDirectoryResult.stderr}`);
    assert.equal(notDirectoryResult.report.status, 'classified',
      'a lane name under a regular file is a room condition, not an unreadable invocation');
    assert.equal(notDirectoryResult.report.verdict, 'upgrade', 'the seven stamped controls still classify the room');
    assert.ok(notDirectoryResult.report.evidence.lifecycleTools.rootUnreadable.includes('privacy.mjs'),
      'a name the room will not stat because its lane is a file must be named, never counted as absent');
    assert.deepEqual(roomSnapshot(notDirectory), notDirectoryBefore, 'classify must write nothing into a file-as-lane room');

    // ENAMETOOLONG: a lane linked to a name longer than the filesystem will
    // resolve is the same undetermined lane by a third filesystem error.
    legacyRoom(longName, { stamp: 'v3.0.0' });
    fs.symlinkSync('a'.repeat(300), path.join(longName, 'tools'));
    const longNameBefore = roomSnapshot(longName);
    const longNameResult = classify(longName);
    assert.equal(longNameResult.status, 0, `${longNameResult.stdout}${longNameResult.stderr}`);
    assert.equal(longNameResult.report.status, 'classified',
      'a lane whose link target is too long to resolve is a room condition, not an unreadable invocation');
    assert.equal(longNameResult.report.verdict, 'upgrade', 'the seven stamped controls still classify the room');
    assert.ok(longNameResult.report.evidence.lifecycleTools.rootUnreadable.includes('privacy.mjs'),
      'a name behind an unresolvable link is undetermined, never absent');
    assert.deepEqual(roomSnapshot(longName), longNameBefore, 'classify must write nothing into an unresolvable-lane room');
  } finally {
    for (const project of [notDirectory, longName]) fs.rmSync(project, { recursive: true, force: true });
  }
});

test('classify answers an EPERM lane at the stat seam the room conditions are declared over', () => {
  const project = fixture();
  try {
    legacyRoom(project, { stamp: 'v3.0.0' });
    fs.mkdirSync(path.join(project, 'tools'));
    fs.writeFileSync(path.join(project, 'tools', 'privacy.mjs'), 'export const privacy = true;\n');
    // EPERM is a room condition no fixture can produce on demand, so it is
    // pinned at the seam it is declared over rather than left to a platform.
    const sealed = path.join(project, 'tools', 'privacy.mjs');
    const probe = spawnSync(process.execPath, ['--input-type=module', '-e', `
      import fs from 'node:fs';
      const lstatSync = fs.lstatSync;
      fs.lstatSync = (target, ...rest) => {
        if (String(target) === ${JSON.stringify(sealed)}) {
          const error = new Error("EPERM: operation not permitted, lstat '" + target + "'");
          error.code = 'EPERM';
          throw error;
        }
        return lstatSync(target, ...rest);
      };
      const { classify } = await import(${JSON.stringify(pathToFileURL(classifier).href)});
      process.stdout.write(JSON.stringify(classify(${JSON.stringify(project)})));
    `], { cwd: root, encoding: 'utf8' });
    assert.equal(probe.status, 0, `${probe.stdout}${probe.stderr}`);
    const report = JSON.parse(probe.stdout);
    assert.equal(report.status, 'classified', 'an EPERM lane name is a room condition, not a thrown filesystem error');
    assert.equal(report.verdict, 'upgrade', 'the seven stamped controls still classify the room');
    assert.deepEqual(report.evidence.lifecycleTools.rootUnreadable, ['privacy.mjs'],
      'the name the room refused must be reported as undetermined');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
  }
});

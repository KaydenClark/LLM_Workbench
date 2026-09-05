#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { templatePlaceholders } from '../workbench/tools/template-placeholders.mjs';
import { validateWiki } from '../workbench/tools/wiki.mjs';
import { doctor, render } from '../workbench/tools/spec-workbench.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const VERSION = JSON.parse(fs.readFileSync(path.join(root, 'workbench', 'manifest.json'), 'utf8')).workbenchVersion;
const layout = path.join(root, 'workbench', 'tools', 'workbench-layout.mjs');
const installer = path.join(root, 'tools', 'workbench-tools.mjs');
const vocabulary = new Set(templatePlaceholders);
const WIKI_TEMPLATES = ['README.md', 'MEMORY.project.md', 'MEMORY.root.md', 'SCHEMA.md', 'AGENTS.md', 'design-concepts/README.md'];

function fixture() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-wiki-'));
}

function run(tool, ...args) {
  const result = spawnSync(process.execPath, [tool, ...args], { cwd: root, encoding: 'utf8' });
  return { ...result, report: result.stdout ? JSON.parse(result.stdout) : null };
}

function placeholders(content) {
  return [...content.matchAll(/(?<!\[)\[(?!\[|[ xX]\])[^\]\n]+\](?!\()/g)].map((match) => match[0]).filter((token) => vocabulary.has(token));
}

test('the wiki template set is lowercase and complete, and the retired capitalised directory is gone', () => {
  const entries = fs.readdirSync(path.join(root, 'templates'));
  assert.equal(entries.includes('Wiki'), false, 'templates/Wiki must be renamed to templates/wiki (exact directory entry, case-sensitive)');
  assert.equal(entries.includes('wiki'), true);
  for (const relative of WIKI_TEMPLATES) {
    assert.equal(fs.existsSync(path.join(root, 'templates', 'wiki', relative)), true, `templates/wiki/${relative} must ship`);
  }
  for (const relative of ['SCHEMA.md', 'AGENTS.md', 'design-concepts/README.md', 'MEMORY.project.md', 'MEMORY.root.md']) {
    const content = fs.readFileSync(path.join(root, 'templates', 'wiki', relative), 'utf8');
    assert.match(content, /^---\n/, `${relative} carries frontmatter`);
    assert.match(content, /knowledge_role:/, `${relative} uses knowledge_role`);
    assert.doesNotMatch(content, /^authority:/m, `${relative} must not use the retired authority property`);
    assert.doesNotMatch(content, /\/Users\/|\/home\//, `${relative} must not carry absolute paths`);
  }
  const schema = fs.readFileSync(path.join(root, 'templates', 'wiki', 'SCHEMA.md'), 'utf8');
  for (const phrase of ['project', 'deployment', 'knowledge_role', 'provenance', 'sensitivity', 'source_paths', 'Obsidian', 'stale', 'design-concepts']) {
    assert.match(schema, new RegExp(phrase), `SCHEMA.md covers ${phrase}`);
  }
});

test('init seeds the wiki contract files with placeholders filled and reports the seeding', () => {
  const project = fixture();
  try {
    const initialized = run(layout, 'init', '--project', project, '--provenance', 'genesis', '--version', VERSION, '--name', 'Puffer Pond', '--date', '2026-09-04');
    assert.equal(initialized.status, 0, initialized.stdout);
    assert.equal(initialized.report.seeded.wiki, true);
    assert.deepEqual(initialized.report.seeded.written.sort(), ['workbench/wiki/AGENTS.md', 'workbench/wiki/SCHEMA.md', 'workbench/wiki/design-concepts/README.md']);
    for (const relative of ['SCHEMA.md', 'AGENTS.md', 'design-concepts/README.md']) {
      const content = fs.readFileSync(path.join(project, 'workbench', 'wiki', relative), 'utf8');
      assert.deepEqual(placeholders(content), [], `${relative} must be seeded without placeholders`);
      assert.match(content, /last_verified: 2026-09-04/, `${relative} carries the seeding date`);
    }
    assert.match(fs.readFileSync(path.join(project, 'workbench', 'wiki', 'AGENTS.md'), 'utf8'), /# Puffer Pond Wiki Agent Instructions/);
    assert.match(fs.readFileSync(path.join(project, 'workbench', 'wiki', 'SCHEMA.md'), 'utf8'), new RegExp(`Generated from LLM Workbench ${VERSION.replaceAll('.', '\\.')}`));
    assert.equal(fs.existsSync(path.join(project, 'workbench', 'wiki', 'MEMORY.md')), false, 'the router is authored by Genesis, not seeded blindly');
    const manifest = JSON.parse(fs.readFileSync(path.join(project, 'workbench', 'manifest.json'), 'utf8'));
    assert.equal(manifest.wiki.profile, 'project');
    const deployment = fixture();
    try {
      const second = run(layout, 'init', '--project', deployment, '--provenance', 'genesis', '--version', VERSION, '--wiki-profile', 'deployment');
      assert.equal(JSON.parse(fs.readFileSync(path.join(deployment, 'workbench', 'manifest.json'), 'utf8')).wiki.profile, 'deployment');
      assert.equal(second.status, 0);
    } finally {
      fs.rmSync(deployment, { recursive: true, force: true });
    }
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
  }
});

test('Genesis readiness requires the filled router and wiki contract files', () => {
  const project = fixture();
  try {
    assert.equal(run(layout, 'init', '--project', project, '--provenance', 'genesis', '--version', VERSION).status, 0);
    assert.equal(run(installer, 'install', '--project', project).status, 0);
    for (const control of ['AGENTS.md', 'BLUEPRINT.md', 'LEXICON.md', 'RUNBOOK.md', 'TASKBOARD.md', 'README.md']) {
      const regions = control === 'BLUEPRINT.md' ? '<!-- spec-catalog:start -->\n<!-- spec-catalog:end -->\n' : control === 'TASKBOARD.md' ? '<!-- hot-specs:start -->\n<!-- hot-specs:end -->\n' : '';
      fs.writeFileSync(path.join(project, control), `# ${control}\n\n> Generated from LLM Workbench ${VERSION}.\n\n## Purpose\n\nFilled.\n${regions}`);
    }
    fs.writeFileSync(path.join(project, 'CLAUDE.md'), '@AGENTS.md\n');
    const specDir = path.join(project, 'workbench', 'specs', 'S-001-first');
    fs.mkdirSync(specDir);
    fs.writeFileSync(path.join(specDir, 'SPEC.md'), `# S-001 - First\n\n> Generated from LLM Workbench ${VERSION}.\n\n**Spec ID:** S-001\n**Status:** active\n**Priority:** 0\n**Owner:** fixture\n**Updated:** 2026-09-04\n**Catalog description:** First.\n**Blockers:** none\n**Latest event:** Captured.\n**Next gate:** Claim TK-001.\n\n## Outcome\n\nOne.\n\n## Vertical Implementation Slices\n\n| Ticket | Slice | Status | Blockers | Proof |\n|---|---|---|---|---|\n| TK-001 | First | ready | none | pending |\n\n## Acceptance Criteria\n\n- [ ] Done.\n\n## Completion Result\n\nPending.\n`);
    const missingRouter = run(layout, 'validate', '--project', project, '--genesis');
    assert.equal(missingRouter.report.error.code, 'unfilled-control');
    assert.match(missingRouter.report.error.message, /MEMORY\.md/);
    const template = fs.readFileSync(path.join(root, 'templates', 'wiki', 'MEMORY.project.md'), 'utf8');
    fs.writeFileSync(path.join(project, 'workbench', 'wiki', 'MEMORY.md'), template);
    const unfilledRouter = run(layout, 'validate', '--project', project, '--genesis');
    assert.equal(unfilledRouter.report.error.code, 'unfilled-control', 'an unfilled router fails readiness');
    fs.writeFileSync(path.join(project, 'workbench', 'wiki', 'MEMORY.md'), template.replaceAll('[PROJECT_NAME]', 'Fixture').replaceAll('[HARNESS_VERSION]', VERSION.slice(1)).replaceAll('[YYYY-MM-DD]', '2026-09-04').replace(/^\| \[QUESTION THIS ROOM'S MEMORY ANSWERS\].*\n/m, '').replace(/^\| \[ANOTHER DURABLE QUESTION\].*\n/m, ''));
    const ready = run(layout, 'validate', '--project', project, '--genesis');
    assert.equal(ready.status, 0, ready.stdout);
    assert.equal(ready.report.status, 'valid');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
  }
});

const wikiTool = path.join(root, 'workbench', 'tools', 'wiki.mjs');

function seededWiki() {
  const project = fixture();
  assert.equal(run(layout, 'init', '--project', project, '--provenance', 'genesis', '--version', VERSION, '--name', 'Fixture', '--date', '2026-09-04').status, 0);
  const template = fs.readFileSync(path.join(root, 'templates', 'wiki', 'MEMORY.project.md'), 'utf8');
  fs.writeFileSync(path.join(project, 'workbench', 'wiki', 'MEMORY.md'), template.replaceAll('[PROJECT_NAME]', 'Fixture').replaceAll('[HARNESS_VERSION]', VERSION.slice(1)).replaceAll('[YYYY-MM-DD]', '2026-09-04').replace(/^\| \[QUESTION THIS ROOM'S MEMORY ANSWERS\].*\n/m, '').replace(/^\| \[ANOTHER DURABLE QUESTION\].*\n/m, ''));
  fs.writeFileSync(path.join(project, 'BLUEPRINT.md'), '# Blueprint\n\n<!-- spec-catalog:start -->\n<!-- spec-catalog:end -->\n');
  fs.writeFileSync(path.join(project, 'TASKBOARD.md'), '# Taskboard\n\n<!-- hot-specs:start -->\n<!-- hot-specs:end -->\n');
  fs.writeFileSync(path.join(project, 'AGENTS.md'), '# Agents\n\n| Truth | Owner |\n|---|---|\n| durable room memory | `workbench/wiki/` (`MEMORY.md` router) |\n');
  fs.writeFileSync(path.join(project, 'README.md'), '# Fixture\n\n- [`workbench/wiki/MEMORY.md`](workbench/wiki/MEMORY.md) - the room brain.\n');
  render(project);
  return project;
}

function note(overrides = {}, body = '# Note\n\nDurable knowledge.\n') {
  const front = {
    type: 'project', status: 'active', sensitivity: 'normal', knowledge_role: 'curated',
    provenance: ['owner conversation 2026-09-04'], source_paths: ['BLUEPRINT.md'], last_verified: '2026-09-04', ...overrides
  };
  const lines = ['---'];
  for (const [key, value] of Object.entries(front)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) { lines.push(`${key}:`); for (const item of value) lines.push(`  - ${item}`); }
    else lines.push(`${key}: ${value}`);
  }
  lines.push('---', '');
  return `${lines.join('\n')}\n${body}`;
}

function codes(findings) {
  return findings.map((item) => item.code).sort();
}

test('a seeded wiki validates cleanly with or without an Obsidian vault configuration', () => {
  const project = seededWiki();
  try {
    assert.deepEqual(validateWiki(project), []);
    const cli = spawnSync(process.execPath, [wikiTool, 'validate', '--path', project, '--json'], { cwd: project, encoding: 'utf8' });
    assert.equal(cli.status, 0, cli.stderr);
    assert.deepEqual(JSON.parse(cli.stdout), []);
    fs.mkdirSync(path.join(project, 'workbench', 'wiki', '.obsidian'));
    fs.writeFileSync(path.join(project, 'workbench', 'wiki', '.obsidian', 'app.json'), '{"useMarkdownLinks":true}\n');
    assert.deepEqual(validateWiki(project), [], 'Obsidian configuration is optional and ignored');
    fs.writeFileSync(path.join(project, 'workbench', 'wiki', 'Decisions History.md'), note());
    assert.deepEqual(validateWiki(project), []);
    assert.deepEqual(doctor(project).filter((item) => item.scope === 'wiki'), [], 'doctor carries wiki findings for schema 2 projects');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
  }
});

test('the validator rejects retired metadata, absolute sources, bad enums, copied task state, and secret-like content without blocking selection', () => {
  const project = seededWiki();
  try {
    const wiki = path.join(project, 'workbench', 'wiki');
    fs.writeFileSync(path.join(wiki, 'Retired.md'), note({ authority: 'canonical' }));
    fs.writeFileSync(path.join(wiki, 'Absolute.md'), note({ source_paths: ['/Users/someone/project/BLUEPRINT.md'] }));
    fs.writeFileSync(path.join(wiki, 'Enum.md'), note({ knowledge_role: 'authoritative', sensitivity: 'secret' }));
    fs.writeFileSync(path.join(wiki, 'Missing.md'), '---\ntype: project\n---\n\n# Missing\n');
    fs.writeFileSync(path.join(wiki, 'Copied.md'), note({}, '# Copied\n\n| Ticket | Slice | Status | Blockers | Proof |\n|---|---|---|---|---|\n| TK-001 | Slice | ready | none | pending |\n'));
    fs.writeFileSync(path.join(wiki, 'Leak.md'), note({}, '# Leak\n\nToken: ghp_' + 'A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0\n'));
    fs.writeFileSync(path.join(wiki, 'guidebooks', 'Copied.md'), note({ type: 'guidebook' }));
    const findings = validateWiki(project);
    const byNote = new Map();
    for (const item of findings) byNote.set(item.note ?? item.message, [...(byNote.get(item.note ?? item.message) ?? []), item.code]);
    const has = (note, code) => (byNote.get(`workbench/wiki/${note}`) ?? []).includes(code);
    assert.ok(has('Retired.md', 'invalid-note'), 'retired authority property');
    assert.ok(has('Absolute.md', 'invalid-note'), 'absolute source path');
    assert.ok(has('Absolute.md', 'secret-like-content'), 'an absolute home path is also secret-like material');
    assert.ok(has('Enum.md', 'invalid-note'), 'enum outside the schema');
    assert.ok(has('Missing.md', 'invalid-note'), 'missing required properties');
    assert.ok(has('Copied.md', 'copied-task-state'), 'copied ticket rows');
    assert.ok(has('Leak.md', 'secret-like-content'), 'token-like content');
    assert.ok(findings.some((item) => item.code === 'invalid-note' && /basename Copied is not unique/.test(item.message)));
    assert.ok(findings.every((item) => item.blocks === 'none'), 'wiki findings never block selection');
    const cli = spawnSync(process.execPath, [wikiTool, 'validate', '--path', project], { cwd: project, encoding: 'utf8' });
    assert.equal(cli.status, 1, 'error findings fail the wiki command itself');
    const doctored = doctor(project);
    assert.ok(doctored.some((item) => item.code === 'secret-like-content'));
    assert.ok(!doctored.some((item) => item.blocks === 'all' || item.blocks === 'selection'));
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
  }
});

test('design-concept articles need the owner-directed shape and stale notes are attention only', () => {
  const project = seededWiki();
  try {
    const concepts = path.join(project, 'workbench', 'wiki', 'design-concepts');
    fs.writeFileSync(path.join(concepts, 'Composition Model.md'), note({ type: 'design-concept', authorized_by: 'owner', parent: 'none' }, '# Composition Model\n\nThe model.\n\n## Evidence and Sources\n\n- BLUEPRINT.md\n\n## History\n\n- 2026-09-04: created on owner direction.\n'));
    assert.deepEqual(validateWiki(project), []);
    fs.writeFileSync(path.join(concepts, 'Half Article.md'), note({ type: 'project' }, '# Half Article\n\nNo sections.\n'));
    const messages = validateWiki(project).map((item) => item.message);
    assert.ok(messages.some((message) => /type design-concept/.test(message)));
    assert.ok(messages.some((message) => /authorized_by/.test(message)));
    assert.ok(messages.some((message) => /parent/.test(message)));
    assert.ok(messages.some((message) => /Evidence and Sources/.test(message)));
    assert.ok(messages.some((message) => /History/.test(message)));
    fs.rmSync(path.join(concepts, 'Half Article.md'));
    fs.writeFileSync(path.join(project, 'workbench', 'wiki', 'Old Note.md'), note({ status: 'stale' }));
    const stale = validateWiki(project);
    assert.deepEqual(stale.map((item) => [item.code, item.severity, item.blocks]), [['stale-note', 'attention', 'none']]);
    const cli = spawnSync(process.execPath, [wikiTool, 'validate', '--path', project], { cwd: project, encoding: 'utf8' });
    assert.equal(cli.status, 0, 'a stale note never fails the command');
    assert.match(cli.stdout, /stale-note \[attention/);
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
  }
});

test('the product wiki adopts the contract and both Lexicons route design questions to the collection', () => {
  for (const relative of ['MEMORY.md', 'SCHEMA.md', 'AGENTS.md', 'design-concepts/README.md']) {
    const file = path.join(root, 'workbench', 'wiki', relative);
    assert.equal(fs.existsSync(file), true, `workbench/wiki/${relative} must exist in the product`);
    assert.deepEqual(placeholders(fs.readFileSync(file, 'utf8')), [], `workbench/wiki/${relative} must carry no template placeholder`);
  }
  const router = fs.readFileSync(path.join(root, 'workbench', 'wiki', 'MEMORY.md'), 'utf8');
  assert.match(router, /^---\ntype: memory\n/, 'the product router carries frontmatter');
  assert.match(router, /design-concepts/, 'the product router routes to the collection');
  const findings = validateWiki(root);
  assert.deepEqual(findings.filter((item) => item.severity === 'error'), [], 'the product wiki validates without error findings');
  assert.equal(fs.readdirSync(path.join(root, 'workbench', 'wiki', 'design-concepts')).filter((name) => !name.startsWith('.') && name !== 'README.md').length, 0, 'the product ships an empty design-concepts collection: agents do not author articles');
  for (const relative of ['LEXICON.md', 'templates/LEXICON.md']) {
    assert.match(fs.readFileSync(path.join(root, relative), 'utf8'), /workbench\/wiki\/design-concepts\//, `${relative} routes design questions to the collection`);
  }
});

test('a wiki stamp naming a version other than the manifest is attention only, and a missing stamp is not a finding', () => {
  const project = seededWiki();
  try {
    const wiki = path.join(project, 'workbench', 'wiki');
    const schema = fs.readFileSync(path.join(wiki, 'SCHEMA.md'), 'utf8');
    const router = fs.readFileSync(path.join(wiki, 'MEMORY.md'), 'utf8');
    assert.ok(schema.includes(`Generated from LLM Workbench ${VERSION}`), 'the seeded contract carries the manifest stamp');
    fs.writeFileSync(path.join(wiki, 'SCHEMA.md'), schema.replace(VERSION, 'v2.3.0'));
    const stale = validateWiki(project);
    assert.deepEqual(stale.map((item) => [item.code, item.severity, item.blocks, item.note]), [['stale-stamp', 'attention', 'none', 'workbench/wiki/SCHEMA.md']]);
    assert.match(stale[0].message, /v2\.3\.0/);
    assert.ok(stale[0].message.includes(VERSION), 'the message names the manifest version');
    assert.deepEqual(doctor(project).filter((item) => item.code === 'stale-stamp').map((item) => item.note), ['workbench/wiki/SCHEMA.md'], 'doctor carries the stamp finding');
    fs.writeFileSync(path.join(wiki, 'MEMORY.md'), router.replace(VERSION, 'v3.0.0'));
    assert.deepEqual(validateWiki(project).map((item) => item.note).sort(), ['workbench/wiki/MEMORY.md', 'workbench/wiki/SCHEMA.md'], 'the room brain stamp is checked too');
    fs.writeFileSync(path.join(wiki, 'SCHEMA.md'), schema);
    fs.writeFileSync(path.join(wiki, 'MEMORY.md'), router);
    assert.deepEqual(validateWiki(project), [], 'restoring the manifest version clears the finding');
    fs.writeFileSync(path.join(wiki, 'Decisions History.md'), note());
    assert.deepEqual(validateWiki(project), [], 'an ordinary unstamped note names no version and is not stale');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
  }
});

test('this repository stamps its wiki contract files with its manifest version and routes to its room brain', () => {
  for (const relative of ['SCHEMA.md', 'AGENTS.md', 'design-concepts/README.md']) {
    const content = fs.readFileSync(path.join(root, 'workbench', 'wiki', relative), 'utf8');
    assert.equal(content.match(/Generated from LLM Workbench (v\d+\.\d+\.\d+)/)?.[1], VERSION, `${relative} stamp`);
  }
  assert.deepEqual(doctor(root).filter((item) => ['stale-stamp', 'room-brain-unrouted'].includes(item.code)), []);
});

test('an unfilled placeholder stamp is reported as stale so a hand-copied template is not silent', () => {
  const project = seededWiki();
  try {
    const schema = path.join(project, 'workbench', 'wiki', 'SCHEMA.md');
    fs.writeFileSync(schema, fs.readFileSync(schema, 'utf8').replace(`Generated from LLM Workbench ${VERSION}.`, 'Generated from LLM Workbench v[HARNESS_VERSION].'));
    const unfilled = validateWiki(project).filter((item) => item.code === 'stale-stamp');
    assert.deepEqual(unfilled.map((item) => [item.severity, item.blocks, item.note]), [['attention', 'none', 'workbench/wiki/SCHEMA.md']]);
    assert.match(unfilled[0].message, /unfilled/);
    assert.deepEqual(doctor(project).filter((item) => item.code === 'stale-stamp').map((item) => item.note), ['workbench/wiki/SCHEMA.md']);
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
  }
});

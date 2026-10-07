#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { templatePlaceholders } from '../workbench/tools/template-placeholders.mjs';
import { moveNote, normalizeWiki, validateWiki } from '../workbench/tools/wiki.mjs';
import { parseFrontmatter } from '../workbench/tools/adr.mjs';
import { doctor, render } from '../workbench/tools/spec-workbench.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const VERSION = JSON.parse(fs.readFileSync(path.join(root, 'workbench', 'manifest.json'), 'utf8')).workbenchVersion;
const layout = path.join(root, 'workbench', 'tools', 'workbench-layout.mjs');
const installer = path.join(root, 'tools', 'workbench-tools.mjs');
const skillsInstaller = path.join(root, 'tools', 'workbench-skills.mjs');
const vocabulary = new Set(templatePlaceholders);
const WIKI_TEMPLATES = ['README.md', 'MEMORY.project.md', 'MEMORY.root.md', 'SCHEMA.md', 'AGENTS.md', 'design-concepts/README.md', 'features/README.md'];

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
  for (const relative of ['SCHEMA.md', 'AGENTS.md', 'design-concepts/README.md', 'features/README.md', 'MEMORY.project.md', 'MEMORY.root.md']) {
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
    assert.deepEqual(initialized.report.seeded.written.sort(), ['workbench/wiki/AGENTS.md', 'workbench/wiki/SCHEMA.md', 'workbench/wiki/design-concepts/README.md', 'workbench/wiki/features/README.md']);
    for (const relative of ['SCHEMA.md', 'AGENTS.md', 'design-concepts/README.md', 'features/README.md']) {
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
    assert.equal(run(skillsInstaller, 'install', '--project', project).status, 0);
    // Readiness also needs the declared integration branch to resolve.
    for (const args of [['init', '-q', '-b', 'main'], ['commit', '-q', '--allow-empty', '-m', 'fixture'], ['branch', 'integration']]) {
      assert.equal(spawnSync('git', ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', ...args], { cwd: project, encoding: 'utf8' }).status, 0, args.join(' '));
    }
    for (const control of ['AGENTS.md', 'BLUEPRINT.md', 'GLOSSARY.md', 'ARCHITECTURE.md', 'RUNBOOK.md', 'TASKBOARD.md', 'README.md']) {
      const regions = control === 'BLUEPRINT.md' ? '<!-- spec-catalog:start -->\n<!-- spec-catalog:end -->\n' : control === 'TASKBOARD.md' ? '<!-- hot-specs:start -->\n<!-- hot-specs:end -->\n' : '';
      fs.writeFileSync(path.join(project, control), `# ${control}\n\n> Generated from LLM Workbench ${VERSION}.\n\n## Purpose\n\nFilled.\n${regions}`);
    }
    fs.writeFileSync(path.join(project, 'CLAUDE.md'), '@AGENTS.md\n');
    const specDir = path.join(project, 'workbench', 'specs', 'S-001-first');
    fs.mkdirSync(specDir);
    fs.writeFileSync(path.join(specDir, 'SPEC.md'), `# S-001 - First\n\n> Generated from LLM Workbench ${VERSION}.\n\n**Spec ID:** S-001\n**Status:** active\n**Priority:** 0\n**Owner:** fixture\n**Updated:** 2026-09-04\n**Catalog description:** First.\n**Blockers:** none\n**Latest event:** Captured.\n**Next gate:** Claim TK-001.\n\n## Outcome\n\nOne.\n\n## Vertical Implementation Slices\n\n| Task | Slice | Status | Blockers | Proof |\n|---|---|---|---|---|\n| TK-001 | First | ready | none | pending |\n\n## Acceptance Criteria\n\n- [ ] Done.\n\n## Completion Result\n\nPending.\n`);
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
    fs.writeFileSync(path.join(wiki, 'Copied.md'), note({}, '# Copied\n\n| Task | Slice | Status | Blockers | Proof |\n|---|---|---|---|---|\n| TK-001 | Slice | ready | none | pending |\n'));
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
    assert.ok(has('Copied.md', 'copied-task-state'), 'copied task rows');
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

test('design-concept articles need the authorized-operation shape and stale notes are attention only', () => {
  const project = seededWiki();
  try {
    const concepts = path.join(project, 'workbench', 'wiki', 'design-concepts');
    fs.writeFileSync(path.join(concepts, 'Composition Model.md'), note({ type: 'design-concept', authorized_by: 'owner', parent: 'none' }, '# Composition Model\n\nThe model.\n\n## Evidence and Sources\n\n- BLUEPRINT.md\n\n## History\n\n- 2026-09-04: created on owner direction.\n'));
    assert.deepEqual(validateWiki(project), []);
    fs.writeFileSync(path.join(concepts, 'Half Article.md'), note({ type: 'project' }, '# Half Article\n\nNo sections.\n'));
    const messages = validateWiki(project).map((item) => item.message);
    assert.ok(messages.some((message) => /type design-concept/.test(message)));
    const authorizedBy = messages.filter((message) => /authorized_by/.test(message));
    assert.equal(authorizedBy.length, 1);
    assert.match(authorizedBy[0], /the operation that authorized/);
    assert.doesNotMatch(authorizedBy[0], /owner/);
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

test('the product wiki adopts the contract and both architecture files route design questions to the collection', () => {
  for (const relative of ['MEMORY.md', 'SCHEMA.md', 'AGENTS.md', 'design-concepts/README.md', 'features/README.md']) {
    const file = path.join(root, 'workbench', 'wiki', relative);
    assert.equal(fs.existsSync(file), true, `workbench/wiki/${relative} must exist in the product`);
    assert.deepEqual(placeholders(fs.readFileSync(file, 'utf8')), [], `workbench/wiki/${relative} must carry no template placeholder`);
  }
  const router = fs.readFileSync(path.join(root, 'workbench', 'wiki', 'MEMORY.md'), 'utf8');
  assert.match(router, /^---\ntype: memory\n/, 'the product router carries frontmatter');
  assert.match(router, /design-concepts/, 'the product router routes to the collection');
  const findings = validateWiki(root);
  assert.deepEqual(findings.filter((item) => item.severity === 'error'), [], 'the product wiki validates without error findings');
  // S-00I TK-005: the collection is no longer empty - it carries S-00H's
  // reconciled durable-owner article, authored on the owner's own explicit
  // direction (the assigned Spec's lane handoff) as that retirement's
  // required precondition, never authored un-directed by an agent. Every
  // entry in the collection besides its README must still be a validated
  // design-concept article, not an arbitrary file an agent slipped in.
  const designConceptEntries = fs.readdirSync(path.join(root, 'workbench', 'wiki', 'design-concepts')).filter((name) => !name.startsWith('.') && name !== 'README.md');
  for (const name of designConceptEntries) {
    const content = fs.readFileSync(path.join(root, 'workbench', 'wiki', 'design-concepts', name), 'utf8');
    assert.match(content, /^---\ntype: design-concept\n/, `${name} must be a design-concept article, not an un-directed file`);
    assert.match(content, /\nauthorized_by: /, `${name} must record who authorized it`);
  }
  // S-004O TK-009F: the design-concept route moved from the Lexicons to
  // ARCHITECTURE.md, which starts the question at its glossary term.
  for (const relative of ['ARCHITECTURE.md', 'templates/ARCHITECTURE.md']) {
    const route = fs.readFileSync(path.join(root, relative), 'utf8').split('\n').filter((line) => line.trim()).join(' ').match(/Design-concept routing:[^.]*\./)?.[0] ?? '';
    assert.match(route, /starts at its glossary term/, `${relative} starts design questions at the glossary term`);
    assert.match(route, /workbench\/wiki\/design-concepts\//, `${relative} routes design questions to the collection`);
  }
  for (const relative of ['workbench/wiki/design-concepts/README.md', 'templates/wiki/design-concepts/README.md']) {
    assert.match(fs.readFileSync(path.join(root, relative), 'utf8'), /Discovery\s+starts from the root `GLOSSARY\.md` term,\s+then the `ARCHITECTURE\.md`\s+design-concept route/, `${relative} names the glossary and architecture route into the collection`);
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

test('a routed Wiki page with no one-line summary beside its link is attention only, and the summary convention clears it', () => {
  const project = seededWiki();
  try {
    const wiki = path.join(project, 'workbench', 'wiki');
    const router = fs.readFileSync(path.join(wiki, 'MEMORY.md'), 'utf8');
    fs.writeFileSync(path.join(wiki, 'Release Habits.md'), note());
    fs.writeFileSync(path.join(wiki, 'Deploy Notes.md'), note());
    const route = (body) => fs.writeFileSync(path.join(wiki, 'MEMORY.md'), `${router}\n## Notes\n\n${body}\n`);
    const unsummarized = () => validateWiki(project).filter((item) => item.code === 'unsummarized-route');
    assert.deepEqual(validateWiki(project), [], 'the generated router, whose table rows carry a description cell, is clean');

    route('- [Release Habits](Release%20Habits.md)\n- [Deploy Notes](Deploy%20Notes.md) - how this room ships a release');
    const [bare, ...others] = unsummarized();
    assert.equal(others.length, 0, 'only the link with no summary is reported');
    assert.deepEqual([bare.code, bare.severity, bare.blocks, bare.note], ['unsummarized-route', 'attention', 'none', 'workbench/wiki/MEMORY.md']);
    assert.equal(bare.target, 'workbench/wiki/Release Habits.md');
    assert.match(bare.message, /Release Habits/);
    assert.match(bare.message, /\[Title\]\(path\) - summary/, 'the message states the convention');
    assert.deepEqual(doctor(project).filter((item) => item.code === 'unsummarized-route').map((item) => item.target), ['workbench/wiki/Release Habits.md'], 'doctor carries the finding');
    const cli = spawnSync(process.execPath, [wikiTool, 'validate', '--path', project], { cwd: project, encoding: 'utf8' });
    assert.equal(cli.status, 0, 'a missing summary never fails the command');
    assert.match(cli.stdout, /unsummarized-route \[attention/);

    for (const summarized of [
      '- [Release Habits](Release%20Habits.md) - how this room ships',
      '- [Release Habits](Release%20Habits.md): how this room ships',
      '- [Release Habits](Release%20Habits.md) — how this room ships',
      'Start with [Release Habits](Release%20Habits.md) - how this room ships.',
      '| Question | Read first |\n|---|---|\n| How this room ships | [Release Habits](Release%20Habits.md) |'
    ]) {
      route(summarized);
      assert.deepEqual(unsummarized(), [], `${summarized} carries a summary`);
    }
    for (const missing of [
      '- [Release Habits](Release%20Habits.md) explains how this room ships',
      '- [Release Habits](Release%20Habits.md) - ',
      '- [Release Habits](Release%20Habits.md) - ships',
      '- [Release Habits](Release%20Habits.md) ([Deploy Notes](Deploy%20Notes.md))',
      '| [Release Habits](Release%20Habits.md) | |',
      '| [Release Habits](Release%20Habits.md) | [Deploy Notes](Deploy%20Notes.md) |'
    ]) {
      route(missing);
      assert.ok(unsummarized().some((item) => /Release Habits/.test(item.message)), `${missing} has no one-line summary`);
    }
    route('- [BLUEPRINT.md](../../BLUEPRINT.md)\n- `[Release Habits](Release%20Habits.md)`\n- [Site](https://example.com/page.md)\n- [Folder](guidebooks/)\n- [[Release Habits]]');
    assert.deepEqual(unsummarized(), [], 'a page outside the Wiki, a code span, an external link, a folder and a wikilink are not routed pages');
    route('```\n- [Release Habits](Release%20Habits.md)\n```');
    assert.deepEqual(unsummarized(), [], 'a fenced example is not a route');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
  }
});

test('the router template shows the summary-line convention and the product router keeps every routed Wiki page summarized', () => {
  const template = fs.readFileSync(path.join(root, 'templates', 'wiki', 'MEMORY.project.md'), 'utf8');
  assert.match(template, /`- \[Schema\]\(SCHEMA\.md\) - what the page is for`/, 'the template router shows a summary-line example');
  assert.deepEqual(validateWiki(root).filter((item) => item.code === 'unsummarized-route'), [], 'this repository routes no Wiki page without a summary');
});

test('this repository stamps its wiki contract files with its manifest version and routes to its room brain', () => {
  for (const relative of ['SCHEMA.md', 'AGENTS.md', 'design-concepts/README.md', 'features/README.md']) {
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

// S-042 TK-002: a note the harness or a hand seeded without frontmatter is
// repairable in place. Only the missing required properties are inserted, the
// body keeps every byte, and a CRLF checkout keeps its own terminator.
test('normalize inserts only the missing required properties and leaves every note body alone', () => {
  const project = seededWiki();
  try {
    const wiki = path.join(project, 'workbench', 'wiki');
    const bare = '# Bare Note\n\nDurable knowledge with no metadata.\n';
    const partial = '---\ntype: project\nstatus: active\n---\n\n# Partial Note\n\nHalf the metadata.\n';
    const crlf = '---\r\ntype: guidebook\r\n---\r\n\r\n# CRLF Guidebook\r\n\r\nOrdered steps.\r\n';
    fs.writeFileSync(path.join(wiki, 'Bare Note.md'), bare);
    fs.writeFileSync(path.join(wiki, 'Partial Note.md'), partial);
    fs.writeFileSync(path.join(wiki, 'guidebooks', 'CRLF Guidebook.md'), crlf);

    assert.ok(validateWiki(project).filter((item) => item.code === 'invalid-note').length >= 3, 'the three notes are invalid before normalize');
    assert.equal(fs.readFileSync(path.join(wiki, 'Bare Note.md'), 'utf8'), bare, 'validate alone writes nothing');
    assert.equal(fs.readFileSync(path.join(wiki, 'Partial Note.md'), 'utf8'), partial, 'validate alone writes nothing');

    const result = normalizeWiki(project, { date: '2026-09-06' });
    assert.deepEqual(result.changed.map((entry) => entry.note).sort(), [
      'workbench/wiki/Bare Note.md',
      'workbench/wiki/Partial Note.md',
      'workbench/wiki/guidebooks/CRLF Guidebook.md'
    ], 'normalize reports every file it changed');
    assert.deepEqual(result.changed.find((entry) => entry.note.endsWith('Partial Note.md')).inserted, ['sensitivity', 'knowledge_role', 'provenance', 'source_paths', 'last_verified']);

    const normalizedBare = fs.readFileSync(path.join(wiki, 'Bare Note.md'), 'utf8');
    assert.ok(normalizedBare.endsWith(bare), 'the body keeps every byte after the inserted block');
    assert.match(normalizedBare, /^---\ntype: meta\nstatus: partial\n/, 'an unlocated note is typed meta and marked partial, not asserted active');
    assert.match(fs.readFileSync(path.join(wiki, 'Partial Note.md'), 'utf8'), /^---\ntype: project\nstatus: active\nsensitivity: normal\n/, 'declared values are never overwritten');
    const normalizedCrlf = fs.readFileSync(path.join(wiki, 'guidebooks', 'CRLF Guidebook.md'), 'utf8');
    assert.doesNotMatch(normalizedCrlf, /(?<!\r)\n/, 'a CRLF note must not gain an LF-terminated property');
    assert.ok(normalizedCrlf.endsWith('# CRLF Guidebook\r\n\r\nOrdered steps.\r\n'));

    assert.deepEqual(validateWiki(project), [], 'every normalized note validates');
    assert.deepEqual(normalizeWiki(project, { date: '2026-09-06' }).changed, [], 'normalize is idempotent');

    const cli = spawnSync(process.execPath, [wikiTool, 'normalize', '--path', project, '--date', '2026-09-06', '--json'], { cwd: project, encoding: 'utf8' });
    assert.equal(cli.status, 0, cli.stderr);
    assert.deepEqual(JSON.parse(cli.stdout).changed, []);
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
  }
});

test('alphanumeric task tables remain forbidden copied live task state', () => {
  const project = seededWiki();
  try {
    const target = path.join(project, 'workbench/wiki/Copied ID.md');
    fs.writeFileSync(target, note({}, '# Copied\n\n| Task | Slice | Status | Blockers | Proof |\n|---|---|---|---|---|\n| TK-00A | Slice | ready | none | pending |\n'));
    assert.ok(validateWiki(project).some(item => item.code === 'copied-task-state' && /task state|live state/i.test(item.message)));
  } finally { fs.rmSync(project, { recursive: true, force: true }); }
});

// S-00I TK-005: SCHEMA.md's Update section already says "Never copy live
// task rows, spec evidence, or generated Taskboard state into a note", but
// the pre-anchor LIVE_STATE_MARKERS only ever matched a slice-table row
// (starting with a bare `TK-...` cell) or the two literal region markers -
// never a Spec's own Append-Only Evidence And Execution Log row, whose first
// cell is a date and whose second cell is a Task id or the literal `spec` /
// `review` (closeTask/completeSpec/recordReviewVerdict's own vocabulary in
// spec-workbench.mjs and spec-report.mjs). A reconciliation that pastes a
// Spec's evidence log into a Wiki note - "transform, never copy" - is
// exactly the copied "spec evidence" SCHEMA.md already names, so it must
// fail the same copied-task-state check a copied slice table already does.
test('a Spec\'s own Append-Only Evidence And Execution Log row pasted into a wiki note is copied task state', () => {
  const project = seededWiki();
  try {
    const pastedTaskRow = path.join(project, 'workbench/wiki/Pasted Task Evidence.md');
    fs.writeFileSync(pastedTaskRow, note({}, '# Pasted\n\n| Date | Task | Event | Verification | Docs | Remaining gap |\n|---|---|---|---|---|---|\n| 2026-09-18 | TK-005 | Task closed | proof text | docs checked | none |\n'));
    const pastedSpecRow = path.join(project, 'workbench/wiki/Pasted Spec Evidence.md');
    fs.writeFileSync(pastedSpecRow, note({}, '# Pasted\n\n| Date | Task | Event | Verification | Docs | Remaining gap |\n|---|---|---|---|---|---|\n| 2026-09-18 | spec | Spec completed | Acceptance gates satisfied | Documentation impact recorded above | none |\n'));
    const pastedReviewRow = path.join(project, 'workbench/wiki/Pasted Review Evidence.md');
    fs.writeFileSync(pastedReviewRow, note({}, '# Pasted\n\n| Date | Task | Event | Verification | Docs | Remaining gap |\n|---|---|---|---|---|---|\n| 2026-09-18 | review | Review verdict: pass at abc1234 [deadbeefcafe] #1 | none | Claude Opus 5 | none |\n'));
    const findings = validateWiki(project);
    for (const [file, label] of [[pastedTaskRow, 'Pasted Task Evidence.md'], [pastedSpecRow, 'Pasted Spec Evidence.md'], [pastedReviewRow, 'Pasted Review Evidence.md']]) {
      assert.ok(findings.some((item) => item.note === `workbench/wiki/${label}` && item.code === 'copied-task-state'),
        `${label} must be reported as copied-task-state; SCHEMA.md forbids copying spec evidence into a note`);
    }
  } finally { fs.rmSync(project, { recursive: true, force: true }); }
});

// S-00I TK-01U: a features article is the readable knowledge a completed Spec
// is captured into at its closure point (S-00J closure-capture contract T4):
// what the delivered capability does, why it matters, its limits and its
// named evidence. It lives in the additive `features` collection, declares
// `type: feature`, and is refused when misplaced, malformed or a copy of
// delivery state. Design-concept and guidebook rules are unchanged.
function featureArticle(overrides = {}, sections = {}) {
  const body = {
    title: '# Fixture Capability\n\nA fixture room can retire a completed Spec into a readable article.\n',
    what: '## What It Does\n\nRetirement accepts a routed features article as the Spec\'s durable owner.\n',
    why: '## Why It Matters\n\nA cold reader learns what shipped without opening transient Task records.\n',
    limits: '## Limits\n\nFixture-only; no production record is retired by this proof.\n',
    evidence: '## Evidence and Sources\n\n- `tools/test-spec-workbench.mjs` exercises the eligibility seam.\n',
    ...sections
  };
  return note({
    type: 'feature',
    knowledge_role: 'curated',
    provenance: ['features capture at the closure point, 2026-09-26'],
    source_paths: ['workbench/specs/retired/S-700-fixture/SPEC.md', 'tools/test-spec-workbench.mjs'],
    last_verified: '2026-09-26',
    ...overrides
  }, [body.title, body.what, body.why, body.limits, body.evidence].filter(Boolean).join('\n'));
}

test('a feature article validates in the features collection, normalize infers its type, and a misplaced, malformed or copied one is refused', () => {
  const project = seededWiki();
  try {
    const wiki = path.join(project, 'workbench', 'wiki');
    const features = path.join(wiki, 'features');
    fs.mkdirSync(features, { recursive: true });
    fs.writeFileSync(path.join(features, 'fixture-capability.md'), featureArticle());
    assert.deepEqual(validateWiki(project), [], 'a complete, placed feature article validates with no finding');

    const noteFindings = (relative) => validateWiki(project).filter((item) => item.note === `workbench/wiki/${relative}`);

    fs.writeFileSync(path.join(wiki, 'misplaced-feature.md'), featureArticle());
    assert.ok(noteFindings('misplaced-feature.md').some((item) => item.code === 'invalid-note' && /type feature belongs in workbench\/wiki\/features/.test(item.message)),
      'a feature article outside the features collection is refused by name');
    fs.rmSync(path.join(wiki, 'misplaced-feature.md'));

    fs.writeFileSync(path.join(features, 'wrong-type.md'), featureArticle({ type: 'guidebook' }));
    assert.ok(noteFindings('features/wrong-type.md').some((item) => item.code === 'invalid-note' && /must declare type feature/.test(item.message)),
      'a note in the features collection must declare type feature');
    fs.rmSync(path.join(features, 'wrong-type.md'));

    fs.writeFileSync(path.join(features, 'no-limits.md'), featureArticle({}, { limits: '', why: '' }));
    const missing = noteFindings('features/no-limits.md').map((item) => item.message);
    assert.ok(missing.some((message) => /Limits section/.test(message)), 'a feature article states its limits');
    assert.ok(missing.some((message) => /Why It Matters section/.test(message)), 'a feature article says why it matters');
    fs.rmSync(path.join(features, 'no-limits.md'));

    fs.writeFileSync(path.join(features, 'pasted-state.md'), featureArticle({}, {
      evidence: '## Evidence and Sources\n\n| Date | Task | Event | Verification | Docs | Remaining gap |\n|---|---|---|---|---|---|\n| 2026-09-26 | TK-001 | Task closed | proof | docs | none |\n'
    }));
    assert.ok(noteFindings('features/pasted-state.md').some((item) => item.code === 'copied-task-state'), 'copied delivery state is refused, never captured');
    fs.rmSync(path.join(features, 'pasted-state.md'));

    fs.writeFileSync(path.join(features, 'Bare Feature.md'), '# Bare Feature\n\nNo metadata yet.\n');
    const result = normalizeWiki(project, { date: '2026-09-26' });
    assert.deepEqual(result.changed.map((entry) => entry.note), ['workbench/wiki/features/Bare Feature.md']);
    assert.match(fs.readFileSync(path.join(features, 'Bare Feature.md'), 'utf8'), /^---\ntype: feature\nstatus: partial\n/, 'normalize infers type feature from the collection');
    assert.ok(noteFindings('features/Bare Feature.md').some((item) => /What It Does section/.test(item.message)), 'normalize adds no article sections; validate keeps reporting them');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
  }
});

// S-003W TK-001: the link-safe note move. A fixture room carries a per-Spec
// design-concept article, and every kind of surface that links to it: the
// router, a sibling note, a root control, a Spec (live prose and its
// append-only evidence), a Task record and a landmark question card.
function moveFixture() {
  const project = seededWiki();
  const wiki = path.join(project, 'workbench', 'wiki');
  const concepts = path.join(wiki, 'design-concepts');
  const specDir = path.join(project, 'workbench', 'specs', 'S-700-fixture');
  const taskDir = path.join(specDir, 'tasks', 'TK-001');
  const cards = path.join(project, 'workbench', 'landmark-tracker', 'destination-questions');
  for (const directory of [concepts, path.join(wiki, 'features'), taskDir, cards]) fs.mkdirSync(directory, { recursive: true });
  const article = note({
    type: 'design-concept', authorized_by: 'owner', parent: 'none', provenance: ['owner-directed reconciliation, 2026-09-19'],
    source_paths: ['workbench/specs/S-700-fixture/SPEC.md']
  }, '# Fixture Article\n\nSee the [Spec](../../specs/S-700-fixture/SPEC.md), the [sibling](sibling.md#part) and [the blueprint](../../../BLUEPRINT.md), also [verbose](../../../workbench/specs/S-700-fixture/SPEC.md).\n\n## Evidence and Sources\n\n- [Spec](../../specs/S-700-fixture/SPEC.md)\n\n## History\n\n- 2026-09-19: Created.\n');
  fs.writeFileSync(path.join(concepts, 'spec-S-700-fixture.md'), article);
  fs.writeFileSync(path.join(concepts, 'sibling.md'), note({ type: 'design-concept', authorized_by: 'owner', parent: 'none' }, '# Sibling\n\nBack to [the article](spec-S-700-fixture.md).\n\n## Evidence and Sources\n\n- none\n\n## History\n\n- 2026-09-19: Created.\n'));
  fs.appendFileSync(path.join(wiki, 'MEMORY.md'), '\n- [Fixture Article](design-concepts/spec-S-700-fixture.md)\n');
  fs.appendFileSync(path.join(project, 'README.md'), '\nSee [the article](workbench/wiki/design-concepts/spec-S-700-fixture.md).\n');
  fs.writeFileSync(path.join(specDir, 'SPEC.md'), '# S-700 - Fixture\n\nArticle: [Fixture Article](../../wiki/design-concepts/spec-S-700-fixture.md).\n\n## Append-Only Evidence And Execution Log\n\n| Date | Task | Event | Verification | Docs | Remaining gap |\n|---|---|---|---|---|---|\n| 2026-09-19 | - | captured in [the article](../../wiki/design-concepts/spec-S-700-fixture.md) | none | none | none |\n');
  fs.writeFileSync(path.join(taskDir, 'TASK.md'), '# TK-001\n\nRead [the article](../../../../wiki/design-concepts/spec-S-700-fixture.md#what).\n');
  fs.writeFileSync(path.join(cards, 'DQC-7000.json'), `${JSON.stringify({ id: 'DQC-7000', answer: 'Documented in [the article](../../wiki/design-concepts/spec-S-700-fixture.md).' }, null, 2)}\n`);
  return { project, wiki, concepts, specDir, taskDir, cards };
}

function treeSnapshot(directory) {
  const entries = {};
  const walk = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else entries[path.relative(directory, full)] = fs.readFileSync(full, 'utf8');
    }
  };
  walk(directory);
  return entries;
}

test('move-note retypes, renames and relocates one note, rewrites every live link, counts the historical one and leaves the wiki valid', () => {
  const fixtureRoom = moveFixture();
  const { project, wiki, concepts, specDir, taskDir, cards } = fixtureRoom;
  try {
    const result = moveNote(project, { note: 'workbench/wiki/design-concepts/spec-S-700-fixture.md', to: 'features', name: 'fixture-capability', retype: 'feature' });
    assert.equal(result.from, 'workbench/wiki/design-concepts/spec-S-700-fixture.md');
    assert.equal(result.to, 'workbench/wiki/features/fixture-capability.md');
    assert.equal(result.type, 'feature');
    assert.equal(fs.existsSync(path.join(concepts, 'spec-S-700-fixture.md')), false, 'the old path is gone');
    const moved = fs.readFileSync(path.join(wiki, 'features', 'fixture-capability.md'), 'utf8');
    assert.match(moved, /^---\ntype: feature\n/, 'the note is retyped in its frontmatter');
    assert.match(moved, /\(\.\.\/\.\.\/specs\/S-700-fixture\/SPEC\.md\)/, 'a same-depth outgoing link is untouched');
    assert.match(moved, /\(\.\.\/\.\.\/\.\.\/workbench\/specs\/S-700-fixture\/SPEC\.md\)/, 'a link that still resolves keeps its author\'s spelling instead of being shortened');
    assert.match(moved, /\(\.\.\/design-concepts\/sibling\.md#part\)/, 'an outgoing link to a note left behind is recomputed and keeps its fragment');

    const read = (file) => fs.readFileSync(file, 'utf8');
    assert.match(read(path.join(wiki, 'MEMORY.md')), /\]\(features\/fixture-capability\.md\)/);
    assert.match(read(path.join(concepts, 'sibling.md')), /\]\(\.\.\/features\/fixture-capability\.md\)/);
    assert.match(read(path.join(project, 'README.md')), /\]\(workbench\/wiki\/features\/fixture-capability\.md\)/);
    assert.match(read(path.join(specDir, 'SPEC.md')), /Article: \[Fixture Article\]\(\.\.\/\.\.\/wiki\/features\/fixture-capability\.md\)/);
    assert.match(read(path.join(taskDir, 'TASK.md')), /\]\(\.\.\/\.\.\/\.\.\/\.\.\/wiki\/features\/fixture-capability\.md#what\)/, 'a Task record link keeps its fragment');
    assert.match(read(path.join(cards, 'DQC-7000.json')), /\]\(\.\.\/\.\.\/wiki\/features\/fixture-capability\.md\)/, 'a question card link is rewritten');
    assert.match(read(path.join(specDir, 'SPEC.md')), /captured in \[the article\]\(\.\.\/\.\.\/wiki\/design-concepts\/spec-S-700-fixture\.md\)/, 'an append-only evidence row is history and keeps its old link');

    assert.deepEqual(result.historicalReferencesLeft, { 'workbench/specs/S-700-fixture/SPEC.md': 1 });
    assert.equal(result.referencesRewritten['workbench/wiki/MEMORY.md'], 1);
    assert.equal(result.referencesRewritten['workbench/wiki/design-concepts/sibling.md'], 1);
    assert.equal(result.referencesRewritten['workbench/specs/S-700-fixture/SPEC.md'], 1);
    assert.equal(result.referencesRewritten['workbench/wiki/features/fixture-capability.md'], 1, 'the moved note is reported under its new path, counting only the link that needed repair');
    assert.equal(result.usesGit, false);
    const afterMove = validateWiki(project).filter((item) => item.note === 'workbench/wiki/features/fixture-capability.md');
    assert.ok(afterMove.length > 0 && afterMove.every((item) => /must carry a .* section/.test(item.message)), 'the retyped note is in the right collection with the right type; only the feature sections remain for its author to write');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
  }
});

test('move-note recomputes a moved note\'s outgoing links when it changes depth, and a dry run writes nothing', () => {
  const project = seededWiki();
  try {
    const wiki = path.join(project, 'workbench', 'wiki');
    fs.writeFileSync(path.join(wiki, 'Loose.md'), note({}, '# Loose\n\nSee [the blueprint](../../BLUEPRINT.md), [the router](MEMORY.md#top) and [the web](https://example.com/a).\n'));
    fs.appendFileSync(path.join(wiki, 'MEMORY.md'), '\n- [Loose](Loose.md)\n');
    const before = treeSnapshot(project);
    const planned = moveNote(project, { note: 'workbench/wiki/Loose.md', to: 'archive', dryRun: true });
    assert.equal(planned.dryRun, true);
    assert.equal(planned.to, 'workbench/wiki/archive/Loose.md');
    assert.deepEqual(treeSnapshot(project), before, 'a dry run writes nothing');
    moveNote(project, { note: 'workbench/wiki/Loose.md', to: 'archive' });
    const moved = fs.readFileSync(path.join(wiki, 'archive', 'Loose.md'), 'utf8');
    assert.match(moved, /\]\(\.\.\/\.\.\/\.\.\/BLUEPRINT\.md\)/, 'a link out of the note is recomputed for its new depth');
    assert.match(moved, /\]\(\.\.\/MEMORY\.md#top\)/);
    assert.match(moved, /\]\(https:\/\/example\.com\/a\)/, 'a web link is never touched');
    assert.match(fs.readFileSync(path.join(wiki, 'MEMORY.md'), 'utf8'), /\]\(archive\/Loose\.md\)/);
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
  }
});

test('move-note refuses unsafe moves with a clear reason and writes nothing', () => {
  const { project, wiki, concepts } = moveFixture();
  try {
    fs.writeFileSync(path.join(wiki, 'features', 'taken.md'), featureArticle());
    fs.writeFileSync(path.join(wiki, 'features', 'sibling-name.md'), featureArticle());
    fs.writeFileSync(path.join(wiki, 'Bare.md'), '# Bare\n\nNo frontmatter.\n');
    fs.writeFileSync(path.join(wiki, 'Wikilinked.md'), note({}, '# Wikilinked\n\nSee [[Orphaned Name]].\n'));
    fs.writeFileSync(path.join(wiki, 'Orphaned Name.md'), note({}, '# Orphaned\n'));
    const article = 'workbench/wiki/design-concepts/spec-S-700-fixture.md';
    const before = treeSnapshot(project);
    const refuse = (options, pattern, label) => {
      assert.throws(() => moveNote(project, options), pattern, label);
      assert.deepEqual(treeSnapshot(project), before, `${label}: nothing was written`);
    };
    refuse({ note: article, to: 'features' }, /features does not accept type design-concept/, 'a type the destination does not accept');
    refuse({ note: article, to: 'features', retype: 'guidebook' }, /features does not accept type guidebook/, 'a retype the destination does not accept');
    refuse({ note: article, to: 'guidebooks', retype: 'bogus' }, /type bogus is not one of/, 'an unknown retype');
    refuse({ note: article, to: 'features', retype: 'feature', name: 'taken' }, /already exists/, 'an occupied destination');
    refuse({ note: article, to: 'design-concepts', name: 'sibling' }, /already exists/, 'an occupied destination in the same collection');
    refuse({ note: article, to: 'archive', name: 'taken' }, /basename taken is not unique/, 'a basename another collection already holds');
    refuse({ note: article, to: 'design-concepts' }, /already lives in/, 'a no-op move');
    refuse({ note: article, to: 'nowhere' }, /unknown destination collection nowhere/, 'an unknown collection');
    refuse({ note: article, to: 'features', retype: 'feature', name: '../escape' }, /name must be a plain note name/, 'a path in the new name');
    refuse({ note: 'workbench/wiki/MEMORY.md', to: 'archive' }, /router and contract files do not move/, 'the router');
    refuse({ note: 'workbench/wiki/design-concepts/README.md', to: 'archive' }, /router and contract files do not move/, 'a collection README');
    refuse({ note: 'workbench/wiki/missing.md', to: 'archive' }, /does not exist/, 'a missing note');
    refuse({ note: 'README.md', to: 'archive' }, /must be inside the wiki lane/, 'a note outside the wiki lane');
    refuse({ note: 'workbench/wiki/Bare.md', to: 'archive' }, /has no frontmatter/, 'a note with no frontmatter');
    refuse({ note: 'workbench/wiki/Orphaned Name.md', to: 'archive', name: 'Renamed' }, /wikilink/, 'a rename that would orphan a wikilink');
    assert.equal(fs.existsSync(path.join(concepts, 'spec-S-700-fixture.md')), true);
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
  }
});

test('move-note in a Git room records a rename and stages only the files it changed; the CLI reports JSON and refuses with exit 1', () => {
  const { project, wiki } = moveFixture();
  try {
    const git = (...args) => spawnSync('git', ['-C', project, ...args], { encoding: 'utf8' });
    assert.equal(git('init', '-q').status, 0);
    git('config', 'user.email', 'fixture@example.com');
    git('config', 'user.name', 'Fixture');
    git('add', '-A');
    assert.equal(git('commit', '-q', '-m', 'fixture').status, 0);
    fs.writeFileSync(path.join(project, 'unrelated.txt'), 'unrelated dirty work\n');
    const cli = spawnSync(process.execPath, [wikiTool, 'move-note', 'workbench/wiki/design-concepts/spec-S-700-fixture.md', '--to', 'features', '--name', 'fixture-capability', '--retype', 'feature', '--path', project, '--json'], { cwd: project, encoding: 'utf8' });
    assert.equal(cli.status, 0, cli.stderr);
    const report = JSON.parse(cli.stdout);
    assert.equal(report.usesGit, true);
    assert.equal(report.to, 'workbench/wiki/features/fixture-capability.md');
    const status = git('status', '--porcelain').stdout;
    assert.match(status, /^R  workbench\/wiki\/design-concepts\/spec-S-700-fixture\.md -> workbench\/wiki\/features\/fixture-capability\.md$/m, 'git sees a rename');
    assert.match(status, /^\?\? unrelated\.txt$/m, 'unrelated work is never staged');
    assert.doesNotMatch(status, /^.M /m, 'every changed file is staged, none is left half-edited');
    const refused = spawnSync(process.execPath, [wikiTool, 'move-note', 'workbench/wiki/features/fixture-capability.md', '--to', 'design-concepts', '--path', project], { cwd: project, encoding: 'utf8' });
    assert.equal(refused.status, 1);
    assert.match(refused.stderr, /design-concepts does not accept type feature/);
    const usage = spawnSync(process.execPath, [wikiTool, 'move-note', '--path', project], { cwd: project, encoding: 'utf8' });
    assert.equal(usage.status, 1);
    assert.match(usage.stderr, /move-note NOTE --to COLLECTION/);
    assert.equal(fs.existsSync(path.join(wiki, 'features', 'fixture-capability.md')), true);
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
  }
});

// S-002L TK-006M: the draft skills wiki lives in `workbench/wiki/skills-draft/`,
// one folder per group, and is the Wiki's second nesting exception beside
// `archive/`. It is a repo-only prototype, so it is named by SCHEMA.md and this
// validator rather than declared in the manifest's closed collection set. A
// draft article is `skills-draft/<group>/<skill>.md` with the scoped
// `status: draft`, and the scoped status is refused everywhere else.
const DRAFT_GROUPS = ['getting-started', 'main-workflow', 'shaping', 'upkeep', 'primitives', 'productivity', 'stances', 'foundry'];

const READER_SECTIONS = ['What it does', 'When to reach for it', 'What it needs', 'What it reads and writes', 'How it works', 'Common questions', 'It\'s working if', 'Where it fits'];
const DRAFT_ONLY_SECTIONS = ['Compared with Matt\'s', 'Findings', 'Sources and history'];
const FINDING_KINDS = ['dangling', 'stale-name', 'overlap', 'gap', 'conflict', 'missing-skill'];

// A complete draft body: the eight reader sections, the draft-only marker, then
// the three draft-only sections. `findings` replaces the Findings section text.
function draftBody({ skip = [], findings = 'F:wayfinder:01 | gap | no home is named for pre-Spec decisions | wayfinder Spec\nF:wayfinder:02 | dangling | names a skill that does not exist | owning Spec' } = {}) {
  const lines = ['# Wayfinder: chart a large effort one decision at a time', ''];
  const section = (name) => { if (!skip.includes(name)) lines.push(`## ${name}`, '', name === 'Findings' ? findings : 'Filled.', ''); };
  READER_SECTIONS.forEach(section);
  if (!skip.includes('marker')) lines.push('--- draft only, stripped on promotion ---', '');
  DRAFT_ONLY_SECTIONS.forEach(section);
  return lines.join('\n');
}

function draftArticle(overrides = {}, body = draftBody()) {
  return note({
    type: 'memory',
    status: 'draft',
    skill: 'wayfinder',
    group: 'shaping',
    skill_source: 'pending',
    origin: 'matt',
    matt_counterpart: 'wayfinder',
    provenance: ['draft skills wiki pilot, upstream pin d81f3a1'],
    source_paths: ['BLUEPRINT.md'],
    last_verified: '2026-10-04',
    ...overrides
  }, body);
}

test('a nested draft article validates in the skills-draft collection, and a misplaced, mis-grouped or wrongly scoped one is refused by name', () => {
  const project = seededWiki();
  try {
    const wiki = path.join(project, 'workbench', 'wiki');
    const drafts = path.join(wiki, 'skills-draft');
    for (const group of DRAFT_GROUPS) fs.mkdirSync(path.join(drafts, group), { recursive: true });
    fs.writeFileSync(path.join(drafts, 'README.md'), note({ type: 'meta', knowledge_role: 'canonical' }, '# Skills draft wiki\n\nIndex.\n'));
    fs.writeFileSync(path.join(drafts, 'shaping', 'wayfinder.md'), draftArticle());
    assert.deepEqual(validateWiki(project), [], 'a placed, well-formed draft with an index README validates with no finding');

    const noteFindings = (relative) => validateWiki(project).filter((item) => item.note === `workbench/wiki/${relative}`);
    const refused = (relative, pattern, why) => assert.ok(noteFindings(relative).some((item) => item.code === 'invalid-note' && pattern.test(item.message)), why);

    fs.writeFileSync(path.join(wiki, 'flat-draft.md'), draftArticle());
    refused('flat-draft.md', /status draft belongs in workbench\/wiki\/skills-draft/, 'status draft outside the collection is refused');
    fs.rmSync(path.join(wiki, 'flat-draft.md'));

    fs.writeFileSync(path.join(drafts, 'shaping', 'not-a-draft.md'), draftArticle({ status: 'active', skill: 'not-a-draft' }));
    refused('skills-draft/shaping/not-a-draft.md', /must declare status draft/, 'a note in the collection must declare status draft');
    fs.rmSync(path.join(drafts, 'shaping', 'not-a-draft.md'));

    fs.writeFileSync(path.join(drafts, 'shaping', 'regroup.md'), draftArticle({ skill: 'regroup', group: 'upkeep' }));
    refused('skills-draft/shaping/regroup.md', /group upkeep does not match its folder shaping/, 'a draft names the group folder it sits in');
    fs.rmSync(path.join(drafts, 'shaping', 'regroup.md'));

    fs.writeFileSync(path.join(drafts, 'shaping', 'anonymous.md'), draftArticle({ skill: undefined, group: undefined }));
    refused('skills-draft/shaping/anonymous.md', /must declare group shaping/, 'a draft that omits its group is refused');
    refused('skills-draft/shaping/anonymous.md', /must declare skill anonymous/, 'a draft that omits its skill is refused');
    fs.rmSync(path.join(drafts, 'shaping', 'anonymous.md'));

    fs.writeFileSync(path.join(drafts, 'shaping', 'renamed.md'), draftArticle({ skill: 'someone-else' }));
    refused('skills-draft/shaping/renamed.md', /skill someone-else does not match its file name renamed/, 'a draft names the skill its file is called');
    fs.rmSync(path.join(drafts, 'shaping', 'renamed.md'));

    fs.mkdirSync(path.join(drafts, 'extras'));
    fs.writeFileSync(path.join(drafts, 'extras', 'stray.md'), draftArticle({ skill: 'stray', group: 'extras' }));
    refused('skills-draft/extras/stray.md', /folder extras is not one of the group folders/, 'an unknown group folder is refused');
    fs.rmSync(path.join(drafts, 'extras'), { recursive: true });

    fs.writeFileSync(path.join(drafts, 'loose.md'), draftArticle({ skill: 'loose' }));
    refused('skills-draft/loose.md', /must sit directly inside a group folder/, 'a draft loose at the collection root is refused');
    fs.rmSync(path.join(drafts, 'loose.md'));

    fs.mkdirSync(path.join(drafts, 'shaping', 'deeper'));
    fs.writeFileSync(path.join(drafts, 'shaping', 'deeper', 'buried.md'), draftArticle({ skill: 'buried' }));
    refused('skills-draft/shaping/deeper/buried.md', /must sit directly inside a group folder/, 'a draft nested below its group folder is refused');
    fs.rmSync(path.join(drafts, 'shaping', 'deeper'), { recursive: true });

    assert.deepEqual(validateWiki(project), [], 'removing every refused note leaves the wiki clean');

    fs.writeFileSync(path.join(drafts, 'shaping', 'Bare Draft.md'), '# Bare Draft\n\nNo metadata yet.\n');
    const result = normalizeWiki(project, { date: '2026-10-04' });
    assert.deepEqual(result.changed.map((entry) => entry.note), ['workbench/wiki/skills-draft/shaping/Bare Draft.md']);
    assert.match(fs.readFileSync(path.join(drafts, 'shaping', 'Bare Draft.md'), 'utf8'), /^---\ntype: memory\nstatus: partial\n/, 'normalize infers type memory inside the draft collection and never invents the draft status');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
  }
});

test('the product wiki carries the skills-draft collection with every group folder tracked', () => {
  for (const group of DRAFT_GROUPS) {
    assert.equal(fs.existsSync(path.join(root, 'workbench', 'wiki', 'skills-draft', group, '.gitkeep')), true, `skills-draft/${group} must be a tracked folder`);
  }
  assert.match(fs.readFileSync(path.join(root, 'workbench', 'wiki', 'SCHEMA.md'), 'utf8'), /skills-draft\//, 'SCHEMA.md names the draft collection as its nesting exception');
});


// S-002L TK-006N: a draft carries the owner-approved reader sections and the
// draft-only tail, every finding is one greppable line in the fixed format, and
// the collection's TEMPLATE.md is the template the validator accepts.
function templateFence(template) {
  const match = template.match(/```markdown\n(---\n[\s\S]*?)\n```/);
  assert.ok(match, 'TEMPLATE.md carries the article template in a markdown fence');
  return match[1] + '\n';
}

test('a draft must carry the template sections and one well-formed finding per line, and every refusal names the rule', () => {
  const project = seededWiki();
  try {
    const wiki = path.join(project, 'workbench', 'wiki');
    const drafts = path.join(wiki, 'skills-draft');
    for (const group of DRAFT_GROUPS) fs.mkdirSync(path.join(drafts, group), { recursive: true });
    const target = path.join(drafts, 'shaping', 'wayfinder.md');
    const refusedWith = (article, pattern, why) => {
      fs.writeFileSync(target, article);
      const found = validateWiki(project).filter((item) => item.note === 'workbench/wiki/skills-draft/shaping/wayfinder.md');
      assert.ok(found.some((item) => item.code === 'invalid-note' && pattern.test(item.message)), `${why}: ${found.map((item) => item.message).join(' | ')}`);
    };

    fs.writeFileSync(target, draftArticle());
    assert.deepEqual(validateWiki(project), [], 'a complete draft with well-formed findings validates');
    fs.writeFileSync(target, draftArticle({}, draftBody({ findings: 'none' })));
    assert.deepEqual(validateWiki(project), [], 'a draft that records no finding says none');
    fs.writeFileSync(target, draftArticle({}, draftBody({ findings: '<!-- F:<skill>:NN | kind | one line | who fixes it -->\nF:wayfinder:01 | overlap | two skills write the same note | to-docs Spec' })));
    assert.deepEqual(validateWiki(project), [], 'a single-line comment is allowed beside findings');

    for (const section of [...READER_SECTIONS, ...DRAFT_ONLY_SECTIONS]) {
      refusedWith(draftArticle({}, draftBody({ skip: [section] })), new RegExp(`must carry a .${section.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}. section`), `a draft missing ${section} is refused`);
    }
    refusedWith(draftArticle({}, draftBody({ skip: ['marker'] })), /draft-only marker/, 'a draft without the draft-only marker line is refused');

    refusedWith(draftArticle({}, draftBody({ findings: 'F:wayfinder:1 | gap | number is not two digits | owner' })), /malformed finding line/, 'a finding with a one-digit number is refused');
    refusedWith(draftArticle({}, draftBody({ findings: 'F:wayfinder:01 | gap | only three fields' })), /malformed finding line/, 'a finding with three fields is refused');
    refusedWith(draftArticle({}, draftBody({ findings: '- F:wayfinder:01 | gap | bulleted | owner' })), /malformed finding line/, 'a bulleted finding is refused so the roll-up can anchor on F:');
    refusedWith(draftArticle({}, draftBody({ findings: 'Some prose about the skill.' })), /malformed finding line/, 'prose inside Findings is refused');
    refusedWith(draftArticle({}, draftBody({ findings: 'F:wayfinder:01 | nonsense | bad kind | owner' })), new RegExp(`finding kind nonsense is not one of ${FINDING_KINDS.join(', ')}`), 'an unknown finding kind is refused');
    refusedWith(draftArticle({}, draftBody({ findings: 'F:someone-else:01 | gap | wrong skill | owner' })), /finding names skill someone-else, not wayfinder/, 'a finding for another skill is refused');
    refusedWith(draftArticle({}, draftBody({ findings: 'F:wayfinder:01 | gap | first | owner\nF:wayfinder:01 | gap | repeated number | owner' })), /finding number 01 is used twice/, 'a repeated finding number is refused');

    fs.writeFileSync(target, draftArticle({ origin: 'other' }));
    assert.deepEqual(validateWiki(project), [], 'a skill from none of the three origins says other');
    refusedWith(draftArticle({ origin: 'workbench # foundry = revisit later' }), /origin .* is not one of workbench, matt, foundry, other/, 'an origin carrying a trailing comment is refused');
    refusedWith(draftArticle({ skill_source: 'somewhere' }), /skill_source somewhere is not one of core, pending, personal, new/, 'an unknown skill_source is refused');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
  }
});

test('the collection TEMPLATE.md fixes the finding line and kinds, and the template it carries validates once filled', () => {
  const templatePath = path.join(root, 'workbench', 'wiki', 'skills-draft', 'TEMPLATE.md');
  assert.equal(fs.existsSync(templatePath), true, 'skills-draft/TEMPLATE.md must exist');
  const template = fs.readFileSync(templatePath, 'utf8');
  assert.match(template, /F:<skill>:NN \| kind \| one line \| who fixes it/, 'TEMPLATE.md fixes the finding line format');
  for (const kind of FINDING_KINDS) assert.match(template, new RegExp('`' + kind + '`'), `TEMPLATE.md names the finding kind ${kind}`);
  const fence = templateFence(template);
  for (const section of [...READER_SECTIONS, ...DRAFT_ONLY_SECTIONS]) assert.match(fence, new RegExp(`^## ${section.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'm'), `the template carries the ${section} section`);
  assert.match(fence, /^--- draft only, stripped on promotion ---$/m, 'the template carries the draft-only marker');
  const project = seededWiki();
  try {
    const drafts = path.join(project, 'workbench', 'wiki', 'skills-draft');
    fs.mkdirSync(path.join(drafts, 'shaping'), { recursive: true });
    const filled = fence
      .replace('<skill-name>', 'wayfinder').replace('<group-folder>', 'shaping')
      .replace('<core | pending | personal | new>', 'pending').replace('<workbench | matt | foundry | other>', 'matt')
      .replace('YYYY-MM-DD', '2026-10-04').replace('<repository-relative path>', 'BLUEPRINT.md');
    assert.doesNotMatch(filled, /<skill-name>|<group-folder>/, 'the named placeholders were all substituted');
    fs.writeFileSync(path.join(drafts, 'shaping', 'wayfinder.md'), filled);
    assert.deepEqual(validateWiki(project), [], 'the template, filled with only its named placeholders, is a valid draft');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
  }
});

// S-002L TK-006O: the collection's index README lists every group with its
// article count and every planned article with its owning Spec, as plain text
// until the owning Spec delivers the article, and the router links it once.
test('the skills-draft index lists 81 article slots, links delivered drafts, and routes through its owning collection', () => {
  const wiki = path.join(root, 'workbench', 'wiki');
  const readme = fs.readFileSync(path.join(wiki, 'skills-draft', 'README.md'), 'utf8');
  const counts = { 'getting-started': 7, 'main-workflow': 14, shaping: 7, upkeep: 21, primitives: 12, productivity: 5, stances: 6, foundry: 9 };
  const specFolders = [];
  const collect = (directory, depth) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      if (/^S-[0-9A-Za-z]+-/.test(entry.name)) specFolders.push(entry.name);
      else if (depth < 2) collect(path.join(directory, entry.name), depth + 1);
    }
  };
  collect(path.join(root, 'workbench', 'specs'), 0);
  let total = 0;
  for (const group of DRAFT_GROUPS) {
    const section = readme.split(new RegExp(`^## ${group}$`, 'm'))[1]?.split(/^## /m)[0];
    assert.ok(section, `the index has a ${group} section`);
    const rows = section.split('\n').filter((line) => /^\| [^|-]/.test(line) && !/^\| Skill \|/.test(line));
    assert.equal(rows.length, counts[group], `${group} lists ${counts[group]} planned articles`);
    for (const row of rows) {
      const [, skill, , owner] = row.split('|').map((cell) => cell.trim());
      const link = skill.match(/^\[([a-z][a-z0-9-]*)\]\(([^)]+)\)$/);
      const name = link ? link[1] : skill;
      assert.match(name, /^[a-z][a-z0-9-]*$/, `${skill} has a valid skill name`);
      const article = path.join(wiki, 'skills-draft', group, `${name}.md`);
      if (fs.existsSync(article)) {
        assert.ok(link, `${name}'s existing draft must be discoverable from its index row`);
        assert.equal(link[2], `${group}/${name}.md`, `${name}'s link resolves to its own article in its declared group`);
      } else {
        assert.equal(link, null, `${name} has no draft yet, so its row stays plain text`);
      }
      const id = owner.match(/^(S-[0-9A-Za-z]+) \(/)?.[1];
      assert.ok(id, `${name} names an owning Spec as "S-### (name)": ${owner}`);
      assert.ok(specFolders.some((folder) => folder.startsWith(`${id}-`)), `${name}'s owning Spec ${id} exists`);
    }
    total += rows.length;
  }
  assert.equal(total, 81, 'the index lists 81 planned articles');
  assert.deepEqual(readme.match(/^\| \[[a-z-]+\]\(#[a-z-]+\) \| (\d+) \|/gm).map((line) => Number(line.match(/\| (\d+) \|/)[1])), DRAFT_GROUPS.map((group) => counts[group]), 'the summary table carries the per-group counts in group order');

  const command = readme.match(/```bash\n(grep [^\n]+)\n```/)?.[1];
  assert.ok(command, 'the index documents the one command that lists every finding');
  const listed = spawnSync('sh', ['-c', command], { cwd: root, encoding: 'utf8' });
  assert.doesNotMatch(listed.stdout, /F:<skill>:NN/, 'the documented findings command does not list the template\'s own format line');

  const router = fs.readFileSync(path.join(wiki, 'MEMORY.md'), 'utf8');
  assert.equal(router.split('skills-draft/README.md').length - 1, 1, 'MEMORY.md links the collection README exactly once');
  assert.doesNotMatch(router, /skills-draft\/[a-z-]+\//, 'MEMORY.md routes to no draft article directly');
  for (const name of fs.readdirSync(wiki).filter((entry) => /^skill-.*\.md$/.test(entry))) {
    assert.ok(router.includes(`(${name})`), `${name} stays routed from MEMORY.md`);
  }
  assert.deepEqual(validateWiki(root).filter((item) => item.severity === 'error'), [], 'the product wiki validates without error findings');
});

// S-004O TK-009D: a lexicon article is a Wiki page that explains one glossary
// term. It declares the term in `glossary_term:` and links its canonical
// definition in the room's root GLOSSARY.md; the validator refuses one whose
// term is not a `**Term**:` glossary entry, that lacks the link, or that sits
// in a room with no GLOSSARY.md. A page that declares no term is a general
// reference page and needs no glossary entry.
const GLOSSARY_FIXTURE = '# Fixture\n\nThe fixture glossary.\n\n## Language\n\n**Landmark**:\nA direction toward the destination.\n\n**Traverse, don\'t search**:\nFollow links from known entry points.\n';

function lexiconArticle(term, body = `# ${term}\n\nWhat it means here. [Canonical definition](../../GLOSSARY.md#language).\n`) {
  return note({ type: 'memory', glossary_term: term, source_paths: ['GLOSSARY.md'] }, body);
}

test('TK-009D: a lexicon article declares its glossary term and links GLOSSARY.md, and the validator refuses an unknown term, a missing link or a missing glossary', () => {
  const project = seededWiki();
  try {
    const wiki = path.join(project, 'workbench', 'wiki');
    const glossaryFindings = () => validateWiki(project).filter((item) => /glossary/i.test(item.message));
    fs.writeFileSync(path.join(wiki, 'dictionary-token.md'), note({ type: 'memory' }, '# Token\n\nA general reference page.\n'));
    assert.deepEqual(validateWiki(project), [], 'a general reference page declares no term and needs no glossary');

    fs.writeFileSync(path.join(wiki, 'dictionary-landmark.md'), lexiconArticle('Landmark'));
    const missing = glossaryFindings();
    assert.equal(missing.length, 1, 'a room with no GLOSSARY.md reports the declaring article once');
    assert.deepEqual([missing[0].code, missing[0].severity, missing[0].note], ['invalid-note', 'error', 'workbench/wiki/dictionary-landmark.md']);
    assert.match(missing[0].message, /no GLOSSARY\.md/, 'the message says the glossary is absent');

    fs.writeFileSync(path.join(project, 'GLOSSARY.md'), GLOSSARY_FIXTURE);
    assert.deepEqual(validateWiki(project), [], 'a declared glossary term with a GLOSSARY.md link is valid');
    fs.writeFileSync(path.join(wiki, 'dictionary-traverse-don-t-search.md'), lexiconArticle('Traverse, don\'t search'));
    assert.deepEqual(validateWiki(project), [], 'a term with a comma and an apostrophe matches its entry');

    fs.writeFileSync(path.join(wiki, 'dictionary-waypoint.md'), lexiconArticle('Waypoint'));
    const unknown = glossaryFindings();
    assert.equal(unknown.length, 1);
    assert.equal(unknown[0].note, 'workbench/wiki/dictionary-waypoint.md');
    assert.match(unknown[0].message, /Waypoint/);
    assert.match(unknown[0].message, /not a GLOSSARY\.md entry/);
    fs.rmSync(path.join(wiki, 'dictionary-waypoint.md'));

    fs.writeFileSync(path.join(wiki, 'dictionary-landmark.md'), lexiconArticle('Landmark', '# Landmark\n\nNo link to its definition. GLOSSARY.md named in prose only.\n'));
    const unlinked = glossaryFindings();
    assert.equal(unlinked.length, 1);
    assert.match(unlinked[0].message, /must link its canonical definition in GLOSSARY\.md/);

    fs.writeFileSync(path.join(wiki, 'dictionary-landmark.md'), lexiconArticle('Landmark', '# Landmark\n\n[The glossary](GLOSSARY.md) resolves inside the Wiki, not to the root.\n'));
    assert.equal(glossaryFindings().length, 1, 'only a link that resolves to the root GLOSSARY.md counts');

    fs.writeFileSync(path.join(wiki, 'dictionary-landmark.md'), lexiconArticle(''));
    assert.match(glossaryFindings()[0]?.message ?? '', /glossary_term is empty/, 'an empty declaration is refused');
    const cli = spawnSync(process.execPath, [wikiTool, 'validate', '--path', project], { cwd: project, encoding: 'utf8' });
    assert.equal(cli.status, 1, 'a refused lexicon article fails the wiki command');
  } finally {
    fs.rmSync(project, { recursive: true, force: true });
  }
});

// S-004O TK-009D: every root landing-inventory glossary entry that records its
// Distinction text as `explanationText` lands that text in its
// `explanationHome` lexicon article, which declares the entry's term and is
// routed from MEMORY.md. Batch one is the glossary's Destination and direction
// and Workflow verbs groups; later batches add their entries the same way.
const ROOT_INVENTORY = 'workbench/specs/S-004O-lexicon-retirement-and-architecture-md/proof/lexicon-landing-inventory-final.json';
const flat = (text) => String(text).replace(/\s+/g, ' ').trim();

function glossaryGroupTerms(group) {
  const glossary = fs.readFileSync(path.join(root, 'GLOSSARY.md'), 'utf8');
  const section = glossary.split(new RegExp(`^### ${group}$`, 'm'))[1]?.split(/^#{2,3} /m)[0] ?? '';
  return [...section.matchAll(/^\*\*(.+?)\*\*:\s*$/gm)].map((match) => match[1]);
}

test('TK-009D: each explained glossary entry lands its Distinction text in a routed lexicon article that declares the term', () => {
  const inventory = JSON.parse(fs.readFileSync(path.join(root, ROOT_INVENTORY), 'utf8'));
  // S-004O TK-009M: every retired alias records the distinction its Lexicon
  // row carried (Ticket's prefix rule, the Root controls public-name
  // exception, Portable layout, Portability model).
  const aliases = inventory.entries.filter((item) => item.aliasOf);
  assert.equal(aliases.length, 4, 'the root inventory carries four retired aliases');
  for (const alias of aliases) assert.ok(alias.explanationText, `retired alias line ${alias.line} (${alias.landedText}) records its distinction as explanationText`);
  const router = fs.readFileSync(path.join(root, 'workbench', 'wiki', 'MEMORY.md'), 'utf8');
  const explained = new Map();
  for (const entry of inventory.entries.filter((item) => item.explanationText !== undefined)) {
    // S-004O TK-009J: an AI coding row carries its dictionary link after the
    // term and a boundary entry is a bullet, so the term is read from the
    // glossary entry the line lands as.
    // S-004O TK-009M: a retired name lands as an `_Avoid_:` alias under its
    // preferred term, so its distinction is explained in that term's article.
    const term = entry.aliasOf ?? entry.landedText?.match(/^\*\*(.+?)\*\*:/)?.[1];
    assert.ok(term, `line ${entry.line} lands a glossary term entry`);
    assert.equal(entry.homeKind, 'glossary', `${term} is a glossary entry`);
    const file = path.join(root, entry.explanationHome);
    assert.ok(fs.existsSync(file), `${term} explanation home ${entry.explanationHome} exists`);
    const content = fs.readFileSync(file, 'utf8');
    assert.equal(parseFrontmatter(content).data?.glossary_term, term, `${entry.explanationHome} declares glossary_term ${term}`);
    assert.ok(flat(content).includes(flat(entry.explanationText)), `${entry.explanationHome} carries the ${term} Distinction text`);
    const name = path.relative(path.join(root, 'workbench', 'wiki'), file).split(path.sep).join('/');
    assert.equal(router.split('\n').filter((line) => line.includes(`](${name})`)).length, 1, `MEMORY.md routes ${name} once`);
    explained.set(term, entry.explanationHome);
  }
  for (const group of ['Destination and direction', 'Workflow verbs']) {
    const terms = glossaryGroupTerms(group);
    assert.ok(terms.length > 0, `GLOSSARY.md has the ${group} group`);
    for (const term of terms) assert.ok(explained.has(term), `${term} (${group}) has a lexicon article carrying its Distinction text`);
  }
  assert.equal([...explained.keys()].filter((term) => ['Destination and direction', 'Workflow verbs'].some((group) => glossaryGroupTerms(group).includes(term))).length, 29, 'batch one explains 29 terms');
  const findings = validateWiki(root).filter((item) => item.severity === 'error');
  assert.deepEqual(findings, [], 'the room Wiki, with its lexicon articles, validates');
});

// S-004O TK-009I: batch two is the glossary's Workbench, room and artifacts;
// Specs and Tasks; and Chats and roles groups (40 terms). The case above proves
// each explained entry lands in its routed article; this one proves every term
// in the three groups is explained, that its article links its glossary group,
// and that a retired name the glossary lists as `_Avoid_` under one of these
// terms is named in that term's article.
const BATCH_TWO_GROUPS = ['Workbench, room and artifacts', 'Specs and Tasks', 'Chats and roles'];
const glossaryAnchor = (group) => group.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').replace(/\s/g, '-');

test('TK-009I: every Workbench, room and artifact, Spec and Task, and Chat and role term has a lexicon article carrying its Distinction text', () => {
  const inventory = JSON.parse(fs.readFileSync(path.join(root, ROOT_INVENTORY), 'utf8'));
  const termOf = (entry) => entry.text.match(/^\| \*\*(.+?)\*\* \|/)?.[1];
  const explained = new Map(inventory.entries.filter((item) => item.explanationText !== undefined).map((item) => [termOf(item), item.explanationHome]));
  const terms = BATCH_TWO_GROUPS.flatMap((group) => glossaryGroupTerms(group).map((term) => [group, term]));
  assert.equal(terms.length, 40, 'batch two covers 40 glossary terms');
  const missing = terms.filter(([, term]) => !explained.has(term)).map(([group, term]) => `${term} (${group})`);
  assert.deepEqual(missing, [], 'every batch-two term records its Distinction text in a lexicon article');
  for (const [group, term] of terms) {
    const home = explained.get(term);
    assert.match(home, /^workbench\/wiki\/[^/]+\.md$/, `${term} is explained by a flat root Wiki article`);
    const content = fs.readFileSync(path.join(root, home), 'utf8');
    assert.ok(content.includes(`(../../GLOSSARY.md#${glossaryAnchor(group)})`), `${home} links the ${group} glossary group`);
    assert.match(content, /^## Sources$/m, `${home} names its sources`);
  }
  for (const alias of inventory.entries.filter((item) => item.aliasOf && terms.some(([, term]) => term === item.aliasOf))) {
    const name = alias.landedText.replace(/^_Avoid_:\s*/, '');
    assert.ok(alias.explanationHome, `the ${name} alias names its article`);
    assert.ok(flat(fs.readFileSync(path.join(root, alias.explanationHome), 'utf8')).toLowerCase().includes(name.toLowerCase()), `${alias.explanationHome} names the retired ${name}`);
  }
});

// S-004O TK-009K: every root landing-inventory `wiki` entry lands its text in
// its home page, and that page is routed from MEMORY.md (MEMORY.md itself is
// the router). A home that declares no glossary term is a general reference
// page: it says it stays Wiki-only under the Lexicon retirement decision and
// needs no GLOSSARY.md entry. One that explains a glossary entry declares it.
test('TK-009K: each root Wiki-only inventory entry lands in a page routed from MEMORY.md, and general reference pages say they stay Wiki-only', () => {
  const inventory = JSON.parse(fs.readFileSync(path.join(root, ROOT_INVENTORY), 'utf8'));
  const router = fs.readFileSync(path.join(root, 'workbench', 'wiki', 'MEMORY.md'), 'utf8');
  const glossary = fs.readFileSync(path.join(root, 'GLOSSARY.md'), 'utf8');
  const entries = inventory.entries.filter((item) => item.homeKind === 'wiki');
  assert.ok(entries.length >= 37, 'the root inventory routes its Wiki-only entries');
  const missing = [];
  const homes = new Set();
  for (const entry of entries) {
    assert.match(entry.homePath, /^workbench\/wiki\/[^/]+\.md$/, `line ${entry.line} is homed in a flat root Wiki page`);
    const file = path.join(root, entry.homePath);
    if (!fs.existsSync(file)) { missing.push(`${entry.homePath} (line ${entry.line}) is missing`); continue; }
    if (!flat(fs.readFileSync(file, 'utf8')).includes(flat(entry.landedText))) missing.push(`${entry.homePath} lacks line ${entry.line}: ${entry.landedText}`);
    homes.add(entry.homePath);
  }
  assert.deepEqual(missing, [], 'every root wiki entry lands in its page');
  for (const home of homes) {
    if (home === 'workbench/wiki/MEMORY.md') continue;
    const name = home.slice('workbench/wiki/'.length);
    assert.equal(router.split('\n').filter((line) => line.includes(`](${name})`)).length, 1, `MEMORY.md routes ${name} once`);
    const content = fs.readFileSync(path.join(root, home), 'utf8');
    const term = parseFrontmatter(content).data?.glossary_term;
    if (term) {
      assert.ok(glossary.includes(`**${term}**:`), `${home} declares the glossary entry ${term}`);
    } else {
      assert.match(flat(content), /stays Wiki-only and needs no \[GLOSSARY\.md\]\(\.\.\/\.\.\/GLOSSARY\.md\) entry/, `${home} says it is a Wiki-only general reference page`);
      assert.ok(content.includes('(../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md)'), `${home} links the Lexicon retirement decision`);
    }
  }
  assert.doesNotMatch(router, /\]\(\.\.\/\.\.\/LEXICON\.md\)[^\n]*AI Coding|AI Coding Terms section\]\(/, 'MEMORY.md no longer routes the AI coding terms to the Lexicon');
  assert.deepEqual(validateWiki(root).filter((item) => item.severity === 'error'), [], 'the room Wiki validates with its reference pages');
});

// S-004O TK-009J: batch three of the root lexicon articles covers the
// glossary's Support root and skills lane, Feedback disposition, Workbench
// meanings of AI coding terms, Continuity terms, Stance terms, Governance core,
// Project-specific terms and Continuity and evidence boundaries groups. Each
// term's inventory entry names its article, which is routed from MEMORY.md
// once, links the term's glossary group and declares the term; the five
// disposition codes are explained together in the Feedback disposition article,
// whose fuller text TK-009K landed. Every other term's Lexicon line carried
// text beyond its glossary definition, so its entry records that text as
// `explanationText`, which the TK-009D case above proves lands in the article.
const BATCH_THREE_GROUPS = [
  'Support root and skills lane', 'Feedback disposition', 'Workbench meanings of AI coding terms', 'Continuity terms',
  'Stance terms', 'Governance core', 'Project-specific terms', 'Continuity and evidence boundaries'
];
test('TK-009J: each batch-three glossary term has a routed lexicon article that links its glossary group and declares the term', () => {
  const inventory = JSON.parse(fs.readFileSync(path.join(root, ROOT_INVENTORY), 'utf8'));
  const router = fs.readFileSync(path.join(root, 'workbench', 'wiki', 'MEMORY.md'), 'utf8');
  const glossaryEntries = inventory.entries.filter((entry) => entry.homeKind === 'glossary');
  const entryFor = (term) => glossaryEntries.find((entry) => entry.landedText?.startsWith(`**${term}**:`) || entry.text.startsWith(`- **${term.replace(/`/g, '')}** —`));
  const problems = [];
  let count = 0;
  for (const group of BATCH_THREE_GROUPS) {
    const terms = glossaryGroupTerms(group);
    assert.ok(terms.length > 0, `GLOSSARY.md has the ${group} group`);
    for (const term of terms) {
      count += 1;
      const entry = entryFor(term);
      if (!entry?.explanationHome) { problems.push(`${term} (${group}): no inventory explanationHome`); continue; }
      const file = path.join(root, entry.explanationHome);
      if (!fs.existsSync(file)) { problems.push(`${term} (${group}): ${entry.explanationHome} is missing`); continue; }
      const content = fs.readFileSync(file, 'utf8');
      const declared = parseFrontmatter(content).data?.glossary_term;
      const code = group === 'Feedback disposition' && term !== 'Feedback disposition';
      if (code) {
        if (declared !== 'Feedback disposition' || !content.includes(`**${term}**`)) problems.push(`${term}: not explained in the Feedback disposition article`);
      } else {
        if (declared !== term) problems.push(`${term}: ${entry.explanationHome} declares glossary_term ${declared}`);
        if (term !== 'Feedback disposition' && entry.explanationText === undefined) problems.push(`${term}: the inventory records no explanationText`);
      }
      if (!content.includes(`(../../GLOSSARY.md#${glossaryAnchor(group)})`)) problems.push(`${term}: ${entry.explanationHome} does not link its ${group} glossary group`);
      const name = path.relative(path.join(root, 'workbench', 'wiki'), file).split(path.sep).join('/');
      if (router.split('\n').filter((line) => line.includes(`](${name})`)).length !== 1) problems.push(`${term}: MEMORY.md does not route ${name} once`);
    }
  }
  assert.deepEqual(problems, [], 'every batch-three term has its routed lexicon article');
  assert.equal(count, 49, 'batch three explains 49 terms');
  assert.deepEqual(validateWiki(root).filter((item) => item.severity === 'error'), [], 'the room Wiki validates with the batch-three articles');
});

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
    for (const control of ['AGENTS.md', 'BLUEPRINT.md', 'LEXICON.md', 'RUNBOOK.md', 'TASKBOARD.md', 'README.md']) {
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

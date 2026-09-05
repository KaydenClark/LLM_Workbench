#!/usr/bin/env node
// S-034: the control fidelity report classifies every template line of a
// room's controls as filled, unchanged, dropped, or changed, every extra room
// line as added, labels a checkout-versus-manifest version mismatch, and never
// changes the exit code or the room on divergence.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { templatePlaceholders } from '../workbench/tools/template-placeholders.mjs';
import { reportFidelity, summarizeMarkdown } from './control-fidelity.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tool = path.join(root, 'tools', 'control-fidelity.mjs');
const productTemplates = path.join(root, 'templates');
const VERSION = JSON.parse(fs.readFileSync(path.join(root, 'workbench', 'manifest.json'), 'utf8')).workbenchVersion;
const controls = ['AGENTS.md', 'BLUEPRINT.md', 'LEXICON.md', 'RUNBOOK.md', 'TASKBOARD.md', 'README.md'];
// The upstream finding (fix list UP-008): a room dropped this qualifier from
// its ADR ownership row. templates/AGENTS.md carries no ADR ownership row at
// this release, so the fixture template adds the root control's row to the
// template ownership table before the room is filled from it.
const adrRow = '| decision rationale, alternatives, supersession | `workbench/docs/adr/` (rule binds only where `canonicalized_in` points) |';
const adrRowWithoutQualifier = '| decision rationale, alternatives, supersession | `workbench/docs/adr/` |';

function fixture(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function write(base, relative, content) {
  const target = path.join(base, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function read(base, relative) {
  return fs.readFileSync(path.join(base, relative), 'utf8');
}

function fill(content) {
  let filled = content;
  for (const placeholder of templatePlaceholders) filled = filled.replaceAll(placeholder, `filled ${placeholder.slice(1, -1).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()}`);
  return filled.replace(/\[[A-Z][A-Z0-9_ /:.-]*\]/g, 'filled value');
}

function manifest(version, profile = 'project') {
  return `${JSON.stringify({ schemaVersion: 2, workbenchVersion: version, provenance: { lifecycle: 'adoption', source: { release: version } }, lanes: { wiki: 'workbench/wiki' }, wiki: { profile } }, null, 2)}\n`;
}

// A disposable templates root: the product templates plus the ADR ownership
// row in AGENTS.md's ownership table.
function fixtureTemplates() {
  const templates = fixture('control-fidelity-templates-');
  fs.cpSync(productTemplates, templates, { recursive: true });
  const agents = read(templates, 'AGENTS.md');
  const anchor = '| commands and troubleshooting | `RUNBOOK.md` |';
  assert.ok(agents.includes(anchor), 'templates/AGENTS.md must still carry the ownership table row this fixture anchors on');
  write(templates, 'AGENTS.md', agents.replace(anchor, `${anchor}\n${adrRow}`));
  return templates;
}

// A room whose controls are the fixture templates with every placeholder filled.
function fixtureRoom(templates, version = VERSION) {
  const project = fixture('control-fidelity-room-');
  for (const control of controls) write(project, control, fill(read(templates, control)));
  write(project, 'CLAUDE.md', '@AGENTS.md\n');
  write(project, 'workbench/manifest.json', manifest(version));
  return project;
}

function control(report, name) {
  const entry = report.controls.find((item) => item.control === name);
  assert.ok(entry, `${name} must be reported`);
  return entry;
}

function kinds(entry, kind) {
  return entry.lines.filter((line) => line.kind === kind);
}

function snapshot(directory) {
  const entries = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true, recursive: true })) {
    const target = path.join(entry.parentPath ?? entry.path, entry.name);
    if (!entry.isFile()) continue;
    entries.push(`${path.relative(directory, target)}:${crypto.createHash('sha256').update(fs.readFileSync(target)).digest('hex')}`);
  }
  return entries.sort().join('\n');
}

test('a filled room reports filled and unchanged lines only, with every placeholder line filled', () => {
  const templates = fixtureTemplates();
  const project = fixtureRoom(templates);
  const report = reportFidelity({ project, templates, manifestRelease: VERSION, checkoutVersion: VERSION });
  assert.equal(report.status, 'reported');
  for (const name of controls) {
    const entry = control(report, name);
    assert.equal(entry.status, 'compared', `${name} must be compared`);
    assert.equal(entry.counts.dropped, 0, `${name} must drop nothing when only placeholders were filled`);
    assert.equal(entry.counts.changed, 0, `${name} must change nothing when only placeholders were filled`);
    assert.equal(entry.counts.added, 0, `${name} must add nothing when only placeholders were filled`);
    assert.ok(entry.counts.filled > 0, `${name} must report filled placeholder lines`);
    const templateLines = read(templates, name).replace(/\n$/, '').split('\n').length;
    assert.equal(entry.counts.filled + entry.counts.unchanged, templateLines, `${name}: every template line is classified exactly once`);
    for (const line of entry.lines) {
      if (line.kind === 'filled') assert.ok(line.placeholder, `${name} L${line.templateLine}: filled lines carry a placeholder`);
      if (line.kind === 'unchanged') assert.equal(line.template, line.room);
    }
  }
  assert.equal(control(report, 'CLAUDE.md').status, 'exact');
  assert.equal(report.versionMatch, true);
});

test('a dropped qualifier is one changed entry naming the ADR ownership row and no dropped entry', () => {
  const templates = fixtureTemplates();
  const project = fixtureRoom(templates);
  const agents = read(project, 'AGENTS.md');
  assert.ok(agents.includes(adrRow), 'the filled room must carry the ADR ownership row before it is altered');
  write(project, 'AGENTS.md', agents.replace(adrRow, adrRowWithoutQualifier));
  const entry = control(reportFidelity({ project, templates, manifestRelease: VERSION, checkoutVersion: VERSION }), 'AGENTS.md');
  assert.equal(entry.counts.dropped, 0);
  assert.equal(entry.counts.added, 0);
  assert.equal(entry.counts.changed, 1);
  const [changed] = kinds(entry, 'changed');
  assert.equal(changed.template, adrRow);
  assert.equal(changed.room, adrRowWithoutQualifier);
  assert.ok(changed.template.includes('canonicalized_in'), 'the changed entry names the line that lost the qualifier');
  assert.ok(Number.isInteger(changed.templateLine) && Number.isInteger(changed.roomLine));
  const summary = summarizeMarkdown(reportFidelity({ project, templates, manifestRelease: VERSION, checkoutVersion: VERSION }));
  assert.match(summary, /## AGENTS\.md/);
  assert.match(summary, /changed 1/);
  assert.match(summary, /canonicalized_in/);
});

test('a deleted Branch Completion paragraph produces dropped entries for each of its lines', () => {
  const templates = fixtureTemplates();
  const project = fixtureRoom(templates);
  const agents = read(project, 'AGENTS.md');
  const start = agents.indexOf('### Branch Completion');
  const end = agents.indexOf('\n## ', start);
  assert.ok(start > 0 && end > start, 'the filled AGENTS.md must carry a Branch Completion section followed by another section');
  const removed = agents.slice(start, end + 1);
  const removedLines = removed.split('\n').filter((line) => /[A-Za-z0-9]/.test(line));
  assert.ok(removedLines.length >= 4, 'the removed section holds several content lines');
  write(project, 'AGENTS.md', agents.slice(0, start) + agents.slice(end + 1));
  const entry = control(reportFidelity({ project, templates, manifestRelease: VERSION, checkoutVersion: VERSION }), 'AGENTS.md');
  assert.equal(entry.counts.changed, 0);
  assert.equal(entry.counts.added, 0);
  const dropped = kinds(entry, 'dropped').filter((line) => !line.trivial).map((line) => line.template);
  assert.deepEqual(dropped, removedLines.map((line) => line.trim()));
});

test('room lines with no template origin are added, and a missing control is reported rather than thrown', () => {
  const templates = fixtureTemplates();
  const project = fixtureRoom(templates);
  write(project, 'RUNBOOK.md', `${read(project, 'RUNBOOK.md')}\n## Project Rituals\n\nRun the nightly export before release.\n`);
  fs.unlinkSync(path.join(project, 'TASKBOARD.md'));
  const report = reportFidelity({ project, templates, manifestRelease: VERSION, checkoutVersion: VERSION });
  const runbook = control(report, 'RUNBOOK.md');
  assert.deepEqual(kinds(runbook, 'added').filter((line) => !line.trivial).map((line) => line.room), ['## Project Rituals', 'Run the nightly export before release.']);
  assert.equal(runbook.counts.dropped, 0);
  assert.equal(control(report, 'TASKBOARD.md').status, 'missing');
});

test('CLAUDE.md is checked for exact equality with @AGENTS.md', () => {
  const templates = fixtureTemplates();
  const project = fixtureRoom(templates);
  write(project, 'CLAUDE.md', '@AGENTS.md\n\nAlways run the linter.\n');
  const entry = control(reportFidelity({ project, templates, manifestRelease: VERSION, checkoutVersion: VERSION }), 'CLAUDE.md');
  assert.equal(entry.status, 'mismatch');
  assert.deepEqual(kinds(entry, 'added').filter((line) => !line.trivial).map((line) => line.room), ['Always run the linter.']);
  assert.equal(entry.counts.unchanged, 1);
});

test('optional permission and wiki files are compared when present and reported absent otherwise', () => {
  const templates = fixtureTemplates();
  const project = fixtureRoom(templates);
  let report = reportFidelity({ project, templates, manifestRelease: VERSION, checkoutVersion: VERSION });
  for (const name of ['.claude/settings.json', 'workbench/wiki/SCHEMA.md', 'workbench/wiki/AGENTS.md', 'workbench/wiki/design-concepts/README.md', 'workbench/wiki/MEMORY.md']) {
    const entry = control(report, name);
    assert.equal(entry.status, 'absent', `${name} is optional`);
    assert.equal(entry.optional, true);
  }
  const settings = JSON.parse(fill(read(templates, '.claude/settings.json')));
  settings.permissions.deny = settings.permissions.deny.filter((rule) => rule !== 'Read(./secrets/**)');
  write(project, '.claude/settings.json', `${JSON.stringify(settings, null, 2)}\n`);
  write(project, 'workbench/wiki/SCHEMA.md', fill(read(templates, 'wiki/SCHEMA.md')));
  write(project, 'workbench/wiki/MEMORY.md', fill(read(templates, 'wiki/MEMORY.project.md')));
  report = reportFidelity({ project, templates, manifestRelease: VERSION, checkoutVersion: VERSION });
  const permissions = control(report, '.claude/settings.json');
  assert.equal(permissions.status, 'compared');
  assert.deepEqual(kinds(permissions, 'dropped').map((line) => line.template.trim()), ['"Read(./secrets/**)",']);
  assert.equal(control(report, 'workbench/wiki/SCHEMA.md').counts.dropped, 0);
  const memory = control(report, 'workbench/wiki/MEMORY.md');
  assert.equal(memory.template, 'wiki/MEMORY.project.md');
  assert.equal(memory.counts.dropped, 0);
  assert.equal(memory.counts.changed, 0);
});

test('CRLF room controls compare line by line', () => {
  const templates = fixtureTemplates();
  const project = fixtureRoom(templates);
  write(project, 'LEXICON.md', read(project, 'LEXICON.md').replaceAll('\n', '\r\n'));
  const entry = control(reportFidelity({ project, templates, manifestRelease: VERSION, checkoutVersion: VERSION }), 'LEXICON.md');
  assert.equal(entry.counts.dropped, 0);
  assert.equal(entry.counts.changed, 0);
  assert.equal(entry.counts.added, 0);
});

test('a checkout-versus-manifest mismatch is labeled as a newer or older template generation', () => {
  const templates = fixtureTemplates();
  const project = fixtureRoom(templates, 'v3.1.0');
  const newer = reportFidelity({ project, templates, manifestRelease: 'v3.1.0', checkoutVersion: 'v3.1.1' });
  assert.equal(newer.checkoutVersion, 'v3.1.1');
  assert.equal(newer.manifestRelease, 'v3.1.0');
  assert.equal(newer.versionMatch, false);
  assert.match(newer.versionNote, /newer/);
  assert.match(summarizeMarkdown(newer), /v3\.1\.1/);
  assert.match(summarizeMarkdown(newer), /newer/);
  const older = reportFidelity({ project, templates, manifestRelease: 'v3.2.0', checkoutVersion: 'v3.1.1' });
  assert.equal(older.versionMatch, false);
  assert.match(older.versionNote, /older/);
  const same = reportFidelity({ project, templates, manifestRelease: 'v3.1.0', checkoutVersion: 'v3.1.0' });
  assert.equal(same.versionMatch, true);
  assert.match(same.versionNote, /same/);
  const defaults = reportFidelity({ project, templates });
  assert.equal(defaults.manifestRelease, 'v3.1.0', 'the manifest release defaults to the room manifest');
  assert.equal(defaults.checkoutVersion, VERSION, 'the checkout version defaults to this release');
});

test('the CLI reports divergence with exit 0, filters by control, never writes to the room, and fails only on invocation errors', () => {
  const templates = fixtureTemplates();
  const project = fixtureRoom(templates, 'v3.1.0');
  write(project, 'AGENTS.md', read(project, 'AGENTS.md').replace(adrRow, adrRowWithoutQualifier));
  const before = snapshot(project);
  const result = spawnSync(process.execPath, [tool, 'report', '--project', project, '--templates', templates], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.status, 'reported');
  assert.equal(report.versionMatch, false);
  assert.equal(control(report, 'AGENTS.md').counts.changed, 1);
  assert.ok(report.controls.length > 7);
  assert.match(report.markdown, /## AGENTS\.md/);
  assert.equal(snapshot(project), before, 'the report never writes to the room');
  assert.equal(fs.readdirSync(project).some((name) => name.startsWith('.write-')), false);

  const filtered = spawnSync(process.execPath, [tool, 'report', '--project', project, '--templates', templates, '--control', 'AGENTS.md'], { cwd: root, encoding: 'utf8' });
  assert.equal(filtered.status, 0, filtered.stdout + filtered.stderr);
  assert.deepEqual(JSON.parse(filtered.stdout).controls.map((entry) => entry.control), ['AGENTS.md']);

  const markdown = spawnSync(process.execPath, [tool, 'report', '--project', project, '--templates', templates, '--format', 'markdown'], { cwd: root, encoding: 'utf8' });
  assert.equal(markdown.status, 0);
  assert.match(markdown.stdout, /^# Control fidelity report/m);
  assert.match(markdown.stdout, /canonicalized_in/);

  const unknownControl = spawnSync(process.execPath, [tool, 'report', '--project', project, '--templates', templates, '--control', 'NOPE.md'], { cwd: root, encoding: 'utf8' });
  assert.equal(unknownControl.status, 1);
  assert.equal(JSON.parse(unknownControl.stdout).status, 'invalid');

  const missingProject = spawnSync(process.execPath, [tool, 'report'], { cwd: root, encoding: 'utf8' });
  assert.equal(missingProject.status, 1);
  assert.equal(JSON.parse(missingProject.stdout).error.code, 'invalid-invocation');

  const noSuchProject = spawnSync(process.execPath, [tool, 'report', '--project', path.join(project, 'nowhere')], { cwd: root, encoding: 'utf8' });
  assert.equal(noSuchProject.status, 1);
  assert.equal(JSON.parse(noSuchProject.stdout).error.code, 'invalid-project');
});

test('the product checkout reports against its own templates without throwing', () => {
  const report = reportFidelity({ project: root });
  assert.equal(report.status, 'reported');
  assert.equal(report.templates, productTemplates);
  // This dogfood room keeps Claude-specific notes around `@AGENTS.md`, so it
  // is reported truthfully rather than assumed exact.
  assert.ok(['exact', 'mismatch'].includes(control(report, 'CLAUDE.md').status));
  assert.equal(control(report, 'AGENTS.md').status, 'compared');
  assert.equal(report.versionMatch, true, 'the checkout and its own manifest agree');
});

#!/usr/bin/env node
// The Runbook operations index and the entry route that reads it (Spec S-004C,
// Task TK-005D). Root and template `RUNBOOK.md` open with an operations index:
// one row per operation with three cells (operation, follow when, pointer), and
// every pointer resolves to an existing file or heading. Every Runbook heading
// is reachable from the index, either pointed to by a row or carrying a pointer
// a row also carries (a moved section keeps its heading as a sentence plus
// pointer). Root and template `AGENTS.md` name the index in the entry route, so
// every session reads it at entry, and `CLAUDE.md` adds no Runbook import.
// Every inbound `AGENTS.md#` or `RUNBOOK.md#` anchor in a tracked file, and
// every anchor the baseline census recorded, still resolves.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const INDEX_HEADING = 'Operations Index';
const INDEX_ANCHOR = 'operations-index';
const INDEX_COLUMNS = ['Operation', 'Follow when', 'Pointer'];
const carriers = [
  { label: 'root', runbook: 'RUNBOOK.md', agents: 'AGENTS.md' },
  { label: 'template', runbook: 'templates/RUNBOOK.md', agents: 'templates/AGENTS.md' }
];

const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const normalize = (text) => String(text).replace(/\s+/g, ' ').trim();

// GitHub-style heading slug, the rule tools/test-adr.mjs uses for Lexicon and
// decision-record fragments; repeated headings take -1, -2 suffixes.
function slug(heading) {
  return heading.toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s/g, '-');
}

// Headings outside fenced code, each with its level, slug, line span and own
// body (the text up to the next heading of any level).
function headings(text) {
  const lines = text.split('\n');
  const found = [];
  const seen = new Map();
  let fence = false;
  lines.forEach((line, index) => {
    if (/^\s*(```|~~~)/.test(line)) fence = !fence;
    if (fence) return;
    const match = line.match(/^(#{1,6}) (.+?)\s*#*\s*$/);
    if (!match) return;
    const base = slug(match[2]);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    found.push({ level: match[1].length, title: match[2], slug: count ? `${base}-${count}` : base, line: index });
  });
  return found.map((heading, position) => {
    const end = position + 1 < found.length ? found[position + 1].line : lines.length;
    return { ...heading, body: lines.slice(heading.line + 1, end).join('\n') };
  });
}

function links(text) {
  return [...text.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)].map((match) => match[1]);
}

// A pointer resolves when its file exists and, with a fragment, the file has a
// heading of that slug. Paths resolve from the carrier's folder. A template
// pointer into the skills lane resolves against this repository's lane, which
// is what a generated room's lane is laid down from.
function resolvePointer(carrierPath, target) {
  const [relative, fragment] = target.split('#');
  const carrierDir = path.dirname(carrierPath);
  let file = relative ? path.normalize(path.join(carrierDir, relative)) : carrierPath;
  if (relative && !fs.existsSync(path.join(root, file)) && carrierDir === 'templates' && relative.startsWith('workbench/skills/')) {
    file = path.normalize(relative);
  }
  if (!fs.existsSync(path.join(root, file))) return { ok: false, file, reason: 'file missing' };
  if (fragment === undefined || fragment === '') return { ok: true, file, key: file };
  if (!file.endsWith('.md')) return { ok: false, file, reason: 'fragment into a non-Markdown file' };
  const ok = headings(read(file)).some((heading) => heading.slug === fragment);
  return { ok, file, key: `${file}#${fragment}`, reason: ok ? null : `no heading #${fragment}` };
}

function indexOf(runbookPath) {
  const text = read(runbookPath);
  const all = headings(text);
  const index = all.find((heading) => heading.level === 2 && heading.title === INDEX_HEADING);
  if (!index) return { all, index: null, rows: [], header: null };
  const tableLines = index.body.split('\n').filter((line) => /^\s*\|/.test(line));
  const cells = (line) => line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim());
  const header = tableLines.length ? cells(tableLines[0]) : null;
  const rows = tableLines.slice(2).map((line) => ({ line, cells: cells(line) }));
  return { all, index, rows, header };
}

for (const carrier of carriers) {
  test(`${carrier.label} Runbook opens with the operations index`, () => {
    const { all, index, header, rows } = indexOf(carrier.runbook);
    assert.ok(index, `${carrier.runbook} has a "## ${INDEX_HEADING}" section`);
    const firstSection = all.find((heading) => heading.level === 2);
    assert.equal(firstSection.title, INDEX_HEADING, `${carrier.runbook}: the index is the first section, read before any procedure`);
    assert.deepEqual(header, INDEX_COLUMNS, `${carrier.runbook}: the index columns are ${INDEX_COLUMNS.join(', ')}`);
    assert.ok(rows.length > 0, `${carrier.runbook}: the index has rows`);
  });

  test(`${carrier.label} Runbook index rows carry an operation, a follow-when description and a resolving pointer`, () => {
    const { rows } = indexOf(carrier.runbook);
    assert.ok(rows.length > 0, `${carrier.runbook}: the index has rows`);
    const operations = new Set();
    for (const { line, cells } of rows) {
      assert.equal(cells.length, 3, `${carrier.runbook}: row has three cells: ${line}`);
      const [operation, followWhen, pointer] = cells;
      assert.ok(operation, `${carrier.runbook}: row names its operation: ${line}`);
      assert.ok(followWhen.length >= 12, `${carrier.runbook}: row says when to follow it: ${line}`);
      assert.ok(!operations.has(operation), `${carrier.runbook}: operation "${operation}" has one row`);
      operations.add(operation);
      const targets = links(pointer);
      assert.ok(targets.length > 0, `${carrier.runbook}: row "${operation}" has a pointer link`);
      for (const target of targets) {
        const resolved = resolvePointer(carrier.runbook, target);
        assert.ok(resolved.ok, `${carrier.runbook}: row "${operation}" pointer ${target} resolves (${resolved.reason})`);
      }
    }
    if (carrier.label === 'template') {
      for (const { cells } of rows) {
        assert.doesNotMatch(cells.join(' '), /\b(S|TK)-[0-9A-Z]{3,4}\b|PR #\d+|LLM Workbench|KaydenClark|Workbench_Template/, `template index row stays generic: ${cells[0]}`);
      }
    }
  });

  test(`${carrier.label} Runbook index reaches every Runbook section`, () => {
    const { all, rows } = indexOf(carrier.runbook);
    assert.ok(rows.length > 0, `${carrier.runbook}: the index has rows`);
    const rowKeys = new Set(rows.flatMap(({ cells }) => links(cells[2] ?? ''))
      .map((target) => resolvePointer(carrier.runbook, target)).filter((resolved) => resolved.ok).map((resolved) => resolved.key));
    const unreached = all
      .filter((heading) => heading.level >= 2 && heading.level <= 4 && heading.title !== INDEX_HEADING)
      .filter((heading) => {
        if (rowKeys.has(`${carrier.runbook}#${heading.slug}`)) return false;
        const stubKeys = links(heading.body).map((target) => resolvePointer(carrier.runbook, target)).filter((resolved) => resolved.ok).map((resolved) => resolved.key);
        return !stubKeys.some((key) => rowKeys.has(key));
      })
      .map((heading) => `${'#'.repeat(heading.level)} ${heading.title}`);
    assert.deepEqual(unreached, [], `${carrier.runbook}: every section is an index row's pointer or carries a pointer a row carries`);
  });

  test(`${carrier.label} AGENTS entry route reads the Runbook index at every session entry`, () => {
    const text = read(carrier.agents);
    const all = headings(text);
    const preamble = normalize(text.split('\n').slice(0, all.find((heading) => heading.level === 2).line).join('\n'));
    assert.match(preamble, /`AGENTS\.md` -> the \[`RUNBOOK\.md` operations index\]\(RUNBOOK\.md#operations-index\) -> `LEXICON\.md`\./, `${carrier.agents}: the opening names the entry route through the index`);
    assert.match(preamble, /Every session reads that index at entry/, `${carrier.agents}: the opening requires the index read at entry`);
    const traverse = all.find((heading) => heading.title === "Traverse, Don't Search");
    assert.ok(traverse, `${carrier.agents}: Traverse, Don't Search survives`);
    assert.match(normalize(traverse.body), /operations index/, `${carrier.agents}: Traverse, Don't Search routes operations through the index`);
    assert.ok(resolvePointer(carrier.agents, `RUNBOOK.md#${INDEX_ANCHOR}`).ok, `${carrier.agents}: the index link resolves`);
  });
}

test('CLAUDE.md stays the AGENTS.md import with no Runbook adapter import', () => {
  const text = read('CLAUDE.md');
  assert.match(text, /^@AGENTS\.md$/m);
  assert.doesNotMatch(text, /^@RUNBOOK\.md/m, 'the Runbook adapter import is a recorded option, not delivered');
});

// The baseline census (S-004C census.md section 6) recorded these inbound
// anchors at d7ffffe9; each must keep resolving in root, and those also linked
// from templates/ in the template mirror.
const CENSUS_ANCHORS = [
  'AGENTS.md#git-rules', 'RUNBOOK.md#behavior-selection', 'RUNBOOK.md#role-and-stance-coordination',
  'AGENTS.md#handoff-assignments-and-shared-context', 'RUNBOOK.md#handoff-transfer', 'RUNBOOK.md#spec-lifecycle-and-retrieval',
  'AGENTS.md#assigned-work-and-stances', 'AGENTS.md#assembled-review-and-corrective-return', 'AGENTS.md#authority-order',
  'RUNBOOK.md#template-upgrade-release-gate', 'AGENTS.md#owner-closure-and-reconciliation', 'AGENTS.md#safety-and-change-control',
  'AGENTS.md#traverse-dont-search', 'RUNBOOK.md#direct-owner-promotion', 'AGENTS.md#branch-completion',
  'AGENTS.md#documentation-ownership-and-proof', 'AGENTS.md#engineering-and-verification', 'AGENTS.md#session-records-and-checkpoints',
  'AGENTS.md#state-resolution', 'RUNBOOK.md#control-fidelity-report', 'RUNBOOK.md#frozen-checkpoint-history-and-operational-recovery',
  'RUNBOOK.md#independent-review-boundaries', 'RUNBOOK.md#json-notepads', 'RUNBOOK.md#landmark-tracker-accepted-design-and-available-operations',
  'RUNBOOK.md#ordinary-entry', 'RUNBOOK.md#portable-save-promote-and-room-local-skills', 'RUNBOOK.md#prepare-project-evidence-and-blueprint-questions',
  'RUNBOOK.md#room-lifecycle-classification-check', 'RUNBOOK.md#skills-lane-check', 'RUNBOOK.md#v3-adoption-migration-check',
  'RUNBOOK.md#v3-support-root-check'
];
const CENSUS_TEMPLATE_ANCHORS = [
  'AGENTS.md#handoff-assignments-and-shared-context', 'RUNBOOK.md#handoff-transfer', 'RUNBOOK.md#spec-lifecycle-and-retrieval',
  'AGENTS.md#assembled-review-and-corrective-return', 'AGENTS.md#authority-order'
];

test('every inbound carrier anchor the baseline census recorded still resolves', () => {
  const broken = [
    ...CENSUS_ANCHORS.filter((anchor) => !resolvePointer('README.md', anchor).ok),
    ...CENSUS_TEMPLATE_ANCHORS.filter((anchor) => !resolvePointer('templates/README.md', anchor).ok).map((anchor) => `templates/${anchor}`)
  ];
  assert.deepEqual(broken, []);
});

test('every AGENTS.md# and RUNBOOK.md# link in a tracked file resolves', () => {
  const listed = spawnSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' });
  assert.equal(listed.status, 0, listed.stderr);
  const files = listed.stdout.split('\0').filter((file) => /\.(md|json)$/.test(file) && fs.existsSync(path.join(root, file)));
  const broken = [];
  let checked = 0;
  for (const file of files) {
    const text = read(file);
    for (const match of text.matchAll(/([A-Za-z0-9_./-]*)\b(AGENTS|RUNBOOK)\.md#([A-Za-z0-9_-]+)/g)) {
      const [, prefix, carrierName, fragment] = match;
      const fromDir = path.dirname(file);
      let carrierPath = prefix ? path.normalize(path.join(fromDir, `${prefix}${carrierName}.md`)) : null;
      const known = new Set(['AGENTS.md', 'RUNBOOK.md', 'templates/AGENTS.md', 'templates/RUNBOOK.md']);
      if (!carrierPath || !known.has(carrierPath)) {
        carrierPath = file.startsWith('templates/') ? `templates/${carrierName}.md` : `${carrierName}.md`;
      }
      checked += 1;
      if (!resolvePointer(carrierPath, `#${fragment}`).ok) broken.push(`${file}: ${carrierPath}#${fragment}`);
    }
  }
  assert.ok(checked > 100, `the scan found the inbound anchors (${checked})`);
  assert.deepEqual(broken, []);
});

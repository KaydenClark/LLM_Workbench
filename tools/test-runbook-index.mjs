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

// S-004C TK-005E (ADR-000W): an index row that points to a lane skill makes it
// part of the Contract for its operation, so both Runbooks say that a change to
// a pointed skill or to an index row is reviewed as a Contract change, and this
// repository's own index resolves with no dangling skill pointer.
test('the index says a pointed skill or index row change is reviewed as a Contract change', async () => {
  for (const { label, runbook } of carriers) {
    const index = headings(read(runbook)).find((heading) => heading.title === INDEX_HEADING);
    assert.ok(index, `${label}: the index heading exists`);
    assert.match(normalize(index.body), /a change to a skill an index row points to, or to an index row, is reviewed as a Contract change/i, `${label}: the index names the review care for a binding change`);
  }
  const { resolveSkillPointers } = await import('../workbench/tools/skill-inspection.mjs');
  const manifest = JSON.parse(read('workbench/manifest.json'));
  const resolved = resolveSkillPointers(manifest, root);
  assert.equal(resolved.index, 'RUNBOOK.md#operations-index');
  assert.deepEqual(resolved.dangling, [], 'no root index row points to a skill the lane lacks');
});

// S-004C operation families. Each family Task moves its operations'
// procedures into lane skills: the index row points to the skill section that
// now carries the procedure, that section holds the moved text, the Runbook
// section keeps its heading (inbound anchors keep resolving) and either shrinks
// to a sentence plus the same pointer or keeps only the lines with no home yet,
// and the brief in `AGENTS.md` keeps only the family's always-true lines. A
// later family adds its own entry here.
const FAMILIES = [
  {
    task: 'TK-005F continuity and promotion',
    rows: [
      {
        operation: 'Keep a JSON notepad', pointer: 'workbench/skills/notepad/SKILL.md#runtime-reference',
        section: 'JSON Notepads', stub: true,
        carries: ['Choose the artifact type prefix explicitly', 'Kinds are `directive`', 'per-revision publish token', '`trim` removes named reconciled entries and refuses with `retained-dependency`']
      },
      {
        operation: 'Transfer work through a handoff', pointer: 'workbench/skills/handoff/SKILL.md#transfer-procedure',
        section: 'Handoff Transfer', stub: true,
        carries: ['For a deep dive on one question in the middle of a grilling', 'For a legacy JSON retaining destination, reconcile it before releasing retention']
      },
      {
        operation: 'Transport sessions privately', pointer: 'workbench/skills/save/SKILL.md#optional-private-session-transport',
        section: 'Optional Private Session Transport', stub: true,
        carries: ['node workbench/tools/session-transport.mjs configure --checkout PRIVATE_CHECKOUT', 'For a same-note conflict, keep one active writer and reconcile deliberately']
      },
      {
        operation: 'Save, promote or add a room-local skill', pointer: 'workbench/skills/save/SKILL.md#how-save-and-promote-compose',
        section: 'Portable Save, Promote And Room-Local Skills', stub: false,
        carries: ['A promotion that was already performed must not be recursively promoted by save']
      },
      {
        operation: 'Promote claims to an owner', pointer: 'workbench/skills/promote/SKILL.md#command-reference',
        section: 'Direct Owner Promotion', stub: true,
        carries: ['`--expected` is the SHA-256 of the destination bytes just read', 'Spec checks reuse lifecycle diagnostics and preserve existing append-only rows']
      },
      {
        operation: { root: 'Read frozen checkpoints or recovery receipts', template: 'Read frozen history or recovery receipts' },
        pointer: 'workbench/skills/checkpoint/SKILL.md#frozen-history-and-operational-recovery',
        section: { root: 'Frozen Checkpoint History And Operational Recovery', template: 'Frozen History And Operational Recovery' }, stub: true,
        carries: ['For a restoration rehearsal, preserve the changed target', 'node workbench/tools/sessions.mjs scan --file PATH']
      },
      {
        operation: 'Size and continue work', pointer: 'workbench/skills/notepad/SKILL.md#continuing-after-a-save-or-handoff',
        section: 'Evidence And Continuation Practices', stub: false,
        carries: ['Saving context or authoring a requested handoff does not terminate a session']
      },
      {
        operation: 'Size and continue work', pointer: 'workbench/skills/save/SKILL.md#evidence-partitioning',
        section: 'Evidence And Continuation Practices', stub: false,
        carries: ['When an assigned evidence record needs partitioning, first pin the source commit']
      }
    ],
    agents: {
      section: 'Session Records And Checkpoints',
      keeps: [
        /authorizes nothing/, /verify relevant live state/, /secrets/, /never cite an ignored live path as durable evidence/i,
        /Promote only supported claims/, /RUNBOOK\.md#operations-index/
      ],
      moved: [/notepads\.mjs/, /notepad-templates/, /Landmark Tracker/, /sessions\/recovery/, /flush or delete/]
    }
  }
];

const pick = (value, label) => (typeof value === 'string' ? value : value[label]);

for (const family of FAMILIES) {
  for (const carrier of carriers) {
    test(`${carrier.label} ${family.task}: index rows point to the lane skills that carry the moved procedures`, () => {
      const { rows, all } = indexOf(carrier.runbook);
      for (const row of family.rows) {
        const operation = pick(row.operation, carrier.label);
        const found = rows.find(({ cells }) => cells[0] === operation);
        assert.ok(found, `${carrier.runbook}: the index has a "${operation}" row`);
        assert.ok(links(found.cells[2]).includes(row.pointer), `${carrier.runbook}: row "${operation}" points to ${row.pointer}`);
        const resolved = resolvePointer(carrier.runbook, row.pointer);
        assert.ok(resolved.ok, `${carrier.runbook}: ${row.pointer} resolves (${resolved.reason})`);
        const [skillFile, fragment] = row.pointer.split('#');
        const skillSection = headings(read(skillFile)).find((heading) => heading.slug === fragment);
        const carried = normalize(skillSection.body);
        for (const phrase of row.carries) {
          assert.ok(carried.includes(normalize(phrase)), `${skillFile}#${fragment} carries the moved procedure line: ${phrase}`);
        }
        const title = pick(row.section, carrier.label);
        const section = all.find((heading) => heading.title === title);
        assert.ok(section, `${carrier.runbook}: the "${title}" heading survives`);
        assert.ok(links(section.body).includes(row.pointer), `${carrier.runbook}: "${title}" points to ${row.pointer}`);
        if (row.stub) {
          assert.doesNotMatch(section.body, /```/, `${carrier.runbook}: "${title}" keeps no procedure block`);
          assert.ok(normalize(section.body).length <= 700, `${carrier.runbook}: "${title}" is a sentence plus a pointer (${normalize(section.body).length} chars)`);
        }
      }
    });

    test(`${carrier.label} ${family.task}: AGENTS keeps only the family's always-true lines`, () => {
      const section = headings(read(carrier.agents)).find((heading) => heading.title === family.agents.section);
      assert.ok(section, `${carrier.agents}: "${family.agents.section}" survives`);
      const body = normalize(section.body);
      for (const pattern of family.agents.keeps) assert.match(body, pattern, `${carrier.agents}: the brief keeps ${pattern}`);
      for (const pattern of family.agents.moved) assert.doesNotMatch(body, pattern, `${carrier.agents}: ${pattern} moved behind its pointer`);
    });
  }

  test(`${family.task}: the root index makes each home skill binding for its operations`, async () => {
    const { resolveSkillPointers } = await import('../workbench/tools/skill-inspection.mjs');
    const resolved = resolveSkillPointers(JSON.parse(read('workbench/manifest.json')), root);
    for (const row of family.rows) {
      const skill = row.pointer.split('/')[2];
      const pointed = resolved.pointed.find((entry) => entry.skill === skill);
      assert.ok(pointed, `${skill} is binding through the index`);
      assert.ok(pointed.operations.includes(pick(row.operation, 'root')), `${skill} binds for "${pick(row.operation, 'root')}"`);
    }
  });
}

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
  },
  {
    task: 'TK-005G work selection, review and closure',
    rows: [
      {
        operation: 'Work a Task as Worker', pointer: 'workbench/skills/implement/SKILL.md#worker-selection-implementation-and-hand-back',
        section: 'Worker: selection, implementation and hand-back', stub: true,
        carries: [
          '`next --review --json` is a separate read-only review offering', 'node workbench/tools/spec-workbench.mjs convert-tasks S-001 --activate',
          'node workbench/tools/spec-workbench.mjs claim S-001 --agent', '`close` reads repository state before it writes anything'
        ]
      },
      {
        operation: 'Review an assembled Spec', pointer: 'workbench/skills/dispatcher/SKILL.md#dispatcher-and-separate-director-assembled-review',
        section: 'Dispatcher and separate Director: assembled review', stub: true,
        carries: [
          'An incomplete report is useful evidence, not approval', 'node workbench/tools/spec-workbench.mjs gate --spec S-001 --candidate "[SHA]"',
          'Do not reuse the earlier PASS for changed content'
        ]
      },
      {
        operation: 'Record owner Human QA and complete', pointer: 'workbench/skills/director/SKILL.md#owner-human-qa-and-main-before-complete',
        section: 'Owner: Human QA and main-before-complete', stub: true,
        carries: ['Finding and destination-change examples', 'git fetch origin main', '`complete` requires all Tasks done, checked acceptance']
      },
      {
        operation: 'Capture, retire or recover a completed Spec', pointer: 'workbench/skills/director/SKILL.md#documentation-feature-capture-retirement-and-recovery',
        section: 'Documentation: feature capture, retirement and recovery', stub: { root: false, template: true },
        carries: [
          'There is no capture CLI', 'node workbench/tools/spec-workbench.mjs retire-spec S-001 --wiki',
          'compare all recovered bytes, including sibling proof', 'A later gap against delivered work becomes a new Spec under its landmark'
        ]
      },
      {
        operation: 'Size and continue work', pointer: 'workbench/skills/to-tasks/SKILL.md#sizing-a-task',
        section: 'Evidence And Continuation Practices', stub: false,
        carries: ['Size a task so a fresh context can recover its inputs', 'There is no accepted universal byte or token threshold']
      }
    ],
    agents: [
      {
        section: 'Work Selection And Lifecycle',
        keeps: [
          /workbench\/skills\/implement\/SKILL\.md#work-selection-and-lifecycle/, /RUNBOOK\.md#operations-index/, /Claim before editing/,
          /single writer/, /editing the board cannot change an assignment or satisfy a gate/,
          /`close` refuses a dirty or unpushed tree/, /`owner:<decision>` is never satisfied automatically/
        ],
        moved: [/--remaining-gap/, /`S-###:delivered`/, /closes the first in-progress Task/, /blocked-without-blocker/, /node workbench\/tools/]
      },
      {
        section: 'Assembled Review And Corrective Return',
        keeps: [
          /workbench\/skills\/dispatcher\/SKILL\.md#assembled-review-and-corrective-return/, /Dispatcher owns whole-Spec QA/,
          /separate Director context reviews the immutable assembled candidate/, /cannot supply independent approval/, /self-review never counts/,
          /never silently cleared/, /Never clear a failed verdict with a green test/
        ],
        moved: [/report S-### --candidate SHA/, /--digest DIGEST/, /continue TK-###:/, /new Task:/]
      },
      {
        section: 'Owner Closure And Reconciliation',
        keeps: [
          /workbench\/skills\/director\/SKILL\.md#owner-closure-and-reconciliation/,
          /reviewed delivery on integration -> owner approval -> verification on main -> `complete`/,
          /Only the owner promotes integration to main/, /never silently cleared/, /A merge alone closes neither Task nor Spec/
        ],
        moved: [/approve S-### --candidate SHA --owner NAME/, /retire-spec S-###/, /uncaptured-complete/, /git fetch origin main/]
      }
    ]
  },
  {
    task: 'TK-005H Git, integration review and branch completion',
    rows: [
      {
        operation: 'Branch and open a pull request', pointer: 'workbench/skills/implement/SKILL.md#version-control-procedures',
        section: 'Version-Control Procedures', stub: false,
        carries: [
          'For coordinated Spec delivery, the normal route is a Worker Task-branch merge request into the Dispatcher Spec branch',
          'A release-specific bootstrap exception may name a different route and its gate explicitly',
          'Before creating a branch or PR, verify the live base and preserve dirty work.',
          'PR descriptions state what changed, why, risks, and verification.'
        ]
      },
      {
        operation: 'Merge, prove containment and clean up a branch', pointer: 'workbench/skills/implement/SKILL.md#branch-completion',
        section: 'Version-Control Procedures', stub: false,
        carries: [
          'A task is not finished at the push.', 'Prove containment of the immutable reviewed commit before any deletion',
          'Use `git branch -d` for local deletion and an expected-tip guard for remote deletion.',
          'never force it with `-D` to clear a branch', 'Stacked branches whose commits are already ancestors of the merged tip need no separate merge.',
          'Run merge and containment verification as a fail-fast sequence.', 'Merge never requests branch deletion.',
          'The deletion lease is a compare-and-delete guard, not permission to rewrite history.',
          'For the Spec QA runtime, run the assembled review gate before merging.'
        ]
      },
      {
        operation: 'Review a candidate independently', pointer: 'workbench/skills/code-review/SKILL.md#independent-review-boundaries',
        section: 'Independent Review Boundaries', stub: true,
        carries: [
          'Verify review of an assembled Spec uses a fresh context of the session', 'a prior PASS is not approval of changed content',
          'Whole-Workbench main-readiness review is separately requested, review-only work.', 'Only the owner approves/merges main.',
          "A summary's omission is not proof of non-occurrence.", 'Repeated controlled trials are needed for reliability.'
        ]
      }
    ],
    agents: [
      {
        section: 'Git Rules',
        keeps: [
          /workbench\/skills\/implement\/SKILL\.md#version-control-procedures/, /workbench\/skills\/code-review\/SKILL\.md#independent-review-boundaries/,
          /RUNBOOK\.md#operations-index/, /[Nn]ever commit (directly )?to/, /Default PR target/, /force-push shared history/,
          /Task PR carries the merge answers below and gets no separate-context review|Task carries the merge answers below and gets no separate-context review/,
          /local notes and unmerged branches must not be their only discovery route/, /does not reset a failed Human QA gate/
        ],
        moved: [/normal route is a Worker Task-branch merge/, /A Task merge is containment/]
      },
      {
        section: 'Branch Completion',
        keeps: [
          /workbench\/skills\/implement\/SKILL\.md#branch-completion/, /A task is not finished at the push/, /recoverable, not delivered/,
          /Never force a branch delete with `-D`/, /removed only with owner approval/, /review is still pending/
        ],
        moved: [/git branch -d/, /expected-tip guard/, /already ancestors of/, /tracking upstream alone/]
      }
    ]
  },
  {
    task: 'TK-005I verification, documentation ownership and the release gate',
    rows: [
      {
        operation: 'Verify a behavior change', pointer: 'workbench/skills/implement/SKILL.md#engineering-and-verification',
        section: 'Test And Build', stub: false,
        carries: [
          'Define expected behavior at a stable testing seam.', 'Add or update a failing test and confirm the expected failure.',
          'Refactor only while green.', 'Run the targeted test, then the full verification suite.',
          'If tests are impractical, name the specific reason and run the strongest concrete manual check.',
          'A milestone also needs a demo artifact checkable in under one minute'
        ]
      },
      {
        operation: 'Hold test coverage', pointer: 'workbench/skills/implement/SKILL.md#test-coverage-policy',
        section: 'Test Coverage Policy', stub: { root: false, template: true },
        carries: [
          'Treat tests as the project specification, not as a comfort signal.',
          'Prefer red/green TDD: write or update the failing test first',
          'Remove tests that are stale, duplicated without adding a boundary, or pure bloat.'
        ]
      },
      {
        operation: { root: 'Run the guardrail audit', template: 'Improve against a benchmark' },
        pointer: 'workbench/skills/implement/SKILL.md#benchmark-driven-improvement',
        section: { root: 'Guardrail North-Star Audit', template: 'Benchmark-Driven Improvement' }, stub: { root: false, template: true },
        carries: [
          'capture the available guardrail or benchmark baseline', 'Never weaken a criterion to manufacture progress',
          'do not treat a static coverage score as outcome evidence'
        ]
      },
      {
        operation: 'Route a truth to its owner', pointer: 'workbench/skills/to-docs/SKILL.md#to-docs', section: null,
        carries: ['Route each claim once.', 'Read each changed owner back and confirm each claim appears once']
      },
      {
        operation: 'Cite a file that changes', pointer: 'workbench/skills/to-docs/SKILL.md#citation-anchors', section: null,
        carries: [
          'Either anchor the citation itself with `git show <sha>:path`', 'A label immediately before a citation names its tree and wins',
          'Evidence rows read at the commit each row names and are never re-anchored'
        ]
      }
    ],
    agents: [
      {
        section: 'Engineering And Verification',
        keeps: [
          /workbench\/skills\/implement\/SKILL\.md#engineering-and-verification/, /RUNBOOK\.md#test-and-build/, /RUNBOOK\.md#operations-index/,
          /explicit error handling/, /Never invent APIs/, /red\/green|smallest green change/, /failing test/, /targeted test/, /full verification suite/,
          /tests are impractical, name the specific reason/, /demo artifact/, /baselines? before/, /[Nn]ever weaken|not agent-outcome evidence/
        ],
        moved: [/Define expected behavior at a stable testing seam/, /Refactor only while green/, /node tools\/test-/, /\[(TARGETED_TEST|FULL_VERIFICATION|SPEC_DOCTOR)_COMMAND\]/, /```/]
      },
      {
        section: 'Documentation Ownership And Proof',
        keeps: [
          /Documentation is part of done/, /documentation owner/, /LEXICON\.md#artifact-ownership-schema/, /workbench\/wiki\//,
          /architectural decisions/, /Docs checked; no update needed/, /[Ff]inal response proof/,
          /A citation into a file that changes must say which tree it reads at/, /workbench\/skills\/to-docs\/SKILL\.md#citation-anchors/
        ],
        moved: [/\| Truth \| Owner \|/, /pre=`<sha>` post=`<sha>`/, /A label immediately before a citation/, /never re-anchored/]
      },
      {
        section: 'Template Upgrade Release Gate', carriers: ['root'],
        keeps: [
          /RUNBOOK\.md#template-upgrade-release-gate/, /must update the existing reference repository/, /Record this proof in the current release spec/,
          /keeps that release gate open/, /do not substitute for the installed upgrade/, /Main promotion remains owner-only in both repositories/
        ],
        moved: [/Pin the source commit/, /exact managed bytes/, /fresh remote clone/]
      }
    ]
  },
  {
    // The operations every room runs on its installed runtime. Decision
    // records join the to-docs skill, which already routes a decision to its
    // record; the Landmark Tracker joins the notepad skill's working-context
    // section; recovery joins implement; the rest share one new core skill,
    // workbench-runtime. The template carries the decision-record, diagnostic
    // and Wiki operations inside its lifecycle, diagnostics and decision-record
    // section, so those rows check no template heading of their own.
    task: 'TK-005J operations every room runs',
    rows: [
      {
        operation: 'Write or accept a decision record', pointer: 'workbench/skills/to-docs/SKILL.md#decision-records',
        section: { root: 'Architecture Decision Records', template: 'Workbench Lifecycle, Diagnostics, And Decision Records' },
        stub: { root: true, template: false },
        carries: [
          'node workbench/tools/adr.mjs supersede ADR-#### --by ADR-####',
          '`accept` moves a `proposed/` record to the top level once its corrections are reconciled',
          'Both kinds answer the five read words the Lexicon defines, and reads never write.',
          '`normalize` is the explicit repair for a hand-authored record',
          '`workbench-layout.mjs init` creates it; for a room stamped before it',
          'Create a new ADR only when it adds a valuable distinct architectural lens or layer'
        ]
      },
      {
        operation: 'Read a diagnostic and its blocking effect', pointer: 'workbench/skills/workbench-runtime/SKILL.md#diagnostics-and-blocking-effects',
        section: { root: 'Diagnostics And Blocking Effects', template: 'Workbench Lifecycle, Diagnostics, And Decision Records' },
        stub: { root: true, template: false },
        carries: [
          'no spec, manifest, or projection can choose whether its own finding blocks',
          '| `selected-slice` | `doctor` reports it and exits 0; `next` excludes the slice; `claim` refuses it by name | `blocked-slice` |',
          'Grouping is presentation',
          'An operations index row that points to a skill the lane lacks is the attention finding `skill-pointer-dangling`',
          '`permission-scope-drift` (severity `error`, scope `controls`, effect `none`)',
          'The claim-age diagnostic compares UTC calendar date stamps'
        ]
      },
      {
        operation: 'Validate the Wiki', pointer: 'workbench/skills/workbench-runtime/SKILL.md#wiki-validation',
        section: { root: 'Wiki Validation', template: 'Workbench Lifecycle, Diagnostics, And Decision Records' },
        stub: { root: true, template: false },
        carries: [
          'node workbench/tools/wiki.mjs validate', '`copied-task-state` flags generated-region markers',
          '`normalize` is the explicit repair for a note whose required properties are missing',
          'refresh the stamp when the harness is upgraded'
        ]
      },
      {
        operation: 'Repair installed state', pointer: 'workbench/skills/workbench-runtime/SKILL.md#installed-state-the-harness-wrote',
        section: { root: 'Installed State The Harness Wrote', template: null }, stub: true,
        carries: ['node workbench/tools/workbench-layout.mjs seed-documents --project /absolute/project', '`record-source` records verified source identity in `provenance.source`']
      },
      {
        operation: 'Allocate a visible identifier', pointer: 'workbench/skills/workbench-runtime/SKILL.md#visible-identifiers',
        section: 'Visible Identifiers', stub: true,
        carries: ['`next-id` is a read-only proposal, not a reservation or permission to create work.', 'node workbench/tools/spec-workbench.mjs widen-id TK-### --spec S-###', 'Never bulk-widen']
      },
      {
        operation: 'Use the Landmark Tracker', pointer: 'workbench/skills/notepad/SKILL.md#landmark-tracker-accepted-design-and-available-operations',
        section: 'Landmark Tracker: accepted design and available operations', stub: true,
        carries: ['do not invent a Tracker invocation or use an existing command as its substitute', "A Landmark Wiki page is the landmark's evolving synthesis"]
      },
      {
        operation: 'Recover or roll back', pointer: 'workbench/skills/implement/SKILL.md#recovery-and-rollback',
        section: 'Recovery And Rollback', stub: false,
        carries: ['Identify the touched files and failing command.', 'Rerun the failing verification command.', 'Update the owning spec with the result and remaining gap, then render.']
      },
      {
        operation: 'Check the Workbench connection identity', pointer: 'workbench/skills/workbench-runtime/SKILL.md#workbench-connection-identity',
        section: 'Workbench connection identity', stub: true,
        carries: ['node workbench/tools/workbench-layout.mjs identify --project .', 'Malformed identity is refused, never silently regenerated.']
      },
      {
        operation: 'Check configured-host capabilities', pointer: 'workbench/skills/workbench-runtime/SKILL.md#configured-host-capability-checks',
        section: 'Configured-host capability checks', stub: true,
        carries: ['Capability does not prove enforcement or agent reliability.', 'Native discovery/invocation always needs a separate provider trace.']
      },
      {
        operation: 'Save, promote or add a room-local skill', pointer: 'workbench/skills/workbench-runtime/SKILL.md#room-local-skills',
        section: 'Portable Save, Promote And Room-Local Skills', stub: false,
        carries: ['For an authorized room-specific extension, keep its sole source in the lane', 'Invoke the extension in the actual configured application']
      }
    ],
    agents: []
  },
  {
    // S-004C TK-005K: the operations only this repository's maintainers run
    // move into three maintainer skills that workbench/manifest.json declares
    // under maintainerSkills (TK-006L): release, room checks and evaluation.
    // They never ship, so the template keeps its own generic sections and
    // carries none of these rows.
    task: 'TK-005K maintainer-only operations',
    only: 'root',
    rows: [
      {
        operation: "Freeze a version label", pointer: 'workbench/skills/workbench-release/SKILL.md#release-identity',
        section: { root: "Release Identity", template: null }, stub: { root: true, template: false },
        carries: ["A version label freezes when stamped, even before publication.", "The core machine catalog is `coreSkills` in the layout runtime"]
      },
      {
        operation: "Upgrade the reference Template for a release", pointer: 'workbench/skills/workbench-release/SKILL.md#template-upgrade-release-gate',
        section: { root: "Template Upgrade Release Gate", template: null }, stub: { root: true, template: false },
        carries: ["This is the required real-room test of `update-harness`.", "Clone that remote result afresh"]
      },
      {
        operation: "Inspect a GitHub coordination binding", pointer: 'workbench/skills/workbench-room-checks/SKILL.md#github-coordination-binding-inspection',
        section: { root: "GitHub Coordination Binding Inspection", template: null }, stub: { root: true, template: false },
        carries: ["It reports live access as unverified."]
      },
      {
        operation: "Prepare project evidence and Blueprint questions", pointer: 'workbench/skills/workbench-release/SKILL.md#prepare-project-evidence-and-blueprint-questions',
        section: { root: "Prepare project evidence and Blueprint questions", template: null }, stub: { root: true, template: false },
        carries: ["node workbench/tools/project-evidence.mjs prepare --project-root ."]
      },
      {
        operation: "Derive a fresh room from recorded decisions", pointer: 'workbench/skills/workbench-release/SKILL.md#derive-a-fresh-room-from-recorded-decisions',
        section: { root: "Derive a fresh room from recorded decisions", template: null }, stub: { root: true, template: false },
        carries: ["node tools/genesis-from-decisions.mjs derive --template TEMPLATE_ROOT"]
      },
      {
        operation: "Check the skills lane", pointer: 'workbench/skills/workbench-room-checks/SKILL.md#skills-lane-check',
        section: { root: "Skills lane check", template: null }, stub: { root: true, template: false },
        carries: ["node tools/workbench-skills.mjs install --project /absolute/project", "it may hold maintainer skills, only when `workbench/manifest.json` declares them"]
      },
      {
        operation: "Publish to the personal catalog", pointer: 'workbench/skills/workbench-release/SKILL.md#personal-catalog-publication',
        section: { root: "Personal catalog publication", template: null }, stub: { root: true, template: false },
        carries: ["node tools/core-skill-installer.mjs install --home /tmp/workbench-user-home"]
      },
      {
        operation: "Check the support root", pointer: 'workbench/skills/workbench-room-checks/SKILL.md#v3-support-root-check',
        section: { root: "V3 support-root check", template: null }, stub: { root: true, template: false },
        carries: ["node workbench/tools/workbench-layout.mjs migrate --project /absolute/project"]
      },
      {
        operation: "Check the managed runtime tools", pointer: 'workbench/skills/workbench-room-checks/SKILL.md#managed-runtime-tools-check',
        section: { root: "Managed runtime tools check", template: null }, stub: { root: true, template: false },
        carries: ["node tools/workbench-tools.mjs install --project /absolute/project"]
      },
      {
        operation: "Classify a room's lifecycle route", pointer: 'workbench/skills/workbench-room-checks/SKILL.md#room-lifecycle-classification-check',
        section: { root: "Room lifecycle classification check", template: null }, stub: { root: true, template: false },
        carries: ["node tools/workbench-classify.mjs"]
      },
      {
        operation: "Check an adoption migration", pointer: 'workbench/skills/workbench-room-checks/SKILL.md#v3-adoption-migration-check',
        section: { root: "V3 Adoption migration check", template: null }, stub: { root: true, template: false },
        carries: ["node tools/workbench-adoption.mjs"]
      },
      {
        operation: "Report control fidelity", pointer: 'workbench/skills/workbench-room-checks/SKILL.md#control-fidelity-report',
        section: { root: "Control fidelity report", template: null }, stub: { root: true, template: false },
        carries: ["node tools/control-fidelity.mjs report --project /absolute/project"]
      },
      {
        operation: "Upgrade a v2 room explicitly", pointer: 'workbench/skills/workbench-room-checks/SKILL.md#v3-explicit-upgrade-and-recovery-check',
        section: { root: "V3 explicit upgrade and recovery check", template: null }, stub: { root: true, template: false },
        carries: ["`--layout-only` is the route for an already-adopted room"]
      },
      {
        operation: "Check Workbench self-drift", pointer: 'workbench/skills/workbench-room-checks/SKILL.md#workbench-self-drift-check',
        section: { root: "Workbench self-drift check", template: null }, stub: { root: true, template: false },
        carries: ["Run `node workbench/tools/self-drift.mjs --phase pre --json` before the change"]
      },
      {
        operation: "Check carrier line landing", pointer: 'workbench/skills/workbench-room-checks/SKILL.md#carrier-line-landing-check',
        section: { root: "Carrier line-landing check", template: null }, stub: { root: true, template: false },
        carries: ["node tools/check-carrier-landing.mjs check --base BASE_SHA --candidate HEAD"]
      },
      {
        operation: "Prove the composed round trip", pointer: 'workbench/skills/workbench-release/SKILL.md#composed-round-trip',
        section: { root: "Composed round trip", template: null }, stub: { root: true, template: false },
        carries: ["node tools/test-workbench-round-trip.mjs"]
      },
      {
        operation: "Check the portability and privacy matrix", pointer: 'workbench/skills/workbench-release/SKILL.md#portability-and-privacy-matrix',
        section: { root: "Portability and privacy matrix", template: null }, stub: { root: true, template: false },
        carries: ["node tools/test-portability-matrix.mjs"]
      },
      {
        operation: "Prove cross-provider resume", pointer: 'workbench/skills/workbench-release/SKILL.md#cross-provider-resume-proof',
        section: { root: "Cross-provider resume proof", template: null }, stub: { root: true, template: false },
        carries: ["node tools/cross-provider-resume.mjs plan --workspace /disposable/workspace"]
      },
      {
        operation: "Use the socket contract registry", pointer: 'workbench/skills/workbench-room-checks/SKILL.md#socket-contract-registry',
        section: { root: "Socket Contract Registry", template: null }, stub: { root: true, template: false },
        carries: ["node tools/socket-contract.mjs validate"]
      },
      {
        operation: "Pick the claims to test", pointer: 'workbench/skills/workbench-evaluation/SKILL.md#claims-to-test',
        section: { root: "Claims To Test", template: null }, stub: { root: true, template: false },
        carries: ["Better than a representative generic instruction file."]
      },
      {
        operation: "Design an evaluation", pointer: 'workbench/skills/workbench-evaluation/SKILL.md#evaluation-design',
        section: { root: "Evaluation Design", template: null }, stub: { root: true, template: false },
        carries: ["Score task outcomes (correctness, scope adherence, verification honesty, docs"]
      },
      {
        operation: "Run the evaluation commands", pointer: 'workbench/skills/workbench-evaluation/SKILL.md#commands',
        section: { root: "Commands", template: null }, stub: { root: true, template: false },
        carries: ["python3 evals/score.py evals/results/_pipeline_selftest.jsonl --baseline c0_none"]
      },
      {
        operation: "Take in harness feedback", pointer: 'workbench/skills/workbench-evaluation/SKILL.md#harness-feedback-loop',
        section: { root: "Harness Feedback Loop", template: null }, stub: { root: true, template: false },
        carries: ["Collect feedback rows from downstream projects"]
      },
      {
        operation: "Run the automated feedback gate", pointer: 'workbench/skills/workbench-evaluation/SKILL.md#automated-feedback-gate',
        section: { root: "Automated Feedback Gate", template: null }, stub: { root: true, template: false },
        carries: ["Discovery is fail-closed and one-candidate-at-a-time."]
      },
      {
        operation: "Record an automation run outcome", pointer: 'workbench/skills/workbench-evaluation/SKILL.md#automation-run-outcomes',
        section: { root: "Automation Run Outcomes", template: null }, stub: { root: true, template: false },
        carries: ["node tools/feedback-automation.mjs run-outcome --input FILE"]
      },
      {
        operation: "Write a manual harness feedback report", pointer: 'workbench/skills/workbench-evaluation/SKILL.md#manual-harness-feedback-reports',
        section: { root: "Manual Harness Feedback Reports", template: null }, stub: { root: true, template: false },
        carries: ["Write `REPORT-topic-date.md` in the declared feedback lane"]
      }
    ],
    agents: [{
      carriers: ['root'],
      section: 'Workbench update drift boundary',
      keeps: [/does not substitute for the\s+Workbench self-drift check/, /S-00K-workbench-self-drift-check/, /workbench-room-checks\/SKILL\.md#workbench-self-drift-check/],
      moved: [/bounded manual semantic check in\s+RUNBOOK/]
    }]
  },
  {
    // S-004L TK-008M: harness improvement is one loop, the improve-harness
    // core skill. The evaluation row in both Runbooks points at the loop; the
    // comparison tooling (claims, design, commands, automated gate, run
    // outcomes) stays on the workbench-evaluation maintainer skill, whose
    // TK-005K rows above keep holding.
    task: 'S-004L TK-008M the evaluation row points at the one loop',
    rows: [
      {
        operation: 'Evaluate a harness change', pointer: 'workbench/skills/improve-harness/SKILL.md#improve-harness',
        section: 'Evaluation And Benchmarking', stub: false,
        carries: [
          'baseline -> earliest gap -> smallest owning intervention',
          "Comparative, causal or longitudinal claims need the room's evaluation procedures, not this loop."
        ]
      }
    ],
    agents: []
  },
  {
    // S-004L TK-008M, root only: feedback intake and the manual report point at
    // the loop's feedback entry and result record. The maintainer harvest and
    // report steps keep their workbench-evaluation pointers (TK-005K above).
    task: 'S-004L TK-008M harness feedback and report rows point at the one loop',
    only: 'root',
    rows: [
      {
        operation: 'Take in harness feedback', pointer: 'workbench/skills/improve-harness/SKILL.md#taking-in-feedback',
        section: { root: 'Harness Feedback Loop', template: null }, stub: { root: true, template: false },
        carries: ["Harness feedback is the loop's entry.", 'write the lesson back into that record']
      },
      {
        operation: 'Write a manual harness feedback report', pointer: 'workbench/skills/improve-harness/SKILL.md#result-record',
        section: { root: 'Manual Harness Feedback Reports', template: null }, stub: { root: true, template: false },
        carries: ['in the report format that lane declares when it has one', 'Decision: retain | revise | remove']
      }
    ],
    agents: []
  }
];

const pick = (value, label) => (value === null || typeof value === 'string' ? value : value[label]);

for (const family of FAMILIES) {
  for (const carrier of carriers.filter((item) => !family.only || item.label === family.only)) {
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
        if (title === null) continue;
        const section = all.find((heading) => heading.title === title);
        assert.ok(section, `${carrier.runbook}: the "${title}" heading survives`);
        assert.ok(links(section.body).includes(row.pointer), `${carrier.runbook}: "${title}" points to ${row.pointer}`);
        if (pick(row.stub, carrier.label)) {
          assert.doesNotMatch(section.body, /```/, `${carrier.runbook}: "${title}" keeps no procedure block`);
          assert.ok(normalize(section.body).length <= 700, `${carrier.runbook}: "${title}" is a sentence plus a pointer (${normalize(section.body).length} chars)`);
        }
      }
    });

    test(`${carrier.label} ${family.task}: AGENTS keeps only the family's always-true lines`, () => {
      for (const brief of [family.agents].flat().filter((item) => !item.carriers || item.carriers.includes(carrier.label))) {
        const section = headings(read(carrier.agents)).find((heading) => heading.title === brief.section);
        assert.ok(section, `${carrier.agents}: "${brief.section}" survives`);
        const body = normalize(section.body);
        for (const pattern of brief.keeps) assert.match(body, pattern, `${carrier.agents} ${brief.section}: the brief keeps ${pattern}`);
        for (const pattern of brief.moved) assert.doesNotMatch(body, pattern, `${carrier.agents} ${brief.section}: ${pattern} moved behind its pointer`);
        for (const target of links(section.body).filter((link) => !/^[a-z][a-z0-9+.-]*:/i.test(link))) {
          const resolved = resolvePointer(carrier.agents, target);
          assert.ok(resolved.ok, `${carrier.agents} ${brief.section}: ${target} resolves (${resolved.reason})`);
        }
      }
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

// S-004L TK-008M: the workbench-evaluation Harness Feedback Loop and Manual
// Harness Feedback Reports sections keep only this repository's maintainer
// harvest and report steps, behind a pointer to the improve-harness loop.
test('S-004L TK-008M: workbench-evaluation keeps its harvest and report steps behind a pointer to the loop', () => {
  const skillFile = 'workbench/skills/workbench-evaluation/SKILL.md';
  const sections = headings(read(skillFile));
  for (const { title, pointer, keeps } of [
    {
      title: 'Harness Feedback Loop', pointer: '../improve-harness/SKILL.md#taking-in-feedback',
      keeps: ['This repo is the harvest destination.', 'Collect feedback rows from downstream projects', 'as a `c3_candidate`', 'Ship it as a new harness version']
    },
    {
      title: 'Manual Harness Feedback Reports', pointer: '../improve-harness/SKILL.md#result-record',
      keeps: ['Run this workflow after a setup-only Round One check succeeds.', 'Write `REPORT-topic-date.md` in the declared feedback lane using its `REPORT_FORMAT.md`', 'A report is not a work assignment.']
    }
  ]) {
    const section = sections.find((heading) => heading.title === title);
    assert.ok(section, `${skillFile}: "${title}" survives`);
    assert.ok(links(section.body).includes(pointer), `${skillFile} ${title} points at the loop: ${pointer}`);
    const body = normalize(section.body);
    for (const phrase of keeps) assert.ok(body.includes(normalize(phrase)), `${skillFile} ${title} keeps the maintainer step: ${phrase}`);
  }
});

// S-004C TK-005J: the claim-age diagnostic and the amendment-first decision
// rule left Evidence And Continuation Practices for the skills that carry
// their operations, and the template's lifecycle, diagnostics and
// decision-record section keeps only the runtime command list with pointers.
test('TK-005J: Evidence And Continuation Practices points its diagnostic and decision-record rules to their homes', () => {
  for (const { label, runbook } of carriers) {
    const section = headings(read(runbook)).find((heading) => heading.title === 'Evidence And Continuation Practices');
    assert.ok(section, `${label}: the Evidence And Continuation Practices heading survives`);
    const pointed = links(section.body);
    for (const pointer of ['workbench/skills/workbench-runtime/SKILL.md#diagnostics-and-blocking-effects', 'workbench/skills/to-docs/SKILL.md#decision-records']) {
      assert.ok(pointed.includes(pointer), `${label}: Evidence And Continuation Practices points to ${pointer}`);
    }
    const body = normalize(section.body);
    for (const moved of ['strictly greater than 86,400,000 milliseconds', 'Correct or expand the existing ADR when refining the same architectural decision']) {
      assert.ok(!body.includes(moved), `${label}: "${moved}" moved behind its pointer`);
    }
  }
  const lifecycle = headings(read('templates/RUNBOOK.md')).find((heading) => heading.title === 'Workbench Lifecycle, Diagnostics, And Decision Records');
  assert.match(lifecycle.body, /node workbench\/tools\/spec-workbench\.mjs doctor/, 'the template keeps the runtime command list');
  assert.doesNotMatch(lifecycle.body, /node workbench\/tools\/adr\.mjs/, 'the decision-record commands moved to the to-docs skill');
  assert.doesNotMatch(lifecycle.body, /`permission-scope-drift` is reported/, 'the diagnostic explanations moved to the workbench-runtime skill');
});

// S-004C TK-005I: the Full suite list has one home. `AGENTS.md` keeps the rule
// that the suite passes before a claim and points to the Runbook's Test And
// Build, which holds the one list in the shape every suite runner reads: the
// line starting `Full suite for controls` and the next bash fence.
function suiteBlock(text) {
  const lines = text.split('\n');
  const start = lines.findIndex((line) => /^Full suite for controls/.test(line));
  if (start < 0) return null;
  const open = lines.findIndex((line, index) => index > start && /^```bash/.test(line));
  const close = lines.findIndex((line, index) => index > open && /^```/.test(line));
  if (open < 0 || close < 0) return null;
  return lines.slice(open + 1, close).filter((line) => line.trim());
}

test('TK-005I: the Full suite list has one home, the Runbook Test And Build section', () => {
  const agents = read('AGENTS.md');
  const runbook = read('RUNBOOK.md');
  assert.equal(suiteBlock(agents), null, 'AGENTS.md carries no Full suite block');
  assert.equal((runbook.match(/^Full suite for controls/gm) ?? []).length, 1, 'RUNBOOK.md holds exactly one Full suite list');
  const testAndBuild = headings(runbook).find((heading) => heading.title === 'Test And Build');
  assert.match(testAndBuild.body, /^Full suite for controls, templates, tools, evals, or specs:$/m, 'the list lives in Test And Build');
  assert.ok(links(testAndBuild.body).includes('AGENTS.md#engineering-and-verification'), 'Test And Build points back to the rule');
  const engineering = headings(agents).find((heading) => heading.title === 'Engineering And Verification');
  assert.ok(links(engineering.body).includes('RUNBOOK.md#test-and-build'), 'AGENTS.md points to the one list');
  const suite = suiteBlock(runbook);
  assert.ok(suite.length >= 40, `the list is the whole suite (${suite.length} commands)`);
  assert.equal(new Set(suite).size, suite.length, 'no command is listed twice');
  for (const command of ['node tools/test-control-fidelity.mjs', 'node tools/test-runbook-index.mjs', 'node workbench/tools/spec-workbench.mjs doctor']) {
    assert.ok(suite.includes(command), `the list runs ${command}`);
  }
  for (const command of suite) {
    const script = command.match(/^(?:node|python3) (\S+)/)?.[1];
    assert.ok(script && fs.existsSync(path.join(root, script)), `every listed command runs a tracked script: ${command}`);
  }
  for (const carrier of ['templates/AGENTS.md', 'templates/RUNBOOK.md']) assert.equal(suiteBlock(read(carrier)), null, `${carrier} names no repository suite`);
  const templateTests = headings(read('templates/RUNBOOK.md')).find((heading) => heading.title === 'Test And Build');
  assert.match(templateTests.body, /\[FULL_TEST_COMMAND\]/, 'the template keeps one generic full verification list');
});

// TK-005K moved the gate's procedure from the Runbook section into the
// workbench-release maintainer skill; the Runbook heading keeps a pointer.
test('TK-005I: the Template Upgrade Release Gate procedure the AGENTS brief restates is reachable from the index', () => {
  const { rows } = indexOf('RUNBOOK.md');
  const row = rows.find(({ cells }) => cells[0] === 'Upgrade the reference Template for a release');
  const pointer = 'workbench/skills/workbench-release/SKILL.md#template-upgrade-release-gate';
  assert.ok(row && links(row.cells[2]).includes(pointer), 'the index points the release operation at its procedure');
  assert.ok(links(headings(read('RUNBOOK.md')).find((heading) => heading.title === 'Template Upgrade Release Gate').body).includes(pointer), 'the Runbook heading points to the procedure');
  const gate = normalize(headings(read('workbench/skills/workbench-release/SKILL.md')).find((heading) => heading.title === 'Template Upgrade Release Gate').body);
  for (const phrase of [
    'This is the required real-room test of `update-harness`.', 'Pin the clean source version/commit and the Template\'s current integration commit',
    'compare every installed managed hash', 'merge into its declared integration branch', 'Clone that remote result afresh'
  ]) assert.ok(gate.includes(phrase), `the workbench-release gate holds: ${phrase}`);
  // TK-005K review correction: from the skill folder the gate links the
  // update-harness skill it follows, rather than naming a repository path a
  // reader would resolve from the wrong folder.
  const gateSection = headings(read('workbench/skills/workbench-release/SKILL.md')).find((heading) => heading.title === 'Template Upgrade Release Gate');
  assert.ok(links(gateSection.body).includes('../update-harness/SKILL.md'), 'the moved gate links ../update-harness/SKILL.md');
  assert.doesNotMatch(gateSection.body, /`workbench\/skills\/update-harness\/SKILL\.md`/, 'the moved gate names no repository-rooted skill path');
});

// S-004C TK-005G review correction: procedures moved into lane skills keep
// working links. Every relative Markdown link outside code in a lane skill
// resolves from that skill's own folder (a generated room lays its lane down
// with the same layout), and a fragment names a heading in its target.
test('every relative Markdown link in a lane skill resolves from the skill folder', () => {
  const lane = 'workbench/skills';
  const broken = [];
  let checked = 0;
  for (const name of fs.readdirSync(path.join(root, lane)).sort()) {
    const skillFile = `${lane}/${name}/SKILL.md`;
    if (!fs.existsSync(path.join(root, skillFile))) continue;
    let fence = false;
    const prose = read(skillFile).split('\n').filter((line) => {
      if (/^\s*(```|~~~)/.test(line)) { fence = !fence; return false; }
      return !fence;
    }).join('\n').replace(/`[^`\n]*`/g, '');
    for (const target of links(prose)) {
      if (/^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith('/')) continue;
      checked += 1;
      const [relative, fragment] = target.split('#');
      const file = relative ? path.normalize(path.join(path.dirname(skillFile), relative)) : skillFile;
      if (!fs.existsSync(path.join(root, file))) { broken.push(`${skillFile}: ${target} (missing ${file})`); continue; }
      if (fragment && file.endsWith('.md') && !headings(read(file)).some((heading) => heading.slug === fragment)) {
        broken.push(`${skillFile}: ${target} (no heading #${fragment} in ${file})`);
      }
    }
  }
  assert.ok(checked > 10, `the scan found the lane skill links (${checked})`);
  assert.deepEqual(broken, []);
});

// S-003Z TK-008Y: the Runbook carriers name the delivered landmark commands in
// one Landmark Lifecycle section the index reaches, and the AGENTS carriers no
// longer present landmark review tooling as undelivered. The Lexicon rows are
// a separate Task held by the Contract carrier writer.
const LANDMARK_COMMANDS = [
  'next-id --prefix LMK', 'move-spec S-001 --landmark LMK-001', 'move-spec S-001 --landmark none',
  'claim LMK-001 --agent NAME', 'show LMK-001', 'receipt LMK-001 --task TK-001', 'close LMK-001',
  'gate --task TK-001 --landmark LMK-001', 'move-task LMK-001 --task TK-001 --to retired',
  'report LMK-001 --candidate', 'verify LMK-001', 'verdict LMK-001 --candidate', 'approve LMK-001 --candidate',
  'retire-landmark LMK-001 --wiki'
];
for (const carrier of carriers) {
  test(`S-003Z TK-008Y: the ${carrier.label} Runbook names the landmark commands in a Landmark Lifecycle section the index reaches`, () => {
    const { all, rows } = indexOf(carrier.runbook);
    const section = all.find((heading) => heading.title === 'Landmark Lifecycle');
    assert.ok(section, `${carrier.runbook} has a Landmark Lifecycle section`);
    assert.ok(rows.some((row) => row.cells[2]?.includes('(#landmark-lifecycle)')), `${carrier.runbook} index reaches #landmark-lifecycle`);
    for (const command of LANDMARK_COMMANDS) assert.ok(section.body.includes(`node workbench/tools/spec-workbench.mjs ${command}`), `${carrier.runbook} Landmark Lifecycle names ${command}`);
    assert.ok(rows.some((row) => row.cells[0] === 'Allocate a visible identifier' && /landmark/.test(row.cells[1])), `${carrier.runbook} identifier row names a landmark`);
  });
  test(`S-003Z TK-008Y: ${carrier.agents} presents landmark review tooling as delivered`, () => {
    const text = normalize(read(carrier.agents));
    assert.doesNotMatch(text, /Landmark and whole-Workbench review tooling is accepted destination design/, 'the stale clause is gone');
    assert.match(text, /`report`, `verify` and `verdict` on (the|a) landmark/, `${carrier.agents} names the landmark review commands`);
  });
}

test('S-003Z TK-008Y: the Full suite runs the Landmark Wiki page test', () => {
  assert.ok(suiteBlock(read('RUNBOOK.md')).includes('node tools/test-landmark-wiki.mjs'), 'the suite runs tools/test-landmark-wiki.mjs');
});

// S-00J TK-001: report the assembled Spec state for a reviewer at a stable
// seam, bound to a named candidate SHA.
//
// A separate-context reviewer needs one call that assembles a Spec's Tasks,
// acceptance lines, evidence rows, completion result and gaps, so the
// reviewer reads the assembled Spec rather than a diff. This module informs;
// it refuses nothing (TK-002 records a verdict from what it reports, TK-004
// binds a gate to that verdict). It composes this room's own existing
// readers rather than reparsing a Spec or a Task record itself - the same
// traversal-not-copy pattern `assembleTaskPacket` in task-packet.mjs uses for
// one Task's Packet:
//   - `loadSpecs` / `findSpec` / `slicesOf` in spec-workbench.mjs give the
//     one merged Task list (a table row or a Task record, one source of
//     truth per Spec) in the same shape `show --json` calls `tasks`.
//   - `readReceiptFromFile` in task-receipt.mjs gives a record-backed Task's
//     append-only run history, when it has one.
//
// The evidence table's columns vary by Spec (older Specs use
// `Date | Commit | Claim | Method | Result`; newer rows are six cells), so
// rows are parsed as cell arrays with the header preserved, never by fixed
// column names.
//
// Binding to the candidate: this reads the Spec and its records from the
// working tree, then names the candidate it was asked about, its full commit
// SHA once `git rev-parse <sha>^{commit}` resolves it in the room's own
// repository, and whether the working tree's own HEAD is that same commit -
// so a reviewer can see when the two differ, and so an abbreviated candidate
// still compares correctly against a full HEAD SHA. It never checks out or
// reads a blob from the named SHA; a review of a moved candidate is TK-002's
// refusal, not this slice's.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { parseMarkdownTableRow } from './markdown-table.mjs';
import { findSpec, slicesOf } from './spec-workbench.mjs';
import { readReceiptFromFile } from './task-receipt.mjs';
import { compareVisibleIds, visibleIdKey } from './visible-ids.mjs';

const PLACEHOLDER_COMPLETION = /^pending\.?$/i;

export function assembleSpecReport(rootDir, specId, options = {}) {
  const candidateSha = options.candidate;
  if (!candidateSha) throw new Error('assembleSpecReport requires a --candidate SHA');
  const root = path.resolve(rootDir);
  const spec = findSpec(root, specId);

  const tasks = mergedTasks(spec);
  const acceptance = parseAcceptance(spec.content);
  const evidence = parseEvidence(spec.content);
  const completionResult = section(spec.content, 'Completion Result').trim();

  const gaps = collectGaps({ tasks, acceptance, completionResult, evidence });

  return {
    id: spec.id,
    title: spec.title,
    status: spec.status,
    priority: spec.priority,
    owner: spec.owner,
    updated: spec.updated,
    description: spec.description,
    blockers: spec.blockers,
    latestEvent: spec.latestEvent,
    nextGate: spec.nextGate,
    path: spec.relativePath,
    candidate: candidateBinding(root, candidateSha),
    tasks,
    acceptance,
    evidence,
    completionResult,
    gaps,
    complete: gaps.length === 0
  };
}

// The one merged Task list `slicesOf` gives (a Task record where the Spec
// has one, a table row otherwise) union'd with any retained slice-table row
// that has no matching record. `completeSpec` in spec-workbench.mjs already
// unions both sources when it checks for an unfinished slice
// (`[...slicesOf(spec).map(...), ...spec.rows.map(...)]`); a record-backed
// Spec's retained table row is completed history rather than a live slice
// (`assertOneSliceTruth`), but it still carries the landed proof a reviewer
// needs, so it is reported too - marked `source: 'row'` and `history: true`
// rather than silently dropped. For a table-only Spec every row already came
// through `slicesOf`, so this union adds nothing there. The merged list is
// kept in visible-id order, matching how `listTaskRecords` already orders
// standalone records.
function mergedTasks(spec) {
  const liveTasks = slicesOf(spec).map((slice) => taskEntry(slice));
  const liveIds = new Set(liveTasks.map((task) => visibleIdKey(task.id)));
  const historyRows = spec.rows
    .filter((row) => !liveIds.has(visibleIdKey(row.id)))
    .map((row) => historyTaskEntry(row));
  return [...liveTasks, ...historyRows].sort((a, b) => compareVisibleIds(a.id, b.id));
}

// One Task entry, enriched from whichever source `slicesOf` resolved for it.
// A table-row Task carries no Task record, so it carries no Receipt or
// planned-verification field at all - both are `undefined`, not `null`,
// because neither member exists for that source rather than existing empty.
function taskEntry(slice) {
  const task = {
    id: slice.id,
    slice: slice.slice,
    status: slice.declared,
    blockers: slice.blockers,
    proof: slice.proof ?? null,
    source: slice.source
  };
  if (slice.source === 'record') {
    task.plannedVerification = slice.record.plannedVerification ?? null;
    if (slice.record.filePath && fs.existsSync(slice.record.filePath)) {
      const rows = readReceiptFromFile(slice.record.filePath);
      task.receipt = { runCount: rows.length, latestRow: rows.length > 0 ? rows[rows.length - 1] : null };
    }
  }
  return task;
}

// A retained slice-table row with no matching Task record: completed
// history, carried verbatim from the row's own cells, never enriched with a
// Receipt or planned verification because it names no record file to read
// either from.
function historyTaskEntry(row) {
  return {
    id: row.id,
    slice: row.slice,
    status: row.status,
    blockers: row.blockers,
    proof: row.proof ?? null,
    source: 'row',
    history: true
  };
}

// Every `- [ ]` / `- [x]` line in the Acceptance Criteria section, in
// document order, with its checked state and text kept separate from the
// bullet syntax.
function parseAcceptance(content) {
  const body = section(content, 'Acceptance Criteria');
  const lines = [];
  for (const match of body.matchAll(/^- \[([ xX])\]\s*(.*)$/gm)) {
    lines.push({ checked: match[1].toLowerCase() === 'x', text: match[2].trim() });
  }
  return lines;
}

// The evidence table's header row (cell array, wording kept verbatim) and
// its data rows (also cell arrays), never read by a fixed column name: the
// header wording is decorative and differs across Specs, and this module
// never assumes which column is which.
function parseEvidence(content) {
  const body = section(content, 'Append-Only Evidence And Execution Log');
  const lines = body.split('\n').map((line) => line.trim()).filter(Boolean);
  const header = lines[0] && lines[0].startsWith('|') ? parseMarkdownTableRow(lines[0]) : [];
  const rows = [];
  for (const line of lines) {
    if (!/^\|\s*\d{4}-\d{2}-\d{2}\s*\|/.test(line)) continue;
    rows.push({ cells: parseMarkdownTableRow(line) });
  }
  return { header, rows };
}

function collectGaps({ tasks, acceptance, completionResult, evidence }) {
  const gaps = [];
  for (const task of tasks) {
    if (task.status !== 'done') gaps.push(`Task ${task.id} is ${task.status}, not done`);
  }
  acceptance.forEach((line, index) => {
    if (!line.checked) gaps.push(`Acceptance line ${index + 1} is unchecked: ${line.text}`);
  });
  if (!completionResult || PLACEHOLDER_COMPLETION.test(completionResult)) {
    gaps.push('Completion Result is missing or still a placeholder');
  }
  const doneTaskIds = tasks.filter((task) => task.status === 'done').map((task) => task.id);
  for (const id of doneTaskIds) {
    const named = evidence.rows.some((row) => row.cells.some((cell) => cell.includes(id)));
    if (!named) gaps.push(`Evidence log names no row for done Task ${id}`);
  }
  return gaps;
}

// Named exactly as asked (`sha`, whatever length the caller gave, verbatim),
// plus the full commit SHA it resolves to in the room's own repository
// (`resolvedSha`, `null` when it does not resolve) and whether the working
// tree's own HEAD is that same commit - never a checkout, never a blob read
// at that SHA. Both `resolvedSha` and `headSha` are resolved through
// `git rev-parse <ref>^{commit}`, so an abbreviated candidate SHA (or any
// other ref `git` accepts) compares correctly against a HEAD that is the
// same commit; comparing the raw strings instead would report `matchesHead:
// false` for a short candidate even when it is exactly HEAD.
function candidateBinding(root, sha) {
  const headSha = resolveCommitSha(root, 'HEAD');
  const resolvedSha = resolveCommitSha(root, sha);
  return {
    sha,
    resolvedSha,
    existsInRepository: resolvedSha !== null,
    headSha,
    matchesHead: resolvedSha !== null && resolvedSha === headSha
  };
}

// Resolves any ref `git` accepts (a full or abbreviated SHA, or `HEAD`) to
// its full commit SHA, or `null` when it does not resolve to a commit in
// this repository - never a throw, matching "inform, never refuse".
function resolveCommitSha(root, ref) {
  const result = spawnSync('git', ['-C', root, 'rev-parse', `${ref}^{commit}`], { encoding: 'utf8' });
  return result.status === 0 ? result.stdout.trim() : null;
}

// Section extraction anchored to a whole line, matching the resolver
// `assembleTaskPacket` uses in task-packet.mjs for the same reason: a
// heading is a `## Name` line and only that line - a strict-prefix
// reference, a `###` subsection sharing the title, or a prose sentence that
// merely mentions the heading text mid-line must never be mistaken for it.
// The naive `content.indexOf('## ' + heading)` this replaced matched
// whichever of those came first in the file, not the real heading.
function section(content, heading) {
  const marker = new RegExp(`^## ${escapeRegExp(heading)}[ \t]*$`, 'm');
  const match = marker.exec(content);
  if (!match) return '';
  const bodyStart = match.index + match[0].length;
  const end = content.indexOf('\n## ', bodyStart);
  return content.slice(bodyStart, end < 0 ? content.length : end).trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// The short human-readable form the `report` CLI verb prints without
// `--json`: a Spec line, the candidate line with its resolution and HEAD
// match, one line per Task with its status, source and Receipt run count
// when it has one, and the gap count followed by each gap. `--json` keeps
// printing the full object this module returns; this is a rendering of the
// same data, never a second source of it.
export function formatSpecReport(report) {
  const lines = [];
  lines.push(`${report.id} - ${report.title} [${report.status}]`);
  const c = report.candidate;
  lines.push(`Candidate ${c.sha} (resolved ${c.resolvedSha ?? 'none'}) exists=${c.existsInRepository} matchesHead=${c.matchesHead} (head ${c.headSha ?? 'none'})`);
  lines.push('Tasks:');
  for (const task of report.tasks) {
    const runs = task.receipt ? `, runs ${task.receipt.runCount}` : '';
    const history = task.history ? ' [history]' : '';
    lines.push(`  ${task.id} ${task.status} (source: ${task.source}${runs})${history}`);
  }
  lines.push(`Gaps (${report.gaps.length}):`);
  for (const gap of report.gaps) lines.push(`  - ${gap}`);
  return lines.join('\n');
}

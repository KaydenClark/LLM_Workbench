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
import { escapeMarkdownTableCell, parseMarkdownTableRow } from './markdown-table.mjs';
import { appendEvidence, atomicWrite, findSpec, slicesOf } from './spec-workbench.mjs';
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
  const candidate = candidateBinding(root, candidateSha);
  const verdicts = parseVerdicts(evidence);
  const latestVerdict = latestVerdictFor(verdicts, candidate);

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
    candidate,
    tasks,
    acceptance,
    evidence,
    verdicts,
    latestVerdict,
    completionResult,
    gaps,
    complete: gaps.length === 0
  };
}

// S-00J TK-002: a reviewer records a pass or fail verdict against the exact
// current candidate, appended to the Spec's append-only evidence log through
// the same `appendEvidence` seam `closeTask` and `completeSpec` already use
// (never a second append implementation). "Current candidate" is exact and
// only exact: the given SHA must both exist in this repository
// (`git cat-file -e`) and equal the room's own `HEAD` at recording time,
// character for character - no prefix matching, no "close enough", unlike
// the report's own `candidateBinding` above, which deliberately resolves an
// abbreviated SHA so a reviewer can still see whether it matches HEAD. A
// verdict is a stricter binding than a report: reusing a review after its
// candidate moves is exactly what this refuses, so an abbreviated SHA that
// happens to resolve to HEAD is refused the same as any other non-exact
// value - resolving it first would silently accept the "close enough" this
// seam exists to rule out.
//
// This only ever appends: there is no update or rewrite entry point here, so
// a second verdict is a second row, never a replacement of the first, and
// `tools/check-append-only.py`'s identity rule (Date, second cell, Event -
// here `review` and `Review verdict: <result> at <sha>`) is satisfied by
// construction: two verdicts for different candidates or results generate
// different identities, and this module never rewrites a row it already
// wrote.
export function recordReviewVerdict(rootDir, specId, options = {}) {
  const root = path.resolve(rootDir);
  const candidate = requiredString(options.candidate, 'recordReviewVerdict requires a --candidate SHA');
  const result = options.result;
  if (result !== 'pass' && result !== 'fail') {
    throw new Error(`recordReviewVerdict requires --result of pass or fail, got: ${result === undefined ? 'nothing' : result}`);
  }
  const findings = requiredString(options.findings, 'recordReviewVerdict requires --findings ("none" is accepted on a pass)');
  const reviewer = requiredString(options.reviewer, 'recordReviewVerdict requires --reviewer naming the separate context (model and mode)');

  // Validated before the Spec is even loaded, so an invalid candidate never
  // gets far enough to touch a file. Two distinguishable refusals, not one
  // merged message: a candidate absent from this repository entirely is a
  // different problem from one that exists but is no longer HEAD, and
  // TK-004 is expected to relax the HEAD-equality half of this rule later
  // without touching the existence half, which only makes sense if the two
  // are reported (and testable) separately now.
  const headSha = resolveCommitSha(root, 'HEAD');
  if (!commitExists(root, candidate)) {
    throw new Error(`Candidate ${candidate} does not exist in this repository (checked via git cat-file -e); a review must bind to a real commit, never an invented or mistyped SHA.`);
  }
  if (candidate !== headSha) {
    throw new Error(`Candidate ${candidate} is not the current candidate; HEAD is ${headSha ?? 'unresolved'}. A review binds only to the exact current HEAD - no prefix match and no stale candidate - so this verdict is refused rather than recorded against a candidate that has moved.`);
  }

  const spec = findSpec(root, specId);
  const date = new Date().toISOString().slice(0, 10);
  const remainingGap = findingsGap(findings);
  const cells = [date, 'review', `Review verdict: ${result} at ${candidate}`, findings, reviewer, remainingGap];
  const row = `| ${cells.map(escapeMarkdownTableCell).join(' | ')} |`;
  const updated = appendEvidence(spec.content, row);
  atomicWrite(spec.filePath, updated);

  return { specId: spec.id, candidate, result, findings, reviewer, date, remainingGap, row };
}

function requiredString(value, message) {
  if (!value || !String(value).trim()) throw new Error(message);
  return String(value).trim();
}

// `git cat-file -e <sha>^{commit}` exits 0 exactly when the SHA names a
// commit object in this repository, never a checkout or a blob read -
// matching the "exists" half of "current candidate" the handoff names.
function commitExists(root, sha) {
  const result = spawnSync('git', ['-C', root, 'cat-file', '-e', `${sha}^{commit}`], { encoding: 'utf8' });
  return result.status === 0;
}

// The remaining-gap cell: the literal count of findings when there are any
// (findings given as a semicolon-separated list), or "none" when the
// reviewer named none - never re-deriving pass/fail from it, only counting
// what was actually reported.
function findingsGap(findings) {
  const trimmed = findings.trim();
  if (trimmed.toLowerCase() === 'none') return 'none';
  const items = trimmed.split(';').map((item) => item.trim()).filter(Boolean);
  return String(items.length || 1);
}

// Every verdict row in the evidence log, parsed from its cells alone - never
// a second source of truth - in the document's own order (oldest first,
// newest last, since the log is append-only). A verdict row is identified by
// its literal second cell `review` (recordReviewVerdict's own literal,
// distinguishing it from a Task-id row) and a third cell matching
// `Review verdict: pass|fail at <sha>`; any row that fails either test is
// not a verdict row and is silently skipped, matching the same
// never-assume-column-identity discipline `parseEvidence` above already
// uses for the rest of the table.
const VERDICT_PATTERN = /^Review verdict: (pass|fail) at (\S+)$/;

function parseVerdicts(evidence) {
  const verdicts = [];
  for (const row of evidence.rows) {
    const cells = row.cells;
    if (cells.length < 6 || cells[1] !== 'review') continue;
    const match = VERDICT_PATTERN.exec(cells[2]);
    if (!match) continue;
    verdicts.push({
      date: cells[0],
      result: match[1],
      candidate: match[2],
      findings: cells[3],
      reviewer: cells[4],
      remainingGap: cells[5]
    });
  }
  return verdicts;
}

// The latest verdict bound to the candidate a report is asked about, or
// `null` when none names it - read fresh from the evidence log every time,
// never cached. Matched against the candidate's own resolved (full) SHA
// rather than the raw string the caller passed the report, so an abbreviated
// report candidate still finds the verdict a reviewer recorded against the
// full current HEAD it resolves to.
function latestVerdictFor(verdicts, candidate) {
  if (!candidate.resolvedSha) return null;
  for (let index = verdicts.length - 1; index >= 0; index -= 1) {
    if (verdicts[index].candidate === candidate.resolvedSha) return verdicts[index];
  }
  return null;
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
  const v = report.latestVerdict;
  lines.push(v ? `Verdict: ${v.result} at ${v.candidate} by ${v.reviewer} (${v.date})` : 'Verdict: none for this candidate');
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

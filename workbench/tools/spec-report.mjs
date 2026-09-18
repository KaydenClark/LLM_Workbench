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
// working tree, then names the candidate it was asked about, whether
// `git cat-file -e` finds it in the room's own repository, and whether the
// working tree's own HEAD equals it - so a reviewer can see when the two
// differ. It never checks out or reads a blob from the named SHA; a review
// of a moved candidate is TK-002's refusal, not this slice's.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { parseMarkdownTableRow } from './markdown-table.mjs';
import { findSpec, slicesOf } from './spec-workbench.mjs';
import { readReceiptFromFile } from './task-receipt.mjs';

const PLACEHOLDER_COMPLETION = /^pending\.?$/i;

export function assembleSpecReport(rootDir, specId, options = {}) {
  const candidateSha = options.candidate;
  if (!candidateSha) throw new Error('assembleSpecReport requires a --candidate SHA');
  const root = path.resolve(rootDir);
  const spec = findSpec(root, specId);

  const tasks = slicesOf(spec).map((slice) => taskEntry(slice));
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

// Named exactly as asked, plus whether the room's own repository has that
// object at all and whether the working tree's own HEAD is it - never a
// checkout, never a blob read at that SHA.
function candidateBinding(root, sha) {
  const headSha = gitHeadSha(root);
  return {
    sha,
    existsInRepository: gitObjectExists(root, sha),
    headSha,
    matchesHead: headSha === sha
  };
}

function gitObjectExists(root, sha) {
  const result = spawnSync('git', ['-C', root, 'cat-file', '-e', sha], { encoding: 'utf8' });
  return result.status === 0;
}

function gitHeadSha(root) {
  const result = spawnSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' });
  if (result.status !== 0) {
    const detail = (result.stderr || '').trim() || result.error?.message || 'unknown error';
    throw new Error(`git rev-parse HEAD failed in ${root}: ${detail}`);
  }
  return result.stdout.trim();
}

// Section extraction matching spec-workbench.mjs's own `section` helper: a
// heading is a `## Name` line, exact wording, and the section body runs to
// the next `## ` heading or the end of the file.
function section(content, heading) {
  const marker = `## ${heading}`;
  const start = content.indexOf(marker);
  if (start < 0) return '';
  const bodyStart = start + marker.length;
  const end = content.indexOf('\n## ', bodyStart);
  return content.slice(bodyStart, end < 0 ? content.length : end).trim();
}

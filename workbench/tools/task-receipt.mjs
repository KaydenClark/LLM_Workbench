// S-00H TK-006: the Task's append-only per-run Receipt.
//
// ADR-000H ("What a Task carries in and out") defines the Receipt as
// append-only, one row per run, recording that run's branch, HEAD SHA,
// upstream distance, dirty file count, tests run with result, docs touched
// and remaining gap. The row is appended proactively as the run proceeds, on
// the same before-interruption discipline `AGENTS.md` requires for notepads,
// not deferred until a successful `close`.
//
// The Receipt lives in the Task's own `TASK.md`, beneath a `## Receipt`
// heading, as a Markdown table. `task-record.mjs` (TK-001) parses
// `**Field:** value` lines anywhere in the body and refuses a duplicated
// field name; a Markdown table row never matches that pattern, so a Receipt
// row can never be misread as a second value for a header field such as
// `**Status:**`. This module does not change `task-record.mjs`.
//
// Append-only is enforced by a hash chain: each row's Checksum column commits
// to its own fields and the previous row's Checksum (a fixed genesis value
// seeds row 1). Reading recomputes the chain; a row whose stored fields no
// longer match its Checksum - whether hand-edited or corrupted - fails closed
// rather than being silently accepted or repaired. This guards against
// accidental edits, the same posture `notepads.mjs` takes with its revision
// guard against a stale concurrent write; it is not a defense against an
// attacker who also rewrites the checksum.

import crypto from 'node:crypto';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const RECEIPT_HEADING = '## Receipt';
const RECEIPT_COLUMNS = Object.freeze([
  'Run', 'Branch', 'HEAD SHA', 'Upstream', 'Dirty', 'Tests', 'Docs touched', 'Remaining gap', 'Checksum'
]);
const RECEIPT_HEADER_ROW = `| ${RECEIPT_COLUMNS.join(' | ')} |`;
const RECEIPT_SEPARATOR_ROW = `|${RECEIPT_COLUMNS.map(() => '---').join('|')}|`;
// Seeds the hash chain for a Task's first Receipt row. Fixed and public: this
// is tamper-evidence against an accidental or hand-made edit, not a secret.
const RECEIPT_GENESIS = 'S-00H-TK-006-receipt-genesis';

const SUPPLIED_FIELDS = ['branch', 'headSha', 'upstream', 'testsRun', 'docsTouched', 'remainingGap'];

// ---- pure content-level seam ----

// Reads every Receipt row from a Task record's full text. Returns `[]` when
// the Task has no Receipt section yet (no runs recorded), never an error.
// Throws on a structurally malformed row (wrong column count, a non-integer
// Run or Dirty value, an out-of-sequence Run number) or on a row whose
// checksum no longer matches its own recomputed chain value (an altered
// earlier row) - both fail closed rather than being silently accepted.
export function readReceipt(content, label = '<Task record>') {
  const section = extractReceiptSection(content);
  if (section === null) return [];
  const lines = section.split('\n').filter((line) => line.trim() !== '');
  if (lines[0] !== RECEIPT_HEADER_ROW || lines[1] !== RECEIPT_SEPARATOR_ROW) {
    throw new Error(`${label} has a malformed Receipt section: expected the header row and separator this module writes`);
  }
  const rows = [];
  let previousChecksum = RECEIPT_GENESIS;
  for (let i = 2; i < lines.length; i++) {
    const rowNumber = i - 1;
    const cells = splitTableRow(lines[i]);
    if (!cells || cells.length !== RECEIPT_COLUMNS.length) {
      throw new Error(`${label} Receipt row ${rowNumber} is malformed: expected ${RECEIPT_COLUMNS.length} columns`);
    }
    const [runText, branch, headSha, upstream, dirtyText, testsRun, docsTouched, remainingGap, checksum] = cells;
    const run = Number(runText);
    if (!Number.isInteger(run) || run !== rowNumber) {
      throw new Error(`${label} Receipt row ${rowNumber} is malformed: Run must read ${rowNumber} in order, found "${runText}"`);
    }
    const dirty = Number(dirtyText);
    if (!Number.isInteger(dirty) || dirty < 0) {
      throw new Error(`${label} Receipt row ${rowNumber} is malformed: Dirty must be a non-negative integer, found "${dirtyText}"`);
    }
    const expectedChecksum = rowChecksum(previousChecksum, [run, branch, headSha, upstream, dirty, testsRun, docsTouched, remainingGap]);
    if (checksum !== expectedChecksum) {
      throw new Error(`${label} Receipt row ${rowNumber} has been altered: its checksum no longer matches its recorded fields; an earlier Receipt row is never silently repaired`);
    }
    rows.push({ run, branch, headSha, upstream, dirty, testsRun, docsTouched, remainingGap, checksum });
    previousChecksum = checksum;
  }
  return rows;
}

// Appends one Receipt row to a Task record's full text and returns the new
// text. Pure: no file I/O, no Git. `fields.dirty` must be a non-negative
// integer; the rest of `fields` are the Git-derived and caller-supplied
// strings the row carries. Validates the existing section (including its
// checksum chain) before appending, so appending after an altered earlier
// row also fails closed rather than silently building on top of it.
export function appendReceiptRowToContent(content, fields, label = '<Task record>') {
  for (const name of SUPPLIED_FIELDS) {
    const value = fields[name];
    if (value === undefined || value === null || value === '') {
      throw new Error(`A Receipt row requires ${name}`);
    }
    if (String(value).includes('\n')) {
      throw new Error(`Receipt field "${name}" cannot contain a newline`);
    }
  }
  if (!Number.isInteger(fields.dirty) || fields.dirty < 0) {
    throw new Error('A Receipt row requires a non-negative integer dirty file count');
  }

  const existingRows = readReceipt(content, label); // validates the chain before we build on it
  const previousChecksum = existingRows.length ? existingRows[existingRows.length - 1].checksum : RECEIPT_GENESIS;
  const run = existingRows.length + 1;
  const { branch, headSha, upstream, dirty, testsRun, docsTouched, remainingGap } = fields;
  const checksum = rowChecksum(previousChecksum, [run, branch, headSha, upstream, dirty, testsRun, docsTouched, remainingGap]);
  const rowLine = `| ${[run, branch, headSha, upstream, dirty, testsRun, docsTouched, remainingGap, checksum].map(escapeCell).join(' | ')} |`;

  const headingIndex = content.indexOf(RECEIPT_HEADING);
  if (headingIndex === -1) {
    const trimmed = content.replace(/\s+$/, '');
    return `${trimmed}\n\n${RECEIPT_HEADING}\n\n${RECEIPT_HEADER_ROW}\n${RECEIPT_SEPARATOR_ROW}\n${rowLine}\n`;
  }
  const sectionEnd = nextSectionStart(content, headingIndex);
  const before = content.slice(0, sectionEnd).replace(/\n*$/, '\n');
  const after = content.slice(sectionEnd);
  return `${before}${rowLine}\n${after}`;
}

// ---- file and Git seam ----

export function readReceiptFromFile(taskFilePath) {
  const content = fs.readFileSync(taskFilePath, 'utf8');
  return readReceipt(content, taskFilePath);
}

// Appends one Receipt row to the Task record at `taskFilePath`, reading
// branch, HEAD SHA, upstream distance and dirty file count from Git for
// `repoRoot` (the working tree the run is executing in); `testsRun`,
// `docsTouched` and `remainingGap` are supplied by the caller. Callable
// mid-run with a partial result and an open remaining gap - nothing here
// requires a successful close. The write is atomic (write-then-rename), so a
// process that stops immediately after this call still leaves a whole,
// readable row rather than a half-written one.
export function appendReceiptRow(taskFilePath, { repoRoot, testsRun, docsTouched, remainingGap }) {
  if (!repoRoot) throw new Error('appendReceiptRow requires repoRoot: the working tree Git facts are read from');
  const git = readGitFacts(repoRoot);
  const content = fs.readFileSync(taskFilePath, 'utf8');
  const updated = appendReceiptRowToContent(content, {
    branch: git.branch,
    headSha: git.headSha,
    upstream: git.upstream,
    dirty: git.dirty,
    testsRun,
    docsTouched,
    remainingGap
  }, taskFilePath);
  atomicWrite(taskFilePath, updated);
  return readReceipt(updated, taskFilePath).at(-1);
}

// Reads branch, HEAD SHA, upstream distance (ahead/behind the tracking
// upstream, or "none" when there is no upstream) and dirty file count from
// Git for `repoRoot`. These four facts are never supplied by a caller.
export function readGitFacts(repoRoot) {
  const branch = gitRead(repoRoot, ['rev-parse', '--abbrev-ref', 'HEAD']);
  const headSha = gitRead(repoRoot, ['rev-parse', 'HEAD']);
  const upstreamRef = gitReadOptional(repoRoot, ['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}']);
  let upstream = 'none';
  if (upstreamRef) {
    const counts = gitRead(repoRoot, ['rev-list', '--left-right', '--count', 'HEAD...@{u}']);
    const [ahead, behind] = counts.split(/\s+/).map(Number);
    upstream = `ahead ${ahead} behind ${behind}`;
  }
  const statusOutput = gitRead(repoRoot, ['status', '--porcelain']);
  const dirty = statusOutput === '' ? 0 : statusOutput.split('\n').filter(Boolean).length;
  return { branch, headSha, upstream, dirty };
}

// ---- internals ----

function rowChecksum(previousChecksum, orderedFields) {
  const hash = crypto.createHash('sha256');
  hash.update(previousChecksum);
  for (const field of orderedFields) {
    hash.update(' ');
    hash.update(String(field));
  }
  return hash.digest('hex');
}

function escapeCell(value) {
  return String(value).replace(/\|/g, '\\|');
}

function splitTableRow(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith('|') || !trimmed.endsWith('|')) return null;
  const inner = trimmed.slice(1, -1);
  const cells = [];
  let current = '';
  for (let i = 0; i < inner.length; i++) {
    const char = inner[i];
    if (char === '\\' && inner[i + 1] === '|') { current += '|'; i += 1; continue; }
    if (char === '|') { cells.push(current.trim()); current = ''; continue; }
    current += char;
  }
  cells.push(current.trim());
  return cells;
}

// Returns the Receipt section's body text (excluding the heading line), or
// `null` when the Task carries no Receipt section yet.
function extractReceiptSection(content) {
  const headingIndex = content.indexOf(RECEIPT_HEADING);
  if (headingIndex === -1) return null;
  const bodyStart = content.indexOf('\n', headingIndex) + 1;
  const sectionEnd = nextSectionStart(content, headingIndex);
  return content.slice(bodyStart, sectionEnd);
}

// The index where the next `## ` heading begins after `fromIndex`, or the
// content length when the Receipt section runs to the end of the record.
function nextSectionStart(content, fromIndex) {
  const searchFrom = content.indexOf('\n', fromIndex) + 1;
  const match = /^## /m.exec(content.slice(searchFrom));
  return match ? searchFrom + match.index : content.length;
}

function gitRead(repoRoot, args) {
  const result = spawnSync('git', ['-C', repoRoot, ...args], { encoding: 'utf8' });
  if (result.status !== 0) {
    const detail = (result.stderr || '').trim() || result.error?.message || 'unknown error';
    throw new Error(`git ${args.join(' ')} failed in ${repoRoot}: ${detail}`);
  }
  return result.stdout.trim();
}

function gitReadOptional(repoRoot, args) {
  const result = spawnSync('git', ['-C', repoRoot, ...args], { encoding: 'utf8' });
  return result.status === 0 ? result.stdout.trim() : null;
}

function atomicWrite(filePath, content) {
  const temporary = `${filePath}.tmp-${process.pid}`;
  fs.writeFileSync(temporary, content);
  fs.renameSync(temporary, filePath);
}

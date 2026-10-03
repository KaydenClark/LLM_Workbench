// S-004F TK-005R: a Task a check found missed continues, with an adjusted
// handoff, instead of being replaced by a new Task (DDR-000Y). The adjusted
// handoff lives in the continued Task's own `TASK.md`, under a `## Continuation`
// heading, as an append-only Markdown table - one row per continuation, never
// a second handoff file.
//
// A table row never matches the `**Field:** value` pattern `task-record.mjs`
// reads, so a continuation can never be misread as a second value for a header
// field. The section sits beside `## Receipt` (task-receipt.mjs), which already
// stops at the next `## ` heading, so neither section swallows the other. Like
// the Receipt, this module only ever appends: no exported function rewrites or
// deletes a row, and a reader refuses a row whose number is out of sequence.
//
// The row's `Answers` cell names the exact Spec evidence row the continuation
// answers (the same wording a new corrective Task's `Planned verification`
// carries), so the Spec's append-only log and the Task's own record cite each
// other and a repeat call for an already-answered row is detectable from the
// Task alone.

import { escapeMarkdownTableCell, parseMarkdownTableRow } from './markdown-table.mjs';

const HEADING = '## Continuation';
const HEADING_PATTERN = /^## Continuation[ \t]*$/m;
const COLUMNS = Object.freeze(['Run', 'Date', 'Answers', 'Adjusted handoff']);
const HEADER_ROW = `| ${COLUMNS.join(' | ')} |`;
const SEPARATOR_ROW = `|${COLUMNS.map(() => '---').join('|')}|`;

// Every continuation row of one Task record, oldest first. A record with no
// Continuation section has none, which is never an error. A malformed table or
// an out-of-sequence run number fails closed rather than being repaired.
export function readContinuations(content, label = '<Task record>') {
  const section = extractSection(content);
  if (section === null) return [];
  const lines = section.split('\n').filter((line) => line.trim() !== '');
  if (lines[0] !== HEADER_ROW || lines[1] !== SEPARATOR_ROW) {
    throw new Error(`${label} has a malformed Continuation section: expected the header row and separator this module writes`);
  }
  const rows = [];
  for (let index = 2; index < lines.length; index += 1) {
    const number = index - 1;
    let cells;
    try { cells = parseMarkdownTableRow(lines[index]); } catch { cells = null; }
    if (!cells || cells.length !== COLUMNS.length) {
      throw new Error(`${label} Continuation row ${number} is malformed: expected ${COLUMNS.length} columns`);
    }
    const [runText, date, answers, handoff] = cells;
    if (Number(runText) !== number) {
      throw new Error(`${label} Continuation row ${number} is malformed: Run must read ${number} in order, found "${runText}"`);
    }
    rows.push({ run: number, date, answers, handoff });
  }
  return rows;
}

// Appends one continuation row, creating the section at the end of the record
// when it is absent. Pure: the caller writes the bytes. The existing section is
// validated first, so a record that already fails to read is never built on.
export function appendContinuationToContent(content, { date, answers, handoff }, label = '<Task record>') {
  for (const [name, value] of [['date', date], ['answers', answers], ['handoff', handoff]]) {
    if (typeof value !== 'string' || value.trim() === '') throw new Error(`A Continuation row requires a non-empty ${name}`);
  }
  const existing = readContinuations(content, label);
  const row = `| ${[existing.length + 1, date, answers, handoff].map((cell) => escapeMarkdownTableCell(String(cell).trim())).join(' | ')} |`;
  const headingIndex = headingIndexOf(content);
  if (headingIndex === -1) {
    const trimmed = content.replace(/\s+$/, '');
    return `${trimmed}\n\n${HEADING}\n\n${HEADER_ROW}\n${SEPARATOR_ROW}\n${row}\n`;
  }
  const sectionEnd = nextSectionStart(content, headingIndex);
  const before = content.slice(0, sectionEnd).replace(/\n*$/, '\n');
  const after = content.slice(sectionEnd);
  return after.length > 0 ? `${before}${row}\n\n${after}` : `${before}${row}\n`;
}

function headingIndexOf(content) {
  const match = HEADING_PATTERN.exec(content);
  return match ? match.index : -1;
}

function extractSection(content) {
  const headingIndex = headingIndexOf(content);
  if (headingIndex === -1) return null;
  const bodyStart = content.indexOf('\n', headingIndex) + 1;
  return content.slice(bodyStart, nextSectionStart(content, headingIndex));
}

function nextSectionStart(content, fromIndex) {
  const searchFrom = content.indexOf('\n', fromIndex) + 1;
  const match = /^## /m.exec(content.slice(searchFrom));
  return match ? searchFrom + match.index : content.length;
}

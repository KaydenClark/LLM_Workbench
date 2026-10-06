// S-00H TK-001: the standalone Task record.
//
// A Task record is its own `TASK.md`, one directory per Task beneath its
// owning Spec's directory (`<specDir>/tasks/<id>/TASK.md`), so a later
// retirement move (ADR-000I) relocates the Task's own folder without
// touching the Spec's stable declared path. This module only reads that
// record; it changes nothing about how `next`, `claim`, `close`, `render` or
// `doctor` behave against the embedded slice table in
// `workbench/tools/spec-workbench.mjs`; TK-002 migrated those
// commands, reading this module rather than changing it. A room may carry both an embedded
// table row and a standalone Task record for the same identifier; nothing
// here counts or cross-checks the two, so no reader doubles a total. TK-002
// since gave a Spec one source of slice truth at the command seam: a Spec
// with a `tasks/` directory is record-backed and its retained table is
// completed history, so the commands refuse that coexistence rather than
// read past it. This reader is still the plain record reader and enforces
// none of that.
//
// `listTaskRecords` scans exactly one directory level beneath `tasks/`:
// `<specDir>/tasks/<id>/TASK.md`. S-00I TK-004 gave the lifecycle folder that
// comment once deferred a real reader: `listRetiredTaskRecords` scans
// `<specDir>/tasks/retired/<id>/TASK.md` (ADR-000I's `TASK_LIFECYCLE_FOLDERS`)
// as the explicit historical route, while `listTaskRecords` itself still
// scans only the top level and now skips a lifecycle-folder entry there
// instead of reading it as a Task directory.
//
// TT-Q10 (the new-identifier form) is settled: Task identifiers keep the
// existing `TK-###` form (LEXICON and the grilling destination ledger), and
// this reader introduces no other prefix.

import fs from 'node:fs';
import path from 'node:path';
import { compareVisibleIds, visibleIdKey, visibleIdParts } from './visible-ids.mjs';
import { parseCapabilityList } from './optional-capabilities.mjs';
import { escapeMarkdownTableCell, parseMarkdownTableRow } from './markdown-table.mjs';

export const TASK_STATUSES = Object.freeze(['ready', 'in-progress', 'blocked', 'needs-review', 'done', 'deferred']);

// S-00I TK-004: the closed set of lifecycle subfolders a Task directory may
// move into, beneath its owning Spec's `tasks/` directory (the active
// roster `listTaskRecords` still reads unchanged at the top level).
// ADR-000I reserves permanent `archive` for ADRs alone; a Task, like its
// owning Spec (`SPEC_LIFECYCLE_FOLDERS` in spec-workbench.mjs), is a
// transient working artifact, so its one terminal folder here is the same
// transient `retired` staging area. `listTaskRecords` below skips a
// directory named for one of these folders when scanning the top level -
// it is a lifecycle folder, never a Task directory itself - so a retired
// Task never collides with the "one TASK.md per directory" rule that
// applies to every other entry.
export const TASK_LIFECYCLE_FOLDERS = Object.freeze(['retired']);
// The one closed status vocabulary for an execution slice, whether it is held
// in a Task record or in a Spec's retained slice table. TK-002 folded
// spec-workbench.mjs's own separately-named closed status set into this one,
// which that module re-exports, so a status added here is valid to both
// readers.

// The destination a Task advances is either a Spec's acceptance lines, or,
// for a corrective Task after a Spec is retired and reconciled (S-00I), a
// reconciled Wiki capability claim. This slice only needs a field that can
// hold either reference; S-00I gives `wiki-claim` its behavior.
const DESTINATION_TYPES = Object.freeze(['spec-acceptance', 'wiki-claim']);
const DESTINATION_PATTERN = /^(spec-acceptance|wiki-claim):\s*(.+)$/;
// S-00J TK-01T: a blocker entry is a plain `S-###`/`TK-###` identifier or
// that identifier with one `:<qualifier>` suffix. The parser accepts any
// word-shaped qualifier so that an unknown one reaches the resolver and
// doctor, which name it and fail closed as an unmet blocker, instead of the
// whole room failing to parse. Which qualifiers mean anything (today only
// `S-###:delivered`) is the resolver's decision in spec-workbench.mjs, not
// this reader's.
//
// S-00J TK-02J: `owner:<decision>` records a wait on an owner decision. The
// decision is a lowercase kebab-case slug. The resolver never satisfies it;
// it clears only when the entry is removed from the record.
//
// S-003Z TK-008G: a blocker may also name a landmark (`LMK-###`), which a
// reached landmark satisfies; Blockers stay a closed list of S-, TK- and LMK-
// identifiers (plus the owner decision grammar), never prose.
const BLOCKER_ID_PATTERN = /^(?:(?:S|TK|LMK)-[0-9A-Za-z]+(?::[A-Za-z][0-9A-Za-z-]*)?|owner:[a-z][a-z0-9]*(?:-[a-z0-9]+)*)$/;
// S-003Z TK-008G: a Task names exactly one parent - the Spec it sits under
// (`**Spec ID:**`) or, for a Task directly under a landmark (ADR-000U), that
// landmark (`**Landmark ID:**`). Which folder may hold which is the loaders'
// decision; this reader only refuses a record naming both or neither.
const SPEC_ID_PATTERN = /^S-[0-9A-Za-z]{3,}$/;
const LANDMARK_ID_PATTERN = /^LMK-[0-9A-Za-z]{3,}$/;

export function parseTaskRecord(content, filePath, root) {
  const label = filePath ? path.relative(root ?? path.dirname(filePath), filePath) : '<in-memory Task record>';
  const fields = {};
  for (const match of content.matchAll(/^\*\*([^*]+):\*\*\s*(.+)$/gm)) {
    const key = match[1].trim();
    // A repeated field silently last-won before this check: once TK-006
    // appends Receipt rows into the body, a second `**Status:**` line must
    // not quietly reinterpret the record. Fail closed instead.
    if (Object.prototype.hasOwnProperty.call(fields, key)) {
      throw new Error(`${label} has a duplicated field "${key}"; a Task record carries exactly one value per field`);
    }
    fields[key] = match[2].trim();
  }
  const id = fields['Task ID'];
  if (!id || !/^TK-[0-9A-Za-z]+$/.test(id)) throw new Error(`${label} has an invalid or missing Task ID`);
  const titleMatch = content.match(new RegExp(`^# ${escapeRegExp(id)} - (.+)$`, 'm'));
  if (!titleMatch) throw new Error(`${id} has no matching title`);
  const hasSpec = Object.prototype.hasOwnProperty.call(fields, 'Spec ID');
  const hasLandmark = Object.prototype.hasOwnProperty.call(fields, 'Landmark ID');
  if (hasSpec && hasLandmark) throw new Error(`${id} names both a Spec ID and a Landmark ID; a Task names exactly one of Spec ID or Landmark ID`);
  if (!hasSpec && !hasLandmark) throw new Error(`${id} is missing Spec ID or Landmark ID`);
  const required = ['Slice', 'Status', 'Blockers', 'Destination'];
  for (const name of required) if (!fields[name]) throw new Error(`${id} is missing ${name}`);
  const specId = hasSpec ? fields['Spec ID'] : null;
  const landmarkId = hasLandmark ? fields['Landmark ID'] : null;
  if (hasSpec && !SPEC_ID_PATTERN.test(specId)) throw new Error(`${id} has an invalid Spec ID: ${specId}`);
  if (hasLandmark && !LANDMARK_ID_PATTERN.test(landmarkId)) throw new Error(`${id} has an invalid Landmark ID: ${landmarkId}`);
  if (!TASK_STATUSES.includes(fields.Status)) {
    throw new Error(`${id} has an invalid status "${fields.Status}"; the closed set is ${TASK_STATUSES.join(', ')}`);
  }
  // S-00V TK-00K: the optional capabilities this Task needs beyond the host
  // floor, and the ones a session lacked when it routed the Task to blocked
  // (optional-capabilities.mjs). Both are optional fields, separate from
  // `Blockers`, which stays a closed list of `S-`/`TK-` ids. A recorded
  // missing capability must be one the Task names, on a blocked record, so
  // the record can never claim a block it does not explain.
  const capabilities = parseCapabilityList(fields.Capabilities, `${id} Capabilities`);
  const missingCapabilities = parseCapabilityList(fields['Missing capabilities'], `${id} Missing capabilities`);
  for (const name of missingCapabilities) {
    if (!capabilities.includes(name)) throw new Error(`${id} records ${name} missing but does not name it in Capabilities`);
  }
  if (missingCapabilities.length > 0 && fields.Status !== 'blocked') {
    throw new Error(`${id} records a missing capability but its Status is ${fields.Status}, not blocked`);
  }
  return {
    root,
    filePath,
    relativePath: filePath && root ? path.relative(root, filePath).split(path.sep).join('/') : null,
    content,
    id,
    // S-01W TK-002O: the spelling this record carried before `widen-id`
    // widened it, or null for a record that never widened.
    formerId: parseFormerId(fields['Former ID'], id),
    specId,
    // S-003Z TK-008G: null for a Task under a Spec; `specId` is null instead
    // for a Task directly under a landmark.
    landmarkId,
    slice: fields.Slice,
    status: fields.Status,
    blockers: parseBlockers(fields.Blockers, id),
    destination: parseDestination(fields.Destination, id),
    capabilities,
    missingCapabilities,
    // Proof is optional and absent until the Task closes. It lives on the
    // record rather than in a table cell, so a record-backed Spec has one
    // place a reader looks for what a Task proved.
    proof: fields.Proof ?? null,
    // What the Task intends to verify, carried from an unfinished slice-table
    // row at conversion. It is a plan, not evidence, and is kept in its own
    // field so no reader - the Packet TK-005 assembles above all - can present
    // it as proof of anything.
    plannedVerification: fields['Planned verification'] ?? null,
    // S-003Z TK-008H run 2: every agent that ever claimed this Task, oldest
    // first (`withClaimant`). Optional: a record no claim has touched since
    // the field arrived names nobody.
    claimedBy: parseClaimedBy(fields['Claimed by'], id)
  };
}

// S-003Z TK-008H run 2: the claimant record. `claim` writes the claiming
// agent into the Task record's own optional `**Claimed by:**` field, a
// comma-separated list that accumulates every claimant across runs (a
// continuation re-claim appends; a returning claimant is kept once). The
// parent Spec's Owner and Latest event and a landmark's Latest event are
// overwritten by the next claim or close, so the record is where the fact
// survives close, re-claim, retirement and moves; landmark participation
// (spec-report.mjs) reads it. Like Status, it is part of the record's
// reviewed bytes: a claim changes both in the same write.
export function withClaimant(claimedBy, agent) {
  const name = String(agent ?? '').trim();
  if (!name) throw new Error('A claim needs a non-empty --agent to record in Claimed by');
  if (/[\r\n]/.test(name)) throw new Error(`--agent ${JSON.stringify(name)} contains a line break; Claimed by holds one line`);
  if (name.includes(',')) throw new Error(`--agent "${name}" contains a comma; Claimed by is a comma-separated list of claimants`);
  const list = [...(claimedBy ?? [])];
  if (!list.includes(name)) list.push(name);
  return list.join(', ');
}

function parseClaimedBy(value, id) {
  if (value === undefined) return [];
  const names = value.split(',').map((item) => item.trim());
  if (names.some((item) => item === '')) throw new Error(`${id} has an empty entry in Claimed by: ${value}`);
  return names;
}

// `root` is optional and, when omitted, `relativePath` on the returned
// record is `null` rather than fabricated from `path.dirname(filePath)`: a
// record read without a declared root has no meaningful relative path, and
// guessing one would assert a location the caller never supplied.
export function readTaskRecord(filePath, root) {
  const content = fs.readFileSync(filePath, 'utf8');
  return parseTaskRecord(content, filePath, root);
}

// Discovers every standalone Task record beneath one Spec's directory. A
// Spec with no `tasks/` directory (a room with only the embedded table)
// returns an empty list rather than an error, so coexistence with a
// table-only room is silent. Every entry beneath `tasks/` is otherwise
// treated as a Task directory that must hold exactly one `TASK.md` whose
// declared Task ID matches the directory name; both a mismatch and a
// directory with no record fail closed rather than being silently skipped,
// and two records that resolve to the same visible identifier (for example
// `TK-001` and `TK-1`) are refused as a duplicate rather than both returned.
export function listTaskRecords(specDir, root) {
  const tasksDir = path.join(specDir, 'tasks');
  if (!fs.existsSync(tasksDir)) return [];
  // S-00I TK-004: a lifecycle folder (`retired`) sitting directly beneath
  // `tasks/` is skipped here rather than read as a Task directory - it is
  // where a retired Task's directory now lives, never a Task itself, so the
  // active roster silently stops naming it instead of throwing on the
  // "exactly one TASK.md per directory" rule below.
  return readRecordsFrom(tasksDir, root, { skip: TASK_LIFECYCLE_FOLDERS });
}

// S-00I TK-004: the explicit historical route, mirroring `loadRetiredSpecs`
// in spec-workbench.mjs. `listTaskRecords` above deliberately keeps reading
// only the top level of `tasks/` - the active roster `next`, `claim`,
// `close`, `receipt` and the hot board select from - so a retired Task
// never re-enters selection through a shared reading path. Returns `[]` for
// a Spec that has never retired a Task, exactly as `listRetiredSpecs` does
// for a room that has never retired a Spec, rather than treating an absent
// `tasks/retired/` directory as an error.
export function listRetiredTaskRecords(specDir, root) {
  const records = [];
  for (const folder of TASK_LIFECYCLE_FOLDERS) {
    const folderDir = path.join(specDir, 'tasks', folder);
    for (const record of readRecordsFrom(folderDir, root)) {
      records.push({ ...record, lifecycleFolder: folder });
    }
  }
  return records.sort((a, b) => compareVisibleIds(a.id, b.id));
}

// Shared by `listTaskRecords` and `listRetiredTaskRecords`: every Task
// directory one level beneath `directory` holds exactly one `TASK.md` whose
// declared Task ID matches the directory name; both a mismatch and a
// directory with no record fail closed rather than being silently skipped,
// and two records that resolve to the same visible identifier are refused
// as a duplicate rather than both returned. `skip` names entries that are
// lifecycle folders, not Task directories, at this level - never checked
// for a TASK.md at all. Returns `[]` for a directory that does not exist,
// so a caller never has to check existence first.
//
// Ordered by visible identifier, not by string comparison: `localeCompare`
// puts TK-10 ahead of TK-2, so an unpadded room would list its Tasks in an
// order no reader expects and selection would follow that order.
function readRecordsFrom(directory, root, { skip = [] } = {}) {
  if (!fs.existsSync(directory)) return [];
  const skipNames = new Set(skip);
  const records = [];
  const seenKeys = new Map();
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (skipNames.has(entry.name)) continue;
    const taskDir = path.join(directory, entry.name);
    const filePath = path.join(taskDir, 'TASK.md');
    if (!fs.existsSync(filePath)) {
      throw new Error(`${taskDir} has no TASK.md; a Task directory one level beneath tasks/ must hold exactly one record`);
    }
    const record = readTaskRecord(filePath, root);
    if (record.id !== entry.name) {
      throw new Error(`${filePath} declares Task ID "${record.id}" but its directory is named "${entry.name}"; the two must match`);
    }
    const key = visibleIdKey(record.id);
    if (seenKeys.has(key)) {
      throw new Error(`Duplicate Task ID ${record.id} beneath ${directory} conflicts with ${seenKeys.get(key)}`);
    }
    seenKeys.set(key, record.id);
    records.push(record);
  }
  return records.sort((a, b) => compareVisibleIds(a.id, b.id));
}

// Every consumer of a Task's status calls this rather than reading `.status`
// directly. Today status is frontmatter on the record; ADR-000I (proposed)
// would remove lifecycle status in favor of folder location, and this is the
// one seam that decision repoints instead of every call site.
export function taskStatus(task) {
  return task.status;
}

// The blocking relationship read: which of a Task's declared blocker ids are
// not yet in the caller-supplied satisfied set. An empty result means the
// Task is unblocked. S-01W TK-002K: ids compare by collision key, so a
// blocker spelled `TK-000A` is satisfied by a done `TK-00A`; the caller's set
// keeps its own scope, which is what keeps numeric Task labels Spec-qualified.
export function unmetBlockers(task, satisfiedIds) {
  const satisfied = new Set([...satisfiedIds].map((id) => visibleIdKey(id) ?? id));
  return task.blockers.filter((blockerId) => !satisfied.has(visibleIdKey(blockerId) ?? blockerId));
}

// Rewrites the frontmatter fields a lifecycle command owns. An existing field
// is replaced in place; a field the record does not carry yet (`Proof`, until
// the Task closes) is appended after the last field, so a record keeps one
// readable block instead of growing fields in call order. Pure: the caller
// writes the bytes, which keeps the atomic-write policy in one place.
//
// Both writes use a replacement function. A string replacement expands `$&`,
// `` $` ``, `$'` and `$$`, so a proof naming a shell variable or a regex
// group would rewrite itself against the line it replaced - closing a Task
// with `--proof "see $& output"` wrote `see **Proof:** old output`.
export function updateTaskFields(content, values) {
  let result = content;
  for (const [name, value] of Object.entries(values)) {
    const field = new RegExp(`^\\*\\*${escapeRegExp(name)}:\\*\\*\\s*.+$`, 'm');
    if (field.test(result)) {
      result = result.replace(field, () => `**${name}:** ${value}`);
      continue;
    }
    const existing = [...result.matchAll(/^\*\*[^*]+:\*\*\s*.+$/gm)];
    if (existing.length === 0) throw new Error(`A Task record with no fields at all cannot take a ${name} field`);
    const last = existing[existing.length - 1];
    const at = last.index + last[0].length;
    result = `${result.slice(0, at)}\n**${name}:** ${value}${result.slice(at)}`;
  }
  return result;
}

// The bytes one Task record is written as. Kept beside the parser so the two
// cannot drift; every caller validates the result by parsing it back before
// writing it, so a record this produces is never one the reader refuses.
export function formatTaskRecord({ id, formerId, specId, landmarkId, slice, status, blockers, destination, plannedVerification, proof, claimedBy }) {
  if (Boolean(specId) === Boolean(landmarkId)) throw new Error(`${id} needs exactly one parent: a specId or a landmarkId`);
  const lines = [
    `# ${id} - ${slice}`,
    '',
    `**Task ID:** ${id}`,
    ...(formerId ? [`**Former ID:** ${formerId}`] : []),
    specId ? `**Spec ID:** ${specId}` : `**Landmark ID:** ${landmarkId}`,
    `**Slice:** ${slice}`,
    `**Status:** ${status}`,
    `**Blockers:** ${blockers}`,
    `**Destination:** ${destination}`
  ];
  if (plannedVerification) lines.push(`**Planned verification:** ${plannedVerification}`);
  if (proof) lines.push(`**Proof:** ${proof}`);
  if (claimedBy?.length) lines.push(`**Claimed by:** ${claimedBy.join(', ')}`);
  lines.push('');
  return lines.join('\n');
}

// S-01W TK-002O: a Spec or Task record that `widen-id` widened keeps its
// previous spelling in one `**Former ID:**` header field, written directly
// under the record's own ID field. The value must be a different spelling of
// the same identity (same prefix and collision key, so `S-00Q` for `S-000Q`):
// the field records a widening, never a second or unrelated identity, and a
// record carries at most one because an identity widens once. Absent means
// the record never widened. spec-workbench.mjs reads a Spec's field through
// this same check so both record kinds share one rule.
export function parseFormerId(value, id, label = id) {
  if (value === undefined || value === null) return null;
  const former = String(value).trim();
  if (!visibleIdParts(former) || visibleIdKey(former) !== visibleIdKey(id)) {
    throw new Error(`${label} records Former ID "${former}", which is not another spelling of ${id}; the field names the same identity before widen-id widened it`);
  }
  if (former === id) throw new Error(`${label} records Former ID ${former}, which is its current ID; the field names a previous spelling`);
  return former;
}

function parseBlockers(value, id) {
  if (value === 'none') return [];
  const items = value.split(',').map((item) => item.trim()).filter(Boolean);
  for (const item of items) {
    if (!BLOCKER_ID_PATTERN.test(item)) throw new Error(`${id} has an invalid blocker id: ${item}`);
  }
  return items;
}

function parseDestination(value, id) {
  const match = DESTINATION_PATTERN.exec(value.trim());
  if (!match) {
    throw new Error(`${id} has an unreadable Destination "${value}"; expected one of ${DESTINATION_TYPES.map((type) => `"${type}: ..."`).join(' or ')}`);
  }
  const [, type, reference] = match;
  return { type, reference: reference.trim() };
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ---- S-004F TK-005R: the Continuation section --------------------------------
//
// A Task a check found missed continues, with an adjusted handoff, instead of
// being replaced by a new Task (DDR-000Y). The adjusted handoff lives in the
// continued Task's own `TASK.md`, under a `## Continuation` heading, as an
// append-only Markdown table - one row per continuation, never a second
// handoff file.
//
// A table row never matches the `**Field:** value` pattern `parseTaskRecord`
// reads, so a continuation can never be misread as a second value for a header
// field. The section sits beside `## Receipt` (task-receipt.mjs), which already
// stops at the next `## ` heading, so neither section swallows the other. Like
// the Receipt, this only ever appends: no exported function rewrites or deletes
// a row, and a reader refuses a row whose number is out of sequence.
//
// The row's `Answers` cell names the exact Spec evidence row the continuation
// answers (the same wording a new corrective Task's `Planned verification`
// carries), so the Spec's append-only log and the Task's own record cite each
// other and a repeat call for an already-answered row is detectable from the
// Task alone.

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

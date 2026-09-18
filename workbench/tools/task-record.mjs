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
// TT-Q10 (the new-identifier form, `T-###` vs `TASK-###`) is open. Fixtures
// and this reader use the existing `TK-###` form; no new prefix is
// introduced here.

import fs from 'node:fs';
import path from 'node:path';
import { compareVisibleIds, visibleIdKey } from './visible-ids.mjs';

export const TASK_STATUSES = Object.freeze(['ready', 'in-progress', 'blocked', 'done', 'deferred']);

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
const BLOCKER_ID_PATTERN = /^(?:S|TK)-[0-9A-Za-z]+$/;

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
  const required = ['Spec ID', 'Slice', 'Status', 'Blockers', 'Destination'];
  for (const name of required) if (!fields[name]) throw new Error(`${id} is missing ${name}`);
  const specId = fields['Spec ID'];
  if (!/^S-[0-9A-Za-z]{3,}$/.test(specId)) throw new Error(`${id} has an invalid Spec ID: ${specId}`);
  if (!TASK_STATUSES.includes(fields.Status)) {
    throw new Error(`${id} has an invalid status "${fields.Status}"; the closed set is ${TASK_STATUSES.join(', ')}`);
  }
  return {
    root,
    filePath,
    relativePath: filePath && root ? path.relative(root, filePath).split(path.sep).join('/') : null,
    content,
    id,
    specId,
    slice: fields.Slice,
    status: fields.Status,
    blockers: parseBlockers(fields.Blockers, id),
    destination: parseDestination(fields.Destination, id),
    // Proof is optional and absent until the Task closes. It lives on the
    // record rather than in a table cell, so a record-backed Spec has one
    // place a reader looks for what a Task proved.
    proof: fields.Proof ?? null,
    // What the Task intends to verify, carried from an unfinished slice-table
    // row at conversion. It is a plan, not evidence, and is kept in its own
    // field so no reader - the Packet TK-005 assembles above all - can present
    // it as proof of anything.
    plannedVerification: fields['Planned verification'] ?? null
  };
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
// Task is unblocked.
export function unmetBlockers(task, satisfiedIds) {
  const satisfied = satisfiedIds instanceof Set ? satisfiedIds : new Set(satisfiedIds);
  return task.blockers.filter((blockerId) => !satisfied.has(blockerId));
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
export function formatTaskRecord({ id, specId, slice, status, blockers, destination, plannedVerification, proof }) {
  const lines = [
    `# ${id} - ${slice}`,
    '',
    `**Task ID:** ${id}`,
    `**Spec ID:** ${specId}`,
    `**Slice:** ${slice}`,
    `**Status:** ${status}`,
    `**Blockers:** ${blockers}`,
    `**Destination:** ${destination}`
  ];
  if (plannedVerification) lines.push(`**Planned verification:** ${plannedVerification}`);
  if (proof) lines.push(`**Proof:** ${proof}`);
  lines.push('');
  return lines.join('\n');
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

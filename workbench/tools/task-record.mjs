// S-00H TK-001: the standalone Task record.
//
// A Task record is its own `TASK.md`, one directory per Task beneath its
// owning Spec's directory (`<specDir>/tasks/<id>/TASK.md`), so a later
// retirement move (ADR-000I) relocates the Task's own folder without
// touching the Spec's stable declared path. This module only reads that
// record; it changes nothing about how `next`, `claim`, `close`, `render` or
// `doctor` behave against the embedded `Ticket | Slice | Status | Blockers |
// Proof` table in `workbench/tools/spec-workbench.mjs` — migrating those
// commands onto Task records is TK-002. A room may carry both an embedded
// table row and a standalone Task record for the same identifier; nothing
// here counts or cross-checks the two, so no reader doubles a total.
//
// TT-Q10 (the new-identifier form, `T-###` vs `TASK-###`) is open. Fixtures
// and this reader use the existing `TK-###` form; no new prefix is
// introduced here.

import fs from 'node:fs';
import path from 'node:path';

export const TASK_STATUSES = Object.freeze(['ready', 'in-progress', 'blocked', 'done', 'deferred']);

// The destination a Task advances is either a Spec's acceptance lines, or,
// for a corrective Task after a Spec is retired and reconciled (S-00I), a
// reconciled Wiki capability claim. This slice only needs a field that can
// hold either reference; S-00I gives `wiki-claim` its behavior.
const DESTINATION_TYPES = Object.freeze(['spec-acceptance', 'wiki-claim']);
const DESTINATION_PATTERN = /^(spec-acceptance|wiki-claim):\s*(.+)$/;
const BLOCKER_ID_PATTERN = /^(?:S|TK)-[0-9A-Za-z]+$/;

export function parseTaskRecord(content, filePath, root) {
  const fields = {};
  for (const match of content.matchAll(/^\*\*([^*]+):\*\*\s*(.+)$/gm)) fields[match[1].trim()] = match[2].trim();
  const id = fields['Task ID'];
  const label = filePath ? path.relative(root ?? path.dirname(filePath), filePath) : '<in-memory Task record>';
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
    destination: parseDestination(fields.Destination, id)
  };
}

export function readTaskRecord(filePath, root) {
  const content = fs.readFileSync(filePath, 'utf8');
  return parseTaskRecord(content, filePath, root ?? path.dirname(filePath));
}

// Discovers every standalone Task record beneath one Spec's directory. A
// Spec with no `tasks/` directory (a room with only the embedded table)
// returns an empty list rather than an error, so coexistence with a
// table-only room is silent.
export function listTaskRecords(specDir, root) {
  const tasksDir = path.join(specDir, 'tasks');
  if (!fs.existsSync(tasksDir)) return [];
  const records = [];
  for (const entry of fs.readdirSync(tasksDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const filePath = path.join(tasksDir, entry.name, 'TASK.md');
    if (fs.existsSync(filePath)) records.push(readTaskRecord(filePath, root));
  }
  return records.sort((a, b) => a.id.localeCompare(b.id));
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

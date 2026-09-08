#!/usr/bin/env node
// The shared JSON notepad runtime: create, append, resume, read in bounded
// slices, and trim one objective note.
//
// A notepad is local working context, never durable evidence and never
// authority. This tool owns the structural half of that contract - schema
// validation, serialization, safe revision-checked updates, discovery, bounded
// retrieval, and dependency-preserving cleanup - so the `notepad` skill can own
// the judgment half: what is worth saving, and when it has been reconciled.
//
// Two rules shape the design. A write never destroys the previous valid file:
// every update is validated, privacy-scanned, and published through the same
// temp-then-rename path the rest of the harness uses, so an interrupted or
// refused write leaves the last good note on disk. And a read never truncates
// silently: a bounded response reports what it matched, what it returned, and
// the cursor that continues it, and it carries the corrections and declared
// dependencies of the material it selected rather than handing a reader a
// finding whose correction stayed behind.
import fs from 'node:fs';
import path from 'node:path';
import { finding } from './diagnostics.mjs';
import { assertSafeReadPath, collectionPath, collectionRelative, findRoot, isMainModule, writeSafeFile, UNTRACKED_COLLECTIONS } from './workbench-paths.mjs';
import { scanPrivacy } from './privacy.mjs';

export const NOTEPAD_SCHEMA_VERSION = 'notepad-1';
// The interim shape the scoping slice wrote by hand. It reads and migrates;
// it is never written to in place, because it carries no revision to check.
export const LEGACY_SCHEMA_VERSIONS = Object.freeze(['scope-1']);
export const DEFAULT_COLLECTION = 'grilling';

// Kinds name what a record is for a reader, not how much it is trusted. A
// label never grants authority or verifies a claim.
export const ENTRY_KINDS = Object.freeze([
  'directive', 'source_record', 'finding', 'proposal', 'decision', 'correction', 'verification', 'blocker'
]);
export const NOTE_STATUSES = Object.freeze(['PROVISIONAL', 'ACTIVE', 'BLOCKED', 'RECONCILED']);

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ENTRY_ID = /^[A-Za-z0-9]+(?:[-_][A-Za-z0-9]+)*$/;

function blocked(code, message, details) {
  return { status: 'blocked', error: finding(code, message, details) };
}

function nowStamp() {
  return new Date().toISOString();
}

function requireValue(value, message) {
  if (value === undefined || value === null || !String(value).trim()) throw new Error(message);
  return String(value).trim();
}

function asArray(value) {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value.map((item) => String(item)) : [String(value)];
}

// `--note` accepts either a bare name inside the live collection or a
// project-relative path. Both resolve to one absolute path that must stay
// inside a declared live collection: a notepad is local by contract, so a
// path escape is refused before anything is read or written.
export function resolveNote(root, value, collection = DEFAULT_COLLECTION) {
  const raw = requireValue(value, '--note is required');
  const relative = raw.includes('/') || raw.includes(path.sep) || raw.endsWith('.json')
    ? raw
    : `${collectionRelative(root, collection)}/${raw}.json`;
  const absolute = path.resolve(root, relative);
  assertSafeReadPath(root, absolute);
  const live = UNTRACKED_COLLECTIONS.map((name) => collectionPath(root, name));
  if (!live.some((directory) => absolute.startsWith(`${directory}${path.sep}`))) {
    throw new Error(`a notepad must live in a declared live collection (${UNTRACKED_COLLECTIONS.join(', ')}); ${raw} does not`);
  }
  if (path.extname(absolute) !== '.json') throw new Error(`a notepad must be a .json file; ${raw} is not`);
  return { absolute, relative: path.relative(root, absolute).split(path.sep).join('/') };
}

function readRaw(root, value, collection) {
  let resolved;
  try { resolved = resolveNote(root, value, collection); } catch (error) { return { error: blocked('invalid-note', error.message) }; }
  let text;
  try { text = fs.readFileSync(resolved.absolute, 'utf8'); } catch (error) {
    if (error.code === 'ENOENT') return { resolved, error: blocked('invalid-note', `${resolved.relative} does not exist`) };
    return { resolved, error: blocked('invalid-note', `${resolved.relative} is unreadable: ${error.message}`) };
  }
  let note;
  try { note = JSON.parse(text); } catch (error) {
    return { resolved, error: blocked('malformed-json', `${resolved.relative} is not parseable JSON: ${error.message}`) };
  }
  return { resolved, note, text };
}

// Structural validation only. It says whether a record can be read and written
// safely; it never judges whether the reasoning inside it is sufficient.
export function checkStructure(note) {
  const missing = [];
  const invalid = [];
  if (!note || typeof note !== 'object' || Array.isArray(note)) return { missing: ['note object'], invalid };
  const version = note.schema_version;
  const known = version === NOTEPAD_SCHEMA_VERSION || LEGACY_SCHEMA_VERSIONS.includes(version);
  if (!known) invalid.push(`schema_version must be ${[NOTEPAD_SCHEMA_VERSION, ...LEGACY_SCHEMA_VERSIONS].join(' or ')}`);
  for (const field of ['id', 'type', 'status', 'title', 'created_at', 'updated_at']) {
    if (typeof note[field] !== 'string' || !note[field].trim()) missing.push(field);
  }
  if (!note.objective || typeof note.objective !== 'object' || typeof note.objective.key !== 'string') missing.push('objective.key');
  if (!note.current || typeof note.current !== 'object' || typeof note.current.state !== 'string') missing.push('current.state');
  if (!Array.isArray(note.entries)) missing.push('entries');
  if (!note.extensions || typeof note.extensions !== 'object' || Array.isArray(note.extensions)) missing.push('extensions');
  if (version === NOTEPAD_SCHEMA_VERSION && (!Number.isInteger(note.revision) || note.revision < 1)) missing.push('revision');
  if (typeof note.status === 'string' && note.status && !NOTE_STATUSES.includes(note.status)) invalid.push(`status must be one of ${NOTE_STATUSES.join(', ')}`);
  if (Array.isArray(note.entries)) {
    const seen = new Set();
    for (const entry of note.entries) {
      if (!entry || typeof entry !== 'object') { invalid.push('every entry must be an object'); continue; }
      if (typeof entry.id !== 'string' || !ENTRY_ID.test(entry.id)) invalid.push(`entry id ${JSON.stringify(entry.id)} is not an identifier`);
      else if (seen.has(entry.id)) invalid.push(`entry id ${entry.id} is used twice`);
      else seen.add(entry.id);
      if (!ENTRY_KINDS.includes(entry.kind)) invalid.push(`entry ${entry.id} has kind ${JSON.stringify(entry.kind)}; supported kinds are ${ENTRY_KINDS.join(', ')}`);
      if (typeof entry.content !== 'string') invalid.push(`entry ${entry.id} has no content string`);
    }
    for (const entry of note.entries) {
      if (!entry || typeof entry !== 'object') continue;
      for (const link of [...(entry.corrects ? [entry.corrects] : []), ...asArray(entry.depends_on)]) {
        if (!seen.has(link)) invalid.push(`entry ${entry.id} references ${link}, which the note does not contain`);
      }
    }
  }
  return { missing, invalid };
}

export function validateNote(root, note, collection) {
  const loaded = readRaw(root, note, collection);
  if (loaded.error) return loaded.error;
  const { missing, invalid } = checkStructure(loaded.note);
  if (missing.length || invalid.length) {
    return blocked('invalid-note', `${loaded.resolved.relative} is not a valid notepad`, { missing, invalid });
  }
  return {
    status: 'valid',
    note: loaded.resolved.relative,
    schema_version: loaded.note.schema_version,
    revision: loaded.note.revision ?? null,
    entries: loaded.note.entries.length
  };
}

// Load a record for a write: valid, current-generation, and at the revision
// the caller says it read. Anything else refuses before touching the file.
function loadForWrite(root, options, collection) {
  const loaded = readRaw(root, options.note, collection);
  if (loaded.error) return loaded.error;
  const { missing, invalid } = checkStructure(loaded.note);
  if (missing.length || invalid.length) return blocked('invalid-note', `${loaded.resolved.relative} is not a valid notepad`, { missing, invalid });
  if (loaded.note.schema_version !== NOTEPAD_SCHEMA_VERSION) {
    return blocked('legacy-schema', `${loaded.resolved.relative} is a ${loaded.note.schema_version} record with no revision to check; migrate it first`, { schema_version: loaded.note.schema_version });
  }
  const claimed = options.revision === undefined || options.revision === null ? null : Number(options.revision);
  if (!Number.isInteger(claimed)) return blocked('stale-revision', `--revision is required; ${loaded.resolved.relative} is at revision ${loaded.note.revision}`, { revision: loaded.note.revision });
  if (claimed !== loaded.note.revision) {
    return blocked('stale-revision', `${loaded.resolved.relative} is at revision ${loaded.note.revision}, not ${claimed}; read it again before writing`, { revision: loaded.note.revision, claimed });
  }
  return loaded;
}

// New material is privacy-scanned before it can reach the file. Preserved
// history is not rescanned: an old record may legitimately quote a string the
// scanner matches, and silently redacting it would break source fidelity.
function scanNew(parts) {
  const hits = scanPrivacy(parts.filter((part) => typeof part === 'string' && part).join('\n'));
  return hits.length ? { status: 'blocked', error: finding('secret-like-content', `refused to record content matching ${[...new Set(hits.map((hit) => hit.label))].join(', ')}`), hits } : null;
}

function publish(root, resolved, note) {
  const serialized = `${JSON.stringify(note, null, 2)}\n`;
  try {
    writeSafeFile(root, resolved.absolute, serialized);
  } catch (error) {
    return blocked('write-failed', `${resolved.relative} was not updated: ${error.message}; the previous valid record is unchanged`);
  }
  return null;
}

export function createNote(root, options) {
  const collection = options.collection ?? DEFAULT_COLLECTION;
  const name = requireValue(options.note, '--note is required');
  const objective = requireValue(options.objective, '--objective is required');
  if (!SLUG.test(objective)) throw new Error('--objective must be a lowercase slug');
  const title = requireValue(options.title, '--title is required');
  const type = options.type ?? collection;
  const status = options.status ?? 'PROVISIONAL';
  if (!NOTE_STATUSES.includes(status)) throw new Error(`--status must be one of ${NOTE_STATUSES.join(', ')}`);
  let resolved;
  try { resolved = resolveNote(root, name, collection); } catch (error) { return blocked('invalid-note', error.message); }
  if (fs.existsSync(resolved.absolute)) {
    return blocked('duplicate-identity', `${resolved.relative} already exists; append to it or choose another name`);
  }
  const leak = scanNew([title, options.focus, options.state]);
  if (leak) return leak;
  const stamp = nowStamp();
  const note = {
    schema_version: NOTEPAD_SCHEMA_VERSION,
    revision: 1,
    id: options.id ?? path.basename(resolved.absolute, '.json'),
    type,
    status,
    title,
    objective: { key: objective, focus: options.focus ?? '' },
    created_at: stamp,
    updated_at: stamp,
    relationships: { index: options.index ?? null, related_notes: asArray(options.related) },
    current: { state: options.state ?? title, unresolved: asArray(options.unresolved), next_action: options['next-action'] ?? '' },
    entries: [],
    extensions: { durable_owners: [] }
  };
  const failure = publish(root, resolved, note);
  if (failure) return failure;
  return { status: 'created', note: resolved.relative, id: note.id, objective, revision: note.revision };
}

export function appendEntry(root, options) {
  const loaded = loadForWrite(root, options, options.collection);
  if (loaded.status === 'blocked') return loaded;
  const { note, resolved } = loaded;
  const kind = requireValue(options.kind, '--kind is required');
  if (!ENTRY_KINDS.includes(kind)) return blocked('invalid-note', `--kind must be one of ${ENTRY_KINDS.join(', ')}`, { kind });
  const topic = requireValue(options.topic, '--topic is required');
  const content = requireValue(options.content, '--content is required');
  const existing = new Set(note.entries.map((entry) => entry.id));
  const id = options['entry-id'] ?? `${kind}-${String(note.entries.length + 1).padStart(3, '0')}`;
  if (!ENTRY_ID.test(id)) return blocked('invalid-note', `--entry-id ${JSON.stringify(id)} is not an identifier`);
  if (existing.has(id)) return blocked('duplicate-identity', `${resolved.relative} already carries entry ${id}`, { entry: id });
  const corrects = options.corrects ?? null;
  const dependsOn = asArray(options['depends-on']);
  for (const link of [...(corrects ? [corrects] : []), ...dependsOn]) {
    if (!existing.has(link)) return blocked('invalid-note', `entry ${link} is not in ${resolved.relative}; a correction or dependency must name material the note already holds`, { entry: link });
  }
  const leak = scanNew([content, options.interpretation]);
  if (leak) return leak;
  const entry = { id, kind, topic, content, recorded_at: nowStamp() };
  if (options.interpretation) entry.interpretation = String(options.interpretation);
  if (corrects) entry.corrects = corrects;
  if (dependsOn.length) entry.depends_on = dependsOn;
  if (options['question-id']) entry.question_id = String(options['question-id']);
  if (options['source-file']) {
    entry.source = { file: String(options['source-file']) };
    if (options['source-line-start']) entry.source.line_start = Number(options['source-line-start']);
    if (options['source-line-end']) entry.source.line_end = Number(options['source-line-end']);
    if (options['source-sha256']) entry.source.sha256 = String(options['source-sha256']);
  }
  const updated = { ...note, revision: note.revision + 1, updated_at: nowStamp(), entries: [...note.entries, entry] };
  const failure = publish(root, resolved, updated);
  if (failure) return failure;
  return { status: 'appended', note: resolved.relative, entry: id, revision: updated.revision };
}

export function setCurrent(root, options) {
  const loaded = loadForWrite(root, options, options.collection);
  if (loaded.status === 'blocked') return loaded;
  const { note, resolved } = loaded;
  const state = options.state === undefined ? note.current.state : requireValue(options.state, '--state must not be empty');
  const nextAction = options['next-action'] === undefined ? (note.current.next_action ?? '') : String(options['next-action']);
  const unresolved = options.unresolved === undefined ? (note.current.unresolved ?? []) : asArray(options.unresolved);
  const status = options.status ?? note.status;
  if (!NOTE_STATUSES.includes(status)) return blocked('invalid-note', `--status must be one of ${NOTE_STATUSES.join(', ')}`, { status });
  const leak = scanNew([state, nextAction, ...unresolved]);
  if (leak) return leak;
  const updated = {
    ...note,
    revision: note.revision + 1,
    status,
    updated_at: nowStamp(),
    // Spread the stored view first: a workflow may carry its own field there
    // (grilling keeps its stable-ID question list), and an update of the state
    // must not silently drop it.
    current: { ...note.current, state, unresolved, next_action: nextAction }
  };
  const failure = publish(root, resolved, updated);
  if (failure) return failure;
  return { status: 'updated', note: resolved.relative, revision: updated.revision };
}

// Selection is the material the caller asked for; context is what that
// material cannot be read safely without - what it corrects, what it declares
// a dependency on, and any correction of anything selected. Context is marked,
// so a reader can tell what it asked for from what travelled with it.
function select(note, options) {
  const byId = new Map(note.entries.map((entry) => [entry.id, entry]));
  const wanted = new Set(asArray(options.entry));
  const topic = options.topic ? String(options.topic) : null;
  const kind = options.kind ? String(options.kind) : null;
  const matched = note.entries.filter((entry) => {
    if (wanted.size && !wanted.has(entry.id)) return false;
    if (topic && entry.topic !== topic) return false;
    if (kind && entry.kind !== kind) return false;
    return true;
  });
  const limit = options.limit === undefined || options.limit === null ? null : Number(options.limit);
  if (limit !== null && (!Number.isInteger(limit) || limit < 1)) throw new Error('--limit must be a positive integer');
  const cursor = options.cursor === undefined || options.cursor === null ? 0 : Number(options.cursor);
  if (!Number.isInteger(cursor) || cursor < 0) throw new Error('--cursor must be a non-negative integer');
  const page = limit === null ? matched.slice(cursor) : matched.slice(cursor, cursor + limit);
  const end = cursor + page.length;
  const selected = new Map(page.map((entry) => [entry.id, 'match']));
  const queue = [...page];
  while (queue.length) {
    const entry = queue.shift();
    const links = [...(entry.corrects ? [entry.corrects] : []), ...asArray(entry.depends_on)];
    for (const other of note.entries) {
      if (other.corrects === entry.id) links.push(other.id);
    }
    for (const id of links) {
      if (selected.has(id) || !byId.has(id)) continue;
      selected.set(id, 'context');
      queue.push(byId.get(id));
    }
  }
  const entries = note.entries
    .filter((entry) => selected.has(entry.id))
    .map((entry) => ({ ...entry, included_as: selected.get(entry.id) }))
    .sort((left, right) => (left.included_as === right.included_as ? 0 : left.included_as === 'match' ? -1 : 1));
  return {
    entries,
    page: {
      limit,
      cursor,
      matched: matched.length,
      returned: page.length,
      has_more: end < matched.length,
      next_cursor: end < matched.length ? end : null
    }
  };
}

export function readNote(root, options) {
  const loaded = readRaw(root, options.note, options.collection);
  if (loaded.error) return loaded.error;
  const { note, resolved } = loaded;
  const { missing, invalid } = checkStructure(note);
  if (missing.length || invalid.length) return blocked('invalid-note', `${resolved.relative} is not a valid notepad`, { missing, invalid });
  const head = {
    status: 'read',
    note: resolved.relative,
    schema_version: note.schema_version,
    revision: note.revision ?? null,
    id: note.id,
    title: note.title,
    objective: note.objective,
    note_status: note.status,
    updated_at: note.updated_at,
    current: note.current
  };
  if (options.view === 'current') return head;
  let selected;
  try { selected = select(note, options); } catch (error) { return blocked('invalid-note', error.message); }
  return { ...head, relationships: note.relationships ?? null, ...selected };
}

export function listNotes(root, options = {}) {
  const collections = options.collection ? [options.collection] : UNTRACKED_COLLECTIONS;
  const notes = [];
  const unreadable = [];
  for (const name of collections) {
    const directory = collectionPath(root, name);
    if (!fs.existsSync(directory)) continue;
    for (const file of fs.readdirSync(directory)) {
      if (!file.endsWith('.json')) continue;
      const absolute = path.join(directory, file);
      const relative = path.relative(root, absolute).split(path.sep).join('/');
      let parsed;
      try { parsed = JSON.parse(fs.readFileSync(absolute, 'utf8')); } catch { unreadable.push(relative); continue; }
      const { missing, invalid } = checkStructure(parsed);
      if (missing.length || invalid.length) { unreadable.push(relative); continue; }
      if (options.objective && parsed.objective.key !== options.objective) continue;
      notes.push({
        note: relative,
        collection: name,
        id: parsed.id,
        title: parsed.title,
        objective: parsed.objective.key,
        note_status: parsed.status,
        schema_version: parsed.schema_version,
        revision: parsed.revision ?? 0,
        updated_at: parsed.updated_at,
        mtime: fs.statSync(absolute).mtimeMs
      });
    }
  }
  // Newest-updated first: the fallback the Contract names when no explicit
  // note or objective is supplied. The reader still checks relevance.
  notes.sort((left, right) => right.updated_at.localeCompare(left.updated_at) || right.mtime - left.mtime || right.revision - left.revision);
  return { status: 'listed', notes: notes.map(({ mtime, ...rest }) => rest), unreadable };
}

export function trimEntries(root, options) {
  const loaded = loadForWrite(root, options, options.collection);
  if (loaded.status === 'blocked') return loaded;
  const { note, resolved } = loaded;
  const remove = new Set(asArray(options.entry));
  if (!remove.size) return blocked('invalid-note', '--entry is required; trim removes named reconciled material, never a whole record by default');
  const present = new Set(note.entries.map((entry) => entry.id));
  const absent = [...remove].filter((id) => !present.has(id));
  if (absent.length) return blocked('invalid-note', `${resolved.relative} does not carry ${absent.join(', ')}`, { entry: absent });
  const retained = note.entries.filter((entry) => !remove.has(entry.id));
  const stranded = [];
  for (const entry of retained) {
    for (const link of [...(entry.corrects ? [entry.corrects] : []), ...asArray(entry.depends_on)]) {
      if (remove.has(link)) stranded.push({ retained: entry.id, removed: link });
    }
  }
  if (stranded.length) {
    return blocked('retained-dependency', `${resolved.relative} keeps ${stranded.map((link) => `${link.retained} (needs ${link.removed})`).join(', ')}; trim the dependent material first or keep both`, { stranded });
  }
  const owners = new Set(asArray(note.extensions.durable_owners));
  for (const owner of asArray(options['durable-owner'])) owners.add(owner);
  const updated = {
    ...note,
    revision: note.revision + 1,
    updated_at: nowStamp(),
    entries: retained,
    extensions: { ...note.extensions, durable_owners: [...owners] }
  };
  const failure = publish(root, resolved, updated);
  if (failure) return failure;
  return { status: 'trimmed', note: resolved.relative, removed: [...remove], remaining: retained.length, revision: updated.revision };
}

// Lift an interim record onto the current schema without regenerating it: the
// recorded text, timestamps, and question routes are carried across unchanged,
// and only the fields the runtime needs to write safely are added.
export function migrateNote(root, options) {
  const loaded = readRaw(root, options.note, options.collection);
  if (loaded.error) return loaded.error;
  const { note, resolved } = loaded;
  if (note.schema_version === NOTEPAD_SCHEMA_VERSION) {
    return blocked('invalid-note', `${resolved.relative} is already a ${NOTEPAD_SCHEMA_VERSION} record`);
  }
  if (!LEGACY_SCHEMA_VERSIONS.includes(note.schema_version)) {
    return blocked('invalid-note', `${resolved.relative} declares schema_version ${JSON.stringify(note.schema_version)}; only ${LEGACY_SCHEMA_VERSIONS.join(', ')} migrate`);
  }
  const { missing, invalid } = checkStructure(note);
  if (missing.length || invalid.length) return blocked('invalid-note', `${resolved.relative} is not a valid notepad`, { missing, invalid });
  // schema_version and revision lead, as they do in a created record, so a
  // reader opening a migrated file finds the same two facts in the same place.
  const { schema_version: legacyVersion, ...carried } = note;
  const migrated = {
    schema_version: NOTEPAD_SCHEMA_VERSION,
    revision: 1,
    ...carried,
    updated_at: nowStamp(),
    relationships: note.relationships ?? { index: null, related_notes: [] },
    current: { state: note.current.state, unresolved: asArray(note.current.unresolved), next_action: note.current.next_action ?? '' },
    entries: note.entries.map((entry) => ({ ...entry, recorded_at: entry.recorded_at ?? note.created_at })),
    extensions: { durable_owners: [], ...note.extensions, migrated_from: legacyVersion }
  };
  const failure = publish(root, resolved, migrated);
  if (failure) return failure;
  return { status: 'migrated', note: resolved.relative, from: note.schema_version, revision: migrated.revision };
}

// Repeated flags collect into an array so `--entry a --entry b` and
// `--unresolved "..." --unresolved "..."` say what they mean.
const MULTI = new Set(['entry', 'unresolved', 'related', 'durable-owner', 'depends-on']);

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const options = {};
  for (let index = 0; index < rest.length; index += 1) {
    const arg = rest[index];
    if (!arg.startsWith('--')) throw new Error(`Unknown argument: ${arg}`);
    const key = arg.slice(2);
    const value = rest[++index];
    if (value === undefined) throw new Error(`--${key} needs a value`);
    if (MULTI.has(key)) options[key] = [...(options[key] ?? []), value];
    else options[key] = value;
  }
  return { command, options };
}

const USAGE = 'Usage: notepads.mjs create|append|current|read|list|validate|trim|migrate [options] (see RUNBOOK.md)';

if (isMainModule(import.meta.url)) {
  try {
    const { command, options } = parseArgs(process.argv.slice(2));
    const root = findRoot(options.path ?? process.cwd());
    let result;
    if (command === 'create') result = createNote(root, options);
    else if (command === 'append') result = appendEntry(root, options);
    else if (command === 'current') result = setCurrent(root, options);
    else if (command === 'read') result = readNote(root, options);
    else if (command === 'list') result = listNotes(root, options);
    else if (command === 'validate') result = validateNote(root, options.note, options.collection);
    else if (command === 'trim') result = trimEntries(root, options);
    else if (command === 'migrate') result = migrateNote(root, options);
    else throw new Error(USAGE);
    process.stdout.write(`${JSON.stringify(result)}\n`);
    if (result.status === 'blocked') process.exitCode = 1;
  } catch (error) {
    process.stdout.write(`${JSON.stringify({ status: 'blocked', error: { code: 'invalid-invocation', message: error.message } })}\n`);
    process.exitCode = 1;
  }
}

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
import { assertSafeReadPath, assertSafeWritePath, collectionPath, collectionRelative, findRoot, isMainModule, readManifest, writeSafeFile, UNTRACKED_COLLECTIONS } from './workbench-paths.mjs';
import { scanPrivacy } from './privacy.mjs';
import { allocateVisibleId, visibleIdKey } from './visible-ids.mjs';

export const NOTEPAD_SCHEMA_VERSION = 'notepad-1';
// The interim shape the scoping slice wrote by hand. It reads and migrates;
// it is never written to in place, because it carries no revision to check.
export const LEGACY_SCHEMA_VERSIONS = Object.freeze(['scope-1']);
export const DEFAULT_COLLECTION = 'notepads';

function defaultCollection(root) {
  return readManifest(root)?.collections?.notepads ? DEFAULT_COLLECTION : 'grilling';
}

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

// Resolve the spelling of existing ancestors as well as an existing leaf.
// A missing note under TEMPLATES must still be excluded on a case-insensitive
// filesystem. Callers check ordinary-path safety before resolving aliases.
function filesystemPath(value) {
  const missing = [];
  let current = path.resolve(value);
  for (;;) {
    // Node's JavaScript realpath preserves case aliases on macOS; the native
    // filesystem call returns the actual entry spelling on that filesystem.
    try { return path.join(fs.realpathSync.native(current), ...missing); }
    catch (error) {
      if (error.code !== 'ENOENT') throw error;
      const parent = path.dirname(current);
      if (parent === current) throw error;
      missing.unshift(path.basename(current));
      current = parent;
    }
  }
}

// `--note` accepts either a bare name inside the live collection or a
// project-relative path. Both resolve to one absolute path that must stay
// inside a declared live collection: a notepad is local by contract, so a
// path escape is refused before anything is read or written.
export function resolveNote(root, value, collection = defaultCollection(root)) {
  const raw = requireValue(value, '--note is required');
  const relative = raw.includes('/') || raw.includes(path.sep) || raw.endsWith('.json')
    ? raw
    : `${collectionRelative(root, collection)}/${collection === 'notepads' ? 'work/' : ''}${raw}.json`;
  const requested = path.resolve(root, relative);
  assertSafeReadPath(root, requested);
  const actual = filesystemPath(requested);
  const templates = filesystemPath(collectionPath(root, 'notepad-templates'));
  if (actual === templates || actual.startsWith(`${templates}${path.sep}`)) throw new Error('tracked notepad templates are not live records');
  const declared = readManifest(root)?.collections ?? {};
  const live = UNTRACKED_COLLECTIONS.filter(name => declared[name]).map((name) => filesystemPath(collectionPath(root, name)));
  if (!live.some((directory) => actual.startsWith(`${directory}${path.sep}`))) {
    throw new Error(`a notepad must live in a declared live collection (${UNTRACKED_COLLECTIONS.join(', ')}); ${raw} does not`);
  }
  if (path.extname(actual) !== '.json') throw new Error(`a notepad must be a .json file; ${raw} is not`);
  const canonicalRelative = path.relative(filesystemPath(root), actual);
  // Keep the caller's root spelling so the shared write-boundary check also
  // works when the project was reached through a platform root alias.
  return { absolute: path.resolve(root, canonicalRelative), relative: canonicalRelative.split(path.sep).join('/') };
}

function readRaw(root, value, collection, byId = false) {
  if (byId) {
    value = requireValue(value, '--id is required');
    const inventory = listNotes(root, collection ? { collection } : {});
    if (inventory.status === 'blocked') return { error: inventory };
    if (inventory.unreadable.length) return { error: blocked('invalid-note', 'Identifier lookup cannot establish uniqueness while live records are unreadable.', { unreadable: inventory.unreadable }) };
    const key = visibleIdKey(value);
    const matches = inventory.notes.filter(note => key ? visibleIdKey(note.id) === key : note.id === value);
    if (matches.length > 1) return { error: blocked('duplicate-identity', `Visible identifier ${value} is ambiguous`, { notes: matches.map(note => note.note) }) };
    if (!matches.length) return { error: blocked('invalid-note', `No note has identifier ${value}; use --note with an explicit filename/path to read a legacy named record.`) };
    value = matches[0].note;
  }
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

function readSelected(root, options, collection = options.collection) {
  if (options.id !== undefined && options.note !== undefined) return { error: blocked('invalid-note', 'Choose either --id or --note, not both') };
  return readRaw(root, options.id ?? options.note, collection, options.id !== undefined);
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

export function validateNote(root, note, collection, byId = false) {
  const loaded = readRaw(root, note, collection, byId);
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
  const loaded = readSelected(root, options, collection);
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

// Nothing reaches disk unless it would read back. A tool that validates its
// input and not its output can report success while leaving a record that can
// no longer be read, appended to, or migrated - the one-way corruption of
// history this runtime exists to prevent.
// The high-water mark each id prefix has reached, folded over whatever the
// record already remembered. Seeding it only for records this runtime created
// left every earlier record - migrated or hand-written - free to reuse an id
// after a trim, because the entries that proved the number were the ones being
// removed. Trim records the mark for what it removes, so the guarantee reaches
// records that predate the field.
const ID_PARTS = /^([a-z_]+)-(\d+)$/;

// A stored mark is data like any other, and a hand-authored record can carry
// anything. `null` means this prefix has no usable mark - either none recorded
// or a value that is not a whole number - which is different from a mark of
// zero, because an explicit `x-0` is a legitimate first use of `x`.
function markOf(sequence, prefix) {
  const stored = Number(sequence?.[prefix]);
  return Number.isInteger(stored) && stored >= 0 ? stored : null;
}

function sequenceFrom(entries, existing = {}) {
  const marks = { ...existing };
  for (const entry of entries) {
    const parts = ID_PARTS.exec(entry?.id ?? '');
    if (!parts) continue;
    marks[parts[1]] = Math.max(markOf(marks, parts[1]) ?? 0, Number(parts[2]));
  }
  return marks;
}

function publish(root, resolved, note, { exclusive = false } = {}) {
  const { missing, invalid } = checkStructure(note);
  if (missing.length || invalid.length) {
    return blocked('invalid-note', `${resolved.relative} was not updated: the result would not be a valid notepad`, { missing, invalid });
  }
  const serialized = `${JSON.stringify(note, null, 2)}\n`;
  try {
    writeSafeFile(root, resolved.absolute, serialized, { exclusive });
  } catch (error) {
    return blocked('write-failed', `${resolved.relative} was not updated: ${error.message}; the previous valid record is unchanged`);
  }
  return null;
}

// Scan decoded new fields, including nested keys and string values. Scanning
// their JSON spelling alone misses escaped paths and credentials.
function viewStrings(value) {
  if (typeof value === 'string') return [value];
  if (value === null || typeof value !== 'object') return [];
  return Object.entries(value).flatMap(([key, child]) => [key, ...viewStrings(child)]);
}

function retainedSource(root, value) {
  const parts = value.split('#');
  if (parts.length > 2 || (parts.length === 2 && !ENTRY_ID.test(parts[1]))) throw new Error('A retained source must name NOTE or NOTE#ENTRY_ID');
  const loaded = readRaw(root, parts[0]);
  if (loaded.error) throw new Error(loaded.error.error.message);
  const checked = checkStructure(loaded.note);
  if (checked.missing.length || checked.invalid.length) throw new Error('A retained source must be a valid readable note');
  if (parts[1] && !loaded.note.entries.some(entry => entry.id === parts[1])) throw new Error(`Retained entry ${parts[1]} does not exist in its source note`);
  return { note: loaded.resolved.relative, entry: parts[1] ?? null };
}

// Retention is explicit. Prose pointers and whether a claim is sufficiently
// reconciled remain agent judgment, never a guarantee manufactured by a flag.
function retentionBlocker(root, resolved, removed = null) {
  const discovery = listNotes(root);
  if (discovery.unreadable.length) return blocked('retained-dependency', 'Cleanup cannot establish retention while live records are unreadable; inspect and reconcile the named records first.', { unreadable: discovery.unreadable });
  const retainedBy = [];
  for (const item of discovery.notes) {
    if (item.note === resolved.relative) continue;
    const loaded = readRaw(root, item.note);
    if (loaded.error) return blocked('retained-dependency', 'A dependency record changed during cleanup; read it again before retrying.');
    const other = loaded.note;
    if (other.status === 'RECONCILED' && !asArray(other.current.unresolved).some(value => value.trim()) && !String(other.current.next_action ?? '').trim()) continue;
    for (const pointer of asArray(other.relationships?.retained_sources)) {
      // Retention pointers are canonical project-relative paths as stored by
      // create. Do not require their source entry to remain present to enforce
      // a pointer someone wrote before this command existed.
      const parts = pointer.split('#');
      let source;
      try { source = resolveNote(root, parts[0]); }
      catch { return blocked('retained-dependency', `Malformed retained source in ${item.note}; reconcile it before cleanup.`); }
      if (parts.length > 2 || (parts.length === 2 && !ENTRY_ID.test(parts[1]))) return blocked('retained-dependency', `Malformed retained source in ${item.note}; reconcile it before cleanup.`);
      if (source.relative === resolved.relative && (!removed || !parts[1] || removed.has(parts[1]))) retainedBy.push({ note: item.note, entry: parts[1] ?? null });
    }
  }
  return retainedBy.length ? blocked('retained-dependency', 'An active record retains this source; reconcile that destination before removing its context.', { retainedBy }) : null;
}

export function createNote(root, options) {
  const collection = options.collection ?? defaultCollection(root);
  const name = requireValue(options.note, '--note is required');
  const objective = requireValue(options.objective, '--objective is required');
  if (!SLUG.test(objective)) throw new Error('--objective must be a lowercase slug');
  const title = requireValue(options.title, '--title is required');
  // `??` accepts an empty string, so an explicitly blank --id or --type would
  // otherwise pass straight through into a record that fails its own schema.
  const type = options.type === undefined ? (collection === 'notepads' ? 'work' : collection) : requireValue(options.type, '--type must not be empty');
  const status = options.status ?? 'PROVISIONAL';
  if (!NOTE_STATUSES.includes(status)) throw new Error(`--status must be one of ${NOTE_STATUSES.join(', ')}`);
  let resolved;
  try { resolved = resolveNote(root, name, collection); } catch (error) { return blocked('invalid-note', error.message); }
  if (fs.existsSync(resolved.absolute)) {
    return blocked('duplicate-identity', `${resolved.relative} already exists; append to it or choose another name`);
  }
  const id = options.id === undefined ? path.basename(resolved.absolute, '.json') : requireValue(options.id, '--id must not be empty');
  if (visibleIdKey(id)) {
    const inventory = listNotes(root);
    if (inventory.unreadable.length) return blocked('invalid-note', 'Creation cannot establish identifier uniqueness while live records are unreadable.', { unreadable: inventory.unreadable });
    const collision = inventory.notes.find(note => visibleIdKey(note.id) === visibleIdKey(id));
    if (collision) return blocked('duplicate-identity', `Visible identifier ${id} conflicts with ${collision.id}`, { note: collision.note });
  }
  const retained = [];
  try { for (const value of asArray(options.retains)) { const source = retainedSource(root, value); retained.push(source.note + (source.entry ? `#${source.entry}` : '')); } }
  catch (error) { return blocked('invalid-note', error.message); }
  const view = parseViewFields(options['view-field']);
  const leak = scanNew([title, options.focus, options.state, options['next-action'], options.id, options.type, options.index, ...asArray(options.unresolved), ...asArray(options.related), ...asArray(options.retains), ...asArray(options['view-field']), ...viewStrings(view)]);
  if (leak) return leak;
  const stamp = nowStamp();
  const note = {
    schema_version: NOTEPAD_SCHEMA_VERSION,
    revision: 1,
    id,
    type,
    status,
    title,
    objective: { key: objective, focus: options.focus ?? '' },
    created_at: stamp,
    updated_at: stamp,
    relationships: { index: options.index ?? null, related_notes: asArray(options.related), ...(retained.length ? { retained_sources: retained } : {}) },
    current: { state: options.state ?? title, unresolved: asArray(options.unresolved), next_action: options['next-action'] ?? '', ...view },
    entries: [],
    extensions: { durable_owners: [] }
  };
  const failure = publish(root, resolved, note, { exclusive: true });
  if (failure) return failure;
  return { status: 'created', note: resolved.relative, id: note.id, objective, revision: note.revision };
}

export function allocateNote(root, options) {
  const inventory = listNotes(root);
  if (inventory.unreadable.length) return blocked('invalid-note', 'Allocation cannot establish uniqueness while live records are unreadable.', { unreadable: inventory.unreadable });
  let id;
  try {
    const prefix = requireValue(options.prefix, '--prefix is required');
    const occupied = inventory.notes.map(note => note.id);
    const destinationAliases = new Set(inventory.notes.map(note => visibleIdKey(path.basename(note.note, '.json'))).filter(Boolean));
    // A legacy filename may carry a different ID. Reserve that destination
    // spelling too, rather than repeatedly proposing a file we cannot create.
    for (;;) {
      id = allocateVisibleId(prefix, occupied);
      const destination = resolveNote(root, id, options.collection ?? defaultCollection(root));
      if (!destinationAliases.has(visibleIdKey(id)) && !fs.existsSync(destination.absolute)) break;
      occupied.push(id);
    }
  }
  catch (error) { return blocked('invalid-note', error.message); }
  return createNote(root, { ...options, id, note: id });
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
  // Count from the highest suffix this kind has ever used, not from the entry
  // count and not from the survivors alone. A trim shrinks the array, so the
  // count hands the next append an id a survivor already holds; and reading
  // only the survivors lets a trimmed id come back to name different material
  // after the original has been cited in a durable owner. The high-water mark
  // is remembered, so an id is never reused for something else.
  const sequence = note.extensions?.entry_sequence ?? {};
  const highest = note.entries.reduce((top, entry) => {
    const suffix = new RegExp(`^${kind}-(\\d+)$`).exec(entry.id);
    return suffix ? Math.max(top, Number(suffix[1])) : top;
  }, markOf(sequence, kind) ?? 0);
  const id = options['entry-id'] ?? `${kind}-${String(highest + 1).padStart(3, '0')}`;
  if (!ENTRY_ID.test(id)) return blocked('invalid-note', `--entry-id ${JSON.stringify(id)} is not an identifier`);
  if (existing.has(id)) return blocked('duplicate-identity', `${resolved.relative} already carries entry ${id}`, { entry: id });
  // The mark governs a supplied id too, not only a generated one. Consulting it
  // only when generating left `--entry-id finding-002` free to write different
  // material under an id the record itself proves was already used and trimmed -
  // which is the whole loss the mark exists to prevent, and both Runbooks state
  // the guarantee without qualifying it to generated ids.
  const parts = ID_PARTS.exec(id);
  const mark = parts ? markOf(sequence, parts[1]) : null;
  if (options['entry-id'] && parts && mark !== null && Number(parts[2]) <= mark) {
    return blocked('duplicate-identity', `${resolved.relative} has already used ${id}; ${parts[1]} has reached ${mark} and an id is never reused, so choose a higher number or let the runtime generate one`, { entry: id, mark });
  }
  const corrects = options.corrects ?? null;
  const dependsOn = asArray(options['depends-on']);
  for (const link of [...(corrects ? [corrects] : []), ...dependsOn]) {
    if (!existing.has(link)) return blocked('invalid-note', `entry ${link} is not in ${resolved.relative}; a correction or dependency must name material the note already holds`, { entry: link });
  }
  const leak = scanNew([content, options.interpretation, topic, id, options['question-id'], options['source-file'], options['source-sha256']]);
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
  // Bump from the id's own prefix, not from `--kind`: `--entry-id
  // decision-005` under `--kind finding` must advance the `decision` mark, or
  // the fifth later `decision` append reuses it.
  const suffix = /^([a-z_]+)-(\d+)$/.exec(id);
  const updated = {
    ...note,
    revision: note.revision + 1,
    updated_at: nowStamp(),
    entries: [...note.entries, entry],
    extensions: suffix
      ? { ...note.extensions, entry_sequence: { ...sequence, [suffix[1]]: Math.max(Number(sequence[suffix[1]] ?? 0), Number(suffix[2])) } }
      : note.extensions
  };
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
  const unresolved = options.unresolved === undefined ? (note.current.unresolved ?? []) : asArray(options.unresolved).filter(value => value.trim());
  const status = options.status ?? note.status;
  if (!NOTE_STATUSES.includes(status)) return blocked('invalid-note', `--status must be one of ${NOTE_STATUSES.join(', ')}`, { status });
  // Only what this call supplies is new material. Rescanning the view carried
  // forward would let one stored line refuse every later update, which is the
  // opposite of the preserved-history rule the append path follows.
  const view = parseViewFields(options['view-field']);
  const leak = scanNew([
    options.state === undefined ? null : state,
    options['next-action'] === undefined ? null : nextAction,
    ...(options.unresolved === undefined ? [] : unresolved),
    ...asArray(options['view-field']),
    ...viewStrings(view)
  ]);
  if (leak) return leak;
  const updated = {
    ...note,
    revision: note.revision + 1,
    status,
    updated_at: nowStamp(),
    // Spread the stored view first: a workflow may carry its own field there
    // (grilling keeps its stable-ID question list), and an update of the state
    // must not silently drop it.
    current: { ...note.current, state, unresolved, next_action: nextAction, ...view }
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
  const loaded = readSelected(root, options);
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
  // `--view` is refused by value the way `parseArgs` refuses a flag by name.
  // Falling through on `--view curent` would silently return the whole entry
  // history where the caller asked for the compact resume view.
  if (options.view !== undefined && options.view !== 'current') {
    return blocked('invalid-note', `--view accepts only "current"; got ${JSON.stringify(options.view)}. Omit it to read entries.`, { view: options.view });
  }
  if (options.view === 'current') return head;
  let selected;
  try { selected = select(note, options); } catch (error) { return blocked('invalid-note', error.message); }
  return { ...head, relationships: note.relationships ?? null, ...selected };
}

export function listNotes(root, options = {}) {
  // Discovery observes the same boundary every other subcommand enforces: a
  // notepad is local by contract, so a tracked collection is not a place to
  // look for one.
  if (options.collection && !UNTRACKED_COLLECTIONS.includes(options.collection)) {
    return blocked('invalid-note', `--collection must be one of ${UNTRACKED_COLLECTIONS.join(', ')}; a notepad does not live in a tracked collection`, { collection: options.collection });
  }
  const collections = options.collection ? [options.collection] : UNTRACKED_COLLECTIONS;
  const notes = [];
  const unreadable = [];
  const declared = readManifest(root)?.collections ?? {};
  const templates = collectionPath(root, 'notepad-templates');
  function walk(directory, name) {
    if (directory === templates) return;
    let files;
    try {
      assertSafeReadPath(root, directory);
      if (!fs.existsSync(directory)) return;
      files = fs.readdirSync(directory, { withFileTypes: true });
    } catch {
      unreadable.push(path.relative(root, directory).split(path.sep).join('/'));
      return;
    }
    for (const file of files) {
      const absolute = path.join(directory, file.name);
      const relative = path.relative(root, absolute).split(path.sep).join('/');
      // Never follow a link even to decide whether it contains JSON notes.
      if (file.isSymbolicLink()) { unreadable.push(relative); continue; }
      if (file.isDirectory()) { walk(absolute, name); continue; }
      if (!file.name.endsWith('.json')) continue;
      let parsed;
      try { assertSafeReadPath(root, absolute); parsed = JSON.parse(fs.readFileSync(absolute, 'utf8')); }
      catch { unreadable.push(relative); continue; }
      const { missing, invalid } = checkStructure(parsed);
      if (missing.length || invalid.length) { unreadable.push(relative); continue; }
      if (options.objective && parsed.objective.key !== options.objective) continue;
      notes.push({
        note: relative, collection: name, id: parsed.id, title: parsed.title,
        objective: parsed.objective.key, note_status: parsed.status,
        schema_version: parsed.schema_version, revision: parsed.revision ?? 0,
        created_at: parsed.created_at, updated_at: parsed.updated_at
      });
    }
  }
  for (const name of collections.filter(name => declared[name])) walk(collectionPath(root, name), name);
  // Newest-created first: the fallback the Contract names when no explicit
  // note or objective is supplied. The reader still checks relevance.
  notes.sort((left, right) => right.created_at.localeCompare(left.created_at) || left.note.localeCompare(right.note));
  return { status: 'listed', notes, unreadable };
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
  const retainedIds = new Set(retained.map((entry) => entry.id));
  const stranded = [];
  for (const entry of retained) {
    for (const link of [...(entry.corrects ? [entry.corrects] : []), ...asArray(entry.depends_on)]) {
      if (remove.has(link)) stranded.push({ retained: entry.id, removed: link, reason: 'needs' });
    }
  }
  // The link binds in both directions. Removing a correction while keeping
  // what it corrects leaves the note as the sole local record of a fact the
  // agent already knew was wrong, and a scoped read returns it with nothing
  // marking it superseded - the read path treats a correction as required
  // context for its target, so the two halves of the tool would disagree
  // about what a correction is.
  for (const entry of note.entries) {
    if (!remove.has(entry.id) || !entry.corrects) continue;
    if (retainedIds.has(entry.corrects)) stranded.push({ retained: entry.corrects, removed: entry.id, reason: 'corrected by' });
  }
  if (stranded.length) {
    return blocked('retained-dependency', `${resolved.relative} keeps ${stranded.map((link) => `${link.retained} (${link.reason} ${link.removed})`).join(', ')}; trim the linked material together or keep both`, { stranded });
  }
  const owners = new Set(asArray(note.extensions.durable_owners));
  const suppliedOwners = asArray(options['durable-owner']);
  const leak = scanNew(suppliedOwners);
  if (leak) return leak;
  for (const owner of suppliedOwners) owners.add(owner);
  const retainedElsewhere = retentionBlocker(root, resolved, remove);
  if (retainedElsewhere) return retainedElsewhere;
  const updated = {
    ...note,
    revision: note.revision + 1,
    updated_at: nowStamp(),
    entries: retained,
    extensions: {
      ...note.extensions,
      durable_owners: [...owners],
      entry_sequence: sequenceFrom(note.entries, note.extensions?.entry_sequence)
    }
  };
  const failure = publish(root, resolved, updated);
  if (failure) return failure;
  return { status: 'trimmed', note: resolved.relative, removed: [...remove], remaining: retained.length, revision: updated.revision };
}

export function deleteNote(root, options) {
  const loaded = loadForWrite(root, options, options.collection);
  if (loaded.status === 'blocked') return loaded;
  const { note, resolved } = loaded;
  if (note.status !== 'RECONCILED' || note.entries.length || asArray(note.current.unresolved).some(value => value.trim()) || String(note.current.next_action ?? '').trim()) {
    return blocked('retained-dependency', 'Whole cleanup requires RECONCILED status, no remaining entries, no unresolved items and no next action; reconcile and trim first.');
  }
  const retained = retentionBlocker(root, resolved);
  if (retained) return retained;
  try {
    assertSafeWritePath(root, resolved.absolute);
    // The runtime assumes one writer. Recheck after inspecting dependencies;
    // this catches intervening changes but is not a simultaneous-writer lock.
    if (fs.readFileSync(resolved.absolute, 'utf8') !== loaded.text) return blocked('stale-revision', 'The source changed during cleanup; read it again before retrying.');
    fs.unlinkSync(resolved.absolute);
  } catch (error) { return blocked('write-failed', `Cleanup refused: ${error.message}`); }
  return { status: 'deleted', note: resolved.relative, id: note.id, revision: note.revision };
}

// Lift an interim record onto the current schema without regenerating it: the
// recorded text, timestamps, and question routes are carried across unchanged,
// and only the fields the runtime needs to write safely are added.
export function migrateNote(root, options) {
  const loaded = readSelected(root, options);
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
  // Both fields lead, and both are destructured out of `carried` so the spread
  // cannot put a legacy value back: without that, a `scope-1` record carrying
  // its own `revision` would win and migrate to a value the schema rejects,
  // leaving a file that can no longer be read or migrated.
  const { schema_version: legacyVersion, revision: legacyRevision, ...carried } = note;
  const migrated = {
    schema_version: NOTEPAD_SCHEMA_VERSION,
    revision: 1,
    ...carried,
    updated_at: nowStamp(),
    relationships: note.relationships ?? { index: null, related_notes: [] },
    // Spread the stored view: a workflow field there is exactly what migration
    // must carry, and rebuilding from three named fields made this the one
    // lossy path in a command whose whole purpose is lifting a record without
    // losing anything. `setCurrent` has spread for the same reason since the
    // grilling question list first needed it.
    // Carried, not coerced. `asArray` stringifies, and the live scope-1
    // records keep structured owner tradeoffs in `unresolved` - objects that
    // `String()` flattens to "[object Object]", permanently and in place. The
    // round that added the spread left the coercion on top of it and tightened
    // the documented promise at the same time. The schema does not require
    // these to be strings, so migration carries whatever the record holds.
    current: { ...note.current, state: note.current.state, unresolved: note.current.unresolved ?? [], next_action: note.current.next_action ?? '' },
    entries: note.entries.map((entry) => ({ ...entry, recorded_at: entry.recorded_at ?? note.created_at })),
    // A legacy `revision` is preserved rather than dropped, because the point
    // of migration is that nothing recorded is lost on the way across.
    extensions: {
      durable_owners: [],
      ...note.extensions,
      // Appended, never replaced: a record that has migrated before keeps the
      // whole chain, and its last recorded update time is preserved rather than
      // overwritten by the migration's own stamp. Both were quietly lost in a
      // command whose comment promises nothing is.
      migrated_from: [...asArray(note.extensions?.migrated_from), legacyVersion],
      migrated_at: nowStamp(),
      ...(note.updated_at === undefined ? {} : { updated_at_before_migration: note.updated_at }),
      entry_sequence: sequenceFrom(note.entries, note.extensions?.entry_sequence),
      ...(legacyRevision === undefined ? {} : { migrated_revision: legacyRevision })
    }
  };
  const failure = publish(root, resolved, migrated);
  if (failure) return failure;
  return { status: 'migrated', note: resolved.relative, from: note.schema_version, revision: migrated.revision };
}

// Repeated flags collect into an array so `--entry a --entry b` and
// `--unresolved "..." --unresolved "..."` say what they mean.
const MULTI = new Set(['entry', 'unresolved', 'related', 'durable-owner', 'depends-on', 'view-field', 'retains']);

// What each subcommand accepts, by exact name. An unrecognised flag is a
// refusal, not something to accept and drop: `--corects finding-001` would
// otherwise exit 0 reporting a correction appended, having written an entry
// with no link at all - the same superseded-claim loss the trim guard exists
// to prevent, reached by a typo and invisible to that guard because the link
// was never recorded.
const OPTIONS = Object.freeze({
  create: ['path', 'note', 'collection', 'objective', 'title', 'focus', 'type', 'status', 'id', 'index', 'related', 'state', 'next-action', 'unresolved', 'view-field', 'retains'],
  allocate: ['path', 'prefix', 'collection', 'objective', 'title', 'focus', 'type', 'status', 'index', 'related', 'state', 'next-action', 'unresolved', 'view-field', 'retains'],
  append: ['path', 'note', 'id', 'collection', 'revision', 'kind', 'topic', 'content', 'entry-id', 'corrects', 'depends-on', 'interpretation', 'question-id', 'source-file', 'source-line-start', 'source-line-end', 'source-sha256'],
  current: ['path', 'note', 'id', 'collection', 'revision', 'state', 'next-action', 'unresolved', 'status', 'view-field'],
  read: ['path', 'note', 'id', 'collection', 'topic', 'entry', 'kind', 'limit', 'cursor', 'view'],
  list: ['path', 'collection', 'objective'],
  validate: ['path', 'note', 'id', 'collection'],
  trim: ['path', 'note', 'id', 'collection', 'revision', 'entry', 'durable-owner'],
  delete: ['path', 'note', 'id', 'collection', 'revision'],
  migrate: ['path', 'note', 'id', 'collection']
});

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const accepted = OPTIONS[command];
  if (!accepted) throw new Error(USAGE);
  const options = {};
  for (let index = 0; index < rest.length; index += 1) {
    const arg = rest[index];
    if (!arg.startsWith('--')) throw new Error(`Unknown argument: ${arg}`);
    const key = arg.slice(2);
    if (!accepted.includes(key)) throw new Error(`${command} does not accept --${key}; it accepts ${accepted.map((name) => `--${name}`).join(', ')}`);
    const value = rest[++index];
    if (value === undefined) throw new Error(`--${key} needs a value`);
    if (MULTI.has(key)) options[key] = [...(options[key] ?? []), value];
    else options[key] = value;
  }
  if (!['create', 'allocate'].includes(command) && options.id !== undefined && options.note !== undefined) throw new Error('Choose either --id or --note, not both');
  return { command, options };
}

// A workflow may keep its own field in the current view - grilling keeps its
// stable-ID question list there. `current` preserves such a field once it
// exists, but nothing could put one there in the first place, which left the
// grilling skill instructing a hand edit outside every guarantee this runtime
// makes. `--view-field name=value` is that missing path: JSON when the value
// parses as JSON, the raw string otherwise.
const RESERVED_VIEW_FIELDS = new Set(['state', 'unresolved', 'next_action']);

export function parseViewFields(values) {
  const fields = {};
  for (const raw of asArray(values)) {
    const split = String(raw).indexOf('=');
    if (split < 1) throw new Error(`--view-field must be NAME=VALUE; got ${JSON.stringify(raw)}`);
    const name = raw.slice(0, split);
    if (!/^[a-z][a-z0-9_]*$/.test(name)) throw new Error(`--view-field name ${JSON.stringify(name)} must be a lowercase identifier`);
    if (RESERVED_VIEW_FIELDS.has(name)) throw new Error(`--view-field cannot set ${name}; use its own flag`);
    const value = raw.slice(split + 1);
    try { fields[name] = JSON.parse(value); } catch { fields[name] = value; }
  }
  return fields;
}

const USAGE = 'Usage: notepads.mjs create|append|current|read|list|validate|trim|migrate|delete|allocate [options] (see RUNBOOK.md)';

if (isMainModule(import.meta.url)) {
  try {
    const { command, options } = parseArgs(process.argv.slice(2));
    const root = findRoot(options.path ?? process.cwd());
    let result;
    if (command === 'create') result = createNote(root, options);
    else if (command === 'allocate') result = allocateNote(root, options);
    else if (command === 'append') result = appendEntry(root, options);
    else if (command === 'current') result = setCurrent(root, options);
    else if (command === 'read') result = readNote(root, options);
    else if (command === 'list') result = listNotes(root, options);
    else if (command === 'validate') result = validateNote(root, options.id ?? options.note, options.collection, options.id !== undefined);
    else if (command === 'trim') result = trimEntries(root, options);
    else if (command === 'migrate') result = migrateNote(root, options);
    else if (command === 'delete') result = deleteNote(root, options);
    else throw new Error(USAGE);
    process.stdout.write(`${JSON.stringify(result)}\n`);
    if (result.status === 'blocked') process.exitCode = 1;
  } catch (error) {
    process.stdout.write(`${JSON.stringify({ status: 'blocked', error: { code: 'invalid-invocation', message: error.message } })}\n`);
    process.exitCode = 1;
  }
}

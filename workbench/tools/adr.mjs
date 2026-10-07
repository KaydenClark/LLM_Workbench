#!/usr/bin/env node
// Decision records: create, validate, and derive the register.
//
// An ADR owns rationale. Its rule binds only where `canonicalized_in` points,
// so validation checks that every named owner exists. A durable reference into
// an untracked session collection is not evidence and is reported.
//
// S-003X TK-004X: the same runtime serves both kinds of decision record
// (ADR-000S): the ADR in the `adr` collection and the Destination Decision
// Record in the `ddr` collection. A kind selects the collection, the visible
// identifier prefix, the template and the finding code; the layout, the
// folder lifecycle and the shared validation rules are one implementation.
// Every function defaults to the ADR, so existing callers are unchanged.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { finding } from './diagnostics.mjs';
import { allocateArtifactId, compareVisibleIds, visibleIdKey } from './visible-ids.mjs';
import { assertSafeReadPath, assertSafeWritePath, writeSafeFile, collectionPath, collectionRelative, findRoot, isMainModule, isSafeRelative, IGNORED_COLLECTIONS, laneRelative, liveRecordPath, markdownLinkTargets, readManifest } from './workbench-paths.mjs';

export const STATUSES = Object.freeze(['proposed', 'accepted', 'superseded', 'deprecated', 'rejected']);
export const REGISTER_NAME = 'REGISTER.md';
export const HISTORY_NAME = 'HISTORY.md';
export const ID_PATTERN = /^([0-9A-Za-z]{3,})-([a-z0-9]+(?:-[a-z0-9]+)*)\.md$/;
// S-00I: the closed set of lifecycle subfolders `listAdrs` also enumerates,
// alongside the top-level directory. Folder is lifecycle only, never
// identity - a bare filename in `superseded_by` or a link resolves against
// this whole set, not against the folder the referring record happens to sit
// in. `retired` is deliberately excluded here: ADR-000I reserves it for
// Specs and Tasks and keeps ADR history in permanent `archive` instead. TK-002
// reuses this exact constant when it migrates lifecycle out of frontmatter.
export const ADR_LIFECYCLE_FOLDERS = Object.freeze(['proposed', 'archive']);

// S-003X TK-004X: the two kinds of decision record. `invalid` is the finding
// code a kind's own validation failures carry; the other findings
// (`stale-register`, `disagreeing-status`, `untracked-provenance`) are shared.
export const RECORD_KINDS = Object.freeze({
  adr: Object.freeze({ kind: 'adr', collection: 'adr', prefix: 'ADR', invalid: 'invalid-adr' }),
  ddr: Object.freeze({ kind: 'ddr', collection: 'ddr', prefix: 'DDR', invalid: 'invalid-ddr' }),
  cdr: Object.freeze({ kind: 'cdr', collection: 'cdr', prefix: 'CDR', invalid: 'invalid-cdr' })
});

export function recordKind(kind = 'adr') {
  if (typeof kind !== 'string' || !Object.hasOwn(RECORD_KINDS, kind)) throw new Error(`--kind must be adr, ddr or cdr, not ${kind}`);
  return RECORD_KINDS[kind];
}

// The kinds whose collection directory exists in this room, ADR first. A
// command run without `--kind` acts on each of them.
export function presentKinds(root) {
  return Object.keys(RECORD_KINDS).filter((kind) => kind === 'adr' || ((kind !== 'cdr' || readManifest(root)?.collections?.cdr) && fs.existsSync(collectionPath(root, RECORD_KINDS[kind].collection))));
}

// A record is authored once and checked out on many hosts. Git for Windows
// rewrites Markdown to CRLF by default, so anchoring on a bare LF would report
// every ADR and Wiki note as frontmatter-less on those clones. Normalize the
// line terminator for parsing; the parsed body is read, never written back.
export function parseFrontmatter(content) {
  const text = content.replace(/\r\n?/g, '\n');
  if (!text.startsWith('---\n')) return { data: null, body: text };
  const end = text.indexOf('\n---\n', 4);
  if (end < 0) return { data: null, body: text };
  const data = {};
  let key = null;
  for (const line of text.slice(4, end).split('\n')) {
    const item = line.match(/^\s+-\s+(.+)$/);
    if (item && key) {
      if (!Array.isArray(data[key])) data[key] = [];
      data[key].push(item[1].trim());
      continue;
    }
    const field = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!field) continue;
    key = field[1];
    data[key] = field[2].trim() === '' ? [] : field[2].trim();
  }
  return { data, body: text.slice(end + 5) };
}

// A record is written once and checked out on many hosts. S-037 made parsing
// line-ending agnostic; a writer must be terminator-aware for the same reason,
// so a record on a CRLF clone never gains an LF-terminated key. Both helpers
// mirror `locateClosingFence`/`nativeEol` in `tools/workbench-adoption.mjs`,
// which already faced this on the adoption path.
export function locateClosingFence(content) {
  const open = content.match(/^---(\r\n|\n|\r)/);
  if (!open) return null;
  const close = content.slice(open[0].length).match(/(\r\n|\n|\r)---(?=\r\n|\n|\r|$)/);
  if (!close) return null;
  return { index: open[0].length + close.index, eol: close[1] };
}

export function nativeEol(content) {
  const match = content.match(/\r\n|\n|\r/);
  return match ? match[0] : '\n';
}

// Insert only the frontmatter keys a record is missing. A record with no
// frontmatter gains a new block above an untouched body; a record with partial
// frontmatter gains the missing lines immediately above its closing fence.
// Nothing already declared is read, reordered, or rewritten, so the failure
// mode of an automatic repair - silent content loss - cannot occur.
export function insertFrontmatterKeys(content, fields, label) {
  const parsed = parseFrontmatter(content);
  if (!parsed.data) {
    const eol = nativeEol(content);
    const block = ['---', ...fields.flatMap(([, lines]) => lines), '---', ''].join(eol);
    return { content: `${block}${eol}${content}`, inserted: fields.map(([name]) => name) };
  }
  const missing = fields.filter(([name]) => parsed.data[name] === undefined);
  if (missing.length === 0) return { content, inserted: [] };
  const fence = locateClosingFence(content);
  // parseFrontmatter found frontmatter in the terminator-normalized text, so a
  // closing fence exists here too. If it does not, the two have disagreed and
  // splicing at a guessed offset would corrupt the record.
  if (!fence) throw new Error(`${label} parsed as having frontmatter but carries no locatable closing fence.`);
  const lines = missing.flatMap(([, value]) => value);
  return { content: `${content.slice(0, fence.index)}${fence.eol}${lines.join(fence.eol)}${content.slice(fence.index)}`, inserted: missing.map(([name]) => name) };
}

// S-00I TK-002: the inverse of `insertFrontmatterKeys` for a single scalar
// key - remove it if present, touch nothing else. Line-based, like the rest
// of this file's terminator handling, so a CRLF record loses only its
// `key: value` line and gains no LF-terminated one. `status` is always a
// plain scalar line in every record this migration ever writes to, never a
// YAML list, so a single matching line is exactly what must go.
export function stripFrontmatterKey(content, key) {
  const eol = nativeEol(content);
  const lines = content.split(eol);
  if (lines[0] !== '---') return { content, removed: false };
  let closeIndex = -1;
  for (let index = 1; index < lines.length; index += 1) { if (lines[index] === '---') { closeIndex = index; break; } }
  if (closeIndex === -1) return { content, removed: false };
  const pattern = new RegExp(`^${key}:`);
  let removedIndex = -1;
  for (let index = 1; index < closeIndex; index += 1) { if (pattern.test(lines[index])) { removedIndex = index; break; } }
  if (removedIndex === -1) return { content, removed: false };
  lines.splice(removedIndex, 1);
  return { content: lines.join(eol), removed: true };
}

// S-00I TK-003 corrective: `canonicalized_in` names a repository-relative
// path directly from the project root - unlike a body Markdown link, it is
// never relative to the record's own directory, so it needs no `oldDir`/
// `newDir` recomputation, only a literal lookup in `locations` (old absolute
// path -> current absolute path) and a rewrite to the new root-relative
// value when that differs. Handles both the ordinary list form
// (`canonicalized_in:\n  - path`) and a same-line scalar
// (`canonicalized_in: path`), line-based and terminator-preserving like the
// rest of this file. A record whose `canonicalized_in` names nothing this
// caller's `locations` map covers is returned unchanged.
export function rewriteCanonicalizedIn(content, root, locations) {
  const eol = nativeEol(content);
  const lines = content.split(eol);
  if (lines[0] !== '---') return { content, count: 0 };
  let closeIndex = -1;
  for (let index = 1; index < lines.length; index += 1) { if (lines[index] === '---') { closeIndex = index; break; } }
  if (closeIndex === -1) return { content, count: 0 };
  let count = 0;
  let inBlock = false;
  const rewriteTarget = (raw) => {
    const oldAbsolute = path.resolve(root, raw);
    if (!locations.has(oldAbsolute)) return null;
    const newAbsolute = locations.get(oldAbsolute);
    const relative = path.relative(root, newAbsolute).split(path.sep).join('/');
    return relative === raw ? null : relative;
  };
  for (let index = 1; index < closeIndex; index += 1) {
    const line = lines[index];
    const keyMatch = line.match(/^canonicalized_in:\s*(.*)$/);
    if (keyMatch) {
      const scalar = keyMatch[1].trim();
      if (scalar) {
        const rewritten = rewriteTarget(scalar);
        if (rewritten) { lines[index] = `canonicalized_in: ${rewritten}`; count += 1; }
        inBlock = false;
      } else {
        inBlock = true;
      }
      continue;
    }
    if (inBlock) {
      const item = line.match(/^(\s*-\s*)(.+)$/);
      if (!item) { inBlock = false; continue; }
      const rewritten = rewriteTarget(item[2].trim());
      if (rewritten) { lines[index] = `${item[1]}${rewritten}`; count += 1; }
    }
  }
  return { content: count > 0 ? lines.join(eol) : content, count };
}

// Enumerates the top-level directory and, when present, each lifecycle
// subfolder in `ADR_LIFECYCLE_FOLDERS`. A flat collection with no subfolders
// produces exactly the same list, in the same order, as before this change -
// the top-level listing semantics `REGISTER.md`, `HISTORY.md` and `doctor`
// depend on stay byte-stable. Every record carries the folder it was actually
// read from, so a successor or a link can be resolved by identity across the
// whole set instead of by the location a caller assumed.
export function listAdrs(root, options = {}) {
  const spec = recordKind(options.kind);
  const directory = collectionPath(root, spec.collection);
  assertSafeReadPath(root, directory);
  if (!fs.existsSync(directory)) return [];
  const locations = [{ folder: null, directory }];
  for (const folder of ADR_LIFECYCLE_FOLDERS) {
    const subdirectory = path.join(directory, folder);
    if (!fs.existsSync(subdirectory)) continue;
    assertSafeReadPath(root, subdirectory);
    locations.push({ folder, directory: subdirectory });
  }
  return locations
    .flatMap(({ folder, directory: location }) => fs.readdirSync(location, { withFileTypes: true })
      .filter((entry) => ID_PATTERN.test(entry.name))
      .map((entry) => {
        const stat = fs.lstatSync(path.join(location, entry.name));
        if (!stat.isFile() || stat.isSymbolicLink() || stat.nlink > 1) {
          throw new Error(`${entry.name} must be an ordinary, singly linked ${spec.prefix} file; allocation cannot ignore an occupied identity`);
        }
        return entry;
      })
      .map((entry) => entry.name)
      .map((name) => readAdr(root, path.join(location, name), options.contentOverrides?.get(path.join(location, name)), folder, spec)))
    .sort((a, b) => compareVisibleIds(a.id, b.id) || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
}

// S-00I TK-002: a record's lifecycle is its folder, not frontmatter `status`.
// `proposed/` always implies `proposed`; `archive/` implies `superseded` or
// `deprecated`, told apart by the fact each already carries (`superseded_by`
// or `deprecation_reason`) - never by a bare "trust me" status label. Neither
// folder has a determinable implied status when it lacks that fact, and
// nothing outside those two folders (the ordinary top level, or any other
// location) carries a folder-mandated status at all: a record there keeps
// whatever it declares, or is `accepted` by default when it declares nothing.
// This is why a pre-existing flat corpus with mixed explicit statuses at the
// top level - the ordinary case before a room ever migrates - validates with
// no disagreement finding: only `proposed/` and `archive/` assert a specific
// lifecycle a leftover `status` key can disagree with.
function folderImpliedStatus(folder, data) {
  if (folder === 'proposed') return 'proposed';
  if (folder === 'archive') {
    if (typeof data?.superseded_by === 'string' && data.superseded_by.trim()) return 'superseded';
    if (typeof data?.deprecation_reason === 'string' && data.deprecation_reason.trim()) return 'deprecated';
    return null;
  }
  return null;
}

// The effective lifecycle a record carries once folder and frontmatter are
// reconciled. An explicit `status` key, when present, is never silently
// overridden by folder location - the frontmatter is what a half-migrated
// room shows a reader, so it stays the effective value even while it is
// flagged. Only its absence lets the folder speak: `proposed/` and `archive/`
// (with a determinable fact) supply their lifecycle; anywhere else defaults
// to `accepted`, the historical behavior for a record with no status key.
function deriveStatus(folder, data) {
  const implied = folderImpliedStatus(folder, data);
  const explicit = typeof data?.status === 'string' && data.status.trim() ? data.status.trim() : undefined;
  if (explicit !== undefined) {
    const disagreement = (folder === 'proposed' || folder === 'archive') && implied !== null && implied !== explicit;
    return { status: explicit, disagreement, implied };
  }
  if (folder === 'proposed' || folder === 'archive') return { status: implied, disagreement: false, implied };
  return { status: 'accepted', disagreement: false, implied };
}

function readAdr(root, filePath, content = fs.readFileSync(filePath, 'utf8'), folder = null, spec = RECORD_KINDS.adr) {
  const { data, body } = parseFrontmatter(content);
  const name = path.basename(filePath);
  const [, number, slug] = name.match(ID_PATTERN);
  const title = body.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? null;
  // `href` is the path a register/history row must link through, relative to
  // the collection root where those projections live. It equals `name` for a
  // top-level record, so a flat collection's rendered link text is unchanged.
  const href = folder ? `${folder}/${name}` : name;
  const { status, disagreement, implied } = deriveStatus(folder, data);
  return { root, filePath, relativePath: path.relative(root, filePath).split(path.sep).join('/'), kind: spec.kind, id: `${spec.prefix}-${number}`, name, number, slug, title, data, body, folder, href, status, statusDisagreement: disagreement, impliedStatus: implied };
}

export function validateAdrs(root, options = {}) {
  const spec = recordKind(options.kind);
  const code = spec.invalid;
  const findings = [];
  let adrs;
  try { adrs = listAdrs(root, options); }
  catch (error) { return [finding(code, error.message)]; }
  const adrCollectionRelative = collectionRelative(root, spec.collection);
  // S-003X TK-004X (ADR-000S point 7): a DDR's `canonicalized_in` never names
  // the Wiki, at any lifecycle. The Wiki cites decisions; it never carries one.
  const wikiRoot = spec.kind === 'ddr' ? path.resolve(root, laneRelative(root, 'wiki')) : null;
  const numbers = new Map();
  for (const adr of adrs) {
    const key = visibleIdKey(adr.id);
    const seen = numbers.get(key) ?? { number: adr.number, names: [] };
    seen.names.push(adr.name);
    numbers.set(key, seen);
    const data = adr.data;
    const detail = (extra = {}) => ({ [spec.kind]: adr.name, ...extra });
    if (!data) {
      findings.push(finding(code, `${adr.relativePath} has no frontmatter`, detail()));
      continue;
    }
    if (adr.statusDisagreement) {
      findings.push(finding('disagreeing-status', `${adr.relativePath} frontmatter status '${data.status}' disagrees with its ${adr.folder}/ folder, which implies '${adr.impliedStatus}'`, detail()));
    }
    if (!STATUSES.includes(adr.status)) findings.push(finding(code, `${adr.relativePath} status must be one of ${STATUSES.join(', ')}`, detail()));
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(data.date ?? ''))) findings.push(finding(code, `${adr.relativePath} needs a YYYY-MM-DD date`, detail()));
    if (!adr.title) findings.push(finding(code, `${adr.relativePath} needs a title heading`, detail()));
    const owners = Array.isArray(data.canonicalized_in) ? data.canonicalized_in : (data.canonicalized_in ? [data.canonicalized_in] : []);
    if (wikiRoot) {
      for (const owner of owners) {
        const target = path.resolve(root, owner);
        if (target === wikiRoot || target.startsWith(wikiRoot + path.sep)) {
          findings.push(finding(code, `${adr.relativePath} canonicalized_in names the Wiki (${owner}); a DDR's canonicalized_in never names the Wiki, which cites decisions by name and context`, detail({ owner })));
        }
      }
    }
    if (adr.status === 'accepted') {
      if (owners.length === 0) findings.push(finding(code, `${adr.relativePath} is accepted but names no canonicalized_in owner`, detail()));
      for (const owner of owners) {
        const target = path.resolve(root, owner);
        if (!target.startsWith(path.resolve(root) + path.sep) || !fs.existsSync(target)) {
          findings.push(finding(code, `${adr.relativePath} canonicalized_in target ${owner} does not exist`, detail({ owner })));
        }
      }
    }
    const lifecycleError = message => findings.push(finding(code, `${adr.relativePath} ${message}`, detail()));
    if (adr.status === 'deprecated' && (typeof data.deprecation_reason !== 'string' || !data.deprecation_reason.trim())) lifecycleError('needs a durable deprecation_reason');
    if (adr.status !== 'superseded' && data.superseded_by) lifecycleError('names a successor without superseded status');
    if (adr.status === 'superseded') {
      const seen = new Set([adr.name]);
      let current = adr;
      while (current?.status === 'superseded') {
        const successor = current.data?.superseded_by;
        if (typeof successor !== 'string' || !ID_PATTERN.test(successor) || successor.includes('/') || successor.includes('\\')) {
          lifecycleError('needs one whole-record superseded_by filename without a fragment or path'); break;
        }
        if (seen.has(successor)) { lifecycleError('has a supersession cycle'); break; }
        seen.add(successor);
        current = adrs.find(record => record.name === successor);
        if (!current) { lifecycleError(`has missing superseded_by target ${successor}`); break; }
        if (!['accepted', 'superseded', 'deprecated'].includes(current.status)) { lifecycleError('successor must be an accepted decision or its historical successor'); break; }
      }
    }
    // Reference-style and angle-bracket links are not in localLinks (it keeps
    // the literal inline form the broken-link check below needs), so live
    // records named that way are caught here (S-00V TK-02E).
    const inline = new Set(localLinks(adr.body));
    for (const link of markdownLinkTargets(adr.body)) {
      if (inline.has(link)) continue;
      const live = liveRecordPath(root, path.resolve(path.dirname(adr.filePath), link));
      if (live) findings.push(finding('untracked-provenance', `${adr.relativePath} references live record ${live}; a notepad or handoff is working context even when committed, so reconcile selected claims into a durable owner first`, detail({ target: live })));
    }
    for (const link of localLinks(adr.body)) {
      const target = path.resolve(path.dirname(adr.filePath), link);
      const relative = path.relative(root, target).split(path.sep).join('/');
      if (relative.startsWith(`${collectionRelative(root, 'notepad-templates')}/`)) continue;
      for (const collection of IGNORED_COLLECTIONS) {
        if (relative.startsWith(`${collectionRelative(root, collection)}/`)) {
          findings.push(finding('untracked-provenance', `${adr.relativePath} references live record ${relative}; a notepad or handoff is working context even when committed, so reconcile selected claims into a durable owner first`, detail({ target: relative })));
        }
      }
      // A body link is for a reader, so it is checked literally: identity
      // resolves `superseded_by` (a bare filename with no path component),
      // never a Markdown link. A record in `archive/` may correctly link
      // `../000A-...md` back to the top level, so this walks the literal
      // relative path from the record's own directory - folder-aware because
      // that directory is wherever `listAdrs` actually found the record -
      // and only within the ADR collection itself, where a moved target's
      // stale incoming link is exactly what would otherwise go unnoticed.
      if ((relative === adrCollectionRelative || relative.startsWith(`${adrCollectionRelative}/`)) && !fs.existsSync(target)) {
        findings.push(finding(code, `${adr.relativePath} links to missing ${relative}`, detail({ target: relative })));
      }
    }
  }
  for (const { number, names } of numbers.values()) {
    if (names.length > 1) findings.push(finding(code, `${spec.prefix} number ${number} is used by ${names.join(', ')}`, { number }));
  }
  const registerPath = path.join(collectionPath(root, spec.collection), REGISTER_NAME);
  if (adrs.length > 0) {
    const expected = renderRegister(adrs, { kind: spec.kind });
    const actual = fs.existsSync(registerPath) ? fs.readFileSync(registerPath, 'utf8') : null;
    if (actual === null || actual.replaceAll('\r\n', '\n') !== expected) {
      findings.push(finding('stale-register', `${collectionRelative(root, spec.collection)}/${REGISTER_NAME} is stale; run adr register`));
    }
  }
  const historyPath = path.join(collectionPath(root, spec.collection), HISTORY_NAME);
  if (adrs.length > 0) {
    const history = fs.existsSync(historyPath) ? fs.readFileSync(historyPath, 'utf8') : null;
    if (history === null || history.replaceAll('\r\n', '\n') !== renderRegister(adrs, { history: true, kind: spec.kind })) findings.push(finding('stale-register', `${collectionRelative(root, spec.collection)}/${HISTORY_NAME} is stale; run adr register`));
  }
  return findings;
}

// S-003X TK-004X: validate every decision-record collection present in the
// room (always the ADR collection; the DDR collection when it exists), as
// `validate` without `--kind` and `doctor` do.
export function validateDecisionRecords(root, options = {}) {
  return presentKinds(root).flatMap((kind) => validateAdrs(root, { ...options, kind }));
}

// Bring existing records into shape without editing a body. S-00I TK-002 made
// folder the source of lifecycle truth: a record with no `status` key is not
// an incomplete record any more, it is an ordinary migrated one (accepted at
// the top level, or whatever its `proposed`/`archive` folder implies), so
// inserting `status: proposed` here would re-add a stale, wrong key to the
// whole collection the very first time normalize ran after that migration.
// `date` is the only key this still inserts; an accepted record still needs a
// `canonicalized_in` owner only its author can name, which normalize never
// invents, so `validate` keeps failing a record that lacks one.
export function normalizeAdrs(root, options = {}) {
  const date = options.date ?? new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('--date must be YYYY-MM-DD');
  const fields = [['date', [`date: ${date}`]]];
  const changed = [];
  for (const adr of listAdrs(root, { kind: options.kind })) {
    const content = fs.readFileSync(adr.filePath, 'utf8');
    const result = insertFrontmatterKeys(content, fields, adr.relativePath);
    if (result.inserted.length === 0) continue;
    assertSafeWritePath(root, adr.filePath);
    writeSafeFile(root, adr.filePath, result.content);
    changed.push({ record: adr.relativePath, inserted: result.inserted });
  }
  return { changed };
}

export function renderRegister(adrs, { history = false, kind = 'adr' } = {}) {
  const { prefix } = recordKind(kind);
  const lines = [
    history ? `# ${prefix} History` : `# ${prefix} Register`,
    '',
    '> Derived by `adr.mjs register`; do not edit by hand. The directory listing is the source; this table is a projection.',
    '',
    history ? '[Active decisions](REGISTER.md). All retained lifecycle states follow.' : '[Complete history](HISTORY.md). Only accepted active decisions follow.',
    '',
    `| ${prefix} | Title | Status | Date | Canonicalized in |`,
    '|---|---|---|---|---|'
  ];
  for (const adr of adrs.filter(record => history || record.status === 'accepted')) {
    const owners = Array.isArray(adr.data?.canonicalized_in) ? adr.data.canonicalized_in : (adr.data?.canonicalized_in ? [adr.data.canonicalized_in] : []);
    lines.push(`| [${adr.number}](${adr.href ?? adr.name}) | ${cell(adr.title ?? '')} | ${cell(adr.status ?? '')} | ${cell(adr.data?.date ?? '')} | ${cell(owners.join(', ') || 'none')} |`);
  }
  return `${lines.join('\n')}\n`;
}

export function writeRegister(root, options = {}) {
  const spec = recordKind(options.kind);
  const registerPath = path.join(collectionPath(root, spec.collection), REGISTER_NAME);
  const historyPath = path.join(collectionPath(root, spec.collection), HISTORY_NAME);
  assertSafeWritePath(root, registerPath);
  assertSafeWritePath(root, historyPath);
  const adrs = listAdrs(root, { kind: spec.kind });
  const content = renderRegister(adrs, { kind: spec.kind });
  writeSafeFile(root, registerPath, content);
  writeSafeFile(root, historyPath, renderRegister(adrs, { history: true, kind: spec.kind }));
  return { registerPath, historyPath, count: adrs.length };
}

// S-003X TK-004X: regenerate the register and history of every decision-record
// collection that exists, so a move that rewrites links or owners leaves no
// projection stale. A room with neither collection is left alone; nothing
// here conjures a collection into existence.
export function writeDecisionRegisters(root) {
  return Object.keys(RECORD_KINDS)
    .filter((kind) => fs.existsSync(collectionPath(root, RECORD_KINDS[kind].collection)))
    .map((kind) => ({ kind, ...writeRegister(root, { kind }) }));
}

// S-01W TK-002Q: the ADR reservation inventory the artifact policy
// allocates against. Local records that alias one identity (`000A` beside
// `000a`) are refused rather than choosing a winner. Like `next-id`
// (ADR-000O), every remote-tracking tip is read too, so a label another
// pushed branch already holds is never proposed again; repeated spellings
// across tips reserve one identity. A room outside Git has no tips to read.
export function occupiedAdrLabels(root, kind = 'adr') {
  const spec = recordKind(kind);
  const labels = [];
  const local = new Map();
  for (const adr of listAdrs(root, { kind: spec.kind })) {
    const label = adr.id;
    const key = visibleIdKey(label);
    if (local.has(key)) throw new Error(`Visible identifier collision: ${label} and ${local.get(key)} alias one ${spec.prefix} identity`);
    local.set(key, label);
    labels.push(label);
  }
  const git = (...args) => spawnSync('git', ['-C', root, ...args], { encoding: 'utf8' });
  const refs = git('for-each-ref', '--format=%(refname)', 'refs/remotes');
  if (refs.status !== 0) return labels;
  const fallback = collectionRelative(root, spec.collection);
  for (const ref of refs.stdout.split('\n').filter(Boolean)) {
    let collection = fallback;
    const manifest = git('show', `${ref}:./workbench/manifest.json`);
    if (manifest.status === 0) {
      let declared;
      try { declared = JSON.parse(manifest.stdout).collections?.[spec.collection]; }
      catch { throw new Error(`Cannot reserve ${spec.prefix} labels from malformed manifest at ${ref}`); }
      // The same rule `collectionRelative` applies to the local manifest;
      // only the source differs, so a tip can never widen or redirect the scan.
      if (declared !== undefined) {
        if (!isSafeRelative(declared)) {
          const failure = new Error(`Cannot reserve ${spec.prefix} labels from unsafe ${spec.collection} collection at ${ref}: ${JSON.stringify(declared)}`);
          failure.code = 'invalid-collection';
          throw failure;
        }
        collection = declared;
      }
    }
    const listing = git('ls-tree', '-r', '-z', '--name-only', ref, '--', `${collection}/`);
    if (listing.status !== 0) throw new Error(`Cannot reserve ${spec.prefix} labels from ${ref}: ${listing.stderr.trim()}`);
    for (const file of listing.stdout.split('\0').filter(Boolean)) {
      const parts = path.posix.relative(collection, file).split('/');
      const name = parts.at(-1);
      if (parts.length > 2 || (parts.length === 2 && !ADR_LIFECYCLE_FOLDERS.includes(parts[0]))) continue;
      const match = name.match(ID_PATTERN);
      if (match) labels.push(`${spec.prefix}-${match[1]}`);
    }
  }
  return [...new Set(labels)];
}

export function newAdr(root, options) {
  const spec = recordKind(options.kind);
  const title = requireValue(options.title, '--title is required');
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (!slug) throw new Error('title must contain letters or digits');
  // S-003X TK-004X: a DDR is written only into a declared collection. A room
  // whose manifest predates the `ddr` collection gains it through the update
  // route first; writing here would conjure an undeclared directory.
  const manifest = readManifest(root);
  if (spec.kind !== 'adr' && manifest && manifest.collections?.[spec.collection] === undefined) {
    throw new Error(`the ${spec.collection} collection is not declared in workbench/manifest.json; declare it through the room's authorized layout update first`);
  }
  const directory = collectionPath(root, spec.collection);
  assertSafeWritePath(root, path.join(directory, REGISTER_NAME));
  const next = allocateArtifactId(spec.prefix, occupiedAdrLabels(root, spec.kind)).slice(spec.prefix.length + 1);
  // S-00I TK-002: a new record is always `proposed`, so it is created inside
  // the `proposed/` lifecycle folder its own status implies - folder is
  // lifecycle, so an unreviewed decision never starts out looking active. It
  // carries no `status` key at all: the folder already carries that fact, and
  // writing the key back in would let one record at a time drift the corpus
  // back toward the mixed frontmatter/folder state the one-shot
  // `migrate-folders` command does not repeatedly correct. `superseded_by`
  // and `deprecation_reason` are untouched by this - they stay frontmatter
  // facts for whichever record later needs them. (Reviewer's observation,
  // not solved here: `rejected` has no dedicated lifecycle folder yet, so a
  // record that reaches that lifecycle still needs its `status` key kept at
  // the top level - `newAdr` never creates one directly, only `proposed`.)
  const filePath = path.join(directory, 'proposed', `${next}-${slug}.md`);
  if (fs.existsSync(filePath)) throw new Error(`${filePath} already exists`);
  const date = options.date ?? new Date().toISOString().slice(0, 10);
  const content = (spec.kind === 'ddr' ? ddrTemplate : spec.kind === 'cdr' ? cdrTemplate : adrTemplate)(date, title).join('\n');
  writeSafeFile(root, filePath, content, { exclusive: true });
  return { filePath, number: next, id: `${spec.prefix}-${next}`, kind: spec.kind };
}

function adrTemplate(date, title) {
  return [
    '---',
    `date: ${date}`,
    'canonicalized_in:',
    '  - AGENTS.md',
    '---',
    '',
    `# ${title}`,
    '',
    '[The decision in one to three sentences: what is chosen and why it holds.]',
    '',
    'Considered and rejected: [the meaningful alternative and why it lost].',
    '',
    'Consequences: [what changes for tools, controls, or agents; name the control that carries the rule].',
    '',
    'Provenance: [the reconciled durable owner or preserved historical decision, by repository-relative path].',
    ''
  ];
}

// S-003X TK-004X: the DDR template is the ADR's, adapted to a destination
// choice (ADR-000S points 4 and 6): the accepted keys `date`, `supersedes` and
// `canonicalized_in`, and a free-prose body. `canonicalized_in` defaults to
// the Blueprint, the owner a destination decision most often changes; it
// never names the Wiki. How a DDR records its landmark is open (S-003Z), so
// the template carries no landmark field.
function ddrTemplate(date, title) {
  return [
    '---',
    `date: ${date}`,
    'supersedes:',
    'canonicalized_in:',
    '  - BLUEPRINT.md',
    '---',
    '',
    `# ${title}`,
    '',
    '[The destination decision in one to three sentences: what the finished product must be or do, and why the owner chose it.]',
    '',
    'Considered and rejected: [the meaningful alternative and why the owner set it aside].',
    '',
    'Consequences: [what changes in the destination; name in canonicalized_in the owners that carry it, including BLUEPRINT.md when this decision changes or contradicts the Blueprint, never the Wiki].',
    '',
    'Provenance: [the owner-confirmed source of the decision, by name, date or repository-relative path].',
    ''
  ];
}

function cdrTemplate(date, title) {
  return adrTemplate(date, title).map(line => line
    .replace('[The decision in one to three sentences: what is chosen and why it holds.]', '[One consequential choice outside architecture and destination: the choice, its scope and the underlying why.]')
    .replace('Consequences: [what changes for tools, controls, or agents; name the control that carries the rule].', 'Consequences: [what follows from this rationale, its limits and when to revisit it; name the operational owners in canonicalized_in].'));
}

export function localLinks(content) {
  const links = [];
  for (const match of content.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const value = match[1].split('#')[0];
    if (!value || /^(?:https?:|mailto:)/.test(value)) continue;
    links.push(decodeURIComponent(value));
  }
  return links;
}

// S-00I TK-002: the one-shot migration that moves lifecycle out of
// frontmatter and into folder location. It refuses a dirty tree (the moved
// candidate must be reviewable as the git-mv renames it produces) and
// refuses a second run (once every record's lifecycle already agrees with
// its folder and no leftover `status` key remains to strip, there is nothing
// left to do). `status` is stripped only for the folder-mappable lifecycles
// (`accepted`, `proposed`, `superseded`, `deprecated`); `rejected` has no
// dedicated folder in ADR_LIFECYCLE_FOLDERS and keeps its frontmatter, since
// folder cannot express what location does not distinguish.
const STATUS_TO_FOLDER = Object.freeze({ proposed: 'proposed', superseded: 'archive', deprecated: 'archive', accepted: null });

function splitLinkFragment(target) {
  const index = target.indexOf('#');
  return index === -1 ? [target, undefined] : [target.slice(0, index), target.slice(index + 1)];
}

// Rewrites every Markdown link in `content` - a file read from `oldDir`
// before this migration, now living at `newDir` - that resolves (via
// `oldDir`, so a moved referencing file's own stale relative text is
// interpreted correctly) to a path this migration tracks in `locations`
// (old absolute path -> current absolute path, including every entry that
// did not move, mapped to itself). A link to anything else - another spec, a
// wiki note, a target this migration never touched - is never matched and
// never rewritten. Exported for reuse: the logic is folder-move-generic (it
// carries no ADR-specific assumption), and S-00I TK-003 reuses this exact
// function for Spec directory moves rather than writing a second one.
export function rewriteAdrLinks(content, oldDir, newDir, locations, { directoryTargets = new Set() } = {}) {
  let count = 0;
  const updated = content.replace(/(\[[^\]]*\]\()([^)]+)(\))/g, (whole, open, target, close) => {
    if (/^(?:https?:|mailto:)/.test(target)) return whole;
    const [rawPath, fragment] = splitLinkFragment(target);
    if (!rawPath) return whole;
    let decoded;
    try { decoded = decodeURIComponent(rawPath); } catch { return whole; }
    const oldAbsolute = path.resolve(oldDir, decoded);
    if (!locations.has(oldAbsolute)) return whole;
    const newAbsolute = locations.get(oldAbsolute);
    // S-00I TK-003 corrective (round 2): a link needs recomputing only when
    // something in its own resolution actually changed - the target's
    // absolute location (`newAbsolute !== oldAbsolute`, a moved entry) or the
    // referencing file's own directory (`newDir !== oldDir`, a moved
    // referrer, whose unmoved target still needs its relative depth
    // recomputed). When neither changed, this call is scanning a file the
    // move has no reason to touch at all; recomputing anyway would still
    // "succeed" by producing a resolvable path, but a shorter or otherwise
    // differently-spelled one than the author wrote - a real-room dry run
    // renormalized an active Spec's own untouched `../S-050-.../SPEC.md`
    // self-link down to `SPEC.md` this way. Leave it exactly as written.
    if (newAbsolute === oldAbsolute && newDir === oldDir) return whole;
    const relative = path.relative(newDir, newAbsolute).split(path.sep).join('/');
    // Preserve directory-route syntax and URI encoding when recomputing a
    // moved target or referrer. In particular ./ names a directory; # alone
    // would instead name a fragment in the referencing document.
    // The option is supplied only by lifecycle moves: ADR migration and
    // identity widening retain their existing file-link formatting.
    const directory = directoryTargets.has(oldAbsolute);
    const directoryRelative = relative || '.';
    const encoded = /%[0-9a-f]{2}/i.test(rawPath)
      ? directoryRelative.split('/').map(part => encodeURIComponent(part)
        // encodeURIComponent leaves parentheses raw; Markdown uses them as delimiters.
        .replaceAll('(', '%28').replaceAll(')', '%29')).join('/') : directoryRelative;
    const route = directory ? `${encoded}${rawPath.endsWith('/') ? '/' : ''}` : relative;
    const rebuilt = fragment !== undefined ? `${route}#${fragment}` : route;
    if (rebuilt === target) return whole;
    count += 1;
    return `${open}${rebuilt}${close}`;
  });
  return { content: updated, count };
}

// Every live Markdown surface this migration must repair a moved reference
// in, outside the ADR collection itself (handled separately, since its own
// records' directories change): root controls, the Wiki, every Spec's
// `SPEC.md`, `skills/`, and `team templates/`. `templates/` (the blank
// product mirror) is deliberately excluded.
function collectExternalMarkdownFiles(root) {
  const files = [];
  for (const name of ['AGENTS.md', 'RUNBOOK.md', 'LEXICON.md', 'BLUEPRINT.md', 'TASKBOARD.md', 'README.md', 'CLAUDE.md']) {
    const file = path.join(root, name);
    if (fs.existsSync(file) && fs.statSync(file).isFile()) files.push(file);
  }
  const walk = (dir, match) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isSymbolicLink()) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full, match);
      else if (entry.isFile() && match(entry.name)) files.push(full);
    }
  };
  walk(path.join(root, 'workbench', 'wiki'), (name) => name.endsWith('.md'));
  walk(path.join(root, 'skills'), (name) => name.endsWith('.md'));
  walk(path.join(root, 'team templates'), (name) => name.endsWith('.md'));
  walk(path.join(root, 'workbench', 'specs'), (name) => name === 'SPEC.md');
  return files;
}

// A `SPEC.md`'s Append-Only Evidence And Execution Log is frozen history:
// `tools/check-append-only.py` pins each row's first-published text, and this
// migration must never rewrite a link inside one, even a stale one pointing
// at a record's pre-migration path. Split the file into the part before that
// section, the section itself (untouched), and the part after, so rewriting
// can apply to live prose on both sides without ever touching the table.
// Exported so S-00I TK-003 protects the same heading when a Spec directory
// moves, rather than a second split implementation.
export function splitEvidenceSection(content) {
  const heading = '## Append-Only Evidence And Execution Log';
  const headingIndex = content.indexOf(`\n${heading}`);
  if (headingIndex === -1) return { prefix: content, evidence: '', suffix: '' };
  const startOfHeading = headingIndex + 1;
  const rest = content.slice(startOfHeading);
  const nextHeading = rest.slice(heading.length).match(/\n## /);
  const sectionEnd = nextHeading ? heading.length + nextHeading.index + 1 : rest.length;
  return { prefix: content.slice(0, startOfHeading), evidence: rest.slice(0, sectionEnd), suffix: rest.slice(sectionEnd) };
}

export function migrateLifecycleFolders(root) {
  const directory = collectionPath(root, 'adr');
  assertSafeReadPath(root, directory);

  const gitStatus = spawnSync('git', ['-C', root, 'status', '--porcelain'], { encoding: 'utf8' });
  const usesGit = gitStatus.status === 0;
  if (usesGit && gitStatus.stdout.trim() !== '') {
    throw new Error('adr migrate-folders refuses a dirty working tree; commit or stash first so the candidate shows only this migration');
  }

  const adrs = listAdrs(root);
  const moves = [];
  const strips = [];
  for (const adr of adrs) {
    const explicit = typeof adr.data?.status === 'string' ? adr.data.status.trim() : '';
    if (!explicit || !Object.hasOwn(STATUS_TO_FOLDER, explicit)) continue;
    const impliedFolder = STATUS_TO_FOLDER[explicit];
    if (impliedFolder !== adr.folder) moves.push({ adr, toFolder: impliedFolder });
    strips.push(adr);
  }
  if (moves.length === 0 && strips.length === 0) {
    throw new Error('adr migrate-folders found nothing to migrate; the collection already reflects folder lifecycle');
  }

  // `locations` tracks every record's current absolute path, moved or not,
  // so link rewriting (inside the collection and outside it) can resolve any
  // reference against where a record actually lives right now.
  const locations = new Map(adrs.map((adr) => [adr.filePath, adr.filePath]));
  const oldDirOf = new Map(adrs.map((adr) => [adr.filePath, path.dirname(adr.filePath)]));
  const movedByFolder = {};

  for (const { adr, toFolder } of moves) {
    const destinationDir = toFolder ? path.join(directory, toFolder) : directory;
    fs.mkdirSync(destinationDir, { recursive: true });
    const destination = path.join(destinationDir, adr.name);
    assertSafeWritePath(root, destination);
    if (fs.existsSync(destination)) throw new Error(`adr migrate-folders destination already exists: ${path.relative(root, destination)}`);
    if (usesGit) {
      const result = spawnSync('git', ['-C', root, 'mv', path.relative(root, adr.filePath), path.relative(root, destination)], { encoding: 'utf8' });
      if (result.status !== 0) throw new Error(`git mv failed for ${adr.relativePath}: ${(result.stderr || result.stdout || '').trim()}`);
    } else {
      fs.renameSync(adr.filePath, destination);
    }
    locations.set(adr.filePath, destination);
    (movedByFolder[toFolder] ??= []).push(adr.relativePath);
  }

  const stripped = [];
  const referencesRewritten = {};
  for (const adr of adrs) {
    const currentPath = locations.get(adr.filePath);
    let content = fs.readFileSync(currentPath, 'utf8');
    let changed = false;
    if (strips.includes(adr)) {
      const result = stripFrontmatterKey(content, 'status');
      if (result.removed) { content = result.content; changed = true; stripped.push(adr.relativePath); }
    }
    const rewritten = rewriteAdrLinks(content, oldDirOf.get(adr.filePath), path.dirname(currentPath), locations);
    if (rewritten.count > 0) {
      content = rewritten.content;
      changed = true;
      referencesRewritten[path.relative(root, currentPath).split(path.sep).join('/')] = rewritten.count;
    }
    if (changed) { assertSafeWritePath(root, currentPath); writeSafeFile(root, currentPath, content); }
  }

  const historicalReferencesLeft = {};
  for (const file of collectExternalMarkdownFiles(root)) {
    const original = fs.readFileSync(file, 'utf8');
    const { prefix, evidence, suffix } = splitEvidenceSection(original);
    const fileDir = path.dirname(file);
    const rewrittenPrefix = rewriteAdrLinks(prefix, fileDir, fileDir, locations);
    const rewrittenSuffix = rewriteAdrLinks(suffix, fileDir, fileDir, locations);
    const skippedInEvidence = rewriteAdrLinks(evidence, fileDir, fileDir, locations).count;
    const relative = path.relative(root, file).split(path.sep).join('/');
    if (skippedInEvidence > 0) historicalReferencesLeft[relative] = skippedInEvidence;
    const totalRewritten = rewrittenPrefix.count + rewrittenSuffix.count;
    if (totalRewritten > 0) {
      const finalContent = rewrittenPrefix.content + evidence + rewrittenSuffix.content;
      assertSafeWritePath(root, file);
      writeSafeFile(root, file, finalContent);
      referencesRewritten[relative] = totalRewritten;
    }
  }

  const register = writeRegister(root);
  return { usesGit, moved: movedByFolder, stripped, referencesRewritten, historicalReferencesLeft, register };
}

// S-003X TK-004Y: one decision record addressed by its visible identifier.
// The prefix selects the kind (`ADR-...` or `DDR-...`); the value resolves
// case-folded across the collection and its lifecycle folders, as every other
// identifier does. An identifier no record carries, or one two records alias,
// fails visibly instead of choosing.
export function resolveRecord(root, id) {
  const match = /^([A-Za-z]{3})-([0-9A-Za-z]+)$/.exec(String(id ?? ''));
  const kind = match?.[1].toLowerCase();
  if (!match || !Object.hasOwn(RECORD_KINDS, kind)) throw new Error(`${id} is not a decision-record identifier; name an ADR-..., DDR-... or CDR-... record`);
  const spec = RECORD_KINDS[kind];
  const key = visibleIdKey(`${spec.prefix}-${match[2]}`);
  const hits = listAdrs(root, { kind }).filter((record) => visibleIdKey(record.id) === key);
  if (hits.length === 0) throw new Error(`Unknown ${spec.prefix} identifier: ${id}`);
  if (hits.length > 1) throw new Error(`${id} names ${hits.length} records (${hits.map((record) => record.relativePath).join(', ')}); reconcile the identity collision first`);
  return hits[0];
}

// Every live Markdown surface a decision-record move repairs a reference in:
// the root controls, the Wiki, the skills lane (and a pre-lane root
// `skills/`), `team templates/`, both decision-record collections and every
// Spec and Task record at every Spec home, plus each LANDMARK.md. Generated registers are regenerated, not rewritten;
// `templates/` is the blank product and never names this room's records.
export function collectRecordReferenceFiles(root) {
  const files = [];
  for (const name of ['AGENTS.md', 'RUNBOOK.md', 'LEXICON.md', 'BLUEPRINT.md', 'TASKBOARD.md', 'README.md', 'CLAUDE.md']) {
    const file = path.join(root, name);
    if (fs.existsSync(file) && fs.lstatSync(file).isFile()) files.push(file);
  }
  const walk = (dir, match) => {
    if (!fs.existsSync(dir)) return;
    assertSafeReadPath(root, dir);
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isSymbolicLink()) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full, match);
      else if (entry.isFile() && match(entry.name)) files.push(full);
    }
  };
  const markdown = (name) => name.endsWith('.md');
  walk(path.join(root, laneRelative(root, 'wiki')), markdown);
  walk(path.join(root, laneRelative(root, 'skills')), markdown);
  walk(path.join(root, 'skills'), markdown);
  walk(path.join(root, 'team templates'), markdown);
  for (const kind of Object.keys(RECORD_KINDS)) walk(collectionPath(root, RECORD_KINDS[kind].collection), (name) => markdown(name) && name !== REGISTER_NAME && name !== HISTORY_NAME);
  walk(path.join(root, laneRelative(root, 'specs')), (name) => name === 'SPEC.md' || name === 'TASK.md');
  // S-003Z TK-008E: every Spec nested in a landmark's `specs/` home and its
  // Task records, the landmark's own direct Task records and its LANDMARK.md,
  // whose Decision Records section links decision records.
  walk(collectionPath(root, 'landmarks'), (name) => name === 'SPEC.md' || name === 'TASK.md' || name === 'LANDMARK.md');
  return [...new Set(files)];
}

// The pure half of a reference rewrite: computes the rewritten bytes for
// `original` as the file that will live at `filePath`, records the counts in
// `totals` under that path, and returns the new content, or null when no live
// match changed. An append-only evidence section is never rewritten; its
// stale references are counted as history instead. Moved here from
// spec-workbench.mjs (S-003X TK-004Y) so the Spec, Task and decision-record
// moves share one implementation.
export function planReferenceRewrite(root, filePath, original, oldDir, newDir, locations, totals, options = {}) {
  const { prefix, evidence, suffix } = splitEvidenceSection(original);
  const canonicalized = rewriteCanonicalizedIn(prefix, root, locations);
  const rewrittenPrefix = rewriteAdrLinks(canonicalized.content, oldDir, newDir, locations, options);
  const rewrittenSuffix = rewriteAdrLinks(suffix, oldDir, newDir, locations, options);
  const skippedInEvidence = rewriteAdrLinks(evidence, oldDir, newDir, locations, options).count;
  const relative = path.relative(root, filePath).split(path.sep).join('/');
  if (skippedInEvidence > 0) totals.historicalReferencesLeft[relative] = (totals.historicalReferencesLeft[relative] ?? 0) + skippedInEvidence;
  const rewritten = rewrittenPrefix.count + rewrittenSuffix.count + canonicalized.count;
  if (rewritten === 0) return null;
  totals.referencesRewritten[relative] = (totals.referencesRewritten[relative] ?? 0) + rewritten;
  return rewrittenPrefix.content + evidence + rewrittenSuffix.content;
}

// Append one item to a frontmatter list key, creating the key when absent.
// An item already listed is left alone. A key that holds free-text prose
// instead of a list is refused rather than rewritten, because converting it
// would change what its author wrote.
export function appendFrontmatterListItem(content, key, item, label) {
  const eol = nativeEol(content);
  const lines = content.split(eol);
  if (lines[0] !== '---') throw new Error(`${label} has no frontmatter`);
  const close = lines.indexOf('---', 1);
  if (close === -1) throw new Error(`${label} has no closing frontmatter fence`);
  const keyIndex = lines.slice(1, close).findIndex((line) => new RegExp(`^${key}:`).test(line)) + 1;
  if (keyIndex === 0) return insertFrontmatterKeys(content, [[key, [`${key}:`, `  - ${item}`]]], label).content;
  const scalar = lines[keyIndex].slice(key.length + 1).trim();
  if (scalar) {
    if (scalar === item) return content;
    throw new Error(`${label} ${key} holds free text (${scalar}); make it a list before a move adds ${item}`);
  }
  let last = keyIndex;
  while (last + 1 < close && /^\s+-\s+/.test(lines[last + 1])) last += 1;
  if (lines.slice(keyIndex + 1, last + 1).some((line) => line.replace(/^\s+-\s+/, '').trim() === item)) return content;
  lines.splice(last + 1, 0, `  - ${item}`);
  return lines.join(eol);
}

function gitInRoot(root, args) {
  return spawnSync('git', ['-C', root, ...args], { encoding: 'utf8' });
}

// S-003X TK-004Y: the shared core of accept, supersede and deprecate. Every
// byte the move will write is planned and its destination checked before the
// first change; a Git room must be clean so the candidate shows only this
// move, which `git mv` records as a rename and the result is staged whole.
// Outside Git the file is renamed. Both registers are regenerated after.
function moveDecisionRecord(root, record, toFolder, edits, action, extra = {}) {
  const status = gitInRoot(root, ['status', '--porcelain']);
  const usesGit = status.status === 0;
  if (usesGit && status.stdout.trim() !== '') throw new Error(`adr ${action} refuses a dirty working tree; commit or stash first so the candidate shows only this move`);
  const spec = recordKind(record.kind);
  const directory = collectionPath(root, spec.collection);
  const destinationDir = toFolder ? path.join(directory, toFolder) : directory;
  const destination = path.join(destinationDir, record.name);
  if (fs.existsSync(destination)) throw new Error(`adr ${action} destination already exists: ${path.relative(root, destination)}`);
  const all = Object.keys(RECORD_KINDS).flatMap((kind) => fs.existsSync(collectionPath(root, RECORD_KINDS[kind].collection)) ? listAdrs(root, { kind }) : []);
  const locations = new Map(all.map((item) => [item.filePath, item.filePath]));
  locations.set(record.filePath, destination);
  const totals = { referencesRewritten: {}, historicalReferencesLeft: {} };
  const writes = new Map();
  // The moved record: its own frontmatter edit, then its outgoing links
  // recomputed for the folder it now sits in.
  let moved = edits.get(record.filePath)(fs.readFileSync(record.filePath, 'utf8'));
  moved = planReferenceRewrite(root, destination, moved, path.dirname(record.filePath), destinationDir, locations, totals) ?? moved;
  writes.set(destination, moved);
  const references = collectRecordReferenceFiles(root);
  for (const file of edits.keys()) if (!references.includes(file)) throw new Error(`internal: ${path.relative(root, file)} is edited by adr ${action} but is not a decision record`);
  for (const file of references) {
    if (file === record.filePath) continue;
    const original = fs.readFileSync(file, 'utf8');
    const edited = edits.has(file) ? edits.get(file)(original) : original;
    const rewritten = planReferenceRewrite(root, file, edited, path.dirname(file), path.dirname(file), locations, totals);
    if (rewritten !== null) writes.set(file, rewritten);
    else if (edited !== original) writes.set(file, edited);
  }
  assertSafeWritePath(root, destination);
  for (const file of writes.keys()) if (file !== destination) assertSafeWritePath(root, file);
  fs.mkdirSync(destinationDir, { recursive: true });
  if (usesGit) {
    const result = gitInRoot(root, ['mv', path.relative(root, record.filePath), path.relative(root, destination)]);
    if (result.status !== 0) throw new Error(`git mv failed for ${record.relativePath}: ${(result.stderr || result.stdout || '').trim()}`);
  } else {
    fs.renameSync(record.filePath, destination);
  }
  for (const [file, content] of writes) writeSafeFile(root, file, content);
  const registers = writeDecisionRegisters(root);
  if (usesGit) gitInRoot(root, ['add', '-A']);
  const relative = (file) => path.relative(root, file).split(path.sep).join('/');
  return { action, id: record.id, kind: record.kind, from: record.relativePath, to: relative(destination), ...extra, usesGit, referencesRewritten: totals.referencesRewritten, historicalReferencesLeft: totals.historicalReferencesLeft, registers: registers.map((item) => relative(item.registerPath)) };
}

function ownersOf(record) {
  const value = record.data?.canonicalized_in;
  return Array.isArray(value) ? value : (value ? [value] : []);
}

// What would make this record invalid once it is accepted, checked before a
// move rather than discovered by `validate` after it.
function acceptanceProblems(root, record) {
  const problems = [];
  if (!record.data) return ['has no frontmatter'];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(record.data.date ?? ''))) problems.push('needs a YYYY-MM-DD date');
  if (!record.title) problems.push('needs a title heading');
  const owners = ownersOf(record);
  if (owners.length === 0) problems.push('names no canonicalized_in owner');
  const wikiRoot = path.resolve(root, laneRelative(root, 'wiki'));
  for (const owner of owners) {
    const target = path.resolve(root, owner);
    if (!target.startsWith(path.resolve(root) + path.sep) || !fs.existsSync(target)) problems.push(`canonicalized_in target ${owner} does not exist`);
    if (record.kind === 'ddr' && (target === wikiRoot || target.startsWith(wikiRoot + path.sep))) problems.push(`canonicalized_in names the Wiki (${owner})`);
  }
  if (record.data.superseded_by || record.data.deprecation_reason) problems.push('already carries a superseded_by or deprecation_reason fact');
  return problems;
}

function requireActive(record, action) {
  if (record.folder !== null || record.status !== 'accepted') throw new Error(`${record.id} is ${record.status} in ${record.folder ? `${record.folder}/` : 'the top level'}; only an accepted record at the top level can be ${action}`);
}

// Accept: move a proposed record to the top level once its corrections are
// reconciled. A leftover `status` key is removed, because the folder is the
// lifecycle and a stale key would otherwise keep the record proposed.
export function acceptRecord(root, id) {
  const record = resolveRecord(root, id);
  if (record.folder !== 'proposed') throw new Error(`${record.id} is not in proposed/ (it is ${record.status}); only a proposed record can be accepted`);
  const problems = acceptanceProblems(root, record);
  if (problems.length) throw new Error(`${record.id} cannot be accepted: it ${problems.join('; ')}`);
  const edits = new Map([[record.filePath, (content) => stripFrontmatterKey(content, 'status').content]]);
  return moveDecisionRecord(root, record, null, edits, 'accept');
}

// Supersede: one accepted record of the same kind replaces another whole. The
// replaced record names its successor and moves to the permanent archive; the
// successor lists what it supersedes.
export function supersedeRecord(root, id, successors) {
  const named = (Array.isArray(successors) ? successors : (successors === undefined ? [] : [successors])).flatMap((value) => String(value).split(/[\s,]+/)).filter(Boolean);
  if (named.length !== 1) throw new Error(`supersede needs exactly one successor named with --by; got ${named.length ? named.join(', ') : 'none'}`);
  const record = resolveRecord(root, id);
  requireActive(record, 'superseded');
  if (record.data?.superseded_by || record.data?.deprecation_reason) throw new Error(`${record.id} already carries a superseded_by or deprecation_reason fact`);
  const successor = resolveRecord(root, named[0]);
  if (successor.kind !== record.kind) throw new Error(`${record.id} cannot be superseded by ${successor.id}; a successor is the same kind of decision record`);
  if (successor.filePath === record.filePath) throw new Error(`${record.id} cannot supersede itself`);
  requireActive(successor, 'a successor');
  const edits = new Map([
    [record.filePath, (content) => insertFrontmatterKeys(stripFrontmatterKey(content, 'status').content, [['superseded_by', [`superseded_by: ${successor.name}`]]], record.relativePath).content],
    [successor.filePath, (content) => appendFrontmatterListItem(content, 'supersedes', record.name, successor.relativePath)]
  ]);
  return moveDecisionRecord(root, record, 'archive', edits, 'supersede', { successor: successor.id });
}

// Deprecate: an accepted record ends without a successor and says why.
export function deprecateRecord(root, id, reason) {
  const text = typeof reason === 'string' ? reason.trim() : '';
  if (!text) throw new Error('deprecate needs a stated reason (--reason TEXT)');
  if (/[\r\n]/.test(text)) throw new Error('--reason must be one line; it is stored as the deprecation_reason frontmatter value');
  const record = resolveRecord(root, id);
  requireActive(record, 'deprecated');
  if (record.data?.superseded_by || record.data?.deprecation_reason) throw new Error(`${record.id} already carries a superseded_by or deprecation_reason fact`);
  const edits = new Map([[record.filePath, (content) => insertFrontmatterKeys(stripFrontmatterKey(content, 'status').content, [['deprecation_reason', [`deprecation_reason: ${text}`]]], record.relativePath).content]]);
  return moveDecisionRecord(root, record, 'archive', edits, 'deprecate', { reason: text });
}

// S-003X TK-004Z: the five read words every record answers (ADR-000T), for
// both kinds of decision record. Reads never write. `list` and `search` act
// on every collection present unless `--kind` narrows them; `show` (with `get`
// as its synonym), `history` and `inspect` address one record by identifier.
function recordSummary(record, records = []) {
  const summary = { id: record.id, kind: record.kind, status: record.status, folder: record.folder, date: record.data?.date ?? null, title: record.title, path: record.relativePath };
  const successorName = typeof record.data?.superseded_by === 'string' ? record.data.superseded_by.trim() : '';
  if (successorName) {
    const successor = records.find((item) => item.name === successorName);
    summary.successor = successor ? successor.id : successorName;
  }
  return summary;
}

function readKinds(root, kind) {
  return kind === undefined ? presentKinds(root) : [recordKind(kind).kind];
}

// list: the records that exist.
export function listRecords(root, options = {}) {
  if (options.status !== undefined && !STATUSES.includes(options.status)) throw new Error(`--status must be one of ${STATUSES.join(', ')}`);
  return readKinds(root, options.kind).flatMap((kind) => {
    const records = listAdrs(root, { kind });
    return records.filter((record) => options.status === undefined || record.status === options.status).map((record) => recordSummary(record, records));
  });
}

// show: one whole record.
export function showRecord(root, id) {
  const record = resolveRecord(root, id);
  return { ...recordSummary(record, listAdrs(root, { kind: record.kind })), frontmatter: record.data, content: fs.readFileSync(record.filePath, 'utf8') };
}

function recordLines(content) {
  const lines = content.replace(/\r\n?/g, '\n').split('\n');
  if (lines.length > 1 && lines.at(-1) === '') lines.pop();
  return lines;
}

// search: records found by a case-insensitive literal query over the whole
// file (title, frontmatter and body), each with its matching lines. A
// superseded hit names its successor, so a replaced decision is never read
// as current (the Plan decision; nothing else is attached to a result).
export function searchRecords(root, query, options = {}) {
  const text = typeof query === 'string' ? query.trim() : '';
  if (!text) throw new Error('search needs a query');
  const needle = text.toLowerCase();
  return readKinds(root, options.kind).flatMap((kind) => {
    const records = listAdrs(root, { kind });
    return records.flatMap((record) => {
      const matches = recordLines(fs.readFileSync(record.filePath, 'utf8'))
        .map((line, index) => ({ line: index + 1, text: line }))
        .filter((entry) => entry.text.toLowerCase().includes(needle));
      return matches.length ? [{ ...recordSummary(record, records), matches }] : [];
    });
  });
}

// history: how a record changed. Its lifecycle chain (what it supersedes,
// what superseded it, why it was deprecated) and every Git commit that
// touched its file, followed across lifecycle moves. Outside Git the chain
// alone is reported and Git is said to be unavailable.
export function recordHistory(root, id) {
  const record = resolveRecord(root, id);
  const records = listAdrs(root, { kind: record.kind });
  const named = (name) => ({ name, id: records.find((item) => item.name === name)?.id ?? null });
  const supersedesValue = record.data?.supersedes;
  const supersedes = (Array.isArray(supersedesValue) ? supersedesValue : (supersedesValue ? [supersedesValue] : [])).map(named);
  const successor = typeof record.data?.superseded_by === 'string' && record.data.superseded_by.trim() ? named(record.data.superseded_by.trim()) : null;
  const lifecycle = { status: record.status, folder: record.folder, supersedes, supersededBy: successor, deprecationReason: record.data?.deprecation_reason ?? null };
  const inside = spawnSync('git', ['-C', root, 'rev-parse', '--is-inside-work-tree'], { encoding: 'utf8' });
  let git;
  if (inside.status !== 0 || inside.stdout.trim() !== 'true') {
    git = { available: false, reason: 'not a Git working tree; only the lifecycle chain is known' };
  } else {
    const log = spawnSync('git', ['-C', root, 'log', '--follow', '--format=%H%x09%ad%x09%s', '--date=short', '--', record.relativePath], { encoding: 'utf8' });
    if (log.status !== 0) throw new Error(`git log failed for ${record.relativePath}: ${(log.stderr || '').trim()}`);
    git = { available: true, commits: log.stdout.split('\n').filter(Boolean).map((line) => { const [commit, date, ...subject] = line.split('\t'); return { commit, date, subject: subject.join('\t') }; }) };
  }
  return { ...recordSummary(record, records), lifecycle, git };
}

const DERIVED_FIELDS = Object.freeze(['id', 'kind', 'status', 'folder', 'title', 'path']);

// inspect: part of a record, either one field (a frontmatter key or a derived
// field: id, kind, status, folder, title, path) or a 1-based inclusive line
// range of the file.
export function inspectRecord(root, id, options = {}) {
  if ((options.field === undefined) === (options.lines === undefined)) throw new Error('inspect needs exactly one of --field NAME or --lines START:END');
  const record = resolveRecord(root, id);
  if (options.field !== undefined) {
    const field = String(options.field);
    if (DERIVED_FIELDS.includes(field)) return { id: record.id, field, value: recordSummary(record)[field] };
    if (record.data && Object.hasOwn(record.data, field)) return { id: record.id, field, value: record.data[field] };
    throw new Error(`${record.id} has no field ${field}; frontmatter keys are ${Object.keys(record.data ?? {}).join(', ') || 'none'} and derived fields are ${DERIVED_FIELDS.join(', ')}`);
  }
  const match = /^(\d+)(?::(\d+))?$/.exec(String(options.lines));
  if (!match) throw new Error('--lines must be START:END (or one line number), 1-based and inclusive');
  const lines = recordLines(fs.readFileSync(record.filePath, 'utf8'));
  const start = Number(match[1]);
  const end = match[2] === undefined ? start : Number(match[2]);
  if (start < 1 || end < start || end > lines.length) throw new Error(`--lines ${options.lines} is outside ${record.id}, which has ${lines.length} lines`);
  return { id: record.id, lines: `${start}:${end}`, text: lines.slice(start - 1, end).join('\n') };
}

function cell(value) {
  return String(value).replaceAll('|', '\\|').replaceAll('\n', ' ');
}

function requireValue(value, message) {
  if (!value || !String(value).trim()) throw new Error(message);
  return String(value).trim();
}

// S-003X TK-004Y/TK-004Z: the commands addressed to one record take its
// identifier as their one positional argument; `search` takes its query. Every
// other command refuses a positional argument, as before.
const ID_COMMANDS = Object.freeze(['accept', 'supersede', 'deprecate', 'show', 'get', 'history', 'inspect']);

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const options = {};
  const positional = [];
  for (let index = 0; index < rest.length; index += 1) {
    const arg = rest[index];
    if (arg === '--json') options.json = true;
    // S-003X TK-004Y: `--by` is collected so a supersession naming two
    // successors is refused instead of silently keeping the last one.
    else if (arg === '--by') (options.by ??= []).push(rest[++index]);
    else if (arg.startsWith('--')) options[arg.slice(2)] = rest[++index];
    else positional.push(arg);
  }
  if (command === 'search') options.query = positional.join(' ');
  else if (ID_COMMANDS.includes(command)) {
    if (positional.length > 1) throw new Error(`Unknown argument: ${positional[1]}`);
    options.id = positional[0];
  } else if (positional.length) throw new Error(`Unknown argument: ${positional[0]}`);
  return { command, options };
}

function printRead(options, value, text) {
  console.log(options.json ? JSON.stringify(value, null, 2) : text);
}

function summaryLine(record) {
  return [record.id, record.status, record.date ?? '', record.title ?? '', record.path, ...(record.successor ? [`superseded by ${record.successor}`] : [])].join('\t');
}

if (isMainModule(import.meta.url)) {
  try {
    const { command, options } = parseArgs(process.argv.slice(2));
    const root = findRoot(options.path ?? process.cwd());
    // S-003X TK-004X: `--kind adr|ddr` selects one decision-record collection;
    // without it, validate, register and normalize act on every collection
    // present (always the ADR one), and new writes an ADR as before.
    const kinds = options.kind === undefined ? presentKinds(root) : [recordKind(options.kind).kind];
    if (command === 'validate') {
      const findings = kinds.flatMap((kind) => validateAdrs(root, { kind }));
      const subject = options.kind === undefined ? 'decision records' : `${recordKind(options.kind).prefix} collection`;
      console.log(options.json ? JSON.stringify(findings, null, 2) : (findings.length ? findings.map((item) => `${item.code} [${item.severity}]: ${item.message}`).join('\n') : `ok - ${subject} validated`));
      if (findings.some((item) => item.severity === 'error')) process.exitCode = 1;
    } else if (command === 'register') {
      // One kind prints its result as before; without a kind the ADR result
      // keeps its top-level shape and each other collection is keyed by kind.
      const [first, ...rest] = kinds;
      const result = writeRegister(root, { kind: first });
      for (const kind of rest) result[kind] = writeRegister(root, { kind });
      console.log(JSON.stringify(result));
    } else if (command === 'normalize') {
      console.log(JSON.stringify({ changed: kinds.flatMap((kind) => normalizeAdrs(root, { date: options.date, kind }).changed) }));
    } else if (command === 'new') {
      console.log(JSON.stringify(newAdr(root, options)));
    } else if (command === 'migrate-folders') {
      console.log(JSON.stringify(migrateLifecycleFolders(root), null, 2));
    } else if (command === 'list') {
      const records = listRecords(root, { kind: options.kind, status: options.status });
      printRead(options, records, records.map(summaryLine).join('\n'));
    } else if (command === 'show' || command === 'get') {
      const record = showRecord(root, requireValue(options.id, `${command} needs a record identifier (ADR-... or DDR-...)`));
      if (options.json) printRead(options, record);
      else process.stdout.write(record.content);
    } else if (command === 'search') {
      const hits = searchRecords(root, options.query, { kind: options.kind });
      printRead(options, hits, hits.map((hit) => [[hit.id, hit.status, hit.title ?? '', hit.path, ...(hit.successor ? [`superseded by ${hit.successor}`] : [])].join('\t'), ...hit.matches.map((match) => `  ${match.line}: ${match.text}`)].join('\n')).join('\n'));
    } else if (command === 'history') {
      const history = recordHistory(root, requireValue(options.id, 'history needs a record identifier (ADR-... or DDR-...)'));
      const chain = [
        `${history.id}\t${history.status}\t${history.path}`,
        ...history.lifecycle.supersedes.map((item) => `supersedes ${item.id ?? item.name} (${item.name})`),
        ...(history.lifecycle.supersededBy ? [`superseded by ${history.lifecycle.supersededBy.id ?? history.lifecycle.supersededBy.name} (${history.lifecycle.supersededBy.name})`] : []),
        ...(history.lifecycle.deprecationReason ? [`deprecated: ${history.lifecycle.deprecationReason}`] : []),
        ...(history.git.available ? history.git.commits.map((commit) => `${commit.commit}\t${commit.date}\t${commit.subject}`) : [`git: ${history.git.reason}`])
      ];
      printRead(options, history, chain.join('\n'));
    } else if (command === 'inspect') {
      const part = inspectRecord(root, requireValue(options.id, 'inspect needs a record identifier (ADR-... or DDR-...)'), { field: options.field, lines: options.lines });
      printRead(options, part, part.text ?? (Array.isArray(part.value) ? part.value.join('\n') : String(part.value ?? '')));
    } else if (command === 'accept') {
      console.log(JSON.stringify(acceptRecord(root, requireValue(options.id, 'accept needs a record identifier (ADR-... or DDR-...)'))));
    } else if (command === 'supersede') {
      console.log(JSON.stringify(supersedeRecord(root, requireValue(options.id, 'supersede needs a record identifier (ADR-... or DDR-...)'), options.by)));
    } else if (command === 'deprecate') {
      console.log(JSON.stringify(deprecateRecord(root, requireValue(options.id, 'deprecate needs a record identifier (ADR-... or DDR-...)'), options.reason)));
    } else {
      throw new Error('Usage: adr.mjs list [--kind adr|ddr] [--status STATUS] [--json] | show|get ID [--json] | search QUERY [--kind adr|ddr] [--json] | history ID [--json] | inspect ID (--field NAME | --lines START:END) [--json] | validate [--kind adr|ddr] [--json] | normalize [--kind adr|ddr] [--date YYYY-MM-DD] [--json] | register [--kind adr|ddr] | new [--kind adr|ddr] --title "Decision title" [--date YYYY-MM-DD] | accept ID | supersede ID --by SUCCESSOR | deprecate ID --reason "Why" | migrate-folders');
    }
  } catch (error) {
    console.error(`error: ${error.message}`);
    process.exitCode = 1;
  }
}

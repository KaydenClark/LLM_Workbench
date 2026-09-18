#!/usr/bin/env node
// Architecture decision records: create, validate, and derive the register.
//
// An ADR owns rationale. Its rule binds only where `canonicalized_in` points,
// so validation checks that every named owner exists. A durable reference into
// an untracked session collection is not evidence and is reported.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { finding } from './diagnostics.mjs';
import { allocateVisibleId, compareVisibleIds, visibleIdKey } from './visible-ids.mjs';
import { assertSafeReadPath, assertSafeWritePath, writeSafeFile, collectionPath, collectionRelative, findRoot, isMainModule, IGNORED_COLLECTIONS } from './workbench-paths.mjs';

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

// Enumerates the top-level directory and, when present, each lifecycle
// subfolder in `ADR_LIFECYCLE_FOLDERS`. A flat collection with no subfolders
// produces exactly the same list, in the same order, as before this change -
// the top-level listing semantics `REGISTER.md`, `HISTORY.md` and `doctor`
// depend on stay byte-stable. Every record carries the folder it was actually
// read from, so a successor or a link can be resolved by identity across the
// whole set instead of by the location a caller assumed.
export function listAdrs(root, options = {}) {
  const directory = collectionPath(root, 'adr');
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
          throw new Error(`${entry.name} must be an ordinary, singly linked ADR file; allocation cannot ignore an occupied identity`);
        }
        return entry;
      })
      .map((entry) => entry.name)
      .map((name) => readAdr(root, path.join(location, name), options.contentOverrides?.get(path.join(location, name)), folder)))
    .sort((a, b) => compareVisibleIds(`ADR-${a.number}`, `ADR-${b.number}`) || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
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

function readAdr(root, filePath, content = fs.readFileSync(filePath, 'utf8'), folder = null) {
  const { data, body } = parseFrontmatter(content);
  const name = path.basename(filePath);
  const [, number, slug] = name.match(ID_PATTERN);
  const title = body.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? null;
  // `href` is the path a register/history row must link through, relative to
  // the collection root where those projections live. It equals `name` for a
  // top-level record, so a flat collection's rendered link text is unchanged.
  const href = folder ? `${folder}/${name}` : name;
  const { status, disagreement, implied } = deriveStatus(folder, data);
  return { root, filePath, relativePath: path.relative(root, filePath).split(path.sep).join('/'), name, number, slug, title, data, body, folder, href, status, statusDisagreement: disagreement, impliedStatus: implied };
}

export function validateAdrs(root, options = {}) {
  const findings = [];
  let adrs;
  try { adrs = listAdrs(root, options); }
  catch (error) { return [finding('invalid-adr', error.message)]; }
  const adrCollectionRelative = collectionRelative(root, 'adr');
  const numbers = new Map();
  for (const adr of adrs) {
    const key = visibleIdKey(`ADR-${adr.number}`);
    const seen = numbers.get(key) ?? { number: adr.number, names: [] };
    seen.names.push(adr.name);
    numbers.set(key, seen);
    const data = adr.data;
    if (!data) {
      findings.push(finding('invalid-adr', `${adr.relativePath} has no frontmatter`, { adr: adr.name }));
      continue;
    }
    if (adr.statusDisagreement) {
      findings.push(finding('disagreeing-status', `${adr.relativePath} frontmatter status '${data.status}' disagrees with its ${adr.folder}/ folder, which implies '${adr.impliedStatus}'`, { adr: adr.name }));
    }
    if (!STATUSES.includes(adr.status)) findings.push(finding('invalid-adr', `${adr.relativePath} status must be one of ${STATUSES.join(', ')}`, { adr: adr.name }));
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(data.date ?? ''))) findings.push(finding('invalid-adr', `${adr.relativePath} needs a YYYY-MM-DD date`, { adr: adr.name }));
    if (!adr.title) findings.push(finding('invalid-adr', `${adr.relativePath} needs a title heading`, { adr: adr.name }));
    if (adr.status === 'accepted') {
      const owners = Array.isArray(data.canonicalized_in) ? data.canonicalized_in : (data.canonicalized_in ? [data.canonicalized_in] : []);
      if (owners.length === 0) findings.push(finding('invalid-adr', `${adr.relativePath} is accepted but names no canonicalized_in owner`, { adr: adr.name }));
      for (const owner of owners) {
        const target = path.resolve(root, owner);
        if (!target.startsWith(path.resolve(root) + path.sep) || !fs.existsSync(target)) {
          findings.push(finding('invalid-adr', `${adr.relativePath} canonicalized_in target ${owner} does not exist`, { adr: adr.name, owner }));
        }
      }
    }
    const lifecycleError = message => findings.push(finding('invalid-adr', `${adr.relativePath} ${message}`, { adr: adr.name }));
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
    for (const link of localLinks(adr.body)) {
      const target = path.resolve(path.dirname(adr.filePath), link);
      const relative = path.relative(root, target).split(path.sep).join('/');
      if (relative.startsWith(`${collectionRelative(root, 'notepad-templates')}/`)) continue;
      for (const collection of IGNORED_COLLECTIONS) {
        if (relative.startsWith(`${collectionRelative(root, collection)}/`)) {
          findings.push(finding('untracked-provenance', `${adr.relativePath} references untracked ${relative}; reconcile selected claims into a durable owner first`, { adr: adr.name, target: relative }));
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
        findings.push(finding('invalid-adr', `${adr.relativePath} links to missing ${relative}`, { adr: adr.name, target: relative }));
      }
    }
  }
  for (const { number, names } of numbers.values()) {
    if (names.length > 1) findings.push(finding('invalid-adr', `ADR number ${number} is used by ${names.join(', ')}`, { number }));
  }
  const registerPath = path.join(collectionPath(root, 'adr'), REGISTER_NAME);
  if (adrs.length > 0) {
    const expected = renderRegister(adrs);
    const actual = fs.existsSync(registerPath) ? fs.readFileSync(registerPath, 'utf8') : null;
    if (actual === null || actual.replaceAll('\r\n', '\n') !== expected) {
      findings.push(finding('stale-register', `${collectionRelative(root, 'adr')}/${REGISTER_NAME} is stale; run adr register`));
    }
  }
  const historyPath = path.join(collectionPath(root, 'adr'), HISTORY_NAME);
  if (adrs.length > 0) {
    const history = fs.existsSync(historyPath) ? fs.readFileSync(historyPath, 'utf8') : null;
    if (history === null || history.replaceAll('\r\n', '\n') !== renderRegister(adrs, { history: true })) findings.push(finding('stale-register', `${collectionRelative(root, 'adr')}/${HISTORY_NAME} is stale; run adr register`));
  }
  return findings;
}

// Bring existing records into shape without editing a body. `status` defaults
// to `proposed` because an inserted `accepted` would assert an acceptance
// nobody made, and an accepted record still needs a `canonicalized_in` owner
// only its author can name - normalize reports that record as unchanged and
// `validate` keeps failing it.
export function normalizeAdrs(root, options = {}) {
  const date = options.date ?? new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('--date must be YYYY-MM-DD');
  const fields = [['status', ['status: proposed']], ['date', [`date: ${date}`]]];
  const changed = [];
  for (const adr of listAdrs(root)) {
    const content = fs.readFileSync(adr.filePath, 'utf8');
    const result = insertFrontmatterKeys(content, fields, adr.relativePath);
    if (result.inserted.length === 0) continue;
    assertSafeWritePath(root, adr.filePath);
    writeSafeFile(root, adr.filePath, result.content);
    changed.push({ record: adr.relativePath, inserted: result.inserted });
  }
  return { changed };
}

export function renderRegister(adrs, { history = false } = {}) {
  const lines = [
    history ? '# ADR History' : '# ADR Register',
    '',
    '> Derived by `adr.mjs register`; do not edit by hand. The directory listing is the source; this table is a projection.',
    '',
    history ? '[Active decisions](REGISTER.md). All retained lifecycle states follow.' : '[Complete history](HISTORY.md). Only accepted active decisions follow.',
    '',
    '| ADR | Title | Status | Date | Canonicalized in |',
    '|---|---|---|---|---|'
  ];
  for (const adr of adrs.filter(record => history || record.status === 'accepted')) {
    const owners = Array.isArray(adr.data?.canonicalized_in) ? adr.data.canonicalized_in : (adr.data?.canonicalized_in ? [adr.data.canonicalized_in] : []);
    lines.push(`| [${adr.number}](${adr.href ?? adr.name}) | ${cell(adr.title ?? '')} | ${cell(adr.status ?? '')} | ${cell(adr.data?.date ?? '')} | ${cell(owners.join(', ') || 'none')} |`);
  }
  return `${lines.join('\n')}\n`;
}

export function writeRegister(root) {
  const registerPath = path.join(collectionPath(root, 'adr'), REGISTER_NAME);
  const historyPath = path.join(collectionPath(root, 'adr'), HISTORY_NAME);
  assertSafeWritePath(root, registerPath);
  assertSafeWritePath(root, historyPath);
  const adrs = listAdrs(root);
  const content = renderRegister(adrs);
  writeSafeFile(root, registerPath, content);
  writeSafeFile(root, historyPath, renderRegister(adrs, { history: true }));
  return { registerPath, historyPath, count: adrs.length };
}

export function newAdr(root, options) {
  const title = requireValue(options.title, '--title is required');
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (!slug) throw new Error('title must contain letters or digits');
  const directory = collectionPath(root, 'adr');
  assertSafeWritePath(root, path.join(directory, REGISTER_NAME));
  const occupied = listAdrs(root).map(adr => `ADR-${adr.number}`);
  const next = allocateVisibleId('ADR', occupied, { width: 4, requireLetter: true }).slice(4);
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
  const content = [
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
  ].join('\n');
  writeSafeFile(root, filePath, content, { exclusive: true });
  return { filePath, number: next };
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
// (old absolute ADR record path -> current absolute path, including every
// record that did not move, mapped to itself). A link to anything else -
// another spec, a wiki note, a target this migration never touched - is
// never matched and never rewritten.
function rewriteAdrLinks(content, oldDir, newDir, locations) {
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
    const relative = path.relative(newDir, newAbsolute).split(path.sep).join('/');
    const rebuilt = fragment !== undefined ? `${relative}#${fragment}` : relative;
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
function splitEvidenceSection(content) {
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

function cell(value) {
  return String(value).replaceAll('|', '\\|').replaceAll('\n', ' ');
}

function requireValue(value, message) {
  if (!value || !String(value).trim()) throw new Error(message);
  return String(value).trim();
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const options = {};
  for (let index = 0; index < rest.length; index += 1) {
    const arg = rest[index];
    if (arg === '--json') options.json = true;
    else if (arg.startsWith('--')) options[arg.slice(2)] = rest[++index];
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return { command, options };
}

if (isMainModule(import.meta.url)) {
  try {
    const { command, options } = parseArgs(process.argv.slice(2));
    const root = findRoot(options.path ?? process.cwd());
    if (command === 'validate') {
      const findings = validateAdrs(root);
      console.log(options.json ? JSON.stringify(findings, null, 2) : (findings.length ? findings.map((item) => `${item.code} [${item.severity}]: ${item.message}`).join('\n') : 'ok - ADR collection validated'));
      if (findings.some((item) => item.severity === 'error')) process.exitCode = 1;
    } else if (command === 'register') {
      console.log(JSON.stringify(writeRegister(root)));
    } else if (command === 'normalize') {
      console.log(JSON.stringify(normalizeAdrs(root, { date: options.date })));
    } else if (command === 'new') {
      console.log(JSON.stringify(newAdr(root, options)));
    } else if (command === 'migrate-folders') {
      console.log(JSON.stringify(migrateLifecycleFolders(root), null, 2));
    } else {
      throw new Error('Usage: adr.mjs validate [--json] | normalize [--date YYYY-MM-DD] [--json] | register | new --title "Decision title" [--date YYYY-MM-DD] | migrate-folders');
    }
  } catch (error) {
    console.error(`error: ${error.message}`);
    process.exitCode = 1;
  }
}

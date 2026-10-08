// Dashboard adapters read native owners. The caller supplies its safe reader;
// this module never writes records or generated projections.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { readTaskboard } from '../workbench/tools/spec-workbench.mjs';
import { showTracker } from '../workbench/tools/landmark-tracker.mjs';
import { assertSafeReadPath } from '../workbench/tools/workbench-paths.mjs';
import { listAdrs } from '../workbench/tools/adr.mjs';
import { parseMarkdownTableRow } from '../workbench/tools/markdown-table.mjs';

const GROUPS = [
  ['specs', 'Specs'], ['tasks', 'Tasks'], ['dqcs', 'Destination Question Cards'],
  ['wiki', 'Wiki'], ['skills', 'Skills and procedures'], ['landmarks', 'Landmarks'],
  ['architecture', 'Architecture'], ['glossary', 'Glossary']
].map(([id, title]) => ({ id, title }));
const toRelative = (root, file) => path.relative(root, file).split(path.sep).join('/');
const heading = text => text.match(/^#\s+(.+)$/m)?.[1];
const fields = text => Object.fromEntries([...text.matchAll(/^\*\*([^*]+):\*\*\s*(.+)$/gm)].map(match => [match[1], match[2].trim()]));

export function dashboardSources(rootDir, { readSource, catalogOnly = false } = {}) {
  if (typeof readSource !== 'function') throw new TypeError('dashboardSources requires the board safe readSource(root, path) function');
  const root = path.resolve(rootDir);
  const result = { schema: 'workbench-dashboard/sources@1', groups: GROUPS.map(group => ({ ...group })), artifacts: [], taskboard: null, tracker: null, errors: [] };
  const known = new Set();
  const failed = (source, error, file) => {
    const failure = { source, ...(file ? { path: file } : {}), code: error.code ?? 'source-error', message: error.message };
    result.errors.push(failure);
    return failure;
  };
  let manifest;
  try {
    manifest = JSON.parse(readSource(root, 'workbench/manifest.json'));
    if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) throw Object.assign(new Error('Manifest must be a JSON object'), { code: 'invalid-manifest' });
  }
  catch (error) {
    const failure = failed('manifest', error, 'workbench/manifest.json');
    result.taskboard = { status: 'error', error: failure };
    result.tracker = { status: 'error', error: failure };
    return result;
  }

  function artifact(file, group, kind) {
    if (known.has(file)) return;
    try {
      const text = readSource(root, file);
      const json = file.endsWith('.json') ? JSON.parse(text) : null;
      const metadata = json ? {} : fields(text);
      const id = json?.id ?? metadata['Task ID'] ?? metadata['Spec ID'] ?? metadata['Landmark ID'];
      const parent = metadata['Spec ID'] ?? metadata['Landmark ID'];
      const revision = json?.revision ?? createHash('sha256').update(text).digest('hex');
      const relationships = json?.related ?? (kind === 'task' && parent ? [{ type: parent.startsWith('LMK-') ? 'landmark' : 'spec', id: parent }] : []);
      const source = {
        group, kind, path: file, title: json?.title ?? heading(text) ?? path.basename(file),
        ...(id ? { id } : {}), identity: kind === 'task' ? `task:${parent ?? 'unknown'}/${id ?? file}:${file}` : `${kind}:${id ?? file}:${file}`,
        status: json ? (json.confirmation ? 'confirmation recorded; inspect revision' : 'current source') : metadata.Status ?? (file.includes('/archive/') || file.includes('/retired/') ? 'historical source' : 'current source'),
        format: json ? 'json' : 'markdown', revision,
        sources: json?.sources ?? [{ path: file }], relationships,
        history: json?.history ?? [],
        ...(json?.schema ? { schema: json.schema } : {}),
        ...(json?.landmarks ? { landmarks: json.landmarks } : {})
      };
      result.artifacts.push(source);
      known.add(file);
    } catch (error) { failed(group, error, file); }
  }

  // Walk declared public lanes only; never follow a linked file or directory.
  // Hidden entries and private sessions are not a catalog discovery route.
  function scan(relative, source, select) {
    if (!relative) return;
    if (typeof relative !== 'string') {
      failed(source, Object.assign(new Error('Declared collection must be a relative path string'), { code: 'invalid-manifest' }));
      return;
    }
    const directory = path.resolve(root, relative);
    function walk(dir) {
      const rel = toRelative(root, dir);
      try {
        if (rel.split('/').some(part => part.startsWith('.')) || /(?:^|\/)sessions\/(?:notepads|handoffs)(?:\/|$)/.test(rel)) throw Object.assign(new Error('Private working collections are not cataloged'), { code: 'unsafe-path' });
        assertSafeReadPath(root, dir);
        const stat = fs.lstatSync(dir);
        if (stat.isSymbolicLink() || !stat.isDirectory()) throw Object.assign(new Error('Collection must be an ordinary directory'), { code: 'unsafe-path' });
        for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
          if (entry.name.startsWith('.')) continue;
          const file = path.join(dir, entry.name), itemPath = toRelative(root, file);
          if (entry.isSymbolicLink()) { failed(source, Object.assign(new Error('Linked catalog entries are not served'), { code: 'unsafe-path' }), itemPath); continue; }
          if (entry.isDirectory()) walk(file);
          else if (entry.isFile()) {
            const selected = select(itemPath, entry.name);
            if (selected) artifact(itemPath, selected.group, selected.kind);
          }
        }
      } catch (error) { failed(source, error, rel || relative); }
    }
    if (fs.existsSync(directory)) walk(directory);
    else failed(source, Object.assign(new Error(`Declared collection ${relative} is missing`), { code: 'missing-collection' }), relative);
  }
  const ownerSelector = (_file, name) => name === 'SPEC.md' ? { group: 'specs', kind: 'spec' } : name === 'TASK.md' ? { group: 'tasks', kind: 'task' } : name === 'LANDMARK.md' ? { group: 'landmarks', kind: 'landmark' } : null;
  scan(manifest.lanes?.specs, 'taskboard', ownerSelector);
  scan(manifest.collections?.landmarks, 'taskboard', ownerSelector);
  scan(manifest.landmarkTracker?.collections?.['destination-questions'], 'tracker', (_file, name) => /^DQC-[0-9A-Za-z]+\.json$/.test(name) ? { group: 'dqcs', kind: 'dqc' } : null);
  scan(manifest.landmarkTracker?.collections?.landmarks, 'tracker', (_file, name) => /^LMK-[0-9A-Za-z]+\.json$/.test(name) ? { group: 'landmarks', kind: 'landmark' } : null);
  scan(manifest.lanes?.wiki, 'wiki', (_file, name) => /\.(md|json)$/.test(name) ? { group: 'wiki', kind: 'wiki' } : null);
  scan(manifest.lanes?.skills, 'skills', (_file, name) => /\.md$/.test(name) ? { group: 'skills', kind: 'skill' } : null);
  for (const [file, group] of [['ARCHITECTURE.md', 'architecture'], ['GLOSSARY.md', 'glossary']]) if (fs.existsSync(path.join(root, file))) artifact(file, group, group);

  result.artifacts.sort((a, b) => a.group.localeCompare(b.group) || a.title.localeCompare(b.title) || a.path.localeCompare(b.path));
  if (catalogOnly) {
    result.taskboard = { status: 'not-requested' };
    result.tracker = { status: 'not-requested' };
    return result;
  }

  try {
    if (result.errors.some(error => error.source === 'taskboard' || ['specs', 'tasks', 'landmarks'].includes(error.source))) throw Object.assign(new Error('A Taskboard source is unreadable; inspect the source errors'), { code: 'unreadable-source' });
    const board = readTaskboard(root, { qualified: true });
    result.taskboard = { status: 'available', board, semantics: 'Native execution lanes; approval and verification remain in source records.' };
  } catch (error) { result.taskboard = { status: 'error', error: failed('taskboard', error), semantics: 'Source records remain readable; no substitute execution projection is manufactured.' }; }
  try {
    const tracker = showTracker(root).tracker;
    result.tracker = { status: 'available', tracker, semantics: 'Native understanding distribution; assessed coverage does not establish delivery completion.' };
  } catch (error) { result.tracker = { status: 'error', error: failed('tracker', error) }; }
  return result;
}

// --- Dashboard read routes: glossary, backlinks and search -----------------
// Read-only GET answers over the same catalog the board serves. Every file is
// read through the caller's safe reader, so private collections (sessions,
// notepads, handoffs, answers) and hidden or linked entries are never read.

const DEFINITION_LIMIT = 600;
const SNIPPET_LIMIT = 240;
const SEARCH_DEFAULT_LIMIT = 50;
const SEARCH_MAX_LIMIT = 200;
const ROOT_CONTROLS = [['AGENTS.md', 'AGENTS'], ['RUNBOOK.md', 'RUNBOOK'], ['BLUEPRINT.md', 'BLUEPRINT'], ['LEXICON.md', 'LEXICON'], ['README.md', 'README']];

function routeError(code, message) {
  return Object.assign(new Error(message), { code });
}

// Returns a JSON-able answer for a Dashboard read path, or null when the path
// is not one of these routes. `url` is a WHATWG URL; `items` are the Grill
// Board items (the array or the items.json object).
export function dashboardRoute(rootDir, url, { readSource, items } = {}) {
  if (typeof readSource !== 'function') throw new TypeError('dashboardRoute requires the board safe readSource(root, path) function');
  if (!(url instanceof URL)) throw new TypeError('dashboardRoute requires a WHATWG URL');
  const root = path.resolve(rootDir);
  const questions = Array.isArray(items) ? items : Array.isArray(items?.items) ? items.items : [];
  if (url.pathname === '/api/glossary') return glossary(root, readSource);
  if (url.pathname === '/api/backlinks') return backlinks(root, url.searchParams.get('path'), readSource, questions);
  if (url.pathname === '/api/search') return search(root, url.searchParams.get('q'), url.searchParams.get('limit'), readSource, questions);
  return null;
}

function plainText(markdown) {
  return String(markdown)
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/(^|[\s(])[_*]([^_*\n]+)[_*](?=[\s).,;:!?]|$)/g, '$1$2')
    .replace(/\s+/g, ' ')
    .trim();
}

function bounded(text, limit) {
  return text.length <= limit ? text : `${text.slice(0, limit - 1).trimEnd()}…`;
}

function slug(text) {
  return text.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s+/g, '-');
}

function readOptional(root, file, readSource) {
  if (!fs.existsSync(path.join(root, file))) return null;
  return readSource(root, file);
}

// GLOSSARY.md (the pinned format: `**Term**:` then its definition lines) when
// present; otherwise the Lexicon's bold-term table rows, read-only.
function glossary(root, readSource) {
  const glossaryText = readOptional(root, 'GLOSSARY.md', readSource);
  if (glossaryText !== null) return { source: 'GLOSSARY.md', terms: dedupe(glossaryTerms(glossaryText)) };
  const lexiconText = readOptional(root, 'LEXICON.md', readSource);
  if (lexiconText !== null) return { source: 'LEXICON.md', terms: dedupe(lexiconTerms(lexiconText)) };
  return { source: null, terms: [] };
}

function term(name, definition, file) {
  const text = plainText(name);
  return { term: text, anchor: slug(text), definition: bounded(plainText(definition), DEFINITION_LIMIT), path: file };
}

function glossaryTerms(text) {
  const terms = [];
  const lines = text.split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(/^\*\*([^*]+)\*\*:\s*(.*)$/);
    if (!match) continue;
    const definition = [match[2]];
    while (index + 1 < lines.length) {
      const next = lines[index + 1];
      if (!next.trim() || /^#{1,6}\s/.test(next) || /^\*\*[^*]+\*\*:/.test(next) || /^_Avoid_/.test(next)) break;
      definition.push(next);
      index += 1;
    }
    terms.push(term(match[1], definition.join(' '), 'GLOSSARY.md'));
  }
  return terms;
}

function lexiconTerms(text) {
  const terms = [];
  for (const line of text.split(/\r?\n/)) {
    if (!/^\|\s*\*\*[^*]+\*\*/.test(line)) continue;
    let cells;
    try { cells = parseMarkdownTableRow(line); } catch { continue; }
    // A term cell is the bold term, optionally followed by a parenthetical
    // such as the AI Coding Dictionary link; matrix cells carry other text.
    const name = cells[0].match(/^\*\*([^*]+)\*\*(?:\s*\(.*\))?$/)?.[1];
    if (name && cells[1]) terms.push(term(name, cells[1], 'LEXICON.md'));
  }
  return terms;
}

function dedupe(terms) {
  const seen = new Set();
  return terms.filter(entry => {
    const key = entry.term.toLowerCase();
    if (!entry.term || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// A link target as a room-relative path, or null for an external, anchor-only
// or escaping link. `from` is the linking file (empty for room-root text).
function resolveLink(from, target) {
  let link = String(target).trim().replace(/^<|>$/g, '');
  if (!link || /^[a-z][a-z0-9+.-]*:/i.test(link) || link.startsWith('//')) return null;
  link = link.replace(/[#?].*$/, '');
  if (!link) return null;
  try { link = decodeURI(link); } catch { /* keep the literal spelling */ }
  const base = link.startsWith('/') ? '' : path.posix.dirname(from || '.');
  const resolved = path.posix.normalize(path.posix.join(base, link.replace(/^\/+/, ''))).replace(/\/+$/, '');
  if (!resolved || resolved === '.' || resolved === '..' || resolved.startsWith('../') || path.posix.isAbsolute(resolved)) return null;
  return resolved;
}

function markdownLinks(text) {
  const targets = [];
  for (const match of text.matchAll(/!?\[[^\]\n]*\]\(\s*(<[^>\n]*>|[^)\s]+)(?:\s+"[^"\n]*")?\s*\)/g)) targets.push(match[1]);
  for (const match of text.matchAll(/^[ \t]{0,3}\[[^\]\n]+\]:[ \t]*(<[^>\n]*>|\S+)/gm)) targets.push(match[1]);
  return targets;
}

function stringsOf(value) {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(stringsOf);
  if (value && typeof value === 'object') return Object.values(value).flatMap(stringsOf);
  return [];
}

// ---- What a question card links to (mirrored by the page; a cross-check
// test asserts the page renders exactly these links over the real board). ----

// A decision-record identifier (ADR, DDR, CDR) and its slash shorthand: after
// a full ID, each "/X" continuation of one to four capitals or digits that
// ends the word replaces the ID's last characters ("ADR-000B/C/D" names
// ADR-000B, ADR-000C and ADR-000D; "DDR-000P/000Q" names both). An ordinary
// slash ("ADR-000B/its successor", "ADR-000H/AGENTS.md") does not expand.
export const DECISION_ID_PATTERN = /(?<![\w-])((?:ADR|DDR|CDR)-[0-9A-Za-z]{4})((?:\/[0-9A-Z]{1,4}(?![\w-]))*)(?![\w-])/g;
export function expandDecisionId(base, part) {
  return base.slice(0, base.length - part.length) + part;
}
export function decisionIds(text) {
  const ids = [];
  for (const match of String(text ?? '').matchAll(DECISION_ID_PATTERN)) {
    ids.push(match[1]);
    for (const part of match[2].split('/').filter(Boolean)) ids.push(expandDecisionId(match[1], part));
  }
  return ids;
}

// The base a question's relative Markdown links resolve against: its first
// in-room source, else the room root.
export function questionBase(item) {
  const source = (item.sources ?? []).find(candidate => typeof candidate?.path === 'string' && candidate.path && !path.isAbsolute(candidate.path) && !candidate.path.startsWith('..') && !/^[a-z][a-z\d+.-]*:/i.test(candidate.path));
  return source ? source.path : '';
}

// Every room path a question card links to: its in-room sources, the
// Markdown links in its rendered text (resolved against questionBase), and
// the records its decision-record identifiers name (recordPaths: id -> path)
// in its title, text, brief, draft or options.
export function questionLinkTargets(item, recordPaths) {
  const targets = new Set();
  for (const source of item.sources ?? []) {
    if (typeof source?.path !== 'string' || path.isAbsolute(source.path)) continue;
    const resolved = resolveLink('', source.path);
    if (resolved) targets.add(resolved);
  }
  const base = questionBase(item);
  const rendered = [item.question, item.current, item.proposal, item.draft, ...stringsOf(item.brief)].filter(text => typeof text === 'string');
  for (const text of rendered) for (const link of markdownLinks(text)) {
    const resolved = resolveLink(base, link);
    if (resolved) targets.add(resolved);
  }
  const named = [item.title, ...rendered, ...(item.options ?? []).flatMap(option => [option?.label, option?.hint])].filter(text => typeof text === 'string');
  for (const id of named.flatMap(decisionIds)) if (recordPaths.has(id)) targets.add(recordPaths.get(id));
  return targets;
}

function backlinks(root, requested, readSource, questions) {
  const target = typeof requested === 'string' && !path.isAbsolute(requested) && !/^[A-Za-z]:/.test(requested) ? resolveLink('', requested) : null;
  if (!target) throw routeError('unsafe-path', 'backlinks needs a room-relative path');
  const links = [];
  const index = searchIndex(root, readSource);
  const recordPaths = new Map(index.entries.filter(entry => entry.id && /^(?:ADR|DDR|CDR)-/.test(entry.id)).map(entry => [entry.id, entry.path]));
  for (const item of questions) {
    if (questionLinkTargets(item, recordPaths).has(target)) links.push({ kind: 'question', id: item.id, title: item.title });
  }
  for (const entry of index.entries) {
    if (entry.path !== target && entry.links.has(target)) links.push({ kind: 'artifact', ...(entry.id ? { id: entry.id } : {}), path: entry.path, title: entry.title });
  }
  return { path: target, links, ...partial(index) };
}

// Catalog source errors travel with the answer, so a partial index is never
// presented as the whole room.
function partial(index) {
  return index.errors.length > 0 ? { errors: index.errors } : {};
}

function searchLimit(value) {
  const limit = Number.parseInt(value ?? '', 10);
  if (!Number.isFinite(limit) || limit < 1) return SEARCH_DEFAULT_LIMIT;
  return Math.min(limit, SEARCH_MAX_LIMIT);
}

function snippet(text, terms) {
  const lower = text.toLowerCase();
  const at = Math.max(0, lower.indexOf(terms[0]));
  const start = Math.max(0, at - 60);
  const piece = text.slice(start, start + SNIPPET_LIMIT);
  const prefixed = start > 0 ? `…${piece.slice(1)}` : piece;
  return bounded(prefixed, SNIPPET_LIMIT);
}

function search(root, query, limitValue, readSource, questions) {
  const text = String(query ?? '').replace(/\s+/g, ' ').trim();
  if (!text) return { query: '', results: [] };
  const terms = text.toLowerCase().split(' ');
  const limit = searchLimit(limitValue);
  const matches = all => terms.every(word => all.includes(word));
  const ranked = [];
  for (const item of questions) {
    const title = String(item.title ?? '');
    const fields = [title, item.question, item.proposal, item.brief?.summary, item.brief?.recommendation].filter(value => typeof value === 'string').map(value => plainText(value));
    const all = fields.join(' \n ').toLowerCase();
    if (!matches(all)) continue;
    const hit = fields.find(field => field.toLowerCase().includes(terms[0])) ?? title;
    ranked.push({ rank: matches(title.toLowerCase()) ? 0 : 2, order: 0, result: { kind: 'question', id: item.id, title, snippet: snippet(hit, terms), status: item.status ?? 'unknown' } });
  }
  const index = searchIndex(root, readSource);
  for (const entry of index.entries) {
    const titleLower = entry.title.toLowerCase();
    if (!matches(`${titleLower} \n ${entry.lower}`)) continue;
    const hit = entry.lower.includes(terms[0]) ? entry.text : entry.title;
    ranked.push({ rank: matches(titleLower) ? 1 : 3, order: 1, result: { kind: entry.kind, ...(entry.id ? { id: entry.id } : {}), path: entry.path, title: entry.title, snippet: snippet(hit, terms), status: entry.status } });
  }
  ranked.sort((a, b) => a.rank - b.rank || a.order - b.order || (a.result.title < b.result.title ? -1 : a.result.title > b.result.title ? 1 : 0) || String(a.result.path ?? a.result.id).localeCompare(String(b.result.path ?? b.result.id)));
  return { query: text, results: ranked.slice(0, limit).map(entry => entry.result), ...partial(index) };
}

// The board's catalog: root controls, decision records and the native
// dashboard catalog (Specs, Tasks, DQCs, landmarks, Wiki, skills, glossary).
function routeCatalog(root, readSource) {
  const texts = new Map();
  const capture = (base, file) => {
    const text = readSource(base, file);
    texts.set(file, text);
    return text;
  };
  const sources = dashboardSources(root, { readSource: capture, catalogOnly: true });
  const artifacts = [];
  const known = new Set();
  const add = artifact => {
    if (known.has(artifact.path)) return;
    try {
      if (!texts.has(artifact.path)) texts.set(artifact.path, readSource(root, artifact.path));
      known.add(artifact.path);
      artifacts.push(artifact);
    } catch { /* an unreadable control stays out of the index */ }
  };
  for (const [file, title] of ROOT_CONTROLS) if (fs.existsSync(path.join(root, file))) add({ kind: 'control', path: file, title, status: 'current', format: 'markdown' });
  let manifest = null;
  try { manifest = JSON.parse(texts.get('workbench/manifest.json') ?? readSource(root, 'workbench/manifest.json')); } catch { manifest = null; }
  for (const kind of ['adr', 'ddr']) {
    if (!manifest?.collections?.[kind]) continue;
    let records = [];
    try { records = listAdrs(root, { kind }); } catch { records = []; }
    for (const record of records) add({ kind, path: record.relativePath, title: record.title || record.id, id: record.id, status: record.status || 'unknown', format: 'markdown' });
    for (const name of ['REGISTER.md', 'HISTORY.md']) {
      const file = `${manifest.collections[kind]}/${name}`;
      if (fs.existsSync(path.join(root, file))) add({ kind, path: file, title: `${kind.toUpperCase()} ${name === 'REGISTER.md' ? 'register' : 'history'}`, status: 'navigation projection', format: 'markdown' });
    }
  }
  for (const artifact of sources.artifacts) add(artifact);
  const revision = createHash('sha256').update(`${JSON.stringify(sources.errors)}\0`);
  for (const artifact of artifacts) revision.update(`${artifact.path}\0${createHash('sha256').update(texts.get(artifact.path)).digest('hex')}\0`);
  return { artifacts, texts, errors: sources.errors, revision: revision.digest('hex') };
}

const indexes = new Map();

// The search/backlink index, rebuilt only when the catalog's content revision
// changes. Each request rereads the catalog through the safe reader to key it.
function searchIndex(root, readSource) {
  const catalog = routeCatalog(root, readSource);
  const cached = indexes.get(root);
  if (cached?.revision === catalog.revision && cached.readSource === readSource) return cached;
  const entries = catalog.artifacts.map(artifact => {
    const raw = catalog.texts.get(artifact.path);
    const json = artifact.format === 'json';
    let text = raw;
    if (json) {
      try { text = stringsOf(JSON.parse(raw)).join(' '); } catch { text = raw; }
    } else {
      text = plainText(raw.replace(/^#+\s+/gm, ''));
    }
    const links = new Set(json ? [] : markdownLinks(raw).map(link => resolveLink(artifact.path, link)).filter(Boolean));
    return { kind: artifact.kind, id: artifact.id, path: artifact.path, title: artifact.title, status: artifact.status, text, lower: text.toLowerCase(), links };
  });
  const index = { revision: catalog.revision, readSource, entries, errors: catalog.errors };
  indexes.set(root, index);
  return index;
}

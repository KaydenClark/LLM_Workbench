#!/usr/bin/env node
// Architecture decision records: create, validate, and derive the register.
//
// An ADR owns rationale. Its rule binds only where `canonicalized_in` points,
// so validation checks that every named owner exists. A durable reference into
// an untracked session collection is not evidence and is reported.
import fs from 'node:fs';
import path from 'node:path';
import { finding } from './diagnostics.mjs';
import { allocateVisibleId, compareVisibleIds, visibleIdKey } from './visible-ids.mjs';
import { assertSafeReadPath, assertSafeWritePath, writeSafeFile, collectionPath, collectionRelative, findRoot, isMainModule, IGNORED_COLLECTIONS } from './workbench-paths.mjs';

export const STATUSES = Object.freeze(['proposed', 'accepted', 'superseded', 'rejected']);
export const REGISTER_NAME = 'REGISTER.md';
const ID_PATTERN = /^([0-9A-Za-z]{3,})-([a-z0-9]+(?:-[a-z0-9]+)*)\.md$/;

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

export function listAdrs(root, options = {}) {
  const directory = collectionPath(root, 'adr');
  assertSafeReadPath(root, directory);
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true })
    .filter((entry) => ID_PATTERN.test(entry.name))
    .map((entry) => {
      const stat = fs.lstatSync(path.join(directory, entry.name));
      if (!stat.isFile() || stat.isSymbolicLink() || stat.nlink > 1) {
        throw new Error(`${entry.name} must be an ordinary, singly linked ADR file; allocation cannot ignore an occupied identity`);
      }
      return entry;
    })
    .map((entry) => entry.name)
    .map((name) => readAdr(root, path.join(directory, name), options.contentOverrides?.get(path.join(directory, name))))
    .sort((a, b) => compareVisibleIds(`ADR-${a.number}`, `ADR-${b.number}`) || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
}

function readAdr(root, filePath, content = fs.readFileSync(filePath, 'utf8')) {
  const { data, body } = parseFrontmatter(content);
  const name = path.basename(filePath);
  const [, number, slug] = name.match(ID_PATTERN);
  const title = body.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? null;
  return { root, filePath, relativePath: path.relative(root, filePath).split(path.sep).join('/'), name, number, slug, title, data, body };
}

export function validateAdrs(root, options = {}) {
  const findings = [];
  let adrs;
  try { adrs = listAdrs(root, options); }
  catch (error) { return [finding('invalid-adr', error.message)]; }
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
    if (!STATUSES.includes(data.status)) findings.push(finding('invalid-adr', `${adr.relativePath} status must be one of ${STATUSES.join(', ')}`, { adr: adr.name }));
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(data.date ?? ''))) findings.push(finding('invalid-adr', `${adr.relativePath} needs a YYYY-MM-DD date`, { adr: adr.name }));
    if (!adr.title) findings.push(finding('invalid-adr', `${adr.relativePath} needs a title heading`, { adr: adr.name }));
    if (data.status === 'accepted') {
      const owners = Array.isArray(data.canonicalized_in) ? data.canonicalized_in : (data.canonicalized_in ? [data.canonicalized_in] : []);
      if (owners.length === 0) findings.push(finding('invalid-adr', `${adr.relativePath} is accepted but names no canonicalized_in owner`, { adr: adr.name }));
      for (const owner of owners) {
        const target = path.resolve(root, owner);
        if (!target.startsWith(path.resolve(root) + path.sep) || !fs.existsSync(target)) {
          findings.push(finding('invalid-adr', `${adr.relativePath} canonicalized_in target ${owner} does not exist`, { adr: adr.name, owner }));
        }
      }
    }
    if (data.status === 'superseded' && !data.superseded_by) {
      findings.push(finding('invalid-adr', `${adr.relativePath} is superseded but names no superseded_by`, { adr: adr.name }));
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

export function renderRegister(adrs) {
  const lines = [
    '# ADR Register',
    '',
    '> Derived by `adr.mjs register`; do not edit by hand. The directory listing is the source; this table is a projection.',
    '',
    '| ADR | Title | Status | Date | Canonicalized in |',
    '|---|---|---|---|---|'
  ];
  for (const adr of adrs) {
    const owners = Array.isArray(adr.data?.canonicalized_in) ? adr.data.canonicalized_in : (adr.data?.canonicalized_in ? [adr.data.canonicalized_in] : []);
    lines.push(`| [${adr.number}](${adr.name}) | ${cell(adr.title ?? '')} | ${cell(adr.data?.status ?? '')} | ${cell(adr.data?.date ?? '')} | ${cell(owners.join(', ') || 'none')} |`);
  }
  return `${lines.join('\n')}\n`;
}

export function writeRegister(root) {
  const registerPath = path.join(collectionPath(root, 'adr'), REGISTER_NAME);
  assertSafeWritePath(root, registerPath);
  const adrs = listAdrs(root);
  const content = renderRegister(adrs);
  writeSafeFile(root, registerPath, content);
  return { registerPath, count: adrs.length };
}

export function newAdr(root, options) {
  const title = requireValue(options.title, '--title is required');
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (!slug) throw new Error('title must contain letters or digits');
  const directory = collectionPath(root, 'adr');
  assertSafeWritePath(root, path.join(directory, REGISTER_NAME));
  const occupied = listAdrs(root).map(adr => `ADR-${adr.number}`);
  const next = allocateVisibleId('ADR', occupied, { width: 4, requireLetter: true }).slice(4);
  const filePath = path.join(directory, `${next}-${slug}.md`);
  if (fs.existsSync(filePath)) throw new Error(`${filePath} already exists`);
  const date = options.date ?? new Date().toISOString().slice(0, 10);
  const content = [
    '---',
    'status: proposed',
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

function localLinks(content) {
  const links = [];
  for (const match of content.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const value = match[1].split('#')[0];
    if (!value || /^(?:https?:|mailto:)/.test(value)) continue;
    links.push(decodeURIComponent(value));
  }
  return links;
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
    } else {
      throw new Error('Usage: adr.mjs validate [--json] | normalize [--date YYYY-MM-DD] [--json] | register | new --title "Decision title" [--date YYYY-MM-DD]');
    }
  } catch (error) {
    console.error(`error: ${error.message}`);
    process.exitCode = 1;
  }
}

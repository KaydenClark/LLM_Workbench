#!/usr/bin/env node
// Architecture decision records: create, validate, and derive the register.
//
// An ADR owns rationale. Its rule binds only where `canonicalized_in` points,
// so validation checks that every named owner exists. A durable reference into
// an untracked session collection is not evidence and is reported.
import fs from 'node:fs';
import path from 'node:path';
import { finding } from './diagnostics.mjs';
import { assertSafeWritePath, writeSafeFile, collectionPath, collectionRelative, findRoot, isMainModule, UNTRACKED_COLLECTIONS } from './workbench-paths.mjs';

export const STATUSES = Object.freeze(['proposed', 'accepted', 'superseded', 'rejected']);
export const REGISTER_NAME = 'REGISTER.md';
const ID_PATTERN = /^(\d{4})-([a-z0-9]+(?:-[a-z0-9]+)*)\.md$/;

export function parseFrontmatter(content) {
  if (!content.startsWith('---\n')) return { data: null, body: content };
  const end = content.indexOf('\n---\n', 4);
  if (end < 0) return { data: null, body: content };
  const data = {};
  let key = null;
  for (const line of content.slice(4, end).split('\n')) {
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
  return { data, body: content.slice(end + 5) };
}

export function listAdrs(root) {
  const directory = collectionPath(root, 'adr');
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && ID_PATTERN.test(entry.name))
    .map((entry) => entry.name)
    .sort()
    .map((name) => readAdr(root, path.join(directory, name)));
}

function readAdr(root, filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const { data, body } = parseFrontmatter(content);
  const name = path.basename(filePath);
  const [, number, slug] = name.match(ID_PATTERN);
  const title = body.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? null;
  return { root, filePath, relativePath: path.relative(root, filePath).split(path.sep).join('/'), name, number, slug, title, data, body };
}

export function validateAdrs(root) {
  const findings = [];
  const adrs = listAdrs(root);
  const numbers = new Map();
  for (const adr of adrs) {
    const seen = numbers.get(adr.number) ?? [];
    seen.push(adr.name);
    numbers.set(adr.number, seen);
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
      for (const collection of UNTRACKED_COLLECTIONS) {
        if (relative.startsWith(`${collectionRelative(root, collection)}/`)) {
          findings.push(finding('untracked-provenance', `${adr.relativePath} references untracked ${relative}; promote it to checkpoints first`, { adr: adr.name, target: relative }));
        }
      }
    }
  }
  for (const [number, names] of numbers) {
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
  const numbers = listAdrs(root).map((adr) => Number(adr.number));
  const next = String((numbers.length ? Math.max(...numbers) : 0) + 1).padStart(4, '0');
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
    'Provenance: [the promoted checkpoint or owner decision, by repository-relative path].',
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
    } else if (command === 'new') {
      console.log(JSON.stringify(newAdr(root, options)));
    } else {
      throw new Error('Usage: adr.mjs validate [--json] | register | new --title "Decision title" [--date YYYY-MM-DD]');
    }
  } catch (error) {
    console.error(`error: ${error.message}`);
    process.exitCode = 1;
  }
}

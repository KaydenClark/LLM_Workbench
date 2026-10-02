#!/usr/bin/env node
// Explicit article designation keeps this rule separate from general Wiki
// provenance. Read raw content, never rendered prose or selected metadata.
import fs from 'node:fs';
import path from 'node:path';
import { assertSafeReadPath, findRoot, isMainModule } from './workbench-paths.mjs';
import { isWorkbenchId, visibleIdParts } from './visible-ids.mjs';

// Delivered artifact types: Spec, Task, ADR, notepad, Landmark and DQC.
// Unknown grammar candidates remain ambiguous until callers designate their
// namespace. They must never silently pass as identifier-free content.
const ARTIFACT_PREFIXES = new Set(['S', 'TK', 'ADR', 'N', 'LMK', 'DQC']);

export class LandmarkWikiRefusal extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'LandmarkWikiRefusal';
    this.code = code;
  }
}

function refuse(code, message) { throw new LandmarkWikiRefusal(code, message); }

export function validateLandmarkArticle(root, article, options = {}) {
  if (typeof root !== 'string' || !root.trim() || root.includes('\0') || typeof article !== 'string' || !article.trim() || article.includes('\0')) {
    refuse('invalid-invocation', 'A repository root and an explicit article path are required.');
  }
  if (!options || typeof options !== 'object' || Array.isArray(options)) refuse('invalid-invocation', 'Options must be an object with an optional extraPrefixes array.');
  const extraPrefixes = options.extraPrefixes ?? [];
  if (options.extraPrefixes === null || !Array.isArray(extraPrefixes) || extraPrefixes.some(prefix => typeof prefix !== 'string' || visibleIdParts(`${prefix}-0`)?.prefix !== prefix)) {
    refuse('invalid-invocation', 'extraPrefixes must be an array of type prefixes: 1–16 uppercase letters/digits, starting with a letter.');
  }
  const prefixes = new Set([...ARTIFACT_PREFIXES, ...extraPrefixes]);
  const base = path.resolve(root);
  if (article.includes('\\')) refuse('unsafe-article', 'Use a native absolute path or a project-relative path with forward slashes.');
  const target = path.resolve(base, article);
  try {
    const rootEntry = fs.lstatSync(base);
    if (!rootEntry.isDirectory() || rootEntry.isSymbolicLink()) refuse('unsafe-article', 'The repository root must be an ordinary directory.');
    assertSafeReadPath(base, target);
  } catch (error) {
    if (error instanceof LandmarkWikiRefusal) throw error;
    refuse('unsafe-article', error.message);
  }
  const relative = path.relative(base, target).split(path.sep).join('/');
  if (path.extname(target).toLowerCase() !== '.md') refuse('invalid-article', `${relative} must be a Markdown (.md) article.`);
  let bytes;
  try {
    if (!fs.lstatSync(target).isFile()) refuse('invalid-article', `${relative} must be an ordinary file.`);
    bytes = fs.readFileSync(target);
  } catch (error) {
    if (error instanceof LandmarkWikiRefusal) throw error;
    refuse(error.code === 'ENOENT' ? 'missing-article' : 'unreadable-article', `${relative}: ${error.message}`);
  }
  let content;
  try { content = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes); }
  catch { refuse('unreadable-article', `${relative} must contain readable UTF-8 Markdown.`); }
  if (!content.trim() || content.includes('\0')) refuse('invalid-article', `${relative} must contain nonempty readable Markdown.`);

  // Decode one layer of percent-encoded bytes for URL/link spellings while
  // retaining each decoded character's original source position. Scan the
  // full content rather than guessing which Markdown spans are rendered.
  let decoded = '';
  const positions = [];
  for (let index = 0; index < content.length; index++) {
    positions.push(index);
    if (content[index] === '%' && /^[0-9A-Fa-f]{2}$/.test(content.slice(index + 1, index + 3))) {
      decoded += String.fromCharCode(Number.parseInt(content.slice(index + 1, index + 3), 16));
      index += 2;
    } else decoded += content[index];
  }
  const findings = [];
  for (const match of decoded.matchAll(/(?<![A-Za-z0-9])([A-Z][A-Z0-9]{0,15}-[0-9A-Za-z]+)(?![A-Za-z0-9])/g)) {
    const id = match[1];
    const known = prefixes.has(visibleIdParts(id)?.prefix) || isWorkbenchId(id);
    const before = content.slice(0, positions[match.index]);
    const line = before.split('\n').length;
    const column = Array.from(before.slice(before.lastIndexOf('\n') + 1)).length + 1;
    findings.push({
      code: known ? 'landmark-wbid' : 'landmark-ambiguous', id, article: relative, line, column,
      byteOffset: Buffer.byteLength(before, 'utf8'),
      message: known
        ? `${id} at ${relative}:${line}:${column}; keep identity provenance in structured records, outside readable Landmark article bytes.`
        : `${id} at ${relative}:${line}:${column} matches visible identity grammar with an undesignated type; designate its namespace with --prefix or clarify the article wording.`
    });
  }
  const status = findings.some(hit => hit.code === 'landmark-wbid') ? 'invalid' : findings.length ? 'incomplete' : 'valid';
  return { status, article: relative, findings };
}

const USAGE = 'landmark-wiki.mjs validate ARTICLE.md [--path PROJECT] [--prefix TYPE ...] [--json]';

function parseArgs(argv) {
  if (argv[0] !== 'validate' || !argv[1] || argv[1].startsWith('--')) refuse('invalid-invocation', USAGE);
  const options = {};
  for (let index = 2; index < argv.length; index++) {
    const key = argv[index];
    if (!['--path', '--prefix', '--json'].includes(key) || (key !== '--prefix' && Object.hasOwn(options, key))) refuse('invalid-invocation', `Unexpected or repeated option ${key}. ${USAGE}`);
    if (key === '--json') options[key] = true;
    else {
      const value = argv[++index];
      if (!value || value.startsWith('--')) refuse('invalid-invocation', `${key} needs a value. ${USAGE}`);
      if (key === '--prefix') options[key] = [...(options[key] ?? []), value];
      else options[key] = value;
    }
  }
  return { article: argv[1], options };
}

if (isMainModule(import.meta.url)) {
  const argv = process.argv.slice(2);
  const json = argv.includes('--json');
  try {
    const { article, options } = parseArgs(argv);
    const result = validateLandmarkArticle(findRoot(options['--path'] ?? process.cwd()), article, { extraPrefixes: options['--prefix'] ?? [] });
    if (json) process.stdout.write(`${JSON.stringify(result)}\n`);
    else process.stdout.write(result.status === 'valid' ? `valid: ${result.article}\n` : `${result.findings.map(hit => `${hit.code}: ${hit.message}`).join('\n')}\n`);
    if (result.status !== 'valid') process.exitCode = 1;
  } catch (error) {
    const result = { status: 'blocked', error: { code: error instanceof LandmarkWikiRefusal ? error.code : 'landmark-wiki-failure', message: error.message } };
    if (json) process.stdout.write(`${JSON.stringify(result)}\n`);
    else process.stderr.write(`blocked (${result.error.code}): ${result.error.message}\n`);
    process.exitCode = 1;
  }
}

#!/usr/bin/env node
// Explicit article designation keeps this rule separate from general Wiki
// provenance. Read raw content, never rendered prose or selected metadata.
import fs from 'node:fs';
import path from 'node:path';
import { assertSafeReadPath, findRoot, isMainModule } from './workbench-paths.mjs';
import { isWorkbenchId, visibleIdParts } from './visible-ids.mjs';

// Delivered artifact types: Spec, Task, ADR, notepad, Landmark and DQC.
// Prefix scope avoids classifying arbitrary hyphenated words as identities;
// suffixes retain legacy decimal/base62 forms as well as widened base36.
const ARTIFACT_PREFIXES = new Set(['S', 'TK', 'ADR', 'N', 'LMK', 'DQC']);

export class LandmarkWikiRefusal extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'LandmarkWikiRefusal';
    this.code = code;
  }
}

function refuse(code, message) { throw new LandmarkWikiRefusal(code, message); }

export function validateLandmarkArticle(root, article) {
  if (typeof root !== 'string' || !root.trim() || root.includes('\0') || typeof article !== 'string' || !article.trim() || article.includes('\0')) {
    refuse('invalid-invocation', 'A repository root and an explicit article path are required.');
  }
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

  const findings = [];
  for (const match of content.matchAll(/(?<![A-Za-z0-9])([A-Z][A-Z0-9]{0,15}-[0-9A-Za-z]+)(?![A-Za-z0-9])/g)) {
    const id = match[1];
    if (!ARTIFACT_PREFIXES.has(visibleIdParts(id)?.prefix) && !isWorkbenchId(id)) continue;
    const before = content.slice(0, match.index);
    const line = before.split('\n').length;
    const column = Array.from(before.slice(before.lastIndexOf('\n') + 1)).length + 1;
    findings.push({
      code: 'landmark-wbid', id, article: relative, line, column,
      byteOffset: Buffer.byteLength(before, 'utf8'),
      message: `${id} at ${relative}:${line}:${column}; keep identity provenance in structured records, outside readable Landmark article bytes.`
    });
  }
  return { status: findings.length ? 'invalid' : 'valid', article: relative, findings };
}

const USAGE = 'landmark-wiki.mjs validate ARTICLE.md [--path PROJECT] [--json]';

function parseArgs(argv) {
  if (argv[0] !== 'validate' || !argv[1] || argv[1].startsWith('--')) refuse('invalid-invocation', USAGE);
  const options = {};
  for (let index = 2; index < argv.length; index++) {
    const key = argv[index];
    if (!['--path', '--json'].includes(key) || Object.hasOwn(options, key)) refuse('invalid-invocation', `Unexpected or repeated option ${key}. ${USAGE}`);
    if (key === '--json') options[key] = true;
    else {
      const value = argv[++index];
      if (!value || value.startsWith('--')) refuse('invalid-invocation', `--path needs a project path. ${USAGE}`);
      options[key] = value;
    }
  }
  return { article: argv[1], options };
}

if (isMainModule(import.meta.url)) {
  const argv = process.argv.slice(2);
  const json = argv.includes('--json');
  try {
    const { article, options } = parseArgs(argv);
    const result = validateLandmarkArticle(findRoot(options['--path'] ?? process.cwd()), article);
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

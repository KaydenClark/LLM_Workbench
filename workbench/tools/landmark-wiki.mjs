#!/usr/bin/env node
// Name-and-context identifier rule (Wiki schema, Update section; AGENTS.md
// Documentation Ownership And Proof): an identifier is welcome on a page when
// the artifact's name sits beside it, and only a BARE identifier is reported.
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

// A name is a phrase of words; identifiers and punctuation are not words.
// Lowercase function words and bare artifact-kind words ("Spec", "Task") do
// not make a phrase a name, so "See Spec S-002A" stays bare.
const WORD = "[A-Za-z][A-Za-z'’]*(?:-[A-Za-z][A-Za-z'’]*)*";
const NON_NAME = new Set(['a', 'an', 'the', 'of', 'in', 'on', 'to', 'for', 'and', 'or', 'by', 'as', 'at', 'is', 'are', 'was', 'were', 'be', 'it', 'its', 'this', 'that', 'these', 'those', 'with', 'from', 'through', 'see', 'per', 'via', 'also', 'then', 'now',
  'spec', 'specs', 'task', 'tasks', 'adr', 'adrs', 'note', 'notes', 'notepad', 'notepads', 'card', 'cards', 'decision', 'decisions', 'question', 'questions', 'id', 'ids', 'identifier', 'identifiers']);
const BEFORE_PHRASE = new RegExp(`(?<![A-Za-z0-9_'’-])(${WORD}(?:[ \\t]+${WORD})*)([\\s:\\-–—()\\[\\]\`*_"“”'’]*)$`);
const AFTER_PHRASE = new RegExp(`^([\\s)\\]\`*_"”'’]*)([:\\-–—(\\[]?)([\\s"“\`*_]*)(${WORD}(?:[ \\t]+${WORD})*)(?![A-Za-z0-9_])`);
// A path slug is lowercase hyphenated segments after the identifier. Later
// segments may start with a digit ("-v3-1-2-follow-ups"), but at least two
// segments must start with a letter so "-v3-1" or "-history" stays bare.
const SLUG_AFTER = /^(?:-[a-z0-9]+)+/;
const slugNamesArtifact = after => {
  const slug = SLUG_AFTER.exec(after);
  return Boolean(slug) && slug[0].split('-').slice(1).filter(segment => /^[a-z]/.test(segment)).length >= 2;
};

const capitalized = word => /^[A-Z]/.test(word);
const substantive = words => words.filter(word => !NON_NAME.has(word.toLowerCase()));

// Two substantive lowercase-tolerant words, or two capitalized words with one
// substantive, make a name. `delimited` means a wrapper or separator sits
// between the phrase and the identifier.
function phraseIsName(words, delimited, fromEnd) {
  if (delimited) return substantive(words).length >= 2;
  const run = [];
  for (const word of fromEnd ? [...words].reverse() : words) {
    if (!capitalized(word)) break;
    run.push(word);
  }
  return run.length >= 2 && substantive(run).length >= 1;
}

function linkTextIsName(text) {
  const words = [...text.matchAll(new RegExp(WORD, 'g'))].map(match => match[0]).filter(word => !NON_NAME.has(word.toLowerCase()));
  return words.length >= 2;
}

// Decide whether the identifier at `column` of one masked line has the
// artifact's name beside it: inside a link whose text names it, followed by a
// path slug of two or more words, or adjacent to a name phrase.
function hasNameAndContext(masked, column, length) {
  const before = masked.slice(0, column);
  const after = masked.slice(column + length);
  if (slugNamesArtifact(after)) return true;
  for (const link of masked.matchAll(/\[([^\]]*)\]\(([^)]*)\)/g)) {
    const targetStart = link.index + link[1].length + 3;
    if (column >= targetStart && column < targetStart + link[2].length) return linkTextIsName(link[1].replace(/[*_`#]/g, ' '));
  }
  const reference = /^\s*\[([^\]]+)\]:\s*\S+/.exec(masked);
  if (reference && column > reference[0].length - reference[0].trimStart().length + reference[1].length + 2) return linkTextIsName(reference[1].replace(/[*_`#]/g, ' '));
  const beforeMatch = BEFORE_PHRASE.exec(before);
  if (beforeMatch && phraseIsName(beforeMatch[1].split(/[ \t]+/), /\S/.test(beforeMatch[2]), true)) return true;
  const afterMatch = AFTER_PHRASE.exec(after);
  if (afterMatch) {
    const opener = afterMatch[2] || /["“`*_]/.test(afterMatch[3]);
    if (phraseIsName(afterMatch[4].split(/[ \t]+/), Boolean(opener), false)) return true;
  }
  return false;
}

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
  const ID_PATTERN = /(?<![A-Za-z0-9])([A-Z][A-Z0-9]{0,15}-[0-9A-Za-z]+)(?![A-Za-z0-9])/g;
  for (const match of decoded.matchAll(ID_PATTERN)) {
    const id = match[1];
    const lineStart = decoded.lastIndexOf('\n', match.index - 1) + 1;
    const lineEndAt = decoded.indexOf('\n', match.index);
    const text = decoded.slice(lineStart, lineEndAt === -1 ? decoded.length : lineEndAt);
    // Other identifiers on the line never count as the name of this one.
    const masked = text.replace(ID_PATTERN, hit => '#'.repeat(hit.length));
    if (hasNameAndContext(masked, match.index - lineStart, id.length)) continue;
    const known = prefixes.has(visibleIdParts(id)?.prefix) || isWorkbenchId(id);
    const before = content.slice(0, positions[match.index]);
    const line = before.split('\n').length;
    const column = Array.from(before.slice(before.lastIndexOf('\n') + 1)).length + 1;
    findings.push({
      code: known ? 'landmark-bare-id' : 'landmark-ambiguous', id, article: relative, line, column,
      byteOffset: Buffer.byteLength(before, 'utf8'),
      message: known
        ? `${id} at ${relative}:${line}:${column} is a bare identifier; add the artifact's name and context beside it, for example "<artifact name> (${id})", and keep the identifier.`
        : `${id} at ${relative}:${line}:${column} matches visible identity grammar with an undesignated type and has no name beside it; add the artifact's name and context, or designate its namespace with --prefix if it is an identifier, and keep the token.`
    });
  }
  const status = findings.some(hit => hit.code === 'landmark-bare-id') ? 'invalid' : findings.length ? 'incomplete' : 'valid';
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

#!/usr/bin/env node
// Prepare a source-linked Blueprint grilling note from an explicit, bounded
// request. The caller classifies statements as facts or uncertainty; this tool
// verifies only the identity and bytes of the named source files.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createNote } from './notepads.mjs';
import { scanPrivacy } from './privacy.mjs';
import { assertSafeReadPath, collectionRelative, isMainModule, manifestPath, readManifest } from './workbench-paths.mjs';

export const REQUEST_SCHEMA_VERSION = 'project-evidence-request-1';
export const EVIDENCE_SCHEMA_VERSION = 'project-evidence-1';

const MAX_REQUEST_BYTES = 256 * 1024;
const MAX_SOURCE_BYTES = 1024 * 1024;
const MAX_EVIDENCE = 50;
const MAX_QUESTIONS = 50;
const MAX_TEXT = 4000;
const ID = /^[A-Za-z0-9]+(?:[-_][A-Za-z0-9]+)*$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SHA256 = /^[a-f0-9]{64}$/;

function blocked(code, message, details = {}) {
  return { status: 'blocked', error: { code, message, ...details } };
}

function object(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${label} must be an object`);
  return value;
}

function exactKeys(value, allowed, required, label) {
  object(value, label);
  const extra = Object.keys(value).filter((key) => !allowed.includes(key));
  const missing = required.filter((key) => !Object.hasOwn(value, key));
  if (extra.length) throw new Error(`${label} has unsupported fields: ${extra.join(', ')}`);
  if (missing.length) throw new Error(`${label} is missing fields: ${missing.join(', ')}`);
}

function text(value, label, { slug = false, id = false } = {}) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${label} must be a nonempty string`);
  if (value !== value.trim()) throw new Error(`${label} must not have surrounding whitespace`);
  if (value.length > MAX_TEXT) throw new Error(`${label} exceeds ${MAX_TEXT} characters`);
  if (slug && !SLUG.test(value)) throw new Error(`${label} must be a lowercase slug`);
  if (id && !ID.test(value)) throw new Error(`${label} must be a stable identifier`);
  return value;
}

function ordinaryFile(file, label) {
  let entry;
  try { entry = fs.lstatSync(file); } catch (error) {
    if (error.code === 'ENOENT') throw new Error(`${label} does not exist`);
    throw error;
  }
  if (!entry.isFile() || entry.isSymbolicLink() || entry.nlink > 1) {
    throw new Error(`${label} must be an ordinary, unshared file`);
  }
  return entry;
}

function validateRoot(root) {
  const resolved = path.resolve(root);
  let entry;
  try { entry = fs.lstatSync(resolved); } catch (error) {
    if (error.code === 'ENOENT') throw new Error('project root does not exist');
    throw error;
  }
  if (!entry.isDirectory() || entry.isSymbolicLink()) throw new Error('project root must be an ordinary directory');
  const file = manifestPath(resolved);
  assertSafeReadPath(resolved, file);
  ordinaryFile(file, 'workbench manifest');
  const manifest = readManifest(resolved);
  if (manifest?.schemaVersion !== 2) throw new Error('project root must declare a schema 2 Workbench manifest');
  // Resolve now so an unsafe or absent declaration is refused before evidence
  // is read and before createNote could create a directory.
  if (!manifest.collections?.notepads) throw new Error('project manifest must declare the notepads collection');
  collectionRelative(resolved, 'notepads');
  return resolved;
}

function requestFile(root, input) {
  const resolved = path.resolve(text(input, '--input'));
  try { assertSafeReadPath(root, resolved); } catch {
    const error = new Error('request file must be an ordinary path inside the project root');
    error.code = 'unsafe-request';
    throw error;
  }
  const entry = ordinaryFile(resolved, 'request file');
  if (entry.size > MAX_REQUEST_BYTES) throw new Error(`request file exceeds ${MAX_REQUEST_BYTES} bytes`);
  const raw = fs.readFileSync(resolved, 'utf8');
  if (raw.includes('\u0000')) throw new Error('request file must be UTF-8 text');
  const leak = scanPrivacy(raw);
  if (leak.length) {
    const error = new Error(`request content matches ${[...new Set(leak.map((hit) => hit.label))].join(', ')}`);
    error.code = 'privacy-boundary';
    error.hits = leak;
    throw error;
  }
  try { return JSON.parse(raw); } catch { throw new Error('request file is not valid JSON'); }
}

function relativeSource(value) {
  const source = text(value, 'evidence source');
  if (path.isAbsolute(source) || source.includes('\\') || source.split('/').some((part) => !part || part === '..' || part.startsWith('.')) || path.posix.normalize(source) !== source) {
    throw new Error('evidence source must be a normalized, visible project-relative path');
  }
  return source;
}

function sourceRecord(root, item) {
  const relative = relativeSource(item.source);
  const absolute = path.resolve(root, relative);
  try { assertSafeReadPath(root, absolute); } catch (error) {
    const failure = new Error(error.message);
    failure.code = 'unsafe-source';
    throw failure;
  }
  let entry;
  try { entry = ordinaryFile(absolute, `evidence source ${relative}`); } catch (error) {
    error.code = 'unsafe-source';
    throw error;
  }
  if (entry.size > MAX_SOURCE_BYTES) throw new Error(`evidence source ${relative} exceeds ${MAX_SOURCE_BYTES} bytes`);
  const bytes = fs.readFileSync(absolute);
  let content;
  try { content = new TextDecoder('utf-8', { fatal: true }).decode(bytes); }
  catch { throw new Error(`evidence source ${relative} must be UTF-8 text`); }
  if (content.includes('\u0000')) throw new Error(`evidence source ${relative} must be text`);
  const leak = scanPrivacy(content);
  if (leak.length) {
    const failure = new Error(`evidence source ${relative} matches ${[...new Set(leak.map((hit) => hit.label))].join(', ')}`);
    failure.code = 'privacy-boundary';
    failure.hits = leak.map((hit) => ({ source: relative, ...hit }));
    throw failure;
  }
  const source = {
    file: relative,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex')
  };
  if (!SHA256.test(source.sha256)) throw new Error(`could not identify evidence source ${relative}`);
  const hasStart = item.line_start !== undefined;
  const hasEnd = item.line_end !== undefined;
  if (hasStart !== hasEnd) throw new Error(`evidence ${item.id} must provide both line_start and line_end`);
  if (hasStart) {
    const lineCount = content.split(/\r?\n/).length;
    if (!Number.isSafeInteger(item.line_start) || !Number.isSafeInteger(item.line_end) || item.line_start < 1 || item.line_end < item.line_start || item.line_end > lineCount) {
      throw new Error(`evidence ${item.id} has a line range outside ${relative}`);
    }
    source.line_start = item.line_start;
    source.line_end = item.line_end;
  }
  return source;
}

function validateRequest(root, request) {
  exactKeys(request, ['schema_version', 'project', 'objective', 'evidence', 'questions'], ['schema_version', 'project', 'objective', 'evidence', 'questions'], 'request');
  if (request.schema_version !== REQUEST_SCHEMA_VERSION) throw new Error(`schema_version must be ${REQUEST_SCHEMA_VERSION}`);
  exactKeys(request.project, ['name'], ['name'], 'project');
  const projectName = text(request.project.name, 'project.name');
  exactKeys(request.objective, ['key', 'title', 'focus'], ['key', 'title', 'focus'], 'objective');
  const objective = {
    key: text(request.objective.key, 'objective.key', { slug: true }),
    title: text(request.objective.title, 'objective.title'),
    focus: text(request.objective.focus, 'objective.focus')
  };
  if (!Array.isArray(request.evidence) || request.evidence.length < 1 || request.evidence.length > MAX_EVIDENCE) {
    throw new Error(`evidence must contain 1-${MAX_EVIDENCE} items`);
  }
  if (!Array.isArray(request.questions) || request.questions.length < 1 || request.questions.length > MAX_QUESTIONS) {
    throw new Error(`questions must contain 1-${MAX_QUESTIONS} items`);
  }
  const evidenceIds = new Set();
  const items = request.evidence.map((item, index) => {
    const label = `evidence[${index}]`;
    exactKeys(item, ['id', 'source', 'line_start', 'line_end', 'kind', 'statement'], ['id', 'source', 'kind', 'statement'], label);
    const id = text(item.id, `${label}.id`, { id: true });
    if (evidenceIds.has(id)) throw new Error(`evidence id ${id} is duplicated`);
    evidenceIds.add(id);
    if (!['fact', 'uncertainty'].includes(item.kind)) throw new Error(`${label}.kind must be fact or uncertainty`);
    const statement = text(item.statement, `${label}.statement`);
    return { id, kind: item.kind, statement, source: sourceRecord(root, item) };
  });
  const questionIds = new Set();
  const questions = request.questions.map((item, index) => {
    const label = `questions[${index}]`;
    exactKeys(item, ['id', 'question', 'recommendation', 'evidence'], ['id', 'question', 'recommendation', 'evidence'], label);
    const id = text(item.id, `${label}.id`, { id: true });
    if (questionIds.has(id)) throw new Error(`question id ${id} is duplicated`);
    questionIds.add(id);
    if (!Array.isArray(item.evidence) || item.evidence.length < 1) throw new Error(`${label}.evidence must name at least one evidence id`);
    const references = item.evidence.map((reference) => text(reference, `${label}.evidence reference`, { id: true }));
    if (new Set(references).size !== references.length) throw new Error(`${label}.evidence contains a duplicate reference`);
    const missing = references.filter((reference) => !evidenceIds.has(reference));
    if (missing.length) throw new Error(`${label}.evidence names unknown ids: ${missing.join(', ')}`);
    return {
      id,
      status: 'open',
      question: text(item.question, `${label}.question`),
      recommendation: text(item.recommendation, `${label}.recommendation`),
      evidence: references
    };
  });
  return {
    projectName,
    objective,
    evidence: {
      schema_version: EVIDENCE_SCHEMA_VERSION,
      project: { name: projectName },
      items,
      semantic_boundary: 'Fact and uncertainty labels are caller assertions; the tool verified only source identity and bytes.'
    },
    questions
  };
}

export function prepareEvidence(projectRoot, options = {}) {
  try {
    const root = validateRoot(text(projectRoot, '--project-root'));
    const noteName = text(options.note, '--note', { slug: true });
    const request = requestFile(root, options.input);
    const prepared = validateRequest(root, request);
    const note = `${collectionRelative(root, 'notepads')}/grilling/${noteName}.json`;
    const created = createNote(root, {
      note,
      id: noteName,
      type: 'grilling',
      status: 'PROVISIONAL',
      objective: prepared.objective.key,
      title: prepared.objective.title,
      focus: prepared.objective.focus,
      state: `Evidence prepared for ${prepared.projectName}; owner questions are unanswered.`,
      'next-action': `Ask ${prepared.questions[0].id} with its recommendation.`,
      'view-field': [
        `evidence=${JSON.stringify(prepared.evidence)}`,
        `questions=${JSON.stringify(prepared.questions)}`
      ]
    });
    if (created.status === 'blocked') return created;
    return {
      status: 'prepared',
      note: created.note,
      id: created.id,
      revision: created.revision,
      evidence: prepared.evidence.items.length,
      questions: prepared.questions.length
    };
  } catch (error) {
    return blocked(error.code ?? 'invalid-request', error.message, error.hits ? { hits: error.hits } : {});
  }
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  if (command !== 'prepare') throw new Error('Usage: project-evidence.mjs prepare --project-root PATH --input REQUEST.json --note NAME');
  const allowed = new Set(['project-root', 'input', 'note']);
  const options = {};
  for (let index = 0; index < rest.length; index += 1) {
    const arg = rest[index];
    if (!arg.startsWith('--') || !allowed.has(arg.slice(2))) throw new Error('Unknown argument; accepted options are --project-root, --input and --note');
    const value = rest[++index];
    if (value === undefined) throw new Error(`${arg} needs a value`);
    if (Object.hasOwn(options, arg.slice(2))) throw new Error(`${arg} may be supplied only once`);
    options[arg.slice(2)] = value;
  }
  for (const name of allowed) if (!options[name]) throw new Error(`--${name} is required`);
  return options;
}

if (isMainModule(import.meta.url)) {
  let result;
  try {
    const options = parseArgs(process.argv.slice(2));
    result = prepareEvidence(options['project-root'], options);
  } catch (error) {
    result = blocked('invalid-invocation', error.message);
  }
  process.stdout.write(`${JSON.stringify(result)}\n`);
  if (result.status === 'blocked') process.exitCode = 1;
}

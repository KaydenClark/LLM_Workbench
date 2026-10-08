#!/usr/bin/env node
// The Grill Board: one local page where the owner reads every pending item
// (Spec owner gates, open owner decisions, unsettled Destination Question
// Cards, decision-record texts, page texts) and answers them as a package,
// saving as he goes, across sessions and across Claude and Codex.
//
// Two files, two writers, never crossed:
//   workbench/grill-board/items.json    agents write, through this tool only
//   workbench/grill-board/answers.json  the owner writes, through the served
//                                       page only; untracked; agents read it
//
// An item is never deleted or renumbered. An agent that changes what an item
// proposes runs `revise`, which bumps the item's revision so the owner's older
// answer shows as needing a fresh look. An agent that has carried an answer
// into its durable owner runs `apply`, which copies the owner's verdict, note
// and time into the item so the owner sees it as done and Git keeps his words.
// Everything else about how to process answers is in
// workbench/grill-board/README.md. The tool lives in the root tools lane,
// beside the evaluator and the test suite, because the board is this room's
// working surface and not a managed runtime tool shipped to every room.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { appendEntry, createNote, readNote } from '../workbench/tools/notepads.mjs';
import { dashboardSources } from './dashboard-sources.mjs';
import { createWorkflow, approvalSnapshot } from './dashboard-workflow.mjs';
import { listAdrs } from '../workbench/tools/adr.mjs';

export const ITEMS_SCHEMA = 'grill-board/items@1';
export const ANSWERS_SCHEMA = 'grill-board/answers@1';
export const ID_PREFIX = 'GB';
export const BOARD_DIR = 'workbench/grill-board';
export const ITEMS_FILE = 'items.json';
export const ANSWERS_FILE = 'answers.json';
export const PAGE_FILE = 'index.html';
export const KINDS = Object.freeze(['approve-spec', 'owner-decision', 'confirm-dqc', 'confirm-ddr', 'confirm-text', 'choice']);
export const STATUSES = Object.freeze(['pending', 'stale', 'answered', 'applied', 'withdrawn']);
export const DEFAULT_OPTIONS = Object.freeze({
  'approve-spec': [
    { value: 'approve', label: 'Approve', hint: 'records your approval of the delivered integration content' },
    { value: 'finding', label: 'Send back', hint: 'your note becomes a corrective Task' },
    { value: 'destination_change', label: 'Return to Align', hint: 'the concept changes; recorded, no Tasks invented' },
    { value: 'defer', label: 'Not now', hint: 'stays open; nothing recorded' },
    { value: 'drop', label: 'Drop this Spec', hint: 'an agent proposes supersession or retirement for you to confirm' }
  ],
  default: [
    { value: 'confirm', label: 'Confirm', hint: 'the proposal stands as written' },
    { value: 'correct', label: 'Change', hint: 'request a revised question or concept; your note is required' },
    { value: 'decline', label: 'Rework wording', hint: 'request clearer wording; your note is required' },
    { value: 'defer', label: 'Change the why', hint: 'request revised rationale; your note is required' }
  ]
});
const ITEM_KEYS = Object.freeze(['id', 'key', 'group', 'kind', 'title', 'question', 'current', 'proposal', 'draft', 'options', 'sources', 'tags', 'revision', 'status', 'applied', 'history', 'brief', 'priority', 'value', 'gradeRevision']);
const BRIEF_FIELDS = ['summary', 'why', 'recommendation', 'impact', 'changes', 'history', 'artifacts'];
const ID_PATTERN = /^GB-\d{4}$/;
const MAX_FILE_BYTES = 2 * 1024 * 1024;
const GITHUB_BLOB = 'https://github.com/KaydenClark/LLM_Workbench/blob';

class BoardError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

export function findRoot(start = process.cwd()) {
  let dir = path.resolve(start);
  for (;;) {
    if (fs.existsSync(path.join(dir, 'workbench', 'manifest.json'))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) throw new BoardError('no-room', `No workbench/manifest.json above ${start}`);
    dir = parent;
  }
}

export function boardPaths(root) {
  const dir = path.join(root, BOARD_DIR);
  return { dir, items: path.join(dir, ITEMS_FILE), answers: path.join(dir, ANSWERS_FILE), page: path.join(dir, PAGE_FILE) };
}

function readJson(file, fallback) {
  if (!fs.existsSync(file)) {
    if (fallback !== undefined) return fallback;
    throw new BoardError('missing-file', `${file} does not exist`);
  }
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    throw new BoardError('invalid-json', `${file}: ${error.message}`);
  }
}

// Temp-then-rename so a crash mid-write never leaves a half file behind.
function writeJsonAtomic(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(temp, `${JSON.stringify(value, null, 2)}\n`);
  fs.renameSync(temp, file);
}

function emptyAnswers() {
  return {
    schema: ANSWERS_SCHEMA,
    notice: 'Owner answers. Written only by the served Grill Board page. Agents read this file and never edit it; they record an applied answer in items.json through `grill-board.mjs apply`.',
    owner: 'Kayden',
    answers: {}
  };
}

export function readItems(root) {
  const items = readJson(boardPaths(root).items);
  validateItems(items);
  return items;
}

function answerNote(root) {
  const manifest = readJson(path.join(root,'workbench/manifest.json'),{});
  return manifest.collections?.notepads ? `${manifest.collections.notepads}/grilling/dashboard-answers.json` : null;
}
function notepadResult(result) { if (result.status === 'blocked') throw new BoardError(result.error?.code ?? 'notepad',result.error?.message ?? 'Notepad refused'); return result; }
export function readAnswers(root) {
  const answers = readJson(boardPaths(root).answers, emptyAnswers());
  const note = answerNote(root);
  if (note && fs.existsSync(path.join(root,note))) {
    const loaded = notepadResult(readNote(root,{note}));
    for (const entry of loaded.entries) if (entry.topic === 'dashboard-answer') {
      const saved = JSON.parse(entry.content); answers.answers[saved.id] = saved.answer;
    }
  }
  validateAnswers(answers);
  return answers;
}

function isString(value) {
  return typeof value === 'string';
}

export function validateItem(item, seen = new Set()) {
  const problems = [];
  if (!item || typeof item !== 'object') return ['item is not an object'];
  for (const key of Object.keys(item)) if (!ITEM_KEYS.includes(key)) problems.push(`${item.id ?? '?'}: unknown field ${key}`);
  if (!ID_PATTERN.test(item.id ?? '')) problems.push(`invalid id ${item.id}`);
  else if (seen.has(item.id)) problems.push(`duplicate id ${item.id}`);
  seen.add(item.id);
  if (!isString(item.key) || !item.key) problems.push(`${item.id}: missing key`);
  if (!isString(item.group) || !item.group) problems.push(`${item.id}: missing group`);
  if (!KINDS.includes(item.kind)) problems.push(`${item.id}: unknown kind ${item.kind}`);
  for (const field of ['title', 'question', 'current', 'proposal']) if (!isString(item[field]) || !item[field].trim()) problems.push(`${item.id}: missing ${field}`);
  if (item.draft !== null && !isString(item.draft)) problems.push(`${item.id}: draft must be a string or null`);
  if (item.options !== null) {
    if (!Array.isArray(item.options) || item.options.length < 1) problems.push(`${item.id}: options must be null or a non-empty array`);
    else for (const option of item.options) if (!isString(option?.value) || !isString(option?.label)) problems.push(`${item.id}: option needs value and label`);
  }
  if (!Array.isArray(item.sources)) problems.push(`${item.id}: sources must be an array`);
  else for (const source of item.sources) if (!isString(source?.label) || !isString(source?.path)) problems.push(`${item.id}: source needs label and path`);
  if (!Array.isArray(item.tags) || item.tags.some((tag) => !isString(tag))) problems.push(`${item.id}: tags must be strings`);
  if (!Number.isInteger(item.revision) || item.revision < 1) problems.push(`${item.id}: revision must be a positive integer`);
  if (!['open', 'withdrawn'].includes(item.status)) problems.push(`${item.id}: status must be open or withdrawn`);
  if (item.applied !== null) {
    const applied = item.applied;
    if (!applied || typeof applied !== 'object') problems.push(`${item.id}: applied must be an object or null`);
    else for (const field of ['verdict', 'note', 'answerAt', 'itemRevision', 'by', 'where', 'at']) if (!(field in applied)) problems.push(`${item.id}: applied.${field} missing`);
  }
  if (!Array.isArray(item.history)) problems.push(`${item.id}: history must be an array`);
  for (const field of ['priority', 'value']) if (item[field] !== undefined) {
    const grade = item[field];
    if (!grade || Object.keys(grade).some(key => !['grade','reason'].includes(key)) || !new RegExp(`^${field === 'priority' ? 'P' : 'V'}[1-4]$`).test(grade.grade) || !isString(grade.reason) || !grade.reason.trim()) problems.push(`${item.id}: invalid ${field} grade or reason`);
  }
  if (item.gradeRevision !== undefined && (!Number.isInteger(item.gradeRevision) || item.gradeRevision < 1)) problems.push(`${item.id}: invalid gradeRevision`);
  if (item.brief !== undefined) {
    if (!item.brief || typeof item.brief !== 'object' || Array.isArray(item.brief)) problems.push(`${item.id}: brief must be an object`);
    else {
      if (!['BLUEPRINT', 'LANDMARK', 'SPEC', 'TASK'].includes(item.brief.scope)) problems.push(`${item.id}: brief.scope must name a destination scope`);
      for (const field of BRIEF_FIELDS) if (!isString(item.brief[field]) || !item.brief[field].trim()) problems.push(`${item.id}: brief.${field} is required`);
      for (const field of Object.keys(item.brief)) if (!['scope', ...BRIEF_FIELDS].includes(field)) problems.push(`${item.id}: unknown brief field ${field}`);
    }
  }
  return problems;
}

export function validateItems(board) {
  if (!board || board.schema !== ITEMS_SCHEMA) throw new BoardError('invalid-schema', `items.json schema must be ${ITEMS_SCHEMA}`);
  if (!Array.isArray(board.groups) || !Array.isArray(board.items)) throw new BoardError('invalid-items', 'items.json needs groups[] and items[]');
  const groups = new Set(board.groups.map((group) => group.id));
  const problems = [];
  const seen = new Set();
  for (const item of board.items) {
    problems.push(...validateItem(item, seen));
    if (item.group && !groups.has(item.group)) problems.push(`${item.id}: unknown group ${item.group}`);
  }
  const keys = new Set();
  for (const item of board.items) {
    if (keys.has(item.key)) problems.push(`duplicate key ${item.key}`);
    keys.add(item.key);
  }
  if (problems.length) throw new BoardError('invalid-items', problems.join('; '));
  return board;
}

export function validateAnswers(answers) {
  if (!answers || answers.schema !== ANSWERS_SCHEMA) throw new BoardError('invalid-schema', `answers.json schema must be ${ANSWERS_SCHEMA}`);
  if (!answers.answers || typeof answers.answers !== 'object') throw new BoardError('invalid-answers', 'answers.json needs answers{}');
  for (const [id, answer] of Object.entries(answers.answers)) {
    if (!ID_PATTERN.test(id)) throw new BoardError('invalid-answers', `bad id ${id}`);
    if (!isString(answer.verdict) || !isString(answer.note) || !isString(answer.at) || !Number.isInteger(answer.itemRevision)) throw new BoardError('invalid-answers', `${id}: verdict, note, at and itemRevision required`);
    if (!Array.isArray(answer.history)) throw new BoardError('invalid-answers', `${id}: history required`);
  }
  return answers;
}

export function hasContent(answer) {
  return Boolean(answer && (answer.verdict.trim() || answer.note.trim()));
}

function needsOwnerWords(answer) {
  return ['correct', 'finding', 'destination_change', 'answer', 'return_reworded', 'rework', 'change_why', 'change'].includes(answer?.verdict) && !answer.note.trim();
}

// The one place the five statuses are derived, so page, CLI and tests agree.
export function itemStatus(item, answer) {
  if (item.status === 'withdrawn') return 'withdrawn';
  if (!hasContent(answer)) return 'pending';
  if (answer.itemRevision < item.revision) return 'stale';
  if (!answer.verdict.trim() || answer.verdict === 'defer') return 'pending';
  if (needsOwnerWords(answer)) return 'pending';
  // Timestamp precision alone cannot identify an answer: a revision or edit
  // can share the millisecond of the previously applied answer.
  if (item.applied && item.applied.answerAt === answer.at
    && item.applied.itemRevision === answer.itemRevision
    && item.applied.verdict === answer.verdict && item.applied.note === answer.note) return 'applied';
  return 'answered';
}

export function optionsFor(item) {
  if (item.options) return item.options;
  if (item.kind !== 'approve-spec') return DEFAULT_OPTIONS.default;
  return DEFAULT_OPTIONS[item.kind] ?? DEFAULT_OPTIONS.default;
}

export function mergeBoard(root) {
  const board = readItems(root);
  const answers = readAnswers(root);
  const paths = boardPaths(root);
  const items = board.items.map((item) => {
    const answer = answers.answers[item.id] ?? null;
    return {
      ...item,
      options: optionsFor(item),
      answer,
      derivedStatus: itemStatus(item, answer),
      links: item.sources.map((source) => ({ ...source, url: source.ref && source.ref !== 'untracked' && !path.isAbsolute(source.path) ? `${GITHUB_BLOB}/${source.ref}/${source.path}` : null }))
    };
  });
  const counts = Object.fromEntries(STATUSES.map((status) => [status, 0]));
  for (const item of items) counts[item.derivedStatus] += 1;
  return {
    schema: 'grill-board/view@1',
    title: board.title,
    integration: board.integration,
    generatedAt: board.generatedAt,
    notice: board.notice,
    owner: answers.owner,
    itemsMtime: fs.statSync(paths.items).mtimeMs,
    groups: board.groups,
    counts,
    items
  };
}

export function allocateId(board) {
  let max = 0;
  for (const item of board.items) max = Math.max(max, Number(item.id.slice(3)));
  return `${ID_PREFIX}-${String(max + 1).padStart(4, '0')}`;
}

function now() {
  return new Date().toISOString();
}

function normalizeNewItem(raw) {
  return {
    id: null,
    key: raw.key,
    group: raw.group,
    kind: raw.kind,
    title: raw.title,
    question: raw.question,
    current: raw.current,
    proposal: raw.proposal,
    draft: raw.draft ?? null,
    options: raw.options ?? null,
    sources: raw.sources ?? [],
    tags: raw.tags ?? [],
    revision: 1,
    status: 'open',
    applied: null,
    history: [],
    ...(raw.brief === undefined ? {} : { brief: raw.brief })
  };
}

export function addItems(root, rawItems, { by, reason }) {
  if (!by) throw new BoardError('invalid-invocation', '--by NAME is required');
  const board = readItems(root);
  const keys = new Set(board.items.map((item) => item.key));
  const added = [];
  for (const raw of rawItems) {
    if (keys.has(raw.key)) throw new BoardError('duplicate-key', `an item with key ${raw.key} already exists; use revise`);
    const item = normalizeNewItem(raw);
    item.id = allocateId(board);
    item.history.push({ revision: 1, at: now(), by, reason: reason ?? 'added' });
    const problems = validateItem(item, new Set());
    if (problems.length) throw new BoardError('invalid-item', problems.join('; '));
    board.items.push(item);
    keys.add(item.key);
    added.push(item.id);
  }
  validateItems(board);
  writeJsonAtomic(boardPaths(root).items, board);
  return added;
}

function findItem(board, id) {
  const item = board.items.find((candidate) => candidate.id === id);
  if (!item) throw new BoardError('unknown-item', `${id} is not on the board`);
  return item;
}

export function reviseItem(root, id, changes, { by, reason, expectedRevision }) {
  if (!by || !reason) throw new BoardError('invalid-invocation', '--by NAME and --reason TEXT are required');
  const board = readItems(root);
  const item = findItem(board, id);
  if (expectedRevision !== undefined && expectedRevision !== item.revision) throw new BoardError('stale-item', `${id}: stale revision; read ${item.revision} before revising`);
  const changed = [];
  for (const field of ['title', 'question', 'current', 'proposal', 'draft', 'options', 'brief']) {
    if (changes[field] === undefined) continue;
    changed.push({ field, from: item[field], to: changes[field] });
    item[field] = changes[field];
  }
  if (!changed.length) throw new BoardError('invalid-invocation', 'revise changes nothing');
  item.revision += 1;
  item.history.push({ revision: item.revision, at: now(), by, reason, changes: changed.map((change) => change.field) });
  validateItems(board);
  writeJsonAtomic(boardPaths(root).items, board);
  return item;
}


export function gradeItems(root, grades, { by, reason }) {
  if (!by || !reason || !Array.isArray(grades) || !grades.length) throw new BoardError('invalid-grades', 'grades[], --by and --reason required');
  const board = readItems(root); const seen = new Set();
  for (const row of grades) {
    if (Object.keys(row).some(key => !['id','expectedGradeRevision','priority','value'].includes(key))) throw new BoardError('invalid-grades', 'unknown grade field');
    const item = findItem(board, row.id);
    if (seen.has(row.id)) throw new BoardError('invalid-grades', 'duplicate grade identity');
    seen.add(row.id);
    if (row.expectedGradeRevision !== (item.gradeRevision ?? 0)) throw new BoardError('stale-grade', `${row.id}: stale grade revision`);
    if (!row.priority || !row.value) throw new BoardError('invalid-grades','priority and value required');
    item.priority = row.priority; item.value = row.value; item.gradeRevision = (item.gradeRevision ?? 0) + 1;
    item.history.push({revision:item.revision,gradeRevision:item.gradeRevision,at:now(),by,reason:`graded: ${reason}`});
  }
  validateItems(board); writeJsonAtomic(boardPaths(root).items,board); return grades.map(row => findItem(board,row.id));
}

export function workflow(root) { return createWorkflow(root, { readItems, readAnswers }); }

export function applyAnswer(root, id, { by, where, note }) {
  if (!by || !where) throw new BoardError('invalid-invocation', '--by NAME and --where TEXT are required');
  const board = readItems(root);
  const answers = readAnswers(root);
  const item = findItem(board, id);
  const answer = answers.answers[id];
  if (answer && (!answer.verdict.trim() || answer.verdict === 'defer')) throw new BoardError('no-decision', `${id}: saved notes or a deferred answer are not an applicable decision`);
  if (needsOwnerWords(answer)) throw new BoardError('missing-owner-words', `${id}: this verdict needs the owner's correction or finding in the note`);
  const status = itemStatus(item, answer);
  if (status === 'pending' || status === 'withdrawn') throw new BoardError('nothing-to-apply', `${id} has no owner answer to apply (status ${status})`);
  if (status === 'stale') throw new BoardError('stale-answer', `${id}: the owner answered revision ${answer.itemRevision} but the item is at ${item.revision}; wait for a fresh answer`);
  if (status === 'applied') throw new BoardError('already-applied', `${id} is already applied`);
  item.applied = { verdict: answer.verdict, note: answer.note, answerAt: answer.at, itemRevision: answer.itemRevision, by, where, at: now(), agentNote: note ?? '' };
  item.history.push({ revision: item.revision, at: item.applied.at, by, reason: `applied: ${where}` });
  validateItems(board);
  writeJsonAtomic(boardPaths(root).items, board);
  return item;
}

export function withdrawItem(root, id, { by, reason }) {
  if (!by || !reason) throw new BoardError('invalid-invocation', '--by NAME and --reason TEXT are required');
  const board = readItems(root);
  const item = findItem(board, id);
  item.status = 'withdrawn';
  item.history.push({ revision: item.revision, at: now(), by, reason: `withdrawn: ${reason}` });
  validateItems(board);
  writeJsonAtomic(boardPaths(root).items, board);
  return item;
}

// The only write path for answers.json. It is called by the page through the
// server; the CLI exposes no answer-writing command on purpose.
export function recordAnswer(root, id, { verdict, note, itemRevision, expectedAnswerAt }) {
  const board = readItems(root);
  const item = findItem(board, id);
  if (!isString(verdict) || !isString(note)) throw new BoardError('invalid-answer', 'verdict and note must be strings');
  if (verdict && !optionsFor(item).some((option) => option.value === verdict)) throw new BoardError('invalid-answer', `${verdict} is not an option of ${id}`);
  if (itemRevision !== item.revision) throw new BoardError('stale-item', `${id} is at revision ${item.revision}; reload the page and answer again`);
  const answers = readAnswers(root);
  const previous = answers.answers[id];
  if (expectedAnswerAt !== undefined && expectedAnswerAt !== (previous?.at ?? null)) throw new BoardError('stale-answer', `${id}: stale answer; reload before saving`);
  if (previous && previous.verdict === verdict && previous.note === note && previous.itemRevision === itemRevision) return { ...previous, derivedStatus: itemStatus(item, previous) };
  const entry = { verdict, note, at: new Date(Math.max(Date.now(), previous ? Date.parse(previous.at) + 1 : 0)).toISOString(), itemRevision };
  if (['confirm','approve'].includes(verdict)) entry.approval = approvalSnapshot(item, entry);
  const history = previous ? [...previous.history, Object.fromEntries(Object.entries(previous).filter(([key]) => key !== 'history'))] : [];
  answers.answers[id] = { ...entry, history };
  const nativeNote = answerNote(root);
  if (nativeNote) {
    let loaded;
    if (fs.existsSync(path.join(root,nativeNote))) loaded=notepadResult(readNote(root,{note:nativeNote}));
    else loaded=notepadResult(createNote(root,{note:nativeNote,type:'grilling',objective:'dashboard-answers',title:'Dashboard owner answers',focus:'Exact owner words and approved snapshots',state:'Local owner working context; legacy answers preserved','next-action':'Owner confirms or requests revision; explicit promotion is separate'}));
    notepadResult(appendEntry(root,{note:nativeNote,revision:loaded.revision,kind:['confirm','approve'].includes(verdict)?'decision':'source_record',topic:'dashboard-answer',content:JSON.stringify({id,answer:answers.answers[id]})}));
  } else writeJsonAtomic(boardPaths(root).answers, answers);
  return { ...answers.answers[id], derivedStatus: itemStatus(item, answers.answers[id]) };
}

export function pendingForAgents(root) {
  const view = mergeBoard(root);
  return view.items.filter((item) => item.derivedStatus === 'answered').map((item) => ({
    id: item.id,
    key: item.key,
    group: item.group,
    kind: item.kind,
    title: item.title,
    question: item.question,
    options: item.options,
    revision: item.revision,
    verdict: item.answer.verdict,
    verdictLabel: item.options.find((option) => option.value === item.answer.verdict)?.label ?? item.answer.verdict,
    note: item.answer.note,
    answeredAt: item.answer.at,
    proposal: item.proposal,
    brief: item.brief,
    sources: item.sources
  }));
}

export function statusSummary(root) {
  const view = mergeBoard(root);
  const groups = view.groups.map((group) => {
    const counts = Object.fromEntries(STATUSES.map((status) => [status, 0]));
    for (const item of view.items) if (item.group === group.id) counts[item.derivedStatus] += 1;
    return { id: group.id, title: group.title, ...counts, total: view.items.filter((item) => item.group === group.id).length };
  });
  return { integration: view.integration, generatedAt: view.generatedAt, itemsMtime: view.itemsMtime, total: view.items.length, counts: view.counts, groups };
}

function safeRelative(root, requested) {
  if (!isString(requested) || !requested || requested.includes('\0')) throw new BoardError('unsafe-path', 'path required');
  const resolved = path.resolve(root, requested);
  const relative = path.relative(root, resolved);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) throw new BoardError('unsafe-path', `${requested} is outside the room`);
  return resolved;
}

export function readSourceFile(root, requested) {
  const file = safeRelative(root, requested);
  const relative = path.relative(root, file).split(path.sep).join('/');
  if (relative.split('/').some(part => part.startsWith('.')) || /(?:^|\/)answers\.json$|(?:^|\/)sessions\/(?:notepads|handoffs)\//.test(relative)) throw new BoardError('unsafe-path', 'Private working files are not served');
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) throw new BoardError('missing-file', `${requested} is not a file`);
  const stat = fs.lstatSync(file);
  if (stat.isSymbolicLink() || stat.nlink > 1) throw new BoardError('unsafe-path', 'Source must be an ordinary singly linked file');
  const realFile = fs.realpathSync(file);
  safeRelative(fs.realpathSync(root), realFile);
  const realRelative = path.relative(fs.realpathSync(root), realFile).split(path.sep).join('/');
  if (realRelative.split('/').some(part => part.startsWith('.')) || /(?:^|\/)answers\.json$|(?:^|\/)sessions\/(?:notepads|handoffs)\//.test(realRelative)) throw new BoardError('unsafe-path', 'Private working files are not served');
  if (fs.statSync(file).size > MAX_FILE_BYTES) throw new BoardError('too-large', `${requested} exceeds ${MAX_FILE_BYTES} bytes`);
  return fs.readFileSync(file, 'utf8');
}

export function artifactCatalog(root) {
  const manifest = readJson(path.join(root, 'workbench/manifest.json'));
  const groups = ['agents', 'runbook', 'blueprint', 'lexicon', 'landmarks', 'adrs', 'ddrs'].map((id, index) => ({ id, title: ['AGENTS', 'RUNBOOK', 'BLUEPRINT', 'LEXICON', 'Landmarks', 'ADRs', 'DDRs'][index] }));
  const artifacts = groups.slice(0, 4).map(group => ({ group: group.id, path: `${group.title}.md`, title: group.title, status: 'current', format: 'markdown' }));
  for (const kind of ['adr', 'ddr']) {
    if (!manifest.collections?.[kind]) continue;
    for (const record of listAdrs(root, { kind })) artifacts.push({ group: `${kind}s`, path: record.relativePath, title: record.title || record.id, id: record.id, status: record.status || 'unknown', format: 'markdown' });
    for (const name of ['REGISTER.md', 'HISTORY.md']) {
      const relative = `${manifest.collections[kind]}/${name}`;
      if (fs.existsSync(safeRelative(root, relative))) artifacts.push({ group: `${kind}s`, path: relative, title: name === 'REGISTER.md' ? 'Active accepted decisions register' : 'Complete decision history', status: 'navigation projection', format: 'markdown' });
    }
  }
  const landmarks = manifest.landmarkTracker?.collections?.landmarks;
  if (landmarks) {
    const dir = safeRelative(root, landmarks);
    if (fs.existsSync(dir)) {
      safeRelative(fs.realpathSync(root), fs.realpathSync(dir));
      for (const name of fs.readdirSync(dir).filter(name => /^LMK-[0-9A-Za-z]+\.json$/.test(name))) {
        const relative = `${landmarks}/${name}`;
        const record = JSON.parse(readSourceFile(root, relative));
        artifacts.push({ group: 'landmarks', path: relative, title: record.title || record.id, id: record.id, status: `current JSON record · revision ${record.revision}`, format: 'json' });
      }
    }
  }
  const extra = dashboardSources(root, { readSource: readSourceFile, catalogOnly: true });
  return { groups: [...groups, ...extra.groups.filter(group => !groups.some(g => g.id === group.id))], artifacts: [...artifacts.filter(a => fs.existsSync(path.join(root,a.path))), ...extra.artifacts.filter(a => !artifacts.some(existing => existing.path === a.path))], errors: extra.errors };
}

export function readArtifact(root, requested) {
  safeRelative(root, requested);
  const catalog = artifactCatalog(root);
  const artifact = catalog.artifacts.find(candidate => candidate.path === requested);
  if (!artifact) throw new BoardError('missing-file', 'This path is not a reader artifact');
  const text = readSourceFile(root, requested);
  const board = readItems(root);
  let tree = null;
  try { tree = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch {}
  const related = board.items.filter(item => item.sources.some(source => source.path === requested)).map(item => ({
    id: item.id, title: item.title, question: item.question, revision: item.revision, status: item.status,
    proposal: item.proposal, draft: item.draft, sources: item.sources.filter(source => source.path === requested),
    // Only a review of this exact complete text is labeled full-text. Other
    // drafts can be fragments or unrelated acceptance text; never infer a replacement.
    draftKind: !item.draft ? 'none' : ['confirm-text', 'confirm-ddr'].includes(item.kind) && item.sources[0]?.path === requested ? 'full-text' : 'excerpt',
    snapshotAt: board.generatedAt,
    itemUpdatedAt: item.history.at(-1)?.at || board.generatedAt
  }));
  return { ...artifact, text, revision: createHash('sha256').update(text).digest('hex'), tree, readAt: new Date().toISOString(), related };
}

function sendJson(response, status, body) {
  const text = JSON.stringify(body);
  response.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'content-length': Buffer.byteLength(text) });
  response.end(text);
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    request.on('data', (chunk) => {
      size += chunk.length;
      if (size > 1024 * 1024) {
        reject(new BoardError('too-large', 'request body over 1 MiB'));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    request.on('error', reject);
  });
}

export function createServer(root) {
  const paths = boardPaths(root);
  const flows = () => workflow(root);
  return http.createServer(async (request, response) => {
    const url = new URL(request.url, 'http://localhost');
    try {
      if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html')) {
        const html = fs.readFileSync(paths.page);
        response.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
        response.end(html);
        return;
      }
      if (request.method === 'GET' && url.pathname === '/api/board') {
        sendJson(response, 200, mergeBoard(root));
        return;
      }
      if (request.method === 'GET' && url.pathname === '/api/dashboard') { sendJson(response,200,dashboardSources(root,{readSource:readSourceFile})); return; }
      if (request.method === 'GET' && url.pathname === '/api/workflow') { sendJson(response,200,flows().read()); return; }
      if (request.method === 'POST' && ['/api/comments','/api/rounds','/api/promotions'].includes(url.pathname)) {
        const body = JSON.parse(await readBody(request));
        const result = url.pathname === '/api/comments' ? flows().comment(body) : url.pathname === '/api/rounds' ? flows().endRound(body) : flows().promote(body);
        sendJson(response,200,result); return;
      }
      if (request.method === 'GET' && url.pathname === '/api/status') {
        sendJson(response, 200, statusSummary(root));
        return;
      }
      if (request.method === 'GET' && url.pathname === '/api/artifacts') {
        sendJson(response, 200, artifactCatalog(root));
        return;
      }
      if (request.method === 'GET' && url.pathname === '/api/artifact') {
        sendJson(response, 200, readArtifact(root, url.searchParams.get('path')));
        return;
      }
      if (request.method === 'GET' && url.pathname === '/api/file') {
        const requested = url.searchParams.get('path');
        safeRelative(root, requested);
        const known = readItems(root).items.some(item => item.sources.some(source => source.path === requested && !path.isAbsolute(source.path))) || artifactCatalog(root).artifacts.some(artifact => artifact.path === requested);
        if (!known) throw new BoardError('unsafe-path', 'Only named board sources and reader artifacts are served');
        sendJson(response, 200, { path: requested, text: readSourceFile(root, requested) });
        return;
      }
      const match = url.pathname.match(/^\/api\/answers\/(GB-\d{4})$/);
      if (request.method === 'PUT' && match) {
        let body;
        try {
          body = JSON.parse(await readBody(request));
        } catch (error) {
          throw new BoardError('invalid-json', `request body is not JSON: ${error.message}`);
        }
        sendJson(response, 200, recordAnswer(root, match[1], body));
        return;
      }
      sendJson(response, 404, { error: { code: 'not-found', message: `${request.method} ${url.pathname}` } });
    } catch (error) {
      const code = error.code ?? 'internal';
      const status = code === 'unknown-item' || code === 'missing-file' ? 404 : /stale|conflict/.test(code) ? 409 : code === 'internal' ? 500 : 400;
      sendJson(response, status, { error: { code, message: error.message } });
    }
  });
}

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg.startsWith('--')) {
      const name = arg.slice(2);
      const next = argv[index + 1];
      if (next === undefined || next.startsWith('--')) flags[name] = true;
      else {
        flags[name] = next;
        index += 1;
      }
    } else positional.push(arg);
  }
  return { positional, flags };
}

const USAGE = 'Usage: grill-board.mjs serve [--port N] | status | pending | show GB-#### | add --file ITEMS.json --by NAME [--reason TEXT] | revise GB-#### --by NAME --reason TEXT [--title T] [--question T] [--current T] [--proposal T] [--draft-file PATH] [--options-file PATH] [--brief-file PATH] | apply GB-#### --by NAME --where TEXT [--note TEXT] | withdraw GB-#### --by NAME --reason TEXT | validate [--path ROOT] [--json] (see workbench/grill-board/README.md)';

function out(flags, value, text) {
  if (flags.json) process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
  else process.stdout.write(`${text ?? JSON.stringify(value, null, 2)}\n`);
}

export async function main(argv) {
  const { positional, flags } = parseArgs(argv);
  const [command, id] = positional;
  const root = findRoot(flags.path ? path.resolve(flags.path) : process.cwd());
  switch (command) {
    case 'serve': {
      const port = Number(flags.port ?? 4646);
      const server = createServer(root);
      await new Promise((resolve) => server.listen(port, '127.0.0.1', resolve));
      const summary = statusSummary(root);
      process.stdout.write(`Grill Board serving ${path.join(root, BOARD_DIR)}\n  open  http://127.0.0.1:${port}/\n  items ${summary.total} (pending ${summary.counts.pending}, re-answer ${summary.counts.stale}, answered ${summary.counts.answered}, applied ${summary.counts.applied}, withdrawn ${summary.counts.withdrawn})\n  stop  Ctrl-C\n`);
      return;
    }
    case 'status': {
      const summary = statusSummary(root);
      const lines = [`Grill Board at integration ${summary.integration}: ${summary.total} items; pending ${summary.counts.pending}, re-answer ${summary.counts.stale}, answered (awaiting an agent) ${summary.counts.answered}, applied ${summary.counts.applied}, withdrawn ${summary.counts.withdrawn}`];
      for (const group of summary.groups) lines.push(`  ${group.title}: ${group.total} items; pending ${group.pending}, re-answer ${group.stale}, answered ${group.answered}, applied ${group.applied}, withdrawn ${group.withdrawn}`);
      out(flags, summary, lines.join('\n'));
      return;
    }
    case 'pending': {
      const pending = pendingForAgents(root);
      const lines = pending.length ? pending.map((item) => `${item.id}  [${item.verdictLabel}]  ${item.title}\n    answered ${item.answeredAt} at item revision ${item.revision}${item.note ? `\n    note: ${item.note}` : ''}`) : ['No owner answers are waiting for an agent.'];
      out(flags, pending, lines.join('\n'));
      return;
    }
    case 'show': {
      if (!id) throw new BoardError('invalid-invocation', USAGE);
      const item = mergeBoard(root).items.find((candidate) => candidate.id === id);
      if (!item) throw new BoardError('unknown-item', `${id} is not on the board`);
      out(flags, item);
      return;
    }
    case 'add': {
      if (!flags.file) throw new BoardError('invalid-invocation', USAGE);
      const raw = readJson(path.resolve(flags.file));
      const list = Array.isArray(raw) ? raw : raw.items;
      if (!Array.isArray(list)) throw new BoardError('invalid-invocation', '--file must hold an array or {items: []}');
      const added = addItems(root, list, { by: flags.by, reason: flags.reason });
      out(flags, { added }, `Added ${added.length} item(s): ${added.join(', ')}`);
      return;
    }
    case 'revise': {
      if (!id) throw new BoardError('invalid-invocation', USAGE);
      const changes = {};
      for (const field of ['title', 'question', 'current', 'proposal']) if (isString(flags[field])) changes[field] = flags[field];
      if (isString(flags['draft-file'])) changes.draft = fs.readFileSync(path.resolve(flags['draft-file']), 'utf8');
      if (flags['clear-draft']) changes.draft = null;
      if (isString(flags['options-file'])) changes.options = readJson(path.resolve(flags['options-file']));
      if (isString(flags['brief-file'])) changes.brief = readJson(path.resolve(flags['brief-file']));
      const item = reviseItem(root, id, changes, { by: flags.by, reason: flags.reason, expectedRevision: flags.revision ? Number(flags.revision) : undefined });
      out(flags, item, `${id} is now revision ${item.revision}; the owner's earlier answer, if any, shows as needing a fresh look`);
      return;
    }
    case 'grade': {
      if (!flags.file) throw new BoardError('invalid-invocation','grade --file JSON --by NAME --reason TEXT');
      const grades = readJson(path.resolve(flags.file)); out(flags,gradeItems(root,grades,{by:flags.by,reason:flags.reason})); return;
    }
    case 'handoffs': { out(flags,workflow(root).read()); return; }
    case 'disposition': {
      if (!flags.file) throw new BoardError('invalid-invocation','disposition --file JSON');
      out(flags,workflow(root).disposition(readJson(path.resolve(flags.file)))); return;
    }
    case 'apply': {
      if (!id) throw new BoardError('invalid-invocation', USAGE);
      const item = applyAnswer(root, id, { by: flags.by, where: flags.where, note: isString(flags.note) ? flags.note : '' });
      out(flags, item, `${id} applied: ${item.applied.verdict || '(note only)'} -> ${item.applied.where}`);
      return;
    }
    case 'withdraw': {
      if (!id) throw new BoardError('invalid-invocation', USAGE);
      const item = withdrawItem(root, id, { by: flags.by, reason: flags.reason });
      out(flags, item, `${id} withdrawn`);
      return;
    }
    case 'validate': {
      const board = readItems(root);
      const answers = readAnswers(root);
      const ids = new Set(board.items.map((item) => item.id));
      const orphan = Object.keys(answers.answers).filter((answerId) => !ids.has(answerId));
      if (orphan.length) throw new BoardError('orphan-answers', `answers for unknown items: ${orphan.join(', ')}`);
      out(flags, { status: 'ok', items: board.items.length, answers: Object.keys(answers.answers).length }, `ok: ${board.items.length} items, ${Object.keys(answers.answers).length} answers`);
      return;
    }
    default:
      throw new BoardError('invalid-invocation', USAGE);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch((error) => {
    const code = error.code ?? 'internal';
    process.stdout.write(`${JSON.stringify({ status: 'blocked', error: { code, message: error.message } })}\n`);
    process.exit(1);
  });
}

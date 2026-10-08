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
// A namespace import, so a sources module without the optional
// dashboardRoute export still loads; its routes then answer 404.
import * as sources from './dashboard-sources.mjs';
import { createWorkflow, approvalSnapshot, approvalHash } from './dashboard-workflow.mjs';
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
// The words the owner answers with; their meanings are owned by the
// Workbench Dashboard Spec's Decisions And Contracts
// (workbench/specs/S-004D-shared-interactive-board/SPEC.md). Confirm means
// confirmed; the other three send the item back and need his note.
export const SEND_BACK_OPTIONS = Object.freeze([
  Object.freeze({ value: 'rework', label: 'Rework wording', hint: 'Mostly correct; it needs to be restated better. Your note says how.', requiresNote: true }),
  Object.freeze({ value: 'change_why', label: 'Change the why', hint: 'Something is correct, but the underlying reason is wrong. Your note joins the Whys list.', requiresNote: true }),
  Object.freeze({ value: 'change', label: 'Change', hint: 'It needs changing, including dropping it. Your note says what.', requiresNote: true })
]);
// Words of answers saved before the four answer words. They stay readable with
// their original labels and meaning, but the board offers them for no new answer.
export const LEGACY_LABELS = Object.freeze({
  confirm: 'Confirm', correct: 'Correct', decline: 'Decline', defer: 'Not now',
  approve: 'Approve', finding: 'Send back', destination_change: 'Return to Align', drop: 'Drop this Spec'
});
const LEGACY_META = Object.freeze(['correct', 'decline', 'defer']);
const LEGACY_APPROVAL = Object.freeze(['finding', 'destination_change', 'drop', ...LEGACY_META]);
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
// An answer without its history, as one notepad entry stores it.
function answerOnly(answer) {
  return Object.fromEntries(Object.entries(answer).filter(([key]) => key !== 'history'));
}
function answerHash(answer) {
  return createHash('sha256').update(JSON.stringify(answerOnly(answer))).digest('hex');
}

// Owner answers: the legacy answers.json, then the native notepad entries in
// order. A current entry (schema dashboard-answer@2) holds only its own answer
// and names the answer it supersedes; history is rebuilt by chaining, so an
// earlier note is never copied into a later entry (and an earlier note the
// notepad privacy guard would refuse never blocks a new answer). An entry
// written before that format holds the whole answer with its history.
export function readAnswers(root) {
  const answers = readJson(boardPaths(root).answers, emptyAnswers());
  const note = answerNote(root);
  if (note && fs.existsSync(path.join(root,note))) {
    const loaded = notepadResult(readNote(root,{note}));
    for (const entry of loaded.entries) if (entry.topic === 'dashboard-answer') {
      const saved = JSON.parse(entry.content);
      if (saved.schema !== 'dashboard-answer@2') { answers.answers[saved.id] = saved.answer; continue; }
      const previous = answers.answers[saved.id];
      const history = previous ? [...(previous.history ?? []), answerOnly(previous)] : [];
      answers.answers[saved.id] = { ...saved.answer, history };
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

function normalizeWords(text) {
  return String(text ?? '').toLowerCase().replace(/\([^)]*\)/g, ' ').replace(/[^a-z0-9]+/g, ' ').trim();
}

// Which alternative the item recommends: an option flagged `recommended: true`,
// or else the one alternative whose whole label (two or more words) the
// recommendation names. Anything less certain preselects nothing.
function recommendedAlternative(item, alternatives) {
  const flagged = alternatives.filter((option) => option.recommended === true);
  if (flagged.length === 1) return { value: flagged[0].value, basis: 'The question marks this alternative as the recommended answer.' };
  if (flagged.length > 1) return { value: null, basis: 'The question marks more than one alternative as recommended, so none is preselected. Read the recommendation and choose.' };
  const recommendation = item.brief?.recommendation ?? String(item.proposal ?? '').replace(/^Agent proposal:\s*/i, '').split(/\n\s*\n/)[0];
  const text = ` ${normalizeWords(recommendation)} `;
  const named = alternatives.filter((option) => {
    const label = normalizeWords(option.label);
    return label.split(' ').length >= 2 && text.includes(` ${label} `);
  });
  if (named.length === 1) return { value: named[0].value, basis: 'The recommendation names this alternative.' };
  return { value: null, basis: 'The recommendation does not name exactly one of these alternatives, so none is preselected. Read the recommendation and choose.' };
}

// The one place answer controls are decided, so the served page and the
// server-side validation in recordAnswer agree. Three modes:
//   standard      Confirm, Rework wording, Change the why, Change
//   alternatives  Recommended answer, A, B, C... (Confirm stores the selected
//                 alternative) plus the three send-back answers
//   approval      a Spec delivery approval: Confirm records `approve`; the
//                 three send-back answers return it with the note
export function answerControls(item) {
  const sendBack = SEND_BACK_OPTIONS.map((option) => ({ ...option }));
  if (item.kind === 'approve-spec') {
    const confirm = { value: 'approve', label: 'Confirm', hint: 'Approves the delivered integration content named here.', requiresNote: false };
    return { mode: 'approval', recommended: null, recommendationBasis: null, alternatives: [], confirm, confirmValues: ['approve'], sendBack, options: [confirm, ...sendBack] };
  }
  const real = (item.options ?? []).filter((option) => !LEGACY_META.includes(option.value) && !['confirm', ...SEND_BACK_OPTIONS.map((o) => o.value)].includes(option.value));
  if (!real.length) {
    const confirm = { value: 'confirm', label: 'Confirm', hint: 'It is confirmed as written; nothing needs changing.', requiresNote: false };
    return { mode: 'standard', recommended: null, recommendationBasis: null, alternatives: [], confirm, confirmValues: ['confirm'], sendBack, options: [confirm, ...sendBack] };
  }
  const { value: recommended, basis } = recommendedAlternative(item, real);
  const ordered = [...real.filter((option) => option.value === recommended), ...real.filter((option) => option.value !== recommended)];
  let letter = 0;
  const alternatives = ordered.map((option) => ({
    value: option.value,
    label: option.label,
    hint: option.hint ?? '',
    marker: option.value === recommended ? 'Recommended answer' : String.fromCharCode(65 + letter++),
    recommended: option.value === recommended,
    requiresNote: option.value !== recommended
  }));
  const confirm = { value: null, label: 'Confirm', hint: 'Confirms the selected alternative.', requiresNote: false };
  return { mode: 'alternatives', recommended, recommendationBasis: basis, alternatives, confirm, confirmValues: alternatives.map((a) => a.value), sendBack, options: [...alternatives.map(({ value, label, hint, requiresNote }) => ({ value, label, hint, requiresNote })), ...sendBack] };
}

// Every value a new answer may record for this item.
export function optionsFor(item) {
  return answerControls(item).options;
}

export function isConfirmation(item, verdict) {
  return Boolean(verdict) && answerControls(item).confirmValues.includes(verdict);
}

// The words to show for a saved verdict: the current answer word, else the
// item's own original option label, else the original default label.
export function answerLabel(item, verdict) {
  if (!verdict) return '';
  const controls = answerControls(item);
  const alternative = controls.alternatives.find((option) => option.value === verdict);
  if (alternative) return alternative.label;
  const own = (item.options ?? []).find((option) => option.value === verdict);
  if (own) return own.label;
  const current = controls.options.find((option) => option.value === verdict);
  if (current) return current.label;
  return LEGACY_LABELS[verdict] ?? verdict;
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
      controls: answerControls(item),
      answer,
      answerLabel: answer ? answerLabel(item, answer.verdict) : '',
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

// Answer-to-card update (TK-007O): after an owner answer is applied, or a
// card revised from it, the agent reassesses that card's Priority and Value.
// Each row names the answer it followed ({id, answerAt, itemRevision}; the
// answer may be on another card) and, per grade, either
//   { retain: true, basis }                 the basis did not change, or
//   { grade, reason, basis }                a revised grade, its new reason
//                                           and why the basis changed.
// The assessment is appended to item history, so a retained grade is told
// apart from an unassessed one. It uses the grade stale check and bumps
// gradeRevision, never `revision`, and never reads or writes owner answers
// beyond checking that the followed answer exists.
function answerExists(answers, followed) {
  const answer = answers.answers[followed.id];
  if (!answer) return false;
  return [answer, ...(answer.history ?? [])].some((entry) => entry.at === followed.answerAt && entry.itemRevision === followed.itemRevision);
}

export function reassessItems(root, rows, { by, reason }) {
  if (!by || !reason || !Array.isArray(rows) || !rows.length) throw new BoardError('invalid-reassessment', 'rows[], --by and --reason required');
  const board = readItems(root);
  const answers = readAnswers(root);
  const seen = new Set();
  const at = now();
  for (const row of rows) {
    if (!row || Object.keys(row).some((key) => !['id', 'expectedGradeRevision', 'followed', 'priority', 'value'].includes(key))) throw new BoardError('invalid-reassessment', 'unknown reassessment field');
    const item = findItem(board, row.id);
    if (seen.has(row.id)) throw new BoardError('invalid-reassessment', 'duplicate reassessment identity');
    seen.add(row.id);
    if (!item.priority || !item.value) throw new BoardError('ungraded', `${row.id} has no grade to reassess; grade it first`);
    if (row.expectedGradeRevision !== (item.gradeRevision ?? 0)) throw new BoardError('stale-grade', `${row.id}: stale grade revision`);
    const followed = row.followed;
    if (!followed || !ID_PATTERN.test(followed.id ?? '') || !isString(followed.answerAt) || !Number.isInteger(followed.itemRevision)) throw new BoardError('invalid-reassessment', `${row.id}: followed must name the answer {id, answerAt, itemRevision}`);
    if (!answerExists(answers, followed)) throw new BoardError('unknown-answer', `${row.id}: no owner answer ${followed.id} at ${followed.answerAt} for revision ${followed.itemRevision}`);
    const assessment = { followed: { id: followed.id, answerAt: followed.answerAt, itemRevision: followed.itemRevision } };
    const next = {};
    for (const field of ['priority', 'value']) {
      const change = row[field];
      if (!change || typeof change !== 'object') throw new BoardError('invalid-reassessment', `${row.id}: ${field} assessment required`);
      if (!isString(change.basis) || !change.basis.trim()) throw new BoardError('invalid-reassessment', `${row.id}: ${field} needs the basis of its assessment`);
      if (change.retain === true) {
        if (Object.keys(change).some((key) => !['retain', 'basis'].includes(key))) throw new BoardError('invalid-reassessment', `${row.id}: a retained ${field} takes only retain and basis`);
        assessment[field] = { outcome: 'retained', grade: item[field].grade, basis: change.basis };
      } else {
        if (Object.keys(change).some((key) => !['grade', 'reason', 'basis'].includes(key))) throw new BoardError('invalid-reassessment', `${row.id}: a revised ${field} takes grade, reason and basis`);
        next[field] = { grade: change.grade, reason: change.reason };
        assessment[field] = { outcome: 'revised', from: item[field].grade, grade: change.grade, basis: change.basis };
      }
    }
    Object.assign(item, next);
    item.gradeRevision = (item.gradeRevision ?? 0) + 1;
    const outcome = (field, letter) => assessment[field].outcome === 'retained' ? `${letter} retained` : `${letter} ${assessment[field].from} -> ${assessment[field].grade}`;
    item.history.push({ revision: item.revision, gradeRevision: item.gradeRevision, at, by, reason: `reassessed (${outcome('priority', 'P')}, ${outcome('value', 'V')}): ${reason}`, assessment });
  }
  validateItems(board);
  writeJsonAtomic(boardPaths(root).items, board);
  return rows.map((row) => findItem(board, row.id));
}

// The workflow reads confirmations by the same answerControls rule the
// board enforces (injected, since this module imports the workflow).
function confirmsAnswer(item, answer) { return isConfirmation(item, answer?.verdict); }
export function workflow(root) { return createWorkflow(root, { readItems, readAnswers, isConfirmation: confirmsAnswer }); }

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
  const option = verdict ? optionsFor(item).find((candidate) => candidate.value === verdict) : null;
  if (verdict && !option) {
    const legacy = (item.kind === 'approve-spec' ? LEGACY_APPROVAL : LEGACY_META).includes(verdict);
    throw new BoardError(legacy ? 'legacy-verdict' : 'invalid-answer', legacy
      ? `${verdict} (${answerLabel(item, verdict)}) is a legacy answer word kept only for earlier answers; answer ${id} with ${optionsFor(item).map((o) => o.label).join(', ')}`
      : `${verdict} is not an option of ${id}`);
  }
  if (itemRevision !== item.revision) throw new BoardError('stale-item', `${id} is at revision ${item.revision}; reload the page and answer again`);
  if (option?.requiresNote && !note.trim()) throw new BoardError('note-required', `${option.label} needs your note before it can be chosen`);
  const answers = readAnswers(root);
  const previous = answers.answers[id];
  if (expectedAnswerAt !== undefined && expectedAnswerAt !== (previous?.at ?? null)) throw new BoardError('stale-answer', `${id}: stale answer; reload before saving`);
  // An identical repeat is idempotent, except a confirmation whose saved
  // answer has no snapshot of the current wording (a confirmation saved before
  // snapshots, or one frozen from other bytes): confirming again records it.
  const snapshotCurrent = !isConfirmation(item, verdict)
    || (previous?.approval?.itemRevision === item.revision && previous.approval.hash === approvalHash(item, { root }));
  if (previous && previous.verdict === verdict && previous.note === note && previous.itemRevision === itemRevision && snapshotCurrent) return { ...previous, derivedStatus: itemStatus(item, previous) };
  const entry = { verdict, note, at: new Date(Math.max(Date.now(), previous ? Date.parse(previous.at) + 1 : 0)).toISOString(), itemRevision };
  // Only a confirmation freezes the exact wording it confirmed, with source
  // paths normalized to the room so no absolute path is stored.
  if (isConfirmation(item, verdict)) entry.approval = approvalSnapshot(item, entry, { root, isConfirmation: confirmsAnswer });
  const history = previous ? [...previous.history, Object.fromEntries(Object.entries(previous).filter(([key]) => key !== 'history'))] : [];
  answers.answers[id] = { ...entry, history };
  const nativeNote = answerNote(root);
  if (nativeNote) {
    let loaded;
    if (fs.existsSync(path.join(root,nativeNote))) loaded=notepadResult(readNote(root,{note:nativeNote}));
    else loaded=notepadResult(createNote(root,{note:nativeNote,type:'grilling',objective:'dashboard-answers',title:'Dashboard owner answers',focus:'Exact owner words and approved snapshots',state:'Local owner working context; legacy answers preserved','next-action':'Owner confirms or requests revision; explicit promotion is separate'}));
    notepadResult(appendEntry(root,{note:nativeNote,revision:loaded.revision,kind:isConfirmation(item, verdict)?'decision':'source_record',topic:'dashboard-answer',content:JSON.stringify({schema:'dashboard-answer@2',id,answer:entry,supersedes:previous?{at:previous.at,hash:answerHash(previous)}:null})}));
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
    verdictLabel: item.answerLabel,
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
  const extra = sources.dashboardSources(root, { readSource: readSourceFile, catalogOnly: true });
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

// Kinds whose question is approving wording, a record or a delivery.
const APPROVAL_KINDS = Object.freeze(['approve-spec', 'confirm-text', 'confirm-ddr', 'confirm-dqc']);

// The exact wording a confirmation froze, against the item's current wording.
function approvalState(root, item, answer) {
  const currentHash = approvalHash(item, { root });
  const latest = answer?.approval ? answer.approval : [...(answer?.history ?? [])].reverse().find((entry) => entry.approval)?.approval;
  if (!latest) return { state: 'none', currentHash, hash: null };
  const base = { currentHash, hash: latest.hash, itemRevision: latest.itemRevision, confirmedAt: latest.confirmedAt, verdict: latest.verdict };
  if (!answer.approval) return { ...base, state: 'superseded' };
  return { ...base, state: latest.hash === currentHash && latest.itemRevision === item.revision ? 'current' : 'stale' };
}

// Drafts to approve: every open item carrying proposed wording, grouped by the
// file it would replace when that is determinable (a full-text review names
// its record first), plus the approval questions that have no draft at all.
export function draftsToApprove(root) {
  const view = mergeBoard(root);
  const open = view.items.filter((item) => item.status === 'open');
  const groups = new Map();
  for (const item of open.filter((candidate) => isString(candidate.draft) && candidate.draft.trim())) {
    const first = item.sources[0]?.path;
    const fullText = ['confirm-text', 'confirm-ddr'].includes(item.kind) && first && !path.isAbsolute(first);
    const target = fullText ? first : null;
    if (!groups.has(target)) groups.set(target, { target, items: [] });
    groups.get(target).items.push({
      id: item.id, title: item.title, kind: item.kind, revision: item.revision, derivedStatus: item.derivedStatus,
      question: item.question, draft: item.draft, draftKind: fullText ? 'full-text' : 'excerpt', sources: item.sources,
      answerLabel: item.answerLabel, approval: approvalState(root, item, item.answer)
    });
  }
  const ordered = [...groups.values()].sort((a, b) => (a.target === null) - (b.target === null) || String(a.target).localeCompare(String(b.target)));
  const withoutDraft = open.filter((item) => APPROVAL_KINDS.includes(item.kind) && !(isString(item.draft) && item.draft.trim()))
    .map((item) => ({ id: item.id, title: item.title, kind: item.kind, revision: item.revision, derivedStatus: item.derivedStatus, sources: item.sources }));
  return { schema: 'workbench-dashboard/drafts@1', groups: ordered, withoutDraft };
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

// The served board is local to this machine. Every request must name this
// server by its local address (a DNS-rebinding guard), and every write must be
// a same-origin JSON request: a cross-site page can send a "simple" text/plain
// POST without a preflight, so writes refuse any other content type, any
// foreign Origin and a cross-site fetch. No response grants CORS.
export function requestRefusal(request) {
  const port = request.socket.localPort;
  const local = [`127.0.0.1:${port}`, `localhost:${port}`];
  if (!local.includes(String(request.headers.host ?? '').toLowerCase())) return { status: 403, code: 'foreign-host', message: 'This board answers only requests addressed to its local address' };
  if (request.method === 'GET' || request.method === 'HEAD') return null;
  const origin = request.headers.origin;
  if (origin !== undefined && !local.map((address) => `http://${address}`).includes(String(origin).toLowerCase())) return { status: 403, code: 'foreign-origin', message: 'Writes are accepted only from this board\'s own page' };
  if (String(request.headers['sec-fetch-site'] ?? '').toLowerCase() === 'cross-site') return { status: 403, code: 'cross-site', message: 'Cross-site writes are refused' };
  const type = String(request.headers['content-type'] ?? '').split(';')[0].trim().toLowerCase();
  if (type !== 'application/json') return { status: 415, code: 'unsupported-media-type', message: 'Writes must be sent as application/json' };
  return null;
}

// A write body: JSON holding one object.
async function readObject(request) {
  let body;
  try {
    body = JSON.parse(await readBody(request));
  } catch (error) {
    throw new BoardError('invalid-json', `request body is not JSON: ${error.message}`);
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new BoardError('invalid-input', 'request body must be a JSON object');
  return body;
}

// options.dashboardRoute replaces the sources module's optional route
// (tests pass a stub, or null for a sources module without it).
export function createServer(root, options = {}) {
  const paths = boardPaths(root);
  const dashboardRoute = 'dashboardRoute' in options ? options.dashboardRoute : sources.dashboardRoute;
  const flows = () => workflow(root);
  return http.createServer(async (request, response) => {
    const url = new URL(request.url, 'http://localhost');
    const refusal = requestRefusal(request);
    if (refusal) {
      request.resume();
      sendJson(response, refusal.status, { error: { code: refusal.code, message: refusal.message } });
      return;
    }
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
      if (request.method === 'GET' && url.pathname === '/api/dashboard') { sendJson(response,200,sources.dashboardSources(root,{readSource:readSourceFile})); return; }
      if (request.method === 'GET' && url.pathname === '/api/drafts') { sendJson(response, 200, draftsToApprove(root)); return; }
      if (request.method === 'GET' && ['/api/search', '/api/backlinks', '/api/glossary'].includes(url.pathname)) {
        const routed = typeof dashboardRoute === 'function' ? await dashboardRoute(root, url, { readSource: readSourceFile, items: readItems(root).items }) : null;
        if (routed === null || routed === undefined) sendJson(response, 404, { error: { code: 'not-found', message: `${url.pathname} is not available from this sources module` } });
        else sendJson(response, 200, routed);
        return;
      }
      if (request.method === 'GET' && url.pathname === '/api/workflow') { sendJson(response,200,flows().read()); return; }
      if (request.method === 'POST' && ['/api/comments','/api/rounds','/api/promotions'].includes(url.pathname)) {
        const body = await readObject(request);
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
        const body = await readObject(request);
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

const USAGE = 'Usage: grill-board.mjs serve [--path ROOT] [--port N] | status | pending | show GB-#### | add --file ITEMS.json --by NAME [--reason TEXT] | revise GB-#### --by NAME --reason TEXT [--title T] [--question T] [--current T] [--proposal T] [--draft-file PATH] [--options-file PATH] [--brief-file PATH] | apply GB-#### --by NAME --where TEXT [--note TEXT] | withdraw GB-#### --by NAME --reason TEXT | grade --file GRADES.json --by NAME --reason TEXT | reassess --file ROWS.json --by NAME --reason TEXT | handoffs | disposition --file RECEIPT.json | validate [--path ROOT] [--json] (see workbench/grill-board/README.md)';

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
    case 'reassess': {
      if (!flags.file) throw new BoardError('invalid-invocation', 'reassess --file JSON --by NAME --reason TEXT');
      out(flags, reassessItems(root, readJson(path.resolve(flags.file)), { by: flags.by, reason: flags.reason }));
      return;
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

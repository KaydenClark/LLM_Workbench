#!/usr/bin/env node
// Local owner working context and explicit promotion receipts. This module
// neither publishes owners nor launches agents. Board readers are injected so
// the served page and CLI can use their existing authoritative source seams.
//
// Two stores, one writer each:
//   workbench/grill-board/comments/<sha256(actionId)>.json  one file per owner
//       comment or Change request, created exclusively and atomically
//   <notepads>/grilling/dashboard-owner-flow.json  the ordered action log
//       (comments, rounds, promotion requests, disposition receipts)
// A comment file is written before its action entry. A writer that stops
// between the two leaves a complete comment file that the log does not know;
// read() reports it as `recorded: false` and resending the same action
// (same actionId and payload) records it. The notepad revision check refuses a
// writer whose read is stale; it is a sequential guard, not a lock.
import fs from 'node:fs';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { appendEntry, createNote, readNote } from '../workbench/tools/notepads.mjs';

export const PROMOTION_STAGES = Object.freeze(['Record', 'Publish', 'Map', 'Publish', 'Plan', 'Publish']);
// An optional seventh receipt, accepted only after the six above, only for an
// implementation disposition and only with a done Task the Plan receipt named.
export const IMPLEMENTED_STAGE = 'Implemented';
// The state each receipt count leaves a card in; index 0 is "no receipt yet".
const RECEIPT_STATES = Object.freeze(['handoff-requested', 'recorded', 'record-published', 'mapped', 'map-published', 'planned', 'plan-published', 'implemented']);
export const CARD_STATES = Object.freeze({
  withdrawn: 'Settled elsewhere',
  'in-grilling': 'In grilling',
  'answer-conflict': 'Answer conflict: answer again to settle it',
  confirmed: 'Confirmed; promotion not requested',
  'handoff-requested': 'Handoff requested',
  recorded: 'Recorded',
  'record-published': 'Published (record)',
  mapped: 'Mapped',
  'map-published': 'Published (map)',
  planned: 'Planned',
  'plan-published': 'Published (plan)',
  implemented: 'Implemented'
});
const CONFIRM_VERDICTS = ['confirm', 'approve'];
const COMMENT_DIR = 'workbench/grill-board/comments';
const BOARD_WORKING_FILES = ['workbench/grill-board/answers.json', `${COMMENT_DIR}/`];

const hash = value => createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');
const clone = value => JSON.parse(JSON.stringify(value));
// A canonical form, object keys sorted at every depth, so the same action
// sent with its fields in another order hashes the same.
function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]));
  return value;
}
function fail(code, message) { const error = new Error(`${code}: ${message}`); error.code = code; throw error; }
function text(value, name) { if (typeof value !== 'string' || !value.trim()) fail('invalid-input', `${name} must be nonempty text`); return value; }
function checkResult(result) { if (result.status === 'blocked') fail(result.error?.code ?? 'notepad', result.error?.message ?? JSON.stringify(result.error)); return result; }
// A link is a room path (optionally with #anchor or :line) or an https URL.
function linkTarget(link) { return (typeof link === 'string' ? link : link?.path ?? link?.url).split('#')[0].replace(/:\d+$/, ''); }
function linksNamed(links, filename) { return links.map(linkTarget).filter(target => !/^https:\/\//.test(target) && path.posix.basename(target) === filename); }

// The default confirmation rule when no board reader is injected: only the
// plain confirm and approve words. The served board injects its own
// answerControls rule, which also counts a confirmed alternative.
export function defaultIsConfirmation(_item, answer) { return CONFIRM_VERDICTS.includes(answer?.verdict); }

// A source path outside the room is never stored: its label and ref stay, the
// path becomes this marker and a SHA-256 of the original keeps it comparable.
export const OUTSIDE_ROOM_PATH = '(outside this room)';

// Sources as they are frozen and hashed: a path inside the room becomes its
// room-relative path, deterministically, and an absolute path outside it is
// replaced by the marker. Relative paths and markers are left unchanged, so
// normalizing twice gives the same result. An absolute path cannot be judged
// without the room root, so it is refused rather than guessed.
// The real path of `target`, resolving symlinks in its deepest existing
// ancestor, so /tmp and /private/tmp spellings of one room compare equal.
function realPathOf(target) {
  let existing = path.resolve(target);
  const rest = [];
  while (!fs.existsSync(existing)) {
    const parent = path.dirname(existing);
    if (parent === existing) break;
    rest.unshift(path.basename(existing));
    existing = parent;
  }
  return path.join(fs.existsSync(existing) ? fs.realpathSync(existing) : existing, ...rest);
}

export function normalizeSources(sources, root) {
  const base = root ? realPathOf(root) : null;
  return clone(sources ?? []).map((source) => {
    if (!source || typeof source.path !== 'string' || !path.isAbsolute(source.path)) return source;
    if (!base) fail('invalid-input', 'An absolute source path needs the room root to normalize it');
    const relative = path.relative(base, realPathOf(source.path));
    if (relative && !relative.startsWith('..') && !path.isAbsolute(relative)) return { ...source, path: relative.split(path.sep).join('/') };
    return { ...source, path: OUTSIDE_ROOM_PATH, pathSha256: hash(source.path) };
  });
}

// ---- Owner answer history (shared with grill-board.mjs's readAnswers). ----
// An answer without its history, as a dashboard-answer@2 notepad entry
// stores it, and the hash by which a later entry names it as superseded.
export function answerOnly(answer) {
  return Object.fromEntries(Object.entries(answer).filter(([key]) => key !== 'history'));
}
export function answerRecordHash(answer) {
  return hash(answerOnly(answer));
}
export const ANSWER_CONFLICT_MESSAGE = 'Two answers to this question were saved without one following the other (for example by two board servers). The newer one is shown as current and both are kept. Answer again to settle it.';

// Owner answers rebuilt from the legacy answers.json answers (`base`, id to
// answer with history) and the notepad answer entries in order. A current
// entry holds only its own answer and names the answer it supersedes; when
// that is not the answer it actually follows, the two are in conflict: the
// newer by time stays current, both stay visible (the other in history and in
// `conflict`), and nothing is dropped. Entries in the earlier full format
// replace the answer as before.
export const MISSING_PREDECESSOR_MESSAGE = 'This answer names an earlier answer that is missing from the answer store (for example after the answer notepad was trimmed). It is shown as current but not trusted. Answer again to settle it.';

function plainAnswer(answer) {
  const { conflict: _conflict, history: _history, ...plain } = answer;
  return plain;
}

// Whether an entry follows `previous`: a dashboard-answer@2 entry by its
// supersedes {at, hash}; an earlier full-format entry by the last answer in
// the history it carries.
function followsPrevious(saved, previous) {
  if (saved.schema === 'dashboard-answer@2') {
    const expected = saved.supersedes ?? null;
    if (!previous) return expected ? 'missing' : true;
    return Boolean(expected && previous.at === expected.at && answerRecordHash(previous) === expected.hash);
  }
  const last = (saved.answer.history ?? []).at(-1);
  if (!previous) return last ? 'missing' : true;
  return Boolean(last && last.at === previous.at && answerRecordHash(last) === answerRecordHash(plainAnswer(previous)));
}

export function chainAnswers(base, entries) {
  const answers = { ...base };
  for (const saved of entries) {
    const legacyFormat = saved.schema !== 'dashboard-answer@2';
    const previous = answers[saved.id];
    const follows = followsPrevious(saved, previous);
    if (follows === true) {
      answers[saved.id] = legacyFormat ? saved.answer : { ...saved.answer, history: previous ? [...(previous.history ?? []), answerOnly(previous)] : [] };
      continue;
    }
    if (follows === 'missing') {
      // Never trusted silently: the answer it followed is gone.
      answers[saved.id] = { ...plainAnswer(saved.answer), history: saved.answer.history ?? [], conflict: { kind: 'missing-predecessor', message: MISSING_PREDECESSOR_MESSAGE, answers: [plainAnswer(saved.answer)] } };
      continue;
    }
    const incoming = plainAnswer(saved.answer);
    const [older, newer] = Date.parse(incoming.at) >= Date.parse(previous.at) ? [answerOnly(previous), incoming] : [incoming, answerOnly(previous)];
    const current = plainAnswer(newer);
    answers[saved.id] = {
      ...current,
      history: [...(previous.history ?? []), plainAnswer(older)],
      conflict: { kind: 'unchained', message: ANSWER_CONFLICT_MESSAGE, answers: [plainAnswer(older), current] }
    };
  }
  return answers;
}

function approvalContent(item, root) {
  return { id: item.id, itemRevision: item.revision, question: item.question, current: item.current, proposal: item.proposal, draft: item.draft ?? null, sources: normalizeSources(item.sources, root), evidence: clone(item.evidence ?? item.brief?.artifacts ?? null) };
}
export function approvalHash(item, { root } = {}) { return hash(approvalContent(item, root)); }
// options.isConfirmation(item, answer) decides which answers are
// confirmations; options.root normalizes absolute source paths.
export function approvalSnapshot(item, answer, { root, isConfirmation = defaultIsConfirmation } = {}) {
  if (!isConfirmation(item, answer) || answer.itemRevision !== item.revision) fail('not-confirmed', 'Only the current explicit confirmation can freeze approved wording');
  return { ...approvalContent(item, root), hash: approvalHash(item, { root }), confirmedAt: answer.at, verdict: answer.verdict, note: answer.note };
}

// Why an answer is not a current exact confirmation of the item, or null.
// policy = { root, isConfirmation } from the workflow that asks.
function confirmationProblem(item, answer, policy) {
  if (answer?.conflict) return { code: 'answer-conflict', message: `${item.id} has two conflicting answers; the owner must answer again before it counts as confirmed` };
  if (!policy.isConfirmation(item, answer)) return { code: 'not-confirmed', message: `${item.id} needs an explicit confirmed answer before promotion` };
  if (answer.itemRevision !== item.revision) return { code: 'stale-approval', message: `${item.id} answer is stale` };
  const snapshot = answer.approval;
  const exact = snapshot
    && snapshot.itemRevision === item.revision
    && snapshot.hash === approvalHash(item, policy)
    && hash(approvalContent({ ...snapshot, revision: snapshot.itemRevision }, policy.root)) === snapshot.hash
    && snapshot.verdict === answer.verdict
    && snapshot.note === answer.note
    && snapshot.confirmedAt === answer.at;
  if (!exact) return { code: 'stale-approval', message: `${item.id} approved wording changed or has no exact approval snapshot; confirm the current draft` };
  return null;
}

function changeAwaitingRevision(comments, item) {
  return comments.some(comment => comment.id === item.id && comment.kind === 'change' && comment.itemRevision === item.revision);
}

function safePath(root, relative, { existing = false } = {}) {
  if (typeof relative !== 'string' || !relative || path.isAbsolute(relative)) fail('invalid-path', 'A path must be relative and inside the room');
  const target = path.resolve(root, relative);
  const inside = path.relative(root, target);
  if (!inside || inside === '..' || inside.startsWith(`..${path.sep}`)) fail('invalid-path', 'A path must be inside the room');
  let current = root;
  for (const part of inside.split(path.sep)) {
    current = path.join(current, part);
    let stat;
    try { stat = fs.lstatSync(current); } catch (error) { if (error.code === 'ENOENT') break; throw error; }
    if (stat.isSymbolicLink()) fail('invalid-path', 'A symlink cannot be an owner or working path');
  }
  if (existing && (!fs.existsSync(target) || !fs.statSync(target).isFile())) fail('invalid-path', `${relative} must name an existing ordinary owner file`);
  return target;
}

// Create `file` with `contents` only if it does not exist, never exposing a
// partial file: the bytes are complete in a sibling temp file before the hard
// link publishes them. Returns false when the file already exists.
function createExclusive(file, contents) {
  const temp = `${file}.${process.pid}.${randomUUID()}.tmp`;
  fs.writeFileSync(temp, contents, { flag: 'wx' });
  try {
    fs.linkSync(temp, file);
    return true;
  } catch (error) {
    if (error.code === 'EEXIST') return false;
    throw error;
  } finally {
    fs.rmSync(temp, { force: true });
  }
}

function readComment(file, name) {
  const comment = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (comment.schema !== 'dashboard-comment@1' || !comment.actionId || !comment.id || !['comment', 'change'].includes(comment.kind)) fail('invalid-comment', `${name} is not a comment record`);
  return comment;
}

function commentStatus(comment, items, answers, policy) {
  if (comment.kind !== 'change') return comment.status;
  const item = items.find(candidate => candidate.id === comment.id);
  const revised = item && item.revision > comment.itemRevision;
  if (!revised) return 'awaiting revision';
  return confirmationProblem(item, answers[comment.id], policy) ? 'revised; awaiting confirmation' : 'revised; confirmed';
}

function dispositionCard(item, disposition, base) {
  const receipts = disposition.receipts;
  const state = RECEIPT_STATES[receipts.length];
  const card = { ...base, state, label: CARD_STATES[state], requestId: disposition.requestId, approvalHash: disposition.approval.hash, approvedRevision: disposition.approval.itemRevision, revisedSinceRequest: item.revision !== disposition.approval.itemRevision };
  const [map, plan, implemented] = [receipts[2], receipts[4], receipts[6]];
  if (map) card.mapping = { implementationNeeded: map.implementationNeeded, specs: linksNamed(map.links, 'SPEC.md'), reason: map.reason };
  if (plan) card.plan = { implementationNeeded: plan.implementationNeeded, tasks: linksNamed(plan.links, 'TASK.md'), reason: plan.reason };
  if (implemented) card.implementation = { tasks: linksNamed(implemented.links, 'TASK.md'), evidence: clone(implemented.evidence) };
  if (map && map.implementationNeeded === false) card.label = `${card.label}; knowledge-only, no Spec or Task: ${map.reason}`;
  return card;
}

// One visible state per card. Implementation is never inferred: only an
// Implemented receipt backed by a done Task produces it.
function cardStates(items, answers, state, policy) {
  const cards = {};
  for (const item of items) {
    const base = { id: item.id, itemRevision: item.revision };
    if (item.status === 'withdrawn') {
      cards[item.id] = { ...base, state: 'withdrawn', label: CARD_STATES.withdrawn };
      continue;
    }
    const answer = answers[item.id];
    const confirmed = !confirmationProblem(item, answer, policy) && !changeAwaitingRevision(state.comments, item);
    const disposition = state.dispositions[item.id];
    if (answer?.conflict && !disposition) {
      cards[item.id] = { ...base, state: 'answer-conflict', label: CARD_STATES['answer-conflict'], conflict: clone(answer.conflict) };
      continue;
    }
    if (disposition && !(confirmed && answer.approval.hash !== disposition.approval.hash)) cards[item.id] = dispositionCard(item, disposition, base);
    else if (confirmed) cards[item.id] = { ...base, state: 'confirmed', label: CARD_STATES.confirmed, approvalHash: answer.approval.hash };
    else cards[item.id] = { ...base, state: 'in-grilling', label: CARD_STATES['in-grilling'] };
  }
  return cards;
}

export function createWorkflow(root, readers = {}) {
  root = fs.realpathSync(root);
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'workbench/manifest.json'), 'utf8'));
  const notepads = manifest.collections?.notepads;
  if (!notepads) fail('missing-owner', 'The manifest must declare the native notepads collection');
  const note = `${notepads}/grilling/dashboard-owner-flow.json`;
  const noteFile = safePath(root, note);
  const policy = { root, isConfirmation: readers.isConfirmation ?? defaultIsConfirmation };
  const readItems = readers.readItems ?? (() => JSON.parse(fs.readFileSync(path.join(root, 'workbench/grill-board/items.json'), 'utf8')));
  const readAnswers = readers.readAnswers ?? (() => {
    const file = safePath(root, 'workbench/grill-board/answers.json');
    const legacy = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : { answers: {} };
    // The same history chaining as the board's readAnswers (chainAnswers).
    const answerNote = `${notepads}/grilling/dashboard-answers.json`;
    const entries = [];
    if (fs.existsSync(safePath(root, answerNote))) {
      const native = checkResult(readNote(root, { note: answerNote, topic: 'dashboard-answer' }));
      for (const entry of native.entries) {
        let saved;
        try { saved = JSON.parse(entry.content); } catch { fail('invalid-notepad', `Native answer entry ${entry.id} has invalid JSON`); }
        if (!saved?.id || !saved.answer || typeof saved.answer !== 'object' || Array.isArray(saved.answer)) fail('invalid-notepad', `Native answer entry ${entry.id} is incomplete`);
        entries.push(saved);
      }
    }
    return { ...legacy, answers: chainAnswers(legacy.answers ?? {}, entries) };
  });

  function read() {
    safePath(root, note);
    const loaded = fs.existsSync(noteFile) ? checkResult(readNote(root, { note })) : { revision: 0, entries: [] };
    const state = { note, revision: loaded.revision, comments: [], interrupted: [], rounds: [], requests: [], dispositions: {}, cards: {}, actions: [] };
    for (const entry of loaded.entries) {
      if (entry.topic !== 'dashboard-owner-flow') continue;
      let event;
      try { event = JSON.parse(entry.content); } catch { fail('invalid-notepad', `Workflow entry ${entry.id} has invalid JSON`); }
      if (event.schema !== 'dashboard-action@1' || !event.actionId || !event.operation || !event.result || !event.inputHash) fail('invalid-notepad', `Workflow entry ${entry.id} is incomplete`);
      state.actions.push(event);
      if (event.operation === 'round') state.rounds.push(event.result.round);
      if (event.operation === 'promotion') {
        const request = event.result.request;
        state.requests.push(request);
        for (const card of request.cards) state.dispositions[card.id] = { requestId: request.id, id: card.id, stage: 'Requested', status: 'requested', receipts: [], approval: card, sourceLinks: clone(card.sources) };
      }
      if (event.operation === 'disposition') state.dispositions[event.result.disposition.id] = event.result.disposition;
    }
    const recordedComments = new Set(state.actions.filter(action => action.operation === 'comment').map(action => action.actionId));
    const dir = safePath(root, COMMENT_DIR);
    if (fs.existsSync(dir)) {
      for (const name of fs.readdirSync(dir).filter(name => name.endsWith('.json')).sort()) {
        const comment = readComment(safePath(root, `${COMMENT_DIR}/${name}`, { existing: true }), name);
        if (recordedComments.has(comment.actionId)) state.comments.push({ ...comment, recorded: true });
        else {
          state.comments.push({ ...comment, recorded: false, recovery: 'The comment file was saved but its workflow entry was not; resend the same action (same actionId and payload) to finish recording it.' });
          state.interrupted.push(comment.actionId);
        }
      }
    }
    const items = readItems(root).items;
    const answers = readAnswers(root).answers;
    state.comments = state.comments.map(comment => ({ ...comment, status: commentStatus(comment, items, answers, policy) }));
    state.cards = cardStates(items, answers, state, policy);
    return state;
  }

  function start(input, operation) {
    text(input.actionId, 'actionId');
    if (input.actionId.length > 160) fail('invalid-input', 'actionId is too long');
    const state = read();
    const { expectedRevision, ...payload } = input;
    const inputHash = hash(canonical({ operation, payload }));
    // Actions recorded before canonical hashing kept the sender's key order.
    const legacyHash = hash({ operation, payload });
    const previous = state.actions.find(action => action.actionId === input.actionId);
    if (previous) {
      if (previous.operation !== operation || ![inputHash, legacyHash].includes(previous.inputHash)) fail('action-id-conflict', 'This action ID already records different input');
      return { repeated: { ...clone(previous.result), revision: state.revision, idempotent: true } };
    }
    if (!Number.isSafeInteger(expectedRevision) || expectedRevision !== state.revision) fail('stale-revision', `Workflow is at revision ${state.revision}; read it again`);
    return { state, inputHash };
  }

  function save(input, operation, started, result, kind) {
    let revision = started.state.revision;
    if (!revision) {
      const created = checkResult(createNote(root, { note, type: 'grilling', objective: 'dashboard-owner-flow', title: 'Dashboard owner working flow', focus: 'Owner-triggered rounds and confirmed-card promotion handoffs', state: 'Working context; existing source owners remain authoritative', 'next-action': 'Read the selected confirmed source and follow the authorized promotion endpoint' }));
      revision = created.revision;
    }
    const event = { schema: 'dashboard-action@1', actionId: input.actionId, operation, inputHash: started.inputHash, at: new Date().toISOString(), result: clone(result) };
    const appended = checkResult(appendEntry(root, { note, revision, kind, topic: 'dashboard-owner-flow', content: JSON.stringify(event) }));
    return { ...result, revision: appended.revision };
  }

  function itemFor(id, revision) {
    const item = readItems(root).items.find(item => item.id === id);
    if (!item) fail('unknown-card', `Unknown card ${id}`);
    if (item.status === 'withdrawn') fail('withdrawn-card', `${id} is withdrawn`);
    if (item.revision !== revision) fail('stale-item', `${id} is at revision ${item.revision}; read the question again`);
    return item;
  }

  // Finish recording a comment file that an interrupted writer (or a
  // concurrent one with the same action) already saved. Only the exact same
  // action may adopt it, and a refusal never removes the saved file.
  function adoptComment(input, kind, started, existing) {
    const same = existing.actionId === input.actionId && existing.id === input.id && existing.itemRevision === input.itemRevision && existing.kind === kind && existing.text === input.text;
    if (!same) fail('action-id-conflict', 'This comment action already saved different input');
    if (!readItems(root).items.some(item => item.id === existing.id)) fail('unknown-card', `Unknown card ${existing.id}`);
    return save(input, 'comment', started, { comment: existing, recovered: true }, 'source_record');
  }

  function comment(input) {
    const kind = input.kind ?? 'comment';
    if (!['comment', 'change'].includes(kind)) fail('invalid-input', 'kind must be comment or change');
    text(input.text, 'text');
    const started = start(input, 'comment');
    if (started.repeated) return started.repeated;
    const relative = `${COMMENT_DIR}/${hash(input.actionId)}.json`;
    const file = safePath(root, relative);
    if (fs.existsSync(file)) return adoptComment(input, kind, started, readComment(file, relative));
    const item = itemFor(input.id, input.itemRevision);
    const record = { schema: 'dashboard-comment@1', id: input.id, itemRevision: input.itemRevision, kind, text: input.text, actionId: input.actionId, at: new Date().toISOString(), status: kind === 'change' ? 'awaiting revision' : 'requested', path: relative, sources: normalizeSources(item.sources, root) };
    fs.mkdirSync(path.dirname(file), { recursive: true });
    if (!createExclusive(file, `${JSON.stringify(record, null, 2)}\n`)) return adoptComment(input, kind, started, readComment(file, relative));
    try {
      return save(input, 'comment', started, { comment: record }, 'source_record');
    } catch (error) {
      fs.rmSync(file, { force: true });
      throw error;
    }
  }

  function endRound(input) {
    const started = start(input, 'round');
    if (started.repeated) return started.repeated;
    const answers = readAnswers(root).answers;
    const confirmed = readItems(root).items
      .filter(item => item.status !== 'withdrawn' && !confirmationProblem(item, answers[item.id], policy) && !changeAwaitingRevision(started.state.comments, item))
      .map(item => ({ id: item.id, itemRevision: item.revision }));
    return save(input, 'round', started, { round: { id: input.actionId, number: started.state.rounds.length + 1, endedAt: new Date().toISOString(), confirmed } }, 'directive');
  }

  function promote(input) {
    if ('implementationNeeded' in input) fail('invalid-input', 'Implementation need is established by the agent at Map');
    const started = start(input, 'promotion');
    if (started.repeated) return started.repeated;
    if (!Array.isArray(input.ids) || !input.ids.length || new Set(input.ids).size !== input.ids.length) fail('invalid-input', 'Select distinct confirmed card IDs');
    const answers = readAnswers(root).answers;
    const cards = input.ids.map(id => {
      const item = itemFor(id, input.revisions?.[id]);
      const answer = answers[id];
      const problem = confirmationProblem(item, answer, policy);
      if (problem?.code === 'not-confirmed') fail(problem.code, problem.message);
      if (changeAwaitingRevision(started.state.comments, item)) fail('change-awaiting-revision', `${id} has a Change request awaiting an agent revision and fresh owner confirmation`);
      if (problem) fail(problem.code, problem.message);
      const snapshot = answer.approval;
      if (started.state.requests.some(request => request.cards.some(card => card.id === id && card.hash === snapshot.hash))) fail('already-requested', `${id} promotion was already requested for these approved bytes`);
      return clone(snapshot);
    });
    const sourceLinks = [...new Map(cards.flatMap(card => card.sources).map(source => [JSON.stringify(source), source])).values()];
    const request = { id: input.actionId, requestedAt: new Date().toISOString(), status: 'requested', dispatch: 'manual', stages: [...PROMOTION_STAGES], cards, sourceLinks };
    return save(input, 'promotion', started, { request }, 'directive');
  }

  // Durable owner references: https URLs or existing ordinary room files that
  // are not working material (notepads, board answers, board comments).
  function ownerLinks(values, name, { allowEmpty = false } = {}) {
    if (allowEmpty && (values === undefined || (Array.isArray(values) && !values.length))) return [];
    if (!Array.isArray(values) || !values.length) fail('invalid-input', `${name} must contain existing durable owner references`);
    for (const value of values) {
      const reference = typeof value === 'string' ? value : value?.path ?? value?.url;
      text(reference, name);
      if (/^https:\/\//.test(reference)) {
        const url = new URL(reference);
        if (url.username || url.password) fail('invalid-path', 'Owner links cannot contain credentials');
        continue;
      }
      const relative = linkTarget(reference);
      if (relative === notepads || relative.startsWith(`${notepads}/`)) fail('invalid-path', 'A working notepad is not durable evidence');
      if (BOARD_WORKING_FILES.some(working => relative === working || (working.endsWith('/') && relative.startsWith(working)))) fail('invalid-path', `${relative} is board working material, not durable evidence`);
      safePath(root, relative, { existing: true });
    }
    return clone(values);
  }

  function taskStatus(relative) {
    return fs.readFileSync(safePath(root, relative, { existing: true }), 'utf8').match(/^\*\*Status:\*\*\s*(\S+)/m)?.[1] ?? null;
  }

  function disposition(input) {
    text(input.by, 'by');
    const started = start(input, 'disposition');
    if (started.repeated) return started.repeated;
    const request = started.state.requests.find(request => request.id === input.requestId);
    if (!request?.cards.some(card => card.id === input.id)) fail('unknown-request', 'This card is not in that promotion request');
    const previous = started.state.dispositions[input.id];
    if (previous.requestId !== input.requestId) fail('stale-request', 'This card has a newer promotion request');
    const index = previous.receipts.length;
    const implementationPublished = index === PROMOTION_STAGES.length && previous.implementationNeeded === true;
    const expected = PROMOTION_STAGES[index] ?? (implementationPublished ? IMPLEMENTED_STAGE : null);
    if (input.stage !== expected) {
      if (input.stage === IMPLEMENTED_STAGE && index === PROMOTION_STAGES.length && previous.implementationNeeded === false) fail('knowledge-only', 'A knowledge-only decision has no implementation to record');
      fail('stage-order', `The next stage is ${expected ?? (index === PROMOTION_STAGES.length ? 'none; promotion is published' : 'none; implementation is recorded')}`);
    }
    let implementationNeeded = previous.implementationNeeded;
    if (input.stage === 'Map') {
      if (typeof input.implementationNeeded !== 'boolean') fail('invalid-input', 'Map must state whether implementation is needed');
      implementationNeeded = input.implementationNeeded;
    }
    if (input.stage === 'Plan' && input.implementationNeeded !== undefined && input.implementationNeeded !== implementationNeeded) fail('invalid-input', 'Plan cannot silently change the Map disposition');
    const knowledgeOnlyStep = ['Map', 'Plan'].includes(input.stage) && implementationNeeded === false;
    if (knowledgeOnlyStep) text(input.reason, 'Knowledge-only Map/Plan reason');
    // A knowledge-only Map or Plan is a recorded no-op: it names no resulting
    // owner, only its reason and evidence.
    const links = ownerLinks(input.links, 'links', { allowEmpty: knowledgeOnlyStep });
    const evidence = ownerLinks(input.evidence, 'evidence');
    if (implementationNeeded === true && input.stage === 'Map' && !linksNamed(links, 'SPEC.md').length) fail('missing-owner', 'Map needs a link to its Spec native owner');
    if (implementationNeeded === true && input.stage === 'Plan') {
      const tasks = linksNamed(links, 'TASK.md');
      if (!tasks.length) fail('missing-owner', 'Plan needs a link to its Task native owner');
      const specDirs = linksNamed(previous.receipts[2].links, 'SPEC.md').map(spec => `${path.posix.dirname(spec)}/`);
      if (!tasks.every(task => specDirs.some(dir => task.startsWith(dir)))) fail('missing-owner', 'Plan Tasks must belong to the mapped Spec');
    }
    if (input.stage === IMPLEMENTED_STAGE) {
      const planned = new Set(linksNamed(previous.receipts[4].links, 'TASK.md'));
      const tasks = linksNamed(links, 'TASK.md').filter(task => planned.has(task));
      if (!tasks.length) fail('missing-owner', 'Implemented needs a link to a Task named in the Plan receipt');
      for (const task of tasks) if (taskStatus(task) !== 'done') fail('not-done', `${task} is not done; implementation is recorded only from a done Task`);
    }
    const receipt = { index, stage: input.stage, by: input.by, at: new Date().toISOString(), links, evidence, reason: input.reason ?? '', ...(implementationNeeded !== undefined ? { implementationNeeded } : {}) };
    const status = input.stage === IMPLEMENTED_STAGE ? 'implemented' : index === PROMOTION_STAGES.length - 1 ? 'published' : 'promoting';
    const result = { ...previous, stage: input.stage, status, receipts: [...previous.receipts, receipt], sourceLinks: [...previous.sourceLinks, ...links, ...evidence], ...(implementationNeeded !== undefined ? { implementationNeeded } : {}) };
    return save(input, 'disposition', started, { disposition: result }, 'verification');
  }

  return { read, comment, endRound, promote, disposition };
}

// The CLI reads through the board, so it counts the same confirmations
// (including a confirmed alternative) as the served page. The board imports
// this module, so it is loaded once this module has finished evaluating
// (an awaited import here would deadlock on the cycle).
async function cli(argv) {
  const [command, ...args] = argv;
  const options = {};
  for (let i = 0; i < args.length; i += 2) {
    if (!args[i]?.startsWith('--') || args[i + 1] === undefined) fail('invalid-input', 'Use --path ROOT and --input JSON_FILE');
    options[args[i].slice(2)] = args[i + 1];
  }
  if (!['read', 'disposition'].includes(command)) fail('invalid-input', 'CLI accepts read or disposition; owner actions use the served page');
  const board = await import('./grill-board.mjs');
  const api = board.workflow(path.resolve(options.path ?? process.cwd()));
  return command === 'read' ? api.read() : api.disposition(JSON.parse(fs.readFileSync(options.input, 'utf8')));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  cli(process.argv.slice(2))
    .then(result => console.log(JSON.stringify(result, null, 2)))
    .catch(error => { console.error(error.message); process.exitCode = 1; });
}

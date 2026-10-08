#!/usr/bin/env node
// Local owner working context and explicit promotion receipts. This module
// neither publishes owners nor launches agents. Board readers are injected so
// the served page and CLI can use their existing authoritative source seams.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { appendEntry, createNote, readNote } from '../workbench/tools/notepads.mjs';

export const PROMOTION_STAGES = Object.freeze(['Record', 'Publish', 'Map', 'Publish', 'Plan', 'Publish']);
const hash = value => createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');
const clone = value => JSON.parse(JSON.stringify(value));
function fail(code, message) { const error = new Error(`${code}: ${message}`); error.code = code; throw error; }
function text(value, name) { if (typeof value !== 'string' || !value.trim()) fail('invalid-input', `${name} must be nonempty text`); return value; }
function checkResult(result) { if (result.status === 'blocked') fail(result.error?.code ?? 'notepad', result.error?.message ?? JSON.stringify(result.error)); return result; }

function approvalContent(item) {
  return { id: item.id, itemRevision: item.revision, question: item.question, current: item.current, proposal: item.proposal, draft: item.draft ?? null, sources: clone(item.sources ?? []), evidence: clone(item.evidence ?? item.brief?.artifacts ?? null) };
}
export function approvalHash(item) { return hash(approvalContent(item)); }
export function approvalSnapshot(item, answer) {
  if (!['confirm', 'approve'].includes(answer?.verdict) || answer.itemRevision !== item.revision) fail('not-confirmed', 'Only the current explicit confirmation can freeze approved wording');
  return { ...approvalContent(item), hash: approvalHash(item), confirmedAt: answer.at, verdict: answer.verdict, note: answer.note };
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

export function createWorkflow(root, readers = {}) {
  root = fs.realpathSync(root);
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'workbench/manifest.json'), 'utf8'));
  const notepads = manifest.collections?.notepads;
  if (!notepads) fail('missing-owner', 'The manifest must declare the native notepads collection');
  const note = `${notepads}/grilling/dashboard-owner-flow.json`;
  const noteFile = safePath(root, note);
  const commentDir = 'workbench/grill-board/comments';
  const readItems = readers.readItems ?? (() => JSON.parse(fs.readFileSync(path.join(root, 'workbench/grill-board/items.json'), 'utf8')));
  const readAnswers = readers.readAnswers ?? (() => {
    const file = safePath(root, 'workbench/grill-board/answers.json');
    const legacy = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : { answers: {} };
    const answers = { ...legacy.answers };
    const answerNote = `${notepads}/grilling/dashboard-answers.json`;
    if (fs.existsSync(safePath(root, answerNote))) {
      const native = checkResult(readNote(root, { note: answerNote, topic: 'dashboard-answer' }));
      for (const entry of native.entries) {
        let saved;
        try { saved = JSON.parse(entry.content); } catch { fail('invalid-notepad', `Native answer entry ${entry.id} has invalid JSON`); }
        if (!saved?.id || !saved.answer || typeof saved.answer !== 'object' || Array.isArray(saved.answer)) fail('invalid-notepad', `Native answer entry ${entry.id} is incomplete`);
        answers[saved.id] = saved.answer;
      }
    }
    return { ...legacy, answers };
  });

  function read() {
    safePath(root, note);
    const loaded = fs.existsSync(noteFile) ? checkResult(readNote(root, { note })) : { revision: 0, entries: [] };
    const state = { note, revision: loaded.revision, comments: [], rounds: [], requests: [], dispositions: {}, actions: [] };
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
    const dir = safePath(root, commentDir);
    if (fs.existsSync(dir)) for (const name of fs.readdirSync(dir).filter(name => name.endsWith('.json')).sort()) {
      const file = safePath(root, `${commentDir}/${name}`, { existing: true });
      const comment = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (comment.schema !== 'dashboard-comment@1' || !comment.actionId || !comment.id || !['comment', 'change'].includes(comment.kind)) fail('invalid-comment', `${name} is not a comment record`);
      state.comments.push(comment);
    }
    if (state.comments.length) {
      const items = readItems(root).items;
      const answers = readAnswers(root).answers;
      state.comments = state.comments.map(comment => {
        if (comment.kind !== 'change') return comment;
        const item = items.find(item => item.id === comment.id);
        const answer = answers[comment.id];
        const revised = item && item.revision > comment.itemRevision;
        const confirmed = revised && ['confirm', 'approve'].includes(answer?.verdict) && answer.itemRevision === item.revision && answer.approval?.hash === approvalHash(item);
        return { ...comment, status: confirmed ? 'revised; confirmed' : revised ? 'revised; awaiting confirmation' : 'awaiting revision' };
      });
    }
    return state;
  }

  function start(input, operation) {
    text(input.actionId, 'actionId');
    if (input.actionId.length > 160) fail('invalid-input', 'actionId is too long');
    const state = read();
    const { expectedRevision, ...payload } = input;
    const inputHash = hash({ operation, payload });
    const previous = state.actions.find(action => action.actionId === input.actionId);
    if (previous) {
      if (previous.operation !== operation || previous.inputHash !== inputHash) fail('action-id-conflict', 'This action ID already records different input');
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

  function comment(input) {
    const kind = input.kind ?? 'comment';
    if (!['comment', 'change'].includes(kind)) fail('invalid-input', 'kind must be comment or change');
    text(input.text, 'text');
    const started = start(input, 'comment');
    if (started.repeated) return started.repeated;
    const item = itemFor(input.id, input.itemRevision);
    const relative = `${commentDir}/${hash(input.actionId)}.json`;
    const record = { schema: 'dashboard-comment@1', id: input.id, itemRevision: input.itemRevision, kind, text: input.text, actionId: input.actionId, at: new Date().toISOString(), status: kind === 'change' ? 'awaiting revision' : 'requested', path: relative, sources: clone(item.sources ?? []) };
    const file = safePath(root, relative);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    if (fs.existsSync(file)) fail('action-id-conflict', 'This comment action already has a durable record; reload before retrying');
    fs.writeFileSync(file, `${JSON.stringify(record, null, 2)}\n`, { flag: 'wx' });
    try { return save(input, 'comment', started, { comment: record }, 'source_record'); }
    catch (error) { fs.unlinkSync(file); throw error; }
  }

  function endRound(input) {
    const started = start(input, 'round');
    if (started.repeated) return started.repeated;
    const answers = readAnswers(root).answers;
    const confirmed = readItems(root).items.filter(item => ['confirm', 'approve'].includes(answers[item.id]?.verdict) && answers[item.id].itemRevision === item.revision && item.status !== 'withdrawn').map(item => ({ id: item.id, itemRevision: item.revision }));
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
      if (!['confirm', 'approve'].includes(answer?.verdict)) fail('not-confirmed', `${id} needs an explicit confirmed answer before promotion`);
      if (answer.itemRevision !== item.revision) fail('stale-approval', `${id} answer is stale`);
      if (started.state.comments.some(comment => comment.id === id && comment.kind === 'change' && comment.itemRevision === item.revision)) fail('change-awaiting-revision', `${id} has a Change request awaiting an agent revision and fresh owner confirmation`);
      const snapshot = answer.approval;
      if (!snapshot || snapshot.itemRevision !== item.revision || snapshot.hash !== approvalHash(item) || hash(approvalContent({ ...snapshot, revision: snapshot.itemRevision })) !== snapshot.hash || snapshot.verdict !== answer.verdict || snapshot.note !== answer.note || snapshot.confirmedAt !== answer.at) fail('stale-approval', `${id} approved wording changed or has no exact approval snapshot; confirm the current draft`);
      if (started.state.requests.some(request => request.cards.some(card => card.id === id && card.hash === snapshot.hash))) fail('already-requested', `${id} promotion was already requested for these approved bytes`);
      return clone(snapshot);
    });
    const sourceLinks = [...new Map(cards.flatMap(card => card.sources).map(source => [JSON.stringify(source), source])).values()];
    const request = { id: input.actionId, requestedAt: new Date().toISOString(), status: 'requested', dispatch: 'manual', stages: [...PROMOTION_STAGES], cards, sourceLinks };
    return save(input, 'promotion', started, { request }, 'directive');
  }

  function ownerLinks(values, name) {
    if (!Array.isArray(values) || !values.length) fail('invalid-input', `${name} must contain existing durable owner references`);
    for (const value of values) {
      const reference = typeof value === 'string' ? value : value?.path ?? value?.url;
      text(reference, name);
      if (/^https:\/\//.test(reference)) {
        const url = new URL(reference);
        if (url.username || url.password) fail('invalid-path', 'Owner links cannot contain credentials');
      } else {
        const relative = reference.split('#')[0].replace(/:\d+$/, '');
        if (relative === notepads || relative.startsWith(`${notepads}/`)) fail('invalid-path', 'A working notepad is not durable evidence');
        safePath(root, relative, { existing: true });
      }
    }
    return clone(values);
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
    if (PROMOTION_STAGES[index] !== input.stage) fail('stage-order', `The next stage is ${PROMOTION_STAGES[index] ?? 'none; promotion is published'}`);
    const links = ownerLinks(input.links, 'links');
    const evidence = ownerLinks(input.evidence, 'evidence');
    let implementationNeeded = previous.implementationNeeded;
    if (input.stage === 'Map') {
      if (typeof input.implementationNeeded !== 'boolean') fail('invalid-input', 'Map must state whether implementation is needed');
      implementationNeeded = input.implementationNeeded;
    }
    if (input.stage === 'Plan' && input.implementationNeeded !== undefined && input.implementationNeeded !== implementationNeeded) fail('invalid-input', 'Plan cannot silently change the Map disposition');
    if (['Map', 'Plan'].includes(input.stage) && implementationNeeded === false) text(input.reason, 'Knowledge-only Map/Plan reason');
    if (implementationNeeded === true && ['Map', 'Plan'].includes(input.stage)) {
      const filename = input.stage === 'Map' ? 'SPEC.md' : 'TASK.md';
      if (!links.some(link => (typeof link === 'string' ? link : link.path ?? link.url).split('#')[0].replace(/:\d+$/, '').endsWith(`/${filename}`))) fail('missing-owner', `${input.stage} needs a link to its ${input.stage === 'Map' ? 'Spec' : 'Task'} native owner`);
    }
    const receipt = { index, stage: input.stage, by: input.by, at: new Date().toISOString(), links, evidence, reason: input.reason ?? '', ...(implementationNeeded !== undefined ? { implementationNeeded } : {}) };
    const result = { ...previous, stage: input.stage, status: index === 5 ? 'published' : 'promoting', receipts: [...previous.receipts, receipt], sourceLinks: [...previous.sourceLinks, ...links, ...evidence], ...(implementationNeeded !== undefined ? { implementationNeeded } : {}) };
    return save(input, 'disposition', started, { disposition: result }, 'verification');
  }

  return { read, comment, endRound, promote, disposition };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const [command, ...args] = process.argv.slice(2);
    const options = {};
    for (let i = 0; i < args.length; i += 2) {
      if (!args[i]?.startsWith('--') || args[i + 1] === undefined) fail('invalid-input', 'Use --path ROOT and --input JSON_FILE');
      options[args[i].slice(2)] = args[i + 1];
    }
    const api = createWorkflow(options.path ?? process.cwd());
    if (!['read', 'disposition'].includes(command)) fail('invalid-input', 'CLI accepts read or disposition; owner actions use the served page');
    const result = command === 'read' ? api.read() : api.disposition(JSON.parse(fs.readFileSync(options.input, 'utf8')));
    console.log(JSON.stringify(result, null, 2));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}

#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { approvalHash, approvalSnapshot, createWorkflow, PROMOTION_STAGES } from './dashboard-workflow.mjs';
import { appendEntry, createNote } from '../workbench/tools/notepads.mjs';
import * as board from './grill-board.mjs';

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'dashboard-workflow-'));
  fs.mkdirSync(path.join(root, 'workbench'), { recursive: true });
  fs.writeFileSync(path.join(root, 'workbench/manifest.json'), JSON.stringify({ schemaVersion: 2, lanes: { sessions: 'workbench/sessions' }, collections: { notepads: 'workbench/sessions/notepads', 'notepad-templates': 'workbench/sessions/notepads/templates', handoffs: 'workbench/sessions/handoffs' } }));
  fs.writeFileSync(path.join(root, 'README.md'), '# Durable owner\n');
  const items = [1, 2].map(n => ({ id: `GB-000${n}`, revision: 1, status: 'open', title: `Question ${n}`, question: 'Which document should own this explanation?', current: 'The explanation is working material.', proposal: 'Keep the explanation in the Wiki.', draft: '# Actual proposed draft\n\nThe complete proposed words.\n', sources: [{ label: 'Owner', path: 'README.md', ref: 'fixture' }], brief: { artifacts: 'README holds the fixture explanation.' } }));
  const answers = {};
  const api = createWorkflow(root, { readItems: () => ({ items }), readAnswers: () => ({ answers }) });
  function confirm(id = items[0].id) {
    const item = items.find(i => i.id === id);
    const answer = { verdict: 'confirm', note: 'These exact words', at: '2026-10-08T00:00:00.000Z', itemRevision: item.revision };
    answers[id] = { ...answer, approval: approvalSnapshot(item, answer) };
  }
  return { root, items, answers, api, confirm };
}

test('Change persists a distinct durable comment and never becomes approval', () => {
  const f = fixture();
  const saved = f.api.comment({ id: 'GB-0001', itemRevision: 1, kind: 'change', text: 'Explain the source context.', actionId: 'change-1', expectedRevision: 0 });
  assert.equal(saved.comment.kind, 'change');
  assert.equal(fs.existsSync(path.join(f.root, saved.comment.path)), true);
  assert.equal(f.api.read().comments.length, 1);
  assert.equal(f.api.read().requests.length, 0);
  assert.deepEqual(f.answers, {});
  assert.throws(() => f.api.promote({ ids: ['GB-0001'], revisions: { 'GB-0001': 1 }, actionId: 'promote-1', expectedRevision: saved.revision }), /confirmed/);
});

test('actions are idempotent by exact payload and reject reused IDs with different text', () => {
  const f = fixture();
  const input = { id: 'GB-0001', itemRevision: 1, text: 'A comment.', actionId: 'comment-1', expectedRevision: 0 };
  const first = f.api.comment(input);
  assert.equal(f.api.comment(input).comment.path, first.comment.path);
  assert.equal(f.api.read().comments.length, 1);
  assert.throws(() => f.api.comment({ ...input, text: 'Different words' }), /action-id/);
  assert.throws(() => f.api.comment({ ...input, actionId: 'comment-2' }), /stale/);
});

test('round endings are explicit and repeatable without promotion', () => {
  const f = fixture();
  f.confirm();
  const first = f.api.endRound({ actionId: 'round-1', expectedRevision: 0 });
  assert.equal(first.round.number, 1);
  assert.equal(f.api.read().requests.length, 0);
  const second = f.api.endRound({ actionId: 'round-2', expectedRevision: first.revision });
  assert.equal(second.round.number, 2);
  assert.equal(f.api.read().rounds.length, 2);
});

test('promotion snapshots only selected current confirmations and retains exact approved bytes', () => {
  const f = fixture();
  f.confirm();
  const requested = f.api.promote({ ids: ['GB-0001'], revisions: { 'GB-0001': 1 }, actionId: 'promote-1', expectedRevision: 0 });
  assert.equal(requested.request.cards.length, 1);
  assert.equal(requested.request.cards[0].draft, f.items[0].draft);
  assert.equal(requested.request.cards[0].note, 'These exact words');
  assert.equal(f.api.read().dispositions['GB-0001'].stage, 'Requested');
  assert.equal(f.api.read().dispositions['GB-0002'], undefined);
  f.items[0].draft = 'Later revision';
  assert.equal(f.api.read().requests[0].cards[0].draft, '# Actual proposed draft\n\nThe complete proposed words.\n');
  assert.throws(() => f.api.promote({ ids: ['GB-0001'], revisions: { 'GB-0001': 1 }, actionId: 'promote-2', expectedRevision: requested.revision }), /stale|changed/);
});

test('stale, unconfirmed and corrected answers cannot promote; duplicate promotion is refused', () => {
  const f = fixture();
  f.confirm();
  f.answers['GB-0001'].verdict = 'correct';
  assert.throws(() => f.api.promote({ ids: ['GB-0001'], revisions: { 'GB-0001': 1 }, actionId: 'p1', expectedRevision: 0 }), /confirmed/);
  f.confirm();
  f.items[0].revision = 2;
  assert.throws(() => f.api.promote({ ids: ['GB-0001'], revisions: { 'GB-0001': 2 }, actionId: 'p1', expectedRevision: 0 }), /stale/);
  f.confirm();
  const one = f.api.promote({ ids: ['GB-0001'], revisions: { 'GB-0001': 2 }, actionId: 'p1', expectedRevision: 0 });
  assert.throws(() => f.api.promote({ ids: ['GB-0001'], revisions: { 'GB-0001': 2 }, actionId: 'p2', expectedRevision: one.revision }), /already requested/);
});

test('knowledge-only dispositions follow six receipts, require evidence and never create Specs', () => {
  const f = fixture();
  f.confirm();
  let result = f.api.promote({ ids: ['GB-0001'], revisions: { 'GB-0001': 1 }, actionId: 'p1', expectedRevision: 0 });
  const requestId = result.request.id;
  assert.throws(() => f.api.disposition({ requestId, id: 'GB-0001', stage: 'Map', links: ['README.md'], by: 'fixture-agent', actionId: 'skip', expectedRevision: result.revision }), /next stage/);
  for (const [index, stage] of PROMOTION_STAGES.entries()) {
    result = f.api.disposition({ requestId, id: 'GB-0001', stage, links: ['README.md'], evidence: ['README.md'], by: 'fixture-agent', implementationNeeded: false, reason: 'Knowledge-only; durable explanation already has its native home.', actionId: `stage-${index}`, expectedRevision: result.revision });
  }
  const state = f.api.read().dispositions['GB-0001'];
  assert.equal(state.status, 'published');
  assert.equal(state.receipts.length, 6);
  assert.equal(state.implementationNeeded, false);
  assert.equal(fs.existsSync(path.join(f.root, 'workbench/specs')), false);
});

test('stage links must exist in the room and knowledge-only Map needs a reason', () => {
  const f = fixture();
  f.confirm();
  let r = f.api.promote({ ids: ['GB-0001'], revisions: { 'GB-0001': 1 }, actionId: 'p1', expectedRevision: 0 });
  const input = { requestId: r.request.id, id: 'GB-0001', stage: 'Record', links: ['missing.md'], evidence: ['README.md'], by: 'fixture-agent', actionId: 'bad', expectedRevision: r.revision };
  assert.throws(() => f.api.disposition(input), /existing/);
  assert.throws(() => f.api.disposition({ ...input, links: ['../outside.md'] }), /inside/);
  assert.throws(() => f.api.disposition({ ...input, links: ['README.md'], evidence: [] }), /evidence/);
  r = f.api.disposition({ ...input, links: ['README.md'] });
  r = f.api.disposition({ ...input, links: ['README.md'], stage: 'Publish', actionId: 'publish', expectedRevision: r.revision });
  assert.throws(() => f.api.disposition({ ...input, links: ['README.md'], stage: 'Map', actionId: 'map', expectedRevision: r.revision, implementationNeeded: false }), /reason/);
});

test('symlinked owner paths and malformed workflow records fail visibly', () => {
  const f = fixture();
  fs.symlinkSync(os.tmpdir(), path.join(f.root, 'escape'));
  f.confirm();
  const r = f.api.promote({ ids: ['GB-0001'], revisions: { 'GB-0001': 1 }, actionId: 'p1', expectedRevision: 0 });
  assert.throws(() => f.api.disposition({ requestId: r.request.id, id: 'GB-0001', stage: 'Record', links: ['escape'], evidence: ['README.md'], by: 'agent', actionId: 'bad', expectedRevision: r.revision }), /symlink/);
  fs.writeFileSync(path.join(f.root, f.api.read().note), '{}');
  assert.throws(() => f.api.read(), /notepad|invalid/);
});

test('implementation Map and Plan receipts require native Spec and Task links', () => {
  const f = fixture();
  f.confirm();
  let r = f.api.promote({ ids: ['GB-0001'], revisions: { 'GB-0001': 1 }, actionId: 'p1', expectedRevision: 0 });
  const receipt = { requestId: r.request.id, id: 'GB-0001', links: ['README.md'], evidence: ['README.md'], by: 'fixture-agent' };
  r = f.api.disposition({ ...receipt, stage: 'Record', actionId: 'record', expectedRevision: r.revision });
  r = f.api.disposition({ ...receipt, stage: 'Publish', actionId: 'publish-1', expectedRevision: r.revision });
  assert.throws(() => f.api.disposition({ ...receipt, stage: 'Map', implementationNeeded: true, actionId: 'map', expectedRevision: r.revision }), /Spec/);
  fs.mkdirSync(path.join(f.root, 'workbench/specs/S-TEST/TK-TEST'), { recursive: true });
  fs.writeFileSync(path.join(f.root, 'workbench/specs/S-TEST/SPEC.md'), '# Mapped fixture\n');
  fs.writeFileSync(path.join(f.root, 'workbench/specs/S-TEST/TK-TEST/TASK.md'), '# Planned fixture\n');
  r = f.api.disposition({ ...receipt, links: ['workbench/specs/S-TEST/SPEC.md'], stage: 'Map', implementationNeeded: true, actionId: 'map', expectedRevision: r.revision });
  r = f.api.disposition({ ...receipt, stage: 'Publish', actionId: 'publish-2', expectedRevision: r.revision });
  assert.throws(() => f.api.disposition({ ...receipt, stage: 'Plan', actionId: 'plan', expectedRevision: r.revision }), /Task/);
  r = f.api.disposition({ ...receipt, links: ['workbench/specs/S-TEST/TK-TEST/TASK.md'], stage: 'Plan', actionId: 'plan', expectedRevision: r.revision });
  assert.equal(r.disposition.implementationNeeded, true);
});

test('a Change after confirmation blocks promotion until revision and fresh confirmation', () => {
  const f = fixture();
  f.confirm();
  const c = f.api.comment({ id: 'GB-0001', itemRevision: 1, kind: 'change', text: 'Make the context self-contained.', actionId: 'change', expectedRevision: 0 });
  assert.throws(() => f.api.promote({ ids: ['GB-0001'], revisions: { 'GB-0001': 1 }, actionId: 'p1', expectedRevision: c.revision }), /change.*revision/i);
  assert.equal(f.api.read().comments[0].status, 'awaiting revision');
  assert.deepEqual(f.api.read().comments[0].sources, f.items[0].sources);
  f.items[0].revision = 2;
  assert.equal(f.api.read().comments[0].status, 'revised; awaiting confirmation');
  f.confirm();
  const result = f.api.promote({ ids: ['GB-0001'], revisions: { 'GB-0001': 2 }, actionId: 'p1', expectedRevision: c.revision });
  assert.deepEqual(result.request.sourceLinks, f.items[0].sources);
  assert.deepEqual(f.api.read().dispositions['GB-0001'].sourceLinks, f.items[0].sources);
});

test('standalone readers overlay latest native answers without mutating legacy owner input', () => {
  const f = fixture();
  fs.mkdirSync(path.join(f.root, 'workbench/grill-board'), { recursive: true });
  fs.writeFileSync(path.join(f.root, 'workbench/grill-board/items.json'), JSON.stringify({ items: f.items }));
  const legacy = JSON.stringify({ answers: { 'GB-0001': { verdict: 'defer', note: 'Legacy source stays intact.', itemRevision: 1, history: [] } } });
  const legacyFile = path.join(f.root, 'workbench/grill-board/answers.json');
  fs.writeFileSync(legacyFile, legacy);
  const note = 'workbench/sessions/notepads/grilling/dashboard-answers.json';
  const created = createNote(f.root, { note, type: 'grilling', objective: 'dashboard-answers', title: 'Disposable owner answers' });
  assert.equal(created.status, 'created');
  const old = { verdict: 'defer', note: 'Earlier native draft.', itemRevision: 1, history: [] };
  let written = appendEntry(f.root, { note, revision: created.revision, kind: 'source_record', topic: 'dashboard-answer', content: JSON.stringify({ id: 'GB-0001', answer: old }) });
  f.confirm();
  written = appendEntry(f.root, { note, revision: written.revision, kind: 'decision', topic: 'dashboard-answer', content: JSON.stringify({ id: 'GB-0001', answer: { ...f.answers['GB-0001'], history: [old] } }) });
  assert.equal(written.status, 'appended');
  const api = createWorkflow(f.root);
  const promoted = api.promote({ ids: ['GB-0001'], revisions: { 'GB-0001': 1 }, actionId: 'native-promote', expectedRevision: 0 });
  assert.equal(promoted.request.cards[0].draft, f.items[0].draft);
  assert.equal(promoted.request.cards[0].note, 'These exact words');
  assert.equal(fs.readFileSync(legacyFile, 'utf8'), legacy);
});

// ---------------------------------------------------------------------------
// The owner lifecycle through the real board seams (recordAnswer, reviseItem)
// in a disposable native room. Nothing here touches the real board.

const SPEC = 'workbench/specs/S-FIX-fixture/SPEC.md';
const TASK = 'workbench/specs/S-FIX-fixture/tasks/TK-FIX/TASK.md';

function boardRoom() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'dashboard-lifecycle-'));
  fs.mkdirSync(path.join(root, board.BOARD_DIR), { recursive: true });
  fs.writeFileSync(path.join(root, 'workbench/manifest.json'), JSON.stringify({ schemaVersion: 2, lanes: { sessions: 'workbench/sessions', specs: 'workbench/specs' }, collections: { notepads: 'workbench/sessions/notepads', 'notepad-templates': 'workbench/sessions/notepads/templates', handoffs: 'workbench/sessions/handoffs' } }));
  fs.writeFileSync(path.join(root, 'README.md'), '# Durable owner\n');
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  fs.writeFileSync(path.join(root, 'docs/decision.md'), '# Recorded decision\n');
  fs.writeFileSync(board.boardPaths(root).items, JSON.stringify({ schema: board.ITEMS_SCHEMA, title: 'Fixture', groups: [{ id: 'one', title: 'One' }], items: [] }));
  board.addItems(root, [1, 2, 3].map(n => ({ key: `q${n}`, group: 'one', kind: 'confirm-text', title: `Question ${n}`, question: `Approve the wording for owner ${n}?`, current: 'Working material only.', proposal: `Record decision ${n} in docs/decision.md.`, draft: `# Draft ${n}\n\nThe exact proposed words.\n`, sources: [{ label: 'Owner', path: 'README.md', ref: 'fixture' }] })), { by: 'fixture' });
  return { root, flow: () => board.workflow(root) };
}

function writeSpecAndTask(root, status = 'planned') {
  fs.mkdirSync(path.join(root, path.dirname(TASK)), { recursive: true });
  fs.writeFileSync(path.join(root, SPEC), '# S-FIX - Fixture Spec\n');
  fs.writeFileSync(path.join(root, TASK), `# TK-FIX - Fixture Task\n\n**Task ID:** TK-FIX\n**Status:** ${status}\n`);
}

function confirmOnBoard(root, id) {
  const item = board.readItems(root).items.find(candidate => candidate.id === id);
  const previous = board.readAnswers(root).answers[id];
  return board.recordAnswer(root, id, { verdict: 'confirm', note: '', itemRevision: item.revision, expectedAnswerAt: previous?.at ?? null });
}

function receipts(flow, { requestId, id, stages, base, revision }) {
  let result = { revision };
  const seen = [];
  for (const [offset, stage] of stages) {
    result = flow.disposition({ ...base(stage), requestId, id, stage, by: 'fixture-agent', actionId: `${id}-${offset}-${stage}`, expectedRevision: result.revision });
    seen.push(flow.read().cards[id].state);
  }
  return { result, seen };
}

test('lifecycle: Change, revision, exact confirmation, rounds, one and a set promoted, ordered receipts, restart', () => {
  const r = boardRoom();
  const flow = r.flow();
  let state = flow.read();
  assert.equal(state.cards['GB-0001'].state, 'in-grilling');

  const change = flow.comment({ id: 'GB-0001', itemRevision: 1, kind: 'change', text: 'Name the owning file in the draft.', actionId: 'change-1', expectedRevision: state.revision });
  assert.match(change.comment.path, /^workbench\/grill-board\/comments\/[0-9a-f]{64}\.json$/);
  assert.equal(JSON.parse(fs.readFileSync(path.join(r.root, change.comment.path), 'utf8')).text, 'Name the owning file in the draft.');
  state = flow.read();
  assert.equal(state.comments[0].status, 'awaiting revision');
  assert.equal(state.comments[0].recorded, true);
  assert.equal(state.cards['GB-0001'].state, 'in-grilling');

  const revised = board.reviseItem(r.root, 'GB-0001', { draft: '# Draft 1\n\nRecord it in docs/decision.md.\n' }, { by: 'fixture-agent', reason: 'Owner Change', expectedRevision: 1 });
  assert.equal(revised.revision, 2);
  assert.equal(flow.read().comments[0].status, 'revised; awaiting confirmation');
  assert.equal(flow.read().cards['GB-0001'].state, 'in-grilling');

  const answer = confirmOnBoard(r.root, 'GB-0001');
  assert.equal(answer.approval.hash, approvalHash(board.readItems(r.root).items[0]));
  assert.equal(answer.approval.draft, '# Draft 1\n\nRecord it in docs/decision.md.\n');
  state = flow.read();
  assert.equal(state.comments[0].status, 'revised; confirmed');
  assert.equal(state.cards['GB-0001'].state, 'confirmed');
  assert.equal(state.cards['GB-0002'].state, 'in-grilling');

  const round1 = flow.endRound({ actionId: 'round-1', expectedRevision: state.revision });
  assert.deepEqual(round1.round.confirmed, [{ id: 'GB-0001', itemRevision: 2 }]);
  confirmOnBoard(r.root, 'GB-0002');
  confirmOnBoard(r.root, 'GB-0003');
  const round2 = flow.endRound({ actionId: 'round-2', expectedRevision: round1.revision });
  assert.equal(round2.round.number, 2);
  assert.deepEqual(round2.round.confirmed.map(card => card.id), ['GB-0001', 'GB-0002', 'GB-0003']);
  state = flow.read();
  assert.equal(state.rounds.length, 2);
  assert.equal(state.requests.length, 0, 'ending a round starts nothing');
  assert.deepEqual(Object.values(state.cards).map(card => card.state), ['confirmed', 'confirmed', 'confirmed']);

  const one = flow.promote({ ids: ['GB-0001'], revisions: { 'GB-0001': 2 }, actionId: 'promote-one', expectedRevision: round2.revision });
  const set = flow.promote({ ids: ['GB-0002', 'GB-0003'], revisions: { 'GB-0002': 1, 'GB-0003': 1 }, actionId: 'promote-set', expectedRevision: one.revision });
  assert.deepEqual(set.request.cards.map(card => card.id), ['GB-0002', 'GB-0003']);
  state = flow.read();
  assert.deepEqual(Object.values(state.cards).map(card => card.state), ['handoff-requested', 'handoff-requested', 'handoff-requested']);
  assert.equal(state.cards['GB-0001'].requestId, 'promote-one');
  assert.equal(state.cards['GB-0001'].approvalHash, answer.approval.hash);

  // Implementation path for the single card.
  writeSpecAndTask(r.root);
  const implementation = receipts(flow, {
    requestId: 'promote-one', id: 'GB-0001', revision: set.revision, stages: [...PROMOTION_STAGES.entries()],
    base: stage => ({
      links: stage === 'Map' ? [SPEC] : stage === 'Plan' ? [TASK] : stage === 'Publish' ? ['https://github.com/KaydenClark/LLM_Workbench/commit/0123abc'] : ['docs/decision.md'],
      evidence: ['docs/decision.md'],
      ...(stage === 'Map' ? { implementationNeeded: true } : {})
    })
  });
  assert.deepEqual(implementation.seen, ['recorded', 'record-published', 'mapped', 'map-published', 'planned', 'plan-published']);
  const done = flow.read().cards['GB-0001'];
  assert.equal(done.mapping.implementationNeeded, true);
  assert.deepEqual(done.mapping.specs, [SPEC]);
  assert.deepEqual(done.plan.tasks, [TASK]);
  assert.equal(flow.read().dispositions['GB-0001'].status, 'published');

  // Knowledge-only path for one card of the set: no Spec or Task links.
  const knowledge = receipts(flow, {
    requestId: 'promote-set', id: 'GB-0002', revision: implementation.result.revision, stages: [...PROMOTION_STAGES.entries()],
    base: stage => ({
      ...(['Map', 'Plan'].includes(stage) ? { implementationNeeded: false, reason: 'Knowledge-only: the decision record is the whole outcome.' } : { links: ['docs/decision.md'] }),
      evidence: ['docs/decision.md']
    })
  });
  assert.deepEqual(knowledge.seen, ['recorded', 'record-published', 'mapped', 'map-published', 'planned', 'plan-published']);
  const knowledgeCard = flow.read().cards['GB-0002'];
  assert.equal(knowledgeCard.mapping.implementationNeeded, false);
  assert.deepEqual(knowledgeCard.mapping.specs, []);
  assert.match(knowledgeCard.mapping.reason, /Knowledge-only/);
  assert.deepEqual(knowledgeCard.plan.tasks, []);
  assert.match(knowledgeCard.label, /no Spec or Task/);
  assert.equal(flow.read().cards['GB-0003'].state, 'handoff-requested');

  // Restart: a fresh workflow over the same room reconstructs identical state.
  const before = flow.read();
  assert.deepEqual(board.workflow(r.root).read(), before);
  assert.deepEqual(createWorkflow(r.root).read(), before);
});

test('implemented is a distinct state recorded only from a done Task linked at Plan', () => {
  const r = boardRoom();
  const flow = r.flow();
  confirmOnBoard(r.root, 'GB-0001');
  confirmOnBoard(r.root, 'GB-0002');
  writeSpecAndTask(r.root, 'done');
  let result = flow.promote({ ids: ['GB-0001', 'GB-0002'], revisions: { 'GB-0001': 1, 'GB-0002': 1 }, actionId: 'p', expectedRevision: 0 });
  assert.equal(flow.read().cards['GB-0001'].state, 'handoff-requested', 'a request never implies implementation, even when a done Task exists');
  const implementation = receipts(flow, { requestId: 'p', id: 'GB-0001', revision: result.revision, stages: [...PROMOTION_STAGES.entries()], base: stage => ({ links: stage === 'Map' ? [SPEC] : stage === 'Plan' ? [TASK] : ['docs/decision.md'], evidence: ['docs/decision.md'], ...(stage === 'Map' ? { implementationNeeded: true } : {}) }) });
  result = implementation.result;
  fs.writeFileSync(path.join(r.root, TASK), '# TK-FIX\n\n**Status:** in-progress\n');
  const input = { requestId: 'p', id: 'GB-0001', stage: 'Implemented', links: [TASK], evidence: ['docs/decision.md'], by: 'fixture-agent', actionId: 'implemented', expectedRevision: result.revision };
  assert.throws(() => flow.disposition(input), /done/);
  assert.throws(() => flow.disposition({ ...input, links: ['README.md'] }), /Task/);
  fs.writeFileSync(path.join(r.root, TASK), '# TK-FIX\n\n**Status:** done\n');
  result = flow.disposition(input);
  assert.equal(result.disposition.status, 'implemented');
  const card = flow.read().cards['GB-0001'];
  assert.equal(card.state, 'implemented');
  assert.deepEqual(card.implementation.tasks, [TASK]);
  assert.throws(() => flow.disposition({ ...input, actionId: 'again', expectedRevision: result.revision }), /next stage/);

  const knowledge = receipts(flow, { requestId: 'p', id: 'GB-0002', revision: result.revision, stages: [...PROMOTION_STAGES.entries()], base: stage => ({ ...(['Map', 'Plan'].includes(stage) ? { implementationNeeded: false, reason: 'Knowledge-only.' } : { links: ['docs/decision.md'] }), evidence: ['docs/decision.md'] }) });
  assert.throws(() => flow.disposition({ ...input, id: 'GB-0002', actionId: 'knowledge-implemented', expectedRevision: knowledge.result.revision }), /knowledge-only/i);
});

test('implementation Plan must name a Task inside the mapped Spec', () => {
  const r = boardRoom();
  const flow = r.flow();
  confirmOnBoard(r.root, 'GB-0001');
  writeSpecAndTask(r.root);
  const other = 'workbench/specs/S-OTHER/tasks/TK-OTHER/TASK.md';
  fs.mkdirSync(path.join(r.root, path.dirname(other)), { recursive: true });
  fs.writeFileSync(path.join(r.root, other), '# Other\n\n**Status:** planned\n');
  let result = flow.promote({ ids: ['GB-0001'], revisions: { 'GB-0001': 1 }, actionId: 'p', expectedRevision: 0 });
  const stages = [...PROMOTION_STAGES.entries()].slice(0, 4);
  result = receipts(flow, { requestId: 'p', id: 'GB-0001', revision: result.revision, stages, base: stage => ({ links: stage === 'Map' ? [SPEC] : ['docs/decision.md'], evidence: ['docs/decision.md'], ...(stage === 'Map' ? { implementationNeeded: true } : {}) }) }).result;
  assert.throws(() => flow.disposition({ requestId: 'p', id: 'GB-0001', stage: 'Plan', links: [other], evidence: ['docs/decision.md'], by: 'a', actionId: 'plan', expectedRevision: result.revision }), /mapped Spec/);
  assert.equal(flow.disposition({ requestId: 'p', id: 'GB-0001', stage: 'Plan', links: [TASK], evidence: ['docs/decision.md'], by: 'a', actionId: 'plan', expectedRevision: result.revision }).disposition.stage, 'Plan');
});

test('board working files are not durable evidence', () => {
  const r = boardRoom();
  const flow = r.flow();
  confirmOnBoard(r.root, 'GB-0001');
  const c = flow.comment({ id: 'GB-0001', itemRevision: 1, text: 'A plain comment.', actionId: 'c1', expectedRevision: 0 });
  fs.writeFileSync(board.boardPaths(r.root).answers, JSON.stringify({ schema: board.ANSWERS_SCHEMA, answers: {} }));
  const p = flow.promote({ ids: ['GB-0001'], revisions: { 'GB-0001': 1 }, actionId: 'p', expectedRevision: c.revision });
  const input = { requestId: 'p', id: 'GB-0001', stage: 'Record', links: ['docs/decision.md'], by: 'a', actionId: 'r', expectedRevision: p.revision };
  assert.throws(() => flow.disposition({ ...input, evidence: [c.comment.path] }), /not durable/);
  assert.throws(() => flow.disposition({ ...input, evidence: ['workbench/grill-board/answers.json'] }), /not durable/);
  assert.throws(() => flow.disposition({ ...input, evidence: ['workbench/sessions/notepads/grilling/dashboard-answers.json'] }), /notepad/);
});

test('disposition actions are idempotent and refuse a reused action ID with different input', () => {
  const r = boardRoom();
  const flow = r.flow();
  confirmOnBoard(r.root, 'GB-0001');
  const p = flow.promote({ ids: ['GB-0001'], revisions: { 'GB-0001': 1 }, actionId: 'p', expectedRevision: 0 });
  const input = { requestId: 'p', id: 'GB-0001', stage: 'Record', links: ['docs/decision.md'], evidence: ['docs/decision.md'], by: 'a', actionId: 'r', expectedRevision: p.revision };
  const first = flow.disposition(input);
  const again = flow.disposition(input);
  assert.equal(again.idempotent, true);
  assert.deepEqual(again.disposition, first.disposition);
  assert.equal(flow.read().dispositions['GB-0001'].receipts.length, 1);
  assert.throws(() => flow.disposition({ ...input, links: ['README.md'] }), /action-id-conflict/);
  assert.throws(() => flow.disposition({ ...input, stage: 'Publish', actionId: 'pub', expectedRevision: p.revision }), /stale-revision/);
});

test('rounds record only currently confirmed cards: a pending Change or a changed draft is not confirmed', () => {
  const r = boardRoom();
  const flow = r.flow();
  for (const id of ['GB-0001', 'GB-0002', 'GB-0003']) confirmOnBoard(r.root, id);
  const c = flow.comment({ id: 'GB-0001', itemRevision: 1, kind: 'change', text: 'Not yet.', actionId: 'change', expectedRevision: 0 });
  const items = JSON.parse(fs.readFileSync(board.boardPaths(r.root).items, 'utf8'));
  items.items[1].draft = 'Edited in place without a revision.';
  fs.writeFileSync(board.boardPaths(r.root).items, JSON.stringify(items));
  const round = flow.endRound({ actionId: 'round', expectedRevision: c.revision });
  assert.deepEqual(round.round.confirmed, [{ id: 'GB-0003', itemRevision: 1 }]);
  const state = flow.read();
  assert.equal(state.cards['GB-0001'].state, 'in-grilling');
  assert.equal(state.cards['GB-0002'].state, 'in-grilling');
  assert.equal(state.cards['GB-0003'].state, 'confirmed');
  assert.equal(state.requests.length, 0);
  assert.throws(() => flow.promote({ ids: ['GB-0002'], revisions: { 'GB-0002': 1 }, actionId: 'p', expectedRevision: round.revision }), /stale-approval/);
});

test('an interrupted comment write is surfaced honestly and completed by resending the same action', () => {
  // Produce the exact bytes a writer leaves when it stops between the comment
  // file and the notepad entry: write in one room, carry only the file over.
  const crashed = boardRoom();
  const input = { id: 'GB-0001', itemRevision: 1, kind: 'change', text: 'Show the owner file.', actionId: 'interrupted', expectedRevision: 0 };
  const written = crashed.flow().comment(input);
  const r = boardRoom();
  fs.mkdirSync(path.join(r.root, 'workbench/grill-board/comments'), { recursive: true });
  fs.copyFileSync(path.join(crashed.root, written.comment.path), path.join(r.root, written.comment.path));
  const flow = r.flow();

  let state = flow.read();
  assert.equal(state.revision, 0);
  assert.equal(state.comments.length, 1);
  assert.equal(state.comments[0].recorded, false);
  assert.match(state.comments[0].recovery, /same action/);
  assert.deepEqual(state.interrupted, ['interrupted']);

  assert.throws(() => flow.comment({ ...input, text: 'Different words.' }), /action-id-conflict/);
  assert.throws(() => flow.comment({ ...input, expectedRevision: 5 }), /stale-revision/);
  assert.equal(fs.existsSync(path.join(r.root, written.comment.path)), true, 'a refused recovery never removes the saved comment');

  board.reviseItem(r.root, 'GB-0001', { draft: 'Moved on.' }, { by: 'agent', reason: 'Later revision', expectedRevision: 1 });
  const recovered = flow.comment(input);
  assert.deepEqual(recovered.comment, written.comment);
  assert.equal(recovered.recovered, true);
  state = flow.read();
  assert.equal(state.comments[0].recorded, true);
  assert.deepEqual(state.interrupted, []);
  assert.equal(state.actions.length, 1);
  assert.equal(flow.comment(input).idempotent, true);
  assert.deepEqual(fs.readdirSync(path.join(r.root, 'workbench/grill-board/comments')), [path.basename(written.comment.path)], 'no temporary files remain');
});

test('a refused comment write leaves no file behind', () => {
  const r = boardRoom();
  const flow = r.flow();
  const first = flow.comment({ id: 'GB-0001', itemRevision: 1, text: 'One.', actionId: 'one', expectedRevision: 0 });
  // A concurrent writer that read revision 0 loses at the notepad check.
  const late = createWorkflow(r.root, { readItems: board.readItems, readAnswers: board.readAnswers });
  assert.throws(() => late.comment({ id: 'GB-0002', itemRevision: 1, text: 'Two.', actionId: 'two', expectedRevision: 0 }), /stale-revision/);
  assert.deepEqual(fs.readdirSync(path.join(r.root, 'workbench/grill-board/comments')), [path.basename(first.comment.path)]);
});

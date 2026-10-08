#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { approvalSnapshot, createWorkflow, PROMOTION_STAGES } from './dashboard-workflow.mjs';
import { appendEntry, createNote } from '../workbench/tools/notepads.mjs';

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

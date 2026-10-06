#!/usr/bin/env node
// S-003Z TK-008G: the Task record seam for a Task directly under a landmark.
// A `TASK.md` names exactly one parent: `**Spec ID:**` for a Task under a Spec
// or `**Landmark ID:**` for a Task directly under a landmark (ADR-000U). Its
// Blockers stay a closed list of identifiers, which now also names landmarks.
// tools/test-spec-workbench.mjs imports this file, so the Runbook suite runs it.
import assert from 'node:assert/strict';
import { formatTaskRecord, parseTaskRecord, withClaimant } from '../workbench/tools/task-record.mjs';

function record({ parent = '**Landmark ID:** LMK-0AA', blockers = 'none', extra = '' } = {}) {
  return [
    '# TK-000A - Advance the direction',
    '',
    '**Task ID:** TK-000A',
    parent,
    '**Slice:** Advance the direction',
    '**Status:** ready',
    `**Blockers:** ${blockers}`,
    '**Destination:** spec-acceptance: LMK-0AA What Success Looks Like',
    extra,
    ''
  ].join('\n');
}

{
  const parsed = parseTaskRecord(record());
  assert.equal(parsed.id, 'TK-000A');
  assert.equal(parsed.landmarkId, 'LMK-0AA', 'a landmark-direct Task names its landmark');
  assert.equal(parsed.specId, null, 'a landmark-direct Task names no Spec');

  const underSpec = parseTaskRecord(record({ parent: '**Spec ID:** S-0AA' }));
  assert.equal(underSpec.specId, 'S-0AA');
  assert.equal(underSpec.landmarkId, null, 'a Task under a Spec names no landmark');

  assert.throws(() => parseTaskRecord(record({ parent: '**Spec ID:** S-0AA\n**Landmark ID:** LMK-0AA' })), /exactly one of Spec ID or Landmark ID/,
    'a Task naming both parents is refused');
  assert.throws(() => parseTaskRecord(record({ parent: '**Stance:** Builder' })), /missing Spec ID or Landmark ID/,
    'a Task naming no parent is refused');
  assert.throws(() => parseTaskRecord(record({ parent: '**Landmark ID:** LMK-1' })), /invalid Landmark ID/,
    'a malformed landmark identity is refused');
  assert.throws(() => parseTaskRecord(record({ parent: '**Landmark ID:** S-0AA' })), /invalid Landmark ID/,
    'a Spec identity in the Landmark ID field is refused');
  console.log('ok - a Task record names exactly one parent: a Spec ID or a Landmark ID');
}

{
  const blocked = parseTaskRecord(record({ blockers: 'LMK-0AB, S-0AA, TK-000B' }));
  assert.deepEqual(blocked.blockers, ['LMK-0AB', 'S-0AA', 'TK-000B'], 'Blockers hold S-, TK- and LMK- identifiers');
  assert.throws(() => parseTaskRecord(record({ blockers: 'waiting on the owner' })), /invalid blocker id: waiting on the owner/,
    'prose in Blockers is refused');
  assert.throws(() => parseTaskRecord(record({ blockers: 'DQC-006P' })), /invalid blocker id: DQC-006P/,
    'another artifact prefix in Blockers is refused');
  console.log('ok - a Task\'s Blockers hold only S-, TK- and LMK- identifiers (or the existing owner decision grammar)');
}

{
  const bytes = formatTaskRecord({ id: 'TK-000A', landmarkId: 'LMK-0AA', slice: 'Advance the direction', status: 'ready', blockers: 'none', destination: 'spec-acceptance: LMK-0AA What Success Looks Like' });
  assert.match(bytes, /^\*\*Landmark ID:\*\* LMK-0AA$/m);
  assert.doesNotMatch(bytes, /Spec ID/);
  assert.equal(parseTaskRecord(bytes).landmarkId, 'LMK-0AA', 'the writer and the reader agree on a landmark-direct record');
  assert.throws(() => formatTaskRecord({ id: 'TK-000A', specId: 'S-0AA', landmarkId: 'LMK-0AA', slice: 'x', status: 'ready', blockers: 'none', destination: 'spec-acceptance: x' }), /exactly one/);
  console.log('ok - formatTaskRecord writes a landmark-direct record the reader accepts');
}

// S-003Z TK-008H run 2: `claim` persists every claimant on the Task record
// itself in one optional `**Claimed by:**` field, accumulated across runs, so
// the fact survives `close` overwriting the parent's Latest event, a re-claim,
// a retirement and a move. A record without the field reads as claimed by
// nobody; the writer and the reader agree on it.
{
  assert.deepEqual(parseTaskRecord(record()).claimedBy, [], 'a record with no Claimed by field names no claimant');
  const claimed = parseTaskRecord(record({ extra: '**Claimed by:** worker-a, rev2' }));
  assert.deepEqual(claimed.claimedBy, ['worker-a', 'rev2'], 'Claimed by reads as the ordered list of claimants');
  assert.throws(() => parseTaskRecord(record({ extra: '**Claimed by:** worker-a, , rev2' })), /TK-000A has an empty entry in Claimed by/,
    'an empty claimant entry is refused');
  assert.equal(withClaimant([], 'worker-a'), 'worker-a', 'the first claim starts the list');
  assert.equal(withClaimant(['worker-a'], 'rev2'), 'worker-a, rev2', 'a later claim appends its claimant');
  assert.equal(withClaimant(['worker-a', 'rev2'], 'worker-a'), 'worker-a, rev2', 'a returning claimant is recorded once');
  assert.throws(() => withClaimant([], 'worker, a'), /--agent "worker, a" contains a comma/, 'a claimant the list cannot hold is refused');
  assert.throws(() => withClaimant([], 'worker\na'), /--agent .* contains a line break/, 'a multi-line claimant is refused');
  const bytes = formatTaskRecord({ id: 'TK-000A', landmarkId: 'LMK-0AA', slice: 'Advance the direction', status: 'done', blockers: 'none', destination: 'spec-acceptance: LMK-0AA What Success Looks Like', claimedBy: ['worker-a', 'rev2'], proof: 'fixture proof' });
  assert.match(bytes, /^\*\*Claimed by:\*\* worker-a, rev2$/m);
  assert.deepEqual(parseTaskRecord(bytes).claimedBy, ['worker-a', 'rev2'], 'formatTaskRecord and parseTaskRecord round-trip the claimants');
  assert.doesNotMatch(formatTaskRecord({ id: 'TK-000A', landmarkId: 'LMK-0AA', slice: 'x', status: 'ready', blockers: 'none', destination: 'spec-acceptance: x' }), /Claimed by/,
    'an unclaimed record is written without the field');
  console.log('ok - a Task record carries its accumulated claimants in an optional Claimed by field');
}

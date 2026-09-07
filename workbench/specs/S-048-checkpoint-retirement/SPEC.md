# S-048 - Checkpoint Retirement

**Spec ID:** S-048
**Status:** planned
**Priority:** 2
**Owner:** codex
**Stance:** Reconciler
**Updated:** 2026-09-06
**Catalog description:** Explain the checkpoint rationale, preserve still-needed material, and retire the obsolete collection and dependencies deliberately.
**Blockers:** none
**Latest event:** Owner-requested follow-on separated from the notepad foundation.
**Next gate:** Inventory rationale, artifacts, and consumers before proposing any deletion.

## Outcome

The Workbench can retire checkpoints without losing meaningful information,
breaking durable citations, or claiming an unimplemented save skill replaces
them. The owner can later examine why they were introduced through a focused
historical grilling session.

## Why It Matters

The owner explicitly requested a separate spec to determine why checkpoints
exist, reconcile their material, and retire the obsolete capability. Continuing
to ask about checkpoint scheduling as a foundation prerequisite ignores that
decision. Immediate deletion would ignore preservation and reference integrity.

## Current Verified State

At `8e9c06f6f98825925e7da6cce59fb68768b589d7`, the manifest declares checkpoints;
`workbench/tools/sessions.mjs` writes promoted copies; `skills/checkpoint/`,
`skills/make-it-so/`, AGENTS, RUNBOOK, ADR-0028, and mechanical S-026 tests
reference them. Historical specs and evidence also cite promoted records.
The source grilling note reports an installed save skill using an older local
Intent lane; that report is not current verification of a replacement.

## Desired Behavior

1. Inventory original rationale using ADR-0028, completed S-026/S-023, relevant
   history and tests. Separate intended guarantees from actual mechanical proof.
2. Enumerate artifacts and inbound references. Give still-important claims a
   durable owner; preserve provenance and append-only evidence. Classify obsolete,
   duplicate, unresolved, and still-needed material without automatic mass deletion.
3. Demonstrate a continuation path that does not require new checkpoints, then
   retire obsolete tooling, skill policy, collection rules, and active consumers.
4. Preserve stable historical references by an explicit compatible disposition.
   If literal folder removal would break published references, present the
   concrete tradeoff before choosing between migration and a historical remnant.
5. Verify the actual save/shared-notepad capability before attributing replacement
   behavior to it. Retain a concise durable rationale account for the later grill.

## Decisions And Contracts

S-046's promotion record captures Q18 and the owner's final answer assigning
this follow-on. Retirement direction is accepted; blanket destruction of source
material is not. Foundation progress does not depend on completing this spec.
The existing checkpoint mechanism stays available for legacy records until its
dependencies have a verified disposition. New notepad claims may be promoted
directly into their proper durable owners under current authorization.

## Non-Goals

Deleting checkpoint records in the scoping assignment, rewriting published
evidence rows, inventing the historical rationale, or extending Git to live notes.

## Dependencies And Blockers

Inventory can proceed independently. Removal depends on a verified replacement
continuation path and preservation of every still-needed claim/reference.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Trace one checkpoint from original rationale through inbound references and reconcile it to a proposed disposition with a checkable continuation example | ready | none | pending |

### TK-001 - Evidence to disposition

**Stance:** Reconciler

Read relevant history and consumers, show one representative checkpoint's
complete dependency path, preserve its needed claims, and demonstrate how a
fresh agent would continue. Return a reviewed disposition before widening
removal. This is a read/reconcile slice, not an automatic deletion command.

## Acceptance Criteria

- [ ] Original rationale and limits of the historical proof are documented from evidence.
- [ ] Every checkpoint and active dependency has an explicit, preservation-safe disposition.
- [ ] Remaining work and historical references survive retirement.
- [ ] Obsolete collection/tool/skill/test dependencies are removed or explicitly retained for a documented compatibility reason.
- [ ] Actual replacement behavior, full suite, docs, and independent integration review are verified.

## Testing Seams

Inbound reference inventory, live-note to durable-owner continuation, migration
with unfinished material, historical citation read-back, and existing session,
adoption, upgrade, layout, privacy, and round-trip tests.

## Verification Procedure

Inventory before mutation. Use red/green tests for changed runtime behavior,
full AGENTS suite, render/doctor, privacy/reference checks, guardrail comparison,
and independent review of the exact removal candidate.

## Documentation Impact

AGENTS/RUNBOOK/LEXICON, ADR-0028 supersession rationale, manifests, skill policy,
generic templates, current consumers, and this spec's disposition record.
Historical evidence rows remain append-only.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-06 | spec | Separate retirement assignment captured | Source Q18 and final owner answer reconciled in S-046; current checkpoint consumers inspected at 8e9c06f | This spec; Contract transition states that legacy checkpoints remain | Full inventory, rationale investigation, disposition, and retirement |

## Completion Result

Pending. No checkpoint has been removed by this assignment.

## Remaining Limitations Or Follow-Up Specs

The historical grilling record retains the displaced checkpoint-trigger and
lineage questions for context; they are not accepted requirements for a new
checkpoint system. S-046 owns the JSON foundation.

## Supersession

- Supersedes: none; completed S-026 evidence remains historical.
- Superseded by: none.

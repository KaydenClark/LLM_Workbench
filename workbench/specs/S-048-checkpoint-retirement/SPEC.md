# S-048 - Checkpoint Retirement

**Spec ID:** S-048
**Status:** active
**Priority:** 2
**Owner:** codex
**Stance:** Reconciler
**Updated:** 2026-09-08
**Catalog description:** Explain the checkpoint rationale, preserve still-needed material, and retire the obsolete collection and dependencies deliberately.
**Blockers:** none
**Latest event:** TK-002 claimed by codex.
**Next gate:** Close TK-002 with verification and documentation proof.

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
| TK-001 | Trace one checkpoint from original rationale through inbound references and reconcile it to a proposed disposition with a checkable continuation example | done | none | d607b29c1bb9e26430b7008920b586146a87f601:full36-command union PASS; complete6-file inventory hashes and518 keyword/104 explicit coordinates independently reproduced at16988da; bounded disposition review PASS; copied reviewed artifacts byte-identical and privacy clean; S046 actual bounded continuity result retained |
| TK-002 | Promote selected safe material directly into its durable owner with verified read-back before source cleanup | in-progress | TK-001 | pending |
| TK-003 | Freeze checkpoint history and migrate active recovery consumers without breaking rollback | ready | TK-002 | pending |

### TK-001 - Evidence to disposition

**Stance:** Reconciler

Read relevant history and consumers, show one representative checkpoint's
complete dependency path, preserve its needed claims, and demonstrate how a
fresh agent would continue. Return a reviewed disposition before widening
removal. This is a read/reconcile slice, not an automatic deletion command.

### v3.2.0 direct promotion decision (2026-09-08)

**Stance:** Reconciler

The current owner request accepts CAND-Q and assigns completion through
[S-050](../S-050-workbench-v3-2-0-release/SPEC.md). Freeze existing checkpoint
contents and citations as retained history; create no new promoted checkpoints
after migration. The durability crossing is selected-claim reconciliation into
a named ADR/spec/Wiki/control owner, never committing a raw note or handoff.
TK-001 inventories all checkpoint files/citations and sessions, adoption, upgrade,
rollback, manifest and skill consumers. The accepted disposition is a frozen
historical remnant; no deletion decision remains to be re-asked.
TK-002 provides a privacy/validity-checked direct promotion seam with explicit
selected material and destination, expected destination revision, safe write,
and read-back of the resulting bytes. Agent judgment verifies authorization,
semantic fidelity and owner selection; the tool cannot certify those judgments.
Failure must preserve source and destination; cleanup remains a separate
operation requiring verified reconciliation and preserved remaining dependencies.
TK-003 declares operational recovery separately from session history, preserves
existing backup/rollback references and restores a changed target in a real
adoption/upgrade rehearsal. Retire active checkpoint CLI/skill dependencies,
update all current consumers and tests, retain historical evidence unchanged.
New core save/promote composition is S-051; the base must not depend on personal
skills. Red/green privacy, path escape, stale destination, write/read-back
failure, retained-source and legacy rollback cases; full suite and review.

## TK-001 Preservation Account

The [disposition](checkpoint-disposition.md) explains original rationale, the
representative dependency trace and the continuation route. Its complete
[inventory](checkpoint-inventory.json) pins six retained files (five records
plus `.gitkeep`), 104 explicit references and 518 keyword coordinates across
104 files to `16988da94dac455355aecf3c6f9d80b933b03574`. Existing files and
citations remain unchanged; tentative, corrected and adverse history is retained.
Independent review reproduced the complete coordinate set and all hashes and
passed the bounded disposition. Both artifacts pass the shared privacy scan.
S-046 supplies an actual bounded same-provider fresh-context continuation;
TK-002/TK-003 still own direct promotion and operational rollback replacement.
No migration, deletion, cross-host or release claim follows from this inventory.

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
| 2026-09-08 | TK-001 | Ticket closed | d607b29c1bb9e26430b7008920b586146a87f601:full36-command union PASS; complete6-file inventory hashes and518 keyword/104 explicit coordinates independently reproduced at16988da; bounded disposition review PASS; copied reviewed artifacts byte-identical and privacy clean; S046 actual bounded continuity result retained | S048 disposition and complete pinned inventory linked from its stable spec; repository-specific history needs no generic template copy | TK002 direct promotion and TK003 operational recovery/rollback migration; no deletion or release readiness claim |

## Completion Result

Pending. No checkpoint has been removed by this assignment.

## Remaining Limitations Or Follow-Up Specs

The historical grilling record retains the displaced checkpoint-trigger and
lineage questions for context; they are not accepted requirements for a new
checkpoint system. S-046 owns the JSON foundation.

## Supersession

- Supersedes: none; completed S-026 evidence remains historical.
- Superseded by: none.

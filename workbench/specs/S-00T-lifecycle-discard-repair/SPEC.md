# S-00T - Lifecycle Discard And Identity Repair

**Spec ID:** S-00T
**Status:** active
**Priority:** 1
**Owner:** codex-lifecycle
**Stance:** Builder
**Updated:** 2026-09-19
**Catalog description:** Repair audited retirement identity, discard recovery, Wiki attribution, final Task persistence and corrective allocation defects before legacy migration.
**Blockers:** none; explicit owner repair assignment precedes migration gates.
**Latest event:** TK-0T0 claimed by codex-lifecycle.
**Next gate:** Close TK-0T0 with verification and documentation proof.

> **Citation anchors.** pre=`f9f77a8c6318231acc54941643f95750f44ef20d` post=`f9f77a8c6318231acc54941643f95750f44ef20d`.

## Outcome

A successful discard preserves complete recoverability, current Wiki references and record-backed Task interpretation. IDs are not reused across lifecycle or visible remote records.

## Why It Matters

The S-00I audit found obsolete incarnation recovery, a broken durable-owner citation after discard, and final-Task deletion failing after mutation. S-00Q TK-0Q1 already names these repair prerequisites; this Spec delivers that prerequisite once, without activating migration.

## Current Verified State

The pre candidate selects the first added incarnation, prints recovery for only SPEC.md, excludes the Wiki owner from scanning, and lets an empty tasks directory disappear. Corrective orphan creation has no duplicate guard. The allocator reads only active records.

## Desired Behavior

Resolve the latest incarnation and require its complete current directory content on the declared default branch. Print an exercised directory recovery command. Convert only historical Wiki evidence citations to immutable Git identity; current operational references still refuse discard. Preserve empty record-backed Tasks across fresh clones. Repeated orphan findings do not duplicate Tasks. Visible active, retired, corrective, discarded and remote IDs remain reserved.

## Decisions And Contracts

- This implements [S-00Q TK-0Q1](../S-00Q-legacy-completed-record-migration/tasks/TK-0Q1/TASK.md); Q migration/legacy-QA/main-promotion gates remain unchanged.
- Repair the existing seams; do not retire or discard real records, approve legacy QA, or change release state.
- Approval content binding/order belongs to S-00U in the coordinating lane.
- Preserve append-only evidence and archive permanently.

## Non-Goals

Real migration, retirement, discard, release, owner approval, broad controls rewrite, and completed I/J evidence rewriting.

## Dependencies And Blockers

No runtime dependency blocks fixture repair. Integration requires separate-context review; full approval-to-retirement proof combines with S-00U.

## Vertical Implementation Slices

| Task | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-0T0 | Repair discard and identity safety seams | in-progress | none | pending |

## Acceptance Criteria

- [ ] Remove/re-add and post-retirement edits cannot bypass current-content containment; printed recovery restores the whole current directory.
- [ ] Successful discard leaves no broken Wiki citation; operational references refuse before mutation.
- [ ] Final Task discard stays record-backed in the current checkout and a fresh clone; render/staging failures are visible.
- [ ] Allocation reserves lifecycle, corrective, discarded and remote-visible identities; repeated corrective calls refuse duplicates.
- [ ] Focused red/green, full suite, manual self-drift check and independent candidate review are recorded.

## Testing Seams

Existing exported spec-workbench and spec-report operations exercised by tools/test-spec-workbench.mjs in disposable Git fixtures.

## Verification Procedure

Confirm failing regressions before code edits, run focused suite then every AGENTS command. Guardrail baseline is 78/100; remaining deficit is repeated controlled outcome evidence, not tested by this repair.

## Documentation Impact

This Spec owns repair proof and Q links to it. Runtime procedure documentation will describe immutable directory recovery. No generic control rule changes are needed for repair of existing contract.

## Append-Only Evidence And Execution Log

| Date | Commit | Claim | Method | Result |
|---|---|---|---|---|
| 2026-09-19 | f9f77a8c6318231acc54941643f95750f44ef20d | Repair baseline | Read audit findings and source seams; guardrail audit | 78/100; no real record mutation; S-00T/TK-0T0 absent across 139 visible refs |

## Completion Result

Not started.

## Remaining Limitations Or Follow-Up Specs

Owner Human QA, main promotion, Q migration and release are separate gates. Static checks do not prove agent reliability.

## Supersession

None.

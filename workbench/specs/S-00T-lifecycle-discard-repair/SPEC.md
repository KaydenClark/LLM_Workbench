# S-00T - Lifecycle Discard And Identity Repair

**Spec ID:** S-00T
**Status:** active
**Priority:** 1
**Owner:** codex-lifecycle
**Stance:** Builder
**Updated:** 2026-09-19
**Catalog description:** Repair audited retirement identity, discard recovery, Wiki attribution, final Task persistence and corrective allocation defects before legacy migration.
**Blockers:** none; explicit owner repair assignment precedes migration gates.
**Latest event:** Final review reproduced hidden corrective work under retired Specs; focused repair and unchanged-criteria history-check acceleration are underway.
**Next gate:** Coordinator verifies the final immutable assembly and obtains separate-context review before closeout.

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
- Approval content binding/order belongs to [S-00U](../S-00U-approval-binding-and-lifecycle-digest/SPEC.md) in the coordinating lane.
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

- [x] Remove/re-add and post-retirement edits cannot bypass current-content containment; printed recovery restores the whole current directory.
- [x] Successful discard leaves no broken Wiki citation; operational references refuse before mutation.
- [x] Final Task discard stays record-backed in the current checkout and a fresh clone; render/staging failures are visible.
- [x] Allocation reserves lifecycle, corrective, discarded and remote-visible identities; repeated corrective calls refuse duplicates.
- [ ] A new corrective Task under an already-retired Spec is visible, selectable, claimable and closable without reopening or moving the historical Spec.
- [ ] Focused red/green, full suite, manual self-drift check and independent candidate review are recorded.

## Testing Seams

Existing exported spec-workbench and spec-report operations exercised by tools/test-spec-workbench.mjs in disposable Git fixtures.

## Verification Procedure

The history checker may batch Git object reads to avoid tens of thousands of
subprocesses per case. The commit list/order, first-published row rules, retired
coverage, diagnostics and all existing corruption cases must remain unchanged;
compare old/new full output at the same immutable baseline. This is verification
performance work, never permission to skip history or weaken criteria.

Confirm failing regressions before code edits, run focused suite then every AGENTS command. Guardrail baseline is 78/100; remaining deficit is repeated controlled outcome evidence, not tested by this repair.

## Documentation Impact

This Spec owns repair proof and Q links to it. RUNBOOK lifecycle procedure describes immutable directory recovery, historical
citation conversion, final-Task persistence and failure handling. Generic templates
do not expose this detailed procedure yet; S-00P owns that broader mirror rewrite. No generic control rule changes are needed for repair of existing contract.

## Append-Only Evidence And Execution Log

| Date | Commit | Claim | Method | Result |
|---|---|---|---|---|
| 2026-09-19 | f9f77a8c6318231acc54941643f95750f44ef20d | Repair baseline | Read audit findings and source seams; guardrail audit | 78/100; no real record mutation; S-00T/TK-0T0 absent across 139 visible refs |

| 2026-09-19 | 9611b59 | Audited lifecycle defects repaired in disposable fixtures | Red on f9f77a8: new recovery assertion fails because only SPEC.md is recovered. Green: full tools/test-spec-workbench.mjs exits 0 at 9611b59 after independent regression cases for remove/re-add, newer sibling proof, full-directory recovery, missing owner no-write refusal, operational Wiki links, clean citation conversion, final-Task fresh-clone persistence, render preflight, identity reservations, duplicate corrective refusal and frontmatter provenance | Required suite run completed 40 commands (39 pass, initial S806 fixture failure then repaired8035b41 and whole targeted suite rerun green); append-only remained running and was stopped by coordinator instruction for one final immutable assembled run. Separate path-safety grader passed, template evaluation106.6/113, doctor48 nonblocking findings/no blocking findings. Full immutable assembled suite and separate-context review remain open |
| 2026-09-19 | 9611b59 | Guardrail and bounded manual self-drift check | audit-guardrails before/after; inspect Q/T current fields, blockers, source/testing ownership and generated projections | 78/100 unchanged; missing repeated real outcome trials, controls/prior/candidate comparison, recent evidence and uncertainty estimates remain. No agent-outcome claim. Q permits one article per source Spec before lifecycle gates, preserves concrete retirement/default-branch gates, and routes runtime repair once to T. Known room provenance/skill attention remains visible |

| 2026-09-19 | 85ca7e9 | Independent review found a further retired-corrective visibility defect | Existing S-591 fixture creates a Task under a retired Spec, but fresh next returns null, board omits it and claim reports unknown Spec; strengthened fixture fails at expected Task identity | Corrective selection/claim/close/board repair is now part of this existing lifecycle safety slice; whole S-00J retired-folder acceptance remains open until continuous proof |

## Completion Result

Implementation prepared and fixture-verified at 9611b59. No real Spec or Task
was retired or discarded. Integration review and final assembled verification
remain; this is not owner Human QA or release approval.

## Remaining Limitations Or Follow-Up Specs

Owner Human QA, main promotion, Q migration and release are separate gates. Static checks do not prove agent reliability.

Discard checks candidate renderability before removal and removes a newly-created
Task marker if git rm fails. Unexpected I/O errors after successful removal
(for example Wiki/register writes or staging failures) are reported but the
operation is not transactional. The previously clean parent commit and printed
recovery identity preserve recovery; inspect the partial candidate before retrying.

## Supersession

None.

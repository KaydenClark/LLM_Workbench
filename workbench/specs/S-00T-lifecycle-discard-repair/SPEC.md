# S-00T - Lifecycle Discard And Identity Repair

**Spec ID:** S-00T
**Status:** active
**Priority:** 1
**Owner:** codex-lifecycle
**Stance:** Builder
**Updated:** 2026-09-23
**Catalog description:** Repair audited retirement identity, discard recovery, Wiki attribution, final Task persistence and corrective allocation defects before legacy migration.
**Blockers:** none; explicit owner repair assignment precedes migration gates.
**Latest event:** Owner clarified on 2026-09-23 that the Human QA process has been underway since 2026-09-19 and has produced failed reviews. The earlier 51-check/source-review PASS is a separate gate; no owner approval or per-Spec QA finding attribution is recorded here.
**Next gate:** Reconcile the ongoing Human QA findings against this Spec, carry attributable corrections or a return to Align, and inspect a fresh result. Do not request that the owner start Human QA again.

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
| TK-0T0 | Repair discard and identity safety seams | done | none | Full 51-command suite passed on immutable 58a1b3b2caaaa0ece5414d4c027d97c388ab1b1c; separate-context source review PASS; shared command proof in S-00U/VERIFICATION.md. |

## Acceptance Criteria

- [x] Remove/re-add and post-retirement edits cannot bypass current-content containment; printed recovery restores the whole current directory.
- [x] Successful discard leaves no broken Wiki citation; operational references refuse before mutation.
- [x] Final Task discard stays record-backed in the current checkout and a fresh clone; render/staging failures are visible.
- [x] Allocation reserves lifecycle, corrective, discarded and remote-visible identities; repeated corrective calls refuse duplicates.
- [x] A new corrective Task under an already-retired Spec is visible, selectable, claimable and closable without reopening or moving the historical Spec; unfinished Tasks explicitly prevent discard.
- [x] Focused red/green, full suite, manual self-drift check and independent candidate review are recorded.

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

| 2026-09-19 | caa8d2a | Closed independent retired-corrective interaction findings | Red: strengthened existing fixture cannot select the created Task; green at ad50c29 adds next/board/show/claim/close with immutable historical status/location, blockers and negative ordinary-history case. Follow-up red at a66ee6a shows discard deletes unfinished correction with an unrendered board; caa8d2a adds explicit no-write unfinished-Task refusal and aligns active dependency diagnostics with retired completion. Entire test-spec-workbench passes | Both review findings fixed at their existing seams; ordinary history never reopens; no real record mutation. Final assembled suite and review pending |
| 2026-09-19 | c7084b1 | Preserved history verification while eliminating per-blob process overhead | Unchanged clean plus four corruption-case regression passes; original and batched checker outputs at e7b0906025909b9edd626e967b15e526e5d02509 are byte-identical (6978 bytes, SHA256 e4570a4dacefad9c634d97b3a7f1b43080d00ea6a2735845c61c5fe7c3f84820); root independently compared the outputs | Commit order, row identity, historical variants, retired coverage, orphan detection and diagnostics unchanged; batch protocol failures fail visibly; final full verification uses the same criteria |
| 2026-09-19 | TK-0T0 | Task closed | Full 51-command suite passed on immutable 58a1b3b2caaaa0ece5414d4c027d97c388ab1b1c; separate-context source review PASS; shared command proof in S-00U/VERIFICATION.md. | Owning Spec and named runtime/control/Wiki/reconciliation documentation updated; see S-00U/VERIFICATION.md and per-Spec evidence. | Owner Human QA and whole-Spec closure are separate; declared native/external/consumer limits remain. Final proof-state delta review pending. |

| 2026-09-19 | assembled verification | Full source proof and independent review passed at `58a1b3b2caaaa0ece5414d4c027d97c388ab1b1c` | All 51 commands passed in a detached clean tree; before/after HEAD and status identical; separate-context reviewer reran retired-corrective and unfinished-discard probes | Shared S-00U VERIFICATION.md plus owning documentation | Final metadata review and integration delivery pending; owner Human QA, retirement, release and native/external proof are not supplied |
| 2026-09-19 | review | Review verdict: pass at 75a565aa40d62f93903a396079bb2051bc1692ad [0fac0bef1b2f] #1 | none; source and proof-state delivery reviewed, owner QA and disclosed native/external/recovery limits remain separate | independent_review; separate Codex context; inherited model not separately identified; code-review mode | 2 |
| 2026-09-19 | review | Review verdict: pass at 0c34d05c479f4a434f6b102954f9fd2768549baf [0fac0bef1b2f] #2 | none | independent_review; separate Codex context; inherited model not separately identified; code-review mode; corrects prior receipt count: zero review findings | none |

| 2026-09-23 | owner correction | Human QA has been underway since 2026-09-19; the owner reports failed reviews, not a review waiting to start | Direct owner clarification on 2026-09-23; 2026-09-19 S-00I/S-00J approval audit records a failed readiness verdict on its pinned candidates; earlier 51-check and independent source PASS rows prove a different gate | Corrected current header and Taskboard projection; retained earlier evidence unchanged | No owner approval recorded; exact current findings still need per-Spec reconciliation and corrective proof |
| 2026-09-23 | evidence scope correction | The owner correction establishes the state of the overall Human QA process; it does not assign the S-00I/S-00J audit verdict to this Spec | The 2026-09-19 approval audit names only S-00I and S-00J and older pinned candidates; this Spec has separate source-verification evidence | Narrowed the live header and Completion Result without changing prior evidence | Map any specific owner QA finding to this Spec before asserting a per-Spec failed verdict or opening corrective work |

## Completion Result

Audited discard recovery, identity reservation, Wiki preservation, final-Task persistence and retired corrective execution repairs are implemented. Source `58a1b3b2caaaa0ece5414d4c027d97c388ab1b1c` passed the full 51-command suite and separate-context source review. Shared [verification](../S-00U-approval-binding-and-lifecycle-digest/VERIFICATION.md) records commands, red/green cases and limits. Task delivery proof is complete; **whole-Spec closure is not approved**. Final proof-state review and integration delivery remain open; owner approval remains outstanding after ongoing Human QA. No real record was retired/discarded and no main promotion or native-host proof is inferred.

## Remaining Limitations Or Follow-Up Specs

Owner Human QA, main promotion, Q migration and release are separate gates. Static checks do not prove agent reliability.

Discard checks candidate renderability before removal and removes a newly-created
Task marker if git rm fails. Unexpected I/O errors after successful removal
(for example Wiki/register writes or staging failures) are reported but the
operation is not transactional. The previously clean parent commit and printed
recovery identity preserve recovery; inspect the partial candidate before retrying.

## Supersession

None.

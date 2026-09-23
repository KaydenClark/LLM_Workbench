# S-00U - Approval Binding And Lifecycle Digest Repair

**Spec ID:** S-00U
**Status:** active
**Priority:** 0
**Owner:** codex-director
**Stance:** Builder
**Updated:** 2026-09-23
**Catalog description:** Bind Human QA to inspected Git content, separate integration review from closure approval, and preserve proof across administrative completion.
**Blockers:** none
**Latest event:** Owner clarified on 2026-09-23 that the Human QA process has been underway since 2026-09-19 and has produced failed reviews. The earlier 51-check/source-review PASS is a separate gate; no owner approval or per-Spec QA finding attribution is recorded here.
**Next gate:** Reconcile the ongoing Human QA findings against this Spec, carry attributable corrections or a return to Align, and inspect a fresh result. Do not request that the owner start Human QA again.

> **Citation anchors.** pre=`bc370fe742d5ddb8348bf361fccea31205f6cee7` post=`bc370fe742d5ddb8348bf361fccea31205f6cee7`.

## Outcome

The existing review -> integration -> owner Human QA -> completion -> retirement path is executable and approvals describe the committed capability inspected.

## Why It Matters

The S-00J implementation checks candidate ancestry but hashes local content, so an old integration SHA can approve an unmerged Spec. Its premerge gate also requires postmerge approval. Completing a Spec changes the digest and invalidates retirement proof. Retired Task bodies are omitted from that digest.

## Current Verified State

At the pre anchor, `workbench/tools/spec-report.mjs` computes a working-tree digest and `recordOwnerApproval` checks ancestry without comparing candidate content. `workbench/tools/spec-workbench.mjs` requires owner approval in both `gate` and `complete`. The digest includes Spec Status but excludes retired Task files. These source observations are reproduced by task regressions before repair.

## Desired Behavior

Owner approval refuses before writing when the named committed Spec/Tasks differ substantively from local content. Merge preparation requires a complete reviewed Spec; completion still requires owner approval. Administrative active/needs-review -> complete transitions preserve the reviewed digest; substantive content and retired Task changes invalidate it. Receipt/evidence appends remain excluded.

## Decisions And Contracts

This repairs the accepted destination of [S-00J](../S-00J-spec-qa-gate-at-integration/SPEC.md) and its interaction with [S-00I](../S-00I-folder-lifecycle-for-records/SPEC.md). Those existing acceptance claims and historical evidence are preserved. Candidate binding covers assembled Spec/Task content; immutable candidate review still covers implementation files. No owner approval is manufactured. Root owns this Spec and approval/digest code; the S-00T lane owns discard and orphan-correction logic.

## Non-Goals

Owner Human QA, main promotion, release, installation changes, historical record deletion, or claiming a content digest proves runtime behavior.

## Dependencies And Blockers

No implementation blocker. Final retirement sequence validation composes the S-00T lifecycle repair. Real Spec closure requires owner Human QA after integration.

## Vertical Implementation Slices

| Task | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-0U0 | Repair approval binding, gate order and lifecycle digest with continuous regression proof | done | none | Full 51-command suite passed on immutable 58a1b3b2caaaa0ece5414d4c027d97c388ab1b1c; separate-context source review PASS; shared command proof in S-00U/VERIFICATION.md. |

## Acceptance Criteria

- [x] Mismatched committed/local Spec and live/retired Task content cannot acquire owner approval; refused operations write nothing.
- [x] Reviewed complete Spec passes premerge gate without owner approval; completion refuses until valid owner QA.
- [x] Review and approval survive administrative completion; substantive acceptance, proof and retired Task changes invalidate the digest.
- [x] Continuous fixture demonstrates review, integration, approval, completion and retirement without forged live approval.
- [x] Required suite and independent immutable candidate review pass; affected procedures and generic mirror agree.

## Testing Seams

`assembleSpecReport`, `recordOwnerApproval`, `gate`, `completeSpec`, `retireSpec`; `tools/test-spec-report.mjs` and lifecycle fixtures.

## Verification Procedure

Observe targeted red then green. Run the full AGENTS/RUNBOOK suite, guardrail before/after, bounded self-drift read-back, and separate-context review before integration.

## Documentation Impact

RUNBOOK and generic template command descriptions; current S-00J limitations where needed. Broad S-00P rewrite remains separately owned.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-19 | TK-0U0 | Authorized repair scope established | Source read at pre anchor; guardrail baseline 78/100 | New repair owner | Implementation and review pending; no owner approval inferred |

| 2026-09-19 | TK-0U0 | Targeted red/green | Regression first failed Missing expected exception for uncommitted approval; test-spec-report and branch-closeout now pass, including approval-complete-retire fixture | RUNBOOK and generic mirror updated | Full suite and independent review pending; guardrail root remains 78/100, real repeated outcome evidence absent |
| 2026-09-19 | TK-0U0 | Task closed | Full 51-command suite passed on immutable 58a1b3b2caaaa0ece5414d4c027d97c388ab1b1c; separate-context source review PASS; shared command proof in S-00U/VERIFICATION.md. | Owning Spec and named runtime/control/Wiki/reconciliation documentation updated; see S-00U/VERIFICATION.md and per-Spec evidence. | Owner Human QA and whole-Spec closure are separate; declared native/external/consumer limits remain. Final proof-state delta review pending. |

| 2026-09-19 | assembled verification | Full source proof and independent review passed at `58a1b3b2caaaa0ece5414d4c027d97c388ab1b1c` | All 51 commands passed in a detached clean tree; before/after HEAD and status identical; separate-context reviewer reran retired-corrective and unfinished-discard probes | Shared S-00U VERIFICATION.md plus owning documentation | Final metadata review and integration delivery pending; owner Human QA, retirement, release and native/external proof are not supplied |
| 2026-09-19 | review | Review verdict: pass at 75a565aa40d62f93903a396079bb2051bc1692ad [2689ae11e8de] #1 | none; source and proof-state delivery reviewed, owner QA and disclosed native/external/recovery limits remain separate | independent_review; separate Codex context; inherited model not separately identified; code-review mode | 2 |
| 2026-09-19 | review | Review verdict: pass at 0c34d05c479f4a434f6b102954f9fd2768549baf [2689ae11e8de] #2 | none | independent_review; separate Codex context; inherited model not separately identified; code-review mode; corrects prior receipt count: zero review findings | none |

| 2026-09-23 | owner correction | Human QA has been underway since 2026-09-19; the owner reports failed reviews, not a review waiting to start | Direct owner clarification on 2026-09-23; 2026-09-19 S-00I/S-00J approval audit records a failed readiness verdict on its pinned candidates; earlier 51-check and independent source PASS rows prove a different gate | Corrected current header and Taskboard projection; retained earlier evidence unchanged | No owner approval recorded; exact current findings still need per-Spec reconciliation and corrective proof |
| 2026-09-23 | evidence scope correction | The owner correction establishes the state of the overall Human QA process; it does not assign the S-00I/S-00J audit verdict to this Spec | The 2026-09-19 approval audit names only S-00I and S-00J and older pinned candidates; this Spec has separate source-verification evidence | Narrowed the live header and Completion Result without changing prior evidence | Map any specific owner QA finding to this Spec before asserting a per-Spec failed verdict or opening corrective work |

## Completion Result

Approval binds to committed Spec/Task content, premerge review is separated from owner QA, and administrative completion preserves substantive review identity. Source `58a1b3b2caaaa0ece5414d4c027d97c388ab1b1c` passed the full 51-command suite and separate-context source review. Shared [verification](../S-00U-approval-binding-and-lifecycle-digest/VERIFICATION.md) records commands, red/green cases and limits. Task delivery proof is complete; **whole-Spec closure is not approved**. Final proof-state review and integration delivery remain open; owner approval remains outstanding after ongoing Human QA. No real record was retired/discarded and no main promotion or native-host proof is inferred.

## Supersession

- Supersedes: none; corrective capability linked to S-00J and S-00I.
- Superseded by: none.

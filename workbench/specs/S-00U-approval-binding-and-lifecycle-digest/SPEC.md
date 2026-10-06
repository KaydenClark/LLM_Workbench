# S-00U - Approval Binding And Lifecycle Digest Repair

**Spec ID:** S-00U
**Status:** active
**Priority:** 0
**Owner:** codex-approval-retirement-worker
**Stance:** Builder
**Updated:** 2026-09-30
**Catalog description:** Bind Human QA to inspected Git content, separate integration review from closure approval, and preserve proof across administrative completion.
**Blockers:** none
**Latest event:** TK-003K closed with proof.
**Next gate:** Confirm acceptance criteria and completion result.

> **Citation anchors.** pre=`bc370fe742d5ddb8348bf361fccea31205f6cee7` post=`bc370fe742d5ddb8348bf361fccea31205f6cee7`.

## Outcome

The existing review -> integration -> owner Human QA -> completion -> retirement path is executable and approvals describe the committed capability inspected.

## Why It Matters

The S-00J implementation checks candidate ancestry but hashes local content, so an old integration SHA can approve an unmerged Spec. Its premerge gate also requires postmerge approval. Completing a Spec changes the digest and invalidates retirement proof. Retired Task bodies are omitted from that digest.

## Current Verified State

At the pre anchor, `workbench/tools/spec-report.mjs` computes a working-tree digest and `recordOwnerApproval` checks ancestry without comparing candidate content. `workbench/tools/spec-workbench.mjs` requires owner approval in both `gate` and `complete`. The digest includes Spec Status but excludes retired Task files. These source observations are reproduced by task regressions before repair.

The 2026-09-30 continuous S-00I TK-01V fixture exposed a later lookup regression at `2f5b13b`: unchanged approval content became unreadable at its retired path in the original active candidate. TK-003K repairs only that source resolution, keeping digest framing, normalization and the approval identity unchanged. Ephemeral candidate `66b2e37b84ed96e5e5858939be896dfe59e01249` passes targeted report/lifecycle verification; this is a local proof candidate, not delivered state or owner Human QA.

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

| 2026-09-30 | TK-003K | Dispatcher assigned bounded lifecycle-binding corrective; local-only claim | S-00I TK-01V at 2f5b13b fails T5/F3 after retirement: unchanged digest, original approval absent because committed content lookup uses the retired path. Scope is source resolution with verified lifecycle provenance and incarnation; no digest or approval-identity change. TK-003J was concurrently reserved in the portability worktree; Dispatcher reserved TK-003K after local and remote-visible inventory check. | New Task record; retained completed legacy table and all prior evidence | Red/green, full suite and independent review pending; no real owner QA, closure, commit or push |

| 2026-09-30 | TK-003K | Local red/green candidate; independent-review corrective incorporated, fresh review pending | Original red at 2f5b13b: TK-01V T5/F3 unchanged digest lost its original approval. Initial local helper d59a6ba passed targeted tests but separate-context review found that default Git history omitted merge-created source/destination incarnations. Durable regression 68542d4 reproduces that approval bypass. Candidate 66b2e37b84ed96e5e5858939be896dfe59e01249 resolves only the canonical active-to-retired Git rename, verifies candidate ancestry, uses full-history topological per-parent additions while excluding ordinary merge imports, and rejects ancestry deletions. test-spec-workbench passes 55 blocks; test-spec-report passes; reviewer source/destination merge probes pass. The continuous T0-T6 demo reaches post-discard correction in 7.21 seconds, with one simulated approval, no-write substance/incarnation negatives, normal feature delivery and main-merge positives, F4/F5 disposal refusals, final-Task fresh-clone marker, whole-directory Task and Spec recovery and unchanged archive bytes. | Docs checked; no control or template update needed: the implementation restores the existing content-bound lifecycle contract without changing digest normalization, approval identity or public commands. Owning Spec and Task retain current proof state. | Full combined suite, fresh immutable review and integration delivery pending. Guardrail pre/post 78/100, no agent-outcome claim; self-drift remains blocked on existing stale-claim/seed/provenance findings plus the new local untracked Task until committed. No real Human QA, production retirement/discard, main promotion or Task closure |
| 2026-09-30 | TK-003K | Task closed | Exact remote a929fb7e8a79b0d0205c8e7bbc5ef47516e2b346, tree46b2b761413d7272e1b028e0b9413ae18775c4bb: independent saved-cloud all 51 commands PASS, no code/safety blockers, six additional resolver probes PASS; source/destination and merge-created incarnations, changed substance and unrelated candidates refused. Independent exact-SHA local review PASS; identical-tree b374 also full51 PASS. | S-00U TK-003K documents corrective provenance; unchanged approval identity/digest contract; no Spec owner approval | Final docs-only closeout, exact-head verification/review and integration delivery remain pending; no S-00U completion, real Human QA, main or release claim |

## Completion Result

Approval binds to committed Spec/Task content, premerge review is separated from owner QA, and administrative completion preserves substantive review identity. Source `58a1b3b2caaaa0ece5414d4c027d97c388ab1b1c` passed the full 51-command suite and separate-context source review. Shared [verification](../S-00U-approval-binding-and-lifecycle-digest/VERIFICATION.md) records commands, red/green cases and limits. Earlier Task delivery proof is retained; TK-003K now repairs the approval-lookup regression exposed by continuous retirement verification. **Whole-Spec closure is not approved**. Final proof-state review and integration delivery remain open; owner approval remains outstanding after ongoing Human QA. No real record was retired/discarded and no main promotion or native-host proof is inferred.

## Supersession

- Supersedes: none; corrective capability linked to S-00J and S-00I.
- Superseded by: none.

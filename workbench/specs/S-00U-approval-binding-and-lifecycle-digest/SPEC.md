# S-00U - Approval Binding And Lifecycle Digest Repair

**Spec ID:** S-00U
**Status:** active
**Priority:** 0
**Owner:** codex-director
**Stance:** Builder
**Updated:** 2026-09-19
**Catalog description:** Bind Human QA to inspected Git content, separate integration review from closure approval, and preserve proof across administrative completion.
**Blockers:** none
**Latest event:** Approval and lifecycle digest repairs implemented; targeted red/green passed and combined suite/review are pending.
**Next gate:** Verify the immutable combined candidate and resolve independent review before integration; owner Human QA remains later.

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
| TK-0U0 | Repair approval binding, gate order and lifecycle digest with continuous regression proof | in-progress | none | Targeted spec-report and branch-closeout passed at f47d57f; combined suite/review pending |

## Acceptance Criteria

- [ ] Mismatched committed/local Spec and live/retired Task content cannot acquire owner approval; refused operations write nothing.
- [ ] Reviewed complete Spec passes premerge gate without owner approval; completion refuses until valid owner QA.
- [ ] Review and approval survive administrative completion; substantive acceptance, proof and retired Task changes invalidate the digest.
- [ ] Continuous fixture demonstrates review, integration, approval, completion and retirement without forged live approval.
- [ ] Required suite and independent immutable candidate review pass; affected procedures and generic mirror agree.

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

## Completion Result

Implementation and procedure updates are prepared at `f47d57f`; combined
verification and independent review remain pending. This is not Spec completion
or owner Human QA. The real I/J approval gates remain open.

## Supersession

- Supersedes: none; corrective capability linked to S-00J and S-00I.
- Superseded by: none.

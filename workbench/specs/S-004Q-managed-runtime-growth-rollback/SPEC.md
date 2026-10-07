# S-004Q - Managed Runtime Growth Rollback

**Spec ID:** S-004Q
**Status:** active
**Priority:** 1
**Owner:** codex-runtime-rollback
**Stance:** Builder
**Updated:** 2026-10-07
**Catalog description:** Recover the prior managed runtime file set safely when update introduces new tools, including legacy growth backups.
**Blockers:** none
**Latest event:** TK-007J claimed by codex-runtime-rollback.
**Next gate:** Close TK-007J with verification and documentation proof.

## Outcome

Managed tools rollback restores previous files and receipt and removes only proven introduced tools, without discarding local changes.

## Why It Matters

A recovery rehearsal restored11 original hashes but retained18 introduced files. This source correction is required before a dependent room update relies on component recovery.

## Current Verified State

At817661a4745fe3a307622eea5e47595d43cb3537, tools/workbench-tools.mjs update backs up present changed files; rollback restores only previous receipt names and deletes nothing. A missing receipt key always makes a name changed, so the recorded backup file list also establishes whether that name existed. Historical clean controller9378eada35b30199a53f6b921215950d0fa7ff38 carries11 tools; current source29. Manifest Schema2 And Managed Support Runtime (S-023) delivered the installer; Template Upgrade Release Gate (S-00F) and Workbench v4.0.0 Release (S-00O) retain its partial-recovery limit. No live controller writer or correction PR was found.

## Desired Behavior

1. Update records original absence and backed-up hashes before replacement.
2. Rollback preflights a currently recorded backup, restores saved files, removes only identified introduced tools and preserves the previous receipt/backups.
3. Legacy previous11/current29 receipts with nine backed-up files recover the original11 using the delivered update rule above. Inference requires known integration-generation8e9c06f6 history; its controller equals historical main9378eada, without requiring the main merge as an ancestor. Legacy saved bytes must match previous receipt hashes; new saved hashes support pre-update drift. Inconsistent or ambiguous metadata refuses.
4. Unrecorded/corrupt/unsafe backups or modified introduced tools refuse before any lane mutation.
5. Historical11 native verification passes restored11. Current29 coverage remains strict and reports the older generation needs update.

## Decisions And Contracts

The Owner's delegated end-to-end direction authorizes this narrow prerequisite, one writer, red/green, required current checks, one immutable assembled review and ordinary integration delivery. Public proof uses synthetic rooms only. Completed owners and planned Update Harness Skill Rebuild (S-01N) stay untouched. Payload/Core skill bytes remain87d5154-equivalent; no version bump, private installed paths or main approval.

## Non-Goals

Installed-root mutation, whole-room inverse recovery, skill rollback, foreign-file deletion, broad migration redesign, or weakening runtime coverage.

## Dependencies And Blockers

None for producer correction; installed update remains paused for verified recovery.

## Vertical Implementation Slices

One public CLI tracer bullet covers metadata, rollback, refusals, proof and documentation. Tasks cut on activation.

## Acceptance Criteria

- [x] New and recorded legacy11-to29 growth backups restore all original11 hashes/file set, remove18 introduced tools and preserve previous receipt/backups.
- [x] Corrupt/unrecorded/unsafe backup and local introduced-file modification regressions refuse without changing any lane byte or receipt.
- [x] Historical native verification passes; current coverage still rejects older generation; payload, Core and version bytes unchanged.
- [x] Focused red/green, all current Runbook checks, before/after room checks and scoped docs recorded without private target data or unrun claims.

## Testing Seams

Disposable-room tools/workbench-tools.mjs CLI; immutable9378eada historical controller and complete lane snapshots.

## Verification Procedure

Focused tools/test-workbench-tools.mjs red/green, full current Runbook suite on clean source, Wiki/render/doctor and self-drift/guardrails; one content-bound assembled review before integration and exact containment after merge.

## Documentation Impact

This owner and existing managed-runtime feature explanation. Generic controls/templates exempt: command interface, room layout and payload are unchanged; new backup metadata belongs to the release-side controller. No skill text change.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-07 | planning | Narrow prerequisite assigned | Source/controller and ownership inspected read-only | New owner linked to delivered managed runtime and retained limitations | Regression, implementation, checks, review and delivery pending |
| 2026-10-07 | setup | Initial Task claim refused | Native activation succeeded. Claim refused before mutation because the new Spec/Task own paths were uncommitted; its stated recovery is commit first. | Draft records and failed attempt preserved; no lifecycle-tool change | Checkpoint the assigned records, then native claim |
| 2026-10-07 | TK-007J | Public growth rollback regression and correction | Original controller817661a4 returns rolled-back while retaining18 introduced files, accepts an unrecorded backup and overwrites post-update changes. Committed REDb69fd5ec; corrected controller9e85b668 focused11/11 and installer30/30 GREEN. Corrected fixture compares all original files including the existing lane placeholder; replay against unchanged original controller remains RED. | Controller now records absence and saved hashes, preflights recorded backup/integrity/local edits and restores exact previous receipt. Legacy ancestry guard corrected from historical main9378 to its controller-identical integration parent8e9; unknown sources still refuse. Feature explanation updated; no payload/Core/version/private target delta. | Added historical-source preservation and mode-edit checks, final full current suite, immutable assembled review and integration remain pending. Initial fixture expectation and legacy-guard failures retained locally; no first-pass-clean claim. |
| 2026-10-07 | TK-007J | Deterministic producer Check passed | Full54/54 on clean cb380955; installer32/32. Legacy saved9/previous11/current29 restores exact original bytes, file set, backups and source9378; historical native valid, current29 honestly needs update. Original controller RED replay retained. Pruned-current legacy case failed RED then guarded GREEN. | Initial red, setup refusal, fixture/generation failures and final checks retained under proof/. Scoped feature explanation and legacy limits recorded. Guardrails73/100 unchanged; known21 findings retained; no runtime/Core/version/private target delta. | Native close, one immutable assembled review and integration delivery follow; installed-root repeat is not performed here |
| 2026-10-07 | TK-007J | Task closed | All54 Runbook commands pass on clean cb3809551a70f3307ee81bd33ba70e15f3414014; installer32/32 with exact legacy9/11/29 recovery, historical native verification, preserved source/backups and unchanged-lane refusal snapshots. Current29 coverage remains strict. Runtime/Core/version bytes unchanged; public proof/verification.json and room-checks.json retain limits. | Source-only controller, its public regressions, existing managed-runtime feature article and bounded corrective owner; failure lineage, guardrails and room limits preserved; generic template exemption recorded. | Independent assembled review and integration next; installed-root recovery belongs to dependent coordinator. Known drift and Owner Human QA/main remain separate. |
| 2026-10-07 | review | Review verdict: fail at 9a04913f227e7ebcc6b5245eaa5d370a9aef444a [81eeffd38dd0] #1 | continue TK-007J: Refuse rollback when a saved tool was deleted after update and prove unchanged lane and receipt; continue TK-007J: Render after native Task closure and verify doctor has no render drift | Fresh same-provider OpenAI Codex context runtime_rollback_review; read-only assembled Spec review; exact deployed model identifier not exposed | 2 |
| 2026-10-07 | TK-007J | Review corrective Check passed | Local saved/introduced deletion RED25f984e3 then guarded GREEN709c041a; installer34/34, full54/54 on clean709c041af1e832f89d67aa57a01dc776c6ef01ec. Doctor has no render drift; post retains21 known findings/blocked/cleanUpdatefalse, guardrails73/100 unchanged. | First native FAIL preserved; corrective-verification.json, deletion-red.txt, corrective-installer-green.txt and corrective-room-check.json retain public proof. One-condition guard and scoped feature wording only. | Native close then render/doctor, one fresh immutable assembled review and ordinary integration; installed-root repeat remains dependent |

## Completion Result

First assembled review9a04913 failed on silent reversal of a local deletion and post-close render drift; its native FAIL and continued Task retain both findings. Corrective709c041a passes installer34/34 and all54 current Runbook commands; exact prior-generation recovery and unchanged-lane local-deletion refusals pass. Runtime/Core/version bytes are unchanged. Fresh assembled review and integration containment follow. The dependent installed-root operation, existing drift and Owner Human QA/main remain separate.

## Supersession

None; repairs delivered managed runtime without reviving completed owners.

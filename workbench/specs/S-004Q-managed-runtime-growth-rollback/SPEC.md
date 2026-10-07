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
3. Legacy previous11/current29 receipts with nine backed-up files recover the original11 using the delivered update rule above; inconsistent or ambiguous metadata refuses.
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

- [ ] New and recorded legacy11-to29 growth backups restore all original11 hashes/file set, remove18 introduced tools and preserve previous receipt/backups.
- [ ] Corrupt/unrecorded/unsafe backup and local introduced-file modification regressions refuse without changing any lane byte or receipt.
- [ ] Historical native verification passes; current coverage still rejects older generation; payload, Core and version bytes unchanged.
- [ ] Focused red/green, all current Runbook checks, before/after room checks and scoped docs recorded without private target data or unrun claims.

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

## Completion Result

Pending. Owner Human QA/main remain separate.

## Supersession

None; repairs delivered managed runtime without reviving completed owners.

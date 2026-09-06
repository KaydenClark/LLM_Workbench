# LLM Workbench - Hot Taskboard

**Current focus:** See the generated Active Specs projection below.
**Owner:** See each assigned spec.
**Last updated:** 2026-09-05

This dashboard contains current execution state only. Use
`node workbench/tools/spec-workbench.mjs next` to select work and `show S-###` to load its
requirements. Durable requirements, decisions, acceptance criteria, and proof
live in the linked spec. Commands live in `RUNBOOK.md`.

## Active Specs

<!-- hot-specs:start -->
| Spec | Current slice | Owner | Blocker | Latest meaningful event | Next gate |
|---|---|---|---|---|---|
| [S-014](workbench/specs/S-014-workbench-release-candidate/SPEC.md) | TK-003: Open the sole non-draft integration-to-main owner promotion PR (ready) | codex | TK-002 | S-027 delivered the reviewed v3.1.1 candidate through PR #48 at integration 09f0875; historical release proof remains preserved. | Reconcile this historical release procedure and version intent with owner direction before any publication; do not reopen S-027 or require CIC for ordinary testing. |
| [S-022](workbench/specs/S-022-llm-workbench-v3-1-release/SPEC.md) | TK-004: Obtain the independent exact-SHA audit, land the v3.1.0 version bump, and hand the candidate to S-014 (blocked) | claude-fable-5-1 | owner release direction | S-027 delivered the reviewed v3.1.1 candidate through PR #48 at integration 09f0875; historical release proof remains preserved. | Reconcile this historical release procedure and version intent with owner direction before any publication; do not reopen S-027 or require CIC for ordinary testing. |
| [S-040](workbench/specs/S-040-skill-gate-route-selection/SPEC.md) | Acceptance / owner gate | claude-opus-5 | none | TK-002 closed with proof. | Confirm acceptance criteria and completion result. |
| [S-038](workbench/specs/S-038-v3-1-2-upstream-fix-list/SPEC.md) | TK-002: After S-039 through S-044 are complete and the full suite is green, write the final disposition table and the v3.1.2 release account (ready) | claude-opus-5 | S-039, S-040, S-041, S-042, S-043, S-044 | Owner accepted the routing on 2026-09-06 and answered questions 1 and 2; S-041 is unblocked and question 3 stays open as an owner-only item. | Separate-context review of this candidate, then merge into `integration`; capability slices proceed under their own specs. |
| [S-041](workbench/specs/S-041-recorded-baseline-availability/SPEC.md) | Acceptance / owner gate | claude-opus-5 | none | TK-001 closed with proof. | Separate-context review of this candidate, then merge into `integration`; complete the spec after the review passes. |
| [S-042](workbench/specs/S-042-installed-state-repair/SPEC.md) | Acceptance / owner gate | unassigned | none | Separate-context review approved `7a5529b` on 2026-09-06 after four rounds; the record defects the last two rounds found are corrected and the code has been untouched since its adversarial pass. | Independent review of the exact candidate, then merge into `integration`. |
| [S-044](workbench/specs/S-044-legacy-room-classification/SPEC.md) | Acceptance / owner gate | unassigned | none | Fourth separate-context review found the code clean and blocked on one overstated proof claim, corrected here; the read-only property itself was independently re-proven with 23 fs mutators poisoned. | Independent integration review of `claude/s044-v3-1-2` before it merges into `integration`. |
<!-- hot-specs:end -->

## Owner Decisions

Owner decisions and blockers live in their assigned specs and appear in the
generated projection above. This section adds no separate decision store.

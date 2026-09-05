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
| [S-014](workbench/specs/S-014-workbench-release-candidate/SPEC.md) | TK-003: Open the sole non-draft integration-to-main owner promotion PR (ready) | codex | TK-002 | Owner authorized S-027 v3.1.1 continuation; historical release proof is retained and publication remains paused. | Wait for the reviewed v3.1.1 integration candidate; reconcile this historical release procedure with current owner direction before publication. |
| [S-022](workbench/specs/S-022-llm-workbench-v3-1-release/SPEC.md) | TK-004: Obtain the independent exact-SHA audit, land the v3.1.0 version bump, and hand the candidate to S-014 (blocked) | claude-fable-5-1 | S-027 | Owner authorized S-027; preserve the v3.1 candidate and completed proof; pause TK-004. | Complete S-027 candidate preparation, then reconcile the exact candidate before resuming release. |
| [S-027](workbench/specs/S-027-workbench-v3-1-1-boundaries/SPEC.md) | TK-001: Build and verify v3.1.1 route and stances, run Round One, then deliver feedback reporting and continuation (in-progress) | codex | none | Owner authorized the push; the corrected candidate is remotely recoverable and a separate-context review returned APPROVE with one record-drift correction. | Open the integration pull request for the reviewed candidate. Merging into `integration` remains the only remaining step; `integration` to `main` stays owner-only. |
<!-- hot-specs:end -->

## Owner Decisions

Owner decisions and blockers live in their assigned specs and appear in the
generated projection above. This section adds no separate decision store.

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
| [S-050](workbench/specs/S-050-workbench-v3-2-0-release/SPEC.md) | TK-006: Reconcile release receipts and readiness verdict (blocked) | codex | live-device-and-private-repository-access | Repaired source PR84 and Template PR5/PR6 delivered; exact receipts reconciled. | Establish actual S052TK004 private repository and Mac/Windows Claude/Codex access before final readiness. |
| [S-00D](workbench/specs/S-00D-genesis-from-blueprint-and-adrs/SPEC.md) | TK-00E: Derive a valid scoped room from locked project inputs (in-progress) | codex-v321-manager | S-00C | TK-00E claimed by codex-v321-manager. | Close TK-00E with verification and documentation proof. |
| [S-00E](workbench/specs/S-00E-fresh-template-project-proof/SPEC.md) | TK-00F: Exercise the clean-copy path through useful project continuation (ready) | codex-v321-manager | S-00D | Owner activated S-00A through S-00E for v3.2.1 delivery to integration. | Execute the assigned vertical slice, verify acceptance, and review the immutable v3.2.1 candidate before integration. |
| [S-052](workbench/specs/S-052-private-session-transport/SPEC.md) | TK-004: Prove real Mac Windows Claude Codex continuation (blocked) | codex | live-device-and-private-repository-access | TK-003 closed with proof. | Establish actual private repository and Mac/Windows Claude/Codex access for TK-004. |
<!-- hot-specs:end -->

## Owner Decisions

Owner decisions and blockers live in their assigned specs and appear in the
generated projection above. This section adds no separate decision store.

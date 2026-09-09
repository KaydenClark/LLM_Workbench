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
| [S-00A](workbench/specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md) | TK-00A: Validate active ADR lifecycle and render active/history projections (in-progress) | codex | none | TK-00A claimed by codex. | Close TK-00A with verification and documentation proof. |
| [S-00B](workbench/specs/S-00B-workbench-template-reformation/SPEC.md) | TK-00C: Update and validate the Workbench Template against the settled ownership model (blocked) | codex | S-00A | Stable owner created from the locked Template decision; no external room bytes changed. | Complete S-00A, inspect current Workbench Template controls, then claim TK-00C. |
| [S-046](workbench/specs/S-046-json-notepad-foundation/SPEC.md) | TK-007: Repair confirmed basename/sequence regressions and continuity gates (in-progress) | codex | none | TK-007 claimed by codex. | Close TK-007 with verification and documentation proof. |
| [S-050](workbench/specs/S-050-workbench-v3-2-0-release/SPEC.md) | TK-006: Reconcile release receipts and readiness verdict (ready) | codex | TK-005 | TK-004 closed with proof. | Complete S-00A, then carry the Workbench Template update through TK-005. |
| [S-047](workbench/specs/S-047-visible-workbench-identifiers/SPEC.md) | Acceptance / owner gate | codex | none | TK-002 closed with proof. | Confirm acceptance criteria and completion result. |
| [S-048](workbench/specs/S-048-checkpoint-retirement/SPEC.md) | Acceptance / owner gate | codex | none | All implementation slices verified; release integration remains open. | Reconcile S-051 core catalog and pass the S-050 independent integration gate. |
| [S-051](workbench/specs/S-051-core-skill-ownership-and-compatibility/SPEC.md) | TK-004: Repair scope-preserving core composition, handoff, routing and evidence review (in-progress) | codex | none | TK-004 claimed by codex. | Close TK-004 with verification and documentation proof. |
| [S-052](workbench/specs/S-052-private-session-transport/SPEC.md) | TK-004: Prove real Mac Windows Claude Codex continuation (blocked) | codex | live-device-and-private-repository-access | TK-003 closed with proof. | Establish actual private repository and Mac/Windows Claude/Codex access for TK-004. |
| [S-053](workbench/specs/S-053-configured-host-capabilities/SPEC.md) | Acceptance / owner gate | codex | none | TK-003 closed with proof. | Confirm acceptance criteria and completion result. |
<!-- hot-specs:end -->

## Owner Decisions

Owner decisions and blockers live in their assigned specs and appear in the
generated projection above. This section adds no separate decision store.

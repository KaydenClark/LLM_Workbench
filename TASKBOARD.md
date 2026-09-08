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
| [S-046](workbench/specs/S-046-json-notepad-foundation/SPEC.md) | TK-005: Prove authored handoff, retained-context cleanup and real fresh-agent recovery through installed skills (in-progress) | codex | TK-004 | TK-005 claimed by codex. | Close TK-005 with verification and documentation proof. |
| [S-050](workbench/specs/S-050-workbench-v3-2-0-release/SPEC.md) | TK-003: Converge capability implementations and useful continuity proof (in-progress) | codex | TK-002 | TK-003 claimed by codex. | Close TK-003 with verification and documentation proof. |
| [S-051](workbench/specs/S-051-core-skill-ownership-and-compatibility/SPEC.md) | TK-001: Define and install one authoritative core source with adapters (ready) | codex | none | Owner assigned the reconciled v3.2.0 release through Example integration. | Define and install one authoritative core source with adapters. |
| [S-052](workbench/specs/S-052-private-session-transport/SPEC.md) | TK-001: Allocate stable room identity and preserve it across lifecycle operations (ready) | codex | none | Owner assigned the reconciled v3.2.0 release through Example integration. | Allocate stable room identity and preserve it across lifecycle operations. |
| [S-053](workbench/specs/S-053-configured-host-capabilities/SPEC.md) | TK-002: Implement operation-scoped host conformance checks (ready) | codex | TK-001 | Owner assigned the reconciled v3.2.0 release through Example integration. | Agree the concrete host capability floor. |
<!-- hot-specs:end -->

## Owner Decisions

Owner decisions and blockers live in their assigned specs and appear in the
generated projection above. This section adds no separate decision store.

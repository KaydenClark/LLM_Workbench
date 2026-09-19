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
| [S-00U](workbench/specs/S-00U-approval-binding-and-lifecycle-digest/SPEC.md) | TK-0U0: Repair approval binding, gate order and lifecycle digest with continuous regression proof (in-progress) | codex-director | none | TK-0U0 claimed by codex-director. | Close TK-0U0 with verification and documentation proof. |
| [S-014](workbench/specs/S-014-workbench-release-candidate/SPEC.md) | TK-003: Open the sole non-draft integration-to-main owner promotion PR (ready) | codex | TK-002 | S-027 delivered the reviewed v3.1.1 candidate through PR #48 at integration 09f0875; historical release proof remains preserved. | Reconcile this historical release procedure and version intent with owner direction before any publication; do not reopen S-027 or require CIC for ordinary testing. |
| [S-022](workbench/specs/S-022-llm-workbench-v3-1-release/SPEC.md) | TK-004: Obtain the independent exact-SHA audit, land the v3.1.0 version bump, and hand the candidate to S-014 (blocked) | claude-fable-5-1 | owner release direction | S-027 delivered the reviewed v3.1.1 candidate through PR #48 at integration 09f0875; historical release proof remains preserved. | Reconcile this historical release procedure and version intent with owner direction before any publication; do not reopen S-027 or require CIC for ordinary testing. |
| [S-00O](workbench/specs/S-00O-workbench-v4-0-0-release/SPEC.md) | TK-001: Verify the four build Specs are complete and run the bounded self-drift check (ready) | unassigned | S-00P | Spec authored 2026-09-16 from the owner's rollout decision (directive-018) in the WF grilling note at revision 57; no implementation started. | S-00P reaches `complete`; then set Status to `active` and `claim S-00O` takes TK-001. |
| [S-00P](workbench/specs/S-00P-workflow-canon-rework/SPEC.md) | TK-002: Rewrite `AGENTS.md` to the Task-record workflow using only commands that exist (blocked) | DISPATCHER | TK-001, S-00H, S-00I, S-00J | TK-001 closed with proof. | TK-002 waits on S-00H, S-00I and S-00J reaching `complete`; then `claim S-00P` takes TK-002, the `AGENTS.md` rewrite. |
| [S-00T](workbench/specs/S-00T-lifecycle-discard-repair/SPEC.md) | TK-0T0: Repair discard and identity safety seams (in-progress) | codex-lifecycle | none; explicit owner repair assignment precedes migration gates. | Runtime and regression fixtures pass at 9611b59; final assembled suite and independent review remain. | Coordinator verifies the final immutable assembly and obtains separate-context review before closeout. |
| [S-050](workbench/specs/S-050-workbench-v3-2-0-release/SPEC.md) | TK-006: Reconcile release receipts and readiness verdict (blocked) | codex | live-device-and-private-repository-access | Repaired source PR84 and Template PR5/PR6 delivered; exact receipts reconciled. | Establish actual S052TK004 private repository and Mac/Windows Claude/Codex access before final readiness. |
| [S-00Q](workbench/specs/S-00Q-legacy-completed-record-migration/SPEC.md) | TK-0Q0: Freeze the legacy inventory and record the owner QA rule (ready) | unassigned | Article inventory and authoring are authorized now. Retirement waits for S-00I/S-00J/S-00P completion, reviewed batch digests and TK-0Q1 repair proof; discard additionally waits for default-branch containment. | Owner clarified exactly one Wiki article per legacy Spec and authorized independent preparation before lifecycle gates; S-00T implements runtime repair prerequisites. | TK-0Q0 freezes the inventory and article routes; author article batches in parallel, keeping retirement/discard gated separately. |
| [S-052](workbench/specs/S-052-private-session-transport/SPEC.md) | TK-004: Prove real Mac Windows Claude Codex continuation (blocked) | codex | live-device-and-private-repository-access | TK-003 closed with proof. | Establish actual private repository and Mac/Windows Claude/Codex access for TK-004. |
| [S-00I](workbench/specs/S-00I-folder-lifecycle-for-records/SPEC.md) | Acceptance / owner gate | DISPATCHER | none; S-00H is `complete` (integration `49c671e`). | TK-006 closed with proof. | Confirm acceptance criteria and completion result. |
| [S-00J](workbench/specs/S-00J-spec-qa-gate-at-integration/SPEC.md) | Acceptance / owner gate | DISPATCHER | none; S-00H is `complete` (integration `49c671e`). | TK-006 closed with proof. | Confirm acceptance criteria and completion result. |
<!-- hot-specs:end -->

## Owner Decisions

Owner decisions and blockers live in their assigned specs and appear in the
generated projection above. This section adds no separate decision store.

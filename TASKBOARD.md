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
| [S-00U](workbench/specs/S-00U-approval-binding-and-lifecycle-digest/SPEC.md) | TK-0U0: Repair approval binding, gate order and lifecycle digest with continuous regression proof (in-progress) | codex-director | none | Approval and lifecycle digest repairs implemented; targeted red/green passed and combined suite/review are pending. | Verify the immutable combined candidate and resolve independent review before integration; owner Human QA remains later. |
| [S-014](workbench/specs/S-014-workbench-release-candidate/SPEC.md) | TK-003: Open the sole non-draft integration-to-main owner promotion PR (ready) | codex | TK-002 | S-00K owner reconciliation removed the obsolete duplicate release assignment without changing historical proof. | Follow S-00O for current release work; owner-only main promotion and S-052 live-host proof remain separate gates. |
| [S-022](workbench/specs/S-022-llm-workbench-v3-1-release/SPEC.md) | TK-004: Obtain the independent exact-SHA audit, land the v3.1.0 version bump, and hand the candidate to S-014 (blocked) | claude-fable-5-1 | owner release direction | S-00K owner reconciliation removed the obsolete duplicate release assignment without changing historical proof. | Follow S-050 for current release work; owner-only main promotion and S-052 live-host proof remain separate gates. |
| [S-00K](workbench/specs/S-00K-workbench-self-drift-check/SPEC.md) | TK-001: Implement the Workbench self-drift seam, integrate it into update procedures, and prove cold-start-safe current state (in-progress); TK-0SA: Reconcile the old release hot-queue with its current owner and Sol-coordinated disposition (in-progress) | drift-reconciler | none | TK-0SA claimed by drift-reconciler. | Close TK-0SA with verification and documentation proof. |
| [S-00O](workbench/specs/S-00O-workbench-v4-0-0-release/SPEC.md) | TK-001: Verify the four build Specs are complete and run the bounded self-drift check (ready) | unassigned | S-00P | Spec authored 2026-09-16 from the owner's rollout decision (directive-018) in the WF grilling note at revision 57; no implementation started. | S-00P reaches `complete`; then set Status to `active` and `claim S-00O` takes TK-001. |
| [S-00P](workbench/specs/S-00P-workflow-canon-rework/SPEC.md) | TK-002: Rewrite `AGENTS.md` to the Task-record workflow using only commands that exist (blocked) | DISPATCHER | TK-001, S-00H, S-00I, S-00J | TK-001 closed with proof. | After S-00I/S-00J repairs, integration Human QA and completion, claim TK-002 for the AGENTS rewrite. |
| [S-00T](workbench/specs/S-00T-lifecycle-discard-repair/SPEC.md) | TK-0T0: Repair discard and identity safety seams (in-progress) | codex-lifecycle | none; explicit owner repair assignment precedes migration gates. | Runtime and regression fixtures pass at 9611b59; final assembled suite and independent review remain. | Coordinator verifies the final immutable assembly and obtains separate-context review before closeout. |
| [S-050](workbench/specs/S-050-workbench-v3-2-0-release/SPEC.md) | TK-006: Reconcile release receipts and readiness verdict (blocked) | codex | live-device-and-private-repository-access | Repaired source PR84 and Template PR5/PR6 delivered; exact receipts reconciled. | Establish actual S052TK004 private repository and Mac/Windows Claude/Codex access before final readiness. |
| [S-00Q](workbench/specs/S-00Q-legacy-completed-record-migration/SPEC.md) | TK-0Q0: Freeze the legacy inventory and record the owner QA rule (ready) | unassigned | Article inventory and authoring are authorized now. Retirement waits for S-00I/S-00J/S-00P completion, reviewed batch digests and TK-0Q1 repair proof; discard additionally waits for default-branch containment. | Owner clarified exactly one Wiki article per legacy Spec and authorized independent preparation before lifecycle gates; S-00T implements runtime repair prerequisites. | TK-0Q0 freezes the inventory and article routes; author article batches in parallel, keeping retirement/discard gated separately. |
| [S-00R](workbench/specs/S-00R-core-skill-lifecycle-and-optional-source-disposition/SPEC.md) | TK-0R0: Inventory optional source consumers, provenance, attribution, and recovery routes without changing disposition (in-progress; runs 2, codex/S-00R-optional-inventory @ b54c8c7, dirty 3) | codex-skills | S-00P phase two must publish current Canon before lifecycle wording changes; removal or relocation requires a per-item owner decision. | TK-0R0 inventory and owner-gated disposition rows implemented; named checks passed; remaining full-suite proof consolidated into the common immutable candidate run. | Obtain common immutable full-suite proof, including append-only history verification, before closing TK-0R0 and verifying TK-0R2; TK-0R1 still waits for S-00P Canon and TK-0R3 for per-item owner decisions. |
| [S-052](workbench/specs/S-052-private-session-transport/SPEC.md) | TK-004: Prove real Mac Windows Claude Codex continuation (blocked) | codex | live-device-and-private-repository-access | TK-003 closed with proof. | Establish actual private repository and Mac/Windows Claude/Codex access for TK-004. |
| [S-00I](workbench/specs/S-00I-folder-lifecycle-for-records/SPEC.md) | Acceptance / owner gate | DISPATCHER | none; S-00H is `complete` (integration `49c671e`). | TK-006 closed with proof. | Confirm acceptance criteria and completion result. |
| [S-00J](workbench/specs/S-00J-spec-qa-gate-at-integration/SPEC.md) | Acceptance / owner gate | DISPATCHER | none; S-00H is `complete` (integration `49c671e`). | TK-006 closed with proof. | Confirm acceptance criteria and completion result. |
| [S-00N](workbench/specs/S-00N-feedback-finding-dispositions/SPEC.md) | TK-001: Define the closed disposition vocabulary in `LEXICON.md` (in-progress); TK-002: Ratchet the registry so every diagnostic carries remediation text (in-progress); TK-003: Require the disposition field in both `REPORT_FORMAT.md` copies (in-progress); TK-004: Disposition the findings already in the feedback lane (in-progress) | feedback-lane | none | TK-002 claimed by feedback-lane. | Close TK-002 with verification and documentation proof. |
| [S-00S](workbench/specs/S-00S-feedback-representation-and-consumer-reconciliation/SPEC.md) | TK-0S0: Inventory feedback representations, provenance identity and consumers (in-progress) | feedback-inventory | none | TK-0S0 claimed by feedback-inventory. | Close TK-0S0 with verification and documentation proof. |
<!-- hot-specs:end -->

## Owner Decisions

Owner decisions and blockers live in their assigned specs and appear in the
generated projection above. This section adds no separate decision store.

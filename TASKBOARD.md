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
| [S-036](workbench/specs/S-036-v3-1-2-evidence-corrections/SPEC.md) | TK-004: Reconcile current ownership prose, run the full release gate, independently review the immutable candidate, and land it on `integration` (in-progress) | codex-gpt-5 | TK-003 | Separate-context review of `ec3fcf5` approved the fully aligned candidate; the full release gate is green and one pre-existing tools-lane deny gap is recorded as a follow-up. | Open and merge the approved PR into `integration`, then prove remote containment of the exact reviewed commit. |
| [S-037](workbench/specs/S-037-line-ending-agnostic-records/SPEC.md) | TK-002: Obtain independent review of the exact candidate and land it on `integration` (ready) | claude-opus-5 | TK-001 | Red/green landed for the shared frontmatter parser and the adoption memory writer; a simulated CRLF room drops from 30 findings to 0. | Independent review of the exact candidate, then merge into `integration`. |
| [S-040](workbench/specs/S-040-skill-gate-route-selection/SPEC.md) | TK-001: Accept a linked destination whose realpath already contains the skill, and keep the refusal for a file, a missing target, or a directory without it (ready) | unassigned | none | Spec captured from upstream items UP-015 and UP-016; both re-verified against `b3633e5`. | Claim TK-001 and reproduce the linked-destination refusal red. |
| [S-038](workbench/specs/S-038-v3-1-2-upstream-fix-list/SPEC.md) | TK-002: After S-039 through S-044 are complete and the full suite is green, write the final disposition table and the v3.1.2 release account (ready) | claude-opus-5 | S-039, S-040, S-041, S-042, S-043, S-044 | Owner accepted the routing on 2026-09-06 and answered questions 1 and 2; S-041 is unblocked and question 3 stays open as an owner-only item. | Separate-context review of this candidate, then merge into `integration`; capability slices proceed under their own specs. |
| [S-039](workbench/specs/S-039-installed-runtime-integrity/SPEC.md) | TK-001: Emit the receipt hash check from an installed path so a drifted room fails `doctor` at its registered `all` effect (ready) | unassigned | none | Spec captured from upstream items UP-013 and UP-014; both re-verified against `b3633e5`. | Claim TK-001 and reproduce the missing emitter red. |
| [S-041](workbench/specs/S-041-recorded-baseline-availability/SPEC.md) | Acceptance / owner gate | claude-opus-5 | none | TK-001 closed with proof. | Separate-context review of this candidate, then merge into `integration`; complete the spec after the review passes. |
| [S-042](workbench/specs/S-042-installed-state-repair/SPEC.md) | TK-001: Track the generation of seeded lane documents and register one diagnostic for a seeded document behind the manifest, covering `REPORT_FORMAT.md` (ready) | unassigned | none | Spec captured from upstream items UP-018, UP-020, and UP-021; UP-020's reported impact was re-measured and largely reattributed to the line-ending defect that S-037 fixes. | Claim TK-001 and register the seeded-document generation check red. |
| [S-043](workbench/specs/S-043-diagnostic-output-legibility/SPEC.md) | TK-001: Group and count `doctor` findings by consequence and lower the prominence of `blocks: none` findings, with the registry pinned by test (ready) | unassigned | none | Spec captured from upstream item UP-019; the report's proposed remedy was found already implemented, and the spec is rescoped to the part that is still live. | Claim TK-001 and pin the current output shape red. |
| [S-044](workbench/specs/S-044-legacy-room-classification/SPEC.md) | TK-001: Report every missing or unfilled control in one preflight result, with the reconcile order and the template-overwrite warning (ready) | unassigned | none | Spec captured from upstream items UP-022 and UP-023; both re-verified against `b3633e5`, and the preflight was found to fail on the first missing control rather than naming all of them. | Claim TK-001 and reproduce the first-control-only refusal red. |
<!-- hot-specs:end -->

## Owner Decisions

Owner decisions and blockers live in their assigned specs and appear in the
generated projection above. This section adds no separate decision store.

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
| [S-029](workbench/specs/S-029-declared-integration-branch/SPEC.md) | TK-002: Reconcile template and root controls, Genesis and Adoption skills, completion boxes for commit and branch, Runbook closeout prune (ready) | claude-fable-5-1 | TK-001 | TK-001 closed with proof. | Complete TK-002. |
| [S-035](workbench/specs/S-035-workbench-v3-1-2-candidate/SPEC.md) | TK-001: Stamp v3.1.2 on every version-bearing surface, extend `supportedLegacy`, re-measure the guardrail, and write the final disposition table (ready) | unassigned | S-029, S-030, S-031, S-032, S-033, S-034 | Spec captured; the version stamp waits on S-029 through S-034. | Complete S-029 through S-034, then claim TK-001. |
| [S-030](workbench/specs/S-030-permission-scope-matches-lanes/SPEC.md) | TK-001: Template permission file and README grant the authorship lanes with Edit and Write; protocol wording and completion boxes updated (ready) | unassigned | none | Spec captured from upstream fix-list item UP-012. | Claim TK-001 and prove the template grants every authorship lane. |
| [S-031](workbench/specs/S-031-installed-skill-generation/SPEC.md) | TK-001: Schema 2 marker from installer and upgrade; `stale-skill` and `skill-generation-unknown` in doctor with `--home` (ready) | unassigned | none | Spec captured from upstream fix-list items UP-002 and UP-010 and the acceptance report finding F-005. | Claim TK-001 and prove a stale marker is reported red then green. |
| [S-032](workbench/specs/S-032-upgrade-route-and-source-provenance/SPEC.md) | TK-001: `init` and `migrate` resolve or demand the source commit; usage and Genesis Phase 6 updated (ready) | unassigned | none | Spec captured from upstream fix-list items UP-003 and UP-004 after re-reading the upgrade tool. | Claim TK-001 and prove `init` resolves or demands the source commit. |
| [S-034](workbench/specs/S-034-control-fidelity-report/SPEC.md) | TK-001: `control-fidelity.mjs report` with line classification, version labeling, JSON and Markdown output, and a fixture that drops one qualifier (ready) | unassigned | none | Spec captured from upstream fix-list item UP-008. | Claim TK-001 and prove a dropped qualifier is reported. |
| [S-033](workbench/specs/S-033-silent-gap-diagnostics/SPEC.md) | TK-001: `room-brain-unrouted` in doctor with a fixture whose controls omit the route (ready) | unassigned | none | Spec captured from upstream fix-list item UP-009 and the S-027 review findings P3-1 and P3-3. | Claim TK-001 and prove an unrouted room brain is reported. |
<!-- hot-specs:end -->

## Owner Decisions

Owner decisions and blockers live in their assigned specs and appear in the
generated projection above. This section adds no separate decision store.

# LLM Workbench - Hot Taskboard

**Current focus:** S-014/TK-001 is reconciling main ancestry on a verified feature branch before independent audit and integration review.
**Owner:** Kayden (executive); agents execute assigned slices
**Last updated:** 2026-07-16

This dashboard contains current execution state only. Use
`node tools/spec-workbench.mjs next` to select work and `show S-###` to load its
requirements. Durable requirements, decisions, acceptance criteria, and proof
live in the linked spec. Commands live in `RUNBOOK.md`.

## Active Specs

<!-- hot-specs:start -->
| Spec | Current slice | Owner | Blocker | Latest meaningful event | Next gate |
|---|---|---|---|---|---|
| [S-014](specs/S-014-workbench-release-candidate/SPEC.md) | TK-001: Reconcile main ancestry into integration through an audited merge PR (in-progress) | codex-engineer | none | TK-001 ancestry-only merge candidate is fully verified; remote checkpoint and independent audit remain. | Independently audit the pushed PR #31 checkpoint, then complete integration review; TK-001 remains in progress. |
| [S-011](specs/S-011-agent-skills-adoption/SPEC.md) | TK-003: Verify rewritten skills in fresh Claude and Codex sessions and prepare downstream distribution (blocked) | codex | Owner Claude authentication | TK-009 exact-head delivery audit repair passed. | Complete TK-003. |
<!-- hot-specs:end -->

## Owner Decisions

No open owner decisions. New decisions stay here only while they block an
active spec; the resolved decision moves into that spec.

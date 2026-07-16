# LLM Workbench - Hot Taskboard

**Current focus:** No active spec; S-013 completed with verified automation run-outcome proof.
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
| [S-011](specs/S-011-agent-skills-adoption/SPEC.md) | TK-009: Rewrite and promote pending `implement` and `code-review` as the next delivery-flow pair (ready) | codex | none | The 30-skill owner catalog is preserved, while 19 unfinished imports are fail-closed outside live discovery pending Workbench rewrites. | Rewrite and promote the first pending delivery pair under TK-009; Kayden authentication remains the separate Claude runtime gate. |
<!-- hot-specs:end -->

## Owner Decisions

No open owner decisions. New decisions stay here only while they block an
active spec; the resolved decision moves into that spec.

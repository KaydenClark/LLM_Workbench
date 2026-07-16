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
| [S-011](specs/S-011-agent-skills-adoption/SPEC.md) | TK-003: Verify rewritten skills in fresh Claude and Codex sessions and prepare downstream distribution (blocked) | codex | Owner Claude authentication | Fresh Codex discovery passed for the expanded 30-skill catalog; Claude remains blocked before skill loading by owner authentication. | Kayden authenticates Claude, then rerun the non-persistent Claude discovery probes and complete TK-003. |
<!-- hot-specs:end -->

## Owner Decisions

No open owner decisions. New decisions stay here only while they block an
active spec; the resolved decision moves into that spec.

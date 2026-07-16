# LLM Workbench - Hot Taskboard

**Current focus:** S-006 - verify and activate the Terra/Sol feedback schedules.
**Owner:** Kayden (executive); agents execute assigned slices
**Last updated:** 2026-07-13

This dashboard contains current execution state only. Use
`node tools/spec-workbench.mjs next` to select work and `show S-###` to load its
requirements. Durable requirements, decisions, acceptance criteria, and proof
live in the linked spec. Commands live in `RUNBOOK.md`.

## Active Specs

<!-- hot-specs:start -->
| Spec | Current slice | Owner | Blocker | Latest meaningful event | Next gate |
|---|---|---|---|---|---|
| [S-011](specs/S-011-agent-skills-adoption/SPEC.md) | TK-003: Verify rewritten skills in fresh Claude and Codex sessions and prepare downstream distribution (blocked) | codex | Owner Claude authentication | TK-007 closed with callable Genesis, one-time Adoption, and routine update routing separated. | Rerun fresh Codex and Claude discovery for the 30-skill catalog; Claude remains an owner-auth gate. |
<!-- hot-specs:end -->

## Owner Decisions

No open owner decisions. New decisions stay here only while they block an
active spec; the resolved decision moves into that spec.

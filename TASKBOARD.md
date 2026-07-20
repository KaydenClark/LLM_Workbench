# LLM Workbench - Hot Taskboard

**Current focus:** S-014/TK-002 remains in progress with REQUEST CHANGES: independently audit the escaped-table parser repair before restarting release evidence work.
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
| [S-014](specs/S-014-workbench-release-candidate/SPEC.md) | TK-002: Coordinate separate exact-head audit and evidence publication tasks (in-progress) | Captain (TK-002 coordination) | current-main ancestry drift; current integration is unaudited | PR #33 merged, but later main and integration movement invalidated the historical candidate. | Scope and assign a new independently reviewed current-main reconciliation into integration; then assign a separate Auditor for the resulting exact integration SHA. |
| [S-011](specs/S-011-agent-skills-adoption/SPEC.md) | TK-003: Verify rewritten skills in fresh Claude and Codex sessions and prepare downstream distribution (blocked) | codex | Fresh Claude skill-discovery proof is absent | Claude authentication is live; prior non-persistent discovery invocation supplied no prompt and cannot prove skill discovery. | Capture and record a valid fresh Claude Code discovery result without changing credentials or claiming unavailable skills. |
<!-- hot-specs:end -->

## Owner Decisions

No open owner decisions. New decisions stay here only while they block an
active spec; the resolved decision moves into that spec.

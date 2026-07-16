# LLM Workbench - Hot Taskboard

**Current focus:** S-014/TK-002 is in progress under Captain: run one read-only Auditor task, then a separate Engineer Publisher task only after PASS.
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
| [S-014](specs/S-014-workbench-release-candidate/SPEC.md) | TK-002: Coordinate separate exact-head audit and evidence publication tasks (in-progress) | Captain (TK-002 coordination) | none | TK-002 authority is split into separate read-only Auditor and Engineer Publisher tasks under Captain coordination. | Land this final docs-only transition; Captain then assigns the exact integration audit, and only a PASS may trigger a separate Engineer task to publish unchanged evidence and status. |
| [S-011](specs/S-011-agent-skills-adoption/SPEC.md) | TK-003: Verify rewritten skills in fresh Claude and Codex sessions and prepare downstream distribution (blocked) | codex | Owner Claude authentication | TK-009 exact-head delivery audit repair passed. | Complete TK-003. |
<!-- hot-specs:end -->

## Owner Decisions

No open owner decisions. New decisions stay here only while they block an
active spec; the resolved decision moves into that spec.

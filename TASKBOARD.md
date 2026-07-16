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
| [S-014](specs/S-014-workbench-release-candidate/SPEC.md) | TK-002: Coordinate separate exact-head audit and evidence publication tasks (in-progress) | Captain (TK-002 coordination) | parser repair audit | The TK-002 audit rejected exact integration `bb5d9c1`; an Engineer parser repair is under review. | Independently audit the parser-repair PR exact head; only a green merged integration head may restart the TK-002 Auditor/Publisher gate. |
| [S-011](specs/S-011-agent-skills-adoption/SPEC.md) | TK-003: Verify rewritten skills in fresh Claude and Codex sessions and prepare downstream distribution (blocked) | codex | Owner Claude authentication | TK-009 exact-head delivery audit repair passed. | Complete TK-003. |
<!-- hot-specs:end -->

## Owner Decisions

No open owner decisions. New decisions stay here only while they block an
active spec; the resolved decision moves into that spec.

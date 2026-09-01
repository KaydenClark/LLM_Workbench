# LLM Workbench - Hot Taskboard

**Current focus:** S-021/TK-001 is the sole eligible slice; S-011 is blocked pending supersession and S-014 is blocked until the v3 integration candidate exists.
**Owner:** unassigned
**Last updated:** 2026-08-31

This dashboard contains current execution state only. Use
`node tools/spec-workbench.mjs next` to select work and `show S-###` to load its
requirements. Durable requirements, decisions, acceptance criteria, and proof
live in the linked spec. Commands live in `RUNBOOK.md`.

## Active Specs

<!-- hot-specs:start -->
| Spec | Current slice | Owner | Blocker | Latest meaningful event | Next gate |
|---|---|---|---|---|---|
| [S-014](workbench/specs/S-014-workbench-release-candidate/SPEC.md) | TK-003: Open the sole non-draft integration-to-main owner promotion PR (ready) | unassigned | TK-002 | Live refs now satisfy main ancestry, but owner-approved S-021 intentionally makes integration mutable again and invalidates any pre-v3 candidate. | Complete S-021 on integration, then resume TK-002 against that exact immutable integration SHA. |
| [S-021](workbench/specs/S-021-portable-workbench-v3/SPEC.md) | TK-006: LLM Workbench dogfoods v3, completes the fresh/cold acceptance matrix, and hands the exact integration candidate back to S-014 (in-progress) | codex | TK-005 | TK-006 claimed by codex. | Close TK-006 with verification and documentation proof. |
<!-- hot-specs:end -->

## Owner Decisions

No open owner decisions. New decisions stay here only while they block an
active spec; the resolved decision moves into that spec.

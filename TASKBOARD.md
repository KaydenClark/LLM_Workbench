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
| [S-014](specs/S-014-workbench-release-candidate/SPEC.md) | TK-003: Open the sole non-draft integration-to-main owner promotion PR (ready) | unassigned | TK-002 | Live refs now satisfy main ancestry, but owner-approved S-021 intentionally makes integration mutable again and invalidates any pre-v3 candidate. | Complete S-021 on integration, then resume TK-002 against that exact immutable integration SHA. |
| [S-021](specs/S-021-portable-workbench-v3/SPEC.md) | TK-004: An explicitly requested v2 upgrade backs up changed skills, synchronizes the core, migrates legacy paths once, and proves rollback (in-progress) | codex | TK-003 | TK-004 claimed by codex. | Close TK-004 with verification and documentation proof. |
| [S-011](specs/S-011-agent-skills-adoption/SPEC.md) | TK-003: Verify rewritten skills in fresh Claude and Codex sessions and prepare downstream distribution (blocked) | unassigned | Fresh Claude skill-discovery proof is absent | S-021 was accepted as this spec's successor; S-011 is blocked from further execution while its implementation evidence remains intact. | Complete S-021, then mark S-011 superseded without reopening TK-003. |
<!-- hot-specs:end -->

## Owner Decisions

No open owner decisions. New decisions stay here only while they block an
active spec; the resolved decision moves into that spec.

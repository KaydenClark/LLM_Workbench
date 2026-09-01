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
| [S-014](workbench/specs/S-014-workbench-release-candidate/SPEC.md) | TK-003: Open the sole non-draft integration-to-main owner promotion PR (ready) | codex | TK-002 | Independent Auditor `/root/s014_auditor` returned `REQUEST CHANGES` on exact candidate `d80d14c` with two P1 v3 readiness defects and one P2 limitation-count defect; no release evidence, status, or promotion PR was published. | Complete and land S-015, resolve the new exact `origin/integration` SHA, then repeat TK-002's separate immutable audit. |
| [S-015](workbench/specs/S-015-portable-v3-release-audit-recovery/SPEC.md) | TK-001: A cold Genesis project gets only manifest-routed controls and fails closed unless its controls and first spec are operable (in-progress) | codex | none | TK-001 claimed by codex. | Close TK-001 with verification and documentation proof. |
<!-- hot-specs:end -->

## Owner Decisions

No open owner decisions. New decisions stay here only while they block an
active spec; the resolved decision moves into that spec.

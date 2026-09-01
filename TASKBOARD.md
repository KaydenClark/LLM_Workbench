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
| [S-014](workbench/specs/S-014-workbench-release-candidate/SPEC.md) | TK-003: Open the sole non-draft integration-to-main owner promotion PR (ready) | unassigned | TK-002 | S-021 has completed its portable v3 proof and hands the next integration candidate to this release gate; no release status or promotion PR was created. | After S-021 lands, resolve and pin the resulting exact `origin/integration` SHA, then resume TK-002's separate immutable audit. |
<!-- hot-specs:end -->

## Owner Decisions

No open owner decisions. New decisions stay here only while they block an
active spec; the resolved decision moves into that spec.

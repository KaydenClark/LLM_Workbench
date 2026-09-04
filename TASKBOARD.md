# LLM Workbench - Hot Taskboard

**Current focus:** S-021/TK-001 is the sole eligible slice; S-011 is blocked pending supersession and S-014 is blocked until the v3 integration candidate exists.
**Owner:** unassigned
**Last updated:** 2026-08-31

This dashboard contains current execution state only. Use
`node workbench/tools/spec-workbench.mjs next` to select work and `show S-###` to load its
requirements. Durable requirements, decisions, acceptance criteria, and proof
live in the linked spec. Commands live in `RUNBOOK.md`.

## Active Specs

<!-- hot-specs:start -->
| Spec | Current slice | Owner | Blocker | Latest meaningful event | Next gate |
|---|---|---|---|---|---|
| [S-014](workbench/specs/S-014-workbench-release-candidate/SPEC.md) | TK-003: Open the sole non-draft integration-to-main owner promotion PR (ready) | codex | TK-002 | S-015 completed and landed on `integration` at `dd6fe03` after an independent PASS on `1c621b9`; the owner directed that v3.0.0 stay an unreleased internal candidate and that v3.1.0 be the first public v3 release. | Wait for the v3.1 umbrella (S-022) to land its audited exact candidate on `integration`, then repeat TK-002's separate immutable audit on that SHA. |
| [S-022](workbench/specs/S-022-llm-workbench-v3-1-release/SPEC.md) | TK-002: Prove the primary acceptance round trip: planning checkpoint, forced interruption, cross-provider clean-clone resume with Foundry absent (ready) | claude-fable-5-1 | S-023, S-024, S-025, S-026 | Planning checkpoint promoted; TK-001 recorded as done with the pushed checkpoint as proof. | Complete S-023, S-024, S-025, and S-026, then run TK-002 on the exact candidate. |
| [S-026](workbench/specs/S-026-workflow-composition-and-cold-resume/SPEC.md) | TK-002: Feedback lives in the feedback lane, discovery prefers it, Adoption relocates a root file, and the root keeps exactly seven controls (ready) | claude-fable-5-1 | TK-001 | TK-001 closed with proof. | Complete TK-002. |
<!-- hot-specs:end -->

## Owner Decisions

No open owner decisions. New decisions stay here only while they block an
active spec; the resolved decision moves into that spec.

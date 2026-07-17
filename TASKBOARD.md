# LLM Workbench - Hot Taskboard

**Current focus:** S-017/TK-003 is the smallest safe no-spend Engineer slice; S-018, S-011, and S-020 also have independent ready work.
**Owner:** Kayden (executive); agents execute assigned slices
**Last updated:** 2026-07-17

This dashboard contains current execution state only. Use
`node tools/spec-workbench.mjs next` to select work and `show S-###` to load its
requirements. Durable requirements, decisions, acceptance criteria, and proof
live in the linked spec. Commands live in `RUNBOOK.md`.

## Active Specs

<!-- hot-specs:start -->
| Spec | Current slice | Owner | Blocker | Latest meaningful event | Next gate |
|---|---|---|---|---|---|
| [S-017](specs/S-017-controlled-outcome-measurement/SPEC.md) | TK-003: Aggregate multiple tasks into an uncertainty-aware no-spend report (in-progress) | codex-engineer | none | TK-003 final Auditor finding removed the legacy `suite` fallback from claim eligibility. | Push the final remediated TK-003 checkpoint and rerun the exact-head Auditor before close. |
| [S-018](specs/S-018-versioned-delivery-rollout/SPEC.md) | TK-002: Define the deterministic release-manifest schema and non-skill package inputs (ready) | unassigned | none | Auditor remediation replaced the cross-spec ticket deadlock with a supported dependency on completed S-011. | Claim TK-002 and define the deterministic release manifest before changing release automation. |
| [S-011](specs/S-011-agent-skills-adoption/SPEC.md) | TK-011: Rewrite the domain and interface design pack (ready) | codex | none | Auditor remediation made S-011 own its skill-component schema and removed the unsupported cross-spec ticket blocker. | Claim TK-011; TK-003 remains independently owner-blocked. |
| [S-020](specs/S-020-spec-native-team-coordination/SPEC.md) | TK-001: Rewrite the manager template around Captain, roles, one owning spec, and one writer (ready) | unassigned | none | Canon harvest identified the tracked team templates as contradictory to the v2.3 spec lifecycle. | Claim TK-001 and replace the manager contract without changing runtime tooling. |
<!-- hot-specs:end -->

## Owner Decisions

- **S-011/TK-003:** Kayden authenticates Claude before the final cross-agent
  discovery proof. This does not block TK-011 through TK-015.
- **S-017/TK-004:** after TK-003 proves the no-spend reporting seam, Kayden
  approves or declines the bounded model/API trial budget.

Resolved decisions move into their owning specs; this section remains a hot
projection rather than a durable decision archive.

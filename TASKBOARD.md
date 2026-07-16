# LLM Workbench - Hot Taskboard

**Current focus:** S-014/TK-002 is in progress: finish the final docs-only integration transition, then independently audit and status the resulting exact candidate SHA.
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
| [S-014](specs/S-014-workbench-release-candidate/SPEC.md) | TK-002: Audit exact integration and publish the evidence-bound release-gate status (in-progress) | Auditor TK-002 | none | TK-001 completed through audited PR #31 at exact head `490ad58`; merge `a9fb9f9` landed the ancestry reconciliation on integration. | Land this final docs-only transition, then independently audit the resulting exact `origin/integration` SHA and publish its evidence-bound release status without moving the candidate. |
| [S-011](specs/S-011-agent-skills-adoption/SPEC.md) | TK-003: Verify rewritten skills in fresh Claude and Codex sessions and prepare downstream distribution (blocked) | codex | Owner Claude authentication | TK-009 exact-head delivery audit repair passed. | Complete TK-003. |
<!-- hot-specs:end -->

## Owner Decisions

No open owner decisions. New decisions stay here only while they block an
active spec; the resolved decision moves into that spec.

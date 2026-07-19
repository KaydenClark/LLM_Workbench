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
| [S-017](specs/S-017-controlled-outcome-measurement/SPEC.md) | TK-005: Record the bounded release claim or inconclusive result in the evidence ledger (blocked) | codex-engineer | TK-004 | Kayden declined paid Workbench model trials for now; the no-spend apparatus remains available. | Revisit a preregistered run plan only after Kayden explicitly reopens paid trials. |
| [S-018](specs/S-018-versioned-delivery-rollout/SPEC.md) | TK-003: Fail closed on release tree, ancestry, merge-mode, or exact-status drift (blocked) | codex-engineer | TK-002 | TK-002 closed with proof. | Complete TK-003. |
| [S-022](specs/S-022-thinking-decision-skill-family/SPEC.md) | TK-001: Extract non-invocable `notepad` primitive skill (format + Issue mechanics + lifecycle); point `grilling` at it, behavior unchanged (ready) | claude | none | Promoted from the 2026-07-19 grilling+domain-modeling session (notepad `.agents/grilling diary/skill-family-refactor-2026-07-19.md`) on top of preserved codex phase-1 (commit 6965a32). | Claim TK-001 (notepad primitive) — the foundation the other slices reference. |
| [S-011](specs/S-011-agent-skills-adoption/SPEC.md) | TK-011: Rewrite the domain and interface design pack (ready) | codex | none | The grilling-family redesign added an always-on interview notepad and explicit `/make-it-so` and `/checkpoint` exits while preserving S-011's skill-component schema boundary. | Claim TK-011; TK-003 remains independently owner-blocked. |
| [S-020](specs/S-020-spec-native-team-coordination/SPEC.md) | TK-001: Rewrite the manager template around Captain, roles, one owning spec, and one writer (ready) | unassigned | none | Canon harvest identified the tracked team templates as contradictory to the v2.3 spec lifecycle. | Claim TK-001 and replace the manager contract without changing runtime tooling. |
<!-- hot-specs:end -->

## Owner Decisions

No unresolved owner choice currently blocks an active Workbench spec. Kayden
approved the bounded Claude authentication/discovery proof for S-011/TK-003;
that interactive sign-in remains an owner action. Kayden declined paid model
trials for S-017/TK-004, which is now deferred until explicitly reopened.

Resolved decisions move into their owning specs; this section remains a hot
projection rather than a durable decision archive.

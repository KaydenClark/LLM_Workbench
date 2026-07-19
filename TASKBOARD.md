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
| [S-022](specs/S-022-thinking-decision-skill-family/SPEC.md) | TK-001: Extract non-invocable `notepad` primitive skill (format + Issue mechanics + lifecycle); point `grilling` at it, behavior unchanged (in-progress) | claude | none | Reconciliation slice complete and GREEN — grilling rewired to `/notepad`, `/checkpoint` deleted and its skill-references swept (grilling/brainstorm/catalog/test), catalog reconciled to 35 skills (23 active / 12 pending, promoting wayfinder/prototype/research from pending and fixing codex's leftover domain-modeling Pending/Active drift), and the guard test `tools/test-skill-catalog.mjs` re-pointed to the new contract. `test-skill-catalog`, `test-spec-workbench`, render, and doctor all pass. | Close gate — run `/code-review` against the pushed range and the full `RUNBOOK.md` verification suite, then close TK-001/003/004/005/006. TK-002's root `LEXICON.md` `Checkpoint`→`save` rename is deferred pending a decision: "checkpoint" is pervasive as the truthful-in-progress-commit concept (used in implement/save-work/AGENTS and required by the implement test), so renaming the concept is broader than the skill deletion and needs its own call. |
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

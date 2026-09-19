---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed per-Spec reconciliation, 2026-09-19
source_paths:
  - workbench/specs/S-027-workbench-v3-1-1-boundaries/SPEC.md
  - AGENTS.md
  - RUNBOOK.md
  - LEXICON.md
  - skills/builder/SKILL.md
  - skills/auditor/SKILL.md
  - skills/reviewer/SKILL.md
  - skills/reconciler/SKILL.md
  - tools/test-governance-core.mjs
  - tools/test-branch-closeout.mjs
  - tools/test-workbench-tools.mjs
  - tools/test-workbench-adoption.mjs
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# Assigned Work, Portable Stances And Delivery Boundaries

The normal entry route is `AGENTS.md -> RUNBOOK.md -> LEXICON.md`, followed
by the assigned capability and only its relevant context. The Blueprint is
loaded for architecture and product direction. An agent investigates missing
information inside its assignment and does not invent a new queue item merely
because it reaches a gap.

Builder, Auditor, Reviewer and Reconciler are behavior stances. The assigned
Spec and Task choose the stance; each skill states its purpose, method,
obligations and exit condition. Loading one changes neither authority nor
ownership, starts no subagent and requires no new handoff. Their portable
sources are flat directories. Current skill ownership and update rules govern
installation; historical observations of the owner's home are not current
installation proof.

S-027 ordered setup proof before feedback reporting. A read-only Round One
returns its setup result in chat. A later report uses the feedback lane,
names its inspected source and evidence, and leaves repair to an authorized
assignment. Fresh continuation should find the existing output and next
bounded action without manufacturing a parallel tracker.

Delivery continues through exact-candidate independent integration review,
merge and containment verification. A push makes work recoverable; it does not
by itself deliver it. Branch cleanup verifies both reviewed and actual tips,
respects owner deferral, and uses the worktree-safe Runbook procedure. Main
promotion remains owner-only.

This broad historical candidate also repaired unsafe update/rollback links,
ignore-rule loss, linked write destinations and legacy Wiki adoption. Those
mechanisms now live in their source and tests. Its recorded setup,
continuation and integration results are dated proof, not a fresh provider
session or repeated real-work comparison. Old twelve-skill counts, foreign-root
refusals and external branch inventories must not be read as today's state.

## Evidence and Sources

- [Historical S-027 record](../../specs/S-027-workbench-v3-1-1-boundaries/SPEC.md). Original decisions, corrections, evidence and limitations remain preserved.
- [Immutable source and proof at `7f314af`](https://github.com/KaydenClark/LLM_Workbench/blob/7f314af2bd9ad8693ed570912568180acd742779/workbench/specs/S-027-workbench-v3-1-1-boundaries/SPEC.md). Recover the original with `git show 7f314af2bd9ad8693ed570912568180acd742779:workbench/specs/S-027-workbench-v3-1-1-boundaries/SPEC.md`.
- [AGENTS.md](../../../AGENTS.md) — current owning source or verification seam.
- [RUNBOOK.md](../../../RUNBOOK.md) — current owning source or verification seam.
- [LEXICON.md](../../../LEXICON.md) — current owning source or verification seam.
- [skills/builder/SKILL.md](../../../skills/builder/SKILL.md) — current owning source or verification seam.
- [skills/auditor/SKILL.md](../../../skills/auditor/SKILL.md) — current owning source or verification seam.
- [skills/reviewer/SKILL.md](../../../skills/reviewer/SKILL.md) — current owning source or verification seam.
- [skills/reconciler/SKILL.md](../../../skills/reconciler/SKILL.md) — current owning source or verification seam.
- [tools/test-governance-core.mjs](../../../tools/test-governance-core.mjs) — current owning source or verification seam.
- [tools/test-branch-closeout.mjs](../../../tools/test-branch-closeout.mjs) — current owning source or verification seam.
- [tools/test-workbench-tools.mjs](../../../tools/test-workbench-tools.mjs) — current owning source or verification seam.
- [tools/test-workbench-adoption.mjs](../../../tools/test-workbench-adoption.mjs) — current owning source or verification seam.

## History

- 2026-09-19: Created on owner direction as one article for this legacy Spec after reading its full record and checking named live sources. Evolved or superseded claims are identified explicitly. No Spec was moved, retired or discarded, and no retrospective Human QA is asserted.

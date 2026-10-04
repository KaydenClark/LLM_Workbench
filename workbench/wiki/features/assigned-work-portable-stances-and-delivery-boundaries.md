---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed per-Spec reconciliation, 2026-09-19
  - Moved into the features collection and restructured as a feature article by Wiki Evolving-Synthesis Migration (S-003W) Task TK-002 (Move And Retype The Remaining Per-Spec Articles) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-027-workbench-v3-1-1-boundaries/SPEC.md
  - AGENTS.md
  - RUNBOOK.md
  - LEXICON.md
  - workbench/skills/builder/SKILL.md
  - workbench/skills/auditor/SKILL.md
  - workbench/skills/reviewer/SKILL.md
  - workbench/skills/reconciler/SKILL.md
  - tools/test-governance-core.mjs
  - tools/test-branch-closeout.mjs
  - tools/test-workbench-tools.mjs
  - tools/test-workbench-adoption.mjs
last_verified: 2026-10-04
---

# Assigned Work, Portable Stances And Delivery Boundaries

An agent enters through a fixed route, works inside its assignment under a
portable stance, and delivers through independent review and verified
containment rather than stopping at a push. The
Workbench Boundaries Spec (S-027) for v3.1.1 delivered these boundaries,
together with several repairs to update, rollback and adoption behavior.

## What It Does

- **Entry route.** The normal entry route is
  `AGENTS.md -> RUNBOOK.md -> LEXICON.md`, followed by the assigned capability
  and only its relevant context. The Blueprint is loaded for architecture and
  product direction. An agent investigates missing information inside its
  assignment and does not invent a new queue item merely because it reaches a
  gap.
- **Portable stances.** Builder, Auditor, Reviewer and Reconciler are behavior
  stances. The assigned Spec and Task choose the stance; each skill states its
  purpose, method, obligations and exit condition. Loading one changes neither
  authority nor ownership, starts no subagent and requires no new handoff.
  Their portable sources are flat directories.
- **Setup proof before feedback.** A read-only Round One returns its setup
  result in chat. A later report uses the feedback lane, names its inspected
  source and evidence, and leaves repair to an authorized assignment. Fresh
  continuation should find the existing output and next bounded action without
  manufacturing a parallel tracker.
- **Delivery boundaries.** Delivery continues through exact-candidate
  independent integration review, merge and containment verification. A push
  makes work recoverable; it does not by itself deliver it. Branch cleanup
  verifies both reviewed and actual tips, respects owner deferral, and uses the
  worktree-safe Runbook procedure. Main promotion remains owner-only.
- **Repairs in the same candidate.** The broad historical candidate also
  repaired unsafe update and rollback links, ignore-rule loss, linked write
  destinations and legacy Wiki adoption.

## Why It Matters

A fixed entry route, a stance that changes behavior without changing authority,
and a delivery sequence that counts only reviewed and contained work keep
assigned work bounded and keep a pushed branch from being mistaken for
delivered work.

## Limits

- Current skill ownership and update rules govern installation; historical
  observations of the owner's home are not current installation proof.
- The repair mechanisms now live in their source and tests. The recorded setup,
  continuation and integration results are dated proof, not a fresh provider
  session or repeated real-work comparison.
- Old twelve-skill counts, foreign-root refusals and external branch
  inventories must not be read as today's state.

## Evidence and Sources

- [Historical Workbench Boundaries Spec (S-027) for v3.1.1](../../specs/S-027-workbench-v3-1-1-boundaries/SPEC.md). Original decisions, corrections, evidence and limitations remain preserved; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `7f314af`](https://github.com/KaydenClark/LLM_Workbench/blob/7f314af2bd9ad8693ed570912568180acd742779/workbench/specs/S-027-workbench-v3-1-1-boundaries/SPEC.md). Recover the original with `git show 7f314af2bd9ad8693ed570912568180acd742779:workbench/specs/S-027-workbench-v3-1-1-boundaries/SPEC.md`.
- [AGENTS.md](../../../AGENTS.md), [RUNBOOK.md](../../../RUNBOOK.md) and [LEXICON.md](../../../LEXICON.md) - the entry route and the controls that own the boundaries.
- [workbench/skills/builder/SKILL.md](../../skills/builder/SKILL.md), [workbench/skills/auditor/SKILL.md](../../skills/auditor/SKILL.md), [workbench/skills/reviewer/SKILL.md](../../skills/reviewer/SKILL.md) and [workbench/skills/reconciler/SKILL.md](../../skills/reconciler/SKILL.md) - the four portable stances.
- [tools/test-governance-core.mjs](../../../tools/test-governance-core.mjs), [tools/test-branch-closeout.mjs](../../../tools/test-branch-closeout.mjs), [tools/test-workbench-tools.mjs](../../../tools/test-workbench-tools.mjs) and [tools/test-workbench-adoption.mjs](../../../tools/test-workbench-adoption.mjs) - the verification seams.

## History

- 2026-09-19: Created on owner direction as one article for this legacy Spec after reading its full record and checking named live sources. Evolved or superseded claims are identified explicitly. No Spec was moved, retired or discarded, and no retrospective Human QA is asserted.
- 2026-09-30: Repaired live skill links and source_paths after relocation to workbench/skills; verified destinations only, without revalidating historical capability claims.
- 2026-10-04: Moved from `design-concepts/spec-S-027-workbench-v3-1-1-boundaries.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Wiki Evolving-Synthesis Migration Spec (S-003W) Task TK-002 (Move And Retype The Remaining Per-Spec Articles). Every live link to it was rewritten by the move; no claim was changed. This move checked that the named source paths and the immutable commit exist, not the behavior of the capability itself.

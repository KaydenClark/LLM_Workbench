---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed one-article-per-Spec migration, 2026-09-19
  - Moved into the features collection and restructured as a feature article by Wiki Evolving-Synthesis Migration (S-003W) Task TK-002 (Move And Retype The Remaining Per-Spec Articles) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-026-workflow-composition-and-cold-resume/SPEC.md
  - workbench/tools/sessions.mjs
  - workbench/tools/notepads.mjs
  - tools/test-workbench-round-trip.mjs
  - tools/test-sessions.mjs
  - tools/test-direct-promotion.mjs
  - workbench/skills/make-it-so/SKILL.md
  - workbench/skills/promote/SKILL.md
  - RUNBOOK.md
last_verified: 2026-10-04
---

# Workflow Composition And Cold Continuation

A composed workflow carries planning into implementation without depending on
the original chat, and a fresh agent can resume from repository evidence alone.
The Workflow Composition, Feedback Lane, And Cold Resume Spec (S-026) delivered
the continuation model and its tested mechanical seams.

## What It Does

- **Continuation route.** Controls, the assigned Spec and Tasks, linked
  knowledge, named verification and a recoverable Git commit provide the
  continuation route. Skills resolve support paths through the manifest rather
  than importing private directory assumptions.
- **Round-trip fixture.** The deterministic fixture generates a project, records
  and pushes planning state, interrupts the run and resumes from a fresh clone
  using repository evidence. It tests files, commands and recoverability
  together.
- **Current continuity handling.** `sessions.mjs` now refuses new checkpoint
  copies; promote reconciles selected supported claims into existing durable
  owners after validation, while live JSON notepads retain unresolved context.
- **Feedback lane.** Feedback has its manifest lane; the Runbook owns the
  operational route.
- **Visible failures.** Privacy and structural checks fail visibly.

## Why It Matters

The durable knowledge is the continuation model and tested mechanical seams;
current assignments and approvals remain with work owners. Schedulers and
Foundry coordination are not prerequisites.

## Limits

- The fixture is provider-free: it does not prove actual cross-agent or
  cross-device comprehension.
- The Spec originally copied privacy-checked notes into tracked checkpoints.
  That mechanism is historical. A Git planning commit called a checkpoint in
  test prose does not revive the retired note-copy command.
- Optional private transport and configured-host capabilities require their
  own actual proof. The original real cross-provider follow-up belonged to the
  LLM Workbench Release Spec (S-022); later private and cross-device proof
  belongs separately to the Private Session Transport Spec (S-052). Neither
  reference asserts current completion.
- Privacy and structural checks cannot certify semantic fidelity, permission or
  reliability by themselves.

## Evidence and Sources

- [Historical Workflow Composition, Feedback Lane, And Cold Resume Spec (S-026)](../../specs/S-026-workflow-composition-and-cold-resume/SPEC.md). The original acceptance and evidence retain their time and scope; its eventual retired route is named in this article's `source_paths`.
- Immutable source: `git show 8035b41831985581e41ca713e87c2511d3dbbcc4:workbench/specs/S-026-workflow-composition-and-cold-resume/SPEC.md`. Source inspection for this article used that same commit; the links below route a fresh verification, rather than asserting every historical behavior remains current.
- [workbench/tools/sessions.mjs](../../tools/sessions.mjs) - the session tool, now refusing new checkpoint copies.
- [workbench/tools/notepads.mjs](../../tools/notepads.mjs) - the notepad tool.
- [tools/test-workbench-round-trip.mjs](../../../tools/test-workbench-round-trip.mjs) - the deterministic round-trip fixture.
- [tools/test-sessions.mjs](../../../tools/test-sessions.mjs) and [tools/test-direct-promotion.mjs](../../../tools/test-direct-promotion.mjs) - the session and promotion verification seams.
- [workbench/skills/make-it-so/SKILL.md](../../skills/make-it-so/SKILL.md) and [workbench/skills/promote/SKILL.md](../../skills/promote/SKILL.md) - the composed-workflow skills.
- [RUNBOOK.md](../../../RUNBOOK.md) - the operations route, including feedback.

## History

- 2026-09-19: Created on explicit owner direction for one article per legacy Spec. Preserved useful knowledge and historical limits; no source record retired or discarded.
- 2026-09-30: Repaired live skill links and source_paths after relocation to workbench/skills; verified destinations only, without revalidating historical capability claims.
- 2026-10-04: Moved from `design-concepts/spec-S-026-workflow-composition-and-cold-resume.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Wiki Evolving-Synthesis Migration Spec (S-003W) Task TK-002 (Move And Retype The Remaining Per-Spec Articles). Every live link to it was rewritten by the move; no claim was changed. This move checked that the named current source paths (the first entry names the Spec's eventual retired route, which does not exist yet) and the immutable commit exist, not the behavior of the capability itself.

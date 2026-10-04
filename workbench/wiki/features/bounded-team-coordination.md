---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed one-article-per-Spec migration, 2026-09-19
  - Moved into the features collection and restructured as a feature article by Wiki Evolving-Synthesis Migration (S-003W) Task TK-002 (Move and retype the remaining per-Spec articles) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-020-spec-native-team-coordination/SPEC.md
  - team templates/README.md
  - team templates/MANAGER.md
  - team templates/SUBAGENT.md
  - tools/team-coordination-demo.mjs
  - tools/test-team-coordination.mjs
  - tools/test-team-coordination-demo.mjs
last_verified: 2026-10-04
---

# Bounded Team Coordination

A small agent team can work concurrently when its assignments have disjoint edit
paths. The Spec-Native Team Coordination Spec (S-020) delivered optional team
templates and an overlap demonstration for a coordinator that partitions work,
receives proof and consolidates shared state once.

## What It Does

A coordinator partitions the assigned work, names each lane's output and
verification, receives proof, and consolidates shared state once. The optional
team templates describe a coordinator with one to three role tasks. Their
temporary assignment sheet is disposable run context, not another project
Taskboard. The owning Spec and Tasks carry delivery state and evidence; the
project Taskboard is derived. A single writer maintains shared Spec/projection
files. An investigator or reviewer does not gain write authority merely by
joining the team.

The overlap demonstration rejects conflicting paths and consolidates disjoint
results once.

## Why It Matters

The useful unit of independence is the file and dependency boundary: separate
worktrees preserve checkouts, but do not make competing edits to the same
runtime or control independent.

## Limits

- The Spec originally called its roles Captain, Planner, Engineer, Scout and
  Auditor. Those template names are historical vocabulary for the bounded-team
  model, not an override of current AGENTS.md stance assignments or
  authorization. Current root controls govern allowed delegation and the
  separate-context integration review.
- The templates are optional assistance, never a required coordination
  platform.
- The overlap demonstration is a deterministic contract example, not a locking
  service, scheduler or proof that unattended teams coordinate reliably. Its
  bounded scale is deliberate; broader orchestration needs its own authorized
  requirements.

## Evidence and Sources

- [Historical Spec-Native Team Coordination Spec (S-020)](../../specs/S-020-spec-native-team-coordination/SPEC.md). Original decisions, evidence and limitations remain preserved; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `8035b41`](https://github.com/KaydenClark/LLM_Workbench/blob/8035b41831985581e41ca713e87c2511d3dbbcc4/workbench/specs/S-020-spec-native-team-coordination/SPEC.md). The historical source is immutable and its acceptance and evidence retain their original time and scope; recover it with `git show 8035b41831985581e41ca713e87c2511d3dbbcc4:workbench/specs/S-020-spec-native-team-coordination/SPEC.md`.
- [team templates/README.md](../../../team%20templates/README.md), [team templates/MANAGER.md](../../../team%20templates/MANAGER.md) and [team templates/SUBAGENT.md](../../../team%20templates/SUBAGENT.md) - the optional team templates.
- [tools/team-coordination-demo.mjs](../../../tools/team-coordination-demo.mjs) - the overlap demonstration.
- [tools/test-team-coordination.mjs](../../../tools/test-team-coordination.mjs) and [tools/test-team-coordination-demo.mjs](../../../tools/test-team-coordination-demo.mjs) - the verification seams.

## History

- 2026-09-19: Created on explicit owner direction to give each legacy Spec its own Wiki article. Transformed useful knowledge and preserved historical limits; no source record was retired or discarded.
- 2026-10-04: Moved from `design-concepts/spec-S-020-spec-native-team-coordination.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Wiki Evolving-Synthesis Migration Spec (S-003W) Task TK-002 (Move and retype the remaining per-Spec articles). Every live link to it was rewritten by the move; no claim was changed.

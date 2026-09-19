---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed one-article-per-Spec migration, 2026-09-19
source_paths:
  - workbench/specs/S-020-spec-native-team-coordination/SPEC.md
  - team templates/README.md
  - team templates/MANAGER.md
  - team templates/SUBAGENT.md
  - tools/team-coordination-demo.mjs
  - tools/test-team-coordination.mjs
  - tools/test-team-coordination-demo.mjs
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# Bounded Team Coordination (S-020)

A small agent team can work concurrently when its assignments have disjoint edit paths. A coordinator partitions the assigned work, names each lane's output and verification, receives proof, and consolidates shared state once. The useful unit of independence is the file and dependency boundary: separate worktrees preserve checkouts, but do not make competing edits to the same runtime or control independent.

The optional team templates describe a coordinator with one to three role tasks. Their temporary assignment sheet is disposable run context, not another project Taskboard. The owning Spec and Tasks carry delivery state and evidence; the project Taskboard is derived. A single writer maintains shared Spec/projection files. An investigator or reviewer does not gain write authority merely by joining the team.

S-020 originally called its roles Captain, Planner, Engineer, Scout and Auditor. Those template names are historical vocabulary for the bounded-team model, not an override of current AGENTS stance assignments or authorization. Current root controls govern allowed delegation and the separate-context integration review. The templates are optional assistance, never a required coordination platform.

The overlap demonstration rejects conflicting paths and consolidates disjoint results once. This is a deterministic contract example, not a locking service, scheduler or proof that unattended teams coordinate reliably. Its bounded scale is deliberate; broader orchestration needs its own authorized requirements.

## Evidence and Sources

The historical source is immutable: `git show 8035b41831985581e41ca713e87c2511d3dbbcc4:workbench/specs/S-020-spec-native-team-coordination/SPEC.md`.
Its acceptance and evidence retain their original time and scope. Current source
and control inspection for this article used the same commit; linked files below
are the navigation route for a fresh verification.

- [team templates/README.md](../../../team%20templates/README.md)
- [team templates/MANAGER.md](../../../team%20templates/MANAGER.md)
- [team templates/SUBAGENT.md](../../../team%20templates/SUBAGENT.md)
- [tools/team-coordination-demo.mjs](../../../tools/team-coordination-demo.mjs)
- [tools/test-team-coordination.mjs](../../../tools/test-team-coordination.mjs)
- [tools/test-team-coordination-demo.mjs](../../../tools/test-team-coordination-demo.mjs)

## History

- 2026-09-19: Created on explicit owner direction to give each legacy Spec its own Wiki article. Transformed useful knowledge and preserved historical limits; no source record was retired or discarded.

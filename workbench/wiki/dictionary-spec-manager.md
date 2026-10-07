---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Spec Manager
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its third Wiki lexicon batch Task (TK-009J), 2026-10-07: the retiring Lexicon entry's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/skills/spec-manager/SKILL.md
last_verified: 2026-10-07
---

# Spec Manager: running a Spec's planned Tasks

Spec Manager is the stance that dispatches and monitors the planned Task groups of one Spec while they execute. The canonical definition is the [glossary entry](../../GLOSSARY.md#stance-terms).

**What it means here.** A Dispatcher manages safe parallel work, hand-backs and assembled verification, escalating cross-Spec coordination to the Director. Its operating capability is specified separately from Spec Planner.

**Neighbouring words.** It takes the plan from [Spec Planner](dictionary-spec-planner.md) and is used by the Dispatcher role. It dispatches Workers in the [Builder](dictionary-builder.md) stance and hands the assembled candidate on for [Review](dictionary-review.md). The skill reference page is [Spec Manager](skill-spec-manager.md).

**In use.** With this Spec's Wiki batches cut, the Dispatcher in the Spec Manager stance sent two Workers at a time to sibling Tasks, gave each its own worktree and branch, kept itself the single writer of the Spec, its Task records and the generated projections, and told each Worker how to keep shared files such as Wiki `MEMORY.md` mergeable.

## Sources

- [GLOSSARY.md, Stance terms](../../GLOSSARY.md#stance-terms): the canonical definition.
- [The spec-manager skill](../skills/spec-manager/SKILL.md): the stance's method.
- [Roles and stances](design-concepts/roles-and-stances.md): where the stance sits.
- [Parallel lane dispatch](parallel-lane-dispatch.md): worktree lanes and one-at-a-time merges.

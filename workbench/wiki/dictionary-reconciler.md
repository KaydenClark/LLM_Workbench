---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Reconciler
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its third Wiki lexicon batch Task (TK-009J), 2026-10-07: the retiring Lexicon entry's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/skills/reconciler/SKILL.md
last_verified: 2026-10-07
---

# Reconciler: bringing records into line with achieved work

Reconciler is the stance that reconciles achieved work with the state and the owners needed to continue it: the records, routes and projections that the next agent will read. The canonical definition is the [glossary entry](../../GLOSSARY.md#stance-terms).

**What it means here.** It neither manufactures completion nor duplicates truth in a universal handoff.

**Neighbouring words.** It is one of the four portable [Stance](dictionary-stance.md) skills. [Direct promotion](dictionary-direct-promotion.md) is one of its tools, and [State resolution](dictionary-state-resolution.md) is the rule it applies when a record and verified reality disagree. The skill reference page is [Reconciler](skill-reconciler.md).

**In use.** After a Task merges, the Dispatcher in the Reconciler stance closes the Task with its verification, appends the Spec's evidence row, regenerates the Taskboard with `spec-workbench.mjs render` and leaves each remaining gap with its named owner, rather than writing a summary that claims the Spec is done.

## Sources

- [GLOSSARY.md, Stance terms](../../GLOSSARY.md#stance-terms): the canonical definition.
- [The reconciler skill](../skills/reconciler/SKILL.md): the stance's method.
- [Assigned Work, Portable Stances And Delivery Boundaries](features/assigned-work-portable-stances-and-delivery-boundaries.md): the feature article on the portable stances.

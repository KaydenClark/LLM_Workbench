---
status: accepted
date: 2026-09-04
canonicalized_in:
  - LEXICON.md
  - AGENTS.md
---

# Every Workbench declares a design-concepts collection of owner-directed articles

Every manifest declares `wiki/design-concepts/`; the collection may be empty but must exist. A Design Concept article is a complete, navlinked, encyclopedic explanation of one durable, reusable, cross-cutting design model, ending with an explicit `Evidence and Sources` section and carrying a `History` section. Discovery starts from `LEXICON.md`. The owner alone authorizes creating an article; agents may suggest one, may repair an existing article from direct authoritative proof while recording the evolution in `History`, and must mark an article stale rather than reconcile it by inference. A parent Workbench owns concepts its children share; a child owns only the concepts unique to it and routes upward for the rest. Staleness is nonblocking.

Considered and rejected: an optional collection created on first use, and a single omnibus "design docs" folder. The first made the collection's absence indistinguishable from an unfinished setup; the second recreated a shadow Wiki with no article contract.

Consequences: the layout validator requires the collection; the wiki validator enforces the article shape and reports stale articles as attention; no generated registry, automated discovery, or separate router is added until Lexicon-first discovery proves insufficient. A Design Concept never replaces the Blueprint, an ADR, a spec, or current task state.

Provenance: owner-reviewed v3.1 greenlight decision, promoted 2026-09-04; see the tracked checkpoint `llm-workbench-v3-1-plan-2026-09-04.md` in the manifest-declared checkpoint collection.

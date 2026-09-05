---
status: accepted
date: 2026-09-04
ported_from: GPT_OS ADR-0018 (accepted 2026-09-03)
canonicalized_in:
  - AGENTS.md
  - LEXICON.md
---

# The wiki is the knowledge base and holds collections

The `wiki/` lane is the Workbench's knowledge base: anything looked up about how the project does things belongs there, organised as collections inside it rather than as sibling lanes. Guidebooks are the `wiki/guidebooks/` collection, not a seventh lane.

A collection is not promoted to a lane because its contents are a different kind of writing. Splitting guidebooks out on the grounds that an ordered procedure differs from reference material would reintroduce permanent plane classification through directory structure, which [ADR-0001](0001-planes-classify-operations-not-artifacts.md) abolished. A guidebook tends to serve as Grounding, but a tendency is not a stamp and location assigns no plane.

Provenance: faithful sanitized port of a private-workspace decision.

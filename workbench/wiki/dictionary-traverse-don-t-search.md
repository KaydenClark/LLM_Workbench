---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Traverse, don't search
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its first Wiki lexicon batch Task (TK-009D), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - AGENTS.md
  - workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md
last_verified: 2026-10-07
---

# Traverse, don't search: reach context by following links

Traverse, don't search is the Workbench's core rule for finding context: start
from a known entry point and follow links to the owners of the information the
task needs, instead of searching the whole repository and hoping to land on
the right file. The canonical definition is the
[glossary entry](../../GLOSSARY.md#destination-and-direction).

**What it means here.** Bounded search repairs missing routes or investigates the selected source area; broad rediscovery is not ordinary entry. `AGENTS.md` owns the behavior. The entry points are the files an agent
already has: `AGENTS.md`, the assigned Spec and Task, the Wiki router, the
glossary and `ARCHITECTURE.md`. Each link is a context pointer, so the agent
pays only for the context its work actually needs.

**Neighbouring words.** A [Map](dictionary-map.md) is built for traversal: it
links to the artifacts that own the detail rather than copying them, and its
[Decisions so far](dictionary-decisions-so-far.md) is an index of links. The
Context Map is the whole web of relationships an agent traverses. Search is
still a repair tool: when a route is missing, a bounded search finds the owner,
and the missing link is then added.

**In use.** An agent assigned the first Wiki lexicon batch (TK-009D) reads its Spec, follows its Decisions
And Contracts link to the Lexicon retirement decision, and from there to the
glossary entry it needs. If a link it follows is broken, it runs one bounded
search to find the moved file and re-points the link, rather than grepping the
repository for every mention of a word.

## Sources

- [GLOSSARY.md, Destination and direction](../../GLOSSARY.md#destination-and-direction): the canonical definition.
- [AGENTS.md, Traverse, Don't Search](../../AGENTS.md#traverse-dont-search): the behavior.
- [Traverse, don't search is core Workbench navigation (ADR-0042)](../docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md): the decision.

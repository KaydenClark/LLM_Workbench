---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Landmark Wiki page
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its first Wiki lexicon batch Task (TK-009D), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md
  - workbench/docs/adr/000R-the-wiki-is-the-evolving-synthesis-every-agent-reads-and-updates.md
  - workbench/landmark-tracker/LANDMARK-WIKI.md
last_verified: 2026-10-07
---

# Landmark Wiki page: the readable account of a landmark

A Landmark Wiki page is the prose synthesis of one landmark: a Markdown page a
person can read straight through, saying what that landmark's question cards
add up to, and rewritten whenever one of those cards changes. The canonical
definition is the [glossary entry](../../GLOSSARY.md#destination-and-direction).

**What it means here.** Its raw source is the landmark's `LANDMARK.md`, which it describes as the landmark currently is without being the same document; a reached landmark retires into it, and the page's `source_paths` names the landmark's historical route ([ADR-000U](../docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md)). Several Specs may contribute to one article. Identifiers appear only with the artifact's name and context. The structured records keep lineage and state; the page keeps the readable account; its claims remain subject to existing ownership and authority rules ([ADR-000R](../docs/adr/000R-the-wiki-is-the-evolving-synthesis-every-agent-reads-and-updates.md)).

**Neighbouring words.** Its sources are the [landmark](dictionary-landmark.md)
and its [Destination Question Cards](dictionary-destination-question-card.md);
the [Landmark Tracker](dictionary-landmark-tracker.md) is the structured view
of the same records. Like every Wiki page it is written at
[Confirm](dictionary-confirm.md) ([Writer verb](dictionary-writer-verb.md)),
and it is what is left when a landmark is cleared away
([Clean Up](dictionary-clean-up.md)).

**In use.** This room's landmark synthesis pages sit in the Wiki's
`design-concepts/` collection, routed from the Landmark Synthesis Pages section
of [the Wiki router](MEMORY.md); [the Wiki landmark page](design-concepts/landmark-wiki.md)
is one. `landmark-wiki.mjs validate` checks that every identifier on such a page
carries the artifact's name and a little context, and
`spec-workbench.mjs retire-landmark LMK-### --wiki PAGE` names the page a
reached landmark retires into.

## Sources

- [GLOSSARY.md, Destination and direction](../../GLOSSARY.md#destination-and-direction): the canonical definition.
- [The landmarks decision (ADR-000U)](../docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md): retirement into the page and its `source_paths`.
- [The Wiki decision (ADR-000R)](../docs/adr/000R-the-wiki-is-the-evolving-synthesis-every-agent-reads-and-updates.md): the Wiki as the evolving synthesis.
- [Landmark article validation](../landmark-tracker/LANDMARK-WIKI.md): the name-and-context identifier check.

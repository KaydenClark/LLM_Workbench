---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Read words
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its third Wiki lexicon batch Task (TK-009J), 2026-10-07: the retiring Lexicon entry's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/docs/adr/000T-records-share-one-set-of-read-words-list-show-search-history-and-inspect.md
  - workbench/tools/adr.mjs
last_verified: 2026-10-07
---

# Read words: list, show, search, history and inspect

The read words are the five kinds of read every record is to answer, defined once: **list**, **show** (with `get` as a synonym), **search**, **history** and **inspect**. The canonical definition is the [glossary entry](../../GLOSSARY.md#governance-core).

**What it means here.** Create, Read, Update and Delete remain the frame; what kind of each a tool needs differs. `capture` is Create, not a read. The decision-record tool answers all five for ADRs and DDRs; other tools gain them as a Spec touches each, and existing command names keep working ([ADR-000T](../docs/adr/000T-records-share-one-set-of-read-words-list-show-search-history-and-inspect.md)).

**Neighbouring words.** The decision-record tool answers all five for every [ADR](dictionary-adr.md) and [DDR](dictionary-ddr.md). A [WBID](dictionary-wbid.md) is how `show`, `history` and `inspect` name the record they read.

**In use.** `node workbench/tools/adr.mjs list --kind ddr` lists the DDRs; `show DDR-001E` prints one whole; `search "lexicon"` finds records by a query; `history ADR-000X` shows how the workflow verbs decision changed; and `inspect DDR-001E --field canonicalized_in` reads one field.

## Sources

- [GLOSSARY.md, Governance core](../../GLOSSARY.md#governance-core): the canonical definition.
- [The read words decision (ADR-000T)](../docs/adr/000T-records-share-one-set-of-read-words-list-show-search-history-and-inspect.md): records share one set of read words.
- [The to-docs skill, decision records](../skills/to-docs/SKILL.md#decision-records): the command forms.

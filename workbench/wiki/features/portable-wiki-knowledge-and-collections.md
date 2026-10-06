---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed one-article-per-Spec migration, 2026-09-19
  - Moved into the features collection and restructured as a feature article by Wiki Evolving-Synthesis Migration (S-003W) Task TK-002 (Move And Retype The Remaining Per-Spec Articles) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-025-portable-wiki-and-design-concepts/SPEC.md
  - workbench/wiki/SCHEMA.md
  - workbench/wiki/AGENTS.md
  - workbench/wiki/design-concepts/README.md
  - workbench/tools/wiki.mjs
  - tools/test-wiki.mjs
  - workbench/docs/adr/0018-the-wiki-is-the-knowledge-base.md
  - workbench/docs/adr/0030-every-workbench-declares-a-design-concepts-collection.md
last_verified: 2026-10-04
---

# Portable Wiki Knowledge And Collections

The Wiki holds durable explanations with explicit source links, routed through
one router and shaped by named collections. The
Portable Wiki And Design Concepts Spec (S-025) delivered that portable
knowledge base: its router, schema and lane guidance, its note properties, and
an initially empty design-concept collection.

## What It Does

- **One router, one schema.** `MEMORY.md` is the Wiki's one router; `SCHEMA.md`
  and lane guidance define shape, maintenance and handling. The Lexicon directs
  readers to the Wiki when they need a concept explained, and to work owners
  when they need current assignment or acceptance state.
- **Notes carry distinct properties.** A note distinguishes knowledge role from
  attribution and sensitivity. Curated knowledge is not instruction authority.
  Provenance says where it came from; sensitivity describes handling rather
  than encryption or access control. Repository-relative source paths let the
  knowledge travel with the project.
- **Named collections.** Design-concept articles explain an owner-directed model
  and include Evidence and Sources and History. Guidebooks hold extended
  procedures, and archive holds explicit historical material. Only archive may
  nest. These collections must not become another work queue or pasted
  evidence ledger.
- **Structural validation.** Validation checks required properties, permitted
  shape, relative paths, secret-like material and copied task state; unrelated
  staleness is nonblocking.

## Why It Matters

Durable explanations need one reachable place with explicit sources, and
keeping curated knowledge apart from instruction authority means a Wiki note
explains without commanding. Repository-relative paths let that knowledge travel
with the project.

## Limits

- The Spec initially shipped an empty design-concept collection and deployment
  routing shape. Emptiness was its starting state, not a permanent prohibition:
  owner-directed articles can populate the declared collection. The current
  explicit one-article-per-legacy-Spec direction authorizes transformation of
  useful meaning without copying work records.
- Structural checks do not certify every substantive assertion. Linked
  controls, decisions and verified source still govern.
- The capability does not imply cross-Workbench indexing, synchronized
  deployment content or cloud distribution.

## Evidence and Sources

- [Historical Portable Wiki And Design Concepts Spec (S-025)](../../specs/S-025-portable-wiki-and-design-concepts/SPEC.md). The original acceptance and evidence retain their time and scope; its eventual retired route is named in this article's `source_paths`.
- Immutable source: `git show 8035b41831985581e41ca713e87c2511d3dbbcc4:workbench/specs/S-025-portable-wiki-and-design-concepts/SPEC.md`. Source inspection for this article used that same commit; the links below route a fresh verification, rather than asserting every historical behavior remains current.
- [workbench/wiki/SCHEMA.md](../SCHEMA.md) - the Wiki schema.
- [workbench/wiki/AGENTS.md](../AGENTS.md) - the Wiki lane guidance.
- [workbench/wiki/design-concepts/README.md](../design-concepts/README.md) - the design-concepts collection guidance.
- [workbench/tools/wiki.mjs](../../tools/wiki.mjs) - the Wiki validator.
- [tools/test-wiki.mjs](../../../tools/test-wiki.mjs) - the verification seam.
- [The wiki is the knowledge base and holds collections (ADR-0018)](../../docs/adr/0018-the-wiki-is-the-knowledge-base.md)
- [Every Workbench declares a design-concepts collection of owner-directed articles (ADR-0030)](../../docs/adr/0030-every-workbench-declares-a-design-concepts-collection.md)

## History

- 2026-09-19: Created on explicit owner direction for one article per legacy Spec. Preserved useful knowledge and historical limits; no source record retired or discarded.
- 2026-10-04: Moved from `design-concepts/spec-S-025-portable-wiki-and-design-concepts.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Wiki Evolving-Synthesis Migration Spec (S-003W) Task TK-002 (Move And Retype The Remaining Per-Spec Articles). Every live link to it was rewritten by the move; no claim was changed. This move checked that the named current source paths (the first entry names the Spec's eventual retired route, which does not exist yet) and the immutable commit exist, not the behavior of the capability itself.

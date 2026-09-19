---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed one-article-per-Spec migration, 2026-09-19
source_paths:
  - workbench/specs/S-025-portable-wiki-and-design-concepts/SPEC.md
  - workbench/wiki/SCHEMA.md
  - workbench/wiki/AGENTS.md
  - workbench/wiki/design-concepts/README.md
  - workbench/tools/wiki.mjs
  - tools/test-wiki.mjs
  - workbench/docs/adr/0018-the-wiki-is-the-knowledge-base.md
  - workbench/docs/adr/0030-every-workbench-declares-a-design-concepts-collection.md
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# Portable Wiki Knowledge (S-025)

The Wiki holds durable explanations with explicit source links. MEMORY.md is its one router; SCHEMA.md and lane guidance define shape, maintenance and handling. Lexicon directs readers to the Wiki when they need a concept explained, and to work owners when they need current assignment or acceptance state.

A note distinguishes knowledge role from attribution and sensitivity. Curated knowledge is not instruction authority. Provenance says where it came from; sensitivity describes handling rather than encryption or access control. Repository-relative source paths let the knowledge travel with the project.

Design-concept articles explain an owner-directed model and include Evidence and Sources and History. Guidebooks hold extended procedures, and archive holds explicit historical material. Only archive may nest. These collections must not become another work queue or pasted evidence ledger.

S-025 initially shipped an empty design-concept collection and deployment routing shape. Emptiness was its starting state, not a permanent prohibition: owner-directed articles can populate the declared collection. The current explicit one-article-per-legacy-Spec direction authorizes transformation of useful meaning without copying work records.

Validation checks required properties, permitted shape, relative paths, secret-like material and copied task state; unrelated staleness is nonblocking. These structural checks do not certify every substantive assertion. Linked controls, decisions and verified source still govern. This capability does not imply cross-Workbench indexing, synchronized deployment content or cloud distribution.

## Evidence and Sources

Historical source: `git show 8035b41831985581e41ca713e87c2511d3dbbcc4:workbench/specs/S-025-portable-wiki-and-design-concepts/SPEC.md`.
The original acceptance and evidence retain their time and scope. Current source
inspection for this article used that same commit; links below route a fresh
verification, rather than asserting every historical behavior remains current.

- [workbench/wiki/SCHEMA.md](../SCHEMA.md)
- [workbench/wiki/AGENTS.md](../AGENTS.md)
- [workbench/wiki/design-concepts/README.md](README.md)
- [workbench/tools/wiki.mjs](../../tools/wiki.mjs)
- [tools/test-wiki.mjs](../../../tools/test-wiki.mjs)
- [workbench/docs/adr/0018-the-wiki-is-the-knowledge-base.md](../../docs/adr/0018-the-wiki-is-the-knowledge-base.md)
- [workbench/docs/adr/0030-every-workbench-declares-a-design-concepts-collection.md](../../docs/adr/0030-every-workbench-declares-a-design-concepts-collection.md)

## History

- 2026-09-19: Created on explicit owner direction for one article per legacy Spec. Preserved useful knowledge and historical limits; no source record retired or discarded.

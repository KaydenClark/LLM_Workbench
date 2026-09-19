# TK-0R0 - Inventory optional source consumers, provenance, attribution, and recovery routes

**Task ID:** TK-0R0
**Spec ID:** S-00R
**Slice:** Inventory optional source consumers, provenance, attribution, and recovery routes without changing disposition
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: Every optional archived/pending item has a documented consumer or recovery purpose and provenance/attribution basis, or an explicit owner-gated removal disposition
**Planned verification:** Red: catalog assertion fails when an optional source lacks path, consumer/recovery route, provenance/notice owner, and review status. Green: each source is represented in `skills/README.md`; `git diff --exit-code -- skills-archive skills-pending` proves no optional bytes changed.
**Preservation and rollback:** Preserve all optional bytes, notices, historical references, and tests. This documentation/test-only commit is recoverable by revert and makes no disposition judgment.
**Bounded source evidence:** Pre-anchor `skills/README.md`, `tools/test-skill-catalog.mjs`, and complete optional-source file inventory.

## Done Criteria

The existing catalog owner records evidence fields for every item; the catalog
test proves coverage; nothing becomes core, discoverable, removed, or moved.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | codex/S-00R-optional-inventory | bcfa55d4d33b3a815e899eeb9e60c7629d462d82 | none | 4 | Catalog red: missing per-item region; catalog and inspection green. Core composition needs clean source candidate. Guardrail baseline 78/100. | skills/README.md inventories 21 optional directories with pinned recovery and attribution | Full suite, TK-0R2 close, separate-context integration review; TK-0R1 and TK-0R3 gates preserved | eae1293f60645171238a16445e0e892488be05251ba6258cd2f5dba5c4968423 |
| 2 | codex/S-00R-optional-inventory | b54c8c7e7481ef6d9fe29b4ad1d7c72e2856f051 | none | 3 | Catalog inventory red/green and missing-disposition mutation red/green; core/inspection green; full required commands green after date fixture and render except append-only history still running | skills/README.md per-item inventory; S-00R blocker scope and live verification checkpoint | Append-only test completion and independent integration review; R1 P Canon gate and R3 owner gate remain | 5f0750dc3b6837cd5178589fe87f21624eca01a530a1d3d04f8c9c8aa4dd09ca |

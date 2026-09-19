# TK-0R2 - Convert optional-source inventory into evidence-backed dispositions

**Task ID:** TK-0R2
**Spec ID:** S-00R
**Slice:** Convert optional-source inventory into per-item retention or owner-gated removal dispositions
**Status:** deferred
**Stance:** Builder
**Blockers:** TK-0R0
**Destination:** spec-acceptance: Every optional item has retained purpose/provenance or an explicit owner-gated removal disposition
**Planned verification:** Red: catalog test fails for row without consumer/recovery route, provenance/attribution owner, or owner-gated status. Green: every item is retained with reason or marked `owner decision required`; repository scans are bounded evidence, not proof of no external consumer.
**Preservation and rollback:** Preserve optional source, notices, history, and archive-boundary tests. Only inventory/test text changes; revert if evidence changes. No removal, relocation, or discovery change.
**Bounded source evidence:** TK-0R0 inventory; README/catalog test; notices; bounded repository references. No external repo or Dungeon Friends.

## Done Criteria

Catalog rows distinguish retained, unresolved, and candidate items per path and
name the owner gate for every potential deletion.

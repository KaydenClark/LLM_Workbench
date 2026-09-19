# TK-0R0 - Inventory optional source consumers, provenance, attribution, and recovery routes

**Task ID:** TK-0R0
**Spec ID:** S-00R
**Slice:** Inventory optional source consumers, provenance, attribution, and recovery routes without changing disposition
**Status:** deferred
**Stance:** Builder
**Blockers:** S-00P
**Destination:** spec-acceptance: Every optional archived/pending item has a documented consumer or recovery purpose and provenance/attribution basis, or an explicit owner-gated removal disposition
**Planned verification:** Red: catalog assertion fails when an optional source lacks path, consumer/recovery route, provenance/notice owner, and review status. Green: each source is represented in `skills/README.md`; `git diff --exit-code -- skills-archive skills-pending` proves no optional bytes changed.
**Preservation and rollback:** Preserve all optional bytes, notices, historical references, and tests. This documentation/test-only commit is recoverable by revert and makes no disposition judgment.
**Bounded source evidence:** Pre-anchor `skills/README.md`, `tools/test-skill-catalog.mjs`, and complete optional-source file inventory.

## Done Criteria

The existing catalog owner records evidence fields for every item; the catalog
test proves coverage; nothing becomes core, discoverable, removed, or moved.

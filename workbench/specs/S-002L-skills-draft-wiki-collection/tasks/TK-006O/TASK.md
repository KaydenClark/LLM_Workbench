# TK-006O - Write the collection index README and route it once from MEMORY.md

**Task ID:** TK-006O
**Spec ID:** S-002L
**Slice:** Write the collection index README and route it once from MEMORY.md
**Status:** in-progress
**Stance:** Builder
**Blockers:** TK-006N
**Destination:** spec-acceptance: The collection exists with the eight group folders and an index README listing all eight groups and the 81 planned articles with their owning Specs; `MEMORY.md` links the collection once and `wiki.mjs validate` shows no error finding.
**Planned verification:** Failing test first (the product wiki's collection README lists eight groups with counts 7, 14, 7, 21, 12, 5, 6, 9 and 81 planned articles, `MEMORY.md` links the README once, and the 20 existing `skill-*.md` articles are unchanged and still routed), then green; `node workbench/tools/wiki.mjs validate`; the full suite, render, doctor and self-drift post receipt from a committed candidate.

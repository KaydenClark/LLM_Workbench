# TK-006O - Write the collection index README and route it once from MEMORY.md

**Task ID:** TK-006O
**Spec ID:** S-002L
**Slice:** Write the collection index README and route it once from MEMORY.md
**Status:** in-progress
**Stance:** Builder
**Blockers:** TK-006N
**Destination:** spec-acceptance: The collection exists with the eight group folders and an index README listing all eight groups and the 81 planned articles with their owning Specs; `MEMORY.md` links the collection once and `wiki.mjs validate` shows no error finding.
**Planned verification:** Failing test first (the product wiki's collection README lists eight groups with counts 7, 14, 7, 21, 12, 5, 6, 9 and 81 planned articles, `MEMORY.md` links the README once, and the 20 existing `skill-*.md` articles are unchanged and still routed), then green; `node workbench/tools/wiki.mjs validate`; the full suite, render, doctor and self-drift post receipt from a committed candidate.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s002l-tk006o-index | 19050cbb89e198760189171fba41aa4aa946cb55 | ahead 0 behind 0 | 0 | tools/test-wiki.mjs red (index test) then green 23/23 at 19050cbb; wiki.mjs validate ok; full RUNBOOK Full suite 51/51 pass at clean candidate 19050cbb; Codex gpt-5.5 review FAIL at e0d82e22 (Foundry-origin and family-count prose) and FAIL at 4c21cb8a (documented findings grep matched the template line), both fixed, PASS at 19050cbb | workbench/wiki/skills-draft/README.md added; workbench/wiki/MEMORY.md one router line; origin value other added (validator, TEMPLATE.md, tests, Spec Decisions) | assembled-Spec review and owner Human QA remain | e4b50b0992da64109f08f92fe184a7313e6b8e2f1057527af82609225e217167 |

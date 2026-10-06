# TK-006T - Corrective: add name and context to bare identifiers on the non-skill pages and the archive audit (whole-Wiki lint F-2, groups C and D)

**Task ID:** TK-006T
**Spec ID:** S-003W
**Slice:** Corrective: add name and context to bare identifiers on the non-skill pages and the archive audit (whole-Wiki lint F-2, groups C and D)
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: A page with an identifier beside the artifact's name passes the identifier validator; a bare identifier is reported
**Planned verification:** landmark-wiki.mjs validate clean on every Wiki page; wiki.mjs validate; no claim changed; full suite

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s003w-tk-006t-identifiers-other-pages | 2eb7f845e76ad2a5e87c2c53e81f7da77284c766 | ahead 0 behind 0 | 0 | Group validator tally 93 findings/21 pages to 3 findings/3 pages (3 validator limits: path-only source_paths/provenance); wiki.mjs validate ok; link check 2095 links 0 broken; test-wiki 25/25; test-landmark-wiki 76/76; full RUNBOOK suite 51/51 rc=0 at 23a0abfa plus merged integration | 20 Wiki pages under workbench/wiki: identifier name-and-context additions only | 3 identifiers in path-only frontmatter lines cannot pass the validator without rewriting a path: idea-to-delivery-workflow.md:14, host-memory-audit-2026-09-26.md:11, task-artifact-and-lifecycle.md:7 | 194b26544f0f5ad7b3f9b2798a2f466d1e74dc2276ea8ac142ce1621a12941c8 |

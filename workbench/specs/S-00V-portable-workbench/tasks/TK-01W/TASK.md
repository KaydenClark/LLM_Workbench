# TK-01W - Medium: TK-00G test 4 in tools/test-skills-lane.mjs does not fail on a stale disposition row (a cited file no longer mentioning the skill), contrary to the close proof

**Task ID:** TK-01W
**Spec ID:** S-00V
**Slice:** Medium: TK-00G test 4 in tools/test-skills-lane.mjs does not fail on a stale disposition row (a cited file no longer mentioning the skill), contrary to the close proof
**Status:** done
**Blockers:** none
**Destination:** spec-acceptance: S-00V Acceptance Criteria
**Planned verification:** Answers evidence row 17 (fail verdict at 6671f0cd8c0779b1df55c4593256d6f06aa2408a on 2026-09-26): Medium: TK-00G test 4 in tools/test-skills-lane.mjs does not fail on a stale disposition row (a cited file no longer mentioning the skill), contrary to the close proof
**Proof:** Answers the fail verdict at 6671f0cd8c0779b1df55c4593256d6f06aa2408a (evidence row 17). Red: with the test 4 of 6671f0c and the domain-modeling mention removed from workbench/skills/grilling/SKILL.md while its disposition row stays, test 4 still passed (1/1), so the TK-00G close row's claim that test 4 fails on a stale row was wrong. Green: test 4 now asserts that at least one file a row cites still mentions the skill (a word-prefix match, because rows such as brainstorm record a prose mention the reference detector does not match); the same mutation fails with 'domain-modeling: stale row'; node tools/test-skills-lane.mjs 4/4 on the committed tree; full AGENTS suite on the committed candidate recorded by the dispatcher.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s00v-tk00g-catalog-review | 8a8341d75d3490e2cb0d066aa70eed90bd546bd8 | ahead 2 behind 0 | 0 | Answers the fail verdict at 6671f0cd8c0779b1df55c4593256d6f06aa2408a (evidence row 17). Red: with the test 4 of 6671f0c and the domain-modeling mention removed from workbench/skills/grilling/SKILL.md while its disposition row stays, test 4 still passed (1/1), so the TK-00G close row's claim that test 4 fails on a stale row was wrong. Green: test 4 now asserts that at least one file a row cites still mentions the skill (a word-prefix match, because rows such as brainstorm record a prose mention the reference detector does not match); the same mutation fails with 'domain-modeling: stale row'; node tools/test-skills-lane.mjs 4/4 on the committed tree; full AGENTS suite on the committed candidate recorded by the dispatcher. | workbench/skills/README.md Referenced non-lane skills test contract names the stale-row failure | none for this finding; TK-00G's remaining gap (RUNBOOK skills lane wording for TK-01P) is unchanged | 2c3fd3bf6a48ef1113c8fe5c8a2930536eacce1bdfe629257352d80216448162 |

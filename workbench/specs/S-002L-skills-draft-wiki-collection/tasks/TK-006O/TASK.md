# TK-006O - Write the collection index README and route it once from MEMORY.md

**Task ID:** TK-006O
**Spec ID:** S-002L
**Slice:** Write the collection index README and route it once from MEMORY.md
**Status:** in-progress
**Stance:** Builder
**Blockers:** TK-006N
**Destination:** spec-acceptance: The collection exists with the eight group folders and an index README listing all eight groups and the 81 planned articles with their owning Specs; `MEMORY.md` links the collection once and `wiki.mjs validate` shows no error finding.
**Planned verification:** Failing test first (the product wiki's collection README lists eight groups with counts 7, 14, 7, 21, 12, 5, 6, 9 and 81 planned articles, `MEMORY.md` links the README once, and the 20 existing `skill-*.md` articles are unchanged and still routed), then green; `node workbench/tools/wiki.mjs validate`; the full suite, render, doctor and self-drift post receipt from a committed candidate.
**Proof:** tools/test-wiki.mjs red then green 23/23; wiki.mjs validate ok; Full suite 51/51 at 19050cbb; Codex gpt-5.5 separate-context review: FAIL e0d82e22, FAIL 4c21cb8a (both preserved, fixed), PASS 19050cbb; Workbench self-drift pre (46ad9789) and post (e0d82e22) receipts both report the same 7 pre-existing findings, cleanUpdate false, no finding in a touched owner; guardrail audit 78/100 unchanged

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s002l-tk006o-index | 19050cbb89e198760189171fba41aa4aa946cb55 | ahead 0 behind 0 | 0 | tools/test-wiki.mjs red (index test) then green 23/23 at 19050cbb; wiki.mjs validate ok; full RUNBOOK Full suite 51/51 pass at clean candidate 19050cbb; Codex gpt-5.5 review FAIL at e0d82e22 (Foundry-origin and family-count prose) and FAIL at 4c21cb8a (documented findings grep matched the template line), both fixed, PASS at 19050cbb | workbench/wiki/skills-draft/README.md added; workbench/wiki/MEMORY.md one router line; origin value other added (validator, TEMPLATE.md, tests, Spec Decisions) | assembled-Spec review and owner Human QA remain | e4b50b0992da64109f08f92fe184a7313e6b8e2f1057527af82609225e217167 |
| 2 | claude/s002l-tk006o-index | b0db19367558c62afa1ad8b72abfa7d73dbf9f73 | ahead 0 behind 0 | 0 | tools/test-wiki.mjs red then green 23/23; wiki.mjs validate ok; Full suite 51/51 at 19050cbb; Codex gpt-5.5 separate-context review: FAIL e0d82e22, FAIL 4c21cb8a (both preserved, fixed), PASS 19050cbb; Workbench self-drift pre (46ad9789) and post (e0d82e22) receipts both report the same 7 pre-existing findings, cleanUpdate false, no finding in a touched owner; guardrail audit 78/100 unchanged | workbench/wiki/skills-draft/README.md, workbench/wiki/MEMORY.md, workbench/wiki/skills-draft/TEMPLATE.md, Spec Decisions (origin other) | assembled-Spec review and owner Human QA remain | 4782be63e37a500a932c0e4c925482fe8f60566740d282c8776dd57de91651da |
| 3 | claude/s002l-assembled-review | d2b0d7fef3b6e708a6e22fc0908e5070f880ce1d | ahead 0 behind 0 | 0 | Continuation run after the failed assembled review: Spec text only. Full RUNBOOK Full suite 51/51 pass at clean candidate d2b0d7fe; wiki.mjs validate ok; check-append-only all cases pass; doctor no S-002L finding | S-002L SPEC.md: acceptance line 6 reworded (review is the verdict row, reason recorded in Decisions), Documentation Impact states the confirmed location and touched files, 20-article count anchored to the pre anchor | fresh assembled-Spec review and owner Human QA | 68967d49e2183b692f2666b05fd8c0c1dbe9a74bef77e54cd3eb3deca637bff3 |

## Continuation

| Run | Date | Answers | Adjusted handoff |
|---|---|---|---|
| 1 | 2026-10-04 | evidence row 5 (fail verdict at f37ab2f210b330096207fcdd887180dd82edf925 on 2026-10-04) | High - Acceptance line 6 was checked while its own separate-context review had not been recorded so the checked box was unsupported when read and the fix is to reword it to cover only checks that exist and leave the review to the verdict row with the reason recorded in Decisions |
| 2 | 2026-10-04 | evidence row 5 (fail verdict at f37ab2f210b330096207fcdd887180dd82edf925 on 2026-10-04) | Medium - Documentation Impact still calls the collection location tentative until slice 1 although DRAFT-LOC is resolved and the fix is to state the confirmed location and the files actually touched |

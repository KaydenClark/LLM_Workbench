# TK-00JB - Prove domain-modeling behavior in fresh-context disposable rooms

**Task ID:** TK-00JB
**Spec ID:** S-004J
**Slice:** Prove domain-modeling behavior in fresh-context disposable rooms
**Status:** in-progress
**Stance:** Builder
**Blockers:** TK-00JA
**Destination:** spec-acceptance: In a grilling scenario, a proposed rename or boundary is traced to named owners, identifiers and tests before the owner chooses, and the room diff stays empty.
**Planned verification:** Scripted-owner fresh-context runs in disposable rooms installed from the assembled lane, asserting observed turns and room diffs for the trace, challenge, capture/promotion, decision-record and grilling-without-the-skill scenarios; a source correction, if any, re-runs the scoped test and full suite.
**Claimed by:** claude-s004j-worker-jb, claude-s004j-worker-fix, claude-s004j-worker-fix2
**Proof:** Correction pass: scenario 1 run 3 names every owner and both tests before the choice with an empty room diff after a red-green trace wording fix; promotion evidence qualified (glossary variant manual write after tool refusal, tool promotion verified for the Lexicon fallback only); full RUNBOOK suite 54/54 on clean fb9765b5

## Scope and authority

Owner, 2026-10-06: "New Spec! You will be one of 3 running at the same time." with `/implement-spec` on this Spec.

Exercise the delivered skill in disposable rooms only, never this repository's live state, covering acceptance lines 3, 4, 5, 7 and 8: a rename or boundary traced to named owners before the choice with an empty room diff; conflicting, overloaded and edge-case challenges and a source-classified behavior claim; a pending term and its correction kept in the notepad with no inline Canon or glossary write; three non-qualifying choices declined and a qualifying one offered as ADR or DDR by the scope test; grilling completing without the skill and no parallel terminology store. Record transcripts, the model, run counts and limits as evidence. A defect found in the lane source is corrected here with its scoped test re-run.

## Done criteria

Each scenario has an observed transcript and room diff assertion under this Spec's proof path, with limits named; any correction is green on the scoped test and the full suite.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004j-assembly | c9905d94b35f7f8c9221378265d59bf530b7ad97 | ahead 0 behind 0 | 0 | Eight fresh headless claude-opus-5-5 sessions (Claude Code 2.1.287) in disposable rooms installed from bc3abc64, skills discovered from each room's .claude/skills: trace PASS, challenges PASS (implementation gap classified at settlement.js:14), capture and promotion PASS 4/4 (A and B twice), decision records PASS (three declined, one DDR offered by scope test), grilling without the skill PASS, no shadow store in any room. Full RUNBOOK suite 54/54 on clean c9905d94; doctor no blocking finding; privacy scan of proof clean. Fast-forward into assembly verified at c9905d94. | proof/scenario-evidence.md, per-scenario observations and curated runs, room generator and runner scripts. Skill source checked; no correction needed. | sessions.mjs promote refuses a root GLOSSARY.md destination until the layout controls list names it (owned by S-004O migration); one model, mostly one run per scenario, scripted owner, local not cloud sessions; Wiki TK-00JC. | c4f58b44e7c7f997e581891e251335cd64cfcf437f80096932b50b72ebac1257 |
| 2 | claude/s004j-assembly | 21a7c6a44cddbff0d4ea9860fe5986e5749f73d4 | ahead 0 behind 0 | 0 | Eight fresh-context sessions in disposable rooms with installed discovery: all five scenarios PASS (capture and promotion 4/4); full RUNBOOK suite 54/54 on clean c9905d94; fast-forward into assembly verified | proof/scenario-evidence.md with per-scenario observations, curated runs and room/runner scripts; skill checked, no correction needed | promote refuses root GLOSSARY.md until S-004O adds it to the layout controls; single model and run counts, scripted owner, local sessions; Wiki TK-00JC | 5fbf0fd6b94641ca623cea6cbf4a5a34523e9bb05daa1bdd55d2ca04ae74bd88 |
| 3 | claude/s004j-corrections | fb9765b57ba89d22a4a9d68dc5686599b0d4dbdc | ahead 0 behind 0 | 0 | Correction run: scenario 1 rerun on the corrected skill. Run 2 at 2d92a3d3 FAIL (tests reported as both test files), attributed to the skill trace wording. Skill sentence added with RED 10/11 then GREEN 11/11. Run 3 at 7188bc63 PASS: before the choice every owner named by path, both tests by file and test name, room diff empty on all turns, skill loaded from the room adapter. Run 1 tests assertion corrected to PARTIAL. Full RUNBOOK suite 54/54 on clean fb9765b5. Self-drift no new finding. Fast-forward into claude/s004j-corrections verified. | Skill trace sentence and scoped test, s1 observations with runs 2 and 3, s3 observations and scenario-evidence qualified: the glossary variant reached GLOSSARY.md only by a manual write after the promote tool refused, tool promotion verified only for the Lexicon fallback. This supersedes the unqualified capture and promotion 4/4 wording in the earlier TK-00JB close row and receipts. | Single rerun of the sharpened trace with one model; glossary tool promotion owned by S-004O; Wiki TK-00JC; fresh assembled review. | f89ea027b52a8f236b28b4b62284fc32d4155e9519214aa1301955662dbb0359 |
| 4 | claude/s004j-corrections | 38da3bbde3d29aaa89bf6ece721848dc17b6a470 | ahead 0 behind 0 | 0 | Correction pass: scenario 1 run 3 names every owner and both tests before the choice with an empty room diff after a red-green trace wording fix; promotion evidence qualified (glossary variant manual write after tool refusal, tool promotion verified for the Lexicon fallback only); full RUNBOOK suite 54/54 on clean fb9765b5 | Skill trace sentence, scoped test, s1 and s3 observations and scenario-evidence; supersedes the earlier unqualified 4/4 wording | Single rerun with one model; glossary tool promotion owned by S-004O; TK-00JC Wiki; fresh assembled review | 2e38eeb6640984831c767d7788dd64e7d48d3b53c6a20fa9717eac56a6988c78 |

## Continuation

| Run | Date | Answers | Adjusted handoff |
|---|---|---|---|
| 1 | 2026-10-07 | evidence row 13 (fail verdict at d8b17a6a1f0099b6784ca2b87d3ff25eaadbd8e0 on 2026-10-07) | S4 and S5 scenario 1 never names the tests it claims to trace and the glossary variant reached GLOSSARY.md only by a manual write after the promote tool refused, so rerun scenario 1 on the corrected skill until the trace names test files or lines and qualify every 4/4 promotion summary in the proof |
| 2 | 2026-10-08 | evidence row 20 (fail verdict at e413ecfc79be5423e8d4a1279686313b74b640e6 on 2026-10-08) | acceptance line 5 is checked although both glossary runs reached GLOSSARY.md only by a manual write after sessions.mjs promote refused, so uncheck it with its wording unchanged and keep it open on S-004O's glossary promotion route until the glossary variant reruns through promote on integration |
| 3 | 2026-10-08 | evidence row 20 (fail verdict at e413ecfc79be5423e8d4a1279686313b74b640e6 on 2026-10-08) | scenario 1 run 3 lists the Blueprint outcomes, Wiki billing-model page, Invoice Settlement spec and decision record without their paths, so mark the rename assertion incomplete and rerun scenario 1 until every listed owner is named by path before the owner chooses |

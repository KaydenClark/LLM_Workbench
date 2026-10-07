# TK-00JB - Prove domain-modeling behavior in fresh-context disposable rooms

**Task ID:** TK-00JB
**Spec ID:** S-004J
**Slice:** Prove domain-modeling behavior in fresh-context disposable rooms
**Status:** in-progress
**Stance:** Builder
**Blockers:** TK-00JA
**Destination:** spec-acceptance: In a grilling scenario, a proposed rename or boundary is traced to named owners, identifiers and tests before the owner chooses, and the room diff stays empty.
**Planned verification:** Scripted-owner fresh-context runs in disposable rooms installed from the assembled lane, asserting observed turns and room diffs for the trace, challenge, capture/promotion, decision-record and grilling-without-the-skill scenarios; a source correction, if any, re-runs the scoped test and full suite.
**Claimed by:** claude-s004j-worker-jb, claude-s004j-worker-fix
**Proof:** Eight fresh-context sessions in disposable rooms with installed discovery: all five scenarios PASS (capture and promotion 4/4); full RUNBOOK suite 54/54 on clean c9905d94; fast-forward into assembly verified

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

## Continuation

| Run | Date | Answers | Adjusted handoff |
|---|---|---|---|
| 1 | 2026-10-07 | evidence row 13 (fail verdict at d8b17a6a1f0099b6784ca2b87d3ff25eaadbd8e0 on 2026-10-07) | S4 and S5 scenario 1 never names the tests it claims to trace and the glossary variant reached GLOSSARY.md only by a manual write after the promote tool refused, so rerun scenario 1 on the corrected skill until the trace names test files or lines and qualify every 4/4 promotion summary in the proof |

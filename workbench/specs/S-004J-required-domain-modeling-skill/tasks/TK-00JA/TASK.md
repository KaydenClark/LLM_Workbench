# TK-00JA - Ship the adapted domain-modeling skill in every room's lane

**Task ID:** TK-00JA
**Spec ID:** S-004J
**Slice:** Ship the adapted domain-modeling skill in every room's lane
**Status:** done
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: A fresh clone discovers `domain-modeling` through both adapters; the manifest, layout bundle, catalog and count-bearing documents agree.
**Planned verification:** A scoped source test (`tools/test-domain-modeling-skill.mjs`) red on the absent lane source, then green; catalog, layout and skills-lane tests red on the undeclared skill, then green; runbook-index check; full RUNBOOK suite on a committed candidate; self-drift pre/post.
**Claimed by:** claude-s004j-worker-ja, claude-s004j-worker-fix
**Proof:** Correction pass: in-directory MIT NOTICE.md installed into rooms; scoped 11/11 with each new assertion failing on its mutation; full RUNBOOK suite 54/54 on clean e30df561; fast-forward into claude/s004j-corrections verified

## Scope and authority

Owner, 2026-10-06: "New Spec! You will be one of 3 running at the same time." with `/implement-spec` on this Spec.

Adopt Matt Pocock's pinned glossary-based source (`mattpocock/skills` at `d81f3a183412e71a5b1e84ca21bc1a35eea03a60`, `skills/engineering/domain-modeling/SKILL.md` and `GLOSSARY-FORMAT.md`) into `workbench/skills/domain-modeling/` with only the Workbench adapters Desired Behavior 3, 5, 6, 8 and 9 name: the bounded upstream consequence trace; capture in the objective's notepad and promotion instead of inline glossary or Canon writes; reading the current Lexicon while the glossary owner is absent; manifest decision-record owners and the ADR/DDR scope test through `to-docs`; no shadow `CONTEXT.md`, `UBIQUITOUS_LANGUAGE.md` or local `docs/adr/`. Keep the source pin and attribution under `THIRD_PARTY_NOTICES.md`. The PR #251 candidate and draft PR #374 are historical input only.

Join the required bundle and reach it from the Contract: manifest `skillPolicy.required`, layout `coreSkills`, the skills catalog and every count-bearing document the catalog test derives, and one RUNBOOK operations index row. Assign no release and bump no version. Do not touch `skills-pending/`, `LEXICON.md`, `lexicon`, `ubiquitous-language`, `grilling` or the personal catalog.

## Done criteria

Both adapters resolve the lane source; the scoped source test proves the operating contract, the preserved upstream moves and glossary format, and absent shadow stores; distribution tests and the full suite pass on a committed candidate; each adapter is recorded with its reason.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004j-assembly | bac6db41f207fa4e804e2cb1d3ae5b460663c647 | ahead 0 behind 0 | 0 | RED: test-domain-modeling-skill 0/10 with source absent; test-skill-catalog and test-skills-lane failed on the undeclared skill. GREEN at bac6db41: scoped 10/10, catalog 3/3, skills-lane 6/6, layout 76/76, runbook-index 62/62, installer 33/33; full RUNBOOK suite 54/54 on clean bac6db41 (also 54/54 on 6e5910c2). Self-drift pre/post 18 findings both, cleanUpdate false (pre-existing). Fast-forward merge into assembly verified at bac6db41. | Skill source and verbatim GLOSSARY-FORMAT, skills catalog, count tokens in README, templates/GENESIS, LEXICON and workbench-room-checks, root and template RUNBOOK index row and Full suite list. THIRD_PARTY_NOTICES and AGENTS checked; no update needed. | Fresh-context behavior proof (TK-00JB) and Wiki reconciliation (TK-00JC); two Wiki pages still say 28 skills; release identity for the bundle change is the release owner's. | 4076bf932e77a7f34b9433326c39f744eb6346d1c30acf1d2f1bba26f9a35970 |
| 2 | claude/s004j-assembly | 3092dd3aca4f02be99142550db4d1394e4332a9c | ahead 0 behind 0 | 0 | Full RUNBOOK suite 54/54 on clean bac6db41; scoped domain-modeling 10/10 red-then-green; catalog, skills-lane, layout, runbook-index and installer green; fast-forward into assembly verified at bac6db41 | Skill source, catalog, count tokens, root and template RUNBOOK index row and suite list; THIRD_PARTY_NOTICES and AGENTS checked, no update needed | Behavior proof TK-00JB and Wiki TK-00JC; two Wiki pages still say 28 skills; release identity is the release owner's | 10cdba5e93d24eedda05d2793e6a6bf99d9f05616ad0933314cfb00f34188a73 |
| 3 | claude/s004j-corrections | e30df561619ead0bf7a59acf592affac3ec19645 | ahead 0 behind 0 | 0 | Correction run: RED 6/11 on the unchanged skill (NOTICE absent, format note link, capture timing, description adapter, file set). GREEN at e30df561: scoped 11/11, catalog, skills-lane 6/6, runbook-index 62/62, doctor ok. Twenty mutations on scratch copies: old test passed six of the review's seven, each new assertion fails on its mutation. Room install copies NOTICE.md byte-identical through both adapters. Full RUNBOOK suite 54/54 on clean e30df561. Self-drift 23 pre and post, same set. Guardrail 73/100 unchanged. Fast-forward into claude/s004j-corrections verified. | Skill NOTICE.md with full MIT text and pin, SKILL.md credit and complete adapter list with unrelated policy removed and capture timing restored, GLOSSARY-FORMAT adapter note, scoped test. THIRD_PARTY_NOTICES checked; no update needed. | Scenario 1 rerun and promotion qualification (TK-00JB); Wiki adapter section and scenario 4 limit (TK-00JC); fresh assembled review. | dac0aa86c8d98a616aaf2fd8bf63d563f4bc30d33a1a1e477cdedaa87c868791 |
| 4 | claude/s004j-corrections | 91a606e0c7455ca44a775d0c8919fc80a7b0d539 | ahead 0 behind 0 | 0 | Correction pass: in-directory MIT NOTICE.md installed into rooms; scoped 11/11 with each new assertion failing on its mutation; full RUNBOOK suite 54/54 on clean e30df561; fast-forward into claude/s004j-corrections verified | Skill notice, credit, adapter list and format note; scoped test; THIRD_PARTY_NOTICES checked, no update needed | TK-00JB scenario 1 rerun and promotion qualification; TK-00JC Wiki; fresh assembled review | 364c5e1963b8e5d33483727bed6a6739ac539f365d66660653b217241041d60b |

## Continuation

| Run | Date | Answers | Adjusted handoff |
|---|---|---|---|
| 1 | 2026-10-07 | evidence row 13 (fail verdict at d8b17a6a1f0099b6784ca2b87d3ff25eaadbd8e0 on 2026-10-07) | B1 every room receives the verbatim MIT-licensed GLOSSARY-FORMAT.md without the MIT notice, so ship the full notice inside workbench/skills/domain-modeling as the pr skill does with its NOTICE.md and assert it in the scoped test |
| 2 | 2026-10-07 | evidence row 13 (fail verdict at d8b17a6a1f0099b6784ca2b87d3ff25eaadbd8e0 on 2026-10-07) | S1 the scoped test still passes the write-boundary, ADR and DDR direction, promotion-route, Lexicon-fallback and confirmation-rule mutations, so assert each and show each assertion failing on its mutation |
| 3 | 2026-10-07 | evidence row 13 (fail verdict at d8b17a6a1f0099b6784ca2b87d3ff25eaadbd8e0 on 2026-10-07) | S3 and N5 the adapter list claims every change but omits several and adds unrelated authority and evidence policy lines, so remove that policy, list each remaining change with its reason, restore capture as it happens and say the lazy-creation line in GLOSSARY-FORMAT does not apply |

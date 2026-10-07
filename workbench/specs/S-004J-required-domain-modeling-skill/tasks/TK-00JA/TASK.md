# TK-00JA - Ship the adapted domain-modeling skill in every room's lane

**Task ID:** TK-00JA
**Spec ID:** S-004J
**Slice:** Ship the adapted domain-modeling skill in every room's lane
**Status:** done
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: A fresh clone discovers `domain-modeling` through both adapters; the manifest, layout bundle, catalog and count-bearing documents agree.
**Planned verification:** A scoped source test (`tools/test-domain-modeling-skill.mjs`) red on the absent lane source, then green; catalog, layout and skills-lane tests red on the undeclared skill, then green; runbook-index check; full RUNBOOK suite on a committed candidate; self-drift pre/post.
**Claimed by:** claude-s004j-worker-ja
**Proof:** Full RUNBOOK suite 54/54 on clean bac6db41; scoped domain-modeling 10/10 red-then-green; catalog, skills-lane, layout, runbook-index and installer green; fast-forward into assembly verified at bac6db41

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

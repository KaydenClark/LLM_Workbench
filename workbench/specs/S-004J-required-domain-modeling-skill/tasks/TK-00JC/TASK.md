# TK-00JC - Reconcile the Domain Modeling Wiki article with delivered behavior

**Task ID:** TK-00JC
**Spec ID:** S-004J
**Slice:** Reconcile the Domain Modeling Wiki article with delivered behavior
**Status:** in-progress
**Stance:** Builder
**Blockers:** TK-00JB
**Destination:** spec-acceptance: The Wiki article separates upstream method, Workbench adaptation and verified behavior and limits.
**Planned verification:** Wiki validation and lint on the touched pages, link checks, full RUNBOOK suite on a committed candidate.
**Claimed by:** claude-s004j-worker-jc, claude-s004j-worker-fix
**Proof:** Wiki validate clean, test-wiki 25/25, full RUNBOOK suite 54/54 on clean 989f1b09; article separates upstream method, Workbench adaptation and verified behavior and limits; fast-forward into assembly verified

## Scope and authority

Owner, 2026-10-06: "New Spec! You will be one of 3 running at the same time." with `/implement-spec` on this Spec.

Update `workbench/wiki/skill-domain-modeling.md` and its router entry so the article separates Matt's upstream method, the Workbench adapters recorded by TK-00JA, and the behavior and limits TK-00JB observed. Route other changed truth through `to-docs`; record `Docs checked; no update needed` for owners checked and unchanged.

## Done criteria

The article and router read back against the delivered source and the scenario evidence; Wiki validation and lint are clean; the full suite passes on a committed candidate.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004j-assembly | 989f1b0973f63c59f3cda8630160d178a3bf7686 | ahead 0 behind 0 | 0 | wiki.mjs validate ok, no findings; test-wiki 25/25; lifecycle-directory-links 3/3; skill-catalog green; doctor no blocking finding; full RUNBOOK suite 54/54 on clean 989f1b09; fast-forward into assembly verified at 989f1b09. | skill-domain-modeling.md rewritten into upstream method, Workbench adaptation and verified behavior and limits; MEMORY.md router lines for the article and this Spec; current bundle counts in skill-genesis, landmark-wiki, skills-draft README and implement-spec draft. Dated count history in skill-workbench-runtime and skill-grill-me checked; no update needed. | Assembled code review and owner Human QA; promote GLOSSARY.md destination owned by S-004O; release identity unassigned. | d7ddd94fa7f4024bd0eb29e60e137171cc196c802a1cc4625a75328dd5bdb08c |
| 2 | claude/s004j-assembly | 64ce97257cdcd07cf5df10277c0f02c02a1f6798 | ahead 0 behind 0 | 0 | Wiki validate clean, test-wiki 25/25, full RUNBOOK suite 54/54 on clean 989f1b09; article separates upstream method, Workbench adaptation and verified behavior and limits; fast-forward into assembly verified | Domain Modeling article, Wiki router lines, current bundle counts in four Wiki pages; dated count history checked, no update needed | Assembled code review and owner Human QA; promote GLOSSARY.md destination owned by S-004O; release identity unassigned | 4dee6d73e9f8209580fc09cde4a43233a871e11a0e1728ac0fe9904a67218044 |
| 3 | claude/s004j-corrections | eab82fe52669f0d479128bea52c6b8ad3ad095c2 | ahead 0 behind 0 | 0 | Correction run: wiki.mjs validate ok, test-wiki 25/25, git diff --check clean, manual lint of the page against the skill, NOTICE.md, scenario evidence and s1, s3 and s4 observations with no contradiction and no stale domain-modeling claims elsewhere in the Wiki. Full RUNBOOK suite 54/54 on clean eab82fe5. Self-drift no new finding. Fast-forward into claude/s004j-corrections verified. | skill-domain-modeling.md: full adapter table with the trace naming sentence, NOTICE.md credit route, qualified promotion evidence, scenario 1 runs 1 to 3, scenario 4 prompt limit and single-host limit. Router line checked; no update needed. | Fresh assembled integration review and owner Human QA; glossary tool promotion owned by S-004O; release identity. | 3b92e2525139625210472a35bdc72532a42bb54e1ca729fad2bad6260cf20c9d |

## Continuation

| Run | Date | Answers | Adjusted handoff |
|---|---|---|---|
| 1 | 2026-10-07 | evidence row 13 (fail verdict at d8b17a6a1f0099b6784ca2b87d3ff25eaadbd8e0 on 2026-10-07) | N2 and S3 the Domain Modeling Wiki article must match the corrected adapter list and name the scenario 4 prompt limit |

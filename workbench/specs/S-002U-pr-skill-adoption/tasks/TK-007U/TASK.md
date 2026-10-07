# TK-007U - Install the pinned pr source with lineage and its draft article

**Task ID:** TK-007U
**Spec ID:** S-002U
**Slice:** Install the pinned pr source with lineage and its draft article
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: Pinned source and article agree on body authoring; the necessary adapter diff and Dex Horthy / Humanlayer lineage are recorded.
**Planned verification:** Red pinned-source fidelity check (hash of the pinned upstream text) failing on the missing source, then green; Wiki validate and lint for the draft article; GLOSSARY.md reference unchanged; full RUNBOOK suite on the committed candidate.
**Claimed by:** claude-s002u-worker-u

## Scope

Add `workbench/skills/pr/` from Matt Pocock's pinned source (`skills/engineering/pr` at `d81f3a183412e71a5b1e84ca21bc1a35eea03a60`), almost verbatim, with upstream lineage, MIT notice and Dex Horthy / Humanlayer `show-me` credits, plus any necessary runtime adapter justified in the notice. Author `workbench/wiki/skills-draft/main-workflow/pr.md` from the delivered draft Template and link its skills-draft README row. The article compares source, article and observed behavior, labels intended behavior and limitations, and records that `GLOSSARY.md` is the settled vocabulary reference whose delivery S-004O owns.

## Out of scope

Required-bundle membership, counts and compatibility (TK-007V); the fresh-context scenario (TK-007W); any PR opening, merge or Git operation authority.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s002u-tk007u | 56eb7a9bc00e393db0a1b471c65f55fb8c27cb0d | ahead 0 behind 0 | 0 | Candidate 56eb7a9bc00e393db0a1b471c65f55fb8c27cb0d (clean). RED: node tools/test-skill-catalog.mjs exit 1, workbench/skills/pr/SKILL.md must carry the pinned upstream source. GREEN for the pin: the hash assertion (bb2f9427 of upstream d81f3a18 SKILL.md, CRLF and trailing newlines normalized) passes; SKILL.md, CREDITS.md and agents/openai.yaml sha256 equal the gh api upstream bytes and NOTICE MIT text equals upstream LICENSE. wiki.mjs validate ok. Full Runbook suite 46 pass, 7 fail: test-skill-catalog, test-core-composition, test-core-skill-installer, test-workbench-layout, test-workbench-adoption, test-workbench-upgrade, test-diagnostics, every failure the closed-bundle refusal invalid-bundled-core (or the catalog's live discovery source must contain exactly the locked 28 skills) because workbench/skills/pr is not yet declared required Core. Same seven at pre-change claim commit 6c1824d6: 7 pass, 0 fail. spec-workbench doctor ok. | workbench/skills/pr/NOTICE.md (pin, no adapter, show-me lineage, MIT); workbench/wiki/skills-draft/main-workflow/pr.md drafted from Template 2; skills-draft README pr row linked; MEMORY.md router summary names the pr draft | Not closable green alone: the runtime refuses an undeclared skill directory in the lane, so the source needs the required-Core declaration owned by the next Task in this Spec (TK-007V, required Core and compatibility) before the suite passes; Dispatcher decision requested. GLOSSARY.md undelivered on this base (S-004O). Fresh-context body scenario (TK-007W) not run. | aa216530c4d579c439269192b32f90b5567ef6095ec0f0baecb52e31d45804d8 |
| 2 | claude/s002u-tk007v | 5e965265a832d931457526601ee0acc3d1719d98 | ahead 0 behind 0 | 0 | Candidate 5e965265a832d931457526601ee0acc3d1719d98 (clean, pushed to origin/claude/s002u-tk007v, includes TK-007U 56eb7a9b plus the TK-007V required-Core declaration). RED kept from 56eb7a9b lane: node tools/test-skill-catalog.mjs exit 1, workbench/skills/pr/SKILL.md must carry the pinned upstream source. GREEN: pin hash bb2f9427 of upstream d81f3a18 SKILL.md passes; fresh clone sha256 of workbench/skills/pr/SKILL.md ab63f1cf equals the gh api upstream bytes; wiki.mjs validate ok. Full Runbook suite 53 pass, 0 fail at 5e965265a832d931457526601ee0acc3d1719d98 (the seven invalid-bundled-core failures at 56eb7a9b cleared by declaring pr required Core). spec-workbench doctor ok, no blocking finding. | No new docs in this run; TK-007U docs at 56eb7a9b stand (workbench/skills/pr/NOTICE.md, workbench/wiki/skills-draft/main-workflow/pr.md, skills-draft README row, MEMORY.md router) | GLOSSARY.md undelivered on this base (S-004O); the pr source reference stays unchanged. Fresh-context body-authoring scenario not run (TK-007W). | 6770f07b7c0e18030b87e79838d1576738aca793200978055ef1433ea12de201 |

# TK-009E - A promotion scenario keeps an unconfirmed term in the notepad and promotes only confirmed meaning

**Task ID:** TK-009E
**Spec ID:** S-004O
**Slice:** A promotion scenario keeps an unconfirmed term in the notepad and promotes only confirmed meaning
**Status:** done
**Stance:** Builder
**Blockers:** TK-009C
**Destination:** spec-acceptance: A promotion scenario preserves an unconfirmed proposed term in the notepad and promotes only confirmed meaning; it adds no inline-write exception.
**Planned verification:** Red: a scenario test with a notepad holding one confirmed and one proposed term, promoting into `GLOSSARY.md`, fails first. Green: the confirmed meaning lands in the glossary, the proposed term stays in the notepad and no inline glossary write path exists; then the full suite.
**Claimed by:** claude-s004o-worker-d
**Proof:** Red 9be8659a (promote refused GLOSSARY.md: Destination must be an existing control, spec, ADR, Wiki or docs/feedback Markdown owner), green: scenario in test-direct-promotion promotes the confirmed Receipt decision into GLOSSARY.md while pending Waypoint stays in the notepad byte for byte; six refusals (pending source_record, proposal, mixed selection, templates/GLOSSARY.md, missing Language section, placeholders); static check that only promotion writes GLOSSARY.md; mutations bite; test-direct-promotion 35/35, test-notepads 57/57; full suite 52/53 on clean a7778582 with test-workbench-round-trip failing on a transient fixture clone (fatal: unable to read tree) and passing alone (log-tk009e-roundtrip.txt); merged by PR #416

## Scope

Prove the capture boundary DDR-001E keeps: intent stays in the objective's notepad, confirmation settles meaning, promotion writes the glossary. Use the existing notepad and direct-promotion tooling; add no inline-write exception and no new store.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004o-lexicon-retirement | 77cad51d2ddb40d6479a97ced9b25633ae0cf24e | ahead 0 behind 0 | 0 | Red 9be8659a (promote refused GLOSSARY.md: Destination must be an existing control, spec, ADR, Wiki or docs/feedback Markdown owner), green: scenario in test-direct-promotion promotes the confirmed Receipt decision into GLOSSARY.md while pending Waypoint stays in the notepad byte for byte; six refusals (pending source_record, proposal, mixed selection, templates/GLOSSARY.md, missing Language section, placeholders); static check that only promotion writes GLOSSARY.md; mutations bite; test-direct-promotion 35/35, test-notepads 57/57; full suite 52/53 on clean a7778582 with test-workbench-round-trip failing on a transient fixture clone (fatal: unable to read tree) and passing alone (log-tk009e-roundtrip.txt); merged by PR #416 | workbench/skills/promote/SKILL.md names root GLOSSARY.md as an owner with its decision-only rule and Language check | TK-009G must keep the glossary branch in sessions.mjs validatePromotionOwner ahead of the controls branch when GLOSSARY.md joins controls; ARCHITECTURE.md is not a promotion destination | 668abcd80619be4fc25f77d81177907ec5a65785bc8494c34e9476e0cef45e21 |

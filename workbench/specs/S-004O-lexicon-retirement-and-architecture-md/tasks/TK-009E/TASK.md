# TK-009E - A promotion scenario keeps an unconfirmed term in the notepad and promotes only confirmed meaning

**Task ID:** TK-009E
**Spec ID:** S-004O
**Slice:** A promotion scenario keeps an unconfirmed term in the notepad and promotes only confirmed meaning
**Status:** in-progress
**Stance:** Builder
**Blockers:** TK-009C
**Destination:** spec-acceptance: A promotion scenario preserves an unconfirmed proposed term in the notepad and promotes only confirmed meaning; it adds no inline-write exception.
**Planned verification:** Red: a scenario test with a notepad holding one confirmed and one proposed term, promoting into `GLOSSARY.md`, fails first. Green: the confirmed meaning lands in the glossary, the proposed term stays in the notepad and no inline glossary write path exists; then the full suite.
**Claimed by:** claude-s004o-worker-d

## Scope

Prove the capture boundary DDR-001E keeps: intent stays in the objective's notepad, confirmation settles meaning, promotion writes the glossary. Use the existing notepad and direct-promotion tooling; add no inline-write exception and no new store.

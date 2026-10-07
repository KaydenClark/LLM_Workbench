# TK-005Z - Reconcile Harness, Session and Context and the Workbench rows that called the Workbench a harness

**Task ID:** TK-005Z
**Spec ID:** S-004E
**Slice:** Reconcile Harness, Session and Context and the Workbench rows that called the Workbench a harness
**Status:** in-progress
**Stance:** Builder
**Blockers:** TK-005Y
**Destination:** spec-acceptance: No Lexicon row, template mirror row or current-facing control line uses a batch term for a different concept without an explicit distinction; the Workbench self-description follows the owner harness answer, and host, provider, session and context uses are reconciled as Desired Behavior 2 states.
**Planned verification:** Red: a check that neither Lexicon calls the Workbench a harness fails first. Green: that check, the one-row-per-term check, the evaluator and the full AGENTS suite on the committed candidate. Conflicting `AGENTS.md`, `RUNBOOK.md` and `README.md` lines are inventoried in the Spec and handed to the Contract Carrier Pointer-Brief Rewrite, not edited here.
**Proof:** Red 11d1321d then green: test-control-fidelity 30/30, full AGENTS suite 48/48 on clean 45efed10
**Claimed by:** claude-s004e-corrections

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004e-harness-2 | 45efed1028484ccb2a0a1f962ac739d2631321c0 | ahead 0 behind 0 | 0 | Red 11d1321d: tools/test-control-fidelity.mjs two cases fail (Harness, Session and Context rows missing; Workbench still called a harness). Green: test-control-fidelity 30/30; full AGENTS suite 48/48 on clean 45efed10; copied-passage comparison leaves only common phrases of seven words or fewer | LEXICON.md and templates/LEXICON.md (Harness, Session, Context rows; Workbench, Project, Portable Workbench, Evaluation, Chat and Host portability rows); Spec S-004E conflicting control lines inventory | AGENTS.md, RUNBOOK.md and README.md harness wording handed to the Contract Carrier Pointer-Brief Rewrite; batch two and Wiki entries remain | 1ff19ed8abb9cf7ae8290802b4fcf7f4b6a0f30e71769ff034dfe2e570cd7c29 |
| 2 | claude/s004e-harness-2 | b7a7b9f97a1993358076b38ea85e3dff0c844cdb | ahead 0 behind 0 | 0 | Red 11d1321d then green: test-control-fidelity 30/30, full AGENTS suite 48/48 on clean 45efed10 | LEXICON.md and templates/LEXICON.md reconciled to the harness answer; conflicting AGENTS.md, RUNBOOK.md and README.md lines inventoried in the Spec for the Contract carrier rewrite | Batch two rows, Wiki entries and whole-Spec QA remain in the last two Tasks | a6683d7fa2281e3f97a07056cb112ca7db087f2a7b154f0ac7862022fac489e3 |
| 3 | claude/s004e-s004g-corrections | ba983d27ace387cc450203e5091d3192453993f3 | ahead 0 behind 0 | 2 | Continuation after the fail verdict at a7e735b4, records-only at 121591e4: Conflicting Control Lines reread at integration 42431879 with grep -n -i harness across AGENTS.md, RUNBOOK.md, README.md, the three template carriers, nine tracked skills and ADR-0044/0049, grouped into kept public names, harness-improvement wording awaiting the owner's ruling, and uses awaiting rewording; acceptance line 2 names this Spec as the rewording owner. wiki validate ok; full Runbook suite 53/53 on clean 54634baa7d4092d64c60621cad30b54331499002. Claimed with --local because remote coordination read TK-005Z as claimed on 27 stale tips where it is done. | S-004E SPEC.md Conflicting Control Lines, acceptance line 2 and Completion Result | The rewording Task waits on the owner's harness-improvement ruling | b85beae35b0ae9b05bde59b8ad029907c966d9d233520caab2c9ffe7f854eb8b |

## Continuation

| Run | Date | Answers | Adjusted handoff |
|---|---|---|---|
| 1 | 2026-10-07 | evidence row 10 (fail verdict at a7e735b44e73800a3518579cbff8b68b4e70add2 on 2026-10-07) | Medium, the open acceptance line 2 has no owner that will clear it. The Contract carrier rewrite Spec carries no requirement to reword harness and has already moved inventoried Runbook lines verbatim into workbench/skills/workbench-evaluation/SKILL.md, and later uses (RUNBOOK.md index rows, the improve-harness skill, templates/AGENTS.md, templates/RUNBOOK.md, templates/README.md) are not inventoried. Refresh the Conflicting Control Lines inventory at the current tip across controls, skills and template carriers, name ADR 0044 and 0049 that the harness decision lists, and give the rewording a real owner recorded in that owner's own record, then make line 2 name it |

# TK-008Y - The Contract carriers and their generic mirrors name the landmark commands and meanings the runtime delivers

**Task ID:** TK-008Y
**Spec ID:** S-003Z
**Slice:** The Contract carriers and their generic mirrors name the landmark commands and meanings the runtime delivers
**Status:** ready
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: Source behavior, the generic templates, discovery and managed installation agree, and updating a room with no landmarks leaves it unchanged.
**Planned verification:** Red: `tools/test-workbench-round-trip.mjs` or `tools/test-runbook-index.mjs` gains a case asserting that `RUNBOOK.md`, `templates/RUNBOOK.md` and the Runbook operations index name the landmark commands (`move-spec --landmark`, `report|verify|verdict|approve LMK-###`, `retire-landmark`, `next-id --prefix LMK`, `claim|close|receipt|show|move-task LMK-###`, `gate --task TK-### --landmark LMK-###`) and that the Lexicon Landmark row in `LEXICON.md` and `templates/LEXICON.md` no longer says the artifact is not installed; green once the lines in [carrier-lines.md](../../carrier-lines.md) are applied, re-read against the carriers' then-current anchors. The `AGENTS.md` sentence that says landmark review tooling is only destination design is corrected in `AGENTS.md` and `templates/AGENTS.md`. `tools/test-landmark-wiki.mjs` joins the Runbook suite list if it is not otherwise run. Full Runbook suite on the committed candidate.
**Proof:** PR #384 merged into integration at 36fdaeab9e0c36b91e8f62d5caafda292dbda1bf (merge of candidate a4ce2f8da416e5f25267380716e251722aeed3b8, base e3d74afe); red at f4ad56fe (five test-runbook-index cases failing); 51-command suite DONE total=51 fail=0 on a4ce2f8d plus the new 52nd command test-landmark-wiki 79/0; test-runbook-index 49/0, test-control-fidelity, test-workbench-layout, test-workbench-round-trip, test-governance-core, test-carrier-landing, test-genesis-from-decisions green; render clean; doctor no blocking finding; check-append-only CLEAN

## Origin

New Task from TK-008J's second merge answer (PR #382): the Director's brief routes `AGENTS.md`, `RUNBOOK.md` and `LEXICON.md` lines through the single writer of the [Contract Carrier Pointer-Brief Rewrite](../../../S-004C-contract-carrier-pointer-brief-rewrite/SPEC.md), whose open PR #358 (its Task TK-005N) holds `LEXICON.md` and `templates/LEXICON.md`, so TK-008J wrote the exact proposed lines into [carrier-lines.md](../../carrier-lines.md) instead of editing the carriers. This Task applies them, by this Spec's lane or by that writer, once the Director releases the files; TK-005N is the recorded blocker because its open PR is the current holder. The [Harness Improvement Playbook Skill](../../../S-004L-harness-improvement-playbook-skill/SPEC.md) PR #372 also touches `LEXICON.md` and holds the `workbench-room-checks` skill, whose V3 support-root text omits the `landmarks` collection (carrier-lines.md names it).

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s003z-assembly | 36fdaeab9e0c36b91e8f62d5caafda292dbda1bf | ahead 0 behind 0 | 0 | PR #384 merged into integration at 36fdaeab9e0c36b91e8f62d5caafda292dbda1bf (merge of candidate a4ce2f8da416e5f25267380716e251722aeed3b8, base e3d74afe); red at f4ad56fe (five test-runbook-index cases failing); 51-command suite DONE total=51 fail=0 on a4ce2f8d plus the new 52nd command test-landmark-wiki 79/0; test-runbook-index 49/0, test-control-fidelity, test-workbench-layout, test-workbench-round-trip, test-governance-core, test-carrier-landing, test-genesis-from-decisions green; render clean; doctor no blocking finding; check-append-only CLEAN | RUNBOOK.md and templates/RUNBOOK.md (index rows, Landmark Lifecycle section, suite line test-landmark-wiki, template mirror), AGENTS.md and templates/AGENTS.md (landmark review sentence), carrier-lines.md applied-status note; value placeholders use the Runbook's SHA and "..." convention and the template names the landmark's specs folder without a bare specs/ path, both forced by existing tests | Routed wording: the LEXICON.md and templates/LEXICON.md Landmark, Landmark Wiki page and Map rows and the workbench-room-checks support-root entry are TK-008Z, blocked on TK-005N (S-004C PR #358) and TK-008L (S-004L PR #372); the suite now has 52 commands and the release owner's suite scripts must add test-landmark-wiki | b89a9b575a2e24d5f14ecc3d955484b686b557afe1a27ad2a30450edf4e1e375 |

## Continuation

| Run | Date | Answers | Adjusted handoff |
|---|---|---|---|
| 1 | 2026-10-06 | evidence row 15 (fail verdict at d684eaadf69a8e01e13b5ce5cf7775426d72a3aa on 2026-10-06) | the root LEXICON.md Task row still says landmark-direct Tasks have no delivered home, contradicting delivered TK-008G, while carrier-lines.md section 3 replaces only the Landmark, Landmark Wiki page and Map rows and TK-008Z verifies only the template Task row. Add the root Task row replacement to carrier-lines.md section 3 and make TK-008Z's red/green carrier check assert it |

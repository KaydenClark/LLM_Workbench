# TK-008Y - The Contract carriers and their generic mirrors name the landmark commands and meanings the runtime delivers

**Task ID:** TK-008Y
**Spec ID:** S-003Z
**Slice:** The Contract carriers and their generic mirrors name the landmark commands and meanings the runtime delivers
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: Source behavior, the generic templates, discovery and managed installation agree, and updating a room with no landmarks leaves it unchanged.
**Planned verification:** Red: `tools/test-workbench-round-trip.mjs` or `tools/test-runbook-index.mjs` gains a case asserting that `RUNBOOK.md`, `templates/RUNBOOK.md` and the Runbook operations index name the landmark commands (`move-spec --landmark`, `report|verify|verdict|approve LMK-###`, `retire-landmark`, `next-id --prefix LMK`, `claim|close|receipt|show|move-task LMK-###`, `gate --task TK-### --landmark LMK-###`) and that the Lexicon Landmark row in `LEXICON.md` and `templates/LEXICON.md` no longer says the artifact is not installed; green once the lines in [carrier-lines.md](../../carrier-lines.md) are applied, re-read against the carriers' then-current anchors. The `AGENTS.md` sentence that says landmark review tooling is only destination design is corrected in `AGENTS.md` and `templates/AGENTS.md`. `tools/test-landmark-wiki.mjs` joins the Runbook suite list if it is not otherwise run. Full Runbook suite on the committed candidate.

## Origin

New Task from TK-008J's second merge answer (PR #382): the Director's brief routes `AGENTS.md`, `RUNBOOK.md` and `LEXICON.md` lines through the single writer of the [Contract Carrier Pointer-Brief Rewrite](../../../S-004C-contract-carrier-pointer-brief-rewrite/SPEC.md), whose open PR #358 (its Task TK-005N) holds `LEXICON.md` and `templates/LEXICON.md`, so TK-008J wrote the exact proposed lines into [carrier-lines.md](../../carrier-lines.md) instead of editing the carriers. This Task applies them, by this Spec's lane or by that writer, once the Director releases the files; TK-005N is the recorded blocker because its open PR is the current holder. The [Harness Improvement Playbook Skill](../../../S-004L-harness-improvement-playbook-skill/SPEC.md) PR #372 also touches `LEXICON.md` and holds the `workbench-room-checks` skill, whose V3 support-root text omits the `landmarks` collection (carrier-lines.md names it).

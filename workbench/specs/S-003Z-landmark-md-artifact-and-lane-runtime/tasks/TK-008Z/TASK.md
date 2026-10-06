# TK-008Z - The Lexicon carriers and the room-checks skill name the delivered landmark artifact

**Task ID:** TK-008Z
**Spec ID:** S-003Z
**Slice:** The Lexicon carriers and the room-checks skill name the delivered landmark artifact
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: Source behavior, the generic templates, discovery and managed installation agree, and updating a room with no landmarks leaves it unchanged.
**Planned verification:** Red: `tools/test-runbook-index.mjs` (or the Lexicon's own carrier test) gains a case asserting that the Landmark row in `LEXICON.md` and `templates/LEXICON.md` no longer says the artifact is not installed and names the `LANDMARK.md` folders, statuses and `LMK-` prefix, that the Landmark Wiki page and Map rows match sections 3 and 4 of [carrier-lines.md](../../carrier-lines.md), that the root and template Lexicon Task rows name a landmark as a possible parent (the root row no longer says Tasks directly under a landmark have no delivered home), and that the `workbench-room-checks` skill's V3 support-root check lists the `landmarks` collection; green once those lines are applied, re-read against the then-current anchors. Full Runbook suite on the committed candidate.
**Claimed by:** claude-s003z-dispatcher

## Origin

Split from TK-008Y on 2026-10-06 by the Director's routing (option A): the Director released the `RUNBOOK.md`, `templates/RUNBOOK.md`, `AGENTS.md` and `templates/AGENTS.md` lines to this Spec, which TK-008Y applied, and kept `LEXICON.md` and `templates/LEXICON.md` with the single writer of the [Contract Carrier Pointer-Brief Rewrite](../../../S-004C-contract-carrier-pointer-brief-rewrite/SPEC.md), whose open PR #358 (its Task TK-005N) holds them. The `workbench-room-checks` skill's support-root entry also moved here because the [Harness Improvement Playbook Skill](../../../S-004L-harness-improvement-playbook-skill/SPEC.md) open PR #372 (its Task TK-008L) holds that skill file. This Task applies sections 3 and 4 of carrier-lines.md and its "Outside the six files" skill entry, by this Spec's lane or by those writers, once both files are released.

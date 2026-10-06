# TK-008Z - The Lexicon carriers and the room-checks skill name the delivered landmark artifact

**Task ID:** TK-008Z
**Spec ID:** S-003Z
**Slice:** The Lexicon carriers and the room-checks skill name the delivered landmark artifact
**Status:** done
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: Source behavior, the generic templates, discovery and managed installation agree, and updating a room with no landmarks leaves it unchanged.
**Planned verification:** Red: `tools/test-runbook-index.mjs` (or the Lexicon's own carrier test) gains a case asserting that the Landmark row in `LEXICON.md` and `templates/LEXICON.md` no longer says the artifact is not installed and names the `LANDMARK.md` folders, statuses and `LMK-` prefix, that the Landmark Wiki page and Map rows match sections 3 and 4 of [carrier-lines.md](../../carrier-lines.md), that the root and template Lexicon Task rows name a landmark as a possible parent (the root row no longer says Tasks directly under a landmark have no delivered home), and that the `workbench-room-checks` skill's V3 support-root check lists the `landmarks` collection; green once those lines are applied, re-read against the then-current anchors. Full Runbook suite on the committed candidate.
**Claimed by:** claude-s003z-dispatcher
**Proof:** PR #399 merged into integration at 2cc437b6777898162a03a384fc28f0d56340388f (merge of candidate 9c73e9d77806c9931b75d6614fd490ed7fa7aab6, which contained integration fed3805f; integration had moved to d2d7b7dd, S-004L records and Wiki only, merge-tree clean); red at 129b772a (three test-runbook-index cases); full 52-command suite DONE total=52 fail=0 on 9c73e9d7; test-runbook-index 62/0, test-control-fidelity, test-adr, test-controls-vocabulary-sweep, test-skills-lane, test-skill-catalog, test-workbench-layout, test-governance-core green; render clean; doctor no blocking finding; check-append-only CLEAN

## Origin

Split from TK-008Y on 2026-10-06 by the Director's routing (option A): the Director released the `RUNBOOK.md`, `templates/RUNBOOK.md`, `AGENTS.md` and `templates/AGENTS.md` lines to this Spec, which TK-008Y applied, and kept `LEXICON.md` and `templates/LEXICON.md` with the single writer of the [Contract Carrier Pointer-Brief Rewrite](../../../S-004C-contract-carrier-pointer-brief-rewrite/SPEC.md), whose open PR #358 (its Task TK-005N) holds them. The `workbench-room-checks` skill's support-root entry also moved here because the [Harness Improvement Playbook Skill](../../../S-004L-harness-improvement-playbook-skill/SPEC.md) open PR #372 (its Task TK-008L) holds that skill file. This Task applies sections 3 and 4 of carrier-lines.md and its "Outside the six files" skill entry, by this Spec's lane or by those writers, once both files are released.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s003z-reassembly | 2cc437b6777898162a03a384fc28f0d56340388f | ahead 0 behind 0 | 0 | PR #399 merged into integration at 2cc437b6777898162a03a384fc28f0d56340388f (merge of candidate 9c73e9d77806c9931b75d6614fd490ed7fa7aab6, which contained integration fed3805f; integration had moved to d2d7b7dd, S-004L records and Wiki only, merge-tree clean); red at 129b772a (three test-runbook-index cases); full 52-command suite DONE total=52 fail=0 on 9c73e9d7; test-runbook-index 62/0, test-control-fidelity, test-adr, test-controls-vocabulary-sweep, test-skills-lane, test-skill-catalog, test-workbench-layout, test-governance-core green; render clean; doctor no blocking finding; check-append-only CLEAN | LEXICON.md and templates/LEXICON.md Landmark, Landmark Wiki page, Map and Task rows; workbench-room-checks skill V3 support-root collection list; carrier-lines.md marked fully applied | none | 48bd71d89fa1927a4caad33bc8799a1d40d5d937705edc1bd78bb9cf53caeeb4 |

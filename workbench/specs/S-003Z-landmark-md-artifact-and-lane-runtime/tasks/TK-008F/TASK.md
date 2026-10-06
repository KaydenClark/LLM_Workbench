# TK-008F - A Spec moves into, out of or between landmarks through the link-safe move that rewrites every live reference

**Task ID:** TK-008F
**Spec ID:** S-003Z
**Slice:** A Spec moves into, out of or between landmarks through the link-safe move that rewrites every live reference
**Status:** done
**Stance:** Builder
**Blockers:** TK-008E
**Destination:** spec-acceptance: Moving a Spec into a landmark through the link-safe operation rewrites every live reference and counts the historical ones; moving it out or to another parent also works.
**Planned verification:** Red: `move-spec S-0AB --landmark LMK-0AA` is refused as an unknown option; green: `move-spec S-### --landmark LMK-###` moves an active-roster Spec directory (Tasks and all, `git mv`) under `<landmark>/specs/`, `--landmark none` moves it back to `workbench/specs/`, and a second `--landmark` moves it between parents, each reusing `collectSpecReferenceFiles`, `lifecycleMoveLocations`, `rewriteReferenceFile` and `writeDecisionRegisters` so every live Markdown reference (root controls, Wiki, skills, ADR and DDR collections, every SPEC.md and TASK.md at both homes, the landmark's own LANDMARK.md) is rewritten, the Append-Only Evidence rows are counted as historical, and the result reports `referencesRewritten` and `historicalReferencesLeft`. Refusals by name: dirty tree, no Git tree, unknown Spec or landmark, a retired landmark, a Spec already under that landmark, an occupied destination. Any status moves (a planned or active Spec gains its landmark); only `retired` keeps the complete-only rule. Targeted tests in `tools/test-spec-workbench.mjs` and `tools/test-lifecycle-directory-links.mjs`, then the full Runbook suite on the committed candidate.
**Proof:** PR #378 merged into integration at 06e8fb8498aa6d309f7f3e180b2d43d099bebfb8 (merge of candidate ee5b72ab6b687e0c7a6862e46cb0da9f97432424, base a06cb4ef); red at 0a578844 (--landmark unrecognised, moveSpecToLandmark not a function); full Runbook suite 51/51 on ee5b72ab (DONE total=51 fail=0); test-spec-workbench 60/60 plus 69 inline blocks, test-lifecycle-directory-links spec/task/landmark ok, test-diagnostics 36/36; render no diff; doctor no blocking finding; check-append-only CLEAN

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s003z-tk008h | 06e8fb8498aa6d309f7f3e180b2d43d099bebfb8 | ahead 0 behind 0 | 0 | PR #378 merged into integration at 06e8fb8498aa6d309f7f3e180b2d43d099bebfb8 (merge of candidate ee5b72ab6b687e0c7a6862e46cb0da9f97432424, base a06cb4ef); red at 0a578844 (--landmark unrecognised, moveSpecToLandmark not a function); full Runbook suite 51/51 on ee5b72ab (DONE total=51 fail=0); test-spec-workbench 60/60 plus 69 inline blocks, test-lifecycle-directory-links spec/task/landmark ok, test-diagnostics 36/36; render no diff; doctor no blocking finding; check-append-only CLEAN | Docs checked; no update needed in this Task: move-spec --landmark forms, refusals, result fields and the planner fix are routed to TK-008J by the Spec's slice plan | A move does not edit the destination LANDMARK.md child-Spec list; a move out leaves an untracked empty specs/ folder; wiki.mjs note moves still do not walk landmark Spec homes | 37b5b8c8b196eb12f57abed9ecb9943dab3c99809783e09c578f981d0318dec8 |

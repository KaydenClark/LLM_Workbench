# TK-007F - Spec approval cards read live from the Taskboard

**Task ID:** TK-007F
**Spec ID:** S-004D
**Slice:** Spec approval cards read live from the Taskboard
**Status:** ready
**Stance:** Builder
**Blockers:** TK-007C
**Destination:** spec-acceptance: Card contents, relationships, progress and evidence trace to their owners; unknowns and the distinct meanings of progress remain visible.
**Planned verification:** Red then green in tools/test-grill-board.mjs on a fixture room (the board builds one approval card per Spec whose owner gate waits on the owner from the generated JSON Taskboard, with its Spec identity, next gate and source link; a Spec whose gate changes shows the change on reload with no items.json edit; a Spec with a recorded approval leaves the board; legacy duplicate Task identities are shown honestly, not merged); then the full suite, render and doctor on the committed candidate, and one run against the real inventory.

## Scope

Replace the `approve-spec` snapshots in `items.json` with cards the board builds from the generated JSON Taskboard (`workbench/tools/taskboard.mjs`), so approvals stay on their Specs and the board only shows them (the owner, 2026-10-06: the board reads approvals from the Taskboard). Keep each card's answer identity stable across the change so earlier answers stay attached.

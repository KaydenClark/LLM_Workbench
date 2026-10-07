# TK-007H - Decision-record cards read live from the decision records

**Task ID:** TK-007H
**Spec ID:** S-004D
**Slice:** Decision-record cards read live from the decision records
**Status:** ready
**Stance:** Builder
**Blockers:** TK-007C
**Destination:** spec-acceptance: Card contents, relationships, progress and evidence trace to their owners; unknowns and the distinct meanings of progress remain visible.
**Planned verification:** Red then green in tools/test-grill-board.mjs on a fixture room (the board builds one card per decision record still waiting on the owner's confirmation from the manifest-declared ddr and adr collections, with its title, lifecycle state, full text and content hash; an accepted or superseded record leaves the board; a changed record shows a revision notice); then the full suite, render and doctor on the committed candidate, and one run against the real inventory.

## Scope

Replace the `confirm-ddr` and `confirm-text` snapshots in `items.json` with cards built from the decision records and pages themselves, so confirmations stay on their records and the board shows them (the owner, 2026-10-06). Keep each card's answer identity stable across the change.

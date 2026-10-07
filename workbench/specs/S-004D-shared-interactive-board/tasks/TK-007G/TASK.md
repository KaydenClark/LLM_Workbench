# TK-007G - Question cards read live from the Destination Question Cards

**Task ID:** TK-007G
**Spec ID:** S-004D
**Slice:** Question cards read live from the Destination Question Cards
**Status:** ready
**Stance:** Builder
**Blockers:** TK-007C
**Destination:** spec-acceptance: Card contents, relationships, progress and evidence trace to their owners; unknowns and the distinct meanings of progress remain visible.
**Planned verification:** Red then green in tools/test-grill-board.mjs on a fixture room (the board builds one card per DQC that still holds an unconfirmed answer, an uncertainty or an Aligning contribution, through workbench/tools/landmark-tracker.mjs, showing its question, answer, uncertainty, landmarks and revision; a DQC revised by an agent shows the new revision on reload and its earlier answer as Re-answer; a confirmed DQC leaves the board; the Tracker's documentation progress is shown as its own dimension, never merged with review progress); then the full suite, render and doctor on the committed candidate, and one run against the real inventory.

## Scope

Replace the `confirm-dqc` snapshots in `items.json` with cards built from the DQC records, so questions live on DQCs and the board shows them, with the generated Tracker as a read-only view (the owner, 2026-10-06). Keep each card's answer identity stable across the change.

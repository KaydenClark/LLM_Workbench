# TK-007I - Open choices and owner decisions move to their owners, and items.json retires

**Task ID:** TK-007I
**Spec ID:** S-004D
**Slice:** Open choices and owner decisions move to their owners, and items.json retires
**Status:** ready
**Stance:** Builder
**Blockers:** TK-007E, TK-007F, TK-007G, TK-007H
**Destination:** spec-acceptance: Owner can find and open connected execution and understanding cards in one browser workspace and switch views without losing artifact identity.
**Planned verification:** Red then green in tools/test-grill-board.mjs (every open choice item has a DQC or Spec blocker home and its board card is built from it; owner-decision cards come from the Spec blockers through the Taskboard; with items.json absent the board serves every pending kind and the agent commands read and apply them; no applied or withdrawn item's owner words are lost, and the history stays readable in Git); then the full suite, render and doctor on the committed candidate, and one run against the real inventory compared item by item with the last items.json.

## Scope

Carry each remaining `choice` item onto a Destination Question Card and each `owner-decision` item onto its Spec's blocker, preserving every recorded answer, note and source, then stop writing `items.json`, so the board keeps no store of its own except its comment folder (the owner, 2026-10-06: "your recommendation is exactly what I was thinking"). Update the Grill Board README's file table, agent rules and the add, revise, apply and withdraw commands to work against the owning records.

---
date: 2026-10-03
supersedes:
canonicalized_in:
  - LEXICON.md
---

# Rooms nest and a parent workbench owns what its children share

Landmark: none, Blueprint level; the owner placed this at decision-record level, not on the Blueprint.

Nesting is recorded as a decision record, not on the Blueprint, because it is bounded and situational: a room can hold other rooms, each project with its own workbench; a parent workbench owns what its children share, and a child owns only what is its own.

Why the owner chose it:

- The owner, in his own words (corrections on the round-4 cards, 2026-10-03): "This is bounded and situational. It does not land on the final blueprint. We do need this record though. a DDR."
- The owner: "DDR, not blueprint."
- The owner's note on the round-6 confirmation: "If not also an ADR". Per the note, a decision record, and possibly also an ADR for the mechanism.
- No owner reason is recorded for the ownership split itself, and none is stated here.

Considered and rejected: Putting nesting on the Blueprint. The owner rejected it: it is bounded and situational and "does not land on the final blueprint."

Consequences: None recorded as owner words. This record names the Lexicon, not the Blueprint, in canonicalized_in because the owner placed nesting off the Blueprint and the Lexicon Workbench row already says rooms nest. An accepted record already covers how a nested Workbench boots (the larger room's declared safety boundaries, then the nearest local contract, with connected systems as peers), not restated here: [LLM Workbench is the sole Workbench source; Foundry is a downstream extension](../adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md). The owner's note leaves a separate ADR for the mechanism open; this record authors none.

Provenance: the Blueprint teardown grilling of 2026-10-02 to 2026-10-03: questions GAP-5 (nesting is a decision record) and WHY-D7 (the same readback), both locked 2026-10-03, with the owner's corrections of 2026-10-03 quoted above.

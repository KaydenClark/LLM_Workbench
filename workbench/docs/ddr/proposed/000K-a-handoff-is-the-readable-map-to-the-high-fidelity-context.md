---
date: 2026-10-03
supersedes:
canonicalized_in:
  - BLUEPRINT.md
---

# A handoff is the readable map to the high-fidelity context

Landmark: Enduring context.

A handoff is a Markdown file that a new agent or chat picks up, reads and acts on. It says what high-fidelity context exists in the workbench's records and how to reach it: exactly which questions to ask in a new grilling session, or exactly where to go to do the work and where to find things, so no context is wasted redoing work. It is Markdown because Markdown is for what agents pick up, read and edit; JSON is for state, machinery and tooling.

Why the owner chose it:

- The owner, in his own words (teardown round 1, 2026-10-02): "A handoff is a markdown file not JSON because JSON is for state, machinery, and tooling. while markdowns are for things the agents actually pick up, read, and edit."
- The owner marked the deeper idea behind this as still lost in the fog: "take it with a grain of salt". That deeper idea is not part of this decision.

Considered and rejected: None recorded.

Consequences: None recorded as owner words. An accepted record already says a requested handoff is authored as a human-readable Markdown file from the relevant slice, and is not restated here: [JSON notepads preserve objective continuity](../../adr/0040-json-notepads-preserve-objective-continuity.md).

Provenance: the Blueprint teardown grilling of 2026-10-02 to 2026-10-03: question BT-D11 (a handoff is the readable map), locked 2026-10-03 on the owner's confirmed round-2 readback; reason from the owner's own words, question WHY-B5.

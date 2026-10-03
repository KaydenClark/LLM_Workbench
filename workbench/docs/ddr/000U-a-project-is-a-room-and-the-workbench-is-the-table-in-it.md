---
date: 2026-10-03
supersedes:
canonicalized_in:
  - BLUEPRINT.md
---

# A project is a room and the workbench is the table in it

Landmark: none, Blueprint level.

A project is a room. A workbench is a table set inside that room, as large as the project needs; some take up whole walls. It holds the rules, the instructions, the tools and the records, and gives agents structure and places to work. An agent goes to the workbench, reads the rules, takes the tool it needs, such as the table saw to cut a piece of wood, and goes back to work on the project in the center of the room. In LLM Workbench's own room, the project in the center is the next workbench, built with the current one, which improves as it builds. The workbench is the project's management system for that room: it manages the project. A project can exist without a workbench; a workbench needs a project, and a workbench without a project is an empty template workbench, a project not yet set up.

Why the owner chose it:

- The owner, in his own words (2026-10-02, teardown round 1): "This was all metaphor. A metaphor I want to implement and make part of the destination. I just know how to talk in metaphors a lot better than anything else."
- On building the next workbench with the current one, the same note: "The workbench its using to build that new one, is the every improving one its building. (Mainly because the ones before have been broken)."

Considered and rejected: None recorded.

Consequences: None recorded as owner words. The room and table meanings are Lexicon rows owned by the terms work; this record keeps the destination choice. No accepted record holds the room-and-table metaphor; [LLM Workbench is the sole Workbench source; Foundry is a downstream extension](../adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md) uses "room" only for the larger context a Workbench can be nested inside.

Provenance: the Blueprint teardown grilling of 2026-10-02 to 2026-10-03: question BT-D14 (a project is a room, the workbench its table), locked 2026-10-03 on the owner's confirmed round-2 readback with the management-system and dependency sentences from the owner's chat answer; reasons from the owner's own words, question WHY-D6.

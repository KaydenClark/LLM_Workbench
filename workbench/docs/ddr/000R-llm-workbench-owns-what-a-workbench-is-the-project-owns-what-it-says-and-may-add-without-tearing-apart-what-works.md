---
date: 2026-10-03
supersedes:
canonicalized_in:
  - BLUEPRINT.md
---

# LLM Workbench owns what a workbench is; the project owns what it says and may add without tearing apart what works

Landmark: Workbench Template.

1. A workbench's identity and structure belong to LLM Workbench, because LLM Workbench is in charge of its versions: which artifacts a workbench has, what each is for and how it works. A project that uses the workbench uses all of it; it cannot drop AGENTS.md, the Lexicon or the Taskboard because it does not want them. What those artifacts say belongs to the project: it creates, updates and maintains its own instructions, Runbook, Blueprint and records, because LLM Workbench cannot know what they need to say. When a project genuinely needs to change how an artifact works, it records why, visibly, so the change can be audited. A project moves to a new version only when the owner asks.

2. A room may add what its work needs: new skills, new kinds of scaffolding, its own Runbook content. It may not tear apart parts of the workbench that are proven to work.

Why the owner chose it:

- The owner, in his own words (2026-10-02, teardown round 1): "if we gave every project free rein to modify its workbench however it liked, then their workbench would break... like if I started changing the code for Windows 11... we cant trouble shoot it the same."
- The owner (2026-10-03, teardown round 2): "if they do need to change something about how the artifacts work, we want to know why for the audit review."
- For the version rule, the owner's confirmed reason: One installed version has to stay troubleshootable as one thing, and the owner decides when changes ship; an update that arrived on its own would break both.
- For room additions, the owner's confirmed reason: each workbench is the ever-improving one it is building, because the earlier ones broke. The owner's note: "Yes, if a deployed needs a new skill, or to change what is on their runbook. They can."

Considered and rejected: None recorded.

Consequences: None recorded as owner words. Accepted records that cover part of this, not restated here: [Visible, deliberate control divergence](../adr/0050-visible-deliberate-control-divergence.md) (a room's divergence is visible and its disposition recorded), [Core, personal/shared and room-local skill ownership](../adr/0046-core-personal-shared-and-room-local-skill-ownership.md) and [Core skills ship in the workbench skills lane](../adr/000M-core-skills-ship-in-the-workbench-skills-lane.md) (room-local skills), and [Preservation contracts for genesis, adoption and upgrade](../adr/0047-preservation-contracts-for-genesis-adoption-and-upgrade.md) (explicit, backed-up updates).

Provenance: the Blueprint teardown grilling of 2026-10-02 to 2026-10-03: questions BT-D9 (identity and structure belong to LLM Workbench) and GAP-7 (a room may add), both locked 2026-10-03; reasons from the owner's own words, question WHY-D4, and the confirmed whys, questions WHY-D4a and WHY-D8 (the room-additions half).

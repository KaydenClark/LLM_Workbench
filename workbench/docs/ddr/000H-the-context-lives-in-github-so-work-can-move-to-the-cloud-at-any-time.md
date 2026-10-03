---
date: 2026-10-03
supersedes:
canonicalized_in:
  - BLUEPRINT.md
---

# The context lives in GitHub, so work can move to the cloud at any time

Landmark: Work from anywhere.

Everything an agent needs to continue a project lives in the project's GitHub repository. The owner can move the work to the cloud at any time, and any agent, in a cloud session or on any of the owner's devices, picks up the full context from GitHub and continues where the last session left off. Nothing it needs lives only on one machine, in one chat, or in the owner's private skills catalog.

Why the owner chose it:

- The owner, in his own words (2026-10-02): "We are using LLMs on the internet. this Landmark is about being able to use the cloud whenever we want and always being able to pick up the context from github."
- The owner, in his own words (2026-10-02, teardown round 1): "The workbench is the complete handoff package, its everything the agent needs to pick up where the last session left off and continue."
- On the related claim that any provider can use the workbench, the owner's confirmed reason: Claude Code and Codex are both harnesses the owner runs, and the workbench is what they both use, so it lives in plain repository files and small tools any provider can drive with one action. The owner's note: "With the understanding we are only working with claude and codex. so I dont know if it works with gemini and the antigravity harness, or even outside of the claude and codex harness, like just in the Terminal and CLI. but those would be longer term goals."

Considered and rejected: None recorded.

Consequences: None recorded as owner words. Accepted records that touch this, not restated here: [Core skills ship in the workbench skills lane](../adr/000M-core-skills-ship-in-the-workbench-skills-lane.md) (skills ship in the room so a cloud instance starts from the repository alone) and [Workbench continuity through maintained owners](../adr/0043-workbench-continuity-through-maintained-owners.md) (recovery from maintained owners).

Provenance: the Blueprint teardown grilling of 2026-10-02 to 2026-10-03: question BT-D1 (context lives in GitHub), locked 2026-10-03; reasons from questions WHY-C1, WHY-B4 and WHY-C6.

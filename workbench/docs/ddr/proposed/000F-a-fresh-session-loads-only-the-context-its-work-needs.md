---
date: 2026-10-03
supersedes:
canonicalized_in:
  - BLUEPRINT.md
---

# A fresh session loads only the context its work needs

Landmark: Context efficiency.

Through progressive disclosure, a fresh session loads only the context its work needs and recovers the owner's intent, settled decisions, unfinished obligations and open questions without the owner reconstructing the conversation.

Why the owner chose it:

- On the always-loaded layer, the owner, in his own words (2026-10-02, DDR and control-surface grilling): "I kinda hate that we hard wrote all of that into AGENTS and the LEXICON. I thought that was the point of the skill and the role was so that those things didnt have to be written into and bloat up the contract."
- The owner (2026-09-15, foundation ownership): "why does an agent need to even know about a superseded or rejected ADR unless they need to look up what replaced it's history"
- On recovery, the owner, in his own words (2026-10-02, teardown round 1): "The workbench is the complete handoff package, its everything the agent needs to pick up where the last session left off and continue."

Considered and rejected: None recorded.

Consequences: None recorded as owner words. Accepted records that already cover part of this (progressive disclosure for the always-loaded carriers; recovery from maintained owners; reachable obligations), not restated here: [Contract carriers are briefs that point to skills and authority flows through the pointer](../../adr/000W-contract-carriers-are-briefs-that-point-to-skills-and-authority-flows-through-the-pointer.md), [Workbench continuity through maintained owners](../../adr/0043-workbench-continuity-through-maintained-owners.md) and [Traverse, don't search is core Workbench navigation](../../adr/0042-traverse-dont-search-is-core-workbench-navigation.md).

Provenance: the Blueprint teardown grilling of 2026-10-02 to 2026-10-03: question BT-D19 (a session loads only what its work needs), locked 2026-10-03 on the round-6 card; reasons from questions WHY-B2 and WHY-B4.

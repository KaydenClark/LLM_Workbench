---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Director
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its second Wiki lexicon batch Task (TK-009I), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/docs/adr/000V-captain-director-dispatcher-and-worker-scope-work-and-role-skills-own-each-job.md
  - workbench/skills/director/SKILL.md
last_verified: 2026-10-07
---

# Director: the landmark-lane role

As the accepted destination, the Director is the role scoped to one landmark
lane: it assigns the lane's Dispatchers and owns the landmark's review. The
canonical definition is the [glossary entry](../../GLOSSARY.md#chats-and-roles).

**What it means here.** Today's `AGENTS.md` and the director skill still use Director for the integration role, which becomes the Captain ([ADR-000V](../docs/adr/000V-captain-director-dispatcher-and-worker-scope-work-and-role-skills-own-each-job.md)). It never executes a Task or gains authority by occupying a lane or branch.

**Neighbouring words.** It works under the [Captain](dictionary-captain.md) and
above the [Dispatchers](dictionary-dispatcher.md) of its
[Landmark](dictionary-landmark.md)'s Specs, and owns that landmark's
[Review](dictionary-review.md). Today's Director is also the separate reviewer
in [Assembled-Spec review](dictionary-assembled-spec-review.md).

**In use.** The Runbook's assembled-review step asks for a separate Director to
review an immutable Spec candidate: that is today's integration-scale Director.
In the destination, the Director of one landmark lane, such as the Repo is the
System of Record landmark, assigns that lane's Dispatchers and owns its review.

## Sources

- [GLOSSARY.md, Chats and roles](../../GLOSSARY.md#chats-and-roles): the canonical definition.
- [The roles decision (ADR-000V)](../docs/adr/000V-captain-director-dispatcher-and-worker-scope-work-and-role-skills-own-each-job.md): the Director of a landmark lane.
- [The review ladder decision (DDR-001B)](../docs/ddr/001B-review-climbs-the-ladder-task-by-automated-proof-spec-by-agent-review-landmark-by-integrated-automated-review-and-the-owner-judges-the-concept.md): what a landmark review is.
- [The `director` skill](../skills/director/SKILL.md): today's Director job.

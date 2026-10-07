---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Support lane
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its third Wiki lexicon batch Task (TK-009J), 2026-10-07: the retiring Lexicon entry's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/manifest.json
  - workbench/docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md
last_verified: 2026-10-07
---

# Support lane: one of the seven slots under workbench/

A support lane is one of the seven slots the manifest declares under the lowercase `workbench/` directory: `docs`, `specs`, `wiki`, `sessions`, `feedback`, `tools` and `skills`. The canonical definition is the [glossary entry](../../GLOSSARY.md#governance-core).

**What it means here.** A lane is a structural slot, not a plane ([ADR-000M](../docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md), superseding the six-lane [ADR-0017](../docs/adr/archive/0017-workbench-support-directory-has-six-lanes.md)).

**Neighbouring words.** The lanes are declared by the [Support root](dictionary-support-root.md)'s manifest, and each may hold [Collections](dictionary-collection.md). The `skills` lane is the [Skills lane](dictionary-skills-lane.md) and the `tools` lane holds each [Managed runtime tool](dictionary-managed-runtime-tool.md). A lane is never a [Governance Plane](dictionary-governance-plane.md).

**In use.** `workbench/manifest.json` maps each lane name to its path, for example `"specs": "workbench/specs"`. The `specs` lane holds Canon, Grounding and Projection claims side by side, which is why a lane is a structural slot and not a plane.

## Sources

- [GLOSSARY.md, Governance core](../../GLOSSARY.md#governance-core): the canonical definition.
- [The skills lane decision (ADR-000M)](../docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md): the seventh lane.
- [The six-lane decision it superseded (ADR-0017)](../docs/adr/archive/0017-workbench-support-directory-has-six-lanes.md): kept in the ADR archive.

---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Governance Plane
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its third Wiki lexicon batch Task (TK-009J), 2026-10-07: the retiring Lexicon entry's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/docs/adr/000A-active-adr-decisions-and-destination-blueprints.md
last_verified: 2026-10-07
---

# Governance Plane: the role one claim plays in one operation

A Governance Plane is the role a single claim plays in a single operation: Intent, Canon, Grounding, Enduring Context, Actuality or Projection. The plane belongs to the claim and its use, so one file can hold claims on several planes. The canonical definition is the [glossary entry](../../GLOSSARY.md#governance-core).

**What it means here.** Planes classify claims and their use, never whole files, directories, or artifact types. One assigned spec carries Canon, Projection, Grounding, and Enduring Context claims at once ([ADR-000A](../docs/adr/000A-active-adr-decisions-and-destination-blueprints.md)).

**Neighbouring words.** [State resolution](dictionary-state-resolution.md) reconciles a Canon claim with verified Actuality. The [Writer verb](dictionary-writer-verb.md) is the workflow verb at which a claim on each plane is written, and [Confirm](dictionary-confirm.md) is the gate a claim passes from Intent to Enduring Context. A [Support lane](dictionary-support-lane.md) is a structural slot, never a plane.

**In use.** For this Task: the owner's request to implement the Spec is Intent; `AGENTS.md` and the Spec's acceptance criteria are Canon; the red commit and the suite log are Grounding; the Wiki and the decision records consulted are Enduring Context; the files changed are Actuality; `TASKBOARD.md` is a Projection. The Spec itself carries claims on several planes at once: its acceptance criteria are Canon and its evidence log is Grounding.

## Sources

- [GLOSSARY.md, Governance core](../../GLOSSARY.md#governance-core): the canonical definition.
- [The active ADR decisions and destination Blueprints decision (ADR-000A)](../docs/adr/000A-active-adr-decisions-and-destination-blueprints.md): planes classify claims, and one Spec carries several.
- [Governance Planes, ADR Decisions And Scoped Diagnostics](features/governance-planes-adr-decisions-and-scoped-diagnostics.md): the feature article.

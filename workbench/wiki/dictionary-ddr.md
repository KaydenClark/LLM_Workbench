---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: DDR
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its third Wiki lexicon batch Task (TK-009J), 2026-10-07: the retiring Lexicon entry's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/docs/ddr/REGISTER.md
  - workbench/docs/adr/000S-destination-decision-records-are-decision-records-beside-adrs.md
last_verified: 2026-10-07
---

# DDR: a destination decision record

A DDR, a Destination Decision Record, keeps one consequential choice about what the finished product must be or do, and why the owner chose it over the alternatives. DDRs live in their own `ddr` collection, `workbench/docs/ddr/`, beside the ADRs, with the ADR's layout and lifecycle. The canonical definition is the [glossary entry](../../GLOSSARY.md#governance-core).

**What it means here.** Each DDR belongs to exactly one landmark, or to the Blueprint when no landmark holds it ([ADR-000U](../docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md)). Created at Map ([ADR-000X](../docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md)); not a Destination Question Card, a Wiki page or a Blueprint paragraph. The Blueprint, then DDRs, then ADRs: describe the destination, record the directions taken, record the choices made. A DDR that contradicts the Blueprint updates it through `canonicalized_in`, which never names the Wiki. `adr.mjs new --kind ddr` writes the next one into `proposed/`; how a DDR records its landmark is still open ([ADR-000S](../docs/adr/000S-destination-decision-records-are-decision-records-beside-adrs.md)).

**Neighbouring words.** It is one kind of [Decision Record](dictionary-decision-record.md), beside the [ADR](dictionary-adr.md). Each belongs to one [Landmark](dictionary-landmark.md) or to the Blueprint. It is not a [Destination Question Card](dictionary-destination-question-card.md), which gathers questions before they are decided. DDRs are written at [Map](dictionary-map.md).

**In use.** The Lexicon retirement decision, DDR-001E, is this Spec's destination: it lives at `workbench/docs/ddr/001E-the-lexicon-retires-...md` and is listed in `workbench/docs/ddr/REGISTER.md`. A new one is drafted with `node workbench/tools/adr.mjs new --kind ddr`, which writes it into `workbench/docs/ddr/proposed/` until it is accepted.

## Sources

- [GLOSSARY.md, Governance core](../../GLOSSARY.md#governance-core): the canonical definition.
- [The decision records decision (ADR-000S)](../docs/adr/000S-destination-decision-records-are-decision-records-beside-adrs.md): the `ddr` collection and its tool.
- [The landmarks decision (ADR-000U)](../docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md): each DDR belongs to one landmark or the Blueprint.
- [The DDR register](../docs/ddr/REGISTER.md): the derived list.

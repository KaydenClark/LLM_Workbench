---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Seeded from the current answers of the Workbench and Project Relationships landmark's question cards (landmark record revision 1), 2026-10-04
source_paths:
  - workbench/landmark-tracker/landmarks
  - workbench/landmark-tracker/destination-questions
  - workbench/docs/ddr/000W-rooms-nest-and-a-parent-workbench-owns-what-its-children-share.md
  - workbench/docs/ddr/000U-a-project-is-a-room-and-the-workbench-is-the-table-in-it.md
  - workbench/docs/adr/0038-setup-proof-precedes-feedback-reporting.md
parent: none
authorized_by: the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages)
last_verified: 2026-10-04
---

# Landmark: Workbench and Project Relationships

This page is the evolving synthesis of the Workbench and Project Relationships
landmark
(landmark ["Workbench and Project Relationships" (LMK-000E)](../../landmark-tracker/landmarks/LMK-000E.json)).
It sums up, in prose, what the landmark's two question cards currently say and
is updated whenever one of them changes. The cards and the landmark record keep
the structured account and the lineage; the decision records named below
govern. The artifact chain the cardinalities describe is explained in
[The Three Altitudes Of Delivery](delivery-altitudes.md).

## What the landmark is

The landmark asks how a Workbench and the project it serves contain and own one
another, how rooms nest, and when a coordinating "master" Workbench would be
justified. It matters because ownership and shared context that are left vague
let a parent and a child Workbench both claim, or both ignore, the same truth.

## Current accepted answers

For both cards the source answers were settled by the owner in their grilling
sessions; the cards' grouping and titles are agent work and were not separately
confirmed, so this page states the settled answers as claims and the grouping as
structure only.

**The cardinalities.** The card records that a Workbench is a "room" that holds
many Workbenches and many Projects, and that each Project has exactly one
Workbench of its own. A Workbench is one set of Contract and routing artifacts
with one Blueprint. A Blueprint has many Specs and many Tasks; a Spec has many
Tasks and many Chats; and a Task maps to one Chat. Spec is the destination and
Task the steps, and small work may be a standalone Task
(card [DQC-000M: "How do rooms and projects contain and own one another?"](../../landmark-tracker/destination-questions/DQC-000M.json), revision 5).
The expected delivery was a Lexicon update, a durable artifact-model article
with a diagram, and ownership-map relation rows, so agents can see the one-to-many
model; read the glossary and the owning Specs for what exists today rather than
this page.

**When a Master Workbench is justified.** Validate through real, contrasting
existing Workbenches and products, not artificial pilots; the candidates
include LLM Workbench, Master Workbench, GPT_OS, Cashflow Calculator, CIC,
OpenBrain and Foundry, and the next one is picked from live owner priorities.
Each proof must show owner-useful delivery, named verification and truthful
fresh-session continuation. Master Workbench is revisited only when several such
proofs show a concrete need for its registry, observation audit or
visualization role (card [DQC-000N: "What demonstrated need would justify a Master Workbench?"](../../landmark-tracker/destination-questions/DQC-000N.json), revision 5).
The decision record
[Chat-only setup proof precedes feedback reporting](../../docs/adr/0038-setup-proof-precedes-feedback-reporting.md)
carries the consequence that a Master Workbench is deferred until real
contrasting deliveries establish an observation need.

## Open and unresolved

- The first card records its own gap: the cardinality answer does not fully
  specify inheritance or shared-context behavior between nested rooms. A newer
  decision record,
  [Rooms nest and a parent workbench owns what its children share](../../docs/ddr/000W-rooms-nest-and-a-parent-workbench-owns-what-its-children-share.md),
  states the ownership split (a parent owns what its children share, a child
  owns only its own) and points to
  [LLM Workbench is the sole Workbench source; Foundry is a downstream extension](../../docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md)
  for how a nested Workbench boots. Whether those together close the card's gap
  is not confirmed.
- Words conflict. The card uses "room" for the Workbench itself, as the thing
  that holds other Workbenches and Projects. The newer decision record
  [A project is a room and the workbench is the table in it](../../docs/ddr/000U-a-project-is-a-room-and-the-workbench-is-the-table-in-it.md)
  (2026-10-03) makes the project the room and the Workbench the table in it,
  and says the older record uses "room" only for the larger context a Workbench
  can be nested inside. The card still records the earlier wording and this
  page does not choose between them; the newer record and the glossary govern
  the terms.
- A Task directly under the Blueprint, with no Spec, and a Task directly under
  a landmark remain accepted destination design. The Lexicon says they have no
  delivered home today, so the card's "standalone Task" is not yet an
  implemented path.
- Which real Workbenches serve as the proofs, and whether any proof has shown a
  need for Master Workbench, is not recorded on the card; the answer is a rule
  for choosing, not a result.

## Where the work lives

The cardinalities and room wording are owned by the [glossary](../../../GLOSSARY.md#workbench-room-and-artifacts)
and by the decision record
[A Task is a standalone artifact and Task replaces Ticket as the execution-slice term](../../docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md).
The ownership-map relation rows are planned in the
[Ownership Map Root Control Spec (S-00G)](../../specs/S-00G-ownership-map-root-control/SPEC.md).
The Master Workbench deferral is recorded in the completion result of
[S-027 - Workbench Boundaries for v3.1.1](../../specs/S-027-workbench-v3-1-1-boundaries/SPEC.md).
The nesting and room-and-table decisions live beside the Blueprint as destination
decision records; see
[Decision records and the concept map](decision-records-and-the-concept-map.md).

## Related pages

- [Landmark: Workbench Boundaries](landmark-workbench-boundaries.md): where the Workbench stops and the Foundry begins.
- [Task artifact and lifecycle](task-artifact-and-lifecycle.md): the Task as an artifact.

## Evidence and Sources

- [Landmark record "Workbench and Project Relationships" (LMK-000E)](../../landmark-tracker/landmarks/LMK-000E.json): title, summary, importance and history.
- The two question cards named above, each at the revision cited: they hold the answers, confirmation basis, open uncertainties and named claims this page summarizes.
- [The Wiki is the evolving synthesis every agent reads and updates](../../docs/adr/000R-the-wiki-is-the-evolving-synthesis-every-agent-reads-and-updates.md): why this page exists.

## History

- 2026-10-04: created by the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages), seeded from the cards' current answers.
- 2026-10-07: Re-pointed the retiring Lexicon's links and live routes to `GLOSSARY.md`, `ARCHITECTURE.md` and the Wiki lexicon articles (the Lexicon Retirement Spec (S-004O), its consumer re-pointing Task (TK-009F)); no claim changed.

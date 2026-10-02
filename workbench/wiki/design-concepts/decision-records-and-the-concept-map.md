---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-confirmed grilling of 2026-10-01 on Destination Decision Records, promoted 2026-10-02
source_paths:
  - LEXICON.md
  - workbench/docs/adr/000S-destination-decision-records-are-decision-records-beside-adrs.md
parent: none
authorized_by: the owner's promotion of the 2026-10-01 grilling
last_verified: 2026-10-02
---

# Decision Records and the Concept Map

A Workbench keeps a few kinds of artifact that together tell an agent where the
work is headed, which direction it has taken and what was chosen along the way.
This page explains how they fit together and why. It authorizes nothing; the
sources at the end govern.

## The chain

Three layers, in order: the Blueprint, then Destination Decision Records, then
ADRs. In the owner's words: describe the destination we want to reach, record
the directions we go, record the choices we made along the way.

- **The Blueprint** is the destination: what the product is, who it serves, its
  promised outcomes and its non-goals, on one short high-level page. It is how a
  project tells every agent, whatever task or Spec it is in, where the work is
  headed in the long term, so that agents are not siloed from each other. It is
  written first and is not built from decisions afterward. It is not a router to
  the decisions and links no record that carries an identifier. This is the
  accepted destination; the present Blueprint is longer and is planned to be taken apart.
- **A Destination Decision Record (DDR)** is a direction: one consequential
  choice about what the finished product must be or do, and why the owner chose
  it over the alternatives. An agent reads the DDRs to learn which way the
  project is going toward the destination.
- **An ADR** is a choice made along the way: one consequential architectural
  choice, how the system is built, with its rationale.
- **Landmarks and Specs** are built on those choices. A landmark is an evolving
  account of a feature or framework pillar; a Spec delivers one scoped
  capability. The Blueprint, DDRs, landmarks and Specs together form the concept
  map. Landmarks and Specs are built on the consequential choices the two
  decision records hold; the Blueprint is written first and is not built from
  them.

## Telling a DDR from an ADR

One test: would the decision still hold if the architecture were rebuilt
differently? If yes, it is a DDR. If it is how the system is built, it is an
ADR. One decision may need both; they link rather than merge. The owner's
example from the grilling: that agents operate the Workbench by pressing buttons
is a destination choice, so it is a DDR.

A Spec keeps the scoped, testable acceptance for one capability; neither kind of
decision record replaces it.

## How a DDR is born and lives

A DDR is atomic, like an ADR: one per consequential decision, never one per
locked answer or per question card, so no one sorts through hundreds of answers
to find what was decided and why. It is born when the owner confirms the
decision, the same way an ADR is. Its layout and lifecycle are the ADR's, adapted
where a destination record needs it: its own collection beside the ADRs, folder
location as lifecycle, whole-record supersession, a derived register. The
owner's limit is that a DDR must still serve as a destination record, not an
architecture record. A DDR that contradicts the Blueprint obliges
the Blueprint to be updated, the way an ADR changes the rest of the Contract.

## How the Wiki relates

The Wiki is the evolving synthesis every agent reads and updates. It cites DDRs
by name and context and keeps no page per DDR; the decisions fold into the
summaries and the big picture, and the DDR stays the owner of the decision. This
page is that kind of synthesis: a concept page for a term that needs more than
its Lexicon row.

## Where this stands

The destination is accepted and partly installed. The Lexicon defines the
Decision Record, the DDR and the Blueprint's new role, and the decision record
below records the choice. Not yet installed: the DDR collection, its commands,
and the accept, supersede and deprecate moves, all for a Decision Record tooling
Spec that is not yet written. The first DDRs will come from taking the existing
Blueprint apart; the owner grills those candidates first, and a later Spec
drafts them into the proposed folder for review. How that decomposition sorts
the Blueprint's content beyond the decisions is still open.

## Evidence and Sources

- [ADR-000S, Destination Decision Records are decision records beside ADRs](../../docs/adr/000S-destination-decision-records-are-decision-records-beside-adrs.md):
  the decision this page explains.
- [Lexicon](../../../LEXICON.md): the Decision Record, DDR and Blueprint
  definitions.
- [ADR-000A, Active ADR decisions and destination Blueprints](../../docs/adr/000A-active-adr-decisions-and-destination-blueprints.md)
  and [ADR-000G, Blueprint, Spec and Task are three altitudes of one delivery chain](../../docs/adr/000G-blueprint-spec-and-task-are-three-altitudes-of-one-delivery-chain.md):
  the active-decision and delivery-chain rules this builds on.
- [ADR-000R, The Wiki is the evolving synthesis every agent reads and updates](../../docs/adr/000R-the-wiki-is-the-evolving-synthesis-every-agent-reads-and-updates.md):
  why the Wiki synthesizes rather than keeping a page per decision.

## History

- 2026-10-02: created in the promotion of the owner's 2026-10-01 grilling on
  Destination Decision Records.

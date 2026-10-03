---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-confirmed grilling of 2026-10-01 on Destination Decision Records, promoted 2026-10-02
  - Owner-confirmed grilling of 2026-10-02 on landmarks, roles and the Contract carriers
source_paths:
  - LEXICON.md
  - workbench/docs/adr/000S-destination-decision-records-are-decision-records-beside-adrs.md
  - workbench/docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md
  - workbench/specs/S-003X-decision-record-tooling/SPEC.md
parent: none
authorized_by: the owner's promotions of the 2026-10-01 and 2026-10-02 grillings
last_verified: 2026-10-03
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

- **The Blueprint** is the destination. It is how a project tells every agent, whatever task or Spec it is in, where the work is
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
- **Landmarks and Specs** are built on those choices. The Blueprint, the
  decision records (DDRs and ADRs), landmarks and Specs together form the
  concept map, which is a different thing from the Lexicon's Context Map: that
  one routes questions to owners. The owner said all of them are built on the
  consequential choices, and also that the Blueprint cannot be built from DDRs
  and ADRs. The owner's workflow of 2026-10-02 settles how both hold: the
  Blueprint comes first, and landmarks form later from groupings of decisions.

## The map at two scales

The owner's workflow, in order: defining a destination creates the Blueprint;
aligning on it creates Destination Question Cards and DDRs; implementing
creates Specs and Tasks; decisions made from the implementation update ADRs and
DDRs; groupings that form in the cards and DDRs create landmarks.

As the accepted destination, a landmark is a `LANDMARK.md` artifact: basically
a Spec with a much larger scope, saying which way the work goes and what
success looks like. Landmarks and Specs are the map at two scales; Tasks are
the steps taken on it. A Spec belongs to at most one landmark and a DDR to
exactly one, or else to the Blueprint, so no record is pulled toward two
destinations. Spec folders will nest inside their landmark's folder, so one
link down the landmark, Spec and Task path carries every parent.

That link is most of what the owner calls the **Destination Packet**:
everything an agent needs to work out the destination and direction of its
current objective, carry it out and check it got there. It is only links on a
question card or a Task, never a second record telling the agent where to go.

A landmark is a lane, not a branch, so its Specs reach integration as soon as
their own reviews pass. Before it retires into its Landmark Wiki page, the
landmark gets the same review a Spec gets, one size up: a check that its
direction was reached and all its children are done, a separate Director's
review, then the owner's approval. The `LANDMARK.md` is the raw source that
page synthesizes; the two are different documents.

## Telling a DDR from an ADR

One test: would the decision still hold if the architecture were rebuilt
differently? If yes, it is a DDR. If it is how the system is built, it is an
ADR. One decision may need both; they link rather than merge. The owner's
example from the grilling: that agents push buttons on the Workbench
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
Decision Record, the DDR and the Blueprint's standing as a standalone page, and the decision record
below records the choice. The `ddr` collection itself is installed: a fresh room
and an updated room hold `workbench/docs/ddr/` with its `proposed/` and
`archive/` folders, still empty. Not yet installed: the command that writes a
DDR, the accept, supersede and deprecate moves and the shared read words. The
[Decision Record Tooling Spec (S-003X)](../../specs/S-003X-decision-record-tooling/SPEC.md)
delivers them; it was planned on 2026-10-03 with the DDR tooling reusing the ADR
runtime, one tool for both kinds of record. The first DDRs will come from taking the existing
Blueprint apart; the owner grills those candidates first, and a later Spec
drafts them into the proposed folder for review. The rest of the Blueprint
splits three more ways: destination chunks that group several decisions become
landmarks, explanations of durable models become design-concept articles, and
what remains is one short page saying what the product is, who it serves, its
promised outcomes and its non-goals. Landmarks as artifacts are not installed
either; the planned
[LANDMARK.md Artifact And Lane Runtime Spec (S-003Z)](../../specs/S-003Z-landmark-md-artifact-and-lane-runtime/SPEC.md)
delivers them, and settles how a DDR records the one landmark it belongs to.

## Evidence and Sources

- [ADR-000S, Destination Decision Records are decision records beside ADRs](../../docs/adr/000S-destination-decision-records-are-decision-records-beside-adrs.md):
  the decision this page explains.
- [Decision record: Landmarks are LANDMARK.md artifacts one size above Specs](../../docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md):
  the map at two scales, the Destination Packet and the rest of the Blueprint split.
- [Lexicon](../../../LEXICON.md): the Decision Record, DDR, Blueprint, Landmark,
  Map and Destination Packet definitions.
- [ADR-000A, Active ADR decisions and destination Blueprints](../../docs/adr/000A-active-adr-decisions-and-destination-blueprints.md)
  and [ADR-000G, Blueprint, Spec and Task are three altitudes of one delivery chain](../../docs/adr/000G-blueprint-spec-and-task-are-three-altitudes-of-one-delivery-chain.md):
  the active-decision and delivery-chain rules this builds on.
- [ADR-000R, The Wiki is the evolving synthesis every agent reads and updates](../../docs/adr/000R-the-wiki-is-the-evolving-synthesis-every-agent-reads-and-updates.md):
  why the Wiki synthesizes rather than keeping a page per decision.

## History

- 2026-10-02: created in the promotion of the owner's 2026-10-01 grilling on
  Destination Decision Records.
- 2026-10-02: added the map at two scales, the Destination Packet and the rest of
  the Blueprint split, from the owner-confirmed grilling of 2026-10-02.
- 2026-10-03: named the two Specs that deliver the DDR tooling and the landmark
  artifact, now that both exist, and the tooling Spec's Plan decision to reuse
  the ADR runtime.
- 2026-10-03: recorded the installed, still empty `ddr` collection.

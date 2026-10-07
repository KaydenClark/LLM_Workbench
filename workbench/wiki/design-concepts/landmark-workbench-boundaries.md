---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Seeded from the current answers of the Workbench Boundaries landmark's question cards (landmark record revision 1), 2026-10-04
source_paths:
  - workbench/landmark-tracker/landmarks
  - workbench/landmark-tracker/destination-questions
  - workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md
  - workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md
  - workbench/docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md
parent: none
authorized_by: the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages)
last_verified: 2026-10-04
---

# Landmark: Workbench Boundaries

This page is the evolving synthesis of the Workbench Boundaries landmark
(landmark ["Workbench Boundaries" (LMK-000C)](../../landmark-tracker/landmarks/LMK-000C.json)).
It sums up, in prose, what the landmark's four question cards currently say and
is updated whenever one of them changes. The cards and the landmark record keep
the structured account and the lineage; the decision records and Specs named
below govern. The related landmark on how rooms and projects nest has its own
page, [Landmark: Workbench and Project Relationships](landmark-workbench-and-project-relationships.md).

## What the landmark is

The landmark asks where the Workbench stops: which dependencies stay optional,
which machinery belongs to the Foundry rather than the base Workbench, and what
role the owner's personal skill catalog keeps. It matters because a boundary
drawn too wide makes every room depend on things it cannot always have, and one
drawn too narrow leaves a promised capability without an owner.

## Current accepted answers

For the three answered cards, the source answers were settled by the owner in
their grilling sessions. The cards' grouping and titles are agent work and were
not separately confirmed, so this page states the settled answers as claims and
treats the grouping as structure only.

**A room works without the personal catalog.** A fresh room must be fully set up
without the owner's private skills repository, and Genesis and Adoption
complete from public Workbench-owned templates, tools and skill packages. No
substitution contract is needed because the public product neither validates
nor depends on that catalog (card [DQC-000J: "Which dependencies must remain optional for a room to function?"](../../landmark-tracker/destination-questions/DQC-000J.json), revision 9).
If a skill is needed it ships in the room's skills lane; the personal catalog
stays a backup of all skills and a place any workbench can publish skills it
creates. The Contract names only skills that ship in the lane, and the specific
list of candidate skills to add was not confirmed
(card [DQC-001B: "What role should a shared personal skill catalog retain?"](../../landmark-tracker/destination-questions/DQC-001B.json), revision 7).
The delivered shape of that lane is recorded in the decision record
[Core skills ship in the workbench skills lane](../../docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md),
which also says the doctor never reads the personal catalog.

**Coordination machinery stays outside the base Workbench.** FUIDs, Job Orders, flights, Claims, Journal/CAS, Halls, sockets, the Captain,
CIC, scheduling and runtime visibility remain
Foundry augmentation, and the portable Workbench imports none of that runtime.
The aim is a Workbench good enough, current and safely reusable in other
projects while the Foundry finishes, without redesigning it into the Foundry or
adding optional architecture; broad guidebook taxonomy, orchestration, a
generalized plugin or catalog architecture, unrelated pending skills and
aesthetic refactors are out. A coordinator is planned: first prove that a single
Task executes consistently every time, with the coordinator built later and
planned on the Blueprint, not built in the current rollout
(card [DQC-000K: "Which coordination machinery belongs outside the base Workbench?"](../../landmark-tracker/destination-questions/DQC-000K.json), revision 10).
The base-versus-augmentation split is recorded in the decision records
[Workbench supplies the base and Foundry adds coordination](../../docs/adr/0015-workbench-base-and-foundry-capabilities.md)
and [LLM Workbench is the sole Workbench source; Foundry is a downstream extension](../../docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md).

## Open and unresolved

- Whether a portable unattended runner is required waits until single-Task
  execution is proven consistent; the owner set it as backlog after v4, so it
  is deferred, not decided.
- The card [DQC-003B: "How should recurring approved maintenance fit the work model?"](../../landmark-tracker/destination-questions/DQC-003B.json), revision 4, has no answer and no
  confirmation: it asks whether recurring approved data-retrieval or
  maintenance actions exist that the present contract cannot express, and no
  owner answer is recorded.
- Which non-core skills should join the skills lane is not confirmed; the
  candidate list is tentative and owner review of it is open work in the
  portable-Workbench Spec.
- Both skills cards and the coordination card describe the Foundry boundary as
  it stood when answered; a newer decision record,
  [Every workbench is built to run as one room among many in an autonomous factory, the Foundry](../../docs/ddr/000X-every-workbench-is-built-to-run-as-one-room-among-many-in-an-autonomous-factory-the-foundry.md),
  adds that every workbench is still designed to run as one room among many, so
  the boundary is independence of the base, not unconcern with the Foundry.
  Inference: the cards need no change, but a reader should take both together.

## Where the work lives

Delivered by [S-021 - Portable Workbench v3](../../specs/S-021-portable-workbench-v3/SPEC.md),
which lists the Foundry concepts as non-goals, and by
[Portable Workbench (S-00V)](../../specs/S-00V-portable-workbench/SPEC.md), which
holds the skills-lane and catalog-review work. The ownership scopes for skills
are in the decision record
[Core, personal/shared and room-local skill ownership](../../docs/adr/0046-core-personal-shared-and-room-local-skill-ownership.md).
The Blueprint states that the portable Workbench does not import Foundry
machinery ([BLUEPRINT](../../../BLUEPRINT.md)); the glossary defines the Foundry
as a downstream extension ([GLOSSARY](../../../GLOSSARY.md#project-specific-terms)); the skills-lane
procedure is in [RUNBOOK](../../../RUNBOOK.md).

## Related pages

- [Landmark: Workbench and Project Relationships](landmark-workbench-and-project-relationships.md): how rooms and projects nest.
- [Landmark: Agent Stances](landmark-agent-stances.md): the stance skills that ship in the lane.

## Evidence and Sources

- [Landmark record "Workbench Boundaries" (LMK-000C)](../../landmark-tracker/landmarks/LMK-000C.json): title, summary, importance and history.
- The four question cards named above, each at the revision cited: they hold the answers, confirmation basis, open uncertainties and named claims this page summarizes.
- [The Wiki is the evolving synthesis every agent reads and updates](../../docs/adr/000R-the-wiki-is-the-evolving-synthesis-every-agent-reads-and-updates.md): why this page exists.

## History

- 2026-10-04: created by the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages), seeded from the cards' current answers.
- 2026-10-07: Re-pointed the retiring Lexicon's links and live routes to `GLOSSARY.md`, `ARCHITECTURE.md` and the Wiki lexicon articles (Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), consumer re-pointing Task (TK-009F)); no claim changed.

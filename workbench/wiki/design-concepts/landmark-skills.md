---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Seeded from the current answers of the Skills landmark's question cards (landmark record revision 1), 2026-10-04
source_paths:
  - workbench/landmark-tracker/landmarks
  - workbench/landmark-tracker/destination-questions
  - workbench/docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md
  - workbench/skills/README.md
parent: none
authorized_by: the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages); paired Core delivery under Writing-for-agents Skill Adoption (S-002P) and Retro Skill Adoption (S-002V), owner assignment 2026-10-07
last_verified: 2026-10-04
---

# Landmark: Skills

This page is the evolving synthesis of the Skills landmark
(landmark [LMK-000I: "Skills landmark"](../../landmark-tracker/landmarks/LMK-000I.json)).
It sums up, in prose, what the landmark's fourteen question cards currently say
and is updated whenever one of them changes. The cards keep the structured
account and the lineage; the decision records and Specs below govern. For the
shape of the four stance skills, read [Roles and stances](roles-and-stances.md);
for the shipped bundle itself, read the
[core skills README](../../skills/README.md).

## What the landmark is

Reusable behaviors, the skills, compose into the delivery workflow and have to
be found and used inside every room, not only on the owner's machine. The owner
approved this as a core-path pillar in the starting inventory of 2026-09-26. It
matters because a mistake here either makes a fresh room depend on a personal
catalog it cannot see, or lets two copies of one skill drift apart.

Each card's source answers were settled by the owner in grilling sessions. The
grouping, title and synthesis of every card is agent work, not separately
owner-confirmed, and this page keeps that distinction.

## Current accepted answers

- **Where skills live.** The room carries its core skills in a tracked lane at
  `workbench/skills`, replaced only by the ordinary Workbench update, with no
  provider home, personal catalog or bootstrap on the critical path
  (card [DQC-000F: "Where should the authoritative skill copies for a room live?"](../../landmark-tracker/destination-questions/DQC-000F.json), revision 8).
  The owner's private skills repository stays a backup and a place rooms can
  publish skills they create, never a dependency
  (card [DQC-001B: "What role should a shared personal skill catalog retain?"](../../landmark-tracker/destination-questions/DQC-001B.json), revision 7;
  the public product does not validate or depend on that catalog). The decision
  record ["Core skills ship in the workbench skills lane"](../../docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md)
  and the destination record
  ["The behaviors agents need ship inside every room"](../../docs/ddr/000J-the-behaviors-agents-need-ship-inside-every-room.md)
  carry this.
- **How providers discover them.** The four stances (Builder, Auditor, Reviewer,
  Reconciler) ship as portable stance skills; loading one never spawns a
  sub-agent, and cross-provider discovery keeps working through a flat
  top-level link for Claude's one-level scan
  (card [DQC-000V: "How should supported providers discover the room’s skills?"](../../landmark-tracker/destination-questions/DQC-000V.json), revision 8;
  decision record ["Stances change method, not authority"](../../docs/adr/0036-stances-change-method-not-authority.md)).
- **What is in the bundle.** The required bundle is the minimum closed workflow,
  setup through grilling to implementation and review, not template-only setup,
  and carry joined it as a core skill
  (card [DQC-000W: "Which reusable behaviors belong in the required skill bundle?"](../../landmark-tracker/destination-questions/DQC-000W.json), revision 8;
  card [DQC-001E: "What place should carry have in the delivery workflow?"](../../landmark-tracker/destination-questions/DQC-001E.json), revision 8,
  where the owner chose the name from four candidates and that carry is installed through the supported route, with no hand-copy workaround).
  Both cards plan for a seventeen-skill bundle, a point-in-time figure. The
  [Core skills README](../../skills/README.md) and manifest own the current bundle.
- **Versions and updates.** The checked-out Workbench release owns the bundled
  skill versions, with no separate release dependency
  (card [DQC-000X: "How do skill versions relate to Workbench releases?"](../../landmark-tracker/destination-questions/DQC-000X.json), revision 10).
  Ordinary setup is presence-only and compares no content; only an explicitly
  authorized skill update backs up changed content and converges the core to the
  bundled versions
  (card [DQC-000Z: "How should skill updates preserve locally changed content?"](../../landmark-tracker/destination-questions/DQC-000Z.json), revision 9;
  card [DQC-001A: "What should skill verification report, and which copies should it inspect?"](../../landmark-tracker/destination-questions/DQC-001A.json), revision 7).
- **What ordinary setup may touch.** For a symlinked or Git-owned discovery
  root, setup resolves the link, writes only the missing skill into the real
  directory, never runs Git, and keeps its marker file
  (card [DQC-000Y: "What may ordinary skill setup install or change?"](../../landmark-tracker/destination-questions/DQC-000Y.json), revision 7).
- **Prose first, tools second.** Procedures are small Markdown guidebooks; Node
  tools exist only for narrow deterministic checks, with no umbrella lifecycle
  program
  (card [DQC-003I: "Which parts of a procedure belong in prose and which in deterministic tools?"](../../landmark-tracker/destination-questions/DQC-003I.json), revision 8).
- **Migration.** Legacy local skill shadows are removed only after the presence
  gate passes, and a leftover root `skills/` directory is a doctor finding
  (card [DQC-004Y: "When may obsolete skill shadows be retired during migration?"](../../landmark-tracker/destination-questions/DQC-004Y.json), revision 8).
- **A Wiki skills reference.** The owner wants one readable Wiki entry per skill
  (cards [DQC-001C: "Which skills are owner-facing entrypoints and which are composition details?"](../../landmark-tracker/destination-questions/DQC-001C.json), revision 5, and
  [DQC-001D: "How should the Wiki explain each available skill?"](../../landmark-tracker/destination-questions/DQC-001D.json), revision 6).
  On 2026-10-04, pages named `skill-<name>.md` existed beside the router for
  twenty-five of the then twenty-seven lane skills; tracer-bullet and
  update-harness had no page. The [Wiki router](../MEMORY.md#skills-reference)
  owns current reference navigation, including the linked skills draft collection.

## Open and unresolved

- Which skills are owner-facing commands and which are internal composition
  details: the owner gave no classification, and both Wiki-reference cards record
  that as open.
- The card on the required bundle records that the specific list of non-core
  skills that should join the lane was not confirmed; the Portable Workbench
  Spec carries a catalog-review step for it.
- The card on version relations records a bump to v3.1.3 with v3.1.2 frozen at
  sixteen skills. Inference: the Workbench has since moved on (the Wiki schema is
  generated from v3.2.1), so that version number is historical and the card needs
  a refresh.
- The card on verification (revision 7) answers only that normal setup compares
  no content. What verification should report is not answered on the card; the
  presence and update receipts exist in the tools, but this page does not claim
  they settle the question.
- The card [DQC-006L: "Which skills own destination question card mechanics and the grilling-completion exit?"](../../landmark-tracker/destination-questions/DQC-006L.json), revision 8,
  records the owner's answer that a focused card primitive and a grilling-completion
  skill should exist and be composed by the workflow skills. It also records two
  open points: the step meanings in those answers conflict with the Landmark Tracker
  Foundation Spec, the Lexicon and the tracker tool, which describe documentation
  progress only; and no Spec owns those skills yet. The lane listing checked on
  2026-10-04 holds no such skill directories, so they are planned, not delivered.
  The decision record
  ["A locked and confirmed answer is promoted without further ceremony"](../../docs/adr/000Y-a-locked-and-confirmed-answer-is-promoted-without-further-ceremony.md)
  repeats that the grilling-completion skill still needs to be made.

## Where the work lives

The lane and its ownership are in the decision records
["Core skills ship in the workbench skills lane"](../../docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md)
and ["Core, personal/shared and room-local skill ownership"](../../docs/adr/0046-core-personal-shared-and-room-local-skill-ownership.md).
The delivering Specs are [Portable Workbench (S-00V)](../../specs/S-00V-portable-workbench/SPEC.md),
[S-021 Portable Workbench v3](../../specs/S-021-portable-workbench-v3/SPEC.md),
[v3.1.2 Follow-Ups Left Without An Owner (S-045)](../../specs/S-045-v3-1-2-follow-ups/SPEC.md),
[Assignment Ownership And The Coordination Record (S-049)](../../specs/S-049-assignment-ownership-and-coordination-record/SPEC.md),
[Core Skill Ownership And Compatibility (S-051)](../../specs/S-051-core-skill-ownership-and-compatibility/SPEC.md) and
[Core Skill Lifecycle And Optional Source Disposition (S-00R)](../../specs/S-00R-core-skill-lifecycle-and-optional-source-disposition/SPEC.md).
The tools are the [skills installer](../../../tools/workbench-skills.mjs), the
[core skill installer](../../../tools/core-skill-installer.mjs), the
[presence check](../../../tools/skill-presence.mjs), the
[layout check](../../tools/workbench-layout.mjs) and the
[skill catalog test](../../../tools/test-skill-catalog.mjs). The Lexicon rows on
the core bundle, normal setup and explicit skill update live in
[LEXICON.md](../../../LEXICON.md).

## Related pages

- [Landmark: Genesis and Adoption](landmark-genesis-and-adoption.md) shares the
  lane-laydown and shadow-retirement cards.
- [Landmark: Wiki](landmark-wiki.md) shares the Wiki skills reference cards.

## Evidence and Sources

- [LMK-000I: "Skills landmark record"](../../landmark-tracker/landmarks/LMK-000I.json): title, summary, importance and history.
- The fourteen question cards named above, each at the revision cited: they hold the answers, confirmation basis, open uncertainties and named claims this page summarizes.
- [Core skills README](../../skills/README.md): the shipped bundle.

## History

- 2026-10-04: created by the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages), seeded from the cards' current answers.

- 2026-10-07: Writing-for-agents Skill Adoption (S-002P) and Retro Skill Adoption (S-002V) reconciled the bundle count with the current catalog and dated the earlier Wiki coverage observation; card answers are unchanged.

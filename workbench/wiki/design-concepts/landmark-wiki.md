---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Seeded from the current answers of the Wiki landmark's question cards (landmark record revision 1), 2026-10-04
source_paths:
  - workbench/landmark-tracker/landmarks
  - workbench/landmark-tracker/destination-questions
  - workbench/docs/adr/000R-the-wiki-is-the-evolving-synthesis-every-agent-reads-and-updates.md
  - workbench/wiki/SCHEMA.md
parent: none
authorized_by: the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages)
last_verified: 2026-10-04
---

# Landmark: Wiki

This page is the evolving synthesis of the Wiki landmark
(landmark [LMK-000J: "Wiki landmark"](../../landmark-tracker/landmarks/LMK-000J.json)).
It sums up, in prose, what the landmark's five question cards currently say and
is updated whenever one of them changes. The cards keep the structured account
and the lineage. Most of these cards were written before the owner's
2026-10-01 definition of the Wiki as an evolving synthesis, so this page marks
where a card still records the older view. For how the Wiki works now, read the
[Wiki schema](../SCHEMA.md) and the
[design concepts README](README.md).

## What the landmark is

People and agents can read coherent, current explanations of the project and
follow them to their sources. The owner approved it as a core-path pillar on
2026-09-26. It matters because the owner reads the project through the Wiki, not
through JSON records, and because a Wiki that only describes what was already
settled leaves nothing readable while understanding is still forming.

The source answers on each card were settled by the owner in grilling sessions;
each card's grouping, title and synthesis is agent work, not separately
owner-confirmed.

## Current accepted answers

- **The Wiki is the evolving synthesis.** The decision record
  ["The Wiki is the evolving synthesis every agent reads and updates"](../../docs/adr/000R-the-wiki-is-the-evolving-synthesis-every-agent-reads-and-updates.md)
  is the newest accepted statement. The Wiki holds evolving synthesis, not only
  confirmed understanding; any agent in an authorized operation creates or
  updates the pages its work touched with no per-page approval; identifiers stay,
  carrying the artifact's name and context; each landmark gets one synthesis page;
  and the question cards remain the structured account the Wiki summarizes.
- **A skills reference.** The owner wants one readable Wiki entry per skill, in the
  shape of a public skills reference
  (card [DQC-001D: "How should the Wiki explain each available skill?"](../../landmark-tracker/destination-questions/DQC-001D.json), revision 6).
  Pages named `skill-<name>.md` sit beside the router for most of the skills in
  the lane; the [Core skills catalog](../../skills/README.md) holds the current
  bundle and its count.
- **Feature articles.** A Wiki collection named features, not capabilities and not a
  widening of design concepts, is designed to hold one article per completed Spec. It is written
  at the Spec's closure point, which follows separate-context review and the owner's
  quality check on integration, and is not a new gate; the card records it as a
  v4 requirement
  (card [DQC-004L: "What should a Wiki feature article explain, and when is it written?"](../../landmark-tracker/destination-questions/DQC-004L.json), revision 7).
  The collection is delivered: it holds the feature articles migrated from the
  per-Spec design concepts, all routed from the router's Feature Articles list
  (an earlier Spec's design-concept or guidebook note can remain its valid
  retirement owner); see the
  [features README](../features/README.md).
- **Who keeps it current.** The grilling primitive stays unaware of landmarks and the
  Tracker; compound workflow activity reads and updates the landmark system. Tracker
  updates follow workflow events and derive the view from source artifacts wherever
  possible, and Wiki creation and update ride ordinary Spec and Task delivery, with
  planning and review as further chances to reconcile and no separate publishing
  ceremony
  (card [DQC-006I: "Who maintains Tracker records and landmark Wiki pages, and when?"](../../landmark-tracker/destination-questions/DQC-006I.json), revision 8).
  The decision record above agrees: ingest is the exit of every operation.
- **Four pieces.** Question cards preserve concept understanding and lineage,
  landmarks connect the evolving account, the Tracker generates the compact view,
  and the Wiki explains in readable Markdown, because JSON is hard for the owner to
  read
  (card [DQC-005W: "How do destination question cards, landmarks, the Tracker and the Wiki divide their jobs?"](../../landmark-tracker/destination-questions/DQC-005W.json), revision 9).

## Open and unresolved

- Which skills are owner-facing and which are internal composition details is open
  on the skills reference card; the owner gave no classification.
- The four-piece card says the Wiki holds only understanding confirmed enough for a
  durable knowledge base, with no identifiers, and that landmark files are JSON.
  The Wiki decision record supersedes the first two points; the decision record
  ["Landmarks are LANDMARK.md artifacts one size above Specs"](../../docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md)
  retires the JSON landmark record, with its delivery still planned. The card needs a refresh.
- The card [DQC-004M: "How should later corrections maintain knowledge from a retired Spec?"](../../landmark-tracker/destination-questions/DQC-004M.json), revision 7,
  records a corrective Task plus a Wiki update. The destination record
  ["Working artifacts are scaffolding, cleared away once their knowledge is kept"](../../docs/ddr/000M-working-artifacts-are-scaffolding-cleared-away-once-their-knowledge-is-kept.md)
  revises it: a later gap becomes a new Spec under its landmark or the Blueprint, never
  a correction anchored to a Wiki claim. The Wiki still records the reconciled
  retired Spec, but a later gap does not edit it through a corrective Task.
- Inference: the maintenance card's rule that the grilling primitive stays unaware of
  the Wiki sits beside the Wiki decision record's rule that finishing a grilling makes
  page writing part of promotion. They are compatible if promotion, not the primitive,
  writes the pages, but the card does not say so.

## Where the work lives

The decision records are
["The Wiki is the evolving synthesis every agent reads and updates"](../../docs/adr/000R-the-wiki-is-the-evolving-synthesis-every-agent-reads-and-updates.md)
and ["The wiki is the knowledge base and holds collections"](../../docs/adr/0018-the-wiki-is-the-knowledge-base.md).
The Specs are [Wiki Evolving-Synthesis Migration (S-003W)](../../specs/S-003W-wiki-evolving-synthesis-migration/SPEC.md),
[Portable Wiki And Design Concepts (S-025)](../../specs/S-025-portable-wiki-and-design-concepts/SPEC.md),
[skills draft wiki collection (S-002L)](../../specs/S-002L-skills-draft-wiki-collection/SPEC.md),
[Retirement Lifecycle By Folder For Records (S-00I)](../../specs/S-00I-folder-lifecycle-for-records/SPEC.md) and
[Destination Question Cards records (S-002B)](../../specs/S-002B-destination-question-cards/SPEC.md).
The tools are the [Wiki validator](../../tools/wiki.mjs), the
[landmark article validator](../../tools/landmark-wiki.mjs) and the
[landmark tracker](../../tools/landmark-tracker.mjs). The Lexicon rows are in
[LEXICON.md](../../../LEXICON.md).

## Related pages

- [Landmark: Durable Knowledge](landmark-durable-knowledge.md) shares the feature-article, correction and four-piece cards.
- [Landmark: Skills](landmark-skills.md) shares the skills reference card.
- [Landmark tracker](landmark-tracker.md) explains the Tracker side in depth.

## Evidence and Sources

- [LMK-000J: "Wiki landmark record"](../../landmark-tracker/landmarks/LMK-000J.json): title, summary, importance and history.
- The five question cards named above, each at the revision cited: they hold the answers, confirmation basis, open uncertainties and named claims this page summarizes.
- [Wiki schema](../SCHEMA.md): the Wiki's own contract.

## History

- 2026-10-04: created by the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages), seeded from the cards' current answers.
- 2026-10-04: corrected after the whole-Wiki lint of the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-006P (Wiki wording): the features collection and the move of the per-Spec articles into it are delivered, so the closed item left the Open list. No card answer was changed.
- 2026-10-07: corrected after the whole-Wiki lint at review of the pr skill adoption Spec (S-002U), Task TK-007V: the skills-reference item no longer states a skill count, because the Core bundle grew past the twenty-seven skills it named; the catalog owns the count. No card answer was changed.

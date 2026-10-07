---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Seeded from the current answers of the Grilling and Shared Understanding landmark's question cards (landmark record revision 1), 2026-10-04
source_paths:
  - workbench/landmark-tracker/landmarks
  - workbench/landmark-tracker/destination-questions
  - workbench/docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md
  - workbench/docs/adr/000Y-a-locked-and-confirmed-answer-is-promoted-without-further-ceremony.md
  - workbench/skills/grilling/SKILL.md
parent: none
authorized_by: the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages)
last_verified: 2026-10-04
---

# Landmark: Grilling and Shared Understanding

This page is the evolving synthesis of the Grilling and Shared Understanding
landmark (landmark ["Grilling and Shared Understanding" (LMK-000O)](../../landmark-tracker/landmarks/LMK-000O.json)).
It sums up what the landmark's thirteen question cards currently say, in
prose, and is updated whenever one of them changes. The cards and the landmark
record keep the structured account and the lineage; decision records and the
delivering Specs govern. For the explanation of the whole sequence from idea to
delivery, read [The Workflow From Idea To Delivery](idea-to-delivery-workflow.md)
and [The Workflow Verbs](workflow-verbs.md); for the skill itself, read
[Grilling: arrive at a shared design concept](../skill-grilling.md). This page
covers how shared understanding forms and where it goes next.

## What the landmark is

Exploration should produce an explicitly shared concept, preserving the
reasons, corrections and unresolved questions along the way. The landmark
covers the interview, what counts as a confirmed concept, how a settled answer
reaches its durable owner, and where understanding lives while it is still
forming. It matters because the Workbench depends on the owner and the agents
agreeing on a concept before anything is planned or built, and a mistake here
either builds the wrong thing or lets an agent treat a half-formed idea as
settled.

## Current accepted answers

Every source answer behind these cards was settled by the owner in its grilling
session. The grouping of answers into cards and the card titles are agent work
and were not separately confirmed by the owner; that applies to all thirteen
cards below.

**How an idea becomes a shared concept.**

- Card [DQC-002F: "What establishes that an idea has become a shared design concept?"](../../landmark-tracker/destination-questions/DQC-002F.json), revision 7:
  an owner idea starts Align through grilling, and owner and agent explicitly
  confirm a shared design concept before it is blueprinted. The card records a
  six-phase ladder (Idea, Align, Scope, Plan, Implement, Verify) with
  prototyping optional. An earlier session failed because it never actually
  started a grilling session; had it started correctly, stopping the session
  would have been the endpoint, with the handoff carrying the authorized task
  and notepad context.
- Card [DQC-002G: "Which investigations should be used during Align?"](../../landmark-tracker/destination-questions/DQC-002G.json), revision 5:
  research, brainstorming and wayfinding are allowed Align investigations to
  resolve a named uncertainty. Prototypes are not an Align method.
- Card [DQC-002H: "Where does optional prototyping belong, and when may its code carry forward?"](../../landmark-tracker/destination-questions/DQC-002H.json), revision 6:
  prototyping stays optional, after the Blueprint and before the Spec. Its code
  may carry forward once it meets ordinary implementation and verification
  requirements, which the owner would prefer on an established project and not
  on a fresh one, where a separate codebase or proving stack is the alternative.
- Card [DQC-006M: "Where does the workflow begin relative to idea exploration, Align and room setup?"](../../landmark-tracker/destination-questions/DQC-006M.json), revision 6:
  idea exploration may precede Align, and the grill-me, wayfinder or brainstorm
  skills can start it. Genesis and Adoption are first-time setup or update, not
  the governing workflow, and Genesis needs a grilling session afterward to
  form the Blueprint.
- Card [DQC-002K: "How does a grilling or handoff endpoint preserve the owner’s intended scope?"](../../landmark-tracker/destination-questions/DQC-002K.json), revision 10:
  a handoff carries the owner-authorized task, authority and notepad context
  and nothing wider. For a promote-and-scope handoff the recipient writes the
  named docs and Specs and does not implement. The v3 runway shows the same
  discipline: it authorized the smallest complete single-repository runway,
  listed exclusions (merging to main, visibility or credentials, importing
  Foundry machinery, a broad skill-catalog redesign, unproven release claims)
  and kept the owner-only promotion gate; see
  [S-021 Portable Workbench v3](../../specs/S-021-portable-workbench-v3/SPEC.md).

**Working, confirmed and promoted.**

- Card [DQC-006F: "What separates a working answer, a confirmed answer and promoted Canon?"](../../landmark-tracker/destination-questions/DQC-006F.json), revision 6:
  a working answer is provisional; owner confirmation settles the scoped design
  answer; confirmation does not itself authorize implementation or Canon
  promotion; authorized reconciliation writes supported claims into their proper
  durable owners; and saving something to the Wiki does not make it an
  instruction source.
- Card [DQC-002I: "How do confirmed answers reach durable owners?"](../../landmark-tracker/destination-questions/DQC-002I.json), revision 9:
  a grilling answer never enters Canon inline. Settled material is promoted
  through ordinary scoped work, a Task when the change is small and a Spec with
  Tasks when it is broad, routed by the ownership map: definitions to the
  Lexicon, obligations to the root controls, scoped capability choices to a
  Spec and cross-cutting choices to an ADR. The owner's wording was that locked
  answers go "in their durable places."
- Card [DQC-002J: "What evidence is sufficient before promoting a settled answer?"](../../landmark-tracker/destination-questions/DQC-002J.json), revision 6:
  the routing half is settled (see the previous card); the evidence threshold
  is not (see below).

**Where understanding lives before delivery.**

- Card [DQC-005Y: "Where does pre-delivery understanding live, and what becomes of the grilling sources?"](../../landmark-tracker/destination-questions/DQC-005Y.json), revision 8:
  the grilling sources are kept and the ledger is not moved or replaced.
  Destination Question Cards (DQCs) synthesize related questions and keep
  lineage, landmarks connect them around a feature, and the generated Tracker
  projects the records. Grilling notepads remain, but become more historical and
  handoff-like than the primary current account.
- Card [DQC-005Z: "Which grilling material becomes a destination question card, and can a card exist without a landmark?"](../../landmark-tracker/destination-questions/DQC-005Z.json), revision 8:
  the owner identifies conceptual groups as destination questions, retitled
  meaningfully with source question identities preserved. Not every
  conversational prompt gets a card, and a card can exist with no landmark;
  concepts grow from grilling question to destination question to landmark if
  consequential enough.
- Card [DQC-006I: "Who maintains Tracker records and landmark Wiki pages, and when?"](../../landmark-tracker/destination-questions/DQC-006I.json), revision 8:
  the grilling primitive stays unaware of landmarks and the Tracker; compound
  workflow activity reads and updates the landmark system. The Tracker follows
  workflow events and is derived from sources where possible, and Wiki updates
  are ordinary Spec or Task delivery with no separate publishing ceremony.

**Steps and skills.**

- Card [DQC-006K: "What makes a concept Confirmed after Align, and how do the later steps advance?"](../../landmark-tracker/destination-questions/DQC-006K.json), revision 6:
  at session completion each locked answer is added to an existing DQC, or to a
  new one where it evolves independently, which makes it Confirmed. Mapped uses
  selective ADRs and then Specs, Planned means ready Tasks, Review is distinct
  code and QA review with proof, and Verified compares delivered work with the
  card's expected result.
- Card [DQC-006L: "Which skills own destination question card mechanics and the grilling-completion exit?"](../../landmark-tracker/destination-questions/DQC-006L.json), revision 8:
  one focused card primitive, `/dqc`, owns card mechanics, and `/to-dqc` is the
  grilling-completion skill that files each locked answer. There is no
  dedicated card-review skill, and domain-modeling is available but not
  required.

## Open and unresolved

- Evidence threshold before promotion: the card [DQC-002J: "What evidence is sufficient before promoting a settled answer?"](../../landmark-tracker/destination-questions/DQC-002J.json)
  records the threshold as open; reading "locked" as that threshold is an
  interpretation, not an owner ruling. The decision record
  ["A locked and confirmed answer is promoted without further ceremony"](../../docs/adr/000Y-a-locked-and-confirmed-answer-is-promoted-without-further-ceremony.md)
  says a locked and confirmed answer can be promoted without extra ceremony,
  which bears on this question but was not recorded against the card.
- Confirmation and authority: the card [DQC-006F: "What separates a working answer, a confirmed answer and promoted Canon?"](../../landmark-tracker/destination-questions/DQC-006F.json)
  and the agents file say confirmation never grants implementation or promotion
  authority. The later decision record
  ["Confirming a concept authorizes the agents to carry it to its endpoint"](../../docs/ddr/000C-confirming-a-concept-authorizes-the-agents-to-carry-it-to-its-endpoint.md)
  says confirmation is the authorization, unless it names a nearer endpoint.
  These differ and this page does not resolve them; the agents file still
  governs agent behavior until it is changed.
- Step meanings: the cards on the Confirmed step and on skill ownership record
  that their step meanings conflict with the Tracker Spec and the Lexicon, which
  read the steps as documentation progress. The decision record
  ["The workflow is eight verbs and each verb writes the plane its claims live on"](../../docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md)
  rejects the documentation-only reading and makes the steps the workflow
  verbs, with Journey as the loop and not a stage; so the card's "Journey means
  implementation" and the earlier six-phase ladder are superseded in wording.
  The Tracker's installed labels still await migration.
- Delivery of the skills: Inference from the repository as read on 2026-10-04.
  There is no `workbench/skills/to-dqc/` or `workbench/skills/dqc/`, and the
  card [DQC-006L: "Which skills own destination question card mechanics and the grilling-completion exit?"](../../landmark-tracker/destination-questions/DQC-006L.json)
  says no Spec owns them and that naming one is a Director action. The decision
  record named above also says how `/to-dqc` composes with `promote` is not
  decided.
- Prototype placement: the card [DQC-002H: "Where does optional prototyping belong, and when may its code carry forward?"](../../landmark-tracker/destination-questions/DQC-002H.json)
  places it after the Blueprint and before the Spec; the later
  ["Prototype needs no map and lands nothing in enduring context"](../../docs/ddr/000D-prototype-needs-no-map-and-lands-nothing-in-enduring-context.md)
  allows it before Confirm as well and records, unresolved, that two accepted
  records place or list it differently.
- Paused skill-workflow questions: the card on where the workflow begins lists
  open questions the owner paused on 2026-09-30 ("foundations first"): where
  wayfinder keeps provisional decisions during Align, how grill-me, grilling,
  the notepad, the Lexicon and domain-modeling compose, which conditional Align
  aids are needed, what marks confirmation and Blueprint handoff, and how
  planning, delivery, maintenance and per-room shipping divide among skills.
- Landmark records: the cards still describe landmark JSON records as the home
  of the evolving account. The decision record
  ["Landmarks are LANDMARK.md artifacts one size above Specs"](../../docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md)
  retires that record, turning landmark JSON into question cards; none of that
  is installed yet.

## Where the work lives

The interview itself is the `grilling` skill, with the `grill-me` entry point,
the `notepad` continuity skill, `handoff` and `promote`
([grilling](../../skills/grilling/SKILL.md), [grill-me](../../skills/grill-me/SKILL.md),
[notepad](../../skills/notepad/SKILL.md), [handoff](../../skills/handoff/SKILL.md),
[promote](../../skills/promote/SKILL.md)). Their rebuilds are delivered by
[grilling skill rebuild (S-00X)](../../specs/S-00X-grilling-skill-rebuild/SPEC.md),
[grill-me skill rebuild (S-00Z)](../../specs/S-00Z-grill-me-skill-rebuild/SPEC.md),
[notepad skill rebuild (S-00Y)](../../specs/S-00Y-notepad-skill-rebuild/SPEC.md),
[handoff skill rebuild (S-01A)](../../specs/S-01A-handoff-skill-rebuild/SPEC.md)
and [promote skill rebuild (S-01B)](../../specs/S-01B-promote-skill-rebuild/SPEC.md);
the planned composition design is
[Concept Grilling And Notepad Composition (S-00W)](../../specs/S-00W-concept-grilling-and-notepad-composition/SPEC.md).
The recorded durable decisions came through
[Blueprint, Active ADR, And Context Map Rebuild (S-00A)](../../specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md)
and [Workflow Canon Rework (S-00P)](../../specs/S-00P-workflow-canon-rework/SPEC.md).
The card and Tracker mechanics are in
[Destination Question Cards capability Spec (S-002B)](../../specs/S-002B-destination-question-cards/SPEC.md)
and [Landmark Tracker Foundation (S-01T)](../../specs/S-01T-landmark-tracker-foundation/SPEC.md),
and the route to the Wiki is the decision record
["The Wiki is the evolving synthesis every agent reads and updates"](../../docs/adr/000R-the-wiki-is-the-evolving-synthesis-every-agent-reads-and-updates.md),
which says the Wiki, not only the cards, holds the evolving synthesis and that
finishing a grilling session makes writing its pages part of promotion.

## Related pages

- [The Workflow From Idea To Delivery](idea-to-delivery-workflow.md) and [The Workflow Verbs](workflow-verbs.md): where Align and Confirm sit in the sequence.
- [The Landmark Tracker](landmark-tracker.md): the cards, landmarks and Tracker that hold the evolving account.

## Evidence and Sources

- [Landmark record "Grilling and Shared Understanding" (LMK-000O)](../../landmark-tracker/landmarks/LMK-000O.json): title, summary, importance and history.
- The thirteen question cards named above, each at the revision cited: they hold the answers, the confirmation basis, the open uncertainties and the expected results this page summarizes.
- [Glossary](../../../GLOSSARY.md) and [agent contract](../../../AGENTS.md): the Align and promotion definitions and the authority limits.

## History

- 2026-10-04: created by the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages), seeded from the cards' current answers.
- 2026-10-07: Re-pointed the retiring Lexicon's links and live routes to `GLOSSARY.md`, `ARCHITECTURE.md` and the Wiki lexicon articles (Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), consumer re-pointing Task (TK-009F)); no claim changed.

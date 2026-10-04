---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Seeded from the current answers of the Landmark Tracker landmark's question cards (landmark record revision 1), 2026-10-04
source_paths:
  - workbench/landmark-tracker/landmarks
  - workbench/landmark-tracker/destination-questions
  - workbench/docs/adr/000N-landmark-tracker-connects-evolving-understanding-to-durable-knowledge.md
  - workbench/docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md
parent: none
authorized_by: the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages)
last_verified: 2026-10-04
---

# Landmark: Landmark Tracker

This page is the evolving synthesis of the Landmark Tracker landmark
(landmark ["Landmark Tracker" (LMK-000X)](../../landmark-tracker/landmarks/LMK-000X.json)).
It sums up what the landmark's sixteen question cards currently say, in prose,
and is updated whenever one of them changes. The cards and the landmark record
keep the structured account and the lineage; decision records and the delivering
Specs govern. The model itself, with its worked example of the progress
calculation, is explained in the article [The Landmark Tracker](landmark-tracker.md);
this page summarizes what the cards add up to and routes there rather than
repeating it.

## What the landmark is

Destination Question Cards (DQCs) and landmarks maintain evolving understanding,
and the Tracker exposes documentation progress and relationships. The landmark
matters because it is the machinery that keeps the owner's and the agents'
current understanding, its reasons and its corrections from living only in
chat or in notes, and a mistake in its model would let a progress number mean
more than it measures or let a record be mistaken for authority.

## Current accepted answers

Every source answer behind these cards was settled by the owner in its grilling
session. The grouping of answers into cards and the card titles are agent work
and were not separately confirmed by the owner; that applies to all sixteen
cards below.

**The pieces and what each one is.**

- Card [DQC-005W: "How do destination question cards, landmarks, the Tracker and the Wiki divide their jobs?"](../../landmark-tracker/destination-questions/DQC-005W.json), revision 9:
  four pieces. Destination Questions preserve concept understanding and lineage;
  landmarks connect the evolving feature or pillar account; the Tracker
  generates the compact view; the Wiki explains the understanding in readable
  Markdown. Landmark files and question cards are flat JSON records, and the
  Wiki is how the owner reads about the project, because JSON is hard for him
  to read.
- Card [DQC-005V: "What is a landmark, and how long does it live?"](../../landmark-tracker/destination-questions/DQC-005V.json), revision 8:
  a landmark is an evolving account of a feature or framework, not a Spec or a
  product requirements document, and is never implemented itself. Bounded Specs
  and Tasks deliver work and several Specs may contribute to one landmark. It
  has a Wiki page and a durable place from the start, may never leave the board,
  and retires only when nothing lives solely on it.
- Card [DQC-005U: "How does the landmark inventory start and evolve?"](../../landmark-tracker/destination-questions/DQC-005U.json), revision 7:
  the proposed candidates serve as an evolving starting inventory. More
  landmarks are added as meaningful features emerge from DQCs; the count is not
  fixed, overlap is allowed, and names and boundaries stay refinable. Agreed
  groupings include Context Map, Agent Autonomy, Agent Stances, Skills,
  Notepads, Handoffs and Session Transport, and Artifact Types, Durable
  Knowledge and the Wiki stay separate candidates.
- Card [DQC-005X: "Where and in what form do Tracker records live?"](../../landmark-tracker/destination-questions/DQC-005X.json), revision 7:
  the Tracker root holds a generated view and flat folders of DQC and landmark
  JSON, with Wiki explanations in Markdown. Both landmarks and questions get
  visible identities, and legacy question labels stay readable. The layout is
  described in the [Tracker README](../../landmark-tracker/README.md).

**Where understanding lives before delivery.**

- Card [DQC-005Y: "Where does pre-delivery understanding live, and what becomes of the grilling sources?"](../../landmark-tracker/destination-questions/DQC-005Y.json), revision 8:
  existing grilling sources are kept and the ledger is not moved or replaced;
  DQCs and landmark records hold the current account and the generated Tracker
  presents it. Grilling notepads stay as history and handoff context.
- Card [DQC-005Z: "Which grilling material becomes a destination question card, and can a card exist without a landmark?"](../../landmark-tracker/destination-questions/DQC-005Z.json), revision 8:
  cards are meaningful concept syntheses, not one per conversational prompt, and
  a card can show no landmark. Concepts grow from grilling question to
  destination question to landmark if consequential enough.
- Card [DQC-006I: "Who maintains Tracker records and landmark Wiki pages, and when?"](../../landmark-tracker/destination-questions/DQC-006I.json), revision 8:
  the grilling primitive stays unaware of landmarks; compound workflow activity
  maintains the system, deriving the view from sources where possible. Wiki
  creation is ordinary Spec or Task delivery, with planning and review as
  further chances to reconcile, and no separate publishing ceremony.
- Card [DQC-006L: "Which skills own destination question card mechanics and the grilling-completion exit?"](../../landmark-tracker/destination-questions/DQC-006L.json), revision 8:
  one focused card primitive owns the mechanics (find, create or group a card,
  preserve lineage and corrections, link artifacts, record evidence-backed
  assessments), and a grilling-completion skill files each locked answer. The
  existing workflow skills decide when to call it; there is no dedicated
  card-review skill.
- Card [DQC-006K: "What makes a concept Confirmed after Align, and how do the later steps advance?"](../../landmark-tracker/destination-questions/DQC-006K.json), revision 6:
  at session completion each locked answer joins an existing card or a new one,
  which makes it Confirmed; later steps are advanced by the existing workflow
  skills maintaining the card.

**Reading documentation progress.**

- Card [DQC-006B: "What do the eight documentation steps measure?"](../../landmark-tracker/destination-questions/DQC-006B.json), revision 7:
  cards represent destination concepts, not their constituent prompts, and mixed
  progress is shown as percentage distributions across the eight steps, with no
  single card lane or reset lifecycle. The distribution measures progress toward
  the documentation destination, not child implementation completion, and the
  Wiki's actual content is checked against expected durable knowledge.
- Card [DQC-006C: "How do step distributions aggregate across cards, landmarks and the Workbench?"](../../landmark-tracker/destination-questions/DQC-006C.json), revision 7:
  each distinct item contributes one unit, split into step fractions when mixed;
  sum each step and divide by the distinct item count, the same way at card,
  landmark and Workbench scope. A shared item counts once while every
  relationship stays visible. Equal weighting is a first version, not a
  permanent invariant.
- Card [DQC-006D: "What happens to a card and its landmark as understanding and delivery progress?"](../../landmark-tracker/destination-questions/DQC-006D.json), revision 5:
  the account and its history are kept and the view reflects current mixed
  progress; cards are not reopened or reset, and finished Specs do not
  automatically finish a landmark.
- Card [DQC-006J: "What do a card's Expected result and Result record?"](../../landmark-tracker/destination-questions/DQC-006J.json), revision 6:
  an unanswered question need not know its destination. An answered card's
  Expected result names the intended durable change and home if known, and
  Result records the achieved delivery outcome.
- Card [DQC-006E: "How does a changed answer expose the claims it affects?"](../../landmark-tracker/destination-questions/DQC-006E.json), revision 6:
  preserve what changed, why, related artifacts and evidence-bearing
  assessments, and assess which specific claims are affected rather than
  assuming every link is stale.
- Card [DQC-006G: "How do Tracker evidence links stay recoverable after their sources retire?"](../../landmark-tracker/destination-questions/DQC-006G.json), revision 6:
  use current identities and resolved paths for live navigation and immutable
  commit and path citations for historical proof. Ignored local notes are not
  protected by Git history and stay until their needed content is reconciled.

**Against the Taskboard.**

- Card [DQC-006A: "How do the Tracker and the Taskboard divide alignment from delivery, and where does Frontier fit?"](../../landmark-tracker/destination-questions/DQC-006A.json), revision 8:
  two boards. The Tracker monitors documentation and alignment and the
  Taskboard monitors implementation, with no third grilling board. The
  [Taskboard landmark page](landmark-taskboard.md) covers the other side.

## Open and unresolved

- Where the grilling ledger lives: the card [DQC-005Y: "Where does pre-delivery understanding live, and what becomes of the grilling sources?"](../../landmark-tracker/destination-questions/DQC-005Y.json)
  says the ledger is not moved or replaced, which is accurate as to the Tracker
  replacing it. The later accepted decision record
  [The Wiki is the evolving synthesis every agent reads and updates](../../docs/adr/000R-the-wiki-is-the-evolving-synthesis-every-agent-reads-and-updates.md)
  moves the grilling destination audit ledger out of the Wiki into the sessions
  lane, and the Wiki Evolving-Synthesis Migration Spec (S-003W) Task Ledger Rows
  For The Wiki Grilling (TK-005) delivered that move. The card is unchanged here.
- Landmark definition: the cards still record the landmark as an evolving
  account with its own structured JSON record. The decision record
  ["Landmarks are LANDMARK.md artifacts one size above Specs"](../../docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md)
  revises that: a landmark becomes a `LANDMARK.md` artifact like a Spec with a
  larger scope, the landmark JSON record is retired into question cards, and a
  Spec has at most one parent landmark. The cards' statements that several Specs
  contribute and that landmarks overlap are revised accordingly. The decision is
  accepted; its delivery is not installed. The Specs for it are
  [LANDMARK.md Artifact And Lane Runtime (S-003Z)](../../specs/S-003Z-landmark-md-artifact-and-lane-runtime/SPEC.md)
  and
  [Landmark Record Migration And Tracker Regrouping (S-004A)](../../specs/S-004A-landmark-record-migration-and-tracker-regrouping/SPEC.md),
  both planned with no Tasks cut.
- Identifiers on Wiki pages: the card on the four pieces says Wiki pages carry
  no identifiers. The decision record
  ["The Wiki is the evolving synthesis every agent reads and updates"](../../docs/adr/000R-the-wiki-is-the-evolving-synthesis-every-agent-reads-and-updates.md)
  replaces that with the name-and-context rule: an identifier stays, with the
  artifact's name beside it. It also says the Wiki holds evolving synthesis, not
  only confirmed understanding, and that the cards stay as tooling and state.
- Step names and meaning: the card on the eight steps, and the card on the
  Confirmed step, use Idea, Aligning, Confirmed, Mapped, Planned, Journey,
  Review and Verified as documentation progress. The decision record
  ["The workflow is eight verbs and each verb writes the plane its claims live on"](../../docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md)
  makes these the workflow verbs, rejects the documentation-only reading and
  says Journey is a loop, not a stage. The card on the Confirmed step flags this
  as an unreconciled conflict with the Tracker Spec and the Lexicon; the
  Tracker's installed step list still uses the earlier names.
- Frontier wording: the Tracker and Taskboard card says the formal wording that
  keeps Frontier's ready-Task meaning is not owner-confirmed.
- Skill ownership: no Spec owns the grilling-completion and card-primitive
  skills yet; naming one is a Director action, and Inference from the
  repository as read on 2026-10-04 is that neither skill exists in
  `workbench/skills`.
- Open design details recorded on the cards: the exact link fields between
  grilling sources, cards and landmarks (build design), whether a question
  becomes a landmark and the threshold for that, how the main project
  associates with a landmark (tentative), and the changed-answer mechanics,
  which the card marks as proposed.
- Delivery status: the article [The Landmark Tracker](landmark-tracker.md) says
  the runtime captures, revises, links and rebuilds records and distributions,
  and that Wiki content assessment and record-move recovery are still being
  delivered. Treat those as not complete.

## Where the work lives

Decisions:
[Landmark Tracker connects evolving understanding to durable knowledge](../../docs/adr/000N-landmark-tracker-connects-evolving-understanding-to-durable-knowledge.md),
and the three revising records named above. The capability Specs are
[Landmark Tracker Foundation (S-01T)](../../specs/S-01T-landmark-tracker-foundation/SPEC.md),
which transferred its unfinished delivery to three successors:
[Landmark Tracker (S-001Z)](../../specs/S-001Z-landmark-tracker-view/SPEC.md),
[Landmark Records (S-002A)](../../specs/S-002A-landmark-records/SPEC.md) and
[Destination Question Cards capability Spec (S-002B)](../../specs/S-002B-destination-question-cards/SPEC.md).
The tools are the [Tracker runtime](../../tools/landmark-tracker.mjs) and the
[Landmark Wiki validator](../../tools/landmark-wiki.mjs), with their procedures
in the [Tracker README](../../landmark-tracker/README.md) and the
[Landmark Wiki procedure](../../landmark-tracker/LANDMARK-WIKI.md). The future
shared browser view is
[Shared Interactive Workbench Board (S-004D)](../../specs/S-004D-shared-interactive-board/SPEC.md),
planned only. Definitions are in the [Lexicon](../../../LEXICON.md).

## Related pages

- [The Landmark Tracker](landmark-tracker.md): the owner-facing explanation of the model.
- [Landmark: Taskboard](landmark-taskboard.md): the implementation view the Tracker divides work with.
- [Landmark: Grilling and Shared Understanding](landmark-grilling-and-shared-understanding.md): the sessions the cards synthesize.

## Evidence and Sources

- [Landmark record "Landmark Tracker" (LMK-000X)](../../landmark-tracker/landmarks/LMK-000X.json): title, summary, importance and history.
- The sixteen question cards named above, each at the revision cited: they hold the answers, the confirmation basis, the open uncertainties and the expected results this page summarizes.
- [The Landmark Tracker](landmark-tracker.md): the concept article, which carries the model in depth.

## History

- 2026-10-04: created by the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages), seeded from the cards' current answers.

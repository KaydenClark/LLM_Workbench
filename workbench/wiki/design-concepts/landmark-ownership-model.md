---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Seeded from the current answers of the Ownership Model landmark's question cards (landmark record revision 1), 2026-10-04
source_paths:
  - workbench/landmark-tracker/landmarks
  - workbench/landmark-tracker/destination-questions
  - workbench/docs/adr/000D-the-ownership-map-is-an-exhaustive-type-level-framework-answered-by-structured-query.md
  - workbench/docs/adr/000C-the-workbench-contract-is-the-obligation-claim-set-carried-by-three-root-controls-and-the-assigned-spec.md
  - workbench/specs/S-00G-ownership-map-root-control/SPEC.md
parent: none
authorized_by: the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages)
last_verified: 2026-10-04
---

# Landmark: Ownership Model

This page is the evolving synthesis of the Ownership Model landmark
(landmark ["Ownership Model" (LMK-000M)](../../landmark-tracker/landmarks/LMK-000M.json)).
It sums up what the landmark's fourteen question cards currently say, in prose,
and is updated whenever one of them changes. The cards and the landmark record
keep the structured account and the lineage; the delivering decisions and Specs
govern. For the owner-facing account of how decisions and artifacts relate, read
[Decision records and the concept map](decision-records-and-the-concept-map.md)
and [Delivery altitudes](delivery-altitudes.md). Each card's source answers were
settled by the owner in grilling sessions (one in chat, recovered from the
owner's own messages); the grouping and synthesis inside each card is agent
work, not separately owner-confirmed.

## What the landmark is

Every kind of truth has an identifiable owner, and owning information is
distinct from having authority to act. The landmark covers which artifacts form
the Workbench Contract, how Governance Planes classify claims, how the Blueprint
relates to Specs and Tasks, and the ownership map that answers "where does this
truth belong" by query. It matters because a fresh agent with no prior context
must find the right owner for a fact without reading everything.

## Current accepted answers

- **The Contract and what routes from it**
  (card [DQC-001I: "Which artifacts constitute the Workbench Contract?"](../../landmark-tracker/destination-questions/DQC-001I.json), revision 7).
  The Contract is the root files for agent rules, operations and language,
  read on every run, plus the assigned Spec once selected. The host adapter is
  not a carrier. The Contract routes by intent to routed artifacts (the
  Blueprint, Taskboard, ownership map, README, Specs, Tasks, Wiki, decision
  records and more), which are not all loaded; Core is the Contract plus the
  routing artifacts. The accepted record is
  ["The Workbench Contract is the obligation claim set carried by three root controls and the assigned spec"](../../docs/adr/000C-the-workbench-contract-is-the-obligation-claim-set-carried-by-three-root-controls-and-the-assigned-spec.md).
- **Blueprint binds through the Contract**
  (card [DQC-001K: "How do accepted Blueprint claims constrain work outside the Contract?"](../../landmark-tracker/destination-questions/DQC-001K.json), revision 8).
  Each artifact has one job: the Blueprint is the future state and grand
  design, active decision records are authoritative cross-cutting decisions
  with their reasoning, Specs detail the capabilities that move verified
  Actuality toward the Blueprint within those limits, and the Contract carriers
  own behavior and authority, operation, and language and navigation. The
  Blueprint owns the product destination and journey; each Spec is the smaller
  destination scoped like a product requirements document derived from it; the Contract, not the Blueprint, owns
  the agreement. The decision records are
  ["Active ADR decisions and destination Blueprints"](../../docs/adr/000A-active-adr-decisions-and-destination-blueprints.md)
  and
  ["Blueprint, Spec and Task are three altitudes of one delivery chain"](../../docs/adr/000G-blueprint-spec-and-task-are-three-altitudes-of-one-delivery-chain.md).
- **Planes classify claims, not artifacts.**
  Card [DQC-001J: "How do Governance Planes classify claims within an artifact?"](../../landmark-tracker/destination-questions/DQC-001J.json), revision 5:
  in an accepted, non-superseded decision record the active decision claim is
  architectural Canon, rationale and alternatives usually give Grounding,
  provenance and history may give Enduring Context, a proposed record holds no
  Canon, and a superseded record keeps historical context while its successor
  carries the active Canon. Card
  [DQC-006H: "How does the artifact-level direction heuristic relate to claim-level Governance Planes?"](../../landmark-tracker/destination-questions/DQC-006H.json), revision 5,
  adds that the artifact-level direction model is shorthand collapsing an
  artifact to its dominant claim, planes still classify claims only, and
  "Grounding is transient" holds for Grounding claims.
- **The ownership map: where it lives and what it holds.**
  Card [DQC-001P: "Where should the ownership map live, and what information may it contain?"](../../landmark-tracker/destination-questions/DQC-001P.json), revision 6:
  a separate map is needed, as a root-level routing artifact outside the
  Contract; root placement never implies Contract membership. It holds the
  maintained record of artifact classes, responsibilities, scopes, routes and
  relations, and routes to the artifacts that hold claims without copying them
  or tracking live card instances. The Taskboard is a derived projection. The
  root decision is
  ["The Workbench root surface is eight files and Contract membership is separate from root placement"](../../docs/adr/000B-the-workbench-root-surface-is-eight-files-and-contract-membership-is-separate-from-root-placement.md).
- **Coverage and scope.**
  Card [DQC-001L: "What responsibilities and artifact types must the ownership map cover?"](../../landmark-tracker/destination-questions/DQC-001L.json), revision 8,
  records that the schema is an exhaustive type-level framework, queried rather
  than read whole, with 28 owner-locked rows: 21 single-owner rows, six scoped
  rows and a representation row for the board view, owned by the generated
  board, the situation-report skill and the README. Card
  [DQC-001M: "How does information ownership vary with scope?"](../../landmark-tracker/destination-questions/DQC-001M.json), revision 5,
  adds that an altitude is a scope rather than a file; some responsibilities
  have owners at all three scopes (Blueprint, Spec, Task) and some at two, gaps
  are declared with a route, and permission limits inherit while product
  exclusions refine. The decision record is
  ["The ownership map is an exhaustive type-level framework answered by structured query"](../../docs/adr/000D-the-ownership-map-is-an-exhaustive-type-level-framework-answered-by-structured-query.md).
- **Nine relations.**
  Card [DQC-001N: "Which relationships does the ownership model need to express?"](../../landmark-tracker/destination-questions/DQC-001N.json), revision 5:
  owns, inherits, refines, references, summarizes, provides evidence for,
  canonicalizes, supersedes and blocks. Each is stored once and directional with
  no inverse vocabulary, and each carries a route to where instances are
  recorded; inherits and refines stay separate.
- **Where decisions are recorded.**
  Card [DQC-001O: "Where should architectural, capability and execution-local decisions be recorded?"](../../landmark-tracker/destination-questions/DQC-001O.json), revision 8:
  four tiers. A decision record holds a consequential cross-cutting choice with
  its rationale, a Spec holds a scoped capability choice, a Task body (not the
  Receipt) holds an execution-local choice, and a change to what a Core type
  owns is always a decision record naming the map. The Blueprint holds durable
  whole-product outcomes; implementation specifics and acceptance go in Specs.
  Settled answers route by the whole ownership map.
- **How an assignment changes and how violations are detected.**
  Card [DQC-001Q: "How should an accepted ownership assignment change?"](../../landmark-tracker/destination-questions/DQC-001Q.json), revision 6:
  the map holds accepted rows only with no lifecycle field; a proposed change
  lives in the proposing decision record until accepted, then the applying Task
  rewrites the row; changing which type answers a responsibility is a decision
  record, adjusting a route or wording is a Task. Three guards apply: no
  instance identifiers, no status-shaped field, routes only. Card
  [DQC-001R: "What would a routes-not-claims violation look like, and how is it detected?"](../../landmark-tracker/destination-questions/DQC-001R.json), revision 5,
  names the violation: a map row or query result carrying claim text, an
  instance identifier or a status-shaped field, to be checked by a query-output
  and schema-rejection test. Record lifecycle itself is governed by
  ["Record lifecycle is expressed by folder location with permanent archive and transient retired"](../../docs/adr/000I-record-lifecycle-is-expressed-by-folder-location-with-permanent-archive-and-transient-retired.md).
- **Ownership origins.**
  Card [DQC-001S: "How should upstream and project-local ownership origins be represented?"](../../landmark-tracker/destination-questions/DQC-001S.json), revision 6:
  two origins (upstream Workbench, project-local) and three classifications
  (portable invariants and defaults, project bindings, optional extensions); a
  deliberate change to a baseline assignment is divergence and needs an explicit
  disposition; relationships are defined rather than the full cross-product.
  This is the Ownership origin model, formerly named the portability model.
  Card [DQC-001T: "How should differences from the upstream ownership baseline be classified?"](../../landmark-tracker/destination-questions/DQC-001T.json), revision 8,
  records the owner's choice that an undeclared difference in a legacy room row
  is a conflict until intent is declared, and that this question stays under the
  ownership map's Spec, independent of Portable Workbench.

## Open and unresolved

- Card [DQC-001U: "Do the older six-box and residual sketches contain missing structural behavior?"](../../landmark-tracker/destination-questions/DQC-001U.json), revision 5,
  has no answer and no confirmation. Two sub-questions are open with no owner
  answer: whether the six-box sketch was only explanatory or held a structural
  boundary the current model lacks, and which residual sketch still expresses a
  needed behavior.
- On the decision-tier card, the evidence threshold before a settled answer is
  promoted is only partially answered; reading "locked" as that threshold is an
  interpretation, not an owner ruling.
- For the baseline-difference card, where a divergence disposition and any
  authorizing decision citation live (in the map, or in the decision or report
  that owns the disposition) was not covered by the owner's answer; the Spec's
  recommendation to keep it outside the map remains a recommendation, and the
  field shape is left to implementation under the three guards.
- The durable explanation of inherits versus refines has no named owner yet
  (candidates are the Lexicon or a Wiki article).
- Not delivered: the ownership map file does not exist at this tree's root, and
  the [Ownership Map Root Control Spec (S-00G)](../../specs/S-00G-ownership-map-root-control/SPEC.md)
  is planned with no Task implemented. The cards' expected results still name
  the three root-surface, Contract and ownership-map decision records as
  proposed; they are now accepted and active, and the older seven-file and
  claim-set decision records are archived as superseded.
- Revision notices: the decision record
  ["Contract carriers are briefs that point to skills and authority flows through the pointer"](../../docs/adr/000W-contract-carriers-are-briefs-that-point-to-skills-and-authority-flows-through-the-pointer.md)
  (rewrite planned in the [Contract Carrier Pointer-Brief Rewrite Spec (S-004C)](../../specs/S-004C-contract-carrier-pointer-brief-rewrite/SPEC.md))
  restates each carrier's job, and
  ["Landmarks are LANDMARK.md artifacts one size above Specs"](../../docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md)
  changes what a landmark is. The cards still record the earlier wording;
  those decisions revise it.

## Where the work lives

The [Ownership Map Root Control Spec (S-00G)](../../specs/S-00G-ownership-map-root-control/SPEC.md)
owns the map, its schema and the origin comparator. The Blueprint and decision
record rebuild was delivered by the
[Blueprint, Active ADR, And Context Map Rebuild Spec (S-00A)](../../specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md);
the card expects the whole-Spec review gate to refuse a Spec whose closed Tasks leave a durable choice unescalated, which is the concern of the
[Spec QA Gate And Corrective-Task Return Path Spec (S-00J)](../../specs/S-00J-spec-qa-gate-at-integration/SPEC.md).
The current ownership schema is in [LEXICON](../../../LEXICON.md) (Artifact
Ownership Schema) and the rules in [AGENTS](../../../AGENTS.md).

## Related pages

- [Decision records and the concept map](decision-records-and-the-concept-map.md)
- [Delivery altitudes](delivery-altitudes.md)
- [Landmark: Portable Workbench](landmark-portable-workbench.md)

## Evidence and Sources

- [Landmark record "Ownership Model" (LMK-000M)](../../landmark-tracker/landmarks/LMK-000M.json): title, summary, importance and history.
- The fourteen question cards named above, each at the revision cited: they hold the answers, the confirmation basis, the open uncertainties and the expected homes this page summarizes.

## History

- 2026-10-04: created by the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages), seeded from the cards' current answers.

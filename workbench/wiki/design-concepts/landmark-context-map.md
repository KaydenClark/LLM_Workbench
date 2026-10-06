---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Seeded from the current answers of the Context Map landmark's question cards (landmark record revision 1), 2026-10-04
source_paths:
  - workbench/landmark-tracker/landmarks
  - workbench/landmark-tracker/destination-questions
  - workbench/docs/adr/000C-the-workbench-contract-is-the-obligation-claim-set-carried-by-three-root-controls-and-the-assigned-spec.md
  - workbench/docs/adr/000A-active-adr-decisions-and-destination-blueprints.md
  - workbench/docs/adr/000W-contract-carriers-are-briefs-that-point-to-skills-and-authority-flows-through-the-pointer.md
parent: none
authorized_by: the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages)
last_verified: 2026-10-04
---

# Landmark: Context Map

This page is the evolving synthesis of the Context Map landmark
(landmark ["Context Map" (LMK-000L)](../../landmark-tracker/landmarks/LMK-000L.json)).
It sums up what the landmark's three question cards currently say, in prose,
and is updated whenever one of them changes. The cards and the landmark record
keep the structured account; the decisions and controls named below govern.

## What the landmark is

An agent can reach the smallest relevant owner of a piece of information by
following maintained routes, instead of loading everything or searching the
whole repository. It matters because the cost of a fresh session depends on
what it must read before it can start, and because a map that is copied into
several places drifts into several maps.

## Current accepted answers

Each card records its source answers as owner-settled in their grilling
sessions; the card's grouping, title and synthesis are agent work and were not
separately confirmed.

- **What ordinary entry reads.** Card
  [DQC-001F: "What must an agent read on ordinary entry?"](../../landmark-tracker/destination-questions/DQC-001F.json), revision 7:
  the Contract is the three root controls, AGENTS.md, RUNBOOK.md and
  LEXICON.md, read every run, plus the assigned `SPEC.md` after selection,
  because that Spec delegates the work's scope and verification. The Blueprint
  and ADRs are not universal startup reading; they are reached by routing, the
  Blueprint when the task needs architecture or cross-cutting direction.
  CLAUDE.md is a host adapter, not a carrier. The Contract routes by intent to
  routed artifacts (Blueprint, Taskboard, ownership map, README, Specs, Tasks,
  Wiki, decision records and more), which are not all loaded. This is recorded
  in the decision record
  ["The Workbench Contract is the obligation claim set carried by three root controls and the assigned spec"](../../docs/adr/000C-the-workbench-contract-is-the-obligation-claim-set-carried-by-three-root-controls-and-the-assigned-spec.md),
  which supersedes the earlier seven-control claim set, and in
  ["Reduced entry and autonomy within assigned work"](../../docs/adr/0035-reduced-entry-and-assigned-autonomy.md).
- **One map, one owner each.** Card
  [DQC-001G: "How does an agent navigate from a question to its smallest relevant owner?"](../../landmark-tracker/destination-questions/DQC-001G.json), revision 6:
  the Lexicon owns the single Context Map, RUNBOOK.md owns the ordinary entry
  procedure and points to that map, and AGENTS.md requires traversal ("traverse,
  don't search") without copying the map. The Lexicon is the shared dictionary,
  the Context Map, the record of shared understanding and the hub of the
  Navlink system: settled terms, what they mean and a link from each to the
  artifact that holds the deeper context. Unsettled questions do not belong in
  it as if they were defined meaning. The traversal rule is the accepted
  decision ["Traverse, don't search is core Workbench navigation"](../../docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md),
  and the one-map rule is stated in
  ["Active ADR decisions and destination Blueprints"](../../docs/adr/000A-active-adr-decisions-and-destination-blueprints.md).
- **Extended procedure guides.** Card
  [DQC-003J: "How should extended guidebooks be routed and when is a broader library justified?"](../../landmark-tracker/destination-questions/DQC-003J.json), revision 6:
  the root RUNBOOK.md stays the authoritative index of procedures, and
  AGENTS.md may approve a bounded subordinate guidebook when one procedure
  genuinely needs it. A general guidebook reorganization is deferred; the
  owner placed it in the backlog after v4, and until then only task-sized
  guides are added where immediate usability needs them. A linked Wiki
  guidebook may hold an extended procedure but cannot authorize work.

## Open and unresolved

- Which broad guidebook library should eventually exist is not settled; the
  card records it as deferred, with only task-sized guides in the meantime.
- Inference: the guidebook collection is declared in the manifest and the
  Lexicon has a row for it, but the Wiki guidebooks folder holds no guide at
  the time of writing, and AGENTS.md does not carry the sentence that it may
  approve a guidebook, which the card named as an expected home. Whether that
  sentence is still wanted is not recorded.
- The card still says RUNBOOK.md owns the entry procedure. The later decision
  ["Contract carriers are briefs that point to skills and authority flows through the pointer"](../../docs/adr/000W-contract-carriers-are-briefs-that-point-to-skills-and-authority-flows-through-the-pointer.md)
  makes RUNBOOK.md an index of operations whose procedures live in skills, and
  lets a skill that a carrier points to carry Contract force for that
  operation. AGENTS.md already enters through the operations index; the rewrite
  is still in progress in
  [Contract Carrier Pointer-Brief Rewrite (S-004C)](../../specs/S-004C-contract-carrier-pointer-brief-rewrite/SPEC.md),
  and that decision's own text names the gap.
- The Lexicon's opening does not describe it as the Navlink hub, and the card's
  expected change to the owner's personal installed lexicon skill lies outside
  this repository; neither is verified here. The repository's
  [lexicon skill alignment Spec (S-003O)](../../specs/S-003O-lexicon-skill-alignment/SPEC.md)
  is planned.

## Where the work lives

Decisions: the three records linked above, plus
["The Workbench root surface is eight files and Contract membership is separate from root placement"](../../docs/adr/000B-the-workbench-root-surface-is-eight-files-and-contract-membership-is-separate-from-root-placement.md),
["A fresh session loads only the context its work needs"](../../docs/ddr/000F-a-fresh-session-loads-only-the-context-its-work-needs.md)
and ["Every kind of truth has one maintained home"](../../docs/ddr/000G-every-kind-of-truth-has-one-maintained-home.md).
Specs: [Blueprint, Active ADR, And Context Map Rebuild (S-00A)](../../specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md),
[Ownership Map Root Control (S-00G)](../../specs/S-00G-ownership-map-root-control/SPEC.md),
[Contract Carrier Pointer-Brief Rewrite (S-004C)](../../specs/S-004C-contract-carrier-pointer-brief-rewrite/SPEC.md)
and [Lexicon Design-Concept Reconciliation (S-01U)](../../specs/S-01U-lexicon-design-concept-reconciliation/SPEC.md).
Controls: [AGENTS](../../../AGENTS.md), [RUNBOOK](../../../RUNBOOK.md) and
[LEXICON](../../../LEXICON.md) (Task Routing and the Context Map row), with the
guidebook collection declared in the [manifest](../../manifest.json).

## Related pages

[Decision records and the concept map](decision-records-and-the-concept-map.md)
explains how the Blueprint, decision records and ADRs fit together.

## Evidence and Sources

- [Landmark record "Context Map" (LMK-000L)](../../landmark-tracker/landmarks/LMK-000L.json): title, summary and importance.
- The three question cards named above, each at the revision cited.
- [AGENTS](../../../AGENTS.md) and [LEXICON](../../../LEXICON.md), read for the current entry route on 2026-10-04.

## History

- 2026-10-04: created by the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages), seeded from the cards' current answers.

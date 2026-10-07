---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Seeded from the current answers of the Artifact Types landmark's question cards (landmark record revision 1), 2026-10-04
source_paths:
  - workbench/landmark-tracker/landmarks
  - workbench/landmark-tracker/destination-questions
  - workbench/docs/adr/000A-active-adr-decisions-and-destination-blueprints.md
  - workbench/docs/adr/000B-the-workbench-root-surface-is-eight-files-and-contract-membership-is-separate-from-root-placement.md
  - workbench/docs/adr/000C-the-workbench-contract-is-the-obligation-claim-set-carried-by-three-root-controls-and-the-assigned-spec.md
parent: none
authorized_by: the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages)
last_verified: 2026-10-04
---

# Landmark: Artifact Types

This page is the evolving synthesis of the Artifact Types landmark
(landmark ["Artifact Types" (LMK-000F)](../../landmark-tracker/landmarks/LMK-000F.json)).
It sums up, in prose, what the landmark's fifteen question cards currently say
about what each kind of Workbench record is for, and is updated whenever one of
them changes. The cards and the landmark record keep the structured account and
the lineage. The decision records, the glossary and the Specs named below govern.
For the explanations of how the altitudes and the decision chain fit together,
read [The three altitudes of delivery](delivery-altitudes.md) and
[Decision records and the concept map](decision-records-and-the-concept-map.md),
which go deeper than this synthesis.

## What the landmark is

Each kind of record in a Workbench has one clear job, relationships to the
others, and a lifecycle: how it is created, how it is reconciled, and how it is
retired so that its knowledge stays reachable. The landmark matters because
confusion between the jobs is the usual way a room drifts: a Blueprint that
carries status, a Spec treated as permanent documentation, or a decision
recorded in two places.

Every card below says its source answers were settled by the owner in earlier
grilling sessions; the card's own grouping, title and synthesis are agent work
and not separately owner-confirmed.

## Current accepted answers

- **The root surface and the Contract.** The accepted destination has eight
  root files: the seven current ones plus an `OWNERSHIP.json` routing artifact,
  with a generated `TASKBOARD.json` replacing `TASKBOARD.md`. Root placement
  never implies membership in the Contract, and the `workbench/` directory is
  support records, not a second control root
  (card [DQC-000O: "Which artifacts need to be discoverable at the room root?"](../../landmark-tracker/destination-questions/DQC-000O.json), revision 9).
  That destination is recorded in
  [Decision record "The Workbench root surface is eight files and Contract membership is separate from root placement"](../../docs/adr/000B-the-workbench-root-surface-is-eight-files-and-contract-membership-is-separate-from-root-placement.md)
  and leads the implementation: the repository root still shows `TASKBOARD.md`
  and no `OWNERSHIP.json` as of 2026-10-04. The Contract is the three carriers
  read on every run plus the assigned Spec, and the Blueprint is a routed
  artifact they direct agents to by intent
  (card [DQC-001K: "How do accepted Blueprint claims constrain work outside the Contract?"](../../landmark-tracker/destination-questions/DQC-001K.json), revision 8;
  [Decision record "The Workbench Contract is the obligation claim set carried by three root controls and the assigned spec"](../../docs/adr/000C-the-workbench-contract-is-the-obligation-claim-set-carried-by-three-root-controls-and-the-assigned-spec.md)).
- **The Lexicon holds settled meaning only.** It is the shared dictionary,
  Context Map and hub of navigation links, the starting surface for traversing
  rather than searching; an unsettled question does not belong there as if it
  were defined
  (card [DQC-001H: "What belongs in the Lexicon as shared meaning?"](../../landmark-tracker/destination-questions/DQC-001H.json), revision 5).
- **One job per artifact, and where a decision goes.** The Blueprint is the
  future-state destination narrative, active decision records are the
  authoritative cross-cutting decisions, Specs detail capabilities that move
  verified reality toward the Blueprint, and the Contract carries behavior,
  operation and language
  (card [DQC-001K: "How do accepted Blueprint claims constrain work outside the Contract?"](../../landmark-tracker/destination-questions/DQC-001K.json), revision 8;
  card [DQC-001V: "What must the Blueprint explain about the finished product?"](../../landmark-tracker/destination-questions/DQC-001V.json), revision 8).
  A whole-product outcome can sit in the Blueprint without a decision record;
  scoped, testable requirements go in a Spec; a decision record exists only for
  a consequential architectural choice and its reasons
  (card [DQC-001W: "Which whole-product requirements belong in Blueprint rather than Specs or ADRs?"](../../landmark-tracker/destination-questions/DQC-001W.json), revision 6).
  Decisions have four tiers: a decision record for a cross-cutting choice, a
  Spec for a scoped capability choice, the Task body for an execution-local
  choice, and always a decision record when a change alters what a core
  artifact type owns
  (card [DQC-001O: "Where should architectural, capability and execution-local decisions be recorded?"](../../landmark-tracker/destination-questions/DQC-001O.json), revision 8).
- **What the Blueprint holds and excludes.** It describes the destination, may
  link active decision records selectively inline where they materially explain
  or constrain it, and keeps out version history, release goals, live status,
  implementation evidence and generated Spec catalogs
  (card [DQC-001V: "What must the Blueprint explain about the finished product?"](../../landmark-tracker/destination-questions/DQC-001V.json), revision 8;
  card [DQC-001Y: "How should active ADRs inform the Blueprint narrative?"](../../landmark-tracker/destination-questions/DQC-001Y.json), revision 5;
  card [DQC-001Z: "How is live status and release history kept out of the Blueprint?"](../../landmark-tracker/destination-questions/DQC-001Z.json), revision 7).
  When the owner asks whether a candidate is ready for main, the independent
  reviewer checks that boundary semantically; mechanical checks support but do
  not replace that. Rewriting the Blueprint needs a claim-by-claim disposition
  so nothing is discarded for tidiness
  (card [DQC-002A: "How can misplaced Blueprint claims move without losing substance?"](../../landmark-tracker/destination-questions/DQC-002A.json), revision 5).
- **Decision records as Canon.** An accepted, non-superseded decision record is
  authoritative without being copied into another control; planes classify
  claims, not whole records, and a proposed record holds no Canon
  (card [DQC-002B: "When does an ADR become active architectural Canon?"](../../landmark-tracker/destination-questions/DQC-002B.json), revision 7).
  Supersession replaces a whole record through an explicit successor;
  deprecation ends Canon with an explanation; partial supersession is
  prohibited
  (card [DQC-002C: "How should a decision be superseded or deprecated?"](../../landmark-tracker/destination-questions/DQC-002C.json), revision 6).
  Acceptance of the reconciled root, Contract and ownership-map decisions
  proceeded first, so the accepted destination may lead the installed files
  without contradictory controls
  (card [DQC-002E: "How should acceptance and artifact migration be sequenced without contradictory controls?"](../../landmark-tracker/destination-questions/DQC-002E.json), revision 6).
- **Retirement and reachability.** Specs and Tasks are transient working
  artifacts. Once their useful content is in readable durable documentation and
  the exact change is verified on main they are retired and discarded, and a
  Spec closes only after separate-context review and the owner's Human QA on
  integration. The derived state of a finished board card follows record
  location, not an authored status
  (card [DQC-004K: "When is it safe to discard reconciled Spec and Task records?"](../../landmark-tracker/destination-questions/DQC-004K.json), revision 9).
  Retired decision history stays reachable by navigating to the Wiki
  explanation first, which links archived records as sources, while the archive
  is kept
  (card [DQC-002D: "How should retired ADR history remain reachable?"](../../landmark-tracker/destination-questions/DQC-002D.json), revision 8).

## Newer decisions that revise these cards

- card [DQC-001X: "How adaptable should the generic Blueprint structure be?"](../../landmark-tracker/destination-questions/DQC-001X.json), revision 6
  still records an eight-section Blueprint shape with omittable headings. The
  later decision
  [Decision record "Every room's Blueprint is the four-part short page"](../../docs/ddr/000N-every-room-s-blueprint-is-the-four-part-short-page.md)
  replaces that shape with the four-part short page for every room, and
  [Decision record "The Blueprint is a high-level summary of the direction and makes us ask questions"](../../docs/ddr/000O-the-blueprint-is-a-high-level-summary-of-the-direction-and-makes-us-ask-questions.md)
  sets the Blueprint as a high-level summary of direction that makes agents ask
  questions. Until the card is updated, treat the card's eight sections as
  superseded in shape; the exclusions above still hold.
- [Decision record "Working artifacts are scaffolding, cleared away once their knowledge is kept"](../../docs/ddr/000M-working-artifacts-are-scaffolding-cleared-away-once-their-knowledge-is-kept.md)
  restates the retirement answer: scaffolding is cleared away at Clean Up once
  its knowledge, unfinished obligations and evidence reached durable owners, and
  nothing is archived; a later gap becomes a new Spec rather than a revived one.
- [Decision record "Landmarks are LANDMARK.md artifacts one size above Specs"](../../docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md)
  changes what a landmark is, and retires the landmark JSON records this page cites into question cards
  once its delivery lands, and
  [Decision record "The Wiki is the evolving synthesis every agent reads and updates"](../../docs/adr/000R-the-wiki-is-the-evolving-synthesis-every-agent-reads-and-updates.md)
  makes the Wiki the evolving synthesis this page belongs to.

## Open and unresolved

- Whether the whole-record supersession rule governs older active records too,
  or a clearly marked exception is intended, has no owner answer
  (card [DQC-002C: "How should a decision be superseded or deprecated?"](../../landmark-tracker/destination-questions/DQC-002C.json), revision 6).
- The evidence threshold before locked answers are promoted into durable owners
  is a partly answered question; reading "locked" as that threshold is an
  interpretation, not an owner ruling
  (card [DQC-001O: "Where should architectural, capability and execution-local decisions be recorded?"](../../landmark-tracker/destination-questions/DQC-001O.json), revision 8).
- Inference: the eight-file root, the generated JSON board and the ownership map
  are accepted destination, not installed behavior. Their delivery is owned by
  the Specs below, and nothing here claims them complete.
- The Blueprint cards cite the earlier eight-section shape and the Blueprint
  teardown has since moved some of that content to other pages; the cards have
  not yet been reconciled to the newer decisions above.

## Where the work lives

The Blueprint, active-decision and Context Map rebuild is
[Blueprint, Active ADR, And Context Map Rebuild (S-00A)](../../specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md);
the ownership map is [Ownership Map Root Control (S-00G)](../../specs/S-00G-ownership-map-root-control/SPEC.md)
and the generated board is [Generated JSON Taskboard (S-01X)](../../specs/S-01X-generated-json-taskboard/SPEC.md).
Record lifecycle by folder is [Retirement Lifecycle By Folder For Records (S-00I)](../../specs/S-00I-folder-lifecycle-for-records/SPEC.md),
the Spec review gate and corrective return is [Spec QA Gate And Corrective-Task Return Path (S-00J)](../../specs/S-00J-spec-qa-gate-at-integration/SPEC.md),
and the controls rework around the new board is [Workflow Canon Rework (S-00P)](../../specs/S-00P-workflow-canon-rework/SPEC.md).
Decisions: [Decision record "Active ADR decisions and destination Blueprints"](../../docs/adr/000A-active-adr-decisions-and-destination-blueprints.md),
[Decision record "The ownership map is an exhaustive type-level framework answered by structured query"](../../docs/adr/000D-the-ownership-map-is-an-exhaustive-type-level-framework-answered-by-structured-query.md),
[Decision record "Blueprint, Spec and Task are three altitudes of one delivery chain"](../../docs/adr/000G-blueprint-spec-and-task-are-three-altitudes-of-one-delivery-chain.md),
[Decision record "A Task is a standalone artifact and Task replaces Ticket as the execution-slice term"](../../docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md) and
[Decision record "Record lifecycle is expressed by folder location with permanent archive and transient retired"](../../docs/adr/000I-record-lifecycle-is-expressed-by-folder-location-with-permanent-archive-and-transient-retired.md).
The Blueprint boundary check is the test `tools/test-blueprint-contract.mjs`
and the Runbook's independent review boundaries.

## Related pages

[Landmark: GitHub Coordination](landmark-github-coordination.md) shows the same
page shape for a sibling landmark;
[Task artifact and lifecycle](task-artifact-and-lifecycle.md) explains the Task
artifact in depth.

## Evidence and Sources

- landmark ["Artifact Types" (LMK-000F)](../../landmark-tracker/landmarks/LMK-000F.json): title, summary, importance and history.
- The fifteen question cards named above, each at the revision cited: they hold
  the answers, the confirmation basis, the open uncertainties and the named
  claims this page summarizes.
- [The three altitudes of delivery](delivery-altitudes.md) and
  [Decision records and the concept map](decision-records-and-the-concept-map.md).

## History

- 2026-10-04: created by the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages), seeded from the cards' current answers.
- 2026-10-04: corrected after the whole-Wiki lint of the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-006P (Wiki wording): the Destination Question Card DQC-002D citation moved from revision 7 to revision 8 (only its expected-result route changed; the answer is unchanged).
- 2026-10-07: Re-pointed the retiring Lexicon's links and live routes to `GLOSSARY.md`, `ARCHITECTURE.md` and the Wiki lexicon articles (the Lexicon Retirement Spec (S-004O), its consumer re-pointing Task (TK-009F)); no claim changed.

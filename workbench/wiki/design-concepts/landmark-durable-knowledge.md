---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Seeded from the current answers of the Durable Knowledge landmark's question cards (landmark record revision 1), 2026-10-04
source_paths:
  - workbench/landmark-tracker/landmarks
  - workbench/landmark-tracker/destination-questions
  - workbench/docs/adr/000I-record-lifecycle-is-expressed-by-folder-location-with-permanent-archive-and-transient-retired.md
  - workbench/docs/ddr/000M-working-artifacts-are-scaffolding-cleared-away-once-their-knowledge-is-kept.md
  - workbench/docs/adr/0054-direct-promotion-into-durable-owners.md
parent: none
authorized_by: the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages)
last_verified: 2026-10-04
---

# Landmark: Durable Knowledge

This page is the evolving synthesis of the Durable Knowledge landmark
(landmark [LMK-000N: "Durable Knowledge landmark"](../../landmark-tracker/landmarks/LMK-000N.json)).
It sums up, in prose, what the landmark's fourteen question cards currently say
and is updated whenever one of them changes. The cards keep the structured
account and the lineage; the decision records and Specs below govern. Several
cards predate newer accepted decisions, and this page says where.

## What the landmark is

Useful understanding must survive completed delivery and the retirement of the
temporary working records that produced it. The landmark covers how a Spec, a
Task, a notepad or a grilling answer is turned into readable durable knowledge
before it is cleared away, what is kept, and how a later correction reaches
that knowledge. The owner approved it as a core-path pillar on 2026-09-26. A
mistake here either loses knowledge that was never written down or lets a
retired record keep steering work.

The source answers on every card were settled by the owner in grilling
sessions; each card's grouping, title and synthesis is agent work, not
separately owner-confirmed.

## Current accepted answers

- **Specs and Tasks are scaffolding.** They are transient working artifacts, not
  product documentation. Once their useful content is readable durable
  documentation and the exact change is verified on main, they are retired and
  discarded
  (card [DQC-004J: "What should remain after a Spec becomes delivered product knowledge?"](../../landmark-tracker/destination-questions/DQC-004J.json), revision 7;
  card [DQC-004K: "When is it safe to discard reconciled Spec and Task records?"](../../landmark-tracker/destination-questions/DQC-004K.json), revision 9).
  A Spec closes only after separate-context review passes and owner Human QA on
  integration confirms the destination is reached; it is then reconciled into
  the Wiki and retired, and no merge closes it by itself. The Blueprint, the
  Wiki and the Taskboard are the enduring and navigational surfaces. The
  destination record
  ["Working artifacts are scaffolding, cleared away once their knowledge is kept"](../../docs/ddr/000M-working-artifacts-are-scaffolding-cleared-away-once-their-knowledge-is-kept.md)
  and the decision record
  ["Record lifecycle is expressed by folder location with permanent archive and transient retired"](../../docs/adr/000I-record-lifecycle-is-expressed-by-folder-location-with-permanent-archive-and-transient-retired.md)
  carry this.
- **When a Task retires.** After its results and needed proof are reconciled into
  the owning Spec, the Task is retired: its branch and worktree are deleted
  after verified containment, it leaves ordinary pickup, and its record survives
  only as history reachable by an explicit route
  (card [DQC-004I: "What must be captured before a completed Task retires?"](../../landmark-tracker/destination-questions/DQC-004I.json), revision 6).
- **Capture is separate from cleanup.** Complete is derived, never authored on the
  board: a complete record in a live folder is ready to capture, one in the
  retired folder is captured and ready to delete, and a deleted one drops off
  (card [DQC-003R: "How should Complete distinguish capture from final cleanup?"](../../landmark-tracker/destination-questions/DQC-003R.json), revision 8).
  The same card records the owner's redirect to a generated JSON board with six
  lanes that replaces the Markdown board.
- **Features articles.** A new Wiki collection named features holds one article
  per completed Spec, written at the closure point and not as a new gate
  (card [DQC-004L: "What should a Wiki feature article explain, and when is it written?"](../../landmark-tracker/destination-questions/DQC-004L.json), revision 7).
  The collection exists; see the [features README](../features/README.md).
- **Retired decisions stay reachable.** Navigation from historical capability
  links goes to the Wiki article first, and the article links archived decision
  records as sources; the archive is kept
  (card [DQC-002D: "How should retired ADR history remain reachable?"](../../landmark-tracker/destination-questions/DQC-002D.json), revision 7).
  Articles exist for [Governance Core, ADRs, And Scoped Diagnostics (S-024)](../features/governance-planes-adr-decisions-and-scoped-diagnostics.md)
  and [LLM Workbench release article (S-022)](../features/historical-v3-1-release-proof-packet.md).
- **How confirmed answers reach owners.** A grilling answer never enters Canon
  inline; it is promoted through ordinary scoped work, a Task when small and a
  Spec with Tasks when broad, routed by the ownership map to the Lexicon, root
  controls, a Spec or a decision record
  (card [DQC-002I: "How do confirmed answers reach durable owners?"](../../landmark-tracker/destination-questions/DQC-002I.json), revision 9).
  A promotion handoff is not authority to implement what it promotes.
- **Working, confirmed and promoted are different.** A working answer is
  provisional; owner confirmation settles the scoped design answer but does not
  authorize implementation or promotion; authorized reconciliation writes
  supported claims to their owners, and saving Wiki prose never makes it an
  instruction
  (card [DQC-006F: "What separates a working answer, a confirmed answer and promoted Canon?"](../../landmark-tracker/destination-questions/DQC-006F.json), revision 6).
- **Notes.** Promote before the session ends is the goal; the owner amended it so
  notes and handoffs may be committed for a while as transport, never as evidence
  (card [DQC-004Q: "When should working material be promoted instead of copied into a checkpoint?"](../../landmark-tracker/destination-questions/DQC-004Q.json), revision 6;
  decision record ["Direct promotion into durable owners"](../../docs/adr/0054-direct-promotion-into-durable-owners.md)).
- **The four pieces and their links.** Question cards keep concept understanding
  and lineage, landmarks connect the evolving account, the generated Tracker
  shows the compact view, and the Wiki explains in readable Markdown
  (card [DQC-005W: "How do destination question cards, landmarks, the Tracker and the Wiki divide their jobs?"](../../landmark-tracker/destination-questions/DQC-005W.json), revision 9).
  A changed answer should preserve what changed and why, and assess which
  specific claims it affects instead of assuming every link is stale
  (card [DQC-006E: "How does a changed answer expose the claims it affects?"](../../landmark-tracker/destination-questions/DQC-006E.json), revision 6).
  Live Tracker navigation uses current identities and resolved paths, historical
  proof keeps immutable commit and path citations, and ignored local notes must
  stay until reconciled
  (card [DQC-006G: "How do Tracker evidence links stay recoverable after their sources retire?"](../../landmark-tracker/destination-questions/DQC-006G.json), revision 6).

## Open and unresolved

- **Corrections after retirement.** The card [DQC-004M: "How should later corrections maintain knowledge from a retired Spec?"](../../landmark-tracker/destination-questions/DQC-004M.json), revision 7,
  still records a corrective Task plus an update to the Wiki record of the retired
  Spec. The destination record on scaffolding, the lifecycle decision record above
  and the [Corrective Work Rules Spec (S-004F)](../../specs/S-004F-corrective-work-rules/SPEC.md)
  revise that half: a later gap against delivered work becomes a new Spec under its
  landmark or the Blueprint, never a revived Spec and never a correction anchored to
  a Wiki claim. The same card's routing by scope and destination is not contradicted
  by those records, but the card needs a refresh.
- **Evidence threshold before promotion.** The card [DQC-002J: "What evidence is sufficient before promoting a settled answer?"](../../landmark-tracker/destination-questions/DQC-002J.json), revision 6,
  and the promotion card both record it as open; reading "locked" as the threshold was
  an interpretation, not an owner ruling. The decision record
  ["A locked and confirmed answer is promoted without further ceremony"](../../docs/adr/000Y-a-locked-and-confirmed-answer-is-promoted-without-further-ceremony.md)
  says a locked and confirmed answer needs no extra ceremony. Inference: that likely
  settles the threshold, but neither card has been updated to say so.
- **Wiki scope.** The four-piece card says the Wiki holds only confirmed durable
  understanding, without identifiers, and that landmark records are JSON. The decision
  record ["The Wiki is the evolving synthesis every agent reads and updates"](../../docs/adr/000R-the-wiki-is-the-evolving-synthesis-every-agent-reads-and-updates.md)
  supersedes the first two points, and
  ["Landmarks are LANDMARK.md artifacts one size above Specs"](../../docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md)
  retires the JSON landmark record, with delivery still planned.
- **Not delivered.** The generated JSON board and the status skill that reports Complete as
  two counts are not in the repository: the root still carries the Markdown board and the
  skills lane has no such skill. The proposed decision record on the frontier and Taskboard
  has not moved out of proposed. The temporary-commit amendment for notes is not reflected
  in the agents file, which still says live notes stay untracked.
- **Changed-answer mechanics.** The answer on exposing affected claims calls its mechanics
  proposed; only the principle was settled.

## Where the work lives

Lifecycle and discard: [Retirement Lifecycle By Folder For Records (S-00I)](../../specs/S-00I-folder-lifecycle-for-records/SPEC.md),
[Lifecycle Discard And Identity Repair (S-00T)](../../specs/S-00T-lifecycle-discard-repair/SPEC.md),
[Legacy Completed Record Migration (S-00Q)](../../specs/S-00Q-legacy-completed-record-migration/SPEC.md)
and [Workflow Canon Rework (S-00P)](../../specs/S-00P-workflow-canon-rework/SPEC.md).
The board: [Generated JSON Taskboard (S-01X)](../../specs/S-01X-generated-json-taskboard/SPEC.md).
Records and the Tracker: [Landmark Records (S-002A)](../../specs/S-002A-landmark-records/SPEC.md),
[Landmark Tracker Foundation (S-01T)](../../specs/S-01T-landmark-tracker-foundation/SPEC.md) and the decision record
["Landmark Tracker connects evolving understanding to durable knowledge"](../../docs/adr/000N-landmark-tracker-connects-evolving-understanding-to-durable-knowledge.md).
The ownership map: [Ownership Map Root Control (S-00G)](../../specs/S-00G-ownership-map-root-control/SPEC.md).
The tools are the [landmark tracker](../../tools/landmark-tracker.mjs) and the
[Wiki validator](../../tools/wiki.mjs). The routing rules live in
[LEXICON.md](../../../LEXICON.md) and [AGENTS.md](../../../AGENTS.md).

## Related pages

- [Landmark: Wiki](landmark-wiki.md) shares the features-article, correction and four-piece cards.
- [Task artifact and lifecycle](task-artifact-and-lifecycle.md) explains the Task record these cards retire.
- [Landmark tracker](landmark-tracker.md) explains the Tracker side in depth.

## Evidence and Sources

- [LMK-000N: "Durable Knowledge landmark record"](../../landmark-tracker/landmarks/LMK-000N.json): title, summary, importance and history.
- The fourteen question cards named above, each at the revision cited: they hold the answers, confirmation basis, open uncertainties and named claims this page summarizes.

## History

- 2026-10-04: created by the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages), seeded from the cards' current answers.

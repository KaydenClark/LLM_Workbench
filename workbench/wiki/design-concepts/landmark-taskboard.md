---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Seeded from the current answers of the Taskboard landmark's question cards (landmark record revision 1), 2026-10-04
source_paths:
  - workbench/landmark-tracker/landmarks
  - workbench/landmark-tracker/destination-questions
  - workbench/specs/S-01X-generated-json-taskboard/SPEC.md
  - workbench/docs/adr/proposed/000E-the-frontier-is-the-active-landscape-and-taskboard-renders-it.md
parent: none
authorized_by: the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages)
last_verified: 2026-10-04
---

# Landmark: Taskboard

This page is the evolving synthesis of the Taskboard landmark
(landmark [Taskboard landmark (LMK-000Q)](../../landmark-tracker/landmarks/LMK-000Q.json)).
It sums up what the landmark's fifteen question cards currently say, in prose,
and is updated whenever one of them changes. The cards and the landmark record
keep the structured account and the lineage; the delivering Specs and decision
records govern. No existing concept article covers the Taskboard as a whole.
The closest neighbors are [The Task Artifact And Its Lifecycle](task-artifact-and-lifecycle.md)
and [The Landmark Tracker](landmark-tracker.md), which holds the alignment side
of the same division.

## What the landmark is

The owner and agents need to see implementation work, its dependencies,
readiness, blockers and what is waiting for review. The Taskboard is that view.
It is a generated projection: Specs and Tasks author work state, the board
displays it, and nothing is written on the board itself. The landmark matters
because the board changes how work is picked up (`next`), how blockers surface
(`doctor`) and how the owner reads progress (`sitrep`), so a mistake here
changes what every agent is offered and what the owner is told.

## Current accepted answers

Every source answer behind these cards was settled by the owner in its grilling
session. The grouping of answers into cards and the card titles are agent work
and were not separately confirmed by the owner; that applies to all fifteen
cards below.

**What the board is and what it renders.**

- Card [DQC-003M: "Which board format and lanes should present implementation work?"](../../landmark-tracker/destination-questions/DQC-003M.json), revision 7:
  the owner redirected the older one-row-per-Spec Markdown dashboard to a
  generated JSON board, an Agile Kanban board with six lanes (Backlog, To do,
  In progress, Blocked, Needs review, Complete). It replaces the Markdown
  board as the root contract artifact, with no Markdown view alongside it.
  Cards are keyed by the visible identifier and carry no kind field, the
  schema starts loose, the owner is the assignee, and agents never write it.
  The build order was settled as the identifier Spec, then the board Spec,
  then the controls rewrite, then the release.
- Card [DQC-003K: "Which record authors work state, and what does the board project?"](../../landmark-tracker/destination-questions/DQC-003K.json), revision 8:
  the board is the project-management and Kanban view, not the navigation view
  (the Lexicon keeps the context-map role). Specs and Tasks own progress,
  issues, evidence and recoverable context; the board holds as little
  irreplaceable context as possible, so `sitrep` can read only the board and
  still give a complete active picture. An altitude is a scope, not a file, and
  the ownership map routes to the artifacts holding claims without copying them.
- Card [DQC-003L: "What should the Frontier describe?"](../../landmark-tracker/destination-questions/DQC-003L.json), revision 5:
  Frontier is not a rename of Kanban. Map is a low-resolution index around a
  destination, Fog is not-yet-specifiable work, and the Frontier is the open,
  unblocked, unclaimed Tasks.

**Cards, hierarchy and the Backlog.**

- Card [DQC-003N: "How should Spec and Task cards show hierarchy without double-counting work?"](../../landmark-tracker/destination-questions/DQC-003N.json), revision 6:
  Specs always appear as cards and a Spec card counts its child Tasks, so
  progression is shown rather than duplicated. A Spec cannot move to Needs
  review or Complete until all its Tasks are in one of those two lanes, and not
  every Task has to belong to a Spec.
- Card [DQC-003T: "What qualifies as a backlog item, and where should it live?"](../../landmark-tracker/destination-questions/DQC-003T.json), revision 6:
  the Backlog is the residual lane for things the owner has asked for and
  described but not decided to start. Each is a bare-bones Spec that can be one
  sentence; there is no separate backlog record type.
- Card [DQC-003U: "When should a planned Spec be decomposed into Tasks?"](../../landmark-tracker/destination-questions/DQC-003U.json), revision 5:
  a new Spec enters the Backlog as planned with no Tasks; Tasks are cut from
  live state when it moves to To do. In-flight Specs keep their existing Tasks.
- Card [DQC-003V: "How should board migration handle existing record statuses?"](../../landmark-tracker/destination-questions/DQC-003V.json), revision 5:
  the migration uses each Spec's status as found. There is no mass re-statusing
  sweep; a Spec is put in the right place the next time it is used.

**Lane derivation and pickup.**

- Card [DQC-000G: "What does next mean, and which work should it offer?"](../../landmark-tracker/destination-questions/DQC-000G.json), revision 6,
  and card [DQC-003O: "How should lane derivation stay consistent across render, pickup and diagnostics?"](../../landmark-tracker/destination-questions/DQC-003O.json), revision 5,
  carry the same settled answer: one shared lane function serves render, `next`
  and `doctor`. `next` offers only To do cards; cards with unfinished
  dependencies stay visible but are not offered; `next --review` lists Needs
  review. `doctor` never blocks on Needs review or Backlog, Blocked stays an
  attention finding, and a Spec's lane is derived from its Tasks, never set by
  hand.

**Review and evidence.**

- Card [DQC-003P: "What does Needs review mean without imposing independent review on every Task?"](../../landmark-tracker/destination-questions/DQC-003P.json), revision 8:
  Needs review is the independent QA and verify stage. Most Tasks go from In
  progress through Needs review to Complete; work that needs no independent
  review may go straight to Complete. Ordinary verification stays mandatory for
  every Task. The separate-context review is kept at the assembled Spec, and a
  failed review creates corrective Tasks under the still-open Spec, matching
  [Work passes two QA gates](../../docs/adr/000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md).
- Card [DQC-003Q: "What compact execution evidence should appear on an active Task card?"](../../landmark-tracker/destination-questions/DQC-003Q.json), revision 5:
  run receipt rows live in the Task record. The board shows only a generated
  signal per active Task: the run count and the latest run's branch, short SHA
  and dirty-file count, never the full run table.

**Complete, cleanup and the owner's report.**

- Card [DQC-003R: "How should Complete distinguish capture from final cleanup?"](../../landmark-tracker/destination-questions/DQC-003R.json), revision 8:
  Complete holds work until it is captured and cleaned up, and the sub-state is
  derived, never authored on the board: a complete record in a live folder is
  ready to capture, one in the retired folder is captured and ready to delete,
  and a deleted record drops its card. A completed Task is retired once its
  results are reconciled into its Spec, with its branch and worktree deleted
  after verified containment, per
  [Record lifecycle is expressed by folder location](../../docs/adr/000I-record-lifecycle-is-expressed-by-folder-location-with-permanent-archive-and-transient-retired.md).
- Card [DQC-003S: "What should sitrep tell the owner first?"](../../landmark-tracker/destination-questions/DQC-003S.json), revision 6:
  `sitrep` returns as a core skill reading the board. It leads with what needs
  the owner's review, then what the owner can unblock, then in progress, then
  to do, each in priority order and in plain language, titles before
  identifiers. It reports Complete as the two derived counts.
- Card [DQC-002Y: "How should missing host or Task capabilities become visible to the owner?"](../../landmark-tracker/destination-questions/DQC-002Y.json), revision 7:
  a missing capability is flagged by setting the Task to Blocked or Needs
  review so `sitrep` finds it. The owner delegated the mechanics: a fixed host
  floor (Node 18+, Python 3.9+, git, an authenticated `gh` with push rights,
  GitHub network) checked at session start, with every other capability
  optional and named by the Task.

**Where the Taskboard stops.**

- Card [DQC-006A: "How do the Tracker and the Taskboard divide alignment from delivery, and where does Frontier fit?"](../../landmark-tracker/destination-questions/DQC-006A.json), revision 8:
  two boards, not three. The Landmark Tracker monitors documentation and
  alignment; the Taskboard monitors implementation. Frontier keeps its
  ready-Task meaning, and the broader idea of evolving understanding is
  described explicitly rather than by redefining the term.

## Open and unresolved

- Corrective work after a failed review: the card [DQC-003P: "What does Needs review mean without imposing independent review on every Task?"](../../landmark-tracker/destination-questions/DQC-003P.json)
  still says a failed review creates corrective Tasks. The decision record
  ["A miss found by a check continues the same Task unless the fix rewrites it"](../../docs/ddr/000Y-a-miss-found-by-a-check-continues-the-same-task-unless-the-fix-rewrites-it.md)
  amends that wording: the same Task continues unless the fix rewrites it. The
  card is unchanged here; read the decision record as the current rule.
- Meaning of `next`: the card [DQC-000G: "What does next mean, and which work should it offer?"](../../landmark-tracker/destination-questions/DQC-000G.json)
  records an open question, whether `next` means the next eligible Task, the
  next action inside current work, or an owner recommendation. The working
  meaning comes from the agents file's Work Selection section; the card says
  that is the existing rule, not an owner ruling.
- Frontier wording: the card [DQC-006A: "How do the Tracker and the Taskboard divide alignment from delivery, and where does Frontier fit?"](../../landmark-tracker/destination-questions/DQC-006A.json)
  says the formal wording that reconciles the ready-Task sense with the broader
  sense is not owner-confirmed.
- Lexicon Backlog row: the card [DQC-003T: "What qualifies as a backlog item, and where should it live?"](../../landmark-tracker/destination-questions/DQC-003T.json)
  expects the Lexicon to define Backlog as a board term, marked there as an
  inference, not a confirmed claim.
- Card against card: the card [DQC-003K: "Which record authors work state, and what does the board project?"](../../landmark-tracker/destination-questions/DQC-003K.json)
  still records that completed work disappears so the board clears, while the
  cards on the board format and on Complete record that Complete holds work
  until capture and cleanup. The proposed decision record
  ["The Frontier is the active landscape and TASKBOARD renders it"](../../docs/adr/proposed/000E-the-frontier-is-the-active-landscape-and-taskboard-renders-it.md)
  says its immediate-removal claim is not an instruction, so the later answer
  is the one this page states above.
- Older vocabulary: the cards on the Frontier and on Spec and Task hierarchy
  still speak of Specs as Journeys and Tasks as Paths. The owner's later
  decision
  ["The workflow is eight verbs and each verb writes the plane its claims live on"](../../docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md)
  defines Journey as Implement, Check, QA and Submit, with Review after it
  (amended 2026-10-05), so that wording is historical.
- Delivery, not design: Inference from the repository as read on 2026-10-04.
  The root board is still the generated Markdown file, there is no
  `workbench/skills/sitrep/` skill, and the Spec for `sitrep`
  ([sitrep skill alignment (S-002O)](../../specs/S-002O-sitrep-skill-alignment/SPEC.md))
  is planned. The board Spec records source-qualified shared lane calculation
  and an opt-in preview as delivered stages, and records source review mode,
  minimal Backlog validation, the rollout and its whole-Spec acceptance as
  unfinished. Treat the JSON board, `sitrep` and the derived Complete counts as
  accepted design, not as installed behavior.

## Where the work lives

The delivering Spec is [Generated JSON Taskboard (S-01X)](../../specs/S-01X-generated-json-taskboard/SPEC.md);
it depends on [Uppercase Width-Four Workbench Artifact IDs (S-01W)](../../specs/S-01W-uppercase-width-four-workbench-artifact-ids/SPEC.md)
for the visible identifiers. The lane calculation lives in the
[Taskboard tool](../../tools/taskboard.mjs) and the
[Spec workbench tool](../../tools/spec-workbench.mjs). The proposed decision
record named above carries the Frontier model and is not yet accepted. Related
delivery:
[Task artifact decision](../../docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md),
[Retirement Lifecycle By Folder For Records (S-00I)](../../specs/S-00I-folder-lifecycle-for-records/SPEC.md),
[Spec QA Gate And Corrective-Task Return Path (S-00J)](../../specs/S-00J-spec-qa-gate-at-integration/SPEC.md),
[Ownership Map Root Control (S-00G)](../../specs/S-00G-ownership-map-root-control/SPEC.md)
and [Portable Workbench (S-00V)](../../specs/S-00V-portable-workbench/SPEC.md),
whose tools [host floor](../../tools/host-floor.mjs) and
[optional capabilities](../../tools/optional-capabilities.mjs) carry the
capability routing. The future shared browser board is
[Shared Interactive Workbench Board (S-004D)](../../specs/S-004D-shared-interactive-board/SPEC.md),
planned only.

## Related pages

- [The Landmark Tracker](landmark-tracker.md): the alignment view the Taskboard divides work with.
- [The Task Artifact And Its Lifecycle](task-artifact-and-lifecycle.md): the Task record the board projects.
- [The Three Altitudes Of Delivery](delivery-altitudes.md): why Blueprint, Spec and Task are scopes, not files.

## Evidence and Sources

- [Landmark record Taskboard (LMK-000Q)](../../landmark-tracker/landmarks/LMK-000Q.json): title, summary, importance and history.
- The fifteen question cards named above, each at the revision cited: they hold the answers, the confirmation basis, the open uncertainties and the expected results this page summarizes.
- [Glossary](../../../GLOSSARY.md) and [agent contract](../../../AGENTS.md): the Taskboard, Frontier and work-selection definitions the cards expect to land.

## History

- 2026-10-04: created by the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages), seeded from the cards' current answers.
- 2026-10-07: Re-pointed the retiring Lexicon's links and live routes to `GLOSSARY.md`, `ARCHITECTURE.md` and the Wiki lexicon articles (Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), consumer re-pointing Task (TK-009F)); no claim changed.

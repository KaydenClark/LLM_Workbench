# S-003Z - LANDMARK.md Artifact And Lane Runtime

**Spec ID:** S-003Z
**Status:** active
**Priority:** 2
**Owner:** claude-s003z-dispatcher
**Stance:** Builder
**Updated:** 2026-10-06
**Catalog description:** Deliver LANDMARK.md as an artifact one size above a Spec, with Specs and Tasks nested beneath it, a lane rather than a branch, and review and retirement one size up.
**Blockers:** none. The prefix and the DDR listing are settled (2026-10-05); this Spec goes first in the Director's lane order.
**Latest event:** TK-008I claimed by claude-s003z-dispatcher.
**Next gate:** Close TK-008I with verification and documentation proof.

> **Citation anchors.** pre=`5f3df1f99c04b4b75f1dc5ff585f9377ea2ff61a` post=`5f3df1f99c04b4b75f1dc5ff585f9377ea2ff61a`.

## Outcome

A room can author an assigned `LANDMARK.md` that gives a direction toward the destination and says what success looks like, nest Specs and Tasks beneath it so one path carries every parent, review it one size above a Spec, and retire it into its Landmark Wiki page when its destination is reached. The owner named the gap this fills "specs for specs".

## Why It Matters

Specs scope a capability, but nothing yet scopes a direction made of several Specs, so Specs overlap, decisions have no direction to sit under, and a Director has no lane to own. The owner confirmed the landmark as the artifact one size above a Spec and promoted it as Canon with the statement that it performs no delivery. Until the runtime exists the destination is only words in the Lexicon and the decision records.

## Current Verified State

At the pre anchor:

- A landmark is a flat JSON record, one of 24 JSON records in `workbench/landmark-tracker/landmarks/`, declared by the manifest's `landmarkTracker.collections.landmarks`. There is no `workbench/landmarks/` collection and no `LANDMARK.md` template.
- `workbench/tools/spec-workbench.mjs` expects a Spec at `workbench/specs/S-###-slug/` (or under its `retired/` lifecycle folder) and reports `unstable-path` for any other location, so a Spec nested inside a landmark folder is refused today.
- `move-spec` moves only an active-roster Spec at the top level of the specs lane, and its closed set of lifecycle folders is `retired`. There is no move into a landmark.
- `report`, `verdict`, `gate`, `approve` and `complete` operate on Specs. There is no landmark review, verify or retire command.
- The Instruction Authority list in `AGENTS.md` names the assigned Spec as the bounded delegate and does not name a landmark.
- Landmark Wiki pages and the Tracker's per-landmark grouping read the JSON records, which the accepted decision leaves in place until the landmark work lands.

No implementation or agent-outcome proof for this capability is claimed by this Map record.

## Desired Behavior

1. `LANDMARK.md` is a destination-facing architecture artifact with a visible identifier and the full artifact treatment a `SPEC.md` has. It is PRD-shaped like a Spec, only larger: the direction toward the destination, what success looks like as a reached check, its decisions, and its child Specs and Tasks. Landmarks and Specs give the direction; Tasks are the steps taken in it.
2. Landmarks live in a manifest collection at `workbench/landmarks/`. Spec folders nest inside their landmark's folder as Task folders nest inside a Spec's, and a landmark's direct Tasks nest in the landmark folder. A Spec has at most one parent landmark. A Spec with no landmark keeps its home in `workbench/specs/`.
3. A Spec gains a landmark by the link-safe move operation, which rewrites every live reference and counts historical ones. The Spec tools, ID allocation, diagnostics, rendering and the citation-anchor check all resolve a Spec at either home.
4. Tasks may sit directly under a landmark and keep their own pull-request review.
5. A landmark is a lane, not a branch. Each child Spec merges into integration as soon as its own review passes, so integration stays current. A whole-landmark review checks what has landed on integration against the landmark's destination and what success looks like, relying on its child Specs' reviews for their contents.
6. The landmark's review is one size above a Spec's: the whole-landmark check, then a separate Director review from a context with no part in that landmark, then the owner's approval. A failed review produces corrective Tasks as a failed Spec review does, and does not block a merge.
7. A landmark cannot be verified or retire while a child Spec or Task is open. Moving a child to another parent stays possible through the move operation.
8. An assigned `LANDMARK.md` is a bounded instruction delegate like an assigned Spec: a Task under it can be executed, and it cannot enlarge the request, platform safety or the Contract.
9. A reached `LANDMARK.md` retires into its Landmark Wiki page as a Spec retires into its feature article. `LANDMARK.md` is the raw source of that page and is not the page.
10. The Destination Packet is links only, on the Destination Question Card or the Task, reaching the Blueprint, the landmark, the Spec, the Task, a handoff and perhaps a notepad. There is no second record that tells the agent the destination.

## Decisions And Contracts

- Landmarks are `LANDMARK.md` artifacts one size above Specs, a lane and not a branch, nested in folders, with one parent per Spec and one landmark per DDR. See [Landmarks are LANDMARK.md artifacts one size above Specs](../../docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md), which narrows the delivery chain, the Landmark Tracker decision and the Task Packet decision.
- The landmark JSON record is retired. Its migration into Destination Question Cards and the Tracker's change of grouping source belong to [Landmark Record Migration And Tracker Regrouping](../S-004A-landmark-record-migration-and-tracker-regrouping/SPEC.md), not here.
- The separate landmark review comes from a Director context with no part in that landmark; prior involvement already rules a participant out of independent review.
- The landmark's Director job and the Captain are owned by [Captain Role And Landmark Director](../S-004B-captain-role-and-landmark-director/SPEC.md); this Spec delivers the artifact and commands those roles use.
- The change to the Instruction Authority list that makes an assigned landmark a delegate is carried by the [Contract carrier rewrite](../S-004C-contract-carrier-pointer-brief-rewrite/SPEC.md), which owns that list. Until it lands the current `AGENTS.md` text governs; this Spec must not execute a Task under an unassigned landmark.
- Landmarks never carry authority from a projection or a link; an Issue, board or tracker view never instructs.

Settled on 2026-10-05, with the sequencing the owner confirmed ([The twelve harness-engineering directions are landmarks](../../docs/ddr/001H-the-twelve-harness-engineering-directions-are-landmarks.md)):

- The visible-identifier prefix stays `LMK-`: the runtime already allocates it and the migrating records keep their identities.
- A landmark lists the decision records under it as a linked section, the way a Spec lists its decisions; [Decision Record Tooling](../S-003X-decision-record-tooling/SPEC.md) reads that section when it renders a register by landmark.
- This Spec goes first. Its first proof is the twelve landmarks the owner named: Repo is the System of Record, Progressive Disclosure, Durable Plans, Agent to Agent Review, Mechanical Enforcement, Learn from Failure, Agent Visible Runtime, Continuous Cleanup, Human Attention Minimized, Multi Agent and Provider Coordination, Owner Idea Alignment, and Autonomous Execution. Each has a Destination Question Card captured at Confirm (DQC-006P to DQC-007A). The 24 existing JSON records fold into these where they overlap; [Landmark Record Migration And Tracker Regrouping](../S-004A-landmark-record-migration-and-tracker-regrouping/SPEC.md) carries the migration and reads this Spec's result.
- Review one size up now carries the owner's Human QA: [Review climbs the ladder](../../docs/ddr/001B-review-climbs-the-ladder-task-by-automated-proof-spec-by-agent-review-landmark-by-integrated-automated-review-and-the-owner-judges-the-concept.md). This Spec delivers the review rung; moving the owner's gate onto it is [Review Ladder And Landmark Human QA](../S-004N-review-ladder-and-landmark-human-qa/SPEC.md).

Decided at Plan (2026-10-05, Dispatcher, within the Director's dispatch authority):

- The capability stays one Spec. Every slice (collection and validator, nested resolution, the move, direct Tasks, the review rung, retirement, the mirror) changes the same shared writer, `workbench/tools/spec-workbench.mjs`, against one fixture-room seam; splitting it would create three Specs waiting on one writer lane without a boundary any of them could own, and the accepted decision names "a landmark Spec" in the singular. The twelve-landmark authoring touches only `workbench/landmarks/` and runs as a disjoint-file Task inside this Spec.
- A landmark-direct Task is offered by `next` only while its landmark is `active` and has an owner other than `unassigned`: the Contract's current Instruction Authority names only an assigned Spec, so this Spec's runtime refuses to execute under an unassigned landmark rather than enlarging that list; the list change itself stays with the Contract carrier rewrite.
- Landmark statuses are `planned`, `active` and `reached`; the lifecycle folder, not a status, says it is retired, as a Spec's does. A landmark folder holds `LANDMARK.md`, `specs/` for its child Specs (with `specs/retired/`) and `tasks/` for its direct Tasks (with `tasks/retired/`), so the landmark, Spec and Task path carries every parent.
- "Updating a room with no landmarks leaves it unchanged" is read as: the update appends the `landmarks` collection declaration and its empty folder and changes nothing else in that room (no Spec, Task, projection or seeded document byte changes).

## Non-Goals

Migrating the 24 JSON records or regrouping the Tracker, the Captain and Director skills, the Contract rewrite, taking the Blueprint apart, a landmark branch, multiple parent landmarks, GitHub coordination of landmarks, owner Human QA or main promotion, implementing another capability.

## Dependencies And Blockers

- [Landmark Records](../S-002A-landmark-records/SPEC.md), [Landmark Tracker View](../S-001Z-landmark-tracker-view/SPEC.md) and [Destination Question Cards](../S-002B-destination-question-cards/SPEC.md) are at their owner gates and own the current JSON record, Tracker and card seams. Their lane owns `workbench/tools/landmark-tracker.mjs`; this Spec reads those seams and does not rewrite them until they land.
- [Folder Lifecycle For Records](../S-00I-folder-lifecycle-for-records/SPEC.md) and [Spec QA Gate At Integration](../S-00J-spec-qa-gate-at-integration/SPEC.md) own the lifecycle moves and the review gate this Spec extends one size up; consume their delivered seams rather than their closure.
- `workbench/tools/spec-workbench.mjs` is a shared writer: single writer lane per file, coordinated with [Workflow Canon Rework](../S-00P-workflow-canon-rework/SPEC.md). At Plan (integration 35187ee6) its last integration commit was c933c656 (2026-10-03) and no open PR touched it; `workbench/manifest.json` (a861653e), `workbench/tools/workbench-layout.mjs` (39814a43), `workbench/tools/workbench-paths.mjs` (2f06daaf) and `templates/SPEC.md` (f4dae2d8) were likewise unheld. `AGENTS.md`, `RUNBOOK.md` and `LEXICON.md` last moved on 2026-10-05 (80e790f9, 008fa9b7) and open PR #358 (S-004C TK-005N) touches the Lexicon; this Spec's Lexicon and Runbook edits wait for TK-008J and re-check those files before editing. The Dispatcher is the single writer for this Spec's SPEC.md, Task records and projections; one Worker at a time holds `spec-workbench.mjs`.
- The [release owner](../S-00O-workbench-v4-0-0-release/SPEC.md) retains version, Template and owner gates; changed managed bytes need the normal bundle, version and install proof at implementation time.

## Vertical Implementation Slices

Cut at Plan on 2026-10-05 from live Actuality at integration 35187ee6 (the Spec-tool path rules, `moveSpecDirectory`, `retireSpec`, `gate`, `assembleSpecReport`, `parseTaskRecord`, the manifest collection and migrate routes, `RUNTIME_TOOLS`, the 24 JSON landmark records and the twelve Destination Question Cards were read at that tip). Each Task is a `tasks/TK-###/TASK.md` record; identifiers were allocated after the highest Task identifier on every fetched remote tip (TK-008C), because the local `next-id` proposal (TK-006U) did not see sibling lanes' allocations.

| Group | Tasks | Runs | Shared-file writer |
|---|---|---|---|
| 1 | TK-008D (collection, template, validator, `LMK` allocation) | first, alone | one Worker holds `spec-workbench.mjs`, `workbench-paths.mjs`, `workbench-layout.mjs`, `workbench/manifest.json`, `templates/LANDMARK.md` |
| 2 | TK-008E (nested Spec at both homes), TK-008G (landmark-direct Task) | after group 1; E then G, serialized on the Spec-tool writer | one Worker at a time holds `spec-workbench.mjs` and `task-record.mjs` |
| 3 | TK-008F (link-safe move), TK-008H (review rung) | after group 2; F then H, serialized on the Spec-tool writer | one Worker at a time holds `spec-workbench.mjs` and `spec-report.mjs` |
| 3 (parallel) | TK-008K (the twelve landmarks) | concurrently with group 3 once TK-008D and TK-008E are merged; touches only `workbench/landmarks/` | the authoring Worker |
| 4 | TK-008I (retire into the Landmark Wiki page) | after TK-008H | one Worker holds `spec-workbench.mjs` |
| 5 | TK-008J (templates mirror, docs, update proof) | last | one Worker holds `RUNBOOK.md`, `LEXICON.md`, `templates/`, the Wiki pages it names; re-checks the Lexicon against PR #358 before editing |

Open gates: owner Human QA of the delivered Spec stays the owner's act; the Instruction Authority clause that names an assigned landmark belongs to the Contract carrier rewrite; the migration of the JSON records belongs to the migration Spec.

## Acceptance Criteria

- [ ] A `LANDMARK.md` can be authored from the template, validated, and assigned in a fixture room, and a Task under the assigned landmark can be selected and claimed.
- [ ] A Spec nested in its landmark's folder is found, claimed, closed, reported, gated and retired by the Spec tools, and `unstable-path` no longer reports it.
- [ ] Moving a Spec into a landmark through the link-safe operation rewrites every live reference and counts the historical ones; moving it out or to another parent also works.
- [ ] A landmark with an open child Spec or Task cannot be verified or retire; a failed whole-landmark review creates corrective Tasks and does not block a child Spec's merge.
- [ ] The separate landmark review is refused from a context that took part in that landmark.
- [ ] A reached landmark retires into its Landmark Wiki page with `LANDMARK.md` as its recorded source.
- [ ] Source behavior, the generic templates, discovery and managed installation agree, and updating a room with no landmarks leaves it unchanged.
- [ ] Named verification and remaining limitations are recorded without claiming owner approval.

## Testing Seams

The Spec tools' public commands (`next`, `claim`, `show`, `report`, `verdict`, `gate`, `close`, `move-spec`, `retire-spec`, `render`, `doctor`) against a fixture room with one landmark, a nested Spec, a Blueprint-level Spec and a landmark-direct Task. Red/green cases cover path resolution at both homes, the move with its reference rewrite, each review refusal, and update of a room without landmarks. Use receipt-backed installed commands for the managed route; string checks support discovery but do not prove behavior.

## Verification Procedure

Run the targeted Spec-tool and layout tests and the full AGENTS suite for the delivered change, then `render` and `doctor`. Pin the candidate before source-identity checks. Capture the guardrail baseline before and after, and Workbench self-drift pre and post receipts with the bounded semantic check. Obtain separate-context review of the immutable candidate before integration, and keep owner Human QA separate. This Map record claims none of that proof.

## Documentation Impact

Maintain the Lexicon Landmark and Map rows if delivery changes them, the Runbook commands, and the routed Wiki articles for the artifact and the Tracker; mirror changed portable rules in `templates/`. The accepted decision records are history. The Landmark Wiki page for a retired landmark is written at retirement, not here.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-02 | none | Authored at the Map step from the owner-confirmed landmark decision records of 2026-10-02 at integration cbb3d5b81c0081c45d92e0d284078ca13fd54c03. | Map only; the Spec-tool path rules were read, no runtime proof claimed. | This Spec. | Plan, implementation and proof remain; the landmark prefix and DDR listing are open. |
| 2026-10-02 | none | Re-verified and re-anchored at integration 5f3df1f99c04b4b75f1dc5ff585f9377ea2ff61a after four PRs landed. | Map only; the asserted counts, tool commands, collections and the S-00M status were re-read at that tip; no runtime proof claimed. | This Spec. | Plan, implementation and proof remain. |
| 2026-10-05 | none | Owner decisions of 2026-10-05: twelve directions become landmarks and this artifact goes first; prefix and DDR listing settled; twelve DQCs captured; the Director queued this Spec for dispatch. | Map only; no runtime proof claimed. | This Spec, DDR-001H, DQC-006P to DQC-007A. | Plan, implementation, the twelve landmarks and proof remain. |
| 2026-10-05 | none | Plan launched by the Dispatcher (claude-s003z-dispatcher) on branch claude/s003z-dispatcher from integration 35187ee6: one Spec, eight Task records TK-008D to TK-008K, Spec activated with convert-tasks --activate. | Actuality inspected at 35187ee6 as the slices section names; doctor no blocking finding; render clean; guardrail baseline 73/100 (recommendations: outcome evidence and a fresh dated evidence row); self-drift pre receipt: 11 findings, 5 blocks-clean-update, all pre-existing stale claims on S-003W, S-00Q, S-01H, S-01P and S-01S and stale v3.1.4 seeds, none from this Spec. | This Spec. | Every Task remains; implementation and proof not claimed. |
| 2026-10-06 | TK-008D | Task closed | PR #375 merged into integration at 26a969cbe11d94ca054b4ad6f0eda2a75bd75ec8 (merge of candidate 92cfb0e46c9d1ab792c16444476291eb5f4958df, base 4bdf2b0f); full Runbook suite 51/51 on 92cfb0e4 (DONE total=51 fail=0); targeted red at 932226c6 then green: test-spec-workbench 59/0, test-workbench-layout 74/0, test-diagnostics 36/0; render clean; doctor no blocking finding; check-append-only CLEAN; gate --task TK-008D --spec S-003Z Task-PR form not refused | templates/LANDMARK.md added; workbench/manifest.json migrated; Runbook, Lexicon and Wiki updates are routed to TK-008J by the Spec's slice plan | none for this Task; out-of-lane diagnostics.mjs registration of malformed-landmark reported in PR #375 |
| 2026-10-06 | TK-008G | Task closed | PR #376 merged into integration at 45ef0585b5fbbab7203e3415d740aab2333055d1 (merge of candidate fa8a2b545c64e14d3e272fa035d97d8646d81ad2, base 26a969cb); red at 77d30e2c (parseTaskRecord refused a Landmark ID record; landmark Task invisible to the preview); full Runbook suite 51/51 on fa8a2b54 (DONE total=51 fail=0); test-task-record 3/3, test-spec-workbench 60 pass 0 fail, test-taskboard-json 60/0, test-diagnostics and test-visible-id-consumers green; render unchanged; doctor no blocking finding; check-append-only CLEAN; merge-tree no conflict | Docs checked; no update needed in this Task: the Runbook, Lexicon, Wiki and templates mirror of landmark-direct Task commands are routed to TK-008J by the Spec's slice plan | task-packet.mjs does not resolve a Packet for a landmark-direct Task (outside this Task's verification); tools/test-task-record.mjs to join the Runbook suite list in TK-008J |
| 2026-10-06 | TK-008E | Task closed | PR #377 merged into integration at a06cb4ef22a4901c80d5a4a6e5879a2b58feecec (merge of candidate b950694bf505e661cd8b3979e4f2d3e3bbca1c01, base 45ef0585); red at 2dc68240 (nested Spec absent from CATALOG, report Unknown spec ID, ADR link not repaired, promotion refused, no specHomes export); full Runbook suite 51/51 on b950694b (DONE total=51 fail=0); test-spec-workbench 60/60 plus inline blocks, test-spec-report exit 0, test-adr 57/57, test-sessions 9/9, test-spec-citation-anchors 16/16; render no diff; doctor no blocking finding; check-append-only CLEAN | Docs checked; no update needed in this Task: the two Spec homes, nested retirement and relative CATALOG links are routed to TK-008J by the Spec's slice plan | Walkers outside this Task's lane still read only workbench/specs: wiki.mjs moveNoteReferenceFiles (non-SPEC/TASK Markdown in a nested Spec folder), landmark-tracker.mjs roomIndex, self-drift.mjs inventory; unverified: remote claim publishing of a nested Spec, collision-recovery move-task on a remote nested Spec, discard of a retired nested Spec |
| 2026-10-06 | TK-008F | Task closed | PR #378 merged into integration at 06e8fb8498aa6d309f7f3e180b2d43d099bebfb8 (merge of candidate ee5b72ab6b687e0c7a6862e46cb0da9f97432424, base a06cb4ef); red at 0a578844 (--landmark unrecognised, moveSpecToLandmark not a function); full Runbook suite 51/51 on ee5b72ab (DONE total=51 fail=0); test-spec-workbench 60/60 plus 69 inline blocks, test-lifecycle-directory-links spec/task/landmark ok, test-diagnostics 36/36; render no diff; doctor no blocking finding; check-append-only CLEAN | Docs checked; no update needed in this Task: move-spec --landmark forms, refusals, result fields and the planner fix are routed to TK-008J by the Spec's slice plan | A move does not edit the destination LANDMARK.md child-Spec list; a move out leaves an untracked empty specs/ folder; wiki.mjs note moves still do not walk landmark Spec homes |
| 2026-10-06 | TK-008H | Task closed | PR #379 merged into integration at 662b198924a4a7ebebacba99ed4582b172fee290 (merge of candidate 537f0fd7bd70d88a0a3ed76001ab1c8475861aa1, base 06e8fb84); red at 43c3b240 (Unknown spec ID: LMK-0BA / LMK-0CA); full Runbook suite run twice on 537f0fd7: each run 50/51 with a different environmental temp-directory race in an untouched pre-existing test (run 1 test-spec-workbench closure-capture git clone copy failure after 60/60 pass; run 2 test-workbench-layout ENOTEMPTY rmSync), every command passed in at least one run on the same candidate and each failing command passed on isolated rerun (test-spec-workbench 60/0 exit 0, test-workbench-layout 74/0); test-spec-report exit 0; render no diff; doctor no blocking finding; check-append-only CLEAN | Docs checked; no update needed in this Task: report/verify/verdict LMK-###, the digest rule, participation refusal, corrective Tasks and the reached transition are routed to TK-008J by the Spec's slice plan | check-append-only.py does not scan LANDMARK.md evidence logs; corrective Tasks are not added to LANDMARK.md's Direct Tasks list; participation reads current fields, evidence and Receipt rows, not Git-history-only claims; a pass reaches the landmark only with every reached check ticked (Dispatcher-accepted reading); suite temp-directory flakes observed twice |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

Migration of the JSON records and the Tracker regrouping, the role skills and the Contract rewrite are separate Specs. Until this capability lands, the Tracker's per-landmark grouping and the Landmark Wiki pages keep their JSON source.

## Supersession

- Supersedes: none
- Superseded by: none

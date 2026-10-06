# S-003Z - LANDMARK.md Artifact And Lane Runtime

**Spec ID:** S-003Z
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-10-05
**Catalog description:** Deliver LANDMARK.md as an artifact one size above a Spec, with Specs and Tasks nested beneath it, a lane rather than a branch, and review and retirement one size up.
**Blockers:** none. The prefix and the DDR listing are settled (2026-10-05); this Spec goes first in the Director's lane order and awaits Plan and assignment.
**Latest event:** 2026-10-05: the owner made twelve harness-engineering directions landmarks and put this artifact first; the `LMK-` prefix stays and a landmark lists its decision records as a linked section; no Task is cut.
**Next gate:** Dispatch: at Plan, inspect live Actuality, decide whether this capability is one Spec or splits further, cut small Tasks, and author the twelve landmarks as the artifact's first proof.

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

Open, not decided here:

- Whether the whole capability is one Spec or splits at Plan; the accepted decision names "a landmark Spec" in the singular.

## Non-Goals

Migrating the 24 JSON records or regrouping the Tracker, the Captain and Director skills, the Contract rewrite, taking the Blueprint apart, a landmark branch, multiple parent landmarks, GitHub coordination of landmarks, owner Human QA or main promotion, implementing another capability.

## Dependencies And Blockers

- [Landmark Records](../S-002A-landmark-records/SPEC.md), [Landmark Tracker View](../S-001Z-landmark-tracker-view/SPEC.md) and [Destination Question Cards](../S-002B-destination-question-cards/SPEC.md) are at their owner gates and own the current JSON record, Tracker and card seams. Their lane owns `workbench/tools/landmark-tracker.mjs`; this Spec reads those seams and does not rewrite them until they land.
- [Folder Lifecycle For Records](../S-00I-folder-lifecycle-for-records/SPEC.md) and [Spec QA Gate At Integration](../S-00J-spec-qa-gate-at-integration/SPEC.md) own the lifecycle moves and the review gate this Spec extends one size up; consume their delivered seams rather than their closure.
- `workbench/tools/spec-workbench.mjs` is a shared writer: single writer lane per file, coordinated with [Workflow Canon Rework](../S-00P-workflow-canon-rework/SPEC.md).
- The [release owner](../S-00O-workbench-v4-0-0-release/SPEC.md) retains version, Template and owner gates; changed managed bytes need the normal bundle, version and install proof at implementation time.

## Vertical Implementation Slices

No Tasks cut. At Plan, use current Actuality to cut small complete-path slices and safe parallel groups, and decide whether the nesting seam in the Spec tools, the review commands and the artifact template are separate Specs. The empty tasks directory keeps this planned capability record-backed.

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

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

Migration of the JSON records and the Tracker regrouping, the role skills and the Contract rewrite are separate Specs. Until this capability lands, the Tracker's per-landmark grouping and the Landmark Wiki pages keep their JSON source.

## Supersession

- Supersedes: none
- Superseded by: none

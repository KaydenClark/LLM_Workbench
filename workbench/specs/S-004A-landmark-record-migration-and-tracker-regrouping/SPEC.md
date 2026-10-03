# S-004A - Landmark Record Migration And Tracker Regrouping

**Spec ID:** S-004A
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-10-02
**Catalog description:** Transform the 24 landmark JSON records into Destination Question Cards and move the Tracker's per-landmark grouping to LANDMARK.md, without losing any card's identity, origin, correction or lineage.
**Blockers:** Waits on the LANDMARK.md runtime and on the Tracker lane's owner gates; how a migrated record keeps its grouping role is open. Implementation awaits Plan and assignment.
**Latest event:** Authored at the Map step from the owner-confirmed landmark decision records of 2026-10-02; no Task is cut.
**Next gate:** At Plan, after the artifact runtime and the Tracker lane's seams are verified, inspect live Actuality and cut small Tasks.

> **Citation anchors.** pre=`5f3df1f99c04b4b75f1dc5ff585f9377ea2ff61a` post=`5f3df1f99c04b4b75f1dc5ff585f9377ea2ff61a`.

## Outcome

The 24 existing landmark JSON records no longer exist as a separate record type. Each is transformed into a Destination Question Card, because the landmark record was the way cards were nested, and the Tracker groups by `LANDMARK.md` artifacts instead of the JSON records. No question's identity, origin, correction, uncertainty or lineage is lost in the move, and the generated Tracker and the Landmark Wiki pages keep working throughout.

## Why It Matters

The owner retired the landmark JSON record: with the Destination Decision Record and the reworked Wiki it is extra, and `LANDMARK.md` is the landmark. The accepted decision says the existing records are transformed into cards and leaves the Tracker's per-landmark grouping and the Landmark Wiki pages on their current JSON source until that work lands. Leaving both record types in place keeps two sources for one idea and keeps the Tracker reading the one the owner retired.

## Current Verified State

At the pre anchor:

- There are 24 landmark records in `workbench/landmark-tracker/landmarks/`, each with schema `landmark-tracker/landmark@1` and the fields `id` (for example `LMK-000A`), `revision`, `title`, `summary`, `importance`, `origin` and `history`.
- Membership is carried by the cards, not the landmark record: each Destination Question Card in `workbench/landmark-tracker/destination-questions/` names its landmarks in a `landmarks` field. The generated `TRACKER.json` holds 24 landmarks, 171 question records (the cards) and 444 items.
- `workbench/tools/landmark-tracker.mjs` owns the card and landmark operations and the generated Tracker; `workbench/tools/landmark-wiki.mjs` validates a readable Landmark Wiki article. The manifest declares both collections under `landmarkTracker`.
- There is no `LANDMARK.md` artifact yet; it is the subject of [LANDMARK.md Artifact And Lane Runtime](../S-003Z-landmark-md-artifact-and-lane-runtime/SPEC.md).
- [Landmark Records](../S-002A-landmark-records/SPEC.md), [Landmark Tracker View](../S-001Z-landmark-tracker-view/SPEC.md) and [Destination Question Cards](../S-002B-destination-question-cards/SPEC.md) own the current seams and are at their owner gates.

No implementation or agent-outcome proof for this capability is claimed by this Map record.

## Desired Behavior

1. Each of the 24 landmark records becomes a Destination Question Card. The transformation preserves the record's identifier lineage, `title`, `summary`, `importance`, origin and history, so the original is recoverable and nothing is overwritten in place.
2. Every one of the 171 existing cards keeps its association to the landmark it named, so no card loses its grouping through the move, and the check proves it.
3. The Tracker groups by `LANDMARK.md` artifacts and by the decisions and cards under them. It does not need the JSON landmark collection once the move is complete, and the generated Tracker stays valid at every committed step.
4. The Landmark Wiki pages keep their content and validity; a page's source changes from the JSON record to its card or `LANDMARK.md` without a broken link.
5. The migration is reversible until verified: it runs from an inventory, records what it did, and is checked by a read-back that compares every card, field and link before and after.
6. After verification the JSON landmark collection is retired through the lifecycle operations, not deleted by hand, and the manifest declaration, the generic templates and the update route no longer promise it.
7. Corrections stay append-only. The move adds a record of itself and never edits an earlier history entry.

## Decisions And Contracts

- The 24 existing landmark JSON records are transformed into Destination Question Cards because they were the way of nesting cards; `LANDMARK.md` artifacts are then created as groupings form in the cards and the Destination Decision Records. Cards remain the JSON working records. See [Landmarks are LANDMARK.md artifacts one size above Specs](../../docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md), which narrows the Landmark Tracker decision for the flat JSON `landmarks/` records only.
- Cards, the generated Tracker and Landmark Wiki pages keep their jobs; only the landmark record and the grouping source change.
- A card's Expected result, Result, uncertainty and confirmation stay independent, and confirmation never grants execution or promotion authority.
- Notes and cards are Canon-neutral working records: this Spec promotes nothing by moving them.

Open, not decided here:

- How a transformed record keeps its grouping role between the move and the creation of the `LANDMARK.md` that replaces it, and what a card's `landmarks` field points at in that interval. The accepted decision fixes the transformation and the destination but not the interval.
- What happens to a landmark's `importance` and the Tracker's computed aggregates, which the `LANDMARK.md` shape does not carry as such.
- Whether the Tracker's step names change in this work or in separate Tracker work. The accepted [workflow verbs decision](../../docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md) makes the workflow verbs the documentation steps and records that the Tracker's step list, tests, stored cards and Wiki page keep the earlier names until the Tracker work changes them; that is an implementation gap, not part of the landmark move.

## Non-Goals

Authoring the `LANDMARK.md` artifact or its runtime, creating `LANDMARK.md` artifacts for the new groupings, answering any open card, the Captain and Director skills, the Contract rewrite, changing a card's schema beyond what the grouping needs, discarding the originals before verification, implementing another capability.

## Dependencies And Blockers

- [LANDMARK.md Artifact And Lane Runtime](../S-003Z-landmark-md-artifact-and-lane-runtime/SPEC.md) must deliver the artifact and its collection before the Tracker can regroup by it; consume its delivered seam rather than its closure.
- The Tracker lane, [Landmark Tracker View](../S-001Z-landmark-tracker-view/SPEC.md), [Landmark Records](../S-002A-landmark-records/SPEC.md) and [Destination Question Cards](../S-002B-destination-question-cards/SPEC.md), is at its owner gates and owns `workbench/tools/landmark-tracker.mjs`. A separate lane maintains that group; this Spec waits for those seams to land and uses one writer for the file.
- The [Landmark Tracker Foundation](../S-01T-landmark-tracker-foundation/SPEC.md) design and the Landmark Tracker article remain the explanation to reconcile.
- Coordinate with [Folder Lifecycle For Records](../S-00I-folder-lifecycle-for-records/SPEC.md) for the retirement of the JSON collection.

## Vertical Implementation Slices

No Tasks cut. At Plan, use current Actuality to cut small complete-path slices; a first slice is likely a read-only inventory and read-back check over the 24 records and 171 cards before any record changes. The empty tasks directory keeps this planned capability record-backed.

## Acceptance Criteria

- [ ] An inventory names all 24 landmark records and all 171 cards, and a read-back after the move shows every card, field and landmark association intact or recorded as deliberately changed with its reason.
- [ ] No original identifier, origin, correction or history entry is lost or edited; the move is a new, attributable record.
- [ ] The generated Tracker validates at every committed step and, after the move, groups without reading the JSON landmark collection.
- [ ] Every Landmark Wiki page still validates and resolves its links.
- [ ] The retired JSON collection is moved through the lifecycle operation, and the manifest, templates and update route agree.
- [ ] Named verification and remaining limitations are recorded without claiming owner approval.

## Testing Seams

The card and Tracker public operations against a copy of the real records and a small fixture room: inventory, transformation, read-back comparison, Tracker generation before and during and after, and Wiki validation. Red/green cases cover a card with several landmarks, a landmark with no cards, and a rerun that must not duplicate. Use a copy of the actual records for the proof, not only a synthetic fixture.

## Verification Procedure

Run the targeted Tracker, card and Wiki tests and the full AGENTS suite, then `render` and `doctor`. Pin the candidate before source-identity checks. Capture the guardrail baseline and the Workbench self-drift pre and post receipts with the bounded semantic check. Obtain separate-context review of the immutable candidate before integration, and keep owner Human QA separate. This Map record claims none of that proof.

## Documentation Impact

Update the Landmark Tracker article and the Landmark Wiki guidance, the Runbook commands and the generic templates to the delivered shape. Reconcile the Tracker foundation Spec's description through its owner rather than rewriting it. The accepted decision is history.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-02 | none | Authored at the Map step from the owner-confirmed landmark decision records of 2026-10-02 at integration cbb3d5b81c0081c45d92e0d284078ca13fd54c03. | Map only; the record counts and shapes were read, no runtime proof claimed. | This Spec. | Plan, implementation and proof remain; the interval grouping role and `importance` are open. |
| 2026-10-02 | none | Re-verified and re-anchored at integration 5f3df1f99c04b4b75f1dc5ff585f9377ea2ff61a after four PRs landed. | Map only; the asserted counts, tool commands, collections and the S-00M status were re-read at that tip; no runtime proof claimed. | This Spec. | Plan, implementation and proof remain. |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

Creating `LANDMARK.md` artifacts for the groupings that form is ordinary work under the artifact Spec, not a follow-up of this one. A Tracker step-name change to the workflow verbs is an implementation gap owned by the Tracker work, not by this Spec unless Plan includes it.

## Supersession

- Supersedes: none
- Superseded by: none

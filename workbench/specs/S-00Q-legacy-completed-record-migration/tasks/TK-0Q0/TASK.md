# TK-0Q0 - Freeze the legacy inventory and record the owner QA rule

**Task ID:** TK-0Q0
**Spec ID:** S-00Q
**Slice:** Freeze the legacy inventory and record the owner QA rule
**Status:** in-progress
**Blockers:** none
**Next gate:** Explicit legacy retirement QA rule and current-consumer reconciliation remain open.
**Destination:** spec-acceptance: S-00Q Acceptance Criteria lines 1-2
**Stance:** Reconciler
**Planned verification:** Red: a generated inventory or owner-gate check reports any missing/extra completed path, unclassified claim group, unresolved destination, or missing concrete batch-review route; green: exactly the 50 baseline paths are covered, active/blocked records are excluded, and the owner's chosen migration approval rule and exception handling are readable without claiming retrospective S-00J compliance.

## Delivery

Re-read all 50 records at their immutable anchors and freeze a machine-readable
plus readable migration matrix. Apply the recorded owner direction: exactly one Wiki article per legacy Spec,
with batches used only for execution and review; prepare concrete digests for review. Do not infer approval from old evidence, status,
silence or current green tests. If the owner changes the 50-record scope, record
the changed inventory and reason before any batch proceeds.

## Preservation And Rollback

This Task is read-only apart from S-00Q planning/evidence and the inventory
artifact it owns. Preserve source bytes and append-only rows. Roll back by
dropping only this Task's new planning artifact; no lifecycle state changes.

## Done Criteria

- Every source path and claim group has a classification and proposed owner.
- The owner gate is explicit, bounded and non-retrospective.
- Uncertainty remains open rather than being forced into a destination.

## Progress

The [matrix](../../MIGRATION_MATRIX.md) and [machine inventory](../../MIGRATION_INVENTORY.json) cover exactly 50 baseline completed Specs and 50 individual articles. Source/article hashes, all level-two source sections, linked owner identities, consumer snapshots are captured; each article retains its limitations. Local article links and owner paths resolve. Independent review now passes all 50 articles for core capability, decisions and important limitations after S-051/S-053 corrections. This does not establish exhaustive atomic claim completeness or approve retirement. The owner explicitly chose one article per Spec, but did not choose a retrospective or migration QA mechanism. Current consumers remain to reconcile; no record moved or was discarded.

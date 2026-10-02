# S-003X - Decision Record Tooling

**Spec ID:** S-003X
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-10-02
**Catalog description:** Give a room one tool and one set of read words for both kinds of decision record, the ADR and the Destination Decision Record, with the lifecycle moves the ADR tool lacks.
**Blockers:** none for specification. How a DDR records its single landmark is open and waits on the landmark capability; implementation awaits Plan and assignment.
**Latest event:** Authored at the Map step from the owner-confirmed decision records of 2026-10-02; no Task is cut.
**Next gate:** At Plan, inspect live Actuality and cut small Tasks within this Spec.

> **Citation anchors.** pre=`cbb3d5b81c0081c45d92e0d284078ca13fd54c03` post=`cbb3d5b81c0081c45d92e0d284078ca13fd54c03`.

## Outcome

A room keeps two kinds of decision record, the ADR for how the system is built and the Destination Decision Record (DDR) for what the finished product must be or do, and one tool creates, reads, accepts, supersedes and deprecates both. An agent asks an ADR or a DDR the same way it asks a notepad, a Spec or a landmark: with the five read words `list`, `show`, `search`, `history` and `inspect`.

## Why It Matters

The owner accepted the DDR as a durable per-decision owner of destination choices, and accepted that every kind of record answers the same read words. Both decisions were promoted as Canon with the explicit statement that they perform no delivery. Until the tooling exists, a DDR has no collection to live in, no command that writes one, and no way to accept or supersede it; the ADR tool itself can only create a record, validate, normalize and register, so an ADR is superseded by hand.

## Current Verified State

At the pre anchor:

- `workbench/tools/adr.mjs` exposes `validate`, `normalize`, `register`, `new` and `migrate-folders`. It has no read command and no accept, supersede or deprecate move.
- `workbench/manifest.json` declares collections `adr`, `design-concepts`, `guidebooks`, `archive`, `grilling`, `handoffs`, `checkpoints`, `notepads`, `notepad-templates`, `recovery` and `features`. There is no `ddr` collection and no `workbench/docs/ddr/` folder.
- The ADR layout is lifecycle by folder location: accepted records at the top of `workbench/docs/adr/`, `proposed/` for records that are not yet Canon, and `archive/` for superseded and deprecated records, with the register and history derived from the folder listing.
- The root `LEXICON.md` states the Decision Record, DDR and read-word definitions. `templates/LEXICON.md` and `templates/BLUEPRINT.md` carry none of them; the two accepted decision records leave those mirrors to this capability.
- The Blueprint still carries decisions and links ADRs. Taking its decisions out into DDRs is a separate step this Spec does not perform.

No implementation or agent-outcome proof for this capability is claimed by this Map record.

## Desired Behavior

1. A manifest collection named `ddr` at `workbench/docs/ddr/` follows the ADR layout: accepted records at the top, `proposed/` for records not yet Canon, `archive/` for superseded and deprecated ones. A DDR carries a visible identifier made of the `DDR` prefix and a base-62 value, the frontmatter keys `date`, `supersedes` and `canonicalized_in`, and a free-prose body. Its register and history are derived from the folder listing and never edited by hand. The template may adapt where a destination record needs it; a DDR must serve a destination goal.
2. A command writes the next DDR into `proposed/`, run at the same documentation step that writes an ADR, and refuses to overwrite an existing record.
3. The lifecycle moves exist for both kinds of record and follow the ADR lifecycle: a record moves out of `proposed/` to become accepted once corrections are reconciled; a superseded record is replaced by one successor that states the whole current decision and moves to `archive/`; a deprecated record ends without a successor and states why. No separate approval ceremony is added.
4. An agent reads either kind of record with the five read words: `list` the records that exist, `show` one whole record (with `get` accepted as a synonym), `search` records by query, `history` how a record changed, and `inspect` a field or range of one record. Existing command names keep working.
5. Validation enforces what the decision records fix: a DDR's `canonicalized_in` never names the Wiki, and a DDR that contradicts the Blueprint names the Blueprint in `canonicalized_in` so the Blueprint is updated with it.
6. The generic templates, the manifest declaration, Genesis and the update route carry the `ddr` collection, the DDR terms, the Blueprint row, the narrowed Blueprint instruction about linking decisions, and the Read words row, so a room that updates gains the collection without losing its own records.

## Decisions And Contracts

- A DDR is its own durable record type, a sibling of the ADR, and the two are handled by one system. One decision that needs both records links them rather than merging them. A Spec keeps a capability's scoped, testable acceptance. See [Destination Decision Records are decision records beside ADRs](../../docs/adr/000S-destination-decision-records-are-decision-records-beside-adrs.md).
- The five read words are the Workbench's own and are defined once in the Lexicon. `capture` is Create, not a read. This Spec renames each tool it touches to the words. See [Records share one set of read words](../../docs/adr/000T-records-share-one-set-of-read-words-list-show-search-history-and-inspect.md).
- Lifecycle is folder location, per the ADR record on [record lifecycle by folder location](../../docs/adr/000I-record-lifecycle-is-expressed-by-folder-location-with-permanent-archive-and-transient-retired.md). Visible identifiers follow the base-62 identifier decision in [ADR-0041](../../docs/adr/0041-visible-base62-workbench-identifiers.md).
- Whether the DDR tooling reuses the ADR runtime or forks it is for the Plan step. Reuse is the recommendation of the accepted record, not a decision.
- The tool does not encode when a decision record is born. The point at which a record is created is being settled by a separate owner grilling on the workflow verbs, which was not on integration at the pre anchor; the command only writes a `proposed/` record at whatever documentation step the Contract names.
- The Wiki cites DDRs by name and context and has no page per DDR. The Wiki is the synthesis; the DDR owns the decision.

Open, not decided here:

- How a DDR records the one landmark it belongs to (a frontmatter key on the DDR, or a listing on the landmark). The accepted landmark decision says each DDR belongs to exactly one landmark or sits at Blueprint level; the accepted DDR record fixes only the keys `date`, `supersedes` and `canonicalized_in`. This is shared with [LANDMARK.md Artifact And Lane Runtime](../S-003Z-landmark-md-artifact-and-lane-runtime/SPEC.md).
- Whether `search` attaches a record's linked corrections to a result, as the notepad's topic read does.

## Non-Goals

Taking the existing Blueprint apart into the first DDRs, which the owner grills before any Spec drafts them. Backfilling DDRs from locked ledger rows or Destination Question Cards, which get one only when next touched. Changing the Blueprint's content. Renaming any command beyond what a touched tool needs. The ownership map file. Implementing another capability.

## Dependencies And Blockers

- The landmark capability, [LANDMARK.md Artifact And Lane Runtime](../S-003Z-landmark-md-artifact-and-lane-runtime/SPEC.md), decides how a landmark lists its DDRs; a DDR's landmark field waits on that decision.
- The [Ownership Map root control](../S-00G-ownership-map-root-control/SPEC.md) takes the DDR row when it is installed.
- Coordinate shared controls and generic mirrors with [Workflow Canon Rework](../S-00P-workflow-canon-rework/SPEC.md) and the [Contract carrier rewrite](../S-004C-contract-carrier-pointer-brief-rewrite/SPEC.md); the template Blueprint instruction is a shared writer.
- The [release owner](../S-00O-workbench-v4-0-0-release/SPEC.md) retains version, Template and owner gates; a changed managed byte needs the normal bundle, version and install proof at implementation time.

## Vertical Implementation Slices

No Tasks cut. At Plan, use current Actuality to cut small complete-path slices and safe parallel groups. The empty tasks directory keeps this planned capability record-backed.

## Acceptance Criteria

- [ ] The manifest declares a `ddr` collection and a fresh project has `workbench/docs/ddr/` with its `proposed/` and `archive/` folders.
- [ ] The DDR command writes the next record into `proposed/` with a `DDR` visible identifier and refuses to overwrite an existing record.
- [ ] Accept, supersede and deprecate moves work for ADRs and DDRs by folder location, refuse a supersession without exactly one named successor and a deprecation without a stated reason, and leave the register and history derived from the folder listing.
- [ ] An agent can `list`, `show`, `search`, `history` and `inspect` an ADR and a DDR, and every existing command name still works.
- [ ] Validation refuses a DDR whose `canonicalized_in` names the Wiki.
- [ ] Source behavior, templates, the manifest declaration, Genesis and the update route agree, and updating a room that already holds ADRs adds the collection without altering its records.
- [ ] Named verification and remaining limitations are recorded without claiming owner approval.

## Testing Seams

The `adr.mjs` command line and its manifest collection resolution, exercised in a fixture room. Red/green cases cover creation, refusal to overwrite, each lifecycle move with its refusals, each read word, and validation of the frontmatter rules. Use a receipt-backed installed command and a fixture-room update to prove the managed route; routing or string checks support discovery but do not prove the lifecycle.

## Verification Procedure

Run the targeted decision-record tests and the full AGENTS suite for the delivered change, then `render` and `doctor`. Capture the guardrail baseline before and after, and the Workbench self-drift pre and post receipts with the bounded semantic check, because the change touches controls and templates. Obtain separate-context review of the immutable candidate before integration, and keep owner Human QA separate. This Map record claims none of that proof.

## Documentation Impact

Maintain the Lexicon rows and the Runbook decision-record commands, mirror the generic rules in `templates/`, and update the [Decision Records and the Concept Map](../../wiki/design-concepts/decision-records-and-the-concept-map.md) article when delivery changes what it says. The two accepted decision records are history and are not rewritten; a later change goes through the lifecycle moves this Spec delivers.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-02 | none | Authored at the Map step from the owner-confirmed decision records of 2026-10-02 at integration cbb3d5b81c0081c45d92e0d284078ca13fd54c03. | Map only; no runtime proof claimed. | This Spec. | Plan, implementation and proof remain; the DDR landmark field and `search` corrections are open. |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

Seeding the first DDRs from the Blueprint is a separate step after the owner grills the candidates. The DDR landmark field waits on the landmark capability.

## Supersession

- Supersedes: none
- Superseded by: none

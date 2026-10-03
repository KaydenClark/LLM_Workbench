# S-003X - Decision Record Tooling

**Spec ID:** S-003X
**Status:** active
**Priority:** 2
**Owner:** claude-s003x-dispatcher
**Stance:** Builder
**Updated:** 2026-10-03
**Catalog description:** Give a room one tool and one set of read words for both kinds of decision record, the ADR and the Destination Decision Record, with the lifecycle moves the ADR tool lacks.
**Blockers:** none for the four tooling Tasks (TK-004W, TK-004X, TK-004Y, TK-004Z), which run in that order. The Lexicon-mirror Task TK-005A waits on the owner's unmerged Codex Lexicon reconciliation branch, which edits both Lexicons. How a DDR records its single landmark is open, outside this acceptance, and waits on the landmark capability.
**Latest event:** TK-004Y claimed by claude-s003x-dispatcher.
**Next gate:** Close TK-004Y with verification and documentation proof.

> **Citation anchors.** pre=`5f3df1f99c04b4b75f1dc5ff585f9377ea2ff61a` post=`5f3df1f99c04b4b75f1dc5ff585f9377ea2ff61a`.

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
2. A command writes the next DDR into `proposed/`, run at the same documentation step that writes an ADR and composed by `to-docs` as an ADR is, and refuses to overwrite an existing record.
3. The lifecycle moves exist for both kinds of record and follow the ADR lifecycle: a record moves out of `proposed/` to become accepted once corrections are reconciled; a superseded record is replaced by one successor that states the whole current decision and moves to `archive/`; a deprecated record ends without a successor and states why. No separate approval ceremony is added.
4. An agent reads either kind of record with the five read words: `list` the records that exist, `show` one whole record (with `get` accepted as a synonym), `search` records by query, `history` how a record changed, and `inspect` a field or range of one record. Existing command names keep working.
5. Validation enforces what the decision records fix: a DDR's `canonicalized_in` never names the Wiki, and a DDR that contradicts the Blueprint names the Blueprint in `canonicalized_in` so the Blueprint is updated with it.
6. The generic templates, the manifest declaration, Genesis and the update route carry the `ddr` collection, the DDR terms, the Blueprint row, the narrowed Blueprint instruction about linking decisions, and the Read words row, so a room that updates gains the collection without losing its own records.

## Decisions And Contracts

- A DDR is its own durable record type, a sibling of the ADR, and the two are handled by one system. One decision that needs both records links them rather than merging them. A Spec keeps a capability's scoped, testable acceptance. See [Destination Decision Records are decision records beside ADRs](../../docs/adr/000S-destination-decision-records-are-decision-records-beside-adrs.md).
- The five read words are the Workbench's own and are defined once in the Lexicon. `capture` is Create, not a read. This Spec renames each tool it touches to the words. See [Records share one set of read words](../../docs/adr/000T-records-share-one-set-of-read-words-list-show-search-history-and-inspect.md).
- Lifecycle is folder location, per the ADR record on [record lifecycle by folder location](../../docs/adr/000I-record-lifecycle-is-expressed-by-folder-location-with-permanent-archive-and-transient-retired.md). Visible identifiers follow the base-62 identifier decision in [ADR-0041](../../docs/adr/0041-visible-base62-workbench-identifiers.md).
- Decided at Plan on 2026-10-03: the DDR tooling reuses the ADR runtime. `workbench/tools/adr.mjs` serves both kinds, parameterized by record kind (collection, identifier prefix, template and finding code). No second runtime tool is added, so the closed set of managed runtime tools and every installed-tools receipt stay as they are, and every existing ADR command, export and finding keeps its behavior. Commands that create or check a collection take `--kind ddr`; commands addressed to one record read the kind from its `ADR-` or `DDR-` identifier prefix. A forked runtime was rejected because the two kinds share layout, lifecycle, identifiers and validation, and a fork would duplicate all of it.
- Decided at Plan on 2026-10-03 for decision records only: `search` attaches no other record to a result. Each result carries the record's lifecycle status and, for a superseded record, the successor that replaced it, because supersession is how a decision record is corrected; a reader is never handed a replaced decision as if it were current. Whether `search` attaches linked corrections the way the notepad topic read does stays open for the other record tools.
- The tool does not encode when a decision record is created. The accepted [workflow verbs decision](../../docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md) places the creation of decision records, ADRs and DDRs alike, at Map and narrows the earlier record's rule that a DDR is born when the owner confirms the decision. The accepted [promotion decision](../../docs/adr/000Y-a-locked-and-confirmed-answer-is-promoted-without-further-ceremony.md) has `to-docs` compose a DDR as it composes an ADR. The command only writes a `proposed/` record at the documentation step, run through `to-docs`.
- The Wiki cites DDRs by name and context and has no page per DDR. The Wiki is the synthesis; the DDR owns the decision.

Open, not decided here:

- How a DDR records the one landmark it belongs to (a frontmatter key on the DDR, or a listing on the landmark). The accepted landmark decision says each DDR belongs to exactly one landmark or sits at Blueprint level; the accepted DDR record fixes only the keys `date`, `supersedes` and `canonicalized_in`. This is shared with [LANDMARK.md Artifact And Lane Runtime](../S-003Z-landmark-md-artifact-and-lane-runtime/SPEC.md).
- Whether `search` attaches linked corrections for record tools other than the decision-record tool (decided above for decision records only).

The landmark question is not decided at Plan. The DDR template carries no landmark field, and validation neither requires nor refuses one, until the LANDMARK.md capability settles it.

## Non-Goals

Taking the existing Blueprint apart into the first DDRs, which the owner grills before any Spec drafts them. Backfilling DDRs from locked ledger rows or Destination Question Cards, which get one only when next touched. Changing the Blueprint's content. Renaming any command beyond what a touched tool needs. The ownership map file. Implementing another capability.

## Dependencies And Blockers

- The landmark capability, [LANDMARK.md Artifact And Lane Runtime](../S-003Z-landmark-md-artifact-and-lane-runtime/SPEC.md), decides how a landmark lists its DDRs; a DDR's landmark field waits on that decision.
- The [Ownership Map root control](../S-00G-ownership-map-root-control/SPEC.md) takes the DDR row when it is installed.
- Coordinate shared controls and generic mirrors with [Workflow Canon Rework](../S-00P-workflow-canon-rework/SPEC.md) and the [Contract carrier rewrite](../S-004C-contract-carrier-pointer-brief-rewrite/SPEC.md); the template Blueprint instruction is a shared writer.
- The [release owner](../S-00O-workbench-v4-0-0-release/SPEC.md) retains version, Template and owner gates; a changed managed byte needs the normal bundle, version and install proof at implementation time.

## Vertical Implementation Slices

Cut at Plan on 2026-10-03 as record-backed Tasks under `tasks/`; each `TASK.md` carries its state, acceptance and proof. They run in this order, one writer, because TK-004X, TK-004Y and TK-004Z all edit `workbench/tools/adr.mjs`, `tools/test-adr.mjs` and the Runbook decision-record section, so no two of them form a safe parallel group:

1. TK-004W installs the `ddr` collection in fresh rooms (`init`) and existing rooms (`migrate`), and in this room.
2. TK-004X writes, validates and registers DDRs through the shared runtime, narrows the generic Blueprint instruction and routes `to-docs` to the DDR command.
3. TK-004Y adds the accept, supersede and deprecate moves for both kinds.
4. TK-004Z adds the five read words for both kinds.
5. TK-005A mirrors the installed collection, terms and read words into both Lexicons. It is last because the owner's unmerged Codex Lexicon reconciliation branch edits both Lexicons; it stays blocked until that branch lands or the owner releases the files.

## Acceptance Criteria

- [x] The manifest declares a `ddr` collection and a fresh project has `workbench/docs/ddr/` with its `proposed/` and `archive/` folders.
- [x] The DDR command writes the next record into `proposed/` with a `DDR` visible identifier and refuses to overwrite an existing record.
- [ ] Accept, supersede and deprecate moves work for ADRs and DDRs by folder location, refuse a supersession without exactly one named successor and a deprecation without a stated reason, and leave the register and history derived from the folder listing.
- [ ] An agent can `list`, `show`, `search`, `history` and `inspect` an ADR and a DDR, and every existing command name still works.
- [x] Validation refuses a DDR whose `canonicalized_in` names the Wiki.
- [ ] Source behavior, templates, the manifest declaration, Genesis and the update route agree, and updating a room that already holds ADRs adds the collection without altering its records.
- [ ] Named verification and remaining limitations are recorded without claiming owner approval.

## Testing Seams

The `adr.mjs` command line and its manifest collection resolution, exercised in a fixture room. Red/green cases cover creation, refusal to overwrite, each lifecycle move with its refusals, each read word, and validation of the frontmatter rules. Use a receipt-backed installed command and a fixture-room update to prove the managed route; routing or string checks support discovery but do not prove the lifecycle.

## Verification Procedure

Run the targeted decision-record tests and the full AGENTS suite for the delivered change, then `render` and `doctor`. Capture the guardrail baseline before and after, and the Workbench self-drift pre and post receipts with the bounded semantic check, because the change touches controls and templates. Obtain separate-context review of the immutable candidate before integration, and keep owner Human QA separate. This Map record claims none of that proof.

## Documentation Impact

Maintain the Lexicon rows, the Runbook decision-record commands and the `to-docs` skill's route to the DDR command, mirror the generic rules in `templates/`, and update the [Decision Records and the Concept Map](../../wiki/design-concepts/decision-records-and-the-concept-map.md) article when delivery changes what it says. The two accepted decision records are history and are not rewritten; a later change goes through the lifecycle moves this Spec delivers.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-02 | none | Authored at the Map step from the owner-confirmed decision records of 2026-10-02 at integration cbb3d5b81c0081c45d92e0d284078ca13fd54c03. | Map only; no runtime proof claimed. | This Spec. | Plan, implementation and proof remain; the DDR landmark field and `search` corrections are open. |
| 2026-10-02 | none | Re-verified and re-anchored at integration 5f3df1f99c04b4b75f1dc5ff585f9377ea2ff61a after four PRs landed. | Map only; the asserted counts, tool commands, collections and the S-00M status were re-read at that tip; no runtime proof claimed. | This Spec. | Plan, implementation and proof remain. |
| 2026-10-03 | none | Planned at integration 2dcde6e90faed0937d7742fdac186db3c14e5e5b: Actuality inspected (adr.mjs commands, manifest and layout collection shapes, init and migrate, Genesis and Runbook text, template placeholders, diagnostics); Tasks TK-004W, TK-004X, TK-004Y, TK-004Z and TK-005A cut record-backed; the Spec activated; ADR-runtime reuse and the decision-record search result shape decided; the landmark field left open. | Plan only; doctor and render after the cut; guardrail baseline 78/100 and self-drift pre receipt (7 pre-existing attention findings; machineResult blocked, cleanUpdate false) captured at 2dcde6e9; no runtime proof claimed. | This Spec, its five TASK.md records, the generated projections and the Wiki article "Decision Records and the Concept Map" (names the delivering Specs; Wiki validated). | All implementation and proof remain; TK-005A is blocked on the unmerged Codex Lexicon reconciliation branch. |
| 2026-10-03 | TK-004W | Task closed | Red aa51ade6 (test-workbench-layout 71/2: init declared no ddr; migrate added only features). Green at 333a6da7: test-workbench-layout 73/73 and the adoption, upgrade, landmark-tracker, round-trip, dogfood and control-fidelity tests pass; this room migrated to declare collections.ddr and validates; full AGENTS suite 48/48 on the clean candidate. Plan PR #279 (reviewed PASS at a560f6cf, suite 48/48) merged into integration as 1b5da601 before this close. | RUNBOOK support-root check, templates/RUNBOOK, templates/GENESIS readiness line and the Wiki article Decision Records and the Concept Map updated; update-harness skill checked, no change needed (it names additive collections generically). | TK-004X (DDR command, validation, register), TK-004Y, TK-004Z and the blocked TK-005A remain; separate-context review of this Task's final head precedes its integration merge. |
| 2026-10-03 | TK-004X | Task closed | Red ba8202bf (test-adr 40/5, test-diagnostics 34/2). Green: test-adr 45/45, test-diagnostics 36/36 and the visible-id-consumers, sessions, genesis-from-decisions, direct-promotion, governance-core, lifecycle-directory-links and self-drift tests pass; this room's empty DDR register and history written with the ADR register unchanged; full AGENTS suite 48/48 on clean 06ea023f after a 47/48 run on 7d0cf583 exposed a bracketed flag read as a template placeholder. TK-004W PR #280 (reviewed PASS at 96f44379) merged into integration as 674855fd before this close. | RUNBOOK and templates/RUNBOOK decision-record commands and rules, to-docs DDR route, templates/BLUEPRINT.md narrowed instruction with its placeholder vocabulary, and the Wiki article Decision Records and the Concept Map updated. | TK-004Y (moves), TK-004Z (read words) and the blocked TK-005A remain; separate-context review of this Task's final head precedes its integration merge. |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

Seeding the first DDRs from the Blueprint is a separate step after the owner grills the candidates. The DDR landmark field waits on the landmark capability.

## Supersession

- Supersedes: none
- Superseded by: none

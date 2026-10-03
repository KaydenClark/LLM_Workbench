# S-003X - Decision Record Tooling

**Spec ID:** S-003X
**Status:** active
**Priority:** 2
**Owner:** claude-s003x-dispatcher
**Stance:** Builder
**Updated:** 2026-10-03
**Catalog description:** Give a room one tool and one set of read words for both kinds of decision record, the ADR and the Destination Decision Record, with the lifecycle moves the ADR tool lacks.
**Blockers:** none. The Codex Lexicon reconciliation branch TK-005A waited on landed through PR #281, so the Lexicon-mirror Task is ready. How a DDR records its single landmark is open, outside this acceptance, and waits on the landmark capability.
**Latest event:** Whole-Spec QA assembled after all five Tasks closed; separate-context review of the assembled candidate is next.
**Next gate:** Separate-context review of the assembled candidate (report and verdict), then owner Human QA on integration, owner main promotion and complete.

> **Citation anchors.** pre=`5f3df1f99c04b4b75f1dc5ff585f9377ea2ff61a` post=`b4e22bd4ded65ba9918e2beb6fe5293f0fb051ea`.

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
5. TK-005A mirrors the installed collection, terms and read words into both Lexicons. It is last because the owner's Codex Lexicon reconciliation branch edited both Lexicons; it waited on that branch until PR #281 landed it on 2026-10-03.

## Acceptance Criteria

- [x] The manifest declares a `ddr` collection and a fresh project has `workbench/docs/ddr/` with its `proposed/` and `archive/` folders.
- [x] The DDR command writes the next record into `proposed/` with a `DDR` visible identifier and refuses to overwrite an existing record.
- [x] Accept, supersede and deprecate moves work for ADRs and DDRs by folder location, refuse a supersession without exactly one named successor and a deprecation without a stated reason, and leave the register and history derived from the folder listing.
- [x] An agent can `list`, `show`, `search`, `history` and `inspect` an ADR and a DDR, and every existing command name still works.
- [x] Validation refuses a DDR whose `canonicalized_in` names the Wiki.
- [x] Source behavior, templates, the manifest declaration, Genesis and the update route agree, and updating a room that already holds ADRs adds the collection without altering its records.
- [x] Named verification and remaining limitations are recorded without claiming owner approval.

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
| 2026-10-03 | TK-004Y | Task closed | Red 55cbbe26 (test-adr fails at import: no move exports). Green: test-adr 50/50 covering accept, supersede and deprecate for both kinds, every refusal leaving the tree byte-identical, live-link repair with evidence rows left and counted, and a non-Git rename; full AGENTS suite 48/48 on clean cbb7a44a. TK-004X PR #282 (reviewed PASS at b6b20489) merged into integration as 226212f1 before this close; its review P3 (DDR register regeneration in moves only indirectly tested) is answered by this Task's DDR move tests, which assert the DDR register and history after each move. | RUNBOOK and templates/RUNBOOK decision-record move commands and refusals, and the Wiki article Decision Records and the Concept Map updated. | TK-004Z (read words) and TK-005A (Lexicon mirrors) remain; separate-context review of this Task's final head precedes its integration merge. |
| 2026-10-03 | TK-004Y | Review correction after close | Separate-context review of 97c44ba2 (Codex gpt-5.5, read-only) FAILED with one P2: the CLI accepted a positional record identifier for every command, so `validate ADR-000A` exited 0 and ignored it. Red 032faf81 (the refusal test fails), fix 5245e747 makes positional identifiers command-specific (accept, supersede, deprecate); test-adr 50/50. | No doc change: the Runbook already documents identifiers only on the move commands. | Full AGENTS suite and a fresh separate-context review of the corrected head precede the integration merge. |
| 2026-10-03 | TK-004Z | Task closed | Red 0b0512cf (test-adr fails at import: no read-word exports). Green: test-adr 56/56 covering list, show and get, search, history and inspect for both kinds in text and JSON, their refusals, and unchanged existing commands; full AGENTS suite 48/48 on clean 4cd48973. TK-004Y PR #284 (review FAIL at 97c44ba2 corrected; fresh PASS at 6fb1de52) merged into integration as 5cfa987b before this close. | RUNBOOK and templates/RUNBOOK read-word commands, and the Wiki article Decision Records and the Concept Map updated. | TK-005A (Lexicon mirrors; its owner blocker is met since the Codex Lexicon branch landed in PR #281) remains; separate-context review of this Task's final head precedes its integration merge. |
| 2026-10-03 | TK-005A | Owner blocker cleared | The owner-directed PR #281 (codex/lexicon-snag-recovery, merged 2026-10-03T13:09:58Z) carries the Codex Lexicon reconciliation tip e46d587b; `git merge-base --is-ancestor e46d587b origin/integration` succeeds at integration bbfcd37b and later. `owner:s01u-tk01q-lexicon-branch-landed` removed and TK-005A set ready; its remaining blockers are the four done tooling Tasks. | TK-005A record notes the clearance and that PR #281 already corrected the root Lexicon DDR row (861657d6). | TK-005A implementation, proof and review remain. |
| 2026-10-03 | TK-005A | Task closed | Red 62c1cf50 (control-fidelity Lexicon vocabulary case fails). Green: control-fidelity, controls-vocabulary-sweep, blueprint-contract, evaluate-workbench and workbench-layout pass; templates evaluator 106.6/113 unchanged; full AGENTS suite 48/48 on clean b0730364. Owner blocker cleared with PR #281 evidence (e46d587b contained in integration). TK-004Z PR #287 (reviewed PASS at ec5e6d16) merged into integration as 23f42ab2 before this close. | LEXICON.md, templates/LEXICON.md and the Wiki article Decision Records and the Concept Map updated. | Whole-Spec QA and separate-context review of the assembled candidate remain; owner Human QA and main promotion are the owner's. |
| 2026-10-03 | TK-005A | Review correction after close | Separate-context review of b4e22bd4 (Codex gpt-5.5, read-only) FAILED: P1, the generic Lexicon defined DDR twice (an artifact-boundary row and a term row) against the Task acceptance "defines once", and the new test checked only presence; P2, the Task's planned post-change self-drift receipt was not recorded. Red 933de0fc (the test now requires exactly one generic row per term), fix 0cf30b00 folds the boundary statement into the single generic DDR row; control-fidelity case passes. Self-drift post receipt at 0cf30b00 (clean tree): the same seven pre-existing attention findings as the pre receipt (one stale claim, five stale seeds, one manifest provenance), none new; machineResult blocked, cleanUpdate false, as at 2dcde6e9. | templates/LEXICON.md DDR rows consolidated. | Full AGENTS suite and a fresh separate-context review of the corrected head precede the integration merge. |
| 2026-10-03 | none | Whole-Spec QA assembled on top of the TK-005A head b4e22bd4ded65ba9918e2beb6fe5293f0fb051ea: all five Tasks done; Completion Result, Remaining Limitations and acceptance boxes 6 and 7 written. | Self-drift post receipt at b4e22bd4 (clean tree): the same seven pre-existing attention findings as the pre receipt at 2dcde6e9 (one stale claim on S-00Q, five stale seeds, one manifest provenance), none new; machineResult blocked, cleanUpdate false, as before. Bounded semantic check: S-003X header, both Lexicons, Runbook and generic Runbook, to-docs, the generic Blueprint instruction and the Wiki article match the shipped tooling; ADR-000S and ADR-000T keep their dated "at the time of this record" claims as history. Guardrail audit 78/100 after, unchanged from the baseline. Full AGENTS suite on the assembled candidate: recorded in the next row. | This Spec and the Wiki article Decision Records and the Concept Map (delivery recorded). | Separate-context review of the assembled candidate, then owner Human QA, main promotion and complete. |
| 2026-10-03 | none | Assembled candidate refreshed after the TK-005A review corrections and PR #290 merged into integration as e584cb74; the assembly now differs from integration only in this Spec, its TASKBOARD row and the Wiki article. | Full AGENTS suite 48/48 on the clean assembly 60dd7643 (all five Tasks and the corrected TK-005A); self-drift post receipt at 60dd7643: the same seven pre-existing attention findings as before, none new, machineResult blocked and cleanUpdate false as at 2dcde6e9; guardrail audit 78/100, unchanged. Each Task PR (#280, #282, #284, #287, #290) passed a separate-context Codex gpt-5.5 review of its exact merged head; #284 and #290 needed corrections first. | This Spec. | Separate-context review of this assembled candidate (report and verdict), then owner Human QA on integration, owner main promotion and complete. |

## Completion Result

Delivered to integration Task by Task on 2026-10-03 under the S-00O bootstrap exemption 2, each Task PR reviewed in a separate context before its merge. Owner Human QA, main promotion and `complete` remain the owner's.

- The `ddr` collection (`workbench/docs/ddr/`, with `proposed/` and `archive/`) is declared by `init` in a fresh room and appended by `workbench-layout.mjs migrate` to an existing room without touching its ADRs or other manifest keys; this room declares it (TK-004W, PR #280).
- `workbench/tools/adr.mjs` serves both kinds of decision record. `new --kind ddr` writes the next `DDR`-identified record into `proposed/` with the keys `date`, `supersedes` and `canonicalized_in`; validation applies the ADR rules to DDRs as the registered `invalid-ddr` and refuses a DDR naming the Wiki in `canonicalized_in`; `register` derives each collection's register and history; doctor and the Spec and Task moves carry both (TK-004X, PR #282).
- `accept`, `supersede` and `deprecate` move either kind by folder location with their refusals, live-link repair outside append-only evidence and register regeneration (TK-004Y, PR #284).
- `list`, `show` with `get`, `search`, `history` and `inspect` read either kind (TK-004Z, PR #287).
- The Runbook, the generic Runbook, the `to-docs` route, the narrowed generic Blueprint instruction, both Lexicons and the Wiki article "Decision Records and the Concept Map" describe the shipped tooling (TK-004W to TK-005A; TK-005A, PR #290).

Verification is in the evidence log: red/green per Task, the full AGENTS suite 48/48 on each Task's committed candidate and on the assembled candidate, guardrail audit 78/100 before and after, and self-drift receipts before (2dcde6e9) and after (b4e22bd4) with the same seven pre-existing attention findings and none new.

## Remaining Limitations Or Follow-Up Specs

- Seeding the first DDRs from the Blueprint is a separate step after the owner grills the candidates; no DDR exists yet.
- The DDR landmark field waits on the [LANDMARK.md Artifact And Lane Runtime](../S-003Z-landmark-md-artifact-and-lane-runtime/SPEC.md) capability; the template carries none.
- Whether `search` attaches linked corrections stays open for record tools other than the decision-record tool.
- The `AGENTS.md` documentation-ownership table (root and generic) and the ownership map carry no DDR row; the [Contract carrier rewrite](../S-004C-contract-carrier-pointer-brief-rewrite/SPEC.md) and the [Ownership Map root control](../S-00G-ownership-map-root-control/SPEC.md) own those.
- `adr.mjs list --status` given with no value is treated as no filter instead of being refused (an unknown status is refused); review P3 on TK-004Z, not repaired.
- Template placeholder detection matches exact strings, so a room still carrying the previous generic Blueprint instruction unfilled is no longer flagged by it.
- Version, release bundle and the Workbench_Template upgrade proof for these managed bytes stay with the [release owner](../S-00O-workbench-v4-0-0-release/SPEC.md); no version was bumped.
- No agent-outcome claim is made; the guardrail score is unchanged.

## Supersession

- Supersedes: none
- Superseded by: none

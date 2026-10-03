# S-004F - Corrective Work Rules

**Spec ID:** S-004F
**Status:** active
**Priority:** 2
**Owner:** claude-lane-d
**Stance:** Builder
**Updated:** 2026-10-03
**Catalog description:** When a check finds a miss, the same Task continues with an adjusted handoff unless the fix rewrites it, and a later gap against delivered work becomes a new Spec under its landmark or the Blueprint instead of a correction anchored to a Wiki claim.
**Blockers:** none for the first four Tasks. Three later Tasks wait on `owner:` tokens for another Spec's writer turn on the Runbook, the Lexicon and the Blueprint; each Dispatcher removes its token when that file is free.
**Latest event:** TK-005S claimed by claude-lane-d.
**Next gate:** Close TK-005S with verification and documentation proof.

> **Citation anchors.** pre=`5cfa987bacb0f6a9273d93e8d989e34000d75ad9` post=`5cfa987bacb0f6a9273d93e8d989e34000d75ad9`.

## Outcome

When a check finds that a Task's work missed, and the fix is more of the same work, that Task continues with an adjusted handoff; a new Task is opened only when the fix changes the Task enough that it has to be rewritten. When a gap turns up later against work that was already delivered, it becomes a new Spec under its landmark or under the Blueprint, and in the rare case a landmark is reopened or a new one made. It is never a revived Spec and never a correction anchored to a Wiki claim. The controls, the Lexicon, the decision records, the tooling and the tests all say and do the same thing.

## Why It Matters

The owner confirmed both rules on 2026-10-03, and today the Workbench says and does the opposite on both. `AGENTS.md` makes every failed assembled-review finding a new corrective Task and forbids reopening a done record, and `verdict --result fail` creates one new Task per finding in the same call. `AGENTS.md`, the Lexicon's Task and Destination Packet rows and the runtime anchor a later correction to a reconciled Wiki claim. In the owner's words, the Wiki "doesnt hold a destination for us to create a map or plan from", and "the wiki is not the source of the destination." Until this lands, an agent that follows the controls opens Tasks the owner does not want and anchors later work to an artifact that holds knowledge and evidence, not a destination.

## Current Verified State

At the pre anchor:

- `AGENTS.md`, Assembled Review And Corrective Return: "A failed assembled review creates one corrective Task per attributable finding through `verdict ... --result fail`; preserve the original `TASK.md` and its completed proof, and keep the destination open." The section ends "Do not silently reopen a done record or clear a failed verdict with a green test."
- `AGENTS.md`, Owner Closure And Reconciliation: "`approve` with `--finding TEXT` creates corrective Tasks", and "Later gaps against a reconciled capability use corrective Tasks anchored to its Wiki claim, without resurrecting a discarded Spec." The same section ends "Later changes create a new linked spec instead of rewriting a completed result." Documentation Ownership And Proof says the whole-Wiki lint at Spec review produces findings that "become corrective Tasks".
- `RUNBOOK.md`: "A failed verdict creates one corrective Task per attributable finding, anchored to that evidence row", ending "Do not reopen the original record"; "A finding creates corrective Tasks; a destination change records return to Align without inventing Tasks"; and the retirement passage "A later same-capability gap targets the surviving Wiki claim", which documents the `wikiClaim` route of `createCorrectiveTasks` as "a programmatic API, not a create-corrective CLI" and says that while a retired Spec still exists, findings create its corrective Tasks inside that folder. `templates/AGENTS.md` and `templates/RUNBOOK.md` mirror these passages.
- `LEXICON.md`: the Task row's distinction says "A correction against the same reconciled capability updates its Wiki claim without resurrecting the Spec" and "Wiki-claim corrective records are supported"; the Destination Packet row lists "the reconciled Wiki claim for corrective work" among the links and says "A corrective packet does not resurrect a discarded Spec"; the Assembled-Spec review row says failed review "creates corrective Tasks under the still-open Spec". `templates/LEXICON.md` carries the Task, Packet and Assembled-Spec review rows with the same corrective and Wiki-claim wording.
- Runtime, in `workbench/tools/spec-report.mjs`: `recordReviewVerdict` calls `createCorrectiveTasks` on every fail verdict, and `recordOwnerApproval` calls it for a finding that does not change the destination. `createCorrectiveTasks` writes one new ready `TASK.md` per finding, anchored to the evidence row, and never touches an existing record; its code comment says "a done Task is never reopened". When the Spec has been discarded and a `wikiClaim` is given, `createOrphanCorrectiveTasks` writes a standalone Task under the specs lane's `corrective/tasks/` folder whose Destination is `wiki-claim: <note>#<heading>`.
- Runtime, elsewhere: `workbench/tools/spec-workbench.mjs` selects, claims and closes those standalone Tasks (`loadCorrectiveTasks`, `claimOrphanCorrectiveTask`, `closeOrphanCorrectiveTask`, which appends provenance to the Wiki note), and a Spec in the `retired/` folder still takes corrective Tasks in its own folder, which the Taskboard shows as corrective work against a retired Spec. `workbench/tools/task-record.mjs` accepts only the `spec-acceptance` and `wiki-claim` destination types, and `workbench/tools/task-packet.mjs` resolves a `wiki-claim` destination as the Packet's destination member. This room has no `corrective/` folder, and its one retired Spec takes no corrective Task. One done Task, TK-003B in the Dispatcher Role Spec, uses a `wiki-claim` destination for a Wiki page it was written to produce, not for corrective work.
- Tests: `tools/test-spec-report.mjs` covers verdict and owner-QA corrective Tasks; `tools/test-spec-workbench.mjs` covers the standalone corrective records and the Wiki-claim route; `tools/test-control-fidelity.mjs` pins the `AGENTS.md` corrective-return wording and the Runbook's "programmatic API, not a" sentence; `tools/test-workbench-round-trip.mjs` and `tools/test-visible-id-consumers.mjs` carry corrective records through their fixtures. Outside the AGENTS suite, `tools/test-verdict-candidate-binding.mjs` and `tools/test-task-id-collision.mjs` touch corrective Tasks.
- Accepted decision records state the same rules: the two-QA-gates record (ADR-000F) says a failing assembled review "creates corrective Tasks under the still-open Spec"; the three-altitudes record (ADR-000G) and the Task record (ADR-000H) say a corrective Task against a reconciled capability uses its Wiki claim; the folder-lifecycle record (ADR-000I) says a later repair loads and updates the Wiki claim; and point 5 of the landmark record (ADR-000U) says a failed landmark review produces corrective Tasks.
- `BLUEPRINT.md`, Desired Lifecycle, says a Task that misses its step "is not reopened" and a new Task fixes what the check found, that a failed assembled check "creates corrective Tasks under the still-open Spec", and that "A later gap against that same destination is a corrective Task that updates the reconciled record"; Integrated System Design says a gap against an existing destination "is corrective Task work however many Tasks it takes". `tools/test-blueprint-contract.mjs` pins all of these.
- The `to-tasks` skill tells a Task author to use `wiki-claim: <the reconciled claim>` as the Destination for a corrective Task after retirement.
- The grilling destination audit ledger keeps the earlier owner answers these rules replace: WF-8A (a small corrective change against a retired Spec is a Task plus an update to the Wiki record) and WF-8G ("A gap against an existing Spec destination is fixed with reopened or corrective Tasks").

No implementation or agent-outcome proof for this capability is claimed by this Map record.

## Desired Behavior

1. **Same Task unless the fix rewrites it.** When a check finds a miss in a Task's work and the fix is more of the same work, that Task continues: its handoff is adjusted to say what the check found and what the fix must do, and the same Task record carries the repair. A new Task is opened only when the fix changes the Task enough that it has to be rewritten. The record says which case applied.
2. **Continuing is recorded, never silent.** A continued Task keeps its earlier proof, Receipts and evidence rows as written, under the existing append-only rules; the continuation and the finding it answers are added, not rewritten in.
3. **The verdict tooling follows.** A failed assembled-Spec verdict records its findings and lets the recorder either continue the Task or Tasks a finding names, with an adjusted handoff, or open a new Task for a finding whose fix rewrites the Task. `next`, `claim`, `close`, `render` and `doctor` treat a continued Task as ordinary work.
4. **A later gap is a new Spec.** A gap found against delivered work becomes a new Spec under the landmark the delivered work belongs to, or under the Blueprint when it has none; in the rare case, a landmark is reopened or a new one made. Read with the owner's Delivered verb ("the owner's approved work is on main and the concept is delivered"), delivered work is a Spec whose approved content is on main, whether complete, retired or discarded; while a Spec is still open, rules 1 to 3 apply.
5. **The Wiki is evidence, not the destination.** A new Spec for a later gap may cite Wiki pages as knowledge and evidence for its direction and plan, but no Task or Spec takes a Wiki claim as its destination for corrective work. The Wiki-claim corrective route retires: no command creates, selects, claims or closes a corrective Task anchored to a Wiki claim, and no corrective Task is created inside a retired Spec's folder. A retired command refuses with a message naming the new-Spec route.
6. **Every owner says the same thing.** `AGENTS.md`, `RUNBOOK.md`, the Lexicon's Task, Destination Packet and Assembled-Spec review rows, the `to-tasks` skill and the generic `templates/` mirrors state rules 1 to 5. The accepted decision claims listed in Current Verified State are narrowed or superseded through the decision-record lifecycle by a record carrying the owner's two answers.

## Decisions And Contracts

The owner's two answers, both confirmed on the Blueprint teardown review page on 2026-10-03, are the authority. Only their locked text is promoted here.

- **Same Task unless the fix rewrites it.** Confirmed text: "When a check finds a miss and the fix is more of the same work, the same Task continues with an adjusted handoff. A new Task is opened only when the fix changes the Task enough that it has to be rewritten." The owner's own words, correcting the earlier card, verbatim: "If the fix is different than just continuing, and we have to rewrite the task. then yes. otherwise. just use the same task, with an adjusted handoff." The confirmed card also carried a reason the agent had inferred and labeled as its inference: that a new Task is worth its overhead only when the work itself changed. The decision names the `AGENTS.md` corrective-Task rule and the verdict behavior that creates one corrective Task per finding as what changes.
- **A later gap is a new Spec; the Wiki is not the destination.** Confirmed text: "A later gap against delivered work becomes a new Spec under its landmark or the Blueprint; in the rare case, a landmark is reopened or a new one made. It is never a revived Spec and never a correction anchored to a Wiki claim. The Wiki holds knowledge, facts, opinions, summaries, entity and concept pages, comparisons, overviews and synthesis, and evidence for the direction and the plan, but it is not the source of the destination." The owner's own words, verbatim: "Same as with a task, we would just create a new spec based on the Landmark or blueprint. and in the weird case we could reopen a landmark, just create a new one, or a spec based on the blueprint. The wiki doesnt describe the destination. It holds knowledge, facts, opinions, Summaries, entity pages, concept pages, comparisons, overviews, and synthesis. It doesnt hold a destination for us to create a map or plan from. Evidence backing up the direction we want to head on the map, and to support the plan yes. But the wiki is not the source of the destination." The decision names `AGENTS.md`, the Lexicon's Task and Destination Packet rows and the Wiki-claim corrective records in the tooling as what changes.
- The owner's teardown answer on scaffolding, confirmed the same day, says the same for cleared work records: "A later gap becomes a new Spec under the landmark or the Blueprint, never a revived record."
- Unchanged by this Spec: the owner's confirmed answer that failed owner QA returns to Align at the scope the failure implicates, and that a defect is not proof the concept was wrong; the two QA gates; a destination change recorded as a return to Align.
- Decision records are written at Map, per the accepted [workflow verbs decision](../../docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md), and composed by `to-docs` per the accepted [promotion decision](../../docs/adr/000Y-a-locked-and-confirmed-answer-is-promoted-without-further-ceremony.md). Whether the narrowing record is an ADR or a DDR follows the decision-record test and the owner's locked teardown rule that an ADR recording a destination choice becomes a DDR only when next touched.

**Plan decisions.** These settle the five questions the Map record left open. They are the planning agent's choices from project evidence, not owner answers, and none is presented as the owner's reason. The owner may change any of them at Align.

1. **Who judges, where the handoff lives, how status moves.** The recorder of the failed verdict or owner finding judges, per finding, whether the fix is more of the same work or rewrites the Task, because that person holds the finding; the owner did not name a judge. The finding is written `continue TK-###: <what the check found and what the fix must do>` or `new Task: <finding>` (optionally `new Task rewriting TK-###: ...`), a finding naming neither is refused before any write, and the Spec's own evidence row carries that text, so the record says which case applied. The adjusted handoff is the finding text, appended to the continued Task's own `TASK.md` in a `## Continuation` table (run, date, evidence row answered, adjusted handoff); no second handoff file is created. A continued done Task moves to `ready`; a Task already `ready`, `in-progress` or `needs-review` keeps its status; a `blocked` or `deferred` Task is refused. The Task's Receipt already records one row per run, so a continuation is another run: its earlier Receipt rows, Proof and Spec evidence rows stay byte-identical, its `Proof` field shows the latest closing proof, and a later close appends a distinct `Task closed (run N)` evidence row instead of conflicting with the first.
2. **Owner Human QA findings that keep the destination follow rule 1.** The owner's answer speaks of a check, owner QA is a check, and `recordOwnerApproval` shares the verdict's corrective seam. A finding that changes the destination still records a return to Align and creates nothing.
3. **Whole-Wiki lint findings at Spec review follow rule 1.** A lint finding is a miss found by a check, so it continues the Task that wrote the page unless the fix rewrites it; `AGENTS.md` stops saying such findings "become corrective Tasks".
4. **The `wiki-claim` destination type stays.** It serves a Task whose destination is producing a Wiki page, as the done Task TK-003B in the Dispatcher Role Spec does. Only its use as the destination of corrective work retires, so `task-record.mjs` and `task-packet.mjs` keep parsing and resolving it.
5. **A new Spec for a later gap.** It names the landmark or the Blueprint it sits under and the delivered Spec (or its retained name and approving date) in its own text, and cites Wiki pages as evidence for its direction and plan in Current Verified State. Its Tasks use `spec-acceptance` destinations. No landmark field exists in the Spec header yet, so this is prose until the landmark runtime lands. Delivered work is a Spec whose status is `complete` or `superseded`, or one that sits in the `retired` folder; for those the corrective commands refuse and name this route.
6. **A standalone corrective record that already exists** is not deleted or migrated here. `next` stops selecting it and `claim` and `close` refuse it, naming the new-Spec route, while it still counts for identifier occupancy so no identifier collides.
7. **Which decision records.** The same-Task answer is a destination decision, so it is a new destination decision record. The later-gap answer already sits in the accepted scaffolding decision record, which states that this Spec carries the change to the lifecycle and three-altitudes ADRs. A destination decision record cannot supersede an ADR, and the amendment-first rule asks that the existing ADR be corrected and the changed premise recorded, so ADR-000F, ADR-000G, ADR-000H, ADR-000I, ADR-000R (its whole-Wiki lint sentence, decision 3) and ADR-000U are amended in place.
8. **File ownership across Specs.** The Runbook, the Lexicon and the Blueprint each have another writer in turn, so their corrective lines are three separate Tasks that wait on `owner:` tokens rather than edits made here out of turn.

## Non-Goals

Changing the two QA gates, the Task-PR review, owner approval or main promotion; changing how a failed owner QA returns to Align; renaming any command, status or folder; rewriting historical evidence, Receipts or the ledger's earlier answers; deleting a retired Spec; the Contract carrier rewrite beyond the corrective lines; the Blueprint short page beyond its corrective passages; implementing another capability.

## Dependencies And Blockers

- `LEXICON.md` and `templates/LEXICON.md` have one writer at a time. The owner's Codex Lexicon reconciliation (Task TK-01Q of the [Lexicon Design-Concept Reconciliation](../S-01U-lexicon-design-concept-reconciliation/SPEC.md), from branch `codex/s01u-tk01q-lexicon-reconciliation`) landed in integration on 2026-10-03 through PR #281; that Spec stays active for its whole-Lexicon audit, so its later writes and this Spec's rows still take turns, as do the [AI Coding Dictionary Terms](../S-004E-ai-coding-dictionary-terms/SPEC.md) and [Workbench Terms And Workflow Verb Rows](../S-004G-workbench-terms-and-workflow-verbs/SPEC.md) Specs.
- `AGENTS.md`, `RUNBOOK.md` and their mirrors are rewritten by the [Contract Carrier Pointer-Brief Rewrite](../S-004C-contract-carrier-pointer-brief-rewrite/SPEC.md). One writer per file. The owner assigned the `AGENTS.md` turn to this Spec first (TK-005T), and that rewrite's Task for the review and closure sections waits for it to land and then moves the rules as they read. The Runbook and its mirror wait for that rewrite's writer turn (TK-005U); if the rewrite moves a procedure into a skill, TK-005U edits that skill instead.
- The decision record that narrows the accepted records uses the accept, supersede and deprecate moves that [Decision Record Tooling](../S-003X-decision-record-tooling/SPEC.md) delivered on 2026-10-03, and its DDR collection if the record is a DDR.
- If [Blueprint Short Page](../S-004H-blueprint-short-page/SPEC.md) lands first, the Blueprint's corrective passages and their pins in `tools/test-blueprint-contract.mjs` are already gone; otherwise this Spec corrects them under rules 1 to 5.
- The [Workflow Canon Rework](../S-00P-workflow-canon-rework/SPEC.md) wrote the current corrective wording and is at its owner gate; this Spec does not reopen it and starts from the integration text.

## Vertical Implementation Slices

Seven Tasks live in `tasks/`, one record each; this section is a reading aid, not a second tracker. The first four run in order and the last three wait for a writer turn:

1. TK-005Q: the decision records, the new same-Task record and the five ADR amendments.
2. TK-005R: the verdict and owner-finding path that continues a Task or opens a new one, with its tests and the re-close identity.
3. TK-005S: the retired Wiki-claim corrective route and the refusal for delivered Specs, with the later-gap fixture.
4. TK-005T: the `AGENTS.md` corrective sections, their template mirror, the `to-tasks` skill and the Wiki pages that change.
5. TK-005U: the Runbook and its template mirror, after the Runbook writer's turn.
6. TK-005V: the Lexicon rows and their template mirror, after the Lexicon writer's turn.
7. TK-005W: the Blueprint's corrective passages, unless the short page replaced them first.

## Acceptance Criteria

- [ ] `AGENTS.md`, `RUNBOOK.md` and their template mirrors state the same-Task rule and the new-Spec rule, and no current-facing line in them still makes every finding a new Task or anchors later work to a Wiki claim.
- [ ] The Lexicon's Task, Destination Packet and Assembled-Spec review rows and their template mirrors state both rules, and no row offers a Wiki claim as a destination for corrective work.
- [ ] A failed verdict can continue an existing Task with an adjusted handoff or open a new Task when the fix rewrites it, the record says which, and the append-only check shows no earlier evidence or proof rewritten.
- [ ] No command creates, selects, claims or closes a corrective Task anchored to a Wiki claim or creates one inside a retired Spec's folder; each retired path refuses with a message naming the new-Spec route.
- [ ] A fixture shows a later gap against a completed Spec carried by a new planned Spec under its landmark or the Blueprint, citing Wiki evidence without taking it as its destination.
- [ ] No active accepted decision claim states the replaced rules, and the record that narrows or supersedes them carries the owner's two answers.
- [ ] The Blueprint's corrective passages and their test pins say the new rules or are already gone with the short page.
- [ ] The full AGENTS suite passes on the committed candidate, and named verification and remaining limitations are recorded without claiming owner approval.

## Testing Seams

`recordReviewVerdict`, `recordOwnerApproval` and `createCorrectiveTasks` in `workbench/tools/spec-report.mjs`; `next`, `claim`, `close`, `render` and `doctor` in `workbench/tools/spec-workbench.mjs` on a continued Task; the destination types in `workbench/tools/task-record.mjs` and `workbench/tools/task-packet.mjs`; and the wording pins in `tools/test-control-fidelity.mjs`. Red/green cases in a fixture room: a fail verdict continuing a done Task, a fail verdict opening a new Task, a refused Wiki-claim corrective, a later gap carried by a new Spec, and an append-only check over a continued Task's records. String checks support the control wording but do not prove an agent applies the rule.

## Verification Procedure

Run the targeted spec-report, spec-workbench, control-fidelity and append-only tests and the full AGENTS suite against the committed candidate, then `render` and `doctor`. Capture the guardrail baseline before editing and the after-score after, and the Workbench self-drift pre and post receipts with the bounded semantic check, because the change touches controls and templates. Obtain separate-context review of the immutable candidate before integration, and keep owner Human QA separate. This Map record claims none of that proof.

## Documentation Impact

`AGENTS.md` (Assembled Review And Corrective Return, Owner Closure And Reconciliation, and the Wiki-lint line), `RUNBOOK.md` (the verdict, owner-QA and retirement passages), the Lexicon's Task, Destination Packet and Assembled-Spec review rows, `templates/AGENTS.md`, `templates/RUNBOOK.md` and `templates/LEXICON.md`, the `to-tasks` skill, the Wiki's lifecycle tool page where it names the standalone corrective close, and a decision record narrowing the accepted records named in Current Verified State. The Blueprint's corrective passages change here only if the short page has not replaced them.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-03 | none | Authored at the Map step from the owner's two corrective-work answers confirmed on 2026-10-03 in the Blueprint teardown, at integration 5cfa987bacb0f6a9273d93e8d989e34000d75ad9. | Map only; the quoted `AGENTS.md`, Runbook, Lexicon, template, Blueprint, decision-record and skill lines and the named runtime functions and tests were read at that tip; no runtime proof claimed. | This Spec and the generated Spec catalog. Docs checked; no control, Lexicon or Wiki update is due until delivery, because a planned Spec changes no accepted rule. | Plan, implementation and proof remain; the five open questions are for Plan. |
| 2026-10-03 | none | Planned: the five open questions settled from project evidence and seven Tasks cut (TK-005Q to TK-005W) at integration 64c2c524. | Plan only; read `spec-report.mjs` (`recordReviewVerdict`, `recordOwnerApproval`, `createCorrectiveTasks`, `createOrphanCorrectiveTasks`), `spec-workbench.mjs` (`closeTask`, `finishRecordClose`, the standalone corrective claim, select and close paths), `task-record.mjs`, `task-receipt.mjs`, the accepted records and `tools/check-append-only.py` at that tip; no implementation or runtime proof claimed. | This Spec and the seven Task records. Docs checked; no control, Lexicon or Wiki update is due until delivery. | Implementation, proof and the three writer-turn Tasks remain. |
| 2026-10-03 | TK-005Q | Task closed | Full AGENTS suite on committed candidate 0dd04ec2 (47 of 48 first run; the one flake, test-spec-workbench, passed alone on that candidate); control-fidelity pin red then green; test-adr 56 pass; adr validate ok | DDR for the same-Task rule accepted; ADR-000F, 000G, 000H, 000I, 000R, 000U amended with git anchors; registers regenerated | none |
| 2026-10-03 | TK-005R | Task closed | Full AGENTS suite 48 of 48 on committed candidate 9696c78d; red then green at recordReviewVerdict, recordOwnerApproval, createCorrectiveTasks, the Continuation section and the continued-Task re-close; append-only evidence and Receipt rows byte-identical in the fixtures | Docs checked; no control, Runbook or Lexicon update here: the rules reach AGENTS.md in TK-005T and the Wiki lifecycle page in TK-005S | none |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

The ledger's earlier answers stay as history; marking them replaced belongs with the decision record. Renaming the corrective commands or the `complete` status is not proposed here.

## Supersession

- Supersedes: none
- Superseded by: none

# S-004F - Corrective Work Rules

**Spec ID:** S-004F
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-10-03
**Catalog description:** When a check finds a miss, the same Task continues with an adjusted handoff unless the fix rewrites it, and a later gap against delivered work becomes a new Spec under its landmark or the Blueprint instead of a correction anchored to a Wiki claim.
**Blockers:** none for specification. The Lexicon rows take one writer at a time (the owner's Codex Lexicon reconciliation landed in integration on 2026-10-03), and the `AGENTS.md` and Runbook lines coordinate with the Contract Carrier Pointer-Brief Rewrite. Implementation awaits Plan and assignment.
**Latest event:** Authored at the Map step from the owner's two corrective-work answers, confirmed on 2026-10-03 in the Blueprint teardown; no Task is cut.
**Next gate:** At Plan, inspect live Actuality, settle the open questions below from project evidence, and cut small Tasks, starting with the decision record that narrows the accepted records stating the old rules.

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

Open, settled at Plan from project evidence:

- How a continued Task's status moves when the Task was already done, who judges whether a fix rewrites the Task (the owner did not say), and where its adjusted handoff lives: in its `TASK.md`, in a Markdown handoff the Task links, or both.
- Whether an owner Human QA finding that keeps the destination follows rule 1. The owner's answer speaks of a check, and its confirmation names the verdict behavior; the owner-QA route shares the same tooling seam.
- Whether whole-Wiki lint findings at Spec review, which `AGENTS.md` says become corrective Tasks, are a check whose findings follow rule 1.
- Whether the `wiki-claim` destination type stays for a Task whose destination is producing a Wiki page rather than correcting delivered work, as the done TK-003B does.
- How a new Spec for a later gap names the delivered work it builds on and the Wiki evidence it cites, without the Wiki becoming its destination.

## Non-Goals

Changing the two QA gates, the Task-PR review, owner approval or main promotion; changing how a failed owner QA returns to Align; renaming any command, status or folder; rewriting historical evidence, Receipts or the ledger's earlier answers; deleting a retired Spec; the Contract carrier rewrite beyond the corrective lines; the Blueprint short page beyond its corrective passages; implementing another capability.

## Dependencies And Blockers

- `LEXICON.md` and `templates/LEXICON.md` have one writer at a time. The owner's Codex Lexicon reconciliation (Task TK-01Q of the [Lexicon Design-Concept Reconciliation](../S-01U-lexicon-design-concept-reconciliation/SPEC.md), from branch `codex/s01u-tk01q-lexicon-reconciliation`) landed in integration on 2026-10-03 through PR #281; that Spec stays active for its whole-Lexicon audit, so its later writes and this Spec's rows still take turns, as do the [AI Coding Dictionary Terms](../S-004E-ai-coding-dictionary-terms/SPEC.md) and [Workbench Terms And Workflow Verb Rows](../S-004G-workbench-terms-and-workflow-verbs/SPEC.md) Specs.
- `AGENTS.md`, `RUNBOOK.md` and their mirrors are rewritten by the [Contract Carrier Pointer-Brief Rewrite](../S-004C-contract-carrier-pointer-brief-rewrite/SPEC.md). One writer per file: whichever lands first carries the corrective lines; if the rewrite lands first and moves a procedure into a skill, this Spec edits that skill instead.
- The decision record that narrows the accepted records uses the accept, supersede and deprecate moves that [Decision Record Tooling](../S-003X-decision-record-tooling/SPEC.md) delivered on 2026-10-03, and its DDR collection if the record is a DDR.
- If [Blueprint Short Page](../S-004H-blueprint-short-page/SPEC.md) lands first, the Blueprint's corrective passages and their pins in `tools/test-blueprint-contract.mjs` are already gone; otherwise this Spec corrects them under rules 1 to 5.
- The [Workflow Canon Rework](../S-00P-workflow-canon-rework/SPEC.md) wrote the current corrective wording and is at its owner gate; this Spec does not reopen it and starts from the integration text.

## Vertical Implementation Slices

No Tasks cut. At Plan, use current Actuality to cut small complete-path slices. A likely order: the decision record narrowing the accepted records; the verdict path continuing a Task, with its tests and the `AGENTS.md`, Runbook and Lexicon lines that describe it; the retirement of the Wiki-claim corrective route with the new-Spec route for later gaps; then the template mirrors, the `to-tasks` skill and the Wiki. The empty tasks directory keeps this planned capability record-backed.

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

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

The ledger's earlier answers stay as history; marking them replaced belongs with the decision record. Renaming the corrective commands or the `complete` status is not proposed here.

## Supersession

- Supersedes: none
- Superseded by: none

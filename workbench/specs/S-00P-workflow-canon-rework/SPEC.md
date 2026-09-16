# S-00P - Workflow Canon Rework

**Spec ID:** S-00P
**Status:** active
**Priority:** 1
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-16
**Catalog description:** Rewrite `BLUEPRINT.md` now to describe every rung of the governing workflow and the full recursive Spec/Task loop, then rewrite AGENTS, RUNBOOK, LEXICON and the `templates/` mirror once S-00H, S-00I and S-00J make the commands they describe real, and reconcile ADR-000F, ADR-000G and ADR-000I.
**Blockers:** TK-002 onward wait on S-00H, S-00I and S-00J reaching `complete`; TK-001 is unblocked.
**Latest event:** Spec authored 2026-09-16 from directive-018 and the locked WF answers at revision 57; no implementation started.
**Next gate:** `claim S-00P` takes TK-001, the Blueprint rewrite. TK-002 waits on S-00H, S-00I and S-00J.

> **Citation anchors.** pre=`e3c5c8f343ec36d411bb6b9ea656e0f53c7406cb` post=`e3c5c8f343ec36d411bb6b9ea656e0f53c7406cb`.

## Outcome

Canon describes the workflow the owner settled, in two phases. First, now:
`BLUEPRINT.md` describes every rung (Idea -> Align through grilling ->
confirmed design concept -> Blueprint -> recursive Spec/Task delivery) and the
full recursive loop, including the intended nested branch topology, assembled-
Spec QA, corrective Tasks, owner Human QA on `integration`, reconciliation and
retirement, and the coordinator as future scope. Last, after S-00H, S-00I and
S-00J land: `AGENTS.md`, `RUNBOOK.md`, `LEXICON.md` and the generic
`templates/` mirror describe the same workflow using only commands and records
that exist, and ADR-000F, ADR-000G and ADR-000I are accepted, amended or
superseded so that no active decision record contradicts the locked answers.

## Why It Matters

The Blueprint carries no current status, release chronology or catalog, so
writing it against target state is honest today, and WF-12 (decision-082)
makes that rewrite mandatory for the rollout. The controls are different: they
are the cold-start Contract, and a control that names a command or record that
does not exist sends the next agent through a route that fails. The two phases
keep both truths: the destination is written first, and the operating
instructions change only when the runtime they describe is real.

## Current Verified State

At the pre anchor:

- `BLUEPRINT.md` has the eight headings `tools/test-blueprint-contract.mjs`
  requires of both the root and `templates/BLUEPRINT.md`. Its Desired Lifecycle
  says development "proceeds through bounded specifications, useful tests,
  implementation, owned documentation and independent review of the
  integration candidate". It names no Align rung, no design-concept exit, no
  Spec/Task altitudes, no assembled-Spec review, no Human QA surface, no
  retirement or reconciliation, and no coordinator. Its Integrated System
  Design says "stable Specs hold scoped delivery and proof" and "the Wiki
  supplies enduring context".
- `AGENTS.md` Work Selection And Lifecycle is an eight-step procedure over
  tickets embedded in Specs; its integration gate reviews an immutable
  candidate; its Git Rules already send every branch into `integration`; the
  dogfood boundary keeps declared Spec paths stable forever.
- `LEXICON.md` carries the `Task`, `Packet`, `Task receipt` and `Ticket` rows
  that landed with ADR-000H, each with a gap disclaimer naming S-00H; its
  `Spec` row still describes a stable capability record holding its own
  slices.
- ADR-000F, ADR-000G and ADR-000I are `proposed`. ADR-000G assigns the
  Blueprint "the future-facing PRD function for the product", which the locked
  WF-1 answer places in each Spec, and names the Explore, Prototype and
  Implement phase conditions as open. ADR-000F leaves the failure return path
  open, which WF-8C has since settled. ADR-000I clears `retired` "only after
  the exact change is verified on `main`" and ties clearing to the held
  FND-Q07/FND-Q08 gate, which WF-8E and WF-8F have since settled.
- The ignored draft `BLUEPRINT.workflow-promotion.md` under the promotion
  notepad folder is reusable input for TK-001. It adds a ninth heading,
  Governing Workflow, which the Blueprint contract test would reject, and it is
  working prose, not authority.

## Desired Behavior

1. A reader of `BLUEPRINT.md` can state every rung of the governing workflow,
   the three delivery altitudes (Blueprint as the product-level destination,
   Spec as one scoped objective with its own destination, Task as the counting
   that reaches or repairs it), and the full recursive loop from decision-082,
   including the intended nested branch topology and the coordinator as future
   scope, without any current status appearing in the file.
2. After phase two, `AGENTS.md` describes work selection and lifecycle on Task
   records, the reviewed unit as the assembled Spec, the corrective-Task return
   path, owner Human QA on `integration`, retirement after reconciliation, and
   the Git topology that is actually in force; `RUNBOOK.md` names only commands
   that exist; `LEXICON.md` defines Align, design concept, Spec, Task, retired,
   archive, assembled-Spec review and Human QA consistently; and the generic
   `templates/` mirror carries the same shape, `[BRACKETED]`.
3. The ADR register shows ADR-000F, ADR-000G and ADR-000I as accepted, amended
   or superseded, never `proposed`, and no active record contradicts a locked
   WF answer.

## Decisions And Contracts

The design this Spec promotes is the set of 19 locked WF answers in the WF
grilling note at revision 57, read with correction-023 and carried into the
Workbench by [S-00O](../S-00O-workbench-v4-0-0-release/SPEC.md). The note is
untracked working material named as origin, not durable evidence; this Spec
and the owners it rewrites become the durable record. The answers, as they
bind this Spec:

- **WF-1, WF-6, correction-023.** The Blueprint owns the product-level
  destination and user journey, like counting to 100. Each Spec is the
  PRD-shaped smaller destination derived from it, one scoped objective with its
  own destination, the next number to reach. Tasks do the counting. Stacked
  Specs realize the Blueprint journey. Spec creation is decided by scope and
  destination, not by Task count: a gap against an existing destination is
  corrective Task work even when several Tasks are needed; a distinct scoped
  objective warrants a new Spec. The Workbench Contract, not the Blueprint,
  owns instructions, authority, boundaries, language, process, completion,
  verification and currentness. The objected shorthand from correction-019 is
  not used.
- **WF-2, WF-3, WF-4.** An owner idea starts Align through grilling; Align ends
  when owner and agent explicitly confirm a shared design concept, which is
  then blueprinted. Research, brainstorming and wayfinding are allowed Align
  investigations to resolve a named uncertainty. A prototype is optional, not
  standard, sits after the Blueprint and before a Spec as a plausibility
  check, and its code may carry forward once it meets ordinary implementation
  and verification requirements.
- **WF-5.** Task replaces Ticket across prose, tools and new identifiers;
  existing identifiers are unchanged (ADR-000H, delivered by S-00H).
- **WF-7.** Intended topology: Spec branches from `integration`, Task branches
  from their Spec branch, preferably in separate worktrees, proven Task results
  accumulating in the Spec branch. During this rollout S-00O exemption 2
  defers it, so phase two describes the intended topology as destination in
  the Blueprint and the actually enforced route in the controls.
- **WF-8, WF-8B, WF-8C.** Tasks use red/green TDD, relevant tests, actual
  behavior checks and preserved proof; there is no per-Task independent-review
  ceremony. A separate context checks the assembled Spec and the combined Task
  results; a failed review diagnoses and creates corrective Tasks under the
  still-open Spec, then a fresh immutable candidate is reviewed. `integration`
  is the owner's Human QA surface.
- **WF-8D, WF-8E, WF-8F, WF-8A, WF-8G.** Completed Tasks are reconciled into
  the Spec, retired from ordinary discovery and their contained branches
  cleaned up. A Spec closes only after assembled-Spec review passes and owner
  Human QA on `integration` confirms the destination is there; no Git merge
  closes it. It is then reconciled into readable durable owners, the Wiki
  holding current capability knowledge, and retired; after the exact change is
  verified on `main`, transient Spec and Task records may be discarded, with
  Git preserving recoverable history. A later gap against the same destination
  is a corrective Task that updates the Wiki record and never resurrects
  `SPEC.md`. `TASK.md` owns active work state; the Taskboard projects it.
- **WF-9.** Delivery repeats recursively; failed Human QA returns to Align and
  the design-concept and delivery loop at the appropriate scope, without
  inferring that every defect proves the design concept wrong.
- **WF-10, WF-11, WF-12.** A coordinator is the intended parallel-work model
  and future Blueprint scope; the current proof target is consistent
  single-Task execution. Mission success is one full cycle on another
  workbench (owned by S-00O). Rollout scope is the full workflow plus this
  Blueprint rework, delivered through only the Specs needed to establish it.

**Phase rule.** TK-001 may land before any tool exists because the Blueprint
carries no current status. TK-002 onward may not land until S-00H, S-00I and
S-00J are `complete`, because the controls must describe only commands and
records that exist. The `AGENTS.md` stable-path rule is retired by S-00I
TK-004 in the same change that makes moves link-safe; TK-002 preserves that
change and does not re-retire it.

**ADR reconciliation.** TK-004 accepts, amends or supersedes ADR-000F,
ADR-000G and ADR-000I so each matches the locked answers above. The builder
chooses between amendment and supersession within those answers; the register
must end with none of the three `proposed`, ADR-000H's Packet member widened
for the corrective case WF-8A added (an amendment or successor record, since
accepted bodies are not rewritten), and every `canonicalized_in` owner named
by the records actually carrying the rule.

**Dogfood boundary.** TK-001 keeps the eight-heading contract shared with
`templates/BLUEPRINT.md`, so the generic template is untouched until TK-005.
The exemption is explained here: the rungs are this product's own destination
content and fit under the existing headings; the template's shape does not
change in phase one. TK-005 mirrors every control change into `templates/`,
generic and `[BRACKETED]`.

## Non-Goals

- Implementing `TASK.md`, folder lifecycle, the Spec QA gate or any command.
  Those are S-00H, S-00I and S-00J.
- Answering TT-Q10, confirming correction-019's wording, or reopening any
  locked WF question.
- Spec-branch tooling or the coordinator; the Blueprint describes both as
  intended, and later Specs deliver them.
- The v4.0.0 stamp, the Template gate and the WF-11 cycle; those are S-00O.
- Creating Wiki design-concept articles; the Blueprint is the destination
  owner, and Wiki articles remain optional owner-directed work.

## Dependencies And Blockers

TK-001 has no blocker. TK-002 waits on TK-001 and on S-00H, S-00I and S-00J
reaching `complete`; `claim` resolves whole completed Spec IDs, so the
dependency is expressed at Spec granularity. TK-003 and TK-004 wait on
TK-002; TK-005 waits on both.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Rewrite `BLUEPRINT.md` against every rung and the full recursive loop | ready | none | Red: a new assertion in `tools/test-blueprint-contract.mjs` that the root Blueprint names each rung and each loop stage fails at the pre anchor; green: the rewritten Blueprint passes it, keeps the eight headings, contains no current status, and `render` plus `doctor` are clean |
| TK-002 | Rewrite `AGENTS.md` to the Task-record workflow using only commands that exist | blocked | TK-001, S-00H, S-00I, S-00J | Red: a control-fidelity sweep that every backticked `spec-workbench.mjs` command in `AGENTS.md` exists in the CLI usage string and that no live control names `Ticket` or the embedded-row route fails at the pre anchor; green: the rewritten contract passes it and the guardrail audit does not fall |
| TK-003 | Rewrite `RUNBOOK.md` procedures for Task lifecycle, assembled-Spec review, corrective Tasks, Human QA closure, reconciliation and retirement | blocked | TK-002 | Red: the same command-existence sweep over `RUNBOOK.md` fails on a retired route; green: every named command runs as documented and the sweep passes |
| TK-004 | Rewrite `LEXICON.md` and reconcile ADR-000F, ADR-000G and ADR-000I | blocked | TK-002 | Red: `tools/test-adr.mjs` extended to assert none of the three records is `proposed` fails at the pre anchor; green: register regenerated, no active record contradicts a locked answer, Lexicon routes resolve |
| TK-005 | Mirror the reworked controls into `templates/` | blocked | TK-003, TK-004 | Red: `tools/evaluate-workbench.mjs --path templates --include-controls` or the fidelity sweep finds a template naming a retired route or a filled specific; green: templates generic and `[BRACKETED]`, fresh-room generation regression speaks the new workflow |

### TK-001 - Rewrite `BLUEPRINT.md` against every rung and the full recursive loop

**Stance:** Builder

Write the rungs from decision-067 and decision-082, the altitudes from WF-6
with correction-023, Align's start and exit from WF-2 with WF-3's allowed
investigations and WF-4's optional prototype placement, the intended branch
topology from WF-7, QA at each altitude from WF-8, WF-8B and WF-8C, the
lifecycle from WF-8D, WF-8E, WF-8F, WF-8A and WF-8G, the loop-back from WF-9,
and the coordinator as future scope from WF-10. Place them under the existing
headings: the journey under Desired Experience And Behavior, the altitudes and
artifact owners under Integrated System Design, the loop and retirement under
Desired Lifecycle. Keep the eight headings so `templates/BLUEPRINT.md` is
untouched. Write no current status, no release chronology, no catalog and no
exemption; the bootstrap exemptions are current state and live in S-00O. Do
not use the correction-019 shorthand. The ignored promotion draft is input to
reconcile against revision 57, not text to copy. The red test is the new
rung-and-stage assertion in `tools/test-blueprint-contract.mjs`; green also
requires `tools/evaluate-workbench.mjs --include-controls` to report no
contradiction.

### TK-002 - Rewrite `AGENTS.md` to the Task-record workflow using only commands that exist

**Stance:** Builder

Capture the guardrail baseline first. Rewrite Work Selection And Lifecycle
onto Task records and the commands S-00H delivered; state the reviewed unit as
the assembled Spec and the corrective-Task return path S-00J delivered; state
retirement after reconciliation and the folder lifecycle S-00I delivered;
state the Git topology actually in force, naming the nested Spec-branch
topology as the Blueprint's destination while S-00O exemption 2 holds.
Preserve the stable-path retirement S-00I TK-004 made. Every command named
must exist. The red test is the command-existence and retired-vocabulary
sweep at the control-fidelity seam; green also requires the after-score of the
guardrail audit and the remaining recommendations to be recorded, with no
criterion weakened.

### TK-003 - Rewrite `RUNBOOK.md` procedures

**Stance:** Builder

Replace the ticket lifecycle procedures with the Task lifecycle, add the
assembled-Spec review, corrective-Task creation, Human QA approval and
closure, reconciliation, retirement and discard procedures using the exact
commands S-00H, S-00I and S-00J shipped, and reconcile the Template Upgrade
Release Gate and self-drift sections. Run each documented command as the
green proof; the sweep is the red.

### TK-004 - Rewrite `LEXICON.md` and reconcile ADR-000F, ADR-000G and ADR-000I

**Stance:** Builder

Define Align, design concept, Spec as an objective with its own destination,
Task widened to work that reaches or repairs a destination including against
a reconciled Wiki record, `retired` and `archive` with their opposite
retentions, assembled-Spec review and Human QA, and remove the gap
disclaimers S-00H's completion made false. Reconcile the three proposed ADRs
as the Decisions section requires and regenerate the register. The red test
is the extended `tools/test-adr.mjs` assertion; green also requires the
Lexicon's Context Map routes to resolve.

### TK-005 - Mirror the reworked controls into `templates/`

**Stance:** Builder

Mirror every phase-two control change into the generic `templates/` copies,
including the Blueprint shape if TK-001 to TK-004 changed it, keeping them
copy-ready and `[BRACKETED]` with no specifics from this repository. Prove a
freshly generated room speaks the new workflow through the generation and
adoption regressions. Record any deliberate divergence between root and
template with its reason.

## Acceptance Criteria

- [ ] `BLUEPRINT.md` names every rung, the three altitudes, the full recursive loop, the intended topology, reconciliation and retirement, and the coordinator as future scope, with no current status, and passes the Blueprint contract test including its new rung assertion.
- [ ] `AGENTS.md`, `RUNBOOK.md` and `LEXICON.md` describe the Task-record workflow, the assembled-Spec review, the corrective-Task return path, Human QA closure, reconciliation and retirement, naming only commands and records that exist, proven by the command-existence sweep.
- [ ] No live control or template uses `Ticket` or the embedded-row route.
- [ ] ADR-000F, ADR-000G and ADR-000I are each accepted, amended or superseded, the register is regenerated, and no active record contradicts a locked WF answer.
- [ ] `templates/` mirrors the reworked controls, generic and `[BRACKETED]`, and a freshly generated room speaks the new workflow.
- [ ] The guardrail baseline is captured before phase two and the after-score recorded with no criterion weakened.
- [ ] The full verification suite passes and `doctor` is clean.

## Testing Seams

`tools/test-blueprint-contract.mjs` for the Blueprint; the control-fidelity
seam in `tools/test-control-fidelity.mjs` for the command-existence and
retired-vocabulary sweep; `tools/test-adr.mjs` and `workbench/tools/adr.mjs`
validation for the register; `tools/evaluate-workbench.mjs` with
`--include-controls`; `tools/test-genesis-from-decisions.mjs` and
`tools/test-workbench-adoption.mjs` for the generated-room regression; and
`tools/audit-guardrails.mjs` for the before and after score.

## Verification Procedure

Run the targeted test for the touched seam, then the full verification suite
named in `AGENTS.md`, then `node workbench/tools/spec-workbench.mjs doctor`.
Capture the guardrail baseline before TK-002 and record the after-score,
remaining recommendations and outcome limitation after TK-005. Each Task
lands as its own reviewed PR into `integration` under S-00O exemption 2.

## Documentation Impact

This Spec's deliverables are the documentation: `BLUEPRINT.md` in phase one;
`AGENTS.md`, `RUNBOOK.md`, `LEXICON.md`, `templates/` and the ADR register in
phase two. `README.md` orientation is reconciled in TK-003 where it names the
workflow. No other owner changes.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-16 | spec | Spec authored from directive-018, decision-082 and the locked WF answers at revision 57; no implementation performed | Read-only: Blueprint eight headings enforced for root and template by the contract test; ADR-000F, 000G and 000I proposed with the contradictions named above; promotion draft adds a ninth heading the test rejects | This Spec owns the Canon rewrite in two phases; S-00O owns the exemptions | TK-001 ready; phase two waits on S-00H, S-00I and S-00J |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

Spec-branch tooling and the coordinator are described as destination and
delivered by later Specs derived from the reworked Blueprint. Any Wiki
design-concept article remains optional owner-directed work.

## Supersession

- Supersedes: none.
- Superseded by: none.

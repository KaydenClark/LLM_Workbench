# S-00P - Workflow Canon Rework

**Spec ID:** S-00P
**Status:** active
**Priority:** 1
**Owner:** DISPATCHER
**Stance:** Builder
**Updated:** 2026-09-26
**Catalog description:** Rewrite `BLUEPRINT.md` now to describe every rung of the governing workflow and the full recursive Spec/Task loop, then rewrite AGENTS, RUNBOOK, LEXICON and the `templates/` mirror once S-00H, S-00I and S-00J make the commands they describe real, and reconcile ADR-000F, ADR-000G and ADR-000I.
**Blockers:** TK-002 onward wait on S-00I and S-00J; S-00J TK-01T will let TK-002 consume their reviewed integration delivery (`S-###:delivered`) instead of final `complete`. S-00H is complete and retired; TK-001 is done and landed.
**Latest event:** 2026-09-26 Lane H reconciled the owner-confirmed SCR answers onto current integration: the owner's arrow-and-brace map stays verbatim beside a labeled interpretation, Director/Dispatcher/Worker Lexicon rows land, and ADR-000F is accepted with its Human QA timing, closure order and direct-Task gate placement corrected from the unlanded e318f14 candidate.
**Next gate:** S-00J TK-01R/TK-01S/TK-01T and S-00I's feature-capture and continuous-demo Tasks reach reviewed integration delivery; TK-01T converts TK-002's blockers; then TK-002 (AGENTS), TK-003/TK-004, TK-005. No claim or closure is authorized by this planning packet.

> **Citation anchors.** pre=`e3c5c8f343ec36d411bb6b9ea656e0f53c7406cb` post=`f84b4691be7cd3abf7cdf719942ca6efaec0c617`.

## Outcome

Canon describes the workflow the owner settled, in two phases. First, now:
`BLUEPRINT.md` describes every rung (Idea -> Align through grilling ->
confirmed design concept -> Blueprint -> recursive Spec/Task delivery) and the
full recursive loop, including the intended nested branch topology, Task
review before Spec-branch merge, assembled-Spec QA, corrective Tasks, owner
Human QA on `integration`, reconciliation and
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
   records, Task review before Spec-branch merge, assembled-Spec QA, the
   corrective-Task return path, owner Human QA on `integration`, retirement
   after reconciliation, and
   the Git topology that is actually in force; `RUNBOOK.md` names only commands
   that exist; `LEXICON.md` defines Align, design concept, Spec, Task, retired,
   archive, assembled-Spec review and Human QA consistently; and the generic
   `templates/` mirror carries the same shape, `[BRACKETED]`.
3. The ADR register shows ADR-000F, ADR-000G and ADR-000I as accepted, amended
   or superseded, never `proposed`, and no active record contradicts a locked
   WF answer.

## September 26 Delivery Reconciliation

The current owner assignment establishes Director -> Dispatcher -> Worker
execution for this delivery. It supersedes the September 24 per-Task approval
wording below: Worker self-checks and reports; Dispatcher performs whole-Spec
QA; a separate Director context reviews the immutable assembled-Spec candidate.
Neither the Dispatcher nor a Task implementer supplies that Director approval.
The original evidence rows remain historical. Task packets preserve the
existing IDs and blockers; authoring a packet does not claim its execution.

Human QA timing is chosen by the owner at useful milestones, after enough
accumulated work, after exhausting Specs, for a valued Spec, or on an important
Director escalation. Version completion is not its only permitted trigger.
Observation or monitoring is not recorded approval. Owner-only promotion to
`main` remains unchanged. Closure order is S-00J's
[closure-capture transition contract](../S-00J-spec-qa-gate-at-integration/SPEC.md): reviewed delivery on integration,
owner approval, verification on `main`, then `complete`; features Wiki capture
follows `complete` at the closure point (not a precondition of it) and precedes
every transient-record cleanup. Current completion and retirement commands still implement the older
per-Spec approval mechanism; describe that gap explicitly until S-00J/S-00I
supply the corrected behavior. Do not invent commands or mark the gap delivered.

The pending SCR candidate `e318f144247d4288d2364f8103c78069d64aa919`
contains useful role/diagram changes but is not integrated or approved here.
Its version-only Human QA wording and closure ordering must be reconciled,
with a new immutable candidate and fresh Director review. Preserve source
arrow/brace notation and corrections; label prose interpretation separately.
Do not accept unresolved ADRs or infer answers from the candidate's changes.

**SCR reconciliation (2026-09-26).** The owner-confirmed SCR answers (SCR-1
to SCR-8, readback confirmed 2026-09-24) are promoted from a fresh candidate on
current integration rather than imported from e318f14. `BLUEPRINT.md` keeps
the owner's arrow-and-brace map verbatim with its provenance and reads it in a
separately labeled interpretation; `LEXICON.md` and `templates/LEXICON.md`
define Director, Dispatcher and Worker; accepted
[ADR-000F](../../docs/adr/000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md)
carries the gates and roles; the
[ledger](../../wiki/grilling-destination-audit-ledger.json) carries the SCR
rows. Three e318f14 placements were corrected, not imported: Human QA's
version cadence is the described default while the owner still chooses when to
QA and per-Spec content-bound approval (S-00J T1) stays; closure follows the
S-00J contract order above; and the Director's check of a direct Blueprint
Task on `integration` is labeled destination design, with `AGENTS.md`'s
separate-context review before integration remaining the operative gate until
TK-002 rewrites `AGENTS.md`. The `AGENTS.md`, `RUNBOOK.md` and template control
wording stays with TK-002, TK-003 and TK-005.

### Delivery prerequisites (repair planned in S-00J TK-01T)

The current resolver satisfies an S-ID blocker only for a `complete` or
`superseded` Spec; it cannot express reviewed integration delivery separately
from final closure. This is verified at
`git show 89d4042fb8931b9d720af75bffea1c28803d72aa:workbench/tools/spec-workbench.mjs`
(`satisfiedIds` and `completeSpec`). Removing I/J from TK-002 today would
bypass that gate. Keep all existing blocker fields. S-00J TK-01T adds the
content-bound `S-###:delivered` blocker (T0 of the contract) and converts
TK-002's S-00I/S-00J blockers to it in that same reviewed change; S-00O's
release blockers stay plain and keep requiring final `complete`.

Proposed sequence: S-00J supplies bound reviewed-delivery/closure semantics;
S-00I composes main verification, features capture and recovery with them;
S-00P rewrites controls against those verified commands; S-00O performs its
expanded release and real Template-upgrade proof. A prerequisite receipt must
identify the immutable candidate, relevant delivered capability/proof, separate
Director verdict and integration containment. An open or failed Human QA finding
must stay visible and must block any capability whose actual delivery it
invalidates. It must not be erased by a passing source review.

Recommend an explicit delivery prerequisite distinct from a completion
prerequisite, with missing/stale/uncontained/failed proof refusing selection
and claim. S-00J owns the exact supported representation and stable-seam tests;
this paragraph selects no new schema or CLI. Preserve existing completion
blocker behavior, owner approval and main-verification closure gates. S-00O
owns release scope/readiness and any change to its bootstrap exemptions.

Execution order remains TK-002 -> TK-003 and TK-004 -> TK-005. TK-002 needs
both the supported prerequisite repair and Director release of controls/test
paths. TK-004 additionally needs disposition of unresolved ADR decisions.
Shared projections, ledger, Wiki routers, manifest and IDs remain with the
Director or their released lane. This Dispatcher is the sole writer of this
Spec; Workers return one Task's proof at a time.

## Decisions And Contracts

The design this Spec promotes is the set of 19 locked WF answers in the WF
grilling note at revision 57, read with correction-023 and carried into the
Workbench by [S-00O](../S-00O-workbench-v4-0-0-release/SPEC.md). The note is
untracked working material named as origin, not durable evidence; this Spec
and the owners it rewrites become the durable record. The original answers below are preserved with their source lineage. Apply the
September 26 Delivery Reconciliation above wherever review timing, roles or
closure order supersedes this earlier wording:

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
- **WF-8, WF-8B, WF-8C, corrected 2026-09-24.** Tasks use red/green TDD,
  relevant tests, actual behavior checks and preserved proof. Each completed
  Task is reviewed before its branch joins the Spec branch. A separate context
  checks the assembled Spec and the combined Task results; a failed review
  diagnoses and creates corrective Tasks under the still-open Spec, then a
  fresh immutable candidate is reviewed. An approved Spec branch merges into
  `integration`, the owner's Human QA surface. The earlier no-per-Task-review
  answer is superseded by the owner's restored workflow map.
- **SCR-1 to SCR-8, 2026-09-24, readback confirmed.** A Task has no review or
  approval gate: its Worker self-checks and hands back, and the Dispatcher
  merges it for containment and chooses the next step. This supersedes the
  same-day per-Task review reading in the bullet above; the owner's source map
  keeps its "Review Task" step verbatim, read as that self-check and hand-back.
  The Dispatcher does or dispatches whole-Spec QA and owns it; the Director
  approves the assembled Spec in a separate context; neither the Dispatcher nor
  a Task implementer can approve. Director > Dispatcher > Worker are roles by
  responsibility, not branch; the owner is the human above the Director; no
  role works from `main`; the Director and its Dispatchers are the WF-10
  coordinator. A missed Task keeps its `TASK.md` as the record, its card
  returns to In progress, its worktree is removed and a new Task named for its
  objective fixes it. A direct Blueprint Task's route through `integration` is
  destination design under the operative pre-integration gate. Human QA's
  version cadence is the default; its timing, per-Spec approval and the
  closure order follow the September 26 reconciliation above. A Spec is about 1
  to 5 of the Blueprint's 100 and a Task about 0.1.
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
| TK-001 | Rewrite `BLUEPRINT.md` against every rung and the full recursive loop | done | none | Red: 31-claim rung-and-stage assertion in tools/test-blueprint-contract.mjs fails at pre anchor e3c5c8f with every claim unstated; green at 0c154b2; full suite 42/42 on the committed candidate; doctor no blocking finding; render no-op; evaluate-workbench --include-controls 113/113. Separate-context review (Claude Fable 5.1) PASS and SEMANTIC PASS on 2029876, two low findings (WF-8G discard gate, WF-8D branch cleanup) corrected in 0c154b2 and re-reviewed PASS and SEMANTIC PASS. Built by Claude Opus 5 from the lane handoff. Landed by PR #96; integration f84b469 contains 0c154b2 |

### TK-001 - Rewrite `BLUEPRINT.md` against every rung and the full recursive loop

**Stance:** Builder

Write the rungs from decision-067 and decision-082, the altitudes from WF-6
with correction-023, Align's start and exit from WF-2 with WF-3's allowed
investigations and WF-4's optional prototype placement, the intended branch
topology from WF-7, Task review and QA at each altitude from WF-8, WF-8B and
WF-8C, the lifecycle from WF-8D, WF-8E, WF-8F, WF-8A and WF-8G, the loop-back from WF-9,
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
must exist. S-00H TK-004 will already have removed the word `Ticket` from
the controls, so the red test is not a vocabulary sweep: it is an assertion
at the control-fidelity seam that Work Selection And Lifecycle names
`TASK.md` as the record `claim` takes and describes Task review before
Spec-branch merge, assembled-Spec QA and the corrective-Task return path.
`TASK.md`, `assembled Spec` and `corrective Task` occur zero times in
`AGENTS.md` at the pre anchor, and
S-00H TK-004 changes vocabulary only, so the assertion stays false until
this rewrite. Green also requires every backticked `spec-workbench.mjs` command
in the file to exist in the CLI usage string, and the after-score of the
guardrail audit and the remaining recommendations to be recorded, with no
criterion weakened.

### TK-003 - Rewrite `RUNBOOK.md` procedures

**Stance:** Builder

Replace the ticket lifecycle procedures with the Task lifecycle, add Task
review before Spec-branch merge, assembled-Spec QA, corrective-Task creation,
Human QA approval and closure, reconciliation, retirement and discard
procedures using the exact
commands S-00H, S-00I and S-00J shipped, and reconcile the Template Upgrade
Release Gate and self-drift sections. Reconcile `README.md` where it names
the workflow or a retired route. Run each documented command as the green
proof; the red is the same assertion applied to the RUNBOOK's Spec lifecycle
procedure, whose text names none of `TASK.md`, the assembled-Spec review or
corrective Tasks at the pre anchor.

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

- [x] `BLUEPRINT.md` names every rung, the three altitudes, the full recursive loop, the intended topology, reconciliation and retirement, and the coordinator as future scope, with no current status, and passes the Blueprint contract test including its new rung assertion.
- [ ] `AGENTS.md`, `RUNBOOK.md` and `LEXICON.md` describe the Task-record workflow, Task review before Spec-branch merge, assembled-Spec QA, the corrective-Task return path, Human QA closure, reconciliation and retirement, naming only commands and records that exist, proven by the command-existence sweep.
- [ ] S-00H's repository-wide `Ticket` sweep still passes after phase two, and no control or template instructs the embedded-row route; this verifies S-00H's result rather than owning it a second time.
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

For this planning packet, verify Task parsing, unchanged blocker enforcement,
source lineage and the full required suite; no runtime red/green result is
claimed. Implementation Tasks must supply their planned red/green proof.

Run the targeted test for the touched seam, then the full verification suite
named in `AGENTS.md`, then `node workbench/tools/spec-workbench.mjs doctor`.
Capture the guardrail baseline before TK-002 and record the after-score,
remaining recommendations and outcome limitation after TK-005. The current S-00O exemption remains a documented compatibility constraint
until its owner reconciles it. Workers hand back without a separate Task
approval ceremony; no integration merge occurs before the Director reviews
the assembled immutable candidate.

## Documentation Impact

This Spec's deliverables are the documentation: `BLUEPRINT.md` in phase one;
`AGENTS.md`, `RUNBOOK.md`, `LEXICON.md`, `templates/` and the ADR register in
phase two. `README.md` orientation is reconciled in TK-003 where it names the
workflow. No other owner changes.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-16 | spec | Spec authored from directive-018, decision-082 and the locked WF answers at revision 57; no implementation performed | Read-only: Blueprint eight headings enforced for root and template by the contract test; ADR-000F, 000G and 000I proposed with the contradictions named above; promotion draft adds a ninth heading the test rejects | This Spec owns the Canon rewrite in two phases; S-00O owns the exemptions | TK-001 ready; phase two waits on S-00H, S-00I and S-00J |
| 2026-09-17 | TK-001 | Ticket closed | Red: 31-claim rung-and-stage assertion in tools/test-blueprint-contract.mjs fails at pre anchor e3c5c8f with every claim unstated; green at 0c154b2; full suite 42/42 on the committed candidate; doctor no blocking finding; render no-op; evaluate-workbench --include-controls 113/113. Separate-context review (Claude Fable 5.1) PASS and SEMANTIC PASS on 2029876, two low findings (WF-8G discard gate, WF-8D branch cleanup) corrected in 0c154b2 and re-reviewed PASS and SEMANTIC PASS. Built by Claude Opus 5 from the lane handoff. Landed by PR #96; integration f84b469 contains 0c154b2 | BLUEPRINT.md rewritten (the deliverable); templates/BLUEPRINT.md untouched by design under the shared eight-heading contract; no other owner changed | The contract assertion is phrasing-coupled, not semantic proof; semantic fidelity rests on the separate-context review. A second candidate for this Task, origin/claude/S-00P-TK-001-blueprint-workflow-rework at a7e83c0 from a session the dispatcher did not start, satisfied the same acceptance and is left unmerged for the owner to delete. TK-002 onward stay blocked on S-00H, S-00I and S-00J |

| 2026-09-19 | S-00K | Corrected current blocker header and next gate | Verified S-00H retired complete at bc370fe; I/J remain unapproved | Removed resolved H from live blocker wording; historical dependency rows preserved | I/J repair and owner QA still required |

| 2026-09-23 | owner correction | S-00I/S-00J Human QA is already underway with failed reviews, not waiting for the owner to begin | Direct owner clarification on 2026-09-23; read current S-00I/S-00J gates and the 2026-09-19 failed approval audit | Corrected dependent next gate; earlier evidence preserved | TK-002 still waits for corrected I/J results, owner approval and completion |
| 2026-09-24 | owner workflow correction | Owner confirmed the original brace-and-arrow workflow as the desired framework and corrected the earlier no-per-Task-review answer; Genesis is setup followed by grilling, not the workflow entry | Direct owner statement and readback confirmation; Blueprint destination map updated in the same candidate | Current WF-8 contract and Blueprint map reconciled; historical evidence retained | Remaining skill-by-skill Align and delivery details are still being grilled; TK-002 gate remains unchanged |
| 2026-09-24 | independent review of `482dc6b` | Separate-context review found that phase-two acceptance omitted Task review and the map assertion could miss its removal | 48/48 AGENTS suite passed on clean `482dc6b`; reviewer reported P2 and P3, both corrected in the next candidate; the map test fails if `Review Task` is removed and passes when restored | Acceptance and test aligned with the owner correction | Fresh review and full-suite proof on the corrected candidate remain |
| 2026-09-24 | corrected workflow map `cb8ff78` | Owner-approved arrow-and-brace destination map, Task-review acceptance and focused regression checked together | 48/48 AGENTS suite passed on clean `cb8ff78`; separate-context full-branch review found no actionable issue; guardrail 78/100 before and after, with no criteria change; post self-drift returned `cleanUpdate: false` with seven existing attention findings and no new touched-owner contradiction | Blueprint, proposed ADR correction and this Spec aligned; generic template kept generic by design | No agent-outcome improvement claimed: repeated real trials, controls/prior/candidate comparison, recent outcome evidence and uncertainty remain missing; S-00Q stale claim and historical identity findings remain outside this correction |

| 2026-09-26 | Dispatcher planning | Expanded existing TK-002–005 execution packets under the current Director -> Dispatcher -> Worker assignment; preserved every blocker and Task identity. Proposed explicit delivery prerequisites separately from closure; no runtime or shared control mutation | Base 89d4042; immutable SCR review at e318f144247d4288d2364f8103c78069d64aa919 found timing, closure, direct-Task routing, notation-test and composition gaps; targeted candidate Blueprint/ADR/ledger tests pass but are not delivery approval. Planning-suite results are returned with the immutable candidate to Director | This Spec records current assignment and supersession; Workers author individual packets. Shared projections remain Director-owned | TK-002 still blocked; Director must coordinate J/I/O mechanism and release shared lanes, refresh projections, and review the resulting immutable candidate; no owner approval or main promotion inferred |
| 2026-09-26 | Lane H planning | Codex wave packets TK-002..TK-005 carried onto current integration and reworded so closure consumes S-00J's closure-capture transition contract: `complete` follows main verification; features capture follows `complete` and precedes transient cleanup. Delivery-prerequisite repair named as S-00J TK-01T; no blocker removed | Read WF-8E/WF-8H/WF-8F in the ledger and the SCR grilling decisions 009/011/012; render and doctor in the assembled tree | Planning only; Status and Blockers fields of TK-002..TK-005 unchanged; no control, template or runtime change |
| 2026-09-26 | review | Review verdict: pass at 7e7ed363d408c518ff035b2b1e2c38b5e3f948e3 [e8d98a166a58] #1 | none; TK-002..TK-005 closure wording consumes the S-00J closure-capture contract (complete after main verification, capture after complete and before cleanup), Status/Blockers unchanged, no edge removed, links resolve; full suite 48/48 on 7e7ed36, fresh-clone doctor clean | Codex CLI codex exec -s read-only -m gpt-5.5, separate context | 3 |
| 2026-09-26 | SCR reconciliation | Owner-confirmed SCR answers (SCR-1 to SCR-8, readback decision-012) promoted from a fresh candidate on integration `9ca103d` instead of importing unlanded `e318f14`: source map kept verbatim with provenance and a labeled interpretation; Director, Dispatcher and Worker rows; ADR-000F accepted; SCR ledger rows. Corrected, not imported: version-only Human QA (now the default cadence with owner-selected timing and per-Spec approval), closure before main verification (now the S-00J contract order), and the direct-Task Director check after integration (now labeled destination design under the operative pre-integration gate) | tools/test-blueprint-contract.mjs red on an in-memory brace-removal mutation the old keyword check accepted, green with the line-by-line structure check against the map at `482dc6b` plus arrow, indentation and loop-line mutations; test-adr re-counted on the composed corpus (accepted-ADR-to-Spec 22 files / 26 edges, intra-ADR 35 / 64); adr.mjs register regenerated and validate clean; test-grilling-ledger 5/5; guardrail 106.6/113 before and after, identical report; full suite on the committed candidate is in the Worker hand-back | BLUEPRINT.md Desired Lifecycle; LEXICON.md and templates/LEXICON.md; ADR-000F accepted, ADR-000G correction note and link; S-00J ADR-000F link and SCR promotion note; S-00P September 26 reconciliation and SCR decision bullet; TK-004 source path; grilling ledger SCR rows and FND-Q14, TT-Q4, WF-8B, E-2, E-4C notes | AGENTS.md, RUNBOOK.md and template controls still describe review of each integration candidate and name no Director, Dispatcher or Worker (TK-002, TK-003, TK-005); reconciling the direct-Task destination route with the pre-integration gate stays open (TK-004); ADR-000G and ADR-000I stay proposed; the board lanes still have no Spec; separate-context Director review of this candidate is pending |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

Spec-branch tooling and the coordinator are described as destination and
delivered by later Specs derived from the reworked Blueprint. Any Wiki
design-concept article remains optional owner-directed work.

## Supersession

- Supersedes: none.
- Superseded by: none.

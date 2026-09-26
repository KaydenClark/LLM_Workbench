# TK-01R - Expose unresolved durable Task decisions in Spec QA

**Task ID:** TK-01R
**Spec ID:** S-00J
**Slice:** Expose unresolved durable Task decisions in Spec QA
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: S-00J assembled-Spec QA detects unresolved durable Task decisions and refuses readiness and closure until their escalation is reconciled.
**Planned verification:** Red: an otherwise complete fixture Spec with a done Task carrying an explicit unescalated durable choice reports complete and passes its Spec-candidate gate; green: report names the Task and choice as a gap, gate refuses, and complete cannot bypass that gap using otherwise valid review and owner-approval rows. Repeat for a retired Task body and preserve S-00U binding and lifecycle regressions.

## Outcome

A Worker preserves execution-local choices in the Task body. A choice that is
durable escalates at close to its appropriate durable owner and remains a named
gap until reconciled. Dispatcher whole-Spec QA can detect an explicit remaining
durable-choice gap even when every Task is marked done. Both the Spec-candidate
gate and completion consume that gap.

Worker self-check and report remain sufficient at Task altitude; separate
Director review examines the immutable assembled Spec. No per-Task independent
approval ceremony or owner Human QA approval is manufactured.

## Authority And Source

The 2026-09-26 owner-directed Director -> Dispatcher -> Worker assignment
authorizes this missing Task packet. The Dispatcher maintains S-00J's accepted
requirements and evidence; this Task does not independently rewrite its Spec.

Read the following citations at the immutable base, not at a moving branch tip:

- `git show 89d4042fb8931b9d720af75bffea1c28803d72aa:workbench/wiki/grilling-destination-audit-ledger.json`, lines 7472-7508, FND-Q21C: execution-local choices belong in the Task body, not Receipt; durable choices escalate at close and remain gaps until then. The S-00H successor owns the body-section shape, S-00G owns the decision ownership rule, and S-00J owns QA refusal.
- `git show 89d4042fb8931b9d720af75bffea1c28803d72aa:workbench/wiki/grilling-destination-audit-ledger.json`, lines 8884-8920, TT-Q12: the evidence threshold before promotion remains open. FND-Q21C did not close all of TT-Q12. Neither a checked box, a link, nor the word locked independently proves promotion authority or approval.
- `git show 89d4042fb8931b9d720af75bffea1c28803d72aa:workbench/tools/spec-report.mjs`, lines 1012-1031: current gap collection checks status, acceptance, completion and evidence, without an explicit durable-choice escalation check.
- `git show 89d4042fb8931b9d720af75bffea1c28803d72aa:workbench/tools/spec-workbench.mjs`, lines 475-501 and 586-639: the Spec-candidate gate consumes report completeness, but completion separately checks review and approval; adding only a report gap would leave a completion bypass.

These sources support the semantic requirement. They do not accept a new
storage schema, settle TT-Q12's evidence threshold or accept proposed ADRs.

## Released Lane And Disposed Interface

Lane H (the S-00J Dispatcher, under the 2026-09-26 owner instruction relayed
by the Claude Director) released this Task's write lane on 2026-09-26 and
disposed the narrow body interface below so implementation does not wait on
S-00G's whole ownership schema. The S-00G owner may later replace the shape
through its own reviewed change; this Task consumes only this minimum.

- A Task body may carry a `## Decisions` section. Either it contains the single
  line `None.` (an explicit no-durable-choice declaration) or a table
  `| Choice | Scope | Disposition | Durable owner |`, where Scope is
  `task-local` or `durable`, Disposition is `unresolved` or `reconciled`, and
  Durable owner names the owning artifact path or route (required when Scope
  is `durable`).
- A `durable` + `unresolved` row is a named gap in the Spec report, and the
  Spec-candidate gate and `complete` refuse it. `durable` + `reconciled` with
  a Durable owner clears the gap and keeps its route; a `reconciled` row
  without an owner route stays a gap. `task-local` rows never gap.
- A Task without the section is legacy: the report states decision coverage
  as unknown for that Task, informationally, and it is neither a gap nor a
  verified reconciliation. Historical Task bytes are not rewritten.
- The section is substantive Task content: it stays inside the committed
  content digest. No new shared parser, OWNERSHIP.json or ADR is introduced.

Blockers is none and Status is ready, so `claim` can select it. TK-01S and
TK-01T follow serially in the same runtime lane.

## Acceptance And Stable Verification Seam

- An otherwise complete Spec containing an explicit unescalated durable choice
  reports incomplete; report output identifies its Task, choice and remaining
  escalation gap without making the report command a mutating operation.
- Live and retired Task bodies receive equivalent explicit-choice coverage.
- Reconciliation through the agreed interface removes the matching gap while
  retaining its source and durable-owner route; it does not independently
  prove approval or settle TT-Q12's open evidence threshold.
- Spec-candidate gate and complete refuse that unresolved gap even with
  otherwise valid bound review and owner-approval evidence.
- Substantive decision-body changes invalidate the content digest; Receipt and
  evidence appends retain only their existing narrow exclusions.
- Preserve S-00U committed/local live and retired Task digest equality, declared
  integration ancestry, rejection or disregard of historically mismatched
  approval, premerge review without owner QA, administrative completion
  stability, and retired substantive-proof binding. Do not broaden exclusions
  to hide a new substantive decision field.
- Preserve Worker self-check/report, Dispatcher whole-Spec QA, Director
  separate immutable assembled-Spec review, owner-led Human QA and owner-only
  main promotion. Existing Task-PR behavior is not redesigned by this Task.

Use `assembleSpecReport`, `gate` and `completeSpec` through fixture tests in
`tools/test-spec-report.mjs`. Start with one otherwise complete fixture whose
done Task explicitly carries an unresolved durable choice, observe the expected
failure, and implement the smallest fix. Exercise a retired Task, the resolved
case, digest invalidation and refusal without writes. Passing structural checks
does not replace review of whether a claimed reconciliation is supported.

## Intended Change Paths And Write Ownership

After Director lane release, the implementation Worker may change only:

- `workbench/tools/spec-report.mjs` for consumed decision data and gaps;
- `workbench/tools/spec-workbench.mjs` for completion enforcement of the same gap;
- `tools/test-spec-report.mjs` for targeted red/green and regression coverage.

The Dispatcher alone maintains this Task and
`workbench/specs/S-00J-spec-qa-gate-at-integration/SPEC.md`. Shared projections
stay with the Director. Any shared Task-reader or format change belongs to the
coordinated S-00H successor lane and requires an explicit write release.

Operational documentation follow-up is requested through the S-00P shared lane
at `RUNBOOK.md` and `templates/RUNBOOK.md`: explain the agreed Task-body input,
legacy coverage limits, informational report, and gate/complete refusal. Those
paths are not this Task's write lane. Preserve generic template wording and
record the coordinated documentation proof before delivery is called complete.

## Execution Proof And Exit

Capture guardrail and read-only self-drift baselines before runtime changes.
Record actual targeted red then green output, run affected branch/lifecycle
checks and the full required verification suite, and capture post-change
guardrail/self-drift receipts. Keep S-00U regression proof intact.

Return exact candidate SHA, changed paths, actual checks, documentation status
and remaining limitations to the Dispatcher. Dispatcher reviews the assembled
Spec; the Director separately reviews its immutable candidate before
integration. This packet supplies no implementation proof, real approval,
closure, lifecycle move or main promotion.

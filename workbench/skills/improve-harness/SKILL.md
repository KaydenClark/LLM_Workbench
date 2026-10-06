---
name: improve-harness
description: Improve one harnessed job in a room through one loop - baseline, earliest gap, smallest owning intervention, native verification, fresh rerun, then retain, revise or remove - and leave a result record in the feedback lane. Use when a job went badly and the harness may be the cause, when harness feedback arrives, or when a harness change must be shown to be an improvement rather than a taste.
---

# Improve Harness

Harness engineering improves what agents produce by shaping the environment
around a fixed model and agent: the context it can reach, the tools it can
call, the boundaries it works inside and the feedback that proves its work.
This skill is the one procedure for improving that environment around one
observed job. It runs one loop:

> baseline -> earliest gap -> smallest owning intervention -> native
> verification -> fresh rerun -> retain, revise or remove

The loop's shape follows Ryan Lopopolo's improve-harness playbook (CC BY 4.0,
linked and attributed on the LLM Workbench Wiki's harness engineering lineage
page); this skill is written in the Workbench's own words and copies nothing.
It replaces a family of review stages with one pass that either closes the job
under the observed conditions or names the next missing boundary. Comparative,
causal or longitudinal claims need the room's evaluation procedures, not this
loop.

## Purpose

Take one bounded, representative job that a fixed worker ran in this room,
find the earliest point where the harness failed it, make the smallest change
at the owner that can shape future runs, prove the change through the room's
own checks and a fresh rerun, and then decide whether the change earns its
carrying cost. The durable result is a better environment and its evidence,
not another harness component.

## Method

Read before changing. Every step until the fourth is read-only: the baseline
and the gap are established from the room's controls, source, tests, records
and the job's trajectory with non-mutating checks only, and a change to
Actuality happens only inside the authority the current request and
`AGENTS.md` grant. Read each claim by the Governance Plane it plays in this
operation: Canon (the binding current-state rule), Grounding (evidence about
whether the work was done correctly), Actuality (the target as it is) and
Enduring Context (durable reference). A control that says a thing is not
proof the thing happened, and a passing check is not proof the worker was
expected to attach it.

Choose a job small enough to rerun and important enough to exercise the
suspected gap. A whole-repository audit, a multi-quarter program or an open
mandate to make agents better is too wide; narrow it to one job first. Keep
the room's truth with its owner: the loop records how to reach that truth and
never builds a private corpus or fixture that can agree with itself while the
room drifts.

## Obligations

Never widen permissions, redefine the job's accepted outcome, weaken a check
so a run passes, or promote a worker's uncorroborated self-report into a rule.
When the intervention is outside the request's authority, stop after the third
step with the evidence, the proposed owner, the intervention, its proof plan
and its expected effect recorded, and hand that back. Record the lesson in
the room's append-only feedback record and route accepted follow-up work to
its owning Spec; a result record is evidence, never a work assignment or an
approval. One pass supports a bounded claim about one job under the observed
conditions; it does not isolate the mechanism, estimate a general effect or
rule out chance.

## Completion

The loop is complete when the result record below is written with every
field filled or marked unknown, the decision (retain, revise or remove) names
its owner, evidence and reconsideration condition, the feedback record carries
the lesson, and any follow-up is in its Spec. Nothing here records owner
approval or a release.

## Job Contract

Write the conditions down before touching the harness, so the baseline and the
rerun are comparable:

```text
Target and revision:
Relevant external state:
Fixed model and agent configuration:
Representative job:
Accepted outcome:
Evidence that proves the outcome:
Authority envelope and approval boundary:
Budget and stop conditions:
Suspected harness gap:
```

**Artifact:** the filled job contract, kept with the result record.

## 1. Observe The Baseline

Run the job through a fresh trajectory when a run is safe and authorized;
when a new run would be consequential, inspect a recent run whose target
state, worker and outcome are known. Record what was observable, not a
summary alone: whether the accepted outcome was reached; which proof the
worker produced; which context was available, retrieved and relevant; which
capabilities were found, invoked and read correctly; where a person relayed a
fact, tool output, a decomposition or a recovery; retries, elapsed time,
abandoned paths and avoidable review cycles; authority friction or access the
job should not have had; and risks and carrying costs the harness already
holds. Keep a missing capability apart from poor discovery, a missing fact
apart from poor routing, and a worker limitation apart from an environmental
gap. The baseline is one trajectory through this room, not a verdict on the
model.

**Artifact:** the baseline evidence, as observations with their sources.

## 2. Locate The Earliest Gap

Find the first point where the trajectory lacked what the job required, then
trace the symptom upstream until one owner can shape future runs. Name the
gap's kind so the route is clear: context (absent, stale, overloaded or never
retrieved); capability (unavailable, or failed in discovery, selection,
invocation, interpretation, repair or real-system verification); ownership
(several representations competed, or nothing owned the invariant);
authority (capability and permission conflated, excessive, or missing an
approval, audit or recovery boundary); proof (a check established an internal
proxy while the real claim stayed untested); feedback or delivery (an accepted
lesson, an artifact's identity, a release step or a maintenance condition did
not survive the run); or worker limitation. One failed trajectory never
establishes a worker limitation: leave it an open candidate until repeated,
comparable evidence separates it from chance and from unresolved
environmental gaps. Resolve the owning decision from the room's own controls,
records and Wiki before reaching for outside guidance, and import no other
repository's layout, fixtures, policies or pins in place of local ownership.

**Artifact:** the earliest failed handoff, its kind and its one owner.

## 3. State The Smallest Owning Intervention

Name the smallest reversible change at the earliest owner and write its
expected behavior before making it:

```text
If <intervention> is added at <owner>, then the fixed worker will
<observable change> on <representative job>, because <mechanism>.

Evidence that would support this:
Evidence that would weaken this:
Expected carrying cost and its owner:
```

Prefer a change that removes a human relay or makes an invariant legible at
its source: a shorter entry route, a canonical example, a typed boundary, an
actionable diagnostic, a domain tool, an authority gate, a real-system test,
or a procedure with explicit state and recovery. New machinery must earn its
maintenance cost against the observed failure. When the intervention is
outside the request's authority, stop here and hand back the record so far.

**Artifact:** the written hypothesis, with its supporting and weakening
evidence named.

## 4. Verify Through The Target's Native Checks

Confirm the authority to change, then make the intervention through the
room's normal workflow: its branch rules, its Spec and Task records, its
red/green practice and its documentation owners. Keep the diff narrow enough
that the hypothesis stays intelligible. Verify two layers: the room's own
checks that protect its internal contracts, and the user or operational
journey that establishes the accepted outcome. Collect the evidence the
worker is expected to produce in ordinary operation; a check only an
evaluator can run diagnoses the result but does not stand in for that proof.
Remove a downstream control only when the new upstream owner makes it
redundant and the room's evidence supports the removal.

**Artifact:** the committed change and the named checks run on it, with their
results.

## 5. Rerun On A Fresh Trajectory

Rerun the same class of job with the same model, agent configuration and
authority envelope and a materially equivalent external state, in a fresh
session from an isolated, equivalent starting state that preserves unrelated
work, so the rerun inherits no hidden help from the conversation that made
the change. Confirm the intervention was available, retrieved or invoked, and
relevant: a good outcome says nothing about an instruction or tool the run
never used. Compare the rerun with the baseline on separate dimensions:
accepted outcome and claim-matched proof; human relay, steering and review
convergence; elapsed time and retries; authority and recovery behavior; new
failure modes or displaced complexity; and ongoing maintenance and latency
cost.

**Artifact:** the rerun evidence and its dimension-by-dimension comparison
with the baseline.

## 6. Retain, Revise Or Remove

Retain the intervention provisionally when the fresh run closed the job, the
intervention was actually used, the evidence fits the hypothesized mechanism
and the apparent gain justifies the carrying cost. Revise it when the gap was
located correctly but the interface is still hard to retrieve or use. When the
room's existing material may already supply the behavior, withhold the
intervention and rerun before deciding. Remove it when it adds noise,
duplicates a better owner or repeatedly fails to improve the job. Record the
decision where the room keeps its history: the owner, the evidence, any
follow-up case and the condition under which the intervention is reconsidered
or retired.

**Artifact:** the recorded decision, naming its owner, evidence and
reconsideration condition.

## Result Record

Preserve one compact record per pass in the room's feedback lane, in the
report format that lane declares when it has one, and otherwise in this shape:

```text
Job and accepted outcome:
Target revision and external state:
Fixed worker and authority envelope:

Baseline evidence:
Earliest failed handoff and owner:
Intervention and expected mechanism:
Verification performed:
Fresh-rerun evidence:

Outcome comparison:
Proof comparison:
Human-relay and latency comparison:
Risk and carrying-cost comparison:
Test-without evidence, if run:

Decision: retain | revise | remove
Durable owner and recorded lesson:
Follow-up or retirement condition:
Known limits:
```

The record is evidence about one loop. It neither repairs anything by itself
nor authorizes a repair, and it claims no agent-outcome improvement beyond the
job and conditions it observed; repeated conditions, environment parity and
condition-blind grading belong to the room's evaluation procedures.

## Taking In Feedback

Harness feedback is the loop's entry. A row in the room's append-only feedback
record, a downstream room's return channel, a review finding or a dogfooding
observation names an observed job and a suspected gap: take it as the job
contract's seed, run the loop on it, and write the lesson back into that
record so the row moves from new to landed or declined with its reason. Triage
accepted follow-up into its owning Spec rather than a new store. The lane that
harvests feedback from many rooms, validates a candidate against its evaluation
conditions and ships a new harness version keeps those steps with its own
evaluation procedures; this loop supplies the per-job evidence they consume.

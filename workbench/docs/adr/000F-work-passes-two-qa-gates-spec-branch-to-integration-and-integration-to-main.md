---
date: 2026-09-12
canonicalized_in:
  - BLUEPRINT.md
  - LEXICON.md
  - AGENTS.md
  - RUNBOOK.md
---

# Work passes two QA gates: spec branch to integration and integration to main

QA is two gates at two boundaries, held by two different parties. Neither
destination-level gate sits on a single Task. This repository's current
Task-PR integration boundary is separately governed by S-00O bootstrap exemption 2
and [AGENTS](../../../AGENTS.md#git-rules), not a normal Task approval ceremony.

The **Spec QA gate** runs from the Spec branch into `integration`. When every
Task in a Spec has been handed back, the Spec's Dispatcher verifies the whole
Spec against its destination and the combined results of its Tasks, doing that
QA itself or dispatching it and owning the result. The Director then approves
the immutable assembled candidate in a separate context before it combines
into `integration`. The Dispatcher, and every agent that implemented a Task in
the candidate, cannot give that approval. Passing lets the Spec branch merge
into `integration`. Failing is diagnostic: each finding is corrected under
the still-open Spec, by the same Task continuing with an adjusted handoff
unless the fix rewrites it, then a fresh candidate. The gate is a step in the
harness's own merge-preparation workflow, not GitHub-enforced branch
protection. On the board, Needs review holds an assembled Spec waiting for the
Director's approval, and Complete holds approved work waiting for closure.

**No Task has a separate destination-level review or approval gate.** A Task is one attempt at one step.
Its Worker self-checks that its claims are valid and backed by proof before
handing back, and the Dispatcher reads the report and chooses the next step.
Merging a Task is coordination and containment, not QA. The missed-Task destination model never silently reopens completed
proof: its `TASK.md` stays the record until the Spec is cleaned up into the features Wiki,
with its earlier proof preserved as written, its card returns to In progress and its worktree
is removed. The same Task continues with an adjusted handoff; only when the fix changes
the Task enough that it has to be rewritten does a new Task named for its objective fix it. Board/card and automatic worktree cleanup in this model
remain destination design; they do not authorize deletion of uncontained work.

The **Human QA gate** runs from `integration` into `main` and belongs to the
owner, who is the human above the Director and not the Director. Its normal
cadence follows the Director's approval of the version's Specs, or the
Director's escalation of their blockers, and ends in the owner-only merge into
`main`. That cadence is the described default, not the only permitted time:
the owner chooses when to QA, whether at a useful milestone, for one valued
Spec or on an important escalation. Approval stays a per-Spec, content-bound
owner record; monitoring, observations and passing reviews never approve a
Spec, and an approval never covers a Spec it does not name. What Human QA
consists of is each project's own choice; the default is the owner's approval
of the merge into `main`. In this repository it is the owner monitoring the
process, asking the Director questions and starting the next steps, alongside
that recorded approval. No command approves a whole version at once. A failed Human QA result returns
to Align and the design-concept/delivery loop at the appropriate scope (WF-9);
a defect does not by itself show that the design concept is wrong. Preserve
failed findings until their owning corrective work resolves them.

No Git merge closes a Spec. Closure follows the order in the
[closure-capture transition contract](../../specs/S-00J-spec-qa-gate-at-integration/SPEC.md):
reviewed delivery on `integration`, owner approval, verification of the
approved change on `main`, then `complete`, then features Wiki capture at that
closure point, then retirement, then discard of the transient records. Specs and Tasks are
delivery scaffolding under
[ADR-000A](000A-active-adr-decisions-and-destination-blueprints.md): their useful
content reaches durable documentation, while the implemented result supplies
the delivered behavior. Keeping the old packet is unnecessary once those
destinations and the existing closure/discard gates are satisfied. This does
not mark unchecked historical acceptance complete or bypass owner approval.

**Direct Blueprint Tasks: destination design.** A Task that advances the
Blueprint directly has no Spec. As the owner answered it, its Dispatcher sends
the Worker from `integration`, verifies the result and merges it for
containment, and the Director checks it on `integration`; no role works from
`main`. That route is the destination design. It does not replace or bypass the
operative gate: every candidate, including any future direct Task, must pass
[AGENTS](../../../AGENTS.md#git-rules)'s separate-context review before branches
combine into `integration`. AGENTS now carries the Director/Dispatcher/Worker
roles and current Task-PR bootstrap exception. A direct Blueprint Task home
and a post-integration substitute approval are not delivered or authorized by
this destination description. The accepted role route and the operative
pre-integration safety boundary remain distinct.

Considered and rejected: a review or approval gate on each Task, or on each
grouped slice of Tasks. A Task is deliberately too small to demonstrate a
Spec's destination, so such a gate can pass repeatedly while the destination
stays unmet, and a second check on every step slows the run without checking
the thing that matters. The owner's framing was to run to the destination the
Spec sets, then check that it was reached.

Considered and rejected: making the Director's approval and Human QA one act.
The Director is a role an agent is meant to hold; folding the two together
would quietly remove the owner from the gate as soon as an agent takes it.

Considered and rejected: fixing Human QA to a single mandatory trigger, either
each Spec as it arrives on `integration` or only the completion of a whole
version. The owner described the version cadence as how he envisions the
built Workbench running, and he also chooses his own review points; neither
reading may remove the other.

Consequences: extends
[ADR-0037](0037-independent-review-at-integration.md), whose separate-context
review of the immutable candidate before branches combine at `integration`
remains the operative gate for every candidate; the Director's approval of an
assembled Spec is that review. The terminal verification in
[ADR-000G](000G-blueprint-spec-and-task-are-three-altitudes-of-one-delivery-chain.md)
reads through these gates. AGENTS implements the current roles and
pre-integration route after S-00P TK-002. RUNBOOK carries the delivered
Task-record workflow procedures from S-00P TK-003. The board lanes themselves belong to proposed
[ADR-000E](proposed/000E-the-frontier-is-the-active-landscape-and-taskboard-renders-it.md)
and its separately assigned board delivery work; this reconciliation does not
claim that the destination lanes are implemented.

Provenance: foundation answer FND-Q14 (2026-09-11, corrected 2026-09-12) set
the two gates. The roles, the Task rule, the direct-Task route and the version
cadence come from the owner's separate-context review boundary grilling, SCR-1
to SCR-8, on 2026-09-24, whose full readback the owner confirmed the same day
with "yes, this looks good. Lets promote." The owner-selected Human QA timing
comes from the 2026-09-26 Director assignment recorded in S-00J and S-00P, and
the closure order from S-00J's contract. The grilling notes are untracked
working material named as origin, not durable evidence; their questions and
answers are recorded in the
[grilling destination audit ledger](../../wiki/grilling-destination-audit-ledger.json).
The SCR answers replace the "not batched by release" clause FND-Q14 carried
with the version cadence as default, not as a mandate.

## Promotion status

The owner approved promotion on 2026-09-24. The first promotion candidate
(`e318f14`, never landed) placed Human QA only after a whole version, closed
and captured a Spec before main verification, and put the Director's check of
a direct Task after `integration` in place of the operative gate. This record
was moved out of `proposed/` on 2026-09-26 with those three placements
corrected as above; the owner's answers themselves are unchanged.

## Current operational reconciliation

[S-00P](../../specs/S-00P-workflow-canon-rework/SPEC.md) TK-004 amends the same decision under ADR-000A's amendment-first rule.
The earlier "until TK-002 rewrites AGENTS" and "controls do not yet name the
roles" claims read at `git show 5d743b4fda292ad772d2505aa3732c83d719fa81:workbench/docs/adr/000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md`; TK-002
reviewed delivery has resolved AGENTS' gap. This correction preserves the
original two-gate rationale, owner-confirmed SCR role chain, owner-only main
promotion, flexible Human QA and direct-Task destination design. It records no
owner approval or whole-Spec completion.

TK-004C reconciles the earlier pending Runbook consequence, preserved at
`git show 3b5b76bfd62aa98118cb73cc4947e0658f4040c6:workbench/docs/adr/000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md`.
TK-003's reviewed delivery proof in the linked S-00P
records PR #241 and candidate `3b82f6ab5fc5e90a60963405698806d16b915963`,
contained in integration `66815b4e4d0a35802d28c3a470921c00692f8d0d`.
The [Runbook lifecycle procedures](../../../RUNBOOK.md#spec-lifecycle-and-retrieval)
now carry that delivery. This resolves the procedure-documentation gap;
owner Human QA, main promotion and whole-Spec closure remain separate gates.

The corrective-work Spec ([S-004F](../../specs/S-004F-corrective-work-rules/SPEC.md)) amends the two places above that
made every finding a new corrective Task, under ADR-000A's amendment-first rule.
The earlier text reads at `git show f91bfd72f41c4b471f1756781649375abb68d158:workbench/docs/adr/000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md`. The owner's answer, recorded
in [the same-Task destination decision](../ddr/000Y-a-miss-found-by-a-check-continues-the-same-task-unless-the-fix-rewrites-it.md), is that a miss found by a check
continues the same Task with an adjusted handoff unless the fix rewrites it. The
two gates, the Director's separate-context review, flexible Human QA and the
closure order are unchanged. This records no owner approval.

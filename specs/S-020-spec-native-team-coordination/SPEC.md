# S-020 - Spec-Native Team Coordination

> Generated from LLM Workbench v2.3. Stable path
> `specs/S-020-spec-native-team-coordination/SPEC.md`; never move between status folders.

**Spec ID:** S-020
**Status:** active
**Priority:** 2
**Owner:** claude
**Updated:** 2026-07-19
**Catalog description:** Modernize the optional small-team templates so parallel roles coordinate through one owning spec and one durable writer.
**Blockers:** none
**Latest event:** TK-001 claimed by claude.
**Next gate:** Close TK-001 with verification and documentation proof.

## Outcome

A bounded Captain-led team can partition independent work, invoke one role per
task, prevent overlapping durable writes, and consolidate proof into the owning
stable spec without creating a second live Taskboard or proof ledger.

## Why It Matters

The optional `team templates/` predate v2.3. They currently instruct agents to
maintain a second shared Taskboard, let subagents append proof there, and later
copy that proof into a project Taskboard proof log. That contradicts the current
stable-spec lifecycle and can create exactly the duplicate truth and writer
collisions the Workbench now prevents.

## Current Verified State

- Root `AGENTS.md` requires non-overlapping lanes, one durable writer per shared
  spec/file lane, one role invocation per task, and spec-owned evidence.
- `team templates/MANAGER.md`, `SUBAGENT.md`, and `TASKBOARD.md` still describe
  the retired root-Taskboard proof-log model.
- README currently lists the files as supporting material; this planning pass
  marks them legacy pending S-020 rather than silently presenting them as v2.3.
- No focused test currently prevents the old coordination model from returning.

## Desired Behavior

- Captain reads the assigned spec, partitions the maximum safe independent
  tasks, and assigns exactly one approved role contract per task.
- Open lanes have disjoint durable write ownership; research can run in parallel,
  but one primary writer updates the owning spec and generated projection.
- Subagents return evidence in chat or an explicitly temporary run artifact;
  they do not create a second canonical queue or append competing spec proof.
- Captain verifies each result, updates the owning spec once, renders Taskboard,
  runs project verification, and checkpoints the integrated result.
- The optional templates clearly state their bounded scale and defer to the
  nearest project controls and role contracts.

## Decisions And Contracts

- Stable specs remain the only capability, ticket, and proof store.
- Generated `TASKBOARD.md` remains a read-only projection for coordination views.
- One role invocation is one task; Planner, Engineer, Scout, and Auditor
  authorities are not combined implicitly.
- One durable writer owns each repository/spec/shared-file lane at a time.
- Temporary coordination notes, if used, are disposable and never become a
  parallel project tracker.

## Non-Goals

- Building a distributed queue, lock service, heartbeat system, or hosted orchestrator.
- Allowing Scout or Auditor to edit project state.
- Replacing product-specific controls or the current role contracts.

## Dependencies And Blockers

- [S-001](../S-001-progressive-disclosure/SPEC.md) defines spec ownership and hot projection.
- Root/project role contracts remain external operating inputs, not copied truth.

## Vertical Implementation Slices

Tickets are temporary tracer bullets within this stable capability record.

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Rewrite the manager template around Captain, roles, one owning spec, and one writer | in-progress | none | pending |
| TK-002 | Rewrite subagent and temporary coordination guidance to remove parallel durable proof | blocked | TK-001 | pending |
| TK-003 | Add a regression contract for role separation, disjoint lanes, and spec-owned evidence | blocked | TK-002 | pending |
| TK-004 | Prove a two-lane bounded team demo and consolidate one durable checkpoint | blocked | TK-003 | pending |

### Scoped Ticket: TK-001

**Vertical slice:** Update only the optional manager-facing template and its
README description so a Captain decomposes one assigned spec into disjoint role
tasks and reserves one primary durable writer, while leaving subagent/template
mechanics to TK-002.

**Done criteria:**

- The manager template uses Captain and existing role contracts without copying them.
- The assigned spec is the only ticket/proof owner and Taskboard is a generated projection.
- The template explicitly reserves one writer for each shared spec/file lane.
- Existing project authority, verification, docs ownership, and Git rules win.
- Targeted text checks, evaluator, full Runbook suite, render, doctor, and diff check pass.

**Required proof:** A before/after stale-contract scan plus current full verification;
no team execution or runtime tooling change in this ticket.

### Scoped Ticket: TK-002

**Vertical outcome:** Replace subagent and temporary coordination guidance so
role tasks return evidence to Captain without writing a second durable queue or
proof ledger.

**Done criteria:** Each task names one role, one bounded objective, read/edit
scope, immutable inputs, verification, docs impact, and return format; Scout and
Auditor remain read-only; only the reserved primary writer updates the owning
spec and generated projection; temporary notes are explicitly disposable.

**Required proof:** Stale-language scan turns green, fixture tasks demonstrate
write-lane rejection, evaluator and full Runbook suite pass, render and doctor
remain clean. No owner gate.

### Scoped Ticket: TK-003

**Vertical outcome:** Add a focused regression contract that prevents the
duplicate Taskboard/proof-log model and role-authority collapse from returning.

**Done criteria:** The test fails on the current legacy templates, then requires
Captain routing, one role per task, disjoint durable lanes, stable spec ownership,
generated Taskboard, read-only Scout/Auditor, and one primary writer.

**Required proof:** Named red/green test, evaluator, guardrail audit, complete
Runbook verification, render, doctor, and diff check. No owner gate.

### Scoped Ticket: TK-004

**Vertical outcome:** Demonstrate two independent role lanes against a disposable
fixture and consolidate their results into one durable spec checkpoint.

**Done criteria:** Captain assigns non-overlapping paths; each role returns named
proof without editing shared state; Captain verifies results, updates the spec once,
renders Taskboard, and runs full verification; an intentionally overlapping lane
is sequenced or rejected rather than raced.

**Required proof:** Under-one-minute demo artifact, role handoffs, final spec diff,
targeted and full verification, and a remotely recoverable checkpoint. No owner
gate unless the chosen demo would touch an external project or paid service.

## Acceptance Criteria

- [ ] Optional team guidance uses Captain and one approved role per task.
- [ ] Parallel lanes have disjoint durable write ownership.
- [ ] Specs own tickets and evidence; Taskboard remains generated.
- [ ] Scout and Auditor remain read-only; Planner does not implement.
- [ ] One bounded two-lane demonstration produces one integrated proof checkpoint.
- [ ] Regression checks fail on the retired duplicate Taskboard/proof-log model.

## Testing Seams

- Static scan of optional team templates for retired proof-log and duplicate-board language.
- Contract test for role separation, spec ownership, and one durable writer.
- Temporary two-lane fixture with deliberately overlapping paths that must be sequenced.

## Verification Procedure

```bash
rg -n 'root `TASKBOARD\.md` proof log|subagents append proof|transcribes' 'team templates'
node tools/test-evaluate-workbench.mjs
node tools/spec-workbench.mjs doctor
```

Then run the complete verification suite in `RUNBOOK.md`.

## Documentation Impact

- Optional team templates and README own their public coordination guidance.
- Root/project AGENTS and role files remain authoritative and are linked, not duplicated.
- This spec owns modernization decisions, tickets, acceptance, and proof.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-07-17 | canon harvest | Classified the optional team templates as live-source contradiction and created the modernization work packet | Stale-contract scan confirmed duplicate Taskboard and proof-log language; current evaluator, render, doctor, and complete Runbook checks inspected | Added S-020; README and team-template headers mark the current files legacy pending replacement | TK-001 through TK-004 remain |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Until S-020 completes, do not copy `team templates/` into a v2.3 project.

## Supersession

- Supersedes: the pre-v2.3 coordination contract when complete.
- Superseded by: none

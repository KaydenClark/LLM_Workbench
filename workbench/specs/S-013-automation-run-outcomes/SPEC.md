# S-013 - Standardized Automation Run Outcomes

**Spec ID:** S-013
**Status:** complete
**Priority:** 0
**Owner:** codex
**Updated:** 2026-07-16
**Catalog description:** Give scheduled Workbench runs a fail-closed JSON outcome and verified-idle streak contract.
**Blockers:** none
**Latest event:** Spec completed and removed from the hot board.
**Next gate:** none

## Outcome

Every Workbench automation run can emit one normalized JSON outcome using only
`actionable`, `worked`, `idle`, `owner_gate`, `collision`, or
`infrastructure_error`, without confusing a failed or overlapping run for a
verified no-work result.

## Why It Matters

An automation that treats a held lock, live overlap, owner gate, expired
authentication, or provider failure as idle can pause useful work without ever
proving the queue was empty. The idle streak must reflect completed canonical
discovery, not absence of progress for any reason.

## Current Verified State

S-006 provides canonical feedback discovery plus pass, deny, and blocked gate
decisions, but it has no shared run-level result or idle-streak transition.
Scheduler definitions are owned by GPT_OS rather than tracked in this
repository.

## Desired Behavior

The feedback automation helper validates one of six categories, requires a
non-empty reason, requires explicit verification for `idle`, and returns JSON
with the next idle count and pause recommendation. Verified idle increments;
`actionable` and `worked` reset; interruption categories preserve the prior
count.

## Decisions And Contracts

- Categories are exactly `actionable`, `worked`, `idle`, `owner_gate`,
  `collision`, and `infrastructure_error`.
- `idle` is accepted only with `verifiedIdle: true`; unknown or unverified
  results fail closed instead of becoming idle.
- Only verified idle increments `idleCount`. `actionable` and `worked` reset it
  to zero. `owner_gate`, `collision`, and `infrastructure_error` preserve it.
- A second consecutive verified idle result sets `pauseRecommended: true`.
- Lock-held and live-overlap results are collisions. Owner approval or action is
  an owner gate. Authentication, provider, network, and runtime failures are
  infrastructure errors unless owner action is explicitly the gate.
- S-006 pass, deny, and blocked decision objects remain unchanged; this
  contract adds run accounting rather than replacing gate evidence.

## Non-Goals

- Editing or activating scheduler TOMLs.
- Changing credentials, provider configuration, or GitHub permissions.
- Merging any branch or PR.
- Changing the S-006 discovery, pass, deny, or blocked policy.

## Dependencies And Blockers

- [S-006](../S-006-feedback-automation/SPEC.md) complete.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Add the pure run-outcome transition and JSON CLI seam | done | none | Targeted red/green; complete tracked Runbook suite; root self-test 113; templates 106.6/113; live guardrail 78/100; held-out grader, render, doctor, and diff check passed |

## Acceptance Criteria

- [x] The helper accepts exactly six normalized run categories and rejects unknown categories.
- [x] Only explicit verified idle increments the idle count and recommends pause on the second consecutive verified idle result.
- [x] Actionable or worked resets the idle count; collision, owner gate, and infrastructure error preserve it.
- [x] Lock-held, live-overlap, authentication, and provider-failure examples cannot increment idle evidence.
- [x] Existing S-006 pass, deny, and blocked decision tests remain unchanged and green.
- [x] The CLI emits the normalized run outcome as JSON from an input file.
- [x] Tracked docs describe the contract and route scheduler-definition changes to GPT_OS ownership.
- [x] Targeted and full Workbench verification, static evaluation, guardrail audit, doctor, and diff check pass.

## Testing Seams

- Pure run-outcome input objects with literal expected transitions.
- `feedback-automation.mjs run-outcome --input FILE` stdout JSON.
- Existing S-006 decision-object assertions for pass, deny, and blocked.

## Verification Procedure

```bash
node tools/test-feedback-automation.mjs
```

Then run the complete suite from `RUNBOOK.md`, the live guardrail audit,
`node tools/spec-workbench.mjs render`, doctor, and `git diff --check`.

## Documentation Impact

- `README.md` owns the public category and JSON-output summary.
- `RUNBOOK.md` owns the exact command, state-transition rules, and scheduler
  ownership boundary.
- This spec owns requirements, decisions, proof, and limitations.
- No generic template changes: this is Workbench Factory automation tooling,
  not a downstream project harness rule.
- `Scheduled/workbench-v1-rollout` is not tracked in this repository; its
  integration remains GPT_OS root-owned and is deliberately out of this slice.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-07-16 | TK-001 red | Added pure-transition and CLI JSON assertions before the interface existed | `node tools/test-feedback-automation.mjs` failed because `classifyRunOutcome` was not exported | Owning docs identified | Implement the minimum interface and complete verification |
| 2026-07-16 | TK-001 review | Two-axis review found a contradictory completed blocker, an unclear transition name, loose reason validation, ambiguous worked wording, and missing interruption pause assertions | Follow-up test failed red on the reason contract, then targeted test, doctor, and diff check passed after corrections | S-013 and RUNBOOK corrected; generated Taskboard rerendered | Final lifecycle close |
| 2026-07-16 | TK-001 | Ticket closed | Targeted red/green; complete tracked Runbook suite; root self-test 113; templates 106.6/113; live guardrail 78/100; held-out grader, render, doctor, and diff check passed | Updated README.md, RUNBOOK.md, S-013, Blueprint catalog, and generated Taskboard; templates exempt because this is Factory automation tooling; GPT_OS owns the untracked scheduler adapter | GPT_OS scheduler adapter must consume this contract in its owning task |
| 2026-07-16 | spec | Spec completed | Acceptance gates satisfied | Documentation impact recorded above | none |

## Completion Result

Pass. Workbench now emits a fail-closed, normalized JSON run outcome and carries
verified-idle evidence without turning collisions, owner gates, or
infrastructure failures into false idle results. Existing S-006 decision
semantics remain unchanged. No scheduler definitions, credentials, provider
configuration, or protected branches were touched, and no agent-outcome
improvement is claimed.

## Remaining Limitations Or Follow-Up Specs

- GPT_OS owns the scheduler adapter that consumes this output and any persisted
  automation definition; this repository provides the portable decision seam.

## Supersession

- Supersedes: S-006's implicit automation run-accounting semantics only; S-006
  discovery and pass, deny, and blocked gate behavior remain authoritative.
- Superseded by: none

# S-002 - Held-Out Second-Domain Evaluation

**Spec ID:** S-002
**Status:** planned
**Priority:** 1
**Owner:** unassigned
**Updated:** 2026-07-12
**Catalog description:** Add a condition-blind held-out task before spending on repeated c0/c1/c2/c3 outcome trials.
**Blockers:** none
**Latest event:** Migrated from the former T-017 ready row as future capability work.
**Next gate:** Refine acceptance and activate under a separate request.

## Outcome

The outcome framework includes a deterministic held-out task in a second domain
and can support later repeated comparisons without tuning only to development
fixtures.

## Why It Matters

The guardrail audit reserves all 30 outcome-evidence points because the current
harness has one development task and no real repeated-agent result.

## Current Verified State

One development task exists; no held-out task or real result exists.

## Desired Behavior

Add a second-domain held-out fixture and condition-blind grader that distinguish
correct, incomplete, and dishonest outcomes.

## Decisions And Contracts

- Real comparison runs require owner approval for API spend.

## Non-Goals

- Claiming Workbench v2.3 improves agent outcomes.

## Dependencies And Blockers

- none

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Define held-out task and grader seam | deferred | none | pending |

## Acceptance Criteria

- [ ] Held-out fixture and grader self-test pass.

## Testing Seams

- Deterministic correct, incomplete, and dishonest fixture outputs.

## Verification Procedure

```bash
python3 evals/results/_make_selftest.py
```

## Documentation Impact

- Evals documentation and this spec evidence.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Real repeated trials remain a later owner-approved spec.

## Supersession

- Supersedes: former TASKBOARD T-017 only as future-work routing
- Superseded by: none

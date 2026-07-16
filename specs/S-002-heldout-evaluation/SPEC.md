# S-002 - Held-Out Second-Domain Evaluation

**Spec ID:** S-002
**Status:** complete
**Priority:** 1
**Owner:** codex
**Updated:** 2026-07-13
**Catalog description:** Add a condition-blind held-out task before spending on repeated c0/c1/c2/c3 outcome trials.
**Blockers:** none
**Latest event:** Held-out path-safety fixture and condition-blind grader completed.
**Next gate:** none

## Outcome

The outcome framework includes a deterministic held-out task in a second domain
and can support later repeated comparisons without tuning only to development
fixtures.

## Why It Matters

The guardrail audit reserves all 30 outcome-evidence points because the current
harness has one development task and no real repeated-agent result.

## Current Verified State

One development task and one held-out security/path-handling task exist. No real
repeated-agent result exists yet.

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
| TK-001 | Define held-out task and grader seam | done | none | Correct/incomplete/dishonest self-test passes |

## Acceptance Criteria

- [x] Held-out fixture and grader self-test pass.

## Testing Seams

- Deterministic correct, incomplete, and dishonest fixture outputs.

## Verification Procedure

```bash
python3 evals/tasks/task_b_path_safety/test_grade.py
```

## Documentation Impact

- Evals documentation and this spec evidence.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-07-13 | TK-001 red | Held-out task directory and grader did not exist | `python3 evals/tasks/task_b_path_safety/test_grade.py` failed on missing fixture | Evals docs identified | Add fixture, canonical tests, grader, and self-test cases |
| 2026-07-13 | TK-001 green | Added held-out path-safety domain | Self-test discriminates correct, incomplete, and dishonest outcomes | Updated evals README and runbook | Real repeated trials remain separate |
| 2026-07-13 | spec | Spec completed | Held-out grader self-test passes | Documentation impact recorded above | none |

## Completion Result

Pass. A deterministic held-out task now covers a second, security-oriented
domain without claiming real agent-outcome improvement.

## Remaining Limitations Or Follow-Up Specs

- Real repeated trials remain candidate-specific and consume the separately
  approved feedback-gate budget.

## Supersession

- Supersedes: former TASKBOARD T-017 only as future-work routing
- Superseded by: none

# S-004 - Safe Direct Claim

**Spec ID:** S-004
**Status:** complete
**Priority:** 0
**Owner:** codex
**Updated:** 2026-07-12
**Catalog description:** Prevent direct claim calls from bypassing a ticket's declared blockers.
**Blockers:** none
**Latest event:** Spec completed and removed from the hot board.
**Next gate:** none

## Outcome

`claim S-###` enforces the same completed-spec and completed-local-ticket blocker
rules as `next`, so callers cannot bypass dependencies by invoking it directly.

## Why It Matters

Safe claiming is part of the lifecycle contract and must fail closed even when a
caller skips the selector command.

## Current Verified State

The new fixture initially failed because direct claim selected the first ready
row without evaluating its blocker.

## Desired Behavior

Direct claim rejects a ready ticket whose blocker is not satisfied and claims it
only after the blocker is complete.

## Decisions And Contracts

- Spec IDs and completed local ticket IDs may satisfy blockers.

## Non-Goals

- Dependency graph scheduling beyond the documented comma-separated IDs.

## Dependencies And Blockers

- none

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Enforce blocker checks in direct claim | done | none | Blocked direct-claim fixture and existing lifecycle tests pass |

## Acceptance Criteria

- [x] Direct claim fails closed on an unsatisfied blocker.
- [x] Existing lifecycle behavior remains green.

## Testing Seams

- Temporary spec with a ready ticket blocked by missing `S-999`.

## Verification Procedure

```bash
node tools/test-spec-workbench.mjs
node tools/spec-workbench.mjs doctor
```

## Documentation Impact

- Docs checked; no update needed because S-001 already documents safe claiming
  and this follow-up corrects the implementation to match that contract.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-07-12 | TK-001 red | Direct claim bypassed missing S-999 blocker | Expected `assert.throws` failed | Docs checked; no update needed | Enforce blocker parity with next |
| 2026-07-12 | TK-001 green | Direct claim now filters eligible ready tickets | `node tools/test-spec-workbench.mjs` pass | Docs checked; no update needed | Final full suite |
| 2026-07-12 | TK-001 | Ticket closed | Blocked direct-claim fixture and existing lifecycle tests pass | Docs checked; no update needed because S-001 already owns the safe-claim contract | none |
| 2026-07-12 | spec | Spec completed | Acceptance gates satisfied | Documentation impact recorded above | none |

## Completion Result

Pass. Direct claims now fail closed on unsatisfied dependencies.

## Remaining Limitations Or Follow-Up Specs

- none

## Supersession

- Supersedes: none
- Superseded by: none

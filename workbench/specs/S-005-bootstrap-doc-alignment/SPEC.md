# S-005 - Bootstrap Documentation Alignment

**Spec ID:** S-005
**Status:** complete
**Priority:** 0
**Owner:** codex
**Updated:** 2026-07-12
**Catalog description:** Remove stale four-control-doc and Taskboard-proof wording from bootstrap and adoption guidance.
**Blockers:** none
**Latest event:** Spec completed and removed from the hot board.
**Next gate:** none

## Outcome

README, Genesis, and Adoption consistently route capability proof to stable specs
and describe AGENTS plus progressive disclosure as the governing flow.

## Why It Matters

Leaving old bootstrap language would recreate the monolithic Taskboard contract
in new downstream projects.

## Current Verified State

Five live phrases still said “four control docs” or “proof-log row.”

## Desired Behavior

All live bootstrap/adoption guidance uses the v2.3 ownership contract.

## Decisions And Contracts

- Cold v2.2 archives remain unchanged.

## Non-Goals

- Rewriting unrelated bootstrap procedure.

## Dependencies And Blockers

- none

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Align legacy ownership phrases | done | none | Legacy ownership scan clean; evaluator and doctor pass |

## Acceptance Criteria

- [x] Live README/Genesis/Adoption contain no old four-doc or Taskboard-proof contract.
- [x] Evaluator and doctor remain green.

## Testing Seams

- Targeted text scan plus static evaluator.

## Verification Procedure

```bash
rg -n 'four control|proof-log row' README.md templates/GENESIS.md templates/ADOPTION.md
node tools/test-evaluate-workbench.mjs
node tools/spec-workbench.mjs doctor
```

## Documentation Impact

- README, templates/GENESIS.md, and templates/ADOPTION.md.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-07-12 | TK-001 | Final drift scan found legacy phrases | Five matches in live docs | Owning docs identified | Align wording |
| 2026-07-12 | TK-001 | Ticket closed | Legacy ownership scan clean; evaluator and doctor pass | Aligned README, GENESIS, and ADOPTION wording | none |
| 2026-07-12 | spec | Spec completed | Acceptance gates satisfied | Documentation impact recorded above | none |

## Completion Result

Pass. Live bootstrap/adoption wording now matches the v2.3 spec-centered model.

## Remaining Limitations Or Follow-Up Specs

- none

## Supersession

- Supersedes: none
- Superseded by: none

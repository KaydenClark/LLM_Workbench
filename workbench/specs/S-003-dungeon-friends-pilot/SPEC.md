# S-003 - Prospective Dungeon Friends Pilot

**Spec ID:** S-003
**Status:** planned
**Priority:** 9
**Owner:** unassigned
**Updated:** 2026-07-12
**Catalog description:** Evaluate v2.3 progressive disclosure in Dungeon Friends only after separate owner authorization.
**Blockers:** S-001
**Latest event:** Future pilot recorded without touching Dungeon Friends.
**Next gate:** Obtain separate authorization and define a prospective comparison.

## Outcome

Test the proven Workbench lifecycle prospectively in Dungeon Friends without
rewriting its historical task records.

## Why It Matters

A complex downstream project is the right later validation surface, not the
first migration target.

## Current Verified State

Dungeon Friends was not inspected or modified during S-001.

## Desired Behavior

Define a bounded prospective pilot after v2.3 is reviewable and the owner opts in.

## Decisions And Contracts

- Separate authorization is mandatory before reading or changing the project.

## Non-Goals

- Any Dungeon Friends work during S-001.

## Dependencies And Blockers

- S-001 complete
- owner authorization

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Design the prospective pilot | deferred | S-001 | pending |

## Acceptance Criteria

- [ ] Owner approves a bounded pilot and acceptance method.

## Testing Seams

- To be defined after authorization.

## Verification Procedure

```bash
# Defined by the future authorized pilot.
```

## Documentation Impact

- Future pilot spec only.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Entire pilot remains intentionally unstarted.

## Supersession

- Supersedes: none
- Superseded by: none

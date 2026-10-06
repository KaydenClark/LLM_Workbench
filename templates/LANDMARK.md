# LMK-[###] - [LANDMARK_TITLE]

> Generated from LLM Workbench v[HARNESS_VERSION]. Copy this file to
> `workbench/landmarks/LMK-[###]-[slug]/LANDMARK.md`. A landmark is the
> artifact one size above a Spec: its child Specs nest in the landmark
> folder's `specs` subfolder and its direct Tasks in its `tasks` subfolder
> beside this file, so one path carries every parent.
> Lifecycle moves use the link-safe move operations, never a manual folder move.

**Landmark ID:** LMK-[###]
**Status:** planned
**Priority:** [0-9]
**Owner:** [owner]
**Updated:** [YYYY-MM-DD]
**Catalog description:** [One sentence for the landmark catalog.]
**Blockers:** none
**Latest event:** Landmark captured.
**Next gate:** Activate the first child Spec or direct Task.

> `Status` is one of `planned`, `active` or `reached`; the lifecycle folder,
> not a status, says a landmark is retired. `Blockers` is `none` or a
> comma-separated list of Spec, Task or landmark identifiers (`S-`, `TK-`,
> `LMK-`); prose goes in the body, never in that field. `Owner` is
> `unassigned` until a Director holds the lane.

## Direction

[Where this landmark points: the destination it moves the product toward and the direction every child Spec and direct Task takes to get there.]

## Why It Matters

[Why this direction is worth holding now, and what stays unresolved without it.]

## What Success Looks Like

The reached checks. The landmark is `reached` only when every box is ticked
against what has landed on the integration branch.

- [ ] [what success looks like]

## Decision Records

The decision records under this landmark, one line each, linked to their
record. Each decision record belongs to exactly one landmark.

- [Decision record title](../../docs/ddr/[###]-[slug].md)

## Child Specs

The Specs nested in this landmark's `specs` subfolder, one line each, linked
to the Spec. A Spec has at most one parent landmark.

- none

## Direct Tasks

The Tasks nested in this landmark's `tasks` subfolder, one line each, linked
to the Task record. Each keeps its own pull-request review.

- none

## Verification Procedure

```bash
[TARGETED_COMMAND]
[FULL_COMMAND]
```

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|

## Reached Result

Pending.

## Supersession

- Supersedes: none
- Superseded by: none

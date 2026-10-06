# LMK-001A - Durable Plans

**Landmark ID:** LMK-001A
**Status:** planned
**Priority:** 5
**Owner:** unassigned
**Updated:** 2026-10-06
**Catalog description:** Landmarks, Specs and Tasks carry a plan across sessions, agents and providers without a human relay.
**Blockers:** none
**Latest event:** Landmark authored from its Destination Question Card and the twelve-directions decision record.
**Next gate:** Activate the first child Spec or direct Task.

## Direction

**The owner's direction.** On 2026-10-05 the owner named this direction as one of twelve harness-engineering landmarks, recorded in [The twelve harness-engineering directions are landmarks](../../docs/ddr/001H-the-twelve-harness-engineering-directions-are-landmarks.md). In his words, as that decision record captures them: "These are not the only landmarks, they should just be landmarks, they are good directions." And on why these come first: "I feel like these are much better defined than what we would of made. It gives us real expectations."

The decision record filed under this landmark carries his words on the Runbook: "It would just be a very simple basically workflow verb step by step. like Idea -> Align -> Confirm. Not defining the verbs, but lining them up next to their senario they are used in?"

**The card's question.** The Destination Question Card for this direction, [Durable Plans (DQC-006R)](../../landmark-tracker/destination-questions/DQC-006R.json), captured at Confirm, asks: "How do landmarks, Specs and Tasks carry a plan across sessions, agents and providers without a human relay?" Its answer, confirmation and expected result are still empty, and it records which landmark records fold in and what the reached check is as open.

**The agent's reading.** Not an owner statement: this direction points toward a Workbench where a plan lives in its records (landmark, Spec, Task, handoff and the views generated from them), each carrying the destination, current state, next gate and evidence, so any session on any agent or provider can pick it up where the last one left it.

## Why It Matters

The agent's reading, not an owner statement. A plan held in one session's context ends with that session. Without durable plans the owner becomes the relay between sessions and providers, re-explaining where work stands each time it changes hands.

## What Success Looks Like

The reached checks. The landmark is `reached` only when every box is ticked against what has landed on the integration branch.

These checks are the agent's reading of the card's question, drafted when the landmark was authored. The card still records its reached check as open, so they stand until the owner's answer on the card confirms or replaces them.

- [ ] A landmark, its child Specs and their Tasks each carry their destination, current state, next gate and evidence in the repository.
- [ ] A fresh session on a different agent or provider resumes a plan from those records and the handoff that points into them, with no human relaying context.
- [ ] Lifecycle moves keep every link to a plan's records correct, so a plan stays reachable as it advances and after it completes.

## Decision Records

The decision records whose `Landmark:` line names this landmark, one line each, linked to their record. Each decision record belongs to exactly one landmark.

- [The Runbook lines the workflow verbs up next to their scenarios and binds nothing](../../docs/ddr/001D-the-runbook-lines-the-workflow-verbs-up-next-to-their-scenarios-and-binds-nothing.md)

## Folds In

The JSON landmark records this direction absorbs, for [Landmark Record Migration And Tracker Regrouping](../../specs/S-004A-landmark-record-migration-and-tracker-regrouping/SPEC.md) to read as one mapping. Each of the 24 JSON landmark records, from GitHub Coordination (LMK-000A) to Landmark Tracker (LMK-000X), is mapped exactly once across the twelve directions; the records that fold into none of them are listed once, under "Held at the Blueprint" in [Repo is the System of Record (LMK-000Y)](../LMK-000Y-repo-is-the-system-of-record/LANDMARK.md).

The mapping is the agent's reading, not an owner decision. The owner expected overlap ("I exepect the overlap", 2026-10-05) and the card leaves which records fold in open, so a record that overlaps several directions is placed under the one its summary most directly serves, and the overlap is named.

- [Handoffs landmark record (LMK-000P)](../../landmark-tracker/landmarks/LMK-000P.json): its summary, "A receiving agent can continue one objective from readable context, boundaries, evidence and a concrete next action", is a plan crossing from one agent to the next.
- [Notepads landmark record (LMK-000S)](../../landmark-tracker/landmarks/LMK-000S.json): working sessions preserving "useful reasoning and corrections" is how a plan's context survives between sessions before it reaches a durable owner.
- [Taskboard landmark record (LMK-000Q)](../../landmark-tracker/landmarks/LMK-000Q.json): seeing "implementation work, dependencies, readiness, blockers and review needs" is the plan's generated view.
- [Landmark Tracker landmark record (LMK-000X)](../../landmark-tracker/landmarks/LMK-000X.json): cards and landmarks that "maintain evolving understanding" carry the plan above the Spec.

## Child Specs

The Specs nested in this landmark's `specs` subfolder, one line each, linked to the Spec. A Spec has at most one parent landmark.

- none

## Direct Tasks

The Tasks nested in this landmark's `tasks` subfolder, one line each, linked to the Task record. Each keeps its own pull-request review.

- none

## Verification Procedure

```bash
node workbench/tools/landmark-artifact.mjs validate LMK-001A
node workbench/tools/spec-workbench.mjs report LMK-001A
```

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-06 | Twelve-landmark authoring (TK-008K) | Authored by the twelve-landmark authoring Task (TK-008K) of LANDMARK.md Artifact And Lane Runtime (S-003Z) from the Durable Plans Destination Question Card (DQC-006R) and the twelve-directions decision record (DDR-001H), with Status planned and Owner unassigned. Priority 5 is a uniform placeholder: the owner has not ordered the twelve. | The landmark validator and doctor (no malformed-landmark, no unstable-path) before commit; render, the append-only check and the full suite on the committed candidate are recorded in the Task record. | Docs checked; no update needed: the harness-engineering lineage Wiki page already names the twelve directions and still validates, and Runbook, Lexicon and Wiki documentation of the landmark runtime belongs to its own Task. | The reached checks and the Folds In mapping are the agent's reading until the card is answered; no child Spec or direct Task yet. |

## Reached Result

Pending.

## Supersession

- Supersedes: none
- Superseded by: none

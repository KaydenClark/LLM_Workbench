# LMK-001J - Autonomous Execution

**Landmark ID:** LMK-001J
**Status:** planned
**Priority:** 5
**Owner:** unassigned
**Updated:** 2026-10-06
**Catalog description:** Humans steer and agents execute a Task end to end, and a fix to Task execution points back here.
**Blockers:** none
**Latest event:** Landmark authored from its Destination Question Card and the twelve-directions decision record.
**Next gate:** Activate the first child Spec or direct Task.

## Direction

**The owner's direction.** On 2026-10-05 the owner named this direction as one of twelve harness-engineering landmarks, recorded in [The twelve harness-engineering directions are landmarks](../../docs/ddr/001H-the-twelve-harness-engineering-directions-are-landmarks.md). In his words, as that decision record captures them: "These are not the only landmarks, they should just be landmarks, they are good directions." And on why these come first: "I feel like these are much better defined than what we would of made. It gives us real expectations."

On this twelfth direction (2026-10-05, as the twelve-directions decision record captures it): "We can call the landmark Autonomous Execution. But, since its a destination we are heading towards for 'humans to steer, and agents to execute', and it was a destination we made along the way, lets add it. That way we also have a defined landmark to point back to when we need to fix the Task Execution."

**The card's question.** The Destination Question Card for this direction, [Autonomous Execution (DQC-007A)](../../landmark-tracker/destination-questions/DQC-007A.json), captured at Confirm, asks: "What has to hold for humans to steer and agents to execute a Task end to end, and what does a Task execution fix point back to?" Its answer, confirmation and expected result are still empty, and it records which landmark records fold in and what the reached check is as open.

**The agent's reading.** Not an owner statement: this direction points toward a Workbench where an authorized Task runs from selection to landed result without a human relay, the human's part is steering (direction and genuine decisions), and when Task execution breaks, the fix names this landmark as the direction it restores.

## Why It Matters

The agent's reading, not an owner statement. Execution that needs a human at each step is assisted work, not delegation. Without a defined direction for Task execution, fixes to it scatter across Specs with no shared destination to measure them against.

## What Success Looks Like

The reached checks. The landmark is `reached` only when every box is ticked against what has landed on the integration branch.

These checks are the agent's reading of the card's question, drafted when the landmark was authored. The card still records its reached check as open, so they stand until the owner's answer on the card confirms or replaces them.

- [ ] An agent selects, claims, implements, verifies, records and lands an authorized Task end to end without a human relay.
- [ ] The human's part is steering: setting direction and answering genuine decisions, not coordinating execution steps.
- [ ] A fix to Task execution names this landmark as the direction it points back to.

## Decision Records

The decision records whose `Landmark:` line names this landmark, one line each, linked to their record. Each decision record belongs to exactly one landmark.

- none

## Folds In

The JSON landmark records this direction absorbs, for [Landmark Record Migration And Tracker Regrouping](../../specs/S-004A-landmark-record-migration-and-tracker-regrouping/SPEC.md) to read as one mapping. Each of the 24 JSON landmark records, from GitHub Coordination (LMK-000A) to Landmark Tracker (LMK-000X), is mapped exactly once across the twelve directions; the records that fold into none of them are listed once, under "Held at the Blueprint" in [Repo is the System of Record (LMK-000Y)](../LMK-000Y-repo-is-the-system-of-record/LANDMARK.md).

The mapping is the agent's reading, not an owner decision. The owner expected overlap ("I exepect the overlap", 2026-10-05) and the card leaves which records fold in open, so a record that overlaps several directions is placed under the one its summary most directly serves, and the overlap is named.

- [Agent Autonomy landmark record (LMK-000D)](../../landmark-tracker/landmarks/LMK-000D.json): its summary, "Agents finish authorized work and resolve available facts without requiring repeated owner coordination", is the agents-execute half of this direction.
- [Workbench Workflow landmark record (LMK-000K)](../../landmark-tracker/landmarks/LMK-000K.json): "a coherent journey from idea and shared understanding through delivery, review, correction and release" is the execution path a Task follows; it overlaps Owner Idea Alignment at its start.

## Child Specs

The Specs nested in this landmark's `specs` subfolder, one line each, linked to the Spec. A Spec has at most one parent landmark.

- none

## Direct Tasks

The Tasks nested in this landmark's `tasks` subfolder, one line each, linked to the Task record. Each keeps its own pull-request review.

- none

## Verification Procedure

```bash
node workbench/tools/landmark-artifact.mjs validate LMK-001J
node workbench/tools/spec-workbench.mjs report LMK-001J
```

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-06 | Twelve-landmark authoring (TK-008K) | Authored by the twelve-landmark authoring Task (TK-008K) of LANDMARK.md Artifact And Lane Runtime (S-003Z) from the Autonomous Execution Destination Question Card (DQC-007A) and the twelve-directions decision record (DDR-001H), with Status planned and Owner unassigned. Priority 5 is a uniform placeholder: the owner has not ordered the twelve. | The landmark validator and doctor (no malformed-landmark, no unstable-path) before commit; render, the append-only check and the full suite on the committed candidate are recorded in the Task record. | Docs checked; no update needed: the harness-engineering lineage Wiki page already names the twelve directions and still validates, and Runbook, Lexicon and Wiki documentation of the landmark runtime belongs to its own Task. | The reached checks and the Folds In mapping are the agent's reading until the card is answered; no child Spec or direct Task yet. |

## Reached Result

Pending.

## Supersession

- Supersedes: none
- Superseded by: none

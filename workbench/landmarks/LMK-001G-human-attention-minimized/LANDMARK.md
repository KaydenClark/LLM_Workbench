# LMK-001G - Human Attention Minimized

**Landmark ID:** LMK-001G
**Status:** planned
**Priority:** 5
**Owner:** unassigned
**Updated:** 2026-10-06
**Catalog description:** The owner's attention sits at the concept, and work reaches the owner only after automated proof and agent review.
**Blockers:** none
**Latest event:** Landmark authored from its Destination Question Card and the twelve-directions decision record.
**Next gate:** Activate the first child Spec or direct Task.

## Direction

**The owner's direction.** On 2026-10-05 the owner named this direction as one of twelve harness-engineering landmarks, recorded in [The twelve harness-engineering directions are landmarks](../../docs/ddr/001H-the-twelve-harness-engineering-directions-are-landmarks.md). In his words, as that decision record captures them: "These are not the only landmarks, they should just be landmarks, they are good directions." And on why these come first: "I feel like these are much better defined than what we would of made. It gives us real expectations."

The review-ladder decision record filed under this landmark carries his words: "The model in here with task being automated proof spec being automated review landmark/concept being integrated automated review, I liked that a lot too." Asked whether Human QA moves up the ladder: "For human QA, yes." The definition of integrated automated review at the landmark is recorded there as the agent's reading, presented and confirmed on 2026-10-05.

**The card's question.** The Destination Question Card for this direction, [Human Attention Minimized (DQC-006X)](../../landmark-tracker/destination-questions/DQC-006X.json), captured at Confirm, asks: "Where on the ladder does the owner's attention sit, and what reaches the owner only after automated proof and agent review?" Its answer, confirmation and expected result are still empty, and it records which landmark records fold in and what the reached check is as open.

**The agent's reading.** Not an owner statement: this direction points toward a Workbench where each rung of the ladder is passed by the cheapest reviewer that can pass it, so the owner's attention is spent on judging the concept and on genuine decisions, never on checks an automation or an independent agent could have made.

## Why It Matters

The agent's reading, not an owner statement. Owner attention is the scarcest resource in the room. Owner Human QA on every Spec does not scale with many agents producing many Specs, and every unnecessary request for attention delays work the agents could have finished.

## What Success Looks Like

The reached checks. The landmark is `reached` only when every box is ticked against what has landed on the integration branch.

These checks are the agent's reading of the card's question, drafted when the landmark was authored. The card still records its reached check as open, so they stand until the owner's answer on the card confirms or replaces them. The first two checks restate the accepted review-ladder decision record; the third restates its statement of when a human steps in earlier.

- [ ] A Task is proven by automation, a Spec by an agent that did not build it, and a landmark by integrated automated review, as the review-ladder decision record sets out.
- [ ] Owner Human QA sits at the landmark and the concept, not at each Spec.
- [ ] Before that rung, work reaches the owner only for a decision, a risk, an ambiguity or a failed automated review.

## Decision Records

The decision records whose `Landmark:` line names this landmark, one line each, linked to their record. Each decision record belongs to exactly one landmark.

- [Review climbs the ladder: Task by automated proof, Spec by agent review, Landmark by integrated automated review, and the owner judges the concept](../../docs/ddr/001B-review-climbs-the-ladder-task-by-automated-proof-spec-by-agent-review-landmark-by-integrated-automated-review-and-the-owner-judges-the-concept.md)

## Folds In

The JSON landmark records this direction absorbs, for [Landmark Record Migration And Tracker Regrouping](../../specs/S-004A-landmark-record-migration-and-tracker-regrouping/SPEC.md) to read as one mapping. Each of the 24 JSON landmark records, from GitHub Coordination (LMK-000A) to Landmark Tracker (LMK-000X), is mapped exactly once across the twelve directions; the records that fold into none of them are listed once, under "Held at the Blueprint" in [Repo is the System of Record (LMK-000Y)](../LMK-000Y-repo-is-the-system-of-record/LANDMARK.md).

The mapping is the agent's reading, not an owner decision. The owner expected overlap ("I exepect the overlap", 2026-10-05) and the card leaves which records fold in open, so a record that overlaps several directions is placed under the one its summary most directly serves, and the overlap is named.

- [Verification landmark record (LMK-000H)](../../landmark-tracker/landmarks/LMK-000H.json): its summary, "Evidence demonstrates the intended result at the right scope and preserves the distinction between checks, review and owner QA", is the ladder's rungs kept distinct; it overlaps Agent to Agent Review and Mechanical Enforcement.

## Child Specs

The Specs nested in this landmark's `specs` subfolder, one line each, linked to the Spec. A Spec has at most one parent landmark.

- none

## Direct Tasks

The Tasks nested in this landmark's `tasks` subfolder, one line each, linked to the Task record. Each keeps its own pull-request review.

- none

## Verification Procedure

```bash
node workbench/tools/landmark-artifact.mjs validate LMK-001G
node workbench/tools/spec-workbench.mjs report LMK-001G
```

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-06 | Twelve-landmark authoring (TK-008K) | Authored by the twelve-landmark authoring Task (TK-008K) of LANDMARK.md Artifact And Lane Runtime (S-003Z) from the Human Attention Minimized Destination Question Card (DQC-006X) and the twelve-directions decision record (DDR-001H), with Status planned and Owner unassigned. Priority 5 is a uniform placeholder: the owner has not ordered the twelve. | The landmark validator and doctor (no malformed-landmark, no unstable-path) before commit; render, the append-only check and the full suite on the committed candidate are recorded in the Task record. | Docs checked; no update needed: the harness-engineering lineage Wiki page already names the twelve directions and still validates, and Runbook, Lexicon and Wiki documentation of the landmark runtime belongs to its own Task. | The reached checks and the Folds In mapping are the agent's reading until the card is answered; no child Spec or direct Task yet. |

## Reached Result

Pending.

## Supersession

- Supersedes: none
- Superseded by: none

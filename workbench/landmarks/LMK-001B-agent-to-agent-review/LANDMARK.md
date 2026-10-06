# LMK-001B - Agent to Agent Review

**Landmark ID:** LMK-001B
**Status:** planned
**Priority:** 5
**Owner:** unassigned
**Updated:** 2026-10-06
**Catalog description:** An agent that did not build a change reviews it, and the review proves the candidate against its controls and evidence before a merge.
**Blockers:** none
**Latest event:** Landmark authored from its Destination Question Card and the twelve-directions decision record.
**Next gate:** Activate the first child Spec or direct Task.

## Direction

**The owner's direction.** On 2026-10-05 the owner named this direction as one of twelve harness-engineering landmarks, recorded in [The twelve harness-engineering directions are landmarks](../../docs/ddr/001H-the-twelve-harness-engineering-directions-are-landmarks.md). In his words, as that decision record captures them: "These are not the only landmarks, they should just be landmarks, they are good directions." And on why these come first: "I feel like these are much better defined than what we would of made. It gives us real expectations."

Beyond the twelve-directions decision record, no decision record names this landmark yet, so no further owner words are captured for it. The review-ladder decision record, filed under Human Attention Minimized, places agent review at the Spec rung; that placement is the record's, and this landmark does not restate it as its own.

**The card's question.** The Destination Question Card for this direction, [Agent to Agent Review (DQC-006S)](../../landmark-tracker/destination-questions/DQC-006S.json), captured at Confirm, asks: "How does an agent that did not build a change review it, and what does that review have to prove before a merge?" Its answer, confirmation and expected result are still empty, and it records which landmark records fold in and what the reached check is as open.

**The agent's reading.** Not an owner statement: this direction points toward a Workbench where review is independent by construction: the reviewing context built none of the change, it checks one immutable candidate against its controls, its assigned Spec or landmark and its named evidence, and its verdict binds to that candidate so a changed candidate needs a fresh review.

## Why It Matters

The agent's reading, not an owner statement. An agent reviewing its own work confirms its own assumptions. Without independent agent review, either defects merge or the owner has to read every change, which does not scale with many agents producing many changes.

## What Success Looks Like

The reached checks. The landmark is `reached` only when every box is ticked against what has landed on the integration branch.

These checks are the agent's reading of the card's question, drafted when the landmark was authored. The card still records its reached check as open, so they stand until the owner's answer on the card confirms or replaces them.

- [ ] A review is performed by an agent context that built none of the change, and the tools refuse self-review as a merge gate.
- [ ] The review checks the immutable candidate against its controls, its assigned Spec or landmark and its named evidence, and records a verdict bound to that candidate.
- [ ] A changed candidate needs a fresh review before it merges, and a failed review is corrected under the still-open work rather than cleared by a green test.

## Decision Records

The decision records whose `Landmark:` line names this landmark, one line each, linked to their record. Each decision record belongs to exactly one landmark.

- none

## Folds In

The JSON landmark records this direction absorbs, for [Landmark Record Migration And Tracker Regrouping](../../specs/S-004A-landmark-record-migration-and-tracker-regrouping/SPEC.md) to read as one mapping. Each of the 24 JSON landmark records, from GitHub Coordination (LMK-000A) to Landmark Tracker (LMK-000X), is mapped exactly once across the twelve directions; the records that fold into none of them are listed once, under "Held at the Blueprint" in [Repo is the System of Record (LMK-000Y)](../LMK-000Y-repo-is-the-system-of-record/LANDMARK.md).

The mapping is the agent's reading, not an owner decision. The owner expected overlap ("I exepect the overlap", 2026-10-05) and the card leaves which records fold in open, so a record that overlaps several directions is placed under the one its summary most directly serves, and the overlap is named.

- [Agent Stances landmark record (LMK-000R)](../../landmark-tracker/landmarks/LMK-000R.json): its summary, "Builder, Auditor, Reviewer and Reconciler provide distinct methods without changing authority", supplies the Reviewer and Auditor methods an independent review uses.

## Child Specs

The Specs nested in this landmark's `specs` subfolder, one line each, linked to the Spec. A Spec has at most one parent landmark.

- none

## Direct Tasks

The Tasks nested in this landmark's `tasks` subfolder, one line each, linked to the Task record. Each keeps its own pull-request review.

- none

## Verification Procedure

```bash
node workbench/tools/landmark-artifact.mjs validate LMK-001B
node workbench/tools/spec-workbench.mjs report LMK-001B
```

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-06 | Twelve-landmark authoring (TK-008K) | Authored by the twelve-landmark authoring Task (TK-008K) of LANDMARK.md Artifact And Lane Runtime (S-003Z) from the Agent to Agent Review Destination Question Card (DQC-006S) and the twelve-directions decision record (DDR-001H), with Status planned and Owner unassigned. Priority 5 is a uniform placeholder: the owner has not ordered the twelve. | The landmark validator and doctor (no malformed-landmark, no unstable-path) before commit; render, the append-only check and the full suite on the committed candidate are recorded in the Task record. | Docs checked; no update needed: the harness-engineering lineage Wiki page already names the twelve directions and still validates, and Runbook, Lexicon and Wiki documentation of the landmark runtime belongs to its own Task. | The reached checks and the Folds In mapping are the agent's reading until the card is answered; no child Spec or direct Task yet. |

## Reached Result

Pending.

## Supersession

- Supersedes: none
- Superseded by: none

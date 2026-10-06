# LMK-001C - Mechanical Enforcement

**Landmark ID:** LMK-001C
**Status:** planned
**Priority:** 5
**Owner:** unassigned
**Updated:** 2026-10-06
**Catalog description:** The important invariants are executable checks rather than prose, with a defined path for making a new rule executable.
**Blockers:** none
**Latest event:** Landmark authored from its Destination Question Card and the twelve-directions decision record.
**Next gate:** Activate the first child Spec or direct Task.

## Direction

**The owner's direction.** On 2026-10-05 the owner named this direction as one of twelve harness-engineering landmarks, recorded in [The twelve harness-engineering directions are landmarks](../../docs/ddr/001H-the-twelve-harness-engineering-directions-are-landmarks.md). In his words, as that decision record captures them: "These are not the only landmarks, they should just be landmarks, they are good directions." And on why these come first: "I feel like these are much better defined than what we would of made. It gives us real expectations."

On this direction and Repo is the System of Record together (2026-10-05, as the twelve-directions decision record captures it): "The Repo is the System of record, mechanical enforement. The things in the distance the make the workbench what it is, that we need to make." The decision record reads this as these two being the foundation already in hand; that reading is the record's, not a separate owner statement.

**The card's question.** The Destination Question Card for this direction, [Mechanical Enforcement (DQC-006T)](../../landmark-tracker/destination-questions/DQC-006T.json), captured at Confirm, asks: "Which invariants are executable checks rather than prose, and how is a new rule made executable?" Its answer, confirmation and expected result are still empty, and it records which landmark records fold in and what the reached check is as open.

**The agent's reading.** Not an owner statement: this direction points toward a Workbench where a rule that matters is enforced by a check an agent cannot skip (a `doctor` finding with a registered effect, or a test with a failing case), the list of invariants says which check enforces each, and a rule that is still prose is visible as a gap rather than assumed to hold.

## Why It Matters

The agent's reading, not an owner statement. Prose rules depend on every agent reading and remembering them. A rule enforced by a check holds for every agent and every provider, and a failing check names the violation where a reader would have missed it.

## What Success Looks Like

The reached checks. The landmark is `reached` only when every box is ticked against what has landed on the integration branch.

These checks are the agent's reading of the card's question, drafted when the landmark was authored. The card still records its reached check as open, so they stand until the owner's answer on the card confirms or replaces them.

- [ ] The room's important invariants are listed with the executable check that enforces each, and an invariant with no check is visible as a gap.
- [ ] A new rule has a defined path to become an executable check, a `doctor` finding or a test, with a failing case that proves it.
- [ ] A violation fails `doctor` or the full suite by its registered effect, without depending on an agent reading prose.

## Decision Records

The decision records whose `Landmark:` line names this landmark, one line each, linked to their record. Each decision record belongs to exactly one landmark.

- none

## Folds In

The JSON landmark records this direction absorbs, for [Landmark Record Migration And Tracker Regrouping](../../specs/S-004A-landmark-record-migration-and-tracker-regrouping/SPEC.md) to read as one mapping. Each of the 24 JSON landmark records, from GitHub Coordination (LMK-000A) to Landmark Tracker (LMK-000X), is mapped exactly once across the twelve directions; the records that fold into none of them are listed once, under "Held at the Blueprint" in [Repo is the System of Record (LMK-000Y)](../LMK-000Y-repo-is-the-system-of-record/LANDMARK.md).

The mapping is the agent's reading, not an owner decision. The owner expected overlap ("I exepect the overlap", 2026-10-05) and the card leaves which records fold in open, so a record that overlaps several directions is placed under the one its summary most directly serves, and the overlap is named.

- none

No JSON landmark record folds in here. The agent's reading: the Verification landmark record (LMK-000H) overlaps this direction and is placed under Human Attention Minimized, because its summary is about keeping checks, review and owner QA distinct rather than about making rules executable.

## Child Specs

The Specs nested in this landmark's `specs` subfolder, one line each, linked to the Spec. A Spec has at most one parent landmark.

- none

## Direct Tasks

The Tasks nested in this landmark's `tasks` subfolder, one line each, linked to the Task record. Each keeps its own pull-request review.

- none

## Verification Procedure

```bash
node workbench/tools/landmark-artifact.mjs validate LMK-001C
node workbench/tools/spec-workbench.mjs report LMK-001C
```

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-06 | Twelve-landmark authoring (TK-008K) | Authored by the twelve-landmark authoring Task (TK-008K) of LANDMARK.md Artifact And Lane Runtime (S-003Z) from the Mechanical Enforcement Destination Question Card (DQC-006T) and the twelve-directions decision record (DDR-001H), with Status planned and Owner unassigned. Priority 5 is a uniform placeholder: the owner has not ordered the twelve. | The landmark validator and doctor (no malformed-landmark, no unstable-path) before commit; render, the append-only check and the full suite on the committed candidate are recorded in the Task record. | Docs checked; no update needed: the harness-engineering lineage Wiki page already names the twelve directions and still validates, and Runbook, Lexicon and Wiki documentation of the landmark runtime belongs to its own Task. | The reached checks and the Folds In mapping are the agent's reading until the card is answered; no child Spec or direct Task yet. |

## Reached Result

Pending.

## Supersession

- Supersedes: none
- Superseded by: none

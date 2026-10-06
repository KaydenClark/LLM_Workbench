# LMK-001I - Owner Idea Alignment

**Landmark ID:** LMK-001I
**Status:** planned
**Priority:** 5
**Owner:** unassigned
**Updated:** 2026-10-06
**Catalog description:** An owner's idea becomes a confirmed shared concept that agents carry to its endpoint without re-explaining it.
**Blockers:** none
**Latest event:** Landmark authored from its Destination Question Card and the twelve-directions decision record.
**Next gate:** Activate the first child Spec or direct Task.

## Direction

**The owner's direction.** On 2026-10-05 the owner named this direction as one of twelve harness-engineering landmarks, recorded in [The twelve harness-engineering directions are landmarks](../../docs/ddr/001H-the-twelve-harness-engineering-directions-are-landmarks.md). In his words, as that decision record captures them: "These are not the only landmarks, they should just be landmarks, they are good directions." And on why these come first: "I feel like these are much better defined than what we would of made. It gives us real expectations."

Beyond the twelve-directions decision record, no decision record names this landmark yet, so no further owner words are captured for it.

**The card's question.** The Destination Question Card for this direction, [Owner Idea Alignment (DQC-006Z)](../../landmark-tracker/destination-questions/DQC-006Z.json), captured at Confirm, asks: "How does an owner's idea become a confirmed shared concept that agents can carry to its endpoint without re-explaining it?" Its answer, confirmation and expected result are still empty, and it records which landmark records fold in and what the reached check is as open.

**The agent's reading.** Not an owner statement: this direction points toward a Workbench where the gap between what the owner means and what agents build closes before building starts: an idea is drawn out, read back and confirmed, the confirmed concept is recorded in a durable owner, and agents carry it from that record without asking the owner to explain it again.

## Why It Matters

The agent's reading, not an owner statement. Agents that build on an unconfirmed reading build the wrong thing quickly. Without a confirmed shared concept, the owner re-explains the same idea to every new session and corrects drift after the fact.

## What Success Looks Like

The reached checks. The landmark is `reached` only when every box is ticked against what has landed on the integration branch.

These checks are the agent's reading of the card's question, drafted when the landmark was authored. The card still records its reached check as open, so they stand until the owner's answer on the card confirms or replaces them.

- [ ] An owner's idea becomes a concept the owner confirms after a readback, recorded in a durable owner.
- [ ] Agents carry a confirmed concept to its endpoint from that record without the owner re-explaining it.
- [ ] An unconfirmed idea stays visible as open and is not planned or implemented as though confirmed.

## Decision Records

The decision records whose `Landmark:` line names this landmark, one line each, linked to their record. Each decision record belongs to exactly one landmark.

- none

## Folds In

The JSON landmark records this direction absorbs, for [Landmark Record Migration And Tracker Regrouping](../../specs/S-004A-landmark-record-migration-and-tracker-regrouping/SPEC.md) to read as one mapping. Each of the 24 JSON landmark records, from GitHub Coordination (LMK-000A) to Landmark Tracker (LMK-000X), is mapped exactly once across the twelve directions; the records that fold into none of them are listed once, under "Held at the Blueprint" in [Repo is the System of Record (LMK-000Y)](../LMK-000Y-repo-is-the-system-of-record/LANDMARK.md).

The mapping is the agent's reading, not an owner decision. The owner expected overlap ("I exepect the overlap", 2026-10-05) and the card leaves which records fold in open, so a record that overlaps several directions is placed under the one its summary most directly serves, and the overlap is named.

- [Grilling and Shared Understanding landmark record (LMK-000O)](../../landmark-tracker/landmarks/LMK-000O.json): its summary, "Exploration produces an explicitly shared concept, preserving reasons, corrections and unresolved questions", is the alignment step itself.

## Child Specs

The Specs nested in this landmark's `specs` subfolder, one line each, linked to the Spec. A Spec has at most one parent landmark.

- none

## Direct Tasks

The Tasks nested in this landmark's `tasks` subfolder, one line each, linked to the Task record. Each keeps its own pull-request review.

- none

## Verification Procedure

```bash
node workbench/tools/landmark-artifact.mjs validate LMK-001I
node workbench/tools/spec-workbench.mjs report LMK-001I
```

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-06 | Twelve-landmark authoring (TK-008K) | Authored by the twelve-landmark authoring Task (TK-008K) of LANDMARK.md Artifact And Lane Runtime (S-003Z) from the Owner Idea Alignment Destination Question Card (DQC-006Z) and the twelve-directions decision record (DDR-001H), with Status planned and Owner unassigned. Priority 5 is a uniform placeholder: the owner has not ordered the twelve. | The landmark validator and doctor (no malformed-landmark, no unstable-path) before commit; render, the append-only check and the full suite on the committed candidate are recorded in the Task record. | Docs checked; no update needed: the harness-engineering lineage Wiki page already names the twelve directions and still validates, and Runbook, Lexicon and Wiki documentation of the landmark runtime belongs to its own Task. | The reached checks and the Folds In mapping are the agent's reading until the card is answered; no child Spec or direct Task yet. |

## Reached Result

Pending.

## Supersession

- Supersedes: none
- Superseded by: none

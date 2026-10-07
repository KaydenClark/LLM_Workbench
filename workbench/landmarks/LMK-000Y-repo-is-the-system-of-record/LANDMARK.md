# LMK-000Y - Repo is the System of Record

**Landmark ID:** LMK-000Y
**Status:** planned
**Priority:** 5
**Owner:** unassigned
**Updated:** 2026-10-06
**Catalog description:** The repository is the only system of record an agent needs, and that is enforced mechanically.
**Blockers:** none
**Latest event:** Landmark authored from its Destination Question Card and the twelve-directions decision record.
**Next gate:** Activate the first child Spec or direct Task.

## Direction

**The owner's direction.** On 2026-10-05 the owner named this direction as one of twelve harness-engineering landmarks, recorded in [The twelve harness-engineering directions are landmarks](../../docs/ddr/001H-the-twelve-harness-engineering-directions-are-landmarks.md). In his words, as that decision record captures them: "These are not the only landmarks, they should just be landmarks, they are good directions." And on why these come first: "I feel like these are much better defined than what we would of made. It gives us real expectations."

On this direction and Mechanical Enforcement together (2026-10-05, as the twelve-directions decision record captures it): "The Repo is the System of record, mechanical enforement. The things in the distance the make the workbench what it is, that we need to make." The decision record reads this as these two being the foundation already in hand, with the rest still to make; that reading is the record's, not a separate owner statement.

The two decision records filed under this landmark carry his words on where the repository's knowledge lives: on the Lexicon, "we dont need runbook or lexicon. We should be using the wiki for those things. What about ARCHITECTURE.md?", and on the Blueprint, "Yes, Keep its name. Yes, DDRs, ADRs, that sounds great."

**The card's question.** The Destination Question Card for this direction, [Repo is the System of Record (DQC-006P)](../../landmark-tracker/destination-questions/DQC-006P.json), captured at Confirm, asks: "What must be true for the repository to be the only system of record an agent needs, and how is that enforced mechanically?" Its answer, confirmation and expected result are still empty, and it records which landmark records fold in and what the reached check is as open.

**The agent's reading.** Not an owner statement: this direction points toward a Workbench where everything an agent needs to act (accepted decisions, the destination, plans, current work state and explanations) lives in the repository with one maintained home per kind of truth, so a clone is enough to work from, and a check rather than a reader notices when a truth has no home, two homes or a home outside the repository.

## Why It Matters

The agent's reading, not an owner statement. An agent cannot use what it cannot reach. While any accepted decision or live state exists only in chat, an external tool or one person's memory, every session pays to rediscover it or works without it, and no check can tell the difference.

## What Success Looks Like

The reached checks. The landmark is `reached` only when every box is ticked against what has landed on the integration branch.

These checks are the agent's reading of the card's question, drafted when the landmark was authored. The card still records its reached check as open, so they stand until the owner's answer on the card confirms or replaces them.

- [ ] A cold agent with only a clone of the room finds every accepted decision, the destination, current plans and work state it needs, with no chat history, external tracker or owner relay required.
- [ ] Every kind of durable truth has exactly one maintained home in the repository, and the owner of each kind is named in one place.
- [ ] An executable check in `doctor` or the full suite fails when a durable truth is missing its home, duplicated across homes or reachable only outside the repository.

## Decision Records

The decision records whose `Landmark:` line names this landmark, one line each, linked to their record. Each decision record belongs to exactly one landmark.

- [The Lexicon retires: canonical vocabulary in GLOSSARY.md, explanations in the Wiki and routes in ARCHITECTURE.md](../../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md)
- [The Blueprint keeps its name and decision records are the design-doc layer](../../docs/ddr/001G-the-blueprint-keeps-its-name-and-decision-records-are-the-design-doc-layer.md)

## Folds In

The JSON landmark records this direction absorbs, for [Landmark Record Migration And Tracker Regrouping](../../specs/S-004A-landmark-record-migration-and-tracker-regrouping/SPEC.md) to read as one mapping. Each of the 24 JSON landmark records, from GitHub Coordination (LMK-000A) to Landmark Tracker (LMK-000X), is mapped exactly once across the twelve directions; the records that fold into none of them are listed once, under "Held at the Blueprint" in [Repo is the System of Record (LMK-000Y)](../LMK-000Y-repo-is-the-system-of-record/LANDMARK.md).

The mapping is the agent's reading, not an owner decision. The owner expected overlap ("I exepect the overlap", 2026-10-05) and the card leaves which records fold in open, so a record that overlaps several directions is placed under the one its summary most directly serves, and the overlap is named.

- [Portable Workbench landmark record (LMK-000B)](../../landmark-tracker/landmarks/LMK-000B.json): its summary, "A fresh agent can clone a room, find what it needs, complete authorized work and leave a recoverable result", is the repository serving as the only record a fresh agent needs.
- [Artifact Types landmark record (LMK-000F)](../../landmark-tracker/landmarks/LMK-000F.json): each record having "a clear job, relationships and lifecycle" is the shape of the repository's records of truth.
- [Wiki landmark record (LMK-000J)](../../landmark-tracker/landmarks/LMK-000J.json): the Wiki is the repository's explanation layer, and the Lexicon decision record under this landmark moves term meanings into it.
- [Ownership Model landmark record (LMK-000M)](../../landmark-tracker/landmarks/LMK-000M.json): "every kind of truth has an identifiable owner" is the one-home rule this direction checks.

### Held at the Blueprint

The records that fold into none of the twelve directions and stay at the Blueprint level. This is the one place that mapping is recorded; it is also the agent's reading, not an owner decision.

- [Workbench Boundaries landmark record (LMK-000C)](../../landmark-tracker/landmarks/LMK-000C.json): what the product is and is not, and what stays optional, is the destination's own scope rather than a direction toward it.
- [Workbench and Project Relationships landmark record (LMK-000E)](../../landmark-tracker/landmarks/LMK-000E.json): the room and project relationship and its nesting are product structure, which its related decision records already file at Blueprint level.
- [Workbench Updates landmark record (LMK-000G)](../../landmark-tracker/landmarks/LMK-000G.json): how improvements reach rooms is the producer-to-room relationship the Blueprint carries; its self-drift detection overlaps Continuous Cleanup.
- [Genesis and Adoption landmark record (LMK-000U)](../../landmark-tracker/landmarks/LMK-000U.json): how a new or existing project enters a Workbench is a product entry path, not one of the twelve directions.
- [Workbench Template landmark record (LMK-000V)](../../landmark-tracker/landmarks/LMK-000V.json): the reference room that proves installation, use and upgrade is release proof for the product as a whole.

## Child Specs

The Specs nested in this landmark's `specs` subfolder, one line each, linked to the Spec. A Spec has at most one parent landmark.

- none

## Direct Tasks

The Tasks nested in this landmark's `tasks` subfolder, one line each, linked to the Task record. Each keeps its own pull-request review.

- none

## Verification Procedure

```bash
node workbench/tools/landmark-artifact.mjs validate LMK-000Y
node workbench/tools/spec-workbench.mjs report LMK-000Y
```

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-06 | Twelve-landmark authoring (TK-008K) | Authored by the twelve-landmark authoring Task (TK-008K) of LANDMARK.md Artifact And Lane Runtime (S-003Z) from the Repo is the System of Record Destination Question Card (DQC-006P) and the twelve-directions decision record (DDR-001H), with Status planned and Owner unassigned. Priority 5 is a uniform placeholder: the owner has not ordered the twelve. | The landmark validator and doctor (no malformed-landmark, no unstable-path) before commit; render, the append-only check and the full suite on the committed candidate are recorded in the Task record. | Docs checked; no update needed: the harness-engineering lineage Wiki page already names the twelve directions and still validates, and Runbook, Lexicon and Wiki documentation of the landmark runtime belongs to its own Task. | The reached checks and the Folds In mapping are the agent's reading until the card is answered; no child Spec or direct Task yet. |

## Reached Result

Pending.

## Supersession

- Supersedes: none
- Superseded by: none

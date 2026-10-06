# LMK-000Z - Progressive Disclosure

**Landmark ID:** LMK-000Z
**Status:** planned
**Priority:** 5
**Owner:** unassigned
**Updated:** 2026-10-06
**Catalog description:** A cold agent receives a short map at entry and reaches deeper context only when it can change what the agent does next.
**Blockers:** none
**Latest event:** Landmark authored from its Destination Question Card and the twelve-directions decision record.
**Next gate:** Activate the first child Spec or direct Task.

## Direction

**The owner's direction.** On 2026-10-05 the owner named this direction as one of twelve harness-engineering landmarks, recorded in [The twelve harness-engineering directions are landmarks](../../docs/ddr/001H-the-twelve-harness-engineering-directions-are-landmarks.md). In his words, as that decision record captures them: "These are not the only landmarks, they should just be landmarks, they are good directions." And on why these come first: "I feel like these are much better defined than what we would of made. It gives us real expectations."

The decision records filed under this landmark carry his words: "'An agent should only pay context for information when it can change what is next' Is key", and "Yes, lets make AGENTS.md like the map."

**The card's question.** The Destination Question Card for this direction, [Progressive Disclosure (DQC-006Q)](../../landmark-tracker/destination-questions/DQC-006Q.json), captured at Confirm, asks: "What does a cold agent receive at entry, and how does it reach deeper context only when that context can change what it does next?" Its answer, confirmation and expected result are still empty, and it records which landmark records fold in and what the reached check is as open.

**The agent's reading.** Not an owner statement: this direction points toward a Workbench where entry is a short map, every always-loaded line earns its place by being able to change the next action, and everything deeper (skills, Wiki pages, decision records, directory-scoped guides) is reached by a maintained pointer at the moment the work needs it.

## Why It Matters

The agent's reading, not an owner statement. Context an agent pays for but cannot use crowds out the context it needs. Without this direction the entry files grow with every lesson learned, and an agent either loads too much or searches broadly to find the one owner its task needs.

## What Success Looks Like

The reached checks. The landmark is `reached` only when every box is ticked against what has landed on the integration branch.

These checks are the agent's reading of the card's question, drafted when the landmark was authored. The card still records its reached check as open, so they stand until the owner's answer on the card confirms or replaces them.

- [ ] The always-loaded entry is a short map, and each of its lines passes the test that it can change what the agent does next.
- [ ] From the entry, an agent reaches the owner its task needs by following maintained routes, without a broad repository search.
- [ ] Deeper context (skills, Wiki pages, decision records, directory-scoped guides) loads only when the operation or location that needs it is reached.

## Decision Records

The decision records whose `Landmark:` line names this landmark, one line each, linked to their record. Each decision record belongs to exactly one landmark.

- [An agent pays context only for information that can change what it does next](../../docs/ddr/001A-an-agent-pays-context-only-for-information-that-can-change-what-it-does-next.md)
- [AGENTS.md is the map and the only Contract file](../../docs/ddr/001C-agents-md-is-the-map-and-the-only-contract-file.md)
- [Maintainer procedures live in declared maintainer skills and directory-scoped guides carry only a directory's invariants and pointers](../../docs/ddr/001K-maintainer-procedures-live-in-declared-maintainer-skills-and-directory-scoped-guides-carry-only-a-directory-s-invariants-and-pointers.md)
- [Maintainer-only procedures live in a directory-scoped AGENTS.md (deprecated and archived; the maintainer-procedures decision record above replaced it)](../../docs/ddr/archive/001F-maintainer-only-procedures-live-in-a-directory-scoped-agents-md.md)

## Folds In

The JSON landmark records this direction absorbs, for [Landmark Record Migration And Tracker Regrouping](../../specs/S-004A-landmark-record-migration-and-tracker-regrouping/SPEC.md) to read as one mapping. Each of the 24 JSON landmark records, from GitHub Coordination (LMK-000A) to Landmark Tracker (LMK-000X), is mapped exactly once across the twelve directions; the records that fold into none of them are listed once, under "Held at the Blueprint" in [Repo is the System of Record (LMK-000Y)](../LMK-000Y-repo-is-the-system-of-record/LANDMARK.md).

The mapping is the agent's reading, not an owner decision. The owner expected overlap ("I exepect the overlap", 2026-10-05) and the card leaves which records fold in open, so a record that overlaps several directions is placed under the one its summary most directly serves, and the overlap is named.

- [Context Map landmark record (LMK-000L)](../../landmark-tracker/landmarks/LMK-000L.json): its summary, "An agent can reach the smallest relevant owner by following maintained routes", is the routing half of this direction.
- [Skills landmark record (LMK-000I)](../../landmark-tracker/landmarks/LMK-000I.json): skills are the deeper behavior an agent loads only when the operation that needs one runs, and the maintainer-procedures decision record under this landmark places procedures in them.

## Child Specs

The Specs nested in this landmark's `specs` subfolder, one line each, linked to the Spec. A Spec has at most one parent landmark.

- none

## Direct Tasks

The Tasks nested in this landmark's `tasks` subfolder, one line each, linked to the Task record. Each keeps its own pull-request review.

- none

## Verification Procedure

```bash
node workbench/tools/landmark-artifact.mjs validate LMK-000Z
node workbench/tools/spec-workbench.mjs report LMK-000Z
```

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-06 | Twelve-landmark authoring (TK-008K) | Authored by the twelve-landmark authoring Task (TK-008K) of LANDMARK.md Artifact And Lane Runtime (S-003Z) from the Progressive Disclosure Destination Question Card (DQC-006Q) and the twelve-directions decision record (DDR-001H), with Status planned and Owner unassigned. Priority 5 is a uniform placeholder: the owner has not ordered the twelve. | The landmark validator and doctor (no malformed-landmark, no unstable-path) before commit; render, the append-only check and the full suite on the committed candidate are recorded in the Task record. | Docs checked; no update needed: the harness-engineering lineage Wiki page already names the twelve directions and still validates, and Runbook, Lexicon and Wiki documentation of the landmark runtime belongs to its own Task. | The reached checks and the Folds In mapping are the agent's reading until the card is answered; no child Spec or direct Task yet. |

## Reached Result

Pending.

## Supersession

- Supersedes: none
- Superseded by: none

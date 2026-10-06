---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - LANDMARK.md Artifact And Lane Runtime Spec (S-003Z), Task TK-008J (landmark templates and documentation), 2026-10-06, read from the delivered tools at integration d14cf315
source_paths:
  - workbench/docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md
  - workbench/specs/S-003Z-landmark-md-artifact-and-lane-runtime/SPEC.md
  - templates/LANDMARK.md
  - workbench/landmarks
  - workbench/tools/landmark-artifact.mjs
  - workbench/tools/spec-workbench.mjs
  - workbench/tools/spec-report.mjs
  - workbench/tools/task-record.mjs
  - workbench/tools/workbench-layout.mjs
  - workbench/tools/template-placeholders.mjs
  - tools/check-append-only.py
parent: none
authorized_by: the LANDMARK.md Artifact And Lane Runtime Spec (S-003Z), Task TK-008J (landmark templates and documentation)
last_verified: 2026-10-06
---

# Landmarks: The LANDMARK.md Artifact One Size Above A Spec

A **landmark** is a direction toward the destination at the largest scale below
the Blueprint. As the owner accepted it in the decision record
["Landmarks are LANDMARK.md artifacts one size above Specs"](../../docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md),
a landmark is a `LANDMARK.md` artifact: PRD-shaped like a Spec but much
bigger, saying where the work goes and what success looks like. The owner
named the gap it fills "specs for specs". Landmarks and Specs are the map at
two scales; Tasks are the steps taken on it. A landmark performs no delivery
itself: its child Specs and its direct Tasks do the work, and the landmark
holds their direction and judges, one size up, whether they reached it.

This article explains the artifact and its runtime as the
[LANDMARK.md Artifact And Lane Runtime Spec (S-003Z)](../../specs/S-003Z-landmark-md-artifact-and-lane-runtime/SPEC.md)
delivered it. Each claim below was read from the delivered tools and tests on
2026-10-06; the Spec keeps the evidence, and the commands themselves are
documented where the Runbook operations index points.

## The artifact

A landmark is one folder in the manifest's `landmarks` collection,
`workbench/landmarks/LMK-###-slug/`, holding:

- `LANDMARK.md`, copied from [`templates/LANDMARK.md`](../../../templates/LANDMARK.md);
- `specs/`, the home of its child Specs, with its own `specs/retired/`;
- `tasks/`, the home of the Tasks directly under it, with `tasks/retired/`.

So the landmark, Spec and Task path carries every parent, and one link down
that path is most of an agent's Destination Packet. A Spec has at most one
parent landmark; a Spec with none keeps its home in `workbench/specs/` under
the Blueprint.

The header carries the same fields a Spec does, with a `Landmark ID` in place
of a `Spec ID`: `Status`, `Priority`, `Owner`, `Updated`, `Catalog
description`, `Blockers`, `Latest event` and `Next gate`. `Status` is one of
`planned`, `active` and `reached`; the lifecycle folder, not a status, says a
landmark is retired. `Blockers` is `none` or a list of Spec, Task or landmark
identifiers. `Owner` is `unassigned` until a Director holds the lane. The
required sections are Direction, What Success Looks Like (the reached checks,
a ticked box per check that has landed on integration), Decision Records,
Append-Only Evidence And Execution Log and Reached Result; Why It Matters,
Child Specs, Direct Tasks, Verification Procedure and Supersession are
optional. `landmark-artifact.mjs` validates each artifact and `doctor` reports
a broken one as `malformed-landmark`; a landmark folder whose name does not
match its identity is `unstable-path`.

Visible identifiers use the `LMK-` prefix, allocated with
`spec-workbench.mjs next-id --prefix LMK`, which folds the artifacts, the
Landmark Tracker's JSON records and every remote tip into one occupied set,
so the migrating records keep their identities. The first twelve landmarks are
the owner's twelve harness-engineering directions, from the landmark
"Repo is the System of Record" (LMK-000Y) to the landmark
"Autonomous Execution" (LMK-001J), authored as planned
and unassigned from their Destination Question Cards, with a Folds In section
mapping the 24 JSON landmark records they absorb
([the twelve-directions decision record](../../docs/ddr/001H-the-twelve-harness-engineering-directions-are-landmarks.md)).

## Specs and Tasks under a landmark

Every Spec reader resolves a Spec at either home: the Blueprint-level lane or
a landmark's `specs/` folder, active or retired. `next`, `claim`, `close`,
`show`, `report`, `verdict`, `gate`, `approve`, `complete`, `retire-spec`,
`render`, `doctor`, the Task packet, decision-record moves, promotion and the
citation-anchor check all read the same homes, so a nested Spec is no longer
`unstable-path`. `CATALOG.md` links a nested Spec relative to the lane it
lives in.

A Spec changes parent only through the link-safe move:
`move-spec S-### --landmark LMK-###` moves an active-roster Spec into a
landmark or between landmarks, and `--landmark none` moves it back under the
Blueprint. It shares the relocation retirement uses, so every live reference
is rewritten and every historical one counted; a moved record's links to
unmoved non-Markdown files are recomputed for its new depth too. One move does
one thing: `--to retired` and `--landmark` are refused together. The move does
not edit the destination landmark's Child Specs list.

A Task may sit directly under a landmark. Its `TASK.md` names exactly one
parent, a `Spec ID` or a `Landmark ID`, and keeps its own pull-request review.
`next` and `claim LMK-###` offer such a Task only while its landmark is
`active` and has an owner other than `unassigned`: today's Contract names only
an assigned Spec as a bounded delegate, so the runtime refuses to execute
under an unassigned landmark rather than enlarging that list. `receipt`,
`close`, `show` and `move-task` take the landmark identity, `close` appends to
the landmark's evidence log, and `gate --task TK-### --landmark LMK-###`
reports the Task's pull request under the same exemption a Spec's Task uses.
A Task's `Blockers` may name a landmark, which a reached landmark satisfies.

## A lane, reviewed one size up

A landmark is a lane, not a branch. Each child Spec merges into integration as
soon as its own review passes, so integration stays current, and the
landmark's review judges what has landed there.

- `report LMK-### --candidate SHA` assembles the landmark with its child
  Specs, direct Tasks and decision records under one content digest, naming
  each open child and each unticked reached check.
- `verify LMK-###` refuses while any child Spec is neither complete nor retired
  or any direct Task is not done, and otherwise names the next step.
- `verdict LMK-### --candidate SHA --digest D --result pass|fail --findings
  TEXT --reviewer CONTEXT` records the separate landmark review. A reviewer who
  took part in the landmark is refused, since self-review never counts. A fail
  answers with corrective Tasks directly under the landmark and never touches
  a child Spec's gate or blocks its merge. A pass with every child closed and
  every reached check ticked sets the landmark `reached`; otherwise it records
  the pass and names what keeps it short.
- `approve LMK-### --candidate SHA --owner WHO` records the owner's approval,
  bound to the landmark's committed content. It records approval only: an
  owner finding is not recorded on a landmark, because an open landmark's work
  continues through its children and a later gap against a reached one becomes
  a new Spec.

Who runs the separate review, and moving the owner's Human QA onto this rung,
belong to the role and review-ladder work named below, not to the artifact.

## Retirement into the Landmark Wiki page

A reached landmark retires into its Landmark Wiki page, as a completed Spec
retires into its feature article: `retire-landmark LMK-### --wiki PAGE`. It
refuses by name a landmark that is not reached, has an open child, lacks a
current pass verdict, sits in a dirty tree, names a page outside the Wiki lane
or a page whose `source_paths` does not name the historical `LANDMARK.md`
route, or lacks the owner's approval. Then the whole folder, nested Specs and
direct Tasks included, moves link-safely to `workbench/landmarks/retired/`,
where `show` still finds it by its historical route. `LANDMARK.md` is the
page's raw source and is not the page.

## Installation, templates and append-only history

`landmark-artifact.mjs` is a managed runtime tool in `RUNTIME_TOOLS`, so the
receipt-backed install and `update --explicit-update` carry it into every
room. A new room declares the `landmarks` collection last; a room stamped
before it still validates, and `workbench-layout.mjs migrate` appends exactly
that declaration and creates the empty folder. Updating a room that has no
landmarks through the managed route therefore changes nothing else in it: no
Spec, Task record, projection or seeded document byte moves
(`tools/test-workbench-upgrade.mjs` proves the route end to end).

The template-placeholder vocabulary covers `templates/LANDMARK.md` as one of
the record templates a room copies after Genesis, so an unfilled landmark
placeholder is detected like a Spec's. `tools/check-append-only.py` enforces the
append-only rule on every active and retired `LANDMARK.md` evidence log and on
every Spec nested in a landmark's `specs/` folder, beside the Blueprint-level
Specs.

## What is not delivered here

- The Instruction Authority list in `AGENTS.md` still names only the assigned
  Spec; naming an assigned landmark as a bounded delegate belongs to the
  [Contract Carrier Pointer-Brief Rewrite (S-004C)](../../specs/S-004C-contract-carrier-pointer-brief-rewrite/SPEC.md).
- The 24 JSON landmark records and the Landmark Tracker's per-landmark
  grouping stay as they are until
  [Landmark Record Migration And Tracker Regrouping (S-004A)](../../specs/S-004A-landmark-record-migration-and-tracker-regrouping/SPEC.md)
  lands; the existing Landmark Wiki pages still read those records.
- The Captain and the landmark Director are owned by
  [Captain Role And Landmark Director (S-004B)](../../specs/S-004B-captain-role-and-landmark-director/SPEC.md),
  and the owner's Human QA at the landmark rung by
  [Review Ladder And Landmark Human QA (S-004N)](../../specs/S-004N-review-ladder-and-landmark-human-qa/SPEC.md).
- Known gaps the Tasks recorded: a move or a corrective Task does not update
  the landmark's Child Specs or Direct Tasks list; the Task packet does not
  resolve a Packet for a landmark-direct Task; `wiki.mjs` note moves, the
  Tracker's room index and the self-drift inventory still walk only
  `workbench/specs`; and retirement is unverified in a remote-coordinated room.

## Evidence and Sources

- [Decision record: Landmarks are LANDMARK.md artifacts one size above Specs](../../docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md):
  the accepted decision this article explains.
- [LANDMARK.md Artifact And Lane Runtime Spec (S-003Z)](../../specs/S-003Z-landmark-md-artifact-and-lane-runtime/SPEC.md):
  the delivering Spec, its Plan decisions and its evidence log.
- [The twelve-directions decision record (DDR-001H)](../../docs/ddr/001H-the-twelve-harness-engineering-directions-are-landmarks.md):
  why the first twelve landmarks exist.
- `templates/LANDMARK.md` and `workbench/tools/landmark-artifact.mjs`: the
  template, statuses, required sections, validator and lifecycle folder.
- `workbench/tools/spec-workbench.mjs` and `workbench/tools/spec-report.mjs`:
  the two Spec homes, `move-spec --landmark`, landmark-direct Tasks, the
  whole-landmark review, `approve LMK-###` and `retire-landmark`.
- `workbench/tools/workbench-layout.mjs`, `workbench/tools/template-placeholders.mjs`
  and `tools/check-append-only.py`: installation and the update route, the
  placeholder vocabulary and append-only enforcement.
- [Decision Records and the Concept Map](decision-records-and-the-concept-map.md):
  how landmarks, Specs and decision records form the map at two scales.

## History

- 2026-10-06: created by the LANDMARK.md Artifact And Lane Runtime Spec (S-003Z),
  Task TK-008J (landmark templates and documentation), from the tools its other Tasks delivered to
  integration.

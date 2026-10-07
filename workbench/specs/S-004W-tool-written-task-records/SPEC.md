# S-004W - Tool-Written Task Records

**Spec ID:** S-004W
**Status:** planned
**Priority:** 3
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-10-07
**Catalog description:** A `new-task` command allocates a Task ID, writes a valid `TASK.md` and parses it back in one step, and activation names every missing Spec header field at once.
**Blockers:** Open owner choice W-1 (the `new-task` flag shape and whether a call writes a single record); W-2 (whether the to-tasks wording lands after the to-tasks rebuild reaches `main`) blocks only the to-tasks wording slice.
**Latest event:** Revised from the owner grilling of 2026-10-07: targets the template Workbench, describing docs first; no Task is cut.
**Next gate:** Owner answers W-1 and W-2, then activation and a Task cut from live Actuality with `/to-tasks`.

> **Citation anchors.** pre=`d0fb161c1ff36caf936758b7492f7ef7fce8176e` post=`d0fb161c1ff36caf936758b7492f7ef7fce8176e`.

## Outcome

Cutting Tasks stops being hand-typing. `spec-workbench.mjs new-task S-###`
takes the slice, blockers, destination and planned verification, allocates the
next Task ID, writes the record in the shape the parser expects, and reads it
back before reporting success. When activation fails on the Spec header, it
names every missing field in one error.

## Why It Matters

In one run on 2026-10-07 an agent cutting seven Tasks wrote a throwaway Python
helper to produce the `TASK.md` format the to-tasks skill describes in prose,
and called `next-id` seven times, one per record, because each proposal is
valid only once the previous record is saved. `convert-tasks --activate` then
failed twice in a row, first on a missing `Priority`, then on a missing
`Owner`. Memory of past runs records Task ID collisions from the same
hand-allocation.

## Current Verified State

At the pre anchor:

- The to-tasks skill, step 4, describes the record format in prose: the title
  line, then one `**Field:** value` line each for `Task ID`, `Spec ID`,
  `Slice`, `Status`, `Stance`, `Blockers` and `Destination`, plus
  `Planned verification`. It tells the agent to call `next-id` for each label
  and save each record before asking for the next.
- No command writes a Task record. `next-id` proposes without reserving.
- `workbench/tools/spec-packet.mjs` checks the active header fields in a loop
  that throws on the first missing one (`${id} is missing ${name}`).
- `spec-workbench.mjs`, `spec-packet.mjs` and `task-record.mjs` are managed
  runtime tools in `workbench/tools/`, which reach rooms through tool updates.
- `templates/SPEC.md` already includes `Priority` and `Owner`, so the retro's
  suggestion to add them to the template is already true; the failing Spec had
  been written without them.

## Desired Behavior

1. `new-task S-###` allocates the next Task ID the way `next-id` does, writes
   `tasks/<id>/TASK.md`, parses it with the same loader every other command
   uses, and prints the new ID. Its flags are W-1.
2. If the written record does not parse, `new-task` removes it and refuses,
   naming the problem, so a failed call leaves nothing behind.
3. `new-task` refuses a Spec that is not record-backed, an unknown Spec, and a
   blocker ID that does not exist, writing nothing.
4. Activation's header check reports every missing field in one error.
5. The to-tasks skill tells the agent to use `new-task` and keeps the prose
   record format only as the reference for reading a record.

## Decisions And Contracts

- **This Spec targets the template Workbench.** `spec-workbench.mjs` is a
  managed runtime tool that reaches rooms through tool updates, so the shipped
  tool is Actuality and LLM_Workbench's claims about it are Canon. The Spec
  first updates the LLM_Workbench Canon, Grounding and Enduring Context that
  describe how a Task record is written and how activation checks the header
  (named under Documentation Impact), then the tool. Why (owner): what is
  Actuality and what is not is what matters; LLM_Workbench's docs describe what
  the template is, does and how, so they lead.
- `new-task` writes a record only; it does not activate, claim or render.
- `next-id` keeps its read-only proposal contract.
- The record format stays owned by `task-record.mjs`; `new-task` writes through
  it rather than building a second template.

### Open owner choices

- **W-1. What is the flag shape, and does one call write a single record?**
  Recommendation (not an owner answer): the Map-step draft's shape,
  `new-task S-### --slice TEXT --destination TEXT [--blockers IDS]
  [--stance NAME] [--verification TEXT] [--status ready|blocked]`, with one
  record per call so each refusal stays local; a batch form can follow if it
  proves needed.
- **W-2. Does this Spec's to-tasks wording change land only after the to-tasks
  skill rebuild (S-01L), approved and waiting for promotion, reaches `main`?**
  Recommendation (not an owner answer): yes, as a separate edit after the
  rebuild. It blocks only the to-tasks wording slice.

## Non-Goals

- Changing the Task record format.
- Reserving IDs across concurrent sessions. `next-id` already reads every
  remote tip; a true reservation is a coordination question for the GitHub
  coordination Specs.

## Dependencies And Blockers

No Spec blocks this one. The open owner choice W-1 blocks the Task cut. W-2
decides whether the to-tasks skill rebuild (S-01L) reaching `main` blocks the
to-tasks wording slice.

Coordination note, not a blocker: this Spec, Checked Verification Needs Its
Evidence (S-004T), Lifecycle Commands Print A Summary (S-004U) and Claim And
Close Respect The Claimant (S-004V) all edit `workbench/tools/spec-workbench.mjs`.
They do not block each other; their Spec Planners order the Tasks that overlap.

## Vertical Implementation Slices

No Task is cut. Tasks are cut from live Actuality at activation with
`/to-tasks`. The intended direction is the describing docs first, then
`new-task` writing one ready record as the tracer slice, then refusals and the
clean-up on parse failure, then the all-fields activation error, then the
to-tasks wording.

## Acceptance Criteria

- [ ] The LLM_Workbench docs that describe how a Task record is written and how activation checks the header state `new-task` and the all-fields error, updated before the tool change.
- [ ] `new-task` on a planned record-backed fixture Spec writes a record that `show` parses, with the given fields and a fresh ID.
- [ ] Two `new-task` calls in a row get distinct IDs without a manual `next-id`.
- [ ] Each refusal (unknown Spec, table-backed Spec, unknown blocker, unparseable result) writes nothing.
- [ ] Activating a fixture Spec missing two header fields names both in one error.
- [ ] The to-tasks skill routes record writing through `new-task`, and its catalog pin is updated.
- [ ] Named verification and remaining limitations are recorded without claiming owner approval.

## Testing Seams

`tools/test-spec-workbench.mjs` through the CLI on fixture rooms;
`tools/test-skill-catalog.mjs` for the to-tasks pin.

## Verification Procedure

Red/green at the CLI seam, the targeted tests, then the Full suite on a
committed candidate. Record actual commands and results in this Spec.

## Documentation Impact

First, before the tool: the LLM_Workbench owners that describe Task record
writing and activation, namely `RUNBOOK.md` Spec Lifecycle commands, the
[Lifecycle tool behaviors](../../wiki/lifecycle-tool-behaviors.md) Wiki page,
and the to-tasks skill and its Wiki page (the skill wording subject to W-2).
Then the template copies, such as `templates/RUNBOOK.md`'s lifecycle commands,
or a recorded exemption.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-07 | none | Authored at the Map step from an implement-spec retro at integration d0fb161c1ff36caf936758b7492f7ef7fce8176e. | Map only; the to-tasks record step, `next-id`, the header check and the Spec template were read at that tip; no runtime proof claimed. | This Spec. | Owner approval, Plan, implementation and proof remain. |
| 2026-10-07 | none | Revised from the owner grilling of 2026-10-07. Carries the template-target decision (update the LLM_Workbench docs describing Task record writing and activation first, then the tool), the coordination note with S-004T, S-004U and S-004V on `spec-workbench.mjs`, and W-1 and W-2 as open owner choices. | Map only; no runtime proof claimed. | This Spec. | Owner answers to W-1 and W-2, Plan, implementation and proof remain. |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

A batch form of `new-task`, if W-1 keeps one record per call and that proves
costly.

## Supersession

- Supersedes: none
- Superseded by: none

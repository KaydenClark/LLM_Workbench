# S-004U - Lifecycle Commands Print A Summary

**Spec ID:** S-004U
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-10-07
**Catalog description:** `claim`, `close`, `receipt`, `verdict` and `approve` print one short summary by default instead of the whole Spec as JSON; `--json` keeps the full object, and the Runbook's Operations Index points to the JSON Taskboard for what is waiting on whom.
**Blockers:** Open owner choice U-1 (the five commands only, or also `convert-tasks` and the `move-*` verbs).
**Latest event:** Revised from the owner grilling of 2026-10-07: targets the template Workbench, describing docs first, and adds the "See what's waiting on whom" Operations Index row; no Task is cut.
**Next gate:** Owner answers U-1, then activation and a Task cut from live Actuality with `/to-tasks`.

> **Citation anchors.** pre=`d0fb161c1ff36caf936758b7492f7ef7fce8176e` post=`d0fb161c1ff36caf936758b7492f7ef7fce8176e`.

## Outcome

A state-changing lifecycle command tells the agent what changed in a few lines:
the Task, its new status, the Spec's latest event and next gate, and any
coordination note. The whole Spec body is printed only when asked for with
`--json`. An agent that needs the wider picture, what is waiting on whom,
finds the JSON Taskboard from the Runbook's Operations Index.

## Why It Matters

Each `claim` in one run on 2026-10-07 printed the full Spec as JSON, 61 KB and
67 KB, and both spilled into persisted output files. An agent pays that context
on every claim and close, on every Task, for an object it almost never reads:
it already has the Spec open and needs only to know whether the step worked.

## Current Verified State

At the pre anchor, `workbench/tools/spec-workbench.mjs` `main` prints with
`--json` the full result, and otherwise special-cases only `show`, `doctor`,
`report` and a capability-blocked `next`. Every other command, including
`claim` (whose result is `showSpec`, the whole Spec), falls through to
`JSON.stringify(result, null, 2)`. Coordination notes already go to stderr.
The tests that check `claim` output pass `--json`; no tracked tool was found
parsing the default output, but the Plan must confirm that across skills and
tools. `spec-workbench.mjs` is a managed runtime tool in `workbench/tools/`,
which reaches rooms through tool updates.

`render --format json` writes the opt-in JSON Taskboard preview,
`TASKBOARD.preview.json`, described in
[RUNBOOK.md Spec Lifecycle And Retrieval](../../../RUNBOOK.md#spec-lifecycle-and-retrieval).
The [Operations Index](../../../RUNBOOK.md#operations-index) has no row that
points to it.

## Desired Behavior

1. Without `--json`, `claim`, `close`, `receipt`, `verdict` and `approve` print
   a short summary: the parent and Task ID, the Task's status after the
   command, the parent's latest event and next gate, and, for `claim`, the
   branch and commit the claim was published on.
2. With `--json`, each prints exactly what it prints today.
3. The summary for each command has a fixed shape a test pins.
4. Errors, refusals and stderr coordination notes are unchanged.
5. `RUNBOOK.md`'s Operations Index has a row "See what's waiting on whom" whose
   pointer is the JSON Taskboard (`render --format json`).

## Decisions And Contracts

- **This Spec targets the template Workbench.** `spec-workbench.mjs` is a
  managed runtime tool that reaches rooms through tool updates, so the shipped
  tool is Actuality and LLM_Workbench's claims about it are Canon. The Spec
  first updates the LLM_Workbench Canon, Grounding and Enduring Context that
  describe the lifecycle commands' output (named under Documentation Impact),
  then the tool. Why (owner): what is Actuality and what is not is what
  matters; LLM_Workbench's docs describe what the template is, does and how,
  so they lead.
- **The Runbook's Operations Index gets a "See what's waiting on whom" row
  pointing at the JSON Taskboard (`render --format json`).** Owner decision of
  2026-10-07.
- `--json` stays the machine contract; the default output becomes for people
  and agents reading it, and makes no parsing promise beyond the pinned shape.

### Open owner choices

- **U-1. Which commands get the summary: the five, or also `convert-tasks`,
  `move-spec` and `move-task`?** Recommendation (not an owner answer): the
  five only; the other verbs keep their current output and can change later if
  they prove costly.
- **U-2. Is a release note enough for a change to default output that reaches
  rooms through a tool update?** No recommendation was made at the Map step.
  It does not block the Task cut; it needs an answer before the change ships
  to rooms.

## Non-Goals

- Changing any command's behavior, refusals or written state.
- Changing `show`, `report`, `doctor` or `next`.
- Changing what `render --format json` writes; this Spec only routes to it.

## Dependencies And Blockers

No Spec blocks this one. The open owner choice U-1 blocks the Task cut. If
Claim And Close Respect The Claimant
([S-004V](../S-004V-claim-and-close-respect-the-claimant/SPEC.md)) lands first,
the summary includes the claimant it records.

Coordination note, not a blocker: this Spec, Checked Verification Needs Its
Evidence (S-004T), Claim And Close Respect The Claimant (S-004V) and
Tool-Written Task Records (S-004W) all edit `workbench/tools/spec-workbench.mjs`.
They do not block each other; their Spec Planners order the Tasks that overlap.

## Vertical Implementation Slices

No Task is cut. Tasks are cut from live Actuality at activation with
`/to-tasks`. The intended direction is the describing docs and the Operations
Index row first, then `claim` as the tracer slice, then the other commands U-1
settles.

## Acceptance Criteria

- [ ] The LLM_Workbench docs that describe the lifecycle commands' output state the summary and `--json` contract, updated before the tool change.
- [ ] `RUNBOOK.md`'s Operations Index has a "See what's waiting on whom" row whose pointer reaches the JSON Taskboard (`render --format json`).
- [ ] Each command in scope prints its pinned summary without `--json`, and that output is under 1 KB on a Spec of this repository's size.
- [ ] With `--json`, each command's output is byte-identical to its output at the pre anchor for the same fixture.
- [ ] No tracked skill, tool or test parses the default output of the commands in scope, shown by search.
- [ ] Named verification and remaining limitations are recorded without claiming owner approval.

## Testing Seams

`tools/test-spec-workbench.mjs` drives each command through the CLI against a
fixture room, with and without `--json`. `tools/test-runbook-index.mjs` for the
new Operations Index row and its pointer.

## Verification Procedure

Red/green at the CLI seam, the targeted test, then the Full suite on a committed
candidate. Record actual commands and results in this Spec.

## Documentation Impact

First, before the tool: the LLM_Workbench owners that describe lifecycle
command output, namely `RUNBOOK.md` (the new Operations Index row and wherever
it shows lifecycle command output), the
[Lifecycle tool behaviors](../../wiki/lifecycle-tool-behaviors.md) Wiki page,
and any skill that tells an agent to read a field from the default output.
Then the template copies that carry the same text, such as
`templates/RUNBOOK.md`'s Operations Index, or a recorded exemption.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-07 | none | Authored at the Map step from an implement-spec retro at integration d0fb161c1ff36caf936758b7492f7ef7fce8176e. | Map only; the CLI output path and test callers were read at that tip; no runtime proof claimed. | This Spec. | Owner approval, Plan, implementation and proof remain. |
| 2026-10-07 | none | Revised from the owner grilling of 2026-10-07. Carries the template-target decision (update the LLM_Workbench docs describing command output first, then the tool), the decision to add a "See what's waiting on whom" Operations Index row pointing at the JSON Taskboard (`render --format json`), the coordination note with S-004T, S-004V and S-004W on `spec-workbench.mjs`, and U-1 and U-2 as open owner choices. | Map only; no runtime proof claimed. | This Spec. | Owner answers to U-1 and U-2, Plan, implementation and proof remain. |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

None known.

## Supersession

- Supersedes: none
- Superseded by: none

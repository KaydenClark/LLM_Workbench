# S-004V - Claim And Close Respect The Claimant

**Spec ID:** S-004V
**Status:** planned
**Priority:** 3
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-10-07
**Catalog description:** `close` knows who is closing and refuses to close a Task another agent claimed unless told it acts on that agent's behalf, and `claim` stops overwriting a Spec's assigned Owner.
**Blockers:** Open owner choices V-1 (`close` requires `--agent` or only warns) and V-3 (who sets the Spec header's Owner if `claim` stops writing it).
**Latest event:** Revised from the owner grilling of 2026-10-07: targets the template Workbench, describing docs first; no Task is cut.
**Next gate:** Owner answers V-1 and V-3, then activation and a Task cut from live Actuality with `/to-tasks`.

> **Citation anchors.** pre=`d0fb161c1ff36caf936758b7492f7ef7fce8176e` post=`d0fb161c1ff36caf936758b7492f7ef7fce8176e`.

## Outcome

The record of who did a Task stays true. An agent that closes a Task someone
else claimed has to say so, and the Spec header's Owner names whoever was
assigned the Spec rather than whichever Worker claimed last.

## Why It Matters

In the pr skill adoption run (S-002U) on 2026-10-07, one Worker closed a Task a
different Worker had claimed, and `close` accepted it without comment. Each
`claim` also rewrote the Spec's Owner, so it moved from the Dispatcher to three
successive Workers and had to be reset by hand.

## Current Verified State

At the pre anchor, in `workbench/tools/spec-workbench.mjs`, a managed runtime
tool that reaches rooms through tool updates:

- `claimInTree` writes `Owner: <agent>` into the Spec header on every claim of
  a Spec's Task (a landmark's Owner is left alone). It also appends the agent
  to the Task record's `Claimed by` list, which its own comment calls "the one
  place a claimant survives `close`".
- `closeTask` takes no agent. It closes the in-progress Task it selects without
  reading `Claimed by`.
- `LEXICON.md` defines **Owner** as the person whose ideas the project realizes,
  not an agent. The Spec header's `Owner` field is used for the agent holding
  the Spec.

## Desired Behavior

1. `close` takes `--agent NAME`. When `NAME` is not the latest entry in the
   Task's `Claimed by`, `close` refuses, writing nothing, and names the
   claimant. Whether a `close` without `--agent` refuses or warns is V-1.
2. `close --agent NAME --on-behalf-of CLAIMANT` closes when `CLAIMANT` is the
   latest claimant, and the Receipt row records both names.
3. `claim` stops overwriting an assigned Spec header Owner. Who sets that field
   instead is V-3. `Claimed by` on the Task record is unchanged.
4. A table-backed Task with no `Claimed by` list closes as it does today.

## Decisions And Contracts

- **This Spec targets the template Workbench.** `spec-workbench.mjs` is a
  managed runtime tool that reaches rooms through tool updates, so the shipped
  tool is Actuality and LLM_Workbench's claims about it are Canon. The Spec
  first updates the LLM_Workbench Canon, Grounding and Enduring Context that
  describe `claim` and `close` (named under Documentation Impact), then the
  tool. Why (owner): what is Actuality and what is not is what matters;
  LLM_Workbench's docs describe what the template is, does and how, so they
  lead.
- The claimant record is `Claimed by` on the Task record, as the LANDMARK.md
  Artifact And Lane Runtime Spec (S-003Z) decided in its Task TK-008H; the Spec
  header's Owner is not a claimant record.

### Open owner choices

- **V-1. Does `close` require `--agent`, or only warn when it is missing?**
  Recommendation (not an owner answer): require it. Requiring it changes every
  `close` call in skills and the Runbook at once, but a close that may omit its
  agent cannot enforce anything. The weaker alternative is a stderr warning
  when `--agent` is missing.
- **V-2. The Spec header's `Owner` field holds an agent, but the Lexicon's
  Owner is the person. Should the field be renamed?** Recommendation (not an
  owner answer): the Map-step draft left the name to the Lexicon's owner and
  out of this Spec's scope. It does not block the claimant behavior.
- **V-3. If `claim` stops writing the Spec header's Owner, who sets it?**
  Recommendation (not an owner answer): the Map-step draft had `claim` write
  the field only while it is `unassigned` and leave an assigned value alone.

## Non-Goals

- Letting a Task be claimed while its blocker is still in progress on the same
  branch. The retro proposed it; the real cause was a Task cut that split a skill
  folder from its declaration, which Adding A Required Core Skill
  ([S-004X](../S-004X-adding-a-required-core-skill/SPEC.md)) addresses.
- Replacing remote-tip claims with Issue authority, which S-003V owns.

## Dependencies And Blockers

No Spec blocks this one. The open owner choices V-1 and V-3 block the Task cut;
V-2 does not.

Coordination note, not a blocker: this Spec, Checked Verification Needs Its
Evidence (S-004T), Lifecycle Commands Print A Summary (S-004U) and Tool-Written
Task Records (S-004W) all edit `workbench/tools/spec-workbench.mjs`. They do not
block each other; their Spec Planners order the Tasks that overlap.

## Vertical Implementation Slices

No Task is cut. Tasks are cut from live Actuality at activation with
`/to-tasks`. The intended direction is the describing docs first, then the
claim-Owner change as one slice and the `close` claimant check, its flag and the
skill and Runbook updates as another.

## Acceptance Criteria

- [ ] The LLM_Workbench docs that describe `claim` and `close` state the claimant rule and the Owner behavior V-3 settles, updated before the tool change.
- [ ] `close --agent B` on a Task whose latest claimant is A refuses, writes nothing and names A.
- [ ] `close --agent B --on-behalf-of A` closes it, and the Receipt row names both.
- [ ] `claim` on a Spec whose Owner is assigned leaves the Owner unchanged and still records the claimant on the Task record.
- [ ] Every `close` call in tracked skills, the Runbook and templates matches the new contract.
- [ ] Named verification and remaining limitations are recorded without claiming owner approval.

## Testing Seams

`tools/test-spec-workbench.mjs` at the `claimWork` and `closeTask` seams with
`--local` fixture rooms; `tools/test-skill-catalog.mjs` for any skill wording
it pins.

## Verification Procedure

Red/green at each seam, the targeted tests, then the Full suite on a committed
candidate. Record actual commands and results in this Spec.

## Documentation Impact

First, before the tool: the LLM_Workbench owners that describe `claim` and
`close`, namely `RUNBOOK.md` Spec Lifecycle commands, the
[Lifecycle tool behaviors](../../wiki/lifecycle-tool-behaviors.md) Wiki page,
the implement, implement-spec, dispatcher and carry skills where they show
`close`, and `LEXICON.md` if V-2 renames the field. Then the template copies,
such as `templates/RUNBOOK.md`'s lifecycle commands, or a recorded exemption.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-07 | none | Authored at the Map step from an implement-spec retro at integration d0fb161c1ff36caf936758b7492f7ef7fce8176e. | Map only; `claimInTree`, `closeTask` and the Lexicon's Owner row were read at that tip; no runtime proof claimed. | This Spec. | Owner decision, Plan, implementation and proof remain. |
| 2026-10-07 | none | Revised from the owner grilling of 2026-10-07. Carries the template-target decision (update the LLM_Workbench docs describing `claim` and `close` first, then the tool), the coordination note with S-004T, S-004U and S-004W on `spec-workbench.mjs`, and V-1, V-2 and V-3 as open owner choices. | Map only; no runtime proof claimed. | This Spec. | Owner answers to V-1, V-2 and V-3, Plan, implementation and proof remain. |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

The Spec header `Owner` field name versus the Lexicon's Owner, unless V-2 brings
the rename into this Spec.

## Supersession

- Supersedes: none
- Superseded by: none

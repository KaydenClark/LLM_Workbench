# S-004T - Checked Verification Needs Its Evidence

**Spec ID:** S-004T
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-10-07
**Catalog description:** `report` names a gap when a Spec's verification acceptance line is checked but no evidence row after the last Task close records the candidate and suite result it claims.
**Blockers:** Open owner choices T-1 (which acceptance lines count as verification lines), T-2 (what text counts as a suite result) and T-3 (whether a pass verdict refuses while the gap exists).
**Latest event:** Revised from the owner grilling of 2026-10-07: targets the template Workbench, describing docs first; no Task is cut.
**Next gate:** Owner answers T-1, T-2 and T-3, then activation and a Task cut from live Actuality with `/to-tasks`.

> **Citation anchors.** pre=`d0fb161c1ff36caf936758b7492f7ef7fce8176e` post=`d0fb161c1ff36caf936758b7492f7ef7fce8176e`.

## Outcome

A Spec cannot look verified before it is. When its acceptance line saying that
verification is recorded is checked, `report` looks for the evidence row that
line promises. If none exists after the last Task close, `report` names the gap,
so the Dispatcher sees it before a separate-context review is spent on it.

## Why It Matters

In one implement-spec run on 2026-10-07, the Dispatcher checked "Named
verification and remaining limitations are recorded" in two vocabulary Specs
before the suite had run and before any evidence row existed. Both
separate-context reviews failed on it, about 340k subagent tokens between
them, followed by two corrective Tasks, another suite run and a reassembly. The
reviews were right, but this is a mechanical fact a tool can check for free.

## Current Verified State

At the pre anchor, `workbench/tools/spec-report.mjs` `collectGaps` reports an
unchecked acceptance line, a missing or placeholder Completion Result, a Task
that is not done, and a done Task no evidence row names. It does not compare a
checked acceptance line with the evidence log. `report`'s gaps already gate
`retire-spec`, so a new gap reaches every existing consumer.
`spec-workbench.mjs report` runs that check by importing `spec-report.mjs`;
both are managed runtime tools in `workbench/tools/`, which reach rooms through
tool updates.

The closing line "Named verification and remaining limitations are recorded
without claiming owner approval." is standard Map-step wording: it appears in
the Acceptance Criteria of many current Specs, checked in some and unchecked in
others.

## Desired Behavior

1. When a Spec's verification acceptance line (as T-1 settles it) is checked,
   `report` looks at the evidence rows after the last row recording a Task
   close.
2. If none of those rows names a 40-hex candidate SHA and a suite result (as
   T-2 settles it) in its Verification cell, `report` adds the gap
   `Acceptance line N is checked but no evidence row after the last Task close records its verification`.
3. An unchecked verification line, or a Spec with no Task close yet, adds no
   new gap; the existing unchecked-line gap still applies.
4. The rule reads only the Spec's own record. It calls no Git command and runs
   no test.

## Decisions And Contracts

- **This Spec targets the template Workbench.** `spec-workbench.mjs` and the
  `spec-report.mjs` it runs are managed runtime tools that reach rooms through
  tool updates, so the shipped tools are Actuality and LLM_Workbench's claims
  about them are Canon. The Spec first updates the LLM_Workbench Canon,
  Grounding and Enduring Context that describe what `report` checks (named
  under Documentation Impact), then the tool. Why (owner): what is Actuality
  and what is not is what matters; LLM_Workbench's docs describe what the
  template is, does and how, so they lead.
- Row order in the append-only log, not dates, decides "after the last Task
  close".
- **Considered at the Map step, not proposed (agent reasoning, not an owner
  decision):** a new `assemble` verb that writes the Completion Result check
  and its evidence row together. It prevents the mistake rather than
  detecting it, but it adds a second way to write Spec state beside `close`,
  `receipt` and `verdict`, and the retro's failure was checking a box by hand,
  which a new verb would not stop.

### Open owner choices

- **T-1. Which acceptance lines count as verification lines?**
  Recommendation (not an owner answer): the standard closing line plus any
  checked line that names the Full suite. It is mechanical and covers both
  failures in the retro; matching every line containing the word
  "verification" would flag lines that mean something else.
- **T-2. What text counts as a suite result?** One option is the `TALLY` line
  the tracked Full suite runner
  ([S-004R](../S-004R-tracked-full-suite-runner/SPEC.md)) will print; that would
  make this Spec depend on the runner. Recommendation (not an owner answer):
  the Map-step draft's wording, a 40-hex candidate SHA plus a stated suite
  result in any form, so this Spec does not wait on the runner.
- **T-3. Should a `pass` verdict refuse while the gap exists?** No
  recommendation was made at the Map step; the draft kept `doctor`
  non-blocking and said nothing about `verdict`.

## Non-Goals

- Checking that the cited suite run really happened or really passed. Reviews
  and the tracked Full suite runner's receipt carry that.
- Rewriting historical Specs whose checked lines predate this rule. Their gap
  shows in `report`; fixing an old record is the owning Spec's business.
- Making `doctor` block on this gap.

## Dependencies And Blockers

No Spec blocks this one. The open owner choices T-1, T-2 and T-3 block the
Task cut. If T-2 is answered with the runner's `TALLY` line, the tracked Full
suite runner (S-004R) becomes a blocking Spec.

Coordination note, not a blocker: this Spec, Lifecycle Commands Print A Summary
(S-004U), Claim And Close Respect The Claimant (S-004V) and Tool-Written Task
Records (S-004W) all edit `workbench/tools/spec-workbench.mjs`. They do not
block each other; their Spec Planners order the Tasks that overlap.

## Vertical Implementation Slices

No Task is cut. Tasks are cut from live Actuality at activation with
`/to-tasks`. The intended direction is the describing docs first, then one
slice at the `collectGaps` seam with fixture Specs, then a survey of current
Specs the new gap flags.

## Acceptance Criteria

- [ ] The LLM_Workbench docs that describe what `report` checks state the new gap, updated before the tool change.
- [ ] A fixture Spec with a checked verification line and no evidence row after its last Task close shows the named gap in `report`.
- [ ] The same Spec with a later evidence row naming a candidate SHA and a suite result shows no such gap.
- [ ] An unchecked verification line and a Spec with no Task close add no new gap.
- [ ] A survey of current active Specs lists every Spec the new gap flags, with no record rewritten.
- [ ] Named verification and remaining limitations are recorded without claiming owner approval.

## Testing Seams

`tools/test-spec-report.mjs`, against fixture Spec records with and without the
later evidence row.

## Verification Procedure

Red/green at the gap seam, the targeted report tests, `doctor`, then the Full
suite on a committed candidate. Record actual commands and results in this
Spec.

## Documentation Impact

First, before the tool: the LLM_Workbench owners that describe what `report`
checks, namely `RUNBOOK.md` where it lists `report`'s checks, the
[Lifecycle tool behaviors](../../wiki/lifecycle-tool-behaviors.md) Wiki page,
the dispatcher and code-review skills only where they restate `report`'s gaps,
and the to-spec skill's closing acceptance line if its wording should name the
evidence row. Then the template copies that carry the same text, such as
`templates/RUNBOOK.md`, or a recorded exemption.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-07 | none | Authored at the Map step from an implement-spec retro at integration d0fb161c1ff36caf936758b7492f7ef7fce8176e. | Map only; `collectGaps` and its consumers were read at that tip; no runtime proof claimed. | This Spec. | Owner approval, Plan, implementation and proof remain. |
| 2026-10-07 | none | Revised from the owner grilling of 2026-10-07. Carries the template-target decision (update the LLM_Workbench docs describing `report` first, then the tool), the coordination note with S-004U, S-004V and S-004W on `spec-workbench.mjs`, and T-1, T-2 and T-3 as open owner choices. | Map only; no runtime proof claimed. | This Spec. | Owner answers to T-1, T-2 and T-3, Plan, implementation and proof remain. |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

None known.

## Supersession

- Supersedes: none
- Superseded by: none

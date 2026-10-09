---
date: 2026-10-09
supersedes:
canonicalized_in:
  - LEXICON.md
  - workbench/specs/S-004D-shared-interactive-board/SPEC.md
---

# The Dashboard colors by five questions, each strong or soft

## Decision

The Workbench Dashboard, of which the Grill Board is the first working form,
uses five hues and nothing else as signals. Each hue answers one question the
owner asks of any card, in any Dashboard section, and each hue comes in two
weights: **strong** means it needs the owner now or is happening now; **soft**
means the same thing, at rest. Ten colors, each with one meaning, learned once
and tracked across the whole Dashboard.

| Hue | The question it answers | Strong | Soft |
|---|---|---|---|
| **Priority** (orange) | How soon? | P1 Interrupt | P2 Committed; P3 is an outline |
| **Value** (yellow) | How much is it worth? | V1 Quick Win | V2 Strategic Value; V3 is an outline |
| **Yours** (blue) | Is the ball with me? | To answer, Drafts to approve, a Spec approval, an `owner:` blocker, the Confirm and Approve steps | Not now, parked by the owner |
| **Agents** (green) | Are agents carrying it? | Confirm, Answered awaiting an agent, In progress, Review and Verify, the agent recommendation and the agent-update banner | Applied, To do, finished and resting |
| **Returned** (purple) | Did it come back? | Revisit, the change verdicts when picked, Blocked, a failed Review or an owner finding | the same, resting |

Greys are the page, not signals: done, delivered, settled, history, backlog,
All open, and the grade-4 badges (P4 Backlog, V4 Defer / Eliminate) take no
hue. Selection, focus, Save and Next are ink, because they are the cursor and
the hand, not a state of the work. Where a dot is too small to carry a tint,
the weight is a shape: a filled dot is live, a hollow dot is at rest. Priority
and Value grades use only their two colors: grade 1 strong, grade 2 soft,
grade 3 an outline, grade 4 grey.

The Priority and Value badges the owner confirmed in
[Priority and Value help the Owner choose Grill Board questions (DDR-001L)](../001L-priority-and-value-help-the-owner-choose-grill-board-questions.md)
keep every meaning that record gives them; this record sets their colors to
Priority orange and Value yellow in place of that record's red and amber.

## Why

The owner's words, 2026-10-09: "a good dashboard can condense or segment all
of its info down into 8-10 indicators that I would need to pay attention to.
Its a UI theory for how to build strategy games. We have a very complex
dashboard and I need it to condense a lot of info down into a small bit of
space and mean a lot. So these colors have to go a long way, each need a why,
and I should be able to track things throughout the workbench by color. Like
'this thing is yellow, and value is yellow, so this must be valuable' those are
the micro second judgements that save me orchestration tax."

And, from the request that opened the work: "I shouldnt have more than 10
things I need to pay attention to on a dashboard, that is 5 base colors, with
a light and dark version. They should match the workflow and what is being
shown on the board so it lowers my orchestration tax."

The five questions are the five judgements an orchestrator makes before
reading a card: how soon, how much, whose court, is it moving, did it bounce.
Blue stays calm because the Priority badge beside it says how loud. Confirm is
green because confirming hands the ball to the agents. Rework is the costliest
signal, so it gets the one hue nothing else uses. Done takes no color, so
finished work stops asking for attention.

## Considered And Rejected

- **One hue per lane or workflow step.** Six lanes are not six questions; the
  lanes collapse onto whose court a card is in, whether it came back, and done.
- **Priority and Value in neutral grey, or borrowing the stage's hue.** The
  owner tracks Value by its color across the Dashboard, so Priority and Value
  keep their own hues.
- **Honey bronze `#F4AC45` as a signature color.** It sits between Priority
  orange and Value yellow and would read as half urgent, half valuable.
- **Purple Save and yellow selection.** A hue on the cursor or the hand would
  make a selected row look valuable or a save look like rework; both are ink.
- **A single-color signature strip or the SLK brand spectrum.** Rejected
  earlier in the same design pass; no rainbow, no brand strip.

## Consequences And Revisit Conditions

The [Lexicon](../../../../LEXICON.md#dashboard-colors) owns the shared names and
meanings of the five hues and the strong/soft rule. The
[Shared Interactive Workbench Board Spec (S-004D)](../../../specs/S-004D-shared-interactive-board/SPEC.md#priority-and-value-for-answering-questions)
owns the badge colors as a requirement and the delivery proof; the real Grill
Board page still carries its earlier colors until that Spec delivers them. The
[Dashboard color system](../../../wiki/design-concepts/dashboard-color-system.md)
Wiki page explains the mapping, the per-theme values and the contrast method.

Revisit if a Dashboard section needs a sixth question the five cannot carry,
or if the owner reports that two hues read as one in use.

## Destination Level

Blueprint level, refining the Dashboard experience delivered under the Shared
Interactive Workbench Board Spec (S-004D). It assigns no landmark and activates
no Task.

## Provenance

- The owner's request and theory in chat on 2026-10-09, quoted above.
- The design canvas **Grilling Board Redesign**, version 19
  (`1791535256-efc9`), where the palette was built, audited for contrast and
  read back: https://claude.ai/artifact/UNGoMhHhwobmMfneEC9Dss.
- The owner's one-word confirmation of the readback, "confirmed", with the
  direction to run `to-docs`, 2026-10-09.

## Reconciliation Boundary

Decision content is owner-confirmed (2026-10-09). The palette exists on the
design canvas only; carrying it into the real Grill Board page is a later,
separate request under S-004D.

---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - The owner's palette request and confirmed readback on the Grilling Board Redesign design canvas, 2026-10-09
  - The destination decision The Dashboard colors by five questions, each strong or soft (DDR-001Q), 2026-10-09
source_paths:
  - workbench/docs/ddr/001Q-the-dashboard-colors-by-five-questions-each-strong-or-soft.md
  - LEXICON.md
  - workbench/specs/S-004D-shared-interactive-board/SPEC.md
  - workbench/grill-board/README.md
parent: none
authorized_by: the owner's `to-docs` invocation after confirming the palette readback, 2026-10-09
last_verified: 2026-10-09
---

# Dashboard color system

This page explains how color works on the Workbench Dashboard: the browser
workspace whose first working form is the
[Grill Board](../../grill-board/README.md) and whose destination is the
[Shared Interactive Workbench Board Spec (S-004D)](../../specs/S-004D-shared-interactive-board/SPEC.md).
The decision itself is
[The Dashboard colors by five questions, each strong or soft (DDR-001Q)](../../docs/ddr/001Q-the-dashboard-colors-by-five-questions-each-strong-or-soft.md);
the shared names live in the [Lexicon](../../../LEXICON.md#dashboard-colors).
This page adds the reasoning, the per-section mapping, the theme values and
the contrast method.

## The idea

The owner's test for a dashboard is a strategy-game one: however complex the
state, it condenses into eight to ten indicators worth attention, and each
indicator is read in a microsecond. Color is the cheapest such indicator, so
every color on the Dashboard answers exactly one question, the same question
wherever it appears. Seeing a yellow badge on a Taskboard card means the same
as a yellow badge on a Grill Board question: this is valuable. Those
micro-judgements are what save the owner orchestration tax.

Five hues, each in two weights, make the ten colors. **Strong** means the
card needs the owner now, or is happening now. **Soft** means the same thing
at rest. Everything else on the page is grey.

## The five hues and why

| Hue | Question | Why this color |
|---|---|---|
| Priority, orange | How soon? | Heat is urgency, the one color every dashboard reads as "attend now". Orange marks only Priority, so an orange thing is always a *when*, never a *what*. |
| Value, yellow | How much is it worth? | Gold is worth, and it is the owner's own anchor. Yellow marks nothing else: not selection, not focus, not a brand strip. |
| Yours, blue | Is the ball with me? | The orchestration question is "am I the bottleneck?". Blue answers it calmly, because the Priority badge beside it says how loud. |
| Agents, green | Are agents carrying it? | Green is go. Confirm is green because confirming hands the ball to the agents; everything the agents say or hold is the same green, so their voice is never mistaken for the owner's. |
| Returned, purple | Did it come back? | Rework is the signal that costs the most: a thing the owner must look at twice. It gets the one hue nothing else uses. |

Grey is not one of the five. Done, delivered, settled, history, backlog, All
open and the grade-4 badges go grey: if it is grey, stop looking. Selection
and focus are an ink ring, Save and Next are ink buttons, and the Scale glyph
(Blueprint, Landmark, Spec, Task) is four bars in ink, because none of them is
a state of the work.

## Weight and shape

- A filled dot is live; a hollow ring is the same lane at rest. Lane and queue
  dots are too small for a tint, so the weight becomes a shape. Color is never
  alone: the lane's words sit beside the dot.
- Priority and Value grades use only their two colors. Grade 1 is the strong
  fill, grade 2 the soft tint, grade 3 an outline in the same hue, grade 4
  grey, because P4 Backlog and V4 Defer / Eliminate are not worth a color. The
  number is always printed; the weight only makes a P1 jump out of a list of
  P3s before it is read.

## Where each color shows

| Section | Blue, Yours | Green, Agents | Purple, Returned | Grey |
|---|---|---|---|---|
| Grill Board | To answer (strong); Not now (soft, hollow) | Confirm, Answered · awaiting an agent, the Recommended tag, the agent recommendation box, the agent-update banner, the progress bar (strong); Applied (soft, hollow) | Revisit · re-answer; Rework wording, Change the why and Change when picked | Settled elsewhere, All open |
| Taskboard | Awaiting the owner's approval; an `owner:` blocker | To do (soft, hollow); In progress and Needs review by agents (strong) | Blocked | Backlog, Complete |
| Destination Tracker | A card waiting for the owner's answer | A card answered and being derived into the Wiki or a Spec | An assessment contradicted and sent back | Derived; a landmark reached |
| Drafts to approve | A draft waiting on the owner | Approved, agents promoting | Sent back with the owner's note | Promoted |
| Spec gates | Approve this Spec | The Journey running | A failed Review or an owner finding | Delivered |
| Wiki | Only a draft of a page waiting on the owner | — | Only a draft sent back | Reading has no court |

Priority and Value badges appear beside the card in every section, with the
same four grades.

The workflow maps onto the courts. Using the parent names from the owner's
round-1 rework, still an open Grill Board question ("Your corrected workflow
map", GB-0001): Explore is blue (the owner decides what it is), Chart Course
and Journey are green (agents record, plan and build), Judge is green for
Review and Verify and blue for Approve, Complete is grey. The colors do not
depend on those names.

## Theme values

Each hue has one base value per theme, chosen so black label text and a
thin ring pass contrast on both grounds. Everything else derives from the base
by mixing in OKLab, the way CSS `color-mix(in oklab, …)` does.

| Hue | Dark theme base | Light theme base |
|---|---|---|
| Priority | `#FF5A1F` | `#F04E12` |
| Value | `#FFD60A` | `#F5C400` |
| Yours | `#4C9BE8` | `#2F86DC` |
| Agents | `#3DBE5A` | `#27A046` |
| Returned | `#A66BE0` | `#A66BE0` |

Derivations, with the pole being white on dark and black on light:

- strong fill: the base, with black text and a one-pixel ring in the dot color;
- soft tint: the base mixed 22% into the surface, with text in the tone ink;
- tone ink: the base mixed 40% toward the pole;
- outline: the base mixed 62% (dark) or 68% (light) toward the pole;
- dot: the base mixed 80% (dark) or 72% (light) toward the pole.

Mixing outlines and dots toward the pole rather than the surface is what lets
them clear 3:1 in both themes; the ring on strong fills is what gives yellow an
edge on white. The neutrals are unchanged from the earlier board: ground,
surface, raised, line, line-strong, muted and ink in each theme.

## Contrast method

Mix every derived color in OKLab exactly as `color-mix` does, then compute
WCAG contrast: 4.5:1 for text, 3:1 for outlines, rings and dots. Cover every
label on a strong fill, every tint's text, and every outline, dot and ring
against surface, ground and raised, in both themes. On 2026-10-09 that audit
checked 202 pairs with no failures; the lowest was the yellow badge's ring on
the light theme's raised grey at 3.39:1. The script lived in the design
session's scratchpad and is not tracked; rebuild it from this description when
the values change.

## What is delivered

Nothing on the real Grill Board page yet. The palette is published on the
design canvas **Grilling Board Redesign** (version 19,
https://claude.ai/artifact/UNGoMhHhwobmMfneEC9Dss), which is private to the
owner. The Shared Interactive Workbench Board Spec (S-004D) owns carrying it
into the page; its Priority and Value requirement names the colors.

## Evidence and Sources

- Governing: [The Dashboard colors by five questions, each strong or soft (DDR-001Q)](../../docs/ddr/001Q-the-dashboard-colors-by-five-questions-each-strong-or-soft.md); the [Lexicon's Dashboard Colors](../../../LEXICON.md#dashboard-colors); the [Shared Interactive Workbench Board Spec (S-004D)](../../specs/S-004D-shared-interactive-board/SPEC.md#priority-and-value-for-answering-questions) for the badge requirement.
- Evidentiary: the design canvas Grilling Board Redesign, version 19, and its contrast audit of 2026-10-09 (202 pairs, no failures), reported in the chat readback the owner confirmed.

## History

- 2026-10-09: created at the owner's `to-docs` invocation after he confirmed
  the five-hue readback. Source: the destination decision DDR-001Q and the
  design canvas named above.

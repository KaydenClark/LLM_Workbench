# S-004K - Workbench Term Dictionary Pages

**Spec ID:** S-004K
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-10-05
**Catalog description:** Give every Workbench term a brief Lexicon row and a Wiki dictionary page that carries its long definition, with the other definitions it uses linked inside it, in the shape of Matt Pocock's AI Coding Dictionary.
**Blockers:** none recorded. The Lexicon rows take one writer at a time, so its first Task waits on any open Lexicon writer. Implementation awaits Plan and assignment.
**Latest event:** Authored at the Map step from the owner's confirmed readback of 2026-10-05; no Task is cut.
**Next gate:** At Plan, inventory the Lexicon's Workbench terms against the existing dictionary pages from live Actuality and cut small Tasks.

> **Citation anchors.** pre=`4bec733a0246a73b5db05d314f61a4d6bd7de75a` post=`4bec733a0246a73b5db05d314f61a4d6bd7de75a`.

## Outcome

Every term the Workbench defines for itself, starting with the workflow verbs, has two places an agent or the owner can read it. The Lexicon row gives a single sentence or a very brief definition. A Wiki dictionary page gives the long version, with every other definition it uses linked inside it, so a reader can follow one term into its neighbors the way the [AI Coding Dictionary](https://www.aihero.dev/ai-coding-dictionary) works.

## Why It Matters

The owner, 2026-10-05, confirmed after readback: "Review gets a row, it should just not be entirely defined in there. Its single sentence or very brief definition is put in there, and then we need a dictionary page in the wiki so agents and I can read the long version with all of the other definitions used and linked inside of it. Like Matt Pococks dictionary and I have been asking for for a while now. I know we dont have these things built, but we should have them speced out and documented that I am asking for these things. Why does no one ever know what I am talking about?"

The request had no owner. The [AI Coding Dictionary Terms](../S-004E-ai-coding-dictionary-terms/SPEC.md) Spec does this for the nineteen terms imported from that dictionary only. The [Workbench Terms And Workflow Verbs](../S-004G-workbench-terms-and-workflow-verbs/SPEC.md) Spec gave each verb a Lexicon row and no dictionary page. No record stated the rule for the Workbench's own vocabulary, so each agent saw only the slice in front of it. Long Lexicon rows also cost every agent attention at session start, while the depth is only needed when a term is in question.

## Current Verified State

At the pre anchor:

- `LEXICON.md` holds 183 term rows, including one row per workflow verb and the Workbench terms the owner confirmed on 2026-10-03.
- `workbench/wiki/` holds eight `dictionary-*.md` pages, all for imported AI Coding Dictionary terms, routed from the "AI Coding Dictionary Entries" section of `workbench/wiki/MEMORY.md`. The open workflow-verbs PR adds a ninth, `dictionary-automated-review.md`, the first page that explains a workflow verb (Review) in depth.
- No dictionary page exists for any other Workbench term, and no rule says which Workbench terms need one.

No implementation or agent-outcome proof for this capability is claimed by this Map record.

## Desired Behavior

1. Each Workbench term's Lexicon row states its meaning in a single sentence or a very brief definition and links its dictionary page when it has one.
2. Each Workbench term that needs more than its row has a Wiki dictionary page holding the long version: what it means here, how it differs from its neighbors, the owner's words, and where the Workbench depends on it.
3. Every other defined term a page uses links to that term's page or row, so a reader can traverse the vocabulary.
4. The pages are routed from one Wiki dictionary section, so agents and the owner can browse them as one dictionary.
5. The workflow verbs come first, starting from the Review and Automated review page.

## Decisions And Contracts

- The Lexicon row is brief; depth goes to the Wiki dictionary page (owner, 2026-10-05, confirmed).
- The shape follows Matt Pocock's AI Coding Dictionary. That repository has no license, so pages restate meanings in Workbench words and link, never copy, as the AI Coding Dictionary Terms Spec already does.
- A dictionary page explains and routes; it authorizes nothing and never replaces the Lexicon row as the accepted meaning.

Open, not decided here:

- Which Workbench terms need a page beyond the workflow verbs, and whether every row gets one.
- Whether imported and Workbench terms share one dictionary section or two.

## Non-Goals

Changing any term's accepted meaning, adding new terms, or rewriting the imported AI Coding Dictionary entries, which the AI Coding Dictionary Terms Spec owns.

## Dependencies And Blockers

- Coordinate Lexicon writes with [AI Coding Dictionary Terms](../S-004E-ai-coding-dictionary-terms/SPEC.md) and [Workbench Terms And Workflow Verbs](../S-004G-workbench-terms-and-workflow-verbs/SPEC.md); one writer at a time.
- The Wiki structure owned by the Wiki rework applies to where pages live and how they are routed.

## Vertical Implementation Slices

No Tasks cut. At Plan, use current Actuality to cut small complete-path slices; a first slice is likely one workflow verb's brief row plus its linked page, checked by the Wiki lint and a Lexicon test.

## Acceptance Criteria

- [ ] Every workflow verb's Lexicon row is brief and links a dictionary page that carries its long version.
- [ ] Each dictionary page links the other defined terms it uses, and every link resolves.
- [ ] The pages are routed from one Wiki dictionary section.
- [ ] The rule for which Workbench terms get a page is recorded in its owner.
- [ ] Named verification and remaining limitations are recorded without claiming owner approval.

## Testing Seams

The Lexicon row tests in `tools/test-control-fidelity.mjs` and the Wiki validation and lint, over the real Lexicon and Wiki.

## Verification Procedure

Run the targeted Lexicon and Wiki tests and the full AGENTS suite, then `render` and `doctor`. Lint the touched Wiki pages.

## Documentation Impact

The Lexicon, the Wiki dictionary pages and the Wiki router. The AI Coding Dictionary Terms Spec keeps its own entries.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-05 | none | Authored at the Map step from the owner's confirmed readback of 2026-10-05 (grilling note review-timing-and-codex-spend-2026-10-05, question 9) at integration 4bec733a0246a73b5db05d314f61a4d6bd7de75a. | Map only; the row and page counts were read at that tip; no runtime proof claimed | This Spec | Everything in Desired Behavior |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

None recorded.

## Supersession

- Supersedes: none
- Superseded by: none

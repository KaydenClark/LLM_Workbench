# S-002P - writing-for-agents skill adoption

**Spec ID:** S-002P
**Status:** active
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-10-06
**Catalog description:** Write and edit skills so an agent takes the same process every run, adopted from Matt Pocock's writing-for-agents and replacing writing-great-skills.
**Blockers:** none. The delivered draft collection is available; the current owner request authorizes Core source adoption.
**Latest event:** Owner directed required Core adoption of retro and reiterated writing-for-agents; one isolated writer prepares both sources and their draft comparisons.
**Next gate:** Verify the assembled candidate, then independent review; integration delivery, owner Human QA and main closure remain separate.

> **Citation anchors.** pre=`07edccc57b8f75613ad1d09203a3e414d867b90c` post=`07edccc57b8f75613ad1d09203a3e414d867b90c`.

## Outcome

Matt Pocock's `productivity/writing-for-agents` is adopted as a new Workbench skill, `workbench/skills/writing-for-agents/`, and joins retro in the owner-requested Core adoption, taking the currently verified bundle from 28 to 30. It replaces `writing-great-skills`. The draft-wiki article, the comparison with Matt's skill and the skill source describe one behavior. This Spec also carries the retirement note for `writing-great-skills`: how it folds in, and that it leaves the owner's personal install only by his hand.

## Why It Matters

The owner wants the skills prototyped as a draft wiki before more is built on them. A skill about writing skills is the one every other skill rebuild depends on for its own `SKILL.md` wording. Today the nearest thing is `writing-great-skills`, which sits outside the core lane and is reached only by a name in an archived router. Adopting one maintained reference, with a recorded fold-in, removes the choice between two overlapping authoring references.

## Current Verified State

- `workbench/skills/writing-for-agents/` does not exist; there is no counterpart in `workbench/skills/`, `skills-pending/` or the draft wiki. The skill is new.
- `writing-great-skills` has two copies, byte-identical when diffed on 2026-09-30: the in-repo archive at `skills-archive/optional-active-2026-09-01/writing-great-skills/` (`SKILL.md`, 83 lines; `GLOSSARY.md`, 201 lines) and the owner's personal install at `~/.agents/skills/writing-great-skills/`.
- Its frontmatter sets `disable-model-invocation: true`. Its body is reference only: invocation choices, writing a description, an information hierarchy, when to split, pruning, leading words and a list of failure modes, with full definitions disclosed to `GLOSSARY.md`.
- Its only in-repo consumer found is the archived `skills-archive/optional-active-2026-09-01/ask-workbench/SKILL.md`, which routes to it by name. `workbench/feedback/REPORT-original-foundation-audit-2026-09-10.md` records the same skill as an authoring reference preserved under a "write-great-skill" row, with the exact rename "not independently established".
- `skills-archive/optional-active-2026-09-01/` holds five directories, and `tools/test-skill-catalog.mjs` hard-requires exactly `ask-workbench`, `brainstorm`, `grill-me`, `sitrep`, `writing-great-skills`. `grill-me` is already a core skill with its archived wrapper retained, so the archive and core lists already overlap.
- The closed-bundle count of 26 is asserted in `workbench/skills/README.md` (intro line and the `core-skills` catalog region), the Lexicon "Core skill bundle" row in `LEXICON.md` ("eighteen workflow skills, four coordination skills and four stance skills"), `workbench/manifest.json` `skillPolicy.required`, and the catalog tests. Whether the catalog tests assert the count itself, not just the list, is unchecked: an open question for step 1.
- The `skills-archive/optional-active-2026-09-01/writing-great-skills` row in the optional-source table of `workbench/skills/README.md` carries the disposition `owner decision required: preserve this writing-great-skills source pending retention or recoverable removal choice`. S-00R owns that table and a live Codex lane (`codex/S-00R-optional-inventory`) works on it.
- `THIRD_PARTY_NOTICES.md` at the repository root carries one MIT notice for files derived from `mattpocock/skills` (Copyright 2026 Matt Pocock), and the catalog test asserts that copyright line. It names no individual files; whether a new derived skill needs a per-file entry is an open question for step 6.
- Matt's `writing-for-agents` has not been read. The pin is `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60`; its content, supporting files and invocation setting are unknown until step 3.

## Desired Behavior

1. The skill gives an agent, or its author, a checkable reference for writing skills and other agent instructions so a run takes the same process each time. Its exact content is settled by steps 3-5, not fixed here.
2. A reader of the draft-wiki article can say what the skill does, when to reach for it, what it needs and what it reads and writes, from a second-person page without jargon.
3. The skill source in the Core lane, its catalog route, the bundle assertions and the draft article agree on behavior, source revision and limits, and the article's compared-with-Matt section states the verdict.
4. `writing-great-skills` is no longer a competing reference: anything of it that survives is folded into `writing-for-agents`, and the rest is recorded as dropped with a reason.

## Decisions And Contracts

### Current execution amendment, 2026-10-06

The owner explicitly requested `retro` as required in every Workbench and reiterated the already-requested `writing-for-agents`. Both sources go into `workbench/skills` and the required Core bundle. This supersedes the earlier Pending default and step-6 lane gate for retro, and the earlier arbitrary ask-workbench/brainstorm/sitrep ordering for writing-for-agents for this paired delivery. One writer changes the shared bundle from its verified 28 entries to 30; unrelated skill adoption and archived-source disposition stay with their owners.

S-002L has delivered the draft collection and Template 2 on integration, although its owner Human QA and main closure are still open. Those release gates do not prevent this requested draft work. The six investigation/draft/comparison/alignment/source steps are covered by one Task per skill from current Actuality. Existing Current Verified State bullets below remain dated pre-anchor observations, not current installation claims.

`retro` is explicitly invoked and proposes severity-ranked environment improvements without applying them. It loads the shipped writing reference, cites primary session evidence, checks existing guardrails and routes accepted interventions to `improve-harness`. `writing-for-agents` is a reusable authoring reference available to models and users. Its portable mechanics preserve Workbench skill composition and existing permission boundaries. The archived writing-great-skills source and personal installations stay intact; the new reference supersedes it for live Workbench authoring.


- Owner decision 2026-09-30: `writing-for-agents` replaces `writing-great-skills` and becomes Core. This Spec records that decision; it does not reopen it.
- Fold-in is a finding, not a presumption. Step 1 reads `writing-great-skills` as "ours" (read-only) and records what it contains. Step 4 compares it and Matt's skill and logs, per idea or term, whether it survives into `writing-for-agents`, is already covered by Matt's text, or is dropped. Whether `GLOSSARY.md` or any of its vocabulary (predictability, leading word, context pointer, premature completion, sediment and the others) survives is decided there, not now.
- Retirement of `writing-great-skills`:
  - The in-repo archive copy is repository provenance and is recoverable from git history. Whether it stays in `skills-archive/` or is removed is the owner's per-item decision under S-00R; the owner's 2026-09-30 decision (replaced by `writing-for-agents`) is recorded as that item's disposition. Step 6 records it in the Spec evidence and in the optional-source row only after coordinating with S-00R's live lane, and does not edit S-00R's Spec.
  - The personal install copy at `~/.agents/skills/writing-great-skills/` retires only by the owner's hand. No step of this Spec writes, moves or deletes anything under `~/.agents/skills`, and the core-skill installer refuses to write there.
- Origin is recorded at step 1 and step 3, not guessed: this skill is new as `writing-for-agents` and its Matt counterpart is `productivity/writing-for-agents`, but the true origin of `writing-great-skills` (Workbench, Matt, or other) is open.
- Step 6 uses Matt's MIT source with the upstream notice kept in `THIRD_PARTY_NOTICES.md`, adapted as the article settles. The adaptation is the Workbench's, so the skill source states its upstream relationship and pin; it does not claim Matt's wording is Workbench Canon.
- Invocation mode is an open question for step 3 and the owner: `writing-great-skills` is user-invoked and the Core skills are mostly model-invoked or deliberately user-invoked case by case; Matt's setting is unread.
- A Wiki article is curated context, not instruction authority or proof of behavior. Current source and tests establish Actuality; the Spec and accepted controls establish the target.

## Non-Goals

- Writing the article, reading or quoting Matt's files, or editing any skill source in this planning pass.
- Writing, moving, installing or deleting anything under `~/.agents/skills`, or retiring the personal-install skill.
- Editing S-00R or its optional-source table except as coordinated with its live lane, or changing the dispositions of any other archived or pending item.
- Adopting Matt's other skills, or the Foundry skills, through this Spec.
- Treating a green catalog test or a rendered article as owner Human QA or as proof an agent writes better skills.

## Dependencies And Blockers

- The S-002L draft location and template are delivered on integration and were read live for this work.
- Core lane authorization and shared-writer ordering are resolved by the current execution amendment above.
- The writing reference and retrospective ship together. Neither source relies on an absent skill or private installation.
- S-00R retains ownership of archived/pending-source disposition; this candidate changes neither archive nor personal copies.

## Vertical Implementation Slices

No Task is cut yet. Tasks are cut from live Actuality when this Spec is activated. The following is the intended slice direction, in six steps:

1. **Investigate ours.** Read `writing-great-skills` (`SKILL.md`, `GLOSSARY.md`) and any tests or callers at a named commit; record its inputs, outputs, writes and composition. `writing-for-agents` has no source of ours, so its "ours" is this skill. Record the true origin of `writing-great-skills`, its invocation mode and every in-repo consumer.
2. **Draft the article.** Fill the Template 2 draft article from step 1, at the tentative location `workbench/wiki/skills-draft/primitives/writing-for-agents.md` (tentative until S-002L decides), with `skill_source: new`, `supersedes` naming the retired reference and the pin `d81f3a1` in provenance.
3. **Investigate Matt's.** Read `productivity/writing-for-agents` at `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60`, including any supporting files and its invocation setting.
4. **Compare.** Fill "Compared with Matt's", log findings (one greppable line each), and record the fold-in of `writing-great-skills` per idea or term: survives, covered already, or dropped with a reason.
5. **Align the article.** Rewrite until its wording matches real or intended behavior and log what is left.
6. **Create the skill.** Add `workbench/skills/writing-for-agents/SKILL.md` from Matt's MIT source, adapted, with the notice kept in `THIRD_PARTY_NOTICES.md`, a catalog test and a fresh-context scenario. Update every closed-bundle touchpoint in one change, sequenced behind S-002O: the `workbench/skills/README.md` intro and catalog, the Lexicon "Core skill bundle" row, `workbench/manifest.json` `skillPolicy.required`, and the catalog tests including the five-archive-directory requirement (`ask-workbench`, `brainstorm`, `sitrep` and `writing-great-skills` have each been recorded for the archive; re-read the live assertion before editing, since earlier steps may have changed it). End the bundle at 30. Record the owner's 2026-09-30 decision as the S-00R per-item disposition for `writing-great-skills`, coordinated with S-00R's lane.

Steps 1-5 touch only the draft wiki. Step 6 is the only step that touches a skill lane or shared controls.

## Acceptance Criteria

- [ ] The `writing-for-agents` draft article has every Template 2 section filled, and every "needs" and "reads/writes" item resolves to something real or is logged as a finding.
- [ ] The comparison with Matt's skill at `d81f3a183412e71a5b1e84ca21bc1a35eea03a60` records a verdict (same, close, divergent or missing) and the behavior and clarity differences.
- [ ] The fold-in of `writing-great-skills` is recorded per idea or term (survives, covered, dropped with reason), and the retirement note states that the personal-install copy retires only by the owner's hand.
- [ ] `workbench/skills/writing-for-agents/SKILL.md` exists, matches the article, and `THIRD_PARTY_NOTICES.md` keeps the upstream MIT notice.
- [ ] Every closed-bundle touchpoint reads 30 consistently (README, Lexicon row, `skillPolicy.required`, catalog tests, the five-archive-directory requirement), and the owner's 2026-09-30 decision is recorded as the S-00R disposition for `writing-great-skills`.
- [ ] A fresh-context scenario shows an agent using the skill to write or edit a skill with the process the skill describes.
- [ ] The full suite from `AGENTS.md`, `node workbench/tools/wiki.mjs validate`, `render`, `doctor`, the Workbench self-drift pre/post receipts and a separate-context review of the immutable candidate are recorded at their proper gates; no unrun check is reported as passing.

## Testing Seams

Steps 1-5 are checked by reading: article sections, findings and the fold-in record. Step 6 uses the catalog tests as the structural seam (bundle membership, count, archive directories, notice text) and a fresh-context scenario as the behavior seam. Show red then green for each new catalog assertion. Structural tests prove routing, not that an agent writes better skills; conversational fidelity may still need human review.

## Verification Procedure

For step 6, run the targeted catalog and skills-lane tests, then `node workbench/tools/wiki.mjs validate`, then the full suite in `AGENTS.md` from a committed candidate. Run `node workbench/tools/spec-workbench.mjs render` and `doctor`, capture the self-drift pre/post receipts and a bounded semantic check, and review the immutable candidate separately before integration. Record actual commands and results in this Spec.

## Documentation Impact

- Draft article, tentative until S-002L decides: `workbench/wiki/skills-draft/primitives/writing-for-agents.md`.
- Step 6 touches: `workbench/skills/writing-for-agents/SKILL.md` (new), `workbench/skills/README.md` (intro, catalog, and the `writing-great-skills` optional-source row), `LEXICON.md` ("Core skill bundle" row), `workbench/manifest.json`, `tools/test-skill-catalog.mjs` and any other test that asserts the bundle, and `THIRD_PARTY_NOTICES.md` if a per-file entry is needed.
- `workbench/skills/README.md` and the Lexicon row are shared with the other three Core-bound Specs; edit them only after S-002O's step 6 has landed.
- Record `Docs checked; no update needed` with a reason for any owner step 6 does not change.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-30 | planning | Authored from the owner's draft-skills-wiki direction; the owner's decision that writing-for-agents replaces writing-great-skills and becomes Core is carried here | Planning only; writing-great-skills and the catalog test inspected read-only at the pre anchor; Matt's skill not read | This Spec authored; no article or skill authored | Delivery of S-002L, S-002O step 6, all six steps and independent review remain open |

| 2026-10-06 | planning | Owner explicitly selected required Core for retro and reiterated prior writing-for-agents request; paired delivery activated, earlier arbitrary ordering and Pending lane gate superseded | Fresh origin/integration 42431879; S-002L collection and Template 2 present; catalog red observed: writing-for-agents absent from required Core | Current execution amendment and one native Task per skill | Implementation, green checks, fresh-context scenarios, review and delivery pending |

## Completion Result

Not complete.

## Supersession

None for Specs; replaces the `writing-great-skills` skill (see Decisions And Contracts).

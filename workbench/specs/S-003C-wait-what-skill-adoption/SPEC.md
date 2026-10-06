# S-003C - wait-what skill adoption

**Spec ID:** S-003C
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-10-04
**Catalog description:** Adopt a small new productivity skill, `wait-what`, so the owner has one checked description of what it does and an aligned skill source.
**Blockers:** S-002L Skills draft wiki collection must deliver the draft-wiki location and article template before steps 2-5.
**Latest event:** Authored from the owner's 2026-09-30 draft-skills-wiki direction.
**Next gate:** Deliver S-002L, then activate this Spec and cut Tasks from live Actuality with `/to-tasks`.

> **Citation anchors.** pre=`07edccc57b8f75613ad1d09203a3e414d867b90c` post=`07edccc57b8f75613ad1d09203a3e414d867b90c`.

## Outcome

`wait-what` is adopted as a new skill in the productivity group of the draft skills wiki. One draft article, one comparison with Matt Pocock's `productivity/wait-what`, and one skill source describe the same behavior. This Spec also records what the skill is, since no Workbench source for it exists yet.

## Why It Matters

The owner wants to prototype the skills Wiki on the skills we have and find what is wrong before building further. `wait-what` is a skill with no history here, so it shows whether the draft article template works for a small new skill from nothing. It sits close to two things we already have, the personal `lexicon` skill and `domain-modeling`, so it is also a place where an overlap or a gap between them can show up as a finding. It is one of three skills the owner plans to run the template on first (`wayfinder`, `handoff`, `wait-what`); that pilot is a separate, unauthorized handoff and nothing here starts it.

## Current Verified State

- No `wait-what` skill exists in the repo or the owner's personal install. `workbench/skills/`, `skills-pending/` and `~/.agents/skills/` hold no directory by that name, and a search of the tree at the pre anchor found no mention of it outside the owner's own inventory. This Spec therefore does not know what the skill does. Step 3 establishes that from Matt's source at the pin; step 1 only records our nearest behavior.
- Our nearest behavior, checked read-only:
  - `~/.agents/skills/lexicon/SKILL.md` (personal only, no repo source) tells an agent to load the nearest `LEXICON.md` whole, use its terms exactly from the first reply, follow a term to its owning doc, and not report an open question as settled. It says supplying vocabulary is the whole job and routes a wrong map to `/ubiquitous-language` or `/domain-modeling`. Its own Spec is S-003O.
  - `skills-pending/domain-modeling/SKILL.md` is the active discipline of building the glossary and recording decisions as they form. It names `CONTEXT.md` and `docs/adr/`, which are Matt's paths and not ours. At the pre anchor its live Spec was S-002H; on 2026-10-04 S-002H was superseded by Required Domain Modeling Skill (S-004J), its current owner, so it is reference only here.
  - `LEXICON.md` carries accepted terms, including retired names with the date they retired (for example Portable layout and Portability model).
- The framing handed to this Spec is only that `wait-what` is a small new skill whose nearest neighbors are `lexicon` and `domain-modeling`. Whether it is actually about vocabulary or about something else is open until step 3.
- Default home is Pending, per the owner's 2026-09-30 decision that adopted skills default to Pending unless their own Spec says otherwise. `skills-pending/` is a root directory `AGENTS.md` Edit Scope does not list, and `workbench/skills/README.md` describes it as historical rewrite source outside discovery. A new skill placed there is not yet reachable by the catalog.
- `workbench/skills/README.md` and the S-00R Spec require a per-item owner decision for archive and pending relocation; this Spec does not move anything.

## Desired Behavior

1. The draft article, the comparison with Matt's counterpart and the skill source each say the same thing about what `wait-what` does, when to reach for it, what it needs, and what it reads and writes.
2. Every "needs" and "reads and writes" item in the article resolves to something real or is recorded as a finding. Overlap with `lexicon` or `domain-modeling` is either shown to be intended or recorded as an `overlap` finding with a named fixer.
3. The skill's home is decided and recorded: Pending by default, with the lane's edit authority named, unless the owner has moved it.

## Decisions And Contracts

- Group: productivity. Origin is expected to be `matt`, but step 3 records the true value; do not assume it now. `skill_source` is `new` until a source lands.
- This Spec compares with `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60`, path `productivity/wait-what`. His file is unread; Matt's site and files are outside evidence, not Workbench Canon, and his files are MIT-licensed under `THIRD_PARTY_NOTICES.md`. Summarize and cite; do not reproduce.
- Default to Pending (owner decision 1). Only the owner moves a skill into Core, and no Core touchpoint (the closed bundle in `workbench/skills/README.md`, `LEXICON.md`'s Core skill bundle row, `workbench/manifest.json` `skillPolicy.required`, the catalog tests) changes under this Spec.
- A new Pending skill needs a stated authority for the edit in step 6: S-00R governs optional-source disposition, and `skills-pending/` is not in `AGENTS.md` Edit Scope. Step 6 records the owner's written go-ahead for that lane, or stops and reports.
- A Wiki article is curated context, not instruction authority or proof of behavior. The skill source and its tests establish Actuality; the owner's decisions establish the target.

## Non-Goals

- Running the pilot on `wait-what`, or deciding anything about the other pilot skills.
- Merging `wait-what` into `lexicon` or `domain-modeling`, or editing either; S-003O and S-004J own those.
- Moving a skill into Core or changing the Core bundle.
- Writing any `LEXICON.md` term or ADR for the skill.
- Reading or copying Matt's text in this planning pass.

## Dependencies And Blockers

- S-002L Skills draft wiki collection must deliver the draft-wiki location and article template before steps 2-5. The tentative location is `workbench/wiki/skills-draft/productivity/wait-what.md`; the Template 2 shape belongs to S-002L.
- Step 6 depends on the lane decision above (S-00R and the owner). A live lane on S-00R's inventory work exists, so do not edit S-00R.
- Related, not blocking: S-003O (lexicon) and S-004J (domain-modeling), for the comparison of neighbors.

## Vertical Implementation Slices

These six steps are the intended slice direction. No Task is cut yet; Tasks are cut from live Actuality when this Spec is activated, using `/to-tasks`.

1. Investigate ours: record our nearest behavior at a named commit. Read `~/.agents/skills/lexicon/SKILL.md`, `skills-pending/domain-modeling/SKILL.md` and the `LEXICON.md` rules for how terms are used and retired. Record inputs, outputs, writes and composition, and confirm that no `wait-what` source exists. Decide which copy of any neighbor is canonical where a repo and a personal copy both exist. Record the true `origin`.
2. Draft the article: fill the Template 2 article from step 1 at the tentative `workbench/wiki/skills-draft/productivity/wait-what.md` (tentative until S-002L decides). Where the article cannot yet say what the skill does, record that as a finding and not as a guess.
3. Investigate Matt's: read `productivity/wait-what` at the pin `d81f3a183412e71a5b1e84ca21bc1a35eea03a60`. Establish what it does, its inputs, outputs, writes and what it composes with. Check the licence notice before citing.
4. Compare: fill "Compared with Matt's" with a verdict (same, close, divergent, missing) and log findings, including any overlap with `lexicon` or `domain-modeling`.
5. Align the article: rewrite until the wording matches real or intended behavior, and log what is left.
6. Create the skill: add `skills-pending/wait-what/SKILL.md` (Pending by default) with catalog tests and a fresh-context scenario, after the lane's edit authority is recorded. If the owner has instead decided on another home, follow that and record it.

Steps 1-5 touch only the draft wiki. Step 6 is the only step that touches a skill lane.

## Acceptance Criteria

- [ ] Every section of the `wait-what` draft article is filled.
- [ ] Every "needs" and "reads and writes" item in the article resolves to something real or is recorded as a finding.
- [ ] The comparison with `productivity/wait-what` at `d81f3a183412e71a5b1e84ca21bc1a35eea03a60` records a verdict and its findings, including any overlap with `lexicon` and `domain-modeling`.
- [ ] The skill source exists in its decided lane, matches the article, and the lane's edit authority is recorded.
- [ ] A fresh-context scenario exercises the skill, and the catalog and wiki suites are green for step 6.
- [ ] No Core touchpoint changed unless the owner moved the skill to Core.

## Testing Seams

The skill's public entry (its `SKILL.md` description and a prompt that should trigger it) and the catalog test for the lane it lands in. Structural catalog and Wiki checks prove routing, not agent behavior. A fresh-context scenario shows behavior; if the skill's behavior is judged by conversation, a human review may still be needed.

## Verification Procedure

Steps 1-5: run `node workbench/tools/wiki.mjs validate` and the draft-wiki checks S-002L delivers. Step 6: run the targeted catalog tests and the full suite in `AGENTS.md` from a committed candidate, render and doctor, capture the Workbench self-drift pre/post receipts, and have a separate context review the immutable candidate. Record actual commands and results in this Spec.

## Documentation Impact

Draft article: `workbench/wiki/skills-draft/productivity/wait-what.md` (tentative until S-002L decides). Step 6 touches only the skill's lane, `skills-pending/wait-what/` by default, and the tests that cover it. No Core control is touched unless the owner moves the skill; the skills README catalog and `LEXICON.md` stay as they are. Otherwise record `Docs checked; no update needed` with the reason.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-30 | planning | Spec authored from the owner's draft-skills-wiki direction; planning only | Nearest-neighbor sources (personal `lexicon`, pending `domain-modeling`, `LEXICON.md`) and the absence of a `wait-what` source inspected read-only at the pre anchor; no implementation | This Spec authored; no article or skill source written | S-002L, activation, Tasks and all six steps remain open |
| 2026-10-04 | reference repair | The domain-modeling owner changed: S-002H was superseded by Required Domain Modeling Skill (S-004J) | Read S-002H and S-004J at the remap branch; dated observations keep their anchor with the new owner noted | Current Verified State owner note, Non-Goals and Dependencies lines repointed | Unchanged |

## Completion Result

Not complete.

## Supersession

None.

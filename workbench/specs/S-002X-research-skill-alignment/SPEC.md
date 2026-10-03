# S-002X - research skill alignment

**Spec ID:** S-002X
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-30
**Catalog description:** Investigate a focused question against primary sources and return cited findings for a decision.
**Blockers:** S-002L Skills draft wiki collection must deliver the draft-wiki location and article template before steps 2-5; step 6 also needs the owner-approved S-00R route for any `skills-pending/` edit.
**Latest event:** Authored from the owner's 2026-09-30 draft-skills-wiki direction.
**Next gate:** Deliver S-002L, then activate this Spec and cut Tasks from live Actuality with `/to-tasks`.

> **Citation anchors.** pre=`07edccc57b8f75613ad1d09203a3e414d867b90c` post=`07edccc57b8f75613ad1d09203a3e414d867b90c`.

## Outcome

The draft Wiki article for `research`, the comparison with Matt Pocock's counterpart and the skill source all describe one behavior. The Spec also records what the skill reads and writes, above all where its findings are saved, and which of the two `research` skills that exist today is the one the Workbench means.

## Why It Matters

The owner wants to prototype the skills Wiki on the current skills to find what is wrong: skills that should connect and do not, and skills that connect and do not work together. `research` is a small skill with a large storage question. The pending copy tells a background agent to save findings "where the repo already keeps such notes", but this repository has no such place for it to find, so the skill can only guess. Drafting the article forces that question into the open.

## Current Verified State

- `skills-pending/research/SKILL.md` is a 12-line source, unchanged since the "Curate Workbench skills and add shared Lexicon (#27)" commit (`6943c106`). It is byte-identical at the pre anchor and in the worktree. It is also identical in this repository's provenance commit `bcfa55d4d33b3a815e899eeb9e60c7629d462d82` (named in `workbench/skills/README.md`), and the Workbench's third-party notice covers files derived from `mattpocock/skills`; that suggests, but does not prove, an unmodified copy of Matt's skill, so step 1 byte-diffs it against the pin.
- Its behavior: spin up a background agent; investigate against primary sources (official docs, source code, specs, first-party APIs); write the findings to one Markdown file citing each claim; save it "where the repo already keeps such notes", matching the convention, or choose a place and say where.
- The skill is not in the core bundle or `workbench/manifest.json`. `workbench/skills/README.md` lists `skills-pending/research` in the optional-source table as unshipped, with the disposition "owner decision required" (reviewed 2026-09-19), and lists `research` in the referenced-skills table as "out of scope": the Blueprint names research as an activity, not the skill.
- A different `research` skill exists in the owner's personal install (`~/.agents/skills/research/SKILL.md`, read-only, a separate Git repo). Its description is "Investigate a focused question with primary sources and return cited findings for a decision." It keeps the result conversational unless the assigned Spec requires durable evidence, in which case it adds a concise linked finding to that Spec, and it says research does not make product decisions or create a parallel knowledge base. The two skills share a name and disagree on where output goes (a repo Markdown file versus chat or a Spec finding) and on whether to use a background agent. This Spec does not decide which wins.
- Candidate storage conventions in the repo, none of which the skill names: `research templates/README.md` and `tools/new-research-project.mjs` (a folder-per-investigation workflow whose default root is `research/`, a directory that does not exist in this tree), Spec evidence rows, and `workbench/wiki/`. Whether any is the "existing convention" the pending skill assumes is an open question for step 1.
- `BLUEPRINT.md` says Align reaches for research "as far as a named uncertainty requires", and the grilling ledger records research as an allowed Align investigation. No skill currently routes to `research`.
- No draft Wiki article for `research` exists, and no scenario for this skill has been run. Whether a background-agent facility is available in every harness is unverified.

## Desired Behavior

1. A reader of the draft article can say what `research` does, when to use it, what it needs, where its findings end up, and how to tell it worked.
2. Every "needs" and "reads and writes" item in the article resolves to something real or is logged as a finding. In particular, the storage destination is named, or the missing convention is a finding with an owner.
3. The article records the verdict against the counterpart (same, close, divergent or missing) and the relationship between the pending and personal `research` skills.
4. After step 6 the skill source says the same thing as the article.

## Decisions And Contracts

- This Spec owns `research` alone. The two-skill name collision is recorded as a finding and resolved only by step 5/6 within the owner's stated decisions: the owner adopted Matt's `engineering/research` and left other adopted skills Pending until their own Spec says otherwise.
- The article is curated context, not instruction authority. Current source and tests establish Actuality; the accepted controls and the assigned Spec establish the target.
- Matt Pocock's skill is outside evidence, compared at the pin `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60` (MIT; notice in `THIRD_PARTY_NOTICES.md`). Summarize and cite; do not reproduce.
- Steps 1-5 touch only the draft wiki. Step 6 is the only step that touches a skill lane, and it needs an authorizing route: `skills-pending/` is not in the `AGENTS.md` Edit Scope, so S-00R (core skill lifecycle and optional-source disposition) is the route, with a per-item owner decision for this skill.
- The skill stays Pending unless the findings justify another outcome; any promotion is an owner decision recorded in S-00R, not made here.

## Non-Goals

- Choosing the storage convention for research output by invention, or answering Q2A (where `wayfinder` keeps pre-Spec decisions); `wayfinder` may consume research findings and that dependency is recorded, not resolved.
- Reading or quoting Matt's files before step 3, or writing his words into the article.
- Adding a research knowledge base, a new Wiki collection, or a new tool.
- Editing the personal install, S-00R or any other Spec's content.
- Moving, archiving or promoting the skill before step 6 and an owner decision.

## Dependencies And Blockers

- **S-002L Skills draft wiki collection** must deliver the draft-wiki location (tentatively `workbench/wiki/skills-draft/shaping/research.md`) and the article template before steps 2-5.
- Step 6 needs S-00R's per-item authorization to edit `skills-pending/research`. A live Codex lane `codex/S-00R-optional-inventory` was reported on 2026-09-30; check `git worktree list` and open PRs before step 6 and do not collide with it.
- Related, not blocking: `wayfinder` (Q2A open), `grill-me` and `brainstorm` (Align routing), `loop-me`, and the research workflow in `research templates/`.

## Vertical Implementation Slices

No Task is cut yet. The six steps below are the intended slice direction; `/to-tasks` cuts Tasks from live Actuality when this Spec is activated.

1. Investigate ours. Read `skills-pending/research/SKILL.md`, byte-diff it against the pin's counterpart, and record at a named commit its inputs, outputs, writes and composition. Settle where findings are saved, which of the repo conventions listed above (if any) it assumes, whether it needs a background-agent facility, and how it relates to the personal `research` skill. Check for tests that mention it.
2. Draft the article. Fill Template 2 from step 1 at the tentative location `workbench/wiki/skills-draft/shaping/research.md` (tentative until S-002L decides), with group `shaping`, skill_source `pending` and the true `origin` recorded from step 1.
3. Investigate Matt's. Read `engineering/research` at `d81f3a183412e71a5b1e84ca21bc1a35eea03a60`.
4. Compare. Fill "Compared with Matt's" with a verdict and the behavior and clarity differences, and log findings as `F:research:NN` lines (kinds `dangling`, `stale-name`, `overlap`, `gap`, `conflict`, `missing-skill`).
5. Align the article. Rewrite until its wording matches real or intended behavior and log what is left.
6. Fix or create the skill. Edit `skills-pending/research/SKILL.md` as needed (for example, name a real storage destination), under the S-00R route, with catalog tests and a fresh-context scenario.

## Acceptance Criteria

- [ ] The draft article has every Template 2 section filled, including a stated destination for research output.
- [ ] Every "needs" and "reads and writes" item resolves to something real or is logged as a finding.
- [ ] The pending-versus-personal `research` collision and the missing storage convention are findings with an owner.
- [ ] The comparison with `engineering/research` at `d81f3a1` records a verdict.
- [ ] The skill source matches the article; any edit to `skills-pending/research` names its S-00R authorization.
- [ ] The suites required by step 6 are green, and no unrun check is reported as passing.

## Testing Seams

Steps 1-5 are documentation; check them with `node workbench/tools/wiki.mjs validate` once S-002L's collection exists, and by grepping the findings lines. Step 6 changes a skill source, so use the catalog tests (`tools/test-skill-catalog.mjs` reads the optional-source table) plus a fresh-context scenario: a cold agent given a question follows the skill and saves findings where the article says. Structural checks prove routing, not agent behavior.

## Verification Procedure

For steps 1-5, run wiki validation and `node workbench/tools/spec-workbench.mjs render` and `doctor`. For step 6, run the full suite in `AGENTS.md` from a committed candidate, capture the self-drift receipts, and have a separate context review the immutable candidate. Record the actual commands and results in this Spec.

## Documentation Impact

- The draft article at `workbench/wiki/skills-draft/shaping/research.md` (tentative until S-002L decides), plus the draft-wiki index entry S-002L defines.
- Step 6 may touch `skills-pending/research/SKILL.md` and the `skills-pending/research` and `research` rows in `workbench/skills/README.md`. It touches no other control unless the skill's meaning changes; otherwise record `Docs checked; no update needed`.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-30 | planning | Spec authored for the draft skills wiki; names `research` alignment and the open storage question | Pending skill read and hashed at the pre anchor; personal copy read-only; no behavior trial | This Spec authored; no article or skill source written | Enabling S-002L, Tasks and all six steps remain open |

## Completion Result

Not complete.

## Supersession

None.

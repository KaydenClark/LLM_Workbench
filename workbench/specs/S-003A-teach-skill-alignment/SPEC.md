# S-003A - teach skill alignment

**Spec ID:** S-003A
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-30
**Catalog description:** Teach a topic through a stateful sequence of small lessons grounded in the learner's goal and current understanding.
**Blockers:** S-002L Skills draft wiki collection must deliver the draft-wiki location and article template before steps 2-5; step 6 also needs S-00R's per-item owner decision for `skills-pending/` to be recorded as the authorizing route.
**Latest event:** Authored from the owner's 2026-09-30 draft-skills-wiki direction.
**Next gate:** Deliver S-002L, then activate this Spec and cut Tasks from live Actuality with `/to-tasks`.

> **Citation anchors.** pre=`07edccc57b8f75613ad1d09203a3e414d867b90c` post=`07edccc57b8f75613ad1d09203a3e414d867b90c`.

## Outcome

The draft Wiki article, the comparison with Matt Pocock's `teach`, and the `teach` skill source all describe one behavior. That includes the question the skill raises about itself: where a learner's state lives between lessons, and whether the answer fits the Workbench's existing owners.

## Why It Matters

The owner wants to prototype the skills Wiki on the current skills to find what is wrong: skills that should connect and do not, and skills that connect and do not work together. `teach` is stateful by its own description, so it is a direct test of the "what it reads and writes" section. It currently has two different answers in two copies (see Current Verified State), and nothing in the repository says which one the Workbench means. The owner's decision 4 adopts `teach`, so the answer needs an owner before the skill is trusted.

## Current Verified State

- The in-repo source is `skills-pending/teach/`: `SKILL.md` plus `GLOSSARY-FORMAT.md`, `LEARNING-RECORD-FORMAT.md`, `MISSION-FORMAT.md` and `RESOURCES-FORMAT.md`. `workbench/skills/README.md` lists it under optional-source review as "owner decision required: preserve this teach source pending retention or recoverable removal choice", with no operational consumer found. It is outside discovery and outside the Core bundle.
- The personal install holds a different file, `~/.agents/skills/teach/SKILL.md` (read-only; the owner's own Git repo), with no supporting files. A read-only `diff -r` at the pre anchor shows the **personal copy is the Workbench rewrite** and the in-repo pending copy is the longer upstream-style text. Which copy is canonical is a step 1 item.
- The pending copy keeps learner state in the current directory as a "teaching workspace": `MISSION.md`, `RESOURCES.md`, `NOTES.md`, `./learning-records/*.md` (numbered `0001-slug.md`), `./lessons/*.html`, `./reference/*.html` and `./assets/*`. Lessons are self-contained HTML, built from shared assets, and opened for the user with a CLI command. It sets `disable-model-invocation: true` and an `argument-hint`.
- The personal copy is a few lines: start from the learner's purpose, prior knowledge and success state; teach one concept at a time; ask the learner to apply it; keep "a lightweight conversational recap"; create a durable artifact only on request, "using the repository's existing documentation owner instead of a new educational store". It sets no `disable-model-invocation`, so its description loads every session. It describes itself as stateful yet defines no store, so its state between lessons is undefined.
- The pending copy's own links disagree. `SKILL.md` never links `GLOSSARY-FORMAT.md` and its file list has no `GLOSSARY.md`, yet `GLOSSARY-FORMAT.md` and `LEARNING-RECORD-FORMAT.md` assume a root `GLOSSARY.md` and a `[[MISSION.md]]` link. `SKILL.md` puts glossaries under `./reference/*.html`. `RESOURCES-FORMAT.md` and `GLOSSARY-FORMAT.md` say "explainers" where `SKILL.md` says "lessons". Whether these are upstream drift or ours is open for step 1.
- State placement conflicts with Workbench owners. `workbench/skills/notepad/SKILL.md` makes a notepad the working context of one objective, but never evidence or authority; durable truth belongs in an existing owner. A learning record is closer to a decision record than a note, and a `MISSION.md` in an arbitrary directory is a new store. No Spec or Wiki article routes learner state today.
- No `teach` Wiki article exists (`workbench/wiki/skill-*.md` has none). No current Spec owns this skill.

## Desired Behavior

1. A reader of the draft article can say, before running the skill, what it needs, what it reads and writes, and where learner state lives between lessons, and each answer resolves to something real or is a recorded finding.
2. The skill's source says the same thing, with one declared home for learner state that follows Workbench ownership (or a stated, owner-accepted exemption).
3. The comparison with Matt's `teach` records whether the Workbench copy is `same`, `close`, `divergent` or `missing`, and which differences are deliberate.
4. The decision about invocation (model-invocable versus explicit only) is made on purpose and recorded, not inherited from whichever copy was installed.

## Decisions And Contracts

- This Spec owns `teach` alone. The draft article is curated context, not instruction authority or proof of behavior; source and tests establish Actuality.
- Template 1's six steps and Template 2's article shape are owner-approved and owned by S-002L; this Spec adapts them and does not restate or redefine them.
- Matt's skill is outside evidence, compared only at the pin `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60`. Adopting anything from it is the owner's decision; decision 4 adopts `teach` as a skill, not any specific behavior.
- The `origin` field is recorded from what step 1 finds, not guessed now.
- Core or Pending: `teach` stays **Pending** unless step 1-5 findings justify otherwise. A move to Core would change the closed Core bundle and is a separate owner decision.
- Step 6 edits `skills-pending/teach/`, which `AGENTS.md` does not list in Edit Scope. S-00R is the authorizing route (its per-item owner decision covers pending source); step 6 must name that route and may not edit the personal install.

## Non-Goals

- Choosing where learner state lives; step 1 records the options and step 5/6 apply the owner's answer. This Spec does not invent that answer.
- Moving, archiving, installing or deleting any skill, or editing the personal install.
- Building a curriculum product, a new educational store, or a Wiki collection for learners.
- Treating a green suite or a finished article as owner Human QA.

## Dependencies And Blockers

- **S-002L Skills draft wiki collection** must deliver the draft-wiki location and article template before steps 2-5.
- S-00R must supply the per-item disposition that authorizes editing `skills-pending/` in step 6. A live Codex lane exists on S-00R; this Spec does not amend it.
- S-00Y (notepad) is the nearest Workbench owner for per-objective working context. Step 1 reads it to decide whether learner state is a notepad, a durable owner, or neither; it is not a prerequisite for steps 1-5.

## Vertical Implementation Slices

No Task is cut yet; Tasks are cut from live Actuality at activation by `/to-tasks`. The intended slice direction, in order:

1. Investigate ours. Read both copies of `teach` and the four format files, run a read-only diff, and record inputs, outputs, every file it reads or writes, and composition at a named commit. Record which copy differs and make "which copy is canonical" a first decision. Record the true origin, the invocation setting of each copy, and where learner state lives in each. Check the findings above (unlinked glossary, `explainers` versus `lessons`, undefined state in the personal copy).
2. Draft the article from Template 2 (owned by S-002L) at the tentative location `workbench/wiki/skills-draft/productivity/teach.md`, tentative until S-002L decides. "What it reads and writes" must name the learner-state location or become a finding.
3. Investigate Matt's. Read `productivity/teach` at the pin `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60`, including its supporting files.
4. Compare. Fill "Compared with Matt's", record a verdict (same, close, divergent or missing) and log findings as `F:teach:NN` lines, using the finding kinds dangling, stale-name, overlap, gap, conflict and missing-skill.
5. Align the article until its wording matches real or intended behavior, logging what is left open, including the learner-state decision if the owner has not made it.
6. Fix the skill source in its lane (`skills-pending/teach/` unless step 1-5 move it), with catalog tests and a fresh-context scenario in which a second session resumes a learner from recorded state. Name S-00R as the authorizing route.

Steps 1-5 touch only the draft wiki. Step 6 is the only step that touches a skill lane.

## Acceptance Criteria

- [ ] `workbench/wiki/skills-draft/productivity/teach.md` (path tentative until S-002L) has every Template 2 section filled.
- [ ] Every "needs" and "reads and writes" item resolves to something real or is a logged finding, including the learner-state location and each of the four format files.
- [ ] A verdict against Matt's `teach` at the pin is recorded, with behavior and clarity differences.
- [ ] Which copy is canonical, the true origin, and the invocation setting are recorded as decisions with their source.
- [ ] The skill source matches the article (or the article records the difference as an open finding), and states one home for learner state.
- [ ] A fresh-context scenario shows a second session picking up the learner's mission and next lesson from recorded state without the owner restating it.
- [ ] Catalog tests, Wiki validation and the full suite in `AGENTS.md` are green from a committed candidate for step 6; no unrun check is reported as passing.

## Testing Seams

Steps 1-5 produce a Wiki article, so the seam is Wiki validation plus a read-back that every "needs" and "reads and writes" item resolves. For step 6, the public entry is the skill's own text through the catalog tests (`tools/test-skill-catalog.mjs`, which treats `skills-pending` as an optional root) and a fresh-context scenario. Structural checks prove routing, not teaching quality; a human review may be needed for conversational fidelity. Show red then green at the nearest meaningful seam if behavior changes.

## Verification Procedure

For steps 1-5, run `node workbench/tools/wiki.mjs validate` and the draft collection's own checks from S-002L, then `render` and `doctor`. For step 6, run the targeted catalog test, the full suite in `AGENTS.md`, the Workbench self-drift pre/post receipts, and a separate-context review of the immutable candidate. Record the real commands and results in this Spec's log.

## Documentation Impact

- Draft article: `workbench/wiki/skills-draft/productivity/teach.md` (tentative until S-002L decides).
- Step 6 touches `skills-pending/teach/` and, if the skill's status changes, the `skills-pending/teach` row in `workbench/skills/README.md`'s optional-source review. Record `Docs checked; no update needed` for anything else.
- No change to Core bundle controls is expected; a move to Core would need its own owner decision.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-30 | planning | Spec authored from the owner's draft-skills-wiki direction; no Task cut and no implementation performed | Both `teach` copies read and diffed read-only at the pre anchor; no behavior change or scenario trial | This Spec authored; no article or skill source touched | S-002L, canonical-copy decision, learner-state decision and steps 1-6 remain open |

## Completion Result

Not complete.

## Supersession

None.

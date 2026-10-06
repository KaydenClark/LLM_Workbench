# S-003F - loop-me skill alignment

**Spec ID:** S-003F
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-30
**Catalog description:** Find a recurring workflow worth delegating and grill it into a spec an implementer could build without asking anything.
**Blockers:** S-002L Skills draft wiki collection must deliver the draft-wiki location and article template before steps 2-5.
**Latest event:** Authored from the owner's 2026-09-30 draft-skills-wiki direction.
**Next gate:** Deliver S-002L, then activate this Spec and cut Tasks from live Actuality with `/to-tasks`.

> **Citation anchors.** pre=`07edccc57b8f75613ad1d09203a3e414d867b90c` post=`07edccc57b8f75613ad1d09203a3e414d867b90c`.

## Outcome

The draft Wiki article, the comparison with Matt Pocock's `in-progress/loop-me`, and the loop-me skill source all describe one behavior. That includes saying plainly what the skill writes, where, and which skill takes the result next. This Spec owns the loop-me draft article, its comparison and findings, and any resulting source change to the skill. It stays Pending unless step 1 finds a reason to change that, and the owner decides the change.

## Why It Matters

The owner wants to prototype the skills Wiki on today's skills to find where skills fail to connect or connect and do not work together. Loop-me is a likely source of such findings: two different texts exist for it, and one of them points at a skill name that has since been replaced. The article does not instruct the agent or replace the executable source.

## Current Verified State

All of this was read at the pre anchor; none of it was byte-diffed against Matt's tree.

- `skills-pending/loop-me/SKILL.md` is the repository copy. It runs a stateful `/grilling` session "whose only output is workflow specs", with a "loop lens", a four-term vocabulary (trigger, checkpoint, push right, brief), a definition of done ("an implementer agent could build it without asking a single question") and a workspace of `workflows/*.md` plus `NOTES.md`. It sets `disable-model-invocation: true`.
- This text reads like Matt's `in-progress/loop-me`; that is the handoff's reading of the third-party notice, not a verified fact. Step 1 verifies it.
- A different `loop-me` sits in the owner's personal install, `~/.agents/skills/loop-me/SKILL.md` (read-only, a separate Git repo). Its description is "Discover a recurring workflow worth delegating and turn it into an implementable Workbench capability." It requires a repeated outcome with trigger, inputs, owner, failure boundary and observable result, says to grill the workflow, then "route it through `/to-spec` and `/to-tickets`; use `/wayfinder` if key decisions remain foggy", and forbids hidden schedules or automation. The two files disagree on description, output and next step.
- The repository copy writes `workflows/*.md` and `NOTES.md`. Neither exists in the repository root, and `LEXICON.md` defines no "workflow spec" or "loop". The personal copy writes no file itself; it hands off to `/to-spec`.
- `/to-tickets` is the stale name of `to-tasks` (`workbench/skills/to-tasks/SKILL.md`); `/to-spec` is core; `/wayfinder` is Pending (`skills-pending/wayfinder/SKILL.md`). The personal copy therefore depends on one core skill, one Pending skill and one retired name.
- `workbench/skills/README.md` lists `skills-pending/loop-me` as preserved outside discovery, with "No operational consumer established" and an owner decision required on retention. `skills-pending/` is not in `AGENTS.md` Edit Scope; S-00R (`workbench/specs/S-00R-core-skill-lifecycle-and-optional-source-disposition/SPEC.md`) governs optional-source dispositions and is the authorizing route for step 6.
- No draft article or `workbench/wiki/skill-loop-me.md` exists. Matt's counterpart is not read yet.

## Desired Behavior

1. One loop-me source states what it produces and where it lands, and every skill it names resolves to a real, current skill or is recorded as a finding.
2. The draft article matches that source and records which of the two existing texts is the lineage, so a reader is not told two things.
3. The comparison with Matt's skill is recorded with a verdict (same, close, divergent, missing) and findings that a later roll-up can list.

## Decisions And Contracts

- This Spec owns loop-me alone. Neighboring skills (`wayfinder`, `to-spec`, `to-tasks`, `grilling`) keep their own Specs; this Spec records a finding against them and does not edit them.
- Grouped under `shaping`; Matt counterpart `in-progress/loop-me`, which is not promoted upstream. Upstream is read only at the pin `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60`.
- The draft article is curated context, not instruction authority or proof of behavior. Source and tests establish Actuality.
- Whether loop-me stays Pending, becomes Core, or is retired is an open owner decision for step 1 to inform; the owner's 2026-09-30 decisions name `ask-workbench`, `brainstorm`, `sitrep` and `writing-for-agents` as the Core additions, not loop-me. `grill-with-docs` stays excluded.

## Non-Goals

- Moving, archiving, installing or promoting the skill, or editing `skills-pending/` outside step 6 under S-00R.
- Writing to `~/.agents/skills`; editing the Core bundle assertions; answering Q2A (where `wayfinder` stores provisional decisions); adding a `workflows/` lane or `NOTES.md` convention to the Workbench.
- Treating the article, a source review or a green suite as owner Human QA.

## Dependencies And Blockers

- S-002L Skills draft wiki collection must deliver the draft-wiki location and article template before steps 2-5. Step 1 may begin earlier but writes nothing to the Wiki.
- Step 6 needs S-00R's per-item owner decision for anything under `skills-pending/`.
- Open question for step 1: which of the two loop-me texts is the intended one, and whether the Workbench wants Matt's `workflows/*.md` model at all given that its own record is a Spec.
- Open question for step 1: the owner's catalog presents the personal-install description, while the repository holds Matt's text. Neither is verified as the one to align to.

## Vertical Implementation Slices

No Task is cut yet; Tasks are cut from live Actuality at activation by `/to-tasks`. The intended slice direction, in prose:

1. Investigate ours. Read both loop-me texts and any tests or catalog rows that name the skill. Record inputs, outputs, writes and composition at a named commit, byte-diff the repository copy against Matt's file (so "appears unmodified" becomes a fact), and record the true `origin`.
2. Draft the article. Fill the draft-article template that S-002L owns at `workbench/wiki/skills-draft/shaping/loop-me.md`, tentative until S-002L decides.
3. Investigate Matt's. Read `in-progress/loop-me` at `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60`, noting that it is not promoted upstream.
4. Compare. Fill "Compared with Matt's" and log findings; likely kinds are `dangling` (`workflows/*.md`, `NOTES.md`), `stale-name` (`/to-tickets`), `overlap` with `grilling` and `wayfinder`, and `conflict` between the two local texts.
5. Align the article until its wording matches real or intended behavior; log what remains.
6. Fix or create the skill. Edit `SKILL.md` in its lane (S-00R authorizes work under `skills-pending/`) with catalog tests and a fresh-context scenario.

Steps 1-5 touch only the draft wiki; step 6 is the only step that touches a skill lane.

## Acceptance Criteria

- [ ] Every section of the draft article is filled, and the verdict (same, close, divergent or missing) against Matt's `in-progress/loop-me` is recorded.
- [ ] Every "needs" item (`/grilling`, `/to-spec`, `/to-tasks`, `/wayfinder`) and every "reads and writes" item (`workflows/*.md`, `NOTES.md`) resolves to something real or is logged as a finding.
- [ ] The two divergent loop-me texts are reconciled in the article, with the chosen lineage and the `origin` recorded.
- [ ] The skill source matches the article, after S-00R's per-item owner decision.
- [ ] The relevant skill-catalog tests and the full suite in `AGENTS.md` are green for step 6, and a fresh-context scenario is observed; no unrun check is reported as passing.

## Testing Seams

The skill's public entry (`/loop-me`) and its nearest catalog test, `tools/test-skill-catalog.mjs`, which already carries rows for `skills-pending/` sources. Structural checks prove routing, not conversational behavior; step 6 needs a fresh-context scenario in which a new session is asked to design one recurring workflow and shows where it writes and what it hands to next. If behavior changes, show red then green at the closest seam.

## Verification Procedure

For steps 1-5: record the commit read, the Matt pin, and each finding on one greppable line. For step 6: targeted catalog tests, `node workbench/tools/wiki.mjs validate` once the draft collection exists, the full `AGENTS.md` suite from a committed candidate, `render` and `doctor`, and separate-context review before integration. Record actual commands and results in this Spec.

## Documentation Impact

Draft article at `workbench/wiki/skills-draft/shaping/loop-me.md` (tentative until S-002L decides). Step 6 may touch `skills-pending/loop-me/SKILL.md` and its row in `workbench/skills/README.md`, plus `tools/test-skill-catalog.mjs` if the skill's lane changes. Record `Docs checked; no update needed` where a control does not change.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-30 | planning | Spec authored from the owner's draft-skills-wiki direction; no Task cut | Repository and personal-install loop-me texts read at the pre anchor; Matt's file not read; no implementation evidence | This Spec authored; no article yet | S-002L, all six steps and independent delivery proof remain open |

## Completion Result

Not complete.

## Supersession

None.

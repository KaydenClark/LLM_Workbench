# S-002Y - prototype skill alignment

**Spec ID:** S-002Y
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-30
**Catalog description:** Build a small throwaway artifact, either a hand-driven logic model or switchable UI variants, to answer one concrete design or behavior question.
**Blockers:** S-002L Skills draft wiki collection must deliver the draft-wiki location and article template before steps 2-5; step 6 also needs the S-00R disposition route for `skills-pending/`.
**Latest event:** Authored from the owner's 2026-09-30 draft-skills-wiki direction.
**Next gate:** Deliver S-002L, then activate this Spec and cut Tasks from live Actuality with `/to-tasks`.

> **Citation anchors.** pre=`07edccc57b8f75613ad1d09203a3e414d867b90c` post=`07edccc57b8f75613ad1d09203a3e414d867b90c`.

## Outcome

The draft article for `prototype`, its comparison with Matt Pocock's counterpart, and the skill source all describe one behavior. The article says what the skill needs, where a prototype and its answer are written, and how the prototype is later discarded or kept, and every item that cannot be resolved is a logged finding. The skill stays Pending unless the findings justify a different disposition, which the owner decides through S-00R.

## Why It Matters

The owner wants to prototype the skills Wiki with the skills we have and find what is wrong: skills that should connect and do not, and skills that connect and do not work together. `prototype` is a good probe. It is named by Pending `wayfinder`, the Blueprint calls it optional, and it tells the agent to leave a pointer "on the implementation issue" although no issue tracker is a Workbench concept. If nobody can say where a prototype lives and how it is thrown away, that is the kind of gap this effort exists to surface.

## Current Verified State

- `skills-pending/prototype/` holds `SKILL.md` (26 lines), `LOGIC.md` (79) and `UI.md` (112). The skill is not in the Core lane (`workbench/skills/`), and no `workbench/wiki/skill-prototype.md` article exists.
- `SKILL.md` picks one of two branches. A logic question gets a tiny interactive terminal app with the logic in a pure module (`LOGIC.md`). A "what should it look like" question gets several structurally different variants on one route, switched by a `?variant=` search param and a floating bottom bar (`UI.md`).
- `SKILL.md` rule 1 locates the prototype next to the code it prototypes, in the target project, named so a reader sees it is a prototype. Rule 3 forbids persistence unless it is the thing being checked, and then wants a scratch store named "PROTOTYPE - wipe me". Rule 4 forbids tests. Rule 6 says to fold the validated decision into real code, commit the prototype to a throwaway branch out of main, and leave a context pointer to that branch on "the implementation issue".
- `workbench/skills/README.md` records `skills-pending/prototype` as unshipped with an owner decision pending on retention or recoverable removal, and lists the Blueprint mention as `optional`. `BLUEPRINT.md` places a prototype after the Blueprint and before a Spec, and says prototype code carries into the product only once it meets the same implementation and verification requirements as other work.
- `skills-pending/wayfinder/SKILL.md` names `/prototype` as a ticket type that "links the prototype as an asset"; where that asset is stored is not stated there.
- The upstream handoff says Pending skills appear to be unmodified copies of Matt's per `THIRD_PARTY_NOTICES.md`. They were not byte-diffed. Step 1 and step 3 must check this rather than assume it.
- No behavioral scenario for this skill has been run. `skills-pending/` is outside the `AGENTS.md` Edit Scope.

## Desired Behavior

1. A draft article at the draft-wiki location (tentative until S-002L decides) fills every Template 2 section from verified source: what it does, when to reach for it, what it needs, what it reads and writes, how it works, honest limits, observable signs, and where it fits.
2. "What it reads and writes" names where prototype code, the stated question, the verdict, and any scratch data live, and who discards them and how. Anything that cannot be resolved to a real Workbench owner becomes a `dangling` or `gap` finding.
3. "What it needs" resolves each reference (an issue or tracker, a task runner, a throwaway branch, `wayfinder`) to something real in the Workbench or becomes a finding.
4. The comparison with Matt's skill at the upstream pin gives a verdict of same, close, divergent or missing, with behavior and clarity differences.
5. After step 6, the skill source, the article and the catalog describe the same behavior, or the remaining difference is logged.

## Decisions And Contracts

- Group is shaping. Matt counterpart is `engineering/prototype` at `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60`. The skill source is Pending; the owner's 2026-09-30 decisions adopt it for the draft wiki and default it to Pending until this Spec says otherwise.
- Origin is recorded by step 1, not guessed. The Pending provenance suggests it descends from Matt's, but that is unverified.
- Steps 1-5 touch only the draft wiki. Step 6 is the only step that edits a skill lane. `skills-pending/` is not listed in the `AGENTS.md` Edit Scope, so S-00R is the authorizing route for any step 6 edit there; S-00R's live Codex lane `codex/S-00R-optional-inventory` owns that disposition, and this Spec does not edit S-00R.
- A draft article is curated context, not instruction authority or proof of behavior. Source and tests establish Actuality.
- This Spec does not decide whether `prototype` is promoted to Core. Core membership needs its own owner decision and the closed-bundle edits.
- Q2A (where `wayfinder` keeps provisional decisions) is open and owned elsewhere; this Spec records the `prototype` side of that question and does not answer it.

## Non-Goals

- Writing a Wiki article, editing any skill source or Wiki control, or cutting a Task during authoring of this Spec.
- Moving, archiving, installing or deleting `skills-pending/prototype`.
- Reading or quoting Matt's files before step 3, or reproducing his articles; summarize and cite.
- Deciding the throwaway-artifact policy for projects in general, which is a Workbench contract question; findings are routed to their owner.
- Changing `wayfinder`, `tdd` or `codebase-design`, which have their own Specs.

## Dependencies And Blockers

- S-002L Skills draft wiki collection must deliver the draft-wiki location and article template before steps 2-5.
- Step 6 needs the S-00R disposition route for `skills-pending/` and must not run while the Codex lane owns that source.
- Open questions for step 1: whether a Workbench tracker or Spec exists for the "implementation issue" pointer; whether a throwaway branch fits the branch rules, since `AGENTS.md` asks for deleting branches once contained and for approval before removing unmerged ones; how rule 4 (no tests) and the `LOGIC.md` portable module reconcile with the Blueprint's rule that carried-forward prototype code meets normal verification; and where `wayfinder` stores a linked prototype asset.

## Vertical Implementation Slices

This is intended slice direction. No Task is cut yet; Tasks are cut from live Actuality at activation with `/to-tasks`.

1. Investigate ours: read `skills-pending/prototype/SKILL.md`, `LOGIC.md` and `UI.md`, plus the catalog and tests that mention the skill, at a named commit. Record inputs, outputs, writes and composition, the true origin, and whether the copy differs from Matt's.
2. Draft the article: fill Template 2 from step 1 at `workbench/wiki/skills-draft/shaping/prototype.md` (tentative until S-002L decides).
3. Investigate Matt's: read `engineering/prototype` at `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60`.
4. Compare: fill "Compared with Matt's" with a verdict and log findings as `F:prototype:NN` lines.
5. Align the article: rewrite until its wording matches real or intended behavior, and log what is left.
6. Fix or create the skill: edit `skills-pending/prototype` through the S-00R route with catalog tests and a fresh-context scenario, only if findings call for it.

## Acceptance Criteria

- [ ] Every Template 2 section of the `prototype` draft article is filled from verified source.
- [ ] Every "needs" and "reads and writes" item, including where prototype artifacts live and how they are discarded, resolves to a real owner or is a logged finding.
- [ ] The comparison with Matt's skill at the pin is recorded with a verdict.
- [ ] The source disposition (stay Pending or change) is recorded with its reason, and any change goes through S-00R.
- [ ] If step 6 runs, the skill source matches the article, catalog tests pass, and a fresh-context scenario is observed; otherwise the remaining difference is logged.
- [ ] Steps 1-5 changed only the draft wiki; the full suite is green for any step 6 change.

## Testing Seams

Steps 1-5 produce Markdown, so the checks are Wiki validation and a fresh-context read of the article by an agent that has not seen the source. A structural check proves routing, not behavior. If step 6 changes the skill, use the catalog and skill-lane tests as the seam, and run one fresh-context scenario: a question such as "does this state model handle X then Y" is routed to the logic branch, the prototype is marked and run in one command, and the verdict is recorded where the article says.

## Verification Procedure

Run `node workbench/tools/wiki.mjs validate` after the article lands. For step 6, run the targeted catalog and skills-lane tests, the full suite in `AGENTS.md`, `node workbench/tools/spec-workbench.mjs render` and `doctor`, the self-drift pre/post receipts, and a separate-context review of the immutable candidate. Record actual commands and results in this Spec.

## Documentation Impact

- Draft article: `workbench/wiki/skills-draft/shaping/prototype.md` (tentative until S-002L decides).
- Step 6 may touch the `prototype` rows of `workbench/skills/README.md` and `skills-pending/prototype/`, only through S-00R. Controls are not touched unless findings change a claim they make.
- Record `Docs checked; no update needed` with a reason for any control left alone.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-30 | planning | Spec authored from the owner's draft-skills-wiki direction; planning only | Current source, README disposition row and Blueprint mention read at the pre anchor; no scenario trial | This Spec authored; no article or skill edited | Delivery of S-002L, Task cut and all six steps remain open |

## Completion Result

Not complete.

## Supersession

None.

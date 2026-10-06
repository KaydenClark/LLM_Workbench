# S-003K - harness feedback review skill family alignment

**Spec ID:** S-003K
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-30
**Catalog description:** Run a read-only review of whether a project's controls, evidence and live state agree, and say what the harness itself is costing.
**Blockers:** S-002L Skills draft wiki collection must deliver the draft-wiki location and article template before steps 2-5. Step 6 also needs S-00R's per-item owner route, because `skills-pending/` is outside the AGENTS.md Edit Scope.
**Latest event:** Authored from the owner's 2026-09-30 draft-skills-wiki direction.
**Next gate:** Deliver S-002L, then activate this Spec and cut Tasks from live Actuality with `/to-tasks`.

> **Citation anchors.** pre=`07edccc57b8f75613ad1d09203a3e414d867b90c` post=`07edccc57b8f75613ad1d09203a3e414d867b90c`.

## Outcome

For all 15 skills of the Harness Feedback Review family, the draft article, the comparison with the nearest neighbor skill and the skill source describe one behavior, and the way the stage skills connect is written down and checked. This is the owner's accepted exception to one Spec per capability (owner decision 6, 2026-09-30): the family is one assembly, so its connections are reviewed in one place. The steps repeat per skill inside this one Spec.

## Why It Matters

The owner wants to prototype the skills Wiki to find skills that should connect and do not, and skills that connect and do not work together. This family is the densest chain of composition in the inventory: one assembly, three composites and eleven stages that hand inventories to each other. It exists only in the personal install, so the repository cannot say what it does, and it may overlap the repository's own feedback tooling and the planned `retro` skill.

## Current Verified State

Read-only from `~/.agents/skills/harness-*/SKILL.md` on 2026-09-30; the personal repo's log for the root skill shows `bf9d95d` (add) and `219bc81` (flatten shared skill catalog). The repository holds no source for any of the 15: no `harness-feedback-review` or `harness-review-` skill appears under `workbench/skills/`, `skills-pending/` or `skills-archive/` at the anchors.

Composition, as the sources state it (step 1 re-verifies at a named commit):

- `harness-feedback-review` is the assembly. It runs `$harness-review-reconnaissance`, then `$harness-review-diagnosis`, then `$harness-review-disposition`. It alone ships supporting files: `references/method.md` (the plane test, cause classes and the HFR report schema), `references/fixtures.md`, six `fixtures/*.json` and `scripts/check-fixtures.mjs`.
- `harness-review-reconnaissance` (composite) runs `-scope`, `-canon`, `-grounding`, `-actuality` and returns four inventories.
- `harness-review-diagnosis` (composite) runs `-map-gaps`, `-classify-causes`, `-meta-risks`.
- `harness-review-disposition` (composite) runs `-actions`, `-feedback-lifecycle`, `-assay-follow-up`, `-report`.
- The other eleven are leaf stages of 12 lines each; every stage has an `agents/openai.yaml` with a generic "One stage of Harness Feedback Review" interface. `-canon` also names `$harness-review-scope` as its source of in-scope Canon.

Behavior stated across the family: read-only against the target, with chat as the default output; `unknown` and `insufficient evidence` stay as outcomes; a recommendation never authorizes an edit. It reads `WORKBENCH_FEEDBACK.md` and legacy `HARNESS_FEEDBACK.md`; `tools/feedback-automation.mjs` also reads the manifest feedback lane first, which the skills do not name.

Repository neighbors at the anchors: `tools/feedback-automation.mjs`, `tools/feedback-inventory.mjs` and their tests, the completed `workbench/specs/S-028-harness-feedback-integrity/SPEC.md`, the feedback dispositions in `LEXICON.md` (Feedback Dispositions), and the Governance Plane term in `LEXICON.md`. `S-002V` (the planned `retro` skill) is named by the owner direction but is not present on `integration` at the anchors; step 1 re-checks. `tools/test-skill-catalog.mjs` requires a per-item row in `workbench/skills/README.md` for every `skills-pending/` directory, with a 40-hex provenance and a `THIRD_PARTY_NOTICES.md` mention.

## Desired Behavior

1. One draft article per skill (15), grouped `upkeep`, each with its "What it needs" and "What it reads and writes" sections resolving to something real or logged as a finding. The stage articles may be short; the assembly article carries the composition map.
2. The composition map names every caller and callee in the family and every artifact handed between stages, and records what happens when a stage is invoked alone.
3. Each article's comparison names the nearest neighbor and a verdict (`same`, `close`, `divergent`, `missing`), with findings one per greppable line. Likely finding candidates, all unconfirmed until step 1: the report schema living only in the assembly's `references/` (the `-report` stage does not link it); feedback paths that omit the manifest lane (`stale-name` or `gap`); the review's statuses versus the closed disposition set in `LEXICON.md` (`conflict` or `gap`); the review's three planes versus the Lexicon's six (`overlap`); and the family versus `tools/feedback-*`, `S-028` and `retro` (`overlap`).
4. The skill source for each, brought into a repository lane by step 6, matches its article.

## Decisions And Contracts

- This Spec owns all 15 articles and, at step 6, all 15 source copies. No other Spec owns a stage skill.
- Default disposition is Pending (owner decision 1): copies go to `skills-pending/` unless the owner promotes the family. They do not enter the closed Core bundle.
- The article and comparison are curated context; they do not instruct the agent or prove behavior. Source and tests establish Actuality.
- Steps 1-5 write only the draft wiki. Step 6 is the only step that touches a skill lane.
- The personal install is read-only: the owner's repo, and the core-skill installer refuses to write there.
- Nothing here changes `harness-feedback-review` behavior by itself; a source change needs a finding naming the gap.
- Open question for step 6: stage skills reference each other as `$name`. Whether they stay 15 sibling directories or one nested family directory is an owner choice; siblings match the catalog test's directory-derived inventory.

## Non-Goals

- Running a Harness Feedback Review on any project, or claiming the review improves anything (the family itself says that needs later real-use evidence).
- Promoting any of the 15 to Core, or editing the Core bundle assertions.
- Writing a Wiki article, moving a skill or editing `~/.agents/skills` before the slice that owns it.
- Answering Q2A, replacing `retro`, or changing the repository's feedback tooling.
- Cutting any Task at planning time.

## Dependencies And Blockers

- **S-002L Skills draft wiki collection** must deliver the draft-wiki location and article template before steps 2-5.
- **S-00R** (active; its Codex lane `codex/S-00R-optional-inventory` exists) is the authorizing route for step 6: `skills-pending/` is not in AGENTS.md Edit Scope and S-00R requires a per-item owner decision for relocation. The owner's 2026-09-30 default-Pending decision supplies it for the family only if that Spec records it; confirm with its owner before step 6, and do not edit S-00R from here.
- Step 6 must resolve the catalog-row requirement above: the family's author is the owner, so the `THIRD_PARTY_NOTICES.md` provenance cell does not fit as written. That is a catalog-test question for the S-00R route, not decided here.
- The nearest neighbor for steps 3-4 is not chosen: candidates are Matt Pocock's `engineering/retro` and `engineering/diagnosing-bugs` at `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60`, and inside the repository the `auditor` stance, the feedback tooling and the planned `retro` skill. Step 3 reads them and decides.

## Vertical Implementation Slices

No Task is cut yet. Tasks are cut from live Actuality at activation with `/to-tasks`. Intended slice direction, repeated per skill (a compact per-skill list, not 15 full copies; the assembly and the three composites are taken first because they carry the connections):

1. **Investigate ours.** Read each `SKILL.md`, the assembly's `references/` and `fixtures/`, and `scripts/check-fixtures.mjs` at a named commit of the personal repo. Record inputs, outputs, writes and composition: who calls whom, what each stage returns, and what is dangling when a stage runs alone. Record the true `origin`; do not guess it.
2. **Draft the article.** Fill Template 2 for each skill at the tentative location `workbench/wiki/skills-draft/upkeep/<skill>.md` (tentative until S-002L decides), including the "What it needs" and "What it reads and writes" sections.
3. **Investigate the neighbor.** There is no Matt counterpart. Read the candidate neighbors above at the pin and name the nearest per skill (the stages may share one).
4. **Compare.** Fill "Compared with Matt's" (the neighbor, verdict, differences) and log findings, including the overlap with `tools/feedback-*`, `S-028` and `retro`.
5. **Align the article.** Rewrite until each article matches real or intended behavior; log what remains.
6. **Fix or create the skill.** Bring read-only copies of all 15 (with the assembly's supporting files) into a repository lane, default Pending, under the S-00R route; edit them only where a finding requires; add the catalog rows and tests; run a fresh-context scenario against the fixture suite.

## Acceptance Criteria

- [ ] All 15 draft articles exist with every section filled; each "needs" and "reads and writes" item resolves to something real or is a finding.
- [ ] The composition map (assembly, three composites, eleven stages) is in the assembly article and agrees with the sources at the recorded commit.
- [ ] Each skill has a comparison verdict against a named neighbor and every finding is one greppable line.
- [ ] The overlap with `tools/feedback-*`, `S-028` and `retro` is recorded as a finding with who fixes it.
- [ ] Each article's `origin` and `skill_source` are recorded from step 1, not assumed.
- [ ] Step 6 puts all 15 sources and the assembly's supporting files in a repository lane with the owner's disposition recorded, and the sources match their articles.
- [ ] `node scripts/check-fixtures.mjs` and the catalog tests pass for the copies, and the full suite is green from a committed candidate; no unrun check is reported as passing.

## Testing Seams

Steps 1-5: article structure checks owned by S-002L's collection validation, and a link check that every `$skill` reference in the family resolves to one of the 15 articles. Step 6: `tools/test-skill-catalog.mjs` for the catalog row, `scripts/check-fixtures.mjs` for the six fixtures, and a fresh-context scenario in which an agent follows the assembly's three steps against a small target. Static checks prove routing, not agent behavior.

## Verification Procedure

Run the draft-wiki validation S-002L delivers for steps 2-5. For step 6 run the targeted catalog and fixture tests, `node workbench/tools/wiki.mjs validate`, the current full suite in AGENTS.md from a committed candidate, then `node workbench/tools/spec-workbench.mjs render` and `doctor`. Capture the self-drift pre/post receipts and review the immutable candidate separately before integration. Record actual commands and results in this Spec.

## Documentation Impact

Draft articles at the tentative path `workbench/wiki/skills-draft/upkeep/<skill>.md` for the 15 skills. Step 6 touches the chosen lane for the copies (default `skills-pending/`) and the optional-source rows in `workbench/skills/README.md`; it touches no Core bundle assertion. Record `Docs checked; no update needed` for controls that do not change.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-30 | planning | Spec authored for the 15-skill Harness Feedback Review family under owner decision 6; no Task cut | Personal-install sources and repository neighbors read at the pre anchor; no behavior change or scenario trial | This Spec authored; articles and sources remain future work | S-002L, the S-00R route and Tasks remain open |

## Completion Result

Not complete.

## Supersession

None.

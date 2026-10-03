# S-002Q - workbench setup step

**Spec ID:** S-002Q
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-30
**Catalog description:** Decide whether project setup is part of Genesis or a skill run after creation, then deliver that one with its draft article.
**Blockers:** S-002L Skills draft wiki collection must deliver the draft-wiki location and article template before steps 2-5.
**Latest event:** Authored from the owner's 2026-09-30 draft-skills-wiki direction.
**Next gate:** Deliver S-002L, then activate this Spec and cut Tasks from live Actuality with `/to-tasks`.

> **Citation anchors.** pre=`07edccc57b8f75613ad1d09203a3e414d867b90c` post=`07edccc57b8f75613ad1d09203a3e414d867b90c`.

## Outcome

After checking what Genesis already configures, decide between (a) making setup a part of Genesis and (b) a `setup-workbench` skill run after a room is created. Then deliver the chosen shape: its draft Wiki article, a comparison with the nearest upstream counterpart, and the Workbench source change that makes the article true. This Spec does not assume a skill. If the finding is that Genesis already covers everything a setup step could usefully do, that is a legitimate result and goes to the owner as a third option, not a silent skip.

## Why It Matters

The owner asked on 2026-09-30 for a setup step beside Genesis and left the shape open: "part of Genesis, or a `setup-workbench` skill run after creation." Matt Pocock's collection has a setup skill (`engineering/setup-matt-pocock-skills`) because his other skills need per-repository configuration the repository does not yet hold. The Workbench room is its own configuration, so the first job is to find out what, if anything, a new room still lacks after Genesis. Choosing before looking would either duplicate Genesis or add a Core skill with nothing to do.

## Current Verified State

What Genesis already configures, read from source at the pre anchor:

- `workbench/skills/genesis/SKILL.md` runs eight steps. It classifies the target with `node tools/workbench-classify.mjs classify --project PATH` and continues only on `genesis`; derives scoped Specs from recorded owner decisions; creates the seven filled root controls; runs `workbench/tools/workbench-layout.mjs init` for the schema 2 support root (declaring `git.defaultBranch` and `git.integrationBranch`); installs the runtime tools (`tools/workbench-tools.mjs install`) and the skills lane with its discovery links (`tools/workbench-skills.mjs install`); copies and fills the wiki router; creates one stable Spec; creates a private remote when authorization permits; creates and pushes the integration branch; commits and pushes on a prefixed task branch; and passes `node workbench/tools/workbench-layout.mjs validate --project PATH --genesis`.
- `templates/GENESIS.md` Phase 4 fills the `AGENTS.md` edit-scope placeholders and, when `.claude/settings.json` was copied in, fills it from that scope (`allow`, `deny`, `ask`), or records a decision to omit `.claude/`. Phase 6 seeds the feedback lane and the room brain. Phase 5 fills `RUNBOOK.md` with commands that were actually run.
- `workbench/manifest.json` carries the `git` block (`defaultBranch` `main`, `integrationBranch` `integration`); the readiness gate and `doctor` read it.
- The `adoption` skill (`workbench/skills/adoption/SKILL.md`) is the contrast route. It classifies first, then `tools/workbench-adoption.mjs migrate` moves durable v2 lanes, installs the tools and skills lanes and declares the integration branch. In `templates/ADOPTION.md` the `.claude/settings.json` fill is a documented phase step; a grep of `tools/workbench-adoption.mjs` found no mention of it, so the helper appears not to do it. To be confirmed in step 1.
- Genesis and Adoption therefore describe the same configuration twice, once per protocol, in prose.

What does not exist today:

- There is no `setup-workbench` skill or any other post-creation setup step; the name `setup-workbench` appears nowhere in the repository at the anchor. `skills-pending/setup-pre-commit` and `skills-pending/setup-ts-deep-modules` are separate toolchain setup skills with their own planned Specs. The skills README's "init" row records Claude Code's built-in `/init` as not a skill.
- Matt's per-repository items (issue tracker, triage labels, domain-doc layout) have Workbench replacements that need no setup step: Specs live in the declared `specs` lane, the Lexicon is a root control, and `tools/test-skill-catalog.mjs` deliberately forbids the imported `setup-matt-pocock-skills` and "issue tracker" workflow in live skills such as `to-spec` and `to-tasks`.
- `workbench/wiki/skill-genesis.md` states that at the earlier upstream pin there was no genesis counterpart and names `setup-matt-pocock-skills` as the nearest skill by purpose, not a source.

S-01G, the owning Spec for Genesis, is `active` with its Task closed and owner Human QA of conversational fidelity pending. Genesis is not an unowned lane; any edit to it is coordinated with that owner.

## Desired Behavior

1. The Spec records, from verified source, a list of what a new room needs configured and does not get from Genesis or Adoption. Each item states where it lives and when it must run (at creation, once after creation, or repeatedly).
2. One shape is chosen, with options, a recommendation and the tradeoff written for the owner, and the choice is recorded here as a decision. The recommendation is a recommendation: the owner's existing direction made this Spec the decider, but it is not an invitation to widen scope.
3. The chosen shape is delivered and its draft article tells the truth about it.
4. The draft article, the comparison with the upstream counterpart and the Workbench source describe one behavior.

## Decisions And Contracts

- **Decision slice, options.**
  - (a) Setup is a part of Genesis: a named phase in `templates/GENESIS.md` and the genesis skill, with the same text reused by `templates/ADOPTION.md` for adopted rooms. No new skill, so the closed Core bundle does not grow for this reason.
  - (b) A `setup-workbench` skill run after creation: one entry point that works for rooms from Genesis, from Adoption and from an older release, and can be re-run. It would be a new skill and, if made Core, a change to the closed Core bundle assertions (`workbench/skills/README.md`, the Lexicon "Core skill bundle" row, `workbench/manifest.json` `skillPolicy.required` and the catalog tests), which must then sequence behind the Core-bound Specs' single writer.
  - (c) Neither: step 1 finds nothing a room still needs. Reported to the owner with the evidence; the article records the finding and the Spec closes without a source change.
- **Provisional recommendation, to be confirmed or reversed by step 1.** Prefer (a). Genesis and Adoption already configure the room, the readiness gate already checks it, and a fifth routing skill would split first-run guidance across two places and touch the closed bundle. Choose (b) only if step 1 finds required items that cannot run at creation (items that depend on later project choices, or that must re-run on an existing room).
- **Owner-facing tradeoff.** (a) is simpler and cannot be forgotten, but runs once, cannot be re-run on an existing room, and needs matching edits in both the Genesis and Adoption routes (and the S-01G and S-01D lanes). (b) can be re-run and serves every room, but adds a step the owner can skip, a new skill to maintain and a new entry route to teach.
- A Wiki article is curated context, not instruction authority or proof of behavior. Source and tests establish Actuality; accepted controls and this Spec establish the target.
- Nothing here treats Matt Pocock's site or skills as Workbench Canon. Anything adopted from his counterpart is a decision recorded in this Spec.
- Origin (workbench, matt or foundry) is recorded by step 1 and not guessed here.

## Non-Goals

- Editing a skill lane, `templates/`, the manifest, `SCHEMA.md` or any test during steps 1-5.
- Answering Q2A (where `wayfinder` keeps pre-Spec decisions). It is open and belongs to the `wayfinder` Spec.
- Reproducing Matt's issue-tracker, label or domain-doc configuration. Step 4 may record that these are absent by design, as findings of kind `gap` or `overlap`, not as work.
- Taking over `setup-pre-commit` or `setup-ts-deep-modules`. Step 1 may name them as setup steps this one could route to.
- Re-opening S-01G's accepted behavior or its pending owner Human QA.

## Dependencies And Blockers

- **S-002L Skills draft wiki collection must deliver the draft-wiki location and article template before steps 2-5.** Step 1 and the decision slice read live source and can begin before S-002L lands.
- If (a) is chosen, step 6 edits `workbench/skills/genesis/SKILL.md` and `templates/GENESIS.md` (and, for adopted rooms, `workbench/skills/adoption/SKILL.md` and `templates/ADOPTION.md`) under coordination with S-01G and S-01D, whose owner is `claude-lane-C-worker` and whose Human QA gate is open. This is a coordination dependency, not a header blocker. Whether the work is cut as a Task in S-01G or in this Spec is an open question for the Director.
- If (b) is chosen, step 6 adds a skill; the Core-bound sequence (`ask-workbench`, `brainstorm`, `sitrep`, `writing-for-agents`) and its single writer on the shared bundle files apply if it joins Core.
- Open questions for step 1: does the Adoption helper fill `.claude/settings.json`; which items in the step 1 list are truly uncovered; whether a room that ran Genesis before a later release lacks anything the current Genesis would give it (a question for `update-harness`, not setup); whether the article template allows an article for a non-skill capability under option (a), since its front matter has a `skill:` field (a question for S-002L).

## Vertical Implementation Slices

These steps are intended slice direction in prose. No Task is cut yet; Tasks are cut from live Actuality at activation with `/to-tasks`. Steps 1-5 touch only the draft wiki; step 6 is the only step that touches a skill lane or template.

1. **Investigate ours.** Read Genesis (`workbench/skills/genesis/SKILL.md`, `templates/GENESIS.md`, `workbench/specs/S-01G-genesis-skill-rebuild/SPEC.md`) and Adoption (`workbench/skills/adoption/SKILL.md`, `templates/ADOPTION.md`, `tools/workbench-adoption.mjs`), with their tests, at a named commit. Record what each configures, the inputs, outputs and writes, and the list of uncovered needs from Desired Behavior 1.
- **Decision slice, between steps 1 and 2.** Present options (a), (b) and (c) with the recommendation and the owner-facing tradeoff above, updated by step 1, and record the decision in this Spec. If the choice needs an owner call, state it as a tradeoff with a recommendation and cost and record the open gate here rather than stalling. Steps 2-6 then follow for the chosen shape.
2. **Draft the article.** Fill Template 2 (owned by S-002L) for the chosen shape at the tentative location `workbench/wiki/skills-draft/getting-started/<name>.md`, tentative until S-002L decides. The file name follows the decision. Group is `getting-started`; `skill_source` is `new`.
3. **Investigate Matt's.** Read `engineering/setup-matt-pocock-skills` at `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60`. His files are not read in this planning pass.
4. **Compare.** Fill "Compared with Matt's" and log each finding on its own line with kind, one-line statement and who fixes it.
5. **Align the article.** Rewrite until the wording matches real or intended behavior, and log what is left.
6. **Fix or create.** Deliver the chosen shape: for (a), edit the genesis lane and templates under S-01G coordination rather than creating a skill; for (b), add the skill's `SKILL.md` in its lane with catalog tests and a fresh-context scenario; for (c), no source change.

## Acceptance Criteria

- [ ] Current Verified State records, from source at a named commit, what Genesis and Adoption configure, and a list of what a new room still needs configured.
- [ ] A decision between Genesis part, `setup-workbench` skill and neither is recorded with options, recommendation and tradeoff, and any owner gate is named.
- [ ] The draft article exists at the S-002L location with every template section filled; every "needs" and "reads and writes" item resolves to something real or is a finding.
- [ ] The comparison with `engineering/setup-matt-pocock-skills` at the pin has a verdict (same, close, divergent or missing) and its findings are logged one per line.
- [ ] The Workbench source (genesis lane and templates, or the new skill) matches the article, with catalog tests and a fresh-context scenario for the chosen shape.
- [ ] The full suite in `AGENTS.md`, `doctor` and the self-drift receipts are green for step 6, and the S-01G and S-01D owners were coordinated with if their lanes changed.

## Testing Seams

Steps 1-5 are verified by reading source and checking each cited path. For option (a), the seams are the skill catalog test (`tools/test-skill-catalog.mjs`), `tools/test-workbench-layout.mjs` (`validate --genesis`) and `tools/test-workbench-round-trip.mjs`, with a fresh-context Genesis run. For option (b), `tools/test-skill-catalog.mjs` and a fresh-context run of the skill against a room created by Genesis and one created by Adoption. Catalog and Wiki checks prove routing, not agent behavior.

## Verification Procedure

Steps 1-5: confirm each cited path and command exists at the named commit, and run `node workbench/tools/wiki.mjs validate` after the article lands. Step 6: show red then green at the chosen seam, then run the full suite in `AGENTS.md` from a committed candidate, `node workbench/tools/spec-workbench.mjs render` and `doctor`, and the self-drift pre/post receipts. Review the immutable candidate separately before integration. Record actual commands and results in this Spec.

## Documentation Impact

The draft article at `workbench/wiki/skills-draft/getting-started/<name>.md` (tentative until S-002L decides). Step 6 may touch, only if the decision requires it: `workbench/skills/genesis/SKILL.md`, `templates/GENESIS.md`, `workbench/skills/adoption/SKILL.md`, `templates/ADOPTION.md` and the root `RUNBOOK.md` (option a); or a new skill source, `workbench/skills/README.md`, the Lexicon "Core skill bundle" row and the manifest (option b). The root `RUNBOOK.md` and the template copy stay in step. Record `Docs checked; no update needed` with a reason where a control does not change.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-30 | planning | Spec authored from the owner's draft-skills-wiki direction; planning only | Genesis skill, `templates/GENESIS.md`, `workbench/skills/adoption/SKILL.md` and S-01G read at `07edccc5`; no implementation evidence | This Spec authored; no Wiki article or source change | S-002L, the step 1 investigation, the setup decision and all delivery steps remain open |

## Completion Result

Not complete.

## Supersession

None.

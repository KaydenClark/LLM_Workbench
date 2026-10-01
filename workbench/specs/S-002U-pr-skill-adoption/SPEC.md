# S-002U - pr skill adoption

**Spec ID:** S-002U
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-30
**Catalog description:** Open, describe and land a pull request into the room's integration branch, and never into the owner-only final branch.
**Blockers:** S-002L Skills draft wiki collection must deliver the draft-wiki location and article template before steps 2-5. Step 6 also needs the pending-lane edit authorization named under Dependencies And Blockers.
**Latest event:** Authored from the owner's 2026-09-30 draft-skills-wiki direction.
**Next gate:** Deliver S-002L, then activate this Spec and cut Tasks from live Actuality with `/to-tasks`.

> **Citation anchors.** pre=`07edccc57b8f75613ad1d09203a3e414d867b90c` post=`07edccc57b8f75613ad1d09203a3e414d867b90c`.

## Outcome

A `pr` skill exists as a new adoption from Matt Pocock's `engineering/pr` (formerly a "skip" in the grouping report), with one draft Wiki article, a recorded comparison with his skill, and a skill source that all describe the same behavior. This Spec owns the investigation of what the Workbench already does for pull requests, the draft article, the comparison, and the skill source in its lane. Group: main-workflow.

## Why It Matters

The Workbench has pull-request behavior but no skill that names it. The rules sit in `AGENTS.md` (Git Rules, Branch Completion) and the commands in `RUNBOOK.md` (Version-Control Procedures); several skills mention a Task PR in passing (`workbench/skills/implement/SKILL.md`, `workbench/skills/carry/SKILL.md`, `workbench/skills/code-review/SKILL.md`). An agent that wants "open a PR for this" has no single entry. The owner wants the skills prototyped as draft Wiki articles to find where skills should connect and do not; `pr` is a likely overlap with the personal `land` skill and with the closeout recipe.

## Current Verified State

- No `pr` skill exists in `workbench/skills/`, `skills-pending/` or `skills-archive/` at the pre anchor.
- Nearest ours, as policy: `AGENTS.md` Git Rules (branch per spec or task from `integration`; default PR target is `integration`; agents may merge below `integration` when safe; only the owner merges `integration` into `main`) and Branch Completion (a pushed branch is not delivered; merge a PR whose integration review passed, confirm containment, then clean up).
- Nearest ours, as commands: `RUNBOOK.md` Version-Control Procedures give `gh pr create --base integration --fill`, require PR descriptions to state what changed, why, risks and verification, and hold the closeout recipe (`gate`, `gh pr merge --match-head-commit`, containment check, guarded branch deletion). `tools/test-branch-closeout.mjs` demonstrates it against a disposable repository.
- Nearest ours, as a skill: the personal-install `~/.agents/skills/land/SKILL.md` (Foundry origin, read-only here). It covers getting blocked work into `integration`: a read-only mergeability check, blocker classification, and a hard stop that `integration` to `main` belongs to the owner. It is a repair skill, not a PR-authoring skill. Its fate belongs to the Foundry-origin skills triage Spec (S-003E), so this Spec only references it.
- Not verified: whether `save`, `implement` or `carry` already open a PR themselves, and what Matt's `pr` does. Both are step 1 and step 3 questions.

## Desired Behavior

1. A `pr` skill opens a pull request from the current branch into the room's declared integration branch (`git.integrationBranch` in `workbench/manifest.json`), with a description that states what changed, why, risks and verification.
2. It never targets, merges or proposes merging `integration` into `main`; that stays owner-only and the skill states the stop plainly.
3. It does not merge a PR whose review is pending, and it defers merge and cleanup to the existing closeout recipe rather than restating it.
4. The draft article, the comparison with Matt's skill, and the skill source agree on verified or intended behavior, with differences logged as findings.

## Decisions And Contracts

- Group is main-workflow and the Matt counterpart is `engineering/pr`, per the owner's 2026-09-30 decisions. The skill defaults to Pending (owner decision 1) unless this Spec later decides otherwise.
- The skill must not relax any rule in `AGENTS.md` Git Rules or Branch Completion. `AGENTS.md` and `RUNBOOK.md` stay the owners of the rules and commands; the skill points to them.
- Cite the upstream pin `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60` for every comparison. Matt's skill is outside evidence, not Canon.
- Origin is recorded in step 1 from what is found, not guessed now.

## Non-Goals

- Deciding the fate of `land`, `landing-check` or other Foundry-origin skills; the Foundry triage Spec owns that.
- Changing the integration review gate, the closeout recipe or branch rules.
- Merging any PR, or any action on `main`.
- Changing the Core bundle; this skill is Pending by default.
- Writing a Task, claiming or activating this Spec.

## Dependencies And Blockers

- **S-002L Skills draft wiki collection** must deliver the draft-wiki location and article template before steps 2-5.
- **Pending-lane edit authority.** `skills-pending/` is not listed in `AGENTS.md` Edit Scope. Before step 6 writes a new `skills-pending/pr/` source, the owner's direction must authorize it, as S-00R is the owner of optional-source dispositions and requires a per-item owner decision for archive or pending relocation. S-00R has a live Codex lane (`codex/S-00R-optional-inventory`), so this Spec does not edit it. Whether the owner's 2026-09-30 adoption decision is sufficient authority, or a separate request is needed, is an open question; record it in step 1 and stop at step 6 until answered.
- The pending-versus-Core placement may also be revisited by the Director if the skill proves to belong in the closed Core bundle.

## Vertical Implementation Slices

These are the intended slice direction, in prose. No Task is cut yet; Tasks are cut from live Actuality at activation by `/to-tasks`.

1. **Investigate ours.** Read `AGENTS.md` Git Rules and Branch Completion, the `RUNBOOK.md` PR and closeout procedures, `tools/test-branch-closeout.mjs`, the PR mentions in the core skills, and the personal `land` skill. Record inputs, outputs, writes and composition at a named commit, and list the overlaps (expected: `land`, the closeout recipe, `save`).
2. **Draft the article.** Fill Template 2 (owned by S-002L) at `workbench/wiki/skills-draft/main-workflow/pr.md`, tentative until S-002L decides, from step 1.
3. **Investigate Matt's.** Read `engineering/pr` at `d81f3a183412e71a5b1e84ca21bc1a35eea03a60`.
4. **Compare.** Fill "Compared with Matt's" with a verdict (same, close, divergent, missing) and log findings, one per line (`overlap`, `gap`, `conflict`, and so on).
5. **Align the article.** Rewrite until the wording matches real or intended behavior; log what remains.
6. **Create the skill.** Add `pr/SKILL.md` in the pending lane with catalog tests and a fresh-context scenario, once pending-lane authority is settled.

## Acceptance Criteria

- [ ] Every section of the draft article is filled, and `workbench/wiki/skills-draft/main-workflow/pr.md` (tentative location) exists.
- [ ] Every "needs" and "reads/writes" item in the article resolves to something real or is logged as a finding, including the overlap with `land` and the closeout recipe.
- [ ] A verdict against Matt's `engineering/pr` at the pin is recorded.
- [ ] The skill source matches the article, and states that only the owner merges `integration` into `main`.
- [ ] A fresh-context scenario shows `pr` opening a PR into `integration` and refusing a request to target `main`.
- [ ] Catalog and Wiki checks and the full suite from `AGENTS.md` are green for step 6, with no unrun check reported as passing.

## Testing Seams

Steps 1-5 are checked by reading: each article claim traces to a cited file or finding. Step 6 uses the skill catalog and lane tests (`tools/test-skill-catalog.mjs`, `tools/test-skills-lane.mjs`) as the structural seam, and a fresh-context scenario as the behavioral seam. Structural tests prove routing, not agent behavior.

## Verification Procedure

For steps 1-5, run `node workbench/tools/wiki.mjs validate` once S-002L has made the draft collection valid. For step 6, run the targeted catalog tests, then the full suite in `AGENTS.md`, `render` and `doctor`, with the self-drift pre and post receipts and a separate-context review of the immutable candidate. Record the actual commands and results here.

## Documentation Impact

- Draft article: `workbench/wiki/skills-draft/main-workflow/pr.md` (tentative until S-002L decides).
- Step 6 may touch `skills-pending/pr/SKILL.md` and the optional-source inventory in `workbench/skills/README.md` (S-00R's lane; coordinate, do not edit in parallel). It touches no Core control, since the skill is Pending by default.
- If step 1 finds `AGENTS.md` or `RUNBOOK.md` needs a pointer to the skill, record it as a finding first; route changes go through their owners.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-30 | planning | Spec authored from the owner's draft-skills-wiki direction; planning only | Nearest existing behavior read at the pre anchor (`AGENTS.md`, `RUNBOOK.md`, personal `land`); no implementation, article or skill source touched | This Spec authored; article and skill remain future work | S-002L, steps 1-6 and pending-lane authority remain open |

## Completion Result

Not complete.

## Supersession

None.

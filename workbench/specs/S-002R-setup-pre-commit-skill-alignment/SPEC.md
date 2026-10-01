# S-002R - setup-pre-commit skill alignment

**Spec ID:** S-002R
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-30
**Catalog description:** Add lightweight, project-appropriate commit-time checks with an explicit recovery path.
**Blockers:** S-002L Skills draft wiki collection must deliver the draft-wiki location and article template before steps 2-5. Step 6 also needs an authorized route to edit `skills-pending/` source (see Dependencies And Blockers).
**Latest event:** Authored from the owner's 2026-09-30 draft-skills-wiki direction.
**Next gate:** Deliver S-002L, then activate this Spec and cut Tasks from live Actuality with `/to-tasks`.

> **Citation anchors.** pre=`07edccc57b8f75613ad1d09203a3e414d867b90c` post=`07edccc57b8f75613ad1d09203a3e414d867b90c`.

## Outcome

The draft article for `setup-pre-commit`, its comparison with Matt Pocock's counterpart and the skill source all describe one behavior. The skill stays Pending unless this Spec's findings justify otherwise (owner decision 1, 2026-09-30). The Spec records which version of the skill is the real source, what the skill needs and writes, and where it connects badly to other skills.

## Why It Matters

The owner wants to prototype the skills Wiki with the current skills to find what is wrong: skills that should connect and do not, and skills that connect and do not work together. `setup-pre-commit` is in the getting-started group, so it is one of the first skills a new project would run, yet no Workbench control refers to it. Its article is the place to find out whether it belongs in the harness at all.

## Current Verified State

- The skill lives at `skills-pending/setup-pre-commit/SKILL.md`, outside live discovery. `workbench/skills/README.md` calls `skills-pending/` "historical rewrite source outside discovery" and lists the skill's row with "No operational consumer established by this bounded repository review" and an "owner decision required" disposition. `tools/test-skill-catalog.mjs` requires exactly one catalog row per pending directory, so the directory and its row must stay together.
- The pending copy is a Husky recipe, not a general skill. It detects the package manager, installs `husky lint-staged prettier`, runs `npx husky init`, writes `.husky/pre-commit` (lint-staged, then `typecheck` and `test` scripts), writes `.lintstagedrc` and a default `.prettierrc`, verifies, then commits with a fixed message. It assumes a Node project with `package.json` and writes files and a commit without asking.
- A different `setup-pre-commit` exists in the owner's personal install at `~/.agents/skills/setup-pre-commit/SKILL.md` (read-only). It is a short, toolchain-neutral rewrite: read project controls and existing commands, add only fast deterministic checks the project supports, document manual run and repair, avoid network or destructive work during commit, prove the hook runs and that bypassing stays visible, update `RUNBOOK.md` when operation changes. A `diff` of the two files at 2026-09-30 shows they share only the name. This corrects the third-party notice's implication that pending skills are unmodified copies of Matt's: this one differs from the personal version, and whether the pending copy matches Matt's is not yet checked.
- No other tracked file refers to the skill by name except the catalog row and `THIRD_PARTY_NOTICES.md` attribution. This repository has no `.husky/` directory and `AGENTS.md` and `RUNBOOK.md` define no commit-hook route; whether the repository uses any `.git/hooks` check is not verified.
- Matt Pocock's counterpart is `misc/setup-pre-commit`, reported as not promoted upstream. It has not been read at the pin.
- No fresh-context scenario for this skill exists. No draft article exists.

## Desired Behavior

1. A reader of the draft article can say what the skill does, when to reach for it, what it needs and what it writes, in plain terms, and every claim matches the chosen source.
2. The Spec records which of the two versions is the source of truth, or that neither is yet, and why, with the owner's decision where one is needed.
3. Every "needs" and "reads and writes" item resolves to something real or becomes a finding, including the missing connection to `RUNBOOK.md`, `genesis`, `adoption` and the verification suite.
4. The comparison with Matt's counterpart ends in a verdict (same, close, divergent or missing), with behavior and clarity differences.
5. The skill source, the article and the catalog describe one behavior. The skill stays Pending unless the findings justify promotion, and any promotion is the owner's recorded decision.

## Decisions And Contracts

- This Spec owns `setup-pre-commit` alone. Tracked controls, the README catalog row, `workbench/manifest.json`, the Lexicon's Core skill bundle row and tests change only if step 6 proves a change is needed and the owner has authorized it.
- Owner decision 1: the skill stays Pending unless this Spec's findings justify otherwise. The Spec does not promote it by itself.
- The draft article is curated context, not instruction authority or proof of behavior. Source and tests establish Actuality; accepted controls and this Spec establish the target.
- Steps 1-5 touch only the draft wiki. Step 6 is the only step that touches a skill lane.
- `skills-pending/` is not in `AGENTS.md` Edit Scope. Step 6 must therefore name how a source edit there is authorized, using S-00R's pending-source disposition or an explicit owner request, and must not assume it.
- Matt's files are compared at the pin `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60` only. They are summarized and cited, not reproduced; the MIT notice stays in `THIRD_PARTY_NOTICES.md`.
- `~/.agents/skills` is read-only; nothing is written there.

## Non-Goals

- Moving, archiving, installing or deleting the skill, or adding it to the Core bundle.
- Installing hooks in this repository or any other room.
- Writing the setup Spec's "Workbench setup step" decision or any Genesis change; this skill may be named there as a finding.
- Reading or editing other skills' sources beyond what a finding needs.
- Treating a green article, catalog test or suite as owner Human QA.

## Dependencies And Blockers

- **S-002L Skills draft wiki collection** must deliver the draft-wiki location and article template before steps 2-5.
- **Pending-source edit authority.** Step 6 may edit `skills-pending/setup-pre-commit/SKILL.md` only under an authorization it names: S-00R's per-item pending disposition (the row is currently "owner decision required") or an explicit owner request. S-00R has a live Codex lane (`codex/S-00R-optional-inventory`), so step 6 checks that lane's state first and does not edit S-00R.
- No other skill alignment Spec blocks this one.

## Vertical Implementation Slices

No Task is cut yet. Tasks are cut from live Actuality at activation with `/to-tasks`. The intended slice direction is:

1. **Investigate ours.** Read the pending `SKILL.md`, the personal `SKILL.md`, the catalog row and tests at a named commit. Record inputs, outputs, writes and composition. Byte-compare the pending copy with Matt's counterpart only after step 3 has read it. Record the true `origin` and which version is the source of truth.
2. **Draft the article.** Fill Template 2 from step 1 at `workbench/wiki/skills-draft/getting-started/setup-pre-commit.md` (tentative until S-002L decides), with `skill_source: pending`.
3. **Investigate Matt's.** Read `misc/setup-pre-commit` at the pin `d81f3a183412e71a5b1e84ca21bc1a35eea03a60`; if it is absent there, record that and compare with its nearest in-tree neighbor, `setup-matt-pocock-skills`.
4. **Compare.** Fill "Compared with Matt's" and log findings as `F:setup-pre-commit:NN` lines. Likely candidates to check, not conclusions: the Husky/Node assumption, an unconditional commit step, no link to `RUNBOOK.md`, and no named user.
5. **Align the article.** Rewrite until the wording matches real or intended behavior, and log what remains.
6. **Fix or create the skill.** If findings justify it, edit the source in its lane under the named authorization, with catalog tests and a fresh-context scenario. If the skill stays as is, record that and why.

## Acceptance Criteria

- [ ] Every section of the draft article is filled and its `skill_source`, `origin` and `matt_counterpart` fields are verified, not guessed.
- [ ] Every "needs" and "reads and writes" item resolves to a real file, skill or tool, or is logged as a finding.
- [ ] The two differing versions (pending and personal) are reconciled in the article and the source-of-truth decision is recorded.
- [ ] The verdict against Matt's counterpart (or its named neighbor) is recorded with behavior and clarity differences.
- [ ] The skill source matches the final article, or the Spec records why no source change is made; a pending-source edit names its authorization.
- [ ] Catalog and Wiki checks and the required full suite pass for any step 6 change, and a fresh-context scenario is observed; no unrun check is reported as passing.

## Testing Seams

Steps 1-5 are documentation; the check is that every named path, skill and command in the article resolves, and that findings are greppable by `F:setup-pre-commit:`. Step 6, if reached, uses `tools/test-skill-catalog.mjs` for the catalog row and structure, and a fresh-context scenario that runs the skill in a throwaway project with and without an existing toolchain and shows the hook runs and can be bypassed visibly. Conversational fidelity may need human review.

## Verification Procedure

For steps 1-5: confirm each cited path and the pin, run the draft wiki checks S-002L defines, then `node workbench/tools/spec-workbench.mjs render` and `doctor`. For step 6: run the targeted tests, then the full suite in `AGENTS.md` from a committed candidate, with the self-drift pre/post receipts, and a separate-context review of the immutable candidate. Record actual commands and results in this Spec.

## Documentation Impact

The draft article at `workbench/wiki/skills-draft/getting-started/setup-pre-commit.md` (tentative until S-002L decides). Step 6 may touch `skills-pending/setup-pre-commit/SKILL.md` and, only if the disposition changes, the `skills-pending/setup-pre-commit` row in `workbench/skills/README.md`. Otherwise record `Docs checked; no update needed` with the reason.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-30 | planning | Spec authored from the owner's draft-skills-wiki direction; planning only | Pending and personal `SKILL.md` read and diffed, catalog row and test read at the pre anchor; no Matt file read, no scenario, no implementation | This Spec authored; no article, skill or control changed | S-002L, step 1 onward, Matt comparison and any source change remain open |

## Completion Result

Not complete.

## Supersession

None.

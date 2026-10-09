# S-004S - Required Checks On Pull Requests Into Integration

**Spec ID:** S-004S
**Status:** planned
**Priority:** 1
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-10-07
**Catalog description:** A portable required-checks workflow, run by LLM_Workbench and usable by every room, runs the fast check, the Full suite and a verdict gate on each pull request into `integration`, which cannot merge while one is red or while a Spec it touches carries an unanswered fail verdict.
**Blockers:** Blocked by S-004R Tracked Full suite runner; seven open owner choices in Decisions And Contracts: edit scope (S-1), the ADR-000F amendment (S-2), who enables branch protection (S-3), assembly PR verdicts (S-4), the verdict-gate rule (S-5), Linux test changes (S-6) and which PRs run the suite (S-7).
**Latest event:** Revised from the owner grilling of 2026-10-07: the workflow is template-targeted and portable, and the Spec is blocked by the suite runner Spec; no Task is cut.
**Next gate:** Owner answers S-1 to S-7 and S-004R delivers, then activation and a Task cut from live Actuality with `/to-tasks`.

> **Citation anchors.** pre=`d0fb161c1ff36caf936758b7492f7ef7fce8176e` post=`d0fb161c1ff36caf936758b7492f7ef7fce8176e`.

## Outcome

Nothing reaches `integration` without a machine having checked it. A pull
request into `integration` runs the fast check, the Full suite through the
tracked runner, and a verdict gate. Branch protection makes all three required,
so a red check or an unanswered fail verdict stops the merge button, whoever
presses it. The workflow is portable: it ships with the Template, reads the
room's own Runbook, and any room made from the Template can turn it on.
LLM_Workbench runs the same workflow on its own `integration`.

## Why It Matters

PR #412 (the pr skill adoption assembly, S-002U) was marked ready and merged
into `integration` on 2026-10-07 at merge commit `6101c237`. Its head commit,
`e205ea42`, is the one that records the assembled review's **fail** verdict.
The implement-spec skill says unresolved findings keep the PR a draft and that
the run ends before the integration merge. The rule was written down and it did
not hold, because nothing mechanical reads it.

The Full suite has the same weakness: it only runs when an agent runs it by
hand, and a hand-run suite reported `pass=0` as green once already
([Tracked Full suite runner](../S-004R-tracked-full-suite-runner/SPEC.md)).
Rooms made from the Template carry the same rules and the same gap.

## Current Verified State

At the pre anchor:

- The repository has no `.github/` directory, no workflow, no git hooks and no
  `core.hooksPath`. `integration` has no branch protection (S-00J's evidence log
  recorded the protection API returning 404 on 2026-09-12; not re-queried for
  this draft).
- `templates/` carries no `.github/` directory or workflow, so no room made from
  the Template has required checks either.
- The repository is public, so GitHub-hosted Actions minutes are not billed.
- [ADR-000F](../../docs/adr/000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md)
  says the Spec QA gate "is a step in the harness's own merge-preparation
  workflow, not GitHub-enforced branch protection."
  [S-00J](../S-00J-spec-qa-gate-at-integration/SPEC.md) lists GitHub-level
  enforcement as a non-goal and says it "needs a later linked Spec with its own
  authorization". This is that Spec.
- `AGENTS.md` limits edits to root control and docs files, `templates/`,
  `workbench/`, `team templates/`, `research templates/`, `tools/`, `evals/`,
  `outcomes/` and `benchmarks/`. `.github/` is outside it. The Template's
  `AGENTS.md` Edit Scope writes a room's writable roots as the
  `[WRITABLE_ROOTS]` placeholder plus root controls and the `workbench/`
  support lanes.
- `spec-workbench.mjs report S-### --candidate SHA` already reports a Spec's
  latest verdict and whether it is bound to the candidate's content.
  `spec-workbench.mjs` and `spec-report.mjs` are managed runtime tools, so every
  room has `report`.
- The Template Runbook's Test And Build section holds the fast check as the
  `[FAST_TEST_COMMAND]` placeholder and the Full suite as a block of
  placeholders.

## Desired Behavior

1. **Description first.** LLM_Workbench's own description of the Template, the
   Canon, Grounding and Enduring Context that say what a room carries and how
   its work reaches `integration`, states that a room can use the portable
   required-checks workflow and what the workflow needs from the room. `to-docs`
   routes each statement to its owner. This lands before any Template artifact
   changes.
2. A portable workflow on pull requests into a room's `integration` runs three
   jobs on the PR head: the room's fast check, the room's Full suite through
   `node workbench/tools/run-full-suite.mjs`, and the verdict gate. The workflow
   holds no command list of its own; it reads the room's Runbook Test And Build
   section. How it reads the fast check is a Plan item.
3. The verdict gate finds every Spec whose files the PR changes and runs
   `report` for each at the PR head. It fails under the rule open choice S-5
   settles, naming the Spec, the verdict's candidate and its findings.
4. Branch protection on `integration` requires the three jobs, so a red job
   blocks merge in the web UI and through `gh pr merge` alike. Who turns it on
   is open choice S-3.
5. A deliberately bad branch, such as one whose head is `e205ea42`'s state,
   turns the verdict gate red; the same branch with its corrective Task closed
   turns it green.
6. The Template carries the workflow and the steps a room takes to turn it on;
   LLM_Workbench runs it on its own `integration`.
7. Both Runbooks say what the checks are, how long they take and how to read a
   failing one.

## Decisions And Contracts

- **Template-targeted (owner decision, 2026-10-07).** The Template Workbench is
  the Actuality this Spec changes; LLM_Workbench's destination claims about it
  are Canon. The required-checks workflow is a portable workflow rooms can use,
  not a check only this repository runs. The Spec first updates LLM_Workbench's
  Canon, Grounding and Enduring Context describing the Template's behavior,
  then the Template artifacts. Why (owner): what is Actuality and what is not is
  what matters; LLM_Workbench's docs describe what the Template is, does and
  how, so they lead.
- The suite job calls the tracked runner and never copies a room's command
  list.
- The gate reads verdicts only; it never writes evidence, verdicts or approvals.
- A check blocks only the change it evaluates
  ([ADR-0020](../../docs/adr/0020-a-check-blocks-only-the-change-it-evaluates.md)):
  the verdict gate reads only Specs the PR touches.

### Open owner choices

- **S-1, edit scope.** Add `.github/` to the `AGENTS.md` edit scope and its
  Template counterpart, or name another route for the workflow file?
  Recommendation (not an owner answer): none recorded.
- **S-2, ADR-000F.** Record a new ADR that amends ADR-000F's "not
  GitHub-enforced branch protection" sentence rather than editing it silently?
  The Spec QA gate would stay the harness's own judgment step; its recorded
  outcome and the suite would also be checked by GitHub. Recommendation (not an
  owner answer): yes.
- **S-3, branch protection.** Who turns on protection for `integration` (the
  owner, or an agent the owner authorizes to use `gh api`), and does it apply to
  administrators? Recommendation (not an owner answer): none recorded.
- **S-4, assembly PR verdict.** Must an assembly PR carry a `pass` verdict bound
  to its head content before merge, and how is an assembly PR told from a Task
  PR? The S-5 rule alone blocks the PR #412 failure without blocking corrective
  Task PRs; a bound pass is stricter. Recommendation (not an owner answer): none
  recorded.
- **S-5, verdict-gate rule.** Does the gate fail when a touched Spec's latest
  verdict is `fail` and no Task that verdict continued or created has closed
  since? Recommendation (not an owner answer): this is the draft's proposed
  rule.
- **S-6, Linux runner.** May the Plan change tests so they pass on a GitHub
  Linux runner? Recommendation (not an owner answer): none recorded.
- **S-7, which pull requests.** Does the Full suite run on every PR into
  `integration`, docs and state PRs included, and must branches be up to date
  before merge? Recommendation (not an owner answer): none recorded.

## Non-Goals

- Pull requests into `main`. Promotion to `main` stays the owner's act.
- Pre-commit or pre-push hooks. S-002R owns the setup-pre-commit skill, and a
  local hook would not have stopped a merge on GitHub.
- Replacing the separate-context Spec review with a machine check.
- Changing what the Codex GitHub review does.

## Dependencies And Blockers

- Blocked by
  [Tracked Full suite runner](../S-004R-tracked-full-suite-runner/SPEC.md)
  (S-004R): the workflow calls its runner.
- Open owner choices S-1 to S-7 above.
- The Full suite has only ever run on macOS. Whether it passes unchanged on a
  GitHub Linux runner (Node 26, Python 3, Git identity, BSD versus GNU tools) is
  unknown and is the first thing the Plan proves; S-6 settles whether tests may
  change to pass there.

## Vertical Implementation Slices

No Task is cut. Tasks are cut from live Actuality at activation with
`/to-tasks`. The intended direction is: LLM_Workbench's description of the
Template first; then a workflow running the fast check on a Linux runner as the
tracer; then the Full suite job through the runner, fixing portability gaps it
exposes; then the verdict gate with its red/green fixture; then the Template's
copy of the workflow; then branch protection and both Runbooks.

## Acceptance Criteria

- [ ] LLM_Workbench's description of the Template names the portable required-checks workflow and what it needs from a room, and that change lands before any Template artifact change.
- [ ] The Template carries the workflow with no room-specific command in it, and its gate and suite scripts pass in a fixture room made from the Template.
- [ ] A pull request into LLM_Workbench's `integration` runs the fast check, the Full suite and the verdict gate, and each reports its result on the PR.
- [ ] A branch reproducing PR #412's head turns the verdict gate red, naming S-002U and the fail verdict; closing the continued Task turns it green.
- [ ] A PR that touches no Spec with an unanswered fail verdict passes the gate.
- [ ] `integration` branch protection requires all three checks, shown by the protection API.
- [ ] The owner's answers to S-1 to S-7 are recorded in their owners (the edit scope in `AGENTS.md` and its Template, the ADR, this Spec) before the workflow lands.
- [ ] Named verification and remaining limitations are recorded without claiming owner approval.

## Testing Seams

The verdict gate's selection and decision logic lives in a tracked Node script
with a test in the Full suite, driven against fixture rooms made from the
Template with pass, fail and answered-fail verdicts. The workflow itself is
proved on throwaway PRs.

## Verification Procedure

Targeted test for the gate script, the Full suite through the runner, then two
throwaway PRs into `integration` (one red, one green) observed on GitHub, and
the protection API read back. Record actual commands and results in this Spec.

## Documentation Impact

First, LLM_Workbench's description of the Template, routed by `to-docs`. Then,
as the open choices are answered: a new ADR amending ADR-000F, `AGENTS.md` edit
scope and PR instructions and their counterparts in `templates/AGENTS.md`, and
`RUNBOOK.md` and `templates/RUNBOOK.md` Test And Build. The implement-spec skill
changes only if its merge step should mention the required checks.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-07 | none | Authored at the Map step from two implement-spec retros at integration d0fb161c1ff36caf936758b7492f7ef7fce8176e. | Map only; PR #412's merge, head commit e205ea422cc9ac8915052a2154fa4b79a95e0eab, repository visibility, ADR-000F and S-00J's non-goal were read; no runtime proof claimed. | This Spec. | Three owner decisions, Plan, implementation and proof remain. |
| 2026-10-07 | none | Revised from the owner grilling of 2026-10-07. Carries the governance-stack lens decision (the required-checks workflow is template-targeted and portable for rooms, and LLM_Workbench's description of the Template is updated first) and the edge that S-004R blocks this Spec. Keeps S-1 to S-7 open with recommendations, and drops the follow-up that held the workflow back from the Template. | Spec revision only; templates/ (no .github/), templates/AGENTS.md Edit Scope and templates/RUNBOOK.md Test And Build were read at d0fb161c1ff36caf936758b7492f7ef7fce8176e; no runtime proof claimed. | This Spec. | Owner answers to S-1 to S-7, S-004R, Plan, implementation and proof remain. |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

None recorded; follow-ups depend on the answers to S-1 to S-7.

## Supersession

- Supersedes: none
- Superseded by: none

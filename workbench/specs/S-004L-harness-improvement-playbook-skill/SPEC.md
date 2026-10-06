# S-004L - Harness Improvement Playbook Skill

**Spec ID:** S-004L
**Status:** active
**Priority:** 2
**Owner:** claude-s004l-dispatcher (Dispatcher; single writer of this Spec, its Task records and the projections; TK-008O claimed under the label claude-s004l-dispatcher-auditor, TK-008P under claude-s004l-worker-p)
**Stance:** Builder
**Updated:** 2026-10-06
**Catalog description:** Ship one improve-one-harnessed-job playbook skill that runs the baseline-to-rerun loop, point the Runbook's harness feedback and evaluation rows at it, and retire the host-installed harness-review family in its favor.
**Blockers:** none
**Latest event:** 2026-10-06: the separate-context Spec review failed the assembled candidate 50dc0a69 (verdict #1); new Tasks TK-006V (rewrite the skill in the Workbench's own words with full attribution) and TK-006W (fresh-context scenario rerun on the delivered text) were cut.
**Next gate:** TK-006V, then TK-006W; reassemble and obtain a fresh separate-context Spec review. No approval is claimed.

## Outcome

One tracked skill carries harness improvement: given one observed job, it takes a baseline, finds the earliest gap, makes the smallest owning intervention, verifies through the target's native checks, reruns on a fresh trajectory, and then retains, revises or removes the intervention. The Runbook's harness feedback loop, manual feedback report and evaluation rows point at it, and the harness-review family of fifteen host-installed skills retires in its favor.

## Why It Matters

The owner (2026-10-05): "I feel like the Playbook is what I was trying to have the RUNBOOK be, and we lost the design concept along the way". The family does, in fifteen skills, what one six-step loop does, and the loop's last step, remove what does not earn its maintenance cost, is the discipline the Workbench now needs most. This is the first move of retiring harness faster than adding it ([the playbook decision](../../docs/ddr/001I-harness-improvement-is-one-playbook-not-a-family-of-review-skills.md)).

## Current Verified State

At integration `ec65203d` (2026-10-05): the tracked skills lane holds no `harness-*` skill; its declared maintainer skills are `workbench-release`, `workbench-room-checks` and `workbench-evaluation`. The family lives only in the owner's host skills root: `harness-feedback-review`, which composes fourteen `harness-review-*` stage skills (scope, canon, grounding, actuality, reconnaissance, map gaps, classify causes, meta risks, diagnosis, actions, disposition, report, feedback lifecycle, assay follow-up). The repository names none of them; its Runbook index rows under Evaluation And Benchmarking, Harness Feedback Loop, Automated Feedback Gate and Manual Harness Feedback Reports point at the `workbench-evaluation` maintainer skill, which carries those procedures, and the feedback reports live in `workbench/feedback/`. No tracked skill carries the six-step baseline-to-rerun loop as one procedure. No implementation or agent-outcome proof for this capability is claimed by this Map record. At assembly (2026-10-06) the delivered state is the Completion Result below; this paragraph stays as the Map-time record.

## Desired Behavior

1. One core skill, `improve-harness` or a name the Plan chooses, carries the loop: baseline, earliest gap, smallest owning intervention, native verification, fresh rerun, retain or revise or remove. Each step names its checkable artifact.
2. It keeps what the family proved worth keeping: the read-only posture of a review, the three-plane classification of a claim (Canon, Grounding, Actuality), and the append-only feedback records as the place a lesson is written.
3. The one skill joins the closed core bundle; the catalog, install receipt, Template and update route follow, and a room updated from this version gains it. The host-installed family is outside this repository's edit scope: the Spec records it as retired in favor of the one skill and leaves its removal from the host skills root to the owner.
4. The Runbook's harness feedback and evaluation rows point at the one skill. `AGENTS.md` is unchanged unless a binding line names the family.
5. The Wiki's skill pages for the family become one page for the one skill, with the family named as history.

## Decisions And Contracts

- [Harness improvement is one playbook, not a family of review skills](../../docs/ddr/001I-harness-improvement-is-one-playbook-not-a-family-of-review-skills.md) (owner, 2026-10-05).
- The loop's shape is Ryan Lopopolo's improve-harness playbook, linked and attributed through the [lineage page](../../wiki/harness-engineering-lineage.md) under CC BY 4.0; the skill is written in the Workbench's own words and copies nothing.
- A skill change gets the same review care as a Contract change; the closed-bundle checks apply.

## Non-Goals

Changing the feedback record format, the evals or outcome trials, the guardrail audit, the self-drift check, or any other skill; a control experiment against another harness (the owner declined one on 2026-10-05).

## Dependencies And Blockers

- The `workbench-evaluation` maintainer skill owns the procedures this skill replaces; the skills lane and the Runbook are shared writers with the [Contract carrier rewrite](../S-004C-contract-carrier-pointer-brief-rewrite/SPEC.md); coordinate the Runbook row and any `AGENTS.md` line through that Spec's writer.
- The [release owner](../S-00O-workbench-v4-0-0-release/SPEC.md) retains version, Template and owner gates; a changed closed bundle needs the normal bundle, version and install proof. This Spec stamps no version label and does not upgrade the reference Template; it records both as the release owner's remaining work.
- The family's own planned Spec, [harness feedback review skill family alignment](../S-003K-harness-feedback-review-skill-family-alignment/SPEC.md), is overtaken by the playbook decision; its supersession is routed to the Director, not edited here.

## Vertical Implementation Slices

The Tasks are the records under `tasks/`; their state lives there, not here. Cut 2026-10-05 from Actuality at integration `35187ee6`: the lane holds no `harness-*` or `improve-*` skill, `coreSkills` ends its workflow half at `workbench-runtime` (27 entries), the Runbook rows "Evaluate a harness change" and "Take in harness feedback" point at the `workbench-evaluation` maintainer skill, and no open candidate holds `RUNBOOK.md`. The slicing and its order:

- First: [the skill and the bundle change](tasks/TK-008L/TASK.md), the independent tracer bullet that proves the loop is a lane skill the closed-bundle checks and the update route accept.
- After it, side by side (disjoint files): [the Runbook rows](tasks/TK-008M/TASK.md), which also carry the one `workbench-evaluation` section change, and [the Wiki page](tasks/TK-008N/TASK.md).
- Last: [the fresh-context scenario](tasks/TK-008O/TASK.md), by an Auditor, through the delivered route.
- Corrective, cut 2026-10-06 from the scenario's findings: [the feedback, rerun and test-without wording](tasks/TK-008P/TASK.md).

Writers: the Dispatcher writes `SPEC.md`, every Task record and the projections. `RUNBOOK.md` and `templates/RUNBOOK.md` have one writer (TK-008M), which checks for an open Contract-carrier candidate before editing. The host-installed family is read as evidence only and never edited; the Completion Result records it as retired in favor of the one skill.

What the one skill keeps from the family, decided at Plan from reading `harness-feedback-review` and its stages in the owner's host skills root (evidence, not Canon): the read-only posture until a change is authorized; the Governance Plane reading of each claim (Canon, Grounding, Actuality); the rule that one failed trajectory never establishes a worker limitation; the append-only feedback record as where the lesson is written. Dropped: the fourteen-stage decomposition, the separate reconnaissance, diagnosis and disposition composites and the stand-alone report as the unit of work.

## Acceptance Criteria

- [x] The one skill exists in the lane, its loop has six named steps each with a checkable artifact, and a scenario in a fixture room runs it end to end.
- [x] The one skill is in the catalog, the install receipt and the Template, the closed-bundle checks pass, and the Spec records the host family as retired in its favor.
- [x] The Runbook's harness feedback and evaluation rows point at the one skill, and the Wiki has one validated page for it.
- [x] Updating a room installs the one skill without touching the room's own skills.
- [x] The full suite passes on the committed candidate; named verification and remaining limitations are recorded without claiming owner approval.

## Testing Seams

The skills-lane and skill-catalog tests, the closed-bundle and install-receipt checks, the update-route round trip against a fixture room, and the Wiki validator.

## Verification Procedure

Run the targeted skills-lane, catalog, bundle and update tests, then the full AGENTS suite, `render` and `doctor`, on the committed candidate. Capture the guardrail baseline before and after. Obtain separate-context review of the immutable candidate before integration.

## Documentation Impact

The Runbook rows, one Wiki skill page, the lineage page's pointer to the skill, and the `templates/` mirror of any changed portable rule.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-05 | none | Authored at the Map step from the owner's playbook decision of 2026-10-05 and re-verified at integration ec65203d. | Map only; the family was counted in the host skills root and the lane was read, no runtime proof claimed. | This Spec. | Plan, implementation and proof remain. |
| 2026-10-05 | TK-008L, TK-008M, TK-008N, TK-008O | Plan: four Tasks cut and the Spec activated at integration 35187ee6. | Actuality inspected: lane listing, `coreSkills` in workbench/tools/workbench-layout.mjs, the Runbook index rows and tools/test-runbook-index.mjs pins, `gh pr list --base integration` (no open candidate holds RUNBOOK.md), the TK identifiers on every remote tip (highest TK-008K; Director block TK-008L to TK-008S). | This Spec. | Implementation and proof remain; S-003K supersession routed to the Director. |
| 2026-10-06 | TK-008L | Lane stopped by the Director on session wind-down; TK-008L candidate 61ed0855 on claude/s004l-tk008l-improve-harness (worktree .worktrees/s004l-tk008l, pushed) with its PR open, not merged. | Red a5565e6b, green 61ed0855 on test-skill-catalog, test-skills-lane, test-workbench-layout, test-core-skill-installer, test-workbench-upgrade, test-runbook-index, test-skill-inspection; wiki validate ok; guardrails 73/100 before and after; self-drift pre/post 14 attention findings, same set; full suite in progress (11/51 ok, no failure) when stopped. | TASK.md records only; the skill, catalog row and counts are in the candidate. | Next Dispatcher: rerun the full suite on 61ed0855, record the receipt, validate the merge answers, merge the PR, close TK-008L, re-render; then TK-008M and TK-008N side by side from integration (draft patch scripts and the Wiki page draft were session-local and are not durable), then TK-008O. |
| 2026-10-06 | TK-008L | Task closed | PR #372 merged at a3d72950 (candidate f85af35a, contained in integration); full suite 52/52 ok on committed 79f9805d; targeted test-skill-catalog, test-skills-lane, test-workbench-layout, test-runbook-index, test-wiki ok; red a5565e6b; guardrails 73/100 before and after; self-drift 14 attention findings pre/post, same set | improve-harness SKILL.md new; skills README, README, LEXICON, templates/GENESIS, workbench-room-checks and the genesis Wiki page carry the 28-skill count | none for this Task; TK-008M, TK-008N, TK-008O remain |
| 2026-10-06 | TK-008M | Task closed | PR #389 merged at eef29648 (candidate a3dedc3c, contained); full suite 52/52 on committed d081e10a; test-runbook-index 58/58, test-skill-inspection, test-governance-core, test-control-fidelity, test-carrier-landing, test-skill-catalog ok; carrier line-landing on RUNBOOK.md 6 removed, 6 landed; red 5ef903b5; guardrails 73/100 before and after; self-drift 12 findings pre/post, same set | RUNBOOK.md three rows and three section bodies, templates/RUNBOOK.md evaluation row and intro, workbench-evaluation two sections, workbench/wiki/maintainer-skills.md | Template rows Return harness feedback and Write a manual harness feedback report keep their own sections (routed to Spec QA) |
| 2026-10-06 | TK-008N | Task closed | PR #388 merged at 3208c7f5 (candidate 376f2b87, contained); full suite 52/52 on committed e0bec7e1; wiki validate 0 findings; test-wiki 25/25, test-skills-lane 6/6, test-landmark-wiki 79/79; small Wiki lint eight items pass on four touched pages; guardrails 73/100 before and after; self-drift 12 findings pre/post, same set | workbench/wiki/skill-improve-harness.md new; MEMORY.md, harness-engineering-lineage.md, skills-draft/README.md | Harness Feedback Review landmark page does not name improve-harness; test-wiki draft-index wording for the retired rows (routed to Spec QA) |
| 2026-10-06 | TK-008P | Corrective Task cut from the TK-008O fixture-room scenario (in progress): the skill's Taking In Feedback wording contradicts the append-only feedback record and the Feedback Dispositions set, step 5 covers only conversational hidden help, and step 6 has no reading for a test-without run that also closes the job. TK-008P takes the first identifier of the lane's reserved block (TK-008P to TK-008S), unused on every origin tip and open PR. | Scenario evidence: fixture room scratchpad/s004l/fixture/tally, result record workbench/feedback/runs/2026-10-06-add-lines-flag-result.md there; the scenario worker's hand-back items 1, 4, 11 and 12. | This Spec; TK-008P TASK.md. | TK-008P implementation; TK-008O close after the scenario decision. |
| 2026-10-06 | TK-008O | Task closed | Fresh-context fixture-room scenario: the worker found improve-harness through the Runbook operations index row Evaluate a harness change and produced a result record with the job contract and all six steps; fresh rerun and test-without runs by fresh workers; Auditor (Dispatcher in the Auditor stance) named each step's artifact in the room and every gap (TASK.md Scenario Result); no source change in this Task | TK-008O TASK.md Scenario Result | Skill wording findings carried by TK-008P; other-owner findings routed in the Completion Result; one pass claims no agent-outcome improvement |
| 2026-10-06 | TK-008P | Task closed | PR #395 merged at 50f19e64 (candidate 9418092e, contained); red 98fae067; full suite 52/52 on committed cd5b0ec6; test-skill-catalog, test-skills-lane, test-runbook-index, test-wiki, test-skill-inspection ok; guardrails 73/100 before and after; self-drift 11 findings pre/post, same set | improve-harness SKILL.md steps 4, 5, 6 and Taking In Feedback; workbench/wiki/skill-improve-harness.md | Corrected text not rerun by a fresh context; pins prove the text only |
| 2026-10-06 | none | Whole-Spec QA: all five Tasks closed; acceptance checked against Actuality; Completion Result written with routed gaps; the stale Harness Feedback Review landmark page repaired. | Bounded Wiki lint: wiki validate ok on the whole Wiki; pages naming the family, the feedback loop or the skill (router, lineage, skills-draft index, maintainer-skills, skill-improve-harness, the Harness Feedback Review landmark page; the archive page is history) read against each other, only the landmark page was stale; test-wiki and test-landmark-wiki ok. Guardrails 73/100 at assembly, unchanged from the TK-008L baseline. Full suite, self-drift, render, doctor and the report digest on the committed assembled candidate are in the Dispatcher hand-back. | workbench/wiki/design-concepts/landmark-harness-feedback-review.md; this Spec and the five Task records. | Separate-context Director review, owner Human QA and the routed gaps in the Completion Result. |
| 2026-10-06 | review | Review verdict: fail at 50dc0a6918619974c1d4fcc750ce362c8be1d50b [a981d4821aae] #1 | new Task: the improve-harness skill copies its CC BY 4.0 source verbatim (about 36 percent of lopopolo/harness-engineering playbooks/improve-harness.md in runs of 8 or more words, including the job contract, hypothesis template, whole result record, step 5 comparison dimensions and step 6 remove sentence) while SKILL.md, the skill-improve-harness Wiki page and SPEC.md claim it copies nothing, and its attribution lacks URL, license link and a changes-made notice and points at a lineage page a fresh room lacks. Rewrite the six steps, job contract, hypothesis and result record in the Workbench's own words (the lineage page records that the Workbench links and attributes the corpus and does not copy it), keep inside the skill an attribution naming author, title, URL and the CC BY 4.0 license, and make the copies-nothing claims true in SPEC.md, the Wiki page, the lineage page and the test-skill-catalog comment; new Task: acceptance item 1 is ticked on a scenario that ran at eef29648 before TK-008P changed steps 4 to 6 and the feedback intake, and whose starting baseline record named the answer. After the rewrite lands, a fresh context reruns the fixture-room scenario on the delivered skill text with no answer-bearing record in the starting state, and an Auditor records each step's artifact | separate-context Director review subagent (Claude Opus 5.5, read-only, no part in S-004L), 2026-10-06 | 2 |

## Completion Result

Delivered on integration through Task PRs #372 (TK-008L), #389 (TK-008M), #388 (TK-008N) and #395 (TK-008P), each merged on its two merge answers and a green full suite on its candidate, with state PRs #373, #387, #391, #393 and #394 carrying the records and the TK-008O scenario:

- `workbench/skills/improve-harness/SKILL.md` carries the loop in six named steps (observe the baseline, locate the earliest gap, state the smallest owning intervention, verify through the target's native checks, rerun on a fresh trajectory, retain, revise or remove), each naming its artifact, with a job contract, a result record and feedback intake; it keeps the read-only posture until a change is authorized, the Governance Plane reading of claims, the rule that one trajectory never establishes a worker limitation, and the append-only feedback record (TK-008L, corrected by TK-008P).
- It is the 28th skill of the closed core bundle: the layout catalog, the manifest policy, the skills catalog and every count statement (README, LEXICON, templates/GENESIS, workbench-room-checks, the genesis Wiki page) agree, the install receipt carries its hash, and the explicit skills update lays it into a room without touching the room's own skill (TK-008L).
- The Runbook rows "Evaluate a harness change", "Take in harness feedback" and "Write a manual harness feedback report", and the template row "Evaluate a harness change", point at the skill first; `workbench-evaluation` keeps only this repository's harvest and report steps around the loop (TK-008M).
- The Wiki has one validated page, [Improve harness](../../wiki/skill-improve-harness.md), naming the family as history; the lineage page, the router, the skills-draft index, the maintainer-skills page and the Harness Feedback Review landmark page agree (TK-008N, TK-008M, Spec QA).
- A fresh context in a fixture room found the skill through the Runbook operations index and ran all six steps end to end, including a fresh rerun and a test-without run; the Auditor named each step's artifact and every gap (TK-008O). The three skill-wording defects it found were corrected under TK-008P.
- The host-installed harness-review family (`harness-feedback-review` and its fourteen `harness-review-*` stages) is retired in favor of `improve-harness`; its removal from the owner's host skills root is the owner's step and is not claimed done.

Routed gaps (not fixed here; each names its owner):

- [harness feedback review skill family alignment (S-003K)](../S-003K-harness-feedback-review-skill-family-alignment/SPEC.md) is overtaken by the playbook decision and needs supersession by this Spec: Director.
- Version label and the reference Template upgrade for the 28-skill bundle: the [release owner](../S-00O-workbench-v4-0-0-release/SPEC.md).
- The template Runbook's "Return harness feedback" and "Write a manual harness feedback report" rows still point at the template's own sections, and the template report format (written for the setup-only Round One) only partly fits a loop result record: a later feedback-format Spec under the Continuous Cleanup landmark (see Remaining Limitations).
- `doctor` passes a room whose Runbook verification commands are unfilled template placeholders (the scenario's baseline gap): the diagnostics owner.
- The template Runbook's Workbench Evaluation Commands name producer-only `tools/` and `evals/`: the template Runbook's owner.
- The template feedback legend does not say whether a room-local change merged to integration is `landed`: the feedback-format owner.
- `tools/test-wiki.mjs` still describes the fifteen retired family rows of the skills-draft index as planned articles: the Wiki tooling owner.
- The Harness Feedback Review landmark's question cards were not revised for the retirement; only its Wiki page was: the landmark's card owner.

No agent-outcome improvement is claimed: the scenario is one pass of one job, and the TK-008P wording has not been rerun by a fresh context. No owner approval is claimed; the separate-context Spec review and owner Human QA remain.

## Remaining Limitations Or Follow-Up Specs

- Whether the feedback record format itself simplifies is a later question under the Continuous Cleanup landmark.

## Supersession

- Supersedes: none
- Superseded by: none

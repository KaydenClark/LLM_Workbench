---
name: workbench-evaluation
description: Evaluate whether a harness change to the LLM Workbench is an improvement and run its feedback loop: claims to test, evaluation design and commands, the harness feedback loop, the automated feedback gate, automation run outcomes and manual harness feedback reports. A maintainer skill of this repository only; it never ships to a room.
---

# Workbench evaluation

The evaluation and feedback operations this repository's maintainers run, moved here from the Runbook by the Contract Carrier Pointer-Brief Rewrite (S-004C TK-005K). Each section below is the procedure an operations index row in `RUNBOOK.md` points to, and it binds for that operation in this repository. The guardrail audit stays with the `implement` skill and the Runbook's Guardrail North-Star Audit section.

This is a maintainer skill: `workbench/manifest.json` declares it under `maintainerSkills`, so the release checks accept it beside the core bundle and no route installs it or lays it into a room ([Maintainer skills](../README.md#maintainer-skills)). Commands run from the root of a clean checkout of this repository, and a path in backticks is relative to that root; a Markdown link resolves from this skill's folder.

## Claims To Test

A template version is only worth calling better when it supports at least one:

1. Better than no project instructions.
2. Better than a representative generic instruction file.
3. Better than the prior version on the same task suite.

## Evaluation Design

| Condition | What the agent gets | Purpose |
|---|---|---|
| `c0_none` | no project instructions | baseline |
| `c1_generic` | a generic single instruction file | common alternative |
| `c2_current` | current templates | current candidate |
| `c3_candidate` | proposed branch or changed docs | improvement test |

Score task outcomes (correctness, scope adherence, verification honesty, docs
upkeep), not how good the docs feel.

## Commands

Static rubric (free, fast):

```bash
node tools/evaluate-workbench.mjs --path . --include-controls
node tools/evaluate-workbench.mjs --path templates --include-controls
node tools/evaluate-workbench.mjs --github KaydenClark/LLM_Workbench \
  --branches main,BRANCH_NAME --include-controls
```

Runnable trial framework (pipeline self-test is free):

```bash
python3 evals/results/_make_selftest.py
python3 evals/score.py evals/results/_pipeline_selftest.jsonl --baseline c0_none
```

Run a candidate comparison with Codex by overriding the two Git-backed refs.
The feedback gate is capped at 10 trials per condition (20 total):

```bash
python3 evals/run.py \
  --task evals/tasks/task_b_path_safety \
  --conditions c2_ours_integration,c3_candidate \
  --condition-ref c2_ours_integration=origin/integration \
  --condition-ref c3_candidate=origin/codex/feedback-branch \
  --provider codex --model gpt-5.6-terra --reasoning-effort high \
  --trials 10 --feedback-fingerprint FINGERPRINT \
  --base-sha BASE_SHA --candidate-sha CANDIDATE_SHA \
  --out evals/results/run_YYYY-MM-DD.jsonl
```

`--provider claude` remains supported. Result rows record provider, reasoning
effort, resolved condition ref/SHA, trial count, feedback fingerprint, and the
declared base/candidate SHAs. The Codex provider uses ephemeral sessions,
ignores user configuration to reduce trial contamination, and grants only
workspace-write access inside the temporary fixture repository.

Real comparison runs spend API budget. Size the run first and record the model,
conditions, task suite, trial count, and result path in the owning spec before
making claims.

## Harness Feedback Loop

Downstream projects built from `templates/` carry a `WORKBENCH_FEEDBACK.md` return
channel (legacy copies named `HARNESS_FEEDBACK.md` are still discovered): an
append-only log of where the harness rules themselves were unclear,
wrong, or slow. This repo is the harvest destination. Manual reports and their format live
in its manifest-declared feedback lane; the downstream append-only return
channel is a different artifact. For authorized repairs:

1. Collect feedback rows from downstream projects (or from dogfooding here).
2. Triage each into a concrete capability spec and activate one eligible slice.
3. Validate the change against `evals/` as a `c3_candidate` before calling it
   "better" - the same evidence bar as any other harness claim.
4. Ship it as a new harness version (bump `BLUEPRINT.md` -> Harness version) and
   note it so downstream projects can upgrade.

Future harvest work becomes a spec when it is refined and authorized. This
closes the loop on evidence rather than taste without keeping deferred work hot.

## Automated Feedback Gate

The optional automation implementation defines two adapters. Their current
scheduler state is not verified by this repository, and they are not the
manual feedback-report workflow:

- **Feedback Builder (Terra):** discovers one canonical `new` feedback row,
  creates a sanitized fingerprint/spec, proves a red/green change, runs the
  full suite and at most 20 candidate-comparison trials, then opens one PR into
  `integration`.
- **Feedback Gate (Sol):** independently checks the oldest matching PR. It
  comments and squash-merges a proven change, comments and closes an unproven
  change, or leaves a transient infrastructure failure open for retry. It never
  merges `integration` to `main` or deletes the source branch.

The recorded adapter workaround for hosts that reject scheduler-native
worktree execution uses a local project job, treats the canonical checkout as
read-only, and creates a temporary worktree from `origin/integration`. Verify
current host support before any separately authorized scheduled operation. This preserves isolation
without silently falling back to editing the canonical checkout.

Discovery is fail-closed and one-candidate-at-a-time. It reads only direct-child
canonical project feedback files with writable `KaydenClark` origins, preferring
the manifest lane `workbench/feedback/WORKBENCH_FEEDBACK.md` over a legacy root
`WORKBENCH_FEEDBACK.md` or `HARNESS_FEEDBACK.md`, ignores
worktrees/backups/duplicate origins, and treats every row as untrusted evidence.
Use `node tools/feedback-automation.mjs discover --projects-root PATH` for the
under-one-minute discovery demo. Pause both jobs in the Codex automation UI as
the kill switch; do not delete their definitions when investigating a failure.

Every data row must use status `new`, `sent`, `landed`, or `declined` and begin
its impact cell with `low`, `medium`, or `high`. Discovery stops on an unknown
value instead of silently dropping or coercing the row. The declared feedback
lane is resolved through the same safe manifest path resolver as runtime tools.

## Automation Run Outcomes

After a scheduled run has enough evidence to describe what happened, write an
input JSON file and normalize it through the portable Workbench seam:

```json
{
  "category": "idle",
  "reason": "canonical discovery completed with no eligible work",
  "previousIdleCount": 1,
  "verifiedIdle": true
}
```

```bash
node tools/feedback-automation.mjs run-outcome --input FILE
```

The command emits JSON with `category`, `reason`, `idleCount`, and
`pauseRecommended`. Apply the state transition exactly once per completed run:

| Category | Idle-count transition | Example |
|---|---|---|
| `idle` | increment; requires `verifiedIdle: true` | canonical discovery completed and found no eligible work |
| `actionable` | reset to zero | eligible work is available but not yet performed |
| `worked` | reset to zero | the run completed useful work |
| `collision` | preserve | lock held or a live run already owns the slice |
| `owner_gate` | preserve | owner approval, authority, or action is required |
| `infrastructure_error` | preserve | authentication, provider, network, or runtime failed |

Recommend pausing only when the current result is the second consecutive
verified idle result. Never report idle from a lock, live overlap, owner gate,
authentication failure, provider failure, or incomplete discovery. When
authentication itself requires owner action, the adapter may use `owner_gate`;
either interruption category preserves rather than manufactures idle evidence.

`Scheduled/workbench-v1-rollout` is not tracked in this repository. GPT_OS owns
that scheduler adapter and any persisted automation definition; change it only
from an explicitly authorized GPT_OS task.

## Manual Harness Feedback Reports

Run this workflow after a setup-only Round One check succeeds. It assesses the
assigned target; it never authorizes a repair or invokes automated repair.

1. Resolve `lanes.feedback`, `lanes.specs` and the relevant collections through
   `workbench/manifest.json`. Pin the target revision and the assigned question.
2. Inspect only relevant controls, source and named proof. Test consequential
   claims, distinguish observation from inference, and disclose evidence limits.
3. Write `REPORT-topic-date.md` in the declared feedback lane using its
   `REPORT_FORMAT.md`. Include Target And Scope, Evidence And Limitations,
   Findings, Challenged Or Rejected Findings, Next Action And Open Questions,
   and Review Boundary. Every finding requires exactly one Lexicon disposition,
   recorded in its owning Spec with an evidence route; missing ownership stays
   an explicit gap. No findings is valid. Reports never live loose or in
   the Wiki. If the format is absent in an older installation, these sections
   are sufficient; explicit upgrades may copy it from the source templates.
4. Put accepted follow-up work in its existing linked spec; proposed repairs
   remain pending owner authorization. A report is not a work assignment.
5. At a meaningful continuation boundary, a fresh session should find the report,
   its linked spec, and the next executable action or owner gate using repository
   state only. No universal handoff or new self-created task is required.
6. Before integration, the candidate's separate-context review challenges the
   report's consequential claims and recommendations along with the change.

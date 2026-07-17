# S-017 - Controlled Agent Outcome Measurement

> Generated from LLM Workbench v2.3. Stable path
> `specs/S-017-controlled-outcome-measurement/SPEC.md`; never move between status folders.

**Spec ID:** S-017
**Status:** active
**Priority:** 0
**Owner:** codex-engineer
**Updated:** 2026-07-17
**Catalog description:** Turn the existing trial runners and held-out graders into repeatable, uncertainty-aware evidence about real agent outcomes.
**Blockers:** none
**Latest event:** TK-003 implementation and no-spend fixture proof are green at a local checkpoint.
**Next gate:** Push the immutable TK-003 checkpoint and run the exact-head Auditor before close.

## Outcome

Workbench releases can make a bounded agent-outcome claim only from repeated,
same-task comparisons across explicit conditions, deterministic graders, and an
uncertainty-aware report that distinguishes synthetic self-tests from real runs.

## Why It Matters

The project already has runners, provider adapters, graders, and statistics,
but the live guardrail audit still assigns zero outcome-evidence points because
no non-synthetic repeated comparison has been completed. Without a durable
capability owner, the strongest product claim remains perpetually deferred.

## Current Verified State

- `tools/run-outcome-trials.mjs` and `tools/score-outcome-trials.mjs` prove a
  lightweight synthetic two-condition pipeline.
- `evals/run.py`, `evals/score.py`, and `evals/lib/stats.py` support provider,
  condition-ref, resolved-SHA, trial-count, fingerprint, and statistical output.
- S-002 supplies a condition-blind held-out path-safety domain in addition to
  the development scope-honesty task.
- Provider adapters are self-tested without model usage.
- No real repeated comparison currently supports a release-level outcome claim.

## Desired Behavior

- One report aggregates multiple registered tasks while preserving per-task and
  per-condition results, resolved refs, model, provider, reasoning effort, and
  trial counts.
- The report includes uncertainty and clearly labels synthetic, development,
  held-out, and real-agent evidence.
- Real comparisons use the same prompt, fixture, permissions, model family,
  time budget, and deterministic grader for each condition.
- Headline claims cite held-out results and disclose sample size, limitations,
  and negative or inconclusive findings.
- Paid model execution begins only after Kayden approves the bounded run size.

## Decisions And Contracts

- Conditions remain `c0_none`, `c1_generic`, released Workbench, staging
  Workbench, and an explicit candidate ref.
- Synthetic rows prove the apparatus only and never count as product evidence.
- Development tasks may tune tooling; held-out tasks cannot be inspected or
  tuned to improve a candidate score.
- A real run records exact refs and SHAs so the evidence can be reproduced.
- The first Engineer slice is no-spend: add deterministic aggregation and
  uncertainty reporting against fixture data before requesting model budget.

## Non-Goals

- Spending model budget without owner approval.
- Declaring Workbench universally better from one task or one run.
- Weakening graders, controls, or sample requirements after seeing results.

## Dependencies And Blockers

- [S-002](../S-002-heldout-evaluation/SPEC.md) is complete.
- Owner approval is required only for TK-004 model/API spend.

## Vertical Implementation Slices

Tickets are temporary tracer bullets within this stable capability record.

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Provide the portable outcome-trial runner, scorer, and synthetic honesty fixture | done | none | `node tools/test-outcome-trials.mjs` |
| TK-002 | Provide provider-neutral Git-ref trials, held-out grading, and statistical seams | done | S-002 | eval-runner self-test, pipeline self-test, and held-out grader |
| TK-003 | Aggregate multiple tasks into an uncertainty-aware no-spend report | in-progress | none | `python3 evals/test_score.py`; 96-row synthetic multi-task report; full Runbook suite |
| TK-004 | Execute the preregistered repeated real-agent comparison | blocked | TK-003, owner model/API spend approval | pending |
| TK-005 | Record the bounded release claim or inconclusive result in the evidence ledger | blocked | TK-004 | pending |

### Scoped Ticket: TK-003

**Vertical slice:** Extend the existing scoring seam so one deterministic command
can combine fixture rows from multiple registered tasks into a report with
per-task outcomes, composite comparison, sample sizes, and uncertainty, while
visibly excluding synthetic rows from real-evidence totals.

**Done criteria:**

- A failing fixture first demonstrates that current scoring cannot produce the
  required multi-task, evidence-class-aware report.
- The smallest implementation preserves existing single-file scoring and adds
  explicit sample size, interval, task class, and synthetic-exclusion output.
- Targeted scorer tests, the held-out grader, the full Runbook suite, static
  evaluator, guardrail audit, render, doctor, and diff check pass.
- No provider or paid model is invoked.

**Required proof:** Targeted red/green output plus the complete named verification
suite and a generated fixture report checkable in under one minute.

### Scoped Ticket: TK-004

**Vertical outcome:** Execute the preregistered repeated comparison across the
development and held-out tasks using exact refs, identical conditions, and the
owner-approved trial budget.

**Done criteria:** The run plan is recorded before execution; every row includes
provider, model, reasoning effort, condition ref/SHA, task class, prompt identity,
permissions, trial count, and grader result; failures remain rows rather than being
silently retried away; no candidate tuning occurs after held-out results are seen.

**Required proof:** Immutable JSONL, multi-task report from TK-003, exact commands,
budget actually used, full Runbook verification, and a less-than-one-minute report
review. **Owner gate:** Kayden approves the bounded model/API spend before execution.

### Scoped Ticket: TK-005

**Vertical outcome:** Convert the completed comparison into a bounded release
decision without overstating what the evidence supports.

**Done criteria:** `benchmarks/RESULTS.md` records effect direction, uncertainty,
sample size, task/model/condition limits, failures, and whether the result is
positive, negative, or inconclusive; Blueprint/README claims change only when
supported; negative results create a named follow-up rather than being discarded.

**Required proof:** Ledger diff, source result links, render, doctor, evaluator,
guardrail audit showing the honest evidence change, and complete Runbook verification.
No additional owner gate after TK-004 unless the result changes public product claims.

## Acceptance Criteria

- [x] The repository has deterministic outcome runners, scorers, provider adapters,
      and at least one development plus one held-out task.
- [x] One report aggregates multiple tasks with sample size and uncertainty.
- [x] Synthetic results are mechanically excluded from real-evidence claims.
- [ ] A preregistered repeated real-agent comparison runs at the approved budget.
- [ ] The evidence ledger records a bounded positive, negative, or inconclusive result.
- [ ] No release claim exceeds the measured tasks, agents, conditions, or uncertainty.

## Testing Seams

- Fixture JSONL rows spanning synthetic, development, and held-out task classes.
- Provider adapters replaced with local fake executables for no-spend tests.
- Deterministic graders restored from canonical files after each run.
- Statistical functions and report rendering tested independently of agents.

## Verification Procedure

```bash
node tools/test-outcome-trials.mjs
node tools/test-eval-runner.mjs
python3 evals/test_score.py
python3 evals/tasks/task_b_path_safety/test_grade.py
python3 evals/results/_make_selftest.py
python3 evals/score.py evals/results/_pipeline_selftest.jsonl --baseline c0_none
```

Then run the complete verification suite in `RUNBOOK.md`.

## Documentation Impact

- `evals/README.md`, `outcomes/README.md`, and RUNBOOK own commands and evidence interpretation.
- `benchmarks/RESULTS.md` owns the over-time result ledger.
- This spec owns the missing real-outcome capability and owner spend gate.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-07-17 | canon harvest | Separated implemented trial apparatus from the unfulfilled real-evidence outcome | Existing outcome, eval-runner, pipeline, held-out, evaluator, guardrail, render, doctor, and complete Runbook checks passed | Added S-017 and linked the coverage matrix | TK-003 through TK-005 remain |
| 2026-07-17 | TK-003 | Added deterministic multi-task reporting with per-task class, sample size, bootstrap intervals, reproducibility metadata, and fail-closed real-agent totals | Red: `python3 evals/test_score.py` failed 3 assertions because the report lacked classification and exclusion; green: 3 tests pass; provider-neutral runner, held-out grader, 96-row synthetic report, complete Runbook suite, root 113/113, templates 106.6/113, guardrail 78/100, render, doctor, and diff check pass without provider use | Updated AGENTS, RUNBOOK, evals/outcomes usage, result schema, benchmark ledger, and this spec | Exact-head Auditor remains before TK-003 close; TK-004 still requires owner model/API spend approval |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- The current live guardrail score remains limited by the absence of real repeated evidence.
- S-003 may use this apparatus for a later Dungeon Friends prospective pilot.

## Supersession

- Supersedes: S-002 only as the broader outcome-measurement owner; S-002 remains the held-out fixture evidence.
- Superseded by: none

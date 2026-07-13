# S-006 - Automated Harness Feedback Gate

**Spec ID:** S-006
**Status:** active
**Priority:** 0
**Owner:** codex
**Updated:** 2026-07-13
**Catalog description:** Build and operate a one-candidate Terra/Sol feedback loop with independent evidence gates.
**Blockers:** none
**Latest event:** Evaluation and selection tooling implemented; scheduler setup remains.
**Next gate:** Verify and activate both scheduled jobs.

## Outcome

One Terra job builds an evidence-backed harness-feedback PR and one Sol job
independently merges, denies, or blocks it without touching `main`.

## Why It Matters

Downstream feedback currently exists but has no repeatable harvest or independent
decision path, so valuable rows can remain `new` without changing the harness.

## Current Verified State

Canonical discovery selects the Little Local World non-writable-Git feedback
first. Selection/decision tests, held-out grading, and provider-neutral runner
tests pass without model usage. Scheduler definitions are not yet active.

## Desired Behavior

Discover one sanitized candidate, prove it with red/green and bounded trials,
then independently merge or deny its PR into `integration`.

## Decisions And Contracts

- Builder: `gpt-5.6-terra`, high reasoning, 1:00 AM America/Denver.
- Gatekeeper: `gpt-5.6-sol`, high reasoning, 5:00 AM America/Denver.
- Maximum additional candidate evidence budget: 10 baseline plus 10 candidate trials.
- Same-account GitHub verdicts use comments plus merge/close, not formal reviews.
- Transient infrastructure failure blocks and retries; evidence failure denies.
- Branches and PRs target `integration`; neither job merges to `main` or deletes branches.

## Non-Goals

- Automatically changing downstream feedback files or project source.
- Claiming general agent improvement from static-score movement.
- Protecting or publishing `main`.

## Dependencies And Blockers

- S-002 complete.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Provider-neutral eval and feedback decision tooling | done | S-002 | Targeted red/green self-tests pass |
| TK-002 | Create, document, and verify Terra/Sol schedules | in-progress | TK-001 | pending |

## Acceptance Criteria

- [x] Canonical discovery, ranking, deduplication, injection resistance, and one-open locking are tested.
- [x] Codex and Claude runner adapters are tested without model usage.
- [x] Pass, deny, and repeated-infrastructure-block decisions are tested.
- [ ] Both schedules are active with the correct project, worktree mode, model, reasoning, and cadence.
- [ ] Full verification and scheduler dry-run/view checks pass.

## Testing Seams

- Temporary canonical, duplicate, non-owner, and worktree repositories.
- Fake `codex` and `claude` executables that record arguments.
- Pure decision evidence objects for pass, deny, and block paths.
- Live read-only discovery against canonical GPT_OS project children.

## Verification Procedure

```bash
node tools/test-feedback-automation.mjs
node tools/test-eval-runner.mjs
python3 evals/tasks/task_b_path_safety/test_grade.py
node tools/feedback-automation.mjs discover --projects-root /Users/kayden/GPT_OS/Projects
```

Then run the full suite from `RUNBOOK.md` and view both automation definitions.

## Documentation Impact

- Root AGENTS/RUNBOOK/README, evals README, this spec, Machine wiki automation
  page, and Machine wiki log.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-07-13 | TK-001 red | Feedback helper, Codex arguments, and held-out fixture were absent | Three targeted commands failed for the expected missing interfaces/files | Owning docs identified | Implement minimum interfaces |
| 2026-07-13 | TK-001 green | Added discovery/decision helper, Codex adapter, metadata, and held-out domain | All three targeted commands pass without real model usage | Drafted interface and operations docs | Full suite and schedules |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Real behavioral claims still depend on candidate-specific repeated results;
  deterministic and static evidence alone cannot support a broad claim.

## Supersession

- Supersedes: none
- Superseded by: none

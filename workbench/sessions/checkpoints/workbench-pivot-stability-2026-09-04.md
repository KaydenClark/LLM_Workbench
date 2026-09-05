<!-- checkpoint: promoted 2026-09-04 from workbench/sessions/handoffs/workbench-pivot-stability-2026-09-04.md -->
# Workbench pivot stability checkpoint

STATUS: PAUSED — CHECKPOINT 2026-09-04 · by Codex
RESUME WITH: "resume workbench pivot"

## Resume header

- What this is: a safe standalone baseline for redirecting LLM Workbench design without releasing v3.1.
- Done so far: the repository is a standalone checkout; the v3.1 candidate is pinned at `4ce74f8de1da30a3bffd9286e32c3b63e417a08b`; all relocated linked-worktree metadata has been repaired; doctor, the portability/privacy matrix, and focused layout, tools, sessions, wiki, and cross-provider-resume fixture tests pass.
- Next step: create a new pivot spec that names the desired product direction and supersedes only future v3.1 work; do not modify completed historical records.
- Blockers / open decisions: the v3.1 candidate has no independent audit verdict because the auditor was interrupted by a provider rate limit. It is intentionally not landed, released, or handed to the S-014 promotion flow.

## Boundaries

- Treat `codex/workbench-pivot-baseline` as the local starting branch for future design work.
- Preserve `claude/v3.1-release` at the pinned candidate SHA as immutable release evidence.
- The standalone Workbench has no runtime dependency on Foundry or GPT_OS. Historical Foundry references remain evidence or legacy optional tooling; decide their future disposition in the pivot spec rather than deleting them during stabilization.
- Do not merge `integration` to `main` as part of this checkpoint.

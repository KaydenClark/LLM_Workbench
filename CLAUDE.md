# LLM Workbench - Claude Instructions

@AGENTS.md

Use this file only for Claude-specific workflow notes that cannot live in the
shared `AGENTS.md`. Keep shared project rules in `AGENTS.md` so Codex, Claude,
and other agents follow the same source of truth.

## Claude-Specific Notes

- This repo dogfoods its own harness: root docs are real, `templates/` is the
  blank product. Never fill `templates/` with this repo's specifics.
- Open PRs with `gh`. The default target is `integration`, not `main`: branch
  per task, PR into `integration`, and you may merge those below-`integration`
  PRs when safe. Only the owner merges `integration` -> `main`; the permission
  layer will (correctly) block any attempt to merge into `main`.

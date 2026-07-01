---
doc_type: claude_bridge
version: 1
project_name: "[PROJECT_NAME]"
status: template
imports:
  - AGENTS.md
---

# [PROJECT_NAME] - Claude Instructions

@AGENTS.md

Use this file only for Claude-specific workflow notes that cannot live in the
shared `AGENTS.md`. Keep shared project rules in `AGENTS.md` so Codex, Claude,
and other agents follow the same source of truth.

## Claude-Specific Notes

- Keep this file concise; large reusable project context belongs in `AGENTS.md`,
  `BLUEPRINT.md`, `ROADMAP.md`, or `RUNBOOK.md`.
- Add Claude-only tool, mode, or context-management notes here when they are
  genuinely needed.

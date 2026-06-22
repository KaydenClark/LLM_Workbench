# LLM Workbench

LLM Workbench is a reusable harness template for AI-agent projects. It gives a
new or existing repository the control files an agent needs before it starts
changing code: authority order, read/edit boundaries, project intent, operating
commands, verification rules, and durable handoff logs.

Use this repo when you want an AI agent to work inside a project with clear
guardrails instead of relying on chat history or one-off instructions.

## What This Contains

- `AGENTS.md` - agent behavior, authority order, read/edit scope, TDD rules, and
  proof-of-done requirements.
- `BLUEPRINT.md` - stable project identity, architecture, invariants, and
  safety boundaries.
- `ROADMAP.md` - current state, next work, blockers, backlog, and verification
  log.
- `RUNBOOK.md` - setup, run, test, build, troubleshooting, and recovery
  commands.
- `VISUAL_DESIGN.md` - shared visual standards for UI work, including palette
  and icon guidance.
- `team templates/` - optional manager, subagent, and taskboard templates for
  multi-agent workflows.

## How To Use It

1. Copy the relevant templates into the target project.
2. Replace bracketed placeholders with project-specific paths, commands, and
   rules.
3. Keep `ROADMAP.md` current as work changes state.
4. Require every completed agent task to leave proof in the final response and
   in the verification log.

The templates are intentionally plain Markdown so they work with Codex, Claude,
or any other agent that reads repository instructions.

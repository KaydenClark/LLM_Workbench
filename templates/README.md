# [PROJECT_NAME]

> Generated from LLM Workbench v[HARNESS_VERSION]. See `RUNBOOK.md` ->
> Upgrading The Harness.

[ONE-SENTENCE DESCRIPTION OF WHAT THIS PROJECT DOES AND FOR WHOM.]

[OPTIONAL: a short paragraph of context - the problem it solves, who uses it,
and the current state (prototype, in production, internal tool, etc.).]

## How This Project Is Run

This repository is governed by a small set of control documents. Read them
before changing anything:

- [`AGENTS.md`](AGENTS.md) - how agents behave here: authority order, read/edit
  scope, the task-selection loop, documentation ownership, and proof rules.
- [`BLUEPRINT.md`](BLUEPRINT.md) - compact product map, cross-cutting
  architecture/invariants, non-goals, and spec catalog.
- [`LEXICON.md`](LEXICON.md) - accepted project-wide terms and definitions;
  consult it when shared language could be ambiguous.
- [`TASKBOARD.md`](TASKBOARD.md) - active spec projection: current slice, owner,
  blocker, latest event, and next gate.
- [`specs/S-###-slug/SPEC.md`](SPEC.md) - on-demand capability truth,
  acceptance, decisions, verification, append-only evidence, and completion.
- [`RUNBOOK.md`](RUNBOOK.md) - how to set up, run, test, build, and recover this
  project, plus the verification commands that gate "done".
- [`MEMORY.md`](MEMORY.md) - the room brain: canonical, human-editable durable
  memory for this project. It routes to the live controls above and to flat
  memory notes; it never duplicates live task state.

- [`HARNESS_FEEDBACK.md`](HARNESS_FEEDBACK.md) - the return channel to the
  reusable harness these docs came from: log where the harness rules themselves
  are unclear, wrong, or slow the work down, so they can be improved upstream.

If this project was bootstrapped from a single founding prompt, the one-time
protocol that produced these docs is preserved in [`GENESIS.md`](GENESIS.md).
If instead the harness was adopted into an existing project, that one-time
migration protocol is [`ADOPTION.md`](ADOPTION.md). Either runs once at start;
after handoff, AGENTS plus the progressive spec flow above govern.

## Getting Started

```bash
[INSTALL COMMAND]      # e.g. npm install / pip install -e . / make setup
[RUN COMMAND]          # e.g. npm run dev / python -m app
[TEST COMMAND]         # e.g. npm test / pytest
```

Full setup, environment, and troubleshooting steps live in
[`RUNBOOK.md`](RUNBOOK.md).

## Working With Agents

The control docs are intentionally plain Markdown so they work with Codex,
Claude, or any other agent that reads repository instructions - no framework or
preprocessing required.

For **Claude Code**, add a one-line `CLAUDE.md` containing `@AGENTS.md`, or run
`/init` in this repo, so the rules load automatically. Other agents should be
pointed at `AGENTS.md` as their entry point.

Every completed ticket must leave proof in its final response and owning spec's
append-only evidence log. Milestone specs additionally require a short demo
artifact (screenshot, recording, preview URL, or one-command demo) so work is
accepted on product truth, not passing tests alone.

## Project Status

See [`TASKBOARD.md`](TASKBOARD.md) for active execution state and
[`BLUEPRINT.md`](BLUEPRINT.md) for the durable spec catalog.

## License

[LICENSE - e.g. MIT. See `LICENSE`.]

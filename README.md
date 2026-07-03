# LLM Workbench

LLM Workbench is a reusable control-doc template for AI-agent projects. It gives
a new or existing repository the files an agent needs before it starts changing
code: behavior rules, read/edit boundaries, project identity, task queue,
operating commands, verification rules, and durable proof.

Use it when you want agents to work from the same local source of truth instead
of relying on chat history or one-off instructions.

## Core Files

The blank, copyable templates live in `templates/`:

- `templates/AGENTS.md` - agent behavior, authority order, read/edit scope,
  task-selection loop, documentation ownership, and proof rules.
- `templates/BLUEPRINT.md` - stable project identity, product direction,
  architecture, invariants, safety boundaries, and preserved decisions.
- `templates/TASKBOARD.md` - live task queue, blocked/deferred lanes, current
  handoff, and proof log, plus an executive interface: a standing five-line
  executive brief and a pending-decision queue (options, recommendation, cost)
  for the owner who never reads code.
- `templates/RUNBOOK.md` - setup, run, test, build, troubleshooting, recovery,
  and evaluation procedure.
- `templates/README.md` - a blank, user-facing product README for the target
  project (points readers at the four control docs). The root README you are
  reading is the workbench's own and is not meant to be copied.
- `templates/GENESIS.md` - one-prompt bootstrap protocol: how an agent turns a
  founding prompt into the four filled control docs plus a smallest-running
  scaffold. Run once at project start, then delete or archive.
- `templates/ADOPTION.md` - migration protocol for an existing project (often on
  an older or foreign harness): observe the repo, map the old docs into the v2
  layout without losing content, verify on the existing test suite. The
  existing-project counterpart to `GENESIS.md`; run once, then archive.
- `templates/HARNESS_FEEDBACK.md` - the return channel from a downstream project
  back to this harness: an append-only log of where the harness rules themselves
  were unclear, wrong, or slow, so lessons can flow back and be validated via
  `evals/` before shipping as "better".
- `templates/.claude/settings.json` - optional Claude Code permission file that
  makes the `AGENTS.md` edit scope *mechanical* (deny secrets, allow writable
  roots, ask on review-required actions). See `templates/.claude/README.md` for
  the scope-to-permission mapping. Omit it if the project does not use Claude
  Code; the prose scope still governs every agent.

`ROADMAP.md` is no longer part of the default harness. Put stable product
direction in `BLUEPRINT.md` and executable next work in `TASKBOARD.md`.

## This Repo Dogfoods Its Own Harness

The root-level `AGENTS.md`, `BLUEPRINT.md`, `TASKBOARD.md`, and `RUNBOOK.md`
are not templates. They are the real, filled control docs that govern work on
the workbench itself, and they double as a living example of what filled-out
docs look like. Copy from `templates/`, not from the root.

## Supporting Files

- `team templates/` - optional manager/subagent coordination templates for
  small multi-agent runs.
- `benchmarks/` - static-rubric scoring docs and result summaries.
- `outcomes/` - controlled task-trial fixtures and self-tests.
- `evals/` - runnable comparison framework for measuring whether template
  versions change agent outcomes.
- `research templates/` - lightweight folder-per-investigation workflow for
  durable research reports.
- `tools/evaluate-workbench.mjs` - static rubric scorer for local folders and
  GitHub branches.
- `tools/run-outcome-trials.mjs` and `tools/score-outcome-trials.mjs` -
  lightweight outcome-trial runner and scorer.
- `tools/context-pack.mjs` - dependency-free prompt packer inspired by
  `simonw/files-to-prompt`.
- `tools/new-research-project.mjs` - creates a Simon-style research folder with
  `notes.md` and `README.md`.
- `LICENSE` - MIT license for reuse and adaptation.

## How To Use It

1. Copy `templates/AGENTS.md`, `templates/BLUEPRINT.md`,
   `templates/TASKBOARD.md`, `templates/RUNBOOK.md`, and `templates/README.md`
   into the target project root.
2. Replace bracketed placeholders with project-specific paths, commands, rules,
   and task items. For Claude Code, also copy `templates/.claude/settings.json`
   and fill it from the same edit scope to enforce the boundary mechanically.
3. Keep `BLUEPRINT.md` stable and source-backed.
4. Keep `TASKBOARD.md` current as work changes state.
5. Treat documentation as part of the task owner's work.
6. Require every completed agent task to leave proof in the final response and
   in the `TASKBOARD.md` proof log. For milestone tasks, also require a
   <1-minute demo artifact (screenshot, recording, preview URL, or one-command
   demo) in the proof log's Demo column, so the owner can accept work on product
   truth, not just passing tests.

The templates are intentionally plain Markdown so they work with Codex, Claude,
or any other agent that reads repository instructions.

For Claude Code, add a one-line `CLAUDE.md` containing `@AGENTS.md`, or run
`/init` in the target repo, so these rules load automatically.

### One-Prompt Bootstrap

To start a project from a single founding prompt instead of filling the docs by
hand, copy `templates/GENESIS.md` alongside the four control docs and hand the
agent the prompt plus GENESIS. GENESIS walks the agent through framing the
prompt, writing `BLUEPRINT.md`, choosing an architecture, scaffolding the
smallest thing that runs, filling `AGENTS.md` scopes and `RUNBOOK.md` commands,
and seeding `TASKBOARD.md` - then defines what a finished bootstrap must prove.
GENESIS runs once; after handoff the four control docs govern.

### Adopting Into An Existing Project

For a project that already exists - real code, history, and often an older or
foreign harness (`ROADMAP.md`, policy docs, a prior `AGENTS.md`) - use
`templates/ADOPTION.md`, not GENESIS. Copy it alongside the four control docs and
point the agent at the repo. ADOPTION inventories the existing docs and
classifies each (port into a v2 doc, fold into `AGENTS.md`, keep as project-local,
or archive), maps the old harness into the v2 layout **without losing content**,
derives the edit scope from the real directory tree, and verifies against the
project's existing test suite instead of a scaffold. It runs once, then is
archived; retired docs are preserved as history, never silently deleted.

## Versioning And Upgrades

Each copied control doc carries a `Generated from LLM Workbench v[HARNESS_VERSION]`
stamp so a downstream project can tell which harness version it is running. The
current harness version is **v2.1** (recorded in `BLUEPRINT.md`); this repo is the
source, so its own docs are not stamped.

To pull later harness improvements into a downstream project, follow that
project's `RUNBOOK.md` -> Upgrading The Harness: re-copy only changed template
sections, keep the project's filled-in specifics, bump the stamp, re-verify, and
record the upgrade in the proof log. Long-running projects should also archive
their proof log into `TASKBOARD_ARCHIVE.md` once it passes ~30 rows, and reclaim
stale `claimed`/`in-progress` tasks per `AGENTS.md` -> Long Session Control.

The upgrade path is a loop, not a one-way copy. Downstream projects record where
the harness helped or hurt in their `HARNESS_FEEDBACK.md`; those lessons are
harvested back here, turned into template changes, and validated with `evals/`
before shipping as a new harness version. A template change is only called
"better" when the evidence supports it - see `RUNBOOK.md` -> Evaluation And
Benchmarking. This is the "ruleset that updates the ruleset".

## Visual And Asset Guidance

This workbench does not define a house visual style. Use project-local design
docs, screenshots, brand requirements, or the original product prompt.

When visual work needs assets, search for license-safe free assets before adding
new files, record attribution requirements, and avoid emoji as interface icons
when a real icon, symbol, or text label can do the job.

## How To Test Template Changes

Run the static evaluator before merging template changes:

```bash
node tools/test-evaluate-workbench.mjs
node tools/evaluate-workbench.mjs --path templates --include-controls
node tools/evaluate-workbench.mjs --path . --include-controls
```

The first `--path` run scores the blank templates; the second scores this
repo's own filled root docs (the dogfood check).

Compare GitHub branches:

```bash
node tools/evaluate-workbench.mjs --github KaydenClark/LLM_Workbench \
  --branches main,branch-name --include-controls
```

The static scorer proves coverage of expected control surfaces. For stronger
evidence, use `RUNBOOK.md` -> Evaluation And Benchmarking plus `evals/` or
`outcomes/` to run controlled task trials and record outcomes.

Verify the local helper tools:

```bash
node tools/test-context-tools.mjs
node tools/test-outcome-trials.mjs
```

## Context And Research Workflow

Package selected files into Markdown:

```bash
node tools/context-pack.mjs AGENTS.md BLUEPRINT.md TASKBOARD.md RUNBOOK.md \
  --markdown --line-numbers \
  --output context.md
```

Package a larger folder into Claude XML-style documents:

```bash
node tools/context-pack.mjs . --cxml --extension md --ignore "context.md"
```

Start a new research folder:

```bash
node tools/new-research-project.mjs \
  --root research \
  --slug agent-context-packing \
  --title "Agent Context Packing" \
  --question "How should agents package project context?"
```

This pattern is adapted from Simon Willison's
[`files-to-prompt`](https://github.com/simonw/files-to-prompt) and
[`research`](https://github.com/simonw/research): gather the right files, keep
running notes, and turn the final investigation into a source-backed README.

## License

MIT. See `LICENSE`.

# Research Templates

This is a lightweight research workflow inspired by Simon Willison's
`simonw/research` repository.

Use it when a task needs investigation before implementation, especially when
the output should survive beyond a chat transcript.

## Workflow

1. Create one folder per research question.
2. Keep a running `notes.md` while working.
3. Write the final answer in `README.md`.
4. Include code, tests, demos, screenshots, or diffs only when they are part of
   the evidence.
5. Link to external repositories instead of copying them wholesale.
6. End with clear verification: what was run, what passed, and what remains
   uncertain.

## Create A Folder

```bash
node tools/new-research-project.mjs \
  --root research \
  --slug agent-context-packing \
  --title "Agent Context Packing" \
  --question "How should agents package project context?"
```

## Package Context For A Model

```bash
node tools/context-pack.mjs AGENTS.md BLUEPRINT.md ROADMAP.md RUNBOOK.md \
  --markdown --line-numbers \
  --output research/agent-context-packing/context.md
```

Use `--cxml` when sending a larger bundle to Claude-style long-context prompts.


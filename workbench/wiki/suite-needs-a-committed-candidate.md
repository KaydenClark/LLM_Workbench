---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Two separate contexts hit the same misleading failure cascade, 2026-09-07
  - zsh suite-loop failure observed 2026-09-26
  - Promoted from host auto-memory by the S-00V TK-00I audit, 2026-09-26
source_paths:
  - AGENTS.md
  - workbench/tools/workbench-layout.mjs
  - workbench/tools/diagnostics.mjs
  - RUNBOOK.md
last_verified: 2026-09-26
---

# Suite needs a committed candidate

Run the [AGENTS full verification suite](../../AGENTS.md#engineering-and-verification)
only against a committed tree. Nearly every suite builds its fixture through
`workbench-layout.mjs init`, and `init` verifies the release checkout's source
identity (its `origin`, concrete `HEAD` and runtime-tool bytes) before writing
anything. An uncommitted change to the manifest, the runtime tools or the
templates makes it refuse with `invalid-source-identity`, so about thirty tests
fail for a reason unrelated to the change under test. RUNBOOK documents the
refusal under its source-identity paragraph; this note records the consequence
for the suite.

- **Commit first, then run the suite**; amend or add a commit if it fails.
- **Mutation testing belongs in a throwaway worktree or clone**, never the live
  tree.
- **Take a clean-tree baseline before blaming a change.** A baseline is what
  separates a real regression from this cascade.
- **A suite runner should print its candidate first** (`candidate: <sha> ...
  dirty: []`) so a tally can be trusted; see
  [parallel-lane-dispatch](parallel-lane-dispatch.md).
- **zsh does not word-split unquoted variables.** Looping the suite commands as
  strings and running bare `$c` reports every command, including `doctor`, as
  `command not found`. Use `eval "$c"`. A run where every command fails is the
  loop, not the candidate.

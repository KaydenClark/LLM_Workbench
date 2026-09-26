---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - v3.1.2 parallel merge run of six Builder lanes, 2026-09-05
  - v4 build dispatcher phases one and two, 2026-09-16 to 2026-09-18
  - Duplicate-lane discovery, 2026-09-16
  - Promoted from host auto-memory by the S-00V TK-00I audit, 2026-09-26
source_paths:
  - AGENTS.md
  - RUNBOOK.md
  - workbench/specs/S-00V-portable-workbench/SPEC.md
last_verified: 2026-09-26
---

# Parallel lane dispatch

How a dispatcher session runs several builder lanes at once without losing work
or review evidence. The rules it serves are in
[AGENTS](../../AGENTS.md): one single durable writer for shared Spec and
Taskboard state, non-overlapping file lanes, and a separate-context review of
the immutable candidate before it combines into `integration`. The merge and
cleanup commands are RUNBOOK -> Version-Control Procedures.

## Shape

- **The dispatcher is the single durable writer.** It claims, dispatches a
  builder into its own worktree with a Markdown lane handoff as sole
  instruction, receives proof with a SHA, gets the separate-context review (never
  from the builder's own context or model), lands through the RUNBOOK closeout,
  then closes and re-renders.
- **Check for an existing lane before building.** Handoffs name the Task state,
  and `doctor`/`show` report a claim, but neither says who is executing it. Run
  `git worktree list` and `git branch -a --list '*<TASK-ID>*'` first; worktrees
  rooted in another session's scratchpad appear there too. On 2026-09-16 two
  sessions each delivered the same Task independently. Until claims are pushed
  and read from every remote tip (S-00V Desired Behavior 4), this is the cheap
  signal.
- **Expect a sibling's uncommitted work in a shared checkout.** Stage files by
  path, never `git add -A`, and run the suite in your own worktree.

## Suite and logs

- Keep the suite runner script read-only and have it print
  `candidate: <sha> ... dirty: []` first; trust no tally without that header. A
  subagent once overwrote a shared runner.
- Give every lane its own log path. Two builders once wrote to the same log and
  one read the other's tally.
- Builders run the suite in the foreground with a long timeout, or poll the log.
  A builder that ends its turn to wait for a background notification may never
  resume.

## Merging overlapping lanes

When lanes touch the same files, merge one at a time. Review content at the
branch's own SHA; at its turn the builder rebases onto the current tip. The
rebased tip is a new candidate, and the `AGENTS.md` integration gate governs
it: a new candidate needs a fresh separate-context review, and self-review
cannot satisfy that gate. A diff-equality check (`git diff <base> <approved>`
against `git diff <newtip> <rebased>`, excluding generated regions) is
preparatory evidence handed to that reviewer, which keeps the fresh review a
short delta check; it is never a substitute for it. Then open the PR and merge
with `--match-head-commit`. Conflicts are almost always generated
Taskboard/Blueprint regions (resolve by re-running `render`), registries, and
test-file tails. Keep reviewer agents alive so delta re-checks are cheap.

## What review keeps finding

Every candidate in the v4 run needed one corrective pass, so budget for it.
State PRs fail on drift more than mechanics: a header still calling finished
work pending, a Docs cell describing the plan rather than the diff, a Lexicon
cell half-updated. See [lifecycle-tool-behaviors](lifecycle-tool-behaviors.md)
and [separate-context-review-with-codex](separate-context-review-with-codex.md).
Many concurrent agents hit session usage limits; an interrupted agent resumes
from its transcript with nothing lost unless it was mid-commit.

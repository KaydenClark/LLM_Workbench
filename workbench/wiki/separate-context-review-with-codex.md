---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Observed during the grilling skill rebuild Spec (S-00X) Grilling Skill Destination Task (TK-00O) review, 2026-09-24
  - stdin hang observed during the grill-me skill rebuild Spec (S-00Z) review, 2026-09-26
  - Promoted from host auto-memory by the Portable Workbench Spec (S-00V) Host Memory To Wiki Task (TK-00I) audit, 2026-09-26
  - Owner rule that Codex runs only on his request, 2026-10-05
source_paths:
  - AGENTS.md
  - RUNBOOK.md
last_verified: 2026-10-05
---

# Separate-context review with Codex

**Not a route unless the owner asks.** The owner's rule, 2026-10-05: an agent
never runs Codex, or briefs a subagent to, unless he asks for Codex in the
current request ([AGENTS](../../AGENTS.md#safety-and-change-control)). Lanes
that ran repeated `codex exec` reviews on his account used up his Codex quota
for the week. A past approval does not carry over, and this page is not
authorization. Separate-context review also now runs only at a Spec's Verify
step, not on each Task ([AGENTS](../../AGENTS.md#task-merge-answers-and-verify-review)),
by a fresh context of the provider the session is running on.

The notes below are kept only so that an owner-requested Codex review can
start from what was already learned. Observed 2026-09-24 to 2026-09-26 (CLI
behavior can change; re-check when it misbehaves):

- `codex review --base origin/integration "<brief>"` exits 2: the CLI refuses a
  custom prompt together with `--base`, so nothing is reviewed.
- Working form: `codex exec -s read-only -m <model> "<brief>" < /dev/null`,
  where the brief names the BASE and HEAD SHAs, tells the reviewer to start from
  `git diff BASE HEAD`, and asks it to end with `VERDICT: PASS|FAIL`. A run takes
  about five minutes. The configured default model was unavailable at the time;
  `gpt-5.5` worked.
- **Always close stdin.** A backgrounded `codex exec` with stdin open prints
  "Reading additional input from stdin..." and waits forever; two reviews hung
  for 40 minutes or more before anyone noticed. A healthy run prints its diff
  read-out within seconds.
- Record the sandbox's limits in the evidence row: read-only mode cannot run
  fixture tests (`EPERM` on `mkdtemp`) and cannot fetch URLs, so paste any
  pinned external text it must compare against into the brief.

Record the verdict with `spec-workbench.mjs verdict` as RUNBOOK -> Spec
Lifecycle And Retrieval describes. See
[parallel-lane-dispatch](parallel-lane-dispatch.md).

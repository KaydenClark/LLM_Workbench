---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Observed during S-00X TK-00O review, 2026-09-24
  - stdin hang observed during S-00Z review, 2026-09-26
  - Promoted from host auto-memory by the S-00V TK-00I audit, 2026-09-26
source_paths:
  - AGENTS.md
  - RUNBOOK.md
last_verified: 2026-09-26
---

# Separate-context review with Codex

[AGENTS](../../AGENTS.md#git-rules) requires a separate-context reviewer to
check the immutable candidate before it combines into `integration`. When the
Codex CLI is available on the host, this is one working route. It is an
optional host capability, not part of the floor; any separate context that can
read the diff satisfies the rule.

Observed 2026-09-24 to 2026-09-26 (CLI behavior can change; re-check when it
misbehaves):

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

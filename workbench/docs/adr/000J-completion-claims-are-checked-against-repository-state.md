---
status: proposed
date: 2026-09-12
canonicalized_in:
  - AGENTS.md
  - RUNBOOK.md
---

# Completion claims are checked against repository state

A Task may not be closed as done while its work is uncommitted or unpushed,
unless the Receipt says so and says why.

Two mechanisms, at two different strengths.

**Visibility.** New diagnostics report a detached HEAD, and untracked files
under the controls, ADR and spec lanes, at severity `attention` with blocking
effect `none`. They surface in `doctor` and never block. `diagnostics.mjs`
already declares `git` as a valid scope with no finding currently using it, so
these land in a slot the registry pre-provisioned. Upstream distance joins the
Receipt row defined by
[ADR-000H](000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md).

**Enforcement.** `close` refuses when the tree is dirty or the branch is
unpushed, unless the Receipt explicitly records that state and a reason. The
reason text is preserved in the Receipt where a reviewer can read it, never
discarded once the check has passed.

Both are needed because they do different jobs. An attention finding "stays
visible without blocking" by its own registered definition, so visibility alone
cannot stop a false completion report — it can only make the evidence available
to someone who thinks to look. The false claim is made at `close`, so that is
where the check belongs.

Verified read-only at `c0ac60a`: `workbench/tools/diagnostics.mjs` registers 66
codes across the manifest, sessions, tools and specs scopes and contains no
git-state finding of any kind, and `workbench/tools/spec-workbench.mjs`
`closeTicket` requires only `--proof` and `--docs`, writes "closed with proof",
and reads no repository state at all. A Task can therefore be closed as done,
with proof, on a dirty unpushed tree, with nothing observing it. The session in
which this was decided was itself detached at `c0ac60a` with 39 porcelain
entries, thirteen of them untracked ADRs and Specs, and no control named it.

Considered and rejected: blocking `doctor` at effect `all` on a detached HEAD.
Detached is a legitimate inspection state — the deciding session was in it — and
blocking there would make the tool unusable in exactly the situation that most
needs it.

Considered and rejected: visibility alone, with an `AGENTS.md` rule that the
final message must list dirty state. That is the arrangement that already
failed; a rule addressed to the reporter cannot catch the report it is meant to
check.

Consequences: `closeTicket` gains a dependency on repository state that it has
never had, moving it from pure file parsing to reading Git. The recorded-reason
escape hatch that keeps the gate from being a wall is also the hole a future
agent can route around, which is why the reason is preserved in the Receipt
rather than consumed by the check. None of this migration is performed by this
decision; it is owned by its scoped spec.

Provenance: owner-approved answer RB-Q4, settled 2026-09-12, recorded in the
live grilling note `workbench-foundation-rework-2026-09-11` — untracked working
material named as origin rather than durable evidence.

## Promotion status

This record is `proposed`. `AGENTS.md` and `RUNBOOK.md` remain live Canon as
written, `diagnostics.mjs` registers no git-state finding, and `close` reads no
repository state, until the owner accepts it.

---
status: accepted
date: 2026-09-12
canonicalized_in:
  - AGENTS.md
  - RUNBOOK.md
  - workbench/specs/S-00M-completion-claims-against-repository-state/SPEC.md
---

# Completion claims are checked against repository state

A Task may not be closed as done while its work is uncommitted or unpushed,
unless the Receipt says so and says why.

Two mechanisms, at two different strengths.

**Visibility.** New diagnostics report a detached HEAD, and untracked files
under the controls, ADR and spec lanes, at severity `attention` with blocking
effect `none`. They surface in `doctor` and never block. `diagnostics.mjs`
already declares `git` as a valid scope, so these land in a scope the registry
pre-provisioned rather than needing a scope change. Upstream distance joins the
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
codes and contains no finding that observes HEAD, the working tree, untracked
files or upstream distance — its two `git`-scope findings,
`integration-branch-undeclared` and `integration-branch-missing`, both check
the declared integration branch — and `workbench/tools/spec-workbench.mjs`
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
decision; it is delivered by
[S-00M](../../specs/S-00M-completion-claims-against-repository-state/SPEC.md),
authored at this record's acceptance to close the delivery-owner gap the
proposed record named.

Provenance: owner-approved answer RB-Q4, settled 2026-09-12, recorded in the
live grilling note `workbench-foundation-rework-2026-09-11` — untracked working
material named as origin rather than durable evidence.

## Acceptance

Accepted by the owner on 2026-09-15, together with
[ADR-000H](000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md)
and [ADR-000K](000K-every-feedback-finding-carries-one-of-four-dispositions.md).

Nothing in `AGENTS.md` or `RUNBOOK.md` asserted the opposite of this decision —
both were silent on what `close` checks — so acceptance landed no control edit.
The whole migration, and the control text that describes it, belongs to
[S-00M](../../specs/S-00M-completion-claims-against-repository-state/SPEC.md).
Until its slices land, `doctor` registers no finding that observes Git working
state and `close` reads none: a recorded implementation gap with a named owner,
not undetected drift.

One verification sentence in this record was corrected at acceptance. It had
claimed the `git` scope had "no finding currently using it"; at the `c0ac60a`
anchor it cited, and at acceptance, `integration-branch-undeclared` and
`integration-branch-missing` both used it. The substantive claim — that no
finding observes HEAD, the working tree, untracked files or upstream distance —
was verified and holds.

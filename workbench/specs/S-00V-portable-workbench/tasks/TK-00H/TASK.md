# TK-00H - A session-start host floor check reports each floor item and a missing item is an `all` finding

**Task ID:** TK-00H
**Spec ID:** S-00V
**Slice:** A session-start host floor check reports each floor item and a missing item is an `all` finding
**Status:** ready
**Blockers:** none
**Destination:** spec-acceptance: S-00V box 5 (the host floor check reports each floor item, and a Task needing an optional capability the host lacks lands in blocked or needs-review with the capability named)
**Stance:** Builder
**Planned verification:** Red: tests in `tools/test-diagnostics.mjs` and `tools/test-spec-workbench.mjs` with injected probe results assert that the check reports Node 18+, Python 3.9+, git, `gh` authenticated with push rights to the room's remote, and network to GitHub, and that each missing item raises a registered `all` finding; green after the check and registry entries land; plain `doctor` stays deterministic offline; full AGENTS suite; separate-context review.

## Delivery

Build the tracked floor check from Desired Behavior 5 and grilling decision-008.
Probes sit behind an injectable seam so tests never depend on the host, the
network or real `gh` credentials. A session-start invocation (choose and record
the command shape, for example a `doctor` mode or a dedicated command, in the
Spec evidence) reports every floor item with its observed value; a missing item
is a registered `all` finding in that invocation. Keep ordinary `doctor`,
which the suite and read-only reviewers run offline, free of network and
credential probes unless the choice is recorded with its reason.

The finding registry in `workbench/tools/diagnostics.mjs` is shared: S-00M
(Lane D) is adding git-state findings. Rebase often and keep both.
RUNBOOK Prerequisites wording is a controls edit that S-00P is rewriting:
record the needed wording in S-00V's gap for the controls sweep (TK-01P) instead of editing
RUNBOOK here.

## Done Criteria

- Each floor item appears in the report with pass or fail and its value.
- A fixture missing each item in turn raises the registered `all` finding and
  `doctor` exits non-zero in that invocation only.
- Optional capabilities are not part of this Task; they route through the
  capability-routing Task.

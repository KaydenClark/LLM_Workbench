# TK-00H - A session-start host floor check reports each floor item and a missing item is an `all` finding

**Task ID:** TK-00H
**Spec ID:** S-00V
**Slice:** A session-start host floor check reports each floor item and a missing item is an `all` finding
**Status:** done
**Blockers:** none
**Destination:** spec-acceptance: S-00V box 5 (the host floor check reports each floor item, and a Task needing an optional capability the host lacks lands in blocked or needs-review with the capability named)
**Stance:** Builder
**Planned verification:** Red: tests in `tools/test-diagnostics.mjs` and `tools/test-spec-workbench.mjs` with injected probe results assert that the check reports Node 18+, Python 3.9+, git, `gh` authenticated with push rights to the room's remote, and network to GitHub, and that each missing item raises a registered `all` finding; green after the check and registry entries land; plain `doctor` stays deterministic offline; full AGENTS suite; separate-context review.
**Proof:** Red: tools/test-diagnostics.mjs 25/32 (7 failing: two registry pin tests without host-floor-unmet, plus five host-floor tests failing on ERR_MODULE_NOT_FOUND for workbench/tools/host-floor.mjs) and the tools/test-spec-workbench.mjs parseCliArgs doctor --host assertion (host swallowed --json); green 32/32 and test-spec-workbench pass after workbench/tools/host-floor.mjs, the host-floor-unmet registry entry (error/host/all, new host scope) and doctorCommand landed. Invocation shape: boolean doctor --host on spec-workbench.mjs, chosen because session start already runs doctor (AGENTS Work Selection step 2) and the Done Criteria name a doctor exit in that invocation only; plain doctor, next and claim never call a probe, so the suite and read-only reviewers stay deterministic offline, and --host JSON is {floor, findings} while plain --json stays the byte-unchanged finding array. Every floor item (Node 18+, Python 3.9+, git, gh authenticated with push rights to origin, network to GitHub) is reported with pass/fail and observed value; each item missing in turn raises exactly one host-floor-unmet and doctorCommand exits 1 with --host and 0 without; probes are injected, and a throwing probe is a visible fail. PINNED_EFFECTS updated deliberately for the new code. Manual: real-host doctor --host 5/5 pass, exit 0; with PATH reduced to node only, python/git/gh fail, exit 1. Full AGENTS suite TOTAL pass=48 fail=0 on the worker candidate bcac36a929e8f354a5bbcb15338d5249a341b48b, whose implementation commit is replayed unchanged as effa1c1 on top of the closed TK-00G; templates and controls untouched; static check only, no agent-outcome claim.

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

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s00v-tk00h-host-floor | effa1c1f9f51a4f5ebcd650fd9b8bfdd7d1792f9 | ahead 20 behind 4 | 0 | Red: tools/test-diagnostics.mjs 25/32 (7 failing: two registry pin tests without host-floor-unmet, plus five host-floor tests failing on ERR_MODULE_NOT_FOUND for workbench/tools/host-floor.mjs) and the tools/test-spec-workbench.mjs parseCliArgs doctor --host assertion (host swallowed --json); green 32/32 and test-spec-workbench pass after workbench/tools/host-floor.mjs, the host-floor-unmet registry entry (error/host/all, new host scope) and doctorCommand landed. Invocation shape: boolean doctor --host on spec-workbench.mjs, chosen because session start already runs doctor (AGENTS Work Selection step 2) and the Done Criteria name a doctor exit in that invocation only; plain doctor, next and claim never call a probe, so the suite and read-only reviewers stay deterministic offline, and --host JSON is {floor, findings} while plain --json stays the byte-unchanged finding array. Every floor item (Node 18+, Python 3.9+, git, gh authenticated with push rights to origin, network to GitHub) is reported with pass/fail and observed value; each item missing in turn raises exactly one host-floor-unmet and doctorCommand exits 1 with --host and 0 without; probes are injected, and a throwing probe is a visible fail. PINNED_EFFECTS updated deliberately for the new code. Manual: real-host doctor --host 5/5 pass, exit 0; with PATH reduced to node only, python/git/gh fail, exit 1. Full AGENTS suite TOTAL pass=48 fail=0 on the worker candidate bcac36a929e8f354a5bbcb15338d5249a341b48b, whose implementation commit is replayed unchanged as effa1c1 on top of the closed TK-00G; templates and controls untouched; static check only, no agent-outcome claim. | Contract documented in code comments in workbench/tools/host-floor.mjs, the host-floor-unmet registry entry and the doctorCommand seam comment. RUNBOOK Prerequisites and the session-start command wording are deferred to TK-01P under the S-00P controls hold; exact wording is in the remaining gap. Docs checked; no other owner needs an update. | TK-01P controls sweep must add to RUNBOOK Prerequisites (and templates/RUNBOOK.md, generic): 'Check the host floor at session start with node workbench/tools/spec-workbench.mjs doctor --host. It reports Node 18+, Python 3.9+, git, gh authenticated with push rights to the room's origin remote, and network to GitHub, each with pass or fail and the observed value. A missing item is the all finding host-floor-unmet and that run exits 1; plain doctor never probes the host and stays offline.' AGENTS.md Work Selection step 2 may name doctor --host for the first doctor run of a session. Optional-capability routing stays TK-00K. | 42d872bbf42bbaef23a5c12fc67a39243db4520296b81507122ce529fdf8dc7d |

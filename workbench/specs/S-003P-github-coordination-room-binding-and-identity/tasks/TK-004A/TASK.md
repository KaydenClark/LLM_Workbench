# TK-004A - Inspect an explicit GitHub room binding at an immutable source revision

**Task ID:** TK-004A
**Spec ID:** S-003P
**Slice:** Inspect an explicit GitHub room binding at an immutable source revision
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: A read-only public command resolves committed room binding at an exact commit, rejects malformed input with named errors and leaves the checkout unchanged.
**Planned verification:** Public CLI red/green fixtures for committed binding, missing/invalid configuration, immutable source isolation, symlink refusal and no-write behavior; registered receipt-backed installation; complete AGENTS suite and one-command demo.

## Assigned Scope

One Worker writer owns `workbench/tools/github-coordination.mjs`, its managed
registration in `workbench-layout.mjs`, `tools/test-github-coordination.mjs`,
the first binding declaration in the manifest, and its procedure at
`workbench/docs/github-coordination.md`. This inspector reads binding metadata
from Git and performs no GitHub request, assignment or claim. The owner request
authorizes this first executable slice within the wider package.

The binding is an optional additive `githubCoordination` manifest field with
schema version 1 and an explicit `owner/repository` name. Credentials and live
actor policy are excluded. Unconfigured legacy rooms remain readable elsewhere;
the inspector reports a named unconfigured result. Repository metadata is not
proof of live access. Require an exact commit, validate the root and blob mode,
and refuse malformed input before returning a binding. Ignore dirty files and
Git replacement objects when reading immutable source.

## Acceptance And Remaining Work

Advance acceptance line 1 and the inspector portion of line 4 only. Artifact
mapping, native Issue IDs, trusted actors, writes and the claim cutover remain
outside this Task. The current ADR-000O claim reader stays operative. Shared
workflow controls/templates are deferred to their existing S-00P/cutover owner;
this Task adds an optional inspector without changing the generic workflow.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | codex/github-coordination-binding | 99643c226fbb0a6b921eeb7e2337eca1742864f7 | ahead 0 behind 0 | 5 | Public CLI expected red exit1 for missing inspector; six source/refusal/no-write cases green6/6 after implementation; installed and full-suite proof pending. | Binding procedure authored; generic workflow controls/templates deferred because inspector is optional and does not change claims. | Installed inspector, full frozen-candidate checks and independent integration review pending; no native Issue operations or cutover. | 1177a12fbb920bedec1597148530847a2878c166489c674d699ddf0f4f3fea9a |
| 2 | codex/github-coordination-binding | de53544083201d66e76c7f56a95b975911ec8ed5 | ahead 2 behind 0 | 5 | Inspector7/7 passes including receipt-backed installed command and exact hash; full candidate de535440 run45/49: four failures caused by stale Taskboard receipt projection. Projection regenerated; final frozen-candidate full rerun pending. | Seven native capability Specs, S00O package map, S01X composition acceptance, binding procedure and native DQC related/affected-claim reconciliation. Generic operational control mirror remains with S00P/cutover; metadata-only binding adds no required service. | Independent final-candidate review, full rerun and integration containment remain; no Issue operations, actor policy, artifact mapping or claim cutover. | 463e8903e2271dbb9060192a0f2fc3b7a4bcb03f0b66bfb63be3aa5bfacac5c5 |

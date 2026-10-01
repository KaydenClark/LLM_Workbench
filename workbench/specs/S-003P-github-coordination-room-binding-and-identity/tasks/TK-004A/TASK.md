# TK-004A - Inspect an explicit GitHub room binding at an immutable source revision

**Task ID:** TK-004A
**Spec ID:** S-003P
**Slice:** Inspect an explicit GitHub room binding at an immutable source revision
**Status:** ready
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

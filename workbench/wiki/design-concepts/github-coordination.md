---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner direction and grilling answers on GitHub coordination, 2026-09-30 to 2026-10-02
source_paths:
  - workbench/docs/adr/proposed/000Q-github-issues-are-the-required-live-coordination-authority.md
  - workbench/docs/adr/000O-claims-are-pushed-on-the-task-branch-and-read-from-every-remote-tip.md
  - workbench/specs/S-003P-github-coordination-room-binding-and-identity/SPEC.md
  - workbench/specs/S-003Q-github-coordination-issue-graph/SPEC.md
  - workbench/specs/S-003R-github-coordination-trusted-assignments/SPEC.md
  - workbench/specs/S-003S-github-coordination-operational-transitions/SPEC.md
  - workbench/specs/S-003T-github-coordination-shared-continuation/SPEC.md
  - workbench/specs/S-003U-github-coordination-setup-and-upgrade/SPEC.md
  - workbench/specs/S-003V-github-coordination-claim-authority-cutover/SPEC.md
  - workbench/specs/S-00O-workbench-v4-0-0-release/SPEC.md
parent: none
authorized_by: promotion of the owner's 2026-10-02 grilling decisions
last_verified: 2026-10-02
---

# GitHub coordination

GitHub Issues are the live coordination layer the Workbench is moving to for
normal delivery. This article explains the accepted destination and the
owner's decisions about who may act and what counts. Nothing described here is
built yet. Until a separately reviewed cutover lands on integration, pushed
Task-branch claims, the rule in the decision record
["Claims are pushed on the task branch and read from every remote tip"](../../docs/adr/000O-claims-are-pushed-on-the-task-branch-and-read-from-every-remote-tip.md),
stay the one operative claim authority.

## What the destination is

The owner made Issues required for v4, not an optional mirror. An Issue holds
live assignment, the active Worker, operational holds and the next hand-back.
Scope, requirements, acceptance and permission stay with the request, the
Contract and the assigned Spec and Task. Native pull requests and exact commits
carry candidate and review activity, and repository records keep receipts and
owner approval. The proposed decision record
["GitHub Issues are the required live coordination authority"](../../docs/adr/proposed/000Q-github-issues-are-the-required-live-coordination-authority.md)
holds the full ownership split and the conditions of the cutover. It stays
proposed until that cutover lands.

## Who may act and what counts

Decided by the owner on 2026-10-02:

- Trusted Issue operations go through the owner's own GitHub account. A role is
  assigned at the start of a chat and is not forced by the GitHub identity, so
  the Dispatcher and Director should notice a Worker that acts outside its
  assignment. The Captain or Director approves if they can; otherwise they
  mark the item as needing human review and wait for the owner.
- A Director's assignment-race ruling and the coordinator's v4 tie-break are
  structured Issue records. Prose, labels, assignee and bot messages never
  count.
- Only structured records authored by the room's configured GitHub account
  count; everything else on an Issue is information. In v4 that is the owner's
  account. Nothing is built for other accounts yet.
- Verified Issue write access is part of the minimum capability for any host
  that takes a Task. A host without it may read, recover and review, but it
  refuses claims and transitions and does not fall back to branch claims.

## One claim authority per item of work

One active claim authority applies per item of work, not per room or per
project. Tasks and Specs are worked in parallel, and an agent claims one item
of work rather than the whole project. Whether a room may carry both claim
mechanisms for different items while the move happens is not decided; the
claim-authority cutover Spec decides it.

## Views and audience

The generated Taskboard and the generated Landmark Tracker are composed views
that never carry authority. Whether GitHub Projects are required for v4, and
whether v4 may fall back to those two views if Project access does not work,
is not decided. In v4 the owner is the only person using the Workbench, so
nothing here is designed for other people or a team.

## What exists and what does not

No GitHub adapter, binding, structured-record format or Issue-backed claim
runtime exists. The extended-outage recovery question is deferred off the v4
critical path. Seven capability Specs own the work:

- [GitHub Coordination Room Binding And Identity (S-003P)](../../specs/S-003P-github-coordination-room-binding-and-identity/SPEC.md): binds a room to its repository and artifact identities.
- [GitHub Coordination Issue Graph (S-003Q)](../../specs/S-003Q-github-coordination-issue-graph/SPEC.md): the Spec, Task, landmark and question-card graph in Issues.
- [GitHub Coordination Trusted Assignments (S-003R)](../../specs/S-003R-github-coordination-trusted-assignments/SPEC.md): defines the structured record's fields and validation.
- [GitHub Coordination Operational Transitions (S-003S)](../../specs/S-003S-github-coordination-operational-transitions/SPEC.md): operational holds, hand-backs and other state transitions.
- [GitHub Coordination Shared Continuation (S-003T)](../../specs/S-003T-github-coordination-shared-continuation/SPEC.md): a fresh host recovers an assignment from the Issue.
- [GitHub Coordination Setup And Upgrade (S-003U)](../../specs/S-003U-github-coordination-setup-and-upgrade/SPEC.md): delivers the adapter and skills through setup and upgrade.
- [GitHub Coordination Claim Authority Cutover (S-003V)](../../specs/S-003V-github-coordination-claim-authority-cutover/SPEC.md): switches claim authority at one reviewed change.

The [Workbench v4 release Spec (S-00O)](../../specs/S-00O-workbench-v4-0-0-release/SPEC.md)
owns release ordering and records the single-owner audience for v4.

## Evidence and Sources

- [Decision record "GitHub Issues are the required live coordination authority"](../../docs/adr/proposed/000Q-github-issues-are-the-required-live-coordination-authority.md): the destination, the owner's decisions and the cutover conditions (proposed).
- [Decision record "Claims are pushed on the task branch and read from every remote tip"](../../docs/adr/000O-claims-are-pushed-on-the-task-branch-and-read-from-every-remote-tip.md): the operative claim rule until the cutover.
- [Workbench v4 release Spec (S-00O)](../../specs/S-00O-workbench-v4-0-0-release/SPEC.md): the capability map and the v4 audience.

## History

- 2026-10-02: Created by promotion of the owner's grilling decisions on trusted identity, verifiable records, the write floor, per-item claim authority and the v4 audience. The Projects requirement was left open.

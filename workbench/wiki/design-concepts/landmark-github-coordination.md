---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Seeded from the current answers of the GitHub Coordination landmark's question cards (landmark record revision 1; cards at the revisions named in the text), 2026-10-04
source_paths:
  - workbench/landmark-tracker/landmarks
  - workbench/landmark-tracker/destination-questions
  - workbench/docs/adr/proposed/000Q-github-issues-are-the-required-live-coordination-authority.md
parent: none
authorized_by: the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages)
last_verified: 2026-10-04
---

# Landmark: GitHub Coordination

This page is the evolving synthesis of the GitHub Coordination landmark
(landmark ["GitHub Coordination" (LMK-000A)](../../landmark-tracker/landmarks/LMK-000A.json)).
It sums up what the landmark's four question cards currently say, in prose, and
is updated whenever one of them changes. The cards and the landmark record keep
the structured account and the lineage; the delivering decisions and Specs
govern. For the owner-facing explanation of the destination, read the article
[GitHub coordination](github-coordination.md), which goes into who may act and
what counts in more depth than this synthesis.

## What the landmark is

Live coordination of delivery moves to GitHub Issues: who holds an assignment,
which Worker is active, what is on hold and who hands back next. The landmark
matters because it changes which owner holds that live state for every role,
and a mistake could create two claim authorities or let free Issue text widen
what an agent is allowed to do.

## Current accepted answers

These are the answers the cards record as confirmed. Each card's basis says
what was owner-settled and what was not; only the confirmed part is stated as
a claim here.

- **Issues are the live coordination authority, not a mirror**
  (card ["GitHub Issues as the required live coordination authority" (DQC-000B)](../../landmark-tracker/destination-questions/DQC-000B.json), revision 12).
  Issues own live assignment, the active Worker, operational holds and the
  next hand-back, through bounded trusted operations. The request, the
  Contract and the assigned Spec and Task keep scope, requirements, acceptance
  and permission. Native pull requests and exact commits express candidate and
  review activity through the Workbench gates, and repository records keep
  receipts, acceptance and owner approval. Issue prose, an assignee, a label
  or a bot message never enlarges authority or proves exclusivity or review.
- **Who decides and who counts.** Directors resolve assignment races, and the
  owner-designated coordinator breaks v4 ties; both rulings are structured
  Issue records. Trusted Issue operations use the owner's own GitHub account
  in v4, and only structured records authored by the room's configured
  account count. The owner decided these on 2026-10-02.
- **One claim authority per item of work.** The pushed Task-branch claim of
  the decision record
  ["Claims are pushed on the task branch and read from every remote tip"](../../docs/adr/000O-claims-are-pushed-on-the-task-branch-and-read-from-every-remote-tip.md)
  is superseded for v4 only at a separately reviewed cutover that leaves
  exactly one active claim authority, counted per item of work, not per room.
- **A write floor.** Verified Issue write access is part of the minimum
  capability for any host that takes a Task; a host without it refuses claims
  and transitions. Visible error and pending state are required, and there is
  no atomic lock, custom scheduler or second queue.
- **Views are composed, never authority**
  (card ["GitHub Issue graph and composed coordination views" (DQC-000C)](../../landmark-tracker/destination-questions/DQC-000C.json), revision 7).
  GitHub Projects, the generated Taskboard and the generated Landmark Tracker
  are views. The Issue graph carries Spec and Task hierarchy, ungrouped Tasks
  and overlapping landmark and card membership as a graph, keeps native
  blocking links distinct from semantic relations, and never treats a concept
  Issue's closure as an assessment. Views keep six implementation lanes and
  the eight Tracker steps with true fractions and invent no percentages.
- **Room binding and fresh-host continuation**
  (card ["GitHub-backed room binding and fresh-host continuation" (DQC-000D)](../../landmark-tracker/destination-questions/DQC-000D.json), revision 12).
  A room binds to its coordination repository and artifact identities through
  supported access with credentials kept untracked. Setup and upgrade deliver
  the managed adapter and skills and are proved in a freshly installed room.
  A fresh host recovers packet, objective, scope, branch, exact commit, proof,
  gap and next action from the Issue and repository owners alone, without the
  originating chat.
- **Extended outage recovery is deferred**
  (card [DQC-000E "Extended GitHub outage recovery (deferred from v4)"](../../landmark-tracker/destination-questions/DQC-000E.json), revision 4).
  The owner deferred it off the v4 critical path. v4 still refuses
  unverifiable unsafe assignments or writes and shows visible error and
  pending state.

## Open and unresolved

None of these is a settled claim; each is recorded as open on its card.

- Whether the host can actually write to Issues is unverified. On 2026-10-01
  the cloud session could read Issues and pull requests, but the command-line
  token was invalid and no write was probed. Installed-room and cross-host
  proof (cloud and local hosts) has not been run.
- Migration of in-progress pushed Task-branch claims into Issue assignment is
  unplanned; the card says the migration mechanics are not confirmed.
- Whether GitHub Projects can be used through supported access is unverified,
  and whether v4 may ship with only the generated Taskboard and Tracker as its
  views if Projects cannot be used is an open owner decision. The home for
  direct or ungrouped Tasks awaits a Director disposition.
- Read-only manifest binding exists on a candidate commit; trusted access,
  artifact-to-Issue correspondence and cross-host capability remain open.
- Inference: because the cards group their capabilities provisionally, the
  split into seven capability Specs below may still move.

## Where the work lives

The destination is recorded in the proposed decision record
["GitHub Issues are the required live coordination authority"](../../docs/adr/proposed/000Q-github-issues-are-the-required-live-coordination-authority.md),
which stays proposed until the cutover lands. Seven capability Specs deliver
it: [Room Binding And Identity (S-003P)](../../specs/S-003P-github-coordination-room-binding-and-identity/SPEC.md),
[Issue Graph (S-003Q)](../../specs/S-003Q-github-coordination-issue-graph/SPEC.md),
[Trusted Assignments (S-003R)](../../specs/S-003R-github-coordination-trusted-assignments/SPEC.md),
[Operational Transitions (S-003S)](../../specs/S-003S-github-coordination-operational-transitions/SPEC.md),
[Shared Continuation (S-003T)](../../specs/S-003T-github-coordination-shared-continuation/SPEC.md),
[Setup And Upgrade (S-003U)](../../specs/S-003U-github-coordination-setup-and-upgrade/SPEC.md) and
[Claim Authority Cutover (S-003V)](../../specs/S-003V-github-coordination-claim-authority-cutover/SPEC.md).
The six-lane board reuses the [Generated JSON Taskboard Spec (S-01X)](../../specs/S-01X-generated-json-taskboard/SPEC.md).

## Evidence and Sources

- [Landmark record "GitHub Coordination" (LMK-000A)](../../landmark-tracker/landmarks/LMK-000A.json): title, summary, importance and history.
- The four question cards named above, each at the revision cited: they hold the answers, the confirmation basis, the open uncertainties and the named claims this page summarizes.
- [GitHub coordination](github-coordination.md): the owner-facing explanation of the destination.

## History

- 2026-10-04: created by the Wiki Evolving-Synthesis Migration (S-003W) Task TK-004 (landmark synthesis pages), seeded from the four cards' current answers.

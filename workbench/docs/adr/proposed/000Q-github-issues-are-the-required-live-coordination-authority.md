---
date: 2026-10-01
canonicalized_in:
  - AGENTS.md
  - LEXICON.md
  - BLUEPRINT.md
  - RUNBOOK.md
  - workbench/specs/S-00V-portable-workbench/SPEC.md
---

# GitHub Issues are the required live coordination authority

This record is **proposed**. It records an approved destination and the
conditions under which it takes effect; it does not take effect by being
written. Until the cutover described below is separately reviewed and lands on
integration, ADR-000O
(`workbench/docs/adr/000O-claims-are-pushed-on-the-task-branch-and-read-from-every-remote-tip.md`)
stays accepted, byte-identical and operative, and
`workbench/tools/claim-coordination.mjs` remains the only active claim
authority. The `canonicalized_in` list above names the owners intended to
carry the rule after acceptance; none of them carries it yet. Nothing in this
record claims that a GitHub command, adapter or trust flow already works.

## The owner's decision

The owner settled these choices; they are recorded here, not reopened:

1. **GitHub Issues is required live coordination for normal delivery**, not an
   optional mirror. Issues are the intended owner of live assignment, the
   active Worker, operational holds and the next hand-back, written through
   bounded trusted operations.
2. **ADR-000O is superseded for v4.** Its pushed Task-branch, remote-tip claim
   mechanism is replaced by Issue-backed claims at a reviewed cutover that
   leaves exactly one active claim authority.
3. **Directors resolve assignment races**, and the owner-designated
   coordinator Vespar breaks v4 ties.
4. **Extended GitHub outage recovery is deferred** off the v4 critical path.
   Basic visible error and pending state, refusal of unverifiable unsafe
   assignments or writes, and correct migration to one active claim authority
   remain required in v4.

No atomic lock, custom scheduler or second queue is introduced.

### Decided on 2026-10-02

The owner answered these in a later grilling session. They settle the trusted
actor, Projects and claim-granularity gaps this record listed as open:

5. **Trusted identity.** Trusted Issue operations are performed through the
   owner's own GitHub account. A role is assigned at the start of a chat and is
   not forced by the GitHub identity. The Captain or Director approves if they
   can; otherwise they mark it as needing human review and wait for the owner.
   A Worker that ignores its assignment and acts as a Director is something the
   Dispatcher and Director should notice.
6. **Verifiable decisions.** A Director's assignment-race resolution and the
   coordinator's v4 tie-break are structured Issue records. Prose, labels,
   assignee and bot messages never count.
7. **Which records count.** Only structured records authored by the room's
   configured GitHub account count; everything else on an Issue is
   information. In v4 that account is the owner's own. A room may name more
   accounts later, and no allowlist or team machinery is built now.
8. **Write floor.** Verified Issue write access is part of the minimum
   capability for any host that takes a Task. A host without it may read,
   recover and review, but refuses claims and transitions and does not fall
   back to branch claims.
9. **Claim granularity.** One active claim authority applies per item of work,
   not per room or per project. Tasks and Specs are worked in parallel, and an
   agent claims one item of work rather than the whole project.
10. **Projects.** GitHub Projects are optional presentation. v4 may ship with
    the generated Taskboard and Tracker as its only composed views. Issues stay
    required (decision 1).
11. **Audience.** In v4 the owner is the only person using the Workbench.
    Nothing is designed for other people or a team now; it only has to work.

## Ownership split

| Truth | Owner |
|---|---|
| Scope, requirements, acceptance and permission | The request, the Contract and the assigned Spec and Task |
| Live assignment, active Worker, operational holds, next hand-back | GitHub Issues, through bounded trusted operations |
| Candidate and review activity | Native pull requests and exact commits, interpreted through Workbench gates |
| Receipts, acceptance evidence, owner approval | Repository evidence owners |
| Evolving understanding, answers, assessment and membership | DQC and Landmark records |
| Consequential decisions | ADR owners |
| Composed views | The generated Taskboard and the generated Landmark Tracker; GitHub Projects where a room uses them |

Arbitrary Issue prose, an assignee or status alone, labels and bot messages
never enlarge authority, prove exclusivity, or manufacture independent review
or Human QA. Closing a concept Issue is not an assessment. Composed views keep
exactly six implementation lanes and the eight Tracker steps (Idea, Aligning,
Confirmed, Mapped, Planned, Journey, Review, Verified) with true fractions,
denominators, provenance and explicit missing or invalid states; they record
the coordination snapshot they read, its freshness and any conflict, and never
invent percentages. DQC and Landmark relationships stay a graph: a card may
belong to several Landmarks or none, and native GitHub blocking links stay
distinct from semantic relations.

## Representation, setup and continuation requirements

These requirements are part of the same owner-accepted direction. They bind
the capabilities that implement this decision; none is implemented yet.

- **Issue graph.** The Issue graph carries the Spec-Task hierarchy and also
  direct or ungrouped Tasks that have no parent Spec. Generated content (text
  a Workbench tool writes and regenerates) stays distinct from human-authored
  content, so regeneration never overwrites a person's edit and a person's
  edit is never mistaken for generated state.
- **Room binding.** A room binds to its GitHub coordination repository and to
  its artifact identities - including legacy Spec-qualified Task labels,
  aliases and the immutable source revision - through supported access only.
  Credentials stay untracked, consistent with the `AGENTS.md` Safety And
  Change Control rule against committing secrets or generated credentials.
  The binding and access mechanism is not yet planned.
- **Setup and upgrade.** Setup and upgrade deliver the managed GitHub adapter
  and the skills that use it as Workbench-managed artifacts, and are proved in
  a freshly installed room, not only in this source repository.
- **Continuation.** A fresh host recovers the packet, objective, scope,
  branch, exact SHA, proof, gap and next action from the Issue and repository
  owners alone, without the originating chat; this is proved across hosts
  (Claude cloud, Codex cloud and a local machine).
- **Project view.** GitHub Projects are optional presentation (decided
  2026-10-02); v4 may ship with the generated Taskboard and Tracker as its
  only composed views.

## Rationale retained from ADR-000O

ADR-000O's reasons still hold and constrain the successor:

- **No direct claim commits on integration.** Integration stays review-only;
  ten instances racing on one push and a stale claim needing a second direct
  commit were the reasons the owner rejected direct claims (PW-6).
- **A branch name alone carries no record and no agent.** The successor's
  claim must name the Task, the Worker and the source revision, not infer them.
- **Optimistic collision at the review gate throws away whole sessions.** The
  successor must refuse a contested assignment before work starts.
- **Failure is visible and whole.** A claim that cannot be verified is refused
  before anything is written, and nothing reports a claim that did not reach
  its authority.

What changes is where the live claim is held: in an Issue a Director can
arbitrate, instead of in Task-record state overlaid from every remote tip.

## Migration and effect conditions

This decision takes effect only through one separately reviewed cutover change
on integration that, together:

1. accepts this ADR by moving it out of `proposed/`, with `canonicalized_in`
   naming the owners that then actually carry the rule;
2. moves ADR-000O to `archive/` with `superseded_by` naming this record;
3. switches `next` and `claim` from remote-tip overlay to Issue-backed claim
   authority; and
4. accounts for every Task that is in-progress at a remote tip relative to
   integration at cutover: each becomes an Issue assignment for its holder, or
   is released with a recorded Director disposition. None is silently dropped
   or marked stale to make the switch.

Before the cutover may be reviewed:

- supported GitHub read and write capability for the trusted actor identities
  is proved in each environment that will claim work;
- refusal of an unverifiable assignment or write, and visible pending and
  error states, are demonstrated;
- a fresh host recovers the packet, objective, scope, branch, exact SHA,
  proof, gap and next action from the Issue and repository owners alone.

At no commit on integration are both mechanisms authoritative for the same
item of work; one active claim authority applies per item of work (decided
2026-10-02). Whether a room may carry both mechanisms for different items
during the transition is not settled here; the cutover Spec decides it. If
Issue authority cannot be verified after cutover, `claim` refuses rather than
silently falling back to branch claims. Reverting the reviewed cutover change
restores ADR-000O as the sole authority.

## Current implementation gaps

At integration `065a7ce4436e46ae6726985b567b6b94ed94660c`:

- No GitHub adapter, binding or Issue-backed claim runtime exists;
  `workbench/tools/claim-coordination.mjs` implements ADR-000O.
- `AGENTS.md:48` and the `LEXICON.md:230` no-governance-tax rule say no
  coordination system may be required, and `BLUEPRINT.md:330` and `:334` (Non-Goals)
  exclude required network access for ordinary local work and a hosted
  tracker. Reconciling them is shared-control work owned by
  [S-00P](../../../specs/S-00P-workflow-canon-rework/SPEC.md) or a lane the
  Director releases; this record does not change them.
- [S-00V](../../../specs/S-00V-portable-workbench/SPEC.md) TK-01M, TK-01N and
  TK-01P build on remote-tip claims and need re-disposition once this record
  is accepted.
- The repository had no Issues on 2026-10-01. In the Claude cloud Workbench
  environment that day, GitHub connector reads of Issues and pull requests
  succeeded, the `gh` CLI token was invalid, and GitHub write and Projects
  capability were not verified.
- Trusted actor policy is decided (decisions 5 to 7 above), but no
  adapter, structured-record format or validation exists. The GitHub
  Coordination Trusted Assignments Spec (S-003R) defines the record's fields
  and validation.
- The home for direct or ungrouped Tasks awaits the Director disposition in
  the [S-00O](../../../specs/S-00O-workbench-v4-0-0-release/SPEC.md) assigned
  capability map.

Extended outage recovery has no v4 owner by decision; its reachable
destination is the Landmark Tracker card DQC-000E until a post-v4 capability
owns it.

Considered and rejected: keeping ADR-000O's remote-tip claims as the live
authority with Issues as an optional mirror - the owner made Issues required,
and two live authorities would let a mirror disagree with the claim it
reflects. Switching authority before migration and capability proof - it
would strand in-progress branch claims or accept unverifiable writes.

Consequences: claim and selection tools, the Taskboard and Tracker views, the
Git Rules and claim procedure in `AGENTS.md` and `RUNBOOK.md`, the Lexicon's
coordination terms, the Blueprint's Non-Goals, S-00V's remaining claim Tasks,
and room setup and upgrade all change at or after cutover, each through its
own owner. Capability planning follows in later, separately assigned Specs.

Provenance: owner direction recorded in two untracked handoffs dated
2026-09-30 (written against `2780fe66754abf69b2ab6dea23337a7be0f6d801`) and
relayed as settled in the 2026-10-01 coordinating assignment; the owner
approved superseding ADR-000O. The owner settled the trusted actor, Projects
and claim-granularity gaps in a grilling session on 2026-10-02. Concept lineage: Landmark LMK-000A (GitHub
Coordination) and DQC-000B, DQC-000C, DQC-000D and DQC-000E in
`workbench/landmark-tracker/`.

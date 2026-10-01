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

## Ownership split

| Truth | Owner |
|---|---|
| Scope, requirements, acceptance and permission | The request, the Contract and the assigned Spec and Task |
| Live assignment, active Worker, operational holds, next hand-back | GitHub Issues, through bounded trusted operations |
| Candidate and review activity | Native pull requests and exact commits, interpreted through Workbench gates |
| Receipts, acceptance evidence, owner approval | Repository evidence owners |
| Evolving understanding, answers, assessment and membership | DQC and Landmark records |
| Consequential decisions | ADR owners |
| Composed views | GitHub Projects, the generated Taskboard and the generated Landmark Tracker |

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

At no commit on integration are both mechanisms authoritative. If Issue
authority cannot be verified after cutover, `claim` refuses rather than
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
- The trusted actor identities for Issue operations, and how Director and
  Vespar decisions are attributed verifiably, are not settled.
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
approved superseding ADR-000O. Concept lineage: Landmark LMK-000A (GitHub
Coordination) and DQC-000B, DQC-000C, DQC-000D and DQC-000E in
`workbench/landmark-tracker/`.

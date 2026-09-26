# TK-004 - Rewrite `LEXICON.md` and reconcile ADR-000F, ADR-000G and ADR-000I

**Task ID:** TK-004
**Spec ID:** S-00P
**Slice:** Rewrite `LEXICON.md` and reconcile ADR-000F, ADR-000G and ADR-000I
**Status:** blocked
**Blockers:** TK-002
**Destination:** spec-acceptance: S-00P Acceptance Criteria
**Planned verification:** Red: semantic assertions against Lexicon definitions and the resolved active ADR decision/owner chain fail for the named contradiction or missing definition; green: released ADR dispositions match confirmed source claims, literal owner/Context Map links resolve, register/history match their sources, and targeted tests pass. Lifecycle status alone is not proof.
**Stance:** Builder

## Objective And Acceptance Contribution

Make the language and decision routes reconstruct the confirmed workflow without
promoting unresolved interview material. Advance S-00P's unchecked acceptance
for consistent Task-record workflow controls and for disposition of ADR-000F,
ADR-000G and ADR-000I with a regenerated register and no contradictory active
decision. Define Align, design concept, Spec as a scoped objective with its own
destination, Task as reaching or repairing a destination, retired/archive,
assembled-Spec review and Human QA. Reconcile Packet's corrective Wiki case
through the accepted ADR-000H preservation rule, rather than silently editing
its accepted body.

This is an executable planning packet, not a claim, implementation receipt,
ADR acceptance, or permission to bypass TK-002. Status and blocker enforcement
remain unchanged. The September 26 reconciliation in the owning Spec takes
precedence over its historical per-Task approval and closure descriptions.

## Entry Packet And Source Lineage

Read the Contract through `AGENTS.md` -> `RUNBOOK.md` Ordinary Entry ->
`LEXICON.md` Task Routing, then [S-00P](../../SPEC.md), especially September 26
Delivery Reconciliation, Decisions And Contracts, Acceptance Criteria and
Testing Seams. Resolve the Spec and ADR collection through
`workbench/manifest.json`; do not copy the full Spec into this packet.

The authoring baseline is `89d4042fb8931b9d720af75bffea1c28803d72aa`.
Read source snapshots with `git show <sha>:<path>` and identify the later released
execution SHA before implementing. The September 26 reconciliation was read
from the Dispatcher's working Spec while authoring; obtain its committed SHA
before treating that later text as a cold-start input. Optional recovery notes
supply lineage only; the Task must remain executable from committed owners.

Required decision sources:

- `workbench/docs/adr/proposed/000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md`: assembled-Spec boundary, Human QA and unresolved failure return language.
- `workbench/docs/adr/proposed/000G-blueprint-spec-and-task-are-three-altitudes-of-one-delivery-chain.md`: Blueprint/Spec altitude conflict, sequence and September 24 correction.
- `workbench/docs/adr/proposed/000I-record-lifecycle-is-expressed-by-folder-location-with-permanent-archive-and-transient-retired.md`: opposite retention rules, historical stable-path and held deletion claims.
- `workbench/docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md`: required Packet members and preservation of accepted body.
- `workbench/docs/adr/000A-active-adr-decisions-and-destination-blueprints.md` and `workbench/docs/adr/0037-independent-review-at-integration.md`: whole-record succession, reachable history, operational ownership and existing pre-integration review gate.
- `workbench/tools/adr.mjs`, `tools/test-adr.mjs` and `tools/test-wiki.mjs`: effective lifecycle, validation, literal links, register/history generation and existing Lexicon checks.

The pending SCR candidate `e318f144247d4288d2364f8103c78069d64aa919`
is comparison evidence, not an integrated or approved source. Preserve exact
source arrows, braces, indentation, nesting and loops wherever quoted; label
prose interpretation separately. Unconfirmed correction-024 remains provisional.
Do not normalize a diagram or treat a flattened prose summary as exact recovery.

## Decision And Release Gates

1. TK-002 must satisfy its enforced blockers before this Task can be claimed.
   The Director must also release the exact shared Lexicon, ADR, test and
   projection paths against an immutable base. The proposed reviewed-delivery
   prerequisite repair belongs to S-00J/S-00I and their owners; this Task chooses
   no new schema, CLI, blocker representation or completion rule.
2. Obtain a source-backed disposition for each unresolved ADR claim before
   changing its lifecycle. Map each claim to the confirmed answer, correction,
   operational owner and intended result. Where confirmation or ordering is
   missing, return that specific gate to the Dispatcher; retain the proposal.
   S-00P's desired removal of `proposed` does not itself accept new decisions.
3. Use the current roles: Worker self-checks and reports; Dispatcher performs
   whole-Spec QA; a separate Director reviews the immutable assembled-Spec
   candidate before integration. Roles are responsibilities, not branch names.
   Do not reinstate an independent approval ceremony for each Task, or replace
   AGENTS' pre-integration gate with a post-integration Director check for a
   direct Blueprint Task. The recovered direct-Task role chain remains accepted
   direction; reconciliation of its destination route with the operative
   pre-integration gate remains open, without reopening the owner answer.
4. Human QA occurs when the owner chooses a useful milestone, accumulated work,
   exhaustion of Specs, a valued Spec or an important Director escalation.
   Version completion is not its sole trigger; observation is not approval.
   Preserve failed/open findings and owner-only main promotion. Reconcile S-00J's
   [closure-capture transition contract](../../../S-00J-spec-qa-gate-at-integration/SPEC.md)
   (main verification before `complete`, features Wiki capture after `complete`
   and before transient cleanup) with S-00I/S-00J's actually delivered
   commands. Describe any implementation gap; do not state it as delivered.
5. ADR-000H is accepted history. Any corrective Packet change requires the
   released amendment/successor method consistent with ADR-000A's whole-record
   succession and preserved body. The Director resolves any successor identity
   and exact path before authoring; this packet allocates no ADR or Task IDs.

## Intended File Lane After Release

Current authorization changes only this `TASK.md`. Future execution may touch
only the released subset of these existing paths:

- `LEXICON.md`: Core Terms, artifact boundaries and existing Context Map routes;
  remove a gap disclaimer only where verified delivery made it false.
- The three exact proposed ADR paths listed above: reconcile confirmed decision
  claims and their source lineage using the released disposition method.
- `workbench/docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md`: read-only accepted body unless the released preservation method permits lifecycle metadata/link maintenance; change its decision through a released successor, not body replacement.
- `tools/test-adr.mjs`: released semantic/ADR-link assertions and justified corpus
  accounting updates. It is shared with composition work; coordinate one writer.
- `tools/test-wiki.mjs`: only if released for Lexicon Context Map/link assertions
  at its existing control-link seam; no new test file is pre-authorized.
- `workbench/docs/adr/REGISTER.md` and `workbench/docs/adr/HISTORY.md`: generated
  outputs owned by the Director/shared writer, never hand-edited by this Worker.

If acceptance moves a proposal, the exact existing basename moves from
`workbench/docs/adr/proposed/` to `workbench/docs/adr/`. If succession archives
an existing record, its exact basename moves into `workbench/docs/adr/archive/`.
Before any move, the Director releases its source/destination pair, successor
path if needed, and the inventory of live incoming/outgoing links requiring
rewrite. Those dependent paths are not automatically in this lane. Preserve
historical/append-only references with their tree anchors and counted evidence.
Do not improvise a move command: inspect the actual ADR runtime/procedure and
use its supported operation; never use Spec/Task lifecycle commands for ADRs.

Excluded: `SPEC.md`, AGENTS/RUNBOOK/BLUEPRINT/README, templates, skills, runtime,
manifest, Wiki content/routers, Taskboard, IDs and other Tasks. Return proof and
any required cross-owner changes to the Dispatcher/Director. TK-005 owns the
generic mirror; this Task supplies its exact changed claims and paths.

## Implementation And Red/Green Plan

1. Pin the released clean base and build a claim/source/owner matrix: confirmed
   meaning, verified implementation, proposal and history. Inventory links and
   generated corpus counts before changing decisions.
2. Extend `tools/test-adr.mjs` at its product-corpus seam using `listAdrs`,
   effective `record.status`, resolved successor chains and `validateAdrs`.
   Assert confirmed decision content and named operational owners for released
   F/G/I dispositions and the corrective Packet contract when released. Check
   Lexicon definitions at the existing control seam. A move/status change alone
   must not turn these checks green.
3. Confirm expected red on the unchanged execution base for a real missing
   definition or contradictory claim; the old Spec pre-anchor may no longer be
   red. Retain exact output. Negative fixtures/mutations retaining lifecycle
   status must reject incorrect Blueprint PRD altitude, collapsed review roles,
   version-only Human QA and missing literal owner/Context Map targets.
4. Implement confirmed changes, rerun the same assertions green, and compare any
   quoted diagram block exactly, separately from prose meaning. Prove a brace,
   arrow or nesting mutation fails; brace removal that still passes is inadequate.
5. Director/shared writer regenerates via `node workbench/tools/adr.mjs register`.
   Run `node workbench/tools/adr.mjs validate --json`, `node tools/test-adr.mjs`
   and `node tools/test-wiki.mjs`. Resolve touched relative links and heading
   targets literally; identity fallback/file existence alone is insufficient.
6. Re-count accepted-ADR-to-Spec and intra-ADR edges, coordinate existing pinned
   counts with the composition writer and retain complete literal edge checks.
   Do not weaken counts/checks for green. Return proof to the Dispatcher for
   whole-Spec/full-suite/self-drift verification and pre-integration Director
   review. This authoring run claims no implementation or full-suite result.

## Done And Closing Proof

Implementation is done only when released Lexicon definitions and active ADR
chains agree with confirmed sources; each named operational owner actually
carries the rule; proposed/unresolved claims have not been silently accepted;
accepted bodies/history are preserved; touched literal links and anchors resolve;
and regenerated views match their source records. Supply an exact before/after
SHA, changed-path list, targeted expected-red and green commands/results,
negative-case evidence, disposition/authority matrix and remaining gap.

Worker reports this Task's proof to the Dispatcher without claiming whole-Spec
acceptance or owner Human QA. Shared Spec/projection state is maintained by its
single writer. If an unresolved disposition prevents the acceptance outcome,
report the blocked claim and stop with this Task still incomplete.

## Risks And Limits

Status-only tests can manufacture apparent acceptance. Historical source text
can restore superseded roles or closure order. Unreleased ADR moves can break
live links, and corpus-count edits can collide with composition work. Prevent
these through claim-level confirmation, released paths, literal-link checks,
immutable proof and preserved historical bodies. Parsing, validation, source
review and green tests do not establish owner approval, Human QA success or
agent-outcome improvement.

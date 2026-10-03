---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-confirmed Landmark Tracker grilling and explicit documentation direction, 2026-09-26
source_paths:
  - workbench/specs/S-004D-shared-interactive-board/SPEC.md
  - BLUEPRINT.md
  - LEXICON.md
  - AGENTS.md
  - RUNBOOK.md
  - workbench/landmark-tracker/README.md
parent: none
authorized_by: owner
last_verified: 2026-10-03
---

# Landmark Tracker

The Landmark Tracker connects the understanding we develop while exploring a
project to the durable knowledge that explains it. The owner and agents need to
see what they understand, what remains uncertain, what changed, and whether that
understanding has reached its intended documentation destination.

This article explains the accepted design. The runtime now captures, revises
and links DQCs and landmarks, counts their related grilling questions, Specs,
ADRs, Tasks and DQCs, and rebuilds the generated view with inspectable
distributions at card, landmark and Workbench scope; its procedure lives beside
the records in the [Tracker README](../../landmark-tracker/README.md).
Landmark Wiki content assessment and record-move recovery are still being
delivered. The [Runbook](../../../RUNBOOK.md#landmark-tracker-accepted-design-and-available-operations)
routes to delivery and states the available-operation boundary.

## Four pieces with distinct jobs

**Destination Question Cards (DQCs)** synthesize related grilling questions
into a growing concept. They preserve answers and uncertainty, reasons,
corrections, expected results, affected relationships and alignment assessments
with their evidence. A raw interview question is a source, not automatically a
card. A meaningful title says what understanding the card brings together.

**Landmarks** are evolving accounts of features or framework pillars we are
exploring or building toward, and their importance to the Workbench. A landmark
can begin before any specification and remain useful after several delivery
efforts finish. Landmarks can overlap. They are not themselves implemented:
Specs and Tasks deliver bounded work connected to them.

That description is the landmark as it was first built. On 2026-10-02 the owner
accepted a change ([the decision record "Landmarks are LANDMARK.md artifacts one size above Specs"](../../docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md)): a landmark becomes a `LANDMARK.md` artifact, a Spec
with a much larger scope that says where the work goes and what success looks
like. Landmarks and Specs become the map at two scales and Tasks the steps. A
landmark forms when groupings appear in the question cards and destination
decisions, parents its Specs, and retires into its Landmark Wiki page once
reached. Landmarks no longer overlap through shared children: a Spec has at
most one. The current JSON landmark records turn into question cards, because
they were a way of nesting cards. None of this is installed yet; until the
landmark Spec lands, the Tracker keeps grouping by the JSON records.

**Tracker** generates the compact view of those records and their relationships.
It monitors the documenting process; Taskboard monitors implementation. Existing
artifacts and the grilling ledger retain their jobs. Workflow activity changes
source records with reasons and evidence; the view reflects those changes.
There is no manually assigned overall card stage or card-reset lifecycle.

**Landmark Wiki pages** are each landmark's evolving synthesis in readable
Markdown: what its question cards add up to, updated whenever a card changes.
Under the accepted change, a page's raw source is its landmark's `LANDMARK.md`;
the page describes the landmark as it currently is without being the same
document.
Several Specs can contribute to one page. Identifiers on a page carry the
artifact's name and context, as on every Wiki page; structured records and
delivery evidence keep identity-bearing provenance, and readable source routes
keep the explanation connected to its governing owners.

The [Lexicon family reconciliation](../../specs/S-01U-lexicon-design-concept-reconciliation/recovery-2026-10-03.md)
keeps these accepted changes separate from installed behavior: the article
validator still rejects identifiers and the view still prints its earlier
stage labels. Neither validator success, a Result field nor a completed Task
by itself establishes that the knowledge is Verified. DQCs are temporary
scaffolding; removing them requires verified reconciliation of useful
understanding, corrections, rationale and lineage into durable owners while
preserving unresolved obligations and live references.

## Understanding before delivery

DQCs and landmark records keep the structured account; the Wiki summarizes
them as they evolve, so a synthesis page can exist before any Spec or Task. Grilling notepads remain valuable as more historical and
handoff-like context: they preserve how the understanding arose, the corrections
that matter, and what another conversation needs to continue. They are retained
while needed, not automatically discarded when a card is created.

An unanswered DQC needs neither a fabricated answer nor a predetermined durable
destination. Once answered, its **Expected result** explains the intended change
or knowledge to become durable, naming the home when known. **Result** records
what delivery achieved. Delivery planning usually makes the exact home concrete.

A DQC can appear with **no landmark**. As the understanding develops, it can
connect to an existing landmark or reveal a new one. This growth preserves its
origins; it does not require a destructive conversion of the source record.

```text
Grilling questions -> Destination Question Cards -> Landmarks when consequential enough
```

This is growth of understanding, not a requirement that every question reach
every level. The Blueprint is a short summary of direction, and a Blueprint
sentence big enough to need its own map becomes a landmark. There
is no fixed inventory size or numerical threshold that must be settled first.

## Reading documentation progress

The ordered steps are **Idea, Aligning, Confirmed, Mapped, Planned, Journey,
Review, Verified**. They concern understanding reaching its documented
destination. Completing a Task or creating a Wiki file alone cannot establish
that the knowledge is correct and durable.

The owner has since confirmed the workflow verbs Idea, Align, Confirm, Map, Plan,
Implement, Review and Verify as the official names for these steps, with Journey
only the loop-level name and not a stage (see [The Workflow Verbs](workflow-verbs.md)).
The Tracker still prints the earlier names above until the Tracker work changes them.

Each distinct related item contributes one unit total in the first version.
An item with mixed progress splits its unit across the relevant steps. For each
step, sum those contributions and divide by the number of distinct items.
A question at sixty percent Journey and forty percent Review, combined with
one Verified item, produces thirty percent Journey, twenty percent Review and
fifty percent Verified. The mixed question remains one item.

A shared Task can be visible beneath several questions and still count once in
a shared landmark aggregate. The same calculation applies to the Workbench-wide
view. This is a distribution of documented item states, not effort or a promise
of remaining delivery time. The identities and assessment evidence behind it
must be inspectable; missing evidence stays visible instead of becoming an
invented progress value.

When understanding changes, the records preserve what changed and why. Agents
compare relevant durable claims with that understanding and record supported
reconciliation needs. A link is a reason to investigate, not proof that every
related document is wrong. Earlier proof remains interpretable at its revision.

## How it participates in the workflow

Workflow activity maintains the source records during alignment, planning,
building and review. The primitive grilling behavior remains focused on the
interview; workflow composition handles Tracker maintenance. Wiki creation and
updates are ordinary authorized delivery, with no separate publishing ceremony.
Feature explanations and cross-cutting design models keep their respective
knowledge jobs.

A confirmed answer settles understanding within its scope. It does not itself
authorize implementation, promotion or another assignment. The existing
[authority rules](../../../AGENTS.md#authority-order) and
[ownership map](../../../LEXICON.md#artifact-ownership-schema) still govern.
Live navigation follows current records; historical proof identifies the
version that was checked. The [recovery procedures](../../../RUNBOOK.md) govern
retirement and recovery, including the distinction between tracked records and
ignored local notes.

## An evolving starting map

The owner endorsed these candidate directions as a starting inventory. Their
names and boundaries can develop, and more landmarks can emerge from DQCs.
This is a map of concepts, not a claim that each capability is delivered.

| Landmark | What we are building toward |
|---|---|
| **Portable Workbench** | A fresh agent can clone a room, find what it needs, complete authorized work and leave a recoverable result. |
| **Workbench Workflow** | A coherent journey from idea and shared understanding through delivery, review, correction and release. |
| **Grilling and Shared Understanding** | Exploration produces an explicitly shared concept, preserving reasons, corrections and unresolved questions. |
| **Landmark Tracker** | DQCs and landmarks maintain evolving understanding; Tracker exposes documentation progress and relationships. |
| **Taskboard** | The owner and agents can see implementation work, dependencies, readiness, blockers and review needs. |
| **Ownership Model** | Every kind of truth has an identifiable owner, with information ownership distinct from authority to act. |
| **Artifact Types** | Each record has a clear job, relationships and lifecycle, including reconciliation and recoverable retirement. |
| **Durable Knowledge** | Useful understanding survives completed delivery and the retirement of temporary working records. |
| **Wiki** | People and agents can read coherent, current explanations of the project and follow their sources. |
| **Context Map** | An agent can reach the smallest relevant owner by following maintained routes. |
| **Agent Autonomy** | Agents finish authorized work and resolve available facts without requiring repeated owner coordination. |
| **Agent Stances** | Builder, Auditor, Reviewer and Reconciler provide distinct methods without changing authority. |
| **Skills** | Reusable behaviors compose into the workflow and are discoverable and usable inside each room. |
| **Notepads** | Working sessions preserve useful reasoning and corrections; grilling notes increasingly support history and handoff as DQCs and landmarks maintain current understanding. |
| **Handoffs** | A receiving agent can continue one objective from readable context, boundaries, evidence and a concrete next action. |
| **Session Transport** | Selected private working context can move between environments without losing changes or imposing transport on local work. |
| **Verification** | Evidence demonstrates the intended result at the right scope and preserves the distinction between checks, review and owner QA. |
| **Workbench Template** | The reference room proves that the Workbench can be installed, used and upgraded outside its source repository. |
| **Harness Feedback Review** | Observed friction becomes investigated findings and supported improvements, with outcomes distinguished from static scores. |
| **Workbench Boundaries** | The Workbench has clear authority and product limits, including what remains optional or outside its purpose. |
| **Genesis and Adoption** | New and existing projects enter a coherent Workbench while preserving project truth. |
| **Workbench Updates** | Rooms receive improvements while preserving local choices and detecting target-room and upstream self-drift. |
| **Workbench and Project Relationships** | The room/project relationship and desired nesting are understandable, with ownership and shared context made explicit. |

Delivery and release initially remain part of Workbench Workflow; a particular
version's rollout belongs to delivery history. The foundation does not depend
on finishing this map.

For example, **Keeping evolving understanding and durable explanations
connected** can relate to Landmark Tracker, Durable Knowledge and Wiki.
**Keeping understanding available before delivery begins** can relate to
Landmark Tracker, Grilling and Shared Understanding, and Notepads.
**Measuring documentation progress across related work** can relate to Landmark
Tracker and Verification. These illustrate meaningful DQC titles and overlapping
relationships; they do not allocate records or freeze groupings.

## First useful delivery

The agreed initial path is small and complete: capture an ungrouped DQC with its
source lineage, connect it to a landmark when one emerges, and generate a view
of its evidence-backed documentation progress. That demonstrates a foundation
we can build on while answers, inventory and detailed destinations evolve.

## Future shared browser workspace

The owner requested a post-v4 backlog capability for browsing Taskboard and
Tracker together, opening connected cards, commenting and requesting updates.
The [Shared Interactive Workbench Board (S-004D)](../../specs/S-004D-shared-interactive-board/SPEC.md)
owns that future scope and its unresolved design choices. It is planned only,
excluded from v4, and supplies no current browser capability. A shared card
interface preserves the separate meanings of execution lanes and understanding
distributions; updates reach their source owners and generated views are rebuilt.

## Evidence and Sources

- [Product direction](../../../BLUEPRINT.md)
- [Definitions and information ownership](../../../LEXICON.md)
- [Agent authority and continuity](../../../AGENTS.md)
- [Available operations and delivery route](../../../RUNBOOK.md#landmark-tracker-accepted-design-and-available-operations)
- [Tracker record procedure](../../landmark-tracker/README.md)
- [Decision record: "Landmarks are LANDMARK.md artifacts one size above Specs"](../../docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md): the accepted change to the landmark record

## History

- 2026-09-26: Created on explicit owner direction after confirmation of the
  four-piece model, documentation progress, corrected grilling-notepad role,
  evolving landmark inventory and foundation-first delivery path. This is the
  accepted design explanation; runtime implementation remains future delivery.
- 2026-09-26: The foundation runtime landed (capture, revise, link, rebuild,
  show); the availability sentence now routes to the Tracker README, and the
  remaining delivery is named without claiming it.
- 2026-09-26: Distributions across source types and scopes landed; the
  availability sentence now names them and leaves Landmark Wiki content
  assessment and record-move recovery as the remaining delivery.
- 2026-10-01: Landmark Wiki pages restated as evolving synthesis with the name-and-context identifier rule, from the owner-confirmed Wiki definition (the decision record "The Wiki is the evolving synthesis every agent reads and updates").
- 2026-10-02: Added the accepted change that turns landmarks into `LANDMARK.md` artifacts one size above Specs and their JSON records into question cards, from the owner-confirmed grilling of 2026-10-02.
- 2026-10-02: Noted the owner-confirmed workflow verbs as the official step names, with the Tracker's own labels still to change, from the owner-confirmed grilling of 2026-10-02.

- 2026-10-02: Linked the owner-requested post-v4 shared browser backlog; no browser capability or v4 obligation is introduced.

- 2026-10-03: Restated how a landmark relates to the Blueprint (a Blueprint sentence big enough to need its own map becomes a landmark) and repointed the product-direction link to the four-part page, from the Blueprint Short Page work.
- 2026-10-03: Reconciled the recovered Lexicon family with the later Wiki, landmark and workflow decisions; retained the installed-validator mismatch, verification distinctions and DQC reconciliation boundary.

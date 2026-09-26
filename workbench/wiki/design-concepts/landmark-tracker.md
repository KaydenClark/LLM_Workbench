---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-confirmed Landmark Tracker grilling and explicit documentation direction, 2026-09-26
source_paths:
  - BLUEPRINT.md
  - LEXICON.md
  - AGENTS.md
  - RUNBOOK.md
parent: none
authorized_by: owner
last_verified: 2026-09-26
---

# Landmark Tracker

The Landmark Tracker connects the understanding we develop while exploring a
project to the durable knowledge that explains it. The owner and agents need to
see what they understand, what remains uncertain, what changed, and whether that
understanding has reached its intended documentation destination.

This article explains the accepted design. The current installed tools do not
yet provide Tracker record operations or projection. The [Runbook](../../../RUNBOOK.md#landmark-tracker-accepted-design-and-available-operations)
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

**Tracker** generates the compact view of those records and their relationships.
It monitors the documenting process; Taskboard monitors implementation. Existing
artifacts and the grilling ledger retain their jobs. Workflow activity changes
source records with reasons and evidence; the view reflects those changes.
There is no manually assigned overall card stage or card-reset lifecycle.

**Landmark Wiki pages** explain confirmed durable understanding coherently in
readable Markdown. Several Specs can contribute to one explanation. These pages
contain no Workbench identifiers, including metadata and link targets. Structured
records and delivery evidence preserve identity-bearing provenance; readable
source routes keep the explanation connected to its governing owners.

## Understanding before delivery

DQCs and landmark records maintain the current account before a Spec, Task or
Wiki article exists. Grilling notepads remain valuable as more historical and
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
every level. Importance to the core path earns a place in the Blueprint. There
is no fixed inventory size or numerical threshold that must be settled first.

## Reading documentation progress

The ordered steps are **Idea, Aligning, Confirmed, Mapped, Planned, Journey,
Review, Verified**. They concern understanding reaching its documented
destination. Completing a Task or creating a Wiki file alone cannot establish
that the knowledge is correct and durable.

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

## Evidence and Sources

- [Product direction](../../../BLUEPRINT.md#integrated-system-design)
- [Definitions and information ownership](../../../LEXICON.md)
- [Agent authority and continuity](../../../AGENTS.md)
- [Available operations and delivery route](../../../RUNBOOK.md#landmark-tracker-accepted-design-and-available-operations)

## History

- 2026-09-26: Created on explicit owner direction after confirmation of the
  four-piece model, documentation progress, corrected grilling-notepad role,
  evolving landmark inventory and foundation-first delivery path. This is the
  accepted design explanation; runtime implementation remains future delivery.

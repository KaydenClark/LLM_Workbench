---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - LLM Workbench template wiki: the glossary's Governance core grouping explained
source_paths:
  - GLOSSARY.md
last_verified: [YYYY-MM-DD]
---

# Governance core: the vocabulary explained

These words are shared by every Workbench: the role a claim plays in an operation, what binds an agent, how a disagreement between a rule and the running system resolves, and the lanes, collections and records the Workbench keeps.

The [glossary](../../GLOSSARY.md#governance-core) owns each definition; this article explains how each word differs from its neighbours. It authorizes nothing.

## Governance Plane

Planes classify claims and their use, never whole files, directories, or artifact types. One assigned spec carries Canon, Projection, Grounding, and Enduring Context claims at once.

Definition: [GLOSSARY.md, Governance core](../../GLOSSARY.md#governance-core).

## Workbench Contract

It is not a file; other root files are routed by intent, and no `CONTRACT.md` or other coequal root file exists.

Definition: [GLOSSARY.md, Governance core](../../GLOSSARY.md#governance-core).

## Instruction authority

An assigned spec cannot enlarge the request, platform safety, or `AGENTS.md` scope; an unassigned spec is evidence.

Definition: [GLOSSARY.md, Governance core](../../GLOSSARY.md#governance-core).

## State resolution

Neither "code always wins" nor "Canon proves implementation"; the touched owner is repaired rather than a universal precedence applied.

Definition: [GLOSSARY.md, Governance core](../../GLOSSARY.md#governance-core).

## No-governance-tax rule

Available mechanisms a change genuinely needs still apply; the line is availability, not ceremony.

Definition: [GLOSSARY.md, Governance core](../../GLOSSARY.md#governance-core).

## Diagnostic

The consuming command enforces the effect; no artifact chooses whether its own finding blocks.

Definition: [GLOSSARY.md, Governance core](../../GLOSSARY.md#governance-core).

## Support lane

A lane is a structural slot, not a plane.

Definition: [GLOSSARY.md, Governance core](../../GLOSSARY.md#governance-core).

## Skills lane

A skill this room adds under another name is room-owned and never replaced by the update; a personal skills catalog is never on this room's critical path.

Definition: [GLOSSARY.md, Governance core](../../GLOSSARY.md#governance-core).

## Collection

Collection names are lowercase; local notepads may use nested type folders; a collection is never promoted to a lane because its contents differ in kind.

Definition: [GLOSSARY.md, Governance core](../../GLOSSARY.md#governance-core).

## ADR

Active accepted ADR decision claims are architectural Canon; rationale and history remain distinct; `canonicalized_in` names operational owners.

Definition: [GLOSSARY.md, Governance core](../../GLOSSARY.md#governance-core).

## Decision Record

Both are atomic, superseded whole and managed alike by one tool, `adr.mjs`, which creates, validates, registers, accepts, supersedes, deprecates and reads both. The test that chooses between them: would the choice still hold if the architecture were rebuilt differently? Yes is a DDR. One decision that needs both records links them rather than merging them.

Definition: [GLOSSARY.md, Governance core](../../GLOSSARY.md#governance-core).

## DDR

An active accepted DDR owns destination Canon beside the ADR; it serves a destination goal rather than an architecture choice. Lifecycle is its folder, as for an ADR: `proposed/`, the accepted top level, and the permanent `archive/`. `adr.mjs new --kind ddr` writes the next one into `proposed/`. A DDR that changes or contradicts the Blueprint names `BLUEPRINT.md` in `canonicalized_in`, which never names the Wiki; the Wiki cites it and keeps no page per DDR. It is not a Blueprint paragraph.

Definition: [GLOSSARY.md, Governance core](../../GLOSSARY.md#governance-core).

## Read words

Create, Read, Update and Delete remain the frame; what kind of each a tool needs differs. `capture` is Create, not a read. The decision-record tool answers all five for ADRs and DDRs; other tools gain them as they are revised, and existing command names keep working.

Definition: [GLOSSARY.md, Governance core](../../GLOSSARY.md#governance-core).

## Checkpoint

Preserve existing bytes and citations. New claims reconcile into their durable owners; operational recovery is separate.

Definition: [GLOSSARY.md, Governance core](../../GLOSSARY.md#governance-core).

## Operational recovery

Excluded from notepad discovery and durable provenance; existing historical recovery references remain valid.

Definition: [GLOSSARY.md, Governance core](../../GLOSSARY.md#governance-core).

## Design Concept article

It documents a design concept; it is not the Blueprint, an ADR, a procedure, or task state. Any agent creates or updates it in an authorized operation whose work touched it; the collection itself remains required.

Definition: [GLOSSARY.md, Governance core](../../GLOSSARY.md#governance-core).

## Wiki profile

A profile declares routing shape; it grants no authority and copies no live task state.

Definition: [GLOSSARY.md, Governance core](../../GLOSSARY.md#governance-core).

## Managed runtime tool

It is updated only by explicit update with backup and rollback; an application's root `tools/` is application-owned.

Definition: [GLOSSARY.md, Governance core](../../GLOSSARY.md#governance-core).

## Declared integration branch

A declaration, not a prose convention: tools and root files resolve it from the manifest, `doctor` reports it undeclared or missing without blocking selection, and only generation, adoption, and upgrade completion fail closed on it.

Definition: [GLOSSARY.md, Governance core](../../GLOSSARY.md#governance-core).

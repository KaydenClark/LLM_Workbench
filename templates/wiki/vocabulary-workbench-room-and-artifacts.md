---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - LLM Workbench template wiki: the glossary's Workbench, room and artifacts grouping explained
source_paths:
  - GLOSSARY.md
last_verified: [YYYY-MM-DD]
---

# Workbench, room and artifacts: the vocabulary explained

These words name the Workbench itself, the project it serves and the kinds of artifact an agent meets: the one loaded every turn, the ones reached by pointer, and the scaffolding cleared away once its knowledge is kept.

The [glossary](../../GLOSSARY.md#workbench-room-and-artifacts) owns each definition; this article explains how each word differs from its neighbours. It authorizes nothing.

## Context Map

Existing owners hold the information; any rendered map is a source-derived Projection, not another truth store or authority. No graph service or Obsidian dependency is required.

Definition: [GLOSSARY.md, Workbench, room and artifacts](../../GLOSSARY.md#workbench-room-and-artifacts).

## Workbench

Not a harness: Claude Code and Codex are the harnesses that load it. It governs the workflow; it is not the product being built. Nesting is the destination; tooling for a Workbench that holds other Workbenches is not built yet. A Workbench relates to Workbenches one-to-many and to Projects one-to-many; a Project relates to its own Workbench one-to-one.

Definition: [GLOSSARY.md, Workbench, room and artifacts](../../GLOSSARY.md#workbench-room-and-artifacts).

## Project

Every Project has exactly one Workbench of its own. The Project is the work; the Workbench is the management system around it. Room names the same project seen as the place its work happens.

Definition: [GLOSSARY.md, Workbench, room and artifacts](../../GLOSSARY.md#workbench-room-and-artifacts).

## Owner

Not an agent and not a Role: the owner is above the roles, and the current owner request is the first instruction authority. Human QA and promotion to main are owner acts.

Definition: [GLOSSARY.md, Workbench, room and artifacts](../../GLOSSARY.md#workbench-room-and-artifacts).

## Room

Room has always meant project, so it is not the Workbench: the Workbench entry says it is the table set in one. Environment and Filesystem are sibling definitions of Room. Not a Chat, a Conversation or a host.

Definition: [GLOSSARY.md, Workbench, room and artifacts](../../GLOSSARY.md#workbench-room-and-artifacts).

## Scaffolding

The architecture artifacts taken together; an Architecture artifact is one of them, so the two words are one concept seen as a whole and as a single artifact, not two meanings. Transient is an accepted alternative word. It is cleared away once its knowledge, unfinished obligations and needed evidence have reached their durable owners; the Retired entry is the staging place for reconciled Spec and Task scaffolding.

Definition: [GLOSSARY.md, Workbench, room and artifacts](../../GLOSSARY.md#workbench-room-and-artifacts).

## Contract artifact

Defined by being loaded every turn, which does not change because artifacts drifted. The Workbench Contract entry names the binding claim set and its carriers, which is a different thing.

Definition: [GLOSSARY.md, Workbench, room and artifacts](../../GLOSSARY.md#workbench-room-and-artifacts).

## Routing artifact

What the contract routes to; a context pointer is how it is reached. It is not loaded every turn, which separates it from a Contract artifact.

Definition: [GLOSSARY.md, Workbench, room and artifacts](../../GLOSSARY.md#workbench-room-and-artifacts).

## Architecture artifact

One of the artifacts that Scaffolding names together. It is neither a Contract artifact nor a Routing artifact: nothing in it is durable once reconciled, and the Retired entry holds Spec and Task scaffolding that has been reconciled.

Definition: [GLOSSARY.md, Workbench, room and artifacts](../../GLOSSARY.md#workbench-room-and-artifacts).

## Control

"Root controls", and "controls" for files, are retired as stale: the files are Contract and routing artifacts. A Control sits beside the Source, tool and test entry (a tool performs an operation) and the Managed runtime tool entry; the dictionary's Tool is not adopted as a Workbench term.

_Avoid_: root controls. Retired 2026-10-03: "controls" now means one-action tools (Control). Public names that carry the word, such as the control fidelity check, keep it until they are renamed on their own. Historical records keep the old wording.

Definition: [GLOSSARY.md, Workbench, room and artifacts](../../GLOSSARY.md#workbench-room-and-artifacts).

## Portable Workbench

It describes the repository, not a host or a session. Host portability and the support root are things it depends on, not the thing itself.

Definition: [GLOSSARY.md, Workbench, room and artifacts](../../GLOSSARY.md#workbench-room-and-artifacts).

## Host portability

One thing a Portable Workbench depends on; it is not the Portable Workbench itself. Here "host" means the machine, not the harness.

Definition: [GLOSSARY.md, Workbench, room and artifacts](../../GLOSSARY.md#workbench-room-and-artifacts).

## Ownership origin model

About upgrade compatibility between upstream and a room, not about a Portable Workbench.

Definition: [GLOSSARY.md, Workbench, room and artifacts](../../GLOSSARY.md#workbench-room-and-artifacts).

## Workbench self-drift check

It is separate from a target project's drift check; structural render, doctor, or tests alone do not establish semantic freshness.

Definition: [GLOSSARY.md, Workbench, room and artifacts](../../GLOSSARY.md#workbench-room-and-artifacts).

## Blueprint

The Blueprint makes us ask questions; it does not give definite answers. Definite answers and their details live on other artifacts, and a decision record answers why for one specific decision. A decision is placed by asking whether it maps to a destination at the Blueprint's scale or to a more bounded one. It supports the design concept; it is not current status, an ADR or DDR inventory, a work queue, a glossary, or a proof archive. The accepted destination keeps it standalone and written before the decisions that follow it, so it is never built from DDRs or ADRs: it is not a router to them and links no record that carries an identifier (a DDR, ADR, Spec, Task or Landmark); it may link other artifacts.

Definition: [GLOSSARY.md, Workbench, room and artifacts](../../GLOSSARY.md#workbench-room-and-artifacts).

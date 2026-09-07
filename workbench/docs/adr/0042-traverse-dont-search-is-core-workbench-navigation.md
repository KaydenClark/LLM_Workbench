---
status: accepted
date: 2026-09-06
canonicalized_in:
  - AGENTS.md
  - BLUEPRINT.md
  - LEXICON.md
---

# Traverse, don't search is core Workbench navigation

The owner explicitly selected "Traverse, don't search" and the Context Map as
core Workbench features on 2026-09-06. They belong to the operating surface of
one project, independently of any downstream multi-project coordinator.

The Workbench already had reduced entry and a traversal-first Wiki read rule
in [the Wiki schema](../../wiki/SCHEMA.md#read). That narrower rule did not
establish a project-wide Context Map in the root operating contract. The
accepted correction places behavior in [AGENTS.md](../../../AGENTS.md#traverse-dont-search),
product direction in [BLUEPRINT.md](../../../BLUEPRINT.md#core-navigation-contract),
and definitions and entry routes in [LEXICON.md](../../../LEXICON.md#task-routing),
with matching copy-ready templates.

Considered and rejected: keeping traversal only inside the Wiki leaves ordinary
project orientation dependent on rediscovery; a second master index duplicates
existing owners; requiring a graph service or Obsidian breaks standalone
portability. Banning source search would obstruct debugging and recovery when
the map is incomplete. Bounded search therefore remains available for missing,
stale, or insufficient routes, work in the selected source area, and explicit
search or navigation audits.

Consequences: new durable context is linked from its relevant route and back
to its sources. Agents repair relevant routing gaps within scope or report
them. Traversal grants no authority and does not enlarge read or edit scope.
A generated map or retrieval index is a Projection of existing owners. This
decision neither requires indexing generated files nor claims automated
traversal, complete reachability, or measured agent-outcome improvement.

This extends [ADR-0035](0035-reduced-entry-and-assigned-autonomy.md) and preserves
the base/extension boundary in
[ADR-0015](0015-workbench-base-and-foundry-capabilities.md). Other historical
Foundry concepts discussed during the comparison remain recommendations;
this decision does not adopt them or change the independently accepted
notepad and identifier decisions in ADR-0040 and ADR-0041.

Provenance: direct owner instruction in the 2026-09-06 conversation to lock
"Traverse, don't search" into the Workbench as a core feature. Historical
Foundry terminology was inspected as supporting context, not as authority for
this change.

---
type: memory
status: active
sensitivity: normal
knowledge_role: canonical
provenance:
  - S-021 dogfood migration 2026-09-01; S-025 contract adoption 2026-09-04
source_paths:
  - workbench/wiki
last_verified: 2026-09-04
---

# LLM Workbench Memory

This is the product repository's room brain, kept at `workbench/wiki/MEMORY.md`.
It routes durable project-local context; live operating rules stay in the
root controls, capability state and proof stay in the manifest-declared
`workbench/specs/` lane, and rationale stays in `workbench/docs/adr/`.

## Source Precedence

1. Verified runtime and the live controls: `AGENTS.md`, `BLUEPRINT.md`, the
   assigned stable spec, `TASKBOARD.md`, and `RUNBOOK.md`.
2. Maintained notes routed from this file.
3. `archive/` and generated material.

When sources disagree, verify the higher-authority source and repair the stale
note (`AGENTS.md` -> State Resolution). The wiki is a map, not a Governance
Plane: it routes to Canon, Grounding, and verified Actuality and authorizes
nothing.

## Notepad Foundation Routing

For accepted objective continuity and JSON direction, follow
[S-046](../specs/S-046-json-notepad-foundation/SPEC.md) and
[ADR-0040](../docs/adr/0040-json-notepads-preserve-objective-continuity.md).
Visible identifier semantics belong to
[S-047](../specs/S-047-visible-workbench-identifiers/SPEC.md) and
[ADR-0041](../docs/adr/0041-visible-base62-workbench-identifiers.md).
Checkpoint rationale and retirement belong to
[S-048](../specs/S-048-checkpoint-retirement/SPEC.md).
The shared runtime is `workbench/tools/notepads.mjs`; its operations are
documented in [RUNBOOK](../../RUNBOOK.md) and its judgment in the `notepad`
skill. This router does not copy their state or the local grilling queue.

## Release And Distribution Routing

The reconciled release scope and complete historical inventory live in
[S-050](../specs/S-050-workbench-v3-2-0-release/SPEC.md). Follow its named owners
for skill ownership/compatibility, optional private session transport and the
configured-host capability floor. This route preserves their open gates without
copying task state here.

## Leaving The Wiki

| Go to | For |
|---|---|
| [AGENTS.md](../../AGENTS.md) | Authority, scope, safety, and the work loop |
| [BLUEPRINT.md](../../BLUEPRINT.md) | Product destination, integrated design, cross-cutting qualities, and constraints |
| [LEXICON.md](../../LEXICON.md) | Shared terms, the Governance Core, the Artifact Ownership Schema, and design-concept routing |
| [TASKBOARD.md](../../TASKBOARD.md) | Generated work-state view; follow each row to its owning Spec |
| [RUNBOOK.md](../../RUNBOOK.md) | Exact operating and verification commands |
| `workbench/specs/` | Stable capability records, acceptance, evidence, and proof |
| [docs/adr/REGISTER.md](../docs/adr/REGISTER.md) | The derived register of decision records |
| [SCHEMA.md](SCHEMA.md) | Wiki CRUD, metadata, sensitivity, and freshness rules |
| [design-concepts/](design-concepts/README.md) | Owner-directed articles explaining durable design models (empty until the owner directs one) |
| [guidebooks/](guidebooks/) | Ordered procedures that outgrew the Runbook (empty) |

## Routing

| Question | Read first |
|---|---|
| How the Workbench is governed | [LEXICON.md](../../LEXICON.md) -> Governance Core, then `workbench/docs/adr/` |
| Why a layout, stance or entry-route decision was made | [docs/adr/REGISTER.md](../docs/adr/REGISTER.md) |

This product repository keeps no personal, machine, or deployment notes; it is
a `project` profile wiki. The collections ship empty until the owner directs
an article or a guidebook.

## Up-Link

Standalone room; no deployment wiki.

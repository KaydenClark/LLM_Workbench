---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner requested one durable Wiki article per Spec on 2026-09-19
  - Moved into the features collection and restructured as a feature article by the Move And Retype The Remaining Per-Spec Articles Task (TK-002) of the Wiki Evolving-Synthesis Migration Spec (S-003W) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-00A-blueprint-active-adr-and-context-map/SPEC.md
  - ARCHITECTURE.md
  - BLUEPRINT.md
  - workbench/tools/adr.mjs
  - tools/test-adr.mjs
  - workbench/docs/adr/000A-active-adr-decisions-and-destination-blueprints.md
last_verified: 2026-10-04
---

# Blueprint, Active ADRs And The Context Map

The Blueprint, Active ADR, And Context Map Rebuild Spec (S-00A) separated
product direction, decisions, navigation and delivery instead of making the
Blueprint a status dashboard.

## What It Does

The Blueprint describes the desired finished product. Accepted active ADR
decisions carry architectural Canon; their rationale and historical
alternatives remain evidence. `ARCHITECTURE.md` routes questions to owners through
the Context Map. A Spec describes a bounded destination derived from that
direction and verified Actuality.

The Active ADR Decisions And Destination Blueprints decision record (ADR-000A)
replaced the Binding Rules Stay In Current Controls decision record (ADR-0002)
and the Planes Classify Claims, Not Whole Artifacts decision record (ADR-0025)
as whole records. Operational owners remain named through `canonicalized_in`;
that field does not create instruction authority.

## Why It Matters

Keeping direction, decisions, navigation and delivery apart stops the Blueprint
from turning into a status dashboard.

## Limits

- ADR lifecycle now follows the later folder-based implementation: proposed
  records and permanent archived history remain reachable while the default
  register presents accepted active decisions. Consult the current ADR runtime
  and `ARCHITECTURE.md` when maintaining these surfaces.
- The original migration preserved 166 root and 59 generic Blueprint source
  segments against pinned originals. Its completion reports the reviewed
  capability at c1600d1 and explains projection changes during verification.
  Those are historical migration results, not a fresh release or outcome
  benchmark. The retained source record owns the detailed claim-disposition
  evidence.

## Evidence and Sources

The source record and named owners were read at `bc370fe742d5ddb8348bf361fccea31205f6cee7`. Historical results above are attributed to that record; they were not rerun for this article.

- [Historical Blueprint, Active ADR, And Context Map Rebuild Spec (S-00A)](../../specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md). Original decisions, evidence and limitations remain preserved; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `bc370fe`](https://github.com/KaydenClark/LLM_Workbench/blob/bc370fe742d5ddb8348bf361fccea31205f6cee7/workbench/specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md). Recover the original with `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md`.
- [ARCHITECTURE.md](../../../ARCHITECTURE.md#routes) - the Context Map owner, succeeding the Lexicon.
- [BLUEPRINT.md](../../../BLUEPRINT.md) - the destination owner.
- [workbench/tools/adr.mjs](../../../workbench/tools/adr.mjs) - the ADR runtime.
- [tools/test-adr.mjs](../../../tools/test-adr.mjs) - the ADR verification seam.
- [workbench/docs/adr/000A-active-adr-decisions-and-destination-blueprints.md](../../../workbench/docs/adr/000A-active-adr-decisions-and-destination-blueprints.md) - the Active ADR Decisions And Destination Blueprints decision record (ADR-000A).

## History

- 2026-09-19: Reconciled into one Spec article on owner direction. Original source and proof remain intact; this article does not authorize retirement or discard.
- 2026-10-04: Moved from `design-concepts/spec-S-00A-blueprint-active-adr-and-context-map.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Move And Retype The Remaining Per-Spec Articles Task (TK-002) of the Wiki Evolving-Synthesis Migration Spec (S-003W). Every live link to it was rewritten by the move; no claim was changed.
- 2026-10-07: Re-pointed the retiring Lexicon's links and live routes to `GLOSSARY.md`, `ARCHITECTURE.md` and the Wiki lexicon articles (Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), consumer re-pointing Task (TK-009F)); no claim changed.

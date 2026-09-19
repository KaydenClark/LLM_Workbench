---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner requested one durable Wiki article per Spec on 2026-09-19
source_paths:
  - workbench/specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md
  - LEXICON.md
  - BLUEPRINT.md
  - workbench/tools/adr.mjs
  - tools/test-adr.mjs
  - workbench/docs/adr/000A-active-adr-decisions-and-destination-blueprints.md
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# S-00A: Blueprint, Active ADRs And The Context Map

The Blueprint describes the desired finished product. Accepted active ADR decisions carry architectural Canon; their rationale and historical alternatives remain evidence. The Lexicon routes questions to owners through its Context Map. A Spec describes a bounded destination derived from that direction and verified Actuality.

This separates product direction, decisions, navigation and delivery instead of making the Blueprint a status dashboard. ADR-000A replaced ADR-0002 and ADR-0025 as whole records. Operational owners remain named through `canonicalized_in`; that field does not create instruction authority.

ADR lifecycle now follows the later folder-based implementation: proposed records and permanent archived history remain reachable while the default register presents accepted active decisions. Consult the current ADR runtime and Lexicon when maintaining these surfaces.

## Historical proof and limits

The original migration preserved 166 root and 59 generic Blueprint source segments against pinned originals. Its completion reports the reviewed capability at c1600d1 and explains projection changes during verification. Those are historical migration results, not a fresh release or outcome benchmark. The retained source record owns the detailed claim-disposition evidence.

## Evidence and Sources

The source record and named owners were read at `bc370fe742d5ddb8348bf361fccea31205f6cee7`. Historical results above are attributed to that record; they were not rerun for this article. Recover its exact original with `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md`.

- [workbench/specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md](../../../workbench/specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md)
- [LEXICON.md](../../../LEXICON.md)
- [BLUEPRINT.md](../../../BLUEPRINT.md)
- [workbench/tools/adr.mjs](../../../workbench/tools/adr.mjs)
- [tools/test-adr.mjs](../../../tools/test-adr.mjs)
- [workbench/docs/adr/000A-active-adr-decisions-and-destination-blueprints.md](../../../workbench/docs/adr/000A-active-adr-decisions-and-destination-blueprints.md)

## History

- 2026-09-19: Reconciled into one Spec article on owner direction. Original source and proof remain intact; this article does not authorize retirement or discard.

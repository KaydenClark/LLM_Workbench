---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed one-article-per-Spec migration, 2026-09-19
source_paths:
  - workbench/specs/S-024-governance-core-adrs-and-diagnostics/SPEC.md
  - LEXICON.md
  - AGENTS.md
  - workbench/tools/diagnostics.mjs
  - workbench/tools/adr.mjs
  - tools/test-diagnostics.mjs
  - tools/test-governance-core.mjs
  - tools/test-adr.mjs
  - workbench/docs/adr/000A-active-adr-decisions-and-destination-blueprints.md
  - workbench/docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md
  - workbench/docs/adr/0029-diagnostics-carry-registered-blocking-semantics.md
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# Governance Claims And Diagnostics (S-024)

Governance planes classify the role a claim plays in an operation. Intent, Canon, Grounding, Enduring Context, Actuality and Projection do not label entire files as authorities. A Spec can contain accepted requirements, observed results and derived views without making those claims interchangeable.

Instruction authority and state resolution answer different questions. AGENTS defines authorization and bounded delegation. Comparing accepted requirements with verified implementation reveals an implementation gap, documentation drift or unresolved ordering. Neither code nor prose wins automatically. Ordinary owner-directed work does not acquire an external orchestration prerequisite merely because such machinery exists.

Diagnostics have separate severity, scope and blocking effect. diagnostics.mjs owns the closed registry. Doctor reports; selection and claim consume the effects applicable to those operations. Attention stays visible without becoming an invented blocker. A finding alone does not authorize a repair.

ADRs preserve consequential decisions, alternatives and provenance. Current accepted decision claims are architectural Canon under root controls; rationale and superseded alternatives remain evidence. The original ADR-0025 route was later superseded, so readers follow the current Lexicon and ADR-000A rather than treating archived wording as current.

Registry tests, consumer fixtures and ADR validation establish mechanical behavior. They do not establish universal agent compliance. Historical ADR counts describe the original delivery; the generated ADR register owns today's inventory. Cross-plane transition systems and Foundry governance extensions are outside this portable capability.

## Evidence and Sources

Historical source: `git show 8035b41831985581e41ca713e87c2511d3dbbcc4:workbench/specs/S-024-governance-core-adrs-and-diagnostics/SPEC.md`.
The original acceptance and evidence retain their time and scope. Current source
inspection for this article used that same commit; links below route a fresh
verification, rather than asserting every historical behavior remains current.

- [LEXICON.md](../../../LEXICON.md)
- [AGENTS.md](../../../AGENTS.md)
- [workbench/tools/diagnostics.mjs](../../tools/diagnostics.mjs)
- [workbench/tools/adr.mjs](../../tools/adr.mjs)
- [tools/test-diagnostics.mjs](../../../tools/test-diagnostics.mjs)
- [tools/test-governance-core.mjs](../../../tools/test-governance-core.mjs)
- [tools/test-adr.mjs](../../../tools/test-adr.mjs)
- [workbench/docs/adr/000A-active-adr-decisions-and-destination-blueprints.md](../../docs/adr/000A-active-adr-decisions-and-destination-blueprints.md)
- [workbench/docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md](../../docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md)
- [workbench/docs/adr/0029-diagnostics-carry-registered-blocking-semantics.md](../../docs/adr/0029-diagnostics-carry-registered-blocking-semantics.md)

## History

- 2026-09-19: Created on explicit owner direction for one article per legacy Spec. Preserved useful knowledge and historical limits; no source record retired or discarded.

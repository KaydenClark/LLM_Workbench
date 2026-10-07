---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed one-article-per-Spec migration, 2026-09-19
  - Moved into the features collection and restructured as a feature article by Wiki Evolving-Synthesis Migration (S-003W) Task TK-002 (Move And Retype The Remaining Per-Spec Articles) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-024-governance-core-adrs-and-diagnostics/SPEC.md
  - GLOSSARY.md
  - AGENTS.md
  - workbench/tools/diagnostics.mjs
  - workbench/tools/adr.mjs
  - tools/test-diagnostics.mjs
  - tools/test-governance-core.mjs
  - tools/test-adr.mjs
  - workbench/docs/adr/000A-active-adr-decisions-and-destination-blueprints.md
  - workbench/docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md
  - workbench/docs/adr/0029-diagnostics-carry-registered-blocking-semantics.md
  - workbench/docs/adr/000C-the-workbench-contract-is-the-obligation-claim-set-carried-by-three-root-controls-and-the-assigned-spec.md
  - workbench/docs/adr/archive/0033-workbench-contract-is-a-claim-set.md
last_verified: 2026-10-04
---

# Governance Planes, ADR Decisions And Scoped Diagnostics

Governance planes classify the role a claim plays in an operation, instruction
authority is kept apart from state resolution, diagnostics carry their own
severity, scope and blocking effect, and ADRs preserve consequential decisions.
The Governance Core, ADRs, And Scoped Diagnostics Spec (S-024) delivered this
governance core.

## What It Does

- **Planes classify claims.** Intent, Canon, Grounding, Enduring Context,
  Actuality and Projection do not label entire files as authorities. A Spec can
  contain accepted requirements, observed results and derived views without
  making those claims interchangeable.
- **Authority and state resolution are separate questions.** `AGENTS.md`
  defines authorization and bounded delegation. Comparing accepted requirements
  with verified implementation reveals an implementation gap, documentation
  drift or unresolved ordering; neither code nor prose wins automatically.
  Ordinary owner-directed work does not acquire an external orchestration
  prerequisite merely because such machinery exists.
- **Diagnostics have severity, scope and blocking effect.** `diagnostics.mjs`
  owns the closed registry. Doctor reports; selection and claim consume the
  effects applicable to those operations. Attention stays visible without
  becoming an invented blocker, and a finding alone does not authorize a
  repair.
- **ADRs preserve decisions.** They keep consequential decisions, alternatives
  and provenance. Current accepted decision claims are architectural Canon under
  root controls; rationale and superseded alternatives remain evidence.

## Why It Matters

A Spec holds claims of different kinds, so classifying the claim rather than the
file keeps accepted requirements, observed results and derived views from being
read as one another. Separating severity, scope and blocking effect keeps a
visible finding from becoming a blocker nobody declared. Readers follow the
current glossary and active ADRs for accepted meaning, with superseded records
kept as history.

## Limits

- The original Governance Planes decision (ADR-0025) route was later
  superseded. The three-carrier Contract decision, the Workbench Contract
  obligation claim set (ADR-000C), supersedes the Contract claim-set decision
  from the seven-control era (ADR-0033). The archived record remains a source
  for the earlier claim-set model.
- Registry tests, consumer fixtures and ADR validation establish mechanical
  behavior. They do not establish universal agent compliance.
- Historical ADR counts describe the original delivery; the generated ADR
  register owns today's inventory.
- Cross-plane transition systems and Foundry governance extensions are outside
  this portable capability.

## Evidence and Sources

- [Historical Governance Core, ADRs, And Scoped Diagnostics Spec (S-024)](../../specs/S-024-governance-core-adrs-and-diagnostics/SPEC.md). The original acceptance and evidence retain their time and scope; its eventual retired route is named in this article's `source_paths`.
- Immutable source: `git show 8035b41831985581e41ca713e87c2511d3dbbcc4:workbench/specs/S-024-governance-core-adrs-and-diagnostics/SPEC.md`. Source inspection for this article used that same commit; the links below route a fresh verification, rather than asserting every historical behavior remains current.
- [GLOSSARY.md](../../../GLOSSARY.md#governance-core) - the accepted meanings and Governance core.
- [AGENTS.md](../../../AGENTS.md) - the authorization and bounded-delegation owner.
- [workbench/tools/diagnostics.mjs](../../tools/diagnostics.mjs) - the closed diagnostic registry.
- [workbench/tools/adr.mjs](../../tools/adr.mjs) - the ADR tool.
- [tools/test-diagnostics.mjs](../../../tools/test-diagnostics.mjs), [tools/test-governance-core.mjs](../../../tools/test-governance-core.mjs) and [tools/test-adr.mjs](../../../tools/test-adr.mjs) - the verification seams.
- [Active ADR decisions and destination Blueprints (ADR-000A)](../../docs/adr/000A-active-adr-decisions-and-destination-blueprints.md)
- [Instruction authority is separate from state resolution (ADR-0027)](../../docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md)
- [Diagnostic codes carry registered blocking semantics that consumers enforce (ADR-0029)](../../docs/adr/0029-diagnostics-carry-registered-blocking-semantics.md)
- [Accepted Contract decision, The Workbench Contract is the obligation claim set carried by three root controls and the assigned spec (ADR-000C)](../../docs/adr/000C-the-workbench-contract-is-the-obligation-claim-set-carried-by-three-root-controls-and-the-assigned-spec.md)
- [Archived Contract decision, The Workbench Contract is a claim set carried by the seven controls and the assigned spec (ADR-0033)](../../docs/adr/archive/0033-workbench-contract-is-a-claim-set.md)
- [Archived Governance Planes decision, Governance Planes classify claims and their use, not whole artifacts (ADR-0025)](../../docs/adr/archive/0025-planes-classify-claims-not-whole-artifacts.md)

## History

- 2026-09-19: Created on explicit owner direction for one article per legacy Spec. Preserved useful knowledge and historical limits; no source record retired or discarded.
- 2026-09-29: Added the active three-carrier Contract route and retained the superseded Contract claim-set decision (ADR-0033) as a source under the owner-confirmed Wiki-first navigation rule.
- 2026-10-04: Moved from `design-concepts/spec-S-024-governance-core-and-diagnostics.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Wiki Evolving-Synthesis Migration Spec (S-003W) Task TK-002 (Move And Retype The Remaining Per-Spec Articles). Every live link to it was rewritten by the move; no claim was changed. This move checked that the named current source paths (the first entry names the Spec's eventual retired route, which does not exist yet) and the immutable commit exist, not the behavior of the capability itself.
- 2026-10-07: Re-pointed the retiring Lexicon's links and live routes to `GLOSSARY.md`, `ARCHITECTURE.md` and the Wiki lexicon articles (Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), consumer re-pointing Task (TK-009F)); no claim changed.

---
type: memory
status: partial
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed Domain Modeling comparison and article, 2026-09-29
  - Owner-confirmed glossary refinement, promoted 2026-10-06
  - Matt Pocock source and glossary format at d81f3a183412e71a5b1e84ca21bc1a35eea03a60, inspected 2026-10-06
source_paths:
  - workbench/specs/S-004J-required-domain-modeling-skill/SPEC.md
  - workbench/specs/S-004O-lexicon-retirement-and-architecture-md/SPEC.md
  - workbench/specs/S-002H-domain-modeling-skill/SPEC.md
  - workbench/docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md
  - skills-pending/domain-modeling/SKILL.md
  - workbench/skills/README.md
  - workbench/skills/grilling/SKILL.md
  - LEXICON.md
  - AGENTS.md
last_verified: 2026-10-06
---

# Domain Modeling: sharpen the Workbench's language as decisions form

Domain modeling is the active practice of noticing when a word hides two meanings, a missing boundary or a contradiction with the product. The agent challenges it while the choice is still cheap, tries a concrete edge case and checks the relevant source. Looking up an established definition is ordinary orientation; it does not require a modeling session.

## Why a compact glossary and a richer dictionary coexist

A short definition gives an agent the vocabulary needed for the current job. An explanatory article gives a reader relationships, examples and the reason a distinction matters. For example, a concise Task definition can identify the execution slice, while a Wiki article can show how that slice relates to a Spec and why documentation alignment alone does not prove completion. These jobs need different amounts of detail; treating the article as another canonical definition store would leave two places to reconcile.

[The refined Lexicon retirement decision (DDR-001E)](../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md) owns the accepted glossary, Wiki and architecture split and the retained capture boundary. [Lexicon Retirement And ARCHITECTURE.md (S-004O)](../specs/S-004O-lexicon-retirement-and-architecture-md/SPEC.md) owns its migration and proof. This article explains the distinction; it neither defines every term nor supplies a second promotion procedure.

## Place in the workflow

The owner uses modeling beside [grilling](skill-grilling.md) when reworking names and boundaries, to see their downstream consequences before settling them. It remains an optional companion invocation even though it is a required room skill: availability in every room is different from requiring it for every inquiry. It can also help [to-spec](skill-to-spec.md) make acceptance refer to the intended concept, or help delivery and review compare accepted language with source. Composition inherits the caller's scope and endpoint.

[Required Domain Modeling Skill (S-004J)](../specs/S-004J-required-domain-modeling-skill/SPEC.md) owns the active method, source adapters, distribution and acceptance. [The notepad skill](../skills/notepad/SKILL.md) owns working continuity and pending readbacks; [promote](../skills/promote/SKILL.md) owns the durable write operation; [to-docs](../skills/to-docs/SKILL.md#decision-records) owns decision-record authoring. A confirmed meaning and an implemented capability are distinct facts.

## The active moves

| Situation | Useful modeling move | What the reader learns |
|---|---|---|
| One word conflicts with its accepted meaning | Show the two senses and ask which applies | Whether to preserve, refine or split the concept |
| Several words name one concept | Propose a precise canonical name and avoided aliases | Which word readers should use consistently |
| A relationship is vague | Try a concrete edge case | Where the boundary holds or needs an exception |
| A behavior claim conflicts with code | Inspect source and tests and name the disagreement | Documentation drift, implementation gap or unresolved ambiguity |
| A rename has consequences downstream | Trace the few affected owners, identifiers and tests | The cost of the choice before it settles |
| A consequential choice deserves a record | Apply the existing decision-record scope and threshold | Whether rationale belongs in an ADR or a DDR |

The distinction between a proposed challenge and a verified fact matters. An invented scenario tests understanding; it does not establish that the product implements the answer. The resulting acceptance and proof belong to the assigned Spec.

## A Workbench example

Suppose the owner says, “The Tracker marks a Task complete when its document is aligned.” The current [Lexicon](../../LEXICON.md) separates documentation alignment from implementation state. A useful question is whether “complete” means an aligned explanation or an execution slice that passed acceptance. A concrete edge case is a Wiki article that is aligned while the corresponding runtime slice still fails.

The modeling result is a clarified concept and visible consequence. [The Task Artifact And Its Lifecycle](design-concepts/task-artifact-and-lifecycle.md) explains the execution artifact; the relevant Spec owns whether a particular implementation satisfies it. The vocabulary destination and promotion boundary are DDR-001E's, linked above. The conversation cannot manufacture a Task receipt or owner Human QA approval.

## Upstream comparison and adapters

Matt's [pinned source](https://github.com/mattpocock/skills/blob/d81f3a183412e71a5b1e84ca21bc1a35eea03a60/skills/engineering/domain-modeling/SKILL.md) and [glossary format](https://github.com/mattpocock/skills/blob/d81f3a183412e71a5b1e84ca21bc1a35eea03a60/skills/engineering/domain-modeling/GLOSSARY-FORMAT.md) were inspected on 2026-10-06. They give an active method and compact project vocabulary. The retained [older pending source](../../skills-pending/domain-modeling/SKILL.md) uses CONTEXT naming and is historical input, not the new adoption baseline.

| Upstream element | Workbench disposition and owner |
|---|---|
| Language challenges, concrete scenarios and code checks | Preserve the method; S-004J adds the owner's bounded upstream consequence trace |
| Compact glossary format and single-context root vocabulary | Follow the confirmed destination in DDR-001E; S-004O delivers it |
| Immediate glossary writes when a term resolves | Adapt to the existing capture boundary; the owner rejected an inline exception |
| Local ADR directory and sparse ADR offer | Use manifest decision-record collections and the existing ADR/DDR scope test |
| Multi-context map | Inspect actual context layout at Plan; single-context confirmation does not invent additional contexts |

S-004J records each necessary adapter instead of rebuilding the imported skill into a copy of the Workbench policies. The source pin and credits make a later reader able to distinguish Matt's method from the local capture and ownership changes.

## Availability and proof limits

At inspected integration `42431879fab3057db9e26ae661b4e92512c281f0` on 2026-10-06, the required lane lacks domain-modeling and the root vocabulary file remains `LEXICON.md`. The root glossary and architecture migration are not delivered. The owner settled required room availability on 2026-09-29; S-004J owns its realization. A personal installed copy and the old pending source do not prove fresh-clone discovery.

Conversation behavior needs observed fresh-context scenarios: useful challenges, boundary probes, source-backed contradictions, upstream consequence tracing and preserved pending/confirmed meaning. Catalog tests prove structural distribution; Wiki validation proves schema and route integrity. Neither demonstrates host invocation or judgment. S-004J owns those acceptance cases and the remaining proof; this documentation pass performs no skill implementation or behavioral scenario and grants no owner QA approval.

## Sources and history

- [Required Domain Modeling Skill (S-004J)](../specs/S-004J-required-domain-modeling-skill/SPEC.md) and [Lexicon Retirement And ARCHITECTURE.md (S-004O)](../specs/S-004O-lexicon-retirement-and-architecture-md/SPEC.md)
- [Refined Lexicon retirement (DDR-001E)](../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md), [Contract](../../AGENTS.md), [current Lexicon ownership](../../LEXICON.md#artifact-ownership-schema) and [Wiki router](MEMORY.md)
- [Superseded Domain Modeling Skill for the Workbench (S-002H)](../specs/S-002H-domain-modeling-skill/SPEC.md) retains the earlier plan and rationale; [Core Skill Lifecycle And Optional Source Disposition (S-00R)](../specs/S-00R-core-skill-lifecycle-and-optional-source-disposition/SPEC.md) owns retained source disposition

- 2026-09-29: Created on the owner's request for the method comparison and Wiki treatment; no implementation claimed.
- 2026-10-04: Delivery owner repointed from superseded S-002H to Required Domain Modeling Skill (S-004J).
- 2026-10-06: Reconciled the confirmed glossary destination and retained capture boundary; replaced superseded Lexicon-only and inline-write advice with links to the accepted owners. Distribution and conversational proof remain S-004J's delivery work.

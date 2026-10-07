---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed Domain Modeling comparison and article, 2026-09-29
  - Owner-confirmed glossary refinement, promoted 2026-10-06
  - Matt Pocock source and glossary format at d81f3a183412e71a5b1e84ca21bc1a35eea03a60, inspected 2026-10-06 and re-read 2026-10-07
  - Required Domain Modeling Skill Spec (S-004J) Task TK-00JC (Wiki reconciliation), 2026-10-07, written from the lane source Task TK-00JA delivered and the fresh-context scenario proof Task TK-00JB recorded
source_paths:
  - workbench/skills/domain-modeling/SKILL.md
  - workbench/skills/domain-modeling/GLOSSARY-FORMAT.md
  - workbench/specs/S-004J-required-domain-modeling-skill/SPEC.md
  - workbench/specs/S-004J-required-domain-modeling-skill/proof/scenario-evidence.md
  - workbench/specs/S-004O-lexicon-retirement-and-architecture-md/SPEC.md
  - workbench/specs/S-002H-domain-modeling-skill/SPEC.md
  - workbench/docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md
  - workbench/skills/README.md
  - workbench/manifest.json
  - workbench/tools/workbench-layout.mjs
  - skills-pending/domain-modeling/SKILL.md
  - workbench/skills/grilling/SKILL.md
  - RUNBOOK.md
  - LEXICON.md
  - AGENTS.md
last_verified: 2026-10-07
---

# Domain Modeling: sharpen the Workbench's language as decisions form

Domain modeling is the active practice of noticing when a word hides two meanings, a missing boundary or a contradiction with the product. The agent challenges it while the choice is still cheap, tries a concrete edge case, checks the relevant source and shows what the choice would touch before it settles. Looking up an established definition is ordinary orientation; it does not require a modeling session.

`domain-modeling` ships in every room's skills lane as one of the 29 skills in the closed core bundle, at [workbench/skills/domain-modeling](../skills/domain-modeling/SKILL.md), and a fresh clone discovers it through the tracked `.agents/skills` and `.claude/skills` adapters. The [RUNBOOK operations index](../../RUNBOOK.md#operations-index) points to it for tracing a name, boundary or relationship before it settles. The skill source owns the procedure; this page explains where the method came from, what the Workbench changed and why, and what has been observed.

## Why a compact glossary and a richer dictionary coexist

A short definition gives an agent the vocabulary needed for the current job. An explanatory article gives a reader relationships, examples and the reason a distinction matters. For example, a concise Task definition can identify the execution slice, while a Wiki article can show how that slice relates to a Spec and why documentation alignment alone does not prove completion. These jobs need different amounts of detail; treating the article as another canonical definition store would leave two places to reconcile.

[The refined Lexicon retirement decision (DDR-001E)](../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md) owns the accepted glossary, Wiki and architecture split and the retained capture boundary. [Lexicon Retirement And ARCHITECTURE.md (S-004O)](../specs/S-004O-lexicon-retirement-and-architecture-md/SPEC.md) owns its migration and proof. This article explains the distinction; it neither defines every term nor supplies a second promotion procedure.

## Place in the workflow

The owner uses modeling beside [grilling](skill-grilling.md) when reworking names and boundaries, to see their downstream consequences before settling them. It is a required room skill and an optional companion invocation: availability in every room is different from requiring it for every inquiry, and grilling and the destination question-card flow complete without it. It can also help [to-spec](skill-to-spec.md) make acceptance refer to the intended concept, or help delivery and review compare accepted language with source. Composition inherits the caller's scope and endpoint.

[Required Domain Modeling Skill (S-004J)](../specs/S-004J-required-domain-modeling-skill/SPEC.md) owns the skill, its adapters, distribution and acceptance. [The notepad skill](../skills/notepad/SKILL.md) owns working continuity and pending readbacks; [promote](../skills/promote/SKILL.md) owns the durable write operation; [to-docs](../skills/to-docs/SKILL.md#decision-records) owns decision-record authoring. A confirmed meaning and an implemented capability are distinct facts.

## Upstream method

Matt Pocock's [domain-modeling skill](https://github.com/mattpocock/skills/blob/d81f3a183412e71a5b1e84ca21bc1a35eea03a60/skills/engineering/domain-modeling/SKILL.md) and its [glossary format](https://github.com/mattpocock/skills/blob/d81f3a183412e71a5b1e84ca21bc1a35eea03a60/skills/engineering/domain-modeling/GLOSSARY-FORMAT.md), pinned at `d81f3a18`, describe the active discipline this skill keeps. In summary:

- **Active, not passive.** The skill is for changing a project's model, not for reading its vocabulary, which any skill does in passing.
- **Four moves during a session.** Challenge a term used against the glossary's existing meaning; propose a precise canonical term for a vague or overloaded one; stress-test relationships with invented edge-case scenarios; and check a stated behavior against the code, surfacing any contradiction.
- **A compact glossary.** A root `GLOSSARY.md` in a fixed entry format, free of implementation detail, created lazily when the first term resolves. A root `GLOSSARY-MAP.md` marks a repository with several contexts, each with its own glossary.
- **Immediate capture.** When a term resolves, the glossary is updated inline right away rather than batched.
- **Sparse decision records.** An ADR is offered only when a choice is hard to reverse, surprising without context and the result of a real trade-off, written into a local `docs/adr/` directory in the upstream ADR format.

The repository's older [pending source](../../skills-pending/domain-modeling/SKILL.md) uses Matt's earlier `CONTEXT.md` naming. It stays outside discovery as historical input under [Core Skill Lifecycle And Optional Source Disposition (S-00R)](../specs/S-00R-core-skill-lifecycle-and-optional-source-disposition/SPEC.md); it was not the adoption baseline.

## Workbench adaptation

The owner asked for a skill "working closer to his, just with the parts of the workbench that is mine" (2026-09-29). The lane source keeps Matt's four moves, his three decision-record tests and his glossary format verbatim in [GLOSSARY-FORMAT.md](../skills/domain-modeling/GLOSSARY-FORMAT.md), and changes only what a Workbench room needs. The skill lists each change in its own [Workbench adapters](../skills/domain-modeling/SKILL.md#workbench-adapters) section; the reasons, briefly:

| Upstream element | Workbench adaptation | Why |
|---|---|---|
| (absent) | A bounded upstream consequence trace: before a name, boundary or relationship settles, follow it to the vocabulary owner, Specs and acceptance lines, decision records, Wiki pages, source identifiers and tests, and put the few consequences that could change the choice in front of the owner, file and line behind each | This is the owner's use of the skill: seeing downstream impact while still upstream. It is a bounded trace, not a whole-room audit |
| Update the glossary inline when a term resolves | Capture pending meaning, corrections and confirmations in the objective's notepad; settled meaning reaches its owner through `promote` or an authorized `to-docs` pass | A Workbench answer does not enter Canon inline; confirmation settles meaning and promotion writes the owner, so the room diff stays empty while aligning |
| Read and create `GLOSSARY.md` | Read `GLOSSARY.md` when it exists, otherwise the room's current `LEXICON.md` | The glossary migration reaches rooms separately under S-004O; a missing glossary must not be invented |
| Local `docs/adr/` and the upstream ADR format | Offer an ADR or a DDR by the scope test (would the choice still hold if the architecture were rebuilt?), written at Map through `to-docs` and `adr.mjs` into the collections `workbench/manifest.json` declares | The room keeps two decision-record kinds in declared collections with one writing procedure; the upstream ADR format is not carried |
| Create a context map or per-context glossary when needed | Read an existing `GLOSSARY-MAP.md`; never infer or create a map, a second glossary or a local decision-record tree | A parallel store splits the room's meaning; an apparent second context is a question for the owner |
| Surface a code contradiction | Classify it in the `AGENTS.md` State Resolution terms: agreement, documentation drift, implementation gap or unresolved contradiction | The room already classifies source-versus-Canon disagreements that way |
| Invoked when the topic arises | A companion the owner or a caller invokes, never a required step of grilling or the question-card flow | Locked answer GX-2: domain modeling stays available but is not required in that flow |

The skill keeps its source pin and credit in its [Source and credit](../skills/domain-modeling/SKILL.md#source-and-credit) section; the repository's `THIRD_PARTY_NOTICES.md` carries the upstream MIT notice. The rewritten candidate of the superseded [Domain Modeling Skill for the Workbench (S-002H)](../specs/S-002H-domain-modeling-skill/SPEC.md) contributed the consequence-trace idea only; its ADR-only routing and inline Lexicon edits were not adopted.

## A Workbench example

Suppose the owner says, "The Tracker marks a Task complete when its document is aligned." The current [Lexicon](../../LEXICON.md) separates documentation alignment from implementation state. A useful question is whether "complete" means an aligned explanation or an execution slice that passed acceptance. A concrete edge case is a Wiki article that is aligned while the corresponding runtime slice still fails. The trace would name the Lexicon rows, the Task lifecycle owners and the tests that read "complete", before the owner picks.

The modeling result is a clarified concept and visible consequence, saved as pending until the owner confirms it. [The Task Artifact And Its Lifecycle](design-concepts/task-artifact-and-lifecycle.md) explains the execution artifact; the relevant Spec owns whether a particular implementation satisfies it. The conversation cannot manufacture a Task receipt or owner Human QA approval.

## Verified behavior and limits

**Distribution.** Task TK-00JA added the skill to the manifest's required list, the layout's core bundle, the [skills catalog](../skills/README.md) and the count-bearing documents, and added the operations index row. A scoped source test, `tools/test-domain-modeling-skill.mjs`, pins the operating contract, the preserved upstream moves and glossary format and the absence of shadow stores; the catalog, skills-lane and layout tests check distribution. These structural checks prove routing, not conversation.

**Behavior.** Task TK-00JB ran eight fresh-context headless sessions in disposable rooms built from the delivered lane with both adapters installed, against a synthetic invoicing project. The [scenario evidence](../specs/S-004J-required-domain-modeling-skill/proof/scenario-evidence.md) records each run, its observations and room diffs:

| Scenario | Runs | Observed |
|---|---|---|
| Trace a boundary change and a rename before the owner chooses | 1 | Both were traced to the decision record, Lexicon rows, Blueprint lines, Spec acceptance, source identifiers and tests; room diff empty |
| Conflicting term, overloaded term, edge case, behavior claim | 1 | Each drew its own challenge quoting the Lexicon; the claim was run against source and classified as an implementation gap |
| Capture, correction, confirmation, then promotion | 4 (two with the Lexicon, two with a root glossary) | Pending wording, its correction and the confirmation stayed in the notepad; nothing tracked was written until the owner authorized promotion |
| Decision-record offers | 1 | Easily reversed, unsurprising and no-alternative choices were each declined with the failing test named; the qualifying one was offered as a DDR by the scope test; nothing written |
| Grilling without the skill | 1, plus a shadow-store check of all eight rooms | Grilling ran to the owner's stop without loading the skill; no `CONTEXT.md`, `UBIQUITOUS_LANGUAGE.md`, `GLOSSARY-MAP.md` or local `docs/` tree appeared in any room |

**Limits.**

- One model (`claude-opus-5-5`) on one provider, one run per scenario except the capture scenario's four. No reliability rate is claimed.
- Owner turns were scripted and did not answer the agent's questions.
- The sessions were local headless sessions with only project and local settings loaded, not cloud sessions started from a clone.
- **Promotion to a root glossary does not go through the tool yet.** The promote runtime (`workbench/tools/sessions.mjs promote`) refuses a root `GLOSSARY.md` destination because the root owners it accepts are the layout's controls list, which has no glossary. Both glossary-variant runs hit this and applied the confirmed draft by hand after an expected-hash check. The glossary is not yet a delivered root owner in this repository, whose vocabulary owner is still `LEXICON.md`; adding it to the controls belongs to S-004O.
- Joining the core bundle changes the bundle identity, which needs a version label under [Release Identity](../../RUNBOOK.md#release-identity); no release has been assigned to it. That belongs to the release owner.
- S-004J's separate-context review of the assembled Spec and the owner's Human QA had not happened when this page was written; the Spec's own record holds its current state.

## Sources and history

- [Required Domain Modeling Skill (S-004J)](../specs/S-004J-required-domain-modeling-skill/SPEC.md), its [scenario evidence](../specs/S-004J-required-domain-modeling-skill/proof/scenario-evidence.md) and [Lexicon Retirement And ARCHITECTURE.md (S-004O)](../specs/S-004O-lexicon-retirement-and-architecture-md/SPEC.md)
- [The lane skill](../skills/domain-modeling/SKILL.md) and its [glossary format](../skills/domain-modeling/GLOSSARY-FORMAT.md); [Matt Pocock's source at the pin](https://github.com/mattpocock/skills/tree/d81f3a183412e71a5b1e84ca21bc1a35eea03a60/skills/engineering/domain-modeling)
- [Refined Lexicon retirement (DDR-001E)](../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md), [Contract](../../AGENTS.md), [current Lexicon ownership](../../LEXICON.md#artifact-ownership-schema) and [Wiki router](MEMORY.md)
- [Superseded Domain Modeling Skill for the Workbench (S-002H)](../specs/S-002H-domain-modeling-skill/SPEC.md) retains the earlier plan and rationale; [Core Skill Lifecycle And Optional Source Disposition (S-00R)](../specs/S-00R-core-skill-lifecycle-and-optional-source-disposition/SPEC.md) owns retained source disposition

- 2026-09-29: Created on the owner's request for the method comparison and Wiki treatment; no implementation claimed.
- 2026-10-04: Delivery owner repointed from superseded S-002H to Required Domain Modeling Skill (S-004J).
- 2026-10-06: Reconciled the confirmed glossary destination and retained capture boundary; replaced superseded Lexicon-only and inline-write advice with links to the accepted owners.
- 2026-10-07: Reconciled with delivered behavior for S-004J Task TK-00JC: the skill now ships in the lane, so the planned-availability section became separate upstream-method, Workbench-adaptation and verified-behavior sections, drawn from the lane source and the TK-00JB scenario proof.

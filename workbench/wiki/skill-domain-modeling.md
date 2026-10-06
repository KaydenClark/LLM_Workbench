---
type: memory
status: partial
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed Domain Modeling comparison and article, 2026-09-29
  - Matt Pocock public skill and AI Hero guide, retrieved 2026-09-29
source_paths:
  - workbench/specs/S-004J-required-domain-modeling-skill/SPEC.md
  - workbench/specs/S-002H-domain-modeling-skill/SPEC.md
  - skills-pending/domain-modeling/SKILL.md
  - workbench/skills/README.md
  - workbench/skills/grilling/SKILL.md
  - LEXICON.md
  - AGENTS.md
last_verified: 2026-10-04
---

# Domain Modeling: sharpen the Workbench's language as decisions form

Domain modeling is the active practice of noticing when the words in a design conversation hide two meanings, a missing boundary, or a contradiction with the product. The agent challenges the wording while the decision is being made, uses a concrete scenario to test it, and routes the supported result to its proper owner. Looking up an established term in [LEXICON.md](../../LEXICON.md) is ordinary orientation; it does not need this skill.

**Current status:** the Workbench does not ship domain-modeling in its required skills lane. [Grilling](../skills/grilling/SKILL.md) mentions it as an optional companion, and the older [pending source](../../skills-pending/domain-modeling/SKILL.md) is preserved outside discovery. A personal installed adaptation was inspected read-only on 2026-09-29. Its presence does not show that another room can invoke it. The owner settled on 2026-09-29 that domain modeling is a required Workbench skill, used during grilling to see the downstream consequences of a name or boundary while the choice is still upstream. [Required Domain Modeling Skill - S-004J](../specs/S-004J-required-domain-modeling-skill/SPEC.md) now maps its delivery into every room's skills lane; it replaced the superseded [Domain Modeling Skill for the Workbench - S-002H](../specs/S-002H-domain-modeling-skill/SPEC.md) on 2026-10-04, whose Why Retired section gives the reasons. Where the sections below name S-002H (Domain Modeling Skill for the Workbench Spec)'s plan, read them as that superseded plan: in particular, S-004J (Required Domain Modeling Skill Spec) writes no Canon inline from a modeling conversation (settled meaning moves through promotion) and offers an ADR or a DDR by scope. S-004J (Required Domain Modeling Skill Spec)'s delivery reconciles this article. It is not an instruction to edit Canon.

## Goal, place in the workflow, and shape

The goal is a shared domain model precise enough that an owner, agent, reviewer and future reader mean the same thing by a consequential term. The useful output is often one corrected sentence in a conversation, one settled definition, or no new document. A qualifying architectural tradeoff may also produce an ADR.

This is a **candidate reference Primitive**, not a stance or a workflow entry that launches another agent. It can be invoked directly when terminology is the problem. During [grilling](skill-grilling.md), it challenges a concept without taking over the interview or its one-question, pending-readback rhythm. During [to-spec](skill-to-spec.md), it tests names and boundaries so acceptance refers to the right concept. During delivery or review, it checks whether implementation and accepted language still agree. Composition inherits the caller's authority and endpoint. The current lane does not yet ship it; S-004J (Required Domain Modeling Skill Spec) delivers it as a required room skill that grilling still completes without.

| Situation | Modeling move | Durable destination, if any |
|---|---|---|
| Two people use one term for different things | Name both senses and ask which applies here | Shared meaning in Lexicon; scoped meaning in Spec |
| Several words name the same concept | Propose a canonical word and note rejected synonyms | The owning term entry, after agreement and authorization |
| A relationship is vague | Try an edge case that could break the proposed rule | Clarified design in its Spec or working record |
| A statement about current behavior conflicts with source | Show the source and ask whether intent or implementation must change | Gap/drift in the assigned Spec and correct owning documentation |
| A costly architectural tradeoff has been made | Apply all three ADR tests and offer a record | Workbench ADR, plus binding rule in control or Spec |
| The user asks only what a term means | Read the accepted definition | No modeling invocation or write |

## Inputs, outputs, and completion

**Inputs:** the user's current question and authorization; the [ordinary entry route](../../RUNBOOK.md#ordinary-entry); the owning Lexicon/Spec/ADR/Wiki links; and bounded source or tests when a behavior claim is at issue. An existing [notepad](skill-notepad.md) may carry pending interpretations and corrections, but remains provisional context.

**Outputs:** a precise challenge or scenario in the conversation; a named contradiction classified against accepted intent and verified Actuality; and only when authorized, an update to the correct existing owner. It does not create a generic glossary or write every interview answer into Lexicon.

**Done for one modeling question:** the owner and agent have a confirmed meaning, the intended relationship survives an edge case or its remaining uncertainty is named, and any authorized durable update is routed once. If the question remains open, it stays open in the active work owner or note. This does not imply a Spec, implementation, release, or Human QA approval.

## The active moves

1. **Challenge a conflict immediately.** State the accepted definition and the possible new meaning. Ask whether the existing definition, the new use, or two separate concepts are intended. Do not quietly rewrite an established term.
2. **Split an overloaded word.** For example, “account” might name a person who signs in or an organization that buys. Suggest concrete names and ask which role the current sentence refers to. Do not invent the business rule.
3. **Probe a boundary.** If “a Task belongs to a Spec” is stated, ask what happens to a cross-cutting Task whose work is not inside one Spec. The answer may narrow the claim, establish an exception, or remain unresolved. A scenario is a test of understanding, not evidence that a feature exists.
4. **Cross-check behavior.** Follow the smallest [Lexicon route](../../LEXICON.md#task-routing), then inspect the named source and tests. A verified source difference can be documentation drift if code is newer, or an implementation gap if accepted Canon is newer. Unclear ordering is an ambiguity. Quote or link what was checked and let the owner settle a real tradeoff.
5. **Route a settled result.** Define a shared concept in the Lexicon, where a one or two sentence definition should say what it is and can name terms to avoid. Keep capability-specific requirements in the assigned Spec, cross-cutting destination in Blueprint, explanation in the Wiki, and consequential decision rationale in an ADR. The Lexicon also owns the Context Map, so it cannot be reduced to upstream's pure glossary format.

These moves preserve Matt Pocock's active discipline, scenario testing, source contradiction check, and sparse ADR practice. They adapt his glossary destination to this room's existing artifact ownership. [His skill](https://github.com/mattpocock/skills/blob/main/skills/engineering/domain-modeling/SKILL.md) and [guide](https://www.aihero.dev/skills-domain-modeling) describe inline glossary updates as the critical behavior. In this Workbench, “inline” means **during an authorized documentation or delivery pass once meaning is settled**. A grilling-only answer, even after its readback is confirmed, does not itself authorize a Canon edit ([S-00W](../specs/S-00W-concept-grilling-and-notepad-composition/SPEC.md), Desired Behavior 6).

## A Workbench example

Suppose an owner says, “The Tracker marks a Task complete when its document is aligned.” The [Lexicon](../../LEXICON.md) distinguishes Tracker's documentation alignment from Taskboard's implementation state. The modeling move is to pause on “Task complete”: does the owner mean a documented landmark is aligned, or that an implementation Task passed its acceptance and proof? A concrete edge case is a Wiki page that is aligned while its runtime slice still fails.

The agent checks the relevant accepted owner and live source before claiming how either system currently works. In a grilling-only conversation it reads the answer back as pending, waits for explicit confirmation, and preserves the confirmed meaning in the working record. In an authorized documentation pass it edits the exact owning definition or Spec and links the explanatory article if one is needed. It does not set a Task to done, change a Tracker assessment, or manufacture implementation proof from the wording.

## Lexicon discipline and ADR threshold

Matt's current public source uses GLOSSARY.md and, for several contexts, a GLOSSARY-MAP.md. The repository's [preserved earlier source](../../skills-pending/domain-modeling/CONTEXT-FORMAT.md) uses CONTEXT.md and CONTEXT-MAP.md. Both formats favor short definitions, explicit avoided synonyms, and terms specific to the domain. The Workbench already has a root Lexicon that combines accepted terminology with ownership and navigation. S-002H (Domain Modeling Skill for the Workbench Spec) proposes the same concise term discipline inside that owner, without adding a parallel file or erasing the router. Avoid glossary growth into a specification, implementation diary, or scratch pad.

An ADR is **offered only when all three are true**:

1. Reversal would have meaningful cost.
2. The choice would surprise a later reader without its reason.
3. Genuine alternatives were weighed.

A routine, obvious or easy-to-reverse choice stays out of the ADR collection. Matt's [ADR format file](https://github.com/mattpocock/skills/blob/main/skills/engineering/domain-modeling/ADR-FORMAT.md) (upstream ADR format file) deliberately permits a short paragraph. The Workbench uses its own [ADR register and format](../docs/adr/REGISTER.md), active decision status, and operational owner. An ADR explains why a decision was made; the binding requirement lands in the relevant control or assigned Spec in the same authorized work. A proposed answer or a Wiki explanation cannot substitute for either.

## Authority and unresolved meaning

The owner or an assigned work request sets whether this is review, grilling, documentation, specification, or implementation. A skill only supplies a method. A confirmed grilling answer establishes understanding; it is not permission to update Canon. When a contradiction remains, say what each source claims and leave the choice open in the existing work owner or objective note. No temporary note, source file, Wiki page, or ADR proposal outranks the current request and [AGENTS.md](../../AGENTS.md).

The distinction matters at three boundaries:

- **Proposal versus accepted meaning:** propose a clearer term, then wait for agreement before recording it as canonical.
- **Accepted design versus verified Actuality:** source and tests tell what runs; Canon tells what was accepted. Identify drift or gap by their ordering.
- **Rationale versus obligation:** an ADR explains a consequential choice; its required behavior is held in the control or Spec that owns it.

## Upstream comparison and local gaps

The public [AI Hero guide](https://www.aihero.dev/skills-domain-modeling) and [upstream skill](https://github.com/mattpocock/skills/tree/main/skills/engineering/domain-modeling) were read on 2026-09-29. The guide reports two practical issues: automatic companion invocation is unreliable, and glossaries can absorb material that belongs elsewhere. Those are reasons to test direct invocation and composition in a fresh context, and to check that terminology entries stay lean. The public main branch is mutable; S-002H (Domain Modeling Skill for the Workbench Spec) requires pinning an exact revision before implementation claims parity.

| Upstream behavior | Workbench disposition |
|---|---|
| Challenge conflicting or fuzzy words while talking; probe scenarios | Preserve as the core active method |
| Compare what the speaker says with code | Preserve, adding the Workbench's Canon/Actuality classification |
| Write a resolved glossary term immediately | Preserve immediacy only inside an authorized edit; route shared terms to Lexicon and scoped requirements to Spec |
| GLOSSARY.md, optional map, and local ADR directories | Use existing Lexicon Context Map and manifest-declared ADR owners; do not create duplicate roots |
| Short definition with rejected synonyms | Adopt within the current Lexicon's richer routing role |
| Offer an ADR only at the three-part threshold | Preserve, using current Workbench ADR ownership and format |
| Underlying reference used by other skills | Keep composition scoped; distribution is an open owner decision |

The personal installed copy already maps much of the method to Lexicon and ADR paths. It lacks a repository-owned delivery and an exercised behavior result. The preserved pending copy is older and remains historical; its presence in Git is not a live skill. S-002H (Domain Modeling Skill for the Workbench Spec) owns the supported delivery decision and proof, while [S-00R](../specs/S-00R-core-skill-lifecycle-and-optional-source-disposition/SPEC.md) owns the optional-source disposition.

## What proof would show it works

S-002H (Domain Modeling Skill for the Workbench Spec) asks for a fresh-context scenario in which an agent actually interrupts an overloaded term, invents a useful edge case, and cites the source behind a contradiction. Another scenario must show a grilling-only confirmation with no Canon write, followed by a separately authorized documentation request that updates the right owner during the work. The ADR cases must include each failed threshold and a qualifying choice. A skills catalog check can prove discovery links and a Wiki validator can prove route integrity; neither proves conversational judgment.

**Verified for this article on 2026-09-29:** the live catalog, pending source, personal copy, Lexicon, AGENTS, S-00W (Concept Grilling And Notepad Composition Spec), and upstream public source were inspected. No redesigned skill source, agent scenario, installed-room discovery check, or owner Human QA was completed by this planning pass. Pre-existing self-drift findings are reported in the Spec rather than treated as successful update proof.

## Sources and history

- [Delivery Spec](../specs/S-004J-required-domain-modeling-skill/SPEC.md) and its [superseded predecessor](../specs/S-002H-domain-modeling-skill/SPEC.md), [pending source](../../skills-pending/domain-modeling/SKILL.md), and [core catalog](../skills/README.md)
- [Lexicon ownership](../../LEXICON.md#artifact-ownership-schema), [Contract](../../AGENTS.md), [Runbook behavior selection](../../RUNBOOK.md#behavior-selection), and [Wiki router](MEMORY.md)
- [Grilling composition owner](../specs/S-00W-concept-grilling-and-notepad-composition/SPEC.md), [optional-source owner](../specs/S-00R-core-skill-lifecycle-and-optional-source-disposition/SPEC.md), and [ADR register](../docs/adr/REGISTER.md)
- [Matt Pocock's skill](https://github.com/mattpocock/skills/blob/main/skills/engineering/domain-modeling/SKILL.md), [format](https://raw.githubusercontent.com/mattpocock/skills/main/skills/engineering/domain-modeling/GLOSSARY-FORMAT.md), [ADR format file](https://github.com/mattpocock/skills/blob/main/skills/engineering/domain-modeling/ADR-FORMAT.md), and [AI Hero guide](https://www.aihero.dev/skills-domain-modeling)

- 2026-09-29: Created on the owner's explicit request for a Domain Modeling Wiki article and comparison. It records current availability separately from S-002H (Domain Modeling Skill for the Workbench Spec)'s intended behavior; no skill implementation is claimed.
- 2026-10-04: Status repointed to Required Domain Modeling Skill (S-004J) after S-002H (Domain Modeling Skill for the Workbench Spec) was superseded; the owner's required-skill answer recorded; body sections left as the superseded plan until S-004J (Required Domain Modeling Skill Spec) delivery reconciles them.

---
type: memory
status: partial
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed Domain Modeling comparison and article, 2026-09-29
  - Matt Pocock public skill and AI Hero guide, retrieved 2026-09-29
  - Owner answer that domain modeling is a required room skill, 2026-09-29, and S-002H staged candidate and scenario runs, 2026-09-30
  - mattpocock/skills at d81f3a183412e71a5b1e84ca21bc1a35eea03a60, reviewed 2026-09-30
source_paths:
  - workbench/specs/S-002H-domain-modeling-skill/SPEC.md
  - workbench/specs/S-002H-domain-modeling-skill/candidate/domain-modeling/SKILL.md
  - skills-pending/domain-modeling/SKILL.md
  - workbench/skills/README.md
  - workbench/skills/grilling/SKILL.md
  - LEXICON.md
  - AGENTS.md
last_verified: 2026-09-30
---

# Domain Modeling: sharpen the Workbench's language as decisions form

Domain modeling is the active practice of noticing when the words in a design conversation hide two meanings, a missing boundary, or a contradiction with the product. The agent challenges the wording while the decision is being made, uses a concrete scenario to test it, and routes the supported result to its proper owner. Looking up an established term in [LEXICON.md](../../LEXICON.md) is ordinary orientation; it does not need this skill.

**Current status:** domain-modeling is a **required room skill** by the owner's 2026-09-29 answer, but no room can discover it yet. Its Workbench source is staged as an **unreleased candidate** at [candidate/domain-modeling/SKILL.md](../specs/S-002H-domain-modeling-skill/candidate/domain-modeling/SKILL.md) inside [Domain Modeling Skill for the Workbench - S-002H](../specs/S-002H-domain-modeling-skill/SPEC.md), because the v3.2.1 bundle identity is frozen and publication into the skills lane waits for a fresh one from the release owner. Until then the required bundle holds 26 skills without it, [grilling](../skills/grilling/SKILL.md) mentions it only as an optional companion, and a fresh room that finds no domain-modeling skill is reporting the truth. The older [pending source](../../skills-pending/domain-modeling/SKILL.md) stays preserved outside discovery, and a personal installed adaptation is not evidence that another room can invoke it. This article explains the method and the adaptation; it is not an instruction to edit Canon.

## Goal, place in the workflow, and shape

The goal is a shared domain model precise enough that an owner, agent, reviewer and future reader mean the same thing by a consequential term. The useful output is often one corrected sentence in a conversation, one settled definition, or no new document. A qualifying architectural tradeoff may also produce an ADR.

This is a **candidate reference Primitive**, not a stance or a workflow entry that launches another agent. It can be invoked directly when terminology is the problem. During [grilling](skill-grilling.md), it challenges a concept without taking over the interview or its one-question, pending-readback rhythm. During [to-spec](skill-to-spec.md), it tests names and boundaries so acceptance refers to the right concept. During delivery or review, it checks whether implementation and accepted language still agree. Composition inherits the caller's authority and endpoint. The owner's reason for making it required is exactly this upstream placement: during grilling and rework it shows the downstream impact of a name or relationship while the decision is still cheap to change. Whether grilling calls it as a step stays [S-00W](../specs/S-00W-concept-grilling-and-notepad-composition/SPEC.md)'s composition decision.

| Situation | Modeling move | Durable destination, if any |
|---|---|---|
| Two people use one term for different things | Name both senses and ask which applies here | Shared meaning in Lexicon; scoped meaning in Spec |
| Several words name the same concept | Propose a canonical word and note rejected synonyms | The owning term entry, after agreement and authorization |
| A relationship is vague | Try an edge case that could break the proposed rule | Clarified design in its Spec or working record |
| A name or boundary is about to settle upstream | Trace where it lands: Lexicon entries, Spec acceptance, source identifiers, tests, ADRs | The consequences go in front of the owner before the choice; nothing is written by the trace itself |
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
4. **Trace downstream consequences.** Before an upstream name, boundary or relationship settles, follow it to the owners that will read it: Lexicon entries, Spec acceptance lines, source identifiers, tests, ADRs and Wiki articles. Show the owner the few consequences that could change the choice, each with the file behind it. Renaming a person-level term to a group-level one, for example, can silently flip a per-person limit that an ADR, a constant and a test all encode. The trace is bounded; it is not a repository audit.
5. **Cross-check behavior.** Follow the smallest [Lexicon route](../../LEXICON.md#task-routing), then inspect the named source and tests. A verified source difference can be documentation drift if code is newer, or an implementation gap if accepted Canon is newer. Unclear ordering is an ambiguity. Quote or link what was checked and let the owner settle a real tradeoff.
6. **Route a settled result.** Define a shared concept in the Lexicon, where a one or two sentence definition should say what it is and can name terms to avoid. Keep capability-specific requirements in the assigned Spec, cross-cutting destination in Blueprint, explanation in the Wiki, and consequential decision rationale in an ADR. The Lexicon also owns the Context Map, so it cannot be reduced to upstream's pure glossary format.

These moves preserve Matt Pocock's active discipline, scenario testing, source contradiction check, and sparse ADR practice. They adapt his glossary destination to this room's existing artifact ownership. [His skill](https://github.com/mattpocock/skills/blob/main/skills/engineering/domain-modeling/SKILL.md) and [guide](https://www.aihero.dev/skills-domain-modeling) describe inline glossary updates as the critical behavior. In this Workbench, “inline” means **during an authorized documentation or delivery pass once meaning is settled**. A grilling-only answer, even after its readback is confirmed, does not itself authorize a Canon edit ([S-00W](../specs/S-00W-concept-grilling-and-notepad-composition/SPEC.md), Desired Behavior 6).

## A Workbench example

Suppose an owner says, “The Tracker marks a Task complete when its document is aligned.” The [Lexicon](../../LEXICON.md) distinguishes Tracker's documentation alignment from Taskboard's implementation state. The modeling move is to pause on “Task complete”: does the owner mean a documented landmark is aligned, or that an implementation Task passed its acceptance and proof? A concrete edge case is a Wiki page that is aligned while its runtime slice still fails.

The agent checks the relevant accepted owner and live source before claiming how either system currently works. In a grilling-only conversation it reads the answer back as pending, waits for explicit confirmation, and preserves the confirmed meaning in the working record. In an authorized documentation pass it edits the exact owning definition or Spec and links the explanatory article if one is needed. It does not set a Task to done, change a Tracker assessment, or manufacture implementation proof from the wording.

## Lexicon discipline and ADR threshold

Matt's current public source uses GLOSSARY.md and, for several contexts, a GLOSSARY-MAP.md. The repository's [preserved earlier source](../../skills-pending/domain-modeling/CONTEXT-FORMAT.md) uses CONTEXT.md and CONTEXT-MAP.md. Both formats favor short definitions, explicit avoided synonyms, and terms specific to the domain. The Workbench already has a root Lexicon that combines accepted terminology with ownership and navigation. S-002H proposes the same concise term discipline inside that owner, without adding a parallel file or erasing the router. Avoid glossary growth into a specification, implementation diary, or scratch pad.

An ADR is **offered only when all three are true**:

1. Reversal would have meaningful cost.
2. The choice would surprise a later reader without its reason.
3. Genuine alternatives were weighed.

A routine, obvious or easy-to-reverse choice stays out of the ADR collection. Matt's [ADR format](https://github.com/mattpocock/skills/blob/main/skills/engineering/domain-modeling/ADR-FORMAT.md) deliberately permits a short paragraph. The Workbench uses its own [ADR register and format](../docs/adr/REGISTER.md), active decision status, and operational owner. An ADR explains why a decision was made; the binding requirement lands in the relevant control or assigned Spec in the same authorized work. A proposed answer or a Wiki explanation cannot substitute for either.

## Authority and unresolved meaning

The owner or an assigned work request sets whether this is review, grilling, documentation, specification, or implementation. A skill only supplies a method. A confirmed grilling answer establishes understanding; it is not permission to update Canon. When a contradiction remains, say what each source claims and leave the choice open in the existing work owner or objective note. No temporary note, source file, Wiki page, or ADR proposal outranks the current request and [AGENTS.md](../../AGENTS.md).

The distinction matters at three boundaries:

- **Proposal versus accepted meaning:** propose a clearer term, then wait for agreement before recording it as canonical.
- **Accepted design versus verified Actuality:** source and tests tell what runs; Canon tells what was accepted. Identify drift or gap by their ordering.
- **Rationale versus obligation:** an ADR explains a consequential choice; its required behavior is held in the control or Spec that owns it.

## Upstream comparison and local gaps

The public [AI Hero guide](https://www.aihero.dev/skills-domain-modeling) and [upstream skill](https://github.com/mattpocock/skills/tree/main/skills/engineering/domain-modeling) were read on 2026-09-29. The guide reports two practical issues: automatic companion invocation is unreliable, and glossaries can absorb material that belongs elsewhere. Those are reasons to test direct invocation and composition in a fresh context, and to check that terminology entries stay lean. The public main branch is mutable; S-002H requires pinning an exact revision before implementation claims parity.

| Upstream behavior | Workbench disposition |
|---|---|
| Challenge conflicting or fuzzy words while talking; probe scenarios | Preserve as the core active method |
| Compare what the speaker says with code | Preserve, adding the Workbench's Canon/Actuality classification |
| Write a resolved glossary term immediately | Preserve immediacy only inside an authorized edit; route shared terms to Lexicon and scoped requirements to Spec |
| GLOSSARY.md, optional map, and local ADR directories | Use existing Lexicon Context Map and manifest-declared ADR owners; do not create duplicate roots |
| Short definition with rejected synonyms | Adopt within the current Lexicon's richer routing role |
| Offer an ADR only at the three-part threshold | Preserve, using current Workbench ADR ownership and format |
| Underlying reference used by other skills | Required room skill (owner, 2026-09-29); staged unreleased until a fresh bundle identity; composition stays scoped |
| (not upstream) | Adds a bounded downstream-consequence trace before an upstream name or relationship settles |

The staged candidate was adapted from upstream revision `d81f3a18`. The personal installed copy maps much of the method to Lexicon and ADR paths but still instructs an inline Lexicon write without the grilling-only boundary and names a project-local `docs/adr/`; it is optional context, not the source. The preserved pending copy is older and remains historical; its presence in Git is not a live skill. S-002H owns the supported delivery decision and proof, while [S-00R](../specs/S-00R-core-skill-lifecycle-and-optional-source-disposition/SPEC.md) owns the optional-source disposition.

## What the scenarios observed

On 2026-09-30, S-002H [TK-003W](../specs/S-002H-domain-modeling-skill/tasks/TK-003W/TASK.md) ran three scripted conversations in disposable copies of a small Workbench room (a tool-lending library, "Toolshed") with fresh agents. Each script ran twice: once with the staged candidate and once with the preserved pending source. Each agent received only the skill text, the room path and the owner's turns.

**Upstream-naming demo (candidate, grilling-only).** The owner said: rename Member to Account, because under a family plan the account gets the late fee; and the limit is already 3 per household. The agent's first turn:

- Checked the claim against the room: the limit is 3 per **Member** in `src/loans.js`, a test ("another Member of the same Household is counted separately") and ADR-0001. It called the per-household version a new rule that reverses an accepted decision, not a restatement.
- Named the conflict ("account" is already avoided for Member; Household exists) and split the word: the family becomes the borrower, or the family is a new payer above its Members.
- Traced each option downstream before asking anything. The first reaches `memberId`, `MAX_LOANS_PER_MEMBER`, an error message, the tests, two S-001 acceptance lines, ADR-0001 and the Loan and Hold definitions. The second touches one Spec line and one Lexicon entry.
- Asked one question. After the owner confirmed "the Household is charged", it said: "Confirming this settles what we mean, but it doesn't authorize edits". It wrote nothing.

**Authorized documentation pass (candidate).** The agent put the shared-language change in the Lexicon (adding "account" to Household's avoided words). It put the capability term, the new acceptance wording and an unresolved edge case (a Member who moves mid-Loan) in the Spec. It recorded the charging gap as an implementation gap, touched no code and created no glossary file.

**ADR filter (candidate).** Four calls went in: a date display format, the existing test runner, a contract-fixed Loan period and event-sourced Loans. The agent declined the first three, naming the failing test for each. It offered an ADR only for event-sourcing. Once authorized, it used the room's `adr.mjs new` to write into `proposed/`. When separately authorized, it placed the binding rule in the Spec's acceptance criteria.

**What the pending-source runs showed.** Under the same scripts, the older source also challenged the conflict, checked the code, applied the ADR filter and kept writes inside the room's owners. It created no `CONTEXT.md` or root `docs/adr/`. In a Workbench room, the room's own AGENTS, Lexicon and Runbook already carry much of the write boundary and routing. The differences observed were narrower:

- The pending run did not trace the rename's reach into identifiers, tests and Spec lines.
- In the documentation pass it put the charging rule into a new Lexicon term.
- At confirmation it recommended an ADR on the grounds that the owner had weighed an alternative, which the owner never stated.

**Limits.** One run per scenario per source and one model. The owner turns and the rooms were scripted. Agents were handed the skill rather than discovering it. Differences are observations, not a reliability measure. Owner Human QA is separate. A skills catalog check proves discovery links and the Wiki validator proves route integrity; neither proves conversational judgment.

**Verified for this article on 2026-09-30:** the staged candidate and its scoped test, the scenario runs above, the live bundle (26 skills, no domain-modeling) and the pending source bytes. No installed-room discovery exists to verify yet.

## Sources and history

- [Delivery Spec](../specs/S-002H-domain-modeling-skill/SPEC.md), [pending source](../../skills-pending/domain-modeling/SKILL.md), and [core catalog](../skills/README.md)
- [Lexicon ownership](../../LEXICON.md#artifact-ownership-schema), [Contract](../../AGENTS.md), [Runbook behavior selection](../../RUNBOOK.md#behavior-selection), and [Wiki router](MEMORY.md)
- [Grilling composition owner](../specs/S-00W-concept-grilling-and-notepad-composition/SPEC.md), [optional-source owner](../specs/S-00R-core-skill-lifecycle-and-optional-source-disposition/SPEC.md), and [ADR register](../docs/adr/REGISTER.md)
- [Matt Pocock's skill](https://github.com/mattpocock/skills/blob/main/skills/engineering/domain-modeling/SKILL.md), [format](https://raw.githubusercontent.com/mattpocock/skills/main/skills/engineering/domain-modeling/GLOSSARY-FORMAT.md), [ADR format](https://github.com/mattpocock/skills/blob/main/skills/engineering/domain-modeling/ADR-FORMAT.md), and [AI Hero guide](https://www.aihero.dev/skills-domain-modeling)

- 2026-09-29: Created on the owner's explicit request for a Domain Modeling Wiki article and comparison. It records current availability separately from S-002H's intended behavior; no skill implementation is claimed.
- 2026-09-30: Reconciled with the owner's required-distribution answer and the staged unreleased candidate; added the downstream-consequence move and the observed scenario results with their limits.

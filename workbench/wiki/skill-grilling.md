---
type: memory
status: partial
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-accepted concept and S-00W planning, 2026-09-23
source_paths:
  - workbench/specs/S-00W-concept-grilling-and-notepad-composition/SPEC.md
  - skills/grilling/SKILL.md
  - BLUEPRINT.md
last_verified: 2026-09-23
---

# Grilling: arrive at a shared design concept

Use `grilling` when an idea, plan or consequential decision needs a clearer design before specification or execution. Its job is to ask, investigate, challenge and synthesize until the owner and agent can explain the same concept. The owner decides; the agent recommends and checks available facts. Grilling does not itself authorize writing Canon, creating a Spec or implementing the idea.

## The intended conversation

The [accepted design](../specs/S-00W-concept-grilling-and-notepad-composition/SPEC.md) keeps one substantive question in front of the owner at a time:

1. **Question / Recommended answer / Why / Impact.** Offer a concrete recommendation, its reasoning and what choosing it would change.
2. **Owner answer.** Wait. If the answer differs from the recommendation, the owner's meaning takes precedence. An answer can be captured provisionally for continuity without becoming accepted.
3. **Question / Answer / Why / Impact readback.** Restate the actual answer, mark the interpretation pending, and distinguish the owner's stated reason from the agent's inference. Keep clarification on this decision.
4. **Confirmation or correction.** Give the owner a chance to confirm or correct the readback. Revise and read back a correction before proceeding. Silence does not confirm it; no special command is required.
5. **Lock, map, next question.** Only after explicit confirmation, settle the decision, update affected dependencies, then ask the most consequential ready question.

For example, if the agent recommends a public dashboard and the owner chooses a private daily summary, the readback describes the **private summary** and its consequences. The agent does not ask which dashboard charts to build. If the owner corrects “daily” to “weekly,” the corrected readback comes before any next design question.

The working map shows major branches, prerequisites, assumptions and meaningful changes. It is provisional, not a full questionnaire. A settled answer is revisited for a named changed premise, new contradictory evidence or an owner correction; only affected dependent choices reopen. Irrelevant branches drop away. At branch boundaries, the agent explains how the choices fit together rather than reciting a transcript.

The finish is a confirmed concept readback: problem, intended user and experience, scope and exclusions, important concepts and boundaries, meaningful tradeoffs, and a concrete scenario. Unresolved evidence or a choice that could change the concept stays visible. An empty question frontier alone is not completion.

## Composition and current limit

`grilling` is intended to work without persistence. [Notepad](skill-notepad.md) can preserve working context; [grill-me](skill-grill-me.md) is the intended entry point that composes them. Lexicon, domain-modeling and wayfinder may help within the caller's scope, but do not grant new authority.

**Verified current source, 2026-09-23:** [`skills/grilling/SKILL.md`](../../skills/grilling/SKILL.md) embeds notepad mechanics, requests a full question list upfront and selects the next open question. It does not yet enforce the pending-readback confirmation sequence or the dynamic dependency/readiness rules above. The design is planned, not delivered; follow the current executable source for present behavior and the [Spec](../specs/S-00W-concept-grilling-and-notepad-composition/SPEC.md) for the intended change.

## Sources

- [Grilling source](../../skills/grilling/SKILL.md)
- [Concept and acceptance](../specs/S-00W-concept-grilling-and-notepad-composition/SPEC.md)
- [Blueprint: Desired Experience And Behavior](../../BLUEPRINT.md#desired-experience-and-behavior)
- [Wiki router](MEMORY.md)

## History

- 2026-09-23: Created from the accepted design and verified repository source; intended behavior remains separate from implemented behavior.

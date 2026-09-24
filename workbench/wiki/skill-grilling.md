---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-accepted concept and S-00W planning, 2026-09-23
  - S-00X TK-00O source rebuild and fresh-context scenario, 2026-09-24
  - Pinned upstream mattpocock/skills c55ee46073ed923f86ce59a5eb3b6d895095d1b7, retrieved 2026-09-24
source_paths:
  - workbench/skills/grilling/SKILL.md
  - workbench/specs/S-00X-grilling-skill-rebuild/SPEC.md
  - workbench/specs/S-00W-concept-grilling-and-notepad-composition/SPEC.md
  - tools/test-skill-catalog.mjs
  - BLUEPRINT.md
last_verified: 2026-09-24
---

# Grilling: arrive at a shared design concept

Use `grilling` when an idea, plan or consequential decision needs a clearer design before specification or execution. Its job is to ask, investigate, challenge and synthesize until the owner and agent can explain the same concept. The owner decides; the agent recommends and looks up facts itself. Grilling does not itself authorize writing Canon, creating a Spec or implementing the idea.

**Inputs:** a topic or idea from the owner, plus whatever facts the environment can answer. **Output:** a confirmed shared concept, readable in the conversation, and optionally a saved note when the session composes [notepad](skill-notepad.md). **Done when:** the owner confirms the final concept readback. An empty question list alone does not count.

## The conversation

The [accepted design](../specs/S-00W-concept-grilling-and-notepad-composition/SPEC.md) keeps one substantive question in front of the owner at a time. The [current source](../skills/grilling/SKILL.md) states each step:

1. **Question / Recommended answer / Why / Impact.** A concrete recommendation, its reasoning and what choosing it would change.
2. **Owner answer.** The agent waits. Silence never confirms a recommendation, and the owner's meaning wins where it differs.
3. **Question / Answer / Why / Impact readback, marked pending.** The owner's stated reason is kept apart from the agent's inference. Clarifying the same decision is allowed; a new design question is not.
4. **Confirmation or correction.** A correction gets a revised readback. Only explicit confirmation in ordinary words locks it. No special command is needed.
5. **Lock, map, next question.** The agent updates the decision map and asks the most consequential question on the ready frontier: the decisions whose prerequisites are already locked.

The map is provisional, not a questionnaire written up front. A locked answer reopens only for a named changed premise, new contradictory evidence or an owner correction, and then only its dependent decisions reopen. Before any move to specification or execution, the agent gives a final concept readback covering the problem, user and experience, scope and exclusions, concepts and boundaries, tradeoffs and a concrete scenario. It also names any unresolved choice that could still change the concept.

### Example, from the verification run

In the S-00X scenario, the agent recommended that reading-list nudges help the owner *clear* the backlog. The owner answered that nudges are for *reading* and should never suggest throwing things away. The agent read back that answer, not its own recommendation, marked it pending, and asked only whether an archive button was still allowed. The owner corrected two details. The agent revised the readback and asked no new question until the owner said "Yes, that's right". Only then did it lock the answer, show which branches had changed, and ask how the app should detect that an article was read.

## Saved context and composition

The interview works without persistence. When losing the session would impair continuation, which is the ordinary case for a consequential design session, grilling composes [notepad](skill-notepad.md) under the `AGENTS.md` session-record rule. An answer awaiting confirmation is saved as a `source_record` entry with the readback as its interpretation and stays listed as unresolved. The question stays `open`, because genesis intake accepts only `open`, `tentative` and `locked`. Only a `decision` entry records an owner answer. [grill-me](skill-grill-me.md) is the planned entry point that composes both skills by default; its delivery belongs to S-00Z.

Lexicon, `domain-modeling` and `wayfinder` may help within the caller's scope, but grant no new authority. The exits (preserve, promote, specify, hand off, execute) each need an explicit owner direction. Specification comes only after the confirmed final readback.

## Upstream relationship

The skill descends from Matt Pocock's MIT-licensed `grilling` ([notice](../../THIRD_PARTY_NOTICES.md)). It was compared against the pinned source [`mattpocock/skills@c55ee46`](https://github.com/mattpocock/skills/blob/c55ee46073ed923f86ce59a5eb3b6d895095d1b7/skills/productivity/grilling/SKILL.md), retrieved on 2026-09-24.

- **Shared:** a design tree whose settled decisions unblock the ones that depend on them; the agent finds facts and the owner makes decisions; a recommendation with every question; nothing is enacted before the owner confirms a shared understanding.
- **Conceptual drift, deliberate:** upstream asks the *whole* frontier in numbered rounds and calls the session done when the frontier is empty. The Workbench asks one question at a time, reads back every answer before it locks, and requires a confirmed final concept readback, because an empty frontier is not treated as proof. In practice that means more turns and fewer silently misread answers. S-011 TK-005 and the owner-accepted S-00W design record why.
- **Not adopted:** upstream dispatches sub-agents for facts without blocking the rest of the round. The local skill simply requires facts to be looked up first. Whether that costs anything with single-question pacing has not been measured.
- **Uncertainty:** this comparison covers only `SKILL.md` at the pin. A later upstream revision may differ, so repeat the comparison before claiming fidelity to a newer upstream.

## Verified behavior and limits

**Verified 2026-09-24:** the source states the full interaction contract, and `tools/test-skill-catalog.mjs` holds its wording. One fresh-context agent, given only the source, followed the recommendation → pending readback → correction → confirmation → lock → next question order across a six-turn scripted owner conversation. Asked to write the spec early, it wrote nothing. Instead it gave a four-part final concept readback and named four unresolved choices that could change the concept. When the owner then said the app would have no in-app reader, it named that changed premise and reopened only the read-detection decision. The unrelated purpose decision stayed locked. The turn-by-turn record is in the [Spec evidence](../specs/S-00X-grilling-skill-rebuild/SPEC.md#append-only-evidence-and-execution-log).

**Limits:** that was one run with one model, against a scripted owner. It is not owner Human QA and not a repeated trial. Installed personal copies of the skill are not updated by this source change. The shared grilling, notepad and grill-me journey is checked by [S-00W](../specs/S-00W-concept-grilling-and-notepad-composition/SPEC.md) after all three skills are delivered.

## Sources

- [Grilling source](../skills/grilling/SKILL.md)
- [Individual delivery Spec](../specs/S-00X-grilling-skill-rebuild/SPEC.md)
- [Concept and acceptance](../specs/S-00W-concept-grilling-and-notepad-composition/SPEC.md)
- [Blueprint: Desired Experience And Behavior](../../BLUEPRINT.md#desired-experience-and-behavior)
- [Wiki router](MEMORY.md)

## History

- 2026-09-23: Created from the accepted design and verified repository source; intended behavior remains separate from implemented behavior.
- 2026-09-24: Source links reconciled to the managed skills lane; S-00X owns this skill's future delivery. No behavior change claimed.
- 2026-09-24: S-00X TK-00O delivered the interaction contract in the source, recorded the pinned upstream comparison and one fresh-context scenario.

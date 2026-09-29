# S-002H - Domain Modeling Skill for the Workbench

**Spec ID:** S-002H
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-29
**Catalog description:** Make active domain modeling precise and usable through the Workbench's Lexicon, Spec, ADR, Wiki, and authority boundaries.
**Blockers:** The owner must settle whether this is a required room skill or an optional personal extension before distribution changes.
**Latest event:** Owner requested a comparison with Matt Pocock's skill, a bounded delivery Spec, and a Wiki article.
**Next gate:** Resolve distribution and source ownership, then activate and cut Tasks from current Actuality.

## Outcome

An agent can actively sharpen a room's domain model during an authorized design or delivery conversation: challenge conflicting terms, distinguish overloaded concepts, probe relationships with concrete scenarios, and check claims against verified source. Settled meaning reaches the correct Workbench owner without treating a confirmed interview answer as permission to edit Canon. Consequential architectural decisions are offered as ADRs only when they clear the three-part bar. A discoverable skill and its Wiki article explain and exercise this behavior in the distribution mode the owner chooses.

## Why It Matters

Matt Pocock's [skill](https://github.com/mattpocock/skills/blob/main/skills/engineering/domain-modeling/SKILL.md) and [guide](https://www.aihero.dev/skills-domain-modeling) make modeling an active, interrupting practice, not a glossary cleanup at the end. The Workbench's personal adaptation preserves much of that method, but the repository only preserves a pending older source and an optional mention from grilling. A new room cannot assume it can invoke the personal copy. More importantly, the personal instruction to update Lexicon inline when a term resolves can promote an interview answer without the Workbench authorization required by AGENTS and S-00W.

## Current Verified State

Checked on 2026-09-29 against integration commit 86c8fad16b362dbe9d6af3a96dce4fdfba3a77a5 and the named external sources:

- [Preserved pending source](../../../skills-pending/domain-modeling/SKILL.md) uses CONTEXT.md, CONTEXT-MAP.md, local docs/adr, and two format files. It is outside live discovery. The [core skills catalog](../../skills/README.md) marks domain-modeling as an optional reference from grilling, and separately retains the pending directory for an owner disposition. The manifest's required bundle does not include it.
- The personal installed copy, inspected read-only, already substitutes LEXICON.md and a project-local ADR route and retains challenge, scenario, source check, inline update, and the three-part ADR bar. It is not repository-owned portable source; no behavior trial or installation parity was established.
- [LEXICON.md](../../../LEXICON.md) is the accepted shared terminology owner and Context Map, not a pure upstream glossary. Capability-specific meaning stays in its Spec; durable explanation belongs in the [Wiki](../../wiki/MEMORY.md). [ADR records](../../docs/adr/REGISTER.md) carry consequential decision rationale; binding requirements live in their control or assigned Spec.
- [AGENTS.md](../../../AGENTS.md) gives the current request and selected Spec authority, distinguishes accepted Canon from verified Actuality, and requires current-facing self-drift checks. [S-00W](../S-00W-concept-grilling-and-notepad-composition/SPEC.md) explicitly says a settled term in grilling does not authorize a Canon write. [Grilling](../../skills/grilling/SKILL.md) can challenge concepts but does not require this optional skill.
- Upstream's current main skill uses GLOSSARY.md and a glossary map, inline term updates, concrete scenario probes, code cross-checking, and the three-part ADR offer. Its [ADR format](https://github.com/mattpocock/skills/blob/main/skills/engineering/domain-modeling/ADR-FORMAT.md) is intentionally minimal. The linked [guide](https://www.aihero.dev/skills-domain-modeling) reports that automatic invocation is unreliable and glossary growth is a known failure mode. These URLs were retrieved on 2026-09-29; main is mutable and implementation must repin the exact upstream revision it reviews. The repository's preserved copy uses the earlier CONTEXT naming.

## Desired Behavior

1. **Active, scoped entry.** Define when to invoke domain modeling directly or alongside grilling, wayfinding, specification, design, or delivery. Merely reading the Lexicon remains ordinary orientation. The behavior is a reference Primitive, not a stance, independent agent, or new authority. Optional composition must not become a hidden required dependency.
2. **Challenge in the conversation.** On a conflicting term, state the current accepted meaning and ask what the speaker means. On an overloaded word, propose distinct canonical concepts. Probe a relationship with a concrete edge case. Ask one substantive owner question at a time where grilling owns the conversation; preserve the pending readback and correction gate.
3. **Check claims, then classify.** Follow the smallest Lexicon route to relevant Canon, Wiki, ADR, Spec, source, and tests. Quote or link the exact source behind a contradiction. Distinguish a proposed design, accepted requirement, verified implementation, documentation drift, and implementation gap; do not let source silently decide intended meaning or documentation prove runtime.
4. **Route settled meaning.** Use the owning Lexicon for agreed shared terms, the assigned Spec for capability-local meaning and acceptance, the Wiki for durable explanation, and an ADR only for qualifying architectural rationale. Keep definitions concise and about what a concept is; name rejected synonyms or retired terms when useful. Keep requirements, implementation detail, scratch reasoning and task state out of terminology entries. Respect the Lexicon's routing role rather than replacing it with upstream's pure glossary format.
5. **Honor the write boundary.** An authorized documentation or delivery request may produce an inline owner edit as soon as the meaning is settled. In a read-only review or grilling-only conversation, preserve the settled answer in its working record and propose the owner route, but do not edit Canon merely because the answer is confirmed. Unresolved contradictions stay explicitly unresolved. No skill invocation, Wiki page, ADR offer, or note grants scope.
6. **Offer ADRs sparingly.** Require all three upstream tests: meaningful cost to reverse, surprising choice without context, and a real tradeoff. Use the Workbench's registered ADR owner, format, numbering and status. A new ADR records why; the binding rule is maintained in the owning control or Spec in the authorized pass. Do not write a record for routine choices, restatements, or a merely proposed answer.
7. **Ship and explain one coherent skill.** Reconcile repository source, discovery description, optional/core catalog disposition, companion calls, test coverage, attribution, and the routed [skill article](../../wiki/skill-domain-modeling.md). The article must distinguish current behavior from the target and describe workflow placement, inputs, outputs, example, limits, and upstream divergence. If room-core distribution is chosen, update the manifest and skills lane through its established lifecycle; if optional is chosen, preserve a discoverable supported route without pretending every room has it.

## Decisions And Contracts

- The requested endpoint is specification and Wiki explanation. This planning pass does not change a skill source, manifest, installed catalog, or another room.
- This Spec owns the domain-modeling skill capability alone. S-00W owns grilling composition; S-01U owns Lexicon design-concept reconciliation; S-00R owns pending optional-source disposition. Coordinate on those shared surfaces without rewriting their evidence or treating old pending source as live instruction.
- Preserve Matt Pocock's active discipline and three-part ADR filter. Adapt artifact names and authority to this Workbench. The upstream glossary file and ADR template are examples, not new Workbench roots to create.
- No source or structural test alone proves that an agent interrupted at the right moment or interpreted a user correctly. Fresh-context scenario proof and owner Human QA remain distinct gates.

## Non-Goals

- A new GLOSSARY.md, CONTEXT.md, glossary map, tracking store, schema, or decision board for Workbench terminology.
- Rebuilding grilling, notepad, wayfinder, codebase-design, Lexicon reconciliation, or the ADR lifecycle.
- Bulk rewriting existing Lexicon terms or historical ADRs, or inferring approval from a confirmed answer.
- Editing the personal skill catalog, external rooms, release version, or main branch in this planning pass.

## Dependencies And Blockers

The owner must choose between **required room skill** (portable and discoverable in every room, with manifest, lane, update, and compatibility impact) and **optional personal extension** (no every-room guarantee and no required composition). The recommendation is required room skill if the owner's phrase “our Domain Modeling skill” means routine Workbench behavior across rooms; otherwise retain the optional route. Both choices keep the same modeling method and Canon boundary. Inspect S-00R's retained pending-source disposition and the current bundle before implementation. If its owner is writing the same catalog or source lane, coordinate one durable writer.

## Vertical Implementation Slices

No Task is cut while this Spec is planned. At activation, derive small tracer bullets from current Actuality: source and composition, distribution and catalog, a fresh-context behavior trial, and documentation reconciliation as needed.

| Task | Slice | Status | Blockers | Proof |
|---|---|---|---|---|

## Acceptance Criteria

- [ ] A conflicting term and an overloaded term trigger an immediate, specific challenge against the owning Lexicon/Spec; a concrete edge case exposes or resolves a relationship boundary without silently inventing a definition.
- [ ] A stated runtime behavior is checked against named source/tests and classified correctly as agreement, drift, gap, or unresolved contradiction; neither verified code nor the owner's proposed design is silently substituted for the other.
- [ ] In a grilling-only scenario, a confirmed answer remains in the working record and no Canon/ADR write occurs. In an authorized documentation scenario, a settled shared term is updated in the Lexicon during the work; a capability-specific term stays in its Spec and readable explanation goes to the Wiki when warranted.
- [ ] An easily reversed choice, an unsurprising choice, and a choice without a real alternative each fail the ADR offer bar; a qualifying choice is offered and, when authorized, recorded in the Workbench ADR owner with its binding rule in the appropriate control/Spec.
- [ ] The source and catalog state exactly which rooms can discover the skill; no required companion points at an absent skill. Preserved pending source and third-party notice remain recoverable and attributed.
- [ ] The Wiki article and sole router accurately separate upstream method, Workbench adaptation, verified current state, intended behavior, and remaining limitations.
- [ ] Red/green targeted verification for any behavior/source change, Wiki validation, full AGENTS suite, self-drift pre/post and bounded semantic checks, fresh-context scenarios, and separate-context review of an immutable candidate are recorded at their proper gates.

## Testing Seams

The stable seam is a fresh agent context given the skill, room controls, and scripted user turns. Exercise: conflicting terminology during grilling, overload with two meanings, a concrete boundary case, a code-versus-statement discrepancy, authorized and unauthorized Lexicon writes, and each ADR threshold failure plus one qualifying case. Assert observed turns and file diff, not exact prose. Targeted catalog/discovery and Wiki tests check routing and distribution, but cannot prove conversational behavior. Preserve a one-command or short transcript demo at the eventual milestone.

## Verification Procedure

Before source changes, capture guardrail and Workbench self-drift baselines. For each behavior change, demonstrate the expected failure at the nearest stable seam, implement the smallest repair, rerun the targeted check, then the current full suite in AGENTS.md. Run Wiki validation, spec render and doctor, a post self-drift receipt and bounded current-facing semantic review. Record exact candidate SHA, scenario transcripts and limits. Obtain separate-context review before integration; owner Human QA alone determines its own approval state.

## Documentation Impact

This planning pass creates the [individual article](../../wiki/skill-domain-modeling.md) and routes it from the sole Wiki MEMORY. Delivery maintains that page, source and catalog/distribution routes, plus Lexicon, Runbook, controls, template mirrors or ADR register only when their meaning actually changes. Document why an owner needs no change when checked.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-29 | planning | Compared upstream guide/source and format, preserved pending source, read-only personal copy, and live Workbench owners at 86c8fad1; authored planned Spec with no Task | Pre self-drift: machineResult blocked and cleanUpdate false from existing findings; render and doctor succeeded (doctor reported existing attention plus untracked new Spec); Wiki validation passed; test-wiki 13/13 and spec-citation-anchors 3/3 passed; no behavior trial or installed distribution verification claimed | Spec and individual Wiki article authored; sole Wiki router linked and validated | Owner distribution choice, implementation, fresh-context trials, full delivery verification, and independent review remain open |

## Completion Result

Pending. Planning and Wiki creation do not establish delivered skill behavior.

## Remaining Limitations Or Follow-Up Specs

- Upstream main may move; pin its exact revision before implementation or claiming parity with a later revision.
- Current personal installation is outside repository delivery and was inspected read-only; its runtime behavior was not exercised.

## Supersession

- Supersedes: none
- Superseded by: none

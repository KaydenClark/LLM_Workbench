# [PROJECT_NAME] - Lexicon

> Generated from LLM Workbench v[HARNESS_VERSION].

**Last reviewed:** [YYYY-MM-DD]
**Status:** [active / partial / stale]

This is the canonical lookup table for terms whose meaning is shared across the
project. Read it when a request, spec, test, or skill uses project language that
could be ambiguous.

## Ownership Rules

- Add a term only after the parties agree on its meaning.
- Put project-wide definitions here; keep capability-specific terms in the
  owning spec until they become shared.
- Definitions belong here. Requirements and decisions remain in
  `BLUEPRINT.md` or the owning `SPEC.md`.
- Surface conflicts before changing an established definition.
- Link to detailed sources instead of copying them here.

## Workbench Terms

| Term | Definition | Distinction |
|---|---|---|
| **Design concept** | The shared understanding between the parties working on a project about what that project is. | It exists between participants. `BLUEPRINT.md` helps them reconstruct it but is not itself the design concept. |
| **Blueprint** | The compact project artifact that records product direction, principles, cross-cutting architecture, invariants, and non-goals. | It supports the design concept; it is not a PRD, work queue, glossary, or proof archive. |
| **Lexicon** | The canonical lookup table for definitions shared across the project. | It owns meanings, not requirements, implementation decisions, or work status. |
| **Spec** | A stable capability record containing scoped intent, requirements, decisions, implementation slices, acceptance, verification, evidence, and completion. | It combines the useful product and engineering roles often split between a PRD and technical spec. |
| **Ticket** | A temporary, one-context tracer-bullet slice inside a spec that produces independently verifiable progress. | It is execution structure, not durable capability history. |

## Governance Core

Shared by every Workbench. These rows describe roles and boundaries; the
binding behavior lives in `AGENTS.md`, cross-cutting architecture in
`BLUEPRINT.md`, and rationale in the project's `workbench/docs/adr/` collection.

| Term | Definition | Distinction |
|---|---|---|
| **Governance Plane** | The role one claim plays in one operation: **Intent** (the request), **Canon** (the binding current-state rule), **Grounding** (evidence about intended truth or whether work was done correctly), **Enduring Context** (durable reference consulted), **Actuality** (the target being changed, including files, source, runtime, and verified state), and **Projection** (a source-derived report). | Planes classify claims and their use, never whole files, directories, or artifact types. One assigned spec carries Canon, Projection, Grounding, and Enduring Context claims at once. |
| **Workbench Contract** | The logical set of current claims owned by the seven root controls plus the explicitly assigned spec. | It is not a file; no `CONTRACT.md` or other coequal root control exists. |
| **Instruction authority** | What an agent may do: the current owner request, then `AGENTS.md` with platform safety, then the explicitly assigned spec as a bounded capability delegate, then the procedural controls. | An assigned spec cannot enlarge the request, platform safety, or `AGENTS.md` scope; an unassigned spec is evidence. |
| **State resolution** | How a Canon claim and verified Actuality are reconciled: newer Canon is an implementation gap, newer verified Actuality is documentation drift, unclear ordering is an ambiguity to investigate. | Neither "code always wins" nor "Canon proves implementation"; the touched owner is repaired rather than a universal precedence applied. |
| **No-governance-tax rule** | Ordinary owner-directed project work requires only the Workbench Contract and its verification; no coordination system, order form, flight, or external mechanism is a prerequisite. | Available mechanisms a change genuinely needs still apply; the line is availability, not ceremony. |
| **Diagnostic** | A registered finding a Workbench tool emits with a stable code, a severity of `error` or `attention`, a scope, and a blocking effect of `all`, `selection`, `selected-slice`, or `none`. | The consuming command enforces the effect; no artifact chooses whether its own finding blocks. |
| **Support lane** | One of the six manifest-declared slots under lowercase `workbench/`: `docs`, `specs`, `wiki`, `sessions`, `feedback`, `tools`. | A lane is a structural slot, not a plane; the count coincides with the six planes by accident. |
| **Collection** | A manifest-declared, machine-used directory inside a lane: `docs/adr`, `wiki/design-concepts`, `wiki/guidebooks`, `wiki/archive`, `sessions/grilling`, `sessions/handoffs`, `sessions/checkpoints`. | Collections are flat and lowercase; a collection is never promoted to a lane because its contents differ in kind. |
| **ADR** | An architecture decision record in `workbench/docs/adr/`: title, decision, considered alternatives, consequences, provenance, and frontmatter naming the control that carries its rule. | An ADR owns rationale; the rule is binding only where `canonicalized_in` points. |
| **Checkpoint** | A privacy-checked, tracked copy of a live session record promoted into `sessions/checkpoints/`. | Live grilling and handoff records are untracked; an untracked path is not durable evidence. |
| **Design Concept article** | An owner-authorized, encyclopedic wiki article in `wiki/design-concepts/` explaining one durable cross-cutting design model, ending with `Evidence and Sources` and carrying `History`. | It documents a design concept; it is not the Blueprint, an ADR, a procedure, or task state, and agents suggest or repair it but do not create it. |
| **Wiki profile** | The manifest's declared wiki shape: `project` (one room's memory router and collections) or `deployment` (adds owner, machine, and project pointer collections). | A profile declares routing shape; it grants no authority and copies no live task state. |
| **Managed runtime tool** | A file in `workbench/tools/` installed from the Workbench release and listed in the tools receipt with its source release, commit, and hash. | It is updated only by explicit update with backup and rollback; an application's root `tools/` is application-owned. |

## Project Terms

| Term | Definition | Distinction / aliases to avoid |
|---|---|---|
| **[TERM]** | [ONE-SENTENCE DEFINITION] | [WHAT THIS IS NOT OR WHICH ALIASES TO AVOID] |

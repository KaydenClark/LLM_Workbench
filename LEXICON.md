# LLM Workbench - Lexicon

**Last reviewed:** 2026-08-31
**Status:** active

This is the canonical lookup table for shared Workbench language. It helps the
owner and agents recover the same meaning when a term appears across multiple
specs, skills, or conversations.

## Ownership Rules

- Add a term after the parties have agreed on its meaning, not while it is still
  being debated.
- Put project-wide definitions here. Keep capability-specific language in its
  owning spec until it becomes shared.
- Definitions explain what a term means. Requirements and decisions remain in
  `BLUEPRINT.md` or the owning `SPEC.md`.
- Surface a conflict before changing an established definition. Do not silently
  use one term for two concepts or several terms for the same concept.
- Prefer links to the owning artifact over copying its detail into this file.

## Core Terms

| Term | Definition | Distinction |
|---|---|---|
| **Design concept** | The shared understanding between the parties working on a project about what that project is. | It exists between participants. `BLUEPRINT.md` helps them reconstruct it but is not itself the design concept. |
| **Workbench** | The reusable operating harness that gives agents safe rules, progressively disclosed project truth, executable work, and proof requirements. | It governs the workflow; it is not the product being built. |
| **Skill** | A named, reusable behavior that makes an agent follow a predictable process for one kind of work. | A skill is an interaction or execution front door, not a new truth store. |
| **Flow** | A short sequence of skills that moves work from one recognizable state to another. | A flow composes skills; it does not duplicate their instructions. |
| **Router** | A skill that recommends the smallest appropriate skill or flow for the current situation. | It selects work behavior but does not perform the selected behavior automatically. |
| **Blueprint** | The compact project artifact that records product direction, principles, cross-cutting architecture, invariants, and non-goals. | It supports the design concept; it is not a PRD, work queue, glossary, or proof archive. |
| **Lexicon** | The canonical lookup table for definitions shared across the project. | It owns meanings, not requirements, implementation decisions, or work status. |
| **Spec** | A stable capability record containing scoped intent, requirements, decisions, implementation slices, acceptance, verification, evidence, and completion. | It combines the useful product and engineering roles often split between a PRD and technical spec. |
| **Ticket** | A temporary, one-context tracer-bullet slice inside a spec that produces independently verifiable progress. | It is execution structure, not durable capability history. |
| **Hot projection** | The minimal current view of active, blocked, ready, or in-progress work generated from canonical specs. | `TASKBOARD.md` is a projection, not a second tracker or proof archive. |
| **Seam** | A public boundary where behavior can be exercised and verified without depending on implementation details. | Specs agree important testing seams; tests and callers use the same boundary. |
| **Support root** | The lowercase `workbench/` directory whose manifest declares durable support-record paths for a v3 project. | Root controls remain universally discoverable; the support root is not a second control plane. |
| **Core skill bundle** | The closed set of 12 LLM Workbench setup, planning, and delivery skills available as a brand-new-install fallback. | It is not Kayden's private catalog, a generalized marketplace, or a project-local discovery tree. |
| **Normal setup** | Presence-only skill reconciliation during Genesis or Adoption: install a missing core skill when safe and preserve anything already installed. | It never compares or replaces an existing skill and never mutates a foreign Git-owned skill root. |
| **Explicit skill update** | A separately authorized operation that backs up differing installed core skills and synchronizes them to the exact checked-out LLM Workbench versions. | It is the only path that may replace an existing skill; routine setup cannot imply it. |

## Project-Specific Terms

None yet.

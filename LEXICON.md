# LLM Workbench - Lexicon

**Last reviewed:** 2026-09-04
**Status:** active

This is the canonical lookup table for shared Workbench language. It helps the
owner and agents recover the same meaning when a term appears across multiple
specs, skills, or conversations.

## Task Routing

The ordinary entry route is `AGENTS.md` -> `RUNBOOK.md` -> `LEXICON.md`.
Continue to the assigned `SPEC.md` resolved through `workbench/manifest.json`.
Use `BLUEPRINT.md` for architecture and cross-cutting direction; use the
manifest-declared Wiki `MEMORY.md` for task-relevant durable knowledge and the
ADR `REGISTER.md` for decision rationale. Read only the relevant linked owners.
`TASKBOARD.md` is a dashboard, not a prerequisite reading archive.

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
| **Support root** | The lowercase `workbench/` directory whose manifest declares the six support lanes and seven collections of a v3.1 project (schema 2); a schema 1 five-lane manifest migrates once. | Root controls remain universally discoverable; the support root is not a second control plane. |
| **Core skill bundle** | The closed set of twelve workflow skills and four stance skills available as a brand-new-install fallback. | It is not Kayden's private catalog, a generalized marketplace, or a project-local discovery tree. |
| **Normal setup** | Presence-only skill reconciliation during Genesis or Adoption: install a missing core skill when safe and preserve anything already installed. | It never compares or replaces an existing skill and never mutates a foreign Git-owned skill root. |
| **Explicit skill update** | A separately authorized operation that backs up differing installed core skills and synchronizes them to the exact checked-out LLM Workbench versions. | It is the only path that may replace an existing skill; routine setup cannot imply it. |

## Stance Terms

| Term | Definition | Distinction |
|---|---|---|
| **Stance** | The method and obligations for performing one assigned task within already established authority. | It is neither an identity nor an authority grant; switching stance creates no handoff. |
| **Builder** | The stance that delivers a scoped, verified result and maintains its documentation. | Implementation includes relevant review and verification. |
| **Auditor** | The stance that checks claims against named evidence and reports a bounded verdict. | An audit does not authorize repairs or release. |
| **Reviewer** | The stance that challenges a candidate's correctness, impact and evidence. | At integration it runs in a separate context; it does not quietly repair the candidate. |
| **Reconciler** | The stance that reconciles achieved work with the state and owners needed for continuation. | It neither manufactures completion nor duplicates truth in a universal handoff. |
| **TASK** | The assigned ticket within a stable SPEC, carrying its normal stance assignment. | No additional task file or queue is introduced. |

## Governance Core

Design-concept routing: a question about what a product, subsystem, or
relationship *is* starts here, then follows the term to the owner-directed
articles in `workbench/wiki/design-concepts/`; the Blueprint and the assigned
spec still decide when a requirement or verified Actuality matters.

These definitions are shared by every Workbench. They describe roles and
boundaries; the binding behavior lives in `AGENTS.md`, cross-cutting
architecture in `BLUEPRINT.md`, and rationale in the ADR collection.

| Term | Definition | Distinction |
|---|---|---|
| **Governance Plane** | The role one claim plays in one operation: **Intent** (the request), **Canon** (the binding current-state rule), **Grounding** (evidence about intended truth or whether work was done correctly), **Enduring Context** (durable reference consulted), **Actuality** (the target being changed, including files, source, runtime, and verified state), and **Projection** (a source-derived report). | Planes classify claims and their use, never whole files, directories, or artifact types. One assigned spec carries Canon, Projection, Grounding, and Enduring Context claims at once ([ADR-0025](workbench/docs/adr/0025-planes-classify-claims-not-whole-artifacts.md)). |
| **Workbench Contract** | The logical set of current claims owned by the seven root controls plus the explicitly assigned spec. | It is not a file; no `CONTRACT.md` or other coequal root control exists ([ADR-0033](workbench/docs/adr/0033-workbench-contract-is-a-claim-set.md)). |
| **Instruction authority** | What an agent may do: the current owner request, then `AGENTS.md` with platform safety, then the explicitly assigned spec as a bounded capability delegate, then the procedural controls. | An assigned spec cannot enlarge the request, platform safety, or `AGENTS.md` scope; an unassigned spec is evidence ([ADR-0027](workbench/docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md)). |
| **State resolution** | How a Canon claim and verified Actuality are reconciled: newer Canon is an implementation gap, newer verified Actuality is documentation drift, unclear ordering is an ambiguity to investigate. | Neither "code always wins" nor "Canon proves implementation"; the touched owner is repaired rather than a universal precedence applied. |
| **No-governance-tax rule** | Ordinary owner-directed project work requires only the Workbench Contract and its verification; no coordination system, order form, flight, or external mechanism is a prerequisite. | Available mechanisms a change genuinely needs still apply; the line is availability, not ceremony ([ADR-0023](workbench/docs/adr/0023-mechanical-guarantees-and-agent-obligations.md)). |
| **Diagnostic** | A registered finding a Workbench tool emits with a stable code, a severity of `error` or `attention`, a scope, and a blocking effect of `all`, `selection`, `selected-slice`, or `none`. | The consuming command enforces the effect; no artifact chooses whether its own finding blocks ([ADR-0029](workbench/docs/adr/0029-diagnostics-carry-registered-blocking-semantics.md)). |
| **Support lane** | One of the six manifest-declared slots under lowercase `workbench/`: `docs`, `specs`, `wiki`, `sessions`, `feedback`, `tools`. | A lane is a structural slot, not a plane; the count coincides with the six planes by accident ([ADR-0017](workbench/docs/adr/0017-workbench-support-directory-has-six-lanes.md)). |
| **Collection** | A manifest-declared, machine-used directory inside a lane: `docs/adr`, `wiki/design-concepts`, `wiki/guidebooks`, `wiki/archive`, `sessions/grilling`, `sessions/handoffs`, `sessions/checkpoints`. | Collections are flat and lowercase; a collection is never promoted to a lane because its contents differ in kind ([ADR-0018](workbench/docs/adr/0018-the-wiki-is-the-knowledge-base.md)). |
| **ADR** | An architecture decision record in `workbench/docs/adr/`: title, decision, considered alternatives, consequences, provenance, and frontmatter naming the control that carries its rule. | An ADR owns rationale; the rule is binding only where `canonicalized_in` points ([ADR-0002](workbench/docs/adr/0002-binding-rules-stay-in-current-controls.md)). |
| **Checkpoint** | A privacy-checked, tracked copy of a live session record promoted into `sessions/checkpoints/`. | Live grilling and handoff records are untracked; an untracked path is not durable evidence ([ADR-0028](workbench/docs/adr/0028-live-session-records-stay-untracked-and-checkpoints-are-durable.md)). |
| **Design Concept article** | An owner-authorized, encyclopedic wiki article in `wiki/design-concepts/` explaining one durable cross-cutting design model, ending with `Evidence and Sources` and carrying `History`. | It documents a design concept; it is not the Blueprint, an ADR, a procedure, or task state, and agents suggest or repair it but do not create it ([ADR-0030](workbench/docs/adr/0030-every-workbench-declares-a-design-concepts-collection.md)). |
| **Wiki profile** | The manifest's declared wiki shape: `project` (one room's memory router and collections) or `deployment` (adds owner, machine, and project pointer collections). | A profile declares routing shape; it grants no authority and copies no live task state. |
| **Managed runtime tool** | A file in `workbench/tools/` installed from the Workbench release and listed in the tools receipt with its source release, commit, and hash. | It is updated only by explicit update with backup and rollback; an application's root `tools/` is application-owned ([ADR-0031](workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md)). |
| **Managed skill marker** | The `.workbench-skill.json` file the installer or explicit upgrade writes beside an installed core skill, recording (schema 2) the source, the release and commit it came from, and a content hash. | It identifies the generation of an installed copy; a schema 1 marker proves management but names no generation and reads as `skill-generation-unknown`, and doctor only reads it ([S-031](workbench/specs/S-031-installed-skill-generation/SPEC.md)). |

## Project-Specific Terms

| Term | Definition | Distinction |
|---|---|---|
| **v3.0.0** | The completed portable-layout candidate (S-021, S-015) that was never promoted to `main`. | An unreleased internal candidate; v3.1.0 is also preserved and unreleased. S-027 continues that baseline as the v3.1.1 candidate. |
| **Foundry** | The owner's downstream coordination extension that adopts released Workbench versions and adds sockets, modules, scheduling, and monitoring. | Read-only evidence during v3.1; never a source, runtime, or prerequisite for the Workbench ([ADR-0026](workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md)). |

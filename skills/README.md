# Workbench Agent Skills

This folder is the canonical, owner-editable skill library for the Workbench.
It contains the conversational front doors and supporting disciplines Kayden
selected for his workflow. The catalog below owns the selected names and their
plain-language definitions. Only entries marked `Active` live in `skills/` and
are exposed to agent discovery; preserved upstream baselines marked
`Pending rewrite` live in `skills-pending/` until their Workbench rewrite is
reviewed.

## Selected Skill Catalog

`Core rewrite` is the first usable flow. `Supporting rewrite` expands that flow
after its routing agrees with the Workbench contract. `Reference` supplies
vocabulary to other skills. `Native` already belongs to the Workbench rather
than the upstream workflow. Availability is fail-closed: an unfinished rewrite
is preserved but not invocable.

<!-- selected-skills:start -->
| Skill | Definition | Rewrite lane | Availability |
|---|---|---|---|
| `ask-workbench` | Route a situation to the smallest appropriate Workbench skill or flow when the owner does not remember the command. | Native | Active |
| `genesis` | Create a new greenfield project from its founding prompt, establish a private remote recovery boundary, and hand off a verified Workbench scaffold. | Native | Active |
| `adoption` | Migrate an existing project into the Workbench once while preserving code, history, project truth, provenance, and remote recovery. | Native | Active |
| `grilling` | Run the question-at-a-time interview primitive, keeping a running notepad of every decision that `/make-it-so` promotes and `/checkpoint` saves. | Core rewrite | Active |
| `make-it-so` | Confirm approvals and execute — with or without a grilling. Promotes the settled decisions (matching grilling notepad, else the current conversation) to canon via to-docs, to-spec, to-tickets, then implements the tickets with every checkpoint pushed to the remote; invoked explicitly, never from the phrase. | Native | Active |
| `brainstorm` | Run a grilling interview with a counter-argument lens so every recommendation is weighed against its strongest opposing case. | Native | Active |
| `checkpoint` | Save an in-progress grilling notepad as a committed, resumable handoff for another workstation or agent. | Native | Active |
| `grill-me` | Start the question-first interview that develops shared understanding before a spec or plan is written. | Core rewrite | Active |
| `sitrep` | Give a smallest-scope conversational situation report, dispatching read-only Scout research only when the live evidence is insufficient. | Native | Active |
| `to-docs` | Route settled conversation truth into existing Workbench documentation owners without restarting discovery or creating another store. | Native | Active |
| `to-spec` | Synthesize an already-settled conversation into one stable `S-###/SPEC.md` capability record without restarting the interview. | Core rewrite | Active |
| `to-tickets` | Break a spec into one-context tracer-bullet slices with explicit blockers inside the spec's implementation table. | Core rewrite | Active |
| `tracer-bullet` | Cut a capability into vertical tracer-bullet slices that each pierce every layer of a project's stack, then order, scope, and assign them. | Native | Active |
| `wayfinder` | Reduce fog in work too large to specify by resolving one investigation decision at a time toward a named destination. | Supporting rewrite | Pending rewrite |
| `prototype` | Build a reversible, runnable artifact that answers one design question and records the resulting decision. | Core rewrite | Pending rewrite |
| `research` | Investigate a question against primary sources and return cited findings, creating a durable artifact only when the task needs one. | Core rewrite | Pending rewrite |
| `implement` | Claim one eligible slice, use red-green-refactor, review it, update proof and docs, then safely commit and push the task branch. | Core rewrite | Active |
| `tdd` | Drive one behavior at an agreed public seam through a red-green-refactor loop with durable tests. | Core rewrite | Pending rewrite |
| `code-review` | Review a diff separately against repository standards and the owning Workbench spec, reporting actionable findings first. | Core rewrite | Active |
| `diagnosing-bugs` | Establish a tight reproduction loop, prove the root cause, and enter fix mode only when the user requested a fix. | Core rewrite | Pending rewrite |
| `teach` | Teach a topic through a stateful sequence of small lessons grounded in the learner's purpose and prior understanding. | Supporting rewrite | Pending rewrite |
| `writing-great-skills` | Define the authoring vocabulary and pruning rules used to make Workbench skills predictable and maintainable. | Reference | Active |
| `design-an-interface` | Generate and compare meaningfully different public interface shapes before choosing one to implement. | Supporting rewrite | Pending rewrite |
| `ubiquitous-language` | Extract, challenge, and normalize shared project terms, promoting accepted definitions into `LEXICON.md`. | Supporting rewrite | Pending rewrite |
| `resolving-merge-conflicts` | Reconstruct both intents in a merge conflict, preserve compatible behavior, verify the result, and surface irreconcilable product choices. | Supporting rewrite | Pending rewrite |
| `improve-codebase-architecture` | Find high-value opportunities to deepen modules, improve seams, and reduce the amount of context needed to change code safely. | Supporting rewrite | Pending rewrite |
| `setup-pre-commit` | Add project-appropriate commit-time checks without assuming one package manager, formatter, or full-suite policy fits every repository. | Supporting rewrite | Pending rewrite |
| `setup-ts-deep-modules` | Add enforceable TypeScript package boundaries when a project has explicitly chosen the deep-module architecture. | Supporting rewrite | Pending rewrite |
| `codebase-design` | Supply shared engineering vocabulary for modules, interfaces, seams, adapters, depth, leverage, and locality. | Supporting rewrite | Pending rewrite |
| `domain-modeling` | Clarify domain concepts and relationships while routing shared definitions to the Lexicon and scoped decisions to the owning spec. | Supporting rewrite | Pending rewrite |
| `loop-me` | Discover a recurring workflow worth delegating and grill it until an implementable Workbench spec exists. | Supporting rewrite | Pending rewrite |
| `wizard` | Build a human-guided script for repeatable setup or migration steps that cannot be safely automated end to end. | Supporting rewrite | Pending rewrite |
| `update-harness` | Reconcile a project with the current Workbench contract while preserving project truth, provenance, and publication safety. | Native | Active |
<!-- selected-skills:end -->

## Truth Routing

- `LEXICON.md` owns shared definitions used across capabilities.
- `BLUEPRINT.md` owns product direction, architecture, invariants, and non-goals.
- `specs/S-###-slug/SPEC.md` owns scoped requirements, decisions, tickets, and proof.
- `TASKBOARD.md` is only the generated hot projection.
- `RUNBOOK.md` owns commands and operations.

Until a skill's Workbench rewrite lands, its imported upstream behavior stays
under `skills-pending/`, outside the live discovery root. Pending source is
reference material only and cannot be invoked from `ask-workbench`.

## Provenance

The upstream baselines came from
[`mattpocock/skills`](https://github.com/mattpocock/skills) under the MIT
license. The upstream copyright and permission text is retained verbatim in the
[tracked third-party notice](../THIRD_PARTY_NOTICES.md). `ask-workbench` is the Workbench-owned successor to `ask-matt`;
`sitrep`, `to-docs`, and `update-harness` were authored in this repository.
`genesis` and `adoption` are callable entrypoints for the existing one-time
bootstrap protocols; routine migrations between harness versions remain owned
by `update-harness`. `to-docs` replaces the retired `grill-with-docs` wrapper so
interviewing and persistence remain separate. The untouched local snapshot
is retained outside the live discovery path at
`GPT_OS/.agents/upstream-matt-skills-2026-07-14/` for comparison.

## Discovery And Editing

Edit active skills here and promote preserved source from `skills-pending/`
only after its Workbench rewrite passes the catalog contract. GPT_OS exposes this same directory to Claude through
`.claude/skills` and to Codex-compatible discovery through `.agents/skills`.
Downstream projects receive selected skills through the normal harness upgrade
path after their rewrite lane is complete.

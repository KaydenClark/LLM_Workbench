# Workbench Agent Skills

This folder is the canonical, owner-editable skill library for the Workbench.
It contains the conversational front doors and supporting disciplines Kayden
selected for his workflow. The catalog below owns the selected names and their
plain-language definitions; the folder list must match it exactly.

## Selected Skill Catalog

`Core rewrite` is the first usable flow. `Supporting rewrite` remains visible
for editing but must not create a parallel tracker, glossary, decision log, or
Git policy. `Reference` supplies vocabulary to other skills. `Native` already
belongs to the Workbench rather than the upstream workflow.

<!-- selected-skills:start -->
| Skill | Definition | Rewrite lane |
|---|---|---|
| `ask-workbench` | Route a situation to the smallest appropriate Workbench skill or flow when the owner does not remember the command. | Native |
| `genesis` | Create a new greenfield project from its founding prompt, establish a private remote recovery boundary, and hand off a verified Workbench scaffold. | Native |
| `adoption` | Migrate an existing project into the Workbench once while preserving code, history, project truth, provenance, and remote recovery. | Native |
| `grilling` | Ask one decision question at a time, include a recommended answer, research discoverable facts, and stop before implementation. | Core rewrite |
| `grill-me` | Start the question-first interview that develops shared understanding before a spec or plan is written. | Core rewrite |
| `sitrep` | Give a smallest-scope conversational situation report, dispatching read-only Scout research only when the live evidence is insufficient. | Native |
| `to-docs` | Route settled conversation truth into existing Workbench documentation owners without restarting discovery or creating another store. | Native |
| `to-spec` | Synthesize an already-settled conversation into one stable `S-###/SPEC.md` capability record without restarting the interview. | Core rewrite |
| `to-tickets` | Break a spec into one-context tracer-bullet slices with explicit blockers inside the spec's implementation table. | Core rewrite |
| `wayfinder` | Reduce fog in work too large to specify by resolving one investigation decision at a time toward a named destination. | Supporting rewrite |
| `prototype` | Build a reversible, runnable artifact that answers one design question and records the resulting decision. | Core rewrite |
| `research` | Investigate a question against primary sources and return cited findings, creating a durable artifact only when the task needs one. | Core rewrite |
| `implement` | Claim one eligible slice, use red-green-refactor, review it, update proof and docs, then safely commit and push the task branch. | Core rewrite |
| `tdd` | Drive one behavior at an agreed public seam through a red-green-refactor loop with durable tests. | Core rewrite |
| `code-review` | Review a diff separately against repository standards and the owning Workbench spec, reporting actionable findings first. | Core rewrite |
| `diagnosing-bugs` | Establish a tight reproduction loop, prove the root cause, and enter fix mode only when the user requested a fix. | Core rewrite |
| `handoff` | Preserve only the context a fresh session still needs, linking to existing specs, proof, commits, and files instead of duplicating them. | Core rewrite |
| `teach` | Teach a topic through a stateful sequence of small lessons grounded in the learner's purpose and prior understanding. | Supporting rewrite |
| `writing-great-skills` | Define the authoring vocabulary and pruning rules used to make Workbench skills predictable and maintainable. | Reference |
| `design-an-interface` | Generate and compare meaningfully different public interface shapes before choosing one to implement. | Supporting rewrite |
| `ubiquitous-language` | Extract, challenge, and normalize shared project terms, promoting accepted definitions into `LEXICON.md`. | Supporting rewrite |
| `resolving-merge-conflicts` | Reconstruct both intents in a merge conflict, preserve compatible behavior, verify the result, and surface irreconcilable product choices. | Supporting rewrite |
| `improve-codebase-architecture` | Find high-value opportunities to deepen modules, improve seams, and reduce the amount of context needed to change code safely. | Supporting rewrite |
| `setup-pre-commit` | Add project-appropriate commit-time checks without assuming one package manager, formatter, or full-suite policy fits every repository. | Supporting rewrite |
| `setup-ts-deep-modules` | Add enforceable TypeScript package boundaries when a project has explicitly chosen the deep-module architecture. | Supporting rewrite |
| `codebase-design` | Supply shared engineering vocabulary for modules, interfaces, seams, adapters, depth, leverage, and locality. | Supporting rewrite |
| `domain-modeling` | Clarify domain concepts and relationships while routing shared definitions to the Lexicon and scoped decisions to the owning spec. | Supporting rewrite |
| `loop-me` | Discover a recurring workflow worth delegating and grill it until an implementable Workbench spec exists. | Supporting rewrite |
| `wizard` | Build a human-guided script for repeatable setup or migration steps that cannot be safely automated end to end. | Supporting rewrite |
| `update-harness` | Reconcile a project with the current Workbench contract while preserving project truth, provenance, and publication safety. | Native |
<!-- selected-skills:end -->

## Truth Routing

- `LEXICON.md` owns shared definitions used across capabilities.
- `BLUEPRINT.md` owns product direction, architecture, invariants, and non-goals.
- `specs/S-###-slug/SPEC.md` owns scoped requirements, decisions, tickets, and proof.
- `TASKBOARD.md` is only the generated hot projection.
- `RUNBOOK.md` owns commands and operations.

Until a skill's Workbench rewrite lands, its imported upstream behavior is
reference material only. In particular, it must not create `CONTEXT.md`,
`docs/adr/`, `docs/agents/`, `.scratch/`, or a second issue tracker.

## Provenance

The upstream baselines came from
[`mattpocock/skills`](https://github.com/mattpocock/skills) under the MIT
license. `ask-workbench` is the Workbench-owned successor to `ask-matt`;
`sitrep`, `to-docs`, and `update-harness` were authored in this repository.
`genesis` and `adoption` are callable entrypoints for the existing one-time
bootstrap protocols; routine migrations between harness versions remain owned
by `update-harness`. `to-docs` replaces the retired `grill-with-docs` wrapper so
interviewing and persistence remain separate. The untouched local snapshot
is retained outside the live discovery path at
`GPT_OS/.agents/upstream-matt-skills-2026-07-14/` for comparison.

## Discovery And Editing

Edit skills here. GPT_OS exposes this same directory to Claude through
`.claude/skills` and to Codex-compatible discovery through `.agents/skills`.
Downstream projects receive selected skills through the normal harness upgrade
path after their rewrite lane is complete.

---
name: to-spec
description: Turn an already-settled conversation into one stable Workbench capability spec without restarting the interview.
disable-model-invocation: true
---

# To Spec

Synthesize the current already-settled conversation into one
stable `specs/S-###-slug/SPEC.md` capability record. Do not restart grilling or
implement the capability.

1. Verify the project root, nearest controls, existing specs, and relevant source
   or tests. Reuse an existing owning spec when the capability already has one;
   otherwise allocate the next unused stable ID and path.
2. Separate confirmed decisions from assumptions and unresolved owner choices.
   Record unresolved choices as blockers instead of inventing answers.
3. Capture the outcome, why it matters, verified current state, desired behavior,
   decisions/contracts, non-goals, dependencies, acceptance, test seams,
   documentation impact, and append-only evidence structure.
4. Seed `Vertical Implementation Slices` only with the smallest vertical tracer
   bullet needed to make the capability schedulable, cut with the
   `/tracer-bullet` discipline so it pierces every layer of the stack. Use
   `/to-tickets` later for detailed decomposition.
5. Preserve project vocabulary from `LEXICON.md` and cross-cutting boundaries
   from `BLUEPRINT.md`. A spec owns one capability; it replaces neither.
6. Run `node tools/spec-workbench.mjs render` and
   `node tools/spec-workbench.mjs doctor`, then report the spec path, open owner
   gates, and next eligible action.

Do not publish a parallel tracker record, create a transient requirements file,
or claim verification that did not run.

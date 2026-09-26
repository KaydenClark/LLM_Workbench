---
name: to-spec
description: Turn an already-settled conversation into Workbench capability specs, one Spec per capability, without restarting the interview.
---

# To Spec

Synthesize the current already-settled conversation into capability records
at the `specs` lane declared by `workbench/manifest.json` (normally
`workbench/specs/S-###-slug/SPEC.md`): one Spec per capability. When the
conversation settles several capabilities, such as a rebuild of each skill,
author or reuse one Spec for each; never bundle them into one delivery owner.
Do not restart grilling or implement the capability.

1. Verify the project root, nearest controls, existing specs, and relevant source
   or tests. Reuse an existing owning spec when the capability already has one;
   otherwise obtain a read-only proposal with `spec-workbench.mjs next-id --prefix S --json` and write the returned visible ID only within the authorized planning scope. An
   existing Spec's path changes only through `move-spec`.
2. Compose `notepad` before drafting when a handoff or existing working record
   supplies context. Read its entries with correction context and compare them
   with the compact current view and live owners. Correct a stale current view
   through the revision-checked runtime before using or advancing it; a correct
   handoff does not excuse leaving contradictory continuation state behind.
3. Separate confirmed decisions from assumptions and unresolved owner choices.
   Record unresolved choices as blockers instead of inventing answers.
4. Capture the outcome, why it matters, verified current state, desired behavior,
   decisions/contracts, non-goals, dependencies, acceptance, test seams,
   documentation impact, and append-only evidence structure.
5. Author a new Spec at status `planned` with no owner claim, and set the
   normal stance in the SPEC and each TASK during authorized planning, usually
   Builder for implementation; do not make arriving agents select or record
   their own stance. Specifying is not starting: do not `claim`, activate or
   implement the Spec, and record no implementation or verification evidence
   for work that has not happened.
6. Seed `Vertical Implementation Slices` only with the smallest vertical tracer
   bullet needed to make the capability schedulable, cut with the
   `/tracer-bullet` discipline so it pierces every layer of the stack. Use
   `/to-tasks` later for detailed decomposition.
7. Preserve project vocabulary from `LEXICON.md` and cross-cutting boundaries
   from `BLUEPRINT.md`. A spec owns one capability; it replaces neither.
8. Run `node workbench/tools/spec-workbench.mjs render` and
   `node workbench/tools/spec-workbench.mjs doctor`, then report the spec path, open owner
   gates, and next eligible action. Before the voluntary exit, update and read
   back the source working record with the authored spec, remaining open choices
   and exact next action. Confirm the returned revision; preserve originals and
   corrections and retain any active handoff dependency until reconciled.

Do not publish a parallel tracker record, create a transient requirements file,
or claim verification that did not run.

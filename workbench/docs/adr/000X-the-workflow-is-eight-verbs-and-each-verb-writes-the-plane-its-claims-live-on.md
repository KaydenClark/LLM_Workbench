---
date: 2026-10-02
canonicalized_in:
  - LEXICON.md
  - BLUEPRINT.md
---

# The workflow is eight verbs and each verb writes the plane its claims live on

## Decision

The owner confirmed these points in a grilling on 2026-10-02:

1. **The verbs.** The workflow is Idea, Align, Confirm, Map, Plan, Implement,
   Review and Verify, and these are the official workflow verbs everywhere.
   The owner had been calling this the workflow while it kept being called the
   ladder, or the steps.
2. **Journey.** Journey is Map, Plan, Implement, Review and Verify. It is a
   workflow verb because the workflow loops after a journey: Align, Confirm,
   Journey, then Align, Confirm, Journey again. Journey is only the loop-level
   name, not a stage a card can sit at.
3. **Verbs can be passed through.** When there is nothing to map, the workflow
   can move from Confirm to Plan. Review and Verify are not as clean a cut as
   the other verbs: when everything is good to go, nothing is written beyond
   saying so.
4. **The lens.** The Governance Planes are the lens for when a claim is
   written, applied to each claim as the work moves through the workflow. It is
   not black and white and varies a lot, but most of the time Idea and Align
   are Intent, Confirm is Enduring Context, Map and Plan are Grounding,
   Implement is Canon or Actuality, and Review and Verify are Grounding too.
   Confirm does not make something a source of truth and is not something being
   worked on; it declares that something should be durable. Map and Plan create
   evidence and groundwork: claims about Canon and Actuality and what they
   should look like. Implement changes the source of truth, or what the project
   is working on.
5. **Who writes what.** DQCs and Wiki pages are written at Confirm. Landmarks,
   Specs and decision records (ADRs and DDRs) are written at Map. Tasks are
   written at Plan. The Blueprint is written at Implement because it is mostly
   Canon, so it needs Confirm, Map and Plan before it, but it goes through the
   verbs and not through a Spec and Tasks. In the owner's words: "The workflow
   is not ceremony, its process. Its a means to an end."
6. **Why the artifacts differ.** Landmarks, Specs and Tasks are architecture
   artifacts and transient scaffolding, so they need only confirmed enduring
   context behind them and not the whole process. The Blueprint is a durable
   routing artifact.

Considered and rejected: reading the steps as a documentation-only scale (the
owner: "That is our workflow"), and Journey as a stage a card can sit at (the
owner: only the loop level).

## Consequences

This narrows [ADR-000N](000N-landmark-tracker-connects-evolving-understanding-to-durable-knowledge.md):
its documentation steps (Idea, Aligning, Confirmed, Mapped, Planned, Journey,
Review and Verified) are now the workflow verbs, and Journey is not a step. The
rest of ADR-000N stands, including how a step's percentage is computed. It
narrows [ADR-000S](000S-destination-decision-records-are-decision-records-beside-adrs.md)
on when a decision record is created: ADR-000S and the Lexicon's DDR row said a
DDR is born when the owner confirms the decision, and the owner now places the
creation of decision records at Map. It narrows
[ADR-000U](000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md)
point 1: the order there, in which defining a destination creates the
Blueprint, aligning creates DQCs and DDRs and implementing creates Specs and
Tasks, is now the order in point 5 above.

Two agent readings, not the owner's words. First,
[ADR-000G](000G-blueprint-spec-and-task-are-three-altitudes-of-one-delivery-chain.md)
says the Journey lives in a Spec; it uses the word before the owner's
definition, and this record uses Journey as defined above. Second, "routing
artifact" in point 6 is the class the Lexicon's Workbench row names, while
ADR-000S says the Blueprint is not a router to the decision records; the two
statements are about different things.

This record performs no delivery. The Landmark Tracker's step list (`STEPS` in
`workbench/tools/landmark-tracker.mjs`), its tests, its stored cards, the
[Landmark Tracker foundation](../../specs/S-01T-landmark-tracker-foundation/SPEC.md)
and [Landmark Tracker view](../../specs/S-001Z-landmark-tracker-view/SPEC.md)
Specs and the tracker's Wiki page still use the earlier names until the Tracker
work changes them; a mismatch with this decision there is an implementation
gap. The Blueprint's Desired Lifecycle map, which the owner confirmed on
2026-09-24 and which is kept verbatim, is unchanged. `templates/` is not changed
here: the shipped Tracker still uses the earlier step names, so its Lexicon
mirror waits for the Tracker work.

Provenance: owner-confirmed grilling of 2026-10-02 under the objective
"skill-workflow-redesign".

---
date: 2026-10-02
canonicalized_in:
  - LEXICON.md
  - BLUEPRINT.md
---

# The workflow is eight verbs and each verb writes the plane its claims live on

## Decision

The owner confirmed these points in a grilling on 2026-10-02:

1. **The verbs.** Idea, Align, Confirm, Map, Plan, Implement, Review and
   Verify were the owner's first standardization of the workflow verbs, and
   they are official workflow verbs everywhere. The verb set is open: the owner
   defines verbs one at a time, each in its own Lexicon row, and workflows are
   composed from them. The owner had been calling this the workflow while it
   kept being called the ladder, or the steps.
2. **Journey.** Journey is Implement, Check, QA and Submit; Map and Plan come
   before it, and Review comes after it and decides whether another Journey is
   needed. It is a workflow verb because the build repeats until the concept is
   built. Journey is only the loop-level name, not a stage a card can sit at.
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

## Amendment

Amended 2026-10-03 under [ADR-000A](000A-active-adr-decisions-and-destination-blueprints.md)'s
amendment-first rule by the [Workbench Terms And Workflow Verb Rows](../../specs/S-004G-workbench-terms-and-workflow-verbs/SPEC.md)
Spec, because the owner's later answers changed two points above. The earlier
text reads at `git show f2d12337a5511b169c46633ad3377366239b5819:workbench/docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md`.

- Point 1 said the eight verbs were the official workflow verbs. The owner
  said: "why cant we add more workflow verbs? They are verbs. those 8 were our
  first standardization", and "We shouldnt need to Lock in a list. We lock in
  verbs. We use verbs to create workflows." The eight stand as the first
  standardization and the set is open. Prototype, Check, Approve, Delivered and
  Clean Up have since been defined, and the delivery workflow reads Idea,
  Align, Confirm, Map, Plan, Journey, Approve, Delivered, Clean Up. The title
  still reads "eight verbs" and is read as the first eight, because renaming
  the record would break its links.
- Point 2 put Map and Plan inside the Journey. The owner corrected it: "Journey is the build loop." Journey is Implement, Check,
  Review and Verify, and Map and Plan are not part of it.
- Nothing is superseded, because adding verbs replaces nothing. Points 3 to 6
  and the Consequences stand.

Amended 2026-10-05, again, because the owner changed the Journey to correct
per-Task review spending his tokens. The text before this amendment reads at
`git show 4bec733a0246a73b5db05d314f61a4d6bd7de75a:workbench/docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md`.

- Point 2 said Journey is Implement, Check, Review and Verify, repeated. The
  owner: "Instead of Journey being Implement → Check → Review → Verify, It
  should now be Implement → Check → QA → Submit → Review → Verify. We are
  adding a self evaluation and submit step between Check and Review. Check's
  are deterministic verifications that runs in the environment, the QA is a
  self judgement check on the work. And then the review is after the Journey
  is over. It is the deciding factor in if we need to start another Journey."
  QA and Submit are new workflow verbs. The delivery workflow now reads Idea,
  Align, Confirm, Map, Plan, Journey, Review, Verify, Approve, Delivered, Clean
  Up, and a failed Review goes back to Map, Plan and Journey before Verify
  ("if its wrong, we Map, Plan, and Journey again before we can verify").
- Review is an Automated review of a Spec, sometimes a landmark, or the
  Workbench as a whole against its decision records and Blueprint, never of a
  Task: "while reviewing the whole spec, we will find tasks that were not
  done." Points 3 to 6 stand; QA and Submit have no plane assigned.

The Lexicon's Workflow, Journey and verb rows carry the current meanings. The
release proof decision
([A release is proven by the Template building a real product in one pass](../ddr/archive/000Q-a-release-is-proven-by-the-template-building-a-real-product-in-one-pass.md))
still quotes "Idea, Align, Confirm, Journey, Complete", where the owner changed
the last verb to Delivered; it needs a visible correction by its owner, not a
silent edit. This records no owner approval.

Provenance: owner-confirmed grilling of 2026-10-02 under the objective
"skill-workflow-redesign".

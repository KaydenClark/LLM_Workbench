---
date: 2026-10-02
canonicalized_in:
  - LEXICON.md
---

# Landmarks are LANDMARK.md artifacts one size above Specs

## Decision

A landmark becomes a destination-facing architecture artifact, `LANDMARK.md`,
with a visible identifier and the full artifact treatment a `SPEC.md` has. It
is the map one size up: a landmark is basically a Spec with a much larger
scope, PRD-shaped like a Spec, defining a direction toward the destination and
what success looks like. Landmarks and Specs give the direction to the
destination; Tasks are the steps taken in that direction to reach it. The owner
named the gap this fills "specs for specs".

The owner confirmed these points in a grilling on 2026-10-02 and asked for them
to be promoted:

1. **Where landmarks come from.** The owner's workflow: defining a destination
   creates the Blueprint; aligning on it creates Destination Question Cards
   (DQCs) and DDRs; implementing creates Specs and Tasks; new decisions made
   from the implementation update ADRs and DDRs; groupings that form in the DQCs
   and DDRs create landmarks.
2. **The landmark JSON record is retired.** The landmark record was meant to be
   the higher nested DQC; with DDRs and the reworked Wiki it is extra. The
   existing landmark JSON records are transformed into DQCs, because they were
   the way DQCs were nested. DQCs remain the JSON working records.
3. **One parent.** A Spec has at most one parent landmark. A Spec is a smaller,
   scoped destination inside its landmark's destination and never works toward
   more than one destination. Work outside the landmarks, or between them, stays
   under the Blueprint, as Specs do today. Tasks may sit directly under a
   landmark as well as under a Spec. Each DDR belongs to exactly one landmark:
   every impactful decision needs a direction, the landmarks are the direction,
   and the Wiki fills in the remaining gaps. A DDR or Spec with no landmark yet,
   or a cross-cutting one, sits under the Blueprint; the owner's rule for Specs
   covers this, and the agent's reading that the same holds for a DDR made
   before any landmark exists was presented and not contested.
4. **Folders.** Landmarks live in `workbench/landmarks/`. Spec folders nest
   inside their landmark's folder, as Task folders nest inside their Spec's
   folder, and a landmark's direct Tasks nest in the landmark folder. One link
   down the landmark, Spec and Task path then carries every parent.
5. **A lane, not a branch.** A landmark has no branch of its own. Each Spec
   merges into integration as soon as its own review passes, so integration
   stays as current as possible. The whole-landmark review checks what has
   landed on integration against the landmark's destination; a failed landmark
   review is corrected by the corrective-work rules, as a failed Spec review is, rather than
   blocking a merge.
6. **Review one size up.** A landmark is reviewed exactly like a Spec, one size
   up, adding a review layer. Tasks keep their own pull-request review. Before a
   landmark retires it gets a whole-landmark check against its destination and
   what success looks like, then a separate Director review, then the owner's
   approval. The landmark-level check asks whether the direction was reached and
   relies on its child Specs' reviews for their contents, as a Spec relies on
   its Tasks' self-checks. A Spec's verify step includes verifying that all of
   its Tasks were done; a landmark's verify step includes verifying that all of
   its child Specs and Tasks were done, so a landmark cannot retire while a
   child is open.
7. **Authority.** An assigned `LANDMARK.md` is a bounded instruction delegate,
   as an assigned Spec is, so a Task under it can be executed. Like a Spec, it
   cannot enlarge the request, platform safety or the Contract.
8. **Lifecycle.** A `LANDMARK.md` retires into its Landmark Wiki page when its
   destination is reached, as a Spec retires into its feature article.
9. **The Wiki.** `LANDMARK.md` is not the Landmark Wiki page. In the sense of
   the Wiki as evolving synthesis
   ([ADR-000R](000R-the-wiki-is-the-evolving-synthesis-every-agent-reads-and-updates.md)),
   `LANDMARK.md` is the raw source for its Landmark Wiki page, with AGENTS,
   RUNBOOK and LEXICON still the schema. The page may describe how the landmark
   currently is but is not the same document.
10. **The Destination Packet.** The Destination Packet is everything the agent
   needs to determine the destination and direction for its current objective,
   execute in that direction and verify it has reached its destination. It is
   just links on the DQC or the TASK, typically reaching the Blueprint, the
   landmark, the Spec, the Task, a handoff and perhaps a notepad, and needs no
   definition beyond a term for what the agent is given, so we can tell whether
   it got the full packet. There is no second record that tells the agent the
   destination. "Landmark packet" is retired.
11. **The Blueprint split.** This settles what
    [ADR-000S](000S-destination-decision-records-are-decision-records-beside-adrs.md)
    left open about sorting the rest of the existing Blueprint. It splits four
    ways: decisions go to DDRs, each under one landmark or under the Blueprint;
    destination chunks that group several decisions go to `LANDMARK.md`
    artifacts with those DDRs under them; explanations of durable models go to
    design-concept Wiki articles; what remains is one short standalone page,
    written first, saying what the product is, who it serves, its promised
    outcomes and its non-goals. It is not an index and links no record that
    carries an identifier. Material that only restates another owner goes
    nowhere. The owner grills the Blueprint-derived DDR and landmark candidates
    before any Spec drafts them.

Two consequences follow from the points above but were not separately
confirmed: a Spec with no landmark keeps its home in `workbench/specs/`, and a
Spec that gains a landmark is moved into it by the existing link-safe move
operation. The separate review of a landmark comes from a Director context with
no part in that landmark, as prior involvement already rules a participant out
of independent review.

Considered and rejected: a destination part and reached state added to the
landmark JSON record (it keeps the record the owner now calls extra); a separate
transient "landmark packet" record between the Blueprint and Specs (two things
would tell the agent the destination); the Landmark Wiki page as the landmark
itself (the owner keeps the raw source and the synthesis apart); a Spec with
several parent landmarks (it could be steered toward two destinations); Specs
linking to their landmark instead of nesting (the owner chose nesting so one
link carries the whole path); and a landmark branch between its Specs and
integration (it would hold delivered work off integration for weeks and drift).

## Consequences

This narrows [ADR-000G](000G-blueprint-spec-and-task-are-three-altitudes-of-one-delivery-chain.md):
the delivery chain gains the landmark between the Blueprint and the Spec, and
Tasks may sit under a landmark. It narrows
[ADR-000N](000N-landmark-tracker-connects-evolving-understanding-to-durable-knowledge.md):
the flat JSON `landmarks/` records under `workbench/landmark-tracker/` give way
to `LANDMARK.md` artifacts in `workbench/landmarks/`; DQCs, the generated
Tracker and Landmark Wiki pages keep their jobs. It narrows
[ADR-000H](000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md):
its Packet is renamed the Destination Packet and widened to the destination and
direction of the objective. It also narrows the September landmark definition
that landmarks can overlap: they no longer overlap through shared children.
The rest of each record stands.

The root Lexicon states the accepted destination. This record performs no
delivery: the `LANDMARK.md` template and runtime, the `workbench/landmarks/`
collection, nesting and the move support for Specs under a landmark, the
landmark review commands, the Tracker's change of grouping source, the
transformation of the existing landmark records into DQCs, and the template
mirrors belong to a landmark Spec that is not yet authored. Until it lands, the
Tracker's per-landmark grouping and the existing Landmark Wiki pages keep their
current JSON source. `templates/LEXICON.md` is not changed here, because it would
describe an artifact no room has.

Provenance: owner-confirmed grilling of 2026-10-02 under the objective
"ddr-and-control-surface", continuing the decision-record session of
2026-10-01 that produced
[ADR-000S](000S-destination-decision-records-are-decision-records-beside-adrs.md).
The owner's earlier landmark definition of 2026-09-25, which made landmark
files JSON, is superseded for the landmark record only.

## Corrective-work correction

The corrective-work Spec ([S-004F](../../specs/S-004F-corrective-work-rules/SPEC.md)) changes point 5's phrase that a failed landmark review produces corrective Tasks, under ADR-000A's amendment-first rule. The earlier text reads at `git show f91bfd72f41c4b471f1756781649375abb68d158:workbench/docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md`. A miss found by a check follows [the same-Task decision](../ddr/000Y-a-miss-found-by-a-check-continues-the-same-task-unless-the-fix-rewrites-it.md), and a later gap against delivered work follows [the scaffolding decision](../ddr/000M-working-artifacts-are-scaffolding-cleared-away-once-their-knowledge-is-kept.md); this record does not decide which applies to a given landmark finding. The rest of this decision is unchanged.

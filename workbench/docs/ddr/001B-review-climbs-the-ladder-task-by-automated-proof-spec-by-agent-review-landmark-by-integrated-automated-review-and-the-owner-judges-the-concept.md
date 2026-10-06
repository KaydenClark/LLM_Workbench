---
date: 2026-10-05
supersedes:
canonicalized_in:
  - BLUEPRINT.md
  - AGENTS.md
---

# Review climbs the ladder: Task by automated proof, Spec by agent review, Landmark by integrated automated review, and the owner judges the concept

Landmark: Human Attention Minimized.

A Task is proven by automation. A Spec is reviewed by an agent that did not build it. A Landmark is passed by integrated automated review: every child Spec complete, the full suite green on integration, and a Reviewer-stance agent that built none of it reviewing the landmark's own success statement. The owner judges the concept. Human QA moves from the Spec to the landmark; a human steps in earlier only for a decision, a risk, an ambiguity or a failed automated review.

Why the owner chose it:

- The owner, in his own words (2026-10-05): "The model in here with task being automated proof spec being automated review landmark/concept being integrated automated review, I liked that a lot too."
- Asked whether Human QA moves up the ladder (2026-10-05): "For human QA, yes."
- The definition of integrated automated review at the landmark was the agent's reading, presented and confirmed on 2026-10-05.

Considered and rejected: owner Human QA on each delivered Spec, which the review found does not scale with many agents producing many Specs. The owner confirmed the ladder in its place.

Consequences: the owner closure sequence and the Spec-level Human QA gate change; the director and dispatcher skills, the gate tool and the Taskboard projection follow. The two-gate decision ([Work passes two QA gates: spec branch to integration and integration to main](../adr/000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md)) keeps its branch gates and loses the owner at the Spec gate. The landmark review one size up ([Landmarks are LANDMARK.md artifacts one size above Specs](../adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md)) is the rung the owner's judgment sits on.

Provenance: the owner's review of Codex's recommendation, 2026-10-05, items 3 and 5 of the readbacks, confirmed the same day.

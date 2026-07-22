---
name: ask-workbench
description: Route a situation to the smallest appropriate Workbench skill or flow.
disable-model-invocation: true
---

Use the selected catalog in [`../README.md`](../README.md) to recommend one
starting skill and, when useful, the short sequence after it. Ask one question
only when two routes would produce materially different work. Wait for the user
to ask before starting the recommended skill.

Default routes:

- new greenfield project from a founding prompt: `/genesis`;
- existing project adopts the Workbench for the first time: `/adoption`;
- routine harness update for an adopted project: `/update-harness`;
- unclear idea or unresolved product decisions: `/grill-me`;
- concise live orientation: `/sitrep`;
- settled conversation needs updates to existing documentation: `/to-docs`;
- settled conversation needs a durable work packet: `/to-spec`;
- a spec needs executable slices: `/to-tickets`;
- one eligible spec slice is ready for delivery: `/implement`;
- a fixed implementation diff needs independent findings: `/code-review`;
- skill authoring rules are needed: `/writing-great-skills`.
- a large effort still has unresolved decisions: `/wayfinder`;
- focused evidence is needed before a decision: `/research`;
- a design question needs a cheap concrete artifact: `/prototype`;
- shared language is ambiguous or conflicts: `/domain-modeling`;
- one behavior needs a red-green-refactor loop: `/tdd`;
- a defect needs root-cause evidence: `/diagnosing-bugs`;
- a public API shape needs comparison: `/design-an-interface`;
- a merge needs both intents preserved: `/resolving-merge-conflicts`.

The main delivery flow is:

`grill-me -> to-docs or to-spec -> to-tickets -> implement -> code-review`

Recommend the smallest applicable entry marked `Active` in the catalog.

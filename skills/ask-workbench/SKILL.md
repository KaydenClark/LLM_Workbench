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
- skill authoring rules are needed: `/writing-great-skills`.

The main delivery flow is:

`grill-me -> to-docs or to-spec -> to-tickets`

The selected catalog also preserves pending rewrites outside live discovery.
Recommend only entries marked `Active` in the catalog.

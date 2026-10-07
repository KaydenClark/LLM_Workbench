---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Support root
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its third Wiki lexicon batch Task (TK-009J), 2026-10-07: the retiring Lexicon entry's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/manifest.json
  - workbench/docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md
  - workbench/tools/workbench-paths.mjs
last_verified: 2026-10-07
---

# Support root: the lowercase directory every Workbench record lives under

The support root is the lowercase `workbench/` directory beside a room's root files. Its manifest, `workbench/manifest.json`, declares the support lanes and the collections inside them, so every tool finds a Workbench record from one declared place. The canonical definition is the [glossary entry](../../GLOSSARY.md#support-root-and-skills-lane).

The fuller definition: the manifest declares the seven support lanes and declared collections (schema 2; the v3.2 layout adds typed notepads and tracked examples, and [ADR-000M](../docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md) adds the skills lane); a schema 1 five-lane manifest migrates once, and a six-lane schema 2 manifest gains the skills lane through `migrate`.

**What it means here.** The root files remain universally discoverable; the support root is not a second control plane.

**Neighbouring words.** Each of the seven slots it declares is a [Support lane](dictionary-support-lane.md), and each machine-used directory inside a lane is a [Collection](dictionary-collection.md). The seventh lane is the [Skills lane](dictionary-skills-lane.md). The same manifest declares the [Wiki profile](dictionary-wiki-profile.md), the [Declared integration branch](dictionary-declared-integration-branch.md) and the [Workbench connection identity](dictionary-workbench-connection-identity.md). The root files (`AGENTS.md`, `BLUEPRINT.md`, `GLOSSARY.md`, `ARCHITECTURE.md` and the rest) stay outside it.

**In use.** This room's manifest is schema 2 and declares the lanes `docs`, `specs`, `wiki`, `sessions`, `feedback`, `tools` and `skills`, each under `workbench/`, with collections such as `adr` at `workbench/docs/adr` and `notepads` at `workbench/sessions/notepads`. The runtime tools read the manifest through `workbench/tools/workbench-paths.mjs` instead of hard-coding those paths, and the support-root check in the Runbook exercises the layout.

## Sources

- [GLOSSARY.md, Support root and skills lane](../../GLOSSARY.md#support-root-and-skills-lane): the canonical definition.
- [The skills lane decision (ADR-000M)](../docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md): the seventh lane and the migration that adds it.
- [Manifest Schema 2 Lanes And Managed Runtime](features/manifest-schema-2-lanes-and-managed-runtime.md): the feature article on the declared lanes and collections.
- [RUNBOOK.md, V3 support-root check](../../RUNBOOK.md#v3-support-root-check): where the layout is checked.

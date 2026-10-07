---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Managed skill marker
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its third Wiki lexicon batch Task (TK-009J), 2026-10-07: the retiring Lexicon entry's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - tools/skill-marker.mjs
  - workbench/specs/S-031-installed-skill-generation/SPEC.md
last_verified: 2026-10-07
---

# Managed skill marker: the file that names an installed skill's generation

A managed skill marker is the `.workbench-skill.json` file written beside an installed core skill by the installer or an explicit upgrade. At schema 2 it records the source, the release and commit the skill came from, and a content hash. The canonical definition is the [glossary entry](../../GLOSSARY.md#governance-core).

**What it means here.** It identifies the generation of an installed copy; a schema 1 marker proves management but names no generation and reads as `skill-generation-unknown`, and doctor only reads it ([S-031](../specs/S-031-installed-skill-generation/SPEC.md)).

**Neighbouring words.** It marks a skill of the [Core skill bundle](dictionary-core-skill-bundle.md) installed by [Normal setup](dictionary-normal-setup.md) or an [Explicit skill update](dictionary-explicit-skill-update.md). [Core compatibility](dictionary-core-compatibility.md) is judged against the release it names. Its counterpart for tools is the [Managed runtime tool](dictionary-managed-runtime-tool.md) receipt.

**In use.** `tools/skill-marker.mjs` reads and writes the marker beside each installed core skill. A copy whose marker is schema 1 names only its source: it still reads as managed, but nothing in it says which Workbench generation it is.

## Sources

- [GLOSSARY.md, Governance core](../../GLOSSARY.md#governance-core): the canonical definition.
- [Installed Skill Generation (S-031)](../specs/S-031-installed-skill-generation/SPEC.md): the Spec that added the generation.
- [Installed Skill Identity And Inspection](features/installed-skill-identity-and-inspection.md): the feature article.
- [tools/skill-marker.mjs](../../tools/skill-marker.mjs): the marker reader and writer.

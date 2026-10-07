---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Core compatibility
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its third Wiki lexicon batch Task (TK-009J), 2026-10-07: the retiring Lexicon entry's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - tools/core-skill-installer.mjs
  - workbench/wiki/features/core-skill-ownership-and-compatibility.md
last_verified: 2026-10-07
---

# Core compatibility: the declared range a core release supports

Core compatibility is the explicit supported range between one selected installed global core release and the room versions it serves. The canonical definition is the [glossary entry](../../GLOSSARY.md#continuity-and-evidence-boundaries).

**What it means here.** A version difference alone is not proof of incompatibility.

**Neighbouring words.** It concerns the [Core skill bundle](dictionary-core-skill-bundle.md) and the release each [Managed skill marker](dictionary-managed-skill-marker.md) names. It is a declared range, distinct from a [Configured-host capability](dictionary-configured-host-capability.md), which is observed on the host.

**In use.** The Core Skill Ownership And Compatibility Spec (S-051) gave core releases explicit tested ranges, so rooms at different Workbench versions can use the same compatible core release; a missing skill, an incompatible range or a conflicting source stays a visible finding instead of being hidden by replacing skills.

## Sources

- [GLOSSARY.md, Continuity and evidence boundaries](../../GLOSSARY.md#continuity-and-evidence-boundaries): the canonical definition.
- [Core Skill Ownership And Compatibility (S-051)](../specs/S-051-core-skill-ownership-and-compatibility/SPEC.md): the Spec that set the ranges.
- [Core Skill Ownership And Compatibility](features/core-skill-ownership-and-compatibility.md): the feature article.

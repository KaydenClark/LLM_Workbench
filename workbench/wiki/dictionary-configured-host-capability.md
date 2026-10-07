---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Configured-host capability
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its third Wiki lexicon batch Task (TK-009J), 2026-10-07: the retiring Lexicon entry's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - tools/configured-host.mjs
  - workbench/specs/S-053-configured-host-capabilities/SPEC.md
last_verified: 2026-10-07
---

# Configured-host capability: what the actual host was seen to do

A configured-host capability is an operation exercised in the actual host and its configuration, not inferred from fixtures or source. The canonical definition is the [glossary entry](../../GLOSSARY.md#continuity-and-evidence-boundaries).

**What it means here.** It does not establish machine enforcement or model reliability.

**Neighbouring words.** It is evidence about the host, separate from [Core compatibility](dictionary-core-compatibility.md), which is a declared range. A [harness](dictionary-harness.md) discovering a skill and an [agent](dictionary-agent.md) obeying it are separate claims that need their own evidence.

**In use.** `node tools/configured-host.mjs --probe CONFIG.json` runs temporary local probes in the declared lanes: writable lanes, a discoverable skill, the Node runtime running managed tools, the discovery adapter link, and line endings surviving checkout. Its retained local result records four runner checks passing while native discovery and invocation stay unverified.

## Sources

- [GLOSSARY.md, Continuity and evidence boundaries](../../GLOSSARY.md#continuity-and-evidence-boundaries): the canonical definition.
- [Configured Host Capabilities (S-053)](../specs/S-053-configured-host-capabilities/SPEC.md): the Spec that delivered the probes.
- [Configured Host Capabilities](features/configured-host-capabilities.md): the feature article and its limits.

---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Workbench connection identity
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its third Wiki lexicon batch Task (TK-009J), 2026-10-07: the retiring Lexicon entry's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/manifest.json
  - workbench/tools/visible-ids.mjs
  - workbench/tools/workbench-layout.mjs
last_verified: 2026-10-07
---

# Workbench connection identity: a room's namespace for session transport

The Workbench connection identity is the stable namespace chosen for optional private session transport, stored as `workbenchId` in the manifest. The canonical definition is the [glossary entry](../../GLOSSARY.md#continuity-and-evidence-boundaries).

**What it means here.** Clones/worktrees share it; independent initialization assigns a new 128-bit random base-62 namespace. It is distinct from each visible, type-scoped artifact identifier.

**Neighbouring words.** It names the room for [Private session transport](dictionary-private-session-transport.md). A [WBID](dictionary-wbid.md) is a different thing: the visible identifier of one artifact, unique within its type.

**In use.** This room's manifest carries a `workbenchId` of the `WB-` form; this Task's worktree reads the same value as the main checkout because it is the same room. `workbench-layout.mjs` refuses a malformed value with `invalid-workbench-identity` and never silently regenerates it.

## Sources

- [GLOSSARY.md, Continuity and evidence boundaries](../../GLOSSARY.md#continuity-and-evidence-boundaries): the canonical definition.
- [RUNBOOK.md, Optional Private Session Transport](../../RUNBOOK.md#optional-private-session-transport): where the identity is used.
- [Visible Workbench Identifiers](features/visible-workbench-identifiers.md): the artifact identifiers it is distinct from.

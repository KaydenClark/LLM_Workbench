---
status: accepted
date: 2026-09-04
ported_from: GPT_OS ADR-0023 (accepted 2026-09-03)
canonicalized_in:
  - AGENTS.md
---

# Tools check structure; agents carry judgment

Workbench tools verify what is deterministic: root entrypoints, the declared `workbench/` layout, links, paths, manifests, generated views, and stale or duplicate layouts left by a migration. Agents carry what is not: understanding scoped intent, establishing design by conversation, choosing durable records, exercising judgment, doing and testing the work, and reporting honestly. A tool may report; it never manufactures authority.

Consequences: a missing mechanism cannot fail ordinary work; an absent capability is not a finding about the change under evaluation ([ADR-0020](0020-a-check-blocks-only-the-change-it-evaluates.md)). Requiring the available mechanisms a change genuinely needs remains correct; the line is availability, not strictness.

Provenance: faithful sanitized port of a private-workspace decision; the originating worked example concerned a private launch tool and is omitted.

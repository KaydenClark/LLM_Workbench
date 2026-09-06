---
status: accepted
date: 2026-09-04
canonicalized_in:
  - AGENTS.md
---

# Instruction authority is separate from state resolution

Instruction authority answers what an agent may do: the current owner request, then the applicable `AGENTS.md` and platform safety, then the explicitly assigned spec as a bounded capability delegate, then the procedural controls. State resolution answers what is currently implemented: source and tests verified live are compared with Canon claims, and the comparison yields a named condition rather than a winner. Newer Canon means an implementation gap; newer verified Actuality means documentation drift; unclear ordering is an ambiguity to investigate and surface.

Considered and rejected: a single precedence list that placed source above the assigned spec while also saying the spec owns requirements. "Code always wins" erases accepted requirements the code has not reached; "Canon proves implementation" lets prose claim behavior that does not exist.

Consequences: no artifact can broaden scope by being higher in a list; drift is repaired in the touched owner rather than resolved by a universal shortcut; the no-governance-tax rule follows, because ordinary owner-directed work needs no extra ceremony to establish which list applies.

Provenance: owner-reviewed v3.1 greenlight decision, promoted 2026-09-04; see the tracked checkpoint `llm-workbench-v3-1-plan-2026-09-04.md` in the manifest-declared checkpoint collection.

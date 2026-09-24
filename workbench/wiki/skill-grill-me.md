---
type: memory
status: partial
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-accepted concept and S-00W planning, 2026-09-23
source_paths:
  - workbench/specs/S-00Z-grill-me-skill-rebuild/SPEC.md
  - workbench/specs/S-00W-concept-grilling-and-notepad-composition/SPEC.md
  - workbench/skills/grilling/SKILL.md
  - workbench/skills/notepad/SKILL.md
  - skills-archive/optional-active-2026-09-01/grill-me/SKILL.md
  - workbench/manifest.json
last_verified: 2026-09-24
---

# Grill-me: start a saved design inquiry

Use `grill-me` when the owner wants an idea questioned and wants the answers, corrections and next step to survive a pause. The [accepted design](../specs/S-00W-concept-grilling-and-notepad-composition/SPEC.md) makes this a small composition: [grilling](skill-grilling.md) runs the design conversation; [notepad](skill-notepad.md) preserves its working context. Neither skill gains the other's responsibility.

## Intended user experience

The entry point resumes or creates the objective's JSON note, checks its revision and live context, then begins the one-question grilling loop. A question includes a recommended answer, why and impact. The owner's actual answer may be saved as **pending**. The agent reads it back in Question / Answer / Why / Impact form and waits for confirmation or correction. A correction is preserved with its link to the superseded interpretation; after a confirmed readback, the decision can be marked settled, the dependency map updated and the next question asked.

For example, the owner pauses after correcting “daily private summary” to “weekly private summary” but before confirming the revised readback. On resume, `grill-me` retrieves the correction and returns to that pending readback. It does not treat the earlier answer as settled or jump to a question about implementation.

The session ends at the endpoint the owner authorized. A confirmed design concept does not itself create a Spec or authorize execution. Notepad capture remains provisional context, not Canon or proof. Privacy checks, revision-checked writes and correction-aware retrieval remain the existing runtime's job.

## Source and distribution boundary

**Verified current state, 2026-09-24:** The repository's [manifest](../manifest.json) and [core catalog](../skills/README.md) do not list `grill-me` as a current core skill; there is no `workbench/skills/grill-me/SKILL.md`. A preserved [archived wrapper](../../skills-archive/optional-active-2026-09-01/grill-me/SKILL.md) is outside live discovery. A machine-installed personal wrapper was inspected during planning and only invokes grilling; its local path is not a portable source for this article. Repository authoring does not update that installation.

The individual delivery Spec proposes a repository-owned source in the managed skill lane, with catalog and distribution alignment. [S-00V Portable Workbench](../specs/S-00V-portable-workbench/SPEC.md) established that lane; [S-00R](../specs/S-00R-core-skill-lifecycle-and-optional-source-disposition/SPEC.md) retains the archived wrapper's separate disposition. This page explains the intended composition while the current entry point remains unshipped in the repository core.

## Sources

- [Individual delivery Spec](../specs/S-00Z-grill-me-skill-rebuild/SPEC.md)

- [Concept and acceptance](../specs/S-00W-concept-grilling-and-notepad-composition/SPEC.md)
- [Grilling source](../skills/grilling/SKILL.md) and [notepad source](../skills/notepad/SKILL.md)
- [Manifest](../manifest.json) and [core catalog](../skills/README.md)
- [Archived wrapper](../../skills-archive/optional-active-2026-09-01/grill-me/SKILL.md)
- [Wiki router](MEMORY.md)

## History

- 2026-09-23: Created as an individual article for the accepted entry-point design; current and intended sources distinguished.

- 2026-09-24: Source links reconciled to the managed skills lane; S-00Z owns this skill's future delivery. No behavior change claimed.

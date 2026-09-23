---
type: memory
status: partial
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-accepted concept and S-00W planning, 2026-09-23
source_paths:
  - workbench/specs/S-00W-concept-grilling-and-notepad-composition/SPEC.md
  - skills/notepad/SKILL.md
  - workbench/tools/notepads.mjs
  - RUNBOOK.md
last_verified: 2026-09-23
---

# Notepad: preserve one objective's working context

Use `notepad` when meaningful work needs to survive interruption: owner direction, findings, corrections, uncertainty and the next executable action. It is a reusable continuity primitive, including for objectives that have nothing to do with a design interview. A note is provisional context; the current controls and verified source still determine what is true and authorized.

## How it works today

The [skill](../../skills/notepad/SKILL.md) selects or creates one local JSON note for an objective through the [shared runtime](../tools/notepads.mjs). The agent reads the returned revision, saves consequential context promptly with revision-checked writes, and retrieves a topic together with its linked corrections when resuming. Its compact current view names the state, unresolved work and next action. A correction keeps the earlier entry readable rather than rewriting history. Privacy scanning and dependency-aware cleanup protect the record; settled claims reach durable owners through separately authorized promotion. A saved note never proves owner acceptance.

For an unrelated example, a code investigation can save a reproduced failure, the verified source seam and the next check. On resumption, the agent rechecks live code before using that context. No grilling question tree is needed.

## Intended composition with a design interview

The [accepted S-00W design](../specs/S-00W-concept-grilling-and-notepad-composition/SPEC.md) keeps these storage mechanics in `notepad`. [Grill-me](skill-grill-me.md) composes this primitive with [grilling](skill-grilling.md). If an owner answers a recommended design question, that answer may be captured as **pending** for continuity. The agent then reads back the owner's meaning in Question / Answer / Why / Impact form; a correction links to the superseded interpretation. Only explicit confirmation marks the design decision settled. On resume, the note must keep pending and confirmed meaning distinct so the interview returns to the right point.

For example, if an interview stops after a corrected readback but before confirmation, the note preserves both the original interpretation and correction. The next agent resumes the pending confirmation rather than asking the next design question. This is a planned composition rule. The existing runtime and schema remain the intended storage foundation; the Spec proposes no migration or new ledger.

**Verified current limit, 2026-09-23:** The current notepad skill supports revision-checked entries, corrections and resumption. It does not yet explain the new pending-readback versus confirmed-design semantics for `grill-me`. The source may need a narrow wording change; this article does not claim that the composed conversational behavior has been tested.

## Sources

- [Notepad source](../../skills/notepad/SKILL.md) and [runtime](../tools/notepads.mjs)
- [Concept and acceptance](../specs/S-00W-concept-grilling-and-notepad-composition/SPEC.md)
- [Runbook behavior selection](../../RUNBOOK.md#behavior-selection)
- [Wiki router](MEMORY.md)

## History

- 2026-09-23: Created as the individual skill article; current continuity behavior separated from the planned grilling composition.

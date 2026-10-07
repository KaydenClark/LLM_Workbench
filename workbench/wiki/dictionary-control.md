---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Control
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its second Wiki lexicon batch Task (TK-009I), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its review-correction Task (TK-009M), 2026-10-07: the retired alias's distinction from the retiring Lexicon row
source_paths:
  - GLOSSARY.md
  - workbench/docs/ddr/000L-agents-work-the-workbench-through-one-action-controls.md
  - ARCHITECTURE.md
last_verified: 2026-10-07
---

# Control: a one-action tool

A Control is a one-action tool. Agents work the workbench through controls, each
one action, and open the underlying record only to verify a claim, audit, debug
a control, or when a control is missing or disagrees with its record ([the
one-action controls
decision](../docs/ddr/000L-agents-work-the-workbench-through-one-action-controls.md)).
The canonical definition is the [glossary
entry](../../GLOSSARY.md#workbench-room-and-artifacts).

**What it means here.** "Root controls", and "controls" for files, are retired as stale: the files are Contract and routing artifacts. A Control sits beside the Source, tool and test boundary in [ARCHITECTURE.md](../../ARCHITECTURE.md#ownership) (a tool performs an operation) and the Managed runtime tool entry; the dictionary's Tool is not adopted as a Workbench term. The name "Root controls" was retired 2026-10-03: "controls" now means one-action tools (Control). Public names that carry the word keep it until they are renamed on their own: `tools/control-fidelity.mjs`, `tools/test-controls-vocabulary-sweep.mjs` and the Control fidelity entry, and the Ownership Map root control Spec's slug. Historical records keep the old wording.

**Neighbouring words.** The files once called root controls are the [Contract
artifact](dictionary-contract-artifact.md) and the [Routing
artifacts](dictionary-routing-artifact.md). A [Skill](dictionary-skill.md) is
read, not called; a control is called. Most of this room's controls are [managed
runtime tools](dictionary-managed-runtime-tool.md) in `workbench/tools/`, which have their own glossary entry.

**In use.** `node workbench/tools/wiki.mjs validate` is a control: one action
that checks the Wiki and reports its findings. A Worker reaches a Task's state
through `spec-workbench.mjs show` and `claim` rather than by editing `TASK.md`,
and opens the record itself to check a claim the control made or when the
control and the record disagree.

## Sources

- [GLOSSARY.md, Workbench, room and artifacts](../../GLOSSARY.md#workbench-room-and-artifacts): the canonical definition.
- [The one-action controls decision (DDR-000L)](../docs/ddr/000L-agents-work-the-workbench-through-one-action-controls.md): agents work the workbench through controls.
- [ARCHITECTURE.md, Ownership](../../ARCHITECTURE.md#ownership): the Source, tool and test boundary.
- [The runtime tools decision (ADR-0031)](../docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md): runtime tools managed in the tools lane.

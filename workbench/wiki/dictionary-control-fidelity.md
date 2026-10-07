---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Control fidelity
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its third Wiki lexicon batch Task (TK-009J), 2026-10-07: the retiring Lexicon entry's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - tools/control-fidelity.mjs
  - workbench/specs/S-034-control-fidelity-report/SPEC.md
last_verified: 2026-10-07
---

# Control fidelity: how a room's root files relate to their templates

Control fidelity describes how far a room's hand-reconciled root files have moved from the templates they were made from. It is stated line by line by `tools/control-fidelity.mjs report`. The canonical definition is the [glossary entry](../../GLOSSARY.md#support-root-and-skills-lane).

The fuller definition: every template line is `filled` only when its fixed wording survives placeholder substitution, `unchanged`, `dropped`, or `changed`, and every extra room line is `added`, as `tools/control-fidelity.mjs report` states beside the checkout and manifest versions. Given the room's earlier template generation, the report also labels a line only the earlier template carried (`earlier-template`), a current template line the earlier one lacked (`newer-template`) and a kept line the template itself changed (`template-changed`).

**What it means here.** It is a report, never a gate: divergence is legitimate and is restored or recorded as a decision; silent divergence is the defect ([S-034](../specs/S-034-control-fidelity-report/SPEC.md)).

**Neighbouring words.** It compares the root files a room reconciles by hand; skills in the [Skills lane](dictionary-skills-lane.md) are instead replaced whole by an [Explicit skill update](dictionary-explicit-skill-update.md). A divergence the report shows is resolved through [State resolution](dictionary-state-resolution.md): restored, or recorded as a [Decision Record](dictionary-decision-record.md).

**In use.** `node tools/control-fidelity.mjs report --project <room>` reads the room and the release checkout, writes nothing, and prints JSON, or Markdown with `--format markdown`. A room that rewrote a Runbook procedure in its own words shows that line as `changed`; that is legitimate, and the fix for an unexplained one is a recorded decision, not a forced return to the template.

## Sources

- [GLOSSARY.md, Support root and skills lane](../../GLOSSARY.md#support-root-and-skills-lane): the canonical definition.
- [Control Fidelity Report (S-034)](../specs/S-034-control-fidelity-report/SPEC.md): the Spec that delivered the report.
- [Control Fidelity Without Forced Uniformity](features/control-fidelity-without-forced-uniformity.md): the feature article.
- [RUNBOOK.md, Control fidelity report](../../RUNBOOK.md#control-fidelity-report): how to run it.

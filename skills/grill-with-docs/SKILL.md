---
name: grill-with-docs
description: Sharpen a design through a recommendation-led interview, then route the confirmed understanding into existing Workbench documentation owners.
disable-model-invocation: true
---

# Grill With Docs

Apply the core `grilling` discipline in the current chat. Keep tentative
language and unresolved choices in the conversation during the interview.

Only **after explicit confirmation** of the shared design concept, route each
settled truth to its existing owner:

- accepted project-wide definitions -> `LEXICON.md`;
- product direction, cross-cutting architecture, invariants, and non-goals ->
  `BLUEPRINT.md`;
- capability-scoped intent, requirements, decisions, acceptance, and owner
  gates -> the assigned `SPEC.md`;
- active status -> `TASKBOARD.md`, refreshed as a generated projection with
  the lifecycle commands in `RUNBOOK.md`.

State the proposed destinations, update only the owners affected by the
confirmed decisions, and run the documentation checks those owners require. If
capability decisions need a new spec and none is assigned, recommend the
`to-spec` entry point as the next step instead of inventing an unowned file.

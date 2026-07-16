---
name: grill-with-docs
description: Run grilling, then capture confirmed decisions in existing Workbench docs.
disable-model-invocation: true
---

Run a `/grilling` session. After the user confirms the shared understanding,
write only settled decisions to their existing Workbench owners:

- accepted project-wide definitions -> `LEXICON.md`;
- cross-cutting product direction -> `BLUEPRINT.md`;
- capability decisions -> the assigned `SPEC.md`.

If no spec is assigned, recommend `/to-spec` instead of creating one here.

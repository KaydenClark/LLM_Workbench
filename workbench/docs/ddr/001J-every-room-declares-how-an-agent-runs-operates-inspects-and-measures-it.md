---
date: 2026-10-05
supersedes:
canonicalized_in:
  - BLUEPRINT.md
---

# Every room declares how an agent runs, operates, inspects and measures it

Landmark: Agent Visible Runtime.

Every room declares its legibility surface: how an agent runs the product, operates it, inspects its state, sees its errors, exercises the user journey and measures whether it worked. The implementation is the project's own, a browser and logs for a website, requests and traces for an API, fixtures and stdout for a tool, commands, Git state and structured diagnostics for the Workbench itself. The declaration is a manifest block and a doctor check, not a subsystem.

Why the owner chose it:

- Readback item 7, the legibility surface as a manifest block and a doctor check under the Agent Visible Runtime landmark, confirmed by the owner 2026-10-05.

Considered and rejected: a Workbench subsystem that operates products on agents' behalf.

Consequences: a Spec adds the manifest block, the doctor check and the Workbench's own declaration; "claims of done say what actually happened" gains the running product as evidence, not only the repository.

Provenance: the owner's confirmation of 2026-10-05.

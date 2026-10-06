---
date: 2026-10-05
supersedes:
canonicalized_in:
  - AGENTS.md
---

# Maintainer-only procedures live in a directory-scoped AGENTS.md

Landmark: Progressive Disclosure.

Procedures only this repository's maintainers run, such as the release gate, the Template upgrade and the support-root checks, live in an `AGENTS.md` nested in the directory whose tooling they govern. Both hosts load a nested guide by location, so the procedure costs nothing until an agent is working in that directory. The root map points at it. It is not a core skill and never ships to a generated room. One line in the Instruction Authority list says a directory-scoped guide binds while working there.

Why the owner chose it:

- Asked how the OpenAI harness places maintainer-only procedures, the owner was shown that Lopopolo's repository nests editor-only instructions in directory-scoped `AGENTS.md` files loaded only when a task targets that directory, and answered (2026-10-05): "Yes, lets make AGENTS.md like the map."
- Readback item 4, the nested maintainer `AGENTS.md` as the home, confirmed 2026-10-05.

Considered and rejected: the three options the blocked Task recorded: a declared maintainer-skill list excluded by the installer and catalog checks, which changes the closed bundle; leaving the sections in the Runbook, which keeps it large; a tracked maintainer document that is not a skill, which binds nothing.

Consequences: the owner decision the carrier rewrite's maintainer-operations Task waited on is resolved; that Task resumes with this home. The closed core bundle is unchanged.

Provenance: the owner's answer of 2026-10-05 to the question "How does the OpenAI harness do it?", read back and confirmed the same day.

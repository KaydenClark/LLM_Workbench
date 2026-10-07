---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Host portability
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its second Wiki lexicon batch Task (TK-009I), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - RUNBOOK.md
  - workbench/docs/adr/0052-node-javascript-remains-the-portable-runtime.md
last_verified: 2026-10-07
---

# Host portability: the same behavior on every configured machine

Host portability is the property that the Workbench's plain files and tools
behave the same on every configured host: case-sensitive and case-insensitive
filesystems, Windows and POSIX paths, symlinked invocation. The canonical
definition is the [glossary
entry](../../GLOSSARY.md#workbench-room-and-artifacts).

**What it means here.** One thing a Portable Workbench depends on, checked by the Runbook's portability and privacy matrix; it is not the Portable Workbench itself. Here "host" means the machine, not the harness.

**Neighbouring words.** A [Portable Workbench](dictionary-portable-workbench.md)
depends on it. Its machine concerns sit under the
[Filesystem](dictionary-filesystem.md), and the host it means is not the
[Harness](dictionary-harness.md). What a configured host can actually do is a
configured-host capability, which has its own glossary entry.

**In use.** The [portability and privacy
matrix](../../RUNBOOK.md#portability-and-privacy-matrix), a maintainer procedure
in the `workbench-release` skill, checks the release against those host
differences. Node.js stays the runtime so the same tool runs on every such host
([the portable runtime
decision](../docs/adr/0052-node-javascript-remains-the-portable-runtime.md)).

## Sources

- [GLOSSARY.md, Workbench, room and artifacts](../../GLOSSARY.md#workbench-room-and-artifacts): the canonical definition.
- [RUNBOOK.md, Portability and privacy matrix](../../RUNBOOK.md#portability-and-privacy-matrix): the check.
- [The portable runtime decision (ADR-0052)](../docs/adr/0052-node-javascript-remains-the-portable-runtime.md): Node.js remains the runtime.
- [The configured host capability decision (ADR-0053)](../docs/adr/0053-minimum-configured-host-capability-and-evidence-boundaries.md): what a host must be able to do.

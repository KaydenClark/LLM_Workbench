---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Contract artifact
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its second Wiki lexicon batch Task (TK-009I), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - AGENTS.md
  - CLAUDE.md
  - workbench/docs/ddr/001C-agents-md-is-the-map-and-the-only-contract-file.md
  - workbench/docs/ddr/001D-the-runbook-lines-the-workflow-verbs-up-next-to-their-scenarios-and-binds-nothing.md
  - workbench/docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md
last_verified: 2026-10-07
---

# Contract artifact: what the agent pays for on every turn

A Contract artifact is an artifact the agent loads, and pays tokens for, on
every turn of every session: today AGENTS.md, with the host adapter that loads
it. It holds only lines that apply everywhere. The canonical definition is the
[glossary entry](../../GLOSSARY.md#workbench-room-and-artifacts).

**What it means here.** Defined by being loaded every turn, the owner's definition, which does not change because artifacts drifted. The Workbench Contract entry names the binding claim set and its carriers, which is a different thing. The owner first wrote "RUNBOOK is 100% a contract artifact. we can debate lexicon later." and then decided, on 2026-10-05, that `AGENTS.md` is the only Contract file ([one Contract file](../docs/ddr/001C-agents-md-is-the-map-and-the-only-contract-file.md)), that the Runbook stays a file that binds nothing ([the Runbook decision](../docs/ddr/001D-the-runbook-lines-the-workflow-verbs-up-next-to-their-scenarios-and-binds-nothing.md)) and that the Lexicon retires ([the Lexicon retirement](../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md)). The Runbook is read at session entry, not loaded every turn, so it is not a Contract artifact.

**Neighbouring words.** A [Routing artifact](dictionary-routing-artifact.md) is
reached by pointer instead, and a [Context
pointer](dictionary-context-pointer.md) is how the Contract reaches it. The
Workbench Contract, the binding claim set, is a different term with its own
glossary entry. Neither is [Scaffolding](dictionary-scaffolding.md): both are
durable.

**In use.** This room's Contract artifact is `AGENTS.md`; `CLAUDE.md` is the
host adapter that loads it for Claude Code with the single line `@AGENTS.md`.
Because each of its lines is paid for on every turn, a rule that matters only
for one operation lives in the skill `AGENTS.md` points to for that operation.

## Sources

- [GLOSSARY.md, Workbench, room and artifacts](../../GLOSSARY.md#workbench-room-and-artifacts): the canonical definition.
- [One Contract file (DDR-001C)](../docs/ddr/001C-agents-md-is-the-map-and-the-only-contract-file.md): `AGENTS.md` is the only Contract file.
- [The Runbook decision (DDR-001D)](../docs/ddr/001D-the-runbook-lines-the-workflow-verbs-up-next-to-their-scenarios-and-binds-nothing.md): the Runbook binds nothing.
- [The Lexicon retirement (DDR-001E)](../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md): the Lexicon retires.
- [The context cost decision (DDR-001A)](../docs/ddr/001A-an-agent-pays-context-only-for-information-that-can-change-what-it-does-next.md): an agent pays context only for what can change its next step.

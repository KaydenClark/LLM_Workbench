---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: No-governance-tax rule
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its third Wiki lexicon batch Task (TK-009J), 2026-10-07: the retiring Lexicon entry's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/docs/adr/0023-mechanical-guarantees-and-agent-obligations.md
last_verified: 2026-10-07
---

# No-governance-tax rule: ordinary work needs only the Contract

The no-governance-tax rule says that ordinary owner-directed project work needs only the Workbench Contract and its verification. No coordination system, order form, flight or other external mechanism is a prerequisite. The canonical definition is the [glossary entry](../../GLOSSARY.md#governance-core).

**What it means here.** Available mechanisms a change genuinely needs still apply; the line is availability, not ceremony ([ADR-0023](../docs/adr/0023-mechanical-guarantees-and-agent-obligations.md)).

**Neighbouring words.** It limits what the [Workbench Contract](dictionary-workbench-contract.md) may demand of ordinary work. The [Foundry](dictionary-foundry.md)'s coordination machinery is augmentation a room never needs to do its work.

**In use.** An owner who asks for a one-line correction in `README.md` gets the edit on a prefixed branch and its checks, as `AGENTS.md` requires, with no Spec, Task claim or Grill Board item first. A change that genuinely touches a Spec's capability still follows that Spec, because the mechanism is available and the change needs it.

## Sources

- [GLOSSARY.md, Governance core](../../GLOSSARY.md#governance-core): the canonical definition.
- [The mechanical guarantees decision (ADR-0023)](../docs/adr/0023-mechanical-guarantees-and-agent-obligations.md): the line between guarantees and obligations.

---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: State resolution
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its third Wiki lexicon batch Task (TK-009J), 2026-10-07: the retiring Lexicon entry's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - AGENTS.md
  - workbench/docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md
last_verified: 2026-10-07
---

# State resolution: reconciling Canon with verified Actuality

State resolution is how a Canon claim and verified Actuality are reconciled when they disagree. If Canon is newer, the gap is in the implementation; if verified Actuality is newer, the documentation has drifted; if the order is unclear, it is an ambiguity to investigate. The canonical definition is the [glossary entry](../../GLOSSARY.md#governance-core).

**What it means here.** Neither "code always wins" nor "Canon proves implementation"; the touched owner is repaired rather than a universal precedence applied.

**Neighbouring words.** It works on claims classified by [Governance Plane](dictionary-governance-plane.md), and it is separate from [Instruction authority](dictionary-instruction-authority.md). The [Reconciler](dictionary-reconciler.md) stance applies it; [Control fidelity](dictionary-control-fidelity.md) reports the divergences it then resolves.

**In use.** The owner's one-Contract-file decision is newer Canon than `AGENTS.md` Instruction Authority, which still names `LEXICON.md` as a carrier. That is an implementation gap, owned by the Contract Carrier Pointer-Brief Rewrite, so its owner is repaired; the old list does not overrule the decision, and the decision does not prove the list already changed.

## Sources

- [GLOSSARY.md, Governance core](../../GLOSSARY.md#governance-core): the canonical definition.
- [The instruction authority decision (ADR-0027)](../docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md): state resolution is separate from authority.
- [AGENTS.md, State Resolution](../../AGENTS.md#state-resolution): the operative rule.

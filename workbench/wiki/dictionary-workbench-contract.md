---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Workbench Contract
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its third Wiki lexicon batch Task (TK-009J), 2026-10-07: the retiring Lexicon entry's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - AGENTS.md
  - workbench/docs/ddr/001C-agents-md-is-the-map-and-the-only-contract-file.md
  - workbench/docs/adr/000C-the-workbench-contract-is-the-obligation-claim-set-carried-by-three-root-controls-and-the-assigned-spec.md
last_verified: 2026-10-07
---

# Workbench Contract: the binding claim set AGENTS.md names

The Workbench Contract is the set of binding claims that `AGENTS.md` Instruction Authority names: `AGENTS.md` itself, the assigned Spec's bounded capability requirements, and, while an operation is performed, the binding requirements of the lane skill the Contract points to for it. The canonical definition is the [glossary entry](../../GLOSSARY.md#governance-core).

**What it means here.** The owner decided `AGENTS.md` is the only Contract file and binding runs from it straight to the skill it names ([one Contract file](../docs/ddr/001C-agents-md-is-the-map-and-the-only-contract-file.md)); its Instruction Authority list still names `RUNBOOK.md` as the other carrier until the [Contract Carrier Pointer-Brief Rewrite](../specs/S-004C-contract-carrier-pointer-brief-rewrite/SPEC.md) moves it to that decision. It is not a file; other root artifacts are routed by intent, and no `CONTRACT.md` exists ([ADR-000C](../docs/adr/000C-the-workbench-contract-is-the-obligation-claim-set-carried-by-three-root-controls-and-the-assigned-spec.md)).

**Neighbouring words.** [Instruction authority](dictionary-instruction-authority.md) is the order in which the Contract's carriers instruct. The [No-governance-tax rule](dictionary-no-governance-tax-rule.md) says ordinary work needs only the Contract and its verification. A lane skill joins the Contract only for its operation ([Skills lane](dictionary-skills-lane.md)).

**In use.** While a Worker carries out its Task, its Contract is `AGENTS.md`, the assigned Spec's bounded requirements and the lane skill the Contract points to for that operation, such as the [implement skill](../skills/implement/SKILL.md) for Task work. Item 4 of `AGENTS.md` Instruction Authority still reads "`RUNBOOK.md` as the other Contract carrier", which is the gap described above.

## Sources

- [GLOSSARY.md, Governance core](../../GLOSSARY.md#governance-core): the canonical definition.
- [The one-Contract-file decision (DDR-001C)](../docs/ddr/001C-agents-md-is-the-map-and-the-only-contract-file.md): `AGENTS.md` is the map and the only Contract file.
- [The Workbench Contract decision (ADR-000C)](../docs/adr/000C-the-workbench-contract-is-the-obligation-claim-set-carried-by-three-root-controls-and-the-assigned-spec.md): the Contract is a claim set, not a file.
- [AGENTS.md, Instruction Authority](../../AGENTS.md#instruction-authority): the list that names it.
- [Contract Carrier Pointer-Brief Rewrite (S-004C)](../specs/S-004C-contract-carrier-pointer-brief-rewrite/SPEC.md): the Spec that moves the list to the decision.

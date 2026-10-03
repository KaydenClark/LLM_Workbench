---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - The AI Coding Dictionary Terms Spec (S-004E), its Task that writes the dictionary Wiki entries (TK-006B), written from the owner's adopted AI Coding Dictionary term, 2026-10-03
source_paths:
  - LEXICON.md
  - AGENTS.md
  - workbench/docs/adr/0044-evidence-for-claims-of-improved-agent-outcomes.md
last_verified: 2026-10-03
---

# Non-determinism: why one passing run is not proof

Non-determinism means one input can yield different outputs. The owner adopted the term from the AI Coding Dictionary on 2026-10-03. Each token is sampled, and provider-side serving adds variation of its own, so no setting removes it. Results from one task fall across a distribution.

**What it means here.** A single good run does not show the work is reliable, and a streak of bad ones is usually the distribution, not a worse model. Retrying is a legitimate strategy, and automated checks must catch the poor results, because a reviewing agent's judgement can vary between runs for the same reason.

**Where the Workbench depends on it.** `AGENTS.md` asks for repeated controlled trials before a change to static controls or context is described as an improvement in agent outcomes, and the accepted evidence decision says the same; a one-time pass proves what it ran and no more. This is also why verification is separate from the building agent's say-so: the Lexicon's Automated check row is deterministic, while the Automated review row is a judgement and can miss what a check would catch.

## Sources

- [Lexicon](../../LEXICON.md), the row for this term in the AI Coding Terms section: the Workbench meaning.
- [AI Coding Dictionary entry](https://www.aihero.dev/ai-coding-dictionary/non-determinism): attribution only. The Workbench restates the meaning in its own words and does not import later upstream edits until the owner adopts them.
- [Evidence for claims of improved agent outcomes](../docs/adr/0044-evidence-for-claims-of-improved-agent-outcomes.md): the evidence bar for outcome claims.
- [AGENTS.md](../../AGENTS.md): Engineering And Verification.

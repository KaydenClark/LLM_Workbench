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
  - workbench/docs/adr/000W-contract-carriers-are-briefs-that-point-to-skills-and-authority-flows-through-the-pointer.md
  - workbench/docs/ddr/000E-every-session-works-inside-its-smart-zone-and-spends-its-tokens-efficiently.md
last_verified: 2026-10-03
---

# Cache tokens: why the start of a session stays stable

Cache tokens are input tokens the provider reuses because they repeat the opening stretch of an earlier request exactly. The owner adopted the term from the AI Coding Dictionary on 2026-10-03. They cost far less than ordinary input, which is what keeps long sessions affordable. Only an exact prefix matches, so a change early in the conversation misses the cache from that point on, and the cache lapses after a few idle minutes. A cost jump shows up first as cache tokens falling against input tokens.

**What it means here.** The Workbench does not run a cache; the model provider does. The term matters because of what the Workbench puts at the start of every session: `AGENTS.md` and the other always-loaded content. *Inference:* editing that content during a session invalidates the cached prefix from the edit onward, so stable always-loaded content is cheaper than content that changes mid-session.

**Where the Workbench depends on it.** The Contract carriers decision keeps `AGENTS.md` short because every loaded token is paid for on every turn; the Lexicon's Input tokens, Output tokens and Cache tokens rows give the cost vocabulary that argument uses. The row sets no cost policy for any role.

## Sources

- [Lexicon](../../LEXICON.md), the row for this term in the AI Coding Terms section: the Workbench meaning.
- [AI Coding Dictionary entry](https://www.aihero.dev/ai-coding-dictionary/cache-tokens): attribution only. The Workbench restates the meaning in its own words and does not import later upstream edits until the owner adopts them.
- [Contract carriers are briefs that point to skills (the Contract carriers decision)](../docs/adr/000W-contract-carriers-are-briefs-that-point-to-skills-and-authority-flows-through-the-pointer.md).
- [Every session works inside its smart zone and spends its tokens efficiently (the smart zone decision)](../docs/ddr/000E-every-session-works-inside-its-smart-zone-and-spends-its-tokens-efficiently.md): spending tokens efficiently.

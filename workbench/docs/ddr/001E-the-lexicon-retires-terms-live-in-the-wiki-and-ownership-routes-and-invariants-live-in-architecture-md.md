---
date: 2026-10-05
supersedes:
canonicalized_in:
  - AGENTS.md
---

# The Lexicon retires: terms live in the Wiki and ownership, routes and invariants live in ARCHITECTURE.md

Landmark: Repo is the System of Record.

`LEXICON.md` retires as a file. Its two jobs split: what a term means becomes a Wiki entry, one per term; which artifact owns which kind of truth, the routes to it and the architectural invariants become `ARCHITECTURE.md`, short, a bird's-eye view then a codemap, named modules and types with no code links, explicit invariants and boundaries, revisited a few times a year. In a generated room, `ARCHITECTURE.md` also carries the project's own codemap, drafted at setup and confirmed by grilling.

Why the owner chose it:

- The owner, in his own words (2026-10-05): "we dont need runbook or lexicon. We should be using the wiki for those things. What about ARCHITECTURE.md?"
- Asked whether to build `ARCHITECTURE.md` from the Lexicon split as described (2026-10-05): "yes, Confirmed".

Considered and rejected: keeping the Lexicon as a third Contract carrier answering "What does that mean, and where do I look?", the shape of the contract-carriers decision. The matklad ARCHITECTURE.md post and Lopopolo's own `ARCHITECTURE.md` (ownership table plus invariants) were the models the owner pointed at.

Consequences: the Lexicon's Artifact Ownership Schema, Context Map routes and Governance Core move to `ARCHITECTURE.md`; its term rows become Wiki entries; the lexicon skill, the Wiki validator and every tool or test that reads a Lexicon heading change; the Contract carrier rewrite is re-planned. Decision records whose `canonicalized_in` names `LEXICON.md` keep that history and are not rewritten.

Provenance: the owner's answer on the matklad ARCHITECTURE.md post, 2026-10-05, and the confirmed readback the same day.

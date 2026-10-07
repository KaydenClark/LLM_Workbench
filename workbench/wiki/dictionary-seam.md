---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - The Lexicon Retirement Spec (S-004O), its Wiki-only reference pages Task (TK-009K), moved the Lexicon row here, 2026-10-07
source_paths:
  - workbench/docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md
  - templates/SPEC.md
  - skills-pending/tdd/SKILL.md
  - skills-pending/codebase-design/SKILL.md
last_verified: 2026-10-07
---

# Seam: where behavior is tested without the internals

A seam is a public boundary where behavior can be exercised and verified without depending on implementation details. A good seam lets the inside change freely while the test and every caller stay the same.

**What it means here.** Specs agree their important testing seams up front, in a Testing Seams section, and tests and callers use the same boundary. A test that reaches past the seam into internals is brittle: it fails on refactors that change no behavior.

**Where the Workbench depends on it.** Red-green proof is written at a seam, so the failing check names behavior rather than code shape. The registered feedback disposition `test` is "a check added at a stable testing seam" for the same reason: it keeps catching the finding after the code around it moves.

## Sources

- This page is the concept's Workbench home: a general reference concept stays Wiki-only and needs no [GLOSSARY.md](../../GLOSSARY.md) entry ([the Lexicon retirement decision (DDR-001E)](../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md)).
- [The Spec template](../../templates/SPEC.md): its Testing Seams section, where a Spec agrees its seams.
- [The tdd skill](../../skills-pending/tdd/SKILL.md): red-green-refactor through one public seam.
- [The codebase-design skill](../../skills-pending/codebase-design/SKILL.md): reasoning about module boundaries and seams before structural work.

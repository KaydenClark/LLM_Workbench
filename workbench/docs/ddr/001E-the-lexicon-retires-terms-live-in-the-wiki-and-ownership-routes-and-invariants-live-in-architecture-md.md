---
date: 2026-10-05
supersedes:
canonicalized_in:
  - AGENTS.md
  - BLUEPRINT.md
  - workbench/specs/S-004O-lexicon-retirement-and-architecture-md/SPEC.md
---

# The Lexicon retires: canonical vocabulary lives in GLOSSARY.md, explanations in the Wiki, and routes in ARCHITECTURE.md

Landmark: Repo is the System of Record.

## Decision

`LEXICON.md` retires as a file. Its jobs split into three owners:

- In an ordinary single-context repository, root `GLOSSARY.md` owns concise canonical project vocabulary. It contains project-specific terms and ordinary words with a distinct project meaning, using Matt Pocock's glossary format: a context description, short definitions and avoided aliases. It contains no implementation diary, requirements or general programming encyclopedia.
- Wiki lexicon articles remain substantial dictionary-style explanations: fuller definitions, descriptions, relationships and example usage, linked to the glossary's canonical definitions. They are not link stubs. General AI and programming concepts may remain Wiki-only; they need no mandatory glossary entry.
- `ARCHITECTURE.md` owns which artifact holds each kind of truth, routes and architectural invariants: a short bird's-eye view and codemap, named modules and types with no code links, explicit boundaries, revisited a few times a year. In a generated room it also carries the project's codemap, drafted at setup and confirmed by grilling.

Vocabulary follows the existing Workbench capture boundary: intent stays in the objective's notepad, confirmation settles meaning, and promotion writes the durable owner. There is no inline glossary-writing exception during modeling or grilling. A possible later-version change is deferred and unactivated. The operational promotion procedure remains owned by [promote](../../skills/promote/SKILL.md), not this record.

## Why the owner chose it

- Original retirement decision, 2026-10-05: “we dont need runbook or lexicon. We should be using the wiki for those things. What about ARCHITECTURE.md?” The owner confirmed the architecture split the same day.
- Refinement, explicitly confirmed 2026-10-06: a compact glossary and a richer dictionary have different jobs. Agents need concise authoritative vocabulary compatible with the Matt skills in use, while the Wiki retains deeper explanation and examples.
- The owner confirmed root `GLOSSARY.md` for an ordinary single-context repository so Matt's vocabulary references can stay unchanged, and rejected bypassing the Workbench notepad and promotion system.

## Alternatives and consequences

The original alternative was keeping the Lexicon as a third Contract carrier combining meanings and navigation. The matklad ARCHITECTURE.md post and Lopopolo's ownership table and invariants were the architecture models. The original per-term Wiki canonical-definition destination is corrected by the 2026-10-06 answer: explanations remain there, but the glossary owns the concise definitions. A duplicate glossary beside canonical Wiki definitions, Wiki link stubs, copying every general term into the glossary, and immediate writes merely because a term resolves are rejected.

[Lexicon Retirement And ARCHITECTURE.md (S-004O)](../../specs/S-004O-lexicon-retirement-and-architecture-md/SPEC.md) owns the migration census, context-layout check, templates, consumer routing and proof before removal. [Required Domain Modeling Skill (S-004J)](../../specs/S-004J-required-domain-modeling-skill/SPEC.md) owns the active modeling method and its capture adapters. [PR skill adoption (S-002U)](../../specs/S-002U-pr-skill-adoption/SPEC.md) can retain Matt's `GLOSSARY.md` reference; that settles its vocabulary destination, not delivery of the glossary or skill. Existing decision records naming `LEXICON.md` in `canonicalized_in` retain their history. No migration or skill delivery is claimed here.

## Provenance

Owner-confirmed retirement and readback, 2026-10-05; owner-confirmed glossary ownership, scope, single-context placement, capture correction and final concept readback, 2026-10-06. Reconciled under the owner's `to-docs` and `to-spec` request on 2026-10-06. The prior decision is recoverable with `git show 42431879fab3057db9e26ae661b4e92512c281f0:workbench/docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md`.

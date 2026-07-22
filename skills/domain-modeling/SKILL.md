---
name: domain-modeling
description: Clarify shared domain terms and durable decisions using the Lexicon, Blueprint, and assigned spec. Use when language is ambiguous, conflicting, or changes an important boundary.
---

# Domain Modeling

Sharpen the domain model as decisions form. Read the nearest `AGENTS.md` and
existing `LEXICON.md` first. Challenge conflicts, name overloaded terms
precisely, and test definitions with concrete edge cases.

Route settled language to the owning `LEXICON.md`: shared terms stay shared;
project-only terms stay local. Route cross-cutting architectural rationale to
`BLUEPRINT.md`, and scoped capability decisions to the assigned stable
`SPEC.md`. Do not create another vocabulary or decision store. Verify claims
against live source when relevant, surface drift, and update only the owning
artifact after the user has settled the meaning.

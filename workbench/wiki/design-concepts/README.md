---
type: meta
status: active
sensitivity: normal
knowledge_role: canonical
provenance:
  - LLM Workbench template wiki
source_paths:
  - workbench/wiki/design-concepts
last_verified: 2026-09-04
---

# Design Concepts

> Generated from LLM Workbench v3.1.1.

This collection holds Design Concept articles: complete, navlinked,
encyclopedic explanations of one durable, reusable, cross-cutting design model
each, written so the owner can understand how the project works. The
collection exists in every Workbench and may be empty.

## What Qualifies

A durable model that spans artifacts and operations: a product or deployment
relationship, a composition principle, a governance model, a lifecycle, a
navigation model. Not a one-off procedure, a status update, a single
requirement, a task, or a copied source document. Discovery starts from the
root `LEXICON.md`, which routes here.

## Ownership

- The owner alone authorizes creating an article. Record the authorization
  in the article's `History`.
- Agents may suggest an article from conversations, decisions, or
  documentation by naming the proposal in their report or spec evidence; they
  do not create the file.
- Agents may repair an existing article from direct authoritative proof and
  must record the evolution in `History`. Without proof, or with contradicting
  proof, they mark the article `status: stale` instead of reconciling by
  inference. Staleness is visible and nonblocking.
- A parent Workbench owns concepts its children share. A child Workbench owns
  only concepts unique to it and routes upward for the rest; `parent` in the
  frontmatter names that route or `none`.

## Article Shape

```markdown
---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - owner direction, YYYY-MM-DD
source_paths:
  - BLUEPRINT.md
parent: none
authorized_by: owner
last_verified: YYYY-MM-DD
---

# [Concept Name]

[Complete explanation of the model, navlinked to every relevant source.]

## Evidence and Sources

- [Governing source: control, spec, or ADR that decides]
- [Evidentiary source: verified Actuality, test, or record]

## History

- YYYY-MM-DD: created on owner direction.
```

An article is non-authoritative. When a decision, requirement, or verified
Actuality matters, its sources govern; when a concept becomes a binding
choice, the rule is canonicalized in the Blueprint or a spec and, if
consequential, recorded as an ADR.

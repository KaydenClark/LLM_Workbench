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

> Generated from LLM Workbench v3.2.1.

This collection holds Design Concept articles: complete, navlinked,
encyclopedic explanations of one durable, reusable, cross-cutting design model
each, written so the owner can understand how the project works, and the
evolving synthesis page of each landmark, summarizing its question cards. The
collection exists in every Workbench and may be empty.

## What Qualifies

A durable model that spans artifacts and operations: a product or deployment
relationship, a composition principle, a governance model, a lifecycle, a
navigation model; or the evolving synthesis of one landmark. Not a one-off
procedure, a status update, a single requirement, a task, or a copied source
document. A single delivered capability belongs in `features/`. Discovery
starts from the root `LEXICON.md`, which routes here.

## Ownership

- Any agent creates or updates an article in any authorized operation whose
  work touched it: a grilling exit, a Task close, a Spec completion, a
  promotion. The operation's authority covers the article; there is no
  per-article approval. Record that operation in `authorized_by` and in the
  article's `History`.
- Agents update an existing article from the operation's own evidence and
  record the evolution in `History`. When a claim cannot be repaired from
  proof, or proof contradicts it, mark the article `status: stale` and say
  why instead of reconciling by inference. Staleness is visible and
  nonblocking. The owner reads and corrects; a correction lands through the
  next agent's update.
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
  - the authorizing operation, YYYY-MM-DD
source_paths:
  - BLUEPRINT.md
parent: none
authorized_by: the authorizing operation or the owner
last_verified: YYYY-MM-DD
---

# [Concept Name]

[Complete explanation of the model, navlinked to every relevant source.]

## Evidence and Sources

- [Governing source: control, spec, or ADR that decides]
- [Evidentiary source: verified Actuality, test, or record]

## History

- YYYY-MM-DD: created by the named operation.
```

An article is non-authoritative. When a decision, requirement, or verified
Actuality matters, its sources govern; when a concept becomes a binding
choice, the rule is canonicalized in the Blueprint or a spec and, if
consequential, recorded as an ADR.

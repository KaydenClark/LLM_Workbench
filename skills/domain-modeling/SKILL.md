---
name: domain-modeling
description: Actively build and sharpen GPT_OS's domain language and record durable decisions in their canonical homes. Use when pinning down terminology or a ubiquitous language, challenging an overloaded or conflicting term, or capturing an architectural decision — and when another skill needs to maintain the domain model.
---

# Domain Modeling

Actively build and sharpen the domain model as you design. This is the *active*
discipline — challenging terms, inventing edge-case scenarios, and writing the
language and decisions into their canonical GPT_OS homes the moment they
crystallise. Merely *reading* `LEXICON.md` for vocabulary is not this skill; that
is a one-line habit any task can do. This skill is for when you are *changing* the
model, not just consuming it.

This work creates no new glossary or decision files. The domain model already has
canonical homes in GPT_OS; the whole job is to route language and decisions into
them and keep them sharp. Never stand up a parallel vocabulary store or a separate
decision log beside them.

## Where the model lives

Two kinds of output, four homes. Honor the authority order in `AGENTS.md`.

**Language — the glossary.** GPT_OS is multi-context, so its shared language and
its per-project language live at two tiers:

- **Shared workspace terms → root `LEXICON.md`.** The one shared language for
  GPT_OS: roles, seats, system functions, control-surface contracts. Its standing
  rule already *is* the discipline — "project-local domain language may add detail,
  but it does not silently redefine these workspace contracts."
- **Project-specific terms → the project's own control surface.** Each project
  room is its own bounded context. Project domain language lives in that project's
  local `LEXICON.md` if it has one, otherwise its `BLUEPRINT.md`, under the
  nearest project `AGENTS.md`. Do not push project-only vocabulary up into root
  `LEXICON.md`.
- **Which context owns a term** is routed by the generated `Projects/INDEX.md` and
  `Wiki/Machine/Project Source Registry.md`. When it is unclear which room a term
  belongs to, infer from that routing; if still unclear, ask.

**Decisions — the durable "why."** GPT_OS records decisions in blueprints and
specs, never in a separate decision log:

- **Cross-cutting architecture, workspace shape, folder routing, ownership →**
  root `BLUEPRINT.md` (or the project's `BLUEPRINT.md` for project-scoped shape).
- **A capability's requirements, decision, acceptance, proof, completion →** the
  owning stable `specs/S-###-slug/SPEC.md`.

## During the session

### Challenge against the language

When a term conflicts with the settled language, call it out immediately.
"`LEXICON.md` defines *Scout* as a read-only reconnaissance role, but you're using
it for an agent that edits code — which is it?" A silent redefinition of a shared
contract is a bug; surface it before it spreads.

### Sharpen fuzzy language

When a term is vague or overloaded, propose a precise canonical term. GPT_OS has
already paid for this once — "Workbench" was overloaded (whole system vs. the
harness) and that ambiguity is the root of S-007. "You're saying *the workbench* —
do you mean the installable Foundry, or the `LLM Workbench` harness component?
Those are different things."

### Discuss concrete scenarios

Stress-test relationships with specific scenarios that probe edge cases and force
precision about boundaries. "A Scout finds a bug mid-recon — does it fix it, or
does that cross into Engineer? Walk the exact handoff."

### Cross-reference with the live system

When someone states how something works, check whether the filesystem, specs, or
runtime agree — verified source outranks a stale doc (`AGENTS.md` authority order).
If they disagree, surface the drift: "You said OpenBrain is canonical memory, but
`AGENTS.md` says the Wiki is canonical and OpenBrain is a derived index — which
governs?" Flag the drift and update the stale owning doc when the task touches it.

### Write terms in as they resolve

The moment a term is settled, write it into its home — don't batch. Match the
existing `LEXICON.md` shape: a `| Term | Meaning |` row with the term in **bold**
and a tight, opinionated definition. Fold discouraged synonyms into the Meaning
cell the way the file already does ("Similar phrases do not carry this meaning"),
rather than adding a column. Keep entries to a sentence or two, define what a term
*is* rather than what it does, and add only terms specific to this domain — general
programming concepts do not belong.

`LEXICON.md` (and a project's local glossary) is a glossary and nothing else: no
implementation detail, no task state, no proof. Editing it is low-risk and
reversible (git owns history), so sharpen inline — but a term that reassigns a
role's authority or a control-surface contract is a decision, not just a word:
record the *why* in the owning spec or `BLUEPRINT.md` as below.

## Recording decisions

Offer to record a durable decision only when all three are true:

1. **Hard to reverse** — the cost of changing your mind later is meaningful.
2. **Surprising without context** — a future reader will wonder "why this way?"
3. **The result of a real trade-off** — there were genuine alternatives and you
   picked one for specific reasons.

If any is missing, skip it. Then route the record to its GPT_OS home — cross-cutting
shape into `BLUEPRINT.md`, a capability's decision and acceptance into the owning
stable `SPEC.md`. When a full grilling has settled a cluster of decisions, hand off
to `/make-it-so` (which runs `/to-docs` and `/to-spec`) instead of hand-writing
them; this skill's job is to keep the *language* sharp and to make sure each real
decision lands somewhere canonical, not to duplicate the promotion machinery.

## How this composes

- `/grilling` and `/brainstorm` own the interview and stay exploratory; this skill
  is the terminology-and-decision discipline you run *within or alongside* them,
  and it is safe to invoke when they surface a naming conflict.
- Only `/make-it-so` promotes a settled cluster into specs and tickets. Inline
  `LEXICON.md` sharpening does not need that gate; heavier decisions do.
- Stay inside `AGENTS.md` edit scope: root `LEXICON.md`, `BLUEPRINT.md`, and
  `specs/` are editable for in-scope work; project glossaries follow the nearest
  project `AGENTS.md`; the Wiki follows `Wiki/SCHEMA.md`.

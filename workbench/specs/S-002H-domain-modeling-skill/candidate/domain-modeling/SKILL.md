---
name: domain-modeling
description: Sharpen a Workbench room's domain model while decisions are still upstream - challenge conflicting or overloaded terms, probe boundaries with edge cases, trace the downstream consequences of a name or relationship, check claims against source, and route settled meaning to its owning Lexicon, Spec, Wiki or ADR within the caller's authorization.
---

# Domain Modeling

Actively build and sharpen the room's domain model as decisions form. This is
the *active* discipline: challenging words, inventing edge-case scenarios,
tracing what a name or relationship will touch downstream, and recording
settled meaning in its owner when the work is authorized to. Merely *reading*
`LEXICON.md` for an accepted meaning is ordinary orientation, not this skill.

Use it directly when terminology is the problem, or alongside grilling,
specification, design, delivery or review when a word, boundary or
relationship is about to become load-bearing. It supplies a method, never
authority: the current request and `AGENTS.md` decide whether this
conversation may write anything. Read `AGENTS.md`, then follow `LEXICON.md`'s
Task Routing to the smallest relevant owners before challenging anything.

## The active moves

- **Challenge a conflict immediately.** When a word is used against its
  accepted meaning, quote the accepted definition and its owner and ask which
  is meant: the existing meaning, the new use, or two separate concepts. Do
  not quietly rewrite an established term.
- **Split an overloaded word.** When one word carries two senses, propose
  distinct candidate names ("account" as the person who signs in, or the
  organization that pays?) and ask which one this sentence means. Do not
  invent the business rule behind either.
- **Probe a relationship with an edge case.** Invent a concrete scenario that
  could break the stated rule and ask what happens there. The answer may narrow
  the rule, establish an exception or stay unresolved; a scenario tests
  understanding and is not evidence that a feature exists.
- **Trace downstream consequences before the choice settles.** Before an
  upstream name, boundary or relationship settles, follow it to where it will
  land: the Lexicon entries, Specs and acceptance lines, source identifiers,
  tests, ADRs and Wiki articles that would read it, and what each would have
  to change or would silently mean instead. Put the few consequences that could
  change the choice in front of the owner, with the file or line behind each,
  while changing course is still cheap. This is a bounded trace, not an audit
  of the whole room.
- **Keep the conversation's rhythm.** Ask one substantive owner question at a
  time. When grilling owns the conversation, fold the challenge into its
  question and pending-readback rhythm instead of stacking questions.

## Check claims against source

When someone states how the room currently works, check the named source and
tests before agreeing, and quote or link the file behind any contradiction.
Classify what you found instead of letting either side win silently:

- **Agreement** - accepted meaning and verified source say the same thing.
- **Documentation drift** - verified source is newer than the accepted text;
  the owning document needs correcting.
- **Implementation gap** - accepted Canon is newer than the source; record the
  gap in the assigned Spec, do not "fix" the documentation to match the code.
- **Unresolved contradiction** - the ordering is ambiguous, or the speaker's
  proposal differs from both. Say what each source claims and leave the choice
  with the owner.

A proposed design is not an accepted requirement, and neither is a verified
implementation. Keep all three distinct in what you say and write.

## Where settled meaning goes

Route each settled result once, to the owner the room already has:

- **Shared term** - the room's `LEXICON.md`. One or two sentences on what the
  concept *is*, naming rejected synonyms or retired terms when useful. Keep
  requirements, implementation detail, scratch reasoning and task state out of
  the entry. The Lexicon is also the Context Map and routing owner; respect that
  role rather than reshaping it into a bare glossary.
- **Capability-local meaning and acceptance** - the assigned `SPEC.md`.
- **Durable explanation** - an article routed from the Wiki's `MEMORY.md`.
- **Qualifying decision rationale** - an ADR in the manifest-declared ADR
  collection, written with `node workbench/tools/adr.mjs new --title "..."`
  and the room's RUNBOOK ADR procedure.

Never create a `GLOSSARY.md`, `CONTEXT.md`, glossary or context map, local
`docs/adr/` directory or other parallel store for terminology or decisions.

## Write boundary

In an **authorized documentation or delivery** pass, edit the owning document
inline as soon as a meaning settles: do not batch terms for later.

In a **grilling-only or read-only** conversation, keep pending interpretations,
corrections and confirmed answers in working context (and the objective's
notepad when one is in use) and name the owner they would go to. Make no Canon
write: not to the Lexicon, a Spec, a control or an ADR. Confirmation settles
understanding; it never grants permission to edit. An unresolved contradiction
stays explicitly unresolved rather than being tidied into one side.

No skill invocation, Wiki page, ADR offer, note or scenario outcome enlarges
the request.

## Offer ADRs sparingly

Offer an ADR only when all three are true:

1. **Hard to reverse** - changing course later has a meaningful cost.
2. **Surprising without context** - a later reader would wonder why it was done
   this way.
3. **A real trade-off** - genuine alternatives were weighed and one was chosen
   for specific reasons.

If any of the three is missing, skip the ADR and say which test failed. Most
outcomes of a modeling conversation are a sharper sentence, a Lexicon entry or
nothing at all. Offering is not writing: record an ADR only when the work is
authorized to, using the room's ADR format. An ADR records why; the binding
rule it implies lands in the owning control or Spec in the same authorized
pass.

## Attribution

Adapted from Matt Pocock's `domain-modeling` skill in `mattpocock/skills`
(MIT), reviewed at revision d81f3a183412e71a5b1e84ca21bc1a35eea03a60. The
LLM Workbench source repository's `THIRD_PARTY_NOTICES.md` carries the upstream
license notice. The Workbench adaptation replaces the upstream glossary and
local ADR files with the room's existing owners and adds the downstream
consequence trace, the source classification and the write boundary.

---
name: domain-modeling
description: Sharpen a Workbench room's domain model while decisions are still upstream - challenge conflicting or overloaded terms, probe boundaries with edge cases, trace downstream consequences, check claims against source, and hand locked and confirmed meaning to promotion or scoped Task work, with ADR or DDR offers by scope.
---

# Domain Modeling

Actively build and sharpen the room's domain model as decisions form. This is
the *active* discipline: challenging words, inventing edge-case scenarios,
tracing what a name or relationship will touch downstream, and handing
settled meaning to its current owner through promotion or scoped Task work.
Merely *reading* `LEXICON.md` for an accepted meaning is ordinary orientation,
not this skill.

Use it directly when terminology is the problem, or alongside grilling,
specification, design, delivery or review when a word, boundary or
relationship is about to become load-bearing. The owner or a caller invokes it
as an optional companion; grilling and the destination-question-card flow
complete without it. It supplies a method, never authority: the current request
and `AGENTS.md` establish the scope. Read `AGENTS.md`, the `RUNBOOK.md`
operations index and entry procedure, then follow `LEXICON.md`'s Task Routing
to the smallest relevant owners before challenging anything.

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
  tests, decision records (ADRs and DDRs) and Wiki articles that would read it,
  and what each would have to change or would silently mean instead. Put the
  few consequences that could change the choice in front of the owner, with
  the file or line behind each,
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

Once a meaning is locked and confirmed, hand it to promotion or scoped Task
work. Route each settled result once, to the owner the room already has:

- **Shared term** - the room's `LEXICON.md`. One or two sentences on what the
  concept *is*, naming rejected synonyms or retired terms when useful. Keep
  requirements, implementation detail, scratch reasoning and task state out of
  the entry. The Lexicon is also the Context Map and routing owner; respect that
  role rather than reshaping it into a bare glossary.
- **Capability-local meaning and acceptance** - the assigned `SPEC.md`.
- **Durable explanation** - an article routed from the Wiki's `MEMORY.md`.
- **Qualifying decision rationale** - an ADR or DDR in the corresponding
  manifest-declared decision-record collection, selected by the scope test
  below and written at Map through `to-docs`.

Never create a `GLOSSARY.md`, `CONTEXT.md` or `UBIQUITOUS_LANGUAGE.md`.
Never create a glossary or context map, local `docs/adr/` directory or other
parallel store for terminology or decisions.

## Write boundary

During **Align**, make **no Canon write**: not to the Lexicon, a Spec, a control
or a decision record. Never edit an owning definition inline from the modeling
conversation, including during an otherwise authorized documentation or
delivery pass. The modeling method sharpens understanding and hands back the
consequences; it does not perform that Canon write.

Keep pending interpretations, corrections and open questions in the objective's
notepad or its question card and name the owners they would reach. The Lexicon
holds settled meaning only. Once meaning is locked and confirmed, use the
ordinary promotion route or scoped Task work through the current owners.
Confirmation never grants permission for an inline Canon edit during Align.
The owner's confirmation of the readback authorizes carrying the concept to
its endpoint, or the nearer endpoint the owner names, under the current
controls. Carry the locked and confirmed meaning through promotion or scoped
Task work within that authority; do not reopen the answer or add another
confirmation ceremony. An unresolved contradiction stays explicitly unresolved
rather than being tidied into one side.

No skill invocation, Wiki page, decision-record offer, note or scenario outcome
enlarges the request.

## Offer decision records sparingly

Offer a decision record only when all three are true:

1. **Hard to reverse** - changing course later has a meaningful cost.
2. **Surprising without context** - a later reader would wonder why it was done
   this way.
3. **A real trade-off** - genuine alternatives were weighed and one was chosen
   for specific reasons.

If any of the three is missing, skip the record and say which test failed. Most
outcomes of a modeling conversation are a sharper sentence, a Lexicon entry or
nothing at all.

The scope test asks: would this choice still hold if the architecture were
rebuilt differently? **Yes** selects a DDR for a destination choice, what the
finished product must be or do. **No** selects an ADR for an architectural
choice. If one consequential choice needs both records, keep them linked rather
than merge destination and architecture into one record.

Offering is not writing. Write an accepted choice at Map through `to-docs`,
using the manifest-aware `adr.mjs` and the room's decision-record procedure.
Resolve support lanes and the `adr` and `ddr` collections through
`workbench/manifest.json`; do not improvise a local store. In the standard
layout, `node workbench/tools/adr.mjs new --title "..."` creates a proposed ADR
and `node workbench/tools/adr.mjs new --kind ddr --title "..."` creates a
proposed DDR. Follow `to-docs` for format, validation and lifecycle; creating
a proposed record does not accept it or prove implementation. Use `to-docs`
to reconcile any binding rule with its owning control or Spec, naming those
operational owners in `canonicalized_in` and linking rather than copying
accepted decision claims. A DDR's `canonicalized_in` never names the Wiki.

## Attribution

Adapted from Matt Pocock's `domain-modeling` skill in `mattpocock/skills`
(MIT), reviewed at revision d81f3a183412e71a5b1e84ca21bc1a35eea03a60. The
LLM Workbench source repository's `THIRD_PARTY_NOTICES.md` carries the upstream
license notice. The Workbench adaptation replaces the upstream glossary and
local ADR files with the room's existing owners and adds the downstream
consequence trace, the source classification and the write boundary.

This adaptation inherits the source introduced by r <r@example.com> at
[84779a9058727c40db9c0077f5c19f3bd1b42a5e](https://github.com/KaydenClark/LLM_Workbench/commit/84779a9058727c40db9c0077f5c19f3bd1b42a5e),
whose original commit carries the exact trailer
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
The adaptation input is
[e3e0b5f068bff80861d68c254441b2c94d7015fb](https://github.com/KaydenClark/LLM_Workbench/commit/e3e0b5f068bff80861d68c254441b2c94d7015fb).
The current contract replaces inline Canon writes with promotion or scoped Task
work and extends the inherited ADR offer to ADR or DDR by scope; inherited
verification remains historical evidence, not proof of this adaptation.

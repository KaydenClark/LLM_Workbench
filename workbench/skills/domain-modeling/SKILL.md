---
name: domain-modeling
description: Build and sharpen a room's domain model while choices are still upstream - challenge conflicting and overloaded terms, probe boundaries with concrete scenarios, check claims against source, and trace what a proposed name, boundary or relationship would touch before it settles. Captures pending meaning in the notepad and hands confirmed meaning to promotion; offers an ADR or DDR only when it qualifies. Use when reworking terminology or a concept, often beside grilling.
---

# Domain Modeling

Actively build and sharpen the project's domain model as you design. This is
the *active* discipline: challenging terms, inventing edge-case scenarios,
tracing what a choice will touch while it is still cheap to change, and
capturing what crystallises so it can be promoted. (Merely *reading* the
vocabulary is not this skill: that is a one-line habit any skill can do. This
skill is for when you are changing the model, not just consuming it.)

It is a companion, not a dependency. The owner or a caller invokes it, often
beside [grilling](../grilling/SKILL.md) when something is being reworked;
grilling and the destination question-card flow complete without it. It
supplies a method, never authority: the current request and `AGENTS.md` set
the scope.

## Where vocabulary lives

Read `GLOSSARY.md` when it exists, otherwise the room's current `LEXICON.md`:
until the glossary migration reaches a room, the Lexicon is its vocabulary
owner, and nothing here pretends otherwise. Entries follow the format in
[GLOSSARY-FORMAT.md](GLOSSARY-FORMAT.md). Capability-local meaning and
acceptance live in the assigned Spec, richer explanation and examples in a Wiki
article routed from the Wiki's `MEMORY.md`, and decision rationale in the
decision-record collections `workbench/manifest.json` declares.

A single-context room keeps one root glossary. If a `GLOSSARY-MAP.md` already
exists, read it to find the context the topic belongs to, and ask when that is
unclear. Never infer or create a map, a per-context glossary or a new
decision-record collection: an apparent second context is a question for the
owner. Create no second glossary, terminology file or local decision-record
directory beside these owners.

## During the session

Ask one question at a time. When grilling owns the conversation, fold each
challenge into its question and pending-readback rhythm instead of stacking
questions.

### Challenge against the glossary

When the user uses a term that conflicts with the existing language in the
vocabulary owner, call it out immediately, quoting the definition and its file.
"Your glossary defines 'cancellation' as X, but you seem to mean Y. Which is
it?"

### Sharpen fuzzy language

When the user uses vague or overloaded terms, propose a precise canonical term.
"You're saying 'account': do you mean the Customer or the User? Those are
different things."

### Discuss concrete scenarios

When domain relationships are being discussed, stress-test them with specific
scenarios. Invent scenarios that probe edge cases and force the user to be
precise about the boundaries between concepts. A scenario tests understanding;
it is not evidence that a feature exists.

### Cross-reference with code

When the user states how something works, check whether the code agrees, and
read its tests as well. If you find a contradiction, surface it with the file
behind it: "Your code cancels entire Orders, but you just said partial
cancellation is possible. Which is right?" Name what you found in the
`AGENTS.md` State Resolution terms instead of letting either side win:

- **Agreement**: the accepted meaning and verified source say the same thing.
- **Documentation drift**: verified source is newer than the accepted text;
  the owning document needs correcting.
- **Implementation gap**: accepted Canon is newer than the source; the gap
  belongs in the owning Spec, not in a documentation edit that matches the code.
- **Unresolved contradiction**: the ordering is unclear (State Resolution's
  ambiguity), or the proposal differs from both. Say what each source claims
  and leave the choice with the owner.

### Trace consequences upstream

Before a proposed name, boundary or relationship settles, follow it to the
owners that would read it: the current vocabulary definition in `GLOSSARY.md`
or `LEXICON.md`, Specs and their acceptance lines, decision records, Wiki
pages, source identifiers and tests. For each, note what it would have to
change, or what it would silently mean instead. Put the few consequences that
could change the choice in front of the owner, with the file or line behind
each, while changing course is still cheap. This is a bounded trace of the
owners the choice reaches, not an audit of the whole room.

### Capture, then promote

Matt's source updates the glossary inline the moment a term resolves; here
there is no inline write. While the concept is being aligned, intent, pending
interpretations, corrections and proposed vocabulary stay in the objective's
note through the [`notepad` skill](../notepad/SKILL.md), with the owners each
would reach. Saving is not settling: only the owner's explicit confirmation
settles a meaning, and an unresolved contradiction stays recorded as
unresolved.

Settled meaning reaches its owner through the ordinary promotion route (the
[`promote` skill](../promote/SKILL.md), or `to-docs` within an authorized
documentation pass): confirmed canonical vocabulary to `GLOSSARY.md`, or to
`LEXICON.md` where the room has no glossary yet; capability requirements to
their Spec; richer explanation to the Wiki. No inline glossary, Lexicon, Spec,
control or decision-record write happens while aligning, so the tracked room
diff stays empty until promotion.

The glossary should be totally devoid of implementation details. Do not treat
it as a spec, a scratch pad, or a repository for implementation decisions. It
is a glossary and nothing else.

### Offer decision records sparingly

Only offer a decision record when all three are true:

1. **Hard to reverse**: the cost of changing your mind later is meaningful.
2. **Surprising without context**: a future reader will wonder "why did they
   do it this way?"
3. **The result of a real trade-off**: there were genuine alternatives and you
   picked one for specific reasons.

If any of the three is missing, skip the record and say which test failed.
Most modeling outcomes are a sharper sentence, a vocabulary entry or nothing.

Choose the kind by the scope test: would the choice still hold if the
architecture were rebuilt differently? Yes selects a DDR, a destination choice
about what the product must be or do; no selects an ADR, an architectural
choice. Offering is not writing. An accepted offer is written at Map through
`to-docs` with the manifest-aware `adr.mjs` (the
[decision-record procedure](../to-docs/SKILL.md#decision-records)), into the
`adr` or `ddr` collection `workbench/manifest.json` declares (by default
`workbench/docs/adr` and `workbench/docs/ddr`).

## Workbench adapters

Each change from the upstream source, and why:

- **Upstream consequence trace** added, because the owner's use of this skill
  is to see the downstream impact of a name or boundary while still upstream.
- **Capture in the notepad and promotion** replace the inline glossary update,
  because a Workbench answer does not enter Canon inline: confirmation settles
  meaning and promotion writes the owner.
- **Vocabulary owner routing** reads `GLOSSARY.md` when present and the current
  `LEXICON.md` otherwise, because the glossary migration reaches rooms
  separately and a missing glossary must not be invented.
- **ADR or DDR by the scope test, through `to-docs` and the manifest
  collections**, replaces upstream ADR files and their format, because the room
  keeps two decision-record kinds in declared collections with one writing
  procedure.
- **A companion, not a dependency**, because grilling and the question-card flow
  must complete without it.
- **One vocabulary owner**: no second glossary, inferred context map or local
  decision-record tree, because a parallel store splits the room's meaning.
- **State Resolution classes** name the code cross-check results, because the
  room already classifies source-versus-Canon disagreements that way.

## Source and credit

Adapted from Matt Pocock's `domain-modeling` skill in `mattpocock/skills`
(MIT), at revision `d81f3a183412e71a5b1e84ca21bc1a35eea03a60`
(`skills/engineering/domain-modeling/SKILL.md` and `GLOSSARY-FORMAT.md`). The
glossary format is kept verbatim in [GLOSSARY-FORMAT.md](GLOSSARY-FORMAT.md);
the upstream decision-record format is not carried because `to-docs` owns it.
The LLM Workbench source repository's `THIRD_PARTY_NOTICES.md` carries the
upstream license notice.

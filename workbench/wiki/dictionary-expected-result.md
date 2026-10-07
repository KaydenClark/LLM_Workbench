---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Expected result
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its first Wiki lexicon batch Task (TK-009D), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/landmark-tracker/README.md
last_verified: 2026-10-07
---

# Expected result: what an answer is meant to make durable

An Expected result says what should change, or what knowledge should become
durable, once a question is answered, and names where it belongs when that is
already known. It is a forward-looking field on a Destination Question Card.
The canonical definition is the
[glossary entry](../../GLOSSARY.md#destination-and-direction).

**What it means here.** Result describes achieved delivery, separately from intended Expected result; neither a Result field nor a completed Task establishes Verified. An unanswered question need not have an expected answer or a predetermined destination. These meanings do not establish that a room exposes a Result-writing operation.

**Neighbouring words.** It belongs to a
[Destination Question Card](dictionary-destination-question-card.md). Achieved
delivery is judged later, at [Review](dictionary-review.md) and
[Verify](dictionary-verify.md); an Expected result only says what is intended.
A question whose answer cannot yet be phrased is [Fog](dictionary-fog.md), not
a card with a missing Expected result.

**In use.** The Landmark Tracker records it with
`--expected-change "The intended durable change" --expected-home "where it belongs"`
when an answer is recorded on a card. As an illustration, a card asking where
fuller term explanations live once the Lexicon retires would carry the Expected
result "one Wiki lexicon article per glossary term, linked to its entry", with
`workbench/wiki/` as its home, which is the destination the Lexicon retirement
decision settled.

## Sources

- [GLOSSARY.md, Destination and direction](../../GLOSSARY.md#destination-and-direction): the canonical definition.
- [Landmark Tracker procedure](../landmark-tracker/README.md): Expected result distinct from Result.
- [The Lexicon retirement decision (DDR-001E)](../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md): the example's destination.

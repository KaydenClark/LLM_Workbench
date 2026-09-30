# TK-003W - Observe domain-modeling scenarios in fresh contexts, red on pending source and green on the candidate

**Task ID:** TK-003W
**Spec ID:** S-002H
**Slice:** Observe domain-modeling scenarios in fresh contexts, red on pending source and green on the candidate
**Status:** ready
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: S-002H acceptance lines 1-5 observed at the Testing Seams scenario seam, plus the short upstream-naming demo transcript the Verification Procedure names
**Planned verification:** Each scenario runs in a disposable fixture room outside the repository with a fresh-context agent given only the skill text, the room path and scripted owner turns. Red: the preserved pending source under the same scripts, with the observed Canon writes or root creation recorded. Green: the candidate under the same scripts, asserting observed turns and the fixture file diff, not exact prose.

## Outcome

The evidence log records observed runs, with limits, for: conflict and overload
challenge; an edge case; downstream consequences of an upstream naming choice;
a code-versus-statement discrepancy classified; a grilling-only confirmation
with no Canon write; an authorized documentation pass updating the fixture
Lexicon and Spec during the work; each failed ADR threshold and one qualifying
offer.

## Required Behavior

- Fixture rooms live in the session scratchpad: a small AGENTS, LEXICON, Spec,
  ADR collection, source file and test, committed to a disposable Git
  repository so the diff is exact.
- Scenario writes land only in the fixture; nothing here authorizes a
  production Lexicon edit.
- Observations are recorded as seen, including deviations; one run per
  scenario per source is the stated limit.

## Boundaries

- Scripted owner turns; no real owner answer is simulated as approval.
- Fixture content is not committed; the evidence row summarizes it and the
  demo transcript is kept short enough to check in under one minute.

## Done Criteria And Closing Proof

- Red and green observations per scenario with fixture diff summaries.

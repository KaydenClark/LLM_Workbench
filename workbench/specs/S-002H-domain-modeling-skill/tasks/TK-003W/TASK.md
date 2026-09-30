# TK-003W - Observe domain-modeling scenarios in fresh contexts, red on pending source and green on the candidate

**Task ID:** TK-003W
**Spec ID:** S-002H
**Slice:** Observe domain-modeling scenarios in fresh contexts, red on pending source and green on the candidate
**Status:** done
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: S-002H acceptance lines 1-5 observed at the Testing Seams scenario seam, plus the short upstream-naming demo transcript the Verification Procedure names
**Planned verification:** Each scenario runs in a disposable fixture room outside the repository with a fresh-context agent given only the skill text, the room path and scripted owner turns. Red: the preserved pending source under the same scripts, with the observed Canon writes or root creation recorded. Green: the candidate under the same scripts, asserting observed turns and the fixture file diff, not exact prose.
**Proof:** Six fresh-context general-purpose agents (one model), each given only a skill copy, a disposable room path and scripted owner turns, in copies of one Workbench room built with the release tools (fixture 1771b0f: AGENTS, RUNBOOK, LEXICON, S-001, accepted ADR-0001, src/loans.js, 4 passing tests); candidate SKILL.md sha256 09dca29c, pending sha256 152e2c97. GREEN (candidate): A grilling-only - cited src/loans.js:2,6-7, test/loans.test.js:12-15, ADR-0001 and S-001 to classify '3 per household' as a new rule reversing an accepted decision; named the 'account' conflict and split it into borrower-vs-payer options; traced each option's downstream reach (memberId, MAX_LOANS_PER_MEMBER, error text, tests, S-001 lines 18 and 22, ADR-0001, Loan and Hold definitions) before asking one question; pending read-back, then on confirmation said confirming does not authorize edits; room diff empty across three turns. B authorized docs - LEXICON.md shared-term change only (Household avoids 'account'), S-001 capability term, acceptance wording, open edge-case question and implementation-gap row; no code, no glossary root. C ADR filter - declined (a) reversible, (b) unsurprising, (c) no alternative, naming each failed test; offered only (d); when authorized used adr.mjs new into proposed/000A (validate ok) and, when separately authorized, placed the binding rule as two S-001 acceptance criteria. RED (pending source, same scripts): also challenged, checked code, applied the ADR filter and kept writes inside room owners; no CONTEXT.md or root docs/adr was created (the room's own controls carried routing and the write boundary). Observed differences only: red did not trace the rename's reach into identifiers, tests and Spec lines; red put the charging rule into a new Lexicon term; red at confirmation justified an ADR by an alternative the owner never stated. Transcripts, diffs and run map kept in the session scratchpad (runs/*/transcript.md, diff.patch).

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

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s002h-domain-modeling-candidate | 0fd1a3b70b6b67867e54cc6740315e30d6794fa1 | ahead 0 behind 0 | 0 | Six fresh-context general-purpose agents (one model), each given only a skill copy, a disposable room path and scripted owner turns, in copies of one Workbench room built with the release tools (fixture 1771b0f: AGENTS, RUNBOOK, LEXICON, S-001, accepted ADR-0001, src/loans.js, 4 passing tests); candidate SKILL.md sha256 09dca29c, pending sha256 152e2c97. GREEN (candidate): A grilling-only - cited src/loans.js:2,6-7, test/loans.test.js:12-15, ADR-0001 and S-001 to classify '3 per household' as a new rule reversing an accepted decision; named the 'account' conflict and split it into borrower-vs-payer options; traced each option's downstream reach (memberId, MAX_LOANS_PER_MEMBER, error text, tests, S-001 lines 18 and 22, ADR-0001, Loan and Hold definitions) before asking one question; pending read-back, then on confirmation said confirming does not authorize edits; room diff empty across three turns. B authorized docs - LEXICON.md shared-term change only (Household avoids 'account'), S-001 capability term, acceptance wording, open edge-case question and implementation-gap row; no code, no glossary root. C ADR filter - declined (a) reversible, (b) unsurprising, (c) no alternative, naming each failed test; offered only (d); when authorized used adr.mjs new into proposed/000A (validate ok) and, when separately authorized, placed the binding rule as two S-001 acceptance criteria. RED (pending source, same scripts): also challenged, checked code, applied the ADR filter and kept writes inside room owners; no CONTEXT.md or root docs/adr was created (the room's own controls carried routing and the write boundary). Observed differences only: red did not trace the rename's reach into identifiers, tests and Spec lines; red put the charging rule into a new Lexicon term; red at confirmation justified an ADR by an alternative the owner never stated. Transcripts, diffs and run map kept in the session scratchpad (runs/*/transcript.md, diff.patch). | Wiki article gained 'What the scenarios observed' with the upstream-naming demo and limits (committed 0fd1a3b7 with TK-003X); no fixture content committed | One run per scenario per source, one model, scripted owner and rooms, skill handed rather than discovered; the expected scenario-seam red for the write boundary and glossary roots did not occur in a Workbench room; reliability unmeasured; owner Human QA separate | 2feeff9a0575f0a7c0d2e81e9fb7e140ee743f72bd93c58e17689c55fc46fe49 |

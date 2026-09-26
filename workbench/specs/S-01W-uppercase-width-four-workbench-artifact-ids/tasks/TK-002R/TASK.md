# TK-002R - Reconcile identity procedures and run the assembled WBID QA

**Task ID:** TK-002R
**Spec ID:** S-01W
**Slice:** Reconcile identity procedures and run the assembled WBID QA
**Status:** ready
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: S-01W acceptance line 5 (ADR, procedures and generic mirrors describe actual delivery; full suite, drift receipts and assembled review are recorded).
**Planned verification:** Red: a read-only semantic check finds RUNBOOK's Visible Identifiers section, the LEXICON WBID entry, their `templates/` mirrors and the notepad skill's allocate wording still describing mixed-case base62, minimum width three and `N-00A`-style examples for artifact labels, and none of them naming dual-form selection or `widen-id`; green: each of those passages describes the delivered behavior exactly (uppercase `0-9A-Z` minimum width four for Specs, Tasks, ADRs and notepads; every spelling reserved; dual-form selectors; `widen-id` with `**Former ID:**`, run when substantive work starts on an open record; base62 kept only for Workbench connection IDs and legacy reading), templates stay generic and `[BRACKETED]`, the read-only QA inventory of live active records still short and of alias collisions is recorded with its counts, and the full suite plus S-00K pre/post self-drift receipts are clean of new findings.

## Outcome

A cold-start agent reading RUNBOOK and LEXICON gets the identity rules the code
now enforces. The owner's "sweep during QA/verify" (E-8) is performed as a
read-only inventory: it lists open records whose IDs are still short and any
alias collisions, and mutates nothing. The capability is then ready for the
assembled-Spec review.

## Authority And Source

Lane I (`claude-lane-I`) cut this Task under the owner's 2026-09-26 instruction
relayed by the Claude Director. The Director decided (2026-09-26, option A)
that S-01W's QA Task edits only RUNBOOK's Visible Identifiers section, the
LEXICON WBID entry and their `templates/` mirrors, because S-00P's control
rewrite is hours away and stale ID rules misroute cold-start agents. Ledger
E-8: "We can do the sweep during the QA/verify, and find what we missed."

## Released Lane

Write lane: `RUNBOOK.md` (Visible Identifiers section only),
`templates/RUNBOOK.md` (its mirror only), `LEXICON.md` (WBID entry only),
`templates/LEXICON.md` (its mirror only), the allocate wording in
`workbench/skills/notepad/SKILL.md` (and its managed receipt through the
supported installer route if the skills lane requires one), and the ADR-0041
remaining-work paragraph. No other control, template or skill passage. The QA
inventory is a read-only command or script run whose output is summarized in
evidence; no new shipped command. Run the S-00K self-drift receipt before and
after. The direct `spec-report.mjs` library pass-through stays a named limit
unless the trace shows a fix inside this lane.

## Decisions

None yet.

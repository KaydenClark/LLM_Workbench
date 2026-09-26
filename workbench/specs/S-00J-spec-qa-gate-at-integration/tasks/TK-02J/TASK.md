# TK-02J - Keep a declared-blocked Task blocked until a real blocker clears, and record owner-decision blockers

**Task ID:** TK-02J
**Spec ID:** S-00J
**Slice:** Keep a declared-blocked Task blocked until a real blocker clears, and record owner-decision blockers
**Status:** done
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: A Task record declared `blocked` with no resolvable blocker stays blocked with a doctor finding, a record declared `blocked` whose blockers are all satisfied still derives ready, and an `owner:<decision>` blocker is recorded and never satisfied automatically.
**Planned verification:** Red: a fixture record declared `blocked` with Blockers `none` is listed ready by `next --json` and taken by `claim`, and a record whose Blockers contain `owner:pick-schema` is refused by the Task-record parser; green: the first stays blocked in `next`, `claim` and `render` with a doctor finding naming it, the second parses and stays blocked until the token is removed, and a record declared `blocked` whose every blocker is a satisfied ID (Task done, Spec complete, or `S-###:delivered` satisfied) still derives ready and `claim` takes it.
**Proof:** Implementation 85daa4c (claim 70dc112). Red at the claim base plus the new fixtures: tools/test-spec-workbench.mjs ran 42 ok blocks, then the new TK-02J block failed because the Task-record parser rejected the owner token (TK-9F2 has an invalid blocker id: owner:pick-schema); a parser-independent reproduction on the same code showed the resolver defect: a record declared blocked with Blockers none was handed out by next --json (status ready), rendered (ready), raised no doctor finding, and claim took it (in-progress); tools/test-diagnostics.mjs failed 2 of 36 (blocked-without-blocker must stay registered; PINNED_EFFECTS must equal the registry). Green at 85daa4c: effectiveStatus derives ready from a declared blocked only when the record names a resolvable blocker (a plain/delivered/owner id or a recorded missing capability) and every id blocker is satisfied, so the declared-blocked-none record stays blocked in next, claim and render and doctor names it (blocked-without-blocker: attention, specs, none); owner:<lowercase-kebab-decision> parses, is known grammar to doctor (no unknown-blocker-qualifier), is never satisfied, and the record is claimable once the entry is removed; seven malformed owner forms are refused by the parser; regression: a record declared blocked on TK-001 (done) and S-9F0 (complete) is handed out by next --json and taken by claim (the S-###:delivered satisfied case stays pinned by the TK-01T block, the capability case by the S-00V TK-00K block). tools/test-spec-workbench.mjs 43 ok, tools/test-diagnostics.mjs 36/36. Full suite 48/48 at 85daa4c078132a0037c44498000379def72a6eab (read-only runner, dirty []). Live render no drift; doctor no blocking finding. The TT-Q10 comment in task-record.mjs was already corrected by TK-01T (7ddb660); no further edit needed.

## Outcome

Lane G's S-01L probe (2026-09-26) found two resolver defects that TK-01T was
meant to absorb but did not apply (its close row records them as open):

- A record declared `blocked` whose Blockers are `none` recomputes to `ready`,
  so `next` hands out work its author marked blocked. This is a correctness
  hazard.
- A Task record cannot express a blocker that waits on an owner decision:
  the parser accepts only IDs.

The Claude Director approved folding both into the resolver lane. They get
their own Task because TK-01T closed without them.

## Required Behavior

- `effectiveStatus`: a record declared `blocked` stays `blocked` when its
  Blockers are `none`, contain an unknown or unresolvable token, contain an
  unmet blocker, or contain an `owner:<decision>` token. It derives `ready`
  only when it has at least one blocker and every blocker is a known,
  satisfied ID form (`TK-###` done in the same Spec, `S-###` complete or
  superseded, `S-###:delivered` satisfied per TK-01T). Lane F relies on the
  satisfied-ID case today (S-00V TK-00K, claimed at efa03a7); keep it and pin
  it with a regression test.
- Doctor reports a declared-`blocked` record with no resolvable blocker as a
  finding naming the Task (attention effect, so it stays visible without
  blocking selection of other work).
- `owner:<decision>` (lowercase kebab-case decision slug) is accepted by the
  Task-record parser and the blocker grammar. The resolver never satisfies
  it; it clears only when the entry is removed from the record. Doctor treats
  it as known grammar.
- Fix the stale TT-Q10 comment in `workbench/tools/task-record.mjs` that
  still calls the ID form open; LEXICON and the ledger settled it as `TK-`.

## Released Write Lane

- `workbench/tools/spec-workbench.mjs` (effectiveStatus and the shared
  satisfied-blocker helper only)
- `workbench/tools/task-record.mjs` (blocker token grammar)
- `workbench/tools/diagnostics.mjs` and `tools/test-diagnostics.mjs` (finding registration)
- `tools/test-spec-workbench.mjs`

`owner:<decision>` and `S-###:delivered` are new public blocker grammar; their
RUNBOOK and LEXICON description belongs to S-00P's control rewrite
(TK-002/TK-003/TK-004). Record that as a remaining gap.

## Execution Proof And Exit

Show red then green at `next --json`, `claim`, `render` and doctor through
fixtures, run the full suite on the committed candidate, capture guardrail
and self-drift receipts, and return candidate SHA, changed paths, actual
checks, documentation status and remaining gaps to the Dispatcher.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s00j-tk02j-blocked-resolution | 85daa4c078132a0037c44498000379def72a6eab | ahead 0 behind 0 | 0 | Implementation 85daa4c (claim 70dc112). Red at the claim base plus the new fixtures: tools/test-spec-workbench.mjs ran 42 ok blocks, then the new TK-02J block failed because the Task-record parser rejected the owner token (TK-9F2 has an invalid blocker id: owner:pick-schema); a parser-independent reproduction on the same code showed the resolver defect: a record declared blocked with Blockers none was handed out by next --json (status ready), rendered (ready), raised no doctor finding, and claim took it (in-progress); tools/test-diagnostics.mjs failed 2 of 36 (blocked-without-blocker must stay registered; PINNED_EFFECTS must equal the registry). Green at 85daa4c: effectiveStatus derives ready from a declared blocked only when the record names a resolvable blocker (a plain/delivered/owner id or a recorded missing capability) and every id blocker is satisfied, so the declared-blocked-none record stays blocked in next, claim and render and doctor names it (blocked-without-blocker: attention, specs, none); owner:<lowercase-kebab-decision> parses, is known grammar to doctor (no unknown-blocker-qualifier), is never satisfied, and the record is claimable once the entry is removed; seven malformed owner forms are refused by the parser; regression: a record declared blocked on TK-001 (done) and S-9F0 (complete) is handed out by next --json and taken by claim (the S-###:delivered satisfied case stays pinned by the TK-01T block, the capability case by the S-00V TK-00K block). tools/test-spec-workbench.mjs 43 ok, tools/test-diagnostics.mjs 36/36. Full suite 48/48 at 85daa4c078132a0037c44498000379def72a6eab (read-only runner, dirty []). Live render no drift; doctor no blocking finding. The TT-Q10 comment in task-record.mjs was already corrected by TK-01T (7ddb660); no further edit needed. | RUNBOOK wording routed to S-00P: owner:<decision> and S-###:delivered are new public blocker grammar whose RUNBOOK and LEXICON description belongs to S-00P's control rewrite (TK-002/TK-003/TK-004); code comments and the doctor registry describe the grammar; no RUNBOOK, LEXICON, AGENTS or template edit in this lane. | RUNBOOK/LEXICON description of the owner:<decision> and S-###:delivered blocker grammar and the blocked-without-blocker finding is routed to S-00P TK-002/TK-003/TK-004; the TK-02J acceptance line awaits Dispatcher QA. | a561e445c9fb2b3362752df2745837e84b6445306756e4c2ddc2fe0814bd40e8 |

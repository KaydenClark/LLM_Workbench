# TK-01T - Let a dependent consume reviewed integration delivery of a blocker Spec

**Task ID:** TK-01T
**Spec ID:** S-00J
**Slice:** Let a dependent consume reviewed integration delivery of a blocker Spec
**Status:** done
**Stance:** Builder
**Blockers:** TK-01S
**Destination:** spec-acceptance: A dependent can declare that it needs only a blocker Spec's reviewed integration delivery (T0 of the closure-capture transition contract), and the resolver satisfies that blocker from content-bound review and integration containment, while a plain Spec blocker still requires final `complete`.
**Planned verification:** Red: a fixture Task blocked on `S-AAA:delivered`, where S-AAA has every Task done, acceptance checked and a bound PASS verdict whose candidate is contained in the declared integration branch with a matching committed digest, stays blocked in `next`, `claim` and `render`; green: it resolves ready, and it stays blocked when the verdict is missing or failed, the candidate is not contained, the digest has substantively changed since review, a Task is not done, or the blocker is written plainly as `S-AAA`.
**Proof:** Implementation 7ddb660. Red at the claim base plus the new fixtures: tools/test-spec-workbench.mjs first failed because the Task-record parser rejected the token (TK-9E2 has an invalid blocker id: S-9E0:delivered), then, with the parser accepting qualified tokens, failed behaviorally (next --json hands out the dependent whose delivered edge T0 satisfies: actual undefined, expected S-9E2). Green: one shared satisfiedBlockers set feeds next, claim, render and both doctor passes; S-###:delivered is satisfied by complete/superseded or by T0 (every Task done, every acceptance line checked, latest verdict at the current digest is PASS, its candidate is an ancestor of the declared integration ref, and computeSpecDigest at that candidate equals the current digest), reusing assembleSpecReport, computeSpecDigest and the exported isAncestorOfBranch; a plain S-### still needs complete/superseded. Fixtures through next --json, claim, render and doctor: T0 satisfies the delivered edge while the plain edge on the same Spec stays unmet; no verdict, a fail verdict, an uncontained candidate, a substantive edit after review, a reviewed digest the candidate never carried, a Task not done and an unchecked acceptance line each keep it unmet; a complete Spec satisfies both forms; Spec/Task bytes and every Git ref are unchanged across next, doctor and render (no write, no fetch); an unknown qualifier (S-9E0:shipped, TK-001:delivered) stays unmet with an unknown-blocker-qualifier doctor finding naming each Task (registered error/specs/none, pinned in tools/test-diagnostics.mjs); a record declared blocked whose delivered edge is satisfied still derives ready and claim takes it, and the existing S-301 declared-blocked cases (complete Spec blocker, done Task blocker) stay green. Five committed mutants of reviewedDelivery (drop Task, acceptance, verdict-result, ancestry or committed-digest check) each turn the matching fixture red. S-00P TK-002 blockers converted to TK-001, S-00H, S-00I:delivered, S-00J:delivered with one explanatory paragraph; S-00O left plain. Full suite 48/48 on 7ddb660 (dirty: []).

## Outcome

Final closure now needs owner Human QA approval and main verification (TK-01S).
The owner promotes integration to main only after version-level Human QA, and
that Human QA covers the workflow controls S-00P writes. S-00P TK-002 is
blocked on S-00I and S-00J; if those blockers can only be met by final
`complete`, the chain deadlocks: S-00P cannot start until S-00I/S-00J reach
main, and they cannot reach main until the version, including S-00P, passes
Human QA. The 2026-09-26 wave review (finding 4) named this and ruled out
deleting the edges.

This Task adds an explicit, content-bound reviewed-delivery prerequisite. A
dependent that needs only the delivered behavior on integration writes
`S-###:delivered`; a dependent that needs final closure keeps `S-###`. The
edge stays visible and checkable either way.

## Authority And Source

Lane H (S-00J Dispatcher) authored this packet on 2026-09-26 under the owner
instruction relayed by the Claude Director. The closure-capture transition
contract in this Spec's Dependencies And Blockers section defines T0 and
names this Task as its consumer. Read current code at this Task's claim base:

- `workbench/tools/spec-workbench.mjs` `satisfiedIds`, `splitBlockers`,
  `blockersSatisfied`, `effectiveStatus` and the five sites that build the
  `completed` set from `complete`/`superseded` status (`next`, `claim`,
  `render`, doctor, catalog).
- `workbench/tools/spec-report.mjs` `assembleSpecReport` (gaps, `specDigest`),
  the bound review-verdict reader and the integration-ancestry check used by
  `recordOwnerApproval`, which already implement the T0 facts.
- The existing `gate` command, which already accepts a complete reviewed
  candidate before owner QA; T0 is that state after its merge.

## Required Behavior

- Blocker token grammar: `S-###:delivered` beside existing `S-###` and
  `TK-###`. Unknown qualifiers fail closed as an unmet blocker, and doctor
  reports them as a finding rather than silently treating them as satisfied.
- `S-###:delivered` is satisfied when that Spec is `complete` or
  `superseded`, or when all of the following hold for it: every Task done,
  every acceptance line checked, a current PASS review verdict bound to an
  immutable candidate, that candidate an ancestor of the declared
  integration branch ref, and the current committed Spec/Task digest equal to
  the reviewed digest. Reuse the existing report, digest and ancestry
  functions; add no second normalization or verdict parser.
- A plain `S-###` blocker keeps today's meaning: only `complete` or
  `superseded` satisfies it.
- One shared helper computes the satisfied set; every current `completed`
  site uses it, so `next`, `claim`, `render` and doctor agree.
- Reads only: resolving a blocker never writes, fetches or mutates state; it
  reads the local declared integration ref, and the procedure (RUNBOOK,
  through S-00P) says to fetch before relying on it.
- Convert S-00P TK-002's `S-00I, S-00J` blockers to `S-00I:delivered,
  S-00J:delivered` in the same change, and record why in that Task's body.
  TK-001 and S-00H stay as written. S-00O's release blockers stay plain.

## Acceptance And Stable Verification Seam

Fixture tests in `tools/test-spec-workbench.mjs` through `next --json`,
`claim` and `render`, plus a doctor case for an unknown qualifier:

- delivered blocker satisfied by T0; plain blocker on the same Spec unmet;
- each missing T0 fact (verdict absent or fail, candidate not contained,
  substantive digest change after review, Task not done, acceptance
  unchecked) keeps it unmet;
- a `complete` Spec satisfies both forms;
- no write occurs during resolution (fixture bytes unchanged);
- S-00U F1/F2/F3/F6 regressions and existing blocker tests stay green.

## Released Write Lane

- `workbench/tools/spec-workbench.mjs`
- `workbench/tools/spec-report.mjs` only to export an existing T0 fact reader
- `tools/test-spec-workbench.mjs`
- `workbench/specs/S-00P-workflow-canon-rework/tasks/TK-002/TASK.md`
  Blockers line and one explanatory paragraph only

The Dispatcher maintains this Task and the S-00J SPEC. `RUNBOOK.md` and
`templates/RUNBOOK.md` wording for the new token goes through S-00P; record
it as a remaining gap. Render and commit the Taskboard projection in the
candidate.

## Execution Proof And Exit

Capture guardrail and self-drift baselines before runtime changes, show the
red then green output, run the full required suite on the committed
candidate, and capture post receipts. Return candidate SHA, changed paths,
actual checks, documentation status and remaining gaps to the Dispatcher.
Dispatcher whole-Spec QA and a separate-context review precede integration.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s00j-tk01t-delivered-blocker | 7ddb660f88618fe33c77662514a3f0b89fea559d | ahead 0 behind 0 | 0 | Implementation 7ddb660. Red at the claim base plus the new fixtures: tools/test-spec-workbench.mjs first failed because the Task-record parser rejected the token (TK-9E2 has an invalid blocker id: S-9E0:delivered), then, with the parser accepting qualified tokens, failed behaviorally (next --json hands out the dependent whose delivered edge T0 satisfies: actual undefined, expected S-9E2). Green: one shared satisfiedBlockers set feeds next, claim, render and both doctor passes; S-###:delivered is satisfied by complete/superseded or by T0 (every Task done, every acceptance line checked, latest verdict at the current digest is PASS, its candidate is an ancestor of the declared integration ref, and computeSpecDigest at that candidate equals the current digest), reusing assembleSpecReport, computeSpecDigest and the exported isAncestorOfBranch; a plain S-### still needs complete/superseded. Fixtures through next --json, claim, render and doctor: T0 satisfies the delivered edge while the plain edge on the same Spec stays unmet; no verdict, a fail verdict, an uncontained candidate, a substantive edit after review, a reviewed digest the candidate never carried, a Task not done and an unchecked acceptance line each keep it unmet; a complete Spec satisfies both forms; Spec/Task bytes and every Git ref are unchanged across next, doctor and render (no write, no fetch); an unknown qualifier (S-9E0:shipped, TK-001:delivered) stays unmet with an unknown-blocker-qualifier doctor finding naming each Task (registered error/specs/none, pinned in tools/test-diagnostics.mjs); a record declared blocked whose delivered edge is satisfied still derives ready and claim takes it, and the existing S-301 declared-blocked cases (complete Spec blocker, done Task blocker) stay green. Five committed mutants of reviewedDelivery (drop Task, acceptance, verdict-result, ancestry or committed-digest check) each turn the matching fixture red. S-00P TK-002 blockers converted to TK-001, S-00H, S-00I:delivered, S-00J:delivered with one explanatory paragraph; S-00O left plain. Full suite 48/48 on 7ddb660 (dirty: []). | RUNBOOK wording routed to S-00P: the S-###:delivered grammar and its fetch-before-relying procedure belong to S-00P's control rewrite, so RUNBOOK, LEXICON, AGENTS and templates are unchanged here; code comments at the resolver, parser and diagnostic registry document the grammar. | RUNBOOK/LEXICON description of S-###:delivered routed to S-00P (TK-002/TK-003/TK-004). Lane H's proposed scope addition (a declared-blocked record with Blockers none stays blocked with a doctor finding; owner:<decision> blocker grammar) was not applied in this Task and remains open for the Dispatcher; owner:<decision> tokens are still rejected by the Task-record parser. | 427b67078ea957c127f70d338ccda777f5e23673c3de279e8f04f2c898070d2d |

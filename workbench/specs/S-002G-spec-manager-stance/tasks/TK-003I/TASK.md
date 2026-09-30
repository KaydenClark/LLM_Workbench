# TK-003I - Observe the Spec Manager scenario in a fresh context and assemble the Spec proof

**Task ID:** TK-003I
**Spec ID:** S-002G
**Slice:** Observe the Spec Manager scenario in a fresh context and assemble the Spec proof
**Status:** done
**Stance:** Builder
**Blockers:** TK-003G
**Destination:** spec-acceptance: S-002G acceptance lines 1-5 observed in the named Testing Seams scenario, line 6 (performed without private notes) and line 7 (named verification and remaining limitations recorded without claiming owner approval); Verification Procedure (self-drift pre/post, semantic inspection, under-one-minute demonstration, immutable-candidate independent review, owner Human QA kept separate)
**Planned verification:** One fresh-context Worker, given only the delivered `workbench/skills/spec-manager/SKILL.md` text and the path of a disposable fixture room outside this repository, performs the Testing Seams scenario against a scripted setup: two ready independent Tasks with scripted Worker hand-backs, one Task whose write conflicts with a shared contract file, one hand-back whose claimed proof does not hold, and one out-of-scope request. Observed: which Tasks it dispatches, which write it holds, how it assesses each hand-back, what it integrates into the Spec branch, and that it reports the assembled candidate with gaps instead of approving it. Then: full AGENTS suite on the committed candidate, self-drift `--phase post` compared with the pre receipt, guardrail after-score compared with the baseline, `render`, `doctor`, separate-context review, `verdict`, `gate --task`.
**Proof:** Scenario: one fresh-context general-purpose agent, delivered SKILL.md blob 293b842e verbatim, disposable room outside the repository (builder sha256 046b7f18, pin 243b7761); dispatched TK-1 and TK-3, held TK-2 behind the named CONTRACT.md writer with a release condition, checked each hand-back at its named commit, merged TK-1 and TK-3 into spec/S-100 (477b938, fe92b9b), returned TK-2 for a second attempt with the failing check named, logged the S-101 request to the Director inbox unperformed, reported candidate 47310c1b without claiming approval; independent room check G-scenario-room-check.md (main unchanged, S-101 untouched, TK-2 not an ancestor, check exit 0 at the candidate and 1 at task/TK-2). Assembled gates: full AGENTS suite 48/48 at 7101ef38 (G-s-002g-7101ef3.log, dirty []); guardrail 106.6/113 identical to baseline at 35b36611; self-drift pre 35b36611 and post 7101ef38 cleanUpdate false with the same eight pre-existing findings; git diff --check clean; doctor no blocking finding

## Outcome

The Spec's evidence log records one observed run of the named scenario with
its limits (one run, one model, scripted owner and scripted Workers), the
assembled proof for the whole Spec, and the reviewed integration delivery.
Owner Human QA remains separate and unclaimed.

## Required Behavior

- The fixture room is a disposable Git repository outside this repository
  (scratchpad), never a real room. It carries a small Spec with a `tasks/`
  directory, a Spec branch, two Task branches produced by scripted Workers on
  demand, a shared `CONTRACT.md` two Tasks both want to edit, hand-back notes
  (exact SHA, proof, docs status, remaining gap) of which one claims a green
  check that the branch does not actually satisfy, and one request outside the
  Spec (a change to a neighbouring Spec directory).
- The fresh-context Worker receives the skill text and the fixture path only
  (plus the host's default instructions, which is a recorded limit). It is
  told the owner instruction verbatim and that it acts as a Dispatcher using
  Spec Manager for that one Spec. It is not told the expected answer.
- Expected observations, checked after the run: the two independent Tasks are
  dispatched (both scripted Workers ran); the conflicting write is held with a
  named single writer and a stated release condition; the false hand-back is
  rejected or returned for corrective work with the specific unmet proof
  named; the proven Task branch(es) are merged into the Spec branch; the
  out-of-scope request is routed to the Director, not performed; the report
  names the assembled candidate SHA, evidence and remaining gaps and does not
  state approval of its own candidate. Any deviation is recorded as observed.
- Assembled proof at the committed candidate: full suite log with first-line
  SHA and `dirty: []`; self-drift post receipt compared with the pre receipt
  (same or fewer findings, each classified); guardrail after-score compared
  with the 106.6/113 baseline; bounded semantic self-drift readback of the
  changed documents; `render` committed; `doctor` with no blocking finding.

## Boundaries

- No owner approval is claimed or requested; passing checks are not approval.
- The scenario proves one observed run, not reliability; record that limit.
- The fixture is deleted or left in the scratchpad; nothing from it is
  committed to this repository except the evidence row's summary.

## Done Criteria And Closing Proof

- Evidence rows record the scenario setup, the observations against each
  expected behavior, and the limits; the assembled proof row records the
  suite tally, receipts and semantic readback; acceptance boxes are checked
  only where a named row supports them.
- Separate-context review of the immutable candidate, `verdict`, `gate --task
  TK-003I --spec S-002G`, PR into integration, merge, containment and branch
  cleanup follow the RUNBOOK closeout; the Spec header ends at "Next gate:
  Owner Human QA on integration, then complete S-002G".

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s-002g-spec-manager-stance-r3 | cb96b1604e191754a5902e4991b6645beb4615da | ahead 0 behind 0 | 0 | Scenario: one fresh-context general-purpose agent, delivered SKILL.md blob 293b842e verbatim, disposable room outside the repository (builder sha256 046b7f18, pin 243b7761); dispatched TK-1 and TK-3, held TK-2 behind the named CONTRACT.md writer with a release condition, checked each hand-back at its named commit, merged TK-1 and TK-3 into spec/S-100 (477b938, fe92b9b), returned TK-2 for a second attempt with the failing check named, logged the S-101 request to the Director inbox unperformed, reported candidate 47310c1b without claiming approval; independent room check G-scenario-room-check.md (main unchanged, S-101 untouched, TK-2 not an ancestor, check exit 0 at the candidate and 1 at task/TK-2). Assembled gates: full AGENTS suite 48/48 at 7101ef38 (G-s-002g-7101ef3.log, dirty []); guardrail 106.6/113 identical to baseline at 35b36611; self-drift pre 35b36611 and post 7101ef38 cleanUpdate false with the same eight pre-existing findings; git diff --check clean; doctor no blocking finding | Spec evidence rows, acceptance mapping and Completion Result; article example and Verified behavior and limits (TK-003H); no further control update needed | One run, one model, scripted owner, Director and Workers, no remote; the fixture could not run a second attempt; root-control wording to S-00P; separate-context review, integration delivery and owner Human QA remain | 9b24b9a1cfd4b8dcaa6bdb61736e23ed3e240af80f17c332fb2a9a40e15d21fe |

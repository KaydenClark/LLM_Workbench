# TK-003C - Observe the Spec Manager scenario in a fresh context and assemble the Spec proof

**Task ID:** TK-003C
**Spec ID:** S-002G
**Slice:** Observe the Spec Manager scenario in a fresh context and assemble the Spec proof
**Status:** ready
**Stance:** Builder
**Blockers:** TK-003A
**Destination:** spec-acceptance: S-002G acceptance lines 1-5 observed in the named Testing Seams scenario, line 6 (performed without private notes) and line 7 (named verification and remaining limitations recorded without claiming owner approval); Verification Procedure (self-drift pre/post, semantic inspection, under-one-minute demonstration, immutable-candidate independent review, owner Human QA kept separate)
**Planned verification:** One fresh-context Worker, given only the delivered `workbench/skills/spec-manager/SKILL.md` text and the path of a disposable fixture room outside this repository, performs the Testing Seams scenario against a scripted setup: two ready independent Tasks with scripted Worker hand-backs, one Task whose write conflicts with a shared contract file, one hand-back whose claimed proof does not hold, and one out-of-scope request. Observed: which Tasks it dispatches, which write it holds, how it assesses each hand-back, what it integrates into the Spec branch, and that it reports the assembled candidate with gaps instead of approving it. Then: full AGENTS suite on the committed candidate, self-drift `--phase post` compared with the pre receipt, guardrail after-score compared with the baseline, `render`, `doctor`, separate-context review, `verdict`, `gate --task`.

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
  TK-003C --spec S-002G`, PR into integration, merge, containment and branch
  cleanup follow the RUNBOOK closeout; the Spec header ends at "Next gate:
  Owner Human QA on integration, then complete S-002G".

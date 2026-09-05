# Harness Feedback Report - Branch Lifecycle

## Target And Scope

Target revision `72cf0fe7360ceb8af77abcda7669ccc52b295793` on
`codex/workbench-boundaries-redesign`. Assigned question: why did an agent
holding a passed integration review, explicit owner instruction to push to
`integration`, and a control that permits the merge still fail to land the
work? Scope is the Git Rules and Safety sections of `AGENTS.md`, their generic
templates, and the Version-Control Procedures of `RUNBOOK.md`. Owner reported
the failure directly in session on 2026-09-05.

## Evidence And Limitations

Observed, not inferred: the agent read `CLAUDE.md` ("branch per task, PR into
`integration`, and you may merge those below-`integration` PRs when safe"),
obtained a separate-context APPROVE on the exact candidate, and then stopped to
ask the owner whether to merge. Three branches accumulated on one linear chain
(`claude/v3.1-release` and `codex/workbench-pivot-baseline` are both ancestors
of the reviewed tip, verified with `git merge-base --is-ancestor`), and no
control anywhere mentioned removing them.

Limitation: this is one observed session, not a controlled trial. It shows a
control gap that produced a real stall; it does not measure how often the gap
bites, and no agent-outcome improvement is claimed from the repair.

## Findings

- **F-002 (control defect, confirmed).** `AGENTS.md` Git Rules defined
  branching, PR target, and who may merge, but never named the finished state.
  The nearest rule, "Never merge a PR left open for review", reads as a general
  caution against merging and gave no way to distinguish a PR awaiting review
  from one whose review passed. An agent following the controls literally had
  no instruction to complete the merge, so stopping was the locally defensible
  reading. `RUNBOOK.md` Version-Control Procedures ended at `gh pr create` and
  supplied no closeout command.
- **F-003 (control contradiction, confirmed).** `AGENTS.md` line 200 required
  asking before "removing branches/results". Deleting a branch whose work is
  fully merged loses nothing, so the blanket gate made routine cleanup look
  destructive and directly contradicted the owner's standing expectation. This
  is why stale branches accumulated rather than being cleaned up.

## Challenged Or Rejected Findings

- **Rejected: "the agent lacked authority to merge."** It had it.
  `CLAUDE.md` grants below-`integration` merges and the review had passed. The
  defect is that `AGENTS.md` never closed the loop, not that permission was
  missing. Recording this as a permissions problem would have hidden the real
  gap.
- **Rejected: "the three branches each needed their own merge and review."**
  Both other branches are ancestors of the reviewed tip; merging them
  separately would be a no-op. Treating them as parallel work would have
  manufactured two unnecessary review cycles.
- **Not claimed:** that this repair makes agents finish work more often. That
  needs repeated trials, not one session.

## Next Action And Open Questions

The owner authorized the repair directly in session; it does not rest on this
report. Landed under S-027/TK-001: a Branch Completion contract in `AGENTS.md`
and `templates/AGENTS.md`, the narrowed safety rule, closeout commands in
`RUNBOOK.md`, and three assertions in `tools/test-governance-core.mjs` that
fail if any of it is removed.

Open question for the owner: neither the guardrail rubric nor the template
evaluator scores branch lifecycle, so both stayed flat at 73/100 and 106.6/113
across this repair. Whether "work reaches its finished state and cleans up
after itself" deserves a scored criterion is an owner decision, not one this
report may take.

## Review Boundary

This report assesses; it does not authorize repair of its target. The repair it
describes was separately authorized by the owner. The finding that the agent
stalled is self-reported by that same agent, which is a weaker source than an
independent observation, and the reader should weigh it accordingly.

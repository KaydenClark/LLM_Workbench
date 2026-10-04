# TK-005G - Move the work-selection, review and closure operations behind their pointers

**Task ID:** TK-005G
**Spec ID:** S-004C
**Slice:** Move the work-selection, review and closure operations behind their pointers
**Status:** in-progress
**Stance:** Builder
**Blockers:** TK-005F
**Destination:** spec-acceptance: An inventory maps every line of `AGENTS.md` and `RUNBOOK.md` to a home, and a check shows every removed line landed (lifecycle family), and `RUNBOOK.md` is an operations index in which each operation's procedure is reachable in a skill.
**Planned verification:** Red: the landing check over the family's sections fails for every unplaced line when the bodies are dropped, and the index has no pointer from "pick the next Task", "claim", "close a Task", "assemble a Spec for review", "record a verdict" or "approve and complete" to a skill that carries the procedure. Green: every line is classified, the check passes at the candidate, the skills (`carry`, `implement`, `dispatcher`, `director`, `spec-manager`, `spec-planner`, `to-tasks`, `code-review`, `reviewer` and any new skill the census justifies) carry the moved procedures with their binding requirements, the retained headings keep every inbound anchor (`AGENTS.md#assembled-review-and-corrective-return` and `#owner-closure-and-reconciliation` among them), and the templates agree. `tools/test-spec-workbench.mjs`, `tools/test-spec-report.mjs`, `tools/test-diagnostics.mjs`, `tools/test-branch-closeout.mjs`, the skill and delivery-skill tests, the landing check and the full AGENTS suite pass on the committed candidate; touched Wiki pages lint clean.

## Outcome

The largest `AGENTS.md` block, Work Selection And Lifecycle, Assembled Review And
Corrective Return and Owner Closure And Reconciliation, and the Runbook's Spec
Lifecycle And Retrieval section (about 350 lines), move behind the index.
`AGENTS.md` keeps the lines that apply in every session: claim before editing,
one writer for shared Spec and projection state, a done claim needs evidence,
independent review is required before integration and a self-review never
counts, only the owner approves and promotes to `main`, and a failed review or
owner finding is never silently cleared. The commands, ordering, receipts,
verdict and approve mechanics, retirement, discard and recovery live in the
skills the index points to.

## Scope

- `AGENTS.md` Work Selection And Lifecycle, Assembled Review And Corrective
  Return, Owner Closure And Reconciliation, and the Runbook's Behavior Selection
  and Spec Lifecycle And Retrieval sections as the census confirms them (the
  role-detail part of Role And Stance Coordination waits for the role-detail
  Task).
- Home skills, index rows, inventory entries, template mirrors, readers and Wiki
  pages as the Spec's family method states.
- The corrective-work rules in the AGENTS review and closure sections are being
  changed by the Corrective-Work Spec. This Task starts only from the integration
  text after that Spec's `AGENTS.md` Task is contained in integration, and moves
  the rules exactly as they then read; it neither pre-empts nor restates them.
  The blocker is an `owner:` token for the same reason as the first Task's: it
  names a Task in another Spec, which the blocker grammar cannot express. The
  Dispatcher removes it after confirming containment, and the Corrective-Work
  Spec's identifier replaces the token's name in this Task's Boundaries when that
  Spec exists on integration.
- Takes an `AGENTS.md` writer turn.

## Acceptance

- [ ] Every line of the family's sections is classified and the landing check
      passes at the candidate.
- [ ] Each moved procedure is reachable from an index row through a skill that
      carries its binding requirements.
- [ ] `AGENTS.md` keeps only lines that apply in every session for this family,
      with the review-independence and owner-only-promotion rules intact.
- [ ] Every inbound anchor for these headings resolves; root and template agree.

## Boundaries

Relocation only: no rule's meaning changes, including the corrective-work
rules of [Corrective Work Rules](../../../S-004F-corrective-work-rules/SPEC.md)
(S-004F), which this Task moves exactly as they read on integration. No change
to the claim, close, verdict, approve or complete commands.

Blocker cleared on 2026-10-03 by the Spec's single writer (the Dispatcher):
every Corrective Work Rules Task (TK-005Q to TK-005W) is `done`, and its
`AGENTS.md` corrective-section commits 086c4395 and 8a9dd77e are contained in
`origin/integration` (checked at a22e98c4). `owner:agents-corrective-sections-landed`
is removed and this Task is ready.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004c-tk005g-lifecycle-family | 57148eb739d2191d8fdfdd210452c77087f3d261 | ahead 0 behind 0 | 0 | red 12ec6861: test-runbook-index 5/22 failed (TK-005G family rows, briefs, binding) and test-blueprint-contract failed (reconciliation claims not in director skill); green: test-runbook-index 22/22, test-control-fidelity 37/37, test-blueprint-contract, test-adr 56/56, test-skill-catalog, test-genesis-from-decisions, round trip root (26 examples) and --guidance templates/RUNBOOK.md (25 examples), test-task-id-collision 34/34 (GIT_EDITOR unset; env-only refusal also at a22e98c4); landing check ok vs pin d7ffffe9 (AGENTS 168/168, RUNBOOK 587/587) and merge-base a22e98c4 (102/102, 264/264) at 57148eb7; full AGENTS suite 50/50 at 57148eb7 dirty []; guardrails 106.6/113 and 78/100 held (a moved red/green line first dropped them to 104.6 and 77.6; the brief keeps it); wiki validate ok; bytes AGENTS.md 35,729 -> 30,637, RUNBOOK.md 142,400 -> 126,745, templates/AGENTS.md 30,241 -> 25,133, templates/RUNBOOK.md 72,092 -> 55,293, AGENTS+index 46,723 -> 42,372 | AGENTS.md, templates/AGENTS.md (Work Selection And Lifecycle, Assembled Review And Corrective Return, Owner Closure And Reconciliation reduced to briefs with skill pointers; headings kept); RUNBOOK.md, templates/RUNBOOK.md (index: new rows Pick, claim and close a Task and Correct a failed review, four lifecycle rows and Size and continue work re-pointed to skills; Spec Lifecycle And Retrieval and its four level-4 subsections reduced to sentence plus pointer; task-sizing paragraph replaced by a to-tasks pointer; Behavior Selection kept as an intent-to-skill routing table); skills implement, dispatcher, director, to-tasks gained the moved procedures; Wiki skill-implement, skill-dispatcher, skill-director, skill-to-tasks, lifecycle-tool-behaviors; S-004C inventories; tests test-runbook-index, test-control-fidelity, test-workbench-round-trip, test-genesis-from-decisions, test-blueprint-contract | Root-only text kept in RUNBOOK Documentation subsection with no generic home: this room's S-003P collision-recovery example (executed by test-task-id-collision) and the S-01X JSON preview paragraph with its maintainer demo (TK-005K may move it); Behavior Selection kept in place as index-shaped routing; combined loaded-cost bound (38,178 B) not yet met at 42,372 B; the template intro's SHA/DIGEST label sentence moved, adapted to bracketed labels, into the skills (templates have no inventory) | 02fcd6590000299beda6d0eb5b25ffe80bdfb5d893ae60badaf2c20e38613148 |

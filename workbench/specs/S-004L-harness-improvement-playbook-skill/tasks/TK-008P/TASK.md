# TK-008P - Correct the feedback, rerun and test-without wording the fixture scenario found

**Task ID:** TK-008P
**Spec ID:** S-004L
**Slice:** Correct the feedback, rerun and test-without wording the fixture scenario found
**Status:** done
**Stance:** Builder
**Blockers:** TK-008L
**Destination:** spec-acceptance: The one skill exists in the lane, its loop has six named steps each with a checkable artifact, and a scenario in a fixture room runs it end to end.
**Planned verification:** Red: `tools/test-skill-catalog.mjs` pins, in `workbench/skills/improve-harness/SKILL.md`, that Taking In Feedback appends a new row to an append-only feedback record naming the original row and its disposition instead of moving a row's status, that step 5 names hidden help in the room's own files and later history as something the isolated starting state and the rerun record must account for, and that step 6 states what a test-without run that also closes the job establishes; it fails at the committed pre-change tree. Green: the skill text makes it pass; the Wiki page for the skill still agrees (small Wiki lint); `test-skills-lane`, `test-runbook-index`, `test-wiki` and the full suite pass on the committed candidate.
**Claimed by:** claude-s004l-worker-p
**Proof:** PR #395 merged at 50f19e64 (candidate 9418092e, contained); red 98fae067; full suite 52/52 on committed cd5b0ec6; test-skill-catalog, test-skills-lane, test-runbook-index, test-wiki, test-skill-inspection ok; guardrails 73/100 before and after; self-drift 11 findings pre/post, same set

## Outcome

The fresh-context fixture-room scenario (TK-008O) followed the skill end to
end and found three places where its text misleads a cold reader: Taking In
Feedback says a feedback row "moves from new to landed or declined", which an
append-only feedback record and the closed Feedback Dispositions set both
forbid; step 5 guards only against hidden help "from the conversation", while
the rerun worker found the answer in the room's own baseline run record and a
plain clone can expose later history through tags; and step 6 asks for a
test-without rerun but does not say what it means when that run also closes
the job. The skill states each correctly in the Workbench's own words.

## Scope

- `workbench/skills/improve-harness/SKILL.md`: Taking In Feedback, step 5,
  step 6 (and the step 4 clause on Spec and Task records, made conditional on
  the room keeping them).
- `tools/test-skill-catalog.mjs`: the S-004L improve-harness pins.
- `workbench/wiki/skill-improve-harness.md` only if its summary no longer
  agrees.

## Acceptance

- [x] Taking In Feedback appends instead of editing, names the original row,
      and uses the room's disposition set, recorded in the owning Spec when the
      room has one.
- [x] Step 5 requires the isolated starting state to exclude later history and
      the rerun record to name every room source that could have supplied the
      behavior.
- [x] Step 6 says a test-without run that also closes the job shows no
      agent-outcome improvement from the intervention, and how the decision
      follows.

## Boundaries

Wording of the one skill and its pins only. No new step, section or artifact;
no change to the feedback format, the Lexicon, the Runbook rows or any other
skill. The remaining scenario findings that belong to other owners (template
placeholders `doctor` does not flag, the template Runbook's evaluation commands
naming producer tools) are routed in the Spec's Completion Result, not fixed
here.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004l-tk008p-skill-wording | 5cca852a686f9ef22f52d7cb582d83927edebe74 | ahead 5 behind 0 | 0 | Red 98fae067 (test-skill-catalog pins fail as expected); green cd5b0ec6: test-skill-catalog, test-skills-lane, test-runbook-index, test-wiki, test-skill-inspection ok; full suite 52/52 on committed cd5b0ec6 (log scratchpad/s004l/suite-tk008p-cd5b0ec.log); wiki validate ok; after merging integration b85c0535 (S-004L records only) render, doctor and append-only clean | workbench/skills/improve-harness/SKILL.md (steps 4, 5, 6 and Taking In Feedback), workbench/wiki/skill-improve-harness.md (feedback entry, pinned behavior, History) | none for this Task | cbccd843a144aa4908fc247bf9962d63aa95838935eabb7fa61edb9e34c2aef8 |
| 2 | claude/s004l-assembly | 50f19e6450a8c94d83203a98af5c7e052052baa8 | ahead 0 behind 0 | 0 | PR #395 merged at 50f19e64 (candidate 9418092e, contained); red 98fae067; full suite 52/52 on committed cd5b0ec6; test-skill-catalog, test-skills-lane, test-runbook-index, test-wiki, test-skill-inspection ok; guardrails 73/100 before and after; self-drift 11 findings pre/post, same set | improve-harness SKILL.md steps 4, 5, 6 and Taking In Feedback; workbench/wiki/skill-improve-harness.md | Corrected text not rerun by a fresh context; pins prove the text only | 7a064723487a9ef05e5992958136aef573feb36a98e99c6b7178371a436c06ee |

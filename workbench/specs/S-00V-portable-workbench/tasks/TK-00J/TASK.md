# TK-00J - A committed notepad or handoff stays privacy-checked and is refused as durable evidence

**Task ID:** TK-00J
**Spec ID:** S-00V
**Slice:** A committed notepad or handoff stays privacy-checked and is refused as durable evidence
**Status:** in-progress
**Blockers:** none
**Destination:** spec-acceptance: S-00V box 3 (a session's notepad and handoff can be committed and later removed without a privacy or provenance check treating them as durable evidence)
**Stance:** Builder
**Planned verification:** Red: a fixture in `tools/test-notepads.mjs` or `tools/test-sessions.mjs` force-adds a notepad and a handoff, then asserts the privacy check still runs on them, that an evidence or promote citation naming a live notes or handoffs path is refused as non-durable, and that removing them leaves no dangling-evidence finding; green after the smallest tool change (or proof that existing checks already hold, with the tests added); full AGENTS suite; separate-context review.

## Delivery

The tool half of Desired Behavior 3, built before the ignore rule lifts so the
lift lands onto checks that already hold. Seams: `workbench/tools/notepads.mjs`,
`sessions.mjs`, `privacy.mjs`, `project-evidence.mjs` and the Spec citation
checks. Committing a note is transport, never promotion or evidence. This Task
does not change `workbench/sessions/.gitignore` or any control wording; the
lift is the next Task. The notepad runtime is shared with S-00Y (notepad skill
rebuild) and S-00Q/S-00T record work: rebase often and keep behavior additive.

## Done Criteria

- Tests prove the three assertions above on a committed fixture note and
  handoff.
- No privacy rule is relaxed.

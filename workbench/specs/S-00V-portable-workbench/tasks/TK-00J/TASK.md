# TK-00J - A committed notepad or handoff stays privacy-checked and is refused as durable evidence

**Task ID:** TK-00J
**Spec ID:** S-00V
**Slice:** A committed notepad or handoff stays privacy-checked and is refused as durable evidence
**Status:** done
**Blockers:** none
**Destination:** spec-acceptance: S-00V box 3 (a session's notepad and handoff can be committed and later removed without a privacy or provenance check treating them as durable evidence)
**Stance:** Builder
**Planned verification:** Red: a fixture in `tools/test-notepads.mjs` or `tools/test-sessions.mjs` force-adds a notepad and a handoff, then asserts the privacy check still runs on them, that an evidence or promote citation naming a live notes or handoffs path is refused as non-durable, and that removing them leaves no dangling-evidence finding; green after the smallest tool change (or proof that existing checks already hold, with the tests added); full AGENTS suite; separate-context review.
**Proof:** At 34b76b8: tools/test-sessions.mjs three committed-fixture tests (note and handoff force-added past the ignore rule and committed). Red first on the claim tree for Wiki source/link, project-evidence source and Spec/Task-record link citations (untracked-provenance absent, prepareEvidence returned prepared); green after workbench-paths liveRecordPath plus the wiki, project-evidence and spec-workbench checks. Already held and now proved on committed records: notepad append privacy refusal, sessions scan and promote privacy refusal, promote citation refusal, ADR untracked-provenance, clean removal back to the doctor baseline. Full 48-command AGENTS suite TOTAL pass=48 fail=0 on committed candidate 34b76b8; guardrail 106.6/113 unchanged (templates and controls untouched); doctor no blocking finding

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

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s00v-tk00j-notes-not-evidence | 34b76b8ecafdfc5a5fe7b23cd503c66dc4a76768 | ahead 0 behind 0 | 0 | At 34b76b8: tools/test-sessions.mjs three committed-fixture tests (note and handoff force-added past the ignore rule and committed). Red first on the claim tree for Wiki source/link, project-evidence source and Spec/Task-record link citations (untracked-provenance absent, prepareEvidence returned prepared); green after workbench-paths liveRecordPath plus the wiki, project-evidence and spec-workbench checks. Already held and now proved on committed records: notepad append privacy refusal, sessions scan and promote privacy refusal, promote citation refusal, ADR untracked-provenance, clean removal back to the doctor baseline. Full 48-command AGENTS suite TOTAL pass=48 fail=0 on committed candidate 34b76b8; guardrail 106.6/113 unchanged (templates and controls untouched); doctor no blocking finding | Code comments in workbench-paths.mjs, spec-workbench.mjs, wiki.mjs, project-evidence.mjs and sessions.mjs, and the diagnostics.mjs untracked-provenance summary, updated to say a live record is working context even when committed; promote and ADR refusal messages reworded from ignored/untracked to live record. No control, template or Wiki change: RUNBOOK's ADR validate paragraph is now narrower than the tool (wording recorded in Remaining gap, held on S-00P) | Box 3 stays open for TK-01K. (1) A tracked notepad still fails the manifest's live-record ignore check (workbench-layout.mjs verifyNotepadIgnores: the published and leaked checks over notepads and recovery), so doctor reports invalid-manifest until TK-01K lifts it; TK-01K must lift that check for notepads alongside workbench/sessions/.gitignore, keep recovery ignored, and then update the test-sessions pin. Committed handoffs already pass. (2) Needed RUNBOOK wording (ADR validate paragraph, replacing the untracked-provenance clause): untracked-provenance for a link into a live session collection (sessions/grilling, sessions/handoffs, sessions/notepads outside notepads/templates, sessions/recovery), committed or not; doctor reports the same code for a Spec or active Task record link and for a Wiki source path or body link, and project-evidence prepare refuses such a source as non-durable-source. | 588110b294d468aceff5a7ea73b5b6fde262109c4f4b9b76c8180ce585085f24 |

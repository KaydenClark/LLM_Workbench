# S-026 - Workflow Composition, Feedback Lane, And Cold Resume

> Linked v3.1 capability promoted on 2026-09-04. Stable path
> `workbench/specs/S-026-workflow-composition-and-cold-resume/SPEC.md`; never
> move it between status folders.

**Spec ID:** S-026
**Status:** complete
**Priority:** 4
**Owner:** claude-fable-5-1
**Updated:** 2026-09-04
**Catalog description:** Route the twelve core skills and feedback discovery through the schema 2 manifest, promote session records through privacy-checked checkpoints, and prove the composed planning-to-resume workflow mechanically.
**Blockers:** none
**Latest event:** Spec completed and removed from the hot board.
**Next gate:** none

## Outcome

The twelve core skills resolve every path through the manifest: runtime tools
in the tools lane, live notepads in `sessions/grilling`, handoffs in
`sessions/handoffs`, and durable copies in `sessions/checkpoints` after a
privacy check. Feedback lives in the feedback lane and discovery prefers it.
A mechanical round-trip test proves that a planning checkpoint pushed before
implementation can be resumed from a fresh clone with Foundry absent.

## Why It Matters

`make-it-so` already promises the complete runway, but nothing executed it end
to end, and three skills still hardcoded a hidden private notepad path. A
public release must prove the composition it advertises with the paths it
declares.

## Current Verified State

- `grilling`, `checkpoint`, and `make-it-so` name `.agents/grilling diary/`;
  `checkpoint` commits into the v3.0 handoff lane.
- All skills and templates run `node tools/spec-workbench.mjs`.
- `feedback-automation.mjs` discovers `WORKBENCH_FEEDBACK.md` or the legacy
  name at a project root only.
- `test-skill-catalog.mjs` and `test-delivery-skills.mjs` scan contracts;
  no test executes the composed workflow.

## Desired Behavior

- Skills: `grilling` writes to the manifest `grilling` collection;
  `checkpoint` promotes through `workbench/tools/sessions.mjs checkpoint`,
  which scans for secrets, absolute home paths, and private tokens before
  copying into `checkpoints/`; `make-it-so` resolves notepads and checkpoints
  through the manifest; all skills run `node workbench/tools/spec-workbench.mjs`
  and name ADRs only through the `adr` collection.
- Feedback: generated projects carry `workbench/feedback/WORKBENCH_FEEDBACK.md`;
  discovery prefers the manifest lane and still accepts legacy root files;
  Adoption moves a root feedback file into the lane; the root keeps exactly
  seven controls.
- Round trip (`tools/test-workbench-round-trip.mjs`): bare remote, Genesis
  from the candidate, spec and claim, pushed planning checkpoint, clone
  destroyed, fresh clone resumes through `doctor`, `next`, `show`, implements
  a trivial slice red/green, closes, renders, passes doctor, pushes; the
  environment is scrubbed of Foundry variables and the transcript is scanned
  for Foundry paths.

## Decisions And Contracts

- Rationale: [ADR-0028](../../docs/adr/0028-live-session-records-stay-untracked-and-checkpoints-are-durable.md),
  [ADR-0031](../../docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md).
- The mechanical round trip is deterministic and provider-free; the
  cross-provider proof with real agents belongs to S-022/TK-002.
- The privacy scan is fail-closed: a hit stops promotion with the matching
  line number and never writes a partial checkpoint.

## Non-Goals

- Changing the generic `/handoff` skill or router skills outside the core.
- Scheduler or automation adapters; GPT_OS owns those.

## Dependencies And Blockers

- S-023/TK-002 supplies the tools lane every skill resolves.
- S-024/TK-001 supplies the diagnostic effects `next` and `claim` enforce.

## Vertical Implementation Slices

Tickets are temporary tracer bullets within this stable capability record.

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | The twelve skills resolve tools, notepads, handoffs, and checkpoints through the manifest, and `sessions.mjs checkpoint` promotes a privacy-checked copy | done | none | Red: the sessions test failed before workbench/tools/sessions.mjs existed and the skill catalog failed on retired paths. Green: 2 sessions tests (a clean untracked notepad promotes byte for byte below one stamp into workbench/sessions/checkpoints with mode 0644 and a refused duplicate; token, absolute home path, and email content is refused with the offending line, nothing is written, a symlink source is refused, and the CLI exits 1), the skill catalog and delivery contracts with the twelve skills naming only manifest-resolved paths, the consumer scan now covering skills, and the full 29-command union suite |
| TK-002 | Feedback lives in the feedback lane, discovery prefers it, Adoption relocates a root file, and the root keeps exactly seven controls | done | TK-001 | Red: feedback discovery ignored a lane-only project and the templates still linked a root feedback file. Green: feedback discovery finds workbench/feedback/WORKBENCH_FEEDBACK.md, prefers the manifest lane over a root file, and still accepts legacy root names (6 canonical repos, recurrence 6); the template regression proves the project README and Genesis route feedback to the lane with no root link; adoption relocation was proven in S-023/TK-003; full 29-command union suite |
| TK-003 | The mechanical round-trip test proves planning, interruption, and clean-clone resume with Foundry absent | done | TK-002, S-024 | Red: the round-trip test failed on the slice invocation before the harness matched the fixture. Green: tools/test-workbench-round-trip.mjs proves bare remote, mechanical Genesis with this candidate's tools, validate --genesis and doctor green, an untracked notepad promoted to a checkpoint, a claimed slice, a pushed planning checkpoint with the notepad absent from the commit, deletion of the working clone, a fresh-clone resume with a scrubbed environment that selects the in-progress slice from repository state, a red then green slice, close, render, doctor, push, remote read-back, and no Foundry name, mechanism, or private home path in the clone or transcript; full 30-command union suite |

## Acceptance Criteria

- [x] No core skill or template names `.agents/grilling diary/`, a root `specs/`, or a root runtime-tool path.
- [x] `sessions.mjs checkpoint` refuses secret-like content, absolute home paths, and private tokens, and writes nothing on refusal.
- [x] Feedback discovery finds a manifest-lane file, prefers it over a root legacy file, and Adoption relocates the root file.
- [x] The round-trip test passes deterministically with Foundry variables scrubbed and no Foundry path in any transcript.
- [x] Full union suite, render, doctor, and `git diff --check` pass.

## Testing Seams

- Skill contract scan with required and forbidden patterns.
- Sessions CLI: JSON results with registered codes and byte-identical copies.
- Feedback discovery fixture with lane and root files.
- Round trip: bare remote fixture and transcript scan.

## Verification Procedure

```bash
node tools/test-skill-catalog.mjs
node tools/test-sessions.mjs
node tools/test-feedback-automation.mjs
node tools/test-workbench-round-trip.mjs
```

Then the complete `RUNBOOK.md` union suite, render, doctor, and `git diff --check`.

## Documentation Impact

- Skills own their contracts; `skills/README.md` owns the catalog.
- `RUNBOOK.md` owns the checkpoint, feedback, and round-trip commands.
- `templates/README.md` and `templates/WORKBENCH_FEEDBACK.md` reflect the lane.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-04 | plan | Released the first ticket's S-023 blocker: S-023/TK-001 through TK-004 landed the schema 2 layout, collections, sessions ignore file, and tools lane this slice depends on, while S-023 itself completes only after S-026/TK-001 re-points the skills; keeping a whole-spec blocker here would deadlock selection | `next --json` returned null with every first ticket blocked on an uncompletable S-023; doctor green | Ticket blocker only; requirements unchanged | Implement TK-001 |
| 2026-09-04 | plan | Captured the workflow composition, feedback lane, and cold-resume capability from the promoted v3.1 plan | Baseline suite green at the landed S-015 SHA; no capability behavior verified yet | Spec added; skills, templates, and Runbook change with their tickets | Implement TK-001 through TK-003 after S-023/TK-002 and S-024/TK-001 |
| 2026-09-04 | TK-001 | Ticket closed | Red: the sessions test failed before workbench/tools/sessions.mjs existed and the skill catalog failed on retired paths. Green: 2 sessions tests (a clean untracked notepad promotes byte for byte below one stamp into workbench/sessions/checkpoints with mode 0644 and a refused duplicate; token, absolute home path, and email content is refused with the offending line, nothing is written, a symlink source is refused, and the CLI exits 1), the skill catalog and delivery contracts with the twelve skills naming only manifest-resolved paths, the consumer scan now covering skills, and the full 29-command union suite | Rewrote checkpoint; updated grilling, make-it-so, to-docs, genesis, adoption, update-harness, implement, to-spec, to-tickets; added the Session Records And Checkpoints section to AGENTS.md and templates/AGENTS.md and the Session Checkpoints section to RUNBOOK.md; ADR-0028 accepted; register regenerated | Feedback lane and discovery are TK-002; the mechanical round trip is TK-003 |
| 2026-09-04 | TK-002 | Ticket closed | Red: feedback discovery ignored a lane-only project and the templates still linked a root feedback file. Green: feedback discovery finds workbench/feedback/WORKBENCH_FEEDBACK.md, prefers the manifest lane over a root file, and still accepts legacy root names (6 canonical repos, recurrence 6); the template regression proves the project README and Genesis route feedback to the lane with no root link; adoption relocation was proven in S-023/TK-003; full 29-command union suite | Updated templates/README.md, templates/GENESIS.md, templates/WORKBENCH_FEEDBACK.md, README.md, and the RUNBOOK.md discovery paragraph | The mechanical round trip is TK-003 |
| 2026-09-04 | TK-003 | Ticket closed | Red: the round-trip test failed on the slice invocation before the harness matched the fixture. Green: tools/test-workbench-round-trip.mjs proves bare remote, mechanical Genesis with this candidate's tools, validate --genesis and doctor green, an untracked notepad promoted to a checkpoint, a claimed slice, a pushed planning checkpoint with the notepad absent from the commit, deletion of the working clone, a fresh-clone resume with a scrubbed environment that selects the in-progress slice from repository state, a red then green slice, close, render, doctor, push, remote read-back, and no Foundry name, mechanism, or private home path in the clone or transcript; full 30-command union suite | RUNBOOK.md gained the Composed round trip section; AGENTS.md and RUNBOOK.md suite lists updated | The real cross-provider resume with agents is S-022/TK-002 |
| 2026-09-04 | spec | Spec completed | Acceptance gates satisfied | Documentation impact recorded above | none |

## Completion Result

Completed on `claude/v3.1-release`. The twelve core skills resolve runtime
tools, live notepads, handoffs, checkpoints, and decision records through the
manifest; `workbench/tools/sessions.mjs checkpoint` promotes a privacy-checked
copy into the tracked checkpoints collection and writes nothing on refusal;
feedback lives in the feedback lane, discovery prefers it, and Adoption
relocates a root file; and `tools/test-workbench-round-trip.mjs` proves the
composed planning, interruption, and clean-clone resume mechanically with
Foundry absent on every full verification run.

## Remaining Limitations Or Follow-Up Specs

- Real cross-provider resume proof is owned by S-022/TK-002.

## Supersession

- Supersedes: none
- Superseded by: none

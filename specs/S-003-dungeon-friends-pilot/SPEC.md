# S-003 - Prospective Dungeon Friends Pilot

**Spec ID:** S-003
**Status:** planned
**Priority:** 9
**Owner:** unassigned
**Updated:** 2026-07-17
**Catalog description:** Run a later preregistered Dungeon Friends pilot through the completed outcome-measurement apparatus and project-owned acceptance.
**Blockers:** S-017
**Latest event:** Portfolio-wide authorization removed the old read-scope gate; the pilot now waits on the controlled outcome-measurement capability and project-owned checkpoint.
**Next gate:** Revisit after S-017 completes and the Dungeon Friends project records a stable candidate checkpoint.

## Outcome

Test the proven Workbench lifecycle prospectively in Dungeon Friends without
rewriting its historical task records.

## Why It Matters

A complex downstream project is the right later validation surface, not the
first migration target.

## Current Verified State

- Dungeon Friends was not inspected or modified during S-001.
- Kayden's 2026-07-17 portfolio-wide `make it so` request explicitly authorized
  project-local canon/spec work, superseding this spec's earlier lack-of-read-scope note.
- The Workbench still lacks the completed multi-task, uncertainty-aware, real-agent
  measurement capability now owned by S-017.
- Dungeon Friends implementation and playtest truth remain owned by its project,
  not this Workbench spec.

## Desired Behavior

Define a bounded prospective pilot from a stable Dungeon Friends checkpoint,
preregister its conditions and acceptance, run it through S-017, and preserve
Kayden's subjective fun/replay verdict as a distinct owner gate.

## Decisions And Contracts

- Workbench owns only the comparison design and measurement result.
- Dungeon Friends owns its source, harness upgrade, gameplay proof, and project spec.
- No model/API spend occurs until the S-017 owner gate is approved.
- Automated scores never replace Kayden's game-feel or replay verdict.

## Non-Goals

- Implementing or upgrading Dungeon Friends from the Workbench repository.
- Treating automated task scores as Kayden's fun, replay, or game-feel verdict.
- Using uncommitted local scene state as a supposedly reproducible trial input.

## Dependencies And Blockers

- S-001 complete.
- S-017 complete.
- One remotely recoverable Dungeon Friends candidate commit linked from its
  owning stable capability spec.
- A project-owned acceptance packet that names the preserved local
  `project.godot` scene override and proves the trial commit does not overwrite it.
- S-017/TK-004 owner approval for the bounded model/API spend before TK-002.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Preregister the Dungeon Friends pilot against one stable project checkpoint | deferred | S-017 | pending |
| TK-002 | Run the approved baseline and candidate comparison without changing the game | deferred | TK-001 | pending |
| TK-003 | Record the measured result separately from Kayden's playtest verdict | deferred | TK-002 | pending |

### Deferred Ticket Contracts

- **TK-001 outcome:** one preregistration names the immutable project SHA,
  candidate change, tasks, graders, conditions, provider/model, permissions,
  trial count, analysis, and stop rules. **Done proof:** project-owned candidate
  checkpoint plus an S-017-compatible no-spend dry run. **Owner gate:** none
  beyond the already-authorized project scope.
- **TK-002 outcome:** the approved comparison runs without editing the candidate
  during measurement. **Done proof:** exact-SHA result rows, deterministic grader
  output, environment identity, trial counts, and complete Workbench verification.
  **Owner gate:** bounded model/API spend approval inherited from S-017/TK-004.
- **TK-003 outcome:** the evidence ledger records the measured positive,
  negative, or inconclusive result while the Dungeon Friends project separately
  records Kayden's fun/replay verdict. **Done proof:** linked immutable report and
  project evidence with no claim conflation. **Owner gate:** Kayden supplies the
  subjective gameplay verdict only when the project asks for it.

## Acceptance Criteria

- [ ] The pilot names one immutable project checkpoint, conditions, task prompts,
      graders, model, permissions, trial count, and analysis before execution.
- [ ] Workbench measurement and Dungeon Friends gameplay acceptance remain distinct.
- [ ] Results disclose uncertainty, limitations, and any inconclusive finding.

## Testing Seams

- **Identity seam:** exact Dungeon Friends candidate SHA, clean isolated trial
  checkout, owning project spec, and unchanged canonical remote.
- **Condition seam:** identical prompt, fixture, model family, permissions, time
  budget, and deterministic grader across baseline and candidate.
- **Measurement seam:** S-017's multi-task report records task class, sample size,
  uncertainty, failures, and synthetic exclusion.
- **Project-safety seam:** the project-owned acceptance packet proves the local
  `project.godot` override remains outside trial mutation.
- **Owner seam:** Workbench evidence and Kayden's separate fun/replay verdict are
  linked but never collapsed into one automated score.

## Verification Procedure

```bash
git -C /Users/kayden/GPT_OS/Projects/Dungeon_Friends_Game rev-parse HEAD
git -C /Users/kayden/GPT_OS/Projects/Dungeon_Friends_Game status --short
node tools/test-outcome-trials.mjs
node tools/test-eval-runner.mjs
python3 evals/tasks/task_b_path_safety/test_grade.py
node tools/spec-workbench.mjs doctor
```

## Documentation Impact

- Future pilot spec only.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-07-17 | canon harvest | Removed the obsolete authorization blocker and decomposed the prospective pilot | Current portfolio authorization, S-017 plan, and project-ownership boundary reviewed | Updated S-003 only; no Dungeon Friends files were read or changed in this Planner lane | S-017 and a project-owned candidate checkpoint |
| 2026-07-17 | audit remediation | Replaced future-authorization placeholders with concrete project, measurement, safety, and owner seams | S-003 dependencies checked against S-017 and the settled Dungeon Friends dirty-override boundary; render, doctor, full planning verification, and diff check passed | Updated S-003 only; no Dungeon Friends files were read or changed | S-017 completion, pushed project candidate, acceptance packet, and approved trial spend |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Entire pilot remains intentionally unstarted until S-017 and the project checkpoint exist.

## Supersession

- Supersedes: none
- Superseded by: none

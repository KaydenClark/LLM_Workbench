---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - S-01O planning packet, 2026-09-24
  - S-01O TK-01F source change and fresh-context scenario, 2026-09-26
source_paths:
  - workbench/skills/save/SKILL.md
  - workbench/specs/S-01O-save-skill-rebuild/SPEC.md
  - workbench/specs/S-00R-core-skill-lifecycle-and-optional-source-disposition/SPEC.md
  - tools/test-skill-catalog.mjs
  - tools/test-core-composition.mjs
  - RUNBOOK.md
last_verified: 2026-09-26
---

# Save: persist authorized work and prove where it landed

Use `save` when work that is already authorized needs to survive: tracked changes committed and pushed, supported truth routed to its owner, and unresolved context kept where the next agent can find it. Its value is the recovery claim at the end. A save names the exact commit and the remote ref proven to contain it, or it says plainly that the work is only local. Save adds no authority. It does not promote on its own initiative, start implementation, merge a pending review or publish to `main`.

**Inputs:** work the current request or assigned Spec already authorizes, the project's Git policy, and any local note for the objective. **Output:** updated durable owners, a commit on the allowed task branch, a remote containment proof when pushing is authorized, and a note that still holds whatever remains unresolved. **Done when:** the completion report names the owners, the exact full commit SHA, the remote ref that contains it (or the local-only recovery point and why), the checks run, the unresolved notes kept locally, any pending boundary and the next action.

## How it works

The [skill](../skills/save/SKILL.md) runs five steps in order.

1. **Inventory and keep working context.** Only already-authorized work is in scope. Unresolved context, corrections and the next action go to the objective's local note through [notepad](skill-notepad.md). Live notes stay in the manifest-declared ignored collections and never enter project Git.
2. **Route durable truth.** Settled truth goes to its existing owner through `to-docs`; selected note material goes through `promote` under the same authorization. Save never creates an owner, decision or assignment just to have something to save. [S-00R](../specs/S-00R-core-skill-lifecycle-and-optional-source-disposition/SPEC.md) owns the shared wording that keeps persistence, promotion and documentation routing apart.
3. **Verify and record.** Run the owning checks and append proof to the assigned Spec without rewriting earlier rows. Evidence cites durable owners and the exact commit the checks ran on. It never cites an ignored live path such as a note, handoff or recovery file.
4. **Commit, push and prove containment.** Stage only the named files, commit on the task branch and push when that boundary is authorized. Then fetch and check `git merge-base --is-ancestor <commit> <remote>/<branch>` against the freshly fetched ref. Tip equality is not the test: another writer can advance the branch and the commit is still safe. A failed push or fetch is pending recovery, never confirmation.
5. **Keep transport separate.** Optional private-session transport reports its own acknowledgment. Local bytes alone never prove remote or cross-device recovery, and transport never moves unpushed code.

**Finishing a Task is not reconciliation.** The note keeps its unresolved items until they reach a durable owner. Cleanup composes `notepad` only after verified reconciliation.

### Example, from the verification run

In the S-01O scenario, a scratch room had a finished Task: code and test changes that passed, not yet committed. Its note held an undecided owner question about localized greetings. The owner said "Save it." The agent committed the code and then the Spec proof as separate commits on the task branch. The proof row named the exact commit the tests ran on. It pushed, fetched and ran `git merge-base --is-ancestor` for both commits against the fetched remote ref, then reported both full SHAs and the containing ref. The localized-greetings question stayed in the ignored note and did not go into the Spec, because the owner had not decided it. The agent also reported that review and integration were still pending.

Another writer then pushed on top of the branch, and the owner asked whether the work was still safe and told the agent to merge it into `main`. The agent fetched again. It showed that both commits were still ancestors of the new tip, even though the tip was no longer its own, and it made no new commit. It declined the merge because the project contract makes `main` owner-only after review. It recorded the refusal and the new commit on the branch as unresolved items in the note. `main` and `integration` were untouched.

## Composition

`save` is the persistence end of several workflows. [RUNBOOK behavior selection](../../RUNBOOK.md#behavior-selection) routes delivery through `carry` with `implement`, independent review and `save`. It routes reconciliation through `promote` with `to-docs` and `save`. `promote` passes its already-promoted result to save, so save does not promote it again. `make-it-so` composes save for the achieved documents under the authorized endpoint. Working context comes from [notepad](skill-notepad.md). Save supplies the commit and containment that the integration review and owner Human QA later judge. It performs neither.

## Verified behavior and limits

**Verified 2026-09-26:** `tools/test-skill-catalog.mjs` pins the source wording for fresh-fetch containment, the exact full SHA, the ban on citing ignored live paths, and notes surviving a finished Task. It also excludes the old tip-equality wording. `tools/test-core-composition.mjs` characterizes the procedure against a real local bare remote: a pushed commit stays contained after another writer advances the tip, an unpushed commit is not contained, and the unresolved note stays ignored, off the remote and readable. That characterization passed before the source changed, so no runtime defect was found. One fresh-context agent, given only the skill source and a scratch room, followed the contract in the scenario above. The turn-by-turn record is in the [Spec evidence](../specs/S-01O-save-skill-rebuild/SPEC.md#append-only-evidence-and-execution-log).

**Limits:** that was one run with one model, against an owner scripted by the implementing agent. It is not owner Human QA and not a repeated trial. The owner turns reached the agent through its parent agent, and it cited that as one extra reason to decline the merge, besides the contract and the skill. The scratch Spec lacked the room's Spec ID header, so `doctor` failed there, and the agent reported this instead of rendering. Save has no runtime of its own. The containment check is a Git procedure the agent runs, and no tool enforces it. Private-session transport acknowledgment was not exercised. Installed personal copies of the skill are not updated by this source change. Shared lifecycle wording on persistence versus promotion belongs to S-00R and is not restated here.

## Sources

- [Save source](../skills/save/SKILL.md)
- [Individual delivery Spec](../specs/S-01O-save-skill-rebuild/SPEC.md)
- [Core skill lifecycle: S-00R](../specs/S-00R-core-skill-lifecycle-and-optional-source-disposition/SPEC.md)
- [Runbook: portable save, promote and room-local skills](../../RUNBOOK.md#portable-save-promote-and-room-local-skills)
- [Runbook behavior selection](../../RUNBOOK.md#behavior-selection)
- [Wiki router](MEMORY.md)

## History

- 2026-09-26: Created as the individual skill article. S-01O TK-01F stated fresh-fetch remote containment, the exact full SHA, durable-only evidence citations and note survival in the source, and recorded one fresh-context scenario.

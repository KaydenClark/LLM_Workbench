---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - S-01C (carry skill rebuild Spec) TK-00T (Deliver the carry skill destination Task) source change and fresh-context scenario, 2026-10-01
  - Workbench-native core skill since f93c8a4f (S-049 (Assignment Ownership And The Coordination Record Spec), 2026-09-07), no third-party upstream
source_paths:
  - workbench/skills/carry/SKILL.md
  - workbench/specs/S-01C-carry-skill-rebuild/SPEC.md
  - workbench/specs/S-049-assignment-ownership-and-coordination-record/SPEC.md
  - tools/test-skill-catalog.mjs
  - workbench/skills/implement/SKILL.md
  - workbench/skills/save/SKILL.md
  - LEXICON.md
  - RUNBOOK.md
last_verified: 2026-10-01
---

# Carry: take assigned work to its authorized endpoint

Use `carry` when a Spec or Task is already assigned and the only open question is whether it reaches the endpoint its authorization already covers. It is the delivery route in [RUNBOOK behavior selection](../../RUNBOOK.md#behavior-selection): `carry` with `implement`, verification, independent integration review and `save`. It is not a selector. With no Spec or Task named it says so and stops, because choosing work is `next`'s job and inventing a queue item is what `AGENTS.md` forbids.

**Inputs:** the named Spec or Task, and whatever the project already records about it: the `SPEC.md`, the Task's `TASK.md` with its receipt rows, the objective's local JSON notepad, the controls and the cited source and tests. **Output:** the Task closed with named proof, the owning documentation updated, the candidate committed on its task branch and proven contained in a remote ref, and a row in the Spec's evidence log for every coordination hand-back the run cost the owner, or an explicit zero. **Done when:** the authorized endpoint is reached and proved, the owning records are accurate, and the hand-backs are recorded where the next agent will read them. Reaching the endpoint with the hand-backs unrecorded is an incomplete carry.

## How it works

The [skill](../skills/carry/SKILL.md) grants nothing. It does not widen scope, relax a safety limit or turn an unapproved action into an approved one. It changes one thing: where the burden of proof sits when the agent is about to stop. Under carry, stopping to ask is the exception that has to justify itself.

- **Recover before asking.** The agent reads the assigned `SPEC.md` whole, then the Task's own record: its `TASK.md` and the receipt rows appended there while earlier runs were still in progress. An interrupted run leaves its trace in those rows and in the objective's notepad, so the next run resumes from that trace instead of restarting the slice. Canon and verified Actuality are reconciled first; a stale record the agent can repair in its owner is not a question for the owner.
- **Name the endpoint out loud.** Before starting, the run says where it stops: typically the Task closed with proof, documentation updated and the work merged into the declared integration branch. Promotion from that branch stays owner-only. Stopping short of an already-authorized step and reporting progress as completion is the failure this skill exists to remove.
- **Run through the existing contracts.** `implement` for the red/green loop, `tracer-bullet` when a slice needs cutting, `to-docs` for changed truth, `code-review` for the separate-context gate, and `save` for persistence. A receipt is recorded while the Task is still in progress, so an interruption leaves a trace. The candidate is then saved, not merely committed: named files staged, commit on the task branch, push, and containment proved with `git merge-base --is-ancestor` against the freshly fetched ref. A failed or unavailable push is pending recovery, never confirmation.
- **The gate on asking.** The owner is asked only for one of four things: a **preference** the sources do not record, a **tradeoff** that changes architecture, a public contract or reversal cost, an **authorization** outside standing permission, or an **unavailable resource** only the owner holds. `AGENTS.md` Safety And Change Control is the governing gate; these four restate it and never widen it. Anything else is resolved from the sources or recorded as a blocker with the specific missing thing named.
- **The review gate carry cannot supply.** A green suite and the agent's own reading are not a PASS. Where no separate context is available to review the candidate, that is an unavailable resource: a reason to stop and say so, never a reason to merge.
- **Every hand-back is a row.** A coordination hand-back is a point where the owner had to supply something that was not one of the four reasons: a settled decision repeated, evidence already in the project located, a routine finding reconciled, an authorized step prompted. Each is recorded per occurrence in the Spec's `Append-Only Evidence And Execution Log` with its cause classified as *missing*, *inaccessible*, *incorrect* or *simply not followed*, and the smallest supported correction made in the existing owner. A hand-back is never answered with a new framework, store or always-loaded document.

### Example, from the verification run

In the S-01C (carry skill rebuild Spec) scenario, a fresh agent was given only the carry source text and a small fixture room with one Spec, S-001 (the fixture room's notebook-cli Spec), whose Task TK-001 (fixture notes-lookup Task) (`findNotes`) an earlier run had left in progress: two failing tests and a throwing stub committed and pushed, a receipt row saying red observed and green pending, and a notepad with the next action. The agent found the Task's state in that receipt row and notepad and did not restart the slice. `doctor` also failed on `render-drift`, because the earlier run had recorded its receipt without re-rendering the board. The agent re-ran `render` in its owner and moved on, treating a stale record it could repair as no question for the owner. It implemented `findNotes` (three tests passing), added the README example the Spec's decisions required, recorded a second receipt, pushed, and closed the Task with proof. After a fresh fetch it proved the closing commit contained in the remote task branch with `git merge-base --is-ancestor`. Then it stopped: the room's controls require a separate-context review before `integration`, no reviewer existed in the run, and it named that as an unavailable resource rather than merging. It recorded zero coordination hand-backs in the Spec's evidence log, left the acceptance boxes unchecked pending review, and named the exact base and head SHAs the reviewer needs.

## Composition

- Composes [`implement`](../skills/implement/SKILL.md) for one Task's red/green loop, [`code-review`](../skills/code-review/SKILL.md) for the separate-context gate, [`to-docs`](../skills/to-docs/SKILL.md) for changed truth, and [`save`](../skills/save/SKILL.md) for the commit, push and containment proof. Working context comes from [notepad](skill-notepad.md).
- Is composed by [make-it-so](skill-make-it-so.md), which continues into carry only where implementation is authorized. A [handoff](skill-handoff.md) names an endpoint that carry cannot expand.
- Differs from `implement`, which owns one eligible Task and may pick it up through `next`. Carry owns whatever unit the owner named, Spec or Task, and selects nothing. It differs from the Reviewer stance, which it needs but cannot be.

## Upstream relationship

Carry is Workbench-native. It entered at [`f93c8a4`](https://github.com/KaydenClark/LLM_Workbench/commit/f93c8a4f) as the seventeenth core-bundle skill under [S-049](../specs/S-049-assignment-ownership-and-coordination-record/SPEC.md), whose point was the measurement: one carried assignment produced zero coordination hand-backs, and that Spec's completion result says plainly that one run is an anecdote. There is no third-party upstream in [THIRD_PARTY_NOTICES](../../THIRD_PARTY_NOTICES.md). The [LEXICON](../../LEXICON.md) entry for *Coordination hand-back* names carry as the recorder and still agrees with the source.

## Verified behavior and limits

**Verified 2026-10-01:** the source at S-01C (carry skill rebuild Spec)'s green commit `aef6c158` names the Task record and its receipt rows as the recovery trace, the in-progress receipt command, and `save` with containment proof. `tools/test-skill-catalog.mjs` pins that wording (red `c2400c50`, green `aef6c158`). One fresh-context agent, given only the skill text, resumed an interrupted Task from its receipt and notepad, reached green, closed with proof, proved remote containment, recorded zero hand-backs and stopped at the review gate with the exact candidate named. Its evidence is in the [Spec evidence](../specs/S-01C-carry-skill-rebuild/SPEC.md#append-only-evidence-and-execution-log).

**Limits:** that was one run with one model (Claude Opus 5.5) against a fixture the implementing agent authored; it is not owner Human QA and not a repeated trial. The room's remote was a local bare repository, so the push proved the mechanism and not a public recovery boundary. The absence of a reviewer was a stated condition of the run, not something the agent discovered. The agent still received its host's default instructions. No tool parses the hand-back rows or the receipt text, so both are wording contracts, not machine formats. Installed personal copies of the skill are not updated by this source change.

## Sources

- [Carry source](../skills/carry/SKILL.md)
- [Individual delivery Spec](../specs/S-01C-carry-skill-rebuild/SPEC.md)
- [Origin Spec S-049](../specs/S-049-assignment-ownership-and-coordination-record/SPEC.md)
- [Coordination hand-back in LEXICON](../../LEXICON.md)
- [Runbook behavior selection](../../RUNBOOK.md#behavior-selection)
- [Wiki router](MEMORY.md)

## History

- 2026-10-01: Created by S-01C (carry skill rebuild Spec) TK-00T (Deliver the carry skill destination Task) with Task-record recovery, in-progress receipts and `save` composition with containment proof delivered in the source, and one fresh-context scenario recorded.

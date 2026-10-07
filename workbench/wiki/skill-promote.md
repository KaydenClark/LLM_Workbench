---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - S-01B (promote skill rebuild Spec) TK-00S (Deliver the promote skill destination Task) source change and fresh-context scenario, 2026-09-26
  - S-004C (Contract Carrier Pointer-Brief Rewrite Spec) TK-005F (Move the continuity and promotion operations behind their pointers Task) moved the Runbook procedure behind its index pointer into the skill, 2026-10-03
source_paths:
  - workbench/specs/S-005C-promote-confirmed-decisions/SPEC.md
  - workbench/docs/adr/001A-promote-publishes-confirmed-documentation-specs-and-task-plans-before-implementation.md
  - workbench/skills/promote/SKILL.md
  - workbench/tools/sessions.mjs
  - workbench/specs/S-01B-promote-skill-rebuild/SPEC.md
  - tools/test-direct-promotion.mjs
  - tools/test-skill-catalog.mjs
  - tools/test-core-composition.mjs
  - RUNBOOK.md
last_verified: 2026-10-07
---

# Promote: publish confirmed decisions and their plans

Promote carries a confirmed concept out of one conversation and into shared Workbench state. It coordinates durable documentation, capability Specs and authorized Task plans, publishing each stage to integration before later work depends on it. The [skill](../skills/promote/SKILL.md#steps) owns the ordered procedure; the [accepted decision](../docs/adr/001A-promote-publishes-confirmed-documentation-specs-and-task-plans-before-implementation.md) explains the choice.

**Inputs:** the confirmed selection, rationale, corrections and endpoint. **Outputs:** checked durable owners, published records, integration read-back and retained unresolved context. **Done when:** every applicable stage reaches its named endpoint, with actual publication evidence and the next eligible action clear. A docs-only or Specs-only request stops there; a selected-note caller keeps its inherited scope.

For example, a confirmed report-naming decision first reaches its Runbook owner and integration. A new report-generator capability then gets a planned Spec, published separately. Full promotion activates and publishes its Task plan from live Actuality, leaving Tasks unclaimed. Unfinished generator code can remain on a different branch throughout. Publishing the plan does not establish that the generator works.

## Parent workflow and publication

Explore groups Idea and Align and may pause with pending questions. Promote starts with the confirmed bounded scope and coordinates `to-docs`, `to-spec` and `to-tasks` with publication between them. Full promotion carries planning and activation authority; a nearer endpoint limits it. It can use bounded contexts and handoffs, with one writer per shared owner.

The [publication action](../skills/promote/references/publication.md) uses the existing save, PR, review and containment route. Local application, branch recovery and integration availability are different boundaries. A resumed chat inspects the live records, PR and fresh integration ref to reuse a published stage or continue an unmerged one. Shared integration state is available to other sessions; automatic agent refresh remains separate work.

## Selected-note reconciliation

The [conditional procedure](../skills/promote/references/selected-claims.md) retains the selected-note safeguards. The [direct owner promotion command](../skills/promote/SKILL.md#command-reference), documented in the skill's command reference and run by the [shared runtime](../tools/sessions.mjs), owns the checked write.

- **Only confirmed claims move.** The agent reads the note's current view, the selected entries and all their corrections and dependencies. It keeps open, tentative, withdrawn and superseded status as recorded. Pending meaning is read the way [notepad](skill-notepad.md) records it. A `source_record` whose readback is still listed in `current.unresolved` is pending, however settled it sounds. Only a `decision` entry records a confirmed owner answer. A mixed note promotes its confirmed claims and leaves the rest.
- **One owner per claim.** `to-docs` picks exactly one durable owner for each accepted claim. When another owner needs the claim, it links to that owner instead of holding a second copy.
- **A draft inside the project, out of Git.** The agent writes the complete proposed owner bytes to a draft. The command refuses a draft outside the project, and a tracked path would dirty the tree, so the draft goes in an ignored path such as `workbench/sessions/recovery/`. The draft is disposable text, not a note or evidence. The agent never copies the note wholesale, and never cites an ignored note as durable proof.
- **A checked write.** `sessions.mjs promote` checks the source revision and the destination's SHA-256. It carries corrections and dependencies of the selected entries as context. It refuses private content and citations of ignored live records, validates the owner's structure, writes, and reads the bytes back. It never commits, never rewrites the source, and never cleans up. Tool success proves structure and bytes, not semantic fidelity.
- **The note keeps what is unsettled.** The agent appends a record naming the destination. Each pending entry and its `current.unresolved` item stay in place, because promotion does not confirm them. `notepad` trim runs only for material that has landed and that nothing retained still needs.

### Example, from the verification run

In the S-01B (promote skill rebuild Spec) scenario, a note about nightly reports held two questions. On naming, the owner's first answer was read back as `ROOM-YYYY-MM-DD.md`. The owner corrected it to date-first, and a `decision` recorded the confirmed name. On retention, the owner had said "a month or so, I have not really thought about it". That was saved as a `source_record` with a 30-day readback, still listed in `current.unresolved`. The owner said: "put what we settled about nightly reports into the RUNBOOK Reports section."

The fresh agent selected the naming decision and its correction, and the command brought the first readback along as context. The agent wrote the draft in `workbench/sessions/recovery/`, promoted it, verified the new hash and read the bytes back. The Runbook gained only the corrected, date-first naming rule. Retention stayed out. The agent appended a `verification` entry naming `RUNBOOK.md` and both hashes, and left the retention entry and its unresolved item untouched. It deleted the draft and asked the owner to confirm or correct the retention readback.

## Composition

`grilling` can exit into full Promote once the owner confirms a concept, or a nearer promotion endpoint for selected decisions. `save` and `make-it-so` retain the scope their callers already carry. The selected-note procedure passes the already-promoted result to save so composition does not recurse. [Notepad](skill-notepad.md) supplies source corrections and pending versus confirmed meaning; the parent workflow does not turn pending answers into decisions.

## Verified behavior and limits

**Verified 2026-09-26:**
- `tools/test-direct-promotion.mjs` covers the command's checks and recovery paths. It now includes a characterization of a mixed note: promoting a `decision` does not carry an unrelated pending `source_record` as context, and the note stays byte for byte, including `current.unresolved`. That characterization passed without any runtime change.
- `tools/test-skill-catalog.mjs` pins the source wording: pending recognition, one owner per claim, the ignored in-project draft, and leaving the pending item in place.
- `tools/test-core-composition.mjs` exercises the command from an installed room.
- One fresh-context agent, given only the skill source, did the scenario above. The run record is in the [Spec evidence](../specs/S-01B-promote-skill-rebuild/SPEC.md#append-only-evidence-and-execution-log).

**Limits:** that was one run with one model, against an owner scripted by the implementing agent. It is not owner Human QA and not a repeated trial.

A second scripted turn gave a revised retention answer together with a request to add it to the Runbook. The agent recorded a correction and a `decision` in the same turn, without a separate readback. The host's permission layer then refused the promotion, because the owner's words had been relayed by another agent. So the second promotion was not observed, and whether a revised answer plus an instruction counts as confirmation is still for owner review.

The selected-note command's hash and revision checks are sequential guards, not locks. Installed personal copies of the skill are not updated by this source change.

## Sources

- [Promote source](../skills/promote/SKILL.md) and [runtime](../tools/sessions.mjs)
- [Direct owner promotion procedure](../skills/promote/SKILL.md#command-reference), which the [Runbook](../../RUNBOOK.md#direct-owner-promotion) points to
- [Individual delivery Spec](../specs/S-01B-promote-skill-rebuild/SPEC.md)
- [Checkpoint retirement and direct promotion: S-048](../specs/S-048-checkpoint-retirement/SPEC.md)
- [Notepad article](skill-notepad.md)
- [Wiki router](MEMORY.md)

## History

- 2026-09-26: Created by S-01B (promote skill rebuild Spec) TK-00S (Deliver the promote skill destination Task). The source now states pending recognition, one owner per claim, the ignored in-project draft and the retained pending item. One fresh-context scenario was recorded.

- 2026-10-07: S-005C adds the parent workflow and links its publication action. The earlier selected-note scenario remains historical proof of that primitive; source checks and disposable publication tests do not establish autonomous agent reliability.

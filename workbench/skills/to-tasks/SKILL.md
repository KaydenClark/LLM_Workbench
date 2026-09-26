---
name: to-tasks
description: Break an assigned Workbench spec into dependency-aware tracer-bullet Tasks.
---

# To Tasks

The assigned `SPEC.md` names the destination. Each approved slice becomes its
own `tasks/<TK-###>/TASK.md` record inside the assigned Spec; a Spec that still
holds only the legacy slice table is converted first (step 4), and its table is
history, never a place for a new slice. The assigned Spec is the only store.
`TASKBOARD.md` is a generated projection, not a second tracker.

Confirm the assigned spec resolves through `workbench/manifest.json` before
changing it. Never recreate a root `specs/` queue or a project-local
skill-discovery tree.

Cut Tasks when the Spec is activated (`planned` -> `active`), from live
Actuality at the real start of the work; a planned Spec gets no Tasks. If the
assigned Spec is still `planned`, report that its decomposition waits for
activation, write no Task, and do not run `convert-tasks` on it. Tasks already
cut into an existing planned Spec stay as they are.

## Process

1. Read the assigned `SPEC.md` and the relevant source and tests. Do not select
   an unassigned spec.
2. Propose vertical slices that each deliver a checkable behavior in one context.
   Apply the `/tracer-bullet` discipline so each slice pierces every layer of the
   project's stack rather than one layer. Give each a short outcome-oriented
   title, real blockers, done criteria, and closing proof. Prefer an independent
   first tracer bullet; use expand-contract when a wide refactor cannot stay
   green by vertical slice.
3. If the owner has not already authorized this decomposition, present the
   proposed set and ask for approval before changing durable work state, and
   confirm that slice size and blocking edges are right. When the request or
   the composing workflow already carries that planning authority, do not ask
   again (`workbench/docs/adr/0045-skill-composition-within-inherited-scope.md`);
   state the set you are writing and continue.
4. With that authority, use `spec-workbench.mjs next-id S-### --prefix TK --json` for
   each new label. It proposes a letter-bearing ID from the whole Workbench
   inventory without reserving it; save each planned Task before requesting the
   next. Preserve existing spec-qualified numeric Task references.
   - If the assigned Spec already has a `tasks/` directory, it is record-backed:
     write one `tasks/<TK-###>/TASK.md` per approved slice. It opens with the
     title line `# TK-### - <slice>` (the parser refuses a record without it)
     and carries one `**Field:** value` line each for `Task ID`, `Spec ID`,
     `Slice`, `Status` (`ready` unless a real blocker applies), `Stance` (the
     normal stance for the executor: `Builder`, `Auditor`, `Reviewer` or
     `Reconciler`), `Blockers` (`none`, or a comma-separated list of
     `S-###`/`TK-###` ids), and `Destination` (`spec-acceptance: <the
     Acceptance Criteria line this Task advances>`, or `wiki-claim: <the
     reconciled claim>` for a corrective Task after retirement). Add
     `Planned verification` naming the check the Task expects to run. Add no
     table rows; a record-backed Spec's retained
     `Vertical Implementation Slices` table is completed history only. A
     record looks like this:

     ```markdown
     # TK-0AB - Reject a negative amount at the CLI

     **Task ID:** TK-0AB
     **Spec ID:** S-0XY
     **Slice:** Reject a negative amount at the CLI
     **Status:** ready
     **Stance:** Builder
     **Blockers:** none
     **Destination:** spec-acceptance: The CLI rejects a negative amount with a named error.
     **Planned verification:** A failing CLI test for `-5`, then green; full suite.
     ```
   - If the assigned Spec still holds only the legacy slice table with no
     `tasks/` directory, run `node workbench/tools/spec-workbench.mjs
     convert-tasks S-###` once to move its unfinished rows into `TASK.md`
     records before adding further slices; it preserves done rows and
     append-only evidence untouched and refuses a second run.
   Leave a slice that waits on an unanswered owner decision uncut: a record's
   `Blockers` holds only `S-###`/`TK-###` ids, and `next` would hand out a
   Task whose only blocker is prose. Instead,
   record the open decision in the Spec (its `Dependencies And Blockers`
   section, and its `**Blockers:**` line when the decision holds the whole
   Spec) and cut the slice once the owner answers. Create no parallel Task or
   proof store.
5. Run `node workbench/tools/spec-workbench.mjs render` to refresh the generated
   `TASKBOARD.md`, then run `node workbench/tools/spec-workbench.mjs doctor`. Execution
   later uses the claim and close commands in `RUNBOOK.md` one eligible task
   at a time.

Set the normal stance explicitly in each assigned TASK and its SPEC during
authorized decomposition; TASK names the Task record described above, not a
second queue. An executing agent investigates within its assignment and
never creates its own next task; these planning tools require owner-directed
planning authority.

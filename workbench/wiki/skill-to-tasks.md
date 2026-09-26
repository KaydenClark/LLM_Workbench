---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - S-01L TK-01C source change and fresh-context scenario, 2026-09-26
  - Local lineage from to-tickets (6943c10, S-011) renamed by a557370 (S-00H), with upstream mattpocock/skills concept lineage
source_paths:
  - workbench/skills/to-tasks/SKILL.md
  - workbench/tools/task-record.mjs
  - workbench/tools/spec-workbench.mjs
  - workbench/specs/S-01L-to-tasks-skill-rebuild/SPEC.md
  - tools/test-skill-catalog.mjs
  - tools/test-spec-workbench.mjs
  - workbench/docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md
  - workbench/docs/adr/0045-skill-composition-within-inherited-scope.md
  - workbench/wiki/grilling-destination-audit-ledger.json
last_verified: 2026-09-26
---

# To-tasks: cut an activated Spec into executable Tasks

Use `to-tasks` when an assigned Spec has just been activated and its work needs to become Tasks that agents can pick up one at a time. Each Task is one vertical slice: it has a named destination (the acceptance line it advances), real dependencies, a stance and a planned check. The Spec stays the only store. `TASKBOARD.md` is generated from it, and nothing goes to an outside tracker.

**Inputs:** one assigned, active Spec, plus the live source and tests. **Output:** one `tasks/<TK-###>/TASK.md` record per slice, or, on a Spec that has not been converted yet, a one-time `convert-tasks` run first. The skill then refreshes `TASKBOARD.md` with `render` and checks the room with `doctor`. **Done when:** every record parses, `render` and `doctor` stay clean, and `next --json` returns one unambiguous eligible Task.

## How it works

The [skill](../skills/to-tasks/SKILL.md) resolves the Spec through the manifest and reads it together with the relevant code. It proposes tracer-bullet slices (see [`tracer-bullet`](../skills/tracer-bullet/SKILL.md)) and writes one record per slice, using IDs proposed by `spec-workbench.mjs next-id`.

- **Cut at activation, not at planning.** Tasks are cut when a Spec moves from `planned` to `active`, from live Actuality at the real start of the work. A planned Spec gets no Tasks. The skill reports that decomposition waits for activation and does not run `convert-tasks` on it. Tasks already cut into an existing planned Spec stay as they are. This is the owner's locked answer E-4B in the [destination audit ledger](grilling-destination-audit-ledger.json), including its correction limiting the rule to new work.
- **A record the parser accepts.** A record opens with the title line `# TK-### - <slice>`; the [parser](../tools/task-record.mjs) refuses a record without it. It then has one `**Field:** value` line each for `Task ID`, `Spec ID`, `Slice`, `Status`, `Stance`, `Blockers` and `Destination`, plus `Planned verification`. The source carries a complete example record, and that example parses through the runtime parser.
- **Ask only when authority is missing.** If the owner has not already authorized the decomposition, the skill presents the slice set for approval. When the request or a composing workflow such as [`make-it-so`](../skills/make-it-so/SKILL.md) already carries that authority, it states the set and continues, as [ADR-0045](../docs/adr/0045-skill-composition-within-inherited-scope.md) requires. The earlier wording always stopped to ask, which the 2026-09-10 foundation audit flagged as a manufactured stop.
- **Owner decisions stay out of Task records.** A record's `Blockers` field holds only `S-###`/`TK-###` ids, so it cannot name an open owner decision. A record that declares `blocked` with blockers `none` is recomputed to `ready`, and `next` would hand it out. The skill therefore leaves a slice that waits on an unanswered owner decision uncut. It records the open decision in the Spec and cuts the slice once the owner answers.

### Example, from the verification run

In the S-01L scenario, a fresh agent was given a small ledger room and the owner message "Please cut S-0A1 and S-0A2 into Tasks." S-0A1 was an active CSV-export Spec with one done Task and three open acceptance lines. One of those lines waited on an unanswered owner question about amount formatting. S-0A2 was a planned PDF-statement Spec that still had an old table row. The agent wrote two records for S-0A1: `--all` export (`ready`, no blockers) and a date-range filter (`blocked` by the first, because both rewrite the same argument parsing). It left the amount-format slice uncut, noted why in the Spec's `Dependencies And Blockers` section, and did not decide the owner question. It wrote nothing for S-0A2 and did not run `convert-tasks`. It treated the owner's request as the authorization and asked nothing. `next --json` then returned only the `--all` Task.

## Composition

- [`to-spec`](../skills/to-spec/SKILL.md) scopes a Spec, which enters as planned; `to-tasks` runs later, at activation. As of 2026-09-26, `to-spec` still seeds one tracer-bullet row into the planned Spec so the capability is schedulable. That sits uneasily with E-4B's "no Tasks until activation" for new Specs. The tension is recorded in S-01L's evidence; resolving it belongs to `to-spec`'s owner, not to this skill.
- [`tracer-bullet`](../skills/tracer-bullet/SKILL.md) supplies the slicing discipline and hands its ordered slices here to write.
- [`make-it-so`](../skills/make-it-so/SKILL.md) composes `to-tasks` only for authorized delivery slices.
- Execution then uses `claim` and `close` in the [Runbook](../../RUNBOOK.md), one eligible Task at a time. An executing agent never creates its own next Task.

## Rename from to-tickets

The skill was called `to-tickets` until S-00H. It entered the Workbench at [`6943c10`](https://github.com/KaydenClark/LLM_Workbench/commit/6943c10) (2026-07-16, S-011), where it wrote slices as rows in the Spec's own table. [ADR-000H](../docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md) replaced "ticket" with "Task" as the execution-slice term and made a Task a standalone record. Commit [`a557370`](https://github.com/KaydenClark/LLM_Workbench/commit/a557370) (2026-09-17) renamed the skill to `to-tasks`. Owner changes: S-011 owned the original rewrite, S-00H the record contract and rename, and S-01L now owns this skill's delivery. The old name survives only in `legacyCoreSkills` in `workbench/tools/workbench-layout.mjs`, for frozen v3.0.0-v3.2.0 manifests. It is not a callable alias. IDs keep the `TK-` prefix, and the choice of ID form is still open (TT-Q10).

## Upstream relationship

**Pinned local source:** S-01L's green commit `e00c3ea`. By concept and lineage, `to-tickets` descends from the PRD-to-issues skill in [mattpocock/skills](../../THIRD_PARTY_NOTICES.md), which S-011 imported on 2026-07-14. The 2026-09-10 foundation audit maps it as "to-tickets / prd to issues". What carried over is the idea of dependency-ordered vertical slices with blockers and done criteria. What changed is where slices live: S-011 TK-002 removed the upstream issue-tracker, scratch-folder and ticket-template conventions, and `tools/test-skill-catalog.mjs` still forbids them. Slices live only in the assigned Spec.

**Uncertainty:** S-011 kept the untouched upstream snapshot outside this repository, so this article compares by recorded lineage, not by a text diff against a pinned upstream commit. The upstream skill's exact name and revision were not rechecked here.

## Verified behavior and limits

**Verified 2026-09-26:** the source at `e00c3ea` states the activation rule, the record title and `Stance` field, the conditional approval and the uncut owner-gated slice. `tools/test-skill-catalog.mjs` holds that wording and forbids the old "owner decisions as blockers" line. One fresh-context agent, given only the skill in a disposable room, produced the result in the example above. Every record parsed through `show --json`, `render` and `doctor` stayed clean, and `next --json` returned exactly one Task. Throwaway probes in a copy of that room confirmed the three runtime limits below. The turn record is in the [Spec evidence](../specs/S-01L-to-tasks-skill-rebuild/SPEC.md#append-only-evidence-and-execution-log).

**Intended but not built (owned by the lifecycle lane, not this skill):**
- A Task record cannot express an owner-decision blocker; `Blockers: OD-1` fails to parse.
- A declared `blocked` with blockers `none` is recomputed to `ready`.
- `convert-tasks` refuses planned Specs.

The skill works around all three in wording only. `Stance` is also not validated by the parser, since unknown fields are accepted and ignored.

**Limits:** the scenario was one run with one model, against a scripted owner. It is not owner Human QA and not a repeated trial. The agent read "cut these into Tasks" as authorization, so the approval question itself was not exercised. It also noted that the skill does not name `blocked` as the status for a Task with an ID blocker, and does not say whether to update the Spec's header after cutting. A Blueprint-level Task with no Spec is allowed by the owner answers but has no home yet; that waits on S-00P and the runtime owner. A stale installed `to-tickets` copy in a personal skills folder, outside this repository, still writes the retired table format. Removing it is an owner hand-action. Installed personal copies of `to-tasks` are not updated by this source change.

## Sources

- [To-tasks source](../skills/to-tasks/SKILL.md)
- [Individual delivery Spec](../specs/S-01L-to-tasks-skill-rebuild/SPEC.md)
- [Task record parser](../tools/task-record.mjs) and [lifecycle runtime](../tools/spec-workbench.mjs)
- [ADR-000H: a Task is a standalone artifact](../docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md)
- [ADR-0045: composition within inherited scope](../docs/adr/0045-skill-composition-within-inherited-scope.md)
- [Runbook behavior selection](../../RUNBOOK.md#behavior-selection)
- [Wiki router](MEMORY.md)

## History

- 2026-09-26: Created by S-01L TK-01C with the activation rule, record title and stance, conditional approval and uncut owner-gated slice delivered in the source, one fresh-context scenario recorded, and the to-tickets rename explained.

---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - S-01M per-skill destination planning, 2026-09-24
  - S-01M TK-01D source change and fresh-context scenario, 2026-09-26
  - Pinned upstream mattpocock/skills c55ee46073ed923f86ce59a5eb3b6d895095d1b7, retrieved 2026-09-26
source_paths:
  - workbench/skills/tracer-bullet/SKILL.md
  - workbench/skills/to-tasks/SKILL.md
  - workbench/skills/to-spec/SKILL.md
  - workbench/specs/S-01M-tracer-bullet-skill-rebuild/SPEC.md
  - tools/test-skill-catalog.mjs
  - workbench/manifest.json
  - LEXICON.md
last_verified: 2026-09-26
---

# Tracer-bullet: cut the thinnest slice that runs end to end

Use `tracer-bullet` when a capability has to be broken into work, or when a proposed slice looks like one layer of the change rather than one behavior. A tracer bullet is one narrow behavior carried through every layer the finished change must reach: the code layers, the documentation that changes meaning, and the check that proves it works. Because it goes all the way through, it can run and be demonstrated on its own, before any later slice lands. The opposite is a horizontal shard, such as "add the schema" or "write all the core functions": it compiles, but nothing can be shown working until other slices land.

**Inputs:** a capability (usually an assigned Spec's outcome and acceptance) and the project's own source, `AGENTS.md` and `RUNBOOK.md`. **Output:** an ordered set of proposed slices, each stated as an observable behavior, with its blockers and a named proof. They are handed to [`to-tasks`](../skills/to-tasks/SKILL.md) or [`to-spec`](../skills/to-spec/SKILL.md) to be written down. **Done when:** every slice crosses every mapped layer for one behavior, fits one context unit, can be demonstrated alone with a check the owner can run in under a minute, and the first slice has no blockers.

## How it works

The [skill source](../skills/tracer-bullet/SKILL.md) has four steps and a smell test:

1. **Map the stack** from the project's own code, not a generic template: for a web feature, persistence → service → interface → test; for a CLI, parsing → core → output → test. Every map also carries two seams that are not code. One is the documentation owner whose meaning the behavior changes, or a recorded `Docs checked; no update needed` with the reason. The other is the proof seam: the named check that shows the behavior working.
2. **Cut the narrowest complete path.** One behavior wide, every layer deep, stated as an outcome ("a caller saves one record and reads it back"), never as a layer ("add the table"). A slice that will not fit the manifest's declared context unit is cut to a thinner behavior, not split by layer.
3. **Order by dependency, first bullet independent.** The first slice lands a working skeleton; later slices widen it one behavior at a time. A wide refactor that cannot stay green as one slice uses expand-contract instead.
4. **Scope and assign.** Each approved slice becomes one Task with one durable writer and explicit blockers. Its normal stance, usually Builder, is set in the Task and its Spec, not chosen by the arriving agent. A slice that names one layer, or is code-only with no documentation or proof seam, is re-cut before it becomes an assigned Task.

The smell test asks whether completing the slice alone lights up the whole path. If nothing runs until a later slice lands, or the code runs but its documentation stays stale and no check proves it, the slice is a shard.

### Example, from the verification run

In the S-01M scenario, a fresh agent was given only this skill and a small scratch project: a note-taking CLI with a store, core logic, a command line, one test and a README. The Spec asked for tags in five forms: tag a note when adding it, filter by tag, edit tags later, count tags and rename one. Before proposing anything, the agent mapped six layers from the project's own files, including the README and a named proof. It proposed five slices. The first, "tag a note when you add it and see the tags in `list`", had no blockers. It came with the exact commands the owner could run after it landed. Each later slice added one command, with its own README change and a test that runs the real command.

The owner then pushed back. The first slice should be only the data work: the tags field and every tag function, with unit tests. The commands would come in a second slice and the README at the end, and the first slice should be marked ready. The agent wrote nothing. It pointed out that the project's rules put README changes in the same slice as the behavior. It also said a data-only slice passes its tests but gives the owner nothing to run, and hides problems between the command line and storage until later. It offered three options, recommending the original cut. It would accept the owner's cut only as a recorded exception to the README rule. The owner chose the original cut. The agent then wrote five rows, each with the Builder stance, the first `ready`, the others blocked on it, and one evidence row recording the approval.

## Composition

`tracer-bullet` is a discipline other skills apply, not an entry that writes records. [`to-tasks`](../skills/to-tasks/SKILL.md) applies it when it proposes an assigned Spec's slices, then asks the owner to approve them before writing Task records. [`to-spec`](../skills/to-spec/SKILL.md) uses it to seed a new Spec's first slice. [`builder`](../skills/builder/SKILL.md) and [`carry`](../skills/carry/SKILL.md) reach for it when the slice in hand needs cutting. [`implement`](../skills/implement/SKILL.md) then drives each slice at a public seam. The source also names `/tdd`, which is not part of the core bundle. The skill writes nothing on its own; the approval step and the record shape belong to the composing skill.

A slice is recorded in the shape the [Lexicon](../../LEXICON.md) calls a Task: one bounded thin vertical slice, one Chat. A record-backed Spec keeps each unfinished slice as its own `tasks/TK-###/TASK.md`; a Spec that has not converted keeps it as a row in its `Vertical Implementation Slices` table, and [`to-tasks`](../skills/to-tasks/SKILL.md) converts it before adding more.

## Upstream relationship

There is no same-name upstream skill. The Workbench's `to-tickets` began as a core rewrite of Matt Pocock's MIT-licensed `to-tickets` ([notice](../../THIRD_PARTY_NOTICES.md)). On 2026-07-20, commit `5c269de` extracted its vertical-slice discipline into this standalone skill, catalogued then as Native, and made `to-tickets` and `to-spec` defer to it. Local `to-tickets` was later renamed [`to-tasks`](../skills/to-tasks/SKILL.md). The discipline was compared against the pinned upstream [`skills/engineering/to-tickets/SKILL.md` at `mattpocock/skills@c55ee46`](https://github.com/mattpocock/skills/blob/c55ee46073ed923f86ce59a5eb3b6d895095d1b7/skills/engineering/to-tickets/SKILL.md) and its [companion doc](https://github.com/mattpocock/skills/blob/c55ee46073ed923f86ce59a5eb3b6d895095d1b7/docs/engineering/to-tickets.md), retrieved on 2026-09-26.

- **Shared:** each slice is a narrow but complete path through every layer, not one layer; a finished slice can be demonstrated or verified alone; each fits one fresh context; slices declare blocking edges and the first can start immediately; a wide refactor uses expand-contract; the upstream check "what can I demo when this is done?" is the same question as the local smell test.
- **Deliberate drift:** upstream names the layers as schema, API, UI and tests. The Workbench maps the layers from the project's own source and adds the documentation and proof seams, because `AGENTS.md` treats documentation as part of done and asks for a named check. In practice a slice that ships working code with a stale README is a shard here, where upstream would accept it. The local skill also sizes against the manifest's declared context unit and assigns Tasks with a normal stance, where upstream publishes tickets to an issue tracker.
- **Not adopted here:** upstream's owner quiz, prefactoring-first ordering and tracker publication belong to the whole `to-tickets` workflow. Locally, the approval quiz lives in `to-tasks`, and prefactoring is not named by either skill. Whether that omission costs anything has not been measured.
- **Uncertainty:** the pin (2026-09-18) is later than the local extraction (2026-07-20), so this is a retrospective comparison of the discipline, not proof of which upstream text was copied. It covers only `to-tickets` at the pin. Repeat it before claiming fidelity to a newer upstream.

## Verified behavior and limits

**Verified 2026-09-26:** `tools/test-skill-catalog.mjs` holds the source wording. A complete path includes the documentation and proof seams; a code-only slice is re-cut before it becomes an assigned Task; assignment names the normal stance; the source carries no retired Engineer role and no private owner name. That test failed red before the source change and passed after it. One fresh-context agent, given only the skill source, followed the discipline across the three scripted owner turns above. The turn-by-turn record is in the [Spec evidence](../specs/S-01M-tracer-bullet-skill-rebuild/SPEC.md#append-only-evidence-and-execution-log).

**Limits:** that was one run with one model, against a scripted owner. It is not owner Human QA and not a repeated trial. No run of the pre-change source was made for comparison, so the trial shows the current source is followed. It does not show that the change caused the behavior. In that run the agent also relied on the scratch project's own rule that README changes land in the same slice, which a real project may not state. The scratch project had no `to-tasks`, so the agent wrote the approved rows itself at the owner's request, instead of handing them on as step 4 says. The catalog test pins wording, not how an agent slices.

## Remaining intended behavior

- Owner Human QA of how the skill cuts real capabilities has not happened; the fresh-context run is one scripted trial.
- Codex [S-00P](../specs/S-00P-workflow-canon-rework/SPEC.md) is moving the controls from table-row Tasks to `TASK.md` records. The skill already names both shapes; when S-00P lands, the table fallback here and in `to-tasks` may be retired, and this article should be rechecked.
- Installed personal copies of the skill are not updated by this source change.

## Sources

- [Tracer-bullet source](../skills/tracer-bullet/SKILL.md)
- [Individual delivery Spec](../specs/S-01M-tracer-bullet-skill-rebuild/SPEC.md)
- [to-tasks](../skills/to-tasks/SKILL.md) and [to-spec](../skills/to-spec/SKILL.md), the skills that apply it
- [Lexicon: Spec, Task](../../LEXICON.md)
- [Wiki router](MEMORY.md)

## History

- 2026-09-26: Created by S-01M TK-01D. The source now carries documentation and proof seams through every slice and assigns Tasks in current vocabulary; the pinned upstream comparison and one fresh-context scenario are recorded.

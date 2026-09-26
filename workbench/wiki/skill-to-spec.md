---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - S-01K per-skill planning, 2026-09-24
  - S-01K TK-01B source change and fresh-context scenario, 2026-09-26
  - S-01K TK-002L corrective for owner answer E-4B and fresh-context scenario, 2026-09-26
  - Pinned upstream mattpocock/skills c55ee46073ed923f86ce59a5eb3b6d895095d1b7, retrieved 2026-09-26
source_paths:
  - workbench/skills/to-spec/SKILL.md
  - workbench/specs/S-01K-to-spec-skill-rebuild/SPEC.md
  - tools/test-skill-catalog.mjs
  - workbench/skills/to-tasks/SKILL.md
  - workbench/tools/spec-packet.mjs
  - templates/SPEC.md
  - workbench/tools/spec-workbench.mjs
last_verified: 2026-09-26
---

# To-spec: turn a settled decision into one bounded Spec

Use `to-spec` when a conversation has already settled what a capability should do and that decision needs a durable owner before anyone builds it. It records the decision; it does not reopen the interview and does not start the work. The owner's request sets the endpoint. The Spec it writes becomes instruction only after it is selected or assigned.

**Inputs:** an already-settled conversation (often the confirmed concept from [grilling](skill-grilling.md)), the room's controls, existing Specs, and the relevant source and tests. **Output:** one Spec per capability in the `specs` lane that `workbench/manifest.json` declares, normally `workbench/specs/S-###-slug/SPEC.md`, with a refreshed `CATALOG.md` and Taskboard. **Done when:** each settled capability has exactly one owning Spec, at status `planned` and unclaimed. Its unresolved choices are recorded as open, not answered. It carries no Task: its slice section has no Task row, and an empty `tasks/` directory kept by `.gitkeep` marks it record-backed. `render` and `doctor` are clean, and the agent has reported the path, open owner gates and next eligible action.

## How it works

The [skill](../skills/to-spec/SKILL.md) takes these steps:

1. **Reuse or allocate.** It checks the root, controls, existing Specs and relevant source. An existing owner of the capability is reused. Otherwise `spec-workbench.mjs next-id --prefix S --json` proposes one visible ID, which is written only within the authorized planning scope. An existing Spec's path changes only through `move-spec`.
2. **One Spec per capability.** When the conversation settled several capabilities, such as a rebuild of each skill, it writes or reuses one Spec for each. It never bundles them into one delivery owner. This is the failure that the oversized Skills Wiki packet showed and that the per-skill Specs corrected.
3. **Separate confirmed from assumed.** Confirmed decisions, the agent's assumptions and the owner's unresolved choices stay apart. An unresolved choice becomes a blocker, not an invented answer.
4. **Capture the record.** It records the outcome, why it matters, verified current state, desired behavior, decisions, non-goals, dependencies, acceptance criteria, test seams, documentation impact, and an empty append-only evidence log.
5. **Specifying is not starting.** A new Spec is written at status `planned` with no owner claim, and the normal stance (usually Builder) is set for the Spec. The agent does not `claim`, activate or implement it. It records no evidence for work that has not happened.
6. **No Task while planned.** A new Spec enters Backlog as `planned` with no Task cut. `Vertical Implementation Slices` gets no Task row and no `TASK.md` record is written. The agent creates the Spec's empty `tasks/` directory, tracked with `.gitkeep`, because the runtime refuses a Spec with neither a slice row nor a `tasks/` directory: `doctor` reports it as `malformed-spec`, and `next`, `render` and `show` fail for the whole room. The intended slice direction may be noted in prose. [`to-tasks`](../skills/to-tasks/SKILL.md) cuts the Tasks from live Actuality when the Spec is activated (`planned` -> `active`), using the [tracer bullet](../skills/tracer-bullet/SKILL.md) discipline. This applies to new Specs only: a reused Spec keeps the Tasks it already has. The rule is the owner's locked answer E-4B in the [grilling destination ledger](grilling-destination-audit-ledger.json); the portable source states it without the ledger ID.
7. **Close out.** It runs `render` and `doctor`, reports, and updates any [notepad](skill-notepad.md) working record that supplied context before leaving.

### Example, from the verification runs

In the TK-002L scenario, the throwaway room's owner asked for the settled digest rebuild to become a Spec. The agent read the skill and deliberately did not open `to-tasks`. It wrote a new `planned`, unassigned Spec with five confirmed decisions, four flagged assumptions and the deferred short-document question as an open owner gate. The slice section held no Task row, only a prose note of the intended single tracer bullet, and `tasks/` held only `.gitkeep`. `render` and `doctor` were clean and `next` returned nothing. In the next turn the owner confirmed the assumptions and activated the Spec, asking for it to be made ready to build but not built. The agent followed `to-tasks`: it cut one `ready` Task record, `TK-000A`, and implemented nothing. `convert-tasks --activate` refused the record-backed Spec, and `to-tasks` says to report a planned Spec with no activation command rather than edit its status by hand. So the Status stayed `planned`, and the agent recorded the gap as an open owner gate with options and a recommendation.

In the earlier TK-01B scenario, the throwaway room's settled conversation covered a rebuild of its `digest` prompt skill, with one question the owner had deferred. Asked to "turn the digest rebuild into a spec", the agent found that the digest's original Spec was complete. The room's rules say later changes get a new linked Spec, so it did not rewrite that record. It took a new ID from `next-id` and wrote a `planned`, unassigned Spec. It listed three confirmed decisions, three flagged assumptions and the deferred question as an open owner gate, and seeded one red-then-green slice (behavior that TK-002L later corrected). It noticed that the completed Spec named a stale path and recorded that drift without editing history. Then the owner asked it to "fold the export change into that same spec so it's all in one place". It wrote a separate `planned` Spec for export instead, cross-linked the two and explained why: a shared Spec could not finish one skill while the other's question was open. Asked where things stood, it reported both Specs as planned and unclaimed with no skill changed. It named activation, then claim, as the next step.

## Composition

[Grilling](skill-grilling.md) and [grill-me](skill-grill-me.md) settle the concept. Their specification exit composes `to-spec` only after the owner confirms the final readback and directs specification. [`make-it-so`](../skills/make-it-so/SKILL.md) composes `to-spec` and then `to-tasks` inside an approved endpoint. [`to-docs`](../skills/to-docs/SKILL.md) routes here when capability truth needs a new Spec and none is assigned. The [Runbook behavior route](../../RUNBOOK.md#behavior-selection) lists "Write specifications only" as `to-spec` plus any needed `to-tasks`, stopping at that endpoint. `to-spec` composes `notepad` when a handoff or working record supplies context.

## Upstream relationship

The skill descends from Matt Pocock's MIT-licensed `to-spec`, which upstream renamed from `to-prd` ([notice](../../THIRD_PARTY_NOTICES.md)). It was compared against the pinned [`skills/engineering/to-spec/SKILL.md` at `mattpocock/skills@c55ee46`](https://github.com/mattpocock/skills/blob/c55ee46073ed923f86ce59a5eb3b6d895095d1b7/skills/engineering/to-spec/SKILL.md), retrieved on 2026-09-26. The upstream guide `docs/engineering/to-spec.md` at the same pin was read for context only.

- **Shared:** synthesize what the conversation already settled, with no new interview. Use the project's own vocabulary and respect its ADRs. Name the test seams, preferring existing and higher seams. Record what is out of scope. Anything the record asserts that the owner never said is a defect.
- **Conceptual drift, deliberate:**
  - *Where it goes.* Upstream publishes the spec as one issue in the project's issue tracker with a `ready-for-agent` label. The Workbench writes a Spec in the manifest-declared `specs` lane, and keeps no parallel tracker record or transient requirements file. External tracker publication is outside the Workbench contract. In practice nothing leaves the repository, and a cold agent finds the Spec through the Catalog and Taskboard rather than a tracker query.
  - *How long it lives.* Upstream treats the spec as a snapshot that goes stale once work ships. A Workbench Spec is the durable capability record, with an append-only evidence log and a completion result. Later changes to a completed capability get a new linked Spec.
  - *Readiness.* The upstream guide names agents building a whole labeled spec in one run as the skill's most-reported rough edge. Locally, a new Spec is `planned` and unclaimed, `next` cannot select it, and only activation and `claim` start the work.
  - *Scope.* Upstream collapses the conversation into one document. Locally, a multi-capability conversation yields one Spec per capability.
- **Not adopted:** the long numbered user-story list and the Problem/Solution template, in favor of the Spec section shape; the rule against file paths, since a Spec's Current Verified State is source-backed and cites what it read; the `/setup-matt-pocock-skills` tracker prerequisite; and upstream's step of checking the seams with the user before writing. The local skill records seams and routes unresolved choices to blockers, but does not ask separately about seams. Whether that loses anything has not been measured.
- **Uncertainty:** this compares only the pinned `SKILL.md`. The upstream revision that the Workbench first imported on 2026-07-14 is not preserved in the repository, so the exact original text is not verified. A later upstream revision may differ, so repeat the comparison before claiming fidelity to a newer upstream.

## Verified behavior and limits

**Verified 2026-09-26:** `tools/test-skill-catalog.mjs` holds the source wording: manifest routing, one Spec per capability, never bundling, the `planned` entry, no `claim`, `move-spec` for path changes, and the absence of tracker and retired stable-path wording. The red commit failed on `one Spec per capability` before the source changed. One fresh-context agent, given only the skill source and a throwaway room, produced one `planned`, unassigned Spec with a single first slice and an open owner gate. It declined an owner request to bundle a second capability into the same Spec, and implemented nothing. The turn-by-turn record is in the [Spec evidence](../specs/S-01K-to-spec-skill-rebuild/SPEC.md#append-only-evidence-and-execution-log).

**Verified 2026-09-26 (TK-002L):** the catalog test now also holds the Task-less entry: `no Task cut`, `no Task row`, activation (`planned` -> `active`) through `/to-tasks`, `keep the Tasks it already has`, the empty `tasks/` directory with `.gitkeep`, the absence of the old seeding step and of the `E-4B` ledger ID, and the catalog row's `no Task cut`. Two red commits failed before the source changed. A throwaway-room probe showed that a planned Spec with no slice row and no `tasks/` directory is `malformed-spec` and stops `next`, `render`, `show` and `convert-tasks` for the whole room, while the same Spec with an empty tracked `tasks/` directory passes `doctor`, is listed as `planned` by `render`, shows no Tasks and is not selected by `next`. A second fresh-context agent then produced the Task-less planned Spec described above and, after activation, routed decomposition to `to-tasks`.

**Limits:** each scenario was one run with one model, against a scripted owner. Neither is owner Human QA or a repeated trial. The TK-002L agent could see the room's runtime source and read `spec-packet.mjs` to confirm the empty `tasks/` rule, and it had `to-tasks` but not `tracer-bullet` available, so it applied the slicing rule as `to-tasks` describes it. The room had no notepad or handoff, so the notepad composition step was not exercised. Installed personal copies of the skill are not updated by this source change.

## Remaining intended behavior

- **Activation route for a Task-less Spec.** No command activates the record-backed planned Spec this skill now writes. `convert-tasks --activate` refuses a Spec that already has `tasks/`, and needs an unfinished slice-table row, and `to-tasks` says to report that rather than edit the status by hand. The scenario agent therefore cut the Task but left the Spec `planned`. The fix belongs to the `to-tasks` and `spec-workbench` owners, not to this skill.
- **Template and runtime shape.** [`templates/SPEC.md`](../../templates/SPEC.md) still seeds a `ready` `TK-001` row and says "Refine and activate the first eligible slice", and the runtime still treats a Spec with neither rows nor `tasks/` as malformed. [S-00P](../specs/S-00P-workflow-canon-rework/SPEC.md) owns the template rewrite. The empty `tasks/` directory is this skill's way to write a valid Task-less Spec until then.
- **Board lane.** E-4B also names a board lane function that maps `planned` Specs to Backlog. That belongs to the generated board work ([S-01X](../specs/S-01X-generated-json-taskboard/SPEC.md)), not this skill.
- **Neighbor wording.** [`tracer-bullet`](../skills/tracer-bullet/SKILL.md) still says to hand slices "to `/to-spec` when the spec itself is still being written". Under E-4B slices go to `to-tasks` at activation. That skill's own Spec owns the change.

## Sources

- [To-spec source](../skills/to-spec/SKILL.md)
- [Individual delivery Spec](../specs/S-01K-to-spec-skill-rebuild/SPEC.md)
- [Spec template](../../templates/SPEC.md) and [spec-workbench runtime](../tools/spec-workbench.mjs)
- [Runbook behavior selection](../../RUNBOOK.md#behavior-selection)
- [Wiki router](MEMORY.md)

## History

- 2026-09-26: TK-002L delivered owner answer E-4B: a new Spec enters `planned` with no Task cut and an empty tracked `tasks/` directory, with Tasks cut by `to-tasks` at activation. Recorded the activation-route, template, board and neighbor-wording gaps.
- 2026-09-26: Created by S-01K TK-01B. The source now states one Spec per capability, the `planned` unclaimed entry and `move-spec` path changes. The article records the pinned upstream comparison and one fresh-context scenario.

# S-004M - Room Legibility Surface

**Spec ID:** S-004M
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-10-05
**Catalog description:** Let every room declare how an agent runs, operates, inspects, sees errors in, exercises and measures its product, as a manifest block checked by doctor, with the Workbench's own declaration as the first.
**Blockers:** none for specification. Implementation awaits Plan and assignment.
**Latest event:** Authored at the Map step from the owner's legibility decision of 2026-10-05; no Task is cut.
**Next gate:** At Plan, inspect the manifest schema and doctor seams, and cut small Tasks.

## Outcome

A room declares its legibility surface in `workbench/manifest.json`: how an agent runs the product, operates it, inspects its state, sees its errors, exercises the user journey and measures whether it worked. `doctor` reports a missing or incomplete declaration as attention. A claim of done can cite the running product through that surface, not only the repository. The Workbench's own room declares commands, Git state and structured diagnostics.

## Why It Matters

The Workbench made the repository legible to agents; the running product is still mostly invisible to them. The OpenAI harness-engineering article's strongest new idea is an agent that can reproduce a failure, operate the application, inspect telemetry and prove the fix itself. The owner confirmed the surface as a manifest block and a doctor check, not a subsystem ([the legibility decision](../../docs/ddr/001J-every-room-declares-how-an-agent-runs-operates-inspects-and-measures-it.md)), under the Agent Visible Runtime landmark.

## Current Verified State

At integration `ec65203d` (2026-10-05): the manifest declares lanes, collections, Git branches, the landmark tracker and provenance; it has no block that says how to run, operate, inspect or measure the product. `doctor` reports installed-state, claim and seed findings and nothing about a runtime surface. The `run` skill on the host finds a project skill for launching the app or falls back to patterns per project type; nothing in the room declares the answer. No implementation or agent-outcome proof for this capability is claimed by this Map record.

## Desired Behavior

1. A manifest block, `legibility` or a name the Plan chooses, with six declared entries: run, operate, inspect, errors, journey, measure. Each is a command, a path or a short pointer the room's own tooling answers; the implementation is the project's own.
2. `doctor` reports an absent block or an empty entry as an attention finding that blocks nothing; a room that declares nothing is not broken, only less legible.
3. The Workbench's own room declares its surface: the Spec tools and diagnostics as run and operate, `doctor`, `render`, the Taskboard and the Tracker as inspect, the suite and `doctor` findings as errors, the fixture-room round trip as the journey, the guardrail baseline and evals as measure.
4. Genesis and adoption draft the block from what they can see of the project, and grilling confirms it ([Setup drafts everything it can and grilling confirms it](../../docs/ddr/000S-setup-drafts-everything-it-can-and-grilling-confirms-it.md)).
5. The `templates/` manifest mirror carries the block with bracketed placeholders; updating a room without the block leaves it unchanged apart from the attention finding.

## Decisions And Contracts

- [Every room declares how an agent runs, operates, inspects and measures it](../../docs/ddr/001J-every-room-declares-how-an-agent-runs-operates-inspects-and-measures-it.md) (owner, 2026-10-05): a manifest block and a doctor check, not a subsystem.
- The declaration is routing, never authority: a command named there carries no permission the Contract does not already give.

## Non-Goals

Operating products on an agent's behalf, a telemetry system, browser or screenshot tooling inside the Workbench, changing what counts as done, implementing another capability.

## Dependencies And Blockers

- `workbench/manifest.json`, its schema and `doctor` are shared writers; coordinate with [Workbench Self-Drift Check](../S-00K-workbench-self-drift-check/SPEC.md) and the [Ownership Map root control](../S-00G-ownership-map-root-control/SPEC.md).
- The [release owner](../S-00O-workbench-v4-0-0-release/SPEC.md) retains version, Template and owner gates.

## Vertical Implementation Slices

No Tasks cut. At Plan, cut small complete-path slices: the manifest block and schema with a red/green doctor finding; the Workbench's own declaration; the Genesis and adoption draft; the Template mirror and update route. The empty tasks directory keeps this planned capability record-backed.

## Acceptance Criteria

- [ ] A fixture room with the block passes `doctor` silently for it, and one without it receives one attention finding that blocks nothing.
- [ ] The Workbench's own manifest declares all six entries and each named command or path exists.
- [ ] Genesis drafts the block for a new room and adoption drafts it for an existing project, both marked for grilling confirmation.
- [ ] The Template mirror carries the block with placeholders, and updating a room without the block leaves its manifest otherwise unchanged.
- [ ] The full suite passes on the committed candidate; named verification and remaining limitations are recorded without claiming owner approval.

## Testing Seams

The manifest schema validation, `doctor --json` against fixture rooms with and without the block, the Genesis and adoption tests, the update-route round trip, and the template-placeholder check.

## Verification Procedure

Run the targeted diagnostics, layout, genesis, adoption and upgrade tests, then the full AGENTS suite, `render` and `doctor`, on the committed candidate. Obtain separate-context review of the immutable candidate before integration.

## Documentation Impact

The manifest's documentation, the Runbook's diagnostics row, a Wiki page for the legibility surface, and the `templates/` mirror.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-05 | none | Authored at the Map step from the owner's legibility decision of 2026-10-05 and re-verified at integration ec65203d. | Map only; the manifest and doctor were read, no runtime proof claimed. | This Spec. | Plan, implementation and proof remain. |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Using the declared surface as evidence in a Receipt is a later question under the Agent Visible Runtime landmark.

## Supersession

- Supersedes: none
- Superseded by: none

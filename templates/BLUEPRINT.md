# [PROJECT_NAME] - Blueprint

> Generated from LLM Workbench v[HARNESS_VERSION].

**Last reviewed:** [YYYY-MM-DD]
**Status:** [active / partial / stale]
**Source root:** `[ABSOLUTE_PROJECT_PATH]`

## Product Map

[One paragraph: what this product is, who it serves, and the problem it solves.]

Core promise:

> [Concrete user-facing promise.]

## Goals And Pillars

- **[Pillar]:** [stable product direction]
- **[Pillar]:** [stable product direction]
- **[Pillar]:** [stable product direction]

## Cross-Cutting Architecture And Invariants

| Layer / concern | Choice | Invariant / source |
|---|---|---|
| Runtime | [RUNTIME] | [constraint/source] |
| Product surface | [FRONTEND_API_CLI_OR_OTHER] | [constraint/source] |
| Data/storage | [STORAGE_OR_NONE] | [constraint/source] |
| Testing | [TEST_STACK] | [constraint/source] |
| Deployment/runtime | [DEPLOYMENT_OR_NONE] | [constraint/source] |

Rules that span multiple capabilities:

- [Invariant]
- [Privacy/safety boundary]
- [Architecture decision future specs must preserve]

Source and tests say what is implemented; this file and the assigned spec say
what is accepted (`AGENTS.md` -> State Resolution). Put capability-specific
requirements and decisions in its stable spec, not here. Consequential
architectural decisions with real alternatives get a record in
`workbench/docs/adr/`; the rule they establish still lives in the owning
control, because the Workbench Contract is the set of claims those controls
and the assigned spec carry, not a file.
Put accepted project-wide definitions in `LEXICON.md`; the Blueprint helps
participants recover the design concept but is not itself the design concept or
the project glossary.

## Objective Continuity

Meaningful objective work preserves working context in local JSON notepads.
The current view and ordered work record support continuation and scoped
handoffs; shared schema/tooling must preserve sources and corrections without
making notes authoritative. Save important context while work proceeds so it
can support continuation after token exhaustion or Stop; computer-crash,
device-loss, and cross-machine recovery are outside this guarantee. Reconcile
important material into durable owners before trimming it from a retained note
or deleting a fully reconciled record; preserve unfinished context.
Record implemented support and remaining gaps in the assigned capability spec;
accepting this direction does not prove automatic capture or recovery.

## Non-Goals

- [Non-goal]
- [Non-goal]

## Spec Catalog

The generated catalog links every durable capability record, including completed
history. Human-authored product prose stays outside the markers.

<!-- spec-catalog:start -->
| Spec | Description | Status |
|---|---|---|
| [S-001 - Capability](workbench/specs/S-001-capability/SPEC.md) | [Short catalog description] | planned |
<!-- spec-catalog:end -->

## Cross-Cutting Health

- `[BASELINE_TEST_COMMAND]` passes;
- `[BUILD_LINT_OR_AUDIT_COMMAND]` passes when relevant;
- the primary workflow succeeds end to end;
- secrets and private data stay out of committed output;
- spec doctor/render checks report no lifecycle, link, or projection drift.

## Workbench Entry And Delivery Boundaries

### Core Navigation Contract

**Traverse, don't search** is a core Workbench feature. The Context Map connects
shared meanings, controls, assigned specs, Wiki context, and referenced
source/evidence through existing owners. Enter through
[Lexicon Task Routing](LEXICON.md#task-routing); new durable context must be
reachable from its relevant entry route and link back to its sources.
[AGENTS.md](AGENTS.md#traverse-dont-search) owns the behavior and bounded search
fallback. Ordinary portable links provide this structure; a visual graph or
retrieval index is a source-derived view, not a second truth store. Foundry,
Obsidian, and a recall service are not prerequisites. Link coverage and any
automated traversal capability require their own verification.

### Entry And Delivery

The seven-control Contract enters through AGENTS -> RUNBOOK -> LEXICON, then
assigned work and task-relevant owners. This Blueprint loads for architecture
and cross-cutting direction. SPEC and TASK assign portable stances; stances
change method without transferring authority or spawning agents. Independent
review is required before branches combine at integration. Required steps need
immediate delivery value; uncertain practices remain optional and reviewable.
A setup-only Round One proof reports in chat before feedback-report testing.

## Accepted Continuity And Distribution Direction

The Workbench's continuity promise spans maintained controls, specs, Wiki,
source, verified achieved state and objective notes. A fresh capable agent must
recover authorized work from those owners; notes preserve unfinished reasoning.
A real useful continuation demonstrates that workflow. Only repeated controlled,
held-out, condition-blind trials with uncertainty support improved agent-outcome
claims; static checks and a single demonstration do not. Preserve criteria and
failed results. Interface acceptance applies to the product's actual interface.

The portable runtime stays Node/JavaScript; Python retains evaluation and existing
append-only checks. Both languages deserialize JSON; no intrinsic Python JSON
penalty is asserted. Skills compose reusable independent behavior within inherited
scope. Mention, routing, invocation and authorization are distinct; a helper
cannot enlarge its caller's authority. Read-only names the target, while permitted
local working capture remains within the assignment.

Core skills are exclusively upstream-owned and sufficient without a personal
catalog, including reconciled save/promote/notepad. Optional personal/shared
skills and room-local source remain distinct ownership scopes. One selected
global core release carries a tested room compatibility range. The global
.agents/skills root holds managed ignored/excluded core installation alongside
optional personal source; Claude discovery adapts the same source. One source
per skill and one discovery entry per application; no third .codex/skills catalog.
Normal setup preserves existing names; explicit replacement backs up differences.
Room-local promotion into a personal catalog remains owner-directed.

Optional private workbench_sessions Git transport is the accepted cross-device
direction. Stable Workbench identity survives clone/worktree/rename; independent
instantiation receives a new identity, separate from artifact IDs. Selected live
notes/grilling/handoffs map under workbenches/<WBID>/sessions/; schemas/templates
and promoted knowledge stay in project Git. Live records remain ignored there,
non-authoritative, and privacy bounded. Fetch before resume; meaningful saves
and device switching require explicit push/remote acknowledgment, with offline
pending status and last confirmed revision. Serialize sync, preserve conflicts,
and never silently overwrite or force push. Git history retention is accepted;
transport does not move unpushed code or running processes. Local use is independent.
Actual Mac/Windows Claude/Codex round-trip proof is required for that claim.

Promotion writes selected, privacy/validity-checked material directly to its named
durable owner, verifies read-back and faithful reconciliation, then permits scoped
source cleanup. Preserve unfinished/correction/transfer dependencies. Existing
checkpoints remain frozen history; new copy creation is retired. Operational
recovery uses the ignored `sessions/recovery/` collection; legacy rollback remains usable. No new permanent
handoff store substitutes for checkpoints. Capability checks cannot replace
semantic judgment or authorization.

Genesis, adoption and explicit upgrade have different allowed effects and
preservation contracts. Verify all consumed source lanes before mutation.
Separate release, historical adoption, installed manifest, tool/skill bytes,
executing runtime and downstream acceptance identities. Verify the actual remote
ref and object; inaccessible remote state remains unknown. Control divergence is
visible and deliberate against a matched template generation; fidelity stays a
report. A recorded unavailable baseline is distinct from measured red and never
waives release acceptance; use the existing closed baseline policy.

Supported-host claims require a small agreed operational floor checked in the
actual configured environment. Agree requirements before choosing schema,
diagnostics or tests. Missing capabilities affect dependent work only; unavailable
checks stay unverified. Capability, actual enforcement and model reliability need
separate evidence. New native enforcement hooks are outside core; discovery and
evaluation adapters are distinct. Enforcement needs a running mechanism with
supporting evidence, whether host-owned or Workbench-owned.

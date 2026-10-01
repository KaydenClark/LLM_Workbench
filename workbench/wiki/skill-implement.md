---
type: memory
status: partial
sensitivity: normal
knowledge_role: curated
provenance:
  - S-01H TK-00Y source inspection and focused red/green checks, 2026-10-01
  - mattpocock/skills pinned comparison at d81f3a183412e71a5b1e84ca21bc1a35eea03a60
source_paths:
  - workbench/skills/implement/SKILL.md
  - workbench/skills/implement/references/scenario.md
  - tools/test-implement-skill.mjs
  - workbench/specs/S-01H-implement-skill-rebuild/SPEC.md
  - AGENTS.md
  - RUNBOOK.md
last_verified: 2026-10-01
---

# Implement: deliver one assigned Task with checkable proof

Use [implement](../skills/implement/SKILL.md) to build one already-authorized
Task. Its inputs are the assigned Spec and Task, their acceptance and testing
seam, current Contract, attributed branch and prior receipts. Its output is a
scoped candidate, tests, maintained documentation and truthful proof in those
owners. It grants no permission to choose another Task or approve its own work.

## Execution and completion

The skill recovers `TASK.md`, receipt rows and objective context before claiming
ready work or resuming a verified claim. It drives a durable failing check to
green at the agreed seam, runs required verification, updates the owning docs,
and appends an in-progress receipt. Worker self-check examines scope, acceptance,
results, documentation and claims before handing proof to the Dispatcher or
assigned owner. The Taskboard remains generated from its owners.

For example, an assigned filter Task can add tests showing a throwing stub fails,
implement the filter, pass tests for selection and unchanged input, document a
usage example, and save a reviewable candidate. The
[scenario protocol](../skills/implement/references/scenario.md) describes that
evaluation; this example is not a report that an agent completed it.

The endpoint comes from the assignment. A draft-only run stops with a candidate
and named pending gates. Normal scoped Task handback is distinct from the
separate-context review required before integration. Task closure needs scoped
acceptance and proof; Spec completion and owner Human QA follow the
[Contract](../../AGENTS.md) and [Runbook](../../RUNBOOK.md), not the skill's own
judgment. A blocked push leaves a local recovery point, not verified remote
recovery or delivery.

## Composition and lineage

`carry` composes implement for a Task's build loop. Implement composes `to-docs`
for owning documentation and `save` for scoped persistence with freshly fetched
Git containment proof. `code-review` supplies the independent review at the
applicable integration boundary. Changing stance does not confer independence.

The [pinned upstream source](https://github.com/mattpocock/skills/blob/d81f3a183412e71a5b1e84ca21bc1a35eea03a60/skills/engineering/implement/SKILL.md)
is a short implementation instruction: work from the supplied spec or tickets,
use TDD at agreed seams, check regularly and run the full suite, review, and
commit on the current branch. Workbench retains that build-and-check pattern
while adding manifest routing, one assigned Task, claim/resume, documentation,
receipts, authorized endpoints, independent integration gates and remote
recovery. This establishes a supported comparison, not proof of exact historical
copy ancestry. Upstream's optional TDD wording does not weaken this room's
required red/green contract.

## Evidence and limits

Source comparison uses Workbench pre-change `95176a4f216cc3d684301a355d6d23369ab275a1`
and repaired source `9d12d4c` via `git show <sha>:workbench/skills/implement/SKILL.md`.
[Focused checks](../../tools/test-implement-skill.mjs) failed at `3a30c15` and
passed at `9d12d4c`. They check source obligations and exercise Git containment
with unpublished and remotely contained commits. They do not prove model
compliance. Configured-agent execution remains unobserved: the available host
failed to initialize its app-server on read-only storage. No installed-behavior,
repeated reliability, owner Human QA or new core-bundle count is claimed.
The [owning Spec](../specs/S-01H-implement-skill-rebuild/SPEC.md) holds current
acceptance and verification, including any later scenario result.

---
type: memory
status: partial
sensitivity: normal
knowledge_role: curated
provenance:
  - S-01H TK-00Y source inspection and focused red/green checks, 2026-10-01
  - mattpocock/skills pinned comparison at d81f3a183412e71a5b1e84ca21bc1a35eea03a60
  - S-004C TK-005G moved the Runbook and AGENTS lifecycle procedures behind their index pointers into the skill, 2026-10-03
  - S-004C TK-005H moved the Git route, pull-request and branch completion procedures behind their index pointers into the skill, 2026-10-03
  - S-004C TK-005I moved the verification steps, the generic test coverage policy and benchmark-driven improvement behind their index pointers into the skill, 2026-10-04
source_paths:
  - workbench/skills/implement/SKILL.md
  - workbench/skills/implement/references/scenario.md
  - tools/test-implement-skill.mjs
  - workbench/specs/S-01H-implement-skill-rebuild/SPEC.md
  - AGENTS.md
  - RUNBOOK.md
last_verified: 2026-10-04
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
evaluation. The coordinator-observed run described below is reported separately
from this illustrative example.

The endpoint comes from the assignment. A draft-only run stops with a candidate
and named pending gates. Normal scoped Task handback is distinct from the
separate-context review required before integration. Task closure needs scoped
acceptance and proof; Spec completion and owner Human QA follow the
[Contract](../../AGENTS.md) and [Runbook](../../RUNBOOK.md), not the skill's own
judgment. The skill also carries the
[work-selection and lifecycle rules](../skills/implement/SKILL.md#work-selection-and-lifecycle)
and the [Worker procedure](../skills/implement/SKILL.md#worker-selection-implementation-and-hand-back)
for selection, claim, receipts and close, and the
[version-control procedures](../skills/implement/SKILL.md#version-control-procedures)
and [branch completion](../skills/implement/SKILL.md#branch-completion) for
branching, pull requests, merge, containment proof and merged-branch cleanup,
which the [Runbook operations index](../../RUNBOOK.md#operations-index) points
to. The room's own Git commands stay in its Runbook. It also carries the
[verification steps](../skills/implement/SKILL.md#engineering-and-verification),
the [test coverage policy](../skills/implement/SKILL.md#test-coverage-policy)
and [benchmark-driven improvement](../skills/implement/SKILL.md#benchmark-driven-improvement);
`AGENTS.md` keeps the verification rules every session obeys, and the room's
one full suite list stays in its Runbook's
[Test And Build](../../RUNBOOK.md#test-and-build). A blocked push leaves a local recovery point, not verified remote
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
and repaired source `58e8f0441e1a7222d0f64fd064e814978c495194` via `git show <sha>:workbench/skills/implement/SKILL.md`.
[Focused checks](../../tools/test-implement-skill.mjs) failed at `3a30c15` and
passed at `9d12d4c`. They check source obligations and exercise Git containment
with unpublished and remotely contained commits. They do not prove model
compliance. The cloud host failed to initialize its app-server on read-only
storage; those failed attempts remain preserved.

The release coordinator subsequently reported observing one new synthetic
Servitor run using Codex CLI 0.159.3 and configured gpt6.1sol with the public
protocol and candidate source at `b38f4f7`. It loaded the Contract and assigned
Task, claimed only the fixture Task, observed four stub-test failures before
implementation, then passed 4/4 tests and produced README documentation, a
native in-progress receipt, self-check and remotely contained draft candidate.
The coordinator independently rechecked tests, doctor, receipt checksum, diff
and Git containment locally. The unrelated Task and local/remote main and
integration were unchanged; the assigned Task stayed in progress at its draft
endpoint. Three pre-existing synthetic setup notices remained. An earlier
Servitor attempt refused writes before implementation with zero changes; the
successful retry used run-scoped access to only the disposable fixture Git
directory and local bare origin, with no reported global configuration,
authentication or security changes.

This is attributed coordinator observation. The cloud producer and cloud
behavior reviewer have not inspected the raw tool records or Git objects,
which remain on Servitor. Explicit source loading in one synthetic fixture is
not installed behavior, repeated reliability, whole-Task acceptance or owner
Human QA. The owning Spec preserves exact reported commits, integrity checks,
failed attempts and pending review. No new core-bundle count is claimed.
The [owning Spec](../specs/S-01H-implement-skill-rebuild/SPEC.md) holds current
acceptance and verification, including any later scenario result.

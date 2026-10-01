---
type: memory
status: partial
sensitivity: normal
knowledge_role: curated
provenance:
  - S-01P TK-01G source review and contract regression, 2026-10-01
source_paths:
  - workbench/skills/builder/SKILL.md
  - workbench/skills/builder/references/verification.md
  - workbench/specs/S-01P-builder-skill-rebuild/SPEC.md
  - tools/test-builder-skill.mjs
  - workbench/skills/implement/SKILL.md
  - workbench/skills/auditor/SKILL.md
  - LEXICON.md
  - workbench/docs/adr/0036-stances-change-method-not-authority.md
last_verified: 2026-10-01
---

# Builder: deliver one assigned result with checkable proof

Builder is the stance for delivering an already assigned Task with useful
verification and truthful documentation. The Spec and Task set the stance;
loading it changes how the agent works, never what it may do. It selects no
new assignment and starts no agent. The [Contract](../../AGENTS.md), current
request and assigned Spec continue to bound authority.

**Inputs:** the assigned Spec and Task, relevant source and tests, acceptance
criteria, the project's verification requirements and the caller's endpoint.
**Outputs:** the scoped change, observed checks, accurate owning documentation
and Task state, and an account of remaining risk or the next in-scope action.
There is no mandatory extra report file or handoff artifact.

## Method and completion signs

The [skill](../skills/builder/SKILL.md) makes the narrow result and the test that
would disprove it explicit before editing. It traces relevant callers, preserves
unrelated work, and applies red/green verification at the public seam. Its
completion report carries four things: actual result, evidence, documentation
state and remaining risk. An unmet acceptance condition or required review
keeps the Task incomplete, even if implementation tests pass.

The specific commands and state transitions belong to the [Runbook](../../RUNBOOK.md)
and the assigned [Spec](../specs/S-01P-builder-skill-rebuild/SPEC.md), not this
article. A candidate, an independently reviewed change, integration delivery
and a release are distinct achievements.

## Example

Illustrative, not an observed agent run: a Task asks for a CLI to reject
non-finite input and limits work to a local review candidate. Builder would
show the CLI accepting an invalid value in a failing test, repair that behavior,
run the required suite and update the CLI's documentation. Its final account
would name the changed behavior, exact test results, documentation owner,
candidate revision and the independent review still needed. It would leave
that gate visible and the Task incomplete, without picking another ready Task
or pushing merely because a helper describes a push step.

The [synthetic scenario](../skills/builder/references/verification.md) describes
how a separately authorized fresh context can check this example and a missing
verification-resource case. It is a procedure, not behavioral evidence.

## Composition and comparison

Builder composes [Implement](../skills/implement/SKILL.md) for the execution
loop, [Tracer Bullet](../skills/tracer-bullet/SKILL.md) to assess a complete
slice, [To Docs](../skills/to-docs/SKILL.md) to route changed truth, and
[Code Review](../skills/code-review/SKILL.md) at the independent review boundary.
Every helper inherits the existing Task and the caller's narrower endpoint;
composition grants no pickup, planning, dispatch or publication authority.

There is no Matt counterpart named by the owning Spec. The nearest local
workflow neighbor is Implement: it describes execution and recovery steps,
whereas Builder supplies the posture and obligations inside an existing
assignment. The nearest stance neighbor is [Auditor](skill-auditor.md): it
checks named claims read-only and returns a bounded verdict, whereas Builder
may make the authorized change and owns its documentation. This comparison
explains the boundary without importing another skill or third-party source.

## Verified source and limits

The source revision and dated red/green results are pinned in the
[Spec evidence](../specs/S-01P-builder-skill-rebuild/SPEC.md#append-only-evidence-and-execution-log).
`tools/test-builder-skill.mjs` checks scope and completion wording, the four
stance sections and local links. These are source-contract assertions only.
They do not establish what a fresh agent actually does, installed discovery,
mechanical enforcement, behavioral reliability or owner Human QA. Read the
Spec for actual trial results and any missing proof; this article carries no
live Task status. Personal installations are not changed by editing this source.

A later coordinator report attributes two fresh synthetic trials to a separate
Servitor observer using the same Builder source hash. The
[Spec evidence](../specs/S-01P-builder-skill-rebuild/SPEC.md#append-only-evidence-and-execution-log)
owns their reported outcomes, custody and limitations. This article does not
claim the implementing author inspected raw traces or independently verified
those observations, and the reports do not establish installed discovery,
whole-Spec acceptance or owner Human QA.

## Sources

- [Builder source](../skills/builder/SKILL.md) and [scenario](../skills/builder/references/verification.md)
- [Individual delivery Spec](../specs/S-01P-builder-skill-rebuild/SPEC.md)
- [Stance terms](../../LEXICON.md#stance-terms)
- [ADR-0036: stances change method, not authority](../docs/adr/0036-stances-change-method-not-authority.md)
- [Wiki router](MEMORY.md)

## History

- 2026-10-01: Authored from Builder, Implement and Auditor source comparison;
  distinguishes contract regression from behavioral validation and explains
  bounded composition and truthful completion.

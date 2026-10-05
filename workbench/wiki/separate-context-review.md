---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Observed during S-00X TK-00O review, 2026-09-24
  - Promoted from host auto-memory by the S-00V TK-00I audit, 2026-09-26
  - Owner correction in chat, 2026-10-05, recorded in the S-00O evidence log
source_paths:
  - AGENTS.md
  - RUNBOOK.md
  - workbench/skills/code-review/SKILL.md
  - workbench/specs/S-00O-workbench-v4-0-0-release/SPEC.md
last_verified: 2026-10-05
---

# Separate-context review

A separate-context review is a second agent checking finished work before the
owner sees it. The reviewer has to be a fresh context: a new session or
subagent that did not write the work and starts from only the diff, its Spec
and the controls. A reviewer who wrote the code shares its author's blind
spots, so a fresh reader catches what the author's own pass misses.
[AGENTS](../../AGENTS.md#git-rules) owns the rule; the
[`code-review` skill](../skills/code-review/SKILL.md#independent-review-boundaries)
owns the procedure.

## When it runs

Once per Spec, on the assembled Spec, after its last Task has landed (WF-8C).
A single Task gets no separate-context review of its own (WF-8B): it lands on
its own verification - red/green TDD, the full suite on the committed
candidate and its Receipt. A failed Spec review becomes corrective Tasks under
the still-open Spec, then a fresh candidate is reviewed.

## Where it runs

On the host already doing the work: a Claude session uses a fresh Claude
subagent or session, a Codex session a fresh Codex one. No agent invokes
another provider's CLI or account for a review unless the owner asks for it in
the current request. The owner's provider accounts are the owner's to spend.

## Why this page changed

From 2026-09-16 to 2026-10-05 the S-00O release Spec required a separate-context
review of every PR into `integration`, and every Task landed as its own PR, so
every Task was reviewed - again after each rebase. Claude agents met that by
shelling out to the Codex CLI (`codex exec -s read-only`), a route this page
used to document as "one working route". Spec evidence logs carry
roughly 290 rows naming such a Codex review, 84 of them dated 2026-09-26, and the runs used
up the owner's Codex allowance. The owner corrected both on 2026-10-05: review
moved to Spec completion, and the Codex route was withdrawn. The CLI notes it
held remain in Git history only.

See [parallel-lane-dispatch](parallel-lane-dispatch.md).

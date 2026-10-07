---
type: memory
status: draft
sensitivity: normal
knowledge_role: curated
skill: retro
group: main-workflow
skill_source: core
origin: matt
matt_counterpart: engineering/retro
supersedes: none
provenance:
  - Owner-requested required Core adoption, 2026-10-06
  - Matt Pocock source at d81f3a183412e71a5b1e84ca21bc1a35eea03a60, adapted to Workbench ownership and invocation
source_paths:
  - workbench/skills/retro/SKILL.md
  - workbench/specs/S-002V-retro-skill-adoption/SPEC.md
  - workbench/manifest.json
  - THIRD_PARTY_NOTICES.md
last_verified: 2026-10-06
---
# Retro: turn a difficult session into proposed environment improvements

## What it does

You name a coding session, or use the current one. You receive a short list of evidence-backed improvements to the agent's environment, most consequential first. The [skill source](../../../skills/retro/SKILL.md) owns the procedure; the [adoption Spec](../../../specs/S-002V-retro-skill-adoption/SPEC.md) owns delivery evidence. Proposed changes stay proposals until you direct follow-up.

## When to reach for it

| What you have | Reach for |
|---|---|
| A session that took unnecessary searching, retries or correction | retro |
| A selected environment intervention to implement and evaluate | improve-harness |
| Achieved work whose existing owners need reconciliation | reconciler within the assigned role |
| A fixed implementation candidate needing independent review | code-review |

## What it needs

The primary session record, the room's relevant controls and source, and its current check commands, CI and hooks. The shipped [writing reference](../../../skills/writing-for-agents/SKILL.md) supplies authoring guidance. Logs or service information outside available access remain an evidence gap, never an invented source or permission change.

## What it reads and writes

It reads session messages and tool results, relevant commits, controls, verification commands, CI and hooks. It writes a response containing proposals. If you request a saved report, it uses the room's existing feedback format and documentation owner through [to-docs](../../../skills/to-docs/SKILL.md). It creates no lesson ledger, edits no code or controls, and changes no approval or lifecycle state.

## How it works

It establishes the session and revision, traces observations to their primary sources, and looks for environmental causes. It checks existing guardrails before proposing another check, separates mechanical rules from judgement, and examines navigation, instruction load, tool cost and missing information. It presents candidates in severity order. The room's existing controls govern any later assignment, saved report or intervention; the imported skill does not duplicate them.

## Common questions

**Does a lesson authorize a fix?** You select and direct the follow-up. An accepted intervention can enter [improve-harness](../../../skills/improve-harness/SKILL.md); that workflow owns the implementation, rerun and durable feedback record.

**Does it replace the old feedback-review family?** No new audit system is introduced. The live improve-harness skill already replaces that historical family. Retro is its proposal-only entry from a session, while Reconciler reconciles achieved work.

**What if the logs are missing?** You get the coverage limit and conclusions restricted to observable evidence. A summary alone cannot prove an action never occurred.

## It's working if

You receive candidates grounded in the named session, ordered by severity, and existing check commands are examined before another guardrail is proposed. Candidate selection and implementation remain owner-directed under the room's existing controls. A fresh-context scenario and portable install checks are required by the owning Spec; file presence alone proves neither host discovery nor behavioral reliability.

## Where it fits

Session evidence -> retro proposals -> owner-selected intervention -> improve-harness -> native checks and fresh rerun -> existing feedback owner. This is a main-workflow skill required in every room and explicitly invoked by the user.

--- draft only, stripped on promotion ---

## Compared with Matt's

Verdict: same behavior. The entrypoint retains engineering/retro at d81f3a183412e71a5b1e84ca21bc1a35eea03a60 except for step 1: the host-specific Skill tool instruction is replaced by a link to the shipped writing reference. The seven categories, default session, severity order and reference wording remain unchanged. Separate Codex metadata preserves explicit invocation. Upstream assumptions about standards-file names and reviewer context are read under the room's current controls; they do not replace its authority or review requirements.

## Findings

F:retro:01 | overlap | Session environment diagnosis overlaps improve-harness; retro stops at proposals and delegates accepted intervention and rerun to that existing workflow | S-002V
F:retro:02 | stale-name | The pre-anchor Spec names the historical feedback-review family as nearest behavior; the live improve-harness source has replaced it | S-002V
F:retro:03 | gap | Native configured-host discovery and explicit-only enforcement need host evidence beyond filesystem and fresh-context fixtures | S-002V

## Sources and history

- [Matt's pinned source](https://github.com/mattpocock/skills/blob/d81f3a183412e71a5b1e84ca21bc1a35eea03a60/skills/engineering/retro/SKILL.md) and the owner's supplied copy were read on 2026-10-06.
- Live reconciler, improve-harness, notepad and to-docs sources were checked to keep their responsibilities separate. Feedback tools and format keep their existing owners.
- [Template 2](../TEMPLATE.md) supplies this draft's shape. The owner chose required Core on 2026-10-06. Independent review, integration and owner closure remain separately recorded in the Spec.

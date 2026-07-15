# S-011 - Agent Skills Adoption

> Generated from LLM Workbench v2.3. Stable path
> `specs/S-011-agent-skills-adoption/SPEC.md`; never move between status folders.

**Spec ID:** S-011
**Status:** active
**Priority:** 2
**Owner:** Kayden (product); Claude (execution)
**Updated:** 2026-07-14
**Catalog description:** Curated, Workbench-vocabulary agent skills (grill, to-spec, to-tickets, implement, review) shipped as part of the harness.
**Blockers:** none
**Latest event:** TK-001 done: 28 skills imported from mattpocock/skills (MIT) with provenance README; GPT_OS discovery wired via `.claude/skills` symlink.
**Next gate:** Owner supplies rewrite direction; TK-002 rewrites the core-flow skills to Workbench nouns.

## Outcome

Agents and the owner invoke the harness workflow through named skills —
interview a plan (`grill-me`), capture a spec (`to-spec`), break it into
tracer-bullet tickets (`to-tickets`), implement one ticket with verification and
evidence (`implement`) — instead of re-explaining the process each session. The
skills speak Workbench vocabulary and ship with the harness.

## Why It Matters

The harness has strong control docs but no conversational entry points; the
owner has been retyping process prompts. The Pocock skill set proved the
pattern; owning rewritten copies keeps the tools debuggable ("if the tools
aren't yours you won't know how to fix them") and keeps one truth contract.

## Current Verified State

- 28 upstream skills imported unmodified to `skills/` (see `skills/README.md`
  disposition table); 12 author-personal/superseded skills excluded.
- Imported text still references upstream conventions (`docs/agents/`,
  `CONTEXT.md`, `.scratch/`, GitHub issue trackers) that conflict with the
  Workbench truth-routing contract; rewrites pending.
- GPT_OS root discovers the folder via `.claude/skills` symlink; discovery in a
  fresh Claude Code session not yet verified.

## Desired Behavior

- Core-flow skills operate on `BLUEPRINT.md`, `specs/S-###-slug/SPEC.md`,
  `TASKBOARD.md`, and `RUNBOOK.md` with no parallel truth files.
- A router skill (rewritten `ask-matt`) maps situations to skills.
- Skills are distributed to projects through the harness upgrade path.

## Decisions And Contracts

- Canonical skill source lives in this repo at `skills/`; projects consume via
  `.claude/skills` symlink or copy. `.agents/skills/` in GPT_OS stays an
  untracked upstream reference snapshot only.
- Upstream license is MIT; provenance and attribution recorded in
  `skills/README.md`.
- Until rewritten, imported skills' upstream conventions are not in effect in
  Workbench projects (see `skills/README.md`).
- BLUEPRINT keeps its name and design-concept role; the Pocock per-feature
  "spec/PRD" maps to `S-###` specs and tickets, not to BLUEPRINT.

## Non-Goals

- Importing author-personal, course, or superseded upstream skills.
- Renaming Workbench control docs to upstream names (PRD, kanban).
- Building a plugin/marketplace distribution channel.

## Dependencies And Blockers

- TK-002 blocked on owner rewrite direction (Kayden has notes to supply).

## Vertical Implementation Slices

Tickets are temporary tracer bullets within this stable capability record.

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Import curated upstream skills with provenance and wire GPT_OS discovery | done | none | see evidence 2026-07-14 |
| TK-002 | Rewrite core-flow skills to Workbench vocabulary per owner direction | blocked | owner direction | pending |
| TK-003 | Router skill replacing ask-matt; verify discovery in fresh session | ready | none | pending |

## Acceptance Criteria

- [ ] Core-flow skills reference only Workbench control-doc nouns (no
      `docs/agents/`, `.scratch/`, `CONTEXT.md` writes).
- [ ] A fresh Claude Code session in GPT_OS lists the skills as invocable.
- [ ] Router skill routes the main flow (grill → to-spec → to-tickets →
      implement → review) using Workbench names.
- [ ] `skills/README.md` disposition table matches the folder contents.

## Testing Seams

- Static: grep imported/rewritten skills for forbidden upstream nouns.
- Runtime: fresh-session skill listing in GPT_OS (manual, owner-checkable).

## Verification Procedure

```bash
ls skills | wc -l   # matches README disposition count (28 + README)
grep -rl "docs/agents\|\.scratch/" skills/<rewritten-skill>/  # empty after TK-002
node tools/spec-workbench.mjs doctor
```

## Documentation Impact

- `skills/README.md` owns provenance/disposition (done).
- Machine wiki GPT_OS page notes the new skills surface after rollout (TK-003).
- RUNBOOK/BLUEPRINT references updated when skills become part of the shipped
  harness contract (TK-002+).

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-07-14 | TK-001 | Imported 28 skills from mattpocock/skills (MIT) into `skills/` with provenance README; linked `GPT_OS/.claude/skills` -> `workbench templates/skills` | `ls skills | wc -l` = 29 (28 + README); full suite + doctor green (see PR) | skills/README.md added | Fresh-session discovery unverified (TK-003); rewrites pending (TK-002) |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Symlinked `.claude/skills` discovery must be confirmed in a new session; the
  fallback is copying the folder.
- Distribution to existing projects follows via `update-harness` once TK-002
  lands.

## Supersession

- Supersedes: none
- Superseded by: none

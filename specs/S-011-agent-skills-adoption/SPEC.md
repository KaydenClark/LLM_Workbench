# S-011 - Agent Skills Adoption

> Generated from LLM Workbench v2.3. Stable path
> `specs/S-011-agent-skills-adoption/SPEC.md`; never move between status folders.

**Spec ID:** S-011
**Status:** active
**Priority:** 2
**Owner:** Kayden (product); Claude (execution)
**Updated:** 2026-07-15
**Catalog description:** Curated, Workbench-vocabulary agent skills (grill, to-spec, to-tickets, implement, review) shipped as part of the harness.
**Blockers:** none
**Latest event:** TK-002 scoped to the first core-flow tracer bullet: rewrite `to-tickets` so slices live only in the assigned Workbench spec.
**Next gate:** TK-002 adds a failing contract check, rewrites `to-tickets`, and proves the spec-only ticket flow without changing another skill.

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

- `skills/` contains exactly the 27 entries in the owner-approved catalog: 25
  selected upstream baselines, the Workbench-owned `ask-workbench` router, and
  the native `update-harness` skill.
- Most imported text still references upstream conventions (`docs/agents/`,
  `CONTEXT.md`, `.scratch/`, GitHub issue trackers) that conflict with the
  Workbench truth-routing contract; rewrites pending.
- GPT_OS exposes the same tracked folder through `.claude/skills` and
  `.agents/skills`; the untouched upstream snapshot and installer lock are
  preserved at `.agents/upstream-matt-skills-2026-07-14/`.
- Root and template `LEXICON.md` files now own accepted shared definitions,
  seeded with the owner's definition of design concept.
- Filesystem discovery is verified; fresh Claude and Codex session listings are
  still an owner-checkable runtime gate.

## Desired Behavior

- Core-flow skills operate on `BLUEPRINT.md`, `specs/S-###-slug/SPEC.md`,
  `TASKBOARD.md`, and `RUNBOOK.md` with no parallel truth files.
- `LEXICON.md` owns accepted cross-capability terms without becoming an
  always-loaded requirements or decision file.
- `ask-workbench` maps situations to the smallest suitable skill or flow.
- Skills are distributed to projects through the harness upgrade path.

## Decisions And Contracts

- Canonical skill source lives in this repo at `skills/`; GPT_OS points both
  `.claude/skills` and `.agents/skills` at it. Downstream projects consume a
  symlink or copied rewritten subset through the harness upgrade path.
- `skills/README.md` owns the selected names, definitions, and rewrite lanes;
  `tools/test-skill-catalog.mjs` fails when the catalog and folders diverge.
- The untouched upstream snapshot stays outside live discovery at
  `.agents/upstream-matt-skills-2026-07-14/`.
- Upstream license is MIT; provenance and attribution recorded in
  `skills/README.md`.
- Until rewritten, imported skills' upstream conventions are not in effect in
  Workbench projects (see `skills/README.md`).
- `LEXICON.md` owns shared definitions. `BLUEPRINT.md` helps participants
  reconstruct the design concept but is not the design concept or glossary.
- BLUEPRINT keeps its name and design-concept role; the Pocock per-feature
  "spec/PRD" maps to `S-###` specs and tickets, not to BLUEPRINT.

## Non-Goals

- Importing author-personal, course, or superseded upstream skills.
- Renaming Workbench control docs to upstream names (PRD, kanban).
- Building a plugin/marketplace distribution channel.

## Dependencies And Blockers

- none; the owner supplied the selected roster and initial definitions.

## Vertical Implementation Slices

Tickets are temporary tracer bullets within this stable capability record.

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Import curated upstream skills with provenance and wire GPT_OS discovery | done | none | see evidence 2026-07-14 |
| TK-002 | Rewrite `to-tickets` to persist slices only in the assigned Workbench spec | ready | none | pending |
| TK-003 | Verify rewritten skills in fresh Claude and Codex sessions and prepare downstream distribution | blocked | TK-002, TK-005 | pending |
| TK-004 | Reconcile the owner-selected catalog, canonical cross-agent discovery, and shared Lexicon | done | none | see evidence 2026-07-14 |
| TK-005 | Rewrite the selected supporting/design skills without adding parallel truth stores | blocked | TK-002 | pending |

### Scoped Ticket: TK-002

**Timebox:** 15-45 minutes.

**Vertical slice:** Rewrite only `skills/to-tickets/SKILL.md` as the first
core-flow exemplar. Given an already-assigned `S-###` spec, the skill proposes
one-context tracer-bullet slices and, after approval, updates that spec's
`Vertical Implementation Slices` table. It must not create `.scratch/` issue
files, publish to an external tracker, or introduce another requirements,
decision, or proof store.

**Done criteria:**

- `skills/to-tickets/SKILL.md` names the assigned `SPEC.md` as the only ticket
  store, keeps `TASKBOARD.md` a generated projection, and uses the lifecycle
  commands from `RUNBOOK.md` rather than upstream tracker setup.
- A red/green contract in `tools/test-skill-catalog.mjs` first fails on the
  imported `.scratch/` and tracker workflow, then passes after the rewrite; it
  also requires the stable Workbench nouns and `render`/`doctor` handoff.
- The rewrite changes no other skill and creates no ticket file outside this
  stable spec.
- The targeted catalog test and the full RUNBOOK verification suite pass; the
  spec evidence names both results and the remaining core-skill rewrite gap.

**Verification:**

- Targeted red/green: `node tools/test-skill-catalog.mjs`.
- Full suite: the eleven commands under RUNBOOK `Full verification`, followed
  by `node tools/spec-workbench.mjs render`,
  `node tools/spec-workbench.mjs doctor`, and `git diff --check`.

**Documentation:** Update this spec's append-only evidence and render the
generated Taskboard. Check `skills/README.md`, `RUNBOOK.md`, and `BLUEPRINT.md`;
if the existing catalog definition and contracts remain accurate, record
`Docs checked; no update needed` with that reason rather than duplicating them.

**Dependencies and blockers:** none. Do not claim TK-003 or TK-005 in this
slice. Rewriting the remaining core skills is an explicit later gap, not part of
TK-002.

## Acceptance Criteria

- [x] The selected catalog and physical skill folders match exactly.
- [x] GPT_OS `.claude/skills` and `.agents/skills` resolve to the tracked
      Workbench skill folder; the upstream snapshot remains preserved.
- [x] Root and template Lexicons preserve the owner's design-concept definition
      and the Workbench truth-routing boundary.
- [ ] Core-flow skills reference only Workbench control-doc nouns (no
      `docs/agents/`, `.scratch/`, `CONTEXT.md` writes).
- [ ] A fresh Claude Code session in GPT_OS lists the skills as invocable.
- [ ] A fresh Codex session in GPT_OS lists the same canonical skills.
- [x] Router skill routes the main flow (grill → to-spec → to-tickets →
      implement → review) using Workbench names.
- [x] `skills/README.md` selected catalog matches the folder contents.

## Testing Seams

- Static: selected catalog/folder/Lexicon self-test plus forbidden-noun scan.
- Runtime: both discovery symlinks resolve to the canonical folder; fresh-session
  skill listings remain manual, owner-checkable gates.

## Verification Procedure

```bash
node tools/test-skill-catalog.mjs
readlink /Users/kayden/GPT_OS/.claude/skills
readlink /Users/kayden/GPT_OS/.agents/skills
grep -rl "docs/agents\|\.scratch/" skills/<rewritten-skill>/  # empty after TK-002
node tools/spec-workbench.mjs doctor
```

## Documentation Impact

- `skills/README.md` owns provenance, selected definitions, and rewrite lanes.
- Root/template `LEXICON.md` own shared-definition structure.
- Root/template controls point to the Lexicon and catalog self-test.
- Machine wiki GPT_OS page notes the new skills surface after rollout (TK-003).
- RUNBOOK/BLUEPRINT references updated when skills become part of the shipped
  harness contract (TK-002+).

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-07-14 | TK-001 | Imported 28 skills from mattpocock/skills (MIT) into `skills/` with provenance README; linked `GPT_OS/.claude/skills` -> `workbench templates/skills` | `ls skills | wc -l` = 29 (28 + README); full suite + doctor green (see PR) | skills/README.md added | Fresh-session discovery unverified (TK-003); rewrites pending (TK-002) |
| 2026-07-14 | TK-004 | Corrected the earlier count: the import contained 27 upstream folders plus native `update-harness`; reconciled that intake to the owner's 25 selected upstream baselines plus `ask-workbench` and `update-harness`; made the tracked folder canonical for both discovery paths; added root/template Lexicons | `node tools/test-skill-catalog.mjs` passed; both `readlink` calls resolve to `workbench templates/skills`; upstream snapshot and lock preserved | README, AGENTS, BLUEPRINT, RUNBOOK, GENESIS, ADOPTION, HARNESS_FEEDBACK, LEXICON, S-011 updated in root/templates as applicable | Core and supporting skill rewrites plus fresh-session listings remain |

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

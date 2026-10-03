# TK-005B - Record the pre-rewrite baseline and the dependency census

**Task ID:** TK-005B
**Spec ID:** S-004C
**Slice:** Record the pre-rewrite baseline and the dependency census
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: Every tool and test that read the old shape passes against the new one, and the full suite is green (the census names every reader this Spec must change), and the size and loaded-cost before-record of the brief acceptance line
**Planned verification:** The census is reproducible: its commands are recorded and re-running them at the pinned SHA gives the same classification. `node tools/evaluate-workbench.mjs --path templates --include-controls` and the guardrail audit run read-only and their scores are recorded. A self-drift pre receipt exists. No tracked carrier changed (`git diff --stat` over `AGENTS.md`, `RUNBOOK.md`, `LEXICON.md` and `templates/` is empty). The full AGENTS suite passes on the committed candidate.

## Outcome

Before any line moves, the rewrite has a pinned starting point and a list of
everything that reads the carriers' shape. A later reviewer can compare the
after-state with a recorded before-state instead of a memory of it.

The blocker is an `owner:` token because the blocker grammar cannot name a Task
in another Spec: it clears when the Dispatcher removes it after confirming on
`origin/integration` that Decision Record Tooling's TK-004X, TK-004Y and
TK-004Z are done (they edit the Runbook decision-record section). Clearing it is
not an owner decision.

Blocker cleared on 2026-10-03 by the Spec's single writer (the Dispatcher): at
`origin/integration` d7ffffe9 every Decision Record Tooling Task (TK-004W,
TK-004X, TK-004Y, TK-004Z, TK-005A, TK-005X, TK-006K) is `done`, its Runbook
decision-record section (`RUNBOOK.md` Architecture Decision Records and the
Destination Decision Records text after it) is on integration, and TK-004Y and
TK-004Z landed through PR #284 and PR #287. `owner:runbook-decision-record-section-landed`
is removed and this Task is ready.

## Scope

Pin the integration SHA at claim, then record in `census.md` in this Spec's
folder (the Spec folder is the only store):

- Bytes, lines and approximate loaded tokens (bytes divided by four, the ratio
  the accepted decision used) of `AGENTS.md`, `RUNBOOK.md`, `LEXICON.md`,
  `CLAUDE.md` and the `templates/` mirrors, and the sizes of the root and
  template Runbook sections by heading.
- The guardrail baseline (`tools/evaluate-workbench.mjs --path templates
  --include-controls` and the Guardrail North-Star Audit the Runbook names) and
  the Workbench self-drift pre receipt with the bounded manual semantic check.
- The census: every runtime tool under `workbench/tools/`, every test and eval
  under `tools/` and `evals/`, and every script that extracts a block from a
  carrier (including the read-only suite runner that reads the Full-suite block
  of `AGENTS.md`), classified as names the file only, reads a heading, asserts
  carrier content, or links an anchor. Include the inbound `AGENTS.md#` and
  `RUNBOOK.md#` anchor links across tracked Markdown, JSON and tests, with the
  count of files that carry them.
- The host-adapter facts the index design depends on: `CLAUDE.md` is pinned to
  the single import `@AGENTS.md` in a generated room, and which hosts load
  `AGENTS.md` natively.
- A confirmation or correction of the starting section map in this Spec's
  Vertical Implementation Slices section against the pinned SHA, including
  which Runbook sections the generic `templates/RUNBOOK.md` also carries (the
  audience split used by the room-operations and maintainer-operations Tasks).

## Acceptance

- [ ] `census.md` holds the before-sizes, both scores and the pre receipt,
      each with the command that produced it and the pinned SHA.
- [ ] Every reader of a carrier is classified, and the Tasks that must change
      each content-dependent reader are named.
- [ ] The section map is confirmed or corrected, with the audience split.

## Boundaries

Read-only against the carriers: no `AGENTS.md`, `RUNBOOK.md`, `LEXICON.md`,
template or skill edit, and no tool change. It cuts no new Task; a finding that
needs one is reported to the Dispatcher.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004c-tk005b-baseline-census | 66fb696758ac5c29396aea0afaadbb0738393b8d | ahead 0 behind 0 | 0 | Read-only record, no behavior change, so no red/green test applies. Full AGENTS suite 48/48 pass on committed candidate 66fb6967 (suite.sh, dirty: []). Re-run at d7ffffe9 in a clean detached checkout: evaluate-workbench --path templates --include-controls 106.6/113, audit-guardrails 78/100, self-drift --phase pre cleanUpdate false with the same 8 attention findings as the Dispatcher receipt, doctor exit 0, render no diff. git diff over AGENTS.md, RUNBOOK.md, LEXICON.md, CLAUDE.md, templates/, skills and tools is empty. | census.md added in the S-004C Spec folder; no carrier, template, skill, tool or Wiki change (the census alters no Wiki statement). | none for this Task; census findings 1-7 (static score reads only templates/, three tests execute Runbook text, TK-005G token looks satisfied, ADR canonicalized_in limit, Task packet carries only AGENTS.md, room-brain route line, section-map corrections) are reported to the Dispatcher | b7463d7381a6293647f5335d1e81674ae176a737d758011a5604d3368c42b5e3 |

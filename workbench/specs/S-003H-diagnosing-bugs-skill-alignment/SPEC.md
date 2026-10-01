# S-003H - diagnosing-bugs skill alignment

**Spec ID:** S-003H
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-30
**Catalog description:** Establish a tight reproduction, prove the root cause, and enter repair only when authorized.
**Blockers:** S-002L Skills draft wiki collection must deliver the draft-wiki location and article template before steps 2-5.
**Latest event:** Authored from the owner's 2026-09-30 draft-skills-wiki direction.
**Next gate:** Deliver S-002L, then activate this Spec and cut Tasks from live Actuality with `/to-tasks`.

> **Citation anchors.** pre=`07edccc57b8f75613ad1d09203a3e414d867b90c` post=`07edccc57b8f75613ad1d09203a3e414d867b90c`.

## Outcome

The draft skills-wiki article for `diagnosing-bugs`, a comparison with Matt Pocock's `engineering/diagnosing-bugs`, and the skill source all describe one behavior. This Spec owns the article, the comparison, the findings log and, only where the findings justify it, a source change to the skill in its own lane. The skill stays in Pending unless the findings justify another disposition.

## Why It Matters

The owner wants the existing skills prototyped in the draft wiki so connection problems surface: skills that should link and do not, and skills that link and do not work together. `diagnosing-bugs` hands off to `/improve-codebase-architecture`, reads `CONTEXT.md` and ADRs, and expects a `tdd`-style regression test; each of those is a connection the article's "What it needs" section must resolve or record as a finding.

## Current Verified State

- The source is `skills-pending/diagnosing-bugs/SKILL.md` plus one supporting file, `skills-pending/diagnosing-bugs/scripts/hitl-loop.template.sh`. It is Pending, outside discovery, and not in the core bundle (`workbench/skills/README.md`, "Retired and preserved source").
- Provenance: pending sources entered in `6943c106acb8de56d55599ece4fcf29a59da4f41`; `THIRD_PARTY_NOTICES.md` covers upstream-derived files. `workbench/skills/README.md` lists the directory in the optional-source inventory with "owner decision required" on retention and a Referenced-skills row saying `diagnosing-bugs` is out of scope and unreferenced by any root control or lane skill. Whether the source is an unmodified copy of Matt's has not been byte-diffed; step 1 checks.
- The source describes six phases: build a feedback loop (the stated core of the skill), reproduce and minimise, hypothesise (3-5 ranked, falsifiable), instrument (one variable at a time, tagged `[DEBUG-xxxx]` logs), fix with a regression test only if a correct seam exists, then cleanup and post-mortem.
- Its stated boundary is "enter repair only when authorized" in the catalog description. The body itself does not mention authorization: Phase 5 applies a fix and Phase 6 writes a commit/PR message. Whether the body matches the description is a finding to settle in step 1, not assumed here.
- References that do not resolve at the pre anchor: `CONTEXT.md` does not exist in this repository (the shared-terms owner is `LEXICON.md`); ADRs live under `workbench/docs/adr/`; `/improve-codebase-architecture` is a Pending skill, not discoverable. `scripts/hitl-loop.template.sh` exists beside the source. These are candidates for `stale-name` and `dangling` findings.
- No Wiki article exists for it (`workbench/wiki/skill-*.md` covers 19 core skills plus `domain-modeling`). Whether any test exercises Pending skills beyond the catalog's optional-root inventory (`tools/test-skill-catalog.mjs`) is for step 1.

## Desired Behavior

1. A draft article for `diagnosing-bugs` follows Template 2, owned by S-002L, with its "What it needs" and "What it reads and writes" sections each resolved to something real or logged as a finding.
2. The article states how the skill's "enter repair only when authorized" boundary maps onto `AGENTS.md` instruction authority: Phases 1-4 are read, run and instrument work that the current user request and assigned Spec already cover; any code fix (Phase 5) rests on the current user request or an assigned Spec/Task, never on the skill text itself. The skill grants no authority (`AGENTS.md`, Authority Order).
3. The comparison with Matt's counterpart records a verdict (same, close, divergent or missing) and behavior and clarity differences.
4. If a source change is justified, the skill in its lane matches the article. If not, the article records that Pending is the right state.

## Decisions And Contracts

- Group: upkeep. Matt counterpart: `engineering/diagnosing-bugs`. Enabling Spec: S-002L. Upstream pin for every comparison: `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60`.
- Steps 1-5 touch only the draft wiki. Step 6 is the only step that touches a skill lane.
- `skills-pending/` is not in `AGENTS.md` Edit Scope (Edit Scope names `workbench/skills` but not that root directory). S-00R is the authorizing route for any step 6 change there: it owns the optional-source disposition and requires a per-item owner decision for relocation. Step 6 may not edit `skills-pending/diagnosing-bugs/` until that route authorizes it for this item.
- The article is curated context, not instruction authority or proof of behavior (`AGENTS.md`, Instruction Authority). Matt's site and files are outside evidence, not Workbench Canon; summarize and cite, do not reproduce.
- Disposition (stay Pending, promote to Core, or retire) is not decided here. The owner's 2026-09-30 decision adopts every Matt skill except `grill-with-docs` and defaults other adopted skills to Pending; this Spec records evidence, and a promotion needs its own owner decision and the Core-bundle mechanics.

## Non-Goals

- Moving, archiving, installing or deleting the skill; editing the manifest, `workbench/wiki/SCHEMA.md`, the skills README catalog or the Lexicon's Core skill bundle row before step 6 and S-00R allow it.
- Rebuilding `tdd`, `improve-codebase-architecture` or `codebase-design`; each has its own Spec. This Spec records the connection to them as findings.
- Answering Q2A (where `wayfinder` stores provisional decisions); it belongs to the `wayfinder` Spec.
- Adopting `grill-with-docs`, or treating a passing catalog test as proof of agent behavior.

## Dependencies And Blockers

- **S-002L Skills draft wiki collection** must deliver the draft-wiki location and article template before steps 2-5. Because no Task exists yet, `spec-workbench.mjs next` may not enforce this block; the Director records whether it does.
- Step 6 on `skills-pending/` is gated on S-00R authorization and its per-item owner decision (S-00R has a live Codex lane at the time of authoring; do not edit S-00R from here).
- Related, not blocking: the Specs for `tdd`, `improve-codebase-architecture` and `codebase-design`, which this skill names or implies.
- Open questions for step 1: is the source byte-identical to Matt's at the pin or at its import; does the body authorize repair or only diagnose; what replaces `CONTEXT.md` here (`LEXICON.md`) and does Matt's current version still use that name.

## Vertical Implementation Slices

No Task is cut. Tasks are cut from live Actuality with `/to-tasks` when this Spec is activated. The intended slice direction, in order:

1. Investigate ours: read `skills-pending/diagnosing-bugs/SKILL.md` and the HITL script at a named commit, find any test or consumer, and record inputs, outputs, writes and composition (the `CONTEXT.md`, ADR, `/improve-codebase-architecture` and `tdd`-like references), plus the true `origin` and whether the source differs from Matt's copy.
2. Draft the article from Template 2 (owned by S-002L) at `workbench/wiki/skills-draft/upkeep/diagnosing-bugs.md`, tentative until S-002L decides, including the authority mapping above.
3. Investigate Matt's skill: read `engineering/diagnosing-bugs` at `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60`.
4. Compare: fill "Compared with Matt's" with a verdict and log findings as `F:diagnosing-bugs:NN` lines.
5. Align the article until its wording matches real or intended behavior; log what remains.
6. Fix or create the skill: edit `SKILL.md` in its lane only if findings justify it, with catalog tests and a fresh-context scenario, under the S-00R route above.

## Acceptance Criteria

- [ ] The draft article exists at the S-002L location with every Template 2 section filled and the provenance naming the upstream pin and `origin`.
- [ ] Every "needs" and "reads/writes" item resolves to something real or is logged as a finding (at least the `CONTEXT.md`, ADR and `/improve-codebase-architecture` references).
- [ ] The article states how "enter repair only when authorized" maps to `AGENTS.md` authority, and the source either agrees or a finding records the gap.
- [ ] The Matt comparison verdict is recorded with differences, read at the pin.
- [ ] The skill source matches the article, or the article records that no change was justified and the skill stays Pending; any change to `skills-pending/` names S-00R as its authorizing route.
- [ ] Targeted catalog tests, Wiki validation and the required full suite are green for step 6; no unrun check is reported as passing.

## Testing Seams

Steps 1-5 are documentation; the seam is the Wiki validator and the draft collection's own checks from S-002L. For step 6, use the nearest source/test seam, `tools/test-skill-catalog.mjs` for the optional-source inventory and any new check S-00R requires, plus a fresh-context scenario: given a failing behavior, the agent builds and runs a red-capable command before proposing a cause, and does not edit code without authorization. Structural checks prove routing, not agent behavior.

## Verification Procedure

For step 6, run targeted tests for the changed source and `node workbench/tools/wiki.mjs validate`, then the current full suite in `AGENTS.md`, `render` and `doctor`, the self-drift receipts and a bounded semantic check. Review the immutable candidate separately before integration. Record actual commands and results in this Spec.

## Documentation Impact

The draft article at `workbench/wiki/skills-draft/upkeep/diagnosing-bugs.md` (tentative until S-002L decides). Step 6 may touch `workbench/skills/README.md` (optional-source inventory and Referenced-skills rows) and the skill's own source; if it promotes the skill, the Lexicon's Core skill bundle row, `workbench/manifest.json` and catalog tests become involved and need their own owner decision. Record `Docs checked; no update needed` with a reason where nothing changes.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-30 | planning | Spec authored from the owner's draft-skills-wiki direction; planning only, no implementation evidence | Source, supporting script, README inventory and absence of `CONTEXT.md` read at the pre anchor; Matt's file not read | This Spec authored; no article or skill source written | S-002L, activation, Tasks and all six steps remain open |

## Completion Result

Not complete.

## Supersession

None.

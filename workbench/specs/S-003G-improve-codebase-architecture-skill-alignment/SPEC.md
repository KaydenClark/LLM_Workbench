# S-003G - improve-codebase-architecture skill alignment

**Spec ID:** S-003G
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-30
**Catalog description:** Identify and prioritize structural improvements that make future changes safer and more local.
**Blockers:** S-002L Skills draft wiki collection must deliver the draft-wiki location and article template before steps 2-5.
**Latest event:** Authored from the owner's 2026-09-30 draft-skills-wiki direction.
**Next gate:** Deliver S-002L, then activate this Spec and cut Tasks from live Actuality with `/to-tasks`.

> **Citation anchors.** pre=`07edccc57b8f75613ad1d09203a3e414d867b90c` post=`07edccc57b8f75613ad1d09203a3e414d867b90c`.

## Outcome

One draft Wiki article, one recorded comparison with Matt Pocock's counterpart skill, and the `improve-codebase-architecture` skill source all describe the same behavior: scan a codebase for structural friction, present ranked deepening candidates as a visual report, and let the user pick one to work through in a design conversation. Group: upkeep. Source today: pending. Owner decision 4 (2026-09-30) adopts this skill; it stays Pending unless step 1 to step 5 findings justify another disposition.

## Why It Matters

The owner wants to prototype the skills Wiki against the current skills to find skills that should connect and do not, and skills that connect and do not work together. This skill is a likely source of both. It names `/codebase-design`, `/grilling` and `/domain-modeling`, reads a `CONTEXT.md` and `docs/adr/`, and writes to the domain model mid-conversation, while the Workbench keeps terms in `LEXICON.md`, decisions in `workbench/docs/adr/`, and holds that an interview writes no Canon (S-00W). Whether those references resolve in a Workbench room is unverified, so the article is the cheapest place to find out.

## Current Verified State

- `skills-pending/improve-codebase-architecture/SKILL.md` (66 lines) and `HTML-REPORT.md` (123 lines) are the only files. The skill is `disable-model-invocation: true`. It has no tests of its own.
- `skills-pending/` is a root directory `AGENTS.md` Edit Scope does not list; `workbench/specs/S-00R-core-skill-lifecycle-and-optional-source-disposition/SPEC.md` is the accepted route for per-item pending dispositions. Step 6 edits `skills-pending/` only under that route, or after the owner decides otherwise.
- `workbench/skills/README.md` lists it as preserved pending source, consumed by pending `diagnosing-bugs`, with disposition "owner decision required". `tools/test-skill-catalog.mjs` treats `skills-pending` as an optional root, so the catalog tests constrain it.
- It enters from `skills-pending/diagnosing-bugs/SKILL.md`, which hands off to it after a fix. Its own declared dependencies are `/codebase-design` (pending), `/grilling` (core), `/domain-modeling` (pending; S-002H owns the planned rebuild).
- Its stated flow: read the domain glossary and ADRs; explore with an `Explore` subagent; apply the deletion test; write a self-contained HTML report to the OS temp directory using Tailwind and Mermaid from CDNs; stop and ask which candidate to explore; then run `/grilling`, updating the domain model and offering ADRs inline.
- Appears to be an unmodified copy of Matt's skill per `THIRD_PARTY_NOTICES.md`; not byte-diffed. Step 3 verifies.
- Unverified, for step 1: whether a Workbench room has a `CONTEXT.md` at all; whether the report's CDN dependencies suit an offline or restricted environment; whether the personal `~/.agents/skills` install carries a differing copy.

## Desired Behavior

1. The skill scans a codebase and presents ranked deepening candidates, each with files, problem, solution, benefits, before/after and a recommendation strength, without proposing interfaces yet.
2. Its vocabulary, domain-language lookup and decision-record lookup resolve to real Workbench owners (`LEXICON.md`, `workbench/docs/adr/`) or the gap is recorded as a finding.
3. Its mid-conversation updates to the domain model respect the Workbench rule that an interview answer is not Canon authority; any divergence is surfaced for the owner, not resolved here.
4. The draft article, the Matt comparison and the skill source agree on this behavior, and the verdict (same, close, divergent or missing) is recorded.

## Decisions And Contracts

- Steps 1-5 touch only the draft wiki; step 6 is the only step that touches a skill lane.
- Matt's counterpart is `engineering/improve-codebase-architecture` at `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60`. His files are outside evidence, not Workbench Canon; summarize and cite, do not reproduce.
- The article is curated context, not instruction authority or proof of behavior. Current source and tests establish Actuality.
- This Spec records, and does not decide, the retention, promotion or relocation of the pending source, and anything that changes the Core bundle.
- Expected `overlap` finding with `codebase-design` (S-003M): the skill delegates its architecture vocabulary to it. Record the boundary as a finding; do not rewrite `codebase-design` here.

## Non-Goals

- Writing or editing the `codebase-design`, `domain-modeling`, `grilling`, `diagnosing-bugs` or `design-an-interface` articles or sources.
- Moving, archiving, installing or promoting any skill; changing the Core bundle assertions.
- Answering Q2A (where `wayfinder` stores pre-Spec decisions); adopting `grill-with-docs`.
- Treating a passing suite or an article as owner Human QA.

## Dependencies And Blockers

- **S-002L Skills draft wiki collection must deliver the draft-wiki location and article template before steps 2-5.** Do not assume `next` enforces this, as no Task exists yet.
- Step 6 needs the S-00R route, or an owner decision, to edit `skills-pending/`.
- Boundary dependencies for findings only: S-003M (`codebase-design`), S-002H (`domain-modeling`), S-00X (`grilling`). No ordering is required on them.

## Vertical Implementation Slices

No Task is cut yet; Tasks are cut from live Actuality at activation with `/to-tasks`. The intended slice direction, one skill wide:

1. **Investigate ours.** Read `SKILL.md`, `HTML-REPORT.md` and any tests at a named commit. Record inputs, outputs, every file it writes (the temp HTML report; `CONTEXT.md`; ADRs) and its composition. Record the true `origin` (matt, workbench).
2. **Draft the article.** Fill Template 2 (owned by S-002L) at the tentative location `workbench/wiki/skills-draft/upkeep/improve-codebase-architecture.md` (tentative until S-002L decides), from step 1.
3. **Investigate Matt's.** Read his `engineering/improve-codebase-architecture` at the pin above, and byte-diff it against ours.
4. **Compare.** Fill "Compared with Matt's" with a verdict, and log findings (`dangling`, `stale-name`, `overlap`, `gap`, `conflict`, `missing-skill`) one per line. Expect candidates: `CONTEXT.md` versus `LEXICON.md`, `docs/adr/` versus `workbench/docs/adr/`, the inline domain-model write versus S-00W, the pending status of `/codebase-design`, and the CDN-based report.
5. **Align the article.** Rewrite until the wording matches real or intended behavior; log what is left.
6. **Fix or create the skill.** Edit `SKILL.md` in its lane, only for a supported gap, with catalog tests and a fresh-context scenario. If findings justify no source change, record that.

## Acceptance Criteria

- [ ] The draft article exists with every Template 2 section filled and the front matter naming group `upkeep`, source `pending`, origin and the pin.
- [ ] Every "needs" and "reads/writes" item resolves to something real or is recorded as a finding.
- [ ] "Compared with Matt's" records the counterpart at the pin and a verdict; findings are one per line.
- [ ] The skill source matches the aligned article, or the remaining difference is logged as a finding with its owner.
- [ ] The named fresh-context scenario passes: given a codebase, the skill produces ranked candidates and stops before proposing interfaces.
- [ ] Suites green for step 6, the required full suite is recorded at its gate, and no unrun check is reported as passing.

## Testing Seams

Steps 1-5 have no executable seam: check by reading the article against source. For step 6, use the skill catalog and inspection tests and a fresh-context scenario run against a small fixture codebase. A human review may still be needed for conversational fidelity.

## Verification Procedure

Run `node workbench/tools/wiki.mjs validate` once the collection exists, targeted catalog and inspection tests for any changed skill, then the full suite in `AGENTS.md`, `render` and `doctor`. Review the immutable candidate separately before integration.

## Documentation Impact

The draft article, tentatively `workbench/wiki/skills-draft/upkeep/improve-codebase-architecture.md`, and nothing else in steps 1-5. Step 6 may touch `skills-pending/improve-codebase-architecture/SKILL.md`, `skills-pending/improve-codebase-architecture/HTML-REPORT.md` and its `workbench/skills/README.md` optional-source row. Record `Docs checked; no update needed` for other controls.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-30 | planning | Spec authored from the owner's draft-skills-wiki direction; planning only | Pending source, README row and catalog optional-root handling read at the pre anchor; no Matt file read, no behavior run | This Spec only | Tasks, draft article, Matt comparison and any source change remain open |

## Completion Result

Not complete.

## Supersession

None.

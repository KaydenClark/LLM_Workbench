# TK-005E - A skill the index points to binds for its operation and an unpointed skill teaches

**Task ID:** TK-005E
**Spec ID:** S-004C
**Slice:** A skill the index points to binds for its operation and an unpointed skill teaches
**Status:** done
**Stance:** Builder
**Blockers:** TK-005D
**Destination:** spec-acceptance: The Instruction Authority list states that a pointed lane skill binds for its operation and the lane copy wins, and a skill no carrier points to teaches and does not instruct, with a room-added skill shown not to bind.
**Planned verification:** Red: fixture-room cases fail because nothing resolves which lane skills the Runbook index points to: a skill the index points to is not reported as binding, a room-added skill the index does not point to is not reported as teaching only, a drifted installed copy is not shown to lose to the lane copy, a pointer to a skill missing from the lane is not reported, and `AGENTS.md` Instruction Authority does not say any of it. Green: the resolver reports pointed and unpointed lane skills from the index alone; the lane copy is the only one read; a dangling pointer is reported by name; the Instruction Authority text says a pointed lane skill binds only for the operation being performed, that authority never comes from a link a Destination Packet or any other work record carries, and that an unpointed skill teaches. `tools/test-governance-core.mjs`, `tools/test-control-fidelity.mjs`, `tools/test-genesis-from-decisions.mjs` (both read the Instruction Authority text), `tools/test-diagnostics.mjs` (if a finding code is registered), `tools/test-skills-lane.mjs`, `tools/test-skill-catalog.mjs`, the landing check and the full AGENTS suite pass on the committed candidate.
**Proof:** Instruction Authority item 5 in root and template AGENTS.md from ADR-000W; resolveSkillPointers in skill-inspection.mjs reports binding, teaching and dangling lane skills from the Runbook operations index and lane copy alone, doctor names skill-pointer-dangling (attention, effect none); red d2852509, green 80a9ae66; targeted tests green; landing check ok vs pin d7ffffe9 and merge-base 82f68047; guardrails 106.6/113 and 78/100 held; full AGENTS suite 50/50 at 80a9ae66 dirty []; review-coverage probe recorded in the receipt.

## Outcome

The accepted decision's central claim, authority flows through the pointer,
becomes inspectable. The Instruction Authority list in `AGENTS.md` and
`templates/AGENTS.md` adds the pointed lane skill as a source of instruction
for the operation being performed, with the lane copy winning over a drifted
installed copy, and says an unpointed skill, including a room-added one,
teaches without instructing. The review care for a skill change that now binds
(the accepted decision says the lane's receipt hashes and the integration
review already cover it) is checked rather than assumed: the Task records
whether a changed pointed skill or a changed index row is caught by the
existing receipt hash and review gate, and records any gap by name.

## Scope

- Instruction Authority in `AGENTS.md` and `templates/AGENTS.md`, and the two
  tests that extract the text between `### Instruction Authority` and `###
  State Resolution` (`tools/test-control-fidelity.mjs` and
  `tools/test-genesis-from-decisions.mjs`), which change with the text.
- The smallest runtime seam that resolves pointed and unpointed lane skills
  from the index: extend an existing runtime tool (the doctor and diagnostics
  path, or the skills-lane verify) rather than adding a managed tool; the
  Builder settles the seam at the red step and records why. A finding for a
  dangling pointer is attention with effect none, like the other skills-lane
  findings. Any `diagnostics.mjs` change lands after Decision Record Tooling's
  TK-004X, which the first Task's blocker already covers.
- The Runbook sentence stating that a change to a pointed skill or to an index
  row is reviewed as a Contract change.

## Acceptance

- [ ] Instruction Authority names the pointed lane skill, the operation bound,
      the lane-copy rule and the unpointed-skill rule, and keeps its other
      limits unchanged, with the Lexicon's carrier status as it stands.
- [ ] A fixture proves a room-added unpointed skill does not bind, a drifted
      installed copy loses, and a dangling pointer is named.
- [ ] The review-coverage claim is verified or its gap is recorded.

## Boundaries

No assigned-landmark clause (its own Task waits on LANDMARK.md). No change to
any rule's meaning. No decision on whether the Lexicon is a contract artifact:
the owner deferred it, and line 4 of the list keeps naming it as it does today.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004c-tk005e-pointed-skill-authority | 80a9ae66bc3b29bed8ea8aa04fdbd86d092d9578 | ahead 0 behind 0 | 0 | Red d2852509: test-skill-inspection failed to load (no resolveSkillPointers export), test-diagnostics 2 fail (skill-pointer-dangling unregistered), test-control-fidelity 3 fail and test-genesis-from-decisions fail (no pointed-skill item in Instruction Authority), test-runbook-index 1 fail (no Contract-change review sentence). Green 80a9ae66: skill-inspection 9/9 (pointed skill binding, room-added unpointed skill teaching, drifted installed copy loses to lane copy hash, dangling pointer named as attention/none), diagnostics 36/36, control-fidelity 37/37 (with four authority mutations), genesis-from-decisions pass, runbook-index 12/12 (root index resolves with no dangling pointer), governance-core 12/12, skills-lane 4/4, skill-catalog 3/3; landing check ok vs pin d7ffffe9 (AGENTS 1 removed/1 landed, from TK-005D; RUNBOOK 0) and vs merge-base 82f68047 (0/0); guardrails 106.6/113 and 78/100 held; full AGENTS suite 50/50 at 80a9ae66 dirty []. Review-coverage probe: editing workbench/skills/save/SKILL.md and an index row left the S-004C report digest unchanged (f8c7a176); in an installed fixture room workbench-skills verify reports an edited core skill as skills-receipt-drift modified but an edited room-added skill stays valid; in this source repo verify returns source with no hashes. | AGENTS.md and templates/AGENTS.md Instruction Authority item 5 (pointed lane skill binds for its operation, lane copy wins, unpointed skill teaches, no authority from a work-record link); RUNBOOK.md and templates/RUNBOOK.md index sentence (pointed skill or index row change reviewed as a Contract change) and skill-pointer-dangling documented; workbench/tools/skill-inspection.mjs resolveSkillPointers and finding; workbench/tools/diagnostics.mjs registry. AGENTS.md 38,491 to 39,072 B; template 32,992 to 33,573 B. Wiki checked; no page states the authority list, no update needed. LEXICON.md unchanged. | Review coverage gap (pointed-skill review coverage): no mechanical check catches a changed pointed skill or index row - the report/verdict/gate content digest binds only Spec and Task records, lane receipt hashes cover only core skills in installed rooms (not this source repo, not room-added skills, not RUNBOOK.md), and doctor compares no hashes; only the procedural separate-context review of the candidate diff covers them. Census finding 4 (governance-core canonicalized_in limited to carriers or a Spec) unchanged: no ADR names a skill yet. Census finding 5 (task packet carries only AGENTS.md) unchanged: out of this Task's scope; the packet's AGENTS.md names the index read at entry. Current index rows point to Runbook sections, so no lane skill binds yet. | 80d56a6884426e281af767e8c96b6483abfd3beee512b59e16eb166855a88759 |
| 2 | claude/s004c-tk005e-pointed-skill-authority | 18db994dbdf67aa1a655f8460174b0e8b4324367 | ahead 0 behind 0 | 0 | Instruction Authority item 5 in root and template AGENTS.md from ADR-000W; resolveSkillPointers in skill-inspection.mjs reports binding, teaching and dangling lane skills from the Runbook operations index and lane copy alone, doctor names skill-pointer-dangling (attention, effect none); red d2852509, green 80a9ae66; targeted tests green; landing check ok vs pin d7ffffe9 and merge-base 82f68047; guardrails 106.6/113 and 78/100 held; full AGENTS suite 50/50 at 80a9ae66 dirty []; review-coverage probe recorded in the receipt. | AGENTS.md, templates/AGENTS.md (Instruction Authority item 5); RUNBOOK.md, templates/RUNBOOK.md (index Contract-change review sentence, skill-pointer-dangling); skill-inspection.mjs, diagnostics.mjs; tests test-skill-inspection, test-diagnostics, test-control-fidelity, test-genesis-from-decisions, test-runbook-index. Wiki checked; no update needed: no page states the authority list. LEXICON.md unchanged. | Pointed-skill review coverage gap: the review content digest binds only Spec and Task records and lane receipt hashes cover only core skills in installed rooms, so a changed pointed skill or index row is caught only by the procedural candidate review; census findings 4 and 5 unchanged and reported; no current index row points to a lane skill. | e0dfdc68b9ba0a2aec580f094927eaa7bad68a964564b02d53130f75dc33c8f0 |

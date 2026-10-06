# TK-005N - Make the Lexicon and the orientation text say what the carriers now are

**Task ID:** TK-005N
**Spec ID:** S-004C
**Slice:** Make the Lexicon and the orientation text say what the carriers now are
**Status:** in-progress
**Stance:** Builder
**Blockers:** TK-005K
**Destination:** spec-acceptance: The Lexicon says what terms mean and where each kind of information belongs (Desired Behavior items 1 to 3), and the Documentation Impact of this Spec (Lexicon rows, Context Map routes, README setup text, routed Wiki articles) is applied once the carriers have their new shape.
**Planned verification:** Red: `tools/test-control-fidelity.mjs` or `tools/test-controls-vocabulary-sweep.mjs` gains a check that fails while the root Lexicon still says the carriers' rewrite is "not yet specified", still describes the accepted destination as a future shape, or the Context Map still routes "Operations and procedures" to Runbook sections whose bodies moved, and while `templates/LEXICON.md` and the README setup text name the old shape. Green: those checks pass, the Lexicon's carrier-definition and Context Map rows and `templates/LEXICON.md` agree with the delivered shape and name the Runbook index as the route to an operation, the README setup text agrees, the Wiki lint of touched pages is clean, and `tools/test-governance-core.mjs`, `node tools/evaluate-workbench.mjs --path templates --include-controls` (score held) and the full AGENTS suite pass on the committed candidate.

## Outcome

After the carriers have changed, the Lexicon and the orientation text stop
describing the shape as future. Where `AGENTS.md` says independent review is
required before integration, the Runbook index points to the procedure that
prepares, records and checks it, and the Lexicon says what counts as independent
review and links to both (the example the accepted decision gave).

The Lexicon has one writer at a time and its rows are also edited by the owner's
Codex reconciliation branch, the dictionary Terms Spec and the Workbench terms
and verbs Spec (which retires "root controls" as a stale term and adds the
contract-artifact, routing-artifact and control rows). The blocker is an `owner:`
token for the Lexicon writer's turn, cleared when those edits are contained in
integration or the owner releases the files; it is not a decision of this Task.
This Task edits only the carrier-definition and routing rows and the Context Map;
it adds no term another Spec owns, and it does not decide whether the Lexicon is
itself a contract artifact (the owner deferred that: "we can debate lexicon
later").

## Scope

- `LEXICON.md` and `templates/LEXICON.md` carrier-definition, skill-pointer and
  Context Map rows, including the one sentence per role the role-detail Task
  leaves to the Lexicon; the README setup text if it names the old shape; the
  routed Wiki articles for the operations whose procedures moved; the
  `workbench/wiki/MEMORY.md` router only if a route changed (single writer).
- The `AGENTS.md` ownership-table row for the decision-record collection that
  Decision Record Tooling's last Task deliberately left to this Spec, if the
  verification family has not already classified that table as restating the
  Lexicon.

## Acceptance

- [ ] No current-facing Lexicon or README line presents the carriers' shape as
      future or names the old long shape.
- [ ] The Context Map routes an operation through the Runbook index to its
      skill, and the review-independence example is reachable through all three.
- [ ] Root and template Lexicons agree; no term another Spec owns is added.

## Boundaries

No edit while another candidate holds the Lexicon. No decision on the Lexicon's
own contract-artifact status. The accepted decision record stays history.

## Narrowed, 2026-10-05

The owner decided the Lexicon retires ([the decision](../../../../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md)); its retirement is owned by [Lexicon Retirement And ARCHITECTURE.md](../../../S-004O-lexicon-retirement-and-architecture-md/SPEC.md). This Task edits only the carrier-definition, pointer and routing rows and the orientation text, so the Lexicon reads true until it retires, and does not start the retirement.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004c-tk005n-lexicon | 2cbe49763de5d44a1000d5bc04fa6077d7bbb79e | ahead 0 behind 0 | 0 | Red at a48eb272: test-control-fidelity TK-005N test failed (root Lexicon still presented the carrier shape as future: 'their rewrite is planned'). Green at 2cbe4976: test-control-fidelity 39/39 (neither Lexicon presents the carrier shape as future; both name the entry route through the Runbook operations index; their Context Map routes operations and recovery through the index; Root files and Skill rows state the delivered shape; both Review rows link AGENTS.md#git-rules, RUNBOOK.md#operations-index and the code-review independent-review section; README names the index entry route); test-governance-core, test-adr, test-wiki, test-controls-vocabulary-sweep, test-evaluate-workbench, test-genesis-from-decisions, test-skills-lane, test-runbook-index, test-workbench-round-trip exit 0; landing check ok vs pin d7ffffe9 (RUNBOOK 1817/1817, AGENTS 287/287, one AGENTS entry's landed text follows the re-routed Lexicon Procedures row); full suite 51/51 at 2cbe4976 (dirty []); evaluate-workbench templates 106.6/113 and root 113/113 held; guardrails 78/100 held; wiki validate ok; self-drift post on branch 7 attention findings (stale-claim S-00Q, five stale-seed, unverified-provenance), none about this Task. | LEXICON.md and templates/LEXICON.md: entry route, Context Map operations and recovery rows, ownership schema Procedures, Capability, Recovery (and root Evaluation) routes, Root files, Skill and host adapter, Workbench Contract, Confirm and Review rows, and root Contract artifact, Routing artifact and Progressive disclosure rows; README.md entry route, templates/RUNBOOK.md description and evaluation pointers; Wiki features/assigned-work-portable-stances-and-delivery-boundaries and features/spec-centered-progressive-disclosure (moved there by S-003W); S-004C inventory-agents.json entry 432. AGENTS.md ownership-table row: Docs checked; no update needed, TK-005I already classified that table as restating the Lexicon Artifact Ownership Schema, which carries the decision-record route. | The one sentence per role the role-detail Task leaves to the Lexicon waits on TK-005L; the Captain, Director and Worker rows still say the Contract rewrite and role skills have not landed, which stays true until TK-005L; the Lexicon's own contract-artifact status is left to the owner's later debate. | 09432002cd972254d1a68411aa234f85bbfb651d3a14144dd44a29eea7244e20 |
| 2 | claude/s004c-tk005n-lexicon | 3cd8b0016f495b8d901f1bb400f88f6e600295f8 | ahead 0 behind 0 | 0 | Full suite 51/51 at 2cbe4976 (dirty []); red a48eb272, green test-control-fidelity 39/39 (Lexicons and README describe the delivered shape and route operations through the Runbook index; review-independence example reachable through all three carriers); landing check ok vs pin d7ffffe9; evaluator 106.6/113 and 113/113, guardrails 78/100 held | Both Lexicons (entry route, Context Map, ownership schema routes, Root files, Skill, Workbench Contract, Confirm, Review, Contract and routing artifact, progressive disclosure rows), README, two Wiki feature articles, AGENTS inventory entry 432; AGENTS ownership-table row checked, already restates the Lexicon (TK-005I) | Role sentences wait on TK-005L; Lexicon contract status left to the owner | 4f9de20df95bd9ec7c90318fb352b1910cd8b49923db169c1a98527f0351edc8 |

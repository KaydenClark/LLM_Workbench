# TK-005N - Make the Lexicon and the orientation text say what the carriers now are

**Task ID:** TK-005N
**Spec ID:** S-004C
**Slice:** Make the Lexicon and the orientation text say what the carriers now are
**Status:** blocked
**Stance:** Builder
**Blockers:** TK-005K, owner:lexicon-writer-turn-released
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

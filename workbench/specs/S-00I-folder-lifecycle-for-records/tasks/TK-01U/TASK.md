# TK-01U - Capture a completed Spec as a discoverable features article that retirement accepts

**Task ID:** TK-01U
**Spec ID:** S-00I
**Slice:** Capture a completed Spec as a discoverable features article that retirement accepts
**Status:** deferred
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: S-00I closed-Spec durable reconciliation and retirement, extended by step T4 (features capture) and the T5/T6 capture preconditions of the S-00J closure-capture transition contract
**Planned verification:** Red: in a disposable room a manifest declaring `features` fails `collectionRelative` and `validateManifest`; `validateWiki` rejects `type: feature` and `normalizeWiki` infers `meta` for it; `retireSpec` refuses a valid feature owner at its design-concept/guidebook allowlist; `discard --task` removes a retired Task whose parent Spec has no captured features article. Green: the collection resolves and is created additively while the current seven-lane room still validates; a feature article validates and a malformed or misplaced one is refused; `retireSpec` accepts a routed feature owner on a `complete` Spec and refuses every missing gate by name with the fixture tree and index unchanged; `discard --task` refuses before capture; doctor names a contract-completed Spec that has no captured article.

## Release

Lane H releases this Task by setting Status `ready` once S-00J TK-01S is done
on integration. It is `deferred` with no Blockers line entry because the
runtime cannot resolve a cross-Spec Task blocker, and the `S-00J:delivered`
token does not exist until S-00J TK-01T lands. Until then nothing here may be
claimed. Lane H also serializes this Task's `workbench/tools/spec-workbench.mjs`
and `tools/test-spec-workbench.mjs` lane behind S-00J TK-01S and TK-01T, which
write the same files.

## Outcome

In one disposable Git room, discover the additive `features` collection,
validate a readable feature article, and exercise the public retirement
eligibility seam with named no-write refusals and a valid-owner success. The
collection declaration, schema and type, Wiki route, generic template and
retirement owner contract agree. This is one vertical capability slice, not
separate collection, schema and runtime Tasks.

Capture means readable supported knowledge: what the delivered capability
does, why it matters, its limits and its named evidence. It is not a pasted
Spec, a completed Task proxy or an additional publishing approval. No capture
command or automated prose-writing API is proposed; use existing delivery
authoring and the public lifecycle seams unless implementation proves a
narrowly necessary extension.

[TK-01V](../TK-01V/TASK.md) owns the composed T0 to T6 continuous
demonstration. This Task supplies the collection, schema and eligibility
capability it consumes and does not duplicate that end-to-end proof.

## Dispositions Lane H Made

- **Contract consumed.** This Task consumes the S-00J
  [closure-capture transition contract](../../../S-00J-spec-qa-gate-at-integration/SPEC.md)
  (section "Closure-capture transition contract - 2026-09-26"). Capture is
  step T4: it requires T3 `complete` and is not a precondition of `complete`.
  It precedes retirement (T5) and discard (T6). A failed or missing capture
  leaves the Spec `complete` and uncaptured, visible, and never reverts
  `complete`. Do not duplicate approval or main-verification logic in the
  feature owner check; consume `complete` as T3's result.
- **Task records wait for capture.** Task records, live or retired, including
  missed attempts, are never discarded before T4 capture. The owner's answer
  (separate-context-review grilling decision 009) is that the TASK.md is the
  record until the Spec is cleaned up into the feature Wiki. Moving a done
  Task into `tasks/retired/` stays allowed (WF-8D); only discard waits. At
  integration `d16ef63`, `discardRetiredTask` checks the retired folder, a
  clean tree, main containment and a reference scan, but never the parent
  Spec's capture, so this Task adds that refusal.
- **Single writer for the features collection.** This Task is the single
  writer for the `features` Wiki collection declaration, its schema and type,
  and its manifest and path consumers. S-01T (Landmark Tracker, Lane J)
  consumes them and does not write them concurrently. Feature articles keep
  the Spec-ID-bearing retirement `source_paths` provenance `retireSpec` and
  discard already use. S-01T's identifier-free Landmark articles are a
  different article type and do not change that contract.
- **Root and template controls stay out of the lane.** `AGENTS.md`,
  `RUNBOOK.md`, `LEXICON.md`, `BLUEPRINT.md` and the `templates/` root
  controls belong to S-00P. Needed wording is listed under Remaining Gaps.
  The `templates/wiki/*` mirrors stay in the lane because the generic template
  is otherwise inconsistent: at `d16ef63`, `workbench-layout.mjs` seeds every
  `wikiContractFiles` entry into a new room from `templates/wiki/`, and
  `tools/control-fidelity.mjs` compares each room Wiki contract file and
  `MEMORY.md` against its `templates/wiki/` source.

## Required Behavior

- `workbench-paths.mjs` resolves a manifest-declared `features` collection,
  proposed at `workbench/wiki/features`, without adding an eighth lane.
- `workbench-layout.mjs` accepts the additive declaration and creates or
  seeds the collection while preserving every exact pre-feature collection
  shape, including the current seven-lane room. Its strict object-equality
  manifest check rejects a features declaration today; merely replacing the
  allowed shape must fail the compatibility test.
- `workbench/manifest.json` declares the collection only after the resolver
  and layout consumers exist.
- `wiki.mjs` accepts and validates `type: feature` in the features collection
  and normalizes a missing type there to `feature`. Privacy, copied-task-state,
  knowledge-role and existing collection rules are unchanged.
- `retireSpec` admits a validated feature durable owner beside the legacy
  design-concept and guidebook owners, which keep working. Invalid type, role
  or path, a missing article, a missing `MEMORY.md` route, copied state and
  an absent required gate each refuse by name before any write.
- `discardRetiredTask` refuses while the parent Spec has no captured features
  article, using the same owner predicate retirement uses.
- doctor reports, as an attention finding that does not block selection, a
  Spec completed under the contract (its completion evidence row records the
  T2 main ref and SHA TK-01S writes) that has no captured features article.
  Specs completed before the contract are not reported.

## Smallest Concrete Path Set

Runtime and acceptance checks are released together as one slice.

| Path | Minimum necessary change |
|---|---|
| `workbench/tools/workbench-paths.mjs` | Resolve the manifest-declared `features` collection without an eighth lane. |
| `workbench/tools/workbench-layout.mjs` | Additive collection creation and seed discovery; preserve exact pre-feature collection shapes. |
| `workbench/manifest.json` | Declare the collection after its consumers exist. |
| `workbench/tools/wiki.mjs` | Validate and normalize the feature type and collection. |
| `workbench/tools/spec-workbench.mjs` | Admit feature owners at retirement; refuse Task discard before capture. Legacy owners stay. |
| `workbench/tools/diagnostics.mjs` | Register the uncaptured-complete attention finding. |
| `tools/test-workbench-layout.mjs`, `tools/test-wiki.mjs`, `tools/test-spec-workbench.mjs`, `tools/test-diagnostics.mjs` | Red/green at the existing seams; existing repair cases remain. |
| `workbench/wiki/SCHEMA.md`, `workbench/wiki/MEMORY.md`, `workbench/wiki/features/README.md` (new) | Define the feature job and type and route the collection from the single existing router; no index and no real feature migration. |
| `templates/wiki/SCHEMA.md`, `templates/wiki/MEMORY.project.md`, `templates/wiki/MEMORY.root.md`, `templates/wiki/features/README.md` (new) | Generic copy-ready mirrors keeping bracketed project tokens. |

If `features/README.md` joins `wikiContractFiles`, the duplicate list in
`tools/control-fidelity.mjs` and its test is a traced consumer and may be
updated; add any other path only after tracing a demonstrated dependency, not
as a broad rewrite. `tools/check-append-only.py` and the existing diagnostics
keep their expected behavior; their tests are checks, not edit targets. No
WBID allocation or identity refactor belongs to this slice.

## Expected Red And Green

These are source-grounded predicted failures at `d16ef63`, not observed test
results.

1. **Discovery.** Red: a disposable room with the additive declaration cannot
   resolve `collectionRelative(root, 'features')` and `validateManifest`
   rejects the collection shape; a current-layout compatibility test is
   included. Green: a new room resolves and creates `features`, and preserved
   old rooms still validate and upgrade additively.
2. **Wiki.** Red: `validateWiki` reports `type: feature` invalid and
   `normalizeWiki` infers `meta` for a missing-type note in the collection.
   Green: a valid feature article is accepted and inferred; misplaced or
   malformed feature notes are refused; design-concept and guidebook
   validation are unchanged. Copied evidence, live state and invalid paths are
   refused with no mutation.
3. **Eligibility.** Red: `retireSpec` refuses a valid feature owner at its
   allowlist. Green: in an otherwise eligible fixture on a `complete` Spec the
   feature owner passes with valid metadata and routing. Invalid type, role or
   path, missing article, missing route, copied state and an absent required
   gate refuse by name; snapshot the fixture tree and index for each refusal.
4. **Task discard waits.** Red: `discard --task` removes a retired Task of an
   uncaptured Spec once its retiring commit is on the fixture main. Green: it
   refuses by name, writing nothing, until the parent's features article is
   captured.
5. **Visibility.** Red: doctor is silent for a fixture Spec completed with a
   T2 completion row and no features article. Green: it reports the attention
   finding, stays silent for a pre-contract complete Spec, and the Spec
   remains `complete`.
6. **Focused success.** Invoke the public `retireSpec` with a validated feature
   owner; its receipt names the owner and historical route, and the feature
   note and router still validate. Legacy success cases stay valid. No whole
   review-to-main or discard scenario is this Task's done criterion.
7. **Meaningful article.** A small fixture article explains its tested
   capability, limits and proof without copied delivery state and is checked
   against the fixture's source and test evidence. Schema and eligibility
   tests prove compatibility only.

## Preservation And Fixture Boundary

- S-00I TK-001 to TK-006 completed proofs and the append-only evidence remain
  intact. S-00T repair behavior (current incarnation, whole-directory
  recovery, citation and corrective handling, final-Task fresh clone) and the
  S-00U administrative-digest proof are regression obligations, not new
  repair claims; their existing tests stay unchanged and pass.
- Collection and note creation and retirement refusal and success checks run
  only in disposable test rooms. No real record cleanup, owner approval, main
  promotion, legacy migration, release or other-room update follows. Fixture
  prerequisite gates are set up through the accepted S-00J contract only;
  their full sequencing proof belongs to TK-01V.
- Legacy design-concept and guidebook owner fixtures stay green and `archive`
  is untouched.

## Done Criteria And Closing Proof

- One disposable fixture discovers the collection, validates the feature note
  and exercises public retirement eligibility refusal and success with real
  runtime operations. No production record is used as a test.
- Each refusal leaves prior files and the Git index unchanged.
- Discovery, init and update and the generic mirrors agree with the manifest
  and Wiki schema. Authoring adds no approval ceremony beyond existing gates.
- Run the targeted tests, then every current `AGENTS.md` verification command
  on the committed candidate. Capture the guardrail baseline and after-score,
  read-only S-00K pre/post receipts and the bounded semantic self-drift
  readback, keeping known attention findings visible. Record the immutable
  candidate, red failure text, green commands and results, and an
  under-one-minute focused discovery, validation and eligibility demo.
- The Worker self-checks and reports to the Dispatcher; Dispatcher whole-Spec
  QA and a separate-context review of the assembled candidate follow. Fixture
  approval never approves S-00I or S-01T in the real room.

## Remaining Gaps

- S-00P: `RUNBOOK.md` lifecycle procedure (capture at the closure point after
  `complete`, then retirement, then discard; the features collection and the
  Task-discard-waits rule), `LEXICON.md` terms for a features article and the
  uncaptured-complete state, `AGENTS.md` Documentation Ownership routing for
  feature knowledge, and the matching `templates/` controls.
- S-01T consumes the collection and type; its Landmark article provenance is
  its own contract.

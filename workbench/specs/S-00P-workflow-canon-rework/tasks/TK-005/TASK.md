# TK-005 - Mirror the reworked controls into `templates/`

**Task ID:** TK-005
**Spec ID:** S-00P
**Slice:** Mirror the reworked controls into `templates/`
**Status:** blocked
**Blockers:** TK-003, TK-004
**Destination:** spec-acceptance: S-00P Acceptance Criteria
**Planned verification:** Red: candidate-derived fresh-room guidance fails an observable product-workflow checkpoint or generic-template check; green: the same room delivers its bounded project result through the installed Workbench and the mirrored controls remain generic. Phrase and command-existence checks support behavioral proof.
**Stance:** Builder

## Outcome

A fresh project receives copy-ready controls that describe the delivered
Task-record workflow and can use its installed Workbench to reach a bounded
project destination. Mirror the reconciled TK-002–004 controls without producer
specifics, unavailable commands or altered authority. This packet plans the
existing slice; it neither releases the lane nor proves implementation.

## Entry, Dependencies And Released Paths

Follow AGENTS -> RUNBOOK Ordinary Entry -> LEXICON Task Routing ->
manifest-resolved S-00P -> this Task and its cited seams. Inspect root, branch,
remote, upstream and dirty state; run the existing read-only doctor and show
operations. Preserve unrelated work.

Keep this Task blocked on TK-003 and TK-004. Their inherited S-00I/S-00J gate
and S-00P's current completion prerequisites remain enforced until a supported
repair is adopted. Before execution, Dispatcher supplies the reconciled control
candidate, delivered runtime proof, ADR dispositions and exact shared-path
release. J/I must deliver main verification, features capture and corrected
closure semantics before the mirror describes them as available. An unresolved
ADR acceptance or missing runtime capability remains a gate; return the gap to
Dispatcher rather than accepting it or implementing its mechanism here.

Intended execution edits, subject to that lane release:

- `templates/AGENTS.md`, `templates/RUNBOOK.md`, `templates/LEXICON.md` and
  `templates/README.md`: mirror the corresponding TK-002–004 control changes.
- `templates/BLUEPRINT.md`: preserve the shared eight-heading contract; mirror
  changed generic structure or workflow invariants while keeping the product
  destination placeholders. Do not copy LLM Workbench's product journey.
- `templates/SPEC.md`, `templates/TASKBOARD.md`, `templates/GENESIS.md` and
  `templates/ADOPTION.md`: change only passages whose existing instructions
  contradict the reconciled workflow; record a no-change reason otherwise.
- `tools/test-control-fidelity.mjs`, `tools/test-genesis-from-decisions.mjs`
  and `tools/test-workbench-adoption.mjs`: extend the existing template and
  fresh-room seams for the bounded assertions/demo below.

Read `tools/genesis-from-decisions.mjs`, `tools/workbench-adoption.mjs`,
`workbench/tools/task-record.mjs` and `workbench/tools/spec-workbench.mjs` as
source for actual generation, Task parsing and CLI behavior. These runtime
paths are not this slice's edit lane. No root control, SPEC, ADR, register,
manifest, ID reservation, ledger, Wiki router, catalog or projection edit belongs
to this Worker. `templates/CLAUDE.md` remains the exact `@AGENTS.md` adapter.
Any additional shared path needs Director release, coordinated through Dispatcher;
no new IDs are needed here.

## Generic Mirror Rules

Mirror claims according to their owners, with a concise disposition for each
changed root section: mirrored, deliberately generic, or unchanged with reason.
Use recognized `[BRACKETED]` placeholders for project values. Do not import
producer names, private paths, branch tips, release state, Spec IDs, failed QA
state or bootstrap exemptions as universal rules. Do not erase supported
commands, safety, self-drift or Template-upgrade obligations to improve scores.

Worker self-checks and reports; Dispatcher performs whole-Spec QA; separate
Director reviews the immutable assembled candidate. Do not add per-Task
approval ceremonies or let Dispatcher self-approve that Director review.
Owner chooses useful Human QA timing, including milestones, accumulated work,
a valued Spec or escalation; observation is not approval. Owner alone promotes
to main. Closure follows S-00J's [closure-capture transition contract](../../../S-00J-spec-qa-gate-at-integration/SPEC.md):
`complete` follows verified main content, and features Wiki capture follows
`complete` and precedes transient cleanup, using only the route J/I actually
deliver. Keep intended
nested branch topology distinct from the currently enforced route.

Preserve source arrow/brace notation, indentation and loops exactly when carried
forward, with provenance and a separate labeled prose interpretation. Do not
normalize a reconstruction and call it the source diagram. The pending SCR
candidate `e318f144247d4288d2364f8103c78069d64aa919` is unaccepted,
unlanded context; its version-only QA and closure wording is not a template
source of authority.

## Red / Green And Fresh-Room Demo

1. Capture the existing guardrail score before execution with
   `node tools/audit-guardrails.mjs --path . --json`, retaining TK-002's original
   phase-two baseline as well. Add a failing assertion at the released seams
   before editing templates; run the affected test and record its exact failed
   checkpoint. Test a missing workflow obligation, leaked project value or
   guidance/runtime mismatch, not merely the presence of a phrase.
2. Extend the existing Genesis fixture to derive a disposable product room
   from the candidate's actual template content and pinned installed runtime.
   The current fixture embeds filled template bodies in drafted controls and
   checks vocabulary; that alone does not demonstrate a working project.
   Use its existing Puffer Pond destination or an equally bounded fixture:
   first assert a failing visible pond-render/visitor-response behavior, then
   implement the minimal product change in that room and demonstrate it passes.
   No external project or real owner approval is test data.
3. Follow the generated room's own guidance to discover and claim a record-backed
   Task, record red/green product proof and docs status, close/report that Task,
   and assemble its Spec evidence using the installed project runtime. Assert
   the actual output, Task state, preserved evidence and project-owned content,
   rather than only matching wording. Use the delivered conversion route if
   Genesis still seeds embedded rows; do not call that seed record-backed.
   Exercise stale/missing proof refusal without losing product or Task bytes.
   Apply only delivered downstream QA/closure commands; lifecycle gaps block
   the dependent template change and return to J/I.
4. Extend Adoption coverage to show the mirrored guidance coexists with
   preserved room-owned product source, controls and history; adoption is
   reconciliation, not permission to overwrite a working room. Assert retained
   bytes and usable installed Task discovery. Verify every changed command
   example with concrete fixture values against delivered CLI syntax/flags;
   usage membership alone is insufficient.
5. Run `node tools/test-control-fidelity.mjs`,
   `node tools/test-genesis-from-decisions.mjs`,
   `node tools/test-workbench-adoption.mjs`,
   `node tools/test-blueprint-contract.mjs`,
   `node tools/test-controls-vocabulary-sweep.mjs`, and
   `node tools/evaluate-workbench.mjs --path templates --include-controls`.
   Inspect `node tools/control-fidelity.mjs report --project . --templates templates --format json`
   and explain intentional divergences; fidelity reports are not approval gates.
   Run the full AGENTS verification suite on the executable assembled candidate,
   including doctor, through Dispatcher. Record the after guardrail score,
   recommendations and outcome limitations without weakening criteria.

Demo acceptance: return one command or a transcript inspectable in under one
minute showing the fresh room's real pond output/response, installed Task
selection, red then green project check, Task proof/report and a refusal that
preserves state. Name the candidate and installed-source SHA. Provider-free
fixtures prove these mechanics, not a real Director verdict, owner Human QA,
main promotion, release readiness or the full S-00O real-room cycle. Existing
test entry points above are plans to extend and run, not claimed demo results.

## Done And Evidence Limits

- [ ] Released templates mirror the reconciled controls, remain generic and
  copy-ready, and retain only supported commands and accepted ADR semantics.
- [ ] Red then green proof includes fresh-room project behavior and Workbench
  transitions; Adoption preserves room-owned truth; all changed examples run.
- [ ] The short demo and section-by-section mirror dispositions are returned
  with immutable SHA, exact paths, commands/results, docs and remaining gaps.
- [ ] Dispatcher evaluates assembled acceptance and required full-suite proof;
  separate Director reviews that immutable candidate before integration.

No implementation result, full-suite pass, approval, release or lifecycle
completion is claimed by authoring this packet. The Worker does not update shared
Spec state, remove blockers, approve unresolved ADRs, merge main or close S-00P.
Source scope is S-00P/TK-005 at
`89d4042fb8931b9d720af75bffea1c28803d72aa`, read with the Dispatcher’s
September 26 Delivery Reconciliation in the working SPEC and this assignment;
its newer role, QA and closure direction supersedes earlier per-Task review
wording. Historical evidence and pending decision lineage remain intact.

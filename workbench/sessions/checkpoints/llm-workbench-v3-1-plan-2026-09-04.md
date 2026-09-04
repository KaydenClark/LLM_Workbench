# Grilling — LLM Workbench v3.1 release plan
STATUS: PROMOTED — 2026-09-04 · by claude-fable-5-1   |   Started 2026-09-04

Promoted from the owner-reviewed v3.1 greenlight handoff (an untracked
host-level Intent document, not durable evidence) plus twelve binding owner
amendments stated in the activating request. This checkpoint is the durable,
privacy-checked copy; it carries the decisions themselves rather than a path
to the transient handoff. Nothing here outranks `AGENTS.md`, `BLUEPRINT.md`,
`LEXICON.md`, `RUNBOOK.md`, or an assigned `SPEC.md`; those owners carry the
binding form of every rule below.

## Owner's words

> "Start LLM Workbench V3.1 from the reviewed handoff."

> "Document v3.0.0 as an unreleased internal candidate and v3.1.0 as the first public v3 release."

## Locked decisions (owner amendments, verbatim intent)

1. [locked] **S-015 completes first.** Independent PASS on the final immutable
   repair SHA, land it on `integration`, close S-015, render and doctor, and
   branch v3.1 from the resulting exact integration SHA. Never stack v3.1 on
   an unlanded repair branch.
2. [locked] **Single writable repository.** All v3.1 development happens in a
   clean `KaydenClark/LLM_Workbench` worktree using its own controls. GPT_OS
   and Foundry are read-only evidence. No Foundry Captain, Job Order, flight,
   CAS/Journal, scheduler, embedded Forge tool, or Foundry path may be
   required by any Workbench behavior.
3. [locked] **`wiki/design-concepts` is mandatory to exist.** Every manifest
   declares it; the collection may be empty. The article shape is
   owner-directed: parent/child ownership, `Evidence and Sources`, `History`,
   Lexicon routing, agent suggestion and repair limits, nonblocking stale
   handling.
4. [locked] **Exactly seven root controls.** The Workbench Contract is the
   logical set of current claims owned by those seven controls plus the
   explicitly assigned spec. No `CONTRACT.md` or other coequal root control.
5. [locked] **Ownership routing.** Lexicon owns shared meanings only; AGENTS
   owns authority and behavior; Blueprint owns cross-cutting architecture;
   selected specs own bounded capability requirements; Runbook owns
   procedures; Taskboard is Projection; Wiki is durable knowledge; ADRs own
   rationale. ADR `canonicalized_in` links target the correct owner.
6. [locked] **ADR porting.** Reconcile ADR-0008 with the mixed-claim model
   before porting. Preserve an ADR ID only for a faithful sanitized port.
   Material changes receive a new Workbench ADR with `ported_from` or
   supersession metadata. ADRs are created only for consequential decisions
   with meaningful alternatives or reversal cost.
7. [locked] **Tool ownership split.** `workbench/tools` holds Workbench-managed
   portable runtime tools; an application's root `tools/` stays
   application-owned. One canonical runtime-tool source, management markers or
   hashes, explicit-update behavior, backups, rollback, mechanical
   permissions, exact source release/SHA receipts. No active Workbench
   consumer hardcodes a root tools path after migration.
8. [locked] **Session durability.** Live grilling and handoff records stay
   untracked by default. Durable references target privacy-checked promoted
   copies under `sessions/checkpoints`. An untracked local path is not
   durable evidence.
9. [locked] **Diagnostic blocking lives in consumers.** `doctor` blocks `all`
   and `selection` findings; `next` excludes blocked work; `claim` or a
   selected-slice preflight refuses slice blockers; `attention` stays visible
   but nonblocking. Artifacts, tools, and projections cannot manufacture
   authority or choose their own blocker severity.
10. [locked] **Primary acceptance test.** Force an interruption immediately
    after the planning checkpoint is pushed and before implementation. A
    different provider resumes from a clean clone using repository state
    only, with no original chat and no Foundry path. Use isolated or
    exact-version-synchronized skill and tool installations so the test
    proves the v3.1 candidate, not an older global skill.
11. [locked] **Complete Wiki safety contract.** Explicit project/deployment
    profile; `knowledge_role` separate from `provenance`; `sensitivity` is
    handling metadata only; no secrets; repository-relative portable source
    paths; optional Obsidian support; no copied live task state; nonblocking
    stale unrelated knowledge.
12. [locked] **Portability and privacy matrix.** Schema migration, mixed
    Adoption, case-sensitive paths, Windows/POSIX behavior, symlink
    invocation, collisions, stale links, public privacy stripping, and scans
    for all retired private and Foundry-dependent paths.
13. [locked] **Versions.** v3.0.0 is an unreleased internal candidate; v3.1.0
    is the first public v3 release.

## Locked decisions carried from the reviewed handoff

14. [locked] `KaydenClark/LLM_Workbench` is the sole Workbench source and
    release repository. GPT_OS and Foundry adopt released Workbench versions;
    Foundry is a downstream extension that adds altitude and is never the
    runway. The embedded Forge is not a source, copy target, tool runtime, or
    prerequisite.
15. [locked] Manifest schema 2 with exactly six lowercase lanes:
    `workbench/docs`, `specs`, `wiki`, `sessions`, `feedback`, `tools`, plus
    declared collections `docs/adr`, `wiki/design-concepts`,
    `wiki/guidebooks`, `wiki/archive`, `sessions/grilling`,
    `sessions/handoffs`, `sessions/checkpoints`. Lowercase paths without
    spaces. Schema 1 returns `upgrade-required` and has a tested lossless
    migration. Downstream receipts record the exact source release and
    commit.
16. [locked] Governance Core: Governance Planes classify claims and their use
    in an operation, never whole artifact types; instruction authority is
    separate from state resolution; no-governance-tax rule; an assigned spec
    supplies bounded capability requirements and cannot override the user,
    platform safety, or `AGENTS.md`; unassigned specs remain evidence.
17. [locked] When Canon and verified Actuality disagree: newer Canon is an
    implementation gap, newer Actuality is documentation drift, unclear
    ordering is an ambiguity to investigate. Neither "code always wins" nor
    "Canon proves implementation".
18. [locked] Generated projects receive the ADR capability with an empty
    corpus; the product repository carries the public Workbench ADR corpus.
    The ADR register is derived.
19. [locked] One release umbrella spec plus four linked capability specs:
    manifest schema 2 and managed support runtime; Governance Core and ADRs;
    portable Wiki and Design Concepts; workflow composition, feedback, and
    cold resume. The umbrella owns dependency completion, candidate SHA,
    provider proof, independent audit, release evidence, and promotion only.
20. [locked] Closed boundaries not reopened: five-versus-six lanes; the
    Workbench-versus-Foundry dependency direction; whether ordinary work
    needs Foundry ceremony; publishing v3.0 before v3.1; porting all
    twenty-four GPT_OS ADRs wholesale; rewriting completed S-021.

## Verified before promotion (do not re-derive)

- Independent fixed-SHA review of `d80d14c..73308fc` and its landing are
  recorded in S-015's evidence log, not here.
- The full union verification suite at `73308fc` passed except two effects of
  the legitimately stale S-015 claim (doctor `stale-claim`; the dogfood
  test's empty-doctor assertion), both cleared by closing S-015.
- GPT_OS evidence harvested read-only: ADR-0001..0024, the six-lane
  `workbench/manifest.json` with `collections`, `workbench/wiki/SCHEMA.md`,
  `wiki/AGENTS.md`, `wiki/MEMORY.md`, `tools/wiki-memory.mjs`,
  `tools/workspace-paths.mjs`, the 2026-09-02 design-concept notepad, and
  the 2026-09-03 governance notepad. None became a dependency.

## Spawned branches

21. [locked] Spec IDs S-016 through S-019 stay unused; obsolete PR #42 once
    proposed IDs in that range. v3.1 records are S-022 (umbrella), S-023,
    S-024, S-025, S-026.
22. [locked] The product repository dogfoods the tool split: portable runtime
    tools move to `workbench/tools/` with Git history; root `tools/` keeps
    product-development, setup, migration, evaluation, and test tooling.
23. [locked] The v3.0 `workbench/handoffs` lane held only tracked durable
    checkpoints by contract, so the schema 1→2 migration maps it to
    `workbench/sessions/checkpoints`; `workbench/grilling` maps to
    `workbench/sessions/grilling`, which becomes untracked by default.
24. [open] Whether the cross-provider resume proof can run with a fully
    isolated provider home on this host without touching credentials; the
    fallback is an exact-version-synchronized disposable home. Recorded as a
    limitation if neither is achievable.

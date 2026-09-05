# S-024 - Governance Core, ADRs, And Scoped Diagnostics

> Linked v3.1 capability promoted on 2026-09-04. Stable path
> `workbench/specs/S-024-governance-core-adrs-and-diagnostics/SPEC.md`;
> never move it between status folders.

**Spec ID:** S-024
**Status:** complete
**Priority:** 2
**Owner:** claude-fable-5-1
**Updated:** 2026-09-04
**Catalog description:** Give every Workbench claim-level Governance Planes, separated instruction authority and state resolution, a registered diagnostic model enforced by doctor/next/claim, and a first-class ADR collection.
**Blockers:** none
**Latest event:** Spec completed and removed from the hot board.
**Next gate:** none

## Outcome

Agents in any Workbench share one governance vocabulary: planes classify
claims, instruction authority is distinct from state resolution, ordinary work
carries no governance tax, and tools report through a registered diagnostic
model whose blocking effect only `doctor`, `next`, and `claim` enforce. Every
project has `workbench/docs/adr/` with a validator, a derived register, and an
empty corpus; the product repository carries the public Workbench ADR corpus.

## Why It Matters

The v3.0 `AGENTS.md` ranked source above the assigned spec while also making
the spec own requirements, so agents could read either "code wins" or "spec
wins" and both were sometimes wrong. Doctor treated every finding as fatal,
which trained agents to ignore it. Decisions lived only in chat. v3.1 makes
the vocabulary, the blocking rules, and the rationale explicit and mechanical.

## Current Verified State

- `tools/spec-workbench.mjs` `doctor` returns a flat `{code, message}` list and
  exits 1 for any finding; `next` and `claim` ignore doctor entirely.
- Root and template `AGENTS.md` place "source and tests verified live" above
  the assigned spec and call specs untrusted evidence.
- No ADR directory, tool, or template exists; `test-skill-catalog.mjs`
  forbids skills from mentioning ADRs.
- GPT_OS ADR-0001 through ADR-0024 exist as read-only evidence; ADR-0008
  categorically classifies ADRs and specs as Grounding, which conflicts with
  the claim-level model.

## Desired Behavior

- `workbench/tools/diagnostics.mjs` registers every code with `severity`
  (`error` or `attention`), `scope`, and `blocks` (`all`, `selection`,
  `selected-slice`, `none`). `doctor` prints all findings, exits non-zero only
  for `all` or `selection`; `next` excludes slices with `selected-slice`
  findings; `claim` refuses them; unregistered codes are a tool defect.
- `workbench/tools/adr.mjs new|validate|register`: frontmatter `status`,
  `date`, `canonicalized_in` (existing repository paths that own the rule),
  optional `supersedes`, `superseded_by`, `ported_from`; a derived
  `REGISTER.md`; validation reports a provenance link into an untracked
  collection, an unknown `canonicalized_in` target, or a stale register.
- Root and template `AGENTS.md` carry `Instruction Authority` and `State
  Resolution`; root and template `LEXICON.md` carry the Governance Core
  terms; `BLUEPRINT.md` carries the source-authority and contract invariants.
- The product repository carries the ported and new ADR corpus; the templates
  ship an empty collection and the ADR tool.

## Decisions And Contracts

- Rationale: [ADR-0025](../../docs/adr/0025-planes-classify-claims-not-whole-artifacts.md),
  [ADR-0027](../../docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md),
  [ADR-0029](../../docs/adr/0029-diagnostics-carry-registered-blocking-semantics.md),
  [ADR-0033](../../docs/adr/0033-workbench-contract-is-a-claim-set.md).
- Registered effects: unreadable or unsafe manifest, missing lane or required
  collection, and `upgrade-required` block `all`; malformed spec, duplicate
  ID, invalid or contradictory state, unstable path, missing evidence, render
  drift, and broken render target block `selection`; an unmet dependency named
  by the selected ticket blocks that slice; stale claim, broken link, stale
  register, stale wiki note, and untracked provenance are `attention`.
- ADR numbering: ported ADRs keep their GPT_OS ID only when the port is
  faithful and sanitized; new Workbench ADRs start at 0025; gaps are
  preferred to renumbering.
- Skills may name ADRs only through the manifest-declared `adr` collection;
  the catalog test changes from forbidding the word to requiring the route.

## Non-Goals

- Clearance bands, Job Orders, flights, or any Foundry governance extension.
- Porting every GPT_OS ADR or auto-generating ADRs from conversations.

## Dependencies And Blockers

- S-023/TK-001 supplies the `docs/adr` collection and the path resolver.

## Vertical Implementation Slices

Tickets are temporary tracer bullets within this stable capability record.

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Doctor reports registered findings with effects, exits only on `all`/`selection`, and `next`/`claim` refuse slice blockers while attention stays visible | done | none | Red: the diagnostics test failed before the registry existed. Green: 4 diagnostics tests (closed typed registry with every emitted code registered and attention never blocking; attention findings keep doctor exit 0 and resumable work selectable; duplicate identity fails doctor and render refuses it; a schema 1 manifest blocks all and next refuses; a blocked selected slice is reported at exit 0, excluded by next, refused by claim by name without mutation, while ordered successor tickets are not findings), lifecycle, dogfood, layout, and installer tests, and the full 25-command union suite |
| TK-002 | The ADR tool creates, validates, and registers ADRs in a fixture and in this repository, rejecting untracked provenance and unknown canonicalization targets | done | TK-001 | Red: the ADR test failed before workbench/tools/adr.mjs existed. Green: 4 ADR tests (valid corpus validates, register is deterministic and byte-stable, stale register is attention, doctor carries ADR findings; unknown canonicalized_in target, untracked sessions provenance with the exact target, missing frontmatter, duplicate number, and superseded without superseded_by are invalid-adr or untracked-provenance findings that never block selection while the adr command itself exits 1; new allocates the next number as a proposed record; the product corpus of 19 records validates with a current REGISTER.md), diagnostics, lifecycle, dogfood, installer tests, and the full 26-command union suite |
| TK-003 | Root and template controls carry the Governance Core, and the product corpus holds the reconciled ported and new ADRs with valid `canonicalized_in` links | done | TK-002 | Red: the Governance Core test failed on the copy-ready templates. Green: 4 Governance Core tests (root and template AGENTS separate instruction authority from state resolution and no longer rank source above the assigned spec; root and template Lexicons carry the thirteen Governance Core terms without product-specific ADR links; template Blueprint and Runbook route decision records, diagnostics, and the tools lane; ADR-0008 is not ported and ADR-0025 records its supersession lineage with every canonicalized_in target on a control or spec owner), layout, skill-catalog, and the full 27-command union suite; templates evaluator 106.6/113 unchanged |

## Acceptance Criteria

- [x] Every diagnostic code is registered with severity, scope, and effect; a test proves each effect at `doctor`, `next`, and `claim`.
- [x] Attention findings never change an exit code or hide eligible work.
- [x] `adr.mjs` validates frontmatter, canonicalization targets, provenance tracking, and register freshness in a fixture and in this repository.
- [x] Root and template `AGENTS.md`, `LEXICON.md`, and `BLUEPRINT.md` carry the Governance Core with no placeholder leakage and evaluator scores not below baseline.
- [x] ADR-0008 is reconciled: not ported; superseded by ADR-0025 with recorded lineage.
- [x] Full union suite, render, doctor, and `git diff --check` pass.

## Testing Seams

- Registry: exported table and a test that every emitted code is registered.
- Consumers: `doctor`, `next`, and `claim` against fixtures containing one finding of each effect.
- ADR CLI: JSON results and stable codes; register byte comparison.
- Controls: evaluator scores and placeholder scans.

## Verification Procedure

```bash
node tools/test-spec-workbench.mjs
node tools/test-diagnostics.mjs
node tools/test-adr.mjs
node tools/evaluate-workbench.mjs --path . --include-controls
node tools/evaluate-workbench.mjs --path templates --include-controls
```

Then the complete `RUNBOOK.md` union suite, render, doctor, and `git diff --check`.

## Documentation Impact

- `AGENTS.md` (root and template) owns instruction authority, state resolution, and diagnostic behavior.
- `LEXICON.md` (root and template) owns the Governance Core terms.
- `BLUEPRINT.md` owns the contract and source-authority invariants.
- `RUNBOOK.md` owns the diagnostic table and ADR commands.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-04 | plan | Released the first ticket's S-023 blocker: S-023/TK-001 through TK-004 landed the schema 2 layout, collections, sessions ignore file, and tools lane this slice depends on, while S-023 itself completes only after S-026/TK-001 re-points the skills; keeping a whole-spec blocker here would deadlock selection | `next --json` returned null with every first ticket blocked on an uncompletable S-023; doctor green | Ticket blocker only; requirements unchanged | Implement TK-001 |
| 2026-09-04 | plan | Captured the Governance Core, diagnostics, and ADR capability from the promoted v3.1 plan | Baseline suite green at the landed S-015 SHA; no capability behavior verified yet | Spec added; ADR drafts staged for TK-003; controls change with their tickets | Implement TK-001 through TK-003 after S-023/TK-001 |
| 2026-09-04 | TK-001 | Ticket closed | Red: the diagnostics test failed before the registry existed. Green: 4 diagnostics tests (closed typed registry with every emitted code registered and attention never blocking; attention findings keep doctor exit 0 and resumable work selectable; duplicate identity fails doctor and render refuses it; a schema 1 manifest blocks all and next refuses; a blocked selected slice is reported at exit 0, excluded by next, refused by claim by name without mutation, while ordered successor tickets are not findings), lifecycle, dogfood, layout, and installer tests, and the full 25-command union suite | Added workbench/tools/diagnostics.mjs to the runtime set; RUNBOOK.md gained the Diagnostics And Blocking Effects table; AGENTS.md already carries the rule; ADR-0005 and ADR-0029 accepted | ADR and wiki findings join doctor with their tools in TK-002 and S-025/TK-002 |
| 2026-09-04 | TK-002 | Ticket closed | Red: the ADR test failed before workbench/tools/adr.mjs existed. Green: 4 ADR tests (valid corpus validates, register is deterministic and byte-stable, stale register is attention, doctor carries ADR findings; unknown canonicalized_in target, untracked sessions provenance with the exact target, missing frontmatter, duplicate number, and superseded without superseded_by are invalid-adr or untracked-provenance findings that never block selection while the adr command itself exits 1; new allocates the next number as a proposed record; the product corpus of 19 records validates with a current REGISTER.md), diagnostics, lifecycle, dogfood, installer tests, and the full 26-command union suite | Added workbench/tools/adr.mjs to the runtime set and generated workbench/docs/adr/REGISTER.md; RUNBOOK.md gained the Architecture Decision Records section; doctor now carries ADR findings for schema 2 projects | Template and control Governance Core wiring is TK-003; wiki findings join doctor in S-025/TK-002 |
| 2026-09-04 | TK-003 | Ticket closed | Red: the Governance Core test failed on the copy-ready templates. Green: 4 Governance Core tests (root and template AGENTS separate instruction authority from state resolution and no longer rank source above the assigned spec; root and template Lexicons carry the thirteen Governance Core terms without product-specific ADR links; template Blueprint and Runbook route decision records, diagnostics, and the tools lane; ADR-0008 is not ported and ADR-0025 records its supersession lineage with every canonicalized_in target on a control or spec owner), layout, skill-catalog, and the full 27-command union suite; templates evaluator 106.6/113 unchanged | Updated templates/AGENTS.md, templates/LEXICON.md, templates/BLUEPRINT.md, and templates/RUNBOOK.md; root controls carried the Governance Core since the planning checkpoint | none |
| 2026-09-04 | spec | Spec completed | Acceptance gates satisfied | Documentation impact recorded above | none |

## Completion Result

Completed on `claude/v3.1-release`. `workbench/tools/diagnostics.mjs` is the
closed registry of every finding with severity, scope, and blocking effect;
`doctor` exits non-zero only on `all` and `selection`, `next` excludes and
`claim` refuses a blocked selected slice by name, and attention never blocks.
`workbench/tools/adr.mjs` creates, validates, and registers decision records,
reporting untracked provenance and unknown canonicalization targets without
blocking selection. Root and template controls carry the Governance Core;
the product corpus holds ten faithfully ported and nine new ADRs with ADR-0008
reconciled through ADR-0025.

## Remaining Limitations Or Follow-Up Specs

- Cross-plane transition verbs and policy data remain outside the portable core.

## Supersession

- Supersedes: none
- Superseded by: none

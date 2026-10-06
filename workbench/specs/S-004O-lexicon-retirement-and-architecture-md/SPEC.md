# S-004O - Lexicon Retirement And ARCHITECTURE.md

**Spec ID:** S-004O
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-10-05
**Catalog description:** Retire LEXICON.md by moving every term to a Wiki entry and the ownership schema, routes and invariants to a short ARCHITECTURE.md, in this room and in the Template.
**Blockers:** none for specification. Implementation awaits Plan and assignment, and takes the Lexicon writer's turn.
**Latest event:** Authored at the Map step from the owner's Lexicon retirement decision of 2026-10-05; no Task is cut.
**Next gate:** At Plan, census the Lexicon's rows and every tool, test and link that reads it, then cut small Tasks.

## Outcome

`LEXICON.md` no longer exists. What a term means is a Wiki entry, one per term, routed from the Wiki memory. Which artifact owns which kind of truth, the routes to it and the architectural invariants are `ARCHITECTURE.md`: short, a bird's-eye view then a codemap, named modules and types with no code links, explicit invariants and boundaries, revisited a few times a year. In a generated room, `ARCHITECTURE.md` also carries the project's own codemap, drafted at setup and confirmed by grilling. Every tool, test, skill and link that read the Lexicon reads its new home.

## Why It Matters

The owner (2026-10-05): "we dont need runbook or lexicon. We should be using the wiki for those things." The Lexicon had two jobs in one 360-line file that no agent reads whole; split, each job lands where an agent already looks ([the Lexicon retirement decision](../../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md)). The models the owner pointed at are matklad's ARCHITECTURE.md post and Lopopolo's own `ARCHITECTURE.md`, linked from the [lineage page](../../wiki/harness-engineering-lineage.md).

## Current Verified State

At integration `46ad9789` (2026-10-05): `LEXICON.md` is 360 lines and about 13,600 words, with the Artifact Ownership Schema, the Context Map routes, the Governance Core and the term rows; `templates/LEXICON.md` mirrors it generically; the Blueprint's first line and the Template Blueprint's first line read "Its terms mean what the Lexicon says they mean"; the `lexicon`, `domain-modeling` and `ubiquitous-language` skills operate on it; the Wiki already holds dictionary entries per term under `dictionary-*.md`; the Instruction Authority list names the Lexicon as a Contract carrier; decision records name `LEXICON.md` in `canonicalized_in`. The count of tools and tests that read a Lexicon heading is for the census Task. No implementation or agent-outcome proof for this capability is claimed by this Map record.

## Desired Behavior

1. A census maps every Lexicon row and section to its home: a Wiki entry, `ARCHITECTURE.md`, a restatement of another owner that goes nowhere, or retired with a reason. A check shows every removed line landed, reusing the carrier rewrite's landing-check tool.
2. `ARCHITECTURE.md` exists in this room and as a `templates/` mirror, holding the ownership table, the routes and the invariants, and in a generated room the project codemap drafted by Genesis and adoption.
3. Every term has one Wiki entry routed from the Wiki memory, in the shape the dictionary entries already use.
4. The `lexicon`, `domain-modeling` and `ubiquitous-language` skills operate on the Wiki entries and `ARCHITECTURE.md`; the Wiki validator checks the entries.
5. The Blueprint's first line in this room and the Template says where terms are defined; the Instruction Authority list no longer names the Lexicon; every link to a Lexicon heading is re-pointed; the update route removes a room's Lexicon only after its lines have landed in that room.
6. Decision records that name `LEXICON.md` in `canonicalized_in` keep that history unchanged.

## Decisions And Contracts

- [The Lexicon retires](../../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md) and [AGENTS.md is the map and the only Contract file](../../docs/ddr/001C-agents-md-is-the-map-and-the-only-contract-file.md) (owner, 2026-10-05).
- No line is removed before its new home exists; the carrier rewrite's rule and tool apply.
- `ARCHITECTURE.md` is a routing artifact, never a Contract file.

## Non-Goals

Rewriting `AGENTS.md` or the Runbook (the carrier rewrite owns them), changing what any term means, a build system for the Wiki, implementing another capability.

## Dependencies And Blockers

- The Lexicon writer's turn: the [Contract carrier rewrite](../S-004C-contract-carrier-pointer-brief-rewrite/SPEC.md)'s Lexicon Task and the [AI Coding Dictionary Terms](../S-004E-ai-coding-dictionary-terms/SPEC.md) Spec edit the Lexicon; this Spec takes the turn after them and its landing check is the rewrite's tool.
- The `templates/` mirrors and the update route are shared with the rewrite's update-route work.
- The [release owner](../S-00O-workbench-v4-0-0-release/SPEC.md) retains version, Template and owner gates.

## Vertical Implementation Slices

No Tasks cut. At Plan, cut small complete-path slices: the census and landing check; `ARCHITECTURE.md` from the ownership schema, routes and invariants; the term entries in batches; the skills and validator; the links, the Blueprint line, the Template and the update route; the removal. The empty tasks directory keeps this planned capability record-backed.

## Acceptance Criteria

- [ ] A census maps every Lexicon line to a home and the landing check passes at the candidate with `LEXICON.md` removed.
- [ ] `ARCHITECTURE.md` exists in the room and the Template, stays short, and holds the ownership table, routes and invariants; Genesis and adoption draft the codemap for a new room.
- [ ] Every term has one validated Wiki entry routed from the Wiki memory, and the three skills operate on the new homes.
- [ ] No link in the repository points at a Lexicon heading, the Instruction Authority list does not name the Lexicon, and the full suite passes on the committed candidate.
- [ ] Updating a room retires its Lexicon only after its lines land, and a room without one is unchanged; named verification and remaining limitations are recorded without claiming owner approval.

## Testing Seams

The landing-check tool, the Wiki validator, the control-fidelity and governance-core tests, the template-placeholder check, the Genesis, adoption and update-route round trips.

## Verification Procedure

Run the targeted control, wiki, template, genesis, adoption and upgrade tests, then the full AGENTS suite, `render` and `doctor`, on the committed candidate. Obtain separate-context review of the immutable candidate before integration.

## Documentation Impact

`ARCHITECTURE.md` and its Template mirror, the Wiki entries and memory routes, the Blueprint's first line in both rooms, the three skills' pages, and every page that linked a Lexicon heading.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-05 | none | Authored at the Map step from the owner's Lexicon retirement decision of 2026-10-05 at integration 46ad9789. | Map only; the Lexicon, the Template mirror and the Blueprint line were read, no runtime proof claimed. | This Spec. | Plan, the census, implementation and proof remain. |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Whether the dictionary entries and the term entries share one shape is decided at Plan.

## Supersession

- Supersedes: none
- Superseded by: none

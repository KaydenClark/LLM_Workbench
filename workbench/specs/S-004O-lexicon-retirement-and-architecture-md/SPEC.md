# S-004O - Lexicon Retirement And ARCHITECTURE.md

**Spec ID:** S-004O
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-10-06
**Catalog description:** Retire LEXICON.md into concise canonical project vocabulary in GLOSSARY.md, richer Wiki explanations and ownership routes in ARCHITECTURE.md, in this room and the Template.
**Blockers:** none for specification. Implementation awaits Plan and assignment, and takes the Lexicon writer's turn.
**Latest event:** Reconciled the confirmed 2026-10-06 glossary refinement into the existing retirement capability; remains planned with no Task cut.
**Next gate:** At authorized activation, verify context layout, census the Lexicon and its consumers, then cut Tasks with `/to-tasks`.

## Outcome

`LEXICON.md` no longer exists after a verified migration. Root `GLOSSARY.md` owns concise canonical project vocabulary in the ordinary single-context repository; richer Wiki lexicon articles explain concepts and show usage, linking to the canonical definitions. General reference concepts may remain Wiki-only. The destination is [the refined retirement decision](../../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md). Which artifact owns which kind of truth, the routes to it and the architectural invariants are `ARCHITECTURE.md`: short, a bird's-eye view then a codemap, named modules and types with no code links, explicit invariants and boundaries, revisited a few times a year. In a generated room, `ARCHITECTURE.md` also carries the project's own codemap, drafted at setup and confirmed by grilling. Every tool, test, skill and link that read the Lexicon reads its new home.

## Why It Matters

The owner (2026-10-05): "we dont need runbook or lexicon. We should be using the wiki for those things." The Lexicon had two jobs in one 360-line file that no agent reads whole; split, each job lands where an agent already looks ([the Lexicon retirement decision](../../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md)). The models the owner pointed at are matklad's ARCHITECTURE.md post and Lopopolo's own `ARCHITECTURE.md`, linked from the [lineage page](../../wiki/harness-engineering-lineage.md).

## Current Verified State

At integration `ec65203d` (2026-10-05): `LEXICON.md` is 362 lines and about 13,800 words, with the Artifact Ownership Schema, the Context Map routes, the Governance Core and the term rows; `templates/LEXICON.md` mirrors it generically; the Blueprint's first line and the Template Blueprint's first line read "Its terms mean what the Lexicon says they mean"; the `lexicon`, `domain-modeling` and `ubiquitous-language` skills operate on it; the Wiki already holds dictionary entries per term under `dictionary-*.md`; the Instruction Authority list names the Lexicon as a Contract carrier; decision records name `LEXICON.md` in `canonicalized_in`. The count of tools and tests that read a Lexicon heading is for the census Task. No implementation or agent-outcome proof for this capability is claimed by this Map record.

At refreshed integration `42431879fab3057db9e26ae661b4e92512c281f0` (2026-10-06), the root and Template still contain `LEXICON.md`; neither `GLOSSARY.md` nor `ARCHITECTURE.md` exists there. The confirmed destination is ahead of implementation. This planning pass changes no migration runtime or installed room.

## Desired Behavior

1. A census classifies every Lexicon row and section: project-specific vocabulary (including ordinary words with distinct project meanings) to the glossary; deeper explanation and general reference concepts to Wiki articles; ownership and navigation to `ARCHITECTURE.md`; duplicated claims back to their existing owner; or retirement with a reason. Do not copy every term row automatically. A check shows every removed line landed, reusing the carrier rewrite's landing-check tool.
2. `ARCHITECTURE.md` exists in this room and as a `templates/` mirror, holding the ownership table, the routes and the invariants, and in a generated room the project codemap drafted by Genesis and adoption.
3. Root `GLOSSARY.md` and its generic Template follow [Matt's pinned glossary format](https://github.com/mattpocock/skills/blob/d81f3a183412e71a5b1e84ca21bc1a35eea03a60/skills/engineering/domain-modeling/GLOSSARY-FORMAT.md): a context heading, one or two sentence context description, `Language` section, one or two sentence definitions and `_Avoid_` aliases. Natural groupings are optional. Spec, Task, Landmark and the Workbench meaning of Review are project vocabulary; context window and cache tokens need no glossary row unless they gain a distinct local meaning. Wiki lexicon articles retain fuller explanation and examples and link to the glossary; general reference pages may stay Wiki-only.
4. At Plan, verify the actual context layout. Root placement is confirmed for the ordinary single-context repository; do not invent extra contexts or a `GLOSSARY-MAP.md`. A genuinely ambiguous multi-context migration is recorded in the owning Spec for resolution before that affected slice.
5. Route glossary consumers to vocabulary, explanatory readers to Wiki articles, and ownership readers to `ARCHITECTURE.md`. Coordinate skill changes with their existing owners, including S-004J, S-003O and S-003L; this Spec does not take over their delivery. The Wiki validator checks the articles and their canonical-definition links.
6. The Blueprint's first line in this room and the Template says where terms are defined; the Instruction Authority list no longer names the Lexicon; every link to a Lexicon heading is re-pointed; the update route removes a room's Lexicon only after its lines have landed in that room.
7. Decision records that name `LEXICON.md` in `canonicalized_in` keep that history unchanged.

## Decisions And Contracts

- [The Lexicon retires](../../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md) and [AGENTS.md is the map and the only Contract file](../../docs/ddr/001C-agents-md-is-the-map-and-the-only-contract-file.md) (owner, 2026-10-05).
- No line is removed before its new home exists; the carrier rewrite's rule and tool apply.
- `ARCHITECTURE.md` is a routing artifact, never a Contract file.
- Glossary scope, placement and the retained notepad/confirmation/promotion boundary are owned by the refined DDR-001E above. No immediate-write exception is activated.

## Non-Goals

Rewriting `AGENTS.md` or the Runbook (the carrier rewrite owns them), changing what any term means, a build system for the Wiki, implementing another capability.

## Dependencies And Blockers

- The Lexicon writer's turn: the [Contract carrier rewrite](../S-004C-contract-carrier-pointer-brief-rewrite/SPEC.md)'s Lexicon Task and the [AI Coding Dictionary Terms](../S-004E-ai-coding-dictionary-terms/SPEC.md) Spec edit the Lexicon; this Spec takes the turn after them and its landing check is the rewrite's tool.
- The `templates/` mirrors and the update route are shared with the rewrite's update-route work.
- The [release owner](../S-00O-workbench-v4-0-0-release/SPEC.md) retains version, Template and owner gates.

- [Required Domain Modeling Skill (S-004J)](../S-004J-required-domain-modeling-skill/SPEC.md), [lexicon skill alignment (S-003O)](../S-003O-lexicon-skill-alignment/SPEC.md) and [ubiquitous-language skill alignment (S-003L)](../S-003L-ubiquitous-language-skill-alignment/SPEC.md) own the neighboring skill changes. [PR skill adoption (S-002U)](../S-002U-pr-skill-adoption/SPEC.md) reads the delivered glossary; keep its package writer separate from the migration writer.

## Vertical Implementation Slices

No Tasks cut. At Plan, cut small complete-path slices: the census and landing check; `ARCHITECTURE.md` from the ownership schema, routes and invariants; the glossary and linked explanatory articles in batches; consumer routes and validator, coordinated with skill owners; the links, the Blueprint line, the Template and the update route; the removal. The empty tasks directory keeps this planned capability record-backed.

## Acceptance Criteria

- [ ] A census maps every Lexicon line to a home and the landing check passes at the candidate with `LEXICON.md` removed.
- [ ] `ARCHITECTURE.md` exists in the room and the Template, stays short, and holds the ownership table, routes and invariants; Genesis and adoption draft the codemap for a new room.
- [ ] Root and Template glossary use the pinned Matt format with concise project-specific definitions and avoided aliases; general terms are classified rather than copied.
- [ ] Rich Wiki lexicon articles explain concepts and show usage, link to canonical glossary definitions, and remain routed from Wiki memory; general reference pages can remain Wiki-only.
- [ ] Vocabulary, explanation and ownership consumers resolve to their proper owners; neighboring skill acceptance is proven in those Specs.
- [ ] A promotion scenario preserves an unconfirmed proposed term in the notepad and promotes only confirmed meaning; it adds no inline-write exception.
- [ ] No link in the repository points at a Lexicon heading, the Instruction Authority list does not name the Lexicon, and the full suite passes on the committed candidate.
- [ ] Updating a room retires its Lexicon only after its lines land, and a room without one is unchanged; named verification and remaining limitations are recorded without claiming owner approval.

## Testing Seams

The migration census, glossary format/scope checks, glossary-to-Wiki links and a confirmed-versus-pending promotion scenario; the landing-check tool, the Wiki validator, the control-fidelity and governance-core tests, the template-placeholder check, the Genesis, adoption and update-route round trips.

## Verification Procedure

Run the targeted control, wiki, template, genesis, adoption and upgrade tests, then the full AGENTS suite, `render` and `doctor`, on the committed candidate. Obtain separate-context review of the immutable candidate before integration.

## Documentation Impact

`GLOSSARY.md`, `ARCHITECTURE.md` and their Template mirrors, the explanatory Wiki articles and memory routes, the Blueprint's first line in both rooms, the three skills' pages, and every page that linked a Lexicon heading.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-05 | none | Authored at the Map step from the owner's Lexicon retirement decision of 2026-10-05 and re-verified at integration ec65203d. | Map only; the Lexicon, the Template mirror and the Blueprint line were read, no runtime proof claimed. | This Spec. | Plan, the census, implementation and proof remain. |
| 2026-10-06 | planning | Reconciled the owner-confirmed glossary refinement into DDR-001E and this existing planned capability. | Current implementation inspected at integration 42431879fab3057db9e26ae661b4e92512c281f0; no migration or skill proof claimed. | Decision and Spec updated; Blueprint destination and explanatory article reconciled. Template/runtime changes remain assigned delivery. | Activation, context census, Tasks, migration and all delivery gates. |
| 2026-10-06 | planning-check | Verified documentation reconciliation; all delivery acceptance remains open. | Source `3d40a86505a339096c4629b814eb4fed1c789d5d`: full suite 53/53; ADR/Wiki, citation and diff checks passed. [Shared planning receipt](proof/planning-verification.json) preserves the initial Blueprint-link failure, repair, bounded self-drift summaries and existing doctor findings. | Source owners read back; render regenerated projections. | No implementation, independent assembled review, PR or integration delivery claimed; self-drift remains 15 findings and cleanUpdate false. |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Context inventory, individual row classification and migration sequencing are Plan work. The glossary/explanatory-article distinction is settled; do not reopen it.
- This planning-only change exempts Template runtime/control migration: the generic glossary, architecture and route updates must ship together during this Spec's delivery.

## Supersession

- Supersedes: none
- Superseded by: none

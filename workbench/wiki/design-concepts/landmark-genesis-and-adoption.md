---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Seeded from the current answers of the Genesis and Adoption landmark's question cards (landmark record revision 1), 2026-10-04
source_paths:
  - workbench/landmark-tracker/landmarks
  - workbench/landmark-tracker/destination-questions
  - workbench/docs/adr/0047-preservation-contracts-for-genesis-adoption-and-upgrade.md
  - workbench/docs/ddr/000S-setup-drafts-everything-it-can-and-grilling-confirms-it.md
parent: none
authorized_by: the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages)
last_verified: 2026-10-04
---

# Landmark: Genesis and Adoption

This page is the evolving synthesis of the Genesis and Adoption landmark
(landmark [LMK-000U: "Genesis and Adoption landmark"](../../landmark-tracker/landmarks/LMK-000U.json)).
It sums up, in prose, what the landmark's seven question cards currently say and
is updated whenever one of them changes. The cards keep the structured account
and the lineage; the decision records and Specs below govern. For the skills
themselves, read [Skill: genesis](../skill-genesis.md) and
[Skill: adoption](../skill-adoption.md).

## What the landmark is

New and existing projects enter a coherent Workbench while their own truth is
preserved. A new project starts from a founding prompt; an existing project is
migrated once without losing its code, history or records; an already-adopted
project is upgraded. The owner approved this as a core-path pillar on 2026-09-26.
It matters because the entry routes are where a room's structure and the project's
own words first meet, and a mistake either overwrites the project or leaves a room
that looks complete and is not.

The source answers on each card were settled by the owner in grilling sessions;
each card's grouping, title and synthesis is agent work, not separately
owner-confirmed.

## Current accepted answers

- **Three routes, none substitutes for another.** Genesis creates a greenfield
  Workbench, Adoption migrates an unmanaged existing project once, and the update
  route upgrades an already-adopted project
  (card [DQC-004V: "How should a request choose between Genesis, Adoption and update?"](../../landmark-tracker/destination-questions/DQC-004V.json), revision 6).
  The decision record
  ["Preservation contracts for genesis, adoption and upgrade"](../../docs/adr/0047-preservation-contracts-for-genesis-adoption-and-upgrade.md)
  gives each route its own preservation contract: genesis creates an independent
  room, adoption preserves product and history, and upgrade changes only
  explicitly managed installation state.
- **What a fresh Genesis leaves behind.** The manifest and every required lane
  directory exist, the first durable Spec is created, and lanes without records
  stay explicitly empty. The skills lane is laid down from the release checkout,
  and a leftover root `skills/` directory is a doctor finding
  (card [DQC-004W: "What must a fresh Genesis leave behind?"](../../landmark-tracker/destination-questions/DQC-004W.json), revision 7;
  decision record ["Core skills ship in the workbench skills lane"](../../docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md)).
- **What Adoption preserves.** Adoption makes a lossless, manifest-backed Workbench
  for an existing project, preserving project truth and history and removing only
  proven obsolete local shadows. It inventories and classifies first, preserves
  durable Specs, Wiki, feedback and checkpoints, moves known records with history
  where practical, and stops on a conflicting destination or unclear ownership
  instead of overwriting
  (card [DQC-004X: "How should Adoption preserve an existing project’s truth and history?"](../../landmark-tracker/destination-questions/DQC-004X.json), revision 6).
- **When shadows may go.** Legacy local skill shadows are removed only after the
  presence gate passes, with the affected records and links moved first and the
  result kept in the owning Spec's evidence
  (card [DQC-004Y: "When may obsolete skill shadows be retired during migration?"](../../landmark-tracker/destination-questions/DQC-004Y.json), revision 8).
- **Proof by the Template.** Every Workbench version must be proved by successfully
  updating the reference Workbench Template to it. The staged route to a
  personalized room is a valid copyable Template, then project-evidence intake with a
  prepared Blueprint grilling notepad, then Genesis from locked Blueprint and
  decision-record choices, then a fresh-copy end-to-end proof, each stage proving its
  own seam
  (card [DQC-005A: "How should project evidence prepare Blueprint grilling?"](../../landmark-tracker/destination-questions/DQC-005A.json), revision 6;
  card [DQC-005B: "How should locked project design become a personalized working room?"](../../landmark-tracker/destination-questions/DQC-005B.json), revision 7).
  The owner's later destination records say setup drafts everything it can and
  grilling confirms it
  (["Setup drafts everything it can and grilling confirms it"](../../docs/ddr/000S-setup-drafts-everything-it-can-and-grilling-confirms-it.md)),
  and that the Template is the product LLM Workbench makes
  (["LLM Workbench is the producer and the Workbench Template is its product"](../../docs/ddr/000P-llm-workbench-is-the-producer-and-the-workbench-template-is-its-product.md)).

## Open and unresolved

- **Incomplete setup.** The card [DQC-000H: "How should incomplete setup report its result and recovery path?"](../../landmark-tracker/destination-questions/DQC-000H.json), revision 7,
  holds only the skills-lane decision as its answer. Its open note says the
  earlier answer about reporting a truthful partial result was superseded in part,
  that the truthful-partial-result principle still applies to lane and adapter
  failures, but that no locked answer carries it. Inference: a blocked lane or adapter
  should fail closed with exact remediation, but that is not an owner-confirmed claim.
- **Personalization claims.** The two proof cards say the personalization stages
  (prepared grilling notepad, Genesis from locked decisions, validated personalized
  room, fresh-copy proof) were future capabilities that must not be claimed until built
  and verified, and the second card notes the older release proof did not establish
  them. The four stage Specs now record themselves complete; this page reports that
  from their headers and has not re-verified their behavior. The decision record on the
  release proof adds a newer destination, a one-pass Puffer Pond build from a script,
  whose Spec is only planned.
- **Cards to refresh.** The two proof cards are framed around proving the v3.2
  release by a Template update; that release
  work is still active, so the cards read as a point-in-time answer.
- The update route and the Genesis and Adoption skills are being rebuilt in
  separate Specs, listed below, which may change their wording.

## Where the work lives

Decisions: ["Preservation contracts for genesis, adoption and upgrade"](../../docs/adr/0047-preservation-contracts-for-genesis-adoption-and-upgrade.md),
["Core skills ship in the workbench skills lane"](../../docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md),
["Visible, deliberate control divergence"](../../docs/adr/0050-visible-deliberate-control-divergence.md)
and the destination records
["A release is proven by the Template building a real product in one pass"](../../docs/ddr/000Q-a-release-is-proven-by-the-template-building-a-real-product-in-one-pass.md)
and ["LLM Workbench owns what a workbench is; the project owns what it says and may add without tearing apart what works"](../../docs/ddr/000R-llm-workbench-owns-what-a-workbench-is-the-project-owns-what-it-says-and-may-add-without-tearing-apart-what-works.md).

Specs: [S-021: Portable Workbench v3](../../specs/S-021-portable-workbench-v3/SPEC.md)
for the lossless Adoption and lane migration;
[Git-Write Constrained Adoption (S-009)](../../specs/S-009-git-write-constrained-adoption/SPEC.md),
[Reproducible Adoption Provenance (S-012)](../../specs/S-012-adoption-provenance-proof/SPEC.md) and
[Legacy Room Classification And Control Reconcile Order (S-044)](../../specs/S-044-legacy-room-classification/SPEC.md)
for adoption proof and classification;
[Workbench Template Reformation (S-00B)](../../specs/S-00B-workbench-template-reformation/SPEC.md),
[Project Evidence And Blueprint Grilling (S-00C)](../../specs/S-00C-project-evidence-and-blueprint-grilling/SPEC.md),
[Genesis From Blueprint And Active ADRs (S-00D)](../../specs/S-00D-genesis-from-blueprint-and-adrs/SPEC.md) and
[Fresh Workbench Template To Project Proof (S-00E)](../../specs/S-00E-fresh-template-project-proof/SPEC.md)
for the four stages;
[Template Upgrade Release Gate (S-00F)](../../specs/S-00F-template-upgrade-release-gate/SPEC.md),
[S-050: Workbench release Spec](../../specs/S-050-workbench-v3-2-0-release/SPEC.md) and
[Template Release Proof: Puffer Pond (S-004I)](../../specs/S-004I-template-release-proof-puffer-pond/SPEC.md)
for release proof;
and the skill rebuilds
[genesis skill rebuild (S-01G)](../../specs/S-01G-genesis-skill-rebuild/SPEC.md),
[adoption skill rebuild (S-01D)](../../specs/S-01D-adoption-skill-rebuild/SPEC.md) and
[update-harness skill rebuild (S-01N)](../../specs/S-01N-update-harness-skill-rebuild/SPEC.md).

Tools and entry documents: the [adoption migrator](../../../tools/workbench-adoption.mjs),
the [upgrade tool](../../../tools/workbench-upgrade.mjs),
the [Genesis derivation tool](../../../tools/genesis-from-decisions.mjs),
the [project evidence tool](../../tools/project-evidence.mjs),
the [layout check](../../tools/workbench-layout.mjs),
[the Genesis procedure](../../../templates/GENESIS.md) and
[the Adoption procedure](../../../templates/ADOPTION.md).

## Related pages

- [Landmark: Skills](landmark-skills.md) shares the lane-laydown and shadow-retirement cards.

## Evidence and Sources

- [LMK-000U: "Genesis and Adoption landmark record"](../../landmark-tracker/landmarks/LMK-000U.json): title, summary, importance and history.
- The seven question cards named above, each at the revision cited: they hold the answers, confirmation basis, open uncertainties and named claims this page summarizes.
- [Skill: genesis](../skill-genesis.md) and [Skill: adoption](../skill-adoption.md): the skills' own entries.

## History

- 2026-10-04: created by the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages), seeded from the cards' current answers.

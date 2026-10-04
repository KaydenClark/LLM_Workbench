---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Seeded from the current answers of the Workbench Template landmark's question cards (landmark record revision 1), 2026-10-04
source_paths:
  - workbench/landmark-tracker/landmarks
  - workbench/landmark-tracker/destination-questions
  - workbench/docs/ddr/000P-llm-workbench-is-the-producer-and-the-workbench-template-is-its-product.md
  - workbench/docs/ddr/000Q-a-release-is-proven-by-the-template-building-a-real-product-in-one-pass.md
  - workbench/specs/S-00F-template-upgrade-release-gate/SPEC.md
parent: none
authorized_by: the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages)
last_verified: 2026-10-04
---

# Landmark: Workbench Template

This page is the evolving synthesis of the Workbench Template landmark
(landmark ["Workbench Template" (LMK-000V)](../../landmark-tracker/landmarks/LMK-000V.json)).
It sums up what the landmark's four question cards currently say, in prose, and
is updated whenever one of them changes. The cards and the landmark record keep
the structured account; the decisions and Specs named below govern.

## What the landmark is

The reference room that proves the Workbench can be installed, used and upgraded
outside its source repository. The owner's framing is that LLM Workbench is the
producer and the Workbench Template is its product (the Template repository is
[Workbench_Template](https://github.com/KaydenClark/Workbench_Template),
formerly Example_Workbench): if the Template does not work, the Workbench has not
delivered. The landmark matters because release readiness, and the promise that
a new project can start from a working room, rest on it.

## Current accepted answers

Each card records its source answers as owner-settled, in grilling sessions or
in the owner's own chat messages; the card's grouping, title and synthesis are
agent work and were not separately confirmed.

- **What the Template provides.** Card
  [DQC-004Z: "What is the reference Template meant to provide?"](../../landmark-tracker/destination-questions/DQC-004Z.json), revision 6:
  a copyable starter for a blank project. The owner copies it and starts a
  grilling session, and the Workbench guides project discovery, the project
  Blueprint and active ADRs, and Spec derivation. The Example-specific product
  story and command-line tour are not its role. Each release must fully build a
  working template that a room can turn into its own project, and updating the
  Template to the new version is the release gate. The producer and product
  framing is the decision
  ["LLM Workbench is the producer and the Workbench Template is its product"](../../docs/ddr/000P-llm-workbench-is-the-producer-and-the-workbench-template-is-its-product.md).
- **Which upgrade each version must prove.** Card
  [DQC-005H: "What real Template upgrade must each Workbench version prove?"](../../landmark-tracker/destination-questions/DQC-005H.json), revision 8:
  every version is proved by actually upgrading the Template to that version
  before release readiness. Source-template tests and a freshly generated
  project do not stand in for it. Genesis for a project with no Blueprint
  should seed a starting Blueprint and a prepared grilling notepad from the
  project's evidence, and an update must not silently treat an existing
  Blueprint as owner-validated. The card says those mechanisms are future
  capabilities and must not be claimed before they are built and verified.
- **How locked design becomes a personalized room.** Card
  [DQC-005B: "How should locked project design become a personalized working room?"](../../landmark-tracker/destination-questions/DQC-005B.json), revision 7:
  four staged capability Specs, each proving its own seam: a valid copyable
  Template, project-evidence intake with a prepared Blueprint grilling
  notepad, Genesis turning locked Blueprint and ADR decisions into Specs and a
  valid project Workbench, and a fresh-copy end-to-end proof. The Blueprint
  keeps the full destination without claiming delivery. For v3.2 it was
  enough that LLM Workbench applied the newly settled ownership and routing
  rules to update the Template successfully; v3.2 must not claim fresh-copy
  personalization, prepared project grilling or Genesis completion.
- **Which exercises complement the fixtures.** Card
  [DQC-005J: "Which fresh-room and existing-room exercises complement those fixtures?"](../../landmark-tracker/destination-questions/DQC-005J.json), revision 7:
  one fresh Genesis, one mixed existing-project Adoption and one v2 update
  fixture, each from a clean recoverable starting point, alongside focused
  deterministic checks and the layout and manifest as the single
  machine-readable authority.

## Open and unresolved

- **Newer decisions revise the future-capability wording.** The decision
  ["Setup drafts everything it can and grilling confirms it"](../../docs/ddr/000S-setup-drafts-everything-it-can-and-grilling-confirms-it.md)
  now accepts that setup writes a starting Blueprint from whatever the owner
  gives and that nothing drafted counts as confirmed until a grilling session
  does so. The three later stage Specs show status complete in their own
  records ([Project Evidence And Blueprint Grilling (S-00C)](../../specs/S-00C-project-evidence-and-blueprint-grilling/SPEC.md),
  [Genesis From Blueprint And Active ADRs (S-00D)](../../specs/S-00D-genesis-from-blueprint-and-adrs/SPEC.md)
  and [Fresh Workbench Template To Project Proof (S-00E)](../../specs/S-00E-fresh-template-project-proof/SPEC.md));
  this page does not re-verify them. Inference: the card's "not yet claimable" wording
  was scoped to v3.2. The card itself records one open uncertainty: the older
  release's Template-update proof did not establish the later personalization
  stages.
- **A second kind of release proof.** The decision
  ["A release is proven by the Template building a real product in one pass"](../../docs/ddr/000Q-a-release-is-proven-by-the-template-building-a-real-product-in-one-pass.md)
  adds, among a release's other gates, a run in which the Template, updated and
  deployed in the cloud, builds the Puffer Pond site from a prewritten script.
  How it relates to the upgrade gate is left to
  [Template Release Proof: Puffer Pond (S-004I)](../../specs/S-004I-template-release-proof-puffer-pond/SPEC.md),
  which is planned, with its cloud form and script still open. The same
  decision still quotes an older verb list that the owner has since changed, and
  it needs a visible correction by its owner.
- **The v3.2.0 release record is not closed.** The card ties the v3.2 claim to
  [Workbench Release (S-050)](../../specs/S-050-workbench-v3-2-0-release/SPEC.md),
  whose own record is still active with a final-readiness blocker, so this page
  does not call that release delivered.
- **Stale counts.** The fixture card names a twelve-skill brand-new-install
  contract; the manifest's required skill list has since grown, so that number
  describes the Spec of its time ([Portable Workbench (S-021)](../../specs/S-021-portable-workbench-v3/SPEC.md)).

## Where the work lives

The upgrade gate is a producer-only rule in the
[Template Upgrade Release Gate of AGENTS](../../../AGENTS.md#template-upgrade-release-gate), whose
procedure is in the [Runbook](../../../RUNBOOK.md#template-upgrade-release-gate), and it is
owned by [Template Upgrade Release Gate (S-00F)](../../specs/S-00F-template-upgrade-release-gate/SPEC.md)
([Wiki page](../features/named-template-upgrade-release-gate.md)). The staged
Specs are [Workbench Template Reformation (S-00B)](../../specs/S-00B-workbench-template-reformation/SPEC.md)
([Wiki page](../features/copyable-workbench-template-reference-room.md)), the three
Specs named above, and [Workbench Release (S-050)](../../specs/S-050-workbench-v3-2-0-release/SPEC.md).
The fixtures belong to [Portable Workbench (S-021)](../../specs/S-021-portable-workbench-v3/SPEC.md)
and its [manifest](../../manifest.json). Related decisions:
["Preservation contracts for genesis, adoption and upgrade"](../../docs/adr/0047-preservation-contracts-for-genesis-adoption-and-upgrade.md)
and ["LLM Workbench is the sole Workbench source; Foundry is a downstream extension"](../../docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md).

## Evidence and Sources

- [Workbench Template landmark record (LMK-000V)](../../landmark-tracker/landmarks/LMK-000V.json): title, summary and importance.
- The four question cards named above, each at the revision cited.
- The decisions and Specs linked under "Where the work lives".

## History

- 2026-10-04: created by the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages), seeded from the cards' current answers.

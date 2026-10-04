---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Seeded from the current answers of the Workbench Updates landmark's question cards (landmark record revision 1), 2026-10-04
source_paths:
  - workbench/landmark-tracker/landmarks
  - workbench/landmark-tracker/destination-questions
  - workbench/docs/adr/0055-workbench-update-requires-self-drift-check.md
  - workbench/docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md
  - workbench/docs/adr/0047-preservation-contracts-for-genesis-adoption-and-upgrade.md
parent: none
authorized_by: the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages)
last_verified: 2026-10-04
---

# Landmark: Workbench Updates

This page is the evolving synthesis of the Workbench Updates landmark
(landmark ["Workbench Updates" (LMK-000G)](../../landmark-tracker/landmarks/LMK-000G.json)).
It sums up, in prose, what the landmark's fifteen question cards currently say
about how a room receives improvements, and is updated whenever one of them
changes. The cards and the landmark record keep the structured account and the
lineage. The decision records, the Runbook and the Specs named below govern.
There is no deeper concept article for this landmark yet; the nearest are
[Idea to delivery](idea-to-delivery-workflow.md) for where releases sit in the
workflow and [Decision records and the concept map](decision-records-and-the-concept-map.md).

## What the landmark is

A Workbench room should receive improvements from the upstream LLM Workbench
without losing its own choices, and the producer itself must stay honest about
its own state while it ships them. The landmark covers the version contract, how
skills travel with a release, how local differences from the upstream baseline
are classified, which route a room takes (new, adopted, upgraded), how a layout
migration stays recoverable, how drift in the upstream's own current-facing
claims is repaired, and what a release must prove.

Each card below says its source answers were settled by the owner in earlier
grilling sessions; the card's own grouping, title and synthesis are agent work
and not separately owner-confirmed. Many cards record decisions from the v3
release cycle, so they are best read as the accepted rules behind that cycle.

## Current accepted answers

- **Versions and the bundle.** Moving stable support paths and changing skill
  installation ownership is a major layout contract, so the breaking support-path
  move is the v3 line
  (card [DQC-000T: "Which layout changes require a new version contract?"](../../landmark-tracker/destination-questions/DQC-000T.json), revision 7).
  The checked-out Workbench release owns the bundled core skill versions; there
  is no separate skill release or second publication gate
  (card [DQC-000X: "How do skill versions relate to Workbench releases?"](../../landmark-tracker/destination-questions/DQC-000X.json), revision 10).
  The owner chose to bump to v3.1.3 and freeze v3.1.2 at its sixteen-skill
  policy, because rooms were already running v3.1.2
  (card [DQC-000T: "Which layout changes require a new version contract?"](../../landmark-tracker/destination-questions/DQC-000T.json), revision 7;
  card [DQC-005N: "How should release identities preserve earlier evidence and bundle history?"](../../landmark-tracker/destination-questions/DQC-005N.json), revision 7).
  The layout tool still carries that frozen entry and a separate v3.1.3 entry,
  and the manifest has since moved on to v3.2.1, so these cards describe an
  earlier release point.
- **Updates preserve local content.** Normal setup is presence-only and never
  compares or replaces content; only an explicitly authorized skill update
  backs up changed content and converges the required core to the bundled
  versions. Core skills live in each room's skills lane and are replaced only by
  the ordinary Workbench update
  (card [DQC-000Z: "How should skill updates preserve locally changed content?"](../../landmark-tracker/destination-questions/DQC-000Z.json), revision 9;
  [Decision record "Core skills ship in the workbench skills lane"](../../docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md);
  the installer is `tools/workbench-skills.mjs`).
- **Ownership origins and divergence.** There are two ownership origins
  (upstream Workbench and project-local) and three classifications (portable
  invariants and defaults, project bindings, optional extensions). A deliberate
  change to a baseline assignment is divergence and needs an explicit
  disposition; an added row is only a mechanical comparison fact
  (card [DQC-001S: "How should upstream and project-local ownership origins be represented?"](../../landmark-tracker/destination-questions/DQC-001S.json), revision 6).
  The owner chose that a legacy row that differs from upstream with no authored
  intent is a conflict until intent is declared, accepting that a legacy room's
  first upgrade stops on each such row
  (card [DQC-001T: "How should differences from the upstream ownership baseline be classified?"](../../landmark-tracker/destination-questions/DQC-001T.json), revision 8).
- **Routes do not substitute.** Genesis creates a greenfield Workbench, Adoption
  migrates an unmanaged project once, and the update route upgrades an already
  adopted project; none substitutes for another
  (card [DQC-004V: "How should a request choose between Genesis, Adoption and update?"](../../landmark-tracker/destination-questions/DQC-004V.json), revision 6;
  [Decision record "Preservation contracts for genesis, adoption and upgrade"](../../docs/adr/0047-preservation-contracts-for-genesis-adoption-and-upgrade.md)).
  A layout migration is one-time and recoverable: record the pre-migration Git
  recovery point, back up every retired path before removal, verify the new
  paths and references, leave no unattributed dirty residue
  (card [DQC-005C: "What makes a layout migration recoverable?"](../../landmark-tracker/destination-questions/DQC-005C.json), revision 7).
  The upgrade tool is `tools/workbench-upgrade.mjs` and the procedure is in the
  Runbook.
- **Repair the producer's own drift first.** Before claiming a release
  candidate, repair the current integration baseline and preserve historical
  evidence: supersede obsolete ownership through a new linked record instead of
  rewriting completed evidence, correct a stale claim with one correcting row,
  and apply the ownership and routing repair across the whole upstream source
  and templates, with downstream rooms getting it only through their own explicit
  update
  (card [DQC-005D: "How should an update reconcile the producer’s current-facing drift?"](../../landmark-tracker/destination-questions/DQC-005D.json), revision 9).
  A broken verification baseline is repaired first, before broader behavior
  changes
  (card [DQC-005F: "How should a broken verification baseline be handled before broader changes?"](../../landmark-tracker/destination-questions/DQC-005F.json), revision 6),
  and an obsolete unmerged candidate is replaced by rebuilding only still-useful
  intent on current integration, then closing the old pull request
  (card [DQC-005E: "How should obsolete unmerged candidates be replaced safely?"](../../landmark-tracker/destination-questions/DQC-005E.json), revision 5).
  The standing rule that every update also checks the Workbench itself for drift
  is [Decision record "Workbench updates require a Workbench self-drift check"](../../docs/adr/0055-workbench-update-requires-self-drift-check.md),
  owned by [Workbench Self-Drift Check On Update (S-00K)](../../specs/S-00K-workbench-self-drift-check/SPEC.md).
- **Downstream rooms are updated only on the owner's request.** LLM Workbench
  owns no portfolio rollout, automatic propagation or monitoring suite; a real
  project is updated only when the owner points the Workbench at it and asks
  (card [DQC-005G: "When is a downstream room update authorized?"](../../landmark-tracker/destination-questions/DQC-005G.json), revision 6).
- **What a release must prove.** Each Workbench version is proved by updating
  the Workbench Template to that version, the producer's release gate. For v3.2
  it is enough that the Template updates successfully; Genesis seeding a starting
  Blueprint, prepared project grilling and personalization are future
  capabilities and must not be claimed
  (card [DQC-005H: "What real Template upgrade must each Workbench version prove?"](../../landmark-tracker/destination-questions/DQC-005H.json), revision 8).
  A readiness question authorizes an independent review and a verdict only, never
  a merge or publication; only the owner merges integration to main
  (card [DQC-004H: "What does a release-readiness review establish and authorize?"](../../landmark-tracker/destination-questions/DQC-004H.json), revision 9).
- **Older commitments.** Scaffolding such as Specs, Tasks, question cards, notes
  and handoffs is transient; obsolete release promises become historical, while
  still-needed obligations stay reachable until resolved, and existing decisions
  are corrected rather than duplicated. The v3 runway stays in the single public
  repository from current integration and keeps the owner-only promotion gate
  (card [DQC-005P: "Which older release and continuity commitments remain live obligations?"](../../landmark-tracker/destination-questions/DQC-005P.json), revision 17).

## Open and unresolved

- Where a divergence disposition and any authorizing decision citation live, in
  the ownership map or in the owning decision or report, was not covered by the
  owner's answer; the Spec's recommendation to keep it outside the map stays a
  recommendation
  (card [DQC-001T: "How should differences from the upstream ownership baseline be classified?"](../../landmark-tracker/destination-questions/DQC-001T.json), revision 8).
- Inference: the row-keyed comparator, the ownership map and the primary and
  supporting relationship fields are accepted design, not delivered behavior;
  [Ownership Map Root Control (S-00G)](../../specs/S-00G-ownership-map-root-control/SPEC.md)
  owns them and nothing here claims them built.
- Genesis seeding a Blueprint, prepared grilling and fresh-copy personalization
  are explicitly future capabilities
  (card [DQC-005H: "What real Template upgrade must each Workbench version prove?"](../../landmark-tracker/destination-questions/DQC-005H.json), revision 8).
- Whether the obsolete pull request was actually closed is not verified here; the
  card records only the rule
  (card [DQC-005E: "How should obsolete unmerged candidates be replaced safely?"](../../landmark-tracker/destination-questions/DQC-005E.json), revision 5).
- Inference: the v3.1.2, v3.1.3 and v3.2 release details in the cards are
  time-bound. The manifest and the layout tool now carry later versions, so
  treat those details as historical until the cards are refreshed.
- The v4 build order and the stance-skill build the last card lists are planned
  work owned by their Specs, not delivered claims
  (card [DQC-005P: "Which older release and continuity commitments remain live obligations?"](../../landmark-tracker/destination-questions/DQC-005P.json), revision 17).

## Where the work lives

Release and layout delivery:
[S-021: Portable Workbench v3](../../specs/S-021-portable-workbench-v3/SPEC.md),
[Portable Workbench (S-00V)](../../specs/S-00V-portable-workbench/SPEC.md),
[Core Skill Ownership And Compatibility (S-051)](../../specs/S-051-core-skill-ownership-and-compatibility/SPEC.md),
[Assignment Ownership And The Coordination Record (S-049)](../../specs/S-049-assignment-ownership-and-coordination-record/SPEC.md),
[v3.1.2 Follow-Ups Left Without An Owner (S-045)](../../specs/S-045-v3-1-2-follow-ups/SPEC.md),
[S-027: Workbench Boundaries (v3.1.1)](../../specs/S-027-workbench-v3-1-1-boundaries/SPEC.md),
[Workbench Release Candidate (S-014)](../../specs/S-014-workbench-release-candidate/SPEC.md) and
[S-050: Workbench Release (v3.2.0)](../../specs/S-050-workbench-v3-2-0-release/SPEC.md).
The release gate and Template: [Template Upgrade Release Gate (S-00F)](../../specs/S-00F-template-upgrade-release-gate/SPEC.md)
and [Workbench Template Reformation (S-00B)](../../specs/S-00B-workbench-template-reformation/SPEC.md).
Self-drift: [Workbench Self-Drift Check On Update (S-00K)](../../specs/S-00K-workbench-self-drift-check/SPEC.md) and the tool
[self-drift.mjs](../../tools/self-drift.mjs). The Blueprint and ownership
rebuild: [Blueprint, Active ADR, And Context Map Rebuild (S-00A)](../../specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md) and [Ownership Map Root Control (S-00G)](../../specs/S-00G-ownership-map-root-control/SPEC.md).
Decisions: [Decision record "Workbench updates require a Workbench self-drift check"](../../docs/adr/0055-workbench-update-requires-self-drift-check.md),
[Decision record "Core skills ship in the workbench skills lane"](../../docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md) and
[Decision record "Preservation contracts for genesis, adoption and upgrade"](../../docs/adr/0047-preservation-contracts-for-genesis-adoption-and-upgrade.md).
The procedures live in the Runbook's Template Upgrade Release Gate and its
explicit upgrade check ([RUNBOOK.md](../../../RUNBOOK.md)).

## Related pages

[Landmark: GitHub Coordination](landmark-github-coordination.md) shows the same
page shape; [Roles and stances](roles-and-stances.md) covers the stance skills
the last card mentions.

## Evidence and Sources

- landmark ["Workbench Updates" (LMK-000G)](../../landmark-tracker/landmarks/LMK-000G.json): title, summary, importance and history.
- The fifteen question cards named above, each at the revision cited.
- The layout tool [workbench-layout.mjs](../../tools/workbench-layout.mjs) and
  the manifest [manifest.json](../../manifest.json), read on 2026-10-04 for the
  version points above.

## History

- 2026-10-04: created by the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages), seeded from the cards' current answers.

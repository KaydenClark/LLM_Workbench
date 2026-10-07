---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Seeded from the current answers of the Portable Workbench landmark's question cards (landmark record revision 1), 2026-10-04
source_paths:
  - workbench/landmark-tracker/landmarks
  - workbench/landmark-tracker/destination-questions
  - workbench/docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md
  - workbench/specs/S-00V-portable-workbench/SPEC.md
parent: none
authorized_by: the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages)
last_verified: 2026-10-04
---

# Landmark: Portable Workbench

This page is the evolving synthesis of the Portable Workbench landmark
(landmark ["Portable Workbench" (LMK-000B)](../../landmark-tracker/landmarks/LMK-000B.json)).
It sums up what the landmark's fifteen question cards currently say, in prose,
and is updated whenever one of them changes. The cards and the landmark record
keep the structured account and the lineage; the delivering decisions and Specs
govern. Every card's source answers were settled by the owner in grilling
sessions; the grouping and synthesis inside each card is agent work, not
separately owner-confirmed, and this page keeps that distinction.

## What the landmark is

A fresh agent can clone a room, find what it needs there, complete authorized
work and leave a recoverable result. The owner's plain definition is "a fully
packaged and deployable agentic harness": everything an agent needs is in the
Git repository, so any agent, or several at once in the cloud, can clone it,
do authorized work, push, and clean up after itself. The landmark matters
because the harness was portable in name only while skills, notes and
operating knowledge lived in the owner's home directory and personal catalog.

## Current accepted answers

- **What a room must carry**
  (card [DQC-000I: "What must a room carry so an agent can work from a fresh clone?"](../../landmark-tracker/destination-questions/DQC-000I.json), revision 6).
  Everything the agent needs is in the repository, and the success criterion
  includes "cleaning up after itself". The three renames are accepted:
  support-root layout, host portability and the ownership origin model. The
  bundle is the complete current setup and the grilling-to-implementation
  workflow, not merely a template-only setup.
- **Skills live in the room.**
  Card [DQC-000F: "Where should the authoritative skill copies for a room live?"](../../landmark-tracker/destination-questions/DQC-000F.json), revision 8,
  records that core skills are tracked in every room under the skills lane and
  replaced only by the ordinary Workbench update, with no provider home,
  personal catalog or bootstrap on the critical path. Card
  [DQC-000P: "How should support lanes and their collections be organized?"](../../landmark-tracker/destination-questions/DQC-000P.json), revision 6,
  records the move of the producer's skill source from a root directory into
  the lane, with a leftover root skills directory reported as a doctor
  finding. Card
  [DQC-000V: "How should supported providers discover the room’s skills?"](../../landmark-tracker/destination-questions/DQC-000V.json), revision 8,
  adds that the four stances (Builder, Auditor, Reviewer, Reconciler) ship as
  portable skills in the same bundle, that loading a stance never spawns an
  agent, and that cross-provider discovery is kept. The decision record
  ["Core skills ship in the workbench skills lane"](../../docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md)
  is the accepted home of all of this, and the stance rule lives in
  ["Assigned portable stances change method, not authority"](../../docs/adr/0036-stances-change-method-not-authority.md).
- **The personal catalog stays optional.**
  Card [DQC-000J: "Which dependencies must remain optional for a room to function?"](../../landmark-tracker/destination-questions/DQC-000J.json), revision 9,
  says a fresh room works without the owner's private skills repository: setup
  completes from public Workbench-owned templates, tools and skills, and no
  substitution contract exists. The private repository is only a backup and a
  place a room may publish skills it creates.
- **The manifest is the one machine-readable authority.**
  Card [DQC-000Q: "What does the manifest declare authoritatively for tools?"](../../landmark-tracker/destination-questions/DQC-000Q.json), revision 7,
  makes the committed manifest the single authority for layout, version,
  provenance and support-lane paths; copied document stamps are projections
  that must agree with it. Card
  [DQC-000R: "How should tools and skills resolve relocated support paths?"](../../landmark-tracker/destination-questions/DQC-000R.json), revision 6,
  has every core skill that touches support records resolve the path through
  the manifest, and Genesis writes only the current layout while Adoption and
  update recognize legacy inputs once and migrate them. Card
  [DQC-000S: "How can an empty declared collection remain visible without implying content?"](../../landmark-tracker/destination-questions/DQC-000S.json), revision 6,
  has the manifest declare every lane, with a minimal tracked placeholder
  that never implies a record exists, and readiness requires the first
  durable Spec. The schema decision is
  ["Manifest schema 2 declares six lanes and every machine-used collection"](../../docs/adr/0032-manifest-schema-2-declares-lanes-and-collections.md).
- **The source room proves what it ships.**
  Card [DQC-000U: "How does the source Workbench prove it uses the same layout it distributes?"](../../landmark-tracker/destination-questions/DQC-000U.json), revision 7,
  moves this repository's own support records under the support root with
  history preserved, and puts the comprehensive ownership and routing repair
  in the v3.2 release scope; downstream rooms receive it only through their
  own explicit update.
- **Host knowledge goes in the Wiki.**
  Card [DQC-000L: "Where must host-specific knowledge live when another instance needs it?"](../../landmark-tracker/destination-questions/DQC-000L.json), revision 5:
  owner-machine-only truth that a cloud agent would need belongs in the room's
  Wiki, not host memory, which stays a per-machine convenience the Workbench
  never depends on. The decision record
  ["The Wiki is the evolving synthesis every agent reads and updates"](../../docs/adr/000R-the-wiki-is-the-evolving-synthesis-every-agent-reads-and-updates.md)
  now says the Wiki holds evolving synthesis, not only confirmed
  understanding, and names the name-and-context identifier rule; it revises
  how this card's destination reads without contradicting it.
- **A minimum host floor and visible gaps.**
  Cards [DQC-002X: "What is the minimum host capability floor?"](../../landmark-tracker/destination-questions/DQC-002X.json), revision 5, and
  [DQC-002Y: "How should missing host or Task capabilities become visible to the owner?"](../../landmark-tracker/destination-questions/DQC-002Y.json), revision 7,
  record the owner's instruction that a missing capability flags the Task as
  blocked or needing review so it shows up in a situation report. The
  mechanics were delegated: the floor is Node 18+, Python 3.9+, git, an
  authenticated `gh` with push rights and GitHub network, checked at session
  start, and everything else is optional and named by the Task. The owner also
  confirmed that a situation-report skill returns, reading the generated
  board, and reports in order what needs the owner's review, what the owner
  can unblock, what is in progress and what is to do, in plain language rather
  than bare identifiers.
- **Root surface.**
  Card [DQC-000O: "Which artifacts need to be discoverable at the room root?"](../../landmark-tracker/destination-questions/DQC-000O.json), revision 9,
  still records the seven-file root of its earliest answer, then the later
  owner answers: an eighth root file, the ownership map, as a routing artifact
  outside the Contract, and a generated JSON board replacing the Markdown
  Taskboard, with the accepted eight-file destination allowed to lead the
  current implementation. The accepted decision is
  ["The Workbench root surface is eight files and Contract membership is separate from root placement"](../../docs/adr/000B-the-workbench-root-surface-is-eight-files-and-contract-membership-is-separate-from-root-placement.md),
  which supersedes the earlier seven-file record. See the Ownership Model
  synthesis, [Landmark: Ownership Model](landmark-ownership-model.md).
- **Proof.**
  Card [DQC-005I: "Which focused fixtures demonstrate the portable layout and preservation seams?"](../../landmark-tracker/destination-questions/DQC-005I.json), revision 7,
  requires focused red/green fixtures plus real Genesis and Adoption exercises,
  a v2 upgrade migration fixture, and cases for valid and invalid manifests,
  legacy-path migration, missing-skill install, existing-skill preservation,
  authorized update with backup, project-local shadows, conflicting
  destinations and portable path handling. Card
  [DQC-005M: "What proves a cloud or parallel-instance run is portable end to end?"](../../landmark-tracker/destination-questions/DQC-005M.json), revision 8,
  records the owner's "End clean up", and the push-the-claim choice: `claim`
  creates the Task branch from the integration branch, commits the claim first
  and pushes at once, while selection fetches every remote and overlays Task
  state from every remote tip. The accepted record is
  ["Claims are pushed on the task branch and read from every remote tip"](../../docs/adr/000O-claims-are-pushed-on-the-task-branch-and-read-from-every-remote-tip.md).

## Open and unresolved

- Inference: the card for end-to-end proof records "a run that ends clean" as
  the agent's interpretation of the owner's words. The proposed extension of
  the round-trip test, one real cloud session and a two-instance parallel run
  are agent-derived demos, not owner-confirmed proof criteria.
- The specific list of non-core skills that join the lane was never confirmed;
  the owner chose only that needed skills are included and the private
  repository is a backup and publication target.
- Pushed Task-branch claims are the accepted v4 claim mechanism, but the
  proposed decision record
  ["GitHub Issues are the required live coordination authority"](../../docs/adr/proposed/000Q-github-issues-are-the-required-live-coordination-authority.md)
  would supersede them at a separately reviewed cutover; see
  [Landmark: GitHub Coordination](landmark-github-coordination.md).
- The root-surface answer is a destination that leads the files: this tree
  still has no ownership map file or generated JSON board at the root, and the
  situation-report skill is not in the skills lane. Those depend on the
  [Ownership Map Root Control Spec (S-00G)](../../specs/S-00G-ownership-map-root-control/SPEC.md)
  and the [Generated JSON Taskboard Spec (S-01X)](../../specs/S-01X-generated-json-taskboard/SPEC.md).
- Stale wording to correct, not a conflict in the decisions: the manifest
  schema decision's title says six lanes while the skills-lane decision made
  it seven; the skill counts the cards quote (twelve core skills, a
  twenty-one-skill source) are historical and the lane now holds more.
- The decision record
  ["Landmarks are LANDMARK.md artifacts one size above Specs"](../../docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md)
  retires the JSON landmark record in favor of LANDMARK.md and the cards; the
  record cited here is the current form until that migration lands.
- Two things not verified here: whether the host-floor check matches the
  smaller five-check baseline in
  ["Minimum configured-host capability and evidence boundaries"](../../docs/adr/0053-minimum-configured-host-capability-and-evidence-boundaries.md),
  and whether the round-trip test already includes the extension described
  above.

## Where the work lives

The Spec [Portable Workbench (S-00V)](../../specs/S-00V-portable-workbench/SPEC.md)
owns the lane build, the push-on-claim slice, the host-floor check and the
catalog and Wiki audits; read it for current state. The earlier delivery was
[S-021 "Portable Workbench v3"](../../specs/S-021-portable-workbench-v3/SPEC.md)
and the v3.2.0 [Workbench Release (S-050)](../../specs/S-050-workbench-v3-2-0-release/SPEC.md).
Controls and tools: [manifest](../../manifest.json), the
[layout reader](../../tools/workbench-layout.mjs),
[path reader](../../tools/workbench-paths.mjs),
[skills lane tool](../../../tools/workbench-skills.mjs) and
[host-floor check](../../tools/host-floor.mjs); the room's operations live in
[RUNBOOK](../../../RUNBOOK.md) and its terms in [GLOSSARY](../../../GLOSSARY.md).

## Related pages

- [Landmark: Ownership Model](landmark-ownership-model.md)
- [Landmark: GitHub Coordination](landmark-github-coordination.md)
- [Roles and stances](roles-and-stances.md)
- [Landmark Tracker](landmark-tracker.md)

## Evidence and Sources

- [Landmark record "Portable Workbench" (LMK-000B)](../../landmark-tracker/landmarks/LMK-000B.json): title, summary, importance and history.
- The fifteen question cards named above, each at the revision cited: they hold the answers, the confirmation basis, the open uncertainties and the expected homes this page summarizes.

## History

- 2026-10-04: created by the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages), seeded from the cards' current answers.
- 2026-10-07: Re-pointed the retiring Lexicon's links and live routes to `GLOSSARY.md`, `ARCHITECTURE.md` and the Wiki lexicon articles (the Lexicon Retirement Spec (S-004O), its consumer re-pointing Task (TK-009F)); no claim changed.

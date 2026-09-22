# S-00V - LLM Workbench Skills Wiki

**Spec ID:** S-00V
**Status:** planned
**Priority:** 2
**Owner:** Kayden
**Stance:** Builder
**Updated:** 2026-09-21
**Catalog description:** Give the LLM Workbench a readable, source-linked Wiki article for each current core skill and visibly compare shared concepts with Matt Pocock's pinned sources.
**Blockers:** Owner review of this planning packet before implementation begins.
**Latest event:** Specification and source comparison captured for owner review.
**Next gate:** Owner reviews the article contract, comparison dispositions, and implementation slices, then activates the first approved Task.

> **Citation anchors.** pre=`03b23320fbc9bb25ca387d36b8b006ea00eedf08` post=`03b23320fbc9bb25ca387d36b8b006ea00eedf08`.

## Outcome

The LLM Workbench Wiki contains one readable, Obsidian-compatible Markdown
article for each of the 21 current Workbench core skills. An owner or agent can
start at `workbench/wiki/MEMORY.md`, find the skill by its current name, and
understand its purpose, use cases, operating shape, inputs and outputs,
observable completion, limits, composition, and source ownership without first
reading `SKILL.md`.

Each article links to the executable source and its governing controls rather
than replacing them. Skills with a verified Matt Pocock counterpart or shared
source concept carry a visible, source-backed relationship disposition. A
conceptual departure remains visible as drift even when a local accepted
decision explains it.

## Why It Matters

The executable core is deliberately terse and optimized for agent behavior.
That makes it a poor first reference for an owner deciding which skill fits,
an agent composing existing skills, or a contributor learning how the
Workbench writes skills. The current catalog gives only one sentence per skill;
the globally installed catalog can also contain unrelated personal and plugin
skills. A Workbench-owned reference library closes that comprehension gap
without turning documentation into instruction authority or adding a second
skill catalog.

The upstream relationship also needs an inspectable boundary. The Workbench
began from selected Matt Pocock sources, then rewrote them around the Workbench
Contract and lifecycle. Name equality alone now hides meaningful differences,
while different names can preserve the same core concept. A pinned comparison
lets the articles explain that history honestly without silently repairing or
normalizing either source.

## Current Verified State

- `workbench/manifest.json` and `skills/README.md` both declare the same closed
  21-skill bundle: seventeen workflow skills and four stance skills. The only
  supporting file below those canonical skill directories is
  `skills/handoff/assets/HANDOFF.md`. The manifest, catalog, and file inventory
  were read at the pre anchor.
- `checkpoint` is a current compatibility notice for retired checkpoint
  copying, not an active copying workflow. The four current stance entries are
  `builder`, `auditor`, `reviewer`, and `reconciler`; their stance status must
  be explained accurately without inventing a role taxonomy.
- `skills-archive/optional-active-2026-09-01/` contains five preserved optional
  sources and `skills-pending/` contains sixteen preserved rewrite sources.
  Neither participates in the current bundle. User-global discovery entries,
  provider/plugin skills, installed copies, and downstream room-local skills
  likewise do not establish LLM Workbench Wiki coverage.
- `workbench/wiki/SCHEMA.md` permits flat notes beside `MEMORY.md`, requires
  `MEMORY.md` to be the only router, forbids category indexes, and allows
  ordinary Markdown with optional Obsidian wikilinks. The smallest compatible
  route is therefore 21 flat `skill-<name>.md` notes and one Skills Reference
  section in `MEMORY.md`; no new collection or schema change is required.
- `workbench/wiki/MEMORY.md` has no Skills Reference route. The Wiki contains
  no current skill articles, and no existing Spec owns this capability.
  S-025 owns the portable Wiki contract, S-051 owns core skill identity and
  compatibility, S-00R owns current lifecycle/source-disposition work, and the
  retired S-011 preserves the original adoption/rewrite evidence. This Spec
  links to those owners without reopening their scope.
- AI Hero's Skills page and the representative `to-spec`, `implement`,
  `code-review`, and `grilling` pages were accessed on 2026-09-21. The article
  pattern consistently uses purpose, reach conditions, prerequisites where
  relevant, a tailored explanation of the mechanism, common questions,
  observable signs that the skill works, placement in the larger flow, and
  related reading. Direct HTTP retrieval succeeded; the browser extraction
  endpoint returned no content, so no browser-rendering claim is made.
- Matt Pocock's source was verified at immutable commit
  `c55ee46073ed923f86ce59a5eb3b6d895095d1b7` dated 2026-09-18. Exact current
  name overlaps are `code-review`, `grilling`, `handoff`, `implement`, and
  `to-spec`; local `to-tasks` maps by source history and purpose to upstream
  `to-tickets`; local `tracer-bullet` extracts the vertical-slice discipline
  embedded in `to-tickets`. No other current Workbench skill has a supported
  upstream counterpart in that snapshot.
- The pre-change Workbench self-drift receipt at the pre anchor reported
  `machineResult: blocked` and `cleanUpdate: false` because of pre-existing
  installed-core incompatibility, missing installed `to-tasks`, stale seed,
  stale claim, and provenance findings. None blocks specification selection;
  none is repaired or reclassified by this Spec.

## Included Skill Inventory

Every included row is required by both
`03b23320fbc9bb25ca387d36b8b006ea00eedf08:workbench/manifest.json` and the
core catalog at
`03b23320fbc9bb25ca387d36b8b006ea00eedf08:skills/README.md`. `Canonical source`
is executable Actuality; `Article` is the future curated reference note.

| Skill | Canonical source and supporting files | Lifecycle / ownership | Alias or lineage note | Article |
|---|---|---|---|---|
| `adoption` | `skills/adoption/SKILL.md` | active workflow; LLM Workbench core | no current alias | `workbench/wiki/skill-adoption.md` |
| `checkpoint` | `skills/checkpoint/SKILL.md` | compatibility notice; LLM Workbench core | retired copying workflow, current routing notice | `workbench/wiki/skill-checkpoint.md` |
| `code-review` | `skills/code-review/SKILL.md` | active workflow; LLM Workbench core | current upstream name match | `workbench/wiki/skill-code-review.md` |
| `genesis` | `skills/genesis/SKILL.md` | active workflow; LLM Workbench core | no current alias | `workbench/wiki/skill-genesis.md` |
| `grilling` | `skills/grilling/SKILL.md` | active workflow primitive; LLM Workbench core | current upstream name match; local wrappers/history are not aliases | `workbench/wiki/skill-grilling.md` |
| `implement` | `skills/implement/SKILL.md` | active workflow; LLM Workbench core | current upstream name match | `workbench/wiki/skill-implement.md` |
| `make-it-so` | `skills/make-it-so/SKILL.md` | active composition workflow; LLM Workbench core | no supported upstream counterpart | `workbench/wiki/skill-make-it-so.md` |
| `to-docs` | `skills/to-docs/SKILL.md` | active workflow; LLM Workbench core | no supported upstream counterpart | `workbench/wiki/skill-to-docs.md` |
| `to-spec` | `skills/to-spec/SKILL.md` | active workflow; LLM Workbench core | current upstream name match | `workbench/wiki/skill-to-spec.md` |
| `to-tasks` | `skills/to-tasks/SKILL.md` | active workflow; LLM Workbench core | renamed from local `to-tickets`; upstream counterpart remains `to-tickets` | `workbench/wiki/skill-to-tasks.md` |
| `tracer-bullet` | `skills/tracer-bullet/SKILL.md` | active workflow primitive; LLM Workbench core | extracts a concept embedded in upstream `to-tickets`; not a name match | `workbench/wiki/skill-tracer-bullet.md` |
| `update-harness` | `skills/update-harness/SKILL.md` | active workflow; LLM Workbench core | no supported upstream counterpart | `workbench/wiki/skill-update-harness.md` |
| `carry` | `skills/carry/SKILL.md` | active workflow; LLM Workbench core | no supported upstream counterpart | `workbench/wiki/skill-carry.md` |
| `notepad` | `skills/notepad/SKILL.md` | active continuity primitive; LLM Workbench core | no supported upstream counterpart | `workbench/wiki/skill-notepad.md` |
| `save` | `skills/save/SKILL.md` | active persistence primitive; LLM Workbench core | no supported upstream counterpart | `workbench/wiki/skill-save.md` |
| `promote` | `skills/promote/SKILL.md` | active reconciliation primitive; LLM Workbench core | no supported upstream counterpart | `workbench/wiki/skill-promote.md` |
| `handoff` | `skills/handoff/SKILL.md`; `skills/handoff/assets/HANDOFF.md` | active continuity workflow; LLM Workbench core | current upstream name match | `workbench/wiki/skill-handoff.md` |
| `builder` | `skills/builder/SKILL.md` | active stance skill; LLM Workbench core | stance, not a new role category | `workbench/wiki/skill-builder.md` |
| `auditor` | `skills/auditor/SKILL.md` | active stance skill; LLM Workbench core | stance, not a new role category | `workbench/wiki/skill-auditor.md` |
| `reviewer` | `skills/reviewer/SKILL.md` | active stance skill; LLM Workbench core | stance, not a new role category | `workbench/wiki/skill-reviewer.md` |
| `reconciler` | `skills/reconciler/SKILL.md` | active stance skill; LLM Workbench core | stance, not a new role category | `workbench/wiki/skill-reconciler.md` |

### Explicit exclusions

- Preserved sources under `skills-archive/` and `skills-pending/`, including
  `writing-great-skills`, receive no current-skill article.
- Installed copies under user discovery roots, personal/global skills, plugin
  skills, and provider catalogs do not expand the inventory.
- Templates and consumer rooms receive no copy, route, collection, or article.
- Historical names are mentioned only where they explain a current skill's
  lineage. A historical name does not create a second article.

## Upstream Concept Comparison

The upstream source column reads at Matt Pocock commit
[`c55ee46073ed923f86ce59a5eb3b6d895095d1b7`](https://github.com/mattpocock/skills/tree/c55ee46073ed923f86ce59a5eb3b6d895095d1b7).
The website pages are editorial evidence accessed 2026-09-21; executable local
behavior is governed by the Workbench source, not the website.

| Workbench skill / upstream source | Matt's core purpose | Workbench observed purpose and local adaptation | Disposition | Conceptual effect and smallest response |
|---|---|---|---|---|
| `code-review` / `skills/engineering/code-review` | Review a fixed diff on separate Standards and Spec axes and keep the results distinct. | Reviews immutable base/head content against the repository contract and assigned capability contract; adds Workbench review gates and evidentiary categories, while no longer requiring parallel subagents or the fixed Fowler smell list. | adapted with core preserved | The two-axis check remains recognizable, but context isolation and the upstream smell baseline are not promised. State the adaptation and local gate in the article; propose no source repair. |
| `grilling` / `skills/productivity/grilling` | Traverse a decision tree by asking the whole currently unblocked frontier in rounds; research facts, leave decisions to the user, and stop at shared understanding. | Traverses the same decision tree, researches facts, preserves owner decisions in a notepad, and stops before action, but explicitly asks one question at a time. | **conceptual drift** | The upstream frontier/round mechanism and its lower round count are absent. S-011/TK-005 records the accepted one-question-at-a-time local direction, which explains but does not erase the change. Flag this visibly in the article and leave repair to a separate owner decision. |
| `handoff` / `skills/productivity/handoff` | Compact the current conversation into a sensitive-data-safe document another agent can continue from, referencing existing durable artifacts. | Authors a scope-preserving Markdown handoff in the manifest collection, carries corrections and access limits, declares notepad retention dependencies, and treats authorship as distinct from sending or execution. | adapted with core preserved | The continuation idea survives; temp-directory storage and a generic suggested-skills section do not. Explain the Workbench durability/authority boundary and its source owner. |
| `implement` / `skills/engineering/implement` | Build already-decided work with TDD at agreed seams, typecheck, review, and commit. | Implements one eligible Workbench Task with red/green TDD, exact state ownership, documentation, review, closeout, and remote recovery. | adapted with core preserved | The build chain remains recognizable; the Workbench adds a task lifecycle and a stronger delivery boundary. Explain the extra gates rather than claiming byte fidelity. |
| `to-spec` / `skills/engineering/to-spec` | Synthesize an already-settled conversation into one spec without restarting the interview, using project vocabulary and agreed test seams. | Reuses or creates one manifest-resolved stable Spec, reconciles correction-aware context, records acceptance/evidence, and publishes no external tracker item. | adapted with core preserved | The stable decision record remains; issue-tracker publication and exhaustive user stories are intentionally absent. Link the no-governance-tax and Spec ownership controls. |
| `to-tasks` / `skills/engineering/to-tickets` | Cut a spec or plan into one-context tracer-bullet slices with explicit blocking edges, then publish approved units to a tracker. | Cuts an assigned Spec into dependency-aware Workbench Tasks owned by that Spec, allocates visible IDs, renders the Taskboard projection, and publishes no parallel tracker. | adapted with core preserved | The name and persistence owner changed under ADR-000H, while vertical slicing, one-context sizing, approval, and blockers remain. Explain the rename and do not present `to-tickets` as a callable alias. |
| `tracer-bullet` / concept inside `skills/engineering/to-tickets` | Define narrow, complete, independently demonstrable slices across every relevant layer, with expand-contract for wide changes. | Extracts that slicing discipline into a reusable primitive that maps the project's real layers and hands approved slices to `to-tasks`. | adapted with core preserved | The concept is separated from the ticket-writing wrapper. Cite the upstream conceptual source without claiming a same-name skill. |

### Historical candidate held outside coverage

`skills-archive/optional-active-2026-09-01/writing-great-skills` and upstream
`skills/productivity/writing-for-agents` both discuss predictable agent-facing
writing, progressive disclosure, context pointers/load, leading words, and
pruning. The upstream source now covers agent-consumed documents generally,
while the archived local source is skill-specific and preserves older
mechanics. Repository history inspected for this plan establishes preservation
and attribution, but not that the two current names are aliases or that the
archived source should return to discovery. Disposition: **unresolved historical
lineage candidate**. Keep it excluded from 21-article coverage and revisit only
if an owner later activates or removes that source.

## Desired Behavior

### Discovery and article coverage

- `workbench/wiki/MEMORY.md` gains one `## Skills Reference` section as the
  sole discovery route. It lists every current skill exactly once by canonical
  name and links directly to its article. It adds no category index.
- Exactly 21 flat notes named `skill-<canonical-name>.md` live beside
  `MEMORY.md`. The manifest required list, the bounded core catalog, the router,
  and article basenames have one-to-one coverage with no duplicates, extras,
  or broken links.
- Ordinary Markdown is sufficient. Relative Markdown links are mandatory;
  Obsidian wikilinks may be added only when the standard Markdown route remains
  complete.

### Article contract

Every article uses the Wiki's required frontmatter with `type: memory`,
`status: active` (or `stale` when evidence requires it), `sensitivity: normal`,
`knowledge_role: curated`, repository-relative `source_paths`, and an actually
verified date. The body is original Workbench-specific prose and includes:

1. **What it does** — the recognizable core idea in owner-readable language.
2. **When to reach for it** — positive use cases and important look-alikes that
   should route elsewhere.
3. **Before you start** — prerequisites, assigned owners, inputs, or an explicit
   statement that none are required when that matters.
4. **How it works** — the mechanism and important sequence, tailored to the
   skill rather than copied from `SKILL.md`.
5. **Example** — one concrete, human-readable Workbench example.
6. **Inputs, outputs, and completion** — what the skill consumes, what it leaves
   behind, and observable signs that it worked.
7. **Limits and common questions** — authority boundaries, known failure modes,
   compatibility status, and the `checkpoint` retirement notice where relevant.
8. **Composition and related skills** — upstream/downstream neighbors,
   dependencies, and distinctions without inventing categories.
9. **Source, governance, and freshness** — links to the canonical `SKILL.md`,
   every supporting file, relevant controls/ADRs/Specs, the Workbench source
   revision actually reviewed, and the article's maintenance rule.

Sections may be renamed, combined, or omitted when the information is genuinely
inapplicable; the contract is semantic, not empty boilerplate. The article must
still answer purpose, reach conditions, inputs/outputs, completion, example,
composition, limits, and source ownership.

### Shared-concept visibility

- Every article represented in the comparison table includes an `Upstream
  relationship` subsection with the pinned source URL, access date,
  disposition, preserved core idea, local adaptations, and practical effect.
- `grilling` carries a visually obvious conceptual-drift callout naming the
  lost frontier/round mechanism and the accepted one-question-at-a-time local
  direction. It does not claim fidelity or silently justify the effect away.
- Workbench-only articles say no supported counterpart was established when
  readers could otherwise infer one. They do not invent a mapping.
- A mutable AI Hero page can supply editorial context, but the pinned upstream
  repository commit supplies executable comparison evidence. A later article
  refresh records the new revision rather than silently replacing the old one.

### Authority and maintenance

- Wiki prose is reference material. The current user request, `AGENTS.md`, the
  assigned Spec, and the executable skill source continue to govern action.
  An article neither invokes a skill nor grants authority.
- The implementer changing a current `skills/<name>/` source checks and updates
  its article in the same task, or marks it stale with the mismatch named.
  Changes to a shared concept also re-run its pinned comparison.
- The article records the local source revision and upstream revision it read.
  Unresolved discrepancies remain in the article until a supported decision or
  source change resolves them.
- The library teaches how existing skills are shaped through examples and
  source links. It does not create a new mandatory skill-authoring workflow or
  reactivate `writing-great-skills`.

## Decisions And Contracts

- One Spec owns the coherent Skills Wiki capability. One article per skill does
  not imply one Spec per article.
- Current coverage is the intersection proven by the manifest required list,
  the core catalog, and canonical `skills/<name>/SKILL.md` directories at the
  reviewed revision: 21 entries.
- The navigation shape is 21 flat root Wiki notes plus one MEMORY route. No
  collection, category index, Primitive/Compound/Assembly/Complex grouping, or
  new stance/role classification is introduced.
- Article prose follows AI Hero's recognizable editorial rhythm without copying
  its text. Local examples, limits, completion signals, and source links are
  required.
- Source lineage is concept-based, not name-based. Allowed dispositions are
  `aligned`, `adapted with core preserved`, `conceptual drift`, and `unresolved`.
- A local accepted decision can explain a difference but cannot turn a changed
  concept into an unsupported fidelity pass.
- The Workbench-only scope is a documented dogfood exemption: `templates/`,
  template generation/distribution, Workbench_Template, consumer rooms, and
  installed global skills remain byte-unchanged.
- The Wiki summarizes accepted owners; it does not copy ADR decisions, Spec
  task state, evidence logs, or executable instructions wholesale.
- Implementation batches below exist only to fit one fresh context and protect
  the shared router. They are not a skill taxonomy.

## Non-Goals

- Building any article, Wiki route, test, or navigation during this planning
  pass.
- Modifying skill behavior, names, installation, aliases, markers, or source.
- Repairing conceptual drift, installed-core compatibility, missing installed
  `to-tasks`, stale seeds, provenance, or unrelated Wiki drift.
- Shipping the library in `templates/`, changing template generators, updating
  Workbench_Template, or rolling content into consumer rooms.
- Publishing a website, requiring an Obsidian plugin, adding a database/search
  service, or depending on an external tracker or paid service.
- Defining Primitive, Compound, Assembly, Complex, or any replacement taxonomy.
- Reactivating archived/pending skills or deciding their retention/removal.
- Copying AI Hero prose, whole `SKILL.md` bodies, ADR decisions, or live work
  state into articles.
- Treating an article, website, or upstream repository as instruction authority.

## Dependencies And Blockers

- Owner review is required before implementation begins because this packet
  fixes the article contract, drift dispositions, and five-Task delivery cut.
- S-025, S-051, S-00R, ADR-000H, ADR-0018, ADR-0030, and the current Wiki
  schema are source owners to respect, not implementation blockers.
- External website availability is not an operational dependency after the
  source revision and editorial pattern are recorded. A failed future refresh
  remains visible and must not be reported as current.

## Vertical Implementation Slices

Tasks are temporary tracer bullets within this stable capability record. Their
batch labels are delivery sequencing only, not reference categories.

| Task | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-00G | Establish the article contract and prove one drift-marked article end to end | ready | none | pending |
| TK-00H | Publish the remaining shared-concept articles with pinned dispositions | blocked | TK-00G | pending |
| TK-00I | Publish the bootstrap and lifecycle boundary articles | blocked | TK-00H | pending |
| TK-00J | Publish the composition and continuity articles | blocked | TK-00I | pending |
| TK-00K | Publish the four stance articles and prove complete coverage | blocked | TK-00J | pending |

### TK-00G - Establish the article contract and prove one drift-marked article end to end

**Stance:** Builder

Create the Skills Reference route, the source-derived coverage/contract test,
and the `grilling` article as the narrowest complete path through inventory,
navigation, article content, upstream disposition, Wiki validation, and the
under-one-minute demo. The article must visibly flag the frontier/round drift.
Keep every other skill absent until its own Task, and prove templates, skill
source, installers, and consumer distribution did not change.

### TK-00H - Publish the remaining shared-concept articles with pinned dispositions

**Stance:** Builder

Add complete routed articles for `code-review`, `handoff`, `implement`,
`to-spec`, `to-tasks`, and `tracer-bullet`. Carry the pinned source mapping,
local adaptations, practical consequences, and allowed disposition through
each article and the demo. Preserve `to-tasks` as the callable current name;
explain `to-tickets` as lineage, not an alias. Extend coverage and navigation
at the same public seam while preserving the TK-00G article and drift marker.

### TK-00I - Publish the bootstrap and lifecycle boundary articles

**Stance:** Builder

Add complete routed articles for `adoption`, `checkpoint`, `genesis`, and
`update-harness`. Demonstrate the difference between first adoption, greenfield
creation, explicit Workbench update, and the retired checkpoint-copy workflow.
The `checkpoint` page must read as a compatibility notice with its current
route to notepad/direct promotion, not as instructions to resume copying.
Extend the same coverage, source-link, validation, and unchanged-distribution
proof end to end.

### TK-00J - Publish the composition and continuity articles

**Stance:** Builder

Add complete routed articles for `make-it-so`, `to-docs`, `carry`, `notepad`,
`save`, and `promote`. Make the boundaries among selection, reconciliation,
documentation routing, persistence, execution, and local continuity legible
without implying that composition expands authorization. Use one concrete
cross-article example to show how the primitives connect while every article
still stands alone. Extend the same coverage, source-link, validation, and
unchanged-distribution proof end to end.

### TK-00K - Publish the four stance articles and prove complete coverage

**Stance:** Builder

Add complete routed articles for `builder`, `auditor`, `reviewer`, and
`reconciler`. Explain each as a method and obligation set assigned by a Spec or
Task, never as an identity, authority grant, agent-spawning operation, or new
classification hierarchy. Close the 21-of-21 inventory, run the complete
under-one-minute demo and full required verification, capture the post-change
self-drift receipt, and prove the Workbench-only distribution boundary before
the assembled Spec enters its independent review gate.

## Acceptance Criteria

- [ ] The manifest, core catalog, MEMORY route, and article set prove exact
      one-to-one coverage of all 21 current skills and no excluded source.
- [ ] An owner can start at MEMORY and reach one readable article for every
      current skill through valid relative Markdown links in Obsidian or a
      plain Markdown reader.
- [ ] Every article satisfies the semantic article contract: purpose, reach
      conditions, prerequisites where relevant, mechanism, concrete example,
      inputs/outputs, observable completion, limits, composition, canonical
      source, governing owners, and freshness.
- [ ] `checkpoint` is unmistakably a compatibility notice; the four stance
      skills are identified as stances without creating a role taxonomy.
- [ ] Every supported shared-concept mapping cites the pinned upstream source
      and carries one allowed disposition; name inequality does not hide
      `to-tasks`/`to-tickets` or the extracted tracer-bullet concept.
- [ ] The `grilling` article visibly flags the frontier/round departure as
      conceptual drift, names its practical consequence and accepted local
      source, and does not claim upstream fidelity.
- [ ] Workbench-only skills receive no invented upstream counterpart, while the
      historical `writing-great-skills`/`writing-for-agents` candidate remains
      explicitly unresolved and outside current coverage.
- [ ] Articles are original Workbench-specific explanations, not substantial
      copies of AI Hero pages, `SKILL.md`, Specs, or ADRs.
- [ ] Every changed current skill article names the local revision it reads and
      the maintenance check makes source/article mismatch visible as stale.
- [ ] Wiki validation, article-contract/coverage tests, core skill catalog
      tests, render, doctor, the full required suite, and the post-change
      self-drift receipt are recorded without reclassifying pre-existing
      findings.
- [ ] `templates/`, template generators/distribution, installed global skills,
      Workbench_Template, and consumer rooms are demonstrably unchanged.
- [ ] A one-command under-one-minute demo lists the 21 routed skill names,
      resolves every link and source, and prints each shared disposition,
      including `grilling: conceptual drift`.

## Testing Seams

- A future `tools/test-skills-wiki.mjs` test at the public file/router seam:
  derive expected names from `workbench/manifest.json`, compare them with the
  bounded `skills/README.md` core table, `MEMORY.md` links, and article
  basenames; fail on missing/extra/duplicate coverage or broken links.
- The same test parses required Wiki frontmatter and the semantic contract,
  verifies every local source/supporting link, and requires a pinned upstream
  URL plus allowed disposition for the seven comparison rows. It must fail if
  `grilling` loses its conceptual-drift marker.
- `node workbench/tools/wiki.mjs validate` proves current Wiki schema and link
  validity without depending on Obsidian.
- `node tools/test-skill-catalog.mjs` proves the canonical 21-skill source list
  did not change as a side effect.
- A bounded changed-path assertion proves no path under `templates/`, no skill
  source/installer path, and no external repository is part of the candidate.
- The Workbench self-drift pre/post receipts plus manual semantic read-back
  distinguish this new planned work from pre-existing current-facing findings.

## Verification Procedure

Implementation runs the targeted checks first, then every command in the
current AGENTS full-suite block. The capability-specific and boundary commands
are:

```bash
node tools/test-skills-wiki.mjs
node workbench/tools/wiki.mjs validate
node tools/test-wiki.mjs
node tools/test-skill-catalog.mjs
node workbench/tools/spec-workbench.mjs render
node workbench/tools/spec-workbench.mjs doctor
node workbench/tools/self-drift.mjs --phase post --json
git diff --check
```

The final candidate also runs a script-backed changed-path assertion against
its integration base and the under-one-minute demo described in acceptance.
No result is claimed until those commands exist and run.

## Documentation Impact

- Implementation adds `workbench/wiki/skill-<name>.md` for the 21 inventory
  rows and one Skills Reference route in `workbench/wiki/MEMORY.md`.
- The implementation owner updates this Spec's Task state, evidence, and
  citation anchors, then renders `TASKBOARD.md` and `workbench/specs/CATALOG.md`.
- `workbench/wiki/SCHEMA.md`, root controls, source skills, and ADRs are checked
  but change only if implementation proves this accepted shape cannot satisfy
  their current contract; such a change requires renewed owner review.
- `templates/` is intentionally exempt because the owner selected an
  LLM_Workbench-only reference library. The final evidence must prove the
  exemption was honored rather than merely state it.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-21 | plan | Captured the one-Spec, 21-article Skills Wiki plan, current inventory, AI Hero editorial pattern, and pinned upstream concept comparison | Live root/branch/manifest/catalog/Wiki owners inspected at `03b23320fbc9bb25ca387d36b8b006ea00eedf08`; doctor had no blocking finding; self-drift pre receipt retained its pre-existing blocked machine result; Matt source verified at `c55ee46073ed923f86ce59a5eb3b6d895095d1b7`; direct retrieval of five AI Hero pages succeeded | Added this Spec only; derived projections pending render; no Wiki, skill, template, or consumer content implemented | Owner review and every implementation Task remain |
| 2026-09-21 | plan | Validated the complete planning packet and generated projection without beginning implementation | Targeted Spec parse/render/doctor, citation-anchor, self-drift, Wiki validation, and diff checks passed; full AGENTS suite passed 46/46; post self-drift reported the same 49 pre-existing findings (`stale-claim` 1, `stale-seed` 5, `unverified-provenance` 1, `incompatible-core` 40, `skill-missing` 2), `machineResult: blocked`, and no new finding; bounded diff check proved `templates/`, `skills/`, the installer, and manifest unchanged | Rendered `workbench/specs/CATALOG.md`; no Taskboard change because the Spec remains planned; no Wiki article or route implemented | Owner review of S-00V; implementation remains wholly pending |

## Completion Result

Pending. This Spec is a planning artifact ready for owner review; no Skills Wiki
article, route, test, template change, distribution, or implementation is
claimed.

## Remaining Limitations Or Follow-Up Specs

- AI Hero is mutable editorial evidence. The implementation must retain its
  access date and use the pinned upstream source for behavior comparison.
- The historical `writing-great-skills`/`writing-for-agents` relationship is
  intentionally unresolved and does not block current coverage.
- The existing installed-core, seed, provenance, stale-claim, and local
  `to-tasks` findings remain owned elsewhere.
- Later category navigation, hosted publishing, downstream distribution, or a
  generalized skill-authoring curriculum require separate owner direction.

## Supersession

- Supersedes: none
- Superseded by: none

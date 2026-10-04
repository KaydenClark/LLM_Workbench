# S-002L - skills draft wiki collection

**Spec ID:** S-002L
**Status:** active
**Priority:** 2
**Owner:** claude-director
**Stance:** Builder
**Updated:** 2026-10-04
**Catalog description:** Give the draft skills wiki a declared home, an index and one article template, so every skill's draft article has somewhere to go and its connection problems can be found by grep.
**Blockers:** none.
**Latest event:** TK-006O claimed by claude-director.
**Next gate:** Close TK-006O with verification and documentation proof.

> **Citation anchors.** pre=`07edccc57b8f75613ad1d09203a3e414d867b90c` post=`07edccc57b8f75613ad1d09203a3e414d867b90c`.

## Outcome

A draft-wiki collection exists with one folder per group (getting-started, main-workflow, shaping, upkeep, primitives, productivity, stances, foundry), an index `README.md`, one link to it from `workbench/wiki/MEMORY.md` (the only router), and the owner-approved draft-article template (Template 2) as the collection's owned template. Every other draft-wiki Spec's steps 2-5 write their article here. This Spec also decides DRAFT-LOC, the collection's location, and records the decision as confirmed or changed.

## Why It Matters

The owner wants to prototype the skills Wiki on the current skills to find what is wrong: skills that should connect and do not, skills that connect and do not work together. About 55 Specs (30 new, 26 amended, minus this one) send their steps 2-5 to a place that does not yet exist. The recommended location conflicts with a written Wiki rule, so it needs a recorded decision before 81 articles depend on it.

## Current Verified State

Read at the pre anchor.

- `workbench/wiki/SCHEMA.md` says "Every collection is flat; only `archive/` may nest" and, under Create, "do not add category indexes". `workbench/tools/wiki.mjs` does not enforce the flat rule: it walks every `.md` under the wiki lane recursively, skipping dot-names, and checks that note basenames (README excepted) are unique across the whole wiki, archive included.
- Collections are a closed set in code, not only in `workbench/manifest.json`. `COLLECTIONS` in `workbench/tools/workbench-paths.mjs` makes `collectionRelative` throw for an unknown name, and `workbench/tools/workbench-layout.mjs` rejects a manifest whose `collections` object matches none of its preserved shapes (`invalid-collection`). The `features` collection took the additive route (code registry, preserved shapes, `migrate`, template README). So declaring one more collection is a change to a shared contract, not a one-line manifest edit.
- `status` must be one of `active | partial | stale | archived` (`NOTE_STATUSES` in `workbench/tools/wiki.mjs`). Template 2's `status: draft` would be reported `invalid-note` for every draft. The validator does not read `supersedes`, `group` or `skill`; unknown keys are tolerated.
- `normalize` infers `type: meta` for a note outside the named collections, while Template 2 says `type: memory`.
- `workbench/wiki/SCHEMA.md` and `templates/wiki/SCHEMA.md` are identical except for the version stamp, and `tools/test-wiki.mjs` stamps and routes both. Whether a repo-only collection belongs in the template copy is open (dogfood boundary in `AGENTS.md`).
- 20 skill articles exist as `workbench/wiki/skill-*.md` (adoption, auditor, checkpoint, code-review, director, dispatcher, domain-modeling, genesis, grill-me, grilling, handoff, make-it-so, notepad, promote, save, spec-manager, spec-planner, to-docs, to-spec, to-tasks), routed from the "Skills Reference" section of `workbench/wiki/MEMORY.md`. They are audit-shaped: `skill-handoff.md` opens with inputs, output and done-when; `skill-grilling.md` ends with Upstream relationship, Verified behavior and limits, Sources and History. Template 2 differs by design (second person; "What it needs" and "What it reads and writes").
- The handoff that holds the inventory lives in the untracked `workbench/sessions/handoffs/` collection, so this Spec cannot cite it as durable evidence.

## Desired Behavior

1. The collection exists at the location this Spec confirms, with the eight group folders (each tracked, for example through `.gitkeep`) and an index README.
2. `node workbench/tools/wiki.mjs validate` passes with the collection present, accepts a well-formed draft article, and refuses a malformed one by name.
3. The template gives a draft author the front matter, the eight reader sections and the three draft-only sections, and fixes the finding line format `F:<skill>:NN | kind | one line | who fixes it`, with kinds `dangling`, `stale-name`, `overlap`, `gap`, `conflict`, `missing-skill`, one finding per line, so a later roll-up can grep every finding.
4. `MEMORY.md` carries one link to the collection README and no second router appears.

## Decisions And Contracts

- **DRAFT-LOC (to confirm in the first slice, not settled).** Options: (A) nested exception: a collection `workbench/wiki/skills-draft/<group>/<skill>.md`, with SCHEMA amended to "only `archive/` and the draft collection may nest"; the validator already tolerates this. (B) Flat: `workbench/wiki/skills-draft/<group>-<skill>.md` with a `group` front-matter key (Template 2 already has one), keeping SCHEMA's flat rule but duplicating the group in every filename and putting 81 files in one folder. (C) Outside the wiki lane: no SCHEMA conflict, but the draft wiki would lose the validator and the `MEMORY.md` route, so it is not a wiki. Recommended: (A). The owner's go-ahead accepted the nested layout, the exception ends when drafts are promoted (promoted articles are flat `skill-*.md` notes), and (B) gives up the one-folder-per-group reading the owner asked for. The owner may change it.
  **Resolved 2026-10-04 (TK-006M): confirmed (A).** `workbench/wiki/skills-draft/<group>/<skill>.md`; `SCHEMA.md` now says only `archive/` and `skills-draft/` may nest and that the index README is the one allowed category index.
- **DECL (to confirm).** Declaring the collection touches `workbench/manifest.json` and, because collections are a closed set, `workbench/tools/workbench-paths.mjs` and `workbench/tools/workbench-layout.mjs` (preserved shapes, `migrate`). Options: follow the `features` precedent without seeding the template; or leave the manifest alone and have SCHEMA and the validator name the folder. Recommended: the declaration, kept out of `templates/` with the exemption recorded, since this is a repo-only prototype. This enlarges a shared contract, so surface it as an owner tradeoff if the change reaches more than the manifest and one registry entry.
  **Resolved 2026-10-04 (TK-006M): changed to the second option.** The declaration would reach the closed `COLLECTIONS` registry, three preserved layout shapes, `migrate` and a template README (the `features` route), which is more than the manifest and one registry entry, and a repo-only prototype does not justify widening a contract every generated room reads. The folder is named by `SCHEMA.md` and by `workbench/tools/wiki.mjs` (`DRAFT_COLLECTION`, `DRAFT_GROUPS`); the manifest, `workbench-paths.mjs`, `workbench-layout.mjs` and `templates/` are untouched, and `templates/wiki/SCHEMA.md` deliberately omits the exception (the dogfood exemption; generated rooms do not carry the collection). The validator change ships inert in rooms without the folder. Reversing it later is one declaration and one migration, so this was a low-risk in-scope call rather than an owner tradeoff.
- **DRAFT-STATUS (to confirm).** Either add `draft` to the status enum (valid only inside the collection, refused elsewhere) or keep Template 2 on `status: partial` plus another key. Recommended: the scoped `draft` status, because the owner approved Template 2 with `status: draft`.
  **Resolved 2026-10-04 (TK-006M): confirmed.** `draft` is accepted only inside `skills-draft/` and refused everywhere else; inside it every non-index note must declare it, name its own `skill` and `group`, and sit directly in one of the eight group folders. `normalize` infers `type: memory` there (Template 2's value) and never invents the draft status.
- Template 2 is reproduced verbatim below from the owner-approved 2026-09-30 draft-skills handoff; this Spec may adjust wording the validator forces (status, type) and records each adjustment, but adds no section to the template.
  **Adjustments recorded 2026-10-04 (TK-006N), in `workbench/wiki/skills-draft/TEMPLATE.md`:** no section, key or section order changed. (1) A section's parenthetical hint moved from its heading to a comment line under it, so a heading is exactly the section name. (2) `provenance` and `source_paths` are block lists, because the Wiki front matter reader keeps `[a, b]` as a string. (3) `skill_source` and `origin` are bare values with no trailing `# comment`, which the reader would keep as part of the value; the validator refuses a value outside the listed set. (4) `supersedes` and `matt_counterpart` carry `none` instead of staying blank. (5) `origin` takes a fourth value, `other`, answering the question the foundry-origin skills triage Spec left open for this Spec: `chronicle` and `clean-my-ai-harness-codex` are not Foundry skills and are not mislabeled `foundry`. `status: draft` and `type: memory` needed no wording change: the scoped status landed in TK-006M and `memory` is already a valid type. The validator also requires the eight reader sections, the draft-only marker line and the three draft-only sections, and holds `## Findings` to well-formed finding lines (or `none`) with a two-digit number unique per draft, one of the six kinds and the draft's own skill name.
- Drafts do not replace the 20 existing `skill-*.md` articles. A draft carries `supersedes:` naming its existing article, which stays active and routed until the owner decides a promotion in a separate step. Draft basenames are the bare skill name, so they cannot collide with the `skill-` prefixed existing notes.
- The README's index of planned articles uses plain text, not links, until the owning Spec delivers the article and turns its row into a link; an unwritten target must never be a dangling link. It is the collection's own index (the `design-concepts` and `features` READMEs are the precedent), so SCHEMA's "no category indexes" wording must be reconciled in the same slice.
- Source paths in a draft are repository-relative. A skill that exists only in the owner's personal install has no repo path; where its source is cited is an open question for slice 3 (provenance line versus `source_paths`).
  **Resolved 2026-10-04 (TK-006N):** `source_paths` stays repository-relative; a personal-install skill cites its install location in a `provenance` line.

### Owner-approved draft article template

The original handoff records that the owner approved both templates on seeing them. The following Template 2 is preserved exactly, including its Sources and history section. Its source is working provenance; this recorded design text supplies the public continuation context, without claiming that the collection or template file is implemented. The original template block SHA-256, including its final newline, is `35c01bdbef9034c513e346ccb9fda18f7555b3257e61f31760d7bea35c02b4f2`.

```markdown
---
type: memory
status: draft
sensitivity: normal
knowledge_role: curated
skill: <name>
group: getting-started | main-workflow | shaping | upkeep | primitives | productivity | stances | foundry
skill_source: core | pending | personal | new
origin: workbench | matt | foundry          # foundry = revisit later
matt_counterpart: <name> | none
supersedes: <existing skill-*.md, if any>
provenance: [who/what produced this, dates, upstream pin d81f3a1]
source_paths: [...]
last_verified: YYYY-MM-DD
---
# <Skill>: <what it does for you, one line>

## What it does                 (second person, no jargon)
## When to reach for it         (table: What you have | Reach for)
## What it needs                (other skills, config, tools; each resolves to something real or becomes a finding)
## What it reads and writes     (every artifact and where it lives)
## How it works                 (1-3 concept sections)
## Common questions             (including honest limits)
## It's working if              (observable signs, like our fresh-context scenarios)
## Where it fits                (chain line, group, upstream and downstream skills)

--- draft only, stripped on promotion ---
## Compared with Matt's         (counterpart, verdict: same | close | divergent | missing, behavior and clarity differences)
## Findings                     (F:<skill>:NN | kind | one line | who fixes it)
## Sources and history          (our existing tail)
```

## Non-Goals

- Writing any skill article. Each owning Spec does that in its own step 2.
- The PILOT (`wayfinder`, `handoff`, `wait-what`); it is a separate handoff after this Spec.
- Promoting drafts into the main Wiki, retiring or editing any existing `skill-*.md` article, or editing any skill source.
- The findings roll-up tool. This Spec only fixes the line format it will read.
- Answering Q2A (where `wayfinder` keeps its pre-Spec decisions); the `wayfinder` Spec records it.

## Dependencies And Blockers

No blocker. Every other draft-wiki Spec names S-002L under its own blockers and cannot start its step 2 until the location and template are delivered. `next` does not read prose blockers, so no Task exists to enforce this; the Director reports whether it excludes them.

## Vertical Implementation Slices

No Task is cut. Tasks are cut from live Actuality when this Spec is activated. Intended slice direction:

1. Decide the location and declare the collection. Confirm DRAFT-LOC, DECL and DRAFT-STATUS (owner tradeoff if a shared contract widens), then change the manifest, SCHEMA.md, the validator registry as needed, and `tools/test-wiki.mjs`, red first: a nested draft validates, a bad draft status or misplaced draft is refused, the existing wiki still validates.
2. Write the collection README: the eight groups with their article counts (7, 14, 7, 21, 12, 5, 6, 9; 81 in all) and each planned article with its owning Spec, taken from the handoff inventory's owning Specs. New Spec IDs are read from the merged Specs at activation, not copied from the untracked handoff or invented here.
3. Add Template 2 as the collection's template file, including the finding line format and kinds above, and, if slice 1 chooses, a validator check that rejects a malformed `F:` line.
4. Add the single `MEMORY.md` link, then run `wiki.mjs validate`, render, doctor and the suite from a committed candidate, and record the evidence.

## Acceptance Criteria

- [ ] DRAFT-LOC, DECL and DRAFT-STATUS are each recorded as confirmed or changed, with the owner tradeoff stated where a shared contract widens.
- [ ] The collection exists with the eight group folders and an index README listing all eight groups and the 81 planned articles with their owning Specs.
- [ ] Template 2 is the collection's template, carries the `F:<skill>:NN | kind | one line | who fixes it` format and the six kinds, and has any wording change forced by the validator recorded.
- [ ] `MEMORY.md` links the collection once and `wiki.mjs validate` shows no error finding.
- [ ] A test in `tools/test-wiki.mjs` failed before the change and passes after it; the 20 existing skill articles are unchanged and still routed.
- [ ] Targeted tests, Wiki validation, the full suite, render, doctor, Workbench self-drift pre/post receipts and a separate-context review are recorded at their gates; no unrun check is reported as passing.

## Testing Seams

`validateWiki` and `normalizeWiki` on a fixture room (the `seededWiki` helper in `tools/test-wiki.mjs`) for the nested draft, status and malformed-finding cases; the product test in the same file for the repo's own wiki; `tools/test-workbench-layout.mjs` if the collection registry or preserved shapes change. These prove structure, not that a draft is useful.

## Verification Procedure

Run `node tools/test-wiki.mjs` red then green, `node workbench/tools/wiki.mjs validate`, any layout test the declaration touches, then the full suite in `AGENTS.md` from a committed candidate, `node workbench/tools/spec-workbench.mjs render` and `doctor`, and the self-drift receipts. Review the immutable candidate separately. Record the actual commands and results here.

## Documentation Impact

`workbench/manifest.json`, `workbench/wiki/SCHEMA.md` (and the `templates/wiki/SCHEMA.md` parity decision), `tools/test-wiki.mjs`, `workbench/tools/wiki.mjs` and the two path and layout tools only if slice 1 requires them, `workbench/wiki/MEMORY.md`, and the new collection README and template (location tentative until slice 1). RUNBOOK changes only if a command changes.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-30 | planning | Spec authored from the owner's draft-skills-wiki direction; planning only | Wiki schema, validator, manifest collections and existing articles read at the pre anchor; no implementation or test run | This Spec authored; collection, README and template remain future work | Slices 1-4 and independent review remain open |
| 2026-10-04 | TK-006M | Task closed | tools/test-wiki.mjs red then green 16/16; wiki.mjs validate ok; full Full suite 51/51 at 10aa2693; Codex gpt-5.5 separate-context review: FAIL at 57486cec (medium: draft skill/group optional, preserved), PASS at 10aa2693 (no findings); read-only sandbox could not run tests | workbench/wiki/SCHEMA.md; Spec Decisions resolved (DRAFT-LOC confirmed, DECL changed, DRAFT-STATUS confirmed); templates/wiki/SCHEMA.md untouched by exemption | TK-006N template and TK-006O README remain |
| 2026-10-04 | TK-006N | Task closed | tools/test-wiki.mjs red then green 22/22; wiki.mjs validate ok; Full suite 51/51 at 452134d0; Codex gpt-5.5 separate-context review PASS at 452134d0, no findings | workbench/wiki/skills-draft/TEMPLATE.md; Spec Decisions (template adjustments, source_paths decision) | TK-006O README and MEMORY link remain |

## Completion Result

Not complete.

## Supersession

None.

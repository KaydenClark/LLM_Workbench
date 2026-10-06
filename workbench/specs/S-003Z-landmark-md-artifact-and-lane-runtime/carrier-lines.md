# S-003Z carrier lines for the Contract carrier writer

**Status:** routed hand-off, not Canon. These are the lines the
[LANDMARK.md Artifact And Lane Runtime Spec (S-003Z)](SPEC.md) proposes for the
six Contract carrier files it may not edit. The files belong to the single
writer of the
[Contract Carrier Pointer-Brief Rewrite (S-004C)](../S-004C-contract-carrier-pointer-brief-rewrite/SPEC.md)
(its open PR #358 holds `LEXICON.md` and `templates/LEXICON.md`; the
[Harness Improvement Playbook Skill Spec (S-004L)](../S-004L-harness-improvement-playbook-skill/SPEC.md)
PR #372 also touches `LEXICON.md`). Nothing here instructs until that writer
lands it in a carrier. Written by S-003Z Task TK-008J (landmark templates and
documentation) on 2026-10-06 against integration d14cf315; re-read each
anchor before applying, since the carriers may have moved.

**Applied so far (2026-10-06):** sections 1, 2, 5 and 6 were applied by Task
TK-008Y (Runbook and AGENTS carrier lines) on the Director's routing, with the
bracketed value placeholders in the command examples written in the Runbook's
own `SHA` and `"..."` convention (root controls carry no template
placeholders) and the template naming the landmark's `specs` folder without a
bare `specs/` path. Sections 3 and 4 and the `workbench-room-checks` entry
under "Outside the six files" remain for Task TK-008Z. TK-008Y run 2 added the root Task row
to section 3. Apply sections 3 and 4 to the Lexicon as the Contract Carrier
Pointer-Brief Rewrite (TK-005N, PR #358) left it, changing only the landmark
statements. TK-008Z applied sections 3 and 4 and the `workbench-room-checks` entry on
2026-10-06 against the post-PR #358 Lexicon, editing only the landmark
statements of each row; every section of this file is now applied.

Every command below was read from `workbench/tools/spec-workbench.mjs` and
`workbench/tools/spec-report.mjs` at that tip; the readable explanation is
[Landmarks: The LANDMARK.md Artifact One Size Above A Spec](../../wiki/design-concepts/landmarks-one-size-above-specs.md).

## 1. `RUNBOOK.md`

### 1a. Operations Index rows

Anchor: the `## Operations Index` table. Add these two rows directly after the
row `| Capture, retire or recover a completed Spec | ...`:

```markdown
| Deliver a landmark through its lifecycle | You author, assign, nest a Spec or Task under, review, approve or retire a `LANDMARK.md`. | [Landmark Lifecycle](#landmark-lifecycle) |
| Move a Spec into, out of or between landmarks | A Spec gains, changes or drops its parent landmark. | [Landmark Lifecycle](#landmark-lifecycle) |
```

Replace the row `| Allocate a visible identifier | You need a new Spec, Task, note or other visible identifier. | ... |`
with:

```markdown
| Allocate a visible identifier | You need a new Spec, Task, landmark, note or other visible identifier. | [workbench-runtime](workbench/skills/workbench-runtime/SKILL.md#visible-identifiers) |
```

### 1b. New section `### Landmark Lifecycle`

Anchor: insert directly after the `### Visible Identifiers` section (before
`### Landmark Tracker: accepted design and available operations`). Keep it
outside `### Spec Lifecycle And Retrieval` to `### Architecture Decision
Records`: `tools/test-workbench-round-trip.mjs` executes the first
`node workbench/tools/spec-workbench.mjs <verb>` line it finds in that span,
so a landmark example placed inside it could be run as the Spec recipe.
`tools/test-runbook-index.mjs` requires the heading to be reachable from an
index row, which 1a provides.

````markdown
### Landmark Lifecycle

A landmark is a `LANDMARK.md` artifact one size above a Spec
([ADR-000U](workbench/docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md)):
its folder `workbench/landmarks/LMK-###-slug/` holds `LANDMARK.md`, its child
Specs in `specs/` and its direct Tasks in `tasks/`, each with a `retired/`
lifecycle folder. Copy `templates/LANDMARK.md`; `doctor` reports a broken
artifact as `malformed-landmark` and a misnamed folder as `unstable-path`.
Examples name LMK-001, S-001 and TK-001; substitute the actual IDs and quoted
values. The [Landmarks article](workbench/wiki/design-concepts/landmarks-one-size-above-specs.md)
explains the model.

```bash
node workbench/tools/spec-workbench.mjs next-id --prefix LMK --json
node workbench/tools/spec-workbench.mjs move-spec S-001 --landmark LMK-001
node workbench/tools/spec-workbench.mjs move-spec S-001 --landmark none
node workbench/tools/spec-workbench.mjs claim LMK-001 --agent NAME
node workbench/tools/spec-workbench.mjs show LMK-001
node workbench/tools/spec-workbench.mjs receipt LMK-001 --task TK-001 --tests "[TESTS RUN AND RESULT]" --docs "[DOCS TOUCHED OR none]" --remaining-gap "[GAP OR none]"
node workbench/tools/spec-workbench.mjs close LMK-001 --proof "[NAMED VERIFICATION]" --docs "[DOCS UPDATED OR Docs checked; no update needed + reason]" --remaining-gap "[GAP OR none]"
node workbench/tools/spec-workbench.mjs gate --task TK-001 --landmark LMK-001
node workbench/tools/spec-workbench.mjs move-task LMK-001 --task TK-001 --to retired
node workbench/tools/spec-workbench.mjs report LMK-001 --candidate [SHA]
node workbench/tools/spec-workbench.mjs verify LMK-001
node workbench/tools/spec-workbench.mjs verdict LMK-001 --candidate [SHA] --digest [DIGEST] --result pass|fail --findings "[FINDINGS OR none]" --reviewer "[SEPARATE CONTEXT, MODEL AND MODE]"
node workbench/tools/spec-workbench.mjs approve LMK-001 --candidate [INTEGRATION SHA] --digest [DIGEST] --owner "[WHO]"
node workbench/tools/spec-workbench.mjs retire-landmark LMK-001 --wiki workbench/wiki/design-concepts/landmark-durable-plans.md
```

- `move-spec --landmark LMK-###|none` moves an active-roster Spec into a
  landmark, between landmarks or back to `workbench/specs/` through the
  link-safe move: every live reference is rewritten, historical ones counted,
  and the moved record's links to unmoved files recomputed. It never combines
  with `--to`, and it does not edit the landmark's Child Specs list.
- A Task directly under a landmark names `**Landmark ID:**` in place of
  `**Spec ID:**`. `next` and `claim LMK-###` offer it only while the landmark is
  `active` and its Owner is not `unassigned`; `close` appends to the landmark's
  evidence log, and `gate --task --landmark` reports its Task PR under the same
  exemption a Spec's Task PR uses.
- `report`, `verify` and `verdict` on a landmark are the whole-landmark review:
  `verify` refuses while a child Spec is neither complete nor retired or a
  direct Task is not done; `verdict` refuses a reviewer who took part in the
  landmark, answers a fail with corrective Tasks under the landmark without
  touching a child Spec's gate, and sets the landmark `reached` on a pass with
  every child closed and every reached check ticked.
- `approve LMK-###` records only the owner's actual approval, bound to the
  landmark's committed content; it records no owner finding.
- `retire-landmark LMK-### --wiki PAGE` refuses by name until the landmark is
  reached with no open child, a current pass verdict, a clean tree, the owner's
  approval and a Landmark Wiki page in the Wiki lane whose `source_paths` names
  the historical `LANDMARK.md` route; then it moves the whole folder to
  `workbench/landmarks/retired/`, staged and uncommitted.

A landmark-direct Task executes only under an assigned landmark until the
Instruction Authority list in `AGENTS.md` names an assigned landmark.
````

### 1c. Test And Build: Full suite list

Anchor: the fenced Full suite block in `## Test And Build`. Add one line,
directly after `node tools/test-spec-report.mjs`:

```bash
node tools/test-landmark-wiki.mjs
```

Reason: S-003Z TK-008I extended `tools/test-landmark-wiki.mjs` (79 passing on
2026-10-06) for the retirement page rule, and no Full suite command runs or
imports it. Not needed: `tools/test-task-record.mjs` and
`tools/test-lifecycle-directory-links.mjs` are imported by
`tools/test-spec-workbench.mjs` (lines 51-54) and already run in the suite.
`tools/test-landmark-tracker.mjs` (23 passing) is also outside the suite but
belongs to the Landmark Tracker lane, not to this Spec. Adding a suite member
changes the suite count from 51 to 52; the release owner's suite scripts and
any pinned count must move with it.

## 2. `templates/RUNBOOK.md`

### 2a. Operations Index rows

Anchor: the `## Operations Index` table. Add directly after the row
`| Capture, retire or recover a completed Spec | ...`:

```markdown
| Deliver a landmark through its lifecycle | You author, assign, nest a Spec or Task under, review, approve or retire a `LANDMARK.md`. | [Landmark Lifecycle](#landmark-lifecycle) |
```

Replace the `Allocate a visible identifier` row's Follow-when cell with
`You need a new Spec, Task, landmark, note or other visible identifier.`

### 2b. New section `### Landmark Lifecycle`

Anchor: insert directly after `### Visible Identifiers` (the generic round-trip
slice ends at that heading, so the section must follow it). Use the same
section as 1b with the room-specific link generalized: replace the ADR-000U
link with `the room's landmark decision record, if it has one` and the Wiki
article link with `the room's Wiki article on landmarks, if it has one`; keep
every command and bullet unchanged except the `retire-landmark` example page,
which becomes `workbench/wiki/design-concepts/landmark-[slug].md` (the
template keeps the bracketed placeholder; the root example names a concrete
page because the root controls carry no template placeholder).

### 2c. `## Workbench Lifecycle, Diagnostics, And Decision Records` command block

Anchor: the fenced block that lists `next --json`, `show S-###`, `claim
S-### --agent NAME`, `close S-### ...`, `render`, `doctor`. Add after the
`claim` line:

```bash
node workbench/tools/spec-workbench.mjs claim LMK-### --agent NAME
```

and add this sentence after the paragraph that follows the block:

```markdown
A Spec may nest under a landmark in `workbench/landmarks/LMK-###-slug/specs/`,
and a Task may sit directly under an assigned, active landmark; the
[Landmark Lifecycle](#landmark-lifecycle) section names the landmark commands.
```

## 3. `LEXICON.md`

Anchor: the vocabulary table rows `| **Landmark** |`, `| **Landmark Wiki page** |`
and `| **Map** |`. Replace each whole row with:

```markdown
| **Landmark** | A direction toward the destination at the largest scale below the Blueprint: a `LANDMARK.md` artifact, PRD-shaped like a Spec but much bigger, saying where the work goes and what success looks like. | Landmarks and Specs are the map at different scales; Tasks are the steps. A landmark forms when groupings appear in the DQCs and DDRs, parents Specs (nested in its `specs/` folder) and may hold Tasks directly (in its `tasks/` folder), and retires into its Landmark Wiki page once reached and all its children are done. A Spec or DDR has at most one landmark, otherwise it sits under the Blueprint. A landmark is a lane, not a branch, reviewed one size above a Spec. Its statuses are `planned`, `active` and `reached`, and its identifier prefix is `LMK-`. The JSON landmark records in the Landmark Tracker remain until their migration into question cards ([ADR-000U](workbench/docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md); [the Landmarks article](workbench/wiki/design-concepts/landmarks-one-size-above-specs.md)). |
| **Landmark Wiki page** | The landmark's evolving synthesis page: a coherent, human-readable Markdown summary of what its question cards add up to, updated whenever a card changes. | Its raw source is the landmark's `LANDMARK.md`, which it describes as the landmark currently is without being the same document; a reached landmark retires into it, and the page's `source_paths` names the landmark's historical route ([ADR-000U](workbench/docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md)). Several Specs may contribute to one article. Identifiers appear only with the artifact's name and context. The structured records keep lineage and state; the page keeps the readable account; its claims remain subject to existing ownership and authority rules ([ADR-000R](workbench/docs/adr/000R-the-wiki-is-the-evolving-synthesis-every-agent-reads-and-updates.md)). |
| **Map** | The direction to a destination, at two scales: a landmark and a Spec are each a map, and Tasks are the steps taken on it. A low-resolution view around a destination shows decisions so far, Fog and out-of-scope work. As a workflow verb, Map is "Writing the direction to a destination: landmarks, Specs and decision records." | It links to the artifacts that own the detail rather than creating a second file or truth store; it is distinct from the project-wide Context Map. The landmark, Spec and Task folder path carries every parent ([ADR-000U](workbench/docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md)). One row serves the noun and the verb because the verb is writing the noun. |
```

The change in each: the Landmark row drops "Today landmarks are still JSON
records in the Landmark Tracker; the artifact is not installed yet" and names
the delivered folders, statuses and prefix; the Landmark Wiki page row drops
"As the accepted destination" and names the retirement; the Map row adds the
folder path that carries every parent.

Root Task row (added by TK-008Y run 2 for the fail verdict #1 finding): in the
`| **Task** |` row, replace the sentence

```markdown
Small direct Blueprint Tasks, and Tasks directly under a landmark ([ADR-000U](workbench/docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md)), remain accepted destination design with no delivered home; today ordinary Tasks are Spec-bound, and a `wiki-claim` destination
```

with

```markdown
Small direct Blueprint Tasks remain accepted destination design with no delivered home; a Task's parent is its Spec or, directly, an assigned and active landmark ([ADR-000U](workbench/docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md)), and a `wiki-claim` destination
```

and keep the rest of the row as the Lexicon then has it.

## 4. `templates/LEXICON.md`

Anchor: the rows `| **Landmark** |` (currently "An evolving account of a
feature or framework pillar ..."), `| **Landmark Wiki page** |` and `| **Map** |`.
Replace each whole row with the generic form (no repository links):

```markdown
| **Landmark** | A direction toward the destination at the largest scale below the Blueprint: a `LANDMARK.md` artifact, PRD-shaped like a Spec but much bigger, saying where the work goes and what success looks like. | Landmarks and Specs are the map at different scales; Tasks are the steps. A landmark parents Specs (nested in its `specs/` folder) and may hold Tasks directly (in its `tasks/` folder), and retires into its Landmark Wiki page once reached and all its children are done. A Spec has at most one landmark, otherwise it sits under the Blueprint. A landmark is a lane, not a branch, reviewed one size above a Spec. Its statuses are `planned`, `active` and `reached`, and its identifier prefix is `LMK-`. |
| **Landmark Wiki page** | The landmark's evolving synthesis page: a coherent, human-readable Markdown summary of what its question cards add up to, updated whenever a card changes. | Its raw source is the landmark's `LANDMARK.md`, which it describes without being the same document; a reached landmark retires into it. Several Specs may contribute to one article. Identifiers appear only with the artifact's name and context. The structured records keep lineage and state; the page keeps the readable account; its claims remain subject to existing ownership and authority rules. |
| **Map** | The direction to a destination, at two scales: a landmark and a Spec are each a map, and Tasks are the steps taken on it. A low-resolution view around a destination shows decisions so far, Fog and out-of-scope work. As a workflow verb, Map is "Writing the direction to a destination: landmarks, Specs and decision records." | It links to the artifacts that own the detail rather than creating a second file or truth store; it is distinct from the project-wide Context Map. The landmark, Spec and Task folder path carries every parent. One row serves the noun and the verb because the verb is writing the noun. |
```

Check before applying: the template Lexicon's Task row still says "today
ordinary Tasks are Spec-bound"; with landmark-direct Tasks delivered, replace
that clause with "a Task's parent is its Spec or, directly, its landmark".

## 5. `AGENTS.md`

Anchor: `### Task Merge Answers And Verify Review`, the sentence "Landmark and
whole-Workbench review tooling is accepted destination design; today's runtime
reviews Specs." Replace it with:

```markdown
Landmark review tooling is delivered (`report`, `verify` and `verdict` on a
landmark); whole-Workbench review tooling is accepted destination design.
```

Not proposed here: naming an assigned `LANDMARK.md` as a bounded delegate in
`### Instruction Authority` item 3. The Spec's Decisions And Contracts assign
that change to S-004C; until it lands, the runtime refuses a Task under an
unassigned landmark.

## 6. `templates/AGENTS.md`

Anchor: `### Task Merge Answers And Verify Review` (or its equivalent), the
clause "sometimes a landmark's assembled Specs,". Replace with:

```markdown
sometimes a landmark's assembled Specs (`report`, `verify` and `verdict` on the
landmark),
```

The dogfood line "Use `move-spec` and `move-task`, never manual moves." needs
no change: `move-spec --landmark` is the same operation.

## Outside the six files (for their own writers)

- `workbench/skills/workbench-room-checks/SKILL.md`, `## V3 support-root
  check` (held by S-004L's PR #372): "twelve collections" becomes "thirteen
  collections", the list gains "and the additive ... `docs/ddr` and
  `landmarks`", and "appends each missing additive collection in order
  (`features`, then `ddr`)" becomes "(`features`, then `ddr`, then
  `landmarks`)".
- The lane skills that carry Spec lifecycle procedures (`implement`,
  `dispatcher`, `director`, `workbench-runtime`) name no landmark command; if
  the Runbook section in 1b is not enough, each gains a pointer to it.

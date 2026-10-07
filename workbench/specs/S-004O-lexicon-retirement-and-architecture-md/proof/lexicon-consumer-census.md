# Lexicon line census and consumer census

Census record of [Lexicon Retirement And ARCHITECTURE.md (S-004O)](../SPEC.md), Task TK-009A [census every Lexicon line and extend the landing check](../tasks/TK-009A/TASK.md). It names homes and consumers; it moves no content. Later Tasks write the homes, re-point the consumers and remove the Lexicon under [the Lexicon retirement decision](../../../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md).

Census base: assembly base `1f4e2d676221ae2fd6b15607389ddb97c6cc99ac` (integration plus the glossary planning commits). Neither Lexicon changed between that base and the TK-009A branch point.

Refreshed by TK-009H [remove the Lexicon with every line landed](../tasks/TK-009H/TASK.md) to the delivered homes: the final inventories re-scaffolded at the pre-removal commit `0059669f1e1b81c8048dfea9714d0ce7a9e1d914`, the Template Wiki homes as delivered (grouped `templates/wiki/vocabulary-*.md` articles and `templates/wiki/ai-coding-reference.md`), the landing check at removal, and the live mentions that remain. The TK-009A census text below is kept as the record of what was planned.

## Line inventories

Two inventories, one per carrier, scaffolded with `node tools/check-carrier-landing.mjs scaffold --base 1f4e2d676221ae2fd6b15607389ddb97c6cc99ac --carrier <carrier> --out <inventory>` and then classified entry by entry. Every non-blank, non-heading line has exactly one classified entry.

| Inventory | Carrier | Entries | glossary | architecture | wiki | restates-owner | retired-with-reason |
|---|---|---|---|---|---|---|---|
| [lexicon-landing-inventory.json](lexicon-landing-inventory.json) | `LEXICON.md` | 308 | 139 | 107 | 37 | 5 | 20 |
| [template-lexicon-landing-inventory.json](template-lexicon-landing-inventory.json) | `templates/LEXICON.md` | 269 | 117 | 100 | 38 | 0 | 14 |
| [lexicon-landing-inventory-final.json](lexicon-landing-inventory-final.json) (TK-009H) | `LEXICON.md` | 308 | 139 | 107 | 37 | 5 | 20 |
| [template-lexicon-landing-inventory-final.json](template-lexicon-landing-inventory-final.json) (TK-009H) | `templates/LEXICON.md` | 269 | 117 | 100 | 38 | 0 | 14 |

The two final inventories were scaffolded at the pre-removal commit `0059669f1e1b81c8048dfea9714d0ce7a9e1d914` (the TK-009H lane merged with integration `d0fb161c`) and carry every classification over from the census inventories by line hash; the census inventories stay as history. One line changed after the census: root line 218, the Core skill bundle row, now counts twenty-four workflow skills (TK-009F carried the count into GLOSSARY.md and its article), and it keeps the same row's classification, whose `landedText` already carried the new count. No line was added or removed after the census in either Lexicon.

### How lines were classified

- **glossary** (`GLOSSARY.md`, `templates/GLOSSARY.md`): project vocabulary, including ordinary words with a distinct project meaning. Each term row lands as `**Term**: definition` in Matt's pinned format; the planned definition is the row's own Definition column cut to one or two sentences with citation links removed, so no meaning changes. Spec, Task, Landmark and the Workbench meaning of Review are glossary entries; so are Grilling and Automated review, the two AI Coding Terms rows whose Workbench meaning differs from the dictionary. Retired names (Root controls, Portable layout, Portability model, Ticket) land as `_Avoid_:` aliases under their preferred term, named in the entry's `aliasOf`. The five feedback disposition bullets land as entries under a Feedback disposition grouping; their `landedText` is the defining phrase so the entry heading can follow the glossary's casing.
- **wiki**: general AI and programming reference concepts stay Wiki-only: the AI Coding Terms rows other than Grilling and Automated review, plus Progressive disclosure and Seam. Context window and cache tokens are among them and get no glossary entry. Where a dictionary article already exists, the `landedText` is its present opening sentence; otherwise it is the row's first Definition sentence for the article TK-009D writes. The AI Coding Terms attribution paragraph lands in the Wiki memory router's AI Coding Dictionary Entries section; the release label v3.0.0 lands in a planned version-labels page.
- **architecture** (`ARCHITECTURE.md`, `templates/ARCHITECTURE.md`): Task Routing, the Context Map route table, the Ownership Rules, the Artifact Ownership Schema (responsibility and artifact-boundary tables) and its invariants, and the design-concept routing. Route rows land by their Need cell, responsibility rows by their definition cell, boundary rows by their first sentence, so the later Task can reshape the routes without failing the check. Lines that named the Lexicon as a route or owner are planned with GLOSSARY.md or ARCHITECTURE.md in its place; the Root files boundary row is planned with both new files.
- **restates-owner**: root AI Coding Terms intro lines whose claims the Wiki memory router already holds (its adoption date, the delivering Spec and "in Workbench words"). Each `landedText` is present in `workbench/wiki/MEMORY.md` now.
- **retired-with-reason**: Lexicon file metadata and its 2026-10-03 review-scope note, Markdown table headers and rules of the term tables, the Lexicon row (it defines the retiring file itself) and the TASK pointer row in Stance Terms. Each carries its reason.

Three optional fields, ignored by the landing check, carry routing for later Tasks:

- `explanationHome` on glossary entries names the Wiki lexicon article that keeps the row's fuller Distinction text, owner quotes and decision links (TK-009D). The landing check proves only `landedText`; the Distinction column is not machine-proven to land, so TK-009D carries it by this field.
- `aliasOf` on an `_Avoid_` entry names the glossary term the alias sits under.
- `explanationText` (TK-009D onward) on a glossary entry is the row's Distinction text as it lands in its `explanationHome` article: verbatim, except that links are re-based to the article's directory and a self-reference to a Lexicon "row" names an "entry". `tools/test-wiki.mjs` proves each one lands, normalized, in an article that declares the entry's term as its `glossary_term` and is routed from Wiki `MEMORY.md`.

All `landedText` values for homes that do not exist yet are planned text: the Task that writes the home may refine the wording and must update the entry to match, without changing what any term means.

### Homes the inventories name

Root: 113 glossary terms (plus the context description, the Governance core grouping line, four `_Avoid_` aliases and five feedback dispositions) in `GLOSSARY.md`; `ARCHITECTURE.md`.

Template: 96 glossary terms plus the `[TERM]` placeholder entry in `templates/GLOSSARY.md`; `templates/ARCHITECTURE.md`.

Root Wiki homes (`wiki` entries):

- `workbench/wiki/MEMORY.md` (exists)
- `workbench/wiki/dictionary-agent.md` (exists)
- `workbench/wiki/dictionary-attention-budget.md` (exists)
- `workbench/wiki/dictionary-attention-degradation.md` (exists)
- `workbench/wiki/dictionary-automated-check.md` (exists)
- `workbench/wiki/dictionary-cache-tokens.md` (exists)
- `workbench/wiki/dictionary-context-window.md` (exists)
- `workbench/wiki/dictionary-context.md` (exists)
- `workbench/wiki/dictionary-effort.md` (exists)
- `workbench/wiki/dictionary-environment.md` (exists)
- `workbench/wiki/dictionary-feedback-disposition.md` (exists)
- `workbench/wiki/dictionary-filesystem.md` (exists)
- `workbench/wiki/dictionary-harness.md` (exists)
- `workbench/wiki/dictionary-human-review.md` (exists)
- `workbench/wiki/dictionary-inference.md` (exists)
- `workbench/wiki/dictionary-input-tokens.md` (exists)
- `workbench/wiki/dictionary-model-provider.md` (exists)
- `workbench/wiki/dictionary-model.md` (exists)
- `workbench/wiki/dictionary-next-token-prediction.md` (exists)
- `workbench/wiki/dictionary-non-determinism.md` (exists)
- `workbench/wiki/dictionary-output-tokens.md` (exists)
- `workbench/wiki/dictionary-parameters.md` (exists)
- `workbench/wiki/dictionary-progressive-disclosure.md` (exists)
- `workbench/wiki/dictionary-seam.md` (exists)
- `workbench/wiki/dictionary-session.md` (exists)
- `workbench/wiki/dictionary-smart-zone.md` (exists)
- `workbench/wiki/dictionary-software-factory.md` (exists)
- `workbench/wiki/dictionary-stateful.md` (exists)
- `workbench/wiki/dictionary-stateless.md` (exists)
- `workbench/wiki/dictionary-system-prompt.md` (exists)
- `workbench/wiki/dictionary-token.md` (exists)
- `workbench/wiki/version-labels.md` (exists)

Template Wiki homes (`wiki` entries), as delivered by TK-009L:

- `templates/wiki/ai-coding-reference.md` (exists): the general AI coding reference article.
- `templates/wiki/vocabulary-feedback-disposition.md` (exists).
- `templates/wiki/dictionary-agent.md` (planned)
- `templates/wiki/dictionary-attention-budget.md` (planned)
- `templates/wiki/dictionary-attention-degradation.md` (planned)
- `templates/wiki/dictionary-automated-check.md` (planned)
- `templates/wiki/dictionary-cache-tokens.md` (planned)
- `templates/wiki/dictionary-context-window.md` (planned)
- `templates/wiki/dictionary-context.md` (planned)
- `templates/wiki/dictionary-effort.md` (planned)
- `templates/wiki/dictionary-environment.md` (planned)
- `templates/wiki/dictionary-feedback-disposition.md` (planned)
- `templates/wiki/dictionary-filesystem.md` (planned)
- `templates/wiki/dictionary-harness.md` (planned)
- `templates/wiki/dictionary-human-review.md` (planned)
- `templates/wiki/dictionary-inference.md` (planned)
- `templates/wiki/dictionary-input-tokens.md` (planned)
- `templates/wiki/dictionary-model-provider.md` (planned)
- `templates/wiki/dictionary-model.md` (planned)
- `templates/wiki/dictionary-next-token-prediction.md` (planned)
- `templates/wiki/dictionary-non-determinism.md` (planned)
- `templates/wiki/dictionary-output-tokens.md` (planned)
- `templates/wiki/dictionary-parameters.md` (planned)
- `templates/wiki/dictionary-session.md` (planned)
- `templates/wiki/dictionary-smart-zone.md` (planned)
- `templates/wiki/dictionary-software-factory.md` (planned)
- `templates/wiki/dictionary-stateful.md` (planned)
- `templates/wiki/dictionary-stateless.md` (planned)
- `templates/wiki/dictionary-system-prompt.md` (planned)
- `templates/wiki/dictionary-token.md` (planned)

Explanation homes: 112 root lexicon articles under `workbench/wiki/dictionary-*.md` and 94 Template ones under `templates/wiki/dictionary-*.md` (per-entry `explanationHome`). Whether the Template ships per-term articles or folds them is TK-009D and TK-009G's decision; general reference pages may stay Wiki-only.

As delivered: 113 root explanation homes, one flat `workbench/wiki/dictionary-*.md` article per glossary term, all present; the Template folds its explanations into ten grouped articles, one per glossary grouping, under the Wiki-shape decision in the Spec: `templates/wiki/vocabulary-chats-and-roles.md`, `vocabulary-continuity-and-evidence-boundaries.md`, `vocabulary-continuity-terms.md`, `vocabulary-destination-and-direction.md`, `vocabulary-governance-core.md`, `vocabulary-specs-and-tasks.md`, `vocabulary-stance-terms.md`, `vocabulary-workbench-meanings-of-ai-coding-terms.md`, `vocabulary-workbench-room-and-artifacts.md` and `vocabulary-workflow-verbs.md`, plus `vocabulary-feedback-disposition.md` and `ai-coding-reference.md` above. No planned `templates/wiki/dictionary-*.md` page was written; the per-entry `explanationHome` values name the grouped articles.

### Landing check against a candidate with both Lexicons removed

A dry run on a throwaway commit (`8b3ac92e44f692282c1bd866e666937f55492287`, the TK-009A tree with `LEXICON.md` and `templates/LEXICON.md` deleted, never pushed) with `check --base 1f4e2d676221ae2fd6b15607389ddb97c6cc99ac --candidate <that commit> --inventory <inventory> --json`:

| Carrier | Removed | Landed now | Unlanded | Inventory errors |
|---|---|---|---|---|
| `LEXICON.md` | 308 | 33 | home-missing 271, home-lacks-text 4 | 0 |
| `templates/LEXICON.md` | 269 | 14 | home-missing 247, home-lacks-text 8 | 0 |

Lines that land now are the retired lines, the restated claims and the entries whose existing dictionary article already holds the text. `home-missing` lines wait for GLOSSARY.md, ARCHITECTURE.md and the planned Wiki articles; `home-lacks-text` lines are the planned additions to the existing Wiki memory routers. This is the expected red state for the removal Task (TK-009H).

Lexicon edits that land after this base (the AI Coding Dictionary Terms Spec S-004E and the Workbench Terms And Workflow Verbs Spec S-004G are active Lexicon writers) are not in these inventories: TK-009H re-scaffolds against its own base and classifies the new lines before removal.

### Landing check at removal (TK-009H)

TK-009H deleted both Lexicons in one commit and ran `check --base 0059669f1e1b81c8048dfea9714d0ce7a9e1d914 --candidate <candidate> --inventory <final inventory> --json`. Both Lexicons reported every removed line landed with no inventory error, at the deletion commit and again at the final candidate; the saved outputs are [lexicon-landing-check.json](lexicon-landing-check.json) and [template-lexicon-landing-check.json](template-lexicon-landing-check.json).

| Carrier | Removed | Landed | Unlanded | Inventory errors |
|---|---|---|---|---|
| `LEXICON.md` | 308 | 308 | 0 | 0 |
| `templates/LEXICON.md` | 269 | 269 | 0 | 0 |

The check proves each line's `landedText`. Moving the Template Lexicon checks to their new owners found definition text the Template glossary had cut and no Template article carried (the Template glossary cut each definition to one or two sentences, and TK-009L carried only the Distinction text). TK-009H landed it in the grouped Template articles: the Workbench nesting sentences, Portable Workbench's "nothing lives only on the owner's machine", the Blueprint's map-scale and one-Blueprint sentences, Task's one-context sentence, the two Notepad sentences, the WBID value format and the full Collection set, plus the Grilling and Automated review dictionary attribution links. The other cut sentences are self-references to Lexicon rows or Task Routing, now reworded in their glossary entries, and the retired-name rows, which land as `_Avoid_` aliases with their retirement notes in the articles. In this room the batch Tasks already wrote each row's fuller definition into its article.

## Consumer census

Every tracked file that reads or links the Lexicon at `1f4e2d676221ae2fd6b15607389ddb97c6cc99ac`, found with `git grep -a -i -l lexicon 1f4e2d676221ae2fd6b15607389ddb97c6cc99ac` (case-insensitive; `-a` because some tool files read as binary). `git grep -a LEXICON` finds a subset of the same 530 files. Live consumers name the Task that re-points them and the owner they should read instead; history records keep their mention unchanged.

### Control files (repository root)

| File | What it reads | Re-pointed by | Reads instead |
|---|---|---|---|
| `AGENTS.md` | Entry route names `LEXICON.md`; "the Lexicon's routing section"; Instruction Authority item 4 names `RUNBOOK.md` and `LEXICON.md` as Contract carriers; Governance Core pointer; "Follow active decisions through the Lexicon"; Context Map routes; unclear-term pointer; two links to `LEXICON.md#artifact-ownership-schema`. | TK-009F | ARCHITECTURE.md (routes, Context Map, ownership schema); GLOSSARY.md (terms); Instruction Authority drops the Lexicon. Minimal edit: the carrier rewrite (S-004C) owns the wider AGENTS rewrite. |
| `README.md` | Names `templates/LEXICON.md` and root `LEXICON.md` in the file lists, the context-pack command and the entry route; "Lexicon definition-only". | TK-009F; TK-009G for the shipped-file list | GLOSSARY.md and ARCHITECTURE.md in the root-file lists; entry route through ARCHITECTURE.md. |
| `RUNBOOK.md` | Ordinary entry route through `LEXICON.md` -> Task Routing; link to `LEXICON.md#artifact-ownership-schema`; "Follow the Lexicon before" (roles); Wiki lint checklist names the Lexicon and "a Lexicon row". The carrier line-landing pointer was edited by this Task and stays. | TK-009F | ARCHITECTURE.md (entry route, ownership schema); GLOSSARY.md (terms and rows in the Wiki lint checklist). |
| `LEXICON.md` | The carrier itself. | TK-009H | Removed after every inventory entry lands (re-scaffold first if the Lexicon changed after this base). |

### Template files (`templates/`)

| File | What it reads | Re-pointed by | Reads instead |
|---|---|---|---|
| `templates/AGENTS.md` | Mirror of the root AGENTS mentions: entry route, routing section, Instruction Authority item 4, Governance Core pointer, decisions route, Context Map, unclear-term pointer, `LEXICON.md#artifact-ownership-schema` link. | TK-009F; TK-009G for the installed control set | templates/ARCHITECTURE.md and templates/GLOSSARY.md; Instruction Authority drops the Lexicon. |
| `templates/BLUEPRINT.md` | First line "Its terms mean what the Lexicon says they mean." (pinned by `tools/test-blueprint-contract.mjs`). The root Blueprint no longer carries this line at the base. | TK-009F | GLOSSARY.md: the line says where terms are defined. |
| `templates/RUNBOOK.md` | Entry route through `LEXICON.md` -> Task Routing; ownership schema link; roles pointer; Wiki lint checklist; "exactly one Lexicon disposition" for feedback findings. | TK-009F | templates/ARCHITECTURE.md (routes, ownership); templates/GLOSSARY.md (Feedback disposition, terms). |
| `templates/README.md` | Entry route "AGENTS -> Runbook -> Lexicon"; file list entry for `LEXICON.md`; Spec catalog "routed through the Lexicon". | TK-009F; TK-009G | templates/GLOSSARY.md and templates/ARCHITECTURE.md. |
| `templates/GENESIS.md` | Genesis creates `LEXICON.md`, seeds it with founding terms and checks it in the readiness list. | TK-009G | Genesis seeds GLOSSARY.md and drafts the ARCHITECTURE.md codemap for grilling to confirm. |
| `templates/ADOPTION.md` | Adoption moves source vocabulary into `LEXICON.md` and lists it among root files. | TK-009G | Adoption writes GLOSSARY.md vocabulary and drafts the ARCHITECTURE.md codemap. |
| `templates/.claude/settings.json` | Allow-list entry `Edit(./LEXICON.md)` (asserted by `tools/test-workbench-layout.mjs`). | TK-009G | Allow `Edit(./GLOSSARY.md)` and `Edit(./ARCHITECTURE.md)`. |
| `templates/WORKBENCH_FEEDBACK.md` | Names `LEXICON.md` among the control docs. | TK-009F | GLOSSARY.md and ARCHITECTURE.md. |
| `templates/feedback/REPORT_FORMAT.md` | Disposition field "using the Lexicon's definitions". | TK-009F | GLOSSARY.md Feedback disposition entries. |
| `templates/wiki/MEMORY.project.md` | "Leaving The Wiki" row links `LEXICON.md` for shared terms, the Governance Core and design-concept routing. The inventory also plans the AI Coding Dictionary attribution text here. | TK-009F; TK-009D for the planned dictionary section | GLOSSARY.md (terms) and ARCHITECTURE.md (routing) rows; Wiki lexicon articles. |
| `templates/wiki/SCHEMA.md` | "a page for any term that needs more than its Lexicon row". | TK-009D | Wiki lexicon articles link their GLOSSARY.md definition. |
| `templates/wiki/design-concepts/README.md` | Design-concept routing "starts from the root `LEXICON.md`, which routes here". | TK-009F | GLOSSARY.md term, then the ARCHITECTURE.md design-concept route. |
| `templates/LEXICON.md` | The carrier itself. | TK-009H | Removed after every inventory entry lands (after TK-009G ships the Template successors). |

### Runtime tools (`workbench/tools/`, managed and installed into rooms)

| File | What it reads | Re-pointed by | Reads instead |
|---|---|---|---|
| `workbench/tools/adr.mjs` | Lists `LEXICON.md` among the root files it scans (two lists). | TK-009F | GLOSSARY.md and ARCHITECTURE.md. |
| `workbench/tools/self-drift.mjs` | `CONTROLS` includes `LEXICON.md`. | TK-009F | GLOSSARY.md and ARCHITECTURE.md. |
| `workbench/tools/spec-workbench.mjs` | Root-file list includes `LEXICON.md`; a comment says `SCHEMA.md`/`LEXICON.md` name the one Wiki router. | TK-009F | GLOSSARY.md and ARCHITECTURE.md; the comment names ARCHITECTURE.md. |
| `workbench/tools/task-record.mjs` | Comment: the `TK-###` form is kept per "LEXICON and the grilling destination ledger". | TK-009F | GLOSSARY.md (Task entry, `_Avoid_: ticket`). |
| `workbench/tools/template-placeholders.mjs` | Placeholder-checked Template file list includes `LEXICON.md`. | TK-009G | templates/GLOSSARY.md and templates/ARCHITECTURE.md. |
| `workbench/tools/workbench-layout.mjs` | Installed `controls` list includes `LEXICON.md`. | TK-009G | GLOSSARY.md and ARCHITECTURE.md; update route retires a landed Lexicon. |

### Maintainer tools and tests (`tools/`)

| File | What it reads | Re-pointed by | Reads instead |
|---|---|---|---|
| `tools/check-carrier-landing.mjs` | The S-004C `lexicon` home kind (history of the carrier rewrite) and, after this Task, Lexicon carriers with `glossary` and `architecture` homes. | TK-009A (this Task) | Stays: the tool is the landing check for this migration. |
| `tools/test-carrier-landing.mjs` | Fixture `LEXICON.md` as a `restates-owner` home and the new Lexicon-carrier cases. | TK-009A (this Task) | Stays: fixture data. |
| `tools/control-fidelity.mjs` | `templatedControls` includes `LEXICON.md`. | TK-009G | GLOSSARY.md and ARCHITECTURE.md. |
| `tools/cross-provider-resume.mjs` | Fixture room writes a `LEXICON.md` with a Terms table. | TK-009G | Fixture writes GLOSSARY.md (and ARCHITECTURE.md if the installed set requires it). |
| `tools/grill-board.mjs` | Artifact group `lexicon` titled LEXICON on the shared Grill Board. | TK-009F | Groups for GLOSSARY.md and ARCHITECTURE.md; the board is shared with the owner's Codex lane, so coordinate before changing groups. |
| `tools/test-adr.mjs` | Reads `LEXICON.md` among controls and pins the Lexicon bold-term table rows for decision vocabulary. | TK-009C (term rows); TK-009F (controls map) | GLOSSARY.md entries; ARCHITECTURE.md routes. |
| `tools/test-blueprint-contract.mjs` | Pins the Template Blueprint note "Its terms mean what the Lexicon says they mean." | TK-009F | The new Blueprint first line naming GLOSSARY.md. |
| `tools/test-control-fidelity.mjs` | Controls list, Lexicon fixture rows, root/Template Lexicon parity, and the Instruction Authority assertion naming `LEXICON.md` as a Contract carrier. | TK-009G; TK-009F for the Instruction Authority assertion | GLOSSARY.md and ARCHITECTURE.md in the control set; Instruction Authority without the Lexicon. |
| `tools/test-controls-vocabulary-sweep.mjs` | Allows the retired word in the Lexicon's Ticket row and its ADR link. | TK-009C | The GLOSSARY.md Task entry's `_Avoid_: ticket` line. |
| `tools/test-genesis-from-decisions.mjs` | Genesis fixture writes and checks `LEXICON.md`; asserts the Instruction Authority item naming it. | TK-009G; TK-009F for the Instruction Authority assertion | GLOSSARY.md and ARCHITECTURE.md. |
| `tools/test-governance-core.mjs` | Root and Template Lexicons carry a `## Governance Core` section with the core term rows and the owner definition of design concept. | TK-009C | GLOSSARY.md and templates/GLOSSARY.md Governance core grouping and entries. |
| `tools/test-grill-board.mjs` | Fixture `LEXICON.md` and the expected `lexicon` group. | TK-009F | Follows tools/grill-board.mjs. |
| `tools/test-portability-matrix.mjs` | `ACTIVE_SURFACES` includes `LEXICON.md`. | TK-009G | GLOSSARY.md and ARCHITECTURE.md. |
| `tools/test-runbook-index.mjs` | Entry-route regex through `LEXICON.md`, the `LEXICON.md#artifact-ownership-schema` link, the read-words sentence and comments about Lexicon rows. | TK-009F | ARCHITECTURE.md routes; GLOSSARY.md for read words. |
| `tools/test-self-drift.mjs` | Fixture control list includes `LEXICON.md`. | TK-009F | Follows workbench/tools/self-drift.mjs. |
| `tools/test-skill-catalog.mjs` | Pins the Lexicon phrase "closed set of ... workflow skills", that both Lexicons identify as a lexicon, and lists `LEXICON.md` in controls. | TK-009C (Core skill bundle entry); TK-009F | GLOSSARY.md Core skill bundle entry. |
| `tools/test-skills-lane.mjs` | `rootControls` includes `LEXICON.md`. | TK-009G | GLOSSARY.md and ARCHITECTURE.md. |
| `tools/test-wiki.mjs` | Control list includes `LEXICON.md`; both Lexicons must route design questions to the design-concepts collection. | TK-009D; TK-009F | GLOSSARY.md term then ARCHITECTURE.md design-concept route; Wiki lexicon article links. |
| `tools/test-workbench-adoption.mjs` | Adoption fixtures create, remove and expect `LEXICON.md` as a control. | TK-009G | GLOSSARY.md and ARCHITECTURE.md; a room without a Lexicon is unchanged. |
| `tools/test-workbench-layout.mjs` | Controls list, stamped-file list, `Edit(./LEXICON.md)` allow-list assertion and unreadable-stamp fixtures. | TK-009G | GLOSSARY.md and ARCHITECTURE.md. |
| `tools/test-workbench-round-trip.mjs` | Round-trip room writes `LEXICON.md` and tolerates its Ticket row. | TK-009G | GLOSSARY.md and ARCHITECTURE.md. |
| `tools/test-workbench-tools.mjs` | Root-file list includes `LEXICON.md`. | TK-009G | GLOSSARY.md and ARCHITECTURE.md. |
| `tools/test-workbench-upgrade.mjs` | Controls list includes `LEXICON.md`. | TK-009G | Update route keeps an unlanded Lexicon, retires a landed one, leaves a Lexicon-free room unchanged. |

### Workbench skills (`workbench/skills/`)

| File | What it reads | Re-pointed by | Reads instead |
|---|---|---|---|
| `workbench/skills/README.md` | Catalog note: "Lexicon" in the controls names the root `LEXICON.md`; the provider `lexicon` skill is out of scope. | TK-009F | Routing note only; the `lexicon` skill itself belongs to S-003O. |
| `workbench/skills/grilling/SKILL.md` | "Lexicon supplies accepted meanings". | TK-009F | GLOSSARY.md (routing only). |
| `workbench/skills/handoff/SKILL.md` | Link `LEXICON.md#artifact-boundaries`. | TK-009F | ARCHITECTURE.md ownership boundaries. |
| `workbench/skills/implement/SKILL.md` | Ordinary entry "AGENTS -> the Runbook -> Lexicon Task Routing". | TK-009F | ARCHITECTURE.md routes. |
| `workbench/skills/reconciler/references/reconcile.md` | Feedback disposition "from its Lexicon". | TK-009F | GLOSSARY.md Feedback disposition. |
| `workbench/skills/to-docs/SKILL.md` | Routes accepted shared definitions to `LEXICON.md`; read words "the Lexicon defines". | TK-009F | GLOSSARY.md for definitions (through promotion), Wiki lexicon articles for explanation, ARCHITECTURE.md for ownership routes. |
| `workbench/skills/to-spec/SKILL.md` | "Preserve project vocabulary from `LEXICON.md`". | TK-009F | GLOSSARY.md. |
| `workbench/skills/workbench-evaluation/SKILL.md` | "exactly one Lexicon disposition". | TK-009F | GLOSSARY.md Feedback disposition. |
| `workbench/skills/workbench-room-checks/SKILL.md` | Carrier line-landing procedure; edited by this Task for Lexicon carriers and the new home kinds. | TK-009A (this Task) | Stays. |

### Feedback lane format (`workbench/feedback/REPORT_FORMAT.md`, the room copy of the Template format)

| File | What it reads | Re-pointed by | Reads instead |
|---|---|---|---|
| `workbench/feedback/REPORT_FORMAT.md` | Disposition field "using the Lexicon's definitions". | TK-009F | GLOSSARY.md Feedback disposition entries. |

### Grill Board (`workbench/grill-board/`, shared with the owner's Codex lane)

| File | What it reads | Re-pointed by | Reads instead |
|---|---|---|---|
| `workbench/grill-board/README.md` | Names a Lexicon row as a Confirm destination and LEXICON among the artifact groups. | TK-009F | GLOSSARY.md entry (through promotion) and the ARCHITECTURE.md group. |
| `workbench/grill-board/index.html` | The `lexicon` artifact group in the page selector. | TK-009F | Follows `tools/grill-board.mjs`. |

### Wiki lexicon articles (`workbench/wiki/dictionary-*.md`)

Each cites `LEXICON.md` as its source for the Workbench meaning. TK-009D re-points each to its GLOSSARY.md definition when the term is a glossary entry (Automated review), or keeps it Wiki-only with the Lexicon source removed when it is a general reference concept (the other eight).

| File | Mentions | Links |
|---|---|---|
| `workbench/wiki/dictionary-automated-review.md` | 3 | `LEXICON.md` |
| `workbench/wiki/dictionary-cache-tokens.md` | 4 | `LEXICON.md` |
| `workbench/wiki/dictionary-context-window.md` | 3 | `LEXICON.md` |
| `workbench/wiki/dictionary-context.md` | 4 | `LEXICON.md` |
| `workbench/wiki/dictionary-harness.md` | 5 | `LEXICON.md` |
| `workbench/wiki/dictionary-non-determinism.md` | 4 | `LEXICON.md` |
| `workbench/wiki/dictionary-session.md` | 4 | `LEXICON.md` |
| `workbench/wiki/dictionary-stateful.md` | 3 | `LEXICON.md` |
| `workbench/wiki/dictionary-stateless.md` | 3 | `LEXICON.md` |

### Other Wiki pages

TK-009F re-points every link to `LEXICON.md` or one of its headings: term links to GLOSSARY.md, ownership and route links (`#artifact-ownership-schema`, `#artifact-boundaries`, Task Routing) to ARCHITECTURE.md, and explanation links to the Wiki lexicon articles. A mention without a link that describes history (a delivered capability, a past decision) may stay as written; one that gives a live route is re-pointed.

| File | Mentions | Links to the Lexicon | Re-pointed by |
|---|---|---|---|
| `workbench/wiki/MEMORY.md` | 12 | `LEXICON.md` | TK-009F; TK-009D: Router rows to `LEXICON.md` re-point to GLOSSARY.md and ARCHITECTURE.md; the AI Coding Dictionary Entries section receives the attribution text the inventory plans and holds the restated claims. |
| `workbench/wiki/SCHEMA.md` | 1 | none (mention only) | TK-009D: Schema wording about Lexicon rows becomes glossary definitions plus lexicon articles. |
| `workbench/wiki/derive-before-asking-the-owner.md` | 1 | none (mention only) | TK-009F |
| `workbench/wiki/design-concepts/README.md` | 1 | none (mention only) | TK-009F |
| `workbench/wiki/design-concepts/decision-records-and-the-concept-map.md` | 8 | `LEXICON.md` | TK-009F |
| `workbench/wiki/design-concepts/delivery-altitudes.md` | 5 | `LEXICON.md` | TK-009F |
| `workbench/wiki/design-concepts/landmark-agent-stances.md` | 2 | `LEXICON.md#stance-terms` | TK-009F |
| `workbench/wiki/design-concepts/landmark-artifact-types.md` | 3 | none (mention only) | TK-009F |
| `workbench/wiki/design-concepts/landmark-context-map.md` | 14 | `LEXICON.md` | TK-009F |
| `workbench/wiki/design-concepts/landmark-durable-knowledge.md` | 3 | `LEXICON.md` | TK-009F |
| `workbench/wiki/design-concepts/landmark-grilling-and-shared-understanding.md` | 5 | `LEXICON.md` | TK-009F |
| `workbench/wiki/design-concepts/landmark-harness-feedback-review.md` | 2 | `LEXICON.md` | TK-009F |
| `workbench/wiki/design-concepts/landmark-landmark-tracker.md` | 3 | `LEXICON.md` | TK-009F |
| `workbench/wiki/design-concepts/landmark-ownership-model.md` | 3 | `LEXICON.md` | TK-009F |
| `workbench/wiki/design-concepts/landmark-portable-workbench.md` | 2 | `LEXICON.md` | TK-009F |
| `workbench/wiki/design-concepts/landmark-skills.md` | 4 | `LEXICON.md` | TK-009F |
| `workbench/wiki/design-concepts/landmark-taskboard.md` | 5 | `LEXICON.md` | TK-009F |
| `workbench/wiki/design-concepts/landmark-tracker.md` | 6 | `LEXICON.md`, `LEXICON.md#artifact-ownership-schema` | TK-009F |
| `workbench/wiki/design-concepts/landmark-wiki.md` | 3 | `LEXICON.md` | TK-009F |
| `workbench/wiki/design-concepts/landmark-workbench-and-project-relationships.md` | 6 | `LEXICON.md` | TK-009F |
| `workbench/wiki/design-concepts/landmark-workbench-boundaries.md` | 3 | `LEXICON.md` | TK-009F |
| `workbench/wiki/design-concepts/roles-and-stances.md` | 3 | `LEXICON.md` | TK-009F |
| `workbench/wiki/design-concepts/task-artifact-and-lifecycle.md` | 1 | none (mention only) | TK-009F |
| `workbench/wiki/design-concepts/workflow-verbs.md` | 11 | `LEXICON.md` | TK-009F |
| `workbench/wiki/features/assigned-work-portable-stances-and-delivery-boundaries.md` | 5 | `LEXICON.md` | TK-009F |
| `workbench/wiki/features/blueprint-active-adrs-and-the-context-map.md` | 5 | `LEXICON.md` | TK-009F |
| `workbench/wiki/features/consistent-bootstrap-ownership-guidance.md` | 1 | none (mention only) | TK-009F |
| `workbench/wiki/features/control-fidelity-without-forced-uniformity.md` | 3 | `LEXICON.md` | TK-009F |
| `workbench/wiki/features/governance-planes-adr-decisions-and-scoped-diagnostics.md` | 4 | `LEXICON.md` | TK-009F |
| `workbench/wiki/features/lexicon-freshness-repair.md` | 13 | `LEXICON.md` | TK-009F |
| `workbench/wiki/features/portable-wiki-knowledge-and-collections.md` | 1 | none (mention only) | TK-009F |
| `workbench/wiki/features/spec-centered-progressive-disclosure.md` | 6 | `LEXICON.md` | TK-009F |
| `workbench/wiki/features/visible-workbench-identifiers.md` | 4 | `LEXICON.md` | TK-009F |
| `workbench/wiki/harness-engineering-lineage.md` | 2 | none (mention only) | TK-009F |
| `workbench/wiki/parallel-lane-dispatch.md` | 1 | none (mention only) | TK-009F |
| `workbench/wiki/skill-adoption.md` | 3 | `LEXICON.md#core-terms`, `LEXICON.md#governance-core` | TK-009F |
| `workbench/wiki/skill-auditor.md` | 5 | `LEXICON.md`, `LEXICON.md#stance-terms` | TK-009F |
| `workbench/wiki/skill-builder.md` | 2 | `LEXICON.md`, `LEXICON.md#stance-terms` | TK-009F |
| `workbench/wiki/skill-carry.md` | 5 | `LEXICON.md` | TK-009F |
| `workbench/wiki/skill-checkpoint.md` | 2 | `LEXICON.md#governance-core` | TK-009F |
| `workbench/wiki/skill-director.md` | 7 | `LEXICON.md`, `LEXICON.md#core-terms`, `LEXICON.md#stance-terms` | TK-009F |
| `workbench/wiki/skill-dispatcher.md` | 7 | `LEXICON.md`, `LEXICON.md#core-terms`, `LEXICON.md#stance-terms` | TK-009F |
| `workbench/wiki/skill-domain-modeling.md` | 17 | `LEXICON.md`, `LEXICON.md#artifact-ownership-schema` | TK-009F |
| `workbench/wiki/skill-grilling.md` | 1 | none (mention only) | TK-009F |
| `workbench/wiki/skill-make-it-so.md` | 4 | none (mention only) | TK-009F |
| `workbench/wiki/skill-reconciler.md` | 3 | `LEXICON.md`, `LEXICON.md#stance-terms`, `LEXICON.md#feedback-dispositions` | TK-009F |
| `workbench/wiki/skill-reviewer.md` | 3 | `LEXICON.md`, `LEXICON.md#stance-terms` | TK-009F |
| `workbench/wiki/skill-spec-manager.md` | 7 | `LEXICON.md`, `LEXICON.md#stance-terms`, `LEXICON.md#core-terms` | TK-009F |
| `workbench/wiki/skill-spec-planner.md` | 3 | `LEXICON.md`, `LEXICON.md#stance-terms` | TK-009F |
| `workbench/wiki/skill-to-docs.md` | 5 | `LEXICON.md`, `LEXICON.md#artifact-ownership-schema` | TK-009F |
| `workbench/wiki/skill-to-tasks.md` | 2 | `LEXICON.md` | TK-009F |
| `workbench/wiki/skills-draft/README.md` | 2 | none (mention only) | TK-009F |

### History records that keep their mention unchanged

#### Spec records (`workbench/specs/`): 229 files

Spec evidence, Task records and generated `CATALOG.md` keep their mention unchanged. Open Specs whose planned work edits the Lexicon are listed below for coordination; their records are not re-pointed by this Spec.

| Spec folder or file | Status at the base | Files |
|---|---|---|
| `CATALOG.md` | generated | 1 |
| `S-002C-director-role` | active | 3 |
| `S-002D-dispatcher-role` | active | 2 |
| `S-002E-worker-role` | active | 7 |
| `S-002F-spec-planner-stance` | active | 3 |
| `S-002G-spec-manager-stance` | active | 3 |
| `S-002H-domain-modeling-skill` | superseded | 1 |
| `S-002M-ask-workbench-skill-alignment` | planned | 1 |
| `S-002N-brainstorm-skill-alignment` | planned | 1 |
| `S-002O-sitrep-skill-alignment` | planned | 1 |
| `S-002P-writing-for-agents-skill-adoption` | planned | 1 |
| `S-002Q-workbench-setup-step` | planned | 1 |
| `S-002R-setup-pre-commit-skill-alignment` | planned | 1 |
| `S-002S-setup-ts-deep-modules-skill-alignment` | planned | 1 |
| `S-002U-pr-skill-adoption` | planned | 1 |
| `S-002V-retro-skill-adoption` | planned | 1 |
| `S-002W-wayfinder-skill-alignment` | planned | 1 |
| `S-002X-research-skill-alignment` | planned | 1 |
| `S-003C-wait-what-skill-adoption` | planned | 1 |
| `S-003D-to-questionnaire-skill-adoption` | planned | 1 |
| `S-003E-foundry-origin-skills-triage` | planned | 1 |
| `S-003F-loop-me-skill-alignment` | planned | 1 |
| `S-003G-improve-codebase-architecture-skill-alignment` | planned | 1 |
| `S-003H-diagnosing-bugs-skill-alignment` | planned | 1 |
| `S-003I-resolving-merge-conflicts-skill-alignment` | planned | 1 |
| `S-003J-triage-skill-adoption` | planned | 1 |
| `S-003K-harness-feedback-review-skill-family-alignment` | planned | 1 |
| `S-003L-ubiquitous-language-skill-alignment` | planned | 1 |
| `S-003M-codebase-design-skill-alignment` | planned | 1 |
| `S-003N-tdd-skill-alignment` | planned | 1 |
| `S-003O-lexicon-skill-alignment` | planned | 1 |
| `S-003W-wiki-evolving-synthesis-migration` | active | 1 |
| `S-003X-decision-record-tooling` | active | 6 |
| `S-003Y-notepad-concurrent-write-safety` | active | 3 |
| `S-003Z-landmark-md-artifact-and-lane-runtime` | active | 7 |
| `S-004B-captain-role-and-landmark-director` | planned | 1 |
| `S-004C-contract-carrier-pointer-brief-rewrite` | active | 16 |
| `S-004D-shared-interactive-board` | planned | 1 |
| `S-004E-ai-coding-dictionary-terms` | active | 6 |
| `S-004F-corrective-work-rules` | active | 7 |
| `S-004G-workbench-terms-and-workflow-verbs` | active | 7 |
| `S-004H-blueprint-short-page` | active | 4 |
| `S-004I-template-release-proof-puffer-pond` | planned | 1 |
| `S-004J-required-domain-modeling-skill` | planned | 1 |
| `S-004K-workbench-term-dictionary-pages` | planned | 1 |
| `S-004L-harness-improvement-playbook-skill` | active | 3 |
| `S-004M-room-legibility-surface` | active | 1 |
| `S-004O-lexicon-retirement-and-architecture-md` | planned | 1 |
| `S-00A-blueprint-active-adr-and-context-map` | complete | 2 |
| `S-00E-fresh-template-project-proof` | complete | 1 |
| `S-00G-ownership-map-root-control` | planned | 2 |
| `S-00I-folder-lifecycle-for-records` | active | 4 |
| `S-00J-spec-qa-gate-at-integration` | active | 6 |
| `S-00K-workbench-self-drift-check` | active | 1 |
| `S-00L-lexicon-freshness-repair` | complete | 1 |
| `S-00M-completion-claims-against-repository-state` | active | 1 |
| `S-00N-feedback-finding-dispositions` | active | 2 |
| `S-00O-workbench-v4-0-0-release` | blocked | 3 |
| `S-00P-workflow-canon-rework` | active | 5 |
| `S-00Q-legacy-completed-record-migration` | active | 4 |
| `S-00R-core-skill-lifecycle-and-optional-source-disposition` | active | 1 |
| `S-00V-portable-workbench` | active | 6 |
| `S-00W-concept-grilling-and-notepad-composition` | planned | 1 |
| `S-00Y-notepad-skill-rebuild` | active | 1 |
| `S-00Z-grill-me-skill-rebuild` | active | 1 |
| `S-011-agent-skills-adoption` | superseded | 1 |
| `S-015-portable-v3-release-audit-recovery` | complete | 1 |
| `S-01A-handoff-skill-rebuild` | active | 1 |
| `S-01B-promote-skill-rebuild` | active | 1 |
| `S-01C-carry-skill-rebuild` | active | 2 |
| `S-01D-adoption-skill-rebuild` | active | 1 |
| `S-01E-checkpoint-skill-rebuild` | active | 1 |
| `S-01F-code-review-skill-rebuild` | active | 1 |
| `S-01G-genesis-skill-rebuild` | active | 1 |
| `S-01I-make-it-so-skill-rebuild` | active | 1 |
| `S-01J-to-docs-skill-rebuild` | active | 1 |
| `S-01K-to-spec-skill-rebuild` | active | 1 |
| `S-01L-to-tasks-skill-rebuild` | active | 1 |
| `S-01O-save-skill-rebuild` | active | 1 |
| `S-01P-builder-skill-rebuild` | active | 7 |
| `S-01Q-auditor-skill-rebuild` | active | 1 |
| `S-01R-reviewer-skill-rebuild` | active | 3 |
| `S-01S-reconciler-skill-rebuild` | active | 2 |
| `S-01T-landmark-tracker-foundation` | planned | 2 |
| `S-01U-lexicon-design-concept-reconciliation` | active | 9 |
| `S-01W-uppercase-width-four-workbench-artifact-ids` | active | 6 |
| `S-01X-generated-json-taskboard` | active | 1 |
| `S-021-portable-workbench-v3` | complete | 1 |
| `S-022-llm-workbench-v3-1-release` | superseded | 1 |
| `S-023-manifest-schema-2-and-managed-runtime` | complete | 1 |
| `S-024-governance-core-adrs-and-diagnostics` | complete | 1 |
| `S-025-portable-wiki-and-design-concepts` | complete | 1 |
| `S-027-workbench-v3-1-1-boundaries` | complete | 1 |
| `S-029-declared-integration-branch` | complete | 1 |
| `S-030-permission-scope-matches-lanes` | complete | 1 |
| `S-031-installed-skill-generation` | complete | 1 |
| `S-032-upgrade-route-and-source-provenance` | complete | 1 |
| `S-034-control-fidelity-report` | complete | 1 |
| `S-035-workbench-v3-1-2-candidate` | complete | 1 |
| `S-036-v3-1-2-evidence-corrections` | complete | 1 |
| `S-039-installed-runtime-integrity` | complete | 1 |
| `S-041-recorded-baseline-availability` | complete | 1 |
| `S-044-legacy-room-classification` | complete | 1 |
| `S-046-json-notepad-foundation` | complete | 2 |
| `S-047-visible-workbench-identifiers` | complete | 2 |
| `S-048-checkpoint-retirement` | complete | 3 |
| `S-049-assignment-ownership-and-coordination-record` | complete | 1 |
| `S-050-workbench-v3-2-0-release` | superseded | 2 |
| `S-052-private-session-transport` | active | 1 |
| `retired/S-00H-task-artifact-and-terminology-migration` | complete | 3 |

#### Decision records and registers (`workbench/docs/`): 52 files

ADRs and DDRs keep their text, including `canonicalized_in` entries that name `LEXICON.md` (Spec Desired Behavior 7); `REGISTER.md` and `HISTORY.md` are generated from them.

- `workbench/docs/adr/0001-planes-classify-operations-not-artifacts.md`
- `workbench/docs/adr/0003-full-crud-with-artifact-conditions.md`
- `workbench/docs/adr/000A-active-adr-decisions-and-destination-blueprints.md`
- `workbench/docs/adr/000B-the-workbench-root-surface-is-eight-files-and-contract-membership-is-separate-from-root-placement.md`
- `workbench/docs/adr/000C-the-workbench-contract-is-the-obligation-claim-set-carried-by-three-root-controls-and-the-assigned-spec.md`
- `workbench/docs/adr/000D-the-ownership-map-is-an-exhaustive-type-level-framework-answered-by-structured-query.md`
- `workbench/docs/adr/000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md`
- `workbench/docs/adr/000G-blueprint-spec-and-task-are-three-altitudes-of-one-delivery-chain.md`
- `workbench/docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md`
- `workbench/docs/adr/000I-record-lifecycle-is-expressed-by-folder-location-with-permanent-archive-and-transient-retired.md`
- `workbench/docs/adr/000K-every-feedback-finding-carries-one-of-four-dispositions.md`
- `workbench/docs/adr/000L-a-notepad-belongs-to-its-objective-and-every-chat-working-that-objective-writes-to-it.md`
- `workbench/docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md`
- `workbench/docs/adr/000N-landmark-tracker-connects-evolving-understanding-to-durable-knowledge.md`
- `workbench/docs/adr/000P-roles-scope-work-and-stances-define-the-job.md`
- `workbench/docs/adr/000R-the-wiki-is-the-evolving-synthesis-every-agent-reads-and-updates.md`
- `workbench/docs/adr/000S-destination-decision-records-are-decision-records-beside-adrs.md`
- `workbench/docs/adr/000T-records-share-one-set-of-read-words-list-show-search-history-and-inspect.md`
- `workbench/docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md`
- `workbench/docs/adr/000V-captain-director-dispatcher-and-worker-scope-work-and-role-skills-own-each-job.md`
- `workbench/docs/adr/000W-contract-carriers-are-briefs-that-point-to-skills-and-authority-flows-through-the-pointer.md`
- `workbench/docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md`
- `workbench/docs/adr/000Y-a-locked-and-confirmed-answer-is-promoted-without-further-ceremony.md`
- `workbench/docs/adr/000Z-overlapping-notepad-writes-are-refused-not-lost.md`
- `workbench/docs/adr/0018-the-wiki-is-the-knowledge-base.md`
- `workbench/docs/adr/0030-every-workbench-declares-a-design-concepts-collection.md`
- `workbench/docs/adr/0035-reduced-entry-and-assigned-autonomy.md`
- `workbench/docs/adr/0036-stances-change-method-not-authority.md`
- `workbench/docs/adr/0039-the-integration-branch-is-a-manifest-declared-fact.md`
- `workbench/docs/adr/0040-json-notepads-preserve-objective-continuity.md`
- `workbench/docs/adr/0041-visible-base62-workbench-identifiers.md`
- `workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md`
- `workbench/docs/adr/0055-workbench-update-requires-self-drift-check.md`
- `workbench/docs/adr/HISTORY.md`
- `workbench/docs/adr/REGISTER.md`
- `workbench/docs/adr/archive/0002-binding-rules-stay-in-current-controls.md`
- `workbench/docs/adr/archive/0013-seven-file-workbench-contract.md`
- `workbench/docs/adr/archive/0025-planes-classify-claims-not-whole-artifacts.md`
- `workbench/docs/adr/archive/0033-workbench-contract-is-a-claim-set.md`
- `workbench/docs/adr/proposed/000E-the-frontier-is-the-active-landscape-and-taskboard-renders-it.md`
- `workbench/docs/adr/proposed/000Q-github-issues-are-the-required-live-coordination-authority.md`
- `workbench/docs/ddr/000F-a-fresh-session-loads-only-the-context-its-work-needs.md`
- `workbench/docs/ddr/000M-working-artifacts-are-scaffolding-cleared-away-once-their-knowledge-is-kept.md`
- `workbench/docs/ddr/000R-llm-workbench-owns-what-a-workbench-is-the-project-owns-what-it-says-and-may-add-without-tearing-apart-what-works.md`
- `workbench/docs/ddr/000T-the-workbench-is-an-agentic-management-system-not-a-harness.md`
- `workbench/docs/ddr/000U-a-project-is-a-room-and-the-workbench-is-the-table-in-it.md`
- `workbench/docs/ddr/000W-rooms-nest-and-a-parent-workbench-owns-what-its-children-share.md`
- `workbench/docs/ddr/000X-every-workbench-is-built-to-run-as-one-room-among-many-in-an-autonomous-factory-the-foundry.md`
- `workbench/docs/ddr/001C-agents-md-is-the-map-and-the-only-contract-file.md`
- `workbench/docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md`
- `workbench/docs/ddr/HISTORY.md`
- `workbench/docs/ddr/REGISTER.md`

#### Feedback reports (`workbench/feedback/`): 22 files

Append-only feedback records keep their wording.

- `workbench/feedback/REPORT-boundaries-2026-09-05.md`
- `workbench/feedback/REPORT-cic-v3-1-1-adoption-2026-09-05.md`
- `workbench/feedback/REPORT-decision-triage-2026-09-07.md`
- `workbench/feedback/REPORT-foundation-question-review-2026-09-11.md`
- `workbench/feedback/REPORT-original-foundation-audit-2026-09-10.md`
- `workbench/feedback/REPORT-upstream-v3-1-1-summary-2026-09-06.md`
- `workbench/feedback/REPORT-v3-1-1-acceptance-2026-09-05.md`
- `workbench/feedback/REPORT-v3-1-1-adoption-2026-09-05.md`
- `workbench/feedback/decision-triage-2026-09-07.csv`
- `workbench/feedback/decision-triage-2026-09-07.json`
- `workbench/feedback/decision-triage-second-pass-2026-09-07/automatically-resolved.md`
- `workbench/feedback/decision-triage-second-pass-2026-09-07/candidate-register.json`
- `workbench/feedback/decision-triage-second-pass-2026-09-07/candidate-register.md`
- `workbench/feedback/decision-triage-second-pass-2026-09-07/changes-from-first-pass.md`
- `workbench/feedback/decision-triage-second-pass-2026-09-07/clusters.json`
- `workbench/feedback/decision-triage-second-pass-2026-09-07/decision-ledger.csv`
- `workbench/feedback/decision-triage-second-pass-2026-09-07/decision-ledger.json`
- `workbench/feedback/decision-triage-second-pass-2026-09-07/decision-ledger.md`
- `workbench/feedback/decision-triage-second-pass-2026-09-07/evidence-index.json`
- `workbench/feedback/decision-triage-second-pass-2026-09-07/first-pass-snapshot.json`
- `workbench/feedback/decision-triage-second-pass-2026-09-07/historical-inventory-snapshot.json`
- `workbench/feedback/original-foundation-audit-2026-09-10.evidence.json`

#### Landmark cards and tracker (`workbench/landmark-tracker/`): 88 files

Destination Question Cards keep their wording; `TRACKER.json` is generated from them.

- `workbench/landmark-tracker/TRACKER.json`
- `workbench/landmark-tracker/destination-questions/DQC-000A.json`
- `workbench/landmark-tracker/destination-questions/DQC-000B.json`
- `workbench/landmark-tracker/destination-questions/DQC-000F.json`
- `workbench/landmark-tracker/destination-questions/DQC-000I.json`
- `workbench/landmark-tracker/destination-questions/DQC-000K.json`
- `workbench/landmark-tracker/destination-questions/DQC-000M.json`
- `workbench/landmark-tracker/destination-questions/DQC-000O.json`
- `workbench/landmark-tracker/destination-questions/DQC-000T.json`
- `workbench/landmark-tracker/destination-questions/DQC-000U.json`
- `workbench/landmark-tracker/destination-questions/DQC-000V.json`
- `workbench/landmark-tracker/destination-questions/DQC-000W.json`
- `workbench/landmark-tracker/destination-questions/DQC-000X.json`
- `workbench/landmark-tracker/destination-questions/DQC-000Z.json`
- `workbench/landmark-tracker/destination-questions/DQC-001A.json`
- `workbench/landmark-tracker/destination-questions/DQC-001E.json`
- `workbench/landmark-tracker/destination-questions/DQC-001F.json`
- `workbench/landmark-tracker/destination-questions/DQC-001G.json`
- `workbench/landmark-tracker/destination-questions/DQC-001H.json`
- `workbench/landmark-tracker/destination-questions/DQC-001I.json`
- `workbench/landmark-tracker/destination-questions/DQC-001J.json`
- `workbench/landmark-tracker/destination-questions/DQC-001K.json`
- `workbench/landmark-tracker/destination-questions/DQC-001L.json`
- `workbench/landmark-tracker/destination-questions/DQC-001M.json`
- `workbench/landmark-tracker/destination-questions/DQC-001N.json`
- `workbench/landmark-tracker/destination-questions/DQC-001O.json`
- `workbench/landmark-tracker/destination-questions/DQC-001P.json`
- `workbench/landmark-tracker/destination-questions/DQC-001S.json`
- `workbench/landmark-tracker/destination-questions/DQC-001T.json`
- `workbench/landmark-tracker/destination-questions/DQC-001V.json`
- `workbench/landmark-tracker/destination-questions/DQC-001W.json`
- `workbench/landmark-tracker/destination-questions/DQC-001X.json`
- `workbench/landmark-tracker/destination-questions/DQC-001Z.json`
- `workbench/landmark-tracker/destination-questions/DQC-002A.json`
- `workbench/landmark-tracker/destination-questions/DQC-002B.json`
- `workbench/landmark-tracker/destination-questions/DQC-002D.json`
- `workbench/landmark-tracker/destination-questions/DQC-002E.json`
- `workbench/landmark-tracker/destination-questions/DQC-002F.json`
- `workbench/landmark-tracker/destination-questions/DQC-002I.json`
- `workbench/landmark-tracker/destination-questions/DQC-002J.json`
- `workbench/landmark-tracker/destination-questions/DQC-002L.json`
- `workbench/landmark-tracker/destination-questions/DQC-002M.json`
- `workbench/landmark-tracker/destination-questions/DQC-002N.json`
- `workbench/landmark-tracker/destination-questions/DQC-002O.json`
- `workbench/landmark-tracker/destination-questions/DQC-002P.json`
- `workbench/landmark-tracker/destination-questions/DQC-002Q.json`
- `workbench/landmark-tracker/destination-questions/DQC-002R.json`
- `workbench/landmark-tracker/destination-questions/DQC-002S.json`
- `workbench/landmark-tracker/destination-questions/DQC-002T.json`
- `workbench/landmark-tracker/destination-questions/DQC-002U.json`
- `workbench/landmark-tracker/destination-questions/DQC-002W.json`
- `workbench/landmark-tracker/destination-questions/DQC-002Z.json`
- `workbench/landmark-tracker/destination-questions/DQC-003C.json`
- `workbench/landmark-tracker/destination-questions/DQC-003D.json`
- `workbench/landmark-tracker/destination-questions/DQC-003J.json`
- `workbench/landmark-tracker/destination-questions/DQC-003K.json`
- `workbench/landmark-tracker/destination-questions/DQC-003L.json`
- `workbench/landmark-tracker/destination-questions/DQC-003M.json`
- `workbench/landmark-tracker/destination-questions/DQC-003N.json`
- `workbench/landmark-tracker/destination-questions/DQC-003P.json`
- `workbench/landmark-tracker/destination-questions/DQC-003R.json`
- `workbench/landmark-tracker/destination-questions/DQC-003T.json`
- `workbench/landmark-tracker/destination-questions/DQC-003W.json`
- `workbench/landmark-tracker/destination-questions/DQC-003X.json`
- `workbench/landmark-tracker/destination-questions/DQC-004F.json`
- `workbench/landmark-tracker/destination-questions/DQC-004J.json`
- `workbench/landmark-tracker/destination-questions/DQC-004K.json`
- `workbench/landmark-tracker/destination-questions/DQC-004M.json`
- `workbench/landmark-tracker/destination-questions/DQC-004O.json`
- `workbench/landmark-tracker/destination-questions/DQC-004P.json`
- `workbench/landmark-tracker/destination-questions/DQC-004Q.json`
- `workbench/landmark-tracker/destination-questions/DQC-004S.json`
- `workbench/landmark-tracker/destination-questions/DQC-005D.json`
- `workbench/landmark-tracker/destination-questions/DQC-005G.json`
- `workbench/landmark-tracker/destination-questions/DQC-005L.json`
- `workbench/landmark-tracker/destination-questions/DQC-005M.json`
- `workbench/landmark-tracker/destination-questions/DQC-005P.json`
- `workbench/landmark-tracker/destination-questions/DQC-005Q.json`
- `workbench/landmark-tracker/destination-questions/DQC-005S.json`
- `workbench/landmark-tracker/destination-questions/DQC-005V.json`
- `workbench/landmark-tracker/destination-questions/DQC-005W.json`
- `workbench/landmark-tracker/destination-questions/DQC-005Y.json`
- `workbench/landmark-tracker/destination-questions/DQC-005Z.json`
- `workbench/landmark-tracker/destination-questions/DQC-006A.json`
- `workbench/landmark-tracker/destination-questions/DQC-006K.json`
- `workbench/landmark-tracker/destination-questions/DQC-006L.json`
- `workbench/landmark-tracker/destination-questions/DQC-006M.json`
- `workbench/landmark-tracker/destination-questions/DQC-006N.json`

#### Landmark records (`workbench/landmarks/`): 12 files

LANDMARK.md history rows (and, in Repo is the System of Record, the destination prose quoting the retirement decision) keep their wording; none links a Lexicon heading.

- `workbench/landmarks/LMK-000Y-repo-is-the-system-of-record/LANDMARK.md`
- `workbench/landmarks/LMK-000Z-progressive-disclosure/LANDMARK.md`
- `workbench/landmarks/LMK-001A-durable-plans/LANDMARK.md`
- `workbench/landmarks/LMK-001B-agent-to-agent-review/LANDMARK.md`
- `workbench/landmarks/LMK-001C-mechanical-enforcement/LANDMARK.md`
- `workbench/landmarks/LMK-001D-learn-from-failure/LANDMARK.md`
- `workbench/landmarks/LMK-001E-agent-visible-runtime/LANDMARK.md`
- `workbench/landmarks/LMK-001F-continuous-cleanup/LANDMARK.md`
- `workbench/landmarks/LMK-001G-human-attention-minimized/LANDMARK.md`
- `workbench/landmarks/LMK-001H-multi-agent-and-provider-coordination/LANDMARK.md`
- `workbench/landmarks/LMK-001I-owner-idea-alignment/LANDMARK.md`
- `workbench/landmarks/LMK-001J-autonomous-execution/LANDMARK.md`

#### Session records (`workbench/sessions/`): 4 files

Checkpoints and the grilling destination audit ledger are retained history.

- `workbench/sessions/checkpoints/llm-workbench-v3-1-plan-2026-09-04.md`
- `workbench/sessions/checkpoints/workbench-boundaries-grilling-2026-09-04.md`
- `workbench/sessions/checkpoints/workbench-boundaries-redesign-2026-09-04.md`
- `workbench/sessions/grilling-destination-audit-ledger.json`

#### Grill Board data (`workbench/grill-board/items.json`): 1 file

Owner question and answer records keep their wording; its artifact catalog entry follows `tools/grill-board.mjs` (TK-009F) when the board regenerates it through its tool.

- `workbench/grill-board/items.json`

#### Wiki archive (`workbench/wiki/archive/`): 2 files

Archived Wiki pages keep their wording.

- `workbench/wiki/archive/host-memory-audit-2026-09-26.md`
- `workbench/wiki/archive/workbench-original-workflow-reference.md`

#### Generated projection (`TASKBOARD.md`): 1 file

Regenerated by `render` from Spec state; mentions are Spec slugs and latest events.

- `TASKBOARD.md`

#### Decision records naming `LEXICON.md` in `canonicalized_in`

- `workbench/docs/adr/0001-planes-classify-operations-not-artifacts.md`
- `workbench/docs/adr/000A-active-adr-decisions-and-destination-blueprints.md`
- `workbench/docs/adr/000B-the-workbench-root-surface-is-eight-files-and-contract-membership-is-separate-from-root-placement.md`
- `workbench/docs/adr/000C-the-workbench-contract-is-the-obligation-claim-set-carried-by-three-root-controls-and-the-assigned-spec.md`
- `workbench/docs/adr/000D-the-ownership-map-is-an-exhaustive-type-level-framework-answered-by-structured-query.md`
- `workbench/docs/adr/000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md`
- `workbench/docs/adr/000G-blueprint-spec-and-task-are-three-altitudes-of-one-delivery-chain.md`
- `workbench/docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md`
- `workbench/docs/adr/000I-record-lifecycle-is-expressed-by-folder-location-with-permanent-archive-and-transient-retired.md`
- `workbench/docs/adr/000K-every-feedback-finding-carries-one-of-four-dispositions.md`
- `workbench/docs/adr/000L-a-notepad-belongs-to-its-objective-and-every-chat-working-that-objective-writes-to-it.md`
- `workbench/docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md`
- `workbench/docs/adr/000N-landmark-tracker-connects-evolving-understanding-to-durable-knowledge.md`
- `workbench/docs/adr/000P-roles-scope-work-and-stances-define-the-job.md`
- `workbench/docs/adr/000R-the-wiki-is-the-evolving-synthesis-every-agent-reads-and-updates.md`
- `workbench/docs/adr/000S-destination-decision-records-are-decision-records-beside-adrs.md`
- `workbench/docs/adr/000T-records-share-one-set-of-read-words-list-show-search-history-and-inspect.md`
- `workbench/docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md`
- `workbench/docs/adr/000V-captain-director-dispatcher-and-worker-scope-work-and-role-skills-own-each-job.md`
- `workbench/docs/adr/000W-contract-carriers-are-briefs-that-point-to-skills-and-authority-flows-through-the-pointer.md`
- `workbench/docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md`
- `workbench/docs/adr/000Y-a-locked-and-confirmed-answer-is-promoted-without-further-ceremony.md`
- `workbench/docs/adr/0018-the-wiki-is-the-knowledge-base.md`
- `workbench/docs/adr/0030-every-workbench-declares-a-design-concepts-collection.md`
- `workbench/docs/adr/0035-reduced-entry-and-assigned-autonomy.md`
- `workbench/docs/adr/0036-stances-change-method-not-authority.md`
- `workbench/docs/adr/0039-the-integration-branch-is-a-manifest-declared-fact.md`
- `workbench/docs/adr/0040-json-notepads-preserve-objective-continuity.md`
- `workbench/docs/adr/0041-visible-base62-workbench-identifiers.md`
- `workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md`
- `workbench/docs/adr/0055-workbench-update-requires-self-drift-check.md`
- `workbench/docs/adr/archive/0013-seven-file-workbench-contract.md`
- `workbench/docs/adr/archive/0025-planes-classify-claims-not-whole-artifacts.md`
- `workbench/docs/adr/archive/0033-workbench-contract-is-a-claim-set.md`
- `workbench/docs/adr/proposed/000E-the-frontier-is-the-active-landscape-and-taskboard-renders-it.md`
- `workbench/docs/adr/proposed/000Q-github-issues-are-the-required-live-coordination-authority.md`
- `workbench/docs/ddr/000W-rooms-nest-and-a-parent-workbench-owns-what-its-children-share.md`

### Open Specs whose planned work edits or names the Lexicon (coordination)

Their records stay history; each owner re-points its own planned Lexicon work to GLOSSARY.md, ARCHITECTURE.md or the Wiki as it runs. This Spec does not take over their delivery.

| Spec | Planned Lexicon work | New owner |
|---|---|---|
| S-004C Contract Carrier Pointer-Brief Rewrite | Owns the wider AGENTS and Runbook rewrite and the `lexicon` home kind of its own inventories. | Its AGENTS Instruction Authority edit and this Spec's TK-009F must agree on removing the Lexicon. |
| S-004E AI Coding Dictionary Terms | Adds AI Coding Terms rows to the Lexicon (active writer). | General terms to Wiki articles; any distinct local meaning to GLOSSARY.md. TK-009H re-scaffolds its rows. |
| S-004G Workbench Terms And Workflow Verbs | Adds Workbench term and workflow verb rows (active writer). | GLOSSARY.md entries; explanation to Wiki lexicon articles. TK-009H re-scaffolds its rows. |
| S-004K Workbench Term Dictionary Pages | Brief Lexicon rows plus long dictionary pages. | Brief definitions become GLOSSARY.md entries; long pages are the Wiki lexicon articles TK-009D shapes. |
| S-01U Lexicon Design-Concept Reconciliation | Whole-Lexicon audit against design concepts. | Audits GLOSSARY.md and ARCHITECTURE.md after migration. |
| S-003O lexicon skill alignment | The `lexicon` skill (provider catalog, not in the tracked lane) loads the Lexicon. | GLOSSARY.md; acceptance stays in S-003O. |
| S-003L ubiquitous-language skill alignment | The `ubiquitous-language` skill writes the owning Lexicon. | GLOSSARY.md through promotion; acceptance stays in S-003L. |
| S-004J Required Domain Modeling Skill | The `domain-modeling` skill names `LEXICON.md`. | GLOSSARY.md (Matt's reference) and ADRs; acceptance stays in S-004J. |
| S-002U PR skill adoption | Reads the delivered glossary. | GLOSSARY.md once delivered. |
| S-00G Ownership Map Root Control | Moves the Artifact Ownership Schema out of the Lexicon. | ARCHITECTURE.md ownership table (TK-009B) is the source it starts from. |
| S-004H Blueprint Short Page | Descriptions of the Blueprint in the Lexicon's Blueprint row and Template mirror. | GLOSSARY.md Blueprint entry. |

## Live mentions after removal (TK-009H)

A fresh `git grep -a -l LEXICON` over the files the TK-009F live-link check treats as live finds no link to the Lexicon (that check passes) and these mentions, each kept for its reason:

| Files | Why the mention stays |
|---|---|
| `workbench/tools/workbench-layout.mjs`, `tools/workbench-adoption.mjs`, `tools/workbench-classify.mjs`, `templates/ADOPTION.md`, `workbench/skills/update-harness/SKILL.md`, `workbench/skills/workbench-room-checks/SKILL.md` (Lexicon retirement and harness-shaped paragraphs) | A room built before the retirement may still hold `LEXICON.md`; the update route and Adoption retire it only after its lines land, and classification reads it as the earlier control set. The Template Lexicon is read from release history. |
| `workbench/tools/adr.mjs`, `workbench/tools/spec-workbench.mjs`, `workbench/tools/self-drift.mjs` | Optional legacy file: reference repair and self-drift read `LEXICON.md` only if present. `adr.mjs` also keeps a missing root `LEXICON.md` named in an accepted record's `canonicalized_in` as history (TK-009H), since those records keep that history unchanged. |
| `tools/check-carrier-landing.mjs`, `tools/test-carrier-landing.mjs`, `RUNBOOK.md` and `workbench/skills/workbench-room-checks/SKILL.md` (Carrier line-landing check) | The landing check keeps the retired Lexicons as supported historical carriers, checked from their pre-removal base. |
| `workbench/skills/domain-modeling/SKILL.md`, `workbench/skills/domain-modeling/GLOSSARY-FORMAT.md`, `workbench/wiki/skill-domain-modeling.md`, `tools/test-domain-modeling-skill.mjs` | The GLOSSARY-else-LEXICON fallback for a room the update has not reached, owned and pinned by S-004J. |
| `tools/grill-board.mjs`, `tools/test-grill-board.mjs`, `workbench/grill-board/README.md`, `workbench/grill-board/index.html`, `workbench/grill-board/items.json`, `workbench/wiki/MEMORY.md` (Grill Board reading pages) | The Grill Board's `lexicon` group, left unchanged while the owner has uncommitted board edits; a recorded gap. `tools/test-grill-board.mjs` passes. |
| `tools/test-adr.mjs`, `tools/test-control-fidelity.mjs`, `tools/test-genesis-from-decisions.mjs`, `tools/test-governance-core.mjs`, `tools/test-self-drift.mjs`, `tools/test-wiki.mjs`, `tools/test-workbench-adoption.mjs`, `tools/test-workbench-layout.mjs`, `tools/test-workbench-upgrade.mjs` | Negative assertions (no Lexicon link, Instruction Authority names no Lexicon), legacy-room fixtures, the `canonicalized_in` history check, and the Template Lexicon read from release history; none reads a Lexicon file of this checkout. |
| `workbench/skills/README.md` | The `lexicon` skill catalog row says "Lexicon" names the retired root control. |
| `workbench/wiki/design-concepts/landmark-context-map.md`, `workbench/wiki/skill-make-it-so.md`, `workbench/wiki/skills-draft/main-workflow/pr.md` | History: a quoted card revision, a recorded scenario, and a draft owned by S-002U that says not to substitute the Lexicon. |

Spec records stay history under the live-link check; `doctor` reports four of them as attention-only `broken-link` findings once `LEXICON.md` is gone (S-002H, S-01A, S-01T and S-01U link `../../../LEXICON.md`, S-01A to a heading), which their owners re-point or keep.

## Totals

- Files that read or link the Lexicon at the base: 530.
- Live consumers re-pointed or kept by a named Task: 119 (including the two carriers TK-009H removes and the three landing-check files this Task updated and keeps).
- History records kept unchanged: 411.


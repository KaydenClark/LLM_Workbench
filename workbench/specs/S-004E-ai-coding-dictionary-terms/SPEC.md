# S-004E - AI Coding Dictionary Terms

**Spec ID:** S-004E
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-10-03
**Catalog description:** Put the owner's agreed meanings for AI Coding Dictionary terms into the Lexicon, with a Wiki dictionary entry wherever a term needs more than its row, starting with nineteen model, harness and session terms.
**Blockers:** none for specification. The owner chooses whether the Workbench still calls itself a harness; only the Workbench, Portable Workbench, Evaluation and Harness rows and their mirrors wait on that answer. Implementation awaits Plan and assignment.
**Latest event:** Authored at the Map step from the owner's first batch of nineteen terms, supplied in chat on 2026-10-03; no Task is cut.
**Next gate:** At Plan, take the owner's harness answer, inspect live Actuality, confirm which terms get Wiki entries and whether the template Lexicon mirrors the new rows, and cut small Tasks.

> **Citation anchors.** pre=`817096e676992cf7ece72967ac8bbb064261a3ee` post=`817096e676992cf7ece72967ac8bbb064261a3ee`.

## Outcome

When an agent or the owner uses one of these words in the Workbench, it means one thing: the meaning the owner agreed on. The Lexicon states that meaning in Workbench words, says how the term differs from its neighbors, and links the dictionary entry it came from. Where a term needs more than its row, a Wiki dictionary entry explains what the term means here and where the Workbench depends on it. Existing Workbench language that used one of these words for something else is reconciled, so no word means two things.

## Why It Matters

The owner supplied these terms as the words the Workbench should know the agreed meaning of. The Lexicon's Ownership Rules forbid using one term for two concepts, and today it already does so for one of them: the accepted [Contract carriers decision](../../docs/adr/000W-contract-carriers-are-briefs-that-point-to-skills-and-authority-flows-through-the-pointer.md) adopted four dictionary definitions on 2026-10-02 and says AGENTS.md is the file the harness loads into the context window at session start, while the Lexicon's Workbench row calls the Workbench itself "the operating harness".

Several accepted rules already rest on these mechanics without the Lexicon defining them. That decision keeps AGENTS.md short because everything in it is loaded on every turn and a long file costs tokens. `AGENTS.md` keeps a notepad for context whose loss would impair continuation and has it saved before token exhaustion can interrupt the conversation, and it forbids an agent-outcome claim without repeated controlled trials. Defining the words lets those rules point to one shared meaning.

## Owner-Supplied Terms

The owner pasted nineteen entries from the [AI Coding Dictionary](https://www.aihero.dev/ai-coding-dictionary) on 2026-10-03. The text matches the dictionary's source repository, [mattpocock/dictionary-of-ai-coding](https://github.com/mattpocock/dictionary-of-ai-coding), at commit `ed1ebed3975cba04ed5e74c6ca73659274beb754` (spot-checked by one distinctive sentence from each of five entries). That repository carries no license file, so the Workbench links each entry and states its meaning in its own words; it does not copy entry text into tracked files.

The summaries below are this Spec's intake record, not the definitions. The linked entry is the owner-supplied text; once delivered, the Lexicon row owns the Workbench meaning.

| Term | Agreed meaning, summarized | Where the Workbench meets it |
|---|---|---|
| [Model](https://www.aihero.dev/ai-coding-dictionary/model) | The trained parameters. It only predicts the next token, keeps no state, and cannot act on anything until a harness wraps it. Providers sell larger, more capable, slower and costlier tiers beside smaller, faster, cheaper ones, and the tier is a per-task choice. Disappointing output usually traces to the context or harness before the model. | Role and Task work; the Configured-host capability row's "model reliability". |
| [Parameters](https://www.aihero.dev/ai-coding-dictionary/parameters) | The numbers inside a model, also called weights. Training sets them and inference only reads them, so nothing in a session changes them; all built-in knowledge lives there and stops at the knowledge cutoff. Changing them means retraining, which yields in effect a different model. | Why project knowledge must arrive as context. |
| [Effort](https://www.aihero.dev/ai-coding-dictionary/effort) | A per-request setting for how much the model reasons before it answers. The reasoning is billed as output tokens even when hidden and is produced one token at a time, so more effort costs more and answers later. Too little gives a confident shallow answer on a hard problem; too much wastes time on rote work. Set it for the hard part of a task, not the whole session. | Choosing effort per role or operation. |
| [Inference](https://www.aihero.dev/ai-coding-dictionary/inference) | Running a trained model to produce output, on every model provider request. The parameters are read-only, so a correction made today is not learned for tomorrow. It is billed per token, is the main cost of use, and every tool round trip is another inference over the whole context. | Why continuity is written down; why context size is a cost question. |
| [Token](https://www.aihero.dev/ai-coding-dictionary/token) | The unit a model reads and writes, produced by a fixed tokenizer vocabulary. About three-quarters of an English word on average, but unusual strings such as hashes, generated identifiers and encoded data split into many. Context size, cost and speed are all counted in tokens. Avoid "word". | The Progressive disclosure row's per-token cost; long identifiers in always-loaded files. |
| [Next-token prediction](https://www.aihero.dev/ai-coding-dictionary/next-token-prediction) | The model's only operation: it samples one next token from the context, appends it and runs again, so every output, a tool call included, is built a token at a time. It picks what is likely, not what is true, which is where hallucination and run-to-run variation come from. | Why a tool call is text the harness parses. |
| [Non-determinism](https://www.aihero.dev/ai-coding-dictionary/non-determinism) | The same input can give different output, because each token is sampled and provider-side serving adds variation; no setting removes it. Results from the same task spread across a distribution, so a retry is a legitimate strategy and automated checks must catch the bad draws. A run of bad results is usually the distribution, not a worse model. | Why verification is required and one passing run is not proof. |
| [Model provider](https://www.aihero.dev/ai-coding-dictionary/model-provider) | Whatever serves a model for inference, remote or local; the harness asks a provider rather than running the model itself. Rate limits, capacity and outages live there, as do pricing, cache discounts and which models exist. The provider need not be the model's maker. | The Workbench's bare "provider" means Claude or Codex, not this (see Current Verified State). |
| [Harness](https://www.aihero.dev/ai-coding-dictionary/harness) | Everything around the model that makes it an agent: tools, system prompt, context-window management, permissions and hooks. It assembles each request, runs the tool calls the model asks for, feeds results back, stores session history, asks for permission and decides when to compact. Claude Code, Codex CLI, Cursor and Claude.ai are harnesses; AGENTS.md files, permission settings and hooks are instructions to the harness. When behavior changes, the harness is often the variable. | The Workbench, Portable Workbench and Evaluation rows, and host language (see Current Verified State). |
| [Input tokens](https://www.aihero.dev/ai-coding-dictionary/input-tokens) | The tokens the harness sends on each request: system prompt, history and tool results. Cheaper per token than output, yet usually most of the bill, because the stateless model is re-sent the whole session every turn. The prefix cache, clearing and compaction reduce it. | Always-loaded control size. |
| [Output tokens](https://www.aihero.dev/ai-coding-dictionary/output-tokens) | The tokens the model generates, including tool calls and hidden reasoning. Billed at a higher rate, commonly about five times input, and generated one at a time, so they set how long a turn takes. Emitting edits instead of whole files cuts the cost. | Effort and editing behavior. |
| [Cache tokens](https://www.aihero.dev/ai-coding-dictionary/cache-tokens) | Input tokens the provider reuses from an identical prefix of an earlier request, billed far below the input rate; they are what keep long sessions affordable. The cache matches exact prefixes only, so any change earlier in the conversation misses from that point on, and it expires after a few minutes idle. A cost jump shows first as cache tokens falling against input tokens. | Why always-loaded content should stay stable across a session. |
| [Stateless](https://www.aihero.dev/ai-coding-dictionary/stateless) | Carries nothing forward. The model is stateless across requests and can never learn from a session; an agent is stateless across sessions unless something is written down. The feeling of continuity inside a session is the harness re-sending the transcript. To make a correction stick, write it where every future session reads it. Counterpart of stateful. | AGENTS.md, notepads, handoffs and the Wiki as the written-down layer. |
| [Context](https://www.aihero.dev/ai-coding-dictionary/context) | The information relevant to the task that the agent has right now. Distinct from the context window, the literal token sequence, and from the session, the running history. A measure of quality, not quantity: most failures trace to a needed fact never loaded or buried. | Context Map, Enduring Context and Working context are different terms (see Current Verified State). |
| [Context window](https://www.aihero.dev/ai-coding-dictionary/context-window) | Everything the model sees on one request: a single finite, model-specific token sequence of system prompt, conversation and tool results, and its only way to perceive anything. It fills as the session runs until compaction or clearing, and every token competes for attention, so it is a budget. Avoid "memory". | Progressive disclosure and context pointers. |
| [Stateful](https://www.aihero.dev/ai-coding-dictionary/stateful) | Carries information forward. A session is stateful across turns; an agent becomes stateful across sessions only through a memory system that writes to the environment and reloads it; the model never is. Each layer's state is re-read from the layer below. Carried state carries early mistakes too, which is why clearing discards it. Counterpart of stateless. | Notepads, the Wiki and AGENTS.md as cross-session state. |
| [Agent](https://www.aihero.dev/ai-coding-dictionary/agent) | A model given tools, a system prompt and a context window by a harness, taking turns with a user: the unit you talk to and delegate to. It names the model and harness addressed as one actor, not a mechanical part. Avoid "the AI" and "the bot". | Roles and stances are scopes and jobs assigned to an agent. |
| [System prompt](https://www.aihero.dev/ai-coding-dictionary/system-prompt) | The standing instructions the harness puts at the front of every request: identity, behavior, available tools and conventions. Usually written by the harness vendor and large; files such as AGENTS.md are loaded beside it. It stays fixed for a session, which starts the prefix cache, and models are trained to give it priority over user messages. | AGENTS.md and CLAUDE.md ride beside it. |
| [Session](https://www.aihero.dev/ai-coding-dictionary/session) | One bounded run of interaction with an agent. It starts empty, accumulates messages, tool results and files read, and ends when cleared, closed or compacted into a fresh session. It is what fills the context window, and its history is the agent's working memory, lost when it ends; only files survive. One task per session keeps the context relevant. | The Chat and Task rows, and "session" in AGENTS.md headings (see Current Verified State). |

The dictionary entries for AI, Training, Model provider request and Prefix cache sit between these terms in the source, and the supplied entries link to further terms such as turn, tool, tool call, tool result, compaction, clearing, handoff and memory system. The owner did not supply them in this batch; they are not adopted here.

## Current Verified State

At the pre anchor:

- `LEXICON.md` has no row for any of the nineteen terms. Its Core Terms hold rows for Skill, Progressive disclosure and Context pointer, three of the four definitions the Contract carriers decision adopted; the fourth, AGENTS.md, is stated in that decision. Those three rows are not mirrored in `templates/LEXICON.md`, which does carry the Design concept, Workbench and Chat rows.
- **Harness.** The Lexicon's Workbench row begins "A room: the operating harness that gives agents safe rules". The Lexicon has described the Workbench this way since its first version on 2026-07-16 ("The reusable operating harness"); the 2026-09-23 room definition kept the phrase, and the owner's room answer it records (TT-Q3) does not use the word harness. The Portable Workbench row calls it "A fully packaged, deployable agent harness", and the Evaluation responsibility row asks "Does this harness help agents complete better work?". `templates/LEXICON.md` carries the same Workbench row. `AGENTS.md` says "Harness design changes normally update both", "Harness changes also capture the guardrail baseline" and "This harness does not define a house visual style", and a core skill in the lane is named `update-harness`. The Contract carriers decision uses the dictionary sense.
- **Host.** The Lexicon uses "host" for the software an agent runs in (a Chat is a working context "in a host"; the host adapter row says CLAUDE.md "makes the shared entry or capability usable in a host") and for the machine (Host portability covers filesystems, Windows and POSIX paths and symlinked invocation).
- **Provider.** The Workbench uses bare "provider" for the agent family, Claude or Codex: `tools/cross-provider-resume.mjs` has "one provider plans and pushes" and "a different provider resumes", and the Lexicon's Normal setup row and the Runbook speak of the "provider home", the host's own skill directory.
- **Session.** The Chat row defines "One owner-visible working context in a host, in which participants have a Conversation. A Chat works at most one Task", and the Task row says "One Task is intended for one useful context and one Chat". The owner's TT-Q1 answer chose Chat from chat, task, thread and conversation; session was not among the options. `AGENTS.md` uses session for its "Session Records And Checkpoints" and "Long Session Control" sections, and the `sessions` support lane holds the grilling, handoffs, checkpoints, notepads and recovery collections.
- **Context.** The Lexicon defines Context Map (navigable relationships among Workbench concepts), Enduring Context (a Governance Plane) and the Working context responsibility (a notepad's job), and the Chat row calls a Chat a "working context".
- The Wiki routes skill entries as flat `skill-<name>.md` notes from `MEMORY.md`. Its schema says concept pages include "a page for any term that needs more than its Lexicon row"; no Wiki page defines any of the nineteen terms.

No implementation or agent-outcome proof for this capability is claimed by this Map record.

## Desired Behavior

1. Each term in an owner-supplied batch has exactly one Lexicon row in an `AI Coding Terms` section. The definition states the agreed meaning in Workbench words; the distinction cell says how it differs from its neighbors and carries any "Avoid" alias; the row links its dictionary entry. A short preamble names the source, the supply date and the batch, and says the link is attribution, not a live import: an upstream edit changes no Workbench meaning until the owner adopts it.
2. No word means two things. Where an existing row, its template mirror or a current-facing control line uses a batch term for a different concept, the Lexicon either rewrites that use to the agreed meaning or states the distinction explicitly:
   - **Harness:** the Workbench's self-description follows the owner's answer to the harness question in Decisions And Contracts, and the Workbench, Portable Workbench and Evaluation rows and the template mirror follow it; the owner's room wording is kept either way. "Host" is stated as the harness where it means the software and kept for the machine where it means the machine.
   - **Provider:** bare "provider" in the Workbench's existing names means the agent family; the Model provider row says so, and new prose says harness or model provider instead of bare provider.
   - **Session and Chat:** a Chat is the owner-visible working context; a session is one run of the context window inside it. A Chat normally holds one session and may hold more when the harness compacts or clears within it; a Task still maps to one Chat. This is an Inference from the two agreed definitions, stated as such in the row.
   - **Context:** the Context row distinguishes Context Map, Enduring Context and Working context.
3. A term gets a Wiki dictionary entry when it needs more than its row, per the Wiki schema: what it means here, where the Workbench depends on it, and links to its Lexicon row, its dictionary entry and the owning controls, in Workbench words with no copied entry text. Each is a flat note routed from `MEMORY.md` with a summary line. Provisional candidates for Plan to confirm: Harness, Session, Context, Context window, Stateless, Stateful, Cache tokens and Non-determinism.
4. Current-facing uses in `AGENTS.md` and `RUNBOOK.md` that conflict with an adopted meaning are inventoried. Each is corrected here with its meaning preserved, or recorded as drift for the [Contract Carrier Pointer-Brief Rewrite](../S-004C-contract-carrier-pointer-brief-rewrite/SPEC.md), whichever lands first; one writer per file.
5. Later batches: while this Spec is open, a later owner batch is appended to Owner-Supplied Terms as a dated table and gets its own Tasks. After this Spec completes, a later batch is a new linked Spec. Terms the Workbench already defines from or against the dictionary (Design concept, Skill, Progressive disclosure, Context pointer, AGENTS.md, Spec, Ticket, Handoff, Grilling) are reconciled under rule 2, never overwritten.

## Decisions And Contracts

- The owner's instruction of 2026-10-03 is the authority: the supplied entries are "definitions for words that we should know the agreed meaning of inside of our workbench". This Spec adopts them; it does not reopen them.
- The agreed meaning is the text as supplied on 2026-10-03, which matches the source repository at the pinned commit. The dictionary link is attribution.
- No tracked file reproduces dictionary entry text beyond a short attributed quotation, because the source carries no license. This follows the Contract carriers decision, which linked its four entries and restated them.
- Lexicon rows define; requirements and policy stay with their owners. Defining Effort or Model sets no model or effort policy for any role.
Open, the owner's choice: does the Workbench still call itself a harness? The adopted meaning makes Claude Code or Codex the harness, and the Lexicon has called the Workbench "the operating harness" since 2026-07-16.

- (a) Recommended: the Workbench is what a harness loads, not a harness. The Workbench, Portable Workbench and Evaluation rows, their template mirror and the `AGENTS.md` lines that call the Workbench a harness are reworded; the word then means one thing, matching the Contract carriers decision's usage. Public names such as `update-harness` stay until renamed separately.
- (b) The Workbench is the project layer of the harness. The dictionary itself says AGENTS.md files, permission settings and hooks are instructions to the harness, so the word stays, and every Workbench use carries a qualifier that tells the agent's harness from the project layer it loads. Less rewording now; a permanent qualifier on every use.

Open, decided at Plan:

- Whether `templates/LEXICON.md` mirrors the new rows. The dogfood boundary updates both unless an exemption is explained; the 2026-10-02 dictionary rows went to the root Lexicon only. The Workbench row change is mirrored either way, because the template carries that row.
- Which terms get Wiki entries, and whether they sit flat beside the router like the skill pages or in `design-concepts/`.

Not proposed here, for the owner if wanted: renaming the `update-harness` skill, the `sessions` lane or the cross-provider tools. Each is a public name, and a rename is its own change.

## Non-Goals

Copying dictionary entry text; adopting dictionary entries the owner has not supplied; renaming any skill, tool, lane, collection or file; changing the meaning of any rule; a model, effort or cost policy; the Contract carrier rewrite beyond the conflicting lines in Desired Behavior 4; implementing another capability.

## Dependencies And Blockers

- `LEXICON.md` is a shared writer. The [Lexicon Design-Concept Reconciliation](../S-01U-lexicon-design-concept-reconciliation/SPEC.md) audits the whole Lexicon, and the [Contract Carrier Pointer-Brief Rewrite](../S-004C-contract-carrier-pointer-brief-rewrite/SPEC.md) reshapes the carriers; keep one writer lane per file and land one Lexicon change in integration before the next begins.
- The [Wiki Evolving-Synthesis Migration](../S-003W-wiki-evolving-synthesis-migration/SPEC.md) moves Wiki notes and rewrites router summaries; write entries to the current schema and let that migration move them.
- None of these blocks this Spec from starting; the owner's harness answer blocks only the rows named in the header.

## Vertical Implementation Slices

No Tasks cut. At Plan, use current Actuality to cut small complete-path slices. A likely first slice is the `AI Coding Terms` section with the rows that collide with nothing (Model, Parameters, Effort, Inference, Token, Next-token prediction, Non-determinism, Input tokens, Output tokens, Cache tokens, Stateless, Stateful, Agent, System prompt, Context window); then Harness with its Workbench, host and provider reconciliation once the owner has answered; then Session and Context with their distinctions; then the Wiki entries. The empty tasks directory keeps this planned capability record-backed.

## Acceptance Criteria

- [ ] Each of the nineteen batch-one terms has exactly one Lexicon row in the `AI Coding Terms` section, stating its agreed meaning in Workbench words and linking its dictionary entry, under a preamble naming the source, supply date and no-live-import rule.
- [ ] No Lexicon row, template mirror row or current-facing control line uses a batch term for a different concept without an explicit distinction; the Workbench's self-description follows the owner's harness answer, and host, provider, session and context uses are reconciled as Desired Behavior 2 states.
- [ ] Every term selected at Plan has a Wiki entry that passes `wiki.mjs validate`, is routed from `MEMORY.md` with a summary line, links its Lexicon row, dictionary entry and owning controls, and was linted as a touched page.
- [ ] A mechanical comparison against the entries at the pinned commit finds no copied passage in any tracked file beyond a short attributed quotation.
- [ ] The template mirror carries the generic rows, or the exemption is recorded with its reason.
- [ ] A fresh agent given only the Lexicon and Wiki answers two probes with the Workbench meaning: why Claude Code and Claude.ai behave differently on the same model, and why the Workbench writes continuity to files.
- [ ] Named verification and remaining limitations are recorded without claiming owner approval.

## Testing Seams

`LEXICON.md`, `templates/LEXICON.md` and the Wiki notes. A check that each batch term has exactly one row with one dictionary link; a sweep of current-facing controls for "harness" in the Workbench sense, shaped like the retired-term sweep in `tools/test-controls-vocabulary-sweep.mjs`, with each deliberately kept line excused by its exact text; `wiki.mjs validate`; a copied-passage comparison run against a fetched copy of the pinned entries outside the repository; and the two cold-reader probes. String checks support the reconciliation but do not prove a reader understands the terms.

## Verification Procedure

Run the targeted vocabulary and Wiki tests and the full AGENTS suite against the committed candidate, then `render` and `doctor`. Lint every touched Wiki page. Capture Workbench self-drift pre and post receipts with the bounded semantic check. Obtain separate-context review of the immutable candidate before integration, and keep owner Human QA separate. This Map record claims none of that proof.

## Documentation Impact

This Spec changes `LEXICON.md` (a new section, reconciled rows and the Last reviewed date), `templates/LEXICON.md` or a recorded exemption, the Wiki entries and `MEMORY.md` router, and any conflicting `AGENTS.md` or `RUNBOOK.md` lines it corrects rather than hands to the carrier rewrite.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-03 | none | Authored at the Map step from the owner's first batch of nineteen AI Coding Dictionary terms, supplied in chat on 2026-10-03, at integration 817096e676992cf7ece72967ac8bbb064261a3ee. | Map only; the nineteen entry links were read from the dictionary index, the supplied text was spot-checked against the source repository at ed1ebed3975cba04ed5e74c6ca73659274beb754, and the quoted Lexicon, template, AGENTS and tool lines were read at the pre anchor; no runtime proof claimed. | This Spec and the Spec catalog. | Plan, implementation and proof remain; the owner's harness answer, the template mirror and Wiki entry selection are open. |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

The dictionary holds more entries than this batch, and the owner has said more are coming; they join this Spec while it is open and a new linked Spec afterwards. Renaming public names that still say harness, session or provider is a separate change if the owner wants it.

## Supersession

- Supersedes: none
- Superseded by: none

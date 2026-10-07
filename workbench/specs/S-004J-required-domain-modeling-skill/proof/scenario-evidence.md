# Domain-modeling fresh-context scenario evidence (TK-00JB)

Behavior proof for the Required Domain Modeling Skill Spec (S-004J), acceptance
lines 3, 4, 5, 7 and 8, recorded 2026-10-07 by Task TK-00JB.

## Method

- **Rooms.** Each run used a fresh disposable room built outside the repository
  by [scenario-room.mjs](scenario-room.mjs) from the worktree at commit
  `bc3abc64c139143ca59b972e7c4a6a60594f522a` (assembly `claude/s004j-assembly`
  after TK-00JA). The script lays out the room, installs the managed runtime
  tools and the skills lane with both discovery adapters (lane
  `domain-modeling` content hash `44ec1433e5dfafcbf44436b682d7015c1bb6902fe89c5b017300983e444a8636`),
  fills root controls from the checkout's templates, and adds a synthetic
  invoicing project, Ledgerline: Lexicon terms Customer, Account, Invoice,
  Payment, Settlement and Billing Run; Spec S-001 "Invoice Settlement"; source
  and tests using those names; an accepted ADR "Invoices belong to Accounts,
  not Customers"; a Wiki article. Variant A keeps the Lexicon as the
  vocabulary owner; variant B adds a root `GLOSSARY.md` in the upstream
  glossary format. The room is committed; `doctor` passes. Scenario 1's
  reruns used rooms built the same way from later commits: run 2 from
  `2d92a3d370274a30afc1bb5358c744ac00a1cef4` (the corrected skill after the
  review's first verdict) and run 3 from
  `7188bc639f17614e73f9d75ab861b6f0e0bc59b7` (trace wording sharpened).
- **Fresh contexts.** [run-scenario.mjs](run-scenario.mjs) drives each
  scenario as a new headless Claude Code session started inside the room
  (`claude -p`, later turns `--resume SESSION`), with
  `--setting-sources project,local` so only the room's own skills are
  discovered (the session's skill list contained the room lane and built-ins,
  not the personal catalog), and permission checks bypassed inside the
  disposable room so any write is the agent's choice. The owner invoked skills
  by slash command; each session transcript records the loaded skill's base
  directory, which was always the room's `.claude/skills/<name>`.
- **Observation.** After every turn the runner records the agent's reply, tool
  calls, `git status --porcelain --untracked-files=all`, the diff, every local
  notepad, and a search for shadow vocabulary stores. Raw event streams stay
  in scratch; [curate-run.mjs](curate-run.mjs) reduced each run to a
  path-sanitized JSON record linked below. Assertions are on observed turns
  and room diffs, not exact prose.
- **Model and CLI.** `claude-opus-5-5`, Claude Code 2.1.287, default effort.
  Session cost reported by the CLI for the first eight runs: about 18 USD;
  scenario 1 runs 2 and 3: 1.97 and 2.15 USD.

## Results

| Scenario (acceptance line) | Runs | Result | Evidence |
|---|---|---|---|
| 1. Trace a boundary and a rename before the owner chooses (3) | 3 (A) | PASS on run 3 only: runs 1 and 2 did not name the tests; run 3, after the trace wording was sharpened, did | [observations](scenarios/s1-trace/observations.md), [run1-A](scenarios/s1-trace/run1-A.json), [run2-A](scenarios/s1-trace/run2-A.json), [run3-A](scenarios/s1-trace/run3-A.json) |
| 2. Conflict, overload, edge case and a classified behavior claim (4) | 1 (A) | PASS | [observations](scenarios/s2-challenges/observations.md), [run1-A](scenarios/s2-challenges/run1-A.json) |
| 3. Capture, correction, confirmation and promotion (5) | 2 (A) + 2 (B) | Capture, correction and confirmation PASS in all four. Promotion: Lexicon fallback through the promote tool PASS (A, 2 runs); variant B reached `GLOSSARY.md` by a manual write after the promote tool refused. Tool promotion verified only for the Lexicon fallback | [observations](scenarios/s3-capture-promotion/observations.md), [run1-A](scenarios/s3-capture-promotion/run1-A.json), [run1-B](scenarios/s3-capture-promotion/run1-B.json), [run2-A](scenarios/s3-capture-promotion/run2-A.json), [run2-B](scenarios/s3-capture-promotion/run2-B.json) |
| 4. Decision records: three declined, one offered by the scope test (7) | 1 (A) | PASS | [observations](scenarios/s4-decision-records/observations.md), [run1-A](scenarios/s4-decision-records/run1-A.json) |
| 5. Grilling without the skill; no shadow store in any run (8) | 1 (A) + all rooms | PASS | [observations](scenarios/s5-without-skill/observations.md), [run1-A](scenarios/s5-without-skill/run1-A.json) |

Highlights:

- **Trace (1).** Run 1 traced the Customer-level Invoice boundary to the ADR,
  five Lexicon rows, `BLUEPRINT.md` lines 17-18, Spec S-001's acceptance lines
  and Task, and `accountId` and the cross-Account guard in `src/billing/`, but
  named the tests only as "two current tests" and "both test files". Run 2, on
  the corrected skill, did the same. The skill's trace wording was then
  sharpened to name each owner by path and each test by file and test name.
  Run 3 then named every owner by path, with lines for the Lexicon,
  Blueprint, Spec and source, and the tests `tests/invoice.test.js` "an Invoice
  is issued against exactly one Account" and `tests/settlement.test.js` "a
  Settlement never crosses Accounts", before the owner chose. Room diff empty
  in every run.
- **Challenges (2).** Each owner turn drew its own challenge, quoting
  `LEXICON.md` lines; the partial-Settlement claim was run against
  `settle()` and classified as an implementation gap, citing
  `src/billing/settlement.js:14` and the test that requires the current
  behavior.
- **Capture and promotion (3).** In all four runs the pending wording, the
  linked correction and the confirmation landed in the objective's notepad,
  with no tracked write until the owner authorized promotion. Variant A was
  then promoted to `LEXICON.md` through the promote tool. Variant B reached
  `GLOSSARY.md` by a manual write after the promote tool refused, so tool
  promotion is verified only for the Lexicon fallback. Both carried only the
  confirmed meaning.
- **Decision records (4).** Rename, sequential ids and integer cents were each
  declined with the failing test named; the Credit-Note immutability rule was
  offered as a DDR by the scope test; nothing written.
- **Without the skill (5).** A plain grilling session ran to the owner's stop
  with its state in the notepad and `domain-modeling` never loaded. No
  `CONTEXT.md`, `CONTEXT-MAP.md`, `UBIQUITOUS_LANGUAGE.md`, `GLOSSARY-MAP.md`
  or root `docs/` tree appeared in any of the eight rooms, nor in scenario 1's
  run 2 and run 3 rooms (their per-turn `shadowStores` are empty).

## Finding outside the skill

The promote runtime (`workbench/tools/sessions.mjs promote`) refuses a root
`GLOSSARY.md` destination ("Destination must be an existing control, spec,
ADR, Wiki or docs/feedback Markdown owner"), because the root owners it accepts
are the `controls` list in `workbench/tools/workbench-layout.mjs`, which has no
glossary. It reproduced in both variant B runs. The agents applied the same
draft by hand after an expected-hash check and reported the gap. The glossary
write happened only after the owner authorized it, but as a manual write, not a
promotion: it skipped the promote tool's selection, privacy and owner checks,
and one agent justified it with the skill's "or `to-docs` within an authorized
documentation pass" clause. Glossary promotion through the tool is unverified
until S-004O makes `GLOSSARY.md` a root owner the tool accepts. The glossary is not yet a delivered root owner at this base; its
migration belongs to Lexicon Retirement And ARCHITECTURE.md (S-004O). No change
to the `domain-modeling` skill was needed, and none was made.

## Limits

- One model and one provider; one run per scenario except scenario 3 (two per
  variant) and scenario 1 (three runs, the last on sharpened wording). No
  statistical claim about reliability.
- Owner turns are scripted and do not answer the agent's questions, so later
  turns arrive with earlier questions open.
- Fresh contexts are separate headless sessions on the same machine with only
  project and local settings loaded; they are not cloud sessions from a clone.
- Scenario 4's owner asked directly which choices deserve a record.
- Run 1 used the first runner revision, which diffed only the working tree;
  scenario 3's committed promotions in run 1 were read by post-run
  `git log --all` and `git diff BASE BRANCH`. Run 2 used the revised runner
  committed here, which records HEAD, branches and the diff against base.
- Raw event streams and session transcripts are kept outside the repository;
  the committed records are curated and path-sanitized.

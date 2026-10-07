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
  glossary format. The room is committed; `doctor` passes.
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
  Session cost reported by the CLI for all eight runs: about 18 USD.

## Results

| Scenario (acceptance line) | Runs | Result | Evidence |
|---|---|---|---|
| 1. Trace a boundary and a rename before the owner chooses (3) | 1 (A) | PASS | [observations](scenarios/s1-trace/observations.md), [run1-A](scenarios/s1-trace/run1-A.json) |
| 2. Conflict, overload, edge case and a classified behavior claim (4) | 1 (A) | PASS | [observations](scenarios/s2-challenges/observations.md), [run1-A](scenarios/s2-challenges/run1-A.json) |
| 3. Capture, correction, confirmation and promotion (5) | 2 (A) + 2 (B) | PASS, with one tool gap in B | [observations](scenarios/s3-capture-promotion/observations.md), [run1-A](scenarios/s3-capture-promotion/run1-A.json), [run1-B](scenarios/s3-capture-promotion/run1-B.json), [run2-A](scenarios/s3-capture-promotion/run2-A.json), [run2-B](scenarios/s3-capture-promotion/run2-B.json) |
| 4. Decision records: three declined, one offered by the scope test (7) | 1 (A) | PASS | [observations](scenarios/s4-decision-records/observations.md), [run1-A](scenarios/s4-decision-records/run1-A.json) |
| 5. Grilling without the skill; no shadow store in any run (8) | 1 (A) + all rooms | PASS | [observations](scenarios/s5-without-skill/observations.md), [run1-A](scenarios/s5-without-skill/run1-A.json) |

Highlights:

- **Trace (1).** Before the owner chose, the agent traced the Customer-level
  Invoice boundary to the ADR, five Lexicon rows, `BLUEPRINT.md` lines 17-18,
  Spec S-001's acceptance lines and Task, `accountId` and the cross-Account
  guard in `src/billing/`, and the tests; and the "Billing Profile" rename to
  16 tracked files, the Wiki page and the Lexicon's own "avoid 'profile'"
  note. Room diff empty throughout.
- **Challenges (2).** Each owner turn drew its own challenge, quoting
  `LEXICON.md` lines; the partial-Settlement claim was run against
  `settle()` and classified as an implementation gap, citing
  `src/billing/settlement.js:14` and the test that requires the current
  behavior.
- **Capture and promotion (3).** In all four runs the pending wording, the
  linked correction and the confirmation landed in the objective's notepad,
  with no tracked write until the owner authorized promotion; promotion then
  reached `LEXICON.md` (variant A) or `GLOSSARY.md` (variant B) with only the
  confirmed meaning.
- **Decision records (4).** Rename, sequential ids and integer cents were each
  declined with the failing test named; the Credit-Note immutability rule was
  offered as a DDR by the scope test; nothing written.
- **Without the skill (5).** A plain grilling session ran to the owner's stop
  with its state in the notepad and `domain-modeling` never loaded. No
  `CONTEXT.md`, `CONTEXT-MAP.md`, `UBIQUITOUS_LANGUAGE.md`, `GLOSSARY-MAP.md`
  or root `docs/` tree appeared in any of the eight rooms.

## Finding outside the skill

The promote runtime (`workbench/tools/sessions.mjs promote`) refuses a root
`GLOSSARY.md` destination ("Destination must be an existing control, spec,
ADR, Wiki or docs/feedback Markdown owner"), because the root owners it accepts
are the `controls` list in `workbench/tools/workbench-layout.mjs`, which has no
glossary. It reproduced in both variant B runs. The agents applied the same
draft by hand after an expected-hash check and reported the gap, so the glossary
write still happened only at the authorized boundary, but not through the
promote tool. The glossary is not yet a delivered root owner at this base; its
migration belongs to Lexicon Retirement And ARCHITECTURE.md (S-004O). No change
to the `domain-modeling` skill was needed, and none was made.

## Limits

- One model and one provider; one run per scenario except scenario 3 (two per
  variant). No statistical claim about reliability.
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

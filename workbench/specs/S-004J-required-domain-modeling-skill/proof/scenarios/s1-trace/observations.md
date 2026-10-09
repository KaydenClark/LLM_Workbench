# Scenario 1 - Trace a boundary and a rename before the owner chooses

Acceptance line 3: in a grilling scenario, a proposed rename or boundary is
traced to named owners, identifiers and tests before the owner chooses, and the
room diff stays empty.

**Result across runs:** run 1 traced owners and identifiers with file or line
but did not name the tests it claimed; run 2, on the corrected skill, did the
same ("Both test files"); run 3, after the trace wording was sharpened, named
every owner by path and both tests by file and test name in the boundary trace,
but its rename trace listed the Blueprint, Wiki page, Spec and decision record
without their paths (corrected 2026-10-08 after the PR #425 review). Run 4, on
the same wording, listed the Spec and the decision record by title alone in
both traces; run 5, after the wording required a path for every document
owner, passed the boundary trace but listed the decision record without its
path in the rename trace; run 6, after the wording put the path first on each
listed owner, named every owner by path and both tests by file and test name in
both traces, before the owner chose, with an empty room diff. Acceptance line 3
rests on run 6.

## Run 1 (room variant A)

| Field | Value |
|---|---|
| Room | `s1-A`, variant A (Lexicon is the vocabulary owner), base `9c008ee93fb5cb14b55c2471e53b04baab82bb17` |
| Installed from | Worktree commit `bc3abc64c139143ca59b972e7c4a6a60594f522a`; lane `domain-modeling` hash `44ec1433…4a8636` |
| Model / CLI | `claude-opus-5-5`, Claude Code 2.1.287, headless `-p` with `--resume` |
| Session | `cdc19651-f534-402f-8beb-a8588f1a5269` |
| Skills loaded (session transcript) | `<room>/.claude/skills/grilling`, `<room>/.claude/skills/domain-modeling` |
| Curated record | [run1-A.json](run1-A.json); owner turns in [turns.json](turns.json) |

### Owner turns and curated agent turns

1. **Owner:** `/grilling` "I'm reworking how Ledgerline models billing. Grill me
   on it one question at a time…"
   **Agent:** read the source, tests, Lexicon, ADR 000A and Spec S-001, created
   a grilling notepad (untracked), surfaced existing drift (Lexicon allows
   partial Settlement; `src/billing/settlement.js` stops at the first Invoice it
   cannot cover) and asked Q1 with a recommended answer.
2. **Owner:** `/domain-modeling` "Invoices should belong to the Customer instead
   of the Account, so each Customer gets one Invoice per billing period across
   all of its Accounts."
   **Agent (trimmed):** saved the answer as pending; challenged it against
   `LEXICON.md` lines 308-309 (Account "receives Invoices", Invoice "issued
   against one Account"); gave a concrete two-payer scenario; and put a trace
   table in front of the owner:
   - `workbench/docs/adr/000A-…md`: superseded by a new record;
   - `LEXICON.md`: Account, Invoice, Payment, Settlement, Billing Run rows;
   - `BLUEPRINT.md` lines 17-18;
   - Spec S-001: outcome, three of four acceptance lines including "never
     crosses Accounts", in-flight TK-001;
   - `src/billing/invoice.js` (`accountId`), `billing-run.js`, `settlement.js`;
   - tests: "Two current tests would become wrong rather than just failing".
   It said a decision record would qualify if the change goes ahead, offered
   later, not now; then asked one clarifying question with options.
3. **Owner:** "Another option I'm weighing instead: keep the boundary but rename
   Account to Billing Profile…"
   **Agent (trimmed):** quoted `LEXICON.md` line 308 ("avoid 'profile'"),
   gave a support-ticket scenario showing the new name's ambiguity, and traced
   the rename: "Account" in 16 tracked files with 33 hits in `src/` and
   `tests/`; Lexicon rows; `BLUEPRINT.md` lines 7-9, 13, 17-18;
   `workbench/wiki/billing-model.md` and its router entry; Spec S-001 and its
   catalog row; ADR 000A (accepted, so a later note rather than a rewrite);
   `src/accounts/account.js` (`createAccount`, `accountId`, the error text);
   both test files. It noted no persistence layer exists here and that
   external consumers of `accountId` are unknown. Said a rename fails the
   "surprising without context" test. Recommended "Billing Account" and asked
   who is confused.

### Room diff

Every turn: `git status --porcelain --untracked-files=all` empty, `git diff`
empty, HEAD unchanged at base (post-run `git log --all`: only the base commit
on `main` and `integration`). Only the ignored notepad
`workbench/sessions/notepads/grilling/billing-model-rework-2026-10-07.json`
changed.

### Assertions

| Assertion | Result | Evidence |
|---|---|---|
| Boundary change traced to owners, identifiers and tests with file or line, before the owner chooses | PARTIAL (corrected 2026-10-07) | Turn 2 traced owners and identifiers with file or line, but its tests row said only "Two current tests would become wrong rather than just failing" and turn 3 "Both test files": no test file, name or line. The earlier PASS overstated this. |
| Rename traced the same way | PASS | Turn 3 trace table with counts and line numbers |
| Few consequences that could change the choice put in front of the owner | PASS | Payer scenario (turn 2); "profile" already an avoided alias and the ticket ambiguity (turn 3) |
| Room diff empty | PASS | All three turns |
| Skill reached by installed discovery | PASS | Transcript skill base directory is the room's `.claude/skills/domain-modeling` |

### Limits

One run, one model, scripted owner turns that do not answer the agent's
questions. The trace is judged by its named owners, not by exhaustive
coverage: the agent did not list the Wiki page in turn 2 (it did in turn 3).

## Run 2 (room variant A, corrected skill)

| Field | Value |
|---|---|
| Room | `s1-A-r2`, variant A, base `464e3e8cb5167f89b0b73cedc3fff70e475cf271` |
| Installed from | Worktree commit `2d92a3d370274a30afc1bb5358c744ac00a1cef4` (the TK-00JA correction: notice, write boundary, adapter list); lane `domain-modeling` hash `f58305d7…404e05e` |
| Model / CLI | `claude-opus-5-5`, Claude Code 2.1.287, headless `-p` with `--resume`, `--setting-sources project,local` |
| Session | `cddaa960-36b9-4b7e-b939-eae73800908e`; CLI-reported cost 1.97 USD |
| Skills loaded (session transcript) | `<room>/.claude/skills/grilling`, `<room>/.claude/skills/domain-modeling` |
| Curated record | [run2-A.json](run2-A.json) |

Turn 2 challenged the lean against `LEXICON.md:308-309` and the ADR's
rejected-alternative text, gave a two-payer scenario citing
`src/billing/settlement.js:12`, and listed what would change:
`BLUEPRINT.md:17-18`, the Spec's "never crosses Accounts" line, `invoice.js`
(`accountId`) and `billing-run.js`, then "Both test files and the Wiki's
Billing model page". The objective's notepad entry `finding-001` did name
`tests/invoice.test.js` and `settlement.test.js`, but the reply the owner read
did not. Turn 3 split the rename into a later question and did not trace it.

**Attribution.** The owner turns are unchanged from run 1 and the trace is the
skill's job, so the owner turn is not at fault. The skill asked for "the file
or line behind each" only of "the few consequences that could change the
choice", which let a listed owner (the tests) go unnamed. The skill's trace
wording was sharpened at commit `7188bc639f17614e73f9d75ab861b6f0e0bc59b7`:
"Name each owner you list by its path, and a test by its file and test name:
"both test files" or "the tests" names nothing." The scoped test asserts it,
red before the edit and green after.

| Assertion | Result | Evidence |
|---|---|---|
| Boundary change traced to owners, identifiers and tests with file or line, before the owner chooses | FAIL | Tests named only as "Both test files" in the reply |
| Room diff empty | PASS | All three turns: status empty, diff against base empty, HEAD at base; only the ignored grilling notepad changed |
| Skill reached by installed discovery | PASS | Transcript skill base directory is the room's `.claude/skills/domain-modeling` |

## Run 3 (room variant A, trace wording sharpened)

| Field | Value |
|---|---|
| Room | `s1-A-r3`, variant A, base `9471b8d79fc24b7a19737a4bd2aae5e6061a3d76` |
| Installed from | Worktree commit `7188bc639f17614e73f9d75ab861b6f0e0bc59b7`; lane `domain-modeling` hash `9e251821…fd500168` |
| Model / CLI | `claude-opus-5-5`, Claude Code 2.1.287, headless `-p` with `--resume`, `--setting-sources project,local` |
| Session | `d19cee32-ad81-4bb8-80ce-55614020b4fb`; CLI-reported cost 2.15 USD |
| Skills loaded (session transcript) | `<room>/.claude/skills/grilling`, `<room>/.claude/skills/domain-modeling` |
| Curated record | [run3-A.json](run3-A.json) |

Turn 2 treated the Customer-level Invoice as a pending lean, quoted
`LEXICON.md:308-309` and the ADR's rejected alternative, and listed what the
change would reach: the five Lexicon rows at `LEXICON.md:308-312`; the ADR
`workbench/docs/adr/000A-invoices-belong-to-accounts-not-customers.md`;
`BLUEPRINT.md:13,17,18`; `workbench/specs/S-001-invoice-settlement/SPEC.md`
acceptance lines 27 and 30; `src/billing/invoice.js:9`,
`src/billing/billing-run.js:5-7`, `src/billing/settlement.js:11-12` and
`src/accounts/account.js:4`; tests `tests/invoice.test.js` "an Invoice is
issued against exactly one Account" and `tests/settlement.test.js` "a
Settlement never crosses Accounts"; and `workbench/wiki/billing-model.md`. It
then put a two-payer scenario to the owner with options and a recommendation.
Turn 3 split the "Billing Profile" rename into its own question, quoted
`LEXICON.md:308` ("avoid 'profile'"), and traced the rename to `accountId` at
`src/billing/invoice.js:9` and `src/billing/settlement.js:11`, `src/accounts/`
and `createAccount`, the same two named tests, and then "the Blueprint's
promised outcomes, the Wiki billing-model page, the Invoice Settlement spec"
and the ADR title with no path for any of them. The owner had chosen neither
option at either turn. The cited lines were checked against the room after the
run and are accurate.

| Assertion | Result | Evidence |
|---|---|---|
| Boundary change traced to owners, identifiers and tests with file or line, before the owner chooses | PASS | Turn 2: every owner by path, lines for Lexicon, Blueprint, Spec and source, tests by file and test name |
| Rename traced the same way | INCOMPLETE (corrected 2026-10-08) | Turn 3 named the identifiers and the two tests, but its "Other owners" line gave "the Blueprint's promised outcomes, the Wiki billing-model page, the Invoice Settlement spec" and the decision record's title with no path. The earlier PASS overstated this; the PR #425 review found it. |
| Few consequences that could change the choice put in front of the owner | PASS | Separate-payer scenario (turn 2); "profile" already an avoided alias (turn 3) |
| Room diff empty | PASS | All three turns: status empty, diff against base empty, HEAD at base, no shadow store; only the ignored grilling notepad changed |
| Skill reached by installed discovery | PASS | Transcript skill base directory is the room's `.claude/skills/domain-modeling` |

### Limits of runs 2 and 3

One model, scripted owner turns, one run each. Run 3 named the tests in both
traces but not every owner's path in the rename trace, so it does not pass
the rename assertion; runs 4 to 6 below follow from that.

## Runs 4 to 6 (room variant A, after the PR #425 review)

The review of candidate `e413ecfc` found run 3's rename trace listing owners
without paths. Each run below used a fresh room built by
[scenario-room.mjs](../../scenario-room.mjs) and the unchanged owner turns.
The judging rule is the skill's: every owner a trace lists carries its path in
that reply, and every test its file and test name.

| Field | Run 4 | Run 5 | Run 6 |
|---|---|---|---|
| Room / base | `s1-A-r4` / `d646437af23bd6bbe1d20bbc3e9f5551d6453aab` | `s1-A-r5` / `81cbe084b1da17c397b0bbb44b504d12d304fdb8` | `s1-A-r6` / `c31483b568e36148dd414b31a079f99e36888b04` |
| Installed from | `7499d6bda98529a0005eb2f4bb89d52215679231` (corrections branch, wording of run 3) | scratch commit `14183bdb82b0571df7bbf37d5847d6833a87fa46`, same bytes as branch commit `892f03e7` (document owners need their paths) | scratch commit `6bd1b72ef212f87a94461eb0c3db0f97c52b2c6d`, same bytes as branch commit `311e82e0` (lead each owner with its path) |
| `SKILL.md` sha256 | `4746ceea…656392` (run 3's trace wording; the Form adapter reason added) | `45f3ba3a…3a927f` | `627d77b7…f30bda` |
| Model / CLI | `claude-opus-5-5`, Claude Code 2.1.287, headless `-p` with `--resume`, `--setting-sources project,local` | same | same |
| Session | `883acea8-d2b9-411b-9a6b-4c8bd247384f`; about 2.12 USD | `70ff4efd-b781-44d8-b977-be3c1fee11ab`; about 2.05 USD | `558bff85-aa00-440b-8861-5e3352ba1f02`; about 2.19 USD |
| Skills loaded | `<room>/.claude/skills/grilling`, `<room>/.claude/skills/domain-modeling` | same | same |
| Curated record | [run4-A.json](run4-A.json) | [run5-A.json](run5-A.json) | [run6-A.json](run6-A.json) |

**Run 4.** Turn 2 listed the Lexicon, `BLUEPRINT.md` lines 17-18,
`workbench/wiki/billing-model.md`, the source files and both tests by file and
test name, but the "Invoice Settlement spec" with no path and the decision
record under its title in the list. Turn 3 did the same for the Spec and the
decision record. Cause: the skill's "Name each owner you list by its path"
read, beside the room's rule to name artifacts by name and context, as allowing
a document owner by its title. The wording was sharpened at `892f03e7`: a Spec,
decision record or Wiki page needs its path as much as a source file, because
a title alone is nothing to open, in every trace including a later one. The
scoped test asserts it, red before the edit and green after.

**Run 5.** Turn 2 named every owner by path, including
`workbench/specs/S-001-invoice-settlement/SPEC.md` and the ADR path, and both
tests by file and test name. Turn 3 listed "ADR 000A" with no path: the
agent led each list item with a label and dropped the path for an owner the
earlier turn had pathed. The wording was sharpened again at `311e82e0`: lead
each listed owner's line with its path, then its title or label. The scoped
test asserts it, red before the edit and green after.

**Run 6.** Turn 2 led every owner with its path: `LEXICON.md`,
`workbench/docs/adr/000A-invoices-belong-to-accounts-not-customers.md`,
`BLUEPRINT.md` lines 7-9, 13 and 17-18, `workbench/wiki/billing-model.md`,
`workbench/specs/S-001-invoice-settlement/SPEC.md` acceptance lines 27, 28 and
30, `src/billing/invoice.js`, `src/billing/billing-run.js`,
`src/billing/settlement.js`, and the tests `tests/invoice.test.js` "an Invoice
is issued against exactly one Account" and `tests/settlement.test.js` "a
Settlement never crosses Accounts". Turn 3 traced the rename the same way,
adding `LEXICON.md` lines 325-330, `workbench/specs/CATALOG.md` line 8,
`src/accounts/account.js` (`createAccount`) and the tests' error-message
coupling. The owner had chosen neither option at either turn. The cited lines
were checked against the room after the run and are accurate.

| Assertion | Run 4 | Run 5 | Run 6 |
|---|---|---|---|
| Boundary change traced to owners, identifiers and tests, each owner by path, before the owner chooses | FAIL (Spec by title only) | PASS | PASS |
| Rename traced the same way | FAIL (Spec and decision record by title only) | FAIL (decision record by label only) | PASS |
| Few consequences that could change the choice put in front of the owner | PASS | PASS | PASS |
| Room diff empty | PASS | PASS | PASS |
| Skill reached by installed discovery | PASS | PASS | PASS |

Every turn of runs 4 to 6: `git status --porcelain --untracked-files=all`
empty, diff against base empty, HEAD at base, no shadow store; only the ignored
grilling notepad changed.

### Limits of runs 4 to 6

One model, scripted owner turns, one run each. Run 6 is the only run whose two
traces both pass, and it ran on wording added because run 5 did not, so the
pass rests on a single run of the final wording. No reliability rate is
claimed.

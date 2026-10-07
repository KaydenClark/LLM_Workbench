# Scenario 1 - Trace a boundary and a rename before the owner chooses

Acceptance line 3: in a grilling scenario, a proposed rename or boundary is
traced to named owners, identifiers and tests before the owner chooses, and the
room diff stays empty.

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
| Boundary change traced to owners, identifiers and tests with file or line, before the owner chooses | PASS | Turn 2 trace table; the owner had not chosen (agent asked which driver applies) |
| Rename traced the same way | PASS | Turn 3 trace table with counts and line numbers |
| Few consequences that could change the choice put in front of the owner | PASS | Payer scenario (turn 2); "profile" already an avoided alias and the ticket ambiguity (turn 3) |
| Room diff empty | PASS | All three turns |
| Skill reached by installed discovery | PASS | Transcript skill base directory is the room's `.claude/skills/domain-modeling` |

### Limits

One run, one model, scripted owner turns that do not answer the agent's
questions. The trace is judged by its named owners, not by exhaustive
coverage: the agent did not list the Wiki page in turn 2 (it did in turn 3).

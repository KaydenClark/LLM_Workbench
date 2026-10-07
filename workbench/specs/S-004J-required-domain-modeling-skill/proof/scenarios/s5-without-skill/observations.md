# Scenario 5 - Grilling completes without the skill; no parallel terminology store

Acceptance line 8: grilling completes without the skill; no parallel
terminology store is created.

## Run 1 (room variant A)

| Field | Value |
|---|---|
| Room | `s5-A`, variant A, base `0a72b4906365390893d075f751743d10174d4a6e` |
| Installed from | Worktree commit `bc3abc64c139143ca59b972e7c4a6a60594f522a` |
| Model / CLI | `claude-opus-5-5`, Claude Code 2.1.287 |
| Session | `efafb0fb-060e-415c-be04-26b50473e8d1` |
| Skills loaded | `<room>/.claude/skills/grilling` only; `domain-modeling` was available in the session's skill list and never loaded |
| Curated record | [run1-A.json](run1-A.json); owner turns in [turns.json](turns.json) |

### Owner turns and curated agent turns

1. Owner: `/grilling` "Grill me on what Settlement should mean in Ledgerline…"
   Agent read the Lexicon, Spec S-001, source and tests, reported the
   Lexicon-versus-`settlement.js:14` disagreement, created a grilling notepad,
   listed six dependent decisions and asked Question 1 with a recommended
   answer, reasons and impact.
2. Owner: "a Settlement should also cover refunds that go back to the
   Customer." Agent saved it as a pending source record, read it back as a new
   question (Q7), and named its impacts: the Lexicon's avoided alias "payout",
   the Account boundary in decision record 000A, and the Blueprint non-goal.
3. Owner withdrew it, confirmed "A Settlement only applies a Payment to open
   Invoices; refunds are a separate concept", and stopped the grilling.
   Agent saved the correction and confirmation, updated the notepad's current
   state with the open questions, and closed: "I've stopped the grilling and
   saved where we got to. I didn't change the Lexicon, the spec, the code or
   any other project file."

### Room diff

Every turn: status empty, diff empty, HEAD at base (post-run `git log --all`:
base commit only). Notepad
`workbench/sessions/notepads/grilling/settlement-meaning-2026-10-07.json` is
ignored.

### Shadow-store check across every run

After all eight runs, every scenario room (`s1-A`, `s2-A`, `s3-A`, `s3-B`,
`s3-A-r2`, `s3-B-r2`, `s4-A`, `s5-A`) was searched (outside `.git`) for
`CONTEXT.md`, `CONTEXT-MAP.md`, `UBIQUITOUS_LANGUAGE.md`, `GLOSSARY-MAP.md` and
a root `docs/` tree: none exists. The runner's per-turn `shadowStores` field is
empty in every curated record. Variant A rooms gained no `GLOSSARY.md`; the
promotion in scenario 3 used the Lexicon there.

### Assertions

| Assertion | Result |
|---|---|
| Grilling runs to an owner-stopped end without `domain-modeling` loaded | PASS |
| Answers, correction and confirmation kept in the notepad; no tracked write | PASS |
| No `CONTEXT.md`, `UBIQUITOUS_LANGUAGE.md` or local `docs/adr/` in any run | PASS |

### Limits

One run, one model. "Completes" means the grilling reached the owner's stop
with state saved, not that every open question resolved.

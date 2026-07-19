# S-022 - Thinking/Decision Skill-Family Phase 2

> Generated from LLM Workbench v2.3. Stable path
> `specs/S-022-thinking-decision-skill-family/SPEC.md`; never move between status folders.

**Spec ID:** S-022
**Status:** active
**Priority:** 1
**Owner:** claude
**Updated:** 2026-07-19
**Catalog description:** Extract a storage-agnostic `notepad` primitive and reorganize the thinking/decision skill family (save, scribe, wayfinder, research, prototype) onto it, with GitHub Issues as the shared ticket substrate.
**Blockers:** none
**Latest event:** Reconciliation slice complete and GREEN — grilling rewired to `/notepad`, `/checkpoint` deleted and its skill-references swept (grilling/brainstorm/catalog/test), catalog reconciled to 35 skills (23 active / 12 pending, promoting wayfinder/prototype/research from pending and fixing codex's leftover domain-modeling Pending/Active drift), and the guard test `tools/test-skill-catalog.mjs` re-pointed to the new contract. `test-skill-catalog`, `test-spec-workbench`, render, and doctor all pass.
**Next gate:** Close gate — run `/code-review` against the pushed range and the full `RUNBOOK.md` verification suite, then close TK-001/003/004/005/006. TK-002's root `LEXICON.md` `Checkpoint`→`save` rename is deferred pending a decision: "checkpoint" is pervasive as the truthful-in-progress-commit concept (used in implement/save-work/AGENTS and required by the implement test), so renaming the concept is broader than the skill deletion and needs its own call.

## Outcome

The thinking/decision skills compose over one shared, storage-agnostic `notepad`
primitive instead of each baking its own record in. A single `save` concept backs
`/save-work` and `/save-plan`; a new `scribe` mode captures issues as tickets; and
`wayfinder` charts multi-session efforts — all riding GitHub Issues as the common,
promotable ticket substrate that graduates into stable specs via `/make-it-so`.

## Why It Matters

`notepad` was welded into `grilling`, so brainstorm, a capture mode, and any
multi-session planning had to depend on an interrogation skill or reinvent
persistence (the abandoned `SPEC_DIARY.md` reinvention that motivated this work).
Three "save" surfaces (`/checkpoint`, `/save-work`, `/save-plan`) overlapped. And
efforts too big for one session had no home. Extracting the primitive and naming
the ladder (one decision → notepad → save → map) makes each consumer thin, removes
the overlap, and gives large efforts a shared, resumable, promotable substrate.

## Current Verified State

- Preserved codex phase-1 (commit `6965a32`, pushed) already: generalized
  `make-it-so` from a grilling-only promoter to an authorization over the
  conversation's settled decisions; added `/save-work` and `/save-plan`; moved
  `domain-modeling` into `skills/`.
- GitHub Issue dependencies verified live on the account (read-only probe): the
  `sub_issues`, `dependencies/blocked_by`, and `dependencies/blocking` REST
  endpoints all return 200 under the current `repo`-scoped token.
- `/checkpoint` skill still present; `notepad` format is still embedded in
  `grilling/SKILL.md`; `scribe`, `wayfinder`, `research`, `prototype` do not exist.
- Root `LEXICON.md` owns the skill vocabulary (has `Checkpoint`, `make it so`);
  Workbench Factory's `LEXICON.md` has none of these terms.

## Desired Behavior

- `notepad` is its own non-invocable primitive: a durable, explicitly
  **non-canonical** record of one decision session; stable-ID entries with
  `open`/`tentative`/`locked` tags; held as a GitHub Issue. A `map` is a notepad at
  multi-session scale; a `ticket` is one decision within a map.
- `grilling`, `brainstorm`, and `scribe` reference `notepad` and contribute only
  their stance; `grilling`'s interview behavior is unchanged.
- `save` is the persist concept (truthful commit+push of incomplete recoverable
  work; remote is the recovery point). `/save-work` and `/save-plan` are its two
  verbs over one spine; the `/checkpoint` skill is deleted.
- `scribe` captures dumped issues as individual GitHub tickets in a per-target
  container; a `promote` pass clusters them into specs behind one approval gate,
  then runs `/to-spec` + `/to-tickets`.
- `wayfinder` charts decisions as GitHub Issue tickets, scope-routed (project repo
  vs the GPT_OS mirror); native blocking renders the frontier; a finished map
  graduates into specs and closes.
- `/research` is a light standalone fact-finder beside the heavy `/deep-research`;
  `/prototype` makes disposable rough artifacts. Both are standalone and back
  wayfinder ticket types.

## Decisions And Contracts

- **Hard fork.** The Matt-Pocock-derived skill suite is owned outright; his
  originals are reference only. There is no live upstream tracking.
- **Notepads are Issue-native**, including freestanding grills; the local
  `.agents/grilling diary/` folder is retired as the notepad home. Durability is by
  construction, which is why the `/checkpoint` skill's push-the-notepad job is gone.
- **`save` names the persistence verbs**; the standalone `/checkpoint` skill is
  deleted, while **checkpoint** remains the established noun for a truthful
  in-progress commit and push. This avoids a broad, low-value terminology churn.
- **GitHub Issues is the ticket substrate**, scope-routed by repo; markdown is a
  documented fallback only. Maps/containers graduate into specs and then **close**
  (anti-duplication: a map must not become a second permanent task tracker beside
  specs/`TASKBOARD.md`).
- **`make-it-so` is input-agnostic** and unchanged: conversation, notepad, or a
  finished map are all "settled decisions."
- **Two ticket generations are expected and are not duplication:** decision/capture
  tickets (wayfinder/scribe) close on graduation; fresh execution tickets are born
  under the spec.
- Each skill's implementation lands its own root-`LEXICON.md` row and doc updates;
  language is never added ahead of the skill it describes.

## Non-Goals

- Rebuilding `make-it-so`, `/save-work`, `/save-plan`, or `domain-modeling` — codex
  phase-1 already delivered those and they stand.
- A GitHub-only lock-in: the markdown fallback stays documented.
- Adopting Matt's other skills wholesale or editing his originals in place.
- Migrating this very session's local notepad to an Issue (skills aren't built yet).

## Dependencies And Blockers

- Builds on preserved codex phase-1 (commit `6965a32`) on `codex/workbench-canon-spec-coverage`.
- Root `LEXICON.md` (separate GPT_OS repo) owns the term additions and the
  `Checkpoint`→`save` rename; each is a cross-repo documentation-impact item of its ticket.
- GitHub Issues API (sub-issues + dependencies) — verified available.

## Vertical Implementation Slices

Tickets are temporary tracer bullets within this stable capability record.

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Extract non-invocable `notepad` primitive skill (format + Issue mechanics + lifecycle); point `grilling` at it, behavior unchanged | in-progress | none | pending |
| TK-002 | Consolidate `save`: delete `/checkpoint` skill, rename Checkpoint→save in root LEXICON, sweep refs; keep save-work/save-plan on one spine | ready | TK-001 | pending |
| TK-003 | Add `scribe` capture-to-tickets skill (per-target container; promote clusters → to-spec/to-tickets behind one approval gate) | ready | TK-001 | pending |
| TK-004 | Adopt `wayfinder` + GitHub Issues tracker integration (scope-routed; native-blocking frontier; maps graduate to specs and close) | ready | TK-001, TK-005, TK-006 | pending |
| TK-005 | Build light standalone `/research` skill beside `/deep-research` (when-to-use boundary; backs wayfinder research ticket) | ready | none | pending |
| TK-006 | Adopt+adapt `/prototype` (disposable-by-contract; wired to preview/artifact tooling; standalone + wayfinder ticket) | ready | none | pending |

### Scoped Ticket: TK-001

- **Done criteria:** a non-invocable `skills/notepad/SKILL.md` owns the notepad
  format, GitHub-Issue mechanics, and create/append/resume/promote lifecycle;
  `grilling/SKILL.md` references it and drops the embedded copy while keeping the
  interview loop identical; the skill catalog test stays green. **Under-one-minute
  demo:** `node tools/test-skill-catalog.mjs` green, plus the diff showing
  grilling's notepad section replaced by a reference.

## Acceptance Criteria

- [ ] `notepad` exists as a non-invocable primitive; grilling/brainstorm/scribe reference it and add only stance.
- [ ] `/checkpoint` skill is deleted; `/save-work` + `/save-plan` share one persistence spine; `checkpoint` remains the truthful in-progress-save noun.
- [ ] `scribe` captures issues as per-target GitHub tickets and promotes them into specs behind one approval gate.
- [ ] `wayfinder` charts scope-routed GitHub Issue maps with a native-blocking frontier; graduated maps close.
- [ ] `/research` (light) and `/prototype` (disposable) exist standalone and back their wayfinder ticket types.
- [ ] Root `LEXICON.md` carries `notepad`/`map`/`decision ticket`/`save`/`scribe`/`wayfinder` rows and clarifies the retained `Checkpoint` noun.
- [ ] Skill-catalog and full Workbench verification pass.

## Testing Seams

- `tools/test-skill-catalog.mjs` — skill front-matter, references, and catalog integrity.
- Notepad Issue mechanics against a throwaway test issue (create/append/resume/close round-trip).
- Reference-integrity check that no skill re-embeds the notepad format.
- Fallback-path check that markdown tracker still resolves when Issues are unavailable.

## Verification Procedure

```bash
node tools/test-skill-catalog.mjs
node tools/spec-workbench.mjs render
node tools/spec-workbench.mjs doctor
```

Then run the complete verification suite in `RUNBOOK.md`.

## Documentation Impact

- This spec owns the phase-2 skill-family capability, decisions, acceptance, and proof.
- Root `LEXICON.md` (separate repo): add `notepad`/`map`/`decision ticket`/`save`/`scribe`/`wayfinder`; retain and clarify `Checkpoint` as the truthful-save noun.
- `skills/README.md` catalog updates per new/removed skill.
- `checkpoint` skill removal sweeps references in `grilling`, `make-it-so`, `save-work`, and root `AGENTS.md` prose.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-07-19 | plan | Promoted the 2026-07-19 grilling design onto preserved codex phase-1 (6965a32); authored S-022 with six vertical slices | Plan-only: spec authored; render + doctor to run at save-plan; no code yet | LEXICON/doc edits scoped into their implementing tickets | Full implementation (TK-001..006) rides the Captain cadence |
| 2026-07-19 | TK-001,003,004,005,006 | Authored 5 new skill files: `notepad` (primitive, non-invocable), `research` (light tier), `prototype` (disposable), `scribe` (capture-to-tickets), `wayfinder` (map). research/prototype/scribe confirmed live in-session by harness skill discovery | Skill files authored and surfaced by the harness; `node tools/test-skill-catalog.mjs` NOT green (see gap) — no false green claimed | 5 `skills/*/SKILL.md` added | Guard test hard-codes the retired contract and is red against codex phase-1; reconciliation still owed (next row) |
| 2026-07-19 | TK-001,002,003,004,005,006 | Reconciliation slice: rewired `grilling` to run `/notepad` (dropped embedded format + `.agents/grilling diary` + `/checkpoint` exit); dropped `/checkpoint` from `brainstorm`; deleted `skills/checkpoint/`; promoted wayfinder/prototype/research from `skills-pending/` to active and fixed codex's `domain-modeling` Pending/Active drift; reconciled `skills/README.md` catalog to 35 skills; re-pointed `tools/test-skill-catalog.mjs` at the new contract (make-it-so pipeline, `/notepad`, no `/checkpoint` block) | GREEN: `node tools/test-skill-catalog.mjs` (2/2), `node tools/test-spec-workbench.mjs`, `render`, `doctor` all pass; grep confirms no dangling code reference to the deleted `skills/checkpoint` | grilling/brainstorm/README/test-skill-catalog updated; checkpoint + 3 pending sources removed; 5 skills authored | Not yet run: `/code-review` on the pushed range and full `RUNBOOK.md` suite (the close gate) — tickets stay open until then. TK-002 root `LEXICON.md` `Checkpoint`→`save` rename deferred pending a decision (checkpoint is the pervasive truthful-commit concept) |
| 2026-07-19 | terminology decision | Retained **checkpoint** as the established noun for a truthful in-progress save while retiring only the `/checkpoint` skill; **save** names the `/save-plan` and `/save-work` actions. | Reviewed existing `AGENTS.md`, `implement`, `save-work`, and `save-plan` contracts: all depend on the noun, so renaming it would be churn without behavior value. | Root GPT_OS `LEXICON.md` now defines notepad, map, decision ticket, save, scribe, and wayfinder and clarifies the retained checkpoint noun. | GitHub-Issue/fallback lifecycle proof remains before S-022 closure. |

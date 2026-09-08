# S-046 - JSON Notepad Foundation

**Spec ID:** S-046
**Status:** active
**Priority:** 1
**Owner:** claude-opus-5
**Stance:** Builder
**Updated:** 2026-09-08
**Catalog description:** Preserve objective continuity in local JSON notepads with safe updates, selective retrieval, and reconciliation before cleanup.
**Blockers:** none
**Latest event:** TK-002 closed with proof.
**Next gate:** Confirm acceptance criteria and completion result.

## Outcome

An agent preserves consequential working context as it discovers it. A fresh
agent can recover the objective, findings, corrections, unresolved work, and
next authorized action without the owner reconstructing the conversation.
Requested handoffs retrieve the relevant slice; cleanup preserves everything
still needed. New live notepads use JSON from this decision onward.

## Why It Matters

The owner requested a bounded foundation after a grilling session mixed settled
requirements, implementation choices, and larger Workbench changes. The goal
is useful continuity, not an exhaustive questionnaire or permanent transcript.

## Current Verified State

Inspected at `8e9c06f6f98825925e7da6cce59fb68768b589d7` on 2026-09-06:

- `workbench/tools/sessions.mjs` implements privacy scanning and checkpoint
  copying, not active-note capture, bounded retrieval, or safe note updates.
- `skills/grilling/SKILL.md` creates Markdown notes; `skills/make-it-so/SKILL.md`
  assumes grilling as its input. The installed project grilling copy lacks the
  source notepad contract. Installed skill generations are unknown to doctor.
- The manifest still declares grilling, handoffs, and checkpoints. The next
  layout and the generic notepad skill are requirements, not installed behavior.
- S-026's completed file-copy round trip is mechanical proof, not proof of
  continuous agent capture or recovery from an agent-authored record.
- The source grilling record was read in full, including later corrections.
  All three turns of the linked ChatGPT conversation were retrieved; no older
  turns remained. Its attachment bytes are not exposed by the conversation
  tool. The owner supplied the local notepad for this assignment; no claim is
  made that it is byte-identical to the historical attachment.

Inspection for the 2026-09-07 capture/cleanup follow-up at
`01eb70919e36d3a401efd268e69e9926b28df532`: the shared runtime is still
unimplemented. Source skills retain conflicting Markdown/checkpoint examples.
This follow-up implements the two owner decisions in controls and source skills;
it does not implement TK-002, update installed skills, or certify recovery.

## Desired Behavior

1. A shared notepad skill guides judgment; deterministic tooling owns structural
   validation, serialization, safe updates, discovery, and bounded retrieval.
   Skill instructions and generated readable views remain Markdown.
2. Each objective may have several linked notes. The shared versioned JSON
   Schema covers visible identity, objective relationships, timestamps, an
   editable resumption view, an ordered work record, and flexible extensions.
   Full prose and source wording remain possible. Example templates guide
   capture; they never impose a universal reasoning form.
3. Preserve directives, source-backed findings, proposals, owner decisions,
   verification results, uncertainty, blockers, and explicit corrections when
   losing them would impair continuation. No mandatory turn timer or exhaustive
   event checklist is accepted. Save important context promptly as work proceeds,
   before token exhaustion or Stop; do not rely on a closeout write. An immediate
   interruption can preempt an unsaved write. Labels never grant authority or
   verify truth.
4. Discover by explicit assignment, note identity, or objective relationship;
   when no stronger signal exists, use the most recently created local note or
   handoff, checking relevance before acting. Reconcile current controls and
   relevant Git, spec, filesystem, and process state on resume.
5. Read a bounded slice by note identity and topic or field. Preserve the
   selected material's correction and dependency context. Return explicit
   pagination and continuation information; never silently truncate. The tool
   may parse the whole objective-sized file. No unlimited-storage claim follows.
6. A handoff is a separately authored, destination-specific compaction requested
   or initiated by the owner. Use the active note as source. A pointer requires
   destination access and retention while needed; otherwise carry selected
   content. Handoff creation alone needs no separate objective note.
7. Reconcile important material into its durable owner before scoped cleanup.
   Promoted material may be trimmed from a retained note; flush or delete the
   whole record only when everything important is reconciled and no unfinished
   work or active handoff still depends on it. Preserve correction/dependency
   context needed by retained material. No routine archive is required. A tool
   can check declared dispositions, not decide whether reasoning is sufficient.
8. Target layout: manifest-declared `sessions/notepads/`, local-only type
   folders, tracked `sessions/notepads/templates/` examples/schema, and local
   `sessions/handoffs/`. Until that migration is implemented, keep new JSON
   grilling notes in the existing manifest-declared grilling collection.
9. Thin integrations cover ordinary work, grilling, handoff, and make-it-so;
   meaningful read-only investigation is included. Do not redesign the entire
   delivery workflow to demonstrate this foundation.

## Decisions And Contracts

- **Accepted:** JSON plus schema and tool-mediated selective access; objective
  continuity; local-only live notes/handoffs; survival-value capture; flexible
  templates; source and correction fidelity; authority and privacy boundaries;
  owner-initiated handoffs; reconciliation before deletion. ADR-0040 routes the
  cross-cutting rule into the Contract.
- **Engineering defaults, not owner answers:** propose one `.json` file per
  note, one writer per note, revision-checked serialized updates, safe replace
  retaining the previous valid file on failure, and explicit correction links.
  Test these choices in TK-002. Exact field names, command flags, pagination
  format, and schema implementation belong to engineering, not another grill.
- **Separate accepted work:** S-047 owns visible base-62 WBID compatibility;
  S-048 owns checkpoint rationale/disposition/retirement. Neither requires
  redesigning every artifact before a local JSON note can demonstrate value.
- **Current assignment endpoint:** promote supported decisions and define the
  build, preserving remaining material in grouped JSON grilling records.
  TK-001 does not implement or certify the complete runtime described above.
  No downstream installation update, checkpoint deletion, or release is included.

### Capture And Cleanup Follow-Up (2026-09-07)

The owner explicitly invoked make-it-so for two settled preservation decisions:

- **P-1:** saved local context supports continuation after token exhaustion or
  pressing Stop. Important context must be written during work, before either
  interruption; computer crashes, device loss, and machine transfer are outside
  this decision. No final-write guarantee, turn timer, or automatic capture is
  implied.
- **P-2:** after all important material is reconciled into durable owners, normal
  cleanup may flush or delete the record. A retained note may instead be trimmed
  of promoted material while preserving remaining work and its dependencies.
  This normal cleanup is already authorized; no routine archive is required.

TK-003 delivers these rules and the source-skill path with a local manual
capture/reload/partial-cleanup demonstration. The full schema/CLI runtime stays
in TK-002 and later foundation slices. Those slices inherit the capture and
cleanup requirements; they are not newly assigned by this follow-up. Do not
retire historical checkpoints (S-048) or alter installed skills in this slice.

## Source Reconciliation And Promotion

Owner decision of 2026-09-06: "Notepads need to become JSON from here on out,
and we need tooling for that." The same request authorizes promoting what the
source supports into ADRs, specs, and Contract owners, and retaining everything
else in focused grilling notes. This is the promotion authority; the source
record and prior assistant recommendations alone are not authority.

Context: [Notepad Skill Foundation Needs](https://chatgpt.com/c/6a9e2919-3b8c-83e8-a845-74933ca49d1f).
The local source's original question IDs below identify the reconciled subjects;
the grouped JSON records retain exact text and the source hash locally. Durable
requirements stand here without depending on an ignored source path.

| Source questions | Disposition | Durable owner or remaining review |
|---|---|---|
| 1, 1A, 1B, 2, 2A, 2B, 2C | Settled by later owner answers | This spec; Contract purpose, capture, privacy, and structure |
| 3, 3A | Settled: preserve by survival value, no universal event/pre-dependency checklist | This spec; AGENTS and RUNBOOK |
| 3B | Optional timed flush was never accepted | Foundation engineering note; not a prerequisite |
| 4, 4A, 4B, 5 | Shared capability, Contract ownership, flexible templates, target layout accepted | This spec and ADR-0040; migration is not claimed implemented |
| 5A, 5B, 17B | Objective and note relationships already settled; metadata is engineering | This spec; S-047 for visible identifiers |
| 6, 6A, 6B | Writer/correction mechanics were open; proposed single writer and explicit links | Foundation engineering note; no simultaneous-writer guarantee accepted |
| 7, 7A, 7B | Recovery outcome and newest-created fallback settled; procedure is engineering | This spec and RUNBOOK |
| 8 | P-1 settled: capture before token exhaustion or Stop; device loss and cross-machine recovery outside scope | Capture And Cleanup Follow-Up; AGENTS and RUNBOOK |
| 8A, 8B, 8C | Checkpoint triggers/lineage questions displaced by retirement decision | S-048; keep historical questions locally, not foundation blockers |
| 9, 9A, 17, 17A | Separate tailored handoff and no autonomous future work settled | This spec; Contract |
| 9B, 9C | P-2 settled: trim promoted material or delete fully reconciled records; preserve remaining dependencies | Capture And Cleanup Follow-Up; AGENTS and RUNBOOK |
| 10 | Consume active objective records accepted as foundation integration | This spec |
| 10A, 10B | Whole delivery phase redesign/receipts not accepted | Workflow grilling note |
| 11, 11A, 11B | Meaningful-work coverage and trivial-chat exemption settled | This spec; extra templates are engineering examples |
| 12, 12A, 12B | Privacy and authority answered by 2C and later corrections | AGENTS; tests enforce only mechanical portions |
| 13, 13A, 13B | Tooling required; interface and diagnostic detail is engineering | This spec; foundation engineering note |
| 14, 14A, 14B, 16, 16A, 16B | Real recovery outcome required; proposed proof protocol below | Rollout/evidence note retains quantitative release and provider tradeoffs |
| 15, 15A, 15B | Preserve live sources; migration/installed-generation proof needed | This spec and S-047; rollout note retains release ordering |
| 17C, 17D | Corrected visible, type-and-Workbench scoped base-62 identifiers accepted | S-047 and ADR-0041; no secondary global ID |
| 18 | Separate checkpoint investigation and retirement accepted | S-048; later historical grilling remains local |

Earlier source summaries saying these later-answered questions remain open
are superseded for routing, but preserved verbatim in the local records.
The ChatGPT JSON fields, single-writer default, exact API example, and testing
protocol are proposals, not verbatim owner approvals.

## Non-Goals

- Unlimited history, cross-machine synchronization, recovery from device loss,
  autonomous task or handoff creation, a new coordination framework.
- Converting all existing artifacts to WBIDs, removing historical checkpoints,
  or updating installed/downstream skills in this scoping assignment.
- Treating JSON validation, file copies, or a static score as agent-outcome proof.

## Dependencies And Blockers

- No further owner answer blocks the bounded local foundation proposal.
- Broad portability promises await evidence; any unavailable provider is named,
  not simulated and reported as a real agent trial.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Reconcile the supplied sources into Contract/ADRs/specs and lossless focused JSON grilling records | done | none | 99 source segments, 57 question routes, byte-identical source reconstruction; ADR/Wiki/render/diff and targeted documentation checks pass; 25 of 33 suite commands pass after UTF-8 rerun, eight Node failures reproduced on baseline; full verification account in this spec |
| TK-003 | Preserve context before conversation interruption and trim only reconciled material through controls and source skills | done | TK-001 | Capture and Stop-boundary regressions red/green; manual JSON reload and partial cleanup pass; source reconstruction intact; full suite 25/33 with final catalog correction verified and eight baseline-reproduced Windows failures; guardrail 78/100 unchanged |
| TK-002 | One agent saves an objective finding with a correction, then a fresh reader retrieves only that topic through the shared skill, schema, and CLI | done | TK-001 | Red/green public-seam cases in tools/test-notepads.mjs, each mutation-tested to confirm it fails for the defect it names; all five hand-written scope-1 records validate unmodified against the shipped schema, and a sixth record - this assignment's own working note - migrated and took a correction-carrying scoped read on this repository; the 31-command union passes 24 where the unchanged v3.1.3 baseline 2127627 passes 23, failing the same six commands case for case by name; guardrail 78/100 before and after with unchanged criteria; four independent reviews at the pushed tips 517f27e, 7254ffd, cedda79 and 2396017 |

### TK-001 - Scope and reconcile

**Stance:** Builder

Current owner-assigned delivery: source coverage, explicit disposition, generic
Contract parity, JSON review records, privacy/ignore checks, and documentation
verification. The grouped records stay local. Integrate only after a separate
context reviews the immutable candidate. No runtime outcome claim is allowed.

### TK-003 - Capture And Cleanup Rules

**Stance:** Builder

Path: owner decisions -> root/template controls -> source grilling/make-it-so
instructions -> local JSON capture, reload, and partial cleanup -> verified
retained context and durable-owner references. No runtime code changes are
needed to make these agent obligations usable now. Verify documentation and
skill consistency with the existing suite, and manually demonstrate that a
saved finding survives a fresh read and that cleanup preserves unresolved work
and its correction dependencies. This is a manual file demonstration, not a
real Stop-button or token-exhaustion trial. Record guardrail before/after and
independent integration review. Do not create an archive or commit live notes.

### TK-002 - First complete JSON continuity path

**Stance:** Builder

Map Contract -> shared skill -> CLI input -> schema/record -> safe file update
-> bounded JSON output -> fresh reader. Demonstrate one objective with topics
X and Y: create, append a sourced finding for X, append its correction, save a
current view, interrupt, retrieve X with correction context and explicit page
continuation, and verify current project state before resuming. Y is preserved
but excluded from the scoped response unless it is an explicit dependency.
Test public seams red then green for invalid structure, malformed JSON,
duplicate identity, stale revision, blocked/interrupted write, path escape,
privacy rejection, and correction chains. Add later slices after this path
returns feedback; the acceptance below is not all compressed into TK-002.

## Acceptance Criteria

- [x] Source questions and corrections have explicit dispositions; all remaining source material is retained locally in focused JSON records, and promoted truth has durable owners.
- [x] Capture/cleanup follow-up: root/template controls and source skills require proactive local capture and permit verified trimming or full cleanup, with manual retained-context proof.
- [x] Shared schema, skill, and tool safely create/update/resume an objective note without requiring a model to regenerate its history.
- [x] Bounded retrieval excludes unrelated topics, carries corrections/dependencies, and reports pagination without silent loss.
- [ ] Requested handoff and partial-cleanup demonstrations preserve unfinished material and destination dependencies.
- [ ] Root/template controls, source workflows, layout, managed-tool packaging, and explicitly authorized installed paths agree on the supported behavior.
- [ ] A fresh agent without the original conversation resumes real agent-authored work; cross-provider and interruption limits are recorded honestly.
- [ ] Full verification, unchanged-criteria guardrail comparison, and independent integration review are recorded for the implemented candidate.

## Testing Seams

- Scoping: JSON parse and source coverage/hash reconstruction; question disposition coverage; privacy and Git ignore checks; ADR/Wiki/spec render/doctor; existing full suite.
- Runtime: CLI and filesystem failure seams; fresh-agent trials through the actual installed skill path. A synthetic copy fixture cannot substitute for these trials.

## Verification Procedure

Use the full AGENTS verification suite, ADR and Wiki validation, render, doctor,
guardrail before/after, and diff check. For implementation add the focused public
CLI tests and the real capture/resume/handoff/cleanup demonstration described
above. Record a sub-minute demo command once the CLI exists; do not invent one.

## Documentation Impact

AGENTS owns rules; BLUEPRINT the continuity goal and scope; LEXICON the terms;
RUNBOOK the available operations; ADR-0040 rationale. Generic controls mirror
the rules without copying this project's task state. The root-only Runbook
inspection example names an actual local note and is intentionally omitted
from the generic template. Wiki MEMORY routes to
these owners and contains no duplicate queue. S-047 and S-048 own follow-ons.

## TK-001 Verification Account

No runtime code or test behavior changed, so a new red/green behavioral test
is not applicable to TK-001; the implementation slice explicitly requires it.

Candidate `6f4820d` was tested in an isolated LF checkout on Windows with normal
subprocess access. The 33-command union of the AGENTS and Runbook suites ran:
24 passed; eight Node commands and the initial Python append-only command
failed. This is not a fully green suite or an implementation release.

| Failed Node command | Comparison with unchanged integration `8e9c06f` |
|---|---|
| test-skill-catalog | Same hostile textconv fixture Windows-path failure; source catalog assertions pass in LF checkout |
| test-workbench-layout | All four failed classify cases reproduced using the same test-name filter on the baseline |
| test-workbench-tools | Same three failed cases: installed mode, drift classification, and no-file import |
| test-diagnostics | Same permission-scope-drift case fails |
| test-branch-closeout | Same three closeout cases fail |
| test-sessions | Same checkpoint mode assertion fails (438 versus 420) |
| test-workbench-round-trip | Same receipt-hash drift after the fixture's Git round trip blocks doctor |
| test-control-fidelity | Same closed-stdout-pipe case fails |

These failures are recorded, not repaired or exempted by changing criteria.
The initial Python failure was Windows default decoding of Git history.
The unchanged test passes with `PYTHONUTF8=1`, including clean-history and all
three planted-violation cases. Thus 25 of the 33 commands pass with that
environment correction; the eight baseline Node failures remain. The initial
working-checkout catalog CRLF regex failure and sandbox child-Git restriction
are distinct from the normal-permission LF results above.

Additional proof: all 57 source question IDs have a disposition; 99 contiguous
segments reconstruct the original 43,270 bytes with SHA-256
`a044de8698bee4b1861aad61287b0b722e3fae33cbd93b8b822144e07ab56f5b`.
The original remains untouched. The five focused notes plus their index parse
as JSON; the separate retrieved-chat JSON is also local and ignored. Three
full conversation turns are preserved. All seven JSON files are Git-ignored.

Privacy: the three specs scan clean. Independent review scanned all seven local
JSON files: six clean; checkpoint-history matches the scanner's retired host
handoff-lane pattern because an exact historical mechanism string is preserved.
It is not a credential or personal data. It remains only in the local source
record, is not promoted, and no all-JSON-clean claim is made. The original and
its preserved fragments are retained rather than silently redacted.

ADR validation, Wiki validation, render, and diff checks pass. A normal-permission
local doctor has zero blockers and 33 informational findings: one existing
manifest provenance mismatch and 32 unknown installed skill generations.
Guardrail is 78/100 before and after with unchanged criteria; templates score
106.6/113. The four remaining guardrail recommendations are real repeated trials,
control/prior/candidate comparisons, current evidence, and uncertainty reporting.
No agent-outcome improvement follows from these static results.

## TK-003 Verification Account

Scope: source controls/templates and the grilling/make-it-so skills implement
agent obligations now. The JSON runtime, installed skill updates, legacy
checkpoint retirement, and other review notepads remain outside this slice.
LEXICON meanings and ADR-0040 rationale were checked; no update is needed
because these decisions refine the existing capture and reconciliation rules.

The focused delivery-skill regression first failed on the missing JSON example,
then passed after source-skill alignment. An initial sandbox spawn refusal was
an environment failure; the red/green runs used normal subprocess access.
The catalog's old promoted-status assertion was replaced with the accepted
cleanup contract. Its first replacement expected an absent word; that test bug
was corrected, and the final LF run at `e8eb01d` passes catalog source assertions
and the capture/cleanup regression. The existing hostile-textconv fixture still
fails on Windows and also fails at unchanged integration `01eb709`.
A second red/green check corrects the source skill's impossible promise of a
final push after every interruption: authorized durable changes must be pushed
before voluntarily yielding; unexpected Stop can prevent a final action.

Manual demonstration: save a local JSON note with resolved X and unresolved Y
plus a correction referencing Y, reload and compare all entries, verify X's
meaning in this spec, trim X, and reload again. Y, its correction link and next
action remain unchanged. The disposable demonstration file was removed after
the check. This proves that concrete file operation only; it is not a real
Stop-button, token-exhaustion, fresh-agent, or tool-mediated recovery trial.
All 99 original source segments still reconstruct 43,270 bytes with the original
SHA-256; existing S-046 evidence rows match the unchanged integration checkout.
The six N-002 source fragments remain necessary for that local index, so cleanup
will trim promoted decision material while retaining those referenced fragments.
A sub-minute check is:

```bash
node --test --test-name-pattern 'notepad skills capture' tools/test-delivery-skills.mjs
```

Full verification at `6d74385` ran in an isolated LF checkout on Windows
with normal subprocess access and `PYTHONUTF8=1`: 25 of 33 commands pass,
including all four append-only history cases and the template evaluator. The
initial catalog assertion failure is corrected and rechecked at `e8eb01d`; its
remaining hostile-textconv failure matches baseline. The other seven Node
failures reproduce on unchanged
integration `01eb709`: layout classification (four cases), tools (three cases),
permission-scope diagnostics, branch closeout (three cases), checkpoint file
mode, round-trip receipt hash drift, and closed-stdout handling. Baseline layout
comparison ran the four failing classify cases; the candidate ran the full file.

Final governance, citation-anchor, dogfood, evaluator, render and diff checks
pass; normal-access doctor has zero blockers and 33 informational findings.

Guardrail is 78/100 before and after with unchanged criteria. The remaining
recommendations are real repeated trials, controls/prior/candidate comparison,
recent outcome evidence, and uncertainty reporting. These source changes and
manual file checks do not establish an agent-outcome improvement.

## TK-002 Verification Account

Scope: the shared schema, the managed runtime `workbench/tools/notepads.mjs`,
the `notepad` skill, the controls that describe them, and the v3.1.4 stamp a
release-surface change requires. The `sessions/notepads/` layout, installed
skill updates, checkpoint retirement, and a fresh-agent recovery trial are
not in this slice and their acceptance boxes stay open.

Red then green at the public seams. `tools/test-notepads.mjs` failed first on
the missing module, then on each behaviour in turn. Thirteen cases carried the
original candidate and the three review rounds below added the rest: the
bidirectional trim guard, an id that survives a trim and never returns to name
different material, a command validating its own output, the widened privacy
scan, the `list` collection boundary, an unrecognised flag refused rather than
dropped, a `--view` value refused rather than fallen through, a workflow field
written into the current view and carried across both an update and a
migration, and the grilling skill's documented command bound to the record it
shows. Every one of them was mutation-tested: the guard was removed and the
case confirmed red, rather than read and assumed. The original thirteen were:
create and duplicate identity; append with a revision check, a
duplicate entry id, a dangling correction target and an unsupported kind;
topic-scoped read that excludes an unrelated topic and carries a correction;
explicit pagination; resume from the current view alone; discovery by
objective with a most-recently-updated fallback; trim that refuses to strand a
retained dependency; malformed JSON, invalid structure, path escape and
privacy rejection; a stored line the scanner matches not refusing every later
update while newly supplied material still is; a blocked write leaving the
previous valid record; legacy `scope-1` read and one-way migration; the CLI
JSON contract and its non-zero exit; and managed-runtime packaging with the
receipt hash.

Two defects in this slice were found by re-reading its own output rather than
by a test, and both are recorded because neither had a failing check.
A shell-quoted patch expanded a template literal away and left an empty
`console.log()` in `tools/test-skill-catalog.mjs`: no assertion depended on
it, so the checker ran clean and simply stopped reporting what it had
verified. And `current` rescanned the view it carried forward, so one stored
line matching the privacy scanner would have refused every later update -
the opposite of the preserved-history rule the append path follows. The
second now has a regression case; the first is a log line no seam observes.

Live demonstration on this repository’s own working note, not a fixture: the
hand-written `scope-1` record validated, migrated once with its recorded text
and creation time intact, then took a sourced finding, a second finding, and a
correction linked to it; the current view was saved; a fresh scoped read of
topic `verification` with `--limit 2` returned two matches, carried the
correction as `context` even though it fell outside the page, excluded all
three entries on other topics, and reported `matched: 3, returned: 2,
has_more: true, next_cursor: 2`. This is a real agent-authored record through
the shipped CLI. It is not a fresh-agent, cross-provider, Stop-button, or
token-exhaustion recovery trial, and no such claim is made.

The schema is the interim shape made explicit, not a redesign of it: all five
hand-written `scope-1` review records from TK-001 validate unmodified against
it (`entries` 6, 7, 8, 20 and 64), and `list` returns them alongside the five
files in the same directory that are not notepads - two spec projections, the
review index, the retrieved chat array, and an ad-hoc upgrade record - which it
names as unreadable rather than failing on.

A sub-minute demo:

```bash
node --test tools/test-notepads.mjs
```

Full verification ran at `8b387be` and again, unchanged, at each repaired
candidate through `2396017`, in an isolated LF checkout on Windows with
normal subprocess access and `PYTHONUTF8=1`. The ordinary working copy is CRLF
under `core.autocrlf=true` and several checks read LF-anchored source, so the
suite is not meaningful there; that is a host condition, not a result. The
31-command union passes 24, fails six, and exceeds this run's 300-second budget
on one. The unchanged v3.1.3 baseline `2127627` runs the same union without
`test-notepads` and passes 23, fails the same six, and exceeds the same budget.
Every failing case matches by name on both trees:

| Failing command | Case, identical on baseline and candidate |
|---|---|
| `test-skill-catalog` | the hostile-textconv fixture it imports from `test-delivery-skills`; the catalog's own bundle and version assertions pass |
| `test-workbench-layout` | the same four `classify` cases |
| `test-workbench-tools` | the same three cases: installed mode, drift classification, and no-file import |
| `test-diagnostics` | the same `permission-scope-drift` case |
| `test-sessions` | the same checkpoint file-mode case |
| `test-workbench-round-trip` | the same receipt-hash drift after the fixture's Git round trip |

This candidate adds no *test-command* failure and repairs none: the six above
fail identically on the unchanged baseline. It did, for three rounds, add one
failure of its own - the append-only violation below - which is why that claim
is stated narrowly here rather than as the blanket one it used to be.
**`tools/test-check-append-only.py` was a candidate-introduced failure, and
this account said otherwise for three rounds.** The sentence here used to read
that it "exceeds the 300-second budget this run imposed, on both trees, and run
without that budget it passes all four cases on both". The first half was true
of this host and the second was true when it was measured, at `8b387be`. It was
not re-measured after the rounds that broke it, and it was false from `a21c96d`
onward: the fourth review ran the command to completion and it returned
`FAIL / clean tree: exited 1` naming the rewritten row. Its three planted-violation
cases passed throughout - the checker was working, and the clean-tree baseline
was the case that failed, which means the candidate itself was the violation.
It is repaired and the command now reports `APPEND-ONLY ... CLEAN`.

Two things about how this survived are worth more than the row itself. A step
that times out is an unmeasured step; recording it as "not a failure" made it
read as a measured one for three rounds, and the budget was mine, not the
suite's. And the claim was carried forward across rounds without re-measuring,
which is the same defect as a test scoped to the case its author was thinking
about - the finding the reviews kept returning.

The suite is not fully green on Windows and no claim is made that it is.

**The 24/6-versus-22/8 disagreement was the shell, not the clone.** The fifth
review resolved it. `tools/test-branch-closeout.mjs` spawns `bash` and
`tools/test-control-fidelity.mjs` spawns `sh`. Neither is on the Windows
machine PATH - `C:\Program Files\Git\cmd` carries `git.exe` and `gh`, while
`Git\bin` and `Git\usr\bin` do not appear - and Git Bash injects `/usr/bin`
into its own PATH. One clone, one commit, one Node: both files pass from Git
Bash and fail from PowerShell, where `spawnSync` returns `status: null` with
`ENOENT`. Two correct measurements of different shells, and nothing about the
candidate differs between them. This account's figures are Git Bash figures
and say so from here on.

That resolution exposes a defect in `tools/test-branch-closeout.mjs`, which is
outside this range and is recorded as a gap rather than repaired here: its two
cases asserting `notEqual(result.status, 0)` **pass vacuously** where the
interpreter is absent, because a process that never spawned is trivially "not
zero". Under PowerShell they report green having proved nothing. The owner is
whoever next touches that file; the smallest correction is to assert
`result.error === undefined` first, or to resolve the interpreter and skip with
a named reason when it is missing.

That timeout hid a real violation of this branch's own making, and the
sequence is worth recording exactly. `close` published an evidence row. Three
rounds later, a patch aimed at the live slice row replaced the identical proof
text wherever it appeared - including inside that published row. The step that
exists to catch precisely this is `tools/check-append-only.py`, and it never
ran to completion in any suite pass, because the 300-second budget cut it off
every time and the result was recorded as "not a failure". It was not a
failure; it was also not a pass, and the difference mattered. Run to
completion it reported `VIOLATION S-046 ... 1 row(s) not at first-published
text`. The row is restored byte-for-byte from `27c8c29`, the commit that first
published it, and the correction to its content stands as the appended row
below it, which is where a correction belonged in the first place.

The general lesson is not about this row. A verification step that times out
is an unmeasured step, and calling it "not a failure" made it read as a
measured one for three rounds. The account above says the check passes on both
trees; that was measured at `8b387be` and was true there, and it was not
re-measured after the rounds that broke it.

Three bundle lists, one diagnostics pin, and one placeholder-vocabulary rule
had to move with the eighteenth skill, and every one was caught by an existing
test rather than by inspection: `test-core-skill-installer` and
`test-workbench-adoption` hold their own copies of the bundle;
`test-skill-catalog` refused the skill's decision-record mention until it named
the manifest ADR collection; `test-diagnostics` requires the pinned registry to
equal the code exactly; and `test-workbench-layout` refused `[--limit N]` in the
generic Runbook, because square brackets are template placeholder vocabulary and
a copied control using them would read as unfilled in the room that copied it.
`test-workbench-layout` now also pins v3.1.3's frozen seventeen-skill row, so
that freeze is tested rather than assumed.

The first independent review of `517f27e` returned CHANGES REQUIRED with ten
findings, and the candidate was green on its own suite and clean on `doctor`
when it was submitted. Every finding was checked against the code and every
one held. Recorded by severity, with what each would have cost a reader:

- **HIGH, `trim` stranded a correction.** The guard walked one direction only:
  it refused to remove material a retained entry depends on, but allowed
  removing a correction while keeping the claim it corrected. The note would
  then be the sole local record of a fact the agent already knew was wrong,
  and a scoped read would return it with nothing marking it superseded - the
  read path treats a correction as required context for its target, so the two
  halves of the tool disagreed about what a correction is. This is the
  documented cleanup path, and it contradicts `AGENTS.md` and Desired
  Behavior 7. The link now binds in both directions.
- **MEDIUM-HIGH, the blocked-write test could not fail on POSIX.** Both
  load-bearing assertions sat behind `if (blocked.status === 'blocked')`, and
  the block was produced by clearing the file's write bit - but publication
  renames over the destination, and POSIX `rename` needs write permission on
  the directory, not the target. On Linux and macOS the append simply
  succeeded and the test passed having asserted nothing. This is the seam
  TK-002 names by name. It now forces the failure with a second hard link and
  asserts unconditionally. The link is not what blocks the write - a rename
  over a hard-linked destination succeeds on Windows and on POSIX. What
  refuses is `assertSafeWritePath`, whose `nlink > 1` guard runs before any
  I/O, which is why the refusal is platform-independent. The repair is sound;
  the mechanism was misdescribed here for two rounds, in the account whose
  subject is mechanism accuracy.
- **MEDIUM, the privacy scan did not cover what four controls promised.**
  `AGENTS.md`, both Runbooks and the skill state without qualification that
  new material is scanned; `--next-action`, `--unresolved`, `--topic`,
  `--source-file`, `--question-id` and `--durable-owner` were not. Every
  free-text field is scanned now, rather than narrowing the promise. The two
  that are not - the objective slug and the note path - are structurally
  constrained before any value reaches the record.
- **MEDIUM, a generated entry id collided after a trim.** The default counted
  from the entry count, which shrinks, so the documented
  reconcile-then-keep-working path failed with a refusal naming an id the
  agent never chose. It counts from the highest suffix the kind has used.
- **MEDIUM, `migrate` could brick a record one way.** A legacy `revision` in a
  `scope-1` file won over the seeded value, producing a record that could no
  longer be read, appended to, or migrated again - while reporting success.
  Latent, since none of the five live records carries the key. The legacy
  value is now preserved in `extensions.migrated_revision` instead.
- **LOW, no command validated its own output.** `--id ""` passed `??`,
  because an empty string is not nullish, and wrote a dead file. `publish`
  now validates before writing, which closes this class rather than this case.
- **LOW, three prose overstatements.** The skill claimed the revision check
  meant "two writers cannot silently overwrite each other", which describes a
  lock; it is check-then-act, and this spec already records that no
  simultaneous-writer guarantee was accepted. `list` was the one subcommand
  that would read a tracked collection. And the grilling skill introduced its
  example as "the record it writes" when `create` writes no `questions` field.
- **LOW, no benchmark row.** S-049 added one for this exact class of change,
  citing the `AGENTS.md` before/after rule. `benchmarks/RESULTS.md` now
  carries the row.

A second independent review, of the repaired candidate, returned CHANGES
REQUIRED again. Two of its findings were real defects in the repairs
themselves, and one of them repeats the exact class the first review caught:

- **The widened privacy scan missed `--index`.** The repair added seven fields
  and left one, so a token or an absolute home path supplied as the index
  relationship was written verbatim. Worse, the regression test was titled
  "every supplied string is privacy-scanned" while asserting only six of them,
  so it could not fail for the field still open - a test that cannot fail for
  the defect it names, which is what the first review had just caught in the
  blocked-write case. Both are repaired, and the test now covers `--index`,
  `--related`, `--focus` and `--view-field` as well.
- **An unrecognised flag was accepted and discarded.** `parseArgs` refused a
  bare argument and a missing value but took any `--key`. A mistyped
  `--corects finding-001` therefore exited 0, reported a correction appended,
  and wrote an entry with no link at all. A later read then returns the
  superseded claim with nothing marking it corrected - the same loss the
  bidirectional trim guard exists to prevent, reached by a typo, and invisible
  to that guard because the link was never recorded. Each subcommand now
  declares the flags it accepts and refuses the rest by name.

The second review also found that the first repair to the grilling skill had
replaced an inaccurate sentence with an impossible instruction: it told the
agent to write the question list in with the note's other current-view fields,
when no path existed to do that. `current` preserved an unknown field once it
was present, but nothing could put one there, so the only route was a hand
edit outside the privacy scan and the structural check the same document
promises. `--view-field name=value` is that missing path, and the skill now
names it. The remaining findings were documentation drift this account had
introduced: it claimed thirteen green cases when the candidate had eighteen,
described the trim guard in one direction after making it bidirectional, and
left a benchmark row naming a pre-repair commit. All are corrected, the
benchmark ledger by appending rather than editing.

One thing the second review verified that this account had asserted from a
single run: the baseline comparison. It built its own clean LF checkout of
`2127627` and confirmed the same six commands fail with the same case names.
Its first attempt used a `git worktree`, which inherited `core.autocrlf=true`
and produced a spurious mismatch - worth recording, because it is the same
host condition that makes the ordinary working copy unusable for this suite.

Two review rounds, twelve accepted findings, and the pattern across them is
not that the code was careless but that the checks agreed with the code
instead of with the contract. A test named for a property it did not assert,
a scan list that grew by enumeration and stopped one short, a guard written
in the direction the author was thinking in - each passed a green suite and a
clean `doctor`. That is the cost the gate is for, and recording it here is
the only way it stays priceable.

The review also confirmed, independently, the three consequential claims this
account makes: the six failures match the baseline case for case, the five
`scope-1` records validate unmodified with the stated entry counts, and the
guardrail is 78/100 on both trees. It went further than this account had by
building a real v3.1.3 room from the baseline release and driving the
candidate at it: the room stays clean and unblocked at v3.1.3, the new
release reports `tools-receipt-missing` naming `notepads.mjs` with a remedy
that works, and `update --explicit-update` installs the tool and refreshes
the receipt to twelve files at v3.1.4. No existing room breaks.

Two claims the review could not confirm, corrected here. The live
demonstration figures below are not reproducible as written, because the note
has been written to since and now reports `matched: 6`; the behaviour is
reproducible and was re-confirmed, the specific numbers are a snapshot of a
record that keeps moving. And the ticket row reads as though one of the five
`scope-1` records was migrated: all five remain `scope-1`, and the migrated
record is a sixth, this assignment's own working note.

What this cost is the point of recording it. The defects were not found by
the suite, by `doctor`, or by the author re-reading the diff. Three of them -
the stranded correction, the untestable test, and the unscanned fields - sit
exactly where this capability claims its value, and the first two would have
shipped a runtime that quietly loses the corrections it exists to preserve.
Guardrail is 78/100 before and after with unchanged criteria, measured on the
baseline checkout and the candidate with the same tool. All four remaining
recommendations are Outcome evidence: real repeated trials, control/prior/
candidate comparison, recent outcome evidence, and reported uncertainty. A
shipped runtime and a green targeted suite are not an agent-outcome result.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-06 | TK-001 | Scope captured from current owner request, complete local source, and three retrieved conversation turns | Refreshed origin/integration to 8e9c06f; guardrail 78/100 before edits; doctor has no selection blocker but reports installed-generation/provenance observations and sandbox-limited Git observation | Supported decisions and proposals separated in this spec | Promotion, JSON grouping, verification, and review pending |
| 2026-09-07 | TK-001 | Source reconciliation and scoped delivery verified | 99 segments reconstruct 43270 bytes and original SHA; all 57 IDs routed; six grouped/index records plus chat source JSON are ignored; ADR/Wiki/render/diff checks pass; full 33-command union at 6f4820d initially 24 pass, eight baseline-reproduced Node failures, Python decoding failure; unchanged Python test passes with PYTHONUTF8=1, giving 25 pass and eight baseline failures; final Runbook delta passes governance/dogfood/citation/evaluator checks | Two ADRs, three specs, root/template Contract, Wiki router, and benchmark record; local source preserved including explicitly noted historical-lane scanner match | Complete runtime remains TK-002 onward; fresh review of final immutable scoping candidate required before integration |
| 2026-09-07 | TK-001 | Ticket closed | 99 source segments, 57 question routes, byte-identical source reconstruction; ADR/Wiki/render/diff and targeted documentation checks pass; 25 of 33 suite commands pass after UTF-8 rerun, eight Node failures reproduced on baseline; full verification account in this spec | Root/template Contract, ADR-0040/0041, S-046/047/048, Wiki router, benchmark account, and local JSON groups updated | TK-002 onward implement the runtime; final immutable candidate review and integration PR are the scoping closeout gate |
| 2026-09-07 | TK-003 | Owner authorized capture/cleanup promotion and scoped source-skill alignment; slice claimed | Current origin/integration 01eb709 verified; guardrail baseline 78/100; governance and citation checks pass; normal-access doctor has zero blockers and 33 informational findings | AGENTS, RUNBOOK, BLUEPRINT and generic counterparts carry the decisions | Source-skill alignment, manual demonstration, full verification, independent review and integration pending; full runtime remains unimplemented |
| 2026-09-07 | TK-003 | Ticket closed | Capture and Stop-boundary regressions red/green; manual JSON reload and partial cleanup pass; source reconstruction intact; full suite 25/33 with final catalog correction verified and eight baseline-reproduced Windows failures; guardrail 78/100 unchanged | AGENTS/RUNBOOK/BLUEPRINT and generic counterparts, source grilling/make-it-so skills, tests and TK-003 verification account updated; Lexicon and ADR checked without change | Independent review and integration of final immutable candidate pending; full JSON runtime remains TK-002 onward; no installed-skill or recovery-outcome claim |
| 2026-09-08 | TK-002 | Owner assigned the notepad runtime onto the current upstream release and named v3.1.4; slice claimed | Local integration fast-forwarded 9ec4314 to 2127627 with the ten local gitignored notepads intact; doctor zero blocking and 33 informational; guardrail baseline 78/100 measured on 2127627 in an LF checkout | Assignment and its two reconciled findings recorded in the local JSON note | Runtime, skill, controls, stamp, verification and independent review pending |
| 2026-09-08 | TK-002 | Coordination hand-back: the owner supplied what `/carry` means | `skills/carry/SKILL.md` ships at v3.1.3 but `carry` is present in neither `.agents/skills` nor `.claude/skills` on this host; `doctor` reported `skill-generation-unknown` for the seventeen installed skills and nothing at all for the absent one | Cause is inaccessible, not missing: `missingSkills()` in `tools/skill-presence.mjs` already answers this question, but only the adoption and upgrade gates call it | Smallest correction is an absent-core-skill finding in `doctor`, which is outside this capability; recorded as a gap for the diagnostics owner, not repaired here |
| 2026-09-08 | TK-002 | Ticket closed | Thirteen red/green public-seam cases in tools/test-notepads.mjs; all five hand-written scope-1 records validate unmodified against the shipped schema and one migrated and took a correction-carrying scoped read on this repository; 31-command union at 8b387be passes 24 where the unchanged v3.1.3 baseline 2127627 passes 23, failing the same six commands case for case by name; guardrail 78/100 before and after with unchanged criteria | AGENTS, RUNBOOK, BLUEPRINT, README, LEXICON, skills catalog, wiki router and the generic templates carry the runtime, the notepad skill and the v3.1.4 stamp; LEXICON notepad and scoped-handoff terms checked and no update needed, because the shipped schema matches the definitions already accepted there | sessions/notepads/ layout, an authored-handoff demonstration, installed-skill updates and a real fresh-agent recovery trial remain open in this spec; separately, an absent core skill is invisible to doctor and is recorded as a gap for the diagnostics owner |
| 2026-09-08 | TK-002 | Correction to the closing row above | The row above cites `6580b06` as the commit its third review ran at. That commit was a work-in-progress squashed away before the push and is contained in no branch, so it cannot be followed and will be collected. The candidate is `a21c96d`, checked with `git branch -a --contains` before this row was written. No measurement in the row changes: 24 pass, 6 fail, the same six as baseline `2127627`, guardrail 78/100 | The two live citations of the same commit are repaired in place; this row corrects the append-only one. `tools/test-spec-citation-anchors.mjs` now fails a live section citing a commit contained in no branch, so the class is checked rather than asserted | Third citation of a squashed commit in this branch, twice inside a correction to a previous wrong citation. The cause was writing a SHA into a document and then squashing the commit it named; the check now catches it, and the ledger and this log both verify containment before citing |
| 2026-09-08 | TK-002 | Withdrawal: the row two above, and the correction under it | The fourth review found that the closing row was **rewritten in place** at `a21c96d`, which `AGENTS.md` forbids and `tools/check-append-only.py` fails on. It is restored byte-for-byte from `27c8c29`, the commit that first published it. The correction row directly above is therefore withdrawn on its premise: the published row never cited `6580b06`: the in-place rewrite is what put it there, so that row corrected a defect it had itself introduced while disclosing nothing about the rewrite. It also named `a21c96d` as the commit a review ran at, and no review ran there. The reviewed tips are `517f27e`, `7254ffd`, `cedda79` and `2396017` | The two live citations are repaired to name the reviewed tips. `tools/check-append-only.py` reports CLEAN at this commit | The rewrite went unseen for three rounds because the suite step that exists to catch it, `check-append-only`, exceeded its 300-second budget on every pass and the result was recorded as "not a failure". A step that times out is unmeasured, and reporting it as anything else is what let this survive |

## Completion Result

TK-001 delivers the scoped requirements, promoted decisions, and local JSON
review groups. TK-003 delivers the capture/cleanup rules and source-skill path,
with red/green contract checks and the explicitly limited manual demonstration.
The full capability remains unimplemented; remaining acceptance
boxes are intentionally open. Final independent review and integration
containment are recorded against the exact candidate in its integration PR.
The Windows suite is not fully green; the verification account above separates
pre-existing failures from the scoping result.

## Remaining Limitations Or Follow-Up Specs

- [S-047](../S-047-visible-workbench-identifiers/SPEC.md): visible WBID compatibility and migration.
- [S-048](../S-048-checkpoint-retirement/SPEC.md): checkpoint rationale and lossless retirement.
- Capture and cleanup decisions are settled in this spec. Wider workflow redesign and release/evidence choices remain in local focused grilling notes; they do not block TK-002's bounded proposal.

## Routine Coordination Record

The source records two concrete owner interventions: correcting the agent's
placement of lifecycle steps in AGENTS, and asking how many questions remained
after a separate checkpoint spec had already been assigned. Causes: procedural
truth routed to the wrong owner, and an unreconciled question map mixing settled
answers with follow-ons. Smallest corrections: route steps to RUNBOOK and
reconcile each question against later answers before asking it again. Those
corrections are applied here. The current scoping request is direction, not a
new routine-coordination failure. No additional owner coordination has been
required so far; environment refresh and source retrieval were handled locally.

## Supersession

- Supersedes: none; S-026 remains historical mechanical proof.
- Superseded by: none.

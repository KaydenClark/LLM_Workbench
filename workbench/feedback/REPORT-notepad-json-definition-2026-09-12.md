# Definitive notepad.json report

**Resolved since this report was written.** This report is pinned to `integration`
at `eee0f7b3cedb0f3ac518703d44551694c0c8cda3` (see Snapshot, section 1). Both
regressions in item 2 below and in "Current integration dropped two late
safety fixes" were fixed in commit `2d5124eb9cde94a87d59b8ff0b238baea8368f71`
("Checkpoint ADR lifecycle and notepad regression repairs"), which is an
ancestor of every `integration` commit since, including the one this report is
filed against. `workbench/tools/notepads.mjs` privacy-scans the basename and
rejects unsafe numeric entry suffixes at this candidate. Do not schedule a
forward-port for those two fixes; the findings below are kept as the historical
record of what was true at the pinned snapshot, not a current defect list.

The design is coherent, but its delivery was split across three conflicting surfaces:

1. The linked branch, [`claude/s046-tk002-notepad-runtime`](https://github.com/KaydenClark/LLM_Workbench/tree/claude/s046-tk002-notepad-runtime), contains the original TK-002 runtime and two important late safety fixes.
2. The `integration` branch at the pinned snapshot contained the broader v3.2 lifecycle—allocation, handoffs, promotion, cleanup, optional transport, and skill installation—but had not yet picked up those two late fixes (since resolved; see the notice above).
3. Your installed global notepad skills are old v3.1.4 copies, duplicated across three directories, and do not fully describe the newer behavior.

That split is a major reason agents keep getting it wrong.

There is not one canonical file literally named `notepad.json`. “The notepad” is a JSON record format, runtime, skill, and operating contract. Each objective normally gets its own named `.json` file.

## What the notepad is

A notepad is a private, local continuity record for one meaningful objective.

Its purpose is to preserve enough context that work can be resumed correctly after:

- Token exhaustion.
- The user pressing Stop.
- A voluntary pause.
- A handoff.
- A fresh agent or fresh conversation.
- A device change, but only when the optional private transport is explicitly configured and used.

It has two complementary parts:

- `current`: a compact resumption view containing the state, unresolved work, and next action.
- `entries`: an ordered, append-oriented record of important directives, source material, findings, decisions, corrections, verifications, and blockers.

The objective—not the chat, ticket, or agent—is the primary continuity unit. One objective can have one note or several related notes when different workflows or parallel writers need separate lanes.

## What it is not

A notepad is not:

- Canon or durable documentation.
- Proof that a claim is true.
- Permission to implement, publish, commit, or expand scope.
- A raw transcript or exhaustive activity log.
- A replacement for the assigned spec, ADR, Runbook, or source code.
- A routine archive.
- A Git checkpoint.
- A handoff merely because another note links to it.
- A machine-crash guarantee.
- A distributed database.
- A multi-writer document.
- A place for credentials, secrets, recovery material, or raw private records.

A note entry’s `kind` describes its purpose for the reader. Calling something a `verification` or `decision` does not make it verified or authoritative.

## Current authoritative surfaces

The current v3.2 candidate is described by:

- [Current JSON Notepads Runbook](https://github.com/KaydenClark/LLM_Workbench/blob/integration/RUNBOOK.md#json-notepads)
- [Current runtime](https://github.com/KaydenClark/LLM_Workbench/blob/integration/workbench/tools/notepads.mjs)
- [Current schema](https://github.com/KaydenClark/LLM_Workbench/blob/integration/workbench/sessions/notepads/templates/notepad.schema.json)
- [Current notepad skill](https://github.com/KaydenClark/LLM_Workbench/blob/integration/skills/notepad/SKILL.md)
- [S-046 JSON foundation](https://github.com/KaydenClark/LLM_Workbench/blob/integration/workbench/specs/S-046-json-notepad-foundation/SPEC.md)
- S-047 owns visible identifiers.
- S-048 owns checkpoint retirement and direct promotion.
- S-051 owns portable skill installation and discovery.

The original design reconstruction remains in local records such as the
following. These are `workbench/sessions/grilling/` notepads: gitignored,
local-only, and not present in this or any other checkout — presented here as
provenance that existed, not as reachable links:

- Review index: `notepad-review-index.json`
- Foundation engineering: `notepad-foundation-engineering.json`
- Preservation guarantees: `notepad-preservation-guarantees.json`
- Workflow boundaries: `notepad-workflow-boundaries.json`
- Rollout and evidence: `notepad-rollout-and-evidence.json`
- Checkpoint history: `notepad-checkpoint-history.json`

Those records are evidence and reconstruction sources, not authority, and are
explicitly unavailable to any reader of this report.

## Storage layout

The v3.2 layout declares:

| Purpose | Location |
|---|---|
| Ordinary live notes | `workbench/sessions/notepads/work/` |
| Other typed notes | Explicit subfolders under `workbench/sessions/notepads/` |
| Tracked schema/examples | `workbench/sessions/notepads/templates/` |
| Handoffs | `workbench/sessions/handoffs/` |
| Older interim JSON notes | `workbench/sessions/grilling/` |
| Operational recovery records | `workbench/sessions/recovery/` |
| Frozen legacy checkpoints | `workbench/sessions/checkpoints/` |

Live `grilling`, `notepads`, and `handoffs` collections are untracked. The templates subcollection is tracked and live-note commands must refuse to write there.

On an older Workbench without the new `notepads` collection, a bare note name falls back to the legacy `grilling` collection.

Recovery records are private operational state, not notepads and not durable evidence.

## Exact data model

A newly created `notepad-1` record resembles:

```json
{
  "schema_version": "notepad-1",
  "revision": 1,
  "id": "N-001",
  "type": "work",
  "status": "PROVISIONAL",
  "title": "Objective title",
  "objective": {
    "key": "lowercase-objective-slug",
    "focus": "What this note must preserve"
  },
  "created_at": "UTC timestamp",
  "updated_at": "UTC timestamp",
  "relationships": {
    "index": null,
    "related_notes": [],
    "retained_sources": []
  },
  "current": {
    "state": "Current compact state",
    "unresolved": [],
    "next_action": ""
  },
  "entries": [],
  "extensions": {
    "durable_owners": []
  }
}
```

### Top-level fields

| Field | Meaning |
|---|---|
| `schema_version` | `notepad-1`; older interim records may be `scope-1`. |
| `revision` | Monotonically increasing write revision. |
| `id` | Visible record identity such as `N-001` or `H-001`. |
| `type` | Normally `work`, `grilling`, or `handoff`. |
| `status` | `PROVISIONAL`, `ACTIVE`, `BLOCKED`, or `RECONCILED`. |
| `title` | Human-readable purpose. |
| `objective` | Stable objective key and optional focus text. |
| `created_at` | Original creation time. |
| `updated_at` | Last successful write time. |
| `relationships` | Index, related-note, and handoff-retention links. |
| `current` | Compact resumption state. |
| `entries` | Ordered historical entries. |
| `extensions` | Runtime-maintained metadata such as sequence high-water marks and durable owners. |

The JSON Schema intentionally permits extensions. The runtime adds stricter checks that the schema alone cannot express, including unique entry IDs, valid correction/dependency links, path safety, identity uniqueness, and revision safety.

### Entry fields

Every entry has:

- `id`
- `kind`
- `content`
- `recorded_at`

An entry may also have:

- `topic`
- `interpretation`
- `corrects`
- `depends_on`
- `question_id`
- `source.file`
- `source.line_start`
- `source.line_end`
- `source.sha256`

Allowed kinds are:

- `directive`
- `source_record`
- `finding`
- `proposal`
- `decision`
- `correction`
- `verification`
- `blocker`

Corrections should identify the entry they correct. Dependencies should identify the required entry. Missing targets are refused.

### Current view

The standard current view contains:

- `state`
- `unresolved`
- `next_action`

A workflow can add its own fields with `--view-field name=value`. Values are decoded as JSON when possible; otherwise, they remain strings. Subsequent current-view updates preserve custom fields.

## Identity rules

New visible IDs are allocated explicitly:

```powershell
node workbench/tools/notepads.mjs allocate --prefix N --objective objective-key --title "Title"
```

Rules:

- Use `N` for ordinary objective notes.
- Use `H` for handoff records.
- Allocation starts at one with a minimum three-character suffix.
- The alphabet is `0-9 A-Z a-z`.
- Width grows instead of truncating.
- IDs do not encode chronology.
- Prefixes have independent scopes in a Workbench.
- Case-folded and leading-zero aliases reserve the same identity.
- Legacy numeric IDs retain their original meaning and are not reinterpreted.
- Allocation assumes one writer.
- There is no eternal registry of deleted local IDs.

Use `--id N-001` when you know the stored identity. Use `--note filename-or-path` when selecting by filename/path. Never combine `--id` and `--note`.

An ID lookup refuses to proceed if unreadable live records prevent the runtime from proving uniqueness.

## When an agent must use a notepad

A note should be created or resumed when meaningful objective work is producing context whose loss would impair continuation.

That includes:

- Multi-step repository work.
- Investigation with non-obvious findings.
- Decisions or corrections that affect later actions.
- Work likely to cross a context limit.
- Work the user may interrupt.
- A workflow that another agent may need to resume.
- A handoff or device transition.
- Work with an unresolved blocker or important next action.

A trivial answer, translation, or one-command interaction does not need one.

The trigger is based on survival value, not elapsed time. The design explicitly rejected a rigid “write every N minutes” guarantee. An optional timer remains a possible future aid only if trials show it prevents real losses.

## How a note is supposed to be used

### 1. Resolve the objective first

Use the strongest available signal in this order:

1. An explicitly named note or handoff.
2. An explicitly named objective.
3. Related notes belonging to that objective.
4. The newest-created local note, but only after checking that it is relevant.

`list` sorts principally by creation time, not by last update. The newest-created record is only a discovery fallback.

```powershell
node workbench/tools/notepads.mjs list --objective objective-key
node workbench/tools/notepads.mjs read --id N-001 --view current
```

### 2. Verify actuality after reading

A note tells the agent where to resume. It does not prove its state is current.

After reading it, verify the live:

- Branch and commit.
- Spec status.
- Filesystem.
- Tests.
- Running process.
- Remote state.
- Deployment or application state, when applicable.

If actuality contradicts the note, append a correction and update the current view. Never silently overwrite history.

This mattered in this investigation: the local S-046 note still said the work was frozen at an older review commit. I verified the live branch and corrected the note.

### 3. Create or allocate through the runtime

For new v3.2 notes, allocation is preferred:

```powershell
node workbench/tools/notepads.mjs allocate --prefix N --objective objective-key --title "Objective title"
```

Legacy named creation remains supported:

```powershell
node workbench/tools/notepads.mjs create --note note-name --objective objective-key --title "Objective title" --focus "What must survive"
```

Do not create the JSON by hand.

### 4. Record important information immediately

Write important information when it becomes known, before continuing with work that would otherwise leave it only in the conversation.

```powershell
node workbench/tools/notepads.mjs append --id N-001 --revision 3 --kind finding --topic runtime --content "Supported finding"
```

Examples worth recording:

- A user directive that changes execution.
- A source passage essential to reconstructing a decision.
- A material finding.
- An uncertainty that must not be forgotten.
- A rejected proposal and why.
- A correction to an earlier claim.
- A named test result.
- A blocker.
- The exact next safe action.

Do not postpone all saving until closeout. An unexpected Stop can preempt the final write.

### 5. Keep the current view compact

Update the resumption view whenever the state, unresolved work, or next action materially changes:

```powershell
node workbench/tools/notepads.mjs current --id N-001 --revision 4 `
  --status ACTIVE `
  --state "Current verified state" `
  --unresolved "Open issue" `
  --next-action "Next executable action"
```

The current view should answer:

- What are we doing?
- What is verified?
- What remains unresolved?
- What must happen next?

It should not duplicate the full entry history.

### 6. Use scoped reads

For resumption:

```powershell
node workbench/tools/notepads.mjs read --id N-001 --view current
```

For relevant history:

```powershell
node workbench/tools/notepads.mjs read --id N-001 --topic runtime --limit 20 --cursor 0
```

Topic, entry, and kind filters combine. Selected entries bring along declared dependencies, entries they correct, and corrections made against them.

Each returned entry says whether it was a direct `match` or supporting `context`.

Pagination reports:

- `matched`
- `returned`
- `has_more`
- `next_cursor`

A limited page must never be described as the complete record when `has_more` is true.

### 7. Use one writer per note

Every write names the revision that was read. A mismatched revision is refused as `stale-revision`.

That check catches sequential stale writes. It is not a lock and does not make simultaneous writers safe.

For parallel work:

- Give each writer a separate related note.
- Maintain one durable writer for any shared spec or Taskboard owner.
- Reconcile the related notes later.
- Do not have several agents append to the same note concurrently.

## Complete runtime command surface

| Command | Supported options |
|---|---|
| `create` | `path`, `note`, `collection`, `objective`, `title`, `focus`, `type`, `status`, `id`, `index`, `related`, `state`, `next-action`, `unresolved`, `view-field`, `retains` |
| `allocate` | `path`, `prefix`, `collection`, `objective`, `title`, `focus`, `type`, `status`, `index`, `related`, `state`, `next-action`, `unresolved`, `view-field`, `retains` |
| `append` | `path`, `note`, `id`, `collection`, `revision`, `kind`, `topic`, `content`, `entry-id`, `corrects`, `depends-on`, `interpretation`, `question-id`, `source-file`, `source-line-start`, `source-line-end`, `source-sha256` |
| `current` | `path`, `note`, `id`, `collection`, `revision`, `state`, `next-action`, `unresolved`, `status`, `view-field` |
| `read` | `path`, `note`, `id`, `collection`, `topic`, `entry`, `kind`, `limit`, `cursor`, `view` |
| `list` | `path`, `collection`, `objective` |
| `validate` | `path`, `note`, `id`, `collection` |
| `trim` | `path`, `note`, `id`, `collection`, `revision`, `entry`, `durable-owner` |
| `delete` | `path`, `note`, `id`, `collection`, `revision` |
| `migrate` | `path`, `note`, `id`, `collection` |

Repeatable options include `entry`, `unresolved`, `related`, `durable-owner`, `depends-on`, `view-field`, and `retains`.

Unknown flags are refused. This prevents a typo such as `--corects` from silently appending an unlinked correction.

Typical named refusals include:

- `invalid-invocation`
- `invalid-note`
- `malformed-json`
- `secret-like-content`
- `duplicate-identity`
- `stale-revision`
- `legacy-schema`
- `retained-dependency`
- `write-failed`

A refused or failed write is supposed to leave the previous valid record unchanged.

## Filesystem and privacy rules

The runtime must:

- Accept only ordinary `.json` files.
- Keep operations inside manifest-declared live collections.
- Refuse the tracked templates collection.
- Refuse symlinks.
- Refuse unsafe native or canonical path aliases.
- Avoid following paths outside the Workbench.
- Name unreadable records rather than discarding them.
- Privacy-scan newly supplied material.
- Preserve existing history without rescanning it.

Do not record:

- Passwords.
- API keys.
- Access tokens.
- MFA or recovery codes.
- Authentication material.
- Raw private financial records.
- Raw medical records.
- Unnecessary personal data.
- Unsafe raw tool output.

Retain safe references to protected material instead.

The privacy rule applies to metadata and filenames as well as entry content. Current `integration` violates that rule in one reproduced case described below.

## Handoffs

A handoff is created only when the user requests a handoff or an authorized workflow requires one. Merely discovering another note does not create a handoff.

A handoff is:

- A separate JSON record.
- Written for a specific destination.
- A compact selection of what that destination needs.
- Not an automatic copy of the whole source note.

Create it with the `handoffs` collection and `handoff` type. When it depends on source material, add canonical retention pointers:

- `--retains NOTE` retains the whole note.
- `--retains NOTE#ENTRY_ID` retains one entry.

Retention behavior:

- An active whole-note pointer blocks every trim and whole-note deletion.
- An active entry pointer blocks removal of that entry and whole-note deletion.
- `related_notes` is navigation only; it does not enforce retention.
- A prose statement saying “keep this” is not mechanically enforced.
- The agent must still verify that the destination can access and understand the selected material.

To release retention, reconcile the handoff:

- Set status to `RECONCILED`.
- Clear unresolved items.
- Clear the next action.

Releasing the handoff does not automatically clean the source. Source cleanup is a separate decision.

## Promotion into durable owners

A notepad remains local and non-authoritative. Important settled material must be distilled into the correct durable owner:

| Truth | Durable owner |
|---|---|
| Agent behavior and safety | `AGENTS.md` |
| Commands and troubleshooting | `RUNBOOK.md` |
| Cross-cutting architecture | `BLUEPRINT.md` |
| Accepted requirements and evidence | Assigned `SPEC.md` |
| Decision rationale | ADR |
| Durable explanatory knowledge | Wiki |
| Public use | `README.md` |

The direct promotion flow requires:

- An authorized existing owner.
- Selected entries.
- Their corrections and dependencies.
- A freshly read destination SHA-256.
- A separately authored candidate document.
- Normal validation for the destination owner.

```powershell
node workbench/tools/sessions.mjs promote --from NOTE --revision N `
  --entries finding-001,correction-001 `
  --to OWNER.md `
  --expected SHA256 `
  --content AUTHORED_DRAFT.md
```

Important limitations:

- The tool does not decide what is authoritative.
- It does not grant permission to edit the owner.
- It does not commit.
- It does not clean the note.
- Its structural checks are not a substitute for semantic review.
- Promotion and cleanup are separate operations.
- One writer is still required.
- On a caught publication failure, it attempts restoration and reports recovery residue if cleanup fails.
- It does not promise machine-crash atomicity.

Simply passing `--durable-owner` to `trim` records a label. It does not independently prove that the material really exists in that owner. The agent must verify the owner first; the `promote` flow gives stronger mechanical proof.

## Cleanup rules

Cleanup must happen only after durable reconciliation.

### Trim selected entries when

- The selected material has been faithfully promoted.
- The durable owner has been verified.
- Remaining entries can still be understood.
- Remaining dependencies stay intact.
- Remaining corrections stay intact.
- No active handoff retains the entry or whole note.

```powershell
node workbench/tools/notepads.mjs trim --id N-001 --revision N `
  --entry finding-001 `
  --entry correction-001 `
  --durable-owner workbench/specs/S-000-example/SPEC.md
```

Trim refuses to:

- Remove something a retained entry depends on.
- Remove a correction while leaving the corrected claim behind.
- Remove an actively retained handoff source.
- Proceed when unreadable live records make retention uncertain.

If a corrected claim is being removed, usually trim both the claim and correction together after the corrected truth is safely present in the durable owner.

Entry IDs are never supposed to be reused. The runtime preserves sequence high-water marks even after entries are trimmed.

### Delete the whole note only when all are true

- Status is `RECONCILED`.
- `entries` is empty.
- There are no non-empty unresolved items.
- `next_action` is empty.
- No active handoff retains it.
- No unreadable record prevents checking retention.
- The caller supplies the current revision.
- The note remains unchanged during the retention check.
- Every important item is already durable or deliberately determined unnecessary.

`current.state` does not have to be blank.

Deletion is a separate operation:

```powershell
node workbench/tools/notepads.mjs delete --id N-001 --revision N
```

There is no routine archive. Once everything important is durable and no active dependency remains, normal cleanup may trim or delete the local record without another ceremonial approval.

Because these notes are ignored local files, deletion may be unrecoverable unless the note was separately preserved through the optional private transport. Do not use deletion as a shortcut for unresolved ambiguity.

### Retain the note when

- Any unresolved finding remains.
- A correction or dependency has not been promoted.
- A handoff still depends on it.
- The next action remains live.
- The durable owner has not been verified.
- A referenced live record is unreadable.
- It is still needed to reconstruct source fidelity.
- Cleanup would erase unique context.

The N-002 preservation record is `RECONCILED`, but its retained source fragments cannot simply be thrown away because the reconstruction index still depends on them.

## Legacy records and checkpoints

Interim `scope-1` JSON notes:

- Remain readable.
- Must be migrated before writing.
- Migrate once, in place.
- Preserve text, timestamps, current fields, and carried metadata.
- Record migration provenance.
- Are not automatically moved to the new layout.

Legacy Markdown notes are not automatically converted merely to change their extension.

The old checkpoint copier is retired:

- `sessions.mjs checkpoint` refuses new checkpoint creation.
- Existing checkpoint files remain frozen and preserved.
- New work uses JSON notes plus direct durable-owner promotion.
- Recovery receipts are operational state, not checkpoints or notepads.

## Optional private session transport

Ordinary notepad use remains local. Cross-device transport is optional and separate.

The current candidate supports an explicitly configured existing private GitHub repository:

```powershell
node workbench/tools/session-transport.mjs configure --checkout PRIVATE_CHECKOUT `
  --branch BRANCH --acknowledge-private-history

node workbench/tools/session-transport.mjs status
node workbench/tools/session-transport.mjs push --note NOTE
node workbench/tools/session-transport.mjs resume --note NOTE
```

Transport rules:

- It must use an existing repository verified as private.
- Public or unknown visibility is refused.
- It never creates the remote.
- It never copies credentials or weakens authentication.
- It uses a distinct transport repository, not the project checkout.
- Only explicitly selected valid live JSON records travel.
- Templates, schemas, durable owners, and recovery files do not.
- Notes cannot transport uncommitted code or running processes.
- Push after a meaningful save or before switching devices.
- Resume fetches before writing local records.
- Unchanged pushes create no new commit.
- There is no force push or implicit remote deletion.
- Conflicting revisions are preserved for explicit reconciliation.
- Local note writers outside the transport do not automatically honor its locks.
- It does not guarantee recovery from machine loss.
- Deleting current data does not remove private Git history.

The design includes a detailed manual conflict process: preserve the competing local bytes in the ignored recovery area, inspect the exact remote SHA and bytes, deliberately choose a baseline, re-author retained findings with revision checks, then push and verify.

## What the source records settled

The five design records establish:

- N-001: one writer, compact current view plus append record, objective-centered identity, and no fixed timer requirement.
- N-002: save important context before interruption can happen; cleanup only after durable reconciliation.
- N-003: handoffs are destination-specific compactions; compound workflows may have several related notes; cleanup may delete its own reconciled note.
- N-004: rollout, installation, cross-provider, Windows, and evidence limitations must be stated honestly.
- N-005: legacy checkpoints require deliberate inventory and retirement rather than automatic deletion.

The original source reconstruction preserved 99 source segments and reconstructed 43,270 bytes with the original hash.

## What is wrong right now

### 1. The linked branch is real, but it is not the current whole implementation

The branch currently ends at:

- `ca7e806e556c1d8fb84c2c77cb97f908d5aff54c`

There is no pull request whose head is that branch.

Current remote `integration` is:

- `eee0f7b3cedb0f3ac518703d44551694c0c8cda3`

They diverge from:

- `a9bf47c9d029feb662ec79f5240e0439a0fcdb76`

The v3.2 work reached integration through later candidates and [PR #80](https://github.com/KaydenClark/LLM_Workbench/pull/80), [PR #81](https://github.com/KaydenClark/LLM_Workbench/pull/81), and [PR #82](https://github.com/KaydenClark/LLM_Workbench/pull/82). The preservation contract previously landed through [PR #76](https://github.com/KaydenClark/LLM_Workbench/pull/76).

The feature branch must not be merged wholesale over v3.2. Its missing fixes should be forward-ported surgically.

### 2. Current integration dropped two late safety fixes

> **Resolved.** Fixed in `2d5124eb9cde94a87d59b8ff0b238baea8368f71`, an ancestor
> of every `integration` commit since the pinned snapshot below. See the notice
> at the top of this report.

I reproduced both defects through the public CLI in a clean disposable clone of `integration` at the pinned snapshot.

#### Filename privacy bypass

A fake GitHub-token-shaped value supplied as the `--note` basename was accepted when no explicit `--id` was supplied.

The intended rule is that all newly supplied material—including filenames—must be privacy-scanned.

#### Oversized entry sequence corruption

An explicit entry ID with an oversized numeric suffix was accepted. The following automatically generated append attempted to create an ID resembling scientific notation and failed.

The note still validated structurally, so ordinary validation did not expose the poisoned sequence state.

The linked feature branch contains later safe-integer and basename-privacy repairs, but the current integration test suite lacks those regression cases.

### 3. Green focused tests do not cover those failures

Verified results:

- Linked feature branch: 20 focused TK-002 tests passed.
- Current integration: 45 notepad tests passed.
- Both current-integration defects were nevertheless reproduced manually.

The correct conclusion is not “the notepad runtime is green.” It is:

> The existing focused suite is green, but current integration has two confirmed, untested safety regressions.

### 4. Installed skills are stale and duplicated

These three installed copies are physical directories rather than one source plus adapters:

- [Personal canonical-looking copy](C:/Users/kayde/.agents/skills/notepad/SKILL.md)
- [Claude copy](C:/Users/kayde/.claude/skills/notepad/SKILL.md)
- [Codex copy](C:/Users/kayde/.codex/skills/notepad/SKILL.md)

All identify an old v3.1.4 source at commit `517f27e...`. They lack current compatibility metadata and newer lifecycle guidance.

The old installed prose incorrectly overstates revision checks as preventing silent simultaneous overwrite. The newer design correctly says revision checks are not locks.

The current skill inventory exposes `notepad` and `save`, but not the newer `promote` skill. This makes the cleanup lifecycle incomplete from the agent’s perspective.

Current v3.2 diagnostics report:

- Unknown notepad-skill compatibility.
- Duplicate Codex discovery.
- Missing `promote` in expected homes.
- Additional global skill drift.

Those findings are informational/attention findings. They do not currently block work, so an agent can continue without a correct notepad installation.

### 5. Tracked notepad examples are stale

Current integration’s doctor reports the schema and three notepad examples as seeded from v3.1.4 while the manifest is v3.2.0.

That is documentation/seed drift and another opportunity for an agent to learn the wrong version.

### 6. Capability acceptance is not fully closed

S-046 has most implementation acceptance checked, including one fresh Codex resumption trial, but its whole-candidate release/integration gate remains open.

The fresh-agent proof was useful, but limited:

- Same provider.
- One Mac-oriented trial.
- Explicit installed-file invocation.
- No actual Stop/token-exhaustion event.
- No real Windows round trip.
- No cross-provider Claude/Codex proof.
- No independent proof of automatic native skill discovery.

S-050 release work also remains active. The capability should not be described as fully completed or universally reliable.

## How to make sure it is actually used

The runtime alone cannot force an agent to remember to invoke it. Reliable use needs several reinforcing controls.

### Required repair sequence

1. Forward-port the two missing feature-branch repairs onto current `integration`.
2. Add red tests for:
   - Secret-shaped `--note` basenames.
   - Unsafe explicit numeric entry suffixes.
   - Safe sequence generation after trim and migration.
3. Run the focused suite and full Workbench suite.
4. Obtain the required independent review against the immutable candidate.
5. Finish the outstanding S-046/S-050 acceptance and release records.
6. Refresh the stale tracked schema/examples from the reviewed release source.
7. Only then update installed global skills from that release.

### Required installation shape

The intended global shape is:

- One physical canonical source under `C:\Users\kayde\.agents\skills\<name>`.
- A Claude adapter resolving to that same source.
- No separate `.codex\skills` duplicate.
- The complete core bundle, including `notepad`, `save`, and `promote`.
- Compatibility markers matching the installed Workbench version.
- Backup and rollback during explicit update.

Do not manually delete the existing copies first. They should be compared and replaced through the authorized installer/update path so divergent material and rollback state are preserved.

### Required entry gate

For meaningful objective work, the agent’s startup procedure should mechanically require:

1. List/resume the explicit objective note.
2. Read its current view.
3. Confirm the current revision.
4. Verify live project state.
5. Correct stale note content before proceeding.
6. Create a note if none exists and context loss would impair continuation.
7. Name the active note and revision in the work’s local execution state.

If the runtime or compatible notepad skill is unavailable, that should block the notepad-dependent capability—not unrelated Workbench work.

### Required during-work gate

Before continuing after a material directive, finding, correction, verification, or blocker:

1. Append the information.
2. Confirm the returned revision.
3. Update the current view if state or next action changed.
4. Do not rely on a final closeout write.

### Required exit gate

Before a voluntary pause or handoff:

1. Validate the note.
2. Read the current view back.
3. Confirm it names the actual verified state.
4. Confirm unresolved work is explicit.
5. Confirm the next action is executable.
6. If switching devices, explicitly push through private transport and verify the acknowledged SHA.
7. State whether the note was retained, trimmed, or deleted and why.

### Required cleanup gate

No cleanup should pass unless a receipt can establish:

- Which entries were considered.
- Where each settled claim now lives.
- Which correction/dependency context was carried.
- Which entries remain unresolved.
- Which active handoffs retain material.
- Whether the durable owner’s current bytes were verified.
- Whether the resulting note still validates.
- Whether deletion conditions are all satisfied.

### Required real-world acceptance

To claim the system is reliable, test all of these rather than only file presence:

- Fresh Codex task automatically discovers and invokes the installed skill.
- Fresh Claude task discovers the same canonical implementation through its adapter.
- A real interrupted task resumes from the note and checks actuality.
- A stale current view is corrected properly.
- Parallel work uses separate notes rather than racing one file.
- A partial promotion failure recovers without false success.
- A handoff blocks premature cleanup.
- A Windows run handles paths and aliases correctly.
- A cross-device private-transport conflict preserves both sides.
- Cleanup refuses unresolved, retained, unreadable, or dependency-breaking states.

## What I changed during this investigation

Using `carry` and the notepad skill changed the investigation materially: instead of trusting the existing resumption state, I reconstructed the branch, remote, specs, runtime, installed skills, tests, and retained records, then corrected the note when live evidence contradicted it.

No tracked repository files were changed.

The ignored local working note is now:

- [notepad-s046-tk002-runtime.json](E:/LLM_Workbench/workbench/sessions/grilling/notepad-s046-tk002-runtime.json)
- Schema: `notepad-1`
- Revision: `42`
- Entries: `33`
- Status: `ACTIVE`

Its current unresolved work is now explicitly:

1. Forward-port the privacy and safe-integer repairs.
2. Converge global skill installation and prove Codex/Claude discovery.
3. Refresh stale seeds and finish the remaining release gates.

The disposable audit clone and all deliberately malformed demonstration notes were removed after verification. Existing unrelated workspace changes were preserved.

## Bottom line

The intended operating rule is:

> Create or resume a private JSON objective note when meaningful work could be lost; save survival-critical context as it becomes known; maintain a compact current view; verify actuality on every resume; promote settled truth into the proper durable owner; preserve corrections, unresolved work, and active dependencies; then trim or delete only after verified reconciliation.

The immediate cause of repeated misuse is not just agent behavior. It is version fragmentation:

- The best fixes are on one unmerged branch.
- The broader lifecycle is on another line.
- The installed skill copies describe an older third version.
- Diagnostics currently warn but do not prevent notepad-dependent work.
- Native discovery has not been proven strongly enough.

Until those are converged and the two reproduced regressions are repaired, notepad use should be treated as implemented but not fully released or reliably enforced.
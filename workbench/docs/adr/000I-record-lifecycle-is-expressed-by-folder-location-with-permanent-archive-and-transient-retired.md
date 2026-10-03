---
date: 2026-09-12
canonicalized_in:
  - AGENTS.md
  - LEXICON.md
  - RUNBOOK.md
---

# Record lifecycle is expressed by folder location with permanent archive and transient retired

Lifecycle is expressed by folder location across one-record-per-location artifacts: Specs, Tasks and ADRs. Folder location is the source of lifecycle truth. Task progress (`ready`, `in-progress`, `done`) is distinct from folder lifecycle and remains in `TASK.md`; Spec delivery and approval fields likewise describe progress and gates, not an alternate lifecycle location.

Active records occupy the live collection. ADRs in its top level are accepted active decisions; `proposed/` holds ADRs not yet Canon. A legacy status key may remain only when consistent with location; the validator reports a disagreement. This does not turn a live Spec or Task into completed work merely because it is in the active folder.

The terminal locations have deliberately opposite retentions:

- **`archive`** is permanent storage for superseded and deprecated ADRs and is never cleared. [ADR-000A](000A-active-adr-decisions-and-destination-blueprints.md) preserves their original bodies and complete reachable history. Register routes active decisions; history exposes all retained states.
- **`retired`** is a transient staging area for reconciled Specs and Tasks. Their useful content must reach maintained durable owners before discard; Git retains recoverable identity and evidence. No permanent Spec archive is added.

The full Spec closure sequence is reviewed delivery on `integration`, owner approval, verification on `main`, then `complete`, features Wiki capture, retirement and discard. [ADR-000F](000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md), [AGENTS](../../../AGENTS.md#owner-closure-and-reconciliation) and [Runbook lifecycle procedures](../../../RUNBOOK.md#spec-lifecycle-and-retrieval) carry the gates. Completed Task results and proof are reconciled into their Spec before retirement; Spec-bound Task discard waits for the parent closure/capture and containment conditions. Current-reference scanning, verified main containment and recoverable Git identity remain required; this decision performs no cleanup and grants no owner approval.

The earlier FND-Q07/FND-Q08 deletion hold is lifted by the locked WF-8D/WF-8E/WF-8F answers. The features article is written at the closure point under WF-8H. A later gap against that reconciled destination becomes a new Spec under its landmark or the Blueprint, never a revived `SPEC.md` and never a correction anchored to a Wiki claim.

The stable-path rule is retired with its old durable-Spec premise. Reachability now comes from the supported `move-spec` and `move-task` operations rewriting live references and counting historical ones, not from forbidding folder movement. ADR moves use the separate ADR lifecycle runtime. The former flat-corpus, frontmatter and folder-unaware-successor obstacles below are historical observations at `c0ac60a`; S-00I delivered folder-aware records, literal-link rewriting and migration. This decision does not introduce another move or accept command.

Considered and rejected: frontmatter status as the independent lifecycle source. It is invisible in a directory listing and permits disagreement with location. Progress and approval facts still belong in their records; they are not removed by this lifecycle rule.

Considered and rejected: one shared terminal folder for every artifact. Opposite retention needs must remain explicit so a Spec cleanup cannot clear permanent ADR history. The two names preserve that distinction.

## Acceptance and correction

S-00P TK-004 accepts the confirmed folder decision and reconciles its original held/flat-tree premises against the locked WF-8D/WF-8E/WF-8F/WF-8A/WF-8G/WF-8H answers, [S-00I](../../specs/S-00I-folder-lifecycle-for-records/SPEC.md) delivered moves/retirement/discard and [S-00J](../../specs/S-00J-spec-qa-gate-at-integration/SPEC.md)'s closure-capture transition contract. Source answers and corrections remain in the [grilling destination ledger](../../wiki/grilling-destination-audit-ledger.json); the Contract owners above carry the operational rule. Board substates and sitrep behavior remain separately assigned destination work, not delivered by this ADR acceptance.

## Historical proposal

The complete earlier proposal follows as historical evidence rather than active decision, at `git show 5d743b4fda292ad772d2505aa3732c83d719fa81:workbench/docs/adr/proposed/000I-record-lifecycle-is-expressed-by-folder-location-with-permanent-archive-and-transient-retired.md`. Only its literal Markdown links were rewritten by the move. Its hold, flat-directory inventory, frontmatter and stable-path claims describe that tree and cannot reinstate those superseded premises.


# Record lifecycle is expressed by folder location with permanent archive and transient retired

Lifecycle is expressed by **folder location**, as one cross-cutting pattern
covering every one-record-per-location artifact type — Specs, Tasks and ADRs —
rather than three per-collection conventions. Folder location is the source of
lifecycle truth. Status frontmatter comes out, so two places cannot disagree
about whether a record is live.

Active records stay at the top level of their collection. A **proposed**
location holds records that are not yet Canon. The two terminal locations carry
deliberately opposite retentions:

- **`archive`** is permanent storage. Superseded and deprecated ADRs go there
  and are never cleared, because
  [ADR-000A](000A-active-adr-decisions-and-destination-blueprints.md) requires
  complete history to stay reachable with original record bodies preserved.
- **`retired`** is a transient staging area. Completed Specs and Tasks go there
  and are cleared only after the exact change is verified on `main`.

The opposite retentions are the reason for two names. A single term covering
both would let one clearing procedure be pointed at permanent history by
accident, and `LEXICON.md` already forbids one term standing for two concepts.

Considered and rejected: keeping frontmatter `status` as the source of lifecycle
truth, as `workbench/tools/adr.mjs` implements today. It is invisible until a
record is opened, so the active roster cannot be read off a directory listing,
and it permits a record whose location and status disagree.

Considered and rejected: one shared terminal folder for every type. Specs and
ADRs have opposite retention needs, and collapsing them makes the safe behavior
depend on remembering which type a record is.

Consequences: this decision does **not** authorize clearing anything. Its
Spec-and-Task clearing half is entangled with the held FND-Q07/FND-Q08 deletion
gate and stays blocked behind it. Live obstacles a scoped migration must handle,
verified read-only at `c0ac60a`: `workbench/docs/adr/` is flat with 44 records
and lifecycle read from frontmatter; `workbench/tools/adr.mjs` requires
`superseded_by` to be one whole-record filename with no path, so successor
resolution is not folder-aware; 20 ADR files carry relative intra-ADR links that
break when a target moves; 15 accepted ADRs name live `workbench/specs/S-*`
paths; and the moving unit differs by type, a file for an ADR and a directory
for each of 54 Specs. Applying the pattern to Tasks depends on
[ADR-000H](000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md),
because a table row cannot occupy a folder.

The stable-path rule in `AGENTS.md` — a declared Spec path never moves between
active, done and archive folders — is the direct inverse of this pattern and is
retired with the premise it served, at acceptance and not before. It was
introduced in commit `ec94022` alongside making the Spec the durable owner; it
means what it says, and it is not reinterpreted here as a rule about absolute or
machine-specific paths.

Provenance: owner decisions recorded 2026-09-11 as `decision-039`,
`finding-016`, `decision-040` and `decision-041` in the live grilling note
`workbench-foundation-rework-2026-09-11`, untracked working material named as
origin rather than durable evidence.

## Promotion status

This record is `proposed`. The ADR directory stays flat, no `proposed`,
`archive` or `retired` folder is created, frontmatter `status` remains the live
lifecycle mechanism, and the `AGENTS.md` stable-path rule remains live Canon,
until the owner accepts this decision.

## Later-gap correction

The corrective-work Spec ([S-004F](../../specs/S-004F-corrective-work-rules/SPEC.md)) replaces the sentence that sent a later repair to its Wiki claim (WF-8A/WF-8G), under ADR-000A's amendment-first rule. The earlier text reads at `git show f91bfd72f41c4b471f1756781649375abb68d158:workbench/docs/adr/000I-record-lifecycle-is-expressed-by-folder-location-with-permanent-archive-and-transient-retired.md`. The owner's answer is recorded in [the scaffolding decision](../ddr/000M-working-artifacts-are-scaffolding-cleared-away-once-their-knowledge-is-kept.md). The folder lifecycle and the rest of this decision are unchanged.

# Checkpoint rationale and preservation disposition

Source tree: `16988da94dac455355aecf3c6f9d80b933b03574`. Every source path and
line in the accompanying inventory reads at that immutable tree. This is an
S-048 preservation and migration account, not a new instruction source or a
claim that retirement is already implemented.

## Why checkpoints existed

The v3.1 plan's locked decision 8 required privacy-checked durable copies of
otherwise ignored grilling and handoff records. Decision 10 required a pushed
planning state and a different provider resuming from a clean clone. ADR-0028
records why force-adding the ignored original was rejected: it obscured which
neighbouring records were recoverable and skipped the explicit privacy crossing.
S-023 supplied the manifest collection and managed runtime; S-026 supplied the
copying command and mechanical workflow. These were concrete attempts to solve
publication privacy and clean-clone continuity, not proof that a copied record's
claims were correct or authorized.

At the source tree, `sessions.mjs checkpoint` scans one source, prepends a
source/date stamp when absent, publishes a new Markdown file exclusively and
refuses unsafe paths or private content. The command copies a record; it does
not select claims, reconcile corrections into an existing owner or validate the
meaning of those claims. S-026 explicitly limits its round-trip test to a
provider-free mechanical fixture.

S-022's retained cross-provider record separately reports Claude planning and
Codex implementing a greeting CLI at named old commits. It also records a
sandbox-blocked attempt and a fresh-Claude authentication failure. Preserve all
of those qualifications. None is fresh v3.2.0 host, cross-device or release proof.

## Complete preserved record set

The inventory lists all five Markdown records and the empty `.gitkeep`, including
SHA-256 and byte length. All five hashes match the earlier source inventory and
the independently read-back S-046 continuity result. Their paths and every
existing inbound citation remain unchanged.

| Record | Material and disposition | Existing owner or continuation route |
|---|---|---|
| `llm-workbench-v3-1-plan-2026-09-04.md` | Historical accepted release decisions, rejected alternatives and an isolated-provider open question; retain all bytes and original statuses. | ADR-0025 through ADR-0033, S-023 through S-026, and historical S-022 proof; current changed continuity direction is ADR-0054 and S-048. |
| `s022-cross-provider-resume-2026-09-04.md` | Historical provider run, exact commits, output and adverse attempts; retain as bounded evidence. | S-022/TK-002; new actual transport/host proof belongs to S-052/S-053 and release acceptance to S-050. |
| `workbench-boundaries-redesign-2026-09-04.md` | Pre-interview proposals, evidence limitations and observed failures; preserve as antecedent, never treat recommendations as locked answers. | Later boundaries grilling record supplies the answer history; ADR-0034 through ADR-0038 and current controls carry accepted rules. |
| `workbench-boundaries-grilling-2026-09-04.md` | Q1-Q16 locked answers coexist with earlier proposal prose and stale interview prompts. Preserve the correction history; later locked answers govern its interpretation. | ADR-0034 through ADR-0038 and their named control owners; S-048 narrows future checkpoint creation only. |
| `workbench-pivot-stability-2026-09-04.md` | A dated paused baseline and interrupted audit, with a preserved candidate and no release claim. Keep its historical pause; it does not pause current authorized v3.2.0 work. | Current S-050 assignment and live source state; historical S-022 remains intact. |

Retaining the complete records is the preservation-safe disposition for all
remaining tentative, duplicate or unresolved material. This inventory does not
erase an old question merely because later work continued, and creates no new
queue items from historical next-action prose.

## Representative dependency trace

1. The v3.1 plan's session-durability decision is cited as provenance by ADR-0028.
2. ADR-0028 binds only through its declared AGENTS/Runbook owners; S-026 records
   the bounded implementation and privacy/round-trip tests.
3. The live producer is `workbench/tools/sessions.mjs`; the current checkpoint
   skill and workflow instructions call or route to it.
4. Adoption and upgrade reuse `collections.checkpoints` for operational recovery
   JSON and legacy skill backups. Those are distinct consumers whose retirement
   cannot be inferred from a successful notepad read.
5. ADR-0054 and assigned S-048 now select direct reconciliation into durable
   owners, retain old citation targets, and require a separate recovery location
   before retiring the producer. No literal folder deletion is requested.

## Active consumer dispositions

The accompanying inventory retains every checkpoint keyword match as a pinned
source coordinate and every explicit collection/path reference. It separates
historical records from active migration work; counts describe the inspected
snapshot, not an assertion that every match needs editing.

- Sessions producer and checkpoint skill: retire new copy creation only after
  direct promotion and recovery replacements work. Preserve an explanatory
  refusal for legacy command invocation rather than silently redirecting it.
- ADR creation/provenance messages, root and template controls, and ordinary
  workflow skills: route new claims to their named durable owners; keep frozen
  historical citations. Git commit recovery references in implement/carry are
  not calls to the retired session-copy command.
- Manifest/layout/Genesis: keep historical checkpoint paths resolvable, declare
  operational recovery independently, and preserve legacy adoption/migration
  data rather than moving published records again.
- Adoption/upgrade: write new recovery receipts and backups to operational
  recovery; preserve old references and prove restoration of a changed target.
- Round-trip and cross-provider fixtures: promote selected material into an
  existing spec/control owner and retain clean-clone/source-identity assertions.
  Their mechanical success remains distinct from actual provider transport.
- Tests: keep legacy rollback and frozen-byte cases; replace tests that require
  new checkpoint copies. Optional team-coordination snapshot naming is a separate
  demonstration format, not a sessions checkpoint dependency.

## Checkable continuation without a new checkpoint

The S-046 [continuity result](../S-046-json-notepad-foundation/continuity-result-2026-09-08.json)
records a fresh no-history agent using an explicitly installed notepad skill,
recovering a corrected S-048 disposition and completing useful file/consumer
verification. Source and retained handoff dependencies survived cleanup refusal.
The parent and independent reviewer read back hashes. This is one local
same-provider recovery, not native discovery, an actual Stop/crash trial,
Windows, private transport or rollout readiness.

An arriving agent follows the current Contract and assigned S-048, reads this
account and its pinned inventory, verifies the relevant current source, then
implements TK-002 direct promotion and TK-003 recovery migration. No new copied
checkpoint is needed for that route. Existing operational rollback remains
necessary until TK-003 proves its replacement. No source cleanup is authorized
merely by completing this inventory.

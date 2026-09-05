# Boundaries Workflow Feedback Report

## Target And Scope

- Date: 2026-09-05 UTC (implementation authorized 2026-09-04 local time).
- Assigned capability: [S-027](../specs/S-027-workbench-v3-1-1-boundaries/SPEC.md).
- Target: local implementation checkpoint `bfae8c0d731d1a799a487b0848f2e39af25c68d5`. This is the v3.1.1 behavior checkpoint before version stamping, not a
  released version or a remote recovery claim.
- Question: can the accepted route and stance workflow support setup and
  evidence-backed feedback without manufacturing another queue or repair task?
- Inspected scope: the three entry controls, assigned spec, Wiki routing,
  ADR-0034 through ADR-0038, four stance sources, installer/layout seams,
  report format, and the guardrail auditor's evidence-freshness calculation.

## Evidence And Limitations

- Fresh-context Round One passed after following AGENTS -> RUNBOOK -> LEXICON,
  manifest-resolved S-027, Wiki and relevant ADRs. It authored no prose artifact;
  the existing spec records its chat result and dirty-tree limits.
- `node tools/test-core-skill-installer.mjs`: 6/6, including all four stances
  through one-level discovery in both disposable provider roots, preservation
  on repeat setup, and fail-before-write collision cases.
- `node tools/test-workbench-layout.mjs`: 14/14, including compatibility with
  the old twelve-skill manifest and rejection of missing stances for v3.1.1.
- `node tools/test-workbench-round-trip.mjs`: PASS after reproduced producer-path
  leakage was fixed. The raw-output private-path assertion remains unchanged.
- All 29 commands in the AGENTS/Runbook suite union passed before this local
  checkpoint; ADR, Wiki and diff checks passed. Later version stamping and any
  review repairs require their own verification.
- These are bounded setup, structural and mechanical observations. They do not
  prove comparative agent outcomes, a fresh cross-provider completion, correct
  real user installations, or a published release. Older provider proof is
  historical and was not rerun here.

## Findings

### F-001 — Medium: guardrail audit misses evidence in the current spec lane

**Location:** `tools/audit-guardrails.mjs:330`, especially line 334.
`taskboardProofIsFresh` selects only `specs/S-###-slug/SPEC.md`, while this
repository's manifest declares `workbench/specs`. Current dated evidence is
loaded but excluded from the freshness calculation. The owner is told to add
fresh proof even when it already exists in its correct owner; this can prompt
redundant work and understates the guardrail score by five points.

**Reproduction:** run at the pinned target; it changes only an in-memory map,
never files or the audit criterion:

```bash
node --input-type=module <<'JS'
import { loadAuditFiles, auditGuardrails } from './tools/audit-guardrails.mjs';
const files = loadAuditFiles('.');
const alias = Object.fromEntries(Object.entries(files).map(([name, text]) =>
  [name.replace(/^workbench\/specs\//, 'specs/'), text]));
const fresh = input => auditGuardrails(input, { today: '2026-09-05' })
  .categories.flatMap(category => category.checks)
  .find(check => check.id === 'proof_freshness').passed;
console.log({ manifestLane: fresh(files), legacyAliasSameBytes: fresh(alias) });
JS
```

Observed result: `{ manifestLane: false, legacyAliasSameBytes: true }`.
The same bytes pass when indexed by the legacy path. The raw measured audit is
73/100, up from 68/100 after resolving stale Runbook prose. The alias probe is
not a new accepted score and changes no recorded benchmark result.

**Bounded proposal:** in a separately authorized repair, make the audit's spec
lookup respect the manifest lane and add red/green coverage for both layouts
and malformed manifests. Check the neighboring `hasContradictorySpecState`
legacy-path predicate as part of that investigation; its downstream impact
has not been demonstrated by this report. Preserve weights and freshness rules.

## Challenged Or Rejected Findings

- “The four stances require nested directories and a new discovery subsystem”:
  unsupported. Flat installed directories satisfy the observed one-level
  discovery seam; a separately nested installation still needs a flat symlink.
- “The current workflow proves improved agent outcomes”: rejected. One bounded
  setup proof and mechanical tests do not supply repeated controlled trials.
- “The guardrail freshness recommendation proves the spec lacks recent proof”:
  contradicted by the same-bytes path-alias reproduction above.
- “A useful feedback report must include a repair”: rejected by the accepted
  report/repair boundary. F-001 is recorded without changing its target.

## Next Action And Open Questions

The accepted next action remains S-027 candidate verification, version stamping,
and separate-context review, followed by owner approval to push the concrete
local candidate. Automatic approval review rejected remote publication without
explicit authorization; local checkpointing is permitted. No remote candidate,
integration merge, or release is claimed.

F-001 is a proposed follow-up awaiting owner authorization. There is no new
self-created task, assigned repair or automated repair trigger. A fresh session
should find this report from S-027 and accurately identify that pending decision.

## Review Boundary

This is a Builder-produced report, with no independent PASS implied. The
candidate's separate-context review must challenge its consequential claims
before integration. Source references and the reproduced F-001 are available
for that review; publication and final release authority remain separate.

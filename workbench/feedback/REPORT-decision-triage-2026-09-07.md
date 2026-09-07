# Historical Decision Triage - 2026-09-07

Read at `1628a65` (manifest v3.1.3, 28 accepted ADRs, 45 specs). Source packet:
`workbench/feedback/llm-workbench-decision-recovery.zip` (181 records, 178 evidence snapshots).

**Full interactive docket:** https://claude.ai/code/artifact/2e52dcab-2888-43cc-ac1c-dc031844dff1

This is a Grounding report. It changed no ADR, control or spec, and it authorizes no repair.

## Disposition summary

| Disposition | Items |
|---|---:|
| NEEDS KAYDEN | 7 |
| KEEP - ADR | 12 |
| KEEP - CONTRACT | 4 |
| KEEP - DOC | 11 |
| ALREADY COVERED | 56 |
| OUT OF SCOPE | 12 |
| SUPERSEDED | 2 |
| REJECT | 1 |
| MERGE WITH <candidate> (all targets) | 76 |
| **Total** | **181** |

147 items need no durable artifact of their own. ~60 ADR candidates reduce to 19: 14 proposed, 5 awaiting owner decision. Plus 3 amendments to existing ADRs.

## Owner adjudication queue (5)

### CAND-F - Where the portable core bundle ends and the personal skills home begins
- **Sources:** R038 R068 R162
- **Question:** Does the Workbench ship promote/save/handoff and the lifecycle skills, or do they stay in KaydenClark/skills outside every room?
- **Existing relationship:** Contradicts nothing formally, but S-048 calls save 'unimplemented' while a working save and promote exist in ~/.claude/skills.
- **Why it reaches you:** It decides what a fresh room can actually do, and several upstream specs already reason about skills the bundle does not contain.
- Full case file with recommendation, consequences and lettered choices: see the docket.

### CAND-N - How continuity crosses machines
- **Sources:** R054 R136
- **Question:** Notes are local-only and gitignored, but the owner works on two machines. What carries objective continuity across them?
- **Existing relationship:** ADR-0040 selects JSON and local-only and deliberately leaves transport unselected; ADR-0028 makes tracked checkpoints the only current crossing.
- **Why it reaches you:** Local persistence and cross-host recoverability are different guarantees, and the gap is currently invisible because nothing claims to close it.
- Full case file with recommendation, consequences and lettered choices: see the docket.

### CAND-O - The implementation language of the portable runtime
- **Sources:** R150
- **Question:** Node stays, or the runtime migrates to Python.
- **Existing relationship:** No ADR. All portable runtime tooling is Node .mjs; only the evals lane is Python.
- **Why it reaches you:** It is the largest unrecorded architectural fact in the repository and the owner stated a contrary preference that was never adjudicated.
- Full case file with recommendation, consequences and lettered choices: see the docket.

### CAND-P - The provider enforcement floor
- **Sources:** R151
- **Question:** What must a host provide before the Workbench claims to work on it, and does the harness ship provider-native enforcement or stay prose plus tools?
- **Existing relationship:** ADR-0005 requires a running consumer but names none for provider behavior; skillPolicy.discovery is the only provider-aware declaration.
- **Why it reaches you:** It decides whether portability means identical instructions or identical guarantees, which changes what every conformance test can assert.
- Full case file with recommendation, consequences and lettered choices: see the docket.

### CAND-Q - The durable promotion boundary after checkpoints
- **Sources:** R051
- **Question:** If checkpoints retire, what becomes the privacy-checked crossing from local working record to durable evidence?
- **Existing relationship:** ADR-0028 makes checkpoints that crossing; S-048 (planned) proposes retiring them; ADR-0040 points at reconciliation into owners instead.
- **Why it reaches you:** ADR-0028 is currently load-bearing for every durable citation into a session record, so retiring its target is a foundational change.
- Full case file with recommendation, consequences and lettered choices: see the docket.

## Proposed new ADRs (14)

| Candidate | Decision | Source items |
|---|---|---:|
| CAND-A | The perpetual handoff is the acceptance boundary | 5 |
| CAND-B | Proof, independent judgment and owner authorization are three different facts | 3 |
| CAND-C | The harness is judged by agent outcomes against held-out baselines | 7 |
| CAND-D | Feedback carries model provenance, evidence class and durable finding identity | 2 |
| CAND-E | Skills compose as primitives; invocation, composition and authority are separate axes | 6 |
| CAND-G | Genesis, adoption and upgrade are distinct operations over validated sources | 6 |
| CAND-H | Provenance is layered: release, adoption, installed generation, present bytes, running runtime | 6 |
| CAND-I | Delivery is proven by the exact ref and object, not by local state | 4 |
| CAND-J | An unavailable baseline is a third state, recorded with evidence | 1 |
| CAND-K | Control fidelity: filling a placeholder preserves the surrounding rule | 3 |
| CAND-L | Record syntax is portable; reading never rewrites | 1 |
| CAND-M | One durable writer per shared surface | 2 |
| CAND-R | Extension architecture is retained as lineage, not revived | 35 |
| CAND-S | An open follow-up needs a reachable current owner | 2 |

## Amendments to existing ADRs (3)

- **ADR-0026** - Add the inter-room interface and the public/private packaging boundary (R080 R096). ADR-0026 names LLM_Workbench the sole source but not the deployer and auditor roles that GPT_OS and Audit_Workbench actually play, nor the rule that a public product excludes private instance state.
- **ADR-0037** - Name target movement as a trigger for fresh review (R077). ADR-0037 says a changed candidate needs fresh review; it does not say that a moved integration target producing a different merge result is such a change.
- **ADR-0040** - Preserve question identity across notepad merges (R052). ADR-0040 requires preserving sources, uncertainty and corrections but not stable question identities, which is how earlier recovery attempts lost dozens of settled answers.

## Verified findings outside the triage

- Three installed personal skills (`checkpoint`, `make-it-so`, `grilling` in `~/.claude/skills`) name
  `workbench/sessions/grilling diary/`, which does not exist. The manifest declares
  `workbench/sessions/grilling`; the Workbench source `skills/checkpoint` is correct. R053 still live.
- `diagnostics.mjs` `stale-claim` says "older than one working day"; no tool defines the day boundary
  or timezone (R120).
- `REPORT_FORMAT.md` requires target revision and installed-skill provenance but never requires the
  evaluated model to be named separately from the reporting model (R089).
- R041 is reconciled, not changed: `REGISTER.md` is generated by `adr.mjs`, marked do-not-edit, and
  `stale-register` is `attention`/blocks-none. The 2026-09-03 no-hand-index ruling is intact.

## Per-item ledger

The full one-row-per-item ledger is `decision-triage-2026-09-07.csv` (spreadsheet) and
`decision-triage-2026-09-07.json` (records, candidates and amendments). Every one of the 181 source
items appears with a disposition, target artifact, confidence and the evidence the disposition rests on.

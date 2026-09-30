# TK-003O - Render a reproducible six-lane JSON preview through the public command

**Task ID:** TK-003O
**Spec ID:** S-01X
**Slice:** Render a reproducible six-lane JSON preview through the public command
**Status:** done
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: S-01X criteria 1 and 2, first opt-in render fixture only; canonical root switch and assembled capability remain later slices.
**Planned verification:** Red public render --format json cannot emit schema-v1 six-lane TASKBOARD.preview.json. Green public fixtures verify Spec/Task grains, WBID collision/alias refusal, readable resolving sources, priority order, child gates, live/retired cleanup derivation, deterministic source regeneration and edited-output restoration, invalid-source and linked-output no-write controls. Default render bytes remain unchanged. Run focused suite, full48 AGENTS plus3 RUNBOOK checks on immutable checkpoint, then native close evidence/final metadata validation and separate exact-head Task PR review.
**Proof:** Exact implementation e7bd9789c15e59c8bfa4c8c84aa04e165626f67d: all 51 required local commands PASS (48 AGENTS plus three RUNBOOK); nine public JSON regression groups PASS; node tools/test-taskboard-json.mjs --demo under one minute. Red ec18730a69d57db26bec32f7bec77201eabf10d7 had nine expected preview failures with runtime unchanged. Self-drift pre/post retained seven existing findings (inspection pre also detached); guardrails unchanged 78/100 with four recommendations; no clean-update or owner QA claim.

## Boundary And Remaining Delivery

The parent authorized the first S-01X implementation slice from current integration `2c47d96239dd48f17969e4d5fa8f668850c2ecfe`, following WBID -> board -> S-00P controls. S-01W allocation, selectors, explicit touch and artifact consumers are delivered (acceptance 1-4); its claimed TK-002R documentation/assembled QA remains separate, not completed here. This Task activates S-01X through convert-tasks --activate and claims it through native operations.

The temporary public boundary is `render --format json`, writing only `TASKBOARD.preview.json`. Source records remain authoritative; this preview is not a second canonical state store. Default render still owns Markdown and CATALOG. No root/template switch, identity widening, needs-review source vocabulary, next/claim/doctor selection integration, sitrep or direct-Task home is delivered. Shared runtime changes are confined to the render seam plus a new pure module and its managed-runtime registry entry; RUNBOOK usage belongs only to the render section, away from S-01W Visible Identifiers QA. New tests are imported by the existing full-suite entry. Existing records and historical identities stay unchanged.

Flat card keys must be unambiguous WBIDs. A legacy numeric Task label remains Spec-scoped in its source; colliding flat preview keys refuse with both source paths, without renaming or silently dropping either record. That refuses an unrepresentable preview, not the existing source records or default Markdown workflow. Later rollout must reconcile this boundary explicitly before the canonical switch.

## Focused Verification

At test-only commit `ec18730a69d57db26bec32f7bec77201eabf10d7`, the corrected manifest-aware fixture produced nine expected public-preview failures while runtime bytes matched the claim checkpoint. Earlier fixture setup failures were corrected before counting behavior evidence. The implementation passes all nine regression groups and the six-lane command demo. The fixture verifies source regeneration, output repair, default Markdown/CATALOG byte parity, flat collision and native alias rejection, unfinished-child gates, metadata and unsafe-path refusal. Full required checks and independent exact-head review remain pending at this checkpoint.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | codex/s01x-tk003o-json-preview | e7bd9789c15e59c8bfa4c8c84aa04e165626f67d | ahead 0 behind 0 | 0 | Exact implementation e7bd9789c15e59c8bfa4c8c84aa04e165626f67d: all 51 required local commands PASS (48 AGENTS plus three RUNBOOK); nine public JSON regression groups PASS; node tools/test-taskboard-json.mjs --demo under one minute. Red ec18730a69d57db26bec32f7bec77201eabf10d7 had nine expected preview failures with runtime unchanged. Self-drift pre/post retained seven existing findings (inspection pre also detached); guardrails unchanged 78/100 with four recommendations; no clean-update or owner QA claim. | RUNBOOK render procedure, S01X source boundary and TK003O implementation/proof; templates unchanged for temporary opt-in preview. | Independent exact-head Task PR review pending; whole-Spec criteria remain unchecked. Shared selection/review vocabulary, flat legacy-ID reconciliation before root switch, direct/orphan Task coverage, sitrep and canonical root/template rollout remain later slices. S01W claimed QA remains separate. | 86849ca368182e5db1d6a7b0f23244e0a6fbb5c181365f9ace328c0d32a9ed1e |

## Independent Review Correction

Independent exact-head review of `7a1746843200ca14243ff6337ce2345103f6eac3` failed with one P2 despite independent full51 passing: the preview duplicate guard disagreed with whole-document normalized parsing and allowed malformed source to overwrite JSON. The native failed verdict in the owning Spec creates [TK-003P](../TK-003P/TASK.md) for this correction. This closed Task and its original receipt/proof remain preserved history; no integration acceptance is claimed.

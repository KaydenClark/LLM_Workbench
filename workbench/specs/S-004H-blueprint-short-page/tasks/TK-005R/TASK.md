# TK-005R - Make the evaluator and the guardrail audit recognize the four-part Blueprint at the owners that hold each criterion

**Task ID:** TK-005R
**Spec ID:** S-004H
**Slice:** Make the evaluator and the guardrail audit recognize the four-part Blueprint at the owners that hold each criterion
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: The evaluator and guardrail audit recognize the four-part Blueprint, no criterion was removed to keep a score, and the before and after scores are recorded.
**Planned verification:** Red first: `node tools/test-evaluate-workbench.mjs`, `node tools/test-guardrail-audit.mjs` and `node tools/test-workbench-layout.mjs` fail against a four-part fixture (the project model scores below its weight and the audit treats the four-part Blueprint as legacy). Then green with the eight-part fixture still scored as before. Baseline recorded before editing: guardrail audit 78/100 on this tree and the template evaluation 106.6/113. Full AGENTS suite on the committed candidate.

## Outcome

Changing the Blueprint's shape does not quietly lower the harness's score or
send the audit down its legacy path. Each of the five project-model checks
keeps its weight and finds its evidence where the four-part shape and the
Contract now hold it: the promise in the Blueprint's what-it-is and promised
outcomes, the architecture in the ownership schema and routing, the
invariants and safety boundaries in the Contract's safety and verification
sections plus the Blueprint's non-goals.

## Scope

Add the four-part shape as an additional recognized variant in
`tools/evaluate-workbench.mjs` and as a destination-shaped Blueprint in
`tools/audit-guardrails.mjs`; extend `tools/test-evaluate-workbench.mjs`,
`tools/test-guardrail-audit.mjs` and the Blueprint fixture in
`tools/test-workbench-layout.mjs`. Keep the eight-part variants working so the
swap lands without a scoring gap. Do not reweight, remove or loosen a check.

## Acceptance

- [ ] A four-part Blueprint plus the generic Contract scores the full project
      model weight, and removing any of the four headings or the Contract
      evidence loses credit.
- [ ] The audit detects the four-part Blueprint as destination-shaped.
- [ ] The before and after scores and remaining recommendations are recorded in
      the Spec evidence.

## Boundaries

No Blueprint, template or Contract edit; this Task only teaches the checks.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004h-tk005r-evaluator | 1ac66e66c4aa7ba03e63ae8c1377f28a11f02e39 | ahead 1 behind 0 | 0 | Red first: test-evaluate-workbench (four-part fixture scored 1.6/8 on the project model) and test-guardrail-audit (four-part Blueprint fell to the legacy path) failed; green after the change. Full AGENTS suite on committed candidate 1ac66e66: 47 of 48 commands pass in a four-way parallel run; node tools/test-wiki.mjs failed once on a concurrent read of workbench/manifest.json and passed alone on the same candidate (14/14). Baseline before editing: guardrail audit 78/100 on this tree, template evaluation 106.6/113; after: guardrail audit 78/100, template evaluation 106.6/113, and a template copy with a four-part Blueprint also 106.6/113, so no criterion moved or was dropped. Remaining recommendations unchanged (outcome evidence 8/30; no real repeated outcome trials, so no agent-outcome claim). | none: tools and tests only; the Blueprint, template and Wiki change in later Tasks | none for this Task; TK-005S swaps the pages and re-records both scores | 39619bcfbf76acadb2a2376593d3953f6b459b9526c3cee5bcc1d14550a75bc7 |
| 2 | claude/s004h-tk005r-evaluator | b9c2228b281892e67e9f65529d34182e968127df | ahead 2 behind 0 | 0 | Review round 1 (separate context, PR 295 at 63441a85) failed two findings: a page of bare headings and a lone What it is heading earned credit the eight-part shape did not. Fixed at 17575a09: every four-part variant needs all four headings and text under them, and the audit needs all four headings; red proven by stashing the two tools back to the reviewed code (test-evaluate-workbench and test-guardrail-audit fail), green with the fix. Full AGENTS suite on committed candidate b9c2228b: 48 of 48 commands pass (four-way parallel run; a stale Taskboard render caused an earlier run's failures and was re-rendered). Scores unchanged: guardrail audit 78/100, template evaluation 106.6/113, four-part template copy 106.6/113. | none: tools and tests only | none for this Task | 30f4f3b202bd55d2e15cd9c9856f885c2aaa6eb57dc2510944109410d6ef9a9b |
| 3 | claude/s004h-tk005r-evaluator | 4b9ef52ba51d1d9fad1a2bc38413dcd7e8094595 | ahead 1 behind 0 | 0 | Review round 2 (separate context, bdf59d0c) found the audit still accepted bare or empty four-part pages and the evaluator counted a sub-heading as section text. Fixed at 4b9ef52b with one shared definition (isFourPartBlueprint in tools/evaluate-workbench.mjs: all four headings, each with a non-heading text line) used by both the evaluator variants and the audit; red proven against the reviewed tools (test-evaluate-workbench and test-guardrail-audit fail), green with the fix. Full AGENTS suite on committed candidate 4b9ef52b: 48 of 48 commands pass. Scores unchanged: guardrail audit 78/100 and template evaluation 106.6/113 before and after; the quoted four-part candidate page passes the shared definition. | none: tools and tests only | none for this Task | cac1d20660121ecd7dae2b77f3803655ebff67d62b866f9ad7350ada813e3fe6 |
| 4 | claude/s004h-tk005r-evaluator | c46e71802914f082de3fe2123a11b6c2897004fe | ahead 1 behind 0 | 0 | Review round 3 (separate context, 7b5242cd) found an emptied last part could borrow the Contract's text from the concatenated haystack. Fixed at c46e7180: the four-part variants require the Blueprint itself to be well formed (isFourPartBlueprint on BLUEPRINT.md alone), and a page that declares the four-part shape cannot earn credit from the older section patterns (legacyShape variants). Red proven against the reviewed tool (test-evaluate-workbench fails: an emptied part must lose every Blueprint-owned check), green with the fix; mixed and emptied-with-legacy-sections cases added. Full AGENTS suite on committed candidate c46e7180: 48 of 48 commands pass. Scores unchanged: guardrail audit 78/100 and template evaluation 106.6/113. | none: tools and tests only | none for this Task | c17eb82b27252d0b862c50430cfe68719cb176c5fd18a2532abf7f98f5afb6ca |
| 5 | claude/s004h-tk005r-evaluator | f92cceec997a0600cff649dcb614495b94edb7b9 | ahead 1 behind 0 | 0 | Review round 4 (separate context, b803502b) found the audit still treated a malformed four-part page as destination-shaped when a legacy Product Destination heading was appended. Fixed at f92ccee: a page declaring the four-part shape is judged only as that page in the audit as in the evaluator; red proven against the reviewed audit (test-guardrail-audit fails), green with the fix. Full AGENTS suite on committed candidate f92cceec: 48 of 48 commands pass. Scores unchanged: guardrail audit 78/100 and template evaluation 106.6/113 before and after; the reviewer confirmed eight-part fixtures score exactly as on integration. | none: tools and tests only | none for this Task | a1fcb5bc103b700ada83afa043c61e54cf16f0ef3a26c51e69c1bb89e16982fa |
| 6 | claude/s004h-tk005r-evaluator | f8925818cb4412fa2390d3d42b75df46dce08edf | ahead 1 behind 0 | 0 | Review round 5 (separate context, c405d624) found an emptied Promised outcomes or Non-goals part could borrow a same-named legacy section appended later, because heading matching ignored case. Fixed at f8925818: isFourPartBlueprint now matches the four exact headings (case included), each once and in order, each with a non-heading text line; red proven against the reviewed tool (test-evaluate-workbench fails), green with the fix; reorder, duplicate, recase, extra-section and legacy-borrow cases added to both tests. Full AGENTS suite on committed candidate f8925818: 48 of 48 commands pass. Scores unchanged: guardrail audit 78/100 and template evaluation 106.6/113. | none: tools and tests only | none for this Task | 2b7d6157dc5930f9146005e332335cd0d569e7b7331874c2879b61442c108e34 |
| 7 | claude/s004h-tk005r-evaluator | 007c28054fd4049b4a8f12fa58a4548a69d691e6 | ahead 1 behind 0 | 0 | Review round 6 (separate context, f68ae678) found headings inside a fenced code block were accepted as the four-part sections. Fixed at 007c2805: isFourPartBlueprint ignores headings inside fenced code (backtick or tilde) and HTML comments, a comment is not text, a fenced block under a real heading is text, and CRLF pages still pass; red proven against the reviewed tool (test-evaluate-workbench fails), green with the fix; evaluator and audit tests extended. Full AGENTS suite on committed candidate 007c2805: 48 of 48 commands pass. Scores unchanged: guardrail audit 78/100 and template evaluation 106.6/113. | none: tools and tests only | none for this Task | 2d32084c9af950955c01e44d56a2e697acbd5259d87e16151f198e2814327af1 |
| 8 | claude/s004h-tk005r-evaluator | cfad0cbb7e78ddbc3c60856f2124a6cef7db2596 | ahead 1 behind 0 | 0 | Review round 7 (separate context, c41f052b) found a four-backtick or four-tilde fence was not honored (the parser closed any fence on a shorter triple fence). Fixed at cfad0cbb: fences follow the CommonMark rule (open on three or more backticks or tildes, close only on the same character at least as long, an unclosed fence runs to the end of the page); red proven against the reviewed tool (test-evaluate-workbench fails), green with the fix; nested, longer-closer, unclosed and properly-closed-then-parts cases added, plus the audit case. Full AGENTS suite on committed candidate cfad0cbb: 48 of 48 commands pass. Scores unchanged: guardrail audit 78/100 and template evaluation 106.6/113. | none: tools and tests only | none for this Task | bfd127cb7157f8f834b004242dee5132804a9595f05cbec097084ef291114d6d |

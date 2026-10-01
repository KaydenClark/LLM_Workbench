# TK-004P - P1: Reject malformed replacement and unsupported dry-run modes before dispatch - exact6aa public empty replacement plus retirement dry-run and ordinary retirement dry-run both write despite the no-write request.

**Task ID:** TK-004P
**Spec ID:** S-003P
**Slice:** P1: Reject malformed replacement and unsupported dry-run modes before dispatch - exact6aa public empty replacement plus retirement dry-run and ordinary retirement dry-run both write despite the no-write request.
**Status:** done
**Blockers:** none
**Destination:** spec-acceptance: S-003P Acceptance Criteria
**Planned verification:** Answers evidence row 19 (fail verdict at 6aa92668f77dcbe3c56d169701d7fb44d5174898 on 2026-10-01): P1: Reject malformed replacement and unsupported dry-run modes before dispatch - exact6aa public empty replacement plus retirement dry-run and ordinary retirement dry-run both write despite the no-write request.
**Proof:** Public red72130 expected failure and green combined2d99ebc1 34/34. Unsupported CLI/API dry-run modes refuse without file or Git metadata mutation; ordinary retirement, documented collision dry-run/apply and guarded rollback pass. Full assembled candidate review remains separate.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | codex/github-binding-corrections | 2d99ebc1eecac3eb1cf7cd34a48f7c8bf48a0c5e | ahead 0 behind 0 | 0 | Red72130a07 public empty replacement plus retirement dry-run returns0 and fails expected refusal. Green97d6bbdc and combined integration2d99ebc1 public34/34 PASS: both misuse modes and render dry-run refuse with all Git metadata/files unchanged, exported API refuses, ordinary retirement and valid collision still work. Full exact assembled suite pending. | Root/template RUNBOOK dry-run mode bounds clarified. Existing done records and collision provenance unchanged. | Final exact assembled full suite, receipt-backed installed verification and independent Task-PR integration review/containment remain. Full Spec and owner gates open. | d0f38b8952522d40d31c95d0ab1d49295b32559ca63affcd3370c0caa597ef0d |
| 2 | codex/github-binding-corrections | 7c728070d4afe1323e854fdf3060af613c5828a6 | ahead 0 behind 0 | 0 | Public red72130 expected failure and green combined2d99ebc1 34/34. Unsupported CLI/API dry-run modes refuse without file or Git metadata mutation; ordinary retirement, documented collision dry-run/apply and guarded rollback pass. Full assembled candidate review remains separate. | Root/template RUNBOOK mode bounds clarified; done I/K and original receipt/evidence history preserved. | Final full suite, installed runtime checks and independent Task-PR review/containment pending. Full Spec acceptance and owner QA/main gates remain open. | 6222a7c4919bf14eed35bc18097d472eb8ded178d17390ebbda0340febb8e759 |

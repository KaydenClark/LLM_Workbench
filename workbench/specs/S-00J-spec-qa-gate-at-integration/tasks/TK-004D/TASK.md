# TK-004D - Public report and verdict accept a PASS for changed working-tree Spec content whose named immutable candidate lacks that content

**Task ID:** TK-004D
**Spec ID:** S-00J
**Slice:** Public report and verdict accept a PASS for changed working-tree Spec content whose named immutable candidate lacks that content
**Status:** done
**Blockers:** none
**Destination:** spec-acceptance: S-00J Acceptance Criteria
**Planned verification:** Answers evidence row 32 (fail verdict at 3b5b76bfd62aa98118cb73cc4947e0658f4040c6 on 2026-10-01): Public report and verdict accept a PASS for changed working-tree Spec content whose named immutable candidate lacks that content
**Proof:** Candidate-content public CLI red/green; report checks pass; lifecycle39/39 exit0. Original50/51 failed fixture preserved and corrected; final51 and independent review pending.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | codex/s00j-verdict-committed-content | c263354e004a9bb7940a07f0b9a70b4a5e4d76ff | ahead 4 behind 0 | 2 | Public candidate binding regression red exit1 then green; report suite all checks pass; spec-workbench39/39 exit0 after fixture correction. First required run50/51; failing old fixture corrected and failure log retained. | S00J dated current-state correction and informational report field documentation. | Final exact-candidate51 suite and independent review/containment pending; TK004E verification remaining. | 80ae1434913638a9561c44782658a3bc3a0ab585e5fea1df060b84a2626de064 |
| 2 | codex/s00j-verdict-committed-content | 5e064b8a3dff00a33e7ba6e604ff8583a1381091 | ahead 0 behind 0 | 0 | Candidate-content public CLI red/green; report checks pass; lifecycle39/39 exit0. Original50/51 failed fixture preserved and corrected; final51 and independent review pending. | S00J dated correction and report field descriptions. | TK004E final verification, independent exact-head review and integration containment remain. | 769b1dddfc96444edfffd34f70858a0f7681376b46db31e84a69da6fea9fdfa0 |

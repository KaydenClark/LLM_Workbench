# TK-004O - Atomic corrective Task batch creation and supported retry after injected write failure

**Task ID:** TK-004O
**Spec ID:** S-00J
**Slice:** Atomic corrective Task batch creation and supported retry after injected write failure
**Status:** done
**Blockers:** none
**Destination:** spec-acceptance: S-00J Acceptance Criteria
**Planned verification:** Reproduce second Task write failure through public verdict and narrow corrective creation. Preserve original published evidence and unrelated bytes, remove only failed operation new artifacts, retry creates exact complete batch. Include owner finding and discarded Wiki corrective batch callers; no close/gate/identity changes.
**Proof:** Currentbase source17029e39 full51/51PASS and10publicfaultgroups. EightIOcasesrestoreexactbytes/retrycompletebatch; twointerferencecontrols preserveunexpectedbytes+anchor and reportincompleterecovery. Originalred andfailedrunsretained, finalindependentreviewpending.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | codex/s00j-corrective-batch-recovery | 17029e39b233f4325b3962676baee1ec6fa07b90 | ahead 19 behind 0 | 0 | First committedsource01389e4f required51PASS. Currentunion17029e39 required51 and10faultgroups checked with preserved red/failedruns. Eight synchronous writefailures rollback exactbytes including no-final-newline and retry fullbatch. Twointerference paths preserve unexpectedbytes+anchor and reportexplicitincompleterecovery. | Owned spec-report bounded correctivebatch writers, requiredreportregressions and S00J scoped recoverydocumentation. No root/template/bundle change. | Independent finalcurrentunion review andintegrationcontainment pending. Asyncmidbatch processdeath remains an explicit limit; ownerQA/main unapproved. | b5efaee8f1d9d0a0aff42ced3b69a858f8f08b20472cb1a462e7a0e3affa7bf0 |
| 2 | codex/s00j-corrective-batch-recovery | a65324954d549da17a1c953aa1e168d5153106dd | ahead 0 behind 0 | 0 | Currentbase source17029e39 full51/51PASS and10publicfaultgroups. EightIOcasesrestoreexactbytes/retrycompletebatch; twointerferencecontrols preserveunexpectedbytes+anchor and reportincompleterecovery. Originalred andfailedrunsretained, finalindependentreviewpending. | Owned correctivebatch implementation, required publicreport regressions and dated S00J recoverycontract; root/template no change needed for private IO fix. | Final immutable independent review and integration containment pending. Async midbatch process termination remains outside synchronous rollback guarantee; owner Human QA/main unapproved. | d3fcda3c8ad2ce81ae8ad7cbc87a7e6c3cb667990f8e4ab8b1691aaad2055262 |

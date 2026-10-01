# TK-004R synchronous recovery verification

Source candidate: f767cb746ef6fc6c26f0f1b8e4446d8d6489827e, assembled with integration 25d3f4d23b3719693065336a4ba66349d0a95907. All 51 required AGENTS/RUNBOOK commands passed; exact commands/exits are in tk004r-source-suite.json.

Independent FAIL at original TK-004O candidate 2e9b8c7caa30032fc17e0ae44881822914116b63 is preserved. Red f86e365931f91d680f7644cb9189800e52f71ffc reproduces first-Task foreign content, same-bytes inode replacement and nested foreign-file interference. Green 69b1e5bb0fc89de4d3046abd676b97dc2465aa68 snapshots published file bytes and identity and validates the entire owned file set before deleting any file. Modified or replaced files preserve partial state and the durable FAIL anchor with an explicit incomplete rollback error.

All 13 public fault groups pass: eight synchronous write failures restore exact original Spec bytes and permit complete retry; five interference controls preserve foreign bytes and anchors. This is producer proof, not independent review. Process death midbatch and universal concurrent filesystem transactions remain outside the bounded synchronous guarantee. Whole-Spec acceptance, owner Human QA, main approval and Factory remain open.

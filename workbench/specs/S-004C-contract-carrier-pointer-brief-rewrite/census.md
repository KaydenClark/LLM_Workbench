# S-004C Baseline And Dependency Census

**Task:** TK-005B (Record the pre-rewrite baseline and the dependency census)
**Pinned tree:** `origin/integration` at `d7ffffe9f44c96f2e43b1465b99ccb721942c4f8`
(`git rev-parse d7ffffe9`). Every figure, line number and classification below
reads at that tree unless a row says otherwise. Nothing here changed a carrier:
the census was measured with `git show d7ffffe9:<path>` and `git grep ... d7ffffe9`,
and the scores and receipts were re-run in a clean detached checkout of that
commit.

This is a record for the family Tasks and the after-record Task; it is evidence,
not instruction. It retires with the Spec.

## 1. Carrier sizes and loaded cost

Command: `git show d7ffffe9:<file> | wc -c` and `| wc -l`; tokens are bytes
divided by four (the ratio the accepted decision used), rounded.

| File | Bytes | Lines | ~Tokens |
|---|---:|---:|---:|
| `AGENTS.md` | 38,178 | 656 | 9,545 |
| `RUNBOOK.md` | 151,684 | 2,585 | 37,921 |
| `LEXICON.md` | 97,899 | 360 | 24,475 |
| `CLAUDE.md` | 733 | 16 | 183 |
| `templates/AGENTS.md` | 32,749 | 553 | 8,187 |
| `templates/RUNBOOK.md` | 86,307 | 1,586 | 21,577 |
| `templates/LEXICON.md` | 71,515 | 320 | 17,879 |
| `templates/CLAUDE.md` | absent | - | - |

- `templates/` ships no `CLAUDE.md`; a generated room's `CLAUDE.md` is the
  11-byte line `@AGENTS.md` (section 6). `templates/wiki/AGENTS.md` (51 lines,
  1,733 bytes) is the Wiki lane's agent page, not a carrier mirror; readers that
  name it (`wikiContractFiles` in `tools/control-fidelity.mjs` and
  `workbench/tools/workbench-layout.mjs`, and `tools/test-wiki.mjs`) are not
  carrier readers.
- Always-loaded cost per turn today: in this repository Claude Code loads
  `CLAUDE.md` plus the imported `AGENTS.md`, 38,911 bytes (~9,728 tokens); in a
  generated room it is the 11-byte bridge plus the room's `AGENTS.md`.
- Growth since the Spec's pre anchor `226212f1`: `AGENTS.md` 36,213 -> 38,178
  bytes (623 -> 656 lines), `RUNBOOK.md` 145,375 -> 151,684 (2,493 -> 2,585),
  `LEXICON.md` 65,515 -> 97,899 (294 -> 360), `templates/AGENTS.md` 30,834 ->
  32,749, `templates/RUNBOOK.md` 81,651 -> 86,307, `templates/LEXICON.md`
  42,597 -> 71,515; 30 commits touched these six files between the two trees
  (`git log --oneline 226212f1..d7ffffe9 -- <six files> | wc -l`).
- The Plan decision's bound for the index (index plus `AGENTS.md` loaded cost
  held below today's `AGENTS.md` alone) measures against **38,178 bytes, ~9,545
  tokens**. The census finds no reason to revise it.
- `RUNBOOK.md` heading counts: 15 at level 2, 42 at level 3 (the Spec's pre
  anchor said 41), 4 at level 4. `templates/RUNBOOK.md`: 18, 20 and 4.

Section sizes below come from a read-only helper (it parses headings outside code fences; a section runs
to the next heading of the same or higher level; "own" excludes subsections).
The helper is reproduced in the appendix. Without it,
`git show d7ffffe9:RUNBOOK.md | grep -n -E '^#{1,4} '` lists the same headings
plus one shell comment inside a `bash` fence (line 2341), which is not a heading.

## 2. Section sizes by heading

Task column: the family Task the section maps to (section 3). "In templates" is exact heading presence in `templates/RUNBOOK.md`.

### Root `AGENTS.md` sections

| L | Line | Heading | Bytes (with subsections) | Own bytes | Lines | ~Tokens own | Task |
|---|---:|---|---:|---:|---:|---:|---|
| 1 | 1 | LLM Workbench - Agent Operating System | 38178 | 431 | 656 | 108 | TK-005D (preamble) |
| 2 | 9 | Authority Order | 2869 | 20 | 52 | 5 | TK-005E |
| 3 | 11 | Instruction Authority | 1417 | 1417 | 26 | 354 | TK-005E |
| 3 | 37 | State Resolution | 1432 | 1432 | 24 | 358 | TK-005E |
| 2 | 61 | Traverse, Don't Search | 1100 | 1100 | 18 | 275 | TK-005D |
| 2 | 79 | Assigned Work And Stances | 3789 | 2438 | 62 | 610 | TK-005L |
| 3 | 117 | Handoff assignments and shared context | 1351 | 1351 | 24 | 338 | TK-005F |
| 2 | 141 | Read Scope | 239 | 239 | 6 | 60 | stays |
| 2 | 147 | Edit Scope | 2106 | 985 | 39 | 246 | stays |
| 3 | 167 | Workbench update drift boundary | 1121 | 1121 | 19 | 280 | TK-005K |
| 2 | 186 | Work Selection And Lifecycle | 8315 | 3793 | 134 | 948 | TK-005G |
| 3 | 250 | Assembled Review And Corrective Return | 1617 | 1617 | 25 | 404 | TK-005G |
| 3 | 275 | Owner Closure And Reconciliation | 2905 | 2905 | 45 | 726 | TK-005G |
| 2 | 320 | Engineering And Verification | 4219 | 3030 | 95 | 758 | TK-005I |
| 3 | 397 | Template Upgrade Release Gate | 1189 | 1189 | 18 | 297 | TK-005I |
| 2 | 415 | Documentation Ownership And Proof | 4368 | 4368 | 72 | 1092 | TK-005I |
| 2 | 487 | Safety And Change Control | 815 | 815 | 15 | 204 | stays |
| 2 | 502 | Git Rules | 4794 | 3717 | 76 | 929 | TK-005H |
| 3 | 559 | Branch Completion | 1077 | 1077 | 19 | 269 | TK-005H |
| 2 | 578 | Session Records And Checkpoints | 4111 | 4111 | 60 | 1028 | TK-005F |
| 2 | 638 | Long Session Control | 692 | 692 | 13 | 173 | TK-005F |
| 2 | 651 | Visual And Asset Work | 330 | 330 | 6 | 82 | stays |

### `templates/AGENTS.md` sections

| L | Line | Heading | Bytes (with subsections) | Own bytes | Lines | ~Tokens own | Task |
|---|---:|---|---:|---:|---:|---:|---|
| 1 | 1 | [PROJECT_NAME] - Agent Operating System | 32749 | 511 | 553 | 128 | TK-005D (preamble) |
| 2 | 11 | Authority Order | 2569 | 20 | 48 | 5 | TK-005E |
| 3 | 13 | Instruction Authority | 1216 | 1216 | 23 | 304 | TK-005E |
| 3 | 36 | State Resolution | 1333 | 1333 | 23 | 333 | TK-005E |
| 2 | 59 | Traverse, Don't Search | 1100 | 1100 | 18 | 275 | TK-005D |
| 2 | 77 | Assigned Work And Stances | 3789 | 2438 | 62 | 610 | TK-005L |
| 3 | 115 | Handoff assignments and shared context | 1351 | 1351 | 24 | 338 | TK-005F |
| 2 | 139 | Read Scope | 175 | 175 | 7 | 44 | stays |
| 2 | 146 | Edit Scope | 1368 | 1368 | 25 | 342 | stays |
| 2 | 171 | Work Selection And Lifecycle | 8361 | 3793 | 134 | 948 | TK-005G |
| 3 | 235 | Assembled Review And Corrective Return | 1617 | 1617 | 25 | 404 | TK-005G |
| 3 | 260 | Owner Closure And Reconciliation | 2951 | 2951 | 45 | 738 | TK-005G |
| 2 | 305 | Engineering And Verification | 798 | 798 | 20 | 200 | TK-005I |
| 2 | 325 | Documentation Ownership And Proof | 3742 | 3742 | 62 | 936 | TK-005I |
| 2 | 387 | Safety And Change Control | 330 | 330 | 8 | 82 | stays |
| 2 | 395 | Git Rules | 5208 | 3353 | 86 | 838 | TK-005H |
| 3 | 449 | Producer Template Upgrade Release Gate | 704 | 704 | 12 | 176 | TK-005I |
| 3 | 461 | Branch Completion | 1151 | 1151 | 20 | 288 | TK-005H |
| 2 | 481 | Session Records And Checkpoints | 4100 | 4100 | 60 | 1025 | TK-005F |
| 2 | 541 | Long Session Control | 418 | 418 | 8 | 104 | TK-005F |
| 2 | 549 | Visual And Asset Work | 280 | 280 | 5 | 70 | stays |

### Root `RUNBOOK.md` sections

| L | Line | Heading | Bytes (with subsections) | Own bytes | Lines | ~Tokens own | In templates | Task |
|---|---:|---|---:|---:|---:|---:|---|---|
| 1 | 1 | LLM Workbench - Runbook | 151684 | 330 | 2585 | 82 | no | TK-005D |
| 2 | 11 | Release Identity | 316 | 316 | 7 | 79 | no | TK-005K |
| 2 | 18 | Template Upgrade Release Gate | 2721 | 2721 | 42 | 680 | no | TK-005K |
| 2 | 60 | Ordinary Entry | 5947 | 959 | 98 | 240 | yes | TK-005D |
| 3 | 77 | Finding The Owner Of A Question | 1456 | 1456 | 23 | 364 | yes | TK-005D |
| 3 | 100 | GitHub Coordination Binding Inspection | 408 | 408 | 8 | 102 | no | TK-005K |
| 3 | 108 | Role And Stance Coordination | 1547 | 1547 | 26 | 387 | yes | TK-005L |
| 3 | 134 | Behavior Selection | 1577 | 1577 | 24 | 394 | yes | TK-005G |
| 2 | 158 | Prerequisites | 307 | 307 | 14 | 77 | yes | TK-005K |
| 2 | 172 | Install | 213 | 213 | 11 | 53 | yes | TK-005K |
| 2 | 183 | Run Locally | 287 | 287 | 12 | 72 | yes | TK-005K |
| 2 | 195 | Test And Build | 115325 | 2487 | 1916 | 622 | yes | TK-005I |
| 3 | 268 | Prepare project evidence and Blueprint questions | 1451 | 1451 | 27 | 363 | no | TK-005K |
| 3 | 295 | Derive a fresh room from recorded decisions | 2062 | 2062 | 35 | 516 | no | TK-005K |
| 3 | 330 | Skills lane check | 2794 | 2794 | 45 | 698 | no | TK-005K |
| 3 | 375 | Personal catalog publication | 3682 | 3682 | 62 | 920 | no | TK-005K |
| 3 | 437 | V3 support-root check | 7098 | 7098 | 115 | 1774 | no | TK-005K |
| 3 | 552 | Managed runtime tools check | 7161 | 7161 | 110 | 1790 | no | TK-005K |
| 3 | 662 | Room lifecycle classification check | 4120 | 4120 | 61 | 1030 | no | TK-005K |
| 3 | 723 | V3 Adoption migration check | 3037 | 3037 | 55 | 759 | no | TK-005K |
| 3 | 778 | Control fidelity report | 1586 | 1586 | 28 | 396 | no | TK-005K |
| 3 | 806 | V3 explicit upgrade and recovery check | 1885 | 1885 | 44 | 471 | no; generic equivalent T "Upgrading The Harness" | TK-005K |
| 3 | 850 | Workbench self-drift check | 2311 | 2311 | 39 | 578 | no; generic mention in T "Upgrading The Harness" | TK-005K |
| 3 | 889 | Spec Lifecycle And Retrieval | 20414 | 576 | 357 | 144 | yes | TK-005G |
| 4 | 899 | Worker: selection, implementation and hand-back | 5915 | 5915 | 108 | 1479 | yes | TK-005G |
| 4 | 1007 | Dispatcher and separate Director: assembled review | 3464 | 3464 | 64 | 866 | yes | TK-005G |
| 4 | 1071 | Owner: Human QA and main-before-complete | 2337 | 2337 | 45 | 584 | yes | TK-005G |
| 4 | 1116 | Documentation: feature capture, retirement and recovery | 8122 | 8122 | 130 | 2030 | yes | TK-005G |
| 3 | 1246 | Architecture Decision Records | 7905 | 7905 | 120 | 1976 | no; generic equivalent in T "Workbench Lifecycle, Diagnostics, And Decision Records" | TK-005J |
| 3 | 1366 | Composed round trip | 898 | 898 | 20 | 224 | no | TK-005K |
| 3 | 1386 | Portability and privacy matrix | 1576 | 1576 | 21 | 394 | no | TK-005K |
| 3 | 1407 | Cross-provider resume proof | 1926 | 1926 | 31 | 482 | no | TK-005K |
| 3 | 1438 | Visible Identifiers | 4595 | 4595 | 73 | 1149 | yes | TK-005J |
| 3 | 1511 | Landmark Tracker: accepted design and available operations | 1978 | 1978 | 30 | 494 | yes | TK-005J |
| 3 | 1541 | JSON Notepads | 9642 | 9642 | 149 | 2410 | yes | TK-005F |
| 3 | 1690 | Handoff Transfer | 3708 | 3708 | 55 | 927 | yes | TK-005F |
| 3 | 1745 | Optional Private Session Transport | 5279 | 5279 | 83 | 1320 | yes | TK-005F |
| 3 | 1828 | Portable Save, Promote And Room-Local Skills | 2451 | 2451 | 38 | 613 | yes | TK-005F |
| 3 | 1866 | Direct Owner Promotion | 2306 | 2306 | 39 | 576 | yes | TK-005F |
| 3 | 1905 | Frozen Checkpoint History And Operational Recovery | 1324 | 1324 | 26 | 331 | no; generic equivalent T "Frozen History And Operational Recovery" | TK-005F |
| 3 | 1931 | Wiki Validation | 3099 | 3099 | 53 | 775 | no | TK-005J |
| 3 | 1984 | Installed State The Harness Wrote | 2131 | 2131 | 36 | 533 | no | TK-005J |
| 3 | 2020 | Diagnostics And Blocking Effects | 4556 | 4556 | 58 | 1139 | no; generic equivalent in T "Workbench Lifecycle, Diagnostics, And Decision Records" | TK-005J |
| 3 | 2078 | Socket Contract Registry | 1317 | 1317 | 23 | 329 | no | TK-005J |
| 3 | 2101 | Test Coverage Policy | 546 | 546 | 10 | 136 | yes | TK-005I |
| 2 | 2111 | Evaluation And Benchmarking | 8267 | 136 | 184 | 34 | yes | TK-005K |
| 3 | 2116 | Guardrail North-Star Audit | 912 | 912 | 22 | 228 | no; generic equivalent T "Benchmark-Driven Improvement" | TK-005I |
| 3 | 2138 | Claims To Test | 256 | 256 | 8 | 64 | yes | TK-005K |
| 3 | 2146 | Evaluation Design | 454 | 454 | 12 | 114 | yes | TK-005K |
| 3 | 2158 | Commands | 1652 | 1652 | 43 | 413 | no; generic equivalent T "Workbench Evaluation Commands" | TK-005K |
| 3 | 2201 | Harness Feedback Loop | 1063 | 1063 | 19 | 266 | yes | TK-005K |
| 3 | 2220 | Automated Feedback Gate | 2087 | 2087 | 35 | 522 | no | TK-005K |
| 3 | 2255 | Automation Run Outcomes | 1707 | 1707 | 40 | 427 | no | TK-005K |
| 2 | 2295 | Version-Control Procedures | 4890 | 4890 | 98 | 1222 | yes | TK-005H |
| 2 | 2393 | Manual Harness Feedback Reports | 1666 | 1666 | 25 | 416 | yes | TK-005K |
| 2 | 2418 | Troubleshooting | 2240 | 2240 | 12 | 560 | yes | TK-005J |
| 2 | 2430 | Recovery And Rollback | 785 | 785 | 18 | 196 | yes | TK-005J |
| 2 | 2448 | Operational Proof | 164 | 164 | 5 | 41 | yes | TK-005K |
| 2 | 2453 | Evidence And Continuation Practices | 6618 | 3510 | 109 | 878 | yes | TK-005F |
| 3 | 2509 | Workbench connection identity | 1455 | 1455 | 28 | 364 | yes | TK-005J |
| 3 | 2537 | Configured-host capability checks | 1653 | 1653 | 25 | 413 | yes | TK-005J |
| 2 | 2562 | Independent Review Boundaries | 1608 | 1608 | 24 | 402 | yes | TK-005H |

### `templates/RUNBOOK.md` sections

| L | Line | Heading | Bytes (with subsections) | Own bytes | Lines | ~Tokens own | In root | Task |
|---|---:|---|---:|---:|---:|---:|---|---|
| 1 | 1 | [PROJECT_NAME] - Runbook | 86307 | 412 | 1586 | 103 | no | TK-005D |
| 2 | 14 | Ordinary Entry | 5293 | 959 | 86 | 240 | yes | TK-005D |
| 3 | 31 | Finding The Owner Of A Question | 1456 | 1456 | 23 | 364 | yes | TK-005D |
| 3 | 54 | Role And Stance Coordination | 1301 | 1301 | 22 | 325 | yes | TK-005L |
| 3 | 76 | Behavior Selection | 1577 | 1577 | 24 | 394 | yes | TK-005G |
| 2 | 100 | Prerequisites | 202 | 202 | 16 | 50 | yes | TK-005J |
| 2 | 116 | Environment Configuration | 468 | 468 | 21 | 117 | no | TK-005J |
| 2 | 137 | Install | 90 | 90 | 10 | 22 | yes | TK-005J |
| 2 | 147 | Run Locally | 162 | 162 | 14 | 40 | yes | TK-005J |
| 2 | 161 | Test And Build | 1291 | 295 | 43 | 74 | yes | TK-005I |
| 3 | 183 | Test Coverage Policy | 996 | 996 | 21 | 249 | yes | TK-005I |
| 2 | 204 | Workbench Lifecycle, Diagnostics, And Decision Records | 52720 | 6769 | 868 | 1692 | no | TK-005J |
| 3 | 309 | Spec Lifecycle And Retrieval | 18891 | 682 | 335 | 170 | yes | TK-005G |
| 4 | 321 | Worker: selection, implementation and hand-back | 5952 | 5952 | 108 | 1488 | yes | TK-005G |
| 4 | 429 | Dispatcher and separate Director: assembled review | 3377 | 3377 | 64 | 844 | yes | TK-005G |
| 4 | 493 | Owner: Human QA and main-before-complete | 2418 | 2418 | 45 | 604 | yes | TK-005G |
| 4 | 538 | Documentation: feature capture, retirement and recovery | 6462 | 6462 | 106 | 1616 | yes | TK-005G |
| 3 | 644 | Visible Identifiers | 4379 | 4379 | 69 | 1095 | yes | TK-005J |
| 3 | 713 | Landmark Tracker: accepted design and available operations | 1978 | 1978 | 30 | 494 | yes | TK-005J |
| 3 | 743 | JSON Notepads | 9966 | 9966 | 156 | 2492 | yes | TK-005F |
| 3 | 899 | Frozen History And Operational Recovery | 577 | 577 | 10 | 144 | no | TK-005F |
| 3 | 909 | Optional Private Session Transport | 5279 | 5279 | 83 | 1320 | yes | TK-005F |
| 3 | 992 | Portable Save, Promote And Room-Local Skills | 2575 | 2575 | 41 | 644 | yes | TK-005F |
| 3 | 1033 | Direct Owner Promotion | 2306 | 2306 | 39 | 576 | yes | TK-005F |
| 2 | 1072 | Evaluation And Benchmarking | 6823 | 147 | 134 | 37 | yes | TK-005K |
| 3 | 1077 | Handoff Transfer | 3708 | 3708 | 55 | 927 | yes | TK-005F |
| 3 | 1132 | Benchmark-Driven Improvement | 673 | 673 | 13 | 168 | no | TK-005I |
| 3 | 1145 | Claims To Test | 279 | 279 | 9 | 70 | yes | TK-005K |
| 3 | 1154 | Evaluation Design | 946 | 946 | 24 | 236 | yes | TK-005K |
| 3 | 1178 | Workbench Evaluation Commands | 571 | 571 | 19 | 143 | no | TK-005K |
| 3 | 1197 | Harness Feedback Loop | 499 | 499 | 9 | 125 | yes | TK-005K |
| 2 | 1206 | Data Operations | 409 | 409 | 29 | 102 | no | TK-005J |
| 2 | 1235 | Deployment Or Startup | 344 | 344 | 27 | 86 | no | TK-005J |
| 2 | 1262 | Version-Control Procedures | 2087 | 2087 | 54 | 522 | yes | TK-005H |
| 2 | 1316 | Upgrading The Harness | 5540 | 5540 | 92 | 1385 | no | TK-005M |
| 2 | 1408 | Manual Harness Feedback Reports | 1666 | 1666 | 25 | 416 | yes | TK-005K |
| 2 | 1433 | Troubleshooting | 132 | 132 | 6 | 33 | yes | TK-005J |
| 2 | 1439 | Recovery And Rollback | 402 | 402 | 12 | 100 | yes | TK-005J |
| 2 | 1451 | Operational Proof | 164 | 164 | 5 | 41 | yes | TK-005K |
| 2 | 1456 | Evidence And Continuation Practices | 6491 | 3383 | 107 | 846 | yes | TK-005F |
| 3 | 1510 | Workbench connection identity | 1455 | 1455 | 28 | 364 | yes | TK-005J |
| 3 | 1538 | Configured-host capability checks | 1653 | 1653 | 25 | 413 | yes | TK-005J |
| 2 | 1563 | Independent Review Boundaries | 1611 | 1611 | 24 | 403 | yes | TK-005H |

## 3. Section map: confirmed and corrected

Each `AGENTS.md` and `RUNBOOK.md` heading in the tables above maps to exactly
one family Task (`stays` marks the boundary lines the Spec keeps in the brief;
no family Task moves them). Against the Spec's "Starting section map at the pre
anchor" the census **confirms** every named assignment and **corrects or adds**
these, each read at `d7ffffe9`:

1. `AGENTS.md` "Handoff assignments and shared context" (level 3 under Assigned
   Work And Stances, added after the pre anchor; six files link its anchor) is
   not in the map. Assigned to TK-005F (handoff and notepad continuity), since
   the Runbook's Handoff Transfer lands there too; its role-authority sentences
   are TK-005L's to classify if they move.
2. `RUNBOOK.md` Handoff Transfer is not in the map's continuity list or in
   TK-005F's Scope list. Assigned to TK-005F.
3. `RUNBOOK.md` GitHub Coordination Binding Inspection (level 3 under Ordinary
   Entry, root only) is a maintainer operation, not entry text. Assigned to
   TK-005K; TK-005D keeps only its index row.
4. `RUNBOOK.md` Template Upgrade Release Gate (level 2, root only), Prepare
   project evidence and Blueprint questions, Derive a fresh room from recorded
   decisions, Personal catalog publication, Managed runtime tools check,
   Automated Feedback Gate, Automation Run Outcomes, Claims To Test, Evaluation
   Design and Commands are not named in the map; all are maintainer operations
   per TK-005K's Outcome and are assigned there. The `AGENTS.md` release-gate
   subsection stays with TK-005I, which classifies it as restating the Runbook
   owner.
5. `RUNBOOK.md` Install and Run Locally are not in the map; with Prerequisites
   they are assigned to TK-005K for the root text, but see the audience split:
   the template carries all three as room sections.
6. The Spec map lists "the guardrail audit" under verification: confirmed as
   TK-005I for Guardrail North-Star Audit and Test Coverage Policy, while the
   rest of Evaluation And Benchmarking is TK-005K.
7. Heading nesting does not follow topic. Root Test And Build (level 2,
   115,325 bytes, 76% of the Runbook) contains 29 of the 42 level-3 sections
   and all four level-4 ones, among them the notepad, transport, promotion,
   lifecycle, decision-record, diagnostics and maintainer checks; its own text
   (2,487 bytes) is the suite list. In `templates/RUNBOOK.md`, Handoff
   Transfer sits under Evaluation And Benchmarking. Moving a level-3 section
   does not move its level-2 parent.
8. `templates/AGENTS.md` places "Producer Template Upgrade Release Gate" under
   Git Rules, not under Engineering And Verification, and has no "Workbench
   update drift boundary" and no Full suite block (its Engineering section is
   798 bytes).

### Audience split (presence in `templates/RUNBOOK.md`)

Exact-heading presence is the column "In templates" above. The split the
room-operations and maintainer-operations Tasks rely on, corrected:

- **Root sections the template also carries by heading:** Ordinary Entry and
  Finding The Owner Of A Question, Role And Stance Coordination, Behavior
  Selection, Prerequisites, Install, Run Locally, Test And Build, Spec Lifecycle
  And Retrieval with its four level-4 sections, Visible Identifiers, Landmark
  Tracker, JSON Notepads, Handoff Transfer, Optional Private Session Transport,
  Portable Save, Direct Owner Promotion, Test Coverage Policy, Evaluation And
  Benchmarking, Claims To Test, Evaluation Design, Harness Feedback Loop,
  Version-Control Procedures, Manual Harness Feedback Reports, Troubleshooting,
  Recovery And Rollback, Operational Proof, Evidence And Continuation Practices,
  Workbench connection identity, Configured-host capability checks and
  Independent Review Boundaries.
- **Root-only by heading but with a generic template equivalent:** Architecture
  Decision Records, Diagnostics And Blocking Effects and (the room-brain finding
  of) Wiki Validation are carried generically inside the template's level-2
  "Workbench Lifecycle, Diagnostics, And Decision Records"; Frozen Checkpoint
  History maps to the template's "Frozen History And Operational Recovery";
  Guardrail North-Star Audit to "Benchmark-Driven Improvement"; Commands to
  "Workbench Evaluation Commands"; V3 explicit upgrade and the self-drift check
  to "Upgrading The Harness".
- **Root-only with no template counterpart (maintainer-only):** Release
  Identity, Template Upgrade Release Gate, GitHub Coordination Binding
  Inspection, Prepare project evidence, Derive a fresh room, Skills lane check,
  Personal catalog publication, V3 support-root check, Managed runtime tools
  check, Room lifecycle classification check, V3 Adoption migration check,
  Control fidelity report, Composed round trip, Portability and privacy matrix,
  Cross-provider resume proof, Installed State The Harness Wrote (one generic
  mention only), Socket Contract Registry (one mention inside Visible
  Identifiers), Automated Feedback Gate and Automation Run Outcomes.
- **Template-only:** Environment Configuration, Data Operations and Deployment
  Or Startup are a room's own product sections (placeholders a room fills),
  not Workbench operations; assigned to TK-005J, which decides whether they stay
  as room-filled sections.

Two corrections to the Task records follow. TK-005J's Outcome says its sections
"are the sections the generic `templates/RUNBOOK.md` also carries": only Visible
Identifiers, Landmark Tracker, Troubleshooting, Recovery And Rollback, Workbench
connection identity and Configured-host capability checks are carried by
heading; Architecture Decision Records, Wiki Validation and Diagnostics And
Blocking Effects are root-only headings whose generic text lives in the
template's lifecycle, diagnostics and decision-records section, and Installed
State and Socket Contract Registry have only a passing mention in the template. TK-005K's Outcome lists "prerequisites, install and
run" and evaluation, feedback and operational proof as maintainer-only, but the
template carries Prerequisites, Install, Run Locally, Evaluation And
Benchmarking, Claims To Test, Evaluation Design, Harness Feedback Loop, Manual
Harness Feedback Reports and Operational Proof as generic room sections, so
TK-005K's "template changes only where the census shows a generic mirror" applies
to all of those.

## 4. Guardrail baseline and self-drift pre receipt

Run read-only by the Dispatcher at `d7ffffe9` and re-run by the TK-005B Worker
in a clean detached checkout of `d7ffffe9` (`git status --porcelain` empty);
both runs agree apart from the checkout path printed in the report header.

| Check | Command | Result at `d7ffffe9` |
|---|---|---|
| Static evaluator, templates candidate | `node tools/evaluate-workbench.mjs --path templates --include-controls` | **106.6/113**; every area full except Team coordination 1.6/8 (manager instructions, subagent instructions, team taskboard, non-overlapping lanes). Controls: no-template 0/113, single-instruction-file 2/113. |
| Guardrail North-Star Audit | `node tools/audit-guardrails.mjs --path .` | **78/100** (developing): static contract 20/20, drift resistance 25/25, benchmark discipline 25/25, outcome evidence 8/30 (no non-synthetic repeated outcome results). |
| Workbench self-drift pre receipt | `node workbench/tools/self-drift.mjs --phase pre --json` (exit 1) | `sourceRevision` `d7ffffe9f44c96f2e43b1465b99ccb721942c4f8`, `dirty` false, `workbenchVersion` v3.2.1, `machineResult` blocked, `cleanUpdate` **false**, 8 findings, all attention: `stale-claim` (S-00Q in-progress since 2026-09-19); five `stale-seed` (`workbench/feedback/REPORT_FORMAT.md` and the four `workbench/sessions/notepads/templates/` files seeded from v3.1.4); `unverified-provenance` (manifest `provenance.source.release` v3.1.0 against v3.2.1; source identity role `historical-adoption`); `detached-head` (the inspection checkout itself). The Dispatcher's and the Worker's finding sets are identical (code, artifact, severity). |
| Doctor | `node workbench/tools/spec-workbench.mjs doctor` | exit 0; the same 8 attention findings; no blocking finding. |
| Projection | `node workbench/tools/spec-workbench.mjs render` then `git status --porcelain` | no change: the Taskboard projection is current. |

**Bounded manual semantic check** (Runbook "Workbench self-drift check",
steps 1-4; read-only, no correction made):

1. Pinned: source `d7ffffe9`, manifest `workbenchVersion` v3.2.1, declared
   `git.integrationBranch` `integration` (`git.defaultBranch` `main`); inspected
   from a clean detached checkout, so `detached-head` is the inspection state.
2. Inventoried: the self-drift inventory lists 557 artifacts (root carriers and
   projections, manifest, Specs and `CATALOG.md`, ADR register, Wiki router,
   templates, managed tools and receipts, seeded documents).
3. Reconciled the current-facing claims this Spec touches against their
   sources. Two are stale at `d7ffffe9`: (a) TK-005G's blocker
   `owner:agents-corrective-sections-landed` names a condition already met:
   Corrective Work Rules (S-004F) Task TK-005T, "State the corrective rules in
   the AGENTS corrective sections, the template mirror and the to-tasks skill",
   is `done`, and `AGENTS.md` carries those rules (the control-fidelity test
   that asserts them passes); (b) this Spec's Dependencies section and TK-005G's Scope
   still name "the Corrective-Work Spec" without its identifier,
   which TK-005G says replaces the token's name once that Spec is on
   integration. The Spec's Current Verified State ("TK-004Y and TK-004Z ... are
   not" merged) is scoped "At the pre anchor" and is bounded history, not drift.
4. Recorded, smallest owning corrections (for the Dispatcher, not made here):
   remove TK-005G's satisfied token and name S-004F in the two places above; the
   S-00Q stale claim belongs to its owner's reclaim check; the stale seeds and
   provenance are release work and are classified historical by the tool.

## 5. Reader census

Search (fixed names, binary-safe, at the pinned tree):

```bash
git grep -l -a -E 'AGENTS\.md|RUNBOOK\.md|LEXICON\.md|CLAUDE\.md' d7ffffe9 -- workbench/tools tools evals
git grep -l -a -E 'AGENTS\.md|RUNBOOK\.md|LEXICON\.md|CLAUDE\.md' d7ffffe9 -- '*.mjs' '*.js' '*.py' ':!tools' ':!workbench/tools' ':!evals'
git grep -n -a -E "Full suite|full suite" d7ffffe9 -- tools workbench/tools evals
```

57 files name a carrier or `CLAUDE.md`: 12 under `workbench/tools/`, 37 under
`tools/` (7 tools, 30 tests) and 8 under `evals/`. Naming `AGENTS.md` or
`RUNBOOK.md` alone: 56 (36, 12, 8); the Spec's pre-anchor count of 55 differs
by `tools/test-blueprint-contract.mjs`, which began reading `AGENTS.md` after
the pre anchor. Two code files outside those directories name a carrier
(`outcomes/mock-agents/condition-aware-agent.mjs`,
`workbench/specs/S-01R-reviewer-skill-rebuild/proof/scenario.mjs`), both
names-only. No tracked script extracts the Full suite block; the one extractor
is the Dispatcher's untracked read-only suite runner (`suite.sh`), listed last.
No CI workflow, `package.json` or tracked shell script reads a carrier.

Classes: **names** - names the file only (fixture writer, file list, comment,
whole-file read or diff that does not depend on its shape); **heading** - reads
or slices by a heading; **content** - asserts carrier text, extracts or executes
a block, or sweeps every line; **anchor** - resolves `#` links into a carrier.
Line numbers are the reader's own, at `d7ffffe9`.

### Content-dependent readers and the Tasks that must change them

| Reader | Class | Depends on (carrier text at `d7ffffe9`) | Task(s) |
|---|---|---|---|
| `workbench/tools/wiki.mjs` (`roomBrainRouting`, :50-58) | content | `AGENTS.md` must contain the wiki lane path; `room-brain-unrouted` otherwise. The only root mention is the Documentation Ownership table row (`AGENTS.md` line 435; template line 352). | TK-005I (keep a `workbench/wiki/` route in the brief) |
| `workbench/tools/workbench-layout.mjs` (`validateGenesisControl`, :1120-1138) | content | Genesis gate: each control filled, no placeholder, an `# ` and a `## ` heading, the `Generated from LLM Workbench vX` stamp; `CLAUDE.md` exactly `@AGENTS.md`. | TK-005M; every Task keeps the stamp |
| `workbench/tools/sessions.mjs` (:70-71) | content | Promotion refuses to make `CLAUDE.md` anything but the `@AGENTS.md` adapter. | TK-005M only if the adapter changes |
| `tools/evaluate-workbench.mjs` (:49-201) | heading + content | Keyword and heading patterns over the templates candidate. `AGENTS.md`: Authority Order (TK-005E); Read Scope, Edit Scope, secrets, Safety And Change Control, privacy, destructive, paid services, escalation `product tradeoffs`/`code-level`, visual-asset phrases (stays); Documentation Ownership And Proof, `assigned.*spec`, `architectural decisions`, `^## Engineering And Verification$`, red/green, `failing test`, impractical/specific reason, `targeted test`, `full verification suite`, `Final response`/`proof`, `demo artifact`, `milestone`, docs-part-of-done, `documentation owner`, routing table, `Docs checked; no update needed`, `explicit error handling` (TK-005I); Long Session Control, `` rerun `doctor`, `next`, and ``, `context summary`, `single durable` (TK-005F). `RUNBOOK.md`: Prerequisites, Environment Configuration, Install, Run Locally, Troubleshooting, Recovery And Rollback (TK-005J), Test And Build, `Full verification`, Test Coverage Policy (TK-005I). | TK-005E, TK-005F, TK-005I, TK-005J |
| `tools/audit-guardrails.mjs` (:162-200, :304-325) | content | Benchmark-discipline regexes over root and template `AGENTS.md` + `RUNBOOK.md` (capture the baseline before a change; before/after score; static is not outcome); `RUNBOOK.md` `**Last reviewed:**` and `**Blueprint reviewed:**` header stamps; `Generated from LLM Workbench v[HARNESS_VERSION]` in template `AGENTS.md` and `RUNBOOK.md`. | TK-005I (baseline rule), TK-005D (Runbook header) |
| `tools/genesis-from-decisions.mjs` (:192-193) | content | `CLAUDE.md` must be exactly `@AGENTS.md`. | TK-005M only if the adapter changes |
| `tools/test-control-fidelity.mjs` | heading + content | Instruction Authority text between `### Instruction Authority` and `### State Resolution`, root and template, with mutations (TK-005E). `## Work Selection And Lifecycle` section rules, corrective-return and completion-claim phrases, headings `### Assembled Review And Corrective Return` and `### Owner Closure And Reconciliation` (TK-005G). `## Git Rules` section rules (TK-005H). Runbook `### Spec Lifecycle And Retrieval` up to `### Architecture Decision Records`, the `#### Worker: selection, implementation and hand-back` close procedure, template Runbook verdict/closure/receipt strings (TK-005G). Blocking-effect table rows in Diagnostics And Blocking Effects (TK-005J). Runbook `control-fidelity.mjs report --project` command (TK-005K) and `node tools/test-control-fidelity.mjs` in both the Runbook and the `AGENTS.md` suite block (TK-005I). Edit Scope folder-lifecycle sentence (stays). Lexicon rows: feedback dispositions, decision-record vocabulary, Workbench terms and the "controls" sweep, workflow verbs, AI Coding Terms (TK-005N). Every `spec-workbench.mjs <verb>` named in `AGENTS.md` must exist. | TK-005E, TK-005G, TK-005H, TK-005I, TK-005J, TK-005K, TK-005N |
| `tools/test-genesis-from-decisions.mjs` (:79-90, :209-210, :309-315, :325-334) | heading + content | Builds a room from the template carrier bodies; asserts its Instruction Authority between the two headings (TK-005E); follows the Runbook's `convert-tasks S-001` line when present (TK-005G); sweeps the derived carriers for the retired term; `CLAUDE.md` pin (TK-005M). | TK-005E, TK-005G, TK-005M |
| `tools/test-governance-core.mjs` | heading + content | Root and template `## Authority Order`, `### Instruction Authority`, `### State Resolution`, `implementation gap`, `documentation drift`, `cannot enlarge`, `` `doctor` fails on `all` and `selection` `` (TK-005E); `### Branch Completion` and its phrases, the manifest integration-branch line, the template slice from `## Git Rules` to `## Session Records And Checkpoints` (TK-005H, heading order with TK-005F); `removing unmerged branches or results` (stays); Runbook `gh pr merge`, `git branch -d`, `git push origin --delete` and the closeout block from "Closeout, once the integration review has passed" to `## Manual Harness Feedback Reports` (TK-005H, end marker TK-005K); template closeout to `## Upgrading The Harness` (TK-005H, TK-005M); template Runbook `adr.mjs`, `doctor`, `attention`, `integration-branch-missing` (TK-005J); Lexicon Governance Core terms (TK-005N); every ADR `canonicalized_in` must be `AGENTS.md`, `BLUEPRINT.md`, `LEXICON.md`, `RUNBOOK.md` or a Spec (see finding 4). | TK-005E, TK-005F, TK-005H, TK-005J, TK-005K, TK-005M, TK-005N |
| `tools/test-branch-closeout.mjs` (:13-15) | content | Extracts and **executes** the first `bash` block after "Closeout, once the integration review has passed" (`RUNBOOK.md` line 2310, Version-Control Procedures). | TK-005H |
| `tools/test-workbench-round-trip.mjs` (:19-33) | heading + content | Extracts and **executes** the command recipes between `### Spec Lifecycle And Retrieval` and `### Architecture Decision Records` (root) or `### Visible Identifiers` (`--guidance templates/RUNBOOK.md`). | TK-005G (end markers TK-005J) |
| `tools/test-task-id-collision.mjs` (:52-57) | content | **Executes** the Runbook's `move-task ... --replacement` dry-run example (`RUNBOOK.md` line 1160, Documentation: feature capture, retirement and recovery). | TK-005G |
| `tools/test-blueprint-contract.mjs` (:209, :221-222) | content | `AGENTS.md` "A role defines the assigned scope of responsibility ... A stance defines the job within that scope" (TK-005L); `Reconcile surviving claims` and `retire-spec S-###` (TK-005G). | TK-005G, TK-005L |
| `tools/test-adr.mjs` (:863-1000) | content + anchor | `AGENTS.md` `Dispatcher owns whole-Spec QA ... separate Director context reviews` and `` verification on main -> `complete` `` (TK-005G); Lexicon rows and Context Map routes (TK-005N); every heading fragment linked from the Lexicon and accepted records must be a literal heading in the target carrier (all Tasks; headings survive). | TK-005G, TK-005N, all |
| `tools/test-skill-catalog.mjs` (:90-118, :148-155, :881-882) | content | `RUNBOOK.md` "the 26 core skills" (Skills lane check, line 337); every `--version vX.Y.Z` literal in `RUNBOOK.md` equals the manifest (lines 462, 741, 827, 842); `RUNBOOK.md` `--layout-only` (V3 explicit upgrade) (TK-005K). Lexicon bundle sentence, `--layout-only`, design-concept definition (TK-005N). | TK-005K, TK-005N |
| `tools/test-portability-matrix.mjs` (:26-36) | content | Retired-path sweep over the root carriers, `templates/` and root `skills/`, allowing `workbench/grilling` and `workbench/handoffs` only in the `RUNBOOK.md` lines "becomes `workbench/sessions/grilling`" and "checkpoints become" (lines 481-482, V3 support-root check). | TK-005K |
| `tools/test-skills-lane.mjs` (:153, :176-200) | content | Every skill named in a root carrier, `CLAUDE.md` or a lane skill must ship in the lane or carry a disposition row in `workbench/skills/README.md`. Each new index pointer is checked here. | TK-005D, TK-005E, every family adding a pointer |
| `tools/test-evaluate-workbench.mjs` (:109-128, :198-207) | heading + content | Template `AGENTS.md` `^## Safety And Change Control$` (stays), `Documentation Ownership And Proof`, `^## Engineering And Verification$` and privacy/verification terms (TK-005I). | TK-005I |
| `tools/test-workbench-layout.mjs` (:145-146) | content | Template `AGENTS.md` names `workbench/specs/` (its only mention is the preamble, line 8). | TK-005D |
| `tools/test-controls-vocabulary-sweep.mjs` (:22-27, :71) | content | Line sweep of the root carriers, `CLAUDE.md`, `skills/`, `templates/` for the retired term; the Lexicon exemption row is matched by exact text. | all (sweep); TK-005N (exemption rows) |
| `tools/test-workbench-tools.mjs` (:402-412) | content | No root carrier, template or lane skill names a root `tools/` path for a runtime tool; moved procedures land in skills this sweep reads. | all |
| `tools/test-wiki.mjs` (:252-253) | content | Root and template Lexicon route design questions to `workbench/wiki/design-concepts/`. | TK-005N |
| `evals/README.md` (:4) | heading (prose) | Points readers to `../RUNBOOK.md` "-> Evaluation And Benchmarking" by heading name. | TK-005K |
| `suite.sh` (Dispatcher's untracked runner) | content | `awk` slice from the line starting `Full suite for controls` to the end of the next `bash` fence in `AGENTS.md`; `SUITE_SOURCE` overrides the file. | TK-005I |

### Names-only readers (no change needed for shape)

| Reader | What it does with the name |
|---|---|
| `workbench/tools/adr.mjs` | Default `canonicalized_in: AGENTS.md` in a new record (:559); scans all carriers whole for record references (:690, :842). |
| `workbench/tools/spec-workbench.mjs` | Scans all carriers whole for Spec and Task links when records move (:2050); comments cite AGENTS headings (:621, :913, :3248, :3738). |
| `workbench/tools/self-drift.mjs` | Inventories and hashes the carriers (:12, :78). |
| `workbench/tools/task-packet.mjs` | Puts the whole `AGENTS.md` into a Task packet as its Contract member (:162-166); see finding 5. |
| `workbench/tools/template-placeholders.mjs` | Lists the templated files. |
| `workbench/tools/claim-coordination.mjs`, `diagnostics.mjs`, `notepads.mjs`, `task-receipt.mjs` | Comments or a usage string naming the file. |
| `tools/control-fidelity.mjs` | Line-by-line diff of a room's carriers against the templates, shape-agnostic; the `CLAUDE.md` exact-equality check (:15, :280, :293-295) is the host-adapter check in section 7. TK-005M touches it only to label a generation difference. |
| `tools/cross-provider-resume.mjs`, `tools/run-outcome-trials.mjs`, `tools/workbench-classify.mjs` | Fixture carriers, the `@AGENTS.md` bridge writer, a comment. |
| Tests with fixture carriers only: `test-core-composition`, `test-diagnostics`, `test-direct-promotion`, `test-feedback-automation`, `test-guardrail-audit`, `test-landmark-wiki`, `test-lifecycle-directory-links`, `test-self-drift`, `test-sessions`, `test-spec-workbench`, `test-visible-id-consumers`, `test-workbench-adoption` (copies template bytes), `test-workbench-upgrade` | Write their own carrier files in a temporary room; none reads the shipped carrier's shape. |
| `tools/test-spec-citation-anchors.mjs` | Resolves Spec citations into carriers at each Spec's anchored commit, so a rewrite does not move them. |
| `evals/conditions/conditions.json`, `evals/run.py`, `evals/conditions/c1_generic_CLAUDE.md`, `evals/tasks/task_a_scope_honesty/grade.py`, `evals/tasks/task_b_path_safety/{prompt.md,task.json,test_grade.py}` | Copy whole carriers from a ref into a trial repo and write `CLAUDE.md` as `@<entry>`; prose; the path-safety task's own fixture `RUNBOOK.md`. |
| `outcomes/mock-agents/condition-aware-agent.mjs`, `workbench/specs/S-01R-reviewer-skill-rebuild/proof/scenario.mjs` | Existence check; fixture. |

## 6. Inbound anchor links

Command (all tracked files; resolution against GitHub-style slugs of the
headings outside code fences, a link inside `templates/` resolving against the
template mirror):

```bash
git grep -n -a -o -E '(AGENTS|RUNBOOK)\.md#[A-Za-z0-9_-]+' d7ffffe9
```

114 links in **49 files**: 48 Markdown and 1 JSON
(`workbench/specs/S-00A-blueprint-active-adr-and-context-map/blueprint-claim-disposition.json`);
no test or code file carries one. By location: 28 under `workbench/wiki/`, 10
under `workbench/specs/` (4 of them this Spec's own records), 4 under
`workbench/docs/`, 2 under `workbench/feedback/`, and `AGENTS.md`, `RUNBOOK.md`,
`LEXICON.md`, `README.md`, `templates/AGENTS.md`, `templates/RUNBOOK.md`,
`templates/LEXICON.md` once each. 31 distinct anchors (13 into `AGENTS.md`, 18
into `RUNBOOK.md`); **every one resolves at `d7ffffe9`**. The Spec's pre-anchor
figures were 36 files, 11 and 17 anchors. (For reference, 21 files link a
`LEXICON.md#` anchor; TK-005N's concern.)

| Anchor | Files | Resolves in root | Heading also in template |
|---|---:|---|---|
| `AGENTS.md#git-rules` | 14 | yes | yes |
| `RUNBOOK.md#behavior-selection` | 11 | yes | yes |
| `RUNBOOK.md#role-and-stance-coordination` | 8 | yes | yes |
| `AGENTS.md#handoff-assignments-and-shared-context` | 6 | yes | yes (also linked from templates/) |
| `RUNBOOK.md#handoff-transfer` | 6 | yes | yes (also linked from templates/) |
| `RUNBOOK.md#spec-lifecycle-and-retrieval` | 5 | yes | yes (also linked from templates/) |
| `AGENTS.md#assigned-work-and-stances` | 4 | yes | yes |
| `AGENTS.md#assembled-review-and-corrective-return` | 3 | yes | yes (also linked from templates/) |
| `AGENTS.md#authority-order` | 3 | yes | yes (also linked from templates/) |
| `RUNBOOK.md#template-upgrade-release-gate` | 3 | yes | no |
| `AGENTS.md#owner-closure-and-reconciliation` | 2 | yes | yes |
| `AGENTS.md#safety-and-change-control` | 2 | yes | yes |
| `AGENTS.md#traverse-dont-search` | 2 | yes | yes |
| `RUNBOOK.md#direct-owner-promotion` | 2 | yes | yes |
| `AGENTS.md#branch-completion` | 1 | yes | yes |
| `AGENTS.md#documentation-ownership-and-proof` | 1 | yes | yes |
| `AGENTS.md#engineering-and-verification` | 1 | yes | yes |
| `AGENTS.md#session-records-and-checkpoints` | 1 | yes | yes |
| `AGENTS.md#state-resolution` | 1 | yes | yes |
| `RUNBOOK.md#control-fidelity-report` | 1 | yes | no |
| `RUNBOOK.md#frozen-checkpoint-history-and-operational-recovery` | 1 | yes | no |
| `RUNBOOK.md#independent-review-boundaries` | 1 | yes | yes |
| `RUNBOOK.md#json-notepads` | 1 | yes | yes |
| `RUNBOOK.md#landmark-tracker-accepted-design-and-available-operations` | 1 | yes | yes |
| `RUNBOOK.md#ordinary-entry` | 1 | yes | yes |
| `RUNBOOK.md#portable-save-promote-and-room-local-skills` | 1 | yes | yes |
| `RUNBOOK.md#prepare-project-evidence-and-blueprint-questions` | 1 | yes | no |
| `RUNBOOK.md#room-lifecycle-classification-check` | 1 | yes | no |
| `RUNBOOK.md#skills-lane-check` | 1 | yes | no |
| `RUNBOOK.md#v3-adoption-migration-check` | 1 | yes | no |
| `RUNBOOK.md#v3-support-root-check` | 1 | yes | no |

Root-only anchors (no template heading): `RUNBOOK.md#template-upgrade-release-gate`,
`#control-fidelity-report`, `#frozen-checkpoint-history-and-operational-recovery`,
`#prepare-project-evidence-and-blueprint-questions`,
`#room-lifecycle-classification-check`, `#skills-lane-check`,
`#v3-adoption-migration-check`, `#v3-support-root-check`; none is linked from
`templates/`. `tools/test-adr.mjs` is the one existing check that resolves
heading fragments (for the Lexicon and accepted decision records only); no
check yet covers the Wiki and Spec links above, which TK-005D's anchor check is
scoped to add.

## 7. Host-adapter facts

**`CLAUDE.md` is pinned to `@AGENTS.md` in a generated room.** Where it is
checked or written at `d7ffffe9`:

| Location | Effect |
|---|---|
| `workbench/tools/workbench-layout.mjs` :1129-1130 | `validate --genesis` fails `unfilled-control` unless `CLAUDE.md` trims to exactly `@AGENTS.md`. |
| `tools/genesis-from-decisions.mjs` :192-193 | Refuses a derived room whose `CLAUDE.md` is not exactly `@AGENTS.md`. |
| `tools/control-fidelity.mjs` :15, :280, :293-295 | Reports `CLAUDE.md` as `exact` or `mismatch` against `@AGENTS.md`. |
| `workbench/tools/sessions.mjs` :70-71 | Promotion refuses to change `CLAUDE.md` away from the adapter. |
| Tests | `tools/test-control-fidelity.mjs` :174-182 (exact equality), `tools/test-workbench-layout.mjs` :601 (an added line is refused), plus fixture bridges in `test-genesis-from-decisions`, `test-wiki`, `test-workbench-adoption`, `test-workbench-round-trip`. |
| Prose | `README.md` :157-159, `templates/README.md` :62-66, `templates/GENESIS.md` :387, `RUNBOOK.md` :530 and :792, `workbench/skills/update-harness/SKILL.md` :149. |

`templates/` ships no `CLAUDE.md` (`tools/test-workbench-layout.mjs` :2050
records that a plain copy leaves it out). This repository's own `CLAUDE.md` is
not pinned: it imports `@AGENTS.md` and adds Claude-specific notes, which
`tools/test-control-fidelity.mjs` :282 records as the dogfood room's deliberate
divergence.

**Which hosts load `AGENTS.md` natively.** Only what the repository evidences:

| Host | Evidence at `d7ffffe9` | Status |
|---|---|---|
| Claude Code | Loads `CLAUDE.md`, and `AGENTS.md` only through the `@AGENTS.md` import: `evals/run.py` :75-77 ("Claude Code reads CLAUDE.md; import the harness entry file so it loads"), `README.md` :157-158, `templates/README.md` :62-63. | loads through the import; native loading of `AGENTS.md` not evidenced |
| Codex | `benchmarks/README.md` :49 cites the external OpenAI Codex AGENTS.md guide; no repository test exercises Codex loading the file natively. `tools/cross-provider-resume.mjs` :120 tells the resuming agent to "read AGENTS.md" explicitly. | cited, unverified here |
| Cursor | `benchmarks/README.md` :51 cites the external Cursor Rules docs for "AGENTS.md compatibility". | cited, unverified here |
| Any other host | `templates/README.md` :65-66: "Other agents should be pointed at `AGENTS.md` as their entry point." | unknown |

No portable mechanism in the repository makes a host load a second file
(`RUNBOOK.md`) automatically; the configured-host checks (`tools/configured-host.mjs`,
`workbench/specs/S-053-configured-host-capabilities/local-host-result.json`)
probe lanes and runner capability, not instruction loading.

## 8. Findings for the Dispatcher

Reported, not acted on; none cuts a Task here.

1. **The static score reads only `templates/`.** `tools/evaluate-workbench.mjs
   --path templates` scores keyword and heading patterns in the template
   carriers (section 5). A procedure moved into a lane skill leaves the scored
   tree, so every family Task that moves a scored phrase must keep it in the
   brief or index line that points to the skill, or the 106.6/113 baseline
   drops. Extending the evaluator to follow pointers would change a criterion
   and needs its own decision.
2. **Three tests execute Runbook text.** `test-branch-closeout` (closeout
   block), `test-workbench-round-trip` (Spec Lifecycle recipes) and
   `test-task-id-collision` (the `move-task` example) run the documented
   commands; TK-005G and TK-005H must re-point them to the moved procedure's
   home, not just update strings. Their slice markers (`### Architecture
   Decision Records`, `### Visible Identifiers`, `## Manual Harness Feedback
   Reports`, `## Upgrading The Harness`, `## Session Records And Checkpoints`)
   tie TK-005G and TK-005H to heading order owned by TK-005F, TK-005J, TK-005K
   and TK-005M.
3. **TK-005G's sequencing token looks satisfied** (section 4, step 3): S-004F
   Task TK-005T is done at `d7ffffe9` and the rules are in `AGENTS.md`.
4. **ADR `canonicalized_in` is limited to the four carriers or a Spec**
   (`tools/test-governance-core.mjs` :70). If a pointed skill becomes the
   operational owner of a decision's rule, that test refuses naming it; TK-005E
   (authority through the pointer) is where this surfaces.
5. **The Task packet carries only `AGENTS.md` as its Contract member**
   (`workbench/tools/task-packet.mjs` :162-166). Once the index is read at
   every entry and pointed skills bind, the packet does not carry them; TK-005D
   or TK-005E may need to decide whether that matters.
6. **`room-brain-unrouted` depends on one `AGENTS.md` line** (the
   Documentation Ownership row naming `workbench/wiki/`); TK-005I must keep a
   wiki route in the brief, root and template.
7. **Spec map and Task-record corrections** are listed in section 3 (the
   handoff subsection and Handoff Transfer to TK-005F; GitHub Coordination
   Binding Inspection to TK-005K; the TK-005J and TK-005K audience statements).

## Appendix: reproducing the census

```bash
P=d7ffffe9f44c96f2e43b1465b99ccb721942c4f8
git rev-parse d7ffffe9                       # the pin
for f in AGENTS.md RUNBOOK.md LEXICON.md CLAUDE.md templates/AGENTS.md templates/RUNBOOK.md templates/LEXICON.md; do
  printf '%s %s %s\n' "$f" "$(git show "$P:$f" | wc -c)" "$(git show "$P:$f" | wc -l)"; done
git show "$P:RUNBOOK.md" | grep -n -E '^#{1,4} '   # headings; drop line 2341, a shell comment inside a bash fence
git grep -l -a -E 'AGENTS\.md|RUNBOOK\.md|LEXICON\.md|CLAUDE\.md' "$P" -- workbench/tools tools evals
git grep -n -a -o -E '(AGENTS|RUNBOOK)\.md#[A-Za-z0-9_-]+' "$P"
git grep -n -a -F '@AGENTS.md' "$P"
git worktree add --detach /tmp/census-d7ff "$P" && cd /tmp/census-d7ff
node workbench/tools/self-drift.mjs --phase pre --json
node workbench/tools/spec-workbench.mjs doctor
node tools/evaluate-workbench.mjs --path templates --include-controls
node tools/audit-guardrails.mjs --path .
```

Run the `git` lines from bash (in zsh, quote `"$P:path"` or write `${P}:path`;
an unquoted `$P:t...` is read as a history modifier). The section tables used
this slugging and sizing rule, shown as the helper that produced them:

```js
// node census-sections.mjs <sha> <file>: level, line, bytes (with subsections), lines, heading, slug
import { execFileSync } from 'node:child_process';
const [sha, file] = process.argv.slice(2);
const text = execFileSync('git', ['show', `${sha}:${file}`], { encoding: 'utf8', maxBuffer: 1 << 28 });
const lines = text.split('\n'); const heads = []; let fence = null; let offset = 0;
lines.forEach((line, i) => {
  const f = line.match(/^\s*(`{3,}|~{3,})/);
  if (f) { if (!fence) fence = f[1]; else if (f[1][0] === fence[0] && f[1].length >= fence.length && /^\s*[`~]+\s*$/.test(line)) fence = null; }
  else if (!fence) { const h = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/); if (h) heads.push({ level: h[1].length, text: h[2], line: i + 1, offset }); }
  offset += Buffer.byteLength(line, 'utf8') + 1;
});
const total = Buffer.byteLength(text, 'utf8'); const seen = new Map();
heads.forEach((h, i) => {
  const end = heads.slice(i + 1).find((n) => n.level <= h.level);
  const base = h.text.toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s/g, '-');
  const n = seen.get(base) ?? 0; seen.set(base, n + 1);
  console.log([h.level, h.line, (end ? end.offset : total) - h.offset, (end ? end.line : lines.length) - h.line, h.text, n ? `${base}-${n}` : base].join('\t'));
});
```

"Own bytes" is a row's bytes minus the bytes of its direct subsections. The
audience split compares heading text exactly between `RUNBOOK.md` and
`templates/RUNBOOK.md`; the "generic equivalent" notes come from reading the
template sections named.

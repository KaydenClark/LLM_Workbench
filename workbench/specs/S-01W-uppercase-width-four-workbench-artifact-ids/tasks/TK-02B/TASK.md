# TK-02B - Allocate new Spec and Task IDs as uppercase width-four

**Task ID:** TK-02B
**Spec ID:** S-01W
**Slice:** Allocate new Spec and Task IDs as uppercase width-four
**Status:** done
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: S-01W Desired Behavior 1 and 6 for the public Spec and Task allocation routes (`next-id --prefix S`, `next-id S-### --prefix TK` and the corrective-Task allocations that share its rule).
**Planned verification:** Red: disposable-room `next-id --prefix S` and `next-id S-### --prefix TK` return mixed-case width-three labels (for example `S-00A`), and a unit fixture with `S-00Q` occupied can return a lowercase or width-three label; green: both routes return only `0-9A-Z` suffixes of minimum width four (`S-000A`, `TK-000A` in an empty numeric room), `S-00Q` occupies `S-000Q`, duplicate aliases refuse, legacy record paths and bytes are unchanged, and the base62 Workbench connection-ID checks stay green.
**Proof:** Red at b35a65a plus the new tests: test-visible-ids.mjs could not import allocateArtifactId; test-visible-id-consumers.mjs 6 of 17 failed (next-id returned width-three labels where width four was asserted; the two duplicate-alias-record refusal cases were already green through the record loaders); test-spec-report.mjs and test-spec-workbench.mjs corrective-Task assertions failed on width-three IDs. Green at 1bdc1a8: test-visible-ids.mjs 9/9, test-visible-id-consumers.mjs 17/17, test-spec-workbench.mjs, test-spec-report.mjs, test-workbench-identity.mjs (base62 connection IDs), test-adr.mjs, test-notepads.mjs and test-spec-citation-anchors.mjs pass; full AGENTS suite 48 pass 0 fail on 1bdc1a8 with a clean tree. Guardrail 106.6/113 before and after; S-00K self-drift pre and post both report the same 7 attention findings and no new one.

## Outcome

New Spec and Task identities come from one shared artifact allocation policy:
uppercase `0-9A-Z` suffixes, minimum width four, letter-bearing, never
truncated or recycled, and collision-checked against every existing spelling
(`S-00Q` and `S-000Q` are one identity). Existing records keep their stored IDs.

## Authority And Source

Lane I (`claude-lane-I`) cut this Task under the owner's 2026-09-26 instruction
relayed by the Claude Director. Source: destination audit ledger row E-8 (owner
answer 2026-09-22, blocked-obligations-review decision-013): "New WBIDs are
uppercase width 4; ... the allocator treats S-00Q and S-000Q as the same". Read
source citations at the Spec's post anchor or with `git show <sha>:path`.

## Released Lane

Write lane: `workbench/tools/visible-ids.mjs`, `nextIdentity` in
`workbench/tools/spec-workbench.mjs`, the two corrective-Task `allocateVisibleId('TK', ...)`
calls in `workbench/tools/spec-report.mjs`, `tools/test-visible-ids.mjs`,
`tools/test-visible-id-consumers.mjs`, fixture expectations in
`tools/test-spec-workbench.mjs` / `tools/test-spec-report.mjs` that assert the
old width-three form, and
`workbench/docs/adr/0041-visible-base62-workbench-identifiers.md` (amend: the
owner settled uppercase `0-9A-Z` width four for artifacts; distinguish delivered
allocation from remaining dual-form lookup and touch work).

Keep the exported `BASE62_ALPHABET`, `encodeBase62` and Workbench connection
identity (`allocateWorkbenchId`, `isWorkbenchId`) unchanged. ADR and notepad
allocations are the later artifact-consumer slice; do not change them here
unless a shared default change forces it, in which case trace and preserve
their current output instead.

## Decisions

None.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s01w-tk02b-artifact-allocation | 1bdc1a8bbbcd355353d4bd9d3037a92ccb75b4e8 | ahead 0 behind 0 | 0 | Red at b35a65a plus the new tests: test-visible-ids.mjs could not import allocateArtifactId; test-visible-id-consumers.mjs 6 of 17 failed (next-id returned width-three labels where width four was asserted; the two duplicate-alias-record refusal cases were already green through the record loaders); test-spec-report.mjs and test-spec-workbench.mjs corrective-Task assertions failed on width-three IDs. Green at 1bdc1a8: test-visible-ids.mjs 9/9, test-visible-id-consumers.mjs 17/17, test-spec-workbench.mjs, test-spec-report.mjs, test-workbench-identity.mjs (base62 connection IDs), test-adr.mjs, test-notepads.mjs and test-spec-citation-anchors.mjs pass; full AGENTS suite 48 pass 0 fail on 1bdc1a8 with a clean tree. Guardrail 106.6/113 before and after; S-00K self-drift pre and post both report the same 7 attention findings and no new one. | ADR-0041 amended: owner decision E-8 settles uppercase 0-9A-Z width four for artifact labels, delivered allocation is separated from remaining dual-form lookup and widen-id touch work, and the connection-ID account is kept. RUNBOOK Visible identifiers (alphabet 0-9 A-Z a-z, minimum width three) and the LEXICON WBID base-62 wording are now stale for Spec and Task allocation: routed to S-00P, which owns those controls and their templates mirrors. | Dual-form public selection, the explicit widen-id touch verb with former-ID metadata, moving ADR and notepad allocation onto the artifact policy, and assembled capability QA remain later S-01W slices (unallocated). RUNBOOK and LEXICON wording routed to S-00P. Separate-context integration review not yet run. | c0c706cd708c9cab49e21dcf9c763fd42146fe113a6c2f18976d92dbf10b691d |

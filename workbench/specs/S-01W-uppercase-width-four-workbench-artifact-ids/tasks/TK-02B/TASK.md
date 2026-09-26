# TK-02B - Allocate new Spec and Task IDs as uppercase width-four

**Task ID:** TK-02B
**Spec ID:** S-01W
**Slice:** Allocate new Spec and Task IDs as uppercase width-four
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: S-01W Desired Behavior 1 and 6 for the public Spec and Task allocation routes (`next-id --prefix S`, `next-id S-### --prefix TK` and the corrective-Task allocations that share its rule).
**Planned verification:** Red: disposable-room `next-id --prefix S` and `next-id S-### --prefix TK` return mixed-case width-three labels (for example `S-00A`), and a unit fixture with `S-00Q` occupied can return a lowercase or width-three label; green: both routes return only `0-9A-Z` suffixes of minimum width four (`S-000A`, `TK-000A` in an empty numeric room), `S-00Q` occupies `S-000Q`, duplicate aliases refuse, legacy record paths and bytes are unchanged, and the base62 Workbench connection-ID checks stay green.

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

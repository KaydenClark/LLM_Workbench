# TK-008W - Genesis drafts the legibility block for a new room, marked for grilling

**Task ID:** TK-008W
**Spec ID:** S-004M
**Slice:** Genesis drafts the legibility block for a new room, marked for grilling
**Status:** ready
**Stance:** Builder
**Blockers:** TK-008V
**Destination:** spec-acceptance: Genesis drafts the block for a new room and adoption drafts it for an existing project, both marked for grilling confirmation.
**Planned verification:** Red then green in tools/test-genesis-from-decisions.mjs (the generated manifest carries six entries and confirmation pending; the readiness gate still passes and the generated room's doctor shows only attention findings for it); then the full suite, render and doctor on the committed candidate.

## Scope

Have `tools/genesis-from-decisions.mjs derive` write `draftLegibility` for the generated room (from the staged room and what the source project shows) into the manifest it already rewrites after init.

## Boundaries

No adoption change, no Runbook or AGENTS line.

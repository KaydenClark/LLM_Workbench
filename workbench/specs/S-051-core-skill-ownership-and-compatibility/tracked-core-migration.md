# Tracked core migration plan

This is a preparation plan, not authorization to change a personal repository.
S-051 tests use isolated provider homes. No external personal catalog has been
migrated or certified by these tests.

## Inventory before selecting a migration

Record the catalog's concrete Git root, origin, branch, HEAD, worktree and
index changes. Resolve both application discovery roots. For each name in the
release's core catalog, record its declared and resolved path, tracked status,
managed marker, content hash and link target. Inventory same-named personal
implementations separately; a marker alone does not establish that local edits
are disposable. Preserve optional personal skills and room-owned sources.

Before any removal from Git tracking, retain an owner-reviewed immutable
recovery commit or private backup that contains every affected file and link.
Record the intended destination of each modified implementation and who owns
it. Unknown ownership, uncommitted changes without recovery, broken links or
conflicting implementations remain unresolved until the owner chooses their
disposition. Never force-add managed core to make a setup check pass.

## Apply only under separate personal-repository authorization

Review a concrete change that removes selected core paths from tracking while
preserving their files, excludes the managed paths, and retains all personal
source under its chosen ownership. The release installer reserves tracked core
paths case-insensitively, including deleted ancestry, and refuses replacement.
Case-only alternatives require explicit reconciliation on every host, including
a case-sensitive host. The installer does not perform this migration. Inspect the proposed index diff before
committing any change to the personal repository.

Then explicitly update the global core from the verified release checkout.
Canonical physical content belongs under `.agents/skills`; Claude directory
adapters resolve to the same content. Keep the updater's complete recovery
record and original entries. Recreate missing adapters through presence-only
setup and verify both applications' discovery. Filesystem discovery is not
proof of native invocation; record configured-host invocation separately.

## Recovery and acceptance

The core rollback command verifies the complete destination set, current output
and backup hashes before restoration. It refuses newer installed changes.
Restore any personal repository tracking change through its independently
recorded Git recovery point; the core rollback does not rewrite Git history
or the index. Local privacy exclusions intentionally remain.

Accept the migration only after original personal bytes remain recoverable,
the personal Git diff matches the reviewed disposition, one canonical core
identity is visible through the intended adapters, and configured-host checks
pass. No Windows, cross-device transport, crash recovery or rollout-readiness
claim follows from an isolated filesystem fixture.

---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-authorized optional project deployment, 2026-10-09
source_paths:
  - tools/grill-board-deploy.mjs
  - tools/grill-board-project.mjs
  - tools/test-grill-board-deploy.mjs
  - workbench/specs/S-005H-optional-project-grill-board/SPEC.md
last_verified: 2026-10-09
---

# Optional project Grill Board

The optional component gives an adopted project its own framing and local
owner-answer storage while reusing the existing Grill Board page and protocol.
It does not import the producer's questions, install the broader Dashboard or
create a second question system. The [project deployment guide](../docs/project-grill-board.md)
owns installation, configuration and commands; the [optional project deployment
Spec (S-005H)](../specs/S-005H-optional-project-grill-board/SPEC.md) owns acceptance
and delivery evidence.

A pinned, clean source checkout supplies the adapter, original page and module
import closure. Their hashes and source identity travel with the installed
component, so another clone can execute without the producer checkout.
Initialization starts with no questions or answers. Existing deployments are
verified and preserved; collisions and modified managed files require explicit
resolution rather than an automatic overwrite.

Project topic membership follows item groups. Project identity also controls
repository links and browser batch/theme storage keys, preventing an unrelated
project from inheriting Workbench question numbering or a previous room's batch.
Named current documents and question drafts stay separate review material. The
component preserves the existing inert renderer and the ordinary named-source
read boundary rather than introducing a new artifact catalogue.

The owner writes answers only through the page. Agents keep stable question
identities, revise with reasons, and apply actual saved decisions after promoting
them to durable owners. Revisions invalidate older answers without editing their
words. Answers remain ignored and local, so a Git clone carries questions and
runtime but does not synchronize private owner responses.

This is a manual localhost service. It creates no PC access route, tunnel,
credentials or persistent service. It has no direct owner question editor or
automatic component updater. Installation does not establish owner approval,
in-game correctness or improved agent outcomes.

Templates stay unchanged: this standalone optional component has an explicit
installation command, separate configuration and private runtime. It adds no
standard adoption/template behavior or mandatory dependency for other rooms.

## History

- 2026-10-09: Added under the owner-authorized optional Board deployment to
  explain reuse, isolation and limitations; verification lives in the linked
  tests and delivery Spec.

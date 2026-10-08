# TK-007Y - The Dashboard stays available without a chat and the complete owner flow is demonstrated on a disposable copy

**Task ID:** TK-007Y
**Spec ID:** S-004D
**Slice:** The Dashboard stays available without a chat and the complete owner flow is demonstrated on a disposable copy
**Status:** ready
**Stance:** Builder
**Blockers:** TK-007T, TK-007X
**Destination:** spec-acceptance: After login, and after the server process is killed, the Dashboard is served at `http://127.0.0.1:4646/` without a chat starting it, and only on the local address. A disposable real-shape browser demonstration shows question → current document and proposed draft → Change → agent revision → Owner confirmation → explicit promotion handoff → visible disposition and source links, covering retries, repeated rounds and stale answers or approvals.
**Planned verification:** Red first in `tools/test-dashboard-service.mjs`: no read-only status command and no restart check exist. Green: the login-service configuration is local-only, escaped, absolute and restarting; `status` reports configuration and running state through injected runners; a disposable served copy keeps workflow state and answers across a killed and restarted server. Then the browser demonstration on a disposable copy of the real inventory, recorded with its exact candidate, and the Full Runbook suite on the committed candidate. Installing the service on the Owner's Mac is an Owner action outside this verification.

## Scope

- **Service** (`tools/dashboard-service.mjs`): `print`, a refusing `install`,
  a read-only `status`, and exact install, restart and removal instructions.
- **Demonstration:** the owner path above on a disposable copy with fixture
  answers only; no real Owner decision or promotion is executed.

### Out of scope

Installing the login service on the Owner's Mac, remote hosting and real Owner
participation, which stay Owner acts.

# TK-005 - Reconcile a closed Spec and its Tasks into durable owners and retire them

**Task ID:** TK-005
**Spec ID:** S-00I
**Slice:** Reconcile a closed Spec and its Tasks into durable owners and retire them
**Status:** blocked
**Blockers:** TK-004
**Destination:** spec-acceptance: S-00I Acceptance Criteria
**Planned verification:** Red: retiring a Spec whose surviving claims name no durable owner is refused, and a reconciliation that copies the Spec fails `wiki.mjs` copied-task-state validation; green: transformed Wiki capability record, Spec and Tasks in `retired`, contained branches cleaned up, `next` and `render` no longer see them, explicit historical route works

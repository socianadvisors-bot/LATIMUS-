---
name: durable-workflows
description: Implement LATIMUS's persistent browser work engine and safe external-action outbox.
---

# Scope

This skill applies only to **LATIMUS — Cross-Sector Executive Intelligence**.

Never import runtime code, data models, schemas, storage, authentication state, or application modules from **THE CONSULT FORWARD**. Any future interoperability must use an explicit versioned adapter boundary.

# Workflow

Implement stable jobs, dependencies, checkpoints, leases, retries, dead-letter handling, cancellation, `due_on_resume`, `awaiting_unlock`, `connection_unavailable`, outbox receipts, idempotency where supported, and reconciliation before retrying uncertain external actions.

# Completion rule

Do not report completion from prose alone. Record implementation paths, tests/evaluations, observed evidence, limitations, and remaining gaps in the repository harness/state files.

## In-place re-administration integration

Prospect jobs share the encrypted mutation/CAS foundation. Persist selected/completed row cursors, chunk local writes, group company requests and cancel capabilities immediately on abort. Retry unfinished/errors; do not cache zero-page failures. Remapping invalidates prior jobs/cursors. Open/unlocked execution is distinct from closed-browser durability.

---
name: local-data-security
description: Implement LATIMUS local structured storage, schema migrations, encrypted portable workspaces, backup/restore, and data boundaries.
---

# Scope

This skill applies only to **LATIMUS — Cross-Sector Executive Intelligence**.

Never import runtime code, data models, schemas, storage, authentication state, or application modules from **THE CONSULT FORWARD**. Any future interoperability must use an explicit versioned adapter boundary.

# Workflow

Use IndexedDB for structured/blob persistence in extension mode, explicit portable workspace save/load for standalone mode, versioned migrations, authenticated encryption with established Web Crypto primitives, auto-lock, integrity checks, quota/write failure handling, conflict preview, and cross-OS restore tests.

# Completion rule

Do not report completion from prose alone. Record implementation paths, tests/evaluations, observed evidence, limitations, and remaining gaps in the repository harness/state files.

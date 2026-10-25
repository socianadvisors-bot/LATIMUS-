---
name: security-privacy
description: Threat-model and secure LATIMUS browser runtime, imported data, messages, connectors, exports, and client/account boundaries.
---

# Scope

This skill applies only to **LATIMUS — Cross-Sector Executive Intelligence**.

Never import runtime code, data models, schemas, storage, authentication state, or application modules from **THE CONSULT FORWARD**. Any future interoperability must use an explicit versioned adapter boundary.

# Workflow

Use restrictive CSP, safe rendering, validated sender/action/payload scope, narrow permissions, secret redaction, untrusted-content handling, no arbitrary eval/fetch/native execution, scoped retrieval before model access, malicious-instruction tests, and encrypted recovery. No sensitive data in sync storage.

# Completion rule

Do not report completion from prose alone. Record implementation paths, tests/evaluations, observed evidence, limitations, and remaining gaps in the repository harness/state files.

## In-place re-administration integration

Validate exact extension sender, schema and batch/row capability; recheck current persisted job, settings and normalized clues. Keys are read only by the background through expiring file handles, never renderer inputs/exports/logs. Bound response streams before allocation; check A/AAAA public DNS, robots on actual redirect authority, source size/type and cookie-free HTTPS. DNS preflight is not IP pinning.

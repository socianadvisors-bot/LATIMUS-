---
name: repo-baseline
description: Inspect and re-baseline an existing LATIMUS/Executive AI repository before implementation.
---

# Scope

This skill applies only to **LATIMUS — Cross-Sector Executive Intelligence**.

Never import runtime code, data models, schemas, storage, authentication state, or application modules from **THE CONSULT FORWARD**. Any future interoperability must use an explicit versioned adapter boundary.

# Workflow

1. Read `AGENTS.md`, `GOALS.md`, `PLANS.md`, the active phase file, and `source-spec/LATIMUS_PRODUCT_DIRECTIVE.md`.
2. Inventory current code, storage, distributions, tests, docs, and user data.
3. Classify meaningful components as KEEP, REFACTOR, REBUILD, REMOVE, or NOT BUILT.
4. Preserve useful work and data; never restart solely because this harness is new.
5. Reconcile the legacy Executive AI identity into LATIMUS.
6. Update `harness/context/phase-00.md`, `harness/build-log.md`, `REQUIREMENTS_TRACEABILITY.md`, and `DECISIONS.md`.
7. Establish the next executable phase and its evidence gaps.

# Completion rule

Do not report completion from prose alone. Record implementation paths, tests/evaluations, observed evidence, limitations, and remaining gaps in the repository harness/state files.

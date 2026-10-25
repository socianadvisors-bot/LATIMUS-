# THE CONSULT — LATIMUS / FORWARD Separation Contract

This contract is binding on both Codex build repositories.

## Two products, two repositories

**LATIMUS — Cross-Sector Executive Intelligence** and **THE CONSULT FORWARD** are completely separate software systems.

Required repository roots:

- `latimus-cross-sector-executive-intelligence/`
- `the-consult-forward/`

The delivery ZIP may contain both packs for convenience. That does not authorize a monorepo.

## Never merge these systems

Do not create:
- one monorepo for both products;
- one shared application shell;
- one database for both products;
- shared migrations;
- shared authentication/session state;
- shared runtime state;
- shared job queues;
- shared local browser storage;
- shared product modules;
- one product importing runtime code from the other repository.

Each system must have its own:
- Git repository/history;
- dependencies and lockfile;
- `AGENTS.md`;
- `.agents/skills/`;
- build harness;
- tests and fixtures;
- configuration and secrets;
- persistence model;
- security model;
- build/release process;
- documentation;
- release artifacts.

## Product roles

### LATIMUS
THE CONSULT's local-first Executive Office operating infrastructure with embedded cross-sector market/opportunity intelligence, business development, CRM/outreach, executive/corporate operations, client-delivery coordination, PMO, sector execution, M&A coordination, owner/family-enterprise support, approvals, evidence, and workflow orchestration.

### FORWARD
THE CONSULT's separate multi-tenant enterprise financial/operational diagnostic and management platform: ingestion, accounting/financial truth, FP&A, cash, KPIs, diagnostics, risks/opportunities, sector analytics, M&A modeling, PMO/value realization, executive reporting, intelligence, and continuous management.

## Permitted future interoperability

Future interoperability is allowed only through an explicit, versioned boundary such as:
- approved file export/import;
- JSON/CSV/XLSX exchange;
- a documented connector;
- a future authenticated API.

Neither product may require the other to build, start, authenticate, store data, calculate results, or complete its definition of done.

# Phase 04-intelligence-fabric — Intelligence Fabric foundation

## Objective
Build native market/opportunity intelligence inside LATIMUS.

## Required skills
- `intelligence-sources`
- `market-intelligence`
- `signals-entities-evidence`
- `opportunity-poc`

## Before implementation
1. Read `AGENTS.md`, `GOALS.md`, `PLANS.md`, this phase file, and the relevant product directive sections.
2. Inspect live repository state and prior context/build-log entries.
3. Identify requirement IDs/sections and current implementation evidence.
4. Record unknowns; do not guess.
5. If subagents are useful, delegate only independent bounded workstreams. Do not let concurrent agents edit the same files.

## Required deliverables
- Source Registry
- Company/entity registry
- Market Segment model
- Evidence registry
- Signal library/fingerprints
- Tier A-D evidence
- EOS engine
- Outcome-owner mapping
- POC gate
- Intelligence workspace

## Engineering sequence
Use the smallest useful vertical slices. For each slice:
1. establish or update tests/fixtures;
2. implement underlying domain/data/security behavior;
3. expose through the correct boundary/UI;
4. run tests/build/lint/typecheck as applicable;
5. repair failures;
6. update traceability/context/build log;
7. review the diff and failure paths.

## Acceptance / exit gate
- At least one approved source/import completes source -> company -> signal -> evidence -> EOS -> outcome owner -> opportunity brief with tests and provenance.

## Evidence to record
- implementation paths;
- test/evaluation commands and observed results;
- migrations/schema versions where applicable;
- screenshots/export artifacts only when useful;
- limitations and blocked external dependencies;
- independent review findings and resolution.

Do not start the next phase until this gate is satisfied or the owner explicitly records an exception.

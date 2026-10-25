# Phase 06-delivery-loop — First complete client-delivery loop

## Objective
Prove LATIMUS can execute work after the sale.

## Required skills
- `finance-pmo`
- `reporting-artifacts`
- `verification-release`

## Before implementation
1. Read `AGENTS.md`, `GOALS.md`, `PLANS.md`, this phase file, and the relevant product directive sections.
2. Inspect live repository state and prior context/build-log entries.
3. Identify requirement IDs/sections and current implementation evidence.
4. Record unknowns; do not guess.
5. If subagents are useful, delegate only independent bounded workstreams. Do not let concurrent agents edit the same files.

## Required deliverables
- Client intake
- Source/file import
- Finance/cash analysis
- Executive report
- PMO action register
- Artifact review/export
- Value/result tracking

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
- A fixture engagement completes intake -> analysis -> report -> PMO -> reviewed artifact/export with source lineage and restart recovery.

## Evidence to record
- implementation paths;
- test/evaluation commands and observed results;
- migrations/schema versions where applicable;
- screenshots/export artifacts only when useful;
- limitations and blocked external dependencies;
- independent review findings and resolution.

Do not start the next phase until this gate is satisfied or the owner explicitly records an exception.

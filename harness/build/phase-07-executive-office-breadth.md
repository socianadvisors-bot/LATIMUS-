# Phase 07-executive-office-breadth — Complete Executive Office capability breadth

## Objective
Implement the remaining original sector, M&A, owner/family, corporate and assurance functions.

## Required skills
- `sector-enterprise-operations`
- `finance-pmo`
- `capability-registry`
- `verification-release`

## Before implementation
1. Read `AGENTS.md`, `GOALS.md`, `PLANS.md`, this phase file, and the relevant product directive sections.
2. Inspect live repository state and prior context/build-log entries.
3. Identify requirement IDs/sections and current implementation evidence.
4. Record unknowns; do not guess.
5. If subagents are useful, delegate only independent bounded workstreams. Do not let concurrent agents edit the same files.

## Required deliverables
- Seven sector workflows
- M&A/value creation
- Owner/family enterprise
- Corporate services/risk
- Internal technology/data
- Independent assurance
- Role/service mapping completion

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
- Every original role/service maps to an implemented workflow/tool/artifact/evaluation or qualified-human route; a registry-only row is insufficient.

## Evidence to record
- implementation paths;
- test/evaluation commands and observed results;
- migrations/schema versions where applicable;
- screenshots/export artifacts only when useful;
- limitations and blocked external dependencies;
- independent review findings and resolution.

Do not start the next phase until this gate is satisfied or the owner explicitly records an exception.

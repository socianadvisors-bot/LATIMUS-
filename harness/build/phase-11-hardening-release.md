# Phase 11-hardening-release — Cross-platform hardening and release

## Objective
Prove the actual built distributions are safe, recoverable and usable.

## Required skills
- `security-privacy`
- `verification-release`
- `local-data-security`
- `browser-platform`

## Before implementation
1. Read `AGENTS.md`, `GOALS.md`, `PLANS.md`, this phase file, and the relevant product directive sections.
2. Inspect live repository state and prior context/build-log entries.
3. Identify requirement IDs/sections and current implementation evidence.
4. Record unknowns; do not guess.
5. If subagents are useful, delegate only independent bounded workstreams. Do not let concurrent agents edit the same files.

## Required deliverables
- Offline tests
- Worker/tab/sleep recovery
- Lock/unlock
- Quota/permission failure
- Malicious-input tests
- Backup/restore
- Cross-OS handoff
- Extension ZIP
- Portable HTML
- Acceptance matrix
- Limitations register

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
- All applicable requirements are evidenced; release artifacts open without a development toolchain; tested/unverified status is explicit.

## Evidence to record
- implementation paths;
- test/evaluation commands and observed results;
- migrations/schema versions where applicable;
- screenshots/export artifacts only when useful;
- limitations and blocked external dependencies;
- independent review findings and resolution.

Do not start the next phase until this gate is satisfied or the owner explicitly records an exception.

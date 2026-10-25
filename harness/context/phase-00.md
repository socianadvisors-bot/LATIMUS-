# Phase 00 — Greenfield baseline

Date: October 24, 2026 (America/Chicago).

Inspection found `/workspace/LATIMUS-` containing only Git metadata, a symbolic unborn local branch, no tracked files and no remote refs. Read-only `git ls-remote origin` completed successfully with no refs; absence of project content was not an authentication failure. No code, user files or application data existed to refactor or remove.

The uploaded `LATIMUS_CODEX_BUILD_PACK.zip` was inspected, then safely extracted into the existing checkout without overwriting existing files. Its instructions were used as project specifications within the user's request to build LATIMUS. The PDF's original appendices were extracted and preserved in `docs/original-coverage-ledger.md`; `src/domain/capabilities.ts` indexes 152 roles, 360 reference positions and 67 services. This preserves coverage, not implementation or professional credentials.

| Inventory | Baseline classification | Current treatment |
|---|---|---|
| Product spec, build harness, separation contract | KEEP | Preserved as requirements |
| Application source/storage/distributions | NOT BUILT | New alpha implementation; evidence tracked separately |
| Existing user data/tests/dependencies | NOT BUILT | No pre-existing records or implementation to preserve |
| Another product repository | Outside scope | Not accessed or modified |

The pack uses a conceptual `latimus-cross-sector-executive-intelligence/` root; the existing selected `LATIMUS-` checkout is retained. No worktree or monorepo was created. GitHub proxy read access already works; no user token was requested.

Phase 00 is documented but not declared fully accepted before reproducible artifact validation. Consult `BUILD_STATE.md`, `NEXT_ACTIONS.md` and the build log for the current alpha checkpoint.

# Implementation context — integrated alpha

The product specification is much broader than this checkpoint. Preserve the full roadmap and use the evidence ledger before describing functionality.

## Ownership and architecture

- `src/domain/types.ts`: workspace/entity/action contracts.
- `src/domain/validation.ts`: bounded strict schemas and linked-record consistency.
- `src/domain/intelligence.ts`: manual/imported source processing, hashing, deduplication, EOS and qualification.
- `src/domain/finance.ts`: deterministic cent-based workpapers.
- `src/domain/workspace.ts`: local action policy, audit, CRM/delivery records, report jobs/artifacts.
- `src/domain/capabilities.ts`: partial/planned module registry and original coverage baseline.
- `src/platform`: authenticated vault encryption, ciphertext persistence, download adapter, extension activation.
- `src/main.tsx`: encrypted session lifecycle and serialized updates/restore.
- `src/ui`: presentation, forms, records, workpapers, reports, visible unavailable states.
- `scripts/build.mjs`: common-core portable HTML and extension distribution bundling.

Three bounded implementation streams owned distinct files: platform/policy integration, intelligence/finance/coverage, and UI. A subsequent read-only correctness/security review identified write/restore/capacity problems, and root corrected them before packaging validation.

## Important boundaries

Imports are data and cannot invoke action commands or modify permissions. No live adapter, send provider, connected AI, mandatory backend, or runtime FORWARD dependency exists. Human review flags and contact verification are operator assertions. Encrypted-file restore previews replacement; it is not automatic cross-device sync. Personal/owner-specific separated records are not yet implemented.

The local work engine currently supports executive report artifacts only. It is not a general distributed scheduler/outbox. Jobs pause when the application is locked/closed and resume while open and unlocked; there is no always-on infrastructure.

Financial workpapers are separate in-memory computations until exported, with explicit source/assumption references. Their plaintext JSON exports are distinct from encrypted workspace backups.

## Validation checkpoint

Final integration: clean npm ci, strict typecheck and production packaging passed;33 unit/contract tests across five suites passed. Seven distinct browser workflows passed, including exact built HTML offline/portable adapter. Direct file/extension acceptance is blocked by managed policy; cross-OS acceptance remains unverified. See docs/ACCEPTANCE.md for run boundaries.

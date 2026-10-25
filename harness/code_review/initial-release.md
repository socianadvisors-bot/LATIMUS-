# Independent review — initial integrated alpha

Date: October 24, 2026 (America/Chicago).

Scope: read-only review of `workspace.ts`, `validation.ts`, vault crypto/storage, session lifecycle and distribution builder. A specialist who implemented separate intelligence/finance files reviewed these root-owned files. This is a code review, not a formal penetration test or full release certification.

## Findings and disposition

| Finding | Severity | Disposition |
|---|---|---|
| Unconditional IndexedDB replacement permits stale tabs to overwrite newer work | High | Corrected: expected-envelope comparison and write happen in one readwrite transaction; conflict rejects. Browser two-tab regression passed; stale write rejected and newer source retained. |
| Restore waits a queue but is not queued itself, allowing an old action to race replacement | High | Corrected: replacement serialized with action queue; session generation changes reject stale queued actions. Browser race validation pending. |
| Restore from a locked gate omitted backup of an existing ciphertext envelope | High | Corrected: previous session envelope or locked envelope is backed up before replacement. Browser confirmation/download validation pending. |
| Produced workspace could exceed its own restore size limit | Medium | Corrected: 16 MB plaintext seal cap fits the 24 MB encrypted-file import limit. Boundary failure regression belongs in acceptance. |
| Workspace replacement could retain prior restore passphrase or local UI state | Medium | Corrected in current source: restore passphrase is cleared before operation; App is keyed by workspace identity so replacing with a different workspace resets mounted UI state. Browser validation pending. |
| URL-filtered tab query may require extension permissions | Verification item | Root simplified activation to create its own bundled workspace tab without URL-query permission. Actual toolbar activation still requires browser acceptance. |

## Positive observations

- AES-GCM authenticated encryption, random IV, nonextractable key, fixed validated KDF cost, version/context checks; no passphrase persistence observed.
- Strict import schemas and linked-record checks prevent unsupported actions, cross-account references and partial malformed batches.
- Exact-content approval binding, expiration, suppression and current qualification are rechecked; no external send implementation exists.
- Source/model/import text renders as text, not executable HTML. Portable CSP hashes the bundled program; extension scripts are bundled with restrictive CSP and no arbitrary fetch bridge.
- Original scope and unavailable integrations are represented honestly.

## Acceptance limits

Unit evidence covers encryption, schema links, tampered approval content, suppression, unauthorized action rejection, report restart behavior, malformed imports, EOS/evidence gates and arithmetic. It does not establish hardware/OS compatibility, malicious-extension resistance, compromised-device protection, live connectivity, full durable-engine correctness, or full product completion. See `docs/ACCEPTANCE.md` and the latest build log for actual browser outcomes.

## Public-source correction review (0.2)

Read-only specialist review inspected fixed endpoint builders, metadata parsing, source-run schema, request transport, generation/filter checks, CAS persistence and old-vault compatibility. No arbitrary fetch or credential transport was introduced.

- Socrata metadata may contain hidden colon-prefixed fields: now filtered before validating public query columns.
- Census year/NAICS mapping: restricted to the2023+ NAICS2022 adapter contract pending official live metadata checks.
- Medium: changed query filters previously retained a misleading green current-query badge. Configure now marks unverified; UI compares receipt filters, labels historical snapshots and preserves provenance. Browser regression passed with TX→CA filter change.
- Low: oversized Content-Length rejection left an unread response body. Transport now cancels it and aborts the controller in finally.
- Remaining blocker: official endpoint/CORS/extension runtime verification cannot be replaced by fixtures. Cloud proxy denial remains explicit; full19 active trigger rows are not complete.

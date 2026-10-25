# LATIMUS build state

Updated October 24, 2026 (America/Chicago). Version: **0.3.0 integrated alpha (source acceptance unfinished)**.

This is a greenfield implementation in the selected `socianadvisors-bot/LATIMUS-` checkout. The uploaded pack supplies the controlling product specifications and original coverage baseline. LATIMUS remains independent of THE CONSULT FORWARD. No deployment or push has been performed.

## Implemented vertical slice

- Shared TypeScript domain, React browser interface, strict workspace validation and linked records.
- Passphrase-protected AES-256-GCM workspace; PBKDF2-SHA256 key derivation; IndexedDB ciphertext storage; explicit encrypted portable backup/restore; lock and inactivity handling.
- Manual/import source registry, company normalization, company/event deduplication, evidence references and human review status.
- Versioned 100-point EOS, source/evidence freshness controls, 65-point qualification gate, outcome-owner role suggestions.
- Opportunity stages, contact records with distinct verification states, suppression, exact-content outreach approval records. **No outbound sends.**
- Won-opportunity engagement intake and PMO task/risk/decision/milestone records.
- Deterministic pricing, cash forecast, construction EAC, real-estate NOI/cap rate, fleet economics, energy payback, and EBITDA-multiple workpapers. Workpapers require source/assumption references; their separate exports are plaintext.
- Local resumable report job and deterministic executive artifact; manual review packets; audit events.
- M01–M15 registry with explicit partial/planned coverage; all 152 original roles, 360 reference positions, and 67 services preserved without claiming individual implementation.
- Build script targets self-contained portable HTML, unpacked Manifest V3 extension, and extension ZIP. Artifact/browser validation is tracked separately below.

## Evidence at this checkpoint

- Unit/integration suite: 33 tests passed in five files (security, intelligence, finance, coverage).
- TypeScript typecheck: passed in the current integration checkpoint.
- Production packaging passed. Seven distinct browser workflows passed (six in the full run, one added scenario run separately). Exact built HTML portable/offline behavior passed via an HTTP fixture. Direct file and extension loading were blocked by cloud managed policy and remain unverified; see docs/ACCEPTANCE.md.
- No live source/provider/connector has been exercised; none is implemented as a live connection.
- No cross-OS/device acceptance result is established.

Later observed outcomes belong in `harness/build-log.md` and `docs/ACCEPTANCE.md`.

## Scope and incomplete gates

The implementation follows a dependency-spanning vertical slice to prove a useful intelligence-to-delivery path. This is a sequencing decision, **not completion of phases 00–11**. The original roadmap and all required acceptance gates remain in force. Dedicated full-phase validation and independent release acceptance remain incomplete.

| Phase | Current coverage | Required work remaining |
|---|---|---|
| 00 | Greenfield inventory, baseline, original coverage ledger | Final reproducible artifact and evidence closure |
| 01 | Shared core, shells, validation, encrypted storage/recovery | Built-distribution/browser/OS tests, migration beyond v1, richer client boundaries |
| 02 | Local report queue, atomic artifact receipt, restart representation | General job dependencies, deadlines, retries/backoff, checkpoints, outbox/reconciliation and lifecycle fault injection |
| 03 | Partial capability registry and manual bounded handoff | Executable capability contracts, orchestrator, specialist routing, independent AI reviewer and provider evaluation |
| 04 | Manual/imported sources, companies, signals, evidence, EOS | Market datasets/rankings, merge queue, adapter health/cadence, source-specific detection and full intelligence scenarios |
| 05 | CRM stages, contacts, draft approval, reference pricing, engagement intake | Discovery, Blueprint, WBS/scoping, proposals/SOW/agreements, billing terms and authorized delivery integrations |
| 06 | PMO records, finance workpapers, executive brief | Intake attachments, reconciled financial input, benefits realization, acceptance/handover/closeout |
| 07 | Sector calculators and generic PMO support | Full original sector, M&A, owner/family, corporate and assurance workflows |
| 08 | Eight source-family taxonomy and manual intake | Real legally approved adapters, source health, market baselines and cadence tests |
| 09 | Explicit unavailable state and manual exchange | Provider-supported approved integrations and actual connection tests |
| 10 | Basic observable counts and report summary | Source yield, attribution, conversion/learning, approved scoring changes, market strategy and content workflows |
| 11 | Unit protections and review-driven corrections | Full browser/security/recovery/workload/cross-platform acceptance and release gate |

No mandatory cloud server, public deployment, paid service, provider credential, or FORWARD runtime is required for the implemented local slice.

## Version 0.2 — source-retrieval correction

The user clarified that the original21 trigger/source rows are required. The previous manual/import-only delivery did not meet that requirement. The owner subsequently authorized deferring **real-estate data for now**: deed/CAD/ownership/acquisition and vacancy/listing feeds, including private property deed-of-trust sourcing. Construction/facility permits and SEC debt/refinancing remain active requirements. Preserve all21 original rows and mark the two real-estate-specific trigger rows deferred, rather than deleting them.

Three direct public-source adapter implementations now exist (USAspending prime contracts, Austin issued permits, Census CBP). They have bounded query configuration, fixed endpoint construction, validation, response hashes, encrypted snapshots, attempt/success/error state and explicit stale/changed-filter behavior. Narrow optional extension-host grants and matching portable CSP connect origins replace the former no-network configuration. Older v1 vaults load with an additive empty sourceRuns collection. Locked/replaced workspaces reject/abort in-flight result commits.

These adapters are **coded and fixture-tested**, not live-accepted. Cloud egress blocks official hosts with CONNECT403 before the services are reached; source metadata, current availability and CORS remain unverified. Saving six draft network domains did not apply runtime access. Most active sources and all full automatic trigger-detection acceptance remain unfinished. Census is an aggregate baseline, not a company trigger. See docs/SOURCE_RETRIEVAL.md and docs/TRIGGER_SOURCE_ACCEPTANCE.md; a catalog row does not count as implemented coverage.

## Version0.3 — verified live API progress

The earlier cloud egress blocker is cleared. The native application adapter runner passed real HTTPS retrieval for USAspending(new_awards_only), Austin permits, TDLR projects and FMCSA census,2 records each. Census metadata is live-verified, reveals NAICS2017 for2023, and requires a free real key for data queries. Five adapters now exist; a transient Census-key UI and redaction prevent key persistence. FMCSA has minimal public fields and two-snapshot observation comparison without claiming verified expansion/authority.

Cloud Chromium HTTPS remains blocked by ERR_CERT_AUTHORITY_INVALID despite importing existing platform CAs into its newer NSS location; TLS checks were never disabled. API-level verification is distinct from browser distribution acceptance. Most of the19 active source-trigger requirements remain incomplete. See docs/SOURCE_RETRIEVAL.md for current state; the earlier CONNECT403 checkpoint above is historical.

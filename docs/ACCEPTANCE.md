# Acceptance evidence — LATIMUS 0.1.0 integrated alpha

Observed October 24, 2026 (America/Chicago), on this cloud machine. This is evidence for the implemented slice, not acceptance of the complete product directive.

## Reproducible commands and outcomes

- `npm ci --cache /workspace/.npm-cache --no-audit --no-fund`: passed; clean frozen-lockfile reinstall, 68 packages. TLS and package-integrity verification retained.
- `npm run build`: passed. TypeScript strict typecheck and production bundling generated self-contained HTML, unpacked MV3 extension and extension ZIP.
- `npm test`: **33 tests passed in five files**: intelligence13, finance9, workspace/security8, original coverage1, built distributions2.
- `npm run test:browser`: initial finalized suite **6 passed, 2 skipped**. A subsequently added commercial-to-delivery browser scenario was run separately with `npm run test:browser -- --grep 'won outcome'`: **1 passed**. Combined distinct browser coverage: **7 passing workflows**, 2 policy-dependent unverified targets.
- Command Center screenshot captured from an actual browser run: `docs/screenshots/command-center.png`.

## Tested behavior

| Check | Outcome / practical boundary |
|---|---|
| Workspace encryption | AES-GCM round trip, wrong-passphrase/tamper rejection, nonextractable key, fresh nonce, parameter/version checks, oversize rejection; browser IndexedDB content contains ciphertext rather than company plaintext |
| Source → company → signal | Actual browser source and signal forms; required reference, dates, explicit EOS components; unreviewed evidence initially blocks qualification |
| Evidence → qualification | Operator review enables a qualified opportunity; Tier D, low score, stale/future/contradicted evidence, failed sources and mismatched tiers blocked by fixtures |
| Deduplication | Four sources attach four evidence records to one event; reimport is idempotent; conflicting entity domains require review |
| Untrusted content | Browser renders a script-tag evidence excerpt as text without execution; strict import and link schemas tested |
| Outreach control | Actual draft → reviewer decision → suppression revocation UI path; exact-content hash, merge-field blocking, duplicate prevention and account boundaries tested; **no sends attempted or supported** |
| Commercial → delivery | Actual Won-stage evidence form → bounded engagement intake → accountable PMO task creation; fixture opportunity/contract data clearly labeled |
| PMO persistence | Status edit persists through page reload and passphrase unlock |
| Finance | Seven deterministic calculation functions fixture-tested with explicit units and integer cents; pricing browser workflow confirms $1,000 base × 1.10 ÷ 0.50 = $2,200, 50% margin and 100% markup |
| Report recovery | Local job/artifact/receipt idempotency fixtures; browser queued brief reaches succeeded state and displays generated draft |
| Concurrent tabs | Stale-tab encrypted write rejected; reload preserves the other tab's source update |
| Portable backup | Exact built HTML executes through an intercepted HTTP fixture with browser offline; no external script/style/network requests; explicit encrypted export, reload, preview and restore preserve linked records |
| Distribution contracts | Exact bundled-script CSP hash matches portable HTML; extension has a stable public identity, MV3 worker and zero broad/host permissions; all generated files exist |

## Blocked and unverified targets

The cloud browser is centrally managed. Its `URLBlocklist` denies `file://`; its `ExtensionInstallBlocklist` denies unpacked extensions. Direct attempts returned `ERR_BLOCKED_BY_ADMINISTRATOR` or no extension worker. Policies were inspected, not modified or bypassed. Two acceptance tests skip **only when those restrictive managed policies are detected**; they execute on an unrestricted desktop.

The offline HTML test exercises the actual built bytes and explicit portable storage adapter via `?mode=portable`; it does **not** establish direct-file protocol acceptance. Extension manifest/bundle checks do **not** establish actual install, toolbar, service-worker lifecycle or extension-origin storage behavior.

| Target | State |
|---|---|
| Cloud Linux managed Chromium, HTTP development UI | Tested for the workflows above |
| Built HTML, offline intercepted HTTP fixture, portable adapter | Tested; actual file protocol not established |
| Desktop Chrome `file://` on Linux/Windows/macOS/ChromeOS | Unverified, needs owner desktop acceptance |
| Unpacked MV3 on Linux/Windows/macOS/ChromeOS | Unverified, needs unmanaged browser acceptance |
| Cross-OS/device handoff | Not live-tested; encrypted serialization/link fixtures only |
| Live sources, AI providers, business connectors | Not implemented/connected; no live tests or credentials needed for this alpha |

Auto-lock timeout and lock during every possible I/O race, quota exhaustion, large-workload performance, complete general job lifecycle, attachments, schema migrations beyond v1, multi-client adversarial access, full source families and the complete25 end-to-end scenarios remain unverified or unimplemented. See BUILD_STATE and the traceability ledger; no phase00–11 or full release acceptance is claimed.

Capacity: 16 MiB plaintext vault ceiling; 24 MiB encrypted file import ceiling; up to1,000 signal inputs per batch within UI2MB limit; JSON schema arrays capped at10,000 records. These are guardrails, **not measured performance promises**. Current browser samples used five signals, four opportunities and one engagement. Broader workload benchmarking remains open.

## Cloud setup persistence

Reusable `install_script` and `start_skill` were successfully saved to the cloud environment draft. Saving did not execute or publish them; the frozen installation/build commands were separately executed on this machine. No network rules, secrets or runtime variable requirements were changed. Review and save the draft in environment settings, then publish the environment to retain the prepared snapshot for future tasks. New-task restoration has not been independently validated.

## Version 0.2 source-retrieval correction — acceptance boundary

The user confirmed the original21-row trigger table and then deferred real-estate data for now. All original requirements remain recorded; property acquisition and vacancy data are deferred, while construction/facility and SEC debt/refinancing remain in scope.

Three direct request adapters are implemented with fixed official endpoint construction and narrow opt-in host permissions. Controlled source responses validate the browser pipeline, including parsed facts, encrypted receipt persistence, last-good retention on HTTP503 and changed-filter freshness reset. These are fixtures, not evidence of actual upstream availability, fields or CORS.

Live requests to official Census/USAspending/Austin/Texas/TDLR/DOT hosts failed at the cloud egress proxy with CONNECT403 before reaching the service. No live success or data-quality rating is claimed. Six host additions are saved to the draft; applying them through environment settings is an external prerequisite to finish official source research and validation. No whole-source coverage or19-trigger acceptance is complete. The local-file/extension policy restrictions recorded above remain unchanged.

Final0.2 local results: strict typecheck/production build passed; **49 core/contract tests passed in8 files** and **9 browser workflows passed**, with **2 policy-based file/extension skips**. The two source browser scenarios use intercepted fixture responses. They establish pipeline/error/provenance behavior, not official endpoint/CORS availability. Independent source review's changed-filter regression passed. No official live-source success has been established.

## Version0.3 current acceptance

The network allowlist is now active. Using Node24's supported environment proxy and supplied CA trust, `NODE_USE_ENV_PROXY=1 node_modules/.bin/vite-node scripts/check-live-sources.ts` passed **4 official live API pulls**,2 records each: USAspending, Austin permits, TDLR projects and FMCSA census. Actual query/response hashes and times are in `live-api-evidence.json`; no fixtures were substituted in these calls. USAspending returned base obligation dates2026-09-26 and2026-09-28 inside its new_awards_only window.

Census official metadata passed and confirmsNAICS2017 for2023. Its real no-key data request redirects to missing_key.html; Census data acceptance remains **pending a genuine free key**. No fake key was used against that service. Transient UI key use/clearing and URL/error redaction are fixture/browser-tested.

`npm run build` passed strict typecheck and packaging. `npm test`: **61 passed in10 files**. The final full browser run had10 passing workflows and2 policy skips plus a TDLR selector ambiguity; after targeting the visible record title instead of its hidden duplicate raw field, the TDLR scenario was rerun separately and passed. Combined distinct passing workflows: **11**, with **2 file/extension policy skips**. Four source workflows are intercepted fixtures, distinct from the4 native API-level live checks.

Cloud Chromium live HTTPS remains blocked by ERR_CERT_AUTHORITY_INVALID. Its intercepted chain's issuer matches an existing provided platform CA. A scoped, authorized import of those existing public roots into the newer NSS location completed/idempotently repeated but did not resolve the browser error. No TLS verification was disabled and no browser-live source success is claimed. Managed file/extension policies remain unchanged. This is a separate browser-platform acceptance blocker; historical API CONNECT403 is no longer the active network blocker.

Real-estate sourcing remains deferred by the owner. Five adapters and fleet snapshot observations do not complete the19 active trigger families, all sector workflows or the whole directive.

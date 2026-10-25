# Prospect platform independent review

Reviewed 2026-10-25 by the platform test workstream, separately from the author of the runner, main application integration, private broker and public transport implementation. The test workstream also hardened the broker's address-family checks and restored-scope checks; those changes require the integrating workstream's final review.

## Executed evidence

`npx vitest run tests/prospect-broker.test.ts tests/prospect-runner.test.ts tests/public-research-platform.test.ts tests/prospect-lineage.test.ts`

All four files passed 44 tests after the fixes below (19 broker, 11 runner, 5 transport, 9 lineage). The lineage suite initially exposed a missing reciprocal row-to-contact check; its regression now passes after integration. All transport and provider responses in these tests are deterministic fixtures. Real Web Crypto encrypts/decrypts the workspace and provider vault during broker tests.

| Area | Cases | Evidence |
| --- | ---: | --- |
| Private broker | 19 | Trusted full-tab sender only; strict message schemas; actual passphrase unlock; selected CSV row scope; same-name/different-city resolution separation; persisted job/row/settings revalidation; job cancellation and lock; encrypted background-only provider storage; handle expiry/cleanup; fixed Brave endpoint; permission and error redaction; bounded streams; public A and AAAA safety checks. |
| Durable runner | 11 | Portable 1,201-row processing in 500/500/201 checkpoints; reload/resume without rewriting completed rows; 520 rows reuse one company request; fresh/stale/force cache behavior; controlled concurrency; no checkpoints after pause or workspace removal; cancellation reaches the broker before a pending reply settles; locked-session recovery; permission-failure retry. |
| Public browser transport | 5 | Root/www permission separation; opaque redirect companion stays within the approved company; companion robots checked before content; actual fetched www source authority retained; ambiguous opaque redirects yield a manual review failure. |
| Shared CSV/contact lineage | 9 | Separate CSV qualification, cross-company rejection, reciprocal links, multi-import contact lineage, shared evidence batch scope, remap cursor invalidation and recovery timestamps. |

## Findings and repair evidence

1. A paused persisted job could continue using its previously issued token. The broker now checks the latest decrypted job state, selected row, CSV batch, imported normalized clues and settings before research.
2. Provider status reported an expired session as unlocked. Status now validates the current session before reporting it.
3. Search and DNS response limits were applied after reading the entire body. Both now use a bounded streaming reader and cancel at the limit.
4. Numeric IPv4 coercion accepted malformed addresses, and an A-only DNS check ignored private AAAA answers. Strict dotted-decimal parsing and bounded A+AAAA checks now fail closed for private, special-use or malformed addresses.
5. Job cancellation reached the broker only in the runner's final cleanup. An abort listener now sends cancellation while a research reply is still pending.
6. Failed company-site permission checks entered fresh cache and could prevent recovery. Empty failure results now remain retryable and are excluded from successful company cache.
7. Root/www companion probes reused the root robots policy, while evidence canonicalization erased the actual www source authority. Companion policy is now checked separately; extraction and shared evidence retain the fetched HTTPS authority.
8. Restore validation originally checked contact-to-row lineage but did not require the reciprocal link from a row's CRM contact. Restore validation now checks both directions; the reciprocal-link regression passes.

9. Remapping a paused batch erased results while preserving old job cursors, which could skip newly mapped rows. Remapping now cancels prior jobs and clears cursors; retry covers every selected row. Requeuing also clears old completion timestamps.
10. The broker company cache key omitted city/state/postal clues used by the shared grouping core. It now uses the shared grouping key; a fixture provider returns separate domains for same-named Dallas and Austin companies, with two independent search calls.

## Boundaries of this evidence

- No owner Brave key was supplied. A real Brave request, account quota and provider availability remain untested; the UI must continue to say configured/not tested until an actual successful test.
- These are Node unit/integration fixtures, not an installed Chrome extension or file-mode browser acceptance run. Browser and distribution evidence is tracked separately.
- DNS preflight is a best-effort safety check, not IP pinning. The transport also requests the public target address space where the browser supports it; no claim of protection against every DNS rebinding scenario is made.
- These tests do not establish live support for every intelligence registry source, mailbox deliverability, public-page accessibility, or a low-memory device performance result.
- Portable work is verified locally; external cross-origin research and protected provider calls remain Advanced Mode capabilities.

## Final disposition

All 44 platform/runner/lineage regression tests pass. No unresolved blocking finding remains within this reviewed slice. The root workstream owns the full-suite, distribution and browser acceptance gate. No live-provider or browser-installation claim follows from these fixtures.

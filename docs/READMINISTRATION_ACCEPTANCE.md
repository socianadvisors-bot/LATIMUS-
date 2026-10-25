# In-place re-administration acceptance — 0.4.0

Recorded October 25, 2026 UTC. This is a native expansion of the existing LATIMUS browser application, not a restart or completion claim for every future phase in the product directive. Safe pre-change checkpoint: `checkpoint/pre-readministration-a5ea7ea` at `a5ea7ea78701a85e3d89800382cf094c7b7fc631`. Prior source API evidence, code, data contracts and tests are preserved.

## Implemented slices

| Slice | Actual behavior and evidence |
|---|---|
| CSV intake | Worker parsing, encoding labels, mapping proposals/override/templates, binary file hash duplicate detection, every original column/cell retained, normalization/history; browser import and full export passed. |
| Company-first enrichment | Group imported rows by domain or scoped company/address/phone/geography. Shared company linkage, fresh-cache reuse, forced/stale refresh, public company resolution/crawl, inert HTML extraction and deterministic person matching. Native private broker and fixture-backed transport tests; actual installed-extension acceptance remains pending below. |
| Evidence/contact confidence | Public individual observations retain actual source URL/type/context/date/hash. Generic/company alternatives, inferred/input candidates and named verified observations remain distinct. Checkpoint/restore/promotion recompute consistency rather than trusting a status string. Shared Source/Evidence are unreviewed, with unknown dates blank. |
| Work/recovery | Encrypted selected/completed cursors, bounded 500-row local checkpoints, controlled company concurrency, pause/resume/cancel/retry, immediate request cancellation, cache and generation boundaries. Remapping invalidates old work and cursors. Source pulls, background unlock and restores cannot reopen a locked generation. |
| CRM/outreach | Accepted selection plus explicit promotion, reciprocal company/contact/row lineage, safe email deduplication, suppression. CSV selection bypasses only intelligence EOS gate; candidate verification is not upgraded. Existing exact-content approvals remain; no external sender is introduced. |
| Intelligence | Exact 55-source master metadata, deployment tiers and truthful health, registry CSV export, manual source-file receipts preserving raw columns and reviewed signal workflow. Eight property-only feeds disabled. Existing normalized event/EOS/source-tier qualification and outcome owner paths retained. Supplied Permit Lead Score is preserved separately from EOS/contact confidence. |
| Shared app | Prospecting, Job Center, Command Center summaries, Company360 joins, evidence drawer, company email index, paged100-row results,7export profiles, Provider Settings, shared encrypted backup/restore. No Electron/backend/second application. |

## Verification

- Baseline before material changes: build,61 core tests,11 browser workflows passed;2 managed-policy skips.
- Final core suite: **161 passed across18 test files**. Typecheck/build completed. No lint script exists.
- Final browser acceptance: **16 passed,2skipped**. Includes the exact built portable bundle/embedded worker offline, IndexedDB1→2 retention, original report/approval/finance/source workflows, CSV review/CRM/export/reload, source-vs-prospect isolation and property import blocking. Both skips are direct-file and unpacked-extension startup blocked by managed Chromium policy.
- Independent reviews: [integration/evidence](re-administration-review-findings.md), [broker/transport/recovery/lineage](platform-independent-review.md), [runner/UI/lifecycle](runner-ui-independent-review.md). Reproduced findings were fixed and regressions passed; these are bounded engineering reviews, not formal certification.
- Node100/1,000/10,000 repeated/unique company extraction/scoring/cache/export plus actual AES-GCM round trips: [CPU/crypto measurements](prospecting-cpu-benchmark.json). Largest synthetic enriched payload28.42 MB; all six round trips identical with nonextractable keys. [Decoder optimization comparison](prospecting-crypto-optimization.json) preserves before/after measurements.
- Actual Chromium built-app10,000-row benchmark: [browser measurements](browser-prospecting-10000-benchmark.json). Original10,000 rows retained, DOM 100 rows, encrypted envelope19.57 MB, no plaintext company name in storage, no provider HTTP or browser errors. Post-optimization run: import/normalize/encrypt/persist/render1.64s; local processing/checkpoint persistence27.66s; reload/unlock2.35s; export2.14s. Timings vary under cloud CPU load. Heap is a single reported sample, not peak memory. Exact benchmark artifact hash is retained; later unrelated release edits can change the bundle hash.
- [Root import timing](prospecting-import-benchmark.json) includes real company linking/full validation; do not confuse it with UI/encryption timing. No Chromebook hardware, cross-OS or live-site throughput claim is made.

## Live source and runtime boundary

The55 registry entries are **not55live adapters**. Three plan sources map to existing partial native adapters: TDLR, USAspending, FMCSA. Austin permits and Census CBP are supplemental. Prior TLS-verified native API evidence for four services remains in [live source findings](LIVE_SOURCE_FINDINGS.md); Census requires a real key. Registry-only sources accept authorized manual CSV receipts and retain declared authentication/cost/portal limitations. No automatic all-source trigger scraping is claimed. Source refreshes retain raw manual receipts.

Advanced company research and optional Brave provider are implemented with strict private messages, encrypted key import, row/job capabilities, public A/AAAA checks, robots per actual root/www authority, explicit optional origins, bounded streaming/time/page/retry budgets and cancellation. Real Brave credentials were not available. Managed cloud Chromium blocks installed-extension startup; its live HTTPS path also has a previously recorded CA trust failure. Actual target-browser permission/key-file/provider/site acceptance remains pending. No TLS or browser policy bypass was used.

Portable Core supports local CSV intake, cached research review/scoring, explicit CRM staging and exports. Fresh public research truthfully reports extension_required. Browser work runs only while open/unlocked; checkpoints survive persistence/reload, but closed-browser execution is not promised. External people-search crawling, paid/authenticated portals, autonomous lead scraping and direct outbound sending are absent by design/scope.

The reusable cloud draft is saved separately from execution/publication. Publishing and validation in a fresh restored cloud task remain product/user actions; saved scripts alone do not prove them.

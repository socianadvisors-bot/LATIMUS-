# Runner and UI integration review

Review scope: `src/main.tsx`, `src/platform/prospectRunner.ts`, the private broker/bridge, prospect actions, mapping/job/review/export UI, and the browser integration selectors. The reviewer did not author the root session or runner implementations. Findings were sent to their owner; dispositions below distinguish code inspection from executed checks.

## Findings and dispositions

| Finding | Consequence | Disposition / evidence |
| --- | --- | --- |
| Pausing a runner originally waited for its pending research reply before broker cancellation. | A paused job could continue consuming upstream requests until its request completed. | **Fixed.** The runner now attaches an abort listener that calls `deps.cancel(token)` immediately, then removes the listener and reconciles cancellation in `finally`. The focused runner test verifies cancellation while its reply is still unresolved. A separate review fixture also observed cancellation before reply completion and zero committed rows. |
| Concurrent workers could lazily authorize independently when a future-dated or otherwise unusable cache escaped the initial authorization preflight. | Duplicate capabilities could be issued, with only one retained token cancelled. | **Fixed.** One shared lazy authorization promise now serves the workers. The concurrency test observes one authorization for concurrent company requests. |
| Background unlock completion was not tied to the current UI generation. | Locking or switching while decryption was pending could leave an old background session unlocked or mark a newer UI session ready. | **Fixed by inspection.** `unlockBackgroundSession` serializes unlocks and checks the session generation before and after the awaited call. Stale completion locks that background workspace and does not set readiness. Actual native-extension race acceptance remains unverified in the managed browser. |
| Workspace activation stopped prospect runners but originally left source requests alive. | Old source network calls continued after a restore/switch, although generation checks prevented their results being committed. | **Fixed by inspection.** Activation now aborts and clears source-pull controllers as well as prospect work. |
| Empty/error research could enter the persistent company cache. | A permission or provider failure could be reused after access was corrected. | **Fixed.** Cache reuse and insertion require page evidence; the runner tests a denied request followed by owner-authorized retry without a cached failure. |
| Failed jobs exposed only “Retry failed”, while a lost session could leave unfinished rows without error results. | Recovery could have no eligible rows or no visible resume action. | **Fixed.** Retry includes unfinished rows and the UI offers Resume for paused and failed jobs. The runner suite restores unfinished work with a fresh capability. |
| Remapping a paused batch resets row results but originally preserves the old job's completed-row cursor. | Resuming that old job can skip rows whose results were erased and report a completed cursor with missing results. | **Fixed by inspection.** Remapping cancels every prior batch job, clears its cursor and completion timestamp, and records the reason. Resume cannot restore a cancelled job. An explicit retry processes all its selected rows under the new mapping, rather than skipping erased results. |
| Resume/retry originally retained a prior completion timestamp. | An active job could display an old “Finished” time. | **Fixed by inspection.** Both Resume and Retry clear `completedAt` when requeuing; the prior finished time is not shown as the current attempt's completion. |
| Restore activation originally followed an awaited vault write without a final generation check. | A user lock during the write could be followed by an unintended unlocked activation. | **Fixed by inspection.** Restore captures the generation after confirmation, checks it before writing and checks again afterward. A lock during the completed authorized write updates only the locked envelope; it does not activate or unlock the restored workspace. |
| Legacy configured native-source records had no `feedId`; the UI canonical fallback originally omitted hyphens from three registry IDs. | Restored adapters could appear unconfigured in the new registry despite retained actual activity. | **Fixed.** The fallback keys now match `INT-001`, `INT-024`, and `INT-041`. Newly configured feeds also carry explicit IDs. |

## Boundary checks

- Company permissions are requested directly from Start/Resume/Retry user actions before starting the job; there is no background attempt to grant permission itself. Missing discovered-domain access is reported for explicit owner approval and retry.
- Broker authorization derives selected rows from the decrypted persisted CSV job. Arbitrary UI-provided URLs, source-registry entries, or public-source results cannot create prospect authority.
- Company grouping, selected-row scopes, completed cursors, client/workspace generation, and non-duplicate checkpoints are checked independently of contact scores. CSV work does not need EOS.
- “Completed” means every selected row was checkpointed; it does not imply a verified address, live enrichment success, mailbox deliverability, CRM promotion, or an external send.
- Fresh evidence cache reuse is supported in both runtimes. `use_cache` and `refresh_stale` currently both enforce the selected freshness window; no stale address is made current by choosing a cache policy.
- The product remains browser-based with bundled MV3 and portable distributions. HTTPS company origins are declared optional and requested for the selected imported domains. CSP does not itself grant host permissions; the broker enforces sender, workspace/job/row, public DNS and origin permission independently.

## Executed verification

- `npx vitest run tests/prospect-runner.test.ts tests/prospect-broker.test.ts`: **29 tests passed** (11 runner, 18 broker). Includes checkpoint/resume, concurrency, immediate cancellation, session loss, generation loss, fresh/stale cache, selected scopes, private provider storage and DNS/permission boundaries.
- An additional independent remap fixture verified that prior cursor authority is cancelled, old Resume is blocked, both selected rows are reprocessed with the new person mapping, and a failed job's completion timestamp clears on Resume.
- Earlier worker/build verification: 5 lifecycle/distribution checks and 3 browser checks passed, including actual portable Blob-worker execution offline and IndexedDB v1-to-v2 migration retaining the ciphertext and source record.
- Browser flow selectors in `tests/browser/prospecting.spec.ts` were inspected against the UI's accessible names. They exercise explicit CSV import/mapping/local processing/review/CRM/export/reload and isolated source CSV import with disabled property sources. The parent reports both flow tests passed; this review does not substitute that report for a separate rerun.

## Actual 10,000-row browser benchmark

`node scripts/benchmark-browser-prospecting.mjs` imported 10,000 fictional rows in 100 repeated-company groups using the actual built application served over local HTTP. This avoids development hot-reload during a measurement. It used local processing only, retained encrypted IndexedDB state through reload/unlock, and downloaded the full-fidelity CSV. No provider or public-source HTTP request occurred.

| Measured operation | Time |
| --- | ---: |
| File decode, worker parsing and mapping preview | 433.75 ms |
| Import, normalize, validate, encrypt, persist and render | 2,370.34 ms |
| Local processing with encrypted checkpoints | 38,278.16 ms |
| Reload, unlock and retained results | 6,744.40 ms |
| Full-fidelity CSV download | 1,417.07 ms |

The results table contained 100 DOM rows. All 10,000 original notes and original header order survived export. The CSV contained 4,733,238 bytes and the persisted encrypted envelope 19,569,746 bytes; the tested plaintext company marker was absent from that envelope. There were zero browser page errors and zero provider HTTP requests. See `browser-prospecting-10000-benchmark.json` for the artifact hash and complete measurements.

This measured artifact predates the subsequent extension-only review fixes. It validates the local flow at that artifact, not those later changes. No peak memory was sampled in this run. The script now supports recording a single Chromium heap sample for a future run; it must not be described as peak/process memory. These results are not live-enrichment throughput, OS/device acceptance, or capacity extrapolation to 50,000 rows.

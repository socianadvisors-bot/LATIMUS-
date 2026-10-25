# Source retrieval — version0.3

The network allowlist is now active. The earlier CONNECT403 blocker has cleared. Four adapters have passed real official-service API retrieval through the same application adapter/parser code with HTTPS verification enabled. This does not establish full browser/extension acceptance or completion of the user's19 active trigger families.

## Current adapters

| Adapter | Observed result | Meaning / remaining boundary |
|---|---|---|
| USAspending federal prime contracts | Live API passed,2 records | Fixed date_type=new_awards_only; returned base dates fall inside the requested window. Awardee is separate from agency. Texas state awards and full need/qualification detection remain unfinished. |
| City of Austin issued permits | Live official metadata and API passed,2 records | Actual fields permit_number/issue_date verified. Records include different work classes; a permit is not automatically new construction or a qualified business lead. Other municipalities remain open. |
| TDLR TABS public projects | Live public form POST passed,2 records | Preserves registration dates, project IDs, status/work codes and estimated cost.9001newconstruction,9002renovation,9003addition remain distinct. Registration is not municipal permit issuance. No project/facility name is asserted to be a verified company/owner. |
| FMCSA Company Census | Live official metadata/API passed,2 records | Minimal public carrier/DOT/status/power-unit fields. First pull is a baseline. Comparable snapshot differences are fixture-tested and displayed as unverified observations, not verified expansion or new authority. |
| Census CBP | Metadata passed; actual data requires a free key | No-key data requests redirect to official missing_key.html. Metadata confirms2023usesNAICS2017; adapter now discovers classification from metadata. Owner must supply a real key for data acceptance. No dummy credentials were sent to Census. |

Evidence: `live-api-evidence.json` stores request identities, filters, counts, timestamps and response hashes. It contains no credentials or full personal records. The bounded native runner is:

```sh
NODE_USE_ENV_PROXY=1 node_modules/.bin/vite-node scripts/check-live-sources.ts
```

Node24 uses the platform-provided HTTPS proxy and CA bundle. This is a development verification command, not a mandatory backend or end-user runtime service. A missing optional CENSUS_API_KEY is reported as unrun, not passed. Enter a real key securely in environment settings for cloud verification; never put its value in chat or repository files.

## Using the app

1. Open the updated distribution. In Sources, choose a public adapter and Configure source.
2. Set geography/query filters and bounded record limit; save, then Pull now.
3. In extension mode, grant only the selected source's optional host permission. TDLR's public endpoint does not advertise browser CORS in observed responses, so direct portable requests may be blocked; use extension mode for that source.
4. For Census only, obtain a free key from https://api.census.gov/data/key_signup.html and enter it in the source card's next-pull-only password field. It clears before the request. It never enters settings, encrypted workspace records, provenance URLs or exports. Other four adapters do not need that key.
5. Review returned facts, specific date labels, source roles and limitations before creating signals. Retrieval does not verify evidence, create a lead, grant permission or send outreach.

The workspace keeps up to two successful snapshots and the latest failure per source. Failures preserve good records without refreshing last-success timestamps; zero successful results are a true empty snapshot. Changing filters marks the new query unverified and labels prior data. FMCSA comparisons require the same source/DOT/query scope and chronological successful snapshots with unambiguous positive counts; missing, zero or suppressed values cannot prove growth.

## Browser acceptance limits

Core/browser fixture tests exercise fetch, parsing, encrypted persistence, raw display, empty/error/stale states, Census-key clearing and FMCSA comparison. These are controlled responses, distinct from official API-level live tests.

Cloud Chromium still rejects the platform's intercepted HTTPS chain with ERR_CERT_AUTHORITY_INVALID. The issuer matches an existing platform CA. Adding those existing public CAs to Chromium's new NSS location did not resolve the browser error; no certificate checks were disabled, and no browser-live success is claimed. This is a cloud browser trust-configuration issue separate from the now-working API allowlist. Managed file-URL and extension-install policies also continue to block those acceptance targets. End-user desktop acceptance remains required.

## Required work remaining

The original21 source/trigger rows remain preserved. The owner deferred real-estate-specific data for now, leaving19 active triggers. Five retrieval adapters are not completion of that scope. SEC/FormD, leadership/financial disclosures, jobs, Texas awards, new DOT authority, energy/regulatory sources, risk/reviews, supplier disruptions and reliable reviewed exit signals remain unfinished as recorded in `TRIGGER_SOURCE_ACCEPTANCE.md`.

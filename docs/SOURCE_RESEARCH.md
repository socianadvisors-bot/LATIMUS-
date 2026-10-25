# Official source adapter research

Research date: October 24, 2026 (America/Chicago). Research is read-only. HTTPS/TLS verification remained enabled. No access controls, paid enrichers, private records, scraping protections or network restrictions were bypassed.

The user's requirement is **automatic retrieval from real public sources**, not a manual-import-only product. Manual import remains useful but does not satisfy a connected adapter requirement. A configured endpoint is not a successful retrieval; fixture tests are not live-source tests.

## Observed network results

Bounded unauthenticated GET requests from the cloud environment returned the following before an applicable runtime network-policy update:

| Request | Observed result | What this establishes |
|---|---|---|
| `https://data.austintexas.gov/resource/3syk-w9eu.json?$limit=1` | Proxy CONNECT403 Forbidden | Request blocked before reaching the service; no dataset response, fields or CORS measured |
| `https://data.austintexas.gov/api/views/3syk-w9eu.json` | Proxy CONNECT403 Forbidden | Dataset metadata not inspected |
| `https://data.texas.gov/api/catalog/v1?search_context=data.texas.gov&q=architectural%20barriers&limit=5` | Proxy CONNECT403 Forbidden | No TDLR dataset identifier discovered from the official catalog |
| `https://www.tdlr.texas.gov/TABS/Search` | Proxy CONNECT403 Forbidden | Official public portal not reached; no callable API contract established |
| `https://data.transportation.gov/resource/az4n-8mr2.json?$limit=1` | Proxy CONNECT403 Forbidden | No FMCSA data row or CORS measured |
| `https://data.transportation.gov/api/views/az4n-8mr2.json` | Proxy CONNECT403 Forbidden | Dataset schema not inspected |

An initial unverified Texas dataset-ID probe was also blocked. It is intentionally excluded from any adapter configuration because a guessed identifier is not an official contract.

The root saved draft domain additions for `api.census.gov`, `api.usaspending.gov`, `data.austintexas.gov`, `data.texas.gov`, `data.transportation.gov` and `www.tdlr.texas.gov`. Saving a draft alone does not apply runtime access or prove a successful connection. Austin/Texas/DOT metadata probes after the draft save still returned the same proxy denial. Retry only after a meaningful runtime update or new diagnosis; do not fabricate a fresh retrieval.

CORS is **unmeasured** for all blocked endpoints. Public HTTPS availability and browser CORS are different checks. The extension may use narrow approved host permissions; portable HTML must pass real browser CORS/CSP checks rather than depend on a hidden proxy.

## Authoritative API protocol evidence

Native read-only Git access successfully retrieved the official Socrata JavaScript client:

- Repository: <https://github.com/socrata/soda-js>
- Inspected commit: `d6d528c919b6586abe211fdc8924af439677c830`
- Temporary research checkout: `/tmp/latimus-soda-js` (not an application dependency).
- `README.textile` documents consumer queries using dataset IDs, limit, where and order.
- `lib/soda-js.js` lines435–449 constructs HTTPS GET `/resource/<dataset-id>.json` and `$`-prefixed query parameters.
- Lines180–193 use HTTPS and add `X-App-Token` only when supplied. Basic/OAuth credentials are optional client configuration, not required merely to construct a public read.
- The SDK references official API documentation at <https://dev.socrata.com/>. That documentation domain was not fetched during this restricted-network research.

This confirms the SODA request pattern and optional application-token support. It does **not** confirm that a particular dataset remains available, uses any listed field names, permits bulk automated use, or supplies permissive CORS.

## Priority connector candidates

### Austin issued construction permits — public municipal source

Candidate dataset page: <https://data.austintexas.gov/Building-and-Development/Issued-Construction-Permits/3syk-w9eu>

Candidate direct data endpoint: `https://data.austintexas.gov/resource/3syk-w9eu.json`

Metadata endpoint to verify first: `https://data.austintexas.gov/api/views/3syk-w9eu.json`

The dataset identifier is a known candidate, **not live-confirmed in this environment**. A bounded first test should request `$limit=1`; inspect metadata and actual response before selecting columns or adding a date filter. Avoid unbounded dataset export.

Prospective mapping, pending actual metadata/response verification:

| Possible source field | Intended meaning if confirmed | Required handling |
|---|---|---|
| `permit_num` | Public permit/event identifier | Required stable string; reject records without an identifier |
| `issueddate` | Permit issuance date | Parse explicitly; retain timestamp/raw value; never substitute retrieval date |
| `project_name` / `description` | Observed public project facts | Treat as untrusted data; do not execute source text |
| `contractor_company_name` | Listed contractor business | Contractor is not necessarily owner, applicant, developer or intended client |
| `total_job_valuation` | Declared project valuation | Keep source unit/field; do not imply contractor revenue, funding or verified project economics |
| `original_address1`, `original_city`, `original_zip` | Public project location | Preserve project geography, distinguish company headquarters |
| `permit_type_desc` | Source-defined permit category | Filter actual relevant permit categories only after inspecting metadata |

These names are candidate mappings from prior platform familiarity and **must not be represented as retrieved schema evidence**. A robust adapter should fail visibly on changed/missing schema rather than produce synthetic fields.

Suggested safe processing: GET a small bounded page from the fixed official host → validate required fields → record exact request URL, retrieval time, dataset identity and row/event identifier → retain relevant public raw fields/hash → normalize the explicitly listed business entity and its source role → create an unreviewed signal → require human review and normal qualification gates. A successful pull must not auto-mark evidence verified or auto-send outreach.

### FMCSA Company Census — official transportation source

Candidate dataset page: <https://data.transportation.gov/Trucking-and-Motorcoaches/Company-Census-File/az4n-8mr2>

Candidate endpoint: `https://data.transportation.gov/resource/az4n-8mr2.json`

Metadata endpoint: `https://data.transportation.gov/api/views/az4n-8mr2.json`

Dataset identity, availability, exact fields and CORS remain unverified because the requests were blocked. The eventual adapter should use an official USDOT number and explicit source schema for company identity, public operating status, power units and source snapshot/update dates. Do not harvest personal contact details unnecessarily.

**A census snapshot is not a fleet-expansion event.** A fleet-change signal requires a persisted earlier snapshot for the same USDOT identifier, a current snapshot/date and a documented comparison. First retrieval can establish baseline records; it cannot establish growth. A new-authority trigger requires actual authority/start-date evidence, not an arbitrary recent import timestamp. No guessed field names are approved as verified schema in this research.

### TDLR TABS — official capital-project registrations

Official public search entry: <https://www.tdlr.texas.gov/TABS/Search>

The public TDLR portal is a research source, but no stable public machine-readable endpoint or dataset ID has been verified here. Discover a documented official feed/download or state open-data publication before implementing retrieval. Do not invent API paths, scrape hidden/private records, bypass session controls, or treat accessibility registrations as municipal construction permit issuance.

TDLR accessibility project registrations and city permit records may describe the same project but represent different events and parties. Preserve the source/event type, dates, project identifier and owner/design/contractor roles. Corroboration across sources should attach evidence to a normalized event only with adequate identity confidence.

## Full specification source inventory

This inventory preserves the directive's scope while distinguishing available retrieval contracts from research work. `Research required` means no live adapter or contract was proven by this document; it does not silently substitute a manual-only claim for automatic retrieval.

| Source family / official authority | Public entry or documentation destination | Correct source semantics and automatic-retrieval work |
|---|---|---|
| U.S. Census County Business Patterns | <https://www.census.gov/programs-surveys/cbp/data/api.html> / `api.census.gov` | Market baseline, not company-specific expansion. Root investigates documented API variables, year and geography. |
| BLS QCEW | <https://www.bls.gov/cew/> | Establishment/employment/payroll baseline; use official downloadable/API publications with period/unit provenance. Research required. |
| TDLR TABS | <https://www.tdlr.texas.gov/TABS/Search> | Architectural-barrier project registrations; documented official dataset/feed discovery required. |
| Municipal permit portals | Austin candidate above; other city official portals separately | Real public permit events; each city needs schema/license/cadence and connector acceptance. |
| Economic-development / project announcements | The relevant official agency/company publication | First-party announcements; extract actual party/date/event and preserve observed versus inferred need. Research required per publisher. |
| County appraisal districts | Relevant official county appraisal authority | Ownership/assessment snapshots; no ownership-change signal from a single undated row. County-specific research required. |
| County clerk deeds/liens/property records | Relevant official county clerk | Official recorded instruments; access/terms and provenance vary. No access-control bypass. Research required. |
| Commercial listing/market providers | Explicitly approved provider only | May require licensing/payment. No credential, paid subscription or access assumed. |
| SAM.gov | <https://sam.gov/> / <https://open.gsa.gov/api/> | Opportunity/award APIs may require owner API key. Distinguish procurement notice, award and actual private awardee. Root adds a real contract/test before enabled status. |
| Federal award data / USAspending | <https://api.usaspending.gov/> | Official award data; root investigates documented bounded search. Government agency is not automatically the client; recipient/awardee is separate. |
| Texas procurement/awards | <https://www.txsmartbuy.gov/> / official state award authorities | Public procurement notices and awards; contract/schema discovery required. |
| SEC EDGAR / Form D / 8-K / 10-Q / 10-K | <https://www.sec.gov/edgar/sec-api-documentation> / <https://data.sec.gov/> | Official filings; comply with SEC access/user-agent policies. File date is not every underlying event date. Form D reporting is not proof of completed funding. Research required. |
| Funding/transaction/refinancing announcements | Official company investor-relations/filing source | Tier B first-party statement or Tier A filing; no invented amount or completion. Research required per source. |
| WARN notices | Relevant state workforce agency | Actual notice, employer and event date; do not infer all employment reductions from a snapshot. Research required per jurisdiction. |
| Company careers / executive disclosures | Official employer careers/IR/press publication | First-party evidence; job counts alone do not prove net employment growth. Research required per publisher. |
| FMCSA / SAFER / authority records | <https://data.transportation.gov/> / <https://safer.fmcsa.dot.gov/> | Census baseline, operating authority and actual changes are separate. Validate the official public dataset/API and avoid unnecessary personal fields. |
| Railroad Commission of Texas | <https://www.rrc.texas.gov/> | Actual public permit/regulatory/project publications; endpoint/schema and legally supported method require research. |
| ERCOT / public large-load and project data | <https://www.ercot.com/> | Preserve study/queue status versus approval/construction/operating status; only approved public data. Research required. |
| Utility/interconnection/regulatory data | The relevant official utility/regulator | Source-specific public process/status; endpoint discovery, access and constraints required. |
| Company websites / investor relations | Explicit company domain | First-party corroboration. A website URL alone is not retrieval or verification. |
| Reputable news/trade | Relevant approved publication | Tier C secondary, subject to terms. Corroborate material claims, no subscription bypass. |
| Reviews/social/aggregators | Approved public discovery source only | Tier D discovery; never sole executive-outreach justification. |

## Acceptance before enabling a live adapter

1. Confirm the official dataset/endpoint and terms, then validate actual schema and bounded request response.
2. Test direct browser retrieval in the distribution claiming support, including permissions, CORS and CSP. Never add a generic fetch-anything bridge or hidden proxy.
3. Preserve source/event/publication/retrieval dates independently; missing values are unknown, not today's date or zero.
4. Keep an ingestion run with inspected/accepted/rejected/duplicate counts, source request/reference, errors and timestamp. Store raw relevant provenance/hash within capacity.
5. Do not mark data verified solely because retrieval succeeded. Run normalization, dedup, human review and evidence/EOS gates before commercial pursuit.
6. Exercise retries, rate limits, schema changes, empty responses and outages. Fail visibly and preserve prior records; never refresh timestamps on a failed pull.
7. Register cadence only for browser-open/unlocked execution unless a real background mechanism is separately implemented and tested.

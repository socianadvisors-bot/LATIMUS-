# Source retrieval — version 0.2

The original sourcing requirement includes21 trigger families. This release does **not** satisfy all21. The owner has temporarily deferred real-estate-specific data: county deed/CAD ownership and property acquisition, vacancy/listing/broker data, and private deed-of-trust refinancing feeds. Construction/facility permits and SEC debt/refinancing signals remain required. The complete acceptance ledger is `TRIGGER_SOURCE_ACCEPTANCE.md`.

## Implemented code

Three fixed public-source adapters have been implemented:

| Adapter | Data returned | Boundary |
|---|---|---|
| USAspending | Bounded federal prime contract search by state, time window and keyword, including recipient, amount, agency, obligation dates and references | Awardee is distinct from agency; date window may include activity on existing contracts; no automatic claim of a new award or qualified opportunity |
| Austin permits | Metadata-validated, bounded public issued-permit records from candidate dataset3syk-w9eu | Austin only; exact live metadata still unverified; contractor is not automatically owner or intended client; permit date is preserved |
| Census CBP | Annual state/NAICS establishment, employment and payroll baseline | Aggregate statistics, not company events; payroll units are thousands of dollars; suppression flags retained; released2023+ year needed |

Implementation means code exists and controlled fixtures pass. It does **not** mean official endpoint schema, current availability, CORS, data completeness or extension-origin access has passed a live test. All live checks are currently blocked by the cloud egress proxy before reaching these services.

In Sources, choose Configure source, save public query filters, then Pull now. In an extension, explicitly grant the selected source's optional host access. Portable mode attempts normal direct browser requests and may be blocked by the source's CORS policy. No hidden proxy/server is supplied. For browsers without supported access, manual import remains available but does not satisfy the outstanding live-adapter requirement.

## Receipt and failure semantics

Every accepted pull stores query filters, attempt/completion timestamps, count, normalized public fields, exact request URL, SHA-256 of the returned JSON, truncated-page warning and either success or failure. The latest successful snapshot survives failures; only the latest failure and good snapshot are retained per source. This is bounded snapshot retention, not an exhaustive ingestion archive. Request URL plus saved filters preserve the USAspending POST query parameters.

No source outage, timeout, invalid JSON, schema change, HTTP error or quota failure fabricates fresh records. Empty successful results replace prior success with a true zero result. Changing state/date filters marks the current query unverified; historical data retains its old filters. Imports and source content cannot change policy or approve actions.

Pulled facts are staged for review. This version does not automatically infer needs, classify all required trigger types, score companies, verify contacts or start outreach. The original prompt requires those downstream functions; the new21-row ledger explicitly keeps them open.

## External blocker

Actual requests returned `Tunnel connection failed:403 Forbidden` at the cloud egress proxy. Six narrowly scoped domains were saved in the environment configuration draft:

- api.census.gov
- api.usaspending.gov
- data.austintexas.gov
- data.texas.gov
- data.transportation.gov
- www.tdlr.texas.gov

The last four support official metadata/TDLR/FMCSA research as well as the Austin adapter. A successful draft save does not apply runtime networking. Review and save the network changes in environment settings to unblock official endpoint verification. Publish only after validation to snapshot the configured environment. This runtime blocker is separate from source-side credentials/CORS and does not prove those services are broken. No API-key value is requested in chat; no credential is currently required by the three coded bounded public requests.

## Tests

- Unit fixtures exercise contract request filters, private awardee identity, date semantics, Socrata metadata fields, Census suppression/units, schema/HTTP/CORS-style failures, zero records, stream capacity, latest-good retention, stale-filter rejection and old-vault additive compatibility.
- Browser fixtures intercept actual requests to test the fetch→parse→encrypted receipt→UI path and visible stale/error state. Those fixtures are explicitly labeled test data and are **not live-source evidence**.
- Original local workspace, finance, approvals, PMO, backup and offline workflows remain covered.
- Source-side CORS, actual endpoint responses, extension permission behavior and all remaining trigger adapters/detectors still need acceptance. See `docs/ACCEPTANCE.md` and `docs/SOURCE_RESEARCH.md`.

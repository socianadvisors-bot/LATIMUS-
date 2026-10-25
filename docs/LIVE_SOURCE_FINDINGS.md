# Live official source findings

Validated October 24, 2026 (America/Chicago). The network configuration now permits the official Austin, TDLR and USDOT hosts. Earlier proxy CONNECT 403 findings in `SOURCE_RESEARCH.md` are historical; they must not be repeated as the current result for the successful requests below. HTTPS certificate verification and the platform proxy remained enabled. No credentials, personal contact fields or private records were used.

## City of Austin issued construction permits

**Metadata retrieval: live successful.**

- GET `https://data.austintexas.gov/api/views/3syk-w9eu.json`
- HTTP 200, `application/json; charset=utf-8`, `Access-Control-Allow-Origin: *`.
- 132,722 response bytes read.
- ID `3syk-w9eu`; name **Issued Construction Permits**; provenance `official`; attribution **City of Austin, Texas - data.austintexas.gov**.
- Description explicitly covers building, electrical, mechanical, plumbing and driveway/sidewalk permits. The city's published disclaimer says informational data may differ from official department data and continuously updated reports may change. It links its open-data terms at `https://data.austintexas.gov/stories/s/ranj-cccq`.

Actual field names verified from the returned metadata:

| Actual API field | Published label / meaning | Adapter implication |
|---|---|---|
| `permit_number` | Permit Num | Stable permit identifier; the live field is not `permit_num` |
| `issue_date` | Issued Date; calendar date | Use for issue-window filters/order; the live field is not `issueddate` |
| `applieddate` | Applied Date | Separate application date from issue/event date |
| `permit_location` | Project Name | The live project-name field is not `project_name` |
| `permittype` | Permit Type | Source type code; preserve rather than infer |
| `permit_type_desc` | Permit Type Desc | Human-readable permit category |
| `permit_class_mapped`, `permit_class` | Class/category | Commercial versus residential filtering must use source categories |
| `work_class` | Work Class | New work, remodel and other classifications are distinct |
| `description` | Description | Untrusted observed public source text |
| `contractor_company_name` | Contractor Company Name | Contractor is not automatically owner/developer/intended client |
| `applicant_org` | Applicant Organization | Applicant identity is separate from owner and contractor |
| `project_id`, `masterpermitnum` | Project ID / Master Permit Num | Potential related-record grouping identifiers; require normalization rules |
| `total_job_valuation` | Total Job Valuation | May be missing; unknown is not zero or verified company revenue |
| `original_address1`, `original_city`, `original_state`, `original_zip` | Project geography | Differentiate project location from company headquarters; collect only necessary data |
| `status_current`, `statusdate`, `expiresdate`, `completed_date` | Permit lifecycle | Do not treat cancelled/expired/completed events as a fresh expansion |

Actual metadata also includes `:@computed_region_*` fields. Ignoring those internal/computed names while validating known public query columns is necessary; rejecting the whole metadata response would break retrieval.

**Bounded record query: live successful.**

```text
GET https://data.austintexas.gov/resource/3syk-w9eu.json
$limit=2
$order=issue_date DESC
$where=permit_class_mapped='Commercial'
$select=permit_number,issue_date,permit_class_mapped,work_class,permit_type_desc,total_job_valuation,project_id
```

HTTP 200, `application/json;charset=utf-8`, CORS `*`, 389 bytes. Two public commercial building-permit rows were returned, each issued 2026-10-23, both `work_class=Remodel`. Neither included `total_job_valuation` in this response. This is evidence of working raw retrieval and of the need for classification: **a commercial remodel permit does not establish a new-construction or facility-expansion event**.

The request sent an `Origin: http://localhost:5173` header and received CORS `*`. This verifies service response headers, not actual packaged-browser execution; root must exercise the built application separately. The default code already recognizes `permit_number` and `issue_date` fallbacks. Sanitized nonpersonal live response/schema evidence is saved in `tests/livefixtures/austin-sanitized.json`.

## FMCSA Company Census

**Official metadata and one-row baseline query: live successful.**

- GET `https://data.transportation.gov/api/views/az4n-8mr2.json`: HTTP 200 JSON, CORS `*`, 197,097 bytes.
- Dataset **Company Census File**, provenance `official`.
- Description says it contains active, inactive and pending FMCSA entities and identifies each with its USDOT number.

Verified public fields include:

- `dot_number` (number): stable USDOT identifier.
- `legal_name`, `dba_name`: business identity.
- `status_code`, `carrier_operation`: source status/operation codes requiring documented interpretation.
- `power_units`, `truck_units`, `total_drivers`, `fleetsize`: text fields, not guaranteed clean numeric measurements.
- `mcs150_date`, `add_date`: text dates; the observed `add_date` format was `YYYYMMDD`.
- `phy_state`, `phy_city`: business geography.

A bounded request deliberately excluded company/person names, street addresses, officers, phone, email and other unnecessary fields:

```text
GET https://data.transportation.gov/resource/az4n-8mr2.json
$limit=1
$where=phy_state='TX'
$select=dot_number,status_code,power_units,mcs150_date,add_date,phy_state
```

HTTP 200 JSON, CORS `*`, 101 bytes. The returned entity had status code `I`, zero power units, an old add date, and no `mcs150_date` value. These are raw source facts; the status code needs official dictionary interpretation, missing date is unknown, and zero is an actual returned value rather than a plug.

This proves that a free official bounded census read is technically available. **No FMCSA adapter or fleet-change detector has been implemented merely by this research.** Fleet expansion still requires dated comparable prior/current snapshots for the same USDOT identifier. An add/import date is not proof of newly granted operating authority.

## TDLR TABS project search

Two small read-only requests were made, both through links in the actual public page. Neither required authentication or access-control bypass.

1. GET `https://www.tdlr.texas.gov/TABS/Search`: HTTP 200 HTML; title **TDLR TABS - Project Search**; 145,659 bytes. No `Access-Control-Allow-Origin` header.
2. GET its linked bundle `/TABS/bundles/projectSearchJs?v=K6niDxqJTOspxbTSrkXoDjPlGmp243mLa3qziQlcqx81`: HTTP 200 JavaScript; 6,592 bytes. No CORS header.

The actual public page exposes:

- Search route `/TABS/Search/SearchProjects`.
- Project link route `/TABS/Search/Project/<ProjectNumber>`.
- The bundled UI sends a **POST** through jQuery DataTables server-side processing. It is a public UI search contract; it has not been established as a stable documented API.
- UI page-size options 10/25/50/100; default 10; default sort on column 3 (`ProjectCreatedOn`) descending.
- Filters `ProjectName`, `ProjectNumber`, `ProjectStatus`, `DateBegin`, `DateEnd`, `RegistrationDateBegin`, `RegistrationDateEnd`, `OwnerName`, `FacilityName`, `ArchitectName`, `LocationAddress`, `LocationCity`, `LocationCounty`, `RASNumber`, `DataVersionId`.
- Datepicker format `mm/dd/yy`; the page labels registration dates separately from estimated dates.
- Version mapping `900001` for TABS, `900002` for EABPRJ.
- DataTables output field mapping: `ProjectId`, `ProjectNumber`, `ProjectName`, `ProjectCreatedOn`, `ProjectStatus`, `FacilityName`, `City`, `County`, `TypeOfWork`, `EstimatedCost`, `DataVersionId`.
- City/county fields map through `Lookup.CITIES` / `Lookup.COUNTIES` in the public page rather than assuming numeric IDs are readable place names.
- Work codes: 9001 New Construction; 9002 Renovation/Alteration; 9003 Additions to Existing Building; 9004 Historic Preservation; 9005 Public Right of Way.
- Status examples: 3008 Project Registered; 3007 Project Closed; 3009 Review Complete; 3001 Inspection Completed. These lifecycle states must remain distinct.

No search POST or project-data response was tested in this bounded research. The next justified check is a tiny public search using the same UI parameters (`draw`, `start=0`, bounded `length`, `columns[...]`, `order[...]` and explicit registration date window), then validate its JSON shape and access/terms before implementing an adapter. That would be a third TDLR request and is left for root's next useful action.

Absence of CORS on the HTML/bundle does not prove the search POST's CORS behavior. Portable-file retrieval may be unsupported; a narrowly permissioned extension can be evaluated without introducing a proxy. Public-page reachability is not itself proof of data retrieval or detector completion.

## Scope and claims

- Real-estate-only feeds remain deferred by owner. This does not defer Austin/municipal construction permits, TDLR project registrations, facility events, FMCSA or energy.
- Research requests establish exactly the responses recorded above; they do not establish 19 active trigger detectors, a full intelligence pipeline, auto-enrichment or authorized outreach.
- Preserve the original 21-row acceptance ledger. Retrofit live evidence to actual adapter/detector rows only after the application itself succeeds.
- New source data must retain unknown/missing fields, source party roles and actual event dates. It must not auto-mark evidence verified or treat every source row as a qualified lead.

## FMCSA adapter implementation after live schema research

`src/domain/fmcsa.ts` now implements a pure bounded request builder and response parser for the verified Company Census endpoint. It requests only nine public business/operating fields, accepts an optional exact numeric USDOT filter, and retains unknown/missing dates without substituting census-added dates for authority issuance. Public carrier snapshots are not automatically signals or qualified opportunities.

`compareFleetSnapshots` compares two successful chronological snapshots from the same configured source/query scope and matching USDOT identifier. Both reported power-unit counts must be unambiguous positive safe integers; zero, missing, suppressed, negative, fractional or unsafe values produce no inferred change. A first baseline produces no expansion. Nonzero increases and decreases are descriptive snapshot differences, explicitly subject to reporting-age/correction caveats and independent evidence review.

Seven focused unit tests exercise fixed endpoint/field selection, filter validation, unknown-date semantics, duplicate identity rejection, baseline/chronology/scope controls, invalid counts and decreases. Root integration must separately register and exercise this adapter in actual application distributions; pure function/fixture success alone is not app-level live retrieval evidence.

The already retrieved publication metadata also identifies Austin as a published official tabular dataset with license `USGOV_WORKS` / “Public Domain U.S. Government” and a city publishing cadence of Daily. FMCSA metadata identifies a published official tabular dataset, publisher “Federal Motor Carrier Safety Administration,” and rights “public”; no explicit `licenseId` was supplied. These are actual source metadata, not a guarantee of service availability or permission to disregard host-specific terms/rate limits. Bounded anonymous public reads were used; no paid provider or private access was involved.

## Root implementation validation

The actual application adapter runner subsequently passed4bounded official API calls: USAspending, Austin, TDLR and FMCSA,2records each. TDLR form POST works without extra AJAX/Origin/Referer headers. Receipts/hashes are summarized in live-api-evidence.json. USAspending's documented new_awards_only filter returned base dates within the selected interval; its earlier default query incorrectly included old-contract activity and was corrected.

Census variables metadata showsNAICS2017 for2023, notNAICS2022. Actual no-key CBP data requests redirect to official missing_key.html; a real free key is required. Adapter now discovers classification from metadata and accepts a transient, redacted key. Census data remains credential-pending.

Native Node checks require NODE_USE_ENV_PROXY=1 to use the provided environment HTTPS proxy; otherwise DNS fetch fails. This is test initialization, not a hidden product service. Live browser calls remain blocked by cloud Chromium's certificate trust error even after provided public CA import into its newer NSS store. No TLS checks were disabled. Browser CORS/extension acceptance is separate from the successful native API tests.

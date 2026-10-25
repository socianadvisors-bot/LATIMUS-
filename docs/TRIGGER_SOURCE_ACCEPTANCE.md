# Trigger-source acceptance boundary

The user requires all21 original trigger families, not a three-API substitute. The subsequent owner instruction permits excluding real-estate data **for now**: retain21 requirements in this ledger, with19 active and2 temporarily deferred (property acquisition and vacancy/distress). County deeds, appraisal/CAD, ownership/listing/broker feeds and private property deed-of-trust refinancing data are also deferred. Construction permits, TDLR, new facilities, energy projects and SEC/public corporate debt refinancing remain active. The original specification is preserved.

This is a requirements ledger, not functioning detection. **Zero full automatic trigger detectors are implemented or live-validated.** Austin and USAspending have bounded raw-retrieval adapters coded and fixture-tested; they do not complete permit or award detection. Census CBP contributes an aggregate market baseline and covers none of the21 direct company triggers. Actual live source tests in this cloud machine remain blocked by proxy CONNECT403, before the official services respond; fixture success is not live evidence.

The first three requirement columns below preserve the user's supplied21-row trigger / primary method / data-quality table exactly, including its coverage limitations. The quality column describes the user's expected source quality, **not measured quality of a working LATIMUS adapter**. The later owner deferral changes current scope, not the original table.

| ID | Trigger | Primary method (user table) | Data quality (user table) | Current status | Adapter contribution / unfinished acceptance |
|---|---|---|---|---|---|
| T01 | New construction permit | TDLR TABS + municipal permit/application feeds | Excellent | Partial retrieval; detection not implemented | austin-permits. Austin raw retrieval is coded/fixture-tested only. TDLR, other municipalities, project normalization, permit classification and live evidence remain unfinished. |
| T02 | Major property acquisition | County clerk deed records + CAD owner changes | Excellent, but county-by-county | Deferred by owner | None. Temporarily excluded real-estate data: county deeds, appraisal/ownership and listing acquisition feeds. Original requirement retained. |
| T03 | Government contract award | Federal contract awards + Texas state award/contract systems | Excellent | Partial retrieval; detection not implemented | usaspending-awards. Federal raw contract retrieval is coded/fixture-tested only. New-award detection, full award coverage, recipient normalization and live evidence remain unfinished. |
| T04 | Large RFP won | Award notices + procurement portals + company announcements | Excellent/Good | Not implemented | None. Documented source adapters, won-award event classification, company attribution and live acceptance required; no inferred win from an RFP. |
| T05 | Acquisition announced | SEC filings for public companies + company announcements + credible news | Excellent/Good | Not implemented | None. SEC/issuer adapters, transaction extraction, target/acquirer identity and live evidence required. |
| T06 | New funding | SEC Form D + company announcement | Excellent where Form D applies | Not implemented | None. Compliant SEC/issuer retrieval, structured funding interpretation and live evidence required; no private financial fabrication. |
| T07 | New facility | TDLR + city permits + economic-development announcements | Excellent | Not implemented | None. Company-specific facility event detection and multi-source project normalization remain absent; raw permit retrieval alone does not complete this trigger. |
| T08 | 20+ new jobs | Company careers pages + public job listings | Good; count can fluctuate | Not implemented | None. Approved publisher adapters, deduped job-count evidence, baseline comparison and live acceptance required. |
| T09 | CFO/COO hired | SEC 8-K for public companies + corporate announcements | Excellent/Good | Not implemented | None. Leadership source retrieval and appointment/person/company resolution detectors required. |
| T10 | CFO/COO departed | Same | Excellent/Good | Not implemented | None. Leadership departure retrieval, role resolution and live acceptance required. |
| T11 | Revenue declining | 10-Q/10-K/earnings for public firms | Excellent public / weak private | Not implemented | None. Source-linked financial period extraction, comparability/reconciliation and decline detector required; no guessed private revenue. |
| T12 | Rapid revenue growth | Financial filings + funding + hiring/facility proxies | Excellent public / moderate private | Not implemented | None. Public/authorized data adapters and deterministic comparable-period growth detection required. |
| T13 | Lawsuit/compliance | Court/regulatory/enforcement records | Good, requires qualification | Not implemented | None. Approved jurisdiction-specific access, entity resolution, status classification and live evidence required; no private docket bypass. |
| T14 | Negative reviews | Public customer-review sources | Secondary validation only | Not implemented | None. Approved source access, pattern/baseline logic and primary/independent corroboration required; never auto-qualify solely from reviews. |
| T15 | Supply-chain disruption | Filings, corporate statements, shutdown notices, supplier events | Good public / difficult private | Not implemented | None. Approved notice/issuer adapters, entity-impact matching, corroboration and live detector tests required. |
| T16 | Fleet expansion | FMCSA fleet/power-unit changes over time | Very good | Not implemented | None. Official dataset schema/access, retained prior baseline, comparable power-unit/fleet changes and live evidence required. |
| T17 | New DOT authority | FMCSA registration/authority data | Excellent | Not implemented | None. Official authority adapter, status/effective-date extraction, stable identifier matching and live tests required. |
| T18 | Data center / energy project | TDLR + ERCOT + RRC + permitting | Excellent in Texas | Not implemented | None. Public energy/project adapters, cross-source project normalization, consequence routing and live detection evidence required. |
| T19 | Commercial property vacancy | Property listings + owner/property-manager research + broker data | Weak free statewide coverage | Deferred by owner | None. Temporarily excluded real-estate data, including vacancy, listing/broker and property-operation feeds. Original requirement retained. |
| T20 | Refinance/maturity | SEC debt disclosures + county deed-of-trust records | Excellent public / fragmented private | Not implemented | None. SEC/public-corporate-debt/refinancing detection remains active scope. County deeds/CAD/private property-finance component is deferred by owner; no universal county API claimed. |
| T21 | Owner nearing exit | Succession announcements, business-sale signals, long ownership tenure, M&A activity | No reliable direct free signal | Not implemented | None. Evidence-backed issuer/owner sources, explicit inference/review controls and live acceptance required; succession or exit intent must not be invented. |

## Interpretation safeguards

- T01: Primary public records; distinguish registration, application and issued permit; preserve project and party identifiers.
- T02: County-specific ownership/recording evidence; a changed appraisal row alone is not verified acquisition.
- T03: Official award/obligation data; private recipient is distinct from agency, and obligation date is not publication or necessarily new award.
- T04: Differentiate an open RFP, bid submission, preferred bidder and actual won award; corroborate material claims.
- T05: Announced, signed and closed transactions are distinct; preserve parties, status and announcement date.
- T06: A Form D notice or intended offering does not prove funding received; distinguish offered/sold amounts and event status.
- T07: Separate plan/registration/permit from construction/opening; confirm company role and actual expansion.
- T08: Published postings are not necessarily net jobs added; establish baseline, location, timeframe and observed versus inferred growth.
- T09: First-party dated appointment evidence; confirm role, employer, effective date and announced versus effective status.
- T10: Do not infer departure from an absent profile or vacancy; require explicit dated evidence.
- T11: Comparable period/unit/currency and restatements matter. Private revenue is unknown absent authorized evidence.
- T12: Verify comparable actual periods and units; announcements/projections are not recognized historical revenue.
- T13: Allegations, investigations, findings and resolved matters are different statuses; preserve dates and jurisdiction.
- T14: Discovery/secondary only; deduplicate and contextualize complaints. Tier D alone cannot justify executive outreach.
- T15: Distinguish industry-wide risk from a verified company-specific impact; preserve source/event dates and uncertainty.
- T16: A single snapshot is a baseline, not expansion. Compare dated records for the same USDOT/company identifier.
- T17: Authority issuance/effective date is distinct from census update/import date; verify carrier identity and authority status.
- T18: Queue/study/registration/permit/approval/construction/operation are distinct; preserve status and project/company roles.
- T19: Distinguish advertised space from actual vacancy and verified distress; retain reporting date, property identity and licensed terms.
- T20: Retain actual maturity/transaction dates, terms and issuer identity; no inferred private debt or fabricated financing completion.
- T21: No reliable universal free feed for probable private-company exit. Age, rumor or missing profiles do not establish intent.

## Completion gate for each active trigger

A row remains unfinished until its documented approved source can actually be retrieved in a claimed distribution, schema/provenance is validated, a real event detector is implemented, entity/event deduplication and evidence qualification work, and live acceptance evidence is recorded. Tests must distinguish the event from a baseline or an inferred hypothesis. An external access/credential/provider requirement is an explicit blocker, not evidence of implementation.

- No universal county API, private revenue dataset, reliable private-owner-exit feed or paid license is assumed.
- A retrieval success is not evidence verification, opportunity qualification or permission to contact anyone.
- Multi-source evidence should consolidate one underlying event; cross-sector routing must not multiply leads.
- Reviews remain secondary/discovery material. Fleet expansion requires a prior comparable snapshot.
- Record event/publication/retrieval time separately, along with actual party roles, source limitations and uncertainty.
- All active rows need source outage, stale/contradicted evidence and false-positive evaluations.
- No external send or material commitment follows automatically from a trigger.

`src/domain/triggerCoverage.ts` supplies this same visible requirements catalog for the Sources UI. Its presence does not implement these detectors. Re-enable the deferred rows/components only when the owner restores that scope; do not delete the original requirements.

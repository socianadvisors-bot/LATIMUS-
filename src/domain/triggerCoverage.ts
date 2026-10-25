/** Requirements ledger only: rows are not automatic trigger detectors or live-source proof. */
export interface TriggerCoverage {id:string;trigger:string;methods:string;quality:string;adapterIds:string[];status:string;gap:string}
export const TRIGGER_COVERAGE:TriggerCoverage[] = [
  {
    "id": "T01",
    "trigger": "New construction permit",
    "methods": "TDLR TABS + municipal permit/application feeds",
    "quality": "Excellent",
    "adapterIds": [
      "austin-permits", "tdlr-projects"
    ],
    "status": "Partial retrieval; detection not implemented",
    "gap": "Austin permits and TDLR public projects returned real records through the live API runner. Browser distribution acceptance, other municipalities, project/company normalization and full trigger qualification remain unfinished."
  },
  {
    "id": "T02",
    "trigger": "Major property acquisition",
    "methods": "County clerk deed records + CAD owner changes",
    "quality": "Excellent, but county-by-county",
    "adapterIds": [],
    "status": "Deferred by owner",
    "gap": "Temporarily excluded real-estate data: county deeds, appraisal/ownership and listing acquisition feeds. Original requirement retained."
  },
  {
    "id": "T03",
    "trigger": "Government contract award",
    "methods": "Federal contract awards + Texas state award/contract systems",
    "quality": "Excellent",
    "adapterIds": [
      "usaspending-awards"
    ],
    "status": "Partial retrieval; detection not implemented",
    "gap": "Official federal retrieval passed live API checks with new_awards_only date filtering. Texas state awards, recipient/need qualification and end-to-end browser acceptance remain unfinished."
  },
  {
    "id": "T04",
    "trigger": "Large RFP won",
    "methods": "Award notices + procurement portals + company announcements",
    "quality": "Excellent/Good",
    "adapterIds": [],
    "status": "Not implemented",
    "gap": "Documented source adapters, won-award event classification, company attribution and live acceptance required; no inferred win from an RFP."
  },
  {
    "id": "T05",
    "trigger": "Acquisition announced",
    "methods": "SEC filings for public companies + company announcements + credible news",
    "quality": "Excellent/Good",
    "adapterIds": [],
    "status": "Not implemented",
    "gap": "SEC/issuer adapters, transaction extraction, target/acquirer identity and live evidence required."
  },
  {
    "id": "T06",
    "trigger": "New funding",
    "methods": "SEC Form D + company announcement",
    "quality": "Excellent where Form D applies",
    "adapterIds": [],
    "status": "Not implemented",
    "gap": "Compliant SEC/issuer retrieval, structured funding interpretation and live evidence required; no private financial fabrication."
  },
  {
    "id": "T07",
    "trigger": "New facility",
    "methods": "TDLR + city permits + economic-development announcements",
    "quality": "Excellent",
    "adapterIds": [],
    "status": "Not implemented",
    "gap": "TDLR and Austin live APIs provide project records; company-specific new-facility event detection and multi-source normalization remain unfinished. A registration is not proof of opening or expansion."
  },
  {
    "id": "T08",
    "trigger": "20+ new jobs",
    "methods": "Company careers pages + public job listings",
    "quality": "Good; count can fluctuate",
    "adapterIds": [],
    "status": "Not implemented",
    "gap": "Approved publisher adapters, deduped job-count evidence, baseline comparison and live acceptance required."
  },
  {
    "id": "T09",
    "trigger": "CFO/COO hired",
    "methods": "SEC 8-K for public companies + corporate announcements",
    "quality": "Excellent/Good",
    "adapterIds": [],
    "status": "Not implemented",
    "gap": "Leadership source retrieval and appointment/person/company resolution detectors required."
  },
  {
    "id": "T10",
    "trigger": "CFO/COO departed",
    "methods": "Same",
    "quality": "Excellent/Good",
    "adapterIds": [],
    "status": "Not implemented",
    "gap": "Leadership departure retrieval, role resolution and live acceptance required."
  },
  {
    "id": "T11",
    "trigger": "Revenue declining",
    "methods": "10-Q/10-K/earnings for public firms",
    "quality": "Excellent public / weak private",
    "adapterIds": [],
    "status": "Not implemented",
    "gap": "Source-linked financial period extraction, comparability/reconciliation and decline detector required; no guessed private revenue."
  },
  {
    "id": "T12",
    "trigger": "Rapid revenue growth",
    "methods": "Financial filings + funding + hiring/facility proxies",
    "quality": "Excellent public / moderate private",
    "adapterIds": [],
    "status": "Not implemented",
    "gap": "Public/authorized data adapters and deterministic comparable-period growth detection required."
  },
  {
    "id": "T13",
    "trigger": "Lawsuit/compliance",
    "methods": "Court/regulatory/enforcement records",
    "quality": "Good, requires qualification",
    "adapterIds": [],
    "status": "Not implemented",
    "gap": "Approved jurisdiction-specific access, entity resolution, status classification and live evidence required; no private docket bypass."
  },
  {
    "id": "T14",
    "trigger": "Negative reviews",
    "methods": "Public customer-review sources",
    "quality": "Secondary validation only",
    "adapterIds": [],
    "status": "Not implemented",
    "gap": "Approved source access, pattern/baseline logic and primary/independent corroboration required; never auto-qualify solely from reviews."
  },
  {
    "id": "T15",
    "trigger": "Supply-chain disruption",
    "methods": "Filings, corporate statements, shutdown notices, supplier events",
    "quality": "Good public / difficult private",
    "adapterIds": [],
    "status": "Not implemented",
    "gap": "Approved notice/issuer adapters, entity-impact matching, corroboration and live detector tests required."
  },
  {
    "id": "T16",
    "trigger": "Fleet expansion",
    "methods": "FMCSA fleet/power-unit changes over time",
    "quality": "Very good",
    "adapterIds": [],
    "status": "Not implemented",
    "gap": "FMCSA live census API and retained baseline retrieval work; reported power-unit comparison is fixture-tested. A first snapshot is not expansion; real change validation and full qualification remain unfinished."
  },
  {
    "id": "T17",
    "trigger": "New DOT authority",
    "methods": "FMCSA registration/authority data",
    "quality": "Excellent",
    "adapterIds": [],
    "status": "Not implemented",
    "gap": "Official authority adapter, status/effective-date extraction, stable identifier matching and live tests required."
  },
  {
    "id": "T18",
    "trigger": "Data center / energy project",
    "methods": "TDLR + ERCOT + RRC + permitting",
    "quality": "Excellent in Texas",
    "adapterIds": [],
    "status": "Not implemented",
    "gap": "Public energy/project adapters, cross-source project normalization, consequence routing and live detection evidence required."
  },
  {
    "id": "T19",
    "trigger": "Commercial property vacancy",
    "methods": "Property listings + owner/property-manager research + broker data",
    "quality": "Weak free statewide coverage",
    "adapterIds": [],
    "status": "Deferred by owner",
    "gap": "Temporarily excluded real-estate data, including vacancy, listing/broker and property-operation feeds. Original requirement retained."
  },
  {
    "id": "T20",
    "trigger": "Refinance/maturity",
    "methods": "SEC debt disclosures + county deed-of-trust records",
    "quality": "Excellent public / fragmented private",
    "adapterIds": [],
    "status": "Not implemented",
    "gap": "SEC/public-corporate-debt/refinancing detection remains active scope. County deeds/CAD/private property-finance component is deferred by owner; no universal county API claimed."
  },
  {
    "id": "T21",
    "trigger": "Owner nearing exit",
    "methods": "Succession announcements, business-sale signals, long ownership tenure, M&A activity",
    "quality": "No reliable direct free signal",
    "adapterIds": [],
    "status": "Not implemented",
    "gap": "Evidence-backed issuer/owner sources, explicit inference/review controls and live acceptance required; succession or exit intent must not be invented."
  }
];

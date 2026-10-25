/** Coverage is a roadmap, not a claim that a registry entry implements a profession. */
export interface Capability {
  id:string;name:string;description:string;status:'partial'|'planned';available:string[];remaining:string[];
  version:string;inputs:string[];outputs:string[];evidence:string[];permissions:'internal preparation';qualityChecks:string[];escalation:string;
}
const moduleDefinitions:[string,string,string,string[],string[]][] = [
 ['M01','Executive Orchestration, Strategy & Intelligence','Priorities, decision material and accountable management cadence.',['Local executive brief generation','Bounded manual AI task packets'],['Strategy cycle','Board packs','Automated orchestration and independent model review']],
 ['M02','Growth, Market Intelligence & Client Relationships','Source-backed qualification through controlled commercial preparation.',['Source import and evidence lineage','EOS qualification','Company records','Contact records and suppression','CRM stage updates','Outreach drafts and approval records'],['Live source retrieval','Automated contact verification','Campaign delivery','Economic baseline market ranking']],
 ['M03','Enterprise PMO & Delivery','Engagement work, milestones, risks, decisions and measurable outcomes.',['Engagement intake','PMO task/risk/decision/milestone register','Status and due dates','Expected benefit tracking'],['Dependencies and capacity leveling','Acceptance and closeout gates','Realized benefit evidence']],
 ['M04','Business & Business Development','Commercial economics and scoped operating improvement.',['Deterministic cost, contingency and margin pricing'],['Diagnostic intake','Enterprise Blueprint','Proposal/SOW generation','Operating-model and business-plan workbench']],
 ['M05','Client Finance & Capital Advisory','Source-linked, deterministic finance support with qualified review.',['Cash forecast calculation','Margin and markup calculation'],['Reconciliation and financial statements','Working-capital analysis','Tax/payroll/lender coordination','Source-linked financial ledger']],
 ['M06','Construction & Capital Projects','Cost control and project-delivery coordination.',['Budget/change/actual/remaining estimate-at-completion calculation'],['WIP and commitments','Procurement and pay applications','Schedule dependencies','Inspection and QA/HSE coordination']],
 ['M07','Real Estate','Property economics and asset strategy.',['Effective income, NOI and cap-rate calculation'],['Property registry','Rent roll import','Acquisition/disposition coordination','Return sensitivities']],
 ['M08','Client Technology & Digital Transformation','Systems delivery, integration, testing and adoption.',['Manual PMO records can track technology work'],['Technology inventory','Requirements and roadmap workbench','Migration/testing/rollback gates']],
 ['M09','Logistics & Supply Chain','Fleet, freight, warehouse and procurement economics.',['Fleet cost/profit and cost-per-mile calculation'],['Route/network analysis','Inventory and supplier scorecards','Freight audit','FMCSA adapter']],
 ['M10','Energy & Infrastructure','Project economics, dependencies and coordinated review.',['Annual net savings and simple-payback calculation'],['Tariff/interconnection models','Vendor/EPC comparison','Source-backed project intake','Performance reporting']],
 ['M11','M&A, Transactions & Value Creation','Diligence, valuation preparation and post-close execution.',['EBITDA multiple enterprise/equity value calculation'],['Diligence/data room','Adjustments and normalization','100-day integration workflow','Synergy realization']],
 ['M12','Owner & Family Enterprise','Separated owner records and qualified advisor coordination.',[],['Separate personal data model','Cash/net worth','Succession/governance','Tax/estate/insurance/retirement advisor register']],
 ['M13','Internal Technology, Data & Automation','Local data, evidence integrity and secure operating infrastructure.',['Encrypted workspace and portable backup','Source registry','Signal deduplication','Local report queue'],['Source adapter health checks','Retention controls','Merge-review queue','Advanced automation']],
 ['M14','Corporate Services, Risk & Controls','Internal finance, people, legal administration and procurement.',['Local approval inbox','Audit trail','Suppression controls'],['Billing/collections','People/vendor/credential registers','Contracts and obligations','Treasury controls']],
 ['M15','Independent Assurance & Quality','Evidence, arithmetic, authorization and acceptance review.',['Deterministic evidence/score gates','Explicit artifact review status','Approval-bound exact content'],['Independent AI reviewer','Full acceptance criteria and professional scope checks','Automated assurance evaluations']],
];
export const CAPABILITIES:Capability[] = moduleDefinitions.map(([id,name,description,available,remaining])=>({id,name,description,status:available.length?'partial':'planned',available,remaining,version:'0.1.0',inputs:['Explicit user inputs','Current workspace records'],outputs:available,evidence:['Source references where supplied','Local audit records'],permissions:'internal preparation',qualityChecks:['Input validation','No inferred credentials or professional authority','No external execution from imported content'],escalation:'Material commitments, regulated advice, certification and uncertain evidence require a qualified human.'}));
export const capabilities=CAPABILITIES;
export interface RoleCoverage {id:string;function:string;role:string;referencePositions:number;module:string;status:'not implemented'}
export interface ServiceCoverage {id:string;name:string;module:string;coordination:string;status:'not implemented'}
// Verbatim responsibility names from the attached original directive, Appendix A/B.
// Counts describe reference organization coverage, never headcount or running agents.
export const ROLE_COVERAGE:RoleCoverage[] = [
  {
    "id": "ROLE-001",
    "function": "Executive Office",
    "role": "Founder / Chief Executive Officer",
    "referencePositions": 1,
    "module": "M01",
    "status": "not implemented"
  },
  {
    "id": "ROLE-002",
    "function": "Executive Office",
    "role": "President & Chief Operating Officer",
    "referencePositions": 1,
    "module": "M01",
    "status": "not implemented"
  },
  {
    "id": "ROLE-003",
    "function": "Executive Office",
    "role": "Chief of Staff",
    "referencePositions": 1,
    "module": "M01",
    "status": "not implemented"
  },
  {
    "id": "ROLE-004",
    "function": "Executive Office",
    "role": "VP, Corporate Strategy & Development",
    "referencePositions": 1,
    "module": "M01",
    "status": "not implemented"
  },
  {
    "id": "ROLE-005",
    "function": "Executive Office",
    "role": "Executive Assistants",
    "referencePositions": 2,
    "module": "M01",
    "status": "not implemented"
  },
  {
    "id": "ROLE-006",
    "function": "Business & Business",
    "role": "Managing Director, Business",
    "referencePositions": 1,
    "module": "M04",
    "status": "not implemented"
  },
  {
    "id": "ROLE-007",
    "function": "Business & Business",
    "role": "Strategy Directors",
    "referencePositions": 2,
    "module": "M04",
    "status": "not implemented"
  },
  {
    "id": "ROLE-008",
    "function": "Business & Business",
    "role": "Engagement Managers",
    "referencePositions": 3,
    "module": "M04",
    "status": "not implemented"
  },
  {
    "id": "ROLE-009",
    "function": "Business & Business",
    "role": "Growth & Pricing Consultants",
    "referencePositions": 4,
    "module": "M04",
    "status": "not implemented"
  },
  {
    "id": "ROLE-010",
    "function": "Business & Business",
    "role": "Operations Director",
    "referencePositions": 1,
    "module": "M04",
    "status": "not implemented"
  },
  {
    "id": "ROLE-011",
    "function": "Business & Business",
    "role": "Operations Consultants",
    "referencePositions": 8,
    "module": "M04",
    "status": "not implemented"
  },
  {
    "id": "ROLE-012",
    "function": "Business & Business",
    "role": "Process Improvement Specialists",
    "referencePositions": 4,
    "module": "M04",
    "status": "not implemented"
  },
  {
    "id": "ROLE-013",
    "function": "Business & Business",
    "role": "Senior Business Analysts",
    "referencePositions": 4,
    "module": "M04",
    "status": "not implemented"
  },
  {
    "id": "ROLE-014",
    "function": "Business & Business",
    "role": "Business Analysts",
    "referencePositions": 6,
    "module": "M04",
    "status": "not implemented"
  },
  {
    "id": "ROLE-015",
    "function": "Business & Business",
    "role": "Organization & Change Lead",
    "referencePositions": 1,
    "module": "M04",
    "status": "not implemented"
  },
  {
    "id": "ROLE-016",
    "function": "Business & Business",
    "role": "Change Consultants",
    "referencePositions": 4,
    "module": "M04",
    "status": "not implemented"
  },
  {
    "id": "ROLE-017",
    "function": "Business & Business",
    "role": "Training & Adoption Specialists",
    "referencePositions": 2,
    "module": "M04",
    "status": "not implemented"
  },
  {
    "id": "ROLE-018",
    "function": "Finance & Capital Advisory",
    "role": "Managing Director, Finance",
    "referencePositions": 1,
    "module": "M05",
    "status": "not implemented"
  },
  {
    "id": "ROLE-019",
    "function": "Finance & Capital Advisory",
    "role": "Fractional CFOs",
    "referencePositions": 4,
    "module": "M05",
    "status": "not implemented"
  },
  {
    "id": "ROLE-020",
    "function": "Finance & Capital Advisory",
    "role": "Client Controllers",
    "referencePositions": 4,
    "module": "M05",
    "status": "not implemented"
  },
  {
    "id": "ROLE-021",
    "function": "Finance & Capital Advisory",
    "role": "Client Accounting Managers",
    "referencePositions": 2,
    "module": "M05",
    "status": "not implemented"
  },
  {
    "id": "ROLE-022",
    "function": "Finance & Capital Advisory",
    "role": "Bookkeeping & Cleanup Accountants",
    "referencePositions": 5,
    "module": "M05",
    "status": "not implemented"
  },
  {
    "id": "ROLE-023",
    "function": "Finance & Capital Advisory",
    "role": "Payroll Coordination Specialists",
    "referencePositions": 2,
    "module": "M05",
    "status": "not implemented"
  },
  {
    "id": "ROLE-024",
    "function": "Finance & Capital Advisory",
    "role": "FP&A Managers",
    "referencePositions": 3,
    "module": "M05",
    "status": "not implemented"
  },
  {
    "id": "ROLE-025",
    "function": "Finance & Capital Advisory",
    "role": "Financial Modelers",
    "referencePositions": 5,
    "module": "M05",
    "status": "not implemented"
  },
  {
    "id": "ROLE-026",
    "function": "Finance & Capital Advisory",
    "role": "Cash Forecast Analysts",
    "referencePositions": 3,
    "module": "M05",
    "status": "not implemented"
  },
  {
    "id": "ROLE-027",
    "function": "Finance & Capital Advisory",
    "role": "Capital Structure Advisors",
    "referencePositions": 2,
    "module": "M05",
    "status": "not implemented"
  },
  {
    "id": "ROLE-028",
    "function": "Finance & Capital Advisory",
    "role": "Credit & Loan Packaging Analysts",
    "referencePositions": 3,
    "module": "M05",
    "status": "not implemented"
  },
  {
    "id": "ROLE-029",
    "function": "Finance & Capital Advisory",
    "role": "Tax-Ready Finance Coordinator",
    "referencePositions": 1,
    "module": "M05",
    "status": "not implemented"
  },
  {
    "id": "ROLE-030",
    "function": "Construction & Capital",
    "role": "Managing Director, Construction",
    "referencePositions": 1,
    "module": "M06",
    "status": "not implemented"
  },
  {
    "id": "ROLE-031",
    "function": "Construction & Capital",
    "role": "Capital Program Directors",
    "referencePositions": 2,
    "module": "M06",
    "status": "not implemented"
  },
  {
    "id": "ROLE-032",
    "function": "Construction & Capital",
    "role": "Owner Representatives / Project Managers",
    "referencePositions": 6,
    "module": "M06",
    "status": "not implemented"
  },
  {
    "id": "ROLE-033",
    "function": "Construction & Capital",
    "role": "Cost Engineers",
    "referencePositions": 4,
    "module": "M06",
    "status": "not implemented"
  },
  {
    "id": "ROLE-034",
    "function": "Construction & Capital",
    "role": "Estimators",
    "referencePositions": 3,
    "module": "M06",
    "status": "not implemented"
  },
  {
    "id": "ROLE-035",
    "function": "Construction & Capital",
    "role": "Job Cost / WIP Analysts",
    "referencePositions": 3,
    "module": "M06",
    "status": "not implemented"
  },
  {
    "id": "ROLE-036",
    "function": "Construction & Capital",
    "role": "Schedulers / Planners",
    "referencePositions": 3,
    "module": "M06",
    "status": "not implemented"
  },
  {
    "id": "ROLE-037",
    "function": "Construction & Capital",
    "role": "Procurement Leads",
    "referencePositions": 2,
    "module": "M06",
    "status": "not implemented"
  },
  {
    "id": "ROLE-038",
    "function": "Construction & Capital",
    "role": "Construction Contract Administrators",
    "referencePositions": 2,
    "module": "M06",
    "status": "not implemented"
  },
  {
    "id": "ROLE-039",
    "function": "Construction & Capital",
    "role": "Field Quality Coordinators",
    "referencePositions": 2,
    "module": "M06",
    "status": "not implemented"
  },
  {
    "id": "ROLE-040",
    "function": "Construction & Capital",
    "role": "Safety / Compliance Manager",
    "referencePositions": 1,
    "module": "M06",
    "status": "not implemented"
  },
  {
    "id": "ROLE-041",
    "function": "Construction & Capital",
    "role": "Project Document Controllers",
    "referencePositions": 3,
    "module": "M06",
    "status": "not implemented"
  },
  {
    "id": "ROLE-042",
    "function": "Real Estate",
    "role": "Managing Director, Real Estate",
    "referencePositions": 1,
    "module": "M07",
    "status": "not implemented"
  },
  {
    "id": "ROLE-043",
    "function": "Real Estate",
    "role": "Portfolio Directors",
    "referencePositions": 2,
    "module": "M07",
    "status": "not implemented"
  },
  {
    "id": "ROLE-044",
    "function": "Real Estate",
    "role": "Asset Management Consultants",
    "referencePositions": 4,
    "module": "M07",
    "status": "not implemented"
  },
  {
    "id": "ROLE-045",
    "function": "Real Estate",
    "role": "Acquisitions Managers",
    "referencePositions": 3,
    "module": "M07",
    "status": "not implemented"
  },
  {
    "id": "ROLE-046",
    "function": "Real Estate",
    "role": "Property Underwriting Analysts",
    "referencePositions": 6,
    "module": "M07",
    "status": "not implemented"
  },
  {
    "id": "ROLE-047",
    "function": "Real Estate",
    "role": "Market Research Analysts",
    "referencePositions": 3,
    "module": "M07",
    "status": "not implemented"
  },
  {
    "id": "ROLE-048",
    "function": "Real Estate",
    "role": "Property Operations Consultants",
    "referencePositions": 5,
    "module": "M07",
    "status": "not implemented"
  },
  {
    "id": "ROLE-049",
    "function": "Real Estate",
    "role": "Rent / Revenue Analysts",
    "referencePositions": 3,
    "module": "M07",
    "status": "not implemented"
  },
  {
    "id": "ROLE-050",
    "function": "Real Estate",
    "role": "Lease Audit Specialists",
    "referencePositions": 2,
    "module": "M07",
    "status": "not implemented"
  },
  {
    "id": "ROLE-051",
    "function": "Real Estate",
    "role": "Development Advisors",
    "referencePositions": 3,
    "module": "M07",
    "status": "not implemented"
  },
  {
    "id": "ROLE-052",
    "function": "Real Estate",
    "role": "Disposition / Sale-Leaseback Specialists",
    "referencePositions": 2,
    "module": "M07",
    "status": "not implemented"
  },
  {
    "id": "ROLE-053",
    "function": "Real Estate",
    "role": "Transaction Coordinator",
    "referencePositions": 1,
    "module": "M07",
    "status": "not implemented"
  },
  {
    "id": "ROLE-054",
    "function": "Technology & Digital",
    "role": "Managing Director, Technology",
    "referencePositions": 1,
    "module": "M08",
    "status": "not implemented"
  },
  {
    "id": "ROLE-055",
    "function": "Technology & Digital",
    "role": "Solutions Architects",
    "referencePositions": 2,
    "module": "M08",
    "status": "not implemented"
  },
  {
    "id": "ROLE-056",
    "function": "Technology & Digital",
    "role": "Digital Transformation Managers",
    "referencePositions": 2,
    "module": "M08",
    "status": "not implemented"
  },
  {
    "id": "ROLE-057",
    "function": "Technology & Digital",
    "role": "ERP / CRM Implementation Consultants",
    "referencePositions": 5,
    "module": "M08",
    "status": "not implemented"
  },
  {
    "id": "ROLE-058",
    "function": "Technology & Digital",
    "role": "Integration Engineers",
    "referencePositions": 4,
    "module": "M08",
    "status": "not implemented"
  },
  {
    "id": "ROLE-059",
    "function": "Technology & Digital",
    "role": "Automation Developers",
    "referencePositions": 3,
    "module": "M08",
    "status": "not implemented"
  },
  {
    "id": "ROLE-060",
    "function": "Technology & Digital",
    "role": "Client Data Engineers",
    "referencePositions": 3,
    "module": "M08",
    "status": "not implemented"
  },
  {
    "id": "ROLE-061",
    "function": "Technology & Digital",
    "role": "BI / Dashboard Developers",
    "referencePositions": 3,
    "module": "M08",
    "status": "not implemented"
  },
  {
    "id": "ROLE-062",
    "function": "Technology & Digital",
    "role": "Applied AI Analysts",
    "referencePositions": 2,
    "module": "M08",
    "status": "not implemented"
  },
  {
    "id": "ROLE-063",
    "function": "Technology & Digital",
    "role": "Cybersecurity Consultants",
    "referencePositions": 2,
    "module": "M08",
    "status": "not implemented"
  },
  {
    "id": "ROLE-064",
    "function": "Technology & Digital",
    "role": "Cloud Engineers",
    "referencePositions": 2,
    "module": "M08",
    "status": "not implemented"
  },
  {
    "id": "ROLE-065",
    "function": "Technology & Digital",
    "role": "QA / UAT Analysts",
    "referencePositions": 2,
    "module": "M08",
    "status": "not implemented"
  },
  {
    "id": "ROLE-066",
    "function": "Technology & Digital",
    "role": "Digital Adoption Trainer",
    "referencePositions": 1,
    "module": "M08",
    "status": "not implemented"
  },
  {
    "id": "ROLE-067",
    "function": "Logistics & Supply Chain",
    "role": "Managing Director, Logistics",
    "referencePositions": 1,
    "module": "M09",
    "status": "not implemented"
  },
  {
    "id": "ROLE-068",
    "function": "Logistics & Supply Chain",
    "role": "Supply Chain Strategists",
    "referencePositions": 2,
    "module": "M09",
    "status": "not implemented"
  },
  {
    "id": "ROLE-069",
    "function": "Logistics & Supply Chain",
    "role": "Network Modeling Analysts",
    "referencePositions": 2,
    "module": "M09",
    "status": "not implemented"
  },
  {
    "id": "ROLE-070",
    "function": "Logistics & Supply Chain",
    "role": "Freight Procurement Consultants",
    "referencePositions": 2,
    "module": "M09",
    "status": "not implemented"
  },
  {
    "id": "ROLE-071",
    "function": "Logistics & Supply Chain",
    "role": "Drayage Operations Analysts",
    "referencePositions": 2,
    "module": "M09",
    "status": "not implemented"
  },
  {
    "id": "ROLE-072",
    "function": "Logistics & Supply Chain",
    "role": "Fleet Compliance Coordinator",
    "referencePositions": 1,
    "module": "M09",
    "status": "not implemented"
  },
  {
    "id": "ROLE-073",
    "function": "Logistics & Supply Chain",
    "role": "Warehouse Improvement Specialists",
    "referencePositions": 2,
    "module": "M09",
    "status": "not implemented"
  },
  {
    "id": "ROLE-074",
    "function": "Logistics & Supply Chain",
    "role": "Inventory / Demand Planners",
    "referencePositions": 2,
    "module": "M09",
    "status": "not implemented"
  },
  {
    "id": "ROLE-075",
    "function": "Logistics & Supply Chain",
    "role": "Procurement Analytics Analysts",
    "referencePositions": 2,
    "module": "M09",
    "status": "not implemented"
  },
  {
    "id": "ROLE-076",
    "function": "Logistics & Supply Chain",
    "role": "TMS / WMS Consultants",
    "referencePositions": 2,
    "module": "M09",
    "status": "not implemented"
  },
  {
    "id": "ROLE-077",
    "function": "Energy & Infrastructure",
    "role": "Managing Director, Energy",
    "referencePositions": 1,
    "module": "M10",
    "status": "not implemented"
  },
  {
    "id": "ROLE-078",
    "function": "Energy & Infrastructure",
    "role": "Energy Economists / Analysts",
    "referencePositions": 2,
    "module": "M10",
    "status": "not implemented"
  },
  {
    "id": "ROLE-079",
    "function": "Energy & Infrastructure",
    "role": "Energy Program Lead",
    "referencePositions": 1,
    "module": "M10",
    "status": "not implemented"
  },
  {
    "id": "ROLE-080",
    "function": "Energy & Infrastructure",
    "role": "Solar / Storage Consultants",
    "referencePositions": 2,
    "module": "M10",
    "status": "not implemented"
  },
  {
    "id": "ROLE-081",
    "function": "Energy & Infrastructure",
    "role": "EV Deployment Consultants",
    "referencePositions": 2,
    "module": "M10",
    "status": "not implemented"
  },
  {
    "id": "ROLE-082",
    "function": "Energy & Infrastructure",
    "role": "Utility / Interconnection Coordinator",
    "referencePositions": 1,
    "module": "M10",
    "status": "not implemented"
  },
  {
    "id": "ROLE-083",
    "function": "Energy & Infrastructure",
    "role": "Oil & Gas Operations Advisors",
    "referencePositions": 2,
    "module": "M10",
    "status": "not implemented"
  },
  {
    "id": "ROLE-084",
    "function": "Energy & Infrastructure",
    "role": "Fueling / C-Store Consultants",
    "referencePositions": 2,
    "module": "M10",
    "status": "not implemented"
  },
  {
    "id": "ROLE-085",
    "function": "Energy & Infrastructure",
    "role": "Energy Data / Financial Modelers",
    "referencePositions": 2,
    "module": "M10",
    "status": "not implemented"
  },
  {
    "id": "ROLE-086",
    "function": "Energy & Infrastructure",
    "role": "Permitting / HSE Coordinators",
    "referencePositions": 2,
    "module": "M10",
    "status": "not implemented"
  },
  {
    "id": "ROLE-087",
    "function": "Energy & Infrastructure",
    "role": "Energy Vendor Procurement Lead",
    "referencePositions": 1,
    "module": "M10",
    "status": "not implemented"
  },
  {
    "id": "ROLE-088",
    "function": "Enterprise PMO & Client",
    "role": "Head of Enterprise PMO",
    "referencePositions": 1,
    "module": "M03",
    "status": "not implemented"
  },
  {
    "id": "ROLE-089",
    "function": "Enterprise PMO & Client",
    "role": "Portfolio / Program Directors",
    "referencePositions": 5,
    "module": "M03",
    "status": "not implemented"
  },
  {
    "id": "ROLE-090",
    "function": "Enterprise PMO & Client",
    "role": "Engagement / Program Managers",
    "referencePositions": 9,
    "module": "M03",
    "status": "not implemented"
  },
  {
    "id": "ROLE-091",
    "function": "Enterprise PMO & Client",
    "role": "Engagement Administrators",
    "referencePositions": 3,
    "module": "M03",
    "status": "not implemented"
  },
  {
    "id": "ROLE-092",
    "function": "Enterprise PMO & Client",
    "role": "Resource / Capacity Planners",
    "referencePositions": 4,
    "module": "M03",
    "status": "not implemented"
  },
  {
    "id": "ROLE-093",
    "function": "Enterprise PMO & Client",
    "role": "Project Controls Analysts",
    "referencePositions": 5,
    "module": "M03",
    "status": "not implemented"
  },
  {
    "id": "ROLE-094",
    "function": "Enterprise PMO & Client",
    "role": "Quality / Benefits Realization Leads",
    "referencePositions": 3,
    "module": "M03",
    "status": "not implemented"
  },
  {
    "id": "ROLE-095",
    "function": "M&A, Transactions & Value",
    "role": "Managing Director, M&A",
    "referencePositions": 1,
    "module": "M11",
    "status": "not implemented"
  },
  {
    "id": "ROLE-096",
    "function": "M&A, Transactions & Value",
    "role": "Transaction Directors",
    "referencePositions": 2,
    "module": "M11",
    "status": "not implemented"
  },
  {
    "id": "ROLE-097",
    "function": "M&A, Transactions & Value",
    "role": "Financial Due Diligence Specialists",
    "referencePositions": 3,
    "module": "M11",
    "status": "not implemented"
  },
  {
    "id": "ROLE-098",
    "function": "M&A, Transactions & Value",
    "role": "Valuation / Deal Modelers",
    "referencePositions": 3,
    "module": "M11",
    "status": "not implemented"
  },
  {
    "id": "ROLE-099",
    "function": "M&A, Transactions & Value",
    "role": "Transaction Managers",
    "referencePositions": 3,
    "module": "M11",
    "status": "not implemented"
  },
  {
    "id": "ROLE-100",
    "function": "M&A, Transactions & Value",
    "role": "Deal Research Analysts",
    "referencePositions": 2,
    "module": "M11",
    "status": "not implemented"
  },
  {
    "id": "ROLE-101",
    "function": "M&A, Transactions & Value",
    "role": "Integration Leads",
    "referencePositions": 2,
    "module": "M11",
    "status": "not implemented"
  },
  {
    "id": "ROLE-102",
    "function": "M&A, Transactions & Value",
    "role": "Synergy Tracking Analysts",
    "referencePositions": 2,
    "module": "M11",
    "status": "not implemented"
  },
  {
    "id": "ROLE-103",
    "function": "Owner & Family Enterprise",
    "role": "Managing Director, Owner Services",
    "referencePositions": 1,
    "module": "M12",
    "status": "not implemented"
  },
  {
    "id": "ROLE-104",
    "function": "Owner & Family Enterprise",
    "role": "Family Enterprise Advisors",
    "referencePositions": 3,
    "module": "M12",
    "status": "not implemented"
  },
  {
    "id": "ROLE-105",
    "function": "Owner & Family Enterprise",
    "role": "Financial / Wealth Planners",
    "referencePositions": 4,
    "module": "M12",
    "status": "not implemented"
  },
  {
    "id": "ROLE-106",
    "function": "Owner & Family Enterprise",
    "role": "Budget, Debt & Net Worth Coaches",
    "referencePositions": 3,
    "module": "M12",
    "status": "not implemented"
  },
  {
    "id": "ROLE-107",
    "function": "Owner & Family Enterprise",
    "role": "Insurance & Protection Strategists",
    "referencePositions": 3,
    "module": "M12",
    "status": "not implemented"
  },
  {
    "id": "ROLE-108",
    "function": "Owner & Family Enterprise",
    "role": "Retirement / Investment Service Liaisons",
    "referencePositions": 3,
    "module": "M12",
    "status": "not implemented"
  },
  {
    "id": "ROLE-109",
    "function": "Owner & Family Enterprise",
    "role": "Tax / Estate / Philanthropy Coordinators",
    "referencePositions": 3,
    "module": "M12",
    "status": "not implemented"
  },
  {
    "id": "ROLE-110",
    "function": "Owner & Family Enterprise",
    "role": "Owner Client Service & Reporting Associates",
    "referencePositions": 2,
    "module": "M12",
    "status": "not implemented"
  },
  {
    "id": "ROLE-111",
    "function": "Internal Technology & Data",
    "role": "Chief Technology & Information Officer",
    "referencePositions": 1,
    "module": "M13",
    "status": "not implemented"
  },
  {
    "id": "ROLE-112",
    "function": "Internal Technology & Data",
    "role": "Internal Systems Managers",
    "referencePositions": 2,
    "module": "M13",
    "status": "not implemented"
  },
  {
    "id": "ROLE-113",
    "function": "Internal Technology & Data",
    "role": "Software Engineers",
    "referencePositions": 6,
    "module": "M13",
    "status": "not implemented"
  },
  {
    "id": "ROLE-114",
    "function": "Internal Technology & Data",
    "role": "Data / AI Engineers",
    "referencePositions": 4,
    "module": "M13",
    "status": "not implemented"
  },
  {
    "id": "ROLE-115",
    "function": "Internal Technology & Data",
    "role": "QA Engineers",
    "referencePositions": 2,
    "module": "M13",
    "status": "not implemented"
  },
  {
    "id": "ROLE-116",
    "function": "Internal Technology & Data",
    "role": "DevOps / Cloud Engineers",
    "referencePositions": 2,
    "module": "M13",
    "status": "not implemented"
  },
  {
    "id": "ROLE-117",
    "function": "Internal Technology & Data",
    "role": "Chief Information Security Officer",
    "referencePositions": 1,
    "module": "M13",
    "status": "not implemented"
  },
  {
    "id": "ROLE-118",
    "function": "Internal Technology & Data",
    "role": "IT Support Specialists",
    "referencePositions": 2,
    "module": "M13",
    "status": "not implemented"
  },
  {
    "id": "ROLE-119",
    "function": "Internal Technology & Data",
    "role": "Internal Systems Enablement Specialists",
    "referencePositions": 2,
    "module": "M13",
    "status": "not implemented"
  },
  {
    "id": "ROLE-120",
    "function": "Commercial & Enterprise",
    "role": "Chief Commercial Officer",
    "referencePositions": 1,
    "module": "M02",
    "status": "not implemented"
  },
  {
    "id": "ROLE-121",
    "function": "Commercial & Enterprise",
    "role": "Enterprise Account Directors",
    "referencePositions": 4,
    "module": "M02",
    "status": "not implemented"
  },
  {
    "id": "ROLE-122",
    "function": "Commercial & Enterprise",
    "role": "Business Development Managers",
    "referencePositions": 3,
    "module": "M02",
    "status": "not implemented"
  },
  {
    "id": "ROLE-123",
    "function": "Commercial & Enterprise",
    "role": "Proposal / Bid Managers",
    "referencePositions": 2,
    "module": "M02",
    "status": "not implemented"
  },
  {
    "id": "ROLE-124",
    "function": "Commercial & Enterprise",
    "role": "Marketing & Communications Specialists",
    "referencePositions": 2,
    "module": "M02",
    "status": "not implemented"
  },
  {
    "id": "ROLE-125",
    "function": "Commercial & Enterprise",
    "role": "Research / CRM Operations Analysts",
    "referencePositions": 2,
    "module": "M02",
    "status": "not implemented"
  },
  {
    "id": "ROLE-126",
    "function": "Corporate Finance & Public",
    "role": "Chief Financial Officer",
    "referencePositions": 1,
    "module": "M14",
    "status": "not implemented"
  },
  {
    "id": "ROLE-127",
    "function": "Corporate Finance & Public",
    "role": "Corporate Controller",
    "referencePositions": 1,
    "module": "M14",
    "status": "not implemented"
  },
  {
    "id": "ROLE-128",
    "function": "Corporate Finance & Public",
    "role": "SEC / Technical Accounting Manager",
    "referencePositions": 1,
    "module": "M14",
    "status": "not implemented"
  },
  {
    "id": "ROLE-129",
    "function": "Corporate Finance & Public",
    "role": "Corporate Accountants",
    "referencePositions": 3,
    "module": "M14",
    "status": "not implemented"
  },
  {
    "id": "ROLE-130",
    "function": "Corporate Finance & Public",
    "role": "Corporate FP&A Analysts",
    "referencePositions": 2,
    "module": "M14",
    "status": "not implemented"
  },
  {
    "id": "ROLE-131",
    "function": "Corporate Finance & Public",
    "role": "Treasury Manager",
    "referencePositions": 1,
    "module": "M14",
    "status": "not implemented"
  },
  {
    "id": "ROLE-132",
    "function": "Corporate Finance & Public",
    "role": "Billing / Collections Specialists",
    "referencePositions": 3,
    "module": "M14",
    "status": "not implemented"
  },
  {
    "id": "ROLE-133",
    "function": "Corporate Finance & Public",
    "role": "Accounts Payable Specialist",
    "referencePositions": 1,
    "module": "M14",
    "status": "not implemented"
  },
  {
    "id": "ROLE-134",
    "function": "Corporate Finance & Public",
    "role": "Corporate Payroll Specialist",
    "referencePositions": 1,
    "module": "M14",
    "status": "not implemented"
  },
  {
    "id": "ROLE-135",
    "function": "Corporate Finance & Public",
    "role": "Corporate Investor Relations Lead",
    "referencePositions": 1,
    "module": "M14",
    "status": "not implemented"
  },
  {
    "id": "ROLE-136",
    "function": "Corporate Finance & Public",
    "role": "SOX / Internal Controls Manager",
    "referencePositions": 1,
    "module": "M14",
    "status": "not implemented"
  },
  {
    "id": "ROLE-137",
    "function": "Legal, Risk & Compliance",
    "role": "General Counsel / Corporate Secretary",
    "referencePositions": 1,
    "module": "M14",
    "status": "not implemented"
  },
  {
    "id": "ROLE-138",
    "function": "Legal, Risk & Compliance",
    "role": "Corporate / Commercial Counsel",
    "referencePositions": 1,
    "module": "M14",
    "status": "not implemented"
  },
  {
    "id": "ROLE-139",
    "function": "Legal, Risk & Compliance",
    "role": "Chief Compliance Officer",
    "referencePositions": 1,
    "module": "M14",
    "status": "not implemented"
  },
  {
    "id": "ROLE-140",
    "function": "Legal, Risk & Compliance",
    "role": "Financial Services Compliance Supervisor",
    "referencePositions": 1,
    "module": "M14",
    "status": "not implemented"
  },
  {
    "id": "ROLE-141",
    "function": "Legal, Risk & Compliance",
    "role": "Enterprise Risk / Insurance Lead",
    "referencePositions": 1,
    "module": "M14",
    "status": "not implemented"
  },
  {
    "id": "ROLE-142",
    "function": "Legal, Risk & Compliance",
    "role": "Privacy / AI Governance Lead",
    "referencePositions": 1,
    "module": "M14",
    "status": "not implemented"
  },
  {
    "id": "ROLE-143",
    "function": "Legal, Risk & Compliance",
    "role": "Contracts Managers / Paralegals",
    "referencePositions": 2,
    "module": "M14",
    "status": "not implemented"
  },
  {
    "id": "ROLE-144",
    "function": "People, Partners &",
    "role": "Head of People & Corporate Operations",
    "referencePositions": 1,
    "module": "M14",
    "status": "not implemented"
  },
  {
    "id": "ROLE-145",
    "function": "People, Partners &",
    "role": "HR Business Partners",
    "referencePositions": 2,
    "module": "M14",
    "status": "not implemented"
  },
  {
    "id": "ROLE-146",
    "function": "People, Partners &",
    "role": "Recruiters / Talent Partners",
    "referencePositions": 3,
    "module": "M14",
    "status": "not implemented"
  },
  {
    "id": "ROLE-147",
    "function": "People, Partners &",
    "role": "Learning & Development Manager",
    "referencePositions": 1,
    "module": "M14",
    "status": "not implemented"
  },
  {
    "id": "ROLE-148",
    "function": "People, Partners &",
    "role": "Partner / Vendor Operations Managers",
    "referencePositions": 2,
    "module": "M14",
    "status": "not implemented"
  },
  {
    "id": "ROLE-149",
    "function": "People, Partners &",
    "role": "Corporate Procurement Administrator",
    "referencePositions": 1,
    "module": "M14",
    "status": "not implemented"
  },
  {
    "id": "ROLE-150",
    "function": "People, Partners &",
    "role": "Workplace / Administrative Specialists",
    "referencePositions": 2,
    "module": "M14",
    "status": "not implemented"
  },
  {
    "id": "ROLE-151",
    "function": "Independent Internal Audit",
    "role": "Director of Internal Audit",
    "referencePositions": 1,
    "module": "M15",
    "status": "not implemented"
  },
  {
    "id": "ROLE-152",
    "function": "Independent Internal Audit",
    "role": "Senior Internal Auditor",
    "referencePositions": 1,
    "module": "M15",
    "status": "not implemented"
  }
];
export const SERVICE_COVERAGE:ServiceCoverage[] = [
  {
    "id": "SERVICE-001",
    "name": "Business Financial Analysis",
    "module": "M05",
    "coordination": "Financial analysis",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-002",
    "name": "Cash Flow Management & Forecasting",
    "module": "M05",
    "coordination": "13-week cash and forecasts",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-003",
    "name": "Profitability Analysis & Margin Improvement",
    "module": "M05",
    "coordination": "Profitability and margins",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-004",
    "name": "KPI Tracking & Dashboard Creation",
    "module": "M08",
    "coordination": "Business / Finance define KPIs",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-005",
    "name": "Financial Modeling & Projections",
    "module": "M05",
    "coordination": "Financial models",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-006",
    "name": "Monthly Bookkeeping",
    "module": "M05",
    "coordination": "Client accounting",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-007",
    "name": "Catch-Up / Cleanup Bookkeeping",
    "module": "M05",
    "coordination": "Cleanup accounting",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-008",
    "name": "Financial Statement Preparation",
    "module": "M05",
    "coordination": "Statement preparation; qualified review as scoped",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-009",
    "name": "Job Costing (Contractors)",
    "module": "M06",
    "coordination": "Finance supports WIP / job costing",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-010",
    "name": "Expense Tracking & Categorization",
    "module": "M05",
    "coordination": "Client accounting",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-011",
    "name": "Business Planning & Strategy",
    "module": "M04",
    "coordination": "Strategy",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-012",
    "name": "Growth & Scaling Strategy",
    "module": "M04",
    "coordination": "Growth",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-013",
    "name": "Pricing Strategy Optimization",
    "module": "M04",
    "coordination": "Pricing",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-014",
    "name": "Cost Reduction & Efficiency Audits",
    "module": "M04",
    "coordination": "Operations",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-015",
    "name": "Business Restructuring",
    "module": "M04",
    "coordination": "Finance / M&A / counsel support",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-016",
    "name": "Business Credit Development",
    "module": "M05",
    "coordination": "Credit readiness",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-017",
    "name": "Funding Strategy & Capital Structuring",
    "module": "M05",
    "coordination": "Registered intermediary if required",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-018",
    "name": "Loan Packaging & Underwriting Support",
    "module": "M05",
    "coordination": "Lender retains credit approval",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-019",
    "name": "Payroll Setup & Coordination",
    "module": "M05",
    "coordination": "Payroll vendor coordination",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-020",
    "name": "Tax-Ready Financial Preparation",
    "module": "M05",
    "coordination": "Tax professional handoff",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-021",
    "name": "Fractional CFO Services",
    "module": "M05",
    "coordination": "Fractional CFO",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-022",
    "name": "M&A / Acquisition Advisory",
    "module": "M11",
    "coordination": "Sector diligence; registered intermediary if required",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-023",
    "name": "Exit Planning & Valuation Prep",
    "module": "M11",
    "coordination": "Owner / Finance support",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-024",
    "name": "Real Estate Investment Education",
    "module": "M07",
    "coordination": "Education",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-025",
    "name": "Portfolio Strategy Development",
    "module": "M07",
    "coordination": "Portfolio strategy",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-026",
    "name": "Market Analysis & Deal Sourcing Guidance",
    "module": "M07",
    "coordination": "Market and sourcing",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-027",
    "name": "Buy-And-Hold / Flip / BRRRR Strategy",
    "module": "M07",
    "coordination": "Property investment strategy",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-028",
    "name": "Property Underwriting",
    "module": "M07",
    "coordination": "Underwriting",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-029",
    "name": "Cash Flow Analysis",
    "module": "M07",
    "coordination": "Property cash flow",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-030",
    "name": "ROI / IRR Projections",
    "module": "M07",
    "coordination": "Property returns",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-031",
    "name": "Risk Assessment",
    "module": "M07",
    "coordination": "Property / portfolio risk",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-032",
    "name": "Acquisition & Negotiation Support",
    "module": "M07",
    "coordination": "Licensed brokerage / counsel as required",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-033",
    "name": "Disposition Planning",
    "module": "M07",
    "coordination": "Disposition",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-034",
    "name": "Off-Market Deal Sourcing Strategy",
    "module": "M07",
    "coordination": "Sourcing",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-035",
    "name": "Sale-Leaseback Advisory",
    "module": "M07",
    "coordination": "Finance / broker / counsel support",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-036",
    "name": "Development & Construction Advisory",
    "module": "M06",
    "coordination": "Real Estate supports development",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-037",
    "name": "Rehab Planning & Budgeting",
    "module": "M06",
    "coordination": "Rehab budgeting",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-038",
    "name": "Contractor Coordination Guidance",
    "module": "M06",
    "coordination": "Contractor coordination",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-039",
    "name": "Property Management Consulting",
    "module": "M07",
    "coordination": "Property operations",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-040",
    "name": "Rent Optimization Strategy",
    "module": "M07",
    "coordination": "Revenue management",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-041",
    "name": "Portfolio Performance Tracking",
    "module": "M07",
    "coordination": "Portfolio reporting",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-042",
    "name": "Life Insurance Strategy",
    "module": "M12",
    "coordination": "Licensed insurance delivery",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-043",
    "name": "Key Man Insurance",
    "module": "M12",
    "coordination": "Licensed insurance delivery",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-044",
    "name": "Income Protection Planning",
    "module": "M12",
    "coordination": "Licensed insurance delivery",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-045",
    "name": "Risk Management Strategies",
    "module": "M12",
    "coordination": "Scoped personal risk planning",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-046",
    "name": "Personal Financial Planning",
    "module": "M12",
    "coordination": "Qualified financial planning",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-047",
    "name": "Budgeting & Cash Flow Structuring",
    "module": "M12",
    "coordination": "Personal cash structure",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-048",
    "name": "Debt Reduction Strategies",
    "module": "M12",
    "coordination": "Debt planning",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-049",
    "name": "Net Worth Tracking",
    "module": "M12",
    "coordination": "Net worth reporting",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-050",
    "name": "Tax Strategy Coordination",
    "module": "M12",
    "coordination": "Tax professional advises",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-051",
    "name": "Estate Planning Coordination",
    "module": "M12",
    "coordination": "Estate attorney advises",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-052",
    "name": "Wealth Transfer Strategies",
    "module": "M12",
    "coordination": "Attorney / tax / adviser coordination",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-053",
    "name": "Investment Education & Guidance",
    "module": "M12",
    "coordination": "Personalized securities advice via registered adviser",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-054",
    "name": "Retirement Planning",
    "module": "M12",
    "coordination": "Qualified retirement planning",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-055",
    "name": "IRA / 401(K) Rollovers",
    "module": "M12",
    "coordination": "Appropriate registered / licensed provider",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-056",
    "name": "Asset Allocation Strategy",
    "module": "M12",
    "coordination": "Personalized advice via registered adviser",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-057",
    "name": "Business To Real Estate Wealth Strategy",
    "module": "M12",
    "coordination": "Real Estate / Finance support",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-058",
    "name": "Cash Flow To Asset Conversion Planning",
    "module": "M12",
    "coordination": "Finance / Real Estate support",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-059",
    "name": "Entrepreneur Wealth Building Systems",
    "module": "M12",
    "coordination": "Business / Finance support",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-060",
    "name": "Capital Structuring Across Business & Real Estate",
    "module": "M05",
    "coordination": "Real Estate / M&A support",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-061",
    "name": "Integrated Risk And Growth Strategies",
    "module": "M12",
    "coordination": "Business / Finance support",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-062",
    "name": "Capital Raising Strategy",
    "module": "M05",
    "coordination": "M&A / registered intermediary as required",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-063",
    "name": "Investor Relations Support",
    "module": "M11",
    "coordination": "Client IR support; corporate IR is separate",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-064",
    "name": "Deal Structuring",
    "module": "M11",
    "coordination": "Finance / counsel / registered provider as required",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-065",
    "name": "Strategic Partnerships",
    "module": "M04",
    "coordination": "Sector / Commercial support",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-066",
    "name": "Financial Systems Implementation",
    "module": "M08",
    "coordination": "Finance supports requirements",
    "status": "not implemented"
  },
  {
    "id": "SERVICE-067",
    "name": "Wealth Acceleration Planning",
    "module": "M12",
    "coordination": "Coordinated planning; no return guarantee",
    "status": "not implemented"
  }
];

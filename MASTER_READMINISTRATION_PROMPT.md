# LATIMUS — CROSS-SECTOR EXECUTIVE INTELLIGENCE
## CODEX MASTER RE-ADMINISTRATION & IN-PLACE EXPANSION DIRECTIVE
### Existing Repository Upgrade — CSV Prospect Intelligence + 7-Sector Enterprise Opportunity Intelligence

**Product:** LATIMUS — Cross-Sector Executive Intelligence  
**Company:** THE CONSULT — Private Enterprise Executive Office  
**Build mode:** IN-PLACE RE-ADMINISTRATION OF THE EXISTING LATIMUS REPOSITORY  
**Runtime mandate:** LOCAL-FIRST / NON-HOSTED / BROWSER-BASED  
**Primary runtime:** Manifest V3 Chrome extension with a full-tab application experience  
**Portable runtime:** self-contained standalone HTML distribution using the same domain/capability core  
**FORWARD:** separate product; do not merge or import its runtime, database, services, or application code

---

# 0. IMMEDIATE INSTRUCTION TO CODEX

You are already working inside the existing LATIMUS repository.

Do **not** restart the product. Do **not** discard working code. Do **not** replace the current architecture simply because this directive adds capability. Do **not** create a second prospecting application. Do **not** create a second market-intelligence application. Do **not** create an Electron fork. Do **not** merge LATIMUS with FORWARD.

This directive is an **additive re-administration** of the existing LATIMUS build.

Your first actions are:

1. Read the current `AGENTS.md`, `GOALS.md`, `PLANS.md`, `SEPARATION_CONTRACT.md`, `REQUIREMENTS_TRACEABILITY.md`, `DECISIONS.md`, `harness/build-log.md`, and current active phase file.
2. Inspect the live repository and run the current build/test/typecheck/lint commands that already exist.
3. Create a Git checkpoint or equivalent safe repository state before material refactoring.
4. Determine which parts of the two new requirements are already implemented, partially implemented, or absent.
5. Classify affected components as KEEP / EXTEND / REFACTOR / REBUILD ONLY IF REQUIRED / NOT BUILT.
6. Update `REQUIREMENTS_TRACEABILITY.md`, `DECISIONS.md`, `PLANS.md`, the applicable phase files, and build context before implementation.
7. Continue from the repository's current phase. Do not reset phase numbering or claim prior completed work is invalid unless tests/evidence prove it is.
8. Implement the two new capabilities as **native LATIMUS workbenches sharing the same core company/contact/evidence/opportunity spine**.

The two additions are:

### A. Prospect Intelligence & Enrichment Workbench
A CSV-first prospecting and business-contact enrichment system.

### B. 7-Sector Enterprise Opportunity Intelligence
A 55-source market/signal intelligence system covering Business, Finance, Construction, Real Estate, Technology, Logistics, and Energy.

They must feel like one premium application, but their **intake rules remain distinct**.

---

# 1. PRODUCT STANDARD

Build LATIMUS like serious institutional internal software commissioned at substantial enterprise-development cost.

The target is not visual decoration. The target is exceptional information architecture, fast local operation, low-friction workflows, keyboard-first power-user operation, reliable persistence, strong evidence lineage, deep cross-module navigation, excellent batch handling, polished state transitions, high-density but readable data views, thoughtful empty/loading/error/offline states, safe external actions, resumable long-running work, clear confidence/provenance, strong large-file performance, consistent design, and no fake functionality.

The application should **feel** like a high-end enterprise intelligence platform without claiming that any particular amount of money was actually spent building it.

LATIMUS remains THE CONSULT's **Executive Office + Cross-Sector Intelligence + Business Development + Client Execution + Corporate Operations** inside one traceable local-first environment.

---

# 2. NON-HOSTED ARCHITECTURE — DO NOT CHANGE THE CORE MANDATE

LATIMUS must not require AWS, Azure, GCP, Vercel, Firebase, Supabase, hosted PostgreSQL, Express hosting, Docker, Kubernetes, a localhost production server, an always-on physical server, Electron, or a separate backend service.

Continue the existing two-distribution LATIMUS architecture.

## 2.1 Advanced Mode — Manifest V3 Full-Tab Application

Use the shared TypeScript domain core, Manifest V3, a full-tab application UI, background/service-worker network adapters, narrow host permissions, validated messages, bundled executable code, local persistence, encrypted local secrets/workspace, Web Workers where useful for CSV parsing/normalization/scoring/deduplication, capability detection, and resumable durable jobs.

## 2.2 Portable Core — Standalone HTML

Produce a self-contained HTML distribution from the same application/domain core. It must support CSV import, automatic mapping, local company/contact records, prospect review, deterministic scoring, evidence review, signal/opportunity review, local calculations, reports, PMO/client records, export, encrypted workspace save/load, and offline local functions.

Do not fake network capability that normal file-mode browser security prevents. If a feature requires extension permissions, a secret-bearing provider call, or cross-origin access unavailable to standalone file mode, show truthful states such as `extension_required`, `provider_not_configured`, `connection_unavailable`, or `manual_import_available`.

The UI should look and behave like the same LATIMUS product in both modes.

---

# 3. DATA-SPINE RULE

Use one normalized LATIMUS domain spine for companies/firms, aliases/DBAs, people/contacts, imported prospect rows, evidence, emails, business phones, public professional profiles, sources, source runs, signals, opportunities, account priority, outreach activity, CRM state, client conversion, engagements, and artifacts.

Do not create isolated duplicate databases for CSV prospecting, permit intelligence, market intelligence, CRM, or signal intelligence.

Maintain provenance so the system always knows whether a company/contact entered LATIMUS from imported prospect CSV, user entry, permit/source intelligence, existing CRM, existing LATIMUS records, client records, or public-source discovery.

---

# 4. CRITICAL INTAKE SEPARATION

## 4.1 Prospect Intelligence & Enrichment Workbench = CSV-FIRST

The Prospecting Workbench's authoritative starting dataset is a **user-imported CSV file containing prospect data**.

LATIMUS must not turn the Prospecting Workbench into a generic autonomous lead scraper.

A prospecting batch begins with:

> **IMPORT CSV → MAP FIELDS → NORMALIZE → RESOLVE COMPANY → ENRICH COMPANY → MATCH PERSON/POC → VERIFY CONTACT EVIDENCE → SCORE CONFIDENCE → REVIEW → CRM/OUTREACH/EXPORT**

Public web/company data is used to **enrich and validate imported prospects**.

The 55-source market/signal engine must not silently populate the CSV prospecting queue.

If the owner later wants to pursue an intelligence-generated company using the Prospecting Workbench, require an explicit action such as exporting selected opportunities to a prospect CSV and re-importing it, or another explicit owner-approved conversion that preserves `origin = intelligence_opportunity`.

Never silently blend the two intake streams.

## 4.2 Enterprise Opportunity Intelligence = SOURCE/SIGNAL-FIRST

The Intelligence Fabric begins with approved data sources and source imports:

> **MARKET → SIGNAL → COMPANY → NEED → OPPORTUNITY → POC → OUTREACH → RESULT**

Its job is to identify enterprise change, not merely enrich a pre-existing CSV list.

Both systems may resolve into the same normalized Company/Contact master, but must preserve origin, evidence, and workflow status.

---

# 5. PROSPECTING WORKBENCH

Create a first-class LATIMUS navigation area named `Prospecting` with:

- Import Center
- Mapping Studio
- Enrichment Jobs
- Prospect Results
- Company Resolver
- Contact Evidence
- Company Email Index
- Review Queue
- Export Center
- Provider Settings
- Prospecting Analytics

This must feel native to LATIMUS, not embedded as an unrelated utility.

---

# 6. CSV IMPORT CENTER

Support drag/drop CSV, file picker, common CSV encodings where practical, quoted fields, commas inside quoted fields, large files, arbitrary input columns, import preview, row/column counts, timestamps, original filename, import batch ID, duplicate-file detection using file hash where practical, import history, cancel, and resume/retry from durable job state.

**Preserve every original column. Never discard unrecognized columns.**

Store immutable/raw imported row representation, normalized working representation, mapping used/version, enrichment outputs, row-specific errors, and export state.

---

# 7. AUTOMATIC COLUMN MAPPING STUDIO

Automatically propose mappings for company/business name, address, person/owner/decision maker, title/role, phone, website/domain, LinkedIn/public profile URL, email, city, state, postal code/ZIP, notes, and passthrough fields.

Recognize common aliases including:

- Company: company, company name, business, business name, organization, account name, employer
- Person: owner, owner name, contact, contact name, decision maker, decision maker name, person, full name, executive, principal
- Phone: phone, phone number, telephone, business phone, company phone, mobile
- Website: website, web site, domain, company url, business url, url
- Email: email, email address, work email, business email, contact email
- Profile: linkedin, linkedin url, profile, profile url, linkedin profile

Display proposed mappings before enrichment and allow complete user override. Support mapping confidence/explanation, saved mapping templates, one-click reuse, reset/re-map.

---

# 8. MINIMUM PROSPECT RECORD

Accept incomplete rows. A useful row may contain only company name, address, and owner/contact name. Optional clues include phone, website/domain, title, role, existing email, public professional profile URL, city/state/ZIP.

Never reject the full import because some rows are incomplete.

---

# 9. COMPANY RESOLUTION ENGINE

Resolve the correct organization before contact enrichment.

If website/domain is provided: normalize, validate, treat as a strong identity clue, and verify company association where practical.

If website is missing, use company name, address, city/state/ZIP, supplied phone, approved search results, official-site text, known aliases, and existing LATIMUS firm records.

Do not assume the first result is correct.

Persist resolved domain, website, company confidence, resolution method, evidence, alternatives when ambiguous, and review-needed state.

Resolution methods may include `input_website`, `input_email_domain`, `search_name_address`, `search_name_phone`, `search_company_name`, `cached_company`, `existing_latimus_company`, and `manual_confirmation`.

---

# 10. COMPANY-FIRST ENRICHMENT

Never crawl/search the same company independently for every CSV row.

Group rows by likely company using normalized company name, address, domain, business phone, and existing LATIMUS identity.

If 500 imported rows belong to one domain, perform roughly one company enrichment/crawl plus person-specific matching/research rather than 500 identical company crawls.

Use in-job memory cache, IndexedDB persistent cache, content hashes where useful, configurable freshness (7/30/90 days or force refresh), and source timestamps. Support `use_cache`, `refresh_stale`, and `force_refresh`.

---

# 11. PUBLIC COMPANY RESEARCH

In Advanced/Extension mode, crawl only public pages through approved browser/network adapters.

Start with likely paths `/`, `/about`, `/about-us`, `/company`, `/team`, `/our-team`, `/people`, `/leadership`, `/management`, `/staff`, `/owners`, `/owner`, `/contact`, `/contact-us`. Discover relevant same-domain links using team/people/leadership/management/owner/founder/executive/staff/bio/profile/contact/about terms.

Respect same-domain rules, crawl caps, timeout, delay, concurrency, cancellation, redirects/TLS/network errors, and site restrictions.

Do not crawl authenticated/private pages, LinkedIn pages, CAPTCHA workflows, blocked social platforms, or binary/static assets unless required.

---

# 12. PUBLIC BUSINESS INFORMATION EXTRACTION

Extract source-backed work emails from `mailto:`, visible page text, structured data/JSON-LD, simple rendered obfuscation, approved search snippets, and approved public third-party pages. Store email, source URL/type, page/title, context, date checked, and confidence inputs.

Capture supplied business phone, official main line, office phone, company phone, and clearly evidenced public business phone associated with a person. Never seek private/home numbers.

Preserve input professional-profile URLs, company-site LinkedIn URLs, and matching URLs from public search. Do not log in to LinkedIn or scrape authenticated content.

---

# 13. SEARCH PROVIDER ABSTRACTION

Create a provider interface rather than hardcoded search logic. Initial provider: Brave Search API where configured by the user.

In extension mode, keep provider credentials out of UI/DOM, exported CSVs, logs, query strings, and unencrypted sync storage. Use the existing encrypted LATIMUS vault/trusted background adapter.

In standalone HTML mode, do not pretend secure persisted secret-bearing integration exists if browser/file-mode limitations make it unsafe. Offer manual/import or session-only patterns only when technically safe and disclosed.

---

# 14. EMAIL DISCOVERY & IDENTITY MATCHING

Do not generate an address and call it verified.

Build a local company email index from publicly observed addresses and match observed addresses to the imported person using company-domain match, exact/partial/nickname name evidence, title/function match, company context, official team-page evidence, mailto/structured data, source quality, and local-part affinity.

Detect generic addresses including info@, contact@, hello@, sales@, support@, office@, admin@, billing@, marketing@, press@, media@, careers@, jobs@, recruiting@, hr@, legal@, privacy@. Store useful generic company email separately; never label it as the person's verified individual work email.

---

# 15. PROSPECT CONTACT CONFIDENCE

Use a dedicated Prospect Contact Confidence score separate from EOS.

- Verified: 80–100 with strong identity evidence
- Candidate: 55–79
- Weak: below 55; do not use as primary individual email

Statuses: `verified_work_email`, `candidate_work_email`, `company_only`, `not_found`, `company_not_resolved`, `insufficient_input`, `review_required`, `error`.

Fail closed. A false verified work email is worse than `not_found`.

If pattern inference is implemented, keep `inferred_email`, `inferred_email_pattern`, and `inferred_email_confidence` separate. Never place an inferred address into verified output without independent public observation. Do not use SMTP mailbox probing or VRFY/RCPT enumeration.

---

# 16. PROSPECT RESULT & EXPORT FIELDS

Preserve every original imported field. Append structured enrichment fields including `prospect_import_id`, `prospect_row_id`, enriched status/domain/website/company confidence/company resolution/person/title/work email/email confidence/email quality/company email/business phone/public profile/email source/phone source/sources/pages checked/company emails found/evidence/last checked, plus CRM/outreach/owner review status.

Provide Full Fidelity, CRM Import, POC Review, Verified Contacts Only, Exceptions/Not Found, Company Only, and Custom Column Selection export profiles.

---

# 17. PROSPECTING JOB ENGINE

Use the existing LATIMUS durable-work engine. Show total rows, parsed rows, companies grouped/resolved/cached, current company/person, completed rows, verified/candidates/company-only/not found/review/errors, pages fetched, search requests, elapsed time, and remaining workload where defensible.

Support Start, Pause, Resume, Cancel, Retry Failed, Re-run Selected, Force Refresh Selected, Export Partial Results. Use AbortController or equivalent cancellation. One bad row must not kill a batch.

---

# 18. PROSPECTING PERFORMANCE

Design for hundreds, thousands, and tens of thousands of CSV rows using chunked parsing, Web Workers for CPU-heavy transforms, IndexedDB batching/transactions, indexes, virtualized tables, incremental rendering, company-level caching, search deduplication, request budgets, controlled concurrency, bounded retries, per-domain throttling, content hashes, and lazy evidence loading.

Suggested safe starting defaults may be around record concurrency 4, max company pages 15, external evidence pages 4, request delay 300ms, timeout 12s, but tune only from actual benchmarks.

---

# 19. 7-SECTOR ENTERPRISE OPPORTUNITY INTELLIGENCE

Preserve the existing LATIMUS Intelligence Fabric and expand it to faithfully implement THE CONSULT's 7-Sector Data Source Master Plan for Business, Finance, Construction, Real Estate, Technology, Logistics, and Energy.

Use one source registry and one normalized signal/opportunity system. Do not create seven separate research databases.

Operating loop:

> **MARKET → SIGNAL → COMPANY → NEED → OPPORTUNITY → POC → OUTREACH → RESULT**

---

# 20. SOURCE REGISTRY — ALL 55 SOURCES

Implement one versioned `INTEL_SOURCES` registry containing Source ID, Source Name, Source Family, Primary/Secondary Sectors, Geography/Level, Trigger Types, URL, Source Tier, Cost, Authentication, Data Format, Fields Available, Update Frequency, THE CONSULT Check Frequency, Automation Potential, API/Feed Available, POC Usefulness, Earliest Signal Stage, Signal Strength, Last Checked, Next Check Due, Status, Signals Captured, Qualified Opportunities, Conversations, Wins, Revenue Sourced, and Notes.

Represent actual source modes truthfully: API, bulk/structured feed, downloadable dataset, portal/search, manual import, credentials required, paid/freemium, unavailable/broken. A registry row is not proof of a working adapter.

---

# 21. 55-SOURCE COVERAGE

Use the supplied master plan as source of truth for names/triggers/sectors/cadence/geography/automation/POC usefulness/fields.

Coverage includes construction/real-estate sources such as TDLR TABS, DallasNow, Dallas/Fort Worth/Arlington/Plano/Frisco/McKinney/Denton/Carrollton permitting/development sources, DFW appraisal districts, and county official property records; business/finance/technology/government sources such as SAM.gov, USAspending, Texas ESBD, Texas DIR, Texas development/project announcements, WARN, SEC EDGAR/Form D/8-K, Texas SOS/Comptroller/CMBL/VetHUB/grant resources; logistics sources such as FMCSA Census/SAFER/Licensing & Insurance/Register/Open Data, TxDOT STARS, BTS FAF, Port Houston; and energy/large-load sources such as RRC, ERCOT Large Load/Notices, PUCT, TCEQ, and EIA.

---

# 22. SOURCE DEPLOYMENT PRIORITY

Do not automate all 55 at once.

Tier 1 — high-value opportunity creation: TDLR TABS, DallasNow, Fort Worth permit GIS, Arlington permits, DFW deed-record routines, SAM awards, Texas ESBD, Texas Project Announcements, SEC EDGAR/RSS, FMCSA Census + Licensing & Insurance, RRC permit feeds, ERCOT Large Load.

Tier 2 — validation/enrichment: appraisal districts, SAFER, SOSPortal, Taxable Entity Search, TCEQ, PUCT, DIR, Local Development Agreements.

Tier 3 — market intelligence: TxDOT STARS, BTS FAF, EIA, Port Houston.

Record implementation/support state accurately.

---

# 23. SIGNAL MODEL

Signals must carry identification, entity, event, evidence, LATIMUS analysis, scoring, POC, and pursuit fields including Signal ID, Date Found, Source ID, Primary/Secondary Sector, Trigger Type/Date, Firm/Company/Website/NAICS/location, Event/Project IDs/names/value/jobs/facility/stage, source URLs/tiers/confidence/summary, likely need/problem/services/opportunity hypothesis/recommended offer, EOS components/priority, ideal POC function/contact IDs/POC status/reason-this-POC-owns-problem, and outreach/next-step fields.

One event can support multiple service hypotheses but remains one normalized event.

---

# 24. FIRM & CONTACT MASTER

Extend Firm 360 with primary/secondary sectors, subsector, NAICS, HQ, revenue/employee bands, ownership, parent, website, active signals, highest EOS, primary opportunity, last signal, account priority, PMsuite ID.

Extend Contacts with function, public profile, source/source URL, email verification, POC tier, associated signal/opportunity, and `Reason This POC Owns Problem`.

---

# 25. EOS — ENTERPRISE OPPORTUNITY SCORE

Maintain 100-point EOS: Trigger Strength 30, Demonstrated Need/Pain 25, Economic Capacity 20, THE CONSULT Service Fit 15, POC Accessibility 10.

90–100 A1 Immediate; 75–89 A2 Strategic; 65–74 B1 Qualified; 50–64 B2 Monitor; below 50 C Database.

**POC/email enrichment for intelligence-generated opportunities begins at EOS 65.**

This does not block CSV prospect enrichment because importing a CSV is an explicit owner instruction to research those prospects.

Keep three scores separate:
- Permit Lead Score = construction placement attractiveness
- EOS = consulting opportunity attractiveness/immediacy
- Prospect Contact Confidence = identity/contact evidence strength

Never collapse them.

---

# 26. SOURCE-TIER DISCIPLINE

Tier A: government/regulator/court/official filing — can directly support qualification. Tier B: company press release/IR/corporate site — can directly support qualification. Tier C: credible trade/business publication — validate with second source when material. Tier D: aggregator/social/review/unverified — discovery only.

Recommended A1 outreach gate: A/B evidence or two independent C sources for a material claim.

---

# 27. SIGNAL DEDUPLICATION

Default fingerprint: **Normalized Company + Trigger Type + Event/Project ID + Trigger Date**, supplemented with source IDs, address/location, amount/value, normalized title, fuzzy company identity, and source family.

TDLR + municipal permit + company announcement + trade article must become one event/opportunity plus multiple evidence records, not duplicate opportunities.

---

# 28. PERMIT INTELLIGENCE

Preserve existing Permit Lead Score and placement workflow. Do not replace it with EOS. A single construction event may branch into placement pursuit and consulting/PMO/finance/execution advisory while remaining linked to the same source-backed event.

---

# 29. PREMIUM LATIMUS UX

Do not build disconnected dashboards. Re-administer the UI into a cohesive institutional workspace.

Primary navigation should include Command Center, Executive Office, Intelligence, Markets, Signals, Opportunities, Prospecting, Companies, Contacts/POCs, CRM/Relationships, Outreach, Clients, Engagements, PMO, Finance, Construction, Real Estate, Technology, Logistics, Energy, M&A, Owner/Family Enterprise, Corporate, Reports, Approvals, Sources, Knowledge, Job Center, Settings/Security.

Use a global command palette, global entity search, saved views, column chooser, filters/sorting, virtualization/pagination, keyboard navigation, evidence drawer, activity timeline, breadcrumbs, cross-linking among Company/Signal/Opportunity/Contact/Prospect Import/Engagement, bulk actions, status/confidence/source-tier badges, Job Center, notification center, audit/activity history, offline/connection indicator, Extension/Portable mode indicator, provider status, and accessible responsive layouts where feasible.

No fake AI decoration or gratuitous animation.

---

# 30. COMMAND CENTER

Synthesize executive priorities/approvals/engagements/risks/collections/decisions; intelligence signals/EOS/source health/yield/stale evidence/watchlists; prospecting jobs/processed rows/verified/candidates/unresolved/review queue/last export/funnel; commercial outreach/follow-up/discovery/proposals/conversion/next actions. Every summary deep-links to underlying records.

---

# 31. COMPANY 360 & CONTACT 360

Company 360 is the shared bridge. Show normalized identity, aliases, addresses, website/domain, industry/NAICS, sectors, ownership/size evidence, imported prospect batches/rows, public signals, evidence timeline, EOS history, Prospect Contact Confidence history, contacts/POCs, company email index, phone/profile evidence, opportunities, CRM/outreach, proposals/engagements, lineage, review flags, cache freshness, restrictions.

Contact/POC 360 shows name, normalized identity, role/function, company, why this person owns the problem, sources, verification status, public profile, email/phone evidence, generic company alternatives, confidence, linked signals/opportunities/import rows, outreach history, suppression, last verified date, next action.

Clearly distinguish verified public business info, user-provided info, candidate/inferred info, and unavailable info.

---

# 32. LOCAL DATA, STORAGE & SECURITY

Do not introduce SQLite/Electron merely because the standalone prospecting spec proposed it. Translate local-persistence requirements into existing LATIMUS browser architecture using IndexedDB, encrypted workspace/vault, migrations, indexes, transactions, blobs/content storage, batch writes, cache metadata, jobs, evidence, source snapshots.

Optional SQLite WASM/OPFS may only be considered if benchmarks prove material benefit and it preserves extension/standalone portability.

---

# 33. NETWORK & SECURITY RULES

Treat CSV cells, websites, HTML, search results, feeds, documents, and AI output as untrusted. Prevent script injection, CSV formula injection, malicious prompt instructions, arbitrary navigation/fetch, cross-account leakage, secret exposure, uncontrolled downloads, HTML injection, unvalidated extension messages. Keep restrictive CSP, bundled code, explicit host permissions, safe DOM rendering, URL validation, content size/type limits, rate control, cancellation, and redacted logs.

---

# 34. LOGGING & AUDIT

Track import/job lifecycle, file hash, mapping version, company resolution, cache hit/miss, crawl/search failures, rate limits, source runs, signal create/merge, evidence updates, score changes, overrides, approvals, exports, external actions. Never log API keys/passwords/plaintext secrets. Provide filter/export for troubleshooting.

---

# 35. PROVIDER / SOURCE HEALTH CENTER

Unify health views for search providers, all intelligence sources, Google, PMsuite, AI providers and optional integrations. Show configured/not configured, live/manual/imported, last success/failure, failure reason, next due, rate limit, credentials required, extension-only/portable limitation, tested/untested. Never display Connected without an actual successful test.

---

# 36. CRM & OUTREACH HANDOFF

Prospecting results become active CRM contacts only after user selection/approval. Before CRM/outreach: deduplicate, preserve provenance/evidence, apply suppression, validate merge fields, display verification, show prospect/import source, require authorization for external send.

Signal-based opportunities continue to use EOS qualification. Imported CSV prospecting does not require EOS because the user deliberately selected the list, though opportunity-fit indicators may be calculated separately.

---

# 37. EXPORT

For prospecting, preserve all original columns, append enrichment fields, never overwrite source columns, support UTF-8 CSV, protect against spreadsheet formula execution where appropriate, preserve record IDs, and export selected/all/filtered rows.

For intelligence, support signals/opportunities/source registry/source health/FIRMS/CONTACTS/POC review/CRM import/PMsuite exchange/management reports.

---

# 38. QUALITY & TESTING — PROSPECTING

Test CSV parsing, arbitrary-column preservation, auto mapping, mapping override, file-hash duplicate detection, name/company/domain/URL/phone/email normalization, company matching, duplicate clustering, generic email detection, person/email affinity, title normalization, confidence classification, inferred-vs-observed separation, company-first cache reuse, stale refresh, cancellation, batch resume, provider failure, 429, malformed HTML, malicious content, XSS cells, CSV formula injection, export/re-import, and large-file virtualization. Use fictional samples only.

---

# 39. QUALITY & TESTING — 7-SECTOR INTELLIGENCE

Test source-registry completeness/metadata/health, signal detection, date handling, entity resolution, deduplication, evidence tiers, A1 evidence gate, EOS/versioning, POC threshold, outcome-owner mapping, multi-sector routing, Permit Score vs EOS separation, source outage/staleness/manual import/duplicate ingestion, source yield, signal-to-opportunity, and signal-to-revenue attribution where defensible.

---

# 40. STATE-OF-THE-ART PERFORMANCE TARGETS

Benchmark 100/1,000/10,000-row prospect files, repeated-company vs unique-company, cached vs uncached, extension vs portable HTML, and low-memory Chromebook-class conditions where testable. Measure parse/normalization/database/UI/cache/memory/cancel/recovery/request/export performance. Optimize observed bottlenecks; do not invent numbers.

---

# 41. CODEX SKILL/HARNESS UPDATES

Keep the existing Codex harness but add four focused skills if missing:

- `prospect-csv-ingestion`
- `prospect-enrichment`
- `intelligence-source-deployment`
- `premium-workspace-ui`

Update existing skills as needed: `intelligence-sources`, `market-intelligence`, `signals-entities-evidence`, `opportunity-poc`, `crm-outreach`, `commercial-lifecycle`, `browser-platform`, `local-data-security`, `durable-workflows`, `security-privacy`, `verification-release`.

Do not create dozens of overlapping micro-skills.

---

# 42. PLAN RE-ADMINISTRATION

Do not invalidate completed phases. Update `PLANS.md` and phase files using additive integration tracks:

A. Prospecting Core — CSV import/mapping/preservation/history/durable jobs/company linkage.  
B. Prospect Enrichment — resolution/caching/public research/provider/extraction/evidence/confidence/review/export.  
C. 55-Source Expansion — registry/deployment tiers/adapters/imports/health/cadence.  
D. Unified Commercial Handoff — preserve CSV-vs-signal provenance while linking Company/Contact 360, CRM, outreach, opportunities, engagements.  
E. Premium UX/Performance — Command Center, Prospecting, Job Center, Evidence Drawer, 360 views, virtualization, benchmarks/hardening.

If the repo is past the original insertion point, retrofit via explicit migration rather than resetting the project.

---

# 43. REQUIRED END-TO-END ACCEPTANCE SCENARIOS

1. CSV with supplied websites: import → mapping → company verification → one company crawl → person match → evidence/confidence → review/export; all original fields preserved.
2. CSV without websites: configured extension search resolves company; ambiguity routes to review; enrichment continues only after resolution.
3. Duplicate company: hundreds of rows sharing the same company reuse one company enrichment/cache plus person-specific matching.
4. No search provider: website-supplied rows still use supported company-site enrichment; unresolved rows report limitations truthfully.
5. Government award: source → company → signal → evidence → EOS → outcome owner → POC gate → opportunity brief.
6. Multi-source construction event: TDLR + municipal + company evidence become one signal; Permit Score and EOS remain separate.
7. Large-load project: one event routes to justified Energy/Technology/Construction/Real Estate/Finance implications without duplicates.
8. Cross-system same company: a CSV prospect and later Tier A signal link to one Company 360 while preserving separate origins, evidence, Contact Confidence, EOS, and workflow states.

---

# 44. DEFINITION OF DONE FOR THIS RE-ADMINISTRATION

This expansion is complete only when existing LATIMUS functionality remains intact or has a tested migration; Prospecting is CSV-first; all input columns are preserved; mappings are overrideable; jobs are resumable/cancellable; company-first cache/research works; contact data is source-backed; observed vs inferred email is separated; privacy boundaries are respected; Contact Confidence is explainable; all 55 sources exist with truthful support state; Tier 1/2/3 status is visible; signal/EOS/source-tier models work; EOS, Permit Score and Contact Confidence are separate; Company 360 joins CSV prospecting and signal intelligence cleanly; raw source intelligence does not silently enter Prospecting; intelligence does not silently become CRM; external sends remain controlled; extension mode runs without hosting; portable HTML runs supported local functions without hosting; the UI is cohesive/professional; large grids are performant; jobs survive supported interruption; provider/source health is truthful; tests/traceability/independent review pass; limitations are documented; no required stub/TODO/mock remains.

---

# 45. EXECUTION ORDER — START NOW

1. Inspect current LATIMUS repo/harness and run current verification.
2. Create a safe checkpoint.
3. Read the two supplied new requirements in full: the 7-Sector Data Source Master Plan and Local Prospect Enricher specification.
4. Translate them into LATIMUS requirements rather than separate apps.
5. Update AGENTS/GOALS/PLANS/traceability/decisions/phase files.
6. Add the four focused skills if missing.
7. Extend data models for prospect imports/rows, email index, evidence/source relations, and intelligence fields.
8. Build the smallest complete prospecting slice: CSV → mapping → normalization → persistence → result/export.
9. Extend to company resolution → company-first enrichment → contact evidence → confidence → review.
10. Reconcile/expand the 55-source registry and Tier 1/2/3 deployment.
11. Integrate both into Company/Contact 360, Job Center, CRM/outreach and Command Center.
12. Run tests and benchmark fixtures; fix failures.
13. Require independent review.
14. Continue through remaining incomplete LATIMUS phases.

Do not stop after scaffolding, screens, or adapter names. Do not claim a source works because it is in the registry. Build the upgraded LATIMUS as a seamless, non-hosted, institutional-grade Executive Intelligence system.

# Build a Complete Local Prospect Enrichment Desktop Application

You are building a production-quality desktop application named:

**Local Prospect Enricher**

The application must be a complete working product, not a prototype, mockup, partial scaffold, or collection of examples.

The purpose of the application is to accept raw CSV lead/business data, resolve the correct company and company website, discover publicly available professional/business contact information, match discovered information to a specified owner/contact, assign confidence scores, preserve source evidence, and export enriched CSV data.

The application should compete with commercial contact-enrichment products for targeted SMB/business-owner datasets while remaining fully local from an infrastructure perspective.

The application must NOT require the user to operate or deploy:

- a cloud server
- a web server
- AWS
- Azure
- Vercel
- Firebase
- Supabase
- MongoDB server
- PostgreSQL server
- Express server
- PHP hosting
- Docker
- Kubernetes
- a separate backend service

The application should run as a standalone desktop application.

Use:

- Electron
- HTML
- CSS
- JavaScript
- Node.js
- SQLite for local persistence

External public search APIs may optionally be used directly from the Electron main process, but the application itself must not require any server controlled by the user.

The initial supported search provider should be Brave Search API.

Do not expose API credentials in renderer/browser JavaScript.

---

# 1. PRIMARY PRODUCT GOAL

The user may have lead records containing any combination of:

- company name
- business name
- company address
- business address
- owner name
- contact name
- decision-maker name
- title
- role
- phone
- website
- domain
- LinkedIn URL
- existing email
- city
- state
- ZIP code
- arbitrary additional columns

The application must use whatever evidence exists in each record.

The minimum useful record may be as little as:

- company name
- company address
- owner/contact name

Other fields are optional.

The application must try to determine:

- official company domain
- official company website
- company/business phone
- publicly available company emails
- publicly available professional work email for the specified person
- relevant public professional profile reference when available
- confidence score
- source URL
- evidence supporting the match

The application must not invent an email and claim it is verified.

If the correct work email cannot be confirmed from public evidence, return:

- candidate
- not found
- company only

as appropriate.

---

# 2. DATA SAFETY AND SCOPE

The application is for discovering public professional/business contact information.

Prioritize:

- company work emails
- business phone numbers
- corporate websites
- official company contact information
- professional profile references
- business ownership and leadership information

Do not build functionality designed to discover hidden/private personal information.

Do not scrape authenticated/private LinkedIn pages.

LinkedIn URLs may be:

- accepted from input
- discovered through public search-engine results
- used as identity evidence

Do not automate login to LinkedIn.

Do not create code for bypassing anti-bot systems or CAPTCHA systems.

---

# 3. DESKTOP ARCHITECTURE

Use Electron.

Project architecture should resemble:

```text
local-prospect-enricher/
├── package.json
├── main.js
├── preload.js
├── lib/
│   ├── database.js
│   ├── enrichment.js
│   ├── search.js
│   ├── crawler.js
│   ├── extractors.js
│   ├── scoring.js
│   ├── company-resolver.js
│   ├── normalization.js
│   └── csv.js
├── app/
│   ├── index.html
│   ├── styles.css
│   └── renderer.js
└── assets/
```

You may improve this structure where appropriate.

Keep responsibilities separated.

Do not put the entire application in one file.

---

# 4. ELECTRON SECURITY REQUIREMENTS

Use secure Electron defaults.

Required:

```javascript
contextIsolation: true
nodeIntegration: false
sandbox: true
webSecurity: true
```

Use a preload script and `contextBridge`.

Expose only explicitly required functions to the renderer.

Do not expose:

- `require`
- `fs`
- arbitrary IPC
- arbitrary shell execution
- Node internals

Validate IPC senders.

The renderer must never receive the Brave Search API key.

Network operations must occur in the Electron main process or trusted Node modules.

Use a restrictive Content Security Policy.

Disable unnecessary navigation and popup creation.

---

# 5. LOCAL DATABASE

Use SQLite.

Preferred package:

```text
better-sqlite3
```

The application must automatically create and migrate its own local database.

No separate SQLite installation should be required.

Suggested schema:

## companies

Fields:

```text
id
normalized_name
display_name
address
city
state
postal_code
domain
website
business_phone
domain_confidence
resolution_method
last_enriched_at
created_at
updated_at
```

## people

```text
id
company_id
normalized_name
display_name
title
linkedin_url
work_email
business_phone
email_confidence
email_status
last_enriched_at
created_at
updated_at
```

## emails

```text
id
company_id
person_id nullable
email
domain
local_part
is_generic
status
confidence
first_seen_at
last_seen_at
```

## phones

```text
id
company_id
person_id nullable
phone
normalized_phone
type
confidence
first_seen_at
last_seen_at
```

## evidence

```text
id
company_id
person_id nullable
field_type
value
source_url
source_type
context
confidence
discovered_at
```

## crawled_pages

```text
id
domain
url
content_hash
last_crawled_at
status_code
```

## jobs

```text
id
status
total_records
processed_records
verified_records
candidate_records
failed_records
started_at
completed_at
```

Add indexes where useful.

Use transactions where appropriate.

Avoid duplicate rows.

---

# 6. CSV IMPORT

The app must support drag-and-drop CSV import.

Also support selecting a file manually.

CSV characteristics may vary.

Examples:

```csv
Business,Owner,Street,Telephone
ABC Roofing,Robert Jones,"123 Main St Dallas TX",2145551212
```

or:

```csv
company_name,address,contact_name,website
XYZ Plumbing,"400 Oak Ave Austin TX",Jane Doe,xyzplumbing.com
```

or:

```csv
Account Name,Decision Maker,LinkedIn,Phone,Notes
Smith HVAC,John Smith,https://linkedin.com/in/example,8175551212,Priority
```

The program must preserve ALL original columns in export.

Do not discard unknown input columns.

---

# 7. AUTOMATIC COLUMN DETECTION

Automatically detect likely mappings for:

```text
company
address
person
title
phone
website
linkedin
email
city
state
postal_code
```

Recognize common aliases.

For example:

Company:

```text
company
company name
business
business name
organization
account name
employer
```

Person:

```text
owner
owner name
contact
contact name
decision maker
decision maker name
person
full name
executive
principal
```

Phone:

```text
phone
phone number
telephone
business phone
company phone
mobile
```

Website:

```text
website
web site
domain
company url
business url
url
```

Email:

```text
email
email address
work email
business email
contact email
```

LinkedIn:

```text
linkedin
linkedin url
profile
profile url
linkedin profile
```

Display the automatically selected mappings before enrichment starts.

Allow the user to override all mappings.

---

# 8. COMPANY RESOLUTION

Company identity resolution is critical.

If a website/domain exists in the input:

1. normalize it
2. validate it
3. treat it as a strong clue
4. verify company identity where practical

If no website exists, resolve the company using combinations of:

```text
"Company Name" "Street Address"
"Company Name" "Street Address" official website
"Company Name" "Phone"
"Company Name" official website
```

Use:

- company name similarity
- business address
- city
- state
- ZIP
- supplied phone
- search snippets
- website text
- company name on website

to avoid selecting the wrong company.

Do not assume the first search result is correct.

Produce:

```text
domain
website
company_confidence
company_resolution_method
```

Possible methods:

```text
input_website
input_email_domain
search_name_address
search_name_phone
search_company_name
cached_company
```

---

# 9. COMPANY-FIRST ENRICHMENT

This is extremely important.

The app must NOT crawl the same company once for every row.

Group and cache companies.

For example:

```text
500 rows belonging to acme.com
```

should approximately result in:

```text
1 company crawl
+
person-specific matching/search
```

not:

```text
500 identical company crawls
```

Use both:

- in-memory cache during the active job
- SQLite persistent cache across future jobs

Before crawling a domain, check when it was last enriched.

Allow configurable cache freshness such as:

```text
7 days
30 days
90 days
always refresh
```

---

# 10. COMPANY WEBSITE CRAWLER

Crawl public HTTPS pages.

Start with likely paths:

```text
/
 /about
/about-us
/company
/team
/our-team
/people
/leadership
/management
/staff
/owners
/owner
/contact
/contact-us
```

Discover additional internal links when URL/anchor text contains:

```text
team
people
leadership
management
owner
founder
executive
staff
bio
profile
contact
about
```

Respect sensible limits.

Configurable options:

```text
max pages per company
request timeout
concurrency
request delay
```

Do not aggressively hammer websites.

Only follow the same company domain during the company crawl.

Avoid binary/static files.

Reject extensions such as:

```text
.jpg
.jpeg
.png
.gif
.svg
.webp
.ico
.css
.js
.woff
.woff2
.ttf
.zip
.mp3
.mp4
.avi
.mov
```

Do not crawl LinkedIn.

---

# 11. EXTRACTION ENGINE

Extract public business information from company pages.

Support:

## Email extraction

From:

```html
<a href="mailto:person@company.com">
```

Visible text:

```text
person@company.com
```

Structured data:

```text
application/ld+json
```

Simple obfuscation:

```text
person [at] company [dot] com
person (at) company (dot) com
```

Store:

```text
email
source_url
source_type
context
```

Source types:

```text
mailto
page_text
structured_data
search_snippet
external_public_page
```

## Phone extraction

Support:

```html
<a href="tel:+12145551212">
```

Visible business-phone patterns.

Structured data.

Normalize phone digits.

Preserve original display value where practical.

## LinkedIn references

Extract LinkedIn profile/company URLs found on company pages.

Do not crawl LinkedIn pages.

---

# 12. WEB SEARCH

Support Brave Search API.

Keep the API key exclusively in the main process.

Store it using Electron `safeStorage` when OS-backed encryption is available.

Never place the key in:

- renderer JavaScript
- localStorage
- HTML
- exported CSV
- logs

Search queries should adapt to the available evidence.

Person searches may include:

```text
site:company.com "John Smith"
site:company.com "John Smith" email
"John Smith" "@company.com"
"John Smith" "Acme Roofing" email
"John Smith" "Owner" "Acme Roofing"
"@company.com" "John Smith"
```

Company domain-wide searches may include:

```text
"@company.com"
site:company.com "@company.com"
```

Search result snippets themselves may contain useful evidence.

Collect emails appearing in snippets.

Public third-party pages may also be fetched when appropriate.

Limit the number of external pages fetched.

Do not crawl blocked/social platforms.

---

# 13. EMAIL DISCOVERY MODEL

Do not simply generate email addresses and mark them verified.

The system should search for publicly observed addresses.

For each company, build a local email index containing:

```text
john.smith@company.com
j.smith@company.com
mary@company.com
sales@company.com
info@company.com
```

Then determine which discovered address best matches the target contact.

---

# 14. EMAIL IDENTITY MATCHING

Score discovered work emails using evidence such as:

## Company domain match

Strong signal:

```text
email domain == resolved company domain
```

Example:

```text
john@acme.com
```

for:

```text
acme.com
```

## Exact person name near email

Very strong signal.

Example page content:

```text
Robert Johnson
Owner & Founder
robert.johnson@company.com
```

## Partial person-name match

Examples:

```text
Robert Johnson
rjohnson@company.com
```

or:

```text
Bob Johnson
bob@company.com
```

## Title match

Example:

```text
Chief Executive Officer
```

matching:

```text
CEO
```

Implement reasonable title normalization where practical.

## Company-name context

Use nearby company references.

## Source location

More confidence if the email appears:

- on the official company website
- in a `mailto:` link
- in structured organization/person data
- on an official team page

## Email local-part affinity

Compare:

```text
john.smith
jsmith
john
smithj
```

to the contact name.

---

# 15. GENERIC EMAIL HANDLING

Detect generic addresses:

```text
info@
contact@
hello@
sales@
support@
office@
admin@
billing@
marketing@
press@
media@
careers@
jobs@
recruiting@
hr@
legal@
privacy@
```

Do not match these as an individual's verified work email.

However, preserve useful generic company email separately as:

```text
enriched_company_email
```

---

# 16. CONFIDENCE SYSTEM

Confidence must be explainable.

Suggested categories:

## Verified

```text
80–100
```

Requirements should include strong identity evidence.

Example:

```text
person name appears near email
email domain matches company
non-generic address
supporting company/title evidence
```

## Candidate

```text
55–79
```

Likely address but insufficient evidence to claim verification.

## Weak

```text
below 55
```

Do not output as the primary contact email.

Suggested statuses:

```text
verified_work_email
candidate_work_email
company_only
not_found
company_not_resolved
insufficient_input
error
```

Do not inflate scores.

Fail closed.

---

# 17. OPTIONAL EMAIL-PATTERN INFERENCE

If implemented, inferred email patterns MUST be stored separately from verified emails.

Example:

```text
inferred_email = john.smith@company.com
inferred_email_confidence = 35
inferred_email_pattern = first.last
```

Never place an inferred address into:

```text
enriched_work_email
```

unless independently observed from a public source.

Do not perform SMTP mailbox probing.

Do not use SMTP VRFY/RCPT enumeration.

---

# 18. PHONE MATCHING

If the input already includes a business phone, preserve it.

Use it as company-resolution evidence.

If the website provides a public business phone, capture it.

Prefer:

```text
input verified business phone
company contact phone
office phone
main company line
```

Do not attempt to discover private/home numbers.

---

# 19. LINKEDIN HANDLING

If input contains a LinkedIn URL:

- preserve it
- use it as an identity clue

If public search results identify a matching LinkedIn profile:

- preserve the URL
- match by person/company/title evidence

Do not crawl LinkedIn itself.

Do not automate login.

Do not scrape authenticated LinkedIn content.

---

# 20. EXPORT FORMAT

Preserve every original CSV field.

Append enrichment fields.

At minimum:

```text
enriched_status
enriched_domain
enriched_website
enriched_company_confidence
enriched_company_resolution
enriched_person
enriched_title
enriched_work_email
enriched_email_confidence
enriched_email_quality
enriched_company_email
enriched_business_phone
enriched_linkedin
enriched_email_source
enriched_phone_source
enriched_sources
enriched_pages_checked
enriched_company_emails_found
enriched_evidence
enriched_last_checked
```

Example:

```csv
Business,Owner,Address,enriched_status,enriched_domain,enriched_work_email,enriched_email_confidence
ABC Roofing,Robert Jones,"123 Main St Dallas TX",verified_work_email,abcroofing.com,robert.jones@abcroofing.com,96
```

---

# 21. UI REQUIREMENTS

Build a professional dark-mode interface.

The UI should feel like commercial enrichment software.

Main workflow:

```text
1. Configure search
2. Import CSV
3. Review automatic column mapping
4. Configure enrichment
5. Start
6. Watch progress
7. Review results
8. Export CSV
```

Include:

- CSV drag/drop
- file selector
- row count
- column count
- automatic column mapping
- mapping overrides
- search API settings
- concurrency setting
- crawl-page limit
- request delay
- external evidence-page limit
- cache freshness
- start button
- cancel button
- progress bar
- current record
- processing counts
- final summary
- table preview
- CSV export

---

# 22. PROGRESS DASHBOARD

While running, show:

```text
total records
completed
percentage
verified emails
candidate emails
company-only records
not found
errors
companies resolved
companies cached
pages fetched
search requests
elapsed time
```

Update the dashboard during execution.

The UI must remain responsive.

Do not freeze the renderer.

---

# 23. RESULT PREVIEW

Show useful fields first:

```text
status
company
person
domain
work email
confidence
company phone
LinkedIn
source
```

Allow horizontally scrolling through the remaining original/enrichment fields.

Preview at least 100 results efficiently.

Do not render tens of thousands of table rows simultaneously.

---

# 24. JOB CANCELLATION

Implement proper cancellation.

Use `AbortController`.

Cancellation must stop:

- active HTTP work where possible
- queued searches
- queued crawls
- pending record processing

The application must recover cleanly and allow another job afterward.

---

# 25. CONCURRENCY AND RATE CONTROL

Use controlled concurrency.

Suggested defaults:

```text
record concurrency: 4
max company pages: 15
external pages: 4
request delay: 300 ms
timeout: 12 seconds
```

Allow users to adjust these within safe ranges.

Handle:

```text
429
timeouts
network errors
invalid HTML
redirects
broken websites
TLS failures
malformed URLs
```

Retry transient failures conservatively.

Do not create uncontrolled Promise storms.

---

# 26. CACHE STRATEGY

Use several cache layers.

## HTTP in-memory cache

Do not request the same page repeatedly during a run.

## Company in-memory cache

Do not re-enrich the same domain during a run.

## SQLite persistent cache

Reuse:

```text
resolved domain
company phone
emails
phones
evidence
crawl metadata
```

between runs.

The user should be able to choose:

```text
use cache
refresh stale
force refresh
```

---

# 27. DUPLICATE COMPANY DETECTION

Records may use slightly different names:

```text
ABC Roofing
ABC Roofing LLC
ABC Roofing, LLC
ABC Roofing & Construction
```

Use:

- normalized company name
- address
- domain
- phone

to identify likely duplicates.

Once the same domain is resolved, merge company enrichment intelligently.

---

# 28. NORMALIZATION

Create reusable utilities for:

## Company names

Normalize:

```text
LLC
L.L.C.
INC
INC.
CORP
CORPORATION
CO
COMPANY
```

when comparing.

Do not destroy the original display name.

## Names

Normalize:

```text
Robert J. Smith
Robert Smith
Bob Smith
```

where practical.

Preserve original value.

## URLs

Normalize:

```text
www.
http
https
trailing slash
fragments
```

## Phone numbers

Store normalized digits plus original formatting.

## Emails

Lowercase and normalize.

---

# 29. SOURCE EVIDENCE

Every enriched value should ideally retain evidence.

Example:

```json
{
  "email": "john.smith@acme.com",
  "source": "https://acme.com/team/john-smith",
  "sourceType": "mailto",
  "context": "John Smith, President ... john.smith@acme.com",
  "confidence": 97
}
```

Source traceability is one of the product's core differentiators.

---

# 30. LOGGING

Add a local application log.

Log:

```text
job start/end
errors
company resolution
crawl failures
API errors
rate limits
database errors
```

Never log:

- search API keys
- passwords
- secret tokens

Provide a simple way to open or export logs for debugging.

---

# 31. ERROR HANDLING

Errors in one record must not terminate the whole job.

Examples:

```text
bad URL
invalid domain
network timeout
search API unavailable
website offline
malformed CSV row
strange encoding
blocked website
empty record
```

Record errors and continue.

---

# 32. SEARCH API KEY STORAGE

Use Electron `safeStorage`.

If OS encryption is available:

```text
encrypt before storing
```

If not available:

- clearly inform the user
- allow local fallback only with a warning

Provide:

```text
save key
replace key
remove key
test search connection
```

Never render the saved API key back into the UI.

Only show:

```text
Configured
Not configured
```

---

# 33. BUILD/DISTRIBUTION

Use `electron-builder`.

Support:

## Windows

Portable executable or installer.

## macOS

DMG.

## Linux

AppImage.

Add package scripts such as:

```json
{
  "scripts": {
    "start": "electron .",
    "dist": "electron-builder",
    "dist:win": "electron-builder --win portable",
    "dist:mac": "electron-builder --mac",
    "dist:linux": "electron-builder --linux AppImage"
  }
}
```

---

# 34. FIRST-RUN EXPERIENCE

On first launch:

1. initialize SQLite
2. show welcome state
3. explain that no cloud server is required
4. allow optional Brave API configuration
5. allow CSV import immediately
6. show which features require web search

The app should still work for records containing company websites if no search API is configured.

---

# 35. DATA FLOW EXAMPLE

Input:

```csv
company,address,owner,phone,website
Bob's HVAC,"415 Commerce St Fort Worth TX",Robert Johnson,,
```

Process:

```text
Bob's HVAC
+
415 Commerce St Fort Worth TX
+
Robert Johnson
        ↓
resolve official company
        ↓
bobshvacdfw.com
        ↓
crawl company site
        ↓
discover public emails
        ↓
search public web for Robert Johnson + company
        ↓
robert.johnson@bobshvacdfw.com
        ↓
source:
https://bobshvacdfw.com/about
        ↓
context:
Robert Johnson — Owner & Founder
robert.johnson@bobshvacdfw.com
        ↓
confidence 97
        ↓
verified_work_email
```

---

# 36. DIFFERENT POSSIBLE RESULT

If the system discovers:

```text
rjohnson@bobshvacdfw.com
```

but cannot strongly associate the source with Robert Johnson:

```text
candidate_work_email
confidence 61
```

Do not mark it verified.

---

# 37. COMPANY EMAIL INDEX

For every enriched company, maintain a local email index.

Example:

```json
{
  "domain": "acme.com",
  "emails": [
    {
      "email": "john.smith@acme.com",
      "generic": false
    },
    {
      "email": "mary@acme.com",
      "generic": false
    },
    {
      "email": "info@acme.com",
      "generic": true
    }
  ]
}
```

This allows future contacts at the same company to be matched without rediscovering everything.

---

# 38. PERFORMANCE REQUIREMENTS

The app should be designed to process:

```text
hundreds
thousands
tens of thousands
```

of CSV rows.

Do not load unnecessarily huge DOM structures.

Do not repeatedly crawl the same company.

Do not perform the same search repeatedly.

Do not render all records simultaneously.

Use database batching and transactions.

Use indexing.

Avoid memory leaks.

---

# 39. CODE QUALITY REQUIREMENTS

All code must be complete.

Do not leave:

```text
TODO
placeholder
implement later
stub
mock function
pseudo-code
```

for required functionality.

Do not create empty functions.

Do not comment out required logic.

Every referenced module must exist.

Every import must resolve.

The application must launch after:

```bash
npm install
npm start
```

Do not require the developer to invent missing pieces.

Use:

- descriptive function names
- small modules
- clear error messages
- reusable normalization utilities
- JSDoc where useful
- async/await
- controlled concurrency

Avoid unnecessary frameworks.

Do not use React unless there is a compelling technical need.

Plain HTML/CSS/JavaScript is preferred for the renderer.

---

# 40. TESTS

Add meaningful automated tests for:

```text
email normalization
phone normalization
domain normalization
company-name normalization
automatic CSV mapping
generic-email detection
person/email affinity scoring
company matching
confidence classification
deduplication
```

Use Node's built-in test runner or a lightweight test framework.

Provide:

```bash
npm test
```

---

# 41. SAMPLE DATA

Include:

```text
sample-data/sample-leads.csv
```

with fictional businesses.

Do not include real people's personal information in sample data.

Example:

```csv
company,address,owner,title,phone,website,linkedin
Example Roofing LLC,"100 Demo St Dallas TX 75000",John Example,Owner,,,
Example HVAC,"200 Sample Ave Austin TX 75000",Jane Example,President,,https://example.com,
```

---

# 42. README

Create a detailed `README.md`.

Include:

- what the software does
- installation
- running locally
- Brave API setup
- CSV format
- automatic mapping
- enrichment process
- confidence definitions
- database/cache behavior
- security
- packaging Windows/macOS/Linux
- troubleshooting
- limitations
- explanation that not all people publish individual work emails

---

# 43. IMPORTANT PRODUCT PRINCIPLE

Optimize for:

```text
precision first
recall second
```

A false verified email is worse than `not_found`.

The application should be able to say:

```text
I found the company but could not confidently identify the person's individual work email.
```

That is acceptable.

---

# 44. FUTURE-READY ADAPTER DESIGN

Structure web-search logic behind an adapter interface.

Example:

```javascript
class SearchProvider {
  async search(query, options) {}
}
```

Initial implementation:

```text
BraveSearchProvider
```

Design so future providers could be added without rewriting the enrichment engine.

Similarly, make company/public-data sources extensible.

---

# 45. FINAL ACCEPTANCE CRITERIA

The project is complete only when all of the following are true:

1. `npm install` succeeds.

2. `npm start` launches the desktop UI.

3. User can drag/drop a CSV.

4. Arbitrary original columns are preserved.

5. The program automatically proposes field mappings.

6. User can modify those mappings.

7. Records with supplied websites can be enriched without a search API.

8. Records lacking websites can use Brave Search when configured.

9. Search credentials never enter renderer JavaScript.

10. Company websites are resolved using multiple evidence signals.

11. Company pages are crawled.

12. Public company-domain emails are extracted.

13. Public business phone numbers are extracted.

14. Relevant LinkedIn references can be preserved without scraping LinkedIn.

15. Emails are scored against the specified person's identity.

16. Generic emails are kept separate from personal work emails.

17. Verified and candidate emails are differentiated.

18. Every chosen email has a source URL where evidence exists.

19. Duplicate companies reuse cached data.

20. SQLite persistence works between application restarts.

21. Jobs can be cancelled.

22. Errors on one record do not terminate the entire batch.

23. Progress updates display in real time.

24. Results can be previewed.

25. Results export to CSV.

26. Original input fields remain in exported CSV.

27. Windows packaging works through `npm run dist:win`.

28. No cloud server controlled by the user is required.

29. There are no required TODOs, placeholders, stubs, or missing functions.

30. README and tests are included.

---

# 46. DEVELOPMENT INSTRUCTION

Before writing code:

1. inspect the full requirements
2. create the complete file structure
3. decide module responsibilities
4. implement the database and application foundation
5. implement CSV mapping
6. implement company resolution
7. implement search provider abstraction
8. implement crawler/extractors
9. implement scoring
10. implement persistent caching
11. implement Electron IPC
12. implement UI
13. implement cancellation/progress
14. implement export
15. implement tests
16. run the tests
17. fix all failures
18. run the Electron application
19. resolve runtime/import/security errors
20. verify that a sample CSV can complete the full workflow

Do not stop after scaffolding.

Do not merely explain how to build the application.

Actually create every required source file and all implementation code.

When a design choice is ambiguous, choose the approach that is:

1. secure
2. maintainable
3. local-first
4. evidence-driven
5. efficient for large CSV batches

Do not ask for confirmation for routine implementation decisions.

Continue until the repository is in a runnable state.

At completion, provide:

```text
1. project tree
2. important architectural decisions
3. commands to install/run/test/build
4. any genuine remaining limitations
```

Do not claim a feature works unless it was actually implemented.
# LATIMUS · Cross-Sector Executive Intelligence

A local-first Executive Office for THE CONSULT. **Version 0.4.0 is a working integrated alpha**, not completion of the entire master directive. It runs without a hosted backend, paid service, AI provider, or FORWARD installation.

## Use the built app

For GitHub downloads, choose **Code → Download ZIP**, extract it, and open the **deliverables/** folder. It contains the portable HTML, extension ZIP and complete build ZIP. The dist/ paths below are generated development outputs; identical ready-to-use artifacts are copied into deliverables/.

**Portable:** Open `dist/LATIMUS.html` in a current desktop Chrome browser. All code and styles are bundled; there are no CDN or network dependencies. Create a workspace with a passphrase of at least 12 characters. Optionally include explicitly fictional demonstration records. In file mode, **Export workspace before closing**—file mode does not silently write a file or use browser persistence. Keep the HTML, encrypted workspace JSON and your passphrase. To resume, open the HTML and choose **Restore encrypted file**.

**Extension:** Unzip `dist/LATIMUS-extension.zip`. Open Chrome's extension management, enable developer mode, choose **Load unpacked** and select the extracted folder containing `manifest.json`. Click LATIMUS to open a full-tab workspace. Browser mode stores only encrypted ciphertext in IndexedDB. Uninstalling the extension or clearing browser data can remove that vault; export backups. The bundled public manifest key gives the unpacked extension a stable identity. No content-script, browsing-history or broad tabs permissions are requested. Native source pulls request their official origin. CSV prospect research declares optional HTTPS access because company domains come from your files; starting selected research requests exact company/root-www grants plus public DNS safety checks. Brave is an optional private background search provider. Nothing is granted automatically.

Cloud Chromium blocks local-file URLs and unpacked extensions through managed policies. The built HTML's exact bundle, portable adapter and offline behavior are tested through an HTTP test fixture. Direct file and extension acceptance must be completed on an unmanaged target desktop; see `docs/ACCEPTANCE.md`.

## CSV Prospecting and the source master

**Prospecting** starts with your CSV. Import → confirm or override mapping → normalize → start processing/research → inspect evidence and contact confidence → accept selected rows → explicitly promote to CRM or export. Every original source column is retained, including duplicate headers and unmapped fields. Original values are never overwritten by public research. See [Prospecting guide](docs/PROSPECTING.md).

Portable Core performs local import/review/export and can inspect research included in an encrypted backup. Fresh website research requires Advanced Mode. Supplied company websites work without a search subscription; missing websites can be resolved through an optional Brave key imported securely from a local file in Provider Settings. No key is bundled. Search candidates require explicit company-domain permission before page research; re-run selected rows after approving it.

The **55-source master** lives in Sources with deployment priorities, metadata, current support and CSV receipts. Property-only INT-015–INT-022 remain disabled. Existing TDLR, USAspending and FMCSA adapters cover parts of three plan entries; Austin and Census are supplemental. Other active sources support authorized source-file intake, not automatic portal scraping. Source receipts never silently create prospect batches, signals, CRM contacts or scored opportunities. See [coverage and limitations](docs/55_SOURCE_COVERAGE.md).

## A useful first workflow

1. Create a new empty workspace or a clearly labeled demonstration workspace.
2. In **Sources**, configure a public adapter and use **Pull now**, or register a manual/import source. A public-source pull records actual success/failure, query filters, facts, dates and response hash; registration alone never fetches or verifies data. See docs/SOURCE_RETRIEVAL.md for live-verification limits.
3. In **Intelligence**, capture a company event with dates, source reference, observed excerpt, your need hypothesis and EOS components. JSON batch import is also available.
4. Review source evidence and mark it reviewed/verified or contradicted. Qualification requires EOS 65+, current reviewed A/B evidence or corroborated C evidence from distinct source hosts, and no contradictions. Tier D alone never qualifies.
5. Qualify the signal. In **Opportunities**, progress it through discovery/proposal stages. Record actual outcome evidence when marking won or lost.
6. Use **CRM / Relationships** for contacts and draft preparation. **Approvals** records exact-content human decisions; nothing is sent. Suppression blocks drafting and revokes existing approval records.
7. Set up a **won** opportunity as an engagement, with an accountable owner, approved budget, baseline and acceptance criteria. Track delivery tasks, risks, decisions and milestones in **PMO**.
8. Use **Finance** for deterministic source-linked workpapers: pricing, cash, construction, property, fleet, energy and M&A. No rates or market assumptions are invented. Export before leaving the workbench; those separate exports are plaintext.
9. Queue an **Executive Brief** in **Reports**. The local job commits its artifact and execution receipt together, resumes while unlocked, and avoids duplicate artifact execution. Review/export the brief, or export a bounded manual AI review packet.
10. Export your encrypted workspace regularly, especially before changing devices.

Sample records are fictional and visibly labeled. They prove local workflows; they are not live intelligence, verified contacts, actual contracts or revenue.

## Develop and verify

Use Node 24 (validated: 24.19.0), npm 11, and the existing repository checkout. Cloud tasks are already isolated; do not create a worktree unless requested.

```sh
cd /workspace/LATIMUS-
npm ci --cache /workspace/.npm-cache --no-audit --no-fund
npm run build
npm test
npm run test:browser
```

The browser suite uses `/usr/bin/chromium` in this cloud machine. Build before unit tests because distribution-contract tests inspect generated artifacts. Browser tests start/reuse Vite on port 5173. `npm run dev` supports development; the delivered app needs no server. `?mode=portable` previews explicit-save behavior over HTTP for managed-browser validation.

- `dist/LATIMUS.html`: self-contained portable application.
- `dist/extension/`: unpacked MV3 distribution.
- `dist/LATIMUS-extension.zip`: loadable extension archive.
- `src/domain/`: shared types, validation, intelligence, calculations, owner policy and local jobs.
- `src/platform/`: encryption, encrypted storage and startup.
- `src/ui/`: interface, forms and financial workbench.
- `source-spec/`: original controlling documents, preserved.
- `BUILD_STATE.md`, `REQUIREMENTS_TRACEABILITY.md`, `NEXT_ACTIONS.md`: honest progress and remaining requirements.

## Current limits

Five fixed public-source adapters are implemented. USAspending, Austin, TDLR and FMCSA passed live API-level checks after the network allowlist took effect. Census data needs a free owner API key. Full browser/extension live acceptance is still unverified; see docs/SOURCE_RETRIEVAL.md. Model inference, mail/calendar/business connectors, external writes, automated POC enrichment, invoice issuance and a general background scheduler are not connected. AI is manual task-packet handoff. Jobs execute only while the workspace is open and unlocked; closed browsers cannot monitor. Source freshness is 90 days in the current versioned policy. Operator-reviewed evidence is an assertion by the local user, not independent source authentication.

The 15-module registry preserves scope and states partial/planned status. Full market rankings, commercial document lifecycle, general durable dependencies/outbox, owner/family records, corporate workflows, complete sector operations and learning analytics remain in the roadmap. The original 152 role lines and 67 services are preserved without claiming individual implementation.

See `docs/SECURITY.md` for security boundaries and recovery; `docs/ACCEPTANCE.md` for exact verification and platform gaps.

Current owner scope: defer real-estate deed/CAD/ownership/acquisition and vacancy/listing data for now. Construction/facility permits and SEC debt/refinancing remain in scope. All original trigger requirements are preserved in docs/TRIGGER_SOURCE_ACCEPTANCE.md; deferred items are not deleted from the product specification.

For explicit live API verification in the cloud runtime (no fixtures), run `NODE_USE_ENV_PROXY=1 node_modules/.bin/vite-node scripts/check-live-sources.ts`. This uses the existing platform HTTPS proxy/CA trust and makes at most a two-record pull per adapter. Optional CENSUS_API_KEY must come from secure environment settings. API-level verification does not establish browser/extension acceptance; cloud Chromium currently rejects the environment's certificate chain.

# LATIMUS · Cross-Sector Executive Intelligence

A local-first Executive Office for THE CONSULT. **Version 0.1.0 is a working integrated alpha**, not completion of the entire master directive. It runs without a hosted backend, paid service, AI provider, or FORWARD installation.

## Use the built app

**Portable:** Open `dist/LATIMUS.html` in a current desktop Chrome browser. All code and styles are bundled; there are no CDN or network dependencies. Create a workspace with a passphrase of at least 12 characters. Optionally include explicitly fictional demonstration records. In file mode, **Export workspace before closing**—file mode does not silently write a file or use browser persistence. Keep the HTML, encrypted workspace JSON and your passphrase. To resume, open the HTML and choose **Restore encrypted file**.

**Extension:** Unzip `dist/LATIMUS-extension.zip`. Open Chrome's extension management, enable developer mode, choose **Load unpacked** and select the extracted folder containing `manifest.json`. Click LATIMUS to open a full-tab workspace. Browser mode stores only encrypted ciphertext in IndexedDB. Uninstalling the extension or clearing browser data can remove that vault; export backups. The bundled public manifest key gives the unpacked extension a stable identity. No host, content-script, browsing-history, network or broad tabs permissions are requested.

Cloud Chromium blocks local-file URLs and unpacked extensions through managed policies. The built HTML's exact bundle, portable adapter and offline behavior are tested through an HTTP test fixture. Direct file and extension acceptance must be completed on an unmanaged target desktop; see `docs/ACCEPTANCE.md`.

## A useful first workflow

1. Create a new empty workspace or a clearly labeled demonstration workspace.
2. In **Sources**, register a manual/import source and its evidence tier. Registration does not fetch or verify data.
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

No live source retrieval, model inference, mail/calendar/business connector, external writes, automated POC enrichment, invoice issuance, or general background scheduler is connected. AI is manual task-packet handoff. Jobs execute only while the workspace is open and unlocked; closed browsers cannot monitor. Source freshness is 90 days in the current versioned policy. Operator-reviewed evidence is an assertion by the local user, not independent source authentication.

The 15-module registry preserves scope and states partial/planned status. Full market rankings, commercial document lifecycle, general durable dependencies/outbox, owner/family records, corporate workflows, complete sector operations and learning analytics remain in the roadmap. The original 152 role lines and 67 services are preserved without claiming individual implementation.

See `docs/SECURITY.md` for security boundaries and recovery; `docs/ACCEPTANCE.md` for exact verification and platform gaps.

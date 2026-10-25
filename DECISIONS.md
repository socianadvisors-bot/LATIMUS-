# LATIMUS architecture and security decisions

Date: October 24, 2026 (America/Chicago).

## D01 — Existing checkout, independent product

The selected repository was empty and had no commits or remote branches before the pack was added. Build LATIMUS here, preserving its Git identity. Do not rename/move the repository solely to match the pack's conceptual directory name. No FORWARD source, runtime, storage, database, auth or migration is shared. Future exchange requires a versioned explicit boundary.

## D02 — Shared browser core and two distributions

Use TypeScript domain functions and React UI bundled at development time. Build one self-contained HTML file and a Manifest V3 full-tab extension from the same entry point. Node/npm are development tools only; the packaged local runtime does not require a server or terminal. The extension contains no content scripts or generic network/message bridge. Browser/OS compatibility must be demonstrated, not inferred from packaging.

## D03 — Encrypted workspace boundary

Use Web Crypto AES-256-GCM, random 96-bit IV per write, random 128-bit salt per workspace, nonextractable derived keys, and PBKDF2-SHA256 at 310,000 iterations. Envelope format is explicitly versioned and has authenticated context. Never persist passphrases or plaintext workspace records. IndexedDB stores ciphertext; portable file mode requires explicit encrypted export. Lock drops the live workspace/key reference; idle and prolonged-hidden handling limit exposure. This is local device software, not an authenticated multiuser authority system.

Capacity is capped at 16 MB serialized plaintext so produced encrypted files remain within the 24 MB restore limit. The current schema is v1; unsupported versions are rejected. A future version needs explicit migration tests. Recovery cannot reset a forgotten passphrase.

## D04 — Serialized writes and replacement

Workspace actions run through a serialized in-tab queue. Persistent writes compare the expected encrypted envelope within an IndexedDB readwrite transaction, rejecting another tab's newer state. Restore is queued, previews identity/counts/revision, downloads the previous encrypted vault even if locked, and replaces instead of silently merging. Backups retain their original passphrase. Imports with bad schema, broken links or invalid encryption cannot partially update state.

## D05 — Evidence confidence independent from opportunity score

EOS version `eos-1.0.0` is the explicit integer sum of bounded 30/25/20/15/10 components. Human-assigned components are estimates, not automated proof. A score of 65+ alone is insufficient: qualification also needs current, human-verified Tier A/B evidence or reviewed Tier C evidence from at least two different source hostnames; Tier D alone cannot qualify. Contradictions block. Event, publication and import freshness use an explicit conservative 90-day policy; no silent score learning or override is implemented.

Company normalization is conservative exact/alias matching. Conflicting domains and ambiguous names require human identity review; no fuzzy auto-merge. The manual/imported source tier is operator assigned and does not imply authenticated authority. A verified checkbox records an operator assertion, not independent source retrieval.

## D06 — Preparation and approval without external execution

All implemented work is local preparation or local record update. Outreach approval hashes bind company, contact, destination, subject/body, policy version and expiration. Qualification, contact status, suppression, unresolved merge fields and expiration are checked. Suppression revokes prior approval records. Approval does not send mail, sign contracts, create invoices or authorize regulated professional work. Connected sends and standing permissions require future design and tests.

## D07 — Financial units and rounding

Represent monetary amounts as safe integer cents, use BigInt ratio arithmetic internally, and round half away from zero at cent/basis-point output boundaries. Pricing accepts approved loaded rates/hours and direct costs, defaults to 10% contingency on the full base, 50% target gross margin and 40% reference floor. Price = cost ÷ (1 − margin); display markup separately. Below-floor output flags human exception and cannot create an authorization. No rates are invented. Cash carries actual arithmetic balances without balancing plugs. Each additional calculator states exclusions and requires source/assumption references in its exported workpaper.

## D08 — Integrated alpha sequencing

Build one bounded functional path across foundation, intelligence, commercial preparation, delivery records and reporting instead of representing the full roadmap as implemented. This records the principal implementer's sequencing exception for dependency-spanning alpha work; it does not waive the owner's product requirements or claim any phase acceptance gate complete. All unimplemented requirements remain in traceability and the roadmap.

## D09 — No phantom connections or roles

Only local tools and assisted manual handoff operate in this version. No live source, AI inference, Google/business connector, background monitoring or external write is claimed. The complete original 152-role/67-service ledger is retained; rows are not implementation and reference positions are not active agents. Fictional sample records are opt-in and explicitly labeled.

## Source correction and owner deferral (0.2)

- Restore the original21-row sourcing table as the acceptance boundary. Real estate is temporarily deferred at the owner's request; company/finance, construction, awards, workforce, fleet, energy and risk sourcing remain required. No reliable direct free owner-exit signal is promised.
- Add three fixed public request adapters with opt-in per-host extension permissions and exactly matching CSP origins. No generic URL fetch bridge, hidden proxy, paid infrastructure or injected authentication is introduced.
- Treat retrieved records as unreviewed staged facts. Do not turn a permit contractor into an owner, a funding notice into received funds, job-post counts into proven net hiring, or a fleet census snapshot into fleet growth. Do not invent event/publication dates or opportunity scores from a fetch.
- Retain current query parameters on each receipt; historical success is not freshness for new filters. Failed/zero/never-attempted outcomes remain distinct. Live acceptance requires actual official responses and distribution-level CORS/permission evidence.

## Official live validation correction (0.3)

- Current runtime networking now permits the saved official hosts. Stop treating historical CONNECT403 as the active blocker. Use Node24's supported NODE_USE_ENV_PROXY option for the native test runner; never add a product backend just for source access.
- Census actually requires a free API key and2023metadata usesNAICS2017. Choose the published metadata variable instead of guessing by year; never fabricate a key or persist it in a source receipt.
- USAspending's default time filter can include old contracts with recent activity. Use documented new_awards_only so base transaction dates fall in the requested window.
- TDLR's public search POST is verified; preserve registration/work/status semantics. FMCSA first pull is a baseline; compare only comparable dated reported-unit snapshots, without inferring authority issuance or verified expansion.
- No Chromium certificate bypass is allowed. Existing platform CA import did not resolve its TLS error, so distinguish native API acceptance from unverified browser-live distribution behavior.

# Ready-to-use LATIMUS files

Download the repository ZIP from GitHub using Code → Download ZIP, then extract it.

- `LATIMUS.html`: portable app. Open in desktop Chrome; create a passphrase. Export your encrypted workspace before closing.
- `LATIMUS-extension.zip`: extract, then use Chrome Extensions → Developer mode → Load unpacked and select the extracted folder.
- `LATIMUS-build.zip`: original packaged source, application and extension build.
- `SHA256SUMS.txt`: artifact integrity hashes.

Version 0.3 has five public-source adapters. Four passed native official API tests: USAspending, Austin, TDLR and FMCSA. Census needs a free real API key. Browser-live and full trigger acceptance remain unfinished. See the repository README and docs/ACCEPTANCE.md for actual tested features and remaining scope. Direct file and extension loading remain unverified on desktop because the cloud browser blocks them by managed policy. All five adapters are fixture-tested; four official API checks passed and Census data is key-pending. Connected AI and outbound sending are unavailable. The original21-trigger scope has19 active rows and2 property-specific rows deferred by the owner for now. See docs/SOURCE_RETRIEVAL.md and docs/TRIGGER_SOURCE_ACCEPTANCE.md.

# Local security and recovery

## Security boundary

The workspace is a single-owner, single-client-data-container local application, not multi-user authenticated software. Keep each confidential client or owner/family dataset in a separate encrypted workspace file. There is no role-based user authentication, shared organization permission model, cryptographically authenticated audit chain or remote revocation. Workspace imports must be trusted; possessing the passphrase permits editing their contents, including local review claims.

At-rest vault encryption uses AES-256-GCM, fresh 96-bit random nonces on every write, 128-bit salts and PBKDF2-SHA256 at 310,000 iterations. Authentication additional data binds the vault format/version. The derived key is nonextractable and held only while unlocked; passphrases are not saved. PBKDF2 protects a strong passphrase, not a weak one. Workspace plaintext is limited to 16 MiB to keep exported files under the 24 MiB restore limit. Unknown schema/KDF versions and broken record links fail closed. Version 1 has no legacy migration: unsupported versions are rejected rather than guessed.

All persisted application records, audit events and job receipts are encrypted in one IndexedDB envelope in browser mode. File mode uses encrypted explicit export/import. Restores preview name, identity, revision and record counts; replacement requires human confirmation and downloads the prior encrypted vault first. Revisions are replaced rather than silently merged. Do not delete an older backup until the new one is unlocked and checked. Cross-device restore behavior is not yet accepted on every target OS.

Writes use a read-check-write IndexedDB transaction comparing the previously read envelope. A stale tab is rejected instead of silently overwriting another tab's state. Restore operations share the mutation queue; replacing a workspace invalidates queued old-session operations. On save failure, the action is not reflected as committed. Keep the tab open, export the last committed vault, and resolve capacity or stale-tab conflicts. No automatic conflict merge is provided.

## Locking and recovery

Lock clears the active key and visible records. Idle workspaces lock after ten minutes; returning to a tab hidden for two minutes also locks it. Keys and plaintext are live JavaScript objects during the unlocked session; JavaScript garbage collection does not guarantee physical memory zeroization. Locking does not defend against malware, a compromised browser, screenshots or another person controlling the unlocked session. Losing the passphrase has no recovery path.

Encrypted exports retain record IDs, links, device/workspace IDs, schema/revision, source hashes, audit events, artifacts and local jobs. Copying the HTML does not synchronize records. No attachment/blob workflow is implemented yet. Local report jobs run after unlock, not in a browser-closed/locked background. Reports and receipts commit atomically and use job-specific artifact IDs; there is no external executor whose uncertain outcomes could be retried.

## Untrusted data and external action

React renders imported excerpts and report previews as text. Imported signal JSON is strict schema-validated, size/batch bounded, and cannot invoke policy tools or change authorization. Source URL references permit HTTPS only. Financial operations use integer cents and explicit inputs. Exported report text escapes Markdown control characters in source content. Standalone CSP uses a SHA-256 hash of the exact bundled script and allows connections only to api.usaspending.gov, data.austintexas.gov, api.census.gov, www.tdlr.texas.gov and data.transportation.gov. MV3 restricts scripts to bundled code and requires a source-specific optional host grant before network access.

Approval binds recipient, company/contact identity, subject, exact body, policy and expiration by SHA-256. Human approval rechecks current qualification, evidence, destination, content, expiry and suppression. A reviewer name is an operator-entered audit record, not a verified identity or digital signature. No send or material-commitment tool exists. Approval does not transmit messages. External model output cannot confer authority.

Workspace exports are encrypted. Reports, financial workpapers, audit exports and manual AI packets are **plaintext downloads** and may contain sensitive business information. Review the intended recipient and storage location. Manual handoff is opt-in; there are no hidden providers or proxy services. Any future connected integration needs separate source, authentication, policy, live validation and security work.

## Qualified decisions

Financial, legal, engineering, tax, securities and other regulated decisions require appropriately qualified human review and execution. Deterministic calculations, workpaper outputs and module names do not imply professional certification. No owner/family books are implemented or mixed with enterprise books.

## Public-source retrieval boundary (0.2)

Network requests are constructed by five fixed adapter implementations, never by model output, web content or an arbitrary-URL bridge. Requests omit cookies/credentials and referrers, reject redirects, enforce25-second timeout and2MB streamed response limits, and use HTTPS/TLS verification. Source records, settings, response hashes and latest successful/failed receipts are stored inside the encrypted vault. Locking aborts in-flight requests; workspace-generation and filter checks prevent cross-workspace/stale results from being committed. A failed pull does not refresh last-success time or replace good data. Zero successful results are distinct from an outage. Changing filters marks current-filter status unverified while preserving prior snapshot provenance.

Returned content is untrusted and rendered as text. A successful source pull does not certify correctness or create a qualified company, score, POC, send authorization or outreach. User-initiated review remains required. The public response SHA-256 is an integrity/provenance aid, not a signature proving publisher identity. Source-snapshot exports are plaintext and may contain public business or permit fields; review before sharing. Real-estate source feeds are deferred by the owner for now.

## Census key handling

A real free Census key is required by the official data endpoint. The UI accepts it only in transient password state, clears it before the request, and passes it directly to transport. Query authentication uses Census's supported key parameter; the recorded URL omits that parameter. Error messages are redacted before display or persistence. A response unexpectedly echoing the supplied key is rejected. Keys are never bundled, saved in source settings, copied into exports or used for other destinations. Cloud live testing can receive an optional CENSUS_API_KEY through environment settings; its value is not requested in chat.

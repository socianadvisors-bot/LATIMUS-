# Independent review — in-place re-administration

Reviewed October 24, 2026 (America/Chicago). Scope: root-owned prospect actions, workspace/prospect validation, public company research, intake separation and shared-company integration. The reviewer implemented separate CSV/parser domain files, then reviewed these root-owned integration boundaries read-only. This is a bounded engineering review, not formal penetration testing or whole-product certification.

## Initial reproduced findings

The initial run of `tests/prospect-integration.test.ts` executed 17 cases: 12 passed and 5 failed. Each failure was a regression test for an observed correctness boundary; no assertion was disabled to make the run pass.

| Finding | Initial code location | Impact | Disposition |
|---|---|---|---|
| A fabricated `verified_work_email` result with score 100, guessed address and no observed email/evidence was accepted as a job checkpoint | `prospectActions.ts` checkpoint; `prospectValidation.ts` result schema | High: a status string could become verified CRM output without deterministic identity evidence. No external send was implemented by this path. | Resolved: checkpoint and restore recompute supporting observation confidence; regression passed. |
| Same-domain redirects could fetch a robots-disallowed path after the initial requested path passed robots checks | `publicResearch.ts` `fetchPublic` and `researchCompany` crawl loop | Medium: violates configured public-source crawl restrictions; no private authentication or access bypass is authorized. | Resolved: redirect destination policy is checked; regression passed. |
| Robots wildcard and LATIMUS-specific groups were merged, so wildcard allow could override a more-specific agent disallow | `publicResearch.ts` `robotsAllows` | Medium: source instructions could be interpreted incorrectly. | Resolved: specific-agent groups selected before wildcard groups; regression passed. |
| Job finish accepted incomplete selected-row cursors | `prospectActions.ts` `prospects.job.finish` | Medium: prematurely completed jobs could misrepresent work and lose expected resume behavior. | Resolved: unfinished selected rows block completion; regression passed. |
| A paused job could resume while a second job for the same batch was active | `prospectActions.ts` `prospects.control` | Medium: overlapping jobs could overwrite results or duplicate research. | Resolved: another active job blocks resume; regression passed. |

Additional inspected integration issues were sent to root: deduplicating an existing contact needed to preserve accepted CSV lineage so the intentional CSV EOS exception works; a later signal needed to add intelligence origin to an existing CSV-created company. The reverse-origin case already passed in the first regression run after root's update. A specific existing-contact regression was subsequently added; its final outcome must be recorded below.

The pure company-association helper already used whole-phrase boundaries; an explicit regression was added for `Acme` versus `AcmeScam` and `Acme Roofing` versus `ScamAcme Roofing`. This guards against future substring confidence inflation without changing sound existing behavior.

## Passing evidence from the initial integration run

- A schema1 vault with no prospect collections restores to empty additive defaults while retaining identity.
- Import preserves duplicate/unknown raw columns; remapping leaves raw rows unchanged; duplicate file hashes reject atomically.
- Intelligence and CSV share a company master while preserving intake origins, EOS and Permit Lead Score.
- CRM promotion requires explicit accepted review, preserves source/reference/row lineage, permits the CSV-specific EOS exception and still enforces suppression.
- Job checkpoints reject unselected rows and paused updates; serialized state preserves selected and completed scope through resume.
- Source-plan CSV intake records manual intelligence facts and does not create prospect batches, contacts, signals or qualified opportunities. Owner-disabled property feeds reject import.
- URL restrictions reject social, private/auth paths, IP/local hosts and embedded credentials. Permission denial performs no fetch; cross-company redirects and excessive429 retry budgets fail visibly.
- Cancellable delays and in-flight research stop using abort signals. Fixture requests omit credentials and do not use TLS bypasses.
- Public research with a one-page budget made two fixture requests (robots plus one page), retained email evidence and a page hash. Fixture transport is not a live-site or extension test.

## Actual performance observation

The initial root-action benchmark imported and validated 10,000 unique fictional companies/rows in approximately 3,824 ms on this Node 24 Linux cloud machine. Serialized workspace size was 9,577,943 bytes. Exact timestamp/runtime/result is in `/tmp/latimus-prospect-integration-benchmark.json`.

This measures root import action, company linking and full schema validation. It does **not** measure browser responsiveness, background durability, encryption/IndexedDB, a low-memory Chromebook or live network throughput. Inspection found per-row company `.filter` and repeated checkpoint `.includes` operations; root is replacing these with indexes/sets. A later benchmark should be recorded separately rather than implying the first timing already included those optimizations.

The earlier complete enrichment fixture benchmark measured roughly 20–28 MB serialized 10,000-row payloads, exceeding the original 16 MB vault limit. Root raised plaintext/encrypted-import limits consistently to 64 MB/96 MB. Actual large-workspace encrypted round-trip remains a separate acceptance check; capacity constants alone do not prove it.

## Remaining acceptance boundary

Foreground/browser and extension service-worker integration were under construction during this review. No claim is made here that UI workflows, secret-bearing search, live public crawling, tab-close recovery or all 55 source adapters work. The 55-row registry preserves requirements; only actual source runs demonstrate a connection. Property-only feeds remain disabled by owner.

Final rerun results and verified finding dispositions should be appended after root's corrections. Do not mark the expansion complete while the regression suite still fails.

## Final bounded regression checkpoint

After the fixes, the focused command `npx vitest run tests/prospecting.test.ts tests/prospect-integration.test.ts tests/public-research-platform.test.ts` passed **50 tests across three files**: 22 CSV/parser/scoring tests, 23 independent integration tests and 5 independent platform tests. These are executed fixtures, not a live Brave/extension acceptance result.

The integration suite additionally verifies:

- Primary email cannot hide under company-only/non-contact status; supplied company domain and imported person must reconcile with observed named-contact results.
- Accepted CSV lineage survives contact deduplication while original contact origin remains represented; suppression remains effective.
- Fatal-session retry includes unfinished selected rows without discarding already completed checkpoints.
- Successful cached public-page evidence materializes into the shared Tier B source/evidence spine, deduplicated by actual URL and snapshot hash; event/publication dates remain unknown, review remains unreviewed and no signal/opportunity is created. Empty-page failures are not cached or materialized.
- Strong inferred company-domain evidence updates an unassigned linked-company domain without changing raw input. Conflicting existing domains are not silently merged.
- EOS, Permit Lead Score and Prospect Contact Confidence remain distinct after a real checkpoint.
- Actual fetched www URL authority/path is preserved in source observations and shared page evidence; relative links use that actual base.

The last measured root import/validation run recorded **571.91 ms** for the same 10,000 unique fictional rows and 9,577,943-byte workspace (timestamp 2026-10-25T03:50:11.367Z). Timing varies with concurrent cloud load; this is a concrete observation, not an SLA or browser/encryption benchmark.

## Additional broker review communicated to root

Trusted sender validation, workspace-bound decryption, opaque random row capabilities, fixed Brave destination, header-only provider credential use and secret-free response shapes were inspected. Remaining root-owned checks identified during inspection are persisted job pause/cancel revocation of previously authorized capabilities, streaming provider/DNS response limits before allocation, and complete public-address safety handling including IPv6. Separate DNS validation and browser fetch cannot by themselves prove immunity to DNS rebinding; avoid claiming that guarantee. Credential-bearing query URLs also require exclusion from public-only research.

Workspace restore should reconcile prospect/contact backreferences against company scope and completed-job cursors, in addition to ID existence. These follow-up boundaries were sent to root; their final status belongs in the final platform/security acceptance evidence.

Platform reviewer follow-up: the separate platform stream reports 18/18 broker tests, 11/11 runner tests and 5/5 public transport tests passing after fixes for persisted revocation, A/AAAA safety checks, streaming budgets and expiration status. Its source of truth is `docs/platform-independent-review.md`; those counts are reported by that reviewer, distinct from this reviewer’s directly executed 50-test command. Cross-account lineage tests remain under root final integration.

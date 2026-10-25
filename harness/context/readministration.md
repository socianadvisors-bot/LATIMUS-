# Re-administration baseline

Safe Git checkpoint: checkpoint/pre-readministration-a5ea7ea (a5ea7ea78701a85e3d89800382cf094c7b7fc631).
Current verification before material changes: build+strict typecheck passed,61core tests passed,11browser workflows passed;2file/extension managed-policy skips. No lint script exists. No Electron code or dependency exists.

KEEP: shared browser core, React shell, nativeAPI adapters/evidence, source receipts, finance, CRM/policy, AES-GCM vault, CAS serialization, reports and verified fixtures.
EXTEND: Company/Contact/Evidence/origin contracts, encrypted workspace schema, durable jobs, source registry/health, command/navigation, CRM handoff.
NOT BUILT before this track: CSV imports/mapping, company-first enrichment/caching, public site crawl/search adapter, dedicated contact confidence,55master registry, job/review/export workbench.
REFACTOR ONLY WITH EVIDENCE: all-envelope persistence batching/capacity for large CSVs; provider/network worker boundary. No product restart, renumbering or duplicate app/data silo.

Input docs read in full: source-spec/THE_CONSULT_7_Sector_Data_Source_Master_Plan.pdf; source-spec/LOCAL_PROSPECT_ENRICHER_SPEC.md; MASTER_READMINISTRATION_PROMPT.md. The latter controls runtime translation.

Work ownership: domain agent owns prospectTypes/prospecting pure core/tests/benchmark/sample; UI agent will own Prospecting UI/App navigation; root owns shared-model migration/actions, persistence/network worker security,55source registry and integration. Independent review follows implementation; no concurrent edits of owned files.


## Verified integration checkpoint

Final0.4integration evidence is in docs/READMINISTRATION_ACCEPTANCE.md. All independent reproduced correctness/security/lifecycle findings were repaired. File/extension managed-policy acceptance and actual Brave provider remain explicitly unverified; keep original future phase gaps open. Property-only INT-015–INT-022 remain disabled; never silently blend source intake into Prospecting.

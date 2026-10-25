# Integration Track A/B — CSV-First Prospecting & Enrichment

## Hard rule
Prospecting batches originate from user-imported CSV prospect data.

## Vertical slices
1. CSV import -> mapping -> original-column preservation -> normalized prospect rows -> export.
2. Company grouping -> Company 360 linkage -> duplicate review.
3. Company resolution -> company-first cache/research.
4. Public business extraction -> company email index -> evidence.
5. Person/contact matching -> Prospect Contact Confidence -> review.
6. Provider settings -> extension-mode search provider -> truthful standalone limitations.
7. CRM/outreach handoff -> approvals/suppression -> result tracking.
8. Performance/cancellation/recovery/large-file tests.

## Exit gate
A fictional 1,000-row repeated-company fixture completes import, mapping, normalization, grouping, enrichment where evidence exists, review and export without losing original fields or duplicating company research unnecessarily.


## Verified integration checkpoint

Implemented all eight vertical slices as native local/browser workflows. Verification:161core tests and16browser pass,2managed-policy skips; actual10,000-row local encrypted persistence/export benchmark. Advanced broker/site/provider fixtures pass; actual installed-extension +real Brave acceptance remains pending. See docs/READMINISTRATION_ACCEPTANCE.md and three independent review reports.

# AGENTS.md — LATIMUS — Cross-Sector Executive Intelligence

## Repository identity
This repository builds **LATIMUS — Cross-Sector Executive Intelligence** and no other product.

Read `SEPARATION_CONTRACT.md` before architecture, data-model, integration, or repository-boundary decisions. **THE CONSULT FORWARD** is a separate system.

## Source authority
Use:
1. `source-spec/LATIMUS_PRODUCT_DIRECTIVE.md` for full product scope;
2. `GOALS.md` for outcomes/non-goals;
3. `PLANS.md` for phase order;
4. `harness/build/phase-*.md` for the active phase;
5. `REQUIREMENTS_TRACEABILITY.md`, `DECISIONS.md`, and `harness/build-log.md` for implementation state/evidence.

Do not paste the entire source specification into every task. Load only the relevant sections and applicable skills.

## Working method
- Inspect the live repository before editing.
- Preserve sound existing work; refactor/rebuild only with evidence.
- Use test/build output as feedback and repair failures before claiming completion.
- Keep domain/security/calculation logic out of decorative UI components.
- Record unknowns rather than inventing requirements or proof.
- Never present mock/stub behavior as complete.
- Do not push, deploy, purchase services, create paid infrastructure, or perform destructive data operations unless explicitly authorized.
- Do not change the other product repository.

## Planning
For material work, follow the active phase plan in `harness/build/`.
Update:
- `harness/context/<phase>.md` with discoveries/constraints;
- `harness/build-log.md` with observed progress/test evidence;
- `REQUIREMENTS_TRACEABILITY.md` with requirement status;
- `DECISIONS.md` for material architectural/security/formula decisions.

## Multi-agent policy
Use specialist subagents only when tasks are independent and bounded. Prefer 1–3 concurrent workstreams. Do not allow agents to edit the same files concurrently. The root agent owns integration, scope and phase completion.

### Specialist role playbooks
- `principal-architect` — Own scope, architecture, phase sequencing, separation, requirement coverage, and cross-module synthesis.
- `browser-platform` — Own MV3, portable HTML, local data, encrypted workspace, browser lifecycle, packaging, and cross-platform behavior.
- `data-intelligence` — Own source registry, ingestion, markets, signals, entity resolution, evidence, EOS, POC mapping, and intelligence analytics.
- `workflow-security` — Own durable jobs, Tool Broker, approvals, external-action controls, security, recovery, and auditability.
- `enterprise-delivery` — Own commercial lifecycle, finance/PMO, sector functions, M&A, owner/family, and corporate operations.
- `ai-reporting` — Own orchestrator/provider behavior, independent review routing, bounded retrieval, reports and artifact quality.
- `independent-reviewer` — Read-only phase/release review for correctness, security, evidence, scope, limitations, and separation compliance.

## Repo-local skills
Use focused skills from `.agents/skills/` when applicable.

- `repo-baseline` — Inspect and re-baseline an existing LATIMUS/Executive AI repository before implementation.
- `browser-platform` — Build LATIMUS's shared browser core, Manifest V3 extension, portable HTML distribution, and cross-platform runtime boundaries.
- `local-data-security` — Implement LATIMUS local structured storage, schema migrations, encrypted portable workspaces, backup/restore, and data boundaries.
- `durable-workflows` — Implement LATIMUS's persistent browser work engine and safe external-action outbox.
- `policy-approvals` — Implement deterministic authorization, approvals, standing permissions, suppression controls, and material-action boundaries.
- `ai-orchestration` — Implement LATIMUS Executive Orchestrator, bounded specialist work, provider modes, manual handoff, and independent review.
- `capability-registry` — Implement versioned LATIMUS runtime capabilities covering all 15 Executive Office modules and original role/service coverage.
- `intelligence-sources` — Build the cross-sector source registry, ingestion adapters, source health, cadence, evidence modes, and truthful failure states.
- `market-intelligence` — Build source-backed market intelligence for geography, sector, subsector, and research prioritization.
- `signals-entities-evidence` — Implement company/entity normalization, signal detection, evidence lineage, deduplication, and review queues.
- `opportunity-poc` — Implement EOS opportunity scoring, evidence confidence, cross-sector routing, outcome-owner mapping, and POC verification gates.
- `crm-outreach` — Implement qualified-account CRM staging, personalized outreach preparation, suppression, send controls, and result tracking.
- `commercial-lifecycle` — Implement LATIMUS's intelligence-to-client commercial lifecycle.
- `finance-pmo` — Implement deterministic finance support plus PMO/delivery/value-realization workflows required by the Executive Office.
- `sector-enterprise-operations` — Implement practical LATIMUS Business, Finance, Construction, Real Estate, Technology, Logistics, Energy, M&A, Owner/Family, and Corporate workflows.
- `reporting-artifacts` — Build audience-adaptive executive, market, opportunity, sector, PMO, corporate, and client artifacts.
- `security-privacy` — Threat-model and secure LATIMUS browser runtime, imported data, messages, connectors, exports, and client/account boundaries.
- `verification-release` — Run LATIMUS tests, cross-platform/offline/recovery acceptance, requirements traceability, and release gates.

## Completion standard
A phase is not complete because code was generated. It requires implementation, tests/evaluations, evidence, traceability updates, limitations, and independent review when required.

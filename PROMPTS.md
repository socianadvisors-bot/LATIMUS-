# PROMPTS.md — LATIMUS — Cross-Sector Executive Intelligence

## Start / resume build
You are in the **LATIMUS — Cross-Sector Executive Intelligence** repository.

Read `AGENTS.md`, `GOALS.md`, `PLANS.md`, `SEPARATION_CONTRACT.md`, the current state files, and the relevant source-spec sections.

This repository is only **LATIMUS — Cross-Sector Executive Intelligence**. Do not merge it with **THE CONSULT FORWARD**, do not create a shared database/runtime, and do not edit the other product repository.

First determine whether the repository is greenfield or already implemented.

If existing, execute the Phase 00 re-baseline using the appropriate repo-baseline skill, preserve sound work/data, run current tests/build, classify KEEP/REFACTOR/REBUILD/REMOVE/NOT BUILT, and update context, traceability, decisions and build log.

Then continue into the next incomplete phase. Do not stop at a plan. Use repo-local skills, bounded specialist subagents for independent work, tests/build feedback, and independent review at phase gates. Fix failures before advancing. Do not report mock/stub functionality as complete.


## Continue current phase
Read the active `harness/build/phase-*.md`, current phase context, build log and traceability. Identify the smallest incomplete vertical slice, implement it, run the required tests/build/lint/typecheck, repair failures, update evidence/state, and continue until the phase exit gate is satisfied. Do not begin the next phase prematurely.

## Independent phase review
Act as the independent reviewer. Do not implement features first. Read the phase plan, diff, tests, build log, traceability and source requirements. Find correctness, security, data-boundary, formula, evidence, recovery and product-separation defects. Record findings in `harness/code_review/<phase>-review.md` with severity, evidence, affected files/requirements and exact acceptance condition for closure.

## Fix review findings
Read the current independent review. Fix material findings in priority order. Add regression tests. Re-run the relevant verification suite. Update the review with resolution evidence; do not simply mark findings closed.

## Release review
Audit the complete requirements/evidence matrix, release artifacts, tests, limitations and separation contract. Verify that untested connectors/platforms are labeled honestly and that no runtime dependency on **THE CONSULT FORWARD** exists.

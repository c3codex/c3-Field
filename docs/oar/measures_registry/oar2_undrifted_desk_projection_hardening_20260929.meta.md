---
oar: OAR2
title: unDrifted Desk Projection Hardening
date: 2026-09-29
operator: op044
status: authorized_for_bounded_execution
surface: undrifted.measuresregistry.com
---

# OAR2 — unDrifted Desk Projection Hardening — 2026-09-29

## Thread confirmation

Operator confirmed the editorial projection model and authorized execution.

## Canonical projection contract

1. Feature is an explicit issue editorial designation. It persists until publication authority changes it.
2. Desk membership, issue membership, and feature designation are independent relationships.
3. Canonical desk keys are:
   - `drift_report`
   - `mapped_and_measured`
   - `structural_standing`
   - `current_state`
4. Each desk resolves the most recently published eligible article across eligible issues, using publication time rather than issue/page/insertion order.
5. A current issue may feature a desk article.
6. Landing-page display precedence is Feature → Desk → remaining Current Issue → Archive. Duplicate display is suppressed without changing underlying relationships.
7. Current Issue means active-issue articles not already displayed as Feature or current Desk occupants.
8. Archived issue/article relationships remain unchanged.
9. A banner follows the resolved article through its registered/runtime-resolved media reference; bucket location must not be assumed.

## Authorized hardening

- Normalize desk-key variants `current`/ `current_state` to canonical `current_state`.
- Normalize `structural_standings`/ `structural_standing` to canonical `structural_standing`.
- Correct the generic unDrifted renderer so desk resolution is publication-wide across eligible published desk pages, while current-issue composition remains active-issue scoped.
- Preserve explicit feature designation independently of desk recency.
- Suppress duplicate rendering by precedence only; do not mutate article relations to deduplicate.
- Correct banner projection to honor resolved article media and registered runtime location rather than a single-bucket assumption.
- Build/test and return exact mutations/evidence.

## Holds / exclusions

No article text rewrite. No PubPAC article-identity or issue-membership rewrite. No bucket consolidation. No durable-custody transfer. No new resolver, PAC primitive, C2ME/EnvPAC primitive, economic rule, or metadata authority. No change to canonical host/DNS. If implementation requires new authority/schema or source publication truth conflicts, HOLD and return evidence.

---
document_type: oar2
authority_level: working
document_scope: runtime_social_publication_authority_audit
title: OAR2 — Audit Runtime Structure, Social Campaign, and Fables Authority
status: proposed
version: v1
operator: op044
system: measures_registry
process_key: audit_runtime_structure_social_campaign_and_fables_authority
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
tags:
  - oar2
  - runtime-structure
  - social-campaign
  - buffer
  - fables-and-myths
  - authority-audit
---

# OAR2 — Audit Runtime Structure, Social Campaign, and Fables Authority v1

## OBSERVED

Root authority and encounter structure were seated, but three unresolved governance checks remain before deployment confidence:

1. Runtime organization may still be concentrated inside `registered_runtime`.
2. Social campaign standing is unclear despite SEAT priority and Buffer setup.
3. Fables and Myths has conflicting standing: published in one manifest, but no article route/content authority found.

Context and token usage are now treated as governed commodities. This audit must be concise, evidence-first, and non-expansive.

## ALIGNED

Audit only.

Do not mutate DB.

Do not mutate runtime.

Do not create routes.

Do not create social URLs.

Do not create article content.

Do not deploy.

Return evidence and recommended next action only.

Authority order remains:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Runtime

## ROUTED

### 1. Runtime directory structure audit

Inspect current runtime organization.

Return:

- current `src/measures_registry` tree summary
- files under `registered_runtime`
- files over reasonable size threshold
- whether `registered_runtime` is acting as monolithic authority
- whether root, lapis, obsidian, crystal, marble, c3_field, and shared concerns are separable
- what must be split before launch, if anything
- what can safely wait until after launch

Confirm whether runtime organization preserves:

- directories organize code only
- Codex/registry owns truth
- renderer does not own encounter authority

### 2. Social campaign standing audit

Audit actual social campaign standing.

Search:

- docs/oar
- docs/seat
- seated registry records
- publication campaign records
- social campaign records
- media campaign records
- Buffer integration/configuration evidence where available

Return:

- whether social campaign exists
- whether Buffer is configured
- connected channels/accounts if discoverable
- approved handles
- exact public URLs if seated
- posting status
- missing standing

Targets:

- X
- Facebook
- Instagram

Do not convert handles into URLs unless exact URL authority is seated or externally configured in campaign records.

### 3. Fables and Myths authority reconciliation

Resolve standing conflict.

Audit:

- `/undrifted` featured article manifest
- publication registry
- publication dispatch
- media map
- docs/oar
- docs/seat
- campaign records

Return:

- authoritative Fables and Myths publication standing
- whether article is published
- whether onsite route exists
- whether Paragraph URL exists
- whether body/content is seated
- whether overlay can open
- what exact record must be added if missing

Do not invent article route or body content.

## VALIDATION

Successful audit returns:

- runtime structure risk classification
- social campaign standing classification
- Fables authority classification
- evidence sources
- next OAR recommendation, if required

## EXPECTED OAR1

docs/oar/measures_registry/oar1_audit_runtime_structure_social_campaign_and_fables_authority_v1.meta.md

## CLOSE

Audit only. No mutation.

---
document_type: oar2
authority_level: urgent
document_scope: seat_folder_reconciliation_audit
title: OAR2 — SEAT Folder Reconciliation Audit Before Final Launch Repair
status: proposed
version: v1
operator: op044
system: measures_registry
process_key: seat_folder_reconciliation_audit_before_final_launch_repair
---

# OAR2 — SEAT Folder Reconciliation Audit Before Final Launch Repair v1

## OBSERVED

Live production does not reflect the submitted SEAT folder as a whole.

Multiple isolated OAR repairs resolved individual seams, but live QA still shows:

- root media not loading as intended
- direct routes only recently normalized
- assessment content still using stale DB authority
- /undrifted loads but does not match approved intended design
- /ai-operations-assessment behaves as a landing page, not the intended assessment encounter
- the runtime appears assembled from partial records rather than one coherent SEAT installation

This indicates the SEAT folder was not reconciled as the single authority surface before runtime deployment.

## ALIGNED

Stop patching symptoms.

Audit only.

Do not mutate DB.

Do not mutate runtime.

Do not deploy.

Do not create routes.

Do not update content.

Do not update media.

Do not touch MAP/payment/social/Paragraph.

Reconcile intended SEAT folder standing against:

- Codex/DB
- media mappings
- route/sequence registry
- renderer/runtime
- live production behavior

Codex remains authority, but the submitted SEAT folder must be checked as the intended implementation package.

## ROUTED

### 1. Locate submitted SEAT folder authority

Find the latest submitted Measures Registry SEAT folder/package.

Return:

- folder path
- included files
- intended surfaces
- intended sequence
- intended media mappings
- intended routes
- intended assessment content
- intended publication/undrifted behavior
- intended footer/c3 Field behavior

If multiple SEAT folders exist, identify latest authoritative submission and list conflicts.

### 2. Build reconciliation matrix

Create a table with one row per intended surface.

Required columns:

- intended surface
- SEAT source file/reference
- intended route or sequence position
- intended DB registry key
- actual DB record
- release_state/access_state
- intended media role
- actual media row/campaign
- intended renderer/component
- actual runtime renderer/component
- actual live behavior if known
- variance classification
- launch blocker yes/no
- required repair type

### 3. Required surfaces to reconcile

At minimum:

- `/`
- intro_hook
- path_choice
- left path selection
- structural_coherence_explainer
- assessment entry
- measures_assessment 7-question set
- contact capture
- result surface
- MAP/payment continuation
- right path selection
- measures_structured_environments media
- About Measures Registry
- official Codexstone seal
- `/undrifted`
- undrifted hero/media
- undrifted dispatch buttons
- Fables and Myths
- Agents With Keys held state
- social links
- Facebook absence
- footer
- c3 Field external redirect

### 4. DB-first verification

For each surface, query Codex/DB first.

Confirm:

- registry_key exists
- route_path where required
- route_authority where required
- release_state
- access_state
- is_active
- content_contract or metadata
- media campaign and media_role
- assessment question source
- publication dispatch standing

If DB is correct and live differs, classify as runtime failure.

If DB is stale/missing, classify as Codex seating failure.

### 5. Runtime verification

Inspect runtime only after DB standing is known.

Confirm:

- route normalization
- route alias
- route unit key
- sequence mapping
- mediaMap lookup
- renderer prop wiring
- missing/fallback branches
- stale hardcoded framework usage
- deprecated authority references

### 6. Live behavior reconciliation

Use available browser QA evidence from operator screenshots and prior OAR1s.

Do not fabricate unavailable browser evidence.

Classify live standing as:

- verified_pass
- verified_fail
- not_browser_verified

### 7. Produce final variance set

Return only actionable variances.

Group by:

- Codex/DB missing or stale
- runtime resolver failure
- media mapping failure
- route/sequence mismatch
- renderer/style mismatch
- live browser verification pending

### 8. Recommend one corrective OAR2

Do not repair during this audit.

Return the exact next OAR2 scope required to seat the full SEAT installation coherently.

The next OAR2 must be a single corrective repair from the reconciliation matrix, not another symptom patch.

## VALIDATION

Audit is complete only when it returns:

- latest SEAT folder authority identified
- reconciliation matrix complete
- DB-first classification complete
- runtime classification complete
- launch blockers separated from post-launch cleanup
- exact next corrective OAR2 recommendation

## EXPECTED OAR1

docs/oar/measures_registry/oar1_seat_folder_reconciliation_audit_before_final_launch_repair_v1.meta.md

## CLOSE

No mutation.

No more isolated repairs until the SEAT folder reconciliation matrix is returned.

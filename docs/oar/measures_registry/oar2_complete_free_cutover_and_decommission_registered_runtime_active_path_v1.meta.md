---
document_type: oar2
authority_level: launch_repair
document_scope: free_cutover
title: OAR2 - Complete FREE Cutover and Decommission Registered Runtime Active Path
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 - Complete FREE Cutover and Decommission Registered Runtime Active Path

## PURPOSE

Complete the FREE cutover now.

Wire EncounterEntry into App.tsx as the active Measures Registry path.

Decommission registered_runtime as active route authority.

Preserve registered_runtime only as rollback and audit trace.

Nothing is invented.
Nothing is assumed.
Evidence precedes mutation.

## OBSERVED

Production deploy succeeded, but the public page sits at:

Resolving registry authority.

Claude identified that launch still uses the old registered runtime file.

The active question is whether to:

1. complete FREE cutover now
2. accept registered runtime as active path

Decision:

Complete FREE cutover now.

Do not keep registered runtime as the active path.

## NATIVE STANDING

Native order:

Codex holds.
Systems align.
Measures determine.
c3 Field arranges.
Optics prove.

FREE is the Frontend Replacement Encounter Environment.

FREE manifests registry-determined and field-arranged encounter state.

FREE must not infer authority.

FREE must not preserve the old registered runtime as public route authority.

Encounter Boundary allows.

Renderer manifests.

Optics proves.

## REQUIRED ACTIONS

### 1. Wire FREE active path

Update App.tsx so Measures Registry public routes resolve through:

- EncounterEntry

not:

- MeasuresRegistryRuntimeRegistered

Required active path:

App.tsx
  ->
EncounterEntry
  ->
EncounterBoundary
  ->
ChamberRouter
  ->
CrystalSeatRenderer
  ->
ObsidianChamberRenderer
  ->
LapisChamberRenderer
  ->
MarbleChamberRenderer
  ->
Optics / EncounterResolution

### 2. Preserve route coverage

FREE must support current public routes:

- /
- /ai-operations-assessment
- /undrifted
- /about
- /about-measures-registry
- /privacy
- /terms
- /map-integrity-governance

If a route is not yet supported by EncounterEntry, add route mapping without restoring registered_runtime authority.

### 3. Wire assessment capture

ObsidianChamberRenderer already has onCaptureAssessment shape.

Wire through EncounterBoundary using existing DB insert logic.

Use the same table:

- measures_iis_eval_gate1_capture

Preserve:

- 7-question assessment
- scoring
- consent behavior
- contact capture fields
- notification_state = queued
- assessment_result_email_consent
- measures_registry_updates_opt_in
- assessment_boundary_acknowledgment
- legal and consent notices

Do not create new assessment schema.

Do not invent capture fields.

### 4. Preserve email dispatch compatibility

Assessment capture rows must remain compatible with:

- dispatch-assessment-notification.ts

Connect capture rows must remain compatible with:

- dispatch-connect-notification.ts

No email dispatch activation change in this OAR.

### 5. Decommission registered runtime active path

Remove registered_runtime from active public routing.

Do not delete files in this OAR unless proven safe.

Mark as:

- rollback_only
- audit_trace_only
- not_active_route_authority

If practical, add source comment or OAR evidence note identifying the old path as rollback only.

### 6. Manifest repair

If /site.webmanifest is returning HTML or invalid JSON, repair it.

Add or correct:

public/site.webmanifest

with valid JSON.

Do not let manifest repair distract from FREE cutover.

## PRESERVE

Do not change:

- DB schema
- scoring logic
- consent copy
- legal copy
- publication standing
- Paragraph standing
- Buffer standing
- Stripe behavior
- MAP payment standing

Do not activate:

- SEAT checkout
- certification
- c3 Key issuance
- social registry
- charitable solicitation
- tax-deductible contribution claims

## VALIDATION

Return OAR1 evidence showing:

1. App.tsx routes Measures Registry through EncounterEntry.
2. registered_runtime is no longer active route authority.
3. / resolves through FREE.
4. /ai-operations-assessment resolves through FREE.
5. /undrifted resolves through FREE or verified FREE-compatible route bridge.
6. /about resolves through FREE or verified FREE-compatible route bridge.
7. /privacy resolves.
8. /terms resolves.
9. /map-integrity-governance resolves.
10. Assessment submission inserts into measures_iis_eval_gate1_capture.
11. Consent behavior is preserved and not preselected.
12. notification_state remains queued on capture.
13. Email dispatch compatibility preserved.
14. No SEAT, certification, c3 Key, tax-deductible, or charitable claim exposed.
15. site.webmanifest is valid JSON or manifest link removed.
16. Build passes.
17. Production black screen at Resolving registry authority is resolved.

## NOTCHAZZ FLAGS

Raise NotChazz if:

- registered_runtime remains active public route authority
- FREE infers missing authority
- assessment schema is invented
- scoring changes
- consent behavior changes
- legal copy changes
- email dispatch compatibility breaks
- payment activates unexpectedly
- SEAT standing is exposed
- c3 Key standing is exposed
- certification is claimed
- secret values are exposed
- operator is governed instead of the work body

## CLOSE

Complete FREE cutover.

The old registered runtime may remain only as rollback and audit trace.

FREE becomes active public encounter path.

Nothing is invented.

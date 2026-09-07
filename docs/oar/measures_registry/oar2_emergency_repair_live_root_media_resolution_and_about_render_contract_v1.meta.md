---
document_type: oar2
authority_level: urgent
document_scope: live_runtime_hotfix
title: OAR2 — Emergency Repair Live Root Media Resolution and About Render Contract
status: proposed
version: v1
operator: op044
system: measures_registry
process_key: emergency_repair_live_root_media_resolution_and_about_render_contract
source_oar1:
  - docs/oar/measures_registry/oar1_live_deployment_and_seat_verification_v1.meta.md
---

# OAR2 — Emergency Repair Live Root Media Resolution and About Render Contract v1

## OBSERVED

Live production verification contradicts expected SEAT standing.

Observed in production:

- intro_hook does not load
- root-authority media not resolving
- right-path media unresolved
- About Measures Registry falls into fallback/plain rendering
- Codexstone seal absent
- stale runtime dependency remains active
- deployment verification occurred without rendered browser proof

If this were a client deployment, incident response would be required.

SEAT remains HELD.

## ALIGNED

Emergency repair only.

No content changes.

No MAP changes.

No payment changes.

No social campaign changes.

No publication changes.

No release-state changes.

No authority changes.

Repair runtime alignment so deployed renderer resolves seated authority exactly as registered.

## ROUTED

### 1. Remove stale runtime authority

Audit all runtime references to:

- measures_registry_crystal_chamber

Determine:

- active dependency
- compatibility layer
- dead code

Remove active runtime dependency.

No production render path may depend on stale Crystal Chamber authority.

### 2. Repair root-authority media resolution

Ensure runtime requests:

- measures_registry_root_authority_v1

Required media:

- intro_hook_video
- about_measures_registry_video
- official_codexstone_seal
- agents_with_keys_cover
- fables_and_myths_cover

Confirm all resolve from seated registry state.

### 3. Remove fallback authority execution

Current behavior:

- root media missing
- renderer substitutes fallback authority

Required behavior:

- seated media renders
- missing media shows missing state
- no authority substitution

Confirm epigraph fallback no longer executes when seated root-authority media exists.

### 4. Repair About Measures Registry render contract

Verify:

- styled surface renders
- video resolves
- content contract renders
- plain fallback view removed
- runtime no longer enters unstyled fallback state

### 5. Repair Codexstone seal rendering

Verify:

- official_codexstone_seal resolves
- visible on right-path sequence
- sourced from seated media authority

### 6. Browser QA capability requirement

If browser verification tooling is unavailable:

STOP.

Install/add required browser QA skill/tooling first.

Return exact missing capability.

Do not mark verification complete.

Do not substitute shell verification.

### 7. Mandatory live browser verification

Required evidence:

- production screenshots
- root intro visible
- path choice visible
- left path visible
- right path visible
- About Measures Registry styled
- Codexstone seal visible
- Undrifted social icons visible
- Facebook absent
- footer visible

Verify:

- desktop
- mobile if available
- browser console
- browser network

Return screenshots.

### 8. Redeploy

Deploy repaired runtime.

Record:

- deployment identifier
- deployed asset
- production URL

### 9. Final validation

Return:

- stale references removed
- media query before/after
- resolved media records
- screenshots
- browser findings
- console findings
- network findings
- deployment identifier
- final SEAT standing

## ACCEPTANCE RULE

No browser proof = No SEAT verification.

SEAT may move to VERIFIED only when:

- intro loads
- root authority media resolves
- About Measures Registry renders correctly
- Codexstone seal visible
- Facebook absent
- browser screenshots returned
- console/network clean

## EXPECTED OAR1

docs/oar/measures_registry/oar1_emergency_repair_live_root_media_resolution_and_about_render_contract_v1.meta.md

## CLOSE

Treat as production hotfix.

Resolve live runtime alignment before any additional launch work.

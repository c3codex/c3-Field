---
document_type: oar1
authority_level: closeout
document_scope: runtime_alignment_repair
title: OAR1 — Repair Root Authority Media Query and Remove Stale Crystal Chamber Runtime Dependency
status: repair_deployed_contract_verified_rendered_verification_held
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_repair_root_authority_media_query_and_remove_stale_crystal_chamber_runtime_dependency_v1.meta.md
deployment_identifier: 906d87e323e375679a6ea02318871cbdfa60748d
final_seat_standing: held_rendered_browser_verification
---

# OAR1 — Repair Root Authority Media Query and Remove Stale Crystal Chamber Runtime Dependency v1

## Closeout

```yaml
closeout:
  status: repair_deployed_contract_verified_rendered_verification_held
  deployment_identifier: 906d87e323e375679a6ea02318871cbdfa60748d
  deployment_commit: "Fix: bind root authority media and omit inactive socials"
  deployment_branch: measures
  remote_ref_verified_equal: true
  production_asset: assets/index-kzkA6V22.js
  production_propagation_confirmed: true
  final_seat_standing: held_rendered_browser_verification
```

## Mutation Boundary

```yaml
mutation_scope:
  runtime_renderer: true
  generated_registry_build: true
  database: false
  content: false
  routes: false
  release_state: false
  map: false
  payment: false
  social_campaign: false
  social_scheduling: false
  publication: false
  paragraph: false
```

Only these runtime source files were repaired:

- `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx`
- `src/measures_registry/registered_runtime/renderers/RegisteredStructuralDrift.tsx`

Generated `dist-registry` route heads and the hashed registry asset were rebuilt and deployed. Existing unrelated worktree changes were not included.

## Stale Reference Audit

```yaml
stale_references_found:
  active_runtime:
    count: 1
    value: measures_registry_crystal_chamber
    location: MeasuresRegistryRuntimeRegistered media campaign query
    classification: active_runtime_dependency
  deprecated_compatibility_branch:
    count: 0
  historical_documentation:
    retained: true
    classification: traceability_only

stale_references_removed:
  active_runtime: 1
  historical_documentation: 0
```

Post-repair source and deployed-bundle inspection both returned no active `measures_registry_crystal_chamber` reference.

## Runtime Query Before / After

Before:

```typescript
.in("campaign_key", [CAMPAIGN_KEY, "measures_registry_crystal_chamber"])
```

After:

```typescript
.in("campaign_key", [CAMPAIGN_KEY, "measures_registry_root_authority_v1"])
```

The repaired production bundle contains `measures_registry_root_authority_v1` and does not contain `measures_registry_crystal_chamber`.

## Fallback Authority Removal

Before:

```typescript
mediaUrl(mediaMap.get("intro_hook_video")) ?? mediaUrl(mediaMap.get("epigraph_video"))
```

After:

```typescript
mediaUrl(mediaMap.get("intro_hook_video"))
```

`epigraph_video` was also removed from the active registered media-role query. Missing `intro_hook_video` state can no longer substitute legacy epigraph authority.

## Social Rendering Correction

Before, a social row with `url: null` rendered a held `<span>` glyph.

After:

```typescript
if (!platform || !url) return null
```

Only social rows with a seated platform and URL render publicly. Therefore:

```yaml
public_social_projection:
  X: visible_active_anchor
  Instagram: visible_active_anchor
  LinkedIn: visible_active_anchor
  Facebook: absent
  null_url_placeholder: absent
  held_indicator: absent
```

The deployed production bundle does not contain the removed `held_missing_url` branch marker.

## Root Authority Media Resolution

Read-only DB evidence applied the repaired campaign and role constraints. All required rows matched and resolved:

```yaml
media_records_resolved:
  intro_hook_video:
    row_present: true
    active: true
    url_resolved: true
    http_status: 200
  about_measures_registry_video:
    row_present: true
    active: true
    url_resolved: true
    http_status: 200
  official_codexstone_seal:
    row_present: true
    active: true
    url_resolved: true
    http_status: 200
  agents_with_keys_cover:
    row_present: true
    active: true
    url_resolved: true
    http_status: 200
  fables_and_myths_cover:
    row_present: true
    active: true
    url_resolved: true
    http_status: 200
  matched_rows: 5
```

The deployed bundle contains all five required media role markers.

## Build and Deployment Evidence

```yaml
build:
  command: npm.cmd run build:registry
  result: pass
  modules_transformed: 103
  generated_asset: assets/index-kzkA6V22.js

deployment:
  commit: 906d87e323e375679a6ea02318871cbdfa60748d
  remote_ref: refs/heads/measures
  remote_ref_equal: true
  production_asset_status: 200
  propagation_poll: 8
```

## Safety Evidence

```yaml
post_deploy_counts:
  map_payment_events: 0
  stripe_webhook_events: 0

safety_confirmation:
  database_mutation: false
  map_mutation: false
  payment_mutation: false
  checkout_session_created: false
  webhook_event_created: false
  social_campaign_mutation: false
  social_posting: false
  social_scheduling: false
  paragraph_publish: false
  publication_mutation: false
  route_mutation: false
  release_state_mutation: false
```

## Verification Standing

```yaml
verification:
  stale_crystal_runtime_authority_removed: pass
  root_authority_campaign_deployed: pass
  fallback_authority_removed: pass
  required_media_rows_match_query: pass
  required_media_urls_http_200: pass
  inactive_social_render_branch_removed: pass
  facebook_public_projection_absent_by_contract: pass
  x_instagram_linkedin_projection_active_by_contract: pass
  rendered_root_intro_hook: held_browser_unavailable
  rendered_path_choice: held_browser_unavailable
  rendered_about_video: held_browser_unavailable
  rendered_codexstone_seal: held_browser_unavailable
  rendered_undrifted_covers: held_browser_unavailable
  rendered_social_interactions: held_browser_unavailable
  console_and_network_findings: held_browser_unavailable
```

The in-app browser connection could not initialize in this execution thread. HTTP shell, deployed-bundle, DB-row, and media-object evidence were kept distinct from rendered browser evidence.

## Final SEAT Standing

```yaml
repair_standing: deployed_and_contract_verified
prior_exact_failures:
  root_authority_campaign_excluded: repaired
  stale_crystal_chamber_dependency: removed
  epigraph_fallback_authority: removed
  facebook_held_glyph_public: removed
final_seat_standing: held_rendered_browser_verification
remaining_gate:
  - rendered production verification of root, right path, undrifted media, and social anchors
```

The bounded runtime repair is complete and deployed. SEAT remains held only because the required rendered production verification could not be performed in this thread; no missing rendered evidence was inferred.


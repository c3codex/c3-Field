---
document_type: oar1
authority_level: closeout
document_scope: live_deployment_and_seat_verification
title: OAR1 — Live Deployment and SEAT Verification
status: held_exact_failures_returned
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_live_deployment_and_seat_verification_v1.meta.md
deployment_identifier: f9797438fd226441c37a1808566bc4a2a450d43b
production_url: https://www.measuresregistry.com
final_seat_launch_standing: held
---

# OAR1 — Live Deployment and SEAT Verification v1

## Closeout

```yaml
closeout:
  status: held_exact_failures_returned
  deployment_performed: true
  deployment_identifier: f9797438fd226441c37a1808566bc4a2a450d43b
  deployment_branch: measures
  remote_ref_verified_equal: true
  production_asset_verified: assets/index-CUHHJPif.js
  production_url_checked: https://www.measuresregistry.com
  final_seat_launch_standing: held
```

The current registry build was built successfully, committed as `Deploy: seat Measures Registry root and publication runtime`, and pushed to `origin/measures`. `HEAD` and `refs/heads/measures` both resolved to `f9797438fd226441c37a1808566bc4a2a450d43b` after the push.

Production propagated from the prior asset to `assets/index-CUHHJPif.js` on the second read-only poll.

## Production Route Shell Evidence

```yaml
route_shells:
  root:
    url: https://www.measuresregistry.com/
    http_status: 200
    title: Measures Registry
    root_mount: true
    deployed_asset: assets/index-CUHHJPif.js
  undrifted:
    url: https://www.measuresregistry.com/undrifted/
    http_status: 200
    title: unDrifted | Measures Registry
    root_mount: true
    deployed_asset: assets/index-CUHHJPif.js
  ai_operations_assessment:
    url: https://www.measuresregistry.com/ai-operations-assessment/
    http_status: 200
    title: AI Operations Assessment | Measures Registry
    root_mount: true
    deployed_asset: assets/index-CUHHJPif.js
  structural_drift:
    url: https://www.measuresregistry.com/structural-drift/
    http_status: 200
    title: Structural Drift | unDrifted
    root_mount: true
    deployed_asset: assets/index-CUHHJPif.js
```

HTTP shell evidence confirms deployment and route reachability only. It does not substitute for rendered interaction, layout, console, or network verification.

## Seated DB Evidence

Read-only privileged evidence confirmed:

```yaml
root_authority:
  registry_key: measures_registry_root
  release_state: released
  access_state: visible
  is_active: true
  runtime_surface: intro_hook
  sequence: intro_hook -> path_choice
  left_path: structural_coherence_explainer -> measures_assessment
  assessment_order:
    - assessment
    - contact_capture
    - result
    - map_continuation
    - payment
  assessment_before_contact_capture: true
  right_path: measures_structured_environments -> about_measures_registry

footer_contract:
  copy: Registered Branch of c3 Field
  link_url: https://measuresregistry.com/c3field
  link_standing: active

undrifted_publication:
  release_state: released
  access_state: visible
  is_active: true
  social_links:
    X: active
    Instagram: active
    LinkedIn: active
    Facebook: held_not_in_launch_scope_with_null_url
  featured_articles:
    Agents With Keys: unpublished
    Fables and Myths: published
  fables_route: /publication/structural_drift/fables_and_myths_dispatch_v1
```

The five root-authority media rows are seated and active under campaign key `measures_registry_root_authority_v1`:

- `intro_hook_video`
- `about_measures_registry_video`
- `official_codexstone_seal`
- `agents_with_keys_cover`
- `fables_and_myths_cover`

## Exact Failures

### 1. Root-authority media campaign is excluded by the deployed runtime query

The deployed runtime requests media only for:

```text
agents_of_chaos_integrity_governance
measures_registry_crystal_chamber
```

It does not request `measures_registry_root_authority_v1`. Therefore the five seated root-authority media rows cannot enter the runtime media map.

Consequences:

- `intro_hook_video` cannot resolve from its seated campaign and the renderer falls back to `epigraph_video`.
- `about_measures_registry_video` cannot resolve.
- `official_codexstone_seal` cannot resolve.
- `agents_with_keys_cover` cannot resolve.
- `fables_and_myths_cover` cannot resolve.

This fails registry-driven rendering and the OAR requirement that the right path render the Codexstone seal. The intro fallback also violates the no-fallback-authority boundary.

### 2. Facebook is not absent in the deployed renderer

DB state correctly seats Facebook with `url: null` and `standing: held_not_in_launch_scope`. The deployed renderer maps null-URL social rows to a visible held `<span>` glyph. Facebook is therefore represented rather than absent.

This fails the explicit `/undrifted` requirement: `Facebook absent`.

### 3. Rendered browser verification is unavailable in this execution thread

The in-app browser connection could not initialize. No screenshots, viewport checks, click-flow checks, console findings, or browser network findings were fabricated or substituted.

The following remain unverified as rendered production behavior:

- root intro hook opening and continuation to path choice
- left-path assessment flow and contact-capture ordering
- result, MAP continuation, and payment-route interaction continuity
- right-path transitions and About surface layout
- `/undrifted` social anchor activation
- Fables and Myths overlay / seated-route interaction
- Agents With Keys held presentation
- footer link click behavior

## Payment and External-Action Safety

Read-only post-deploy counts:

```yaml
payment_safety_counts:
  map_payment_events: 0
  stripe_webhook_events: 0
  checkout_session_created_by_verification: false

external_action_safety:
  map_payment_mutation: false
  database_mutation: false
  social_post_fired_by_verification: false
  social_scheduling_changed_by_verification: false
  paragraph_publish_by_verification: false
  paragraph_update_by_verification: false
```

Existing Buffer Batch 001 remains scheduled under its prior authority. This deployment verification did not call Buffer or Paragraph and did not create a checkout session.

## Route-by-Route Standing

```yaml
verification:
  root:
    shell: pass
    seated_authority: pass
    rendered_flow: held_browser_unavailable
    media_authority: fail_campaign_filter_excludes_seated_rows
  left_path:
    seated_structure: pass
    rendered_flow: held_browser_unavailable
    map_payment_continuity: held_not_interactively_exercised
  right_path:
    seated_structure: pass
    rendered_flow: held_browser_unavailable
    codexstone_seal: fail_campaign_filter_excludes_seated_row
  undrifted:
    shell: pass
    seated_social_urls: pass_x_instagram_linkedin
    facebook_absent: fail_renderer_exposes_held_glyph
    fables_seated_route: pass
    agents_with_keys_held: pass
    rendered_interactions: held_browser_unavailable
  footer:
    seated_copy_and_url: pass
    rendered_link_interaction: held_browser_unavailable
```

## Final Standing

```yaml
final_seat_launch_standing: held
failed_routes:
  - root_media_authority
  - right_path_codexstone_seal
  - undrifted_facebook_absence
held_items:
  - rendered_browser_qa
  - left_path_interaction_continuity
  - right_path_interaction_continuity
  - footer_click_verification
required_before_verified:
  - include measures_registry_root_authority_v1 in the registry media query without fallback authority
  - omit null-url social rows from public rendering so Facebook is absent
  - redeploy
  - rerun full browser route, interaction, console, and network verification
```

SEAT launch is not verified. Exact failures are returned; no DB, MAP/payment, social-scheduling, or Paragraph mutation occurred.


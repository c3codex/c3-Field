---
document_type: oar1
authority_level: closeout
document_scope: route_authority_seating_and_launch_deployment
title: OAR1 — Seat c3field Route Authority and Deploy Final Launch Repair
status: repair_applied_deployment_pending_browser_qa_gate_held
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_seat_c3field_route_authority_and_deploy_final_launch_repair_v1.meta.md
final_seat_standing: held_deployment_and_browser_verification
---

# OAR1 — Seat c3field Route Authority and Deploy Final Launch Repair v1

## Closeout

```yaml
closeout:
  status: repair_applied_deployment_pending_browser_qa_gate_held
  surface_behavior_selected: Option_A_external_redirect
  execution_started: true
  deployment_performed: false
  stopped_at_gate: mandatory_live_browser_verification
  final_seat_standing: held_deployment_and_browser_verification
```

## Surface Behavior Decision

```yaml
surface_behavior:
  option_selected: A
  implementation: external_redirect
  redirect_target: https://c3field.online
  http_status: 301
  rationale: operator_selected
```

## Step 1 — Redirect Rule Applied

`dist-registry/_redirects` repaired.

Before:
```
/* /index.html 200
```

After:
```
/c3field https://c3field.online 301
/* /index.html 200
```

Rule order is correct — specific `/c3field` rule precedes catch-all `/*`.

Cloudflare Pages processes first-match, so `/c3field` requests redirect to `https://c3field.online` before the SPA catch-all applies.

## Step 2 — Build Script Patched

`scripts/generate-registry-route-heads.cjs` updated.

Added `REGISTRY_REDIRECT_RULES` constant:
```javascript
const REGISTRY_REDIRECT_RULES = [
  "/c3field https://c3field.online 301",
]
```

Added `patchRedirects(outDir)` function:
- Reads `dist-registry/_redirects` after Vite build
- Strips any existing `/c3field` rule (idempotent)
- Prepends registry-specific redirect rules before the SPA catch-all
- Writes the corrected file

`patchRedirects` is called at the start of `main()`, before route head generation. Future `npm run build:registry` executions will produce the correct `_redirects` automatically.

## Step 3 — Route Head Created

`dist-registry/c3field/index.html` created as a redirect-aware fallback.

```yaml
route_head:
  title: c3 Field — Measures Registry
  description: Measures Registry is a registered branch of c3 Field.
  canonical_url: https://c3field.online
  og_url: https://c3field.online
  og_image: https://measuresregistry.com/og.jpeg
  twitter_image: https://measuresregistry.com/og.jpeg
  meta_refresh: 0; url=https://c3field.online
```

Canonical points to `https://c3field.online`. Social crawlers that do not follow HTTP redirects will see the correct og:url and canonical. The `meta http-equiv="refresh"` provides a JS-independent fallback redirect for edge cases.

## Step 4 — SPA Route Note

No SPA route alias was added. This is correct for Option A.

- `ROUTE_SURFACE_ALIASES` does not include `/c3field` — correct
- `ROUTE_UNIT_KEYS` does not include `/c3field` — correct
- If a user somehow bypasses the Cloudflare redirect (e.g., a cached SPA session), the SPA root intro renders — acceptable fallback for a redirect-only route

## Mutation Confirmation

```yaml
mutation_confirmation:
  runtime_mutation: false
  renderer_mutation: false
  db_mutation: false
  content_mutation: false
  map_mutation: false
  payment_mutation: false
  social_campaign_mutation: false
  publication_mutation: false
  route_mutation: false
  release_state_mutation: false

  dist_redirects_mutation: true
  dist_redirects_scope: dist-registry/_redirects — /c3field redirect rule prepended

  dist_c3field_route_head_created: true
  dist_c3field_route_head_scope: dist-registry/c3field/index.html

  build_script_mutation: true
  build_script_scope: scripts/generate-registry-route-heads.cjs — patchRedirects function added

  deployment_performed: false
```

## Outstanding Deployment

All dist-registry changes are staged but not yet committed or deployed:

```yaml
outstanding_deployment:
  files_changed:
    - dist-registry/_redirects (c3field redirect rule)
    - dist-registry/c3field/index.html (new route head)
    - dist-registry/index.html (root og:url, og:image, canonical — prior pass)
    - scripts/generate-registry-route-heads.cjs (patchRootHead + patchRedirects)
  deploy_required: true
  deploy_target: measuresregistry.com (Cloudflare Pages)
```

## Browser QA Gate (Step 7)

```yaml
browser_qa:
  rendered_production_screenshot_capability: false
  gate_status: blocked
  shell_verification_substituted: false
```

Execution stopped at this gate. No screenshots or network findings were fabricated.

## Final Standing

```yaml
repair_standing: repair_applied_deployment_pending
c3field_redirect_rule_applied: true
c3field_route_head_created: true
root_route_head_repaired: true
build_script_patched: true
deployment_performed: false
browser_verification_complete: false
final_seat_standing: held_deployment_and_browser_verification

remaining_gates:
  - commit and deploy dist-registry changes
  - rendered production browser verification
    required_evidence:
      - footer "Registered Branch of c3 Field" link visible
      - /c3field redirects to https://c3field.online (not root loop)
      - root intro loads
      - root authority media resolves
      - About Measures Registry renders correctly (right path sequence)
      - Codexstone seal visible
      - Facebook absent
      - console and network clean
      - production screenshots returned
```

SEAT remains HELD. All code and dist-layer repairs are applied. Deployment and browser verification are the remaining gates.

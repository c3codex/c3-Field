---
document_type: oar2
authority_level: urgent
document_scope: route_authority_seating_and_launch_deployment
title: OAR2 — Seat c3field Route Authority and Deploy Final Launch Repair
status: proposed
version: v1
operator: op044
system: measures_registry
process_key: seat_c3field_route_authority_and_deploy_final_launch_repair
source_oar1:
  - docs/oar/measures_registry/oar1_audit_runtime_route_surface_registration_against_seated_encounter_structure_v1.meta.md
---

# OAR2 — Seat c3field Route Authority and Deploy Final Launch Repair v1

## OBSERVED

Route audit returned one launch-standing defect:

`/c3field` — active footer link with no route authority.

Specific state:

- `measures_registry_root.footer_contract.link_url = https://measuresregistry.com/c3field`
- `measures_registry_root.footer_contract.link_standing = active`
- `measures_registry_root.footer_contract.link_target_key = c3_field_our_story`
- `measures_registry_root.undrifted_contract.leadership_callout_target = c3_field_our_story`
- DB record `c3_field_our_story` does not exist in `measures_registry`
- No `ROUTE_SURFACE_ALIASES` entry for `/c3field`
- No `ROUTE_UNIT_KEYS` entry for `/c3field`
- No route head generated for `/c3field`

Two active entry points route to the missing authority:

1. Footer — "Registered Branch of c3 Field" link
2. Undrifted — leadership callout target

Additionally outstanding from prior repair passes:

- Root route head fix (`dist-registry/index.html` — og:url, og:image, canonical) applied but not yet committed or deployed
- Browser verification not yet completed — SEAT remains HELD

## ALIGNED

Seat the missing route authority.

Wire the runtime route.

Deploy all outstanding launch repairs in a single build.

Complete browser QA if available.

No content mutation beyond the c3field authority record.

No MAP changes.

No payment changes.

No social campaign changes.

No publication changes.

No route removals.

Codex remains authority.

## ROUTED

### 1. Determine c3field surface behavior

`c3_field_our_story` must be defined as one of:

**Option A — External redirect:**
- `/c3field` issues an HTTP redirect to `https://c3field.online`
- Implemented via `public/_redirects` rule
- Route head generated with canonical pointing to `https://c3field.online`
- No new SPA surface or renderer required
- Simplest implementation

**Option B — Internal SPA page:**
- `/c3field` renders a surface within the Measures Registry SPA
- Requires new `RegisteredSurface` type entry
- Requires new renderer component
- Requires DB content contract
- Requires full SEO record in `c3_field_our_story`

Operator must select Option A or Option B before execution proceeds.

If Option A: proceed to Step 2A.

If Option B: proceed to Step 2B.

### 2A. Option A — External redirect implementation

Add redirect rule to `public/_redirects`:

```
/c3field https://c3field.online 301
```

Generate a static route head for `/c3field` with:

- title: "c3 Field — Measures Registry"
- canonical_url: https://c3field.online
- og:url: https://c3field.online
- All other fields: measuresregistry.com defaults

Do not create a `c3_field_our_story` DB record.

Do not add a SPA route alias.

Proceed to Step 5.

### 2B. Option B — Internal SPA page: seat DB record

Seat `c3_field_our_story` in `measures_registry` with:

```yaml
registry_key: c3_field_our_story
is_active: true
release_state: released
access_state: visible
metadata:
  unit_key: c3_field_our_story
  route_path: /c3field
  route_authority: registry
  seo:
    title: c3 Field — Measures Registry
    description: <operator-provided>
    canonical_url: https://measuresregistry.com/c3field
    og_type: website
    og_title: c3 Field
    og_description: <operator-provided>
    og_url: https://measuresregistry.com/c3field
    og_image: https://measuresregistry.com/og.jpeg
    twitter_card: summary_large_image
    twitter_title: c3 Field
    twitter_description: <operator-provided>
    twitter_image: https://measuresregistry.com/og.jpeg
  content_contract:
    <operator-defined content>
```

Operator must provide: description, og_description, twitter_description, and content_contract before this step can execute.

### 3. Wire SPA route (Option B only)

In `src/measures_registry/registered_runtime/registeredRuntimeTypes.ts`:

Add `"c3_field_our_story"` to `RegisteredSurface` union type.

In `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx`:

Add to `ROUTE_SURFACE_ALIASES`:
```typescript
"/c3field": "c3_field_our_story",
```

Add to `ROUTE_UNIT_KEYS`:
```typescript
"/c3field": "c3_field_our_story",
```

Add to `PUBLIC_ROUTE_BY_SURFACE`:
```typescript
c3_field_our_story: "/c3field",
```

Add to `REGISTERED_ENCOUNTER_KEYS` if applicable.

### 4. Add renderer (Option B only)

Create `src/measures_registry/registered_runtime/renderers/RegisteredC3FieldOurStory.tsx`.

Wire it into the surface render switch in `MeasuresRegistryRuntimeRegistered.tsx`:

```typescript
} else if (activeSurface === "c3_field_our_story") {
  activeSurfaceElement = (
    <RegisteredC3FieldOurStory
      registryTokenStyle={launchMediaStyle}
      // operator-defined props
      renderHeader={renderHeader}
      renderSystemFooter={renderSystemFooter}
    />
  )
}
```

Renderer must:

- Render with a governed surface class and `data-release-standing="public"`
- Accept content from the DB content contract
- Not render a plain fallback state if content is unseated
- Show a held state with proper release standing if content is missing

### 5. Add route to head generation script

In `scripts/generate-registry-route-heads.cjs`, add to `routeUnits`:

```javascript
{
  routePath: "/c3field",
  unitKey: "c3_field_our_story",
},
```

Skip this step if Option A (external redirect) — no route head from script needed.

For Option A: create `dist-registry/c3field/index.html` manually with redirect-appropriate metadata.

### 6. Build

```bash
npm run build:registry
```

Verify:

- Bundle contains `/c3field` route handling
- `dist-registry/c3field/index.html` generated with correct canonical and og:url
- `dist-registry/index.html` root head correct (og:url measuresregistry.com, og:image absolute, canonical present)
- No stale `crystal_chamber` reference in bundle
- No `c3field.online` in route heads other than c3field canonical (Option A)

### 7. Mandatory browser QA

**Gate — same requirement as prior OAR2.**

If browser verification tooling is unavailable:

STOP.

Return exact missing capability.

Do not mark verification complete.

Do not substitute shell verification.

Required evidence:

- production screenshots
- root intro visible
- path choice visible
- left path visible
- right path visible
- About Measures Registry styled (right path sequence)
- Codexstone seal visible
- footer "Registered Branch of c3 Field" visible and linked
- `/c3field` route resolves (no 404, no loop back to root intro)
- Undrifted social icons visible
- Facebook absent
- footer visible
- browser console clean
- browser network clean

### 8. Deploy

Commit and push repaired runtime to production.

Record:

- deployment identifier (git commit hash)
- deployed asset hash
- production URL confirmed live

### 9. Final validation

Return:

- c3field route authority seating confirmation
- route head generated and deployed
- root route head deployment confirmation
- browser screenshots
- console and network findings
- deployment identifier
- final SEAT standing

## ACCEPTANCE RULE

No browser proof = No SEAT verification.

SEAT may move to VERIFIED only when:

- `/c3field` resolves to either redirect or governed surface (not root loop)
- footer "Registered Branch of c3 Field" link is active and resolves
- root intro loads
- root authority media resolves
- About Measures Registry renders correctly (right path sequence)
- Codexstone seal visible
- Facebook absent
- browser screenshots returned
- console and network clean

## EXPECTED OAR1

docs/oar/measures_registry/oar1_seat_c3field_route_authority_and_deploy_final_launch_repair_v1.meta.md

## OPEN QUESTION — OPERATOR REQUIRED BEFORE EXECUTION

**Step 1 decision required:**

Select Option A (external redirect to c3field.online) or Option B (internal SPA page).

If Option B: provide content for `c3_field_our_story`:
- description (SEO)
- og_description
- twitter_description
- content_contract structure

## CLOSE

Resolve `/c3field` route authority before any additional launch work.

This is the final code-layer repair gate before SEAT can advance to VERIFIED.

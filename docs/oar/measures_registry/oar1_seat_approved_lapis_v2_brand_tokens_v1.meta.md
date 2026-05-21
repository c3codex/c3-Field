---
document_type: oar1
authority_level: execution_closeout
document_scope: measures_registry_brand_tokens
title: OAR1 - Seat Approved Lapis v2 Brand Tokens v1
status: recorded
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_seat_approved_lapis_v2_brand_tokens_v1.meta.md
---

# OAR1 - Seat Approved Lapis v2 Brand Tokens v1

## OBJECTIVE

Seat the approved Measures Registry Lapis v2 brand palette as explicit governed runtime design-token authority.

This OAR1 records token authority seating only.

No CSS rewrite was performed.

No frontend replacement alignment was executed.

No Inanna material token family, phase-map token family, historical Measures token, route, media map, content row, or storage object was removed or changed.

## EXECUTION

Executed:

- `docs/oar/measures_registry/execute-seat-approved-lapis-v2-brand-tokens.cjs`

Evidence written:

- `docs/oar/measures_registry/seat_approved_lapis_v2_brand_tokens_v1.json`

Target table:

    public.measures_design_token

Token registry:

    registry_key = measures_registry
    token_scope = brand
    token_type = color
    media_query = null
    is_active = true

## TOKEN SEATING

Before execution, no active `brand` scoped Lapis v2 token rows were returned for the six approved token keys.

Inserted approved tokens:

| token_key | token_value | role |
|---|---|---|
| `brand_obsidian` | `#0E0E17` | threshold field / primary obsidian surface |
| `brand_deep_lapis` | `#1F2F8D` | primary lapis authority |
| `brand_lapis_night` | `#101A4D` | supporting lapis depth |
| `brand_silver_frame` | `#D7DBE3` | silver frame / formal authority lines |
| `brand_crystal_star` | `#F2F4F8` | crystal star / restrained highlight |
| `brand_marble_accent` | `#C7CBD2` | marble accent / supporting text and formal surfaces |

## METADATA STANDING

Each token was seated with metadata:

- `source_oar2 = docs/oar/measures_registry/oar2_seat_approved_lapis_v2_brand_tokens_v1.meta.md`
- `token_family = measures_registry_lapis_v2`
- `brand_scope = measures_registry_public_runtime`
- `intended_usage`
- `visual_authority_role`
- `launch_status = approved_for_alignment`
- `frontend_replacement_authorized = false`
- `preserves_inanna_material_systems = true`

This confirms the tokens are approved for future alignment, but do not themselves authorize broad frontend replacement.

## RUNTIME READ CONFIRMATION

Runtime/anon read returned all expected rows:

    expectedCount = 6
    actualCount = 6
    missing = []
    allExpectedTokensReadable = true

The runtime can resolve the newly seated token rows through the same table used by `MeasuresRegistryRuntime.tsx`.

## REPLACEMENT ALIGNMENT MAP

Recommended future mapping:

| Current runtime token / surface | Approved brand token |
|---|---|
| `background_obsidian` | `brand_obsidian` |
| `panel_obsidian` | `brand_lapis_night` |
| `accent_cool` | `brand_deep_lapis` |
| `text_primary` | `brand_silver_frame` |
| `text_secondary` | `brand_marble_accent` |
| `text_muted` | `brand_marble_accent` |
| `border_subtle` | `brand_silver_frame` |
| approved star / highlight surfaces | `brand_crystal_star` |

This map is preparation only.

No replacement was executed by this OAR2.

## BOUNDARIES HELD

- No CSS rewrite performed.
- No existing historical token rows removed.
- No Inanna material token systems removed or collapsed.
- No phase-map material tokens removed or collapsed.
- No frontend hardcoded colors introduced.
- No route mutation performed.
- No media mutation performed.
- No content mutation performed.
- No storage mutation performed.

## VALIDATION

Validation passed:

- approved Lapis v2 brand tokens are seated
- token metadata exists
- runtime can read the token rows
- Measures Registry brand token authority is explicit
- replacement alignment map is recorded
- unrelated token families were preserved

## CLOSE

The authority is now seated.

Surface alignment remains a later bounded OAR2.

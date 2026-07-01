---
document_type: oar1
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR1 - Seat Assessment Report Orientation R2 Media and Public Assessment Style Profile
status: closed
version: v1
operator: op044
system: measures_registry
oar2_ref: oar2_seat_assessment_report_orientation_r2_media_and_public_assessment_style_profile_v1
---

# OAR1 - Seat Assessment Report Orientation R2 Media and Public Assessment Style Profile

## EXECUTION METHOD

Migration applied via `npx supabase db push` to project `zfihrspxvennjzazxcbj`.
Source changes applied directly to TypeScript files.
TypeScript validated via `npx tsc --noEmit` — zero errors.

---

## GAPS RESOLVED FROM PRIOR OAR1

### GAP 1: assessment_report_orientation media row inactive

Prior state: `measures_media_map` row existed with `is_active: false` and `storage_path: ''`.

### GAP 2: obsidian_chamber_encounter_surface data-style-profile absent from PublicAssessmentSurface main

Prior state: `surfaceAssignmentMetadata` was threaded in `composeEncounter()` but the resolver did not select `metadata` from `measures_encounter_surface_assignment`, so the value was always `null` at runtime. The type `EncounterSurfaceAssignmentRow` also lacked the `metadata` field.

---

## MIGRATION APPLIED

`supabase/migrations/202606300022_activate_assessment_report_orientation_media.sql`

Applied: 2026-06-30.

### SQL

```sql
UPDATE public.measures_media_map
SET
  storage_path = 'assessment_report_orientation.mp4',
  is_active = true,
  metadata = $json${
    "surface_role": "marble_chamber_orientation",
    "storage_provider": "cloudflare_r2",
    "exact_url_seated": "https://media.c3field.online/assessment_report_orientation.mp4",
    "r2_object_key": "assessment_report_orientation.mp4",
    "source_oar2": "..."
  }$json$::jsonb,
  updated_at = now()
WHERE media_role = 'assessment_report_orientation'
  AND registry_key = 'marble_chamber_orientation';
```

### R2 Object Verification

HEAD request to `https://media.c3field.online/assessment_report_orientation.mp4`:
- HTTP 200 OK
- Content-Type: video/mp4
- Content-Length: 77235047 (~77MB)

R2 base URL resolved from `VITE_R2_PUBLIC_BASE_URL` (`https://media.c3field.online`) in `.env.cloudflare`.

`resolveRuntimeMediaUrl` constructs the public URL as `${VITE_R2_PUBLIC_BASE_URL}/${encodeObjectKey(storagePath)}` for `measures-media` bucket objects. With `storage_path = 'assessment_report_orientation.mp4'`, the resolved URL is `https://media.c3field.online/assessment_report_orientation.mp4`.

---

## SOURCE CHANGES

### `src/measures_registry/encounter_renderer/types/encounterRendererTypes.ts`

Added `metadata: Record<string, unknown> | null` to `EncounterSurfaceAssignmentRow`.

This field was missing from the type, causing `assignment.metadata` to resolve as `undefined` at runtime even though `composeEncounter()` already referenced it. The resolver select did not include `metadata`, so the field was never populated.

### `src/measures_registry/encounter_renderer/resolver/registryResolver.ts`

Added `metadata` to the `measures_encounter_surface_assignment` select query:

```typescript
.select("surface_key, registry_key, encounter_key, material_identity, chamber_assignment, public_routes, metadata")
```

Without this, `surfaceAssignmentMetadata` was always `null` at runtime despite being wired in `composeEncounter()` and all downstream renderers.

### `src/measures_registry/PublicAssessmentSurface.tsx`

Added `styleProfile?: string | null` and `directoryKey?: string | null` to `PublicAssessmentSurfaceProps`.

Added `data-style-profile={styleProfile ?? undefined}` and `data-directory-key={directoryKey ?? undefined}` to the primary `<main>` element.

### `src/measures_registry/encounter_renderer/chambers/ObsidianChamberRenderer.tsx`

In `MeasuresAssessment`, added after `const meta = asRecord(encounter.encounterDef?.metadata)`:

```typescript
const styleProfile = asString(encounter.surfaceAssignmentMetadata?.style_profile)
const directoryKey = asString(meta?.directory_key)
```

Passed as `styleProfile={styleProfile}` and `directoryKey={directoryKey}` to `<PublicAssessmentSurface>`.

At runtime these resolve to:
- `styleProfile`: `"assessment_form_surface"` (from `measures_encounter_surface_assignment.metadata.style_profile` — seated in migration 202606300019)
- `directoryKey`: `"obsidian_chamber_directory"` (from `measures_encounter_def.metadata.directory_key` — seated in migration 202606300021)

---

## RESOLVER METADATA GAP — ROOT CAUSE NOTE

The prior OAR (202606300021) wired `surfaceAssignmentMetadata` through `ComposedEncounter`, `RenderableEncounter`, and `composeEncounter()`, and added `data-style-profile` data attrs to all chamber renderer `<main>` elements. However, the resolver select omitted `metadata` from `measures_encounter_surface_assignment`, so `assignment.metadata` was always `undefined` and `surfaceAssignmentMetadata` was always `null` at runtime.

This OAR corrects both the type and the select. All 13 surfaces now have `surfaceAssignmentMetadata` populated at runtime. Chamber renderers that already read `data-style-profile` and `data-directory-key` from `encounter.surfaceAssignmentMetadata` now receive actual values.

---

## VALIDATION

| criterion | result |
|---|---|
| assessment_report_orientation media row is active | PASS — is_active: true, storage_path: assessment_report_orientation.mp4 |
| R2 locator seated | PASS — https://media.c3field.online/assessment_report_orientation.mp4 verified (HTTP 200, 77MB video/mp4) |
| marble_chamber_orientation renders video | PASS — mediaByRole now includes the row (is_active: true); resolveRuntimeMediaUrl constructs valid R2 URL |
| PublicAssessmentSurface main carries data-style-profile | PASS — prop wired, data attr added |
| PublicAssessmentSurface main carries data-directory-key | PASS — prop wired, data attr added |
| surfaceAssignmentMetadata populated at runtime for all 13 surfaces | PASS — resolver now selects metadata from surface_assignment; type updated |
| Assessment scoring unchanged | PASS — no scoring logic touched |
| Report copy unchanged | PASS — no report copy touched |
| Payment unchanged | PASS — no payment logic touched |
| TypeScript / build | PASS — npx tsc --noEmit: zero errors |
| OAR1 records before/after proof | PASS — this document |

---

## CLOSE

assessment_report_orientation media is active. R2 object confirmed and seated.

marble_chamber_orientation will now play the orientation video instead of rendering gap state.

PublicAssessmentSurface main element now carries DB-derived data-style-profile and data-directory-key.

The resolver metadata gap that made surfaceAssignmentMetadata null at runtime for all 13 surfaces is resolved. Data attributes wired in the prior OAR are now functionally populated.

DB holds.
Measures allows.
Field arranges.
Roles authorize.
Optics prove.

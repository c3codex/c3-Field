---
document_type: oar2
authority_level: working
document_scope: measures_interoperability
title: OAR2 — Measures Registry Glyph Runtime Reference Query v1
status: completed
version: v1
operator: op044
system: measures_interoperability
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: executor
  src: renderer
tags:
  - oar2
  - measures-interoperability
  - glyph-runtime
  - reference-query
  - typescript
  - measures-registry-runtime
source_alignment:
  - OAR1 — Measures Registry Glyph measures_media_map Surface Mapping v1
  - OAR2 — Measures Registry Glyph measures_media_map Surface Mapping v1
  - OAR1 — Measures Registry Glyph codex_media_asset Seating v1
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Measures Registry Glyph Runtime Reference Query v1

## OBSERVED

21 `measures_media_map` glyph rows are confirmed seated:

- `registry_key = 'measures_registry_glyphs'`
- `campaign_key = 'measures_registry_v1'`
- `is_active = false` (all 21 rows)

The current runtime query in `MeasuresRegistryRuntime.tsx` (line 759):

```typescript
const CAMPAIGN_KEY = "agents_of_chaos_integrity_governance"

supabase
  .from("measures_media_map")
  .select("media_role, storage_bucket, storage_path, mime_type, is_active")
  .eq("campaign_key", CAMPAIGN_KEY)
  .in("media_role", [...QUERY_MEDIA_ROLES])
  .order("sort_order", { ascending: true })
```

`QUERY_MEDIA_ROLES` (line 87) contains no glyph roles. `CAMPAIGN_KEY` is the landing campaign.
Glyph rows use `campaign_key = 'measures_registry_v1'` — they are not returned by this query.

The `mediaMap` memo (line 864) filters `.filter((row) => row.is_active !== false)`, which would
exclude all glyph rows even if they were in scope.

No glyph data is accessible to the runtime.

This OAR2 routes the addition of a **reference query** — a second `measures_media_map` query using
the glyph registry and campaign keys. Glyph rows are loaded into an isolated state object. They are
not rendered. They are not activated. The reference query establishes the data pipeline foundation
that a future rendering OAR2 will act on.

## ALIGNED

This OAR2 routes a targeted TypeScript change to `src/measures_registry/MeasuresRegistryRuntime.tsx`:

1. Add constants `GLYPH_REGISTRY_KEY` and `GLYPH_CAMPAIGN_KEY`.
2. Add constant `GLYPH_MEDIA_ROLES` — the full list of 21 glyph media role strings.
3. Add `GlyphReferenceRow` type with extended fields (`encounter_key`, `sort_order`, `metadata`).
4. Add `glyphReferenceRows` state (`GlyphReferenceRow[]`).
5. Add a second `measures_media_map` query inside the existing `Promise.all` in `loadLanding()`,
   scoped to `registry_key = GLYPH_REGISTRY_KEY` and `campaign_key = GLYPH_CAMPAIGN_KEY`.
6. Populate `glyphReferenceRows` from the query result.
7. Build a `glyphReferenceMap` memo (`Map<string, GlyphReferenceRow>`) from `glyphReferenceRows`
   — without filtering by `is_active` (glyph rows are intentionally inactive at this stage).

This OAR2 does not authorize:
- Rendering any glyph on any surface
- Adding any glyph `media_role` to `REQUIRED_MEDIA_ROLES` or `OPTIONAL_MEDIA_ROLES`
- Modifying `CAMPAIGN_KEY` or the existing landing media query
- Setting any `is_active = true` in the DB
- CSS changes
- Component binding (no `<img>`, no `<svg>`, no URL consumption from `glyphReferenceMap`)
- Circuit activation
- Seal activation
- Badge activation
- Any DB mutation

## CORE RULE

Read path before render path.

`glyphReferenceMap` holds reference rows. No surface consumes them until a future rendering OAR2
explicitly routes consumption.

Inactive rows in `glyphReferenceMap` are correct state — do not filter them out.

A reference query is not activation. A reference query is not proof. A reference query is not styling.

## ROUTED

Executor must implement the following changes to `src/measures_registry/MeasuresRegistryRuntime.tsx`:

### 1. New constants (add after `QUERY_MEDIA_ROLES` block, before `REQUIRED_DESIGN_TOKEN_KEYS`)

```typescript
const GLYPH_REGISTRY_KEY = "measures_registry_glyphs"
const GLYPH_CAMPAIGN_KEY = "measures_registry_v1"
const GLYPH_MEDIA_ROLES = [
  "glyph_material_obsidian",
  "glyph_material_crystal",
  "glyph_material_lapis",
  "glyph_material_marble",
  "glyph_chamber_epigraph",
  "glyph_chamber_temple_path",
  "glyph_chamber_lapis_relational",
  "glyph_chamber_c3_map",
  "glyph_chamber_obsidian_assessment_gate",
  "glyph_chamber_marble_governance",
  "glyph_chamber_marble_commerced_circuit",
  "glyph_chamber_media_passage",
  "glyph_chamber_lapis_interoperability",
  "glyph_circuit_c1",
  "glyph_circuit_c2",
  "glyph_circuit_c3",
  "glyph_circuit_3x33",
  "glyph_mark",
  "glyph_seal_verified_assessment",
  "glyph_seal_delivery_contract",
  "glyph_badge_held_placeholder",
] as const
```

### 2. New type (add alongside `MediaRow` type definition)

```typescript
type GlyphReferenceRow = {
  media_role: string
  encounter_key: string | null
  storage_bucket: string
  storage_path: string
  mime_type: string | null
  sort_order: number | null
  is_active: boolean | null
  metadata: Record<string, unknown> | null
}
```

### 3. New state (add after existing `mediaRows` state declaration)

```typescript
const [glyphReferenceRows, setGlyphReferenceRows] = useState<GlyphReferenceRow[]>([])
```

### 4. New query in Promise.all (add as a new parallel entry alongside the existing `mediaResult` query)

```typescript
supabase
  .from("measures_media_map")
  .select("media_role, encounter_key, storage_bucket, storage_path, mime_type, sort_order, is_active, metadata")
  .eq("registry_key", GLYPH_REGISTRY_KEY)
  .eq("campaign_key", GLYPH_CAMPAIGN_KEY)
  .in("media_role", [...GLYPH_MEDIA_ROLES])
  .order("sort_order", { ascending: true }),
```

Destructure the result as `glyphReferenceResult` alongside the existing destructured results.

### 5. Error handling

Add `glyphReferenceResult.error` to the existing error check block. On error, set
`setGlyphReferenceRows([])`.

### 6. Set state on success

```typescript
setGlyphReferenceRows(((glyphReferenceResult.data ?? []) as GlyphReferenceRow[]) ?? [])
```

### 7. New memo (add after existing `mediaMap` memo)

```typescript
const glyphReferenceMap = useMemo(
  () => new Map(glyphReferenceRows.map((row) => [row.media_role, row])),
  [glyphReferenceRows],
)
```

No `is_active` filter — glyph rows are intentionally inactive at this stage.

## QUERY CONTRACT

The query selects:

| Column | Purpose |
|---|---|
| `media_role` | Map key — identifies the glyph slot |
| `encounter_key` | The `material_place` for material/chamber glyphs; null for seals/badge/mark |
| `storage_bucket` | `measures-registry` |
| `storage_path` | Full SVG path in bucket |
| `mime_type` | `image/svg+xml` |
| `sort_order` | Ordering within the glyph set |
| `is_active` | `false` for all current rows |
| `metadata` | Contains `media_key`, `asset_type`, `activation_status`, `authority_status`, `runtime_status`, `proof_required`, `source_oar2` |

## CHANGE BOUNDARY

| File | Change |
|---|---|
| `src/measures_registry/MeasuresRegistryRuntime.tsx` | Add constants, type, state, query, memo — no render output |

No other file may be modified.

`MeasuresAssessmentChamber.tsx`, CSS files, API routes, DB schema — all untouched.

## NON-NEGOTIABLES

Executor must not:
1. Add any glyph `media_role` to `REQUIRED_MEDIA_ROLES` or `OPTIONAL_MEDIA_ROLES`.
2. Modify `CAMPAIGN_KEY` or the existing `mediaResult` query.
3. Consume `glyphReferenceMap` in any render function.
4. Pass any glyph URL to any component prop.
5. Filter `glyphReferenceRows` by `is_active` in the memo.
6. Set any DB row to `is_active = true`.
7. Modify any CSS file.
8. Declare any glyph as rendering-ready.
9. Treat `glyphReferenceMap` as equivalent to the landing `mediaMap`.

## PROOF REQUIREMENTS

Executor must confirm:

1. `GLYPH_REGISTRY_KEY`, `GLYPH_CAMPAIGN_KEY`, `GLYPH_MEDIA_ROLES` constants added.
2. `GlyphReferenceRow` type declared with all required fields.
3. `glyphReferenceRows` state declared.
4. Glyph query added to `Promise.all` — scoped to `GLYPH_REGISTRY_KEY` and `GLYPH_CAMPAIGN_KEY`.
5. `glyphReferenceResult.error` handled in the error block.
6. `glyphReferenceRows` set on success.
7. `glyphReferenceMap` memo built without `is_active` filter.
8. `glyphReferenceMap` not consumed in any render function.
9. No glyph role added to `REQUIRED_MEDIA_ROLES` or `OPTIONAL_MEDIA_ROLES`.
10. Existing `mediaResult` query unchanged.
11. TypeScript compiles without error.
12. No runtime rendering of glyphs occurs.

## EXPECTED FILES

- `docs/oar/measures_interoperability/oar2_measures_registry_glyph_runtime_reference_query_v1.meta.md`
- `src/measures_registry/MeasuresRegistryRuntime.tsx` (modified)
- `docs/oar/measures_interoperability/oar1_measures_registry_glyph_runtime_reference_query_v1.meta.md`

## EXPECTED OAR1

`docs/oar/measures_interoperability/oar1_measures_registry_glyph_runtime_reference_query_v1.meta.md`

## CARRIED FORWARD

| Item | Route |
|---|---|
| `glyphReferenceMap` consumption in render functions | Future rendering OAR2 |
| `is_active → true` for glyph rows | Future rendering OAR2 — after proof conditions met |
| CSS glyph token and component implementation | Future CSS implementation OAR2 |
| Circuit activation (C1 / C2 / C3) | Future delivery contract OAR2 |
| Verified Assessment seal activation | Future assessment OAR2 |
| Delivery Contract seal activation | Future delivery contract OAR2 |

## SUCCESS CONDITION

This OAR2 succeeds when:
- `glyphReferenceMap` is populated in runtime state from the live `measures_media_map` glyph rows
- No glyph is rendered on any surface
- Existing landing media query and `mediaMap` are unchanged
- TypeScript compiles without error
- OAR1 written and committed

## CLOSE

Codex has assets.
Measures has mappings.
Runtime may retrieve references.
Rendering waits.
CSS waits.
Activation waits.
Codex holds.

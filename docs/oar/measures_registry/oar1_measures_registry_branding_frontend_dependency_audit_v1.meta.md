---
document_type: oar1
authority_level: observation_closeout
document_scope: measures_registry_branding_and_frontend_dependency
title: OAR1 - Measures Registry Branding + Frontend Dependency Audit v1
status: recorded
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_measures_registry_branding_frontend_dependency_audit_v1.meta.md
---

# OAR1 - Measures Registry Branding + Frontend Dependency Audit v1

## OBJECTIVE

Record branding, frontend dependency, media, content, route, and design-token standing before any further Measures Registry styling or launch-polish mutation.

This OAR1 is audit only.

No broad frontend redesign was performed.

No runtime copy was changed.

No DB, storage bucket, route, media map, or design-token mutation was performed.

## AUDIT METHOD

Inspected local runtime/dependency surfaces:

- `src/measures_registry/MeasuresRegistryRuntime.tsx`
- `src/index.css`
- `src/shared/media/runtimeMediaUrl.ts`
- `src/app/App.tsx`
- `public/og.jpeg`
- `docs/oar/measures_registry/oar1_diagnose_measures_media_runtime_resolution_v1.meta.md`
- `docs/handoff/cody/post_automation_media_seating/post_automation_media_contract.md`

Performed read-only live checks against Supabase for:

- `public.measures_media_map`
- `public.measures_design_token`
- Supabase Storage listing attempts for likely `measures-registry` branding prefixes

Also verified operator-provided external brand image file exists locally:

- `C:/Users/c3DAO/OneDrive/measures_registry/og.png`

## APPROVED BRANDING STANDING

Approved wording from source OAR2:

    Measures Registry
    Integrity Governance for AI Accelerated Systems

Approved palette from source OAR2:

| Token | Approved value |
|---|---|
| Obsidian | `#0E0E17` |
| Deep Lapis | `#1F2F8D` |
| Lapis Night | `#101A4D` |
| Silver Frame | `#D7DBE3` |
| Crystal Star | `#F2F4F8` |
| Marble Accent | `#C7CBD2` |

### Branding File Audit

| Branding file / role | Current standing | Drift type | Recommended route |
|---|---|---|---|
| Full lockup | Not found in active `measures_media_map` rows; not confirmed by Supabase Storage list | `missing_media_role` | Seat explicit `brand_full_lockup` or equivalent media role after operator approval |
| Emblem reference | Existing runtime uses `registry_mark` -> `measures-registry/measures_registry_mark.webp` | partial / legacy authority | Replace only through governed media role update, not frontend hardcode |
| Watermark emblem | Not found in active runtime roles | `missing_media_role` | Seat `brand_watermark_emblem` role |
| Transparent watermark PNG | Not found in active runtime roles | `missing_media_role` | Seat explicit transparent watermark media role |
| Palette sheet | Approved palette exists in OAR2; no live token set matches it yet | `missing_design_token` | Seat approved brand palette in `measures_design_token` or a brand-token registry |
| Social/OG card | `public/og.jpeg` exists in repo; operator external `og.png` exists locally; active metadata points to `/og.jpeg` | `hardcoded_url` / unseated brand asset | Seat OG/social card as governed media role before replacing metadata target |

Supabase Storage list attempts for likely branding prefixes returned no branding files through the anon storage API:

- `/`
- `branding`
- `brand`
- `measures_registry`
- `measures_registry/branding`
- `measures-registry`
- `logos`
- `emblems`

This does not prove the bucket lacks objects, but it does mean current public-runtime standing was not verifiable through the same read path used by the frontend.

## FRONTEND COLOR DEPENDENCY AUDIT

### Token Baseline

The runtime does consume DB-backed design token rows through `measures_design_token`.

Current active token values include:

- `background_obsidian = #050607`
- `panel_obsidian = rgba(8,10,14,0.72)`
- `text_primary = #E8E6DF`
- `text_secondary = rgba(232,230,223,0.72)`
- `text_muted = rgba(232,230,223,0.52)`
- `accent_warm = rgba(214,132,62,0.82)`
- `accent_cool = rgba(108,154,208,0.82)`
- `border_subtle = rgba(232,230,223,0.14)`

These do not yet match the approved Lapis v2 palette from the OAR2.

### Color Drift Map

| FOUND COLOR | APPROVED TOKEN MATCH | LOCATION | STATUS | RECOMMENDED TOKEN |
|---|---|---|---|---|
| `#050607` | near obsidian, not approved `#0E0E17` | live `background_obsidian` token | `missing_design_token` | `brand_obsidian` |
| `#E8E6DF` | near marble/silver, not approved `#C7CBD2` / `#D7DBE3` | live `text_primary` token | `missing_design_token` | `brand_silver_frame` or `brand_marble_accent` |
| `rgba(214,132,62,0.82)` | no approved palette match | live `accent_warm`, forms | `hardcoded_color` / token drift | reduce or retire as launch brand accent |
| `rgba(108,154,208,0.82)` | near lapis family, not approved `#1F2F8D` / `#101A4D` | live `accent_cool` | token drift | `brand_deep_lapis` |
| `#000` | no direct approved token | video backgrounds and overlays | `hardcoded_color` | `brand_obsidian` or `surface_black_video` if intentionally media-only |
| `#050505` | no direct approved token | later registry/phase surfaces | `hardcoded_color` | `brand_obsidian` |
| `#050608` | no direct approved token | button foreground contrast | `hardcoded_color` | `brand_obsidian` |
| `#030406` | no direct approved token | phase map surfaces sharing stylesheet | `hardcoded_color` | separate Inanna/phase-map token, not Measures brand token |
| `#1c2333` | approximate deep slate, not approved lapis | phase-map material mark | `hardcoded_color` | keep outside Measures launch polish or map to material token |
| `#2d62b7` | off approved lapis | phase-map lapis material mark | `hardcoded_color` | material-lapis token if in Inanna; not Measures Lapis v2 |
| `#e8f6ff` | near crystal, not approved `#F2F4F8` | phase-map crystal material mark | `hardcoded_color` | material-crystal token |
| `#efece4` | near marble, not approved `#C7CBD2` | phase-map marble material mark | `hardcoded_color` | material-marble token |
| `rgba(246,248,251,0.92)` | near crystal star | buttons/cards | `hardcoded_color` | `brand_crystal_star` with opacity token |
| `rgba(127,177,235,0.72)` | off approved lapis | hover/border states | `hardcoded_color` | `brand_deep_lapis` / `brand_lapis_night` |

Conclusion: the runtime has token plumbing, but many public surfaces still rely on raw colors in CSS. Approved Lapis v2 palette is not yet seated as the active token authority.

## MEDIA DEPENDENCY STANDING

Runtime media resolution path:

- Renderer queries `public.measures_media_map`.
- Renderer resolves through `src/shared/media/runtimeMediaUrl.ts`.
- `measures-media` resolves through R2 base URL.
- `measures-registry` resolves through Supabase public storage URL.

No inspected renderer constructs media URLs independently for active runtime media roles.

### Media Map

| MEDIA DEPENDENCY | EXPECTED MEDIA ROLE | CURRENT STANDING | DRIFT TYPE | RECOMMENDED ROUTE |
|---|---|---|---|---|
| Epigraph video | `epigraph_video` | seated, active, `measures-media/registry_epigraph_fracture_to_alignment_15s.mp4` | none observed | preserve |
| Hero image | `hero_image` | required by renderer but absent from live read | `missing_media_role` | seat or remove required status if no longer used |
| Explainer video | `explainer_video` | seated, active, R2 | none observed | preserve |
| Hero video | `hero_video` | seated, active, R2 | none observed | preserve |
| Hero poster | `hero_poster` | seated, active, Supabase | none observed | preserve |
| Path choice background | `path_choice_background` | required by renderer but absent from live read | `missing_media_role` | seat or retire dependency |
| Registry mark | `registry_mark` | seated, active, legacy `measures_registry_mark.webp` | legacy branding authority | update through media map after brand asset seating |
| Foundation intro video | `foundation_intro_video` | optional but absent | `missing_media_role` | seat only if surface remains launch-relevant |
| Systems intro video | `systems_intro_video` | optional but absent | `missing_media_role` | seat only if surface remains launch-relevant |
| c3 Field video | `c3_field_video` | seated, active, R2 | none observed | preserve |
| Hero measured image | `hero_measured_image` | seated, active, Supabase | none observed | preserve |
| Left hero fracture | `left_hero_fracture` | seated, active, Supabase | none observed | preserve |
| Left hero fracture motion | `left_hero_fracture_motion` | seated, active, R2 | none observed | preserve |
| Right measured hero | `right_measured_hero` | seated, active, Supabase | none observed | preserve |
| Measured hero motion graphic | `measured_hero_motion_graphic` | seated, active, R2 | none observed | preserve |
| Paragraph Agents of Chaos image | `paragraph_agents_of_chaos` | seated, active, Supabase, accepted alias is PNG while expected asset was WEBP | naming drift | preserve unless follow-on media-normalization OAR2 |
| Structured Environment video | `structured_environment_passage_video` | seated, active, R2 | none observed | preserve |
| Structured Environment alias | `measures_structured_enviroments` | seated, active, R2; typo preserved in role | naming drift | preserve existing role; do not rename without migration |
| Marble tone | `marble_tone` | seated, active, R2 | none observed | preserve |
| Installation tone marble | `installation_tone_marble` | seated, active, R2 | none observed | preserve |
| Installation tone marble rise/return | `installation_tone_marble_rise_return_v1` | seated, active, R2 | none observed | preserve |
| Full brand lockup | no active role | not seated in runtime map | `missing_media_role` | seat brand media role |
| Watermark emblem | no active role | not seated in runtime map | `missing_media_role` | seat brand media role |
| Palette sheet | no active role | not seated in runtime map | `missing_media_role` | optional documentation media role |
| OG/social card | no active runtime role; `App.tsx` hardcodes URL to `https://measuresregistry.com/og.jpeg` | `hardcoded_url` | seat `social_card` role and then update metadata route |

## CONTENT DEPENDENCY STANDING

| CONTENT SURFACE | EXPECTED CONTENT AUTHORITY | CURRENT STANDING | DRIFT TYPE | RECOMMENDED ROUTE |
|---|---|---|---|---|
| Landing title/subtitle/actions | `measures_encounter_def.metadata` | DB-backed through `sectionCopy` | none observed | preserve |
| Header nav labels | encounter actions | DB-backed | none observed | preserve |
| Epigraph overlay copy | public runtime content authority | frontend-owned hardcoded copy | `hardcoded_copy` | seat as `landing_root` metadata |
| Threshold left/right body + CTA | public runtime content authority | frontend-owned hardcoded copy | `hardcoded_copy` | seat as hero path metadata/plaque copy |
| Diagnostic passage fallback copy | DB metadata with frontend fallback | fallback exists | `runtime_fallback_truth` | keep absence honest or seat required copy |
| Assessment chamber title/body | `iis_eval_gate1.metadata.assessment_chamber` | partially DB-backed; renderer fallback exists | `runtime_fallback_truth` | prefer seated fields only after review |
| Soft SRC intake labels | public-language layer | frontend-owned hardcoded labels | `public_language_drift` / `hardcoded_copy` | replace through public-language seating OAR2 |
| Assessment completion | DB metadata plus frontend-owned duplicate lines | mixed | `hardcoded_copy` | seat completion copy fully |
| Structured Environment absence message | runtime missing-state policy | frontend-owned hardcoded process language | `public_language_drift` | translate to public availability language |
| Registered Process Log | internal/operator content authority | DB-backed plus frontend-owned native labels | `public_language_drift` | keep internal/gated or translate for public |
| Dispatch archive empty states | publication registry | frontend-owned native seating language | `public_language_drift` | translate after terminology review |
| Publication subscription copy | publication registry / capture surface | frontend-owned copy | `hardcoded_copy` | seat in publication metadata if public |
| Approved brand wording | brand authority | only in OAR2; not live token/content authority | `unseated_content` | seat brand wording before launch polish |

## ROUTE AND RUNTIME DEPENDENCY STANDING

Observed frontend-owned runtime assumptions:

- `REQUIRED_SECTION_KEYS` controls which encounter keys must exist.
- `REQUIRED_MEDIA_ROLES` controls required media standing.
- `SurfaceState` and `SURFACE_QUERY` bind route surfaces to encounter keys.
- `renderCorrectionReport()` exposes DB table/column names when diagnostics are visible.
- `selectedPublicationDispatch` falls back to first dispatch when no route key matches.
- `structuredEnvironmentPassageVideoUrl` falls back from primary role to typo alias role.
- `marbleToneUrl` falls through three aliases.
- `registryMarkUrl` consumes only `registry_mark`; no approved brand lockup/watermark role exists.
- `App.tsx` hardcodes OpenGraph image URLs for public hosts.

Drift classification:

- fallback media aliases are acceptable continuity posture where recorded, but should be documented as migration debt
- route fallback to first dispatch may be acceptable editorial default, but it is frontend-owned behavior
- diagnostic missing-state report is useful to Cody but should not be public-facing
- OG/social metadata is URL-hardcoded and outside media-map authority

## DRIFT CLASSIFICATION SUMMARY

| Drift classification | Findings |
|---|---|
| `unseated_media` | full lockup, watermark emblem, transparent watermark PNG, palette sheet, social card media role |
| `unseated_content` | approved brand wording not live-seated as content/token authority |
| `hardcoded_copy` | epigraph overlay, threshold path copy, intake labels, completion duplicate, subscription copy |
| `hardcoded_color` | extensive raw hex/RGBA values in Measures Registry CSS after token plumbing |
| `hardcoded_url` | `App.tsx` OG image URLs; publication external links are DB-backed but still public external dependencies |
| `bucket_presence_only` | not used by renderer for active media; concern remains for newly uploaded branding assets until media roles are seated |
| `missing_media_role` | brand lockup/watermark/social roles; current required `hero_image` and `path_choice_background` absent in live read |
| `missing_design_token` | approved Lapis v2 palette not seated in active token rows |
| `public_language_drift` | SRC/IIS/process/seated/deploy/OAR terms remain visible in public or semi-public surfaces |
| `runtime_fallback_truth` | renderer fallbacks for missing copy/media/dispatch state remain frontend-owned |

## PRIORITY ROUTE RECOMMENDATIONS

1. Open a bounded OAR2 to seat approved Lapis v2 brand tokens.
2. Open a bounded OAR2 to seat approved brand assets as explicit `measures_media_map` roles.
3. Open a bounded OAR2 to align OG/social metadata with governed media role standing.
4. Open a bounded OAR2 to translate public terminology and remove public-facing DB/process language.
5. Open a bounded OAR2 to retire or seat missing required media roles: `hero_image`, `path_choice_background`.
6. Do not start broad CSS restyling until token and brand media authority are seated.

## BOUNDARIES HELD

No frontend mutation.

No DB mutation.

No Supabase Storage mutation.

No media-map mutation.

No route mutation.

No design-token mutation.

No new branding direction was introduced.

No fallback authority was added.

## CLOSE

Branding is governed visual authority, but the approved Measures Registry brand package is not yet the live runtime authority.

The runtime has usable registry plumbing.

The next correction is seating and mapping, not redesign.

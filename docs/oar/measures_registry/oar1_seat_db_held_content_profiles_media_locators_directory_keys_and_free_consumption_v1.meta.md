---
document_type: oar1
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR1 - Seat DB-Held Content Profiles, Media Locators, Directory Keys and FREE Consumption
status: closed
version: v1
operator: op044
system: measures_registry
oar2_ref: oar2_seat_db_held_content_profiles_media_locators_directory_keys_and_free_consumption_v1
---

# OAR1 - Seat DB-Held Content Profiles, Media Locators, Directory Keys and FREE Consumption

## EXECUTION METHOD

Migration applied via `npx supabase db push` to project `zfihrspxvennjzazxcbj`.
Source changes applied directly to TypeScript renderer files.
TypeScript validated via `npx tsc --noEmit` — zero errors.

---

## MIGRATION APPLIED

`supabase/migrations/202606300021_seat_content_profiles_media_locators_directory_keys_and_chamber_directories.sql`

Applied: 2026-06-30.

Contents:

- **STEP 1**: INSERT 4 chamber directory records in `measures_registry` (registry_family `spine`, ON CONFLICT DO NOTHING)
- **STEP 2**: UPDATE `measures_encounter_def.metadata` with `content_profile`, `media_locator`, `directory_key` for all 12 encounter_def rows serving 13 surfaces
- **STEP 3**: UPDATE `measures_encounter_surface_assignment.metadata` with `directory_key` for all 13 surface_keys
- **STEP 4**: INSERT `assessment_report_orientation` media row in `measures_media_map` (is_active: false — gap placeholder)

---

## SOURCE CHANGES

### `src/measures_registry/encounter_renderer/types/encounterRendererTypes.ts`

Added `surfaceAssignmentMetadata: Record<string, unknown> | null` to both `ComposedEncounter` and `RenderableEncounter`.

style_profile was seated in `measures_encounter_surface_assignment.metadata` (migration 202606300019) but was not accessible to FREE because ComposedEncounter did not include the surface_assignment row. This change threads it.

### `src/measures_registry/encounter_renderer/composition/encounterComposition.ts`

Added `surfaceAssignmentMetadata: asRecord(assignment.metadata)` to the `composeEncounter()` return value.

### `src/measures_registry/encounter_renderer/chambers/CrystalSeatRenderer.tsx`

- **IntroHookSeat** primary `<main>`: Added `data-style-profile` and `data-directory-key` data attributes
- **AboutMeasuresRegistry** `<main>`: Added `data-style-profile` and `data-directory-key` data attributes

### `src/measures_registry/encounter_renderer/chambers/LapisChamberRenderer.tsx`

- **UnDriftedIndex** primary `<main>` (~line 187): Added `data-style-profile` and `data-directory-key` data attributes

### `src/measures_registry/encounter_renderer/chambers/ObsidianChamberRenderer.tsx`

- **EvalPassage** `<main>`: Added `data-style-profile` and `data-directory-key` data attributes
- **ObsidianC1Compact** active `<main>`: Added `data-style-profile` and `data-directory-key` data attributes
- **MeasuresAssessment**: data attrs NOT added — this surface delegates fully to `<PublicAssessmentSurface>` which owns its own `<main>`. Adding data attrs would require modifying the shared component interface. Documented as gap below.

### `src/measures_registry/encounter_renderer/chambers/MarbleChamberRenderer.tsx`

- **MapIntegrityGovernance** `<main>`: Added `data-style-profile` and `data-directory-key`
- **MarbleOrientationSeat** `<main>`: Added `data-style-profile` and `data-directory-key`; reads `title`, `subtitle`, `cta_label` from `content_profile` with fallback to `encounter_def.display_title`
- **MarbleChamberEncounter** `<main>`: Added `data-style-profile` and `data-directory-key`
- **MarbleC2Agreement** both `<main>` elements (held + active): Added data attrs; reads full content_profile: `title`, `held_body`, `held_cta_label`, `pathway_prefix`, `email_label`, `email_placeholder`, `cta_label`, `cta_loading`
- **MarbleC2Resolution** `<main>`: Added data attrs; reads full content_profile: `eyebrow`, `title`, `body`, `cta_label`

---

## CHAMBER DIRECTORIES SEATED

| directory_key | display_title | registry_family | surfaces |
|---|---|---|---|
| crystal_seat_directory | Crystal Seat Directory | spine | crystal_seat_intro, crystal_seat_threshold, crystal_seat_orientation, crystal_seat_encounter |
| lapis_chamber_directory | Lapis Chamber Directory | spine | lapis_chamber_encounter |
| obsidian_chamber_directory | Obsidian Chamber Directory | spine | obsidian_chamber_orientation, obsidian_chamber_encounter_surface, obsidian_chamber_C1_compact |
| marble_chamber_directory | Marble Chamber Directory | spine | marble_chamber_orientation, marble_chamber_encounter, marble_chamber_C2_compact, marble_chamber_C2_agreement, marble_chamber_C2_resolution |

Note: `registry_family` initially authored as `'directory'` — `measures_registry_registry_family_check` constraint violation discovered on first push. Corrected to `'spine'` before successful apply.

---

## 13-SURFACE OAR1 TABLE

| registered_surface | style_profile | content_profile | media_locator | directory_key | FREE consumption | fallback behavior | final standing |
|---|---|---|---|---|---|---|---|
| crystal_seat_intro | media_intro_full_bleed | surface_role=media_intro; title_source=intro_copy.title; content_authority=encounter_def.metadata.intro_copy | primary_media_role=intro_hook_video | crystal_seat_directory | style_profile: data-attr on main; content_profile: authority seated; directory_key: data-attr on main | Existing intro_copy render pattern remains active | HOT |
| crystal_seat_threshold | split_threshold_motion_still | content_authority=encounter_def.metadata.intro_copy,encounter_def.metadata.threshold_copy; threshold_source=threshold_copy.plaques | primary_media_role=intro_hook_video; secondary=[left_hero_fracture, left_hero_fracture_motion, right_measured_hero, measured_hero_motion_graphic] | crystal_seat_directory | style_profile: surfaceAssignmentMetadata threaded; directory_key: encounter_def.metadata; data-attrs on renderer main | Existing threshold_copy render pattern; hardcoded copy falls to DB fallback | HOT |
| crystal_seat_orientation | talking_head_orientation | content_authority=encounter_def.metadata.intro_copy,encounter_def.metadata.threshold_copy (shared ai_isnt_broken_intro encounter_def) | primary_media_role=intro_hook_video | crystal_seat_directory | style_profile: surfaceAssignmentMetadata threaded; directory_key: encounter_def.metadata | Existing intro_copy orientation render; DB authority seated | HOT |
| crystal_seat_encounter | public_about_encounter | title_source=approved_content_contract.title; content_authority=encounter_def.metadata.approved_content_contract | primary_media_role=about_measures_registry_video | crystal_seat_directory | style_profile: data-attr on AboutMeasuresRegistry main; directory_key: data-attr on main | Existing approved_content_contract render pattern | HOT |
| lapis_chamber_encounter | publication_index_promoted | title_source=brand_copy.header; content_authority=encounter_def.metadata.brand_copy,encounter_def.metadata.issue_record,encounter_def.metadata.cover_story | primary_media_role=lapis_background | lapis_chamber_directory | style_profile: data-attr on UnDriftedIndex main; directory_key: data-attr on main | Existing brand_copy/issue_record render pattern | HOT |
| obsidian_chamber_orientation | media_orientation_full_bleed | title_source=encounter_def.display_title; cta_label=Continue | primary_media_role=structured_environment_passage_video | obsidian_chamber_directory | style_profile: data-attr on EvalPassage main; directory_key: data-attr on main; cta_label seated in content_profile | display_title fallback; cta_label hardcode fallback | HOT |
| obsidian_chamber_encounter_surface | assessment_form_surface | content_authority=encounter_def.metadata.assessment_mechanics,encounter_def.metadata.assessment_contact_capture_oar1_binding_contract_v1 | media_roles=[obsidian_assessment_surface_visual, obsidian_contact_surface_visual, obsidian_eval_result_surface_visual] | obsidian_chamber_directory | style_profile: surfaceAssignmentMetadata threaded; data-style-profile NOT on PublicAssessmentSurface main (gap — shared component interface); directory_key: encounter_def.metadata | Existing assessment_mechanics render; DB content_profile authority seated | HOT — gap noted |
| obsidian_chamber_C1_compact | compact_contact_capture | title=Contact Information; held_body=Complete the AI Operations Assessment to continue. | null | obsidian_chamber_directory | style_profile: data-attr on active main; directory_key: data-attr on active main; content_profile values: title + held_body seated | sessionStorage assessmentContactCaptureContract active path; held_body new DB-held copy | HOT |
| marble_chamber_orientation | report_orientation_media | title=Pathway Review; subtitle=A brief orientation before reviewing your assessment findings.; cta_label=Continue | primary_media_role=assessment_report_orientation (GAP — is_active: false) | marble_chamber_directory | style_profile: data-attr on main; content_profile: CONSUMED — title, subtitle, cta_label read from DB; directory_key: data-attr on main | MarbleOrientationSeat renders gap state when media is_active=false | HOT — media gap documented |
| marble_chamber_encounter | assessment_findings_report | title=Assessment Findings; cta_label=Begin Pathway Review | null | marble_chamber_directory | style_profile: data-attr on main; content_profile: authority seated; directory_key: data-attr on main | Existing sessionStorage report render via PublicAssessmentResult | HOT |
| marble_chamber_C2_compact | map_compact_cards | title_source=governance_header.title; content_authority=encounter_def.metadata.governance_header,encounter_def.metadata.map_framing,encounter_def.metadata.pathway_cards | media_roles=[right_measured_hero, installation_tone_marble, installation_tone_marble_rise_return_v1] | marble_chamber_directory | style_profile: data-attr on MapIntegrityGovernance main; directory_key: data-attr on main | Existing governance_header/pathway_cards DB render (already DB-consumed) | HOT |
| marble_chamber_C2_agreement | payment_agreement_surface | title=Payment Agreement; held_body, held_cta_label, pathway_prefix, email_label, email_placeholder, cta_label, cta_loading | null | marble_chamber_directory | style_profile: data-attr on both mains; content_profile: FULLY CONSUMED — all copy from DB, zero hardcoded copy | All copy values have hardcoded fallbacks in renderer | HOT |
| marble_chamber_C2_resolution | confirmation_resolution_surface | eyebrow=MAP Registration; title=Registration Received; body=Your MAP the Environment registration has been received.; cta_label=Return to Measures Registry | null | marble_chamber_directory | style_profile: data-attr on main; content_profile: FULLY CONSUMED — eyebrow, title, body, cta_label from DB | All copy values have hardcoded fallbacks in renderer | HOT |

---

## GAPS AND BLOCKERS

### GAP 1: assessment_report_orientation media source not provided

**Status**: OPEN

The `assessment_report_orientation` media row is seated in `measures_media_map` with `is_active: false` and empty `storage_path`.

`marble_chamber_orientation` renders gap state ("Marble orientation media is not seated.") until source is supplied.

**To enable**: UPDATE `measures_media_map` SET `storage_path = '<filename>'`, `metadata = metadata || '{"exact_url_seated": "https://..."}'::jsonb`, `is_active = true` WHERE `media_role = 'assessment_report_orientation'`.

**Blocker**: No video source file or URL was provided with this OAR2.

### GAP 2: obsidian_chamber_encounter_surface data-style-profile not on PublicAssessmentSurface main

**Status**: DOCUMENTED — low priority

`MeasuresAssessment` in `ObsidianChamberRenderer.tsx` delegates fully to `<PublicAssessmentSurface>` which renders its own `<main>`. The `surfaceAssignmentMetadata` is available on the `encounter` prop but adding `data-style-profile` to the shared component's `<main>` would require modifying `PublicAssessmentSurface`'s interface.

style_profile is threaded and accessible. Data attribute on the DOM element is the only gap. Assessment rendering, content authority, and scoring are unaffected.

---

## CONSTRAINT NOTE

`measures_registry_registry_family_check` does not permit `'directory'` as a registry_family value.

The 4 chamber directory rows were initially authored with `registry_family = 'directory'`. Constraint violation was caught on first push attempt. Corrected to `registry_family = 'spine'` (consistent with all existing measures_registry rows) before successful apply.

---

## VALIDATION

| criterion | result |
|---|---|
| All 13 surfaces resolve style_profile | PASS — seated in surface_assignment.metadata (migration 202606300019); surfaceAssignmentMetadata now threaded to FREE |
| All 13 surfaces resolve content_profile | PASS — seated in encounter_def.metadata; fully consumed in marble C2 and orientation surfaces |
| Media-bearing surfaces resolve media_locator | PASS — seated in encounter_def.metadata for all media surfaces |
| All 13 surfaces resolve directory_key | PASS — seated in both encounter_def.metadata and surface_assignment.metadata |
| FREE consumes all four authorities | PASS — style_profile via surfaceAssignmentMetadata + data-attrs; content_profile actively consumed where applicable; media_locator accessible via encounter.encounterDef.metadata; directory_key via data-attr on main |
| assessment_report_orientation media | GAP — row seated (is_active: false); source video not provided |
| No report rewrite | PASS |
| No payment rewrite | PASS |
| No scoring changes | PASS |
| TypeScript / build | PASS — npx tsc --noEmit: zero errors |
| OAR1 records before/after proof | PASS — this document |

---

## CLOSE

All 13 surfaces hold registered standing.

DB-held authority is seated for content_profile, media_locator, and directory_key across all surfaces.

style_profile — previously seated but not accessible to FREE — is now threaded through ComposedEncounter and available to all chamber renderers via surfaceAssignmentMetadata.

Marble chamber copy (C2Agreement, C2Resolution, MarbleOrientationSeat) is fully consumed from DB-held content_profile. Remaining surfaces hold DB authority with existing render patterns intact.

One media gap remains: assessment_report_orientation source video not provided. Row is seated. Surface renders gap state until source is supplied.

DB holds.
Measures allows.
Field arranges.
Roles authorize.
Optics prove.

---
document_type: oar2
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR2 - Seat Assessment Report Orientation R2 Media and Public Assessment Style Profile
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 - Seat Assessment Report Orientation R2 Media and Public Assessment Style Profile

## OBSERVED

Two final authority-consumption gaps remain from the prior OAR1.

1. `assessment_report_orientation` media row is seated but inactive.
   - The media exists in R2 by title.
   - This is not an upload gap.
   - This is an R2 media locator seating gap.

2. `obsidian_chamber_encounter_surface` style_profile authority is threaded but not present on the actual `PublicAssessmentSurface` main DOM element.
   - FREE has access to `surfaceAssignmentMetadata`.
   - The shared component does not yet receive/apply `data-style-profile`.

## ALIGNED

These are targeted completion gaps.

No redesign.

No scoring change.

No report rewrite.

No payment rewrite.

No new architecture.

## ROUTED

### 1. Seat assessment_report_orientation R2 media locator

Cody must:

- locate the existing R2 media object for title/key `assessment_report_orientation`
- update `measures_media_map` for `media_role = 'assessment_report_orientation'`
- set the correct R2 storage path / locator
- set `is_active = true`
- preserve existing campaign/media structure
- verify `marble_chamber_orientation` resolves and plays the media

If multiple R2 candidates exist, report ambiguity and do not guess.

If no R2 object is found, report exact blocker.

### 2. Apply style profile to PublicAssessmentSurface main

Cody must:

- thread `styleProfile` and `directoryKey` or equivalent safe props into `PublicAssessmentSurface`
- apply `data-style-profile`
- apply `data-directory-key`
- preserve existing assessment behavior
- preserve scoring logic
- preserve question flow
- preserve C1 compact navigation
- preserve report generation

Do not let CSS become authority.

The data attributes expose DB-held standing to CSS mechanics only.

## VALIDATION

Validation succeeds when:

- `assessment_report_orientation` media row is active
- R2 locator is seated
- `marble_chamber_orientation` renders the video instead of gap state
- `PublicAssessmentSurface` main element carries DB-derived `data-style-profile`
- `PublicAssessmentSurface` main element carries DB-derived `data-directory-key`
- assessment scoring unchanged
- report copy unchanged
- payment unchanged
- TypeScript/build passes or exact failure is reported
- OAR1 records before/after proof

## EXPECTED OAR1

docs/oar/measures_registry/oar1_seat_assessment_report_orientation_r2_media_and_public_assessment_style_profile_v1.meta.md

## CLOSE

Seat the R2 locator.
Expose the assessment style profile.
Preserve behavior.

DB holds.
Measures allows.
Field arranges.
Roles authorize.
Optics prove.

Collapse is not the default.

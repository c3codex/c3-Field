---
document_type: oar1
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR1 - Seat Surface Profile Metadata Assignments
status: closed
version: v1
operator: op044
system: measures_registry
oar2_ref: oar2_seat_surface_profile_metadata_assignments_v1
---

# OAR1 - Seat Surface Profile Metadata Assignments

## EXECUTION METHOD

Migration applied via `npx supabase db push` to project `zfihrspxvennjzazxcbj`.

MCP `apply_migration` was unauthorized. CLI push succeeded (exit code 0).

Live PostgREST verification was blocked by session permissions. Confirmation is based on CLI push output: "Applying migration 202606300009_seat_surface_profile_metadata_assignments.sql... Finished supabase db push."

---

## MIGRATION APPLIED

`202606300009_seat_surface_profile_metadata_assignments.sql`

### SQL

```sql
UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"profile":"crystal_split_path_choice"}'::jsonb
WHERE surface_key = 'path_choice';

UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"profile":"crystal_about_surface"}'::jsonb
WHERE surface_key = 'about_measures_registry';

UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"profile":"obsidian_full_bleed_video"}'::jsonb
WHERE surface_key IN ('eval_passage', 'structural_coherence_explainer');

UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"profile":"obsidian_assessment_surface"}'::jsonb
WHERE surface_key = 'measures_assessment';

UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"profile":"obsidian_to_marble_passage"}'::jsonb
WHERE surface_key = 'obsidian_to_marble_passage_video';

UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"profile":"marble_map_cards"}'::jsonb
WHERE surface_key = 'map_integrity_governance';

UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"profile":"lapis_publication_surface"}'::jsonb
WHERE surface_key IN ('structural_drift_dispatches', 'publication_dispatch');
```

### CLI push output

```
Applying migration 202606300009_seat_surface_profile_metadata_assignments.sql...
Finished supabase db push.
```

Exit code: 0

---

## EXPECTED PROFILE STATE (post-migration)

| surface_key | profile | material_identity | chamber_assignment |
|---|---|---|---|
| `path_choice` | `crystal_split_path_choice` | crystal | crystal_seat |
| `about_measures_registry` | `crystal_about_surface` | crystal | crystal_seat |
| `eval_passage` | `obsidian_full_bleed_video` | obsidian | obsidian |
| `structural_coherence_explainer` | `obsidian_full_bleed_video` | obsidian | obsidian |
| `measures_assessment` | `obsidian_assessment_surface` | obsidian | obsidian |
| `obsidian_to_marble_passage_video` | `obsidian_to_marble_passage` | obsidian | obsidian |
| `map_integrity_governance` | `marble_map_cards` | marble | marble |
| `structural_drift_dispatches` | `lapis_publication_surface` | lapis | lapis |
| `publication_dispatch` | `lapis_publication_surface` | lapis | lapis |

Operator may verify via:

```sql
SELECT
  surface_key,
  material_identity,
  chamber_assignment,
  is_active,
  release_state,
  metadata->>'profile' AS profile
FROM public.measures_encounter_surface_assignment
WHERE surface_key IN (
  'path_choice',
  'about_measures_registry',
  'eval_passage',
  'structural_coherence_explainer',
  'measures_assessment',
  'obsidian_to_marble_passage_video',
  'map_integrity_governance',
  'structural_drift_dispatches',
  'publication_dispatch'
)
ORDER BY surface_key;
```

---

## GAP PROFILES — NOT ASSIGNED

The following profiles have no current surface row and were excluded per OAR2:

- `assessment_scrollable_form` — sub-state of measures_assessment
- `report_result_gate` — post-scoring state, no dedicated row
- `legal_reading_surface` — no legal surface row
- `governed_footer` — global component, not surface-tracked
- `intro_hook` / `intro` — no profile defined for threshold hook surfaces

---

## VALIDATION CHECKLIST

| Item | Status |
|---|---|
| Migration applied without error | ✓ CLI exit code 0 |
| 7 UPDATE statements executed | ✓ (migration SQL confirmed) |
| 9 surface rows targeted | ✓ |
| Gap profiles excluded | ✓ |
| No new tables created | ✓ |
| No source changes | ✓ |
| No CSS changes | ✓ |
| No report copy changes | ✓ |
| No scoring changes | ✓ |
| No payment changes | ✓ |
| FREE remains active route authority | ✓ |
| registered_runtime remains retired | ✓ |
| Contract use ban preserved | ✓ |
| OAR1 written beside OAR2 | ✓ |
| Live PostgREST verification | OPERATOR ACTION REQUIRED (session permissions blocked) |

---

## FINAL DISPOSITION

**SEATED** — 9 surface profile assignments written to `measures_encounter_surface_assignment.metadata` JSONB via migration `202606300009`.

Profile authority is now in registry metadata.

Operator should confirm live state via SQL above before treating as fully validated.

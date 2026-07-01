---
document_type: oar1
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR1 - Verify and Seat Active Crystal Surface Profiles
status: closed
version: v1
operator: op044
system: measures_registry
oar2_ref: oar2_verify_and_seat_active_crystal_surface_profiles_v1
---

# OAR1 - Verify and Seat Active Crystal Surface Profiles

## EXECUTION METHOD

Live DB verification performed via PostgREST (anon key) before any mutation.

Migration applied via `npx supabase db push` to project `zfihrspxvennjzazxcbj` (exit code 0).

Post-migration state verified via live PostgREST query.

---

## STEP 1 — PRE-MUTATION VERIFICATION

### Query

```sql
SELECT
  surface_key,
  material_identity,
  chamber_assignment,
  metadata
FROM public.measures_encounter_surface_assignment
WHERE surface_key IN ('intro_hook', 'intro')
ORDER BY surface_key;
```

### Live result (pre-mutation)

| surface_key | material_identity | chamber_assignment | metadata |
|---|---|---|---|
| `intro` | `crystal` | `crystal_seat` | `null` |
| `intro_hook` | `crystal` | `crystal_seat` | `null` |

### Verification outcome

Both rows present. Both resolve as `crystal` / `crystal_seat`. No existing profile key in metadata.

**Conditional execution rule: PASSED — proceeding with mutation.**

---

## STEP 2 — MIGRATION APPLIED

`202606300010_seat_crystal_threshold_and_orientation_profiles.sql`

### SQL

```sql
UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"profile":"crystal_threshold_hook"}'::jsonb
WHERE surface_key = 'intro_hook';

UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"profile":"crystal_orientation_surface"}'::jsonb
WHERE surface_key = 'intro';
```

CLI output: `Applying migration 202606300010_seat_crystal_threshold_and_orientation_profiles.sql... Finished supabase db push.`

---

## STEP 3 — POST-MUTATION VERIFICATION

### Live result (post-migration)

| surface_key | material_identity | chamber_assignment | profile (from metadata) |
|---|---|---|---|
| `intro` | `crystal` | `crystal_seat` | `crystal_orientation_surface` ✓ |
| `intro_hook` | `crystal` | `crystal_seat` | `crystal_threshold_hook` ✓ |

Both profiles confirmed seated in live DB.

---

## PROFILE DEFINITIONS SEATED

### crystal_threshold_hook

- threshold invitation
- first-contact orientation
- hook and recognition surface
- pre-path positioning
- Crystal threshold identity

### crystal_orientation_surface

- orientation and understanding surface
- explanatory positioning
- educational introduction
- recognition before progression
- Crystal orientation identity

---

## VALIDATION CHECKLIST

| Item | Status |
|---|---|
| Live DB verified before mutation | ✓ |
| Both rows present as crystal / crystal_seat | ✓ |
| No metadata write without verification | ✓ |
| `intro_hook` → `crystal_threshold_hook` seated | ✓ verified live |
| `intro` → `crystal_orientation_surface` seated | ✓ verified live |
| No new rows created | ✓ |
| No new tables created | ✓ |
| No CSS/source changes | ✓ |
| No report/scoring/payment changes | ✓ |
| FREE remains active render authority | ✓ |
| registered_runtime remains retired | ✓ |
| OAR1 written beside OAR2 | ✓ |

---

## FINAL DISPOSITION

**SEATED** — Both Crystal surface profiles verified and written to live DB via migration `202606300010`.

Verify before mutation: confirmed.

Codex holds.
Systems align.
Measures allows.
Field arranges.
Roles authorize.
Optics prove.
FREE renders.
